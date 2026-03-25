// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Grid,
//   Typography,
//   Stack,
//   IconButton,
//   Paper,
//   Alert,
//   CircularProgress,
//   Divider
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const EditPolicy = ({ open, onClose, policyId, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [policy, setPolicy] = useState(null);

//   /* ================= FETCH POLICY ================= */
//   useEffect(() => {
//     if (open && policyId) fetchPolicy();
//     if (!open) resetState();
//   }, [open, policyId]);

//   const resetState = () => {
//     setPolicy(null);
//     setError("");
//   };

//   const fetchPolicy = async () => {
//     try {
//       setInitialLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         setPolicy(res.data.data);
//       } else {
//         setError("Policy not found");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load policy"
//       );
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   /* ================= HANDLERS ================= */
//   const handleChange = (field, value) => {
//     setPolicy(prev => ({ ...prev, [field]: value }));
//   };

//   const handlePremiumChange = (field, value) => {
//     setPolicy(prev => ({
//       ...prev,
//       premiumDetails: {
//         ...prev.premiumDetails,
//         [field]: value
//       }
//     }));
//   };

//   const handleHospitalChange = (index, field, value) => {
//     const updated = [...policy.networkHospitals];
//     updated[index][field] = value;
//     setPolicy(prev => ({ ...prev, networkHospitals: updated }));
//   };

//   const addHospital = () => {
//     setPolicy(prev => ({
//       ...prev,
//       networkHospitals: [
//         ...prev.networkHospitals,
//         { name: "", city: "", distance: "" }
//       ]
//     }));
//   };

//   const removeHospital = index => {
//     setPolicy(prev => ({
//       ...prev,
//       networkHospitals: prev.networkHospitals.filter(
//         (_, i) => i !== index
//       )
//     }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const payload = {
//         policyName: policy.policyName,
//         premiumDetails: {
//           amountPerEmployee: Number(
//             policy.premiumDetails?.amountPerEmployee
//           ),
//           totalPremium: Number(
//             policy.premiumDetails?.totalPremium
//           )
//         },
//         networkHospitals: policy.networkHospitals
//       };

//       const res = await axios.put(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         if (onSuccess) onSuccess();
//         onClose();
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to update policy"
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
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           display: "flex",
//           justifyContent: "space-between"
//         }}
//       >
//         Edit Policy – {policy?.policyId || ""}
//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>
//         {initialLoading ? (
//           <Stack alignItems="center" py={5}>
//             <CircularProgress />
//           </Stack>
//         ) : policy ? (
//           <Stack spacing={3}>
//             {error && <Alert severity="error">{error}</Alert>}

//             {/* BASIC INFO */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600} mb={2}>
//                 Basic Information
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Policy ID"
//                     fullWidth
//                     value={policy.policyId}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Insurer"
//                     fullWidth
//                     value={policy.insurer}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Policy Number"
//                     fullWidth
//                     value={policy.policyNumber}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Coverage Amount"
//                     fullWidth
//                     value={policy.coverageAmount}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField
//                     label="Policy Name"
//                     fullWidth
//                     value={policy.policyName}
//                     onChange={e =>
//                       handleChange(
//                         "policyName",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* PREMIUM */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600} mb={2}>
//                 Premium Details
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Amount Per Employee"
//                     type="number"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.amountPerEmployee || ""
//                     }
//                     onChange={e =>
//                       handlePremiumChange(
//                         "amountPerEmployee",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Total Premium"
//                     type="number"
//                     fullWidth
//                     value={
//                       policy.premiumDetails?.totalPremium ||
//                       ""
//                     }
//                     onChange={e =>
//                       handlePremiumChange(
//                         "totalPremium",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Payment Frequency"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.paymentFrequency || ""
//                     }
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Payment Status"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.paymentStatus || ""
//                     }
//                     disabled
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* NETWORK HOSPITALS */}
//             <Paper sx={{ p: 2 }}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//               >
//                 <Typography fontWeight={600}>
//                   Network Hospitals
//                 </Typography>

//                 <Button
//                   startIcon={<AddIcon />}
//                   onClick={addHospital}
//                 >
//                   Add
//                 </Button>
//               </Stack>

//               <Divider sx={{ my: 2 }} />

//               {policy.networkHospitals.map(
//                 (hospital, index) => (
//                   <Grid
//                     container
//                     spacing={2}
//                     key={index}
//                     sx={{ mb: 2 }}
//                   >
//                     <Grid item xs={4}>
//                       <TextField
//                         label="Hospital Name"
//                         fullWidth
//                         value={hospital.name}
//                         onChange={e =>
//                           handleHospitalChange(
//                             index,
//                             "name",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={4}>
//                       <TextField
//                         label="City"
//                         fullWidth
//                         value={hospital.city}
//                         onChange={e =>
//                           handleHospitalChange(
//                             index,
//                             "city",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={3}>
//                       <TextField
//                         label="Distance"
//                         fullWidth
//                         value={hospital.distance}
//                         onChange={e =>
//                           handleHospitalChange(
//                             index,
//                             "distance",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={1}>
//                       <IconButton
//                         color="error"
//                         onClick={() =>
//                           removeHospital(index)
//                         }
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Grid>
//                   </Grid>
//                 )
//               )}
//             </Paper>
//           </Stack>
//         ) : null}
//       </DialogContent>

//       <DialogActions sx={{ p: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           sx={{ background: HEADER_GRADIENT }}
//         >
//           {loading ? "Updating..." : "Update Policy"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditPolicy;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Grid,
//   Typography,
//   Stack,
//   IconButton,
//   Paper,
//   Alert,
//   CircularProgress,
//   Divider,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon,
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const EditPolicy = ({ open, onClose, policyId, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [policy, setPolicy] = useState(null);

//   /* ================= RESET ================= */
//   const resetState = () => {
//     setPolicy(null);
//     setError("");
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (open && policyId) fetchPolicy();
//     if (!open) resetState();
//   }, [open, policyId]);

//   /* ================= FETCH POLICY ================= */
//   const fetchPolicy = async () => {
//     try {
//       setInitialLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data?.success) {
//         setPolicy(res.data.data);
//       } else {
//         setError("Policy not found");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load policy"
//       );
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   /* ================= HANDLERS ================= */

//   const handleChange = (field, value) => {
//     setPolicy((prev) => ({ ...prev, [field]: value }));
//   };

//   const handlePremiumChange = (field, value) => {
//     setPolicy((prev) => ({
//       ...prev,
//       premiumDetails: {
//         ...prev.premiumDetails,
//         [field]: value,
//       },
//     }));
//   };

//   const handleHospitalChange = (index, field, value) => {
//     const updated = [...policy.networkHospitals];
//     updated[index] = { ...updated[index], [field]: value };
//     setPolicy((prev) => ({ ...prev, networkHospitals: updated }));
//   };

//   const addHospital = () => {
//     setPolicy((prev) => ({
//       ...prev,
//       networkHospitals: [
//         ...(prev.networkHospitals || []),
//         { name: "", city: "", distance: "" },
//       ],
//     }));
//   };

//   const removeHospital = (index) => {
//     if (policy.networkHospitals.length <= 1) return;

//     setPolicy((prev) => ({
//       ...prev,
//       networkHospitals: prev.networkHospitals.filter(
//         (_, i) => i !== index
//       ),
//     }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       // Validate hospitals
//       const validHospitals = policy.networkHospitals.filter(
//         (h) => h.name?.trim() && h.city?.trim()
//       );

//       if (validHospitals.length === 0) {
//         setError("At least one valid hospital is required.");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         policyName: policy.policyName,
//         premiumDetails: {
//           amountPerEmployee: Number(
//             policy.premiumDetails?.amountPerEmployee
//           ),
//           totalPremium: Number(
//             policy.premiumDetails?.totalPremium
//           ),
//         },
//         networkHospitals: validHospitals,
//       };

//       const res = await axios.put(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.data?.success) {
//         if (onSuccess) onSuccess(res.data.data);
//         onClose();
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to update policy"
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
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         Edit Policy – {policy?.policyId || ""}
//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>
//         {initialLoading ? (
//           <Stack alignItems="center" py={5}>
//             <CircularProgress />
//           </Stack>
//         ) : policy ? (
//           <Stack spacing={3}>
//             {error && <Alert severity="error">{error}</Alert>}

//             {/* ================= BASIC INFO ================= */}
//             <Paper sx={{ p: 3 }}>
//               <Typography fontWeight={600} mb={2}>
//                 Basic Information
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Policy ID"
//                     fullWidth
//                     value={policy.policyId || ""}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Insurer"
//                     fullWidth
//                     value={policy.insurer || ""}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Policy Number"
//                     fullWidth
//                     value={policy.policyNumber || ""}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Coverage Amount"
//                     fullWidth
//                     value={policy.coverageAmount || ""}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField
//                     label="Policy Name"
//                     fullWidth
//                     value={policy.policyName || ""}
//                     onChange={(e) =>
//                       handleChange(
//                         "policyName",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* ================= PREMIUM ================= */}
//             <Paper sx={{ p: 3 }}>
//               <Typography fontWeight={600} mb={2}>
//                 Premium Details
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Amount Per Employee"
//                     type="number"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.amountPerEmployee || ""
//                     }
//                     onChange={(e) =>
//                       handlePremiumChange(
//                         "amountPerEmployee",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Total Premium"
//                     type="number"
//                     fullWidth
//                     value={
//                       policy.premiumDetails?.totalPremium ||
//                       ""
//                     }
//                     onChange={(e) =>
//                       handlePremiumChange(
//                         "totalPremium",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Payment Frequency"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.paymentFrequency || ""
//                     }
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Payment Status"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.paymentStatus || ""
//                     }
//                     disabled
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* ================= NETWORK HOSPITALS ================= */}
//             <Paper sx={{ p: 3 }}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Typography fontWeight={600}>
//                   Network Hospitals
//                 </Typography>

//                 <Button
//                   startIcon={<AddIcon />}
//                   onClick={addHospital}
//                 >
//                   Add
//                 </Button>
//               </Stack>

//               <Divider sx={{ my: 2 }} />

//               {policy.networkHospitals?.map(
//                 (hospital, index) => (
//                   <Grid
//                     container
//                     spacing={2}
//                     key={index}
//                     sx={{ mb: 2 }}
//                   >
//                     <Grid item xs={4}>
//                       <TextField
//                         label="Hospital Name"
//                         fullWidth
//                         value={hospital.name || ""}
//                         onChange={(e) =>
//                           handleHospitalChange(
//                             index,
//                             "name",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={4}>
//                       <TextField
//                         label="City"
//                         fullWidth
//                         value={hospital.city || ""}
//                         onChange={(e) =>
//                           handleHospitalChange(
//                             index,
//                             "city",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={3}>
//                       <TextField
//                         label="Distance"
//                         fullWidth
//                         value={hospital.distance || ""}
//                         onChange={(e) =>
//                           handleHospitalChange(
//                             index,
//                             "distance",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={1}>
//                       <IconButton
//                         color="error"
//                         disabled={
//                           policy.networkHospitals.length <= 1
//                         }
//                         onClick={() =>
//                           removeHospital(index)
//                         }
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Grid>
//                   </Grid>
//                 )
//               )}
//             </Paper>
//           </Stack>
//         ) : null}
//       </DialogContent>

//       <DialogActions sx={{ p: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || initialLoading}
//           sx={{ background: HEADER_GRADIENT }}
//         >
//           {loading ? (
//             <CircularProgress size={20} sx={{ color: "#fff" }} />
//           ) : (
//             "Update Policy"
//           )}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditPolicy;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Grid,
//   Typography,
//   Stack,
//   IconButton,
//   Paper,
//   Alert,
//   CircularProgress,
//   Divider,
//   Box,
//   Avatar,
//   InputAdornment,
//   alpha,
//   Tooltip,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   styled,
//   stepConnectorClasses,
//   Chip
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon,
//   Business as BusinessIcon,
//   Payment as PaymentIcon,
//   LocalHospital as HospitalIcon,
//   Verified as VerifiedIcon,
//   Info as InfoIcon,
//   LocationOn as LocationIcon,
//   Phone as PhoneIcon,
//   MonetizationOn as MoneyIcon,
//   CalendarToday as CalendarIcon,
//   Person as PersonIcon
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// // Custom styled connector for stepper
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0e7490 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0e7490 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0e7490 100%)";
// const PRIMARY_BLUE = "#0284c7";
// const TEXT_COLOR_MAIN = "#0f172a";
// const TEXT_COLOR_SECONDARY = "#64748B";
// const LIGHT_BG = "#f8fafc";

// const steps = [
//   "Basic Information",
//   "Premium Details",
//   "Network Hospitals"
// ];

// const EditPolicy = ({ open, onClose, policyId, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [policy, setPolicy] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);

//   /* ================= RESET ================= */
//   const resetState = () => {
//     setPolicy(null);
//     setError("");
//     setLoading(false);
//     setActiveStep(0);
//   };

//   useEffect(() => {
//     if (open && policyId) fetchPolicy();
//     if (!open) resetState();
//   }, [open, policyId]);

//   /* ================= FETCH POLICY ================= */
//   const fetchPolicy = async () => {
//     try {
//       setInitialLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data?.success) {
//         setPolicy(res.data.data);
//       } else {
//         setError("Policy not found");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load policy"
//       );
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   /* ================= HANDLERS ================= */

//   const handleChange = (field, value) => {
//     setPolicy((prev) => ({ ...prev, [field]: value }));
//   };

//   const handlePremiumChange = (field, value) => {
//     setPolicy((prev) => ({
//       ...prev,
//       premiumDetails: {
//         ...prev.premiumDetails,
//         [field]: value,
//       },
//     }));
//   };

//   const handleHospitalChange = (index, field, value) => {
//     const updated = [...policy.networkHospitals];
//     updated[index] = { ...updated[index], [field]: value };
//     setPolicy((prev) => ({ ...prev, networkHospitals: updated }));
//   };

//   const addHospital = () => {
//     setPolicy((prev) => ({
//       ...prev,
//       networkHospitals: [
//         ...(prev.networkHospitals || []),
//         { name: "", city: "", distance: "", address: "", phone: "" },
//       ],
//     }));
//   };

//   const removeHospital = (index) => {
//     if (policy.networkHospitals.length <= 1) return;

//     setPolicy((prev) => ({
//       ...prev,
//       networkHospitals: prev.networkHospitals.filter(
//         (_, i) => i !== index
//       ),
//     }));
//   };

//   const handleNext = () => {
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       // Validate hospitals
//       const validHospitals = policy.networkHospitals.filter(
//         (h) => h.name?.trim() && h.city?.trim()
//       );

//       if (validHospitals.length === 0) {
//         setError("At least one valid hospital is required.");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         policyName: policy.policyName,
//         premiumDetails: {
//           amountPerEmployee: Number(
//             policy.premiumDetails?.amountPerEmployee
//           ),
//           totalPremium: Number(
//             policy.premiumDetails?.totalPremium
//           ),
//         },
//         networkHospitals: validHospitals,
//       };

//       const res = await axios.put(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.data?.success) {
//         if (onSuccess) onSuccess(res.data.data);
//         onClose();
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to update policy"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (val) => {
//     if (!val) return "₹ 0";
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(val);
//   };

//   const InfoRow = ({ label, value, icon }) => (
//     <Stack
//       direction="row"
//       spacing={2}
//       sx={{
//         py: 1,
//         borderBottom: '1px solid #e2e8f0',
//         '&:last-child': { borderBottom: 'none' }
//       }}
//     >
//       <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 180 }}>
//         {icon && <Box sx={{ color: TEXT_COLOR_SECONDARY }}>{icon}</Box>}
//         <Typography variant="body2" sx={{ color: TEXT_COLOR_SECONDARY, fontWeight: 500 }}>
//           {label}
//         </Typography>
//       </Stack>
//       <Typography variant="body2" fontWeight={500} sx={{ color: TEXT_COLOR_MAIN }}>
//         {value}
//       </Typography>
//     </Stack>
//   );

//   const Section = ({ title, icon, children }) => (
//     <Paper
//       elevation={0}
//       sx={{
//         border: '1px solid #e2e8f0',
//         borderRadius: 2,
//         overflow: 'hidden',
//         backgroundColor: '#FFFFFF',
//       }}
//     >
//       <Box
//         sx={{
//           p: 2,
//           backgroundColor: '#f8fafc',
//           borderBottom: '1px solid #e2e8f0',
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1
//         }}
//       >
//         <Avatar sx={{ bgcolor: alpha(PRIMARY_BLUE, 0.1), width: 28, height: 28 }}>
//           {icon}
//         </Avatar>
//         <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
//           {title}
//         </Typography>
//       </Box>
//       <Box sx={{ p: 3 }}>
//         {children}
//       </Box>
//     </Paper>
//   );

//   /* ================= UI ================= */

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           overflow: 'hidden',
//           boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
//         }
//       }}
//     >
//       <DialogTitle
//         sx={{
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           fontWeight: 600,
//           fontSize: '1.1rem',
//           py: 2,
//           px: 3,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center"
//         }}
//       >
//         <Stack direction="row" spacing={1} alignItems="center">
          
//           <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#fff' }}>
//             Edit Policy • {policy?.policyId || ""}
//           </Typography>
//         </Stack>
//         <IconButton onClick={onClose} sx={{ color: "#fff", '&:hover': { bgcolor: alpha('#fff', 0.1) } }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* Stepper */}
//       {policy && !initialLoading && (
//         <Box sx={{ px: 3, pt: 3, backgroundColor: '#f8fafc' }}>
//           <Stepper
//             activeStep={activeStep}
//             alternativeLabel
//             connector={<ColorConnector />}
//             sx={{
//               '& .MuiStepLabel-label': {
//                 fontSize: '0.875rem',
//                 fontWeight: 500,
//                 color: TEXT_COLOR_SECONDARY,
//                 '&.Mui-active': {
//                   color: PRIMARY_BLUE,
//                   fontWeight: 600
//                 },
//                 '&.Mui-completed': {
//                   color: PRIMARY_BLUE
//                 }
//               }
//             }}
//           >
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Box>
//       )}

//       <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc' }}>
//         {initialLoading ? (
//           <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
//             <CircularProgress size={40} sx={{ color: PRIMARY_BLUE }} />
//             <Typography variant="body2" sx={{ mt: 2, color: TEXT_COLOR_SECONDARY }}>
//               Loading policy details...
//             </Typography>
//           </Stack>
//         ) : policy ? (
//           <Stack spacing={3}>
//             {error && (
//               <Alert
//                 severity="error"
//                 sx={{
//                   borderRadius: 2,
//                   '& .MuiAlert-icon': { color: '#ef4444' }
//                 }}
//               >
//                 {error}
//               </Alert>
//             )}

//             {/* STEP 1 - Basic Information */}
//             {activeStep === 0 && (
//               <Section title="Basic Information" icon={<BusinessIcon />}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Policy ID"
                      
//                       value={policy.policyId || ""}
//                       disabled
//                       size="small"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                         width: '250px'
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Insurer"
                      
//                       value={policy.insurer || ""}
//                       disabled
//                       size="small"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                         width: "280px"
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Policy Number"
                      
//                       value={policy.policyNumber || ""}
//                       disabled
//                       size="small"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                         width: "200px"
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Coverage Amount"
//                       value={formatCurrency(policy.coverageAmount)}
//                       disabled
//                       size="small"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                         width: "250px"
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       label="Policy Name"
//                       fullWidth
//                       value={policy.policyName || ""}
//                       onChange={(e) => handleChange("policyName", e.target.value)}
//                       required
//                       size="small"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                         width: "500px"
//                       }}
//                     />
//                   </Grid>
//                 </Grid>
//               </Section>
//             )}

//             {/* STEP 2 - Premium Details */}
//             {activeStep === 1 && (
//               <Section title="Premium Details" icon={<PaymentIcon />}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Amount Per Employee"
//                       type="number"
                     
//                       required
//                       value={policy.premiumDetails?.amountPerEmployee || ""}
//                       onChange={(e) => handlePremiumChange("amountPerEmployee", e.target.value)}
//                       size="small"
//                       InputProps={{
//                         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                         width: "180px"
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Total Premium"
//                       type="number"
                     
//                       required
//                       value={policy.premiumDetails?.totalPremium || ""}
//                       onChange={(e) => handlePremiumChange("totalPremium", e.target.value)}
//                       size="small"
//                       InputProps={{
//                         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                          width: "180px"
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Payment Frequency"
                      
//                       value={policy.premiumDetails?.paymentFrequency || ""}
//                       disabled
//                       size="small"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                          width: "180px"
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Payment Status"
                      
//                       value={policy.premiumDetails?.paymentStatus || ""}
//                       disabled
//                       size="small"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           backgroundColor: '#fff'
//                         },
//                          width: "180px"
//                       }}
//                     />
//                   </Grid>
//                 </Grid>
//               </Section>
//             )}

//             {/* STEP 3 - Network Hospitals */}
//             {activeStep === 2 && (
//               <Section title="Network Hospitals" icon={<HospitalIcon />}>
//                 <Stack spacing={2}>
//                   <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                     <Button
//                       variant="contained"
//                       startIcon={<AddIcon />}
//                       onClick={addHospital}
//                       sx={{
//                         height: 36,
//                         borderRadius: 1.5,
//                         background: HEADER_GRADIENT,
//                         fontSize: '0.875rem',
//                         fontWeight: 500,
//                         textTransform: 'none',
//                         boxShadow: 'none',
//                         '&:hover': {
//                           background: HEADER_GRADIENT,
//                           opacity: 0.9,
//                           boxShadow: 'none'
//                         }
//                       }}
//                     >
//                       Add Hospital
//                     </Button>
//                   </Box>

//                   {policy.networkHospitals?.map((hospital, index) => (
//                     <Paper
//                       key={index}
//                       elevation={0}
//                       sx={{
//                         border: '1px solid #e2e8f0',
//                         borderRadius: 2,
//                         overflow: 'hidden',
//                         backgroundColor: '#FFFFFF',
//                         position: "relative",
//                         transition: "all 0.2s ease",
//                         "&:hover": {
//                           boxShadow: `0 4px 12px ${alpha(PRIMARY_BLUE, 0.1)}`,
//                           borderColor: PRIMARY_BLUE,
//                         },
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           p: 1.5,
//                           backgroundColor: '#f8fafc',
//                           borderBottom: '1px solid #e2e8f0',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'space-between'
//                         }}
//                       >
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Avatar sx={{ bgcolor: alpha(PRIMARY_BLUE, 0.1), width: 28, height: 28 }}>
//                             <HospitalIcon sx={{ color: PRIMARY_BLUE, fontSize: 16 }} />
//                           </Avatar>
//                           <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
//                             Hospital {index + 1}
//                           </Typography>
//                           {!hospital.name && !hospital.city && (
//                             <Chip
//                               label="New"
//                               size="small"
//                               sx={{
//                                 bgcolor: alpha(PRIMARY_BLUE, 0.1),
//                                 color: PRIMARY_BLUE,
//                                 fontWeight: 500,
//                                 fontSize: '0.7rem',
//                                 height: 20
//                               }}
//                             />
//                           )}
//                         </Box>
//                         {policy.networkHospitals.length > 1 && (
//                           <Tooltip title="Remove Hospital">
//                             <IconButton
//                               onClick={() => removeHospital(index)}
//                               size="small"
//                               sx={{
//                                 color: '#ef4444',
//                                 '&:hover': {
//                                   bgcolor: alpha('#ef4444', 0.1)
//                                 }
//                               }}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         )}
//                       </Box>
//                       <Box sx={{ p: 2 }}>
//                         <Grid container spacing={2}>
//                           <Grid item xs={12} md={4}>
//                             <TextField
//                               label="Hospital Name"
//                               fullWidth
//                               required
//                               value={hospital.name || ""}
//                               onChange={(e) => handleHospitalChange(index, "name", e.target.value)}
//                               size="small"
//                               sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                   borderRadius: 1.5,
//                                   backgroundColor: '#fff'
//                                 }
//                               }}
//                             />
//                           </Grid>
//                           <Grid item xs={12} md={4}>
//                             <TextField
//                               label="City"
//                               fullWidth
//                               required
//                               value={hospital.city || ""}
//                               onChange={(e) => handleHospitalChange(index, "city", e.target.value)}
//                               size="small"
//                               sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                   borderRadius: 1.5,
//                                   backgroundColor: '#fff'
//                                 }
//                               }}
//                             />
//                           </Grid>
//                           <Grid item xs={12} md={4}>
//                             <TextField
//                               label="Distance"
//                               fullWidth
//                               value={hospital.distance || ""}
//                               onChange={(e) => handleHospitalChange(index, "distance", e.target.value)}
//                               size="small"
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <LocationIcon sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                   borderRadius: 1.5,
//                                   backgroundColor: '#fff'
//                                 }
//                               }}
//                             />
//                           </Grid>
//                           <Grid item xs={12} md={6}>
//                             <TextField
//                               label="Address"
                              
//                               multiline
                              
//                               value={hospital.address || ""}
//                               onChange={(e) => handleHospitalChange(index, "address", e.target.value)}
//                               size="small"
//                               sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                   borderRadius: 1.5,
//                                   backgroundColor: '#fff'
//                                 },
//                                  width: "450px"
//                               }}
//                             />
//                           </Grid>
//                           <Grid item xs={12} md={6}>
//                             <TextField
//                               label="Phone"
//                               fullWidth
//                               value={hospital.phone || ""}
//                               onChange={(e) => handleHospitalChange(index, "phone", e.target.value)}
//                               size="small"
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <PhoneIcon sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                   borderRadius: 1.5,
//                                   backgroundColor: '#fff'
//                                 }
//                               }}
//                             />
//                           </Grid>
//                         </Grid>
//                       </Box>
//                     </Paper>
//                   ))}
//                 </Stack>
//               </Section>
//             )}
//           </Stack>
//         ) : null}
//       </DialogContent>

//       <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
//         <Button
//           onClick={onClose}
//           variant="outlined"
//           sx={{
//             borderRadius: 1.5,
//             textTransform: 'none',
//             fontWeight: 500,
//             borderColor: '#e2e8f0',
//             color: TEXT_COLOR_SECONDARY,
//             '&:hover': {
//               borderColor: PRIMARY_BLUE,
//               bgcolor: alpha(PRIMARY_BLUE, 0.04)
//             }
//           }}
//         >
//           Cancel
//         </Button>

//         <Box sx={{ flex: 1 }} />

//         {activeStep > 0 && (
//           <Button
//             onClick={handleBack}
//             variant="outlined"
//             sx={{
//               borderRadius: 1.5,
//               textTransform: 'none',
//               fontWeight: 500,
//               borderColor: '#e2e8f0',
//               color: TEXT_COLOR_SECONDARY,
//               mr: 1
//             }}
//           >
//             Back
//           </Button>
//         )}

//         {activeStep < steps.length - 1 ? (
//           <Button
//             variant="contained"
//             onClick={handleNext}
//             sx={{
//               borderRadius: 1.5,
//               textTransform: 'none',
//               fontWeight: 500,
//               background: HEADER_GRADIENT,
//               boxShadow: 'none',
//               '&:hover': {
//                 background: HEADER_GRADIENT,
//                 opacity: 0.9,
//                 boxShadow: 'none'
//               }
//             }}
//           >
//             Next
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//             sx={{
//               borderRadius: 1.5,
//               textTransform: 'none',
//               fontWeight: 500,
//               background: HEADER_GRADIENT,
//               minWidth: 120,
//               boxShadow: 'none',
//               '&:hover': {
//                 background: HEADER_GRADIENT,
//                 opacity: 0.9,
//                 boxShadow: 'none'
//               }
//             }}
//           >
//             {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Update Policy"}
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditPolicy;


import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Stack,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Box,
  Avatar,
  InputAdornment,
  alpha,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  stepConnectorClasses,
  Chip,
  FormHelperText
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  LocalHospital as HospitalIcon,
  Verified as VerifiedIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  MonetizationOn as MoneyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

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

// Custom Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: COLORS.border,
    borderRadius: 1,
  },
}));

const steps = ["Basic Information", "Premium Details", "Network Hospitals"];

const EditPolicy = ({ open, onClose, policyId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");
  const [policy, setPolicy] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const resetState = () => {
    setPolicy(null);
    setError("");
    setLoading(false);
    setActiveStep(0);
    setFieldErrors({});
    setTouched({});
  };

  useEffect(() => {
    if (open && policyId) fetchPolicy();
    if (!open) resetState();
  }, [open, policyId]);

  const fetchPolicy = async () => {
    try {
      setInitialLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/mediclaim/policies/${policyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setPolicy(res.data.data);
      } else {
        setError("Policy not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load policy");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setPolicy((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePremiumChange = (field, value) => {
    setPolicy((prev) => ({
      ...prev,
      premiumDetails: { ...prev.premiumDetails, [field]: value },
    }));
    if (fieldErrors[`premiumDetails.${field}`]) setFieldErrors(prev => ({ ...prev, [`premiumDetails.${field}`]: '' }));
  };

  const handleHospitalChange = (index, field, value) => {
    const updated = [...policy.networkHospitals];
    updated[index] = { ...updated[index], [field]: value };
    setPolicy((prev) => ({ ...prev, networkHospitals: updated }));
  };

  const addHospital = () => {
    setPolicy((prev) => ({
      ...prev,
      networkHospitals: [
        ...(prev.networkHospitals || []),
        { name: "", city: "", distance: "", address: "", phone: "" },
      ],
    }));
  };

  const removeHospital = (index) => {
    if (policy.networkHospitals.length <= 1) return;
    setPolicy((prev) => ({
      ...prev,
      networkHospitals: prev.networkHospitals.filter((_, i) => i !== index),
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateStep = () => {
    const errors = {};
    let isValid = true;

    if (activeStep === 0 && !policy?.policyName?.trim()) {
      errors.policyName = "Policy name is required";
      isValid = false;
    }

    if (activeStep === 1) {
      if (!policy?.premiumDetails?.amountPerEmployee) {
        errors["premiumDetails.amountPerEmployee"] = "Amount per employee is required";
        isValid = false;
      }
      if (!policy?.premiumDetails?.totalPremium) {
        errors["premiumDetails.totalPremium"] = "Total premium is required";
        isValid = false;
      }
    }

    setFieldErrors(errors);
    if (!isValid) setError("Please fill in all required fields");
    else setError("");
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const validHospitals = policy.networkHospitals.filter(h => h.name?.trim() && h.city?.trim());

      if (validHospitals.length === 0) {
        setError("At least one valid hospital is required.");
        setLoading(false);
        return;
      }

      const payload = {
        policyName: policy.policyName,
        premiumDetails: {
          amountPerEmployee: Number(policy.premiumDetails?.amountPerEmployee),
          totalPremium: Number(policy.premiumDetails?.totalPremium),
        },
        networkHospitals: validHospitals,
      };

      const res = await axios.put(`${BASE_URL}/api/mediclaim/policies/${policyId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update policy");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return "₹ 0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
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

  const getErrorProps = (field) => {
    const hasError = touched[field] && fieldErrors[field];
    return { error: !!hasError, helperText: hasError || '' };
  };

  const Section = ({ title, icon, children }) => (
    <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primaryLight }}>
          {icon}
        </Avatar>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>{title}</Typography>
      </Box>
      {children}
    </Paper>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Policy
          </Typography>
          {policy?.policyId && (
            <Chip
              label={policy.policyId}
              size="small"
              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      {policy && !initialLoading && (
        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        {initialLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Loading policy details...</Typography>
          </Box>
        ) : policy ? (
          <Stack spacing={2.5}>
            {error && <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>}

            {activeStep === 0 && (
              <Section title="Basic Information" icon={<BusinessIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Policy ID</Typography>
                    <TextField fullWidth value={policy.policyId || ""} disabled size="small" sx={inputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Insurer</Typography>
                    <TextField fullWidth value={policy.insurer || ""} disabled size="small" sx={inputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Policy Number</Typography>
                    <TextField fullWidth value={policy.policyNumber || ""} disabled size="small" sx={inputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Coverage Amount</Typography>
                    <TextField fullWidth value={formatCurrency(policy.coverageAmount)} disabled size="small" sx={inputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={labelStyle}>Policy Name *</Typography>
                    <TextField
                      fullWidth
                      value={policy.policyName || ""}
                      onChange={(e) => handleChange("policyName", e.target.value)}
                      onBlur={() => handleBlur("policyName")}
                      error={touched.policyName && !!fieldErrors.policyName}
                      helperText={touched.policyName ? fieldErrors.policyName : ''}
                      size="small"
                      sx={inputStyle}
                    />
                  </Grid>
                </Grid>
              </Section>
            )}

            {activeStep === 1 && (
              <Section title="Premium Details" icon={<PaymentIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Amount Per Employee *</Typography>
                    <TextField
                      type="number"
                      fullWidth
                      required
                      value={policy.premiumDetails?.amountPerEmployee || ""}
                      onChange={(e) => handlePremiumChange("amountPerEmployee", e.target.value)}
                      onBlur={() => handleBlur("premiumDetails.amountPerEmployee")}
                      error={touched["premiumDetails.amountPerEmployee"] && !!fieldErrors["premiumDetails.amountPerEmployee"]}
                      helperText={touched["premiumDetails.amountPerEmployee"] ? fieldErrors["premiumDetails.amountPerEmployee"] : ''}
                      size="small"
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Total Premium *</Typography>
                    <TextField
                      type="number"
                      fullWidth
                      required
                      value={policy.premiumDetails?.totalPremium || ""}
                      onChange={(e) => handlePremiumChange("totalPremium", e.target.value)}
                      onBlur={() => handleBlur("premiumDetails.totalPremium")}
                      error={touched["premiumDetails.totalPremium"] && !!fieldErrors["premiumDetails.totalPremium"]}
                      helperText={touched["premiumDetails.totalPremium"] ? fieldErrors["premiumDetails.totalPremium"] : ''}
                      size="small"
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Payment Frequency</Typography>
                    <TextField fullWidth value={policy.premiumDetails?.paymentFrequency || ""} disabled size="small" sx={inputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Payment Status</Typography>
                    <TextField fullWidth value={policy.premiumDetails?.paymentStatus || ""} disabled size="small" sx={inputStyle} />
                  </Grid>
                </Grid>
              </Section>
            )}

            {activeStep === 2 && (
              <Section title="Network Hospitals" icon={<HospitalIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon sx={{ fontSize: '0.9rem' }} />}
                      onClick={addHospital}
                      sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none' }}
                    >
                      Add Hospital
                    </Button>
                  </Box>

                  {policy.networkHospitals?.map((hospital, index) => (
                    <Paper key={index} sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, position: 'relative', transition: 'all 0.2s', '&:hover': { borderColor: COLORS.primary, boxShadow: `0 4px 12px ${alpha(COLORS.primary, 0.1)}` } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primaryLight }}>
                            <HospitalIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>Hospital {index + 1}</Typography>
                        </Box>
                        {policy.networkHospitals.length > 1 && (
                          <IconButton size="small" onClick={() => removeHospital(index)} sx={{ color: '#EF4444' }}>
                            <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                          </IconButton>
                        )}
                      </Box>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={labelStyle}>Hospital Name *</Typography>
                          <TextField fullWidth value={hospital.name || ""} onChange={(e) => handleHospitalChange(index, "name", e.target.value)} size="small" sx={inputStyle} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={labelStyle}>City *</Typography>
                          <TextField fullWidth value={hospital.city || ""} onChange={(e) => handleHospitalChange(index, "city", e.target.value)} size="small" sx={inputStyle} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={labelStyle}>Distance</Typography>
                          <TextField fullWidth value={hospital.distance || ""} onChange={(e) => handleHospitalChange(index, "distance", e.target.value)} size="small" InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} /></InputAdornment> }} sx={inputStyle} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography sx={labelStyle}>Address</Typography>
                          <TextField fullWidth multiline rows={2} value={hospital.address || ""} onChange={(e) => handleHospitalChange(index, "address", e.target.value)} size="small" sx={inputStyle} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography sx={labelStyle}>Phone</Typography>
                          <TextField fullWidth value={hospital.phone || ""} onChange={(e) => handleHospitalChange(index, "phone", e.target.value)} size="small" InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} /></InputAdornment> }} sx={inputStyle} />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Section>
            )}
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Cancel</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Next</Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>{loading ? "Updating..." : "Update Policy"}</Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditPolicy;