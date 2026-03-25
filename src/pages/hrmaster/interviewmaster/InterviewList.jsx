// import React, { useState, useEffect } from 'react';
// import {
//   // Layout components
//   Box,
//   Paper,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TableSortLabel,
  
//   // Form components
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   InputAdornment,
  
//   // Feedback components
//   Alert,
//   CircularProgress,
//   Skeleton,
  
//   // Data display
//   Typography,
//   Chip,
//   Avatar,
//   Badge,
//   Tooltip,
//   IconButton,
  
//   // Buttons and actions
//   Button,
//   ButtonGroup,
  
//   // Navigation
//   Link,
  
//   // Utils
//   Stack,
//   Card,
//   CardContent,
//   CardActions,
//   Divider,
//   Menu,
//   MenuItem as MenuItemMui,
//   useMediaQuery,
//   useTheme,
  
// } from '@mui/material';
// import { 
//   Add as AddIcon,
//   Refresh as RefreshIcon,
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   Clear as ClearIcon,
//   Visibility as VisibilityIcon,
//   Edit as EditIcon,
//   Cancel as CancelIcon,
//   Feedback as FeedbackIcon,
//   Schedule as ScheduleIcon,
//   MoreVert as MoreVertIcon,
//   Person as PersonIcon,
//   Work as WorkIcon,
//   VideoCall as VideoCallIcon,
//   LocationOn as LocationIcon,
//   Phone as PhoneIcon,
//   AccessTime as AccessTimeIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIconMui,
//   Event as EventIcon,
//   Download as DownloadIcon,
//   ViewModule as ViewModuleIcon,
//   ViewList as ViewListIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import ViewInterviewDetails from './ViewInterviewDetails';
// import ScheduleInterview from './ScheduleInterview';
// import RescheduleInterview from './RescheduleInterview';
// import InterviewFeedback from './InterviewFeedback';
// import CancelInterview from './CancelInterview';

// // Status color mapping
// const STATUS_COLORS = {
//   'scheduled': { bg: '#E3F2FD', color: '#1976D2', icon: <ScheduleIcon /> },
//   'completed': { bg: '#E8F5E9', color: '#2E7D32', icon: <CheckCircleIcon /> },
//   'cancelled': { bg: '#FFEBEE', color: '#C62828', icon: <CancelIconMui /> },
//   'rescheduled': { bg: '#FFF3E0', color: '#ED6C02', icon: <AccessTimeIcon /> },
//   'in_progress': { bg: '#F3E5F5', color: '#7B1FA2', icon: <AccessTimeIcon /> }
// };

// // Interview type icons
// const TYPE_ICONS = {
//   'video': <VideoCallIcon fontSize="small" />,
//   'phone': <PhoneIcon fontSize="small" />,
//   'in-person': <LocationIcon fontSize="small" />
// };

// const InterviewList = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
//   // View mode state (table/card)
//   const [viewMode, setViewMode] = useState('table');
  
//   // Data states
//   const [interviews, setInterviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
  
//   // Pagination states
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
  
//   // Sorting states
//   const [orderBy, setOrderBy] = useState('scheduledAt');
//   const [order, setOrder] = useState('desc');
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     search: '',
//     status: '',
//     type: '',
//     round: '',
//     dateFrom: '',
//     dateTo: ''
//   });
  
//   // Filter menu state
//   const [filterAnchorEl, setFilterAnchorEl] = useState(null);
//   const filterOpen = Boolean(filterAnchorEl);
  
//   // Action menu state
//   const [actionAnchorEl, setActionAnchorEl] = useState(null);
//   const [selectedInterview, setSelectedInterview] = useState(null);
//   const actionOpen = Boolean(actionAnchorEl);
  
//   // Dialog states
//   const [viewDialogOpen, setViewDialogOpen] = useState(false);
//   const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
//   const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
//   const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
//   // Interview rounds for filter
//   const interviewRounds = [
//   'Telephonic',
//   'Technical',
//   'HR', 
//   'Managerial',
//   'Final'
//   ];

//   // Interview types for filter
//   const interviewTypes = [
//     { value: 'video', label: 'Video Call' },
//     { value: 'phone', label: 'Phone Call' },
//     { value: 'in-person', label: 'In Person' }
//   ];

//   // Fetch interviews
//   const fetchInterviews = async (showRefreshing = false) => {
//     if (showRefreshing) {
//       setRefreshing(true);
//     } else {
//       setLoading(true);
//     }
    
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
      
//       // Build query params
//       const params = {
//         page: page + 1,
//         limit: rowsPerPage,
//         sortBy: orderBy,
//         sortOrder: order,
//         ...(filters.search && { search: filters.search }),
//         ...(filters.status && { status: filters.status }),
//         ...(filters.type && { type: filters.type }),
//         ...(filters.round && { round: filters.round }),
//         ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
//         ...(filters.dateTo && { dateTo: filters.dateTo })
//       };

//       const response = await axios.get(`${BASE_URL}/api/interviews`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         params
//       });

//       if (response.data.success) {
//         setInterviews(response.data.data || []);
//         setTotalItems(response.data.pagination?.totalItems || 0);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//       } else {
//         setError(response.data.message || 'Failed to fetch interviews');
//       }
//     } catch (err) {
//       console.error('Error fetching interviews:', err);
//       if (err.response) {
//         setError(err.response.data?.message || 'Failed to fetch interviews');
//       } else {
//         setError('Failed to fetch interviews. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchInterviews();
//   }, [page, rowsPerPage, orderBy, order]);

//   // Fetch when filters change (with debounce)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (page !== 0) {
//         setPage(0);
//       } else {
//         fetchInterviews();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [filters]);

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       search: '',
//       status: '',
//       type: '',
//       round: '',
//       dateFrom: '',
//       dateTo: ''
//     });
//     setFilterAnchorEl(null);
//   };

//   const handleFilterClick = (event) => {
//     setFilterAnchorEl(event.currentTarget);
//   };

//   const handleFilterClose = () => {
//     setFilterAnchorEl(null);
//   };

//   const handleActionClick = (event, interview) => {
//     setSelectedInterview(interview);
//     setActionAnchorEl(event.currentTarget);
//   };

//   const handleActionClose = () => {
//     setActionAnchorEl(null);
//   };

//   const handleViewDetails = () => {
//     setViewDialogOpen(true);
//     handleActionClose();
//   };

//   const handleReschedule = () => {
//     setRescheduleDialogOpen(true);
//     handleActionClose();
//   };

//   const handleFeedback = () => {
//     setFeedbackDialogOpen(true);
//     handleActionClose();
//   };

//   const handleCancel = () => {
//     setCancelDialogOpen(true);
//     handleActionClose();
//   };

//   const handleRefresh = () => {
//     fetchInterviews(true);
//   };

//   const handleAddSuccess = (newInterview) => {
//     fetchInterviews();
//     setScheduleDialogOpen(false);
//   };

//   const handleRescheduleSuccess = (updatedInterview) => {
//     fetchInterviews();
//     setRescheduleDialogOpen(false);
//     setSelectedInterview(null);
//   };

//   const handleFeedbackSuccess = (updatedInterview) => {
//     fetchInterviews();
//     setFeedbackDialogOpen(false);
//     setSelectedInterview(null);
//   };

//   const handleCancelSuccess = (cancelledInterview) => {
//     fetchInterviews();
//     setCancelDialogOpen(false);
//     setSelectedInterview(null);
//   };

//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return 'N/A';
//     return new Date(dateTimeString).toLocaleString('en-US', {
//       dateStyle: 'medium',
//       timeStyle: 'short'
//     });
//   };

//   const getStatusChip = (status) => {
//     const config = STATUS_COLORS[status] || { bg: '#F5F5F5', color: '#666', icon: <EventIcon /> };
    
//     return (
//       <Chip
//         label={status?.replace('_', ' ').toUpperCase()}
//         size="small"
//         icon={config.icon}
//         sx={{
//           backgroundColor: config.bg,
//           color: config.color,
//           fontWeight: 500,
//           '& .MuiChip-icon': {
//             color: config.color
//           }
//         }}
//       />
//     );
//   };

//   const getCandidateName = (interview) => {
//     if (interview.applicationId?.candidateId) {
//       const candidate = interview.applicationId.candidateId;
//       return candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'N/A';
//     }
//     return interview.candidateId?.fullName || 'N/A';
//   };

//   const getCandidateEmail = (interview) => {
//     return interview.applicationId?.candidateId?.email || interview.candidateId?.email || 'N/A';
//   };

//   const getJobTitle = (interview) => {
//     return interview.applicationId?.jobId?.title || interview.jobId?.title || 'N/A';
//   };

//   const renderTableSkeleton = () => {
//     return [...Array(rowsPerPage)].map((_, index) => (
//       <TableRow key={index}>
//         <TableCell><Skeleton variant="text" /></TableCell>
//         <TableCell><Skeleton variant="text" /></TableCell>
//         <TableCell><Skeleton variant="text" /></TableCell>
//         <TableCell><Skeleton variant="text" /></TableCell>
//         <TableCell><Skeleton variant="text" /></TableCell>
//         <TableCell><Skeleton variant="text" /></TableCell>
//         <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
//       </TableRow>
//     ));
//   };

//   const renderCardSkeleton = () => {
//     return [...Array(4)].map((_, index) => (
//       <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
//         <Card sx={{ borderRadius: 1 }}>
//           <CardContent>
//             <Skeleton variant="text" width="60%" />
//             <Skeleton variant="text" width="80%" />
//             <Skeleton variant="text" width="40%" />
//             <Box sx={{ mt: 2 }}>
//               <Skeleton variant="rectangular" height={36} />
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>
//     ));
//   };

//   const renderTableHeader = () => {
//     const headers = [
//       { id: 'interviewId', label: 'Interview ID' },
//       { id: 'candidate', label: 'Candidate' },
//       { id: 'job', label: 'Job Position' },
//       { id: 'round', label: 'Round' },
//       { id: 'scheduledAt', label: 'Scheduled Time' },
//       { id: 'status', label: 'Status' },
//       { id: 'actions', label: 'Actions', sortable: false }
//     ];

//     return (
//       <TableHead>
//         <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
//           {headers.map((header) => (
//             <TableCell 
//               key={header.id}
//               sortDirection={orderBy === header.id ? order : false}
//               sx={{ fontWeight: 600 }}
//             >
//               {header.sortable !== false ? (
//                 <TableSortLabel
//                   active={orderBy === header.id}
//                   direction={orderBy === header.id ? order : 'asc'}
//                   onClick={() => handleRequestSort(header.id)}
//                 >
//                   {header.label}
//                 </TableSortLabel>
//               ) : (
//                 header.label
//               )}
//             </TableCell>
//           ))}
//         </TableRow>
//       </TableHead>
//     );
//   };

//   const renderTableBody = () => {
//     if (loading) {
//       return renderTableSkeleton();
//     }

//     if (interviews.length === 0) {
//       return (
//         <TableRow>
//           <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//             <Typography variant="body2" color="textSecondary">
//               No interviews found
//             </Typography>
//           </TableCell>
//         </TableRow>
//       );
//     }

//     return interviews.map((interview) => (
//       <TableRow key={interview._id} hover>
//         <TableCell>
//           <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
//             {interview.interviewId || interview._id.slice(-6).toUpperCase()}
//           </Typography>
//         </TableCell>
//         <TableCell>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976D2' }}>
//               {getCandidateName(interview).charAt(0)}
//             </Avatar>
//             <Box>
//               <Typography variant="body2" fontWeight={500}>
//                 {getCandidateName(interview)}
//               </Typography>
//               <Typography variant="caption" color="textSecondary">
//                 {getCandidateEmail(interview)}
//               </Typography>
//             </Box>
//           </Box>
//         </TableCell>
//         <TableCell>
//           <Typography variant="body2">{getJobTitle(interview)}</Typography>
//         </TableCell>
//         <TableCell>
//           <Typography variant="body2">{interview.round}</Typography>
//         </TableCell>
//         <TableCell>
//           <Box>
//             <Typography variant="body2">
//               {formatDateTime(interview.scheduledAt)}
//             </Typography>
//             <Typography variant="caption" color="textSecondary">
//               {interview.duration} min • {interview.type}
//             </Typography>
//           </Box>
//         </TableCell>
//         <TableCell>
//           {getStatusChip(interview.status)}
//           {interview.feedback && (
//             <Chip
//               label="Feedback"
//               size="small"
//               icon={<FeedbackIcon />}
//               sx={{ 
//                 ml: 0.5,
//                 backgroundColor: '#F3E5F5',
//                 color: '#7B1FA2',
//                 '& .MuiChip-icon': { color: '#7B1FA2' }
//               }}
//             />
//           )}
//         </TableCell>
//         <TableCell>
//           <Box sx={{ display: 'flex', gap: 0.5 }}>
//             <Tooltip title="View Details">
//               <IconButton 
//                 size="small" 
//                 onClick={() => {
//                   setSelectedInterview(interview);
//                   setViewDialogOpen(true);
//                 }}
//               >
//                 <VisibilityIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//             {interview.status === 'scheduled' && (
//               <>
//                 <Tooltip title="Reschedule">
//                   <IconButton 
//                     size="small"
//                     onClick={() => {
//                       setSelectedInterview(interview);
//                       setRescheduleDialogOpen(true);
//                     }}
//                   >
//                     <EditIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Submit Feedback">
//                   <IconButton 
//                     size="small"
//                     onClick={() => {
//                       setSelectedInterview(interview);
//                       setFeedbackDialogOpen(true);
//                     }}
//                   >
//                     <FeedbackIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Cancel Interview">
//                   <IconButton 
//                     size="small"
//                     onClick={() => {
//                       setSelectedInterview(interview);
//                       setCancelDialogOpen(true);
//                     }}
//                   >
//                     <CancelIconMui fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//               </>
//             )}
//             {interview.status === 'completed' && !interview.feedback && (
//               <Tooltip title="Submit Feedback">
//                 <IconButton 
//                   size="small"
//                   onClick={() => {
//                     setSelectedInterview(interview);
//                     setFeedbackDialogOpen(true);
//                   }}
//                 >
//                   <FeedbackIcon fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             )}
//           </Box>
//         </TableCell>
//       </TableRow>
//     ));
//   };

//   const renderCardView = () => {
//     if (loading) {
//       return renderCardSkeleton();
//     }

//     if (interviews.length === 0) {
//       return (
//         <Box sx={{ textAlign: 'center', py: 4 }}>
//           <Typography variant="body2" color="textSecondary">
//             No interviews found
//           </Typography>
//         </Box>
//       );
//     }

//     return interviews.map((interview) => (
//       <Grid size={{ xs: 12, sm: 6, md: 4 }} key={interview._id}>
//         <Card 
//           sx={{ 
//             borderRadius: 1,
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             '&:hover': {
//               boxShadow: 3
//             }
//           }}
//         >
//           <CardContent sx={{ flex: 1 }}>
//             {/* Header */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
//               <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#666' }}>
//                 {interview.interviewId || interview._id.slice(-6).toUpperCase()}
//               </Typography>
//               {getStatusChip(interview.status)}
//             </Box>

//             {/* Candidate Info */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//               <Avatar sx={{ width: 40, height: 40, bgcolor: '#1976D2' }}>
//                 {getCandidateName(interview).charAt(0)}
//               </Avatar>
//               <Box>
//                 <Typography variant="body2" fontWeight={600}>
//                   {getCandidateName(interview)}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary">
//                   {getCandidateEmail(interview)}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Job Details */}
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="caption" color="textSecondary">
//                 Position
//               </Typography>
//               <Typography variant="body2" fontWeight={500}>
//                 {getJobTitle(interview)}
//               </Typography>
//             </Box>

//             {/* Interview Details */}
//             <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
//               <Chip
//                 label={interview.round}
//                 size="small"
//                 variant="outlined"
//               />
//               <Chip
//                 label={interview.type}
//                 size="small"
//                 icon={TYPE_ICONS[interview.type]}
//                 variant="outlined"
//               />
//               <Chip
//                 label={`${interview.duration} min`}
//                 size="small"
//                 icon={<AccessTimeIcon />}
//                 variant="outlined"
//               />
//             </Box>

//             {/* Schedule */}
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="caption" color="textSecondary">
//                 Scheduled
//               </Typography>
//               <Typography variant="body2">
//                 {formatDateTime(interview.scheduledAt)}
//               </Typography>
//             </Box>

//             {/* Feedback Indicator */}
//             {interview.feedback && (
//               <Box sx={{ mt: 2 }}>
//                 <Chip
//                   label="Feedback Submitted"
//                   size="small"
//                   icon={<FeedbackIcon />}
//                   sx={{ 
//                     backgroundColor: '#F3E5F5',
//                     color: '#7B1FA2',
//                     '& .MuiChip-icon': { color: '#7B1FA2' }
//                   }}
//                 />
//               </Box>
//             )}
//           </CardContent>

//           <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
//             <Button 
//               size="small" 
//               startIcon={<VisibilityIcon />}
//               onClick={() => {
//                 setSelectedInterview(interview);
//                 setViewDialogOpen(true);
//               }}
//             >
//               View
//             </Button>
//             {interview.status === 'scheduled' && (
//               <>
//                 <Button 
//                   size="small" 
//                   color="primary"
//                   onClick={() => {
//                     setSelectedInterview(interview);
//                     setRescheduleDialogOpen(true);
//                   }}
//                 >
//                   Reschedule
//                 </Button>
//                 <Button 
//                   size="small" 
//                   color="error"
//                   onClick={() => {
//                     setSelectedInterview(interview);
//                     setCancelDialogOpen(true);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </>
//             )}
//           </CardActions>
//         </Card>
//       </Grid>
//     ));
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       {/* Header */}
//       <Paper sx={{ p: 2, mb: 2, borderRadius: 1, border: '1px solid #E0E0E0' }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Typography variant="h6" sx={{ fontWeight: 600 }}>
//               Interview Management
//             </Typography>
//             <Typography variant="caption" color="textSecondary">
//               Schedule and manage candidate interviews
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box sx={{ display: 'flex', gap: 1, justifyContent: { md: 'flex-end' } }}>
//               <Button
//                 variant="outlined"
//                 startIcon={<RefreshIcon />}
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 size="small"
//               >
//                 {refreshing ? 'Refreshing...' : 'Refresh'}
//               </Button>
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={() => setScheduleDialogOpen(true)}
//                 size="small"
//                 sx={{
//                   backgroundColor: '#1976D2',
//                   '&:hover': { backgroundColor: '#1565C0' }
//                 }}
//               >
//                 Schedule Interview
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Filters Bar */}
//       <Paper sx={{ p: 2, mb: 2, borderRadius: 1, border: '1px solid #E0E0E0' }}>
//         <Grid container spacing={1.5} alignItems="center">
//           {/* Search */}
//           <Grid size={{ xs: 12, md: 4 }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Search by candidate, email, interview ID..."
//               name="search"
//               value={filters.search}
//               onChange={handleFilterChange}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon fontSize="small" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: filters.search && (
//                   <InputAdornment position="end">
//                     <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
//                       <ClearIcon fontSize="small" />
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//             />
//           </Grid>

//           {/* Status Filter */}
//           <Grid size={{ xs: 12, sm: 6, md: 2 }}>
//             <FormControl fullWidth size="small">
//               <InputLabel>Status</InputLabel>
//               <Select
//                 name="status"
//                 value={filters.status}
//                 onChange={handleFilterChange}
//                 label="Status"
//               >
//                 <MenuItem value="">All</MenuItem>
//                 <MenuItem value="scheduled">Scheduled</MenuItem>
//                 <MenuItem value="completed">Completed</MenuItem>
//                 <MenuItem value="cancelled">Cancelled</MenuItem>
//                 <MenuItem value="rescheduled">Rescheduled</MenuItem>
//                 <MenuItem value="in_progress">In Progress</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Type Filter */}
//           <Grid size={{ xs: 12, sm: 6, md: 2 }}>
//             <FormControl fullWidth size="small">
//               <InputLabel>Type</InputLabel>
//               <Select
//                 name="type"
//                 value={filters.type}
//                 onChange={handleFilterChange}
//                 label="Type"
//               >
//                 <MenuItem value="">All</MenuItem>
//                 {interviewTypes.map(type => (
//                   <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Round Filter */}
//           <Grid size={{ xs: 12, sm: 6, md: 2 }}>
//             <FormControl fullWidth size="small">
//               <InputLabel>Round</InputLabel>
//               <Select
//                 name="round"
//                 value={filters.round}
//                 onChange={handleFilterChange}
//                 label="Round"
//               >
//                 <MenuItem value="">All</MenuItem>
//                 {interviewRounds.map(round => (
//                   <MenuItem key={round} value={round}>{round}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* View Toggle */}
//           <Grid size={{ xs: 12, sm: 6, md: 2 }}>
//             <Box sx={{ display: 'flex', gap: 0.5 }}>
//               <Tooltip title="Table View">
//                 <IconButton 
//                   onClick={() => setViewMode('table')}
//                   color={viewMode === 'table' ? 'primary' : 'default'}
//                 >
//                   <ViewListIcon />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Card View">
//                 <IconButton 
//                   onClick={() => setViewMode('card')}
//                   color={viewMode === 'card' ? 'primary' : 'default'}
//                 >
//                   <ViewModuleIcon />
//                 </IconButton>
//               </Tooltip>
//               {(filters.status || filters.type || filters.round || filters.dateFrom || filters.dateTo) && (
//                 <Tooltip title="Clear Filters">
//                   <IconButton onClick={handleClearFilters} size="small">
//                     <ClearIcon />
//                   </IconButton>
//                 </Tooltip>
//               )}
//             </Box>
//           </Grid>
//         </Grid>

//         {/* Advanced Filters */}
//         <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//           <TextField
//             size="small"
//             type="date"
//             label="From Date"
//             name="dateFrom"
//             value={filters.dateFrom}
//             onChange={handleFilterChange}
//             InputLabelProps={{ shrink: true }}
//             sx={{ width: 200 }}
//           />
//           <TextField
//             size="small"
//             type="date"
//             label="To Date"
//             name="dateTo"
//             value={filters.dateTo}
//             onChange={handleFilterChange}
//             InputLabelProps={{ shrink: true }}
//             sx={{ width: 200 }}
//           />
//         </Box>
//       </Paper>

//       {/* Error Display */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Table View */}
//       {viewMode === 'table' ? (
//         <Paper sx={{ borderRadius: 1, border: '1px solid #E0E0E0', overflow: 'hidden' }}>
//           <TableContainer>
//             <Table stickyHeader size="small">
//               {renderTableHeader()}
//               <TableBody>
//                 {renderTableBody()}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25, 50]}
//             component="div"
//             count={totalItems}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
//       ) : (
//         /* Card View */
//         <>
//           <Grid container spacing={2}>
//             {renderCardView()}
//           </Grid>
//           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//             <TablePagination
//               rowsPerPageOptions={[6, 12, 24, 48]}
//               component="div"
//               count={totalItems}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </Box>
//         </>
//       )}

//       {/* Dialogs */}
//       <ViewInterviewDetails
//         open={viewDialogOpen}
//         onClose={() => setViewDialogOpen(false)}
//         interviewId={selectedInterview?._id}
//       />

//       <ScheduleInterview
//         open={scheduleDialogOpen}
//         onClose={() => setScheduleDialogOpen(false)}
//         onAdd={handleAddSuccess}
//       />

//       {selectedInterview && (
//         <>
//           <RescheduleInterview
//             open={rescheduleDialogOpen}
//             onClose={() => {
//               setRescheduleDialogOpen(false);
//               setSelectedInterview(null);
//             }}
//             onReschedule={handleRescheduleSuccess}
//             interviewData={selectedInterview}
//           />

//           <InterviewFeedback
//             open={feedbackDialogOpen}
//             onClose={() => {
//               setFeedbackDialogOpen(false);
//               setSelectedInterview(null);
//             }}
//             onSubmit={handleFeedbackSuccess}
//             interviewData={selectedInterview}
//           />

//           <CancelInterview
//             open={cancelDialogOpen}
//             onClose={() => {
//               setCancelDialogOpen(false);
//               setSelectedInterview(null);
//             }}
//             onCancel={handleCancelSuccess}
//             interviewData={selectedInterview}
//           />
//         </>
//       )}
//     </Box>
//   );
// };

// export default InterviewList;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Skeleton,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Button,
  Stack,
  Card,
  CardContent,
  CardActions,
  Divider,
  Menu,
  MenuItem as MenuItemMui,
  useMediaQuery,
  useTheme,
  Badge,
  Collapse,
  InputBase,
  alpha
} from '@mui/material';
import { 
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Feedback as FeedbackIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  VideoCall as VideoCallIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Download as DownloadIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import ViewInterviewDetails from './ViewInterviewDetails';
import ScheduleInterview from './ScheduleInterview';
import RescheduleInterview from './RescheduleInterview';
import InterviewFeedback from './InterviewFeedback';
import CancelInterview from './CancelInterview';

// Color constants matching other components
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
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// Status color mapping
const STATUS_COLORS = {
  'scheduled': { bg: COLORS.status.info, color: COLORS.primaryDark, icon: <ScheduleIcon sx={{ fontSize: '0.7rem' }} /> },
  'completed': { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
  'cancelled': { bg: COLORS.status.error, color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> },
  'rescheduled': { bg: COLORS.status.warning, color: '#92400E', icon: <AccessTimeIcon sx={{ fontSize: '0.7rem' }} /> },
  'in_progress': { bg: '#F3E5F5', color: '#7B1FA2', icon: <AccessTimeIcon sx={{ fontSize: '0.7rem' }} /> }
};

// Interview type icons
const TYPE_ICONS = {
  'video': <VideoCallIcon sx={{ fontSize: '0.7rem' }} />,
  'telephonic': <PhoneIcon sx={{ fontSize: '0.7rem' }} />,
  'in-person': <LocationIcon sx={{ fontSize: '0.7rem' }} />
};

const InterviewList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [viewMode, setViewMode] = useState('table');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  
  const [orderBy, setOrderBy] = useState('scheduledAt');
  const [order, setOrder] = useState('desc');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    round: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  const interviewRounds = ['Telephonic', 'Technical', 'HR', 'Managerial', 'Final'];
  
  const interviewTypes = [
    { value: 'video', label: 'Video Call' },
    { value: 'telephonic', label: 'Phone Call' },
    { value: 'in-person', label: 'In Person' }
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch interviews
  const fetchInterviews = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        ...(filters.round && { round: filters.round })
      };

      const response = await axios.get(`${BASE_URL}/api/interviews`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setInterviews(response.data.data || []);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setError(response.data.message || 'Failed to fetch interviews');
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError(err.response?.data?.message || 'Failed to fetch interviews. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [page, rowsPerPage, orderBy, order, searchTerm, filters.status, filters.type, filters.round]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({ status: '', type: '', round: '' });
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
  };

  const handleActionClick = (event, interview) => {
    setSelectedInterview(interview);
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
  };

  const handleRefresh = () => {
    fetchInterviews(true);
  };

  const handleAddSuccess = () => {
    fetchInterviews();
    setScheduleDialogOpen(false);
  };

  const handleRescheduleSuccess = () => {
    fetchInterviews();
    setRescheduleDialogOpen(false);
    setSelectedInterview(null);
  };

  const handleFeedbackSuccess = () => {
    fetchInterviews();
    setFeedbackDialogOpen(false);
    setSelectedInterview(null);
  };

  const handleCancelSuccess = () => {
    fetchInterviews();
    setCancelDialogOpen(false);
    setSelectedInterview(null);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusChip = (status) => {
    const config = STATUS_COLORS[status] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <EventIcon sx={{ fontSize: '0.7rem' }} /> };
    
    return (
      <Chip
        label={status?.replace('_', ' ').toUpperCase()}
        size="small"
        icon={config.icon}
        sx={{
          bgcolor: config.bg,
          color: config.color,
          fontWeight: 500,
          fontSize: '0.65rem',
          height: 24,
          '& .MuiChip-icon': { fontSize: '0.7rem', color: config.color },
          '& .MuiChip-label': { px: 1, fontSize: '0.65rem' }
        }}
      />
    );
  };

  const getCandidateName = (interview) => {
    if (interview.applicationId?.candidateId) {
      const candidate = interview.applicationId.candidateId;
      return candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'N/A';
    }
    return interview.candidateId?.fullName || 'N/A';
  };

  const getCandidateEmail = (interview) => {
    return interview.applicationId?.candidateId?.email || interview.candidateId?.email || 'N/A';
  };

  const getJobTitle = (interview) => {
    return interview.applicationId?.jobId?.title || interview.jobId?.title || 'N/A';
  };

  const isFilterActive = filters.status || filters.type || filters.round || searchTerm;

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': {
        color: COLORS.text.tertiary,
        fontSize: '0.75rem'
      }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
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
          Interview Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Schedule and manage candidate interviews
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by candidate, email, interview ID..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 280 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchInput('')} edge="end">
                      <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary
                  }
                }
              }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: '0.75rem' }}>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
                sx={{
                  borderRadius: 1.5,
                  height: 36,
                  '& .MuiSelect-select': {
                    fontSize: '0.75rem',
                    py: 1,
                    px: 1.5
                  }
                }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Status</MenuItem>
                <MenuItem value="scheduled" sx={{ fontSize: '0.75rem' }}>Scheduled</MenuItem>
                <MenuItem value="completed" sx={{ fontSize: '0.75rem' }}>Completed</MenuItem>
                <MenuItem value="cancelled" sx={{ fontSize: '0.75rem' }}>Cancelled</MenuItem>
                <MenuItem value="rescheduled" sx={{ fontSize: '0.75rem' }}>Rescheduled</MenuItem>
                <MenuItem value="in_progress" sx={{ fontSize: '0.75rem' }}>In Progress</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: '0.75rem' }}>Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Type"
                sx={{
                  borderRadius: 1.5,
                  height: 36,
                  '& .MuiSelect-select': {
                    fontSize: '0.75rem',
                    py: 1,
                    px: 1.5
                  }
                }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Types</MenuItem>
                {interviewTypes.map(type => (
                  <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: '0.75rem' }}>Round</InputLabel>
              <Select
                name="round"
                value={filters.round}
                onChange={handleFilterChange}
                label="Round"
                sx={{
                  borderRadius: 1.5,
                  height: 36,
                  '& .MuiSelect-select': {
                    fontSize: '0.75rem',
                    py: 1,
                    px: 1.5
                  }
                }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Rounds</MenuItem>
                {interviewRounds.map(round => (
                  <MenuItem key={round} value={round} sx={{ fontSize: '0.75rem' }}>{round}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {isFilterActive && (
              <Button
                variant="text"
                startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleClearFilters}
                sx={{ 
                  height: 36,
                  borderRadius: 1.5,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  color: COLORS.text.secondary
                }}
              >
                Clear Filters
              </Button>
            )}

            <Box sx={{ display: 'flex', gap: 0.5, ml: { sm: 'auto' } }}>
              <Tooltip title="Table View">
                <IconButton 
                  onClick={() => setViewMode('table')}
                  size="small"
                  sx={{ 
                    color: viewMode === 'table' ? COLORS.primary : COLORS.text.secondary,
                    '&:hover': { bgcolor: `${COLORS.primary}10` }
                  }}
                >
                  <ViewListIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Card View">
                <IconButton 
                  onClick={() => setViewMode('card')}
                  size="small"
                  sx={{ 
                    color: viewMode === 'card' ? COLORS.primary : COLORS.text.secondary,
                    '&:hover': { bgcolor: `${COLORS.primary}10` }
                  }}
                >
                  <ViewModuleIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': { bgcolor: `${COLORS.primary}10` }
                }}
              >
                <RefreshIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => setScheduleDialogOpen(true)}
              sx={{
                height: 36,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Schedule Interview
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2.5, 
            borderRadius: 1.5,
            '& .MuiAlert-icon': { fontSize: '1.25rem' },
            fontSize: '0.75rem',
            py: 0.5
          }}
        >
          {error}
        </Alert>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
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
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    <TableSortLabel
                      active={orderBy === 'interviewId'}
                      direction={orderBy === 'interviewId' ? order : 'asc'}
                      onClick={() => handleRequestSort('interviewId')}
                      sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                    >
                      Interview ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    <TableSortLabel
                      active={orderBy === 'candidate'}
                      direction={orderBy === 'candidate' ? order : 'asc'}
                      onClick={() => handleRequestSort('candidate')}
                      sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                    >
                      Candidate
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Job Position
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Round
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    <TableSortLabel
                      active={orderBy === 'scheduledAt'}
                      direction={orderBy === 'scheduledAt' ? order : 'asc'}
                      onClick={() => handleRequestSort('scheduledAt')}
                      sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                    >
                      Scheduled Time
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 100 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(rowsPerPage)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell><Skeleton variant="text" width={150} /></TableCell>
                      <TableCell><Skeleton variant="text" width={120} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell><Skeleton variant="text" width={150} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
                    </TableRow>
                  ))
                ) : interviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <ScheduleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                        <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                          {isFilterActive ? 'No interviews match your filters' : 'No interviews found'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                          {isFilterActive ? 'Try adjusting your search or filters' : 'Schedule your first interview to get started'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  interviews.map((interview) => (
                    <TableRow
                      key={interview._id}
                      hover
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border }
                      }}
                    >
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                          {interview.interviewId || interview._id.slice(-6).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
                            {getCandidateName(interview).charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                              {getCandidateName(interview)}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {getCandidateEmail(interview)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {getJobTitle(interview)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={interview.round}
                          size="small"
                          sx={{
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primaryDark,
                            fontWeight: 500,
                            fontSize: '0.65rem',
                            height: 24
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDateTime(interview.scheduledAt)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {interview.duration} min • {interview.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {getStatusChip(interview.status)}
                          {interview.feedback && (
                            <Tooltip title="Feedback Submitted">
                              <FeedbackIcon sx={{ fontSize: '0.7rem', color: '#7B1FA2' }} />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Actions">
                          <IconButton
                            size="small"
                            onClick={(e) => handleActionClick(e, interview)}
                            sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}
                          >
                            <MoreVertIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
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
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: '0.7rem',
                color: COLORS.text.secondary
              },
              '& .MuiTablePagination-select': { fontSize: '0.7rem' },
              '& .MuiTablePagination-actions button': { color: COLORS.primary }
            }}
          />
        </Paper>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <>
          <Grid container spacing={2}>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                    <CardContent>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                      <Box sx={{ mt: 2 }}>
                        <Skeleton variant="rectangular" height={36} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : interviews.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <ScheduleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                  <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                    {isFilterActive ? 'No interviews match your filters' : 'No interviews found'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    {isFilterActive ? 'Try adjusting your search or filters' : 'Schedule your first interview to get started'}
                  </Typography>
                </Box>
              </Grid>
            ) : (
              interviews.map((interview) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={interview._id}>
                  <Card 
                    sx={{ 
                      borderRadius: 2,
                      border: `1px solid ${COLORS.border}`,
                      boxShadow: 'none',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', fontFamily: 'monospace', color: COLORS.text.tertiary }}>
                          {interview.interviewId || interview._id.slice(-6).toUpperCase()}
                        </Typography>
                        {getStatusChip(interview.status)}
                      </Box>

                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ width: 48, height: 48, bgcolor: COLORS.primary }}>
                          {getCandidateName(interview).charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {getCandidateName(interview)}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {getCandidateEmail(interview)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.25 }}>Position</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {getJobTitle(interview)}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip
                          label={interview.round}
                          size="small"
                          sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }}
                        />
                        <Chip
                          label={interview.type}
                          size="small"
                          icon={TYPE_ICONS[interview.type]}
                          sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }}
                        />
                        <Chip
                          label={`${interview.duration} min`}
                          size="small"
                          icon={<AccessTimeIcon sx={{ fontSize: '0.7rem' }} />}
                          sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }}
                        />
                      </Stack>

                      <Box sx={{ mt: 1.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.25 }}>Scheduled</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {formatDateTime(interview.scheduledAt)}
                        </Typography>
                      </Box>

                      {interview.feedback && (
                        <Box sx={{ mt: 1.5 }}>
                          <Chip
                            label="Feedback Submitted"
                            size="small"
                            icon={<FeedbackIcon sx={{ fontSize: '0.7rem' }} />}
                            sx={{ bgcolor: '#F3E5F5', color: '#7B1FA2', fontSize: '0.65rem', height: 24 }}
                          />
                        </Box>
                      )}
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon sx={{ fontSize: '0.9rem' }} />}
                        onClick={() => {
                          setSelectedInterview(interview);
                          setViewDialogOpen(true);
                        }}
                        sx={{ fontSize: '0.7rem', textTransform: 'none', color: COLORS.text.secondary }}
                      >
                        View Details
                      </Button>
                      {interview.status === 'scheduled' && (
                        <>
                          <Button 
                            size="small" 
                            startIcon={<EditIcon sx={{ fontSize: '0.9rem' }} />}
                            onClick={() => {
                              setSelectedInterview(interview);
                              setRescheduleDialogOpen(true);
                            }}
                            sx={{ fontSize: '0.7rem', textTransform: 'none', color: COLORS.primary }}
                          >
                            Reschedule
                          </Button>
                          <Button 
                            size="small" 
                            startIcon={<CancelIcon sx={{ fontSize: '0.9rem' }} />}
                            onClick={() => {
                              setSelectedInterview(interview);
                              setCancelDialogOpen(true);
                            }}
                            sx={{ fontSize: '0.7rem', textTransform: 'none', color: '#EF4444' }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
          {interviews.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <TablePagination
                rowsPerPageOptions={[6, 12, 24, 48]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    fontSize: '0.7rem',
                    color: COLORS.text.secondary
                  },
                  '& .MuiTablePagination-select': { fontSize: '0.7rem' },
                  '& .MuiTablePagination-actions button': { color: COLORS.primary }
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
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
        <MenuItemMui 
          onClick={handleViewDetails}
          sx={{ py: 1.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <VisibilityIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
              View Details
            </Typography>
          </Stack>
        </MenuItemMui>

        {selectedInterview?.status === 'scheduled' && (
          <>
            <MenuItemMui 
              onClick={handleReschedule}
              sx={{ py: 1.5 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <EditIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  Reschedule
                </Typography>
              </Stack>
            </MenuItemMui>

            <MenuItemMui 
              onClick={handleFeedback}
              sx={{ py: 1.5 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <FeedbackIcon sx={{ fontSize: '1rem', color: '#7B1FA2' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  Submit Feedback
                </Typography>
              </Stack>
            </MenuItemMui>

            <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

            <MenuItemMui 
              onClick={handleCancel}
              sx={{ py: 1.5 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CancelIcon sx={{ fontSize: '1rem', color: '#EF4444' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
                  Cancel Interview
                </Typography>
              </Stack>
            </MenuItemMui>
          </>
        )}

        {selectedInterview?.status === 'completed' && !selectedInterview?.feedback && (
          <MenuItemMui 
            onClick={handleFeedback}
            sx={{ py: 1.5 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <FeedbackIcon sx={{ fontSize: '1rem', color: '#7B1FA2' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                Submit Feedback
              </Typography>
            </Stack>
          </MenuItemMui>
        )}
      </Menu>

      {/* Dialogs */}
      <ViewInterviewDetails
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        interviewId={selectedInterview?._id}
      />

      <ScheduleInterview
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        onAdd={handleAddSuccess}
      />

      {selectedInterview && (
        <>
          <RescheduleInterview
            open={rescheduleDialogOpen}
            onClose={() => {
              setRescheduleDialogOpen(false);
              setSelectedInterview(null);
            }}
            onReschedule={handleRescheduleSuccess}
            interviewData={selectedInterview}
          />

          <InterviewFeedback
            open={feedbackDialogOpen}
            onClose={() => {
              setFeedbackDialogOpen(false);
              setSelectedInterview(null);
            }}
            onSubmit={handleFeedbackSuccess}
            interviewData={selectedInterview}
          />

          <CancelInterview
            open={cancelDialogOpen}
            onClose={() => {
              setCancelDialogOpen(false);
              setSelectedInterview(null);
            }}
            onCancel={handleCancelSuccess}
            interviewData={selectedInterview}
          />
        </>
      )}
    </Box>
  );
};

export default InterviewList;