import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
const authMiddleware = (req: Request, res: Response, next: NextFunction):void => {
    const token = req.headers.authorization?.split(' ')[1]; // Authorizationヘッダーからトークンを取得

    if (!token) {
        res.status(401).json({ error: '認証トークンがありません。ログインしてください。' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!); // トークンを検証
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ error: '無効なトークンです。ログインしてください。' });
    }
};

export default authMiddleware;