import express, { NextFunction, Request, Response } from "express";
import userRouter from "./server/router/userRouter";
import documentRouter from "./server/router/documentRouter";
import authMiddleware from "./server/middleware/authMiddleware";

const app = express();
const port = 3000;
app.use(express.json());

const apiRouter = express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/document', authMiddleware, documentRouter);
app.use('/api', apiRouter);

// CORSの設定
app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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