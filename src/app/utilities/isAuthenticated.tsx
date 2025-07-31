import axios from "axios";
export async function isAuthenticated() {
    const token = localStorage.getItem('token');
    // const expiresAt = localStorage.getItem('expiresAt');
    // return token 
    // && expiresAt && Date.now() < Number(expiresAt);
if(!token){
    return;
}
    try {
        const res = await axios.get(`${process.env.url}/api/auth/me`, {
        //   withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("res from auth", res)
          
        return res;

       

      } catch (err) {
        console.error(`Failed to fetch:`, err);
      }

  }

   

// import axios from 'axios';
// import { useAuth } from '../component/AuthContext';

// export async function isAuthenticated() {
//     const {user} = useAuth();
//     console.log("trying");
// //   try {
// //     const res = await axios.get(`${process.env.url}/api/auth/me`, {
// //       withCredentials: true, // send the cookie
// //     });
// //     console.log("reso",res);
// //     // return res.status === 200;
// //     return res.data.user; // { role, userLocation, ... }
// if(user){
//     console.log(user)
//     return user;
// }else{
//     return false
// }
  
// }


  export function isAuthorized(allowedRoles = []) {
    const role = localStorage.getItem('role');
    console.log("ROLE", role);
    return allowedRoles.includes(role);
  }
  
  // ProtectedRoute.js
// import { Navigate } from 'react-router-dom';

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');
//   const expiresAt = localStorage.getItem('expiresAt');

//   const isAuthenticated = token && expiresAt && Date.now() < Number(expiresAt);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <h2 className="text-xl font-semibold text-gray-800">
//           You do not have access to this page.
//         </h2>
//       </div>
//     );
//   }

//   return children;
// }
