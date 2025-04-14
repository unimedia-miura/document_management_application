import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/list", (req: Request, res: Response) => {
    res.json([
        {
            id: 1,
            name: "テスト文書1"
        }
    ]);
});

app.listen(port, () => {
    console.log(`test app listening on port ${port}`)
});