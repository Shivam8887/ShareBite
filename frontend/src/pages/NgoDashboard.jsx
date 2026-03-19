import { useState, useEffect } from 'react';
import API from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSocket } from '../hooks/useSocket';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function NgoDashboard() {
  const [myRequests, setMyRequests] = useState([]);
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ foodNeeded: '', urgency: 'medium' });
  const [submitting, setSubmitting] = useState(false);
  const { position } = useGeolocation();
  const { onEvent } = useSocket();

  const fetchData = async () => {
    try {
      const [reqRes, donRes] = await Promise.all([
        API.get('/requests/my'),
        position.lat ? API.get(`/requests/match?lat=${position.lat}&lng=${position.lng}&radius=15`) : Promise.resolve({ data: { donations: [] } }),
      ]);
      setMyRequests(reqRes.data.requests);
      setNearbyDonations(donRes.data.donations || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [position.lat, position.lng]);

  // Listen for new donations
  useEffect(() => {
    const unsub = onEvent('newDonation', (donation) => {
      setNearbyDonations((prev) => [donation, ...prev]);
      toast('🍲 New donation nearby!', { icon: '📍' });
    });
    return unsub;
  }, [onEvent]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!position.lat || !position.lng) return toast.error('Location not detected yet');
    setSubmitting(true);
    try {
      const res = await API.post('/requests', {
        ...form,
        lat: position.lat,
        lng: position.lng,
      });
      setMyRequests((prev) => [res.data.request, ...prev]);
      setForm({ foodNeeded: '', urgency: 'medium' });
      setShowForm(false);
      toast.success('Request created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'My Requests', value: myRequests.length, icon: '📋', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
          { label: 'Active Requests', value: myRequests.filter((r) => r.status === 'active').length, icon: '🟢', color: 'from-green-500/20 to-green-600/10 border-green-500/20' },
          { label: 'Nearby Donations', value: nearbyDonations.length, icon: '📍', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20' },
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

      {/* Map with nearby donations + requests */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-lg font-semibold text-dark-100 mb-3">Nearby Donations & My Requests</h3>
        <MapView
          center={position}
          donations={nearbyDonations}
          requests={myRequests}
          className="h-[350px]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Request / My Requests */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-100">
              {showForm ? 'Create Food Request' : 'My Requests'}
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showForm
                  ? 'bg-dark-800 text-dark-300'
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20'
              }`}
            >
              {showForm ? '← Back' : '+ New Request'}
            </button>
          </div>

          {showForm ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Food Needed</label>
                <input
                  type="text"
                  value={form.foodNeeded}
                  onChange={(e) => setForm({ ...form, foodNeeded: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  placeholder="e.g., Rice and Dal for 100 people"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Urgency</label>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-dark-100 focus:outline-none focus:border-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Request'}
              </button>
            </form>
          ) : loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
            </div>
          ) : myRequests.length === 0 ? (
            <p className="text-dark-500 text-center py-8">No requests yet</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {myRequests.map((r) => (
                <div key={r._id} className="bg-dark-800/30 rounded-lg p-3 border border-dark-700/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-dark-200">{r.foodNeeded}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-dark-400">
                    <span className={`px-1.5 py-0.5 rounded ${r.urgency === 'high' ? 'bg-red-500/20 text-red-400' : r.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {r.urgency}
                    </span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nearby Donations */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Nearby Available Donations</h3>
          {nearbyDonations.length === 0 ? (
            <p className="text-dark-500 text-center py-8">No nearby donations found</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {nearbyDonations.map((d) => (
                <div key={d._id} className="bg-dark-800/30 rounded-lg p-4 border border-dark-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-dark-100">{d.title}</p>
                    <StatusBadge status={d.status} />
                  </div>
                  {d.description && <p className="text-xs text-dark-400 mb-2">{d.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-dark-400">
                    <span>Qty: {d.quantity}</span>
                    <span>Expires: {new Date(d.expiryTime).toLocaleString()}</span>
                  </div>
                  {d.donorId && (
                    <p className="text-xs text-dark-500 mt-1">Donor: {d.donorId.name} {d.donorId.phone && `• ${d.donorId.phone}`}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
