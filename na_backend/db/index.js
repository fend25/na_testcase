const log = require(`../log`).db

const sqlite = require(`sqlite`)

const knex = require('knex')({client: 'sqlite3'})

const schemaQuery = `create table "order" (
	orderId text PRIMARY KEY,
  departureDate text, 
  city1 text, 
  city2 text, 
  agent text, 
  amount integer
)`

const DB_FILE = `./nordavia.sqlite`

module.exports = {
  knex,
  sqlite,
  schemaQuery,
  DB_FILE
}

