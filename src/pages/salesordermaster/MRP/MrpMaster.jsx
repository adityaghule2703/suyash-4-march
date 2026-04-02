// MrpMaster.jsx
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
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Factory as FactoryIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  PlayArrow as PlayArrowIcon,
  Assessment as AssessmentIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Delete as DeleteIcon,
  Replay as ReplayIcon
} from '@mui/icons-material';
import axios from 'axios';
import { 
  COLORS, 
  MRP_STATUS_COLORS, 
  MRP_RUN_TYPE_COLORS,
  MRP_DEFAULTS,
  isMRPRunInProgress,
  isMRPRunCompleted,
  isMRPRunFailed
} from './constants';
import MrpRun from './MrpRun';
import ViewMrpRun from './ViewMrpRun';
import MrpRunStatus from './MrpRunStatus';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

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

// Status Chip Component
const StatusChip = ({ status, size = 'small' }) => {
  const statusConfig = MRP_STATUS_COLORS[status] || MRP_STATUS_COLORS['Queued'];
  const getIcon = () => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon sx={{ fontSize: size === 'small' ? '0.8rem' : '1rem' }} />;
      case 'Running':
        return <PendingIcon sx={{ fontSize: size === 'small' ? '0.8rem' : '1rem' }} />;
      case 'Failed':
        return <ErrorIcon sx={{ fontSize: size === 'small' ? '0.8rem' : '1rem' }} />;
      default:
        return <ScheduleIcon sx={{ fontSize: size === 'small' ? '0.8rem' : '1rem' }} />;
    }
  };

  return (
    <Chip
      icon={getIcon()}
      label={status}
      size={size}
      sx={{
        fontSize: size === 'small' ? '0.65rem' : '0.75rem',
        fontWeight: 500,
        height: size === 'small' ? 24 : 32,
        bgcolor: statusConfig.bg,
        color: statusConfig.color,
        border: `1px solid ${statusConfig.border}`,
        '& .MuiChip-icon': {
          color: statusConfig.color
        }
      }}
    />
  );
};

// Run Type Chip Component
const RunTypeChip = ({ runType }) => {
  const typeConfig = MRP_RUN_TYPE_COLORS[runType] || MRP_RUN_TYPE_COLORS['Full'];
  return (
    <Chip
      label={runType}
      size="small"
      sx={{
        fontSize: '0.65rem',
        fontWeight: 500,
        height: 22,
        bgcolor: typeConfig.bg,
        color: typeConfig.color,
        border: `1px solid ${typeConfig.border}`
      }}
    />
  );
};

// Action Menu Component with permission checks
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onViewDetails, onViewStatus, onRerun, permissions, isSuperAdmin }) => {
  const isTerminal = isMRPRunCompleted(item?.status) || isMRPRunFailed(item?.status);
  
  // Check permissions for MRP module
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.MRP, PAGES.MRP, ACTIONS.VIEW);
  const canCreate = isSuperAdmin || hasPermission(permissions, MODULES.MRP, PAGES.MRP, ACTIONS.CREATE);

  // Count how many actions are available
  const hasAnyActions = canView;
  
  if (!hasAnyActions) {
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
            minWidth: 200,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {canView && (
          <MenuItem onClick={() => { onViewDetails(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <AssessmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                View Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canView && (
          <MenuItem onClick={() => { onViewStatus(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <TimelineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                View Status
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {isTerminal && canCreate && (
          <MenuItem onClick={() => { onRerun(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <ReplayIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                Rerun MRP
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// Main Component
const MrpMaster = () => {
  const [mrpRuns, setMrpRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(MRP_DEFAULTS.PAGE_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedMRPForAction, setSelectedMRPForAction] = useState(null);
  const [selectedMRP, setSelectedMRP] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Modal states
  const [openRunMRPModal, setOpenRunMRPModal] = useState(false);
  const [openViewDetailsModal, setOpenViewDetailsModal] = useState(false);
  const [openViewStatusModal, setOpenViewStatusModal] = useState(false);

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
          
          // Set permissions array
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
    // Super admin has all permissions
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      MODULES.MRP,
      PAGES.MRP,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch MRP Runs - only if user has permission
  const fetchMRPRuns = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await axios.get(`${BASE_URL}/api/mrp/runs?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const runs = response.data.data || [];
        setMrpRuns(runs);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load MRP runs', 'error');
      }
    } catch (err) {
      console.error('Error fetching MRP runs:', err);
      showNotification('Failed to load MRP runs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchMRPRuns();
    } else if (permissionsLoaded && !canViewPage && !isSuperAdmin) {
      setLoading(false);
    }
  }, [fetchMRPRuns, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle MRP Run completion
  const handleRunMRPSuccess = (mrpRunData) => {
    fetchMRPRuns();
    showNotification(`MRP Run ${mrpRunData?.mrp_run_id || 'started'} successfully!`, 'success');
    setOpenRunMRPModal(false);
  };
  
  const handleRerun = async (mrpRun) => {
    if (!canCreate) {
      showNotification('You don\'t have permission to rerun MRP', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/mrp/run`,
        {
          run_type: mrpRun.run_type,
          planning_horizon: mrpRun.planning_horizon,
          so_ids: mrpRun.so_ids_considered || []
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showNotification('MRP Run queued successfully!', 'success');
        fetchMRPRuns();
      } else {
        showNotification(response.data.message || 'Failed to queue MRP run', 'error');
      }
    } catch (err) {
      console.error('Error rerunning MRP:', err);
      showNotification('Failed to queue MRP run', 'error');
    }
  };
  
  const handleActionMenuOpen = (event, run) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedMRPForAction(run);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedMRPForAction(null);
  };

  const openViewDetailsHandler = (run) => {
    setSelectedMRP(run);
    setOpenViewDetailsModal(true);
    handleActionMenuClose();
  };
  
  const openViewStatusHandler = (run) => {
    setSelectedMRP(run);
    setOpenViewStatusModal(true);
    handleActionMenuClose();
  };
  
  const openRerunHandler = (run) => {
    handleRerun(run);
    handleActionMenuClose();
  };
  
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getMRPInitials = (run) => {
    if (!run.mrp_run_id) return 'MR';
    return run.mrp_run_id.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (run) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = (run.mrp_run_id?.charCodeAt(0) || 0);
    return colors[charCode % colors.length];
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
          MRP Run History
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Track and manage Material Requirements Planning runs, view generated purchase requisitions and work orders
        </Typography>
      </Box>

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
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by MRP Run ID, Status, or Run Type..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 400 },
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
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
              onClick={fetchMRPRuns}
              sx={{
                height: 36,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderColor: COLORS.border,
                color: COLORS.text.secondary,
                '&:hover': {
                  borderColor: COLORS.primary,
                  color: COLORS.primary
                }
              }}
              disabled={loading}
            >
              Refresh
            </Button>
            
            {/* Run New MRP Button - Only show if user has CREATE permission */}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenRunMRPModal(true)}
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
                Run New MRP
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* MRP Runs Table */}
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
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  MRP Run ID / Details
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Run Configuration
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Outputs
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Run Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 80 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading MRP Runs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : mrpRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No MRP Runs found' : 'No MRP Runs available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Run your first MRP to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                mrpRuns.map((run) => {
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedMRPForAction?._id === run._id;
                  const avatarColor = getAvatarColor(run);
                  
                  return (
                    <TableRow
                      key={run._id}
                      hover
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getMRPInitials(run)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {run.mrp_run_id}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Job: {run.job_id?.substring(0, 8) || 'N/A'}...
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ mb: 0.5 }}>
                          <RunTypeChip runType={run.run_type} />
                        </Box>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Horizon: {run.planning_horizon} days
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          SOs: {run.so_ids_considered?.length || 'All'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Purchase Requisitions">
                            <Chip
                              icon={<ShoppingCartIcon sx={{ fontSize: '0.7rem' }} />}
                              label={run.pr_count || 0}
                              size="small"
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          </Tooltip>
                          <Tooltip title="Work Orders">
                            <Chip
                              icon={<FactoryIcon sx={{ fontSize: '0.7rem' }} />}
                              label={run.wo_count || 0}
                              size="small"
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={run.status} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {formatDate(run.run_date)}
                        </Typography>
                        {run.completed_at && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Completed: {formatDate(run.completed_at)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <ActionMenu 
                          item={run}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, run)}
                          onClose={handleActionMenuClose}
                          onViewDetails={openViewDetailsHandler}
                          onViewStatus={openViewStatusHandler}
                          onRerun={openRerunHandler}
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={MRP_DEFAULTS.PAGE_SIZE_OPTIONS}
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
      {/* Run New MRP Modal - Only show if user has CREATE permission */}
      {canCreate && (
        <MrpRun 
          open={openRunMRPModal}
          onClose={() => setOpenRunMRPModal(false)}
          onRunComplete={handleRunMRPSuccess}
        />
      )}

      {selectedMRP && (
        <>
          <ViewMrpRun
            open={openViewDetailsModal}
            onClose={() => {
              setOpenViewDetailsModal(false);
              setSelectedMRP(null);
            }}
            mrpRunId={selectedMRP._id}
            onRerun={handleRerun}
          />

          <MrpRunStatus
            open={openViewStatusModal}
            onClose={() => {
              setOpenViewStatusModal(false);
              setSelectedMRP(null);
            }}
            mrpRunId={selectedMRP._id}
            onRerun={handleRerun}
            autoRefresh={true}
            refreshInterval={3000}
          />
        </>
      )}

      {/* Snackbar Notification */}
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MrpMaster;