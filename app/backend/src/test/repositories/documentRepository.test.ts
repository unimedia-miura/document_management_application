import DocumentRepository from "../../server/repositories/documentRepository";
import { PrismaClient, Document, Prisma } from "../../generated/prisma";

const mockPrisma = {
    document: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
    },
} as unknown as PrismaClient;

const documentRepository = new DocumentRepository(mockPrisma);

describe('DocumentRepository', () => {
    beforeEach(() => {
        (mockPrisma.document.create as jest.Mock).mockClear();
        (mockPrisma.document.update as jest.Mock).mockClear();
        (mockPrisma.document.findMany as jest.Mock).mockClear();
        (mockPrisma.document.findUnique as jest.Mock).mockClear();
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
                published: false
            } as Document;

            (mockPrisma.document.create as jest.Mock).mockResolvedValue(createdDocument);

            const result = await documentRepository.createDocument(createInput);

            expect(mockPrisma.document.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(createdDocument);
        });

        it('Prismaのエラーをキャッチして再スローすること', async () => {
            const createInput = { title: 'Test Document', content: 'This is a test document.' };
            const errorMessage = 'Prisma create error';
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

        it('Prismaのエラーをキャッチして再スローすること', async () => {
            const documentId = 1;
            const updateInput = { title: 'Updated Document', content: 'This document has been updated.' };
            const errorMessage = 'Prisma update error';
            (mockPrisma.document.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.updateDocument(documentId, updateInput)).rejects.toThrow(errorMessage);
            expect(mockPrisma.document.update).toHaveBeenCalledWith({
                where: { id: documentId },
                data: updateInput,
            });
        });
    });

    describe('getAllDocuments', () => {
        it('全ての文書情報を取得し、その配列を返すこと', async() => {
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
            (mockPrisma.document.findMany as jest.Mock).mockResolvedValue(allDocuments);

            const result = await documentRepository.getAllDocuments();

            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
            expect(result).toEqual(allDocuments);
        });

        it('Prismaのエラーをキャッチして再スローすること', async () => {
            const errorMessage = 'Prisma findMany error';
            (mockPrisma.document.findMany as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.getAllDocuments()).rejects.toThrow(errorMessage);
            expect(mockPrisma.document.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('getDocumentById', () => {
        it('指定されたIDの文書が存在する場合、その文書情報を返すこと', async() => {
            const documentId = 1;
            const testDocument =  {
                "id": 1,
                "createdAt": new Date("2025-04-17T06:12:42.001Z"),
                "updatedAt": new Date("2025-04-17T06:12:42.001Z"),
                "title": "テスト文書",
                "content": "これはテスト文書1の内容です。",
                "shippingStatus": 0,
                "published": false
            } as Document;

            (mockPrisma.document.findUnique as jest.Mock).mockResolvedValue(testDocument);

            const result = await documentRepository.getDocumentById(documentId);

            expect(mockPrisma.document.findUnique).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testDocument);
        });

        it('Prismaのエラーをキャッチして再スローすること', async () => {
            const documentId = 1;
            const errorMessage = 'Prisma findUnique error';
            (mockPrisma.document.findUnique as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(documentRepository.getDocumentById(documentId)).rejects.toThrow(errorMessage);
            expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({ where: { id: documentId } });
        });
    });
});