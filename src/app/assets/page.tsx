"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
// import { useAuth } from '../component/AuthContext';
import { isAuthenticated } from '../utilities/isAuthenticated';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [productsTypes, setProductTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const initialAssetState = {
    id:'',
    name: '',
    productType: '',
    vendorName: '',
    model: '',
    qty: '',
    assetLocation: '',
    region: '',
    status: '',
    serialNumber: '',
    manufactureDate: '',
    installDate: '',
  };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newAsset, setNewAsset] = useState(initialAssetState);
  const [user, setUser] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
const [selectedSourceLocation, setSelectedSourceLocation] = useState('');
const [filteredAssets, setFilteredAssets] = useState([]);
const [selectedAssetToAssign, setSelectedAssetToAssign] = useState('');
const [targetLocation, setTargetLocation] = useState('');
const [returnWithAssetId, setReturnWithAssetId] = useState('');
const [returnDialogOpen, setReturnDialogOpen] = useState(false);
const [selectedBorrowedAsset, setSelectedBorrowedAsset] = useState(null);


const [returnOptions, setReturnOptions] = useState([]);
const [returnableAssets, setReturnableAssets] = useState({});

const openReturnDialog = (asset) => {
  setSelectedBorrowedAsset(asset);
  setReturnOptions(returnableAssets[asset._id] || []);
  setReturnWithAssetId('');
  setReturnDialogOpen(true);
};



// Inside useEffect, load all items available in the original store:

useEffect(() => {
  const fetchReturnableAssets = async () => {
    const returnableMap = {};

    for (const asset of assets) {
      if (asset.status !== 'Borrowed' || asset.borrowedStatus === 'Returned') continue;

      const validStores = getValidReturnReplacementStores(asset.borrowedFrom, asset.assetLocation);
      if (validStores.length === 0) continue;

      try {
        const res = await axios.get(`${process.env.url}/api/assets`, {
          params: {
            filterBy: 'assetLocation',
            filter: validStores
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
console.log("runable", res);
        const options = res.data.filter(item =>
          item.status === 'In store' &&
          item._id !== asset._id &&
          validStores.includes(item.assetLocation)
        );
console.log("options", options);
        if (options.length > 0) {
          returnableMap[asset._id] = options;
        }
      } catch (error) {
        console.error(`Error checking returnable assets for ${asset.name}`, error);
      }
    }

    setReturnableAssets(returnableMap);
  };

  if (assets?.length) {
    fetchReturnableAssets();
  }
}, [assets]);



useEffect(() => {
  if (!selectedBorrowedAsset?.borrowedFrom || !selectedBorrowedAsset?.assetLocation) return;

  const validStores = getValidReturnReplacementStores(
    selectedBorrowedAsset.borrowedFrom,
    selectedBorrowedAsset.assetLocation
  );

  if (validStores.length === 0) {
    setReturnOptions([]); // No return allowed from EOC Store
    return;
  }

  axios.get(`${process.env.url}/api/assets`, {
    params: {
      filterBy: 'assetLocation',
      filter: validStores.join(','),
    },
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => setReturnOptions(res.data));
}, [selectedBorrowedAsset]);


useEffect(() => {
  async function fetchDropdownData() {
    try{
      const productData = await axios.get(`${process.env.producturl}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
     console.log("product data", productData);      const locationData = await axios.get(`${process.env.locationurl}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const vendorData = await axios.get(`${process.env.vendorurl}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const statusData = await axios.get(`${process.env.statusurl}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(statusData)
      setProductTypes(productData.data);
    setLocations(locationData.data);
    setVendors(vendorData.data);
    setStatuses(statusData.data);
    
  
    }catch (err){
      console.error('Error fetching assets:', err);
    }
    
    
  }

  fetchDropdownData();
}, []);


  useEffect(() => {
    async function fetchAssets() {
      const authenticated = await isAuthenticated()
      if(authenticated){
        setUser(authenticated.data.user);
      }
   
      try {
        // console.log("Filtering", filter, filterBy, role());
      
        const res = await axios.get(`${process.env.url}/api/assets`, {
          params: {
            filter,
            filterBy,
          },
          withCredentials: true, // 👈 Needed if your backend uses cookies/session (optional here if you're using only token)
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      
        console.log("filter res", res);
        setAssets(res.data);
      } catch (err) {
        console.error('Error fetching assets:', err);
      }
      
    }
    fetchAssets();
  }, [filter, filterBy]);

  
// const ProductTypeDropdown = ({ value, onChange }) => {
//   const [productTypes, setProductTypes] = useState([]);

//   useEffect(() => {
//     const fetchProductTypes = async () => {
//       try {
//         const response = await axios.get(`${process.env.url}/api/product-types`);
//         setProductTypes(response.data);
//       } catch (error) {
//         console.error('Error fetching product types:', error);
//       }
//     };

//     fetchProductTypes();
//   }, []);
// }

  // const addProductType = async (name) => {
  //   try {
  //     const response = await axios.post(`${process.env.url}/api/product-types`, { name });
  //     setProductTypes([...productTypes, response.data]); // Update state with new item
  //   } catch (error) {
  //     console.error('Error adding product type:', error);
  //   }
  // };

  // const updateProductType = async (id, newName) => {
  //   try {
  //     const response = await axios.put(`${process.env.url}/api/product-types/${id}`, { name: newName });
  //     setProductTypes(productTypes.map((type) => (type._id === id ? response.data : type)));
  //   } catch (error) {
  //     console.error('Error updating product type:', error);
  //   }
  // };
  

// const handleReturn = async () => {
//   try {
//     const updatedBorrowedAsset = {
//       ...selectedBorrowedAsset,
//       borrowedStatus: 'Returned',
//       borrowedWith: returnWithAssetId, // reference to the asset replacing it
//     };

//     await axios.put(`${process.env.url}/api/assets/${selectedBorrowedAsset._id}`, updatedBorrowedAsset, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });

//     setAssets((prev) =>
//       prev.map((asset) =>
//         asset._id === selectedBorrowedAsset._id ? updatedBorrowedAsset : asset
//       )
//     );

//     setReturnDialogOpen(false);
//     setSelectedBorrowedAsset(null);
//     setReturnWithAssetId('');
//   } catch (err) {
//     console.error('Failed to mark asset as returned:', err);
//   }
// };

const handleReturn = async () => {
  try {
    // Update the borrowed asset to mark it as returned
    const updatedBorrowedAsset = {
      ...selectedBorrowedAsset,
      borrowedStatus: 'Returned',
      borrowedWith: returnWithAssetId,
    };

    // Find the return replacement asset
    const returningAsset = returnOptions.find(opt => opt._id === returnWithAssetId);
    if (!returningAsset) {
      console.error('No valid return asset found.');
      return;
    }

    // Update the return replacement asset to move it to borrowedFrom location
    const updatedReturningAsset = {
      ...returningAsset,
      assetLocation: selectedBorrowedAsset.borrowedFrom,
      status: 'In store',
    };

    // Send both updates to backend
    await Promise.all([
      axios.put(`${process.env.url}/api/assets/${selectedBorrowedAsset._id}`, updatedBorrowedAsset, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
      axios.put(`${process.env.url}/api/assets/${returnWithAssetId}`, updatedReturningAsset, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    ]);

    // Update UI
    setAssets(prev =>
      prev.map(asset => {
        if (asset._id === selectedBorrowedAsset._id) return updatedBorrowedAsset;
        if (asset._id === returnWithAssetId) return updatedReturningAsset;
        return asset;
      })
    );

    setReturnDialogOpen(false);
    setSelectedBorrowedAsset(null);
    setReturnWithAssetId('');
  } catch (err) {
    console.error('Failed to process return:', err);
  }
};


const getValidReturnReplacementStores = (borrowedFrom, currentLocation) => {
  const isEOC = (loc) => loc.toLowerCase().includes('eoc') && loc.toLowerCase() !== 'eoc store';
  const isEOCStore = (loc) => loc.toLowerCase() === 'eoc store';

  if (isEOCStore(borrowedFrom)) {
    // No return needed for items borrowed from EOC Store
    return [];
  }

  if (isEOC(borrowedFrom) && isEOC(currentLocation)) {
    return [currentLocation, 'EOC Store'];
  }

  return [currentLocation];
};



const handleAssignAsset = async () => {
  if (!selectedAssetToAssign || !targetLocation) return;

  try {
    const asset = filteredAssets.find(a => a._id === selectedAssetToAssign);
    const isEOCSource = asset.assetLocation.toLowerCase().includes('eoc');
    const isEOCTarget = targetLocation.toLowerCase().includes('eoc');

    const isBorrowed = !(
      isEOCSource && isEOCTarget
    ) && asset.assetLocation !== targetLocation;

    const updatedAsset = {
      ...asset,
      assetLocation: targetLocation,
      status: isBorrowed ? 'Borrowed' : asset.status,
      borrowedFrom: isBorrowed ? asset.assetLocation : null
    };

    await axios.put(`${process.env.url}/api/assets/${asset._id}`, updatedAsset, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    setAssets(prev => prev.map(a => a._id === asset._id ? updatedAsset : a));
    setIsAssignDialogOpen(false);
    setSelectedAssetToAssign('');
    setTargetLocation('');
    setSelectedSourceLocation('');
  } catch (err) {
    console.error('Failed to assign asset:', err);
  }
};


 const handleDelete = async (id) => {
  // const router = useRouter();
    // const [loading, setLoading] = useState(true);
    // Ask for confirmation before proceeding with the delete
    const confirmed = window.confirm('Are you sure you want to delete this asset?');
    
    if (confirmed) {
      try {
        await axios.delete(`${process.env.url}/api/assets/${id}`);
        setAssets((prev) => prev.filter((asset) => asset._id !== id)); // Remove deleted asset from the list
      } catch (err) {
        console.error('Error deleting asset:', err);
      }
    }
  };
  
  
  // const [newStatus, setNewStatus] = useState(''); // Track user input for a new status
  const [selectedStatus] = useState(''); // Track selected status

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/'); // redirect to login
      } else {
        setLoading(false);
      }
    }, [router]);
  
  // const handleStatusChange = (e) => {
  //   const value = e.target.value;
  //   if (value === 'other') {
  //     setSelectedStatus('');
  //     setNewAsset({ ...newAsset, status: '' }); // Reset newAsset.status when selecting "Other"
  //   } else {
  //     setSelectedStatus(value);
  //     setNewAsset({ ...newAsset, status: value }); // Ensure newAsset.status is updated
  //     setNewStatus('');
  //   }
  // };
  
  
  // const handleAddNewStatus = () => {
  //   if (newStatus && !statuses.includes(newStatus)) {
  //     setStatuses([...statuses, newStatus]); // Add the new status to the list
  //     setSelectedStatus(newStatus); // Select the new status
  //     setNewAsset({ ...newAsset, status: newStatus }); // Ensure newAsset.status is updated
  //     setNewStatus('');
  //   }
  // };
  

  const handleAddSave = async () => {
    try {
      const res = await axios.post(`${process.env.url}/api/assets/add`, newAsset);
      
      setAssets([...assets, res.data.asset]); // Update UI with the new asset

      setSuccessMsg('Asset added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000); // Hide after 3 seconds

     
      setIsAddDialogOpen(false); // Close the dialog
      setNewAsset({
        id: '',
        name: '',
        productType: '',
        vendorName: '',
        model: '',
        qty: '',
        assetLocation: '',
        region: '',
        status: '',
        serialNumber: '',
        manufactureDate: '',
        installDate: '',
      }); // Reset form
    } catch (err) {
      console.error('Error adding asset:', err);
    }
  };
  

  const openEditDialog = (asset) => {
    setSelectedAsset(asset);
    setIsEditDialogOpen(true);
  };



  // const handleEditChange = (e) => {
  //   const { name, value } = e.target;
  
  //   setSelectedAsset((prev) => ({
  //     ...prev,
  //     [name]: value,
  //     ...(name === "status" && value === "Decommissioned"
  //       ? { decommissionedDate: new Date().toISOString().split("T")[0] } // Set today's date
  //       : {}),
  //   }));
  // };
  

  const handleEditSave = async () => {
    try {
      await axios.put(`${process.env.url}/api/assets/${selectedAsset._id}`, selectedAsset);
      setAssets((prev) =>
        prev.map((asset) => (asset._id === selectedAsset._id ? selectedAsset : asset))
      );
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating asset:', err);
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
    <div className="min-h-screen">
      <div className="mb-4 bg-white p-4 rounded shadow flex justify-between items-center">
        <div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="name">Name</option>
            <option value="model">Model</option>
            <option value="status">Status</option>
            <option value="assetLocation">Location</option>
          </select>
          <div className='flex-row'>
          <input
            type="text"
            placeholder="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 ml-[-2px] border ml-2 rounded"
          />
        </div>
        <div className='flex items-center w-[500px]'>
          <div>
        <button onClick={() => setIsAddDialogOpen(true)} className="flex-row justify-items p-2 bg-blue-500 text-white rounded flex items-center">
          <Plus size={20} />
          <div className=''>Add Asset</div>
        </button>

  

        </div>
        {successMsg && <div className="mb-4 px-4 py-2 text-sm text-green-700 bg-green-100 rounded border border-green-300 transition-all duration-500">{successMsg}</div>}
           <div>
            <button 
  onClick={() => setIsAssignDialogOpen(true)} 
  className="flex-row justify-items p-2 bg-green-500 text-white rounded flex items-center ml-2"
>
  <Plus size={20} />
  <div className='ml-1'>Assign Asset</div>
</button>
</div>

<div>


  </div>
        </div>

        


        </div>
      </div>

      <table className="table-auto w-full bg-white rounded shadow">
        <thead className="bg-black text-white rounded-sm">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Model</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-center w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id} className="hover:bg-gray-200">
              <td className="px-6 py-3">{asset.name}</td>
              <td className="px-6 py-3">{asset.model}</td>
              <td className="px-6 py-3">{asset.status}</td>
              <td className="px-6 py-3">{asset.assetLocation}</td>
              <td className="px-6 py-3 flex justify-center space-x-3">
                <Pencil size={18} strokeWidth={1.5} onClick={() => openEditDialog(asset)} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                {user?.role === 'admin' && <Trash2 size={18} strokeWidth={1.5} onClick={() => handleDelete(asset._id)} className="cursor-pointer" />}
                   

{/* {asset.status === 'Borrowed' &&
 asset.borrowedStatus !== 'Returned' &&
 returnableAssets[asset._id]?.length > 0 && (
  <button
    onClick={() => openReturnDialog(asset)}
    className="text-xs text-blue-600 hover:underline"
  >
    Return
  </button>
)} */}

{asset.status === 'Borrowed' &&
 asset.borrowedStatus !== 'Returned' &&
 returnableAssets[asset._id]?.length > 0 && (
  <button
    onClick={() => openReturnDialog(asset)}
    className="text-xs text-blue-600 hover:underline"
  >
    Return
  </button>
)}





              </td>
            </tr>
          ))}
        </tbody>
      </table>


<Dialog.Root open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
    <Dialog.Title className="text-lg font-bold mb-4 sticky top-0 bg-white py-2">Add New Asset</Dialog.Title>

    <div className="max-h-[60vh] overflow-y-auto">
      

{Object.keys(newAsset).filter((key) => key !== "_id" && key !== "__v").map((key) => (
  <div key={key} className="mb-3">
    <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>

    {["productType", "assetLocation", "vendorName", "status"].includes(key) ? (
      <select
        name={key}
        value={newAsset[key] || ""}
        onChange={(e) => setNewAsset({ ...newAsset, [key]: e.target.value })}
        className="w-full p-2 border rounded mt-1"
      >
        <option value="">Select {key}</option>
        {(key === "productType" ? productsTypes : key === "assetLocation" ? locations : key === "vendorName" ? vendors : statuses).map((item, index) => (
          <option key={index} value={item.name || item.id}>{item.name}</option>
        ))}
      </select>
    ) : (
      <input
        type={key.includes("Date") ? "date" : "text"}
        name={key}
        placeholder={key}
        value={
          key.includes("Date") && newAsset[key]
            ? new Date(newAsset[key]).toISOString().split("T")[0]
            : newAsset[key] || ""
        }
        onChange={(e) =>
          setNewAsset({
            ...newAsset,
            [key]: key.includes("Date") ? new Date(e.target.value).toISOString() : e.target.value,
          })
        }
        className="w-full p-2 border rounded mt-1"
      />
    )}
  </div>
))}


   
      {/* Decommissioned Date (Only Visible if Status is Decommissioned) */}
{(selectedAsset?.status === "Decommissioned") && (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700">Decommissioned Date</label>
    <input
      type="date"
      name="decommissionedDate"
      value={
        selectedAsset?.decommissionedDate || newAsset?.decommissionedDate || new Date().toISOString().split("T")[0]
      }
      onChange={(e) =>
        setSelectedAsset
          ? setSelectedAsset({ ...selectedAsset, decommissionedDate: e.target.value })
          : setNewAsset({ ...newAsset, decommissionedDate: e.target.value })
      }
      className="w-full p-2 border rounded mt-1"
    />
  </div>
)}

    </div>

    <div className="flex justify-end space-x-2 mt-4 sticky bottom-0 bg-white py-2">
      <button 
        onClick={() => setIsAddDialogOpen(false)} 
        className="bg-gray-300 px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button 
        onClick={() => {
          setNewAsset({ ...newAsset, status: selectedStatus }); 
          handleAddSave();
        }} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  </Dialog.Content>
</Dialog.Root>



{/* Edit Asset Dialog */}
<Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
    <Dialog.Title className="text-lg font-bold mb-4 sticky top-0 bg-white py-2">Edit Asset</Dialog.Title>

   

<div className="max-h-[60vh] overflow-y-auto">
  {selectedAsset &&
    Object.keys(selectedAsset)
      .filter((key) => key !== "_id" && key !== "__v") // filter out _id and __v
      .map((key) => (
        <div key={key} className="mb-3">
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>

          {["productType", "assetLocation", "vendorName", "status"].includes(key) ? (
            <select
              name={key}
              value={selectedAsset[key] || ""}
              onChange={(e) =>
                setSelectedAsset({ ...selectedAsset, [key]: e.target.value })
              }
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Select {key}</option>
              {(key === "productType"
                ? productsTypes
                : key === "assetLocation"
                ? locations
                : key === "vendorName"
                ? vendors
                : statuses
              ).map((item, index) => (
                <option key={index} value={item.name || item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={key.includes("Date") ? "date" : "text"}
              name={key}
              placeholder={key}
              value={
                key.includes("Date") && selectedAsset[key]
                  ? new Date(selectedAsset[key]).toISOString().split("T")[0]
                  : selectedAsset[key] || ""
              }
              onChange={(e) =>
                setSelectedAsset({
                  ...selectedAsset,
                  [key]: key.includes("Date")
                    ? new Date(e.target.value).toISOString()
                    : e.target.value,
                })
              }
              className="w-full p-2 border rounded mt-1"
            />
          )}
        </div>
      ))}
</div>


    {(selectedAsset?.status === "Decommissioned") && (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700">Decommissioned Date</label>
    <input
      type="date"
      name="decommissionedDate"
      value={
        selectedAsset?.decommissionedDate || newAsset?.decommissionedDate || new Date().toISOString().split("T")[0]
      }
      onChange={(e) =>
        setSelectedAsset
          ? setSelectedAsset({ ...selectedAsset, decommissionedDate: e.target.value })
          : setSelectedAsset({ ...selectedAsset, decommissionedDate: e.target.value })
      }
      className="w-full p-2 border rounded mt-1"
    />
  </div>
)}

    <div className="flex justify-end space-x-2 mt-4 sticky bottom-0 bg-white py-2">
      <button 
        onClick={() => setIsEditDialogOpen(false)} 
        className="bg-gray-300 px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button 
        onClick={handleEditSave} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
    <Dialog.Title className="text-lg font-bold mb-4">Assign Asset</Dialog.Title>

    <div className="mb-3">
      <label className="block mb-1">Source Location</label>
      <select
        value={selectedSourceLocation}
        onChange={async (e) => {
          const selected = e.target.value;
          setSelectedSourceLocation(selected);

          const res = await axios.get(`${process.env.url}/api/assets`, {
            params: { filterBy: 'assetLocation', filter: selected },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setFilteredAssets(res.data);
        }}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Source Store</option>
        {locations.map((loc, idx) => (
          <option key={idx} value={loc.name}>{loc.name}</option>
        ))}
      </select>
    </div>

    <div className="mb-3">
      <label className="block mb-1">Select Asset</label>
      <select
        value={selectedAssetToAssign}
        onChange={(e) => setSelectedAssetToAssign(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Choose Asset</option>
        {filteredAssets.map((asset) => (
          <option key={asset._id} value={asset._id}>{asset.name} - {asset.model}</option>
        ))}
      </select>
    </div>

    <div className="mb-3">
      <label className="block mb-1">Target Location</label>
      <select
        value={targetLocation}
        onChange={(e) => setTargetLocation(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Target Store</option>
        {locations.map((loc, idx) => (
          <option key={idx} value={loc.name}>{loc.name}</option>
        ))}
      </select>
    </div>

    <div className="flex justify-end mt-4 space-x-2">
      <button 
        onClick={() => setIsAssignDialogOpen(false)} 
        className="bg-gray-300 px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button 
        onClick={handleAssignAsset}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={!selectedAssetToAssign || !targetLocation}
      >
        Assign
      </button>
    </div>
  </Dialog.Content>
</Dialog.Root>

{/* Asset return dialog */}

{/* <Dialog.Root open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
    <Dialog.Title className="text-lg font-bold mb-4">Return Borrowed Asset</Dialog.Title>

    {selectedBorrowedAsset && (
      <div>
        <p className="mb-2 text-sm">
          You are returning: <strong>{selectedBorrowedAsset.name}</strong> originally from{' '}
          <strong>{selectedBorrowedAsset.borrowedFrom}</strong>
        </p>

        <label className="block mb-1 text-sm">
          Select Any Available Replacement from <strong>{selectedBorrowedAsset.borrowedFrom}</strong>
        </label>

        <select
          value={returnWithAssetId}
          onChange={(e) => setReturnWithAssetId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Replacement Asset</option>
          {returnOptions
            .filter(item =>
              item._id !== selectedBorrowedAsset._id &&
              item.status === 'Available'
            )
            .map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - {item.model} ({item.productType})
              </option>
            ))}
        </select>
      </div>
    )}

    <div className="flex justify-end space-x-2 mt-4">
      <button
        onClick={() => setReturnDialogOpen(false)}
        className="bg-gray-300 px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button
        onClick={handleReturn}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!returnWithAssetId}
      >
        Confirm Return
      </button>
    </div>
  </Dialog.Content>
</Dialog.Root> */}

<Dialog.Root open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
    <Dialog.Title className="text-lg font-bold mb-4">Return Borrowed Asset</Dialog.Title>

    {selectedBorrowedAsset && (
      <div>
        <p className="mb-2 text-sm">
          You are returning: <strong>{selectedBorrowedAsset.name}</strong><br />
          Borrowed from: <strong>{selectedBorrowedAsset.borrowedFrom}</strong><br />
          Currently in: <strong>{selectedBorrowedAsset.assetLocation}</strong>
        </p>

        {returnOptions.length === 0 ? (
          <p className="text-red-500 text-sm">No eligible replacement available for return.</p>
        ) : (
          <>
            <label className="block mb-1 text-sm">Select Available Replacement</label>
            <select
              value={returnWithAssetId}
              onChange={(e) => setReturnWithAssetId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Replacement Asset</option>
              {returnOptions.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} - {item.model} ({item.assetLocation})
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    )}

    <div className="flex justify-end space-x-2 mt-4">
      <button 
        onClick={() => setReturnDialogOpen(false)} 
        className="bg-gray-300 px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button 
        onClick={handleReturn} 
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!returnWithAssetId}
      >
        Confirm Return
      </button>
    </div>
  </Dialog.Content>
</Dialog.Root>




    
 

    </div>
  );
}



