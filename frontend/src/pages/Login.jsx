import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { position } = useGeolocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setSubmitting(true);
    try {
      const lat = position?.lat || null;
      const lng = position?.lng || null;
      const data = await login(email, password, lat, lng);
      toast.success(`Welcome back, ${data.user.name}!`);
      const routes = { donor: '/dashboard/donor', ngo: '/dashboard/ngo', volunteer: '/dashboard/volunteer', admin: '/dashboard/admin' };
      navigate(routes[data.user.role] || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Left panel — branding (desktop only) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 px-16 bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="relative text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <img src="/ShareBiteicon.png" alt="ShareBite" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome Back!</h1>
          <p className="text-green-100 text-lg leading-relaxed max-w-sm">
            Sign in to continue your food donation journey and make a difference today.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { value: '100+', label: 'Meals Saved' },
              { value: '10+', label: 'Active NGOs' },
              { value: '10+', label: 'Volunteers' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-green-200 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-green-50 rounded-xl">
                <img src="/ShareBiteicon.png" alt="ShareBite" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-2xl font-bold gradient-text">ShareBite</span>
            </div>
            <p className="text-slate-500 text-sm">Connecting food donors with those in need</p>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in</h2>
            <p className="text-slate-400 text-sm mb-8">Enter your credentials to access your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-green hover:shadow-green-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Signing in...
                  </>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
