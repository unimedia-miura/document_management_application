import express from "express";
import { getDocuments } from "../controller";

const router = express.Router();

router.get("/documents", (req, res) => {
    res.json([
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
    ]);
	}
);


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

export default router;