import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  TablePagination,
  Avatar,
  Collapse
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Calculate as CalculateIcon,
  Refresh as RefreshIcon,
  PlayArrow as RollupIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS, STATUS_COLORS } from '../constants';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../../utils/modulePermissions';
import CalculateCost from './CalculateCost';
import CostRollup from './CostRollup';

const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error">Access Denied</Typography>
    <Typography variant="body2" color="text.secondary">You don't have permission to view this page.</Typography>
  </Box>
);

// Action Menu Component for BOM
const BomActionMenu = ({ 
  item, 
  anchorEl, 
  onOpen, 
  onClose, 
  onCalculateCost, 
  onCostRollup,
  permissions 
}) => {
  const canCalculate = permissions?.create || permissions?.update;
  const canRollup = permissions?.create || permissions?.update;

  return (
    <>
      <Tooltip title="Costing Actions">
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
        {canCalculate && (
          <MenuItem onClick={() => { onCalculateCost(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <CalculateIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Calculate Cost
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canRollup && (
          <MenuItem onClick={() => { onCostRollup(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <RollupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
                Cost Rollup
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const BomCosting = ({ permissions: propPermissions, onActionComplete, showNotification }) => {
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState('');
  
  // Modal states
  const [openCalculateModal, setOpenCalculateModal] = useState(false);
  const [openRollupModal, setOpenRollupModal] = useState(false);
  const [selectedBom, setSelectedBom] = useState(null);
  
  // Action menu states
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedBomForAction, setSelectedBomForAction] = useState(null);

  // User permissions
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [costingPermissions, setCostingPermissions] = useState({ 
    view: false, 
    create: false, 
    update: false, 
    delete: false 
  });

  // Helper functions for avatar
  const getBomInitials = (bom) => {
    if (!bom.bom_id) return 'BM';
    return bom.bom_id.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (bom) => {
    if (!bom.bom_id) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = bom.bom_id.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

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
      } finally {
        setPermissionsLoaded(true);
      }
    };
    fetchUserPermissions();
  }, []);

  // Set costing permissions
  useEffect(() => {
    if (permissionsLoaded) {
      setCostingPermissions({
        view: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_COSTING, ACTIONS.VIEW),
        create: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_COSTING, ACTIONS.CREATE),
        update: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_COSTING, ACTIONS.UPDATE),
        delete: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_COSTING, ACTIONS.DELETE)
      });
    }
  }, [permissionsLoaded, userPermissions, isSuperAdmin]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch BOMs
  const fetchBoms = useCallback(async () => {
    if (!costingPermissions.view) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await axios.get(`${BASE_URL}/api/boms?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setBoms(response.data.data || []);
        setTotalItems(response.data.pagination?.total || response.data.data.length);
      } else {
        setError(response.data.message || 'Failed to load BOMs');
      }
    } catch (err) {
      console.error('Error fetching BOMs:', err);
      setError(err.response?.data?.message || 'Failed to load BOMs');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, costingPermissions.view]);

  useEffect(() => {
    if (permissionsLoaded && costingPermissions.view) {
      fetchBoms();
    }
  }, [fetchBoms, permissionsLoaded, costingPermissions.view]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event, bom) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedBomForAction(bom);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedBomForAction(null);
  };

  const handleCalculateCost = (bom) => {
    setSelectedBom(bom);
    setOpenCalculateModal(true);
    handleActionMenuClose();
  };

  const handleCostRollup = (bom) => {
    setSelectedBom(bom);
    setOpenRollupModal(true);
    handleActionMenuClose();
  };

  const handleCalculateSuccess = () => {
    fetchBoms();
    if (showNotification) showNotification('Cost calculated successfully!', 'success');
    if (onActionComplete) onActionComplete();
  };

  const handleRollupSuccess = () => {
    fetchBoms();
    if (showNotification) showNotification('Cost rollup completed successfully!', 'success');
    if (onActionComplete) onActionComplete();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getTotalCost = (bom) => {
    return bom.costing?.total_cost || 0;
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />;
      case 'Pending': return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
      default: return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
    }
  };

  if (!permissionsLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={40} sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  if (!costingPermissions.view) {
    return <AccessDenied />;
  }

  return (
    <Box>
      {/* Search Bar */}
      <Paper sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        border: `1px solid ${COLORS.border}`,
        mb: 2.5
      }}>
        <Box sx={{ p: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search BOMs by ID, name, or parent part..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 360 },
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
          
          <Tooltip title="Refresh">
            <IconButton onClick={fetchBoms} sx={{ height: 36, width: 36 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* BOMs Table */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: COLORS.background.tableHeader,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: COLORS.text.light,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap'
                }
              }}>
                <TableCell sx={{ minWidth: 180 }}>BOM ID / Parent Item</TableCell>
                <TableCell sx={{ width: 100 }}>Version</TableCell>
                <TableCell sx={{ width: 100 }}>Type</TableCell>
                <TableCell sx={{ width: 110 }}>Status</TableCell>
                <TableCell sx={{ width: 100 }} align="center">Components</TableCell>
                <TableCell sx={{ width: 110 }}>Total Cost</TableCell>
                <TableCell sx={{ width: 80 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading BOMs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : boms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No BOMs found' : 'No BOMs available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Create a BOM to get started with costing'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                boms.map((bom) => {
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedBomForAction?._id === bom._id;
                  const totalCost = getTotalCost(bom);
                  const hasCosting = bom.costing !== null && bom.costing !== undefined;
                  const parentItem = bom.parent_item_id || {};
                  const statusColors = getStatusColor(bom.status);
                  
                  return (
                    <React.Fragment key={bom._id}>
                      <TableRow hover sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border }
                      }}>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(bom), fontSize: '0.7rem', flexShrink: 0 }}>
                              {getBomInitials(bom)}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{bom.bom_id}</Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, whiteSpace: 'nowrap' }}>
                                {parentItem.part_no || bom.parent_part_no}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        
                        <TableCell>
                          <Chip 
                            label={bom.bom_version} 
                            size="small" 
                            sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 500, fontSize: '0.7rem' }} 
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{bom.bom_type}</Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(bom.status)}
                            label={bom.status || 'Pending'}
                            size="small"
                            sx={{
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              '& .MuiChip-icon': { fontSize: '0.8rem' }
                            }}
                          />
                        </TableCell>
                        
                        <TableCell align="center">
                          <Typography fontWeight={500} sx={{ whiteSpace: 'nowrap' }}>{bom.components?.length || 0}</Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: hasCosting ? COLORS.primary : COLORS.text.tertiary, whiteSpace: 'nowrap' }}>
                            {hasCosting ? formatCurrency(totalCost) : '-'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center" sx={{ width: 80 }}>
                          <BomActionMenu
                            item={bom}
                            anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                            onOpen={(e) => handleActionMenuOpen(e, bom)}
                            onClose={handleActionMenuClose}
                            onCalculateCost={handleCalculateCost}
                            onCostRollup={handleCostRollup}
                            permissions={costingPermissions}
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
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
            },
            '& .MuiTablePagination-select': { fontSize: '0.7rem' },
            '& .MuiTablePagination-actions button': { color: COLORS.primary }
          }}
        />
      </Paper>

      {/* Modals - Only show if user has create/update permissions */}
      {selectedBom && (costingPermissions.create || costingPermissions.update) && (
        <>
          <CalculateCost 
            open={openCalculateModal}
            onClose={() => {
              setOpenCalculateModal(false);
              setSelectedBom(null);
            }}
            bomId={selectedBom._id}
            onSuccess={handleCalculateSuccess}
          />

          <CostRollup 
            open={openRollupModal}
            onClose={() => {
              setOpenRollupModal(false);
              setSelectedBom(null);
            }}
            bomId={selectedBom._id}
            onSuccess={handleRollupSuccess}
          />
        </>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default BomCosting;