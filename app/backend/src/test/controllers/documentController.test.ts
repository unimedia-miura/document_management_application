import DocumentController from "../../server/controllers/documentController";
import DocumentService from "../../server/services/documentService";
import { Request, Response} from "express";
import { Prisma, Document } from "../../generated/prisma";
import { validationResult } from "express-validator";

const mockDocumentService = {
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    getAllDocuments: jest.fn(),
    getDocumentDetail: jest.fn(),
    deleteDocument: jest.fn(),
} as unknown as DocumentService;

jest.mock('express-validator');

describe('DocumentController', () => {
    let documentController: DocumentController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockJson = jest.fn();
    const mockStatus = jest.fn(() => ({ json: mockJson } as any));
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        documentController = new DocumentController(mockDocumentService);
        mockRequest = {};
        mockResponse = {
            status: mockStatus,
            json: mockJson,
        } as Partial<Response>;
        mockJson.mockClear();
        mockStatus.mockClear();
        mockConsoleError.mockClear();
        (mockDocumentService.createDocument as jest.Mock).mockClear();
        (mockDocumentService.updateDocument as jest.Mock).mockClear();
        (mockDocumentService.getAllDocuments as jest.Mock).mockClear();
        (mockDocumentService.getDocumentDetail as jest.Mock).mockClear();
        (mockDocumentService.deleteDocument as jest.Mock).mockClear();
    });

    describe('createDocument', () => {
            it('バリデーションに成功し、SeriviceのcreateDocumentを呼び出し、成功時に201と作成された文書情報を返すこと', async() => {
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
                    published: false
                } as Document;
    
                (mockDocumentService.createDocument as jest.Mock).mockResolvedValue(createdDocument);
                mockRequest.body = createInput;
                (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
    
                await documentController.createDocument(mockRequest as Request, mockResponse as Response);

                expect(validationResult).toHaveBeenCalledWith(mockRequest);
                expect(mockDocumentService.createDocument).toHaveBeenCalledTimes(1);
                expect(mockStatus).toHaveBeenCalledWith(201);
                expect(mockJson).toHaveBeenCalledWith(createdDocument);
            });

            it('バリデーションエラーがある場合、400 Bad Requestとエラー配列を返すこと', async() => {
                const mockErrors = {
                    isEmpty: jest.fn().mockReturnValue(false),
                    array: jest.fn().mockReturnValue([{
                        msg: 'Validation error'
                    }])
                };
                (validationResult as unknown as jest.Mock).mockReturnValue(mockErrors);

                await documentController.createDocument(mockRequest as Request, mockResponse as Response);

                expect(validationResult).toHaveBeenCalledWith(mockRequest);
                expect(mockStatus).toHaveBeenCalledWith(400);
                expect(mockJson).toHaveBeenCalledWith({ errors: [{
                    msg: 'Validation error'
                }]});
                expect(mockDocumentService.createDocument).not.toHaveBeenCalled();
            });

            it('バリデーションに成功し、Serviceがエラーをthrowした場合、500 Internal Server Errorとエラーメッセージを返すこと', async () => {
                const createInput = {
                    title: 'Test Document',
                    content: 'This is a test document.',
                    shippingStatus: 0
                } as Prisma.DocumentCreateInput;
                const serviceError = new Error('Failed to create document in documentService');
                (mockDocumentService.createDocument as jest.Mock).mockRejectedValue(serviceError);
                mockRequest.body = createInput;
                (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

                await documentController.createDocument(mockRequest as Request, mockResponse as Response);

                expect(validationResult).toHaveBeenCalledWith(mockRequest);
                expect(mockDocumentService.createDocument).toHaveBeenCalledWith(createInput);
                expect(mockStatus).toHaveBeenCalledWith(500);
                expect(mockJson).toHaveBeenCalledWith({
                    error: 'Error creating document'
                });
                expect(mockConsoleError).toHaveBeenCalledTimes(1);
                expect(mockConsoleError).toHaveBeenCalledWith("Error create document:", serviceError);
            });
    });

    describe('updateDocument', () => {
        it('バリデーションに成功し、SeriviceのupdateDocumentを呼び出し、成功時に204と更新された文書情報を返すこと', async() => {
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

            (mockDocumentService.updateDocument as jest.Mock).mockResolvedValue(updatedDocument);
            mockRequest.params = { id: documentId.toString() };
            mockRequest.body = updateInput;
            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

            await documentController.updateDocument(mockRequest as Request, mockResponse as Response);

            expect(validationResult).toHaveBeenCalledWith(mockRequest);
            expect(mockDocumentService.updateDocument).toHaveBeenCalledWith(documentId, updateInput);
            expect(mockDocumentService.updateDocument).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockJson).not.toHaveBeenCalledWith();
        });

        it('バリデーションエラーがある場合、400 Bad Requestとエラー配列を返すこと', async() => {
            const mockErrors = {
                isEmpty: jest.fn().mockReturnValue(false),
                array: jest.fn().mockReturnValue([{
                    msg: 'Validation error'
                }])
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(mockErrors);

            await documentController.updateDocument(mockRequest as Request, mockResponse as Response);

            expect(validationResult).toHaveBeenCalledWith(mockRequest);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ errors: [{
                msg: 'Validation error'
            }]});
            expect(mockDocumentService.updateDocument).not.toHaveBeenCalled();
        });

        it('IDが数値でない場合、400 Bad Requestと「Invalid ID」エラーを返すこと', async () => {
            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            mockRequest.params = { id: 'abc' };
            mockRequest.body = {};

            await documentController.updateDocument(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid ID' });
            expect(mockDocumentService.updateDocument).not.toHaveBeenCalled();
        });

        it('バリデーションに成功し、Serviceがエラーをthrowした場合、500 Internal Server Errorとエラーメッセージを返すこと', async () => {
            const documentId = 1;
            const updateInput = {
                title: 'Updated Document',
                content: 'This document has been updated.',
                shippingStatus: 1
            } as Prisma.DocumentCreateInput;
            const serviceError = new Error('Failed to update document in documentService');
            mockRequest.params = { id: documentId.toString() };
            mockRequest.body = updateInput;
            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            (mockDocumentService.updateDocument as jest.Mock).mockRejectedValue(serviceError);

            await documentController.updateDocument(mockRequest as Request, mockResponse as Response);

            expect(validationResult).toHaveBeenCalledWith(mockRequest);
            expect(mockDocumentService.updateDocument).toHaveBeenCalledWith(documentId, updateInput);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Error updating document'
            });
            expect(mockConsoleError).toHaveBeenCalledTimes(1);
            expect(mockConsoleError).toHaveBeenCalledWith("Error update document:", serviceError);
        });
    });

    describe('getDocuments', () => {
        it('SeriviceのgetAllDocumentsを呼び出し、成功時に200と取得した文書情報配列を返すこと', async() => {
            const allDocuments = [
                {
                    "id": 1,
                    "createdAt": new Date("2025-04-17T06:12:42.001Z"),
                    "updatedAt": new Date("2025-04-17T06:12:42.001Z"),
                    "title": "テスト文書",
                    "content": "これはテスト文書1の内容です。",
                    "shippingStatus": 0,
                    "published": false
                },
                {
                    "id": 2,
                    "createdAt": new Date("2025-04-17T08:21:22.555Z"),
                    "updatedAt": new Date("2025-04-17T08:21:22.555Z"),
                    "title": "テスト文書2",
                    "content": "これはテスト文書2の内容です。",
                    "shippingStatus": 1,
                    "published": false
                },
            ] as Document[];

            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            (mockDocumentService.getAllDocuments as jest.Mock).mockResolvedValue(allDocuments);

            await documentController.getDocuments(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getAllDocuments).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(allDocuments);
        });

        it('Serviceがエラーをthrowした場合、500 Internal Server Errorとエラーメッセージを返すこと', async () => {
            const serviceError = new Error('Failed to create document in documentService');
            (mockDocumentService.getAllDocuments as jest.Mock).mockRejectedValue(serviceError);

            await documentController.getDocuments(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Error fetching documents'
            });
            expect(mockConsoleError).toHaveBeenCalledTimes(1);
            expect(mockConsoleError).toHaveBeenCalledWith("Error fetching documents:", serviceError);
        });
    });

    describe('getDocumentDetail', () => {
        it('バリデーションに成功し、SeriviceのgetDocumentDetailを呼び出し、成功時に204と更新された文書情報を返すこと', async() => {
            const documentId = 1;
            const testDocument =  {
                "id": documentId,
                "createdAt": new Date("2025-04-17T06:12:42.001Z"),
                "updatedAt": new Date("2025-04-17T06:12:42.001Z"),
                "title": "テスト文書",
                "content": "これはテスト文書1の内容です。",
                "shippingStatus": 0,
                "published": false
            } as Document;

            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            (mockDocumentService.getDocumentDetail as jest.Mock).mockResolvedValue(testDocument);
            mockRequest.params = { id: documentId.toString() };

            await documentController.getDocumentDetail(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocumentDetail).toHaveBeenCalledWith(documentId);
            expect(mockDocumentService.getDocumentDetail).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).not.toHaveBeenCalledWith();
        });

        it('バリデーションエラーがある場合、400 Bad Requestとエラー配列を返すこと', async() => {
            const mockErrors = {
                isEmpty: jest.fn().mockReturnValue(false),
                array: jest.fn().mockReturnValue([{
                    msg: 'Validation error'
                }])
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(mockErrors);

            await documentController.getDocumentDetail(mockRequest as Request, mockResponse as Response);

            expect(validationResult).toHaveBeenCalledWith(mockRequest);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ errors: [{
                msg: 'Validation error'
            }]});
            expect(mockDocumentService.getDocumentDetail).not.toHaveBeenCalled();
        });

        it('IDが数値でない場合、400 Bad Requestと「Invalid ID」エラーを返すこと', async () => {
            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            mockRequest.params = { id: 'abc' };
            mockRequest.body = {};

            await documentController.getDocumentDetail(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid ID' });
            expect(mockDocumentService.getDocumentDetail).not.toHaveBeenCalled();
        });

        it('Serviceがエラーをthrowした場合、500 Internal Server Errorとエラーメッセージを返すこと', async () => {
            const documentId = 1;
            const serviceError = new Error('Failed to get document by ID in documentService');
            mockRequest.params = { id: documentId.toString() };
            (mockDocumentService.getDocumentDetail as jest.Mock).mockRejectedValue(serviceError);

            await documentController.getDocumentDetail(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocumentDetail).toHaveBeenCalledWith(documentId);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Error fetch the document'
            });
            expect(mockConsoleError).toHaveBeenCalledTimes(1);
            expect(mockConsoleError).toHaveBeenCalledWith("Error fetch the document:", serviceError);
        });
    });

    describe('deleteDocument', () => {
        it('バリデーションに成功し、SeriviceのdeleteDocumentを呼び出し、成功時に200と削除された文書情報を返すこと', async() => {
            const documentId = 1;
            const testDocument =  {
                "id": documentId,
                "createdAt": new Date("2025-04-17T06:12:42.001Z"),
                "updatedAt": new Date("2025-04-17T06:12:42.001Z"),
                "title": "テスト文書",
                "content": "これはテスト文書1の内容です。",
                "shippingStatus": 0,
                "published": false
            } as Document;

            (mockDocumentService.deleteDocument as jest.Mock).mockResolvedValue(testDocument);
            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            mockRequest.params = { id: documentId.toString() };

            await documentController.deleteDocument(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith(documentId);
            expect(mockDocumentService.deleteDocument).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).not.toHaveBeenCalledWith();
        });

        it('IDが数値でない場合、400 Bad Requestと「Invalid ID」エラーを返すこと', async () => {
            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            mockRequest.params = { id: 'abc' };
            mockRequest.body = {};

            await documentController.deleteDocument(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid ID' });
            expect(mockDocumentService.deleteDocument).not.toHaveBeenCalled();
        });

        it('Serviceがエラーをthrowした場合、500 Internal Server Errorとエラーメッセージを返すこと', async () => {
            const documentId = 1;
            const serviceError = new Error('Failed to get document by ID in documentService');
            mockRequest.params = { id: documentId.toString() };
            (mockDocumentService.deleteDocument as jest.Mock).mockRejectedValue(serviceError);

            await documentController.deleteDocument(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith(documentId);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Error deleting document'
            });
            expect(mockConsoleError).toHaveBeenCalledTimes(1);
            expect(mockConsoleError).toHaveBeenCalledWith("Error delete document:", serviceError);
        });
    });



});