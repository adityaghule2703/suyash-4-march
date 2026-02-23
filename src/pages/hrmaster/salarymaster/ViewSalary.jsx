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
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹ 0.00';
    return `₹ ${Number(amount).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PAID': return 'success';
      case 'PROCESSED': return 'info';
      case 'APPROVED': return 'primary';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
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

  // Helper to get employee full name
  const getEmployeeName = () => {
    if (!salary.employee) return '-';
    const { FirstName, LastName } = salary.employee;
    return `${FirstName || ''} ${LastName || ''}`.trim() || '-';
  };

  // Helper to get bank details display
  const getBankDisplay = () => {
    const bank = salary.employee?.BankDetails;
    if (!bank || Object.keys(bank).length === 0) return null;
    return (
      <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <BankIcon sx={{ color: '#164e63' }} />
          <Typography variant="subtitle1" fontWeight={600} color="#164e63">
            Bank Account Details
          </Typography>
        </Stack>
        <Stack spacing={1}>
          {bank.accountHolderName && (
            <Typography variant="body2">
              <strong>Account Holder:</strong> {bank.accountHolderName}
            </Typography>
          )}
          {bank.accountNumber && (
            <Typography variant="body2">
              <strong>Account Number:</strong> {bank.accountNumber}
            </Typography>
          )}
          {bank.bankName && (
            <Typography variant="body2">
              <strong>Bank Name:</strong> {bank.bankName}
            </Typography>
          )}
          {bank.branch && (
            <Typography variant="body2">
              <strong>Branch:</strong> {bank.branch}
            </Typography>
          )}
          {bank.ifscCode && (
            <Typography variant="body2">
              <strong>IFSC Code:</strong> {bank.ifscCode}
            </Typography>
          )}
          {bank.accountType && (
            <Typography variant="body2">
              <strong>Account Type:</strong> {bank.accountType}
            </Typography>
          )}
        </Stack>
      </Paper>
    );
  };

  // Get period display
  const getPeriodDisplay = () => {
    const month = salary.payrollPeriod?.month || salary.month;
    const year = salary.payrollPeriod?.year || salary.year;
    if (!month || !year) return '-';
    return `${getMonthName(month)} ${year}`;
  };

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
      {/* HEADER */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #164e63, #00B4D8)',
          color: '#fff',
          fontSize: 20,
          fontWeight: 600,
          py: 2.5,
          px: 4
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <ReceiptIcon />
            <span>Salary Details – {getPeriodDisplay()}</span>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip 
              label={salary.paymentStatus || 'PENDING'} 
              color={getStatusColor(salary.paymentStatus)}
              size="small"
              sx={{ 
                color: '#fff', 
                fontWeight: 500,
                bgcolor: getStatusColor(salary.paymentStatus) === 'success' ? '#2e7d32' :
                        getStatusColor(salary.paymentStatus) === 'info' ? '#0288d1' :
                        getStatusColor(salary.paymentStatus) === 'primary' ? '#1976d2' :
                        getStatusColor(salary.paymentStatus) === 'warning' ? '#ed6c02' :
                        getStatusColor(salary.paymentStatus) === 'error' ? '#d32f2f' : '#757575'
              }}
            />
            <Chip 
              label={salary.employmentType || 'Monthly'} 
              variant="outlined"
              size="small"
              sx={{ color: '#fff', borderColor: '#fff' }}
            />
          </Stack>
        </Stack>
      </DialogTitle>

      {/* STEPPER */}
      <Box sx={{ px: 4, pt: 3, pb: 2, bgcolor: '#f8fafc' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ px: 4, py: 3, bgcolor: '#f8fafc' }}>

        {/* STEP 1 - Employee & Payroll */}
        {activeStep === 0 && (
          <Stack spacing={3}>
            {/* Employee Header with Avatar */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#164e63',
                    fontSize: '2rem',
                    fontWeight: 600
                  }}
                >
                  {getAvatarInitials(salary.employee?.FirstName, salary.employee?.LastName)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h5" fontWeight={600} color="#164e63">
                    {getEmployeeName()}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    Employee ID: {salary.employee?.EmployeeID || '-'}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Chip
                      icon={<PersonIcon />}
                      label={salary.employee?.Gender === 'M' ? 'Male' : 
                            salary.employee?.Gender === 'F' ? 'Female' : 'Other'}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<WorkIcon />}
                      label={getEmploymentTypeText(salary.employmentType)}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Employee Information */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#164e63' }}>
                    <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PersonIcon fontSize="small" />
                        <span>Employee Information</span>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Department</TableCell>
                    <TableCell>{salary.employee?.DepartmentID?.DepartmentName || '-'}</TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Designation</TableCell>
                    <TableCell>
                      {salary.employee?.DesignationID?.DesignationName || '-'} 
                      {salary.employee?.DesignationID?.Level && ` (Level ${salary.employee.DesignationID.Level})`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Date of Birth</TableCell>
                    <TableCell>{formatDate(salary.employee?.DateOfBirth)}</TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Date of Joining</TableCell>
                    <TableCell>{formatDate(salary.employee?.DateOfJoining)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Email</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon fontSize="small" sx={{ color: '#64748B' }} />
                        <span>{salary.employee?.Email || '-'}</span>
                      </Stack>
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Phone</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" sx={{ color: '#64748B' }} />
                        <span>{salary.employee?.Phone || '-'}</span>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Address</TableCell>
                    <TableCell colSpan={3}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationIcon fontSize="small" sx={{ color: '#64748B' }} />
                        <span>{salary.employee?.Address || '-'}</span>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Payroll Period */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#164e63' }}>
                    <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalculateIcon fontSize="small" />
                        <span>Payroll Period</span>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Month</TableCell>
                    <TableCell>{getMonthName(salary.payrollPeriod?.month || salary.month)}</TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Year</TableCell>
                    <TableCell>{salary.payrollPeriod?.year || salary.year}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Working Days</TableCell>
                    <TableCell>{salary.workingDays || 0}</TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Paid Days</TableCell>
                    <TableCell>{salary.paidDays || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Leave Days</TableCell>
                    <TableCell>{salary.leaveDays || 0}</TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>LOP Days</TableCell>
                    <TableCell>{salary.lopDays || 0}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Payment Information */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#164e63' }}>
                    <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <BankIcon fontSize="small" />
                        <span>Payment Information</span>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Payment Mode</TableCell>
                    <TableCell>{salary.paymentMode || '-'}</TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Payment Status</TableCell>
                    <TableCell>
                      <Chip
                        label={salary.paymentStatus || 'PENDING'}
                        color={getStatusColor(salary.paymentStatus)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Transaction ID</TableCell>
                    <TableCell>{salary.transactionId || '-'}</TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Cheque Number</TableCell>
                    <TableCell>{salary.chequeNumber || '-'}</TableCell>
                  </TableRow>
                  {salary.paymentDate && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Payment Date</TableCell>
                      <TableCell colSpan={3}>{formatDate(salary.paymentDate)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Bank Details */}
            {salary.employee?.BankDetails && Object.keys(salary.employee.BankDetails).length > 0 && (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#164e63' }}>
                      <TableCell colSpan={4} sx={{ color: '#fff', fontWeight: 600 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <BankIcon fontSize="small" />
                          <span>Bank Account Details</span>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salary.employee.BankDetails.accountHolderName && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Account Holder</TableCell>
                        <TableCell colSpan={3}>{salary.employee.BankDetails.accountHolderName}</TableCell>
                      </TableRow>
                    )}
                    {salary.employee.BankDetails.accountNumber && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Account Number</TableCell>
                        <TableCell>{salary.employee.BankDetails.accountNumber}</TableCell>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Account Type</TableCell>
                        <TableCell>{salary.employee.BankDetails.accountType || '-'}</TableCell>
                      </TableRow>
                    )}
                    {salary.employee.BankDetails.bankName && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Bank Name</TableCell>
                        <TableCell>{salary.employee.BankDetails.bankName}</TableCell>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Branch</TableCell>
                        <TableCell>{salary.employee.BankDetails.branch || '-'}</TableCell>
                      </TableRow>
                    )}
                    {salary.employee.BankDetails.ifscCode && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>IFSC Code</TableCell>
                        <TableCell colSpan={3}>{salary.employee.BankDetails.ifscCode}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        )}

        {/* STEP 2 - Earnings & Reimbursements */}
        {activeStep === 1 && (
          <Stack spacing={3}>
            {/* Earnings */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#164e63' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Earning Component</TableCell>
                    <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salary.earnings && Object.entries(salary.earnings).map(([key, value]) => {
                    if (value > 0) {
                      return (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500 }}>
                            {formatCurrency(value)}
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                  <TableRow sx={{ bgcolor: '#e8f5e8' }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Earnings</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.grossSalary)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Reimbursements */}
            {salary.reimbursements && Object.values(salary.reimbursements).some(v => v > 0) && (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#164e63' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Reimbursement Component</TableCell>
                      <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(salary.reimbursements).map(([key, value]) => {
                      if (value > 0) {
                        return (
                          <TableRow key={key}>
                            <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500 }}>
                              {formatCurrency(value)}
                            </TableCell>
                          </TableRow>
                        );
                      }
                      return null;
                    })}
                    <TableRow sx={{ bgcolor: '#e8f5e8' }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Reimbursements</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.totalReimbursements)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Overtime & Bonus Details */}
            {(salary.overtimeHours > 0 || salary.performanceBonus > 0 || salary.incentives > 0) && (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#164e63' }}>
                      <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Additional Earnings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salary.overtimeHours > 0 && salary.overtimeRate > 0 && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Overtime</TableCell>
                        <TableCell>{salary.overtimeHours} hrs @ {formatCurrency(salary.overtimeRate)}/hr</TableCell>
                      </TableRow>
                    )}
                    {salary.performanceBonus > 0 && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Performance Bonus</TableCell>
                        <TableCell align="right">{formatCurrency(salary.performanceBonus)}</TableCell>
                      </TableRow>
                    )}
                    {salary.incentives > 0 && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Incentives</TableCell>
                        <TableCell align="right">{formatCurrency(salary.incentives)}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        )}

        {/* STEP 3 - Deductions & Summary */}
        {activeStep === 2 && (
          <Stack spacing={3}>
            {/* Deductions */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#164e63' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Deduction Component</TableCell>
                    <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salary.deductions && Object.entries(salary.deductions).map(([key, value]) => {
                    if (value > 0) {
                      return (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500 }}>
                            {formatCurrency(value)}
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                  <TableRow sx={{ bgcolor: '#ffebee' }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Total Deductions</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(salary.totalDeductions)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Summary */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#164e63' }}>
                    <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Salary Summary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Gross Salary</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.grossSalary)}</TableCell>
                  </TableRow>
                  {salary.totalReimbursements > 0 && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Total Reimbursements</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.totalReimbursements)}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Total Deductions</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(salary.totalDeductions)}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: '#e8f5e8' }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Net Pay</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#2e7d32' }}>
                      {formatCurrency(salary.netPay)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Calculation Rules */}
            {salary.calculationRules && (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#164e63' }}>
                      <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Calculation Rules</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>HRA Percentage</TableCell>
                      <TableCell>{salary.calculationRules.hraPercentage || 50}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>PF Percentage</TableCell>
                      <TableCell>{salary.calculationRules.pfPercentage || 12}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>ESI Percentage</TableCell>
                      <TableCell>{salary.calculationRules.esiPercentage || 0.75}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Overtime Multiplier</TableCell>
                      <TableCell>{salary.calculationRules.overtimeMultiplier || 1.5}x</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Remarks & Audit Info */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#164e63' }}>
                    <TableCell colSpan={2} sx={{ color: '#fff', fontWeight: 600 }}>Additional Information</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salary.remarks && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5', width: '200px' }}>Remarks</TableCell>
                      <TableCell>{salary.remarks}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Created By</TableCell>
                    <TableCell>
                      {salary.createdBy?.Email || '-'} on {formatDate(salary.createdAt)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Last Updated</TableCell>
                    <TableCell>
                      {formatDate(salary.updatedAt)} 
                      {salary.updatedBy ? ` by ${salary.updatedBy.Email}` : ''}
                    </TableCell>
                  </TableRow>
                  {salary.version && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Version</TableCell>
                      <TableCell>{salary.version}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        )}
      </DialogContent>

      {/* ACTIONS */}
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
            Close
          </Button>
          
          <Stack direction="row" spacing={2}>
            {activeStep > 0 && (
              <Button 
                onClick={backStep}
                startIcon={<ArrowBackIcon />}
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
                onClick={nextStep}
                endIcon={<ArrowForwardIcon />}
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
                startIcon={<EditIcon />}
                onClick={() => {
                  onClose();
                  onEdit(salary);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  background: "linear-gradient(135deg, #164e63, #00B4D8)",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Edit Salary
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSalary;