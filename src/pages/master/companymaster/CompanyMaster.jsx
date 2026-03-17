import React, { useState, useEffect } from 'react';
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
  Business as BusinessIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Import modal components
import AddCompanies from './AddCompanies';
import EditCompanies from './EditCompanies';
import ViewCompanies from './ViewCompanies';
import DeleteCompanies from './DeleteCompanies';

// Color constants - Single color #063C3F throughout (matching Users component)
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
const ActionMenu = ({ company, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
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
            onView(company);
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
            onEdit(company);
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
            onDelete(company);
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

const CompanyMaster = () => {
  // State for data
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedCompanyForAction, setSelectedCompanyForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected company
  const [selectedCompany, setSelectedCompany] = useState(null);
  
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

  // Fetch companies from API
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/company`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Ensure each company has properly formatted bank_details
        const formattedData = (response.data.data || []).map(company => ({
          ...company,
          bank_details: company.bank_details || {
            bank_name: '',
            account_no: '',
            ifsc: '',
            branch: ''
          }
        }));
        
        setCompanies(formattedData);
        setFilteredCompanies(formattedData);
      } else {
        showNotification('Failed to load companies', 'error');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      showNotification('Failed to load companies. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchCompanies();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle search (client-side filtering since no server pagination)
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
      return;
    }
    
    const value = searchTerm.toLowerCase();
    const filtered = companies.filter(company =>
      company.company_name?.toLowerCase().includes(value) ||
      (company.email && company.email.toLowerCase().includes(value)) ||
      (company.gstin && company.gstin.toLowerCase().includes(value)) ||
      (company.pan && company.pan.toLowerCase().includes(value)) ||
      (company.state && company.state.toLowerCase().includes(value))
    );
    
    setFilteredCompanies(filtered);
  };

  // Apply search when searchTerm changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, companies]);
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredCompanies.map(company => company._id));
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]); // Clear selection when changing rows per page
  };
  
  // Handle add company
  const handleAddCompany = (newCompany) => {
    // Ensure the new company has all required fields and proper structure
    const formattedCompany = {
      ...newCompany,
      _id: newCompany._id || newCompany.id || Date.now().toString(),
      bank_details: newCompany.bank_details || {
        bank_name: '',
        account_no: '',
        ifsc: '',
        branch: ''
      },
      company_id: newCompany.company_id || '',
      company_name: newCompany.company_name || '',
      address: newCompany.address || '',
      gstin: newCompany.gstin || '',
      pan: newCompany.pan || '',
      state: newCompany.state || '',
      state_code: newCompany.state_code || '',
      phone: newCompany.phone || '',
      email: newCompany.email || '',
      is_active: newCompany.is_active !== undefined ? newCompany.is_active : true
    };

    setCompanies(prev => [...prev, formattedCompany]);
    showNotification('Company added successfully!', 'success');
  };
  
  // Handle edit company
  const handleEditCompany = (updatedCompany) => {
    const updatedCompanies = companies.map(company =>
      company._id === updatedCompany._id ? updatedCompany : company
    );
    
    setCompanies(updatedCompanies);
    showNotification('Company updated successfully!', 'success');
  };
  
  // Handle delete company
  const handleDeleteCompany = (companyId) => {
    const updatedCompanies = companies.filter(company => company._id !== companyId);
    setCompanies(updatedCompanies);
    setSelected(selected.filter(id => id !== companyId));
    showNotification('Company deleted successfully!', 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, company) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedCompanyForAction(company);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedCompanyForAction(null);
  };
  
  // Open edit modal
  const openEditCompanyModal = (company) => {
    setSelectedCompany(company);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewCompanyModal = (company) => {
    setSelectedCompany(company);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteCompanyDialog = (company) => {
    setSelectedCompany(company);
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
      day: 'numeric'
    });
  };
  
  // Get company initials for avatar
  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'C';
    
    const words = companyName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return companyName.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on company name
  const getAvatarColor = (companyName) => {
    if (!companyName) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = companyName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Paginated companies
  const paginatedCompanies = filteredCompanies.slice(
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
          Company Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize company information and details
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
              placeholder="Search by company name, GSTIN, PAN, or state..."
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
              Add Company
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Companies Table */}
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
                    indeterminate={selected.length > 0 && selected.length < filteredCompanies.length}
                    checked={filteredCompanies.length > 0 && selected.length === filteredCompanies.length}
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
                    disabled={loading || filteredCompanies.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Company
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Tax Information
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Contact
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Bank Details
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
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading companies...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No companies found' : 'No companies available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first company to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCompanies.map((company, index) => {
                  const isSelected = selected.includes(company._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedCompanyForAction?._id === company._id;
                  const avatarColor = getAvatarColor(company.company_name);

                  return (
                    <TableRow
                      key={company._id || index}
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
                          onChange={() => handleSelect(company._id)}
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
                            {getCompanyInitials(company.company_name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {company.company_name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {company.state} {company.state_code && `(Code: ${company.state_code})`}
                            </Typography>
                            {/* <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {company.address || 'No address'}
                            </Typography> */}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          GSTIN: {company.gstin || '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          PAN: {company.pan || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {company.email || 'No email'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {company.phone || 'No phone'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {company.bank_details?.bank_name || '-'}
                            {company.bank_details?.account_no && ` • ...${company.bank_details.account_no.slice(-4)}`}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {company.bank_details?.ifsc && `IFSC: ${company.bank_details.ifsc}`}
                            {company.bank_details?.branch && ` • ${company.bank_details.branch}`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          company={company}
                          onView={openViewCompanyModal}
                          onEdit={openEditCompanyModal}
                          onDelete={openDeleteCompanyDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, company)}
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
          count={filteredCompanies.length}
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
      <AddCompanies 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddCompany}
      />

      {selectedCompany && (
        <>
          <EditCompanies 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedCompany(null);
            }}
            company={selectedCompany}
            onUpdate={handleEditCompany}
          />

          <ViewCompanies 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedCompany(null);
            }}
            company={selectedCompany}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteCompanies 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedCompany(null);
            }}
            company={selectedCompany}
            onDelete={handleDeleteCompany}
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

export default CompanyMaster;