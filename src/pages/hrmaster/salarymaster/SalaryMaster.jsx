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
//   FormControl,
//   Select,
//   alpha,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   FormLabel,
// } from "@mui/material";
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   MoreVert as MoreVertIcon,
//   CheckCircle as ApproveIcon,
//   Payment as PaymentIcon,
// } from "@mui/icons-material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// import AddSalary from "./AddSalary";
// import EditSalary from "./EditSalary";
// import ViewSalary from "./ViewSalary";
// import DeleteSalary from "./DeleteSalary";

// /* === SAME STYLE CONSTANTS AS EMPLOYEE MASTER === */
// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// const STRIPE_ODD = "#FFFFFF";
// const STRIPE_EVEN = "#f8fafc";
// const HOVER_COLOR = "#f1f5f9";
// const PRIMARY_BLUE = "#00B4D8";
// const TEXT_MAIN = "#0f172a";

// const SalaryMaster = () => {
//   /* ================= EXISTING STATE ================= */
//   const [salaries, setSalaries] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [approveLoading, setApproveLoading] = useState(false);
//   const [markPaidLoading, setMarkPaidLoading] = useState(false);
//   const [actionInProgress, setActionInProgress] = useState(null);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [search, setSearch] = useState("");
//   const [employeeFilter, setEmployeeFilter] = useState("");

//   const [selected, setSelected] = useState([]);
//   const [selectedSalary, setSelectedSalary] = useState(null);

//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openView, setOpenView] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [openMarkPaid, setOpenMarkPaid] = useState(false);

//   const [anchorEl, setAnchorEl] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   /* ================= MARK AS PAID STATE ================= */
//   const [paymentDetails, setPaymentDetails] = useState({
//     paymentMode: "BANK_TRANSFER",
//     transactionId: "",
//     paymentDate: new Date(),
//   });

//   /* ================= FETCH EMPLOYEES ================= */
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.data.success) {
//         setEmployees(response.data.data);
//       }
//     } catch {}
//   };

//   /* ================= FETCH SALARIES ================= */
//   useEffect(() => {
//     fetchSalaries();
//   }, [page, rowsPerPage, employeeFilter]);

//   const fetchSalaries = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const response = await axios.get(`${BASE_URL}/api/salaries`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           page: page + 1,
//           limit: rowsPerPage,
//           employeeId: employeeFilter || undefined,
//         },
//       });

//       if (response.data.success) {
//         setSalaries(response.data.data);
//         setTotalRecords(response.data.total);
//       }
//     } catch {
//       showNotification("Failed to load salaries", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   /* ================= APPROVE SALARY ================= */
//   const handleApprove = async (salary) => {
//     try {
//       setApproveLoading(true);
//       setActionInProgress(salary._id);
//       const token = localStorage.getItem("token");
      
//       const response = await axios.put(
//         `${BASE_URL}/api/salaries/${salary._id}/approve`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         showNotification("Salary approved successfully", "success");
//         fetchSalaries(); // Refresh the list
//       }
//     } catch (error) {
//       showNotification(
//         error.response?.data?.message || "Failed to approve salary",
//         "error"
//       );
//     } finally {
//       setApproveLoading(false);
//       setActionInProgress(null);
//       handleMenuClose();
//     }
//   };

//   /* ================= MARK AS PAID ================= */
//   const handleMarkPaid = async () => {
//     try {
//       setMarkPaidLoading(true);
//       setActionInProgress(selectedSalary._id);
//       const token = localStorage.getItem("token");
      
//       const payload = {
//         paymentMode: paymentDetails.paymentMode,
//         transactionId: paymentDetails.transactionId || undefined,
//         paymentDate: paymentDetails.paymentDate.toISOString().split('T')[0],
//       };

//       const response = await axios.put(
//         `${BASE_URL}/api/salaries/${selectedSalary._id}/mark-paid`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         showNotification("Salary marked as paid successfully", "success");
//         fetchSalaries(); // Refresh the list
//         setOpenMarkPaid(false);
//         setPaymentDetails({
//           paymentMode: "BANK_TRANSFER",
//           transactionId: "",
//           paymentDate: new Date(),
//         });
//       }
//     } catch (error) {
//       showNotification(
//         error.response?.data?.message || "Failed to mark salary as paid",
//         "error"
//       );
//     } finally {
//       setMarkPaidLoading(false);
//       setActionInProgress(null);
//       handleMenuClose();
//     }
//   };

//   /* ================= CHECKBOX ================= */
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(salaries.map((s) => s._id));
//     } else {
//       setSelected([]);
//     }
//   };

//   const handleSelectOne = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const isSelected = (id) => selected.includes(id);

//   /* ================= ACTION MENU ================= */
//   const handleMenuOpen = (event, salary) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedSalary(salary);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   /* ================= CRUD HANDLERS ================= */
//   const handleAdd = () => {
//     fetchSalaries();
//     showNotification("Salary added successfully", "success");
//   };

//   const handleUpdate = () => {
//     fetchSalaries();
//     showNotification("Salary updated successfully", "success");
//   };

//   const handleDelete = () => {
//     fetchSalaries();
//     showNotification("Salary deleted successfully", "success");
//   };

//   const formatCurrency = (amount) =>
//     `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;

//   const getStatusColor = (status) => {
//     switch(status) {
//       case "PAID":
//         return { bg: "#dcfce7", color: "#166534" };
//       case "APPROVED":
//         return { bg: "#dbeafe", color: "#1e40af" };
//       case "PROCESSED":
//         return { bg: "#dcfce7", color: "#166534" };
//       case "PENDING":
//         return { bg: "#fef3c7", color: "#92400e" };
//       case "CANCELLED":
//         return { bg: "#fee2e2", color: "#991b1b" };
//       default:
//         return { bg: "#f1f5f9", color: "#334155" };
//     }
//   };

//   const filteredSalaries = salaries.filter((s) =>
//     s.employeeName?.toLowerCase().includes(search.toLowerCase())
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
//           Salary Master
//         </Typography>
//         <Typography variant="body2" color="#64748B">
//           Manage employee payroll and salary records
//         </Typography>
//       </Box>

//       {/* ===== ACTION BAR ===== */}
//       <Paper
//         sx={{
//           p: 2,
//           mb: 3,
//           borderRadius: 2,
//           border: "1px solid #e2e8f0",
//         }}
//       >
//         <Stack direction="row" justifyContent="space-between">

//           <Stack direction="row" spacing={2}>
//             <TextField
//               size="small"
//               placeholder="Search employee..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               sx={{ width: 300 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ color: "#64748B" }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <FormControl size="small" sx={{ minWidth: 200 }}>
//               <Select
//                 displayEmpty
//                 value={employeeFilter}
//                 onChange={(e) => {
//                   setEmployeeFilter(e.target.value);
//                   setPage(0);
//                 }}
//               >
//                 <MenuItem value="">All Employees</MenuItem>
//                 {employees.map((emp) => (
//                   <MenuItem key={emp._id} value={emp._id}>
//                     {emp.FirstName} {emp.LastName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Stack>

//           <Stack direction="row" spacing={2}>
//             {selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon />}
//                 onClick={() => {
//                   if (selected.length === 1) {
//                     const salary = salaries.find(
//                       (s) => s._id === selected[0]
//                     );
//                     setSelectedSalary(salary);
//                     setOpenDelete(true);
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
//                 background: HEADER_GRADIENT,
//                 "&:hover": { opacity: 0.9 },
//               }}
//             >
//               Add Salary
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* ===== TABLE ===== */}
//       <Paper
//         sx={{
//           borderRadius: 2,
//           border: "1px solid #e2e8f0",
//           overflow: "hidden",
//         }}
//       >
//         <TableContainer>
//           <Table>

//             <TableHead>
//               <TableRow
//                 sx={{
//                   background: HEADER_GRADIENT,
//                   "& .MuiTableCell-root": {
//                     color: "#fff",
//                     fontWeight: 600,
//                     borderBottom: "none",
//                   },
//                 }}
//               >
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     sx={{
//                       color: "#fff",
//                       "&.Mui-checked": { color: "#fff" },
//                     }}
//                     checked={
//                       salaries.length > 0 &&
//                       selected.length === salaries.length
//                     }
//                     indeterminate={
//                       selected.length > 0 &&
//                       selected.length < salaries.length
//                     }
//                     onChange={handleSelectAll}
//                   />
//                 </TableCell>
//                 <TableCell>Employee</TableCell>
//                 <TableCell>Period</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Gross</TableCell>
//                 <TableCell>Net Pay</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center">
//                     <CircularProgress size={30} sx={{ my: 2 }} />
//                   </TableCell>
//                 </TableRow>
//               ) : filteredSalaries.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center">
//                     No salaries found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredSalaries.map((salary, index) => {
//                   const statusColors = getStatusColor(salary.paymentStatus);
//                   return (
//                     <TableRow
//                       key={salary._id}
//                       hover
//                       sx={{
//                         bgcolor:
//                           index % 2 === 0 ? STRIPE_ODD : STRIPE_EVEN,
//                         "&:hover": { bgcolor: HOVER_COLOR },
//                       }}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isSelected(salary._id)}
//                           onChange={() =>
//                             handleSelectOne(salary._id)
//                           }
//                           sx={{
//                             color: PRIMARY_BLUE,
//                             "&.Mui-checked": {
//                               color: PRIMARY_BLUE,
//                             },
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>
//                         {salary.employeeName}
//                       </TableCell>
//                       <TableCell>{salary.periodDisplay}</TableCell>
//                       <TableCell>{salary.employmentType}</TableCell>
//                       <TableCell>
//                         {formatCurrency(salary.grossSalary)}
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>
//                         {formatCurrency(salary.netPay)}
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={salary.paymentStatus}
//                           size="small"
//                           sx={{
//                             backgroundColor: statusColors.bg,
//                             color: statusColors.color,
//                             border: "1px solid #e2e8f0",
//                             fontWeight: 500,
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="center">
//                         <IconButton
//                           onClick={(e) =>
//                             handleMenuOpen(e, salary)
//                           }
//                           sx={{
//                             "&:hover": {
//                               bgcolor: alpha(
//                                 PRIMARY_BLUE,
//                                 0.1
//                               ),
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
//           onClick={() => {
//             setOpenEdit(true);
//             handleMenuClose();
//           }}
//           disabled={selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID'}
//         >
//           <ListItemIcon>
//             <EditIcon fontSize="small" sx={{ 
//               color: (selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID') 
//                 ? '#94a3b8' : 'inherit' 
//             }} />
//           </ListItemIcon>
//           <ListItemText>
//             Edit
//             {(selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID') && 
//               " (Locked)"}
//           </ListItemText>
//         </MenuItem>

//         {/* Approve Option - Only show if not already approved and not paid */}
//         {selectedSalary?.paymentStatus !== 'APPROVED' && 
//          selectedSalary?.paymentStatus !== 'PAID' && (
//           <MenuItem
//             onClick={() => handleApprove(selectedSalary)}
//             disabled={approveLoading && actionInProgress === selectedSalary?._id}
//           >
//             <ListItemIcon>
//               {approveLoading && actionInProgress === selectedSalary?._id ? (
//                 <CircularProgress size={20} />
//               ) : (
//                 <ApproveIcon fontSize="small" sx={{ color: '#10b981' }} />
//               )}
//             </ListItemIcon>
//             <ListItemText>Approve</ListItemText>
//           </MenuItem>
//         )}

//         {/* Mark as Paid Option - Only show if approved and not already paid */}
//         {selectedSalary?.paymentStatus === 'APPROVED' && (
//           <MenuItem
//             onClick={() => {
//               setOpenMarkPaid(true);
//               handleMenuClose();
//             }}
//             disabled={markPaidLoading && actionInProgress === selectedSalary?._id}
//           >
//             <ListItemIcon>
//               {markPaidLoading && actionInProgress === selectedSalary?._id ? (
//                 <CircularProgress size={20} />
//               ) : (
//                 <PaymentIcon fontSize="small" sx={{ color: '#059669' }} />
//               )}
//             </ListItemIcon>
//             <ListItemText>Mark as Paid</ListItemText>
//           </MenuItem>
//         )}

//         {/* Show Paid badge if already paid */}
//         {selectedSalary?.paymentStatus === 'PAID' && (
//           <MenuItem disabled>
//             <ListItemIcon>
//               <PaymentIcon fontSize="small" sx={{ color: '#166534' }} />
//             </ListItemIcon>
//             <ListItemText>
//               <Chip 
//                 label="Paid" 
//                 size="small" 
//                 color="success"
//                 sx={{ height: 24 }}
//               />
//             </ListItemText>
//           </MenuItem>
//         )}

//         <MenuItem
//           onClick={() => {
//             setOpenDelete(true);
//             handleMenuClose();
//           }}
//           disabled={selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID'}
//         >
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" sx={{ 
//               color: (selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID') 
//                 ? '#94a3b8' : '#ef4444' 
//             }} />
//           </ListItemIcon>
//           <ListItemText>
//             Delete
//             {(selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID') && 
//               " (Locked)"}
//           </ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* ===== MARK AS PAID DIALOG ===== */}
//       <Dialog 
//         open={openMarkPaid} 
//         onClose={() => setOpenMarkPaid(false)}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{ sx: { borderRadius: 3 } }}
//       >
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #164e63, #0ea5e9)",
//             color: "#fff",
//             fontWeight: 600,
//           }}
//         >
//           Mark Salary as Paid
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <Stack spacing={3} sx={{ mt: 1 }}>
//             <FormControl component="fieldset">
//               <FormLabel component="legend">Payment Mode</FormLabel>
//               <RadioGroup
//                 row
//                 value={paymentDetails.paymentMode}
//                 onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMode: e.target.value })}
//               >
//                 <FormControlLabel value="BANK_TRANSFER" control={<Radio />} label="Bank Transfer" />
//                 <FormControlLabel value="CHEQUE" control={<Radio />} label="Cheque" />
//                 <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
//               </RadioGroup>
//             </FormControl>

//             <TextField
//               fullWidth
//               label="Transaction ID"
//               value={paymentDetails.transactionId}
//               onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
//               placeholder="Enter transaction reference"
//               size="small"
//               required={paymentDetails.paymentMode !== 'CASH'}
//             />

//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Payment Date"
//                 value={paymentDetails.paymentDate}
//                 onChange={(newValue) => setPaymentDetails({ ...paymentDetails, paymentDate: newValue })}
//                 renderInput={(params) => (
//                   <TextField {...params} fullWidth size="small" required />
//                 )}
//               />
//             </LocalizationProvider>
//           </Stack>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 3 }}>
//           <Button onClick={() => setOpenMarkPaid(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleMarkPaid}
//             disabled={markPaidLoading || !paymentDetails.paymentDate}
//             startIcon={markPaidLoading ? <CircularProgress size={20} /> : <PaymentIcon />}
//             sx={{
//               background: "linear-gradient(135deg, #164e63, #0ea5e9)",
//               "&:hover": { opacity: 0.9 },
//             }}
//           >
//             {markPaidLoading ? "Processing..." : "Confirm Payment"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ===== MODALS ===== */}
//       <AddSalary open={openAdd} onClose={() => setOpenAdd(false)} onAdd={handleAdd} />

//       {selectedSalary && (
//         <>
//           <ViewSalary 
//             open={openView} 
//             onClose={() => {
//               setOpenView(false);
//               setSelectedSalary(null);
//             }} 
//             salary={selectedSalary} 
//             onEdit={(salary) => {
//               setOpenView(false);
//               setSelectedSalary(salary);
//               setOpenEdit(true);
//             }}
//           />
//           <EditSalary 
//             open={openEdit} 
//             onClose={() => {
//               setOpenEdit(false);
//               setSelectedSalary(null);
//             }} 
//             salary={selectedSalary} 
//             onUpdate={handleUpdate} 
//           />
//           <DeleteSalary 
//             open={openDelete} 
//             onClose={() => {
//               setOpenDelete(false);
//               setSelectedSalary(null);
//             }} 
//             salary={selectedSalary} 
//             onDelete={handleDelete} 
//           />
//         </>
//       )}

//       {/* ===== SNACKBAR ===== */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         onClose={() =>
//           setSnackbar({ ...snackbar, open: false })
//         }
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default SalaryMaster;

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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Checkbox,
  FormControl,
  Select,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Avatar,
  Tooltip,
  Divider,
  Badge,
  Collapse
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as ApproveIcon,
  Payment as PaymentIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import BASE_URL from "../../../config/Config";

import AddSalary from "./AddSalary";
import EditSalary from "./EditSalary";
import ViewSalary from "./ViewSalary";
import DeleteSalary from "./DeleteSalary";

/* === SAME STYLE CONSTANTS AS EMPLOYEE MASTER === */
const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
const STRIPE_ODD = "#FFFFFF";
const STRIPE_EVEN = "#f8fafc";
const HOVER_COLOR = "#f1f5f9";
const PRIMARY_BLUE = "#00B4D8";
const TEXT_MAIN = "#0f172a";

const SalaryMaster = () => {
  /* ================= EXISTING STATE ================= */
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [markPaidLoading, setMarkPaidLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [selected, setSelected] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMarkPaid, setOpenMarkPaid] = useState(false);
  const [openBulkApprove, setOpenBulkApprove] = useState(false);
  const [openBulkDelete, setOpenBulkDelete] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ================= MARK AS PAID STATE ================= */
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMode: "BANK_TRANSFER",
    transactionId: "",
    paymentDate: new Date(),
  });

  /* ================= STATISTICS ================= */
  const [statistics, setStatistics] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalPaid: 0,
    totalAmount: 0,
  });

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  /* ================= FETCH SALARIES ================= */
  useEffect(() => {
    fetchSalaries();
  }, [page, rowsPerPage, employeeFilter, statusFilter, monthFilter, yearFilter]);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      
      if (employeeFilter) params.employeeId = employeeFilter;
      if (statusFilter) params.status = statusFilter;
      if (monthFilter) params.month = monthFilter;
      if (yearFilter) params.year = yearFilter;

      const response = await axios.get(`${BASE_URL}/api/salaries`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data.success) {
        setSalaries(response.data.data || []);
        setTotalRecords(response.data.total || 0);
        
        // Calculate statistics
        const data = response.data.data || [];
        setStatistics({
          totalPending: data.filter(s => s.paymentStatus === 'PENDING').length,
          totalApproved: data.filter(s => s.paymentStatus === 'APPROVED').length,
          totalPaid: data.filter(s => s.paymentStatus === 'PAID').length,
          totalAmount: data.reduce((sum, s) => sum + (s.netPay || 0), 0),
        });
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
      showNotification("Failed to load salaries", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  /* ================= APPROVE SALARY ================= */
  const handleApprove = async (salary) => {
    try {
      setApproveLoading(true);
      setActionInProgress(salary._id);
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `${BASE_URL}/api/salaries/${salary._id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        showNotification("Salary approved successfully", "success");
        fetchSalaries();
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to approve salary",
        "error"
      );
    } finally {
      setApproveLoading(false);
      setActionInProgress(null);
      handleMenuClose();
    }
  };

  /* ================= BULK APPROVE ================= */
  const handleBulkApprove = async () => {
    try {
      setBulkActionLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `${BASE_URL}/api/salaries/bulk-approve`,
        { salaryIds: selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        showNotification(`${selected.length} salaries approved successfully`, "success");
        setSelected([]);
        setOpenBulkApprove(false);
        fetchSalaries();
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to approve salaries",
        "error"
      );
    } finally {
      setBulkActionLoading(false);
    }
  };

  /* ================= MARK AS PAID ================= */
  const handleMarkPaid = async () => {
    if (!paymentDetails.paymentDate) {
      showNotification("Payment date is required", "error");
      return;
    }

    if (paymentDetails.paymentMode !== 'CASH' && !paymentDetails.transactionId) {
      showNotification("Transaction ID is required for this payment mode", "error");
      return;
    }

    try {
      setMarkPaidLoading(true);
      setActionInProgress(selectedSalary._id);
      const token = localStorage.getItem("token");
      
      const payload = {
        paymentMode: paymentDetails.paymentMode,
        transactionId: paymentDetails.transactionId || undefined,
        paymentDate: paymentDetails.paymentDate.toISOString().split('T')[0],
      };

      const response = await axios.put(
        `${BASE_URL}/api/salaries/${selectedSalary._id}/mark-paid`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        showNotification("Salary marked as paid successfully", "success");
        fetchSalaries();
        setOpenMarkPaid(false);
        setPaymentDetails({
          paymentMode: "BANK_TRANSFER",
          transactionId: "",
          paymentDate: new Date(),
        });
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to mark salary as paid",
        "error"
      );
    } finally {
      setMarkPaidLoading(false);
      setActionInProgress(null);
      handleMenuClose();
    }
  };

  /* ================= CHECKBOX ================= */
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(salaries.map((s) => s._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selected.includes(id);

  /* ================= ACTION MENU ================= */
  const handleMenuOpen = (event, salary) => {
    setAnchorEl(event.currentTarget);
    setSelectedSalary(salary);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /* ================= FILTER MENU ================= */
  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const clearFilters = () => {
    setEmployeeFilter("");
    setStatusFilter("");
    setMonthFilter("");
    setYearFilter("");
    setPage(0);
    handleFilterClose();
  };

  /* ================= CRUD HANDLERS ================= */
  const handleAdd = () => {
    fetchSalaries();
    showNotification("Salary added successfully", "success");
  };

  const handleUpdate = () => {
    fetchSalaries();
    showNotification("Salary updated successfully", "success");
  };

  const handleDelete = () => {
    fetchSalaries();
    showNotification("Salary deleted successfully", "success");
    setSelected([]);
  };

  /* ================= FORMATTING FUNCTIONS ================= */
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹ 0";
    return `₹ ${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "PAID":
        return { bg: "#dcfce7", color: "#166534", border: "#86efac" };
      case "APPROVED":
        return { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" };
      case "PROCESSED":
        return { bg: "#e0f2fe", color: "#0c4a6e", border: "#bae6fd" };
      case "PENDING":
        return { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" };
      case "CANCELLED":
        return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
      default:
        return { bg: "#f1f5f9", color: "#334155", border: "#e2e8f0" };
    }
  };

  const getEmploymentTypeColor = (type) => {
    switch(type) {
      case "Monthly":
        return { bg: "#e0f2fe", color: "#0369a1" };
      case "Hourly":
        return { bg: "#dbeafe", color: "#1e40af" };
      case "PieceRate":
        return { bg: "#ede9fe", color: "#5b21b6" };
      default:
        return { bg: "#f1f5f9", color: "#334155" };
    }
  };

  const getMonthName = (period) => {
    if (!period) return '-';
    const month = period.month || period;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || month;
  };

  const getYear = (period) => {
    if (!period) return '';
    return period.year || '';
  };

  /* ================= FILTERED SALARIES ================= */
  const filteredSalaries = salaries.filter((s) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      s.employeeName?.toLowerCase().includes(searchLower) ||
      s.employee?.EmployeeID?.toLowerCase().includes(searchLower) ||
      s.employmentType?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Box sx={{ p: 3 }}>

      {/* ===== HEADER ===== */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              background: HEADER_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: 'inline-block'
            }}
          >
            Salary Master
          </Typography>
          <Typography variant="body2" color="#64748B">
            Manage employee payroll and salary records
          </Typography>
        </Box>
        
        {/* Statistics Cards */}
        <Stack direction="row" spacing={2}>
          <Paper sx={{ p: 1.5, px: 2, bgcolor: '#fef3c7', borderRadius: 2 }}>
            <Typography variant="caption" color="#92400e">Pending</Typography>
            <Typography variant="h6" color="#92400e" fontWeight={600}>{statistics.totalPending}</Typography>
          </Paper>
          <Paper sx={{ p: 1.5, px: 2, bgcolor: '#dbeafe', borderRadius: 2 }}>
            <Typography variant="caption" color="#1e40af">Approved</Typography>
            <Typography variant="h6" color="#1e40af" fontWeight={600}>{statistics.totalApproved}</Typography>
          </Paper>
          <Paper sx={{ p: 1.5, px: 2, bgcolor: '#dcfce7', borderRadius: 2 }}>
            <Typography variant="caption" color="#166534">Paid</Typography>
            <Typography variant="h6" color="#166534" fontWeight={600}>{statistics.totalPaid}</Typography>
          </Paper>
          <Paper sx={{ p: 1.5, px: 2, bgcolor: '#164e63', borderRadius: 2 }}>
            <Typography variant="caption" color="#fff">Total Amount</Typography>
            <Typography variant="h6" color="#fff" fontWeight={600}>{formatCurrency(statistics.totalAmount)}</Typography>
          </Paper>
        </Stack>
      </Box>

      {/* ===== ACTION BAR ===== */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: "1px solid #e2e8f0",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search employee, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748B" }} />
                  </InputAdornment>
                ),
                sx: { bgcolor: '#f8fafc', borderRadius: 1.5 }
              }}
            />

            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterOpen}
              sx={{
                height: 40,
                borderRadius: 1.5,
                borderColor: '#cbd5e1',
                color: '#475569',
                '&:hover': {
                  borderColor: PRIMARY_BLUE,
                  bgcolor: alpha(PRIMARY_BLUE, 0.04)
                }
              }}
            >
              Filter
              {(employeeFilter || statusFilter || monthFilter || yearFilter) && (
                <Badge
                  color="primary"
                  variant="dot"
                  sx={{ ml: 1 }}
                />
              )}
            </Button>

            {/* <IconButton onClick={fetchSalaries} size="small" sx={{ color: '#64748B' }}>
              <RefreshIcon />
            </IconButton> */}
          </Stack>

          <Stack direction="row" spacing={2}>
            {selected.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<ApproveIcon />}
                  onClick={() => setOpenBulkApprove(true)}
                  sx={{
                    height: 40,
                    borderRadius: 1.5,
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': {
                      borderColor: '#059669',
                      bgcolor: alpha('#10b981', 0.04)
                    }
                  }}
                >
                  Approve ({selected.length})
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setOpenBulkDelete(true)}
                  sx={{
                    height: 40,
                    borderRadius: 1.5,
                  }}
                >
                  Delete ({selected.length})
                </Button>
              </>
            )}

            {/* <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{
                height: 40,
                borderRadius: 1.5,
                borderColor: '#cbd5e1',
                color: '#475569',
              }}
            >
              Export
            </Button> */}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdd(true)}
              sx={{
                height: 40,
                borderRadius: 1.5,
                background: HEADER_GRADIENT,
                "&:hover": { opacity: 0.9 },
              }}
            >
              Add Salary
            </Button>
          </Stack>
        </Stack>

        {/* Active Filters Display */}
        <Collapse in={!!(employeeFilter || statusFilter || monthFilter || yearFilter)}>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {employeeFilter && (
              <Chip
                label={`Employee: ${employees.find(e => e._id === employeeFilter)?.FirstName || ''}`}
                onDelete={() => setEmployeeFilter('')}
                size="small"
                sx={{ borderRadius: 1.5 }}
              />
            )}
            {statusFilter && (
              <Chip
                label={`Status: ${statusFilter}`}
                onDelete={() => setStatusFilter('')}
                size="small"
                sx={{ borderRadius: 1.5 }}
              />
            )}
            {monthFilter && (
              <Chip
                label={`Month: ${getMonthName(monthFilter)}`}
                onDelete={() => setMonthFilter('')}
                size="small"
                sx={{ borderRadius: 1.5 }}
              />
            )}
            {yearFilter && (
              <Chip
                label={`Year: ${yearFilter}`}
                onDelete={() => setYearFilter('')}
                size="small"
                sx={{ borderRadius: 1.5 }}
              />
            )}
          </Stack>
        </Collapse>
      </Paper>

      {/* ===== FILTER MENU ===== */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { 
            p: 2, 
            width: 320,
            borderRadius: 2,
            border: '1px solid #e2e8f0'
          }
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          Filter Options
        </Typography>
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <Select
            displayEmpty
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
          >
            <MenuItem value="">All Employees</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp._id} value={emp._id}>
                {emp.FirstName} {emp.LastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <Select
            displayEmpty
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PROCESSED">Processed</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              size="small"
              label="Month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>{getMonthName(m)}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              size="small"
              label="Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={clearFilters}>
            Clear
          </Button>
          <Button size="small" variant="contained" onClick={handleFilterClose}>
            Apply
          </Button>
        </Stack>
      </Menu>

      {/* ===== TABLE ===== */}
      <Paper
        sx={{
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>

            <TableHead>
              <TableRow
                sx={{
                  background: HEADER_GRADIENT,
                  "& .MuiTableCell-root": {
                    color: "#fff",
                    fontWeight: 600,
                    borderBottom: "none",
                  },
                }}
              >
                <TableCell padding="checkbox" sx={{ width: 50 }}>
                  <Checkbox
                    sx={{
                      color: "#fff",
                      "&.Mui-checked": { color: "#fff" },
                      "&.MuiCheckbox-indeterminate": { color: "#fff" }
                    }}
                    checked={
                      salaries.length > 0 &&
                      selected.length === salaries.length
                    }
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < salaries.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ width: 200 }}>Employee</TableCell>
                <TableCell sx={{ width: 120 }}>Period</TableCell>
                <TableCell sx={{ width: 100 }}>Type</TableCell>
                <TableCell sx={{ width: 120 }} align="right">Gross</TableCell>
                <TableCell sx={{ width: 120 }} align="right">Net Pay</TableCell>
                <TableCell sx={{ width: 100 }}>Status</TableCell>
                <TableCell sx={{ width: 80 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={40} sx={{ color: PRIMARY_BLUE }} />
                    <Typography variant="body2" color="#64748B" sx={{ mt: 2 }}>
                      Loading salaries...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredSalaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <ReceiptIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="body1" color="#64748B" fontWeight={500}>
                      {search || employeeFilter || statusFilter || monthFilter || yearFilter
                        ? 'No salaries match your filters'
                        : 'No salaries found'}
                    </Typography>
                    <Typography variant="body2" color="#94a3b8" sx={{ mt: 1 }}>
                      {search || employeeFilter || statusFilter || monthFilter || yearFilter
                        ? 'Try adjusting your search or filters'
                        : 'Add your first salary record to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSalaries.map((salary, index) => {
                  const statusColors = getStatusColor(salary.paymentStatus);
                  const typeColors = getEmploymentTypeColor(salary.employmentType);
                  const isSelected = selected.includes(salary._id);
                  const isEven = index % 2 === 0;

                  return (
                    <TableRow
                      key={salary._id}
                      hover
                      selected={isSelected}
                      sx={{
                        bgcolor: isEven ? STRIPE_ODD : STRIPE_EVEN,
                        "&:hover": { bgcolor: HOVER_COLOR },
                        "&.Mui-selected": {
                          bgcolor: alpha(PRIMARY_BLUE, 0.08),
                          "&:hover": { bgcolor: alpha(PRIMARY_BLUE, 0.12) }
                        }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectOne(salary._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            "&.Mui-checked": { color: PRIMARY_BLUE },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: salary.employee?.Gender === 'M' ? '#164e63' : '#be185d',
                              fontSize: '0.875rem'
                            }}
                          >
                            {salary.employee?.FirstName?.charAt(0) || 'U'}
                            {salary.employee?.LastName?.charAt(0) || ''}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {salary.employeeName}
                            </Typography>
                            <Typography variant="caption" color="#64748B">
                              {salary.employee?.EmployeeID || 'N/A'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {getMonthName(salary.payrollPeriod)} {getYear(salary.payrollPeriod)}
                        </Typography>
                        <Typography variant="caption" color="#64748B">
                          {salary.paidDays}/{salary.workingDays} days
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={salary.employmentType}
                          size="small"
                          sx={{
                            backgroundColor: typeColors.bg,
                            color: typeColors.color,
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>
                        {formatCurrency(salary.grossSalary)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salary.netPay)}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`Status: ${salary.paymentStatus}`}>
                          <Chip
                            label={salary.paymentStatus}
                            size="small"
                            sx={{
                              backgroundColor: statusColors.bg,
                              color: statusColors.color,
                              border: `1px solid ${statusColors.border}`,
                              fontWeight: 500,
                              minWidth: 70
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Actions">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, salary)}
                            size="small"
                            sx={{
                              color: '#64748b',
                              '&:hover': {
                                bgcolor: alpha(PRIMARY_BLUE, 0.1),
                                color: PRIMARY_BLUE
                              }
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalRecords}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: '#64748B'
            }
          }}
        />
      </Paper>

      {/* ===== ACTION MENU ===== */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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
            setOpenView(true);
            handleMenuClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" sx={{ color: PRIMARY_BLUE }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>View Details</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenEdit(true);
            handleMenuClose();
          }}
          disabled={selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID'}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ 
              color: (selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID') 
                ? '#94a3b8' : '#10B981' 
            }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color={
              (selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID') 
                ? '#94a3b8' : 'inherit'
            }>
              Edit
            </Typography>
          </ListItemText>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {/* Approve Option - Only show if not already approved and not paid */}
        {selectedSalary?.paymentStatus !== 'APPROVED' && 
         selectedSalary?.paymentStatus !== 'PAID' && (
          <MenuItem
            onClick={() => handleApprove(selectedSalary)}
            disabled={approveLoading && actionInProgress === selectedSalary?._id}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              {approveLoading && actionInProgress === selectedSalary?._id ? (
                <CircularProgress size={20} />
              ) : (
                <ApproveIcon fontSize="small" sx={{ color: '#10b981' }} />
              )}
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500}>Approve</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Mark as Paid Option - Only show if approved and not already paid */}
        {selectedSalary?.paymentStatus === 'APPROVED' && (
          <MenuItem
            onClick={() => {
              setOpenMarkPaid(true);
              handleMenuClose();
            }}
            disabled={markPaidLoading && actionInProgress === selectedSalary?._id}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              {markPaidLoading && actionInProgress === selectedSalary?._id ? (
                <CircularProgress size={20} />
              ) : (
                <PaymentIcon fontSize="small" sx={{ color: '#059669' }} />
              )}
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500}>Mark as Paid</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Show Paid badge if already paid */}
        {selectedSalary?.paymentStatus === 'PAID' && (
          <MenuItem disabled sx={{ py: 1 }}>
            <ListItemIcon>
              <PaymentIcon fontSize="small" sx={{ color: '#166534' }} />
            </ListItemIcon>
            <ListItemText>
              <Chip 
                label="Paid" 
                size="small" 
                sx={{ 
                  bgcolor: '#dcfce7', 
                  color: '#166534',
                  fontWeight: 500,
                  height: 24
                }}
              />
            </ListItemText>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            setOpenDelete(true);
            handleMenuClose();
          }}
          disabled={selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID'}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ 
              color: (selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID') 
                ? '#94a3b8' : '#ef4444' 
            }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color={
              (selectedSalary?.paymentStatus === 'APPROVED' || selectedSalary?.paymentStatus === 'PAID') 
                ? '#94a3b8' : '#ef4444'
            }>
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* ===== MARK AS PAID DIALOG ===== */}
      <Dialog 
        open={openMarkPaid} 
        onClose={() => setOpenMarkPaid(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #164e63, #0ea5e9)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <PaymentIcon />
            <span>Mark Salary as Paid</span>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 500 }}>Payment Mode</FormLabel>
              <RadioGroup
                row
                value={paymentDetails.paymentMode}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMode: e.target.value })}
              >
                <FormControlLabel value="BANK_TRANSFER" control={<Radio />} label="Bank Transfer" />
                <FormControlLabel value="CHEQUE" control={<Radio />} label="Cheque" />
                <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Transaction ID / Reference"
              value={paymentDetails.transactionId}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
              placeholder="Enter transaction reference"
              size="small"
              required={paymentDetails.paymentMode !== 'CASH'}
              helperText={paymentDetails.paymentMode !== 'CASH' ? "Required for bank/cheque payments" : "Optional for cash payments"}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Payment Date"
                value={paymentDetails.paymentDate}
                onChange={(newValue) => setPaymentDetails({ ...paymentDetails, paymentDate: newValue })}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    size="small" 
                    required 
                    helperText="Date when payment was made"
                  />
                )}
              />
            </LocalizationProvider>

            {selectedSalary && (
              <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Salary Summary</Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Employee:</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedSalary.employeeName}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Period:</Typography>
                    <Typography variant="body2">{getMonthName(selectedSalary.payrollPeriod)} {getYear(selectedSalary.payrollPeriod)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Net Pay:</Typography>
                    <Typography variant="body2" fontWeight={600} color="#166534">{formatCurrency(selectedSalary.netPay)}</Typography>
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => {
              setOpenMarkPaid(false);
              setPaymentDetails({
                paymentMode: "BANK_TRANSFER",
                transactionId: "",
                paymentDate: new Date(),
              });
            }}
            sx={{ color: '#64748B' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleMarkPaid}
            disabled={markPaidLoading || !paymentDetails.paymentDate || 
              (paymentDetails.paymentMode !== 'CASH' && !paymentDetails.transactionId)}
            startIcon={markPaidLoading ? <CircularProgress size={20} /> : <PaymentIcon />}
            sx={{
              background: "linear-gradient(135deg, #164e63, #0ea5e9)",
              "&:hover": { opacity: 0.9 },
              minWidth: 140
            }}
          >
            {markPaidLoading ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== BULK APPROVE DIALOG ===== */}
      <Dialog
        open={openBulkApprove}
        onClose={() => setOpenBulkApprove(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: '#164e63', fontWeight: 600 }}>
          Approve Multiple Salaries
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You are about to approve {selected.length} salary records.
          </Alert>
          <Typography variant="body2" color="#64748B">
            Approved salaries cannot be edited. Only pending salaries will be approved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkApprove(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBulkApprove}
            disabled={bulkActionLoading}
            startIcon={bulkActionLoading ? <CircularProgress size={20} /> : <ApproveIcon />}
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
          >
            {bulkActionLoading ? "Approving..." : "Approve Selected"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== BULK DELETE DIALOG ===== */}
      <Dialog
        open={openBulkDelete}
        onClose={() => setOpenBulkDelete(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
          Delete Multiple Salaries
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You are about to delete {selected.length} salary records.
          </Alert>
          <Typography variant="body2" color="#64748B">
            This action cannot be undone. Only pending salaries can be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDelete(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={bulkActionLoading}
            startIcon={bulkActionLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {bulkActionLoading ? "Deleting..." : "Delete Selected"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== MODALS ===== */}
      <AddSalary open={openAdd} onClose={() => setOpenAdd(false)} onAdd={handleAdd} />

      {selectedSalary && (
        <>
          <ViewSalary 
            open={openView} 
            onClose={() => {
              setOpenView(false);
              setSelectedSalary(null);
            }} 
            salary={selectedSalary} 
            onEdit={(salary) => {
              setOpenView(false);
              setSelectedSalary(salary);
              setOpenEdit(true);
            }}
          />
          <EditSalary 
            open={openEdit} 
            onClose={() => {
              setOpenEdit(false);
              setSelectedSalary(null);
            }} 
            salary={selectedSalary} 
            onUpdate={handleUpdate} 
          />
          <DeleteSalary 
            open={openDelete} 
            onClose={() => {
              setOpenDelete(false);
              setSelectedSalary(null);
            }} 
            salary={selectedSalary} 
            onDelete={handleDelete} 
          />
        </>
      )}

      {/* ===== SNACKBAR ===== */}
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

export default SalaryMaster;