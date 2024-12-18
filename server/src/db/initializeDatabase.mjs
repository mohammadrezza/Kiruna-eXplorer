import {v4 as uuidv4} from "uuid";
import sqlite from "sqlite3";
import crypto from "crypto";
import UserType from "../components/userType.mjs";
import DocumentConnectionType from "../components/documentConnectionType.mjs";
import process from 'process';
import path from "path";

const database = new sqlite.Database('db.db', (err) => {
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
        scale: "1:12000",
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
        scale: "Blueprint/effects",
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
        scale: "Blueprint/effects",
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
        scale: "Blueprint/effects",
        issuanceDate: "00-05-2019",
        type: "Material effect",
        language: "-",//controlla come si fa a non mettelo
        coordinates: {
            lat: 67.5057,
            lng: 20.1815
        },
        area: [],
        stakeholders: ["LKAB"]
    },
    {
        id: "doc2",
        title: "Mail to Kiruna kommun (2)",
        description: "This document is considered the act that initiates the process of relocating Kiruna. The company communicates its intention to construct a new mining level at a depth of 1,365 meters. Along with this, LKAB urges the municipality to begin the necessary planning to relocate the city, referring to a series of meetings held in previous months between the two stakeholders.",
        scale: "Text",
        issuanceDate: "19-03-2004",
        type: "Prescriptive document",
        language: "Swedish",
        coordinates: {  lat: 0 ,lng: 0}, //area
        area: [],
        stakeholders: ["LKAB"]
    },
    {
        id: "doc4",
        title: "Vision 2099 (4)",
        description: "Vision 2099 is to be considered the first project for the new city of Kiruna. It was created by the municipality in response to the letter from LKAB. In these few lines, all the main aspects and expectations of the municipality for the new city are condensed The document, which despite being a project document is presented anonymously, had the strength to influence the design process. The principles it contains proved to be fundamental in subsequent planning documents.",
        scale: "Text",
        issuanceDate: "00-00-2004",
        type: "Design document",
        language: "Swedish",
        coordinates: {  lat: 0 ,lng: 0}, //area
        area: [],
        stakeholders: ["Kiruna kommun"]
    },
    {
        id: "doc42",
        title: "Detailed plan for LINBANAN 1. (42)",
        description: "This is the first Detailed Plan for the new city center, covering a very small area. It regulates the use of a portion of land that will host a single building. Its boundaries coincide with the outer footprint of the new Town Hall, \"Kristallen,\" the first building to be constructed in the new Kiruna.",
        scale: "1:500",
        issuanceDate: "00-03-2014",
        type: "Prescriptive document",
        language: "Swedish",
        coordinates: {  lat: 0 ,lng: 0}, //todo add exact lat lng
        area: [],
        stakeholders: ["Kiruna kommun"]
    },
    {
        id: "doc44",
        title: "Detailed Overview Plan for the Central Area of Kiruna 2014. (44)",
        description: "The Detailed Overview Plan is one of the three planning instruments available to Swedish administrations and represents an intermediate scale. Like the Overview Plan, compliance with it is not mandatory, but it serves as a supporting plan for Detailed Plans, sharing the characteristic of regulating a specific area of the Kiruna municipality rather than its entire extent, as the Overview Plan does. This specific plan focuses on the central area of Kiruna and its surroundings, incorporating all the projections of the Development Plan into a prescriptive tool.",
        scale: "1:30000",
        issuanceDate: "00-06-2014",
        type: "Prescriptive document",
        language: "Swedish",
        coordinates: {},
        area: [], //todo add exact area
        stakeholders: ["Kiruna kommun"]
    },
    {
        id: "doc48",
        title: "Construction of new city hall begins (48)",
        description: "The Kiruna Town Hall was the first building to be rebuild in the new town center in 2015. It remained isolated for quite some time due to a slowdown in mining activities.",
        scale: "Blueprints/effects",
        issuanceDate: "00-00-2015",
        type: "Material effect",
        language: "-",
        coordinates: {}, //todo add exact lat lng
        area: [],
        stakeholders: ["LKAB"]
    },
    {
        id: "doc58",
        title: "Detailed plan for Gruvstaspark 2, etapp 3,del av SJ-området m m. (58)",
        description: "The third Detailed Plan of the second demolition phase covers a narrow, elongated area straddling the old railway. Like all areas within the \"Gruvsta-dpark 2\" zone, its sole designated land use is for mining activities, although it will temporarily be used as a park during an interim phase.",
        scale: "1:1500",
        issuanceDate: "00-10-2018",
        type: "Prescriptive document",
        language: "Swedish",
        coordinates: {},
        area: [], //todo add exact area
        stakeholders: ["Kiruna kommun"]
    },
    {
        id: "doc62",
        title: "Deformation forecast (62)",
        description: "The third deformation forecast was published in 2019, five years after the second. The line has not moved; what changes, as in the previous version, are the timing of the interventions and the shape of the areas underlying the deformation zone.",
        scale: "1:12000",
        issuanceDate: "00-03-2019",
        type: "Technical document",
        language: "Swedish",
        coordinates: {},
        area: [], //todo add exact area
        stakeholders: ["LKAB"]
    },
    {
        id: "doc49",
        title: "Detail plan for square and commercial street (49)",
        description: "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, compri- sing a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
        scale: "1:1000",
        issuanceDate: "22-06-2016",
        type: "Prescriptive document",
        language: "Swedish",
        coordinates: {},
        area: [], //todo add exact area
        stakeholders: ["Kiruna kommun"]
    },
    {
        id: "doc102",
        title: "Kiruna Church closes (102)",
        description: "On June 2, the Kiruna Church was closed to begin the necessary preparations for its relocation, following a solemn ceremony. The relocation is scheduled for the summer of 2025 and will take two days. Both the new site and the route for the move have already been determined. A significant period will pass between the relocation and the reopening of the church, voted \"Sweden's most beautiful building constructed before 1950.\"",
        scale: "Blueprints/effects",
        issuanceDate: "02-06-2024",
        type: "Material effect",
        language: "-",
        coordinates: {
            lat: 67.8485,
            lng: 20.3003
        },
        area: [],
        stakeholders: ["LKAB"]
    },
    {
        id: "doc76",
        title: "Demolition documentation, Kiruna City Hall (76)",
        description: "This document was created to preserve the memory of the symbolic building before its demolition in April 2019. Conducted by the Norrbotten Museum, the detailed 162-page study analyzed the building's materials, both physically and chemically, taking advantage of the demolition to explore aspects that couldn't be examined while it was in use. This meticulous effort reflects a commitment to preserving knowledge of every detail of the structure.",
        scale: "Text",
        issuanceDate: "26-11-2020",
        type: "Informative document",
        language: "-",
        coordinates: {
            lat: 67.8491,
            lng: 20.30439
        },
        area: [],
        stakeholders: ["Norrbotten Museum"]
    },
    {
        id: "doc81",
        title: "Gruvstadspark 2, etapp 5, Kyrkan (81)",
        description: "The last detailed plan of the second planning phase concerns the area surrounding the Kiruna Church. Situated within a park, the area includes only six buildings, half of which serve religious functions The plan also specifies that the church will be dismantled between 2025 and 2026 and reassembled at its new site by 2029.",
        scale: "1:2000",
        issuanceDate: "04-09-2021",
        type: "Prescriptive document",
        language: "-",
        coordinates: {},
        area: [], //todo add exact area
        stakeholders: ["Kiruna kommun"]
    },

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
        },
        {
            id: "conn46",
            documentId: "doc44",
            connectionId: "doc41",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn47",
            documentId: "doc44",
            connectionId: "doc50",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn48",
            documentId: "doc58",
            connectionId: "doc45",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn49",
            documentId: "doc62",
            connectionId: "doc45",
            type: DocumentConnectionType.UPDATE
        },
        {
            id: "conn50",
            documentId: "doc62",
            connectionId: "doc81",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn51",
            documentId: "doc49",
            connectionId: "doc45",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn52",
            documentId: "doc49",
            connectionId: "doc44",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn53",
            documentId: "doc102",
            connectionId: "doc81",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn54",
            documentId: "doc76",
            connectionId: "doc64",
            type: DocumentConnectionType.DIRECT_CONSEQUENCE
        },
        {
            id: "conn55",
            documentId: "doc81",
            connectionId: "doc62",
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
    const stakeholders = ["Municipality", "LKAB", "Regional Authority", "Architecture Firms", "Citizens", "Kiruna kommun", "Norrbotten Museum"];
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
    const Scales = ["1:500", "1:5000", "1:50000", "1:1000", "1:10000", "1:30000", "1:1500", "1:12000", "1:2000", "Text", "Blueprint/effects", "Concept", "Plan"];
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

const dirPath = path.join(process.cwd(), 'src', 'db');
process.chdir(dirPath);
await initializeDatabase();