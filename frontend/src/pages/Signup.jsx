import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

const ROLES = [
  { value: 'donor',     label: 'Donor',     icon: '🍲', desc: 'Donate surplus food',      color: 'border-green-400 bg-green-50 ring-green-500' },
  { value: 'ngo',       label: 'NGO',        icon: '🏢', desc: 'Receive for communities', color: 'border-blue-400 bg-blue-50 ring-blue-500' },
  { value: 'volunteer', label: 'Volunteer',  icon: '🚴', desc: 'Deliver donations',        color: 'border-amber-400 bg-amber-50 ring-amber-500' },
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
    if (!form.name || !form.email || !form.password || !form.role)
      return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setSubmitting(true);
    try {
      const payload = { ...form, lat: position?.lat || null, lng: position?.lng || null };
      const data = await signup(payload);
      toast.success(`Welcome, ${data.user.name}! 🎉`);
      const routes = { donor: '/dashboard/donor', ngo: '/dashboard/ngo', volunteer: '/dashboard/volunteer', admin: '/dashboard/admin' };
      navigate(routes[data.user.role] || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-sm";

  return (
    <div className="min-h-screen pt-20 pb-12 flex bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-5/12 px-12 bg-gradient-to-br from-emerald-500 to-green-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="relative text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <img src="/ShareBiteicon.png" alt="ShareBite" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Join ShareBite</h1>
          <p className="text-green-100 leading-relaxed max-w-xs">
            Be part of the food sharing revolution. Every meal shared makes a difference.
          </p>
          <div className="mt-10 space-y-4 text-left">
            {ROLES.map((r) => (
              <div key={r.value} className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{r.label}</p>
                  <p className="text-green-200 text-xs">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-green-50 rounded-xl">
                <img src="/ShareBiteicon.png" alt="ShareBite" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-2xl font-bold gradient-text">ShareBite</span>
            </div>
            <p className="text-slate-500 text-sm">Join the food sharing revolution</p>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Create account</h2>
            <p className="text-slate-400 text-sm mb-7">It's free and only takes a few seconds</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                    className={inputClass} placeholder="John Doe" required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                    className={inputClass} placeholder="you@example.com" required />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)}
                    className={inputClass} placeholder="Min 6 characters" required />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                    className={inputClass} placeholder="+91 9876543210" />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => update('role', r.value)}
                      className={`p-3 rounded-xl text-center border-2 transition-all ${
                        form.role === r.value
                          ? `${r.color} ring-2 ring-offset-1`
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{r.icon}</span>
                      <span className="text-xs font-semibold text-slate-700">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Geolocation status */}
              <div className="text-xs">
                {geoLoading ? (
                  <span className="text-slate-400 flex items-center gap-1">⏳ Getting your location…</span>
                ) : geoError ? (
                  <span className="text-amber-500 flex items-center gap-1">⚠️ Location unavailable — defaults will be used</span>
                ) : (
                  <span className="text-green-600 flex items-center gap-1">📍 Location detected successfully</span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-green hover:shadow-green-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Creating Account...
                  </>
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
