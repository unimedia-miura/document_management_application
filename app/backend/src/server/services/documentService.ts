import DocumentRepository from "../repositories/documentRepository";
import { Prisma, Document } from "../../generated/prisma";

class DocumentService {
    private documentRepository: DocumentRepository;

    constructor(documentRepository: DocumentRepository) {
        this.documentRepository = documentRepository;
    }

    async createDocument(data: Prisma.DocumentCreateInput): Promise<Document> {
        return this.documentRepository.createDocument(data);
    }
    async updateDocument(id: number, data: Prisma.DocumentCreateInput): Promise<Document> {
        return this.documentRepository.updateDocument(id, data);
    }
    async getAllDocuments(): Promise<Document[]> {
        return this.documentRepository.getAllDocuments();
    }
    async getDocumentDetail(id: number) {
        return this.documentRepository.getDocumentById(id);
    }
}

export default DocumentService;