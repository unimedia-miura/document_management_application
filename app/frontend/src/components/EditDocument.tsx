import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document } from '../types/Document';

export const EditDocument = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document>({
    id: 0,
    name: '',
    content: '',
    createdAt: '',
    updatedAt: '',
  });

	const sampleDocument: Document = {
		id: 1,
		name: "Sample Document",
		content: "This is a sample document",
		createdAt:  "2023-10-01",
		updatedAt: "2023-10-01",
}

  useEffect(() => {
    // 文書詳細を取得
		setDocument(sampleDocument);
    // fetch(`/document/${params.id}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setDocument(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, [params.id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/document/${document.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(document),
      });

      if (response.ok) {
        navigate(`/document/${document.id}`);
      } else {
        console.error('Failed to update document');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">文書編集</h1>
      <div className="bg-white shadow-md rounded-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">文書名</label>
          <input
            type="text"
            value={document.name}
            onChange={(e) => setDocument({ ...document, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">内容</label>
          <textarea
            value={document.content}
            onChange={(e) => setDocument({ ...document, content: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={5}
          />
        </div>
        <div className="flex space-x-4">
					<button
            onClick={() => navigate(-1)}
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};