import { useState, useEffect, useCallback } from 'react';
import MapView from '../components/MapView';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { toast } from 'react-hot-toast';
import api from '../services/api';

// Lucknow fallback
const FALLBACK_CENTER = { lat: 26.8467, lng: 80.9462 };

export default function MapPage() {
  const { user } = useAuth();
  const {
    position,
    error: geoError,
    loading: geoLoading,
    usingFallback,
    refetch: refetchLocation,
  } = useGeolocation();

  const [mapData, setMapData] = useState({ donations: [], requests: [], volunteers: [] });
  const [center, setCenter] = useState(FALLBACK_CENTER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationReady, setLocationReady] = useState(false);

  // ── Update center when geolocation resolves ──
  useEffect(() => {
    if (!geoLoading && position.lat !== null && position.lng !== null) {
      console.log('[MapPage] Setting map center to:', position);
      setCenter({ lat: position.lat, lng: position.lng });
      setLocationReady(true);

      // Show toast if using fallback
      if (usingFallback && geoError) {
        toast.error(geoError);
      }

      // Save volunteer location to backend
      if (user?.role === 'volunteer' && !usingFallback) {
        api.patch('/auth/location', { lat: position.lat, lng: position.lng })
          .catch((err) => console.error('Failed to update location:', err));
      }
    }
  }, [geoLoading, position.lat, position.lng, usingFallback, geoError, user]);

  // ── Fetch Map Data ──
  const fetchMapData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/map/map-data', {
        params: { lat: center.lat, lng: center.lng, radius: 10 },
      });
      setMapData({
        donations: res.data.donations || [],
        requests: res.data.requests || [],
        volunteers: res.data.volunteers || [],
      });
    } catch (err) {
      console.error('Map data fetch error:', err);
      const msg = err.response?.data?.message || 'Failed to load map data';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [center.lat, center.lng]);

  useEffect(() => {
    if (locationReady) {
      fetchMapData();
      const interval = setInterval(fetchMapData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchMapData, locationReady]);

  // ── Handle "Get Current Location" button ──
  const handleGetLocation = () => {
    toast.loading('Fetching your location...', { id: 'geo-fetch' });
    refetchLocation();
    // The useEffect above will update center when position changes
    toast.dismiss('geo-fetch');
    toast.success('Location updated!');
  };

  // ── Volunteer Accept Pickup ──
  const handleAcceptPickup = async (donationId) => {
    try {
      await api.post('/delivery/accept', { donationId });
      toast.success('Pickup accepted successfully!');
      setMapData((prev) => ({
        ...prev,
        donations: prev.donations.filter((d) => d._id !== donationId),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept pickup');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Live Map</h2>
          <p className="text-dark-400 text-sm">
            Real-time view of nearby donations, requests, and volunteers
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Location loading indicator */}
          {geoLoading && (
            <span className="flex items-center gap-2 text-sm text-blue-400 animate-pulse">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              Detecting location...
            </span>
          )}
          {/* Map data loading indicator */}
          {loading && !geoLoading && (
            <span className="flex items-center gap-2 text-sm text-primary-400 animate-pulse">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-400 animate-ping"></span>
              Updating map...
            </span>
          )}
          {/* Get Current Location button */}
          <button
            onClick={handleGetLocation}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5"
            title="Get Current Location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            My Location
          </button>
          <button
            onClick={fetchMapData}
            className="px-3 py-1.5 text-xs font-medium text-dark-300 hover:text-white border border-dark-700 hover:border-primary-500/50 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Geolocation Error */}
      {geoError && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm flex items-center gap-2">
          <span>📍</span>
          <span>{geoError}{usingFallback ? ' — Showing Lucknow as default.' : ''}</span>
          <button onClick={handleGetLocation} className="ml-auto underline hover:text-yellow-300">
            Retry
          </button>
        </div>
      )}

      {/* API Error State */}
      {error && !loading && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={fetchMapData} className="ml-auto underline hover:text-red-300">
            Retry
          </button>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 bg-dark-900 rounded-xl overflow-hidden border border-dark-700/50 shadow-2xl relative">
        <MapView
          center={center}
          userPosition={!usingFallback && position.lat !== null ? position : null}
          donations={mapData.donations}
          requests={mapData.requests}
          volunteers={mapData.volunteers}
          userRole={user?.role}
          onAcceptPickup={handleAcceptPickup}
          className="h-full w-full"
        />

        {/* Stats Bar */}
        <div className="absolute top-4 left-4 z-[400] flex gap-2">
          <div className="bg-dark-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-dark-700/50 text-xs text-dark-300">
            <span className="text-green-400 font-bold">{mapData.donations.length}</span> Donations
          </div>
          <div className="bg-dark-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-dark-700/50 text-xs text-dark-300">
            <span className="text-red-400 font-bold">{mapData.requests.length}</span> Requests
          </div>
          <div className="bg-dark-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-dark-700/50 text-xs text-dark-300">
            <span className="text-orange-400 font-bold">{mapData.volunteers.length}</span> Volunteers
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 z-[400] bg-dark-900/90 backdrop-blur-md p-4 rounded-xl border border-dark-700/50 shadow-xl">
          <h4 className="text-white font-semibold text-sm mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm text-dark-300">Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm text-dark-300">Donor (Available Food)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-sm text-dark-300">Volunteer (Active)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm text-dark-300">NGO Request (Food Needed)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
