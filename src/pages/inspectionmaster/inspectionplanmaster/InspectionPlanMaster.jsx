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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Assignment as PlanIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Engineering as EngineeringIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
  Pending as PendingIcon,
  ThumbUp as ApprovedIcon,
  Cancel as RejectedIcon,
  ThumbUpAlt as ApproveIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddInspectionPlan from './AddInspectionPlan';
import ViewInspectionPlan from './ViewInspectionPlan';
import DeleteInspectionPlan from './DeleteInspectionPlan';

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
  planType: {
    Incoming: { bg: '#E0F2FE', color: '#0369A1' },
    'In-Process': { bg: '#FEF3C7', color: '#B45309' },
    Final: { bg: '#D1FAE5', color: '#065F46' },
    'Pre-Dispatch': { bg: '#F3E8FF', color: '#7E22CE' },
    'Customer-Specific': { bg: '#FFE4E6', color: '#BE123C' },
    Combined: { bg: '#FCE7F3', color: '#BE185D' }
  },
  approvalStatus: {
    Pending: { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> },
    Approved: { bg: '#D1FAE5', color: '#065F46', icon: <ApprovedIcon sx={{ fontSize: '0.7rem' }} /> },
    Rejected: { bg: '#FEE2E2', color: '#991B1B', icon: <RejectedIcon sx={{ fontSize: '0.7rem' }} /> }
  }
};

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Approve Dialog Component
const ApproveDialog = ({ open, onClose, plan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);

  const handleApprove = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/inspection-plans/${plan._id}/approve`,
        { effective_from: effectiveFrom },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to approve inspection plan');
      }
    } catch (err) {
      console.error('Error approving inspection plan:', err);
      setError(err.response?.data?.message || 'Failed to approve inspection plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ApprovedIcon sx={{ color: '#10B981', fontSize: '1.5rem' }} />
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Approve Inspection Plan
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.primary, mb: 2 }}>
          Are you sure you want to approve this inspection plan?
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          bgcolor: COLORS.background.light, 
          borderRadius: 2, 
          border: `1px solid ${COLORS.border}`,
          mb: 2
        }}>
          <Stack spacing={1}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Plan ID
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                {plan?.plan_id}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Plan Name
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                {plan?.plan_name}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
            Effective From <span style={{ color: '#EF4444' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type="date"
            size="small"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.75rem',
                '&:hover fieldset': { borderColor: COLORS.primary },
                '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
              },
              '& .MuiInputBase-input': {
                py: 1,
                px: 1.5,
                fontSize: '0.75rem'
              }
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
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
          onClick={handleApprove}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ApprovedIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: '#10B981',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: '#059669' }
          }}
        >
          {loading ? 'Approving...' : 'Approve Plan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component
const ActionMenu = ({ plan, onView, onEdit, onDelete, onApprove, anchorEl, onClose, onOpen }) => {
  const isApproved = plan?.approval_status === 'Approved';
  const isPending = plan?.approval_status === 'Pending';
  
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            onView(plan);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {!isApproved && (
          <MenuItem 
            onClick={() => {
              onEdit(plan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Edit
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Approve Button - Only show for Pending plans */}
        {isPending && (
          <MenuItem 
            onClick={() => {
              onApprove(plan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <ApproveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Approve
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        <MenuItem 
          onClick={() => {
            onDelete(plan);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Approval Status Chip Component
const ApprovalStatusChip = ({ status }) => {
  const colors = COLORS.approvalStatus[status] || { bg: '#F1F5F9', color: '#475569', icon: null };
  return (
    <Chip
      icon={colors.icon}
      label={status}
      size="small"
      sx={{
        fontSize: '0.65rem',
        fontWeight: 500,
        height: 24,
        bgcolor: colors.bg,
        color: colors.color,
        '& .MuiChip-icon': {
          color: colors.color,
          fontSize: '0.7rem'
        }
      }}
    />
  );
};

const InspectionPlanMaster = () => {
  // State for data
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Filter states
  const [planTypeFilter, setPlanTypeFilter] = useState('All');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('All');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedPlanForAction, setSelectedPlanForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  
  // Selected plan
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch inspection plans from API
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/inspection-plans?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPlans(response.data.data || []);
        setFilteredPlans(response.data.data || []);
      } else {
        showNotification('Failed to load inspection plans', 'error');
      }
    } catch (err) {
      console.error('Error fetching inspection plans:', err);
      showNotification('Failed to load inspection plans. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Handle refresh
  const handleRefresh = () => {
    fetchPlans();
    showNotification('Data refreshed', 'success');
  };

  // Handle search and filters
  useEffect(() => {
    let filtered = [...plans];
    
    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.plan_id?.toLowerCase().includes(value) ||
        plan.plan_name?.toLowerCase().includes(value) ||
        plan.plan_type?.toLowerCase().includes(value) ||
        plan.item_id?.part_no?.toLowerCase().includes(value)
      );
    }
    
    if (planTypeFilter !== 'All') {
      filtered = filtered.filter(plan => plan.plan_type === planTypeFilter);
    }
    
    if (approvalStatusFilter !== 'All') {
      filtered = filtered.filter(plan => plan.approval_status === approvalStatusFilter);
    }
    
    setFilteredPlans(filtered);
  }, [searchTerm, planTypeFilter, approvalStatusFilter, plans]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredPlans.map(plan => plan._id));
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

  const handleActionMenuOpen = (event, plan) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedPlanForAction(plan);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedPlanForAction(null);
  };

  const openViewModalHandler = (plan) => {
    setSelectedPlan(plan);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditModalHandler = (plan) => {
    setSelectedPlan(plan);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openDeleteDialogHandler = (plan) => {
    setSelectedPlan(plan);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openApproveDialogHandler = (plan) => {
    setSelectedPlan(plan);
    setOpenApproveDialog(true);
    handleActionMenuClose();
  };

  const handleAddSuccess = () => {
    setOpenAddModal(false);
    fetchPlans();
    showNotification('Inspection plan created successfully!', 'success');
  };

  const handleEditSuccess = () => {
    setOpenEditModal(false);
    setSelectedPlan(null);
    fetchPlans();
    showNotification('Inspection plan updated successfully!', 'success');
  };

  const handleDeleteSuccess = () => {
    setOpenDeleteDialog(false);
    setSelectedPlan(null);
    fetchPlans();
    showNotification('Inspection plan deleted successfully!', 'success');
  };

  const handleApproveSuccess = () => {
    setOpenApproveDialog(false);
    setSelectedPlan(null);
    fetchPlans();
    showNotification('Inspection plan approved successfully!', 'success');
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    
    // Filter out approved plans from bulk delete
    const approvedPlans = selected.filter(id => {
      const plan = plans.find(p => p._id === id);
      return plan?.approval_status === 'Approved';
    });
    
    if (approvedPlans.length > 0) {
      showNotification(`Cannot delete ${approvedPlans.length} approved plan(s). Please unselect them.`, 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      for (const id of selected) {
        await axios.delete(`${BASE_URL}/api/inspection-plans/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      setSelected([]);
      fetchPlans();
      showNotification(`${selected.length} plan(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete some plans', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const getPlanTypeChip = (planType) => {
    const colors = COLORS.planType[planType] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={planType}
        size="small"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 500,
          height: 24,
          bgcolor: colors.bg,
          color: colors.color
        }}
      />
    );
  };

  // Get unique plan types for filter
  const uniquePlanTypes = ['All', ...new Set(plans.map(p => p.plan_type).filter(Boolean))];
  const uniqueApprovalStatuses = ['All', ...new Set(plans.map(p => p.approval_status).filter(Boolean))];

  const paginatedPlans = filteredPlans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          Inspection Plan Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage inspection plans, checkpoints, and quality control parameters
        </Typography>
      </Box>

      {/* Filter and Action Bar */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by plan ID, name, part no..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 280 },
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
            
            <TextField
              select
              size="small"
              label="Plan Type"
              value={planTypeFilter}
              onChange={(e) => setPlanTypeFilter(e.target.value)}
              sx={{ 
                width: 180,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                }
              }}
              SelectProps={{
                sx: { height: 36, fontSize: '0.75rem' }
              }}
            >
              {uniquePlanTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            
            <TextField
              select
              size="small"
              label="Approval Status"
              value={approvalStatusFilter}
              onChange={(e) => setApprovalStatusFilter(e.target.value)}
              sx={{ 
                width: 160,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                }
              }}
              SelectProps={{
                sx: { height: 36, fontSize: '0.75rem' }
              }}
            >
              {uniqueApprovalStatuses.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {selected.length > 0 && (
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
                Delete ({selected.length})
              </Button>
            )}
            
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => setOpenAddModal(true)}
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
              Add Plan
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Inspection Plans Table */}
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
                  py: 1.5
                }
              }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredPlans.length}
                    checked={filteredPlans.length > 0 && selected.length === filteredPlans.length}
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
                    disabled={loading || filteredPlans.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Plan ID
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Plan Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Plan Type
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Item / Part No
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  AQL Level
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Approval Status
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Checkpoints
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  width: 60,
                  color: COLORS.text.light
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading inspection plans...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PlanIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || planTypeFilter !== 'All' || approvalStatusFilter !== 'All' ? 'No inspection plans found' : 'No inspection plans available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm || planTypeFilter !== 'All' || approvalStatusFilter !== 'All' ? 'Try adjusting your search terms' : 'Add your first inspection plan'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPlans.map((plan, index) => {
                  const isSelected = selected.includes(plan._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedPlanForAction?._id === plan._id;
                  const isApproved = plan.approval_status === 'Approved';

                  return (
                    <TableRow
                      key={plan._id || index}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: isApproved ? `${COLORS.primary}05` : COLORS.background.white,
                        '&:hover': {
                          bgcolor: isApproved ? `${COLORS.primary}10` : COLORS.background.hover
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
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(plan._id)}
                          disabled={isApproved}
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
                      
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar 
                            sx={{ 
                              width: 28, 
                              height: 28, 
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            <PlanIcon sx={{ fontSize: '0.8rem' }} />
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                            {plan.plan_id}
                          </Typography>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {plan.plan_name}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {getPlanTypeChip(plan.plan_type)}
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {plan.item_id?.part_no || '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {plan.aql_level || '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <ApprovalStatusChip status={plan.approval_status || 'Pending'} />
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {plan.checkpoints?.length || 0} checkpoint(s)
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          plan={plan}
                          onView={openViewModalHandler}
                          onEdit={openEditModalHandler}
                          onDelete={openDeleteDialogHandler}
                          onApprove={openApproveDialogHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, plan)}
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
          count={filteredPlans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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

      {/* Modal Components */}
      <AddInspectionPlan 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedPlan && (
        <>
          <AddInspectionPlan 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedPlan(null);
            }}
            onSuccess={handleEditSuccess}
            initialData={selectedPlan}
            isEditMode={true}
          />

          <ViewInspectionPlan 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedPlan(null);
            }}
            plan={selectedPlan}
          />

          <DeleteInspectionPlan 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedPlan(null);
            }}
            plan={selectedPlan}
            onDelete={handleDeleteSuccess}
          />

          <ApproveDialog
            open={openApproveDialog}
            onClose={() => {
              setOpenApproveDialog(false);
              setSelectedPlan(null);
            }}
            plan={selectedPlan}
            onSuccess={handleApproveSuccess}
          />
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InspectionPlanMaster;