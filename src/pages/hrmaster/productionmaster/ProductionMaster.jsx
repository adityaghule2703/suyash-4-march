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
//   CircularProgress,
//   Grid,
//   Card,
//   CardContent,
//   alpha,
// } from "@mui/material";

// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   MoreVert as MoreVertIcon,
//   CheckCircle as ApproveIcon,
//   Cancel as RejectIcon,
//   Payment as PaymentIcon,
//   Visibility as VisibilityIcon,
// } from "@mui/icons-material";

// import axios from "axios";
// import BASE_URL from "../../../config/Config";
// import AddProduction from "./AddProduction";
// import ViewProduction from "./ViewProduction";

// /* ===== DESIGN CONSTANTS ===== */
// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// const PRIMARY_BLUE = "#00B4D8";

// const ProductionMaster = () => {
//   const [productions, setProductions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [selected, setSelected] = useState([]);
//   const [selectedProduction, setSelectedProduction] = useState(null);

//   const [openAdd, setOpenAdd] = useState(false);
//   const [openMarkPaidDialog, setOpenMarkPaidDialog] = useState(false);
//   const [markPaidLoading, setMarkPaidLoading] = useState(false);
//   const [markPaidError, setMarkPaidError] = useState("");
//   const [openView, setOpenView] = useState(false); // ✅ ADD THIS
  
//   const [anchorEl, setAnchorEl] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   /* ================= FETCH PRODUCTIONS ================= */
//   useEffect(() => {
//     fetchProductions();
//   }, [page, rowsPerPage, search, fromDate, toDate]);

//   const fetchProductions = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // 🔥 FIXED: Using the correct endpoint based on your working code
//       const params = {
//         page: page + 1,
//         limit: rowsPerPage,
//       };

//       if (search) params.search = search;
//       if (fromDate) params.fromDate = fromDate;
//       if (toDate) params.toDate = toDate;

//       // Using the pending endpoint from your working code
//       const res = await axios.get(`${BASE_URL}/api/production/pending`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       console.log("API Response:", res.data);

//       if (res.data.success) {
//         setProductions(res.data.data || []);
//         setTotalRecords(res.data.data?.length || 0);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       showNotification("Failed to load production records", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   /* ================= APPROVE / REJECT ================= */
//   const handleApproveReject = async (id, status) => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.put(
//         `${BASE_URL}/api/production/${id}/approve`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       showNotification(`Production ${status} successfully`, "success");
//       fetchProductions();
//       setSelected([]);
//     } catch {
//       showNotification("Action failed", "error");
//     }
//   };

//   /* ================= MARK AS PAID ================= */
//   const handleMarkPaid = async () => {
//   if (selected.length === 0) {
//     setMarkPaidError("No records selected");
//     return;
//   }

//   try {
//     setMarkPaidLoading(true);
//     setMarkPaidError("");

//     const token = localStorage.getItem("token");

//     const payload = {
//       productionIds: selected
//       // ❌ REMOVE salaryId completely
//     };

//     const res = await axios.post(
//       `${BASE_URL}/api/production/mark-paid`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (res.data.success) {
//       setOpenMarkPaidDialog(false);
//       setSelected([]);
//       fetchProductions();

//       showNotification(
//         `${res.data.modifiedCount || 0} record(s) marked as paid`,
//         "success"
//       );
//     }
//   } catch (error) {
//     setMarkPaidError(
//       error.response?.data?.message || "Failed to mark records as paid"
//     );
//   } finally {
//     setMarkPaidLoading(false);
//   }
// };

//   /* ================= CHECKBOX ================= */
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(productions.map((p) => p._id));
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

//   /* ================= FILTER HANDLERS ================= */
//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//     setPage(0);
//   };

//   const handleFromDateChange = (e) => {
//     setFromDate(e.target.value);
//     setPage(0);
//   };

//   const handleToDateChange = (e) => {
//     setToDate(e.target.value);
//     setPage(0);
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFromDate("");
//     setToDate("");
//     setPage(0);
//   };

//   /* ================= GET EMPLOYEE NAME ================= */
//   const getEmployeeName = (prod) => {
//     if (prod.employeeName) return prod.employeeName;
//     if (prod.EmployeeID) {
//       if (prod.EmployeeID.FullName) return prod.EmployeeID.FullName;
//       return `${prod.EmployeeID.FirstName || ""} ${prod.EmployeeID.LastName || ""}`.trim();
//     }
//     return "N/A";
//   };

//   /* ================= GET STATUS COLOR ================= */
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return { bg: "#e8f5e8", color: "#1b5e20" };
//       case "rejected":
//         return { bg: "#ffebee", color: "#b71c1c" };
//       case "pending":
//         return { bg: "#fff3e0", color: "#e65100" };
//       case "paid":
//         return { bg: "#e3f2fd", color: "#01579b" };
//       default:
//         return { bg: "#f5f5f5", color: "#616161" };
//     }
//   };

//   // Filter productions based on search and date
//   const filteredProductions = productions.filter((prod) => {
//     const matchesSearch =
//       search === "" ||
//       getEmployeeName(prod).toLowerCase().includes(search.toLowerCase()) ||
//       (prod.ProductName || prod.productName || "")
//         .toLowerCase()
//         .includes(search.toLowerCase()) ||
//       (prod.Operation || prod.operation || "")
//         .toLowerCase()
//         .includes(search.toLowerCase());

//     const prodDate = new Date(prod.Date || prod.date);
//     const matchesFromDate = !fromDate || prodDate >= new Date(fromDate);
//     const matchesToDate = !toDate || prodDate <= new Date(toDate);

//     return matchesSearch && matchesFromDate && matchesToDate;
//   });

//   // Calculate summary statistics
//   const summary = {
//     totalRecords: filteredProductions.length,
//     totalUnits: filteredProductions.reduce(
//       (sum, p) => sum + (p.totalUnits || 0),
//       0,
//     ),
//     totalGoodUnits: filteredProductions.reduce(
//       (sum, p) => sum + (p.goodUnits || p.GoodUnits || 0),
//       0,
//     ),
//     totalRejectedUnits: filteredProductions.reduce(
//       (sum, p) => sum + (p.rejectedUnits || p.RejectedUnits || 0),
//       0,
//     ),
//     totalAmount: filteredProductions.reduce(
//       (sum, p) => sum + (p.TotalAmount || p.DailyEarning || p.earnings || 0),
//       0,
//     ),
//     avgQuality:
//       filteredProductions.reduce(
//         (sum, p) => sum + (p.qualityPercentage || 0),
//         0,
//       ) / (filteredProductions.length || 1),
//   };

//   // Paginate
//   const paginatedProductions = filteredProductions.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
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
//           Production Master
//         </Typography>
//         <Typography variant="body2" color="#64748B">
//           Manage piece-rate production records
//         </Typography>
//       </Box>

//       {/* ===== SUMMARY CARDS ===== */}
//       {/* <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ bgcolor: "#e3f2fd", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="body2" color="textSecondary">
//                 Total Records
//               </Typography>
//               <Typography variant="h6">{summary.totalRecords}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ bgcolor: "#e8f5e8", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="body2" color="textSecondary">
//                 Total Units
//               </Typography>
//               <Typography variant="h6">{summary.totalUnits}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ bgcolor: "#fff3e0", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="body2" color="textSecondary">
//                 Good Units
//               </Typography>
//               <Typography variant="h6">{summary.totalGoodUnits}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ bgcolor: "#ffebee", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="body2" color="textSecondary">
//                 Rejected Units
//               </Typography>
//               <Typography variant="h6">{summary.totalRejectedUnits}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ bgcolor: "#e0f2f1", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="body2" color="textSecondary">
//                 Total Amount
//               </Typography>
//               <Typography variant="h6">
//                 ₹{summary.totalAmount.toFixed(2)}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ bgcolor: "#f3e5f5", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="body2" color="textSecondary">
//                 Avg Quality
//               </Typography>
//               <Typography variant="h6">
//                 {summary.avgQuality.toFixed(1)}%
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid> */}

//       {/* ===== FILTERS AND ACTIONS ===== */}
//       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           flexWrap="wrap"
//           gap={2}
//         >
//           <Stack
//             direction="row"
//             spacing={2}
//             alignItems="center"
//             flexWrap="wrap"
//           >
//             <TextField
//               size="small"
//               placeholder="Search employee, product..."
//               value={search}
//               onChange={handleSearch}
//               sx={{ width: 250 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ color: "#64748B" }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* <TextField
//               size="small"
//               type="date"
//               label="From Date"
//               value={fromDate}
//               onChange={handleFromDateChange}
//               InputLabelProps={{ shrink: true }}
//               sx={{ width: 150 }}
//             />

//             <TextField
//               size="small"
//               type="date"
//               label="To Date"
//               value={toDate}
//               onChange={handleToDateChange}
//               InputLabelProps={{ shrink: true }}
//               sx={{ width: 150 }}
//             /> */}

//             {(search || fromDate || toDate) && (
//               <Button size="small" onClick={clearFilters} variant="outlined">
//                 Clear
//               </Button>
//             )}
//           </Stack>

//           <Stack direction="row" spacing={2}>
//             {selected.length > 0 && (
//               <Button
//                 variant="contained"
//                 color="success"
//                 startIcon={<PaymentIcon />}
//                 onClick={() => setOpenMarkPaidDialog(true)}
//               >
//                 Mark Paid ({selected.length})
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
//               Add Production
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
//                     sx={{ color: "#fff" }}
//                     checked={
//                       paginatedProductions.length > 0 &&
//                       selected.length === productions.length
//                     }
//                     indeterminate={
//                       selected.length > 0 &&
//                       selected.length < productions.length
//                     }
//                     onChange={handleSelectAll}
//                   />
//                 </TableCell>
//                 <TableCell>Employee</TableCell>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Product</TableCell>
//                 <TableCell>Operation</TableCell>
//                 <TableCell>Good Units</TableCell>
//                 <TableCell>Rejected</TableCell>
//                 <TableCell>Earnings</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedProductions.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
//                     No records found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedProductions.map((prod) => {
//                   const prodId = prod._id;
//                   const statusColor = getStatusColor(
//                     prod.Status || prod.status,
//                   );
//                   const isPaid =
//                     prod.Status?.toLowerCase() === "paid" ||
//                     prod.status?.toLowerCase() === "paid";

//                   return (
//                     <TableRow key={prodId} hover>
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isSelected(prodId)}
//                           onChange={() => handleSelectOne(prodId)}
//                           disabled={isPaid}
//                         />
//                       </TableCell>

//                       <TableCell sx={{ fontWeight: 600 }}>
//                         {getEmployeeName(prod)}
//                       </TableCell>
//                       <TableCell>
//                         {new Date(prod.Date || prod.date).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>
//                         {prod.ProductName || prod.productName}
//                       </TableCell>
//                       <TableCell>{prod.Operation || prod.operation}</TableCell>
//                       <TableCell>{prod.GoodUnits || prod.goodUnits}</TableCell>
//                       <TableCell>
//                         {prod.RejectedUnits || prod.rejectedUnits || 0}
//                       </TableCell>
//                       <TableCell>
//                         ₹
//                         {(
//                           prod.TotalAmount ||
//                           prod.DailyEarning ||
//                           prod.earnings ||
//                           0
//                         ).toFixed(2)}
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={prod.Status || prod.status || "Pending"}
//                           size="small"
//                           sx={{
//                             backgroundColor: statusColor.bg,
//                             color: statusColor.color,
//                             fontWeight: 500,
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell align="center">
//                         <IconButton
//                           onClick={(e) => {
//                             setAnchorEl(e.currentTarget);
//                             setSelectedProduction(prod);
//                           }}
//                           size="small"
//                           disabled={isPaid}
//                           sx={{
//                             "&:hover": {
//                               bgcolor: alpha(PRIMARY_BLUE, 0.1),
//                             },
//                           }}
//                         >
//                           <MoreVertIcon />
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
//           component="div"
//           count={filteredProductions.length}
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
//         onClose={() => setAnchorEl(null)}
//       >
//         <MenuItem
//           onClick={() => {
//             setOpenView(true);
//             setAnchorEl(null);
//           }}
//         >
//           <ListItemIcon>
//             <VisibilityIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>View</ListItemText>
//         </MenuItem>
//         <MenuItem
//           onClick={() => {
//             handleApproveReject(selectedProduction?._id, "Approved");
//             setAnchorEl(null);
//           }}
//         >
//           <ListItemIcon>
//             <ApproveIcon fontSize="small" color="success" />
//           </ListItemIcon>
//           <ListItemText>Approve</ListItemText>
//         </MenuItem>

//         <MenuItem
//           onClick={() => {
//             handleApproveReject(selectedProduction?._id, "Rejected");
//             setAnchorEl(null);
//           }}
//         >
//           <ListItemIcon>
//             <RejectIcon fontSize="small" color="error" />
//           </ListItemIcon>
//           <ListItemText>Reject</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* ===== MARK AS PAID DIALOG ===== */}
//       <Dialog
//         open={openMarkPaidDialog}
//         onClose={() => !markPaidLoading && setOpenMarkPaidDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             borderBottom: "1px solid #E0E0E0",
//             backgroundColor: "#E8F5E9",
//           }}
//         >
//           <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#1b5e20" }}>
//             Mark as Paid
//           </Typography>
//         </DialogTitle>

//         <DialogContent sx={{ pt: 3 }}>
//           <Stack spacing={3}>
//             <Typography>
//               You are about to mark <strong>{selected.length}</strong>{" "}
//               production record(s) as paid.
//             </Typography>

//             <Alert severity="info" sx={{ mb: 2 }}>
//               This action will update the status of selected records to "Paid".
//             </Alert>

//             {markPaidError && <Alert severity="error">{markPaidError}</Alert>}
//           </Stack>
//         </DialogContent>

//         <DialogActions
//           sx={{
//             px: 3,
//             pb: 3,
//             borderTop: "1px solid #E0E0E0",
//             pt: 2,
//           }}
//         >
//           <Button
//             onClick={() => setOpenMarkPaidDialog(false)}
//             disabled={markPaidLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleMarkPaid}
//             disabled={markPaidLoading}
//             startIcon={
//               markPaidLoading ? <CircularProgress size={20} /> : <PaymentIcon />
//             }
//           >
//             {markPaidLoading ? "Processing..." : "Confirm Payment"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ===== ADD MODAL ===== */}
//       <AddProduction
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         onAdd={() => {
//           fetchProductions();
//           showNotification("Production added successfully", "success");
//         }}
//       />
//       <ViewProduction
//         open={openView}
//         onClose={() => setOpenView(false)}
//         production={selectedProduction}
//       />

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

// export default ProductionMaster;

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
  DialogActions,
  FormControl,
  Select,
  alpha,
} from "@mui/material";

import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Payment as PaymentIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddProduction from "./AddProduction";
import ViewProduction from "./ViewProduction";

// Color constants matching TaxMaster component
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

// Action Menu Component with permission checks
const ActionMenu = ({ item, onView, onApprove, onReject, anchorEl, onClose, onOpen, isPaid, userPermissions, isSuperAdmin }) => {
  // Check permissions
  const canView = isSuperAdmin || hasPermission(userPermissions, MODULES.PRODUCTION_MASTER, PAGES.PRODUCTION_MASTER, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(userPermissions, MODULES.PRODUCTION_MASTER, PAGES.PRODUCTION_MASTER, ACTIONS.UPDATE);
  const canApprove = isSuperAdmin || hasPermission(userPermissions, MODULES.PRODUCTION_MASTER, PAGES.PRODUCTION_MASTER, ACTIONS.APPROVE);
  const canReject = isSuperAdmin || hasPermission(userPermissions, MODULES.PRODUCTION_MASTER, PAGES.PRODUCTION_MASTER, ACTIONS.REJECT);

  // Only show approve/reject if status is pending and user has permission
  const isPending = item?.Status?.toLowerCase() === "pending" || item?.status?.toLowerCase() === "pending";

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          disabled={isPaid}
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
        
        {(canApprove || canReject) && isPending && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
            
            {canApprove && (
              <MenuItem 
                onClick={() => {
                  onApprove(item);
                  onClose();
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: '#059669', minWidth: 36 }}>
                  <ApproveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                    Approve
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}

            {canReject && (
              <MenuItem 
                onClick={() => {
                  onReject(item);
                  onClose();
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: '#DC2626', minWidth: 36 }}>
                  <RejectIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                    Reject
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

const ProductionMaster = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const [selected, setSelected] = useState([]);
  const [selectedProduction, setSelectedProduction] = useState(null);

  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedProductionForAction, setSelectedProductionForAction] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openMarkPaidDialog, setOpenMarkPaidDialog] = useState(false);
  const [markPaidLoading, setMarkPaidLoading] = useState(false);
  const [markPaidError, setMarkPaidError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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
      MODULES.PRODUCTION_MASTER,
      PAGES.PRODUCTION_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canApprove = checkPermission(ACTIONS.APPROVE);
  const canReject = checkPermission(ACTIONS.REJECT);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch productions - only if user has view permission
  const fetchProductions = useCallback(async () => {
    // Only fetch if user has view permission
    if (!canViewPage && !isSuperAdmin) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const response = await axios.get(`${BASE_URL}/api/production/pending?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProductions(response.data.data || []);
        setTotalItems(response.data.count || response.data.data?.length || 0);
      } else {
        showNotification("Failed to load production records", "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showNotification("Failed to load production records", "error");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchProductions();
    }
  }, [fetchProductions, permissionsLoaded, canViewPage, isSuperAdmin]);

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRefresh = () => {
    fetchProductions();
    showNotification("Data refreshed", "success");
  };

  // Handle selection - only if user has update permission (for marking paid)
  const handleSelectAll = (event) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification("You don't have permission to mark records as paid", "error");
      return;
    }
    
    if (event.target.checked) {
      setSelected(productions.map(p => p._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification("You don't have permission to mark records as paid", "error");
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
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setSelected([]);
  };

  const handleApproveReject = async (id, status) => {
    // Check permission for approve/reject
    if (status === "Approved" && !canApprove && !isSuperAdmin) {
      showNotification("You don't have permission to approve production records", "error");
      return;
    }
    if (status === "Rejected" && !canReject && !isSuperAdmin) {
      showNotification("You don't have permission to reject production records", "error");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/api/production/${id}/approve`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification(`Production ${status.toLowerCase()} successfully`, "success");
      fetchProductions();
      setSelected([]);
    } catch {
      showNotification("Action failed", "error");
    }
  };

  const handleMarkPaid = async () => {
    // Check permission for marking paid (update permission)
    if (!canUpdate && !isSuperAdmin) {
      showNotification("You don't have permission to mark records as paid", "error");
      return;
    }
    
    if (selected.length === 0) {
      setMarkPaidError("No records selected");
      return;
    }

    try {
      setMarkPaidLoading(true);
      setMarkPaidError("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/production/mark-paid`,
        { productionIds: selected },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setOpenMarkPaidDialog(false);
        setSelected([]);
        fetchProductions();
        showNotification(`${response.data.modifiedCount || 0} record(s) marked as paid`, "success");
      }
    } catch (error) {
      setMarkPaidError(error.response?.data?.message || "Failed to mark records as paid");
    } finally {
      setMarkPaidLoading(false);
    }
  };

  const getEmployeeName = (prod) => {
    if (prod.employeeName) return prod.employeeName;
    if (prod.EmployeeID) {
      if (prod.EmployeeID.FullName) return prod.EmployeeID.FullName;
      return `${prod.EmployeeID.FirstName || ""} ${prod.EmployeeID.LastName || ""}`.trim();
    }
    return "N/A";
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          bg: COLORS.status.success,
          text: COLORS.primaryDark,
          border: '#86efac'
        };
      case "rejected":
        return {
          bg: COLORS.status.error,
          text: '#991b1b',
          border: '#fecaca'
        };
      case "paid":
        return {
          bg: COLORS.status.info,
          text: '#075985',
          border: '#bae6fd'
        };
      default:
        return {
          bg: COLORS.status.warning,
          text: '#854d0e',
          border: '#fed7aa'
        };
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getAvatarInitials = (employeeName) => {
    if (!employeeName || employeeName === "N/A") return "PR";
    const names = employeeName.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return employeeName.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (employeeName) => {
    if (!employeeName) return COLORS.primary;

    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];

    const charCode = employeeName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number(amount).toFixed(2)}`;
  };

  // Action menu handlers
  const handleActionMenuOpen = (event, production) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedProductionForAction(production);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedProductionForAction(null);
  };

  const openViewModal = (production) => {
    if (!canViewPage && !isSuperAdmin) {
      showNotification("You don't have permission to view production details", "error");
      return;
    }
    setSelectedProduction(production);
    setOpenView(true);
    handleActionMenuClose();
  };

  const handleApprove = (production) => {
    handleApproveReject(production._id, "Approved");
  };

  const handleReject = (production) => {
    handleApproveReject(production._id, "Rejected");
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "paid", label: "Paid" }
  ];

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
          Production Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage piece-rate production records, approvals, and payments
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
          {/* Search and Filters */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search employee, product, operation..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 280 },
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

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Mark Paid Button - Only show if user has update permission */}
            {(canUpdate || isSuperAdmin) && selected.length > 0 && (
              <Button
                variant="outlined"
                color="success"
                startIcon={<PaymentIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenMarkPaidDialog(true)}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: '#86efac',
                  color: '#059669',
                  '&:hover': {
                    borderColor: '#86efac',
                    bgcolor: alpha('#059669', 0.1)
                  }
                }}
                disabled={loading}
              >
                Mark Paid ({selected.length})
              </Button>
            )}

            {/* Add Production Button - Only show if user has create permission */}
            {(canCreate || isSuperAdmin) && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAdd(true)}
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
                Add Production
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Production Table */}
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
                {/* Checkbox Column - Only show if user has update permission (for marking paid) */}
                {(canUpdate || isSuperAdmin) && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < productions.length}
                      checked={productions.length > 0 && selected.length === productions.length}
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
                      disabled={loading || productions.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Employee
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Date
                </TableCell>
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
                  Good Units
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Rejected
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Earnings
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
                  <TableCell colSpan={(canUpdate || isSuperAdmin) ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading production records...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : productions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(canUpdate || isSuperAdmin) ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No production records found' : 'No production records available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first production record to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                productions.map((production) => {
                  const isSelected = selected.includes(production._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) &&
                    selectedProductionForAction?._id === production._id;
                  const employeeName = getEmployeeName(production);
                  const avatarColor = getAvatarColor(employeeName);
                  const statusStyles = getStatusStyles(production.Status || production.status);
                  const isPaid = (production.Status || production.status)?.toLowerCase() === "paid";
                  const goodUnits = production.GoodUnits || production.goodUnits || 0;
                  const rejectedUnits = production.RejectedUnits || production.rejectedUnits || 0;
                  const earnings = production.TotalAmount || production.DailyEarning || production.earnings || 0;

                  return (
                    <TableRow
                      key={production._id}
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
                      {/* Checkbox Column - Only show if user has update permission */}
                      {(canUpdate || isSuperAdmin) && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectOne(production._id)}
                            disabled={isPaid}
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
                            {getAvatarInitials(employeeName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {employeeName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {production._id?.slice(-6)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <CalendarIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDate(production.Date || production.date)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<WorkIcon sx={{ fontSize: '0.7rem' }} />}
                          label={production.ProductName || production.productName || "-"}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: COLORS.background.light,
                            color: COLORS.text.secondary,
                            '& .MuiChip-icon': {
                              fontSize: '0.7rem',
                              ml: 0.5
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {production.Operation || production.operation || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                          {goodUnits}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#DC2626' }}>
                          {rejectedUnits}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          {formatCurrency(earnings)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(production.Status || production.status)}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
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
                          item={production}
                          onView={openViewModal}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, production)}
                          isPaid={isPaid}
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

      {/* Mark as Paid Dialog */}
      <Dialog
        open={openMarkPaidDialog}
        onClose={() => !markPaidLoading && setOpenMarkPaidDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Mark as Paid
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
              You are about to mark <strong>{selected.length}</strong> production record(s) as paid.
            </Typography>

            <Alert
              severity="info"
              sx={{
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5,
                '& .MuiAlert-icon': { fontSize: '1.25rem' }
              }}
            >
              This action will update the status of selected records to "Paid".
            </Alert>

            {markPaidError && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  py: 0.5,
                  '& .MuiAlert-icon': { fontSize: '1.25rem' }
                }}
              >
                {markPaidError}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1
        }}>
          <Button
            onClick={() => setOpenMarkPaidDialog(false)}
            disabled={markPaidLoading}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleMarkPaid}
            disabled={markPaidLoading}
            startIcon={markPaidLoading ? null : <PaymentIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: '#059669',
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: '#047857',
              },
              '&:disabled': {
                bgcolor: COLORS.border,
                color: COLORS.text.tertiary
              }
            }}
          >
            {markPaidLoading ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modals - Only render if user has appropriate permissions */}
      {(canCreate || isSuperAdmin) && (
        <AddProduction
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onAdd={() => {
            fetchProductions();
            showNotification("Production added successfully", "success");
          }}
        />
      )}

      {(canViewPage || isSuperAdmin) && selectedProduction && (
        <ViewProduction
          open={openView}
          onClose={() => {
            setOpenView(false);
            setSelectedProduction(null);
          }}
          production={selectedProduction}
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
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default ProductionMaster;