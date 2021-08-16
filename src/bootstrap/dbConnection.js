const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const buildSchemas = require('../schemas');

class DatabaseConnection {
  constructor() {
    this.databaseConnection = open({
      filename: '/tmp/database.db',
      driver: sqlite3.Database,
    });
  }

  getDatabase() {
    return this.databaseConnection;
  }
}

module.exports = new DatabaseConnection();
let db;

const initDatabase = async () => {
  // open the database
  db = await open({
    filename: ':memory:',
    driver: sqlite3.Database,
  });
  buildSchemas(db);
  return db;
};

const getDatabase = () => {
  if (!db) {
    throw new Error('DB Connection is not initalized yet');
  }
  return db;
};

module.exports = { initDatabase, getDatabase };
