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
// //   Menu,
// //   MenuItem,
// //   ListItemIcon,
// //   ListItemText,
// //   Chip,
// //   Checkbox,
// //   alpha
// // } from "@mui/material";

// // import {
// //   Search as SearchIcon,
// //   Add as AddIcon,
// //   Delete as DeleteIcon,
// //   Visibility as ViewIcon,
// //   Edit as EditIcon,
// //   MoreVert as MoreVertIcon,
// // } from "@mui/icons-material";

// // import axios from "axios";
// // import BASE_URL from "../../../config/Config";

// // import AddPieceRate from "./AddPieceRate";
// // import EditPieceRate from "./EditPieceRate";
// // import ViewPieceRate from "./ViewPieceRate";
// // import DeletePieceRate from "./DeletePieceRate";

// // /* === DESIGN CONSTANTS === */
// // const HEADER_GRADIENT =
// //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// // const STRIPE_ODD = "#FFFFFF";
// // const STRIPE_EVEN = "#f8fafc";
// // const HOVER_COLOR = "#f1f5f9";
// // const PRIMARY_BLUE = "#00B4D8";

// // const PieceRateMaster = () => {
// //   const [pieceRates, setPieceRates] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [totalRecords, setTotalRecords] = useState(0);

// //   const [search, setSearch] = useState("");
// //   const [selected, setSelected] = useState([]);
// //   const [selectedRate, setSelectedRate] = useState(null);

// //   const [openAdd, setOpenAdd] = useState(false);
// //   const [openEdit, setOpenEdit] = useState(false);
// //   const [openView, setOpenView] = useState(false);
// //   const [openDelete, setOpenDelete] = useState(false);

// //   const [anchorEl, setAnchorEl] = useState(null);

// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success",
// //   });

// //   /* ================= FETCH PIECE RATES ================= */
// //   useEffect(() => {
// //     fetchPieceRates();
// //   }, [page, rowsPerPage]);

// //   const fetchPieceRates = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(`${BASE_URL}/api/piece-rate-master`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //         params: {
// //           page: page + 1,
// //           limit: rowsPerPage,
// //           search: search || undefined,
// //         },
// //       });

// //       if (res.data.success) {
// //         setPieceRates(res.data.data);
// //         setTotalRecords(res.data.total);
// //       }
// //     } catch {
// //       showNotification("Failed to load piece rates", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const showNotification = (message, severity) => {
// //     setSnackbar({ open: true, message, severity });
// //   };

// //   /* ================= CHECKBOX ================= */
// //   const handleSelectAll = (event) => {
// //     if (event.target.checked) {
// //       setSelected(pieceRates.map((r) => r._id));
// //     } else {
// //       setSelected([]);
// //     }
// //   };

// //   const handleSelectOne = (id) => {
// //     setSelected((prev) =>
// //       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
// //     );
// //   };

// //   const isSelected = (id) => selected.includes(id);

// //   /* ================= MENU ================= */
// //   const handleMenuOpen = (event, rate) => {
// //     setAnchorEl(event.currentTarget);
// //     setSelectedRate(rate);
// //   };

// //   const handleMenuClose = () => setAnchorEl(null);

// //   /* ================= CRUD HANDLERS ================= */
// //   const handleAdd = () => {
// //     fetchPieceRates();
// //     showNotification("Piece rate added successfully", "success");
// //   };

// //   const handleUpdate = () => {
// //     fetchPieceRates();
// //     showNotification("Piece rate updated successfully", "success");
// //   };

// //   const handleDelete = () => {
// //     fetchPieceRates();
// //     showNotification("Piece rate deleted successfully", "success");
// //   };

// //   const filteredRates = pieceRates.filter(
// //     (r) =>
// //       r.productType?.toLowerCase().includes(search.toLowerCase()) ||
// //       r.operation?.toLowerCase().includes(search.toLowerCase())
// //   );

// //   return (
// //     <Box sx={{ p: 3 }}>
// //       {/* ===== HEADER ===== */}
// //       <Box sx={{ mb: 3 }}>
// //         <Typography
// //           variant="h5"
// //           fontWeight={600}
// //           sx={{
// //             background: HEADER_GRADIENT,
// //             WebkitBackgroundClip: "text",
// //             WebkitTextFillColor: "transparent",
// //           }}
// //         >
// //           Piece Rate Master
// //         </Typography>
// //         <Typography variant="body2" color="#64748B">
// //           Manage production piece rates
// //         </Typography>
// //       </Box>

// //       {/* ===== ACTION BAR ===== */}
// //       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
// //         <Stack direction="row" justifyContent="space-between">
// //           <TextField
// //             size="small"
// //             placeholder="Search product or operation..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             sx={{ width: 300 }}
// //             InputProps={{
// //               startAdornment: (
// //                 <InputAdornment position="start">
// //                   <SearchIcon sx={{ color: "#64748B" }} />
// //                 </InputAdornment>
// //               ),
// //             }}
// //           />

// //           <Button
// //             variant="contained"
// //             startIcon={<AddIcon />}
// //             onClick={() => setOpenAdd(true)}
// //             sx={{
// //               background: HEADER_GRADIENT,
// //               "&:hover": { opacity: 0.9 },
// //             }}
// //           >
// //             Add Piece Rate
// //           </Button>
// //         </Stack>
// //       </Paper>

// //       {/* ===== TABLE ===== */}
// //       <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
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
// //                     checked={
// //                       pieceRates.length > 0 &&
// //                       selected.length === pieceRates.length
// //                     }
// //                     indeterminate={
// //                       selected.length > 0 &&
// //                       selected.length < pieceRates.length
// //                     }
// //                     onChange={handleSelectAll}
// //                     sx={{ color: "#fff" }}
// //                   />
// //                 </TableCell>
// //                 <TableCell>Product</TableCell>
// //                 <TableCell>Operation</TableCell>
// //                 <TableCell>Rate</TableCell>
// //                 <TableCell>Skill Level</TableCell>
// //                 <TableCell>Status</TableCell>
// //                 <TableCell align="center">Actions</TableCell>
// //               </TableRow>
// //             </TableHead>

// //             <TableBody>
// //               {loading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={7} align="center">
// //                     Loading...
// //                   </TableCell>
// //                 </TableRow>
// //               ) : filteredRates.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={7} align="center">
// //                     No records found
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 filteredRates.map((rate, index) => (
// //                   <TableRow
// //                     key={rate._id}
// //                     hover
// //                     sx={{
// //                       bgcolor:
// //                         index % 2 === 0 ? STRIPE_ODD : STRIPE_EVEN,
// //                       "&:hover": { bgcolor: HOVER_COLOR },
// //                     }}
// //                   >
// //                     <TableCell padding="checkbox">
// //                       <Checkbox
// //                         checked={isSelected(rate._id)}
// //                         onChange={() => handleSelectOne(rate._id)}
// //                       />
// //                     </TableCell>

// //                     <TableCell sx={{ fontWeight: 600 }}>
// //                       {rate.productType}
// //                     </TableCell>

// //                     <TableCell>{rate.operation}</TableCell>

// //                     <TableCell>
// //                       ₹ {rate.ratePerUnit}
// //                     </TableCell>

// //                     <TableCell>{rate.skillLevel}</TableCell>

// //                     <TableCell>
// //                       <Chip
// //                         label={rate.isActive ? "Active" : "Inactive"}
// //                         size="small"
// //                         sx={{
// //                           backgroundColor: rate.isActive
// //                             ? "#dcfce7"
// //                             : "#fee2e2",
// //                           color: rate.isActive
// //                             ? "#166534"
// //                             : "#991b1b",
// //                         }}
// //                       />
// //                     </TableCell>

// //                     <TableCell align="center">
// //                       <IconButton
// //                         onClick={(e) =>
// //                           handleMenuOpen(e, rate)
// //                         }
// //                         sx={{
// //                           "&:hover": {
// //                             bgcolor: alpha(PRIMARY_BLUE, 0.1),
// //                           },
// //                         }}
// //                       >
// //                         <MoreVertIcon />
// //                       </IconButton>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>

// //         <TablePagination
// //           component="div"
// //           count={totalRecords}
// //           page={page}
// //           onPageChange={(e, newPage) => setPage(newPage)}
// //           rowsPerPage={rowsPerPage}
// //           onRowsPerPageChange={(e) => {
// //             setRowsPerPage(parseInt(e.target.value, 10));
// //             setPage(0);
// //           }}
// //         />
// //       </Paper>

// //       {/* ===== ACTION MENU ===== */}
// //       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
// //         <MenuItem onClick={() => { setOpenView(true); handleMenuClose(); }}>
// //           <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
// //           <ListItemText>View</ListItemText>
// //         </MenuItem>

// //         <MenuItem onClick={() => { setOpenEdit(true); handleMenuClose(); }}>
// //           <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
// //           <ListItemText>Edit</ListItemText>
// //         </MenuItem>

// //         <MenuItem onClick={() => { setOpenDelete(true); handleMenuClose(); }}>
// //           <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
// //           <ListItemText>Delete</ListItemText>
// //         </MenuItem>
// //       </Menu>

// //       {/* ===== MODALS ===== */}
// //       <AddPieceRate open={openAdd} onClose={() => setOpenAdd(false)} onAdd={handleAdd} />

// //       {selectedRate && (
// //         <>
// //           <ViewPieceRate open={openView} onClose={() => setOpenView(false)} pieceRate={selectedRate} />
// //           <EditPieceRate open={openEdit} onClose={() => setOpenEdit(false)} pieceRate={selectedRate} onUpdate={handleUpdate} />
// //           <DeletePieceRate open={openDelete} onClose={() => setOpenDelete(false)} pieceRate={selectedRate} onDelete={handleDelete} />
// //         </>
// //       )}

// //       {/* ===== SNACKBAR ===== */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={3000}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// //         onClose={() => setSnackbar({ ...snackbar, open: false })}
// //       >
// //         <Alert severity={snackbar.severity} variant="filled">
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default PieceRateMaster;

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
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Chip,
//   Checkbox,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   alpha,
// } from "@mui/material";

// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   MoreVert as MoreVertIcon,
// } from "@mui/icons-material";

// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// import AddPieceRate from "./AddPieceRate";
// import EditPieceRate from "./EditPieceRate";
// import ViewPieceRate from "./ViewPieceRate";
// import DeletePieceRate from "./DeletePieceRate";

// /* === DESIGN CONSTANTS === */
// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// const STRIPE_ODD = "#FFFFFF";
// const STRIPE_EVEN = "#f8fafc";
// const HOVER_COLOR = "#f1f5f9";
// const PRIMARY_BLUE = "#00B4D8";

// const PieceRateMaster = () => {
//   const [pieceRates, setPieceRates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState([]);
//   const [selectedRate, setSelectedRate] = useState(null);

//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openView, setOpenView] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);

//   // 🔥 ADD THIS STATE AT TOP WITH OTHER STATES
//   const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
//   const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
//   const [bulkDeleteError, setBulkDeleteError] = useState("");

//   const [anchorEl, setAnchorEl] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   /* ================= FETCH PIECE RATES ================= */
//   useEffect(() => {
//     fetchPieceRates();
//   }, [page, rowsPerPage]);

//   const fetchPieceRates = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${BASE_URL}/api/piece-rate-master`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           page: page + 1,
//           limit: rowsPerPage,
//           search: search || undefined,
//         },
//       });

//       if (res.data.success) {
//         setPieceRates(res.data.data);
//         setTotalRecords(res.data.total);
//       }
//     } catch (error) {
//       showNotification("Failed to load piece rates", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   /* ================= CHECKBOX ================= */
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(pieceRates.map((r) => r._id));
//     } else {
//       setSelected([]);
//     }
//   };

//   const handleSelectOne = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   const isSelected = (id) => selected.includes(id);

//   const handleBulkDeleteConfirm = async () => {
//     if (selected.length === 0) return;

//     try {
//       setBulkDeleteLoading(true);
//       setBulkDeleteError("");

//       const token = localStorage.getItem("token");

//       await Promise.all(
//         selected.map((id) =>
//           axios.delete(`${BASE_URL}/api/piece-rate-master/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ),
//       );

//       setOpenBulkDeleteDialog(false);
//       setSelected([]);
//       fetchPieceRates();
//       showNotification("Selected piece rates deleted successfully", "success");
//     } catch (error) {
//       console.error("Bulk delete error:", error);
//       setBulkDeleteError(
//         error.response?.data?.message ||
//           "Failed to delete selected piece rates",
//       );
//     } finally {
//       setBulkDeleteLoading(false);
//     }
//   };

//   /* ================= MENU ================= */
//   const handleMenuOpen = (event, rate) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRate(rate); // 🔥 ID correctly set here
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   /* ================= CRUD CALLBACKS ================= */
//   const handleAdd = () => {
//     fetchPieceRates();
//     showNotification("Piece rate added successfully", "success");
//   };

//   const handleUpdate = () => {
//     fetchPieceRates();
//     showNotification("Piece rate updated successfully", "success");
//   };

//   const handleDelete = () => {
//     fetchPieceRates();
//     showNotification("Piece rate deleted successfully", "success");
//   };

//   /* ================= FILTER ================= */
//   const filteredRates = pieceRates.filter(
//     (r) =>
//       r.productType?.toLowerCase().includes(search.toLowerCase()) ||
//       r.operation?.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* ===== HEADER ===== */}
//       <Box sx={{ mb: 3 }}>
//         <Typography
//           variant="h5"
//           fontWeight={600}
//           sx={{
//             background: HEADER_GRADIENT,
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           Piece Rate Master
//         </Typography>
//         <Typography variant="body2" color="#64748B">
//           Manage production piece rates
//         </Typography>
//       </Box>

//       {/* ===== ACTION BAR ===== */}
//       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <TextField
//             size="small"
//             placeholder="Search product or operation..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             sx={{ width: 300 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: "#64748B" }} />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Stack direction="row" spacing={2}>
//             {selected.length > 0 && (
//               <Button
//                 variant="contained"
//                 color="error"
//                 startIcon={<DeleteIcon />}
//                 onClick={() => setOpenBulkDeleteDialog(true)}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}

//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setOpenAdd(true)}
//               sx={{
//                 background: HEADER_GRADIENT,
//                 "&:hover": { opacity: 0.9 },
//               }}
//             >
//               Add Piece Rate
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* ===== TABLE ===== */}
//       <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow
//                 sx={{
//                   background: HEADER_GRADIENT,
//                   "& .MuiTableCell-root": {
//                     color: "#fff",
//                     fontWeight: 600,
//                   },
//                 }}
//               >
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     checked={
//                       pieceRates.length > 0 &&
//                       selected.length === pieceRates.length
//                     }
//                     indeterminate={
//                       selected.length > 0 && selected.length < pieceRates.length
//                     }
//                     onChange={handleSelectAll}
//                     sx={{ color: "#fff" }}
//                   />
//                 </TableCell>
//                 <TableCell>Product</TableCell>
//                 <TableCell>Operation</TableCell>
//                 <TableCell>Rate</TableCell>
//                 <TableCell>Skill Level</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : filteredRates.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     No records found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredRates.map((rate, index) => (
//                   <TableRow
//                     key={rate._id}
//                     hover
//                     sx={{
//                       bgcolor: index % 2 === 0 ? STRIPE_ODD : STRIPE_EVEN,
//                       "&:hover": { bgcolor: HOVER_COLOR },
//                     }}
//                   >
//                     <TableCell padding="checkbox">
//                       <Checkbox
//                         checked={isSelected(rate._id)}
//                         onChange={() => handleSelectOne(rate._id)}
//                       />
//                     </TableCell>

//                     <TableCell sx={{ fontWeight: 600 }}>
//                       {rate.productType}
//                     </TableCell>

//                     <TableCell>{rate.operation}</TableCell>

//                     <TableCell>
//                       ₹ {Number(rate.ratePerUnit).toLocaleString("en-IN")}
//                     </TableCell>

//                     <TableCell>{rate.skillLevel}</TableCell>

//                     <TableCell>
//                       <Chip
//                         label={rate.isActive ? "Active" : "Inactive"}
//                         size="small"
//                         sx={{
//                           backgroundColor: rate.isActive
//                             ? "#dcfce7"
//                             : "#fee2e2",
//                           color: rate.isActive ? "#166534" : "#991b1b",
//                         }}
//                       />
//                     </TableCell>

//                     <TableCell align="center">
//                       <IconButton
//                         onClick={(e) => handleMenuOpen(e, rate)}
//                         sx={{
//                           "&:hover": {
//                             bgcolor: alpha(PRIMARY_BLUE, 0.1),
//                           },
//                         }}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           component="div"
//           count={totalRecords}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </Paper>

//       {/* ===== ACTION MENU ===== */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem
//           onClick={() => {
//             setOpenView(true);
//             handleMenuClose();
//           }}
//         >
//           <ListItemIcon>
//             <ViewIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>View</ListItemText>
//         </MenuItem>

//         <MenuItem
//   onClick={() => {
//     setOpenEdit(false);          // reset first (important)
//     setTimeout(() => {
//       setOpenEdit(true);         // reopen after state update
//     }, 0);
//     handleMenuClose();
//   }}
// >

//           <ListItemIcon>
//             <EditIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Edit</ListItemText>
//         </MenuItem>

//         <MenuItem
//           onClick={() => {
//             setOpenDelete(true);
//             handleMenuClose();
//           }}
//         >
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Delete</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* ===== MODALS ===== */}
//       <AddPieceRate
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         onAdd={handleAdd}
//       />

//       {selectedRate && (
//         <>
//           <ViewPieceRate
//             open={openView}
//             onClose={() => setOpenView(false)}
//             pieceRate={selectedRate}
//           />
//           <EditPieceRate
//             open={openEdit}
//             onClose={() => setOpenEdit(false)}
//             pieceRate={selectedRate}
//             onUpdate={handleUpdate}
//           />
//           <DeletePieceRate
//             open={openDelete}
//             onClose={() => setOpenDelete(false)}
//             pieceRate={selectedRate}
//             onDelete={handleDelete}
//           />
//         </>
//       )}

//       {/* ===== BULK DELETE CONFIRMATION DIALOG ===== */}
//       <Dialog
//         open={openBulkDeleteDialog}
//         onClose={() => setOpenBulkDeleteDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             borderBottom: "1px solid #E0E0E0",
//             backgroundColor: "#FDEDED",
//           }}
//         >
//           <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
//             Confirm Bulk Delete
//           </Typography>
//         </DialogTitle>

//         <DialogContent sx={{ pt: 3 }}>
//           <Stack spacing={2}>
//             <Typography>
//               Are you sure you want to delete <strong>{selected.length}</strong>{" "}
//               selected piece rate(s)?
//             </Typography>

//             <Typography variant="body2" color="text.secondary">
//               This action cannot be undone.
//             </Typography>

//             {bulkDeleteError && (
//               <Alert severity="error">{bulkDeleteError}</Alert>
//             )}
//           </Stack>
//         </DialogContent>

//         <DialogActions
//           sx={{
//             px: 3,
//             pb: 3,
//             borderTop: "1px solid #E0E0E0",
//             pt: 2,
//             backgroundColor: "#F8FAFC",
//           }}
//         >
//           <Button
//             onClick={() => setOpenBulkDeleteDialog(false)}
//             disabled={bulkDeleteLoading}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleBulkDeleteConfirm}
//             disabled={bulkDeleteLoading}
//             startIcon={!bulkDeleteLoading && <DeleteIcon />}
//           >
//             {bulkDeleteLoading ? "Deleting..." : "Delete Selected"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ===== SNACKBAR ===== */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PieceRateMaster;

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
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  Work as WorkIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddPieceRate from './AddPieceRate';
import EditPieceRate from './EditPieceRate';
import ViewPieceRate from './ViewPieceRate';
import DeletePieceRate from './DeletePieceRate';

// Color constants
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
    inactive: '#F1F5F9'
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
const ActionMenu = ({ item, onView, onEdit, onDelete, anchorEl, onClose, onOpen, permissions, isSuperAdmin }) => {
  const canView = hasPermission(permissions, MODULES.PIECE_RATE_MASTER, PAGES.PIECE_RATE_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.PIECE_RATE_MASTER, PAGES.PIECE_RATE_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.PIECE_RATE_MASTER, PAGES.PIECE_RATE_MASTER, ACTIONS.DELETE);
  
  // Superadmin has all permissions
  const hasFullAccess = isSuperAdmin;

  // If no actions available, don't render the menu
  if (!hasFullAccess && !canView && !canUpdate && !canDelete) {
    return null;
  }

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
        {(hasFullAccess || canView) && (
          <MenuItem 
            onClick={() => {
              onView(item);
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
        
        {(hasFullAccess || canUpdate) && (
          <MenuItem 
            onClick={() => {
              onEdit(item);
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
        
        {(hasFullAccess || canView || canUpdate) && (hasFullAccess || canDelete) && (
          <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        )}
        
        {(hasFullAccess || canDelete) && (
          <MenuItem 
            onClick={() => {
              onDelete(item);
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

const PieceRateMaster = () => {
  // State for data
  const [pieceRates, setPieceRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRateForAction, setSelectedRateForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  
  // Selected piece rate
  const [selectedRate, setSelectedRate] = useState(null);
  
  // Bulk delete loading state
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState('');
  
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
          
          // Set permissions array
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
    // Super admin has all permissions
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      MODULES.PIECE_RATE_MASTER,
      PAGES.PIECE_RATE_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canImport = checkPermission(ACTIONS.IMPORT);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch piece rates from API
  const fetchPieceRates = useCallback(async () => {
    // Only fetch if user has view permission
    if (!canViewPage && !isSuperAdmin) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const queryString = params.toString();
      const url = `${BASE_URL}/api/piece-rate-master${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const allRates = response.data.data || [];
        setPieceRates(allRates);
        setTotalItems(allRates.length);
      } else {
        showNotification('Failed to load piece rates', 'error');
      }
    } catch (err) {
      console.error('Error fetching piece rates:', err);
      showNotification('Failed to load piece rates. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, canViewPage, isSuperAdmin]);

  // Fetch records when dependencies change
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchPieceRates();
    }
  }, [fetchPieceRates, permissionsLoaded, canViewPage, isSuperAdmin]);

  // Handle refresh
  const handleRefresh = () => {
    fetchPieceRates();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete && !isSuperAdmin) return;
    
    if (event.target.checked) {
      const currentPageRates = pieceRates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setSelected(currentPageRates.map(rate => rate._id));
    } else {
      setSelected([]);
    }
  };
  
  // Handle single selection - only if user has delete permission
  const handleSelect = (id) => {
    if (!canDelete && !isSuperAdmin) return;
    
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
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setSelected([]);
  };
  
  // Handle bulk delete confirmation
  const handleBulkDeleteConfirm = async () => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete piece rates', 'error');
      return;
    }
    
    if (selected.length === 0) return;

    try {
      setBulkDeleteLoading(true);
      setBulkDeleteError('');

      const token = localStorage.getItem('token');

      await Promise.all(
        selected.map((id) =>
          axios.delete(`${BASE_URL}/api/piece-rate-master/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setOpenBulkDeleteDialog(false);
      setSelected([]);
      fetchPieceRates();
      showNotification('Selected piece rates deleted successfully', 'success');
    } catch (error) {
      console.error('Bulk delete error:', error);
      setBulkDeleteError(
        error.response?.data?.message || 'Failed to delete selected piece rates'
      );
    } finally {
      setBulkDeleteLoading(false);
    }
  };
  
  // Handle add piece rate
  const handleAddRate = () => {
    fetchPieceRates();
    showNotification('Piece rate added successfully!', 'success');
  };
  
  // Handle edit piece rate
  const handleEditRate = () => {
    fetchPieceRates();
    showNotification('Piece rate updated successfully!', 'success');
  };
  
  // Handle delete piece rate
  const handleDeleteRate = () => {
    fetchPieceRates();
    setSelected([]);
    showNotification('Piece rate deleted successfully!', 'success');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, rate) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRateForAction(rate);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRateForAction(null);
  };

  // Open edit modal
  const openEditModalHandler = (rate) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to edit piece rates', 'error');
      return;
    }
    setSelectedRate(rate);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewModalHandler = (rate) => {
    if (!canViewPage && !isSuperAdmin) {
      showNotification('You do not have permission to view piece rates', 'error');
      return;
    }
    setSelectedRate(rate);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteDialogHandler = (rate) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete piece rates', 'error');
      return;
    }
    setSelectedRate(rate);
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
  
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Get status styles
  const getStatusStyles = (isActive) => {
    return isActive ? {
      bg: COLORS.chips.active,
      text: COLORS.primaryDark,
      border: '#86efac'
    } : {
      bg: COLORS.chips.inactive,
      text: COLORS.text.secondary,
      border: COLORS.border
    };
  };
  
  // Get status text
  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };
  
  // Get avatar initials
  const getAvatarInitials = (productType) => {
    if (!productType) return 'PR';
    return productType.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on product type
  const getAvatarColor = (productType) => {
    if (!productType) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = productType.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Get skill level badge color
  const getSkillLevelColor = (skillLevel) => {
    switch(skillLevel?.toLowerCase()) {
      case 'unskilled':
        return 'default';
      case 'semi-skilled':
        return 'info';
      case 'skilled':
        return 'success';
      case 'highly skilled':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get current page records
  const currentPageRates = pieceRates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          Piece Rate Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage production piece rates and skill-based wages
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
              placeholder="Search by product or operation..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 300 },
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
         
            />
          </Stack>

          {/* Action Buttons - Conditionally rendered based on permissions */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Bulk Delete Button - Only show if user has delete permission */}
            {(canDelete || isSuperAdmin) && selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenBulkDeleteDialog(true)}
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
            
            {/* Add Piece Rate Button - Only show if user has create permission */}
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
                Add Piece Rate
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Piece Rates Table */}
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
                      indeterminate={selected.length > 0 && selected.length < currentPageRates.length}
                      checked={currentPageRates.length > 0 && selected.length === currentPageRates.length}
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
                      disabled={loading || currentPageRates.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Product
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Operation
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Rate Per Unit
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Skill Level
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Status
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
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading piece rates...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : currentPageRates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No piece rates found' : 'No piece rates available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first piece rate to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                currentPageRates.map((rate) => {
                  const isSelected = selected.includes(rate._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedRateForAction?._id === rate._id;
                  const avatarColor = getAvatarColor(rate.productType);
                  const statusStyles = getStatusStyles(rate.isActive);

                  return (
                    <TableRow
                      key={rate._id}
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
                            onChange={() => handleSelect(rate._id)}
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
                            {getAvatarInitials(rate.productType)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {rate.productType || 'N/A'}
                            </Typography>
                            {rate.uom && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                Per {rate.uom}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <WorkIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {rate.operation || '—'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <MoneyIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                            {formatCurrency(rate.ratePerUnit)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rate.skillLevel || 'Unskilled'}
                          size="small"
                          color={getSkillLevelColor(rate.skillLevel)}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(rate.isActive)}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 20,
                            bgcolor: statusStyles.bg,
                            color: statusStyles.text,
                            border: `1px solid ${statusStyles.border}`,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={rate}
                          onView={openViewModalHandler}
                          onEdit={openEditModalHandler}
                          onDelete={openDeleteDialogHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, rate)}
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

        {/* Pagination */}
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
        <AddPieceRate 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddRate}
        />
      )}

      {selectedRate && (
        <>
          {(canViewPage || isSuperAdmin) && (
            <ViewPieceRate 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedRate(null);
              }}
              pieceRate={selectedRate}
            />
          )}

          {(canUpdate || isSuperAdmin) && (
            <EditPieceRate 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedRate(null);
              }}
              pieceRate={selectedRate}
              onUpdate={handleEditRate}
            />
          )}

          {(canDelete || isSuperAdmin) && (
            <DeletePieceRate 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedRate(null);
              }}
              pieceRate={selectedRate}
              onDelete={handleDeleteRate}
            />
          )}
        </>
      )}

      {/* Bulk Delete Confirmation Dialog - Only show if user has delete permission */}
      {(canDelete || isSuperAdmin) && (
        <Dialog
          open={openBulkDeleteDialog}
          onClose={() => setOpenBulkDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#FEF2F2',
              color: '#991B1B',
              fontWeight: 600,
              fontSize: '1rem',
              p: 2,
              borderBottom: `1px solid ${COLORS.border}`
            }}
          >
            Confirm Bulk Delete
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.primary }}>
                Are you sure you want to delete <strong>{selected.length}</strong> selected piece rate(s)?
              </Typography>

              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                This action cannot be undone.
              </Typography>

              {bulkDeleteError && (
                <Alert 
                  severity="error" 
                  variant="filled"
                  sx={{ 
                    borderRadius: 1.5,
                    fontSize: '0.75rem'
                  }}
                >
                  {bulkDeleteError}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
              borderTop: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.light
            }}
          >
            <Button
              onClick={() => setOpenBulkDeleteDialog(false)}
              disabled={bulkDeleteLoading}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: COLORS.text.secondary
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleBulkDeleteConfirm}
              disabled={bulkDeleteLoading}
              startIcon={!bulkDeleteLoading && <DeleteIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                px: 3
              }}
            >
              {bulkDeleteLoading ? <CircularProgress size={20} /> : "Delete Selected"}
            </Button>
          </DialogActions>
        </Dialog>
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

export default PieceRateMaster;