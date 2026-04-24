// QualityCertMaster.jsx
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
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Send as SendIcon,
  PictureAsPdf as PdfIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from "../../../utils/modulePermissions";

// Import Quality Certificate components
import AddQualityCert from "./AddQualityCert";
import ViewQualityCert from "./ViewQualityCert";
import DownloadQualityCert from "./DownloadQualityCert";
import SendQualityCert from "./SendQualityCert";
// import EditQualityCert from "./EditQualityCert";
// import DeleteQualityCert from "./DeleteQualityCert";

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
  status: {
    'Sent': '#10B981',
    'Pending': '#F59E0B',
    'Downloaded': '#3B82F6'
  }
};

// Filter options
const CERT_TYPE_OPTIONS = ['All', 'Certificate of Conformance', 'Test Report', 'Material Certificate', 'Dimensional Report', 'Plating Certificate', 'FAI Report', 'PPAP Report'];
const STATUS_OPTIONS = ['All', 'Pending', 'Sent'];

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
const isActionAllowed = (cert, action) => {
  switch(action) {
    case 'view':
    case 'download':
      return true;
    case 'send':
      return !cert.sent_to_customer;
    default:
      return true;
  }
};

// Get action tooltip text
const getActionTooltip = (cert, action) => {
  switch(action) {
    case 'send':
      return cert.sent_to_customer ? 'Already sent to customer' : 'Mark as sent to customer';
    case 'download':
      return 'Download certificate PDF';
    default:
      return '';
  }
};

// Action Menu Component
const ActionMenu = ({ cert, onAction, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.QUALITY_CERT_MASTER, PAGES.QUALITY_CERT_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.QUALITY_CERT_MASTER, PAGES.QUALITY_CERT_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.QUALITY_CERT_MASTER, PAGES.QUALITY_CERT_MASTER, ACTIONS.DELETE);

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
      tooltip: 'View certificate details'
    },
    { 
      label: 'Download', 
      icon: <DownloadIcon fontSize="small" />, 
      action: 'download', 
      show: canView,
      allowed: true,
      tooltip: 'Download PDF certificate'
    },
    { 
      label: 'Send to Customer', 
      icon: <SendIcon fontSize="small" />, 
      action: 'send', 
      show: canUpdate && !cert.sent_to_customer,
      allowed: isActionAllowed(cert, 'send'),
      tooltip: getActionTooltip(cert, 'send'),
      completed: cert.sent_to_customer
    },
    { divider: true, show: canDelete },
    { 
      label: 'Delete', 
      icon: <DeleteIcon fontSize="small" />, 
      action: 'delete', 
      show: canDelete,
      allowed: true,
      tooltip: 'Delete certificate',
      color: '#EF4444'
    }
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
                      onAction(item.action, cert);
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
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" fontWeight={500} sx={{ color: item.color || COLORS.text.primary, fontSize: '0.75rem' }}>
                        {item.label}
                      </Typography>
                      {item.completed && (
                        <CheckCircleIcon sx={{ fontSize: '0.7rem', color: COLORS.success }} />
                      )}
                    </Stack>
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

const QualityCertMaster = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for data
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
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
  const [certTypeFilter, setCertTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedCertForAction, setSelectedCertForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected Certificate
  const [selectedCert, setSelectedCert] = useState(null);
  
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
      MODULES.QUALITY_CERT_MASTER,
      PAGES.QUALITY_CERT_MASTER,
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

  // Fetch Certificates from API
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchCertificates();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/quality-certificates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const formattedData = (response.data.data || []).map(cert => ({
          _id: cert._id,
          cert_id: cert.cert_id || '',
          cert_type: cert.cert_type || '',
          issue_date: cert.issue_date,
          part_no: cert.part_no || '',
          part_name: cert.part_name || '',
          customer_name: cert.customer_name || '',
          lot_no: cert.lot_no || '',
          quantity: cert.quantity || 0,
          sent_to_customer: cert.sent_to_customer || false,
          sent_at: cert.sent_at,
          created_by: cert.created_by,
          createdAt: cert.createdAt || new Date().toISOString(),
          certificate_path: cert.certificate_path
        }));
        
        setCertificates(formattedData);
        setFilteredCertificates(formattedData);
        
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      showNotification('Failed to load certificates. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters
  useEffect(() => {
    let filtered = [...certificates];
    
    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.cert_id?.toLowerCase().includes(value) ||
        cert.part_no?.toLowerCase().includes(value) ||
        cert.part_name?.toLowerCase().includes(value) ||
        cert.customer_name?.toLowerCase().includes(value)
      );
    }
    
    if (certTypeFilter !== 'All') {
      filtered = filtered.filter(cert => cert.cert_type === certTypeFilter);
    }
    
    if (statusFilter !== 'All') {
      const isSent = statusFilter === 'Sent';
      filtered = filtered.filter(cert => cert.sent_to_customer === isSent);
    }
    
    setFilteredCertificates(filtered);
  }, [searchTerm, certTypeFilter, statusFilter, certificates]);
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (certTypeFilter !== 'All') count++;
    if (statusFilter !== 'All') count++;
    return count;
  };

  const clearFilters = () => {
    setCertTypeFilter('All');
    setStatusFilter('All');
    setSearchInput('');
    setSearchTerm('');
    if (isMobile) setFilterDrawerOpen(false);
  };
  
  // Handle selection
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(filteredCertificates.map(cert => cert._id));
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
  const handleAction = (action, cert) => {
    if (!isActionAllowed(cert, action)) {
      showNotification(getActionTooltip(cert, action), 'warning');
      return;
    }
    
    setSelectedCert(cert);
    
    switch(action) {
      case 'view':
        setOpenViewModal(true);
        break;
      case 'download':
        setOpenDownloadModal(true);
        break;
      case 'send':
        setOpenSendModal(true);
        break;
      case 'delete':
        setOpenDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  const handleActionMenuOpen = (event, cert) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedCertForAction(cert);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedCertForAction(null);
  };
  
  // CRUD Handlers
  const handleAddCert = (newCert) => {
    let certData = newCert;
    if (newCert && newCert.data) certData = newCert.data;
    if (newCert && newCert.success && newCert.data) certData = newCert.data;
    
    const formattedCert = {
      _id: certData._id || Date.now().toString(),
      cert_id: certData.cert_id || '',
      cert_type: certData.cert_type || '',
      issue_date: certData.issue_date || new Date().toISOString(),
      part_no: certData.part_no || '',
      part_name: certData.part_name || '',
      customer_name: certData.customer_name || '',
      lot_no: certData.lot_no || '',
      quantity: certData.quantity || 0,
      sent_to_customer: false,
      createdAt: certData.createdAt || new Date().toISOString()
    };
    
    setCertificates(prev => [formattedCert, ...prev]);
    setPage(0);
    showNotification("Certificate generated successfully!", "success");
  };
  
  const handleDeleteCert = async (certId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/quality-certificates/${certId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedCerts = certificates.filter(cert => cert._id !== certId);
      setCertificates(updatedCerts);
      setSelected(selected.filter(id => id !== certId));
      showNotification('Certificate deleted successfully!', 'success');
    } catch (err) {
      showNotification('Failed to delete certificate', 'error');
    }
    setOpenDeleteDialog(false);
    setSelectedCert(null);
  };
  
  const handleSendCert = (sentData) => {
    const updatedCerts = certificates.map(cert =>
      cert._id === selectedCert?._id 
        ? { ...cert, sent_to_customer: true, sent_at: sentData.sent_at } 
        : cert
    );
    setCertificates(updatedCerts);
    showNotification(`Certificate marked as sent to customer!`, 'success');
    setOpenSendModal(false);
    setSelectedCert(null);
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
  
  const getStatusColor = (sentToCustomer) => {
    return sentToCustomer ? COLORS.status.Sent : COLORS.status.Pending;
  };
  
  const getStatusIcon = (sentToCustomer) => {
    return sentToCustomer ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <PendingIcon sx={{ fontSize: '0.7rem' }} />;
  };
  
  const paginatedCerts = filteredCertificates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              CERTIFICATE TYPE
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={certTypeFilter}
              onChange={(e) => setCertTypeFilter(e.target.value)}
              sx={inputStyle}
            >
              {CERT_TYPE_OPTIONS.map(option => (
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
              <ToggleButton value="Pending">Pending</ToggleButton>
              <ToggleButton value="Sent">Sent</ToggleButton>
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
          Quality Certificate Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, color: COLORS.text.secondary }}>
          Manage quality certificates for finished goods and customer submissions
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
              placeholder={isMobile ? "Search..." : "Search by certificate ID, part no, customer..."}
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
                label="Certificate Type"
                value={certTypeFilter}
                onChange={(e) => setCertTypeFilter(e.target.value)}
                sx={{ 
                  width: 180,
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
                {CERT_TYPE_OPTIONS.map(option => (
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
                <ToggleButton value="Pending">Pending</ToggleButton>
                <ToggleButton value="Sent">Sent</ToggleButton>
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
                {isMobile ? 'Add' : 'Generate Certificate'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Filter Drawer for Mobile */}
      <FilterDrawer />

      {/* Certificates Table */}
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
                      indeterminate={selected.length > 0 && selected.length < filteredCertificates.length}
                      checked={filteredCertificates.length > 0 && selected.length === filteredCertificates.length}
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
                      disabled={loading || filteredCertificates.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Certificate No
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Date
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
                  Part Details
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Customer
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Lot/Batch
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
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading certificates...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedCerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || certTypeFilter !== 'All' || statusFilter !== 'All'
                          ? 'No certificates found' 
                          : 'No certificates available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {(searchTerm || certTypeFilter !== 'All' || statusFilter !== 'All')
                          ? 'Try adjusting your filter criteria'
                          : 'Generate your first certificate to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCerts.map((cert, index) => {
                  const isSelected = selected.includes(cert._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedCertForAction?._id === cert._id;
                  const statusColor = getStatusColor(cert.sent_to_customer);

                  return (
                    <TableRow
                      key={cert._id || index}
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
                            onChange={() => handleSelect(cert._id)}
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
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PdfIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                            {cert.cert_id}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(cert.issue_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={cert.cert_type}
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
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                            {cert.part_no}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {cert.part_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {cert.customer_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {cert.lot_no || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(cert.sent_to_customer)}
                          label={cert.sent_to_customer ? 'Sent' : 'Pending'}
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
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          cert={cert}
                          onAction={handleAction}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, cert)}
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
          count={filteredCertificates.length}
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
        <AddQualityCert 
          open={openAddModal} 
          onClose={() => setOpenAddModal(false)} 
          onCertificateGenerated={handleAddCert}
        />
      )}
      
      {selectedCert && (
        <>
          <ViewQualityCert 
            open={openViewModal} 
            onClose={() => { setOpenViewModal(false); setSelectedCert(null); }} 
            certId={selectedCert._id}
          />
          
          <DownloadQualityCert 
            open={openDownloadModal} 
            onClose={() => { setOpenDownloadModal(false); setSelectedCert(null); }} 
            certId={selectedCert._id}
            certNumber={selectedCert.cert_id}
          />
          
          <SendQualityCert 
            open={openSendModal} 
            onClose={() => { setOpenSendModal(false); setSelectedCert(null); }} 
            certId={selectedCert._id}
            certNumber={selectedCert.cert_id}
            onCertificateSent={handleSendCert}
          />
          
          <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>Delete Certificate</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete certificate {selectedCert.cert_id}? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
              <Button onClick={() => handleDeleteCert(selectedCert._id)} color="error">Delete</Button>
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

export default QualityCertMaster;