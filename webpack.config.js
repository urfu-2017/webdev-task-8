const path = require('path');

module.exports = {
    entry: ['./client/app.js'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: require.resolve('snapsvg/dist/snap.svg.js'),
                use: 'imports-loader?this=>window,fix=>module.exports=0'
            }
        ]
    },
    resolve: {
        alias: {
            snapsvg: 'snapsvg/dist/snap.svg.js'
        }
    },
    output: {
        path: path.resolve(__dirname, 'static', 'dist'),
        filename: 'app.js'
    }
};
