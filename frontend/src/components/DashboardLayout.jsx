import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 glass border-b border-dark-700/50 px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dark-100 capitalize">{user?.role} Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-dark-200">{user?.name}</p>
              <p className="text-xs text-dark-400">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-medium text-dark-300 hover:text-red-400 border border-dark-700 hover:border-red-500/50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
