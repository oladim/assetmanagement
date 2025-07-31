'use client'
// MainLayout.js
import React, { useState, useEffect } from "react";
import AssetPage from "../assets/page";
import Administration from "../administration/page";
import Settings from "../settings/page";
import Dashboard from "../dashboard/page";
import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useAuth } from '../component/AuthContext';
import { HiCog, HiOutlineArrowNarrowLeft, HiCurrencyDollar, HiLogout, HiViewGrid, HiOutlineUsers, HiOutlineZoomIn, HiOutlineUser } from 'react-icons/hi';
  
import { isAuthenticated, isAuthorized } from '../utilities/isAuthenticated'; // adjust path as needed

const MainLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  // const { user } = useAuth();
 

  const icons = [HiCog, HiCurrencyDollar, HiLogout, HiViewGrid, HiOutlineUsers, HiOutlineZoomIn, HiOutlineUser]

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // or '/login'
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      console.log("isauthenticated", authenticated);
      if (!authenticated) {
        router.push('/'); // redirect to login
      }else{
        setLoading(false);
      }
      // if(!user){
      //   router.push('/');
       
    };
      checkAuth();
  }, []);

const renderPage = () => {
  // if (!isAuthenticated()) {
  //   return <h2>Please login to continue</h2>;
  // }

  switch (selectedPage) {
    case "Dashboard":
      return <Dashboard />;
      // return <p>Welcome to dashboard</p>

    case "Assets":
      return <AssetPage />;

    case "Administration":
      return <Administration />;

    case "Settings":
      return <Settings />;

    case "Logout":
      return <h2>Logging out...</h2>;

    default:
      return <h2>Welcome</h2>;
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>

<aside
  className="flex flex-col h-screen sticky top-0"
  style={{
    width: "200px",
    backgroundColor: "#0090FC",
    color: "#fff",
    paddingTop: "20px",
    gap: "15px",
  }}
>
  <div>
    <img src="logo.png" alt="logo" className="pb-20" />
  </div>

  {[{ name: "Dashboard", icon: <HiViewGrid className="text-2xl" /> },
    { name: "Assets", icon: <HiOutlineZoomIn className="text-2xl" /> },
    { name: "Administration", icon: <HiOutlineUsers className="text-2xl" /> },
    { name: "Settings", icon: <HiCog className="text-2xl" /> },
    { name: "Reports", icon: <HiOutlineArrowNarrowLeft className="text-2xl" /> },
  ].map((item) => (
    <div
      key={item.name}
      className="flex flex-row items-center gap-2 z-10 h-[53px] w-full hover:bg-hover active:bg-[#135397] hover:opacity-100 transition-opacity duration-300 hover:border-l-8 focus:border-l-8 border-l-yellow cursor-pointer"
      onClick={() => setSelectedPage(item.name)}
    >
      <div className="flex gap-2 w-full pl-5">
        {item.icon}
        {item.name}
      </div>
    </div>
  ))}

  {/* Logout goes to bottom */}
  <div
    className="mt-auto flex items-center gap-2 h-[53px] w-full hover:bg-hover active:bg-[#135397] hover:opacity-100 transition-opacity duration-300 hover:border-l-8 focus:border-l-8 border-l-yellow cursor-pointer pl-5"
    onClick={() => setSelectedPage("Logout")}
  >
    <HiOutlineUser className="text-2xl" />
    <p onClick={handleLogout}>Logout</p>
  </div>
</aside>


      {/* Main content */}
      <main style={{ flex: 1, padding: "30px", backgroundColor: "#f5f5f5" }} className="overflow-y-auto p-6"> 
        {renderPage()}
      </main>
    </div>
  );
};

export default MainLayout;