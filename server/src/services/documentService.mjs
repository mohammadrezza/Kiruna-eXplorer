import {getAllDocuments} from "../db/db.mjs";

async function getDocuments(documentId, title) {
    const documents = await getAllDocuments();
    return documents;
}

export {
    getDocuments
}