/* eslint-disable */
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: "fonts/[name].[ext]",
                },
            }
        ]
    }
};