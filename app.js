const express = require('express');
const mysql = require('mysql');

let app = express();

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '6666',
    database: "sys"
});

connection.connect(err => {
    if (err)
        throw err;
    console.log('we are connected');

    connection.query('SELECT * FROM employees', (err, result) => {
        if (err)
            throw err;
            console.log(result);
    })
})

app.get('/', function (req, res) {
    console.warn(33333);
})

app.listen(3003, function () {
  console.log('Example app listening on port 3003!')
})
