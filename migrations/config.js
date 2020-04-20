/* eslint-disable quotes */
const app = require("../src/app");
const env = process.env.NODE_ENV || "development";
const dialect = "postgres";
const { database, username, password, host ,port} = app.get('postgres');

const target = {
  dialect,
  migrationStorageTableName: '_migrations'
};

const source =  process.env.DATABASE_URL?{
  url: process.env.DATABASE_URL,
}:{
  port,
  database,
  username,
  password,
  host,
};

const returnedTarget = Object.assign(target, source);
// console.log(returnedTarget);

module.exports = {
  [env]: returnedTarget
};
