import {v4 as uuidv4} from 'uuid';

class DocumentConnection {
    constructor() {
        this.id = '';
        this.documentId = '';
        this.connectionId = '';
        this.createdAt = '';
    }

    createFromObject(obj) {
        this.id = uuidv4();
        this.documentId = obj.documentId;
        this.connectionId = obj.connectionId;
    }

    createFromDatabaseRow(row) {
        this.id = row.id;
        this.documentId = row.document_id;
        this.connectionId = row.connection_id;
        this.createdAt = row.created_at;
    }
}
