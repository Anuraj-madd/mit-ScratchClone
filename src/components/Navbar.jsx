import React from 'react';

function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-md border-b border-blue-100 flex items-center justify-center px-10 py-3">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full border-2 border-blue-400 shadow-sm" />
        <span className="font-extrabold text-2xl text-blue-700 tracking-tight">MIT Scratch Clone</span>
      </div>
    </nav>
  );
}

export default Navbar; 