import UserRepository from "../../server/repositories/userRepository";
import { PrismaClient, User, Prisma } from "../../generated/prisma";

const mockPrisma = {
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
    },
} as unknown as PrismaClient;

const userRepository = new UserRepository(mockPrisma);

describe('UserRepository', () => {
    beforeEach(() => {
        (mockPrisma.user.create as jest.Mock).mockClear();
        (mockPrisma.user.findUnique as jest.Mock).mockClear();
    });

    describe('createUser', () => {
        it('新規ユーザーを作成し、作成されたユーザー情報を返すこと', async() => {
            const createInput = {
                name: 'testUser',
                email: 'test2xyz.com',
                password: 'password',
            } as Prisma.UserCreateInput;
            const createdUser = {
                id: 1,
                ...createInput,
            } as User;

            (mockPrisma.user.create as jest.Mock).mockResolvedValue(createdUser);

            const result = await userRepository.createUser(createInput);

            expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(createdUser);
        });

        it('ユーザー作成処理中のエラーをキャッチし、「Failed to create user」というエラーをthrowすること', async () => {
            const createInput = {
                name: 'testUser',
                email: 'test2xyz.com',
                password: 'password'
            };
            const errorMessage = 'Failed to create user';
            (mockPrisma.user.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(userRepository.createUser(createInput)).rejects.toThrow(errorMessage);
            expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: createInput });
        });
    });

    describe('findUser', () => {
        it('指定されたメールアドレスがある場合、そのユーザー情報を返すこと', async() => {
            const email = 'test2xyz.com';
            const testUser = {
                id: 1,
                name: 'testUser',
                email: 'test2xyz.com',
                password: 'password'
            } as User;

            (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(testUser);

            const result = await userRepository.findUser(email);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testUser);
        });

        it('指定されたメールアドレスのユーザーが存在しない場合、nullを返すこと', async () => {
            const targetEmail = 'non-exist.xyz.com';
            (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await userRepository.findUser(targetEmail);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: targetEmail } });
            expect(result).toBeNull();
        });

        it('ユーザー情報取得中のエラーをキャッチし、「Faild to find user」というエラーをthrowすること', async () => {
            const targetEmail = 'exist.xyz.com';
            const errorMessage = 'Faild to find user';
            (mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(userRepository.findUser(targetEmail)).rejects.toThrow(errorMessage);
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: targetEmail } });
        });
    });

});