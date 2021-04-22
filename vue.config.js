// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin;
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require("path");

module.exports = {
    productionSourceMap: process.env.NODE_ENV !== "production",
    configureWebpack: {
        plugins: [
            // new BundleAnalyzerPlugin()
            new SWPrecacheWebpackPlugin({
                cacheId: 'crypto-lib-v1',
                filename: 'sw.js',
                minify: true,
                mergeStaticsConfig: true, // if you don't set this to true, you won't see any webpack-emitted assets in your serviceworker config
                staticFileGlobsIgnorePatterns: [/\.map$/], // use this to ignore sourcemap files
            }),
            new WebpackPwaManifest({
                name: 'Crypto WorkShop',
                short_name: 'CryptoWS',
                description: 'A Handy crypto lab on your palm!',
                background_color: '#ffffff',
                ios: true,
                icons: [
                    {
                        src: path.resolve('public/favicon.png'),
                        sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
                        ios: true,
                        purpose: 'maskable'
                    }
                ]
            })
        ]
    }
}