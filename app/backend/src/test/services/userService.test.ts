import UserService from "../../server/services/userService";
import UserRepository from "../../server/repositories/userRepository";
import { Prisma } from "../../generated/prisma";
import { User } from "../../generated/prisma";

const mockUserRepository = {
    createUser: jest.fn(),
    findUser: jest.fn(),
} as unknown as UserRepository;

const userService = new UserService(mockUserRepository);

describe('UserService', () => {
    beforeEach(() => {
        (mockUserRepository.createUser as jest.Mock).mockClear();
        (mockUserRepository.findUser as jest.Mock).mockClear();
    });

    describe('createUser', () => {
        it('RepositoryのcreateUserを呼び出し、その結果を返すこと', async() => {
            const createInput = {
                name: 'testUser',
                email: 'test2xyz.com',
                password: 'password',
            };
            const createdUser = {
                id: 1,
                ...createInput,
            } as User;

            (mockUserRepository.createUser as jest.Mock).mockResolvedValue(createdUser);

            const result = await userService.createUser(createInput);

            expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
            expect(result).toEqual(createdUser);
        });

        it('RepositoryのcreateUserがエラーをthrowした場合、Serviceは「Failed to create user in UserService」というエラーをthrowすること', async() => {
            const createInput = {
                name: 'testUser',
                email: 'test2xyz.com',
                password: 'password',
            };
            const repositoryError = new Error('Failed to create user in UserService');
            (mockUserRepository.createUser as jest.Mock).mockRejectedValue(repositoryError);

            await expect(userService.createUser(createInput)).rejects.toThrow('Failed to create user in UserService');
            expect(mockUserRepository.createUser).toHaveBeenCalledWith(createInput);
        });
    });

    describe('findUser', () => {
        it('RepositoryのfindUserを呼び出し、その結果を返すこと', async() => {
            const targetEmail = 'test2xyz.com';
            const testUser = {
                id: 1,
                name: 'testUser',
                email: 'test2xyz.com',
                password: 'password'
            } as User;

            (mockUserRepository.findUser as jest.Mock).mockResolvedValue(testUser);

            const result = await userService.findUser(targetEmail);

            expect(mockUserRepository.findUser).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testUser);
        });

        it('指定されたメールアドレスのユーザーが存在しない場合、nullを返すこと', async () => {
            const targetEmail = 'non-exist.xyz.com';
            (mockUserRepository.findUser as jest.Mock).mockResolvedValue(null);

            const result = await userService.findUser(targetEmail);

            expect(mockUserRepository.findUser).toHaveBeenCalledWith(targetEmail);
            expect(result).toBeNull();
        });

        it('Repositoryのがエラーをthrowした場合、Serviceは「Failed to get user by email in UserService」というエラーをthrowすること', async () => {
            const targetEmail = 'exist.xyz.com';
            const repositoryError = new Error('Failed to get user by email in UserService');
            (mockUserRepository.findUser as jest.Mock).mockRejectedValue(repositoryError);

            await expect(userService.findUser(targetEmail)).rejects.toThrow('Failed to get user by email in UserService');
            expect(mockUserRepository.findUser).toHaveBeenCalledWith(targetEmail);
        });
    });

});