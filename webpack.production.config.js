const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: require.resolve('snapsvg'),
                loader: 'imports-loader?this=>window,fix=>module.exports=0'
            }
        ]
    },
    output: {
        filename: './build/app.bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html'
        })
    ]

};
