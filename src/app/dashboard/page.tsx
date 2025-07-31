'use client'

import { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from 'next/navigation';
// import { useAuth } from "../component/AuthContext";
import { isAuthenticated } from "../utilities/isAuthenticated";

export default function Dashboard() {
    const router = useRouter();
      const [loading, setLoading] = useState(true);
    // const token = () => localStorage.getItem('token');
    // const {user} = useAuth();

    // console.log(user.token)

  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLocations, setTotalLocations] = useState(0);
  const [itemsInUse, setItemsInUse] = useState(0);
  const [itemsFaulty, setItemsFaulty] = useState(0);
  const [decommissioned, setDecommissioned] = useState(0);
  const [countPerLocation, setCountPerLocation] = useState([]);
  const [urgentAttentionSystem, setUrgentAttention] = useState([]);
  const [user, setUser] = useState(null);
  const [urgentAttentionSys, setUrgentAttentionSystem] = useState([]);
  const [urgentAttentionLow, setUrgentAttentionLow] = useState([]);
 
  

  useEffect(() => {

    const fetchItems = async () => {
        const authenticated = await isAuthenticated()
        if(!authenticated){
            router.push('/');
            return;
        }
        setUser(authenticated.data.user);
        try{
        const [res, thresholdRes] = await Promise.all([
          axios.get(`${process.env.url}/api/assets`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${process.env.url}/api/assets/thresholds`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        console.log("thres", thresholdRes);
        console.log("res files", res);
        setIsLoading(false);
        const countArray = Object.values(
            res.data.reduce((acc, item) => {
              if (!acc[item.assetLocation]) {
                acc[item.assetLocation] = { assetLocation: item.assetLocation, count: 0 };
              }
              acc[item.assetLocation].count++;
              return acc;
            }, {})
          );

          if(countArray.length > 0){
            setCountPerLocation(countArray);
          }

        const resLocation = await axios.get(`${process.env.url}/api/locations`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        // console.log("res locate",resLocation);
        setTotalAssets(res.data.length);
        setTotalLocations(resLocation.data.length);
        if(res){
            const inUse = res.data.filter(item => item.status === "In Use").length;
            setItemsInUse(inUse);
        }
        if(res){
            const faulty = res.data.filter(item => item.status === "Faulty").length;
            setItemsFaulty(faulty);
        }
        if(res){
            const decomm = res.data.filter(item => item.status === "Decommissioned").length;
            setDecommissioned(decomm);
        }

        if(res){
            const urgentAttentionS = res.data.filter(item => item.status === "Faulty");
            console.log("urgen", urgentAttentionS)
            setUrgentAttention(urgentAttentionS);
        }

        const thresholdMap = {};
        thresholdRes.data.forEach(t => {
          thresholdMap[t.name] = t.threshold;
        });

         // Count in-store assets by name
      const inStoreCount = {};
      res.data.forEach(asset => {
        if (asset.status === 'In store') {
          console.log("asset name",asset.name);
          inStoreCount[asset.name] = (inStoreCount[asset.name] || 0) + 1;
        }
      });

      //Find low-stock assets
      const lowStockNames = Object.keys(thresholdMap).filter(name => {
        const count = inStoreCount[name] || 0;
        return count <= thresholdMap[name];
      });

      // Build list of low stock asset data
const lowStockAssets = lowStockNames.map(name => {
  // Get one sample asset for display details
  const sampleAsset = res.data.find(asset => asset.name === name && asset.status === "In store");

  return {
    name,
    location: sampleAsset?.assetLocation || "Unknown",
    productType: sampleAsset?.productType || "N/A",
    model: sampleAsset?.model || "N/A",
    description: sampleAsset?.description || "",
    currentCount: inStoreCount[name] || 0,
    threshold: thresholdMap[name] || 0
  };
});

setUrgentAttentionLow(lowStockAssets); // Rename variable to reflect accurate state

      console.log("low counts", lowStockAssets);

setLoading(false);
        

        // Totals Logic
        // if (endpoint === "assets") {
        //   setTotalAssets(data.length);
        // } else if (endpoint === "locations") {
        //   setTotalLocations(data.length);
        // } else if (endpoint === "items") {
        //   const inUse = data.filter(item => item.status === "in_use").length;
        //   setItemsInUse(inUse);
        // }
       

      } catch (err) {
        console.error(`Failed to fetch:`, err);
      }
    };

    fetchItems();
  }, []);

 
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded shadow-sm w-full max-w-md">
          {/* <Search className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search item"
            className="w-full outline-none"
          /> */}
          <p className="text-3xl font-bold mb-6">Dashboard</p>
        </div>

        <div className="flex items-center space-x-4">
          <Bell className="text-gray-500" />
          <div className="flex items-center space-x-2">
            {/* <span className="font-medium">Olutoye Dalepo</span>
            <Image
              src="/avatar.png"
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full"
            /> */}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-pink-500 to-green-400 text-white p-6 rounded-xl">
          <h2 className="text-sm mb-2">Assets Summary</h2>
          <div className="text-4xl font-bold flex space-x-4">
            <div>
            <div>{totalAssets}</div>
            <p className="text-xs mt-2">Total Assets</p>
            </div>
            <div>
            <div>{totalLocations}</div>
            <p className="text-xs mt-2">Locations</p>
            </div>
            <div>
            <div>{itemsInUse}</div>
            <p className="text-xs mt-2">In Use</p>
            </div>

            <div>
            <div>{itemsFaulty}</div>
            <p className="text-xs mt-2">Urgent Attention</p>
            </div>

            <div>
            <div>{decommissioned}</div>
            <p className="text-xs mt-2">Decommissioned</p>
            </div>
           
          </div>
          
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-xl">
          <h2 className="text-sm mb-2">Total Assets</h2>
          <div className="h-32 w-full bg-white/10 rounded-md flex items-end space-x-1 p-2">
            {/* Replace with bar chart */}
            {[40, 60, 80, 50, 70, 90, 60].map((h, i) => (
              <div key={i} className="bg-white rounded-sm w-3" style={{ height: `${h}px` }} />
            ))}
          </div>
          <p className="text-xs mt-2">March 2025</p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Statistics</h2>
          <div className="h-40 bg-gray-100 rounded-lg flex items-end space-x-2 p-2">
            {/* Replace with line chart */}
            {[160, 200, 260, 220, 180].map((v, i) => (
              <div
                key={i}
                className="bg-purple-500 w-4 rounded-md"
                style={{ height: `${v / 2}px` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Items Listed</span>
            <span>Items Wanted</span>
            <span>Successful Transfer</span>
          </div>
        </div>

        {/* Inbox */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Items Per Location</h2>
          <div className="max-h-64 overflow-y-auto pr-2 scrollbar-hide">
          <ul className="space-y-3">
            {countPerLocation.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item?.assetLocation}</span>
                <span className="text-sm text-gray-400">{item?.count}</span>
              </li>
            ))}
          </ul>
          </div>
          {/* <button className="text-blue-500 text-sm mt-2">View all</button> */}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Cards */}
        <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700">
          <h3 className="font-semibold mb-1">Adjusted calendar for 2021/2022 session</h3>
          <p className="text-xs text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a className="text-blue-500" href="#">Read more</a>
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700">
          <h3 className="font-semibold mb-1">Adjusted calendar for 2021/2022 session</h3>
          <p className="text-xs text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a className="text-blue-500" href="#">Read more</a>
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700">
          <h3 className="font-semibold mb-1">Adjusted calendar for 2022/2023 session</h3>
          <p className="text-xs text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a className="text-blue-500" href="#">Read more</a>
          </p>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Faulty Assets</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="pb-2">Asset</th>
              <th className="pb-2">Location</th>
              <th className="pb-2">Product</th>
              <th className="pb-2">Model</th>
              <th className="pb-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {urgentAttentionSystem.map((asset, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{asset?.name}</td>
                <td className="py-2">{asset?.assetLocation}</td>
                <td className="py-2">{asset?.productType}</td>
                <td className="py-2">{asset?.model}</td>
                <td className="py-2">Notes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {user?.role === 'admin' && <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="pb-2">Asset</th>
              <th className="pb-2">Location</th>
              <th className="pb-2">Product</th>
              <th className="pb-2">Model</th>
              <th className="pb-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {urgentAttentionSystem.map((asset, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{asset?.name}</td>
                <td className="py-2">{asset?.assetLocation}</td>
                <td className="py-2">{asset?.productType}</td>
                <td className="py-2">{asset?.model}</td>
                <td className="py-2">Notes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
