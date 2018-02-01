const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = [ {
    entry: './src/index.js',
    output: {
        filename: './dist/css-line-break.min.js',
        library: 'css-line-break',
        libraryTarget: 'umd'
    },
    plugins: [
        new UglifyJsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
} ];
