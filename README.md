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