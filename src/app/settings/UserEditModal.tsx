// import { useState } from 'react';
// import axios from 'axios';

// export default function UserEditModal({ user, onClose, onSave }) {
//   const [form, setForm] = useState({ ...user });
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, type, value, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await axios.put(`/api/auth/${form._id}`, {
//         isApproved: form.isApproved,
//         isEocUser: form.isEocUser,
//         location: form.location,
//         role: form.role,
//       });
//       setMessage('Saved successfully');
//       onSave();
//       setTimeout(onClose, 1000);
//     } catch (err) {
//       setMessage('Error saving changes');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
//       <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Edit User</h2>

//         <div className="space-y-3">
//           <input
//             type="text"
//             value={form.email}
//             disabled
//             className="w-full p-2 bg-gray-100 border rounded"
//           />

//           <select
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           >
//             <option value="">Select Role</option>
//             <option value="admin">Admin</option>
//             <option value="manager">Manager</option>
//             <option value="user">User</option>
//             <option value="EOC User">EOC User</option>
//           </select>

//           <input
//             type="text"
//             name="location"
//             value={form.location || ''}
//             onChange={handleChange}
//             placeholder="Location"
//             className="w-full p-2 border rounded"
//           />

//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               name="isApproved"
//               checked={form.isApproved}
//               onChange={handleChange}
//             />
//             <span>Approved</span>
//           </label>

//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               name="isEocUser"
//               checked={form.isEocUser}
//               onChange={handleChange}
//             />
//             <span>EOC User</span>
//           </label>
//         </div>

//         <div className="mt-4 flex justify-between">
//           <button
//             onClick={onClose}
//             className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             disabled={saving}
//           >
//             {saving ? 'Saving...' : 'Save'}
//           </button>
//         </div>

//         {message && (
//           <p className="text-sm mt-2 text-center text-gray-700">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserEditModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [locations, setLocations] = useState([]);

  const token = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${process.env.url}/api/locations`, {
            headers: { Authorization: `Bearer ${token()}` },
          });
        setLocations(res.data);
      } catch (error) {
        console.error('Failed to load locations', error);
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${process.env.url}/api/auth/${form._id}`, {
        isApproved: form.isApproved,
        isEocUser: form.isEocUser,
        location: form.location,
        role: form.role,
        headers: { Authorization: `Bearer ${token()}` }
      });
      setMessage('Saved successfully');
      onSave();
      setTimeout(onClose, 1000);
    } catch (err) {
      console.error(err);
      setMessage('Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <div className="space-y-3">
          <input
            type="text"
            value={form.email}
            disabled
            className="w-full p-2 bg-gray-100 border rounded"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
            <option value="EOC User">EOC User</option>
          </select>

          <select
            name="location"
            value={form.location || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isApproved"
              checked={form.isApproved}
              onChange={handleChange}
            />
            <span>Approved</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isEocUser"
              checked={form.isEocUser}
              onChange={handleChange}
            />
            <span>EOC User</span>
          </label>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {message && (
          <p className="text-sm mt-2 text-center text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
