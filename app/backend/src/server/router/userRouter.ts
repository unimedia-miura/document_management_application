import express from "express";
import UserController from "../controllers/userController";
import UserService from "../services/userService";
import UserRepository from "../repositories/userRepository";
import prisma from "../../../prisma";

const router = express.Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/register', async (req, res): Promise<void> => {
    await userController.register(req, res);
});
router.post('/login', async (req, res):Promise<void> => {
    await userController.login(req, res);
});

export default router;