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
  Refresh as RefreshIcon,
  Height as HeightIcon,
  WidthWide as WidthIcon,
  Straighten as StraightenIcon,
  Scale as ScaleIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Import modal components
import AddDimensions from './AddDimensions';
import EditDimensions from './EditDimensions';
import ViewDimensions from './ViewDimensions';
import DeleteDimensions from './DeleteDimensions';

// Color constants - Single color #063C3F throughout
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
  }
};

// Action Menu Component
const ActionMenu = ({ item, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
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

const DimensionMaster = () => {
  // State for data
  const [dimensions, setDimensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedDimensionForAction, setSelectedDimensionForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected dimension
  const [selectedDimension, setSelectedDimension] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalWeight: 0,
    avgWeight: 0,
    minWeight: 0,
    maxWeight: 0,
    count: 0
  });

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch dimensions from API with pagination
  const fetchDimensions = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await axios.get(`${BASE_URL}/api/dimension-weights?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const { data: dimensionsData, pagination, statistics } = response.data;
        setDimensions(dimensionsData || []);
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
        setStatistics(statistics || {
          totalWeight: 0,
          avgWeight: 0,
          minWeight: 0,
          maxWeight: 0,
          count: 0
        });
      } else {
        showNotification('Failed to load dimension weights', 'error');
      }
    } catch (err) {
      console.error('Error fetching dimension weights:', err);
      showNotification('Failed to load dimension weights. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  // Fetch dimensions when dependencies change
  useEffect(() => {
    fetchDimensions();
  }, [fetchDimensions]);

  // Handle refresh
  const handleRefresh = () => {
    fetchDimensions();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(dimensions.map(dimension => dimension._id));
    } else {
      setSelected([]);
    }
  };
  
  // Handle single selection
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
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]); // Clear selection when changing page
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setSelected([]); // Clear selection when changing rows per page
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Handle add dimension
  const handleAddDimension = () => {
    fetchDimensions();
    showNotification('Dimension weight added successfully!', 'success');
  };
  
  // Handle edit dimension
  const handleEditDimension = () => {
    fetchDimensions();
    showNotification('Dimension weight updated successfully!', 'success');
  };
  
  // Handle delete dimension
  const handleDeleteDimension = () => {
    fetchDimensions();
    setSelected([]);
    showNotification('Dimension weight deleted successfully!', 'success');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, dimension) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDimensionForAction(dimension);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedDimensionForAction(null);
  };

  // Open edit modal
  const openEditDimensionModal = (dimension) => {
    setSelectedDimension(dimension);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewDimensionModal = (dimension) => {
    setSelectedDimension(dimension);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteDimensionDialog = (dimension) => {
    setSelectedDimension(dimension);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Format date
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
  
  // Get part initials for avatar
  const getPartInitials = (partNo) => {
    if (!partNo) return 'PN';
    const words = partNo.split('-');
    if (words.length > 1) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return partNo.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on part number
  const getAvatarColor = (partNo) => {
    if (!partNo) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = partNo.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Format number with 3 decimal places
  const formatWeight = (weight) => {
    if (weight === undefined || weight === null) return '0.000';
    return weight.toFixed(3);
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
          Dimension Weight Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and calculate material weights based on dimensions and density
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
              placeholder="Search by Part No, dimensions, or weight..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 320 },
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
              Add Dimension Weight
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Dimensions Table */}
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
                    indeterminate={selected.length > 0 && selected.length < dimensions.length}
                    checked={dimensions.length > 0 && selected.length === dimensions.length}
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
                    disabled={loading || dimensions.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Part No.
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Dimensions
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }} align="center">
                  Thickness (mm)
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }} align="center">
                  Width (mm)
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }} align="center">
                  Length (mm)
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }} align="center">
                  Density (g/cm³)
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }} align="center">
                  Volume (mm³)
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }} align="center">
                  Weight (kg)
                </TableCell>
                {/* <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }} align="center">
                  Created
                </TableCell> */}
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
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading dimension weights...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : dimensions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No dimension weights found' : 'No dimension weights available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first dimension weight to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                dimensions.map((dimension) => {
                  const isSelected = selected.includes(dimension._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedDimensionForAction?._id === dimension._id;
                  const avatarColor = getAvatarColor(dimension.PartNo);

                  return (
                    <TableRow
                      key={dimension._id}
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
                          onChange={() => handleSelect(dimension._id)}
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
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {getPartInitials(dimension.PartNo)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {dimension.PartNo}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {dimension._id.slice(-6)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, fontFamily: 'monospace' }}>
                          {dimension.DimensionsFormatted || `T: ${dimension.Thickness}mm × W: ${dimension.Width}mm × L: ${dimension.Length}mm`}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                          <HeightIcon sx={{ fontSize: '0.9rem', color: '#4F46E5' }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#4F46E5' }}>
                            {dimension.Thickness}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                          <WidthIcon sx={{ fontSize: '0.9rem', color: '#10B981' }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>
                            {dimension.Width}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                          <StraightenIcon sx={{ fontSize: '0.9rem', color: '#F59E0B' }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
                            {dimension.Length}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                          <ScaleIcon sx={{ fontSize: '0.9rem', color: '#EF4444' }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
                            {dimension.Density}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {dimension.VolumeMM3?.toLocaleString() || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={dimension.WeightFormatted || `${formatWeight(dimension.WeightInKG)} kg`}
                          size="small"
                          sx={{
                            bgcolor: '#f0fdf4',
                            color: '#059669',
                            border: '1px solid #86efac',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: 20,
                            minWidth: 60
                          }}
                        />
                      </TableCell>
                      {/* <TableCell align="center">
                        <Tooltip title={formatDate(dimension.createdAt || dimension.CreatedAt)}>
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                            <CalendarIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                              {formatDate(dimension.createdAt || dimension.CreatedAt)}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      </TableCell> */}
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={dimension}
                          onView={openViewDimensionModal}
                          onEdit={openEditDimensionModal}
                          onDelete={openDeleteDimensionDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, dimension)}
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
      <AddDimensions 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddDimension}
      />

      {selectedDimension && (
        <>
          <EditDimensions 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedDimension(null);
            }}
            dimension={selectedDimension}
            onUpdate={handleEditDimension}
          />

          <ViewDimensions 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedDimension(null);
            }}
            dimension={selectedDimension}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteDimensions 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedDimension(null);
            }}
            dimension={selectedDimension}
            onDelete={handleDeleteDimension}
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

export default DimensionMaster;