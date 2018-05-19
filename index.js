'use strict';

const path = require('path');
const express = require('express');

const port = 80;
const app = express();

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => console.info(`listening on ${port}`));

module.exports = app;
