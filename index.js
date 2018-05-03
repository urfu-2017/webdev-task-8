/* eslint-disable no-undef */
const express = require('express');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.use(express.static(path.resolve(__dirname, './static')));

const server = app.listen(8080, () => {
    const { address, port } = server.address();
    console.info(`Сервер запущен по адресу http://${address}:${port}`);
});
