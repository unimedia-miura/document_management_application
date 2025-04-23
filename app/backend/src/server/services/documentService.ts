import DocumentRepository from "../repositories/documentRepository";
import { Prisma, Document } from "../../generated/prisma";

class DocumentService {
    private documentRepository: DocumentRepository;

    constructor(documentRepository: DocumentRepository) {
        this.documentRepository = documentRepository;
    }

    async createDocument(data: Prisma.DocumentCreateInput): Promise<Document> {
        try {
            return this.documentRepository.createDocument(data);
        } catch (error) {
            console.log('Error in createDocument', error);
            throw new Error('Failed to create document in documentService');
        }
    }
    async updateDocument(id: number, data: Prisma.DocumentCreateInput): Promise<Document> {
        try {
            return this.documentRepository.updateDocument(id, data);
        } catch (error) {
            console.log('Error in updateDocument', error);
            throw new Error('Failed to update document in documentService');
        }
    }
    async getAllDocuments(): Promise<Document[]> {
        try {
            return this.documentRepository.getAllDocuments({
                    delete_flg: false,
            });
        } catch (error) {
            console.log('Error in getAllDocuments', error);
            throw new Error('Failed to get all documents in documentService');
        }
    }
    async getDocumentDetail(id: number) {
        try {
            return this.documentRepository.getDocumentById(id);
        } catch (error) {
            console.log('Error in getDocumentDetail', error);
            throw new Error('Failed to get document by ID in documentService');
        }
    }

    async deleteDocument(id: number) {
        try {
            return this.documentRepository.deleteDocument(id);
        } catch (error) {
            console.log('Error in deleteDocument', error);
            throw new Error('Failed to delete document in documentService');
        }
    }
}

export default DocumentService;