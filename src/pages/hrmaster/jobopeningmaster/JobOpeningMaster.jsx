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
  Divider,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Publish as PublishIcon,
  Close as CloseIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Import modal components
import AddJobOpening from './AddJobOpening';
import EditJobOpening from './EditJobOpening';
import ViewJobOpening from './ViewJobOpening';
import DeleteJobOpening from './DeleteJobOpening';
import PublishJob from './PublishJob';
import CloseJobOpening from './CloseJobOpening';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc';
const HOVER_COLOR = '#f1f5f9';
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a';

// Action Menu Component
const ActionMenu = ({ 
  job, 
  onView, 
  onEdit, 
  onDelete, 
  onPublish, 
  onClose, 
  anchorEl, 
  onMenuClose,
  onOpen 
}) => {
  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={(e) => onOpen(e, job)}
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
        onClose={onMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            border: '1px solid #e2e8f0'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            onView(job);
            onMenuClose();
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
            onEdit(job);
            onMenuClose();
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
        
        {job?.status === 'open' && (
          <MenuItem 
            onClick={() => {
              onPublish(job);
              onMenuClose();
            }}
            sx={{ py: 1 }}
          >
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <PublishIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500}>Publish</Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {job?.status !== 'closed' && (
          <MenuItem 
            onClick={() => {
              onClose(job);
              onMenuClose();
            }}
            sx={{ py: 1 }}
          >
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <CloseIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500}>Close Job</Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5 }} />
        
        <MenuItem 
          onClick={() => {
            onDelete(job);
            onMenuClose();
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

const JobOpeningMaster = () => {
  // State for data
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedJobForAction, setSelectedJobForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  
  // Selected job states for each modal
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [selectedJobForView, setSelectedJobForView] = useState(null);
  const [selectedJobForPublish, setSelectedJobForPublish] = useState(null);
  const [selectedJobForClose, setSelectedJobForClose] = useState(null);
  const [selectedJobForDelete, setSelectedJobForDelete] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/jobs?page=1&limit=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const jobsData = response.data.data || [];
        setJobs(jobsData);
        
        if (searchTerm) {
          const filtered = jobsData.filter(job =>
            (job.jobId && job.jobId.toLowerCase().includes(searchTerm)) ||
            (job.title && job.title.toLowerCase().includes(searchTerm)) ||
            (job.department && job.department.toLowerCase().includes(searchTerm)) ||
            (job.location && job.location.toLowerCase().includes(searchTerm)) ||
            (job.requisitionNumber && job.requisitionNumber.toLowerCase().includes(searchTerm)) ||
            (job.createdByName && job.createdByName.toLowerCase().includes(searchTerm))
          );
          setFilteredJobs(filtered);
        } else {
          setFilteredJobs(jobsData);
        }
      } else {
        showNotification('Failed to load job openings', 'error');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      showNotification('Failed to load job openings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = jobs.filter(job =>
      (job.jobId && job.jobId.toLowerCase().includes(value)) ||
      (job.title && job.title.toLowerCase().includes(value)) ||
      (job.department && job.department.toLowerCase().includes(value)) ||
      (job.location && job.location.toLowerCase().includes(value)) ||
      (job.requisitionNumber && job.requisitionNumber.toLowerCase().includes(value)) ||
      (job.createdByName && job.createdByName.toLowerCase().includes(value))
    );
    
    setFilteredJobs(filtered);
    setPage(0);
  };
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredJobs.map(job => job._id));
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
  
  // Handle add job
  const handleAddJob = async (newJob) => {
    await fetchJobs();
    showNotification('Job opening created successfully!', 'success');
  };
  
  // Handle edit job
  const handleEditJob = async (updatedJob) => {
    await fetchJobs();
    showNotification('Job opening updated successfully!', 'success');
  };
  
  // Handle delete job
  const handleDeleteJob = async (jobId) => {
    await fetchJobs();
    showNotification('Job opening deleted successfully!', 'success');
  };
  
  // Handle publish job
  const handlePublishJob = async (publishedJob) => {
    await fetchJobs();
    showNotification('Job published successfully!', 'success');
  };
  
  // Handle close job
  const handleCloseJob = async (closedJob) => {
    await fetchJobs();
    showNotification('Job closed successfully!', 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, job) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedJobForAction(job);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedJobForAction(null);
  };

  // Open edit modal
  const openEditJobModal = (job) => {
    console.log('Opening edit modal for job:', job);
    setSelectedJobForEdit(job);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewJobModal = (job) => {
    console.log('Opening view modal for job:', job);
    setSelectedJobForView(job);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open publish modal
  const openPublishJobModal = (job) => {
    console.log('Opening publish modal for job:', job);
    setSelectedJobForPublish(job);
    setOpenPublishModal(true);
    handleActionMenuClose();
  };
  
  // Open close dialog
  const openCloseJobDialog = (job) => {
    console.log('Opening close dialog for job:', job);
    setSelectedJobForClose(job);
    setOpenCloseDialog(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteJobDialog = (job) => {
    console.log('Opening delete dialog for job:', job);
    setSelectedJobForDelete(job);
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
  
  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'published':
        return 'success';
      case 'open':
        return 'default';
      case 'closed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Get avatar initials
  const getAvatarInitials = (title) => {
    if (!title) return 'JB';
    const words = title.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return title.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on title
  const getAvatarColor = (title) => {
    if (!title) return PRIMARY_BLUE;
    
    const colors = [
      '#164e63', '#0e7490', '#0891b2', '#0c4a6e', '#1d4ed8',
      '#7c3aed', '#7e22ce', '#be185d', '#c2410c', '#059669'
    ];
    
    const charCode = title.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Paginated jobs
  const paginatedJobs = filteredJobs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
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
          Job Opening Master
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          Manage and track all job openings, publish to job boards, and monitor applications
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
          {/* Search and Filters */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by Job ID, Title, Department, Location..."
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
          </Stack>

          {/* Action Buttons */}
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
              Add Job Opening
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Jobs Table */}
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
                    indeterminate={selected.length > 0 && selected.length < filteredJobs.length}
                    checked={filteredJobs.length > 0 && selected.length === filteredJobs.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: TEXT_COLOR_HEADER,
                      '&.Mui-checked': { color: TEXT_COLOR_HEADER },
                      '&.MuiCheckbox-indeterminate': { color: TEXT_COLOR_HEADER },
                      '& .MuiSvgIcon-root': { fontSize: 20 }
                    }}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, color: TEXT_COLOR_HEADER }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Job Details
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, color: TEXT_COLOR_HEADER }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Job ID
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, color: TEXT_COLOR_HEADER }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Department
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, color: TEXT_COLOR_HEADER }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Location
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, color: TEXT_COLOR_HEADER }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Status
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, color: TEXT_COLOR_HEADER }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Applications
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, width: 100, color: TEXT_COLOR_HEADER }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                      Loading job openings...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <WorkIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                      <Typography variant="body1" color="#64748B" fontWeight={500}>
                        {searchTerm ? 'No job openings found' : 'No job openings available'}
                      </Typography>
                      <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first job opening to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJobs.map((job, index) => {
                  const isSelected = selected.includes(job._id);
                  const isOddRow = index % 2 === 0;
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedJobForAction?._id === job._id;
                  const avatarColor = getAvatarColor(job.title);

                  return (
                    <TableRow
                      key={job._id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
                        '&:hover': { bgcolor: HOVER_COLOR },
                        '&.Mui-selected': {
                          bgcolor: alpha(PRIMARY_BLUE, 0.08),
                          '&:hover': { bgcolor: alpha(PRIMARY_BLUE, 0.12) }
                        }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ width: 60 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(job._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            '&.Mui-checked': { color: PRIMARY_BLUE },
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
                            {getAvatarInitials(job.title)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600} color={TEXT_COLOR_MAIN}>
                              {job.title}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                              <Typography variant="caption" color="#64748B">
                                Req: {job.requisitionNumber || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="#64748B">•</Typography>
                              <Typography variant="caption" color="#64748B">
                                {job.employmentType || 'N/A'}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color={TEXT_COLOR_MAIN}>
                          {job.jobId}
                        </Typography>
                        <Typography variant="caption" color="#64748B" display="block">
                          Created: {formatDate(job.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.department || 'N/A'}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            backgroundColor: '#e0f2fe',
                            color: '#0c4a6e',
                            border: '1px solid #bae6fd'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LocationIcon fontSize="small" sx={{ color: '#64748B' }} />
                          <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                            {job.location || 'N/A'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Chip
                            label={job.status?.toUpperCase()}
                            size="small"
                            color={getStatusColor(job.status)}
                            sx={{ fontWeight: 600, height: 24, minWidth: 80 }}
                          />
                          {job.publishTo && job.publishTo.length > 0 && (
                            <Stack direction="row" spacing={0.5}>
                              {job.publishTo.slice(0, 2).map((platform, idx) => (
                                <Tooltip key={idx} title={`${platform.platform}: ${platform.status}`}>
                                  <Chip
                                    size="small"
                                    label={platform.platform === 'careerPage' ? 'Web' : 
                                          platform.platform === 'linkedin' ? 'LI' : 
                                          platform.platform === 'naukri' ? 'NK' : platform.platform.charAt(0).toUpperCase()}
                                    sx={{ 
                                      height: 20,
                                      fontSize: '0.625rem',
                                      backgroundColor: 
                                        platform.status === 'published' ? '#dcfce7' :
                                        platform.status === 'pending' ? '#fef3c7' :
                                        platform.status === 'failed' ? '#fee2e2' : '#f1f5f9',
                                      color: 
                                        platform.status === 'published' ? '#166534' :
                                        platform.status === 'pending' ? '#92400e' :
                                        platform.status === 'failed' ? '#991b1b' : '#475569',
                                    }}
                                  />
                                </Tooltip>
                              ))}
                              {job.publishTo.length > 2 && (
                                <Tooltip title={`${job.publishTo.length - 2} more platforms`}>
                                  <Chip
                                    size="small"
                                    label={`+${job.publishTo.length - 2}`}
                                    sx={{ height: 20, fontSize: '0.625rem' }}
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Badge badgeContent={job.applicationCount || 0} color="primary">
                          <PeopleIcon sx={{ color: '#64748B' }} />
                        </Badge>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 100 }}>
                        <ActionMenu 
                          job={job}
                          onView={openViewJobModal}
                          onEdit={openEditJobModal}
                          onDelete={openDeleteJobDialog}
                          onPublish={openPublishJobModal}
                          onClose={openCloseJobDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onMenuClose={handleActionMenuClose}
                          onOpen={handleActionMenuOpen}
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
          count={filteredJobs.length}
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
      <AddJobOpening 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddJob}
      />

      {/* Edit Modal */}
      {selectedJobForEdit && (
        <EditJobOpening
          open={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedJobForEdit(null);
          }}
          job={selectedJobForEdit}
          onUpdate={handleEditJob}
        />
      )}

      {/* View Modal */}
      {selectedJobForView && (
        <ViewJobOpening
          open={openViewModal}
          onClose={() => {
            setOpenViewModal(false);
            setSelectedJobForView(null);
          }}
          job={selectedJobForView}
          onEdit={() => {
            setOpenViewModal(false);
            setSelectedJobForView(null);
            setSelectedJobForEdit(selectedJobForView);
            setOpenEditModal(true);
          }}
        />
      )}

      {/* Publish Modal */}
      {selectedJobForPublish && (
        <PublishJob
          open={openPublishModal}
          onClose={() => {
            setOpenPublishModal(false);
            setSelectedJobForPublish(null);
          }}
          job={selectedJobForPublish}
          onPublish={handlePublishJob}
        />
      )}

      {/* Close Modal */}
      {selectedJobForClose && (
        <CloseJobOpening 
          open={openCloseDialog}
          onClose={() => {
            setOpenCloseDialog(false);
            setSelectedJobForClose(null);
          }}
          jobId={selectedJobForClose._id}
          onCloseJob={handleCloseJob}  
        />
      )}

      {/* Delete Modal */}
      {selectedJobForDelete && (
        <DeleteJobOpening 
          open={openDeleteDialog}
          onClose={() => {
            setOpenDeleteDialog(false);
            setSelectedJobForDelete(null);
          }}
          job={selectedJobForDelete}
          onDelete={handleDeleteJob}
        />
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JobOpeningMaster;