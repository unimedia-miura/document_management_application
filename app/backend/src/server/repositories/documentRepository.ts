import prisma from "../../../prisma/index";
import { Prisma, Document } from "../../generated/prisma";

class DocumentRepository {
    async createDocument(data: Prisma.DocumentCreateInput): Promise<Document> {
        return prisma.document.create({data});
    }
}

export default new DocumentRepository();