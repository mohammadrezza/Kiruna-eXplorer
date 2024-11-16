import {v4 as uuidv4} from "uuid";

class Document {
    constructor() {
        this.id = '';
        this.title = '';
        this.description = '';
        this.stakeholders = [];
        this.scale = '';
        this.issuanceDate = '';
        this.type = '';
        this.language = '';
        this.coordinates = '';
        this.connections = '';
        this.createdAt = '';
        this.isConnected = false;
    }

    createFromObject(obj) {
        this.id = uuidv4();
        this.title = obj.title;
        this.description = obj.description;
        this.stakeholders = obj.stakeholders;
        this.scale = obj.scale;
        this.issuanceDate = obj.issuanceDate;
        this.type = obj.type;
        this.language = obj.language;
        this.coordinates = obj.coordinates;
        this.connections = obj.connections;
    }

    createFromDatabaseRow(row) {
        this.id = row.id;
        this.title = row.title;
        this.description = row.description;
        this.stakeholders = row.stakeholders;
        this.scale = row.scale;
        this.issuanceDate = row.issuanceDate;
        this.type = row.type;
        this.language = row.language;
        this.coordinates = row.coordinates ? JSON.parse(row.coordinates) : [];
        this.connections = row.connections;
        this.createdAt = row.created_at;
        this.isConnected = row.is_connected === 1;
    }
}

export default Document; 