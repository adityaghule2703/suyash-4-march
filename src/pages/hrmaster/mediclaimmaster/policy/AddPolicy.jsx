// // import React, { useState } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   Typography,
// //   Stack,
// //   Grid,
// //   Switch,
// //   FormControlLabel,
// //   IconButton,
// //   Divider,
// //   Alert,
// //   CircularProgress,
// //   MenuItem,
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Box,
// // } from "@mui/material";

// // import { Close as CloseIcon } from "@mui/icons-material";
// // import axios from "axios";
// // import BASE_URL from "../../../../config/Config";

// // const HEADER_GRADIENT =
// //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // const steps = [
// //   "Basic Details",
// //   "Family Coverage",
// //   "Premium Details",
// //   "Network Hospitals",
// // ];

// // const AddPolicy = ({ open, onClose, onSuccess }) => {
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [activeStep, setActiveStep] = useState(0);

// //   const [formData, setFormData] = useState({
// //     policyName: "",
// //     insurer: "",
// //     policyNumber: "",

// //     brokerDetails: {
// //       name: "",
// //       contactPerson: "",
// //       phone: "",
// //       email: "",
// //     },

// //     coverageAmount: "",
// //     coverageType: "family_floater",

// //     validityStart: "",
// //     validityEnd: "",

// //     familyCoverage: {
// //       spouse: true,
// //       children: true,
// //       maxChildren: 2,
// //       parents: false,
// //       childAgeLimit: 25,
// //       parentAgeLimit: "",
// //     },

// //     premiumDetails: {
// //       amountPerEmployee: "",
// //       totalPremium: "",
// //       paymentFrequency: "annual",
// //       paymentDate: "",
// //       paymentMode: "",
// //       paymentStatus: "pending",
// //     },

// //     networkHospitals: [
// //       {
// //         name: "",
// //         city: "",
// //         address: "",
// //         phone: "",
// //         distance: "",
// //         type: "",
// //         empaneledDate: "",
// //       },
// //     ],
// //   });

// //   const handleChange = (field, value) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handleNestedChange = (parent, field, value) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [parent]: { ...prev[parent], [field]: value },
// //     }));
// //   };

// //   const handleDeepNestedChange = (parent, child, field, value) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [parent]: {
// //         ...prev[parent],
// //         [child]: {
// //           ...prev[parent][child],
// //           [field]: value,
// //         },
// //       },
// //     }));
// //   };

// //   const handleHospitalChange = (index, field, value) => {
// //     const updated = [...formData.networkHospitals];
// //     updated[index][field] = value;
// //     setFormData((prev) => ({ ...prev, networkHospitals: updated }));
// //   };

// //   const addHospital = () => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       networkHospitals: [
// //         ...prev.networkHospitals,
// //         {
// //           name: "",
// //           city: "",
// //           address: "",
// //           phone: "",
// //           distance: "",
// //           type: "",
// //           empaneledDate: "",
// //         },
// //       ],
// //     }));
// //   };

// //   const removeHospital = (index) => {
// //     if (formData.networkHospitals.length > 1) {
// //       const updated = formData.networkHospitals.filter((_, i) => i !== index);
// //       setFormData((prev) => ({ ...prev, networkHospitals: updated }));
// //     }
// //   };

// //   const handleNext = () => {
// //     setActiveStep((prev) => prev + 1);
// //   };

// //   const handleBack = () => {
// //     setActiveStep((prev) => prev - 1);
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const token = localStorage.getItem("token");

// //       const payload = {
// //         policyName: formData.policyName,
// //         insurer: formData.insurer,
// //         policyNumber: formData.policyNumber,

// //         brokerDetails: formData.brokerDetails,

// //         coverageAmount: Number(formData.coverageAmount),
// //         coverageType: formData.coverageType,

// //         validityStart: formData.validityStart,
// //         validityEnd: formData.validityEnd,

// //         familyCoverage: {
// //           spouse: formData.familyCoverage.spouse,
// //           children: formData.familyCoverage.children,
// //           maxChildren: Number(formData.familyCoverage.maxChildren),
// //           parents: formData.familyCoverage.parents,
// //           childAgeLimit: Number(formData.familyCoverage.childAgeLimit),
// //           ...(formData.familyCoverage.parentAgeLimit && {
// //             parentAgeLimit: Number(formData.familyCoverage.parentAgeLimit),
// //           }),
// //         },

// //         premiumDetails: {
// //           amountPerEmployee: Number(formData.premiumDetails.amountPerEmployee),
// //           totalPremium: Number(formData.premiumDetails.totalPremium),
// //           paymentFrequency: formData.premiumDetails.paymentFrequency,
// //           paymentDate: formData.premiumDetails.paymentDate,
// //           paymentMode: formData.premiumDetails.paymentMode,
// //           paymentStatus: formData.premiumDetails.paymentStatus,
// //         },

// //         networkHospitals: formData.networkHospitals.filter(
// //           (hospital) => hospital.name && hospital.city,
// //         ),
// //       };

// //       const res = await axios.post(
// //         `${BASE_URL}/api/mediclaim/policies`,
// //         payload,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         },
// //       );

// //       // Handle success response based on your API structure
// //       if (res.data.success || res.data.data) {
// //         // Show success message or notification here if needed
// //         onSuccess && onSuccess(res.data.data || res.data);
// //         onClose();

// //         // Reset form after successful submission
// //         setFormData({
// //           policyName: "",
// //           insurer: "",
// //           policyNumber: "",
// //           coverageAmount: "",
// //           coverageType: "family_floater",
// //           validityStart: "",
// //           validityEnd: "",
// //           familyCoverage: {
// //             spouse: true,
// //             children: true,
// //             maxChildren: 2,
// //             parents: false,
// //             childAgeLimit: 25,
// //             parentAgeLimit: "",
// //           },
// //           premiumDetails: {
// //             amountPerEmployee: "",
// //             totalPremium: "",
// //             paymentFrequency: "annual",
// //             paymentDate: "",
// //             paymentMode: "",
// //             paymentStatus: "pending",
// //           },
// //           networkHospitals: [
// //             {
// //               name: "",
// //               city: "",
// //               address: "",
// //               phone: "",
// //               distance: "",
// //               type: "",
// //               empaneledDate: "",
// //             },
// //           ],
// //           waitingPeriods: {
// //             preExistingDiseases: "",
// //             specificDiseases: {
// //               cataract: "",
// //               hernia: "",
// //             },
// //           },
// //           exclusions: [],
// //           status: "active",
// //           renewalAlertDate: "",
// //           renewedFrom: "",
// //         });
// //         setActiveStep(0);
// //       }
// //     } catch (err) {
// //       console.error("Error creating policy:", err);
// //       setError(
// //         err.response?.data?.message ||
// //           err.response?.data?.error ||
// //           "Failed to create policy. Please try again.",
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const renderStepContent = (step) => {
// //     switch (step) {
// //       case 0:
// //         return (
// //           <Grid container spacing={2}>
// //             <Grid item xs={6}>
// //               <TextField
// //                 label="Policy Name"
// //                 fullWidth
// //                 required
// //                 value={formData.policyName}
// //                 onChange={(e) => handleChange("policyName", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 label="Insurer"
// //                 fullWidth
// //                 required
// //                 value={formData.insurer}
// //                 onChange={(e) => handleChange("insurer", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 label="Policy Number"
// //                 fullWidth
// //                 required
// //                 value={formData.policyNumber}
// //                 onChange={(e) => handleChange("policyNumber", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 type="number"
// //                 label="Coverage Amount"
// //                 fullWidth
// //                 required
// //                 value={formData.coverageAmount}
// //                 onChange={(e) => handleChange("coverageAmount", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 select
// //                 label="Coverage Type"
// //                 fullWidth
// //                 required
// //                 value={formData.coverageType}
// //                 onChange={(e) => handleChange("coverageType", e.target.value)}
// //               >
// //                 <MenuItem value="family_floater">Family Floater</MenuItem>
// //                 <MenuItem value="individual">Individual</MenuItem>
// //               </TextField>
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 select
// //                 label="Policy Status"
// //                 fullWidth
// //                 value={formData.status}
// //                 onChange={(e) => handleChange("status", e.target.value)}
// //               >
// //                 <MenuItem value="draft">Draft</MenuItem>
// //                 <MenuItem value="active">Active</MenuItem>
// //                 <MenuItem value="expired">Expired</MenuItem>
// //                 <MenuItem value="cancelled">Cancelled</MenuItem>
// //               </TextField>
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 type="date"
// //                 label="Validity Start"
// //                 InputLabelProps={{ shrink: true }}
// //                 fullWidth
// //                 required
// //                 value={formData.validityStart}
// //                 onChange={(e) => handleChange("validityStart", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 type="date"
// //                 label="Validity End"
// //                 InputLabelProps={{ shrink: true }}
// //                 fullWidth
// //                 required
// //                 value={formData.validityEnd}
// //                 onChange={(e) => handleChange("validityEnd", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 type="date"
// //                 label="Renewal Alert Date"
// //                 InputLabelProps={{ shrink: true }}
// //                 fullWidth
// //                 value={formData.renewalAlertDate}
// //                 onChange={(e) =>
// //                   handleChange("renewalAlertDate", e.target.value)
// //                 }
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 label="Renewed From"
// //                 fullWidth
// //                 value={formData.renewedFrom}
// //                 onChange={(e) => handleChange("renewedFrom", e.target.value)}
// //               />
// //             </Grid>
// //           </Grid>
// //         );

// //       case 1:
// //         return (
// //           <Stack spacing={2}>
// //             <FormControlLabel
// //               control={
// //                 <Switch
// //                   checked={formData.familyCoverage.spouse}
// //                   onChange={(e) =>
// //                     handleNestedChange(
// //                       "familyCoverage",
// //                       "spouse",
// //                       e.target.checked,
// //                     )
// //                   }
// //                 />
// //               }
// //               label="Spouse Covered"
// //             />

// //             <FormControlLabel
// //               control={
// //                 <Switch
// //                   checked={formData.familyCoverage.children}
// //                   onChange={(e) =>
// //                     handleNestedChange(
// //                       "familyCoverage",
// //                       "children",
// //                       e.target.checked,
// //                     )
// //                   }
// //                 />
// //               }
// //               label="Children Covered"
// //             />

// //             <TextField
// //               type="number"
// //               label="Max Children"
// //               fullWidth
// //               value={formData.familyCoverage.maxChildren}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "familyCoverage",
// //                   "maxChildren",
// //                   e.target.value,
// //                 )
// //               }
// //             />

// //             <FormControlLabel
// //               control={
// //                 <Switch
// //                   checked={formData.familyCoverage.parents}
// //                   onChange={(e) =>
// //                     handleNestedChange(
// //                       "familyCoverage",
// //                       "parents",
// //                       e.target.checked,
// //                     )
// //                   }
// //                 />
// //               }
// //               label="Parents Covered"
// //             />

// //             <TextField
// //               type="number"
// //               label="Child Age Limit"
// //               fullWidth
// //               value={formData.familyCoverage.childAgeLimit}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "familyCoverage",
// //                   "childAgeLimit",
// //                   e.target.value,
// //                 )
// //               }
// //             />

// //             <TextField
// //               type="number"
// //               label="Parent Age Limit"
// //               fullWidth
// //               value={formData.familyCoverage.parentAgeLimit}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "familyCoverage",
// //                   "parentAgeLimit",
// //                   e.target.value,
// //                 )
// //               }
// //             />
// //           </Stack>
// //         );

// //       case 2:
// //         return (
// //           <Stack spacing={2}>
// //             <TextField
// //               type="number"
// //               label="Amount Per Employee"
// //               fullWidth
// //               required
// //               value={formData.premiumDetails.amountPerEmployee}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "premiumDetails",
// //                   "amountPerEmployee",
// //                   e.target.value,
// //                 )
// //               }
// //             />

// //             <TextField
// //               type="number"
// //               label="Total Premium"
// //               fullWidth
// //               required
// //               value={formData.premiumDetails.totalPremium}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "premiumDetails",
// //                   "totalPremium",
// //                   e.target.value,
// //                 )
// //               }
// //             />

// //             <TextField
// //               type="date"
// //               label="Payment Date"
// //               InputLabelProps={{ shrink: true }}
// //               fullWidth
// //               required
// //               value={formData.premiumDetails.paymentDate}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "premiumDetails",
// //                   "paymentDate",
// //                   e.target.value,
// //                 )
// //               }
// //             />

// //             <TextField
// //               select
// //               label="Payment Frequency"
// //               fullWidth
// //               required
// //               value={formData.premiumDetails.paymentFrequency}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "premiumDetails",
// //                   "paymentFrequency",
// //                   e.target.value,
// //                 )
// //               }
// //             >
// //               <MenuItem value="monthly">Monthly</MenuItem>
// //               <MenuItem value="quarterly">Quarterly</MenuItem>
// //               <MenuItem value="annual">Annual</MenuItem>
// //             </TextField>

// //             <TextField
// //               select
// //               label="Payment Mode"
// //               fullWidth
// //               required
// //               value={formData.premiumDetails.paymentMode}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "premiumDetails",
// //                   "paymentMode",
// //                   e.target.value,
// //                 )
// //               }
// //             >
// //               <MenuItem value="corporate_cheque">Corporate Cheque</MenuItem>
// //               <MenuItem value="online_transfer">Online Transfer</MenuItem>
// //             </TextField>

// //             <TextField
// //               select
// //               label="Payment Status"
// //               fullWidth
// //               required
// //               value={formData.premiumDetails.paymentStatus}
// //               onChange={(e) =>
// //                 handleNestedChange(
// //                   "premiumDetails",
// //                   "paymentStatus",
// //                   e.target.value,
// //                 )
// //               }
// //             >
// //               <MenuItem value="pending">Pending</MenuItem>
// //               <MenuItem value="paid">Paid</MenuItem>
// //               <MenuItem value="overdue">Overdue</MenuItem>
// //             </TextField>
// //           </Stack>
// //         );

// //       case 3:
// //         return (
// //           <Stack spacing={2}>
// //             {formData.networkHospitals.map((hospital, index) => (
// //               <Box
// //                 key={index}
// //                 sx={{
// //                   border: 1,
// //                   borderColor: "divider",
// //                   p: 2,
// //                   borderRadius: 1,
// //                 }}
// //               >
// //                 <Box
// //                   sx={{
// //                     display: "flex",
// //                     justifyContent: "space-between",
// //                     alignItems: "center",
// //                     mb: 2,
// //                   }}
// //                 >
// //                   <Typography variant="subtitle1">
// //                     Hospital {index + 1}
// //                   </Typography>
// //                   {formData.networkHospitals.length > 1 && (
// //                     <Button
// //                       size="small"
// //                       color="error"
// //                       onClick={() => removeHospital(index)}
// //                     >
// //                       Remove
// //                     </Button>
// //                   )}
// //                 </Box>
// //                 <Grid container spacing={2}>
// //                   <Grid item xs={6}>
// //                     <TextField
// //                       label="Hospital Name"
// //                       fullWidth
// //                       required
// //                       value={hospital.name}
// //                       onChange={(e) =>
// //                         handleHospitalChange(index, "name", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid item xs={6}>
// //                     <TextField
// //                       label="City"
// //                       fullWidth
// //                       required
// //                       value={hospital.city}
// //                       onChange={(e) =>
// //                         handleHospitalChange(index, "city", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12}>
// //                     <TextField
// //                       label="Address"
// //                       fullWidth
// //                       multiline
// //                       rows={2}
// //                       value={hospital.address}
// //                       onChange={(e) =>
// //                         handleHospitalChange(index, "address", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid item xs={6}>
// //                     <TextField
// //                       label="Phone"
// //                       fullWidth
// //                       value={hospital.phone}
// //                       onChange={(e) =>
// //                         handleHospitalChange(index, "phone", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid item xs={6}>
// //                     <TextField
// //                       label="Distance from Factory"
// //                       fullWidth
// //                       placeholder="e.g., 5 km"
// //                       value={hospital.distance}
// //                       onChange={(e) =>
// //                         handleHospitalChange(index, "distance", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid item xs={6}>
// //                     <TextField
// //                       label="Hospital Type"
// //                       fullWidth
// //                       placeholder="e.g., multi-speciality"
// //                       value={hospital.type}
// //                       onChange={(e) =>
// //                         handleHospitalChange(index, "type", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid item xs={6}>
// //                     <TextField
// //                       type="date"
// //                       label="Empaneled Date"
// //                       InputLabelProps={{ shrink: true }}
// //                       fullWidth
// //                       value={hospital.empaneledDate}
// //                       onChange={(e) =>
// //                         handleHospitalChange(
// //                           index,
// //                           "empaneledDate",
// //                           e.target.value,
// //                         )
// //                       }
// //                     />
// //                   </Grid>
// //                 </Grid>
// //               </Box>
// //             ))}
// //             <Button variant="outlined" onClick={addHospital} sx={{ mt: 1 }}>
// //               Add Another Hospital
// //             </Button>
// //           </Stack>
// //         );

// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// //       <DialogTitle
// //         sx={{
// //           background: HEADER_GRADIENT,
// //           color: "#fff",
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //         }}
// //       >
// //         <Typography fontWeight={600}>Add New Policy</Typography>
// //         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
// //           <CloseIcon />
// //         </IconButton>
// //       </DialogTitle>

// //       <DialogContent dividers>
// //         <Stack spacing={3} mt={1}>
// //           {/* Stepper */}
// //           <Stepper activeStep={activeStep} alternativeLabel>
// //             {steps.map((label) => (
// //               <Step key={label}>
// //                 <StepLabel>{label}</StepLabel>
// //               </Step>
// //             ))}
// //           </Stepper>

// //           <Divider />

// //           {/* Step Content */}
// //           <Box
// //             sx={{
// //               minHeight: 420,
// //               p: 1,
// //             }}
// //           >
// //             {renderStepContent(activeStep)}
// //           </Box>

// //           {error && (
// //             <>
// //               <Divider />
// //               <Alert severity="error" variant="filled">
// //                 {error}
// //               </Alert>
// //             </>
// //           )}
// //         </Stack>
// //       </DialogContent>

// //       <DialogActions
// //         sx={{
// //           px: 3,
// //           py: 2,
// //           justifyContent: "space-between",
// //         }}
// //       >
// //         <Button onClick={onClose}>Cancel</Button>

// //         <Box>
// //           <Button
// //             onClick={handleBack}
// //             disabled={activeStep === 0}
// //             sx={{ mr: 1 }}
// //           >
// //             Back
// //           </Button>

// //           {activeStep === steps.length - 1 ? (
// //             <Button
// //               variant="contained"
// //               onClick={handleSubmit}
// //               disabled={loading}
// //               sx={{
// //                 background: HEADER_GRADIENT,
// //               }}
// //             >
// //               {loading ? <CircularProgress size={20} /> : "Create Policy"}
// //             </Button>
// //           ) : (
// //             <Button
// //               variant="contained"
// //               onClick={handleNext}
// //               sx={{
// //                 background: HEADER_GRADIENT,
// //               }}
// //             >
// //               Next
// //             </Button>
// //           )}
// //         </Box>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default AddPolicy;



// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Grid,
//   Switch,
//   FormControlLabel,
//   IconButton,
//   Divider,
//   Alert,
//   CircularProgress,
//   MenuItem,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Paper,
//   Card,
//   CardContent,
//   CardHeader,
//   InputAdornment,
//   Chip,
//   Tooltip,
// } from "@mui/material";

// import {
//   Close as CloseIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Info as InfoIcon,
//   LocalHospital as HospitalIcon,
//   FamilyRestroom as FamilyIcon,
//   Payment as PaymentIcon,
//   Business as BusinessIcon,
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// const PRIMARY_COLOR = "#00B4D8";
// const DARK_PRIMARY = "#164e63";
// const LIGHT_BG = "#f8fafc";

// const steps = [
//   { label: "Basic Details", icon: <BusinessIcon /> },
//   { label: "Family Coverage", icon: <FamilyIcon /> },
//   { label: "Premium Details", icon: <PaymentIcon /> },
//   { label: "Network Hospitals", icon: <HospitalIcon /> },
// ];

// const AddPolicy = ({ open, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeStep, setActiveStep] = useState(0);
//   const [hoveredHospital, setHoveredHospital] = useState(null);

//   const [formData, setFormData] = useState({
//     policyName: "",
//     insurer: "",
//     policyNumber: "",
//     brokerDetails: {
//       name: "",
//       contactPerson: "",
//       phone: "",
//       email: "",
//     },
//     coverageAmount: "",
//     coverageType: "family_floater",
//     validityStart: "",
//     validityEnd: "",
//     familyCoverage: {
//       spouse: true,
//       children: true,
//       maxChildren: 2,
//       parents: false,
//       childAgeLimit: 25,
//       parentAgeLimit: "",
//     },
//     premiumDetails: {
//       amountPerEmployee: "",
//       totalPremium: "",
//       paymentFrequency: "annual",
//       paymentDate: "",
//       paymentMode: "",
//       paymentStatus: "pending",
//     },
//     networkHospitals: [
//       {
//         name: "",
//         city: "",
//         address: "",
//         phone: "",
//         distance: "",
//         type: "",
//         empaneledDate: "",
//       },
//     ],
//     waitingPeriods: {
//       preExistingDiseases: "",
//       specificDiseases: {
//         cataract: "",
//         hernia: "",
//       },
//     },
//     exclusions: [],
//     status: "active",
//     renewalAlertDate: "",
//     renewedFrom: "",
//   });

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNestedChange = (parent, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [parent]: { ...prev[parent], [field]: value },
//     }));
//   };

//   const handleDeepNestedChange = (parent, child, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [parent]: {
//         ...prev[parent],
//         [child]: {
//           ...prev[parent][child],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   const handleHospitalChange = (index, field, value) => {
//     const updated = [...formData.networkHospitals];
//     updated[index][field] = value;
//     setFormData((prev) => ({ ...prev, networkHospitals: updated }));
//   };

//   const addHospital = () => {
//     setFormData((prev) => ({
//       ...prev,
//       networkHospitals: [
//         ...prev.networkHospitals,
//         {
//           name: "",
//           city: "",
//           address: "",
//           phone: "",
//           distance: "",
//           type: "",
//           empaneledDate: "",
//         },
//       ],
//     }));
//   };

//   const removeHospital = (index) => {
//     if (formData.networkHospitals.length > 1) {
//       const updated = formData.networkHospitals.filter((_, i) => i !== index);
//       setFormData((prev) => ({ ...prev, networkHospitals: updated }));
//     }
//   };

//   const handleNext = () => {
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const payload = {
//         policyName: formData.policyName,
//         insurer: formData.insurer,
//         policyNumber: formData.policyNumber,
//         brokerDetails: formData.brokerDetails,
//         coverageAmount: Number(formData.coverageAmount),
//         coverageType: formData.coverageType,
//         validityStart: formData.validityStart,
//         validityEnd: formData.validityEnd,
//         familyCoverage: {
//           spouse: formData.familyCoverage.spouse,
//           children: formData.familyCoverage.children,
//           maxChildren: Number(formData.familyCoverage.maxChildren),
//           parents: formData.familyCoverage.parents,
//           childAgeLimit: Number(formData.familyCoverage.childAgeLimit),
//           ...(formData.familyCoverage.parentAgeLimit && {
//             parentAgeLimit: Number(formData.familyCoverage.parentAgeLimit),
//           }),
//         },
//         premiumDetails: {
//           amountPerEmployee: Number(formData.premiumDetails.amountPerEmployee),
//           totalPremium: Number(formData.premiumDetails.totalPremium),
//           paymentFrequency: formData.premiumDetails.paymentFrequency,
//           paymentDate: formData.premiumDetails.paymentDate,
//           paymentMode: formData.premiumDetails.paymentMode,
//           paymentStatus: formData.premiumDetails.paymentStatus,
//         },
//         networkHospitals: formData.networkHospitals.filter(
//           (hospital) => hospital.name && hospital.city,
//         ),
//       };

//       const res = await axios.post(
//         `${BASE_URL}/api/mediclaim/policies`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       if (res.data.success || res.data.data) {
//         onSuccess && onSuccess(res.data.data || res.data);
//         onClose();
//         setFormData({
//           policyName: "",
//           insurer: "",
//           policyNumber: "",
//           coverageAmount: "",
//           coverageType: "family_floater",
//           validityStart: "",
//           validityEnd: "",
//           familyCoverage: {
//             spouse: true,
//             children: true,
//             maxChildren: 2,
//             parents: false,
//             childAgeLimit: 25,
//             parentAgeLimit: "",
//           },
//           premiumDetails: {
//             amountPerEmployee: "",
//             totalPremium: "",
//             paymentFrequency: "annual",
//             paymentDate: "",
//             paymentMode: "",
//             paymentStatus: "pending",
//           },
//           networkHospitals: [
//             {
//               name: "",
//               city: "",
//               address: "",
//               phone: "",
//               distance: "",
//               type: "",
//               empaneledDate: "",
//             },
//           ],
//           waitingPeriods: {
//             preExistingDiseases: "",
//             specificDiseases: {
//               cataract: "",
//               hernia: "",
//             },
//           },
//           exclusions: [],
//           status: "active",
//           renewalAlertDate: "",
//           renewedFrom: "",
//         });
//         setActiveStep(0);
//       }
//     } catch (err) {
//       console.error("Error creating policy:", err);
//       setError(
//         err.response?.data?.message ||
//           err.response?.data?.error ||
//           "Failed to create policy. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStepStatus = (step) => {
//     if (activeStep > step) return "complete";
//     if (activeStep === step) return "active";
//     return "incomplete";
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={3}>
//             {/* Basic Information Card */}
//             <Card variant="outlined" sx={{ borderRadius: 2 }}>
//               <CardHeader
//                 title="Policy Information"
//                 titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
//                 sx={{ 
//                   bgcolor: LIGHT_BG, 
//                   borderBottom: 1, 
//                   borderColor: "divider",
//                   py: 1.5
//                 }}
//               />
//               <CardContent>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Policy Name"
//                       fullWidth
//                       required
//                       value={formData.policyName}
//                       onChange={(e) => handleChange("policyName", e.target.value)}
//                       variant="outlined"
//                       size="medium"
//                       placeholder="e.g., Group Health Insurance 2024"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Insurer"
//                       fullWidth
//                       required
//                       value={formData.insurer}
//                       onChange={(e) => handleChange("insurer", e.target.value)}
//                       variant="outlined"
//                       placeholder="e.g., Star Health Insurance"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Policy Number"
//                       fullWidth
//                       required
//                       value={formData.policyNumber}
//                       onChange={(e) => handleChange("policyNumber", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       type="number"
//                       label="Coverage Amount"
//                       fullWidth
//                       required
//                       value={formData.coverageAmount}
//                       onChange={(e) => handleChange("coverageAmount", e.target.value)}
//                       variant="outlined"
//                       InputProps={{
//                         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       select
//                       label="Coverage Type"
//                       fullWidth
//                       required
//                       value={formData.coverageType}
//                       onChange={(e) => handleChange("coverageType", e.target.value)}
//                       variant="outlined"
//                     >
//                       <MenuItem value="family_floater">Family Floater</MenuItem>
//                       <MenuItem value="individual">Individual</MenuItem>
//                     </TextField>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       select
//                       label="Policy Status"
//                       fullWidth
//                       value={formData.status}
//                       onChange={(e) => handleChange("status", e.target.value)}
//                       variant="outlined"
//                     >
//                       <MenuItem value="draft">Draft</MenuItem>
//                       <MenuItem value="active">Active</MenuItem>
//                       <MenuItem value="expired">Expired</MenuItem>
//                       <MenuItem value="cancelled">Cancelled</MenuItem>
//                     </TextField>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>

//             {/* Validity Period Card */}
//             <Card variant="outlined" sx={{ borderRadius: 2 }}>
//               <CardHeader
//                 title="Validity Period"
//                 titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
//                 sx={{ 
//                   bgcolor: LIGHT_BG, 
//                   borderBottom: 1, 
//                   borderColor: "divider",
//                   py: 1.5
//                 }}
//               />
//               <CardContent>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       type="date"
//                       label="Validity Start"
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                       required
//                       value={formData.validityStart}
//                       onChange={(e) => handleChange("validityStart", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       type="date"
//                       label="Validity End"
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                       required
//                       value={formData.validityEnd}
//                       onChange={(e) => handleChange("validityEnd", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       type="date"
//                       label="Renewal Alert Date"
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                       value={formData.renewalAlertDate}
//                       onChange={(e) => handleChange("renewalAlertDate", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Renewed From"
//                       fullWidth
//                       value={formData.renewedFrom}
//                       onChange={(e) => handleChange("renewedFrom", e.target.value)}
//                       variant="outlined"
//                       placeholder="Previous policy number"
//                     />
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>

//             {/* Broker Details Card */}
//             <Card variant="outlined" sx={{ borderRadius: 2 }}>
//               <CardHeader
//                 title="Broker Details"
//                 titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
//                 sx={{ 
//                   bgcolor: LIGHT_BG, 
//                   borderBottom: 1, 
//                   borderColor: "divider",
//                   py: 1.5
//                 }}
//               />
//               <CardContent>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Broker Name"
//                       fullWidth
//                       value={formData.brokerDetails.name}
//                       onChange={(e) => handleNestedChange("brokerDetails", "name", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Contact Person"
//                       fullWidth
//                       value={formData.brokerDetails.contactPerson}
//                       onChange={(e) => handleNestedChange("brokerDetails", "contactPerson", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Phone"
//                       fullWidth
//                       value={formData.brokerDetails.phone}
//                       onChange={(e) => handleNestedChange("brokerDetails", "phone", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Email"
//                       type="email"
//                       fullWidth
//                       value={formData.brokerDetails.email}
//                       onChange={(e) => handleNestedChange("brokerDetails", "email", e.target.value)}
//                       variant="outlined"
//                     />
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Card variant="outlined" sx={{ borderRadius: 2 }}>
//             <CardHeader
//               title="Family Coverage Configuration"
//               titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
//               avatar={<FamilyIcon sx={{ color: PRIMARY_COLOR }} />}
//               sx={{ 
//                 bgcolor: LIGHT_BG, 
//                 borderBottom: 1, 
//                 borderColor: "divider",
//                 py: 1.5
//               }}
//             />
//             <CardContent>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <Paper 
//                     variant="outlined" 
//                     sx={{ 
//                       p: 3, 
//                       borderRadius: 2,
//                       bgcolor: LIGHT_BG
//                     }}
//                   >
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} md={6}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={formData.familyCoverage.spouse}
//                               onChange={(e) =>
//                                 handleNestedChange(
//                                   "familyCoverage",
//                                   "spouse",
//                                   e.target.checked,
//                                 )
//                               }
//                               color="primary"
//                             />
//                           }
//                           label={
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                               <Typography>Spouse Covered</Typography>
//                               <Tooltip title="Coverage for spouse under the policy">
//                                 <InfoIcon fontSize="small" color="action" />
//                               </Tooltip>
//                             </Box>
//                           }
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={formData.familyCoverage.children}
//                               onChange={(e) =>
//                                 handleNestedChange(
//                                   "familyCoverage",
//                                   "children",
//                                   e.target.checked,
//                                 )
//                               }
//                               color="primary"
//                             />
//                           }
//                           label="Children Covered"
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           type="number"
//                           label="Max Children"
//                           fullWidth
//                           value={formData.familyCoverage.maxChildren}
//                           onChange={(e) =>
//                             handleNestedChange(
//                               "familyCoverage",
//                               "maxChildren",
//                               e.target.value,
//                             )
//                           }
//                           variant="outlined"
//                           disabled={!formData.familyCoverage.children}
//                           InputProps={{
//                             inputProps: { min: 1, max: 10 }
//                           }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           type="number"
//                           label="Child Age Limit"
//                           fullWidth
//                           value={formData.familyCoverage.childAgeLimit}
//                           onChange={(e) =>
//                             handleNestedChange(
//                               "familyCoverage",
//                               "childAgeLimit",
//                               e.target.value,
//                             )
//                           }
//                           variant="outlined"
//                           disabled={!formData.familyCoverage.children}
//                           InputProps={{
//                             endAdornment: <InputAdornment position="end">years</InputAdornment>,
//                           }}
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <Divider sx={{ my: 2 }} />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={formData.familyCoverage.parents}
//                               onChange={(e) =>
//                                 handleNestedChange(
//                                   "familyCoverage",
//                                   "parents",
//                                   e.target.checked,
//                                 )
//                               }
//                               color="primary"
//                             />
//                           }
//                           label="Parents Covered"
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           type="number"
//                           label="Parent Age Limit"
//                           fullWidth
//                           value={formData.familyCoverage.parentAgeLimit}
//                           onChange={(e) =>
//                             handleNestedChange(
//                               "familyCoverage",
//                               "parentAgeLimit",
//                               e.target.value,
//                             )
//                           }
//                           variant="outlined"
//                           disabled={!formData.familyCoverage.parents}
//                           InputProps={{
//                             endAdornment: <InputAdornment position="end">years</InputAdornment>,
//                           }}
//                         />
//                       </Grid>
//                     </Grid>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         );

//       case 2:
//         return (
//           <Card variant="outlined" sx={{ borderRadius: 2 }}>
//             <CardHeader
//               title="Premium Details"
//               titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
//               avatar={<PaymentIcon sx={{ color: PRIMARY_COLOR }} />}
//               sx={{ 
//                 bgcolor: LIGHT_BG, 
//                 borderBottom: 1, 
//                 borderColor: "divider",
//                 py: 1.5
//               }}
//             />
//             <CardContent>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     type="number"
//                     label="Amount Per Employee"
//                     fullWidth
//                     required
//                     value={formData.premiumDetails.amountPerEmployee}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "premiumDetails",
//                         "amountPerEmployee",
//                         e.target.value,
//                       )
//                     }
//                     variant="outlined"
//                     InputProps={{
//                       startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     type="number"
//                     label="Total Premium"
//                     fullWidth
//                     required
//                     value={formData.premiumDetails.totalPremium}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "premiumDetails",
//                         "totalPremium",
//                         e.target.value,
//                       )
//                     }
//                     variant="outlined"
//                     InputProps={{
//                       startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     type="date"
//                     label="Payment Date"
//                     InputLabelProps={{ shrink: true }}
//                     fullWidth
//                     required
//                     value={formData.premiumDetails.paymentDate}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "premiumDetails",
//                         "paymentDate",
//                         e.target.value,
//                       )
//                     }
//                     variant="outlined"
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     select
//                     label="Payment Frequency"
//                     fullWidth
//                     required
//                     value={formData.premiumDetails.paymentFrequency}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "premiumDetails",
//                         "paymentFrequency",
//                         e.target.value,
//                       )
//                     }
//                     variant="outlined"
//                   >
//                     <MenuItem value="monthly">Monthly</MenuItem>
//                     <MenuItem value="quarterly">Quarterly</MenuItem>
//                     <MenuItem value="annual">Annual</MenuItem>
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     select
//                     label="Payment Mode"
//                     fullWidth
//                     required
//                     value={formData.premiumDetails.paymentMode}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "premiumDetails",
//                         "paymentMode",
//                         e.target.value,
//                       )
//                     }
//                     variant="outlined"
//                   >
//                     <MenuItem value="corporate_cheque">Corporate Cheque</MenuItem>
//                     <MenuItem value="online_transfer">Online Transfer</MenuItem>
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     select
//                     label="Payment Status"
//                     fullWidth
//                     required
//                     value={formData.premiumDetails.paymentStatus}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "premiumDetails",
//                         "paymentStatus",
//                         e.target.value,
//                       )
//                     }
//                     variant="outlined"
//                   >
//                     <MenuItem value="pending">
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <WarningIcon fontSize="small" color="warning" />
//                         Pending
//                       </Box>
//                     </MenuItem>
//                     <MenuItem value="paid">
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <CheckCircleIcon fontSize="small" color="success" />
//                         Paid
//                       </Box>
//                     </MenuItem>
//                     <MenuItem value="overdue">Overdue</MenuItem>
//                   </TextField>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         );

//       case 3:
//         return (
//           <Stack spacing={2}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//               <Typography variant="h6" fontWeight={600}>
//                 Network Hospitals ({formData.networkHospitals.length})
//               </Typography>
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={addHospital}
//                 sx={{
//                   bgcolor: PRIMARY_COLOR,
//                   "&:hover": { bgcolor: DARK_PRIMARY }
//                 }}
//               >
//                 Add Hospital
//               </Button>
//             </Box>

//             {formData.networkHospitals.map((hospital, index) => (
//               <Card 
//                 key={index} 
//                 variant="outlined" 
//                 sx={{ 
//                   borderRadius: 2,
//                   position: "relative",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     boxShadow: 3,
//                     borderColor: PRIMARY_COLOR,
//                   },
//                 }}
//                 onMouseEnter={() => setHoveredHospital(index)}
//                 onMouseLeave={() => setHoveredHospital(null)}
//               >
//                 <CardHeader
//                   title={
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <HospitalIcon sx={{ color: PRIMARY_COLOR }} />
//                       <Typography variant="subtitle1" fontWeight={600}>
//                         Hospital {index + 1}
//                       </Typography>
//                       {!hospital.name && !hospital.city && (
//                         <Chip 
//                           label="New" 
//                           size="small" 
//                           color="primary" 
//                           variant="outlined"
//                         />
//                       )}
//                     </Box>
//                   }
//                   action={
//                     formData.networkHospitals.length > 1 && (
//                       <Tooltip title="Remove Hospital">
//                         <IconButton 
//                           onClick={() => removeHospital(index)}
//                           color="error"
//                           size="small"
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </Tooltip>
//                     )
//                   }
//                   sx={{ 
//                     bgcolor: LIGHT_BG, 
//                     borderBottom: 1, 
//                     borderColor: "divider",
//                     py: 1
//                   }}
//                 />
//                 <CardContent>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         label="Hospital Name"
//                         fullWidth
//                         required
//                         value={hospital.name}
//                         onChange={(e) =>
//                           handleHospitalChange(index, "name", e.target.value)
//                         }
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         label="City"
//                         fullWidth
//                         required
//                         value={hospital.city}
//                         onChange={(e) =>
//                           handleHospitalChange(index, "city", e.target.value)
//                         }
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         label="Address"
//                         fullWidth
//                         multiline
//                         rows={2}
//                         value={hospital.address}
//                         onChange={(e) =>
//                           handleHospitalChange(index, "address", e.target.value)
//                         }
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         label="Phone"
//                         fullWidth
//                         value={hospital.phone}
//                         onChange={(e) =>
//                           handleHospitalChange(index, "phone", e.target.value)
//                         }
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         label="Distance from Factory"
//                         fullWidth
//                         placeholder="e.g., 5 km"
//                         value={hospital.distance}
//                         onChange={(e) =>
//                           handleHospitalChange(index, "distance", e.target.value)
//                         }
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         label="Hospital Type"
//                         fullWidth
//                         placeholder="e.g., multi-speciality"
//                         value={hospital.type}
//                         onChange={(e) =>
//                           handleHospitalChange(index, "type", e.target.value)
//                         }
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         type="date"
//                         label="Empaneled Date"
//                         InputLabelProps={{ shrink: true }}
//                         fullWidth
//                         value={hospital.empaneledDate}
//                         onChange={(e) =>
//                           handleHospitalChange(
//                             index,
//                             "empaneledDate",
//                             e.target.value,
//                           )
//                         }
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             ))}
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="mg" 
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           overflow: "hidden",
//         }
//       }}
//     >
//       <DialogTitle
//         sx={{
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           py: 2,
//           px: 3,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <Typography variant="h6" fontWeight={600}>
//             Add New Policy
//           </Typography>
//           <Chip 
//             label={`Step ${activeStep + 1} of ${steps.length}`}
//             size="small"
//             sx={{ 
//               bgcolor: "rgba(255,255,255,0.2)", 
//               color: "#fff",
//               fontWeight: 500,
//             }}
//           />
//         </Box>
//         <IconButton onClick={onClose} sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers sx={{ p: 3, bgcolor: "#f5f5f5" }}>
//         <Stack spacing={3}>
//           {/* Stepper */}
//           <Paper sx={{ p: 2, borderRadius: 2 }}>
//             <Stepper activeStep={activeStep} alternativeLabel>
//               {steps.map((step, index) => (
//                 <Step key={step.label}>
//                   <StepLabel
//                     StepIconProps={{
//                       icon: index + 1,
//                     }}
//                   >
//                     <Typography variant="body2" fontWeight={500}>
//                       {step.label}
//                     </Typography>
//                   </StepLabel>
//                 </Step>
//               ))}
//             </Stepper>
//           </Paper>

//           {/* Step Content */}
//           <Paper sx={{ p: 3, borderRadius: 2 }}>
//             <Box sx={{ minHeight: 500 }}>
//               {renderStepContent(activeStep)}
//             </Box>
//           </Paper>

//           {error && (
//             <Alert 
//               severity="error" 
//               variant="filled"
//               sx={{ borderRadius: 2 }}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions
//         sx={{
//           px: 3,
//           py: 2,
//           justifyContent: "space-between",
//           bgcolor: "#fff",
//           borderTop: 1,
//           borderColor: "divider",
//         }}
//       >
//         <Button 
//           onClick={onClose}
//           variant="outlined"
//           sx={{ color: "#666", borderColor: "#ddd" }}
//         >
//           Cancel
//         </Button>

//         <Box sx={{ display: "flex", gap: 1 }}>
//           <Button
//             onClick={handleBack}
//             disabled={activeStep === 0}
//             variant="outlined"
//           >
//             Back
//           </Button>

//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               sx={{
//                 background: HEADER_GRADIENT,
//                 minWidth: 120,
//                 "&:hover": {
//                   background: HEADER_GRADIENT,
//                   opacity: 0.9,
//                 }
//               }}
//             >
//               {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Create Policy"}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               sx={{
//                 background: HEADER_GRADIENT,
//                 minWidth: 100,
//                 "&:hover": {
//                   background: HEADER_GRADIENT,
//                   opacity: 0.9,
//                 }
//               }}
//             >
//               Next
//             </Button>
//           )}
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddPolicy;

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Grid,
  Switch,
  FormControlLabel,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Chip,
  Tooltip,
  Avatar,
  StepConnector,
  styled,
  stepConnectorClasses,
  alpha
} from "@mui/material";

import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  LocalHospital as HospitalIcon,
  FamilyRestroom as FamilyIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Verified as VerifiedIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  MonetizationOn as MoneyIcon,
  AccessTime as AccessTimeIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

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

const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0e7490 100%)";
const PRIMARY_BLUE = "#0284c7";
const DARK_PRIMARY = "#164e63";
const LIGHT_BG = "#f8fafc";
const TEXT_COLOR_MAIN = "#0f172a";
const TEXT_COLOR_SECONDARY = "#64748B";

const steps = [
  { label: "Basic Details", icon: <BusinessIcon /> },
  { label: "Family Coverage", icon: <FamilyIcon /> },
  { label: "Premium Details", icon: <PaymentIcon /> },
  { label: "Network Hospitals", icon: <HospitalIcon /> },
];

const AddPolicy = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredHospital, setHoveredHospital] = useState(null);

  const [formData, setFormData] = useState({
    policyName: "",
    insurer: "",
    policyNumber: "",
    brokerDetails: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
    },
    coverageAmount: "",
    coverageType: "family_floater",
    validityStart: "",
    validityEnd: "",
    familyCoverage: {
      spouse: true,
      children: true,
      maxChildren: 2,
      parents: false,
      childAgeLimit: 25,
      parentAgeLimit: "",
    },
    premiumDetails: {
      amountPerEmployee: "",
      totalPremium: "",
      paymentFrequency: "annual",
      paymentDate: "",
      paymentMode: "",
      paymentStatus: "pending",
    },
    networkHospitals: [
      {
        name: "",
        city: "",
        address: "",
        phone: "",
        distance: "",
        type: "",
        empaneledDate: "",
      },
    ],
    waitingPeriods: {
      preExistingDiseases: "",
      specificDiseases: {
        cataract: "",
        hernia: "",
      },
    },
    exclusions: [],
    status: "active",
    renewalAlertDate: "",
    renewedFrom: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleDeepNestedChange = (parent, child, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: {
          ...prev[parent][child],
          [field]: value,
        },
      },
    }));
  };

  const handleHospitalChange = (index, field, value) => {
    const updated = [...formData.networkHospitals];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, networkHospitals: updated }));
  };

  const addHospital = () => {
    setFormData((prev) => ({
      ...prev,
      networkHospitals: [
        ...prev.networkHospitals,
        {
          name: "",
          city: "",
          address: "",
          phone: "",
          distance: "",
          type: "",
          empaneledDate: "",
        },
      ],
    }));
  };

  const removeHospital = (index) => {
    if (formData.networkHospitals.length > 1) {
      const updated = formData.networkHospitals.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, networkHospitals: updated }));
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const payload = {
        policyName: formData.policyName,
        insurer: formData.insurer,
        policyNumber: formData.policyNumber,
        brokerDetails: formData.brokerDetails,
        coverageAmount: Number(formData.coverageAmount),
        coverageType: formData.coverageType,
        validityStart: formData.validityStart,
        validityEnd: formData.validityEnd,
        familyCoverage: {
          spouse: formData.familyCoverage.spouse,
          children: formData.familyCoverage.children,
          maxChildren: Number(formData.familyCoverage.maxChildren),
          parents: formData.familyCoverage.parents,
          childAgeLimit: Number(formData.familyCoverage.childAgeLimit),
          ...(formData.familyCoverage.parentAgeLimit && {
            parentAgeLimit: Number(formData.familyCoverage.parentAgeLimit),
          }),
        },
        premiumDetails: {
          amountPerEmployee: Number(formData.premiumDetails.amountPerEmployee),
          totalPremium: Number(formData.premiumDetails.totalPremium),
          paymentFrequency: formData.premiumDetails.paymentFrequency,
          paymentDate: formData.premiumDetails.paymentDate,
          paymentMode: formData.premiumDetails.paymentMode,
          paymentStatus: formData.premiumDetails.paymentStatus,
        },
        networkHospitals: formData.networkHospitals.filter(
          (hospital) => hospital.name && hospital.city,
        ),
      };

      const res = await axios.post(
        `${BASE_URL}/api/mediclaim/policies`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success || res.data.data) {
        onSuccess && onSuccess(res.data.data || res.data);
        onClose();
        setFormData({
          policyName: "",
          insurer: "",
          policyNumber: "",
          coverageAmount: "",
          coverageType: "family_floater",
          validityStart: "",
          validityEnd: "",
          familyCoverage: {
            spouse: true,
            children: true,
            maxChildren: 2,
            parents: false,
            childAgeLimit: 25,
            parentAgeLimit: "",
          },
          premiumDetails: {
            amountPerEmployee: "",
            totalPremium: "",
            paymentFrequency: "annual",
            paymentDate: "",
            paymentMode: "",
            paymentStatus: "pending",
          },
          networkHospitals: [
            {
              name: "",
              city: "",
              address: "",
              phone: "",
              distance: "",
              type: "",
              empaneledDate: "",
            },
          ],
          waitingPeriods: {
            preExistingDiseases: "",
            specificDiseases: {
              cataract: "",
              hernia: "",
            },
          },
          exclusions: [],
          status: "active",
          renewalAlertDate: "",
          renewedFrom: "",
        });
        setActiveStep(0);
      }
    } catch (err) {
      console.error("Error creating policy:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create policy. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step) => {
    if (activeStep > step) return "complete";
    if (activeStep === step) return "active";
    return "incomplete";
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Basic Information Card */}
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
                  <BusinessIcon sx={{ color: PRIMARY_BLUE, fontSize: 16 }} />
                </Avatar>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
                  Policy Information
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Policy Name"
                      // fullWidth
                      required
                      value={formData.policyName}
                      onChange={(e) => handleChange("policyName", e.target.value)}
                      variant="outlined"
                      size="small"
                      placeholder="e.g., Group Health Insurance 2024"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '400px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Insurer"
                      fullWidth
                      required
                      value={formData.insurer}
                      onChange={(e) => handleChange("insurer", e.target.value)}
                      variant="outlined"
                      size="small"
                      placeholder="e.g., Star Health Insurance"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '300px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Policy Number"
                      fullWidth
                      required
                      value={formData.policyNumber}
                      onChange={(e) => handleChange("policyNumber", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '250px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="number"
                      label="Coverage Amount"
                      fullWidth
                      required
                      value={formData.coverageAmount}
                      onChange={(e) => handleChange("coverageAmount", e.target.value)}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '175px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Coverage Type"
                      fullWidth
                      required
                      value={formData.coverageType}
                      onChange={(e) => handleChange("coverageType", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        }
                      }}
                    >
                      <MenuItem value="family_floater">Family Floater</MenuItem>
                      <MenuItem value="individual">Individual</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Policy Status"
                      fullWidth
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        }
                      }}
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="expired">Expired</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Validity Period Card */}
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
                  <CalendarIcon sx={{ color: PRIMARY_BLUE, fontSize: 16 }} />
                </Avatar>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
                  Validity Period
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="date"
                      label="Validity Start"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      required
                      value={formData.validityStart}
                      onChange={(e) => handleChange("validityStart", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="date"
                      label="Validity End"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      required
                      value={formData.validityEnd}
                      onChange={(e) => handleChange("validityEnd", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="date"
                      label="Renewal Alert Date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={formData.renewalAlertDate}
                      onChange={(e) => handleChange("renewalAlertDate", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Renewed From"
                      fullWidth
                      value={formData.renewedFrom}
                      onChange={(e) => handleChange("renewedFrom", e.target.value)}
                      variant="outlined"
                      size="small"
                      placeholder="Previous policy number"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '175px'
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Broker Details Card */}
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
                  <VerifiedIcon sx={{ color: PRIMARY_BLUE, fontSize: 16 }} />
                </Avatar>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
                  Broker Details
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Broker Name"
                      fullWidth
                      value={formData.brokerDetails.name}
                      onChange={(e) => handleNestedChange("brokerDetails", "name", e.target.value)}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '350px'

                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Contact Person"
                      fullWidth
                      value={formData.brokerDetails.contactPerson}
                      onChange={(e) => handleNestedChange("brokerDetails", "contactPerson", e.target.value)}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '350px'

                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone"
                      fullWidth
                      value={formData.brokerDetails.phone}
                      onChange={(e) => handleNestedChange("brokerDetails", "phone", e.target.value)}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '250px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={formData.brokerDetails.email}
                      onChange={(e) => handleNestedChange("brokerDetails", "email", e.target.value)}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: '#fff'
                        },
                        width: '450px'
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Stack>
        );

      case 1:
        return (
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
                <FamilyIcon sx={{ color: PRIMARY_BLUE, fontSize: 16 }} />
              </Avatar>
              <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
                Family Coverage Configuration
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {/* <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      bgcolor: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}
                  > */}
                  {/* <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.familyCoverage.spouse}
                              onChange={(e) =>
                                handleNestedChange(
                                  "familyCoverage",
                                  "spouse",
                                  e.target.checked,
                                )
                              }
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: PRIMARY_BLUE,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: PRIMARY_BLUE,
                                },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="body2" sx={{ color: TEXT_COLOR_MAIN }}>Spouse Covered</Typography>
                              <Tooltip title="Coverage for spouse under the policy">
                                <InfoIcon fontSize="small" sx={{ color: TEXT_COLOR_SECONDARY }} />
                              </Tooltip>
                            </Box>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.familyCoverage.children}
                              onChange={(e) =>
                                handleNestedChange(
                                  "familyCoverage",
                                  "children",
                                  e.target.checked,
                                )
                              }
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: PRIMARY_BLUE,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: PRIMARY_BLUE,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: TEXT_COLOR_MAIN }}>Children Covered</Typography>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="number"
                          label="Max Children"
                          fullWidth
                          value={formData.familyCoverage.maxChildren}
                          onChange={(e) =>
                            handleNestedChange(
                              "familyCoverage",
                              "maxChildren",
                              e.target.value,
                            )
                          }
                          variant="outlined"
                          size="small"
                          disabled={!formData.familyCoverage.children}
                          InputProps={{
                            inputProps: { min: 1, max: 10 }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="number"
                          label="Child Age Limit"
                          fullWidth
                          value={formData.familyCoverage.childAgeLimit}
                          onChange={(e) =>
                            handleNestedChange(
                              "familyCoverage",
                              "childAgeLimit",
                              e.target.value,
                            )
                          }
                          variant="outlined"
                          size="small"
                          disabled={!formData.familyCoverage.children}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">years</InputAdornment>,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.familyCoverage.parents}
                              onChange={(e) =>
                                handleNestedChange(
                                  "familyCoverage",
                                  "parents",
                                  e.target.checked,
                                )
                              }
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: PRIMARY_BLUE,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: PRIMARY_BLUE,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: TEXT_COLOR_MAIN }}>Parents Covered</Typography>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="number"
                          label="Parent Age Limit"
                          fullWidth
                          value={formData.familyCoverage.parentAgeLimit}
                          onChange={(e) =>
                            handleNestedChange(
                              "familyCoverage",
                              "parentAgeLimit",
                              e.target.value,
                            )
                          }
                          variant="outlined"
                          size="small"
                          disabled={!formData.familyCoverage.parents}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">years</InputAdornment>,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>
                    </Grid> */}
                  {/* </Paper> */}

                  <Grid container spacing={5}>
                    {/* All options in a single row */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                        {/* Spouse Switch */}
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.familyCoverage.spouse}
                              onChange={(e) => handleNestedChange("familyCoverage", "spouse", e.target.checked)}
                              size="small"
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: PRIMARY_BLUE },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: PRIMARY_BLUE }
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Typography variant="body2">Spouse</Typography>
                              <Tooltip title="Coverage for spouse">
                                <InfoIcon fontSize="small" sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
                              </Tooltip>
                            </Box>
                          }
                        />

                        {/* Children Switch & Fields */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.familyCoverage.children}
                                onChange={(e) => handleNestedChange("familyCoverage", "children", e.target.checked)}
                                size="small"
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': { color: PRIMARY_BLUE },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: PRIMARY_BLUE }
                                }}
                              />
                            }
                            label={<Typography variant="body2">Children</Typography>}
                          />

                          <TextField
                            type="number"
                            placeholder="Max"
                            value={formData.familyCoverage.maxChildren}
                            onChange={(e) => handleNestedChange("familyCoverage", "maxChildren", e.target.value)}
                            variant="outlined"
                            size="small"
                            disabled={!formData.familyCoverage.children}
                            InputProps={{ inputProps: { min: 1, max: 10 } }}
                            sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                          />

                          <TextField
                            type="number"
                            placeholder="Age"
                            value={formData.familyCoverage.childAgeLimit}
                            onChange={(e) => handleNestedChange("familyCoverage", "childAgeLimit", e.target.value)}
                            variant="outlined"
                            size="small"
                            disabled={!formData.familyCoverage.children}
                            InputProps={{ endAdornment: <InputAdornment position="end">yrs</InputAdornment> }}
                            sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                          />
                        </Box>

                        {/* Parents Switch & Field */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.familyCoverage.parents}
                                onChange={(e) => handleNestedChange("familyCoverage", "parents", e.target.checked)}
                                size="small"
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': { color: PRIMARY_BLUE },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: PRIMARY_BLUE }
                                }}
                              />
                            }
                            label={<Typography variant="body2">Parents</Typography>}
                          />

                          <TextField
                            type="number"
                            placeholder="Age"
                            value={formData.familyCoverage.parentAgeLimit}
                            onChange={(e) => handleNestedChange("familyCoverage", "parentAgeLimit", e.target.value)}
                            variant="outlined"
                            size="small"
                            disabled={!formData.familyCoverage.parents}
                            InputProps={{ endAdornment: <InputAdornment position="end">yrs</InputAdornment> }}
                            sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        );

      case 2:
        return (
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
                <PaymentIcon sx={{ color: PRIMARY_BLUE, fontSize: 16 }} />
              </Avatar>
              <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
                Premium Details
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="Amount Per Employee"
                    fullWidth
                    required
                    value={formData.premiumDetails.amountPerEmployee}
                    onChange={(e) =>
                      handleNestedChange(
                        "premiumDetails",
                        "amountPerEmployee",
                        e.target.value,
                      )
                    }
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        backgroundColor: '#fff'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="Total Premium"
                    fullWidth
                    required
                    value={formData.premiumDetails.totalPremium}
                    onChange={(e) =>
                      handleNestedChange(
                        "premiumDetails",
                        "totalPremium",
                        e.target.value,
                      )
                    }
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        backgroundColor: '#fff'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Payment Date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    value={formData.premiumDetails.paymentDate}
                    onChange={(e) =>
                      handleNestedChange(
                        "premiumDetails",
                        "paymentDate",
                        e.target.value,
                      )
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        backgroundColor: '#fff'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Payment Frequency"
                    fullWidth
                    required
                    value={formData.premiumDetails.paymentFrequency}
                    onChange={(e) =>
                      handleNestedChange(
                        "premiumDetails",
                        "paymentFrequency",
                        e.target.value,
                      )
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        backgroundColor: '#fff'
                      }
                    }}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="annual">Annual</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Payment Mode"
                    fullWidth
                    required
                    value={formData.premiumDetails.paymentMode}
                    onChange={(e) =>
                      handleNestedChange(
                        "premiumDetails",
                        "paymentMode",
                        e.target.value,
                      )
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        backgroundColor: '#fff'
                      }
                    }}
                  >
                    <MenuItem value="corporate_cheque">Corporate Cheque</MenuItem>
                    <MenuItem value="online_transfer">Online Transfer</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Payment Status"
                    fullWidth
                    required
                    value={formData.premiumDetails.paymentStatus}
                    onChange={(e) =>
                      handleNestedChange(
                        "premiumDetails",
                        "paymentStatus",
                        e.target.value,
                      )
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        backgroundColor: '#fff'
                      }
                    }}
                  >
                    <MenuItem value="pending">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WarningIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                        <Typography>Pending</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="paid">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: '#10b981' }} />
                        <Typography>Paid</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        );

      case 3:
        return (
          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HospitalIcon sx={{ color: PRIMARY_BLUE }} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
                  Network Hospitals
                </Typography>
                <Chip
                  label={formData.networkHospitals.length}
                  size="small"
                  sx={{
                    bgcolor: alpha(PRIMARY_BLUE, 0.1),
                    color: PRIMARY_BLUE,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 20
                  }}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addHospital}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  background: HEADER_GRADIENT,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    background: HEADER_GRADIENT,
                    opacity: 0.9,
                    boxShadow: 'none'
                  }
                }}
              >
                Add Hospital
              </Button>
            </Box>

            {formData.networkHospitals.map((hospital, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  position: "relative",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: `0 4px 12px ${alpha(PRIMARY_BLUE, 0.1)}`,
                    borderColor: PRIMARY_BLUE,
                  },
                }}
                onMouseEnter={() => setHoveredHospital(index)}
                onMouseLeave={() => setHoveredHospital(null)}
              >
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: alpha(PRIMARY_BLUE, 0.1), width: 28, height: 28 }}>
                      <HospitalIcon sx={{ color: PRIMARY_BLUE, fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_COLOR_MAIN }}>
                      Hospital {index + 1}
                    </Typography>
                    {!hospital.name && !hospital.city && (
                      <Chip
                        label="New"
                        size="small"
                        sx={{
                          bgcolor: alpha(PRIMARY_BLUE, 0.1),
                          color: PRIMARY_BLUE,
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    )}
                  </Box>
                  {formData.networkHospitals.length > 1 && (
                    <Tooltip title="Remove Hospital">
                      <IconButton
                        onClick={() => removeHospital(index)}
                        size="small"
                        sx={{
                          color: '#ef4444',
                          '&:hover': {
                            bgcolor: alpha('#ef4444', 0.1)
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Hospital Name"
                        fullWidth
                        required
                        value={hospital.name}
                        onChange={(e) =>
                          handleHospitalChange(index, "name", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="City"
                        fullWidth
                        required
                        value={hospital.city}
                        onChange={(e) =>
                          handleHospitalChange(index, "city", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Address"
                        fullWidth
                        multiline
                        rows={2}
                        value={hospital.address}
                        onChange={(e) =>
                          handleHospitalChange(index, "address", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Phone"
                        fullWidth
                        value={hospital.phone}
                        onChange={(e) =>
                          handleHospitalChange(index, "phone", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Distance from Factory"
                        fullWidth
                        placeholder="e.g., 5 km"
                        value={hospital.distance}
                        onChange={(e) =>
                          handleHospitalChange(index, "distance", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 16 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Hospital Type"
                        fullWidth
                        placeholder="e.g., multi-speciality"
                        value={hospital.type}
                        onChange={(e) =>
                          handleHospitalChange(index, "type", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="date"
                        label="Empaneled Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={hospital.empaneledDate}
                        onChange={(e) =>
                          handleHospitalChange(
                            index,
                            "empaneledDate",
                            e.target.value,
                          )
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            ))}
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: HEADER_GRADIENT,
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
            Add New Policy
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: "#fff", '&:hover': { bgcolor: alpha('#fff', 0.1) } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
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
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc' }}>
        <Stack spacing={3}>
          {/* Step Content */}
          <Paper sx={{ p: 0, borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Box sx={{ p: 3 }}>
              {renderStepContent(activeStep)}
            </Box>
          </Paper>

          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                borderRadius: 2,
                '& .MuiAlert-icon': { color: '#fff' }
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
        }}
      >
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
          Cancel
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
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
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                background: HEADER_GRADIENT,
                minWidth: 120,
                boxShadow: 'none',
                '&:hover': {
                  background: HEADER_GRADIENT,
                  opacity: 0.9,
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Create Policy"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                background: HEADER_GRADIENT,
                minWidth: 100,
                boxShadow: 'none',
                '&:hover': {
                  background: HEADER_GRADIENT,
                  opacity: 0.9,
                  boxShadow: 'none'
                }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddPolicy;