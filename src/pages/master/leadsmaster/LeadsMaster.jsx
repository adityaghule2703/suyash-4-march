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
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  Update as UpdateIcon,
  Message as MessageIcon,
  Image as ImageIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddLead from './AddLead';
import EditLead from './EditLead';
import ViewLead from './ViewLead';
import DeleteLead from './DeleteLead';
import StatusUpdatePopup from './StatusUpdatePopup';
import ConvertLeadPopup from './ConvertLeadPopup';
import FollowupPopup from './FollowupPopup';
import DrawingsPopup from './DrawingsPopup';
import FeasibilityPopup from './FeasibilityPopup';
import FeasibilityCheckPopup from './FeasibilityCheckPopup';
import { COLORS, STATUS_COLORS, PRIORITY_COLORS, STATUS_TRANSITIONS } from './constants';

// Action Menu Component with all options
const ActionMenu = ({ item, onView, onEdit, onDelete, onStatusUpdate, onConvert, onFollowup, onDrawings, onFeasibility, onFeasibilityCheck, anchorEl, onClose, onOpen }) => {
  const currentStatus = item?.status || 'New';
  const hasAvailableTransitions = STATUS_TRANSITIONS[currentStatus]?.length > 0;
  const isWon = currentStatus === 'Won';

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
            onView(item);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            onEdit(item);
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
        
        {/* Feasibility Check Button - Show for all statuses */}
        <MenuItem 
          onClick={() => {
            onFeasibilityCheck(item);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
            <AssessmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
              Feasibility Check
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {/* Feasibility Button - Show for all statuses */}
        <MenuItem 
          onClick={() => {
            onFeasibility(item);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: '#06B6D4', minWidth: 36 }}>
            <ScienceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#06B6D4', fontSize: '0.75rem' }}>
              Feasibility
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {/* Drawings Button - Show for all statuses */}
        <MenuItem 
          onClick={() => {
            onDrawings(item);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
              Drawings
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {/* Follow-up Button - Show for all statuses */}
        <MenuItem 
          onClick={() => {
            onFollowup(item);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
            <MessageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
              Add Follow-up
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {hasAvailableTransitions && (
          <MenuItem 
            onClick={() => {
              onStatusUpdate(item);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <UpdateIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Update Status
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {isWon && (
          <MenuItem 
            onClick={() => {
              onConvert(item);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <BusinessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Convert to Customer
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        <MenuItem 
          onClick={() => {
            onDelete(item);
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

const LeadsMaster = () => {
  // State for data
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatusPopup, setOpenStatusPopup] = useState(false);
  const [openConvertPopup, setOpenConvertPopup] = useState(false);
  const [openFollowupPopup, setOpenFollowupPopup] = useState(false);
  const [openDrawingsPopup, setOpenDrawingsPopup] = useState(false);
  const [openFeasibilityPopup, setOpenFeasibilityPopup] = useState(false);
  const [openFeasibilityCheckPopup, setOpenFeasibilityCheckPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
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

  // Fetch leads from API
  const fetchLeads = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/leads?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setLeads(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load leads', 'error');
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      showNotification('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleRefresh = () => {
    fetchLeads();
    showNotification('Data refreshed', 'success');
  };
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(leads.map(lead => lead._id));
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
  
  const handleAddLead = () => {
    fetchLeads();
    showNotification('Lead added successfully!', 'success');
  };
  
  const handleEditLead = () => {
    fetchLeads();
    showNotification('Lead updated successfully!', 'success');
  };
  
  const handleDeleteLead = () => {
    fetchLeads();
    setSelected([]);
    showNotification('Lead deleted successfully!', 'success');
  };
  
  const handleStatusUpdate = () => {
    fetchLeads();
    showNotification('Status updated successfully!', 'success');
  };
  
  const handleConvertLead = () => {
    fetchLeads();
    showNotification('Lead converted to customer successfully!', 'success');
  };
  
  const handleFollowup = () => {
    fetchLeads();
    showNotification('Follow-up added successfully!', 'success');
  };
  
  const handleDrawingUpload = () => {
    fetchLeads();
    showNotification('Drawing uploaded successfully!', 'success');
  };
  
  const handleFeasibilityUpdate = () => {
    fetchLeads();
    showNotification('Feasibility updated successfully!', 'success');
  };
  
  const handleActionMenuOpen = (event, lead) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedLeadForAction(lead);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedLeadForAction(null);
  };

  const openEditLeadModal = (lead) => {
    setSelectedLead(lead);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openViewLeadModal = (lead) => {
    setSelectedLead(lead);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteLeadDialog = (lead) => {
    setSelectedLead(lead);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  const openStatusUpdatePopup = (lead) => {
    setSelectedLead(lead);
    setOpenStatusPopup(true);
    handleActionMenuClose();
  };
  
  const openConvertPopupModal = (lead) => {
    setSelectedLead(lead);
    setOpenConvertPopup(true);
    handleActionMenuClose();
  };
  
  const openFollowupPopupModal = (lead) => {
    setSelectedLead(lead);
    setOpenFollowupPopup(true);
    handleActionMenuClose();
  };
  
  const openDrawingsPopupModal = (lead) => {
    setSelectedLead(lead);
    setOpenDrawingsPopup(true);
    handleActionMenuClose();
  };
  
  const openFeasibilityPopupModal = (lead) => {
    setSelectedLead(lead);
    setOpenFeasibilityPopup(true);
    handleActionMenuClose();
  };
  
  const openFeasibilityCheckPopupModal = (lead) => {
    setSelectedLead(lead);
    setOpenFeasibilityCheckPopup(true);
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
  
  const getLeadInitials = (lead) => {
    if (!lead.company_name) return 'LD';
    return lead.company_name.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (lead) => {
    if (!lead.company_name) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = lead.company_name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
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
          Leads Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage leads, track status, and follow up with potential customers
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
              placeholder="Search by Lead ID, Company, Contact, or Subject..."
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
              Add Lead
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Leads Table */}
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
                    indeterminate={selected.length > 0 && selected.length < leads.length}
                    checked={leads.length > 0 && selected.length === leads.length}
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
                    disabled={loading || leads.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Lead ID / Company
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Subject
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Priority
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Est. Value
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Created Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
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
                      Loading leads...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No leads found' : 'No leads available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first lead to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => {
                  const isSelected = selected.includes(lead._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedLeadForAction?._id === lead._id;
                  const avatarColor = getAvatarColor(lead);
                  const statusColors = STATUS_COLORS[lead.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
                  const priorityColors = PRIORITY_COLORS[lead.priority] || { bg: '#F1F5F9', color: '#475569' };

                  return (
                    <TableRow
                      key={lead._id}
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
                          onChange={() => handleSelect(lead._id)}
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
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getLeadInitials(lead)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {lead.company_name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {lead.lead_id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {lead.subject}
                        </Typography>
                        {lead.lead_source && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {lead.lead_source} {lead.lead_source_detail && `(${lead.lead_source_detail})`}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {lead.contact_name}
                        </Typography>
                        {lead.contact_mobile && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {lead.contact_mobile}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status || 'New'}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.border}`
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.priority || 'Medium'}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: priorityColors.bg,
                            color: priorityColors.color
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {lead.estimated_value ? `₹${lead.estimated_value.toLocaleString()}` : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {formatDate(lead.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={lead}
                          onView={openViewLeadModal}
                          onEdit={openEditLeadModal}
                          onDelete={openDeleteLeadDialog}
                          onStatusUpdate={openStatusUpdatePopup}
                          onConvert={openConvertPopupModal}
                          onFollowup={openFollowupPopupModal}
                          onDrawings={openDrawingsPopupModal}
                          onFeasibility={openFeasibilityPopupModal}
                          onFeasibilityCheck={openFeasibilityCheckPopupModal}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, lead)}
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
      <AddLead 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddLead}
      />

      {selectedLead && (
        <>
          <EditLead 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onUpdate={handleEditLead}
          />

          <ViewLead 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteLead 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onDelete={handleDeleteLead}
          />

          <StatusUpdatePopup
            open={openStatusPopup}
            onClose={() => {
              setOpenStatusPopup(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onStatusUpdate={handleStatusUpdate}
          />

          <ConvertLeadPopup
            open={openConvertPopup}
            onClose={() => {
              setOpenConvertPopup(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onConvert={handleConvertLead}
          />

          <FollowupPopup
            open={openFollowupPopup}
            onClose={() => {
              setOpenFollowupPopup(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onFollowup={handleFollowup}
          />

          <DrawingsPopup
            open={openDrawingsPopup}
            onClose={() => {
              setOpenDrawingsPopup(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onDrawingUpload={handleDrawingUpload}
          />

          <FeasibilityPopup
            open={openFeasibilityPopup}
            onClose={() => {
              setOpenFeasibilityPopup(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onFeasibilityUpdate={handleFeasibilityUpdate}
          />

          <FeasibilityCheckPopup
            open={openFeasibilityCheckPopup}
            onClose={() => {
              setOpenFeasibilityCheckPopup(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
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

export default LeadsMaster;