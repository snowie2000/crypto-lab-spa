const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = {
    productionSourceMap: process.env.NODE_ENV !== "production",
    configureWebpack: {
        plugins: [
            new BundleAnalyzerPlugin()
        ]
    }
}