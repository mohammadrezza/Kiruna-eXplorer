import sqlite from "sqlite3";
import crypto from "crypto";
import UserType from "../components/userType.mjs";

const database = new sqlite.Database('./db.db', (err) => {
    if (err) throw err;
});

const users = [
    {username: "resident", password: "102030", role: UserType.RESIDENT},
    {username: "visitor", password: "405060", role: UserType.VISITOR},
    {username: "urban_planner", password: "708090", role: UserType.URBAN_PLANNER},
]

await new Promise((resolve, reject) => {
    database.run("DELETE FROM User", [],
        (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
})

for (const user of users) {
    const {username, password, role} = user;
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.scryptSync(password, salt, 16).toString("hex");
    await new Promise((resolve, reject) => {
        database.run("INSERT INTO User (username, password, role, salt) VALUES (?, ?, ?, ?)",
            [username, hashedPassword, role, salt],
            (err) => {
                if (err) {
                    reject(err);
                }
                resolve()
            });
    })
}