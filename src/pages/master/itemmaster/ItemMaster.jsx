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
  Category as CategoryIcon,
  Straighten as StraightenIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Import modal components
import AddItem from './AddItem';
import EditItem from './EditItem';
import ViewItem from './ViewItem';
import DeleteItem from './DeleteItem';

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

const ItemMaster = () => {
  // State for data
  const [items, setItems] = useState([]);
  const [materials, setMaterials] = useState([]);
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
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected item
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch items from API with pagination
  const fetchItems = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/items?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const { data: itemsData, pagination } = response.data;
        setItems(itemsData || []);
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
      } else {
        showNotification('Failed to load items', 'error');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      showNotification('Failed to load items. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  // Fetch materials
  const fetchMaterials = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/materials`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMaterials(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  }, []);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Fetch materials on mount
  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Handle refresh
  const handleRefresh = () => {
    fetchItems();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(items.map(item => item._id));
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
  
  // Handle add item
  const handleAddItem = () => {
    fetchItems();
    showNotification('Item added successfully!', 'success');
  };
  
  // Handle edit item
  const handleEditItem = () => {
    fetchItems();
    showNotification('Item updated successfully!', 'success');
  };
  
  // Handle delete item
  const handleDeleteItem = () => {
    fetchItems();
    setSelected([]);
    showNotification('Item deleted successfully!', 'success');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, item) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedItemForAction(item);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedItemForAction(null);
  };

  // Open edit modal
  const openEditItemModal = (item) => {
    setSelectedItem(item);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewItemModal = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteItemDialog = (item) => {
    setSelectedItem(item);
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
  
  // Get status styles
  const getStatusStyles = (isActive) => {
    return isActive ? {
      bg: COLORS.chips.active,
      text: COLORS.primaryDark,
      border: '#86efac'
    } : {
      bg: COLORS.chips.inactive,
      text: COLORS.text.secondary,
      border: COLORS.border
    };
  };
  
  // Get status text
  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };
  
  // Get avatar initials
  const getAvatarInitials = (partNo) => {
    if (!partNo) return 'IT';
    const words = partNo.split('-');
    if (words.length > 1) {
      return words[0].substring(0, 1) + words[1].substring(0, 1);
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
          Item Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize part items, drawings, and specifications
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
              placeholder="Search by part no, description, or drawing..."
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
            {/* <Tooltip title="Refresh data">
              <IconButton 
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.primary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}10`
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}
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
              Add Item
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Items Table */}
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
                    indeterminate={selected.length > 0 && selected.length < items.length}
                    checked={items.length > 0 && selected.length === items.length}
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
                    disabled={loading || items.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Part No
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Description
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Material
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Drawing No
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Revision
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  HSN Code
                </TableCell>
                {/* <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Status
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
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading items...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No items found' : 'No items available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first item to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const isSelected = selected.includes(item._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedItemForAction?._id === item._id;
                  const avatarColor = getAvatarColor(item.part_no);
                  const statusStyles = getStatusStyles(item.is_active);

                  return (
                    <TableRow
                      key={item._id}
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
                          onChange={() => handleSelect(item._id)}
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
                            {getAvatarInitials(item.part_no)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {item.part_no}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {item._id.slice(-6)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={item.part_description || ''}>
                          <Typography 
                            sx={{ 
                              fontSize: '0.75rem',
                              color: COLORS.text.primary,
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.part_description || 'N/A'}
                          </Typography>
                        </Tooltip>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Unit: {item.unit || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {item.material || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Grade: {item.rm_grade || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {item.drawing_no || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {item.strip_size ? `${item.strip_size}mm` : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {item.revision_no || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {item.pitch ? `Pitch: ${item.pitch}` : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {item.hsn_code || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {item.no_of_cavity ? `${item.no_of_cavity} cavity` : ''}
                        </Typography>
                      </TableCell>
                      {/* <TableCell>
                        <Chip
                          label={getStatusText(item.is_active)}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 20,
                            bgcolor: statusStyles.bg,
                            color: statusStyles.text,
                            border: `1px solid ${statusStyles.border}`,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell> */}
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={item}
                          onView={openViewItemModal}
                          onEdit={openEditItemModal}
                          onDelete={openDeleteItemDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, item)}
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
      <AddItem 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddItem}
        materials={materials}
      />

      {selectedItem && (
        <>
          <EditItem 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onUpdate={handleEditItem}
            materials={materials}
          />

          <ViewItem 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteItem 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onDelete={handleDeleteItem}
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

export default ItemMaster;