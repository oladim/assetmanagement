
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Select,
  MenuItem,
  Button,
  Pagination,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import axios from "axios";

const AssetPage = () => {
  // State variables
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false); // For opening modal
  const [newAsset, setNewAsset] = useState({
    name: "",
    productType: "",
    vendorName: "",
    model: "",
    qty: 1,
    location: "",
    region: "",
    status: "",
    serialNumber: "",
    manufactureDate: "",
    installDate: "",
  });

  const pageSize = 10; // Number of items per page

  // Fetch assets from backend
  const fetchAssets = async (page = 1) => {
    // let da?ta;
    setLoading(true);
    setError("");
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(
        `${process.env.mainurl}/assets?page=${page}&pageSize=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` },
        }
      );
console.log(response.data)
    const {0: data} = await response.data.assets;
    console.log(data)
      setAssets(response.data.assets);
      console.log(response.data.assets)
      // setAssets([data]);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch asset. Please try again later.");
    }
    setLoading(false);
  };

  // Handle opening modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new asset
  const handleAddAsset = async () => {
    try {
      await axios.post(`${process.env.mainurl}/assets`, newAsset, {
        headers: { 'Content-Type': 'application/json' },
      });
      handleCloseModal();
      fetchAssets(currentPage); // Refresh the table after adding a new asset
      alert("Asset added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add asset. Please check the input and try again.");
    }
  };

  // Effect to fetch assets on component load
  useEffect(() => {
    fetchAssets();
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#003366" }}>All Assets</h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
            onClick={handleOpenModal}
          >
            + Add
          </Button>
          <Select value="Actions" style={{ marginRight: "10px" }}>
            <MenuItem value="Actions">Actions</MenuItem>
            <MenuItem value="Export">Export</MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
          </Select>
          <Select value="Manage">
            <MenuItem value="Manage">Manage</MenuItem>
            <MenuItem value="Settings">Settings</MenuItem>
          </Select>
        </div>
        <div>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchAssets}
            disabled={loading}
          >
            Search
          </Button>
        </div>
      </div>

  {loading ? (
  <div style={{ textAlign: "center", margin: "20px 0" }}>
    <CircularProgress />
  </div>
) : error ? (
  <div style={{ color: "red", textAlign: "center", margin: "20px 0" }}>
    {error}
  </div>
) : assets.length === 0 ? (
//   <div
//     style={{
//       textAlign: "center",
//       marginTop: "50px",
//       color: "#555",
//     }}
//   >
//     <h2>No Assets Found</h2>
//     <p>
//       It looks like you don't have any assets yet. Click the button below to add your first asset.
//     </p>
//     <Button
//       variant="contained"
//       color="primary"
//       onClick={handleOpenModal} // Opens the modal
//       style={{
//         marginTop: "20px",
//       }}
//     >
//       + Add Your First Asset
//     </Button>
//   </div>
<div
  style={{
    textAlign: "center",
    marginTop: "50px",
    color: "#555",
  }}
>
  <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>No Assets Found</h2>
  <p style={{ fontSize: "1rem", color: "#777" }}>
    It looks like you don't have any assets yet. Click the button below to add your first asset.
  </p>
  <Button
    variant="contained"
    color="primary"
    onClick={handleOpenModal}
    style={{
      marginTop: "20px",
      padding: "10px 20px",
      fontSize: "1rem",
      borderRadius: "5px",
    }}
  >
    + Add Your First Asset
  </Button>
</div>
) : (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox />
          </TableCell>
          <TableCell>Actions</TableCell>
          <TableCell>Asset Code</TableCell>
          <TableCell>Title</TableCell>
          <TableCell>Use</TableCell>
          <TableCell>Asset Status</TableCell>
          <TableCell>Asset Location</TableCell>
          <TableCell>Serial #</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {assets.map((asset) => (
                  <TableRow key={asset._id}>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>
              <IconButton color="primary">
                <Visibility />
              </IconButton>
              <IconButton color="secondary">
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(asset.id)}
              >
                <Delete />
              </IconButton>
            </TableCell>
            <TableCell>{asset.assetCode}</TableCell>
            <TableCell>{asset.title}</TableCell>
            <TableCell>{asset.use}</TableCell>
            <TableCell>{asset.status}</TableCell>
            <TableCell>{asset.location}</TableCell>
            <TableCell>{asset.serialNumber}</TableCell>
          </TableRow>
))}
      </TableBody>
    </Table>
  </TableContainer>
)}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Showing {assets.length} items</div>
        <Pagination
          count={totalPages}
          page={currentPage}
          color="primary"
          onChange={(event, page) => fetchAssets(page)}
        />
      </div>

      {/* Asset Form Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add New Asset</DialogTitle>
        
        <DialogContent>
        <TextField
    label="Id"
    name="id"
    value={newAsset.id}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
    required
  />
  <TextField
    label="Name"
    name="name"
    value={newAsset.name}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
    required
  />
  <TextField
    label="Product Type"
    name="productType"
    value={newAsset.productType}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
    required
  />
  <TextField
    label="Vendor Name"
    name="vendorName"
    value={newAsset.vendorName}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Model"
    name="model"
    value={newAsset.model}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Quantity"
    name="qty"
    type="number"
    value={newAsset.qty}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Location"
    name="location"
    value={newAsset.location}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Region"
    name="region"
    value={newAsset.region}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
  />
  <Select
    label="Status"
    name="status"
    value={newAsset.status}
    onChange={(e) =>
      handleInputChange({
        target: { name: "status", value: e.target.value },
      })
    }
    fullWidth
    margin="normal"
    displayEmpty
  >
    <MenuItem value="">
      <em>Select Status</em>
    </MenuItem>
    <MenuItem value="In Use">In Use</MenuItem>
    <MenuItem value="Not In Use">Not In Use</MenuItem>
    <MenuItem value="Broken">Broken</MenuItem>
  </Select>
  <TextField
    label="Serial Number"
    name="serialNumber"
    value={newAsset.serialNumber}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Manufacture Date"
    name="manufactureDate"
    type="date"
    value={newAsset.manufactureDate}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
    InputLabelProps={{
      shrink: true,
    }}
  />
  <TextField
    label="Install Date"
    name="installDate"
    type="date"
    value={newAsset.installDate}
    onChange={handleInputChange}
    fullWidth
    margin="normal"
    InputLabelProps={{
      shrink: true,
    }}
  />
</DialogContent>
<DialogActions>
  <Button onClick={handleCloseModal} color="secondary">
    Cancel
  </Button>
  <Button onClick={handleAddAsset} color="primary">
    Save
  </Button>
</DialogActions>

      </Dialog>
    </div>
  );
};

export default AssetPage;


