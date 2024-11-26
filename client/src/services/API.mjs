import dayjs from "dayjs";
const url = "http://localhost:3001"


async function login(username, password) {
    
    let response = await fetch(`${url}/sessions/`, {
        method: 'POST',
        credentials: "include",
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password },)
    })
    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
}

/*
async function logout(){
    const response = await fetch(url + 'sessions/current', {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok)
        return null;
}
*/

async function getUser(){
    const response = await fetch(`${url}/sessions/`)
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    return await response.json();
}


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
                credentials: "include",
                body: JSON.stringify({
                    title: doc.title,
                    description: doc.description,
                    stakeholders:doc.stakeholder, 
                    scale: doc.scale, 
                    issuanceDate: doc.issuanceDate,
                    type: doc.type,
                    language: doc.language,  
                    coordinates: coordinates, 
                    connectionIds: selectedDocuments  })
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
                credentials: "include",
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

async function getConnectionTypes() {
    try {
        const response = await fetch(`${url}/documents/connectionTypes`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const types = await response.json();
            const res =[];
            types.documentConnectionTypes.forEach((type) => {
                res.push(type)
            });
            return res; 
        } else {
            const errDetail = await response.json();
            if (errDetail.error) throw errDetail.error;
            if (errDetail.message) throw errDetail.message;

            throw "Something went wrong while fetching connection types.";
        }
    } catch (error) {
        console.error("Error fetching connection types:", error);
        throw error;
    }
}

async function getStake() {
    const response = await fetch(`${url}/documents/stakeholders`);
    if(response.ok){
        const t = await response.json();
        const res =[];
        t.stakeholders.forEach((stake) => {
            res.push({ value: stake, label: stake })
        });
        return res;
    }
    return;
}

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
            return documents.data;
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

async function getSortedDocuments(key,dir) {
    try {
        const response = await fetch(`${url}/documents?sort=${key},${dir}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const documents = await response.json();
            return documents.data;
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

async function getData(id) {
    const response = await fetch(`${url}/documents/${id}`)
    const data = await response.json();
    console.log(data)
    return data.data;
}

async function getScale() {
    const response = await fetch(`${url}/documents/scales`);
    if(response.ok){
        const s = await response.json();
        const res =[];
        s.scales.forEach((scale) => {
            res.push({ value: scale, label: scale })
        });
        return res;
    }
    return;
}




async function addType(type){
    try {
        const response = await fetch(`${url}/documents/types`,
            {
                method: "POST",
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    name:type})
            })
        if (response.ok) {
            return;
        } else {
            const errDetail = await response.json();
            if (errDetail.error)
                throw errDetail.error;
            if (errDetail.message)
                throw errDetail.message;
            
            throw "Something went wrong while saving new type.";
        }
    } catch (error) {
        console.error( error);
        throw error;  
    }
}

async function addStakeholder(stakeholder){
    try {
        const response = await fetch(`${url}/documents/stakeholders`,
            {
                method: "POST",
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    name:stakeholder})
            })
        if (response.ok) {
            return;
        } else {
            const errDetail = await response.json();
            if (errDetail.error)
                throw errDetail.error;
            if (errDetail.message)
                throw errDetail.message;
            
            throw "Something went wrong while saving new stakeholder.";
        }
    } catch (error) {
        console.error( error);
        throw error;  
    }
}


async function addScale(scale){
    try {
        const response = await fetch(`${url}/documents/scales`,
            {
                method: "POST",
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    name:scale})
            })
        if (response.ok) {
            return;
        } else {
            const errDetail = await response.json();
            if (errDetail.error)
                throw errDetail.error;
            if (errDetail.message)
                throw errDetail.message;
            
            throw "Something went wrong while saving new scale.";
        }
    } catch (error) {
        console.error( error);
        throw error;  
    }
}


const API ={
    AddDocumentDescription,
    getTypes,
    getDocuments,
    getData, 
    EditDocumentDescription, 
    getStake, 
    getConnectionTypes, 
    login,
    getUser,
    addType, 
    addStakeholder,
    addScale,
    getScale,
    getSortedDocuments
}

export default API;