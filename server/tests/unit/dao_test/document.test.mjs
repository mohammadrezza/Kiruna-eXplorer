import {describe, test, expect, jest} from "@jest/globals";
import db from "../../../src/db/db.mjs";
import {
    addDocument,
    addDocumentStakeholder,
    addDocumentConnection,
    getAllDocuments,
    getDocumentStakeholders,
    getDocumentWithConnections,
    editDocument,
    editDocumentConnection,
    deleteAllConnections,
    deleteAllStakeholders,
    convertToISODate,
    addType,
    getAllTypes,
    addStakeHolder,
    getAllStakeHolders,
    addScale,
    getAllScales
} from '../../../src/daos/documentDAO.mjs';

jest.mock('../../../src/db/db.mjs');

afterEach(() => {
    jest.clearAllMocks();
});

describe('documentDAO', () => {
    describe('addDocument', () => {
        test('should insert a new document successfully', async () => {
            const document = {
                id: '1',
                title: 'Test Document',
                description: 'This is a test document',
                scale: '1:500',
                issuanceDate: '2023-01-01',
                type: 'Type1',
                language: 'English',
                coordinates: { lat: 1.1, lng: 2.2 },
                area: [],
                connections: 0
            };

            db.run.mockImplementation((query, params, callback) => {
                callback(null);
            });

            await expect(addDocument(
                document.id,
                document.title,
                document.description,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections
            )).resolves.toBeUndefined();

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [
                    document.id,
                    document.title,
                    document.description,
                    document.scale,
                    document.issuanceDate,
                    document.type,
                    document.language,
                    JSON.stringify(document.coordinates),
                    JSON.stringify(document.area),
                    document.connections
                ],
                expect.any(Function)
            );
        });


        test('should handle error when inserting a new document', async () => {
            const document = {
                id: '1',
                title: 'Test Document',
                description: 'This is a test document',
                scale: '1:500',
                issuanceDate: '2023-01-01',
                type: 'Type1',
                language: 'English',
                coordinates: { lat: 1.1, lng: 2.2 },
                area: [],
                connections: 0
            };

            const errorMessage = 'Error inserting document';
            db.run.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(addDocument(
                document.id,
                document.title,
                document.description,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections
            )).rejects.toThrow(errorMessage);

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [
                    document.id,
                    document.title,
                    document.description,
                    document.scale,
                    document.issuanceDate,
                    document.type,
                    document.language,
                    JSON.stringify(document.coordinates),
                    JSON.stringify(document.area),
                    document.connections
                ],
                expect.any(Function)
            );
        });
    });

    describe('addDocumentStakeholder', () => {
        test('should insert a new document stakeholder successfully', async () => {
            const id = '1';
            const documentId = 'doc1';
            const stakeholder = 'Stakeholder1';

            db.run.mockImplementation((query, params, callback) => {
                callback(null);
            });

            await expect(addDocumentStakeholder(id, documentId, stakeholder)).resolves.toBeUndefined();

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [id, documentId, stakeholder],
                expect.any(Function)
            );
        });

        test('should handle error when inserting a new document stakeholder', async () => {
            const id = '1';
            const documentId = 'doc1';
            const stakeholder = 'Stakeholder1';

            const errorMessage = 'Error inserting document stakeholder';
            db.run.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(addDocumentStakeholder(id, documentId, stakeholder)).rejects.toThrow(errorMessage);

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [id, documentId, stakeholder],
                expect.any(Function)
            );
        });
    });

    describe('addDocumentConnection', () => {
        test('should insert a new document connection successfully', async () => {
            const id = '1';
            const documentId = 'doc1';
            const connectionId = 'conn1';
            const type = 'Type1';

            db.run.mockImplementation((query, params, callback) => {
                callback(null);
            });

            await expect(addDocumentConnection(id, documentId, connectionId, type)).resolves.toBeUndefined();

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [id, documentId, connectionId, type],
                expect.any(Function)
            );
        });

        test('should handle error when inserting a new document connection', async () => {
            const id = '1';
            const documentId = 'doc1';
            const connectionId = 'conn1';
            const type = 'Type1';

            const errorMessage = 'Error inserting document connection';
            db.run.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(addDocumentConnection(id, documentId, connectionId, type)).rejects.toThrow(errorMessage);

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [id, documentId, connectionId, type],
                expect.any(Function)
            );
        });
    });

    describe('getDocumentStakeholders', () => {
        test('should return document stakeholders successfully', async () => {
            const documentId = 'doc1';
            const mockStakeholders = [
                { stakeholder: 'Stakeholder1' },
                { stakeholder: 'Stakeholder2' }
            ];

            db.all.mockImplementation((query, params, callback) => {
                callback(null, mockStakeholders);
            });

            const result = await getDocumentStakeholders(documentId);

            expect(db.all).toHaveBeenCalledWith(
                expect.any(String),
                [documentId],
                expect.any(Function)
            );
            expect(result).toEqual(mockStakeholders);
        });

        test('should handle error when fetching document stakeholders', async () => {
            const documentId = 'doc1';
            const errorMessage = 'Error fetching document stakeholders';

            db.all.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(getDocumentStakeholders(documentId)).rejects.toThrow(errorMessage);

            expect(db.all).toHaveBeenCalledWith(
                expect.any(String),
                [documentId],
                expect.any(Function)
            );
        });
    });

    describe('editDocument', () => {
        test('should update a document successfully', async () => {
            const document = {
                id: '1',
                title: 'Updated Document',
                description: 'This is an updated document',
                scale: '1:500',
                issuanceDate: '2023-01-01',
                type: 'Type1',
                language: 'English',
                coordinates: { lat: 1.1, lng: 2.2 },
                area: [],
                connections: 0
            };

            db.run.mockImplementation((query, params, callback) => {
                callback(null);
            });

            await expect(editDocument(
                document.id,
                document.title,
                document.description,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections
            )).resolves.toBeUndefined();

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [
                    document.title,
                    document.description,
                    document.scale,
                    document.issuanceDate,
                    document.type,
                    document.language,
                    JSON.stringify(document.coordinates),
                    JSON.stringify(document.area),
                    document.connections,
                    document.id
                ],
                expect.any(Function)
            );
        });

        test('should handle error when updating a document', async () => {
            const document = {
                id: '1',
                title: 'Updated Document',
                description: 'This is an updated document',
                scale: '1:500',
                issuanceDate: '2023-01-01',
                type: 'Type1',
                language: 'English',
                coordinates: { lat: 1.1, lng: 2.2 },
                area: [],
                connections: 0
            };

            const errorMessage = 'Error updating document';
            db.run.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(editDocument(
                document.id,
                document.title,
                document.description,
                document.scale,
                document.issuanceDate,
                document.type,
                document.language,
                document.coordinates,
                document.area,
                document.connections
            )).rejects.toThrow(errorMessage);

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [
                    document.title,
                    document.description,
                    document.scale,
                    document.issuanceDate,
                    document.type,
                    document.language,
                    JSON.stringify(document.coordinates),
                    JSON.stringify(document.area),
                    document.connections,
                    document.id
                ],
                expect.any(Function)
            );
        });
    });

    describe('deleteAllStakeholders', () => {
        test('should delete all stakeholders for a document successfully', async () => {
            const documentId = 'doc1';

            db.run.mockImplementation((query, params, callback) => {
                callback(null);
            });

            await expect(deleteAllStakeholders(documentId)).resolves.toBeUndefined();

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [documentId],
                expect.any(Function)
            );
        });

        test('should handle error when deleting all stakeholders for a document', async () => {
            const documentId = 'doc1';
            const errorMessage = 'Error deleting stakeholders';

            db.run.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(deleteAllStakeholders(documentId)).rejects.toThrow(errorMessage);

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [documentId],
                expect.any(Function)
            );
        });
    });

    describe('editDocumentConnection', () => {
        test('should edit a document connection successfully', async () => {
            const id = '1';
            const documentId = 'doc1';
            const connectionId = 'conn1';
            const type = 'Type1';

            db.run.mockImplementation((query, params, callback) => {
                callback(null);
            });

            await expect(editDocumentConnection(id, documentId, connectionId, type)).resolves.toBeUndefined();

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [id, documentId, connectionId, type],
                expect.any(Function)
            );
        });

        test('should handle error when editing a document connection', async () => {
            const id = '1';
            const documentId = 'doc1';
            const connectionId = 'conn1';
            const type = 'Type1';

            const errorMessage = 'Error editing document connection';
            db.run.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(editDocumentConnection(id, documentId, connectionId, type)).rejects.toThrow(errorMessage);

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [id, documentId, connectionId, type],
                expect.any(Function)
            );
        });
    });

    describe('deleteAllConnections', () => {
        test('should delete all connections for a document successfully', async () => {
            const id = 'doc1';

            db.run.mockImplementation((query, params, callback) => {
                callback(null);
            });

            await expect(deleteAllConnections(id)).resolves.toBeUndefined();

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [id, id],
                expect.any(Function)
            );
        });

        test('should handle error when deleting all connections for a document', async () => {
            const id = 'doc1';
            const errorMessage = 'Error deleting connections';

            db.run.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(deleteAllConnections(id)).rejects.toThrow(errorMessage);

            expect(db.run).toHaveBeenCalledWith(
                expect.any(String),
                [id, id],
                expect.any(Function)
            );
        });
    });

    describe('getDocumentWithConnections', () => {
        test('should return document with connections successfully', async () => {
            const id = 'doc1';
            const mockDocumentData = [
                {
                    doc_id: 'doc1',
                    doc_title: 'Main Document',
                    doc_description: 'Description of main document',
                    doc_scale: '1:500',
                    doc_issuanceDate: '2023-01-01',
                    doc_type: 'Type1',
                    doc_language: 'English',
                    doc_coordinates: '{"lat": 1.1, "lng": 2.2}',
                    conn_id: 'conn1',
                    conn_title: 'Connected Document',
                    conn_description: 'Description of connected document',
                    conn_scale: '1:1000',
                    conn_issuanceDate: '2023-02-01',
                    conn_type: 'Type2',
                    conn_language: 'French',
                    conn_coordinates: '{"lat": 3.3, "lng": 4.4}'
                }
            ];

            db.all.mockImplementation((query, params, callback) => {
                callback(null, mockDocumentData);
            });

            const result = await getDocumentWithConnections(id);

            expect(db.all).toHaveBeenCalledWith(
                expect.any(String),
                [id],
                expect.any(Function)
            );
            expect(result).toEqual(mockDocumentData);
        });

        test('should handle error when fetching document with connections', async () => {
            const id = 'doc1';
            const errorMessage = 'Error fetching document with connections';

            db.all.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(getDocumentWithConnections(id)).rejects.toThrow(errorMessage);

            expect(db.all).toHaveBeenCalledWith(
                expect.any(String),
                [id],
                expect.any(Function)
            );
        });
    });

    describe('getAllDocuments', () => {
        test('should return all documents with pagination successfully', async () => {
            const documentId = 'doc1';
            const title = 'Test Document';
            const page = 1;
            const size = 10;

            const mockDocuments = [
                {
                    id: 'doc1',
                    title: 'Document 1',
                    description: 'Description of document 1',
                    scale: '1:500',
                    issuanceDate: '2023-01-01',
                    type: 'Type1',
                    language: 'English',
                    coordinates: '{"lat": 1.1, "lng": 2.2}',
                    connections: 0
                },
                {
                    id: 'doc2',
                    title: 'Document 2',
                    description: 'Description of document 2',
                    scale: '1:1000',
                    issuanceDate: '2023-02-01',
                    type: 'Type2',
                    language: 'French',
                    coordinates: '{"lat": 3.3, "lng": 4.4}',
                    connections: 0
                }
            ];

            const mockTotalCount = 2;

            db.get.mockImplementation((query, params, callback) => {
                callback(null, { total: mockTotalCount });
            });

            db.all.mockImplementation((query, params, callback) => {
                callback(null, mockDocuments);
            });

            const result = await getAllDocuments(documentId, title, page, size);

            expect(db.get).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Array),
                expect.any(Function)
            );

            expect(db.all).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Array),
                expect.any(Function)
            );

            expect(result).toEqual({
                data: expect.any(Array),
                pagination: {
                    total: mockTotalCount,
                    totalPages: Math.ceil(mockTotalCount / size),
                    currentPage: page,
                    size,
                    hasNextPage: false,
                    hasPreviousPage: false
                }
            });
        });

        test('should handle error when fetching all documents', async () => {
            const documentId = 'doc1';
            const title = 'Test Document';
            const page = 1;
            const size = 10;
            const errorMessage = 'Error fetching documents';

            db.get.mockImplementation((query, params, callback) => {
                callback(new Error(errorMessage));
            });

            await expect(getAllDocuments(documentId, title, page, size)).rejects.toThrow(errorMessage);

            expect(db.get).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Array),
                expect.any(Function)
            );
        });
    });
    describe('Document DAO', () => {
        describe('convertToISODate', () => {
            test('should convert date to ISO format', () => {
                const dateStr = '31-12-2023';
                const result = convertToISODate(dateStr);
                expect(result).toBe('2023-12-31');
            });
    
            test('should return null if dateStr is not provided', () => {
                const result = convertToISODate(null);
                expect(result).toBeNull();
            });
        });
    
        describe('addType', () => {
            test('should add a type successfully', async () => {
                const type = { id: '1', name: 'Type1' };
    
                db.run.mockImplementation((query, params, callback) => {
                    callback(null);
                });
    
                await expect(addType(type)).resolves.toBeUndefined();
                expect(db.run).toHaveBeenCalledWith(
                    'INSERT INTO Type (id, name) VALUES (?, ?)',
                    [type.id, type.name],
                    expect.any(Function)
                );
            });
    
            test('should handle error when adding a type', async () => {
                const type = { id: '1', name: 'Type1' };
                const errorMessage = 'Error adding type';
    
                db.run.mockImplementation((query, params, callback) => {
                    callback(new Error(errorMessage));
                });
    
                await expect(addType(type)).rejects.toThrow(errorMessage);
                expect(db.run).toHaveBeenCalledWith(
                    'INSERT INTO Type (id, name) VALUES (?, ?)',
                    [type.id, type.name],
                    expect.any(Function)
                );
            });
        });
    
        describe('getAllTypes', () => {
            test('should return all types', async () => {
                const mockTypes = [{ name: 'Type1' }, { name: 'Type2' }];
    
                db.all.mockImplementation((query, callback) => {
                    callback(null, mockTypes);
                });
    
                const result = await getAllTypes();
                expect(result).toEqual(mockTypes);
                expect(db.all).toHaveBeenCalledWith(
                    'SELECT name FROM Type',
                    expect.any(Function)
                );
            });
    
            test('should handle error when getting all types', async () => {
                const errorMessage = 'Error getting types';
    
                db.all.mockImplementation((query, callback) => {
                    callback(new Error(errorMessage));
                });
    
                await expect(getAllTypes()).rejects.toThrow(errorMessage);
                expect(db.all).toHaveBeenCalledWith(
                    'SELECT name FROM Type',
                    expect.any(Function)
                );
            });
        });
    
        describe('addStakeHolder', () => {
            test('should add a stakeholder successfully', async () => {
                const stakeholder = { id: '1', name: 'Stakeholder1' };
    
                db.run.mockImplementation((query, params, callback) => {
                    callback(null);
                });
    
                await expect(addStakeHolder(stakeholder)).resolves.toBeUndefined();
                expect(db.run).toHaveBeenCalledWith(
                    'INSERT INTO Stakeholder (id, name) VALUES (?, ?)',
                    [stakeholder.id, stakeholder.name],
                    expect.any(Function)
                );
            });
    
            test('should handle error when adding a stakeholder', async () => {
                const stakeholder = { id: '1', name: 'Stakeholder1' };
                const errorMessage = 'Error adding stakeholder';
    
                db.run.mockImplementation((query, params, callback) => {
                    callback(new Error(errorMessage));
                });
    
                await expect(addStakeHolder(stakeholder)).rejects.toThrow(errorMessage);
                expect(db.run).toHaveBeenCalledWith(
                    'INSERT INTO Stakeholder (id, name) VALUES (?, ?)',
                    [stakeholder.id, stakeholder.name],
                    expect.any(Function)
                );
            });
        });
    
        describe('getAllStakeHolders', () => {
            test('should return all stakeholders', async () => {
                const mockStakeholders = [{ id: '1', name: 'Stakeholder1' }, { id: '2', name: 'Stakeholder2' }];
    
                db.all.mockImplementation((query, callback) => {
                    callback(null, mockStakeholders);
                });
    
                const result = await getAllStakeHolders();
                expect(result).toEqual(mockStakeholders);
                expect(db.all).toHaveBeenCalledWith(
                    'SELECT * FROM Stakeholder',
                    expect.any(Function)
                );
            });
    
            test('should handle error when getting all stakeholders', async () => {
                const errorMessage = 'Error getting stakeholders';
    
                db.all.mockImplementation((query, callback) => {
                    callback(new Error(errorMessage));
                });
    
                await expect(getAllStakeHolders()).rejects.toThrow(errorMessage);
                expect(db.all).toHaveBeenCalledWith(
                    'SELECT * FROM Stakeholder',
                    expect.any(Function)
                );
            });
        });
    
        describe('addScale', () => {
            test('should add a scale successfully', async () => {
                const scale = { id: '1', name: 'Scale1' };
    
                db.run.mockImplementation((query, params, callback) => {
                    callback(null);
                });
    
                await expect(addScale(scale)).resolves.toBeUndefined();
                expect(db.run).toHaveBeenCalledWith(
                    'INSERT INTO Scale (id, name) VALUES (?, ?)',
                    [scale.id, scale.name],
                    expect.any(Function)
                );
            });
    
            test('should handle error when adding a scale', async () => {
                const scale = { id: '1', name: 'Scale1' };
                const errorMessage = 'Error adding scale';
    
                db.run.mockImplementation((query, params, callback) => {
                    callback(new Error(errorMessage));
                });
    
                await expect(addScale(scale)).rejects.toThrow(errorMessage);
                expect(db.run).toHaveBeenCalledWith(
                    'INSERT INTO Scale (id, name) VALUES (?, ?)',
                    [scale.id, scale.name],
                    expect.any(Function)
                );
            });
        });
    
        describe('getAllScales', () => {
            test('should return all scales', async () => {
                const mockScales = [{ id: '1', name: 'Scale1' }, { id: '2', name: 'Scale2' }];
    
                db.all.mockImplementation((query, callback) => {
                    callback(null, mockScales);
                });
    
                const result = await getAllScales();
                expect(result).toEqual(mockScales);
                expect(db.all).toHaveBeenCalledWith(
                    'SELECT * FROM Scale',
                    expect.any(Function)
                );
            });
    
            test('should handle error when getting all scales', async () => {
                const errorMessage = 'Error getting scales';
    
                db.all.mockImplementation((query, callback) => {
                    callback(new Error(errorMessage));
                });
    
                await expect(getAllScales()).rejects.toThrow(errorMessage);
                expect(db.all).toHaveBeenCalledWith(
                    'SELECT * FROM Scale',
                    expect.any(Function)
                );
            });
        });
    });
});