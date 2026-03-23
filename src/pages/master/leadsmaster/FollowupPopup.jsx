// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   Box,
//   Stack,
//   Paper,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   Alert,
//   IconButton,
//   FormHelperText
// } from '@mui/material';
// import { 
//   Close as CloseIcon, 
//   Phone as PhoneIcon, 
//   Email as EmailIcon,
//   Send as SendIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import { COLORS } from './constants';

// const FollowupPopup = ({ open, onClose, lead, onFollowup }) => {
//   const [followupType, setFollowupType] = useState('call');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // Call Follow-up Form Data
//   const [callFormData, setCallFormData] = useState({
//     channel: 'Call',
//     summary: '',
//     outcome: 'Positive',
//     next_action: '',
//     next_action_date: ''
//   });
  
//   // Email Follow-up Form Data
//   const [emailFormData, setEmailFormData] = useState({
//     channel: 'Email',
//     summary: '',
//     outcome: 'Neutral'
//   });

//   // Outcome options based on enum
//   const outcomeOptions = ['Positive', 'Neutral', 'Negative', 'No Response'];

//   const handleCallChange = (e) => {
//     const { name, value } = e.target;
//     setCallFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleEmailChange = (e) => {
//     const { name, value } = e.target;
//     setEmailFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateCallForm = () => {
//     if (!callFormData.summary.trim()) {
//       setError('Summary is required');
//       return false;
//     }
//     if (!callFormData.outcome) {
//       setError('Outcome is required');
//       return false;
//     }
//     return true;
//   };

//   const validateEmailForm = () => {
//     if (!emailFormData.summary.trim()) {
//       setError('Summary is required');
//       return false;
//     }
//     if (!emailFormData.outcome) {
//       setError('Outcome is required');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     setError('');
    
//     let requestData = {};
    
//     if (followupType === 'call') {
//       if (!validateCallForm()) return;
//       requestData = {
//         channel: 'Call',
//         summary: callFormData.summary,
//         outcome: callFormData.outcome,
//         next_action: callFormData.next_action || undefined,
//         next_action_date: callFormData.next_action_date ? new Date(callFormData.next_action_date).toISOString() : undefined
//       };
//     } else if (followupType === 'email') {
//       if (!validateEmailForm()) return;
//       requestData = {
//         channel: 'Email',
//         summary: emailFormData.summary,
//         outcome: emailFormData.outcome
//       };
//     }
    
//     setLoading(true);
    
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/api/leads/${lead._id}/followup`,
//         requestData,
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );
      
//       if (response.data.success) {
//         onFollowup(response.data.data);
//         handleClose();
//       } else {
//         setError(response.data.message || 'Failed to add follow-up');
//       }
//     } catch (err) {
//       console.error('Error adding follow-up:', err);
//       setError(err.response?.data?.message || 'Failed to add follow-up');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFollowupType('call');
//     setCallFormData({
//       channel: 'Call',
//       summary: '',
//       outcome: 'Positive',
//       next_action: '',
//       next_action_date: ''
//     });
//     setEmailFormData({
//       channel: 'Email',
//       summary: '',
//       outcome: 'Neutral'
//     });
//     setError('');
//     onClose();
//   };

//   // Helper function to get outcome color for chip display
//   const getOutcomeColor = (outcome) => {
//     const colors = {
//       'Positive': { bg: '#DCFCE7', color: '#166534' },
//       'Neutral': { bg: '#FEF3C7', color: '#92400E' },
//       'Negative': { bg: '#FEE2E2', color: '#991B1B' },
//       'No Response': { bg: '#EFF6FF', color: '#1E40AF' }
//     };
//     return colors[outcome] || { bg: '#F1F5F9', color: '#475569' };
//   };

//   if (!lead) return null;

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
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         mb: 2,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//           Add Follow-up
//         </Typography>
//         <IconButton onClick={handleClose} size="small">
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5 }}>
//         <Stack spacing={2.5}>
//           {/* Lead Information */}
//           {/* <Paper sx={{ 
//             p: 1.5, 
//             bgcolor: COLORS.background.light, 
//             borderRadius: 1.5, 
//             border: `1px solid ${COLORS.border}`,
//             boxShadow: 'none'
//           }}>
//             <Stack spacing={1}>
//               <Stack direction="row" justifyContent="space-between">
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lead ID:</Typography>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                   {lead.lead_id}
//                 </Typography>
//               </Stack>
//               <Stack direction="row" justifyContent="space-between">
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Company:</Typography>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                   {lead.company_name}
//                 </Typography>
//               </Stack>
//               <Stack direction="row" justifyContent="space-between">
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Contact:</Typography>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                   {lead.contact_name}
//                 </Typography>
//               </Stack>
//             </Stack>
//           </Paper> */}

//           {/* Follow-up Type Selection */}
//           <Box>
//             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1, letterSpacing: '0.5px' }}>
//               FOLLOW-UP TYPE <span style={{ color: '#EF4444' }}>*</span>
//             </Typography>
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Button
//                   fullWidth
//                   variant={followupType === 'call' ? 'contained' : 'outlined'}
//                   onClick={() => setFollowupType('call')}
//                   startIcon={<PhoneIcon />}
//                   sx={{
//                     height: 48,
//                     borderRadius: 1.5,
//                     textTransform: 'none',
//                     fontSize: '0.75rem',
//                     fontWeight: 500,
//                     bgcolor: followupType === 'call' ? COLORS.primary : 'transparent',
//                     borderColor: COLORS.border,
//                     color: followupType === 'call' ? COLORS.text.light : COLORS.text.secondary,
//                     '&:hover': {
//                       bgcolor: followupType === 'call' ? COLORS.primaryDark : COLORS.primaryLight
//                     }
//                   }}
//                 >
//                   Phone Call
//                 </Button>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Button
//                   fullWidth
//                   variant={followupType === 'email' ? 'contained' : 'outlined'}
//                   onClick={() => setFollowupType('email')}
//                   startIcon={<EmailIcon />}
//                   sx={{
//                     height: 48,
//                     borderRadius: 1.5,
//                     textTransform: 'none',
//                     fontSize: '0.75rem',
//                     fontWeight: 500,
//                     bgcolor: followupType === 'email' ? COLORS.primary : 'transparent',
//                     borderColor: COLORS.border,
//                     color: followupType === 'email' ? COLORS.text.light : COLORS.text.secondary,
//                     '&:hover': {
//                       bgcolor: followupType === 'email' ? COLORS.primaryDark : COLORS.primaryLight
//                     }
//                   }}
//                 >
//                   Email Sent
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>

//           {/* Form based on selected follow-up type */}
//           {followupType === 'call' && (
//             <Box>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 Phone Call Details
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       SUMMARY <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="summary"
//                       multiline
//                       rows={3}
//                       value={callFormData.summary}
//                       onChange={handleCallChange}
//                       placeholder="e.g., Spoke with Rajesh. Interested but needs revised pricing."
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       OUTCOME <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small">
//                       <Select
//                         name="outcome"
//                         value={callFormData.outcome}
//                         onChange={handleCallChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5 }
//                         }}
//                       >
//                         {outcomeOptions.map(option => {
//                           const outcomeColor = getOutcomeColor(option);
//                           return (
//                             <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
//                               <Stack direction="row" alignItems="center" spacing={1}>
//                                 <Box sx={{ 
//                                   width: 8, 
//                                   height: 8, 
//                                   borderRadius: '50%', 
//                                   bgcolor: outcomeColor.color 
//                                 }} />
//                                 <span>{option}</span>
//                               </Stack>
//                             </MenuItem>
//                           );
//                         })}
//                       </Select>
//                     </FormControl>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
//                       Select the outcome of the call
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       NEXT ACTION
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="next_action"
//                       value={callFormData.next_action}
//                       onChange={handleCallChange}
//                       placeholder="e.g., Send revised quotation with 5% discount"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       NEXT ACTION DATE
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="next_action_date"
//                       type="date"
//                       value={callFormData.next_action_date}
//                       onChange={handleCallChange}
//                       InputLabelProps={{ shrink: true }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
//                       When to follow up next (optional)
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>

//               {/* Preview of selected outcome */}
//               {/* {callFormData.outcome && (
//                 <Box sx={{ 
//                   mt: 2,
//                   p: 1.5, 
//                   bgcolor: COLORS.primaryLight, 
//                   borderRadius: 1.5,
//                   border: `1px solid ${COLORS.primary}`
//                 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primaryDark, mb: 0.5 }}>
//                     Selected Outcome:
//                   </Typography>
//                   <Chip
//                     label={callFormData.outcome}
//                     size="small"
//                     sx={{ 
//                       fontSize: '0.7rem', 
//                       height: 24,
//                       bgcolor: getOutcomeColor(callFormData.outcome).bg,
//                       color: getOutcomeColor(callFormData.outcome).color,
//                       fontWeight: 500
//                     }}
//                   />
//                 </Box>
//               )} */}
//             </Box>
//           )}

//           {followupType === 'email' && (
//             <Box>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 Email Details
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       SUMMARY <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="summary"
//                       multiline
//                       rows={3}
//                       value={emailFormData.summary}
//                       onChange={handleEmailChange}
//                       placeholder="e.g., Sent quotation QT-202503-0042 to customer"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       OUTCOME <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small">
//                       <Select
//                         name="outcome"
//                         value={emailFormData.outcome}
//                         onChange={handleEmailChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5 }
//                         }}
//                       >
//                         {outcomeOptions.map(option => {
//                           const outcomeColor = getOutcomeColor(option);
//                           return (
//                             <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
//                               <Stack direction="row" alignItems="center" spacing={1}>
//                                 <Box sx={{ 
//                                   width: 8, 
//                                   height: 8, 
//                                   borderRadius: '50%', 
//                                   bgcolor: outcomeColor.color 
//                                 }} />
//                                 <span>{option}</span>
//                               </Stack>
//                             </MenuItem>
//                           );
//                         })}
//                       </Select>
//                     </FormControl>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
//                       Select the outcome of the email
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>

//               {/* Preview of selected outcome */}
//               {emailFormData.outcome && (
//                 <Box sx={{ 
//                   mt: 2,
//                   p: 1.5, 
//                   bgcolor: COLORS.primaryLight, 
//                   borderRadius: 1.5,
//                   border: `1px solid ${COLORS.primary}`
//                 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primaryDark, mb: 0.5 }}>
//                     Selected Outcome:
//                   </Typography>
//                   <Chip
//                     label={emailFormData.outcome}
//                     size="small"
//                     sx={{ 
//                       fontSize: '0.7rem', 
//                       height: 24,
//                       bgcolor: getOutcomeColor(emailFormData.outcome).bg,
//                       color: getOutcomeColor(emailFormData.outcome).color,
//                       fontWeight: 500
//                     }}
//                   />
//                 </Box>
//               )}
//             </Box>
//           )}

//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 borderRadius: 1.5,
//                 '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
//                 fontSize: '0.75rem',
//                 py: 0.5
//               }}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'flex-end',
//         gap: 1
//       }}>
//         <Button
//           onClick={handleClose}
//           disabled={loading}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: COLORS.primary,
//               bgcolor: `${COLORS.primary}10`
//             }
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || (followupType === 'call' ? !callFormData.summary : !emailFormData.summary)}
//           startIcon={loading ? null : <SendIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             bgcolor: COLORS.primary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               bgcolor: COLORS.primaryDark,
//             }
//           }}
//         >
//           {loading ? 'Saving...' : 'Save Follow-up'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default FollowupPopup;







'use strict';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, Stack, TextField, Alert, CircularProgress,
  IconButton, FormControl, Select, MenuItem, Chip, Divider, Tabs, Tab,
} from '@mui/material';
import {
  Close as CloseIcon, Send as SendIcon,
  Phone as PhoneIcon, Email as EmailIcon, DirectionsWalk as VisitIcon,
  WhatsApp as WhatsAppIcon, Groups as MeetingIcon,
  AccessTime as TimeIcon, History as HistoryIcon, Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

// ── constants ─────────────────────────────────────────────────────────────────
const CHANNELS = [
  { value: 'Call',     label: 'Call',     Icon: PhoneIcon,    color: '#059669', bg: '#D1FAE5' },
  { value: 'Email',    label: 'Email',    Icon: EmailIcon,    color: '#2563EB', bg: '#DBEAFE' },
  { value: 'Visit',    label: 'Visit',    Icon: VisitIcon,    color: '#7C3AED', bg: '#EDE9FE' },
  { value: 'WhatsApp', label: 'WhatsApp', Icon: WhatsAppIcon, color: '#16A34A', bg: '#DCFCE7' },
  { value: 'Meeting',  label: 'Meeting',  Icon: MeetingIcon,  color: '#D97706', bg: '#FEF3C7' },
];

const OUTCOMES = [
  { value: 'Positive',    label: 'Positive',    color: '#166534', bg: '#DCFCE7', border: '#86EFAC' },
  { value: 'Neutral',     label: 'Neutral',     color: '#92400E', bg: '#FEF3C7', border: '#FCD34D' },
  { value: 'Negative',    label: 'Negative',    color: '#991B1B', bg: '#FEE2E2', border: '#FCA5A5' },
  { value: 'No Response', label: 'No Response', color: '#1E40AF', bg: '#EFF6FF', border: '#93C5FD' },
];

const emptyForm = {
  channel:          'Call',
  summary:          '',
  outcome:          'Positive',
  next_action:      '',
  next_action_date: '',
};

// ── tiny helpers ──────────────────────────────────────────────────────────────
const channelMeta   = (val) => CHANNELS.find(c => c.value === val) || CHANNELS[0];
const outcomeMeta   = (val) => OUTCOMES.find(o => o.value === val) || OUTCOMES[1];

const tfSx = () => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5, fontSize: '0.75rem',
    '&:hover fieldset':       { borderColor: COLORS.primary },
    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
  },
  '& .MuiInputBase-input': {
    py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary,
    '&::placeholder': { color: COLORS.text.tertiary },
  },
});

const Label = ({ text, required }) => (
  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', mb: 0.5 }}>
    {text}{required && <span style={{ color: '#EF4444' }}> *</span>}
  </Typography>
);

const formatDateTime = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

const formatDateOnly = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// today string for min date on input
const todayStr = () => new Date().toISOString().split('T')[0];

// ── Follow-up history timeline ────────────────────────────────────────────────
const FollowupHistory = ({ followUps = [] }) => {
  if (!followUps.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <HistoryIcon sx={{ fontSize: 40, color: COLORS.text.tertiary, mb: 1 }} />
        <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary, fontWeight: 500 }}>
          No follow-ups logged yet
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, mt: 0.5 }}>
          Add your first follow-up using the Log Follow-up tab
        </Typography>
      </Box>
    );
  }

  // sort newest first
  const sorted = [...followUps].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Stack spacing={0}>
      {sorted.map((fu, idx) => {
        const ch  = channelMeta(fu.channel);
        const out = outcomeMeta(fu.outcome);
        const ChIcon = ch.Icon;
        const isLast = idx === sorted.length - 1;

        return (
          <Box key={fu._id || idx} sx={{ display: 'flex', gap: 1.5 }}>
            {/* Timeline line + icon */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '50%',
                bgcolor: ch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${ch.color}20`, flexShrink: 0,
              }}>
                <ChIcon sx={{ fontSize: '0.9rem', color: ch.color }} />
              </Box>
              {!isLast && (
                <Box sx={{ width: 1.5, flex: 1, bgcolor: COLORS.border, my: 0.5 }} />
              )}
            </Box>

            {/* Content card */}
            <Box sx={{ flex: 1, pb: isLast ? 0 : 2 }}>
              <Box sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, mb: 0 }}>
                {/* Header row */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.75 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {fu.channel}
                    </Typography>
                    {fu.outcome && (
                      <Box sx={{
                        px: 0.875, py: 0.125, borderRadius: 8, fontSize: '0.65rem', fontWeight: 600,
                        bgcolor: out.bg, color: out.color, border: `1px solid ${out.border}`,
                      }}>
                        {fu.outcome}
                      </Box>
                    )}
                  </Stack>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, whiteSpace: 'nowrap' }}>
                    {formatDateTime(fu.date)}
                  </Typography>
                </Stack>

                {/* Summary */}
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, lineHeight: 1.5, mb: fu.next_action || fu.next_action_date ? 0.75 : 0 }}>
                  {fu.summary}
                </Typography>

                {/* Next action */}
                {(fu.next_action || fu.next_action_date) && (
                  <Box sx={{ mt: 0.75, pt: 0.75, borderTop: `1px dashed ${COLORS.border}` }}>
                    {fu.next_action && (
                      <Stack direction="row" spacing={0.5} alignItems="flex-start">
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, fontWeight: 600, mt: 0.1, whiteSpace: 'nowrap' }}>
                          Next:
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {fu.next_action}
                        </Typography>
                      </Stack>
                    )}
                    {fu.next_action_date && (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                        <TimeIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                          Follow-up by {formatDateOnly(fu.next_action_date)}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                )}

                {/* Done by */}
                {fu.done_by && (
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    By: {fu.done_by?.first_name} {fu.done_by?.last_name}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
};

// ── main component ────────────────────────────────────────────────────────────
const FollowupPopup = ({ open, onClose, lead, onFollowup }) => {
  const [tab,         setTab]         = useState(0);   // 0 = Log, 1 = History
  const [form,        setForm]        = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading,     setLoading]     = useState(false);
  const [histLoading, setHistLoading] = useState(false);
  const [error,       setError]       = useState('');
  const [followUps,   setFollowUps]   = useState([]);

  // ── fetch follow-up history when History tab opens ────────────────────────
  const fetchHistory = useCallback(async () => {
    if (!lead?._id) return;
    setHistLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/leads/${lead._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) {
        setFollowUps(res.data.data?.follow_ups || []);
      }
    } catch { /* silently ignore */ }
    finally { setHistLoading(false); }
  }, [lead?._id]);

  useEffect(() => {
    if (open && tab === 1) fetchHistory();
  }, [open, tab, fetchHistory]);

  // also refresh history after a new followup is saved
  useEffect(() => {
    if (open && lead) {
      setFollowUps(lead.follow_ups || []);
    }
  }, [open, lead]);

  // ── form handlers ─────────────────────────────────────────────────────────
  const setField = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    setFieldErrors(e => ({ ...e, [name]: '' }));
    setError('');
  };

  const handleReset = () => {
    setForm(emptyForm); setFieldErrors({}); setError('');
  };

  const handleClose = () => {
    handleReset(); setTab(0); onClose();
  };

  // ── validate ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.summary.trim()) errs.summary = 'Summary is required';

    // next_action_date must be a future date if provided
    if (form.next_action_date) {
      const picked = new Date(form.next_action_date);
      const today  = new Date(); today.setHours(0, 0, 0, 0);
      if (picked < today) errs.next_action_date = 'Next action date must be today or a future date';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true); setError('');

    try {
      const payload = {
        channel:  form.channel,
        summary:  form.summary.trim(),
        outcome:  form.outcome,
        ...(form.next_action.trim()      ? { next_action:      form.next_action.trim()               } : {}),
        ...(form.next_action_date        ? { next_action_date: new Date(form.next_action_date + 'T09:00:00').toISOString() } : {}),
      };

      const res = await axios.post(
        `${BASE_URL}/api/leads/${lead._id}/followup`, payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
      );

      if (res.data.success) {
        handleReset();
        setTab(1);           // switch to history tab to see the new entry
        fetchHistory();      // re-fetch history from server
        onFollowup();        // notify parent to refresh leads table
      } else {
        setError(res.data.message || 'Failed to save follow-up');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save follow-up. Please try again.');
    } finally { setLoading(false); }
  };

  if (!lead) return null;

  const selectedChannel = channelMeta(form.channel);
  const ChIcon = selectedChannel.Icon;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>

      {/* ── Title ── */}
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, bgcolor: COLORS.background.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>Follow-up</Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
            {lead.company_name} · {lead.lead_id}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: COLORS.text.tertiary }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Tabs ── */}
      <Box sx={{ borderBottom: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, px: 2.5 }}>
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': { fontSize: '0.75rem', textTransform: 'none', minHeight: 40, fontWeight: 500, color: COLORS.text.secondary, py: 0 },
            '& .Mui-selected': { color: COLORS.primary, fontWeight: 600 },
            '& .MuiTabs-indicator': { bgcolor: COLORS.primary },
          }}
        >
          <Tab icon={<AddIcon sx={{ fontSize: '0.9rem' }} />} iconPosition="start" label="Log follow-up" />
          <Tab
            icon={<HistoryIcon sx={{ fontSize: '0.9rem' }} />} iconPosition="start"
            label={`History (${(lead.follow_ups?.length || followUps.length || 0)})`}
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: COLORS.background.white }}>

        {/* ═══════════════════════════════════════════════════════════════
            TAB 0 — LOG FOLLOW-UP
        ═══════════════════════════════════════════════════════════════ */}
        {tab === 0 && (
          <Box sx={{ p: 2.5 }}>
            <Stack spacing={2}>

              {/* Channel selection */}
              <Box>
                <Label text="Channel" required />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {CHANNELS.map(({ value, label, Icon, color, bg }) => {
                    const active = form.channel === value;
                    return (
                      <Box key={value} onClick={() => setField('channel', value)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 0.75,
                          px: 1.5, py: 0.875, borderRadius: 2, cursor: 'pointer', userSelect: 'none',
                          border: `2px solid ${active ? color : COLORS.border}`,
                          bgcolor: active ? bg : COLORS.background.white,
                          color:   active ? color : COLORS.text.secondary,
                          fontWeight: active ? 600 : 400, fontSize: '0.78rem',
                          transition: 'all .15s',
                          '&:hover': { borderColor: color, bgcolor: bg },
                        }}>
                        <Icon sx={{ fontSize: '0.95rem' }} />
                        {label}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              {/* Summary */}
              <Box>
                <Label text="Summary" required />
                <TextField
                  fullWidth multiline rows={3} size="small"
                  value={form.summary}
                  onChange={(e) => setField('summary', e.target.value)}
                  placeholder={
                    form.channel === 'Call'     ? 'e.g. Spoke with Rajesh. Interested in copper busbar, needs revised pricing.' :
                    form.channel === 'Email'    ? 'e.g. Sent quotation QT-202503-0042 with updated pricing.' :
                    form.channel === 'Visit'    ? 'e.g. Visited Siemens plant. Met purchase team, toured assembly line.' :
                    form.channel === 'WhatsApp' ? 'e.g. Shared product catalogue over WhatsApp. Customer confirmed receipt.' :
                                                  'e.g. Meeting with decision team to finalise specs and timeline.'
                  }
                  error={!!fieldErrors.summary}
                  sx={tfSx()}
                />
                {fieldErrors.summary && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>{fieldErrors.summary}</Typography>}
              </Box>

              {/* Outcome */}
              <Box>
                <Label text="Outcome" required />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {OUTCOMES.map(({ value, label, color, bg, border }) => {
                    const active = form.outcome === value;
                    return (
                      <Box key={value} onClick={() => setField('outcome', value)}
                        sx={{
                          px: 1.5, py: 0.625, borderRadius: 2, cursor: 'pointer', userSelect: 'none',
                          border: `2px solid ${active ? border : COLORS.border}`,
                          bgcolor: active ? bg : COLORS.background.white,
                          color:   active ? color : COLORS.text.secondary,
                          fontWeight: active ? 600 : 400, fontSize: '0.78rem',
                          transition: 'all .15s',
                          '&:hover': { borderColor: border, bgcolor: bg },
                        }}>
                        {label}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              <Divider sx={{ borderColor: COLORS.border }} />

              {/* Next action */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Box sx={{ flex: 1 }}>
                  <Label text="Next action" />
                  <TextField
                    fullWidth size="small" value={form.next_action}
                    onChange={(e) => setField('next_action', e.target.value)}
                    placeholder="e.g. Send revised quotation with 5% discount"
                    sx={tfSx()}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label text="Follow-up date" />
                  <TextField
                    fullWidth size="small" type="date" value={form.next_action_date}
                    inputProps={{ min: todayStr() }}
                    onChange={(e) => setField('next_action_date', e.target.value)}
                    error={!!fieldErrors.next_action_date}
                    sx={tfSx()}
                  />
                  {fieldErrors.next_action_date
                    ? <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>{fieldErrors.next_action_date}</Typography>
                    : <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>Must be today or a future date</Typography>
                  }
                </Box>
              </Stack>
            </Stack>

            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>}
          </Box>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 1 — HISTORY
        ═══════════════════════════════════════════════════════════════ */}
        {tab === 1 && (
          <Box sx={{ p: 2.5, minHeight: 300, maxHeight: '55vh', overflowY: 'auto' }}>
            {histLoading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 5 }}>
                <CircularProgress size={28} sx={{ color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading history...</Typography>
              </Stack>
            ) : (
              <FollowupHistory followUps={followUps.length ? followUps : (lead.follow_ups || [])} />
            )}
          </Box>
        )}
      </DialogContent>

      {/* ── Actions (only shown on Log tab) ── */}
      {tab === 0 && (
        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleClose} disabled={loading}
            sx={{ height: 34, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.75rem', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading || !form.summary.trim()}
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SendIcon sx={{ fontSize: '1rem' }} />}
            sx={{ height: 34, px: 2.5, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', textTransform: 'none', '&:hover': { bgcolor: COLORS.primaryDark }, '&.Mui-disabled': { bgcolor: `${COLORS.primary}50`, color: '#fff' } }}>
            {loading ? 'Saving...' : 'Save Follow-up'}
          </Button>
        </DialogActions>
      )}

      {/* On History tab — show button to jump to log tab */}
      {tab === 1 && (
        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, justifyContent: 'space-between' }}>
          <Button onClick={handleClose}
            sx={{ height: 34, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.75rem', textTransform: 'none' }}>
            Close
          </Button>
          <Button variant="contained" onClick={() => setTab(0)}
            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
            sx={{ height: 34, px: 2.5, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', textTransform: 'none', '&:hover': { bgcolor: COLORS.primaryDark } }}>
            Log new follow-up
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FollowupPopup;
