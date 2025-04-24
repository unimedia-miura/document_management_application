import DocumentRepository from "../repositories/documentRepository";
import { Prisma, Document } from "../../generated/prisma"
import GetDocumentsParams from "../types/GetDocumentParams";

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
    async getDocuments(params: GetDocumentsParams = {}): Promise<Document[]> {
        try {
            const where: Prisma.DocumentWhereInput = {
                delete_flg: false,
            };

            if (params.title) {
                where.title = {
                    contains: params.title
                };
            }
            if (params.shippingStatus || params.shippingStatus === 0) {
                where.shippingStatus = params.shippingStatus;
            }
            if (params.createdAtFrom || params.createdAtTo) {
                where.createdAt = {};
                if (params.createdAtFrom) {
                    where.createdAt.gte = params.createdAtFrom;
                }
                if (params.createdAtTo) {
                    where.createdAt.lte = params.createdAtTo;
                }
            }
            return this.documentRepository.getDocuments(where);

        } catch (error) {
            console.log('Error in getDocuments', error);
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