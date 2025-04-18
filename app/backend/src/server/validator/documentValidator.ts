import { body, param } from "express-validator";

const createDocumentValidationRules = [
    body('title')
        .notEmpty().withMessage('タイトルは必須入力項目です')
        .isString()
        .isLength({ max: 255}).withMessage('タイトルは255文字以内にしてください'),
    body('content')
        .notEmpty().withMessage('内容は必須入力項目です')
        .isString()
        .isLength({ max: 255}).withMessage('タイトルは255文字以内にしてください'),
    body('shippingStatus')
        .notEmpty().withMessage('発送ステータスは必須入力項目です')
        .isInt({ min: 0 }).withMessage('発送ステータスは0以上の整数で入力してください'),
];

const updateDocumentValidationRules = [
    param('id')
        .notEmpty().withMessage('IDは必須入力です')
        .isInt(),
    ...createDocumentValidationRules,
];

export default {
    createDocumentValidationRules,
    updateDocumentValidationRules,
};