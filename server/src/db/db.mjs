import sqlite3 from "sqlite3";

let env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "development";

// The database file path is determined based on the environment variable.
const dbFilePath = env === "test" ? "./src/db/testdb.db" : "./src/db/db.db";

// The database is created and the foreign keys are enabled.
const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) throw err;
  db.run("PRAGMA foreign_keys = ON");
});

/**
 * Inserts a new document in `documents`.
 * @param {string} title - Titolo del documento.
 *
 * @returns {Promise} - Restituisce una promise risolta al completamento dell'inserimento.
 */

export function addDocument(
  id,
  title,
  stakeholders,
  scale,
  issuanceDate,
  type,
  language,
  coordinates,
  connections
) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Document (id, title, stakeholders, scale, issuanceDate, type, language, coordinates, connections) VALUES (?,?,?,?,?,?,?,?,?)";
    db.run(
      query,
      [
        id,
        title,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connections,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}
export default db;
