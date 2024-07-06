const Datastore = require('nedb');
const path = require('path');

const dbFilePath = path.resolve(__dirname, 'blog.db');
const db = new Datastore({filename: dbFilePath, autoload: true});

module.exports = db;