function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('⚡ Socket connected:', socket.id);

    // Join a delivery room for live tracking
    socket.on('joinDelivery', (deliveryId) => {
      socket.join(`delivery_${deliveryId}`);
      console.log(`Socket ${socket.id} joined delivery_${deliveryId}`);
    });

    // Leave a delivery room
    socket.on('leaveDelivery', (deliveryId) => {
      socket.leave(`delivery_${deliveryId}`);
    });

    // Volunteer sends live location (alternative to REST)
    socket.on('volunteerLocation', (data) => {
      const { deliveryId, lat, lng } = data;
      io.to(`delivery_${deliveryId}`).emit('locationUpdate', { deliveryId, lat, lng });
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected:', socket.id);
    });
  });
}

module.exports = initSocket;
