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

const allDocuments = [
    { id: 1, title: 'Specific Title', content: 'Content 1', shippingStatus: 0, delete_flg: false, createdAt: new Date('2025-04-23T02:13:08.156Z'), updatedAt: new Date('2025-04-23T02:13:08.156Z'), deletedAt: null},
    { id: 2, title: 'Other Title', content: 'Content 2', shippingStatus: 1, delete_flg: false, createdAt: new Date('2025-04-25T02:13:08.156Z'), updatedAt: new Date('2025-04-25T02:13:08.156Z'), deletedAt: null },
    { id: 3, title: 'Specific Title', content: 'Content 3', shippingStatus: 1,  delete_flg: true, createdAt: new Date('2025-05-25T02:13:08.156Z'), updatedAt: new Date('2025-05-25T02:13:08.156Z'), deletedAt: null },
    { id: 4, title: 'Another Title', content: 'Content 4', shippingStatus: 0,  delete_flg: false, createdAt: new Date('2025-06-25T02:13:08.156Z'), updatedAt: new Date('2025-06-25T02:13:08.156Z'), deletedAt: null },
] as Document[];

describe('DocumentRepository', () => {
    beforeEach(() => {
        (mockPrisma.document.create as jest.Mock).mockClear();
        (mockPrisma.document.update as jest.Mock).mockClear();
        (mockPrisma.document.findMany as jest.Mock).mockClear();
        (mockPrisma.document.findUnique as jest.Mock).mockClear();
        (mockPrisma.document.delete as jest.Mock).mockClear();

        (mockPrisma.document.findMany as jest.Mock).mockImplementation(({ where }) => {
            if (!where) {
                return Promise.resolve(allDocuments);
            }
            return Promise.resolve(allDocuments.filter(doc => {
                let matches = true;
                if (where.title && typeof where.title === 'string' && !doc.title.includes(where.title)) {
                    matches = false;
                }
                if (where.delete_flg !== undefined && doc.delete_flg !== where.delete_flg) {
                    matches = false;
                }
                if (where.shippingStatus !== undefined && doc.shippingStatus !== where.shippingStatus) {
                    matches = false;
                }
                if (where.createdAt && typeof where.createdAt === 'object') {
                    if (where.createdAt.gte && doc.createdAt < new Date(where.createdAt.gte)) {
                        matches = false;
                    }
                    if (where.createdAt.lte && doc.createdAt > new Date(where.createdAt.lte)) {
                        matches = false;
                    }
                }
                return matches;
            }));
        });
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

    describe.only('getDocuments', () => {
        it('フィルタリング条件なしで呼び出した場合、全ての文書情報を返すこと', async() => {
            const result = await documentRepository.getDocuments();

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({ where: undefined });
            expect(result).toEqual(allDocuments);
        });

        it('delete_flgでフィルタリングした場合、該当する文書情報のみを返すこと', async() => {
            const whereCondition = { delete_flg: false };
            const result = await documentRepository.getDocuments(whereCondition);

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({ where: whereCondition });
            expect(result).toEqual([allDocuments[0], allDocuments[1], allDocuments[3]]);
        });

        it('titleでフィルタリングした場合、部分一致で該当する文書情報のみを返すこと', async() => {
            const whereCondition = { title: 'Specific' };
            const result = await documentRepository.getDocuments(whereCondition);

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({ where: whereCondition });
            expect(result).toEqual([allDocuments[0], allDocuments[2]]);
        });

        it('shippingStatusでフィルタリングした場合、該当する文書情報のみを返すこと', async() => {
            const whereCondition = { shippingStatus: 0 };
            const result = await documentRepository.getDocuments(whereCondition);

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({ where: whereCondition });
            expect(result).toEqual([allDocuments[0], allDocuments[3]]);
        });

        it('createdAtでフィルタリングした場合、範囲絞り込みで該当する文書情報のみを返すこと', async() => {
            const fromDate = new Date('2025-04-24T00:00:00.000Z');
            const toDate = new Date('2025-04-25T23:59:59.999Z');
            const whereCondition = {
                createdAt:{
                    gte: fromDate.toISOString(),
                    lte: toDate.toISOString(),
                }
            };
            const result = await documentRepository.getDocuments(whereCondition);

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({ where: whereCondition });
            expect(result).toEqual([allDocuments[1]]);
        });

        it('フィルタリング条件に一致する文書情報がない場合、空の配列を返すこと', async () => {
            const whereCondition = { title: 'Non Existing Title' };
            const result = await documentRepository.getDocuments(whereCondition);

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.document.findMany).toHaveBeenCalledWith({ where: whereCondition });
            expect(result).toEqual([]);
        });

        it('文書情報取得中のエラーをキャッチし、「Faild to fetch documents」というエラーをthrowすること', async () => {
            const errorMessage = 'Faild to fetch documents';
            (mockPrisma.document.findMany as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.getDocuments()).rejects.toThrow(errorMessage);
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