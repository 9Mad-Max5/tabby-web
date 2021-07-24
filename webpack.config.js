const baseConfig = require('./webpack.base.config.js')
const path = require('path')
const { AngularWebpackPlugin } =  require('@ngtools/webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    name: 'browser',
    target: 'web',
    ...baseConfig,
    entry: {
    index: path.resolve(__dirname, 'src/index.ts'),
    terminal: path.resolve(__dirname, 'src/terminal.ts'),
    },
    plugins: [
    ...baseConfig.plugins,
    new AngularWebpackPlugin({
        tsconfig: 'tsconfig.json',
        directTemplateLoading: false,
        skipCodeGeneration: false,
    }),
    ],
    output: {
    path: path.join(__dirname, 'build'),
    pathinfo: true,
    publicPath: '/static/',
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    },
}

if (process.env.BUNDLE_ANALYZER) {
    module.exports[0].plugins.push(new BundleAnalyzerPlugin())
}
