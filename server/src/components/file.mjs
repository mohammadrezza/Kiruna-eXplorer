import {v4 as uuidv4} from "uuid";
import path from "path";
import fs from "fs";
import PDFDocument from "pdf-lib";

class File {
    constructor() {
        this.id = '';
        this.documentId = '';
        this.name = '';
        this.numPages = -1;
        this.createdAt = '';
        this._file = '';
        this._dir = '';
        this._fullPath = '';
    }

    createFromObject(obj) {
        this.id = uuidv4();
        this.documentId = obj.documentId;
        this.name = obj.name;
        this.numPages = obj.numPages;
        this._file = obj.file;
        this._dir = path.join(process.cwd(), 'uploads', this.documentId);
        this._fullPath = path.join(this._dir, this.name);
    }

    createFromDatabaseRow(row) {
        this.id = row.id;
        this.documentId = row.documentId;
        this.name = row.name;
        this.numPages = row.numPages;
        this.createdAt = row.created_at;
        this._dir = path.join(process.cwd(), 'uploads', this.documentId);
        this._fullPath = path.join(this._dir, this.name);
    }

    moveToDir() {
        fs.mkdirSync(this._dir, {recursive: true});
        fs.renameSync(this._file.path, this._fullPath);
    }

    async calcNumOfPages() {
        const pdfData = fs.readFileSync(this._fullPath);
        try {
            const pdfDoc = await PDFDocument.PDFDocument.load(pdfData);
            this.numPages = pdfDoc.getPageCount();
        } catch (error) {
            this.numPages = 1;
        }
    }

    getSelfLink() {
        return "http://localhost:3001/documents/" + this.documentId + "/files/" + this.name
    }

    static BuildLink(id, fileName) {
        return `http://localhost:3001/documents/${id}/files/${fileName}`
    }

    getFullPath() {
        return this._fullPath;
    }
}

export default File;