// // import React, { useEffect, useState } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogTitle,
// //   TextField,
// //   Button,
// //   Stack,
// //   MenuItem,
// //   CircularProgress,
// //   Snackbar,
// //   Alert
// // } from "@mui/material";
// // import axios from "axios";
// // import BASE_URL from "../../../config/Config";

// // const HEADER_GRADIENT =
// //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // const ApplyLeave = ({
// //   open,
// //   handleClose,
// //   onSuccess,
// //   employeeId,
// //   employeeDetails
// // }) => {
// //   const token = localStorage.getItem("token");

// //   const [leaveTypes, setLeaveTypes] = useState([]);
// //   const [form, setForm] = useState({
// //     leaveTypeId: "",
// //     fromDate: "",
// //     toDate: "",
// //     reason: "",
// //     contactNumber: "",
// //     addressDuringLeave: ""
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [errors, setErrors] = useState({});
// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success"
// //   });

// //   /* ================= FETCH LEAVE TYPES ================= */
// //   useEffect(() => {
// //     if (open) {
// //       fetchLeaveTypes();

// //       if (employeeDetails) {
// //         setForm(prev => ({
// //           ...prev,
// //           contactNumber: employeeDetails.PhoneNumber || "",
// //           addressDuringLeave: employeeDetails.Address || ""
// //         }));
// //       }
// //     }
// //   }, [open, employeeDetails]);

// //   const fetchLeaveTypes = async () => {
// //     try {
// //       const res = await axios.get(`${BASE_URL}/api/leavetypes`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });

// //       if (res.data.success) {
// //         const active = (res.data.data || []).filter(t => t.IsActive);
// //         setLeaveTypes(active);
// //       }
// //     } catch {
// //       showSnackbar("Failed to load leave types", "error");
// //     }
// //   };

// //   /* ================= VALIDATION ================= */
// //   const validate = () => {
// //     let temp = {};

// //     if (!form.leaveTypeId) temp.leaveTypeId = "Required";
// //     if (!form.fromDate) temp.fromDate = "Required";
// //     if (!form.toDate) temp.toDate = "Required";
    
// //     // Compare dates without timezone issues
// //     if (form.fromDate && form.toDate) {
// //       const fromDateParts = form.fromDate.split('-').map(Number);
// //       const toDateParts = form.toDate.split('-').map(Number);
      
// //       const fromDateObj = new Date(fromDateParts[0], fromDateParts[1] - 1, fromDateParts[2]);
// //       const toDateObj = new Date(toDateParts[0], toDateParts[1] - 1, toDateParts[2]);
      
// //       if (fromDateObj > toDateObj) {
// //         temp.toDate = "To Date must be after From Date";
// //       }
// //     }
    
// //     if (!form.reason) temp.reason = "Required";

// //     setErrors(temp);
// //     return Object.keys(temp).length === 0;
// //   };

// //   /* ================= SNACKBAR ================= */
// //   const showSnackbar = (message, severity = "success") => {
// //     setSnackbar({ open: true, message, severity });
// //   };

// //   const handleSnackbarClose = () => {
// //     setSnackbar(prev => ({ ...prev, open: false }));
// //   };

// //   /* ================= SUBMIT ================= */
// //   const handleSubmit = async () => {
// //     if (!validate()) return;

// //     try {
// //       setLoading(true);

// //       // FIXED: Send the toDate as the full day (end of day)
// //       // The API expects endDate to be the end of the selected day
// //       // So we need to add 1 day to make it inclusive of the full day
      
// //       let endDate = form.toDate;
      
// //       // If the API is using the pattern shown in response (end of previous day),
// //       // we need to ensure the toDate is properly set
// //       // Option 1: Send as is and let backend handle it
// //       // Option 2: Send the next day if backend expects exclusive end date
      
// //       // For now, let's log what we're sending
// //       console.log('Sending dates:', {
// //         fromDate: form.fromDate,
// //         toDate: form.toDate
// //       });

// //       const payload = {
// //         employeeId,
// //         leaveTypeId: form.leaveTypeId,
// //         startDate: form.fromDate,
// //         endDate: form.toDate, // Send as selected by user
// //         reason: form.reason.trim(),
// //         contactNumber:
// //           form.contactNumber || employeeDetails?.PhoneNumber || "",
// //         addressDuringLeave:
// //           form.addressDuringLeave || employeeDetails?.Address || ""
// //       };

// //       const res = await axios.post(
// //         `${BASE_URL}/api/leaves`,
// //         payload,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       if (res.data?.success) {
// //         showSnackbar("Leave application submitted successfully");

// //         setForm({
// //           leaveTypeId: "",
// //           fromDate: "",
// //           toDate: "",
// //           reason: "",
// //           contactNumber: employeeDetails?.PhoneNumber || "",
// //           addressDuringLeave: employeeDetails?.Address || ""
// //         });

// //         setTimeout(() => {
// //           if (onSuccess) onSuccess(true);
// //           handleClose();
// //         }, 800);
// //       } else {
// //         throw new Error(res.data?.message);
// //       }
// //     } catch (err) {
// //       const message =
// //         err.response?.data?.message ||
// //         "Failed to apply leave. Please check data.";

// //       showSnackbar(message, "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ================= HANDLE CLOSE ================= */
// //   const handleDialogClose = () => {
// //     setErrors({});
// //     handleClose();
// //   };

// //   /* ================= DATE SELECTION ================= */
// //   const today = new Date().toISOString().split("T")[0];

// //   // Helper function to format date for min attribute
// //   const getMinToDate = () => {
// //     if (form.fromDate) {
// //       return form.fromDate;
// //     }
// //     return today;
// //   };

// //   return (
// //     <>
// //       <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
// //         <DialogTitle
// //           sx={{
// //             background: HEADER_GRADIENT,
// //             color: "#fff",
// //             fontWeight: 600
// //           }}
// //         >
// //           Apply Leave{" "}
// //           {employeeDetails &&
// //             `- ${employeeDetails.FirstName} ${employeeDetails.LastName}`}
// //         </DialogTitle>

// //         <DialogContent sx={{ p: 3 }}>
// //           <Stack spacing={3} mt={1}>

// //             {/* LEAVE TYPE */}
// //             <TextField
// //               select
// //               label="Leave Type"
// //               value={form.leaveTypeId}
// //               onChange={e =>
// //                 setForm({ ...form, leaveTypeId: e.target.value })
// //               }
// //               error={!!errors.leaveTypeId}
// //               helperText={errors.leaveTypeId}
// //               fullWidth
// //               size="small"
// //               disabled={loading}
// //             >
// //               {leaveTypes.length ? (
// //                 leaveTypes.map(type => (
// //                   <MenuItem key={type._id} value={type._id}>
// //                     {type.Name}
// //                   </MenuItem>
// //                 ))
// //               ) : (
// //                 <MenuItem disabled>No leave types available</MenuItem>
// //               )}
// //             </TextField>

// //             {/* DATES */}
// //             <Stack direction="row" spacing={2}>
// //               <TextField
// //                 type="date"
// //                 label="From Date"
// //                 InputLabelProps={{ shrink: true }}
// //                 value={form.fromDate}
// //                 onChange={e =>
// //                   setForm({ ...form, fromDate: e.target.value, toDate: "" })
// //                 }
// //                 error={!!errors.fromDate}
// //                 helperText={errors.fromDate}
// //                 fullWidth
// //                 disabled={loading}
// //                 inputProps={{
// //                   min: today
// //                 }}
// //               />

// //               <TextField
// //                 type="date"
// //                 label="To Date"
// //                 InputLabelProps={{ shrink: true }}
// //                 value={form.toDate}
// //                 onChange={e =>
// //                   setForm({ ...form, toDate: e.target.value })
// //                 }
// //                 error={!!errors.toDate}
// //                 helperText={errors.toDate}
// //                 fullWidth
// //                 disabled={loading}
// //                 inputProps={{
// //                   min: getMinToDate()
// //                 }}
// //               />
// //             </Stack>

// //             {/* REASON */}
// //             <TextField
// //               label="Reason"
// //               multiline
// //               rows={2}
// //               value={form.reason}
// //               onChange={e =>
// //                 setForm({ ...form, reason: e.target.value })
// //               }
// //               error={!!errors.reason}
// //               helperText={errors.reason}
// //               fullWidth
// //               disabled={loading}
// //             />

// //             {/* CONTACT */}
// //             <TextField
// //               label="Contact Number"
// //               value={form.contactNumber}
// //               onChange={e =>
// //                 setForm({ ...form, contactNumber: e.target.value })
// //               }
// //               fullWidth
// //               size="small"
// //               disabled={loading}
// //             />

// //             {/* ADDRESS */}
// //             <TextField
// //               label="Address During Leave"
// //               value={form.addressDuringLeave}
// //               onChange={e =>
// //                 setForm({
// //                   ...form,
// //                   addressDuringLeave: e.target.value
// //                 })
// //               }
// //               fullWidth
// //               size="small"
// //               disabled={loading}
// //             />

// //             {/* BUTTONS */}
// //             <Stack direction="row" justifyContent="flex-end" spacing={2}>
// //               <Button
// //                 variant="outlined"
// //                 onClick={handleDialogClose}
// //                 disabled={loading}
// //               >
// //                 Cancel
// //               </Button>

// //               <Button
// //                 variant="contained"
// //                 onClick={handleSubmit}
// //                 disabled={loading || leaveTypes.length === 0}
// //                 sx={{
// //                   background: HEADER_GRADIENT,
// //                   "&:hover": { opacity: 0.9 }
// //                 }}
// //               >
// //                 {loading ? (
// //                   <CircularProgress size={20} sx={{ color: "#fff" }} />
// //                 ) : (
// //                   "Submit"
// //                 )}
// //               </Button>
// //             </Stack>
// //           </Stack>
// //         </DialogContent>
// //       </Dialog>

// //       {/* SNACKBAR */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={3000}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// //         onClose={handleSnackbarClose}
// //       >
// //         <Alert severity={snackbar.severity} variant="filled">
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </>
// //   );
// // };

// // export default ApplyLeave;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Stack,
//   MenuItem,
//   CircularProgress,
//   Alert,
//   Typography,
//   Box,
//   Autocomplete
// } from "@mui/material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// // Color constants matching AddProcess.jsx
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF',
//     lightMuted: 'rgba(255, 255, 255, 0.9)'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F'
//   },
//   border: '#E3E8EF',
//   status: {
//     success: '#9FE2BF',
//     warning: '#FEF3C7',
//     error: '#FEE2E2',
//     info: '#E0F2FE'
//   },
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     suspended: '#FEF3C7',
//     locked: '#FEE2E2'
//   }
// };

// const ApplyLeave = ({
//   open,
//   handleClose,
//   onSuccess,
//   employeeId,
//   employeeDetails
// }) => {
//   const token = localStorage.getItem("token");

//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [selectedLeaveType, setSelectedLeaveType] = useState(null);
//   const [form, setForm] = useState({
//     leaveTypeId: "",
//     fromDate: "",
//     toDate: "",
//     reason: "",
//     contactNumber: "",
//     addressDuringLeave: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [contactError, setContactError] = useState("");

//   /* ================= FETCH LEAVE TYPES ================= */
//   useEffect(() => {
//     if (open) {
//       fetchLeaveTypes();

//       if (employeeDetails) {
//         setForm(prev => ({
//           ...prev,
//           contactNumber: employeeDetails.PhoneNumber || "",
//           addressDuringLeave: employeeDetails.Address || ""
//         }));
//       }
//     }
//   }, [open, employeeDetails]);

//   const fetchLeaveTypes = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/leavetypes`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data.success) {
//         const active = (res.data.data || []).filter(t => t.IsActive);
//         setLeaveTypes(active);
//       }
//     } catch {
//       setError("Failed to load leave types");
//     }
//   };

//   /* ================= CONTACT NUMBER VALIDATION ================= */
//   const validateContactNumber = (number) => {
//     // Remove any non-digit characters for validation
//     const cleaned = number.toString().replace(/\D/g, '');
    
//     if (cleaned.length === 0) {
//       return true; // Empty is valid (optional field)
//     }
    
//     // Check if it's exactly 10 digits and contains only numbers
//     const isValid = /^\d{10}$/.test(cleaned);
    
//     if (!isValid) {
//       setContactError("Contact number must be exactly 10 digits");
//       return false;
//     } else {
//       setContactError("");
//       return true;
//     }
//   };

//   const handleContactChange = (e) => {
//     const value = e.target.value;
//     // Allow only numeric input
//     const numericValue = value.replace(/[^\d]/g, '');
    
//     // Limit to 10 digits
//     const limitedValue = numericValue.slice(0, 10);
    
//     setForm({ ...form, contactNumber: limitedValue });
//     validateContactNumber(limitedValue);
//   };

//   /* ================= VALIDATION ================= */
//   const validate = () => {
//     if (!form.leaveTypeId) {
//       setError("Leave Type is required");
//       return false;
//     }
//     if (!form.fromDate) {
//       setError("From Date is required");
//       return false;
//     }
//     if (!form.toDate) {
//       setError("To Date is required");
//       return false;
//     }
    
//     // Compare dates without timezone issues
//     const fromDateParts = form.fromDate.split('-').map(Number);
//     const toDateParts = form.toDate.split('-').map(Number);
    
//     const fromDateObj = new Date(fromDateParts[0], fromDateParts[1] - 1, fromDateParts[2]);
//     const toDateObj = new Date(toDateParts[0], toDateParts[1] - 1, toDateParts[2]);
    
//     if (fromDateObj > toDateObj) {
//       setError("To Date must be after From Date");
//       return false;
//     }
    
//     if (!form.reason.trim()) {
//       setError("Reason is required");
//       return false;
//     }

//     // Validate contact number if provided
//     if (form.contactNumber && !validateContactNumber(form.contactNumber)) {
//       setError("Please enter a valid 10-digit contact number");
//       return false;
//     }

//     return true;
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     setLoading(true);
//     setError("");

//     try {
//       const payload = {
//         employeeId,
//         leaveTypeId: form.leaveTypeId,
//         startDate: form.fromDate,
//         endDate: form.toDate,
//         reason: form.reason.trim(),
//         contactNumber: form.contactNumber || employeeDetails?.PhoneNumber || "",
//         addressDuringLeave: form.addressDuringLeave || employeeDetails?.Address || ""
//       };

//       const res = await axios.post(
//         `${BASE_URL}/api/leaves`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data?.success) {
//         if (onSuccess) onSuccess(true);
//         resetForm();
//         handleClose();
//       } else {
//         setError(res.data?.message || "Failed to apply leave");
//       }
//     } catch (err) {
//       console.error("Error applying leave:", err);
//       const message = err.response?.data?.message || "Failed to apply leave. Please try again.";
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       leaveTypeId: "",
//       fromDate: "",
//       toDate: "",
//       reason: "",
//       contactNumber: employeeDetails?.PhoneNumber || "",
//       addressDuringLeave: employeeDetails?.Address || ""
//     });
//     setSelectedLeaveType(null);
//     setError("");
//     setContactError("");
//   };

//   const handleDialogClose = () => {
//     resetForm();
//     handleClose();
//   };

//   const handleLeaveTypeChange = (event, newValue) => {
//     setSelectedLeaveType(newValue);
//     setForm(prev => ({
//       ...prev,
//       leaveTypeId: newValue?._id || ""
//     }));
//   };

//   /* ================= DATE SELECTION ================= */
//   const today = new Date().toISOString().split("T")[0];

//   const getMinToDate = () => {
//     if (form.fromDate) {
//       return form.fromDate;
//     }
//     return today;
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleDialogClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         mb: 1.5,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Typography
//           sx={{
//             fontSize: '1.2rem',
//             fontWeight: 700,
//             color: COLORS.text.primary
//           }}
//         >
//           Apply Leave {employeeDetails && `- ${employeeDetails.FirstName} ${employeeDetails.LastName}`}
//         </Typography>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5 }}>
//         <Stack spacing={2}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
//             {/* Leave Type Field - Using Autocomplete */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   LEAVE TYPE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <Autocomplete
//                   fullWidth
//                   options={leaveTypes}
//                   getOptionLabel={(option) => option.Name || ""}
//                   value={selectedLeaveType}
//                   onChange={handleLeaveTypeChange}
//                   disabled={loading}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Select leave type"
//                       required
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary
//                         }
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option) => (
//                     <li {...props}>
//                       <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
//                         {option.Name}
//                       </Typography>
//                     </li>
//                   )}
//                   ListboxProps={{
//                     sx: {
//                       '& .MuiAutocomplete-option': {
//                         fontSize: '0.75rem',
//                         py: 1,
//                         px: 1.5
//                       }
//                     }
//                   }}
//                   noOptionsText="No leave types available"
//                 />
//               </Box>
//             </Box>

//             {/* From Date Field */}
//             <Box sx={{ gridColumn: 'span 1' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   FROM DATE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   type="date"
//                   fullWidth
//                   value={form.fromDate}
//                   onChange={(e) =>
//                     setForm({ ...form, fromDate: e.target.value, toDate: "" })
//                   }
//                   disabled={loading}
//                   size="small"
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                   inputProps={{
//                     min: today
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* To Date Field */}
//             <Box sx={{ gridColumn: 'span 1' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   TO DATE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   type="date"
//                   fullWidth
//                   value={form.toDate}
//                   onChange={(e) =>
//                     setForm({ ...form, toDate: e.target.value })
//                   }
//                   disabled={loading}
//                   size="small"
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                   inputProps={{
//                     min: getMinToDate()
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Reason Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   REASON <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={3}
//                   value={form.reason}
//                   onChange={(e) =>
//                     setForm({ ...form, reason: e.target.value })
//                   }
//                   disabled={loading}
//                   placeholder="Please provide reason for leave"
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Contact Number Field with Validation */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   CONTACT NUMBER <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   value={form.contactNumber}
//                   onChange={handleContactChange}
//                   disabled={loading}
//                   placeholder="Enter 10-digit mobile number"
//                   size="small"
//                   variant="outlined"
//                   error={!!contactError}
//                   helperText={contactError || "Required field - 10 digits only"}
//                   inputProps={{
//                     maxLength: 10,
//                     pattern: "[0-9]*"
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Address During Leave Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   ADDRESS DURING LEAVE
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={2}
//                   value={form.addressDuringLeave}
//                   onChange={(e) =>
//                     setForm({ ...form, addressDuringLeave: e.target.value })
//                   }
//                   disabled={loading}
//                   placeholder="Address where you can be reached during leave"
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Leave Information Preview */}
//             {(form.fromDate || form.toDate || selectedLeaveType) && (
//               <Box sx={{ 
//                 gridColumn: 'span 2',
//                 p: 2, 
//                 bgcolor: COLORS.primaryLight, 
//                 borderRadius: 1.5,
//                 border: `1px solid ${COLORS.primary}`,
//                 mt: 1
//               }}>
//                 <Typography 
//                   variant="subtitle2" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: COLORS.primaryDark, 
//                     mb: 1.5,
//                     fontSize: '0.8rem'
//                   }}
//                 >
//                   Leave Information
//                 </Typography>
//                 <Stack spacing={1}>
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Leave Type:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {selectedLeaveType?.Name || 'Not selected'}
//                     </Typography>
//                   </Stack>
                  
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Leave Period:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {form.fromDate && form.toDate 
//                         ? `${form.fromDate} to ${form.toDate}`
//                         : form.fromDate 
//                           ? `From ${form.fromDate}`
//                           : form.toDate 
//                             ? `Until ${form.toDate}`
//                             : 'Not specified'}
//                     </Typography>
//                   </Stack>
                  
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Days:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {form.fromDate && form.toDate ? (
//                         (() => {
//                           const from = new Date(form.fromDate);
//                           const to = new Date(form.toDate);
//                           const diffTime = Math.abs(to - from);
//                           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//                           return `${diffDays} day(s)`;
//                         })()
//                       ) : 'Not calculated'}
//                     </Typography>
//                   </Stack>

//                   {form.contactNumber && !contactError && (
//                     <Stack direction="row" justifyContent="space-between">
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Contact Number:</Typography>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                         {form.contactNumber}
//                       </Typography>
//                     </Stack>
//                   )}
//                 </Stack>
//               </Box>
//             )}
//           </Box>
          
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 borderRadius: 1.5,
//                 mt: 1,
//                 '& .MuiAlert-icon': {
//                   fontSize: '1.25rem',
//                   alignItems: 'center'
//                 },
//                 fontSize: '0.75rem',
//                 py: 0.5
//               }}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'flex-end',
//         gap: 1
//       }}>
//         <Button
//           onClick={handleDialogClose}
//           disabled={loading}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: COLORS.primary,
//               bgcolor: `${COLORS.primary}10`
//             }
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || !form.leaveTypeId || !form.fromDate || !form.toDate || !form.reason || !!contactError || !form.contactNumber}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             bgcolor: COLORS.primary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//             '&:hover': {
//               bgcolor: COLORS.primaryDark,
//             },
//             '&:disabled': {
//               bgcolor: COLORS.border,
//               color: COLORS.text.tertiary
//             }
//           }}
//         >
//           {loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : 'Submit'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ApplyLeave;








import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Autocomplete,
  Tooltip,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import AddLeaveType from "../leavetypemaster/AddLeaveTypes";


// Color constants matching AddProcess.jsx
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

const ApplyLeave = ({
  open,
  handleClose,
  onSuccess,
  employeeId,
  employeeDetails
}) => {
  const token = localStorage.getItem("token");

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  
  // State for Add Leave Type dialog
  const [addLeaveTypeOpen, setAddLeaveTypeOpen] = useState(false);
  
  const [form, setForm] = useState({
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    reason: "",
    contactNumber: "",
    addressDuringLeave: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contactError, setContactError] = useState("");

  /* ================= FETCH LEAVE TYPES ================= */
  useEffect(() => {
    if (open) {
      fetchLeaveTypes();

      if (employeeDetails) {
        setForm(prev => ({
          ...prev,
          contactNumber: employeeDetails.PhoneNumber || "",
          addressDuringLeave: employeeDetails.Address || ""
        }));
      }
    }
  }, [open, employeeDetails]);

  const fetchLeaveTypes = async () => {
    try {
      setLoadingLeaveTypes(true);
      const res = await axios.get(`${BASE_URL}/api/leavetypes`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const active = (res.data.data || []).filter(t => t.IsActive !== false);
        setLeaveTypes(active);
      }
    } catch {
      setError("Failed to load leave types");
    } finally {
      setLoadingLeaveTypes(false);
    }
  };

  /* ================= CONTACT NUMBER VALIDATION ================= */
  const validateContactNumber = (number) => {
    // Remove any non-digit characters for validation
    const cleaned = number.toString().replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      return true; // Empty is valid (optional field)
    }
    
    // Check if it's exactly 10 digits and contains only numbers
    const isValid = /^\d{10}$/.test(cleaned);
    
    if (!isValid) {
      setContactError("Contact number must be exactly 10 digits");
      return false;
    } else {
      setContactError("");
      return true;
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    // Allow only numeric input
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Limit to 10 digits
    const limitedValue = numericValue.slice(0, 10);
    
    setForm({ ...form, contactNumber: limitedValue });
    validateContactNumber(limitedValue);
  };

  /* ================= LEAVE TYPE HANDLERS ================= */
  const handleLeaveTypeChange = (event, newValue) => {
    setSelectedLeaveType(newValue);
    setForm(prev => ({
      ...prev,
      leaveTypeId: newValue?._id || ""
    }));
    setError("");
  };

  const handleLeaveTypeAdded = (newLeaveType) => {
    setLeaveTypes(prev => [...prev, newLeaveType]);
    // Auto-select the newly added leave type
    setSelectedLeaveType(newLeaveType);
    setForm(prev => ({
      ...prev,
      leaveTypeId: newLeaveType._id
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.leaveTypeId) {
      setError("Leave Type is required");
      return false;
    }
    if (!form.fromDate) {
      setError("From Date is required");
      return false;
    }
    if (!form.toDate) {
      setError("To Date is required");
      return false;
    }
    
    // Compare dates without timezone issues
    const fromDateParts = form.fromDate.split('-').map(Number);
    const toDateParts = form.toDate.split('-').map(Number);
    
    const fromDateObj = new Date(fromDateParts[0], fromDateParts[1] - 1, fromDateParts[2]);
    const toDateObj = new Date(toDateParts[0], toDateParts[1] - 1, toDateParts[2]);
    
    if (fromDateObj > toDateObj) {
      setError("To Date must be after From Date");
      return false;
    }
    
    if (!form.reason.trim()) {
      setError("Reason is required");
      return false;
    }

    // Validate contact number if provided
    if (form.contactNumber && !validateContactNumber(form.contactNumber)) {
      setError("Please enter a valid 10-digit contact number");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        employeeId,
        leaveTypeId: form.leaveTypeId,
        startDate: form.fromDate,
        endDate: form.toDate,
        reason: form.reason.trim(),
        contactNumber: form.contactNumber || employeeDetails?.PhoneNumber || "",
        addressDuringLeave: form.addressDuringLeave || employeeDetails?.Address || ""
      };

      const res = await axios.post(
        `${BASE_URL}/api/leaves`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        if (onSuccess) onSuccess(true);
        resetForm();
        handleClose();
      } else {
        setError(res.data?.message || "Failed to apply leave");
      }
    } catch (err) {
      console.error("Error applying leave:", err);
      const message = err.response?.data?.message || "Failed to apply leave. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      leaveTypeId: "",
      fromDate: "",
      toDate: "",
      reason: "",
      contactNumber: employeeDetails?.PhoneNumber || "",
      addressDuringLeave: employeeDetails?.Address || ""
    });
    setSelectedLeaveType(null);
    setError("");
    setContactError("");
  };

  const handleDialogClose = () => {
    resetForm();
    handleClose();
  };

  /* ================= DATE SELECTION ================= */
  const today = new Date().toISOString().split("T")[0];

  const getMinToDate = () => {
    if (form.fromDate) {
      return form.fromDate;
    }
    return today;
  };

  // Input styles
  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      backgroundColor: COLORS.background.white,
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
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleDialogClose}
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
            Apply Leave {employeeDetails && `- ${employeeDetails.FirstName} ${employeeDetails.LastName}`}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {/* Leave Type Field with Add Button */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={labelStyle}>
                      LEAVE TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Tooltip title="Add New Leave Type">
                      <IconButton
                        size="small"
                        onClick={() => setAddLeaveTypeOpen(true)}
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
                    options={leaveTypes}
                    getOptionLabel={(option) => option.Name || ""}
                    value={selectedLeaveType}
                    onChange={handleLeaveTypeChange}
                    loading={loadingLeaveTypes}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Search leave type..."
                        required
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
                              {loadingLeaveTypes && <CircularProgress size={16} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {option.Name}
                          </Typography>
                          {option.MaxDaysPerYear && (
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Max {option.MaxDaysPerYear} days/year
                            </Typography>
                          )}
                        </Box>
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
                    noOptionsText="No leave types available. Click + to add."
                  />
                </Box>
              </Box>

              {/* From Date Field */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    FROM DATE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    value={form.fromDate}
                    onChange={(e) =>
                      setForm({ ...form, fromDate: e.target.value, toDate: "" })
                    }
                    disabled={loading}
                    size="small"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: today
                    }}
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* To Date Field */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    TO DATE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    value={form.toDate}
                    onChange={(e) =>
                      setForm({ ...form, toDate: e.target.value })
                    }
                    disabled={loading}
                    size="small"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: getMinToDate()
                    }}
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* Reason Field */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    REASON <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    disabled={loading}
                    placeholder="Please provide reason for leave"
                    size="small"
                    variant="outlined"
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* Contact Number Field with Validation */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    CONTACT NUMBER <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    value={form.contactNumber}
                    onChange={handleContactChange}
                    disabled={loading}
                    placeholder="Enter 10-digit mobile number"
                    size="small"
                    variant="outlined"
                    error={!!contactError}
                    helperText={contactError || "Required field - 10 digits only"}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*"
                    }}
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* Address During Leave Field */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    ADDRESS DURING LEAVE
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={form.addressDuringLeave}
                    onChange={(e) =>
                      setForm({ ...form, addressDuringLeave: e.target.value })
                    }
                    disabled={loading}
                    placeholder="Address where you can be reached during leave"
                    size="small"
                    variant="outlined"
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* Leave Information Preview */}
              {(form.fromDate || form.toDate || selectedLeaveType) && (
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
                    Leave Information
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Leave Type:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {selectedLeaveType?.Name || 'Not selected'}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Leave Period:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {form.fromDate && form.toDate 
                          ? `${form.fromDate} to ${form.toDate}`
                          : form.fromDate 
                            ? `From ${form.fromDate}`
                            : form.toDate 
                              ? `Until ${form.toDate}`
                              : 'Not specified'}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Days:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {form.fromDate && form.toDate ? (
                          (() => {
                            const from = new Date(form.fromDate);
                            const to = new Date(form.toDate);
                            const diffTime = Math.abs(to - from);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                            return `${diffDays} day(s)`;
                          })()
                        ) : 'Not calculated'}
                      </Typography>
                    </Stack>

                    {form.contactNumber && !contactError && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Contact Number:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {form.contactNumber}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              )}
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
            onClick={handleDialogClose}
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
            disabled={loading || !form.leaveTypeId || !form.fromDate || !form.toDate || !form.reason || !!contactError || !form.contactNumber}
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
            {loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Leave Type Dialog */}
      <AddLeaveType
        open={addLeaveTypeOpen}
        onClose={() => setAddLeaveTypeOpen(false)}
        onAdd={handleLeaveTypeAdded}
      />
    </>
  );
};

export default ApplyLeave;