import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import AppFooter from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 pb-8">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default Layout;
