import prisma from "../../../prisma/index";
import { Prisma, Document } from "../../generated/prisma";

class DocumentRepository {
    async createDocument(data: Prisma.DocumentCreateInput): Promise<Document> {
        return prisma.document.create({data});
    }

    async updateDocument(id: number, data: Prisma.DocumentCreateInput): Promise<Document> {
        return prisma.document.update({
            where: { id },
            data
        });
    }

    async getAllDocuments(): Promise<Document[]> {
        return prisma.document.findMany();
    }

    async getDocumentById(id: number): Promise<Document | null> {
        return prisma.document.findUnique({ where: {id: id}});
    }
}

export default new DocumentRepository();