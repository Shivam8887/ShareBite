import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  const joinDelivery = useCallback((deliveryId) => {
    socketRef.current?.emit('joinDelivery', deliveryId);
  }, []);

  const leaveDelivery = useCallback((deliveryId) => {
    socketRef.current?.emit('leaveDelivery', deliveryId);
  }, []);

  const sendLocation = useCallback((deliveryId, lat, lng) => {
    socketRef.current?.emit('volunteerLocation', { deliveryId, lat, lng });
  }, []);

  const onEvent = useCallback((event, callback) => {
    socketRef.current?.on(event, callback);
    return () => socketRef.current?.off(event, callback);
  }, []);

  return { socket: socketRef.current, joinDelivery, leaveDelivery, sendLocation, onEvent };
}
