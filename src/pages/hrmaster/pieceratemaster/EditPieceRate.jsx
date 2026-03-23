// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Grid,
//   Alert,
//   MenuItem,
//   Box,
//   CircularProgress,
//   Typography,
//   Divider,
// } from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const EditPieceRate = ({ open, onClose, pieceRate, onUpdate }) => {
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [departments, setDepartments] = useState([]);

//   const [formData, setFormData] = useState({
//     productType: "",
//     operation: "",
//     ratePerUnit: "",
//     uom: "piece",
//     skillLevel: "Unskilled",
//     departmentId: "",
//     effectiveFrom: null,
//     effectiveTo: null,
//   });

//   /* ================= FETCH DEPARTMENTS ================= */
//   useEffect(() => {
//     if (open) fetchDepartments();
//   }, [open]);

//   const fetchDepartments = async () => {
//     try {
//       setFetchLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${BASE_URL}/api/departments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         setDepartments(res.data.data || []);
//       }
//     } catch (err) {
//       console.error("Department fetch error:", err);
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   /* ================= LOAD PIECE RATE DATA ================= */
//   useEffect(() => {
//     if (open && pieceRate) {
//       setFormData({
//         productType: pieceRate.productType || "",
//         operation: pieceRate.operation || "",
//         ratePerUnit: pieceRate.ratePerUnit || "",
//         uom: pieceRate.uom || "piece",
//         skillLevel: pieceRate.skillLevel || "Unskilled",
//         departmentId: pieceRate.departmentId
//           ? String(pieceRate.departmentId._id || pieceRate.departmentId)
//           : "",
//         effectiveFrom: pieceRate.effectiveFrom
//           ? new Date(pieceRate.effectiveFrom)
//           : null,
//         effectiveTo: pieceRate.effectiveTo
//           ? new Date(pieceRate.effectiveTo)
//           : null,
//       });
//     }
//   }, [open, pieceRate]);

//   /* ================= HANDLE CHANGE ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "departmentId" ? String(value) : value,
//     }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     if (!pieceRate?._id) {
//       return setError("Invalid piece rate ID");
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const payload = {
//         productType: formData.productType.trim(),
//         operation: formData.operation.trim(),
//         ratePerUnit: Number(formData.ratePerUnit),
//         uom: formData.uom,
//         skillLevel: formData.skillLevel,
//         effectiveFrom: formData.effectiveFrom
//           ? formData.effectiveFrom.toISOString().split("T")[0]
//           : null,
//         effectiveTo: formData.effectiveTo
//           ? formData.effectiveTo.toISOString().split("T")[0]
//           : null,
//         departmentId: formData.departmentId || null,
//       };

//       const res = await axios.put(
//         `${BASE_URL}/api/piece-rate-master/${pieceRate._id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.data.success) {
//         onUpdate(res.data.data);
//         onClose();
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to update piece rate"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{
//           background: "linear-gradient(135deg, #164e63, #00B4D8)",
//           color: "#fff",
//           fontWeight: 600,
//         }}
//       >
//         Edit Piece Rate
//       </DialogTitle>

//       <DialogContent sx={{ p: 1 }}>
//         {fetchLoading ? (
//           <Box display="flex" justifyContent="center" py={6}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Box
//               sx={{
//                 border: "1px solid #e0e0e0",
//                 borderRadius: 3,
//                 p: 4,
//                 margin: 1,
//                 backgroundColor: "#fafafa",
//               }}
//             >
//               <Typography variant="h6" mb={2} fontWeight={600}>
//                 Piece Rate Details
//               </Typography>

//               <Divider sx={{ mb: 3 }} />

//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Product Type"
//                     name="productType"
//                     fullWidth
//                     value={formData.productType}
//                     onChange={handleChange}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Operation"
//                     name="operation"
//                     fullWidth
//                     value={formData.operation}
//                     onChange={handleChange}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                   <TextField
//                     label="Rate Per Unit"
//                     name="ratePerUnit"
//                     type="number"
//                     fullWidth
//                     value={formData.ratePerUnit}
//                     onChange={handleChange}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                   <TextField
//                     select
//                     label="UOM"
//                     name="uom"
//                     fullWidth
//                     value={formData.uom}
//                     onChange={handleChange}
//                   >
//                     <MenuItem value="piece">Piece</MenuItem>
//                     <MenuItem value="dozen">Dozen</MenuItem>
//                     <MenuItem value="kg">Kg</MenuItem>
//                     <MenuItem value="meter">Meter</MenuItem>
//                     <MenuItem value="hour">Hour</MenuItem>
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                   <TextField
//                     select
//                     label="Skill Level"
//                     name="skillLevel"
//                     fullWidth
//                     value={formData.skillLevel}
//                     onChange={handleChange}
//                   >
//                     <MenuItem value="Unskilled">Unskilled</MenuItem>
//                     <MenuItem value="Semi-Skilled">Semi-Skilled</MenuItem>
//                     <MenuItem value="Skilled">Skilled</MenuItem>
//                     <MenuItem value="Highly Skilled">Highly Skilled</MenuItem>
//                   </TextField>
//                 </Grid>

//                 {/* Department */}
//                 <Grid item xs={12}>
//                   <TextField
//                     select
//                     label="Department"
//                     name="departmentId"
//                     fullWidth
//                     value={formData.departmentId || ""}
//                     onChange={handleChange}
//                     SelectProps={{
//                       MenuProps: { disablePortal: true },
//                     }}
//                   >
//                     {departments.map((dept) => (
//                       <MenuItem
//                         key={dept._id}
//                         value={String(dept._id)}
//                       >
//                         {dept.DepartmentName}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <DatePicker
//                     label="Effective From"
//                     value={formData.effectiveFrom}
//                     onChange={(value) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         effectiveFrom: value,
//                       }))
//                     }
//                     slotProps={{ textField: { fullWidth: true } }}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <DatePicker
//                     label="Effective To"
//                     value={formData.effectiveTo}
//                     onChange={(value) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         effectiveTo: value,
//                       }))
//                     }
//                     slotProps={{ textField: { fullWidth: true } }}
//                   />
//                 </Grid>

//                 {error && (
//                   <Grid item xs={12}>
//                     <Alert severity="error">{error}</Alert>
//                   </Grid>
//                 )}
//               </Grid>
//             </Box>
//           </LocalizationProvider>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ px: 4, pb: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           sx={{
//             background: "linear-gradient(135deg, #164e63, #00B4D8)",
//             px: 4,
//           }}
//         >
//           {loading ? "Updating..." : "Update"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditPieceRate;


// import React, { useEffect, useState } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, TextField, Stack, MenuItem,
//   Alert, CircularProgress, Typography, Box
// } from "@mui/material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// /* 🎨 SAME DESIGN SYSTEM */
// const COLORS = {
//   primary: "#063C3F",
//   primaryDark: "#05292B",
//   text: {
//     primary: "#151C26",
//     secondary: "#4B5568",
//     tertiary: "#94A3B8"
//   },
//   border: "#E3E8EF"
// };

// const EditPieceRate = ({ open, onClose, pieceRate, onUpdate }) => {

//   const [loading, setLoading] = useState(false);
//   const [deptLoading, setDeptLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [departments, setDepartments] = useState([]);

//   const [formData, setFormData] = useState({
//     productType: "",
//     operation: "",
//     ratePerUnit: "",
//     uom: "piece",
//     skillLevel: "Unskilled",
//     departmentId: "",
//     effectiveFrom: "",
//     effectiveTo: ""
//   });

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     if (open) fetchDepartments();
//   }, [open]);

//   const fetchDepartments = async () => {
//     try {
//       setDeptLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${BASE_URL}/api/departments`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data.success) {
//         setDepartments(res.data.data || []);
//       }
//     } catch {
//       setError("Failed to load departments");
//     } finally {
//       setDeptLoading(false);
//     }
//   };

//   /* ================= LOAD DATA ================= */
//   useEffect(() => {
//     if (open && pieceRate) {
//       setFormData({
//         productType: pieceRate.productType || "",
//         operation: pieceRate.operation || "",
//         ratePerUnit: pieceRate.ratePerUnit || "",
//         uom: pieceRate.uom || "piece",
//         skillLevel: pieceRate.skillLevel || "Unskilled",
//         departmentId: pieceRate.departmentId?._id || pieceRate.departmentId || "",
//         effectiveFrom: pieceRate.effectiveFrom?.split("T")[0] || "",
//         effectiveTo: pieceRate.effectiveTo?.split("T")[0] || ""
//       });
//     }
//   }, [open, pieceRate]);

//   /* ================= CHANGE ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   /* ================= VALIDATION ================= */
//   const validate = () => {
//     if (!formData.productType) return "Product Type required";
//     if (!formData.operation) return "Operation required";
//     if (!formData.ratePerUnit) return "Rate required";
//     if (!formData.effectiveFrom) return "Date required";
//     return null;
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     const errMsg = validate();
//     if (errMsg) return setError(errMsg);

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const payload = {
//         ...formData,
//         ratePerUnit: Number(formData.ratePerUnit),
//         effectiveTo: formData.effectiveTo || null
//       };

//       const res = await axios.put(
//         `${BASE_URL}/api/piece-rate-master/${pieceRate._id}`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       if (res.data.success) {
//         onUpdate(res.data.data);
//         handleClose();
//       }

//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setError("");
//     onClose();
//   };

//   /* ================= COMMON STYLE ================= */
//   const inputStyle = {
//     "& .MuiOutlinedInput-root": {
//       borderRadius: 1.5,
//       fontSize: "0.75rem",
//       "&:hover fieldset": { borderColor: COLORS.primary },
//       "&.Mui-focused fieldset": { borderColor: COLORS.primary }
//     }
//   };

//   const labelStyle = {
//     fontSize: "0.7rem",
//     fontWeight: 600,
//     color: COLORS.text.secondary,
//     letterSpacing: "0.5px"
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           border: `1px solid ${COLORS.border}`
//         }
//       }}
//     >
//       {/* HEADER */}
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         px: 2.5, py: 1.5
//       }}>
//         <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
//           Edit Piece Rate
//         </Typography>
//       </DialogTitle>

//       {/* CONTENT */}
//       <DialogContent sx={{ p: 2.5 }}>
//         <Stack spacing={2}>

//           {/* PRODUCT */}
//           <Box>
//             <Typography sx={labelStyle}>PRODUCT TYPE *</Typography>
//             <TextField name="productType" fullWidth size="small"
//               value={formData.productType} onChange={handleChange} sx={inputStyle}/>
//           </Box>

//           {/* OPERATION */}
//           <Box>
//             <Typography sx={labelStyle}>OPERATION *</Typography>
//             <TextField name="operation" fullWidth size="small"
//               value={formData.operation} onChange={handleChange} sx={inputStyle}/>
//           </Box>

//           {/* RATE */}
//           <Box>
//             <Typography sx={labelStyle}>RATE *</Typography>
//             <TextField type="number" name="ratePerUnit" fullWidth size="small"
//               value={formData.ratePerUnit} onChange={handleChange} sx={inputStyle}/>
//           </Box>

//           {/* UOM */}
//           <Box>
//             <Typography sx={labelStyle}>UNIT</Typography>
//             <TextField select name="uom" fullWidth size="small"
//               value={formData.uom} onChange={handleChange} sx={inputStyle}>
//               <MenuItem value="piece">Piece</MenuItem>
//               <MenuItem value="kg">Kg</MenuItem>
//             </TextField>
//           </Box>

//           {/* DEPARTMENT */}
//           <Box>
//             <Typography sx={labelStyle}>DEPARTMENT</Typography>
//             <TextField select name="departmentId" fullWidth size="small"
//               value={formData.departmentId} onChange={handleChange} sx={inputStyle}>
//               {deptLoading ? (
//                 <MenuItem disabled><CircularProgress size={16}/></MenuItem>
//               ) : (
//                 departments.map(d => (
//                   <MenuItem key={d._id} value={d._id}>
//                     {d.DepartmentName}
//                   </MenuItem>
//                 ))
//               )}
//             </TextField>
//           </Box>

//           {/* DATE */}
//           <Box>
//             <Typography sx={labelStyle}>EFFECTIVE FROM *</Typography>
//             <TextField type="date" name="effectiveFrom" fullWidth size="small"
//               value={formData.effectiveFrom} onChange={handleChange} sx={inputStyle}/>
//           </Box>

//           {error && <Alert severity="error">{error}</Alert>}

//         </Stack>
//       </DialogContent>

//       {/* ACTIONS */}
//       <DialogActions sx={{
//         px: 2.5, py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`
//       }}>
//         <Button onClick={handleClose}>Cancel</Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           sx={{
//             bgcolor: COLORS.primary,
//             "&:hover": { bgcolor: COLORS.primaryDark }
//           }}
//         >
//           {loading ? "Updating..." : "Update"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditPieceRate;

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
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching other components
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

const EditPieceRate = ({ open, onClose, pieceRate, onUpdate }) => {
  const [formData, setFormData] = useState({
    productType: '',
    operation: '',
    ratePerUnit: '',
    uom: 'piece',
    skillLevel: 'Unskilled',
    departmentId: '',
    effectiveFrom: '',
    effectiveTo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [deptLoading, setDeptLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [rateError, setRateError] = useState('');

  // Skill level options
  const skillLevelOptions = ['Unskilled', 'Semi-Skilled', 'Skilled', 'Highly Skilled'];
  const uomOptions = ['piece', 'kg', 'nos', 'hour'];

  // Fetch departments
  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  // Load piece rate data
  useEffect(() => {
    if (open && pieceRate) {
      setFormData({
        productType: pieceRate.productType || '',
        operation: pieceRate.operation || '',
        ratePerUnit: pieceRate.ratePerUnit || '',
        uom: pieceRate.uom || 'piece',
        skillLevel: pieceRate.skillLevel || 'Unskilled',
        departmentId: pieceRate.departmentId?._id || pieceRate.departmentId || '',
        effectiveFrom: pieceRate.effectiveFrom?.split('T')[0] || '',
        effectiveTo: pieceRate.effectiveTo?.split('T')[0] || ''
      });
    }
  }, [open, pieceRate]);

  const fetchDepartments = async () => {
    try {
      setDeptLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments');
    } finally {
      setDeptLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Validate rate if it's the rate field
    if (name === 'ratePerUnit') {
      validateRate(value);
    }
  };

  const validateRate = (value) => {
    if (!value) {
      setRateError('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setRateError('Rate must be a positive number');
      return false;
    } else {
      setRateError('');
      return true;
    }
  };

  const validate = () => {
    if (!formData.productType.trim()) {
      setError('Product Type is required');
      return false;
    }
    
    if (!formData.operation.trim()) {
      setError('Operation is required');
      return false;
    }
    
    if (!formData.ratePerUnit) {
      setError('Rate is required');
      return false;
    }
    
    const numRate = parseFloat(formData.ratePerUnit);
    if (isNaN(numRate) || numRate <= 0) {
      setError('Rate must be a positive number');
      return false;
    }
    
    if (!formData.effectiveFrom) {
      setError('Effective From date is required');
      return false;
    }
    
    // Validate date range if effectiveTo is provided
    if (formData.effectiveFrom && formData.effectiveTo) {
      const fromDate = new Date(formData.effectiveFrom);
      const toDate = new Date(formData.effectiveTo);
      
      if (fromDate > toDate) {
        setError('Effective To date must be after Effective From date');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        productType: formData.productType.trim(),
        operation: formData.operation.trim(),
        ratePerUnit: parseFloat(formData.ratePerUnit),
        uom: formData.uom,
        skillLevel: formData.skillLevel,
        departmentId: formData.departmentId || null,
        effectiveFrom: formData.effectiveFrom,
        effectiveTo: formData.effectiveTo || null
      };

      const response = await axios.put(
        `${BASE_URL}/api/piece-rate-master/${pieceRate._id}`,
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (onUpdate && typeof onUpdate === 'function') {
          onUpdate(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to update piece rate');
      }
    } catch (err) {
      console.error('Error updating piece rate:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setRateError('');
    onClose();
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

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
        mb: 1.5,
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
          Edit Piece Rate
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Product Type Field */}
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
                  PRODUCT TYPE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Injection Molding, Assembly, etc."
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

            {/* Operation Field */}
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
                  OPERATION <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="operation"
                  value={formData.operation}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Molding, Cutting, Assembly, etc."
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

            {/* Rate Per Unit Field */}
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
                  RATE PER UNIT <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  name="ratePerUnit"
                  value={formData.ratePerUnit}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="0.00"
                  size="small"
                  variant="outlined"
                  error={!!rateError}
                  helperText={rateError || "Enter positive number"}
                  inputProps={{
                    step: "0.01",
                    min: "0"
                  }}
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

            {/* Unit of Measurement Field */}
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
                  UNIT OF MEASUREMENT
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="uom"
                  value={formData.uom}
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
                    '& .MuiSelect-select': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                >
                  {uomOptions.map((option) => (
                    <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Skill Level Field */}
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
                  SKILL LEVEL
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="skillLevel"
                  value={formData.skillLevel}
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
                    '& .MuiSelect-select': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                >
                  {skillLevelOptions.map((option) => (
                    <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Department Field */}
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
                  DEPARTMENT
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  disabled={loading || deptLoading}
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
                    '& .MuiSelect-select': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                    <em>Select department</em>
                  </MenuItem>
                  {deptLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} /> Loading...
                    </MenuItem>
                  ) : (
                    departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id} sx={{ fontSize: '0.75rem' }}>
                        {dept.DepartmentName}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Box>
            </Box>

            {/* Effective From Date Field */}
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
                  EFFECTIVE FROM <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  name="effectiveFrom"
                  value={formData.effectiveFrom}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: today
                  }}
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

            {/* Effective To Date Field */}
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
                  EFFECTIVE TO
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  name="effectiveTo"
                  value={formData.effectiveTo}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: formData.effectiveFrom || today
                  }}
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
                  Leave empty if no end date
                </Typography>
              </Box>
            </Box>

            {/* Preview Section */}
            {/* {(formData.productType || formData.operation) && (
              <Box sx={{ 
                gridColumn: 'span 2',
                p: 2, 
                bgcolor: COLORS.primaryLight, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.primary}`,
                mt: 1
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: COLORS.primaryDark, 
                    mb: 1.5,
                    fontSize: '0.8rem'
                  }}
                >
                  Piece Rate Information
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Product Type:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.productType || 'Not specified'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.operation || 'Not specified'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rate:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.ratePerUnit ? `${formData.ratePerUnit} / ${formData.uom}` : 'Not specified'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Skill Level:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.skillLevel}
                    </Typography>
                  </Stack>

                  {formData.effectiveFrom && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effective Period:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {formData.effectiveFrom}
                        {formData.effectiveTo && ` to ${formData.effectiveTo}`}
                        {!formData.effectiveTo && ' onwards'}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            )} */}
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
          disabled={loading || !formData.productType || !formData.operation || !formData.ratePerUnit || !formData.effectiveFrom}
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
          {loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPieceRate;