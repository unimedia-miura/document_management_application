import { Children, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { List } from './components/document/List';
import { Detail } from './components/document/Detail';
import { NewDocumentForm } from './components/document/NewDocumentForm';
import { EditDocument } from './components/document/EditDocument';
import { Register } from './components/auth/Register';
import { Login } from './components/auth/Login';
import './App.css';

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettingsMenu = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* 左側のナビゲーション */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src={`${process.env.PUBLIC_URL}/images/documentFileIcon.png`}
                  alt="navHeaderIcon"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    to="/documents"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                    aria-current="page"
                  >
                    一覧
                  </Link>
                  <Link
                    to="/new"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    新規作成
                  </Link>
                </div>
              </div>
            </div>

            {/* 右側の設定アイコン */}
            <div className="relative">
              <button
                onClick={toggleSettingsMenu}
                className="flex items-center text-gray-300 hover:text-white focus:outline-none"
              >
                <img
                  className="h-5 w-auto"
                  src={`${process.env.PUBLIC_URL}/images/settingIcon.png`}
                  alt="settingIcon"
                />
              </button>

              {/* 設定メニュー */}
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/user/regist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ユーザー登録
                  </Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('accessToken');
                      window.location.href = '/';
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/documents" element={<List />} />
        <Route path="/document/:id" element={<Detail />} />
        <Route path="/document/:id/edit" element={<EditDocument />} />
        <Route path="/new" element={<NewDocumentForm />} />
        <Route path="/user/regist" element={<Register />} />
        <Route path="/user/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
