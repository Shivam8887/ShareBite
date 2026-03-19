import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSocket } from '../hooks/useSocket';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const FLOW_STEPS = [
  { status: 'accepted', label: 'Accepted', icon: '✅', next: 'picked', nextLabel: 'Mark Picked Up' },
  { status: 'picked', label: 'Picked Up', icon: '📦', next: 'in_transit', nextLabel: 'Start Transit' },
  { status: 'in_transit', label: 'In Transit', icon: '🚗', next: 'delivered', nextLabel: 'Mark Delivered' },
  { status: 'delivered', label: 'Delivered', icon: '🎉', next: null, nextLabel: null },
];

export default function VolunteerDashboard() {
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [accepting, setAccepting] = useState(null);
  const { position } = useGeolocation();
  const { onEvent, joinDelivery, sendLocation } = useSocket();

  const fetchData = useCallback(async () => {
    try {
      const [activeRes, nearbyRes] = await Promise.all([
        API.get('/delivery/active'),
        position.lat ? API.get(`/donations/nearby?lat=${position.lat}&lng=${position.lng}&radius=15`) : Promise.resolve({ data: { donations: [] } }),
      ]);
      setActiveDelivery(activeRes.data.delivery);
      setNearbyDonations(nearbyRes.data.donations || []);
      if (activeRes.data.delivery) {
        joinDelivery(activeRes.data.delivery._id);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [position.lat, position.lng, joinDelivery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Send live location when on active delivery
  useEffect(() => {
    if (!activeDelivery || activeDelivery.currentStatus === 'delivered' || !position.lat) return;
    const interval = setInterval(() => {
      sendLocation(activeDelivery._id, position.lat, position.lng);
      API.patch('/delivery/location', { deliveryId: activeDelivery._id, lat: position.lat, lng: position.lng }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [activeDelivery, position.lat, position.lng, sendLocation]);

  // Listen for real-time events
  useEffect(() => {
    const unsub = onEvent('newDonation', (donation) => {
      setNearbyDonations((prev) => [donation, ...prev]);
    });
    return unsub;
  }, [onEvent]);

  const handleAccept = async (donationId) => {
    setAccepting(donationId);
    try {
      const res = await API.post('/delivery/accept', { donationId });
      setActiveDelivery(res.data.delivery);
      setNearbyDonations((prev) => prev.filter((d) => d._id !== donationId));
      joinDelivery(res.data.delivery._id);
      toast.success('Delivery accepted! Go to pickup location.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    } finally {
      setAccepting(null);
    }
  };

  const handleStatusUpdate = async (nextStatus) => {
    if (!activeDelivery) return;
    setUpdating(true);
    try {
      const res = await API.patch('/delivery/status', { deliveryId: activeDelivery._id, status: nextStatus });
      setActiveDelivery(res.data.delivery);
      const labels = { picked: 'Picked up!', in_transit: 'On the way!', delivered: 'Delivered successfully! 🎉' };
      toast.success(labels[nextStatus] || 'Status updated!');
      if (nextStatus === 'delivered') {
        setTimeout(() => fetchData(), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const currentStepIndex = activeDelivery
    ? FLOW_STEPS.findIndex((s) => s.status === activeDelivery.currentStatus)
    : -1;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Delivery */}
      {activeDelivery && activeDelivery.currentStatus !== 'delivered' && (
        <div className="glass rounded-xl p-6 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
              <span className="live-pulse inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Active Delivery
            </h3>
            <StatusBadge status={activeDelivery.currentStatus} />
          </div>

          {/* Donation Info */}
          {activeDelivery.donationId && (
            <div className="bg-dark-800/40 rounded-lg p-3 mb-5">
              <p className="text-sm font-medium text-dark-200">{activeDelivery.donationId.title}</p>
              <p className="text-xs text-dark-400 mt-1">Qty: {activeDelivery.donationId.quantity}</p>
            </div>
          )}

          {/* Flow Steps — Zomato Style */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              {FLOW_STEPS.map((step, i) => {
                const isPast = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                const isFuture = i > currentStepIndex;
                return (
                  <div key={step.status} className="flex-1 flex flex-col items-center relative">
                    {/* Connector line */}
                    {i > 0 && (
                      <div className={`absolute top-4 -left-1/2 w-full h-0.5 ${isPast || isCurrent ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
                    )}
                    {/* Circle */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isPast ? 'bg-primary-500 text-white' :
                      isCurrent ? 'bg-primary-500 text-white ring-4 ring-primary-500/30 live-pulse' :
                      'bg-dark-700 text-dark-400'
                    }`}>
                      {isPast ? '✓' : step.icon}
                    </div>
                    <p className={`text-xs mt-1.5 text-center ${isCurrent ? 'text-primary-400 font-medium' : isFuture ? 'text-dark-500' : 'text-dark-300'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Action Button */}
          {currentStepIndex >= 0 && FLOW_STEPS[currentStepIndex]?.next && (
            <button
              onClick={() => handleStatusUpdate(FLOW_STEPS[currentStepIndex].next)}
              disabled={updating}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {updating ? 'Updating...' : FLOW_STEPS[currentStepIndex].nextLabel}
            </button>
          )}

          {/* Map */}
          <div className="mt-5">
            <MapView
              center={position}
              donations={activeDelivery.donationId ? [activeDelivery.donationId] : []}
              volunteers={[activeDelivery]}
              className="h-[300px]"
            />
          </div>
        </div>
      )}

      {/* Nearby Donations to Accept */}
      {(!activeDelivery || activeDelivery.currentStatus === 'delivered') && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Nearby Donations Available for Pickup</h3>

          {nearbyDonations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-dark-400">No nearby donations available right now</p>
              <p className="text-dark-500 text-sm mt-1">New donations will appear here automatically</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-5">
                {nearbyDonations.map((d) => (
                  <div key={d._id} className="bg-dark-800/30 rounded-lg p-4 border border-dark-700/30 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-dark-100">{d.title}</p>
                      <p className="text-xs text-dark-400 mt-1">Qty: {d.quantity} • Expires: {new Date(d.expiryTime).toLocaleString()}</p>
                      {d.donorId && <p className="text-xs text-dark-500 mt-0.5">Donor: {d.donorId.name}</p>}
                    </div>
                    <button
                      onClick={() => handleAccept(d._id)}
                      disabled={accepting === d._id}
                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-xl hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 whitespace-nowrap"
                    >
                      {accepting === d._id ? 'Accepting...' : 'Accept'}
                    </button>
                  </div>
                ))}
              </div>

              <MapView
                center={position}
                donations={nearbyDonations}
                className="h-[300px]"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
