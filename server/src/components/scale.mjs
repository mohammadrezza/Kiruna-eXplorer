import {v4 as uuidv4} from "uuid";

class Scale {
    constructor() {
        this.id = '';
        this.name = '';
    }

    createFromObject(obj) {
        this.id = uuidv4();
        this.name = obj.name;
    }

    createFromDatabaseRow(row) {
        this.id = row.id;
        this.name = row.name;
        this.createdAt = row.created_at;
    }
}

export default Scale;