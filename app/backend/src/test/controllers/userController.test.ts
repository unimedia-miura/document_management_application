import UserController from "../../server/controllers/userController";
import UserService from "../../server/services/userService";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response} from "express";
import { User } from "../../generated/prisma";

const mockUserService = {
    createUser: jest.fn(),
    findUser: jest.fn(),
} as unknown as UserService;

describe('UserController', () => {
    let userController: UserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnThis();
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        userController = new UserController(mockUserService);
        mockRequest = {};
        mockResponse = {
            status: mockStatus,
            json: mockJson,
        } as Partial<Response>;
        mockJson.mockClear();
        mockStatus.mockClear();
        mockConsoleError.mockClear();
        (mockUserService.createUser as jest.Mock).mockClear();
        (mockUserService.findUser as jest.Mock).mockClear();
    });

    describe('createUser', () => {
        it('未入力項目がある場合、400と「全ての項目を入力してください」とエラーメッセージを返すこと', async() => {
            mockRequest.body = { name: '', email: '', password: ''};

            await userController.register(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: '全ての項目を入力してください'});
        });

        it('全ての項目を入力し、SeriviceのcreateDocumentを呼び出し、成功時に201と作成されたユーザー情報を返すこと', async() => {
            const hashedPassword = 'hashedPassword';
            jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
            const createInput = {
                name: 'testUser',
                email: 'test2xyz.com',
                password: 'password',
            };
            const createdUser = {
                id: 1,
                name: 'testUser',
                email: 'test2xyz.com',
                password: hashedPassword,
            } as User;

            (mockUserService.createUser as jest.Mock).mockResolvedValue(createdUser);
            mockRequest.body = createInput;

            await userController.register(mockRequest as Request, mockResponse as Response);

            expect(bcrypt.hash).toHaveBeenCalledWith('password', 10)
            expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(createdUser);
        });

        it('Serviceがエラーをthrowした場合、500と「ユーザー登録に失敗しました」とエラーメッセージを返すこと', async() => {
            jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
            const createInput = {
                name: 'testUser',
                email: 'test2xyz.com',
                password: 'password',
            };
            const serviceError = new Error('Failed to create user in userService');
            (mockUserService.createUser as jest.Mock).mockRejectedValue(serviceError);
            mockRequest.body = createInput;

            await userController.register(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockConsoleError).toHaveBeenCalledTimes(1);
            expect(mockConsoleError).toHaveBeenCalledWith("Error registering user:", serviceError);
            expect(mockJson).toHaveBeenCalledWith({ error: 'ユーザー登録に失敗しました'});
        });
    });

    describe('login', () => {
        it('メールアドレス、パスワードが未入力の場合、400と「メールアドレスとパスワードを入力してください」とエラーメッセージを返すこと', async() => {
            mockRequest.body = { email: '', password: ''};

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'メールアドレスとパスワードを入力してください'});
        });

        it('合致するユーザー情報が存在しない場合、401と「メールアドレスが間違っています」とエラーメッセージを返すこと', async() => {
            mockRequest.body = { email: 'non-exsits@xyz.com', password: 'password' };
            (mockUserService.findUser as jest.Mock).mockResolvedValue(null);

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ error: 'メールアドレスが間違っています'});
        });

        it('パスワードが誤っている場合、401と「パスワードが間違っています」とエラーメッセージを返すこと', async() => {
            mockRequest.body = { email: 'exsit@xyz.com', password: 'incorrect_password' };
            (mockUserService.findUser as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword'
            });
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ error: 'パスワードが間違っています'});
        });

        it('ログイン処理が成功した場合、200とtoken情報を返すこと', async() => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password',
            };
            (mockUserService.findUser as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'test@sample.com',
                password: 'hashedPassword',
            });
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
            jest.spyOn(jwt, 'sign').mockReturnValue('mockToken' as unknown as void);

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ token: 'mockToken'});
        });

        it('Serviceがエラーをthrowした場合、500 「ログインに失敗しました」とエラーメッセージを返すこと', async() => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password',
            };
            const serviceError = new Error('Failed to get user by email in UserService');
            (mockUserService.findUser as jest.Mock).mockRejectedValue(serviceError);

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockConsoleError).toHaveBeenCalledTimes(1);
            expect(mockConsoleError).toHaveBeenCalledWith("Error logging in user:", serviceError);
            expect(mockJson).toHaveBeenCalledWith({ error: 'ログインに失敗しました'});
        });
    });
});