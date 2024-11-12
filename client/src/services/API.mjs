const url = "http://localhost:3001"

/*
async function login(username, password) {
    let response = await fetch(baseURL + "sessions", {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password },)
    })
    if (response.ok) {
        const user = await response.json()
        return user
    } else {
        const errDetail = await response.text();
        throw errDetail;
    }
}

async function logout(){
    const response = await fetch(baseURL + 'sessions/current', {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok)
        return null;
}
*/
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
                body: JSON.stringify({title: doc.title, description: doc.description, stakeholders:doc.stakeholder, scale: doc.scale, issuanceDate: doc.issuanceDate,type: doc.type,language: doc.language,  coordinates: coordinates, connectionIds:selectedDocuments  })
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

async function EditDocumentDescription(doc ,selectedDocuments, coordinates, id) {
    try {
        const coord = [];
        coord.push(coordinates.lat);
        coord.push(coordinates.lng);
        const response = await fetch(`${url}/documents/${id}`,
            {
                method: "PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title: doc.title, description: doc.description, stakeholders:doc.stakeholder, scale: doc.scale, issuanceDate: doc.issuanceDate,type: doc.type,language: doc.language,  coordinates: coordinates, connectionIds:selectedDocuments  })
            })
        if (response.ok) {
            return;
        } else {
            const errDetail = await response.json();
            if (errDetail.error)
                throw errDetail.error;
            if (errDetail.message)
                throw errDetail.message;
            
            throw "Something went wrong while saving edit doc description.";
        }
    } catch (error) {
        console.error( error);
        throw error;  
    }
}

async function getTypes() {
    /*const types = ['serv1','serv2','serv3'];*/
    const response = await fetch(`${url}/documents/types`);
    if(response.ok){
        const t = await response.json();
        const res =[];
        t.documentTypes.forEach((type) => {
            res.push({ value: type, label: type })
        });
        return res;
    }
}

async function getStake() {
    const stakeholder = [{ value: 'stakeholder1', label: 'Stakeholder 1' },
        { value: 'stakeholder2', label: 'Stakeholder 2' },
        { value: 'stakeholder3', label: 'Stakeholder 3' },
        { value: 'stakeholder4', label: 'Stakeholder 4' },
        { value: 'stakeholder5', label: 'Stakeholder 5' },
        { value: 'stakeholder6', label: 'Stakeholder 6' },
        { value: 'stakeholder7', label: 'Stakeholder 7' }]
    return stakeholder;
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
            return documents.documents;
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

/*async function getRelatedDocuments(docID) {
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
}*/

async function getData(id) {
    const response = await fetch(`${url}/documents/${id}`)
    const data = await response.json();
    console.log(data)
    return data.data;
}
const API ={AddDocumentDescription, getTypes, getDocuments, getData, EditDocumentDescription, getStake/*, login, logout*/}

export default API;