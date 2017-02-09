const mysql = require('mysql');
const async = require('async');

const PROD_DB = 'app_production_database';
const TEST_DB = 'app_test_database';

let state = {
    pool: null,
    mode: null
};

let connect = (mode, done) => {
    state.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '6666',
        database: mode === PROD_DB ? PROD_DB : TEST_DB
    });

    state.mode = mode;
    done();
};

let get = () => state.pool;

let fixtures = data => {
  let pool = state.pool
  if (!pool) {
    return done(new Error('Missing database connection.'));
  }

  let names = Object.keys(data.tables);
  async.each(names, function(name, cb) {
    async.each(data.tables[name], function(row, cb) {
      let keys = Object.keys(row)
        , values = keys.map(function(key) { return "'" + row[key] + "'" })

      pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
    }, cb)
  }, done);
}


