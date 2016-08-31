var path = require('path');

var dir_js = path.resolve(__dirname, 'src');
var dir_build = path.resolve(__dirname, 'public/assets');

module.exports = {
    entry: path.resolve(dir_js, 'index.js'),
    output: {
        path: dir_build,
        filename: 'index.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    plugins: [],
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
    devServer: {
        contentBase: dir_build,
    },
};
