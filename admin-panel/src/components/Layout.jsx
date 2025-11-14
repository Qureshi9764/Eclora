import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-light">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

