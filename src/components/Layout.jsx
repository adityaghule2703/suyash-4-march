// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FFFC]">
      {/* Single Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow relative">
        {/* Background patterns - very subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#9FE2BF]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0A5C60]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#063B3E]/5 rounded-full blur-3xl"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0A5C60 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="max-w-9xl mx-auto relative z-10 py-5 px-5">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;