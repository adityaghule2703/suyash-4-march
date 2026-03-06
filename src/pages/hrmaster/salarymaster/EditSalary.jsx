// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Grid,
//   Alert,
//   MenuItem,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Paper,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Divider,
// } from "@mui/material";
// import { 
//   Save as SaveIcon, 
//   ExpandMore as ExpandMoreIcon 
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const steps = ["Earnings", "Reimbursements", "Deductions", "Payment Info"];

// const EditSalary = ({ open, onClose, salary, onUpdate }) => {
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeStep, setActiveStep] = useState(0);

//   useEffect(() => {
//     if (salary) {
//       setFormData({
//         // Earnings
//         basic: salary.earnings?.basic || "",
//         hra: salary.earnings?.hra || "",
//         conveyance: salary.earnings?.conveyance || "",
//         medical: salary.earnings?.medical || "",
//         special: salary.earnings?.special || "",
//         da: salary.earnings?.da || "",
//         arrears: salary.earnings?.arrears || "",
//         overtime: salary.earnings?.overtime || "",
//         performanceBonus: salary.earnings?.performanceBonus || "",
//         attendanceBonus: salary.earnings?.attendanceBonus || "",
//         shiftAllowance: salary.earnings?.shiftAllowance || "",
//         productionIncentive: salary.earnings?.productionIncentive || "",
//         otherAllowances: salary.earnings?.otherAllowances || "",
        
//         // Reimbursements
//         travel: salary.reimbursements?.travel || "",
//         food: salary.reimbursements?.food || "",
//         telephone: salary.reimbursements?.telephone || "",
//         fuel: salary.reimbursements?.fuel || "",
//         medicalReimbursement: salary.reimbursements?.medicalReimbursement || "",
//         education: salary.reimbursements?.education || "",
//         lta: salary.reimbursements?.lta || "",
//         uniform: salary.reimbursements?.uniform || "",
//         newspaper: salary.reimbursements?.newspaper || "",
//         otherReimbursements: salary.reimbursements?.other || "",
        
//         // Deductions
//         pf: salary.deductions?.pf || "",
//         esi: salary.deductions?.esi || "",
//         professionalTax: salary.deductions?.professionalTax || "",
//         tds: salary.deductions?.tds || "",
//         loanRecovery: salary.deductions?.loanRecovery || "",
//         advanceRecovery: salary.deductions?.advanceRecovery || "",
//         labourWelfare: salary.deductions?.labourWelfare || "",
//         otherDeductions: salary.deductions?.otherDeductions || "",
        
//         // Calculation Rules
//         hraPercentage: salary.calculationRules?.hraPercentage || 50,
//         pfPercentage: salary.calculationRules?.pfPercentage || 12,
//         esiPercentage: salary.calculationRules?.esiPercentage || 0.75,
//         overtimeMultiplier: salary.calculationRules?.overtimeMultiplier || 1.5,
//         bonusPercentage: salary.calculationRules?.bonusPercentage || 10,
//         tdsPercentage: salary.calculationRules?.tdsPercentage || 5,
        
//         // Working Days
//         workingDays: salary.workingDays || 26,
//         paidDays: salary.paidDays || 26,
//         leaveDays: salary.leaveDays || 0,
//         lopDays: salary.lopDays || 0,
        
//         // Overtime & Bonus
//         overtimeHours: salary.overtimeHours || 0,
//         overtimeRate: salary.overtimeRate || 0,
//         incentives: salary.incentives || 0,
//         advanceDeductions: salary.advanceDeductions || 0,
        
//         // Payment
//         paymentMode: salary.paymentMode || "BANK_TRANSFER",
//         paymentStatus: salary.paymentStatus || "PENDING",
//         transactionId: salary.transactionId || "",
//         chequeNumber: salary.chequeNumber || "",
//         remarks: salary.remarks || "",
//       });
//     }
//   }, [salary]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleNumberChange = (e) => {
//     const { name, value } = e.target;
//     // Allow only numbers and decimal points
//     if (value === "" || /^\d*\.?\d*$/.test(value)) {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleNext = () => setActiveStep((prev) => prev + 1);
//   const handleBack = () => setActiveStep((prev) => prev - 1);

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");

//     const payload = {
//       earnings: {
//         basic: Number(formData.basic) || 0,
//         hra: Number(formData.hra) || 0,
//         conveyance: Number(formData.conveyance) || 0,
//         medical: Number(formData.medical) || 0,
//         special: Number(formData.special) || 0,
//         da: Number(formData.da) || 0,
//         arrears: Number(formData.arrears) || 0,
//         overtime: Number(formData.overtime) || 0,
//         performanceBonus: Number(formData.performanceBonus) || 0,
//         attendanceBonus: Number(formData.attendanceBonus) || 0,
//         shiftAllowance: Number(formData.shiftAllowance) || 0,
//         productionIncentive: Number(formData.productionIncentive) || 0,
//         otherAllowances: Number(formData.otherAllowances) || 0,
//       },
//       reimbursements: {
//         travel: Number(formData.travel) || 0,
//         food: Number(formData.food) || 0,
//         telephone: Number(formData.telephone) || 0,
//         fuel: Number(formData.fuel) || 0,
//         medicalReimbursement: Number(formData.medicalReimbursement) || 0,
//         education: Number(formData.education) || 0,
//         lta: Number(formData.lta) || 0,
//         uniform: Number(formData.uniform) || 0,
//         newspaper: Number(formData.newspaper) || 0,
//         other: Number(formData.otherReimbursements) || 0,
//       },
//       deductions: {
//         pf: Number(formData.pf) || 0,
//         esi: Number(formData.esi) || 0,
//         professionalTax: Number(formData.professionalTax) || 0,
//         tds: Number(formData.tds) || 0,
//         loanRecovery: Number(formData.loanRecovery) || 0,
//         advanceRecovery: Number(formData.advanceRecovery) || 0,
//         labourWelfare: Number(formData.labourWelfare) || 0,
//         otherDeductions: Number(formData.otherDeductions) || 0,
//       },
//       calculationRules: {
//         hraPercentage: Number(formData.hraPercentage) || 50,
//         pfPercentage: Number(formData.pfPercentage) || 12,
//         esiPercentage: Number(formData.esiPercentage) || 0.75,
//         overtimeMultiplier: Number(formData.overtimeMultiplier) || 1.5,
//         bonusPercentage: Number(formData.bonusPercentage) || 10,
//         tdsPercentage: Number(formData.tdsPercentage) || 5,
//       },
//       workingDays: Number(formData.workingDays) || 26,
//       paidDays: Number(formData.paidDays) || 26,
//       leaveDays: Number(formData.leaveDays) || 0,
//       lopDays: Number(formData.lopDays) || 0,
//       overtimeHours: Number(formData.overtimeHours) || 0,
//       overtimeRate: Number(formData.overtimeRate) || 0,
//       incentives: Number(formData.incentives) || 0,
//       advanceDeductions: Number(formData.advanceDeductions) || 0,
//       paymentMode: formData.paymentMode,
//       paymentStatus: formData.paymentStatus,
//       transactionId: formData.transactionId,
//       chequeNumber: formData.chequeNumber,
//       remarks: formData.remarks,
//     };

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.put(
//         `${BASE_URL}/api/salaries/${salary._id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         onUpdate(response.data.data);
//         onClose();
//       } else {
//         setError(response.data.message || "Failed to update salary");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!salary) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 3 } }}
//     >
//       {/* Header */}
//       <DialogTitle
//         sx={{
//           background: "linear-gradient(135deg, #164e63, #0ea5e9)",
//           color: "#fff",
//           fontWeight: 600,
//           fontSize: 20,
//         }}
//       >
//         Edit Salary – {salary.periodDisplay} ({salary.employeeName})
//       </DialogTitle>

//       {/* Stepper */}
//       <Box sx={{ px: 4, pt: 3 }}>
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {steps.map((step) => (
//             <Step key={step}>
//               <StepLabel>{step}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       <DialogContent sx={{ px: 4, py: 3 }}>
//         {/* STEP 1 — Earnings */}
//         {activeStep === 0 && (
//           <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#f8fafc" }}>
//             <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
//               Earnings Components
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Basic Salary"
//                   name="basic"
//                   value={formData.basic}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="HRA"
//                   name="hra"
//                   value={formData.hra}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Conveyance"
//                   name="conveyance"
//                   value={formData.conveyance}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Medical Allowance"
//                   name="medical"
//                   value={formData.medical}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Special Allowance"
//                   name="special"
//                   value={formData.special}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Overtime"
//                   name="overtime"
//                   value={formData.overtime}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Performance Bonus"
//                   name="performanceBonus"
//                   value={formData.performanceBonus}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Attendance Bonus"
//                   name="attendanceBonus"
//                   value={formData.attendanceBonus}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Shift Allowance"
//                   name="shiftAllowance"
//                   value={formData.shiftAllowance}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Production Incentive"
//                   name="productionIncentive"
//                   value={formData.productionIncentive}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Other Allowances"
//                   name="otherAllowances"
//                   value={formData.otherAllowances}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//             </Grid>
//           </Paper>
//         )}

//         {/* STEP 2 — Reimbursements */}
//         {activeStep === 1 && (
//           <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#f8fafc" }}>
//             <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
//               Reimbursements
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Travel"
//                   name="travel"
//                   value={formData.travel}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Food"
//                   name="food"
//                   value={formData.food}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Fuel"
//                   name="fuel"
//                   value={formData.fuel}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Other Reimbursements"
//                   name="otherReimbursements"
//                   value={formData.otherReimbursements}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//             </Grid>
//           </Paper>
//         )}

//         {/* STEP 3 — Deductions */}
//         {activeStep === 2 && (
//           <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#f8fafc" }}>
//             <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
//               Deductions
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="PF"
//                   name="pf"
//                   value={formData.pf}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="ESI"
//                   name="esi"
//                   value={formData.esi}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Professional Tax"
//                   name="professionalTax"
//                   value={formData.professionalTax}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="TDS"
//                   name="tds"
//                   value={formData.tds}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Other Deductions"
//                   name="otherDeductions"
//                   value={formData.otherDeductions}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 3 }} />

//             <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
//               Calculation Rules
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="HRA Percentage"
//                   name="hraPercentage"
//                   type="number"
//                   value={formData.hraPercentage}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="PF Percentage"
//                   name="pfPercentage"
//                   type="number"
//                   value={formData.pfPercentage}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="ESI Percentage"
//                   name="esiPercentage"
//                   type="number"
//                   value={formData.esiPercentage}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Overtime Multiplier"
//                   name="overtimeMultiplier"
//                   type="number"
//                   value={formData.overtimeMultiplier}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Bonus Percentage"
//                   name="bonusPercentage"
//                   type="number"
//                   value={formData.bonusPercentage}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="TDS Percentage"
//                   name="tdsPercentage"
//                   type="number"
//                   value={formData.tdsPercentage}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 3 }} />

//             <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
//               Working Days & Overtime
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={3}>
//                 <TextField
//                   fullWidth
//                   label="Working Days"
//                   name="workingDays"
//                   type="number"
//                   value={formData.workingDays}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <TextField
//                   fullWidth
//                   label="Paid Days"
//                   name="paidDays"
//                   type="number"
//                   value={formData.paidDays}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <TextField
//                   fullWidth
//                   label="Leave Days"
//                   name="leaveDays"
//                   type="number"
//                   value={formData.leaveDays}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <TextField
//                   fullWidth
//                   label="LOP Days"
//                   name="lopDays"
//                   type="number"
//                   value={formData.lopDays}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Overtime Hours"
//                   name="overtimeHours"
//                   type="number"
//                   value={formData.overtimeHours}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Overtime Rate"
//                   name="overtimeRate"
//                   type="number"
//                   value={formData.overtimeRate}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Incentives"
//                   name="incentives"
//                   type="number"
//                   value={formData.incentives}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Advance Deductions"
//                   name="advanceDeductions"
//                   type="number"
//                   value={formData.advanceDeductions}
//                   onChange={handleNumberChange}
//                   size="small"
//                 />
//               </Grid>
//             </Grid>
//           </Paper>
//         )}

//         {/* STEP 4 — Payment Info */}
//         {activeStep === 3 && (
//           <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#f8fafc" }}>
//             <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
//               Payment Details
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Payment Mode"
//                   name="paymentMode"
//                   value={formData.paymentMode}
//                   onChange={handleChange}
//                   size="small"
//                 >
//                   <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
//                   <MenuItem value="CASH">Cash</MenuItem>
//                   <MenuItem value="CHEQUE">Cheque</MenuItem>
//                   <MenuItem value="ONLINE">Online</MenuItem>
//                 </TextField>
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Payment Status"
//                   name="paymentStatus"
//                   value={formData.paymentStatus}
//                   onChange={handleChange}
//                   size="small"
//                 >
//                   <MenuItem value="PENDING">Pending</MenuItem>
//                   <MenuItem value="PROCESSED">Processed</MenuItem>
//                   <MenuItem value="APPROVED">Approved</MenuItem>
//                   <MenuItem value="PAID">Paid</MenuItem>
//                   <MenuItem value="CANCELLED">Cancelled</MenuItem>
//                 </TextField>
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Transaction ID"
//                   name="transactionId"
//                   value={formData.transactionId}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Cheque Number"
//                   name="chequeNumber"
//                   value={formData.chequeNumber}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={3}
//                   label="Remarks"
//                   name="remarks"
//                   value={formData.remarks}
//                   onChange={handleChange}
//                   size="small"
//                 />
//               </Grid>
//             </Grid>
//           </Paper>
//         )}

//         {error && (
//           <Box sx={{ mt: 2 }}>
//             <Alert severity="error">{error}</Alert>
//           </Box>
//         )}
//       </DialogContent>

//       {/* Actions */}
//       <DialogActions sx={{ px: 4, pb: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>

//         {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

//         {activeStep < steps.length - 1 ? (
//           <Button variant="contained" onClick={handleNext}>
//             Next
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             startIcon={<SaveIcon />}
//             onClick={handleSubmit}
//             disabled={loading}
//             sx={{
//               background: "linear-gradient(135deg, #164e63, #0ea5e9)",
//               "&:hover": { opacity: 0.9 },
//             }}
//           >
//             {loading ? "Updating..." : "Update Salary"}
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditSalary;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Grid,
  Alert,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  Chip,
  FormHelperText,
  InputAdornment,
  IconButton,
  Tooltip,
  Collapse
} from "@mui/material";
import { 
  Save as SaveIcon, 
  ExpandMore as ExpandMoreIcon,
  Calculate as CalculateIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const steps = ["Earnings", "Reimbursements", "Deductions & Rules", "Payment Info"];

// Helper function to format currency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === "") return "";
  return `₹ ${Number(amount).toLocaleString('en-IN')}`;
};

const EditSalary = ({ open, onClose, salary, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [calculations, setCalculations] = useState({
    totalEarnings: 0,
    totalReimbursements: 0,
    totalDeductions: 0,
    netPay: 0
  });

  useEffect(() => {
    if (salary) {
      setFormData({
        // Earnings
        basic: salary.earnings?.basic || "",
        hra: salary.earnings?.hra || "",
        conveyance: salary.earnings?.conveyance || "",
        medical: salary.earnings?.medical || "",
        special: salary.earnings?.special || "",
        da: salary.earnings?.da || "",
        arrears: salary.earnings?.arrears || "",
        overtime: salary.earnings?.overtime || "",
        performanceBonus: salary.earnings?.performanceBonus || "",
        attendanceBonus: salary.earnings?.attendanceBonus || "",
        shiftAllowance: salary.earnings?.shiftAllowance || "",
        productionIncentive: salary.earnings?.productionIncentive || "",
        otherAllowances: salary.earnings?.otherAllowances || "",
        
        // Reimbursements
        travel: salary.reimbursements?.travel || "",
        food: salary.reimbursements?.food || "",
        telephone: salary.reimbursements?.telephone || "",
        fuel: salary.reimbursements?.fuel || "",
        medicalReimbursement: salary.reimbursements?.medicalReimbursement || "",
        education: salary.reimbursements?.education || "",
        lta: salary.reimbursements?.lta || "",
        uniform: salary.reimbursements?.uniform || "",
        newspaper: salary.reimbursements?.newspaper || "",
        otherReimbursements: salary.reimbursements?.other || "",
        
        // Deductions
        pf: salary.deductions?.pf || "",
        esi: salary.deductions?.esi || "",
        professionalTax: salary.deductions?.professionalTax || "",
        tds: salary.deductions?.tds || "",
        loanRecovery: salary.deductions?.loanRecovery || "",
        advanceRecovery: salary.deductions?.advanceRecovery || "",
        labourWelfare: salary.deductions?.labourWelfare || "",
        otherDeductions: salary.deductions?.otherDeductions || "",
        
        // Calculation Rules
        hraPercentage: salary.calculationRules?.hraPercentage || 50,
        pfPercentage: salary.calculationRules?.pfPercentage || 12,
        esiPercentage: salary.calculationRules?.esiPercentage || 0.75,
        overtimeMultiplier: salary.calculationRules?.overtimeMultiplier || 1.5,
        bonusPercentage: salary.calculationRules?.bonusPercentage || 10,
        tdsPercentage: salary.calculationRules?.tdsPercentage || 5,
        
        // Working Days
        workingDays: salary.workingDays || 26,
        paidDays: salary.paidDays || 26,
        leaveDays: salary.leaveDays || 0,
        lopDays: salary.lopDays || 0,
        
        // Overtime & Bonus
        overtimeHours: salary.overtimeHours || 0,
        overtimeRate: salary.overtimeRate || 0,
        incentives: salary.incentives || 0,
        advanceDeductions: salary.advanceDeductions || 0,
        
        // Payment
        paymentMode: salary.paymentMode || "BANK_TRANSFER",
        paymentStatus: salary.paymentStatus || "PENDING",
        transactionId: salary.transactionId || "",
        chequeNumber: salary.chequeNumber || "",
        paymentDate: salary.paymentDate ? salary.paymentDate.split('T')[0] : "",
        remarks: salary.remarks || "",
      });
    }
  }, [salary]);

  // Calculate totals whenever formData changes
  useEffect(() => {
    const totalEarnings = [
      formData.basic,
      formData.hra,
      formData.conveyance,
      formData.medical,
      formData.special,
      formData.da,
      formData.arrears,
      formData.overtime,
      formData.performanceBonus,
      formData.attendanceBonus,
      formData.shiftAllowance,
      formData.productionIncentive,
      formData.otherAllowances
    ].reduce((sum, val) => sum + (Number(val) || 0), 0);

    const totalReimbursements = [
      formData.travel,
      formData.food,
      formData.telephone,
      formData.fuel,
      formData.medicalReimbursement,
      formData.education,
      formData.lta,
      formData.uniform,
      formData.newspaper,
      formData.otherReimbursements
    ].reduce((sum, val) => sum + (Number(val) || 0), 0);

    const totalDeductions = [
      formData.pf,
      formData.esi,
      formData.professionalTax,
      formData.tds,
      formData.loanRecovery,
      formData.advanceRecovery,
      formData.labourWelfare,
      formData.otherDeductions
    ].reduce((sum, val) => sum + (Number(val) || 0), 0);

    setCalculations({
      totalEarnings,
      totalReimbursements,
      totalDeductions,
      netPay: totalEarnings + totalReimbursements - totalDeductions
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const calculateFromRules = () => {
    const basic = Number(formData.basic) || 0;
    
    // Calculate HRA if not set
    if (!formData.hra && formData.hraPercentage) {
      const hraAmount = (basic * Number(formData.hraPercentage)) / 100;
      setFormData(prev => ({ ...prev, hra: hraAmount.toFixed(2) }));
    }
    
    // Calculate PF if not set
    if (!formData.pf && formData.pfPercentage) {
      const pfAmount = (basic * Number(formData.pfPercentage)) / 100;
      setFormData(prev => ({ ...prev, pf: pfAmount.toFixed(2) }));
    }
    
    // Calculate ESI if not set
    if (!formData.esi && formData.esiPercentage) {
      const esiAmount = (basic * Number(formData.esiPercentage)) / 100;
      setFormData(prev => ({ ...prev, esi: esiAmount.toFixed(2) }));
    }
  };

  const validateStep = () => {
    switch(activeStep) {
      case 0:
        if (!formData.basic) {
          setError("Basic salary is required");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setError("");
      handleNext();
    }
  };

  const handleSubmit = async () => {
    if (!formData.basic) {
      setError("Basic salary is required");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      earnings: {
        basic: Number(formData.basic) || 0,
        hra: Number(formData.hra) || 0,
        conveyance: Number(formData.conveyance) || 0,
        medical: Number(formData.medical) || 0,
        special: Number(formData.special) || 0,
        da: Number(formData.da) || 0,
        arrears: Number(formData.arrears) || 0,
        overtime: Number(formData.overtime) || 0,
        performanceBonus: Number(formData.performanceBonus) || 0,
        attendanceBonus: Number(formData.attendanceBonus) || 0,
        shiftAllowance: Number(formData.shiftAllowance) || 0,
        productionIncentive: Number(formData.productionIncentive) || 0,
        otherAllowances: Number(formData.otherAllowances) || 0,
      },
      reimbursements: {
        travel: Number(formData.travel) || 0,
        food: Number(formData.food) || 0,
        telephone: Number(formData.telephone) || 0,
        fuel: Number(formData.fuel) || 0,
        medicalReimbursement: Number(formData.medicalReimbursement) || 0,
        education: Number(formData.education) || 0,
        lta: Number(formData.lta) || 0,
        uniform: Number(formData.uniform) || 0,
        newspaper: Number(formData.newspaper) || 0,
        other: Number(formData.otherReimbursements) || 0,
      },
      deductions: {
        pf: Number(formData.pf) || 0,
        esi: Number(formData.esi) || 0,
        professionalTax: Number(formData.professionalTax) || 0,
        tds: Number(formData.tds) || 0,
        loanRecovery: Number(formData.loanRecovery) || 0,
        advanceRecovery: Number(formData.advanceRecovery) || 0,
        labourWelfare: Number(formData.labourWelfare) || 0,
        otherDeductions: Number(formData.otherDeductions) || 0,
      },
      calculationRules: {
        hraPercentage: Number(formData.hraPercentage) || 50,
        pfPercentage: Number(formData.pfPercentage) || 12,
        esiPercentage: Number(formData.esiPercentage) || 0.75,
        overtimeMultiplier: Number(formData.overtimeMultiplier) || 1.5,
        bonusPercentage: Number(formData.bonusPercentage) || 10,
        tdsPercentage: Number(formData.tdsPercentage) || 5,
      },
      workingDays: Number(formData.workingDays) || 26,
      paidDays: Number(formData.paidDays) || 26,
      leaveDays: Number(formData.leaveDays) || 0,
      lopDays: Number(formData.lopDays) || 0,
      overtimeHours: Number(formData.overtimeHours) || 0,
      overtimeRate: Number(formData.overtimeRate) || 0,
      incentives: Number(formData.incentives) || 0,
      advanceDeductions: Number(formData.advanceDeductions) || 0,
      paymentMode: formData.paymentMode,
      paymentStatus: formData.paymentStatus,
      transactionId: formData.transactionId,
      chequeNumber: formData.chequeNumber,
      paymentDate: formData.paymentDate || undefined,
      remarks: formData.remarks,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/salaries/${salary._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || "Failed to update salary");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!salary) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 3,
          overflow: 'hidden'
        } 
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #164e63, #00B4D8)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 20,
          py: 2.5,
          px: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>Edit Salary – {salary.periodDisplay || 'N/A'}</span>
        <Chip 
          label={salary.employeeName || 'N/A'} 
          size="small"
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            fontWeight: 500
          }}
        />
      </DialogTitle>

      {/* Summary Card */}
      <Box sx={{ px: 4, pt: 2 }}>
        <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="textSecondary">Total Earnings</Typography>
              <Typography variant="h6" color="#164e63" fontWeight={600}>
                {formatCurrency(calculations.totalEarnings)}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="textSecondary">Reimbursements</Typography>
              <Typography variant="h6" color="#164e63" fontWeight={600}>
                {formatCurrency(calculations.totalReimbursements)}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="textSecondary">Deductions</Typography>
              <Typography variant="h6" color="#d32f2f" fontWeight={600}>
                {formatCurrency(calculations.totalDeductions)}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="textSecondary">Net Pay</Typography>
              <Typography variant="h5" color="#2e7d32" fontWeight={700}>
                {formatCurrency(calculations.netPay)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Stepper */}
      <Box sx={{ px: 4, pt: 3, pb: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ px: 4, py: 2, bgcolor: '#f8fafc' }}>
        {/* STEP 1 — Earnings */}
        {activeStep === 0 && (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: "#164e63" }}>
                Earnings Components
              </Typography>
              <Tooltip title="Calculate from rules">
                <IconButton onClick={calculateFromRules} size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Basic Salary *"
                  name="basic"
                  value={formData.basic}
                  onChange={handleNumberChange}
                  size="small"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="HRA"
                  name="hra"
                  value={formData.hra}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Conveyance"
                  name="conveyance"
                  value={formData.conveyance}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Medical Allowance"
                  name="medical"
                  value={formData.medical}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Special Allowance"
                  name="special"
                  value={formData.special}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Dearness Allowance"
                  name="da"
                  value={formData.da}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Arrears"
                  name="arrears"
                  value={formData.arrears}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Overtime"
                  name="overtime"
                  value={formData.overtime}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Performance Bonus"
                  name="performanceBonus"
                  value={formData.performanceBonus}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Attendance Bonus"
                  name="attendanceBonus"
                  value={formData.attendanceBonus}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Shift Allowance"
                  name="shiftAllowance"
                  value={formData.shiftAllowance}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Production Incentive"
                  name="productionIncentive"
                  value={formData.productionIncentive}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid> */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Other Allowances"
                  name="otherAllowances"
                  value={formData.otherAllowances}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="#2e7d32">
                Total Earnings: {formatCurrency(calculations.totalEarnings)}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* STEP 2 — Reimbursements */}
        {activeStep === 1 && (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
              Reimbursements
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Travel"
                  name="travel"
                  value={formData.travel}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Food"
                  name="food"
                  value={formData.food}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid> */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Fuel"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Medical"
                  name="medicalReimbursement"
                  value={formData.medicalReimbursement}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid> */}
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Education"
                  name="education"
                  value={formData.education}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid> */}
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="LTA"
                  name="lta"
                  value={formData.lta}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid> */}
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Uniform"
                  name="uniform"
                  value={formData.uniform}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid> */}
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Newspaper"
                  name="newspaper"
                  value={formData.newspaper}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid> */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Other Reimbursements"
                  name="otherReimbursements"
                  value={formData.otherReimbursements}
                  onChange={handleNumberChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="#2e7d32">
                Total Reimbursements: {formatCurrency(calculations.totalReimbursements)}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* STEP 3 — Deductions & Rules */}
        {activeStep === 2 && (
          <Stack spacing={3}>
            {/* Deductions */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
                Deductions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="PF"
                    name="pf"
                    value={formData.pf}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="ESI"
                    name="esi"
                    value={formData.esi}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Professional Tax"
                    name="professionalTax"
                    value={formData.professionalTax}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="TDS"
                    name="tds"
                    value={formData.tds}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Loan Recovery"
                    name="loanRecovery"
                    value={formData.loanRecovery}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Advance Recovery"
                    name="advanceRecovery"
                    value={formData.advanceRecovery}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Labour Welfare"
                    name="labourWelfare"
                    value={formData.labourWelfare}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Other Deductions"
                    name="otherDeductions"
                    value={formData.otherDeductions}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="#d32f2f">
                  Total Deductions: {formatCurrency(calculations.totalDeductions)}
                </Typography>
              </Box>
            </Paper>

            {/* Calculation Rules */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
                Calculation Rules
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="HRA Percentage"
                    name="hraPercentage"
                    type="number"
                    value={formData.hraPercentage}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="PF Percentage"
                    name="pfPercentage"
                    type="number"
                    value={formData.pfPercentage}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="ESI Percentage"
                    name="esiPercentage"
                    type="number"
                    value={formData.esiPercentage}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Overtime Multiplier"
                    name="overtimeMultiplier"
                    type="number"
                    value={formData.overtimeMultiplier}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">x</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Bonus Percentage"
                    name="bonusPercentage"
                    type="number"
                    value={formData.bonusPercentage}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="TDS Percentage"
                    name="tdsPercentage"
                    type="number"
                    value={formData.tdsPercentage}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Working Days & Overtime */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
                Working Days & Overtime
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Working Days"
                    name="workingDays"
                    type="number"
                    value={formData.workingDays}
                    onChange={handleNumberChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Paid Days"
                    name="paidDays"
                    type="number"
                    value={formData.paidDays}
                    onChange={handleNumberChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Leave Days"
                    name="leaveDays"
                    type="number"
                    value={formData.leaveDays}
                    onChange={handleNumberChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="LOP Days"
                    name="lopDays"
                    type="number"
                    value={formData.lopDays}
                    onChange={handleNumberChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Overtime Hours"
                    name="overtimeHours"
                    type="number"
                    value={formData.overtimeHours}
                    onChange={handleNumberChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Overtime Rate"
                    name="overtimeRate"
                    type="number"
                    value={formData.overtimeRate}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Incentives"
                    name="incentives"
                    type="number"
                    value={formData.incentives}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Advance Deductions"
                    name="advanceDeductions"
                    type="number"
                    value={formData.advanceDeductions}
                    onChange={handleNumberChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        )}

        {/* STEP 4 — Payment Info */}
        {activeStep === 3 && (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#164e63", mb: 2 }}>
              Payment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Payment Mode"
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CHEQUE">Cheque</MenuItem>
                  <MenuItem value="ONLINE">Online</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Payment Status"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PROCESSED">Processed</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Transaction ID"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Cheque Number"
                  name="chequeNumber"
                  value={formData.chequeNumber}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Payment Date"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Net Pay Summary */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#e0f2fe', borderRadius: 2, border: '1px solid #bae6fd' }}>
              <Typography variant="subtitle1" fontWeight={600} color="#164e63" gutterBottom>
                Net Pay Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="#64748B">Earnings</Typography>
                  <Typography variant="h6" fontWeight={600}>{formatCurrency(calculations.totalEarnings)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="#64748B">+ Reimbursements</Typography>
                  <Typography variant="h6" fontWeight={600}>{formatCurrency(calculations.totalReimbursements)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="#64748B">- Deductions</Typography>
                  <Typography variant="h6" fontWeight={600} color="#d32f2f">{formatCurrency(calculations.totalDeductions)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight={600}>Net Pay</Typography>
                    <Typography variant="h4" fontWeight={700} color="#2e7d32">
                      {formatCurrency(calculations.netPay)}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}

        <Collapse in={!!error}>
          <Box sx={{ mt: 2 }}>
            <Alert 
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: 2 }}
            >
              {error}
            </Alert>
          </Box>
        </Collapse>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 4, pb: 3, pt: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              borderColor: '#cbd5e1',
              color: '#475569'
            }}
          >
            Cancel
          </Button>

          <Stack direction="row" spacing={2}>
            {activeStep > 0 && (
              <Button 
                onClick={handleBack}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Back
              </Button>
            )}

            {activeStep < steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleNextStep}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  background: "linear-gradient(135deg, #164e63, #00B4D8)",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  background: "linear-gradient(135deg, #164e63, #00B4D8)",
                  "&:hover": { opacity: 0.9 },
                  minWidth: 150
                }}
              >
                {loading ? "Updating..." : "Update Salary"}
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default EditSalary;