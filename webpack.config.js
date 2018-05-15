'use strict';

const path = require('path');


module.exports = {
    entry: './public/index.js',
    output: {
        path: path.resolve(__dirname, 'public', './'),
        filename: 'assembledIndex.js'
    },
    // https://github.com/adobe-webplatform/Snap.svg/issues/483
    module: {
        rules: [
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
    }
};
