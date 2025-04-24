import DocumentService from "../../server/services/documentService";
import DocumentRepository from "../../server/repositories/documentRepository";
import { Prisma } from "../../generated/prisma";
import { Document } from "../../generated/prisma";

const mockDocumentRepository = {
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    deleteDocument: jest.fn(),
} as unknown as DocumentRepository;

const documentService = new DocumentService(mockDocumentRepository);

describe('DocumentService', () => {
    beforeEach(() => {
        (mockDocumentRepository.createDocument as jest.Mock).mockClear();
        (mockDocumentRepository.updateDocument as jest.Mock).mockClear();
        (mockDocumentRepository.getDocuments as jest.Mock).mockClear();
        (mockDocumentRepository.getDocumentById as jest.Mock).mockClear();
        (mockDocumentRepository.deleteDocument as jest.Mock).mockClear();
    });

    describe('createDocument', () => {
        it('RepositoryのcreateDocumentを呼び出し、その結果を返すこと', async() => {
            const createInput = {
                title: 'Test Document',
                content: 'This is a test document.',
                shippingStatus: 0
            } as Prisma.DocumentCreateInput;
            const createdDocument = {
                id: 1,
                ...createInput,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                delete_flg: false
            } as Document;

            (mockDocumentRepository.createDocument as jest.Mock).mockResolvedValue(createdDocument);

            const result = await documentService.createDocument(createInput);

            expect(mockDocumentRepository.createDocument).toHaveBeenCalledTimes(1);
            expect(result).toEqual(createdDocument);
        });

        it('RepositoryのcreateDocumentがエラーをthrowした場合、Serviceは「Failed to create document in documentService」というエラーをthrowすること', async () => {
            const createInput = { title: 'Test Document', content: 'Test Content' };
            const repositoryError = new Error('Failed to create document in documentService');
            (mockDocumentRepository.createDocument as jest.Mock).mockRejectedValue(repositoryError);

            await expect(documentService.createDocument(createInput)).rejects.toThrow('Failed to create document in documentService');
            expect(mockDocumentRepository.createDocument).toHaveBeenCalledWith(createInput);
        });
    });

    describe('updateDocument', () => {
        it('RepositoryのupdateDocumentを呼び出し、その結果を返すこと', async() => {
            const documentId = 1;
            const updateInput = {
                title: 'Updated Document',
                content: 'This document has been updated.',
                shippingStatus: 1
            } as Prisma.DocumentCreateInput;
            const updatedDocument = {
                id: documentId,
                ...updateInput,
            } as Document;

            (mockDocumentRepository.updateDocument as jest.Mock).mockResolvedValue(updatedDocument);

            const result = await documentService.updateDocument(documentId, updateInput);

            expect(mockDocumentRepository.updateDocument).toHaveBeenCalledTimes(1);
            expect(result).toEqual(updatedDocument);
        });

        it('RepositoryのupdateDocumentがエラーをthrowした場合、Serviceは「Failed to update document in documentService」というエラーをthrowすること', async () => {
            const documentId = 1;
            const updateInput = { title: 'Updated Document', content: 'This document has been updated.', shippingStatus: 0 };
            const repositoryError = new Error('Failed to create document in documentService');
            (mockDocumentRepository.updateDocument as jest.Mock).mockRejectedValue(repositoryError);

            await expect(documentService.updateDocument(documentId, updateInput)).rejects.toThrow('Failed to create document in documentService');
            expect(mockDocumentRepository.updateDocument).toHaveBeenCalledWith(documentId, updateInput);
        });
    });

    describe('getDocuments', () => {
        const allDocuments = [
            { id: 1, title: 'Specific Title', content: 'Content 1', shippingStatus: 0, delete_flg: false, createdAt: new Date('2025-04-23T02:13:08.156Z'), updatedAt: new Date('2025-04-23T02:13:08.156Z'), deletedAt: null},
            { id: 2, title: 'Other Title', content: 'Content 2', shippingStatus: 1, delete_flg: false, createdAt: new Date('2025-04-25T02:13:08.156Z'), updatedAt: new Date('2025-04-25T02:13:08.156Z'), deletedAt: null },
            { id: 3, title: 'Specific Title', content: 'Content 3', shippingStatus: 1,  delete_flg: true, createdAt: new Date('2025-05-25T02:13:08.156Z'), updatedAt: new Date('2025-05-25T02:13:08.156Z'), deletedAt: null },
            { id: 4, title: 'Another Title', content: 'Content 4', shippingStatus: 0,  delete_flg: false, createdAt: new Date('2025-06-25T02:13:08.156Z'), updatedAt: new Date('2025-06-25T02:13:08.156Z'), deletedAt: null },
        ] as Document[];
        let defaultWhereCondition:Prisma.DocumentWhereInput;
        beforeEach(() => {
            defaultWhereCondition = { "delete_flg": false };
        });

        it('フィルタリング条件なしで呼び出した場合、delete_flg: falseの条件でdocumentRepository.getDocumentsを呼び出すこと', async() => {
            await documentService.getDocuments();

            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledWith(defaultWhereCondition);
        });

        it('titleを指定した場合、titleを条件としてdocumentRepository.getDocumentsを呼び出すこと', async() => {
            const params = { title: 'Specific Title' };
            const whereConditions = Object.assign(defaultWhereCondition, {
                title: {
                    contains: params.title
                }
            });

            await documentService.getDocuments(params);

            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledWith(whereConditions);
        });

        it('shippingStatusを指定した場合、shippingStatusを条件としてdocumentRepository.getDocumentsを呼び出すこと', async() => {
            const params = { shippingStatus: 0 };
            const whereConditions = Object.assign(defaultWhereCondition, params);

            await documentService.getDocuments(params);

            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledWith(whereConditions);
        });

        it('createdAt（createdAtFrom, createdAtTo）を指定した場合、createdAt（createdAtFrom, createdAtTo）を条件としてdocumentRepository.getDocumentsを呼び出すこと', async() => {
            const fromDate = new Date('2025-04-24T00:00:00.000Z');
            const toDate = new Date('2025-04-25T23:59:59.999Z');
            const params = { createdAtFrom: fromDate, createdAtTo: toDate };
            const whereConditions = Object.assign(defaultWhereCondition, {
                createdAt: {
                    gte: params.createdAtFrom,
                    lte: params.createdAtTo
                }
            });

            await documentService.getDocuments(params);

            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledWith(whereConditions);
        });

        it('複数項目を条件とした場合、該当する文書情報のみ返すこと', async() => {
            const fromDate = new Date('2025-04-24T00:00:00.000Z');
            const params = { title: 'Specific Title', shippingStatus: 0, createdAtFrom: fromDate };
            const whereConditions = Object.assign(defaultWhereCondition,
                {
                    title: {
                        contains: params.title
                    },
                    shippingStatus: params.shippingStatus,
                    createdAt: {
                        gte: params.createdAtFrom,
                    }
                });
            (mockDocumentRepository.getDocuments as jest.Mock).mockResolvedValue(allDocuments[0])

            const result = await documentService.getDocuments(params);

            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledWith(whereConditions);
            expect(result).toEqual(allDocuments[0]);
        });

        it('フィルタリング条件に一致する文書情報がない場合、空の配列を返すこと', async() => {
            const params = { title: 'NonExistent' };
            const whereConditions = Object.assign(defaultWhereCondition, {
                title: {
                    contains: params.title
                }
            });
            (mockDocumentRepository.getDocuments as jest.Mock).mockResolvedValue([])

            const result = await documentService.getDocuments(params);

            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledWith(whereConditions);
            expect(result).toEqual([]);
        });

        it('RepositoryのgetDocumentsがエラーをthrowした場合、Serviceは「Failed to get all documents in documentService」というエラーをthrowすること', async () => {
            const repositoryError = new Error('Failed to get all documents in documentService');
            (mockDocumentRepository.getDocuments as jest.Mock).mockRejectedValue(repositoryError);

            await expect(documentService.getDocuments()).rejects.toThrow('Failed to get all documents in documentService');
            expect(mockDocumentRepository.getDocuments).toHaveBeenCalledWith(defaultWhereCondition);
        });
    });

    describe('getDocumentById', () => {
        it('RepositoryのgetDocumentByIdを呼び出し、その結果を返すこと', async() => {
            const documentId = 1;
            const testDocument =  {
                "id": documentId,
                "createdAt": new Date("2025-04-17T06:12:42.001Z"),
                "updatedAt": new Date("2025-04-17T06:12:42.001Z"),
                "deletedAt": null,
                "title": "テスト文書",
                "content": "これはテスト文書1の内容です。",
                "shippingStatus": 0,
                "delete_flg": false,
            } as Document;

            (mockDocumentRepository.getDocumentById as jest.Mock).mockResolvedValue(testDocument);

            const result = await documentService.getDocumentDetail(documentId);

            expect(mockDocumentRepository.getDocumentById).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testDocument);
        });

        it('指定されたIDのドキュメントが存在しない場合、nullを返すこと', async () => {
            const documentId = 99;
            (mockDocumentRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            const result = await documentService.getDocumentDetail(documentId);

            expect(mockDocumentRepository.getDocumentById).toHaveBeenCalledWith(documentId);
            expect(result).toBeNull();
        });

        it('Repositoryのがエラーをthrowした場合、Serviceは「Failed to get document by ID in documentService」というエラーをthrowすること', async () => {
            const documentId = 1;
            const repositoryError = new Error('Failed to get document by ID in documentService');
            (mockDocumentRepository.getDocumentById as jest.Mock).mockRejectedValue(repositoryError);

            await expect(documentService.getDocumentDetail(documentId)).rejects.toThrow('Failed to get document by ID in documentService');
            expect(mockDocumentRepository.getDocumentById).toHaveBeenCalledWith(documentId);
        });
    });

    describe('deleteDocument', () => {
        it('RepositoryのdeleteDocumentを呼び出し、その結果を返すこと', async() => {
            const documentId = 1;
            const updatedDocument = {
                id: documentId,
                createdAt: new Date("2025-04-17T06:12:42.001Z"),
                updatedAt: new Date("2025-04-17T06:12:42.001Z"),
                title: "テスト文書",
                content: "これはテスト文書1の内容です。",
                shippingStatus: 0,
                delete_flg: true,
                deletedAt: new Date(),
            } as Document;

            (mockDocumentRepository.deleteDocument as jest.Mock).mockResolvedValue(updatedDocument);

            const result = await documentService.deleteDocument(documentId);

            expect(mockDocumentRepository.deleteDocument).toHaveBeenCalledTimes(1);
            expect(result).toEqual(updatedDocument);
        });

        it('指定されたIDのドキュメントが存在しない場合、nullを返すこと', async () => {
            const documentId = 99;
            (mockDocumentRepository.deleteDocument as jest.Mock).mockResolvedValue(null);

            const result = await documentService.deleteDocument(documentId);

            expect(mockDocumentRepository.deleteDocument).toHaveBeenCalledWith(documentId);
            expect(result).toBeNull();
        });

        it('Repositoryのがエラーをthrowした場合、Serviceは「Failed to delete document in documentService」というエラーをthrowすること', async () => {
            const documentId = 1;
            const repositoryError = new Error('Failed to delete document in documentService');
            (mockDocumentRepository.deleteDocument as jest.Mock).mockRejectedValue(repositoryError);

            await expect(documentService.deleteDocument(documentId)).rejects.toThrow('Failed to delete document in documentService');
            expect(mockDocumentRepository.deleteDocument).toHaveBeenCalledWith(documentId);
        });
    });

});