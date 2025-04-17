import express from "express";
import { getDocuments, createDocument } from "../controller/documentController";
import documentValidator from "../validator/documentValidator";

const router = express.Router();

router.get('/documents', async (req, res): Promise<void> => {
    await getDocuments(req, res);
});

router.post("/document", documentValidator.createDocumentValidationRules, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    await createDocument(req, res, next);
});


export default router;