// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   Stack,
//   Typography,
//   IconButton,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Box,
//   Divider,
// } from "@mui/material";
// import { Add, Close, Delete } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const AddEnrollment = ({ open, onClose, onSuccess }) => {
//   const [employees, setEmployees] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     employeeId: "",
//     policyId: "",
//     dependents: [],
//     nomineeDetails: [],
//   });

//   const [dependent, setDependent] = useState({
//     name: "",
//     relationship: "",
//     gender: "",
//     dateOfBirth: "",
//   });

//   const [nominee, setNominee] = useState({
//     name: "",
//     relationship: "",
//     contactNumber: "",
//     percentage: "",
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     if (open) {
//       fetchEmployees();
//       fetchPolicies();
//     }
//   }, [open]);

//   // ================= FETCH DATA =================

//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) setEmployees(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchPolicies = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies?status=active`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (res.data.success) setPolicies(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ================= HANDLE CHANGE =================

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ================= DEPENDENT =================

//   const addDependent = () => {
//     if (!dependent.name) return;
//     setForm({
//       ...form,
//       dependents: [...form.dependents, dependent],
//     });
//     setDependent({
//       name: "",
//       relationship: "",
//       gender: "",
//       dateOfBirth: "",
//     });
//   };

//   const removeDependent = (index) => {
//     const updated = form.dependents.filter((_, i) => i !== index);
//     setForm({ ...form, dependents: updated });
//   };

//   // ================= NOMINEE =================

//   const addNominee = () => {
//     if (!nominee.name) return;
//     setForm({
//       ...form,
//       nomineeDetails: [...form.nomineeDetails, nominee],
//     });
//     setNominee({
//       name: "",
//       relationship: "",
//       contactNumber: "",
//       percentage: "",
//     });
//   };

//   const removeNominee = (index) => {
//     const updated = form.nomineeDetails.filter((_, i) => i !== index);
//     setForm({ ...form, nomineeDetails: updated });
//   };

//   // ================= SUBMIT =================

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         `${BASE_URL}/api/mediclaim/enroll`,
//         form,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setSnackbar({
//         open: true,
//         message: res.data.message,
//         severity: "success",
//       });

//       onSuccess();
//       handleClose();
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Enrollment failed",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setForm({
//       employeeId: "",
//       policyId: "",
//       dependents: [],
//       nomineeDetails: [],
//     });
//     onClose();
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle
//           sx={{
//             background:
//               "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)",
//             color: "#fff",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography fontWeight={600}>Add Enrollment</Typography>
//           <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Stack spacing={3} mt={1}>
//             {/* Employee */}
//             <TextField
//               select
//               label="Employee"
//               name="employeeId"
//               value={form.employeeId}
//               onChange={handleChange}
//               fullWidth
//               required
//             >
//               {employees.map((emp) => (
//                 <MenuItem key={emp._id} value={emp._id}>
//                   {emp.EmployeeID} - {emp.FirstName} {emp.LastName}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Policy */}
//             <TextField
//               select
//               label="Policy"
//               name="policyId"
//               value={form.policyId}
//               onChange={handleChange}
//               fullWidth
//               required
//             >
//               {policies.map((pol) => (
//                 <MenuItem key={pol._id} value={pol._id}>
//                   {pol.policyName}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <Divider />

//             {/* Dependents Section */}
//             <Typography variant="subtitle1">Add Dependents</Typography>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 label="Name"
//                 value={dependent.name}
//                 onChange={(e) =>
//                   setDependent({ ...dependent, name: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Relationship"
//                 value={dependent.relationship}
//                 onChange={(e) =>
//                   setDependent({ ...dependent, relationship: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Gender"
//                 value={dependent.gender}
//                 onChange={(e) =>
//                   setDependent({ ...dependent, gender: e.target.value })
//                 }
//               />
//               <TextField
//                 type="date"
//                 InputLabelProps={{ shrink: true }}
//                 value={dependent.dateOfBirth}
//                 onChange={(e) =>
//                   setDependent({ ...dependent, dateOfBirth: e.target.value })
//                 }
//               />
//               <IconButton color="primary" onClick={addDependent}>
//                 <Add />
//               </IconButton>
//             </Stack>

//             {form.dependents.map((dep, index) => (
//               <Box key={index} display="flex" justifyContent="space-between">
//                 <Typography variant="body2">
//                   {dep.name} - {dep.relationship}
//                 </Typography>
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={() => removeDependent(index)}
//                 >
//                   <Delete />
//                 </IconButton>
//               </Box>
//             ))}

//             <Divider />

//             {/* Nominee Section */}
//             <Typography variant="subtitle1">Add Nominee</Typography>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 label="Name"
//                 value={nominee.name}
//                 onChange={(e) =>
//                   setNominee({ ...nominee, name: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Relationship"
//                 value={nominee.relationship}
//                 onChange={(e) =>
//                   setNominee({ ...nominee, relationship: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Contact"
//                 value={nominee.contactNumber}
//                 onChange={(e) =>
//                   setNominee({ ...nominee, contactNumber: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Percentage"
//                 type="number"
//                 value={nominee.percentage}
//                 onChange={(e) =>
//                   setNominee({ ...nominee, percentage: e.target.value })
//                 }
//               />
//               <IconButton color="primary" onClick={addNominee}>
//                 <Add />
//               </IconButton>
//             </Stack>

//             {form.nomineeDetails.map((nom, index) => (
//               <Box key={index} display="flex" justifyContent="space-between">
//                 <Typography variant="body2">
//                   {nom.name} - {nom.percentage}%
//                 </Typography>
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={() => removeNominee(index)}
//                 >
//                   <Delete />
//                 </IconButton>
//               </Box>
//             ))}
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={20} /> : "Enroll"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default AddEnrollment;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   Stack,
//   Typography,
//   IconButton,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Box,
//   Divider,
// } from "@mui/material";
// import { Add, Close, Delete } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const AddEnrollment = ({ open, onClose, onSuccess }) => {
//   const [employees, setEmployees] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Enums from backend schema
//   const RELATIONSHIP_ENUM = [
//     "spouse",
//     "son",
//     "daughter",
//     "father",
//     "mother",
//     "self",
//   ];
//   const GENDER_ENUM = ["M", "F", "O"];
//   const STATUS_ENUM = ["pending", "active", "expired", "cancelled"];

//   const [form, setForm] = useState({
//     employeeId: "",
//     policyId: "",
//     dependents: [],
//     nomineeDetails: [],
//   });

//   const [dependent, setDependent] = useState({
//     name: "",
//     relationship: "",
//     gender: "",
//     dateOfBirth: "",
//   });

//   const [nominee, setNominee] = useState({
//     name: "",
//     relationship: "",
//     contactNumber: "",
//     percentage: "",
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     if (open) {
//       fetchEmployees();
//       fetchPolicies();
//     }
//   }, [open]);

//   // ================= FETCH DATA =================

//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) setEmployees(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchPolicies = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies?status=active`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//       if (res.data.success) setPolicies(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ================= HANDLE CHANGE =================

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ================= DEPENDENT =================

//   const addDependent = () => {
//     if (
//       !dependent.name ||
//       !dependent.relationship ||
//       !dependent.gender ||
//       !dependent.dateOfBirth
//     ) {
//       setSnackbar({
//         open: true,
//         message: "Please fill all dependent fields",
//         severity: "warning",
//       });
//       return;
//     }
//     setForm({
//       ...form,
//       dependents: [...form.dependents, dependent],
//     });
//     setDependent({
//       name: "",
//       relationship: "",
//       gender: "",
//       dateOfBirth: "",
//     });
//   };

//   const removeDependent = (index) => {
//     const updated = form.dependents.filter((_, i) => i !== index);
//     setForm({ ...form, dependents: updated });
//   };

//   // ================= NOMINEE =================

//   const addNominee = () => {
//     if (
//       !nominee.name ||
//       !nominee.relationship ||
//       !nominee.contactNumber ||
//       !nominee.percentage
//     ) {
//       setSnackbar({
//         open: true,
//         message: "Please fill all nominee fields",
//         severity: "warning",
//       });
//       return;
//     }

//     // Calculate total percentage
//     const totalPercentage =
//       form.nomineeDetails.reduce((sum, n) => sum + Number(n.percentage), 0) +
//       Number(nominee.percentage);

//     if (totalPercentage > 100) {
//       setSnackbar({
//         open: true,
//         message: "Total nominee percentage cannot exceed 100%",
//         severity: "warning",
//       });
//       return;
//     }

//     setForm({
//       ...form,
//       nomineeDetails: [...form.nomineeDetails, nominee],
//     });
//     setNominee({
//       name: "",
//       relationship: "",
//       contactNumber: "",
//       percentage: "",
//     });
//   };

//   const removeNominee = (index) => {
//     const updated = form.nomineeDetails.filter((_, i) => i !== index);
//     setForm({ ...form, nomineeDetails: updated });
//   };

//   // ================= VALIDATION =================

//   const validateForm = () => {
//     if (!form.employeeId) {
//       setSnackbar({
//         open: true,
//         message: "Please select an employee",
//         severity: "warning",
//       });
//       return false;
//     }
//     if (!form.policyId) {
//       setSnackbar({
//         open: true,
//         message: "Please select a policy",
//         severity: "warning",
//       });
//       return false;
//     }

//     // Validate nominee percentage total
//     const totalPercentage = form.nomineeDetails.reduce(
//       (sum, nom) => sum + Number(nom.percentage),
//       0,
//     );

//     if (form.nomineeDetails.length > 0 && totalPercentage !== 100) {
//       setSnackbar({
//         open: true,
//         message: "Total nominee percentage must equal 100%",
//         severity: "warning",
//       });
//       return false;
//     }

//     return true;
//   };

//   // ================= SUBMIT =================

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.post(`${BASE_URL}/api/mediclaim/enroll`, form, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setSnackbar({
//         open: true,
//         message: res.data.message,
//         severity: "success",
//       });

//       onSuccess();
//       handleClose();
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Enrollment failed",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setForm({
//       employeeId: "",
//       policyId: "",
//       dependents: [],
//       nomineeDetails: [],
//     });
//     setDependent({
//       name: "",
//       relationship: "",
//       gender: "",
//       dateOfBirth: "",
//     });
//     setNominee({
//       name: "",
//       relationship: "",
//       contactNumber: "",
//       percentage: "",
//     });
//     onClose();
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle
//           sx={{
//             background:
//               "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)",
//             color: "#fff",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography fontWeight={600}>Add Enrollment</Typography>
//           <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Stack spacing={3} mt={1}>
//             {/* Employee */}
//             <TextField
//               select
//               label="Employee *"
//               name="employeeId"
//               value={form.employeeId}
//               onChange={handleChange}
//               SelectProps={{
//                 MenuProps: {
//                   PaperProps: {
//                     sx: {
//                       maxHeight: 48 * 5, // 5 items visible
//                     },
//                   },
//                 },
//               }}
//               fullWidth
//               required
//             >
//               {employees.map((emp) => (
//                 <MenuItem key={emp._id} value={emp._id}>
//                   {emp.EmployeeID} - {emp.FirstName} {emp.LastName}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Policy */}
//             <TextField
//               select
//               label="Policy *"
//               name="policyId"
//               value={form.policyId}
//               onChange={handleChange}
//               SelectProps={{
//                 MenuProps: {
//                   PaperProps: {
//                     sx: {
//                       maxHeight: 48 * 5, // 5 items visible
//                     },
//                   },
//                 },
//               }}
//               fullWidth
//               required
//             >
//               {policies.map((pol) => (
//                 <MenuItem key={pol._id} value={pol._id}>
//                   {pol.policyName}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <Divider />

//             {/* Dependents Section */}
//             <Typography variant="subtitle1" fontWeight={600}>
//               Add Dependents
//             </Typography>

//             <Stack spacing={2}>
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Name *"
//                   size="small"
//                   value={dependent.name}
//                   onChange={(e) =>
//                     setDependent({ ...dependent, name: e.target.value })
//                   }
//                   fullWidth
//                 />
//                 <TextField
//                   select
//                   label="Relationship *"
//                   size="small"
//                   value={dependent.relationship}
//                   onChange={(e) =>
//                     setDependent({ ...dependent, relationship: e.target.value })
//                   }
//                   fullWidth
//                 >
//                   {RELATIONSHIP_ENUM.map((rel) => (
//                     <MenuItem key={rel} value={rel}>
//                       {rel.charAt(0).toUpperCase() + rel.slice(1)}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Stack>

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   select
//                   label="Gender *"
//                   size="small"
//                   value={dependent.gender}
//                   onChange={(e) =>
//                     setDependent({ ...dependent, gender: e.target.value })
//                   }
//                   fullWidth
//                 >
//                   {GENDER_ENUM.map((gen) => (
//                     <MenuItem key={gen} value={gen}>
//                       {gen === "M" ? "Male" : gen === "F" ? "Female" : "Other"}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//                 <TextField
//                   type="date"
//                   label="Date of Birth *"
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   value={dependent.dateOfBirth}
//                   onChange={(e) =>
//                     setDependent({ ...dependent, dateOfBirth: e.target.value })
//                   }
//                   fullWidth
//                 />
//                 <Button
//                   variant="contained"
//                   startIcon={<Add />}
//                   onClick={addDependent}
//                   sx={{ minWidth: "120px" }}
//                 >
//                   Add
//                 </Button>
//               </Stack>
//             </Stack>

//             {/* Dependents List */}
//             {form.dependents.length > 0 && (
//               <Box sx={{ mt: 1 }}>
//                 <Typography variant="subtitle2" gutterBottom>
//                   Added Dependents:
//                 </Typography>
//                 <Stack spacing={1}>
//                   {form.dependents.map((dep, index) => (
//                     <Box
//                       key={index}
//                       display="flex"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       sx={{
//                         p: 1,
//                         bgcolor: "#f5f5f5",
//                         borderRadius: 1,
//                       }}
//                     >
//                       <Typography variant="body2">
//                         {dep.name} - {dep.relationship} (
//                         {dep.gender === "M"
//                           ? "Male"
//                           : dep.gender === "F"
//                             ? "Female"
//                             : "Other"}
//                         ) - DOB:{" "}
//                         {new Date(dep.dateOfBirth).toLocaleDateString()}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={() => removeDependent(index)}
//                       >
//                         <Delete />
//                       </IconButton>
//                     </Box>
//                   ))}
//                 </Stack>
//               </Box>
//             )}

//             <Divider />

//             {/* Nominee Section */}
//             <Typography variant="subtitle1" fontWeight={600}>
//               Add Nominees
//             </Typography>

//             <Stack spacing={2}>
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Name *"
//                   size="small"
//                   value={nominee.name}
//                   onChange={(e) =>
//                     setNominee({ ...nominee, name: e.target.value })
//                   }
//                   fullWidth
//                 />
//                 <TextField
//                   select
//                   label="Relationship *"
//                   size="small"
//                   value={nominee.relationship}
//                   onChange={(e) =>
//                     setNominee({ ...nominee, relationship: e.target.value })
//                   }
//                   fullWidth
//                 >
//                   {RELATIONSHIP_ENUM.map((rel) => (
//                     <MenuItem key={rel} value={rel}>
//                       {rel.charAt(0).toUpperCase() + rel.slice(1)}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Stack>

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Contact Number *"
//                   size="small"
//                   value={nominee.contactNumber}
//                   onChange={(e) =>
//                     setNominee({ ...nominee, contactNumber: e.target.value })
//                   }
//                   fullWidth
//                 />
//                 <TextField
//                   label="Percentage *"
//                   type="number"
//                   size="small"
//                   value={nominee.percentage}
//                   onChange={(e) =>
//                     setNominee({ ...nominee, percentage: e.target.value })
//                   }
//                   fullWidth
//                   InputProps={{ inputProps: { min: 0, max: 100 } }}
//                 />
//                 <Button
//                   variant="contained"
//                   startIcon={<Add />}
//                   onClick={addNominee}
//                   sx={{ minWidth: "120px" }}
//                 >
//                   Add
//                 </Button>
//               </Stack>
//             </Stack>

//             {/* Nominees List */}
//             {form.nomineeDetails.length > 0 && (
//               <Box sx={{ mt: 1 }}>
//                 <Typography variant="subtitle2" gutterBottom>
//                   Added Nominees:
//                 </Typography>
//                 <Stack spacing={1}>
//                   {form.nomineeDetails.map((nom, index) => (
//                     <Box
//                       key={index}
//                       display="flex"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       sx={{
//                         p: 1,
//                         bgcolor: "#f5f5f5",
//                         borderRadius: 1,
//                       }}
//                     >
//                       <Typography variant="body2">
//                         {nom.name} - {nom.relationship} - {nom.contactNumber} -{" "}
//                         {nom.percentage}%
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={() => removeNominee(index)}
//                       >
//                         <Delete />
//                       </IconButton>
//                     </Box>
//                   ))}
//                 </Stack>
//               </Box>
//             )}

//             {/* Percentage Summary */}
//             {form.nomineeDetails.length > 0 && (
//               <Box sx={{ mt: 1, p: 1, bgcolor: "#e3f2fd", borderRadius: 1 }}>
//                 <Typography variant="body2">
//                   Total Nominee Percentage:{" "}
//                   {form.nomineeDetails.reduce(
//                     (sum, nom) => sum + Number(nom.percentage),
//                     0,
//                   )}
//                   %
//                 </Typography>
//               </Box>
//             )}
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={20} /> : "Enroll"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default AddEnrollment;


// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   Stack,
//   Typography,
//   IconButton,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Box,
//   Divider,
//   Chip,
//   InputAdornment,
//   FormHelperText,
//   Grid
// } from '@mui/material';
// import { Add, Close, Delete, PersonAdd, FamilyRestroom, VerifiedUser } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';

// // Color constants matching other components
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

// const RELATIONSHIP_ENUM = ['spouse', 'son', 'daughter', 'father', 'mother', 'self'];
// const GENDER_ENUM = ['M', 'F', 'O'];

// const AddEnrollment = ({ open, onClose, onSuccess }) => {
//   const [employees, setEmployees] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   const [form, setForm] = useState({
//     employeeId: '',
//     policyId: '',
//     dependents: [],
//     nomineeDetails: [],
//   });

//   const [dependent, setDependent] = useState({
//     name: '',
//     relationship: '',
//     gender: '',
//     dateOfBirth: '',
//   });

//   const [nominee, setNominee] = useState({
//     name: '',
//     relationship: '',
//     contactNumber: '',
//     percentage: '',
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });

//   useEffect(() => {
//     if (open) {
//       fetchEmployees();
//       fetchPolicies();
//     }
//   }, [open]);

//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) setEmployees(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchPolicies = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${BASE_URL}/api/mediclaim/policies?status=active`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) setPolicies(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleBlur = (field) => {
//     setTouched(prev => ({ ...prev, [field]: true }));
//     if (field === 'employeeId' && !form.employeeId) {
//       setFieldErrors(prev => ({ ...prev, employeeId: 'Employee is required' }));
//     }
//     if (field === 'policyId' && !form.policyId) {
//       setFieldErrors(prev => ({ ...prev, policyId: 'Policy is required' }));
//     }
//   };

//   const validateDependent = () => {
//     const errors = {};
//     if (!dependent.name) errors.name = 'Name is required';
//     if (!dependent.relationship) errors.relationship = 'Relationship is required';
//     if (!dependent.gender) errors.gender = 'Gender is required';
//     if (!dependent.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
//     return errors;
//   };

//   const addDependent = () => {
//     const errors = validateDependent();
//     if (Object.keys(errors).length > 0) {
//       setSnackbar({
//         open: true,
//         message: 'Please fill all dependent fields',
//         severity: 'warning',
//       });
//       return;
//     }
//     setForm({
//       ...form,
//       dependents: [...form.dependents, dependent],
//     });
//     setDependent({
//       name: '',
//       relationship: '',
//       gender: '',
//       dateOfBirth: '',
//     });
//   };

//   const removeDependent = (index) => {
//     const updated = form.dependents.filter((_, i) => i !== index);
//     setForm({ ...form, dependents: updated });
//   };

//   const validateNominee = () => {
//     const errors = {};
//     if (!nominee.name) errors.name = 'Name is required';
//     if (!nominee.relationship) errors.relationship = 'Relationship is required';
//     if (!nominee.contactNumber) errors.contactNumber = 'Contact number is required';
//     if (!nominee.percentage) errors.percentage = 'Percentage is required';
//     return errors;
//   };

//   const addNominee = () => {
//     const errors = validateNominee();
//     if (Object.keys(errors).length > 0) {
//       setSnackbar({
//         open: true,
//         message: 'Please fill all nominee fields',
//         severity: 'warning',
//       });
//       return;
//     }

//     const totalPercentage =
//       form.nomineeDetails.reduce((sum, n) => sum + Number(n.percentage), 0) +
//       Number(nominee.percentage);

//     if (totalPercentage > 100) {
//       setSnackbar({
//         open: true,
//         message: 'Total nominee percentage cannot exceed 100%',
//         severity: 'warning',
//       });
//       return;
//     }

//     setForm({
//       ...form,
//       nomineeDetails: [...form.nomineeDetails, nominee],
//     });
//     setNominee({
//       name: '',
//       relationship: '',
//       contactNumber: '',
//       percentage: '',
//     });
//   };

//   const removeNominee = (index) => {
//     const updated = form.nomineeDetails.filter((_, i) => i !== index);
//     setForm({ ...form, nomineeDetails: updated });
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!form.employeeId) errors.employeeId = 'Please select an employee';
//     if (!form.policyId) errors.policyId = 'Please select a policy';
//     setFieldErrors(errors);

//     if (Object.keys(errors).length > 0) return false;

//     const totalPercentage = form.nomineeDetails.reduce(
//       (sum, nom) => sum + Number(nom.percentage),
//       0
//     );

//     if (form.nomineeDetails.length > 0 && totalPercentage !== 100) {
//       setSnackbar({
//         open: true,
//         message: 'Total nominee percentage must equal 100%',
//         severity: 'warning',
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const res = await axios.post(`${BASE_URL}/api/mediclaim/enroll`, form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSnackbar({
//         open: true,
//         message: res.data.message || 'Enrollment added successfully',
//         severity: 'success',
//       });

//       onSuccess();
//       setTimeout(() => {
//         handleClose();
//       }, 1500);
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || 'Enrollment failed',
//         severity: 'error',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setForm({
//       employeeId: '',
//       policyId: '',
//       dependents: [],
//       nomineeDetails: [],
//     });
//     setDependent({
//       name: '',
//       relationship: '',
//       gender: '',
//       dateOfBirth: '',
//     });
//     setNominee({
//       name: '',
//       relationship: '',
//       contactNumber: '',
//       percentage: '',
//     });
//     setFieldErrors({});
//     setTouched({});
//     onClose();
//   };

//   const inputStyle = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: 1.5,
//       fontSize: '0.75rem',
//       '&:hover fieldset': { borderColor: COLORS.primary },
//       '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//       '&.Mui-error fieldset': { borderColor: '#EF4444' }
//     },
//     '& .MuiInputBase-input': {
//       py: 1,
//       px: 1.5,
//       fontSize: '0.75rem',
//       color: COLORS.text.primary,
//       '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
//     }
//   };

//   const labelStyle = {
//     fontSize: '0.7rem',
//     fontWeight: 600,
//     color: COLORS.text.secondary,
//     letterSpacing: '0.5px',
//     mb: 0.5
//   };

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 5,
//             boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//             border: `1px solid ${COLORS.border}`,
//             overflow: 'hidden',
//             maxHeight: '90vh'
//           }
//         }}
//       >
//         <DialogTitle sx={{
//                borderBottom: `1px solid ${COLORS.border}`,
//                py: 1.5,
//                px: 2.5,
//                mb: 2,
//                bgcolor: COLORS.background.white,
//                display: 'flex',
//                justifyContent: 'space-between',
//                alignItems: 'center'
//              }}>
//                <Typography
//                  sx={{
//                    fontSize: '1.2rem',
//                    fontWeight: 700,
//                    color: COLORS.text.primary
//                  }}
//                >
//                  Add Enrollment
//                </Typography>
//              </DialogTitle>

//         <DialogContent sx={{ p: 2.5 }}>
//           <Stack spacing={3}>
//             {/* Employee Selection */}
//             <Box>
//               <Typography sx={labelStyle}>Employee *</Typography>
//               <TextField
//                 select
//                 name="employeeId"
//                 value={form.employeeId}
//                 onChange={handleChange}
//                 onBlur={() => handleBlur('employeeId')}
//                 fullWidth
//                 size="small"
//                 error={touched.employeeId && !!fieldErrors.employeeId}
//                 helperText={touched.employeeId ? fieldErrors.employeeId : ''}
//                 sx={inputStyle}
//                 SelectProps={{
//                   MenuProps: {
//                     PaperProps: {
//                       sx: { maxHeight: 200, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }
//                     }
//                   }
//                 }}
//               >
//                 <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select employee</MenuItem>
//                 {employees.map((emp) => (
//                   <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: '0.75rem' }}>
//                     {emp.EmployeeID} - {emp.FirstName} {emp.LastName}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Box>

//             {/* Policy Selection */}
//             <Box>
//               <Typography sx={labelStyle}>Policy *</Typography>
//               <TextField
//                 select
//                 name="policyId"
//                 value={form.policyId}
//                 onChange={handleChange}
//                 onBlur={() => handleBlur('policyId')}
//                 fullWidth
//                 size="small"
//                 error={touched.policyId && !!fieldErrors.policyId}
//                 helperText={touched.policyId ? fieldErrors.policyId : ''}
//                 sx={inputStyle}
//                 SelectProps={{
//                   MenuProps: {
//                     PaperProps: {
//                       sx: { maxHeight: 200, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }
//                     }
//                   }
//                 }}
//               >
//                 <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select policy</MenuItem>
//                 {policies.map((pol) => (
//                   <MenuItem key={pol._id} value={pol._id} sx={{ fontSize: '0.75rem' }}>
//                     {pol.policyName}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Box>

//             <Divider sx={{ borderColor: COLORS.border }} />

//             {/* Dependents Section */}
//             <Box>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                 <FamilyRestroom sx={{ fontSize: '1rem', color: COLORS.primary }} />
//                 <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
//                   Add Dependents
//                 </Typography>
//                 <Chip label={form.dependents.length} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />
//               </Box>

//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={labelStyle}>Name *</Typography>
//                   <TextField
//                     size="small"
//                     value={dependent.name}
//                     onChange={(e) => setDependent({ ...dependent, name: e.target.value })}
//                     fullWidth
//                     sx={inputStyle}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={labelStyle}>Relationship *</Typography>
//                   <TextField
//                     select
//                     size="small"
//                     value={dependent.relationship}
//                     onChange={(e) => setDependent({ ...dependent, relationship: e.target.value })}
//                     fullWidth
//                     sx={inputStyle}
//                   >
//                     <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select relationship</MenuItem>
//                     {RELATIONSHIP_ENUM.map((rel) => (
//                       <MenuItem key={rel} value={rel} sx={{ fontSize: '0.75rem' }}>
//                         {rel.charAt(0).toUpperCase() + rel.slice(1)}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={labelStyle}>Gender *</Typography>
//                   <TextField
//                     select
//                     size="small"
//                     value={dependent.gender}
//                     onChange={(e) => setDependent({ ...dependent, gender: e.target.value })}
//                     fullWidth
//                     sx={inputStyle}
//                   >
//                     <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select gender</MenuItem>
//                     {GENDER_ENUM.map((gen) => (
//                       <MenuItem key={gen} value={gen} sx={{ fontSize: '0.75rem' }}>
//                         {gen === 'M' ? 'Male' : gen === 'F' ? 'Female' : 'Other'}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={labelStyle}>Date of Birth *</Typography>
//                   <TextField
//                     type="date"
//                     size="small"
//                     InputLabelProps={{ shrink: true }}
//                     value={dependent.dateOfBirth}
//                     onChange={(e) => setDependent({ ...dependent, dateOfBirth: e.target.value })}
//                     fullWidth
//                     sx={inputStyle}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Add sx={{ fontSize: '0.9rem' }} />}
//                     onClick={addDependent}
//                     sx={{
//                       height: 32,
//                       px: 2,
//                       borderRadius: 1.5,
//                       bgcolor: COLORS.primary,
//                       fontSize: '0.7rem',
//                       textTransform: 'none'
//                     }}
//                   >
//                     Add Dependent
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Box>

//             {/* Dependents List */}
//             {form.dependents.length > 0 && (
//               <Box>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                   Added Dependents:
//                 </Typography>
//                 <Stack spacing={1}>
//                   {form.dependents.map((dep, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         p: 1.5,
//                         bgcolor: COLORS.background.light,
//                         borderRadius: 1.5,
//                         border: `1px solid ${COLORS.border}`,
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center'
//                       }}
//                     >
//                       <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
//                         {dep.name} - {dep.relationship} ({dep.gender === 'M' ? 'Male' : dep.gender === 'F' ? 'Female' : 'Other'}) - DOB: {new Date(dep.dateOfBirth).toLocaleDateString()}
//                       </Typography>
//                       <IconButton size="small" onClick={() => removeDependent(index)} sx={{ color: '#EF4444' }}>
//                         <Delete sx={{ fontSize: '0.9rem' }} />
//                       </IconButton>
//                     </Box>
//                   ))}
//                 </Stack>
//               </Box>
//             )}

//             <Divider sx={{ borderColor: COLORS.border }} />

//             {/* Nominee Section */}
//             <Box>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                 <PersonAdd sx={{ fontSize: '1rem', color: COLORS.primary }} />
//                 <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
//                   Add Nominees
//                 </Typography>
//                 <Chip label={form.nomineeDetails.length} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />
//               </Box>

//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={labelStyle}>Name *</Typography>
//                   <TextField
//                     size="small"
//                     value={nominee.name}
//                     onChange={(e) => setNominee({ ...nominee, name: e.target.value })}
//                     fullWidth
//                     sx={inputStyle}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={labelStyle}>Relationship *</Typography>
//                   <TextField
//                     select
//                     size="small"
//                     value={nominee.relationship}
//                     onChange={(e) => setNominee({ ...nominee, relationship: e.target.value })}
//                     fullWidth
//                     sx={inputStyle}
//                   >
//                     <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select relationship</MenuItem>
//                     {RELATIONSHIP_ENUM.map((rel) => (
//                       <MenuItem key={rel} value={rel} sx={{ fontSize: '0.75rem' }}>
//                         {rel.charAt(0).toUpperCase() + rel.slice(1)}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={labelStyle}>Contact Number *</Typography>
//                   <TextField
//                     size="small"
//                     value={nominee.contactNumber}
//                     onChange={(e) => setNominee({ ...nominee, contactNumber: e.target.value })}
//                     fullWidth
//                     sx={inputStyle}
//                     placeholder="10 digit mobile number"
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={labelStyle}>Percentage *</Typography>
//                   <TextField
//                     type="number"
//                     size="small"
//                     value={nominee.percentage}
//                     onChange={(e) => setNominee({ ...nominee, percentage: e.target.value })}
//                     fullWidth
//                     InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, inputProps: { min: 0, max: 100 } }}
//                     sx={inputStyle}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Add sx={{ fontSize: '0.9rem' }} />}
//                     onClick={addNominee}
//                     sx={{
//                       height: 32,
//                       px: 2,
//                       borderRadius: 1.5,
//                       bgcolor: COLORS.primary,
//                       fontSize: '0.7rem',
//                       textTransform: 'none'
//                     }}
//                   >
//                     Add Nominee
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Box>

//             {/* Nominees List */}
//             {form.nomineeDetails.length > 0 && (
//               <Box>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                   Added Nominees:
//                 </Typography>
//                 <Stack spacing={1}>
//                   {form.nomineeDetails.map((nom, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         p: 1.5,
//                         bgcolor: COLORS.background.light,
//                         borderRadius: 1.5,
//                         border: `1px solid ${COLORS.border}`,
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center'
//                       }}
//                     >
//                       <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
//                         {nom.name} - {nom.relationship} - {nom.contactNumber} - {nom.percentage}%
//                       </Typography>
//                       <IconButton size="small" onClick={() => removeNominee(index)} sx={{ color: '#EF4444' }}>
//                         <Delete sx={{ fontSize: '0.9rem' }} />
//                       </IconButton>
//                     </Box>
//                   ))}
//                 </Stack>
//               </Box>
//             )}

//             {/* Percentage Summary */}
//             {form.nomineeDetails.length > 0 && (
//               <Box sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                   Total Nominee Percentage:{' '}
//                   <strong>
//                     {form.nomineeDetails.reduce((sum, nom) => sum + Number(nom.percentage), 0)}%
//                   </strong>
//                 </Typography>
//               </Box>
//             )}
//           </Stack>
//         </DialogContent>

//         <DialogActions sx={{
//           px: 2.5,
//           py: 1.5,
//           borderTop: `1px solid ${COLORS.border}`,
//           bgcolor: COLORS.background.white,
//           display: 'flex',
//           justifyContent: 'flex-end',
//           gap: 1
//         }}>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             sx={{
//               height: 32,
//               px: 2,
//               borderRadius: 1.5,
//               border: `1px solid ${COLORS.border}`,
//               color: COLORS.text.secondary,
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               textTransform: 'none',
//               '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//             startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <Add sx={{ fontSize: '1rem' }} />}
//             sx={{
//               height: 32,
//               px: 2,
//               borderRadius: 1.5,
//               bgcolor: COLORS.primary,
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               textTransform: 'none',
//               '&:hover': { bgcolor: COLORS.primaryDark }
//             }}
//           >
//             {loading ? 'Enrolling...' : 'Enroll'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default AddEnrollment;








import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Divider,
  Chip,
  InputAdornment,
  FormHelperText,
  Grid,
  Tooltip,
  Autocomplete
} from '@mui/material';
import { Add, Close, Delete, PersonAdd, FamilyRestroom, VerifiedUser, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import AddPolicy from '../policy/AddPolicy';
import AddEmployees from '../../employeemaster/AddEmployees';


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

const RELATIONSHIP_ENUM = ['spouse', 'son', 'daughter', 'father', 'mother', 'self'];
const GENDER_ENUM = ['M', 'F', 'O'];

const AddEnrollment = ({ open, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // State for Add dialogs
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [addPolicyOpen, setAddPolicyOpen] = useState(false);

  // Loading states for autocomplete
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingPolicies, setLoadingPolicies] = useState(false);

  const [form, setForm] = useState({
    employeeId: '',
    policyId: '',
    dependents: [],
    nomineeDetails: [],
  });

  const [dependent, setDependent] = useState({
    name: '',
    relationship: '',
    gender: '',
    dateOfBirth: '',
  });

  const [nominee, setNominee] = useState({
    name: '',
    relationship: '',
    contactNumber: '',
    percentage: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchPolicies();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      setLoadingPolicies(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/mediclaim/policies?status=active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setPolicies(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPolicies(false);
    }
  };

  const handleEmployeeSelect = (event, newValue) => {
    setForm({ ...form, employeeId: newValue?._id || '' });
    if (fieldErrors.employeeId) setFieldErrors(prev => ({ ...prev, employeeId: '' }));
    setTouched(prev => ({ ...prev, employeeId: true }));
  };

  const handlePolicySelect = (event, newValue) => {
    setForm({ ...form, policyId: newValue?._id || '' });
    if (fieldErrors.policyId) setFieldErrors(prev => ({ ...prev, policyId: '' }));
    setTouched(prev => ({ ...prev, policyId: true }));
  };

  const validateDependent = () => {
    const errors = {};
    if (!dependent.name) errors.name = 'Name is required';
    if (!dependent.relationship) errors.relationship = 'Relationship is required';
    if (!dependent.gender) errors.gender = 'Gender is required';
    if (!dependent.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    return errors;
  };

  const addDependent = () => {
    const errors = validateDependent();
    if (Object.keys(errors).length > 0) {
      setSnackbar({
        open: true,
        message: 'Please fill all dependent fields',
        severity: 'warning',
      });
      return;
    }
    setForm({
      ...form,
      dependents: [...form.dependents, dependent],
    });
    setDependent({
      name: '',
      relationship: '',
      gender: '',
      dateOfBirth: '',
    });
  };

  const removeDependent = (index) => {
    const updated = form.dependents.filter((_, i) => i !== index);
    setForm({ ...form, dependents: updated });
  };

  const validateNominee = () => {
    const errors = {};
    if (!nominee.name) errors.name = 'Name is required';
    if (!nominee.relationship) errors.relationship = 'Relationship is required';
    if (!nominee.contactNumber) errors.contactNumber = 'Contact number is required';
    if (!nominee.percentage) errors.percentage = 'Percentage is required';
    return errors;
  };

  const addNominee = () => {
    const errors = validateNominee();
    if (Object.keys(errors).length > 0) {
      setSnackbar({
        open: true,
        message: 'Please fill all nominee fields',
        severity: 'warning',
      });
      return;
    }

    const totalPercentage =
      form.nomineeDetails.reduce((sum, n) => sum + Number(n.percentage), 0) +
      Number(nominee.percentage);

    if (totalPercentage > 100) {
      setSnackbar({
        open: true,
        message: 'Total nominee percentage cannot exceed 100%',
        severity: 'warning',
      });
      return;
    }

    setForm({
      ...form,
      nomineeDetails: [...form.nomineeDetails, nominee],
    });
    setNominee({
      name: '',
      relationship: '',
      contactNumber: '',
      percentage: '',
    });
  };

  const removeNominee = (index) => {
    const updated = form.nomineeDetails.filter((_, i) => i !== index);
    setForm({ ...form, nomineeDetails: updated });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.employeeId) errors.employeeId = 'Please select an employee';
    if (!form.policyId) errors.policyId = 'Please select a policy';
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return false;

    const totalPercentage = form.nomineeDetails.reduce(
      (sum, nom) => sum + Number(nom.percentage),
      0
    );

    if (form.nomineeDetails.length > 0 && totalPercentage !== 100) {
      setSnackbar({
        open: true,
        message: 'Total nominee percentage must equal 100%',
        severity: 'warning',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.post(`${BASE_URL}/api/mediclaim/enroll`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({
        open: true,
        message: res.data.message || 'Enrollment added successfully',
        severity: 'success',
      });

      onSuccess();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Enrollment failed',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    // Auto-select the newly added employee
    setForm({ ...form, employeeId: newEmployee._id });
  };

  const handlePolicyAdded = (newPolicy) => {
    setPolicies(prev => [...prev, newPolicy]);
    // Auto-select the newly added policy
    setForm({ ...form, policyId: newPolicy._id });
  };

  const handleClose = () => {
    setForm({
      employeeId: '',
      policyId: '',
      dependents: [],
      nomineeDetails: [],
    });
    setDependent({
      name: '',
      relationship: '',
      gender: '',
      dateOfBirth: '',
    });
    setNominee({
      name: '',
      relationship: '',
      contactNumber: '',
      percentage: '',
    });
    setFieldErrors({});
    setTouched({});
    onClose();
  };

  const getEmployeeName = (employee) => {
    if (!employee) return '';
    const firstName = employee.FirstName || '';
    const lastName = employee.LastName || '';
    const empId = employee.EmployeeID || '';
    return `${firstName} ${lastName}${empId ? ` (${empId})` : ''}`.trim();
  };

  const getSelectedEmployee = () => {
    return employees.find(emp => emp._id === form.employeeId);
  };

  const getSelectedPolicy = () => {
    return policies.find(pol => pol._id === form.policyId);
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      backgroundColor: COLORS.background.white,
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
      '&.Mui-error fieldset': { borderColor: '#EF4444' }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
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
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden',
            maxHeight: '90vh'
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
            Add Enrollment
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          <Stack spacing={3}>
            {/* Employee Selection with Add Button */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={labelStyle}>Employee *</Typography>
                <Tooltip title="Add New Employee">
                  <IconButton
                    size="small"
                    onClick={() => setAddEmployeeOpen(true)}
                    sx={{
                      color: COLORS.primary,
                      '&:hover': { bgcolor: COLORS.primaryLight }
                    }}
                  >
                    <Add sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Autocomplete
                fullWidth
                size="small"
                options={employees}
                value={getSelectedEmployee() || null}
                onChange={handleEmployeeSelect}
                getOptionLabel={(option) => getEmployeeName(option)}
                loading={loadingEmployees}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search employee by name or ID..."
                    error={touched.employeeId && !!fieldErrors.employeeId}
                    helperText={touched.employeeId ? fieldErrors.employeeId : ''}
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
                        {getEmployeeName(option)}
                      </Typography>
                      {option.EmployeeID && (
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          ID: {option.EmployeeID}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
              />
            </Box>

            {/* Policy Selection with Add Button */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={labelStyle}>Policy *</Typography>
                <Tooltip title="Add New Policy">
                  <IconButton
                    size="small"
                    onClick={() => setAddPolicyOpen(true)}
                    sx={{
                      color: COLORS.primary,
                      '&:hover': { bgcolor: COLORS.primaryLight }
                    }}
                  >
                    <Add sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Autocomplete
                fullWidth
                size="small"
                options={policies}
                value={getSelectedPolicy() || null}
                onChange={handlePolicySelect}
                getOptionLabel={(option) => option.policyName || ''}
                loading={loadingPolicies}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search policy by name..."
                    error={touched.policyId && !!fieldErrors.policyId}
                    helperText={touched.policyId ? fieldErrors.policyId : ''}
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
                          {loadingPolicies && <CircularProgress size={16} />}
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
                        {option.policyName}
                      </Typography>
                      {option.insurer && (
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {option.insurer}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
              />
            </Box>

            <Divider sx={{ borderColor: COLORS.border }} />

            {/* Dependents Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FamilyRestroom sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Add Dependents
                </Typography>
                <Chip label={form.dependents.length} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Name *</Typography>
                  <TextField
                    size="small"
                    value={dependent.name}
                    onChange={(e) => setDependent({ ...dependent, name: e.target.value })}
                    fullWidth
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Relationship *</Typography>
                  <TextField
                    select
                    size="small"
                    value={dependent.relationship}
                    onChange={(e) => setDependent({ ...dependent, relationship: e.target.value })}
                    fullWidth
                    sx={inputStyle}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select relationship</MenuItem>
                    {RELATIONSHIP_ENUM.map((rel) => (
                      <MenuItem key={rel} value={rel} sx={{ fontSize: '0.75rem' }}>
                        {rel.charAt(0).toUpperCase() + rel.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Gender *</Typography>
                  <TextField
                    select
                    size="small"
                    value={dependent.gender}
                    onChange={(e) => setDependent({ ...dependent, gender: e.target.value })}
                    fullWidth
                    sx={inputStyle}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select gender</MenuItem>
                    {GENDER_ENUM.map((gen) => (
                      <MenuItem key={gen} value={gen} sx={{ fontSize: '0.75rem' }}>
                        {gen === 'M' ? 'Male' : gen === 'F' ? 'Female' : 'Other'}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Date of Birth *</Typography>
                  <TextField
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={dependent.dateOfBirth}
                    onChange={(e) => setDependent({ ...dependent, dateOfBirth: e.target.value })}
                    fullWidth
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add sx={{ fontSize: '0.9rem' }} />}
                    onClick={addDependent}
                    sx={{
                      height: 32,
                      px: 2,
                      borderRadius: 1.5,
                      bgcolor: COLORS.primary,
                      fontSize: '0.7rem',
                      textTransform: 'none'
                    }}
                  >
                    Add Dependent
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Dependents List */}
            {form.dependents.length > 0 && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Added Dependents:
                </Typography>
                <Stack spacing={1}>
                  {form.dependents.map((dep, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        bgcolor: COLORS.background.light,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {dep.name} - {dep.relationship} ({dep.gender === 'M' ? 'Male' : dep.gender === 'F' ? 'Female' : 'Other'}) - DOB: {new Date(dep.dateOfBirth).toLocaleDateString()}
                      </Typography>
                      <IconButton size="small" onClick={() => removeDependent(index)} sx={{ color: '#EF4444' }}>
                        <Delete sx={{ fontSize: '0.9rem' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Divider sx={{ borderColor: COLORS.border }} />

            {/* Nominee Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonAdd sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Add Nominees
                </Typography>
                <Chip label={form.nomineeDetails.length} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Name *</Typography>
                  <TextField
                    size="small"
                    value={nominee.name}
                    onChange={(e) => setNominee({ ...nominee, name: e.target.value })}
                    fullWidth
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Relationship *</Typography>
                  <TextField
                    select
                    size="small"
                    value={nominee.relationship}
                    onChange={(e) => setNominee({ ...nominee, relationship: e.target.value })}
                    fullWidth
                    sx={inputStyle}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select relationship</MenuItem>
                    {RELATIONSHIP_ENUM.map((rel) => (
                      <MenuItem key={rel} value={rel} sx={{ fontSize: '0.75rem' }}>
                        {rel.charAt(0).toUpperCase() + rel.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Contact Number *</Typography>
                  <TextField
                    size="small"
                    value={nominee.contactNumber}
                    onChange={(e) => setNominee({ ...nominee, contactNumber: e.target.value })}
                    fullWidth
                    sx={inputStyle}
                    placeholder="10 digit mobile number"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Percentage *</Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={nominee.percentage}
                    onChange={(e) => setNominee({ ...nominee, percentage: e.target.value })}
                    fullWidth
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, inputProps: { min: 0, max: 100 } }}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add sx={{ fontSize: '0.9rem' }} />}
                    onClick={addNominee}
                    sx={{
                      height: 32,
                      px: 2,
                      borderRadius: 1.5,
                      bgcolor: COLORS.primary,
                      fontSize: '0.7rem',
                      textTransform: 'none'
                    }}
                  >
                    Add Nominee
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Nominees List */}
            {form.nomineeDetails.length > 0 && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Added Nominees:
                </Typography>
                <Stack spacing={1}>
                  {form.nomineeDetails.map((nom, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        bgcolor: COLORS.background.light,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {nom.name} - {nom.relationship} - {nom.contactNumber} - {nom.percentage}%
                      </Typography>
                      <IconButton size="small" onClick={() => removeNominee(index)} sx={{ color: '#EF4444' }}>
                        <Delete sx={{ fontSize: '0.9rem' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Percentage Summary */}
            {form.nomineeDetails.length > 0 && (
              <Box sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  Total Nominee Percentage:{' '}
                  <strong>
                    {form.nomineeDetails.reduce((sum, nom) => sum + Number(nom.percentage), 0)}%
                  </strong>
                </Typography>
              </Box>
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
              '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <Add sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.primary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: COLORS.primaryDark }
            }}
          >
            {loading ? 'Enrolling...' : 'Enroll'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Employee Dialog */}
      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAdd={handleEmployeeAdded}
      />

      {/* Add Policy Dialog */}
      <AddPolicy
        open={addPolicyOpen}
        onClose={() => setAddPolicyOpen(false)}
        onSuccess={handlePolicyAdded}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddEnrollment;