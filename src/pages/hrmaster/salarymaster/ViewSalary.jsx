// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   Divider,
//   Grid,
//   Chip,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   TableHead,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from '@mui/material';
// import { 
//   Edit as EditIcon,
//   ExpandMore as ExpandMoreIcon,
//   AccountBalance as BankIcon,
//   Calculate as CalculateIcon,
//   Work as WorkIcon,
// } from '@mui/icons-material';

// const steps = [
//   'Employee & Payroll',
//   'Earnings & Reimbursements',
//   'Deductions & Summary'
// ];

// const ViewSalary = ({ open, onClose, salary, onEdit }) => {
//   const [activeStep, setActiveStep] = useState(0);

//   if (!salary) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatCurrency = (amount) =>
//     `₹ ${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'PAID': return 'success';
//       case 'PROCESSED': return 'info';
//       case 'APPROVED': return 'primary';
//       case 'PENDING': return 'warning';
//       case 'CANCELLED': return 'error';
//       default: return 'default';
//     }
//   };

//   const nextStep = () => setActiveStep((prev) => prev + 1);
//   const backStep = () => setActiveStep((prev) => prev - 1);

//   // Helper to get employee full name
//   const getEmployeeName = () => {
//     if (!salary.employee) return '-';
//     const { FirstName, LastName } = salary.employee;
//     return `${FirstName || ''} ${LastName || ''}`.trim() || '-';
//   };

//   // Helper to get bank details display
//   const getBankDisplay = () => {
//     const bank = salary.employee?.BankDetails;
//     if (!bank) return null;
//     return (
//       <Stack spacing={0.5}>
//         <Typography variant="body2">
//           <strong>Account Holder:</strong> {bank.accountHolderName || '-'}
//         </Typography>
//         <Typography variant="body2">
//           <strong>Account No:</strong> {bank.accountNumber || '-'}
//         </Typography>
//         <Typography variant="body2">
//           <strong>Bank:</strong> {bank.bankName || '-'} / {bank.branch || '-'}
//         </Typography>
//         <Typography variant="body2">
//           <strong>IFSC:</strong> {bank.ifscCode || '-'}
//         </Typography>
//       </Stack>
//     );
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 3 } }}
//     >
//       {/* HEADER */}
//       <DialogTitle
//         sx={{
//           background: 'linear-gradient(135deg,#164e63,#0ea5e9)',
//           color: '#fff',
//           fontSize: 20,
//           fontWeight: 600,
//           py: 2
//         }}
//       >
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <span>Salary Details – {salary.periodDisplay}</span>
//           <Chip 
//             label={salary.paymentStatus} 
//             color={getStatusColor(salary.paymentStatus)}
//             size="small"
//             sx={{ color: '#fff', fontWeight: 500 }}
//           />
//         </Stack>
//       </DialogTitle>

//       {/* STEPPER */}
//       <Box sx={{ px: 4, pt: 3 }}>
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       <DialogContent sx={{ px: 4, py: 3 }}>

//         {/* STEP 1 - Employee & Payroll */}
//         {activeStep === 0 && (
//           <Stack spacing={3}>
//             {/* Employee Information */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <WorkIcon fontSize="small" />
//                         <span>Employee Information</span>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Employee Name</TableCell>
//                     <TableCell>{getEmployeeName()}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Employee ID</TableCell>
//                     <TableCell>{salary.employee?.EmployeeID || '-'}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Department</TableCell>
//                     <TableCell>{salary.employee?.DepartmentID?.DepartmentName || '-'}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Designation</TableCell>
//                     <TableCell>{salary.employee?.DesignationID?.DesignationName || '-'} (Level {salary.employee?.DesignationID?.Level || '-'})</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Email</TableCell>
//                     <TableCell>{salary.employee?.Email || '-'}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Phone</TableCell>
//                     <TableCell>{salary.employee?.Phone || '-'}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Date of Joining</TableCell>
//                     <TableCell>{formatDate(salary.employee?.DateOfJoining)}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Employment Type</TableCell>
//                     <TableCell>{salary.employmentType || '-'}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Payroll Period */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <CalculateIcon fontSize="small" />
//                         <span>Payroll Period</span>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Month</TableCell>
//                     <TableCell>{salary.monthName || salary.payrollPeriod?.month}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Year</TableCell>
//                     <TableCell>{salary.payrollPeriod?.year}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Working Days</TableCell>
//                     <TableCell>{salary.workingDays}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Paid Days</TableCell>
//                     <TableCell>{salary.paidDays}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Leave Days</TableCell>
//                     <TableCell>{salary.leaveDays}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>LOP Days</TableCell>
//                     <TableCell>{salary.lopDays}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             {/* Payment Info */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>Payment Information</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Payment Mode</TableCell>
//                     <TableCell>{salary.paymentMode}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Payment Status</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={salary.paymentStatus}
//                         color={getStatusColor(salary.paymentStatus)}
//                         size="small"
//                       />
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Transaction ID</TableCell>
//                     <TableCell>{salary.transactionId || '-'}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Cheque Number</TableCell>
//                     <TableCell>{salary.chequeNumber || '-'}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Stack>
//         )}

//         {/* STEP 2 - Earnings & Reimbursements */}
//         {activeStep === 1 && (
//           <Stack spacing={3}>
//             {/* Earnings */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Earning Component</TableCell>
//                     <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {Object.entries(salary.earnings || {}).map(([key, value]) => (
//                     value > 0 && (
//                       <TableRow key={key}>
//                         <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
//                           {key.replace(/([A-Z])/g, ' $1').trim()}
//                         </TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 500 }}>
//                           {formatCurrency(value)}
//                         </TableCell>
//                       </TableRow>
//                     )
//                   ))}
//                   <TableRow sx={{ bgcolor: '#e8f5e8' }}>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Earnings</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.grossSalary)}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Reimbursements */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Reimbursement Component</TableCell>
//                     <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {Object.entries(salary.reimbursements || {}).map(([key, value]) => (
//                     value > 0 && (
//                       <TableRow key={key}>
//                         <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
//                           {key.replace(/([A-Z])/g, ' $1').trim()}
//                         </TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 500 }}>
//                           {formatCurrency(value)}
//                         </TableCell>
//                       </TableRow>
//                     )
//                   ))}
//                   <TableRow sx={{ bgcolor: '#e8f5e8' }}>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Reimbursements</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.totalReimbursements)}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Stack>
//         )}

//         {/* STEP 3 - Deductions & Summary */}
//         {activeStep === 2 && (
//           <Stack spacing={3}>
//             {/* Deductions */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Deduction Component</TableCell>
//                     <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {Object.entries(salary.deductions || {}).map(([key, value]) => (
//                     value > 0 && (
//                       <TableRow key={key}>
//                         <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
//                           {key.replace(/([A-Z])/g, ' $1').trim()}
//                         </TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 500 }}>
//                           {formatCurrency(value)}
//                         </TableCell>
//                       </TableRow>
//                     )
//                   ))}
//                   <TableRow sx={{ bgcolor: '#ffebee' }}>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Deductions</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.totalDeductions)}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Summary */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Salary Summary</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Gross Salary</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.grossSalary)}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Total Reimbursements</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.totalReimbursements)}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Total Deductions</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.totalDeductions)}</TableCell>
//                   </TableRow>
//                   <TableRow sx={{ bgcolor: '#e8f5e8' }}>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 700, color: 'success.main' }}>Net Pay</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main', fontSize: 18 }}>{formatCurrency(salary.netPay)}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Overtime & Bonus Details */}
//             {(salary.overtimeHours > 0 || salary.overtimeRate > 0 || salary.performanceBonus > 0 || salary.incentives > 0) && (
//               <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: '#164e63' }}>
//                       <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Additional Details</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {salary.overtimeHours > 0 && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Overtime Hours</TableCell>
//                         <TableCell align="right">{salary.overtimeHours} hrs @ ₹{salary.overtimeRate}/hr</TableCell>
//                       </TableRow>
//                     )}
//                     {salary.performanceBonus > 0 && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Performance Bonus</TableCell>
//                         <TableCell align="right">{formatCurrency(salary.performanceBonus)}</TableCell>
//                       </TableRow>
//                     )}
//                     {salary.incentives > 0 && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Incentives</TableCell>
//                         <TableCell align="right">{formatCurrency(salary.incentives)}</TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}

//             {/* Remarks & Audit Info */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableBody>
//                   {salary.remarks && (
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Remarks</TableCell>
//                       <TableCell>{salary.remarks}</TableCell>
//                     </TableRow>
//                   )}
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Created By</TableCell>
//                     <TableCell>{salary.createdBy?.Email || '-'} on {formatDate(salary.createdAt)}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Last Updated</TableCell>
//                     <TableCell>{formatDate(salary.updatedAt)} {salary.updatedBy ? `by ${salary.updatedBy.Email}` : ''}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Version</TableCell>
//                     <TableCell>{salary.version}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Stack>
//         )}
//       </DialogContent>

//       {/* ACTIONS */}
//       <DialogActions sx={{ px: 4, pb: 3 }}>
//         <Button onClick={onClose}>Close</Button>

//         {activeStep > 0 && (
//           <Button onClick={backStep}>Back</Button>
//         )}

//         {activeStep < steps.length - 1 ? (
//           <Button variant="contained" onClick={nextStep}>
//             Next
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             startIcon={<EditIcon />}
//             onClick={() => {
//               onClose();
//               onEdit(salary);
//             }}
//             sx={{
//               background: "linear-gradient(135deg, #164e63, #0ea5e9)",
//               "&:hover": { opacity: 0.9 },
//             }}
//           >
//             Edit Salary
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewSalary;

// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   Divider,
//   Grid,
//   Chip,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   TableHead,
//   Avatar,
//   Tooltip,
//   IconButton,
//   Alert
// } from '@mui/material';
// import { 
//   Edit as EditIcon,
//   AccountBalance as BankIcon,
//   Calculate as CalculateIcon,
//   Work as WorkIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Cake as CakeIcon,
//   LocationOn as LocationIcon,
//   Receipt as ReceiptIcon,
//   ArrowBack as ArrowBackIcon,
//   ArrowForward as ArrowForwardIcon
// } from '@mui/icons-material';

// const steps = [
//   'Employee & Payroll',
//   'Earnings & Reimbursements',
//   'Deductions & Summary'
// ];

// const ViewSalary = ({ open, onClose, salary, onEdit }) => {
//   const [activeStep, setActiveStep] = useState(0);

//   if (!salary) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatCurrency = (amount) => {
//     if (amount === undefined || amount === null) return '₹ 0.00';
//     return `₹ ${Number(amount).toLocaleString('en-IN', { 
//       minimumFractionDigits: 2, 
//       maximumFractionDigits: 2 
//     })}`;
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'PAID': return 'success';
//       case 'PROCESSED': return 'info';
//       case 'APPROVED': return 'primary';
//       case 'PENDING': return 'warning';
//       case 'CANCELLED': return 'error';
//       default: return 'default';
//     }
//   };

//   const getEmploymentTypeText = (type) => {
//     switch(type) {
//       case 'Monthly': return 'Monthly Salary';
//       case 'Hourly': return 'Hourly Wage';
//       case 'PieceRate': return 'Piece Rate';
//       default: return type || '-';
//     }
//   };

//   const getAvatarInitials = (firstName, lastName) => {
//     const first = firstName ? firstName.charAt(0) : '';
//     const last = lastName ? lastName.charAt(0) : '';
//     return `${first}${last}`.toUpperCase() || 'U';
//   };

//   const getMonthName = (monthNumber) => {
//     const months = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return months[monthNumber - 1] || monthNumber;
//   };

//   const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
//   const backStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

//   // Helper to get employee full name
//   const getEmployeeName = () => {
//     if (!salary.employee) return '-';
//     const { FirstName, LastName } = salary.employee;
//     return `${FirstName || ''} ${LastName || ''}`.trim() || '-';
//   };

//   // Helper to get bank details display
//   const getBankDisplay = () => {
//     const bank = salary.employee?.BankDetails;
//     if (!bank || Object.keys(bank).length === 0) return null;
//     return (
//       <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
//         <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
//           <BankIcon sx={{ color: '#164e63' }} />
//           <Typography variant="subtitle1" fontWeight={600} color="#164e63">
//             Bank Account Details
//           </Typography>
//         </Stack>
//         <Stack spacing={1}>
//           {bank.accountHolderName && (
//             <Typography variant="body2">
//               <strong>Account Holder:</strong> {bank.accountHolderName}
//             </Typography>
//           )}
//           {bank.accountNumber && (
//             <Typography variant="body2">
//               <strong>Account Number:</strong> {bank.accountNumber}
//             </Typography>
//           )}
//           {bank.bankName && (
//             <Typography variant="body2">
//               <strong>Bank Name:</strong> {bank.bankName}
//             </Typography>
//           )}
//           {bank.branch && (
//             <Typography variant="body2">
//               <strong>Branch:</strong> {bank.branch}
//             </Typography>
//           )}
//           {bank.ifscCode && (
//             <Typography variant="body2">
//               <strong>IFSC Code:</strong> {bank.ifscCode}
//             </Typography>
//           )}
//           {bank.accountType && (
//             <Typography variant="body2">
//               <strong>Account Type:</strong> {bank.accountType}
//             </Typography>
//           )}
//         </Stack>
//       </Paper>
//     );
//   };

//   // Get period display
//   const getPeriodDisplay = () => {
//     const month = salary.payrollPeriod?.month || salary.month;
//     const year = salary.payrollPeriod?.year || salary.year;
//     if (!month || !year) return '-';
//     return `${getMonthName(month)} ${year}`;
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       PaperProps={{ 
//         sx: { 
//           borderRadius: 3,
//           overflow: 'hidden'
//         } 
//       }}
//     >
//       {/* HEADER */}
//       <DialogTitle
//         sx={{
//           background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//           color: '#fff',
//           fontSize: 20,
//           fontWeight: 600,
//           py: 2.5,
//           px: 4
//         }}
//       >
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Stack direction="row" spacing={2} alignItems="center">
//             <ReceiptIcon />
//             <span>Salary Details – {getPeriodDisplay()}</span>
//           </Stack>
//           <Stack direction="row" spacing={1}>
//             <Chip 
//               label={salary.paymentStatus || 'PENDING'} 
//               color={getStatusColor(salary.paymentStatus)}
//               size="small"
//               sx={{ 
//                 color: '#fff', 
//                 fontWeight: 500,
//                 bgcolor: getStatusColor(salary.paymentStatus) === 'success' ? '#2e7d32' :
//                         getStatusColor(salary.paymentStatus) === 'info' ? '#0288d1' :
//                         getStatusColor(salary.paymentStatus) === 'primary' ? '#1976d2' :
//                         getStatusColor(salary.paymentStatus) === 'warning' ? '#ed6c02' :
//                         getStatusColor(salary.paymentStatus) === 'error' ? '#d32f2f' : '#757575'
//               }}
//             />
//             <Chip 
//               label={salary.employmentType || 'Monthly'} 
//               variant="outlined"
//               size="small"
//               sx={{ color: '#fff', borderColor: '#fff' }}
//             />
//           </Stack>
//         </Stack>
//       </DialogTitle>

//       {/* STEPPER */}
//       <Box sx={{ px: 4, pt: 3, pb: 2, bgcolor: '#f8fafc' }}>
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       <DialogContent sx={{ px: 4, py: 3, bgcolor: '#f8fafc' }}>

//         {/* STEP 1 - Employee & Payroll */}
//         {activeStep === 0 && (
//           <Stack spacing={3}>
//             {/* Employee Header with Avatar */}
//             <Paper sx={{ p: 3, borderRadius: 2 }}>
//               <Stack direction="row" spacing={3} alignItems="center">
//                 <Avatar
//                   sx={{
//                     width: 80,
//                     height: 80,
//                     bgcolor: '#164e63',
//                     fontSize: '2rem',
//                     fontWeight: 600
//                   }}
//                 >
//                   {getAvatarInitials(salary.employee?.FirstName, salary.employee?.LastName)}
//                 </Avatar>
//                 <Box flex={1}>
//                   <Typography variant="h5" fontWeight={600} color="#164e63">
//                     {getEmployeeName()}
//                   </Typography>
//                   <Typography variant="body1" color="textSecondary" gutterBottom>
//                     Employee ID: {salary.employee?.EmployeeID || '-'}
//                   </Typography>
//                   <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
//                     <Chip
//                       icon={<PersonIcon />}
//                       label={salary.employee?.Gender === 'M' ? 'Male' : 
//                             salary.employee?.Gender === 'F' ? 'Female' : 'Other'}
//                       size="small"
//                       variant="outlined"
//                     />
//                     <Chip
//                       icon={<WorkIcon />}
//                       label={getEmploymentTypeText(salary.employmentType)}
//                       size="small"
//                       variant="outlined"
//                     />
//                   </Stack>
//                 </Box>
//               </Stack>
//             </Paper>

//             {/* Employee Information */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <PersonIcon fontSize="small" />
//                         <span>Employee Information</span>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Department</TableCell>
//                     <TableCell>{salary.employee?.DepartmentID?.DepartmentName || '-'}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Designation</TableCell>
//                     <TableCell>
//                       {salary.employee?.DesignationID?.DesignationName || '-'} 
//                       {salary.employee?.DesignationID?.Level && ` (Level ${salary.employee.DesignationID.Level})`}
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Date of Birth</TableCell>
//                     <TableCell>{formatDate(salary.employee?.DateOfBirth)}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Date of Joining</TableCell>
//                     <TableCell>{formatDate(salary.employee?.DateOfJoining)}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Email</TableCell>
//                     <TableCell>
//                       <Stack direction="row" spacing={1} alignItems="center">
//                         <EmailIcon fontSize="small" sx={{ color: '#64748B' }} />
//                         <span>{salary.employee?.Email || '-'}</span>
//                       </Stack>
//                     </TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Phone</TableCell>
//                     <TableCell>
//                       <Stack direction="row" spacing={1} alignItems="center">
//                         <PhoneIcon fontSize="small" sx={{ color: '#64748B' }} />
//                         <span>{salary.employee?.Phone || '-'}</span>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Address</TableCell>
//                     <TableCell colSpan={3}>
//                       <Stack direction="row" spacing={1} alignItems="center">
//                         <LocationIcon fontSize="small" sx={{ color: '#64748B' }} />
//                         <span>{salary.employee?.Address || '-'}</span>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Payroll Period */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <CalculateIcon fontSize="small" />
//                         <span>Payroll Period</span>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Month</TableCell>
//                     <TableCell>{getMonthName(salary.payrollPeriod?.month || salary.month)}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Year</TableCell>
//                     <TableCell>{salary.payrollPeriod?.year || salary.year}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Working Days</TableCell>
//                     <TableCell>{salary.workingDays || 0}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Paid Days</TableCell>
//                     <TableCell>{salary.paidDays || 0}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Leave Days</TableCell>
//                     <TableCell>{salary.leaveDays || 0}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>LOP Days</TableCell>
//                     <TableCell>{salary.lopDays || 0}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Payment Information */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <BankIcon fontSize="small" />
//                         <span>Payment Information</span>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Payment Mode</TableCell>
//                     <TableCell>{salary.paymentMode || '-'}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Payment Status</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={salary.paymentStatus || 'PENDING'}
//                         color={getStatusColor(salary.paymentStatus)}
//                         size="small"
//                         sx={{ fontWeight: 500 }}
//                       />
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Transaction ID</TableCell>
//                     <TableCell>{salary.transactionId || '-'}</TableCell>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Cheque Number</TableCell>
//                     <TableCell>{salary.chequeNumber || '-'}</TableCell>
//                   </TableRow>
//                   {salary.paymentDate && (
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Payment Date</TableCell>
//                       <TableCell colSpan={3}>{formatDate(salary.paymentDate)}</TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Bank Details */}
//             {salary.employee?.BankDetails && Object.keys(salary.employee.BankDetails).length > 0 && (
//               <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: '#164e63' }}>
//                       <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
//                         <Stack direction="row" alignItems="center" spacing={1}>
//                           <BankIcon fontSize="small" />
//                           <span>Bank Account Details</span>
//                         </Stack>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {salary.employee.BankDetails.accountHolderName && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Account Holder</TableCell>
//                         <TableCell colSpan={3}>{salary.employee.BankDetails.accountHolderName}</TableCell>
//                       </TableRow>
//                     )}
//                     {salary.employee.BankDetails.accountNumber && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Account Number</TableCell>
//                         <TableCell>{salary.employee.BankDetails.accountNumber}</TableCell>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Account Type</TableCell>
//                         <TableCell>{salary.employee.BankDetails.accountType || '-'}</TableCell>
//                       </TableRow>
//                     )}
//                     {salary.employee.BankDetails.bankName && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Bank Name</TableCell>
//                         <TableCell>{salary.employee.BankDetails.bankName}</TableCell>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Branch</TableCell>
//                         <TableCell>{salary.employee.BankDetails.branch || '-'}</TableCell>
//                       </TableRow>
//                     )}
//                     {salary.employee.BankDetails.ifscCode && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>IFSC Code</TableCell>
//                         <TableCell colSpan={3}>{salary.employee.BankDetails.ifscCode}</TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Stack>
//         )}

//         {/* STEP 2 - Earnings & Reimbursements */}
//         {activeStep === 1 && (
//           <Stack spacing={3}>
//             {/* Earnings */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Earning Component</TableCell>
//                     <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {salary.earnings && Object.entries(salary.earnings).map(([key, value]) => {
//                     if (value > 0) {
//                       return (
//                         <TableRow key={key}>
//                           <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
//                             {key.replace(/([A-Z])/g, ' $1').trim()}
//                           </TableCell>
//                           <TableCell align="right" sx={{ fontWeight: 500 }}>
//                             {formatCurrency(value)}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     }
//                     return null;
//                   })}
//                   <TableRow sx={{ bgcolor: '#e8f5e8' }}>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Earnings</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.grossSalary)}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Reimbursements */}
//             {salary.reimbursements && Object.values(salary.reimbursements).some(v => v > 0) && (
//               <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: '#164e63' }}>
//                       <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Reimbursement Component</TableCell>
//                       <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {Object.entries(salary.reimbursements).map(([key, value]) => {
//                       if (value > 0) {
//                         return (
//                           <TableRow key={key}>
//                             <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
//                               {key.replace(/([A-Z])/g, ' $1').trim()}
//                             </TableCell>
//                             <TableCell align="right" sx={{ fontWeight: 500 }}>
//                               {formatCurrency(value)}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       }
//                       return null;
//                     })}
//                     <TableRow sx={{ bgcolor: '#e8f5e8' }}>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Reimbursements</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.totalReimbursements)}</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}

//             {/* Overtime & Bonus Details */}
//             {(salary.overtimeHours > 0 || salary.performanceBonus > 0 || salary.incentives > 0) && (
//               <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: '#164e63' }}>
//                       <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Additional Earnings</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {salary.overtimeHours > 0 && salary.overtimeRate > 0 && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Overtime</TableCell>
//                         <TableCell>{salary.overtimeHours} hrs @ {formatCurrency(salary.overtimeRate)}/hr</TableCell>
//                       </TableRow>
//                     )}
//                     {salary.performanceBonus > 0 && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Performance Bonus</TableCell>
//                         <TableCell align="right">{formatCurrency(salary.performanceBonus)}</TableCell>
//                       </TableRow>
//                     )}
//                     {salary.incentives > 0 && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Incentives</TableCell>
//                         <TableCell align="right">{formatCurrency(salary.incentives)}</TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Stack>
//         )}

//         {/* STEP 3 - Deductions & Summary */}
//         {activeStep === 2 && (
//           <Stack spacing={3}>
//             {/* Deductions */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Deduction Component</TableCell>
//                     <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {salary.deductions && Object.entries(salary.deductions).map(([key, value]) => {
//                     if (value > 0) {
//                       return (
//                         <TableRow key={key}>
//                           <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
//                             {key.replace(/([A-Z])/g, ' $1').trim()}
//                           </TableCell>
//                           <TableCell align="right" sx={{ fontWeight: 500 }}>
//                             {formatCurrency(value)}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     }
//                     return null;
//                   })}
//                   <TableRow sx={{ bgcolor: '#ffebee' }}>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Deductions</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.totalDeductions)}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Summary */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Salary Summary</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Gross Salary</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.grossSalary)}</TableCell>
//                   </TableRow>
//                   {salary.totalReimbursements > 0 && (
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Total Reimbursements</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.totalReimbursements)}</TableCell>
//                     </TableRow>
//                   )}
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Total Deductions</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.totalDeductions)}</TableCell>
//                   </TableRow>
//                   <TableRow sx={{ bgcolor: '#e8f5e8' }}>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Net Pay</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#2e7d32' }}>
//                       {formatCurrency(salary.netPay)}
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Calculation Rules */}
//             {salary.calculationRules && (
//               <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: '#164e63' }}>
//                       <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Calculation Rules</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>HRA Percentage</TableCell>
//                       <TableCell>{salary.calculationRules.hraPercentage || 50}%</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>PF Percentage</TableCell>
//                       <TableCell>{salary.calculationRules.pfPercentage || 12}%</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>ESI Percentage</TableCell>
//                       <TableCell>{salary.calculationRules.esiPercentage || 0.75}%</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Overtime Multiplier</TableCell>
//                       <TableCell>{salary.calculationRules.overtimeMultiplier || 1.5}x</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}

//             {/* Remarks & Audit Info */}
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#164e63' }}>
//                     <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Additional Information</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {salary.remarks && (
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Remarks</TableCell>
//                       <TableCell>{salary.remarks}</TableCell>
//                     </TableRow>
//                   )}
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Created By</TableCell>
//                     <TableCell>
//                       {salary.createdBy?.Email || '-'} on {formatDate(salary.createdAt)}
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Last Updated</TableCell>
//                     <TableCell>
//                       {formatDate(salary.updatedAt)} 
//                       {salary.updatedBy ? ` by ${salary.updatedBy.Email}` : ''}
//                     </TableCell>
//                   </TableRow>
//                   {salary.version && (
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Version</TableCell>
//                       <TableCell>{salary.version}</TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Stack>
//         )}
//       </DialogContent>

//       {/* ACTIONS */}
//       <DialogActions sx={{ px: 4, pb: 3, pt: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
//         <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
//           <Button 
//             onClick={onClose}
//             variant="outlined"
//             sx={{ 
//               borderRadius: 2,
//               textTransform: 'none',
//               borderColor: '#cbd5e1',
//               color: '#475569'
//             }}
//           >
//             Close
//           </Button>
          
//           <Stack direction="row" spacing={2}>
//             {activeStep > 0 && (
//               <Button 
//                 onClick={backStep}
//                 startIcon={<ArrowBackIcon />}
//                 sx={{ 
//                   borderRadius: 2,
//                   textTransform: 'none'
//                 }}
//               >
//                 Back
//               </Button>
//             )}

//             {activeStep < steps.length - 1 ? (
//               <Button 
//                 variant="contained" 
//                 onClick={nextStep}
//                 endIcon={<ArrowForwardIcon />}
//                 sx={{
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   background: "linear-gradient(135deg, #164e63, #00B4D8)",
//                   "&:hover": { opacity: 0.9 },
//                 }}
//               >
//                 Next
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 startIcon={<EditIcon />}
//                 onClick={() => {
//                   onClose();
//                   onEdit(salary);
//                 }}
//                 sx={{
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   background: "linear-gradient(135deg, #164e63, #00B4D8)",
//                   "&:hover": { opacity: 0.9 },
//                 }}
//               >
//                 Edit Salary
//               </Button>
//             )}
//           </Stack>
//         </Stack>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewSalary;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Divider,
  Grid,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Avatar,
  Tooltip,
  IconButton,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon,
  AccountBalance as BankIcon,
  Calculate as CalculateIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon
} from '@mui/icons-material';

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

const steps = [
  'Employee & Payroll',
  'Earnings & Reimbursements',
  'Deductions & Summary'
];

const ViewSalary = ({ open, onClose, salary, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!salary) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹ 0';
    return `₹ ${Number(amount).toLocaleString('en-IN', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return COLORS.status.success;
      case 'processed': return COLORS.status.info;
      case 'approved': return COLORS.primaryLight;
      case 'pending': return COLORS.status.warning;
      case 'cancelled': return COLORS.status.error;
      default: return COLORS.chips.inactive;
    }
  };

  const getStatusTextColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return COLORS.primaryDark;
      case 'processed': return '#0369A1';
      case 'approved': return COLORS.primaryDark;
      case 'pending': return '#92400E';
      case 'cancelled': return '#991B1B';
      default: return COLORS.text.secondary;
    }
  };

  const getEmploymentTypeText = (type) => {
    switch(type) {
      case 'Monthly': return 'Monthly Salary';
      case 'Hourly': return 'Hourly Wage';
      case 'PieceRate': return 'Piece Rate';
      default: return type || '-';
    }
  };

  const getAvatarInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || monthNumber;
  };

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const backStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const getEmployeeName = () => {
    if (!salary.employee) return '-';
    const { FirstName, LastName } = salary.employee;
    return `${FirstName || ''} ${LastName || ''}`.trim() || '-';
  };

  const getPeriodDisplay = () => {
    const month = salary.payrollPeriod?.month || salary.month;
    const year = salary.payrollPeriod?.year || salary.year;
    if (!month || !year) return '-';
    return `${getMonthName(month)} ${year}`;
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px'
  };

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
          overflow: 'hidden'
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
          <ReceiptIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: COLORS.text.primary
            }}
          >
            Salary Details – {getPeriodDisplay()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={salary.paymentStatus || 'PENDING'} 
            size="small"
            sx={{ 
              bgcolor: getStatusColor(salary.paymentStatus),
              color: getStatusTextColor(salary.paymentStatus),
              fontWeight: 500,
              fontSize: '0.65rem',
              height: 24,
              '& .MuiChip-label': {
                px: 1,
                fontSize: '0.65rem'
              }
            }}
          />
          <Chip 
            label={salary.employmentType || 'Monthly'} 
            size="small"
            sx={{ 
              bgcolor: COLORS.primaryLight,
              color: COLORS.primaryDark,
              fontWeight: 500,
              fontSize: '0.65rem',
              height: 24,
              '& .MuiChip-label': {
                px: 1,
                fontSize: '0.65rem'
              }
            }}
          />
        </Box>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>

        {/* STEP 1 - Employee & Payroll */}
        {activeStep === 0 && (
          <Stack spacing={2.5}>
            {/* Employee Header */}
            <Box sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`
            }}>
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: COLORS.primary,
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}
                >
                  {getAvatarInitials(salary.employee?.FirstName, salary.employee?.LastName)}
                </Avatar>
                <Box flex={1}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {getEmployeeName()}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                    Employee ID: {salary.employee?.EmployeeID || '-'}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<PersonIcon sx={{ fontSize: '0.7rem' }} />}
                      label={salary.employee?.Gender === 'M' ? 'Male' : 
                            salary.employee?.Gender === 'F' ? 'Female' : 'Other'}
                      size="small"
                      sx={{ 
                        fontSize: '0.65rem', 
                        height: 24,
                        bgcolor: COLORS.background.light
                      }}
                    />
                    <Chip
                      icon={<WorkIcon sx={{ fontSize: '0.7rem' }} />}
                      label={getEmploymentTypeText(salary.employmentType)}
                      size="small"
                      sx={{ 
                        fontSize: '0.65rem', 
                        height: 24,
                        bgcolor: COLORS.background.light
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* Employee Information */}
            <Box sx={{ 
              bgcolor: COLORS.background.white, 
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.tableHeader,
                borderBottom: `1px solid ${COLORS.border}`
              }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PersonIcon sx={{ fontSize: '1rem', color: COLORS.text.light }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                    Employee Information
                  </Typography>
                </Stack>
              </Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelStyle}>Department</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.employee?.DepartmentID?.DepartmentName || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelStyle}>Designation</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.employee?.DesignationID?.DesignationName || '-'}
                      {salary.employee?.DesignationID?.Level && ` (Level ${salary.employee.DesignationID.Level})`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelStyle}>Date of Birth</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(salary.employee?.DateOfBirth)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelStyle}>Date of Joining</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(salary.employee?.DateOfJoining)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelStyle}>Email</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {salary.employee?.Email || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelStyle}>Phone</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {salary.employee?.Phone || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={labelStyle}>Address</Typography>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <LocationIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, mt: 0.2 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {salary.employee?.Address || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Payroll Period */}
            <Box sx={{ 
              bgcolor: COLORS.background.white, 
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.tableHeader,
                borderBottom: `1px solid ${COLORS.border}`
              }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalculateIcon sx={{ fontSize: '1rem', color: COLORS.text.light }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                    Payroll Period
                  </Typography>
                </Stack>
              </Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={labelStyle}>Month</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {getMonthName(salary.payrollPeriod?.month || salary.month)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={labelStyle}>Year</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.payrollPeriod?.year || salary.year}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={labelStyle}>Working Days</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.workingDays || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={labelStyle}>Paid Days</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.paidDays || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={labelStyle}>Leave Days</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.leaveDays || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={labelStyle}>LOP Days</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.lopDays || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Payment Information */}
            <Box sx={{ 
              bgcolor: COLORS.background.white, 
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.tableHeader,
                borderBottom: `1px solid ${COLORS.border}`
              }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BankIcon sx={{ fontSize: '1rem', color: COLORS.text.light }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                    Payment Information
                  </Typography>
                </Stack>
              </Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography sx={labelStyle}>Payment Mode</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.paymentMode || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography sx={labelStyle}>Payment Status</Typography>
                    <Chip
                      label={salary.paymentStatus || 'PENDING'}
                      size="small"
                      sx={{ 
                        mt: 0.5,
                        bgcolor: getStatusColor(salary.paymentStatus),
                        color: getStatusTextColor(salary.paymentStatus),
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography sx={labelStyle}>Transaction ID</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.transactionId || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography sx={labelStyle}>Cheque Number</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {salary.chequeNumber || '-'}
                    </Typography>
                  </Grid>
                  {salary.paymentDate && (
                    <Grid item xs={12} sm={4}>
                      <Typography sx={labelStyle}>Payment Date</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formatDate(salary.paymentDate)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>

            {/* Bank Details */}
            {salary.employee?.BankDetails && Object.keys(salary.employee.BankDetails).length > 0 && (
              <Box sx={{ 
                bgcolor: COLORS.background.white, 
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.tableHeader,
                  borderBottom: `1px solid ${COLORS.border}`
                }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BankIcon sx={{ fontSize: '1rem', color: COLORS.text.light }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                      Bank Account Details
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {salary.employee.BankDetails.accountHolderName && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Account Holder</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.employee.BankDetails.accountHolderName}
                        </Typography>
                      </Grid>
                    )}
                    {salary.employee.BankDetails.accountNumber && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Account Number</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.employee.BankDetails.accountNumber}
                        </Typography>
                      </Grid>
                    )}
                    {salary.employee.BankDetails.bankName && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Bank Name</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.employee.BankDetails.bankName}
                        </Typography>
                      </Grid>
                    )}
                    {salary.employee.BankDetails.branch && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Branch</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.employee.BankDetails.branch}
                        </Typography>
                      </Grid>
                    )}
                    {salary.employee.BankDetails.ifscCode && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>IFSC Code</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.employee.BankDetails.ifscCode}
                        </Typography>
                      </Grid>
                    )}
                    {salary.employee.BankDetails.accountType && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Account Type</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.employee.BankDetails.accountType}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Box>
            )}
          </Stack>
        )}

        {/* STEP 2 - Earnings & Reimbursements */}
        {activeStep === 1 && (
          <Stack spacing={2.5}>
            {/* Earnings */}
            <Box sx={{ 
              bgcolor: COLORS.background.white, 
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.tableHeader,
                borderBottom: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                  Earnings Components
                </Typography>
              </Box>
              <Box sx={{ p: 0 }}>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {salary.earnings && Object.entries(salary.earnings).map(([key, value]) => {
                        if (value > 0) {
                          return (
                            <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, py: 1 }}>
                                {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, py: 1 }}>
                                {formatCurrency(value)}
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return null;
                      })}
                      <TableRow sx={{ bgcolor: COLORS.primaryLight }}>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primaryDark, py: 1 }}>
                          Total Earnings
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primaryDark, py: 1 }}>
                          {formatCurrency(salary.grossSalary)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            {/* Reimbursements */}
            {salary.reimbursements && Object.values(salary.reimbursements).some(v => v > 0) && (
              <Box sx={{ 
                bgcolor: COLORS.background.white, 
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.tableHeader,
                  borderBottom: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                    Reimbursements
                  </Typography>
                </Box>
                <Box sx={{ p: 0 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(salary.reimbursements).map(([key, value]) => {
                          if (value > 0) {
                            return (
                              <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, py: 1 }}>
                                  {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, py: 1 }}>
                                  {formatCurrency(value)}
                                </TableCell>
                              </TableRow>
                            );
                          }
                          return null;
                        })}
                        <TableRow sx={{ bgcolor: COLORS.primaryLight }}>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primaryDark, py: 1 }}>
                            Total Reimbursements
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primaryDark, py: 1 }}>
                            {formatCurrency(salary.totalReimbursements)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            )}

            {/* Additional Earnings */}
            {(salary.overtimeHours > 0 || salary.performanceBonus > 0 || salary.incentives > 0) && (
              <Box sx={{ 
                bgcolor: COLORS.background.white, 
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.tableHeader,
                  borderBottom: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                    Additional Earnings
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {salary.overtimeHours > 0 && salary.overtimeRate > 0 && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Overtime</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.overtimeHours} hrs @ {formatCurrency(salary.overtimeRate)}/hr
                        </Typography>
                      </Grid>
                    )}
                    {salary.performanceBonus > 0 && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Performance Bonus</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatCurrency(salary.performanceBonus)}
                        </Typography>
                      </Grid>
                    )}
                    {salary.incentives > 0 && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Incentives</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatCurrency(salary.incentives)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Box>
            )}
          </Stack>
        )}

        {/* STEP 3 - Deductions & Summary */}
        {activeStep === 2 && (
          <Stack spacing={2.5}>
            {/* Deductions */}
            <Box sx={{ 
              bgcolor: COLORS.background.white, 
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.tableHeader,
                borderBottom: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                  Deductions
                </Typography>
              </Box>
              <Box sx={{ p: 0 }}>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {salary.deductions && Object.entries(salary.deductions).map(([key, value]) => {
                        if (value > 0) {
                          return (
                            <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, py: 1 }}>
                                {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, py: 1 }}>
                                {formatCurrency(value)}
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return null;
                      })}
                      <TableRow sx={{ bgcolor: COLORS.status.error }}>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', py: 1 }}>
                          Total Deductions
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', py: 1 }}>
                          {formatCurrency(salary.totalDeductions)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            {/* Salary Summary */}
            <Box sx={{ 
              bgcolor: COLORS.background.white, 
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.tableHeader,
                borderBottom: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                  Salary Summary
                </Typography>
              </Box>
              <Box sx={{ p: 0 }}>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, py: 1.5 }}>
                          Gross Salary
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, py: 1.5 }}>
                          {formatCurrency(salary.grossSalary)}
                        </TableCell>
                      </TableRow>
                      {salary.totalReimbursements > 0 && (
                        <TableRow>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, py: 1.5 }}>
                            Total Reimbursements
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, py: 1.5 }}>
                            {formatCurrency(salary.totalReimbursements)}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, py: 1.5 }}>
                          Total Deductions
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#d32f2f', py: 1.5 }}>
                          {formatCurrency(salary.totalDeductions)}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: COLORS.primaryLight }}>
                        <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.primaryDark, py: 1.5 }}>
                          Net Pay
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primaryDark, py: 1.5 }}>
                          {formatCurrency(salary.netPay)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            {/* Calculation Rules */}
            {salary.calculationRules && (
              <Box sx={{ 
                bgcolor: COLORS.background.white, 
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.tableHeader,
                  borderBottom: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                    Calculation Rules
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Typography sx={labelStyle}>HRA Percentage</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {salary.calculationRules.hraPercentage || 50}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography sx={labelStyle}>PF Percentage</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {salary.calculationRules.pfPercentage || 12}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography sx={labelStyle}>ESI Percentage</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {salary.calculationRules.esiPercentage || 0.75}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography sx={labelStyle}>Overtime Multiplier</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {salary.calculationRules.overtimeMultiplier || 1.5}x
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}

            {/* Additional Information */}
            {(salary.remarks || salary.createdBy || salary.updatedAt) && (
              <Box sx={{ 
                bgcolor: COLORS.background.white, 
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.tableHeader,
                  borderBottom: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.light }}>
                    Additional Information
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {salary.remarks && (
                      <Grid item xs={12}>
                        <Typography sx={labelStyle}>Remarks</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.remarks}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Typography sx={labelStyle}>Created By</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {salary.createdBy?.Email || '-'} on {formatDate(salary.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={labelStyle}>Last Updated</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formatDate(salary.updatedAt)} 
                        {salary.updatedBy ? ` by ${salary.updatedBy.Email}` : ''}
                      </Typography>
                    </Grid>
                    {salary.version && (
                      <Grid item xs={12} sm={6}>
                        <Typography sx={labelStyle}>Version</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {salary.version}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Button
          onClick={onClose}
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
          Close
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && (
            <Button
              onClick={backStep}
              startIcon={<ArrowBackIcon sx={{ fontSize: '1rem' }} />}
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
              Back
            </Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={nextStep}
              endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
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
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => {
                onClose();
                onEdit(salary);
              }}
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
                }
              }}
            >
              Edit Salary
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSalary;