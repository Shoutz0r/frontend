<template>
    <div class="row row-cards">
        <div class="col-sm-12">
            <information-header :image="artist?.image || defaultArtistImage" class="artist-header">
                <template v-if="loading">
                    <p class="placeholder placeholder-wave placeholder-lg col-sm-12 col-lg-8"></p>
                    <span class="placeholder placeholder-wave placeholder-sm col-sm-8 col-lg-5"></span>
                </template>
                <template v-else>
                    <h3>{{ artist.name }}</h3>

                    <div class="d-flex align-items-center mt-auto" v-if="artist.summary">
                        {{ artist.summary }}
                    </div>
                </template>
            </information-header>
        </div>
    </div>
    <div class="row row-cards">
        <div class="col-sm-12 col-lg-6">
            <h2 class="category-header">Most Requested</h2>
            <popular-media :artist="id" />
        </div>
        <div class="col-sm-12 col-lg-6">
            <h2 class="category-header">Top Albums</h2>
            <popular-albums :artist="id" />
        </div>
    </div>
</template>

<script>
import InformationHeader from "@components/InformationHeader.vue";
import {defaultArtistImage} from "@js/config.js";
import PopularMedia from "@components/PopularMedia.vue";
import {useQuery} from "@vue/apollo-composable";
import {ARTIST_QUERY} from "@graphql/artist.js";
import PopularAlbums from "@components/PopularAlbums.vue";

export default {
    name: "artist-view",
    components: {
        PopularAlbums,
        PopularMedia,
        InformationHeader
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            defaultArtistImage,
            loading: true,
            result: null,
            refetch: null
        }
    },
    computed: {
        artist() {
            return this.result?.artist ?? null;
        }
    },
    mounted() {
        const {
            loading,
            result,
            refetch
        } = useQuery(ARTIST_QUERY, () => {
            return {
                id: this.id
            };
        });

        this.loading = loading;
        this.result = result;
        this.refetch = refetch;
    }
};
</script>
