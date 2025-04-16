import { Request, Response } from 'express';
import { PrismaClient } from "../../../src/generated/prisma";
import { Document } from '../types/Document';

const getDocuments = async (req: Request, res: Response): Promise<Response> => {
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
        return res.status(500).json({ error: "Internal Server Error"});
    }
}

// router.post("/document", express.json(), async (req: Request, res: Response) => {
// 		const { title, content, shippingStatus } = req.body;
// 		const document = await prisma.document.create({
// 			data: {
// 				title,
// 				content,
// 				shippingStatus,
// 			},
// 		});
// 		res.status(201).json(document);
// 	});

export { getDocuments };