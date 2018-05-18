/* eslint-disable no-undef */
const express = require('express');
const app = express();

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(8080, () => console.info('Running on 8080 port'));
