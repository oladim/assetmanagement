// 'use client'

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import axios from 'axios';
// import { Linden_Hill } from 'next/font/google';
// import { useRouter } from 'next/navigation';

// const Settings = () => {
//     const router = useRouter();
//       const [loading, setLoading] = useState(true);

//      useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           router.push('/'); // redirect to login
//         } else {
//           setLoading(false);
//         }
//       }, []);

//     if (loading) {
//         return (
//           <div className="flex items-center justify-center h-screen">
//             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         );
//       }
 
//   return (
//     <div className="flex">
//       Settings Page
//     </div>
//   );
// };

// export default Settings;

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UserEditModal from './UserEditModal';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utilities/isAuthenticated';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

//   const token = () => localStorage.getItem('token');
const router = useRouter();
//   useEffect(() => {
//       const token = localStorage.getItem('token');
//       const role = localStorage.getItem('role');
//       const expiresAt = localStorage.getItem('expiresAt');
  
//       const isAuthenticated = token && expiresAt && Date.now() < Number(expiresAt);
  
//       if (!isAuthenticated) {
//         router.push('/');
//       } else if (role === 'user' || role === 'EOC User') {
//         router.replace('/unauthorized'); // create this page
//       }
//     }, []);
   

useEffect(() => {
    const checkAuth = async () => {
          const authenticated = await isAuthenticated();
          if (!authenticated) {
            router.push('/'); // redirect to login
            return;
          }else if (authenticated.data.user.role === 'user' || authenticated.data.user.role === 'EOC User') {
            router.push('/unauthorized'); // create this page
          }
          // if(!user){
          //   router.push('/');
           
        };
          checkAuth();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.url}/api/auth/all`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
     {isLoading ? (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (<div>
  <h1 className="text-2xl font-semibold mb-6">Manage Users</h1>

    <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Approved</th>
              <th className="px-4 py-2">EOC</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.isApproved ? '✅' : '❌'}</td>
                <td className="px-4 py-2">{user.isEocUser ? '✅' : '❌'}</td>
                <td className="px-4 py-2">{user.location || '-'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>)}

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={fetchUsers}
        />
      )}
    </div>
  );
}


