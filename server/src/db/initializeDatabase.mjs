import {v4 as uuidv4} from "uuid";
import sqlite from "sqlite3";
import crypto from "crypto";
import UserType from "../components/userType.mjs";
import DocumentConnectionType from "../components/documentConnectionType.mjs";

const database = new sqlite.Database('./src/db/db.db', (err) => {
    if (err) throw err;
});

// Helper function to run SQL queries
const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        database.run(sql, params, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

const documents = [
    {
        id: "doc1",
        title: "City Transformation Plan 2024",
        description: "Master plan for Kiruna city transformation",
        scale: "1:500",
        issuanceDate: "15-01-2024",
        type: "Prescriptive",
        language: "English",
        coordinates: {},
        area: [
            [67.8598, 20.2092],
            [67.8522, 20.1970],
            [67.8677, 20.2439],
        ],
        stakeholders: ["Municipality", "LKAB"]
    },
    {
        id: "doc2",
        title: "LKAB Mining Impact Assessment",
        description: "Analysis of mining activities impact on urban infrastructure",
        scale: "1:5000",
        issuanceDate: "01-02-2024",
        type: "Technical",
        language: "Swedish",
        coordinates: {},
        area: [
            [67.8608, 20.2050],
            [67.8530, 20.1900],
            [67.8685, 20.2400],
        ],
        stakeholders: ["LKAB", "Regional Authority"]
    },
    {
        id: "doc3",
        title: "New Kiruna Center Development",
        description: "Detailed plans for the new city center development",
        scale: "1:50000",
        issuanceDate: "15-02-2024",
        type: "Design",
        language: "English",
        coordinates: {
            lat: 67.8490,
            lng: 20.2459
        },
        area: [],
        stakeholders: ["Municipality", "Architecture Firms"]
    },
    {
        id: "doc4",
        title: "Community Consultation Results",
        description: "Results from community engagement sessions",
        scale: "1:1000",
        issuanceDate: "20-02-2024",
        type: "Consultation",
        language: "Swedish",
        coordinates: {
            lat: 67.8575,
            lng: 20.2256
        },
        area: [],
        stakeholders: ["Citizens", "Municipality"]
    },
    {
        id: "doc5",
        title: "Environmental Impact Study",
        description: "Environmental assessment of city relocation",
        scale: "1:10000",
        issuanceDate: "01-03-2024",
        type: "Technical",
        language: "English",
        coordinates: {
            lat: 67.8516,
            lng: 20.2371
        },
        area: [],
        stakeholders: ["Regional Authority"]
    }
];

async function populateUserTable() {
    await run("DELETE FROM User");
    const users = [
        {username: "resident", password: "102030", role: UserType.RESIDENT},
        {username: "visitor", password: "405060", role: UserType.VISITOR},
        {username: "urban_planner", password: "708090", role: UserType.URBAN_PLANNER},
    ];

    for (const user of users) {
        const {username, password, role} = user;
        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = crypto.scryptSync(password, salt, 16).toString("hex");
        await run(
            "INSERT INTO User (id, username, password, role, salt) VALUES (?, ?, ?, ?, ?)",
            [uuidv4(), username, hashedPassword, role, salt]
        );
    }
}

async function populateDocumentTable() {
    await run("DELETE FROM Document");
    for (const doc of documents) {
        await run(
            `INSERT INTO Document (id, title, description, scale, issuanceDate, type, language, coordinates, area)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                doc.id,
                doc.title,
                doc.description,
                doc.scale,
                doc.issuanceDate,
                doc.type,
                doc.language,
                JSON.stringify(doc.coordinates),
                JSON.stringify(doc.area)
            ]
        );
    }
}

async function populateDocumentConnectionTable() {
    await run("DELETE FROM DocumentConnection");
    const connections = [
        {
            id: "conn1",
            documentId: "doc1",
            connectionId: "doc2",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn2",
            documentId: "doc2",
            connectionId: "doc3",
            type: DocumentConnectionType.COLLATERAL_CONSEQUENCE
        },
        {
            id: "conn3",
            documentId: "doc3",
            connectionId: "doc4",
            type: DocumentConnectionType.UPDATE
        },
        {
            id: "conn4",
            documentId: "doc1",
            connectionId: "doc5",
            type: DocumentConnectionType.PROJECTION
        }
    ];
    for (const conn of connections) {
        await run(
            `INSERT INTO DocumentConnection (id, documentId, connectionId, type)
                 VALUES (?, ?, ?, ?)`,
            [conn.id, conn.documentId, conn.connectionId, conn.type]
        );
    }
}

async function populateDocumentStakeholderTable() {
    await run("DELETE FROM DocumentStakeholder");
    for (const doc of documents) {
        for (const stakeholder of doc.stakeholders) {
            const stakeholderId = `${doc.id}-${stakeholder}`.toLowerCase().replace(/\s+/g, '-');
            await run(
                `INSERT INTO DocumentStakeholder (id, documentId, stakeholder) 
                     VALUES (?, ?, ?)`,
                [stakeholderId, doc.id, stakeholder]
            );
        }
    }
}

async function populateStakeholderTable() {
    await run("DELETE FROM Stakeholder");
    const stakeholders = ["Municipality", "LKAB", "Regional Authority", "Architecture Firms", "Citizens"];
    for (const name of stakeholders) {
        await run(
            `INSERT INTO Stakeholder (id, name) VALUES (?,?)`,
            [uuidv4(), name]
        );
    }
}

async function populateTypeTable() {
    await run("DELETE FROM Type");
    const Types = ["Prescriptive", "Technical", "Design", "Consultation"];
    for (const name of Types) {
        await run(
            `INSERT INTO Type (id, name) VALUES (?,?)`,
            [uuidv4(), name]
        );
    }
}

async function populateScaleTable() {
    await run("DELETE FROM Scale");
    const Scales = ["1:500", "1:5000", "1:50000", "1:1000", "1:10000"];
    for (const name of Scales) {
        await run(
            `INSERT INTO Scale (id, name) VALUES (?,?)`,
            [uuidv4(), name]
        );
    }
}

async function setConnectionCount() {
    await run(`
        UPDATE Document
        SET connections = (
            SELECT COUNT(*)
            FROM DocumentConnection
            WHERE documentId = Document.id OR connectionId = Document.id
            )
        `);
}

async function initializeDatabase() {
    try {
        await populateUserTable();
        await populateDocumentTable();
        await populateDocumentConnectionTable();
        await populateDocumentStakeholderTable();
        await populateStakeholderTable();
        await populateTypeTable();
        await populateScaleTable();
        await setConnectionCount();
        console.log("Database initialized successfully with test data");
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    } finally {
        database.close();
    }
}

export default initializeDatabase;