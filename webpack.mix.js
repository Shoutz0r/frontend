const mix = require('laravel-mix');
require('laravel-mix-purgecss');

mix.webpackConfig({
    resolve: {
        extensions: ['.js', '.vue', '.json', '.scss', '.sass', '.css'],
        alias: {
            '@components': __dirname + '/resources/components',
            '@js': __dirname + '/resources/js',
            '@models': __dirname + '/resources/js/models',
            '@scss': __dirname + '/resources/scss',
            '@static': __dirname + '/resources/static',
            '@graphql': __dirname + '/resources/js/graphql',
        },
        fallback: {
            "stream": require.resolve("stream-browserify")
        }
    }
});

mix.override(config => {
    config.module.rules.push({
        test: /\.vue$/,
        use: [
            "vue-svg-inline-loader",
        ]
    })
})

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.js('resources/js/app.js', 'public/js')
    .vue({
        globalStyles: __dirname + '/resources/scss/_theme.scss',
    })
    .sass('resources/scss/app.scss', 'public/css')
    .purgeCss({
        enabled: true,
        // Some of our CSS is not properly detected, thus requiring whitelisting.
        safelist: [
            /^dropdown/,
            /^alert/,
            /^toast/,
            /^modal/,
            /^bg-/, // .bg-<color> classes
            /data-bs-popper/, //Some bootstrap classes are generated with this data tag
            /^ps/, // vue-perfect-scrollbar classes
            /^router-link/, //All router-link classes are generated with JS
            /^vue-slider/ // vue-slider classes
        ]
    });

mix.copy('resources/static/images/shoutzor-logo.svg', 'public/images');
mix.copy('resources/static/images/appicon', 'public/images/appicon');
mix.copy('resources/static/fonts', 'public/fonts');

if (mix.inProduction()) {
    mix.version();
}
