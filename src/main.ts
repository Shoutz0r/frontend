import axios from 'axios';
import Echo from 'laravel-echo';
import mitt from 'mitt';
import Pusher from 'pusher-js';
import { createApp } from 'vue'
import {BootstrapIconsPlugin} from 'bootstrap-icons-vue';
import {DefaultApolloClient, provideApolloClient} from '@vue/apollo-composable'
import {ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core'
import {createLighthouseSubscriptionLink} from "@thekonz/apollo-lighthouse-subscription-link";
import { createUploadLink } from 'apollo-upload-client';
import CustomFetch from '@js/helpers/ApolloUploadCustomFetch.js';
import { formatTime } from '@js/helpers/timeHelper';
import router from "@js/router";
import App from "@js/views/App.vue";
import { MessageBagParserPlugin } from "@js/plugins/MessageBagParser.js"
import { AuthenticationPlugin } from "@js/plugins/AuthenticationManager.js";
import { SettingsPlugin } from "@js/plugins/SettingsManager.js";
import { RequestManagerPlugin } from "@js/plugins/RequestManager.js";
import { MediaPlayerPlugin } from "@js/plugins/MediaPlayer.js";
import { BootstrapControlPlugin } from "@js/plugins/BootstrapControl.js";
import {UploadManagerPlugin} from "@js/plugins/UploadManager.js";
import { DocumentNode } from 'graphql/language/ast';
import { getOperationName } from "@apollo/client/utilities";
import { antiXSS } from '@js/plugins/SanitizationPlugin';

// Predefine instances
let emitter;
let echoClient : Echo;
let httpLink : HttpLink;
let apolloClient : ApolloClient<any>;

// Create the Vue App instance
const app = createApp(App);

// First, grab the API_URL we need to call (backend url)
fetch('/config.json')
    .then(res => {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject(res);
    })
    .then(backendConfig => {
        // Using the backend url, we can now call the frontend-config endpoint and fetch the config that the frontend
        // should use.
        return fetch(backendConfig.APP_URL + '/frontend-config')
            // Catch any Fetch errors, like missing CORS
            .catch(err => {
                return Promise.reject(
                    "Failed to fetch the frontend config from the backend, " +
                    "check the browser console for more information");
            })
            // Check the response of Fetch and handle any errors
            .then(async res => {
                // Response was ok, return the JSON
                if (res.ok) {
                    return res.json();
                }

                // An error occured, Check if the error response was JSON
                try {
                    const data = await res.json();

                    console.log("An error was received from the backend", data);

                    // Check if a "status" property exists, and is set to "NOT_INSTALLED"
                    // This would indicate the backend reporting that Shoutzor needs to be setup
                    if (data.status && data.status === "NOT_INSTALLED") {
                        console.error("The backend reports that Shoutzor is not installed yet.");

                        return Promise.reject(
                            "Shoutzor is not installed yet, please run the setup first. " +
                            "Check the documentation for more information.");
                    }
                } catch (error) {
                    // Response was not JSON, ignore and return general error
                }

                return Promise.reject(
                    "Failed to fetch the frontend config from the backend, " +
                    "check the browser console for more information");
            })
            // Response succeeded, continue loading the frontend
            .then(config => {
                // The UploadManager still uses Axios. Ideally this also should be replaced by GraphQL later on
                // Currently not the case because I haven't figured out how to track upload progress.
                axios.defaults.baseURL = config.APP_URL + '/api';
                axios.defaults.headers.common['Accept'] = 'application/json';

                emitter = mitt();
                (<any>window).Pusher = Pusher;

                echoClient = new Echo({
                    broadcaster: 'pusher',
                    key: config.PUSHER_APP_KEY,
                    wsHost: config.PUSHER_HOST,
                    wsPort: config.PUSHER_PORT,
                    wssPort: config.PUSHER_PORT,
                    forceTLS: config.PUSHER_SCHEME === 'https',
                    encrypted: true,
                    disableStats: true,
                    enabledTransports: ['ws', 'wss'],
                    authEndpoint: config.APP_URL + '/graphql/subscriptions/auth'
                });

                // HTTP connection to the API
                httpLink = createUploadLink({
                    uri: config.APP_URL + '/graphql',
                    fetch: CustomFetch
                });

                const authMiddleware = new ApolloLink((operation, forward) => {
                    // add the authorization to the headers
                    operation.setContext(() => {
                        const token = app?.config?.globalProperties?.auth?.token;
                        return {
                            headers: {
                                ...operation.getContext().headers,
                                authorization: (token) ? `Bearer ${token}` : null,
                            }
                        }
                    });

                    return forward(operation);
                })


                // Create the apollo client
                apolloClient = new ApolloClient({
                    link: ApolloLink.from([
                        authMiddleware,
                        createLighthouseSubscriptionLink(echoClient),
                        httpLink
                    ]),
                    cache: new InMemoryCache(),
                    connectToDevTools: config.APP_DEBUG,
                    defaultOptions: {
                        query: {
                            fetchPolicy: 'network-only'
                        }
                    }
                });

                app.provide(DefaultApolloClient, apolloClient);
                provideApolloClient(apolloClient);

                app.config.globalProperties.apollo = apolloClient;
                app.config.globalProperties.echo = echoClient;
                app.config.globalProperties.emitter = emitter;

                app.mixin({
                    methods: {
                        /**
                         * ensures no html can be embedded in a string
                         * @param input
                         * @returns
                         */
                        antiXSS(input: String) {
                            return antiXSS(input);
                        },

                        formatTime,

                        /**
                         * Helper function as workaround for @vue/apollo using an outdated
                         * version of @apollo/client; therefor not accepting a DocumentNode
                         * as `refetchQueries` parameter in `useMutation`.
                         * This helper function gets the query name from the DocumentNode.
                         * Once https://github.com/vuejs/apollo/issues/1427 is solved
                         * this helper function is no longer needed.
                         *
                         * @param query a gql DocumentNode object
                         * @returns the query name
                         */
                        getGqlQueryName(query: DocumentNode) {
                            return getOperationName(query);
                        }
                    }
                });

                app
                    .use(MessageBagParserPlugin)
                    .use(BootstrapControlPlugin)
                    .use(SettingsPlugin, {
                        apolloClient
                    })
                    .use(AuthenticationPlugin, {
                        tokenName: 'token',
                        echoClient,
                        httpClient: httpLink,
                        apolloClient
                    })
                    .use(router(app.config.globalProperties.auth))
                    .use(MediaPlayerPlugin, {
                        broadcastUrl: config.BROADCAST_URL,
                        apolloClient
                    })
                    .use(UploadManagerPlugin, {
                        apolloClient
                    })
                    .use(RequestManagerPlugin)
                    .use(BootstrapIconsPlugin);

                // Initialize our plugins where needed
                let settingsInitializePromise = app.config.globalProperties.settings.initialize();
                let authInitializePromise = app.config.globalProperties.auth.initialize();

                // Only continue once all prerequisites have finished successfully.
                return Promise.all([settingsInitializePromise, authInitializePromise])
                    .then(() => {
                        app.mount('#shoutzor');
                    });
            });
    })
    .catch(error => {
        console.error("An error occured while initializing", error);

        (<any>document).querySelector(".load-screen .center-block").innerHTML = '\
            <div class="alert alert-danger" role="alert">' +
                'An error occured while initializing; try reloading or contact an administrator.<br />' +
                '<strong>Error: </strong>' + error +
                (error?.stack ? '<br /><br /><strong>Stacktrace:</strong><br /><pre>' + error.stack + '</pre>' : '') +
            '</div>';
    });