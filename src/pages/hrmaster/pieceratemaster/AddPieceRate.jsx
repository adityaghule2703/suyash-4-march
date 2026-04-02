// // import React, { useState, useEffect } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   Grid,
// //   MenuItem,
// //   Alert,
// //   CircularProgress,
// //   Box,
// //   Typography,
// //   Divider,
// // } from "@mui/material";
// // import { Add as AddIcon } from "@mui/icons-material";
// // import axios from "axios";
// // import BASE_URL from "../../../config/Config";

// // const AddPieceRate = ({ open, onClose, onAdd }) => {
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [departments, setDepartments] = useState([]);
// //   const [deptLoading, setDeptLoading] = useState(false);

// //   const initialState = {
// //     productType: "",
// //     operation: "",
// //     ratePerUnit: "",
// //     uom: "piece",
// //     skillLevel: "Unskilled",
// //     departmentId: "",
// //     effectiveFrom: "",
// //     effectiveTo: "",
// //     isActive: true,
// //   };

// //   const [formData, setFormData] = useState(initialState);

// //   /* ================= FETCH DEPARTMENTS ================= */

// //   useEffect(() => {
// //     if (open) {
// //       fetchDepartments();
// //     }
// //   }, [open]);

// //   const fetchDepartments = async () => {
// //     try {
// //       setDeptLoading(true);
// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(`${BASE_URL}/api/departments`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (res.data.success) {
// //         const deptList = res.data.data || [];

// //         setDepartments(deptList);

// //         // ✅ Only set default AFTER departments exist
// //         if (deptList.length > 0) {
// //           setFormData((prev) => ({
// //             ...prev,
// //             departmentId: "",
// //           }));

// //           // Delay ensures options render first
// //           setTimeout(() => {
// //             setFormData((prev) => ({
// //               ...prev,
// //               departmentId: String(deptList[0]._id),
// //             }));
// //           }, 0);
// //         }
// //       }
// //     } catch (err) {
// //       console.log("Department fetch error:", err);
// //     } finally {
// //       setDeptLoading(false);
// //     }
// //   };

// //   /* ================= HANDLE CHANGE ================= */

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: name === "departmentId" ? String(value) : value,
// //     }));
// //   };

// //   /* ================= SUBMIT ================= */

// //   const handleSubmit = async () => {
// //     if (!formData.productType) return setError("Product Type is required");
// //     if (!formData.operation) return setError("Operation is required");
// //     if (!formData.ratePerUnit) return setError("Rate Per Unit is required");
// //     if (!formData.effectiveFrom)
// //       return setError("Effective From date is required");

// //     try {
// //       setLoading(true);
// //       setError("");

// //       const token = localStorage.getItem("token");

// //       const payload = {
// //         productType: formData.productType.trim(),
// //         operation: formData.operation.trim(),
// //         ratePerUnit: Number(formData.ratePerUnit),
// //         uom: formData.uom,
// //         skillLevel: formData.skillLevel,
// //         effectiveFrom: formData.effectiveFrom,
// //         effectiveTo: formData.effectiveTo || null,
// //         isActive: true,
// //         departmentId: formData.departmentId || null,
// //       };

// //       const res = await axios.post(
// //         `${BASE_URL}/api/piece-rate-master`,
// //         payload,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         },
// //       );

// //       if (res.data.success) {
// //         onAdd(res.data.data);
// //         setFormData(initialState);
// //         onClose();
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Failed to create piece rate");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ================= UI ================= */

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
// //       <DialogTitle
// //         sx={{
// //           background: "linear-gradient(135deg, #164e63, #00B4D8)",
// //           color: "#fff",
// //           fontWeight: 600,
// //         }}
// //       >
// //         Add Piece Rate
// //       </DialogTitle>

// //       <DialogContent sx={{ p: 3 }}>
// //         <Box
// //           sx={{
// //             border: "1px solid #e0e0e0",
// //             borderRadius: 3,
// //             p: 4,
// //             margin: 1,
// //             backgroundColor: "#fafafa",
// //           }}
// //         >
// //           <Typography variant="h6" mb={2} fontWeight={600}>
// //             Piece Rate Details
// //           </Typography>

// //           <Divider sx={{ mb: 3 }} />

// //           <Grid container spacing={2}>
// //             <Grid item xs={12} md={6}>
// //               <TextField
// //                 label="Product Type"
// //                 name="productType"
// //                 fullWidth
// //                 value={formData.productType}
// //                 onChange={handleChange}
// //               />
// //             </Grid>

// //             <Grid item xs={12} md={6}>
// //               <TextField
// //                 label="Operation"
// //                 name="operation"
// //                 fullWidth
// //                 value={formData.operation}
// //                 onChange={handleChange}
// //               />
// //             </Grid>

// //             <Grid item xs={12} md={4}>
// //               <TextField
// //                 type="number"
// //                 label="Rate Per Unit"
// //                 name="ratePerUnit"
// //                 fullWidth
// //                 value={formData.ratePerUnit}
// //                 onChange={handleChange}
// //               />
// //             </Grid>

// //             <Grid item xs={12} md={4}>
// //               <TextField
// //                 select
// //                 label="Unit of Measure"
// //                 name="uom"
// //                 fullWidth
// //                 value={formData.uom}
// //                 onChange={handleChange}
// //               >
// //                 <MenuItem value="piece">Piece</MenuItem>
// //                 <MenuItem value="dozen">Dozen</MenuItem>
// //                 <MenuItem value="kg">Kg</MenuItem>
// //                 <MenuItem value="meter">Meter</MenuItem>
// //                 <MenuItem value="hour">Hour</MenuItem>
// //               </TextField>
// //             </Grid>

// //             <Grid item xs={12} md={4}>
// //               <TextField
// //                 select
// //                 label="Skill Level"
// //                 name="skillLevel"
// //                 fullWidth
// //                 value={formData.skillLevel}
// //                 onChange={handleChange}
// //               >
// //                 <MenuItem value="Unskilled">Unskilled</MenuItem>
// //                 <MenuItem value="Semi-Skilled">Semi-Skilled</MenuItem>
// //                 <MenuItem value="Skilled">Skilled</MenuItem>
// //                 <MenuItem value="Highly Skilled">Highly Skilled</MenuItem>
// //               </TextField>
// //             </Grid>

// //             {/* ✅ Department */}
// //             <Grid item xs={12}>
// //               <TextField
// //                 select
// //                 label="Department"
// //                 name="departmentId"
// //                 fullWidth
// //                 value={formData.departmentId || ""}
// //                 onChange={(e) =>
// //                   setFormData((prev) => ({
// //                     ...prev,
// //                     departmentId: String(e.target.value),
// //                   }))
// //                 }
// //                 SelectProps={{
// //                   MenuProps: { disablePortal: true },
// //                 }}
// //               >
// //                 {deptLoading && (
// //                   <MenuItem disabled>
// //                     <CircularProgress size={18} />
// //                   </MenuItem>
// //                 )}

// //                 {!deptLoading &&
// //                   departments.map((dept) => (
// //                     <MenuItem key={dept._id} value={String(dept._id)}>
// //                       {dept.DepartmentName}
// //                     </MenuItem>
// //                   ))}
// //               </TextField>
// //             </Grid>

// //             <Grid item xs={12} md={6}>
// //               <TextField
// //                 type="date"
// //                 label="Effective From"
// //                 name="effectiveFrom"
// //                 fullWidth
// //                 InputLabelProps={{ shrink: true }}
// //                 value={formData.effectiveFrom}
// //                 onChange={handleChange}
// //               />
// //             </Grid>

// //             <Grid item xs={12} md={6}>
// //               <TextField
// //                 type="date"
// //                 label="Effective To"
// //                 name="effectiveTo"
// //                 fullWidth
// //                 InputLabelProps={{ shrink: true }}
// //                 value={formData.effectiveTo}
// //                 onChange={handleChange}
// //               />
// //             </Grid>

// //             {error && (
// //               <Grid item xs={12}>
// //                 <Alert severity="error">{error}</Alert>
// //               </Grid>
// //             )}
// //           </Grid>
// //         </Box>
// //       </DialogContent>

// //       <DialogActions sx={{ px: 4, pb: 3 }}>
// //         <Button onClick={onClose}>Cancel</Button>

// //         <Button
// //           variant="contained"
// //           startIcon={<AddIcon />}
// //           onClick={handleSubmit}
// //           disabled={loading}
// //           sx={{
// //             background: "linear-gradient(135deg, #164e63, #00B4D8)",
// //             px: 4,
// //           }}
// //         >
// //           {loading ? "Saving..." : "Create Piece Rate"}
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default AddPieceRate;

// import React, { useState, useEffect } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, TextField, Stack, MenuItem,
//   Alert, CircularProgress, Typography, Box
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
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

// const AddPieceRate = ({ open, onClose, onAdd }) => {

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [deptLoading, setDeptLoading] = useState(false);

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

//       const res = await axios.post(
//         `${BASE_URL}/api/piece-rate-master`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       if (res.data.success) {
//         onAdd(res.data.data);
//         handleClose();
//       }

//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       productType: "",
//       operation: "",
//       ratePerUnit: "",
//       uom: "piece",
//       skillLevel: "Unskilled",
//       departmentId: "",
//       effectiveFrom: "",
//       effectiveTo: ""
//     });
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
//         px: 2.5, py: 1.5, mb:1.5
//       }}>
//         <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
//           Add Piece Rate
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
//             <Typography sx={labelStyle}>RATE PER UNIT *</Typography>
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
//               InputLabelProps={{ shrink: true }}
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
//           startIcon={!loading && <AddIcon />}
//           sx={{
//             bgcolor: COLORS.primary,
//             "&:hover": { bgcolor: COLORS.primaryDark }
//           }}
//         >
//           {loading ? "Saving..." : "Add"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddPieceRate;












import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, MenuItem,
  Alert, CircularProgress, Typography, Box,
  Autocomplete, Tooltip, IconButton, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import AddDepartments from "../departmentmaster/AddDepartments";


/* 🎨 SAME DESIGN SYSTEM */
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  primaryLight: "#E8F0F1",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8"
  },
  background: {
    white: "#FFFFFF",
    light: "#F8FFFC"
  },
  border: "#E3E8EF"
};

const AddPieceRate = ({ open, onClose, onAdd }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  // State for Add Department dialog
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);

  const [formData, setFormData] = useState({
    productType: "",
    operation: "",
    ratePerUnit: "",
    uom: "piece",
    departmentId: "",
    effectiveFrom: ""
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    if (open) fetchDepartments();
  }, [open]);

  const fetchDepartments = async () => {
    try {
      setDeptLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setDepartments(res.data.data || []);
      }
    } catch {
      setError("Failed to load departments");
    } finally {
      setDeptLoading(false);
    }
  };

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleDepartmentChange = (event, newValue) => {
    setSelectedDepartment(newValue);
    if (newValue) {
      setFormData(prev => ({ ...prev, departmentId: newValue._id }));
    } else {
      setFormData(prev => ({ ...prev, departmentId: "" }));
    }
    if (error) setError("");
  };

  const handleDepartmentAdded = (newDepartment) => {
    setDepartments(prev => [...prev, newDepartment]);
    // Auto-select the newly added department
    setSelectedDepartment(newDepartment);
    setFormData(prev => ({ ...prev, departmentId: newDepartment._id }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!formData.productType) return "Product Type required";
    if (!formData.operation) return "Operation required";
    if (!formData.ratePerUnit) return "Rate required";
    if (!formData.effectiveFrom) return "Date required";
    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const errMsg = validate();
    if (errMsg) return setError(errMsg);

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        ratePerUnit: Number(formData.ratePerUnit)
      };

      const res = await axios.post(
        `${BASE_URL}/api/piece-rate-master`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        onAdd(res.data.data);
        handleClose();
      } else {
        setError(res.data.message || "Failed to create piece rate");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      productType: "",
      operation: "",
      ratePerUnit: "",
      uom: "piece",
      departmentId: "",
      effectiveFrom: ""
    });
    setSelectedDepartment(null);
    setError("");
    onClose();
  };

  /* ================= COMMON STYLE ================= */
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      fontSize: "0.75rem",
      backgroundColor: COLORS.background.white,
      "&:hover fieldset": { borderColor: COLORS.primary },
      "&.Mui-focused fieldset": { borderColor: COLORS.primary, borderWidth: 1 }
    },
    "& .MuiInputBase-input": {
      py: 1,
      px: 1.5,
      fontSize: "0.75rem",
      color: COLORS.text.primary,
      "&::placeholder": {
        color: COLORS.text.tertiary
      }
    }
  };

  const labelStyle = {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: "0.5px",
    mb: 0.5
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden'
          }
        }}
      >
        {/* HEADER */}
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          px: 2.5, 
          py: 1.5, 
          mb: 1.5,
          bgcolor: COLORS.background.white
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: COLORS.text.primary }}>
            Add Piece Rate
          </Typography>
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          <Stack spacing={2}>

            {/* PRODUCT */}
            <Box>
              <Typography sx={labelStyle}>PRODUCT TYPE *</Typography>
              <TextField 
                name="productType" 
                fullWidth 
                size="small"
                value={formData.productType} 
                onChange={handleChange} 
                sx={inputStyle}
              />
            </Box>

            {/* OPERATION */}
            <Box>
              <Typography sx={labelStyle}>OPERATION *</Typography>
              <TextField 
                name="operation" 
                fullWidth 
                size="small"
                value={formData.operation} 
                onChange={handleChange} 
                sx={inputStyle}
              />
            </Box>

            {/* RATE */}
            <Box>
              <Typography sx={labelStyle}>RATE PER UNIT *</Typography>
              <TextField 
                type="number" 
                name="ratePerUnit" 
                fullWidth 
                size="small"
                value={formData.ratePerUnit} 
                onChange={handleChange} 
                sx={inputStyle}
              />
            </Box>

            {/* UOM */}
            <Box>
              <Typography sx={labelStyle}>UNIT</Typography>
              <TextField 
                select 
                name="uom" 
                fullWidth 
                size="small"
                value={formData.uom} 
                onChange={handleChange} 
                sx={inputStyle}
              >
                <MenuItem value="piece">Piece</MenuItem>
                <MenuItem value="kg">Kg</MenuItem>
              </TextField>
            </Box>

            {/* DEPARTMENT with Add Button */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={labelStyle}>DEPARTMENT</Typography>
                <Tooltip title="Add New Department">
                  <IconButton
                    size="small"
                    onClick={() => setAddDepartmentOpen(true)}
                    disabled={loading}
                    sx={{
                      color: COLORS.primary,
                      '&:hover': {
                        bgcolor: COLORS.primaryLight
                      }
                    }}
                  >
                    <AddIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Autocomplete
                fullWidth
                options={departments}
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                getOptionLabel={(option) => option?.DepartmentName || ''}
                isOptionEqualToValue={(option, value) => option._id === value?._id}
                loading={deptLoading}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search department..."
                    sx={inputStyle}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {deptLoading && <CircularProgress size={16} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography sx={{ fontSize: '0.75rem' }}>
                      {option.DepartmentName}
                    </Typography>
                  </li>
                )}
                ListboxProps={{
                  sx: {
                    maxHeight: 250,
                    '& .MuiAutocomplete-option': {
                      fontSize: '0.75rem',
                      py: 1,
                      px: 1.5
                    }
                  }
                }}
                noOptionsText="No departments found. Click + to add."
              />
            </Box>

            {/* EFFECTIVE FROM */}
            <Box>
              <Typography sx={labelStyle}>EFFECTIVE FROM *</Typography>
              <TextField 
                type="date" 
                name="effectiveFrom" 
                fullWidth 
                size="small"
                InputLabelProps={{ shrink: true }}
                value={formData.effectiveFrom} 
                onChange={handleChange} 
                sx={inputStyle}
              />
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 1.5, 
                  fontSize: '0.75rem',
                  '& .MuiAlert-icon': { fontSize: '1.25rem' }
                }}
              >
                {error}
              </Alert>
            )}

          </Stack>
        </DialogContent>

        {/* ACTIONS */}
        <DialogActions sx={{
          px: 2.5, 
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
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
            startIcon={!loading && <AddIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.primary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: COLORS.primaryDark },
              '&:disabled': {
                bgcolor: COLORS.border,
                color: COLORS.text.tertiary
              }
            }}
          >
            {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Department Dialog */}
      <AddDepartments
        open={addDepartmentOpen}
        onClose={() => setAddDepartmentOpen(false)}
        onAdd={handleDepartmentAdded}
      />
    </>
  );
};

export default AddPieceRate;