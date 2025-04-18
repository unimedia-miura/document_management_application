import { createDocument } from './documentController';
import { Prisma, Document } from '../../generated/prisma';
import { validationResult } from 'express-validator';
import { mock, mockDeep, MockProxy, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '../../generated/prisma';

describe('DocumentController', () => {
  console.log("=====")
	let mockDocumentService: any;
  let mockDocumentRepository: any;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPrisma = mockDeep<PrismaClient>();

    mockDocumentRepository = {
      createDocument: jest.fn(),
    };

    mockDocumentService = {
      createDocument: jest.fn(),
    };

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it('should create a new document successfully', async () => {
    // テストデータ
    const newDocumentData = {
      title: 'Test Document',
      content: 'This is a test document.',
      shippingStatus: 0
    };
    const createdDocument: Document = {
      id: 8, // TODO: DB登録しないよう調整する
      ...newDocumentData,
      published: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // モックの挙動を設定
    mockPrisma.document.create.mockResolvedValue(createdDocument);
    mockDocumentService.createDocument.mockResolvedValue(createdDocument);
    // リクエストボディにデータを設定
    mockRequest.body = newDocumentData;

    // コントローラーのメソッドを呼び出し
    await createDocument(mockRequest, mockResponse, mockNext);

    // 検証
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(createdDocument);
    expect(mockDocumentService.createDocument).toHaveBeenCalledWith(newDocumentData);
    expect(mockNext).not.toHaveBeenCalled(); // エラーハンドリングミドルウェアが呼ばれていないことを確認
  });

  it('バリデーションエラーのテスト: 400を返す', async () => {
    // テストデータ
    const testData = {
      "title": null,
      "content": "これはテスト文書3の内容です。",
      "shippingStatus": 1
    }
    mockRequest.body = testData;

    const errors = [{
      "type": "field",
      "value": "",
      "msg": "タイトルは必須入力項目です",
      "path": "title",
      "location": "body"
    }];
    // // バリデーションエラーをシミュレート
    // const errors = [{ msg: 'タイトルは必須入力項目です' }];
    // (validationResult as unknown as jest.Mock).mockReturnValue({
    //   isEmpty: jest.fn().mockReturnValue(false),
    //   array: jest.fn().mockReturnValue(errors),
    // });

    // コントローラーのメソッドを呼び出し
    const result = await createDocument(mockRequest, mockResponse, mockNext);
    console.log('===Result', result)

    // 検証
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ errors });
    expect(mockDocumentService.createDocument).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 500 if an error occurs', async () => {
    // サービス層でエラーが発生した場合をシミュレート
    const serviceError = new Error('Database error');
    mockResponse.status = 500;
    mockDocumentService.createDocument.mockRejectedValue(serviceError);

    // コントローラーのメソッドを呼び出し
    await createDocument(mockRequest, mockResponse, mockNext);

    // 検証
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error create document' });
    expect(mockDocumentService.createDocument).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(serviceError);
  });
});