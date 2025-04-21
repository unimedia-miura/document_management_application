import prisma from "../../../prisma/index";
import { Prisma, Document, PrismaClient } from "../../generated/prisma";

class DocumentRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createDocument(data: Prisma.DocumentCreateInput): Promise<Document> {
        return this.prisma.document.create({data});
    }

    async updateDocument(id: number, data: Prisma.DocumentCreateInput): Promise<Document> {
        return this.prisma.document.update({
            where: { id },
            data
        });
    }

    async getAllDocuments(): Promise<Document[]> {
        return this.prisma.document.findMany();
    }

    async getDocumentById(id: number): Promise<Document | null> {
        return this.prisma.document.findUnique({ where: {id: id}});
    }
}

export default DocumentRepository;