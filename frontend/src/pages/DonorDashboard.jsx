import { useState, useEffect } from 'react';
import API from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSocket } from '../hooks/useSocket';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

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
    } catch (err) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  // Listen for real-time status updates
  useEffect(() => {
    const unsub = onEvent('donationStatusUpdate', (updated) => {
      setDonations((prev) => prev.map((d) => (d._id === updated._id ? { ...d, ...updated } : d)));
    });
    return unsub;
  }, [onEvent]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!position.lat || !position.lng) return toast.error('Location not detected yet. Please allow location access.');
    setSubmitting(true);
    try {
      const res = await API.post('/donations', {
        ...form,
        lat: position.lat,
        lng: position.lng,
      });
      setDonations((prev) => [res.data.donation, ...prev]);
      setForm({ title: '', description: '', quantity: '', expiryTime: '' });
      setShowForm(false);
      toast.success('Donation created successfully!');
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

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Donations', value: stats.total, icon: '📦', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
          { label: 'Pending Pickup', value: stats.pending, icon: '⏳', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20' },
          { label: 'Delivered', value: stats.delivered, icon: '✅', color: 'from-green-500/20 to-green-600/10 border-green-500/20' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-xl p-4 flex items-center gap-4`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold text-dark-100">{s.value}</p>
              <p className="text-sm text-dark-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Donation Button / Form */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-100">
            {showForm ? 'Create New Donation' : 'Your Donations'}
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              showForm
                ? 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/20'
            }`}
          >
            {showForm ? '← Back to List' : '+ New Donation'}
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleCreate} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Food Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500"
                placeholder="e.g., 50 Roti packets"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 resize-none"
                placeholder="Additional details about the food..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Quantity</label>
                <input
                  type="text"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  placeholder="e.g., 50 servings"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Expiry Time</label>
                <input
                  type="datetime-local"
                  value={form.expiryTime}
                  onChange={(e) => setForm({ ...form, expiryTime: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-400">
              <span className="text-lg">📍</span>
              {position.lat ? (
                <span>Location detected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</span>
              ) : (
                <span className="text-yellow-400">Detecting location... Please allow location access.</span>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Donation'}
            </button>
          </form>
        ) : loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
          </div>
        ) : donations.length === 0 ? (
          <p className="text-dark-500 text-center py-10">No donations yet. Create your first donation!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-400 border-b border-dark-700/50">
                  <th className="text-left py-3 px-2 font-medium">Title</th>
                  <th className="text-left py-3 px-2 font-medium">Quantity</th>
                  <th className="text-left py-3 px-2 font-medium">Expiry</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium">Volunteer</th>
                </tr>
              </thead>
              <tbody className="text-dark-200">
                {donations.map((d) => (
                  <tr key={d._id} className="border-b border-dark-800/50 hover:bg-dark-800/30">
                    <td className="py-3 px-2 font-medium">{d.title}</td>
                    <td className="py-3 px-2">{d.quantity}</td>
                    <td className="py-3 px-2 text-dark-400">{new Date(d.expiryTime).toLocaleString()}</td>
                    <td className="py-3 px-2"><StatusBadge status={d.status} /></td>
                    <td className="py-3 px-2 text-dark-400">{d.assignedVolunteer?.name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-lg font-semibold text-dark-100 mb-3">Your Donations on Map</h3>
        <MapView
          center={position}
          donations={donations}
          className="h-[350px]"
        />
      </div>
    </div>
  );
}
