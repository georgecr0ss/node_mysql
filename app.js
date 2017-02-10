const express = require('express');
const mysql = require('mysql');
const db = require('./db');

let app = express();

app.get('/', function (req, res) {
    let cb = (data) => {
        console.warn(data);
        res.send(data);
    };

    db.connect(db.MODE_TEST, () => {
        db.getAll(cb);
    })
});

app.listen(3003, function () {
  console.log('Example app listening on port 3003!')
});
