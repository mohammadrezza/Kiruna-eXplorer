import Document from "../mocks/Document.mjs";

const url = "http://localhost:3001"

async function AddDocumentDescription(doc ,selectedDocuments, coordinates) {
    try {
        const coord = [];
        coord.push(coordinates.lat);
        coord.push(coordinates.lng);
        const response = await fetch(`${url}/documents/`,
            {
                method: "POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title: doc.title, stakeholders:doc.stakeholders, scale: doc.scale, issuanceDate: doc.issuanceDate,type: doc.type,language: doc.language,  coordinates: coordinates, connectionIds:selectedDocuments  })
            })
        if (response.ok) {
            return;
        } else {
            const errDetail = await response.json();
            if (errDetail.error)
                throw errDetail.error;
            if (errDetail.message)
                throw errDetail.message;
            
            throw "Something went wrong while saving new doc description.";
        }
    } catch (error) {
        console.error( error);
        throw error;  
    }
}

async function getTypes() {
    const types = ['serv1','serv2','serv3'];
    /*try{
        const response = await fetch(`${url}/documents/types`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    if(response.ok){
        const t = await response.json();
        return t;
    }
    }catch(error){

    }*/
    return types;
}
// async function getDocuments(){
//     const doc= [];
//     doc.push(new Document ("1","title", "stakeholder", "scale", "01/01/1999", "type", "language", "description"));
//     doc.push(new Document ("2","title2", "stakeholder2", "scale2", "01/01/1999", "type2", "language2", "description2"));
//     doc.push(new Document ("3","title3", "stakeholder3", "scale3", "01/01/1999", "type3", "language3", "description3"));
//     return doc;
// }
async function getDocuments() {
    try {
        const response = await fetch(`${url}/documents`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const documents = await response.json();
            return documents;
        } else {
            const errDetail = await response.json();
            if (errDetail.error)
                throw errDetail.error;
            if (errDetail.message)
                throw errDetail.message;

            throw "Something went wrong while fetching documents.";
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getRelatedDocuments(docID) {
    try {
        const response = await fetch(`${url}/documents/${docID}/related`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const relatedDocs = await response.json();
            return relatedDocs; 
        } else {
            const errorDetail = await response.json();
            throw errorDetail.error || errorDetail.message || "Failed to fetch related documents.";
        }
    } catch (error) {
        console.error("Error fetching related documents:", error);
        throw error;
    }
}

async function getData(id) {
    console.log(id);
    return new Document ("1","title", "stakeholder", "scale", "01/01/1999", "type", "language", "description");
}
const API ={AddDocumentDescription, getTypes, getDocuments, getData, getRelatedDocuments}

export default API;