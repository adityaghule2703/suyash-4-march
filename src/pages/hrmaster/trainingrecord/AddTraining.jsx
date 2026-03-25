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
//   Typography,
//   Paper,
//   MenuItem
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const AddTraining = ({ open, onClose, onAdd, employeeId }) => {

//   const initialState = {
//     trainingName: "",
//     provider: "",
//     startDate: "",
//     endDate: "",
//     status: "Pending"
//   };

//   const [formData, setFormData] = useState(initialState);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (open) {
//       setFormData(initialState);
//       setError("");
//     }
//   }, [open]);

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

//     if (!formData.startDate) {
//       setError("Start date is required");
//       return;
//     }

//     if (!formData.endDate) {
//       setError("End date is required");
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

//       // Only add employeeId if it exists
//       if (employeeId) {
//         payload.employeeId = employeeId;
//       }

//       const response = await axios.post(
//         `${BASE_URL}/api/trainings/create`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data.success) {

//         onAdd(response.data.data);

//         handleClose();
//       }

//     } catch (err) {

//       console.error("Error adding training:", err);

//       setError(
//         err.response?.data?.message ||
//         "Failed to add training record"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData(initialState);
//     setError("");
//     onClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
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
//           fontSize: 20,
//           color: "#fff",
//           px: 3,
//           py: 2,
//           background: HEADER_GRADIENT
//         }}
//       >
//         Add Training Record
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>

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
//                 required
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
//                 fullWidth
//                 type="date"
//                 label="Start Date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 fullWidth
//                 type="date"
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
//                 label="Training Status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 disabled={loading}
//               >
//                 <MenuItem value="Pending">Pending</MenuItem>
//                 <MenuItem value="Completed">Completed</MenuItem>
//                 <MenuItem value="Failed">Failed</MenuItem>
//               </TextField>

//             </Stack>

//           </Paper>

//           {error && (
//             <Alert severity="error">
//               {error}
//             </Alert>
//           )}

//         </Stack>

//       </DialogContent>

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           pt: 2,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc"
//         }}
//       >

//         <Button onClick={handleClose} disabled={loading}>
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? null : <AddIcon />}
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
//           {loading ? "Adding..." : "Add Training"}
//         </Button>

//       </DialogActions>

//     </Dialog>
//   );
// };

// export default AddTraining;

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
//   Typography,
//   Paper,
//   MenuItem
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const AddTraining = ({ open, onClose, onAdd, employeeId }) => {

//   const initialState = {
//     trainingName: "",
//     provider: "",
//     startDate: "",
//     endDate: "",
//     status: "Scheduled"
//   };

//   const [formData, setFormData] = useState(initialState);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (open) {
//       setFormData(initialState);
//       setError("");
//     }
//   }, [open]);

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

//     if (!formData.startDate) {
//       setError("Start date is required");
//       return;
//     }

//     if (!formData.endDate) {
//       setError("End date is required");
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

//       if (employeeId) {
//         payload.employeeId = employeeId;
//       }

//       const response = await axios.post(
//         `${BASE_URL}/api/trainings/create`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data.success) {

//         if (onAdd) {
//           onAdd(response.data.data);
//         }

//         handleClose();
//       }

//     } catch (err) {

//       console.error("Error adding training:", err);

//       setError(
//         err.response?.data?.message ||
//         "Failed to add training record"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData(initialState);
//     setError("");
//     onClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 3 }
//       }}
//     >

//       <DialogTitle
//         sx={{
//           fontWeight: 600,
//           fontSize: 20,
//           color: "#fff",
//           px: 3,
//           py: 2,
//           background: HEADER_GRADIENT
//         }}
//       >
//         Add Training Record
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>

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
//                 required
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
//                 fullWidth
//                 type="date"
//                 label="Start Date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 fullWidth
//                 type="date"
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

//             </Stack>

//           </Paper>

//           {error && (
//             <Alert severity="error">
//               {error}
//             </Alert>
//           )}

//         </Stack>

//       </DialogContent>

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           pt: 2,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc"
//         }}
//       >

//         <Button onClick={handleClose} disabled={loading}>
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? null : <AddIcon />}
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
//           {loading ? "Adding..." : "Add Training"}
//         </Button>

//       </DialogActions>

//     </Dialog>
//   );
// };

// export default AddTraining;

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
//   Typography,
//   Paper
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const AddTraining = ({ open, onClose, onAdd, employeeId }) => {

//   const initialState = {
//     trainingName: "",
//     provider: "",
//     startDate: "",
//     endDate: ""
//   };

//   const [formData, setFormData] = useState(initialState);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (open) {
//       setFormData(initialState);
//       setError("");
//     }
//   }, [open]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async () => {

//     // VALIDATION
//     if (!formData.trainingName.trim()) {
//       setError("Training name is required");
//       return;
//     }

//     if (!formData.startDate) {
//       setError("Start date is required");
//       return;
//     }

//     if (!formData.endDate) {
//       setError("End date is required");
//       return;
//     }

//     // DATE VALIDATION 
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
//         endDate: formData.endDate
//       };

//       // OPTIONAL employee assign
//       if (employeeId) {
//         payload.employeeId = employeeId;
//       }

//       const response = await axios.post(
//         `${BASE_URL}/api/trainings/create`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data.success) {
//         if (onAdd) {
//           onAdd(response.data.data);
//         }

//         handleClose();
//       }

//     } catch (err) {
//       console.error("Error adding training:", err);

//       setError(
//         err.response?.data?.message ||
//         "Failed to add training"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData(initialState);
//     setError("");
//     onClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 3 }
//       }}
//     >

//       {/* HEADER */}
//       <DialogTitle
//         sx={{
//           fontWeight: 600,
//           fontSize: 20,
//           color: "#fff",
//           px: 3,
//           py: 2,
//           background: HEADER_GRADIENT
//         }}
//       >
//         Add Training
//       </DialogTitle>

//       {/* CONTENT */}
//       <DialogContent sx={{ mt: 2 }}>

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
//                 required
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
//                 fullWidth
//                 type="date"
//                 label="Start Date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 fullWidth
//                 type="date"
//                 label="End Date"
//                 name="endDate"
//                 value={formData.endDate}
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

//         <Button onClick={handleClose} disabled={loading}>
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? null : <AddIcon />}
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
//           {loading ? "Adding..." : "Add Training"}
//         </Button>

//       </DialogActions>

//     </Dialog>
//   );
// };

// export default AddTraining;

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
//   Typography,
//   Paper,
//   MenuItem
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const AddTraining = ({ open, onClose, onAdd }) => {

//   const initialState = {
//     trainingName: "",
//     provider: "",
//     trainingType: "Internal",
//     description: "",
//     startDate: "",
//     endDate: ""
//   };

//   const [formData, setFormData] = useState(initialState);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (open) {
//       setFormData(initialState);
//       setError("");
//     }
//   }, [open]);

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

//     if (!formData.startDate) {
//       setError("Start date is required");
//       return;
//     }

//     if (!formData.endDate) {
//       setError("End date is required");
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
//         trainingType: formData.trainingType,
//         description: formData.description.trim(),
//         startDate: formData.startDate,
//         endDate: formData.endDate
//         // ❌ status not needed → backend default = Scheduled
//       };

//       const response = await axios.post(
//         `${BASE_URL}/api/trainings/create`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data.success) {

//         if (onAdd) {
//           onAdd(response.data.data);
//         }

//         handleClose();
//       }

//     } catch (err) {

//       console.error("Error adding training:", err);

//       setError(
//         err.response?.data?.message ||
//         "Failed to add training"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData(initialState);
//     setError("");
//     onClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 3 } }}
//     >

//       <DialogTitle
//         sx={{
//           fontWeight: 600,
//           fontSize: 20,
//           color: "#fff",
//           px: 3,
//           py: 2,
//           background: HEADER_GRADIENT
//         }}
//       >
//         Add Training
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>

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
//                 required
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
//                 select
//                 fullWidth
//                 label="Training Type"
//                 name="trainingType"
//                 value={formData.trainingType}
//                 onChange={handleChange}
//                 disabled={loading}
//               >
//                 <MenuItem value="Internal">Internal</MenuItem>
//                 <MenuItem value="External">External</MenuItem>
//               </TextField>

//               <TextField
//                 fullWidth
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 multiline
//                 rows={2}
//                 disabled={loading}
//               />

//               <TextField
//                 fullWidth
//                 type="date"
//                 label="Start Date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//               <TextField
//                 fullWidth
//                 type="date"
//                 label="End Date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />

//             </Stack>

//           </Paper>

//           {error && <Alert severity="error">{error}</Alert>}

//         </Stack>

//       </DialogContent>

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           pt: 2,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc"
//         }}
//       >

//         <Button onClick={handleClose} disabled={loading}>
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? null : <AddIcon />}
//           sx={{
//             borderRadius: 1.5,
//             px: 3,
//             background: HEADER_GRADIENT,
//             "&:hover": {
//               opacity: 0.9
//             }
//           }}
//         >
//           {loading ? "Adding..." : "Add Training"}
//         </Button>

//       </DialogActions>

//     </Dialog>
//   );
// };

// export default AddTraining;


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
import { Add as AddIcon } from '@mui/icons-material';
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

const AddTraining = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    trainingName: '',
    provider: '',
    trainingType: 'Internal',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Training type options
  const trainingTypeOptions = [
    { value: 'Internal', label: 'Internal' },
    { value: 'External', label: 'External' }
  ];

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        trainingName: '',
        provider: '',
        trainingType: 'Internal',
        description: '',
        startDate: '',
        endDate: ''
      });
      setError('');
    }
  }, [open]);

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

    if (!formData.trainingType) {
      setError('Training type is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/trainings/create`, {
        trainingName: formData.trainingName.trim(),
        provider: formData.provider.trim(),
        trainingType: formData.trainingType,
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        if (onAdd) {
          onAdd(response.data.data);
        }
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add training');
      }
    } catch (err) {
      console.error('Error adding training:', err);
      setError(err.response?.data?.message || 'Failed to add training. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      trainingName: '',
      provider: '',
      trainingType: 'Internal',
      description: '',
      startDate: '',
      endDate: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          Add New Training
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

            {/* Training Type Field - Using Select dropdown */}
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
                  TRAINING TYPE <span style={{ color: '#EF4444' }}>*</span>
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
                  {trainingTypeOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      sx={{ fontSize: '0.75rem', py: 1 }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
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
          onClick={handleClose}
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
          disabled={loading || !formData.trainingName || !formData.startDate || !formData.endDate || !formData.trainingType}
          startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Adding...' : 'Add Training'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTraining;