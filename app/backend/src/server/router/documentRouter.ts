import express from "express";
import DocumentController from "../controllers/documentController";
import DocumentService from "../services/documentService";
import DocumentRepository from "../repositories/documentRepository";
import prisma from "../../../prisma";
import documentValidator from "../validator/documentValidator";

const router = express.Router();

const documentRepository = new DocumentRepository(prisma);
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);

router.get('/', async (req, res): Promise<void> => {
    await documentController.getDocuments(req, res);
});

router.get('/:id', documentValidator.getDocumentDetailValidationRules, async (req: express.Request, res: express.Response): Promise<void> => {
    await documentController.getDocumentDetail(req, res);
});

router.post("", documentValidator.createDocumentValidationRules, async (req: express.Request, res: express.Response): Promise<void> => {
    await documentController.createDocument(req, res);
});

router.put("/:id", documentValidator.updateDocumentValidationRules, async (req: express.Request, res: express.Response): Promise<void> => {
    await documentController.updateDocument(req, res);
});

router.delete('/:id', documentValidator.deleteDocumentValidationRules, async (req: express.Request, res: express.Response): Promise<void> => {
    await documentController.deleteDocument(req, res);
});


export default router;