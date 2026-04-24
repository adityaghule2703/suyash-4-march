// // ViewProductionSchedule.jsx
// import React from 'react';
// import {
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Button,
//   Stack,
//   Paper,
//   Grid,
//   Chip,
//   IconButton,
//   Alert,
//   Divider
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Schedule as ScheduleIcon,
//   Factory as MachineIcon,
//   Assignment as WOrderIcon,
//   DateRange as DateIcon,
//   Warning as WarningIcon,
//   CheckCircle as CheckCircleIcon
// } from '@mui/icons-material';

// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   success: '#2E7D32',
//   warning: '#ED6C02',
//   error: '#D32F2F',
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

// const ViewProductionSchedule = ({ open, onClose, schedule }) => {
//   if (!schedule) return null;

//   const formatDateTime = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed': return { bg: '#D1FAE5', color: '#059669' };
//       case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
//       case 'Planned': return { bg: '#FEF3C7', color: '#D97706' };
//       case 'Cancelled': return { bg: '#FEE2E2', color: '#DC2626' };
//       default: return { bg: '#F1F5F9', color: '#475569' };
//     }
//   };

//   const getShiftColor = (shift) => {
//     const colors = {
//       General: { bg: '#E0E7FF', color: '#4338CA' },
//       Morning: { bg: '#FEF3C7', color: '#D97706' },
//       Evening: { bg: '#FCE7F3', color: '#BE185D' },
//       Night: { bg: '#E0E7FF', color: '#3730A3' }
//     };
//     return colors[shift] || { bg: '#F1F5F9', color: '#475569' };
//   };

//   const statusColors = getStatusColor(schedule.status);
//   const shiftColors = getShiftColor(schedule.shift);

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
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
//           <ScheduleIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
//           <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Production Schedule Details
//           </Typography>
//         </Box>
//         <IconButton onClick={onClose} size="small">
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//         <Stack spacing={2.5}>
//           {/* Header Info */}
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
//                   {schedule.schedule_id}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
//                 <Chip
//                   label={schedule.status}
//                   size="small"
//                   sx={{
//                     fontSize: '0.7rem',
//                     mt: 0.5,
//                     bgcolor: statusColors.bg,
//                     color: statusColors.color
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* Machine Information */}
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//               <MachineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//               Machine Information
//             </Typography>
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Name</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {typeof schedule.machine_id === 'object' 
//                     ? schedule.machine_id?.machine_name 
//                     : schedule.machine_id}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {typeof schedule.machine_id === 'object' 
//                     ? schedule.machine_id?.machine_code 
//                     : '-'}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* Work Order Information */}
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//               <WOrderIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//               Work Order Information
//             </Typography>
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {typeof schedule.wo_id === 'object' 
//                     ? schedule.wo_id?.wo_number 
//                     : schedule.wo_id}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {schedule.part_no || (typeof schedule.wo_id === 'object' ? schedule.wo_id?.part_no : '-')}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Name</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {typeof schedule.wo_id === 'object' ? schedule.wo_id?.part_name || '-' : '-'}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   Operation {schedule.operation_seq}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {schedule.planned_qty}
//                 </Typography>
//               </Grid>
//               {typeof schedule.wo_id === 'object' && schedule.wo_id?.priority && (
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Priority</Typography>
//                   <Chip
//                     label={schedule.wo_id?.priority}
//                     size="small"
//                     sx={{ fontSize: '0.7rem', mt: 0.5 }}
//                   />
//                 </Grid>
//               )}
//             </Grid>
//           </Paper>

//           {/* Schedule Details */}
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//               <DateIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//               Schedule Details
//             </Typography>
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {formatDate(schedule.scheduled_date)}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shift</Typography>
//                 <Chip
//                   label={schedule.shift}
//                   size="small"
//                   sx={{ fontSize: '0.7rem', mt: 0.5, bgcolor: shiftColors.bg, color: shiftColors.color }}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Hours</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {schedule.planned_hours} hours
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Start Time</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {schedule.start_time}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>End Time</Typography>
//                 <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                   {schedule.end_time}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* Actual Production (if completed) */}
//           {schedule.actual_hours > 0 && (
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle', color: COLORS.success }} />
//                 Actual Production
//               </Typography>
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Actual Hours</Typography>
//                   <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                     {schedule.actual_hours} hours
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Actual Quantity</Typography>
//                   <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
//                     {schedule.actual_qty || '-'}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Variance</Typography>
//                   <Typography sx={{ 
//                     fontSize: '0.85rem', 
//                     fontWeight: 500, 
//                     color: schedule.actual_hours > schedule.planned_hours ? '#DC2626' : '#059669' 
//                   }}>
//                     {schedule.actual_hours > schedule.planned_hours ? '+' : ''}
//                     {(schedule.actual_hours - schedule.planned_hours).toFixed(2)} hours
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Paper>
//           )}

//           {/* Conflict Warning */}
//           {schedule.conflict && (
//             <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
//                 <WarningIcon sx={{ fontSize: '0.8rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Schedule Conflict Detected
//               </Typography>
//               <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
//                 This schedule overlaps with another production schedule on the same machine.
//                 Please review and resolve the conflict.
//               </Typography>
//             </Alert>
//           )}

//           <Divider sx={{ borderColor: COLORS.border }} />

//           {/* Timestamps */}
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>
//               {formatDateTime(schedule.createdAt)}
//             </Typography>
//             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created By</Typography>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>
//               {typeof schedule.created_by === 'object' ? schedule.created_by?.username : schedule.created_by || '-'}
//             </Typography>
//             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated</Typography>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//               {formatDateTime(schedule.updatedAt)}
//             </Typography>
//           </Paper>
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         justifyContent: 'flex-end'
//       }}>
//         <Button
//           onClick={onClose}
//           size="small"
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             textTransform: 'none'
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewProductionSchedule;


// ViewProductionSchedule.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Chip,
  IconButton,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Factory as MachineIcon,
  Assignment as WOrderIcon,
  DateRange as DateIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Build as ToolIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
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

const ViewProductionSchedule = ({ open, onClose, schedule }) => {
  const [toolUsageRecords, setToolUsageRecords] = useState([]);
  const [loadingTools, setLoadingTools] = useState(false);

  useEffect(() => {
    if (schedule && open && schedule._id) {
      fetchToolUsageRecords();
    }
  }, [schedule, open]);

  const fetchToolUsageRecords = async () => {
    setLoadingTools(true);
    try {
      const token = localStorage.getItem('token');
      const woId = typeof schedule?.wo_id === 'object' ? schedule.wo_id._id : schedule?.wo_id;
      
      console.log('Fetching tool usage for WO ID:', woId, 'Operation:', schedule?.operation_seq);
      
      // Fetch tool usage records for this work order and operation
      const response = await axios.get(`${BASE_URL}/api/tool-usage`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          wo_id: woId,
          operation_seq: schedule?.operation_seq
        }
      });

      console.log('Tool usage response:', response.data);

      if (response.data.success && response.data.data) {
        // The data already has populated tool_id, wo_id, machine_id objects
        setToolUsageRecords(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching tool usage records:', err);
    } finally {
      setLoadingTools(false);
    }
  };

  if (!schedule) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#D1FAE5', color: '#059669' };
      case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Planned': return { bg: '#FEF3C7', color: '#D97706' };
      case 'Confirmed': return { bg: '#E0E7FF', color: '#4338CA' };
      case 'Postponed': return { bg: '#FEF3C7', color: '#D97706' };
      case 'Cancelled': return { bg: '#FEE2E2', color: '#DC2626' };
      default: return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  const getShiftColor = (shift) => {
    const colors = {
      General: { bg: '#E0E7FF', color: '#4338CA' },
      Morning: { bg: '#FEF3C7', color: '#D97706' },
      Evening: { bg: '#FCE7F3', color: '#BE185D' },
      Night: { bg: '#E0E7FF', color: '#3730A3' }
    };
    return colors[shift] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getEfficiencyColor = (utilization) => {
    if (utilization >= 100) return { bg: '#D1FAE5', color: '#059669' };
    if (utilization >= 85) return { bg: '#E0F2FE', color: '#0284C7' };
    if (utilization >= 70) return { bg: '#FEF3C7', color: '#D97706' };
    return { bg: '#FEE2E2', color: '#DC2626' };
  };

  const calculateUtilization = () => {
    if (!schedule.actual_hours || !schedule.planned_hours || schedule.planned_hours === 0) return null;
    return Math.min(200, Math.round((schedule.actual_hours / schedule.planned_hours) * 100));
  };

  const calculateCompletionRate = () => {
    if (!schedule.actual_qty || !schedule.planned_qty || schedule.planned_qty === 0) return null;
    return Math.min(100, Math.round((schedule.actual_qty / schedule.planned_qty) * 100));
  };

  const statusColors = getStatusColor(schedule.status);
  const shiftColors = getShiftColor(schedule.shift);
  const utilization = calculateUtilization();
  const completionRate = calculateCompletionRate();
  const efficiencyColors = utilization ? getEfficiencyColor(utilization) : null;

  // Get tool name safely (handle both object and string)
  const getToolName = (tool) => {
    if (!tool) return '-';
    if (typeof tool === 'object') {
      return tool.tool_name || tool.tool_code || tool._id || '-';
    }
    return tool;
  };

  const getToolCode = (tool) => {
    if (!tool) return '-';
    if (typeof tool === 'object') {
      return tool.tool_code || tool.tool_name || '-';
    }
    return tool;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <ScheduleIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Production Schedule Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Header Info */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                  {schedule.schedule_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                <Chip
                  label={schedule.status}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    mt: 0.5,
                    bgcolor: statusColors.bg,
                    color: statusColors.color
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Machine Information */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <MachineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Machine Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Name</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.machine_id === 'object' 
                    ? schedule.machine_id?.machine_name 
                    : schedule.machine_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.machine_id === 'object' 
                    ? schedule.machine_id?.machine_code 
                    : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Work Order Information */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <WOrderIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Work Order Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.wo_id === 'object' 
                    ? schedule.wo_id?.wo_number 
                    : schedule.wo_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.part_no || (typeof schedule.wo_id === 'object' ? schedule.wo_id?.part_no : '-')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Name</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.wo_id === 'object' ? schedule.wo_id?.part_name || '-' : '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  Operation {schedule.operation_seq}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.planned_qty?.toLocaleString()} units
                </Typography>
              </Grid>
              {typeof schedule.wo_id === 'object' && schedule.wo_id?.priority && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Priority</Typography>
                  <Chip
                    label={schedule.wo_id?.priority}
                    size="small"
                    sx={{ fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Schedule Details */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <DateIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Schedule Details
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {formatDate(schedule.scheduled_date)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shift</Typography>
                <Chip
                  label={schedule.shift}
                  size="small"
                  sx={{ fontSize: '0.7rem', mt: 0.5, bgcolor: shiftColors.bg, color: shiftColors.color }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Hours</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.planned_hours} hours
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Start Time</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.start_time}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>End Time</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.end_time}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Actual Production (if completed) */}
          {schedule.actual_hours > 0 && (
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle', color: COLORS.success }} />
                Actual Production
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Actual Hours</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {schedule.actual_hours} hours
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Actual Quantity</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {schedule.actual_qty?.toLocaleString() || '-'} units
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Variance</Typography>
                  <Typography sx={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 500, 
                    color: schedule.actual_hours > schedule.planned_hours ? '#DC2626' : '#059669' 
                  }}>
                    {schedule.actual_hours > schedule.planned_hours ? '+' : ''}
                    {(schedule.actual_hours - schedule.planned_hours).toFixed(2)} hours
                    {schedule.planned_hours > 0 && (
                      <span style={{ fontSize: '0.7rem', marginLeft: '4px' }}>
                        ({schedule.actual_hours > schedule.planned_hours ? '+' : ''}
                        {((schedule.actual_hours - schedule.planned_hours) / schedule.planned_hours * 100).toFixed(1)}%)
                      </span>
                    )}
                  </Typography>
                </Grid>
              </Grid>

              {/* Performance Metrics */}
              {(utilization || completionRate) && (
                <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                    <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={1.5}>
                    {utilization && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            Schedule Utilization
                          </Typography>
                          <Chip
                            label={`${utilization}%`}
                            size="small"
                            sx={{ 
                              fontSize: '0.7rem',
                              bgcolor: efficiencyColors.bg,
                              color: efficiencyColors.color,
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Box sx={{ height: 4, bgcolor: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                          <Box sx={{ width: `${Math.min(utilization, 100)}%`, height: '100%', bgcolor: efficiencyColors.color, borderRadius: 2 }} />
                        </Box>
                      </Grid>
                    )}
                    {completionRate && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            Completion Rate
                          </Typography>
                          <Chip
                            label={`${completionRate}%`}
                            size="small"
                            sx={{ 
                              fontSize: '0.7rem',
                              bgcolor: completionRate >= 100 ? '#D1FAE5' : completionRate >= 80 ? '#E0F2FE' : '#FEF3C7',
                              color: completionRate >= 100 ? '#059669' : completionRate >= 80 ? '#0284C7' : '#D97706',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Box sx={{ height: 4, bgcolor: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                          <Box sx={{ width: `${completionRate}%`, height: '100%', bgcolor: completionRate >= 100 ? '#059669' : completionRate >= 80 ? '#0284C7' : '#D97706', borderRadius: 2 }} />
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Paper>
          )}

          {/* Tool Usage Records Section - FIXED */}
          {toolUsageRecords.length > 0 && (
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <ToolIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Tool Usage Records
                {loadingTools && <CircularProgress size={12} sx={{ ml: 1 }} />}
              </Typography>
              
              <Stack spacing={1.5}>
                {toolUsageRecords.map((record, index) => (
                  <Box key={record._id || index} sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1, border: `1px solid ${COLORS.border}` }}>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Tool Name</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {getToolName(record.tool_id)}
                        </Typography>
                        {record.tool_id && typeof record.tool_id === 'object' && record.tool_id.tool_code && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Code: {record.tool_id.tool_code}
                          </Typography>
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Shots Fired</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {record.shots_fired?.toLocaleString() || 0}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Shot Progress</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {record.shots_before?.toLocaleString() || 0} → {record.shots_after?.toLocaleString() || 0}
                        </Typography>
                        {record.max_shots && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Max: {record.max_shots.toLocaleString()}
                          </Typography>
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Usage Date</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {formatDateTime(record.usage_date)}
                        </Typography>
                      </Grid>
                      {record.near_maintenance && (
                        <Grid size={12}>
                          <Alert severity="warning" sx={{ fontSize: '0.7rem', py: 0 }}>
                            Tool is near maintenance threshold!
                          </Alert>
                        </Grid>
                      )}
                      {record.notes && (
                        <Grid size={12}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Notes</Typography>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {record.notes}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* No Tool Usage Records */}
          {!loadingTools && toolUsageRecords.length === 0 && schedule.actual_hours > 0 && (
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1.5 }}>
                <ToolIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Tool Usage Records
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, textAlign: 'center', py: 2 }}>
                No tool usage records found for this production schedule
              </Typography>
            </Paper>
          )}

          {/* Conflict Warning */}
          {schedule.conflict && (
            <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                <WarningIcon sx={{ fontSize: '0.8rem', mr: 0.5, verticalAlign: 'middle' }} />
                Schedule Conflict Detected
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                This schedule overlaps with another production schedule on the same machine.
                Please review and resolve the conflict.
              </Typography>
            </Alert>
          )}

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Timestamps */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>
              {formatDateTime(schedule.createdAt)}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created By</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>
              {typeof schedule.created_by === 'object' ? schedule.created_by?.username : schedule.created_by || '-'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
              {formatDateTime(schedule.updatedAt)}
            </Typography>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end'
      }}>
        <Button
          onClick={onClose}
          size="small"
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProductionSchedule;