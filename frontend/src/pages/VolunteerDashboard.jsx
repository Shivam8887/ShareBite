import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSocket } from '../hooks/useSocket';
import MapView from '../components/MapView';
import RouteMap from '../components/RouteMap';
import RequestCard from '../components/RequestCard';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { RefreshCw, Filter, List, History } from 'lucide-react';

const FLOW_STEPS = [
  { status: 'accepted', label: 'Accepted', icon: '✅', next: 'picked', nextLabel: 'Mark Picked Up' },
  { status: 'picked', label: 'Picked Up', icon: '📦', next: 'in_transit', nextLabel: 'Start Transit' },
  { status: 'in_transit', label: 'In Transit', icon: '🚗', next: 'delivered', nextLabel: 'Mark Delivered' },
  { status: 'delivered', label: 'Delivered', icon: '🎉', next: null, nextLabel: null },
];

export default function VolunteerDashboard() {
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [smartRequests, setSmartRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [accepting, setAccepting] = useState(null);
  
  // Filters
  const [radius, setRadius] = useState(10);
  const [sort, setSort] = useState('smart');
  const [previewRoute, setPreviewRoute] = useState(null);

  const { position } = useGeolocation();
  const { onEvent, joinDelivery, sendLocation } = useSocket();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [activeRes, histRes] = await Promise.all([
        API.get('/delivery/active'),
        API.get('/volunteer/history'),
      ]);
      
      setActiveDelivery(activeRes.data.delivery);
      setHistory(histRes.data.deliveries || []);

      if (activeRes.data.delivery) {
        joinDelivery(activeRes.data.delivery._id);
      } else if (position.lat) {
        // Only fetch smart requests if no active delivery
        const smartRes = await API.get(`/volunteer/smart-requests?lat=${position.lat}&lng=${position.lng}&radius=${radius}&sort=${sort}`);
        setSmartRequests(smartRes.data.requests || []);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [position.lat, position.lng, radius, sort, joinDelivery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Live Location Sync
  useEffect(() => {
    if (!activeDelivery || activeDelivery.currentStatus === 'delivered' || !position.lat) return;
    const interval = setInterval(() => {
      sendLocation(activeDelivery._id, position.lat, position.lng);
      API.patch('/delivery/location', { deliveryId: activeDelivery._id, lat: position.lat, lng: position.lng }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [activeDelivery, position.lat, position.lng, sendLocation]);

  // Real-time updates
  useEffect(() => {
    const unsubReq = onEvent('newRequest', () => fetchData());
    const unsubDon = onEvent('newDonation', () => fetchData());
    return () => { unsubReq(); unsubDon(); };
  }, [onEvent, fetchData]);

  const handleAccept = async (donationId, requestId) => {
    setAccepting(donationId);
    try {
      const payload = { donationId };
      if (requestId) payload.requestId = requestId;

      const res = await API.post('/delivery/accept', payload);
      setActiveDelivery(res.data.delivery);
      setSmartRequests([]);
      setPreviewRoute(null);
      joinDelivery(res.data.delivery._id);
      toast.success('Request accepted! Navigate to pickup.');
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
        setTimeout(() => {
          setActiveDelivery(null);
          fetchData();
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !smartRequests.length && !activeDelivery) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-dark-400">Loading your dashboard...</p>
      </div>
    );
  }

  const currentStepIndex = activeDelivery ? FLOW_STEPS.findIndex((s) => s.status === activeDelivery.currentStatus) : -1;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* ── Active Delivery Panel ── */}
      {activeDelivery && activeDelivery.currentStatus !== 'delivered' && (
        <div className="glass rounded-xl p-6 border-l-4 border-l-primary-500 shadow-xl shadow-primary-500/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-dark-100 flex items-center gap-2">
                <span className="live-pulse inline-block w-3 h-3 rounded-full bg-green-500"></span>
                Active Delivery Sequence
              </h3>
              <p className="text-sm text-dark-400 mt-1">Follow the steps below to complete this request.</p>
            </div>
            <StatusBadge status={activeDelivery.currentStatus} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left Col: Info & Actions */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Zomato-style Stepper */}
              <div className="bg-dark-800/40 rounded-xl p-5 border border-dark-700/50">
                <div className="flex items-center justify-between mb-6 relative">
                  <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-dark-700"></div>
                  {FLOW_STEPS.map((step, i) => {
                    const isPast = i < currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div key={step.status} className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          isPast ? 'bg-primary-500 text-white' :
                          isCurrent ? 'bg-primary-500 text-white ring-4 ring-primary-500/30 live-pulse' :
                          'bg-dark-700 text-dark-400 border border-dark-600'
                        }`}>
                          {isPast ? '✓' : step.icon}
                        </div>
                        <p className={`text-[10px] mt-2 font-medium uppercase tracking-wide ${isCurrent ? 'text-primary-400' : isPast ? 'text-dark-300' : 'text-dark-500'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Primary Action Button */}
                {currentStepIndex >= 0 && FLOW_STEPS[currentStepIndex]?.next && (
                  <button
                    onClick={() => handleStatusUpdate(FLOW_STEPS[currentStepIndex].next)}
                    disabled={updating}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                  >
                    {updating ? (
                      <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> Updating...</>
                    ) : (
                      FLOW_STEPS[currentStepIndex].nextLabel
                    )}
                  </button>
                )}
              </div>

              {/* Task Details */}
              {activeDelivery.donationId && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wide px-1">Task Details</h4>
                  
                  {/* Pickup Card */}
                  <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-500 font-bold">P</span>
                      </div>
                      <div>
                        <p className="text-xs text-green-400 font-semibold uppercase">Pickup</p>
                        <p className="font-medium text-dark-100 mt-0.5">{activeDelivery.donationId.title}</p>
                        <p className="text-sm text-dark-300 mt-1">Qty: {activeDelivery.donationId.quantity}</p>
                        {activeDelivery.donationId.pickupLocation?.address && (
                          <p className="text-xs text-dark-400 mt-2 bg-dark-900/50 p-2 rounded-md">
                            📍 {activeDelivery.donationId.pickupLocation.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Card */}
                  {activeDelivery.requestId && (
                    <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-500 font-bold">D</span>
                        </div>
                        <div>
                          <p className="text-xs text-red-400 font-semibold uppercase">Deliver To</p>
                          <p className="font-medium text-dark-100 mt-0.5">
                            {activeDelivery.donationId.deliveryLocation?.address || 'NGO'}
                          </p>
                          <p className="text-sm text-dark-300 mt-1">Requested: {activeDelivery.requestId.foodNeeded}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Col: Route Map */}
            <div className="lg:col-span-3 h-[400px] lg:min-h-[400px] rounded-xl overflow-hidden border border-dark-700/50 relative bg-dark-800">
              {activeDelivery.donationId?.pickupLocation?.coordinates ? (
                <RouteMap
                  pickup={{
                    lng: activeDelivery.donationId.pickupLocation.coordinates[0],
                    lat: activeDelivery.donationId.pickupLocation.coordinates[1],
                    label: activeDelivery.donationId.title,
                    address: activeDelivery.donationId.pickupLocation.address
                  }}
                  delivery={
                    activeDelivery.donationId.deliveryLocation?.coordinates[0] !== 0 ? {
                      lng: activeDelivery.donationId.deliveryLocation.coordinates[0],
                      lat: activeDelivery.donationId.deliveryLocation.coordinates[1],
                      label: activeDelivery.donationId.deliveryLocation.address || 'Delivery',
                    } : null
                  }
                  volunteer={position}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark-500">Route map not available</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Smart Recommendations Panel ── */}
      {(!activeDelivery || activeDelivery.currentStatus === 'delivered') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Find Requests</h2>
              <p className="text-dark-400 mt-1">Smart matching based on distance, urgency, and wait time.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={fetchData} className="p-2 bg-dark-800 text-dark-300 hover:text-white rounded-lg border border-dark-700 transition" title="Refresh list">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              
              <div className="flex bg-dark-800 rounded-lg p-1 border border-dark-700">
                <select
                  value={radius}
                  onChange={(e) => { setRadius(Number(e.target.value)); setTimeout(fetchData, 100); }}
                  className="bg-transparent text-sm text-dark-200 outline-none px-2 py-1 cursor-pointer"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                </select>
                <div className="w-px bg-dark-700 mx-1"></div>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setTimeout(fetchData, 100); }}
                  className="bg-transparent text-sm text-dark-200 outline-none px-2 py-1 cursor-pointer"
                >
                  <option value="smart">Smart Sort</option>
                  <option value="nearest">Nearest</option>
                  <option value="urgent">Urgent First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {smartRequests.length === 0 && !loading ? (
            <div className="glass rounded-xl p-12 text-center border-dashed border-dark-600">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter size={24} className="text-dark-400" />
              </div>
              <h3 className="text-lg font-semibold text-dark-200">No requests found</h3>
              <p className="text-dark-400 mt-2 max-w-sm mx-auto">There are no pending donations within {radius}km of your current location. Try expanding your radius.</p>
              <button onClick={() => { setRadius(20); setTimeout(fetchData, 100); }} className="mt-6 px-4 py-2 bg-primary-600/20 text-primary-400 font-medium rounded-lg hover:bg-primary-600/30 transition">
                Expand to 20km
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left Col: Request List */}
              <div className="lg:col-span-2 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {smartRequests.map((item, idx) => (
                  <RequestCard
                    key={item.donation._id}
                    item={item}
                    isRecommended={item.isRecommended}
                    accepting={accepting === item.donation._id}
                    onAccept={handleAccept}
                    onShowRoute={(i) => setPreviewRoute(i)}
                  />
                ))}
              </div>

              {/* Right Col: Map Preview */}
              <div className="lg:col-span-3 h-[400px] lg:h-auto rounded-xl overflow-hidden glass p-1">
                {previewRoute ? (
                  <div className="h-full w-full rounded-lg overflow-hidden relative">
                    <button 
                      onClick={() => setPreviewRoute(null)}
                      className="absolute top-3 right-3 z-[1000] bg-dark-900/90 hover:bg-dark-800 text-white rounded-md p-1.5 shadow-lg border border-dark-600 backdrop-blur"
                    >
                      ✕
                    </button>
                    <RouteMap
                      pickup={{
                        lng: previewRoute.donation.pickupLocation?.coordinates[0],
                        lat: previewRoute.donation.pickupLocation?.coordinates[1],
                        label: previewRoute.donation.title,
                        address: previewRoute.donation.pickupLocation?.address || 'Pickup'
                      }}
                      delivery={
                        previewRoute.matchedRequest?.location?.coordinates ? {
                          lng: previewRoute.matchedRequest.location.coordinates[0],
                          lat: previewRoute.matchedRequest.location.coordinates[1],
                          label: previewRoute.matchedRequest.ngo?.name || 'NGO',
                          address: 'Delivery destination'
                        } : null
                      }
                      volunteer={position}
                    />
                  </div>
                ) : (
                  <div className="h-full w-full rounded-lg overflow-hidden">
                    <MapView
                      center={position}
                      donations={smartRequests.map(r => r.donation)}
                      requests={smartRequests.map(r => r.matchedRequest).filter(Boolean)}
                      className="h-full w-full"
                    />
                    {smartRequests.length > 0 && (
                      <div className="absolute top-4 left-4 right-4 bg-dark-900/80 backdrop-blur py-2 px-4 rounded-lg border border-dark-700 flex items-center justify-between pointer-events-none z-[400]">
                        <span className="text-sm font-medium text-dark-200">Select a request to preview route</span>
                        <div className="flex gap-3 text-xs">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Pickups</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Deliveries</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Volunteer History ── */}
      {(!activeDelivery || activeDelivery.currentStatus === 'delivered') && (
        <div className="mt-12 glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <History size={18} className="text-primary-400" />
            Delivery History
          </h3>
          
          {history.length === 0 ? (
            <div className="text-center py-8 text-dark-500 text-sm">
              You haven't completed any deliveries yet. Accept a request to get started!
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((delivery) => (
                <div key={delivery._id} className="bg-dark-800/50 rounded-lg p-3 border border-dark-700/50">
                  <p className="text-xs text-dark-400 mb-1">{new Date(delivery.statusTimeline?.delivered || delivery.updatedAt).toLocaleDateString()}</p>
                  <p className="font-semibold text-sm text-dark-200 truncate">{delivery.donationId?.title || 'Unknown Donation'}</p>
                  <div className="mt-2 text-xs text-dark-400 space-y-1">
                    <p className="flex items-center gap-1"><span className="text-green-500">P:</span> {delivery.donationId?.pickupLocation?.address ? 'Address provided' : 'Coordinates'}</p>
                    {delivery.requestId && (
                      <p className="flex items-center gap-1"><span className="text-red-500">D:</span> {delivery.requestId?.foodNeeded || 'Request fulfilled'}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
