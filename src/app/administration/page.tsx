'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@headlessui/react';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utilities/isAuthenticated';

const token = () => localStorage.getItem('token');

// Reusable component for each section (Product Type, Vendor, etc.)
const AdminSection = ({ title, endpoint }: { title: string; endpoint: string }) => {
  const router = useRouter();

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${process.env.url}/api/${endpoint}`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        setItems(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [endpoint]);

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.url}/api/${endpoint}/add`,
        { name: newItem },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setItems([...items, res.data]);
      setNewItem('');
    } catch (err) {
      console.error(`Failed to add ${title}:`, err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
          const authenticated = await isAuthenticated();
          console.log("isauthenticated", authenticated);
          if (!authenticated) {
            router.push('/'); // redirect to login
          }else if (authenticated.data.user.role === 'user' || authenticated.data.user.role === 'EOC User') {
            router.push('/unauthorized'); // create this page
          }
          // if(!user){
          //   router.push('/');
           
        };
          checkAuth();
  });
 

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder={`Add new ${title.toLowerCase()}`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="p-2 border rounded-l w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 rounded-r"
        >
          Add
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="bg-white border rounded p-4">
          {items.map((item) => (
            <li key={item._id} className="py-2 border-b last:border-b-0">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// const ThresholdSection = () => {
//   const [assets, setAssets] = useState([]);
//   const [thresholds, setThresholds] = useState({});

//   const fetchAssets = async () => {
//     try {
//       const res = await axios.get(`${process.env.url}/api/assets`, {
//         headers: { Authorization: `Bearer ${token()}` },
//       });

//       const uniqueAssets = res.data.reduce((acc, curr) => {
//         if (!acc.some(asset => asset.name === curr.name)) {
//           acc.push(curr);
//         }
//         return acc;
//       }, []);

//       setAssets(uniqueAssets);

//       const initialThresholds = {};
//       uniqueAssets.forEach(asset => {
//         initialThresholds[asset.name] = asset.threshold || '';
//       });

//       setThresholds(initialThresholds);
//     } catch (err) {
//       console.error('Failed to fetch assets:', err);
//     }
//   };

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const handleThresholdChange = (assetName, value) => {
//     setThresholds(prev => ({ ...prev, [assetName]: value }));
//   };

//   const saveThresholds = async () => {
//     try {
//       await axios.post(
//         `${process.env.url}/api/assets/update-thresholds`,
//         { thresholds },
//         {
//           headers: { Authorization: `Bearer ${token()}` },
//         }
//       );
//       alert('Thresholds saved successfully!');
//     } catch (err) {
//       console.error('Failed to save thresholds:', err);
//       alert('Error saving thresholds');
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Set Asset Thresholds</h2>
//       {assets.length === 0 ? (
//         <p>No assets found</p>
//       ) : (
//         <div className="space-y-4">
//           {assets.map(asset => (
//             <div key={asset._id} className="flex items-center space-x-4">
//               <span className="w-40">{asset.name}</span>
//               <input
//                 type="number"
//                 className="border px-2 py-1 rounded w-32"
//                 value={thresholds[asset.name] || ''}
//                 onChange={e =>
//                   handleThresholdChange(asset.name, e.target.value)
//                 }
//               />
//             </div>
//           ))}
//           <button
//             onClick={saveThresholds}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Save Thresholds
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };


const ThresholdSection = () => {
  // const [assets, setAssets] = useState([]);
  // const [thresholds, setThresholds] = useState({});
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  // const [uniqueByModels, setUniqueByModels] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
const [uniqueByModels, setUniqueByModels] = useState<Asset[]>([]);
const [thresholds, setThresholds] = useState<{ [key: string]: string }>({});


 interface Asset {
  name: string;
  model: string;
  threshold?: string;
}


  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${process.env.url}/api/assets`, {
        headers: { Authorization: `Bearer ${token()}` },
      });

      // const uniqueAssets = res.data.reduce((acc, curr) => {
      //   if (!acc.some(asset => asset.name === curr.name)) {
      //     acc.push(curr);
      //   }
      //   return acc;
      // });



const data: Asset[] = res.data; // Explicitly typed
const uniqueAssets = data.reduce((acc: Asset[], curr) => {
  if (!acc.some(asset => asset.name === curr.name)) {
    acc.push(curr);
  }
  return acc;
}, []);



      setAssets(uniqueAssets);
      
      // const uniqueByModel = Object.values(
      //   uniqueAssets.reduce((acc, asset) => {
      //     if (!acc[asset.model]) {
      //       acc[asset.model] = asset;
      //     }
      //     return acc;
      //   }, {})
      // );

      const uniqueByModel = Object.values(
  uniqueAssets.reduce((acc: { [key: string]: Asset }, asset) => {
    if (!acc[asset.model]) {
      acc[asset.model] = asset;
    }
    return acc;
  }, {})
);


      setUniqueByModels(uniqueByModel);

      console.log('uniquemodel',uniqueAssets, uniqueByModel);
      console.log(uniqueByModels, handleThresholdChange, saveThresholds);
      

      // const initialThresholds = {};
      // uniqueAssets.forEach(asset => {
      //   initialThresholds[asset.name] = asset.threshold || '';
      // });

      const initialThresholds: { [key: string]: string } = {};
uniqueAssets.forEach(asset => {
  initialThresholds[asset.name] = asset.threshold || '';
});


      setThresholds(initialThresholds);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    }
  };

  useEffect(() => {
    fetchAssets();
  });

  const handleThresholdChange = (assetName, value) => {
    setThresholds(prev => ({ ...prev, [assetName]: value }));
  };

  const saveThresholds = async () => {
    try {
      await axios.post(
        `${process.env.url}/api/assets/thresholds/add`,
        { thresholds },
        {
          headers: { Authorization: `Bearer ${token()}` },
        }
      );
      alert('Thresholds saved successfully!');
    } catch (err) {
      console.error('Failed to save thresholds:', err);
      alert('Error saving thresholds');
    }
  };

  const saveSingleThreshold = async () => {
    if (!selectedAsset) return;
    try {
      await axios.post(
        `${process.env.url}/api/assets/thresholds/add`,
        { thresholds: { [selectedAsset]: selectedValue } },
        {
          headers: { Authorization: `Bearer ${token()}` },
        }
      );
      alert(`Threshold for ${selectedAsset} saved!`);
    } catch (err) {
      console.error('Error saving single threshold:', err);
      alert('Failed to save');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Set Asset Thresholds</h2>

      {/* Bulk Update Section */}
      {/* {assets.length === 0 ? (
        <p>No assets found</p>
      ) : (
        <div className="space-y-4 mb-8">
          {assets.map(asset => (
            <div key={asset._id} className="flex items-center space-x-4">
              <span className="w-40">{asset.name}</span>
              <input
                type="number"
                className="border px-2 py-1 rounded w-32"
                value={thresholds[asset.name] || ''}
                onChange={e =>
                  handleThresholdChange(asset.name, e.target.value)
                }
              />
            </div>
          ))}
          <button
            onClick={saveThresholds}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save All Thresholds
          </button>
        </div>
      )} */}

      {/* <hr className="my-6" /> */}

      {/* Single Update Section */}
      {/* <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Update One Asset</h3>
        <select
          value={selectedAsset}
          onChange={(e) => {
            const name = e.target.value;
            setSelectedAsset(name);
            setSelectedValue(thresholds[name] || '');
          }}
          className="border p-2 rounded mr-2"
        >
          <option value="">Select asset</option>
          {assets.map((asset) => (
            <option key={asset.name} value={asset.name}>
              {asset.name}
            </option>
          ))}
        </select>

        {selectedAsset && (
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="number"
              className="border px-2 py-1 rounded w-32"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
            <button
              onClick={saveSingleThreshold}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>
        )}
      </div> */}

<div className="mb-4">
  <h3 className="text-lg font-medium mb-2">Update One Asset</h3>
  <select
    value={selectedAsset}
    onChange={(e) => {
      const name = e.target.value;
      setSelectedAsset(name);
      setSelectedValue(
        thresholds[name] !== undefined && thresholds[name] !== null
          ? thresholds[name]
          : ''
      );
    }}
    className="border p-2 rounded mr-2"
  >
    <option value="">Select asset</option>
    {assets.map((asset) => (
      <option key={asset._id} value={asset.model}>
        {asset.model}
      </option>
    ))}
  </select>

  {selectedAsset && (
    <div className="mt-2 flex items-center space-x-2">
      <input
        type="number"
        className="border px-2 py-1 rounded w-32"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
      />
      <button
        onClick={saveSingleThreshold}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Save
      </button>
    </div>
  )}
</div>


    </div>
  );
};





const Administration = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/'); // redirect to login
      } else {
        setLoading(false);
      }
    }, [router]);
    
  const sections = [
    { title: 'Product Types', endpoint: 'product-types' },
    { title: 'Vendors', endpoint: 'vendors' },
    { title: 'Asset Locations', endpoint: 'locations' },
    { title: 'Status', endpoint: 'status' },
    // { title: 'User Roles', endpoint: 'user-roles' },
    { title: 'Threshold', endpoint: 'threshold' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {loading ? (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (<div>
      <h1 className="text-3xl font-bold mb-6">Administration</h1>

      <TabGroup>
        <TabList className="flex space-x-2 border-b pb-2 mb-4">
          {sections.map(({ title }) => (
            <Tab
              key={title}
              className={({ selected }) =>
                `px-2 py-2 text-sm font-medium rounded-t focus:outline-none ${
                  selected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`
              }
            >
              {title}
            </Tab>
          ))}
        </TabList>
{/* 
        <TabPanels>
          {sections.map(({ title, endpoint }) => (
            <TabPanel key={title} className="p-4 bg-white rounded shadow">
              <AdminSection title={title} endpoint={endpoint} />
            </TabPanel>
          ))}
        </TabPanels> */}

<TabPanels>
  {sections.map(({ title, endpoint }) => (
    <TabPanel key={title} className="p-4 bg-white rounded shadow">
      {title === 'Threshold' ? (
        <ThresholdSection />
      ) : (
        <AdminSection title={title} endpoint={endpoint} />
      )}
    </TabPanel>
  ))}
</TabPanels>


      </TabGroup>
      </div>)}
    </div>
  );
};

export default Administration;






