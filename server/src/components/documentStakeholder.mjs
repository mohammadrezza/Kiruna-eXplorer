import {v4 as uuidv4} from 'uuid';

class DocumentStakeholder {
    constructor() {
        this.id = '';
        this.documentId = '';
        this.stakeholder = '';
        this.createdAt = '';
    }

    createFromObject(obj) {
        this.id = uuidv4();
        this.documentId = obj.documentId;
        this.stakeholder = obj.stakeholder;
    }

    createFromDatabaseRow(row) {
        this.id = row.id;
        this.documentId = row.document_id;
        this.stakeholder = row.stakeholder;
        this.createdAt = row.created_at;
    }
}
export default DocumentStakeholder;