// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   MenuItem,
//   Grid,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Typography,
//   styled,
//   StepConnector,
//   Divider,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import { Add as AddIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// /* ------------------- Custom Stepper Styling ------------------- */

// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   "& .MuiStepConnector-line": {
//     height: 4,
//     border: 0,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 10,
//   },
//   "&.Mui-active .MuiStepConnector-line": {
//     background: "linear-gradient(90deg, #164e63, #00B4D8)",
//   },
//   "&.Mui-completed .MuiStepConnector-line": {
//     background: "linear-gradient(90deg, #164e63, #00B4D8)",
//   },
// }));

// const steps = ["Employee & Period", "Earnings & Reimbursements", "Deductions & Payment"];

// const AddSalary = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [employees, setEmployees] = useState([]);
//   const [employeeLoading, setEmployeeLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     // Employee & Period
//     employee: "",
//     month: "",
//     year: "",
//     date: null,
//     employmentType: "Monthly",
    
//     // Earnings
//     basic: "",
//     hra: "",
//     conveyance: "",
//     medical: "",
//     special: "",
//     da: "",
//     arrears: "",
//     overtime: "",
//     performanceBonus: "",
//     attendanceBonus: "",
//     shiftAllowance: "",
//     productionIncentive: "",
//     otherAllowances: "",
    
//     // Reimbursements
//     travel: "",
//     food: "",
//     telephone: "",
//     fuel: "",
//     medicalReimbursement: "",
//     education: "",
//     lta: "",
//     uniform: "",
//     newspaper: "",
//     other: "",
    
//     // Deductions
//     pf: "",
//     esi: "",
//     professionalTax: "",
//     tds: "",
//     loanRecovery: "",
//     advanceRecovery: "",
//     labourWelfare: "",
//     otherDeductions: "",
    
//     // Calculation Rules
//     hraPercentage: 50,
//     pfPercentage: 12,
//     esiPercentage: 0.75,
//     overtimeMultiplier: 1.5,
    
//     // Working Days
//     workingDays: 26,
//     paidDays: 26,
//     leaveDays: 0,
//     lopDays: 0,
    
//     // Overtime & Bonus
//     overtimeHours: "",
//     overtimeRate: "",
//     incentives: "",
//     advanceDeductions: "",
    
//     // Payment
//     paymentMode: "BANK_TRANSFER",
//     remarks: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [expandedSections, setExpandedSections] = useState({
//     earnings: true,
//     reimbursements: false,
//     deductions: false,
//   });

//   useEffect(() => {
//     if (open) fetchEmployees();
//   }, [open]);

//   const fetchEmployees = async () => {
//     try {
//       setEmployeeLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.data.success) {
//         setEmployees(response.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     } finally {
//       setEmployeeLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNumberChange = (e) => {
//     const { name, value } = e.target;
//     // Allow only numbers and decimal points
//     if (value === "" || /^\d*\.?\d*$/.test(value)) {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleEmployeeChange = async (e) => {
//     const employeeId = e.target.value;
//     setFormData((prev) => ({ ...prev, employee: employeeId }));

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${BASE_URL}/api/employees/${employeeId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.data.success) {
//         const emp = response.data.data;
//         setFormData((prev) => ({
//           ...prev,
//           basic: emp.TotalFixedSalary || "",
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching employee details:", error);
//     }
//   };

//   const handleNext = () => setActiveStep((prev) => prev + 1);
//   const handleBack = () => setActiveStep((prev) => prev - 1);

//   const handleSectionToggle = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.employee) return setError("Employee is required");
//     if (!formData.month || !formData.year)
//       return setError("Month and Year are required");
//     if (!formData.basic) return setError("Basic salary is required");

//     setLoading(true);
//     setError("");

//     const payload = {
//       employee: formData.employee,
//       payrollPeriod: {
//         month: Number(formData.month),
//         year: Number(formData.year),
//       },
//       employmentType: formData.employmentType,
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
//         other: Number(formData.other) || 0,
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
//       remarks: formData.remarks,
//     };

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(`${BASE_URL}/api/salaries`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data.success) {
//         onAdd(response.data.data);
//         onClose();
//         setActiveStep(0);
//         // Reset form
//         setFormData({
//           employee: "",
//           month: "",
//           year: "",
//           date: null,
//           employmentType: "Monthly",
//           basic: "",
//           hra: "",
//           conveyance: "",
//           medical: "",
//           special: "",
//           da: "",
//           arrears: "",
//           overtime: "",
//           performanceBonus: "",
//           attendanceBonus: "",
//           shiftAllowance: "",
//           productionIncentive: "",
//           otherAllowances: "",
//           travel: "",
//           food: "",
//           telephone: "",
//           fuel: "",
//           medicalReimbursement: "",
//           education: "",
//           lta: "",
//           uniform: "",
//           newspaper: "",
//           other: "",
//           pf: "",
//           esi: "",
//           professionalTax: "",
//           tds: "",
//           loanRecovery: "",
//           advanceRecovery: "",
//           labourWelfare: "",
//           otherDeductions: "",
//           hraPercentage: 50,
//           pfPercentage: 12,
//           esiPercentage: 0.75,
//           overtimeMultiplier: 1.5,
//           workingDays: 26,
//           paidDays: 26,
//           leaveDays: 0,
//           lopDays: 0,
//           overtimeHours: "",
//           overtimeRate: "",
//           incentives: "",
//           advanceDeductions: "",
//           paymentMode: "BANK_TRANSFER",
//           remarks: "",
//         });
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to create salary.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       {/* Attractive Header */}
//       <DialogTitle
//         sx={{
//           background: "linear-gradient(135deg, #164e63, #00B4D8)",
//           color: "#fff",
//           fontWeight: 600,
//           fontSize: "20px",
//         }}
//       >
//         Add Salary
//       </DialogTitle>

//       <DialogContent sx={{ pt: 4, px: 3 }}>
//         {/* Stepper */}
//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//           sx={{ mb: 4, mt: 2 }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography fontWeight={500} fontSize="0.9rem">
//                   {label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         <Box sx={{ mt: 2 }}>
//           <Stack spacing={3}>
//             {/* STEP 1 - Employee & Period */}
//             {activeStep === 0 && (
//               <>
//                 <TextField
//                   select
//                   label="Employee *"
//                   value={formData.employee}
//                   onChange={handleEmployeeChange}
//                   fullWidth
//                   required
//                 >
//                   {employeeLoading ? (
//                     <MenuItem disabled>
//                       <CircularProgress size={18} sx={{ mr: 1 }} />
//                       Loading...
//                     </MenuItem>
//                   ) : (
//                     employees.map((emp) => (
//                       <MenuItem key={emp._id} value={emp._id}>
//                         {emp.FirstName} {emp.LastName} - {emp.EmployeeID}
//                       </MenuItem>
//                     ))
//                   )}
//                 </TextField>

//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label="Select Month & Year *"
//                     views={["month", "year"]}
//                     value={formData.date}
//                     onChange={(newValue) => {
//                       if (newValue) {
//                         setFormData((prev) => ({
//                           ...prev,
//                           date: newValue,
//                           month: (newValue.getMonth() + 1).toString(),
//                           year: newValue.getFullYear().toString(),
//                         }));
//                       } else {
//                         setFormData((prev) => ({
//                           ...prev,
//                           date: null,
//                           month: "",
//                           year: "",
//                         }));
//                       }
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         fullWidth
//                         helperText="Select month and year for salary"
//                         required
//                       />
//                     )}
//                   />
//                 </LocalizationProvider>

//                 <TextField
//                   select
//                   label="Employment Type"
//                   name="employmentType"
//                   value={formData.employmentType}
//                   onChange={handleChange}
//                   fullWidth
//                 >
//                   <MenuItem value="Monthly">Monthly</MenuItem>
//                   <MenuItem value="PieceRate">Piece Rate</MenuItem>
//                   <MenuItem value="Hourly">Hourly</MenuItem>
//                   <MenuItem value="Contract">Contract</MenuItem>
//                 </TextField>

//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Working Days"
//                       name="workingDays"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.workingDays}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Paid Days"
//                       name="paidDays"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.paidDays}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Leave Days"
//                       name="leaveDays"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.leaveDays}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="LOP Days"
//                       name="lopDays"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.lopDays}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                 </Grid>
//               </>
//             )}

//             {/* STEP 2 - Earnings & Reimbursements */}
//             {activeStep === 1 && (
//               <Box>
//                 {/* Earnings Section */}
//                 <Accordion 
//                   expanded={expandedSections.earnings}
//                   onChange={() => handleSectionToggle('earnings')}
//                   sx={{ mb: 2 }}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography fontWeight={600} color="#164e63">
//                       Earnings Components
//                     </Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Basic Salary *"
//                           name="basic"
//                           fullWidth
//                           size="small"
//                           value={formData.basic}
//                           onChange={handleNumberChange}
//                           required
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="HRA"
//                           name="hra"
//                           fullWidth
//                           size="small"
//                           value={formData.hra}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Conveyance"
//                           name="conveyance"
//                           fullWidth
//                           size="small"
//                           value={formData.conveyance}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Medical Allowance"
//                           name="medical"
//                           fullWidth
//                           size="small"
//                           value={formData.medical}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Special Allowance"
//                           name="special"
//                           fullWidth
//                           size="small"
//                           value={formData.special}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Overtime"
//                           name="overtime"
//                           fullWidth
//                           size="small"
//                           value={formData.overtime}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Performance Bonus"
//                           name="performanceBonus"
//                           fullWidth
//                           size="small"
//                           value={formData.performanceBonus}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Attendance Bonus"
//                           name="attendanceBonus"
//                           fullWidth
//                           size="small"
//                           value={formData.attendanceBonus}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Shift Allowance"
//                           name="shiftAllowance"
//                           fullWidth
//                           size="small"
//                           value={formData.shiftAllowance}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Production Incentive"
//                           name="productionIncentive"
//                           fullWidth
//                           size="small"
//                           value={formData.productionIncentive}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Other Allowances"
//                           name="otherAllowances"
//                           fullWidth
//                           size="small"
//                           value={formData.otherAllowances}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                     </Grid>
//                   </AccordionDetails>
//                 </Accordion>

//                 {/* Reimbursements Section */}
//                 <Accordion 
//                   expanded={expandedSections.reimbursements}
//                   onChange={() => handleSectionToggle('reimbursements')}
//                   sx={{ mb: 2 }}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography fontWeight={600} color="#164e63">
//                       Reimbursements
//                     </Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Travel"
//                           name="travel"
//                           fullWidth
//                           size="small"
//                           value={formData.travel}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Food"
//                           name="food"
//                           fullWidth
//                           size="small"
//                           value={formData.food}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Fuel"
//                           name="fuel"
//                           fullWidth
//                           size="small"
//                           value={formData.fuel}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Other Reimbursements"
//                           name="other"
//                           fullWidth
//                           size="small"
//                           value={formData.other}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                     </Grid>
//                   </AccordionDetails>
//                 </Accordion>
//               </Box>
//             )}

//             {/* STEP 3 - Deductions & Payment */}
//             {activeStep === 2 && (
//               <Box>
//                 {/* Deductions Section */}
//                 <Accordion 
//                   expanded={expandedSections.deductions}
//                   onChange={() => handleSectionToggle('deductions')}
//                   sx={{ mb: 2 }}
//                 >
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography fontWeight={600} color="#164e63">
//                       Deductions
//                     </Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="PF"
//                           name="pf"
//                           fullWidth
//                           size="small"
//                           value={formData.pf}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="ESI"
//                           name="esi"
//                           fullWidth
//                           size="small"
//                           value={formData.esi}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Professional Tax"
//                           name="professionalTax"
//                           fullWidth
//                           size="small"
//                           value={formData.professionalTax}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="TDS"
//                           name="tds"
//                           fullWidth
//                           size="small"
//                           value={formData.tds}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={4}>
//                         <TextField
//                           label="Other Deductions"
//                           name="otherDeductions"
//                           fullWidth
//                           size="small"
//                           value={formData.otherDeductions}
//                           onChange={handleNumberChange}
//                           InputProps={{ sx: { borderRadius: 1.5 } }}
//                         />
//                       </Grid>
//                     </Grid>
//                   </AccordionDetails>
//                 </Accordion>

//                 {/* Calculation Rules */}
//                 <Typography variant="subtitle2" color="#164e63" sx={{ mt: 2, mb: 1 }}>
//                   Calculation Rules
//                 </Typography>
//                 <Grid container spacing={2} sx={{ mb: 2 }}>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="HRA Percentage"
//                       name="hraPercentage"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.hraPercentage}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="PF Percentage"
//                       name="pfPercentage"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.pfPercentage}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="ESI Percentage"
//                       name="esiPercentage"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.esiPercentage}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       label="Overtime Multiplier"
//                       name="overtimeMultiplier"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.overtimeMultiplier}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                 </Grid>

//                 {/* Overtime Details */}
//                 <Typography variant="subtitle2" color="#164e63" sx={{ mt: 1, mb: 1 }}>
//                   Overtime & Additional Details
//                 </Typography>
//                 <Grid container spacing={2} sx={{ mb: 2 }}>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextField
//                       label="Overtime Hours"
//                       name="overtimeHours"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.overtimeHours}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextField
//                       label="Overtime Rate"
//                       name="overtimeRate"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.overtimeRate}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextField
//                       label="Incentives"
//                       name="incentives"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.incentives}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextField
//                       label="Advance Deductions"
//                       name="advanceDeductions"
//                       type="number"
//                       fullWidth
//                       size="small"
//                       value={formData.advanceDeductions}
//                       onChange={handleNumberChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                 </Grid>

//                 {/* Payment Details */}
//                 <Typography variant="subtitle2" color="#164e63" sx={{ mt: 1, mb: 1 }}>
//                   Payment Details
//                 </Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <TextField
//                       select
//                       label="Payment Mode"
//                       name="paymentMode"
//                       fullWidth
//                       size="small"
//                       value={formData.paymentMode}
//                       onChange={handleChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     >
//                       <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
//                       <MenuItem value="CASH">Cash</MenuItem>
//                       <MenuItem value="CHEQUE">Cheque</MenuItem>
//                       <MenuItem value="ONLINE">Online</MenuItem>
//                     </TextField>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       label="Remarks (Optional)"
//                       name="remarks"
//                       fullWidth
//                       size="small"
//                       multiline
//                       rows={2}
//                       value={formData.remarks}
//                       onChange={handleChange}
//                       InputProps={{ sx: { borderRadius: 1.5 } }}
//                     />
//                   </Grid>
//                 </Grid>
//               </Box>
//             )}

//             {error && <Alert severity="error">{error}</Alert>}
//           </Stack>
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>
//         {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

//         {activeStep < steps.length - 1 ? (
//           <Button
//             variant="contained"
//             onClick={handleNext}
//             sx={{
//               background: "linear-gradient(135deg, #164e63, #00B4D8)",
//               "&:hover": { opacity: 0.9 },
//             }}
//           >
//             Next
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//             startIcon={!loading && <AddIcon />}
//             sx={{
//               background: "linear-gradient(135deg, #164e63, #00B4D8)",
//               "&:hover": { opacity: 0.9 },
//             }}
//           >
//             {loading ? <CircularProgress size={24} /> : "Add Salary"}
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddSalary;
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  MenuItem,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  styled,
  StepConnector,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormHelperText
} from "@mui/material";
import { Add as AddIcon, ExpandMore as ExpandMoreIcon, Info as InfoIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import BASE_URL from "../../../config/Config";

/* ------------------- Custom Stepper Styling ------------------- */

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    height: 4,
    border: 0,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  "&.Mui-active .MuiStepConnector-line": {
    background: "linear-gradient(90deg, #164e63, #00B4D8)",
  },
  "&.Mui-completed .MuiStepConnector-line": {
    background: "linear-gradient(90deg, #164e63, #00B4D8)",
  },
}));

const steps = ["Employee & Period", "Earnings & Reimbursements", "Deductions & Payment"];

const AddSalary = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);

  const [formData, setFormData] = useState({
    // Employee & Period
    employee: "",
    month: "",
    year: "",
    date: null,
    employmentType: "Monthly",
    
    // Earnings
    basic: "",
    hra: "",
    conveyance: "",
    medical: "",
    special: "",
    da: "",
    arrears: "",
    overtime: "",
    performanceBonus: "",
    attendanceBonus: "",
    shiftAllowance: "",
    productionIncentive: "",
    otherAllowances: "",
    
    // Reimbursements
    travel: "",
    food: "",
    telephone: "",
    fuel: "",
    medicalReimbursement: "",
    education: "",
    lta: "",
    uniform: "",
    newspaper: "",
    other: "",
    
    // Deductions
    pf: "",
    esi: "",
    professionalTax: "",
    tds: "",
    loanRecovery: "",
    advanceRecovery: "",
    labourWelfare: "",
    otherDeductions: "",
    
    // Calculation Rules
    hraPercentage: 50,
    pfPercentage: 12,
    esiPercentage: 0.75,
    overtimeMultiplier: 1.5,
    
    // Working Days
    workingDays: 26,
    paidDays: 26,
    leaveDays: 0,
    lopDays: 0,
    
    // Overtime & Bonus
    overtimeHours: "",
    overtimeRate: "",
    incentives: "",
    advanceDeductions: "",
    
    // Payment
    paymentMode: "BANK_TRANSFER",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    earnings: true,
    reimbursements: false,
    deductions: false,
  });

  useEffect(() => {
    if (open) {
      fetchEmployees();
      resetForm();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setEmployeeLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employee: "",
      month: "",
      year: "",
      date: null,
      employmentType: "Monthly",
      basic: "",
      hra: "",
      conveyance: "",
      medical: "",
      special: "",
      da: "",
      arrears: "",
      overtime: "",
      performanceBonus: "",
      attendanceBonus: "",
      shiftAllowance: "",
      productionIncentive: "",
      otherAllowances: "",
      travel: "",
      food: "",
      telephone: "",
      fuel: "",
      medicalReimbursement: "",
      education: "",
      lta: "",
      uniform: "",
      newspaper: "",
      other: "",
      pf: "",
      esi: "",
      professionalTax: "",
      tds: "",
      loanRecovery: "",
      advanceRecovery: "",
      labourWelfare: "",
      otherDeductions: "",
      hraPercentage: 50,
      pfPercentage: 12,
      esiPercentage: 0.75,
      overtimeMultiplier: 1.5,
      workingDays: 26,
      paidDays: 26,
      leaveDays: 0,
      lopDays: 0,
      overtimeHours: "",
      overtimeRate: "",
      incentives: "",
      advanceDeductions: "",
      paymentMode: "BANK_TRANSFER",
      remarks: "",
    });
    setSelectedEmployeeDetails(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEmployeeChange = async (e) => {
    const employeeId = e.target.value;
    setFormData((prev) => ({ ...prev, employee: employeeId }));

    if (!employeeId) return;

    try {
      setEmployeeLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/employees/${employeeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        const emp = response.data.data;
        setSelectedEmployeeDetails(emp);
        
        // Auto-fill fields based on employee data
        const autoFillData = {
          // Basic Salary - from employee's BasicSalary
          basic: emp.BasicSalary || "",
          
          // Employment Type
          employmentType: emp.EmploymentType || "Monthly",
          
          // HRA - could be from employee's HRA field if exists
          hra: emp.HRA || "",
          
          // Conveyance - from employee's ConveyanceAllowance if exists
          conveyance: emp.ConveyanceAllowance || "",
          
          // Medical - from employee's MedicalAllowance if exists
          medical: emp.MedicalAllowance || "",
          
          // Special - from employee's SpecialAllowance if exists
          special: emp.SpecialAllowance || "",
          
          // PF Number related - could be used for deductions calculation
          pf: emp.PFNumber ? "Auto-calculated based on salary" : "",
          
          // ESI Number related
          esi: emp.ESINumber ? "Auto-calculated based on salary" : "",
          
          // Overtime multiplier from employee
          overtimeMultiplier: emp.OvertimeRateMultiplier || 1.5,
          
          // Working days based on employment type
          workingDays: emp.EmploymentType === "Monthly" ? 26 : 
                       emp.EmploymentType === "Hourly" ? 30 : 26,
          
          paidDays: emp.EmploymentType === "Monthly" ? 26 : 
                    emp.EmploymentType === "Hourly" ? 30 : 26,
        };

        setFormData((prev) => ({
          ...prev,
          ...autoFillData
        }));

        // Show success message
        setError("");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setError("Failed to fetch employee details");
    } finally {
      setEmployeeLoading(false);
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateTotalEarnings = () => {
    const earnings = [
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
    ];
    return earnings.reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const calculateTotalDeductions = () => {
    const deductions = [
      formData.pf,
      formData.esi,
      formData.professionalTax,
      formData.tds,
      formData.loanRecovery,
      formData.advanceRecovery,
      formData.labourWelfare,
      formData.otherDeductions
    ];
    return deductions.reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const calculateNetPay = () => {
    return calculateTotalEarnings() - calculateTotalDeductions();
  };

  const validateStep = () => {
    switch(activeStep) {
      case 0:
        if (!formData.employee) {
          setError("Please select an employee");
          return false;
        }
        if (!formData.month || !formData.year) {
          setError("Please select month and year");
          return false;
        }
        if (!formData.basic) {
          setError("Basic salary is required");
          return false;
        }
        return true;
      
      case 1:
        // Optional validation for step 1
        return true;
      
      case 2:
        // Optional validation for step 2
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
    if (!formData.employee) return setError("Employee is required");
    if (!formData.month || !formData.year)
      return setError("Month and Year are required");
    if (!formData.basic) return setError("Basic salary is required");

    setLoading(true);
    setError("");

    const payload = {
      employee: formData.employee,
      payrollPeriod: {
        month: Number(formData.month),
        year: Number(formData.year),
      },
      employmentType: formData.employmentType,
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
        other: Number(formData.other) || 0,
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
      remarks: formData.remarks,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/api/salaries`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        onAdd(response.data.data);
        onClose();
        resetForm();
        setActiveStep(0);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create salary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Attractive Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #164e63, #00B4D8)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>Add Salary</span>
        {selectedEmployeeDetails && (
          <Chip
            label={`${selectedEmployeeDetails.FirstName} ${selectedEmployeeDetails.LastName}`}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 500,
              "& .MuiChip-label": { px: 2 }
            }}
          />
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 4, px: 3 }}>
        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 4, mt: 2 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography fontWeight={500} fontSize="0.9rem">
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Summary Bar - Shows when employee is selected */}
        {selectedEmployeeDetails && activeStep > 0 && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="#64748B">
                Employee Summary
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {selectedEmployeeDetails.FirstName} {selectedEmployeeDetails.LastName} - {selectedEmployeeDetails.EmployeeID}
              </Typography>
              <Typography variant="caption" color="#64748B">
                {selectedEmployeeDetails.DepartmentID?.DepartmentName} - {selectedEmployeeDetails.DesignationID?.DesignationName}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle2" color="#64748B">
                Net Pay (Estimated)
              </Typography>
              <Typography variant="h6" color="#164e63" fontWeight={600}>
                ₹{calculateNetPay().toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            {/* STEP 1 - Employee & Period */}
            {activeStep === 0 && (
              <>
                <TextField
                  select
                  label="Employee *"
                  value={formData.employee}
                  onChange={handleEmployeeChange}
                  fullWidth
                  required
                  helperText="Select employee to auto-fill salary details"
                >
                  {employeeLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={18} sx={{ mr: 1 }} />
                      Loading...
                    </MenuItem>
                  ) : (
                    employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {emp.FirstName} {emp.LastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {emp.EmployeeID} - {emp.DepartmentID?.DepartmentName}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </TextField>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Month & Year *"
                    views={["month", "year"]}
                    value={formData.date}
                    onChange={(newValue) => {
                      if (newValue) {
                        setFormData((prev) => ({
                          ...prev,
                          date: newValue,
                          month: (newValue.getMonth() + 1).toString(),
                          year: newValue.getFullYear().toString(),
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          date: null,
                          month: "",
                          year: "",
                        }));
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        helperText="Select month and year for salary"
                        required
                      />
                    )}
                  />
                </LocalizationProvider>

                <TextField
                  select
                  label="Employment Type"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Hourly">Hourly</MenuItem>
                  <MenuItem value="PieceRate">Piece Rate</MenuItem>
                </TextField>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Basic Salary *"
                      name="basic"
                      type="number"
                      fullWidth
                      value={formData.basic}
                      onChange={handleNumberChange}
                      required
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="HRA"
                      name="hra"
                      type="number"
                      fullWidth
                      value={formData.hra}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Conveyance"
                      name="conveyance"
                      type="number"
                      fullWidth
                      value={formData.conveyance}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Medical Allowance"
                      name="medical"
                      type="number"
                      fullWidth
                      value={formData.medical}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" color="#164e63" sx={{ mt: 1 }}>
                  Working Days Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Working Days"
                      name="workingDays"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.workingDays}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Paid Days"
                      name="paidDays"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.paidDays}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Leave Days"
                      name="leaveDays"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.leaveDays}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="LOP Days"
                      name="lopDays"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.lopDays}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* STEP 2 - Earnings & Reimbursements */}
            {activeStep === 1 && (
              <Box>
                {/* Earnings Section */}
                <Accordion 
                  expanded={expandedSections.earnings}
                  onChange={() => handleSectionToggle('earnings')}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600} color="#164e63">
                      Earnings Components
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Basic Salary"
                          name="basic"
                          fullWidth
                          size="small"
                          value={formData.basic}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="HRA"
                          name="hra"
                          fullWidth
                          size="small"
                          value={formData.hra}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Conveyance"
                          name="conveyance"
                          fullWidth
                          size="small"
                          value={formData.conveyance}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Medical Allowance"
                          name="medical"
                          fullWidth
                          size="small"
                          value={formData.medical}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Special Allowance"
                          name="special"
                          fullWidth
                          size="small"
                          value={formData.special}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Dearness Allowance"
                          name="da"
                          fullWidth
                          size="small"
                          value={formData.da}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Arrears"
                          name="arrears"
                          fullWidth
                          size="small"
                          value={formData.arrears}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Overtime"
                          name="overtime"
                          fullWidth
                          size="small"
                          value={formData.overtime}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Performance Bonus"
                          name="performanceBonus"
                          fullWidth
                          size="small"
                          value={formData.performanceBonus}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Attendance Bonus"
                          name="attendanceBonus"
                          fullWidth
                          size="small"
                          value={formData.attendanceBonus}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Shift Allowance"
                          name="shiftAllowance"
                          fullWidth
                          size="small"
                          value={formData.shiftAllowance}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Production Incentive"
                          name="productionIncentive"
                          fullWidth
                          size="small"
                          value={formData.productionIncentive}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Other Allowances"
                          name="otherAllowances"
                          fullWidth
                          size="small"
                          value={formData.otherAllowances}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f1f5f9', borderRadius: 1.5 }}>
                      <Typography variant="subtitle2" color="#164e63">
                        Total Earnings: ₹{calculateTotalEarnings().toLocaleString()}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Reimbursements Section */}
                <Accordion 
                  expanded={expandedSections.reimbursements}
                  onChange={() => handleSectionToggle('reimbursements')}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600} color="#164e63">
                      Reimbursements
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Travel"
                          name="travel"
                          fullWidth
                          size="small"
                          value={formData.travel}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Food"
                          name="food"
                          fullWidth
                          size="small"
                          value={formData.food}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Telephone"
                          name="telephone"
                          fullWidth
                          size="small"
                          value={formData.telephone}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Fuel"
                          name="fuel"
                          fullWidth
                          size="small"
                          value={formData.fuel}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Medical"
                          name="medicalReimbursement"
                          fullWidth
                          size="small"
                          value={formData.medicalReimbursement}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Education"
                          name="education"
                          fullWidth
                          size="small"
                          value={formData.education}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="LTA"
                          name="lta"
                          fullWidth
                          size="small"
                          value={formData.lta}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Uniform"
                          name="uniform"
                          fullWidth
                          size="small"
                          value={formData.uniform}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Newspaper"
                          name="newspaper"
                          fullWidth
                          size="small"
                          value={formData.newspaper}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Other"
                          name="other"
                          fullWidth
                          size="small"
                          value={formData.other}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {/* STEP 3 - Deductions & Payment */}
            {activeStep === 2 && (
              <Box>
                {/* Deductions Section */}
                <Accordion 
                  expanded={expandedSections.deductions}
                  onChange={() => handleSectionToggle('deductions')}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600} color="#164e63">
                      Deductions
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="PF"
                          name="pf"
                          fullWidth
                          size="small"
                          value={formData.pf}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="ESI"
                          name="esi"
                          fullWidth
                          size="small"
                          value={formData.esi}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Professional Tax"
                          name="professionalTax"
                          fullWidth
                          size="small"
                          value={formData.professionalTax}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="TDS"
                          name="tds"
                          fullWidth
                          size="small"
                          value={formData.tds}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Loan Recovery"
                          name="loanRecovery"
                          fullWidth
                          size="small"
                          value={formData.loanRecovery}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Advance Recovery"
                          name="advanceRecovery"
                          fullWidth
                          size="small"
                          value={formData.advanceRecovery}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Labour Welfare"
                          name="labourWelfare"
                          fullWidth
                          size="small"
                          value={formData.labourWelfare}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Other Deductions"
                          name="otherDeductions"
                          fullWidth
                          size="small"
                          value={formData.otherDeductions}
                          onChange={handleNumberChange}
                          InputProps={{ sx: { borderRadius: 1.5 } }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f1f5f9', borderRadius: 1.5 }}>
                      <Typography variant="subtitle2" color="#164e63">
                        Total Deductions: ₹{calculateTotalDeductions().toLocaleString()}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Calculation Rules */}
                <Typography variant="subtitle2" color="#164e63" sx={{ mt: 2, mb: 1 }}>
                  Calculation Rules
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="HRA Percentage"
                      name="hraPercentage"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.hraPercentage}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="PF Percentage"
                      name="pfPercentage"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.pfPercentage}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="ESI Percentage"
                      name="esiPercentage"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.esiPercentage}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Overtime Multiplier"
                      name="overtimeMultiplier"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.overtimeMultiplier}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </Grid>

                {/* Overtime Details */}
                <Typography variant="subtitle2" color="#164e63" sx={{ mt: 1, mb: 1 }}>
                  Overtime & Additional Details
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Overtime Hours"
                      name="overtimeHours"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.overtimeHours}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Overtime Rate"
                      name="overtimeRate"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.overtimeRate}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Incentives"
                      name="incentives"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.incentives}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Advance Deductions"
                      name="advanceDeductions"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.advanceDeductions}
                      onChange={handleNumberChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </Grid>

                {/* Payment Details */}
                <Typography variant="subtitle2" color="#164e63" sx={{ mt: 1, mb: 1 }}>
                  Payment Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      select
                      label="Payment Mode"
                      name="paymentMode"
                      fullWidth
                      size="small"
                      value={formData.paymentMode}
                      onChange={handleChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    >
                      <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                      <MenuItem value="CASH">Cash</MenuItem>
                      <MenuItem value="CHEQUE">Cheque</MenuItem>
                      <MenuItem value="ONLINE">Online</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Remarks (Optional)"
                      name="remarks"
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      value={formData.remarks}
                      onChange={handleChange}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </Grid>

                {/* Net Pay Summary */}
                <Box sx={{ mt: 3, p: 2, bgcolor: '#e0f2fe', borderRadius: 2, border: '1px solid #bae6fd' }}>
                  <Typography variant="subtitle1" fontWeight={600} color="#164e63">
                    Net Pay Summary
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="#64748B">Total Earnings</Typography>
                      <Typography variant="h6" fontWeight={600}>₹{calculateTotalEarnings().toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="#64748B">Total Deductions</Typography>
                      <Typography variant="h6" fontWeight={600}>₹{calculateTotalDeductions().toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="#64748B">Net Pay</Typography>
                      <Typography variant="h5" fontWeight={700} color="#164e63">₹{calculateNetPay().toLocaleString()}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "space-between" }}>
        <Button onClick={onClose} sx={{ color: "#64748B" }}>
          Cancel
        </Button>
        <Box>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNextStep}
              sx={{
                background: "linear-gradient(135deg, #164e63, #00B4D8)",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={!loading && <AddIcon />}
              sx={{
                background: "linear-gradient(135deg, #164e63, #00B4D8)",
                "&:hover": { opacity: 0.9 },
                minWidth: 120
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Add Salary"}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddSalary;