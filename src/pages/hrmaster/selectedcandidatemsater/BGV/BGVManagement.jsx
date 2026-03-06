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
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  Assignment as AssignmentIcon,
  Approval as ApprovalIcon
} from '@mui/icons-material';
import axios from 'axios';

// Import BGV components
import InitiateBGV from './InitiateBGV';
import ApproveBGV from './ApproveBGV';
import BASE_URL from '../../../../config/Config';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc';
const HOVER_COLOR = '#f1f5f9';
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a';

// Status color mapping
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return { bg: '#f1f5f9', color: '#475569', label: 'Pending', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> };
    case 'in_progress':
    case 'in progress':
      return { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: <RefreshIcon sx={{ fontSize: 16 }} /> };
    case 'completed':
    case 'cleared':
      return { bg: '#d1fae5', color: '#065f46', label: 'Completed', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
    case 'failed':
    case 'discrepancy':
      return { bg: '#fee2e2', color: '#991b1b', label: 'Failed', icon: <ErrorIcon sx={{ fontSize: 16 }} /> };
    case 'under_review':
      return { bg: '#dbeafe', color: '#1e40af', label: 'Under Review', icon: <InfoIcon sx={{ fontSize: 16 }} /> };
    default:
      return { bg: '#f1f5f9', color: '#475569', label: status || 'Unknown', icon: <InfoIcon sx={{ fontSize: 16 }} /> };
  }
};

const BGVManagement = () => {
  // State for data
  const [bgvList, setBgvList] = useState([]);
  const [filteredBgvList, setFilteredBgvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Modal states
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  
  // Selected BGV
  const [selectedBgv, setSelectedBgv] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch BGV list from API
  useEffect(() => {
    fetchBGVList();
  }, [page, rowsPerPage]);

  const fetchBGVList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/bgv?page=${page + 1}&limit=${rowsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setBgvList(response.data.data || []);
        setFilteredBgvList(response.data.data || []);
        setTotalCount(response.data.total || 0);
      } else {
        showNotification('Failed to load BGV records', 'error');
      }
    } catch (err) {
      console.error('Error fetching BGV list:', err);
      showNotification('Failed to load BGV records. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = bgvList.filter(bgv =>
      bgv.bgvId?.toLowerCase().includes(value) ||
      bgv.candidate?.fullName?.toLowerCase().includes(value) ||
      bgv.candidate?.email?.toLowerCase().includes(value) ||
      bgv.offer?.offerId?.toLowerCase().includes(value)
    );
    
    setFilteredBgvList(filtered);
    setPage(0);
  };
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredBgvList.map(bgv => bgv._id));
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
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchBGVList();
    showNotification('Data refreshed successfully', 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    showNotification(`Bulk delete for ${selected.length} items - API coming soon`, 'warning');
  };

  // Modal open handlers
  const openInitiateModal = () => {
    setShowInitiateModal(true);
  };
  
  const openApproveModal = (bgv) => {
    setSelectedBgv(bgv);
    setShowApproveModal(true);
  };
  
  // Callback handlers for modals
  const handleBGVInitiated = (newBGV) => {
    fetchBGVList();
    showNotification('Background verification initiated successfully!', 'success');
  };
  
  const handleBGVApproved = (approvedBGV) => {
    fetchBGVList();
    showNotification('BGV decision submitted successfully!', 'success');
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Paginated BGV list
  const paginatedBgvList = searchTerm 
    ? filteredBgvList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredBgvList;

  // Check if any BGV are selected
  const hasSelected = selected.length > 0;

  // Check if status requires Approve/Reject action
  const needsApproval = (status) => {
    const statusLower = status?.toLowerCase();
    return statusLower === 'pending' || statusLower === 'in_progress';
  };

  return (
    <Box sx={{ p: 3, mt: -8}}>
      {/* Header */}
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
          Background Verification Management
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          Manage and track candidate background verification processes
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          {/* Search */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by BGV ID, Candidate, Offer..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ 
                width: { xs: '100%', sm: 400 },
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
            {/* <Tooltip title="Refresh">
              <IconButton 
                onClick={handleRefresh}
                sx={{ 
                  color: '#64748B',
                  '&:hover': {
                    bgcolor: alpha(PRIMARY_BLUE, 0.1),
                    color: PRIMARY_BLUE
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip> */}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} alignItems="center">
            {hasSelected && (
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
              onClick={openInitiateModal}
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
              Initiate BGV
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* BGV Table */}
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
                    indeterminate={selected.length > 0 && selected.length < filteredBgvList.length}
                    checked={filteredBgvList.length > 0 && selected.length === filteredBgvList.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: TEXT_COLOR_HEADER,
                      '&.Mui-checked': {
                        color: TEXT_COLOR_HEADER,
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: TEXT_COLOR_HEADER,
                      }
                    }}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    BGV ID
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Candidate
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Offer
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Status
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Initiated
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, width: 100 }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="#64748B" sx={{ mt: 2 }}>
                      Loading BGV records...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedBgvList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <SecurityIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                      <Typography variant="body1" color="#64748B" fontWeight={500}>
                        {searchTerm ? 'No BGV records found' : 'No background verifications yet'}
                      </Typography>
                      <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Click "Initiate BGV" to start a new verification'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBgvList.map((bgv, index) => {
                  const isSelected = selected.includes(bgv._id);
                  const isOddRow = index % 2 === 0;
                  const statusStyle = getStatusColor(bgv.status);
                  const showApproveButton = needsApproval(bgv.status);

                  return (
                    <TableRow
                      key={bgv._id}
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
                          onChange={() => handleSelect(bgv._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            '&.Mui-checked': {
                              color: PRIMARY_BLUE,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color={TEXT_COLOR_MAIN}>
                          {bgv.bgvId || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: PRIMARY_BLUE,
                              fontSize: '0.875rem'
                            }}
                          >
                            {bgv.candidate?.fullName?.charAt(0) || '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {bgv.candidate?.fullName || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="#64748B">
                              {bgv.candidate?.email || ''}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {bgv.offer?.offerId || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="#64748B">
                          {bgv.offer?.status || ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusStyle.icon}
                          label={statusStyle.label}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 500,
                            minWidth: 90,
                            '& .MuiChip-icon': {
                              color: statusStyle.color
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(bgv.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 100 }}>
                        {showApproveButton ? (
                          <Tooltip title="Approve/Reject BGV">
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<ApprovalIcon />}
                              onClick={() => openApproveModal(bgv)}
                              sx={{
                                backgroundColor: '#10B981',
                                color: 'white',
                                fontSize: '0.75rem',
                                py: 0.5,
                                px: 1,
                                minWidth: 80,
                                '&:hover': {
                                  backgroundColor: '#059669'
                                }
                              }}
                            >
                              Review
                            </Button>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="#94A3B8" sx={{ fontStyle: 'italic' }}>
                            No action
                          </Typography>
                        )}
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
          count={searchTerm ? filteredBgvList.length : totalCount}
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

      {/* Modal Components */}
      <InitiateBGV 
        open={showInitiateModal}
        onClose={() => {
          setShowInitiateModal(false);
          setSelectedBgv(null);
        }}
        onSubmit={handleBGVInitiated}
      />

      <ApproveBGV 
        open={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedBgv(null);
        }}
        onSubmit={handleBGVApproved}
        bgvData={selectedBgv}
        bgvId={selectedBgv?._id}
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BGVManagement;