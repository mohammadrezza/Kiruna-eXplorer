import {v4 as uuidv4} from 'uuid';

class DocumentConnection {
    constructor() {
        this.id = '';
        this.documentId = '';
        this.connectionId = '';
        this.type = '';
        this.createdAt = '';
    }

    createFromObject(obj) {
        this.id = uuidv4();
        this.documentId = obj.documentId;
        this.connectionId = obj.connectionId;
        this.type = obj.type;
    }

    createFromDatabaseRow(row) {
        this.id = row.id;
        this.documentId = row.document_id;
        this.connectionId = row.connection_id;
        this.type = row.type;
        this.createdAt = row.created_at;
    }
}

export default DocumentConnection;