import { Prisma, Document, PrismaClient } from "../../generated/prisma";

class DocumentRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createDocument(data: Prisma.DocumentCreateInput): Promise<Document> {
        try {
            return this.prisma.document.create({data});
        } catch (error) {
            console.error("Error creating document:", error);
            throw new Error("Failed to create document");
        }
    }

    async updateDocument(id: number, data: Prisma.DocumentCreateInput): Promise<Document> {
        try {
            return this.prisma.document.update({
                where: { id },
                data
            });
        } catch (error) {
            console.log("Error updating document:", error);
            throw new Error("Failed to update document")
        }
    }

    async getAllDocuments(): Promise<Document[]> {
        try {
            return this.prisma.document.findMany();
        } catch (error) {
            console.log("Error fetching documents:", error);
            throw new Error("Faild to fetch documents");
        }
    }

    async getDocumentById(id: number): Promise<Document | null> {
        try {
            return this.prisma.document.findUnique({ where: {id: id}});
        } catch (error) {
            console.log("Error fetching document by ID:", error);
            throw new Error("Faild to fetch document by ID");
        }
    }

    async deleteDocument(id: number): Promise<Document | null> {
        try {
            return this.prisma.document.delete({ where: {id: id}});
        } catch (error) {
            console.log("Error deleting document:", error);
            throw new Error("Faild to delete document");
        }
    }
}

export default DocumentRepository;