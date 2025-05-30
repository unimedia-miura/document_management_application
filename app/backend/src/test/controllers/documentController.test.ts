import DocumentController from "../../server/controllers/documentController";
import DocumentService from "../../server/services/documentService";
import { Request, Response} from "express";
import { Prisma, Document } from "../../generated/prisma";
import { validationResult } from "express-validator";

const mockDocumentService = {
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    getDocuments: jest.fn(),
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
        (mockDocumentService.getDocuments as jest.Mock).mockClear();
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
                    deletedAt: null,
                    delete_flg: false
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
        const allDocuments = [
            { id: 1, title: 'Specific Title', content: 'Content 1', shippingStatus: 0, delete_flg: false, createdAt: new Date('2025-04-23T02:13:08.156Z'), updatedAt: new Date('2025-04-23T02:13:08.156Z'), deletedAt: null},
            { id: 2, title: 'Other Title', content: 'Content 2', shippingStatus: 1, delete_flg: false, createdAt: new Date('2025-04-25T02:13:08.156Z'), updatedAt: new Date('2025-04-25T02:13:08.156Z'), deletedAt: null },
            { id: 3, title: 'Specific Title', content: 'Content 3', shippingStatus: 1,  delete_flg: true, createdAt: new Date('2025-05-25T02:13:08.156Z'), updatedAt: new Date('2025-05-25T02:13:08.156Z'), deletedAt: null },
            { id: 4, title: 'Another Title', content: 'Content 4', shippingStatus: 0,  delete_flg: false, createdAt: new Date('2025-06-25T02:13:08.156Z'), updatedAt: new Date('2025-06-25T02:13:08.156Z'), deletedAt: null },
        ] as Document[];
        beforeEach(() => {
            mockRequest = {
                query: {},
            }
        });
        it('params設定なしの場合、params:{}でSeriviceのgetDocumentsを呼び出すこと', async() => {

            await documentController.getDocuments(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentService.getDocuments).toHaveBeenCalledWith({});
            expect(mockStatus).toHaveBeenCalledWith(200);
        });

        it('paramsにtitleを設定した場合、titleを条件としてSeriviceのgetDocumentsを呼び出すこと', async() => {
            mockRequest.query = { title: 'Specific Title' };
            await documentController.getDocuments(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentService.getDocuments).toHaveBeenCalledWith({ title: 'Specific Title' });
            expect(mockStatus).toHaveBeenCalledWith(200);
        });

        it('paramsにshippingStatusを設定した場合、shippingStatusを条件としてSeriviceのgetDocumentsを呼び出すこと', async() => {
            mockRequest.query = { shippingStatus: '0' };
            await documentController.getDocuments(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentService.getDocuments).toHaveBeenCalledWith({ shippingStatus: 0 });
            expect(mockStatus).toHaveBeenCalledWith(200);
        });

        it('paramsにcreatedAt（createdAtFrom, createdAtTo）を設定した場合、createdAtを条件としてSeriviceのgetDocumentsを呼び出すこと', async() => {
            const fromDate = '2025-04-24T00:00:00.000Z';
            const toDate = '2025-04-25T23:59:59.999Z';
            mockRequest.query = { createdAtFrom: fromDate, createdAtTo: toDate };
            await documentController.getDocuments(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentService.getDocuments).toHaveBeenCalledWith({ createdAtFrom: new Date(fromDate), createdAtTo: new Date(toDate) });
            expect(mockStatus).toHaveBeenCalledWith(200);
        });

        it('複数項目を条件とした場合、SeriviceのgetDocumentsを呼び出し、成功時に200と該当する文書情報のみ返すこと', async() => {
            const fromDate = '2025-04-24T00:00:00.000Z';
            mockRequest.query = { title: 'Specific Title', shippingStatus: '0', createdAtFrom: fromDate };
            (mockDocumentService.getDocuments as jest.Mock).mockResolvedValue(allDocuments[0])

            await documentController.getDocuments(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentService.getDocuments).toHaveBeenCalledWith({ title: 'Specific Title', shippingStatus: 0, createdAtFrom: new Date(fromDate) });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(allDocuments[0]);
        });

        it('条件に一致する文書情報がない場合、SeriviceのgetDocumentsを呼び出し、成功時に200と空の配列を返すこと', async() => {
            mockRequest.query = { title: 'NonExistent' };
            (mockDocumentService.getDocuments as jest.Mock).mockResolvedValue([]);

            await documentController.getDocuments(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentService.getDocuments).toHaveBeenCalledWith({ title: 'NonExistent' });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith([]);
        });

        it('Serviceがエラーをthrowした場合、500 Internal Server Errorとエラーメッセージを返すこと', async () => {
            const serviceError = new Error('Failed to create document in documentService');
            (mockDocumentService.getDocuments as jest.Mock).mockRejectedValue(serviceError);

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
        it('バリデーションに成功し、SeriviceのgetDocumentDetailを呼び出し、成功時に200と更新された文書情報を返すこと', async() => {
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

            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            (mockDocumentService.getDocumentDetail as jest.Mock).mockResolvedValue(testDocument);
            mockRequest.params = { id: documentId.toString() };

            await documentController.getDocumentDetail(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.getDocumentDetail).toHaveBeenCalledWith(documentId);
            expect(mockDocumentService.getDocumentDetail).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testDocument);
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
        it('バリデーションに成功し、SeriviceのdeleteDocumentを呼び出し、成功時に204と論理削除された文書情報を返すこと', async() => {
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

            (mockDocumentService.deleteDocument as jest.Mock).mockResolvedValue(updatedDocument);
            (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
            mockRequest.params = { id: documentId.toString() };

            await documentController.deleteDocument(mockRequest as Request, mockResponse as Response);

            expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith(documentId);
            expect(mockDocumentService.deleteDocument).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(204);
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