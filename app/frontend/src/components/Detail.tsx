import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDate } from '../common';
import { Document } from '../types/Document';

const sampleDocument: Document = {
		id: 1,
		name: "Sample Document",
		content: "This is a sample document",
		createdAt:  "2023-10-01",
		updatedAt: "2023-10-01",
}

export const Detail = () => {
    const params = useParams();
		const navigate = useNavigate();
		const [document, setDocument] = useState<Document>(sampleDocument);
		 // TODO: 詳細取得API作成する
			// useEffect(() => {
			// 	fetch('/document/' + params.id)
			// 		.then((res) => res.json())
			// 		.then((data) => {
			// 			setDocument(data);
			// 		})
			// 		.catch((err) => {
			// 			console.log(err);
			// 		});
			// }, [params.id]);

    return (
      <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">文書詳細</h1>
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-semibold mb-3">文書名: {document.name}</h2>
        <div className="mb-3">
          <p className="text-gray-700">内容:</p>
          <p className="text-gray-600">{document.content}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-4">作成日: {formatDate(document.createdAt)}</span>
          <span>更新日: {formatDate(document.updatedAt)}</span>
        </div>
      </div>
			<div className='mt-4 flex space-x-4'>
				<Link to="/" className='inline-block mt-4 text-blue-500 hover:underline'>一覧に戻る</Link>
				<button
					onClick={() => navigate(`/document/${document.id}/edit`)}
					className='text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md'
				>
					編集
				</button>
			</div>
    </div>
    );
};