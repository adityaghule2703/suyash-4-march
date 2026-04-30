// CapaMaster.jsx
import React, { useState, useEffect } from "react";
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
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Alert,
    CircularProgress,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
    useMediaQuery,
    useTheme,
    Drawer,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    Build as BuildIcon,
    FilterList as FilterIcon,
    Close as CloseIcon,
    Warning as WarningIcon,
    CheckCircleOutline as ClosedIcon,
    Pending as PendingIcon,
    Link as LinkIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Verified as VerifiedIcon,
    Assessment as AssessmentIcon,
    LockOpen as LockOpenIcon,
    Update as UpdateIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from "../../../utils/modulePermissions";

// Import CAPA components
import AddCapa from "./AddCapa";
import ViewCapa from "./ViewCapa";
import UpdateFields from "./UpdateFields";
import ReviewCapa from "./ReviewCapa";
import CloseCapa from "./CloseCapa";
import UpdateActions from "./UpdateAction";
// import EditCapa from "./EditCapa";
// import DeleteCapa from "./DeleteCapa";

// Color constants
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
    chips: {
        active: '#9FE2BF',
        inactive: '#F1F5F9',
        suspended: '#FEF3C7',
        locked: '#FEE2E2'
    },
    severity: {
        Critical: '#EF4444',
        Major: '#F59E0B',
        Minor: '#10B981',
        Cosmetic: '#8B5CF6'
    },
    status: {
        'Open': '#F59E0B',
        'In Progress': '#3B82F6',
        'Completed': '#10B981',
        'Effectiveness Under Review': '#8B5CF6',
        'Closed': '#10B981',
        'Overdue': '#EF4444'
    },
    source: {
        'NCR': '#3B82F6',
        'Customer Complaint': '#EF4444',
        'Internal Audit': '#8B5CF6',
        'Management Review': '#F59E0B',
        'Process Study': '#10B981',
        'Supplier Audit': '#06B6D4',
        'Warranty Return': '#E11D48'
    }
};

// Filter options
const CAPA_TYPE_OPTIONS = ['All', 'Corrective', 'Preventive', 'Improvement'];
const SOURCE_OPTIONS = ['All', 'NCR', 'Customer Complaint', 'Internal Audit', 'Management Review', 'Process Study', 'Supplier Audit', 'Warranty Return'];
const STATUS_OPTIONS = ['All', 'Open', 'In Progress', 'Completed', 'Effectiveness Under Review', 'Closed', 'Overdue'];

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

// Helper function to check if action is allowed
const isActionAllowed = (capa, action) => {
    const isClosed = capa.status === 'Closed';
    const isEffectivenessReview = capa.status === 'Effectiveness Under Review';

    switch (action) {
        case 'view':
            return true;
        case 'editFields':
            return !isClosed;
        case 'updateActions':
            return !isClosed;
        case 'reviewEffectiveness':
            return !isClosed && !isEffectivenessReview;
        case 'close':
            return !isClosed && capa.effectiveness_verified === true;
        case 'delete':
            return !isClosed;
        default:
            return false;
    }
};

// Get action tooltip text
const getActionTooltip = (capa, action) => {
    const isClosed = capa.status === 'Closed';
    const isEffectivenessReview = capa.status === 'Effectiveness Under Review';

    switch (action) {
        case 'editFields':
            return isClosed ? 'Cannot edit closed CAPA' : 'Update CAPA header fields';
        case 'updateActions':
            return isClosed ? 'Cannot update actions on closed CAPA' : 'Update action status and upload evidence';
        case 'reviewEffectiveness':
            if (isEffectivenessReview) return 'Effectiveness review already in progress';
            if (isClosed) return 'Cannot review closed CAPA';
            return 'Review CAPA effectiveness';
        case 'close':
            if (isClosed) return 'CAPA already closed';
            if (!capa.effectiveness_verified) return 'Effectiveness must be verified before closing';
            return 'Close CAPA';
        case 'delete':
            return isClosed ? 'Cannot delete closed CAPA' : 'Delete CAPA';
        default:
            return '';
    }
};

// Action Menu Component
const ActionMenu = ({ capa, onAction, anchorEl, onClose, onOpen, permissions }) => {
    const canView = hasPermission(permissions, MODULES.CAPA_MASTER, PAGES.CAPA_MASTER, ACTIONS.VIEW);
    const canUpdate = hasPermission(permissions, MODULES.CAPA_MASTER, PAGES.CAPA_MASTER, ACTIONS.UPDATE);
    const canDelete = hasPermission(permissions, MODULES.CAPA_MASTER, PAGES.CAPA_MASTER, ACTIONS.DELETE);

    if (!canView && !canUpdate && !canDelete) {
        return null;
    }

    const menuItems = [
        {
            label: 'View Details',
            icon: <ViewIcon fontSize="small" />,
            action: 'view',
            show: canView,
            allowed: true,
            tooltip: 'View CAPA details'
        },
        { divider: true, show: canView && canUpdate },
        {
            label: 'Update Fields',
            icon: <EditIcon fontSize="small" />,
            action: 'editFields',
            show: canUpdate,
            allowed: isActionAllowed(capa, 'editFields'),
            tooltip: getActionTooltip(capa, 'editFields')
        },
        {
            label: 'Update Actions',
            icon: <UpdateIcon fontSize="small" />,
            action: 'updateActions',
            show: canUpdate,
            allowed: isActionAllowed(capa, 'updateActions'),
            tooltip: getActionTooltip(capa, 'updateActions')
        },
        {
            label: 'Review Effectiveness',
            icon: <VerifiedIcon fontSize="small" />,
            action: 'reviewEffectiveness',
            show: canUpdate && capa.status !== 'Closed' && capa.status !== 'Effectiveness Under Review',
            allowed: isActionAllowed(capa, 'reviewEffectiveness'),
            tooltip: getActionTooltip(capa, 'reviewEffectiveness')
        },
        {
            label: 'Close CAPA',
            icon: <LockOpenIcon fontSize="small" />,
            action: 'close',
            show: canUpdate && capa.status !== 'Closed',
            allowed: isActionAllowed(capa, 'close'),
            tooltip: getActionTooltip(capa, 'close')
        },
        // { divider: true, show: canUpdate && canDelete && capa.status !== 'Closed' },
        // {
        //     label: 'Delete',
        //     icon: <DeleteIcon fontSize="small" />,
        //     action: 'delete',
        //     show: canDelete && capa.status !== 'Closed',
        //     allowed: isActionAllowed(capa, 'delete'),
        //     tooltip: getActionTooltip(capa, 'delete'),
        //     color: '#EF4444'
        // }
    ];

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
                        minWidth: 200,
                        maxHeight: 450,
                        borderRadius: 2,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                {menuItems.map((item, idx) =>
                    item.divider ? (
                        <Divider key={idx} sx={{ my: 0.5, borderColor: COLORS.border }} />
                    ) : item.show ? (
                        <Tooltip key={idx} title={item.tooltip} placement="left" arrow>
                            <span>
                                <MenuItem
                                    onClick={() => {
                                        if (item.allowed) {
                                            onAction(item.action, capa);
                                            onClose();
                                        }
                                    }}
                                    disabled={!item.allowed}
                                    sx={{
                                        py: 1.5,
                                        opacity: item.allowed ? 1 : 0.5,
                                        '&.Mui-disabled': {
                                            opacity: 0.5
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: item.color || COLORS.primary, minWidth: 36 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography variant="body2" fontWeight={500} sx={{ color: item.color || COLORS.text.primary, fontSize: '0.75rem' }}>
                                            {item.label}
                                        </Typography>
                                    </ListItemText>
                                </MenuItem>
                            </span>
                        </Tooltip>
                    ) : null
                )}
            </Menu>
        </>
    );
};

const CapaMaster = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // State for data
    const [capas, setCapas] = useState([]);
    const [filteredCapas, setFilteredCapas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });

    // Filter states
    const [capaTypeFilter, setCapaTypeFilter] = useState('All');
    const [sourceFilter, setSourceFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    // Table state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
    const [selected, setSelected] = useState([]);

    // Menu state for action buttons
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedCapaForAction, setSelectedCapaForAction] = useState(null);

    // Modal state
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditFieldsModal, setOpenEditFieldsModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openUpdateActionsModal, setOpenUpdateActionsModal] = useState(false);
    const [openReviewEffectivenessModal, setOpenReviewEffectivenessModal] = useState(false);
    const [openCloseModal, setOpenCloseModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // Selected CAPA and Action
    const [selectedCapa, setSelectedCapa] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedActionType, setSelectedActionType] = useState('');

    // Notification state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // User permissions state
    const [userPermissions, setUserPermissions] = useState([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    // Update rows per page based on screen size
    useEffect(() => {
        setRowsPerPage(isMobile ? 5 : 10);
    }, [isMobile]);

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

    // Check permission helper
    const checkPermission = (action) => {
        if (isSuperAdmin) return true;
        return hasPermission(
            userPermissions,
            MODULES.CAPA_MASTER,
            PAGES.CAPA_MASTER,
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

    // Fetch CAPAs from API
    useEffect(() => {
        if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
            fetchCapas();
        }
    }, [permissionsLoaded, canViewPage, isSuperAdmin]);

    const fetchCapas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/capas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                const formattedData = (response.data.data || []).map(capa => ({
                    _id: capa._id,
                    capa_id: capa.capa_id || '',
                    capa_date: capa.capa_date,
                    capa_type: capa.capa_type || '',
                    source: capa.source || '',
                    ncr_id: capa.ncr_id,
                    problem_statement: capa.problem_statement || '',
                    defect_description: capa.defect_description || '',
                    quantity_affected: capa.quantity_affected || 0,
                    customer_impact: capa.customer_impact || false,
                    root_cause: capa.root_cause || '',
                    assigned_to: capa.assigned_to,
                    target_close_date: capa.target_close_date,
                    status: capa.status || 'Open',
                    effectiveness_verified: capa.effectiveness_verified || false,
                    effectiveness_criteria: capa.effectiveness_criteria || '',
                    effectiveness_evidence: capa.effectiveness_evidence || '',
                    effectiveness_notes: capa.effectiveness_notes || '',
                    closed_by: capa.closed_by,
                    closed_at: capa.closed_at,
                    created_by: capa.created_by,
                    updated_by: capa.updated_by,
                    createdAt: capa.createdAt || new Date().toISOString(),
                    updatedAt: capa.updatedAt || new Date().toISOString(),
                    corrective_actions: capa.corrective_actions || [],
                    preventive_actions: capa.preventive_actions || [],
                    corrective_actions_count: capa.corrective_actions?.length || 0,
                    preventive_actions_count: capa.preventive_actions?.length || 0
                }));

                setCapas(formattedData);
                setFilteredCapas(formattedData);

                if (response.data.pagination) {
                    setPagination(response.data.pagination);
                }
            }
        } catch (err) {
            console.error('Error fetching CAPAs:', err);
            showNotification('Failed to load CAPAs. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = [...capas];

        if (searchTerm) {
            const value = searchTerm.toLowerCase();
            filtered = filtered.filter(capa =>
                capa.capa_id?.toLowerCase().includes(value) ||
                capa.problem_statement?.toLowerCase().includes(value) ||
                capa.source?.toLowerCase().includes(value)
            );
        }

        if (capaTypeFilter !== 'All') {
            filtered = filtered.filter(capa => capa.capa_type === capaTypeFilter);
        }

        if (sourceFilter !== 'All') {
            filtered = filtered.filter(capa => capa.source === sourceFilter);
        }

        if (statusFilter !== 'All') {
            filtered = filtered.filter(capa => capa.status === statusFilter);
        }

        setFilteredCapas(filtered);
    }, [searchTerm, capaTypeFilter, sourceFilter, statusFilter, capas]);

    // Get active filter count
    const getActiveFilterCount = () => {
        let count = 0;
        if (capaTypeFilter !== 'All') count++;
        if (sourceFilter !== 'All') count++;
        if (statusFilter !== 'All') count++;
        return count;
    };

    const clearFilters = () => {
        setCapaTypeFilter('All');
        setSourceFilter('All');
        setStatusFilter('All');
        setSearchInput('');
        setSearchTerm('');
        if (isMobile) setFilterDrawerOpen(false);
    };

    // Handle selection
    const handleSelectAll = (event) => {
        if (!canDelete) return;
        if (event.target.checked) {
            setSelected(filteredCapas.map(capa => capa._id));
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (id) => {
        if (!canDelete) return;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else {
            newSelected = selected.filter(item => item !== id);
        }
        setSelected(newSelected);
    };

    // Pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setSelected([]);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setSelected([]);
    };

    // Action handlers with validation
    const handleAction = (action, capa) => {
        if (!isActionAllowed(capa, action)) {
            showNotification(getActionTooltip(capa, action), 'warning');
            return;
        }

        setSelectedCapa(capa);

        switch (action) {
            case 'view':
                setOpenViewModal(true);
                break;
            case 'editFields':
                setOpenEditFieldsModal(true);
                break;
            case 'updateActions':
                setOpenUpdateActionsModal(true);
                break;
            case 'reviewEffectiveness':
                setOpenReviewEffectivenessModal(true);
                break;
            case 'close':
                setOpenCloseModal(true);
                break;
            case 'delete':
                setOpenDeleteDialog(true);
                break;
            default:
                break;
        }
    };

    const handleActionMenuOpen = (event, capa) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedCapaForAction(capa);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchor(null);
        setSelectedCapaForAction(null);
    };

    // CRUD Handlers
    const handleAddCapa = (newCapa) => {
    let capaData = newCapa?.data || newCapa;

    if (!capaData) return;

    const formattedCapa = {
        _id: capaData._id || Date.now().toString(),
        capa_id: capaData.capa_id || '',
        capa_date: capaData.capa_date || new Date().toISOString(),

        // ✅ MAIN FIX
        capa_type: capaData.capa_type || capaData.type || '-',
        source: capaData.source || capaData.capa_source || '-',

        problem_statement: capaData.problem_statement || '',
        status: capaData.status || 'Open',

        corrective_actions: capaData.corrective_actions || [],
        preventive_actions: capaData.preventive_actions || [],

        corrective_actions_count: capaData.corrective_actions?.length || 0,
        preventive_actions_count: capaData.preventive_actions?.length || 0,

        createdAt: capaData.createdAt || new Date().toISOString(),
        updatedAt: capaData.updatedAt || new Date().toISOString()
    };

    setCapas(prev => [formattedCapa, ...prev]);
    setPage(0);

    // 🔥 IMPORTANT (best fix)
    setTimeout(() => {
        fetchCapas();   // ensures correct backend data
    }, 300);

    showNotification("CAPA created successfully!", "success");
};

    const handleUpdateFields = (updatedData) => {
        const updatedCapas = capas.map(capa =>
            capa._id === selectedCapa?._id
                ? { ...capa, ...updatedData, updatedAt: new Date().toISOString() }
                : capa
        );
        setCapas(updatedCapas);
        showNotification('CAPA fields updated successfully!', 'success');
        setOpenEditFieldsModal(false);
        setSelectedCapa(null);
        fetchCapas(); // Refresh to get latest data
    };

    const handleUpdateAction = (updatedAction) => {
        // Refresh CAPA data to get latest action status
        fetchCapas();
        showNotification('Action updated successfully!', 'success');
        setOpenUpdateActionsModal(false);
        setSelectedAction(null);
        setSelectedCapa(null);
    };

    const handleReviewEffectiveness = (effectivenessData) => {
        const updatedCapas = capas.map(capa =>
            capa._id === selectedCapa?._id
                ? {
                    ...capa,
                    effectiveness_verified: effectivenessData.effectiveness_verified,
                    effectiveness_criteria: effectivenessData.effectiveness_criteria,
                    effectiveness_evidence: effectivenessData.effectiveness_evidence,
                    effectiveness_notes: effectivenessData.effectiveness_notes,
                    status: effectivenessData.effectiveness_verified ? 'Effectiveness Under Review' : capa.status,
                    updatedAt: new Date().toISOString()
                }
                : capa
        );
        setCapas(updatedCapas);
        showNotification('Effectiveness review recorded successfully!', 'success');
        setOpenReviewEffectivenessModal(false);
        setSelectedCapa(null);
        fetchCapas(); // Refresh to get latest data
    };

    const handleCloseCapa = (closedData) => {
        const updatedCapas = capas.map(capa =>
            capa._id === selectedCapa?._id
                ? { ...capa, status: 'Closed', closed_at: closedData.closed_at, updatedAt: new Date().toISOString() }
                : capa
        );
        setCapas(updatedCapas);
        showNotification(`CAPA ${closedData.capa_id} closed successfully!`, 'success');
        setOpenCloseModal(false);
        setSelectedCapa(null);
        fetchCapas(); // Refresh to get latest data
    };

    const handleDeleteCapa = async (capaId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/api/capas/${capaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedCapas = capas.filter(capa => capa._id !== capaId);
            setCapas(updatedCapas);
            setSelected(selected.filter(id => id !== capaId));
            showNotification('CAPA deleted successfully!', 'success');
        } catch (err) {
            showNotification('Failed to delete CAPA', 'error');
        }
        setOpenDeleteDialog(false);
        setSelectedCapa(null);
    };

    const handleBulkDelete = () => {
        showNotification('Bulk delete feature coming soon', 'warning');
    };

    const showNotification = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    const getStatusColor = (status) => {
        return COLORS.status[status] || COLORS.text.secondary;
    };

    const getSourceColor = (source) => {
        return COLORS.source[source] || COLORS.primary;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open': return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
            case 'In Progress': return <BuildIcon sx={{ fontSize: '0.7rem' }} />;
            case 'Completed': return <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />;
            case 'Effectiveness Under Review': return <AssessmentIcon sx={{ fontSize: '0.7rem' }} />;
            case 'Closed': return <ClosedIcon sx={{ fontSize: '0.7rem' }} />;
            case 'Overdue': return <WarningIcon sx={{ fontSize: '0.7rem' }} />;
            default: return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
        }
    };

    const paginatedCapas = filteredCapas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Filter Drawer Component for Mobile
    const FilterDrawer = () => (
        <Drawer
            anchor="bottom"
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    maxHeight: '80vh'
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
                        Filters
                    </Typography>
                    <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>

                <Stack spacing={2}>
                    <Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                            CAPA TYPE
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={capaTypeFilter}
                            onChange={(e) => setCapaTypeFilter(e.target.value)}
                            sx={inputStyle}
                        >
                            {CAPA_TYPE_OPTIONS.map(option => (
                                <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                            SOURCE
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            sx={inputStyle}
                        >
                            {SOURCE_OPTIONS.map(option => (
                                <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                            STATUS
                        </Typography>
                        <ToggleButtonGroup
                            fullWidth
                            size="small"
                            value={statusFilter}
                            exclusive
                            onChange={(e, value) => value && setStatusFilter(value)}
                            sx={{
                                '& .MuiToggleButton-root': {
                                    fontSize: '0.7rem',
                                    textTransform: 'none',
                                    borderColor: COLORS.border,
                                    '&.Mui-selected': {
                                        bgcolor: COLORS.primaryLight,
                                        color: COLORS.primary,
                                    }
                                }
                            }}
                        >
                            <ToggleButton value="All">All</ToggleButton>
                            <ToggleButton value="Open">Open</ToggleButton>
                            <ToggleButton value="In Progress">In Progress</ToggleButton>
                            <ToggleButton value="Closed">Closed</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={clearFilters}
                        sx={{
                            mt: 1,
                            height: 36,
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: COLORS.border,
                            color: COLORS.text.secondary
                        }}
                    >
                        Clear All Filters
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );

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

    if (!permissionsLoaded) return <LoadingState />;
    if (!canViewPage && !isSuperAdmin) return <AccessDenied />;

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
            {/* Page Header */}
            <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        fontWeight: 700,
                        color: COLORS.text.primary,
                        mb: 0.5
                    }}
                >
                    CAPA Master
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, color: COLORS.text.secondary }}>
                    Manage Corrective and Preventive Actions for quality improvement
                </Typography>
            </Box>

            {/* Filter Bar - Responsive */}
            <Paper sx={{
                p: { xs: 1, sm: 1.5 },
                mb: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                bgcolor: COLORS.background.white,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                border: `1px solid ${COLORS.border}`
            }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
                    {/* Search */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, flex: 2 }}>
                        <TextField
                            placeholder={isMobile ? "Search..." : "Search by CAPA ID, problem statement..."}
                            size="small"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            fullWidth={isMobile}
                            sx={{
                                flex: 1,
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

                        {/* Filter Button for Mobile */}
                        {isMobile && (
                            <Badge badgeContent={getActiveFilterCount()} color="primary">
                                <Button
                                    variant="outlined"
                                    onClick={() => setFilterDrawerOpen(true)}
                                    startIcon={<FilterIcon />}
                                    sx={{
                                        minWidth: 'auto',
                                        height: 36,
                                        px: 1.5,
                                        borderRadius: 1.5,
                                        borderColor: COLORS.border,
                                        color: COLORS.text.secondary
                                    }}
                                >
                                    Filters
                                </Button>
                            </Badge>
                        )}
                    </Stack>

                    {/* Desktop Filters */}
                    {!isMobile && (
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <TextField
                                select
                                size="small"
                                label="CAPA Type"
                                value={capaTypeFilter}
                                onChange={(e) => setCapaTypeFilter(e.target.value)}
                                sx={{
                                    width: 120,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5,
                                        fontSize: '0.75rem',
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '0.7rem',
                                    }
                                }}
                                SelectProps={{
                                    sx: { fontSize: '0.75rem', py: 0.5 }
                                }}
                            >
                                {CAPA_TYPE_OPTIONS.map(option => (
                                    <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                size="small"
                                label="Source"
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                                sx={{
                                    width: 150,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5,
                                        fontSize: '0.75rem',
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '0.7rem',
                                    }
                                }}
                                SelectProps={{
                                    sx: { fontSize: '0.75rem', py: 0.5 }
                                }}
                            >
                                {SOURCE_OPTIONS.map(option => (
                                    <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <ToggleButtonGroup
                                size="small"
                                value={statusFilter}
                                exclusive
                                onChange={(e, value) => value && setStatusFilter(value)}
                                sx={{
                                    height: 36,
                                    '& .MuiToggleButton-root': {
                                        fontSize: '0.7rem',
                                        px: 1.5,
                                        textTransform: 'none',
                                        borderColor: COLORS.border,
                                        '&.Mui-selected': {
                                            bgcolor: COLORS.primaryLight,
                                            color: COLORS.primary,
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value="All">All</ToggleButton>
                                <ToggleButton value="Open">Open</ToggleButton>
                                <ToggleButton value="In Progress">In Progress</ToggleButton>
                                <ToggleButton value="Closed">Closed</ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>
                    )}

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
                        {canDelete && selected.length > 0 && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                                onClick={handleBulkDelete}
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
                                disabled={loading}
                            >
                                {isMobile ? `${selected.length}` : `Delete (${selected.length})`}
                            </Button>
                        )}

                        {canCreate && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                                onClick={() => setOpenAddModal(true)}
                                fullWidth={isMobile && !selected.length}
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
                                {isMobile ? 'Add' : 'Create CAPA'}
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {/* Filter Drawer for Mobile */}
            <FilterDrawer />

            {/* CAPAs Table */}
            <Paper sx={{
                width: '100%',
                borderRadius: 2,
                overflow: 'auto',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                border: `1px solid ${COLORS.border}`
            }}>
                <TableContainer sx={{ minWidth: isMobile ? 800 : 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: COLORS.background.tableHeader,
                                '& .MuiTableCell-root': {
                                    borderBottom: 'none',
                                    color: COLORS.text.light,
                                    py: 1.5
                                }
                            }}>
                                {canDelete && (
                                    <TableCell padding="checkbox" sx={{ width: 40 }}>
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < filteredCapas.length}
                                            checked={filteredCapas.length > 0 && selected.length === filteredCapas.length}
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
                                            disabled={loading || filteredCapas.length === 0}
                                        />
                                    </TableCell>
                                )}
                                <TableCell sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px',
                                    color: COLORS.text.light
                                }}>
                                    CAPA Number
                                </TableCell>
                                
                                <TableCell sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px',
                                    color: COLORS.text.light
                                }}>
                                    Type
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px',
                                    color: COLORS.text.light
                                }}>
                                    Source
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px',
                                    color: COLORS.text.light
                                }}>
                                    Problem Statement
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px',
                                    color: COLORS.text.light
                                }}>
                                    Actions
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px',
                                    color: COLORS.text.light
                                }}>
                                    Status
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px',
                                    color: COLORS.text.light
                                }}>
                                    Target Date
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px',
                                    color: COLORS.text.light,
                                    width: 60
                                }} align="center">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                                            Loading CAPAs...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedCapas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                                                {searchTerm || capaTypeFilter !== 'All' || sourceFilter !== 'All' || statusFilter !== 'All'
                                                    ? 'No CAPAs found'
                                                    : 'No CAPAs available'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                                {(searchTerm || capaTypeFilter !== 'All' || sourceFilter !== 'All' || statusFilter !== 'All')
                                                    ? 'Try adjusting your filter criteria'
                                                    : 'Create your first CAPA to get started'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedCapas.map((capa, index) => {
                                    const isSelected = selected.includes(capa._id);
                                    const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedCapaForAction?._id === capa._id;
                                    const statusColor = getStatusColor(capa.status);
                                    const sourceColor = getSourceColor(capa.source);
                                    const totalActions = (capa.corrective_actions_count || 0) + (capa.preventive_actions_count || 0);

                                    return (
                                        <TableRow
                                            key={capa._id || index}
                                            hover
                                            selected={isSelected}
                                            sx={{
                                                bgcolor: COLORS.background.white,
                                                '&:hover': {
                                                    bgcolor: COLORS.background.hover
                                                },
                                                '&.Mui-selected': {
                                                    bgcolor: `${COLORS.primary}10`,
                                                    '&:hover': {
                                                        bgcolor: `${COLORS.primary}20`
                                                    }
                                                },
                                                '& .MuiTableCell-root': {
                                                    py: 1.5,
                                                    fontSize: '0.75rem',
                                                    borderColor: COLORS.border
                                                }
                                            }}
                                        >
                                            {canDelete && (
                                                <TableCell padding="checkbox" sx={{ width: 40 }}>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => handleSelect(capa._id)}
                                                        sx={{
                                                            color: COLORS.primary,
                                                            '&.Mui-checked': {
                                                                color: COLORS.primary,
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: '1.25rem'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                                    {capa.capa_id}
                                                </Typography>
                                            </TableCell>
                                          
                                            <TableCell>
                                                <Chip
                                                    label={capa.capa_type}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        height: 22,
                                                        bgcolor: `${COLORS.primary}20`,
                                                        color: COLORS.primary,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={capa.source}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        height: 22,
                                                        bgcolor: `${sourceColor}20`,
                                                        color: sourceColor,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={capa.problem_statement}>
                                                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                                                        {capa.problem_statement?.substring(0, 40)}...
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={<AssignmentIcon sx={{ fontSize: '0.7rem' }} />}
                                                    label={`${totalActions} Action${totalActions !== 1 ? 's' : ''}`}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        height: 22,
                                                        bgcolor: COLORS.primaryLight,
                                                        color: COLORS.primary
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(capa.status)}
                                                    label={capa.status}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        height: 22,
                                                        bgcolor: `${statusColor}20`,
                                                        color: statusColor,
                                                        fontWeight: 500,
                                                        '& .MuiChip-icon': {
                                                            fontSize: '0.7rem',
                                                            color: statusColor
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                                                    {formatDate(capa.target_close_date)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" sx={{ width: 60 }}>
                                                <ActionMenu
                                                    capa={capa}
                                                    onAction={handleAction}
                                                    anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                                                    onClose={handleActionMenuClose}
                                                    onOpen={(e) => handleActionMenuOpen(e, capa)}
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
                    rowsPerPageOptions={isMobile ? [5, 10, 25] : [5, 10, 25, 50]}
                    component="div"
                    count={filteredCapas.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) => isMobile ? `${from}-${to} of ${count}` : undefined}
                    sx={{
                        borderTop: `1px solid ${COLORS.border}`,
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.7rem',
                            color: COLORS.text.secondary
                        },
                        '& .MuiTablePagination-select': {
                            fontSize: '0.7rem'
                        },
                        '& .MuiTablePagination-actions button': {
                            color: COLORS.primary,
                        }
                    }}
                />
            </Paper>

            {/* Modals */}
            {canCreate && (
                <AddCapa
                    open={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onCapaAdded={handleAddCapa}
                />
            )}

            {selectedCapa && (
                <>
                    <ViewCapa
                        open={openViewModal}
                        onClose={() => { setOpenViewModal(false); setSelectedCapa(null); }}
                        capaId={selectedCapa._id}
                    />

                    <UpdateFields
                        open={openEditFieldsModal}
                        onClose={() => { setOpenEditFieldsModal(false); setSelectedCapa(null); }}
                        capaId={selectedCapa._id}
                        capaNumber={selectedCapa.capa_id}
                        onUpdated={handleUpdateFields}
                    />

                    <UpdateActions
                        open={openUpdateActionsModal}
                        onClose={() => { setOpenUpdateActionsModal(false); setSelectedCapa(null); }}
                        capaId={selectedCapa._id}
                        capaNumber={selectedCapa.capa_id}
                        onActionUpdated={handleUpdateAction}
                    />

                    <ReviewCapa
                        open={openReviewEffectivenessModal}
                        onClose={() => { setOpenReviewEffectivenessModal(false); setSelectedCapa(null); }}
                        capaId={selectedCapa._id}
                        capaNumber={selectedCapa.capa_id}
                        onEffectivenessRecorded={handleReviewEffectiveness}
                    />

                    <CloseCapa
                        open={openCloseModal}
                        onClose={() => { setOpenCloseModal(false); setSelectedCapa(null); }}
                        capaId={selectedCapa._id}
                        capaNumber={selectedCapa.capa_id}
                        onCapaClosed={handleCloseCapa}
                    />

                    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                        <DialogTitle>Delete CAPA</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete CAPA {selectedCapa.capa_id}? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                            <Button onClick={() => handleDeleteCapa(selectedCapa._id)} color="error">Delete</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
        );
};

export default CapaMaster;