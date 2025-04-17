import documentRepository from "../repositories/documentRepository";
import { Prisma, Document } from "../../generated/prisma";

class DocumentService {
    async createDocument(data: Prisma.DocumentCreateInput): Promise<Document> {
        // TODO: バリデーション追加
        return documentRepository.createDocument(data);
    }
}

export default new DocumentService;