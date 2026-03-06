import React, { useState, useEffect } from "react";
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
  Typography,
  Snackbar,
  TablePagination,
  Stack,
  Alert,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  Checkbox,
  alpha,
  CircularProgress
} from "@mui/material";

import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Sort as SortIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../../config/Config";

/* COMPONENTS */
import GenerateAppointmentLetter from "./GenerateAppointmentLetter";
import SendAppointmentLetter from "./SendAppointmentLetter";
import AcceptAppointmentLetter from "./Accept";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
const PRIMARY_BLUE = "#00B4D8";
const TEXT_COLOR_HEADER = '#FFFFFF';
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc';
const HOVER_COLOR = '#f1f5f9';

// Status color mapping
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'generated':
      return { bg: '#fef3c7', color: '#92400e', label: 'Generated', icon: <DescriptionIcon sx={{ fontSize: 16 }} /> };
    case 'sent':
      return { bg: '#e3f2fd', color: '#1976d2', label: 'Sent', icon: <SendIcon sx={{ fontSize: 16 }} /> };
    case 'accepted':
      return { bg: '#d1fae5', color: '#065f46', label: 'Accepted', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
    case 'pending':
      return { bg: '#f1f5f9', color: '#475569', label: 'Pending', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> };
    default:
      return { bg: '#f1f5f9', color: '#475569', label: status || 'Pending', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> };
  }
};

const AppointmentManagement = () => {
  const [dataList, setDataList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState([]);

  const [actionAnchor, setActionAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Modal states
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openSend, setOpenSend] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openView, setOpenView] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  /* SNACKBAR STATE */
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("candidateName");

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch all appointment letters
      const lettersResponse = await axios.get(`${BASE_URL}/api/appointment-letter/all?page=${page + 1}&limit=${rowsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (lettersResponse.data.success) {
        const letters = lettersResponse.data.data || [];
        const total = lettersResponse.data.total || letters.length;
        
        // Transform the data to match the table structure
        const transformedData = letters.map(letter => {
          // Extract candidate details from the nested candidateId object
          const candidateInfo = letter.candidateId || {};
          
          return {
            _id: letter._id,
            documentId: letter.documentId || letter._id,
            firstName: candidateInfo.firstName || '',
            lastName: candidateInfo.lastName || '',
            fullName: candidateInfo.fullName || `${candidateInfo.firstName || ''} ${candidateInfo.lastName || ''}`.trim() || 'N/A',
            email: candidateInfo.email || '',
            phone: candidateInfo.phone || '',
            candidateId: candidateInfo._id || candidateInfo.id || 'N/A',
            letterStatus: letter.status || 'pending',
            appointmentLetter: letter,
            fileUrl: letter.fileUrl,
            generatedAt: letter.generatedAt || letter.createdAt,
            joiningDate: letter.joiningDate || '',
            offerDesignation: letter.offerDesignation || letter.offerId?.offerDetails?.designation || 'N/A',
            sentAt: letter.sentAt,
            acceptedAt: letter.acceptedAt,
            offerId: letter.offerId?._id || letter.offerId
          };
        });

        console.log('Transformed data:', transformedData); // For debugging
        setDataList(transformedData);
        setFilteredList(transformedData);
        setTotalCount(total);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      showNotification("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  /* Snackbar helper */
  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /* SEARCH */
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = dataList.filter((item) =>
      item.firstName?.toLowerCase().includes(value) ||
      item.lastName?.toLowerCase().includes(value) ||
      item.fullName?.toLowerCase().includes(value) ||
      item.email?.toLowerCase().includes(value) ||
      item.candidateId?.toLowerCase().includes(value) ||
      item.letterStatus?.toLowerCase().includes(value) ||
      item.documentId?.toLowerCase().includes(value)
    );

    setFilteredList(filtered);
    setPage(0);
  };

  /* SORT */
  const handleSort = (field) => {
    const sorted = [...filteredList].sort((a, b) => {
      let aValue, bValue;
      
      if (field === 'candidateName') {
        aValue = a.fullName || `${a.firstName || ''} ${a.lastName || ''}`.trim() || '';
        bValue = b.fullName || `${b.firstName || ''} ${b.lastName || ''}`.trim() || '';
      } else if (field === 'status') {
        aValue = a.letterStatus || '';
        bValue = b.letterStatus || '';
      } else {
        aValue = a[field] || '';
        bValue = b[field] || '';
      }

      const comparison = aValue.localeCompare(bValue);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredList(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  /* FILTER BY STATUS */
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    
    if (status === '') {
      setFilteredList(dataList);
    } else {
      const filtered = dataList.filter(item => 
        item.letterStatus?.toLowerCase() === status.toLowerCase()
      );
      setFilteredList(filtered);
    }
    
    setPage(0);
    handleFilterClose();
  };

  /* RESET FILTER */
  const handleResetFilter = () => {
    setFilteredList(dataList);
    setSearchTerm("");
    setStatusFilter('');
    setPage(0);
  };

  /* SELECTION HANDLERS */
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredList.map(item => item._id));
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

  /* PAGINATION */
  const paginated = filteredList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /* ACTION MENU */
  const handleActionOpen = (e, item) => {
    e.stopPropagation();
    setActionAnchor(e.currentTarget);
    setSelectedItem(item);
  };

  const handleActionClose = () => {
    setActionAnchor(null);
    // Don't clear selectedItem immediately to avoid null reference issues
    setTimeout(() => {
      setSelectedItem(null);
    }, 100);
  };

  /* REFRESH DATA */
  const handleRefresh = () => {
    fetchData();
    showNotification("Data refreshed successfully", "success");
  };

  /* BULK DELETE */
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    showNotification(`Bulk delete for ${selected.length} items - API coming soon`, 'warning');
  };

  /* MODAL HANDLERS */
  const handleGenerateOpen = () => {
    setOpenGenerate(true);
    handleActionClose();
  };

  const handleSendOpen = () => {
    setOpenSend(true);
    handleActionClose();
  };

  const handleAcceptOpen = () => {
    setOpenAccept(true);
    handleActionClose();
  };

  const handleViewOpen = () => {
    if (selectedItem?.fileUrl) {
      window.open(selectedItem.fileUrl, '_blank');
    }
    handleActionClose();
  };

 const handleGenerateClose = (data) => {
  setOpenGenerate(false);
  if (data) {
    fetchData(); // Refresh the data to show the newly generated letter
    showNotification("Appointment letter generated successfully", "success");
  }
  setSelectedItem(null);
};

  const handleSendClose = (data) => {
    setOpenSend(false);
    if (data) {
      fetchData();
      showNotification("Appointment letter sent successfully");
    }
    setSelectedItem(null);
  };

  const handleAcceptClose = (data) => {
    setOpenAccept(false);
    if (data) {
      fetchData();
      showNotification("Appointment letter accepted successfully");
    }
    setSelectedItem(null);
  };

  /* FORMAT DATE */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get display name with null check
  const getDisplayName = (item) => {
    if (!item) return 'N/A';
    if (item.fullName) return item.fullName;
    if (item.firstName || item.lastName) return `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A';
    return 'N/A';
  };

  // Check if any items are selected
  const hasSelected = selected.length > 0;

  return (
    <Box sx={{ p: 3, mt: -8}}>
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{
          background: HEADER_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1
        }}
      >
        Appointment Management
      </Typography>
      <Typography variant="body2" color="#64748B" sx={{ mb: 3 }}>
        Generate, send and manage appointment letters for selected candidates
      </Typography>

      {/* ACTION BAR */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 3, 
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <Stack direction="row" spacing={2} justifyContent="space-between" flexWrap="wrap">
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            <TextField
              placeholder="Search by name, email, document ID..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
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
              sx={{ width: 300 }}
            />
{/* 
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
              endIcon={statusFilter && <Chip label={statusFilter} size="small" sx={{ ml: 1 }} />}
              sx={{ 
                height: 40,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                borderColor: '#e2e8f0',
                color: '#475569',
                '&:hover': {
                  borderColor: PRIMARY_BLUE,
                  bgcolor: alpha(PRIMARY_BLUE, 0.04)
                }
              }}
            >
              Filter
            </Button>

            <Button
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={() => handleSort('candidateName')}
              sx={{ 
                height: 40,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                borderColor: '#e2e8f0',
                color: '#475569',
                '&:hover': {
                  borderColor: PRIMARY_BLUE,
                  bgcolor: alpha(PRIMARY_BLUE, 0.04)
                }
              }}
            >
              Sort Name {sortField === 'candidateName' && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>

            <Tooltip title="Refresh">
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

            {(searchTerm || statusFilter) && (
              <Button 
                variant="text" 
                onClick={handleResetFilter}
                sx={{ 
                  color: PRIMARY_BLUE,
                  fontSize: '0.875rem',
                  textTransform: 'none'
                }}
              >
                Clear Filters
              </Button>
            )}
          </Stack> 

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
              >
                Delete ({selected.length})
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenGenerate(true)}
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
            >
              Generate Letter
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* FILTER MENU */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { borderRadius: 1.5, minWidth: 160 }
        }}
      >
        <MenuItem onClick={() => handleStatusFilter('')} sx={{ py: 1 }}>
          <ListItemText>All Status</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleStatusFilter('pending')} sx={{ py: 1 }}>
          <ListItemIcon>
            <AccessTimeIcon fontSize="small" sx={{ color: '#475569' }} />
          </ListItemIcon>
          <ListItemText>Pending</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusFilter('generated')} sx={{ py: 1 }}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" sx={{ color: '#92400e' }} />
          </ListItemIcon>
          <ListItemText>Generated</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusFilter('sent')} sx={{ py: 1 }}>
          <ListItemIcon>
            <SendIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText>Sent</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusFilter('accepted')} sx={{ py: 1 }}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" sx={{ color: '#2e7d32' }} />
          </ListItemIcon>
          <ListItemText>Accepted</ListItemText>
        </MenuItem>
      </Menu>

      {/* TABLE */}
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
              <TableRow sx={{ background: HEADER_GRADIENT }}>
                <TableCell padding="checkbox" sx={{ width: 60, color: TEXT_COLOR_HEADER }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredList.length}
                    checked={filteredList.length > 0 && selected.length === filteredList.length}
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
                  />
                </TableCell>
                <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Candidate
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  Document ID
                </TableCell>
                <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  Contact
                </TableCell>
                <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Letter Status
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  Generated On
                </TableCell>
                <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2, width: 100 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="#64748B" sx={{ mt: 2 }}>
                      Loading appointment letters...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginated.length > 0 ? (
                paginated.map((item, index) => {
                  const statusStyle = getStatusColor(item.letterStatus);
                  const displayName = getDisplayName(item);
                  const isSelected = selected.includes(item._id);
                  const isOddRow = index % 2 === 0;
                  
                  return (
                    <TableRow 
                      key={item._id} 
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
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(item._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            '&.Mui-checked': {
                              color: PRIMARY_BLUE,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: PRIMARY_BLUE, fontSize: '0.875rem' }}>
                            {displayName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {displayName}
                            </Typography>
                            <Typography variant="caption" color="#64748B">
                              ID: {item.candidateId}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {item.documentId}
                        </Typography>
                        <Typography variant="caption" color="#64748B">
                          {item.offerDesignation}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack spacing={0.5}>
                          {item.email ? (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <EmailIcon sx={{ fontSize: 14, color: '#64748B' }} />
                              <Typography variant="caption">{item.email}</Typography>
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="textSecondary">No email</Typography>
                          )}
                          {item.phone ? (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <PhoneIcon sx={{ fontSize: 14, color: '#64748B' }} />
                              <Typography variant="caption">{item.phone}</Typography>
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="textSecondary">No phone</Typography>
                          )}
                        </Stack>
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
                        {item.generatedAt 
                          ? formatDate(item.generatedAt)
                          : '-'
                        }
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={(e) => handleActionOpen(e, item)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AssignmentIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                      <Typography variant="body1" color="#64748B" fontWeight={500}>
                        {searchTerm || statusFilter ? 'No appointment letters found' : 'No appointment letters yet'}
                      </Typography>
                      <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
                        {searchTerm || statusFilter 
                          ? 'Try adjusting your search or filters' 
                          : 'Click "Generate Letter" to create a new appointment letter'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={searchTerm || statusFilter ? filteredList.length : totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
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

      {/* ACTION MENU */}
      <Menu 
        anchorEl={actionAnchor} 
        open={Boolean(actionAnchor)} 
        onClose={handleActionClose}
        PaperProps={{
          sx: { borderRadius: 1.5, minWidth: 180 }
        }}
      >
        {selectedItem && (
          <>
            {/* View/Download - Show if file exists */}
            {selectedItem?.fileUrl && (
              <MenuItem onClick={handleViewOpen} sx={{ py: 1 }}>
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" sx={{ color: PRIMARY_BLUE }} />
                </ListItemIcon>
                <ListItemText>View/Download</ListItemText>
              </MenuItem>
            )}

            {/* Generate Letter - Show if status is pending */}
            {selectedItem?.letterStatus === 'pending' && (
              <MenuItem onClick={handleGenerateOpen} sx={{ py: 1 }}>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" sx={{ color: PRIMARY_BLUE }} />
                </ListItemIcon>
                <ListItemText>Generate Letter</ListItemText>
              </MenuItem>
            )}

            {/* Send Letter - Show if status is generated */}
            {/* {selectedItem?.letterStatus === 'generated' && (
              <MenuItem onClick={handleSendOpen} sx={{ py: 1 }}>
                <ListItemIcon>
                  <SendIcon fontSize="small" sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText>Send Letter</ListItemText>
              </MenuItem>
            )} */}

            {/* Accept Letter - Show if status is sent */}
            {selectedItem?.letterStatus === 'sent' && (
              <MenuItem onClick={handleAcceptOpen} sx={{ py: 1 }}>
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" sx={{ color: '#2e7d32' }} />
                </ListItemIcon>
                <ListItemText>Accept Letter</ListItemText>
              </MenuItem>
            )}

            {/* If no actions available */}
            {selectedItem?.letterStatus === 'accepted' && (
              <MenuItem disabled sx={{ py: 1 }}>
                <ListItemText secondary="Letter already accepted" />
              </MenuItem>
            )}
          </>
        )}

        {!selectedItem && (
          <MenuItem disabled sx={{ py: 1 }}>
            <ListItemText secondary="No actions available" />
          </MenuItem>
        )}
      </Menu>

      {/* MODALS */}
      <GenerateAppointmentLetter
        open={openGenerate}
        onClose={() => handleGenerateClose()}
        onSubmit={(data) => {
          if (data) {
            handleGenerateClose(data);
          }
        }}
      />

      
<SendAppointmentLetter
  open={openSend}
  onClose={() => handleSendClose()}
  onSend={(data) => {
    if (data) {
      handleSendClose(data);
      showNotification('Appointment letter sent successfully', 'success');
    }
  }}
  selectedItem={selectedItem} // Pass the entire selected item
/>

      <AcceptAppointmentLetter
        open={openAccept}
        onClose={() => handleAcceptClose()}
        onAccept={(data) => {
          if (data) {
            handleAcceptClose(data);
          }
        }}
        documentId={selectedItem?.documentId}
      />

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
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

export default AppointmentManagement;