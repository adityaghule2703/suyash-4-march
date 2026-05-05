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
//   Divider
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
//   Sort as SortIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Import modal components
// import AddDesignations from './AddDesignations';
// import EditDesignations from './EditDesignations';
// import ViewDesignations from './ViewDesignations';
// import DeleteDesignations from './DeleteDesignations';

// // Color constants - EXACT SAME as header gradient
// const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)'; // from-cyan-900 via-[#00B4D8] to-cyan-700
// const STRIPE_COLOR_ODD = '#FFFFFF';
// const STRIPE_COLOR_EVEN = '#f8fafc'; // slate-50
// const HOVER_COLOR = '#f1f5f9'; // slate-100
// const PRIMARY_BLUE = '#00B4D8';
// const TEXT_COLOR_HEADER = '#FFFFFF';
// const TEXT_COLOR_MAIN = '#0f172a'; // slate-900

// // Action Menu Component
// const ActionMenu = ({ designation, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
//   return (
//     <>
//       <Tooltip title="Actions">
//         <IconButton
//           size="small"
//           onClick={onOpen}
//           sx={{
//             color: '#64748b', // slate-500
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
//             minWidth: 180,
//             borderRadius: 2,
//             border: '1px solid #e2e8f0'
//           }
//         }}
//       >
//         <MenuItem 
//           onClick={() => {
//             onView(designation);
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
//             onEdit(designation);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
//             <EditIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Edit</Typography>
//           </ListItemText>
//         </MenuItem>
//         <Divider sx={{ my: 0.5 }} />
//         <MenuItem 
//           onClick={() => {
//             onDelete(designation);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
//             <DeleteIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500} color="#EF4444">
//               Delete
//             </Typography>
//           </ListItemText>
//         </MenuItem>
//       </Menu>
//     </>
//   );
// };

// const DesignationMaster = () => {
//   // State for data
//   const [designations, setDesignations] = useState([]);
//   const [filteredDesignations, setFilteredDesignations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Table state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selected, setSelected] = useState([]);

//   // Sorting state
// const [sortField, setSortField] = useState(null);
// const [sortDirection, setSortDirection] = useState('asc');
  
//   // Menu state for action buttons
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedDesignationForAction, setSelectedDesignationForAction] = useState(null);
  
//   // Modal state
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openViewModal, setOpenViewModal] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
//   // Selected designation
//   const [selectedDesignation, setSelectedDesignation] = useState(null);
  
//   // Notification state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   // Fetch designations from API
//   useEffect(() => {
//     fetchDesignations();
//   }, []);

//   const fetchDesignations = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/designations`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setDesignations(response.data.data || []);
//         setFilteredDesignations(response.data.data || []);
//       } else {
//         showNotification('Failed to load designations', 'error');
//       }
//     } catch (err) {
//       console.error('Error fetching designations:', err);
//       showNotification('Failed to load designations. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Handle search
//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearchTerm(value);
    
//     const filtered = designations.filter(designation =>
//       designation.DesignationName.toLowerCase().includes(value) ||
//       (designation.Description && designation.Description.toLowerCase().includes(value))
//     );
    
//     setFilteredDesignations(filtered);
//     setPage(0);
//   };

//   const handleSort = (field) => {
//   let direction = 'asc';

//   if (sortField === field && sortDirection === 'asc') {
//     direction = 'desc';
//   }

//   setSortField(field);
//   setSortDirection(direction);

//   const sorted = [...filteredDesignations].sort((a, b) => {
//     let valueA = a[field];
//     let valueB = b[field];

//     if (typeof valueA === 'string') valueA = valueA.toLowerCase();
//     if (typeof valueB === 'string') valueB = valueB.toLowerCase();

//     if (valueA < valueB) return direction === 'asc' ? -1 : 1;
//     if (valueA > valueB) return direction === 'asc' ? 1 : -1;
//     return 0;
//   });

//   setFilteredDesignations(sorted);
// };
  
//   // Handle select all
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(filteredDesignations.map(designation => designation._id));
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
  
//   // Handle add designation
//   const handleAddDesignation = (newDesignation) => {
//     setDesignations([...designations, newDesignation]);
//     setFilteredDesignations([...filteredDesignations, newDesignation]);
//     showNotification('Designation added successfully!', 'success');
//   };
  
//   // Handle edit designation
//   const handleEditDesignation = (updatedDesignation) => {
//     const updatedDesignations = designations.map(designation =>
//       designation._id === updatedDesignation._id ? updatedDesignation : designation
//     );
    
//     setDesignations(updatedDesignations);
//     setFilteredDesignations(updatedDesignations);
//     showNotification('Designation updated successfully!', 'success');
//   };
  
//   // Handle delete designation
//   const handleDeleteDesignation = (designationId) => {
//     const updatedDesignations = designations.filter(designation => designation._id !== designationId);
//     setDesignations(updatedDesignations);
//     setFilteredDesignations(updatedDesignations);
//     setSelected(selected.filter(id => id !== designationId));
//     showNotification('Designation deleted successfully!', 'success');
//   };
  
//   // Handle bulk delete
//   const handleBulkDelete = () => {
//     showNotification('Bulk delete requires API implementation', 'warning');
//   };
  
//   // Action menu handlers
//   const handleActionMenuOpen = (event, designation) => {
//     setActionMenuAnchor(event.currentTarget);
//     setSelectedDesignationForAction(designation);
//   };

//   const handleActionMenuClose = () => {
//     setActionMenuAnchor(null);
//     setSelectedDesignationForAction(null);
//   };

//   // Open edit modal
//   const openEditDesignationModal = (designation) => {
//     setSelectedDesignation(designation);
//     setOpenEditModal(true);
//     handleActionMenuClose();
//   };
  
//   // Open view modal
//   const openViewDesignationModal = (designation) => {
//     setSelectedDesignation(designation);
//     setOpenViewModal(true);
//     handleActionMenuClose();
//   };
  
//   // Open delete confirmation
//   const openDeleteDesignationDialog = (designation) => {
//     setSelectedDesignation(designation);
//     setOpenDeleteDialog(true);
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
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };
  
//   // Get level badge style - Custom styles to match theme
//   const getLevelBadgeStyle = (level) => {
//     if (level <= 2) {
//       return {
//         bgcolor: '#dcfce7',
//         color: '#166534',
//         border: '1px solid #86efac'
//       };
//     }
//     if (level <= 4) {
//       return {
//         bgcolor: '#e0f2fe',
//         color: '#0c4a6e',
//         border: '1px solid #7dd3fc'
//       };
//     }
//     if (level <= 6) {
//       return {
//         bgcolor: '#fef3c7',
//         color: '#92400e',
//         border: '1px solid #fcd34d'
//       };
//     }
//     return {
//       bgcolor: '#fee2e2',
//       color: '#991b1b',
//       border: '1px solid #fca5a5'
//     };
//   };
  
//   // Get level text
//   const getLevelText = (level) => {
//     const levels = {
//       1: 'Entry Level',
//       2: 'Junior',
//       3: 'Mid Level',
//       4: 'Senior',
//       5: 'Lead',
//       6: 'Manager',
//       7: 'Director',
//       8: 'VP',
//       9: 'C-Level'
//     };
//     return levels[level] || `Level ${level}`;
//   };
  
//   // Paginated designations
//   const paginatedDesignations = filteredDesignations.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

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
//           Designation Master
//         </Typography>
//         <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
//           Manage and organize company designations and their hierarchy levels
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
//               placeholder="Search by name or description..."
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
//               Add Designation
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Designations Table */}
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
//                     indeterminate={selected.length > 0 && selected.length < filteredDesignations.length}
//                     checked={filteredDesignations.length > 0 && selected.length === filteredDesignations.length}
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
//                 <TableCell
//   onClick={() => handleSort("DesignationName")}
//   sx={{
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: "0.875rem",
//     py: 2,
//     color: TEXT_COLOR_HEADER
//   }}
// >
//   <Stack direction="row" alignItems="center" spacing={0.5}>
//     Designation Name

//     {sortField === "DesignationName" && sortDirection === "asc" ? (
//       <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER }} />
//     ) : (
//       <ArrowUpwardIcon
//         sx={{
//           fontSize: 14,
//           color: TEXT_COLOR_HEADER,
//           transform: "rotate(180deg)"
//         }}
//       />
//     )}
//   </Stack>
// </TableCell>
//                 <TableCell
//   onClick={() => handleSort("Level")}
//   sx={{
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: "0.875rem",
//     py: 2,
//     color: TEXT_COLOR_HEADER
//   }}
// >
//   <Stack direction="row" alignItems="center" spacing={0.5}>
//     Level
//     {sortField === "Level" && sortDirection === "asc" ? (
//       <ArrowUpwardIcon sx={{ fontSize: 14 }} />
//     ) : (
//       <ArrowUpwardIcon sx={{ fontSize: 14, transform: "rotate(180deg)" }} />
//     )}
//   </Stack>
// </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   fontSize: '0.875rem',
//                   py: 2,
//                   color: TEXT_COLOR_HEADER
//                 }}>
//                   Description
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   fontSize: '0.875rem',
//                   py: 2,
//                   color: TEXT_COLOR_HEADER
//                 }}>
//                   Created Date
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   fontSize: '0.875rem',
//                   py: 2,
//                   width: 100,
//                   color: TEXT_COLOR_HEADER
//                 }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
//                     <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
//                       Loading designations...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedDesignations.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <Typography variant="body1" color="#64748B" fontWeight={500}>
//                         {searchTerm ? 'No designations found' : 'No designations available'}
//                       </Typography>
//                       <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
//                         {searchTerm ? 'Try adjusting your search terms' : 'Add your first designation to get started'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedDesignations.map((designation, index) => {
//                   const isSelected = selected.includes(designation._id);
//                   const isOddRow = index % 2 === 0;
//                   const isActionMenuOpen = Boolean(actionMenuAnchor) && 
//                     selectedDesignationForAction?._id === designation._id;
//                   const levelStyle = getLevelBadgeStyle(designation.Level);

//                   return (
//                     <TableRow
//                       key={designation._id}
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
//                           onChange={() => handleSelect(designation._id)}
//                           sx={{
//                             color: PRIMARY_BLUE,
//                             '&.Mui-checked': {
//                               color: PRIMARY_BLUE,
//                             },
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" fontWeight={600} color={TEXT_COLOR_MAIN}>
//                           {designation.DesignationName}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" alignItems="center" spacing={1}>
//                           <Box
//                             sx={{
//                               px: 1.5,
//                               py: 0.5,
//                               borderRadius: 1,
//                               fontSize: '0.75rem',
//                               fontWeight: 600,
//                               display: 'inline-block',
//                               ...levelStyle
//                             }}
//                           >
//                             Level {designation.Level}
//                           </Box>
//                           <Typography variant="caption" color="#64748B">
//                             {getLevelText(designation.Level)}
//                           </Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Typography 
//                           variant="body2" 
//                           color="#475569"
//                           sx={{
//                             display: '-webkit-box',
//                             WebkitLineClamp: 2,
//                             WebkitBoxOrient: 'vertical',
//                             overflow: 'hidden',
//                             maxWidth: 300
//                           }}
//                         >
//                           {designation.Description || 'No description'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="#475569">
//                           {formatDate(designation.CreatedAt)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center" sx={{ width: 100 }}>
//                         <ActionMenu 
//                           designation={designation}
//                           onView={openViewDesignationModal}
//                           onEdit={openEditDesignationModal}
//                           onDelete={openDeleteDesignationDialog}
//                           anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
//                           onClose={handleActionMenuClose}
//                           onOpen={(e) => handleActionMenuOpen(e, designation)}
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
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filteredDesignations.length}
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

//       {/* Separate Modal Components */}
//       <AddDesignations 
//         open={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onAdd={handleAddDesignation}
//       />

//       {selectedDesignation && (
//         <>
//           <EditDesignations 
//             open={openEditModal}
//             onClose={() => {
//               setOpenEditModal(false);
//               setSelectedDesignation(null);
//             }}
//             designation={selectedDesignation}
//             onUpdate={handleEditDesignation}
//           />

//           <ViewDesignations 
//             open={openViewModal}
//             onClose={() => {
//               setOpenViewModal(false);
//               setSelectedDesignation(null);
//             }}
//             designation={selectedDesignation}
//             onEdit={() => {
//               setOpenViewModal(false);
//               setOpenEditModal(true);
//             }}
//           />

//           <DeleteDesignations 
//             open={openDeleteDialog}
//             onClose={() => {
//               setOpenDeleteDialog(false);
//               setSelectedDesignation(null);
//             }}
//             designation={selectedDesignation}
//             onDelete={handleDeleteDesignation}
//           />
//         </>
//       )}

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({...snackbar, open: false})}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={() => setSnackbar({...snackbar, open: false})} 
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

// export default DesignationMaster;

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
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddDesignations from './AddDesignations';
import EditDesignations from './EditDesignations';
import ViewDesignations from './ViewDesignations';
import DeleteDesignations from './DeleteDesignations';

// Color constants - Single color #063C3F throughout (matching CompanyMaster)
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

// Action Menu Component with permission checks
const ActionMenu = ({ designation, onView, onEdit, onDelete, anchorEl, onClose, onOpen, userPermissions, isSuperAdmin }) => {
  // Check permissions
  const canView = isSuperAdmin || hasPermission(userPermissions, MODULES.DESIGNATION_MASTER, PAGES.DESIGNATION_MASTER, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(userPermissions, MODULES.DESIGNATION_MASTER, PAGES.DESIGNATION_MASTER, ACTIONS.UPDATE);
  const canDelete = isSuperAdmin || hasPermission(userPermissions, MODULES.DESIGNATION_MASTER, PAGES.DESIGNATION_MASTER, ACTIONS.DELETE);

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
        {canView && (
          <MenuItem 
            onClick={() => {
              onView(designation);
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
        )}
        
        {canUpdate && (
          <MenuItem 
            onClick={() => {
              onEdit(designation);
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
        )}
        
        {(canView || canUpdate) && canDelete && (
          <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        )}
        
        {canDelete && (
          <MenuItem 
            onClick={() => {
              onDelete(designation);
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
        )}
      </Menu>
    </>
  );
};

const DesignationMaster = () => {
  // State for data
  const [designations, setDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedDesignationForAction, setSelectedDesignationForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected designation
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
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
      MODULES.DESIGNATION_MASTER,
      PAGES.DESIGNATION_MASTER,
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

  // Fetch designations from API - only if user has permission
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchDesignations();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin]);

 const fetchDesignations = async (showLoader = true) => {
  try {
    if (showLoader) setLoading(true);

    const token = localStorage.getItem('token');

    // ✅ Query Params
    const params = new URLSearchParams();

    params.append('page', page + 1);
    params.append('limit', rowsPerPage);

    if (searchTerm) params.append('search', searchTerm);

    const response = await axios.get(
      `${BASE_URL}/api/designations?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data?.success) {
      const data = response.data.data || [];

      setDesignations(data);
      setFilteredDesignations(data); // server-side filtering use kartoy ata

    } else {
      showNotification('Failed to load designations', 'error');
    }

  } catch (err) {
    console.error('Error fetching designations:', err);
    showNotification('Failed to load designations. Please try again.', 'error');
  } finally {
    if (showLoader) setLoading(false);
  }
};
  
  // Handle refresh
  const handleRefresh = () => {
    fetchDesignations();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle search (client-side filtering)
  const handleSearch = (data = designations) => {
    if (!searchTerm) {
      setFilteredDesignations(data);
      return;
    }

    const value = searchTerm.toLowerCase();
    const filtered = data.filter(d =>
      d.DesignationName?.toLowerCase().includes(value) ||
      d.Description?.toLowerCase().includes(value)
    );

    setFilteredDesignations(filtered);
  };

  // Apply search when searchTerm changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, designations]);
  
  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete designations', 'error');
      return;
    }
    
    if (event.target.checked) {
      setSelected(filteredDesignations.map(designation => designation._id));
    } else {
      setSelected([]);
    }
  };
  
  // Handle single selection - only if user has delete permission
  const handleSelect = (id) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete designations', 'error');
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
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };
  
  // Handle add designation
  const handleAddDesignation = async () => {
    await fetchDesignations(false);
    showNotification('Designation added successfully!', 'success');
  };
  
  // Handle edit designation
  const handleEditDesignation = async () => {
    await fetchDesignations(false);
    showNotification('Designation updated successfully!', 'success');
  };
  
  // Handle delete designation
  const handleDeleteDesignation = async () => {
    await fetchDesignations(false);
    showNotification('Designation deleted successfully!', 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete designations', 'error');
      return;
    }
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, designation) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDesignationForAction(designation);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedDesignationForAction(null);
  };
  
  // Open edit modal
  const openEditDesignationModal = (designation) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to edit designations', 'error');
      return;
    }
    setSelectedDesignation(designation);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewDesignationModal = (designation) => {
    if (!canViewPage && !isSuperAdmin) {
      showNotification('You do not have permission to view designations', 'error');
      return;
    }
    setSelectedDesignation(designation);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteDesignationDialog = (designation) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete designations', 'error');
      return;
    }
    setSelectedDesignation(designation);
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
  
  // Get level badge style
  const getLevelBadgeStyle = (level) => {
    if (level <= 2) {
      return {
        bgcolor: '#dcfce7',
        color: '#166534',
        border: '1px solid #86efac',
        fontWeight: 500
      };
    }
    if (level <= 4) {
      return {
        bgcolor: '#e0f2fe',
        color: '#0c4a6e',
        border: '1px solid #7dd3fc',
        fontWeight: 500
      };
    }
    if (level <= 6) {
      return {
        bgcolor: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fcd34d',
        fontWeight: 500
      };
    }
    return {
      bgcolor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fca5a5',
      fontWeight: 500
    };
  };
  
  // Get level text
  const getLevelText = (level) => {
    const levels = {
      1: 'Entry Level',
      2: 'Junior',
      3: 'Mid Level',
      4: 'Senior',
      5: 'Lead',
      6: 'Manager',
      7: 'Director',
      8: 'VP',
      9: 'C-Level'
    };
    return levels[level] || `Level ${level}`;
  };
  
  // Get designation initials for avatar
  const getDesignationInitials = (designationName) => {
    if (!designationName) return 'D';
    
    const words = designationName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return designationName.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on designation name
  const getAvatarColor = (designationName) => {
    if (!designationName) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = designationName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Paginated designations
  const paginatedDesignations = filteredDesignations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          Designation Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize company designations and hierarchy levels
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
              placeholder="Search by designation name or description..."
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
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
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
            
            {/* Add Designation Button - Only show if user has create permission */}
            {(canCreate || isSuperAdmin) && (
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
                Add Designation
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Designations Table */}
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
                      indeterminate={selected.length > 0 && selected.length < filteredDesignations.length}
                      checked={filteredDesignations.length > 0 && selected.length === filteredDesignations.length}
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
                      disabled={loading || filteredDesignations.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Designation
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Level
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
                  Created Date
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
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 6 : 5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading designations...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedDesignations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 6 : 5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No designations found' : 'No designations available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first designation to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDesignations.map((designation, index) => {
                  const isSelected = selected.includes(designation._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedDesignationForAction?._id === designation._id;
                  const avatarColor = getAvatarColor(designation.DesignationName);
                  const levelStyle = getLevelBadgeStyle(designation.Level);

                  return (
                    <TableRow
                      key={designation._id || index}
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
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {(canDelete || isSuperAdmin) && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(designation._id)}
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
                      )}
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
                            {getDesignationInitials(designation.DesignationName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {designation.DesignationName}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip
                            label={`Level ${designation.Level}`}
                            size="small"
                            sx={{
                              ...levelStyle,
                              height: 22,
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {getLevelText(designation.Level)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          sx={{ 
                            fontSize: '0.75rem', 
                            color: COLORS.text.primary,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            maxWidth: 300
                          }}
                        >
                          {designation.Description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(designation.CreatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          designation={designation}
                          onView={openViewDesignationModal}
                          onEdit={openEditDesignationModal}
                          onDelete={openDeleteDesignationDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, designation)}
                          userPermissions={userPermissions}
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredDesignations.length}
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

      {/* Modal Components - Only render if user has appropriate permissions */}
      {(canCreate || isSuperAdmin) && (
        <AddDesignations 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddDesignation}
        />
      )}

      {selectedDesignation && (
        <>
          {(canUpdate || isSuperAdmin) && (
            <EditDesignations 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedDesignation(null);
              }}
              designation={selectedDesignation}
              onUpdate={handleEditDesignation}
            />
          )}

          {(canViewPage || isSuperAdmin) && (
            <ViewDesignations 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedDesignation(null);
              }}
              designation={selectedDesignation}
              onEdit={() => {
                if (canUpdate || isSuperAdmin) {
                  setOpenViewModal(false);
                  setOpenEditModal(true);
                }
              }}
            />
          )}

          {(canDelete || isSuperAdmin) && (
            <DeleteDesignations 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedDesignation(null);
              }}
              designation={selectedDesignation}
              onDelete={handleDeleteDesignation}
            />
          )}
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

export default DesignationMaster;