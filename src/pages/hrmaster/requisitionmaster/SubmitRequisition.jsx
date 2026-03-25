// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   Alert,
//   CircularProgress,
//   Chip
// } from '@mui/material';
// import {
//   Send as SendIcon,
//   Close as CloseIcon,
//   Warning as WarningIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const SubmitRequisition = ({ 
//   open, 
//   onClose, 
//   requisitionId, 
//   requisitionData,
//   onSubmitSuccess 
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const token = localStorage.getItem('token');
      
//       // ✅ Using PUT method as per your backend
//       const response = await axios.put(
//         `${BASE_URL}/api/requisitions/${requisitionId}/submit`,
//         {}, // Empty body for submit
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setSuccess('Requisition submitted successfully!');
//         setTimeout(() => {
//           onClose();
//           if (onSubmitSuccess) onSubmitSuccess(response.data.data);
//         }, 1500);
//       } else {
//         setError(response.data.message || 'Failed to submit requisition');
//       }
//     } catch (err) {
//       console.error('Error submitting requisition:', err);
//       setError(err.response?.data?.message || 'Failed to submit requisition. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <SendIcon sx={{ color: '#1976D2' }} />
//           <Typography variant="h6">Submit Requisition</Typography>
//           {requisitionData?.requisitionId && (
//             <Chip 
//               label={requisitionData.requisitionId} 
//               size="small"
//               sx={{ ml: 1, backgroundColor: '#E3F2FD', color: '#1976D2' }}
//             />
//           )}
//         </Box>
//       </DialogTitle>

//       <DialogContent>
//         <Box sx={{ py: 2 }}>
//           <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
//             <Typography variant="body2">
//               Are you sure you want to submit this requisition for approval?
//             </Typography>
//             <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
//               Once submitted, it cannot be edited until reviewed by approvers.
//             </Typography>
//           </Alert>

//           {error && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert severity="success" sx={{ mt: 2 }}>
//               {success}
//             </Alert>
//           )}
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ p: 2, pt: 0 }}>
//         <Button 
//           onClick={onClose} 
//           disabled={loading}
//           startIcon={<CloseIcon />}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
//           sx={{
//             backgroundColor: '#1976D2',
//             '&:hover': { backgroundColor: '#1565C0' }
//           }}
//         >
//           {loading ? 'Submitting...' : 'Submit Requisition'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default SubmitRequisition;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Stack,
  Paper
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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

const SubmitRequisition = ({ 
  open, 
  onClose, 
  requisitionId, 
  requisitionData,
  onSubmitSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${BASE_URL}/api/requisitions/${requisitionId}/submit`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Requisition submitted successfully!');
        setTimeout(() => {
          onClose();
          if (onSubmitSuccess) onSubmitSuccess(response.data.data);
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to submit requisition');
      }
    } catch (err) {
      console.error('Error submitting requisition:', err);
      setError(err.response?.data?.message || 'Failed to submit requisition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          <SendIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Submit Requisition
          </Typography>
          {requisitionData?.requisitionId && (
            <Chip
              label={requisitionData.requisitionId}
              size="small"
              sx={{
                bgcolor: COLORS.primaryLight,
                color: COLORS.primaryDark,
                fontWeight: 500,
                fontSize: '0.65rem',
                height: 24
              }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Requisition Summary */}
          {requisitionData && (
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.primary}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AssignmentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Requisition Summary
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Position Title:
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {requisitionData.positionTitle || 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Department:
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {requisitionData.department || 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    No. of Positions:
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {requisitionData.noOfPositions || 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Priority:
                  </Typography>
                  <Chip
                    label={requisitionData.priority || 'Medium'}
                    size="small"
                    sx={{
                      bgcolor: requisitionData.priority === 'High' ? COLORS.status.error :
                               requisitionData.priority === 'Medium' ? COLORS.status.warning :
                               requisitionData.priority === 'Low' ? COLORS.status.success : COLORS.status.info,
                      color: requisitionData.priority === 'High' ? '#991B1B' :
                             requisitionData.priority === 'Medium' ? '#92400E' :
                             requisitionData.priority === 'Low' ? COLORS.primaryDark : COLORS.primaryDark,
                      fontSize: '0.65rem',
                      height: 24
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>
          )}

          <Alert 
            severity="warning" 
            icon={<WarningIcon sx={{ fontSize: '0.9rem' }} />}
            sx={{ 
              borderRadius: 1.5,
              '& .MuiAlert-icon': { fontSize: '1rem', alignItems: 'center' },
              fontSize: '0.75rem'
            }}
          >
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
              Are you sure you want to submit this requisition for approval?
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Once submitted, it cannot be edited until reviewed by approvers.
            </Typography>
          </Alert>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {success}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
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
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <SendIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Submitting...' : 'Submit Requisition'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitRequisition;