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
        id: "doc15",
        title: "Compilation of responses \"So what the people of Kiruna think\"",
        description: "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
        scale: "Text",
        issuanceDate: "00-00-2007",
        type: "Informative document",
        language: "Swedish",
        coordinates: {  lat: 0 ,//area
            lng: 0},
        area: [
        ],
        stakeholders: ["Kiruna kommun", "Residents"]
    },
    {
        id: "doc18",
        title: "Detail plan for Bolagsomradet Gruvstad- spark",
        description: "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
        scale: "1:8.000",
        issuanceDate: "20-10-2010",
        type: "Prescriptive document",
        language: "Swedish",//controlla come si fa a non mettelo
        coordinates: {
            lat: 67.5054,
            lng: 20.1817
        },
        area: [],
        stakeholders: ["Kiruna kommun"]
    },
    {
        id: "doc41",
        title: "Development Plan",
        description: "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The docu- ment is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
        scale: "1:7,500",
        issuanceDate: "17-03-2014",
        type: "Design document",
        language: "Swedish",
        coordinates: {},
        area: [
            [67.8608, 20.2050],//boh
            [67.8530, 20.1900],
            [67.8685, 20.2400],
        ],
        stakeholders: ["Kiruna kommun"]
    },
    {
        id: "doc45",
        title: "Deformation Forecast",
        description: "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The docu- ment is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
        scale: "1:12,000",
        issuanceDate: "00-12-2014",
        type: "Technical document",
        language: "Swedish",
        coordinates: {
            lat: 67.8490,//area
            lng: 20.2459
        },
        area: [],
        stakeholders: ["LKAB"]
    },
    {
        id: "doc47",
        title: "Adjusted development plan ",
        description: "This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name 'Adjusted Development Plan91,' and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time.",
        scale: "1:7.500",
        issuanceDate: "00-00-2015",
        type: "Design document",
        language: "Swedish",
        coordinates: {
            lat: 67.8575,//area
            lng: 20.2256
        },
        area: [],
        stakeholders: ["Kiruna kommun", "White Arkitekter"]
    },
    {
        id: "doc50",
        title: "Detail plan for square and commercial street",
        description: "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
        scale: "1:1,000",
        issuanceDate: "22-06-2016",
        type: "Prescriptive document",
        language: "Swedish",
        coordinates: {
            lat: 67.8516,
            lng: 20.2371
        },
        area: [],
        stakeholders: ["Kiruna kommun"]
    },
    {
        id: "doc63",
        title: "Construction of Skandic Horel begins",
        description: "After two extensions of the land acquisition agreement, necessary because this document in Sweden is valid for only two years, construction of the hotel finally began in 2019.",
        scale: "Blueprint/effects",
        issuanceDate: "00-04-2019",
        type: "Material effect",
        language: "-",//controlla come si fa a non mettelo
        coordinates: {
            lat: 67.5054,
            lng: 20.1817
        },
        area: [],
        stakeholders: ["LKAB"]
    },
    {
        id: "doc69",
        title: "Construction of Block 1 begins",
        description: "Simultaneously with the start of construction on the Aurora Center, work also began on Block 1, another mixed-use building overlooking the main square and the road leading to old Kiruna. These are the first residential buildings in the new town.",
        scale: "blueprint/effects",
        issuanceDate: "00-06-2019",
        type: "Material effect",
        language: "-",//controlla come si fa a non mettelo
        coordinates: {
            lat: 67.5054,
            lng: 20.1817
        },
        area: [],
        stakeholders: ["LKAB"]
    },
    {
        id: "doc64",
        title: "Town Hall demolition",
        description: "After the construction of the new town hall was completed, the old building, nicknamed \"The Igloo,\" was demolished. The only elements preserved were the door handles, a masterpiece of Sami art made of wood and bone, and the clock tower, which once stood on the roof of the old town hall. The clock tower was relocated to the central square of New Kiruna, in front of the new building.",
        scale: "blueprint/effects",
        issuanceDate: "00-04-2019",
        type: "Material effect",
        language: "-",//controlla come si fa a non mettelo
        coordinates: {
            lat: 67.5109,
            lng: 20.1320
        },
        area: [],
        stakeholders: ["LKAB"]
    },
    {
        id: "doc65",
        title: "Construction of Aurora Center begins",
        description: "Shortly after the construction of the Scandic hotel began, work on the Aurora Center also started, a multifunctional complex that includes the munici- pal library of Kiruna. The two buildings are close to each other and connected by a skywalk, just like in the old town center.",
        scale: "blueprint/effects",
        issuanceDate: "00-05-2019",
        type: "Material effect",
        language: "-",//controlla come si fa a non mettelo
        coordinates: {
            lat: 67.5057,
            lng: 20.1815
        },
        area: [],
        stakeholders: ["LKAB"]
    }

];

async function populateUserTable() {
    await run("DELETE FROM User");
    const users = [
        {username: "resident", password: "102030", role: UserType.RESIDENT},
        {username: "visitor", password: "405060", role: UserType.VISITOR},
        {username: "MarioRossi", password: "708090", role: UserType.URBAN_PLANNER},
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
            documentId: "doc15",
            connectionId: "doc12",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn2",
            documentId: "doc15",
            connectionId: "doc26",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn3",
            documentId: "doc15",
            connectionId: "doc41",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn4",
            documentId: "doc18",
            connectionId: "doc1",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn5",
            documentId: "doc18",
            connectionId: "doc30",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn6",
            documentId: "doc18",
            connectionId: "doc46",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn7",
            documentId: "doc18",
            connectionId: "doc53",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn8",
            documentId: "doc18",
            connectionId: "doc54",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn9",
            documentId: "doc18",
            connectionId: "doc55",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn10",
            documentId: "doc18",
            connectionId: "doc57",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn11",
            documentId: "doc18",
            connectionId: "doc64",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn12",
            documentId: "doc41",
            connectionId: "doc42",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn13",
            documentId: "doc41",
            connectionId: "doc31",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn14",
            documentId: "doc41",
            connectionId: "doc40",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn15",
            documentId: "doc41",
            connectionId: "doc44",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn16",
            documentId: "doc41",
            connectionId: "doc29",
            type: DocumentConnectionType.COLLATERAL_CONSEQUENCE
        },
        {
            id: "conn17",
            documentId: "doc41",
            connectionId: "doc47",
            type: DocumentConnectionType.COLLATERAL_CONSEQUENCE
        },
        {
            id: "conn18",
            documentId: "doc45",
            connectionId: "doc1",
            type: DocumentConnectionType.UPDATE
        },
        {
            id: "conn19",
            documentId: "doc45",
            connectionId: "do52",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn20",
            documentId: "doc45",
            connectionId: "doc56",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn21",
            documentId: "doc45",
            connectionId: "doc58",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE 
        },
        {
            id: "conn22",
            documentId: "doc45",
            connectionId: "doc49",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn23",
            documentId: "doc45",
            connectionId: "doc47",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn24",
            documentId: "doc45",
            connectionId: "doc62",
            type: DocumentConnectionType.UPDATE
        },
        {
            id: "conn25",
            documentId: "doc47",
            connectionId: "doc50",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn26",
            documentId: "doc47",
            connectionId: "doc89",
            type: DocumentConnectionType.COLLATERAL_CONSEQUENCE
        },
        {
            id: "conn27",
            documentId: "doc47",
            connectionId: "doc75",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn45",
            documentId: "doc47",
            connectionId: "doc98",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn28",
            documentId: "doc47",
            connectionId: "doc91",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn29",
            documentId: "doc47",
            connectionId: "doc93",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn30",
            documentId: "doc47",
            connectionId: "doc72",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn31",
            documentId: "doc47",
            connectionId: "doc71",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn32",
            documentId: "doc47",
            connectionId: "doc66",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn33",
            documentId: "doc47",
            connectionId: "doc61",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn34",
            documentId: "doc50",
            connectionId: "doc44",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn35",
            documentId: "doc50",
            connectionId: "doc44",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn36",
            documentId: "doc50",
            connectionId: "doc63",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn37",
            documentId: "doc50",
            connectionId: "doc65",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn38",
            documentId: "doc50",
            connectionId: "doc69",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn39",
            documentId: "doc50",
            connectionId: "doc101",
            type: DocumentConnectionType.UPDATE
        },
        {
            id: "conn40",
            documentId: "doc63",
            connectionId: "doc85",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn41",
            documentId: "doc69",
            connectionId: "doc87",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn42",
            documentId: "doc64",
            connectionId: "doc61",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn43",
            documentId: "doc64",
            connectionId: "doc76",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn44",
            documentId: "doc65",
            connectionId: "doc86",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
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
    const Scales = ["1:500", "1:5000", "1:50000", "1:1000", "1:10000", "Text", "Blueprint/effects", "Concept", "Plan"];
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