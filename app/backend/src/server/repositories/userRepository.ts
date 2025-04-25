import { Prisma, PrismaClient, User } from "../../generated/prisma";

class UserRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
            try {
                return this.prisma.user.create({data});
            } catch (error) {
                console.error("Error creating user:", error);
                throw new Error("Failed to create user");
            }
    }

    async findUser(email: string):Promise<User | null> {
        try {
            return this.prisma.user.findUnique({
                where: {email}
            })
        } catch (error) {
            console.error("Error finding user:", error);
            throw new Error("Failed to find user");
        }
    }
}

export default UserRepository;