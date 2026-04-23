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
    FormControlLabel,
    Switch
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
    Assignment as WOrderIcon,
    Close as CloseIcon,
    ReportProblem as ConflictIcon,
    Cancel as CancelIcon,
    EventRepeat as EventRepeatIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddProductionSchedule from './AddProductionSchedule';
import EditProductionSchedule from './EditProductionSchedule';
import CompleteProductionSchedule from './CompleteProductionSchedule';
import ViewProductionSchedule from './ViewProductionSchedule';
import ConfirmedProductionSchedule from './ConfirmedProdutionSchedule';
import StartProductionSchedule from './StartProductionSchedule';
import CancelProductionSchedule from './CancelProductionSchedule';
import PostponeProductionSchedule from './PostpondProductionSchedule';

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
        tableHeader: '#F9FAFB'
    }
};

const SHIFT_OPTIONS = ['All', 'General', 'Morning', 'Evening', 'Night'];
const STATUS_OPTIONS = ['All', 'Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Postponed'];

// Action Menu Component
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
    onPostpone
}) => {
    const canConfirm = item?.status === 'Planned';
    const canStart = item?.status === 'Confirmed';
    const canComplete = item?.status === 'In Progress';
    const canCancel = ['Planned', 'Confirmed', 'Postponed'].includes(item?.status);
    const canPostpone = ['Planned', 'Confirmed', 'In Progress'].includes(item?.status);
    const canEdit = item?.status !== 'Completed' && item?.status !== 'Cancelled';

    return (
        <>
            <Tooltip title="Actions">
                <IconButton size="small" onClick={onOpen} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}>
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
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    } 
                }}
            >
                {/* View Details */}
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

                {/* Confirm - Only for Planned status */}
                {canConfirm && (
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

                {/* Start Production - Only for Confirmed status */}
                {canStart && (
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

                {/* Complete - Only for In Progress status */}
                {canComplete && (
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

                {/* Reschedule (Edit) - Only if not completed or cancelled */}
                {canEdit && (
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

                {/* Postpone - Only for Planned, Confirmed, or In Progress */}
                {canPostpone && (
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

                {/* Cancel - Only for Planned, Confirmed, or Postponed */}
                {canCancel && (
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

// Main Component
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
    const [groupedView, setGroupedView] = useState(false);

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

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch machines for filter
    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/machines`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setMachines(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching machines:', err);
        }
    };

    // Fetch Schedules from API
    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const params = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage
            });

            if (searchTerm) params.append('search', searchTerm);
            if (machineFilter) params.append('machine_id', machineFilter);
            if (shiftFilter && shiftFilter !== 'All') params.append('shift', shiftFilter);
            if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
            if (fromDateFilter) params.append('from', fromDateFilter);
            if (toDateFilter) params.append('to', toDateFilter);

            const response = await axios.get(`${BASE_URL}/api/production-schedule?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

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
    }, [page, rowsPerPage, searchTerm, machineFilter, shiftFilter, statusFilter, fromDateFilter, toDateFilter]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(schedules.map(schedule => schedule._id));
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else {
            newSelected = selected.filter(item => item !== id);
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setSelected([]);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setSelected([]);
    };

    const handleAddSuccess = () => {
        fetchSchedules();
        showNotification('Production schedule created successfully!', 'success');
    };

    const handleEditSuccess = () => {
        fetchSchedules();
        showNotification('Production schedule rescheduled successfully!', 'success');
    };

    const handleConfirmSuccess = () => {
        fetchSchedules();
        showNotification('Production schedule confirmed successfully!', 'success');
    };

    const handleStartSuccess = () => {
        fetchSchedules();
        showNotification('Production started successfully!', 'success');
    };

    const handleCompleteSuccess = () => {
        fetchSchedules();
        showNotification('Production completed successfully!', 'success');
    };

    const handleCancelSuccess = () => {
        fetchSchedules();
        showNotification('Production schedule cancelled successfully!', 'success');
    };

    const handlePostponeSuccess = () => {
        fetchSchedules();
        showNotification('Production schedule postponed successfully!', 'success');
    };

    const handleActionMenuOpen = (event, schedule) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedScheduleForAction(schedule);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchor(null);
        setSelectedScheduleForAction(null);
    };

    const openViewModalHandler = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenViewModal(true);
        handleActionMenuClose();
    };

    const openEditModalHandler = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenEditModal(true);
        handleActionMenuClose();
    };

    const openConfirmModalHandler = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenConfirmModal(true);
        handleActionMenuClose();
    };

    const openStartModalHandler = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenStartModal(true);
        handleActionMenuClose();
    };

    const openCompleteModalHandler = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenCompleteModal(true);
        handleActionMenuClose();
    };

    const openCancelModalHandler = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenCancelModal(true);
        handleActionMenuClose();
    };

    const openPostponeModalHandler = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenPostponeModal(true);
        handleActionMenuClose();
    };

    const showNotification = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

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
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return { bg: '#D1FAE5', color: '#059669' };
            case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
            case 'Confirmed': return { bg: '#D1FAE5', color: '#059669' };
            case 'Planned': return { bg: '#FEF3C7', color: '#D97706' };
            case 'Cancelled': return { bg: '#FEE2E2', color: '#DC2626' };
            case 'Postponed': return { bg: '#FEF3C7', color: '#D97706' };
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

    const getMachineName = (schedule) => {
        if (typeof schedule.machine_id === 'object') {
            return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
        }
        return schedule.machine_id || '-';
    };

    const getWONumber = (schedule) => {
        if (typeof schedule.wo_id === 'object') {
            return schedule.wo_id?.wo_number || '-';
        }
        return schedule.wo_id || '-';
    };

    const getPartNo = (schedule) => {
        if (typeof schedule.wo_id === 'object') {
            return schedule.wo_id?.part_no || schedule.part_no || '-';
        }
        return schedule.part_no || '-';
    };

    return (
        <Box sx={{ p: 2.5 }}>
            {/* Page Header */}
            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
                    Production Schedule Master
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    Manage production schedules, track machine utilization, and monitor production progress
                </Typography>
            </Box>

            {/* Filters Bar */}
            <Paper sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: 2,
                bgcolor: COLORS.background.white,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                border: `1px solid ${COLORS.border}`
            }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
                    {/* Filters Row */}
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search by schedule ID, WO number..."
                            size="small"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            sx={{
                                width: { xs: '100%', sm: 250 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    fontSize: '0.75rem',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    height: 36,
                                    bgcolor: COLORS.background.light,
                                }
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel sx={{ fontSize: '0.75rem' }}>Machine</InputLabel>
                            <Select
                                value={machineFilter}
                                onChange={(e) => setMachineFilter(e.target.value)}
                                label="Machine"
                                sx={{ height: 36, fontSize: '0.75rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Machines</MenuItem>
                                {machines.map(machine => (
                                    <MenuItem key={machine._id} value={machine._id} sx={{ fontSize: '0.75rem' }}>
                                        {machine.machine_name} ({machine.machine_code})
                                    </MenuItem>
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
                                {STATUS_OPTIONS.map(status => (
                                    <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>{status}</MenuItem>
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

                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={groupedView} 
                                    onChange={(e) => setGroupedView(e.target.checked)} 
                                    disabled={!!machineFilter} 
                                    size="small" 
                                />
                            }
                            label={<Typography sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>Group by Machine</Typography>}
                        />
                    </Stack>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
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
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                '&:hover': { bgcolor: COLORS.primaryDark }
                            }}
                        >
                            Add Schedule
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* Schedules Table */}
            <Paper sx={{
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                border: `1px solid ${COLORS.border}`
            }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.primary, py: 1.5 } }}>
                                <TableCell padding="checkbox" sx={{ width: 40 }}>
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < schedules.length}
                                        checked={schedules.length > 0 && selected.length === schedules.length}
                                        onChange={handleSelectAll}
                                        sx={{ color: COLORS.text.secondary, '&.Mui-checked': { color: COLORS.primary }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
                                        disabled={loading || schedules.length === 0}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Schedule ID</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Machine</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Work Order</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Part / Operation</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Schedule Date</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Shift / Hours</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading schedules...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : schedules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <ScheduleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                                            <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                                                {searchTerm ? 'No schedules found' : 'No production schedules available'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                                {searchTerm ? 'Try adjusting your search terms' : 'Add your first schedule to get started'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                schedules.map((schedule) => {
                                    const isSelected = selected.includes(schedule._id);
                                    const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedScheduleForAction?._id === schedule._id;
                                    const statusColors = getStatusColor(schedule.status);
                                    const shiftColors = getShiftColor(schedule.shift);
                                    const conflictIcon = schedule.conflict ? <WarningIcon sx={{ fontSize: '0.7rem', color: COLORS.warning, ml: 0.5 }} /> : null;

                                    return (
                                        <TableRow key={schedule._id} hover selected={isSelected} sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover }, '&.Mui-selected': { bgcolor: `${COLORS.primary}10` }, '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border } }}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} onChange={() => handleSelect(schedule._id)} sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {schedule.schedule_id}
                                                    {conflictIcon}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <MachineIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{getMachineName(schedule)}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{getWONumber(schedule)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem' }}>{getPartNo(schedule)}</Typography>
                                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Op {schedule.operation_seq}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem' }}>{formatDate(schedule.scheduled_date)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={schedule.shift} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: shiftColors.bg, color: shiftColors.color }} />
                                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>{schedule.planned_hours} hrs</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={schedule.status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: statusColors.bg, color: statusColors.color }} />
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
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.7rem', color: COLORS.text.secondary },
                        '& .MuiTablePagination-select': { fontSize: '0.7rem' },
                        '& .MuiTablePagination-actions button': { color: COLORS.primary }
                    }}
                />
            </Paper>

            {/* Modal Components */}
            <AddProductionSchedule 
                open={openAddModal} 
                onClose={() => setOpenAddModal(false)} 
                onSchedule={handleAddSuccess} 
            />

            {selectedSchedule && (
                <>
                    <ViewProductionSchedule 
                        open={openViewModal} 
                        onClose={() => { 
                            setOpenViewModal(false); 
                            setSelectedSchedule(null); 
                        }} 
                        schedule={selectedSchedule} 
                    />
                    
                    <EditProductionSchedule 
                        open={openEditModal} 
                        onClose={() => { 
                            setOpenEditModal(false); 
                            setSelectedSchedule(null); 
                        }} 
                        schedule={selectedSchedule} 
                        onUpdate={handleEditSuccess} 
                    />
                    
                    <ConfirmedProductionSchedule
                        open={openConfirmModal}
                        onClose={() => {
                            setOpenConfirmModal(false);
                            setSelectedSchedule(null);
                        }}
                        schedule={selectedSchedule}
                        onConfirm={handleConfirmSuccess}
                    />

                    <StartProductionSchedule
                        open={openStartModal}
                        onClose={() => {
                            setOpenStartModal(false);
                            setSelectedSchedule(null);
                        }}
                        schedule={selectedSchedule}
                        onStart={handleStartSuccess}
                    />
                    
                    <CompleteProductionSchedule 
                        open={openCompleteModal} 
                        onClose={() => { 
                            setOpenCompleteModal(false); 
                            setSelectedSchedule(null); 
                        }} 
                        schedule={selectedSchedule} 
                        onComplete={handleCompleteSuccess} 
                    />

                    <CancelProductionSchedule
                        open={openCancelModal}
                        onClose={() => {
                            setOpenCancelModal(false);
                            setSelectedSchedule(null);
                        }}
                        schedule={selectedSchedule}
                        onCancel={handleCancelSuccess}
                    />

                    <PostponeProductionSchedule
                        open={openPostponeModal}
                        onClose={() => {
                            setOpenPostponeModal(false);
                            setSelectedSchedule(null);
                        }}
                        schedule={selectedSchedule}
                        onPostpone={handlePostponeSuccess}
                    />
                </>
            )}

            {/* Snackbar Notification */}
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
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductionScheduleMaster;