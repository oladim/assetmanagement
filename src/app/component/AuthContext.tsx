// context/AuthContext.js
'use client';
import { createContext, useContext, useState } from 'react';
// import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not fetched yet

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get(`${process.env.url}/api/auth/me`, { withCredentials: true });
//         setUser(res.data.user);
//       } catch (err) {
//         setUser(null); // false = unauthenticated
//       }
//     };
//     checkAuth();
//   }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
