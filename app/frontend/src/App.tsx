import React, { useEffect, useState } from 'react';
import './App.css';

type testObj = {
  id: number;
  name: string;
}

const App = () => {
  const [documents, setDocuments] = useState<testObj[]>([]);

  useEffect(() => {
    fetch('/list')
      .then(res => res.json())
      .then(data => {
        setDocuments(data);
      }).catch(err => {
        console.log(err)
      })
  }, []);

  return (
    <div>
      <div>一覧表示</div>
      {documents.map((document, index) =>
        <p key={index}>{document.name}</p>
      )}
    </div>
  );
}

export default App;
