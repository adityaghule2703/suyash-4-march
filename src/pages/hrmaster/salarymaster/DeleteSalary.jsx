// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Alert,
//   Stack,
//   Chip
// } from '@mui/material';
// import { Delete as DeleteIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const DeleteSalary = ({ open, onClose, salary, onDelete }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleDelete = async () => {
//     if (!salary?._id) return;

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');

//       const response = await axios.delete(
//         `${BASE_URL}/api/salaries/${salary._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (response.data.success) {
//         onDelete(salary._id);
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to delete salary');
//       }
//     } catch (err) {
//       console.error('Error deleting salary:', err);
//       setError(
//         err.response?.data?.message ||
//         'Failed to delete salary. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!salary) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 2 }
//       }}
//     >
//       {/* ===== HEADER ===== */}
//       <DialogTitle
//         sx={{
//           borderBottom: '1px solid #E0E0E0',
//           backgroundColor: '#FDEDED'
//         }}
//       >
//         <div
//           style={{
//             fontSize: '20px',
//             fontWeight: 600,
//             paddingTop: '8px'
//           }}
//         >
//           Confirm Delete Salary
//         </div>
//       </DialogTitle>

//       {/* ===== CONTENT ===== */}
//       <DialogContent sx={{ pt: 3 }}>
//         <div style={{ marginTop: '16px' }}>
//           <Stack spacing={2}>
//             <Typography variant="body1">
//               Are you sure you want to delete salary record for:
//             </Typography>

//             <Stack spacing={1}>
//               <Typography variant="body2">
//                 <strong>Employee:</strong> {salary.employeeName}
//               </Typography>

//               <Typography variant="body2">
//                 <strong>Period:</strong> {salary.periodDisplay}
//               </Typography>

//               <Typography variant="body2">
//                 <strong>Net Pay:</strong> ₹ {salary.netPay?.toLocaleString('en-IN')}
//               </Typography>

//               <Chip
//                 label={salary.paymentStatus}
//                 size="small"
//                 color={salary.paymentStatus === 'PROCESSED' ? 'success' : 'warning'}
//                 sx={{ width: 'fit-content' }}
//               />
//             </Stack>

//             <Typography
//               variant="body2"
//               color="textSecondary"
//               sx={{ mt: 1 }}
//             >
//               This action cannot be undone. The salary record will be permanently removed.
//             </Typography>

//             {error && (
//               <Alert
//                 severity="error"
//                 sx={{
//                   borderRadius: 1,
//                   '& .MuiAlert-icon': {
//                     alignItems: 'center'
//                   }
//                 }}
//               >
//                 {error}
//               </Alert>
//             )}
//           </Stack>
//         </div>
//       </DialogContent>

//       {/* ===== ACTIONS ===== */}
//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           borderTop: '1px solid #E0E0E0',
//           pt: 2,
//           backgroundColor: '#F8FAFC'
//         }}
//       >
//         <Button
//           onClick={onClose}
//           disabled={loading}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             textTransform: 'none',
//             fontWeight: 500
//           }}
//         >
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           color="error"
//           onClick={handleDelete}
//           disabled={loading}
//           startIcon={!loading && <DeleteIcon />}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             textTransform: 'none',
//             fontWeight: 500,
//             backgroundColor: '#D32F2F',
//             '&:hover': {
//               backgroundColor: '#C62828'
//             }
//           }}
//         >
//           {loading ? 'Deleting...' : 'Delete Salary'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DeleteSalary;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Stack,
  Chip,
  Avatar,
  Box,
  Divider,
  Paper,
  Grid,
  Tooltip,
  Collapse
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching the application theme
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const ERROR_GRADIENT = 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)';
const PRIMARY_BLUE = '#00B4D8';

const DeleteSalary = ({ open, onClose, salary, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = async () => {
    if (!salary?._id) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.delete(
        `${BASE_URL}/api/salaries/${salary._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        onDelete(salary._id);
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete salary');
      }
    } catch (err) {
      console.error('Error deleting salary:', err);
      setError(
        err.response?.data?.message ||
        'Failed to delete salary. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "PAID":
        return { bg: "#dcfce7", color: "#166534", border: "#86efac" };
      case "APPROVED":
        return { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" };
      case "PROCESSED":
        return { bg: "#e0f2fe", color: "#0c4a6e", border: "#bae6fd" };
      case "PENDING":
        return { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" };
      case "CANCELLED":
        return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
      default:
        return { bg: "#f1f5f9", color: "#334155", border: "#e2e8f0" };
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹ 0";
    return `₹ ${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthName = (period) => {
    if (!period) return '-';
    const month = period.month || period;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || month;
  };

  const getYear = (period) => {
    if (!period) return '';
    return period.year || '';
  };

  if (!salary) return null;

  const statusColors = getStatusColor(salary.paymentStatus);
  const canDelete = salary.paymentStatus === 'PENDING' || salary.paymentStatus === 'CANCELLED';
  const warningMessage = !canDelete 
    ? `Cannot delete salary with status "${salary.paymentStatus}". Only PENDING or CANCELLED salaries can be deleted.`
    : 'This action cannot be undone. The salary record will be permanently removed.';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      {/* ===== HEADER ===== */}
      <DialogTitle
        sx={{
          background: ERROR_GRADIENT,
          color: '#fff',
          fontWeight: 600,
          fontSize: 20,
          py: 2.5,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <DeleteIcon sx={{ fontSize: 24 }} />
        <span>Confirm Delete Salary</span>
      </DialogTitle>

      {/* ===== CONTENT ===== */}
      <DialogContent sx={{ pt: 3, px: 3, pb: 2 }}>
        <Stack spacing={3}>

          {/* Employee Summary Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: salary.employee?.Gender === 'M' ? '#164e63' : '#be185d',
                  fontSize: '1.2rem',
                  fontWeight: 600
                }}
              >
                {salary.employee?.FirstName?.charAt(0) || 'U'}
                {salary.employee?.LastName?.charAt(0) || ''}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h6" fontWeight={600} color="#164e63">
                  {salary.employeeName}
                </Typography>
                <Typography variant="body2" color="#64748B">
                  Employee ID: {salary.employee?.EmployeeID || 'N/A'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={salary.employmentType || 'Monthly'}
                    size="small"
                    sx={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '0.7rem',
                      height: 22
                    }}
                  />
                  <Chip
                    label={salary.paymentStatus}
                    size="small"
                    sx={{
                      backgroundColor: statusColors.bg,
                      color: statusColors.color,
                      border: `1px solid ${statusColors.border}`,
                      fontSize: '0.7rem',
                      height: 22
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Salary Details */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#ffffff',
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} color="#164e63" gutterBottom>
              Salary Information
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography variant="body2" color="#64748B">Period:</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={500} sx={{ ml: 3.5 }}>
                  {getMonthName(salary.payrollPeriod)} {getYear(salary.payrollPeriod)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ReceiptIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography variant="body2" color="#64748B">Days:</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={500} sx={{ ml: 3.5 }}>
                  {salary.paidDays || 0}/{salary.workingDays || 0} days
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 1.5 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="#64748B">Gross Salary:</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatCurrency(salary.grossSalary)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="#64748B">Net Pay:</Typography>
                <Typography variant="h6" fontWeight={700} color="#164e63">
                  {formatCurrency(salary.netPay)}
                </Typography>
              </Grid>
            </Grid>

            {/* Toggle Details Button */}
            <Button
              size="small"
              onClick={() => setShowDetails(!showDetails)}
              sx={{ mt: 1, textTransform: 'none', color: PRIMARY_BLUE }}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>

            {/* Additional Details */}
            <Collapse in={showDetails}>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                <Typography variant="caption" color="#64748B" display="block" gutterBottom>
                  Payment Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="#64748B" display="block">
                      Payment Mode
                    </Typography>
                    <Typography variant="body2">
                      {salary.paymentMode || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="#64748B" display="block">
                      Transaction ID
                    </Typography>
                    <Typography variant="body2">
                      {salary.transactionId || '-'}
                    </Typography>
                  </Grid>
                </Grid>
                {salary.remarks && (
                  <>
                    <Typography variant="caption" color="#64748B" display="block" sx={{ mt: 1 }}>
                      Remarks
                    </Typography>
                    <Typography variant="body2">
                      {salary.remarks}
                    </Typography>
                  </>
                )}
              </Box>
            </Collapse>
          </Paper>

          {/* Warning Messages */}
          {!canDelete ? (
            <Alert
              severity="error"
              icon={<WarningIcon />}
              sx={{
                borderRadius: 2,
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca'
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#991b1b">
                ⚠️ Cannot Delete
              </Typography>
              <Typography variant="body2" color="#991b1b">
                {warningMessage}
              </Typography>
            </Alert>
          ) : (
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{
                borderRadius: 2,
                backgroundColor: '#fff3e0',
                border: '1px solid #ffe0b2'
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#f57c00">
                ⚠️ Warning
              </Typography>
              <Typography variant="body2" color="#f57c00">
                {warningMessage}
              </Typography>
            </Alert>
          )}

          {/* Info Message */}
          <Alert
            severity="info"
            icon={<InfoIcon />}
            sx={{
              borderRadius: 2,
              backgroundColor: '#e3f2fd',
              border: '1px solid #bbdefb'
            }}
          >
            <Typography variant="body2" color="#1976d2">
              ℹ️ Deleted salary records cannot be recovered. Consider marking as cancelled instead.
            </Typography>
          </Alert>

          {/* Error Message */}
          <Collapse in={!!error}>
            <Alert
              severity="error"
              onClose={() => setError('')}
              sx={{
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          </Collapse>

        </Stack>
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'space-between'
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={<CloseIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            color: '#64748B',
            border: '1px solid #cbd5e1',
            '&:hover': {
              backgroundColor: '#f1f5f9'
            }
          }}
        >
          Cancel
        </Button>

        <Tooltip title={!canDelete ? warningMessage : ''}>
          <span>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={loading || !canDelete}
              startIcon={loading ? null : <DeleteIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#b91c1c'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#ffcdd2',
                  color: '#b71c1c'
                },
                minWidth: 140
              }}
            >
              {loading ? 'Deleting...' : 'Permanently Delete'}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSalary;
