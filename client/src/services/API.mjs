import Document from "../mocks/Document.mjs";

const url = "http://localhost:8001"

async function AddDocumentDescription(doc) {
    
}

async function getTypes() {
    const types = ['serv1','serv2','serv3'];
    return types;
}
async function getDocuments(){
 return new Document ("title", "stakeholder", "scale", "date", "type", "language", "description");
}
const API ={AddDocumentDescription, getTypes, getDocuments}

export default API;