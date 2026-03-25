// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
//   TextField,
//   InputAdornment,
//   Tooltip,
//   Typography,
//   Snackbar,
//   TablePagination,
//   Checkbox,
//   Stack,
//   alpha,
//   Alert,
//   Chip,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   Badge,
//   Avatar,
//   Collapse,
//   Grid
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   Download as DownloadIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   ArrowUpward as ArrowUpwardIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   MoreVert as MoreVertIcon,
//   Sort as SortIcon,
//   Close as CloseIcon,
//   CheckCircle as CheckCircleIcon,
//   Pending as PendingIcon,
//   Error as ErrorIcon,
//   TrendingUp as TrendingUpIcon,
//   Assignment as AssignmentIcon,
//   Business as BusinessIcon,
//   LocationOn as LocationIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   CalendarToday as CalendarIcon,
//   Refresh as RefreshIcon,
//   FilterAlt as FilterAltIcon,
//   CloudUpload as CloudUploadIcon,
//   NoteAdd as NoteAddIcon,
//   Star as StarIcon,
//   Update as UpdateIcon,
//   Description as ResumeIcon,
//   Clear as ClearIcon,
//   Work as WorkIcon,
//   School as SchoolIcon,
//   LinkedIn as LinkedInIcon,
//   Language as LanguageIcon,
//   People as PeopleIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Import modal components
// import AddCandidate from './AddCandidate';
// import ResumeUpload from './ResumeUpload';
// import ViewCandidate from './ViewCandidate';
// import ShortlistCandidate from './ShortlistCandidate';
// import UpdateCandidateStatus from './UpdateCandidateStatus';
// import AddNotes from './AddNotes';
// import EditCandidate from './EditCandidate';

// // Color constants
// const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
// const STRIPE_COLOR_ODD = '#FFFFFF';
// const STRIPE_COLOR_EVEN = '#f8fafc';
// const HOVER_COLOR = '#f1f5f9';
// const PRIMARY_BLUE = '#00B4D8';
// const TEXT_COLOR_HEADER = '#FFFFFF';
// const TEXT_COLOR_MAIN = '#0f172a';

// // Status color mapping - Updated to match backend enum
// const STATUS_COLORS = {
//   new: { bg: '#E3F2FD', color: '#1976D2', icon: <PersonIcon sx={{ fontSize: 14 }} />, label: 'New' },
//   contacted: { bg: '#F3E5F5', color: '#7B1FA2', icon: <PersonIcon sx={{ fontSize: 14 }} />, label: 'Contacted' },
//   shortlisted: { bg: '#E8F5E8', color: '#2E7D32', icon: <StarIcon sx={{ fontSize: 14 }} />, label: 'Shortlisted' },
//   interviewed: { bg: '#E1F5FE', color: '#0288D1', icon: <PersonIcon sx={{ fontSize: 14 }} />, label: 'Interviewed' },
//   selected: { bg: '#E8F5E8', color: '#2E7D32', icon: <CheckCircleIcon sx={{ fontSize: 14 }} />, label: 'Selected' },
//   rejected: { bg: '#FFEBEE', color: '#C62828', icon: <ErrorIcon sx={{ fontSize: 14 }} />, label: 'Rejected' },
//   onHold: { bg: '#FFF8E1', color: '#FF8F00', icon: <PendingIcon sx={{ fontSize: 14 }} />, label: 'On Hold' },
//   joined: { bg: '#E8F5E8', color: '#1B5E20', icon: <CheckCircleIcon sx={{ fontSize: 14 }} />, label: 'Joined' }
// };

// // Source options - Updated to match backend enum
// const SOURCE_OPTIONS = ['naukri', 'linkedin', 'indeed', 'walkin', 'reference', 'careerPage', 'other'];

// // Source icon mapping
// const SOURCE_ICONS = {
//   'naukri': { icon: <LanguageIcon />, color: '#FF5722', label: 'Naukri' },
//   'linkedin': { icon: <LinkedInIcon />, color: '#0077B5', label: 'LinkedIn' },
//   'indeed': { icon: <WorkIcon />, color: '#003A9B', label: 'Indeed' },
//   'walkin': { icon: <PersonIcon />, color: '#4CAF50', label: 'Walk-in' },
//   'reference': { icon: <PeopleIcon />, color: '#9C27B0', label: 'Reference' },
//   'careerPage': { icon: <BusinessIcon />, color: '#FF9800', label: 'Career Page' },
//   'upload': { icon: <CloudUploadIcon />, color: '#00BCD4', label: 'Upload' },
//   'other': { icon: <PersonIcon />, color: '#9E9E9E', label: 'Other' }
// };

// // Action Menu Component
// const ActionMenu = ({
//   candidate,
//   onView,
//   onEdit,
//   onShortlist,
//   onUpdateStatus,
//   onAddNote,
//   onViewResume,
//   onUploadResume,
//   anchorEl,
//   onClose,
//   onOpen
// }) => {
//   return (
//     <>
//       <Tooltip title="Actions">
//         <IconButton
//           size="small"
//           onClick={onOpen}
//           sx={{
//             color: '#64748b',
//             '&:hover': {
//               bgcolor: alpha(PRIMARY_BLUE, 0.1)
//             }
//           }}
//         >
//           <MoreVertIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={onClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             mt: 1,
//             minWidth: 200,
//             borderRadius: 2,
//             border: '1px solid #e2e8f0',
//             maxHeight: 400
//           }
//         }}
//       >
//         <MenuItem
//           onClick={() => {
//             onView(candidate);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
//             <ViewIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>View Details</Typography>
//           </ListItemText>
//         </MenuItem>

//         <MenuItem
//           onClick={() => {
//             onEdit(candidate);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
//             <EditIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Edit Details</Typography>
//           </ListItemText>
//         </MenuItem>

//         {/* Upload Resume Option - Always visible */}
//         <MenuItem
//           onClick={() => {
//             onUploadResume(candidate);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#0288D1', minWidth: 36 }}>
//             <CloudUploadIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Upload Resume</Typography>
//           </ListItemText>
//         </MenuItem>

//         {candidate?.resume && (
//           <MenuItem
//             onClick={() => {
//               onViewResume(candidate);
//               onClose();
//             }}
//             sx={{ py: 1 }}
//           >
//             <ListItemIcon sx={{ color: '#2E7D32', minWidth: 36 }}>
//               <ResumeIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500}>View Resume</Typography>
//             </ListItemText>
//           </MenuItem>
//         )}

//         <Divider sx={{ my: 0.5 }} />

//         {/* <MenuItem
//           onClick={() => {
//             onShortlist(candidate);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#FFB74D', minWidth: 36 }}>
//             <StarIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Shortlist</Typography>
//           </ListItemText>
//         </MenuItem> */}

//         <MenuItem
//           onClick={() => {
//             onUpdateStatus(candidate);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#1976D2', minWidth: 36 }}>
//             <UpdateIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Update Status</Typography>
//           </ListItemText>
//         </MenuItem>

//         <MenuItem
//           onClick={() => {
//             onAddNote(candidate);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#7B1FA2', minWidth: 36 }}>
//             <NoteAddIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Add Note</Typography>
//           </ListItemText>
//         </MenuItem>

//         {candidate?.latestApplication && (
//           <>
//             <Divider sx={{ my: 0.5 }} />
//             <MenuItem disabled sx={{ opacity: 1, py: 1 }}>
//               <Box sx={{ width: '100%' }}>
//                 <Typography variant="caption" color="textSecondary">
//                   Latest Application:
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                   {candidate.latestApplication.jobId?.title}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary">
//                   Status: {candidate.latestApplication.status}
//                 </Typography>
//               </Box>
//             </MenuItem>
//           </>
//         )}
//       </Menu>
//     </>
//   );
// };

// // Filter Bar Component
// const FilterBar = ({
//   filters,
//   onFilterChange,
//   onApplyFilters,
//   onClearFilters,
//   statuses,
//   sources
// }) => {
//   const [open, setOpen] = useState(false);

//   const handleClearAndClose = () => {
//     onClearFilters();
//   };

//   return (
//     <Box>
//       <Tooltip title="Filters">
//         <span>
//           <IconButton
//             onClick={() => setOpen(!open)}
//             sx={{
//               height: 40,
//               width: 40,
//               color: '#64748B',
//               '&:hover': {
//                 bgcolor: alpha(PRIMARY_BLUE, 0.1)
//               }
//             }}
//           >
//             <Badge
//               badgeContent={Object.values(filters).filter(v => v).length}
//               color="primary"
//               sx={{
//                 '& .MuiBadge-badge': {
//                   bgcolor: PRIMARY_BLUE
//                 }
//               }}
//             >
//               <FilterAltIcon />
//             </Badge>
//           </IconButton>
//         </span>
//       </Tooltip>

//       <Collapse in={open}>
//         <Paper sx={{
//           p: 2,
//           mt: 2,
//           borderRadius: 2,
//           border: '1px solid #e2e8f0',
//           bgcolor: '#f8fafc'
//         }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth size="small">
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   name="status"
//                   value={filters.status || ''}
//                   onChange={onFilterChange}
//                   label="Status"
//                   sx={{ borderRadius: 1.5, bgcolor: '#FFFFFF' }}
//                 >
//                   <MenuItem value="">All</MenuItem>
//                   {statuses.map(status => (
//                     <MenuItem key={status} value={status}>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <Box sx={{
//                           width: 8,
//                           height: 8,
//                           borderRadius: '50%',
//                           bgcolor: STATUS_COLORS[status]?.color
//                         }} />
//                         <span>{STATUS_COLORS[status]?.label || status}</span>
//                       </Stack>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth size="small">
//                 <InputLabel>Source</InputLabel>
//                 <Select
//                   name="source"
//                   value={filters.source || ''}
//                   onChange={onFilterChange}
//                   label="Source"
//                   sx={{ borderRadius: 1.5, bgcolor: '#FFFFFF' }}
//                 >
//                   <MenuItem value="">All</MenuItem>
//                   {sources.map(source => (
//                     <MenuItem key={source} value={source}>
//                       {source === 'naukri' ? 'Naukri' :
//                         source === 'linkedin' ? 'LinkedIn' :
//                           source === 'indeed' ? 'Indeed' :
//                             source === 'walkin' ? 'Walk-in' :
//                               source === 'reference' ? 'Reference' :
//                                 source === 'careerPage' ? 'Career Page' :
//                                   source === 'other' ? 'Other' : source}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Stack direction="row" spacing={1}>
//                 <Button
//                   variant="contained"
//                   onClick={onApplyFilters}
//                   sx={{
//                     height: 40,
//                     borderRadius: 1.5,
//                     background: HEADER_GRADIENT,
//                     fontSize: '0.875rem',
//                     fontWeight: 500,
//                     textTransform: 'none',
//                     flex: 1
//                   }}
//                 >
//                   Apply
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   onClick={handleClearAndClose}
//                   sx={{
//                     height: 40,
//                     borderRadius: 1.5,
//                     borderColor: '#cbd5e1',
//                     color: '#475569',
//                     fontSize: '0.875rem',
//                     fontWeight: 500,
//                     textTransform: 'none',
//                     minWidth: 40,
//                     px: 1
//                   }}
//                 >
//                   <ClearIcon />
//                 </Button>
//               </Stack>
//             </Grid>
//           </Grid>
//         </Paper>
//       </Collapse>
//     </Box>
//   );
// };

// const CandidateMaster = () => {
//   // State for data
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);

//   // Selection state
//   const [selected, setSelected] = useState([]);

//   // Filter state
//   const [filters, setFilters] = useState({
//     status: '',
//     source: ''
//   });

//   // Status options - Updated to match backend enum
//   const [statuses] = useState(['new', 'contacted', 'shortlisted', 'interviewed', 'selected', 'rejected', 'onHold', 'joined']);
//   // Source options - Updated to match backend enum
//   const [sources] = useState(SOURCE_OPTIONS);

//   // Menu state
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedCandidateForAction, setSelectedCandidateForAction] = useState(null);

//   // Modal state
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openUploadModal, setOpenUploadModal] = useState(false);
//   const [openViewModal, setOpenViewModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openShortlistModal, setOpenShortlistModal] = useState(false);
//   const [openStatusModal, setOpenStatusModal] = useState(false);
//   const [openAddNotesModal, setOpenAddNotesModal] = useState(false);

//   // Selected candidate
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   // Notification state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   // Fetch candidates function
//   const fetchCandidates = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       // Build query params - add populate parameter to include job details
//       const params = new URLSearchParams({
//         page: page + 1,
//         limit: rowsPerPage,
//         populate: 'jobId', // This tells the backend to populate job details
//         ...(searchTerm && { search: searchTerm })
//       });

//       if (filters.status) params.append('status', filters.status);
//       if (filters.source) params.append('source', filters.source);

//       const response = await axios.get(`${BASE_URL}/api/candidates?${params}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         console.log('Candidate data with jobs:', response.data.data);
//         setCandidates(response.data.data || []);
//         setTotalItems(response.data.pagination?.totalItems || 0);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//       } else {
//         showNotification('Failed to load candidates', 'error');
//       }
//     } catch (err) {
//       console.error('Error fetching candidates:', err);
//       showNotification('Failed to load candidates. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCandidates();
//   }, [page, rowsPerPage, filters]);

//   // Handle search with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setPage(0);
//       fetchCandidates();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Handle search input
//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Handle filter change
//   const handleFilterChange = (event) => {
//     const { name, value } = event.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle apply filters
//   const handleApplyFilters = () => {
//     setPage(0);
//     fetchCandidates();
//   };

//   // Handle clear filters
//   const handleClearFilters = () => {
//     setFilters({
//       status: '',
//       source: ''
//     });
//     setPage(0);
//     setTimeout(() => {
//       fetchCandidates();
//     }, 100);
//   };

//   // Handle select all
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(candidates.map(candidate => candidate._id));
//     } else {
//       setSelected([]);
//     }
//   };

//   // Handle single selection
//   const handleSelect = (id) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else {
//       newSelected = selected.filter(item => item !== id);
//     }

//     setSelected(newSelected);
//   };

//   // Handle page change
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Handle add candidate
//   const handleAddCandidate = (newCandidate) => {
//     showNotification('Candidate added successfully!', 'success');
//     setOpenAddModal(false);
//     fetchCandidates();
//   };

//   // Handle candidate update
// const handleCandidateUpdate = (updatedCandidate) => {
//   console.log('Candidate updated:', updatedCandidate);

//   // Update the candidate in the list
//   setCandidates(prevCandidates =>
//     prevCandidates.map(c =>
//       c._id === updatedCandidate._id ? updatedCandidate : c
//     )
//   );

//   // Update the selected candidate if it's the same one
//   if (selectedCandidate?._id === updatedCandidate._id) {
//     setSelectedCandidate(updatedCandidate);
//   }

//   showNotification('Candidate updated successfully!', 'success');
//   setOpenEditModal(false);
//   setSelectedCandidate(null);
//   fetchCandidates(); // Refresh the list to be safe
// };

//   // Handle upload resume
//   const handleUploadResume = (data) => {
//     showNotification('Resume uploaded successfully!', 'success');
//     setOpenUploadModal(false);
//     setSelectedCandidate(null);
//     fetchCandidates();
//   };

//   // Handle shortlist candidate
//   const handleShortlistCandidate = (data) => {
//     showNotification('Candidate shortlisted successfully!', 'success');
//     setOpenShortlistModal(false);
//     setSelectedCandidate(null);
//     fetchCandidates();
//   };

//   // Handle update status
//   const handleUpdateStatus = (data) => {
//     showNotification('Status updated successfully!', 'success');
//     setOpenStatusModal(false);
//     setSelectedCandidate(null);
//     fetchCandidates();
//   };

//   // Handle add note
//   const handleAddNote = (note) => {
//     showNotification('Note added successfully!', 'success');
//     fetchCandidates(); // Refresh to show new note count
//   };

//   // Handle job update from ViewCandidate
//   const handleJobUpdate = (updatedCandidate) => {
//     console.log('Job updated for candidate:', updatedCandidate);

//     // Update the candidate in the list
//     setCandidates(prevCandidates =>
//       prevCandidates.map(c =>
//         c._id === updatedCandidate._id ? updatedCandidate : c
//       )
//     );

//     // Update the selected candidate if it's the same one
//     if (selectedCandidate?._id === updatedCandidate._id) {
//       setSelectedCandidate(updatedCandidate);
//     }

//     showNotification('Job assigned successfully!', 'success');
//   };

//   // Handle bulk delete (for future implementation)
//   const handleBulkDelete = () => {
//     if (selected.length === 0) return;

//     if (window.confirm(`Are you sure you want to delete ${selected.length} selected candidates?`)) {
//       showNotification('Bulk delete requires API implementation', 'warning');
//     }
//   };

//   // Action menu handlers
//   const handleActionMenuOpen = (event, candidate) => {
//     setActionMenuAnchor(event.currentTarget);
//     setSelectedCandidateForAction(candidate);
//   };

//   const handleActionMenuClose = () => {
//     setActionMenuAnchor(null);
//     setSelectedCandidateForAction(null);
//   };

//   // Open view modal
//   const openViewCandidateModal = (candidate) => {
//     setSelectedCandidate(candidate);
//     setOpenViewModal(true);
//     handleActionMenuClose();
//   };

//   // Open edit modal
//   const openEditCandidateModal = (candidate) => {
//     setSelectedCandidate(candidate);
//     setOpenEditModal(true);
//     handleActionMenuClose();
//   };

//   // Open upload resume modal
//   const openUploadResumeModal = (candidate) => {
//     setSelectedCandidate(candidate);
//     setOpenUploadModal(true);
//     handleActionMenuClose();
//   };

//   // Open shortlist modal
//   const openShortlistCandidateModal = (candidate) => {
//     setSelectedCandidate(candidate);
//     setOpenShortlistModal(true);
//     handleActionMenuClose();
//   };

//   // Open status update modal
//   const openStatusUpdateModal = (candidate) => {
//     setSelectedCandidate(candidate);
//     setOpenStatusModal(true);
//     handleActionMenuClose();
//   };

//   // Open notes modal
//   const openAddNotesModalHandler = (candidate) => {
//     setSelectedCandidate(candidate);
//     setOpenAddNotesModal(true);
//     handleActionMenuClose();
//   };

//   // View resume
//   const handleViewResume = (candidate) => {
//     if (candidate?.resume?.fileUrl) {
//       window.open(`${BASE_URL}${candidate.resume.fileUrl}`, '_blank');
//     }
//     handleActionMenuClose();
//   };

//   // Show notification
//   const showNotification = (message, severity) => {
//     setSnackbar({
//       open: true,
//       message,
//       severity
//     });
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get source icon
//   const getSourceIcon = (source) => {
//     switch (source?.toLowerCase()) {
//       case 'naukri':
//         return <LanguageIcon sx={{ fontSize: 14, color: '#FF5722' }} />;
//       case 'linkedin':
//         return <LinkedInIcon sx={{ fontSize: 14, color: '#0077B5' }} />;
//       case 'indeed':
//         return <WorkIcon sx={{ fontSize: 14, color: '#003A9B' }} />;
//       case 'walkin':
//         return <PersonIcon sx={{ fontSize: 14, color: '#4CAF50' }} />;
//       case 'reference':
//         return <PeopleIcon sx={{ fontSize: 14, color: '#9C27B0' }} />;
//       case 'careerpage':
//         return <BusinessIcon sx={{ fontSize: 14, color: '#FF9800' }} />;
//       case 'upload':
//         return <CloudUploadIcon sx={{ fontSize: 14, color: '#00BCD4' }} />;
//       case 'other':
//         return <PersonIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />;
//       default:
//         return <PersonIcon sx={{ fontSize: 14, color: '#757575' }} />;
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ mb: 3 }}>
//         <Typography
//           variant="h5"
//           component="h1"
//           fontWeight="600"
//           sx={{
//             color: TEXT_COLOR_MAIN,
//             background: HEADER_GRADIENT,
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             backgroundClip: 'text',
//             display: 'inline-block'
//           }}
//         >
//           Candidate Master
//         </Typography>
//         <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
//           Manage and track candidates throughout the recruitment process
//         </Typography>
//       </Box>

//       {/* Action Bar */}
//       <Paper sx={{
//         p: 2,
//         mb: 3,
//         borderRadius: 2,
//         bgcolor: '#FFFFFF',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: '1px solid #e2e8f0'
//       }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
//           {/* Search and Filters */}
//           <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
//             <TextField
//               placeholder="Search by name, email, phone, skills..."
//               size="small"
//               value={searchTerm}
//               onChange={handleSearch}
//               sx={{
//                 width: { xs: '100%', sm: 320 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1.5,
//                   '&:hover fieldset': {
//                     borderColor: PRIMARY_BLUE,
//                   },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ color: '#64748B' }} />
//                   </InputAdornment>
//                 ),
//                 sx: {
//                   height: 40,
//                   bgcolor: '#f8fafc',
//                   '& input': {
//                     padding: '8px 12px',
//                     fontSize: '0.875rem'
//                   }
//                 }
//               }}
//               disabled={loading}
//             />

//             {/* <FilterBar
//               filters={filters}
//               onFilterChange={handleFilterChange}
//               onApplyFilters={handleApplyFilters}
//               onClearFilters={handleClearFilters}
//               statuses={statuses}
//               sources={sources}
//             />

//             <Tooltip title="Refresh">
//               <span>
//                 <IconButton
//                   onClick={fetchCandidates}
//                   disabled={loading}
//                   sx={{
//                     height: 40,
//                     width: 40,
//                     color: '#64748B',
//                     '&:hover': {
//                       bgcolor: alpha(PRIMARY_BLUE, 0.1)
//                     }
//                   }}
//                 >
//                   <RefreshIcon />
//                 </IconButton>
//               </span>
//             </Tooltip> */}
//           </Stack>

//           {/* Action Buttons */}
//           <Stack direction="row" spacing={2} alignItems="center">
//             {selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon />}
//                 onClick={handleBulkDelete}
//                 sx={{
//                   height: 40,
//                   borderRadius: 1.5,
//                   textTransform: 'none',
//                   fontSize: '0.875rem',
//                   fontWeight: 500
//                 }}
//                 disabled={loading}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}

//             <Button
//               variant="outlined"
//               startIcon={<DownloadIcon />}
//               sx={{
//                 height: 40,
//                 borderRadius: 1.5,
//                 borderColor: '#cbd5e1',
//                 color: '#475569',
//                 fontSize: '0.875rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 '&:hover': {
//                   borderColor: PRIMARY_BLUE,
//                   bgcolor: alpha(PRIMARY_BLUE, 0.04)
//                 }
//               }}
//               disabled={loading}
//             >
//               Export
//             </Button>

//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setOpenAddModal(true)}
//               sx={{
//                 height: 40,
//                 borderRadius: 1.5,
//                 background: HEADER_GRADIENT,
//                 fontSize: '0.875rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 '&:hover': {
//                   opacity: 0.9,
//                   background: HEADER_GRADIENT,
//                 }
//               }}
//               disabled={loading}
//             >
//               Add Candidate
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Candidates Table */}
//       <Paper sx={{
//         width: '100%',
//         borderRadius: 2,
//         overflow: 'hidden',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: '1px solid #e2e8f0'
//       }}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{
//                 background: HEADER_GRADIENT,
//                 '& .MuiTableCell-root': {
//                   borderBottom: 'none',
//                   color: TEXT_COLOR_HEADER
//                 }
//               }}>
//                 <TableCell padding="checkbox" sx={{ width: 60 }}>
//                   <Checkbox
//                     indeterminate={selected.length > 0 && selected.length < candidates.length}
//                     checked={candidates.length > 0 && selected.length === candidates.length}
//                     onChange={handleSelectAll}
//                     sx={{
//                       color: TEXT_COLOR_HEADER,
//                       '&.Mui-checked': {
//                         color: TEXT_COLOR_HEADER,
//                       },
//                       '&.MuiCheckbox-indeterminate': {
//                         color: TEXT_COLOR_HEADER,
//                       },
//                       '& .MuiSvgIcon-root': {
//                         fontSize: 20
//                       }
//                     }}
//                     disabled={loading}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Candidate ID
//                     <ArrowUpwardIcon sx={{ fontSize: 14, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Name
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Contact
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Skills
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Status
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Source
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Added On
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, width: 100 }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
//                     <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
//                       Loading candidates...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : candidates.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <PersonIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
//                       <Typography variant="body1" color="#64748B" fontWeight={500}>
//                         {searchTerm || filters.status || filters.source
//                           ? 'No candidates found matching your criteria'
//                           : 'No candidates available'}
//                       </Typography>
//                       <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
//                         {searchTerm || filters.status || filters.source
//                           ? 'Try adjusting your filters or search terms'
//                           : 'Add your first candidate to get started'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 candidates.map((candidate, index) => {
//                   const isSelected = selected.includes(candidate._id);
//                   const isOddRow = index % 2 === 0;
//                   const isActionMenuOpen = Boolean(actionMenuAnchor) &&
//                     selectedCandidateForAction?._id === candidate._id;
//                   const statusStyle = STATUS_COLORS[candidate.status] || STATUS_COLORS.new;
//                   const noteCount = candidate.notes?.length || 0;

//                   return (
//                     <TableRow
//                       key={candidate._id}
//                       hover
//                       selected={isSelected}
//                       sx={{
//                         bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
//                         '&:hover': {
//                           bgcolor: HOVER_COLOR
//                         },
//                         '&.Mui-selected': {
//                           bgcolor: alpha(PRIMARY_BLUE, 0.08),
//                           '&:hover': {
//                             bgcolor: alpha(PRIMARY_BLUE, 0.12)
//                           }
//                         }
//                       }}
//                     >
//                       <TableCell padding="checkbox" sx={{ width: 60 }}>
//                         <Checkbox
//                           checked={isSelected}
//                           onChange={() => handleSelect(candidate._id)}
//                           sx={{
//                             color: PRIMARY_BLUE,
//                             '&.Mui-checked': {
//                               color: PRIMARY_BLUE,
//                             },
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Stack spacing={0.5}>
//                           <Typography variant="body2" fontWeight={600} color={TEXT_COLOR_MAIN}>
//                             {candidate.candidateId}
//                           </Typography>
//                           <Typography variant="caption" color="#64748B">
//                             {candidate._id?.slice(-6)}
//                           </Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Avatar
//                             sx={{
//                               width: 32,
//                               height: 32,
//                               bgcolor: alpha(PRIMARY_BLUE, 0.1),
//                               color: PRIMARY_BLUE,
//                               fontSize: '14px',
//                               fontWeight: 600
//                             }}
//                           >
//                             {candidate.firstName?.[0]}{candidate.lastName?.[0]}
//                           </Avatar>
//                           <Box>
//                             <Typography variant="body2" fontWeight={600} color={TEXT_COLOR_MAIN}>
//                               {candidate.firstName} {candidate.lastName}
//                             </Typography>
//                             {candidate.dateOfBirth && (
//                               <Typography variant="caption" color="#64748B">
//                                 DOB: {formatDate(candidate.dateOfBirth)}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Stack spacing={0.5}>
//                           <Stack direction="row" alignItems="center" spacing={0.5}>
//                             <EmailIcon sx={{ fontSize: 14, color: '#64748B' }} />
//                             <Typography variant="body2" color={TEXT_COLOR_MAIN} noWrap sx={{ maxWidth: 150 }}>
//                               {candidate.email}
//                             </Typography>
//                           </Stack>
//                           <Stack direction="row" alignItems="center" spacing={0.5}>
//                             <PhoneIcon sx={{ fontSize: 14, color: '#64748B' }} />
//                             <Typography variant="caption" color="#64748B">
//                               {candidate.phone}
//                             </Typography>
//                           </Stack>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                           {candidate.skills?.slice(0, 2).map((skill, idx) => (
//                             <Chip
//                               key={idx}
//                               label={skill}
//                               size="small"
//                               sx={{
//                                 height: 20,
//                                 fontSize: '11px',
//                                 bgcolor: alpha(PRIMARY_BLUE, 0.1),
//                                 color: PRIMARY_BLUE,
//                                 fontWeight: 500
//                               }}
//                             />
//                           ))}
//                           {candidate.skills?.length > 2 && (
//                             <Chip
//                               label={`+${candidate.skills.length - 2}`}
//                               size="small"
//                               sx={{
//                                 height: 20,
//                                 fontSize: '11px',
//                                 bgcolor: '#f1f5f9',
//                                 color: '#475569'
//                               }}
//                             />
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           badgeContent={noteCount}
//                           color="primary"
//                           sx={{
//                             '& .MuiBadge-badge': {
//                               bgcolor: PRIMARY_BLUE,
//                               fontSize: '10px',
//                               height: '18px',
//                               minWidth: '18px'
//                             }
//                           }}
//                         >
//                           <Chip
//                             icon={statusStyle.icon}
//                             label={statusStyle.label}
//                             size="small"
//                             sx={{
//                               bgcolor: statusStyle.bg,
//                               color: statusStyle.color,
//                               fontWeight: 500,
//                               fontSize: '0.75rem',
//                               height: 24,
//                               '& .MuiChip-icon': {
//                                 color: statusStyle.color
//                               }
//                             }}
//                           />
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" alignItems="center" spacing={0.5}>
//                           {getSourceIcon(candidate.source)}
//                           <Typography variant="caption" color="#64748B" sx={{ textTransform: 'capitalize' }}>
//                             {candidate.source === 'naukri' ? 'Naukri' :
//                               candidate.source === 'linkedin' ? 'LinkedIn' :
//                                 candidate.source === 'indeed' ? 'Indeed' :
//                                   candidate.source === 'walkin' ? 'Walk-in' :
//                                     candidate.source === 'reference' ? 'Reference' :
//                                       candidate.source === 'careerPage' ? 'Career Page' :
//                                         candidate.source === 'upload' ? 'Upload' :
//                                           candidate.source === 'other' ? 'Other' : candidate.source || 'N/A'}
//                           </Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Stack spacing={0.5}>
//                           <Typography variant="caption" color="#64748B">
//                             {formatDate(candidate.createdAt)}
//                           </Typography>
//                           <Stack direction="row" alignItems="center" spacing={0.5}>
//                             <PersonIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
//                             <Typography variant="caption" color="#64748B">
//                               {candidate.createdByName}
//                             </Typography>
//                           </Stack>
//                         </Stack>
//                       </TableCell>
//                       <TableCell align="center" sx={{ width: 100 }}>
//                         <ActionMenu
//                           candidate={candidate}
//                           onView={openViewCandidateModal}
//                           onEdit={openEditCandidateModal}
//                           onShortlist={openShortlistCandidateModal}
//                           onUpdateStatus={openStatusUpdateModal}
//                           onAddNote={openAddNotesModalHandler}
//                           onViewResume={handleViewResume}
//                           onUploadResume={openUploadResumeModal}
//                           anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
//                           onClose={handleActionMenuClose}
//                           onOpen={(e) => handleActionMenuOpen(e, candidate)}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Pagination */}
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={totalItems}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             borderTop: '1px solid #e2e8f0',
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//               fontSize: '0.875rem',
//               color: '#64748B'
//             },
//             '& .MuiTablePagination-actions button': {
//               color: PRIMARY_BLUE,
//             }
//           }}
//         />
//       </Paper>

//       {/* Modal Components */}
//       <AddCandidate
//         open={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onAdd={handleAddCandidate}
//       />

//       {/* Single ResumeUpload component - will receive candidateId when opened from action menu */}
//       <ResumeUpload
//         open={openUploadModal}
//         onClose={() => {
//           setOpenUploadModal(false);
//           setSelectedCandidate(null);
//         }}
//         onUpload={handleUploadResume}
//         candidateId={selectedCandidate?.candidateId} // Pass candidate ID for update, undefined for new candidate
//       />

//       {selectedCandidate && (
//         <>
//           <ViewCandidate
//             open={openViewModal}
//             onClose={() => {
//               setOpenViewModal(false);
//               setSelectedCandidate(null);
//             }}
//             candidateId={selectedCandidate?._id} // Pass the ID instead of the whole object
//           />
//           <EditCandidate
//             open={openEditModal}
//             onClose={() => setOpenEditModal(false)}
//             onUpdate={handleCandidateUpdate}
//             candidateId={selectedCandidate?._id}
//             candidateData={selectedCandidate}
//           />
//           <ShortlistCandidate
//             open={openShortlistModal}
//             onClose={() => {
//               setOpenShortlistModal(false);
//               setSelectedCandidate(null);
//             }}
//             onShortlist={handleShortlistCandidate}
//             candidateId={selectedCandidate._id}
//             candidateData={selectedCandidate}
//           />

//           <UpdateCandidateStatus
//             open={openStatusModal}
//             onClose={() => {
//               setOpenStatusModal(false);
//               setSelectedCandidate(null);
//             }}
//             onUpdate={handleUpdateStatus}
//             candidateId={selectedCandidate._id}
//             candidateData={selectedCandidate}
//           />

//           <AddNotes
//             open={openAddNotesModal}
//             onClose={() => {
//               setOpenAddNotesModal(false);
//               setSelectedCandidate(null);
//             }}
//             onAdd={handleAddNote}
//             candidateId={selectedCandidate._id}
//             candidateData={selectedCandidate}
//           />
//         </>
//       )}

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{
//             width: '100%',
//             borderRadius: 1.5,
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default CandidateMaster;

import React, { useState, useEffect, useCallback } from "react";
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Badge,
  Avatar,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  CloudUpload as CloudUploadIcon,
  NoteAdd as NoteAddIcon,
  Star as StarIcon,
  Update as UpdateIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Description as ResumeIcon,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from "../../../utils/modulePermissions";

// Import modal components
import AddCandidate from "./AddCandidate";
import ResumeUpload from "./ResumeUpload";
import ViewCandidate from "./ViewCandidate";
import ShortlistCandidate from "./ShortlistCandidate";
import UpdateCandidateStatus from "./UpdateCandidateStatus";
import AddNotes from "./AddNotes";
import EditCandidate from "./EditCandidate";

// Color constants
const COLORS = {
  primary: "#063C3F",
  primaryLight: "#E8F0F1",
  primaryDark: "#05292B",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8",
    light: "#FFFFFF",
    lightMuted: "rgba(255, 255, 255, 0.9)",
  },
  background: {
    white: "#FFFFFF",
    light: "#F8FFFC",
    hover: "#F0FDF9",
    tableHeader: "#063C3F",
  },
  border: "#E3E8EF",
  status: {
    success: "#9FE2BF",
    warning: "#FEF3C7",
    error: "#FEE2E2",
    info: "#E0F2FE",
  },
  chips: {
    active: "#9FE2BF",
    inactive: "#F1F5F9",
    suspended: "#FEF3C7",
    locked: "#FEE2E2",
  },
};

// Status color mapping
const STATUS_COLORS = {
  new: {
    bg: COLORS.status.info,
    color: COLORS.primaryDark,
    icon: <PersonIcon sx={{ fontSize: "0.7rem" }} />,
    label: "New",
  },
  contacted: {
    bg: "#F3E5F5",
    color: "#7B1FA2",
    icon: <PersonIcon sx={{ fontSize: "0.7rem" }} />,
    label: "Contacted",
  },
  shortlisted: {
    bg: COLORS.status.success,
    color: COLORS.primaryDark,
    icon: <StarIcon sx={{ fontSize: "0.7rem" }} />,
    label: "Shortlisted",
  },
  interviewed: {
    bg: "#E1F5FE",
    color: "#0288D1",
    icon: <PersonIcon sx={{ fontSize: "0.7rem" }} />,
    label: "Interviewed",
  },
  selected: {
    bg: COLORS.status.success,
    color: COLORS.primaryDark,
    icon: <CheckCircleIcon sx={{ fontSize: "0.7rem" }} />,
    label: "Selected",
  },
  rejected: {
    bg: COLORS.status.error,
    color: "#991B1B",
    icon: <ErrorIcon sx={{ fontSize: "0.7rem" }} />,
    label: "Rejected",
  },
  onHold: {
    bg: COLORS.status.warning,
    color: "#92400E",
    icon: <PendingIcon sx={{ fontSize: "0.7rem" }} />,
    label: "On Hold",
  },
  joined: {
    bg: COLORS.status.success,
    color: COLORS.primaryDark,
    icon: <CheckCircleIcon sx={{ fontSize: "0.7rem" }} />,
    label: "Joined",
  },
};

// Source options
const SOURCE_OPTIONS = [
  "naukri",
  "linkedin",
  "indeed",
  "walkin",
  "reference",
  "careerPage",
  "other",
];

// Source icon mapping
const getSourceIcon = (source) => {
  switch (source?.toLowerCase()) {
    case "naukri":
      return <LanguageIcon sx={{ fontSize: "0.7rem", color: "#FF5722" }} />;
    case "linkedin":
      return <LinkedInIcon sx={{ fontSize: "0.7rem", color: "#0077B5" }} />;
    case "indeed":
      return <WorkIcon sx={{ fontSize: "0.7rem", color: "#003A9B" }} />;
    case "walkin":
      return <PersonIcon sx={{ fontSize: "0.7rem", color: "#4CAF50" }} />;
    case "reference":
      return <PeopleIcon sx={{ fontSize: "0.7rem", color: "#9C27B0" }} />;
    case "careerPage":
      return <BusinessIcon sx={{ fontSize: "0.7rem", color: "#FF9800" }} />;
    default:
      return (
        <PersonIcon sx={{ fontSize: "0.7rem", color: COLORS.text.tertiary }} />
      );
  }
};

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error" sx={{ mb: 2 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" color="text.secondary">
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Action Menu Component with permission checks
const ActionMenu = ({
  candidate,
  onView,
  onEdit,
  onUpdateStatus,
  onAddNote,
  onViewResume,
  onUploadResume,
  anchorEl,
  onClose,
  onOpen,
  permissions,
  isSuperAdmin,
}) => {
  // Check permissions
  const canView = hasPermission(permissions, MODULES.CANDIDATE_MASTER, PAGES.CANDIDATE_MASTER, ACTIONS.VIEW);
  const canCreate = hasPermission(permissions, MODULES.CANDIDATE_MASTER, PAGES.CANDIDATE_MASTER, ACTIONS.CREATE);
  const canUpdate = hasPermission(permissions, MODULES.CANDIDATE_MASTER, PAGES.CANDIDATE_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.CANDIDATE_MASTER, PAGES.CANDIDATE_MASTER, ACTIONS.DELETE);
  const canExport = hasPermission(permissions, MODULES.CANDIDATE_MASTER, PAGES.CANDIDATE_MASTER, ACTIONS.EXPORT);
  const canImport = hasPermission(permissions, MODULES.CANDIDATE_MASTER, PAGES.CANDIDATE_MASTER, ACTIONS.IMPORT);
  const canPrint = hasPermission(permissions, MODULES.CANDIDATE_MASTER, PAGES.CANDIDATE_MASTER, ACTIONS.PRINT);

  // Superadmin has all permissions
  const hasFullAccess = isSuperAdmin;

  // If no actions available, don't render the menu
  if (!hasFullAccess && !canView && !canUpdate && !canDelete) {
    return null;
  }

  // If only view action is available, show just the view button
  if ((hasFullAccess || canView) && !(hasFullAccess || canUpdate)) {
    return (
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={() => onView(candidate)}
          sx={{
            color: COLORS.text.secondary,
            "&:hover": {
              bgcolor: `${COLORS.primary}20`,
            },
          }}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: COLORS.text.secondary,
            "&:hover": {
              bgcolor: `${COLORS.primary}20`,
            },
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
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {(hasFullAccess || canView) && (
          <MenuItem
            onClick={() => {
              onView(candidate);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: COLORS.text.primary, fontSize: "0.75rem" }}
              >
                View Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {(hasFullAccess || canUpdate) && (
          <MenuItem
            onClick={() => {
              onEdit(candidate);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: COLORS.text.primary, fontSize: "0.75rem" }}
              >
                Edit Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {(hasFullAccess || canUpdate) && (
          <MenuItem
            onClick={() => {
              onUploadResume(candidate);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: "#0288D1", minWidth: 36 }}>
              <CloudUploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: COLORS.text.primary, fontSize: "0.75rem" }}
              >
                Upload Resume
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {(hasFullAccess || canView) && candidate?.resume && (
          <MenuItem
            onClick={() => {
              onViewResume(candidate);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: "#2E7D32", minWidth: 36 }}>
              <ResumeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: COLORS.text.primary, fontSize: "0.75rem" }}
              >
                View Resume
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {(hasFullAccess || canUpdate) && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

            <MenuItem
              onClick={() => {
                onUpdateStatus(candidate);
                onClose();
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: "#1976D2", minWidth: 36 }}>
                <UpdateIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ color: COLORS.text.primary, fontSize: "0.75rem" }}
                >
                  Update Status
                </Typography>
              </ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => {
                onAddNote(candidate);
                onClose();
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: "#7B1FA2", minWidth: 36 }}>
                <NoteAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ color: COLORS.text.primary, fontSize: "0.75rem" }}
                >
                  Add Note
                </Typography>
              </ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

const CandidateMaster = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ status: "", source: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedCandidateForAction, setSelectedCandidateForAction] =
    useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openAddNotesModal, setOpenAddNotesModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  const statuses = [
    "new",
    "contacted",
    "shortlisted",
    "interviewed",
    "selected",
    "rejected",
    "onHold",
    "joined",
  ];
  const sources = SOURCE_OPTIONS;

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          
          if (userData.permissions && Array.isArray(userData.permissions)) {
            setUserPermissions(userData.permissions);
          } else {
            setUserPermissions([]);
          }
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
        setUserPermissions([]);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    
    fetchUserPermissions();
  }, []);

  // Check permission helper
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(
      userPermissions,
      MODULES.CANDIDATE_MASTER,
      PAGES.CANDIDATE_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch candidates
  const fetchCandidates = useCallback(async () => {
    // Only fetch if user has view permission
    if (!canViewPage && !isSuperAdmin) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        populate: "jobId",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(sourceFilter && { source: sourceFilter }),
      });

      const response = await axios.get(`${BASE_URL}/api/candidates?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCandidates(response.data.data || []);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        showNotification("Failed to load candidates", "error");
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
      showNotification("Failed to load candidates. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, sourceFilter, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchCandidates();
    }
  }, [fetchCandidates, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleSelectAll = (event) => {
    if (!canDelete && !isSuperAdmin) return;
    
    if (event.target.checked) {
      setSelected(candidates.map((candidate) => candidate._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    if (!canDelete && !isSuperAdmin) return;
    
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter((item) => item !== id);
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

  const handleClearFilters = () => {
    setStatusFilter("");
    setSourceFilter("");
    setSearchInput("");
    setSearchTerm("");
    setPage(0);
  };

  const handleActionMenuOpen = (event, candidate) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedCandidateForAction(candidate);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedCandidateForAction(null);
  };

  const openViewCandidateModal = (candidate) => {
    if (!canViewPage && !isSuperAdmin) {
      showNotification('You do not have permission to view candidates', 'error');
      return;
    }
    setSelectedCandidate(candidate);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditCandidateModal = (candidate) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to edit candidates', 'error');
      return;
    }
    setSelectedCandidate(candidate);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openUploadResumeModal = (candidate) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to upload resumes', 'error');
      return;
    }
    setSelectedCandidate(candidate);
    setOpenUploadModal(true);
    handleActionMenuClose();
  };

  const openStatusUpdateModal = (candidate) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to update candidate status', 'error');
      return;
    }
    setSelectedCandidate(candidate);
    setOpenStatusModal(true);
    handleActionMenuClose();
  };

  const openAddNotesModalHandler = (candidate) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to add notes', 'error');
      return;
    }
    setSelectedCandidate(candidate);
    setOpenAddNotesModal(true);
    handleActionMenuClose();
  };

  const handleViewResume = (candidate) => {
    if ((!canViewPage && !isSuperAdmin)) {
      showNotification('You do not have permission to view resumes', 'error');
      return;
    }
    if (candidate?.resume?.fileUrl) {
      window.open(`${BASE_URL}${candidate.resume.fileUrl}`, "_blank");
    }
    handleActionMenuClose();
  };

  const handleAddCandidate = () => {
    showNotification("Candidate added successfully!", "success");
    setOpenAddModal(false);
    fetchCandidates();
  };

  const handleCandidateUpdate = () => {
    showNotification("Candidate updated successfully!", "success");
    setOpenEditModal(false);
    setSelectedCandidate(null);
    fetchCandidates();
  };

  const handleUploadResume = () => {
    showNotification("Resume uploaded successfully!", "success");
    setOpenUploadModal(false);
    setSelectedCandidate(null);
    fetchCandidates();
  };

  const handleUpdateStatus = () => {
    showNotification("Status updated successfully!", "success");
    setOpenStatusModal(false);
    setSelectedCandidate(null);
    fetchCandidates();
  };

  const handleAddNote = () => {
    showNotification("Note added successfully!", "success");
    fetchCandidates();
  };

  const handleRefresh = () => {
    fetchCandidates();
    showNotification("Data refreshed", "success");
  };

  const handleBulkDelete = () => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete candidates', 'error');
      return;
    }
    if (selected.length === 0) return;
    showNotification(
      `Bulk delete for ${selected.length} items - API implementation required`,
      "warning",
    );
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isFilterActive = statusFilter || sourceFilter || searchTerm;

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canViewPage && !isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5,
          }}
        >
          Candidate Master
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.75rem", color: COLORS.text.secondary }}
        >
          Manage and track candidates throughout the recruitment process
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper
        sx={{
          p: 1.5,
          mb: 2.5,
          borderRadius: 2,
          bgcolor: COLORS.background.white,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ flex: 1, flexWrap: "wrap" }}
          >
            <TextField
              placeholder="Search by name, email, phone, skills..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 280 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.75rem",
                  "&:hover fieldset": { borderColor: COLORS.primary },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: "1rem", color: COLORS.text.tertiary }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchInput("")}
                      edge="end"
                    >
                      <CloseIcon
                        fontSize="small"
                        sx={{ color: COLORS.text.tertiary }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  height: 36,
                  bgcolor: COLORS.background.light,
                  "& input": {
                    padding: "6px 12px",
                    fontSize: "0.75rem",
                    color: COLORS.text.primary,
                  },
                },
              }}
            />

            {isFilterActive && (
              <Button
                variant="text"
                startIcon={<CloseIcon sx={{ fontSize: "1rem" }} />}
                onClick={handleClearFilters}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  textTransform: "none",
                  color: COLORS.text.secondary,
                }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={1.5}>
            {/* Bulk Delete Button - Only show if user has delete permission */}
            {(canDelete || isSuperAdmin) && selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: "1rem" }} />}
                onClick={handleBulkDelete}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  borderColor: "#fee2e2",
                  color: "#991b1b",
                  "&:hover": { borderColor: "#fecaca", bgcolor: "#fee2e2" },
                }}
              >
                Delete ({selected.length})
              </Button>
            )}

            {/* Add Candidate Button - Only show if user has create permission */}
            {(canCreate || isSuperAdmin) && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: "1rem" }} />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primary,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  "&:hover": { bgcolor: COLORS.primaryDark },
                }}
              >
                Add Candidate
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Candidates Table */}
      <Paper
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: COLORS.background.tableHeader,
                  "& .MuiTableCell-root": {
                    borderBottom: "none",
                    color: COLORS.text.light,
                    py: 1.5,
                  },
                }}
              >
                {/* Checkbox Column - Only show if user has delete permission */}
                {(canDelete || isSuperAdmin) && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < candidates.length
                      }
                      checked={
                        candidates.length > 0 &&
                        selected.length === candidates.length
                      }
                      onChange={handleSelectAll}
                      sx={{
                        color: COLORS.text.light,
                        "&.Mui-checked": { color: COLORS.text.light },
                        "&.MuiCheckbox-indeterminate": {
                          color: COLORS.text.light,
                        },
                        "& .MuiSvgIcon-root": { fontSize: "1.25rem" },
                      }}
                      disabled={loading || candidates.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Candidate ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Contact
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Skills
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Source
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Added On
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.5px",
                    width: 60,
                  }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress
                      size={32}
                      sx={{ color: COLORS.primary }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: COLORS.text.secondary,
                        mt: 1,
                      }}
                    >
                      Loading candidates...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <PersonIcon
                        sx={{
                          fontSize: 48,
                          color: COLORS.text.tertiary,
                          mb: 2,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: COLORS.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        {isFilterActive
                          ? "No candidates match your filters"
                          : "No candidates available"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: COLORS.text.tertiary,
                          mt: 0.5,
                        }}
                      >
                        {isFilterActive
                          ? "Try adjusting your search or filters"
                          : "Add your first candidate to get started"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate, index) => {
                  const isSelected = selected.includes(candidate._id);
                  const isActionMenuOpen =
                    Boolean(actionMenuAnchor) &&
                    selectedCandidateForAction?._id === candidate._id;
                  const statusStyle =
                    STATUS_COLORS[candidate.status] || STATUS_COLORS.new;
                  const noteCount = candidate.notes?.length || 0;

                  return (
                    <TableRow
                      key={candidate._id}
                      hover
                      selected={isSelected}
                      sx={{
                        bgcolor: COLORS.background.white,
                        "&:hover": { bgcolor: COLORS.background.hover },
                        "&.Mui-selected": {
                          bgcolor: `${COLORS.primary}10`,
                          "&:hover": { bgcolor: `${COLORS.primary}20` },
                        },
                        "& .MuiTableCell-root": {
                          py: 1.5,
                          fontSize: "0.75rem",
                          borderColor: COLORS.border,
                        },
                      }}
                    >
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {(canDelete || isSuperAdmin) && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(candidate._id)}
                            sx={{
                              color: COLORS.primary,
                              "&.Mui-checked": { color: COLORS.primary },
                              "& .MuiSvgIcon-root": { fontSize: "1.25rem" },
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: COLORS.text.primary,
                            }}
                          >
                            {candidate.candidateId}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.65rem",
                              color: COLORS.text.tertiary,
                            }}
                          >
                            {candidate._id?.slice(-6)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: COLORS.primary,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          >
                            {candidate.firstName?.[0]}
                            {candidate.lastName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: COLORS.text.primary,
                              }}
                            >
                              {candidate.firstName} {candidate.lastName}
                            </Typography>
                            {candidate.dateOfBirth && (
                              <Typography
                                sx={{
                                  fontSize: "0.65rem",
                                  color: COLORS.text.tertiary,
                                }}
                              >
                                DOB: {formatDate(candidate.dateOfBirth)}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <EmailIcon
                              sx={{
                                fontSize: "0.7rem",
                                color: COLORS.text.tertiary,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                color: COLORS.text.primary,
                                maxWidth: 150,
                              }}
                              noWrap
                            >
                              {candidate.email}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <PhoneIcon
                              sx={{
                                fontSize: "0.7rem",
                                color: COLORS.text.tertiary,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: "0.65rem",
                                color: COLORS.text.tertiary,
                              }}
                            >
                              {candidate.phone}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {candidate.skills?.slice(0, 2).map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              size="small"
                              sx={{
                                bgcolor: COLORS.primaryLight,
                                color: COLORS.primaryDark,
                                fontSize: "0.6rem",
                                height: 20,
                                "& .MuiChip-label": {
                                  px: 1,
                                  fontSize: "0.6rem",
                                },
                              }}
                            />
                          ))}
                          {candidate.skills?.length > 2 && (
                            <Chip
                              label={`+${candidate.skills.length - 2}`}
                              size="small"
                              sx={{
                                bgcolor: COLORS.chips.inactive,
                                color: COLORS.text.secondary,
                                fontSize: "0.6rem",
                                height: 20,
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Badge
                          badgeContent={noteCount}
                          color="primary"
                          sx={{
                            "& .MuiBadge-badge": {
                              bgcolor: COLORS.primary,
                              fontSize: "0.6rem",
                              height: 18,
                              minWidth: 18,
                            },
                          }}
                        >
                          <Chip
                            icon={statusStyle.icon}
                            label={statusStyle.label}
                            size="small"
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 500,
                              fontSize: "0.65rem",
                              height: 24,
                              "& .MuiChip-icon": {
                                fontSize: "0.7rem",
                                color: statusStyle.color,
                              },
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "0.65rem",
                              },
                            }}
                          />
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          {getSourceIcon(candidate.source)}
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              color: COLORS.text.secondary,
                              textTransform: "capitalize",
                            }}
                          >
                            {candidate.source === "naukri"
                              ? "Naukri"
                              : candidate.source === "linkedin"
                                ? "LinkedIn"
                                : candidate.source === "indeed"
                                  ? "Indeed"
                                  : candidate.source === "walkin"
                                    ? "Walk-in"
                                    : candidate.source === "reference"
                                      ? "Reference"
                                      : candidate.source === "careerPage"
                                        ? "Career Page"
                                        : candidate.source === "other"
                                          ? "Other"
                                          : candidate.source || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              color: COLORS.text.secondary,
                            }}
                          >
                            {formatDate(candidate.createdAt)}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <PersonIcon
                              sx={{
                                fontSize: "0.65rem",
                                color: COLORS.text.tertiary,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: "0.65rem",
                                color: COLORS.text.tertiary,
                              }}
                            >
                              {candidate.createdByName}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          candidate={candidate}
                          onView={openViewCandidateModal}
                          onEdit={openEditCandidateModal}
                          onUpdateStatus={openStatusUpdateModal}
                          onAddNote={openAddNotesModalHandler}
                          onViewResume={handleViewResume}
                          onUploadResume={openUploadResumeModal}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, candidate)}
                          permissions={userPermissions}
                          isSuperAdmin={isSuperAdmin}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "0.7rem",
                color: COLORS.text.secondary,
              },
            "& .MuiTablePagination-select": { fontSize: "0.7rem" },
            "& .MuiTablePagination-actions button": { color: COLORS.primary },
          }}
        />
      </Paper>

      {/* Modal Components - Only render if user has appropriate permissions */}
      {(canCreate || isSuperAdmin) && (
        <AddCandidate
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddCandidate}
        />
      )}

      {(canUpdate || isSuperAdmin) && (
        <ResumeUpload
          open={openUploadModal}
          onClose={() => {
            setOpenUploadModal(false);
            setSelectedCandidate(null);
          }}
          onUpload={handleUploadResume}
          candidateId={selectedCandidate?.candidateId}
        />
      )}

      {selectedCandidate && (
        <>
          {(canViewPage || isSuperAdmin) && (
            <ViewCandidate
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedCandidate(null);
              }}
              candidateId={selectedCandidate?._id}
            />
          )}
          
          {(canUpdate || isSuperAdmin) && (
            <>
              <EditCandidate
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                onUpdate={handleCandidateUpdate}
                candidateId={selectedCandidate?._id}
                candidateData={selectedCandidate}
              />
              <UpdateCandidateStatus
                open={openStatusModal}
                onClose={() => {
                  setOpenStatusModal(false);
                  setSelectedCandidate(null);
                }}
                onUpdate={handleUpdateStatus}
                candidateId={selectedCandidate._id}
                candidateData={selectedCandidate}
              />
              <AddNotes
                open={openAddNotesModal}
                onClose={() => {
                  setOpenAddNotesModal(false);
                  setSelectedCandidate(null);
                }}
                onAdd={handleAddNote}
                candidateId={selectedCandidate._id}
                candidateData={selectedCandidate}
              />
            </>
          )}
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 1.5,
            fontSize: "0.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            "& .MuiAlert-icon": { fontSize: "1.25rem" },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CandidateMaster;