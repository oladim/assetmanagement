// 'use client'

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { isAuthenticated } from './utilities/isAuthenticated';
// // import { useAuth } from './component/AuthContext';


// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const [pendingApproval, setPendingApproval] = useState(false);
// const [message, setMessage] = useState('');
// // const { setUser } = useAuth();

//   // useEffect(() => {
//   //   if (isAuthenticated) {
//   //     router.push('/main');
//   //   }
//   // }, []);

//   //   useEffect(() => {
//   //   // const token = localStorage.getItem('token');
//   //   const checkAuth = async () => {
//   //     const authenticated = await isAuthenticated();
//   //     if (!authenticated) {
//   //       router.push('/'); // redirect to login
//   //     }else{
//   //       setLoading(false);
//   //     }
//   //   };
//   //     checkAuth();
//   // }, []);
  

//   const handleOk = () => {
//     setPendingApproval(false);
//     setEmail('');
//     setPassword('');
//     setMessage('');
//     router.push('/'); // optional, you're already on login
//   };

//   async function handleSubmit(e) {
//     e.preventDefault();
  
// try{
//     const response = await axios.post(`${process.env.url}/api/auth/login`, { email, password }, {
//       withCredentials: true,
//       // credentials: 'include',
//     });
//    console.log("response", response);
//     const { token, role, expiresAt, location, isEocUser } = response.data;
//     if (response.data.isApproved === false) {
//       setMessage('Your account is not approved yet. Please contact the administrator.');
//       setPendingApproval(true);
//       return;
//     }
//     localStorage.setItem('token', token);
// //   localStorage.setItem('role', role);
// // localStorage.setItem('location', location);
// // localStorage.setItem('isEocUser', isEocUser);
// // localStorage.setItem('expiresAt', expiresAt);
// console.log("test")
// // setUser(response.data);
// router.push('/main');
// // setTimeout(() => {
// //   router.push('/main'); // or wherever MainLayout lives
// // }, 300);

//     // setUser({ token, role }); // Update state if using React context or state management
//   } catch (error) {
//     const errMsg = error.response?.data?.message || error.message;
//     setMessage(errMsg);
//   }
//   }


//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100" suppressHydrationWarning={true}>
//      <div>
//     <img src="blue.png" alt="logo" className=" w-[200px]" />
//   </div>
//      <div className="text-center mb-4">
//   <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
//     IT Asset Tracker
//   </h1>
//   {/* <p className="text-sm text-gray-500 mt-1">Secure access to your organization's assets</p> */}
// </div>
//       {pendingApproval ? (
//         <div className="bg-white p-6 rounded shadow-md text-center">
//           <p className="text-lg mb-4 text-red-600">{message}</p>
//           <button
//             onClick={handleOk}
//             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//           >
//             OK
//           </button>
//         </div>
//       ) : (
//         <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
//           <h1 className="text-xl mb-4">Login</h1>

//           {message && (
//             <p className="text-sm text-red-600 mb-3">{message}</p>
//           )}

//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full mb-4 p-2 border rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full mb-4 p-2 border rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
//           >
//             Login
//           </button>
         
//         </form>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [pendingApproval, setPendingApproval] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  });

  const handleOk = () => {
    setPendingApproval(false);
    setEmail('');
    setPassword('');
    setMessage('');
    router.push('/');
  };


  async function handleSubmit(e) {
    e.preventDefault();

    
  // const token = () => localStorage.getItem('token');

    try {
      const response = await axios.post(`${process.env.url}/api/auth/login`, { email, password }, {
        withCredentials: true,
      });

      const { token, isApproved } = response.data;

      if (!isApproved) {
        setMessage('Your account is not approved yet. Please contact the administrator.');
        setPendingApproval(true);
        return;
      }

      localStorage.setItem('token', token);
      router.push('/main');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setMessage(errMsg);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div>
        <img src="blue.png" alt="logo" className="w-[200px]" />
      </div>

      <div className="text-center mb-4">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Asset Tracker
        </h1>
      </div>

      {pendingApproval ? (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <p className="text-lg mb-4 text-red-600">{message}</p>
          <button
            onClick={handleOk}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      ) : (
        <form
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
          onSubmit={handleSubmit}
        >
          <h1 className="text-xl mb-4">Login</h1>

          {message && (
            <p className="text-sm text-red-600 mb-3">{message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}
