// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Button,
//   TextField,
//   Stack,
//   Paper,
//   Grid,
//   Chip,
//   IconButton,
//   Alert,
//   CircularProgress,
//   Divider
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
//   Factory as MachineIcon,
//   Assignment as WOIcon,
//   Schedule as ScheduleIcon,
//   Timeline as TimelineIcon,
//   TrendingUp as TrendingUpIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const COLORS = {
//   primary: '#1976D2',
//   primaryDark: '#1565C0',
//   success: '#2E7D32',
//   warning: '#ED6C02',
//   error: '#D32F2F',
//   info: '#0288D1',
//   border: '#E5E7EB',
//   text: {
//     primary: '#111827',
//     secondary: '#6B7280',
//     tertiary: '#9CA3AF'
//   },
//   background: {
//     light: '#F9FAFB',
//     white: '#FFFFFF'
//   }
// };

// const CompleteProductionSchedule = ({ open, onClose, schedule, onComplete }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [completionData, setCompletionData] = useState(null);
  
//   const [formData, setFormData] = useState({
//     actual_hours: '',
//     actual_qty: ''
//   });

//   // Initialize form with schedule data
//   useEffect(() => {
//     if (schedule && open) {
//       setFormData({
//         actual_hours: schedule.planned_hours || '',
//         actual_qty: schedule.planned_qty || ''
//       });
//       setError('');
//       setSuccess(false);
//       setCompletionData(null);
//     }
//   }, [schedule, open]);

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     // Clear error when user modifies form
//     if (error) {
//       setError('');
//     }
//   };

//   const handleSubmit = async () => {
//     // Validation
//     if (!formData.actual_hours || formData.actual_hours <= 0) {
//       setError('Please enter valid actual hours');
//       return;
//     }
//     if (!formData.actual_qty || formData.actual_qty <= 0) {
//       setError('Please enter valid actual quantity');
//       return;
//     }
//     if (parseFloat(formData.actual_qty) > (schedule?.planned_qty || 0)) {
//       setError(`Actual quantity cannot exceed planned quantity (${schedule?.planned_qty})`);
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
      
//       const payload = {
//         actual_hours: parseFloat(formData.actual_hours),
//         actual_qty: parseInt(formData.actual_qty)
//       };

//       const response = await axios.post(
//         `${BASE_URL}/api/production-schedule/${schedule._id}/complete`,
//         payload,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setSuccess(true);
//         setCompletionData(response.data.data);
        
//         // Call onComplete callback
//         if (onComplete) {
//           onComplete(response.data.data);
//         }
        
//         // Auto close after 2 seconds on success
//         setTimeout(() => {
//           handleClose();
//         }, 2000);
//       } else {
//         setError(response.data.message || 'Failed to complete production schedule');
//       }
//     } catch (err) {
//       console.error('Error completing production schedule:', err);
//       setError(err.response?.data?.message || 'Failed to complete production schedule. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setError('');
//     setSuccess(false);
//     setCompletionData(null);
//     setFormData({
//       actual_hours: '',
//       actual_qty: ''
//     });
//     onClose();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getMachineName = () => {
//     if (typeof schedule?.machine_id === 'object') {
//       return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
//     }
//     return schedule?.machine_id || '-';
//   };

//   const getMachineCode = () => {
//     if (typeof schedule?.machine_id === 'object') {
//       return schedule.machine_id?.machine_code || '-';
//     }
//     return '-';
//   };

//   const getWONumber = () => {
//     if (typeof schedule?.wo_id === 'object') {
//       return schedule.wo_id?.wo_number || '-';
//     }
//     return schedule?.wo_id || '-';
//   };

//   const getPartNo = () => {
//     if (typeof schedule?.wo_id === 'object') {
//       return schedule.wo_id?.part_no || schedule?.part_no || '-';
//     }
//     return schedule?.part_no || '-';
//   };

//   const getEfficiencyColor = (utilization) => {
//     if (utilization >= 100) return { bg: '#D1FAE5', color: '#059669' };
//     if (utilization >= 85) return { bg: '#E0F2FE', color: '#0284C7' };
//     if (utilization >= 70) return { bg: '#FEF3C7', color: '#D97706' };
//     return { bg: '#FEE2E2', color: '#DC2626' };
//   };

//   const calculateCompletionPercent = () => {
//     if (!schedule?.planned_qty) return 0;
//     return (parseFloat(formData.actual_qty) / schedule.planned_qty) * 100;
//   };

//   const calculateVariance = () => {
//     const planned = schedule?.planned_hours || 0;
//     const actual = parseFloat(formData.actual_hours) || 0;
//     const variance = actual - planned;
//     return {
//       value: variance.toFixed(2),
//       percent: planned > 0 ? ((variance / planned) * 100).toFixed(1) : 0,
//       isPositive: variance > 0
//     };
//   };

//   const variance = calculateVariance();

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
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
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <CheckCircleIcon sx={{ fontSize: '1.2rem', color: COLORS.success }} />
//           <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Complete Production Schedule
//           </Typography>
//         </Box>
//         <IconButton onClick={handleClose} size="small" disabled={loading}>
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//         {success && completionData ? (
//           // Success State
//           <Stack spacing={2}>
//             <Alert 
//               severity="success" 
//               sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//               icon={<CheckCircleIcon />}
//             >
//               <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
//                 Production Completed Successfully!
//               </Typography>
//               <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
//                 The production schedule has been marked as completed
//               </Typography>
//             </Alert>

//             <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success, mb: 1.5 }}>
//                 Completion Summary
//               </Typography>
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                     <ScheduleIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
//                     Schedule ID
//                   </Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
//                     {completionData.schedule_id}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                     <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
//                     Planned Hours
//                   </Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//                     {completionData.planned_hours} hrs
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                     <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
//                     Actual Hours
//                   </Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//                     {completionData.actual_hours} hrs
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Utilization Card */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: getEfficiencyColor(completionData.utilization).bg, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}` 
//             }}>
//               <Stack direction="row" justifyContent="space-between" alignItems="center">
//                 <Box>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                     <TrendingUpIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
//                     Schedule Utilization
//                   </Typography>
//                   <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: getEfficiencyColor(completionData.utilization).color }}>
//                     {completionData.utilization}%
//                   </Typography>
//                 </Box>
//                 <Box sx={{ textAlign: 'right' }}>
//                   <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>
//                     Efficiency Rating
//                   </Typography>
//                   <Chip 
//                     label={completionData.utilization >= 90 ? 'Excellent' : completionData.utilization >= 75 ? 'Good' : completionData.utilization >= 60 ? 'Average' : 'Needs Improvement'}
//                     size="small"
//                     sx={{ 
//                       fontSize: '0.65rem', 
//                       mt: 0.5,
//                       bgcolor: getEfficiencyColor(completionData.utilization).bg,
//                       color: getEfficiencyColor(completionData.utilization).color,
//                       fontWeight: 600
//                     }}
//                   />
//                 </Box>
//               </Stack>
//             </Paper>
//           </Stack>
//         ) : (
//           // Form State
//           <Stack spacing={2.5}>
//             <Alert 
//               severity="info" 
//               sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//               icon={<WarningIcon />}
//             >
//               <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
//                 Confirm Production Completion
//               </Typography>
//               <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
//                 Please enter the actual production details to mark this schedule as completed.
//               </Typography>
//             </Alert>

//             {/* Schedule Information Summary */}
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <ScheduleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Schedule Information
//               </Typography>
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
//                     {schedule?.schedule_id}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//                     {formatDate(schedule?.scheduled_date)}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                     <MachineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
//                     Machine
//                   </Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//                     {getMachineName()} ({getMachineCode()})
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                     <WOIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
//                     Work Order
//                   </Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//                     {getWONumber()}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//                     {getPartNo()}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence</Typography>
//                   <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//                     Operation {schedule?.operation_seq}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Paper>

//             <Divider sx={{ borderColor: COLORS.border }} />

//             {/* Planned vs Actual Preview */}
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 Planned vs Actual
//               </Typography>
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Hours</Typography>
//                   <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
//                     {schedule?.planned_hours || 0} hrs
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
//                   <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
//                     {schedule?.planned_qty || 0} units
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Form Fields */}
//             <Grid container spacing={1.5}>
//               {/* Actual Hours */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <TextField
//                   fullWidth
//                   label="Actual Hours *"
//                   type="number"
//                   size="small"
//                   value={formData.actual_hours}
//                   onChange={(e) => handleChange('actual_hours', e.target.value)}
//                   placeholder="Enter actual production hours"
//                   inputProps={{ min: 0, step: 0.25 }}
//                   helperText={`Planned: ${schedule?.planned_hours || 0} hours`}
//                   sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
//                 />
//               </Grid>

//               {/* Actual Quantity */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <TextField
//                   fullWidth
//                   label="Actual Quantity *"
//                   type="number"
//                   size="small"
//                   value={formData.actual_qty}
//                   onChange={(e) => handleChange('actual_qty', e.target.value)}
//                   placeholder="Enter actual produced quantity"
//                   inputProps={{ min: 0, max: schedule?.planned_qty || 0 }}
//                   helperText={`Planned: ${schedule?.planned_qty || 0} units`}
//                   sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Live Calculation Preview */}
//             {formData.actual_hours && formData.actual_qty && (
//               <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                   Live Calculation Preview
//                 </Typography>
//                 <Grid container spacing={1.5}>
//                   <Grid size={{ xs: 12, sm: 4 }}>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Completion Rate</Typography>
//                     <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.success }}>
//                       {calculateCompletionPercent().toFixed(1)}%
//                     </Typography>
//                   </Grid>
//                   <Grid size={{ xs: 12, sm: 4 }}>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Time Variance</Typography>
//                     <Typography sx={{ 
//                       fontSize: '0.85rem', 
//                       fontWeight: 700, 
//                       color: variance.isPositive ? COLORS.error : COLORS.success 
//                     }}>
//                       {variance.isPositive ? '+' : ''}{variance.value} hrs ({variance.isPositive ? '+' : ''}{variance.percent}%)
//                     </Typography>
//                   </Grid>
//                   <Grid size={{ xs: 12, sm: 4 }}>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Estimated Efficiency</Typography>
//                     <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.info }}>
//                       {schedule?.planned_hours > 0 
//                         ? Math.min(100, ((parseFloat(formData.actual_qty) / schedule.planned_qty) * 
//                             (schedule.planned_hours / parseFloat(formData.actual_hours)) * 100)).toFixed(1)
//                         : 0}%
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             )}

//             {error && (
//               <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//                 {error}
//               </Alert>
//             )}
//           </Stack>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         justifyContent: 'flex-end',
//         gap: 1
//       }}>
//         <Button
//           onClick={handleClose}
//           disabled={loading}
//           size="small"
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none'
//           }}
//         >
//           {success ? 'Close' : 'Cancel'}
//         </Button>
//         {!success && (
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//             startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
//             sx={{
//               height: 32,
//               px: 2,
//               borderRadius: 1.5,
//               bgcolor: COLORS.success,
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               textTransform: 'none',
//               '&:hover': { bgcolor: '#1E5A2A' }
//             }}
//           >
//             {loading ? 'Completing...' : 'Complete Production'}
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CompleteProductionSchedule;


import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Factory as MachineIcon,
  Assignment as WOIcon,
  Schedule as ScheduleIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Build as ToolIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF'
  }
};

const CompleteProductionSchedule = ({ open, onClose, schedule, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [toolUsageData, setToolUsageData] = useState(null);
  const [toolUsageLoading, setToolUsageLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    actual_hours: '',
    actual_qty: ''
  });

  // State for tool usage tracking
  const [toolUsageForm, setToolUsageForm] = useState({
    tool_id: '',
    shots_fired: '',
    notes: ''
  });

  const [tools, setTools] = useState([]);
  const [toolsLoading, setToolsLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Initialize form with schedule data
  useEffect(() => {
    if (schedule && open) {
      setFormData({
        actual_hours: schedule.planned_hours || '',
        actual_qty: schedule.planned_qty || ''
      });
      setToolUsageForm({
        tool_id: '',
        shots_fired: '',
        notes: ''
      });
      setError('');
      setSuccess(false);
      setCompletionData(null);
      setToolUsageData(null);
      fetchTools();
      fetchToolAlerts();
    }
  }, [schedule, open]);

  // Fetch tools for the machine from Tool Master API
  const fetchTools = async () => {
    setToolsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // First, get all active tools
      const response = await axios.get(`${BASE_URL}/api/tool-master`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          is_active: true,
          limit: 100
        }
      });

      console.log('Tools API response:', response.data);

      if (response.data.success) {
        const allTools = response.data.data || [];
        
        // Filter tools by machine if machine_id is available
        const machineId = typeof schedule?.machine_id === 'object' 
          ? schedule.machine_id._id 
          : schedule?.machine_id;
        
        let filteredTools = allTools;
        
        if (machineId) {
          // Filter tools that are assigned to this machine
          filteredTools = allTools.filter(tool => 
            tool.machine_id === machineId || 
            tool.assigned_machine === machineId ||
            !tool.machine_id // Include tools without machine assignment
          );
        }
        
        setTools(filteredTools);
        
        // Auto-select first tool if available
        if (filteredTools.length > 0) {
          setToolUsageForm(prev => ({
            ...prev,
            tool_id: filteredTools[0]._id
          }));
        }
      } else {
        console.error('Failed to fetch tools:', response.data.message);
        setTools([]);
      }
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError('Failed to load tools. Please check your connection.');
      setTools([]);
    } finally {
      setToolsLoading(false);
    }
  };

  // Fetch tools with maintenance alerts
  const fetchToolAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/tool-master/alerts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAlerts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tool alerts:', err);
      // Don't show error to user as this is optional
    }
  };

  // Record tool usage
  const recordToolUsage = async () => {
    if (!toolUsageForm.tool_id || !toolUsageForm.shots_fired) {
      return { success: false, skipped: true }; // Optional, skip if not provided
    }

    setToolUsageLoading(true);
    try {
      const token = localStorage.getItem('token');
      const machineId = typeof schedule?.machine_id === 'object' 
        ? schedule.machine_id._id 
        : schedule?.machine_id;

      const woId = typeof schedule?.wo_id === 'object' 
        ? schedule.wo_id._id 
        : schedule?.wo_id;

      const payload = {
        tool_id: toolUsageForm.tool_id,
        wo_id: woId,
        operation_seq: schedule?.operation_seq || 0,
        machine_id: machineId,
        shots_fired: parseInt(toolUsageForm.shots_fired),
        usage_date: new Date().toISOString(),
        notes: toolUsageForm.notes || 'Production completion'
      };

      console.log('Recording tool usage:', payload);

      const response = await axios.post(`${BASE_URL}/api/tool-usage`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setToolUsageData(response.data.data);
        
        // Check if tool needs maintenance after this usage
        const usedTool = tools.find(t => t._id === toolUsageForm.tool_id);
        if (usedTool) {
          const currentShots = (usedTool.current_shots || 0) + parseInt(toolUsageForm.shots_fired);
          const maxShots = usedTool.max_shots || 0;
          const remainingShots = maxShots - currentShots;
          
          if (remainingShots <= 1000) {
            // Show warning if tool is near maintenance
            setError(`Warning: Tool ${usedTool.tool_name || usedTool.tool_code} is near maintenance. Only ${remainingShots} shots remaining.`);
          }
        }
        
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (err) {
      console.error('Error recording tool usage:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to record tool usage'
      };
    } finally {
      setToolUsageLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user modifies form
    if (error) {
      setError('');
    }
  };

  const handleToolUsageChange = (field, value) => {
    setToolUsageForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.actual_hours || formData.actual_hours <= 0) {
      setError('Please enter valid actual hours');
      return;
    }
    if (!formData.actual_qty || formData.actual_qty <= 0) {
      setError('Please enter valid actual quantity');
      return;
    }
    if (parseFloat(formData.actual_qty) > (schedule?.planned_qty || 0)) {
      setError(`Actual quantity cannot exceed planned quantity (${schedule?.planned_qty})`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        actual_hours: parseFloat(formData.actual_hours),
        actual_qty: parseInt(formData.actual_qty)
      };

      // Complete production schedule
      const response = await axios.post(
        `${BASE_URL}/api/production-schedule/${schedule._id}/complete`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Record tool usage if shots fired is provided
        let toolResult = { success: false, skipped: true };
        if (toolUsageForm.shots_fired && toolUsageForm.tool_id) {
          toolResult = await recordToolUsage();
          
          if (!toolResult.success && toolResult.error) {
            // Show warning but don't fail the completion
            console.warn('Tool usage recording failed:', toolResult.error);
            setError(`Production completed but tool usage recording failed: ${toolResult.error}`);
          }
        }

        setSuccess(true);
        setCompletionData(response.data.data);
        
        // Call onComplete callback
        if (onComplete) {
          onComplete(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to complete production schedule');
      }
    } catch (err) {
      console.error('Error completing production schedule:', err);
      setError(err.response?.data?.message || 'Failed to complete production schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setCompletionData(null);
    setToolUsageData(null);
    setFormData({
      actual_hours: '',
      actual_qty: ''
    });
    setToolUsageForm({
      tool_id: '',
      shots_fired: '',
      notes: ''
    });
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMachineName = () => {
    if (typeof schedule?.machine_id === 'object') {
      return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
    }
    return schedule?.machine_id || '-';
  };

  const getMachineCode = () => {
    if (typeof schedule?.machine_id === 'object') {
      return schedule.machine_id?.machine_code || '-';
    }
    return '-';
  };

  const getWONumber = () => {
    if (typeof schedule?.wo_id === 'object') {
      return schedule.wo_id?.wo_number || '-';
    }
    return schedule?.wo_id || '-';
  };

  const getPartNo = () => {
    if (typeof schedule?.wo_id === 'object') {
      return schedule.wo_id?.part_no || schedule?.part_no || '-';
    }
    return schedule?.part_no || '-';
  };

  const getEfficiencyColor = (utilization) => {
    if (utilization >= 100) return { bg: '#D1FAE5', color: '#059669' };
    if (utilization >= 85) return { bg: '#E0F2FE', color: '#0284C7' };
    if (utilization >= 70) return { bg: '#FEF3C7', color: '#D97706' };
    return { bg: '#FEE2E2', color: '#DC2626' };
  };

  const calculateCompletionPercent = () => {
    if (!schedule?.planned_qty) return 0;
    return (parseFloat(formData.actual_qty) / schedule.planned_qty) * 100;
  };

  const calculateVariance = () => {
    const planned = schedule?.planned_hours || 0;
    const actual = parseFloat(formData.actual_hours) || 0;
    const variance = actual - planned;
    return {
      value: variance.toFixed(2),
      percent: planned > 0 ? ((variance / planned) * 100).toFixed(1) : 0,
      isPositive: variance > 0
    };
  };

  const getToolMaintenanceStatus = (tool) => {
    if (!tool) return null;
    const currentShots = tool.current_shots || 0;
    const maxShots = tool.max_shots || 0;
    const remaining = maxShots - currentShots;
    
    if (remaining <= 0) return { status: 'Critical', color: COLORS.error, message: 'Needs immediate maintenance' };
    if (remaining <= 1000) return { status: 'Warning', color: COLORS.warning, message: `Only ${remaining} shots remaining` };
    return { status: 'Good', color: COLORS.success, message: `${remaining} shots remaining` };
  };

  const variance = calculateVariance();
  const selectedTool = tools.find(t => t._id === toolUsageForm.tool_id);
  const toolStatus = getToolMaintenanceStatus(selectedTool);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
          <CheckCircleIcon sx={{ fontSize: '1.2rem', color: COLORS.success }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Complete Production Schedule
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading || toolUsageLoading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success && completionData ? (
          // Success State
          <Stack spacing={2}>
            <Alert 
              severity="success" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Production Completed Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                The production schedule has been marked as completed
              </Typography>
            </Alert>

            {/* Tool Usage Recorded Alert */}
            {toolUsageData && (
              <Alert 
                severity="info" 
                sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                icon={<ToolIcon />}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Tool Usage Recorded
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                  {toolUsageForm.shots_fired} shots recorded for {selectedTool?.tool_name || selectedTool?.tool_code}
                </Typography>
              </Alert>
            )}

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success, mb: 1.5 }}>
                Completion Summary
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <ScheduleIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Schedule ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {completionData.schedule_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Planned Hours
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {completionData.planned_hours} hrs
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Actual Hours
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {completionData.actual_hours} hrs
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Utilization Card */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: getEfficiencyColor(completionData.utilization).bg, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TrendingUpIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Schedule Utilization
                  </Typography>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: getEfficiencyColor(completionData.utilization).color }}>
                    {completionData.utilization}%
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>
                    Efficiency Rating
                  </Typography>
                  <Chip 
                    label={completionData.utilization >= 90 ? 'Excellent' : completionData.utilization >= 75 ? 'Good' : completionData.utilization >= 60 ? 'Average' : 'Needs Improvement'}
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem', 
                      mt: 0.5,
                      bgcolor: getEfficiencyColor(completionData.utilization).bg,
                      color: getEfficiencyColor(completionData.utilization).color,
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        ) : (
          // Form State
          <Stack spacing={2.5}>
            <Alert 
              severity="info" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Confirm Production Completion
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Please enter the actual production details to mark this schedule as completed.
              </Typography>
            </Alert>

            {/* Schedule Information Summary */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <ScheduleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Schedule Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {schedule?.schedule_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(schedule?.scheduled_date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <MachineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Machine
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {getMachineName()} ({getMachineCode()})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <WOIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Work Order
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {getWONumber()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {getPartNo()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    Operation {schedule?.operation_seq}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Divider sx={{ borderColor: COLORS.border }} />

            {/* Planned vs Actual Preview */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Planned vs Actual
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Hours</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {schedule?.planned_hours || 0} hrs
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {schedule?.planned_qty || 0} units
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Production Details Form */}
            <Grid container spacing={1.5}>
              {/* Actual Hours */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Actual Hours *"
                  type="number"
                  size="small"
                  value={formData.actual_hours}
                  onChange={(e) => handleChange('actual_hours', e.target.value)}
                  placeholder="Enter actual production hours"
                  inputProps={{ min: 0, step: 0.25 }}
                  helperText={`Planned: ${schedule?.planned_hours || 0} hours`}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>

              {/* Actual Quantity */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Actual Quantity *"
                  type="number"
                  size="small"
                  value={formData.actual_qty}
                  onChange={(e) => handleChange('actual_qty', e.target.value)}
                  placeholder="Enter actual produced quantity"
                  inputProps={{ min: 0, max: schedule?.planned_qty || 0 }}
                  helperText={`Planned: ${schedule?.planned_qty || 0} units`}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ borderColor: COLORS.border }} />

            {/* Tool Usage Tracking Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ToolIcon sx={{ fontSize: '1rem', color: COLORS.info }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.info }}>
                    Tool Usage Tracking (Optional)
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={fetchTools} 
                  disabled={toolsLoading}
                  sx={{ padding: 0.5 }}
                >
                  <RefreshIcon sx={{ fontSize: '0.8rem' }} />
                </IconButton>
              </Box>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1.5 }}>
                Record tool shots fired during this production
              </Typography>
              
              <Grid container spacing={1.5}>
                {/* Tool Selection */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Select Tool"
                    size="small"
                    value={toolUsageForm.tool_id}
                    onChange={(e) => handleToolUsageChange('tool_id', e.target.value)}
                    disabled={toolsLoading || tools.length === 0}
                    helperText={tools.length === 0 ? "No active tools found for this machine" : "Select the tool used"}
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                  >
                    <MenuItem value="">
                      <em>Select a tool...</em>
                    </MenuItem>
                    {tools.map((tool) => (
                      <MenuItem key={tool._id} value={tool._id}>
                        <Box>
                          <Typography variant="body2">
                            {tool.tool_name || tool.tool_code}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {tool.tool_type} - Shots: {tool.current_shots || 0}/{tool.max_shots || 'N/A'}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Shots Fired */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Shots Fired"
                    type="number"
                    size="small"
                    value={toolUsageForm.shots_fired}
                    onChange={(e) => handleToolUsageChange('shots_fired', e.target.value)}
                    placeholder="Number of shots fired"
                    inputProps={{ min: 0, step: 1 }}
                    helperText="Total shots/cycles performed"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                  />
                </Grid>

                {/* Tool Status Display */}
                {selectedTool && toolUsageForm.shots_fired && (
                  <Grid item xs={12}>
                    <Alert 
                      severity={toolStatus?.status === 'Critical' ? 'error' : toolStatus?.status === 'Warning' ? 'warning' : 'info'}
                      sx={{ fontSize: '0.7rem', py: 0 }}
                    >
                      <Typography variant="caption">
                        Tool Status: {toolStatus?.message}
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tool Usage Notes (Optional)"
                    size="small"
                    multiline
                    rows={2}
                    value={toolUsageForm.notes}
                    onChange={(e) => handleToolUsageChange('notes', e.target.value)}
                    placeholder="Any observations or issues with the tool..."
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Live Calculation Preview */}
            {formData.actual_hours && formData.actual_qty && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  Live Calculation Preview
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Completion Rate</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.success }}>
                      {calculateCompletionPercent().toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Time Variance</Typography>
                    <Typography sx={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      color: variance.isPositive ? COLORS.error : COLORS.success 
                    }}>
                      {variance.isPositive ? '+' : ''}{variance.value} hrs ({variance.isPositive ? '+' : ''}{variance.percent}%)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Estimated Efficiency</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.info }}>
                      {schedule?.planned_hours > 0 
                        ? Math.min(100, ((parseFloat(formData.actual_qty) / schedule.planned_qty) * 
                            (schedule.planned_hours / parseFloat(formData.actual_hours)) * 100)).toFixed(1)
                        : 0}%
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading || toolUsageLoading}
          size="small"
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          {success ? 'Close' : 'Cancel'}
        </Button>
        {!success && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || toolUsageLoading}
            startIcon={loading || toolUsageLoading ? <CircularProgress size={16} /> : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.success,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#1E5A2A' }
            }}
          >
            {loading || toolUsageLoading ? 'Processing...' : 'Complete Production'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CompleteProductionSchedule;