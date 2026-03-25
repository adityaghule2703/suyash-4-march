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
// //   Typography,
// //   TextField,
// //   InputAdornment,
// //   CircularProgress,
// //   Chip,
// //   Menu,
// //   MenuItem,
// //   ListItemIcon,
// //   ListItemText,
// //   Snackbar,
// //   Alert,
// //   Stack,
// //   Avatar,
// //   Button,
// //   Checkbox,
// // } from "@mui/material";

// // import {
// //   Search as SearchIcon,
// //   MoreVert as MoreVertIcon,
// //   Delete as DeleteIcon,
// //   Add as AddIcon,
// //   Visibility as ViewIcon,
// //   Edit as EditIcon,
// // } from "@mui/icons-material";

// // import axios from "axios";
// // import BASE_URL from "../../../../config/Config";

// // import ViewEnrollment from "./ViewEnrollment";
// // import EditEnrollment from "./EditEnrollment";
// // import DeleteEnrollment from "./DeleteEnrollment";
// // import AddEnrollment from "./AddEnrollment";

// // const HEADER_GRADIENT =
// //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // const EnrollmentMaster = () => {
// //   const [enrollments, setEnrollments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [search, setSearch] = useState("");
// //   const [selected, setSelected] = useState([]);

// //   const [anchorEl, setAnchorEl] = useState(null);
// //   const [selectedEnrollment, setSelectedEnrollment] = useState(null);

// //   const [modalType, setModalType] = useState(null); // view | edit | delete
// //   const [openAdd, setOpenAdd] = useState(false);

// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success",
// //   });

// //   useEffect(() => {
// //     fetchEnrollments();
// //   }, []);

// //   const fetchEnrollments = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(
// //         `${BASE_URL}/api/mediclaim/enrollments`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       if (res.data.success) {
// //         setEnrollments(res.data.data);
// //       }
// //     } catch (err) {
// //       showNotification("Failed to load enrollments", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const showNotification = (message, severity) => {
// //     setSnackbar({ open: true, message, severity });
// //   };

// //   const filteredEnrollments = enrollments.filter((e) =>
// //     e.enrollmentId?.toLowerCase().includes(search.toLowerCase())
// //   );

// //   /* ================= CHECKBOX ================= */

// //   const handleSelectAll = (event) => {
// //     if (event.target.checked) {
// //       setSelected(filteredEnrollments.map((e) => e._id));
// //     } else {
// //       setSelected([]);
// //     }
// //   };

// //   const handleSelectOne = (id) => {
// //     setSelected((prev) =>
// //       prev.includes(id)
// //         ? prev.filter((item) => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const handleBulkDelete = async () => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       await axios.delete(
// //         `${BASE_URL}/api/mediclaim/enrollments/bulk-delete`,
// //         {
// //           data: { ids: selected },
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );

// //       showNotification("Selected enrollments cancelled successfully", "success");
// //       setSelected([]);
// //       fetchEnrollments();
// //     } catch (err) {
// //       showNotification("Bulk delete failed", "error");
// //     }
// //   };

// //   /* ================= MENU ================= */

// //   const handleMenuOpen = (event, enrollment) => {
// //     setAnchorEl(event.currentTarget);
// //     setSelectedEnrollment(enrollment);
// //   };

// //   const handleMenuClose = () => setAnchorEl(null);

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case "active":
// //         return { bg: "#dcfce7", color: "#166534" };
// //       case "cancelled":
// //         return { bg: "#fee2e2", color: "#991b1b" };
// //       default:
// //         return { bg: "#e2e8f0", color: "#334155" };
// //     }
// //   };

// //   return (
// //     <Box sx={{ p: 3 }}>
// //       <Typography
// //         variant="h5"
// //         fontWeight={600}
// //         sx={{
// //           background: HEADER_GRADIENT,
// //           WebkitBackgroundClip: "text",
// //           WebkitTextFillColor: "transparent",
// //           mb: 3,
// //         }}
// //       >
// //         Enrollment Master
// //       </Typography>

// //       {/* SEARCH + ACTION */}
// //       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
// //         <Stack direction="row" justifyContent="space-between">
// //           <TextField
// //             size="small"
// //             placeholder="Search Enrollment ID..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             sx={{ width: 300 }}
// //             InputProps={{
// //               startAdornment: (
// //                 <InputAdornment position="start">
// //                   <SearchIcon />
// //                 </InputAdornment>
// //               ),
// //             }}
// //           />

// //           <Stack direction="row" spacing={2}>
// //             {selected.length > 0 && (
// //               <Button
// //                 variant="outlined"
// //                 color="error"
// //                 startIcon={<DeleteIcon />}
// //                 onClick={handleBulkDelete}
// //               >
// //                 Delete ({selected.length})
// //               </Button>
// //             )}

// //             <Button
// //               variant="contained"
// //               startIcon={<AddIcon />}
// //               onClick={() => setOpenAdd(true)}
// //               sx={{
// //                 background: HEADER_GRADIENT,
// //                 "&:hover": { opacity: 0.9 },
// //               }}
// //             >
// //               Add Enrollment
// //             </Button>
// //           </Stack>
// //         </Stack>
// //       </Paper>

// //       {/* TABLE */}
// //       <Paper sx={{ borderRadius: 2 }}>
// //         <TableContainer>
// //           <Table>
// //             <TableHead>
// //               <TableRow
// //                 sx={{
// //                   background: HEADER_GRADIENT,
// //                   "& .MuiTableCell-root": {
// //                     color: "#fff",
// //                     fontWeight: 600,
// //                   },
// //                 }}
// //               >
// //                 <TableCell padding="checkbox">
// //                   <Checkbox
// //                     sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
// //                     checked={
// //                       filteredEnrollments.length > 0 &&
// //                       selected.length === filteredEnrollments.length
// //                     }
// //                     indeterminate={
// //                       selected.length > 0 &&
// //                       selected.length < filteredEnrollments.length
// //                     }
// //                     onChange={handleSelectAll}
// //                   />
// //                 </TableCell>

// //                 <TableCell>Enrollment ID</TableCell>
// //                 <TableCell>Employee</TableCell>
// //                 <TableCell>Policy</TableCell>
// //                 <TableCell>Status</TableCell>
// //                 <TableCell align="center">Actions</TableCell>
// //               </TableRow>
// //             </TableHead>

// //             <TableBody>
// //               {loading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={6} align="center">
// //                     <CircularProgress />
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 filteredEnrollments.map((e) => {
// //                   const statusColor = getStatusColor(e.status);

// //                   return (
// //                     <TableRow key={e._id} hover>
// //                       <TableCell padding="checkbox">
// //                         <Checkbox
// //                           checked={selected.includes(e._id)}
// //                           onChange={() => handleSelectOne(e._id)}
// //                         />
// //                       </TableCell>

// //                       <TableCell>{e.enrollmentId}</TableCell>
// //                       <TableCell>{e.employeeId}</TableCell>
// //                       <TableCell>{e.policyId?.policyName}</TableCell>
// //                       <TableCell>
// //                         <Chip
// //                           label={e.status}
// //                           size="small"
// //                           sx={{
// //                             backgroundColor: statusColor.bg,
// //                             color: statusColor.color,
// //                           }}
// //                         />
// //                       </TableCell>

// //                       <TableCell align="center">
// //                         <IconButton onClick={(ev) => handleMenuOpen(ev, e)}>
// //                           <MoreVertIcon />
// //                         </IconButton>
// //                       </TableCell>
// //                     </TableRow>
// //                   );
// //                 })
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Paper>

// //       {/* ACTION MENU */}
// //       <Menu
// //         anchorEl={anchorEl}
// //         open={Boolean(anchorEl)}
// //         onClose={handleMenuClose}
// //       >
// //         <MenuItem
// //           onClick={() => {
// //             setModalType("view");
// //             handleMenuClose();
// //           }}
// //         >
// //           <ListItemIcon>
// //             <ViewIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>View</ListItemText>
// //         </MenuItem>

// //         <MenuItem
// //           onClick={() => {
// //             setModalType("edit");
// //             handleMenuClose();
// //           }}
// //         >
// //           <ListItemIcon>
// //             <EditIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>Edit</ListItemText>
// //         </MenuItem>

// //         <MenuItem
// //           onClick={() => {
// //             setModalType("delete");
// //             handleMenuClose();
// //           }}
// //         >
// //           <ListItemIcon>
// //             <DeleteIcon fontSize="small" color="error" />
// //           </ListItemIcon>
// //           <ListItemText>Cancel</ListItemText>
// //         </MenuItem>
// //       </Menu>

// //       {/* MODALS */}
// //       <AddEnrollment
// //         open={openAdd}
// //         onClose={() => setOpenAdd(false)}
// //         onSuccess={() => {
// //           fetchEnrollments();
// //           showNotification("Enrollment added successfully", "success");
// //         }}
// //       />

// //       {selectedEnrollment && modalType === "view" && (
// //         <ViewEnrollment
// //           open
// //           onClose={() => setModalType(null)}
// //           enrollmentId={selectedEnrollment._id}
// //         />
// //       )}

// //       {selectedEnrollment && modalType === "edit" && (
// //         <EditEnrollment
// //           open
// //           onClose={() => setModalType(null)}
// //           enrollmentId={selectedEnrollment._id}
// //           onSuccess={() => {
// //             fetchEnrollments();
// //             showNotification("Enrollment updated successfully", "success");
// //           }}
// //         />
// //       )}

// //       {selectedEnrollment && modalType === "delete" && (
// //         <DeleteEnrollment
// //           open
// //           onClose={() => setModalType(null)}
// //           enrollment={selectedEnrollment}
// //           onSuccess={() => {
// //             fetchEnrollments();
// //             showNotification("Enrollment cancelled successfully", "success");
// //           }}
// //         />
// //       )}

// //       {/* SNACKBAR */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={3000}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// //         onClose={() =>
// //           setSnackbar({ ...snackbar, open: false })
// //         }
// //       >
// //         <Alert severity={snackbar.severity} variant="filled">
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default EnrollmentMaster;

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
//   Typography,
//   Snackbar,
//   TablePagination,
//   Stack,
//   Alert,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Chip,
//   Checkbox,
//   TextField,
//   InputAdornment,
//   CircularProgress,
//   alpha,
//   Divider,
//   Avatar
// } from "@mui/material";

// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   MoreVert as MoreVertIcon,
//   Person as PersonIcon
// } from "@mui/icons-material";

// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// import ViewEnrollment from "./ViewEnrollment";
// import EditEnrollment from "./EditEnrollment";
// import DeleteEnrollment from "./DeleteEnrollment";
// import AddEnrollment from "./AddEnrollment";

// // Color constants
// const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0e7490 100%)";
// const PRIMARY_BLUE = "#0284c7";
// const STRIPE_ODD = "#FFFFFF";
// const STRIPE_EVEN = "#f8fafc";
// const TEXT_COLOR_MAIN = "#0f172a";

// // Status color mapping
// const STATUS_COLORS = {
//   active: { bg: "#dcfce7", color: "#166534", label: "Active" },
//   cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
//   pending: { bg: "#fef3c7", color: "#b45309", label: "Pending" }
// };

// const EnrollmentMaster = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState([]);

//   const [selectedEnrollment, setSelectedEnrollment] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const [modalType, setModalType] = useState(null); // view | edit | delete
//   const [openAdd, setOpenAdd] = useState(false);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     fetchEnrollments();
//   }, []);

//   const fetchEnrollments = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/enrollments`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         setEnrollments(res.data.data || []);
//       }
//     } catch (err) {
//       showNotification("Failed to load enrollments", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   /* ================= SEARCH ================= */
//   const filteredEnrollments = enrollments.filter((e) => {
//     return (
//       e.enrollmentId?.toLowerCase().includes(search.toLowerCase()) ||
//       e.employeeId?.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
//       e.policyId?.policyName?.toLowerCase().includes(search.toLowerCase())
//     );
//   });

//   /* ================= CHECKBOX ================= */
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(filteredEnrollments.map((e) => e._id));
//     } else {
//       setSelected([]);
//     }
//   };

//   const handleSelectOne = (id) => {
//     setSelected((prev) =>
//       prev.includes(id)
//         ? prev.filter((item) => item !== id)
//         : [...prev, id]
//     );
//   };

//   const handleBulkDelete = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.delete(
//         `${BASE_URL}/api/mediclaim/enrollments/bulk-delete`,
//         {
//           data: { ids: selected },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       showNotification("Selected enrollments cancelled successfully", "success");
//       setSelected([]);
//       fetchEnrollments();
//     } catch (err) {
//       showNotification("Bulk delete failed", "error");
//     }
//   };

//   const getStatusColor = (status) => {
//     return STATUS_COLORS[status] || { bg: "#e2e8f0", color: "#334155", label: status };
//   };

//   const handleMenuOpen = (event, enrollment) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedEnrollment(enrollment);
//   };

//   const handleMenuClose = () => setAnchorEl(null);

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get employee name
//   const getEmployeeName = (enrollment) => {
//     if (enrollment.employeeId?.employeeName) {
//       return enrollment.employeeId.employeeName;
//     }
//     return enrollment.employeeId || 'N/A';
//   };

//   // Get policy name
//   const getPolicyName = (enrollment) => {
//     if (enrollment.policyId?.policyName) {
//       return enrollment.policyId.policyName;
//     }
//     return enrollment.policyId || 'N/A';
//   };

//   // Get avatar initials
//   const getAvatarInitials = (name) => {
//     if (!name || name === 'N/A') return '?';
//     return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
//   };

//   // Get avatar color
//   const getAvatarColor = (name) => {
//     if (!name) return PRIMARY_BLUE;
    
//     const colors = [
//       '#164e63', '#0e7490', '#0891b2', '#0c4a6e', '#1d4ed8',
//       '#7c3aed', '#7e22ce', '#be185d', '#c2410c', '#059669'
//     ];
    
//     const charCode = name.charCodeAt(0) || 0;
//     return colors[charCode % colors.length];
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       {/* Action Bar */}
//       <Paper sx={{ 
//         p: 2, 
//         px: 3,
//         borderRadius: 0,
//         bgcolor: '#FFFFFF',
//         boxShadow: 'none',
//         borderBottom: '1px solid #e2e8f0'
//       }}>
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <TextField
//             size="small"
//             placeholder="Search by ID, employee, policy..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             sx={{ 
//               width: 320,
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 1.5,
//                 bgcolor: '#f8fafc',
//                 height: 40
//               }
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: '#64748B', fontSize: 20 }} />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Stack direction="row" spacing={2}>
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
//                   fontWeight: 500,
//                   borderColor: '#e2e8f0',
//                   color: '#ef4444',
//                   '&:hover': {
//                     borderColor: '#ef4444',
//                     bgcolor: alpha('#ef4444', 0.04)
//                   }
//                 }}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}

//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setOpenAdd(true)}
//               sx={{
//                 height: 40,
//                 borderRadius: 1.5,
//                 background: HEADER_GRADIENT,
//                 fontSize: '0.875rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: 'none',
//                 '&:hover': {
//                   background: HEADER_GRADIENT,
//                   opacity: 0.9,
//                   boxShadow: 'none'
//                 }
//               }}
//             >
//               Add Enrollment
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Action Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             mt: 1,
//             minWidth: 180,
//             borderRadius: 2,
//             border: '1px solid #e2e8f0',
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//           }
//         }}
//       >
//         <MenuItem
//           onClick={() => {
//             setModalType("view");
//             handleMenuClose();
//           }}
//           sx={{ py: 1.5, px: 2 }}
//         >
//           <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
//             <ViewIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>View Details</Typography>
//           </ListItemText>
//         </MenuItem>
//         <Divider />
//         <MenuItem
//           onClick={() => {
//             setModalType("edit");
//             handleMenuClose();
//           }}
//           sx={{ py: 1.5, px: 2 }}
//         >
//           <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
//             <EditIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Edit</Typography>
//           </ListItemText>
//         </MenuItem>
//         <MenuItem
//           onClick={() => {
//             setModalType("delete");
//             handleMenuClose();
//           }}
//           sx={{ py: 1.5, px: 2 }}
//         >
//           <ListItemIcon sx={{ color: '#DC2626', minWidth: 36 }}>
//             <DeleteIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Cancel Enrollment</Typography>
//           </ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* Table */}
//       <Paper sx={{ 
//         width: '100%', 
//         borderRadius: 0,
//         boxShadow: 'none',
//       }}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ 
//                 bgcolor: '#f8fafc',
//                 '& .MuiTableCell-root': {
//                   borderBottom: '1px solid #e2e8f0',
//                   color: '#475569',
//                   fontWeight: 600,
//                   fontSize: '0.875rem',
//                   py: 1.5
//                 }
//               }}>
//                 <TableCell padding="checkbox" sx={{ width: 50 }}>
//                   <Checkbox
//                     sx={{
//                       color: '#cbd5e1',
//                       '&.Mui-checked': { color: PRIMARY_BLUE },
//                       '&.MuiCheckbox-indeterminate': { color: PRIMARY_BLUE }
//                     }}
//                     checked={
//                       filteredEnrollments.length > 0 &&
//                       selected.length === filteredEnrollments.length
//                     }
//                     indeterminate={
//                       selected.length > 0 &&
//                       selected.length < filteredEnrollments.length
//                     }
//                     onChange={handleSelectAll}
//                   />
//                 </TableCell>
//                 <TableCell>Enrollment ID</TableCell>
//                 <TableCell>Employee</TableCell>
//                 <TableCell>Policy</TableCell>
//                 <TableCell>Start Date</TableCell>
//                 <TableCell>End Date</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
//                     <CircularProgress size={40} sx={{ color: PRIMARY_BLUE }} />
//                   </TableCell>
//                 </TableRow>
//               ) : filteredEnrollments.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <Typography variant="body1" color="#64748B" fontWeight={500}>
//                         No enrollments found
//                       </Typography>
//                       <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
//                         {search 
//                           ? 'Try adjusting your search terms' 
//                           : 'No enrollments available'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredEnrollments
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((enrollment, index) => {
//                     const statusColor = getStatusColor(enrollment.status);
//                     const isSelected = selected.includes(enrollment._id);
//                     const employeeName = getEmployeeName(enrollment);
//                     const avatarColor = getAvatarColor(employeeName);

//                     return (
//                       <TableRow
//                         key={enrollment._id}
//                         hover
//                         sx={{
//                           bgcolor: isSelected ? alpha(PRIMARY_BLUE, 0.04) : (index % 2 === 0 ? '#FFFFFF' : '#f8fafc'),
//                           '&:hover': {
//                             bgcolor: alpha(PRIMARY_BLUE, 0.08)
//                           },
//                           '& .MuiTableCell-root': {
//                             borderBottom: '1px solid #e2e8f0',
//                             py: 1.5
//                           }
//                         }}
//                       >
//                         <TableCell padding="checkbox">
//                           <Checkbox
//                             checked={isSelected}
//                             onChange={() => handleSelectOne(enrollment._id)}
//                             sx={{
//                               color: '#cbd5e1',
//                               '&.Mui-checked': { color: PRIMARY_BLUE },
//                             }}
//                           />
//                         </TableCell>

//                         <TableCell>
//                           <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
//                             {enrollment.enrollmentId}
//                           </Typography>
//                         </TableCell>
                        
//                         <TableCell>
//                           <Stack direction="row" spacing={1.5} alignItems="center">
//                             <Avatar 
//                               sx={{ 
//                                 width: 32, 
//                                 height: 32, 
//                                 bgcolor: avatarColor,
//                                 fontSize: '0.75rem',
//                                 fontWeight: 600
//                               }}
//                             >
//                               {getAvatarInitials(employeeName)}
//                             </Avatar>
//                             <Box>
//                               <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
//                                 {employeeName}
//                               </Typography>
//                               {enrollment.employeeId?.employeeCode && (
//                                 <Typography variant="caption" color="#64748B">
//                                   {enrollment.employeeId.employeeCode}
//                                 </Typography>
//                               )}
//                             </Box>
//                           </Stack>
//                         </TableCell>
                        
//                         <TableCell>
//                           <Typography variant="body2" color={TEXT_COLOR_MAIN}>
//                             {getPolicyName(enrollment)}
//                           </Typography>
//                         </TableCell>
                        
//                         <TableCell>
//                           <Typography variant="body2" color={TEXT_COLOR_MAIN}>
//                             {formatDate(enrollment.startDate)}
//                           </Typography>
//                         </TableCell>
                        
//                         <TableCell>
//                           <Typography variant="body2" color={TEXT_COLOR_MAIN}>
//                             {formatDate(enrollment.endDate)}
//                           </Typography>
//                         </TableCell>
                        
//                         <TableCell>
//                           <Chip
//                             label={statusColor.label}
//                             size="small"
//                             sx={{
//                               backgroundColor: statusColor.bg,
//                               color: statusColor.color,
//                               fontWeight: 500,
//                               fontSize: '0.75rem',
//                               height: 24,
//                               minWidth: 70,
//                               borderRadius: '12px',
//                               '& .MuiChip-label': {
//                                 px: 1.5
//                               }
//                             }}
//                           />
//                         </TableCell>
                        
//                         <TableCell align="center">
//                           <IconButton
//                             onClick={(e) => handleMenuOpen(e, enrollment)}
//                             sx={{
//                               color: '#64748b',
//                               padding: 0.5,
//                               '&:hover': {
//                                 bgcolor: alpha(PRIMARY_BLUE, 0.1),
//                                 color: PRIMARY_BLUE
//                               }
//                             }}
//                           >
//                             <MoreVertIcon fontSize="small" />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           component="div"
//           count={filteredEnrollments.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
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

//       {/* Modals */}
//       <AddEnrollment
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         onSuccess={() => {
//           fetchEnrollments();
//           showNotification("Enrollment added successfully", "success");
//         }}
//       />

//       {selectedEnrollment && modalType === "view" && (
//         <ViewEnrollment
//           open
//           onClose={() => setModalType(null)}
//           enrollmentId={selectedEnrollment._id}
//         />
//       )}

//       {selectedEnrollment && modalType === "edit" && (
//         <EditEnrollment
//           open
//           onClose={() => setModalType(null)}
//           enrollmentId={selectedEnrollment._id}
//           onSuccess={() => {
//             fetchEnrollments();
//             showNotification("Enrollment updated successfully", "success");
//           }}
//         />
//       )}

//       {selectedEnrollment && modalType === "delete" && (
//         <DeleteEnrollment
//           open
//           onClose={() => setModalType(null)}
//           enrollment={selectedEnrollment}
//           onSuccess={() => {
//             fetchEnrollments();
//             showNotification("Enrollment cancelled successfully", "success");
//           }}
//         />
//       )}

//       {/* Snackbar */}
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

// export default EnrollmentMaster;




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
  alpha,
  Alert,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

import ViewEnrollment from './ViewEnrollment';
import EditEnrollment from './EditEnrollment';
import DeleteEnrollment from './DeleteEnrollment';
import AddEnrollment from './AddEnrollment';

// Color constants matching ProcessMaster.jsx
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
  active: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Active' },
  cancelled: { bg: COLORS.status.error, color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} />, label: 'Cancelled' },
  pending: { bg: COLORS.status.warning, color: '#92400E', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending' }
};

// Action Menu Component
const ActionMenu = ({ enrollment, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
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
        <MenuItem onClick={() => { onView(enrollment); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        <MenuItem onClick={() => { onEdit(enrollment); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              Edit
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onDelete(enrollment); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
              Cancel Enrollment
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const EnrollmentMaster = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedEnrollmentForAction, setSelectedEnrollmentForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/mediclaim/enrollments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setEnrollments(response.data.data || []);
        setFilteredEnrollments(response.data.data || []);
      } else {
        showNotification('Failed to load enrollments', 'error');
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      showNotification('Failed to load enrollments. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  // Filter enrollments when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = enrollments.filter(enrollment =>
        enrollment.enrollmentId?.toLowerCase().includes(searchTerm) ||
        enrollment.employeeId?.employeeName?.toLowerCase().includes(searchTerm) ||
        enrollment.policyId?.policyName?.toLowerCase().includes(searchTerm) ||
        enrollment.status?.toLowerCase().includes(searchTerm)
      );
      setFilteredEnrollments(filtered);
    } else {
      setFilteredEnrollments(enrollments);
    }
  }, [searchTerm, enrollments]);

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedEnrollments.map(enrollment => enrollment._id));
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

  const handleRefresh = () => {
    fetchEnrollments();
    showNotification('Data refreshed', 'success');
  };

  const handleAddSuccess = () => {
    fetchEnrollments();
    showNotification('Enrollment added successfully!', 'success');
  };

  const handleEditSuccess = () => {
    fetchEnrollments();
    showNotification('Enrollment updated successfully!', 'success');
  };

  const handleDeleteSuccess = () => {
    fetchEnrollments();
    showNotification('Enrollment cancelled successfully!', 'success');
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/mediclaim/enrollments/bulk-delete`, {
        data: { ids: selected },
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelected([]);
      fetchEnrollments();
      showNotification('Selected enrollments cancelled successfully', 'success');
    } catch (error) {
      showNotification('Bulk delete failed', 'error');
    }
  };

  const handleActionMenuOpen = (event, enrollment) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedEnrollmentForAction(enrollment);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedEnrollmentForAction(null);
  };

  const openViewEnrollmentModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditEnrollmentModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openDeleteEnrollmentDialog = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
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

  const getStatusStyle = (status) => {
    return STATUS_COLORS[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Unknown' };
  };

  const getEmployeeName = (enrollment) => {
    return enrollment.employeeId?.employeeName || enrollment.employeeId || 'N/A';
  };

  const getPolicyName = (enrollment) => {
    return enrollment.policyId?.policyName || enrollment.policyId || 'N/A';
  };

  const getAvatarInitials = (name) => {
    if (!name || name === 'N/A') return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const paginatedEnrollments = filteredEnrollments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isFilterActive = searchTerm;

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
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
    }
  };

  return (
    <Box sx={{ p: -1 }}>
      {/* Page Header */}
      {/* <Box sx={{ mb: 2.5 }}>
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
          Enrollment Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and track employee insurance enrollments
        </Typography>
      </Box> */}

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
              placeholder="Search by ID, employee, policy..."
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

            {/* <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': { bgcolor: `${COLORS.primary}20` }
                }}
              >
                <RefreshIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip> */}
          </Stack>

          <Stack direction="row" spacing={1.5}>
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
                  '&:hover': { borderColor: '#fecaca', bgcolor: '#fee2e2' }
                }}
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
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Add Enrollment
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Enrollments Table */}
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
                    indeterminate={selected.length > 0 && selected.length < paginatedEnrollments.length}
                    checked={paginatedEnrollments.length > 0 && selected.length === paginatedEnrollments.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: COLORS.text.light,
                      '&.Mui-checked': { color: COLORS.text.light },
                      '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                      '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                    }}
                    disabled={loading || paginatedEnrollments.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Enrollment ID
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Employee
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Policy
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Start Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  End Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading enrollments...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AssignmentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {isFilterActive ? 'No enrollments match your filters' : 'No enrollments available'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {isFilterActive ? 'Try adjusting your search terms' : 'Add your first enrollment to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEnrollments.map((enrollment, index) => {
                  const isSelected = selected.includes(enrollment._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedEnrollmentForAction?._id === enrollment._id;
                  const statusStyle = getStatusStyle(enrollment.status);
                  const employeeName = getEmployeeName(enrollment);
                  const avatarColor = getAvatarColor(employeeName);

                  return (
                    <TableRow
                      key={enrollment._id}
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
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(enrollment._id)}
                          sx={{
                            color: COLORS.primary,
                            '&.Mui-checked': { color: COLORS.primary },
                            '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {enrollment.enrollmentId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getAvatarInitials(employeeName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                              {employeeName}
                            </Typography>
                            {enrollment.employeeId?.employeeCode && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {enrollment.employeeId.employeeCode}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {getPolicyName(enrollment)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(enrollment.startDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(enrollment.endDate)}
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
                            fontSize: '0.65rem',
                            height: 24,
                            '& .MuiChip-icon': { fontSize: '0.7rem', color: statusStyle.color },
                            '& .MuiChip-label': { px: 1, fontSize: '0.65rem' }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          enrollment={enrollment}
                          onView={openViewEnrollmentModal}
                          onEdit={openEditEnrollmentModal}
                          onDelete={openDeleteEnrollmentDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, enrollment)}
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
          count={filteredEnrollments.length}
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

      {/* Modals */}
      <AddEnrollment
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedEnrollment && (
        <>
          <ViewEnrollment
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedEnrollment(null);
            }}
            enrollmentId={selectedEnrollment._id}
          />
          <EditEnrollment
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedEnrollment(null);
            }}
            enrollmentId={selectedEnrollment._id}
            onSuccess={handleEditSuccess}
          />
          <DeleteEnrollment
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedEnrollment(null);
            }}
            enrollment={selectedEnrollment}
            onSuccess={handleDeleteSuccess}
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
            '& .MuiAlert-icon': { fontSize: '1.25rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnrollmentMaster;