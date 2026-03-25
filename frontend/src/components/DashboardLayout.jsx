import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 flex relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full max-w-[100vw]">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 glass border-b border-dark-700/50 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1.5 text-dark-300 hover:text-white bg-dark-800 rounded-lg transition-colors border border-dark-700/50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-dark-100 capitalize hidden sm:block">{user?.role} Dashboard</h2>
            <h2 className="text-lg font-semibold text-dark-100 capitalize sm:hidden">Dashboard</h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-dark-200">{user?.name}</p>
              <p className="text-xs text-dark-400">{user?.email}</p>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs md:text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="px-2 md:px-3 py-1.5 text-xs font-medium text-dark-300 hover:text-red-400 border border-dark-700 hover:border-red-500/50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
