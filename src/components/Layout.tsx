// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />  {/* 👈 페이지 내용이 여기에 렌더링됨 */}
      </main>
    </div>
  );
};

export default Layout;
