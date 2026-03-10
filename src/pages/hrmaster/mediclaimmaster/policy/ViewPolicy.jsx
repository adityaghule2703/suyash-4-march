// // import React, { useEffect, useState } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   Typography,
// //   Grid,
// //   Chip,
// //   Box,
// //   Paper,
// //   Avatar,
// //   Card,
// //   CardContent,
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Stack,
// //   CircularProgress,
// //   Alert
// // } from "@mui/material";
// // import {
// //   Close as CloseIcon,
// //   Business as BusinessIcon,
// //   CalendarToday as CalendarIcon,
// //   MonetizationOn as MoneyIcon,
// //   LocalHospital as HospitalIcon,
// //   People as PeopleIcon,
// //   CheckCircle as CheckCircleIcon,
// //   Pending as PendingIcon
// // } from "@mui/icons-material";
// // import axios from "axios";
// // import BASE_URL from "../../../../config/Config";

// // const steps = ["Basic Info", "Coverage & Premium", "Hospitals & Enrollments"];

// // const PRIMARY_GRADIENT =
// //   "linear-gradient(135deg,#164e63,#0ea5e9)";

// // const ViewPolicy = ({ open, onClose, policyId }) => {
// //   const [policy, setPolicy] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [activeStep, setActiveStep] = useState(0);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     if (open && policyId) fetchPolicy();
// //   }, [open, policyId]);

// //   const fetchPolicy = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");
// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(
// //         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       if (res.data.success) {
// //         setPolicy({
// //           ...res.data.data,
// //           networkHospitals: res.data.data.networkHospitals || [],
// //           enrollments: res.data.data.enrollments || []
// //         });
// //       }
// //     } catch (err) {
// //       setError("Failed to load policy details");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const formatDate = (date) =>
// //     date ? new Date(date).toLocaleDateString("en-IN") : "-";

// //   const formatCurrency = (val) =>
// //     `₹ ${Number(val || 0).toLocaleString("en-IN")}`;

// //   const getStatusChip = (status) => {
// //     if (status === "active")
// //       return (
// //         <Chip
// //           label="Active"
// //           icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
// //           sx={{
// //             backgroundColor: "#E8F5E9",
// //             color: "#2E7D32",
// //             fontWeight: 600
// //           }}
// //         />
// //       );

// //     return (
// //       <Chip
// //         label="Inactive"
// //         icon={<PendingIcon sx={{ fontSize: 14 }} />}
// //         sx={{
// //           backgroundColor: "#FFEBEE",
// //           color: "#C62828",
// //           fontWeight: 600
// //         }}
// //       />
// //     );
// //   };

// //   const StatCard = ({ icon, label, value, color }) => (
// //     <Card
// //       sx={{
// //         backgroundColor: "#F8FAFC",
// //         border: "1px solid #E0E0E0",
// //         borderRadius: 1,
// //         boxShadow: "none"
// //       }}
// //     >
// //       <CardContent
// //         sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}
// //       >
// //         <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
// //           {icon}
// //         </Avatar>
// //         <Box>
// //           <Typography variant="caption" sx={{ color: "#666" }}>
// //             {label}
// //           </Typography>
// //           <Typography variant="body2" fontWeight={600}>
// //             {value}
// //           </Typography>
// //         </Box>
// //       </CardContent>
// //     </Card>
// //   );

// //   const Section = ({ title, children }) => (
// //     <Paper
// //       sx={{
// //         p: 2,
// //         border: "1px solid #E0E0E0",
// //         borderRadius: 1
// //       }}
// //     >
// //       <Typography
// //         variant="subtitle2"
// //         sx={{ mb: 1, fontWeight: 600, color: "#1976D2" }}
// //       >
// //         {title}
// //       </Typography>
// //       {children}
// //     </Paper>
// //   );

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// //       <DialogTitle
// //         sx={{
// //           background: PRIMARY_GRADIENT,
// //           color: "#fff",
// //           fontWeight: 600
// //         }}
// //       >
// //         Policy Details – {policy?.policyId || ""}
// //       </DialogTitle>

// //       {policy && (
// //         <Box sx={{ px: 4, pt: 3 }}>
// //           <Stepper activeStep={activeStep} alternativeLabel>
// //             {steps.map((label) => (
// //               <Step key={label}>
// //                 <StepLabel>{label}</StepLabel>
// //               </Step>
// //             ))}
// //           </Stepper>
// //         </Box>
// //       )}

// //       <DialogContent sx={{ px: 4, py: 3 }}>
// //         {loading ? (
// //           <Stack alignItems="center" py={4}>
// //             <CircularProgress />
// //           </Stack>
// //         ) : error ? (
// //           <Alert severity="error">{error}</Alert>
// //         ) : policy ? (
// //           <Stack spacing={3}>
// //             {/* STEP 1 */}
// //             {activeStep === 0 && (
// //               <>
// //                 <Grid container spacing={2}>
// //                   <Grid item xs={3}>
// //                     <StatCard
// //                       icon={<BusinessIcon />}
// //                       label="Insurer"
// //                       value={policy.insurer}
// //                       color="#1976D2"
// //                     />
// //                   </Grid>
// //                   <Grid item xs={3}>
// //                     <StatCard
// //                       icon={<MoneyIcon />}
// //                       label="Coverage"
// //                       value={formatCurrency(policy.coverageAmount)}
// //                       color="#2E7D32"
// //                     />
// //                   </Grid>
// //                   <Grid item xs={3}>
// //                     <StatCard
// //                       icon={<CalendarIcon />}
// //                       label="Validity"
// //                       value={formatDate(policy.validityEnd)}
// //                       color="#F44336"
// //                     />
// //                   </Grid>
// //                   <Grid item xs={3}>
// //                     <StatCard
// //                       icon={<CheckCircleIcon />}
// //                       label="Status"
// //                       value={getStatusChip(policy.status)}
// //                       color="#FF9800"
// //                     />
// //                   </Grid>
// //                 </Grid>

// //                 <Section title="Basic Information">
// //                   <Typography><b>Policy Name:</b> {policy.policyName}</Typography>
// //                   <Typography><b>Policy Number:</b> {policy.policyNumber}</Typography>
// //                   <Typography>
// //                     <b>Validity:</b> {formatDate(policy.validityStart)} -{" "}
// //                     {formatDate(policy.validityEnd)}
// //                   </Typography>
// //                 </Section>
// //               </>
// //             )}

// //             {/* STEP 2 */}
// //             {activeStep === 1 && (
// //               <Section title="Premium & Coverage">
// //                 <Typography>
// //                   <b>Amount Per Employee:</b>{" "}
// //                   {formatCurrency(policy.premiumDetails?.amountPerEmployee)}
// //                 </Typography>
// //                 <Typography>
// //                   <b>Total Premium:</b>{" "}
// //                   {formatCurrency(policy.premiumDetails?.totalPremium)}
// //                 </Typography>
// //                 <Typography>
// //                   <b>Payment Frequency:</b>{" "}
// //                   {policy.premiumDetails?.paymentFrequency}
// //                 </Typography>
// //                 <Typography>
// //                   <b>Payment Status:</b>{" "}
// //                   {policy.premiumDetails?.paymentStatus}
// //                 </Typography>

// //                 <Box mt={2}>
// //                   <Typography fontWeight={600}>Family Coverage:</Typography>
// //                   <Stack direction="row" spacing={1} mt={1}>
// //                     {policy.familyCoverage?.spouse && (
// //                       <Chip label="Spouse" />
// //                     )}
// //                     {policy.familyCoverage?.children && (
// //                       <Chip label="Children" />
// //                     )}
// //                     {policy.familyCoverage?.parents && (
// //                       <Chip label="Parents" />
// //                     )}
// //                   </Stack>
// //                 </Box>
// //               </Section>
// //             )}

// //             {/* STEP 3 */}
// //             {activeStep === 2 && (
// //               <>
// //                 <Section title="Network Hospitals">
// //                   {policy.networkHospitals.length === 0 ? (
// //                     <Typography>No hospitals listed</Typography>
// //                   ) : (
// //                     policy.networkHospitals.map((h, i) => (
// //                       <Paper key={i} sx={{ p: 1.5, mb: 1 }}>
// //                         <Typography fontWeight={600}>{h.name}</Typography>
// //                         <Typography variant="body2">{h.city}</Typography>
// //                       </Paper>
// //                     ))
// //                   )}
// //                 </Section>

// //                 <Section title="Enrollments">
// //                   {policy.enrollments.length === 0 ? (
// //                     <Typography>No enrollments found</Typography>
// //                   ) : (
// //                     policy.enrollments.map((e) => (
// //                       <Paper key={e._id} sx={{ p: 1.5, mb: 1 }}>
// //                         <Typography>
// //                           {e.employeeId?.FirstName}{" "}
// //                           {e.employeeId?.LastName}
// //                         </Typography>
// //                         <Chip
// //                           label={e.status}
// //                           size="small"
// //                           color={
// //                             e.status === "active"
// //                               ? "success"
// //                               : "error"
// //                           }
// //                         />
// //                       </Paper>
// //                     ))
// //                   )}
// //                 </Section>
// //               </>
// //             )}
// //           </Stack>
// //         ) : null}
// //       </DialogContent>

// //       <DialogActions sx={{ px: 4, pb: 3 }}>
// //         <Button onClick={onClose}>Close</Button>

// //         {activeStep > 0 && (
// //           <Button onClick={() => setActiveStep((prev) => prev - 1)}>
// //             Back
// //           </Button>
// //         )}

// //         {activeStep < 2 && (
// //           <Button
// //             variant="contained"
// //             onClick={() => setActiveStep((prev) => prev + 1)}
// //           >
// //             Next
// //           </Button>
// //         )}
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default ViewPolicy;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Grid,
//   Chip,
//   Box,
//   Paper,
//   Avatar,
//   Card,
//   CardContent,
//   Stepper,
//   Step,
//   StepLabel,
//   Stack,
//   CircularProgress,
//   Alert,
//   IconButton
// } from "@mui/material";
// import {
//   Close as CloseIcon,
//   Business as BusinessIcon,
//   CalendarToday as CalendarIcon,
//   MonetizationOn as MoneyIcon,
//   CheckCircle as CheckCircleIcon,
//   Pending as PendingIcon,
//   Cancel as CancelIcon
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const steps = [
//   "Basic Info",
//   "Coverage & Premium",
//   "Hospitals & Enrollments"
// ];

// const PRIMARY_GRADIENT =
//   "linear-gradient(135deg,#164e63,#0ea5e9)";

// const ViewPolicy = ({ open, onClose, policyId }) => {
//   const [policy, setPolicy] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeStep, setActiveStep] = useState(0);
//   const [error, setError] = useState("");

//   /* ================= RESET ================= */
//   const resetState = () => {
//     setPolicy(null);
//     setActiveStep(0);
//     setError("");
//   };

//   useEffect(() => {
//     if (open && policyId) fetchPolicy();
//     if (!open) resetState();
//   }, [open, policyId]);

//   /* ================= FETCH ================= */
//   const fetchPolicy = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data?.success) {
//         setPolicy({
//           ...res.data.data,
//           networkHospitals:
//             res.data.data.networkHospitals || [],
//           enrollments: res.data.data.enrollments || []
//         });
//       } else {
//         setError("Policy not found");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to load policy details"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= HELPERS ================= */

//   const formatDate = (date) => {
//     if (!date) return "-";
//     try {
//       return new Date(date).toLocaleDateString("en-IN");
//     } catch {
//       return "-";
//     }
//   };

//   const formatCurrency = (val) =>
//     `₹ ${Number(val || 0).toLocaleString("en-IN")}`;

//   const getStatusChip = (status) => {
//     const map = {
//       active: {
//         label: "Active",
//         color: "#2E7D32",
//         bg: "#E8F5E9",
//         icon: <CheckCircleIcon sx={{ fontSize: 14 }} />
//       },
//       expired: {
//         label: "Expired",
//         color: "#C62828",
//         bg: "#FFEBEE",
//         icon: <CancelIcon sx={{ fontSize: 14 }} />
//       },
//       cancelled: {
//         label: "Cancelled",
//         color: "#6A1B9A",
//         bg: "#F3E5F5",
//         icon: <CancelIcon sx={{ fontSize: 14 }} />
//       },
//       draft: {
//         label: "Draft",
//         color: "#EF6C00",
//         bg: "#FFF3E0",
//         icon: <PendingIcon sx={{ fontSize: 14 }} />
//       }
//     };

//     const config = map[status] || map["draft"];

//     return (
//       <Chip
//         label={config.label}
//         icon={config.icon}
//         sx={{
//           backgroundColor: config.bg,
//           color: config.color,
//           fontWeight: 600
//         }}
//       />
//     );
//   };

//   const StatCard = ({ icon, label, value, color }) => (
//     <Card
//       sx={{
//         backgroundColor: "#F8FAFC",
//         border: "1px solid #E0E0E0",
//         borderRadius: 1,
//         boxShadow: "none"
//       }}
//     >
//       <CardContent
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 1.5,
//           p: 1.5
//         }}
//       >
//         <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
//           {icon}
//         </Avatar>
//         <Box>
//           <Typography
//             variant="caption"
//             sx={{ color: "#666" }}
//           >
//             {label}
//           </Typography>
//           <Typography variant="body2" fontWeight={600}>
//             {value}
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   const Section = ({ title, children }) => (
//     <Paper
//       sx={{
//         p: 2,
//         border: "1px solid #E0E0E0",
//         borderRadius: 1
//       }}
//     >
//       <Typography
//         variant="subtitle2"
//         sx={{
//           mb: 1,
//           fontWeight: 600,
//           color: "#1976D2"
//         }}
//       >
//         {title}
//       </Typography>
//       {children}
//     </Paper>
//   );

//   /* ================= UI ================= */

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{
//           background: PRIMARY_GRADIENT,
//           color: "#fff",
//           fontWeight: 600,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center"
//         }}
//       >
//         Policy Details – {policy?.policyId || ""}
//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {policy && (
//         <Box sx={{ px: 4, pt: 3 }}>
//           <Stepper activeStep={activeStep} alternativeLabel>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Box>
//       )}

//       <DialogContent sx={{ px: 4, py: 3 }}>
//         {loading ? (
//           <Stack alignItems="center" py={4}>
//             <CircularProgress />
//           </Stack>
//         ) : error ? (
//           <Alert severity="error">{error}</Alert>
//         ) : policy ? (
//           <Stack spacing={3}>
//             {/* STEP 1 */}
//             {activeStep === 0 && (
//               <>
//                 <Grid container spacing={2}>
//                   <Grid item xs={3}>
//                     <StatCard
//                       icon={<BusinessIcon />}
//                       label="Insurer"
//                       value={policy.insurer || "-"}
//                       color="#1976D2"
//                     />
//                   </Grid>

//                   <Grid item xs={3}>
//                     <StatCard
//                       icon={<MoneyIcon />}
//                       label="Coverage"
//                       value={formatCurrency(
//                         policy.coverageAmount
//                       )}
//                       color="#2E7D32"
//                     />
//                   </Grid>

//                   <Grid item xs={3}>
//                     <StatCard
//                       icon={<CalendarIcon />}
//                       label="Valid Till"
//                       value={formatDate(
//                         policy.validityEnd
//                       )}
//                       color="#F44336"
//                     />
//                   </Grid>

//                   <Grid item xs={3}>
//                     <StatCard
//                       icon={<CheckCircleIcon />}
//                       label="Status"
//                       value={getStatusChip(
//                         policy.status
//                       )}
//                       color="#FF9800"
//                     />
//                   </Grid>
//                 </Grid>

//                 <Section title="Basic Information">
//                   <Typography>
//                     <b>Policy Name:</b>{" "}
//                     {policy.policyName}
//                   </Typography>
//                   <Typography>
//                     <b>Policy Number:</b>{" "}
//                     {policy.policyNumber}
//                   </Typography>
//                   <Typography>
//                     <b>Validity:</b>{" "}
//                     {formatDate(policy.validityStart)} –{" "}
//                     {formatDate(policy.validityEnd)}
//                   </Typography>
//                 </Section>
//               </>
//             )}

//             {/* STEP 2 */}
//             {activeStep === 1 && (
//               <Section title="Premium & Coverage">
//                 <Typography>
//                   <b>Amount Per Employee:</b>{" "}
//                   {formatCurrency(
//                     policy.premiumDetails
//                       ?.amountPerEmployee
//                   )}
//                 </Typography>

//                 <Typography>
//                   <b>Total Premium:</b>{" "}
//                   {formatCurrency(
//                     policy.premiumDetails?.totalPremium
//                   )}
//                 </Typography>

//                 <Typography>
//                   <b>Payment Frequency:</b>{" "}
//                   {policy.premiumDetails
//                     ?.paymentFrequency || "-"}
//                 </Typography>

//                 <Typography>
//                   <b>Payment Status:</b>{" "}
//                   {policy.premiumDetails
//                     ?.paymentStatus || "-"}
//                 </Typography>

//                 <Box mt={2}>
//                   <Typography fontWeight={600}>
//                     Family Coverage:
//                   </Typography>
//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     mt={1}
//                   >
//                     {policy.familyCoverage?.spouse && (
//                       <Chip label="Spouse" />
//                     )}
//                     {policy.familyCoverage?.children && (
//                       <Chip label="Children" />
//                     )}
//                     {policy.familyCoverage?.parents && (
//                       <Chip label="Parents" />
//                     )}
//                   </Stack>
//                 </Box>
//               </Section>
//             )}

//             {/* STEP 3 */}
//             {activeStep === 2 && (
//               <>
//                 <Section title="Network Hospitals">
//                   {policy.networkHospitals.length ===
//                   0 ? (
//                     <Typography>
//                       No hospitals listed
//                     </Typography>
//                   ) : (
//                     policy.networkHospitals.map(
//                       (h, i) => (
//                         <Paper
//                           key={i}
//                           sx={{
//                             p: 1.5,
//                             mb: 1
//                           }}
//                         >
//                           <Typography fontWeight={600}>
//                             {h.name}
//                           </Typography>
//                           <Typography variant="body2">
//                             {h.city}
//                           </Typography>
//                           <Typography variant="caption">
//                             {h.distance}
//                           </Typography>
//                         </Paper>
//                       )
//                     )
//                   )}
//                 </Section>

//                 <Section title="Enrollments">
//                   {policy.enrollments.length === 0 ? (
//                     <Typography>
//                       No enrollments found
//                     </Typography>
//                   ) : (
//                     policy.enrollments.map((e) => (
//                       <Paper
//                         key={e._id}
//                         sx={{
//                           p: 1.5,
//                           mb: 1
//                         }}
//                       >
//                         <Typography>
//                           {e.employeeId?.FirstName}{" "}
//                           {e.employeeId?.LastName}
//                         </Typography>

//                         <Chip
//                           label={e.status}
//                           size="small"
//                           color={
//                             e.status === "active"
//                               ? "success"
//                               : "error"
//                           }
//                         />
//                       </Paper>
//                     ))
//                   )}
//                 </Section>
//               </>
//             )}
//           </Stack>
//         ) : null}
//       </DialogContent>

//       <DialogActions sx={{ px: 4, pb: 3 }}>
//         <Button onClick={onClose}>Close</Button>

//         {activeStep > 0 && (
//           <Button
//             onClick={() =>
//               setActiveStep((prev) => prev - 1)
//             }
//           >
//             Back
//           </Button>
//         )}

//         {activeStep < steps.length - 1 && (
//           <Button
//             variant="contained"
//             onClick={() =>
//               setActiveStep((prev) => prev + 1)
//             }
//           >
//             Next
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewPolicy;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
  Paper,
  Avatar,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  StepConnector,
  styled,
  stepConnectorClasses,
  alpha,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell
} from "@mui/material";
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  MonetizationOn as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  LocalHospital as HospitalIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  DateRange as DateRangeIcon,
  Verified as VerifiedIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

const steps = [
  "Basic Information",
  "Coverage & Premium",
  "Hospitals & Enrollments"
];

// Custom styled connector for stepper
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0e7490 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0e7490 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const PRIMARY_GRADIENT = "linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0e7490 100%)";
const PRIMARY_BLUE = "#0284c7";
const TEXT_COLOR_MAIN = "#0f172a";
const TEXT_COLOR_SECONDARY = "#64748B";

const ViewPolicy = ({ open, onClose, policyId }) => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");

  /* ================= RESET ================= */
  const resetState = () => {
    setPolicy(null);
    setActiveStep(0);
    setError("");
  };

  useEffect(() => {
    if (open && policyId) fetchPolicy();
    if (!open) resetState();
  }, [open, policyId]);

  /* ================= FETCH ================= */
  const fetchPolicy = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/mediclaim/policies/${policyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setPolicy({
          ...res.data.data,
          networkHospitals: res.data.data.networkHospitals || [],
          enrollments: res.data.data.enrollments || []
        });
      } else {
        setError("Policy not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load policy details");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "-";
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

  const getStatusChip = (status) => {
    const map = {
      active: {
        label: "Active",
        color: "#166534",
        bg: "#dcfce7",
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />
      },
      expired: {
        label: "Expired",
        color: "#991b1b",
        bg: "#fee2e2",
        icon: <CancelIcon sx={{ fontSize: 14 }} />
      },
      cancelled: {
        label: "Cancelled",
        color: "#6b21a8",
        bg: "#f3e8ff",
        icon: <CancelIcon sx={{ fontSize: 14 }} />
      },
      draft: {
        label: "Draft",
        color: "#b45309",
        bg: "#fef3c7",
        icon: <PendingIcon sx={{ fontSize: 14 }} />
      }
    };

    const config = map[status] || map["draft"];

    return (
      <Chip
        label={config.label}
        icon={config.icon}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24,
          borderRadius: '12px',
          '& .MuiChip-icon': {
            color: config.color,
            fontSize: 14
          }
        }}
      />
    );
  };

  const InfoCard = ({ icon, label, value, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        height: '100%',
        width: '195px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: PRIMARY_BLUE,
          boxShadow: `0 4px 12px ${alpha(PRIMARY_BLUE, 0.1)}`
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.1),
            color: color,
            width: 48,
            height: 48
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY, fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="body1" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  const Section = ({ title, icon, children }) => (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Avatar sx={{ bgcolor: alpha(PRIMARY_BLUE, 0.1), width: 28, height: 28 }}>
          {icon}
        </Avatar>
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {children}
      </Box>
    </Paper>
  );

  const InfoRow = ({ label, value, icon }) => (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        py: 1,
        borderBottom: '1px solid #e2e8f0',
        '&:last-child': { borderBottom: 'none' }
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 180 }}>
        {icon && <Box sx={{ color: TEXT_COLOR_SECONDARY }}>{icon}</Box>}
        <Typography variant="body2" sx={{ color: TEXT_COLOR_SECONDARY, fontWeight: 500 }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="body2" fontWeight={500} sx={{ color: TEXT_COLOR_MAIN }}>
        {value}
      </Typography>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: PRIMARY_GRADIENT,
          color: "#fff",
          fontWeight: 600,
          fontSize: '1.1rem',
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <VerifiedIcon sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#fff' }}>
            Policy Details • {policy?.policyId || ""}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: "#fff", '&:hover': { bgcolor: alpha('#fff', 0.1) } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      {policy && (
        <Box sx={{ px: 3, pt: 3, backgroundColor: '#f8fafc' }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorConnector />}
            sx={{
              '& .MuiStepLabel-label': {
                fontSize: '0.875rem',
                fontWeight: 500,
                color: TEXT_COLOR_SECONDARY,
                '&.Mui-active': {
                  color: PRIMARY_BLUE,
                  fontWeight: 600
                },
                '&.Mui-completed': {
                  color: PRIMARY_BLUE
                }
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc' }}>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
            <CircularProgress size={40} sx={{ color: PRIMARY_BLUE }} />
            <Typography variant="body2" sx={{ mt: 2, color: TEXT_COLOR_SECONDARY }}>
              Loading policy details...
            </Typography>
          </Stack>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              '& .MuiAlert-icon': { color: '#ef4444' }
            }}
          >
            {error}
          </Alert>
        ) : policy ? (
          <Stack spacing={3}>
            {/* STEP 1 - Basic Information */}
            {activeStep === 0 && (
              <>
                {/* Key Stats Cards */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <InfoCard
                      icon={<BusinessIcon />}
                      label="Insurer"
                      value={policy.insurer || "-"}
                      color="#0284c7"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <InfoCard
                      icon={<MoneyIcon />}
                      label="Coverage"
                      value={formatCurrency(policy.coverageAmount)}
                      color="#10b981"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <InfoCard
                      icon={<DateRangeIcon />}
                      label="Valid Till"
                      value={formatDate(policy.validityEnd)}
                      color="#f59e0b"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <InfoCard
                      icon={<InfoIcon />}
                      label="Status"
                      value={getStatusChip(policy.status)}
                      color="#8b5cf6"
                    />
                  </Grid>
                </Grid>

                {/* Basic Information Section */}
                <Section title="Basic Information" icon={<InfoIcon />}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <InfoRow
                        label="Policy Name"
                        value={policy.policyName || "-"}
                        icon={<BusinessIcon sx={{ fontSize: 16 }} />}
                      />
                      <InfoRow
                        label="Policy Number"
                        value={policy.policyNumber || "-"}
                        icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                      />
                      <InfoRow
                        label="Insurer"
                        value={policy.insurer || "-"}
                        icon={<BusinessIcon sx={{ fontSize: 16 }} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoRow
                        label="Validity Start"
                        value={formatDate(policy.validityStart)}
                        icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                      />
                      <InfoRow
                        label="Validity End"
                        value={formatDate(policy.validityEnd)}
                        icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                      />
                      <InfoRow
                        label="Coverage Amount"
                        value={formatCurrency(policy.coverageAmount)}
                        icon={<MoneyIcon sx={{ fontSize: 16 }} />}
                      />
                    </Grid>
                  </Grid>
                </Section>
              </>
            )}

            {/* STEP 2 - Coverage & Premium */}
            {activeStep === 1 && (
              <>
                {/* Premium Details */}
                <Section title="Premium Details" icon={<PaymentIcon />}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <InfoRow
                        label="Amount Per Employee"
                        value={formatCurrency(policy.premiumDetails?.amountPerEmployee)}
                        icon={<MoneyIcon sx={{ fontSize: 16 }} />}
                      />
                      <InfoRow
                        label="Payment Frequency"
                        value={policy.premiumDetails?.paymentFrequency || "-"}
                        icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoRow
                        label="Total Premium"
                        value={formatCurrency(policy.premiumDetails?.totalPremium)}
                        icon={<MoneyIcon sx={{ fontSize: 16 }} />}
                      />
                      <InfoRow
                        label="Payment Status"
                        value={
                          <Chip
                            label={policy.premiumDetails?.paymentStatus || "-"}
                            size="small"
                            sx={{
                              backgroundColor: policy.premiumDetails?.paymentStatus === 'paid' ? '#dcfce7' : '#fee2e2',
                              color: policy.premiumDetails?.paymentStatus === 'paid' ? '#166534' : '#991b1b',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              height: 24
                            }}
                          />
                        }
                        icon={<PaymentIcon sx={{ fontSize: 16 }} />}
                      />
                    </Grid>
                  </Grid>
                </Section>

                {/* Family Coverage */}
                <Section title="Family Coverage" icon={<GroupIcon />}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {policy.familyCoverage?.spouse && (
                      <Chip
                        label="Spouse"
                        icon={<PersonIcon />}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#0284c7', 0.1),
                          color: '#0284c7',
                          fontWeight: 500
                        }}
                      />
                    )}
                    {policy.familyCoverage?.children && (
                      <Chip
                        label="Children"
                        icon={<GroupIcon />}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#10b981', 0.1),
                          color: '#10b981',
                          fontWeight: 500
                        }}
                      />
                    )}
                    {policy.familyCoverage?.parents && (
                      <Chip
                        label="Parents"
                        icon={<PersonIcon />}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#f59e0b', 0.1),
                          color: '#f59e0b',
                          fontWeight: 500
                        }}
                      />
                    )}
                    {!policy.familyCoverage?.spouse && !policy.familyCoverage?.children && !policy.familyCoverage?.parents && (
                      <Typography variant="body2" sx={{ color: TEXT_COLOR_SECONDARY }}>
                        No family coverage included
                      </Typography>
                    )}
                  </Box>
                </Section>
              </>
            )}

            {/* STEP 3 - Hospitals & Enrollments */}
            {activeStep === 2 && (
              <>
                {/* Network Hospitals */}
                <Section title="Network Hospitals" icon={<HospitalIcon />}>
                  {policy.networkHospitals.length === 0 ? (
                    <Typography variant="body2" sx={{ color: TEXT_COLOR_SECONDARY, py: 2, textAlign: 'center' }}>
                      No network hospitals listed
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {policy.networkHospitals.map((hospital, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              border: '1px solid #e2e8f0',
                              borderRadius: 2,
                              backgroundColor: '#f8fafc',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: PRIMARY_BLUE,
                                boxShadow: `0 4px 12px ${alpha(PRIMARY_BLUE, 0.1)}`
                              }
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ bgcolor: alpha(PRIMARY_BLUE, 0.1), width: 40, height: 40 }}>
                                <HospitalIcon sx={{ color: PRIMARY_BLUE, fontSize: 20 }} />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
                                  {hospital.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY }}>
                                  {hospital.city} • {hospital.distance}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Section>

                {/* Enrollments */}
                <Section title="Active Enrollments" icon={<GroupIcon />}>
                  {policy.enrollments.length === 0 ? (
                    <Typography variant="body2" sx={{ color: TEXT_COLOR_SECONDARY, py: 2, textAlign: 'center' }}>
                      No enrollments found for this policy
                    </Typography>
                  ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: TEXT_COLOR_SECONDARY }}>Employee</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: TEXT_COLOR_SECONDARY }}>Enrollment ID</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: TEXT_COLOR_SECONDARY }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: TEXT_COLOR_SECONDARY }}>Start Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {policy.enrollments.slice(0, 5).map((enrollment) => (
                            <TableRow key={enrollment._id} hover>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(PRIMARY_BLUE, 0.1), fontSize: '0.7rem' }}>
                                    {enrollment.employeeId?.FirstName?.[0]}{enrollment.employeeId?.LastName?.[0]}
                                  </Avatar>
                                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                    {enrollment.employeeId?.FirstName} {enrollment.employeeId?.LastName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {enrollment.enrollmentId}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={enrollment.status}
                                  size="small"
                                  sx={{
                                    backgroundColor: enrollment.status === 'active' ? '#dcfce7' : '#fee2e2',
                                    color: enrollment.status === 'active' ? '#166534' : '#991b1b',
                                    fontWeight: 500,
                                    fontSize: '0.7rem',
                                    height: 20
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {formatDate(enrollment.startDate)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Section>
              </>
            )}
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: '#e2e8f0',
            color: TEXT_COLOR_SECONDARY,
            '&:hover': {
              borderColor: PRIMARY_BLUE,
              bgcolor: alpha(PRIMARY_BLUE, 0.04)
            }
          }}
        >
          Close
        </Button>

        <Box sx={{ flex: 1 }} />

        {activeStep > 0 && (
          <Button
            onClick={() => setActiveStep((prev) => prev - 1)}
            variant="outlined"
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              borderColor: '#e2e8f0',
              color: TEXT_COLOR_SECONDARY,
              mr: 1
            }}
          >
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setActiveStep((prev) => prev + 1)}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              background: PRIMARY_GRADIENT,
              boxShadow: 'none',
              '&:hover': {
                background: PRIMARY_GRADIENT,
                opacity: 0.9,
                boxShadow: 'none'
              }
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              background: PRIMARY_GRADIENT,
              boxShadow: 'none',
              '&:hover': {
                background: PRIMARY_GRADIENT,
                opacity: 0.9,
                boxShadow: 'none'
              }
            }}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewPolicy;