import DocumentRepository from "../../server/repositories/documentRepository";
import { PrismaClient, Document, Prisma } from "../../generated/prisma";

const mockPrisma = {
    document: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn()
    },
} as unknown as PrismaClient;

const documentRepository = new DocumentRepository(mockPrisma);

describe('DocumentRepository', () => {
    beforeEach(() => {
        (mockPrisma.document.create as jest.Mock).mockClear();
        (mockPrisma.document.update as jest.Mock).mockClear();
        (mockPrisma.document.findMany as jest.Mock).mockClear();
        (mockPrisma.document.findUnique as jest.Mock).mockClear();
        (mockPrisma.document.delete as jest.Mock).mockClear();
    });

    describe('createDocument', () => {
        it('新規文書を作成し、作成された文書情報を返すこと', async() => {
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
                delete_flg: false,
                deletedAt: null
            } as Document;

            (mockPrisma.document.create as jest.Mock).mockResolvedValue(createdDocument);

            const result = await documentRepository.createDocument(createInput);

            expect(mockPrisma.document.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(createdDocument);
        });

        it('文書作成処理中のエラーをキャッチし、「Failed to create document」というエラーをthrowすること', async () => {
            const createInput = { title: 'Test Document', content: 'This is a test document.' };
            const errorMessage = 'Failed to create document';
            (mockPrisma.document.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.createDocument(createInput)).rejects.toThrow(errorMessage);
            expect(mockPrisma.document.create).toHaveBeenCalledWith({ data: createInput });
        });
    });

    describe('updateDocument', () => {
        it('指定されたIDの文書を更新し、更新された文書情報を返すこと', async() => {
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

            (mockPrisma.document.update as jest.Mock).mockResolvedValue(updatedDocument);

            const result = await documentRepository.updateDocument(documentId, updateInput);

            expect(mockPrisma.document.update).toHaveBeenCalledTimes(1);
            expect(result).toEqual(updatedDocument);
        });

        it('文書更新処理中のエラーをキャッチし、「Failed to update document」というエラーをthrowすること', async () => {
            const documentId = 1;
            const updateInput = { title: 'Updated Document', content: 'This document has been updated.', shippingStatus: 0 };
            const errorMessage = 'Failed to update document';
            (mockPrisma.document.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.updateDocument(documentId, updateInput)).rejects.toThrow(errorMessage);
            expect(mockPrisma.document.update).toHaveBeenCalledWith({
                where: { id: documentId },
                data: updateInput,
            });
        });
    });

    describe('getAllDocuments', () => {
        it('フィルタリング条件なしで呼び出した場合、全ての文書情報を取得し、その配列を返すこと', async() => {
            const allDocuments = [
                {
                    "id": 1,
                    "createdAt": new Date("2025-04-17T06:12:42.001Z"),
                    "updatedAt": new Date("2025-04-17T06:12:42.001Z"),
                    "title": "テスト文書",
                    "content": "これはテスト文書1の内容です。",
                    "shippingStatus": 0,
                    "delete_flg": false,
                    "deletedAt": null
                },
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
            (mockPrisma.document.findMany as jest.Mock).mockResolvedValue(allDocuments);

            const result = await documentRepository.getAllDocuments();

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({ where: undefined });
            expect(result).toEqual(allDocuments);
        });

        it('フィルタリング条件ありで呼び出した場合、その条件で検索された文書情報を取得し、その配列を返すこと', async() => {
            const activeDocuments = [
                {
                    "id": 1,
                    "createdAt": new Date("2025-04-17T06:12:42.001Z"),
                    "updatedAt": new Date("2025-04-17T06:12:42.001Z"),
                    "title": "テスト文書",
                    "content": "これはテスト文書1の内容です。",
                    "shippingStatus": 0,
                    "delete_flg": false,
                    "deletedAt": new Date("2025-04-23T06:12:42.001Z")
                },
            ] as Document[];
            const whereCondition = { delete_flg: false };
            (mockPrisma.document.findMany as jest.Mock).mockResolvedValue(activeDocuments);

            const result = await documentRepository.getAllDocuments(whereCondition);

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({ where: whereCondition });
            expect(result).toEqual(activeDocuments);
        });

        it('文書情報取得中のエラーをキャッチし、「Faild to fetch documents」というエラーをthrowすること', async () => {
            const errorMessage = 'Faild to fetch documents';
            (mockPrisma.document.findMany as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.getAllDocuments()).rejects.toThrow(errorMessage);
            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('getDocumentById', () => {
        it('指定されたIDの文書が存在する場合、その文書情報を返すこと', async() => {
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

            (mockPrisma.document.findUnique as jest.Mock).mockResolvedValue(testDocument);

            const result = await documentRepository.getDocumentById(documentId);

            expect(mockPrisma.document.findUnique).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testDocument);
        });

        it('指定されたIDのドキュメントが存在しない場合、nullを返すこと', async () => {
            const documentId = 99;
            (mockPrisma.document.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await documentRepository.getDocumentById(documentId);

            expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({ where: { id: documentId } });
            expect(result).toBeNull();
        });

        it('文書情報取得中のエラーをキャッチし、「Faild to fetch document by ID」というエラーをthrowすること', async () => {
            const documentId = 1;
            const errorMessage = 'Faild to fetch document by ID';
            (mockPrisma.document.findUnique as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.getDocumentById(documentId)).rejects.toThrow(errorMessage);
            expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({ where: { id: documentId } });
        });
    });

    describe('deleteDocument', () => {
        it('指定されたIDの文書を論理削除し、更新された文書情報を返すこと', async() => {
            const documentId = 1;
            const deletedDate = new Date();
            const updatedDocument = {
                id: documentId,
                createdAt: new Date("2025-04-17T06:12:42.001Z"),
                updatedAt: new Date("2025-04-17T06:12:42.001Z"),
                title: "テスト文書",
                content: "これはテスト文書1の内容です。",
                shippingStatus: 0,
                delete_flg: true,
                deletedAt: deletedDate,
            } as Document;

            (mockPrisma.document.update as jest.Mock).mockResolvedValue(updatedDocument);

            const result = await documentRepository.deleteDocument(documentId);

            expect(mockPrisma.document.update).toHaveBeenCalledTimes(1);
            expect(result).toEqual(updatedDocument);
        });

        it('指定されたIDのドキュメントが存在しない場合、nullを返すこと', async () => {
            const documentId = 99;
            const deletedTime = new Date();
            (mockPrisma.document.update as jest.Mock).mockResolvedValue(null);

            const result = await documentRepository.deleteDocument(documentId);

            expect(mockPrisma.document.update).toHaveBeenCalledWith({ where: { id: documentId },
                data: {
                    delete_flg: true,
                    deletedAt: deletedTime,
                }
            });
            expect(result).toBeNull();
        });

        it('文書更新処理中のエラーをキャッチし、「Failed to delete document」というエラーをthrowすること', async () => {
            const documentId = 1;
            const deletedDate = new Date();
            const errorMessage = 'Failed to delete document';
            (mockPrisma.document.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.deleteDocument(documentId)).rejects.toThrow(errorMessage);
            expect(mockPrisma.document.update).toHaveBeenCalledWith({
                where: { id: documentId },
                data: {
                    delete_flg: true,
                    deletedAt: deletedDate,
                },
            });
        });
    });
});