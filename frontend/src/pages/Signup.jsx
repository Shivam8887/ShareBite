import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'donor', label: 'Donor', icon: '🍲', desc: 'Donate surplus food' },
  { value: 'ngo', label: 'NGO', icon: '🏢', desc: 'Request food for communities' },
  { value: 'volunteer', label: 'Volunteer', icon: '🚴', desc: 'Deliver food donations' },
];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const { position, loading: geoLoading, error: geoError } = useGeolocation();
  const navigate = useNavigate();

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.role) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        lat: position?.lat || null,
        lng: position?.lng || null,
      };
      console.log('📤 Sending signup payload:', payload);
      const data = await signup(payload);
      toast.success(`Welcome, ${data.user.name}!`);
      const routes = { donor: '/dashboard/donor', ngo: '/dashboard/ngo', volunteer: '/dashboard/volunteer', admin: '/dashboard/admin' };
      navigate(routes[data.user.role] || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl gradient-text mb-2 text-gray-900 dark:text-dark-50 font-bold tracking-tight">ShareBite</h1>
          <p className="text-sm text-gray-700 dark:text-dark-300 leading-relaxed">Join the food sharing revolution</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl mb-6 text-gray-900 dark:text-dark-50 font-bold tracking-tight">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => update('role', r.value)}
                    className={`p-3 rounded-xl text-center border transition-all ${
                      form.role === r.value
                        ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/50'
                        : 'border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/30 hover:border-dark-500'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{r.icon}</span>
                    <span className="text-xs font-medium text-dark-200">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Geolocation status indicator */}
            <div className="text-xs text-gray-500 dark:text-dark-400">
              {geoLoading ? (
                <span className="flex items-center gap-1">⏳ Getting your location…</span>
              ) : geoError ? (
                <span className="flex items-center gap-1 text-yellow-400">⚠️ Location unavailable — defaults will be used</span>
              ) : (
                <span className="flex items-center gap-1 text-green-400">📍 Location detected</span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-700 dark:text-dark-300 leading-relaxed">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
