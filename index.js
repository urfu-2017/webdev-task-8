'use strict';
/* eslint-disable */
const path = require('path');
const express = require('express');
const app = express();

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(3000, () => console.info(`Server is listening on http://localhost:${3000}`));

module.exports = app;
