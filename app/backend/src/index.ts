import express, { NextFunction, Request, Response } from "express";
import router from "./server/router";

const app = express();
const port = 3000;
app.use(express.json());
app.use('/api', router);

// CORSの設定
app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// エラーハンドリングミドルウェア
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack);
    res.status(500).json({ error: 'エラーが発生しました。'})
});

app.listen(port, () => {
    console.log(`test app listening on port ${port}`)
});