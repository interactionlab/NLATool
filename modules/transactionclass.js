let Tag = 'transactionclass.js: ';


const mysql = require('mysql');
const dbAction = require('./db_actions');
const dbStub = require('./db_stub');
const wait = require('wait.for');
const jsonAction = require('./json_actions');

let Transaction = class Transaction{
      constructor(connection){
          this.querys = {};
          this.connection = connection;
      }

      transact(){
          this.connection.beginTransaction(function(err){
              if (err){throw err;}
          });
      }



      get allQuerys(){
          return this.querys;
      }
      setNewConnection(conn){
          this.connection = conn;
      }



    connection.beginTransaction(function(err) {
        if (err) { throw err; }
        connection.query('INSERT INTO posts SET title=?', title, function (error, results, fields) {
            if (error) {
                return connection.rollback(function() {
                    throw error;
                });
            }

            var log = 'Post ' + results.insertId + ' added';

            connection.query('INSERT INTO log SET data=?', log, function (error, results, fields) {
                if (error) {
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                connection.commit(function(err) {
                    if (err) {
                        return connection.rollback(function() {
                            throw err;
                        });
                    }
                    console.log('success!');
                });
            });
        });
    });
};