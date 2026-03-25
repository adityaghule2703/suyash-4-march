// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   Paper,
//   Typography,
//   IconButton,
//   MenuItem
// } from "@mui/material";
// import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const EditTraining = ({ open, onClose, training, onUpdate }) => {

//   const [formData, setFormData] = useState({
//     trainingName: "",
//     provider: "",
//     startDate: "",
//     endDate: "",
//     status: "Pending",
//     certificateNumber: "",
//     issueDate: "",
//     expiryDate: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {

//     if (training) {
//       setFormData({
//         trainingName: training.trainingName || "",
//         provider: training.provider || "",
//         startDate: training.startDate?.substring(0,10) || "",
//         endDate: training.endDate?.substring(0,10) || "",
//         status: training.status || "Pending",
//         certificateNumber: training.certificateNumber || "",
//         issueDate: training.issueDate?.substring(0,10) || "",
//         expiryDate: training.expiryDate?.substring(0,10) || ""
//       });
//     }

//   }, [training]);

//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));

//   };

//   const handleSubmit = async () => {

//     if (!formData.trainingName.trim()) {
//       setError("Training name is required");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {

//       const token = localStorage.getItem("token");

//       const response = await axios.put(
//         `${BASE_URL}/api/trainings/update/${training._id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data.success) {

//         onUpdate(response.data.data);
//         onClose();

//       } else {
//         setError(response.data.message || "Failed to update training");
//       }

//     } catch (err) {

//       console.error("Error updating training:", err);

//       setError(
//         err.response?.data?.message ||
//         "Failed to update training. Please try again."
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 3 }
//       }}
//     >

//       {/* Header */}

//       <DialogTitle
//         sx={{
//           fontWeight: 600,
//           fontSize: 22,
//           color: "#fff",
//           px: 3,
//           py: 2,
//           background: HEADER_GRADIENT,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center"
//         }}
//       >
//         Edit Training

//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* Content */}

//       <DialogContent sx={{ mt: 3 }}>

//         <Stack spacing={3}>

//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               borderRadius: 2,
//               border: "1px solid #e2e8f0"
//             }}
//           >

//             <Typography
//               sx={{
//                 fontWeight: 600,
//                 mb: 2,
//                 color: "#2563EB",
//                 fontSize: "1rem"
//               }}
//             >
//               Training Information
//             </Typography>

//             <Stack spacing={2}>

//               <TextField
//                 fullWidth
//                 label="Training Name"
//                 name="trainingName"
//                 value={formData.trainingName}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 1.5,
//                     background: "#f8fafc"
//                   }
//                 }}
//               />

//               <TextField
//                 fullWidth
//                 label="Training Provider"
//                 name="provider"
//                 value={formData.provider}
//                 onChange={handleChange}
//                 disabled={loading}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 1.5,
//                     background: "#f8fafc"
//                   }
//                 }}
//               />

//               <TextField
//                 type="date"
//                 fullWidth
//                 label="Start Date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 type="date"
//                 fullWidth
//                 label="End Date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 select
//                 fullWidth
//                 label="Status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 disabled={loading}
//               >

//                 <MenuItem value="Pending">
//                   Pending
//                 </MenuItem>

//                 <MenuItem value="Completed">
//                   Completed
//                 </MenuItem>

//                 <MenuItem value="Failed">
//                   Failed
//                 </MenuItem>

//               </TextField>

//               <TextField
//                 fullWidth
//                 label="Certificate Number"
//                 name="certificateNumber"
//                 value={formData.certificateNumber}
//                 onChange={handleChange}
//                 disabled={loading}
//               />

//               <TextField
//                 type="date"
//                 fullWidth
//                 label="Issue Date"
//                 name="issueDate"
//                 value={formData.issueDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 type="date"
//                 fullWidth
//                 label="Expiry Date"
//                 name="expiryDate"
//                 value={formData.expiryDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//             </Stack>

//           </Paper>

//           {error && (
//             <Alert severity="error" sx={{ borderRadius: 2 }}>
//               {error}
//             </Alert>
//           )}

//         </Stack>

//       </DialogContent>

//       {/* Footer */}

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           pt: 2,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc"
//         }}
//       >

//         <Button
//           onClick={onClose}
//           disabled={loading}
//           sx={{
//             textTransform: "none",
//             fontWeight: 500
//           }}
//         >
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? null : <EditIcon />}
//           sx={{
//             textTransform: "none",
//             fontWeight: 500,
//             borderRadius: 1.5,
//             px: 3,
//             background: HEADER_GRADIENT,
//             "&:hover": {
//               opacity: 0.9,
//               background: HEADER_GRADIENT
//             }
//           }}
//         >
//           {loading ? "Updating..." : "Update Training"}
//         </Button>

//       </DialogActions>

//     </Dialog>
//   );
// };

// export default EditTraining;

// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   Paper,
//   Typography,
//   IconButton,
//   MenuItem
// } from "@mui/material";
// import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const EditTraining = ({ open, onClose, training, onUpdate }) => {

//   const [formData, setFormData] = useState({
//     trainingName: "",
//     provider: "",
//     startDate: "",
//     endDate: "",
//     status: "Scheduled",
//     certificateNumber: "",
//     issueDate: "",
//     expiryDate: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {

//     if (training) {

//       setFormData({
//         trainingName: training.trainingName || "",
//         provider: training.provider || "",
//         startDate: training.startDate?.substring(0,10) || "",
//         endDate: training.endDate?.substring(0,10) || "",
//         status: training.status || "Scheduled",
//         certificateNumber: training.certificateNumber || "",
//         issueDate: training.issueDate?.substring(0,10) || "",
//         expiryDate: training.expiryDate?.substring(0,10) || ""
//       });

//     }

//   }, [training]);

//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//   };

//   const handleSubmit = async () => {

//     if (!formData.trainingName.trim()) {
//       setError("Training name is required");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {

//       const token = localStorage.getItem("token");

//       const payload = {
//         trainingName: formData.trainingName.trim(),
//         provider: formData.provider.trim(),
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         status: formData.status,
//         certificateNumber: formData.certificateNumber,
//         issueDate: formData.issueDate,
//         expiryDate: formData.expiryDate
//       };

//       const response = await axios.put(
//         `${BASE_URL}/api/trainings/update/${training._id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data.success) {

//         if (onUpdate) {
//           onUpdate(response.data.data);
//         }

//         onClose();
//       }

//     } catch (err) {

//       console.error("Error updating training:", err);

//       setError(
//         err.response?.data?.message ||
//         "Failed to update training"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 3 } }}
//     >

//       {/* HEADER */}

//       <DialogTitle
//         sx={{
//           fontWeight: 600,
//           fontSize: 22,
//           color: "#fff",
//           px: 3,
//           py: 2,
//           background: HEADER_GRADIENT,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center"
//         }}
//       >
//         Edit Training

//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* CONTENT */}

//       <DialogContent sx={{ mt: 3 }}>

//         <Stack spacing={3}>

//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               borderRadius: 2,
//               border: "1px solid #e2e8f0"
//             }}
//           >

//             <Typography
//               sx={{
//                 fontWeight: 600,
//                 mb: 2,
//                 color: "#2563EB"
//               }}
//             >
//               Training Information
//             </Typography>

//             <Stack spacing={2}>

//               <TextField
//                 fullWidth
//                 label="Training Name"
//                 name="trainingName"
//                 value={formData.trainingName}
//                 onChange={handleChange}
//                 disabled={loading}
//               />

//               <TextField
//                 fullWidth
//                 label="Training Provider"
//                 name="provider"
//                 value={formData.provider}
//                 onChange={handleChange}
//                 disabled={loading}
//               />

//               <TextField
//                 type="date"
//                 fullWidth
//                 label="Start Date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 type="date"
//                 fullWidth
//                 label="End Date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               {/* STATUS */}

//               <TextField
//                 select
//                 fullWidth
//                 label="Training Status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 disabled={loading}
//               >
//                 <MenuItem value="Scheduled">Scheduled</MenuItem>
//                 <MenuItem value="Assigned">Assigned</MenuItem>
//                 <MenuItem value="InProgress">In Progress</MenuItem>
//                 <MenuItem value="Completed">Completed</MenuItem>
//                 <MenuItem value="Failed">Failed</MenuItem>
//               </TextField>

//               {/* CERTIFICATE */}

//               <TextField
//                 fullWidth
//                 label="Certificate Number"
//                 name="certificateNumber"
//                 value={formData.certificateNumber}
//                 onChange={handleChange}
//                 disabled={loading}
//               />

//               <TextField
//                 type="date"
//                 fullWidth
//                 label="Issue Date"
//                 name="issueDate"
//                 value={formData.issueDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 type="date"
//                 fullWidth
//                 label="Expiry Date"
//                 name="expiryDate"
//                 value={formData.expiryDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//             </Stack>

//           </Paper>

//           {error && (
//             <Alert severity="error">
//               {error}
//             </Alert>
//           )}

//         </Stack>

//       </DialogContent>

//       {/* FOOTER */}

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           pt: 2,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc"
//         }}
//       >

//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? null : <EditIcon />}
//           sx={{
//             borderRadius: 1.5,
//             px: 3,
//             background: HEADER_GRADIENT,
//             "&:hover": {
//               opacity: 0.9,
//               background: HEADER_GRADIENT
//             }
//           }}
//         >
//           {loading ? "Updating..." : "Update Training"}
//         </Button>

//       </DialogActions>

//     </Dialog>
//   );
// };

// export default EditTraining;

// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   Paper,
//   Typography,
//   IconButton,
//   MenuItem
// } from "@mui/material";
// import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const EditTraining = ({ open, onClose, training, onUpdate }) => {

//   const [formData, setFormData] = useState({
//     trainingName: "",
//     provider: "",
//     startDate: "",
//     endDate: "",
//     status: "Scheduled"
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🔥 DATE FIX FUNCTION
//   const formatDateForInput = (date) => {
//     if (!date) return "";

//     if (typeof date === "string" && date.includes("/")) {
//       const [day, month, year] = date.split("/");
//       return `${year}-${month}-${day}`;
//     }

//     return date?.substring(0, 10);
//   };

//   useEffect(() => {
//     if (training) {
//       setFormData({
//         trainingName: training.trainingName || "",
//         provider: training.provider || "",
//         startDate: formatDateForInput(training.startDate),
//         endDate: formatDateForInput(training.endDate),
//         status: training.status || "Scheduled"
//       });
//     }
//   }, [training]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async () => {

//     if (!formData.trainingName.trim()) {
//       setError("Training name is required");
//       return;
//     }

//     if (new Date(formData.endDate) < new Date(formData.startDate)) {
//       setError("End date cannot be before start date");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const payload = {
//         trainingName: formData.trainingName.trim(),
//         provider: formData.provider.trim(),
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         status: formData.status
//       };

//       const response = await axios.put(
//         `${BASE_URL}/api/trainings/update/${training._id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data.success) {
//         onUpdate(response.data.data);
//         onClose();
//       }

//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

//       <DialogTitle sx={{
//         background: HEADER_GRADIENT,
//         color: "#fff",
//         display: "flex",
//         justifyContent: "space-between"
//       }}>
//         Edit Training
//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>
//         <Paper sx={{ p: 3 }}>

//           <Stack spacing={2}>

//             <TextField
//               label="Training Name"
//               name="trainingName"
//               value={formData.trainingName}
//               onChange={handleChange}
//               fullWidth
//             />

//             <TextField
//               label="Provider"
//               name="provider"
//               value={formData.provider}
//               onChange={handleChange}
//               fullWidth
//             />

//             <TextField
//               type="date"
//               label="Start Date"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//             />

//             <TextField
//               type="date"
//               label="End Date"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//             />

//             <TextField
//               select
//               label="Status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               fullWidth
//             >
//               <MenuItem value="Scheduled">Scheduled</MenuItem>
//               <MenuItem value="Assigned">Assigned</MenuItem>
//               <MenuItem value="InProgress">In Progress</MenuItem>
//               <MenuItem value="Completed">Completed</MenuItem>
//               <MenuItem value="Failed">Failed</MenuItem>
//             </TextField>

//             {error && <Alert severity="error">{error}</Alert>}

//           </Stack>

//         </Paper>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={<EditIcon />}
//         >
//           {loading ? "Updating..." : "Update"}
//         </Button>
//       </DialogActions>

//     </Dialog>
//   );
// };

// export default EditTraining;


import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  Box,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching LeaveTypeMaster and AddTax
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// Status options with colors
const statusOptions = [
  { value: 'Scheduled', label: 'Scheduled', color: '#F59E0B' },
  { value: 'Assigned', label: 'Assigned', color: '#3B82F6' },
  { value: 'InProgress', label: 'In Progress', color: '#8B5CF6' },
  { value: 'Completed', label: 'Completed', color: '#10B981' },
  { value: 'Failed', label: 'Failed', color: '#EF4444' }
];

const EditTraining = ({ open, onClose, training, onUpdate }) => {
  const [formData, setFormData] = useState({
    trainingName: '',
    provider: '',
    trainingType: 'Internal',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Scheduled'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    try {
      // If it's already in YYYY-MM-DD format
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}/)) {
        return date.substring(0, 10);
      }
      
      // Handle DD/MM/YYYY format
      if (typeof date === 'string' && date.includes('/')) {
        const parts = date.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      
      // Handle Date object or ISO string
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().substring(0, 10);
      }
      
      return '';
    } catch (err) {
      return '';
    }
  };

  // Reset form when training changes
  useEffect(() => {
    if (training) {
      setFormData({
        trainingName: training.trainingName || '',
        provider: training.provider || '',
        trainingType: training.trainingType || 'Internal',
        description: training.description || '',
        startDate: formatDateForInput(training.startDate),
        endDate: formatDateForInput(training.endDate),
        status: training.status || 'Scheduled'
      });
    }
  }, [training]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.trainingName.trim()) {
      setError('Training name is required');
      return;
    }

    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }

    if (!formData.endDate) {
      setError('End date is required');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be before start date');
      return;
    }

    if (!formData.status) {
      setError('Status is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/trainings/update/${training._id}`,
        {
          trainingName: formData.trainingName.trim(),
          provider: formData.provider.trim(),
          trainingType: formData.trainingType,
          description: formData.description.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to update training');
      }
    } catch (err) {
      console.error('Error updating training:', err);
      setError(err.response?.data?.message || 'Failed to update training. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get status color for display
  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : COLORS.text.secondary;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Edit Training
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Training Name Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  TRAINING NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="trainingName"
                  value={formData.trainingName}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter training name"
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Training Provider Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  TRAINING PROVIDER
                </Typography>
                <TextField
                  fullWidth
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter training provider"
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Training Type Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  TRAINING TYPE
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="trainingType"
                  value={formData.trainingType}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                >
                  <MenuItem value="Internal" sx={{ fontSize: '0.75rem' }}>Internal</MenuItem>
                  <MenuItem value="External" sx={{ fontSize: '0.75rem' }}>External</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* Start Date Field */}
            <Box sx={{ gridColumn: 'span 1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  START DATE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                />
              </Box>
            </Box>

            {/* End Date Field */}
            <Box sx={{ gridColumn: 'span 1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  END DATE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                />
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  End date cannot be before start date
                </Typography>
              </Box>
            </Box>

            {/* Status Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  STATUS <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      sx={{ fontSize: '0.75rem', py: 1 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: option.color,
                            display: 'inline-block'
                          }}
                        />
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {option.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Description Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  DESCRIPTION
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  disabled={loading}
                  placeholder="Enter training description..."
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1.5,
                mt: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem',
                  alignItems: 'center'
                },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.trainingName || !formData.startDate || !formData.endDate}
          startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Updating...' : 'Update Training'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTraining;