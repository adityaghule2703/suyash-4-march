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
  alpha,
  Alert,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Sort as SortIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

import AddCompanies from './AddCompanies';
import EditCompanies from './EditCompanies';
import ViewCompanies from './ViewCompanies';
import DeleteCompanies from './DeleteCompanies';

const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc'; 
const HOVER_COLOR = '#f1f5f9'; 
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a'; 

const ActionMenu = ({ company, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: '#64748b',
            '&:hover': {
              bgcolor: alpha(PRIMARY_BLUE, 0.1)
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
            border: '1px solid #e2e8f0'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            onView(company);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>View Details</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            onEdit(company);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>Edit</Typography>
          </ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem 
          onClick={() => {
            onDelete(company);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color="#EF4444">
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const CompanyMaster = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedCompanyForAction, setSelectedCompanyForAction] = useState(null);
  
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Optional: Refresh data when all modals are closed
  useEffect(() => {
    if (!openAddModal && !openEditModal && !openViewModal && !openDeleteDialog) {
      // You can uncomment this if you want to refresh data when modals close
      // fetchCompanies();
    }
  }, [openAddModal, openEditModal, openViewModal, openDeleteDialog]);

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
  
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = companies.filter(company =>
      company.company_name?.toLowerCase().includes(value) ||
      (company.email && company.email.toLowerCase().includes(value)) ||
      (company.gstin && company.gstin.toLowerCase().includes(value)) ||
      (company.pan && company.pan.toLowerCase().includes(value)) ||
      (company.state && company.state.toLowerCase().includes(value))
    );
    
    setFilteredCompanies(filtered);
    setPage(0);
  };
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredCompanies.map(company => company._id));
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
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleAddCompany = (newCompany) => {
    // Ensure the new company has all required fields and proper structure
    const formattedCompany = {
      ...newCompany,
      // Ensure _id exists (use _id or id from response)
      _id: newCompany._id || newCompany.id,
      // Ensure bank_details exists with proper structure
      bank_details: newCompany.bank_details || {
        bank_name: '',
        account_no: '',
        ifsc: '',
        branch: ''
      },
      // Ensure all required fields have at least empty strings
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

    console.log('Adding formatted company:', formattedCompany);

    // Add to existing companies
    setCompanies(prevCompanies => {
      const updatedCompanies = [...prevCompanies, formattedCompany];
      return updatedCompanies;
    });
    
    // Update filtered companies based on current search term
    if (searchTerm) {
      const matchesSearch = 
        formattedCompany.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedCompany.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedCompany.gstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedCompany.pan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedCompany.state?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (matchesSearch) {
        setFilteredCompanies(prev => [...prev, formattedCompany]);
      } else {
        // If doesn't match search, still add to filtered but it won't show until search is cleared
        setFilteredCompanies(prev => [...prev, formattedCompany]);
      }
    } else {
      setFilteredCompanies(prev => [...prev, formattedCompany]);
    }

    showNotification('Company added successfully!', 'success');
  };
  
  const handleEditCompany = (updatedCompany) => {
    const updatedCompanies = companies.map(company =>
      company._id === updatedCompany._id ? updatedCompany : company
    );
    
    setCompanies(updatedCompanies);
    setFilteredCompanies(updatedCompanies);
    showNotification('Company updated successfully!', 'success');
  };
  
  const handleDeleteCompany = (companyId) => {
    const updatedCompanies = companies.filter(company => company._id !== companyId);
    setCompanies(updatedCompanies);
    setFilteredCompanies(updatedCompanies);
    setSelected(selected.filter(id => id !== companyId));
    showNotification('Company deleted successfully!', 'success');
  };
  
  const handleBulkDelete = () => {
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  const handleActionMenuOpen = (event, company) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedCompanyForAction(company);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedCompanyForAction(null);
  };
  
  const openEditCompanyModal = (company) => {
    setSelectedCompany(company);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openViewCompanyModal = (company) => {
    setSelectedCompany(company);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteCompanyDialog = (company) => {
    setSelectedCompany(company);
    setOpenDeleteDialog(true);
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
  
  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'C';
    
    const words = companyName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return companyName.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (companyName) => {
    if (!companyName) return PRIMARY_BLUE;
    
    const colors = [
      '#164e63',
      '#0e7490',
      '#0891b2',
      '#0c4a6e',
      '#1d4ed8',
      '#7c3aed',
      '#7e22ce',
      '#be185d',
      '#c2410c',
      '#059669'
    ];
    
    const charCode = companyName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  const paginatedCompanies = filteredCompanies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          fontWeight="600" 
          sx={{ 
            color: TEXT_COLOR_MAIN,
            background: HEADER_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}
        >
          Company Master
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          Manage and organize company information and details
        </Typography>
      </Box>

      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by company name, GSTIN, PAN, or state..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ 
                width: { xs: '100%', sm: 360 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': {
                    borderColor: PRIMARY_BLUE,
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
                sx: { 
                  height: 40,
                  bgcolor: '#f8fafc',
                  '& input': {
                    padding: '8px 12px',
                    fontSize: '0.875rem'
                  }
                }
              }}
              disabled={loading}
            />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                sx={{ 
                  height: 40,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddModal(true)}
              sx={{
                height: 40,
                borderRadius: 1.5,
                background: HEADER_GRADIENT,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  opacity: 0.9,
                  background: HEADER_GRADIENT,
                }
              }}
              disabled={loading}
            >
              Add Company
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: HEADER_GRADIENT,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: TEXT_COLOR_HEADER
                }
              }}>
                <TableCell padding="checkbox" sx={{ width: 60 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredCompanies.length}
                    checked={filteredCompanies.length > 0 && selected.length === filteredCompanies.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: TEXT_COLOR_HEADER,
                      '&.Mui-checked': {
                        color: TEXT_COLOR_HEADER,
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: TEXT_COLOR_HEADER,
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 20
                      }
                    }}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  py: 2,
                  color: TEXT_COLOR_HEADER
                }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Company
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  py: 2,
                  color: TEXT_COLOR_HEADER
                }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Tax Information
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  py: 2,
                  color: TEXT_COLOR_HEADER
                }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Contact
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  py: 2,
                  color: TEXT_COLOR_HEADER
                }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Bank Details
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  py: 2,
                  width: 100,
                  color: TEXT_COLOR_HEADER
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                      Loading companies...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" color="#64748B" fontWeight={500}>
                        {searchTerm ? 'No companies found' : 'No companies available'}
                      </Typography>
                      <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first company to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCompanies.map((company, index) => {
                  const isSelected = selected.includes(company._id);
                  const isOddRow = index % 2 === 0;
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedCompanyForAction?._id === company._id;
                  const avatarColor = getAvatarColor(company.company_name);

                  return (
                    <TableRow
                      key={company._id || index}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
                        '&:hover': {
                          bgcolor: HOVER_COLOR
                        },
                        '&.Mui-selected': {
                          bgcolor: alpha(PRIMARY_BLUE, 0.08),
                          '&:hover': {
                            bgcolor: alpha(PRIMARY_BLUE, 0.12)
                          }
                        }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ width: 60 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(company._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            '&.Mui-checked': {
                              color: PRIMARY_BLUE,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: avatarColor,
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}
                          >
                            {getCompanyInitials(company.company_name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600} color={TEXT_COLOR_MAIN}>
                              {company.company_name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="caption" color="#64748B">
                                {company.state} (Code: {company.state_code})
                              </Typography>
                            </Stack>
                            <Typography 
                              variant="caption" 
                              color="#64748B"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                maxWidth: 200
                              }}
                            >
                              {company.address || 'No address'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                          GSTIN: {company.gstin || '-'}
                        </Typography>
                        <Typography variant="caption" color="#64748B" display="block">
                          PAN: {company.pan || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                          {company.email || 'No email'}
                        </Typography>
                        <Typography variant="caption" color="#64748B">
                          {company.phone || 'No phone'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ maxWidth: 200 }}>
                          <Typography 
                            variant="body2" 
                            color={TEXT_COLOR_MAIN}
                            sx={{ 
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {company.bank_details?.bank_name || '-'}
                            {company.bank_details?.account_no && ` • ...${company.bank_details.account_no.slice(-4)}`}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="#64748B"
                            sx={{ 
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {company.bank_details?.ifsc && `IFSC: ${company.bank_details.ifsc}`}
                            {company.bank_details?.branch && ` • ${company.bank_details.branch}`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 100 }}>
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

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCompanies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: '#64748B'
            },
            '& .MuiTablePagination-actions button': {
              color: PRIMARY_BLUE,
            }
          }}
        />
      </Paper>

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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyMaster;