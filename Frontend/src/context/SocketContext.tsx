import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getUser } from '../utils/auth-utils';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    const user = getUser();
    if (user) {
      const newSocket = io('http://localhost:3001', {
        query: { userId: user.id.toString() },
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
      });

      setSocket(newSocket);
      initializedRef.current = true;

      return () => {
        newSocket.disconnect();
        initializedRef.current = false;
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
