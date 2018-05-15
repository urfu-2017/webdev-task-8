'use strict';

const express = require('express');
const path = require('path');

const config = require('./config.json');

const app = express();
app.use(express.static('public'));
app.get('*', (req, res) => res.sendFile(path.join(`${__dirname}/public/index.html`)));

// eslint-disable-next-line no-console
app.listen(config.PORT, () => console.log(`Приложение работает по ${config.PORT} порту`));
