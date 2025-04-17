import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../common';
import { Document } from '../types/Document';

export const List = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">文書一覧</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">文書名</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">発送ステータス</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">作成日</th>
						<th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">更新日</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b text-sm text-gray-800">
                <Link to={`/document/${document.id}`} className="text-blue-500 hover:underline">
                  {document.title}
                </Link>
              </td>
              <td className="px-4 py-2 border-b text-sm text-gray-800">未発送</td>
              <td className="px-4 py-2 border-b text-sm text-gray-800">{formatDate(document.createdAt)}</td>
							<td className="px-4 py-2 border-b text-sm text-gray-800">{formatDate(document.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};