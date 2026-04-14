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

const roleConfig = {
  donor:     { gradient: 'from-green-500 to-emerald-600', emoji: '🍲', label: 'Donor' },
  ngo:       { gradient: 'from-blue-500 to-cyan-600',     emoji: '🏢', label: 'NGO' },
  volunteer: { gradient: 'from-purple-500 to-violet-600', emoji: '🚴', label: 'Volunteer' },
  admin:     { gradient: 'from-orange-500 to-red-600',    emoji: '🛡️', label: 'Admin' },
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const items = NAV_ITEMS[user?.role] || [];
  const config = roleConfig[user?.role] || { gradient: 'from-slate-500 to-slate-600', emoji: '👤', label: user?.role };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-card flex flex-col z-30 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Mobile Close Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="md:hidden absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        aria-label="Close sidebar"
      >
        <X size={18} />
      </button>

      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-green-50 rounded-xl">
          <img src="/ShareBiteicon.png" alt="ShareBite Logo" className="w-7 h-7 object-contain" />
        </div>
        <div>
          <h1 className="text-lg gradient-text font-bold leading-tight">ShareBite</h1>
          <p className="text-xs text-slate-400 mt-0.5">Food Donation Platform</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-4">
        <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-4 flex items-center gap-3 shadow-soft`}>
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{user?.name}</p>
            <p className="text-white/75 text-xs capitalize mt-0.5">{config.label}</p>
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
                  ? 'bg-green-50 text-green-700 border border-green-200 shadow-soft'
                  : 'text-slate-500 hover:text-green-600 hover:bg-green-50'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100">
        <p className="text-xs text-center text-slate-400">ShareBite v1.0</p>
      </div>
    </aside>
  );
}
