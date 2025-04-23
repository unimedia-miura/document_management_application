import DocumentService from "../../server/services/documentService";
import DocumentRepository from "../../server/repositories/documentRepository";
import { Prisma } from "../../generated/prisma";
import { Document } from "../../generated/prisma";

const mockDocumentRepository = {
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    getAllDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    deleteDocument: jest.fn(),
} as unknown as DocumentRepository;

const documentService = new DocumentService(mockDocumentRepository);


describe('DocumentService', () => {
    beforeEach(() => {
        (mockDocumentRepository.createDocument as jest.Mock).mockClear();
        (mockDocumentRepository.updateDocument as jest.Mock).mockClear();
        (mockDocumentRepository.getAllDocuments as jest.Mock).mockClear();
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

    describe('getAllDocuments', () => {
        it('RepositoryのgetAllDocumentsを呼び出し、その結果を返すこと', async() => {
            const activeDocuments = [
                {
                    "id": 2,
                    "createdAt": new Date("2025-04-17T08:21:22.555Z"),
                    "updatedAt": new Date("2025-04-17T08:21:22.555Z"),
                    "title": "テスト文書2",
                    "content": "これはテスト文書2の内容です。",
                    "shippingStatus": 1,
                    "delete_flg": false,
                    "deletedAt": null
                },
            ] as Document[];

            (mockDocumentRepository.getAllDocuments as jest.Mock).mockResolvedValue(activeDocuments);

            const result = await documentService.getAllDocuments();

            expect(mockDocumentRepository.getAllDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentRepository.getAllDocuments).toHaveBeenCalledWith({ delete_flg: false });
            expect(result).toEqual(activeDocuments);
        });

        it('RepositoryのgetAllDocumentsがエラーをthrowした場合、Serviceは「Failed to get all documents in documentService」というエラーをthrowすること', async () => {
            const repositoryError = new Error('Failed to get all documents in documentService');
            (mockDocumentRepository.getAllDocuments as jest.Mock).mockRejectedValue(repositoryError);

            await expect(documentService.getAllDocuments()).rejects.toThrow('Failed to get all documents in documentService');
            expect(mockDocumentRepository.getAllDocuments).toHaveBeenCalledWith({ delete_flg: false });
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