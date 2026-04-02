// // import React, { useState, useEffect } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   Typography,
// //   Grid,
// //   MenuItem,
// //   IconButton,
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Alert,
// //   CircularProgress,
// //   Box,
// //   Paper,
// //   Divider,
// //   Chip,
// //   styled,
// //   StepConnector,
// // } from "@mui/material";

// // import {
// //   Add as AddIcon,
// //   Delete as DeleteIcon,
// //   Close as CloseIcon,
// //   Assignment as AssignmentIcon,
// //   Person as PersonIcon,
// // } from "@mui/icons-material";

// // import axios from "axios";
// // import BASE_URL from "../../../../config/Config";

// // /* ------------------- Custom Stepper Styling ------------------- */

// // const ColorConnector = styled(StepConnector)(() => ({
// //   "& .MuiStepConnector-line": {
// //     height: 4,
// //     border: 0,
// //     backgroundColor: "#e0e0e0",
// //     borderRadius: 10,
// //   },
// //   "&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line":
// //     {
// //       background: "linear-gradient(90deg, #164e63, #00B4D8)",
// //     },
// // }));

// // const HEADER_GRADIENT =
// //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // const steps = [
// //   "Select Enrollment",
// //   "Hospital Details",
// //   "Patient Details",
// //   "Claim Details",
// //   "Documents",
// // ];

// // const AddClaim = ({ open, onClose, onSuccess }) => {
// //   const [activeStep, setActiveStep] = useState(0);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const [enrollments, setEnrollments] = useState([]);
// //   const [selectedEnrollment, setSelectedEnrollment] = useState(null);
// //   const [members, setMembers] = useState([]);

// //   const [formData, setFormData] = useState({
// //     enrollmentId: "",
// //     claimType: "cashless",
// //     hospitalName: "",
// //     hospitalAddress: "",
// //     admissionDate: "",
// //     dischargeDate: "",
// //     diagnosis: "",
// //     treatment: "",
// //     claimedAmount: "",
// //     patientDetails: {
// //       name: "",
// //       relationship: "",
// //       age: "",
// //       gender: "",
// //     },
// //     documents: [{ name: "", url: "" }],
// //   });

// //   /* ---------------- FETCH ENROLLMENTS ---------------- */

// //   useEffect(() => {
// //     if (open) {
// //       fetchEnrollments();
// //       resetForm();
// //     }
// //   }, [open]);

// //   const fetchEnrollments = async () => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(`${BASE_URL}/api/mediclaim/enrollments`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (res.data.success) {
// //         setEnrollments(res.data.data);
// //       }
// //     } catch (err) {
// //       console.error("Enrollment fetch error:", err);
// //     }
// //   };

// //   const resetForm = () => {
// //     setActiveStep(0);
// //     setSelectedEnrollment(null);
// //     setMembers([]);
// //     setError("");
// //     setFormData({
// //       enrollmentId: "",
// //       claimType: "cashless",
// //       hospitalName: "",
// //       hospitalAddress: "",
// //       admissionDate: "",
// //       dischargeDate: "",
// //       diagnosis: "",
// //       treatment: "",
// //       claimedAmount: "",
// //       patientDetails: {
// //         name: "",
// //         relationship: "",
// //         age: "",
// //         gender: "",
// //       },
// //       documents: [{ name: "", url: "" }],
// //     });
// //   };

// //   /* ---------------- ENROLLMENT SELECT ---------------- */

// //   const handleEnrollmentSelect = (id) => {
// //     const enrollment = enrollments.find((e) => e._id === id);

// //     setSelectedEnrollment(enrollment);
// //     setMembers(enrollment?.coverageDetails?.members || []);

// //     setFormData((prev) => ({
// //       ...prev,
// //       enrollmentId: id,
// //       patientDetails: {
// //         name: "",
// //         relationship: "",
// //         age: "",
// //         gender: "",
// //       },
// //     }));
// //   };

// //   /* ---------------- PATIENT SELECT ---------------- */

// //   const handlePatientSelect = (memberId) => {
// //     const member = members.find((m) => m._id === memberId);

// //     if (!member) return;

// //     setFormData((prev) => ({
// //       ...prev,
// //       patientDetails: {
// //         name: member.name,
// //         relationship: member.relationship,
// //         age: member.age,
// //         gender: member.gender,
// //       },
// //     }));
// //   };

// //   /* ---------------- HANDLERS ---------------- */

// //   const handleChange = (field, value) =>
// //     setFormData((prev) => ({ ...prev, [field]: value }));

// //   const handleDocumentChange = (index, field, value) => {
// //     const updated = [...formData.documents];
// //     updated[index][field] = value;
// //     setFormData((prev) => ({ ...prev, documents: updated }));
// //   };

// //   const addDocument = () =>
// //     setFormData((prev) => ({
// //       ...prev,
// //       documents: [...prev.documents, { name: "", url: "" }],
// //     }));

// //   const removeDocument = (index) => {
// //     if (formData.documents.length === 1) return;
// //     const updated = [...formData.documents];
// //     updated.splice(index, 1);
// //     setFormData((prev) => ({ ...prev, documents: updated }));
// //   };

// //   /* ---------------- VALIDATION ---------------- */

// //   const validateStep = () => {
// //     if (activeStep === 0 && !formData.enrollmentId)
// //       return "Please select an enrollment.";

// //     if (activeStep === 1) {
// //       if (!formData.hospitalName) return "Hospital name is required.";
// //       if (!formData.hospitalAddress) return "Hospital address is required.";
// //       if (!formData.admissionDate) return "Admission date is required.";
// //     }

// //     if (activeStep === 2 && !formData.patientDetails.name)
// //       return "Please select a patient.";

// //     if (activeStep === 3) {
// //       if (!formData.diagnosis) return "Diagnosis is required.";
// //       if (!formData.treatment) return "Treatment is required.";
// //       if (!formData.claimedAmount) return "Claimed amount is required.";
// //     }

// //     return null;
// //   };

// //   const handleNext = () => {
// //     const validationError = validateStep();
// //     if (validationError) {
// //       setError(validationError);
// //       return;
// //     }
// //     setError("");
// //     setActiveStep((prev) => prev + 1);
// //   };

// //   const handleBack = () => {
// //     setError("");
// //     setActiveStep((prev) => prev - 1);
// //   };

// //   /* ---------------- SUBMIT ---------------- */

// //   const handleSubmit = async () => {
// //     const validationError = validateStep();
// //     if (validationError) {
// //       setError(validationError);
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       setError("");

// //       const token = localStorage.getItem("token");

// //       const payload = {
// //         enrollmentId: formData.enrollmentId,
// //         claimType: formData.claimType,
// //         hospitalName: formData.hospitalName,
// //         hospitalAddress: formData.hospitalAddress,
// //         admissionDate: formData.admissionDate,
// //         dischargeDate: formData.dischargeDate || null,
// //         diagnosis: formData.diagnosis,
// //         treatment: formData.treatment,
// //         claimedAmount: Number(formData.claimedAmount),
// //         patientDetails: {
// //           ...formData.patientDetails,
// //           age: Number(formData.patientDetails.age),
// //         },
// //         documents: formData.documents.filter((doc) => doc.name && doc.url),
// //       };

// //       const res = await axios.post(
// //         `${BASE_URL}/api/mediclaim/claims`,
// //         payload,
// //         { headers: { Authorization: `Bearer ${token}` } },
// //       );

// //       if (res.data.success) {
// //         onSuccess?.();
// //         onClose();
// //         resetForm();
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Failed to submit claim.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------------- RENDER ---------------- */

// //   const renderStepContent = () => {
// //     switch (activeStep) {
// //       case 0:
// //         return (
// //           <TextField
// //             select
// //             fullWidth
// //             label="Select Enrollment"
// //             value={formData.enrollmentId}
// //             onChange={(e) => handleEnrollmentSelect(e.target.value)}
// //             SelectProps={{
// //               MenuProps: {
// //                 PaperProps: {
// //                   sx: {
// //                     maxHeight: 48 * 5, // 5 items visible
// //                   },
// //                 },
// //               },
// //             }}
// //           >
// //             {enrollments.map((enr) => (
// //               <MenuItem key={enr._id} value={enr._id}>
// //                 {enr.enrollmentId} — {enr.policyId?.policyName}
// //               </MenuItem>
// //             ))}
// //           </TextField>
// //         );

// //       case 1:
// //         return (
// //           <Grid container spacing={2}>
// //             <Grid item xs={6}>
// //               <TextField
// //                 select
// //                 fullWidth
// //                 label="Claim Type"
// //                 value={formData.claimType}
// //                 onChange={(e) => handleChange("claimType", e.target.value)}
// //               >
// //                 <MenuItem value="cashless">Cashless</MenuItem>
// //                 <MenuItem value="reimbursement">Reimbursement</MenuItem>
// //               </TextField>
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Hospital Name"
// //                 value={formData.hospitalName}
// //                 onChange={(e) => handleChange("hospitalName", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={12}>
// //               <TextField
// //                 fullWidth
// //                 label="Hospital Address"
// //                 value={formData.hospitalAddress}
// //                 onChange={(e) =>
// //                   handleChange("hospitalAddress", e.target.value)
// //                 }
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 type="date"
// //                 fullWidth
// //                 label="Admission Date"
// //                 InputLabelProps={{ shrink: true }}
// //                 value={formData.admissionDate}
// //                 onChange={(e) => handleChange("admissionDate", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 type="date"
// //                 fullWidth
// //                 label="Discharge Date"
// //                 InputLabelProps={{ shrink: true }}
// //                 value={formData.dischargeDate}
// //                 onChange={(e) => handleChange("dischargeDate", e.target.value)}
// //               />
// //             </Grid>
// //           </Grid>
// //         );

// //       case 2:
// //         return (
// //           <TextField
// //             select
// //             fullWidth
// //             label="Select Patient"
// //             onChange={(e) => handlePatientSelect(e.target.value)}
// //           >
// //             {members.map((m) => (
// //               <MenuItem key={m._id} value={m._id}>
// //                 <PersonIcon sx={{ mr: 1 }} />
// //                 {m.name} ({m.relationship})
// //               </MenuItem>
// //             ))}
// //           </TextField>
// //         );

// //       case 3:
// //         return (
// //           <Grid container spacing={2}>
// //             <Grid item xs={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Diagnosis"
// //                 value={formData.diagnosis}
// //                 onChange={(e) => handleChange("diagnosis", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Treatment"
// //                 value={formData.treatment}
// //                 onChange={(e) => handleChange("treatment", e.target.value)}
// //               />
// //             </Grid>

// //             <Grid item xs={6}>
// //               <TextField
// //                 type="number"
// //                 fullWidth
// //                 label="Claimed Amount"
// //                 value={formData.claimedAmount}
// //                 onChange={(e) => handleChange("claimedAmount", e.target.value)}
// //               />
// //             </Grid>
// //           </Grid>
// //         );

// //       case 4:
// //         return (
// //           <>
// //             {formData.documents.map((doc, index) => (
// //               <Box key={index} mb={2}>
// //                 <Grid container spacing={2}>
// //                   <Grid item xs={5}>
// //                     <TextField
// //                       fullWidth
// //                       label="Document Name"
// //                       value={doc.name}
// //                       onChange={(e) =>
// //                         handleDocumentChange(index, "name", e.target.value)
// //                       }
// //                     />
// //                   </Grid>

// //                   <Grid item xs={6}>
// //                     <TextField
// //                       fullWidth
// //                       label="Document URL"
// //                       value={doc.url}
// //                       onChange={(e) =>
// //                         handleDocumentChange(index, "url", e.target.value)
// //                       }
// //                     />
// //                   </Grid>

// //                   <Grid item xs={1}>
// //                     <IconButton
// //                       color="error"
// //                       onClick={() => removeDocument(index)}
// //                     >
// //                       <DeleteIcon />
// //                     </IconButton>
// //                   </Grid>
// //                 </Grid>
// //               </Box>
// //             ))}

// //             <Button startIcon={<AddIcon />} onClick={addDocument}>
// //               Add Document
// //             </Button>
// //           </>
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
// //         }}
// //       >
// //         Submit New Claim
// //         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
// //           <CloseIcon />
// //         </IconButton>
// //       </DialogTitle>

// //       <DialogContent sx={{ py: 4, mt: 3 }}>
// //         <Stepper
// //           activeStep={activeStep}
// //           alternativeLabel
// //           connector={<ColorConnector />}
// //           sx={{ mb: 4 }}
// //         >
// //           {steps.map((label) => (
// //             <Step key={label}>
// //               <StepLabel>{label}</StepLabel>
// //             </Step>
// //           ))}
// //         </Stepper>

// //         {renderStepContent()}

// //         {error && (
// //           <Box mt={2}>
// //             <Alert severity="error">{error}</Alert>
// //           </Box>
// //         )}
// //       </DialogContent>

// //       <Divider />

// //       <DialogActions sx={{ px: 3, py: 2 }}>
// //         {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

// //         {activeStep < steps.length - 1 ? (
// //           <Button
// //             variant="contained"
// //             onClick={handleNext}
// //             sx={{ background: HEADER_GRADIENT }}
// //           >
// //             Next
// //           </Button>
// //         ) : (
// //           <Button
// //             variant="contained"
// //             onClick={handleSubmit}
// //             disabled={loading}
// //             sx={{ background: HEADER_GRADIENT }}
// //           >
// //             {loading ? <CircularProgress size={24} /> : "Submit"}
// //           </Button>
// //         )}
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default AddClaim;


// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   Grid,
//   MenuItem,
//   IconButton,
//   Stepper,
//   Step,
//   StepLabel,
//   Alert,
//   CircularProgress,
//   Box,
//   Paper,
//   Divider,
//   Chip,
//   styled,
//   StepConnector,
//   stepConnectorClasses,
//   InputAdornment,
//   FormHelperText,
//   Avatar,
//   Stack
// } from "@mui/material";

// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon,
//   Assignment as AssignmentIcon,
//   Person as PersonIcon,
//   LocalHospital as HospitalIcon,
//   MedicalServices as MedicalIcon,
//   AttachMoney as MoneyIcon,
//   Description as DescriptionIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   FamilyRestroom as FamilyIcon,
//   CheckCircle as CheckCircleIcon
// } from "@mui/icons-material";

// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

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

// // Custom Stepper Connector
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundColor: COLORS.primary,
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundColor: COLORS.primary,
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 2,
//     border: 0,
//     backgroundColor: COLORS.border,
//     borderRadius: 1,
//   },
// }));

// const steps = [
//   { label: "Select Enrollment", icon: <AssignmentIcon sx={{ fontSize: '0.7rem' }} /> },
//   { label: "Hospital Details", icon: <HospitalIcon sx={{ fontSize: '0.7rem' }} /> },
//   { label: "Patient Details", icon: <FamilyIcon sx={{ fontSize: '0.7rem' }} /> },
//   { label: "Claim Details", icon: <MedicalIcon sx={{ fontSize: '0.7rem' }} /> },
//   { label: "Documents", icon: <DescriptionIcon sx={{ fontSize: '0.7rem' }} /> }
// ];

// const AddClaim = ({ open, onClose, onSuccess }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   const [enrollments, setEnrollments] = useState([]);
//   const [selectedEnrollment, setSelectedEnrollment] = useState(null);
//   const [members, setMembers] = useState([]);

//   const [formData, setFormData] = useState({
//     enrollmentId: "",
//     claimType: "cashless",
//     hospitalName: "",
//     hospitalAddress: "",
//     admissionDate: "",
//     dischargeDate: "",
//     diagnosis: "",
//     treatment: "",
//     claimedAmount: "",
//     patientDetails: {
//       name: "",
//       relationship: "",
//       age: "",
//       gender: "",
//     },
//     documents: [{ name: "", url: "" }],
//   });

//   useEffect(() => {
//     if (open) {
//       fetchEnrollments();
//       resetForm();
//     }
//   }, [open]);

//   const fetchEnrollments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${BASE_URL}/api/mediclaim/enrollments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) {
//         setEnrollments(res.data.data);
//       }
//     } catch (err) {
//       console.error("Enrollment fetch error:", err);
//     }
//   };

//   const resetForm = () => {
//     setActiveStep(0);
//     setSelectedEnrollment(null);
//     setMembers([]);
//     setError("");
//     setFieldErrors({});
//     setTouched({});
//     setFormData({
//       enrollmentId: "",
//       claimType: "cashless",
//       hospitalName: "",
//       hospitalAddress: "",
//       admissionDate: "",
//       dischargeDate: "",
//       diagnosis: "",
//       treatment: "",
//       claimedAmount: "",
//       patientDetails: { name: "", relationship: "", age: "", gender: "" },
//       documents: [{ name: "", url: "" }],
//     });
//   };

//   const handleEnrollmentSelect = (id) => {
//     const enrollment = enrollments.find((e) => e._id === id);
//     setSelectedEnrollment(enrollment);
//     setMembers(enrollment?.coverageDetails?.members || []);
//     setFormData((prev) => ({
//       ...prev,
//       enrollmentId: id,
//       patientDetails: { name: "", relationship: "", age: "", gender: "" },
//     }));
//     if (fieldErrors.enrollmentId) setFieldErrors(prev => ({ ...prev, enrollmentId: '' }));
//   };

//   const handlePatientSelect = (memberId) => {
//     const member = members.find((m) => m._id === memberId);
//     if (!member) return;
//     setFormData((prev) => ({
//       ...prev,
//       patientDetails: {
//         name: member.name,
//         relationship: member.relationship,
//         age: member.age,
//         gender: member.gender,
//       },
//     }));
//     if (fieldErrors.patientDetails) setFieldErrors(prev => ({ ...prev, patientDetails: '' }));
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
//   };

//   const handleNestedChange = (parent, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [parent]: { ...prev[parent], [field]: value },
//     }));
//     if (fieldErrors[`${parent}.${field}`]) setFieldErrors(prev => ({ ...prev, [`${parent}.${field}`]: '' }));
//   };

//   const handleDocumentChange = (index, field, value) => {
//     const updated = [...formData.documents];
//     updated[index][field] = value;
//     setFormData((prev) => ({ ...prev, documents: updated }));
//   };

//   const addDocument = () => {
//     setFormData((prev) => ({
//       ...prev,
//       documents: [...prev.documents, { name: "", url: "" }],
//     }));
//   };

//   const removeDocument = (index) => {
//     if (formData.documents.length === 1) return;
//     const updated = [...formData.documents];
//     updated.splice(index, 1);
//     setFormData((prev) => ({ ...prev, documents: updated }));
//   };

//   const handleBlur = (field) => {
//     setTouched(prev => ({ ...prev, [field]: true }));
//   };

//   const validateStep = () => {
//     const errors = {};
//     let isValid = true;

//     if (activeStep === 0 && !formData.enrollmentId) {
//       errors.enrollmentId = "Please select an enrollment";
//       isValid = false;
//     }

//     if (activeStep === 1) {
//       if (!formData.hospitalName) { errors.hospitalName = "Hospital name is required"; isValid = false; }
//       if (!formData.hospitalAddress) { errors.hospitalAddress = "Hospital address is required"; isValid = false; }
//       if (!formData.admissionDate) { errors.admissionDate = "Admission date is required"; isValid = false; }
//     }

//     if (activeStep === 2 && !formData.patientDetails.name) {
//       errors.patientDetails = "Please select a patient";
//       isValid = false;
//     }

//     if (activeStep === 3) {
//       if (!formData.diagnosis) { errors.diagnosis = "Diagnosis is required"; isValid = false; }
//       if (!formData.treatment) { errors.treatment = "Treatment is required"; isValid = false; }
//       if (!formData.claimedAmount) { errors.claimedAmount = "Claimed amount is required"; isValid = false; }
//       else if (parseFloat(formData.claimedAmount) <= 0) { errors.claimedAmount = "Claimed amount must be greater than 0"; isValid = false; }
//     }

//     setFieldErrors(errors);
//     if (!isValid) setError("Please fill in all required fields");
//     else setError("");
//     return isValid;
//   };

//   const handleNext = () => {
//     if (validateStep()) {
//       setActiveStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     setError("");
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleSubmit = async () => {
//     if (!validateStep()) return;

//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");
//       const payload = {
//         enrollmentId: formData.enrollmentId,
//         claimType: formData.claimType,
//         hospitalName: formData.hospitalName,
//         hospitalAddress: formData.hospitalAddress,
//         admissionDate: formData.admissionDate,
//         dischargeDate: formData.dischargeDate || null,
//         diagnosis: formData.diagnosis,
//         treatment: formData.treatment,
//         claimedAmount: Number(formData.claimedAmount),
//         patientDetails: {
//           ...formData.patientDetails,
//           age: Number(formData.patientDetails.age),
//         },
//         documents: formData.documents.filter((doc) => doc.name && doc.url),
//       };

//       const res = await axios.post(`${BASE_URL}/api/mediclaim/claims`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         onSuccess?.();
//         onClose();
//         resetForm();
//       } else {
//         setError(res.data.message || "Failed to submit claim");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit claim. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     resetForm();
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

//   const getErrorProps = (field) => {
//     const hasError = touched[field] && fieldErrors[field];
//     return { error: !!hasError, helperText: hasError || '' };
//   };

//   const renderStepContent = () => {
//     switch (activeStep) {
//       case 0:
//         return (
//           <Box>
//             <Typography sx={labelStyle}>Select Enrollment *</Typography>
//             <TextField
//               select
//               fullWidth
//               size="small"
//               value={formData.enrollmentId}
//               onChange={(e) => handleEnrollmentSelect(e.target.value)}
//               onBlur={() => handleBlur('enrollmentId')}
//               error={touched.enrollmentId && !!fieldErrors.enrollmentId}
//               helperText={touched.enrollmentId ? fieldErrors.enrollmentId : ''}
//               sx={inputStyle}
//               SelectProps={{
//                 MenuProps: {
//                   PaperProps: {
//                     sx: { maxHeight: 200, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }
//                   }
//                 }
//               }}
//             >
//               <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select enrollment</MenuItem>
//               {enrollments.map((enr) => (
//                 <MenuItem key={enr._id} value={enr._id} sx={{ fontSize: '0.75rem' }}>
//                   {enr.enrollmentId} — {enr.policyId?.policyName}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>
//         );

//       case 1:
//         return (
//           <Grid container spacing={2}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography sx={labelStyle}>Claim Type</Typography>
//               <TextField
//                 select
//                 fullWidth
//                 size="small"
//                 value={formData.claimType}
//                 onChange={(e) => handleChange("claimType", e.target.value)}
//                 sx={inputStyle}
//               >
//                 <MenuItem value="cashless" sx={{ fontSize: '0.75rem' }}>Cashless</MenuItem>
//                 <MenuItem value="reimbursement" sx={{ fontSize: '0.75rem' }}>Reimbursement</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography sx={labelStyle}>Hospital Name *</Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={formData.hospitalName}
//                 onChange={(e) => handleChange("hospitalName", e.target.value)}
//                 onBlur={() => handleBlur('hospitalName')}
//                 error={touched.hospitalName && !!fieldErrors.hospitalName}
//                 helperText={touched.hospitalName ? fieldErrors.hospitalName : ''}
//                 sx={inputStyle}
//               />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <Typography sx={labelStyle}>Hospital Address *</Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 multiline
//                 rows={2}
//                 value={formData.hospitalAddress}
//                 onChange={(e) => handleChange("hospitalAddress", e.target.value)}
//                 onBlur={() => handleBlur('hospitalAddress')}
//                 error={touched.hospitalAddress && !!fieldErrors.hospitalAddress}
//                 helperText={touched.hospitalAddress ? fieldErrors.hospitalAddress : ''}
//                 sx={inputStyle}
//               />
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography sx={labelStyle}>Admission Date *</Typography>
//               <TextField
//                 type="date"
//                 fullWidth
//                 size="small"
//                 InputLabelProps={{ shrink: true }}
//                 value={formData.admissionDate}
//                 onChange={(e) => handleChange("admissionDate", e.target.value)}
//                 onBlur={() => handleBlur('admissionDate')}
//                 error={touched.admissionDate && !!fieldErrors.admissionDate}
//                 helperText={touched.admissionDate ? fieldErrors.admissionDate : ''}
//                 sx={inputStyle}
//               />
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography sx={labelStyle}>Discharge Date</Typography>
//               <TextField
//                 type="date"
//                 fullWidth
//                 size="small"
//                 InputLabelProps={{ shrink: true }}
//                 value={formData.dischargeDate}
//                 onChange={(e) => handleChange("dischargeDate", e.target.value)}
//                 sx={inputStyle}
//               />
//             </Grid>
//           </Grid>
//         );

//       case 2:
//         return (
//           <Box>
//             <Typography sx={labelStyle}>Select Patient *</Typography>
//             <TextField
//               select
//               fullWidth
//               size="small"
//               onChange={(e) => handlePatientSelect(e.target.value)}
//               onBlur={() => handleBlur('patientDetails')}
//               error={touched.patientDetails && !!fieldErrors.patientDetails}
//               helperText={touched.patientDetails ? fieldErrors.patientDetails : ''}
//               sx={inputStyle}
//               SelectProps={{
//                 MenuProps: {
//                   PaperProps: {
//                     sx: { maxHeight: 200, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }
//                   }
//                 }
//               }}
//             >
//               <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select patient</MenuItem>
//               {members.map((m) => (
//                 <MenuItem key={m._id} value={m._id} sx={{ fontSize: '0.75rem' }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <PersonIcon sx={{ fontSize: '0.7rem', color: COLORS.primary }} />
//                     <Typography sx={{ fontSize: '0.75rem' }}>{m.name} ({m.relationship})</Typography>
//                   </Box>
//                 </MenuItem>
//               ))}
//             </TextField>

//             {formData.patientDetails.name && (
//               <Paper sx={{ mt: 2, p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
//                   Selected Patient Details
//                 </Typography>
//                 <Grid container spacing={2}>
//                   <Grid size={{ xs: 6 }}><Typography sx={labelStyle}>Name</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.patientDetails.name}</Typography></Grid>
//                   <Grid size={{ xs: 6 }}><Typography sx={labelStyle}>Relationship</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.patientDetails.relationship}</Typography></Grid>
//                   <Grid size={{ xs: 6 }}><Typography sx={labelStyle}>Age</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.patientDetails.age} years</Typography></Grid>
//                   <Grid size={{ xs: 6 }}><Typography sx={labelStyle}>Gender</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.patientDetails.gender === 'M' ? 'Male' : formData.patientDetails.gender === 'F' ? 'Female' : 'Other'}</Typography></Grid>
//                 </Grid>
//               </Paper>
//             )}
//           </Box>
//         );

//       case 3:
//         return (
//           <Grid container spacing={2}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography sx={labelStyle}>Diagnosis *</Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={formData.diagnosis}
//                 onChange={(e) => handleChange("diagnosis", e.target.value)}
//                 onBlur={() => handleBlur('diagnosis')}
//                 error={touched.diagnosis && !!fieldErrors.diagnosis}
//                 helperText={touched.diagnosis ? fieldErrors.diagnosis : ''}
//                 sx={inputStyle}
//                 placeholder="e.g., Fracture, Infection, etc."
//               />
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography sx={labelStyle}>Treatment *</Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={formData.treatment}
//                 onChange={(e) => handleChange("treatment", e.target.value)}
//                 onBlur={() => handleBlur('treatment')}
//                 error={touched.treatment && !!fieldErrors.treatment}
//                 helperText={touched.treatment ? fieldErrors.treatment : ''}
//                 sx={inputStyle}
//                 placeholder="e.g., Surgery, Medication, etc."
//               />
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography sx={labelStyle}>Claimed Amount *</Typography>
//               <TextField
//                 type="number"
//                 fullWidth
//                 size="small"
//                 value={formData.claimedAmount}
//                 onChange={(e) => handleChange("claimedAmount", e.target.value)}
//                 onBlur={() => handleBlur('claimedAmount')}
//                 error={touched.claimedAmount && !!fieldErrors.claimedAmount}
//                 helperText={touched.claimedAmount ? fieldErrors.claimedAmount : ''}
//                 sx={inputStyle}
//                 InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment>, inputProps: { min: 0 } }}
//               />
//             </Grid>
//           </Grid>
//         );

//       case 4:
//         return (
//           <Stack spacing={2}>
//             {formData.documents.map((doc, index) => (
//               <Paper key={index} sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid size={{ xs: 12, md: 5 }}>
//                     <Typography sx={labelStyle}>Document Name</Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={doc.name}
//                       onChange={(e) => handleDocumentChange(index, "name", e.target.value)}
//                       placeholder="e.g., Discharge Summary"
//                       sx={inputStyle}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography sx={labelStyle}>Document URL</Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={doc.url}
//                       onChange={(e) => handleDocumentChange(index, "url", e.target.value)}
//                       placeholder="https://example.com/document.pdf"
//                       sx={inputStyle}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 1 }}>
//                     <IconButton color="error" onClick={() => removeDocument(index)} sx={{ mt: 1.5 }}>
//                       <DeleteIcon sx={{ fontSize: '0.9rem' }} />
//                     </IconButton>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             ))}
//             <Button
//               startIcon={<AddIcon sx={{ fontSize: '0.9rem' }} />}
//               onClick={addDocument}
//               sx={{ alignSelf: 'flex-start', height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.primary, fontSize: '0.7rem', textTransform: 'none' }}
//             >
//               Add Document
//             </Button>
//           </Stack>
//         );

//       default: return null;
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden',
//           maxHeight: '90vh'
//         }
//       }}
//     >
//        <DialogTitle sx={{
//               borderBottom: `1px solid ${COLORS.border}`,
//               py: 1.5,
//               px: 2.5,
//               mb: 2,
//               bgcolor: COLORS.background.white,
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}>
//               <Typography
//                 sx={{
//                   fontSize: '1.2rem',
//                   fontWeight: 700,
//                   color: COLORS.text.primary
//                 }}
//               >
//                Submit New Claim
//               </Typography>
//             </DialogTitle>

//       <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
//         <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
//           {steps.map((step, index) => (
//             <Step key={step.label}>
//               <StepLabel>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
//                   {step.label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//         {renderStepContent()}
//         {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         justifyContent: 'space-between'
//       }}>
//         <Button onClick={handleClose} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Cancel</Button>
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           {activeStep > 0 && (
//             <Button onClick={handleBack} startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Back</Button>
//           )}
//           {activeStep < steps.length - 1 ? (
//             <Button variant="contained" onClick={handleNext} endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Next</Button>
//           ) : (
//             <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>{loading ? 'Submitting...' : 'Submit Claim'}</Button>
//           )}
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddClaim;






import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Box,
  Paper,
  Divider,
  Chip,
  styled,
  StepConnector,
  stepConnectorClasses,
  InputAdornment,
  FormHelperText,
  Avatar,
  Stack,
  Autocomplete,
  Tooltip
} from "@mui/material";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  MedicalServices as MedicalIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  FamilyRestroom as FamilyIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../../config/Config";
import AddEnrollment from "../enrollment/AddEnrollment";


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

const steps = [
  { label: "Select Enrollment", icon: <AssignmentIcon sx={{ fontSize: '0.7rem' }} /> },
  { label: "Hospital Details", icon: <HospitalIcon sx={{ fontSize: '0.7rem' }} /> },
  { label: "Patient Details", icon: <FamilyIcon sx={{ fontSize: '0.7rem' }} /> },
  { label: "Claim Details", icon: <MedicalIcon sx={{ fontSize: '0.7rem' }} /> },
  { label: "Documents", icon: <DescriptionIcon sx={{ fontSize: '0.7rem' }} /> }
];

const AddClaim = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  
  // State for Add Enrollment dialog
  const [addEnrollmentOpen, setAddEnrollmentOpen] = useState(false);

  const [formData, setFormData] = useState({
    enrollmentId: "",
    claimType: "cashless",
    hospitalName: "",
    hospitalAddress: "",
    admissionDate: "",
    dischargeDate: "",
    diagnosis: "",
    treatment: "",
    claimedAmount: "",
    patientDetails: {
      name: "",
      relationship: "",
      age: "",
      gender: "",
    },
    documents: [{ name: "", url: "" }],
  });

  useEffect(() => {
    if (open) {
      fetchEnrollments();
      resetForm();
    }
  }, [open]);

  const fetchEnrollments = async () => {
    try {
      setLoadingEnrollments(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/mediclaim/enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setEnrollments(res.data.data);
      }
    } catch (err) {
      console.error("Enrollment fetch error:", err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedEnrollment(null);
    setMembers([]);
    setError("");
    setFieldErrors({});
    setTouched({});
    setFormData({
      enrollmentId: "",
      claimType: "cashless",
      hospitalName: "",
      hospitalAddress: "",
      admissionDate: "",
      dischargeDate: "",
      diagnosis: "",
      treatment: "",
      claimedAmount: "",
      patientDetails: { name: "", relationship: "", age: "", gender: "" },
      documents: [{ name: "", url: "" }],
    });
  };

  const handleEnrollmentSelect = (event, newValue) => {
    const enrollment = newValue;
    setSelectedEnrollment(enrollment);
    setMembers(enrollment?.coverageDetails?.members || []);
    setFormData((prev) => ({
      ...prev,
      enrollmentId: enrollment?._id || "",
      patientDetails: { name: "", relationship: "", age: "", gender: "" },
    }));
    if (fieldErrors.enrollmentId) setFieldErrors(prev => ({ ...prev, enrollmentId: '' }));
    setTouched(prev => ({ ...prev, enrollmentId: true }));
  };

  const handlePatientSelect = (memberId) => {
    const member = members.find((m) => m._id === memberId);
    if (!member) return;
    setFormData((prev) => ({
      ...prev,
      patientDetails: {
        name: member.name,
        relationship: member.relationship,
        age: member.age,
        gender: member.gender,
      },
    }));
    if (fieldErrors.patientDetails) setFieldErrors(prev => ({ ...prev, patientDetails: '' }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
    if (fieldErrors[`${parent}.${field}`]) setFieldErrors(prev => ({ ...prev, [`${parent}.${field}`]: '' }));
  };

  const handleDocumentChange = (index, field, value) => {
    const updated = [...formData.documents];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, documents: updated }));
  };

  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: "", url: "" }],
    }));
  };

  const removeDocument = (index) => {
    if (formData.documents.length === 1) return;
    const updated = [...formData.documents];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, documents: updated }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleEnrollmentAdded = (newEnrollment) => {
    setEnrollments(prev => [...prev, newEnrollment]);
    // Auto-select the newly added enrollment
    setSelectedEnrollment(newEnrollment);
    setMembers(newEnrollment?.coverageDetails?.members || []);
    setFormData((prev) => ({
      ...prev,
      enrollmentId: newEnrollment._id,
      patientDetails: { name: "", relationship: "", age: "", gender: "" },
    }));
  };

  const validateStep = () => {
    const errors = {};
    let isValid = true;

    if (activeStep === 0 && !formData.enrollmentId) {
      errors.enrollmentId = "Please select an enrollment";
      isValid = false;
    }

    if (activeStep === 1) {
      if (!formData.hospitalName) { errors.hospitalName = "Hospital name is required"; isValid = false; }
      if (!formData.hospitalAddress) { errors.hospitalAddress = "Hospital address is required"; isValid = false; }
      if (!formData.admissionDate) { errors.admissionDate = "Admission date is required"; isValid = false; }
    }

    if (activeStep === 2 && !formData.patientDetails.name) {
      errors.patientDetails = "Please select a patient";
      isValid = false;
    }

    if (activeStep === 3) {
      if (!formData.diagnosis) { errors.diagnosis = "Diagnosis is required"; isValid = false; }
      if (!formData.treatment) { errors.treatment = "Treatment is required"; isValid = false; }
      if (!formData.claimedAmount) { errors.claimedAmount = "Claimed amount is required"; isValid = false; }
      else if (parseFloat(formData.claimedAmount) <= 0) { errors.claimedAmount = "Claimed amount must be greater than 0"; isValid = false; }
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
    setError("");
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const payload = {
        enrollmentId: formData.enrollmentId,
        claimType: formData.claimType,
        hospitalName: formData.hospitalName,
        hospitalAddress: formData.hospitalAddress,
        admissionDate: formData.admissionDate,
        dischargeDate: formData.dischargeDate || null,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        claimedAmount: Number(formData.claimedAmount),
        patientDetails: {
          ...formData.patientDetails,
          age: Number(formData.patientDetails.age),
        },
        documents: formData.documents.filter((doc) => doc.name && doc.url),
      };

      const res = await axios.post(`${BASE_URL}/api/mediclaim/claims`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        onSuccess?.();
        onClose();
        resetForm();
      } else {
        setError(res.data.message || "Failed to submit claim");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
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

  const getErrorProps = (field) => {
    const hasError = touched[field] && fieldErrors[field];
    return { error: !!hasError, helperText: hasError || '' };
  };

  const getEnrollmentDisplay = (enrollment) => {
    if (!enrollment) return '';
    const enrollmentId = enrollment.enrollmentId || enrollment._id;
    const policyName = enrollment.policyId?.policyName || '';
    const employeeName = enrollment.employeeId ? 
      `${enrollment.employeeId?.FirstName || ''} ${enrollment.employeeId?.LastName || ''}`.trim() : '';
    return `${enrollmentId}${policyName ? ` - ${policyName}` : ''}${employeeName ? ` (${employeeName})` : ''}`;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography sx={labelStyle}>Select Enrollment *</Typography>
              <Tooltip title="Add New Enrollment">
                <IconButton
                  size="small"
                  onClick={() => setAddEnrollmentOpen(true)}
                  sx={{
                    color: COLORS.primary,
                    '&:hover': { bgcolor: COLORS.primaryLight }
                  }}
                >
                  <AddIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Autocomplete
              fullWidth
              size="small"
              options={enrollments}
              value={selectedEnrollment || null}
              onChange={handleEnrollmentSelect}
              getOptionLabel={(option) => getEnrollmentDisplay(option)}
              loading={loadingEnrollments}
              disabled={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search enrollment by ID, policy or employee..."
                  error={touched.enrollmentId && !!fieldErrors.enrollmentId}
                  helperText={touched.enrollmentId ? fieldErrors.enrollmentId : ''}
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
                        {loadingEnrollments && <CircularProgress size={16} />}
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
                      {option.enrollmentId || option._id}
                    </Typography>
                    {option.policyId?.policyName && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Policy: {option.policyId.policyName}
                      </Typography>
                    )}
                    {option.employeeId && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Employee: {option.employeeId.FirstName} {option.employeeId.LastName}
                      </Typography>
                    )}
                  </Box>
                </li>
              )}
            />
          </Box>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>Claim Type</Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={formData.claimType}
                onChange={(e) => handleChange("claimType", e.target.value)}
                sx={inputStyle}
              >
                <MenuItem value="cashless" sx={{ fontSize: '0.75rem' }}>Cashless</MenuItem>
                <MenuItem value="reimbursement" sx={{ fontSize: '0.75rem' }}>Reimbursement</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>Hospital Name *</Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.hospitalName}
                onChange={(e) => handleChange("hospitalName", e.target.value)}
                onBlur={() => handleBlur('hospitalName')}
                error={touched.hospitalName && !!fieldErrors.hospitalName}
                helperText={touched.hospitalName ? fieldErrors.hospitalName : ''}
                sx={inputStyle}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography sx={labelStyle}>Hospital Address *</Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                value={formData.hospitalAddress}
                onChange={(e) => handleChange("hospitalAddress", e.target.value)}
                onBlur={() => handleBlur('hospitalAddress')}
                error={touched.hospitalAddress && !!fieldErrors.hospitalAddress}
                helperText={touched.hospitalAddress ? fieldErrors.hospitalAddress : ''}
                sx={inputStyle}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>Admission Date *</Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={formData.admissionDate}
                onChange={(e) => handleChange("admissionDate", e.target.value)}
                onBlur={() => handleBlur('admissionDate')}
                error={touched.admissionDate && !!fieldErrors.admissionDate}
                helperText={touched.admissionDate ? fieldErrors.admissionDate : ''}
                sx={inputStyle}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>Discharge Date</Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={formData.dischargeDate}
                onChange={(e) => handleChange("dischargeDate", e.target.value)}
                sx={inputStyle}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography sx={labelStyle}>Select Patient *</Typography>
            <TextField
              select
              fullWidth
              size="small"
              onChange={(e) => handlePatientSelect(e.target.value)}
              onBlur={() => handleBlur('patientDetails')}
              error={touched.patientDetails && !!fieldErrors.patientDetails}
              helperText={touched.patientDetails ? fieldErrors.patientDetails : ''}
              sx={inputStyle}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: { maxHeight: 200, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }
                  }
                }
              }}
            >
              <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select patient</MenuItem>
              {members.map((m) => (
                <MenuItem key={m._id} value={m._id} sx={{ fontSize: '0.75rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: '0.7rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem' }}>{m.name} ({m.relationship})</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {formData.patientDetails.name && (
              <Paper sx={{ mt: 2, p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
                  Selected Patient Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}><Typography sx={labelStyle}>Name</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.patientDetails.name}</Typography></Grid>
                  <Grid size={{ xs: 6 }}><Typography sx={labelStyle}>Relationship</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.patientDetails.relationship}</Typography></Grid>
                  <Grid size={{ xs: 6 }}><Typography sx={labelStyle}>Age</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.patientDetails.age} years</Typography></Grid>
                  <Grid size={{ xs: 6 }}><Typography sx={labelStyle}>Gender</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.patientDetails.gender === 'M' ? 'Male' : formData.patientDetails.gender === 'F' ? 'Female' : 'Other'}</Typography></Grid>
                </Grid>
              </Paper>
            )}
          </Box>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>Diagnosis *</Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.diagnosis}
                onChange={(e) => handleChange("diagnosis", e.target.value)}
                onBlur={() => handleBlur('diagnosis')}
                error={touched.diagnosis && !!fieldErrors.diagnosis}
                helperText={touched.diagnosis ? fieldErrors.diagnosis : ''}
                sx={inputStyle}
                placeholder="e.g., Fracture, Infection, etc."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>Treatment *</Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.treatment}
                onChange={(e) => handleChange("treatment", e.target.value)}
                onBlur={() => handleBlur('treatment')}
                error={touched.treatment && !!fieldErrors.treatment}
                helperText={touched.treatment ? fieldErrors.treatment : ''}
                sx={inputStyle}
                placeholder="e.g., Surgery, Medication, etc."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>Claimed Amount *</Typography>
              <TextField
                type="number"
                fullWidth
                size="small"
                value={formData.claimedAmount}
                onChange={(e) => handleChange("claimedAmount", e.target.value)}
                onBlur={() => handleBlur('claimedAmount')}
                error={touched.claimedAmount && !!fieldErrors.claimedAmount}
                helperText={touched.claimedAmount ? fieldErrors.claimedAmount : ''}
                sx={inputStyle}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment>, inputProps: { min: 0 } }}
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Stack spacing={2}>
            {formData.documents.map((doc, index) => (
              <Paper key={index} sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Typography sx={labelStyle}>Document Name</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={doc.name}
                      onChange={(e) => handleDocumentChange(index, "name", e.target.value)}
                      placeholder="e.g., Discharge Summary"
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Document URL</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={doc.url}
                      onChange={(e) => handleDocumentChange(index, "url", e.target.value)}
                      placeholder="https://example.com/document.pdf"
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 1 }}>
                    <IconButton color="error" onClick={() => removeDocument(index)} sx={{ mt: 1.5 }}>
                      <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={addDocument}
              sx={{ alignSelf: 'flex-start', height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.primary, fontSize: '0.7rem', textTransform: 'none' }}
            >
              Add Document
            </Button>
          </Stack>
        );

      default: return null;
    }
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
            Submit New Claim
          </Typography>
        </DialogTitle>

        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          {renderStepContent()}
          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          justifyContent: 'space-between'
        }}>
          <Button onClick={handleClose} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Cancel</Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Back</Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext} endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Next</Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>{loading ? 'Submitting...' : 'Submit Claim'}</Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Add Enrollment Dialog */}
      <AddEnrollment
        open={addEnrollmentOpen}
        onClose={() => setAddEnrollmentOpen(false)}
        onSuccess={handleEnrollmentAdded}
      />
    </>
  );
};

export default AddClaim;