// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, Stack, Typography, Grid, Box, Paper, Chip,
//   Alert, CircularProgress, IconButton, Avatar,
//   Stepper, Step, StepLabel, TextField, Divider
// } from '@mui/material';
// import {
//   Close as CloseIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon,
//   Warning as WarningIcon, Security as SecurityIcon, ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon, Person as PersonIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';

// const CHECK_TYPES = [
//   { type: 'identity', label: 'Identity', icon: <SecurityIcon />, color: '#1976D2' },
//   { type: 'address', label: 'Address', icon: <SecurityIcon />, color: '#2E7D32' },
//   { type: 'education', label: 'Education', icon: <SecurityIcon />, color: '#7B1FA2' },
//   { type: 'employment', label: 'Employment', icon: <SecurityIcon />, color: '#F57C00' },
//   { type: 'criminal', label: 'Criminal', icon: <SecurityIcon />, color: '#C62828' }
// ];

// const getStatusStyle = (status) => ({
//   cleared: { bg: '#d1fae5', color: '#065f46', label: 'Cleared' },
//   pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
//   failed: { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
//   completed: { bg: '#d1fae5', color: '#065f46', label: 'Completed' }
// }[status?.toLowerCase()] || { bg: '#f1f5f9', color: '#475569', label: status || 'Unknown' });

// const ApproveBGV = ({ open, onClose, onSubmit, bgvData, bgvId }) => {
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(!bgvData && bgvId);
//   const [submitting, setSubmitting] = useState(false);
//   const [bgv, setBgv] = useState(bgvData || null);
//   const [remarks, setRemarks] = useState('');
//   const [decision, setDecision] = useState('approve');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     if (open && !bgvData && bgvId) fetchBGV();
//     else setBgv(bgvData);
//   }, [open, bgvData, bgvId]);

//   const fetchBGV = async () => {
//     try {
//       const { data } = await axios.get(`${BASE_URL}/api/bgv/${bgvId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (data.success) setBgv(data.data);
//       else setError('Failed to fetch BGV details');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch BGV details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (step === 1 && !remarks.trim()) {
//       setError('Please add remarks');
//       return;
//     }
//     setError('');
//     setStep(s => s + 1);
//   };

//   const handleBack = () => setStep(s => s - 1);

//   const handleReset = () => {
//     setStep(0);
//     setRemarks('');
//     setDecision('approve');
//     setError('');
//     setSuccess('');
//   };

//   const handleClose = () => {
//     handleReset();
//     onClose();
//   };

//   const handleSubmit = async () => {
//     if (!remarks.trim()) {
//       setError('Please add remarks');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const { data } = await axios.put(
//         `${BASE_URL}/api/bgv/${bgvId}/decision`,
//         { decision, remarks: remarks.trim() },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );

//       if (data.success) {
//         setSuccess(`BGV ${decision}ed successfully!`);
//         onSubmit?.(data.data);
//         setTimeout(handleClose, 1500);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || `Failed to ${decision} BGV`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const candidate = bgv?.candidateId || bgv?.candidate;
//   const candidateName = candidate?.fullName || 
//     `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim() || 'N/A';
//   const initials = candidateName !== 'N/A' ? candidateName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?';

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ borderBottom: 1, borderColor: '#E0E0E0', bgcolor: '#F8FAFC', px: 3, py: 2 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography variant="h6" fontWeight={600}>
//               {decision === 'approve' ? 'Approve' : 'Reject'} BGV
//             </Typography>
//             <Typography variant="caption" color="textSecondary">
//               Review and make decision
//             </Typography>
//           </Box>
//           <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
//         </Box>
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3, px: 3 }}>
//         {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
//         {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

//         <Stepper activeStep={step} sx={{ mb: 3 }}>
//           {['Review', 'Remarks', 'Confirm'].map(label => (
//             <Step key={label}><StepLabel>{label}</StepLabel></Step>
//           ))}
//         </Stepper>

//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
//         ) : !bgv ? (
//           <Alert severity="info">No BGV data found</Alert>
//         ) : (
//           <Box>
//             {step === 0 && (
//               <Stack spacing={3}>
//                 <Paper sx={{ p: 2 }}>
//                   <Grid container spacing={10}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//                     <Avatar sx={{ bgcolor: '#00B4D8' }}>{initials}</Avatar>
//                     <Box>
//                       <Typography variant="body1">{candidateName}</Typography>
//                       <Typography variant="caption" color="textSecondary">{candidate?.email}</Typography>
//                     </Box>
//                   </Box>
//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="textSecondary">BGV ID</Typography>
//                       <Typography variant="body1" fontWeight={600}>{bgv.bgvId || 'N/A'}</Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="textSecondary">Status</Typography>
//                       <Chip label={bgv.status} size="small" sx={getStatusStyle(bgv.status)} />
//                     </Grid>
                    
//                   {/* <Typography variant="caption" color="textSecondary">Vendor</Typography>
//                   <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{bgv.vendor || 'Authbridge'}</Typography> */}
//                   </Grid>
//                 </Paper>

//                 <Paper sx={{ p: 2 }}>
//                   <Typography variant="subtitle2" gutterBottom>Verification Checks</Typography>
//                   <Stack spacing={1}>
//                     {CHECK_TYPES.map(check => {
//                       const c = bgv.checks?.find(c => c.type === check.type);
//                       const status = getStatusStyle(c?.status || 'pending');
//                       return (
//                         <Box key={check.type}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Box sx={{ color: check.color, display: 'flex', alignItems: 'center' }}>{check.icon}</Box>
//                               <Typography variant="body2">{check.label}</Typography>
//                             </Box>
//                             <Chip label={status.label} size="small" sx={status} />
//                           </Box>
//                         </Box>
//                       );
//                     })}
//                   </Stack>
//                 </Paper>
//               </Stack>
//             )}

//             {step === 1 && (
//               <Paper >
//                 <Typography variant="subtitle1" fontWeight={600} gutterBottom>Add Remarks</Typography>
//                 <TextField fullWidth multiline rows={2} label="Remarks *" value={remarks}
//                   onChange={e => setRemarks(e.target.value)} sx={{ mb: 3 }} />
//                 <Grid container spacing={2}>
//                   <Grid item xs={6}>
//                     <Button fullWidth variant={decision === 'approve' ? 'contained' : 'outlined'}
//                       color="success" startIcon={<ThumbUpIcon />} onClick={() => setDecision('approve')}>
//                       Approve
//                     </Button>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Button fullWidth variant={decision === 'reject' ? 'contained' : 'outlined'}
//                       color="error" startIcon={<ThumbDownIcon />} onClick={() => setDecision('reject')}>
//                       Reject
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             )}

//             {step === 2 && (
//               <Paper >
//                 <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirm Decision</Typography>
//                 <Paper sx={{ p: 2, bgcolor: '#F8FAFC', mb: 2 }}>
//                   <Grid container spacing={10}>
//                     <Grid item xs={12}><Typography variant="caption">BGV ID</Typography><Typography>{bgv.bgvId}</Typography></Grid>
//                     <Grid item xs={12}><Typography variant="caption">Candidate</Typography><Typography>{candidateName}</Typography></Grid>
//                     <Grid item xs={12}><Typography variant="caption" sx={{marginRight: "15px"}}>Decision</Typography>
//                       <Chip icon={decision === 'approve' ? <CheckCircleIcon /> : <CancelIcon />}
//                         label={decision === 'approve' ? 'Approve' : 'Reject'} color={decision === 'approve' ? 'success' : 'error'} />
//                     </Grid>
//                     <Grid item xs={12}><Typography variant="caption">Remarks</Typography><Paper sx={{ p: 1, bgcolor: '#FFF' , gap: 2}}>{remarks}</Paper></Grid>
//                   </Grid>
//                 </Paper>
//                 <Alert severity={decision === 'approve' ? 'warning' : 'error'} icon={<WarningIcon />}>
//                   This action cannot be undone.
//                 </Alert>
//               </Paper>
//             )}
//           </Box>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ p: 2, borderTop: 1, borderColor: '#E0E0E0', bgcolor: '#F8FAFC', justifyContent: 'space-between' }}>
//         <Button onClick={handleClose} variant="outlined">Cancel</Button>
//         <Box>
//           <Button disabled={step === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//           {step === 2 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={submitting || !remarks}
//               startIcon={submitting ? <CircularProgress size={20} /> : (decision === 'approve' ? <ThumbUpIcon /> : <ThumbDownIcon />)}
//               color={decision === 'approve' ? 'success' : 'error'}
//               sx={{ minWidth: 120 }}
//             >
//               {submitting ? 'Processing...' : (decision === 'approve' ? 'Approve' : 'Reject')}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={step === 0 && !bgv}
//               sx={{
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': { background: 'linear-gradient(135deg, #0e3b4a, #0096b4)' }
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

// export default ApproveBGV;


import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Divider,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

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

const CHECK_TYPES = [
  { type: 'identity', label: 'Identity', icon: <SecurityIcon sx={{ fontSize: '0.8rem' }} />, color: '#1976D2' },
  { type: 'address', label: 'Address', icon: <SecurityIcon sx={{ fontSize: '0.8rem' }} />, color: '#2E7D32' },
  { type: 'education', label: 'Education', icon: <SecurityIcon sx={{ fontSize: '0.8rem' }} />, color: '#7B1FA2' },
  { type: 'employment', label: 'Employment', icon: <SecurityIcon sx={{ fontSize: '0.8rem' }} />, color: '#F57C00' },
  { type: 'criminal', label: 'Criminal', icon: <SecurityIcon sx={{ fontSize: '0.8rem' }} />, color: '#C62828' }
];

const getStatusStyle = (status) => {
  const styles = {
    cleared: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Cleared' },
    completed: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Completed' },
    pending: { bg: COLORS.status.warning, color: '#92400E', icon: <InfoIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending' },
    failed: { bg: COLORS.status.error, color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} />, label: 'Failed' }
  };
  return styles[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <InfoIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Unknown' };
};

const steps = ['Review', 'Remarks', 'Confirm'];

const ApproveBGV = ({ open, onClose, onSubmit, bgvData, bgvId }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(!bgvData && bgvId);
  const [submitting, setSubmitting] = useState(false);
  const [bgv, setBgv] = useState(bgvData || null);
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState('approve');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (open && !bgvData && bgvId) fetchBGV();
    else setBgv(bgvData);
  }, [open, bgvData, bgvId]);

  const fetchBGV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/bgv/${bgvId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setBgv(response.data.data);
      else setError('Failed to fetch BGV details');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch BGV details');
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'remarks' && !remarks.trim()) {
      setFieldErrors(prev => ({ ...prev, remarks: 'Remarks are required' }));
    } else {
      setFieldErrors(prev => ({ ...prev, remarks: '' }));
    }
  };

  const validateStep = () => {
    if (step === 1 && !remarks.trim()) {
      setError('Please add remarks');
      setFieldErrors(prev => ({ ...prev, remarks: 'Remarks are required' }));
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => setStep(s => s - 1);

  const handleReset = () => {
    setStep(0);
    setRemarks('');
    setDecision('approve');
    setError('');
    setSuccess('');
    setFieldErrors({});
    setTouched({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!remarks.trim()) {
      setError('Please add remarks');
      setFieldErrors(prev => ({ ...prev, remarks: 'Remarks are required' }));
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/bgv/${bgvId}/decision`,
        { decision, remarks: remarks.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(`BGV ${decision}ed successfully!`);
        onSubmit?.(response.data.data);
        setTimeout(handleClose, 1500);
      } else {
        setError(response.data.message || `Failed to ${decision} BGV`);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${decision} BGV`);
    } finally {
      setSubmitting(false);
    }
  };

  const candidate = bgv?.candidateId || bgv?.candidate;
  const candidateName = candidate?.fullName || 
    `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim() || 'N/A';
  const initials = candidateName !== 'N/A' ? candidateName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?';

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
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

  return (
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedUserIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            {decision === 'approve' ? 'Approve BGV' : 'Reject BGV'}
          </Typography>
          {bgv?.bgvId && (
            <Chip
              label={bgv.bgvId}
              size="small"
              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
          </Box>
        ) : !bgv ? (
          <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>No BGV data found</Alert>
        ) : (
          <Box>
            {step === 0 && (
              <Stack spacing={2.5}>
                <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: COLORS.primary, width: 48, height: 48 }}>
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                        {candidateName}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {candidate?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ borderColor: COLORS.border, mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>BGV ID</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                        {bgv.bgvId || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Status</Typography>
                     const status = getStatusStyle(bgv.status);

<Chip
  icon={status.icon}
  label={status.label}
  size="small"
  sx={{
    bgcolor: status.bg,
    color: status.color,
    fontWeight: 500,
    fontSize: '0.65rem',
    height: 24,
    '& .MuiChip-icon': { color: status.color }
  }}
/>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <SecurityIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                      Verification Checks
                    </Typography>
                  </Box>
                  <Stack spacing={1.5}>
                    {CHECK_TYPES.map(check => {
                      const c = bgv.checks?.find(c => c.type === check.type);
                      const status = getStatusStyle(c?.status || 'pending');
                      return (
                        <Paper key={check.type} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ color: check.color }}>{check.icon}</Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                                {check.label}
                              </Typography>
                            </Box>
                            <Chip
                              icon={status.icon}
                              label={status.label}
                              size="small"
                              sx={{
                                bgcolor: status.bg,
                                color: status.color,
                                fontWeight: 500,
                                fontSize: '0.65rem',
                                height: 24,
                                '& .MuiChip-icon': { fontSize: '0.7rem', color: status.color }
                              }}
                            />
                          </Box>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Paper>
              </Stack>
            )}

            {step === 1 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                  Add Remarks
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Remarks *"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  onBlur={() => handleBlur('remarks')}
                  error={touched.remarks && !!fieldErrors.remarks}
                  helperText={touched.remarks ? fieldErrors.remarks : 'Please provide your remarks for this decision'}
                  placeholder="Enter your comments and justification for this decision..."
                  sx={inputStyle}
                />

                <Divider sx={{ borderColor: COLORS.border, my: 2 }} />

                <Typography sx={labelStyle}>Decision</Typography>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant={decision === 'approve' ? 'contained' : 'outlined'}
                      onClick={() => setDecision('approve')}
                      startIcon={<ThumbUpIcon sx={{ fontSize: '0.9rem' }} />}
                      sx={{
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: decision === 'approve' ? '#2E7D32' : 'transparent',
                        borderColor: '#2E7D32',
                        color: decision === 'approve' ? COLORS.text.light : '#2E7D32',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: decision === 'approve' ? '#1B5E20' : 'rgba(46, 125, 50, 0.04)'
                        }
                      }}
                    >
                      Approve
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant={decision === 'reject' ? 'contained' : 'outlined'}
                      onClick={() => setDecision('reject')}
                      startIcon={<ThumbDownIcon sx={{ fontSize: '0.9rem' }} />}
                      sx={{
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: decision === 'reject' ? '#EF4444' : 'transparent',
                        borderColor: '#EF4444',
                        color: decision === 'reject' ? COLORS.text.light : '#EF4444',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: decision === 'reject' ? '#DC2626' : 'rgba(239, 68, 68, 0.04)'
                        }
                      }}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {step === 2 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                  Confirm Decision
                </Typography>
                <Box sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}`, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>BGV ID</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: COLORS.text.primary }}>
                        {bgv.bgvId}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>Candidate</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {candidateName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>Decision</Typography>
                      <Chip
                        icon={decision === 'approve' ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <CancelIcon sx={{ fontSize: '0.7rem' }} />}
                        label={decision === 'approve' ? 'Approve' : 'Reject'}
                        size="small"
                        sx={{
                          bgcolor: decision === 'approve' ? COLORS.status.success : COLORS.status.error,
                          color: decision === 'approve' ? COLORS.primaryDark : '#991B1B',
                          fontWeight: 500,
                          fontSize: '0.65rem',
                          height: 24
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>Remarks</Typography>
                      <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {remarks}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
                <Alert 
                  severity={decision === 'approve' ? 'info' : 'error'} 
                  icon={<WarningIcon sx={{ fontSize: '0.9rem' }} />}
                  sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                >
                  This action cannot be undone.
                </Alert>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            disabled={step === 0}
            onClick={handleBack}
            startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
            }}
          >
            Back
          </Button>
          {step === 2 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !remarks.trim()}
              startIcon={submitting ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : (decision === 'approve' ? <ThumbUpIcon sx={{ fontSize: '1rem' }} /> : <ThumbDownIcon sx={{ fontSize: '1rem' }} />)}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: decision === 'approve' ? '#2E7D32' : '#EF4444',
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 100,
                '&:hover': {
                  bgcolor: decision === 'approve' ? '#1B5E20' : '#DC2626'
                }
              }}
            >
              {submitting ? 'Processing...' : (decision === 'approve' ? 'Approve' : 'Reject')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={step === 0 && !bgv}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
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

export default ApproveBGV;