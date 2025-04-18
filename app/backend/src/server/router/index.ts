import express from "express";
import { getDocuments, getDocumentDetail, createDocument, updateDocument } from "../controller/documentController";
import documentValidator from "../validator/documentValidator";

const router = express.Router();

router.get('/documents', async (req, res): Promise<void> => {
    await getDocuments(req, res);
});

router.get('/document/:id', async (req, res): Promise<void> => {
    await getDocumentDetail(req, res);
});

router.post("/document", documentValidator.createDocumentValidationRules, async (req: express.Request, res: express.Response): Promise<void> => {
    await createDocument(req, res);
});

router.put("/document/:id", documentValidator.updateDocumentValidationRules, async (req: express.Request, res: express.Response): Promise<void> => {
    await updateDocument(req, res);
});


export default router;