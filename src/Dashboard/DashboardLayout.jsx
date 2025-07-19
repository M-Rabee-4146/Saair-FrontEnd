import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router'
import { Bars3Icon } from '@heroicons/react/24/outline';

const DashboardLayout = () => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen lg:flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 bg-[#080708] h-screen max-h-screen overflow-auto">
        {/* Hamburger button for mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-1 mb-4 -ml-1 text-zinc-400 hover:text-white"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        {/* Page content will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout
