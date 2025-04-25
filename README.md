# document_management_application
書籍管理アプリケーション

docker起動  
```cd app/docker```  
```docker-compose up -d```

初回時のみ実行（初期ユーザー作成）  
```docker exec -it express-api sh ```  
```npx ts-node prisma/seed.ts```

画面表示  
http://localhost:3001/  

テスト実行
```docker exec -it express-api sh ```  
```npm run test```  

ログイン画面

<img width="759" alt="スクリーンショット 2025-04-25 16 39 24" src="https://github.com/user-attachments/assets/77935b74-8fbe-4976-89c9-9ea8d83a5092" />


一覧画面

<img width="755" alt="スクリーンショット 2025-04-25 16 39 38" src="https://github.com/user-attachments/assets/8bc681d2-fd34-4977-97bc-b35c748b79b8" />

詳細画面

<img width="762" alt="スクリーンショット 2025-04-25 16 39 48" src="https://github.com/user-attachments/assets/09fbac6b-fdd3-4a89-876f-2643628286c0" />

編集画面

<img width="748" alt="スクリーンショット 2025-04-25 16 42 58" src="https://github.com/user-attachments/assets/520238f2-6b36-4e10-804b-b8d9a4a28240" />


新規登録画面

<img width="755" alt="スクリーンショット 2025-04-25 16 39 55" src="https://github.com/user-attachments/assets/2b879f78-1f95-486b-8830-e520d0c8e511" />

ユーザー作成画面

<img width="763" alt="スクリーンショット 2025-04-25 16 40 15" src="https://github.com/user-attachments/assets/827f01b3-f57f-46e2-9172-27e964229a3f" />



