import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';

export default function RequestsPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let res;
        if (user.role === 'donor') {
          res = await api.get('/donations/my');
          setData(res.data.donations || []);
        } else if (user.role === 'ngo') {
          res = await api.get('/requests/my'); // Assuming this endpoint exists, or use /requests
          // Since it might fetch all requests or just my requests
          setData(res.data.requests || []);
        } else if (user.role === 'volunteer') {
          res = await api.get('/delivery');
          setData(res.data.deliveries || res.data || []);
        } else {
          setData([]);
        }
      } catch (err) {
        toast.error('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const getTitle = () => {
    if (user.role === 'donor') return 'My Donations';
    if (user.role === 'ngo') return 'My Requests';
    if (user.role === 'volunteer') return 'My Delivery Tasks';
    return 'Requests';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-dark-900 p-6 rounded-xl border border-dark-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600 mb-2">
            {getTitle()}
          </h2>
          <p className="text-dark-400 max-w-lg">
            Track and manage your history of items.
          </p>
        </div>
      </div>

      <div className="bg-dark-900 rounded-xl overflow-hidden border border-dark-700/50 p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <h3 className="text-lg font-medium text-dark-200">No items found</h3>
            <p className="text-dark-500 mt-1">You haven't made any records yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="py-3 px-4 text-sm font-semibold text-dark-300">Title / Item</th>
                  <th className="py-3 px-4 text-sm font-semibold text-dark-300">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-dark-300">Date Created</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item._id || idx} className="border-b border-dark-800/50 hover:bg-dark-800/20 transition">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-dark-100">{item.title || item.foodNeeded || 'Delivery Task'}</p>
                      {(item.quantity || item.urgency) && (
                         <p className="text-xs text-dark-400">Info: {item.quantity || item.urgency}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status || item.currentStatus || 'pending'} />
                    </td>
                    <td className="py-3 px-4 text-sm text-dark-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
