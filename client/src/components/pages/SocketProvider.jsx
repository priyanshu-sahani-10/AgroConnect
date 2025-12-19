import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initSocket } from '../../services/socket';

export default function SocketProvider({ children }) {
  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);

  // Initialize Socket.io when user logs in
  useEffect(() => {
    if (user && user._id) {
      console.log('🔌 Initializing Socket.io for user:', user._id);
      console.log('👤 User details:', { name: user.name, role: user.role });
      
      const socket = initSocket();
      
      // Authenticate socket connection
      socket.emit('authenticate', user._id);
      
      // Listen for authentication confirmation
      socket.on('authenticated', (data) => {
        console.log('✅ Socket authenticated:', data);
      });

      // Listen for errors
      socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });

      // Listen for new message notifications
      socket.on('new_message_notification', (data) => {
        console.log('📨 New message notification:', data);
        // You can show a toast notification here if you have a toast library
        // Example with react-hot-toast:
        // toast.success(`New message from ${data.senderName}`);
      });

      // Listen for online/offline status
      socket.on('user_online', (data) => {
        console.log('👤 User online:', data.userId);
      });

      socket.on('user_offline', (data) => {
        console.log('👤 User offline:', data.userId);
      });

      // Listen for typing indicator
      socket.on('user_typing', (data) => {
        console.log('✍️ User typing:', data);
      });

      // Listen for messages read
      socket.on('messages_read', (data) => {
        console.log('✓✓ Messages read:', data);
      });

      // Cleanup on unmount or user change
      return () => {
        console.log('🔌 Disconnecting socket for user:', user._id);
        socket.off('authenticated');
        socket.off('error');
        socket.off('new_message_notification');
        socket.off('user_online');
        socket.off('user_offline');
        socket.off('user_typing');
        socket.off('messages_read');
        socket.disconnect();
      };
    } else {
      console.log('⏸️ No user logged in, socket not initialized');
    }
  }, [user?._id]); // Only re-run when user ID changes

  // Just render children - this component doesn't render anything itself
  return <>{children}</>;
}