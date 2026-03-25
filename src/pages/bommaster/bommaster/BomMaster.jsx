// BomMaster.jsx
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
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  LocationSearching as WhereUsedIcon,
  ThumbUp as ApproveIcon,
  Star as DefaultIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddBom from './AddBom';
import ViewBom from './ViewBom';
import EditBom from './EditBom';
import DeleteBom from './DeleteBom';
import { COLORS } from './constants';

// Color constants
const STATUS_COLORS = {
  Pending: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  Approved: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Rejected: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Draft: { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  Active: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Cancelled: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Archived: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
};

// Action Menu Component
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onWhereUsed, onApprove, onSetDefault }) => {
  const isApproved = item?.status === 'Approved';
  
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
        
        <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              Edit
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { onWhereUsed(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
            <WhereUsedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
              Where Used
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {item?.status === 'Pending' && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
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
        
        {isApproved && (
          <MenuItem onClick={() => { onSetDefault(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <DefaultIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                Set as Default
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
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

// Where Used Modal Component
const WhereUsedModal = ({ open, onClose, component, usedInBoms, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />;
      case 'Pending':
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />;
      case 'Rejected':
      case 'Cancelled':
        return <CancelIcon sx={{ fontSize: '0.8rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
    }
  };
  
  const getStatusColor = (status) => {
    const colors = STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
    return colors;
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
          Where Used
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : (
          <>
            {/* Component Info */}
            <Paper sx={{ 
              p: 2, 
              mb: 2.5, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                Component
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                {component?.part_no}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                {component?.part_description}
              </Typography>
            </Paper>
            
            {/* Used In BOMs List */}
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Used in {usedInBoms?.length || 0} BOM(s)
            </Typography>
            
            {usedInBoms?.length === 0 ? (
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center', 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5 
              }}>
                <InventoryIcon sx={{ fontSize: 40, color: COLORS.text.tertiary, mb: 1 }} />
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }}>
                  This component is not used in any BOM
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={1.5}>
                {usedInBoms.map((bom, index) => {
                  const statusColors = getStatusColor(bom.status);
                  return (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        }
                      }}
                    >
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            BOM ID
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {bom.bom_id}
                          </Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Parent Part
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                            {bom.parent_part_no}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            {bom.parent_description}
                          </Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 6, sm: 2 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Version
                          </Typography>
                          <Chip
                            label={bom.bom_version}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              height: 22,
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary
                            }}
                          />
                        </Grid>
                        
                        <Grid size={{ xs: 6, sm: 2 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Status
                          </Typography>
                          <Chip
                            icon={getStatusIcon(bom.status)}
                            label={bom.status}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              height: 24,
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              border: `1px solid ${statusColors.border}`
                            }}
                          />
                        </Grid>
                        
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Effective From
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            {formatDate(bom.effective_from)}
                          </Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Effective To
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            {formatDate(bom.effective_to)}
                          </Typography>
                        </Grid>
                        
                        {bom.is_default && (
                          <Grid size={{ xs: 12 }}>
                            <Chip
                              icon={<DefaultIcon sx={{ fontSize: '0.7rem' }} />}
                              label="Default Version"
                              size="small"
                              sx={{ 
                                fontSize: '0.65rem',
                                height: 22,
                                bgcolor: '#FEF3C7',
                                color: '#D97706'
                              }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
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

// Import CloseIcon for modal
import CloseIcon from '@mui/icons-material/Close';

const BomMaster = () => {
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedBomForAction, setSelectedBomForAction] = useState(null);
  const [selectedBom, setSelectedBom] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openWhereUsedModal, setOpenWhereUsedModal] = useState(false);
  
  // Where Used data
  const [whereUsedData, setWhereUsedData] = useState(null);
  const [whereUsedLoading, setWhereUsedLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch BOMs from API
  const fetchBoms = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/boms?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setBoms(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load BOMs', 'error');
      }
    } catch (err) {
      console.error('Error fetching BOMs:', err);
      showNotification('Failed to load BOMs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchBoms();
  }, [fetchBoms]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(boms.map(bom => bom._id));
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
  
  const handleAddBom = () => {
    fetchBoms();
    showNotification('BOM added successfully!', 'success');
  };
  
  const handleEditBom = () => {
    fetchBoms();
    showNotification('BOM updated successfully!', 'success');
  };
  
  const handleDeleteBom = () => {
    fetchBoms();
    setSelected([]);
    showNotification('BOM deleted successfully!', 'success');
  };
  
  const handleApproveBom = async (bom) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/boms/${bom._id}/approve`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        showNotification('BOM approved successfully!', 'success');
        fetchBoms();
      } else {
        showNotification(response.data.message || 'Failed to approve BOM', 'error');
      }
    } catch (err) {
      console.error('Error approving BOM:', err);
      showNotification('Failed to approve BOM', 'error');
    }
  };
  
  const handleSetDefaultBom = async (bom) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/boms/${bom._id}/set-default`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        showNotification('BOM set as default successfully!', 'success');
        fetchBoms();
      } else {
        showNotification(response.data.message || 'Failed to set BOM as default', 'error');
      }
    } catch (err) {
      console.error('Error setting BOM as default:', err);
      showNotification('Failed to set BOM as default', 'error');
    }
  };
  
  const handleWhereUsed = async (bom) => {
    setOpenWhereUsedModal(true);
    setWhereUsedLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      // Get the first component from the BOM to show where it's used
      const componentId = bom.components?.[0]?.component_item_id?._id || bom.components?.[0]?.component_item_id;
      
      if (componentId) {
        const response = await axios.get(`${BASE_URL}/api/boms/where-used/${componentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setWhereUsedData(response.data.data);
        } else {
          showNotification('Failed to load where-used data', 'error');
        }
      } else {
        setWhereUsedData(null);
      }
    } catch (err) {
      console.error('Error fetching where-used data:', err);
      showNotification('Failed to load where-used data', 'error');
    } finally {
      setWhereUsedLoading(false);
    }
  };
  
  const handleActionMenuOpen = (event, bom) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedBomForAction(bom);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedBomForAction(null);
  };

  const openViewBomModal = (bom) => {
    setSelectedBom(bom);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openEditBomModal = (bom) => {
    setSelectedBom(bom);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteBomDialog = (bom) => {
    setSelectedBom(bom);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  const openWhereUsedModalFunc = (bom) => {
    setSelectedBom(bom);
    handleWhereUsed(bom);
    handleActionMenuClose();
  };
  
  const handleApprove = (bom) => {
    handleApproveBom(bom);
    handleActionMenuClose();
  };
  
  const handleSetDefault = (bom) => {
    handleSetDefaultBom(bom);
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
      day: 'numeric'
    });
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return <CheckCircleIcon sx={{ fontSize: '0.9rem', color: '#059669' }} />;
      case 'Pending':
        return <PendingIcon sx={{ fontSize: '0.9rem', color: '#D97706' }} />;
      case 'Rejected':
      case 'Cancelled':
        return <CancelIcon sx={{ fontSize: '0.9rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.9rem', color: '#4F46E5' }} />;
    }
  };
  
  const getBomInitials = (bom) => {
    if (!bom.parent_part_no) return 'BM';
    return bom.parent_part_no.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (bom) => {
    if (!bom.parent_part_no) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = bom.parent_part_no.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Expandable Row Component for Components
  const ExpandableRow = ({ bom }) => {
    const [expanded, setExpanded] = useState(false);

    if (!bom.components?.length) return null;

    return (
      <>
        <TableRow sx={{ '&:hover': { bgcolor: COLORS.background.hover } }}>
          <TableCell padding="checkbox" sx={{ width: 40 }} />
          <TableCell>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </TableCell>
          <TableCell colSpan={7}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {bom.components.length} Component(s)
              </Typography>
              <Chip
                label={`Version: ${bom.bom_version}`}
                size="small"
                sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
              />
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', fontWeight: 600, mb: 1, color: COLORS.text.secondary }}>
                  Components List
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Level</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Qty Per</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Scrap %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bom.components.map((comp, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.level}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.component_part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.component_desc}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.quantity_per}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.unit}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.scrap_percent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

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
          BOM Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage Bill of Materials, track versions, and monitor component requirements
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
              placeholder="Search by BOM ID, Parent Part No, or Version..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 450 },
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
            {selected.length > 0 && (
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
              Add BOM
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* BOMs Table */}
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
                    indeterminate={selected.length > 0 && selected.length < boms.length}
                    checked={boms.length > 0 && selected.length === boms.length}
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
                    disabled={loading || boms.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 40 }}></TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  BOM ID / Parent Item
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Version
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Components
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Effective From
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Created At
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading BOMs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : boms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No BOMs found' : 'No BOMs available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first BOM to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                boms.map((bom) => {
                  const isSelected = selected.includes(bom._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedBomForAction?._id === bom._id;
                  const avatarColor = getAvatarColor(bom);
                  const statusColors = STATUS_COLORS[bom.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
                  const parentItem = bom.parent_item_id || {};
                  
                  return (
                    <React.Fragment key={bom._id}>
                      <TableRow
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
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(bom._id)}
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
                        <TableCell sx={{ width: 40 }}>
                          {(bom.components?.length || 0) > 0 && (
                            <IconButton size="small">
                              <ExpandMoreIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                              {getBomInitials(bom)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                {bom.bom_id}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {parentItem.part_no || bom.parent_part_no}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bom.bom_version}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              height: 24,
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {bom.bom_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(bom.status)}
                            label={bom.status || 'Pending'}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              height: 24,
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              border: `1px solid ${statusColors.border}`,
                              '& .MuiChip-icon': {
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {bom.components?.length || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            {formatDate(bom.effective_from)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            {formatDate(bom.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 60 }}>
                          <ActionMenu 
                            item={bom}
                            anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                            onOpen={(e) => handleActionMenuOpen(e, bom)}
                            onClose={handleActionMenuClose}
                            onView={openViewBomModal}
                            onEdit={openEditBomModal}
                            onDelete={openDeleteBomDialog}
                            onWhereUsed={openWhereUsedModalFunc}
                            onApprove={handleApprove}
                            onSetDefault={handleSetDefault}
                          />
                        </TableCell>
                      </TableRow>
                      <ExpandableRow bom={bom} />
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
      <AddBom 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddBom}
      />

      {selectedBom && (
        <>
          <ViewBom 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedBom(null);
            }}
            bom={selectedBom}
          />

          <EditBom 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedBom(null);
            }}
            bom={selectedBom}
            onUpdate={handleEditBom}
          />

          <DeleteBom 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedBom(null);
            }}
            bom={selectedBom}
            onDelete={handleDeleteBom}
          />
        </>
      )}

      {/* Where Used Modal */}
      <WhereUsedModal
        open={openWhereUsedModal}
        onClose={() => {
          setOpenWhereUsedModal(false);
          setWhereUsedData(null);
        }}
        component={whereUsedData?.component}
        usedInBoms={whereUsedData?.used_in_boms || []}
        loading={whereUsedLoading}
      />

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

export default BomMaster;