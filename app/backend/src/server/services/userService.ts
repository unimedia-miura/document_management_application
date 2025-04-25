import { User } from "../../generated/prisma";
import UserRepository from "../repositories/userRepository";

class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(data: { name: string; email: string; password: string }): Promise<User> {
        return this.userRepository.createUser(data);
    }

    async findUser(email: string): Promise<User | null> {
        return this.userRepository.findUser(email);
    }
}

export default UserService;