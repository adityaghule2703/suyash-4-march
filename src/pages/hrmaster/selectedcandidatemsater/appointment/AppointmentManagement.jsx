// // import React, { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   IconButton,
// //   Button,
// //   TextField,
// //   InputAdornment,
// //   Typography,
// //   Snackbar,
// //   TablePagination,
// //   Stack,
// //   Alert,
// //   Chip,
// //   Menu,
// //   MenuItem,
// //   ListItemIcon,
// //   ListItemText,
// //   Divider,
// //   Avatar,
// //   Tooltip,
// //   Checkbox,
// //   alpha,
// //   CircularProgress
// // } from "@mui/material";

// // import {
// //   Search as SearchIcon,
// //   FilterList as FilterIcon,
// //   Add as AddIcon,
// //   MoreVert as MoreVertIcon,
// //   Sort as SortIcon,
// //   Description as DescriptionIcon,
// //   Send as SendIcon,
// //   CheckCircle as CheckCircleIcon,
// //   Refresh as RefreshIcon,
// //   Email as EmailIcon,
// //   Phone as PhoneIcon,
// //   Download as DownloadIcon,
// //   Delete as DeleteIcon,
// //   ArrowUpward as ArrowUpwardIcon,
// //   Assignment as AssignmentIcon,
// //   AccessTime as AccessTimeIcon,
// //   Error as ErrorIcon,
// //   Visibility as VisibilityIcon
// // } from "@mui/icons-material";

// // import axios from "axios";
// // import BASE_URL from "../../../../config/Config";

// // /* COMPONENTS */
// // import GenerateAppointmentLetter from "./GenerateAppointmentLetter";
// // import SendAppointmentLetter from "./SendAppointmentLetter";
// // import AcceptAppointmentLetter from "./Accept";

// // const HEADER_GRADIENT =
// //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// // const PRIMARY_BLUE = "#00B4D8";
// // const TEXT_COLOR_HEADER = '#FFFFFF';
// // const STRIPE_COLOR_ODD = '#FFFFFF';
// // const STRIPE_COLOR_EVEN = '#f8fafc';
// // const HOVER_COLOR = '#f1f5f9';

// // // Status color mapping
// // const getStatusColor = (status) => {
// //   switch (status?.toLowerCase()) {
// //     case 'generated':
// //       return { bg: '#fef3c7', color: '#92400e', label: 'Generated', icon: <DescriptionIcon sx={{ fontSize: 16 }} /> };
// //     case 'sent':
// //       return { bg: '#e3f2fd', color: '#1976d2', label: 'Sent', icon: <SendIcon sx={{ fontSize: 16 }} /> };
// //     case 'accepted':
// //       return { bg: '#d1fae5', color: '#065f46', label: 'Accepted', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
// //     case 'pending':
// //       return { bg: '#f1f5f9', color: '#475569', label: 'Pending', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> };
// //     default:
// //       return { bg: '#f1f5f9', color: '#475569', label: status || 'Pending', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> };
// //   }
// // };

// // const AppointmentManagement = () => {
// //   const [dataList, setDataList] = useState([]);
// //   const [filteredList, setFilteredList] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [totalCount, setTotalCount] = useState(0);
// //   const [selected, setSelected] = useState([]);

// //   const [actionAnchor, setActionAnchor] = useState(null);
// //   const [selectedItem, setSelectedItem] = useState(null);

// //   // Modal states
// //   const [openGenerate, setOpenGenerate] = useState(false);
// //   const [openSend, setOpenSend] = useState(false);
// //   const [openAccept, setOpenAccept] = useState(false);
// //   const [openView, setOpenView] = useState(false);

// //   // Filter states
// //   const [statusFilter, setStatusFilter] = useState('');
// //   const [filterAnchorEl, setFilterAnchorEl] = useState(null);

// //   /* SNACKBAR STATE */
// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success"
// //   });

// //   const [sortOrder, setSortOrder] = useState("asc");
// //   const [sortField, setSortField] = useState("candidateName");

// //   useEffect(() => {
// //     fetchData();
// //   }, [page, rowsPerPage]);

// //   const fetchData = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");

// //       // Fetch all appointment letters
// //       const lettersResponse = await axios.get(`${BASE_URL}/api/appointment-letter/all?page=${page + 1}&limit=${rowsPerPage}`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });

// //       if (lettersResponse.data.success) {
// //         const letters = lettersResponse.data.data || [];
// //         const total = lettersResponse.data.total || letters.length;
        
// //         // Transform the data to match the table structure
// //         const transformedData = letters.map(letter => {
// //           // Extract candidate details from the nested candidateId object
// //           const candidateInfo = letter.candidateId || {};
          
// //           return {
// //             _id: letter._id,
// //             documentId: letter.documentId || letter._id,
// //             firstName: candidateInfo.firstName || '',
// //             lastName: candidateInfo.lastName || '',
// //             fullName: candidateInfo.fullName || `${candidateInfo.firstName || ''} ${candidateInfo.lastName || ''}`.trim() || 'N/A',
// //             email: candidateInfo.email || '',
// //             phone: candidateInfo.phone || '',
// //             candidateId: candidateInfo._id || candidateInfo.id || 'N/A',
// //             letterStatus: letter.status || 'pending',
// //             appointmentLetter: letter,
// //             fileUrl: letter.fileUrl,
// //             generatedAt: letter.generatedAt || letter.createdAt,
// //             joiningDate: letter.joiningDate || '',
// //             offerDesignation: letter.offerDesignation || letter.offerId?.offerDetails?.designation || 'N/A',
// //             sentAt: letter.sentAt,
// //             acceptedAt: letter.acceptedAt,
// //             offerId: letter.offerId?._id || letter.offerId
// //           };
// //         });

// //         console.log('Transformed data:', transformedData); // For debugging
// //         setDataList(transformedData);
// //         setFilteredList(transformedData);
// //         setTotalCount(total);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching data:", err);
// //       showNotification("Failed to load data", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* Snackbar helper */
// //   const showNotification = (message, severity = "success") => {
// //     setSnackbar({ open: true, message, severity });
// //   };

// //   /* SEARCH */
// //   const handleSearch = (e) => {
// //     const value = e.target.value.toLowerCase();
// //     setSearchTerm(value);

// //     const filtered = dataList.filter((item) =>
// //       item.firstName?.toLowerCase().includes(value) ||
// //       item.lastName?.toLowerCase().includes(value) ||
// //       item.fullName?.toLowerCase().includes(value) ||
// //       item.email?.toLowerCase().includes(value) ||
// //       item.candidateId?.toLowerCase().includes(value) ||
// //       item.letterStatus?.toLowerCase().includes(value) ||
// //       item.documentId?.toLowerCase().includes(value)
// //     );

// //     setFilteredList(filtered);
// //     setPage(0);
// //   };

// //   /* SORT */
// //   const handleSort = (field) => {
// //     const sorted = [...filteredList].sort((a, b) => {
// //       let aValue, bValue;
      
// //       if (field === 'candidateName') {
// //         aValue = a.fullName || `${a.firstName || ''} ${a.lastName || ''}`.trim() || '';
// //         bValue = b.fullName || `${b.firstName || ''} ${b.lastName || ''}`.trim() || '';
// //       } else if (field === 'status') {
// //         aValue = a.letterStatus || '';
// //         bValue = b.letterStatus || '';
// //       } else {
// //         aValue = a[field] || '';
// //         bValue = b[field] || '';
// //       }

// //       const comparison = aValue.localeCompare(bValue);
// //       return sortOrder === "asc" ? comparison : -comparison;
// //     });

// //     setFilteredList(sorted);
// //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
// //     setSortField(field);
// //   };

// //   /* FILTER BY STATUS */
// //   const handleFilterClick = (event) => {
// //     setFilterAnchorEl(event.currentTarget);
// //   };

// //   const handleFilterClose = () => {
// //     setFilterAnchorEl(null);
// //   };

// //   const handleStatusFilter = (status) => {
// //     setStatusFilter(status);
    
// //     if (status === '') {
// //       setFilteredList(dataList);
// //     } else {
// //       const filtered = dataList.filter(item => 
// //         item.letterStatus?.toLowerCase() === status.toLowerCase()
// //       );
// //       setFilteredList(filtered);
// //     }
    
// //     setPage(0);
// //     handleFilterClose();
// //   };

// //   /* RESET FILTER */
// //   const handleResetFilter = () => {
// //     setFilteredList(dataList);
// //     setSearchTerm("");
// //     setStatusFilter('');
// //     setPage(0);
// //   };

// //   /* SELECTION HANDLERS */
// //   const handleSelectAll = (event) => {
// //     if (event.target.checked) {
// //       setSelected(filteredList.map(item => item._id));
// //     } else {
// //       setSelected([]);
// //     }
// //   };

// //   const handleSelect = (id) => {
// //     const selectedIndex = selected.indexOf(id);
// //     let newSelected = [];
    
// //     if (selectedIndex === -1) {
// //       newSelected = newSelected.concat(selected, id);
// //     } else {
// //       newSelected = selected.filter(item => item !== id);
// //     }
    
// //     setSelected(newSelected);
// //   };

// //   /* PAGINATION */
// //   const paginated = filteredList.slice(
// //     page * rowsPerPage,
// //     page * rowsPerPage + rowsPerPage
// //   );

// //   /* ACTION MENU */
// //   const handleActionOpen = (e, item) => {
// //     e.stopPropagation();
// //     setActionAnchor(e.currentTarget);
// //     setSelectedItem(item);
// //   };

// //   const handleActionClose = () => {
// //     setActionAnchor(null);
// //     // Don't clear selectedItem immediately to avoid null reference issues
// //     setTimeout(() => {
// //       setSelectedItem(null);
// //     }, 100);
// //   };

// //   /* REFRESH DATA */
// //   const handleRefresh = () => {
// //     fetchData();
// //     showNotification("Data refreshed successfully", "success");
// //   };

// //   /* BULK DELETE */
// //   const handleBulkDelete = () => {
// //     if (selected.length === 0) return;
// //     showNotification(`Bulk delete for ${selected.length} items - API coming soon`, 'warning');
// //   };

// //   /* MODAL HANDLERS */
// //   const handleGenerateOpen = () => {
// //     setOpenGenerate(true);
// //     handleActionClose();
// //   };

// //   const handleSendOpen = () => {
// //     setOpenSend(true);
// //     handleActionClose();
// //   };

// //   const handleAcceptOpen = () => {
// //     setOpenAccept(true);
// //     handleActionClose();
// //   };

// //   const handleViewOpen = () => {
// //     if (selectedItem?.fileUrl) {
// //       window.open(selectedItem.fileUrl, '_blank');
// //     }
// //     handleActionClose();
// //   };

// //  const handleGenerateClose = (data) => {
// //   setOpenGenerate(false);
// //   if (data) {
// //     fetchData(); // Refresh the data to show the newly generated letter
// //     showNotification("Appointment letter generated successfully", "success");
// //   }
// //   setSelectedItem(null);
// // };

// //   const handleSendClose = (data) => {
// //     setOpenSend(false);
// //     if (data) {
// //       fetchData();
// //       showNotification("Appointment letter sent successfully");
// //     }
// //     setSelectedItem(null);
// //   };

// //   const handleAcceptClose = (data) => {
// //     setOpenAccept(false);
// //     if (data) {
// //       fetchData();
// //       showNotification("Appointment letter accepted successfully");
// //     }
// //     setSelectedItem(null);
// //   };

// //   /* FORMAT DATE */
// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };

// //   // Get display name with null check
// //   const getDisplayName = (item) => {
// //     if (!item) return 'N/A';
// //     if (item.fullName) return item.fullName;
// //     if (item.firstName || item.lastName) return `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A';
// //     return 'N/A';
// //   };

// //   // Check if any items are selected
// //   const hasSelected = selected.length > 0;

// //   return (
// //     <Box sx={{ p: 3, mt: -8}}>
// //       {/* Header */}
// //       {/* <Typography
// //         variant="h5"
// //         fontWeight={600}
// //         sx={{
// //           background: HEADER_GRADIENT,
// //           WebkitBackgroundClip: "text",
// //           WebkitTextFillColor: "transparent",
// //           mb: 1
// //         }}
// //       >
// //         Appointment Management
// //       </Typography>
// //       <Typography variant="body2" color="#64748B" sx={{ mb: 3 }}>
// //         Generate, send and manage appointment letters for selected candidates
// //       </Typography> */}

// //       {/* ACTION BAR */}
// //       <Paper sx={{ 
// //         p: 1.5, 
// //         mb: 0, 
// //         borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none',
// //         borderRadius: 2,
// //         bgcolor: '#FFFFFF',
// //         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// //         border: '1px solid #e2e8f0'
// //       }}>
// //         <Stack direction="row" spacing={2} justifyContent="space-between" flexWrap="wrap">
// //           <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
// //             <TextField
// //               placeholder="Search by name, email, document ID..."
// //               size="small"
// //               value={searchTerm}
// //               onChange={handleSearch}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <SearchIcon sx={{ color: '#64748B' }} />
// //                   </InputAdornment>
// //                 ),
// //                 sx: { 
// //                   height: 40,
// //                   bgcolor: '#f8fafc',
// //                   '& input': {
// //                     padding: '8px 12px',
// //                     fontSize: '0.875rem'
// //                   }
// //                 }
// //               }}
// //               sx={{ width: 300 }}
// //             />
// // {/* 
// //             <Button
// //               variant="outlined"
// //               startIcon={<FilterIcon />}
// //               onClick={handleFilterClick}
// //               endIcon={statusFilter && <Chip label={statusFilter} size="small" sx={{ ml: 1 }} />}
// //               sx={{ 
// //                 height: 40,
// //                 borderRadius: 1.5,
// //                 textTransform: 'none',
// //                 fontSize: '0.875rem',
// //                 borderColor: '#e2e8f0',
// //                 color: '#475569',
// //                 '&:hover': {
// //                   borderColor: PRIMARY_BLUE,
// //                   bgcolor: alpha(PRIMARY_BLUE, 0.04)
// //                 }
// //               }}
// //             >
// //               Filter
// //             </Button>

// //             <Button
// //               variant="outlined"
// //               startIcon={<SortIcon />}
// //               onClick={() => handleSort('candidateName')}
// //               sx={{ 
// //                 height: 40,
// //                 borderRadius: 1.5,
// //                 textTransform: 'none',
// //                 fontSize: '0.875rem',
// //                 borderColor: '#e2e8f0',
// //                 color: '#475569',
// //                 '&:hover': {
// //                   borderColor: PRIMARY_BLUE,
// //                   bgcolor: alpha(PRIMARY_BLUE, 0.04)
// //                 }
// //               }}
// //             >
// //               Sort Name {sortField === 'candidateName' && (sortOrder === "asc" ? "↑" : "↓")}
// //             </Button>

// //             <Tooltip title="Refresh">
// //               <IconButton 
// //                 onClick={handleRefresh}
// //                 sx={{ 
// //                   color: '#64748B',
// //                   '&:hover': {
// //                     bgcolor: alpha(PRIMARY_BLUE, 0.1),
// //                     color: PRIMARY_BLUE
// //                   }
// //                 }}
// //               >
// //                 <RefreshIcon />
// //               </IconButton>
// //             </Tooltip> */}

// //             {(searchTerm || statusFilter) && (
// //               <Button 
// //                 variant="text" 
// //                 onClick={handleResetFilter}
// //                 sx={{ 
// //                   color: PRIMARY_BLUE,
// //                   fontSize: '0.875rem',
// //                   textTransform: 'none'
// //                 }}
// //               >
// //                 Clear Filters
// //               </Button>
// //             )}
// //           </Stack> 

// //           <Stack direction="row" spacing={2} alignItems="center">
// //             {hasSelected && (
// //               <Button
// //                 variant="outlined"
// //                 color="error"
// //                 startIcon={<DeleteIcon />}
// //                 onClick={handleBulkDelete}
// //                 sx={{ 
// //                   height: 40,
// //                   borderRadius: 1.5,
// //                   textTransform: 'none',
// //                   fontSize: '0.875rem',
// //                   fontWeight: 500
// //                 }}
// //               >
// //                 Delete ({selected.length})
// //               </Button>
// //             )}
// //             <Button
// //               variant="contained"
// //               startIcon={<AddIcon />}
// //               onClick={() => setOpenGenerate(true)}
// //               sx={{ 
// //                 height: 40,
// //                 borderRadius: 1.5,
// //                 background: HEADER_GRADIENT,
// //                 fontSize: '0.875rem',
// //                 fontWeight: 500,
// //                 textTransform: 'none',
// //                 '&:hover': {
// //                   opacity: 0.9,
// //                   background: HEADER_GRADIENT,
// //                 }
// //               }}
// //             >
// //               Generate Letter
// //             </Button>
// //           </Stack>
// //         </Stack>
// //       </Paper>

// //       {/* FILTER MENU */}
// //       <Menu
// //         anchorEl={filterAnchorEl}
// //         open={Boolean(filterAnchorEl)}
// //         onClose={handleFilterClose}
// //         PaperProps={{
// //           sx: { borderRadius: 1.5, minWidth: 160 }
// //         }}
// //       >
// //         <MenuItem onClick={() => handleStatusFilter('')} sx={{ py: 1 }}>
// //           <ListItemText>All Status</ListItemText>
// //         </MenuItem>
// //         <Divider />
// //         <MenuItem onClick={() => handleStatusFilter('pending')} sx={{ py: 1 }}>
// //           <ListItemIcon>
// //             <AccessTimeIcon fontSize="small" sx={{ color: '#475569' }} />
// //           </ListItemIcon>
// //           <ListItemText>Pending</ListItemText>
// //         </MenuItem>
// //         <MenuItem onClick={() => handleStatusFilter('generated')} sx={{ py: 1 }}>
// //           <ListItemIcon>
// //             <DescriptionIcon fontSize="small" sx={{ color: '#92400e' }} />
// //           </ListItemIcon>
// //           <ListItemText>Generated</ListItemText>
// //         </MenuItem>
// //         <MenuItem onClick={() => handleStatusFilter('sent')} sx={{ py: 1 }}>
// //           <ListItemIcon>
// //             <SendIcon fontSize="small" sx={{ color: '#1976d2' }} />
// //           </ListItemIcon>
// //           <ListItemText>Sent</ListItemText>
// //         </MenuItem>
// //         <MenuItem onClick={() => handleStatusFilter('accepted')} sx={{ py: 1 }}>
// //           <ListItemIcon>
// //             <CheckCircleIcon fontSize="small" sx={{ color: '#2e7d32' }} />
// //           </ListItemIcon>
// //           <ListItemText>Accepted</ListItemText>
// //         </MenuItem>
// //       </Menu>

// //       {/* TABLE */}
// //       <Paper sx={{ 
// //         width: '100%', 
// //         borderRadius: 2, 
// //         overflow: 'hidden',
// //         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// //         border: '1px solid #e2e8f0'
// //       }}>
// //         <TableContainer>
// //           <Table>
// //             <TableHead>
// //               <TableRow sx={{ background: HEADER_GRADIENT }}>
// //                 <TableCell padding="checkbox" sx={{ width: 60, color: TEXT_COLOR_HEADER }}>
// //                   <Checkbox
// //                     indeterminate={selected.length > 0 && selected.length < filteredList.length}
// //                     checked={filteredList.length > 0 && selected.length === filteredList.length}
// //                     onChange={handleSelectAll}
// //                     sx={{
// //                       color: TEXT_COLOR_HEADER,
// //                       '&.Mui-checked': {
// //                         color: TEXT_COLOR_HEADER,
// //                       },
// //                       '&.MuiCheckbox-indeterminate': {
// //                         color: TEXT_COLOR_HEADER,
// //                       }
// //                     }}
// //                   />
// //                 </TableCell>
// //                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
// //                   <Stack direction="row" alignItems="center" spacing={0.5}>
// //                     Candidate
// //                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
// //                   </Stack>
// //                 </TableCell>
// //                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
// //                   Document ID
// //                 </TableCell>
// //                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
// //                   Contact
// //                 </TableCell>
// //                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
// //                   <Stack direction="row" alignItems="center" spacing={0.5}>
// //                     Letter Status
// //                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
// //                   </Stack>
// //                 </TableCell>
// //                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
// //                   Generated On
// //                 </TableCell>
// //                 {/* <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2, width: 100 }} align="center">
// //                   Actions
// //                 </TableCell> */}
// //               </TableRow>
// //             </TableHead>

// //             <TableBody>
// //               {loading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
// //                     <CircularProgress size={40} />
// //                     <Typography variant="body2" color="#64748B" sx={{ mt: 2 }}>
// //                       Loading appointment letters...
// //                     </Typography>
// //                   </TableCell>
// //                 </TableRow>
// //               ) : paginated.length > 0 ? (
// //                 paginated.map((item, index) => {
// //                   const statusStyle = getStatusColor(item.letterStatus);
// //                   const displayName = getDisplayName(item);
// //                   const isSelected = selected.includes(item._id);
// //                   const isOddRow = index % 2 === 0;
                  
// //                   return (
// //                     <TableRow 
// //                       key={item._id} 
// //                       hover
// //                       selected={isSelected}
// //                       sx={{ 
// //                         bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
// //                         '&:hover': {
// //                           bgcolor: HOVER_COLOR
// //                         },
// //                         '&.Mui-selected': {
// //                           bgcolor: alpha(PRIMARY_BLUE, 0.08),
// //                           '&:hover': {
// //                             bgcolor: alpha(PRIMARY_BLUE, 0.12)
// //                           }
// //                         }
// //                       }}
// //                     >
// //                       <TableCell padding="checkbox">
// //                         <Checkbox
// //                           checked={isSelected}
// //                           onChange={() => handleSelect(item._id)}
// //                           sx={{
// //                             color: PRIMARY_BLUE,
// //                             '&.Mui-checked': {
// //                               color: PRIMARY_BLUE,
// //                             },
// //                           }}
// //                         />
// //                       </TableCell>
// //                       <TableCell>
// //                         <Stack direction="row" spacing={1} alignItems="center">
// //                           <Avatar sx={{ width: 32, height: 32, bgcolor: PRIMARY_BLUE, fontSize: '0.875rem' }}>
// //                             {displayName.charAt(0)}
// //                           </Avatar>
// //                           <Box>
// //                             <Typography variant="body2" fontWeight={500}>
// //                               {displayName}
// //                             </Typography>
// //                             <Typography variant="caption" color="#64748B">
// //                               ID: {item.candidateId}
// //                             </Typography>
// //                           </Box>
// //                         </Stack>
// //                       </TableCell>

// //                       <TableCell>
// //                         <Typography variant="body2" fontWeight={500}>
// //                           {item.documentId}
// //                         </Typography>
// //                         <Typography variant="caption" color="#64748B">
// //                           {item.offerDesignation}
// //                         </Typography>
// //                       </TableCell>

// //                       <TableCell>
// //                         <Stack spacing={0.5}>
// //                           {item.email ? (
// //                             <Stack direction="row" spacing={0.5} alignItems="center">
// //                               <EmailIcon sx={{ fontSize: 14, color: '#64748B' }} />
// //                               <Typography variant="caption">{item.email}</Typography>
// //                             </Stack>
// //                           ) : (
// //                             <Typography variant="caption" color="textSecondary">No email</Typography>
// //                           )}
// //                           {item.phone ? (
// //                             <Stack direction="row" spacing={0.5} alignItems="center">
// //                               <PhoneIcon sx={{ fontSize: 14, color: '#64748B' }} />
// //                               <Typography variant="caption">{item.phone}</Typography>
// //                             </Stack>
// //                           ) : (
// //                             <Typography variant="caption" color="textSecondary">No phone</Typography>
// //                           )}
// //                         </Stack>
// //                       </TableCell>

// //                       <TableCell>
// //                         <Chip
// //                           icon={statusStyle.icon}
// //                           label={statusStyle.label}
// //                           size="small"
// //                           sx={{
// //                             bgcolor: statusStyle.bg,
// //                             color: statusStyle.color,
// //                             fontWeight: 500,
// //                             minWidth: 90,
// //                             '& .MuiChip-icon': {
// //                               color: statusStyle.color
// //                             }
// //                           }}
// //                         />
// //                       </TableCell>

// //                       <TableCell>
// //                         {item.generatedAt 
// //                           ? formatDate(item.generatedAt)
// //                           : '-'
// //                         }
// //                       </TableCell>

// //                       <TableCell align="center">
// //                         <IconButton onClick={(e) => handleActionOpen(e, item)}>
// //                           <MoreVertIcon />
// //                         </IconButton>
// //                       </TableCell>
// //                     </TableRow>
// //                   );
// //                 })
// //               ) : (
// //                 <TableRow>
// //                   <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
// //                     <Box sx={{ textAlign: 'center' }}>
// //                       <AssignmentIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
// //                       <Typography variant="body1" color="#64748B" fontWeight={500}>
// //                         {searchTerm || statusFilter ? 'No appointment letters found' : 'No appointment letters yet'}
// //                       </Typography>
// //                       <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
// //                         {searchTerm || statusFilter 
// //                           ? 'Try adjusting your search or filters' 
// //                           : 'Click "Generate Letter" to create a new appointment letter'}
// //                       </Typography>
// //                     </Box>
// //                   </TableCell>
// //                 </TableRow>
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>

// //         <TablePagination
// //           component="div"
// //           count={searchTerm || statusFilter ? filteredList.length : totalCount}
// //           page={page}
// //           rowsPerPage={rowsPerPage}
// //           onPageChange={(e, newPage) => setPage(newPage)}
// //           onRowsPerPageChange={(e) =>
// //             setRowsPerPage(parseInt(e.target.value, 10))
// //           }
// //           rowsPerPageOptions={[5, 10, 25, 50]}
// //           sx={{
// //             borderTop: '1px solid #e2e8f0',
// //             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
// //               fontSize: '0.875rem',
// //               color: '#64748B'
// //             },
// //             '& .MuiTablePagination-actions button': {
// //               color: PRIMARY_BLUE,
// //             }
// //           }}
// //         />
// //       </Paper>

// //       {/* ACTION MENU */}
// //       <Menu 
// //         anchorEl={actionAnchor} 
// //         open={Boolean(actionAnchor)} 
// //         onClose={handleActionClose}
// //         PaperProps={{
// //           sx: { borderRadius: 1.5, minWidth: 180 }
// //         }}
// //       >
// //         {selectedItem && (
// //           <>
// //             {/* View/Download - Show if file exists */}
// //             {selectedItem?.fileUrl && (
// //               <MenuItem onClick={handleViewOpen} sx={{ py: 1 }}>
// //                 <ListItemIcon>
// //                   <VisibilityIcon fontSize="small" sx={{ color: PRIMARY_BLUE }} />
// //                 </ListItemIcon>
// //                 <ListItemText>View/Download</ListItemText>
// //               </MenuItem>
// //             )}

// //             {/* Generate Letter - Show if status is pending */}
// //             {selectedItem?.letterStatus === 'pending' && (
// //               <MenuItem onClick={handleGenerateOpen} sx={{ py: 1 }}>
// //                 <ListItemIcon>
// //                   <DescriptionIcon fontSize="small" sx={{ color: PRIMARY_BLUE }} />
// //                 </ListItemIcon>
// //                 <ListItemText>Generate Letter</ListItemText>
// //               </MenuItem>
// //             )}

// //             {/* Send Letter - Show if status is generated */}
// //             {/* {selectedItem?.letterStatus === 'generated' && (
// //               <MenuItem onClick={handleSendOpen} sx={{ py: 1 }}>
// //                 <ListItemIcon>
// //                   <SendIcon fontSize="small" sx={{ color: '#1976d2' }} />
// //                 </ListItemIcon>
// //                 <ListItemText>Send Letter</ListItemText>
// //               </MenuItem>
// //             )} */}

// //             {/* Accept Letter - Show if status is sent */}
// //             {selectedItem?.letterStatus === 'sent' && (
// //               <MenuItem onClick={handleAcceptOpen} sx={{ py: 1 }}>
// //                 <ListItemIcon>
// //                   <CheckCircleIcon fontSize="small" sx={{ color: '#2e7d32' }} />
// //                 </ListItemIcon>
// //                 <ListItemText>Accept Letter</ListItemText>
// //               </MenuItem>
// //             )}

// //             {/* If no actions available */}
// //             {selectedItem?.letterStatus === 'accepted' && (
// //               <MenuItem disabled sx={{ py: 1 }}>
// //                 <ListItemText secondary="Letter already accepted" />
// //               </MenuItem>
// //             )}
// //           </>
// //         )}

// //         {!selectedItem && (
// //           <MenuItem disabled sx={{ py: 1 }}>
// //             <ListItemText secondary="No actions available" />
// //           </MenuItem>
// //         )}
// //       </Menu>

// //       {/* MODALS */}
// //       <GenerateAppointmentLetter
// //         open={openGenerate}
// //         onClose={() => handleGenerateClose()}
// //         onSubmit={(data) => {
// //           if (data) {
// //             handleGenerateClose(data);
// //           }
// //         }}
// //       />

      
// // <SendAppointmentLetter
// //   open={openSend}
// //   onClose={() => handleSendClose()}
// //   onSend={(data) => {
// //     if (data) {
// //       handleSendClose(data);
// //       showNotification('Appointment letter sent successfully', 'success');
// //     }
// //   }}
// //   selectedItem={selectedItem} // Pass the entire selected item
// // />

// //       <AcceptAppointmentLetter
// //         open={openAccept}
// //         onClose={() => handleAcceptClose()}
// //         onAccept={(data) => {
// //           if (data) {
// //             handleAcceptClose(data);
// //           }
// //         }}
// //         documentId={selectedItem?.documentId}
// //       />

// //       {/* SNACKBAR */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={3000}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// //         onClose={() => setSnackbar({ ...snackbar, open: false })}
// //       >
// //         <Alert 
// //           severity={snackbar.severity} 
// //           variant="filled"
// //           sx={{ 
// //             width: '100%',
// //             borderRadius: 1.5,
// //             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
// //           }}
// //         >
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default AppointmentManagement;

// import React, { useState, useEffect } from "react";
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
//   Typography,
//   Snackbar,
//   TablePagination,
//   Stack,
//   Alert,
//   Chip,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Avatar,
//   Tooltip,
//   Checkbox,
//   alpha,
//   CircularProgress
// } from "@mui/material";

// import {
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   Add as AddIcon,
//   MoreVert as MoreVertIcon,
//   Sort as SortIcon,
//   Description as DescriptionIcon,
//   Send as SendIcon,
//   CheckCircle as CheckCircleIcon,
//   Refresh as RefreshIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Download as DownloadIcon,
//   Delete as DeleteIcon,
//   ArrowUpward as ArrowUpwardIcon,
//   Assignment as AssignmentIcon,
//   AccessTime as AccessTimeIcon,
//   Error as ErrorIcon,
//   Visibility as VisibilityIcon
// } from "@mui/icons-material";

// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// /* COMPONENTS */
// import GenerateAppointmentLetter from "./GenerateAppointmentLetter";
// import SendAppointmentLetter from "./SendAppointmentLetter";
// import AcceptAppointmentLetter from "./Accept";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// const PRIMARY_BLUE = "#00B4D8";
// const TEXT_COLOR_HEADER = '#FFFFFF';
// const STRIPE_COLOR_ODD = '#FFFFFF';
// const STRIPE_COLOR_EVEN = '#f8fafc';
// const HOVER_COLOR = '#f1f5f9';

// // Status color mapping
// const getStatusColor = (status) => {
//   switch (status?.toLowerCase()) {
//     case 'generated':
//       return { bg: '#fef3c7', color: '#92400e', label: 'Generated', icon: <DescriptionIcon sx={{ fontSize: 16 }} /> };
//     case 'sent':
//       return { bg: '#e3f2fd', color: '#1976d2', label: 'Sent', icon: <SendIcon sx={{ fontSize: 16 }} /> };
//     case 'accepted':
//       return { bg: '#d1fae5', color: '#065f46', label: 'Accepted', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
//     case 'pending':
//       return { bg: '#f1f5f9', color: '#475569', label: 'Pending', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> };
//     default:
//       return { bg: '#f1f5f9', color: '#475569', label: status || 'Pending', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> };
//   }
// };

// const AppointmentManagement = () => {
//   const [dataList, setDataList] = useState([]);
//   const [filteredList, setFilteredList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const [selected, setSelected] = useState([]);

//   const [actionAnchor, setActionAnchor] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Modal states
//   const [openGenerate, setOpenGenerate] = useState(false);
//   const [openSend, setOpenSend] = useState(false);
//   const [openAccept, setOpenAccept] = useState(false);
//   const [openView, setOpenView] = useState(false);

//   // Filter states
//   const [statusFilter, setStatusFilter] = useState('');
//   const [filterAnchorEl, setFilterAnchorEl] = useState(null);

//   /* SNACKBAR STATE */
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   const [sortOrder, setSortOrder] = useState("asc");
//   const [sortField, setSortField] = useState("candidateName");

//   useEffect(() => {
//     fetchData();
//   }, [page, rowsPerPage]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Fetch all appointment letters
//       const lettersResponse = await axios.get(`${BASE_URL}/api/appointment-letter/all?page=${page + 1}&limit=${rowsPerPage}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (lettersResponse.data.success) {
//         const letters = lettersResponse.data.data || [];
//         const total = lettersResponse.data.total || letters.length;
        
//         // Transform the data to match the table structure
//         const transformedData = letters.map(letter => {
//           // Extract candidate details from the nested candidateId object
//           const candidateInfo = letter.candidateId || {};
          
//           return {
//             _id: letter._id,
//             documentId: letter.documentId || letter._id,
//             firstName: candidateInfo.firstName || '',
//             lastName: candidateInfo.lastName || '',
//             fullName: candidateInfo.fullName || `${candidateInfo.firstName || ''} ${candidateInfo.lastName || ''}`.trim() || 'N/A',
//             email: candidateInfo.email || '',
//             phone: candidateInfo.phone || '',
//             candidateId: candidateInfo._id || candidateInfo.id || 'N/A',
//             letterStatus: letter.status || 'pending',
//             appointmentLetter: letter,
//             fileUrl: letter.fileUrl,
//             generatedAt: letter.generatedAt || letter.createdAt,
//             joiningDate: letter.joiningDate || '',
//             offerDesignation: letter.offerDesignation || letter.offerId?.offerDetails?.designation || 'N/A',
//             sentAt: letter.sentAt,
//             acceptedAt: letter.acceptedAt,
//             offerId: letter.offerId?._id || letter.offerId
//           };
//         });

//         console.log('Transformed data:', transformedData); // For debugging
//         setDataList(transformedData);
//         setFilteredList(transformedData);
//         setTotalCount(total);
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       showNotification("Failed to load data", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Snackbar helper */
//   const showNotification = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   /* SEARCH */
//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filtered = dataList.filter((item) =>
//       item.firstName?.toLowerCase().includes(value) ||
//       item.lastName?.toLowerCase().includes(value) ||
//       item.fullName?.toLowerCase().includes(value) ||
//       item.email?.toLowerCase().includes(value) ||
//       item.candidateId?.toLowerCase().includes(value) ||
//       item.letterStatus?.toLowerCase().includes(value) ||
//       item.documentId?.toLowerCase().includes(value)
//     );

//     setFilteredList(filtered);
//     setPage(0);
//   };

//   /* SORT */
//   const handleSort = (field) => {
//     const sorted = [...filteredList].sort((a, b) => {
//       let aValue, bValue;
      
//       if (field === 'candidateName') {
//         aValue = a.fullName || `${a.firstName || ''} ${a.lastName || ''}`.trim() || '';
//         bValue = b.fullName || `${b.firstName || ''} ${b.lastName || ''}`.trim() || '';
//       } else if (field === 'status') {
//         aValue = a.letterStatus || '';
//         bValue = b.letterStatus || '';
//       } else {
//         aValue = a[field] || '';
//         bValue = b[field] || '';
//       }

//       const comparison = aValue.localeCompare(bValue);
//       return sortOrder === "asc" ? comparison : -comparison;
//     });

//     setFilteredList(sorted);
//     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     setSortField(field);
//   };

//   /* FILTER BY STATUS */
//   const handleFilterClick = (event) => {
//     setFilterAnchorEl(event.currentTarget);
//   };

//   const handleFilterClose = () => {
//     setFilterAnchorEl(null);
//   };

//   const handleStatusFilter = (status) => {
//     setStatusFilter(status);
    
//     if (status === '') {
//       setFilteredList(dataList);
//     } else {
//       const filtered = dataList.filter(item => 
//         item.letterStatus?.toLowerCase() === status.toLowerCase()
//       );
//       setFilteredList(filtered);
//     }
    
//     setPage(0);
//     handleFilterClose();
//   };

//   /* RESET FILTER */
//   const handleResetFilter = () => {
//     setFilteredList(dataList);
//     setSearchTerm("");
//     setStatusFilter('');
//     setPage(0);
//   };

//   /* SELECTION HANDLERS */
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(filteredList.map(item => item._id));
//     } else {
//       setSelected([]);
//     }
//   };

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

//   /* PAGINATION */
//   const paginated = filteredList.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   /* ACTION MENU */
//   const handleActionOpen = (e, item) => {
//     e.stopPropagation();
//     setActionAnchor(e.currentTarget);
//     setSelectedItem(item);
//   };

//   const handleActionClose = () => {
//     setActionAnchor(null);
//     // Don't clear selectedItem immediately to avoid null reference issues
//     setTimeout(() => {
//       setSelectedItem(null);
//     }, 100);
//   };

//   /* REFRESH DATA */
//   const handleRefresh = () => {
//     fetchData();
//     showNotification("Data refreshed successfully", "success");
//   };

//   /* BULK DELETE */
//   const handleBulkDelete = () => {
//     if (selected.length === 0) return;
//     showNotification(`Bulk delete for ${selected.length} items - API coming soon`, 'warning');
//   };

//   /* MODAL HANDLERS */
//   const handleGenerateOpen = () => {
//     setOpenGenerate(true);
//     handleActionClose();
//   };

//   const handleSendOpen = () => {
//     setOpenSend(true);
//     handleActionClose();
//   };

//   const handleAcceptOpen = () => {
//     setOpenAccept(true);
//     handleActionClose();
//   };

//   const handleViewOpen = () => {
//     if (selectedItem?.fileUrl) {
//       window.open(selectedItem.fileUrl, '_blank');
//     }
//     handleActionClose();
//   };

//  const handleGenerateClose = (data) => {
//   setOpenGenerate(false);
//   if (data) {
//     fetchData(); // Refresh the data to show the newly generated letter
//     showNotification("Appointment letter generated successfully", "success");
//   }
//   setSelectedItem(null);
// };

//   const handleSendClose = (data) => {
//     setOpenSend(false);
//     if (data) {
//       fetchData();
//       showNotification("Appointment letter sent successfully", "success");
//     }
//     setSelectedItem(null);
//   };

//   const handleAcceptClose = (data) => {
//     setOpenAccept(false);
//     if (data) {
//       fetchData();
//       showNotification("Appointment letter accepted successfully", "success");
//     }
//     setSelectedItem(null);
//   };

//   /* FORMAT DATE */
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get display name with null check
//   const getDisplayName = (item) => {
//     if (!item) return 'N/A';
//     if (item.fullName) return item.fullName;
//     if (item.firstName || item.lastName) return `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A';
//     return 'N/A';
//   };

//   // Check if any items are selected
//   const hasSelected = selected.length > 0;

//   return (
//     <Box sx={{ p: 3, mt: -8}}>
//       {/* ACTION BAR */}
//       <Paper sx={{ 
//         p: 1.5, 
//         mb: 0, 
//         borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none',
//         borderRadius: 2,
//         bgcolor: '#FFFFFF',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: '1px solid #e2e8f0'
//       }}>
//         <Stack direction="row" spacing={2} justifyContent="space-between" flexWrap="wrap">
//           <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
//             <TextField
//               placeholder="Search by name, email, document ID..."
//               size="small"
//               value={searchTerm}
//               onChange={handleSearch}
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
//               sx={{ width: 300 }}
//             />

//             {(searchTerm || statusFilter) && (
//               <Button 
//                 variant="text" 
//                 onClick={handleResetFilter}
//                 sx={{ 
//                   color: PRIMARY_BLUE,
//                   fontSize: '0.875rem',
//                   textTransform: 'none'
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </Stack> 

//           <Stack direction="row" spacing={2} alignItems="center">
//             {hasSelected && (
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
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setOpenGenerate(true)}
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
//             >
//               Generate Letter
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* FILTER MENU */}
//       <Menu
//         anchorEl={filterAnchorEl}
//         open={Boolean(filterAnchorEl)}
//         onClose={handleFilterClose}
//         PaperProps={{
//           sx: { borderRadius: 1.5, minWidth: 160 }
//         }}
//       >
//         <MenuItem onClick={() => handleStatusFilter('')} sx={{ py: 1 }}>
//           <ListItemText>All Status</ListItemText>
//         </MenuItem>
//         <Divider />
//         <MenuItem onClick={() => handleStatusFilter('pending')} sx={{ py: 1 }}>
//           <ListItemIcon>
//             <AccessTimeIcon fontSize="small" sx={{ color: '#475569' }} />
//           </ListItemIcon>
//           <ListItemText>Pending</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => handleStatusFilter('generated')} sx={{ py: 1 }}>
//           <ListItemIcon>
//             <DescriptionIcon fontSize="small" sx={{ color: '#92400e' }} />
//           </ListItemIcon>
//           <ListItemText>Generated</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => handleStatusFilter('sent')} sx={{ py: 1 }}>
//           <ListItemIcon>
//             <SendIcon fontSize="small" sx={{ color: '#1976d2' }} />
//           </ListItemIcon>
//           <ListItemText>Sent</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => handleStatusFilter('accepted')} sx={{ py: 1 }}>
//           <ListItemIcon>
//             <CheckCircleIcon fontSize="small" sx={{ color: '#2e7d32' }} />
//           </ListItemIcon>
//           <ListItemText>Accepted</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* TABLE */}
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
//               <TableRow sx={{ background: HEADER_GRADIENT }}>
//                 <TableCell padding="checkbox" sx={{ width: 60, color: TEXT_COLOR_HEADER }}>
//                   <Checkbox
//                     indeterminate={selected.length > 0 && selected.length < filteredList.length}
//                     checked={filteredList.length > 0 && selected.length === filteredList.length}
//                     onChange={handleSelectAll}
//                     sx={{
//                       color: TEXT_COLOR_HEADER,
//                       '&.Mui-checked': {
//                         color: TEXT_COLOR_HEADER,
//                       },
//                       '&.MuiCheckbox-indeterminate': {
//                         color: TEXT_COLOR_HEADER,
//                       }
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Candidate
//                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Document ID
//                 </TableCell>
//                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Contact
//                 </TableCell>
//                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Letter Status
//                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   Generated On
//                 </TableCell>
//                 {/* <TableCell sx={{ color: TEXT_COLOR_HEADER, fontWeight: 700, fontSize: '0.875rem', py: 2, width: 60 }} align="center">
//                   <MoreVertIcon sx={{ fontSize: 20, color: TEXT_COLOR_HEADER }} />
//                 </TableCell> */}
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
//                     <CircularProgress size={40} />
//                     <Typography variant="body2" color="#64748B" sx={{ mt: 2 }}>
//                       Loading appointment letters...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : paginated.length > 0 ? (
//                 paginated.map((item, index) => {
//                   const statusStyle = getStatusColor(item.letterStatus);
//                   const displayName = getDisplayName(item);
//                   const isSelected = selected.includes(item._id);
//                   const isOddRow = index % 2 === 0;
                  
//                   return (
//                     <TableRow 
//                       key={item._id} 
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
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isSelected}
//                           onChange={() => handleSelect(item._id)}
//                           sx={{
//                             color: PRIMARY_BLUE,
//                             '&.Mui-checked': {
//                               color: PRIMARY_BLUE,
//                             },
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" spacing={1} alignItems="center">
//                           <Avatar sx={{ width: 32, height: 32, bgcolor: PRIMARY_BLUE, fontSize: '0.875rem' }}>
//                             {displayName.charAt(0)}
//                           </Avatar>
//                           <Box>
//                             <Typography variant="body2" fontWeight={500}>
//                               {displayName}
//                             </Typography>
//                             <Typography variant="caption" color="#64748B">
//                               ID: {item.candidateId}
//                             </Typography>
//                           </Box>
//                         </Stack>
//                       </TableCell>

//                       <TableCell>
//                         <Typography variant="body2" fontWeight={500}>
//                           {item.documentId}
//                         </Typography>
//                         <Typography variant="caption" color="#64748B">
//                           {item.offerDesignation}
//                         </Typography>
//                       </TableCell>

//                       <TableCell>
//                         <Stack spacing={0.5}>
//                           {item.email ? (
//                             <Stack direction="row" spacing={0.5} alignItems="center">
//                               <EmailIcon sx={{ fontSize: 14, color: '#64748B' }} />
//                               <Typography variant="caption">{item.email}</Typography>
//                             </Stack>
//                           ) : (
//                             <Typography variant="caption" color="textSecondary">No email</Typography>
//                           )}
//                           {item.phone ? (
//                             <Stack direction="row" spacing={0.5} alignItems="center">
//                               <PhoneIcon sx={{ fontSize: 14, color: '#64748B' }} />
//                               <Typography variant="caption">{item.phone}</Typography>
//                             </Stack>
//                           ) : (
//                             <Typography variant="caption" color="textSecondary">No phone</Typography>
//                           )}
//                         </Stack>
//                       </TableCell>

//                       <TableCell>
//                         <Chip
//                           icon={statusStyle.icon}
//                           label={statusStyle.label}
//                           size="small"
//                           sx={{
//                             bgcolor: statusStyle.bg,
//                             color: statusStyle.color,
//                             fontWeight: 500,
//                             minWidth: 90,
//                             '& .MuiChip-icon': {
//                               color: statusStyle.color
//                             }
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell>
//                         {item.generatedAt 
//                           ? formatDate(item.generatedAt)
//                           : '-'
//                         }
//                       </TableCell>
// {/* 
//                       <TableCell align="center">
//                         <IconButton onClick={(e) => handleActionOpen(e, item)} size="small">
//                           <MoreVertIcon sx={{ fontSize: 20 }} />
//                         </IconButton>
//                       </TableCell> */}
//                     </TableRow>
//                   );
//                 })
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <AssignmentIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
//                       <Typography variant="body1" color="#64748B" fontWeight={500}>
//                         {searchTerm || statusFilter ? 'No appointment letters found' : 'No appointment letters yet'}
//                       </Typography>
//                       <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
//                         {searchTerm || statusFilter 
//                           ? 'Try adjusting your search or filters' 
//                           : 'Click "Generate Letter" to create a new appointment letter'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           component="div"
//           count={searchTerm || statusFilter ? filteredList.length : totalCount}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) =>
//             setRowsPerPage(parseInt(e.target.value, 10))
//           }
//           rowsPerPageOptions={[5, 10, 25, 50]}
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

//       {/* ACTION MENU */}
//       <Menu 
//         anchorEl={actionAnchor} 
//         open={Boolean(actionAnchor)} 
//         onClose={handleActionClose}
//         PaperProps={{
//           sx: { borderRadius: 1.5, minWidth: 180 }
//         }}
//       >
//         {selectedItem && (
//           <>
//             {/* View/Download - Show if file exists */}
//             {selectedItem?.fileUrl && (
//               <MenuItem onClick={handleViewOpen} sx={{ py: 1 }}>
//                 <ListItemIcon>
//                   <VisibilityIcon fontSize="small" sx={{ color: PRIMARY_BLUE }} />
//                 </ListItemIcon>
//                 <ListItemText>View/Download</ListItemText>
//               </MenuItem>
//             )}

//             {/* Generate Letter - Show if status is pending */}
//             {selectedItem?.letterStatus === 'pending' && (
//               <MenuItem onClick={handleGenerateOpen} sx={{ py: 1 }}>
//                 <ListItemIcon>
//                   <DescriptionIcon fontSize="small" sx={{ color: PRIMARY_BLUE }} />
//                 </ListItemIcon>
//                 <ListItemText>Generate Letter</ListItemText>
//               </MenuItem>
//             )}

//             {/* Send Letter - Show if status is generated */}
//             {selectedItem?.letterStatus === 'generated' && (
//               <MenuItem onClick={handleSendOpen} sx={{ py: 1 }}>
//                 <ListItemIcon>
//                   <SendIcon fontSize="small" sx={{ color: '#1976d2' }} />
//                 </ListItemIcon>
//                 <ListItemText>Send Letter</ListItemText>
//               </MenuItem>
//             )}

//             {/* Accept Letter - Show if status is sent */}
//             {selectedItem?.letterStatus === 'sent' && (
//               <MenuItem onClick={handleAcceptOpen} sx={{ py: 1 }}>
//                 <ListItemIcon>
//                   <CheckCircleIcon fontSize="small" sx={{ color: '#2e7d32' }} />
//                 </ListItemIcon>
//                 <ListItemText>Accept Letter</ListItemText>
//               </MenuItem>
//             )}

//             {/* If no actions available */}
//             {selectedItem?.letterStatus === 'accepted' && (
//               <MenuItem disabled sx={{ py: 1 }}>
//                 <ListItemText secondary="Letter already accepted" />
//               </MenuItem>
//             )}
//           </>
//         )}

//         {!selectedItem && (
//           <MenuItem disabled sx={{ py: 1 }}>
//             <ListItemText secondary="No actions available" />
//           </MenuItem>
//         )}
//       </Menu>

//       {/* MODALS */}
//       <GenerateAppointmentLetter
//         open={openGenerate}
//         onClose={() => handleGenerateClose()}
//         onSubmit={(data) => {
//           if (data) {
//             handleGenerateClose(data);
//           }
//         }}
//       />

//       <SendAppointmentLetter
//         open={openSend}
//         onClose={() => handleSendClose()}
//         onSend={(data) => {
//           if (data) {
//             handleSendClose(data);
//             showNotification('Appointment letter sent successfully', 'success');
//           }
//         }}
//         selectedItem={selectedItem}
//       />

//       <AcceptAppointmentLetter
//         open={openAccept}
//         onClose={() => handleAcceptClose()}
//         onAccept={(data) => {
//           if (data) {
//             handleAcceptClose(data);
//           }
//         }}
//         documentId={selectedItem?.documentId}
//       />

//       {/* SNACKBAR */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert 
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

// export default AppointmentManagement;


// import React, { useState, useEffect, useCallback } from 'react';
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
//   Typography,
//   Snackbar,
//   TablePagination,
//   Stack,
//   Alert,
//   Chip,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Avatar,
//   Tooltip,
//   Checkbox,
//   alpha,
//   CircularProgress,
//   TableSortLabel
// } from '@mui/material';

// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   MoreVert as MoreVertIcon,
//   Description as DescriptionIcon,
//   Send as SendIcon,
//   CheckCircle as CheckCircleIcon,
//   Refresh as RefreshIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon,
//   Assignment as AssignmentIcon,
//   AccessTime as AccessTimeIcon,
//   Error as ErrorIcon,
//   Visibility as VisibilityIcon,
//   Person as PersonIcon,
//   Work as WorkIcon,
//   CalendarToday as CalendarIcon
// } from '@mui/icons-material';

// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';

// /* COMPONENTS */
// import GenerateAppointmentLetter from './GenerateAppointmentLetter';
// import SendAppointmentLetter from './SendAppointmentLetter';
// import AcceptAppointmentLetter from './Accept';

// // Color constants matching other components
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF',
//     lightMuted: 'rgba(255, 255, 255, 0.9)'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F'
//   },
//   border: '#E3E8EF',
//   status: {
//     success: '#9FE2BF',
//     warning: '#FEF3C7',
//     error: '#FEE2E2',
//     info: '#E0F2FE'
//   },
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     suspended: '#FEF3C7',
//     locked: '#FEE2E2'
//   }
// };

// // Status color mapping
// const STATUS_STYLES = {
//   pending: { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <AccessTimeIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending' },
//   generated: { bg: COLORS.status.warning, color: '#92400E', icon: <DescriptionIcon sx={{ fontSize: '0.7rem' }} />, label: 'Generated' },
//   sent: { bg: COLORS.status.info, color: '#0369A1', icon: <SendIcon sx={{ fontSize: '0.7rem' }} />, label: 'Sent' },
//   accepted: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Accepted' }
// };

// const getStatusStyle = (status) => {
//   return STATUS_STYLES[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <AccessTimeIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Pending' };
// };

// const AppointmentManagement = () => {
//   const [dataList, setDataList] = useState([]);
//   const [filteredList, setFilteredList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalCount, setTotalCount] = useState(0);
//   const [selected, setSelected] = useState([]);
//   const [orderBy, setOrderBy] = useState('generatedAt');
//   const [order, setOrder] = useState('desc');

//   const [actionAnchor, setActionAnchor] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Modal states
//   const [openGenerate, setOpenGenerate] = useState(false);
//   const [openSend, setOpenSend] = useState(false);
//   const [openAccept, setOpenAccept] = useState(false);

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setPage(0);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');

//       const lettersResponse = await axios.get(`${BASE_URL}/api/appointment-letter/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { page: page + 1, limit: rowsPerPage }
//       });

//       if (lettersResponse.data.success) {
//         const letters = lettersResponse.data.data || [];
//         const total = lettersResponse.data.total || letters.length;
        
//         const transformedData = letters.map(letter => {
//           const candidateInfo = letter.candidateId || {};
//           return {
//             _id: letter._id,
//             documentId: letter.documentId || letter._id,
//             firstName: candidateInfo.firstName || '',
//             lastName: candidateInfo.lastName || '',
//             fullName: candidateInfo.fullName || `${candidateInfo.firstName || ''} ${candidateInfo.lastName || ''}`.trim() || 'N/A',
//             email: candidateInfo.email || '',
//             phone: candidateInfo.phone || '',
//             candidateId: candidateInfo._id || candidateInfo.id || 'N/A',
//             letterStatus: letter.status || 'pending',
//             appointmentLetter: letter,
//             fileUrl: letter.fileUrl,
//             generatedAt: letter.generatedAt || letter.createdAt,
//             joiningDate: letter.joiningDate || '',
//             offerDesignation: letter.offerDesignation || letter.offerId?.offerDetails?.designation || 'N/A',
//             sentAt: letter.sentAt,
//             acceptedAt: letter.acceptedAt,
//             offerId: letter.offerId?._id || letter.offerId
//           };
//         });

//         setDataList(transformedData);
//         setFilteredList(transformedData);
//         setTotalCount(total);
//       } else {
//         setError(lettersResponse.data.message || 'Failed to load data');
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError(err.response?.data?.message || 'Failed to load data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     let filtered = [...dataList];
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(item =>
//         item.fullName?.toLowerCase().includes(term) ||
//         item.email?.toLowerCase().includes(term) ||
//         item.documentId?.toLowerCase().includes(term) ||
//         item.candidateId?.toLowerCase().includes(term) ||
//         item.letterStatus?.toLowerCase().includes(term)
//       );
//     }
    
//     if (orderBy) {
//       filtered.sort((a, b) => {
//         let aValue, bValue;
//         if (orderBy === 'candidate') {
//           aValue = a.fullName || '';
//           bValue = b.fullName || '';
//         } else {
//           aValue = a[orderBy] || '';
//           bValue = b[orderBy] || '';
//         }
//         if (order === 'asc') {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       });
//     }
    
//     setFilteredList(filtered);
//     setPage(0);
//   }, [dataList, searchTerm, orderBy, order]);

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleClearSearch = () => {
//     setSearchInput('');
//     setSearchTerm('');
//     setPage(0);
//   };

//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(paginatedList.map(item => item._id));
//     } else {
//       setSelected([]);
//     }
//   };

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

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleRefresh = () => {
//     fetchData();
//     showNotification("Data refreshed successfully", "success");
//   };

//   const handleBulkDelete = () => {
//     if (selected.length === 0) return;
//     showNotification(`Bulk delete for ${selected.length} items - API coming soon`, 'warning');
//   };

//   const handleActionOpen = (e, item) => {
//     e.stopPropagation();
//     setActionAnchor(e.currentTarget);
//     setSelectedItem(item);
//   };

//   const handleActionClose = () => {
//     setActionAnchor(null);
//     setTimeout(() => {
//       setSelectedItem(null);
//     }, 100);
//   };

//   const handleGenerateOpen = () => {
//     setOpenGenerate(true);
//     handleActionClose();
//   };

//   const handleSendOpen = () => {
//     setOpenSend(true);
//     handleActionClose();
//   };

//   const handleAcceptOpen = () => {
//     setOpenAccept(true);
//     handleActionClose();
//   };

//   const handleViewOpen = () => {
//     if (selectedItem?.fileUrl) {
//       window.open(selectedItem.fileUrl, '_blank');
//     }
//     handleActionClose();
//   };

//   const handleGenerateClose = (data) => {
//     setOpenGenerate(false);
//     if (data) {
//       fetchData();
//       showNotification("Appointment letter generated successfully", "success");
//     }
//     setSelectedItem(null);
//   };

//   const handleSendClose = (data) => {
//     setOpenSend(false);
//     if (data) {
//       fetchData();
//       showNotification("Appointment letter sent successfully", "success");
//     }
//     setSelectedItem(null);
//   };

//   const handleAcceptClose = (data) => {
//     setOpenAccept(false);
//     if (data) {
//       fetchData();
//       showNotification("Appointment letter accepted successfully", "success");
//     }
//     setSelectedItem(null);
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getDisplayName = (item) => {
//     if (!item) return 'N/A';
//     return item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A';
//   };

//   const getAvatarInitials = (name) => {
//     if (!name || name === 'N/A') return '?';
//     const parts = name.split(' ');
//     if (parts.length >= 2) {
//       return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
//     }
//     return name.substring(0, 2).toUpperCase();
//   };

//   const paginatedList = filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
//   const isFilterActive = searchTerm;

//   const inputStyle = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: 1.5,
//       fontSize: '0.75rem',
//       '&:hover fieldset': { borderColor: COLORS.primary },
//       '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//     },
//     '& .MuiInputBase-input': {
//       py: 1,
//       px: 1.5,
//       fontSize: '0.75rem',
//       color: COLORS.text.primary,
//       '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
//     }
//   };

//   return (
//     <Box sx={{ p: -1 }}>
//       {/* Page Header */}
//       {/* <Box sx={{ mb: 2.5 }}>
//         <Typography 
//           variant="h5" 
//           component="h1" 
//           sx={{ 
//             fontSize: '1.25rem',
//             fontWeight: 700,
//             color: COLORS.text.primary,
//             mb: 0.5,
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1
//           }}
//         >
//           <AssignmentIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
//           Appointment Management
//         </Typography>
//         <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//           Manage and track appointment letters for selected candidates
//         </Typography>
//       </Box> */}

//       {/* Action Bar */}
//       <Paper sx={{ 
//         p: 1.5, 
//         mb: 2.5, 
//         borderRadius: 2,
//         bgcolor: COLORS.background.white,
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: `1px solid ${COLORS.border}`
//       }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
//           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
//             <TextField
//               placeholder="Search by name, email, document ID..."
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               sx={{ 
//                 width: { xs: '100%', sm: 280 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1.5,
//                   fontSize: '0.75rem',
//                   '&:hover fieldset': { borderColor: COLORS.primary },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: searchInput && (
//                   <InputAdornment position="end">
//                     <IconButton size="small" onClick={handleClearSearch} edge="end">
//                       <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 sx: { 
//                   height: 36,
//                   bgcolor: COLORS.background.light,
//                   '& input': {
//                     padding: '6px 12px',
//                     fontSize: '0.75rem',
//                     color: COLORS.text.primary
//                   }
//                 }
//               }}
//               disabled={loading}
//             />

//             {isFilterActive && (
//               <Button
//                 variant="text"
//                 startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={handleClearSearch}
//                 sx={{ 
//                   height: 36,
//                   borderRadius: 1.5,
//                   fontSize: '0.7rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   color: COLORS.text.secondary
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}

//             {/* <Tooltip title="Refresh">
//               <IconButton
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 sx={{
//                   color: COLORS.text.secondary,
//                   '&:hover': { bgcolor: `${COLORS.primary}20` }
//                 }}
//               >
//                 <RefreshIcon sx={{ fontSize: '1rem' }} />
//               </IconButton>
//             </Tooltip> */}
//           </Stack>

//           <Stack direction="row" spacing={1.5}>
//             {selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={handleBulkDelete}
//                 sx={{ 
//                   height: 36,
//                   borderRadius: 1.5,
//                   textTransform: 'none',
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   borderColor: '#fee2e2',
//                   color: '#991b1b',
//                   '&:hover': { borderColor: '#fecaca', bgcolor: '#fee2e2' }
//                 }}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}

//             <Button
//               variant="contained"
//               startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//               onClick={() => setOpenGenerate(true)}
//               sx={{
//                 height: 36,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.75rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': { bgcolor: COLORS.primaryDark }
//               }}
//             >
//               Generate Letter
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Error Alert */}
//       {error && (
//         <Alert 
//           severity="error" 
//           sx={{ mb: 2.5, borderRadius: 1.5, fontSize: '0.75rem' }}
//           action={
//             <Button color="inherit" size="small" onClick={fetchData}>
//               Retry
//             </Button>
//           }
//         >
//           {error}
//         </Alert>
//       )}

//       {/* Table */}
//       <Paper sx={{ 
//         width: '100%', 
//         borderRadius: 2, 
//         overflow: 'hidden',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: `1px solid ${COLORS.border}`
//       }}>
//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ 
//                 bgcolor: COLORS.background.tableHeader,
//                 '& .MuiTableCell-root': {
//                   borderBottom: 'none',
//                   color: COLORS.text.light,
//                   py: 1.5
//                 }
//               }}>
//                 <TableCell padding="checkbox" sx={{ width: 40 }}>
//                   <Checkbox
//                     indeterminate={selected.length > 0 && selected.length < paginatedList.length}
//                     checked={paginatedList.length > 0 && selected.length === paginatedList.length}
//                     onChange={handleSelectAll}
//                     sx={{
//                       color: COLORS.text.light,
//                       '&.Mui-checked': { color: COLORS.text.light },
//                       '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
//                       '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
//                     }}
//                     disabled={loading || paginatedList.length === 0}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'candidate'}
//                     direction={orderBy === 'candidate' ? order : 'asc'}
//                     onClick={() => handleRequestSort('candidate')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Candidate
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Document ID
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Contact
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'letterStatus'}
//                     direction={orderBy === 'letterStatus' ? order : 'asc'}
//                     onClick={() => handleRequestSort('letterStatus')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Status
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'generatedAt'}
//                     direction={orderBy === 'generatedAt' ? order : 'asc'}
//                     onClick={() => handleRequestSort('generatedAt')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Generated On
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 80 }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
//                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
//                       Loading appointment letters...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedList.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <AssignmentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
//                       <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
//                         {isFilterActive ? 'No appointment letters match your filters' : 'No appointment letters available'}
//                       </Typography>
//                       <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                         {isFilterActive ? 'Try adjusting your search terms' : 'Click "Generate Letter" to create a new appointment letter'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedList.map((item, index) => {
//                   const isSelected = selected.includes(item._id);
//                   const statusStyle = getStatusStyle(item.letterStatus);
//                   const displayName = getDisplayName(item);
//                   const isActionMenuOpen = Boolean(actionAnchor) && selectedItem?._id === item._id;

//                   return (
//                     <TableRow
//                       key={item._id}
//                       hover
//                       selected={isSelected}
//                       sx={{ 
//                         bgcolor: COLORS.background.white,
//                         '&:hover': { bgcolor: COLORS.background.hover },
//                         '&.Mui-selected': {
//                           bgcolor: `${COLORS.primary}10`,
//                           '&:hover': { bgcolor: `${COLORS.primary}20` }
//                         },
//                         '& .MuiTableCell-root': {
//                           py: 1.5,
//                           fontSize: '0.75rem',
//                           borderColor: COLORS.border
//                         }
//                       }}
//                     >
//                       <TableCell padding="checkbox" sx={{ width: 40 }}>
//                         <Checkbox
//                           checked={isSelected}
//                           onChange={() => handleSelect(item._id)}
//                           sx={{
//                             color: COLORS.primary,
//                             '&.Mui-checked': { color: COLORS.primary },
//                             '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" spacing={1.5} alignItems="center">
//                           <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
//                             {getAvatarInitials(displayName)}
//                           </Avatar>
//                           <Box>
//                             <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                               {displayName}
//                             </Typography>
//                             <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                               ID: {item.candidateId}
//                             </Typography>
//                           </Box>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>
//                           {item.documentId}
//                         </Typography>
//                         <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                           {item.offerDesignation}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Stack spacing={0.5}>
//                           <Stack direction="row" alignItems="center" spacing={0.5}>
//                             <EmailIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                               {item.email || 'No email'}
//                             </Typography>
//                           </Stack>
//                           <Stack direction="row" alignItems="center" spacing={0.5}>
//                             <PhoneIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                               {item.phone || 'No phone'}
//                             </Typography>
//                           </Stack>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           icon={statusStyle.icon}
//                           label={statusStyle.label}
//                           size="small"
//                           sx={{
//                             bgcolor: statusStyle.bg,
//                             color: statusStyle.color,
//                             fontWeight: 500,
//                             fontSize: '0.65rem',
//                             height: 24,
//                             '& .MuiChip-icon': { fontSize: '0.7rem', color: statusStyle.color }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                           {formatDate(item.generatedAt)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center" sx={{ width: 80 }}>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => handleActionOpen(e, item)}
//                           sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}
//                         >
//                           <MoreVertIcon sx={{ fontSize: '0.9rem' }} />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filteredList.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             borderTop: `1px solid ${COLORS.border}`,
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//               fontSize: '0.7rem',
//               color: COLORS.text.secondary
//             },
//             '& .MuiTablePagination-select': { fontSize: '0.7rem' },
//             '& .MuiTablePagination-actions button': { color: COLORS.primary }
//           }}
//         />
//       </Paper>

//       {/* Action Menu */}
//       <Menu 
//         anchorEl={actionAnchor} 
//         open={Boolean(actionAnchor)} 
//         onClose={handleActionClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             mt: 1,
//             minWidth: 180,
//             borderRadius: 2,
//             border: `1px solid ${COLORS.border}`,
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//           }
//         }}
//       >
//         {selectedItem && (
//           <>
//             {selectedItem?.fileUrl && (
//               <MenuItem onClick={handleViewOpen} sx={{ py: 1.5 }}>
//                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                   <VisibilityIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     View/Download
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}

//             {selectedItem?.letterStatus === 'pending' && (
//               <MenuItem onClick={handleGenerateOpen} sx={{ py: 1.5 }}>
//                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                   <DescriptionIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     Generate Letter
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}

//             {selectedItem?.letterStatus === 'generated' && (
//               <MenuItem onClick={handleSendOpen} sx={{ py: 1.5 }}>
//                 <ListItemIcon sx={{ color: '#1976D2', minWidth: 36 }}>
//                   <SendIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     Send Letter
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}

//             {selectedItem?.letterStatus === 'sent' && (
//               <MenuItem onClick={handleAcceptOpen} sx={{ py: 1.5 }}>
//                 <ListItemIcon sx={{ color: '#2E7D32', minWidth: 36 }}>
//                   <CheckCircleIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     Accept Letter
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}

//             {selectedItem?.letterStatus === 'accepted' && (
//               <MenuItem disabled sx={{ py: 1.5 }}>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
//                     Letter already accepted
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}
//           </>
//         )}
//       </Menu>

//       {/* Modals */}
//       <GenerateAppointmentLetter
//         open={openGenerate}
//         onClose={handleGenerateClose}
//         onSubmit={handleGenerateClose}
//       />

//       <SendAppointmentLetter
//         open={openSend}
//         onClose={handleSendClose}
//         onSend={handleSendClose}
//         selectedItem={selectedItem}
//       />

//       <AcceptAppointmentLetter
//         open={openAccept}
//         onClose={handleAcceptClose}
//         onAccept={handleAcceptClose}
//         documentId={selectedItem?.documentId}
//       />

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={snackbar.severity} 
//           variant="filled"
//           sx={{ 
//             width: '100%',
//             borderRadius: 1.5,
//             fontSize: '0.75rem',
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//             '& .MuiAlert-icon': { fontSize: '1.25rem' }
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AppointmentManagement;


// import React, { useState, useEffect, useCallback } from 'react';
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
//   Typography,
//   Snackbar,
//   TablePagination,
//   Stack,
//   Alert,
//   Chip,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Avatar,
//   Tooltip,
//   Checkbox,
//   alpha,
//   CircularProgress,
//   TableSortLabel
// } from '@mui/material';

// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   MoreVert as MoreVertIcon,
//   Description as DescriptionIcon,
//   Send as SendIcon,
//   CheckCircle as CheckCircleIcon,
//   Refresh as RefreshIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon,
//   Assignment as AssignmentIcon,
//   AccessTime as AccessTimeIcon,
//   Error as ErrorIcon,
//   Visibility as VisibilityIcon,
//   Person as PersonIcon,
//   Work as WorkIcon,
//   CalendarToday as CalendarIcon
// } from '@mui/icons-material';

// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';
// import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../../utils/modulePermissions';

// /* COMPONENTS */
// import GenerateAppointmentLetter from './GenerateAppointmentLetter';
// import SendAppointmentLetter from './SendAppointmentLetter';
// import AcceptAppointmentLetter from './Accept';

// // Color constants matching other components
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF',
//     lightMuted: 'rgba(255, 255, 255, 0.9)'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F'
//   },
//   border: '#E3E8EF',
//   status: {
//     success: '#9FE2BF',
//     warning: '#FEF3C7',
//     error: '#FEE2E2',
//     info: '#E0F2FE'
//   },
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     suspended: '#FEF3C7',
//     locked: '#FEE2E2'
//   }
// };

// // Loading state component
// const LoadingState = () => (
//   <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//     <CircularProgress size={40} sx={{ color: COLORS.primary }} />
//   </Box>
// );

// // Access Denied component
// const AccessDenied = () => (
//   <Box sx={{ p: 4, textAlign: 'center' }}>
//     <Typography variant="h6" color="error" sx={{ mb: 2, fontSize: '1rem' }}>
//       Access Denied
//     </Typography>
//     <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//       You don't have permission to view this page. Please contact your administrator.
//     </Typography>
//   </Box>
// );

// // Status color mapping
// const STATUS_STYLES = {
//   pending: { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <AccessTimeIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending' },
//   generated: { bg: COLORS.status.warning, color: '#92400E', icon: <DescriptionIcon sx={{ fontSize: '0.7rem' }} />, label: 'Generated' },
//   sent: { bg: COLORS.status.info, color: '#0369A1', icon: <SendIcon sx={{ fontSize: '0.7rem' }} />, label: 'Sent' },
//   accepted: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Accepted' }
// };

// const getStatusStyle = (status) => {
//   return STATUS_STYLES[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <AccessTimeIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Pending' };
// };

// const AppointmentManagement = () => {
//   const [dataList, setDataList] = useState([]);
//   const [filteredList, setFilteredList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalCount, setTotalCount] = useState(0);
//   const [selected, setSelected] = useState([]);
//   const [orderBy, setOrderBy] = useState('generatedAt');
//   const [order, setOrder] = useState('desc');

//   const [actionAnchor, setActionAnchor] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Modal states
//   const [openGenerate, setOpenGenerate] = useState(false);
//   const [openSend, setOpenSend] = useState(false);
//   const [openAccept, setOpenAccept] = useState(false);

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   // User permissions state
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [permissionsLoaded, setPermissionsLoaded] = useState(false);

//   // Fetch user permissions from /api/auth/me
//   useEffect(() => {
//     const fetchUserPermissions = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('No token found');
//           setPermissionsLoaded(true);
//           return;
//         }

//         const response = await axios.get(`${BASE_URL}/api/auth/me`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         if (response.data.success) {
//           const userData = response.data.data;
//           setIsSuperAdmin(userData.isSuperAdmin || false);
          
//           // Set permissions array
//           if (userData.permissions && Array.isArray(userData.permissions)) {
//             setUserPermissions(userData.permissions);
//           } else {
//             setUserPermissions([]);
//           }
//         } else {
//           setUserPermissions([]);
//         }
//       } catch (err) {
//         console.error('Error fetching user permissions:', err);
//         setUserPermissions([]);
//       } finally {
//         setPermissionsLoaded(true);
//       }
//     };
    
//     fetchUserPermissions();
//   }, []);

//   // Check permission helper
//   const checkPermission = (action) => {
//     // Super admin has all permissions
//     if (isSuperAdmin) return true;
    
//     return hasPermission(
//       userPermissions,
//       MODULES.SELECTED_CANDIDATES_MASTER,
//       PAGES.SELECTED_CANDIDATE,
//       action
//     );
//   };

//   // Permission checks
//   const canViewPage = checkPermission(ACTIONS.VIEW);
//   const canCreate = checkPermission(ACTIONS.CREATE);
//   const canUpdate = checkPermission(ACTIONS.UPDATE);
//   const canDelete = checkPermission(ACTIONS.DELETE);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setPage(0);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const fetchData = useCallback(async () => {
//     // Only fetch if user has view permission
//     if (!canViewPage && !isSuperAdmin) return;
    
//     try {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');

//       const lettersResponse = await axios.get(`${BASE_URL}/api/appointment-letter/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { page: page + 1, limit: rowsPerPage }
//       });

//       if (lettersResponse.data.success) {
//         const letters = lettersResponse.data.data || [];
//         const total = lettersResponse.data.total || letters.length;
        
//         const transformedData = letters.map(letter => {
//           const candidateInfo = letter.candidateId || {};
//           return {
//             _id: letter._id,
//             documentId: letter.documentId || letter._id,
//             firstName: candidateInfo.firstName || '',
//             lastName: candidateInfo.lastName || '',
//             fullName: candidateInfo.fullName || `${candidateInfo.firstName || ''} ${candidateInfo.lastName || ''}`.trim() || 'N/A',
//             email: candidateInfo.email || '',
//             phone: candidateInfo.phone || '',
//             candidateId: candidateInfo._id || candidateInfo.id || 'N/A',
//             letterStatus: letter.status || 'pending',
//             appointmentLetter: letter,
//             fileUrl: letter.fileUrl,
//             generatedAt: letter.generatedAt || letter.createdAt,
//             joiningDate: letter.joiningDate || '',
//             offerDesignation: letter.offerDesignation || letter.offerId?.offerDetails?.designation || 'N/A',
//             sentAt: letter.sentAt,
//             acceptedAt: letter.acceptedAt,
//             offerId: letter.offerId?._id || letter.offerId
//           };
//         });

//         setDataList(transformedData);
//         setFilteredList(transformedData);
//         setTotalCount(total);
//       } else {
//         setError(lettersResponse.data.message || 'Failed to load data');
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError(err.response?.data?.message || 'Failed to load data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage, canViewPage, isSuperAdmin]);

//   useEffect(() => {
//     if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
//       fetchData();
//     }
//   }, [fetchData, permissionsLoaded, canViewPage, isSuperAdmin]);

//   useEffect(() => {
//     let filtered = [...dataList];
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(item =>
//         item.fullName?.toLowerCase().includes(term) ||
//         item.email?.toLowerCase().includes(term) ||
//         item.documentId?.toLowerCase().includes(term) ||
//         item.candidateId?.toLowerCase().includes(term) ||
//         item.letterStatus?.toLowerCase().includes(term)
//       );
//     }
    
//     if (orderBy) {
//       filtered.sort((a, b) => {
//         let aValue, bValue;
//         if (orderBy === 'candidate') {
//           aValue = a.fullName || '';
//           bValue = b.fullName || '';
//         } else {
//           aValue = a[orderBy] || '';
//           bValue = b[orderBy] || '';
//         }
//         if (order === 'asc') {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       });
//     }
    
//     setFilteredList(filtered);
//     setPage(0);
//   }, [dataList, searchTerm, orderBy, order]);

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleClearSearch = () => {
//     setSearchInput('');
//     setSearchTerm('');
//     setPage(0);
//   };

//   // Handle select all - only if user has delete permission
//   const handleSelectAll = (event) => {
//     if (!canDelete && !isSuperAdmin) {
//       showNotification("You don't have permission to delete appointment letters", "error");
//       return;
//     }
    
//     if (event.target.checked) {
//       setSelected(paginatedList.map(item => item._id));
//     } else {
//       setSelected([]);
//     }
//   };

//   // Handle single selection - only if user has delete permission
//   const handleSelect = (id) => {
//     if (!canDelete && !isSuperAdmin) {
//       showNotification("You don't have permission to delete appointment letters", "error");
//       return;
//     }
    
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];
//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else {
//       newSelected = selected.filter(item => item !== id);
//     }
//     setSelected(newSelected);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleRefresh = () => {
//     fetchData();
//     showNotification("Data refreshed successfully", "success");
//   };

//   const handleBulkDelete = () => {
//     if (!canDelete && !isSuperAdmin) {
//       showNotification("You don't have permission to delete appointment letters", "error");
//       return;
//     }
    
//     if (selected.length === 0) return;
//     showNotification(`Bulk delete for ${selected.length} items - API coming soon`, 'warning');
//   };

//   const handleActionOpen = (e, item) => {
//     e.stopPropagation();
//     setActionAnchor(e.currentTarget);
//     setSelectedItem(item);
//   };

//   const handleActionClose = () => {
//     setActionAnchor(null);
//     setTimeout(() => {
//       setSelectedItem(null);
//     }, 100);
//   };

//   const handleGenerateOpen = () => {
//     if (!canCreate && !isSuperAdmin) {
//       showNotification("You don't have permission to generate appointment letters", "error");
//       return;
//     }
//     setOpenGenerate(true);
//     handleActionClose();
//   };

//   const handleSendOpen = () => {
//     if (!canUpdate && !isSuperAdmin) {
//       showNotification("You don't have permission to send appointment letters", "error");
//       return;
//     }
//     setOpenSend(true);
//     handleActionClose();
//   };

//   const handleAcceptOpen = () => {
//     if (!canUpdate && !isSuperAdmin) {
//       showNotification("You don't have permission to accept appointment letters", "error");
//       return;
//     }
//     setOpenAccept(true);
//     handleActionClose();
//   };

//   const handleViewOpen = () => {
//     if (!canViewPage && !isSuperAdmin) {
//       showNotification("You don't have permission to view appointment letters", "error");
//       return;
//     }
//     if (selectedItem?.fileUrl) {
//       window.open(selectedItem.fileUrl, '_blank');
//     }
//     handleActionClose();
//   };

//   const handleGenerateClose = (data) => {
//     setOpenGenerate(false);
//     if (data) {
//       fetchData();
//       showNotification("Appointment letter generated successfully", "success");
//     }
//     setSelectedItem(null);
//   };

//   const handleSendClose = (data) => {
//     setOpenSend(false);
//     if (data) {
//       fetchData();
//       showNotification("Appointment letter sent successfully", "success");
//     }
//     setSelectedItem(null);
//   };

//   const handleAcceptClose = (data) => {
//     setOpenAccept(false);
//     if (data) {
//       fetchData();
//       showNotification("Appointment letter accepted successfully", "success");
//     }
//     setSelectedItem(null);
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getDisplayName = (item) => {
//     if (!item) return 'N/A';
//     return item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A';
//   };

//   const getAvatarInitials = (name) => {
//     if (!name || name === 'N/A') return '?';
//     const parts = name.split(' ');
//     if (parts.length >= 2) {
//       return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
//     }
//     return name.substring(0, 2).toUpperCase();
//   };

//   const paginatedList = filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
//   const isFilterActive = searchTerm;

//   // Show loading state while permissions are being fetched
//   if (!permissionsLoaded) {
//     return <LoadingState />;
//   }

//   // If user doesn't have view permission, show access denied
//   if (!canViewPage && !isSuperAdmin) {
//     return <AccessDenied />;
//   }

//   return (
//     <Box sx={{ p: -1 }}>
//       {/* Action Bar */}
//       <Paper sx={{ 
//         p: 1.5, 
//         mb: 2.5, 
//         borderRadius: 2,
//         bgcolor: COLORS.background.white,
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: `1px solid ${COLORS.border}`
//       }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
//           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
//             <TextField
//               placeholder="Search by name, email, document ID..."
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               sx={{ 
//                 width: { xs: '100%', sm: 280 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1.5,
//                   fontSize: '0.75rem',
//                   '&:hover fieldset': { borderColor: COLORS.primary },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: searchInput && (
//                   <InputAdornment position="end">
//                     <IconButton size="small" onClick={handleClearSearch} edge="end">
//                       <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 sx: { 
//                   height: 36,
//                   bgcolor: COLORS.background.light,
//                   '& input': {
//                     padding: '6px 12px',
//                     fontSize: '0.75rem',
//                     color: COLORS.text.primary
//                   }
//                 }
//               }}
//               disabled={loading}
//             />

//             {isFilterActive && (
//               <Button
//                 variant="text"
//                 startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={handleClearSearch}
//                 sx={{ 
//                   height: 36,
//                   borderRadius: 1.5,
//                   fontSize: '0.7rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   color: COLORS.text.secondary
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </Stack>

//           <Stack direction="row" spacing={1.5}>
//             {/* Bulk Delete Button - Only show if user has delete permission */}
//             {(canDelete || isSuperAdmin) && selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={handleBulkDelete}
//                 sx={{ 
//                   height: 36,
//                   borderRadius: 1.5,
//                   textTransform: 'none',
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   borderColor: '#fee2e2',
//                   color: '#991b1b',
//                   '&:hover': { borderColor: '#fecaca', bgcolor: '#fee2e2' }
//                 }}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}

//             {/* Generate Letter Button - Only show if user has create permission */}
//             {(canCreate || isSuperAdmin) && (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={() => setOpenGenerate(true)}
//                 sx={{
//                   height: 36,
//                   borderRadius: 1.5,
//                   bgcolor: COLORS.primary,
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': { bgcolor: COLORS.primaryDark }
//                 }}
//               >
//                 Generate Letter
//               </Button>
//             )}
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Error Alert */}
//       {error && (
//         <Alert 
//           severity="error" 
//           sx={{ mb: 2.5, borderRadius: 1.5, fontSize: '0.75rem' }}
//           action={
//             <Button color="inherit" size="small" onClick={fetchData}>
//               Retry
//             </Button>
//           }
//         >
//           {error}
//         </Alert>
//       )}

//       {/* Table */}
//       <Paper sx={{ 
//         width: '100%', 
//         borderRadius: 2, 
//         overflow: 'hidden',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: `1px solid ${COLORS.border}`
//       }}>
//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ 
//                 bgcolor: COLORS.background.tableHeader,
//                 '& .MuiTableCell-root': {
//                   borderBottom: 'none',
//                   color: COLORS.text.light,
//                   py: 1.5
//                 }
//               }}>
//                 {/* Checkbox Column - Only show if user has delete permission */}
//                 {(canDelete || isSuperAdmin) && (
//                   <TableCell padding="checkbox" sx={{ width: 40 }}>
//                     <Checkbox
//                       indeterminate={selected.length > 0 && selected.length < paginatedList.length}
//                       checked={paginatedList.length > 0 && selected.length === paginatedList.length}
//                       onChange={handleSelectAll}
//                       sx={{
//                         color: COLORS.text.light,
//                         '&.Mui-checked': { color: COLORS.text.light },
//                         '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
//                         '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
//                       }}
//                       disabled={loading || paginatedList.length === 0}
//                     />
//                   </TableCell>
//                 )}
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'candidate'}
//                     direction={orderBy === 'candidate' ? order : 'asc'}
//                     onClick={() => handleRequestSort('candidate')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Candidate
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Document ID
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Contact
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'letterStatus'}
//                     direction={orderBy === 'letterStatus' ? order : 'asc'}
//                     onClick={() => handleRequestSort('letterStatus')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Status
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'generatedAt'}
//                     direction={orderBy === 'generatedAt' ? order : 'asc'}
//                     onClick={() => handleRequestSort('generatedAt')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Generated On
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 80 }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={(canDelete || isSuperAdmin) ? 7 : 6} align="center" sx={{ py: 6 }}>
//                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
//                       Loading appointment letters...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedList.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={(canDelete || isSuperAdmin) ? 7 : 6} align="center" sx={{ py: 6 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <AssignmentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
//                       <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
//                         {isFilterActive ? 'No appointment letters match your filters' : 'No appointment letters available'}
//                       </Typography>
//                       <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                         {isFilterActive ? 'Try adjusting your search terms' : 'Click "Generate Letter" to create a new appointment letter'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedList.map((item, index) => {
//                   const isSelected = selected.includes(item._id);
//                   const statusStyle = getStatusStyle(item.letterStatus);
//                   const displayName = getDisplayName(item);
//                   const isActionMenuOpen = Boolean(actionAnchor) && selectedItem?._id === item._id;

//                   return (
//                     <TableRow
//                       key={item._id}
//                       hover
//                       selected={isSelected}
//                       sx={{ 
//                         bgcolor: COLORS.background.white,
//                         '&:hover': { bgcolor: COLORS.background.hover },
//                         '&.Mui-selected': {
//                           bgcolor: `${COLORS.primary}10`,
//                           '&:hover': { bgcolor: `${COLORS.primary}20` }
//                         },
//                         '& .MuiTableCell-root': {
//                           py: 1.5,
//                           fontSize: '0.75rem',
//                           borderColor: COLORS.border
//                         }
//                       }}
//                     >
//                       {/* Checkbox Column - Only show if user has delete permission */}
//                       {(canDelete || isSuperAdmin) && (
//                         <TableCell padding="checkbox" sx={{ width: 40 }}>
//                           <Checkbox
//                             checked={isSelected}
//                             onChange={() => handleSelect(item._id)}
//                             sx={{
//                               color: COLORS.primary,
//                               '&.Mui-checked': { color: COLORS.primary },
//                               '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
//                             }}
//                           />
//                         </TableCell>
//                       )}
//                       <TableCell>
//                         <Stack direction="row" spacing={1.5} alignItems="center">
//                           <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
//                             {getAvatarInitials(displayName)}
//                           </Avatar>
//                           <Box>
//                             <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                               {displayName}
//                             </Typography>
//                             <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                               ID: {item.candidateId}
//                             </Typography>
//                           </Box>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>
//                           {item.documentId}
//                         </Typography>
//                         <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                           {item.offerDesignation}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Stack spacing={0.5}>
//                           <Stack direction="row" alignItems="center" spacing={0.5}>
//                             <EmailIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                               {item.email || 'No email'}
//                             </Typography>
//                           </Stack>
//                           <Stack direction="row" alignItems="center" spacing={0.5}>
//                             <PhoneIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                               {item.phone || 'No phone'}
//                             </Typography>
//                           </Stack>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           icon={statusStyle.icon}
//                           label={statusStyle.label}
//                           size="small"
//                           sx={{
//                             bgcolor: statusStyle.bg,
//                             color: statusStyle.color,
//                             fontWeight: 500,
//                             fontSize: '0.65rem',
//                             height: 24,
//                             '& .MuiChip-icon': { fontSize: '0.7rem', color: statusStyle.color }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                           {formatDate(item.generatedAt)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center" sx={{ width: 80 }}>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => handleActionOpen(e, item)}
//                           sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}
//                         >
//                           <MoreVertIcon sx={{ fontSize: '0.9rem' }} />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filteredList.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             borderTop: `1px solid ${COLORS.border}`,
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//               fontSize: '0.7rem',
//               color: COLORS.text.secondary
//             },
//             '& .MuiTablePagination-select': { fontSize: '0.7rem' },
//             '& .MuiTablePagination-actions button': { color: COLORS.primary }
//           }}
//         />
//       </Paper>

//       {/* Action Menu */}
//       <Menu 
//         anchorEl={actionAnchor} 
//         open={Boolean(actionAnchor)} 
//         onClose={handleActionClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             mt: 1,
//             minWidth: 180,
//             borderRadius: 2,
//             border: `1px solid ${COLORS.border}`,
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//           }
//         }}
//       >
//         {selectedItem && (
//           <>
//             {selectedItem?.fileUrl && (canViewPage || isSuperAdmin) && (
//               <MenuItem onClick={handleViewOpen} sx={{ py: 1.5 }}>
//                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                   <VisibilityIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     View/Download
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}

//             {selectedItem?.letterStatus === 'pending' && (canCreate || isSuperAdmin) && (
//               <MenuItem onClick={handleGenerateOpen} sx={{ py: 1.5 }}>
//                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                   <DescriptionIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     Generate Letter
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}

//             {selectedItem?.letterStatus === 'generated' && (canUpdate || isSuperAdmin) && (
//               <MenuItem onClick={handleSendOpen} sx={{ py: 1.5 }}>
//                 <ListItemIcon sx={{ color: '#1976D2', minWidth: 36 }}>
//                   <SendIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     Send Letter
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}

//             {selectedItem?.letterStatus === 'sent' && (canUpdate || isSuperAdmin) && (
//               <MenuItem onClick={handleAcceptOpen} sx={{ py: 1.5 }}>
//                 <ListItemIcon sx={{ color: '#2E7D32', minWidth: 36 }}>
//                   <CheckCircleIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     Accept Letter
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}

//             {selectedItem?.letterStatus === 'accepted' && (
//               <MenuItem disabled sx={{ py: 1.5 }}>
//                 <ListItemText>
//                   <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
//                     Letter already accepted
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}
//           </>
//         )}
//       </Menu>

//       {/* Modals - Only render if user has appropriate permissions */}
//       {(canCreate || isSuperAdmin) && (
//         <GenerateAppointmentLetter
//           open={openGenerate}
//           onClose={handleGenerateClose}
//           onSubmit={handleGenerateClose}
//         />
//       )}

//       {(canUpdate || isSuperAdmin) && (
//         <SendAppointmentLetter
//           open={openSend}
//           onClose={handleSendClose}
//           onSend={handleSendClose}
//           selectedItem={selectedItem}
//         />
//       )}

//       {(canUpdate || isSuperAdmin) && (
//         <AcceptAppointmentLetter
//           open={openAccept}
//           onClose={handleAcceptClose}
//           onAccept={handleAcceptClose}
//           documentId={selectedItem?.documentId}
//         />
//       )}

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={snackbar.severity} 
//           variant="filled"
//           sx={{ 
//             width: '100%',
//             borderRadius: 1.5,
//             fontSize: '0.75rem',
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//             '& .MuiAlert-icon': { fontSize: '1.25rem' }
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AppointmentManagement;


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
  CircularProgress,
  TableSortLabel
} from '@mui/material';

import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../../utils/modulePermissions';

/* COMPONENTS */
import GenerateAppointmentLetter from './GenerateAppointmentLetter';
import SendAppointmentLetter from './SendAppointmentLetter';
import AcceptAppointmentLetter from './Accept';

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

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error" sx={{ mb: 2, fontSize: '1rem' }}>
      Access Denied
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Status color mapping
const STATUS_STYLES = {
  pending: { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <AccessTimeIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending' },
  generated: { bg: COLORS.status.warning, color: '#92400E', icon: <DescriptionIcon sx={{ fontSize: '0.7rem' }} />, label: 'Generated' },
  sent: { bg: COLORS.status.info, color: '#0369A1', icon: <SendIcon sx={{ fontSize: '0.7rem' }} />, label: 'Sent' },
  accepted: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Accepted' }
};

const getStatusStyle = (status) => {
  return STATUS_STYLES[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <AccessTimeIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Pending' };
};

const AppointmentManagement = () => {
  const [dataList, setDataList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('generatedAt');
  const [order, setOrder] = useState('desc');

  const [actionAnchor, setActionAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Modal states
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openSend, setOpenSend] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Fetch user permissions from /api/auth/me
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setPermissionsLoaded(true);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          
          // Set permissions array
          if (userData.permissions && Array.isArray(userData.permissions)) {
            setUserPermissions(userData.permissions);
          } else {
            setUserPermissions([]);
          }
        } else {
          setUserPermissions([]);
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
    // Super admin has all permissions
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      MODULES.SELECTED_CANDIDATES_MASTER,
      PAGES.SELECTED_CANDIDATE,
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

  const fetchData = useCallback(async () => {
    // Only fetch if user has view permission
    if (!canViewPage && !isSuperAdmin) return;
    
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      const lettersResponse = await axios.get(`${BASE_URL}/api/appointment-letter/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: page + 1, limit: rowsPerPage }
      });

      if (lettersResponse.data.success) {
        const letters = lettersResponse.data.data || [];
        const total = lettersResponse.data.total || letters.length;
        
        const transformedData = letters.map(letter => {
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

        setDataList(transformedData);
        setFilteredList(transformedData);
        setTotalCount(total);
      } else {
        setError(lettersResponse.data.message || 'Failed to load data');
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchData();
    }
  }, [fetchData, permissionsLoaded, canViewPage, isSuperAdmin]);

  useEffect(() => {
    let filtered = [...dataList];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.fullName?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.documentId?.toLowerCase().includes(term) ||
        item.candidateId?.toLowerCase().includes(term) ||
        item.letterStatus?.toLowerCase().includes(term)
      );
    }
    
    if (orderBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (orderBy === 'candidate') {
          aValue = a.fullName || '';
          bValue = b.fullName || '';
        } else {
          aValue = a[orderBy] || '';
          bValue = b[orderBy] || '';
        }
        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    setFilteredList(filtered);
    setPage(0);
  }, [dataList, searchTerm, orderBy, order]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
  };

  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification("You don't have permission to delete appointment letters", "error");
      return;
    }
    
    if (event.target.checked) {
      setSelected(paginatedList.map(item => item._id));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection - only if user has delete permission
  const handleSelect = (id) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification("You don't have permission to delete appointment letters", "error");
      return;
    }
    
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

  const handleRefresh = () => {
    fetchData();
    showNotification("Data refreshed successfully", "success");
  };

  const handleBulkDelete = () => {
    if (!canDelete && !isSuperAdmin) {
      showNotification("You don't have permission to delete appointment letters", "error");
      return;
    }
    
    if (selected.length === 0) return;
    showNotification(`Bulk delete for ${selected.length} items - API coming soon`, 'warning');
  };

  const handleActionOpen = (e, item) => {
    e.stopPropagation();
    setActionAnchor(e.currentTarget);
    setSelectedItem(item);
  };

  const handleActionClose = () => {
    setActionAnchor(null);
    setTimeout(() => {
      setSelectedItem(null);
    }, 100);
  };

  const handleGenerateOpen = () => {
    if (!canCreate && !isSuperAdmin) {
      showNotification("You don't have permission to generate appointment letters", "error");
      return;
    }
    setOpenGenerate(true);
    handleActionClose();
  };

  const handleSendOpen = () => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification("You don't have permission to send appointment letters", "error");
      return;
    }
    setOpenSend(true);
    handleActionClose();
  };

  const handleAcceptOpen = () => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification("You don't have permission to accept appointment letters", "error");
      return;
    }
    setOpenAccept(true);
    handleActionClose();
  };

  const handleViewOpen = () => {
    if (!canViewPage && !isSuperAdmin) {
      showNotification("You don't have permission to view appointment letters", "error");
      return;
    }
    if (selectedItem?.fileUrl) {
      window.open(selectedItem.fileUrl, '_blank');
    }
    handleActionClose();
  };

  const handleGenerateClose = (data) => {
    setOpenGenerate(false);
    if (data) {
      fetchData();
      showNotification("Appointment letter generated successfully", "success");
    }
    setSelectedItem(null);
  };

  const handleSendClose = (data) => {
    setOpenSend(false);
    if (data) {
      fetchData();
      showNotification("Appointment letter sent successfully", "success");
    }
    setSelectedItem(null);
  };

  const handleAcceptClose = (data) => {
    setOpenAccept(false);
    if (data) {
      fetchData();
      showNotification("Appointment letter accepted successfully", "success");
    }
    setSelectedItem(null);
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayName = (item) => {
    if (!item) return 'N/A';
    return item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A';
  };

  const getAvatarInitials = (name) => {
    if (!name || name === 'N/A') return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const paginatedList = filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isFilterActive = searchTerm;

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canViewPage && !isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ p: -1 }}>
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
              placeholder="Search by name, email, document ID..."
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
                    <IconButton size="small" onClick={handleClearSearch} edge="end">
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
              disabled={loading}
            />

            {isFilterActive && (
              <Button
                variant="text"
                startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleClearSearch}
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
          </Stack>

          <Stack direction="row" spacing={1.5}>
            {/* Bulk Delete Button - Only show if user has delete permission */}
            {(canDelete || isSuperAdmin) && selected.length > 0 && (
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
                  '&:hover': { borderColor: '#fecaca', bgcolor: '#fee2e2' }
                }}
              >
                Delete ({selected.length})
              </Button>
            )}

            {/* Generate Letter Button - Only show if user has create permission */}
            {(canCreate || isSuperAdmin) && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenGenerate(true)}
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
                Generate Letter
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2.5, borderRadius: 1.5, fontSize: '0.75rem' }}
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Table */}
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
                {/* Checkbox Column - Only show if user has delete permission */}
                {(canDelete || isSuperAdmin) && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < paginatedList.length}
                      checked={paginatedList.length > 0 && selected.length === paginatedList.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: COLORS.text.light,
                        '&.Mui-checked': { color: COLORS.text.light },
                        '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                        '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                      }}
                      disabled={loading || paginatedList.length === 0}
                    />
                  </TableCell>
                )}
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
                  Document ID
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  <TableSortLabel
                    active={orderBy === 'letterStatus'}
                    direction={orderBy === 'letterStatus' ? order : 'asc'}
                    onClick={() => handleRequestSort('letterStatus')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  <TableSortLabel
                    active={orderBy === 'generatedAt'}
                    direction={orderBy === 'generatedAt' ? order : 'asc'}
                    onClick={() => handleRequestSort('generatedAt')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Generated On
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 80 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading appointment letters...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AssignmentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {isFilterActive ? 'No appointment letters match your filters' : 'No appointment letters available'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {isFilterActive ? 'Try adjusting your search terms' : 'Click "Generate Letter" to create a new appointment letter'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedList.map((item, index) => {
                  const isSelected = selected.includes(item._id);
                  const statusStyle = getStatusStyle(item.letterStatus);
                  const displayName = getDisplayName(item);
                  const isActionMenuOpen = Boolean(actionAnchor) && selectedItem?._id === item._id;

                  return (
                    <TableRow
                      key={item._id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                          '&:hover': { bgcolor: `${COLORS.primary}20` }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {(canDelete || isSuperAdmin) && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(item._id)}
                            sx={{
                              color: COLORS.primary,
                              '&.Mui-checked': { color: COLORS.primary },
                              '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
                            {getAvatarInitials(displayName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                              {displayName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {item.candidateId}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                          {item.documentId}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {item.offerDesignation}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <EmailIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                              {item.email || 'No email'}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <PhoneIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                              {item.phone || 'No phone'}
                            </Typography>
                          </Stack>
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
                            fontSize: '0.65rem',
                            height: 24,
                            '& .MuiChip-icon': { fontSize: '0.7rem', color: statusStyle.color }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {formatDate(item.generatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 80 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionOpen(e, item)}
                          sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}
                        >
                          <MoreVertIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
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
          count={filteredList.length}
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

      {/* Action Menu */}
      <Menu 
        anchorEl={actionAnchor} 
        open={Boolean(actionAnchor)} 
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
        {selectedItem && (
          <>
            {selectedItem?.fileUrl && (canViewPage || isSuperAdmin) && (
              <MenuItem onClick={handleViewOpen} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                  <VisibilityIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    View/Download
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}

            {selectedItem?.letterStatus === 'pending' && (canCreate || isSuperAdmin) && (
              <MenuItem onClick={handleGenerateOpen} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    Generate Letter
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}

            {selectedItem?.letterStatus === 'generated' && (canUpdate || isSuperAdmin) && (
              <MenuItem onClick={handleSendOpen} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ color: '#1976D2', minWidth: 36 }}>
                  <SendIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    Send Letter
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}

            {selectedItem?.letterStatus === 'sent' && (canUpdate || isSuperAdmin) && (
              <MenuItem onClick={handleAcceptOpen} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ color: '#2E7D32', minWidth: 36 }}>
                  <CheckCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    Accept Letter
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}

            {selectedItem?.letterStatus === 'accepted' && (
              <MenuItem disabled sx={{ py: 1.5 }}>
                <ListItemText>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                    Letter already accepted
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Modals - Only render if user has appropriate permissions */}
      {(canCreate || isSuperAdmin) && (
        <GenerateAppointmentLetter
          open={openGenerate}
          onClose={handleGenerateClose}
          onSubmit={handleGenerateClose}
        />
      )}

      {(canUpdate || isSuperAdmin) && (
        <SendAppointmentLetter
          open={openSend}
          onClose={handleSendClose}
          onSend={handleSendClose}
          selectedItem={selectedItem}
        />
      )}

      {(canUpdate || isSuperAdmin) && (
        <AcceptAppointmentLetter
          open={openAccept}
          onClose={handleAcceptClose}
          onAccept={handleAcceptClose}
          documentId={selectedItem?.documentId}
        />
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': { fontSize: '1.25rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentManagement;