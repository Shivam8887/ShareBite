import { useState, useEffect } from 'react';
import API from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSocket } from '../hooks/useSocket';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { Plus, X, Package, Clock, CheckCircle, MapPin } from 'lucide-react';

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', quantity: '', expiryTime: '' });
  const [submitting, setSubmitting] = useState(false);
  const { position } = useGeolocation();
  const { onEvent } = useSocket();

  const fetchDonations = async () => {
    try {
      const res = await API.get('/donations/my');
      setDonations(res.data.donations);
    } catch {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  useEffect(() => {
    const unsub = onEvent('donationStatusUpdate', (updated) => {
      setDonations((prev) => prev.map((d) => (d._id === updated._id ? { ...d, ...updated } : d)));
    });
    return unsub;
  }, [onEvent]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!position.lat || !position.lng) return toast.error('Location not detected. Please allow location access.');
    setSubmitting(true);
    try {
      const res = await API.post('/donations', { ...form, lat: position.lat, lng: position.lng });
      setDonations((prev) => [res.data.donation, ...prev]);
      setForm({ title: '', description: '', quantity: '', expiryTime: '' });
      setShowForm(false);
      toast.success('Donation created successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create donation');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: donations.length,
    pending: donations.filter((d) => d.status === 'pending').length,
    delivered: donations.filter((d) => d.status === 'delivered').length,
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-sm";

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Donations', value: stats.total,    icon: Package,      color: 'bg-blue-50 border-blue-200',   iconColor: 'text-blue-500',  valColor: 'text-blue-700' },
          { label: 'Pending Pickup',  value: stats.pending,  icon: Clock,        color: 'bg-amber-50 border-amber-200', iconColor: 'text-amber-500', valColor: 'text-amber-700' },
          { label: 'Delivered',       value: stats.delivered, icon: CheckCircle, color: 'bg-green-50 border-green-200', iconColor: 'text-green-500', valColor: 'text-green-700' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.color} border rounded-2xl p-5 flex items-center gap-4`}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                <Icon className={`w-6 h-6 ${s.iconColor}`} />
              </div>
              <div>
                <p className={`text-3xl font-bold ${s.valColor}`}>{s.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Form / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">
            {showForm ? 'Create New Donation' : 'Your Donations'}
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              showForm
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-green-500 text-white hover:bg-green-600 shadow-green'
            }`}
          >
            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Donation</>}
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleCreate} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Food Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass} placeholder="e.g., 50 Roti packets" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass + ' resize-none'} placeholder="Additional details about the food..." rows={3} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantity</label>
                <input type="text" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className={inputClass} placeholder="e.g., 50 servings" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expiry Time</label>
                <input type="datetime-local" value={form.expiryTime} onChange={(e) => setForm({ ...form, expiryTime: e.target.value })}
                  className={inputClass} required />
              </div>
            </div>

            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${position.lat ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
              <MapPin className="w-4 h-4 shrink-0" />
              {position.lat ? (
                <span>Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</span>
              ) : (
                <span>Detecting location... Please allow location access.</span>
              )}
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-green transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Donation'}
            </button>
          </form>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-slate-500 font-medium">No donations yet.</p>
            <p className="text-slate-400 text-sm mt-1">Click "New Donation" to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left pb-3 px-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Title</th>
                  <th className="text-left pb-3 px-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Quantity</th>
                  <th className="text-left pb-3 px-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Expiry</th>
                  <th className="text-left pb-3 px-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left pb-3 px-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Volunteer</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{d.title}</td>
                    <td className="py-3.5 px-3 text-slate-600">{d.quantity}</td>
                    <td className="py-3.5 px-3 text-slate-400 text-xs">{new Date(d.expiryTime).toLocaleString()}</td>
                    <td className="py-3.5 px-3"><StatusBadge status={d.status} /></td>
                    <td className="py-3.5 px-3 text-slate-500">{d.assignedVolunteer?.name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Your Donations on Map</h3>
        <MapView center={position} donations={donations} className="h-[350px]" />
      </div>
    </div>
  );
}
