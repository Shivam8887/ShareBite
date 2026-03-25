import { MapPin, Clock, AlertTriangle, Star, Navigation } from 'lucide-react';

const URGENCY_COLORS = {
  high: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', label: 'Urgent' },
  medium: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Medium' },
  low: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30', label: 'Low' },
};

function timeAgo(date) {
  const mins = Math.floor((Date.now() - new Date(date)) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function expiresIn(date) {
  const hrs = Math.max(0, (new Date(date) - Date.now()) / 3600000);
  if (hrs < 1) return `${Math.round(hrs * 60)}min left`;
  if (hrs < 24) return `${Math.round(hrs)}h left`;
  return `${Math.round(hrs / 24)}d left`;
}

export default function RequestCard({
  item,
  onAccept,
  onShowRoute,
  accepting,
  isRecommended,
}) {
  const { donation, matchedRequest, pickupDistance, deliveryDistance, totalDistance, estimatedTime, score } = item;
  const urgency = matchedRequest?.urgency || 'medium';
  const urgencyStyle = URGENCY_COLORS[urgency] || URGENCY_COLORS.medium;

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/5 ${
        isRecommended
          ? 'border-primary-500/40 bg-gradient-to-br from-primary-500/5 to-primary-600/10 ring-1 ring-primary-500/20'
          : 'border-dark-700/30 bg-dark-800/30'
      }`}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-primary-500/30">
          <Star size={10} fill="currentColor" />
          Recommended
        </div>
      )}

      <div className="p-4 pt-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-dark-100 truncate">{donation.title}</h4>
            <p className="text-xs text-dark-400 mt-0.5">
              Qty: {donation.quantity} • {timeAgo(donation.createdAt)}
            </p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${urgencyStyle.bg} ${urgencyStyle.text} ${urgencyStyle.border} border`}>
            <AlertTriangle size={10} />
            {urgencyStyle.label}
          </div>
        </div>

        {/* Location Info */}
        <div className="space-y-2 mb-3">
          {/* Pickup */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <MapPin size={11} className="text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-dark-500 font-medium">Pickup</p>
              <p className="text-xs text-dark-200 truncate">
                {donation.donor?.name || donation.donorId?.name || 'Donor'}
                {donation.pickupLocation?.address ? ` — ${donation.pickupLocation.address}` : ''}
              </p>
              <p className="text-[10px] text-primary-400 font-medium">{pickupDistance} km away</p>
            </div>
          </div>

          {/* Delivery */}
          {matchedRequest && (
            <div className="flex items-start gap-2">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <Navigation size={11} className="text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-dark-500 font-medium">Deliver to</p>
                <p className="text-xs text-dark-200 truncate">
                  {matchedRequest.ngo?.name || matchedRequest.ngoId?.name || 'NGO'}
                  {matchedRequest.foodNeeded ? ` — needs "${matchedRequest.foodNeeded}"` : ''}
                </p>
                <p className="text-[10px] text-primary-400 font-medium">{deliveryDistance} km from pickup</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 bg-dark-800/50 rounded-lg px-3 py-2 mb-3">
          <div className="flex items-center gap-1 text-[11px] text-dark-300">
            <MapPin size={11} className="text-primary-400" />
            <span>{totalDistance} km total</span>
          </div>
          <div className="w-px h-3 bg-dark-700"></div>
          <div className="flex items-center gap-1 text-[11px] text-dark-300">
            <Clock size={11} className="text-primary-400" />
            <span>~{estimatedTime} min</span>
          </div>
          <div className="w-px h-3 bg-dark-700"></div>
          <div className="flex items-center gap-1 text-[11px] text-dark-300">
            <AlertTriangle size={11} className="text-orange-400" />
            <span>{expiresIn(donation.expiryTime)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAccept(donation._id, matchedRequest?._id)}
            disabled={accepting}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 ${
              isRecommended
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg shadow-primary-500/20'
                : 'bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 border border-primary-500/20'
            }`}
          >
            {accepting ? 'Accepting...' : '✅ Accept Request'}
          </button>
          {onShowRoute && (
            <button
              onClick={() => onShowRoute(item)}
              className="px-3 py-2.5 text-sm font-medium rounded-xl bg-dark-700/50 hover:bg-dark-700 text-dark-300 hover:text-dark-100 border border-dark-600/30 transition-all"
              title="Preview route on map"
            >
              🗺️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
