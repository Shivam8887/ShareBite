import { useState, useEffect } from 'react';
import API from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSocket } from '../hooks/useSocket';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('donations');
  const { position } = useGeolocation();
  const { onEvent } = useSocket();

  const fetchData = async () => {
    try {
      const [donRes, reqRes, delRes] = await Promise.all([
        API.get('/donations'),
        API.get('/requests'),
        API.get('/delivery'),
      ]);
      setDonations(donRes.data.donations);
      setRequests(reqRes.data.requests);
      setDeliveries(delRes.data.deliveries);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Real-time updates
  useEffect(() => {
    const unsubs = [
      onEvent('newDonation', (d) => setDonations((prev) => [d, ...prev])),
      onEvent('donationStatusUpdate', (d) => setDonations((prev) => prev.map((x) => (x._id === d._id ? { ...x, ...d } : x)))),
      onEvent('newRequest', (r) => setRequests((prev) => [r, ...prev])),
      onEvent('deliveryCreated', (d) => setDeliveries((prev) => [d, ...prev])),
    ];
    return () => unsubs.forEach((fn) => fn && fn());
  }, [onEvent]);

  const stats = {
    totalDonations: donations.length,
    pendingDonations: donations.filter((d) => d.status === 'pending').length,
    totalDeliveries: deliveries.length,
    completedDeliveries: deliveries.filter((d) => d.currentStatus === 'delivered').length,
    activeRequests: requests.filter((r) => r.status === 'active').length,
    totalRequests: requests.length,
  };

  const tabs = [
    { key: 'donations', label: 'Donations', count: donations.length },
    { key: 'requests', label: 'Requests', count: requests.length },
    { key: 'deliveries', label: 'Deliveries', count: deliveries.length },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Donations', value: stats.totalDonations, icon: '📦', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
          { label: 'Pending', value: stats.pendingDonations, icon: '⏳', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20' },
          { label: 'Total Deliveries', value: stats.totalDeliveries, icon: '🚗', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
          { label: 'Completed', value: stats.completedDeliveries, icon: '✅', color: 'from-green-500/20 to-green-600/10 border-green-500/20' },
          { label: 'Active Requests', value: stats.activeRequests, icon: '🟢', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20' },
          { label: 'Total Requests', value: stats.totalRequests, icon: '📋', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-xl p-3 text-center`}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-xl font-bold text-dark-100 mt-1">{s.value}</p>
            <p className="text-xs text-dark-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-lg font-semibold text-dark-100 mb-3">System Overview Map</h3>
        <MapView
          center={position}
          donations={donations}
          requests={requests}
          volunteers={deliveries}
          className="h-[350px]"
        />
      </div>

      {/* Tabs + Tables */}
      <div className="glass rounded-xl">
        <div className="flex border-b border-dark-700/50">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                activeTab === t.key
                  ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/5'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              {t.label} <span className="ml-1 text-xs opacity-60">({t.count})</span>
            </button>
          ))}
        </div>

        <div className="p-4 overflow-x-auto">
          {activeTab === 'donations' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-400 border-b border-dark-700/50">
                  <th className="text-left py-2 px-2 font-medium">Title</th>
                  <th className="text-left py-2 px-2 font-medium">Donor</th>
                  <th className="text-left py-2 px-2 font-medium">Qty</th>
                  <th className="text-left py-2 px-2 font-medium">Status</th>
                  <th className="text-left py-2 px-2 font-medium">Volunteer</th>
                  <th className="text-left py-2 px-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="text-dark-200">
                {donations.map((d) => (
                  <tr key={d._id} className="border-b border-dark-800/50 hover:bg-dark-800/20">
                    <td className="py-2 px-2 font-medium">{d.title}</td>
                    <td className="py-2 px-2 text-dark-400">{d.donorId?.name || '—'}</td>
                    <td className="py-2 px-2">{d.quantity}</td>
                    <td className="py-2 px-2"><StatusBadge status={d.status} /></td>
                    <td className="py-2 px-2 text-dark-400">{d.assignedVolunteer?.name || '—'}</td>
                    <td className="py-2 px-2 text-dark-500 text-xs">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'requests' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-400 border-b border-dark-700/50">
                  <th className="text-left py-2 px-2 font-medium">Food Needed</th>
                  <th className="text-left py-2 px-2 font-medium">NGO</th>
                  <th className="text-left py-2 px-2 font-medium">Urgency</th>
                  <th className="text-left py-2 px-2 font-medium">Status</th>
                  <th className="text-left py-2 px-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="text-dark-200">
                {requests.map((r) => (
                  <tr key={r._id} className="border-b border-dark-800/50 hover:bg-dark-800/20">
                    <td className="py-2 px-2 font-medium">{r.foodNeeded}</td>
                    <td className="py-2 px-2 text-dark-400">{r.ngoId?.name || '—'}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        r.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                        r.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>{r.urgency}</span>
                    </td>
                    <td className="py-2 px-2"><StatusBadge status={r.status} /></td>
                    <td className="py-2 px-2 text-dark-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'deliveries' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-400 border-b border-dark-700/50">
                  <th className="text-left py-2 px-2 font-medium">Donation</th>
                  <th className="text-left py-2 px-2 font-medium">Volunteer</th>
                  <th className="text-left py-2 px-2 font-medium">Status</th>
                  <th className="text-left py-2 px-2 font-medium">Accepted</th>
                  <th className="text-left py-2 px-2 font-medium">Delivered</th>
                </tr>
              </thead>
              <tbody className="text-dark-200">
                {deliveries.map((d) => (
                  <tr key={d._id} className="border-b border-dark-800/50 hover:bg-dark-800/20">
                    <td className="py-2 px-2 font-medium">{d.donationId?.title || '—'}</td>
                    <td className="py-2 px-2 text-dark-400">{d.volunteerId?.name || '—'}</td>
                    <td className="py-2 px-2"><StatusBadge status={d.currentStatus} /></td>
                    <td className="py-2 px-2 text-dark-500 text-xs">
                      {d.statusTimeline?.accepted ? new Date(d.statusTimeline.accepted).toLocaleString() : '—'}
                    </td>
                    <td className="py-2 px-2 text-dark-500 text-xs">
                      {d.statusTimeline?.delivered ? new Date(d.statusTimeline.delivered).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
