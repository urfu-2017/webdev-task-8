'use strict';

const express = require('express');

const path = require('path');

const app = express();
app.use(express.static('public'));
app.get('*', (req, res) => res.sendFile(path.join(`${__dirname}/index.html`)));

app.listen(3000, () => console.info('server is listening on 3000 port'));
