import { User } from "../../generated/prisma";
import UserRepository from "../repositories/userRepository";

class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(data: { name: string; email: string; password: string }): Promise<User> {
        try {
            return this.userRepository.createUser(data);
        } catch (error) {
            console.log('Error in createUser', error);
            throw new Error('Failed to create user in UserService');
        }
    }

    async findUser(email: string): Promise<User | null> {
        try {
            return this.userRepository.findUser(email);
        } catch (error) {
            console.log('Error in findUser', error);
            throw new Error('Failed to get user by email in UserService');
        }

    }
}

export default UserService;