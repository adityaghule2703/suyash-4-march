import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderOne from './HeaderOne';
import HeaderTwo from './HeaderTwo';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <HeaderOne />
        <HeaderTwo />
      </header>
      
      {/* Main Content - Outlet renders child routes */}
      <main className="flex-grow p-6 relative bg-white">
  {/* Corner circles with connecting lines */}
  <div className="absolute inset-0 overflow-hidden">
    {/* Circles at corners */}
    <div className="absolute -top-24 -left-24 w-96 h-96 border-8 border-blue-100/50 rounded-full"></div>
    <div className="absolute -top-10 -left-10 w-80 h-80 border-4 border-blue-200/40 rounded-full"></div>
    
    <div className="absolute -top-24 -right-24 w-96 h-96 border-8 border-purple-100/50 rounded-full"></div>
    <div className="absolute -top-10 -right-10 w-80 h-80 border-4 border-purple-200/40 rounded-full"></div>
    
    <div className="absolute -bottom-24 -left-24 w-96 h-96 border-8 border-green-100/50 rounded-full"></div>
    <div className="absolute -bottom-10 -left-10 w-80 h-80 border-4 border-green-200/40 rounded-full"></div>
    
    <div className="absolute -bottom-24 -right-24 w-96 h-96 border-8 border-pink-100/50 rounded-full"></div>
    <div className="absolute -bottom-10 -right-10 w-80 h-80 border-4 border-pink-200/40 rounded-full"></div>
    
    {/* Diagonal connecting lines */}
    <div className="absolute top-0 left-0 right-0 bottom-0">
      <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-br from-blue-200/20 via-transparent to-pink-200/20"></div>
      <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-bl from-purple-200/20 via-transparent to-green-200/20"></div>
    </div>
  </div>
  
  <div className="max-w-9xl mx-auto relative z-10">
    <Outlet />
  </div>
</main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;