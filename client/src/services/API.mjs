import Document from "../mocks/Document.mjs";

const url = "http://localhost:8001"

async function AddDocumentDescription(doc) {
    
}

async function getTypes() {
    const types = ['serv1','serv2','serv3'];
    return types;
}
async function getDocuments(){
    const doc= [];
    doc.push(new Document ("1","title", "stakeholder", "scale", "01/01/1999", "type", "language", "description"));
    doc.push(new Document ("2","title2", "stakeholder2", "scale2", "01/01/1999", "type2", "language2", "description2"));
    doc.push(new Document ("3","title3", "stakeholder3", "scale3", "01/01/1999", "type3", "language3", "description3"));
    return doc;
}
const API ={AddDocumentDescription, getTypes, getDocuments}

export default API;