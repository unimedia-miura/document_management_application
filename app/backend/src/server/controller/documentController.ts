import { Request, Response } from 'express';
import documentService from '../service/documentService';
import { Prisma } from '../../generated/prisma';
import { validationResult } from 'express-validator';

const getDocuments = async(req: Request, res: Response): Promise<Response<Document[]>> => {
    try {
        const documents = await documentService.getAllDocuments();
        return res.json(documents);
    } catch(error) {
        console.error("Error fetching documents:", error);
        return res.status(500).json({ error: "Error fetching documents"});
    }
}

const getDocumentDetail = async(req: Request, res: Response): Promise<Response<Document>> => {
    try {
        const id = parseInt(req.params.id); // パスパラメータから ID を取得
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const document = await documentService.getDocumentDetail(id);
        return res.json(document);
    } catch(error) {
        console.error("Error fetching documents:", error);
        return res.status(500).json({ error: "Error fetching documents"});
    }
}

const createDocument = async(req: Request, res: Response): Promise<Response> => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const data: Prisma.DocumentCreateInput = req.body;
		const newDocument = await documentService.createDocument(data);
		return res.status(201).json(newDocument);
    } catch (error) {
		console.error("Error create document:", error);
        return res.status(500).json({ error: "Error fetching documents"});
    }
}

const updateDocument = async(req: Request, res: Response): Promise<Response> => {
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
		const newDocument = await documentService.updateDocument(id, data);
		return res.status(201).json(newDocument);
    } catch (error) {
		console.error("Error create document:", error);
        return res.status(500).json({ error: "Error fetching documents"});
    }
}


export { getDocuments, getDocumentDetail, createDocument, updateDocument };