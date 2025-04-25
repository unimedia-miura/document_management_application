import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document } from '../../types/Document';
import { apiClient } from '../../utils/apiClient';
export const EditDocument = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document>();

  const fetchDocument = async () => {
      try {
        const data = await apiClient('/api/document/' + params.id);
        setDocument(data);
      } catch(err) {
        console.log(err);
      }
    };
    useEffect(() => {
      fetchDocument();
    }, [params.id]);

    if (!document) {
			return (
				<div className="container mx-auto p-4">
					<h1 className="text-xl font-bold mb-4">文書詳細</h1>
					<div className="bg-white shadow-md rounded-md p-6">
						<h2>詳細情報が取得できませんでした。</h2>
					</div>
				</div>
			)
		}

  const handleSave = async () => {
    try {
      await apiClient(`/api/document/${document.id}`, {
        method: 'PUT',
        body: JSON.stringify(document),
      });
      navigate(`/document/${document.id}`);
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
            value={document.title}
            onChange={(e) => setDocument({ ...document, title: e.target.value })}
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">発送ステータス</label>
          <select
            value={document.shippingStatus}
            onChange={(e) => setDocument({ ...document, shippingStatus: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={0}>未発送</option>
            <option value={1}>発送済み</option>
            <option value={2}>配達完了</option>
          </select>
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