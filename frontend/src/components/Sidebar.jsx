import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const NAV_ITEMS = {
  donor: [
    { to: '/donor', label: 'Dashboard', icon: '📊' },
    { to: '/map', label: 'Live Map', icon: '🗺️' },
    { to: '/requests', label: 'My Donations', icon: '📦' },
  ],
  ngo: [
    { to: '/ngo', label: 'Dashboard', icon: '📊' },
    { to: '/map', label: 'Live Map', icon: '🗺️' },
    { to: '/requests', label: 'Requests', icon: '📥' },
  ],
  volunteer: [
    { to: '/volunteer', label: 'Dashboard', icon: '📊' },
    { to: '/map', label: 'Live Map', icon: '🗺️' },
    { to: '/requests', label: 'Tasks', icon: '🚴' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/map', label: 'Live Map', icon: '🗺️' },
  ],
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const items = NAV_ITEMS[user?.role] || [];

  const roleColors = {
    donor: 'from-green-500 to-emerald-600',
    ngo: 'from-blue-500 to-cyan-600',
    volunteer: 'from-purple-500 to-violet-600',
    admin: 'from-orange-500 to-red-600',
  };

  const roleEmoji = { donor: '🍲', ngo: '🏢', volunteer: '🚴', admin: '🛡️' };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 flex flex-col z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      
      {/* Mobile Close Button */}
      <button 
        onClick={() => setIsOpen(false)}
        className="md:hidden absolute top-4 right-4 p-1.5 text-dark-400 hover:text-white bg-dark-800 rounded-lg transition-colors border border-dark-700/50"
      >
        <X size={20} />
      </button>

      {/* Brand */}
      <div className="px-6 py-5 border-b border-dark-700/50">
        <h1 className="text-2xl font-bold gradient-text">ShareBite</h1>
        <p className="text-xs text-dark-500 mt-0.5">Food Donation Platform</p>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3">
        <div className={`bg-gradient-to-r ${roleColors[user?.role] || 'from-gray-500 to-gray-600'} rounded-xl p-3 flex items-center gap-3`}>
          <span className="text-2xl">{roleEmoji[user?.role] || '👤'}</span>
          <div>
            <p className="text-white font-semibold text-sm">{user?.name}</p>
            <p className="text-white/70 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-dark-700/50">
        <p className="text-xs text-dark-600 text-center">ShareBite v1.0</p>
      </div>
    </aside>
  );
}
