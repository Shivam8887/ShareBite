import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sharebite_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => { logout(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password, lat, lng) => {
    const payload = { email, password, lat: lat || null, lng: lng || null };
    console.log('📤 Sending login payload:', payload);
    const res = await API.post('/auth/login', payload);
    console.log('✅ Login response:', res.data);
    localStorage.setItem('sharebite_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (data) => {
    console.log('📤 Sending signup payload:', data);
    const res = await API.post('/auth/signup', data);
    console.log('✅ Signup response:', res.data);
    localStorage.setItem('sharebite_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sharebite_token');
    setToken(null);
    setUser(null);
  };

  const updateUserLocation = async (lat, lng) => {
    const res = await API.patch('/auth/location', { lat, lng });
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUserLocation }}>
      {children}
    </AuthContext.Provider>
  );
}
