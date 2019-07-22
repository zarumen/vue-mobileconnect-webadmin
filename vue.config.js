const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const webpack = require('webpack')
const appConfig = require('./src/app.config')

module.exports = {
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  },
  transpileDependencies:['vuetify'],
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
      // eslint-disable-next-line no-useless-escape
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|th/),
      new VuetifyLoaderPlugin({
        /**
         * This function will be called for every tag used in each vue component
         * It should return an array, the first element will be inserted into the
         * components array, the second should be a corresponding import
         *
         * originalTag - the tag as it was originally used in the template
         * kebabTag    - the tag normalised to kebab-case
         * camelTag    - the tag normalised to PascalCase
         * path        - a relative path to the current .vue file
         * component   - a parsed representation of the current component
         */
        match (originalTag, { kebabTag, camelTag, path, component }) {
          if (kebabTag.startsWith('_base-')) {
            return [camelTag, `import ${camelTag} from '@/components/${kebabTag}.vue'`]
          }
        }
      })
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
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        fiber: require('fibers')
      }
    }
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
}
