// import React from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   Chip,
//   Divider,
//   Avatar,
//   Box,
//   Grid,
//   Paper
// } from '@mui/material';
// import { 
//   Edit as EditIcon, 
//   Email, 
//   Phone, 
//   Home, 
//   Cake, 
//   Work, 
//   Business, 
//   Person,
//   Badge,
//   Numbers,
//   LocationOn,
//   AccountBalance,
//   Emergency,
//   AttachMoney,
//   Speed,
//   Factory
// } from '@mui/icons-material';

// const ViewEmployees = ({ open, onClose, employee, onEdit }) => {
//   if (!employee) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return '-';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Updated status handling based on schema
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'success';
//       case 'resigned': return 'default';
//       case 'terminated': return 'error';
//       case 'retired': return 'warning';
//       default: return 'default';
//     }
//   };

//   const getStatusText = (status) => {
//     switch(status) {
//       case 'active': return 'Active';
//       case 'resigned': return 'Resigned';
//       case 'terminated': return 'Terminated';
//       case 'retired': return 'Retired';
//       default: return status;
//     }
//   };

//   const getGenderText = (gender) => {
//     if (gender === 'M') return 'Male';
//     if (gender === 'F') return 'Female';
//     if (gender === 'O') return 'Other';
//     return gender;
//   };

//   const getEmploymentTypeText = (type) => {
//     switch(type) {
//       case 'Monthly': return 'Monthly Salary';
//       case 'Hourly': return 'Hourly Wage';
//       case 'PieceRate': return 'Piece Rate';
//       default: return type;
//     }
//   };

//   const getPayStructureTypeText = (type) => {
//     switch(type) {
//       case 'Fixed': return 'Fixed';
//       case 'Variable': return 'Variable';
//       case 'Commission': return 'Commission';
//       case 'PieceRate': return 'Piece Rate';
//       default: return type;
//     }
//   };

//   const getSkillLevelText = (level) => {
//     switch(level) {
//       case 'Unskilled': return 'Unskilled';
//       case 'Semi-Skilled': return 'Semi-Skilled';
//       case 'Skilled': return 'Skilled';
//       case 'Highly Skilled': return 'Highly Skilled';
//       default: return level;
//     }
//   };

//   const getAvatarInitials = (firstName, lastName) => {
//     const first = firstName ? firstName.charAt(0) : '';
//     const last = lastName ? lastName.charAt(0) : '';
//     return `${first}${last}`.toUpperCase() || 'U';
//   };

//   const renderInfoItem = (icon, label, value, customFormatter = null) => (
//     <Stack direction="row" spacing={1.5} alignItems="flex-start">
//       <Box sx={{ color: 'text.secondary', minWidth: 24, mt: 0.3 }}>
//         {icon}
//       </Box>
//       <Box>
//         <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
//           {label}
//         </Typography>
//         <Typography variant="body2" sx={{ fontWeight: value ? 500 : 400, color: value ? 'text.primary' : 'text.disabled' }}>
//           {customFormatter ? customFormatter(value) : (value || '-')}
//         </Typography>
//       </Box>
//     </Stack>
//   );

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="lg" 
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 2, maxHeight: '90vh' }
//       }}
//     >
//       <DialogTitle sx={{ 
//         borderBottom: '1px solid #E0E0E0', 
//         pb: 2,
//         backgroundColor: '#F8FAFC'
//       }}>
//         <div style={{ 
//           fontSize: '20px', 
//           fontWeight: '600', 
//           color: '#101010',
//           paddingTop: '8px'
//         }}>
//           Employee Details
//         </div>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3, overflowY: 'auto' }}>
//         <Stack spacing={3}>
//           {/* Header Section with Avatar and Basic Info */}
//           <div style={{ marginTop: '16px' }}>
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
//               <Avatar sx={{ 
//                 width: 100, 
//                 height: 100, 
//                 bgcolor: '#1976D2',
//                 fontSize: '2rem',
//                 fontWeight: 500
//               }}>
//                 {getAvatarInitials(employee.FirstName, employee.LastName)}
//               </Avatar>
//               <Box flex={1}>
//                 <Typography variant="h5" fontWeight={600} color="#101010" gutterBottom>
//                   {employee.FirstName} {employee.LastName}
//                 </Typography>
//                 <Typography variant="body1" color="textSecondary" gutterBottom>
//                   Employee ID: {employee.EmployeeID || 'N/A'}
//                 </Typography>
//                 <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
//                   <Chip
//                     label={getStatusText(employee.EmploymentStatus)}
//                     size="small"
//                     color={getStatusColor(employee.EmploymentStatus)}
//                     sx={{ 
//                       fontWeight: 500,
//                       '&.MuiChip-colorSuccess': {
//                         bgcolor: '#E8F5E9',
//                         color: '#2E7D32'
//                       },
//                       '&.MuiChip-colorWarning': {
//                         bgcolor: '#FFF3E0',
//                         color: '#F57C00'
//                       },
//                       '&.MuiChip-colorError': {
//                         bgcolor: '#FFEBEE',
//                         color: '#D32F2F'
//                       },
//                       '&.MuiChip-colorDefault': {
//                         bgcolor: '#F5F5F5',
//                         color: '#616161'
//                       }
//                     }}
//                   />
//                   <Chip
//                     label={getGenderText(employee.Gender)}
//                     size="small"
//                     variant="outlined"
//                   />
//                   <Chip
//                     label={getEmploymentTypeText(employee.EmploymentType)}
//                     size="small"
//                     variant="outlined"
//                     color="primary"
//                   />
//                 </Stack>
//               </Box>
//             </Stack>
//           </div>
          
//           <Divider />
          
//           {/* Personal Information Section */}
//           <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//             <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Person fontSize="small" /> Personal Information
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6} md={4}>
//                 {renderInfoItem(<Cake fontSize="small" />, 'Date of Birth', formatDate(employee.DateOfBirth))}
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 {renderInfoItem(<Email fontSize="small" />, 'Email', employee.Email)}
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 {renderInfoItem(<Phone fontSize="small" />, 'Phone', employee.Phone)}
//               </Grid>
//               <Grid item xs={12}>
//                 {renderInfoItem(<Home fontSize="small" />, 'Address', employee.Address)}
//               </Grid>
//             </Grid>
//           </Paper>
          
//           {/* Employment Information Section */}
//           <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//             <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Work fontSize="small" /> Employment Information
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6} md={4}>
//                 {renderInfoItem(<Business fontSize="small" />, 'Department', employee.DepartmentID?.DepartmentName)}
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 {renderInfoItem(<Work fontSize="small" />, 'Designation', 
//                   employee.DesignationID ? `${employee.DesignationID.DesignationName} (Level ${employee.DesignationID.Level})` : '-'
//                 )}
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 {renderInfoItem(<Person fontSize="small" />, 'Date of Joining', formatDate(employee.DateOfJoining))}
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 {renderInfoItem(<Numbers fontSize="small" />, 'Employment Type', getEmploymentTypeText(employee.EmploymentType))}
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 {renderInfoItem(<AttachMoney fontSize="small" />, 'Pay Structure', getPayStructureTypeText(employee.PayStructureType))}
//               </Grid>
              
//               {/* Employment Type Specific Fields */}
//               {employee.EmploymentType === 'Monthly' && (
//                 <Grid item xs={12} sm={6} md={4}>
//                   {renderInfoItem(<AttachMoney fontSize="small" />, 'Basic Salary', 
//                     (val) => formatCurrency(val) + '/month', employee.BasicSalary
//                   )}
//                 </Grid>
//               )}
              
//               {employee.EmploymentType === 'Hourly' && (
//                 <Grid item xs={12} sm={6} md={4}>
//                   {renderInfoItem(<AttachMoney fontSize="small" />, 'Hourly Rate', 
//                     (val) => formatCurrency(val) + '/hr', employee.HourlyRate
//                   )}
//                 </Grid>
//               )}
              
//               {(employee.EmploymentType === 'Monthly' || employee.EmploymentType === 'Hourly') && employee.OvertimeRateMultiplier && (
//                 <Grid item xs={12} sm={6} md={4}>
//                   {renderInfoItem(<Speed fontSize="small" />, 'Overtime Multiplier', 
//                     (val) => `${val}x`, employee.OvertimeRateMultiplier
//                   )}
//                 </Grid>
//               )}
//             </Grid>
//           </Paper>

//           {/* Work Details Section */}
//           {(employee.SkillLevel || employee.WorkStation || employee.LineNumber) && (
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Factory fontSize="small" /> Work Details
//               </Typography>
//               <Grid container spacing={3}>
//                 {employee.SkillLevel && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Badge fontSize="small" />, 'Skill Level', getSkillLevelText(employee.SkillLevel))}
//                   </Grid>
//                 )}
//                 {employee.WorkStation && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<LocationOn fontSize="small" />, 'Work Station', employee.WorkStation)}
//                   </Grid>
//                 )}
//                 {employee.LineNumber && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Numbers fontSize="small" />, 'Line Number', employee.LineNumber)}
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>
//           )}

//           {/* Tax & Identification Section */}
//           {(employee.PAN || employee.AadharNumber || employee.PFNumber || employee.UAN || employee.ESINumber) && (
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Badge fontSize="small" /> Tax & Identification
//               </Typography>
//               <Grid container spacing={3}>
//                 {employee.PAN && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Badge fontSize="small" />, 'PAN', employee.PAN)}
//                   </Grid>
//                 )}
//                 {employee.AadharNumber && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Badge fontSize="small" />, 'Aadhar Number', employee.AadharNumber)}
//                   </Grid>
//                 )}
//                 {employee.PFNumber && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Badge fontSize="small" />, 'PF Number', employee.PFNumber)}
//                   </Grid>
//                 )}
//                 {employee.UAN && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Badge fontSize="small" />, 'UAN', employee.UAN)}
//                   </Grid>
//                 )}
//                 {employee.ESINumber && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Badge fontSize="small" />, 'ESI Number', employee.ESINumber)}
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>
//           )}

//           {/* Bank Details Section */}
//           {employee.BankDetails && Object.keys(employee.BankDetails).some(key => employee.BankDetails[key]) && (
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <AccountBalance fontSize="small" /> Bank Details
//               </Typography>
//               <Grid container spacing={3}>
//                 {employee.BankDetails.accountNumber && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<AccountBalance fontSize="small" />, 'Account Number', employee.BankDetails.accountNumber)}
//                   </Grid>
//                 )}
//                 {employee.BankDetails.accountHolderName && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Person fontSize="small" />, 'Account Holder', employee.BankDetails.accountHolderName)}
//                   </Grid>
//                 )}
//                 {employee.BankDetails.bankName && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Business fontSize="small" />, 'Bank Name', employee.BankDetails.bankName)}
//                   </Grid>
//                 )}
//                 {employee.BankDetails.branch && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<LocationOn fontSize="small" />, 'Branch', employee.BankDetails.branch)}
//                   </Grid>
//                 )}
//                 {employee.BankDetails.ifscCode && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Numbers fontSize="small" />, 'IFSC Code', employee.BankDetails.ifscCode)}
//                   </Grid>
//                 )}
//                 {employee.BankDetails.accountType && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Badge fontSize="small" />, 'Account Type', employee.BankDetails.accountType)}
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>
//           )}

//           {/* Emergency Contact Section */}
//           {employee.EmergencyContact && Object.keys(employee.EmergencyContact).some(key => employee.EmergencyContact[key]) && (
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Emergency fontSize="small" /> Emergency Contact
//               </Typography>
//               <Grid container spacing={3}>
//                 {employee.EmergencyContact.name && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Person fontSize="small" />, 'Contact Name', employee.EmergencyContact.name)}
//                   </Grid>
//                 )}
//                 {employee.EmergencyContact.relationship && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Badge fontSize="small" />, 'Relationship', employee.EmergencyContact.relationship)}
//                   </Grid>
//                 )}
//                 {employee.EmergencyContact.phone && (
//                   <Grid item xs={12} sm={6} md={4}>
//                     {renderInfoItem(<Phone fontSize="small" />, 'Phone', employee.EmergencyContact.phone)}
//                   </Grid>
//                 )}
//                 {employee.EmergencyContact.address && (
//                   <Grid item xs={12}>
//                     {renderInfoItem(<Home fontSize="small" />, 'Address', employee.EmergencyContact.address)}
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>
//           )}
          
//           {/* System Information Section */}
//           <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//             <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Numbers fontSize="small" /> System Information
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 {renderInfoItem(<Numbers fontSize="small" />, 'Created At', formatDate(employee.CreatedAt))}
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 {renderInfoItem(<Numbers fontSize="small" />, 'Last Updated', formatDate(employee.UpdatedAt))}
//               </Grid>
//               {employee._id && (
//                 <Grid item xs={12}>
//                   <Typography variant="caption" color="textSecondary">
//                     Internal ID: {employee._id}
//                   </Typography>
//                 </Grid>
//               )}
//             </Grid>
//           </Paper>
//         </Stack>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         px: 3, 
//         pb: 3, 
//         borderTop: '1px solid #E0E0E0', 
//         pt: 2,
//         backgroundColor: '#F8FAFC'
//       }}>
//         <Button 
//           onClick={onClose}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500
//           }}
//         >
//           Close
//         </Button>
//         <Button
//           variant="contained"
//           onClick={() => {
//             onClose();
//             onEdit(employee);
//           }}
//           startIcon={<EditIcon />}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500,
//             backgroundColor: '#1976D2',
//             '&:hover': {
//               backgroundColor: '#1565C0'
//             }
//           }}
//         >
//           Edit Employee
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewEmployees;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Divider,
  Avatar,
  Box,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Email, 
  Phone, 
  Home, 
  Cake, 
  Work, 
  Business, 
  Person,
  Badge,
  Numbers,
  LocationOn,
  AccountBalance,
  Emergency,
  AttachMoney,
  Speed,
  Factory,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Color constants
const PRIMARY_BLUE = '#00B4D8';
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';

// Custom styled connector for stepper
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    height: 4,
    border: 0,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  '&.Mui-active .MuiStepConnector-line': {
    background: HEADER_GRADIENT,
  },
  '&.Mui-completed .MuiStepConnector-line': {
    background: HEADER_GRADIENT,
  },
}));

const steps = ['Personal Info', 'Employment', 'Work & Tax', 'Bank & Emergency'];

const ViewEmployees = ({ open, onClose, employee, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'resigned': return 'default';
      case 'terminated': return 'error';
      case 'retired': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'resigned': return 'Resigned';
      case 'terminated': return 'Terminated';
      case 'retired': return 'Retired';
      default: return status;
    }
  };

  const getGenderText = (gender) => {
    if (gender === 'M') return 'Male';
    if (gender === 'F') return 'Female';
    if (gender === 'O') return 'Other';
    return gender;
  };

  const getEmploymentTypeText = (type) => {
    switch(type) {
      case 'Monthly': return 'Monthly Salary';
      case 'Hourly': return 'Hourly Wage';
      case 'PieceRate': return 'Piece Rate';
      default: return type;
    }
  };

  const getPayStructureTypeText = (type) => {
    switch(type) {
      case 'Fixed': return 'Fixed';
      case 'Variable': return 'Variable';
      case 'Commission': return 'Commission';
      case 'PieceRate': return 'Piece Rate';
      default: return type;
    }
  };

  const getSkillLevelText = (level) => {
    switch(level) {
      case 'Unskilled': return 'Unskilled';
      case 'Semi-Skilled': return 'Semi-Skilled';
      case 'Skilled': return 'Skilled';
      case 'Highly Skilled': return 'Highly Skilled';
      default: return level;
    }
  };

  const getAvatarInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  // Fixed renderInfoItem function - now accepts value and optional formatter
  const renderInfoItem = (icon, label, value, formatter = null) => {
    const displayValue = formatter ? formatter(value) : (value || '-');
    
    return (
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box sx={{ color: 'text.secondary', minWidth: 24, mt: 0.3 }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ 
            fontWeight: value ? 500 : 400, 
            color: value ? 'text.primary' : 'text.disabled',
            wordBreak: 'break-word'
          }}>
            {displayValue}
          </Typography>
        </Box>
      </Stack>
    );
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Render content based on active step
  const renderStepContent = () => {
    switch(activeStep) {
      case 0: // Personal Info
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem(<Cake fontSize="small" />, 'Date of Birth', formatDate(employee.DateOfBirth))}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem(<Email fontSize="small" />, 'Email', employee.Email)}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem(<Phone fontSize="small" />, 'Phone', employee.Phone)}
            </Grid>
            <Grid item xs={12}>
              {renderInfoItem(<Home fontSize="small" />, 'Address', employee.Address)}
            </Grid>
          </Grid>
        );

      case 1: // Employment
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem(<Business fontSize="small" />, 'Department', employee.DepartmentID?.DepartmentName)}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem(<Work fontSize="small" />, 'Designation', 
                employee.DesignationID ? `${employee.DesignationID.DesignationName} (Level ${employee.DesignationID.Level})` : '-'
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem(<Person fontSize="small" />, 'Date of Joining', formatDate(employee.DateOfJoining))}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem(<Numbers fontSize="small" />, 'Employment Type', getEmploymentTypeText(employee.EmploymentType))}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem(<AttachMoney fontSize="small" />, 'Pay Structure', getPayStructureTypeText(employee.PayStructureType))}
            </Grid>
            
            {/* Employment Type Specific Fields */}
            {employee.EmploymentType === 'Monthly' && (
              <Grid item xs={12} sm={6} md={4}>
                {renderInfoItem(<AttachMoney fontSize="small" />, 'Basic Salary', 
                  employee.BasicSalary,
                  (val) => formatCurrency(val) + '/month'
                )}
              </Grid>
            )}
            
            {employee.EmploymentType === 'Hourly' && (
              <Grid item xs={12} sm={6} md={4}>
                {renderInfoItem(<AttachMoney fontSize="small" />, 'Hourly Rate', 
                  employee.HourlyRate,
                  (val) => formatCurrency(val) + '/hr'
                )}
              </Grid>
            )}
            
            {(employee.EmploymentType === 'Monthly' || employee.EmploymentType === 'Hourly') && employee.OvertimeRateMultiplier && (
              <Grid item xs={12} sm={6} md={4}>
                {renderInfoItem(<Speed fontSize="small" />, 'Overtime Multiplier', 
                  employee.OvertimeRateMultiplier,
                  (val) => `${val}x`
                )}
              </Grid>
            )}
          </Grid>
        );

      case 2: // Work & Tax
        return (
          <>
            {/* Work Details */}
            {(employee.SkillLevel || employee.WorkStation || employee.LineNumber) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Factory fontSize="small" /> Work Details
                </Typography>
                <Grid container spacing={3}>
                  {employee.SkillLevel && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Badge fontSize="small" />, 'Skill Level', getSkillLevelText(employee.SkillLevel))}
                    </Grid>
                  )}
                  {employee.WorkStation && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<LocationOn fontSize="small" />, 'Work Station', employee.WorkStation)}
                    </Grid>
                  )}
                  {employee.LineNumber && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Numbers fontSize="small" />, 'Line Number', employee.LineNumber)}
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Tax & Identification */}
            {(employee.PAN || employee.AadharNumber || employee.PFNumber || employee.UAN || employee.ESINumber) && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge fontSize="small" /> Tax & Identification
                </Typography>
                <Grid container spacing={3}>
                  {employee.PAN && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Badge fontSize="small" />, 'PAN', employee.PAN)}
                    </Grid>
                  )}
                  {employee.AadharNumber && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Badge fontSize="small" />, 'Aadhar Number', employee.AadharNumber)}
                    </Grid>
                  )}
                  {employee.PFNumber && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Badge fontSize="small" />, 'PF Number', employee.PFNumber)}
                    </Grid>
                  )}
                  {employee.UAN && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Badge fontSize="small" />, 'UAN', employee.UAN)}
                    </Grid>
                  )}
                  {employee.ESINumber && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Badge fontSize="small" />, 'ESI Number', employee.ESINumber)}
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </>
        );

      case 3: // Bank & Emergency
        return (
          <>
            {/* Bank Details */}
            {employee.BankDetails && Object.keys(employee.BankDetails).some(key => employee.BankDetails[key]) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance fontSize="small" /> Bank Details
                </Typography>
                <Grid container spacing={3}>
                  {employee.BankDetails.accountNumber && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<AccountBalance fontSize="small" />, 'Account Number', employee.BankDetails.accountNumber)}
                    </Grid>
                  )}
                  {employee.BankDetails.accountHolderName && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Person fontSize="small" />, 'Account Holder', employee.BankDetails.accountHolderName)}
                    </Grid>
                  )}
                  {employee.BankDetails.bankName && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Business fontSize="small" />, 'Bank Name', employee.BankDetails.bankName)}
                    </Grid>
                  )}
                  {employee.BankDetails.branch && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<LocationOn fontSize="small" />, 'Branch', employee.BankDetails.branch)}
                    </Grid>
                  )}
                  {employee.BankDetails.ifscCode && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Numbers fontSize="small" />, 'IFSC Code', employee.BankDetails.ifscCode)}
                    </Grid>
                  )}
                  {employee.BankDetails.accountType && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Badge fontSize="small" />, 'Account Type', employee.BankDetails.accountType)}
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Emergency Contact */}
            {employee.EmergencyContact && Object.keys(employee.EmergencyContact).some(key => employee.EmergencyContact[key]) && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Emergency fontSize="small" /> Emergency Contact
                </Typography>
                <Grid container spacing={3}>
                  {employee.EmergencyContact.name && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Person fontSize="small" />, 'Contact Name', employee.EmergencyContact.name)}
                    </Grid>
                  )}
                  {employee.EmergencyContact.relationship && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Badge fontSize="small" />, 'Relationship', employee.EmergencyContact.relationship)}
                    </Grid>
                  )}
                  {employee.EmergencyContact.phone && (
                    <Grid item xs={12} sm={6} md={4}>
                      {renderInfoItem(<Phone fontSize="small" />, 'Phone', employee.EmergencyContact.phone)}
                    </Grid>
                  )}
                  {employee.EmergencyContact.address && (
                    <Grid item xs={12}>
                      {renderInfoItem(<Home fontSize="small" />, 'Address', employee.EmergencyContact.address)}
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </>
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
      borderRadius: 3,
      maxHeight: "92vh",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
    }
  }}
>
  <DialogTitle
    sx={{
      borderBottom: "1px solid #e2e8f0",
      py: 2,
      px: 3,
      background: HEADER_GRADIENT,
      color: "#fff"
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={1} alignItems="center">
        <ReceiptIcon />
        <Typography variant="h6" fontWeight={600}>
          Employee Details
        </Typography>
      </Stack>

      <Chip
        label={`ID: ${employee.EmployeeID || "N/A"}`}
        size="small"
        sx={{
          bgcolor: "rgba(255,255,255,0.15)",
          color: "#fff",
          fontWeight: 500
        }}
      />
    </Stack>
  </DialogTitle>

  <DialogContent
    sx={{
      pt: 3,
      px: 4,
      mt: 2,
      overflowY: "auto",
      background: "#f8fafc"
    }}
  >
    <Stack spacing={2}>
      {/* Avatar + Name */}
      <Paper
  elevation={0}
  sx={{
    p: 2,
    borderRadius: 2,
    border: "1px solid #e2e8f0",
    bgcolor: "#fff"
  }}
>
  <Grid container alignItems="center" spacing={4}>
    
    {/* Avatar */}
    <Grid item>
      <Avatar
        sx={{
          width: 60,
          height: 60,
          fontSize: "1.5rem",
          fontWeight: 700,
          bgcolor:
            employee.Gender === "M"
              ? "#164e63"
              : employee.Gender === "F"
              ? "#be185d"
              : "#7c3aed",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        {getAvatarInitials(employee.FirstName, employee.LastName)}
      </Avatar>
    </Grid>

    {/* Name + ID */}
    <Grid item xs>
      <Typography variant="h6" fontWeight={600} color="#164e63">
        {employee.FirstName} {employee.LastName}
      </Typography>

      <Typography variant="body2" color="#64748B">
        Employee ID: {employee.EmployeeID || "N/A"}
      </Typography>
    </Grid>

    {/* Status Chips */}
    <Grid item>
      <Stack direction="row" spacing={3}>
        <Chip
          label={getStatusText(employee.EmploymentStatus)}
          size="small"
          color={getStatusColor(employee.EmploymentStatus)}
        />

        <Chip
          label={getGenderText(employee.Gender)}
          size="small"
          variant="outlined"
        />

        <Chip
          label={getEmploymentTypeText(employee.EmploymentType)}
          size="small"
          sx={{
            bgcolor: "#e0f2fe",
            color: "#075985",
            fontWeight: 500
          }}
        />
      </Stack>
    </Grid>

  </Grid>
</Paper>

      {/* Stepper */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          bgcolor: "#fff"
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography variant="caption" fontWeight={600}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          minHeight: 300
        }}
      >
        {renderStepContent()}
      </Paper>

      {/* System Info */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          bgcolor: "#f1f5f9"
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <Typography variant="caption" color="#64748B">
              Created: {formatDate(employee.CreatedAt)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={5}>
            <Typography variant="caption" color="#64748B">
              Updated: {formatDate(employee.UpdatedAt)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Tooltip title="Internal ID">
              <Chip
                label="System Info"
                size="small"
                icon={<InfoIcon />}
                variant="outlined"
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  </DialogContent>

  <DialogActions
  sx={{
    px: 3,
    py: 2,
    borderTop: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  {/* BACK BUTTON */}
  <Button
    onClick={handleBack}
    disabled={activeStep === 0}
    startIcon={<ArrowBackIcon />}
    sx={{
      textTransform: "none",
      fontWeight: 500,
      color: activeStep === 0 ? "#cbd5e1" : "#475569"
    }}
  >
    BACK
  </Button>

  {/* RIGHT SIDE BUTTONS */}
  <Stack direction="row" spacing={2}>
    
    <Button
      onClick={onClose}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        color: "#475569"
      }}
    >
      CLOSE
    </Button>

    <Button
      variant="contained"
      onClick={handleNext}
      disabled={activeStep === steps.length - 1}
      endIcon={<ArrowForwardIcon />}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        px: 3,
        borderRadius: 1,
        background: HEADER_GRADIENT,
        "&:hover": {
          opacity: 0.9,
          background: HEADER_GRADIENT
        }
      }}
    >
      NEXT
    </Button>

  </Stack>
</DialogActions>
</Dialog>
  );
};

export default ViewEmployees;