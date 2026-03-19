const STATUS_MAP = {
  pending: 'badge-pending',
  accepted: 'badge-accepted',
  picked: 'badge-picked',
  in_transit: 'badge-in_transit',
  delivered: 'badge-delivered',
  active: 'badge-active',
  fulfilled: 'badge-fulfilled',
};

const LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  picked: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  active: 'Active',
  fulfilled: 'Fulfilled',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_MAP[status] || 'bg-dark-700 text-dark-300'}`}>
      {LABELS[status] || status}
    </span>
  );
}
