import Document from "../mocks/Document.mjs";

const url = "http://localhost:8001"

async function AddDocumentDescription(doc) {
    
}

async function getTypes() {
    const types = ['serv1','serv2','serv3'];
    return types;
}
async function getDocuments(){
    const docArr = [new Document ("title", "stakeholder", "scale", "date", "type", "language", "description"), new Document ("title2", "stakeholder2", "scale2", "date2", "type2", "language2", "description2")];
    return docArr;
}
const API ={AddDocumentDescription, getTypes, getDocuments}

export default API;