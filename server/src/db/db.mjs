import sqlite3 from "sqlite3";

let env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "development";

// The database file path is determined based on the environment variable.
const dbFilePath = env === "test" ? "./src/database/testdb.db" : "./src/database/db.db";

// The database is created and the foreign keys are enabled.
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) throw err;
    db.run("PRAGMA foreign_keys = ON");
});

export default db;