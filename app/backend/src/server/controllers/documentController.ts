import { Request, Response } from 'express';
import DocumentService from '../services/documentService';
import { Prisma } from '../../generated/prisma';
import { validationResult } from 'express-validator';


class DocumentController {
    private documentService: DocumentService;

    constructor(documentService: DocumentService) {
        this.documentService = documentService;
    }
    async getDocuments(req: Request, res: Response): Promise<Response<Document[]>> {
        try {
            const documents = await this.documentService.getAllDocuments();
            return res.status(200).json(documents);
        } catch(error) {
            console.error("Error fetching documents:", error);
            return res.status(500).json({ error: "Error fetching documents"});
        }
    }

    async getDocumentDetail (req: Request, res: Response): Promise<Response<Document>> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const id = parseInt(req.params.id); // パスパラメータから ID を取得
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid ID' });
            }
            const document = await this.documentService.getDocumentDetail(id);
            return res.status(200).json(document);
        } catch(error) {
            console.error("Error fetch the document:", error);
            return res.status(500).json({ error: "Error fetch the document"});
        }
    }

    async createDocument (req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        try {
            const data: Prisma.DocumentCreateInput = req.body;
            const newDocument = await this.documentService.createDocument(data);
            return res.status(201).json(newDocument);
        } catch (error) {
            console.error("Error create document:", error);
            return res.status(500).json({ error: "Error creating document"});
        }
    }
    
    async updateDocument (req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        try {
            const id = parseInt(req.params.id); // パスパラメータから ID を取得
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid ID' });
            }
            const data: Prisma.DocumentCreateInput = req.body;
            const updateDocument = await this.documentService.updateDocument(id, data);
            return res.status(204).json(updateDocument);
        } catch (error) {
            console.error("Error update document:", error);
            return res.status(500).json({ error: "Error updating document"});
        }
    }

    async deleteDocument (req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const id = parseInt(req.params.id); // パスパラメータから ID を取得
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid ID' });
            }
            const deleteDocument = await this.documentService.deleteDocument(id);
            return res.status(200).json(deleteDocument);
        } catch (error) {
            console.error("Error delete document:", error);
            return res.status(500).json({ error: "Error deleting document"});
        }
    }
}


export default DocumentController;