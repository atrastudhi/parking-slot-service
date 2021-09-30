const config = require('./src/config');

module.exports = {
  client: 'pg',
  connection: {
    database: config.knex.database,
    user: config.knex.user,
    password: process.env.PG_PASSWORD,
    host: config.knex.host,
    port: config.knex.port,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
