import React, { useState } from 'react';
import axios from 'axios';

const AddAssetForm = () => {
  const [formData, setFormData] = useState({
    id:'',
    name: '',
    productType: '',
    vendorName: '',
    model: '',
    qty: 0,
    assetLocation: '',
    region: '',
    status: '',
    serialNumber: '',
    manufactureDate: '',
    installDate: '',
  });

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token'); // Assuming token is stored in localStorage
      await axios.post(`${process.env.mainurl}/assets`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Asset added successfully!');
    } catch (error) {
      console.error(error);
      alert('Error adding asset');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
       <input id="id" onChange={handleChange} placeholder="Id" required />
      <input name="name" onChange={handleChange} placeholder="Name" required />
      <input name="productType" onChange={handleChange} placeholder="Product Type" required />
      <input name="vendorName" onChange={handleChange} placeholder="Vendor Name" required />
      <input name="model" onChange={handleChange} placeholder="Model" required />
      <input name="qty" type="number" onChange={handleChange} placeholder="Quantity" required />
      <input name="assetLocation" onChange={handleChange} placeholder="Asset Location" required />
      <input name="region" onChange={handleChange} placeholder="Region" required />
      <input name="status" onChange={handleChange} placeholder="Status" required />
      <input name="serialNumber" onChange={handleChange} placeholder="Serial Number" required />
      <input name="manufactureDate" type="date" onChange={handleChange} required />
      <input name="installDate" type="date" onChange={handleChange} required />
      <button type="submit">Add Asset</button>
    </form>
  );
};

export default AddAssetForm;
