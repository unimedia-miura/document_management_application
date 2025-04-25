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

<img width="812" alt="スクリーンショット 2025-04-25 17 21 17" src="https://github.com/user-attachments/assets/e63f4191-ccf5-48d7-a9b7-6a4f5d303dc3" />


編集画面

<img width="829" alt="スクリーンショット 2025-04-25 17 22 09" src="https://github.com/user-attachments/assets/92510557-39da-4195-800d-8886133690cb" />



新規登録画面

<img width="827" alt="スクリーンショット 2025-04-25 17 21 08" src="https://github.com/user-attachments/assets/e35f4af2-7c67-4eb7-9c88-c6733909ae58" />


ユーザー作成画面

<img width="763" alt="スクリーンショット 2025-04-25 16 40 15" src="https://github.com/user-attachments/assets/827f01b3-f57f-46e2-9172-27e964229a3f" />



