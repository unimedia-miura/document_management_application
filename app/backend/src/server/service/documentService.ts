import documentRepository from "../repositories/documentRepository";
import { Prisma, Document } from "../../generated/prisma";

class DocumentService {
    async createDocument(data: Prisma.DocumentCreateInput): Promise<Document> {
        return documentRepository.createDocument(data);
    }
    async updateDocument(id: number, data: Prisma.DocumentCreateInput): Promise<Document> {
        return documentRepository.updateDocument(id, data);
    }
    async getAllDocuments(): Promise<Document[]> {
        return documentRepository.getAllDocuments();
    }
    async getDocumentDetail(id: number) {
        return documentRepository.getDocumentById(id);
    }
}

export default new DocumentService;