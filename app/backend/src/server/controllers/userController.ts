import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../services/userService';

class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: '全ての項目を入力してください' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await this.userService.createUser({ name, email, password: hashedPassword });
            return res.status(201).json(newUser);
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ error: 'ユーザー登録に失敗しました' });
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'メールアドレスとパスワードを入力してください' });
        }

        try {
            const user = await this.userService.findUser(email);
            if (!user) {
                return res.status(401).json({ error: 'メールアドレスが間違っています' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'パスワードが間違っています' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
                expiresIn: '24h',
            });

            return res.status(200).json({ token });
        } catch (error) {
            console.error('Error logging in user:', error);
            return res.status(500).json({ error: 'ログインに失敗しました' });
        }
    }
}

export default UserController;