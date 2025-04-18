import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDate } from '../common';
import { Document } from '../types/Document';

export const Detail = () => {
    const params = useParams();
		const navigate = useNavigate();
		const [document, setDocument] = useState<Document>();
			useEffect(() => {
				fetch('/api/document/' + params.id)
					.then((res) => res.json())
					.then((data) => {
						setDocument(data);
					})
					.catch((err) => {
						console.log(err);
					});
			}, [params.id]);

			const displayShippingStatus = (status: number) => {
				switch (status) {
					case 0:
						return '未発送';
					case 1:
						return '発送済み';
					case 2:
						return '配達完了';
					default:
						return '不明';
				}
			};

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

    return (
	<div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">文書詳細</h1>
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-semibold mb-3">文書名: {document.title}</h2>
        <div className="mb-3">
          <p className="text-gray-700">内容: {document.content}</p>
        </div>
		<div className="mb-3">
          <p className="text-gray-700">発送ステータス: {displayShippingStatus(document.shippingStatus)}</p>
        </div>
        <div className="flex items-center text-sm text-gray-700">
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