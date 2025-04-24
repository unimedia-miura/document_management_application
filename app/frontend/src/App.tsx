import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

// import { Home } from './components/Home';
import { List } from './components/List';
import { Detail } from './components/Detail';
import { NewDocumentForm } from './components/NewDocumentForm';
import { EditDocument } from './components/EditDocument';
import './App.css';

type testObj = {
  id: number;
  name: string;
}

const App = () => {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img className="h-8 w-auto" src={`${process.env.PUBLIC_URL}/images/documentFileIcon.png`} alt="navHeaderIcon" />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link to="/" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">一覧</Link>
                  <Link to="/new" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">新規作成</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<List />} />
        {/* <Route path="/list" element={<List />} /> */}
        <Route path="/document/:id" element={<Detail />} />
        <Route path="/document/:id/edit" element={<EditDocument />} />
        <Route path="/new" element={<NewDocumentForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
