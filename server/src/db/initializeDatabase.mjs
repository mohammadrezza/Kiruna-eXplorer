import sqlite from "sqlite3";
import crypto from "crypto";
import DocumentType from "../components/documentType.mjs";
import Stakeholder from "../components/stakeholder.mjs";
import UserType from "../components/userType.mjs";
import DocumentConnectionType from "../components/documentConnectionType.mjs";

const initializeDatabase = async () => {
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

    try {
        // Clear all existing data
        await run("DELETE FROM DocumentConnection");
        await run("DELETE FROM DocumentStakeholder");
        await run("DELETE FROM Document");
        await run("DELETE FROM User");

        // Insert users
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
                "INSERT INTO User (username, password, role, salt) VALUES (?, ?, ?, ?)",
                [username, hashedPassword, role, salt]
            );
        }

        // Insert sample documents with Kiruna-specific coordinates
        const documents = [
            {
                id: "doc1",
                title: "City Transformation Plan 2024",
                description: "Master plan for Kiruna city transformation",
                scale: "1:500",
                issuanceDate: "15-01-2024",
                type: DocumentType.PRESCRIPTIVE_DOCUMENT,
                language: "English",
                coordinates: {
                    lat: 67.8558,
                    lng: 20.2253
                },
                stakeholders: [Stakeholder.MUNICIPALITY, Stakeholder.LKAB]
            },
            {
                id: "doc2",
                title: "LKAB Mining Impact Assessment",
                description: "Analysis of mining activities impact on urban infrastructure",
                scale: "1:5000",
                issuanceDate: "01-02-2024",
                type: DocumentType.TECHNICAL_DOCUMENT,
                language: "Swedish",
                coordinates: {
                    lat: 67.8504,
                    lng: 20.1761
                },
                stakeholders: [Stakeholder.LKAB, Stakeholder.REGIONAL_AUTHORITY]
            },
            {
                id: "doc3",
                title: "New Kiruna Center Development",
                description: "Detailed plans for the new city center development",
                scale: "1:50000",
                issuanceDate: "15-02-2024",
                type: DocumentType.DESIGN_DOCUMENT,
                language: "English",
                coordinates: {
                    lat: 67.8490,
                    lng: 20.2459
                },
                stakeholders: [Stakeholder.MUNICIPALITY, Stakeholder.ARCHITECTURE_FIRMS]
            },
            {
                id: "doc4",
                title: "Community Consultation Results",
                description: "Results from community engagement sessions",
                scale: "1:1000",
                issuanceDate: "20-02-2024",
                type: DocumentType.CONSULTATION,
                language: "Swedish",
                coordinates: {
                    lat: 67.8575,
                    lng: 20.2256
                },
                stakeholders: [Stakeholder.CITIZENS, Stakeholder.MUNICIPALITY]
            },
            {
                id: "doc5",
                title: "Environmental Impact Study",
                description: "Environmental assessment of city relocation",
                scale: "1:10000",
                issuanceDate: "01-03-2024",
                type: DocumentType.TECHNICAL_DOCUMENT,
                language: "English",
                coordinates: {
                    lat: 67.8516,
                    lng: 20.2371
                },
                stakeholders: [Stakeholder.REGIONAL_AUTHORITY, Stakeholder.OTHERS]
            }
        ];

        // Insert documents
        for (const doc of documents) {
            await run(
                `INSERT INTO Document (id, title, description, scale, issuanceDate, type, language, coordinates)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    doc.id,
                    doc.title,
                    doc.description,
                    doc.scale,
                    doc.issuanceDate,
                    doc.type,
                    doc.language,
                    JSON.stringify(doc.coordinates)
                ]
            );

            // Insert document stakeholders
            for (const stakeholder of doc.stakeholders) {
                const stakeholderId = `${doc.id}-${stakeholder}`.toLowerCase().replace(/\s+/g, '-');
                await run(
                    `INSERT INTO DocumentStakeholder (id, documentId, stakeholder) 
                     VALUES (?, ?, ?)`,
                    [stakeholderId, doc.id, stakeholder]
                );
            }
        }

        // Insert document connections
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

        // After inserting all connections, update all documents' connection counts
        await run(`
        UPDATE Document
        SET connections = (
            SELECT COUNT(*)
            FROM DocumentConnection
            WHERE documentId = Document.id OR connectionId = Document.id
            )
        `);

        console.log("Database initialized successfully with test data");
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    } finally {
        database.close();
    }
};

export default initializeDatabase;