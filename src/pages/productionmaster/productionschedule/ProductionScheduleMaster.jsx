// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Box,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     IconButton,
//     Button,
//     TextField,
//     InputAdornment,
//     Tooltip,
//     Typography,
//     Snackbar,
//     TablePagination,
//     Checkbox,
//     Stack,
//     Chip,
//     Avatar,
//     Menu,
//     MenuItem,
//     ListItemIcon,
//     ListItemText,
//     Divider,
//     Alert,
//     CircularProgress,
//     FormControl,
//     InputLabel,
//     Select,
//     Grid
// } from '@mui/material';
// import {
//     Search as SearchIcon,
//     Add as AddIcon,
//     Visibility as ViewIcon,
//     Edit as EditIcon,
//     MoreVert as MoreVertIcon,
//     Schedule as ScheduleIcon,
//     CheckCircle as CheckCircleIcon,
//     Warning as WarningIcon,
//     PlayArrow as PlayArrowIcon,
//     Factory as MachineIcon,
//     Cancel as CancelIcon,
//     EventRepeat as EventRepeatIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import AddProductionSchedule from './AddProductionSchedule';
// import EditProductionSchedule from './EditProductionSchedule';
// import CompleteProductionSchedule from './CompleteProductionSchedule';
// import ViewProductionSchedule from './ViewProductionSchedule';
// import ConfirmedProductionSchedule from './ConfirmedProdutionSchedule';
// import StartProductionSchedule from './StartProductionSchedule';
// import CancelProductionSchedule from './CancelProductionSchedule';
// import PostponeProductionSchedule from './PostpondProductionSchedule';

// // ─── Design Tokens ────────────────────────────────────────────────────────────
// const COLORS = {
//     primary: '#063C3F',
//     primaryLight: '#E8F0F1',
//     primaryDark: '#05292B',
//     success: '#2E7D32',
//     warning: '#ED6C02',
//     error: '#D32F2F',
//     info: '#0288D1',
//     border: '#E5E7EB',
//     text: {
//         primary: '#111827',
//         secondary: '#6B7280',
//         tertiary: '#9CA3AF',
//         light: '#FFFFFF'
//     },
//     background: {
//         light: '#F9FAFB',
//         white: '#FFFFFF',
//         hover: '#F3F4F6',
//         tableHeader: '#063C3F'
//     }
// };

// // ─── Constants ────────────────────────────────────────────────────────────────
// const SHIFT_OPTIONS = ['All', 'General', 'Morning', 'Afternoon', 'Night'];
// const STATUS_OPTIONS = ['All', 'Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Postponed'];

// // ─── Machine Status Config ────────────────────────────────────────────────────
// const MACHINE_STATUS_CONFIG = {
//     'Active': {
//         bar: '#10B981',
//         iconBg: '#D1FAE5',
//         iconColor: '#059669',
//         badgeBg: '#D1FAE5',
//         badgeColor: '#065F46',
//         pulse: true,
//         pulseSpeed: '1.4s',
//         summaryColor: '#059669',
//     },
//     'Idle': {
//         bar: '#9CA3AF',
//         iconBg: '#F3F4F6',
//         iconColor: '#6B7280',
//         badgeBg: '#F3F4F6',
//         badgeColor: '#374151',
//         pulse: false,
//         summaryColor: '#6B7280',
//     },
//     'Under Maintenance': {
//         bar: '#F59E0B',
//         iconBg: '#FEF3C7',
//         iconColor: '#B45309',
//         badgeBg: '#FEF3C7',
//         badgeColor: '#92400E',
//         pulse: true,
//         pulseSpeed: '2s',
//         summaryColor: '#D97706',
//     },
//     'Breakdown': {
//         bar: '#EF4444',
//         iconBg: '#FEE2E2',
//         iconColor: '#B91C1C',
//         badgeBg: '#FEE2E2',
//         badgeColor: '#7F1D1D',
//         pulse: true,
//         pulseSpeed: '0.7s',
//         summaryColor: '#DC2626',
//     },
//     'Decommissioned': {
//         bar: '#A78BFA',
//         iconBg: '#EDE9FE',
//         iconColor: '#6D28D9',
//         badgeBg: '#EDE9FE',
//         badgeColor: '#4C1D95',
//         pulse: false,
//         summaryColor: '#7C3AED',
//     },
// };

// const getUtilColor = (u) =>
//     u >= 80 ? '#10B981' : u >= 50 ? '#3B82F6' : u > 0 ? '#F59E0B' : '#E5E7EB';

// // ─── Pulse Dot ────────────────────────────────────────────────────────────────
// const PulseDot = ({ color, speed }) => (
//     <Box
//         component="span"
//         sx={{
//             display: 'inline-block',
//             width: 7,
//             height: 7,
//             borderRadius: '50%',
//             bgcolor: color,
//             mr: 0.6,
//             flexShrink: 0,
//             '@keyframes machinePulse': {
//                 '0%, 100%': { opacity: 1 },
//                 '50%': { opacity: 0.2 },
//             },
//             animation: speed ? `machinePulse ${speed} infinite` : 'none',
//         }}
//     />
// );

// // ─── Machine Summary Pills ─────────────────────────────────────────────────────
// const MachineSummaryBar = ({ machines }) => {
//     const counts = Object.keys(MACHINE_STATUS_CONFIG).reduce((acc, key) => {
//         acc[key] = machines.filter(m => m.status === key).length;
//         return acc;
//     }, {});

//     const pills = [
//         { label: 'Active', key: 'Active' },
//         { label: 'Idle', key: 'Idle' },
//         { label: 'Maintenance', key: 'Under Maintenance' },
//         { label: 'Breakdown', key: 'Breakdown' },
//         { label: 'Decommissioned', key: 'Decommissioned' },
//     ].filter(p => counts[p.key] > 0);

//     if (pills.length === 0) return null;

//     return (
//         <Stack direction="row" spacing={1} flexWrap="wrap" mb={1.5}>
//             {pills.map(({ label, key }) => {
//                 const cfg = MACHINE_STATUS_CONFIG[key];
//                 return (
//                     <Stack
//                         key={key}
//                         direction="row"
//                         alignItems="center"
//                         spacing={0.75}
//                         sx={{
//                             px: 1.5,
//                             py: 0.75,
//                             borderRadius: 2,
//                             border: `1px solid ${COLORS.border}`,
//                             bgcolor: COLORS.background.white,
//                         }}
//                     >
//                         <PulseDot color={cfg.bar} speed={cfg.pulse ? cfg.pulseSpeed : null} />
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: cfg.summaryColor }}>
//                             {counts[key]}
//                         </Typography>
//                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                             {label}
//                         </Typography>
//                     </Stack>
//                 );
//             })}
//         </Stack>
//     );
// };

// // ─── Machine Card ─────────────────────────────────────────────────────────────
// const MachineCard = ({ machine, isSelected, onClick }) => {
//     const cfg = MACHINE_STATUS_CONFIG[machine.status] || MACHINE_STATUS_CONFIG['Idle'];
//     const oeeTarget = machine.oee_target_percent || 0;
//     const showOEE = !['Under Maintenance', 'Decommissioned', 'Breakdown'].includes(machine.status);
//     const footerStats = [
//         { val: `${machine.capacity_value || 0} ${machine.capacity_unit || ''}`.trim(), label: 'Capacity' },
//         { val: `${machine.shifts_per_day || 0}×${machine.hours_per_shift || 0}h`, label: 'Shifts/Day' },
//         { val: machine.machine_type || '—', label: 'Type' },
//     ];

//     return (
//         <Paper
//             elevation={0}
//             onClick={() => onClick(machine)}
//             sx={{
//                 cursor: 'pointer',
//                 borderRadius: 2.5,
//                 overflow: 'hidden',
//                 border: `1.5px solid ${isSelected ? COLORS.primary : COLORS.border}`,
//                 boxShadow: isSelected
//                     ? `0 0 0 3px ${COLORS.primary}1A`
//                     : 'none',
//                 transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
//                 display: 'flex',
//                 '&:hover': {
//                     transform: 'translateY(-2px)',
//                     boxShadow: '0 4px 16px rgba(0,0,0,0.09)',
//                     borderColor: isSelected ? COLORS.primary : '#9CA3AF',
//                 },
//             }}
//         >
//             {/* Left status accent bar */}
//             <Box sx={{ width: 4, flexShrink: 0, bgcolor: cfg.bar }} />

//             <Box sx={{ p: 1.5, flex: 1, minWidth: 0 }}>
//                 {/* Top row: icon + status badge */}
//                 <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.25}>
//                     <Avatar
//                         sx={{
//                             width: 36,
//                             height: 36,
//                             borderRadius: 1.5,
//                             bgcolor: cfg.iconBg,
//                         }}
//                     >
//                         <MachineIcon sx={{ fontSize: '1.1rem', color: cfg.iconColor }} />
//                     </Avatar>
//                     <Chip
//                         size="small"
//                         label={
//                             <Stack direction="row" alignItems="center" sx={{ lineHeight: 1 }}>
//                                 <PulseDot color={cfg.bar} speed={cfg.pulse ? cfg.pulseSpeed : null} />
//                                 {machine.status}
//                             </Stack>
//                         }
//                         sx={{
//                             height: 22,
//                             fontSize: '0.6rem',
//                             fontWeight: 500,
//                             bgcolor: cfg.badgeBg,
//                             color: cfg.badgeColor,
//                             '& .MuiChip-label': { px: 0.75 },
//                         }}
//                     />
//                 </Stack>

//                 {/* Machine name */}
//                 <Typography
//                     sx={{
//                         fontSize: '0.78rem',
//                         fontWeight: 600,
//                         color: COLORS.text.primary,
//                         lineHeight: 1.3,
//                         mb: 0.25,
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                     }}
//                 >
//                     {machine.machine_name}
//                 </Typography>

//                 {/* Code · Work Centre */}
//                 <Typography sx={{ fontSize: '0.62rem', color: COLORS.text.tertiary, mb: 0.4 }}>
//                     {machine.machine_code} · {machine.work_centre || 'No Work Centre'}
//                 </Typography>

//                 {/* Make · Model */}
//                 <Typography sx={{ fontSize: '0.62rem', color: COLORS.text.secondary, mb: 1 }}>
//                     {[machine.make, machine.model].filter(Boolean).join(' · ') || '—'}
//                 </Typography>

//                 {/* OEE Target bar */}
//                 {showOEE ? (
//                     <>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
//                             <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>
//                                 OEE Target
//                             </Typography>
//                             <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: getUtilColor(oeeTarget) }}>
//                                 {oeeTarget}%
//                             </Typography>
//                         </Stack>
//                         <Box sx={{ height: 4, borderRadius: 2, bgcolor: '#F3F4F6', overflow: 'hidden', mb: 1 }}>
//                             <Box
//                                 sx={{
//                                     height: '100%',
//                                     width: `${oeeTarget}%`,
//                                     bgcolor: getUtilColor(oeeTarget),
//                                     borderRadius: 2,
//                                     transition: 'width 0.4s ease',
//                                 }}
//                             />
//                         </Box>
//                     </>
//                 ) : (
//                     <Typography
//                         sx={{
//                             fontSize: '0.6rem',
//                             color: COLORS.text.tertiary,
//                             fontStyle: 'italic',
//                             mb: 1,
//                             minHeight: 28,
//                             display: 'flex',
//                             alignItems: 'center',
//                         }}
//                     >
//                         {machine.status === 'Under Maintenance' && 'Maintenance in progress'}
//                         {machine.status === 'Breakdown' && 'Machine down — check required'}
//                         {machine.status === 'Decommissioned' && 'Machine decommissioned'}
//                     </Typography>
//                 )}

//                 {/* Footer stats: Capacity · Shifts · Type */}
//                 <Divider sx={{ mb: 1, borderColor: COLORS.border }} />
//                 <Stack direction="row" justifyContent="space-around">
//                     {footerStats.map((stat, i) => (
//                         <Box key={i} sx={{ textAlign: 'center' }}>
//                             <Typography
//                                 sx={{
//                                     fontSize: '0.65rem',
//                                     fontWeight: 600,
//                                     color: COLORS.text.primary,
//                                     whiteSpace: 'nowrap',
//                                     overflow: 'hidden',
//                                     textOverflow: 'ellipsis',
//                                     maxWidth: 64,
//                                 }}
//                             >
//                                 {stat.val}
//                             </Typography>
//                             <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary, mt: 0.25 }}>
//                                 {stat.label}
//                             </Typography>
//                         </Box>
//                     ))}
//                 </Stack>
//             </Box>
//         </Paper>
//     );
// };

// // ─── Action Menu ──────────────────────────────────────────────────────────────
// const ActionMenu = ({
//     item,
//     anchorEl,
//     onOpen,
//     onClose,
//     onView,
//     onEdit,
//     onConfirm,
//     onStart,
//     onComplete,
//     onCancel,
//     onPostpone,
// }) => {
//     const canConfirm = item?.status === 'Planned';
//     const canStart = item?.status === 'Confirmed';
//     const canComplete = item?.status === 'In Progress';
//     const canCancel = ['Planned', 'Confirmed', 'Postponed'].includes(item?.status);
//     const canPostpone = ['Planned', 'Confirmed', 'In Progress'].includes(item?.status);
//     const canEdit = item?.status !== 'Completed' && item?.status !== 'Cancelled';

//     return (
//         <>
//             <Tooltip title="Actions">
//                 <IconButton
//                     size="small"
//                     onClick={onOpen}
//                     sx={{
//                         color: COLORS.text.secondary,
//                         '&:hover': { bgcolor: `${COLORS.primary}20` },
//                     }}
//                 >
//                     <MoreVertIcon fontSize="small" />
//                 </IconButton>
//             </Tooltip>
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={onClose}
//                 PaperProps={{
//                     elevation: 3,
//                     sx: {
//                         mt: 1,
//                         minWidth: 200,
//                         borderRadius: 2,
//                         border: `1px solid ${COLORS.border}`,
//                         boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
//                     },
//                 }}
//             >
//                 <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
//                     <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                         <ViewIcon fontSize="small" />
//                     </ListItemIcon>
//                     <ListItemText>
//                         <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
//                             View Details
//                         </Typography>
//                     </ListItemText>
//                 </MenuItem>

//                 {canConfirm && (
//                     <MenuItem onClick={() => { onConfirm(item); onClose(); }} sx={{ py: 1.5 }}>
//                         <ListItemIcon sx={{ color: '#059669', minWidth: 36 }}>
//                             <CheckCircleIcon fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText>
//                             <Typography variant="body2" fontWeight={500} sx={{ color: '#059669', fontSize: '0.75rem' }}>
//                                 Confirm Schedule
//                             </Typography>
//                         </ListItemText>
//                     </MenuItem>
//                 )}

//                 {canStart && (
//                     <MenuItem onClick={() => { onStart(item); onClose(); }} sx={{ py: 1.5 }}>
//                         <ListItemIcon sx={{ color: '#0284C7', minWidth: 36 }}>
//                             <PlayArrowIcon fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText>
//                             <Typography variant="body2" fontWeight={500} sx={{ color: '#0284C7', fontSize: '0.75rem' }}>
//                                 Start Production
//                             </Typography>
//                         </ListItemText>
//                     </MenuItem>
//                 )}

//                 {canComplete && (
//                     <MenuItem onClick={() => { onComplete(item); onClose(); }} sx={{ py: 1.5 }}>
//                         <ListItemIcon sx={{ color: '#059669', minWidth: 36 }}>
//                             <CheckCircleIcon fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText>
//                             <Typography variant="body2" fontWeight={500} sx={{ color: '#059669', fontSize: '0.75rem' }}>
//                                 Complete Production
//                             </Typography>
//                         </ListItemText>
//                     </MenuItem>
//                 )}

//                 {canEdit && (
//                     <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
//                         <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                             <EditIcon fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText>
//                             <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
//                                 Reschedule
//                             </Typography>
//                         </ListItemText>
//                     </MenuItem>
//                 )}

//                 {canPostpone && (
//                     <MenuItem onClick={() => { onPostpone(item); onClose(); }} sx={{ py: 1.5 }}>
//                         <ListItemIcon sx={{ color: '#D97706', minWidth: 36 }}>
//                             <EventRepeatIcon fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText>
//                             <Typography variant="body2" fontWeight={500} sx={{ color: '#D97706', fontSize: '0.75rem' }}>
//                                 Postpone Schedule
//                             </Typography>
//                         </ListItemText>
//                     </MenuItem>
//                 )}

//                 {canCancel && (
//                     <>
//                         <Divider />
//                         <MenuItem onClick={() => { onCancel(item); onClose(); }} sx={{ py: 1.5 }}>
//                             <ListItemIcon sx={{ color: COLORS.error, minWidth: 36 }}>
//                                 <CancelIcon fontSize="small" />
//                             </ListItemIcon>
//                             <ListItemText>
//                                 <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.error, fontSize: '0.75rem' }}>
//                                     Cancel Schedule
//                                 </Typography>
//                             </ListItemText>
//                         </MenuItem>
//                     </>
//                 )}
//             </Menu>
//         </>
//     );
// };

// // ─── Main Component ───────────────────────────────────────────────────────────
// const ProductionScheduleMaster = () => {
//     const [schedules, setSchedules] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchInput, setSearchInput] = useState('');
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [totalItems, setTotalItems] = useState(0);
//     const [selected, setSelected] = useState([]);
//     const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//     const [selectedSchedule, setSelectedSchedule] = useState(null);
//     const [selectedScheduleForAction, setSelectedScheduleForAction] = useState(null);
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//     // Filter states
//     const [machineFilter, setMachineFilter] = useState('');
//     const [shiftFilter, setShiftFilter] = useState('All');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [fromDateFilter, setFromDateFilter] = useState('');
//     const [toDateFilter, setToDateFilter] = useState('');
//     const [machines, setMachines] = useState([]);

//     // Modal states
//     const [openAddModal, setOpenAddModal] = useState(false);
//     const [openViewModal, setOpenViewModal] = useState(false);
//     const [openEditModal, setOpenEditModal] = useState(false);
//     const [openConfirmModal, setOpenConfirmModal] = useState(false);
//     const [openStartModal, setOpenStartModal] = useState(false);
//     const [openCompleteModal, setOpenCompleteModal] = useState(false);
//     const [openCancelModal, setOpenCancelModal] = useState(false);
//     const [openPostponeModal, setOpenPostponeModal] = useState(false);

//     // Debounce search
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setSearchTerm(searchInput);
//             setPage(0);
//         }, 500);
//         return () => clearTimeout(timer);
//     }, [searchInput]);

//     // Fetch machines
//     useEffect(() => {
//         fetchMachines();
//     }, []);

//     const fetchMachines = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`${BASE_URL}/api/machines`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (response.data.success) {
//                 setMachines(response.data.data || []);
//             }
//         } catch (err) {
//             console.error('Error fetching machines:', err);
//         }
//     };

//     // Fetch Schedules
//     const fetchSchedules = useCallback(async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('token');
//             const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });

//             if (searchTerm) params.append('search', searchTerm);
//             if (machineFilter) params.append('machine_id', machineFilter);
//             if (shiftFilter && shiftFilter !== 'All') params.append('shift', shiftFilter);
//             if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
//             if (fromDateFilter) params.append('from', fromDateFilter);
//             if (toDateFilter) params.append('to', toDateFilter);

//             const response = await axios.get(
//                 `${BASE_URL}/api/production-schedule?${params.toString()}`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (response.data.success) {
//                 setSchedules(response.data.data || []);
//                 setTotalItems(response.data.total || response.data.data.length);
//             } else {
//                 showNotification('Failed to load production schedules', 'error');
//             }
//         } catch (err) {
//             console.error('Error fetching schedules:', err);
//             showNotification('Failed to load production schedules', 'error');
//         } finally {
//             setLoading(false);
//         }
//     }, [page, rowsPerPage, searchTerm, machineFilter, shiftFilter, statusFilter, fromDateFilter, toDateFilter]);

//     useEffect(() => {
//         fetchSchedules();
//     }, [fetchSchedules]);

//     const handleMachineClick = (machine) => {
//         setMachineFilter(prev => (prev === machine._id ? '' : machine._id));
//         setPage(0);
//     };

//     const handleSelectAll = (event) => {
//         setSelected(event.target.checked ? schedules.map(s => s._id) : []);
//     };

//     const handleSelect = (id) => {
//         setSelected(prev =>
//             prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
//         );
//     };

//     const handleChangePage = (_, newPage) => {
//         setPage(newPage);
//         setSelected([]);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//         setSelected([]);
//     };

//     const handleAddSuccess = () => { fetchSchedules(); showNotification('Production schedule created successfully!', 'success'); };
//     const handleEditSuccess = () => { fetchSchedules(); showNotification('Production schedule rescheduled successfully!', 'success'); };
//     const handleConfirmSuccess = () => { fetchSchedules(); showNotification('Production schedule confirmed successfully!', 'success'); };
//     const handleStartSuccess = () => { fetchSchedules(); showNotification('Production started successfully!', 'success'); };
//     const handleCompleteSuccess = () => { fetchSchedules(); showNotification('Production completed successfully!', 'success'); };
//     const handleCancelSuccess = () => { fetchSchedules(); showNotification('Production schedule cancelled successfully!', 'success'); };
//     const handlePostponeSuccess = () => { fetchSchedules(); showNotification('Production schedule postponed successfully!', 'success'); };

//     const handleActionMenuOpen = (event, schedule) => {
//         setActionMenuAnchor(event.currentTarget);
//         setSelectedScheduleForAction(schedule);
//     };

//     const handleActionMenuClose = () => {
//         setActionMenuAnchor(null);
//         setSelectedScheduleForAction(null);
//     };

//     const openViewModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenViewModal(true); handleActionMenuClose(); };
//     const openEditModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenEditModal(true); handleActionMenuClose(); };
//     const openConfirmModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenConfirmModal(true); handleActionMenuClose(); };
//     const openStartModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenStartModal(true); handleActionMenuClose(); };
//     const openCompleteModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenCompleteModal(true); handleActionMenuClose(); };
//     const openCancelModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenCancelModal(true); handleActionMenuClose(); };
//     const openPostponeModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenPostponeModal(true); handleActionMenuClose(); };

//     const showNotification = (message, severity) => setSnackbar({ open: true, message, severity });

//     const clearFilters = () => {
//         setSearchInput('');
//         setSearchTerm('');
//         setMachineFilter('');
//         setShiftFilter('All');
//         setStatusFilter('All');
//         setFromDateFilter('');
//         setToDateFilter('');
//         setPage(0);
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return '-';
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric', month: 'short', day: 'numeric',
//         });
//     };

//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'Completed':   return { bg: '#D1FAE5', color: '#059669' };
//             case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
//             case 'Confirmed':   return { bg: '#D1FAE5', color: '#059669' };
//             case 'Planned':     return { bg: '#FEF3C7', color: '#D97706' };
//             case 'Cancelled':   return { bg: '#FEE2E2', color: '#DC2626' };
//             case 'Postponed':   return { bg: '#FEF3C7', color: '#D97706' };
//             default:            return { bg: '#F1F5F9', color: '#475569' };
//         }
//     };

//     const getShiftColor = (shift) => {
//         const colors = {
//             General:   { bg: '#E0E7FF', color: '#4338CA' },
//             Morning:   { bg: '#FEF3C7', color: '#D97706' },
//             Afternoon: { bg: '#FCE7F3', color: '#BE185D' },
//             Night:     { bg: '#E0E7FF', color: '#3730A3' },
//         };
//         return colors[shift] || { bg: '#F1F5F9', color: '#475569' };
//     };

//     const getMachineName = (schedule) => {
//         if (typeof schedule.machine_id === 'object') {
//             return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
//         }
//         return machines.find(m => m._id === schedule.machine_id)?.machine_name || schedule.machine_id || '-';
//     };

//     const getWONumber = (schedule) => {
//         if (typeof schedule.wo_id === 'object') return schedule.wo_id?.wo_number || '-';
//         return schedule.wo_id || '-';
//     };

//     const getPartNo = (schedule) => {
//         if (typeof schedule.wo_id === 'object') return schedule.wo_id?.part_no || schedule.part_no || '-';
//         return schedule.part_no || '-';
//     };

//     return (
//         <Box sx={{ p: 2.5 }}>
//             {/* ── Page Header ─────────────────────────────────── */}
//             <Box sx={{ mb: 2.5 }}>
//                 <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
//                     Production Schedule Master
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//                     Manage production schedules, track machine utilization, and monitor production progress
//                 </Typography>
//             </Box>

//             {/* ── Machine Cards Section ────────────────────────── */}
//             {machines.length > 0 && (
//                 <Box sx={{ mb: 2.5 }}>
//                     {/* Section header */}
//                     <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.25}>
//                         <Typography
//                             sx={{
//                                 fontSize: '0.7rem',
//                                 fontWeight: 600,
//                                 color: COLORS.text.secondary,
//                                 letterSpacing: '0.7px',
//                                 textTransform: 'uppercase',
//                             }}
//                         >
//                             Machines ({machines.length})
//                         </Typography>
//                         {machineFilter && (
//                             <Button
//                                 size="small"
//                                 onClick={() => setMachineFilter('')}
//                                 sx={{ fontSize: '0.65rem', textTransform: 'none', color: COLORS.primary, p: 0, minWidth: 0 }}
//                             >
//                                 Clear selection
//                             </Button>
//                         )}
//                     </Stack>

//                     {/* Summary pills */}
//                     <MachineSummaryBar machines={machines} />

//                     {/* Cards grid */}
//                     <Box
//                         sx={{
//                             display: 'grid',
//                             gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
//                             gap: 1.5,
//                         }}
//                     >
//                         {machines.map((machine) => (
//                             <MachineCard
//                                 key={machine._id}
//                                 machine={machine}
//                                 isSelected={machineFilter === machine._id}
//                                 onClick={handleMachineClick}
//                             />
//                         ))}
//                     </Box>
//                 </Box>
//             )}

//             {/* ── Filters Bar ─────────────────────────────────── */}
//             <Paper
//                 sx={{
//                     p: 1.5,
//                     mb: 2.5,
//                     borderRadius: 2,
//                     bgcolor: COLORS.background.white,
//                     boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
//                     border: `1px solid ${COLORS.border}`,
//                 }}
//             >
//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
//                     <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
//                         <TextField
//                             placeholder="Search by schedule ID, WO number..."
//                             size="small"
//                             value={searchInput}
//                             onChange={(e) => setSearchInput(e.target.value)}
//                             sx={{
//                                 width: { xs: '100%', sm: 250 },
//                                 '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                             }}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                                     </InputAdornment>
//                                 ),
//                                 sx: { height: 36, bgcolor: COLORS.background.light },
//                             }}
//                         />

//                         <FormControl size="small" sx={{ minWidth: 150 }}>
//                             <InputLabel sx={{ fontSize: '0.75rem' }}>Shift</InputLabel>
//                             <Select
//                                 value={shiftFilter}
//                                 onChange={(e) => setShiftFilter(e.target.value)}
//                                 label="Shift"
//                                 sx={{ height: 36, fontSize: '0.75rem' }}
//                             >
//                                 {SHIFT_OPTIONS.map(s => (
//                                     <MenuItem key={s} value={s} sx={{ fontSize: '0.75rem' }}>{s}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>

//                         <FormControl size="small" sx={{ minWidth: 100 }}>
//                             <InputLabel sx={{ fontSize: '0.75rem' }}>Status</InputLabel>
//                             <Select
//                                 value={statusFilter}
//                                 onChange={(e) => setStatusFilter(e.target.value)}
//                                 label="Status"
//                                 sx={{ height: 36, fontSize: '0.75rem' }}
//                             >
//                                 {STATUS_OPTIONS.map(s => (
//                                     <MenuItem key={s} value={s} sx={{ fontSize: '0.75rem' }}>{s}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>

//                         <Button
//                             size="small"
//                             onClick={clearFilters}
//                             sx={{ height: 36, textTransform: 'none', fontSize: '0.7rem' }}
//                         >
//                             Clear Filters
//                         </Button>
//                     </Stack>

//                     <Stack direction="row" spacing={1.5} alignItems="center">
//                         <Button
//                             variant="contained"
//                             startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                             onClick={() => setOpenAddModal(true)}
//                             sx={{
//                                 height: 36,
//                                 borderRadius: 1.5,
//                                 bgcolor: COLORS.primaryDark,
//                                 fontSize: '0.75rem',
//                                 fontWeight: 500,
//                                 textTransform: 'none',
//                                 boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
//                                 '&:hover': { bgcolor: COLORS.primaryDark },
//                             }}
//                         >
//                             Add Schedule
//                         </Button>
//                     </Stack>
//                 </Stack>
//             </Paper>

//             {/* ── Schedules Table ──────────────────────────────── */}
//             <Paper
//                 sx={{
//                     width: '100%',
//                     borderRadius: 2,
//                     overflow: 'hidden',
//                     boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
//                     border: `1px solid ${COLORS.border}`,
//                 }}
//             >
//                 <TableContainer>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow
//                                 sx={{
//                                     bgcolor: COLORS.background.tableHeader,
//                                     '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 },
//                                 }}
//                             >
//                                 <TableCell padding="checkbox" sx={{ width: 40 }}>
//                                     <Checkbox
//                                         indeterminate={selected.length > 0 && selected.length < schedules.length}
//                                         checked={schedules.length > 0 && selected.length === schedules.length}
//                                         onChange={handleSelectAll}
//                                         sx={{
//                                             color: COLORS.text.light,
//                                             '&.Mui-checked': { color: COLORS.text.light },
//                                             '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
//                                             '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
//                                         }}
//                                         disabled={loading || schedules.length === 0}
//                                     />
//                                 </TableCell>
//                                 {['Schedule ID', 'Machine', 'Work Order', 'Part / Operation', 'Schedule Date', 'Shift / Hours', 'Status'].map(col => (
//                                     <TableCell key={col} sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>
//                                         {col}
//                                     </TableCell>
//                                 ))}
//                                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light, width: 60 }} align="center">
//                                     Actions
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                                         <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                                         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
//                                             Loading schedules...
//                                         </Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             ) : schedules.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                                         <Box sx={{ textAlign: 'center' }}>
//                                             <ScheduleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
//                                             <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
//                                                 {searchTerm || machineFilter ? 'No schedules found' : 'No production schedules available'}
//                                             </Typography>
//                                             <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                                                 {searchTerm || machineFilter
//                                                     ? 'Try adjusting your search terms'
//                                                     : 'Add your first schedule to get started'}
//                                             </Typography>
//                                         </Box>
//                                     </TableCell>
//                                 </TableRow>
//                             ) : (
//                                 schedules.map((schedule) => {
//                                     const isSelected = selected.includes(schedule._id);
//                                     const isActionMenuOpen =
//                                         Boolean(actionMenuAnchor) && selectedScheduleForAction?._id === schedule._id;
//                                     const statusColors = getStatusColor(schedule.status);
//                                     const shiftColors = getShiftColor(schedule.shift);

//                                     return (
//                                         <TableRow
//                                             key={schedule._id}
//                                             hover
//                                             selected={isSelected}
//                                             sx={{
//                                                 bgcolor: COLORS.background.white,
//                                                 '&:hover': { bgcolor: COLORS.background.hover },
//                                                 '&.Mui-selected': { bgcolor: `${COLORS.primary}10` },
//                                                 '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border },
//                                             }}
//                                         >
//                                             <TableCell padding="checkbox">
//                                                 <Checkbox
//                                                     checked={isSelected}
//                                                     onChange={() => handleSelect(schedule._id)}
//                                                     sx={{
//                                                         color: COLORS.primary,
//                                                         '&.Mui-checked': { color: COLORS.primary },
//                                                         '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
//                                                     }}
//                                                 />
//                                             </TableCell>

//                                             <TableCell>
//                                                 <Stack direction="row" alignItems="center" spacing={0.5}>
//                                                     <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
//                                                         {schedule.schedule_id}
//                                                     </Typography>
//                                                     {schedule.conflict && (
//                                                         <WarningIcon sx={{ fontSize: '0.7rem', color: COLORS.warning }} />
//                                                     )}
//                                                 </Stack>
//                                             </TableCell>

//                                             <TableCell>
//                                                 <Stack direction="row" spacing={1} alignItems="center">
//                                                     <MachineIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
//                                                     <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                                                         {getMachineName(schedule)}
//                                                     </Typography>
//                                                 </Stack>
//                                             </TableCell>

//                                             <TableCell>
//                                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                                                     {getWONumber(schedule)}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell>
//                                                 <Typography sx={{ fontSize: '0.75rem' }}>{getPartNo(schedule)}</Typography>
//                                                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                                                     Op {schedule.operation_seq}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell>
//                                                 <Typography sx={{ fontSize: '0.75rem' }}>
//                                                     {formatDate(schedule.scheduled_date)}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell>
//                                                 <Chip
//                                                     label={schedule.shift}
//                                                     size="small"
//                                                     sx={{ fontSize: '0.6rem', height: 20, bgcolor: shiftColors.bg, color: shiftColors.color }}
//                                                 />
//                                                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                                                     {schedule.planned_hours} hrs
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell>
//                                                 <Chip
//                                                     label={schedule.status}
//                                                     size="small"
//                                                     sx={{
//                                                         fontSize: '0.65rem',
//                                                         fontWeight: 500,
//                                                         height: 24,
//                                                         bgcolor: statusColors.bg,
//                                                         color: statusColors.color,
//                                                     }}
//                                                 />
//                                             </TableCell>

//                                             <TableCell align="center">
//                                                 <ActionMenu
//                                                     item={schedule}
//                                                     anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
//                                                     onOpen={(e) => handleActionMenuOpen(e, schedule)}
//                                                     onClose={handleActionMenuClose}
//                                                     onView={openViewModalHandler}
//                                                     onEdit={openEditModalHandler}
//                                                     onConfirm={openConfirmModalHandler}
//                                                     onStart={openStartModalHandler}
//                                                     onComplete={openCompleteModalHandler}
//                                                     onCancel={openCancelModalHandler}
//                                                     onPostpone={openPostponeModalHandler}
//                                                 />
//                                             </TableCell>
//                                         </TableRow>
//                                     );
//                                 })
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 <TablePagination
//                     rowsPerPageOptions={[5, 10, 25, 50]}
//                     component="div"
//                     count={totalItems}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     sx={{
//                         borderTop: `1px solid ${COLORS.border}`,
//                         '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//                             fontSize: '0.7rem',
//                             color: COLORS.text.secondary,
//                         },
//                         '& .MuiTablePagination-select': { fontSize: '0.7rem' },
//                         '& .MuiTablePagination-actions button': { color: COLORS.primary },
//                     }}
//                 />
//             </Paper>

//             {/* ── Modals ───────────────────────────────────────── */}
//             <AddProductionSchedule
//                 open={openAddModal}
//                 onClose={() => setOpenAddModal(false)}
//                 onSchedule={handleAddSuccess}
//             />

//             {selectedSchedule && (
//                 <>
//                     <ViewProductionSchedule
//                         open={openViewModal}
//                         onClose={() => { setOpenViewModal(false); setSelectedSchedule(null); }}
//                         schedule={selectedSchedule}
//                     />
//                     <EditProductionSchedule
//                         open={openEditModal}
//                         onClose={() => { setOpenEditModal(false); setSelectedSchedule(null); }}
//                         schedule={selectedSchedule}
//                         onUpdate={handleEditSuccess}
//                     />
//                     <ConfirmedProductionSchedule
//                         open={openConfirmModal}
//                         onClose={() => { setOpenConfirmModal(false); setSelectedSchedule(null); }}
//                         schedule={selectedSchedule}
//                         onConfirm={handleConfirmSuccess}
//                     />
//                     <StartProductionSchedule
//                         open={openStartModal}
//                         onClose={() => { setOpenStartModal(false); setSelectedSchedule(null); }}
//                         schedule={selectedSchedule}
//                         onStart={handleStartSuccess}
//                     />
//                     <CompleteProductionSchedule
//                         open={openCompleteModal}
//                         onClose={() => { setOpenCompleteModal(false); setSelectedSchedule(null); }}
//                         schedule={selectedSchedule}
//                         onComplete={handleCompleteSuccess}
//                     />
//                     <CancelProductionSchedule
//                         open={openCancelModal}
//                         onClose={() => { setOpenCancelModal(false); setSelectedSchedule(null); }}
//                         schedule={selectedSchedule}
//                         onCancel={handleCancelSuccess}
//                     />
//                     <PostponeProductionSchedule
//                         open={openPostponeModal}
//                         onClose={() => { setOpenPostponeModal(false); setSelectedSchedule(null); }}
//                         schedule={selectedSchedule}
//                         onPostpone={handlePostponeSuccess}
//                     />
//                 </>
//             )}

//             {/* ── Snackbar ─────────────────────────────────────── */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={3000}
//                 onClose={() => setSnackbar({ ...snackbar, open: false })}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//                 <Alert
//                     onClose={() => setSnackbar({ ...snackbar, open: false })}
//                     severity={snackbar.severity}
//                     variant="filled"
//                     sx={{
//                         width: '100%',
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
//                     }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default ProductionScheduleMaster;





import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Tooltip,
    Typography,
    Snackbar,
    TablePagination,
    Checkbox,
    Stack,
    Chip,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    Grid
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    PlayArrow as PlayArrowIcon,
    Factory as MachineIcon,
    Cancel as CancelIcon,
    EventRepeat as EventRepeatIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddProductionSchedule from './AddProductionSchedule';
import EditProductionSchedule from './EditProductionSchedule';
import CompleteProductionSchedule from './CompleteProductionSchedule';
import ViewProductionSchedule from './ViewProductionSchedule';
import ConfirmedProductionSchedule from './ConfirmedProdutionSchedule';
import StartProductionSchedule from './StartProductionSchedule';
import CancelProductionSchedule from './CancelProductionSchedule';
import PostponeProductionSchedule from './PostpondProductionSchedule';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
    primary: '#063C3F',
    primaryLight: '#E8F0F1',
    primaryDark: '#05292B',
    success: '#2E7D32',
    warning: '#ED6C02',
    error: '#D32F2F',
    info: '#0288D1',
    border: '#E5E7EB',
    text: {
        primary: '#111827',
        secondary: '#6B7280',
        tertiary: '#9CA3AF',
        light: '#FFFFFF'
    },
    background: {
        light: '#F9FAFB',
        white: '#FFFFFF',
        hover: '#F3F4F6',
        tableHeader: '#063C3F'
    }
};

// ─── Constants ────────────────────────────────────────────────────────────────
const SHIFT_OPTIONS = ['All', 'General', 'Morning', 'Afternoon', 'Night'];
const STATUS_OPTIONS = ['All', 'Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Postponed'];

// ─── Machine Status Config ────────────────────────────────────────────────────
const MACHINE_STATUS_CONFIG = {
    'Active': {
        bar: '#10B981',
        iconBg: '#D1FAE5',
        iconColor: '#059669',
        badgeBg: '#D1FAE5',
        badgeColor: '#065F46',
        pulse: true,
        pulseSpeed: '1.4s',
        summaryColor: '#059669',
    },
    'Idle': {
        bar: '#9CA3AF',
        iconBg: '#F3F4F6',
        iconColor: '#6B7280',
        badgeBg: '#F3F4F6',
        badgeColor: '#374151',
        pulse: false,
        summaryColor: '#6B7280',
    },
    'Under Maintenance': {
        bar: '#F59E0B',
        iconBg: '#FEF3C7',
        iconColor: '#B45309',
        badgeBg: '#FEF3C7',
        badgeColor: '#92400E',
        pulse: true,
        pulseSpeed: '2s',
        summaryColor: '#D97706',
    },
    'Breakdown': {
        bar: '#EF4444',
        iconBg: '#FEE2E2',
        iconColor: '#B91C1C',
        badgeBg: '#FEE2E2',
        badgeColor: '#7F1D1D',
        pulse: true,
        pulseSpeed: '0.7s',
        summaryColor: '#DC2626',
    },
    'Decommissioned': {
        bar: '#A78BFA',
        iconBg: '#EDE9FE',
        iconColor: '#6D28D9',
        badgeBg: '#EDE9FE',
        badgeColor: '#4C1D95',
        pulse: false,
        summaryColor: '#7C3AED',
    },
};

const getUtilColor = (u) =>
    u >= 80 ? '#10B981' : u >= 50 ? '#3B82F6' : u > 0 ? '#F59E0B' : '#E5E7EB';

// ─── Pulse Dot ────────────────────────────────────────────────────────────────
const PulseDot = ({ color, speed }) => (
    <Box
        component="span"
        sx={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: color,
            mr: 0.6,
            flexShrink: 0,
            '@keyframes machinePulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.2 },
            },
            animation: speed ? `machinePulse ${speed} infinite` : 'none',
        }}
    />
);

// ─── Machine Summary Pills ─────────────────────────────────────────────────────
const MachineSummaryBar = ({ machines }) => {
    const counts = Object.keys(MACHINE_STATUS_CONFIG).reduce((acc, key) => {
        acc[key] = machines.filter(m => m.status === key).length;
        return acc;
    }, {});

    const pills = [
        { label: 'Active', key: 'Active' },
        { label: 'Idle', key: 'Idle' },
        { label: 'Maintenance', key: 'Under Maintenance' },
        { label: 'Breakdown', key: 'Breakdown' },
        { label: 'Decommissioned', key: 'Decommissioned' },
    ].filter(p => counts[p.key] > 0);

    if (pills.length === 0) return null;

    return (
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={1.5}>
            {pills.map(({ label, key }) => {
                const cfg = MACHINE_STATUS_CONFIG[key];
                return (
                    <Stack
                        key={key}
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 2,
                            border: `1px solid ${COLORS.border}`,
                            bgcolor: COLORS.background.white,
                        }}
                    >
                        <PulseDot color={cfg.bar} speed={cfg.pulse ? cfg.pulseSpeed : null} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: cfg.summaryColor }}>
                            {counts[key]}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            {label}
                        </Typography>
                    </Stack>
                );
            })}
        </Stack>
    );
};

// ─── Machine Card ─────────────────────────────────────────────────────────────
const MachineCard = ({ machine, isSelected, onClick }) => {
    const cfg = MACHINE_STATUS_CONFIG[machine.status] || MACHINE_STATUS_CONFIG['Idle'];
    const oeeTarget = machine.oee_target_percent || 0;
    const showOEE = !['Under Maintenance', 'Decommissioned', 'Breakdown'].includes(machine.status);
    const footerStats = [
        { val: `${machine.capacity_value || 0} ${machine.capacity_unit || ''}`.trim(), label: 'Capacity' },
        { val: `${machine.shifts_per_day || 0}×${machine.hours_per_shift || 0}h`, label: 'Shifts/Day' },
        { val: machine.machine_type || '—', label: 'Type' },
    ];

    return (
        <Paper
            elevation={0}
            onClick={() => onClick(machine)}
            sx={{
                cursor: 'pointer',
                borderRadius: 2.5,
                overflow: 'hidden',
                border: `1.5px solid ${isSelected ? COLORS.primary : COLORS.border}`,
                boxShadow: isSelected
                    ? `0 0 0 3px ${COLORS.primary}1A`
                    : 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                display: 'flex',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.09)',
                    borderColor: isSelected ? COLORS.primary : '#9CA3AF',
                },
            }}
        >
            {/* Left status accent bar */}
            <Box sx={{ width: 4, flexShrink: 0, bgcolor: cfg.bar }} />

            <Box sx={{ p: 1.5, flex: 1, minWidth: 0 }}>
                {/* Top row: icon + status badge */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.25}>
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: cfg.iconBg,
                        }}
                    >
                        <MachineIcon sx={{ fontSize: '1.1rem', color: cfg.iconColor }} />
                    </Avatar>
                    <Chip
                        size="small"
                        label={
                            <Stack direction="row" alignItems="center" sx={{ lineHeight: 1 }}>
                                <PulseDot color={cfg.bar} speed={cfg.pulse ? cfg.pulseSpeed : null} />
                                {machine.status}
                            </Stack>
                        }
                        sx={{
                            height: 22,
                            fontSize: '0.6rem',
                            fontWeight: 500,
                            bgcolor: cfg.badgeBg,
                            color: cfg.badgeColor,
                            '& .MuiChip-label': { px: 0.75 },
                        }}
                    />
                </Stack>

                {/* Machine name */}
                <Typography
                    sx={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: COLORS.text.primary,
                        lineHeight: 1.3,
                        mb: 0.25,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {machine.machine_name}
                </Typography>

                {/* Code · Work Centre */}
                <Typography sx={{ fontSize: '0.62rem', color: COLORS.text.tertiary, mb: 0.4 }}>
                    {machine.machine_code} · {machine.work_centre || 'No Work Centre'}
                </Typography>

                {/* Make · Model */}
                <Typography sx={{ fontSize: '0.62rem', color: COLORS.text.secondary, mb: 1 }}>
                    {[machine.make, machine.model].filter(Boolean).join(' · ') || '—'}
                </Typography>

                {/* OEE Target bar */}
                {showOEE ? (
                    <>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>
                                OEE Target
                            </Typography>
                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: getUtilColor(oeeTarget) }}>
                                {oeeTarget}%
                            </Typography>
                        </Stack>
                        <Box sx={{ height: 4, borderRadius: 2, bgcolor: '#F3F4F6', overflow: 'hidden', mb: 1 }}>
                            <Box
                                sx={{
                                    height: '100%',
                                    width: `${oeeTarget}%`,
                                    bgcolor: getUtilColor(oeeTarget),
                                    borderRadius: 2,
                                    transition: 'width 0.4s ease',
                                }}
                            />
                        </Box>
                    </>
                ) : (
                    <Typography
                        sx={{
                            fontSize: '0.6rem',
                            color: COLORS.text.tertiary,
                            fontStyle: 'italic',
                            mb: 1,
                            minHeight: 28,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {machine.status === 'Under Maintenance' && 'Maintenance in progress'}
                        {machine.status === 'Breakdown' && 'Machine down — check required'}
                        {machine.status === 'Decommissioned' && 'Machine decommissioned'}
                    </Typography>
                )}

                {/* Footer stats: Capacity · Shifts · Type */}
                <Divider sx={{ mb: 1, borderColor: COLORS.border }} />
                <Stack direction="row" justifyContent="space-around">
                    {footerStats.map((stat, i) => (
                        <Box key={i} sx={{ textAlign: 'center' }}>
                            <Typography
                                sx={{
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    color: COLORS.text.primary,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: 64,
                                }}
                            >
                                {stat.val}
                            </Typography>
                            <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                                {stat.label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Paper>
    );
};

// ─── Action Menu - WITH PERMISSIONS ──────────────────────────────────────────────
const ActionMenu = ({
    item,
    anchorEl,
    onOpen,
    onClose,
    onView,
    onEdit,
    onConfirm,
    onStart,
    onComplete,
    onCancel,
    onPostpone,
    permissions,
    isSuperAdmin
}) => {
    // Permission checks - USING CORRECT MODULE AND PAGE
    const canView = isSuperAdmin || hasPermission(permissions, MODULES.PRODUCTION_SCHEDULE, PAGES.PRODUCTION_SCHEDULE, ACTIONS.VIEW);
    const canCreate = isSuperAdmin || hasPermission(permissions, MODULES.PRODUCTION_SCHEDULE, PAGES.PRODUCTION_SCHEDULE, ACTIONS.CREATE);
    const canApprove = isSuperAdmin || hasPermission(permissions, MODULES.PRODUCTION_SCHEDULE, PAGES.PRODUCTION_SCHEDULE, ACTIONS.APPROVE);
    const canDelete = isSuperAdmin || hasPermission(permissions, MODULES.PRODUCTION_SCHEDULE, PAGES.PRODUCTION_SCHEDULE, ACTIONS.DELETE);

    const canConfirm = item?.status === 'Planned';
    const canStart = item?.status === 'Confirmed';
    const canComplete = item?.status === 'In Progress';
    const canCancel = ['Planned', 'Confirmed', 'Postponed'].includes(item?.status);
    const canPostpone = ['Planned', 'Confirmed', 'In Progress'].includes(item?.status);
    const canEdit = item?.status !== 'Completed' && item?.status !== 'Cancelled';

    return (
        <>
            <Tooltip title="Actions">
                <IconButton
                    size="small"
                    onClick={onOpen}
                    sx={{
                        color: COLORS.text.secondary,
                        '&:hover': { bgcolor: `${COLORS.primary}20` },
                    }}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    },
                }}
            >
                {/* View Details - VIEW permission */}
                {canView && (
                    <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                            <ViewIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                                View Details
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {/* Confirm Schedule - APPROVE permission */}
                {canConfirm && canApprove && (
                    <MenuItem onClick={() => { onConfirm(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#059669', minWidth: 36 }}>
                            <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#059669', fontSize: '0.75rem' }}>
                                Confirm Schedule
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {/* Start Production - CREATE permission */}
                {canStart && canCreate && (
                    <MenuItem onClick={() => { onStart(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#0284C7', minWidth: 36 }}>
                            <PlayArrowIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#0284C7', fontSize: '0.75rem' }}>
                                Start Production
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {/* Complete Production - CREATE permission */}
                {canComplete && canCreate && (
                    <MenuItem onClick={() => { onComplete(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#059669', minWidth: 36 }}>
                            <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#059669', fontSize: '0.75rem' }}>
                                Complete Production
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {/* Reschedule - CREATE permission */}
                {canEdit && canCreate && (
                    <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                                Reschedule
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {/* Postpone Schedule - CREATE permission */}
                {canPostpone && canCreate && (
                    <MenuItem onClick={() => { onPostpone(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#D97706', minWidth: 36 }}>
                            <EventRepeatIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#D97706', fontSize: '0.75rem' }}>
                                Postpone Schedule
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {/* Cancel Schedule - DELETE permission */}
                {canCancel && canDelete && (
                    <>
                        <Divider />
                        <MenuItem onClick={() => { onCancel(item); onClose(); }} sx={{ py: 1.5 }}>
                            <ListItemIcon sx={{ color: COLORS.error, minWidth: 36 }}>
                                <CancelIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.error, fontSize: '0.75rem' }}>
                                    Cancel Schedule
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ProductionScheduleMaster = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selected, setSelected] = useState([]);
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedScheduleForAction, setSelectedScheduleForAction] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Filter states
    const [machineFilter, setMachineFilter] = useState('');
    const [shiftFilter, setShiftFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState('');
    const [machines, setMachines] = useState([]);

    // Modal states
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openStartModal, setOpenStartModal] = useState(false);
    const [openCompleteModal, setOpenCompleteModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openPostponeModal, setOpenPostponeModal] = useState(false);

    // User permissions state
    const [userPermissions, setUserPermissions] = useState([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    // Ref for search debouncing
    const isSearchingRef = React.useRef(false);
    const searchTimeoutRef = React.useRef(null);

    // Fetch user permissions
    useEffect(() => {
        const fetchUserPermissions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.success) {
                    const userData = response.data.data;
                    setIsSuperAdmin(userData.isSuperAdmin || false);
                    setUserPermissions(userData.permissions || []);
                }
            } catch (err) {
                console.error('Error fetching user permissions:', err);
                setUserPermissions([]);
            } finally {
                setPermissionsLoaded(true);
            }
        };
        fetchUserPermissions();
    }, []);

    // Check permission helper - USING CORRECT MODULE AND PAGE
    const checkPermission = (action) => {
        if (isSuperAdmin) return true;
        return hasPermission(
            userPermissions,
            MODULES.PRODUCTION_SCHEDULE,
            PAGES.PRODUCTION_SCHEDULE,
            action
        );
    };

    // Permission checks
    const canViewPage = checkPermission(ACTIONS.VIEW);
    const canCreate = checkPermission(ACTIONS.CREATE);
    const canApprove = checkPermission(ACTIONS.APPROVE);
    const canDelete = checkPermission(ACTIONS.DELETE);

    // Handle search input change with debounce
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        isSearchingRef.current = true;

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearchTerm(value);
            setPage(0);
            isSearchingRef.current = false;
        }, 500);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchInput('');
        setSearchTerm('');
        setPage(0);
        isSearchingRef.current = false;
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Fetch machines
    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/machines`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setMachines(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching machines:', err);
        }
    };

    // Fetch Schedules
    const fetchSchedules = useCallback(async () => {
        if (!canViewPage && !isSuperAdmin) return;

        if (!isSearchingRef.current) {
            setLoading(true);
        }

        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });

            if (searchTerm) params.append('search', searchTerm);
            if (machineFilter) params.append('machine_id', machineFilter);
            if (shiftFilter && shiftFilter !== 'All') params.append('shift', shiftFilter);
            if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
            if (fromDateFilter) params.append('from', fromDateFilter);
            if (toDateFilter) params.append('to', toDateFilter);

            const response = await axios.get(
                `${BASE_URL}/api/production-schedule?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setSchedules(response.data.data || []);
                setTotalItems(response.data.total || response.data.data.length);
            } else {
                showNotification('Failed to load production schedules', 'error');
            }
        } catch (err) {
            console.error('Error fetching schedules:', err);
            showNotification('Failed to load production schedules', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchTerm, machineFilter, shiftFilter, statusFilter, fromDateFilter, toDateFilter, canViewPage, isSuperAdmin]);

    useEffect(() => {
        if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
            fetchSchedules();
        }
    }, [fetchSchedules, permissionsLoaded, canViewPage, isSuperAdmin]);

    // Handle refresh
    const handleRefresh = () => {
        fetchSchedules();
        showNotification('Data refreshed', 'success');
    };

    const handleMachineClick = (machine) => {
        setMachineFilter(prev => (prev === machine._id ? '' : machine._id));
        setPage(0);
    };

    // Handle selection - only if user has delete permission
    const handleSelectAll = (event) => {
        if (!canDelete) return;
        setSelected(event.target.checked ? schedules.map(s => s._id) : []);
    };

    const handleSelect = (id) => {
        if (!canDelete) return;
        setSelected(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
        setSelected([]);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setSelected([]);
    };

    const handleAddSuccess = () => { fetchSchedules(); showNotification('Production schedule created successfully!', 'success'); };
    const handleEditSuccess = () => { fetchSchedules(); showNotification('Production schedule rescheduled successfully!', 'success'); };
    const handleConfirmSuccess = () => { fetchSchedules(); showNotification('Production schedule confirmed successfully!', 'success'); };
    const handleStartSuccess = () => { fetchSchedules(); showNotification('Production started successfully!', 'success'); };
    const handleCompleteSuccess = () => { fetchSchedules(); showNotification('Production completed successfully!', 'success'); };
    const handleCancelSuccess = () => { fetchSchedules(); showNotification('Production schedule cancelled successfully!', 'success'); };
    const handlePostponeSuccess = () => { fetchSchedules(); showNotification('Production schedule postponed successfully!', 'success'); };

    const handleActionMenuOpen = (event, schedule) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedScheduleForAction(schedule);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchor(null);
        setSelectedScheduleForAction(null);
    };

    const openViewModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenViewModal(true); handleActionMenuClose(); };
    const openEditModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenEditModal(true); handleActionMenuClose(); };
    const openConfirmModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenConfirmModal(true); handleActionMenuClose(); };
    const openStartModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenStartModal(true); handleActionMenuClose(); };
    const openCompleteModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenCompleteModal(true); handleActionMenuClose(); };
    const openCancelModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenCancelModal(true); handleActionMenuClose(); };
    const openPostponeModalHandler = (schedule) => { setSelectedSchedule(schedule); setOpenPostponeModal(true); handleActionMenuClose(); };

    const showNotification = (message, severity) => setSnackbar({ open: true, message, severity });

    const clearFilters = () => {
        setSearchInput('');
        setSearchTerm('');
        setMachineFilter('');
        setShiftFilter('All');
        setStatusFilter('All');
        setFromDateFilter('');
        setToDateFilter('');
        setPage(0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':   return { bg: '#D1FAE5', color: '#059669' };
            case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
            case 'Confirmed':   return { bg: '#D1FAE5', color: '#059669' };
            case 'Planned':     return { bg: '#FEF3C7', color: '#D97706' };
            case 'Cancelled':   return { bg: '#FEE2E2', color: '#DC2626' };
            case 'Postponed':   return { bg: '#FEF3C7', color: '#D97706' };
            default:            return { bg: '#F1F5F9', color: '#475569' };
        }
    };

    const getShiftColor = (shift) => {
        const colors = {
            General:   { bg: '#E0E7FF', color: '#4338CA' },
            Morning:   { bg: '#FEF3C7', color: '#D97706' },
            Afternoon: { bg: '#FCE7F3', color: '#BE185D' },
            Night:     { bg: '#E0E7FF', color: '#3730A3' },
        };
        return colors[shift] || { bg: '#F1F5F9', color: '#475569' };
    };

    const getMachineName = (schedule) => {
        if (typeof schedule.machine_id === 'object') {
            return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
        }
        return machines.find(m => m._id === schedule.machine_id)?.machine_name || schedule.machine_id || '-';
    };

    const getWONumber = (schedule) => {
        if (typeof schedule.wo_id === 'object') return schedule.wo_id?.wo_number || '-';
        return schedule.wo_id || '-';
    };

    const getPartNo = (schedule) => {
        if (typeof schedule.wo_id === 'object') return schedule.wo_id?.part_no || schedule.part_no || '-';
        return schedule.part_no || '-';
    };

    if (!permissionsLoaded) {
        return <LoadingState />;
    }

    if (!canViewPage && !isSuperAdmin) {
        return <AccessDenied />;
    }

    return (
        <Box sx={{ p: 2.5 }}>
            {/* ── Page Header ─────────────────────────────────── */}
            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
                    Production Schedule Master
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    Manage production schedules, track machine utilization, and monitor production progress
                </Typography>
            </Box>

            {/* ── Machine Cards Section ────────────────────────── */}
            {machines.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.25}>
                        <Typography
                            sx={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: COLORS.text.secondary,
                                letterSpacing: '0.7px',
                                textTransform: 'uppercase',
                            }}
                        >
                            Machines ({machines.length})
                        </Typography>
                        {machineFilter && (
                            <Button
                                size="small"
                                onClick={() => setMachineFilter('')}
                                sx={{ fontSize: '0.65rem', textTransform: 'none', color: COLORS.primary, p: 0, minWidth: 0 }}
                            >
                                Clear selection
                            </Button>
                        )}
                    </Stack>

                    <MachineSummaryBar machines={machines} />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: 1.5,
                        }}
                    >
                        {machines.map((machine) => (
                            <MachineCard
                                key={machine._id}
                                machine={machine}
                                isSelected={machineFilter === machine._id}
                                onClick={handleMachineClick}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* ── Filters Bar ─────────────────────────────────── */}
            <Paper
                sx={{
                    p: 1.5,
                    mb: 2.5,
                    borderRadius: 2,
                    bgcolor: COLORS.background.white,
                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
                    border: `1px solid ${COLORS.border}`,
                }}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search by schedule ID, WO number..."
                            size="small"
                            value={searchInput}
                            onChange={handleSearchChange}
                            autoComplete="off"
                            sx={{
                                width: { xs: '100%', sm: 250 },
                                '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchInput && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={handleClearSearch}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { height: 36, bgcolor: COLORS.background.light },
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel sx={{ fontSize: '0.75rem' }}>Shift</InputLabel>
                            <Select
                                value={shiftFilter}
                                onChange={(e) => setShiftFilter(e.target.value)}
                                label="Shift"
                                sx={{ height: 36, fontSize: '0.75rem' }}
                            >
                                {SHIFT_OPTIONS.map(s => (
                                    <MenuItem key={s} value={s} sx={{ fontSize: '0.75rem' }}>{s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel sx={{ fontSize: '0.75rem' }}>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Status"
                                sx={{ height: 36, fontSize: '0.75rem' }}
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <MenuItem key={s} value={s} sx={{ fontSize: '0.75rem' }}>{s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            size="small"
                            onClick={clearFilters}
                            sx={{ height: 36, textTransform: 'none', fontSize: '0.7rem' }}
                        >
                            Clear Filters
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        {/* Refresh Button */}
                        <Tooltip title="Refresh">
                            <IconButton
                                size="small"
                                onClick={handleRefresh}
                                disabled={loading}
                                sx={{
                                    color: COLORS.text.secondary,
                                    '&:hover': { bgcolor: `${COLORS.primary}20` }
                                }}
                            >
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Add Schedule Button - CREATE permission */}
                        {canCreate && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                                onClick={() => setOpenAddModal(true)}
                                sx={{
                                    height: 36,
                                    borderRadius: 1.5,
                                    bgcolor: COLORS.primaryDark,
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                                    '&:hover': { bgcolor: COLORS.primaryDark },
                                }}
                            >
                                Add Schedule
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {/* ── Schedules Table ──────────────────────────────── */}
            <Paper
                sx={{
                    width: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
                    border: `1px solid ${COLORS.border}`,
                }}
            >
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor: COLORS.background.tableHeader,
                                    '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 },
                                }}
                            >
                                {/* Checkbox Column - DELETE permission */}
                                {canDelete && (
                                    <TableCell padding="checkbox" sx={{ width: 40 }}>
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < schedules.length}
                                            checked={schedules.length > 0 && selected.length === schedules.length}
                                            onChange={handleSelectAll}
                                            sx={{
                                                color: COLORS.text.light,
                                                '&.Mui-checked': { color: COLORS.text.light },
                                                '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                                                '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
                                            }}
                                            disabled={loading || schedules.length === 0}
                                        />
                                    </TableCell>
                                )}
                                {['Schedule ID', 'Machine', 'Work Order', 'Part / Operation', 'Schedule Date', 'Shift / Hours', 'Status'].map(col => (
                                    <TableCell key={col} sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>
                                        {col}
                                    </TableCell>
                                ))}
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light, width: 60 }} align="center">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                                            Loading schedules...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : schedules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <ScheduleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                                            <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                                                {searchTerm || machineFilter ? 'No schedules found' : 'No production schedules available'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                                {searchTerm || machineFilter
                                                    ? 'Try adjusting your search terms'
                                                    : 'Add your first schedule to get started'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                schedules.map((schedule) => {
                                    const isSelected = selected.includes(schedule._id);
                                    const isActionMenuOpen =
                                        Boolean(actionMenuAnchor) && selectedScheduleForAction?._id === schedule._id;
                                    const statusColors = getStatusColor(schedule.status);
                                    const shiftColors = getShiftColor(schedule.shift);

                                    return (
                                        <TableRow
                                            key={schedule._id}
                                            hover
                                            selected={isSelected}
                                            sx={{
                                                bgcolor: COLORS.background.white,
                                                '&:hover': { bgcolor: COLORS.background.hover },
                                                '&.Mui-selected': { bgcolor: `${COLORS.primary}10` },
                                                '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border },
                                            }}
                                        >
                                            {canDelete && (
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => handleSelect(schedule._id)}
                                                        sx={{
                                                            color: COLORS.primary,
                                                            '&.Mui-checked': { color: COLORS.primary },
                                                            '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
                                                        }}
                                                    />
                                                </TableCell>
                                            )}

                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                                        {schedule.schedule_id}
                                                    </Typography>
                                                    {schedule.conflict && (
                                                        <WarningIcon sx={{ fontSize: '0.7rem', color: COLORS.warning }} />
                                                    )}
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <MachineIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                                        {getMachineName(schedule)}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                                    {getWONumber(schedule)}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem' }}>{getPartNo(schedule)}</Typography>
                                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                                    Op {schedule.operation_seq}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem' }}>
                                                    {formatDate(schedule.scheduled_date)}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={schedule.shift}
                                                    size="small"
                                                    sx={{ fontSize: '0.6rem', height: 20, bgcolor: shiftColors.bg, color: shiftColors.color }}
                                                />
                                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                                    {schedule.planned_hours} hrs
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={schedule.status}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        fontWeight: 500,
                                                        height: 24,
                                                        bgcolor: statusColors.bg,
                                                        color: statusColors.color,
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell align="center">
                                                <ActionMenu
                                                    item={schedule}
                                                    anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                                                    onOpen={(e) => handleActionMenuOpen(e, schedule)}
                                                    onClose={handleActionMenuClose}
                                                    onView={openViewModalHandler}
                                                    onEdit={openEditModalHandler}
                                                    onConfirm={openConfirmModalHandler}
                                                    onStart={openStartModalHandler}
                                                    onComplete={openCompleteModalHandler}
                                                    onCancel={openCancelModalHandler}
                                                    onPostpone={openPostponeModalHandler}
                                                    permissions={userPermissions}
                                                    isSuperAdmin={isSuperAdmin}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalItems}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: `1px solid ${COLORS.border}`,
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.7rem',
                            color: COLORS.text.secondary,
                        },
                        '& .MuiTablePagination-select': { fontSize: '0.7rem' },
                        '& .MuiTablePagination-actions button': { color: COLORS.primary },
                    }}
                />
            </Paper>

            {/* ── Modals - With Permission Checks ───────────────────────────────────────── */}
            {canCreate && (
                <AddProductionSchedule
                    open={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onSchedule={handleAddSuccess}
                />
            )}

            {selectedSchedule && (
                <>
                    {canViewPage && (
                        <ViewProductionSchedule
                            open={openViewModal}
                            onClose={() => { setOpenViewModal(false); setSelectedSchedule(null); }}
                            schedule={selectedSchedule}
                        />
                    )}

                    {canCreate && (
                        <>
                            <EditProductionSchedule
                                open={openEditModal}
                                onClose={() => { setOpenEditModal(false); setSelectedSchedule(null); }}
                                schedule={selectedSchedule}
                                onUpdate={handleEditSuccess}
                            />
                            <StartProductionSchedule
                                open={openStartModal}
                                onClose={() => { setOpenStartModal(false); setSelectedSchedule(null); }}
                                schedule={selectedSchedule}
                                onStart={handleStartSuccess}
                            />
                            <CompleteProductionSchedule
                                open={openCompleteModal}
                                onClose={() => { setOpenCompleteModal(false); setSelectedSchedule(null); }}
                                schedule={selectedSchedule}
                                onComplete={handleCompleteSuccess}
                            />
                            <PostponeProductionSchedule
                                open={openPostponeModal}
                                onClose={() => { setOpenPostponeModal(false); setSelectedSchedule(null); }}
                                schedule={selectedSchedule}
                                onPostpone={handlePostponeSuccess}
                            />
                        </>
                    )}

                    {canApprove && (
                        <ConfirmedProductionSchedule
                            open={openConfirmModal}
                            onClose={() => { setOpenConfirmModal(false); setSelectedSchedule(null); }}
                            schedule={selectedSchedule}
                            onConfirm={handleConfirmSuccess}
                        />
                    )}

                    {canDelete && (
                        <CancelProductionSchedule
                            open={openCancelModal}
                            onClose={() => { setOpenCancelModal(false); setSelectedSchedule(null); }}
                            schedule={selectedSchedule}
                            onCancel={handleCancelSuccess}
                        />
                    )}
                </>
            )}

            {/* ── Snackbar ─────────────────────────────────────── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Loading state component
const LoadingState = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={40} sx={{ color: COLORS.primary }} />
    </Box>
);

// Access Denied component
const AccessDenied = () => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary">
            You don't have permission to view this page. Please contact your administrator.
        </Typography>
    </Box>
);

export default ProductionScheduleMaster;