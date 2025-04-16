import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/list", (req: Request, res: Response) => {
    res.json([
        {
            id: 1,
            name: "テスト文書1",
            content: "これはテスト文書1の内容です。",
            shippingStatus: 0,
            createdAt: "2023-10-01",
            updatedAt: "2023-10-01",
        },
        {
            id: 2,
            name: "テスト文書2",
            content: "これはテスト文書2の内容です。",
            shippingStatus: 0,
            createdAt: "2023-11-01",
            updatedAt: "2023-11-01",
        },
        {
            id: 3,
            name: "テスト文書3",
            content: "これはテスト文書3の内容です。",
            shippingStatus: 0,
            createdAt: "2023-12-01",
            updatedAt: "2023-12-01",
        },
    ]);
});

app.listen(port, () => {
    console.log(`test app listening on port ${port}`)
});