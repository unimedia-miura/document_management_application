import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, displayShippingStatus } from '../../common';
import { Document } from '../../types/Document';
import DocumentSearchParams from '../../types/DocumentSearchParams';
import { apiClient } from '../../utils/apiClient';

export const List = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchParams, setSearchParams] = useState<DocumentSearchParams>({
    title: '',
    shippingStatus: '',
    createdAtFrom: '',
    createdAtTo: '',
  });

const fetchDocuments = async () => {
  const queryParams = new URLSearchParams();

  if (searchParams.title) queryParams.append('title', searchParams.title);
  if (searchParams.shippingStatus) queryParams.append('shippingStatus', searchParams.shippingStatus);
  if (searchParams.createdAtFrom) queryParams.append('createdAtFrom', searchParams.createdAtFrom);
  if (searchParams.createdAtTo) queryParams.append('createdAtTo', searchParams.createdAtTo);

  try {
    const data = await apiClient(`/api/document?${queryParams.toString()}`);
      setDocuments(data);
  } catch(err) {
    console.log(err);
  }
}

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">文書一覧</h1>
      <form onSubmit={handleSearch} className="mb-6 bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            文書名
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={searchParams.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="文書名を入力"
          />
        </div>
        <div>
          <label htmlFor="shippingStatus" className="block text-sm font-medium text-gray-700">
            発送ステータス
          </label>
          <select
            id="shippingStatus"
            name="shippingStatus"
            value={searchParams.shippingStatus}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">すべて</option>
            <option value="0">未発送</option>
            <option value="1">発送済み</option>
            <option value="2">配達完了</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="createdAtFrom" className="block text-sm font-medium text-gray-700">
              作成日 (From)
            </label>
            <input
              type="date"
              id="createdAtFrom"
              name="createdAtFrom"
              value={searchParams.createdAtFrom}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="createdAtTo" className="block text-sm font-medium text-gray-700">
              作成日 (To)
            </label>
            <input
              type="date"
              id="createdAtTo"
              name="createdAtTo"
              value={searchParams.createdAtTo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            type="submit"
            className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            検索
          </button>
        </div>
      </form>
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
              <td className="px-4 py-2 border-b text-sm text-gray-800">{displayShippingStatus(document.shippingStatus)}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-800">{formatDate(document.createdAt)}</td>
							<td className="px-4 py-2 border-b text-sm text-gray-800">{formatDate(document.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};