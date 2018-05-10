'use strict';

/* eslint-disable no-undef */
const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const staticFolderPath = path.join(__dirname, 'static');

app.prepare().then(() => {
    const server = express();
    server.use(express.static(staticFolderPath));
    server.get('*', (req, res) => {
        app.render(req, res, '/index');
    });

    server.listen(3000, (err) => {
        if (err) {
            throw err;
        }
        console.info('> Ready on http://localhost:3000');
    });
});

