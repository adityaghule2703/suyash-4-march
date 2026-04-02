// // import React, { useEffect, useState } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   Stack,
// //   Alert,
// //   MenuItem,
// //   Autocomplete,
// //   CircularProgress,
// // } from "@mui/material";
// // import { Add as AddIcon } from "@mui/icons-material";
// // import axios from "axios";
// // import BASE_URL from "../../../config/Config";

// // const AddRegularization = ({ open, onClose, onAdd }) => {
// //   const [formData, setFormData] = useState({
// //     employeeId: "",
// //     date: "",
// //     requestType: "missed-punch",
// //     requestedIn: "",
// //     requestedOut: "",
// //     reason: "",
// //     supportingDocument: "",
// //   });

// //   const [employees, setEmployees] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   /* ==============================
// //      FETCH EMPLOYEES
// //   ============================== */
// //   useEffect(() => {
// //     if (open) {
// //       fetchEmployees();
// //     }
// //   }, [open]);

// //   const fetchEmployees = async () => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(`${BASE_URL}/api/employees`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (res.data.success) {
// //         setEmployees(res.data.data || []);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setError("Failed to load employees");
// //     }
// //   };

// //   /* ==============================
// //      HANDLE INPUT CHANGE
// //   ============================== */
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   };

// //   /* ==============================
// //      VALIDATION
// //   ============================== */
// //   const validate = () => {
// //     if (!formData.employeeId) return "Employee is required";
// //     if (!formData.date) return "Date is required";
// //     if (!formData.reason.trim()) return "Reason is required";
// //     return null;
// //   };

// //   /* ==============================
// //      SUBMIT
// //   ============================== */
// //   const handleSubmit = async () => {
// //     const validationError = validate();
// //     if (validationError) {
// //       setError(validationError);
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const token = localStorage.getItem("token");

// //       const payload = {
// //         employeeId: formData.employeeId,
// //         date: formData.date,
// //         requestType: formData.requestType,
// //         requestedIn: formData.requestedIn
// //           ? new Date(formData.requestedIn).toISOString()
// //           : null,
// //         requestedOut: formData.requestedOut
// //           ? new Date(formData.requestedOut).toISOString()
// //           : null,
// //         reason: formData.reason,
// //         supportingDocument: formData.supportingDocument || "",
// //       };

// //       const response = await axios.post(
// //         `${BASE_URL}/api/regularization`,
// //         payload,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         },
// //       );

// //       if (response.data.success) {
// //         onAdd(response.data.data);
// //         handleClose();
// //       } else {
// //         setError(response.data.message || "Failed to submit request");
// //       }
// //     } catch (err) {
// //       console.error(err.response?.data);
// //       setError(
// //         err.response?.data?.message ||
// //           "Failed to submit regularization request",
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ==============================
// //      RESET
// //   ============================== */
// //   const resetForm = () => {
// //     setFormData({
// //       employeeId: "",
// //       date: "",
// //       requestType: "missed-punch",
// //       requestedIn: "",
// //       requestedOut: "",
// //       reason: "",
// //       supportingDocument: "",
// //     });
// //     setSelectedEmployee(null);
// //     setError("");
// //   };

// //   const handleClose = () => {
// //     resetForm();
// //     onClose();
// //   };

// //   /* ==============================
// //      UI
// //   ============================== */
// //   return (
// //     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
// //       <DialogTitle
// //         sx={{
// //           background: "linear-gradient(135deg, #164e63, #00B4D8)",
// //           color: "#fff",
// //           fontWeight: 600,
// //         }}
// //       >
// //         Create Regularization Request
// //       </DialogTitle>

// //       <DialogContent sx={{ pt: 3, margin: 1 }}>
// //         <Stack spacing={3}>
// //           {error && <Alert severity="error">{error}</Alert>}

// //           {/* Employee Dropdown */}
// //           <Autocomplete
// //             options={employees}
// //             value={selectedEmployee}
// //             onChange={(event, newValue) => {
// //               setSelectedEmployee(newValue);
// //               setFormData((prev) => ({
// //                 ...prev,
// //                 employeeId: newValue?._id || "",
// //               }));
// //             }}
// //             getOptionLabel={(option) => {
// //               if (!option) return "";
// //               return `${option.FirstName || ""} ${option.LastName || ""} (${option.EmployeeID || ""})`;
// //             }}
// //             isOptionEqualToValue={(option, value) => option._id === value?._id}
// //             renderInput={(params) => (
// //               <TextField {...params} label="Employee *" required />
// //             )}
// //           />

// //           <TextField
// //             type="date"
// //             label="Date *"
// //             name="date"
// //             value={formData.date}
// //             onChange={handleChange}
// //             InputLabelProps={{ shrink: true }}
// //             fullWidth
// //           />

// //           <TextField
// //             select
// //             label="Request Type"
// //             name="requestType"
// //             value={formData.requestType}
// //             onChange={handleChange}
// //             fullWidth
// //           >
// //             <MenuItem value="missed-punch">Missed Punch</MenuItem>
// //             <MenuItem value="correct-time">Correct Time</MenuItem>
// //             <MenuItem value="work-from-home">Work From Home</MenuItem>
// //             <MenuItem value="on-duty">On Duty</MenuItem>
// //           </TextField>

// //           <TextField
// //             type="datetime-local"
// //             label="Requested In"
// //             name="requestedIn"
// //             value={formData.requestedIn}
// //             onChange={handleChange}
// //             InputLabelProps={{ shrink: true }}
// //             fullWidth
// //           />

// //           <TextField
// //             type="datetime-local"
// //             label="Requested Out"
// //             name="requestedOut"
// //             value={formData.requestedOut}
// //             onChange={handleChange}
// //             InputLabelProps={{ shrink: true }}
// //             fullWidth
// //           />

// //           <TextField
// //             multiline
// //             rows={3}
// //             label="Reason *"
// //             name="reason"
// //             value={formData.reason}
// //             onChange={handleChange}
// //             fullWidth
// //           />

// //           <TextField
// //             label="Supporting Document URL"
// //             name="supportingDocument"
// //             value={formData.supportingDocument}
// //             onChange={handleChange}
// //             fullWidth
// //           />
// //         </Stack>
// //       </DialogContent>

// //       <DialogActions sx={{ p: 3 }}>
// //         <Button onClick={handleClose} disabled={loading}>
// //           Cancel
// //         </Button>

// //         <Button
// //           variant="contained"
// //           onClick={handleSubmit}
// //           disabled={loading}
// //           startIcon={!loading && <AddIcon />}
// //           sx={{
// //             background: "linear-gradient(135deg, #164e63, #00B4D8)",
// //             px: 4,
// //           }}
// //         >
// //           {loading ? <CircularProgress size={20} /> : "Submit Request"}
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default AddRegularization;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, TextField, Stack, Alert, Typography,
//   CircularProgress, Box, MenuItem, Autocomplete
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// // 🎨 SAME DESIGN SYSTEM (EXACT ADD TAX)
// const COLORS = {
//   primary: "#063C3F",
//   primaryDark: "#05292B",
//   text: {
//     primary: "#151C26",
//     secondary: "#4B5568",
//     tertiary: "#94A3B8"
//   },
//   background: {
//     white: "#FFFFFF"
//   },
//   border: "#E3E8EF"
// };

// const AddRegularization = ({ open, onClose, onAdd }) => {

//   const [formData, setFormData] = useState({
//     employeeId: "",
//     date: "",
//     requestType: "missed-punch",
//     requestedIn: "",
//     requestedOut: "",
//     reason: "",
//     supportingDocument: ""
//   });

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   /* ================= FETCH EMPLOYEES ================= */
//   useEffect(() => {
//     if (open) fetchEmployees();
//   }, [open]);

//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data.success) {
//         setEmployees(res.data.data || []);
//       }
//     } catch {
//       setError("Failed to load employees");
//     }
//   };

//   /* ================= HANDLE CHANGE ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   /* ================= VALIDATION ================= */
//   const validate = () => {
//     if (!formData.employeeId) return "Employee is required";
//     if (!formData.date) return "Date is required";
//     if (!formData.reason.trim()) return "Reason is required";
//     return null;
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     const errMsg = validate();
//     if (errMsg) {
//       setError(errMsg);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const payload = {
//         ...formData,
//         requestedIn: formData.requestedIn
//           ? new Date(formData.requestedIn).toISOString()
//           : null,
//         requestedOut: formData.requestedOut
//           ? new Date(formData.requestedOut).toISOString()
//           : null
//       };

//       const res = await axios.post(
//         `${BASE_URL}/api/regularization`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       if (res.data.success) {
//         onAdd(res.data.data);
//         handleClose();
//       } else {
//         setError("Failed to submit request");
//       }

//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= RESET ================= */
//   const resetForm = () => {
//     setFormData({
//       employeeId: "",
//       date: "",
//       requestType: "missed-punch",
//       requestedIn: "",
//       requestedOut: "",
//       reason: "",
//       supportingDocument: ""
//     });
//     setSelectedEmployee(null);
//     setError("");
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   /* ================= COMMON INPUT STYLE ================= */
//   const inputStyle = {
//     "& .MuiOutlinedInput-root": {
//       borderRadius: 1.5,
//       fontSize: "0.75rem",
//       "&:hover fieldset": { borderColor: COLORS.primary },
//       "&.Mui-focused fieldset": {
//         borderColor: COLORS.primary,
//         borderWidth: 1
//       }
//     },
//     "& .MuiInputBase-input": {
//       py: 1,
//       px: 1.5,
//       fontSize: "0.75rem",
//       color: COLORS.text.primary,
//       "&::placeholder": {
//         color: COLORS.text.tertiary
//       }
//     }
//   };

//   const labelStyle = {
//     fontSize: "0.7rem",
//     fontWeight: 600,
//     color: COLORS.text.secondary,
//     letterSpacing: "0.5px"
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           border: `1px solid ${COLORS.border}`,
//           overflow: "hidden"
//         }
//       }}
//     >
//       {/* HEADER */}
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         mb: 1.5,
//       }}>
//         <Typography sx={{
//           fontSize: "1.2rem",
//           fontWeight: 700,
//           color: COLORS.text.primary
//         }}>
//           Add Request
//         </Typography>
//       </DialogTitle>

//       {/* CONTENT */}
//       <DialogContent sx={{ p: 2.5 }}>
//         <Stack spacing={2}>

//           {/* EMPLOYEE */}
//           <Box>
//             <Typography sx={labelStyle}>
//               EMPLOYEE <span style={{ color: "#EF4444" }}>*</span>
//             </Typography>

//             <Autocomplete
//               options={employees}
//               value={selectedEmployee}
//               onChange={(e, val) => {
//                 setSelectedEmployee(val);
//                 setFormData(prev => ({
//                   ...prev,
//                   employeeId: val?._id || ""
//                 }));
//               }}
//               getOptionLabel={(o) =>
//                 `${o?.FirstName || ""} ${o?.LastName || ""}`
//               }
//               renderInput={(params) => (
//                 <TextField {...params} placeholder="Select employee" size="small" sx={inputStyle}/>
//               )}
//             />
//           </Box>

//           {/* DATE */}
//           <Box>
//             <Typography sx={labelStyle}>
//               DATE <span style={{ color: "#EF4444" }}>*</span>
//             </Typography>
//             <TextField
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               InputLabelProps={{ shrink: true }}
//               sx={inputStyle}
//             />
//           </Box>

//           {/* REQUEST TYPE */}
//           <Box>
//             <Typography sx={labelStyle}>REQUEST TYPE</Typography>
//             <TextField
//               select
//               name="requestType"
//               value={formData.requestType}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               sx={inputStyle}
//             >
//               <MenuItem value="missed-punch">Missed Punch</MenuItem>
//               <MenuItem value="correct-time">Correct Time</MenuItem>
//               <MenuItem value="work-from-home">Work From Home</MenuItem>
//               <MenuItem value="on-duty">On Duty</MenuItem>
//             </TextField>
//           </Box>

//           {/* IN / OUT */}
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <TextField
//               type="datetime-local"
//               label="In Time"
//               name="requestedIn"
//               value={formData.requestedIn}
//               onChange={handleChange}
//               size="small"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               sx={inputStyle}
//             />
//             <TextField
//               type="datetime-local"
//               label="Out Time"
//               name="requestedOut"
//               value={formData.requestedOut}
//               onChange={handleChange}
//               size="small"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               sx={inputStyle}
//             />
//           </Box>

//           {/* REASON */}
//           <Box>
//             <Typography sx={labelStyle}>
//               REASON <span style={{ color: "#EF4444" }}>*</span>
//             </Typography>
//             <TextField
//               multiline
//               rows={3}
//               name="reason"
//               value={formData.reason}
//               onChange={handleChange}
//               placeholder="Enter reason..."
//               fullWidth
//               size="small"
//               sx={inputStyle}
//             />
//           </Box>

//           {/* DOC */}
//           <Box>
//             <Typography sx={labelStyle}>SUPPORTING DOCUMENT</Typography>
//             <TextField
//               name="supportingDocument"
//               value={formData.supportingDocument}
//               onChange={handleChange}
//               placeholder="Enter document URL"
//               fullWidth
//               size="small"
//               sx={inputStyle}
//             />
//           </Box>

//           {error && (
//             <Alert sx={{ fontSize: "0.75rem" }} severity="error">
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       {/* ACTIONS */}
//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         gap: 1
//       }}>
//         <Button
//           onClick={handleClose}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             fontSize: "0.7rem"
//           }}
//         >
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={!loading && <AddIcon sx={{ fontSize: "1rem" }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             bgcolor: COLORS.primary,
//             fontSize: "0.7rem",
//             "&:hover": { bgcolor: COLORS.primaryDark }
//           }}
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddRegularization;







import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Alert, Typography,
  CircularProgress, Box, MenuItem, Autocomplete,
  Tooltip, IconButton, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import AddEmployees from "../employeemaster/AddEmployees";


// 🎨 SAME DESIGN SYSTEM (EXACT ADD TAX)
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

const AddRegularization = ({ open, onClose, onAdd }) => {

  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    requestType: "missed-punch",
    requestedIn: "",
    requestedOut: "",
    reason: "",
    supportingDocument: ""
  });

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [error, setError] = useState("");
  
  // State for Add Employee dialog
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    if (open) fetchEmployees();
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setEmployees(res.data.data || []);
      }
    } catch {
      setError("Failed to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleEmployeeChange = (event, newValue) => {
    setSelectedEmployee(newValue);
    if (newValue) {
      setFormData(prev => ({ ...prev, employeeId: newValue._id }));
    } else {
      setFormData(prev => ({ ...prev, employeeId: "" }));
    }
    if (error) setError("");
  };

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    // Auto-select the newly added employee
    setSelectedEmployee(newEmployee);
    setFormData(prev => ({ ...prev, employeeId: newEmployee._id }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!formData.employeeId) return "Employee is required";
    if (!formData.date) return "Date is required";
    if (!formData.reason.trim()) return "Reason is required";
    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        requestedIn: formData.requestedIn
          ? new Date(formData.requestedIn).toISOString()
          : null,
        requestedOut: formData.requestedOut
          ? new Date(formData.requestedOut).toISOString()
          : null
      };

      const res = await axios.post(
        `${BASE_URL}/api/regularization`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        onAdd(res.data.data);
        handleClose();
      } else {
        setError("Failed to submit request");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setFormData({
      employeeId: "",
      date: "",
      requestType: "missed-punch",
      requestedIn: "",
      requestedOut: "",
      reason: "",
      supportingDocument: ""
    });
    setSelectedEmployee(null);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get employee display name
  const getEmployeeName = (employee) => {
    if (!employee) return '';
    const firstName = employee.FirstName || '';
    const lastName = employee.LastName || '';
    const empId = employee.EmployeeID || '';
    return `${firstName} ${lastName}${empId ? ` (${empId})` : ''}`.trim();
  };

  /* ================= COMMON INPUT STYLE ================= */
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      fontSize: "0.75rem",
      backgroundColor: COLORS.background.white,
      "&:hover fieldset": { borderColor: COLORS.primary },
      "&.Mui-focused fieldset": {
        borderColor: COLORS.primary,
        borderWidth: 1
      }
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
            overflow: "hidden"
          }
        }}
      >
        {/* HEADER */}
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          mb: 1.5,
          bgcolor: COLORS.background.white
        }}>
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Add Request
          </Typography>
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          <Stack spacing={2}>

            {/* EMPLOYEE with Add Button */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={labelStyle}>
                  EMPLOYEE <span style={{ color: "#EF4444" }}>*</span>
                </Typography>
                <Tooltip title="Add New Employee">
                  <IconButton
                    size="small"
                    onClick={() => setAddEmployeeOpen(true)}
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
                options={employees}
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                getOptionLabel={(option) => getEmployeeName(option)}
                isOptionEqualToValue={(option, value) => option._id === value?._id}
                loading={loadingEmployees}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search employee by name or ID..."
                    size="small"
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
                          {loadingEmployees && <CircularProgress size={16} />}
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
                        {option.FirstName} {option.LastName}
                      </Typography>
                      {option.EmployeeID && (
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          ID: {option.EmployeeID}
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
                noOptionsText="No employees found. Click + to add."
              />
            </Box>

            {/* DATE */}
            <Box>
              <Typography sx={labelStyle}>
                DATE <span style={{ color: "#EF4444" }}>*</span>
              </Typography>
              <TextField
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
            </Box>

            {/* REQUEST TYPE */}
            <Box>
              <Typography sx={labelStyle}>REQUEST TYPE</Typography>
              <TextField
                select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              >
                <MenuItem value="missed-punch" sx={{ fontSize: '0.75rem' }}>Missed Punch</MenuItem>
                <MenuItem value="correct-time" sx={{ fontSize: '0.75rem' }}>Correct Time</MenuItem>
                <MenuItem value="work-from-home" sx={{ fontSize: '0.75rem' }}>Work From Home</MenuItem>
                <MenuItem value="on-duty" sx={{ fontSize: '0.75rem' }}>On Duty</MenuItem>
              </TextField>
            </Box>

            {/* IN / OUT */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                type="datetime-local"
                label="In Time"
                name="requestedIn"
                value={formData.requestedIn}
                onChange={handleChange}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
              <TextField
                type="datetime-local"
                label="Out Time"
                name="requestedOut"
                value={formData.requestedOut}
                onChange={handleChange}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
            </Box>

            {/* REASON */}
            <Box>
              <Typography sx={labelStyle}>
                REASON <span style={{ color: "#EF4444" }}>*</span>
              </Typography>
              <TextField
                multiline
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason..."
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </Box>

            {/* DOC */}
            <Box>
              <Typography sx={labelStyle}>SUPPORTING DOCUMENT</Typography>
              <TextField
                name="supportingDocument"
                value={formData.supportingDocument}
                onChange={handleChange}
                placeholder="Enter document URL"
                fullWidth
                size="small"
                sx={inputStyle}
              />
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                Optional - provide a link to supporting document
              </Typography>
            </Box>

            {error && (
              <Alert sx={{ fontSize: "0.75rem", borderRadius: 1.5 }} severity="error">
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
              fontSize: "0.7rem",
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
            disabled={loading || !formData.employeeId || !formData.date || !formData.reason.trim()}
            startIcon={!loading && <AddIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.primary,
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: COLORS.primaryDark },
              '&:disabled': {
                bgcolor: COLORS.border,
                color: COLORS.text.tertiary
              }
            }}
          >
            {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Employee Dialog */}
      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAdd={handleEmployeeAdded}
      />
    </>
  );
};

export default AddRegularization;
