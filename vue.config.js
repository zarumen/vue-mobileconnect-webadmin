const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const appConfig = require('./src/app.config')

module.exports = {
  configureWebpack: {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: appConfig.title,
    // mode: 'production',
    // Set up all the aliases we use in our app.
    resolve: {
      alias: require('./aliases.config').webpack,
    },
    plugins: [
      // Optionally produce a bundle analysis
      // TODO: Remove once this feature is built into Vue CLI
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.ANALYZE ? 'static' : 'disabled',
        openAnalyzer: process.env.CI !== 'true',
      }),
    ],
    devtool: 'inline-source-map',
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
  },
  // Configure Webpack's dev server.
  // https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md
  devServer: {
    ...(process.env.API_BASE_URL
      ? // Proxy API endpoints to the production base URL.
        { proxy: { '/api': { target: process.env.API_BASE_URL } } }
      : // Proxy API endpoints a local mock API.
        { before: require('./tests/mock-api') }),
  },
  // pwa: {
  //   // configure the workbox plugin
  //   workboxPluginMode: 'GenerateSW',
  //   workboxOptions: {
  //       navigateFallback: '/index.html',
  //       // swSrc is required in InjectManifest mode.
  //       // swSrc: './src/utils/register-service-worker.js',
  //       // ...other Workbox options...
  //       runtimeCaching: [
  //         {
  //           urlPattern: new RegExp('^https://mobile-connect-sms.web.app/'),
  //           handler: 'networkFirst',
  //           options: {
  //             networkTimeoutSeconds: 20,
  //             cacheName: 'api-cache',
  //             cacheableResponse: {
  //               statuses: [0, 200]
  //             }
  //           }
  //         }
  //       ]
  //   }
  // }
}
