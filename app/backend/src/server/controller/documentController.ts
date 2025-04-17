import { NextFunction, Request, Response } from 'express';
import documentService from '../service/documentService';
import { Prisma } from '../../generated/prisma';
import { body, validationResult } from 'express-validator';

const getDocuments = async(req: Request, res: Response): Promise<Response<Document[]>> => {
    try {
        const documents = [
            {
                id: 1,
                title: "テスト文書1",
                content: "これはテスト文書1の内容です。",
                shippingStatus: 0,
                createdAt: "2023-10-01",
                updatedAt: "2023-10-01",
            },
            {
                id: 2,
                title: "テスト文書2",
                content: "これはテスト文書2の内容です。",
                shippingStatus: 0,
                createdAt: "2023-11-01",
                updatedAt: "2023-11-01",
            },
            {
                id: 3,
                title: "テスト文書3",
                content: "これはテスト文書3の内容です。",
                shippingStatus: 0,
                createdAt: "2023-12-01",
                updatedAt: "2023-12-01",
            },
        ];
        return res.json(documents);
    } catch(error) {
        console.error("Error fetching documents:", error);
        return res.status(500).json({ error: "Error fetching documents"});
    }
}

const createDocument = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
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
    next(error);
  }
}


export { getDocuments, createDocument };