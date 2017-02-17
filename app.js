const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const db = require('./db');

let app = express();



app.get('/', (req, res) => {
    let cb = (err, data) => {
        if (err)
            console.log(err);

        // res.send(data);
        res.status('200').json(data);
    };

    db.connect(db.MODE_TEST, () => {
        db.getAll(cb);
    })
});

app.get('/add_data', (req, res) => {
        let json = fs.readFile('db.json', (err, data) => {
                if (err) {
                    throw err;
                }
                let dataAsSJSON = JSON.parse(data);
            db.connect(db.MODE_TEST, () => db.fixtures(dataAsSJSON, (data) => {
                res.send(data);
                console.log('data has been loaded');
            }));

        })
    }
);

app.listen(3003, function () {
  console.log('Example app listening on port 3003!')
});
