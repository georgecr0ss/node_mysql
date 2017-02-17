const mysql = require('mysql');
const async = require('async');

const PROD_DB = 'production';
const TEST_DB = 'test';

 const MODE_TEST = 'mode_test'
 const MODE_PRODUCTION = 'mode_production'

let state = {
    pool: null,
    mode: null
};

let connect = (mode, done) => {
    state.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '6666',
        database: mode === MODE_PRODUCTION ? PROD_DB : TEST_DB
    });

    state.mode = mode;
    done();
};

let get = () => state.pool;

let fixtures = (data, done) => {
  let tables = {};
      tables['tables'] = data;

  let pool = state.pool
  if (!pool) {
    return done(new Error('Missing database connection.'));
  }

  let names = Object.keys(tables.tables);

  async.each(names, function(name, cb) {
    async.each(tables.tables[name], function(row, cb) {
      let keys = Object.keys(row)
        , values = keys.map(function(key) {
          if(key === 'department_id') {
            return Math.floor(Math.random() * 6) + 1
          }

          return "'" + row[key] + "'" ;
        })
      pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
    }, cb)
  }, done);
};

let getAll = (cb) => {
  let pool = state.pool
  if (!pool) {
    return done(new Error('Missing database connection.'));
  }

  pool.query(`SELECT users.first_name, users.last_name, users.email, departments.department
              FROM test.users
              inner join test.departments
              on users.department_id = departments.id
              `, (err, res) => {
                cb(err, res);
              })
};

let drop = (tables, done) => {
  let pool = state.pool;
  if (!pool) {
    return done(new Error('Missing database connection.'));
  }

  async.each(tables, (name, cb) =>  {
    pool.query('DELETE * FROM ' + name, cb)
  }, done);
};

module.exports = {
  connect,
  drop,
  getAll,
  get,
  fixtures,
  MODE_TEST,
  MODE_PRODUCTION
};


