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
    TablePagination,
    Button,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    CircularProgress,
    Alert,
    Snackbar,
    Stack,
    Avatar,
    Checkbox,
    Menu,
    ListItemIcon,
    ListItemText,
    Divider,
    FormControlLabel,
    Switch,
    Tabs,       
    Tab
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Factory as FactoryIcon,
    Visibility as VisibilityIcon,
    MoreVert as MoreVertIcon,
    Settings as SettingsIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddAssembly from './AddAssembly';
import ViewAssembly from './ViewAssembly';
import EditAssembly from './EditAssembly';
import DeleteAssembly from './DeleteAssembly';

// ==================== COLORS ====================
const COLORS = {
    primary: '#063C3F',
    primaryLight: '#E8F0F1',
    primaryDark: '#05292B',
    text: {
        primary: '#151C26',
        secondary: '#4B5568',
        tertiary: '#94A3B8',
        light: '#FFFFFF',
    },
    background: {
        white: '#FFFFFF',
        light: '#F8FFFC',
        hover: '#F0FDF9',
        tableHeader: '#063C3F',
    },
    border: '#E3E8EF',
    chips: {
        active: '#D1FAE5',
        inactive: '#FEE2E2',
    }
};

// Line Type options
const LINE_TYPES = ['Busbar', 'General', 'Assembly', 'Testing', 'Packaging'];

// Status tabs
const STATUS_TABS = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' }
];

// Line Type Colors
const getLineTypeColor = (type) => {
    const colors = {
        'Busbar': { bg: '#E8F0F1', color: COLORS.primary },
        'General': { bg: '#E0F2FE', color: '#0284C7' },
        'Assembly': { bg: '#FEF3C7', color: '#D97706' },
        'Testing': { bg: '#F3E8FF', color: '#9333EA' },
        'Packaging': { bg: '#D1FAE5', color: '#059669' }
    };
    return colors[type] || { bg: '#F1F5F9', color: '#475569' };
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

// ==================== ACTION MENU COMPONENT ====================
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onStatusUpdate, permissions }) => {
    const canView = hasPermission(permissions, MODULES.PHYSICAL_STOCK_VERIFICATION, PAGES.PHYSICAL_STOCK_VERIFICATION, ACTIONS.VIEW);
    const canUpdate = hasPermission(permissions, MODULES.PHYSICAL_STOCK_VERIFICATION, PAGES.PHYSICAL_STOCK_VERIFICATION, ACTIONS.UPDATE);
    const canDelete = hasPermission(permissions, MODULES.PHYSICAL_STOCK_VERIFICATION, PAGES.PHYSICAL_STOCK_VERIFICATION, ACTIONS.DELETE);
    const canUpdateStatus = hasPermission(permissions, MODULES.PHYSICAL_STOCK_VERIFICATION, PAGES.PHYSICAL_STOCK_VERIFICATION, ACTIONS.UPDATE);

    // If no actions available, don't render the menu
    if (!canView && !canUpdate && !canDelete && !canUpdateStatus) {
        return null;
    }

    return (
        <>
            <Tooltip title="Actions">
                <IconButton
                    size="small"
                    onClick={onOpen}
                    sx={{
                        color: COLORS.text.secondary,
                        '&:hover': {
                            bgcolor: `${COLORS.primary}20`
                        }
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
                        minWidth: 180,
                        borderRadius: 2,
                        border: `1px solid ${COLORS.border}`,
                    }
                }}
            >
                {canView && (
                    <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                            <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                                View Details
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {canUpdate && (
                    <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                                Edit
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {canUpdateStatus && (
                    <MenuItem onClick={() => { onStatusUpdate(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
                                Update Status
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

                {(canView || canUpdate || canUpdateStatus) && canDelete && <Divider sx={{ my: 0.5 }} />}

                {canDelete && (
                    <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
                                Delete
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

// ==================== STATUS UPDATE MODAL ====================
const StatusUpdateModal = ({ open, onClose, assemblyLine, onStatusUpdate, loading }) => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && assemblyLine) {
            setSelectedStatus(assemblyLine.is_active ? 'Active' : 'Inactive');
            setError('');
        }
    }, [open, assemblyLine]);

    const handleSubmit = () => {
        if (!selectedStatus) {
            setError('Please select a status');
            return;
        }
        onStatusUpdate(selectedStatus);
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
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    Update Assembly Line Status
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
                    Assembly Line: <strong>{assemblyLine?.line_name} ({assemblyLine?.line_code})</strong>
                </Typography>

                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    Current Status:
                    <Chip
                        label={assemblyLine?.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                            ml: 1,
                            fontSize: '0.65rem',
                            height: 22,
                            bgcolor: assemblyLine?.is_active ? COLORS.chips.active : COLORS.chips.inactive,
                            color: assemblyLine?.is_active ? '#059669' : '#DC2626'
                        }}
                    />
                </Typography>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                    <InputLabel sx={{ fontSize: '0.75rem' }}>New Status</InputLabel>
                    <Select
                        value={selectedStatus}
                        onChange={(e) => { setSelectedStatus(e.target.value); setError(''); }}
                        label="New Status"
                        error={!!error}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                    >
                        <MenuItem value="Active" sx={{ fontSize: '0.75rem' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#059669' }} />
                                <span>Active</span>
                            </Stack>
                        </MenuItem>
                        <MenuItem value="Inactive" sx={{ fontSize: '0.75rem' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#DC2626' }} />
                                <span>Inactive</span>
                            </Stack>
                        </MenuItem>
                    </Select>
                    {error && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                            {error}
                        </Typography>
                    )}
                </FormControl>
            </DialogContent>

            <DialogActions sx={{
                px: 2.5,
                py: 1.5,
                borderTop: `1px solid ${COLORS.border}`,
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
                        textTransform: 'none'
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!selectedStatus || loading}
                    sx={{
                        height: 32,
                        px: 2,
                        borderRadius: 1.5,
                        bgcolor: COLORS.primary,
                        fontSize: '0.7rem',
                        textTransform: 'none',
                        '&:hover': { bgcolor: COLORS.primaryDark }
                    }}
                >
                    {loading ? 'Updating...' : 'Update Status'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ==================== MAIN COMPONENT ====================
const AssemblyLineMaster = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all');
    const [lineTypeFilter, setLineTypeFilter] = useState('');
    const [workCentreFilter, setWorkCentreFilter] = useState('');
    const [selected, setSelected] = useState([]);
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedItemForAction, setSelectedItemForAction] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Modal states
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openStatusUpdateModal, setOpenStatusUpdateModal] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // User permissions state
    const [userPermissions, setUserPermissions] = useState([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    // Fetch user permissions
    useEffect(() => {
        const fetchUserPermissions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    const userData = response.data.data;
                    setIsSuperAdmin(userData.isSuperAdmin || false);

                    if (userData.permissions && Array.isArray(userData.permissions)) {
                        setUserPermissions(userData.permissions);
                    } else {
                        setUserPermissions([]);
                    }
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

    // Check permission helper
    const checkPermission = (action) => {
        if (isSuperAdmin) return true;
        return hasPermission(
            userPermissions,
            MODULES.PHYSICAL_STOCK_VERIFICATION,
            PAGES.PHYSICAL_STOCK_VERIFICATION,
            action
        );
    };

    // Permission checks
    const canViewPage = checkPermission(ACTIONS.VIEW);
    const canCreate = checkPermission(ACTIONS.CREATE);
    const canUpdate = checkPermission(ACTIONS.UPDATE);
    const canDelete = checkPermission(ACTIONS.DELETE);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch assembly lines
    const fetchAssemblyLines = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const params = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage
            });

            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter !== 'all') params.append('is_active', statusFilter);
            if (lineTypeFilter) params.append('line_type', lineTypeFilter);
            if (workCentreFilter) params.append('work_centre', workCentreFilter);

            const response = await axios.get(`${BASE_URL}/api/assembly-lines?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setData(response.data.data || []);
                setTotalItems(response.data.pagination?.total || response.data.data?.length || 0);
            } else {
                showNotification('Failed to load assembly lines', 'error');
            }
        } catch (err) {
            console.error('Error fetching assembly lines:', err);
            showNotification(err.response?.data?.message || 'Failed to load assembly lines', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchTerm, statusFilter, lineTypeFilter, workCentreFilter]);

    useEffect(() => {
        if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
            fetchAssemblyLines();
        }
    }, [fetchAssemblyLines, permissionsLoaded, canViewPage, isSuperAdmin]);

    const handleSelectAll = (event) => {
        if (!canDelete) return;
        if (event.target.checked) {
            setSelected(data.map(item => item._id));
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (id) => {
        if (!canDelete) return;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = [...selected, id];
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

    const handleStatusFilterChange = (event, newValue) => {
        if (newValue !== null) {
            setStatusFilter(newValue);
            setPage(0);
            setSelected([]);
        }
    };

    const handleLineTypeFilterChange = (event) => {
        setLineTypeFilter(event.target.value);
        setPage(0);
    };

    const handleWorkCentreFilterChange = (event) => {
        setWorkCentreFilter(event.target.value);
        setPage(0);
    };

    const handleClearFilters = () => {
        setStatusFilter('all');
        setLineTypeFilter('');
        setWorkCentreFilter('');
        setSearchInput('');
        setPage(0);
    };

    // Handle Add
    const handleAdd = () => {
        setIsEditMode(false);
        setSelectedItem(null);
        setOpenAddModal(true);
    };

    // Handle View
    const handleView = (item) => {
        setSelectedItem(item);
        setOpenViewModal(true);
    };

    // Handle Edit
    const handleEdit = (item) => {
        setIsEditMode(true);
        setSelectedItem(item);
        setOpenEditModal(true);
    };

    // Handle Delete
    const handleDelete = (item) => {
        setSelectedItem(item);
        setOpenDeleteModal(true);
    };

    // Handle Status Update
    const handleStatusUpdate = (item) => {
        setSelectedItem(item);
        setOpenStatusUpdateModal(true);
    };

    // Handle after save
    const handleSaveSuccess = () => {
        fetchAssemblyLines();
        setOpenAddModal(false);
        setSelectedItem(null);
        showNotification(
            isEditMode ? 'Assembly line updated successfully' : 'Assembly line created successfully',
            'success'
        );
    };

    // Handle after edit
    const handleEditSuccess = () => {
        fetchAssemblyLines();
        setOpenEditModal(false);
        setSelectedItem(null);
        showNotification('Assembly line updated successfully', 'success');
    };

    // Handle after delete
    const handleDeleteSuccess = () => {
        fetchAssemblyLines();
        setOpenDeleteModal(false);
        setSelectedItem(null);
        setSelected([]);
        showNotification('Assembly line deleted successfully', 'success');
    };

    // Handle status update API call
    const handleStatusUpdateConfirm = async (newStatus) => {
        if (!selectedItem) return;

        setStatusLoading(true);
        try {
            const token = localStorage.getItem('token');

            const updatePayload = {
                line_name: selectedItem.line_name,
                line_type: selectedItem.line_type,
                work_centre: selectedItem.work_centre,
                description: selectedItem.description || '',
                is_active: newStatus === 'Active'
            };

            const response = await axios.put(
                `${BASE_URL}/api/assembly-lines/${selectedItem._id}`,
                updatePayload,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                showNotification(`Status updated to ${newStatus}!`, 'success');
                fetchAssemblyLines();
                setOpenStatusUpdateModal(false);
                setSelectedItem(null);
            } else {
                showNotification(response.data.message || 'Failed to update status', 'error');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            showNotification(err.response?.data?.message || 'Failed to update status', 'error');
        } finally {
            setStatusLoading(false);
        }
    };

    const handleActionMenuOpen = (event, item) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedItemForAction(item);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchor(null);
        setSelectedItemForAction(null);
    };

    const showNotification = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    // Get avatar color based on line name
    const getAvatarColor = (line) => {
        if (!line.line_name) return COLORS.primary;
        const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
        const charCode = line.line_name.charCodeAt(0) || 0;
        return colors[charCode % colors.length];
    };

    // Get line initials
    const getLineInitials = (line) => {
        if (!line.line_name) return 'AL';
        return line.line_name.substring(0, 2).toUpperCase();
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    // Show loading state while permissions are being fetched
    if (!permissionsLoaded) {
        return <LoadingState />;
    }

    // If user doesn't have view permission, show access denied
    if (!canViewPage && !isSuperAdmin) {
        return <AccessDenied />;
    }

    return (
        <Box sx={{ p: 2.5 }}>
            {/* Page Header */}
            <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
                    Assembly Line Master
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    Manage assembly lines, track production lines, and monitor line performance
                </Typography>
            </Box>

            {/* Status Filter Tabs */}
            <Paper sx={{
                mb: 2.5,
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                overflow: 'auto'
            }}>
                <Tabs
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        minHeight: 40,
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            minHeight: 40,
                            px: 2,
                            color: COLORS.text.secondary,
                            '&.Mui-selected': { color: COLORS.primary }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: COLORS.primary,
                            height: 2
                        }
                    }}
                >
                    {STATUS_TABS.map((tab) => (
                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                    ))}
                </Tabs>
            </Paper>

            {/* Filters Row */}
            {/* <Paper sx={{
                p: 2,
                mb: 2.5,
                borderRadius: 2,
                bgcolor: COLORS.background.white,
                border: `1px solid ${COLORS.border}`
            }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                    FILTERS
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                            LINE TYPE
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                value={lineTypeFilter}
                                onChange={handleLineTypeFilterChange}
                                displayEmpty
                                sx={{
                                    borderRadius: 1.5,
                                    fontSize: '0.75rem',
                                    '& .MuiSelect-select': { py: 1, px: 1.5 }
                                }}
                            >
                                <MenuItem value="">All Types</MenuItem>
                                {LINE_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                            WORK CENTRE
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Filter by work centre..."
                            value={workCentreFilter}
                            onChange={handleWorkCentreFilterChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    fontSize: '0.75rem',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={handleClearFilters}
                            startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
                            sx={{
                                height: 36,
                                borderRadius: 1.5,
                                textTransform: 'none',
                                fontSize: '0.7rem'
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </Paper> */}

            {/* Action Bar */}
            <Paper sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: 2,
                bgcolor: COLORS.background.white,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                border: `1px solid ${COLORS.border}`
            }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
                    <TextField
                        placeholder="Search by Line Name, Line Code, or Work Centre..."
                        size="small"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        sx={{
                            width: { xs: '100%', sm: 350 },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                '&:hover fieldset': {
                                    borderColor: COLORS.primary,
                                },
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
                                '& input': {
                                    padding: '6px 12px',
                                    fontSize: '0.75rem',
                                    color: COLORS.text.primary,
                                    '&::placeholder': {
                                        color: COLORS.text.tertiary,
                                        fontSize: '0.75rem'
                                    }
                                }
                            }
                        }}
                        disabled={loading}
                    />

                    <Stack direction="row" spacing={1.5}>
                        {canDelete && selected.length > 0 && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                                sx={{
                                    height: 36,
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    borderColor: '#fee2e2',
                                    color: '#991b1b',
                                    '&:hover': {
                                        borderColor: '#fecaca',
                                        bgcolor: '#fee2e2'
                                    }
                                }}
                            >
                                Delete ({selected.length})
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                            onClick={handleAdd}
                            sx={{
                                height: 36,
                                borderRadius: 1.5,
                                bgcolor: COLORS.primary,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    bgcolor: COLORS.primaryDark,
                                }
                            }}
                            disabled={loading}
                        >
                            Add Assembly Line
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* Table */}
         {/* Table */}
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
        <TableRow sx={{ 
          bgcolor: COLORS.background.tableHeader,
          '& .MuiTableCell-root': {
            borderBottom: 'none',
            color: COLORS.text.light,
            py: 1.5,
          }
        }}>
          {canDelete && (
            <TableCell padding="checkbox" sx={{ width: 40 }}>
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAll}
                sx={{
                  color: COLORS.text.light,
                  '&.Mui-checked': {
                    color: COLORS.text.light,
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: COLORS.text.light,
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.25rem'
                  }
                }}
                disabled={loading || data.length === 0}
              />
            </TableCell>
          )}
          <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            Line Code
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            Line Name
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            Line Type
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            Work Centre
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            Description
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            Status
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
              <CircularProgress size={32} sx={{ color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>Loading assembly lines...</Typography>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
              <FactoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
              <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                {searchTerm ? 'No assembly lines found' : 'No assembly lines available'}
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => {
            const isSelected = selected.includes(item._id);
            const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
            const lineTypeColors = getLineTypeColor(item.line_type);
            
            return (
              <TableRow 
                key={item._id} 
                hover 
                selected={isSelected}
                sx={{ 
                  '&:hover': { bgcolor: COLORS.background.hover },
                  '&.Mui-selected': {
                    bgcolor: `${COLORS.primary}10`,
                  }
                }}
              >
                {canDelete && (
                  <TableCell padding="checkbox">
                    <Checkbox 
                      checked={isSelected} 
                      onChange={() => handleSelect(item._id)}
                      sx={{ color: COLORS.primary }}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(item), fontSize: '0.7rem', fontWeight: 600 }}>
                      {getLineInitials(item)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.line_code || `AL-${String(item._id?.slice(-4) || '0001')}`}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.line_name}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.line_type || '-'} 
                    size="small" 
                    sx={{ fontSize: '0.65rem', height: 24, bgcolor: lineTypeColors.bg, color: lineTypeColors.color }} 
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.75rem' }}>{item.work_centre}</Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={item.description || ''}>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                      {item.description?.length > 50 ? `${item.description.substring(0, 50)}...` : (item.description || '-')}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.is_active ? 'Active' : 'Inactive'} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.65rem', 
                      height: 24, 
                      bgcolor: item.is_active ? COLORS.chips.active : COLORS.chips.inactive,
                      color: item.is_active ? '#059669' : '#DC2626'
                    }} 
                  />
                </TableCell>
                <TableCell align="center">
                  <ActionMenu
                    item={item}
                    anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                    onOpen={(e) => handleActionMenuOpen(e, item)}
                    onClose={handleActionMenuClose}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusUpdate={handleStatusUpdate}
                    permissions={userPermissions}
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
        color: COLORS.text.secondary
      }
    }}
  />
</Paper>

            {/* Add/Edit Assembly Line Modal */}
            {canCreate && (
                <AddAssembly
                    open={openAddModal}
                    onClose={() => {
                        setOpenAddModal(false);
                        setSelectedItem(null);
                    }}
                    onSave={handleSaveSuccess}
                    editData={selectedItem}
                    isEditMode={isEditMode}
                />
            )}

            {/* Edit Assembly Line Modal */}
            {selectedItem && canUpdate && (
                <EditAssembly
                    open={openEditModal}
                    onClose={() => {
                        setOpenEditModal(false);
                        setSelectedItem(null);
                    }}
                    assemblyLine={selectedItem}
                    onUpdate={handleEditSuccess}
                />
            )}

            {/* View Assembly Line Modal */}
            {selectedItem && canViewPage && (
                <ViewAssembly
                    open={openViewModal}
                    onClose={() => {
                        setOpenViewModal(false);
                        setSelectedItem(null);
                    }}
                    assemblyLine={selectedItem}
                    onEdit={() => {
                        setOpenViewModal(false);
                        handleEdit(selectedItem);
                    }}
                />
            )}

            {/* Delete Assembly Line Modal */}
            {selectedItem && canDelete && (
                <DeleteAssembly
                    open={openDeleteModal}
                    onClose={() => {
                        setOpenDeleteModal(false);
                        setSelectedItem(null);
                    }}
                    onDelete={handleDeleteSuccess}
                    assemblyData={selectedItem}
                />
            )}

            {/* Status Update Modal */}
            {selectedItem && canUpdate && (
                <StatusUpdateModal
                    open={openStatusUpdateModal}
                    onClose={() => {
                        setOpenStatusUpdateModal(false);
                        setSelectedItem(null);
                    }}
                    assemblyLine={selectedItem}
                    onStatusUpdate={handleStatusUpdateConfirm}
                    loading={statusLoading}
                />
            )}

            {/* Snackbar */}
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
                    sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AssemblyLineMaster;