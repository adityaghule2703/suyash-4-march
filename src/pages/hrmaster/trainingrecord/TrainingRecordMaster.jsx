// // // // import React, { useState, useEffect } from "react";
// // // // import {
// // // //   Box,
// // // //   Paper,
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableContainer,
// // // //   TableHead,
// // // //   TableRow,
// // // //   IconButton,
// // // //   Button,
// // // //   TextField,
// // // //   InputAdornment,
// // // //   Tooltip,
// // // //   Typography,
// // // //   Snackbar,
// // // //   TablePagination,
// // // //   Checkbox,
// // // //   Stack,
// // // //   alpha,
// // // //   Alert,
// // // //   Menu,
// // // //   MenuItem,
// // // //   ListItemIcon,
// // // //   ListItemText,
// // // //   Divider
// // // // } from "@mui/material";

// // // // import {
// // // //   Search as SearchIcon,
// // // //   Add as AddIcon,
// // // //   Delete as DeleteIcon,
// // // //   Visibility as ViewIcon,
// // // //   Edit as EditIcon,
// // // //   MoreVert as MoreVertIcon
// // // // } from "@mui/icons-material";

// // // // import axios from "axios";
// // // // import BASE_URL from "../../../config/Config";

// // // // import AddTraining from "./AddTraining";
// // // // import EditTraining from "./EditTraining";
// // // // import ViewTraining from "./ViewTraining";
// // // // import DeleteTraining from "./DeleteTraining";

// // // // const HEADER_GRADIENT =
// // // //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // // // const PRIMARY_BLUE = "#00B4D8";

// // // // const ActionMenu = ({
// // // //   training,
// // // //   onView,
// // // //   onEdit,
// // // //   onDelete,
// // // //   anchorEl,
// // // //   onClose,
// // // //   onOpen
// // // // }) => {

// // // //   return (
// // // //     <>
// // // //       <IconButton onClick={onOpen}>
// // // //         <MoreVertIcon fontSize="small" />
// // // //       </IconButton>

// // // //       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>

// // // //         <MenuItem
// // // //           onClick={() => {
// // // //             onView(training);
// // // //             onClose();
// // // //           }}
// // // //         >
// // // //           <ListItemIcon>
// // // //             <ViewIcon fontSize="small" />
// // // //           </ListItemIcon>
// // // //           <ListItemText>View</ListItemText>
// // // //         </MenuItem>

// // // //         <MenuItem
// // // //           onClick={() => {
// // // //             onEdit(training);
// // // //             onClose();
// // // //           }}
// // // //         >
// // // //           <ListItemIcon>
// // // //             <EditIcon fontSize="small" />
// // // //           </ListItemIcon>
// // // //           <ListItemText>Edit</ListItemText>
// // // //         </MenuItem>

// // // //         <Divider />

// // // //         <MenuItem
// // // //           onClick={() => {
// // // //             onDelete(training);
// // // //             onClose();
// // // //           }}
// // // //         >
// // // //           <ListItemIcon sx={{ color: "#EF4444" }}>
// // // //             <DeleteIcon fontSize="small" />
// // // //           </ListItemIcon>

// // // //           <ListItemText sx={{ color: "#EF4444" }}>
// // // //             Delete
// // // //           </ListItemText>

// // // //         </MenuItem>

// // // //       </Menu>
// // // //     </>
// // // //   );
// // // // };

// // // // const TrainingRecordMaster = () => {

// // // //   const [trainings, setTrainings] = useState([]);
// // // //   const [filteredTrainings, setFilteredTrainings] = useState([]);

// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [loading, setLoading] = useState(true);

// // // //   const [page, setPage] = useState(0);
// // // //   const [rowsPerPage, setRowsPerPage] = useState(10);

// // // //   const [selectedTraining, setSelectedTraining] = useState(null);

// // // //   const [openAddModal, setOpenAddModal] = useState(false);
// // // //   const [openEditModal, setOpenEditModal] = useState(false);
// // // //   const [openViewModal, setOpenViewModal] = useState(false);
// // // //   const [openDeleteModal, setOpenDeleteModal] = useState(false);

// // // //   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

// // // //   const [snackbar, setSnackbar] = useState({
// // // //     open: false,
// // // //     message: "",
// // // //     severity: "success"
// // // //   });

// // // //   useEffect(() => {
// // // //     fetchTrainings();
// // // //   }, []);

// // // //   const fetchTrainings = async () => {

// // // //     try {

// // // //       const token = localStorage.getItem("token");

// // // //       const response = await axios.get(
// // // //   `${BASE_URL}/api/trainings/all`,
// // // //   {
// // // //     headers: {
// // // //       Authorization: `Bearer ${token}`
// // // //     }
// // // //   }
// // // // );

// // // // if (response.data.success) {
// // // //   setTrainings(response.data.data || []);
// // // //   setFilteredTrainings(response.data.data || []);
// // // // }

// // // //     } catch (err) {

// // // //       showNotification("Failed to load trainings", "error");

// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleSearch = (e) => {

// // // //     const value = e.target.value.toLowerCase();

// // // //     setSearchTerm(value);

// // // //     const filtered = trainings.filter(
// // // //       (training) =>
// // // //         training.trainingName?.toLowerCase().includes(value) ||
// // // //         training.provider?.toLowerCase().includes(value)
// // // //     );

// // // //     setFilteredTrainings(filtered);
// // // //   };

// // // //   const showNotification = (message, severity) => {

// // // //     setSnackbar({
// // // //       open: true,
// // // //       message,
// // // //       severity
// // // //     });

// // // //   };

// // // //   const handleAddTraining = (training) => {

// // // //     setTrainings([...trainings, training]);
// // // //     setFilteredTrainings([...filteredTrainings, training]);

// // // //     showNotification("Training added successfully", "success");

// // // //   };

// // // //   const handleUpdateTraining = (updatedTraining) => {

// // // //     const updated = trainings.map((t) =>
// // // //       t._id === updatedTraining._id ? updatedTraining : t
// // // //     );

// // // //     setTrainings(updated);
// // // //     setFilteredTrainings(updated);

// // // //     showNotification("Training updated successfully", "success");

// // // //   };

// // // //   const handleDeleteTraining = (id) => {

// // // //     const updated = trainings.filter((t) => t._id !== id);

// // // //     setTrainings(updated);
// // // //     setFilteredTrainings(updated);

// // // //     showNotification("Training deleted successfully", "success");

// // // //   };

// // // //   const paginatedTrainings = (filteredTrainings || []).slice(
// // // //     page * rowsPerPage,
// // // //     page * rowsPerPage + rowsPerPage
// // // //   );

// // // //   return (

// // // //     <Box sx={{ p: 3 }}>

// // // //       {/* Header */}

// // // //       <Typography
// // // //         variant="h5"
// // // //         fontWeight={600}
// // // //         sx={{
// // // //           background: HEADER_GRADIENT,
// // // //           WebkitBackgroundClip: "text",
// // // //           WebkitTextFillColor: "transparent"
// // // //         }}
// // // //       >
// // // //         Training Records
// // // //       </Typography>

// // // //       <Paper sx={{ p: 2, mt: 2 }}>

// // // //         <Stack direction="row" justifyContent="space-between">

// // // //           <TextField
// // // //             placeholder="Search training..."
// // // //             size="small"
// // // //             value={searchTerm}
// // // //             onChange={handleSearch}
// // // //             InputProps={{
// // // //               startAdornment: (
// // // //                 <InputAdornment position="start">
// // // //                   <SearchIcon />
// // // //                 </InputAdornment>
// // // //               )
// // // //             }}
// // // //           />

// // // //           <Button
// // // //             startIcon={<AddIcon />}
// // // //             variant="contained"
// // // //             sx={{ background: HEADER_GRADIENT }}
// // // //             onClick={() => setOpenAddModal(true)}
// // // //           >
// // // //             Add Training
// // // //           </Button>

// // // //         </Stack>

// // // //       </Paper>

// // // //       {/* Table */}

// // // //       <Paper sx={{ mt: 2 }}>

// // // //         <TableContainer>

// // // //           <Table>

// // // //             <TableHead>

// // // //               <TableRow sx={{ background: HEADER_GRADIENT }}>

// // // //                 <TableCell sx={{ color: "#fff" }}>
// // // //                   Training Name
// // // //                 </TableCell>

// // // //                 <TableCell sx={{ color: "#fff" }}>
// // // //                   Provider
// // // //                 </TableCell>

// // // //                 <TableCell sx={{ color: "#fff" }}>
// // // //                   Start Date
// // // //                 </TableCell>

// // // //                 <TableCell sx={{ color: "#fff" }}>
// // // //                   End Date
// // // //                 </TableCell>

// // // //                 <TableCell sx={{ color: "#fff" }}>
// // // //                   Status
// // // //                 </TableCell>

// // // //                 <TableCell sx={{ color: "#fff" }}>
// // // //                   Actions
// // // //                 </TableCell>

// // // //               </TableRow>

// // // //             </TableHead>

// // // //             <TableBody>

// // // //               {loading ? (

// // // //                 <TableRow>
// // // //                   <TableCell colSpan={6} align="center">
// // // //                     Loading trainings...
// // // //                   </TableCell>
// // // //                 </TableRow>

// // // //               ) : (

// // // //                 paginatedTrainings.map((training) => (

// // // //                   <TableRow key={training._id} hover>

// // // //                     <TableCell>
// // // //                       {training.trainingName}
// // // //                     </TableCell>

// // // //                     <TableCell>
// // // //                       {training.provider}
// // // //                     </TableCell>

// // // //                     <TableCell>
// // // //                       {new Date(training.startDate).toLocaleDateString()}
// // // //                     </TableCell>

// // // //                     <TableCell>
// // // //                       {new Date(training.endDate).toLocaleDateString()}
// // // //                     </TableCell>

// // // //                     <TableCell>
// // // //                       {training.status}
// // // //                     </TableCell>

// // // //                     <TableCell>

// // // //                       <ActionMenu
// // // //                         training={training}
// // // //                         onView={(t) => {
// // // //                           setSelectedTraining(t);
// // // //                           setOpenViewModal(true);
// // // //                         }}
// // // //                         onEdit={(t) => {
// // // //                           setSelectedTraining(t);
// // // //                           setOpenEditModal(true);
// // // //                         }}
// // // //                         onDelete={(t) => {
// // // //                           setSelectedTraining(t);
// // // //                           setOpenDeleteModal(true);
// // // //                         }}
// // // //                         anchorEl={actionMenuAnchor}
// // // //                         onOpen={(e) => setActionMenuAnchor(e.currentTarget)}
// // // //                         onClose={() => setActionMenuAnchor(null)}
// // // //                       />

// // // //                     </TableCell>

// // // //                   </TableRow>

// // // //                 ))

// // // //               )}

// // // //             </TableBody>

// // // //           </Table>

// // // //         </TableContainer>

// // // //         <TablePagination
// // // //           rowsPerPageOptions={[5,10,25]}
// // // //           component="div"
// // // //           count={filteredTrainings.length}
// // // //           rowsPerPage={rowsPerPage}
// // // //           page={page}
// // // //           onPageChange={(e,newPage)=>setPage(newPage)}
// // // //           onRowsPerPageChange={(e)=>{
// // // //             setRowsPerPage(parseInt(e.target.value,10));
// // // //             setPage(0);
// // // //           }}
// // // //         />

// // // //       </Paper>

// // // //       {/* Modals */}

// // // //       <AddTraining
// // // //         open={openAddModal}
// // // //         onClose={()=>setOpenAddModal(false)}
// // // //         onAdd={handleAddTraining}
// // // //       />

// // // //       {selectedTraining && (
// // // //         <>
// // // //           <EditTraining
// // // //             open={openEditModal}
// // // //             training={selectedTraining}
// // // //             onClose={()=>setOpenEditModal(false)}
// // // //             onUpdate={handleUpdateTraining}
// // // //           />

// // // //           <ViewTraining
// // // //             open={openViewModal}
// // // //             training={selectedTraining}
// // // //             onClose={()=>setOpenViewModal(false)}
// // // //           />

// // // //           <DeleteTraining
// // // //             open={openDeleteModal}
// // // //             training={selectedTraining}
// // // //             onClose={()=>setOpenDeleteModal(false)}
// // // //             onDelete={handleDeleteTraining}
// // // //           />
// // // //         </>
// // // //       )}

// // // //       {/* Snackbar Notification */}
// // // //             <Snackbar
// // // //               open={snackbar.open}
// // // //               autoHideDuration={3000}
// // // //               onClose={() => setSnackbar({ ...snackbar, open: false })}
// // // //               anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// // // //             >
// // // //               <Alert
// // // //                 onClose={() => setSnackbar({ ...snackbar, open: false })}
// // // //                 severity={snackbar.severity}
// // // //                 variant="filled"
// // // //                 sx={{
// // // //                   width: "100%",
// // // //                   borderRadius: 1.5,
// // // //                   boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
// // // //                 }}
// // // //               >
// // // //                 {snackbar.message}
// // // //               </Alert>
// // // //             </Snackbar>

// // // //     </Box>
// // // //   );
// // // // };

// // // // export default TrainingRecordMaster;

// // // // import React, { useState, useEffect } from "react";
// // // // import {
// // // //   Box,
// // // //   Paper,
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableContainer,
// // // //   TableHead,
// // // //   TableRow,
// // // //   IconButton,
// // // //   Button,
// // // //   TextField,
// // // //   InputAdornment,
// // // //   Typography,
// // // //   Snackbar,
// // // //   TablePagination,
// // // //   Stack,
// // // //   Chip,
// // // //   Alert,
// // // //   Menu,
// // // //   MenuItem,
// // // //   ListItemIcon,
// // // //   ListItemText,
// // // //   Divider,
// // // // } from "@mui/material";

// // // // import {
// // // //   Search as SearchIcon,
// // // //   Add as AddIcon,
// // // //   Delete as DeleteIcon,
// // // //   Visibility as ViewIcon,
// // // //   Edit as EditIcon,
// // // //   MoreVert as MoreVertIcon,
// // // // } from "@mui/icons-material";

// // // // import axios from "axios";
// // // // import BASE_URL from "../../../config/Config";

// // // // import AddTraining from "./AddTraining";
// // // // import EditTraining from "./EditTraining";
// // // // import ViewTraining from "./ViewTraining";
// // // // import DeleteTraining from "./DeleteTraining";
// // // // import AssignTraining from "./AssignTraining";

// // // // const HEADER_GRADIENT =
// // // //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // // // const TrainingRecordMaster = () => {
// // // //   const [trainings, setTrainings] = useState([]);
// // // //   const [filteredTrainings, setFilteredTrainings] = useState([]);

// // // //   const [employees, setEmployees] = useState([]);

// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [loading, setLoading] = useState(true);

// // // //   const [page, setPage] = useState(0);
// // // //   const [rowsPerPage, setRowsPerPage] = useState(10);

// // // //   const [selectedTraining, setSelectedTraining] = useState(null);

// // // //   const [openAddModal, setOpenAddModal] = useState(false);
// // // //   const [openEditModal, setOpenEditModal] = useState(false);
// // // //   const [openViewModal, setOpenViewModal] = useState(false);
// // // //   const [openDeleteModal, setOpenDeleteModal] = useState(false);
// // // //   const [openAssignModal, setOpenAssignModal] = useState(false);

// // // //   const [menuAnchor, setMenuAnchor] = useState(null);
// // // //   const [menuTraining, setMenuTraining] = useState(null);

// // // //   const [snackbar, setSnackbar] = useState({
// // // //     open: false,
// // // //     message: "",
// // // //     severity: "success",
// // // //   });

// // // //   useEffect(() => {
// // // //     fetchTrainings();
// // // //     fetchEmployees();
// // // //   }, []);

// // // //   const fetchTrainings = async () => {
// // // //     try {
// // // //       const token = localStorage.getItem("token");

// // // //       const response = await axios.get(`${BASE_URL}/api/trainings/all`, {
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });

// // // //       if (response.data.success) {
// // // //         setTrainings(response.data.data || []);
// // // //         setFilteredTrainings(response.data.data || []);
// // // //       }
// // // //     } catch (err) {
// // // //       showNotification("Failed to load trainings", "error");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const fetchEmployees = async () => {
// // // //     try {
// // // //       const token = localStorage.getItem("token");

// // // //       const res = await axios.get(`${BASE_URL}/api/employees`, {
// // // //         headers: {
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //       });

// // // //       console.log("Employees API:", res.data);

// // // //       let employeesList = [];

// // // //       // Case 1: normal structure
// // // //       if (Array.isArray(res.data.data)) {
// // // //         employeesList = res.data.data;
// // // //       }

// // // //       // Case 2: paginated structure
// // // //       if (res.data.data && Array.isArray(res.data.data.data)) {
// // // //         employeesList = res.data.data.data;
// // // //       }

// // // //       setEmployees(employeesList);
// // // //     } catch (error) {
// // // //       console.error("Employee fetch error:", error);
// // // //     }
// // // //   };

// // // //   const handleSearch = (e) => {
// // // //     const value = e.target.value.toLowerCase();
// // // //     setSearchTerm(value);

// // // //     const filtered = trainings.filter(
// // // //       (training) =>
// // // //         training.trainingName?.toLowerCase().includes(value) ||
// // // //         training.provider?.toLowerCase().includes(value),
// // // //     );

// // // //     setFilteredTrainings(filtered);
// // // //   };

// // // //   const showNotification = (message, severity) => {
// // // //     setSnackbar({
// // // //       open: true,
// // // //       message,
// // // //       severity,
// // // //     });
// // // //   };

// // // //   const handleAddTraining = (training) => {
// // // //     const updated = [training, ...trainings];
// // // //     setTrainings(updated);
// // // //     setFilteredTrainings(updated);

// // // //     showNotification("Training added successfully", "success");
// // // //   };

// // // //   const handleUpdateTraining = (updatedTraining) => {
// // // //     const updated = trainings.map((t) =>
// // // //       t._id === updatedTraining._id ? updatedTraining : t,
// // // //     );

// // // //     setTrainings(updated);
// // // //     setFilteredTrainings(updated);

// // // //     showNotification("Training updated successfully", "success");
// // // //   };

// // // //   const handleDeleteTraining = (id) => {
// // // //     const updated = trainings.filter((t) => t._id !== id);

// // // //     setTrainings(updated);
// // // //     setFilteredTrainings(updated);

// // // //     showNotification("Training deleted successfully", "success");
// // // //   };

// // // //   const openMenu = (event, training) => {
// // // //     setMenuAnchor(event.currentTarget);
// // // //     setMenuTraining(training);
// // // //   };

// // // //   const closeMenu = () => {
// // // //     setMenuAnchor(null);
// // // //     setMenuTraining(null);
// // // //   };

// // // //   const statusChip = (status) => {
// // // //     let color = "default";

// // // //     if (status === "Completed") color = "success";
// // // //     if (status === "Pending") color = "warning";
// // // //     if (status === "Scheduled") color = "info";

// // // //     return <Chip label={status} color={color} size="small" />;
// // // //   };

// // // //   const certificateChip = (status) => {
// // // //     let color = "default";

// // // //     if (status === "Valid") color = "success";
// // // //     if (status === "Expired") color = "error";
// // // //     if (status === "NotIssued") color = "warning";

// // // //     return <Chip label={status} color={color} size="small" />;
// // // //   };

// // // //   const paginatedTrainings = filteredTrainings.slice(
// // // //     page * rowsPerPage,
// // // //     page * rowsPerPage + rowsPerPage,
// // // //   );

// // // //   return (
// // // //     <Box sx={{ p: 3 }}>
// // // //       <Typography
// // // //         variant="h5"
// // // //         fontWeight={600}
// // // //         sx={{
// // // //           background: HEADER_GRADIENT,
// // // //           WebkitBackgroundClip: "text",
// // // //           WebkitTextFillColor: "transparent",
// // // //         }}
// // // //       >
// // // //         Training Records
// // // //       </Typography>

// // // //       {/* SEARCH + BUTTONS */}

// // // //       <Paper sx={{ p: 2, mt: 2 }}>
// // // //         <Stack direction="row" justifyContent="space-between">
// // // //           <TextField
// // // //             placeholder="Search training..."
// // // //             size="small"
// // // //             value={searchTerm}
// // // //             onChange={handleSearch}
// // // //             InputProps={{
// // // //               startAdornment: (
// // // //                 <InputAdornment position="start">
// // // //                   <SearchIcon />
// // // //                 </InputAdornment>
// // // //               ),
// // // //             }}
// // // //           />

// // // //           <Stack direction="row" spacing={2}>
// // // //             <Button
// // // //               variant="contained"
// // // //               onClick={() => setOpenAssignModal(true)}
// // // //             >
// // // //               Assign Training
// // // //             </Button>

// // // //             <Button
// // // //               startIcon={<AddIcon />}
// // // //               variant="contained"
// // // //               sx={{ background: HEADER_GRADIENT }}
// // // //               onClick={() => setOpenAddModal(true)}
// // // //             >
// // // //               Add Training
// // // //             </Button>
// // // //           </Stack>
// // // //         </Stack>
// // // //       </Paper>

// // // //       {/* TABLE */}

// // // //       <Paper sx={{ mt: 2 }}>
// // // //         <TableContainer>
// // // //           <Table>
// // // //             <TableHead>
// // // //               <TableRow sx={{ background: HEADER_GRADIENT }}>
// // // //                 <TableCell sx={{ color: "#fff" }}>Training</TableCell>
// // // //                 <TableCell sx={{ color: "#fff" }}>Provider</TableCell>
// // // //                 <TableCell sx={{ color: "#fff" }}>Start</TableCell>
// // // //                 <TableCell sx={{ color: "#fff" }}>End</TableCell>
// // // //                 <TableCell sx={{ color: "#fff" }}>Status</TableCell>
// // // //                 <TableCell sx={{ color: "#fff" }}>Certificate</TableCell>
// // // //                 <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
// // // //               </TableRow>
// // // //             </TableHead>

// // // //             <TableBody>
// // // //               {loading ? (
// // // //                 <TableRow>
// // // //                   <TableCell colSpan={7} align="center">
// // // //                     Loading trainings...
// // // //                   </TableCell>
// // // //                 </TableRow>
// // // //               ) : (
// // // //                 paginatedTrainings.map((training) => (
// // // //                   <TableRow key={training._id} hover>
// // // //                     <TableCell>{training.trainingName}</TableCell>
// // // //                     <TableCell>{training.provider}</TableCell>
// // // //                     <TableCell>{training.startDate}</TableCell>
// // // //                     <TableCell>{training.endDate}</TableCell>
// // // //                     <TableCell>{statusChip(training.status)}</TableCell>
// // // //                     <TableCell>
// // // //                       {certificateChip(training.certificateStatus)}
// // // //                     </TableCell>

// // // //                     <TableCell>
// // // //                       <IconButton onClick={(e) => openMenu(e, training)}>
// // // //                         <MoreVertIcon />
// // // //                       </IconButton>
// // // //                     </TableCell>
// // // //                   </TableRow>
// // // //                 ))
// // // //               )}
// // // //             </TableBody>
// // // //           </Table>
// // // //         </TableContainer>

// // // //         <TablePagination
// // // //           rowsPerPageOptions={[5, 10, 25]}
// // // //           component="div"
// // // //           count={filteredTrainings.length}
// // // //           rowsPerPage={rowsPerPage}
// // // //           page={page}
// // // //           onPageChange={(e, newPage) => setPage(newPage)}
// // // //           onRowsPerPageChange={(e) => {
// // // //             setRowsPerPage(parseInt(e.target.value, 10));
// // // //             setPage(0);
// // // //           }}
// // // //         />
// // // //       </Paper>

// // // //       {/* ACTION MENU */}

// // // //       <Menu
// // // //         anchorEl={menuAnchor}
// // // //         open={Boolean(menuAnchor)}
// // // //         onClose={closeMenu}
// // // //       >
// // // //         <MenuItem
// // // //           onClick={() => {
// // // //             setSelectedTraining(menuTraining);
// // // //             setOpenViewModal(true);
// // // //             closeMenu();
// // // //           }}
// // // //         >
// // // //           <ListItemIcon>
// // // //             <ViewIcon fontSize="small" />
// // // //           </ListItemIcon>
// // // //           <ListItemText>View</ListItemText>
// // // //         </MenuItem>

// // // //         <MenuItem
// // // //           onClick={() => {
// // // //             setSelectedTraining(menuTraining);
// // // //             setOpenEditModal(true);
// // // //             closeMenu();
// // // //           }}
// // // //         >
// // // //           <ListItemIcon>
// // // //             <EditIcon fontSize="small" />
// // // //           </ListItemIcon>
// // // //           <ListItemText>Edit</ListItemText>
// // // //         </MenuItem>

// // // //         <Divider />

// // // //         <MenuItem
// // // //           onClick={() => {
// // // //             setSelectedTraining(menuTraining);
// // // //             setOpenDeleteModal(true);
// // // //             closeMenu();
// // // //           }}
// // // //         >
// // // //           <ListItemIcon sx={{ color: "#EF4444" }}>
// // // //             <DeleteIcon fontSize="small" />
// // // //           </ListItemIcon>
// // // //           <ListItemText sx={{ color: "#EF4444" }}>Delete</ListItemText>
// // // //         </MenuItem>
// // // //       </Menu>

// // // //       {/* MODALS */}

// // // //       <AddTraining
// // // //         open={openAddModal}
// // // //         onClose={() => setOpenAddModal(false)}
// // // //         onAdd={handleAddTraining}
// // // //       />

// // // //       <AssignTraining
// // // //         open={openAssignModal}
// // // //         onClose={() => setOpenAssignModal(false)}
// // // //         trainings={trainings}
// // // //         employees={employees}
// // // //       />

// // // //       {selectedTraining && (
// // // //         <>
// // // //           <EditTraining
// // // //             open={openEditModal}
// // // //             training={selectedTraining}
// // // //             onClose={() => setOpenEditModal(false)}
// // // //             onUpdate={handleUpdateTraining}
// // // //           />

// // // //           <ViewTraining
// // // //             open={openViewModal}
// // // //             training={selectedTraining}
// // // //             onClose={() => setOpenViewModal(false)}
// // // //           />

// // // //           <DeleteTraining
// // // //             open={openDeleteModal}
// // // //             training={selectedTraining}
// // // //             onClose={() => setOpenDeleteModal(false)}
// // // //             onDelete={handleDeleteTraining}
// // // //           />
// // // //         </>
// // // //       )}

// // // //       {/* SNACKBAR */}

// // // //       <Snackbar
// // // //         open={snackbar.open}
// // // //         autoHideDuration={3000}
// // // //         onClose={() => setSnackbar({ ...snackbar, open: false })}
// // // //         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// // // //       >
// // // //         <Alert severity={snackbar.severity} variant="filled">
// // // //           {snackbar.message}
// // // //         </Alert>
// // // //       </Snackbar>
// // // //     </Box>
// // // //   );
// // // // };

// // // // export default TrainingRecordMaster;

// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Box,
// // //   Paper,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   IconButton,
// // //   Button,
// // //   TextField,
// // //   InputAdornment,
// // //   Typography,
// // //   Snackbar,
// // //   TablePagination,
// // //   Stack,
// // //   Chip,
// // //   Alert,
// // //   Menu,
// // //   MenuItem,
// // //   ListItemIcon,
// // //   ListItemText,
// // //   Divider,
// // // } from "@mui/material";

// // // import {
// // //   Search as SearchIcon,
// // //   Add as AddIcon,
// // //   Delete as DeleteIcon,
// // //   Visibility as ViewIcon,
// // //   Edit as EditIcon,
// // //   MoreVert as MoreVertIcon,
// // // } from "@mui/icons-material";
// // // import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

// // // import axios from "axios";
// // // import BASE_URL from "../../../config/Config";

// // // import AddTraining from "./AddTraining";
// // // import EditTraining from "./EditTraining";
// // // import ViewTraining from "./ViewTraining";
// // // import DeleteTraining from "./DeleteTraining";
// // // import AssignTraining from "./AssignTraining";

// // // const HEADER_GRADIENT =
// // //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // // const TrainingRecordMaster = () => {
// // //   const [trainings, setTrainings] = useState([]);
// // //   const [filteredTrainings, setFilteredTrainings] = useState([]);

// // //   const [employees, setEmployees] = useState([]);

// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [loading, setLoading] = useState(true);

// // //   const [page, setPage] = useState(0);
// // //   const [rowsPerPage, setRowsPerPage] = useState(10);

// // //   const [selectedTraining, setSelectedTraining] = useState(null);

// // //   const [openAddModal, setOpenAddModal] = useState(false);
// // //   const [openEditModal, setOpenEditModal] = useState(false);
// // //   const [openViewModal, setOpenViewModal] = useState(false);
// // //   const [openDeleteModal, setOpenDeleteModal] = useState(false);
// // //   const [openAssignModal, setOpenAssignModal] = useState(false);

// // //   const [menuAnchor, setMenuAnchor] = useState(null);
// // //   const [menuTraining, setMenuTraining] = useState(null);

// // //   const [snackbar, setSnackbar] = useState({
// // //     open: false,
// // //     message: "",
// // //     severity: "success",
// // //   });

// // //   useEffect(() => {
// // //     fetchTrainings();
// // //     fetchEmployees();
// // //   }, []);

// // //   const fetchTrainings = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const response = await axios.get(`${BASE_URL}/api/trainings/all`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });

// // //       if (response.data.success) {
// // //         setTrainings(response.data.data || []);
// // //         setFilteredTrainings(response.data.data || []);
// // //       }
// // //     } catch (err) {
// // //       showNotification("Failed to load trainings", "error");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchEmployees = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const res = await axios.get(`${BASE_URL}/api/employees`, {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //       });

// // //       console.log("Employees API:", res.data);

// // //       let employeesList = [];

// // //       // Case 1: normal structure
// // //       if (Array.isArray(res.data.data)) {
// // //         employeesList = res.data.data;
// // //       }

// // //       // Case 2: paginated structure
// // //       if (res.data.data && Array.isArray(res.data.data.data)) {
// // //         employeesList = res.data.data.data;
// // //       }

// // //       setEmployees(employeesList);
// // //     } catch (error) {
// // //       console.error("Employee fetch error:", error);
// // //     }
// // //   };

// // //   const handleSearch = (e) => {
// // //     const value = e.target.value.toLowerCase();
// // //     setSearchTerm(value);

// // //     const filtered = trainings.filter(
// // //       (training) =>
// // //         training.trainingName?.toLowerCase().includes(value) ||
// // //         training.provider?.toLowerCase().includes(value),
// // //     );

// // //     setFilteredTrainings(filtered);
// // //   };

// // //   const showNotification = (message, severity) => {
// // //     setSnackbar({
// // //       open: true,
// // //       message,
// // //       severity,
// // //     });
// // //   };

// // //   const handleAddTraining = (training) => {
// // //     const updated = [training, ...trainings];
// // //     setTrainings(updated);
// // //     setFilteredTrainings(updated);

// // //     showNotification("Training added successfully", "success");
// // //   };

// // //   const handleUpdateTraining = (updatedTraining) => {
// // //     const updated = trainings.map((t) =>
// // //       t._id === updatedTraining._id ? updatedTraining : t,
// // //     );

// // //     setTrainings(updated);
// // //     setFilteredTrainings(updated);

// // //     showNotification("Training updated successfully", "success");
// // //   };

// // //   const handleDeleteTraining = (id) => {
// // //     const updated = trainings.filter((t) => t._id !== id);

// // //     setTrainings(updated);
// // //     setFilteredTrainings(updated);

// // //     showNotification("Training deleted successfully", "success");
// // //   };

// // //   const handleCompleteTraining = async (training) => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       await axios.post(
// // //         `${BASE_URL}/api/trainings/complete`,
// // //         {
// // //           recordId: training._id,
// // //           score: 100,
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //         },
// // //       );

// // //       showNotification("Training completed successfully", "success");

// // //       fetchTrainings();
// // //     } catch (error) {
// // //       console.error(error);
// // //       showNotification("Failed to complete training", "error");
// // //     }
// // //   };

// // //   const openMenu = (event, training) => {
// // //     setMenuAnchor(event.currentTarget);
// // //     setMenuTraining(training);
// // //   };

// // //   const closeMenu = () => {
// // //     setMenuAnchor(null);
// // //     setMenuTraining(null);
// // //   };

// // //   const statusChip = (status) => {
// // //     let color = "default";

// // //     if (status === "Completed") color = "success";
// // //     if (status === "Pending") color = "warning";
// // //     if (status === "Scheduled") color = "info";

// // //     return <Chip label={status} color={color} size="small" />;
// // //   };

// // //   const certificateChip = (status) => {
// // //     let color = "default";

// // //     if (status === "Valid") color = "success";
// // //     if (status === "Expired") color = "error";
// // //     if (status === "NotIssued") color = "warning";

// // //     return <Chip label={status} color={color} size="small" />;
// // //   };

// // //   const paginatedTrainings = filteredTrainings.slice(
// // //     page * rowsPerPage,
// // //     page * rowsPerPage + rowsPerPage,
// // //   );

// // //   return (
// // //     <Box sx={{ p: 3 }}>
// // //       <Typography
// // //         variant="h5"
// // //         fontWeight={600}
// // //         sx={{
// // //           background: HEADER_GRADIENT,
// // //           WebkitBackgroundClip: "text",
// // //           WebkitTextFillColor: "transparent",
// // //         }}
// // //       >
// // //         Training Records
// // //       </Typography>

// // //       {/* SEARCH + BUTTONS */}

// // //       <Paper sx={{ p: 2, mt: 2 }}>
// // //         <Stack direction="row" justifyContent="space-between">
// // //           <TextField
// // //             placeholder="Search training..."
// // //             size="small"
// // //             value={searchTerm}
// // //             onChange={handleSearch}
// // //             InputProps={{
// // //               startAdornment: (
// // //                 <InputAdornment position="start">
// // //                   <SearchIcon />
// // //                 </InputAdornment>
// // //               ),
// // //             }}
// // //           />

// // //           <Stack direction="row" spacing={2}>
// // //             <Button
// // //               variant="contained"
// // //               sx={{ background: HEADER_GRADIENT }}
// // //               onClick={() => setOpenAssignModal(true)}
// // //             >
// // //               Assign Training
// // //             </Button>

// // //             <Button
// // //               startIcon={<AddIcon />}
// // //               variant="contained"
// // //               sx={{ background: HEADER_GRADIENT }}
// // //               onClick={() => setOpenAddModal(true)}
// // //             >
// // //               Add Training
// // //             </Button>
// // //           </Stack>
// // //         </Stack>
// // //       </Paper>

// // //       {/* TABLE */}

// // //       <Paper sx={{ mt: 2 }}>
// // //         <TableContainer>
// // //           <Table>
// // //             <TableHead>
// // //               <TableRow sx={{ background: HEADER_GRADIENT }}>
// // //                 <TableCell sx={{ color: "#fff" }}>Training</TableCell>
// // //                 <TableCell sx={{ color: "#fff" }}>Provider</TableCell>
// // //                 <TableCell sx={{ color: "#fff" }}>Start</TableCell>
// // //                 <TableCell sx={{ color: "#fff" }}>End</TableCell>
// // //                 <TableCell sx={{ color: "#fff" }}>Status</TableCell>
// // //                 <TableCell sx={{ color: "#fff" }}>Certificate</TableCell>
// // //                 <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
// // //               </TableRow>
// // //             </TableHead>

// // //             <TableBody>
// // //               {loading ? (
// // //                 <TableRow>
// // //                   <TableCell colSpan={7} align="center">
// // //                     Loading trainings...
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ) : (
// // //                 paginatedTrainings.map((training) => (
// // //                   <TableRow key={training._id} hover>
// // //                     <TableCell>{training.trainingName}</TableCell>
// // //                     <TableCell>{training.provider}</TableCell>
// // //                     <TableCell>{training.startDate}</TableCell>
// // //                     <TableCell>{training.endDate}</TableCell>
// // //                     <TableCell>{statusChip(training.status)}</TableCell>
// // //                     <TableCell>
// // //                       {training.certificateStatus === "Valid" &&
// // //                       training.certificateFile ? (
// // //                         <Button
// // //                           variant="outlined"
// // //                           size="small"
// // //                           href={`${BASE_URL}${training.certificateFile}`}
// // //                           target="_blank"
// // //                         >
// // //                           Download
// // //                         </Button>
// // //                       ) : (
// // //                         certificateChip(training.certificateStatus)
// // //                       )}
// // //                     </TableCell>

// // //                     <TableCell>
// // //                       <IconButton onClick={(e) => openMenu(e, training)}>
// // //                         <MoreVertIcon />
// // //                       </IconButton>
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 ))
// // //               )}
// // //             </TableBody>
// // //           </Table>
// // //         </TableContainer>

// // //         <TablePagination
// // //           rowsPerPageOptions={[5, 10, 25]}
// // //           component="div"
// // //           count={filteredTrainings.length}
// // //           rowsPerPage={rowsPerPage}
// // //           page={page}
// // //           onPageChange={(e, newPage) => setPage(newPage)}
// // //           onRowsPerPageChange={(e) => {
// // //             setRowsPerPage(parseInt(e.target.value, 10));
// // //             setPage(0);
// // //           }}
// // //         />
// // //       </Paper>

// // //       {/* ACTION MENU */}

// // //       <Menu
// // //         anchorEl={menuAnchor}
// // //         open={Boolean(menuAnchor)}
// // //         onClose={closeMenu}
// // //       >
// // //         {/* VIEW */}
// // //         <MenuItem
// // //           onClick={() => {
// // //             setSelectedTraining(menuTraining);
// // //             setOpenViewModal(true);
// // //             closeMenu();
// // //           }}
// // //         >
// // //           <ListItemIcon>
// // //             <ViewIcon fontSize="small" />
// // //           </ListItemIcon>
// // //           <ListItemText>View</ListItemText>
// // //         </MenuItem>

// // //         {/* EDIT */}
// // //         <MenuItem
// // //           onClick={() => {
// // //             setSelectedTraining(menuTraining);
// // //             setOpenEditModal(true);
// // //             closeMenu();
// // //           }}
// // //         >
// // //           <ListItemIcon>
// // //             <EditIcon fontSize="small" />
// // //           </ListItemIcon>
// // //           <ListItemText>Edit</ListItemText>
// // //         </MenuItem>

// // //         {/* COMPLETE TRAINING */}
// // //         <MenuItem
// // //           onClick={() => {
// // //             handleCompleteTraining(menuTraining);
// // //             closeMenu();
// // //           }}
// // //         >
// // //           <ListItemIcon>
// // //             <CheckCircleIcon color="success" fontSize="small" />
// // //           </ListItemIcon>
// // //           <ListItemText>Complete Training</ListItemText>
// // //         </MenuItem>

// // //         <Divider />

// // //         {/* DELETE */}
// // //         <MenuItem
// // //           onClick={() => {
// // //             setSelectedTraining(menuTraining);
// // //             setOpenDeleteModal(true);
// // //             closeMenu();
// // //           }}
// // //         >
// // //           <ListItemIcon sx={{ color: "#EF4444" }}>
// // //             <DeleteIcon fontSize="small" />
// // //           </ListItemIcon>
// // //           <ListItemText sx={{ color: "#EF4444" }}>Delete</ListItemText>
// // //         </MenuItem>
// // //       </Menu>

// // //       {/* MODALS */}

// // //       <AddTraining
// // //         open={openAddModal}
// // //         onClose={() => setOpenAddModal(false)}
// // //         onAdd={handleAddTraining}
// // //       />

// // //       <AssignTraining
// // //         open={openAssignModal}
// // //         onClose={() => setOpenAssignModal(false)}
// // //         trainings={trainings}
// // //         employees={employees}
// // //       />

// // //       {selectedTraining && (
// // //         <>
// // //           <EditTraining
// // //             open={openEditModal}
// // //             training={selectedTraining}
// // //             onClose={() => setOpenEditModal(false)}
// // //             onUpdate={handleUpdateTraining}
// // //           />

// // //           <ViewTraining
// // //             open={openViewModal}
// // //             training={selectedTraining}
// // //             onClose={() => setOpenViewModal(false)}
// // //           />

// // //           <DeleteTraining
// // //             open={openDeleteModal}
// // //             training={selectedTraining}
// // //             onClose={() => setOpenDeleteModal(false)}
// // //             onDelete={handleDeleteTraining}
// // //           />
// // //         </>
// // //       )}

// // //       {/* SNACKBAR */}

// // //       <Snackbar
// // //         open={snackbar.open}
// // //         autoHideDuration={3000}
// // //         onClose={() => setSnackbar({ ...snackbar, open: false })}
// // //         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// // //       >
// // //         <Alert severity={snackbar.severity} variant="filled">
// // //           {snackbar.message}
// // //         </Alert>
// // //       </Snackbar>
// // //     </Box>
// // //   );
// // // };

// // // export default TrainingRecordMaster;

// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Box,
// // //   Paper,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   IconButton,
// // //   Button,
// // //   TextField,
// // //   InputAdornment,
// // //   Typography,
// // //   Snackbar,
// // //   TablePagination,
// // //   Stack,
// // //   Chip,
// // //   Alert,
// // //   Menu,
// // //   MenuItem,
// // //   ListItemIcon,
// // //   ListItemText,
// // //   Divider,
// // //   ToggleButton,
// // //   ToggleButtonGroup
// // // } from "@mui/material";

// // // import {
// // //   Search as SearchIcon,
// // //   Add as AddIcon,
// // //   Delete as DeleteIcon,
// // //   Visibility as ViewIcon,
// // //   Edit as EditIcon,
// // //   MoreVert as MoreVertIcon
// // // } from "@mui/icons-material";
// // // import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

// // // import axios from "axios";
// // // import BASE_URL from "../../../config/Config";

// // // import AddTraining from "./AddTraining";
// // // import EditTraining from "./EditTraining";
// // // import ViewTraining from "./ViewTraining";
// // // import DeleteTraining from "./DeleteTraining";
// // // import AssignTraining from "./AssignTraining";

// // // const HEADER_GRADIENT =
// // //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // // const TrainingRecordMaster = () => {

// // //   const [mode, setMode] = useState("add");

// // //   const [trainings, setTrainings] = useState([]);
// // //   const [assignedTrainings, setAssignedTrainings] = useState([]);

// // //   const [employees, setEmployees] = useState([]);

// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [loading, setLoading] = useState(true);

// // //   const [page, setPage] = useState(0);
// // //   const [rowsPerPage, setRowsPerPage] = useState(10);

// // //   const [selectedTraining, setSelectedTraining] = useState(null);

// // //   const [openAddModal, setOpenAddModal] = useState(false);
// // //   const [openEditModal, setOpenEditModal] = useState(false);
// // //   const [openViewModal, setOpenViewModal] = useState(false);
// // //   const [openDeleteModal, setOpenDeleteModal] = useState(false);
// // //   const [openAssignModal, setOpenAssignModal] = useState(false);

// // //   const [menuAnchor, setMenuAnchor] = useState(null);
// // //   const [menuTraining, setMenuTraining] = useState(null);

// // //   const [snackbar, setSnackbar] = useState({
// // //     open: false,
// // //     message: "",
// // //     severity: "success",
// // //   });

// // //   useEffect(() => {
// // //     fetchEmployees();

// // //     if (mode === "add") {
// // //       fetchTrainings();
// // //     } else {
// // //       fetchAssignedTrainings();
// // //     }
// // //   }, [mode]);

// // //   // 🔹 HR Trainings
// // //   const fetchTrainings = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const res = await axios.get(`${BASE_URL}/api/trainings/all`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });

// // //       if (res.data.success) {
// // //         setTrainings(res.data.data || []);
// // //       }
// // //     } catch {
// // //       showNotification("Failed to load trainings", "error");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // 🔹 Assigned Trainings
// // //   const fetchAssignedTrainings = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const res = await axios.get(`${BASE_URL}/api/trainings/assigned`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });

// // //       if (res.data.success) {
// // //         setAssignedTrainings(res.data.data || []);
// // //       }
// // //     } catch {
// // //       showNotification("Failed to load assigned trainings", "error");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchEmployees = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const res = await axios.get(`${BASE_URL}/api/employees`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });

// // //       let list = [];
// // //       if (Array.isArray(res.data.data)) list = res.data.data;
// // //       if (res.data.data?.data) list = res.data.data.data;

// // //       setEmployees(list);
// // //     } catch (err) {
// // //       console.error(err);
// // //     }
// // //   };

// // //   const showNotification = (message, severity) => {
// // //     setSnackbar({ open: true, message, severity });
// // //   };

// // //   const handleCompleteTraining = async (training) => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       await axios.post(
// // //         `${BASE_URL}/api/trainings/complete`,
// // //         { recordId: training._id, score: 100 },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );

// // //       showNotification("Training completed", "success");
// // //       fetchAssignedTrainings();
// // //     } catch {
// // //       showNotification("Failed", "error");
// // //     }
// // //   };

// // //   const openMenu = (e, item) => {
// // //     setMenuAnchor(e.currentTarget);
// // //     setMenuTraining(item);
// // //   };

// // //   const closeMenu = () => {
// // //     setMenuAnchor(null);
// // //     setMenuTraining(null);
// // //   };

// // //   const tableData = mode === "add" ? trainings : assignedTrainings;

// // //   const paginatedData = tableData.slice(
// // //     page * rowsPerPage,
// // //     page * rowsPerPage + rowsPerPage
// // //   );

// // //   return (
// // //     <Box sx={{ p: 3 }}>

// // //       {/* TOGGLE */}
// // //       <ToggleButtonGroup
// // //         value={mode}
// // //         exclusive
// // //         onChange={(e, val) => val && setMode(val)}
// // //         sx={{ mb: 2 }}
// // //       >
// // //         <ToggleButton value="add">Add Training</ToggleButton>
// // //         <ToggleButton value="assign">Assign Training</ToggleButton>
// // //       </ToggleButtonGroup>

// // //       <Typography variant="h5" fontWeight={600}>
// // //         {mode === "add" ? "Training Master" : "Assigned Trainings"}
// // //       </Typography>

// // //       {/* ACTION BAR */}
// // //       <Paper sx={{ p: 2, mt: 2 }}>
// // //         <Stack direction="row" justifyContent="space-between">
// // //           <TextField
// // //             placeholder="Search..."
// // //             size="small"
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             InputProps={{
// // //               startAdornment: (
// // //                 <InputAdornment position="start">
// // //                   <SearchIcon />
// // //                 </InputAdornment>
// // //               )
// // //             }}
// // //           />

// // //           {mode === "add" ? (
// // //             <Button
// // //               startIcon={<AddIcon />}
// // //               variant="contained"
// // //               sx={{ background: HEADER_GRADIENT }}
// // //               onClick={() => setOpenAddModal(true)}
// // //             >
// // //               Add Training
// // //             </Button>
// // //           ) : (
// // //             <Button
// // //               variant="contained"
// // //               sx={{ background: HEADER_GRADIENT }}
// // //               onClick={() => setOpenAssignModal(true)}
// // //             >
// // //               Assign Training
// // //             </Button>
// // //           )}
// // //         </Stack>
// // //       </Paper>

// // //       {/* TABLE */}
// // //       <Paper sx={{ mt: 2 }}>
// // //         <TableContainer>
// // //           <Table>

// // //             {/* 🔥 DYNAMIC HEADER */}
// // //             <TableHead>
// // //               <TableRow sx={{ background: HEADER_GRADIENT }}>
// // //                 {mode === "add" ? (
// // //                   <>
// // //                     <TableCell sx={{ color: "#fff" }}>Training</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Provider</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Start</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>End</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Status</TableCell>
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <TableCell sx={{ color: "#fff" }}>Employee</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Training</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Start</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>End</TableCell>
// // //                   </>
// // //                 )}

// // //                 <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
// // //               </TableRow>
// // //             </TableHead>

// // //             {/* 🔥 DYNAMIC BODY */}
// // //             <TableBody>
// // //               {paginatedData.map((item) => (
// // //                 <TableRow key={item._id}>

// // //                   {mode === "add" ? (
// // //                     <>
// // //                       <TableCell>{item.trainingName}</TableCell>
// // //                       <TableCell>{item.provider}</TableCell>
// // //                       <TableCell>{item.startDate}</TableCell>
// // //                       <TableCell>{item.endDate}</TableCell>
// // //                       <TableCell>
// // //                         <Chip label={item.status} size="small" />
// // //                       </TableCell>
// // //                     </>
// // //                   ) : (
// // //                     <>
// // //                       <TableCell>{item.employeeName}</TableCell>
// // //                       <TableCell>{item.trainingName}</TableCell>
// // //                       <TableCell>{item.startDate}</TableCell>
// // //                       <TableCell>{item.endDate}</TableCell>
// // //                     </>
// // //                   )}

// // //                   <TableCell>
// // //                     <IconButton onClick={(e) => openMenu(e, item)}>
// // //                       <MoreVertIcon />
// // //                     </IconButton>
// // //                   </TableCell>

// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>

// // //           </Table>
// // //         </TableContainer>

// // //         <TablePagination
// // //           component="div"
// // //           count={tableData.length}
// // //           page={page}
// // //           rowsPerPage={rowsPerPage}
// // //           onPageChange={(e, p) => setPage(p)}
// // //           onRowsPerPageChange={(e) => {
// // //             setRowsPerPage(parseInt(e.target.value));
// // //             setPage(0);
// // //           }}
// // //         />
// // //       </Paper>

// // //       {/* 🔥 ACTION MENU */}
// // //       <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>

// // //         {mode === "add" ? (
// // //           <>
// // //             <MenuItem onClick={() => { setSelectedTraining(menuTraining); setOpenViewModal(true); closeMenu(); }}>
// // //               <ListItemIcon><ViewIcon /></ListItemIcon>
// // //               <ListItemText>View</ListItemText>
// // //             </MenuItem>

// // //             <MenuItem onClick={() => { setSelectedTraining(menuTraining); setOpenEditModal(true); closeMenu(); }}>
// // //               <ListItemIcon><EditIcon /></ListItemIcon>
// // //               <ListItemText>Edit</ListItemText>
// // //             </MenuItem>

// // //             <Divider />

// // //             <MenuItem onClick={() => { setSelectedTraining(menuTraining); setOpenDeleteModal(true); closeMenu(); }}>
// // //               <ListItemIcon><DeleteIcon /></ListItemIcon>
// // //               <ListItemText>Delete</ListItemText>
// // //             </MenuItem>
// // //           </>
// // //         ) : (
// // //           <>
// // //             <MenuItem onClick={() => { handleCompleteTraining(menuTraining); closeMenu(); }}>
// // //               <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
// // //               <ListItemText>Complete Training</ListItemText>
// // //             </MenuItem>

// // //             {menuTraining?.certificateFile && (
// // //               <MenuItem
// // //                 component="a"
// // //                 href={`${BASE_URL}${menuTraining.certificateFile}`}
// // //                 target="_blank"
// // //               >
// // //                 <ListItemText>Download Certificate</ListItemText>
// // //               </MenuItem>
// // //             )}
// // //           </>
// // //         )}

// // //       </Menu>

// // //       {/* MODALS */}
// // //       <AddTraining open={openAddModal} onClose={() => setOpenAddModal(false)} />
// // //       <AssignTraining open={openAssignModal} onClose={() => setOpenAssignModal(false)} trainings={trainings} employees={employees} />
// // //       <EditTraining open={openEditModal} training={selectedTraining} onClose={() => setOpenEditModal(false)} />
// // //       <ViewTraining open={openViewModal} training={selectedTraining} onClose={() => setOpenViewModal(false)} />
// // //       <DeleteTraining open={openDeleteModal} training={selectedTraining} onClose={() => setOpenDeleteModal(false)} />

// // //       {/* SNACKBAR */}
// // //       <Snackbar open={snackbar.open} autoHideDuration={3000}>
// // //         <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
// // //       </Snackbar>

// // //     </Box>
// // //   );
// // // };

// // // export default TrainingRecordMaster;


// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Box,
// // //   Paper,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   IconButton,
// // //   Button,
// // //   TextField,
// // //   InputAdornment,
// // //   Typography,
// // //   Snackbar,
// // //   TablePagination,
// // //   Stack,
// // //   Chip,
// // //   Alert,
// // //   Menu,
// // //   MenuItem,
// // //   ListItemIcon,
// // //   ListItemText,
// // //   Divider,
// // //   ToggleButton,
// // //   ToggleButtonGroup
// // // } from "@mui/material";

// // // import {
// // //   Search as SearchIcon,
// // //   Add as AddIcon,
// // //   Delete as DeleteIcon,
// // //   Visibility as ViewIcon,
// // //   Edit as EditIcon,
// // //   MoreVert as MoreVertIcon,
// // //   CheckCircle as CheckCircleIcon
// // // } from "@mui/icons-material";

// // // import axios from "axios";
// // // import BASE_URL from "../../../config/Config";

// // // import AddTraining from "./AddTraining";
// // // import EditTraining from "./EditTraining";
// // // import ViewTraining from "./ViewTraining";
// // // import DeleteTraining from "./DeleteTraining";
// // // import AssignTraining from "./AssignTraining";

// // // const HEADER_GRADIENT =
// // //   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// // // const TrainingRecordMaster = () => {
// // //   const [mode, setMode] = useState("add");
// // //   const [trainings, setTrainings] = useState([]);
// // //   const [assignedTrainings, setAssignedTrainings] = useState([]);
// // //   const [employees, setEmployees] = useState([]);

// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [loading, setLoading] = useState(true);

// // //   const [page, setPage] = useState(0);
// // //   const [rowsPerPage, setRowsPerPage] = useState(10);

// // //   const [selectedTraining, setSelectedTraining] = useState(null);

// // //   const [openAddModal, setOpenAddModal] = useState(false);
// // //   const [openEditModal, setOpenEditModal] = useState(false);
// // //   const [openViewModal, setOpenViewModal] = useState(false);
// // //   const [openDeleteModal, setOpenDeleteModal] = useState(false);
// // //   const [openAssignModal, setOpenAssignModal] = useState(false);

// // //   const [menuAnchor, setMenuAnchor] = useState(null);
// // //   const [menuTraining, setMenuTraining] = useState(null);

// // //   const [snackbar, setSnackbar] = useState({
// // //     open: false,
// // //     message: "",
// // //     severity: "success",
// // //   });

// // //   useEffect(() => {
// // //     setLoading(true);
// // //     fetchEmployees();

// // //     if (mode === "add") {
// // //       fetchTrainings();
// // //     } else {
// // //       fetchAssignedTrainings();
// // //     }
// // //   }, [mode]);

// // //   // ✅ FIXED API HANDLING
// // //   const fetchTrainings = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const res = await axios.get(`${BASE_URL}/api/trainings/all`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });

// // //       let list = [];
// // //       if (Array.isArray(res.data.data)) list = res.data.data;
// // //       if (res.data.data?.data) list = res.data.data.data;

// // //       setTrainings(list);
// // //     } catch {
// // //       showNotification("Failed to load trainings", "error");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchAssignedTrainings = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const res = await axios.get(`${BASE_URL}/api/trainings/assigned`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });

// // //       let list = [];
// // //       if (Array.isArray(res.data.data)) list = res.data.data;
// // //       if (res.data.data?.data) list = res.data.data.data;

// // //       setAssignedTrainings(list);
// // //     } catch {
// // //       showNotification("Failed to load assigned trainings", "error");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchEmployees = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const res = await axios.get(`${BASE_URL}/api/employees`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });

// // //       let list = [];
// // //       if (Array.isArray(res.data.data)) list = res.data.data;
// // //       if (res.data.data?.data) list = res.data.data.data;

// // //       setEmployees(list);
// // //     } catch (err) {
// // //       console.error(err);
// // //     }
// // //   };

// // //   const showNotification = (message, severity) => {
// // //     setSnackbar({ open: true, message, severity });
// // //   };

// // //   const handleCompleteTraining = async (training) => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       await axios.post(
// // //         `${BASE_URL}/api/trainings/complete`,
// // //         { recordId: training._id, score: 100 },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );

// // //       showNotification("Training completed", "success");
// // //       fetchAssignedTrainings();
// // //     } catch {
// // //       showNotification("Failed", "error");
// // //     }
// // //   };

// // //   const openMenu = (e, item) => {
// // //     setMenuAnchor(e.currentTarget);
// // //     setMenuTraining(item);
// // //   };

// // //   const closeMenu = () => {
// // //     setMenuAnchor(null);
// // //     setMenuTraining(null);
// // //   };

// // //   const tableData = mode === "add" ? trainings : assignedTrainings;

// // //   // ✅ SEARCH FIX
// // //   const filteredData = tableData.filter((item) =>
// // //     (item.trainingName || "")
// // //       .toLowerCase()
// // //       .includes(searchTerm.toLowerCase())
// // //   );

// // //   const paginatedData = filteredData.slice(
// // //     page * rowsPerPage,
// // //     page * rowsPerPage + rowsPerPage
// // //   );

// // //   // ✅ LOADING STATE
// // //   if (loading) {
// // //     return <h2>Loading...</h2>;
// // //   }

// // //   return (
// // //     <Box sx={{ p: 3 }}>
// // //       <ToggleButtonGroup
// // //         value={mode}
// // //         exclusive
// // //         onChange={(e, val) => val && setMode(val)}
// // //         sx={{ mb: 2 }}
// // //       >
// // //         <ToggleButton value="add">Add Training</ToggleButton>
// // //         <ToggleButton value="assign">Assign Training</ToggleButton>
// // //       </ToggleButtonGroup>

// // //       <Typography variant="h5" fontWeight={600}>
// // //         {mode === "add" ? "Training Master" : "Assigned Trainings"}
// // //       </Typography>

// // //       <Paper sx={{ p: 2, mt: 2 }}>
// // //         <Stack direction="row" justifyContent="space-between">
// // //           <TextField
// // //             placeholder="Search..."
// // //             size="small"
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             InputProps={{
// // //               startAdornment: (
// // //                 <InputAdornment position="start">
// // //                   <SearchIcon />
// // //                 </InputAdornment>
// // //               )
// // //             }}
// // //           />

// // //           {mode === "add" ? (
// // //             <Button
// // //               startIcon={<AddIcon />}
// // //               variant="contained"
// // //               sx={{ background: HEADER_GRADIENT }}
// // //               onClick={() => setOpenAddModal(true)}
// // //             >
// // //               Add Training
// // //             </Button>
// // //           ) : (
// // //             <Button
// // //               variant="contained"
// // //               sx={{ background: HEADER_GRADIENT }}
// // //               onClick={() => setOpenAssignModal(true)}
// // //             >
// // //               Assign Training
// // //             </Button>
// // //           )}
// // //         </Stack>
// // //       </Paper>

// // //       <Paper sx={{ mt: 2 }}>
// // //         <TableContainer>
// // //           <Table>
// // //             <TableHead>
// // //               <TableRow sx={{ background: HEADER_GRADIENT }}>
// // //                 {mode === "add" ? (
// // //                   <>
// // //                     <TableCell sx={{ color: "#fff" }}>Training</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Provider</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Start</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>End</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Status</TableCell>
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <TableCell sx={{ color: "#fff" }}>Employee</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Training</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>Start</TableCell>
// // //                     <TableCell sx={{ color: "#fff" }}>End</TableCell>
// // //                   </>
// // //                 )}
// // //                 <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
// // //               </TableRow>
// // //             </TableHead>

// // //             <TableBody>
// // //               {paginatedData.length === 0 ? (
// // //                 <TableRow>
// // //                   <TableCell colSpan={6} align="center">
// // //                     No Data Found
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ) : (
// // //                 paginatedData.map((item) => (
// // //                   <TableRow key={item._id}>
// // //                     {mode === "add" ? (
// // //                       <>
// // //                         <TableCell>{item.trainingName}</TableCell>
// // //                         <TableCell>{item.provider}</TableCell>
// // //                         <TableCell>{item.startDate?.slice(0, 10)}</TableCell>
// // //                         <TableCell>{item.endDate?.slice(0, 10)}</TableCell>
// // //                         <TableCell>
// // //                           <Chip label={item.status} size="small" />
// // //                         </TableCell>
// // //                       </>
// // //                     ) : (
// // //                       <>
// // //                         <TableCell>{item.employeeName}</TableCell>
// // //                         <TableCell>{item.trainingName}</TableCell>
// // //                         <TableCell>{item.startDate?.slice(0, 10)}</TableCell>
// // //                         <TableCell>{item.endDate?.slice(0, 10)}</TableCell>
// // //                       </>
// // //                     )}

// // //                     <TableCell>
// // //                       <IconButton onClick={(e) => openMenu(e, item)}>
// // //                         <MoreVertIcon />
// // //                       </IconButton>
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 ))
// // //               )}
// // //             </TableBody>
// // //           </Table>
// // //         </TableContainer>

// // //         <TablePagination
// // //           component="div"
// // //           count={filteredData.length}
// // //           page={page}
// // //           rowsPerPage={rowsPerPage}
// // //           onPageChange={(e, p) => setPage(p)}
// // //           onRowsPerPageChange={(e) => {
// // //             setRowsPerPage(parseInt(e.target.value));
// // //             setPage(0);
// // //           }}
// // //         />
// // //       </Paper>

// // //       <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
// // //         {mode === "add" ? (
// // //           <>
// // //             <MenuItem onClick={() => { setSelectedTraining(menuTraining); setOpenViewModal(true); closeMenu(); }}>
// // //               <ListItemIcon><ViewIcon /></ListItemIcon>
// // //               <ListItemText>View</ListItemText>
// // //             </MenuItem>

// // //             <MenuItem onClick={() => { setSelectedTraining(menuTraining); setOpenEditModal(true); closeMenu(); }}>
// // //               <ListItemIcon><EditIcon /></ListItemIcon>
// // //               <ListItemText>Edit</ListItemText>
// // //             </MenuItem>

// // //             <Divider />

// // //             <MenuItem onClick={() => { setSelectedTraining(menuTraining); setOpenDeleteModal(true); closeMenu(); }}>
// // //               <ListItemIcon><DeleteIcon /></ListItemIcon>
// // //               <ListItemText>Delete</ListItemText>
// // //             </MenuItem>
// // //           </>
// // //         ) : (
// // //           <>
// // //             <MenuItem onClick={() => { handleCompleteTraining(menuTraining); closeMenu(); }}>
// // //               <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
// // //               <ListItemText>Complete Training</ListItemText>
// // //             </MenuItem>
// // //           </>
// // //         )}
// // //       </Menu>

// // //       <AddTraining open={openAddModal} onClose={() => setOpenAddModal(false)} />
// // //       <AssignTraining open={openAssignModal} onClose={() => setOpenAssignModal(false)} trainings={trainings} employees={employees} />
// // //       <EditTraining open={openEditModal} training={selectedTraining} onClose={() => setOpenEditModal(false)} />
// // //       <ViewTraining open={openViewModal} training={selectedTraining} onClose={() => setOpenViewModal(false)} />
// // //       <DeleteTraining open={openDeleteModal} training={selectedTraining} onClose={() => setOpenDeleteModal(false)} />

// // //       <Snackbar open={snackbar.open} autoHideDuration={3000}>
// // //         <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
// // //       </Snackbar>
// // //     </Box>
// // //   );
// // // };

// // // export default TrainingRecordMaster;


// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   Box,
// // //   Paper,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   IconButton,
// // //   Button,
// // //   TextField,
// // //   InputAdornment,
// // //   Tooltip,
// // //   Typography,
// // //   Snackbar,
// // //   TablePagination,
// // //   Checkbox,
// // //   Stack,
// // //   Chip,
// // //   Avatar,
// // //   Menu,
// // //   MenuItem,
// // //   ListItemIcon,
// // //   ListItemText,
// // //   Divider,
// // //   Alert,
// // //   CircularProgress,
// // //   ToggleButton,
// // //   ToggleButtonGroup
// // // } from '@mui/material';
// // // import {
// // //   Search as SearchIcon,
// // //   Add as AddIcon,
// // //   Delete as DeleteIcon,
// // //   Visibility as ViewIcon,
// // //   Edit as EditIcon,
// // //   MoreVert as MoreVertIcon,
// // //   Refresh as RefreshIcon,
// // //   School as SchoolIcon,
// // //   Assignment as AssignmentIcon,
// // //   CheckCircle as CheckCircleIcon
// // // } from '@mui/icons-material';
// // // import axios from 'axios';
// // // import BASE_URL from '../../../config/Config';
// // // import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// // // // Import modal components
// // // import AddTraining from './AddTraining';
// // // import EditTraining from './EditTraining';
// // // import ViewTraining from './ViewTraining';
// // // import DeleteTraining from './DeleteTraining';
// // // import AssignTraining from './AssignTraining';

// // // // Color constants - Same as LeaveTypeMaster
// // // const COLORS = {
// // //   primary: '#063C3F',
// // //   primaryLight: '#E8F0F1',
// // //   primaryDark: '#05292B',
// // //   text: {
// // //     primary: '#151C26',
// // //     secondary: '#4B5568',
// // //     tertiary: '#94A3B8',
// // //     light: '#FFFFFF',
// // //     lightMuted: 'rgba(255, 255, 255, 0.9)'
// // //   },
// // //   background: {
// // //     white: '#FFFFFF',
// // //     light: '#F8FFFC',
// // //     hover: '#F0FDF9',
// // //     tableHeader: '#063C3F'
// // //   },
// // //   border: '#E3E8EF',
// // //   chips: {
// // //     active: '#9FE2BF',
// // //     inactive: '#F1F5F9',
// // //     completed: '#9FE2BF',
// // //     pending: '#FEF3C7',
// // //     inProgress: '#E0F2FE',
// // //     cancelled: '#FEE2E2'
// // //   }
// // // };

// // // // Loading state component
// // // const LoadingState = () => (
// // //   <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
// // //     <CircularProgress size={40} sx={{ color: COLORS.primary }} />
// // //   </Box>
// // // );

// // // // Access Denied component
// // // const AccessDenied = () => (
// // //   <Box sx={{ p: 4, textAlign: 'center' }}>
// // //     <Typography variant="h6" color="error" sx={{ mb: 2 }}>
// // //       Access Denied
// // //     </Typography>
// // //     <Typography variant="body2" color="text.secondary">
// // //       You don't have permission to view this page. Please contact your administrator.
// // //     </Typography>
// // //   </Box>
// // // );

// // // // Action Menu Component with permission checks
// // // const ActionMenu = ({ item, onView, onEdit, onDelete, onComplete, anchorEl, onClose, onOpen, permissions, mode }) => {
// // //   const moduleKey = MODULES.TRAINING_MASTER;
// // //   const pageKey = PAGES.TRAINING_RECORDS;
  
// // //   const canView = hasPermission(permissions, moduleKey, pageKey, ACTIONS.VIEW);
// // //   const canUpdate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.UPDATE);
// // //   const canDelete = hasPermission(permissions, moduleKey, pageKey, ACTIONS.DELETE);
// // //   const canCreate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.CREATE);

// // //   // If no actions available, don't render the menu
// // //   if (!canView && !canUpdate && !canDelete && !(mode === 'assign' && canCreate)) {
// // //     return null;
// // //   }

// // //   return (
// // //     <>
// // //       <Tooltip title="Actions">
// // //         <IconButton
// // //           size="small"
// // //           onClick={onOpen}
// // //           sx={{
// // //             color: COLORS.text.secondary,
// // //             '&:hover': {
// // //               bgcolor: `${COLORS.primary}20`
// // //             }
// // //           }}
// // //         >
// // //           <MoreVertIcon fontSize="small" />
// // //         </IconButton>
// // //       </Tooltip>
// // //       <Menu
// // //         anchorEl={anchorEl}
// // //         open={Boolean(anchorEl)}
// // //         onClose={onClose}
// // //         PaperProps={{
// // //           elevation: 3,
// // //           sx: {
// // //             mt: 1,
// // //             minWidth: 180,
// // //             borderRadius: 2,
// // //             border: `1px solid ${COLORS.border}`,
// // //             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
// // //           }
// // //         }}
// // //       >
// // //         {mode === 'add' ? (
// // //           <>
// // //             {canView && (
// // //               <MenuItem 
// // //                 onClick={() => {
// // //                   onView(item);
// // //                   onClose();
// // //                 }}
// // //                 sx={{ py: 1.5 }}
// // //               >
// // //                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// // //                   <ViewIcon fontSize="small" />
// // //                 </ListItemIcon>
// // //                 <ListItemText>
// // //                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// // //                     View Details
// // //                   </Typography>
// // //                 </ListItemText>
// // //               </MenuItem>
// // //             )}
            
// // //             {canUpdate && (
// // //               <MenuItem 
// // //                 onClick={() => {
// // //                   onEdit(item);
// // //                   onClose();
// // //                 }}
// // //                 sx={{ py: 1.5 }}
// // //               >
// // //                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// // //                   <EditIcon fontSize="small" />
// // //                 </ListItemIcon>
// // //                 <ListItemText>
// // //                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// // //                     Edit
// // //                   </Typography>
// // //                 </ListItemText>
// // //               </MenuItem>
// // //             )}
            
// // //             {(canView || canUpdate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
            
// // //             {canDelete && (
// // //               <MenuItem 
// // //                 onClick={() => {
// // //                   onDelete(item);
// // //                   onClose();
// // //                 }}
// // //                 sx={{ py: 1.5 }}
// // //               >
// // //                 <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
// // //                   <DeleteIcon fontSize="small" />
// // //                 </ListItemIcon>
// // //                 <ListItemText>
// // //                   <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
// // //                     Delete
// // //                   </Typography>
// // //                 </ListItemText>
// // //               </MenuItem>
// // //             )}
// // //           </>
// // //         ) : (
// // //           <>
// // //             {canCreate && (
// // //               <MenuItem 
// // //                 onClick={() => {
// // //                   onComplete(item);
// // //                   onClose();
// // //                 }}
// // //                 sx={{ py: 1.5 }}
// // //               >
// // //                 <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
// // //                   <CheckCircleIcon fontSize="small" />
// // //                 </ListItemIcon>
// // //                 <ListItemText>
// // //                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// // //                     Mark as Completed
// // //                   </Typography>
// // //                 </ListItemText>
// // //               </MenuItem>
// // //             )}
// // //           </>
// // //         )}
// // //       </Menu>
// // //     </>
// // //   );
// // // };

// // // const TrainingRecordMaster = () => {
// // //   // Mode state (Training Master or Assigned Trainings)
// // //   const [mode, setMode] = useState('add'); // 'add' or 'assign'
  
// // //   // State for data
// // //   const [trainings, setTrainings] = useState([]);
// // //   const [assignedTrainings, setAssignedTrainings] = useState([]);
// // //   const [employees, setEmployees] = useState([]);
// // //   const [filteredData, setFilteredData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [searchInput, setSearchInput] = useState('');
  
// // //   // Table state
// // //   const [page, setPage] = useState(0);
// // //   const [rowsPerPage, setRowsPerPage] = useState(5);
// // //   const [selected, setSelected] = useState([]);
  
// // //   // Menu state for action buttons
// // //   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
// // //   const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  
// // //   // Modal state
// // //   const [openAddModal, setOpenAddModal] = useState(false);
// // //   const [openEditModal, setOpenEditModal] = useState(false);
// // //   const [openViewModal, setOpenViewModal] = useState(false);
// // //   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
// // //   const [openAssignModal, setOpenAssignModal] = useState(false);
  
// // //   // Selected item
// // //   const [selectedItem, setSelectedItem] = useState(null);
  
// // //   // Notification state
// // //   const [snackbar, setSnackbar] = useState({
// // //     open: false,
// // //     message: '',
// // //     severity: 'success'
// // //   });

// // //   // User permissions state
// // //   const [userPermissions, setUserPermissions] = useState([]);
// // //   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
// // //   const [permissionsLoaded, setPermissionsLoaded] = useState(false);

// // //   // Fetch user permissions
// // //   useEffect(() => {
// // //     const fetchUserPermissions = async () => {
// // //       try {
// // //         const token = localStorage.getItem('token');
// // //         const response = await axios.get(`${BASE_URL}/api/auth/me`, {
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`
// // //           }
// // //         });
        
// // //         if (response.data.success) {
// // //           const userData = response.data.data;
// // //           setIsSuperAdmin(userData.isSuperAdmin || false);
          
// // //           // Set permissions array
// // //           if (userData.permissions && Array.isArray(userData.permissions)) {
// // //             setUserPermissions(userData.permissions);
// // //           } else {
// // //             setUserPermissions([]);
// // //           }
// // //         }
// // //       } catch (err) {
// // //         console.error('Error fetching user permissions:', err);
// // //         setUserPermissions([]);
// // //       } finally {
// // //         setPermissionsLoaded(true);
// // //       }
// // //     };
    
// // //     fetchUserPermissions();
// // //   }, []);

// // //   // Check permission helper
// // //   const checkPermission = (action) => {
// // //     // Super admin has all permissions
// // //     if (isSuperAdmin) return true;
    
// // //     return hasPermission(
// // //       userPermissions,
// // //       MODULES.TRAINING_MASTER,
// // //       PAGES.TRAINING_RECORDS,
// // //       action
// // //     );
// // //   };

// // //   // Permission checks
// // //   const canViewPage = checkPermission(ACTIONS.VIEW);
// // //   const canCreate = checkPermission(ACTIONS.CREATE);
// // //   const canUpdate = checkPermission(ACTIONS.UPDATE);
// // //   const canDelete = checkPermission(ACTIONS.DELETE);

// // //   // Debounce search
// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       setSearchTerm(searchInput);
// // //       setPage(0);
// // //     }, 500);

// // //     return () => clearTimeout(timer);
// // //   }, [searchInput]);

// // //   // Fetch data when mode changes - only if user has permission
// // //   useEffect(() => {
// // //     if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
// // //       fetchEmployees();
// // //       if (mode === 'add') {
// // //         fetchTrainings();
// // //       } else {
// // //         fetchAssignedTrainings();
// // //       }
// // //     }
// // //     // Reset selections when mode changes
// // //     setSelected([]);
// // //     setPage(0);
// // //     setSearchInput('');
// // //     setSearchTerm('');
// // //   }, [mode, permissionsLoaded, canViewPage, isSuperAdmin]);

// // //   const fetchTrainings = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('token');
      
// // //       const response = await axios.get(`${BASE_URL}/api/trainings/all`, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`
// // //         }
// // //       });

// // //       let list = [];
// // //       if (response.data.success) {
// // //         if (Array.isArray(response.data.data)) {
// // //           list = response.data.data;
// // //         } else if (response.data.data?.data) {
// // //           list = response.data.data.data;
// // //         }
// // //       }
      
// // //       const formattedData = list.map(item => ({
// // //         ...item,
// // //         trainingName: item.trainingName || item.name || '',
// // //         provider: item.provider || '',
// // //         startDate: item.startDate || '',
// // //         endDate: item.endDate || '',
// // //         status: item.status || 'pending'
// // //       }));
      
// // //       setTrainings(formattedData);
// // //       setFilteredData(formattedData);
// // //     } catch (err) {
// // //       console.error('Error fetching trainings:', err);
// // //       showNotification('Failed to load trainings. Please try again.', 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
  
// // //   const fetchAssignedTrainings = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('token');
      
// // //       const response = await axios.get(`${BASE_URL}/api/trainings/assigned`, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`
// // //         }
// // //       });

// // //       let list = [];
// // //       if (response.data.success) {
// // //         if (Array.isArray(response.data.data)) {
// // //           list = response.data.data;
// // //         } else if (response.data.data?.data) {
// // //           list = response.data.data.data;
// // //         }
// // //       }
      
// // //       const formattedData = list.map(item => ({
// // //         ...item,
// // //         employeeName: item.employeeName || item.employee?.name || '',
// // //         trainingName: item.trainingName || item.training?.trainingName || '',
// // //         startDate: item.startDate || item.training?.startDate || '',
// // //         endDate: item.endDate || item.training?.endDate || '',
// // //         status: item.status || 'pending',
// // //         score: item.score || 0
// // //       }));
      
// // //       setAssignedTrainings(formattedData);
// // //       setFilteredData(formattedData);
// // //     } catch (err) {
// // //       console.error('Error fetching assigned trainings:', err);
// // //       showNotification('Failed to load assigned trainings. Please try again.', 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
  
// // //   const fetchEmployees = async () => {
// // //     try {
// // //       const token = localStorage.getItem('token');
      
// // //       const response = await axios.get(`${BASE_URL}/api/employees`, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`
// // //         }
// // //       });

// // //       let list = [];
// // //       if (response.data.success) {
// // //         if (Array.isArray(response.data.data)) {
// // //           list = response.data.data;
// // //         } else if (response.data.data?.data) {
// // //           list = response.data.data.data;
// // //         }
// // //       }
      
// // //       setEmployees(list);
// // //     } catch (err) {
// // //       console.error('Error fetching employees:', err);
// // //     }
// // //   };
  
// // //   // Handle refresh
// // //   const handleRefresh = () => {
// // //     if (mode === 'add') {
// // //       fetchTrainings();
// // //     } else {
// // //       fetchAssignedTrainings();
// // //     }
// // //     showNotification('Data refreshed', 'success');
// // //   };
  
// // //   // Handle mode change
// // //   const handleModeChange = (event, newMode) => {
// // //     if (newMode !== null) {
// // //       setMode(newMode);
// // //     }
// // //   };
  
// // //   // Handle search (client-side filtering)
// // //   const handleSearch = () => {
// // //     const currentData = mode === 'add' ? trainings : assignedTrainings;
    
// // //     if (!searchTerm) {
// // //       setFilteredData(currentData);
// // //       return;
// // //     }
    
// // //     const value = searchTerm.toLowerCase();
// // //     const filtered = currentData.filter(item => {
// // //       if (mode === 'add') {
// // //         return (
// // //           (item.trainingName?.toLowerCase().includes(value)) ||
// // //           (item.provider?.toLowerCase().includes(value))
// // //         );
// // //       } else {
// // //         return (
// // //           (item.employeeName?.toLowerCase().includes(value)) ||
// // //           (item.trainingName?.toLowerCase().includes(value))
// // //         );
// // //       }
// // //     });
    
// // //     setFilteredData(filtered);
// // //   };

// // //   // Apply search when searchTerm or data changes
// // //   useEffect(() => {
// // //     handleSearch();
// // //   }, [searchTerm, trainings, assignedTrainings, mode]);
  
// // //   // Handle select all - only if user has delete permission
// // //   const handleSelectAll = (event) => {
// // //     if (!canDelete || mode !== 'add') return;
    
// // //     if (event.target.checked) {
// // //       setSelected(filteredData.map(item => item._id));
// // //     } else {
// // //       setSelected([]);
// // //     }
// // //   };
  
// // //   // Handle single selection - only if user has delete permission
// // //   const handleSelect = (id) => {
// // //     if (!canDelete || mode !== 'add') return;
    
// // //     const selectedIndex = selected.indexOf(id);
// // //     let newSelected = [];
    
// // //     if (selectedIndex === -1) {
// // //       newSelected = newSelected.concat(selected, id);
// // //     } else {
// // //       newSelected = selected.filter(item => item !== id);
// // //     }
    
// // //     setSelected(newSelected);
// // //   };
  
// // //   // Handle page change
// // //   const handleChangePage = (event, newPage) => {
// // //     setPage(newPage);
// // //     setSelected([]);
// // //   };
  
// // //   // Handle rows per page change
// // //   const handleChangeRowsPerPage = (event) => {
// // //     setRowsPerPage(parseInt(event.target.value, 10));
// // //     setPage(0);
// // //     setSelected([]);
// // //   };
  
// // //   // Handle add training - INSTANT UPDATE
// // //   const handleAddTraining = (newTrainingFromBackend) => {
// // //     const formattedItem = {
// // //       ...newTrainingFromBackend,
// // //       _id: newTrainingFromBackend._id,
// // //       trainingName: newTrainingFromBackend.trainingName || newTrainingFromBackend.name || '',
// // //       provider: newTrainingFromBackend.provider || '',
// // //       startDate: newTrainingFromBackend.startDate || '',
// // //       endDate: newTrainingFromBackend.endDate || '',
// // //       status: newTrainingFromBackend.status || 'pending'
// // //     };

// // //     // Add instantly to table (top position)
// // //     setTrainings((prev) => [formattedItem, ...prev]);
// // //     setFilteredData((prev) => [formattedItem, ...prev]);
// // //     setPage(0);

// // //     showNotification('Training added successfully!', 'success');
// // //   };
  
// // //   // Handle edit training - INSTANT UPDATE
// // //   const handleEditTraining = (updatedTrainingFromBackend) => {
// // //     const formattedItem = {
// // //       ...updatedTrainingFromBackend,
// // //       _id: updatedTrainingFromBackend._id,
// // //       trainingName: updatedTrainingFromBackend.trainingName || updatedTrainingFromBackend.name || '',
// // //       provider: updatedTrainingFromBackend.provider || '',
// // //       startDate: updatedTrainingFromBackend.startDate || '',
// // //       endDate: updatedTrainingFromBackend.endDate || '',
// // //       status: updatedTrainingFromBackend.status || 'pending'
// // //     };

// // //     // Update main data
// // //     setTrainings((prev) =>
// // //       prev.map((item) =>
// // //         item._id === formattedItem._id ? formattedItem : item
// // //       )
// // //     );

// // //     // Update filtered data
// // //     setFilteredData((prev) =>
// // //       prev.map((item) =>
// // //         item._id === formattedItem._id ? formattedItem : item
// // //       )
// // //     );

// // //     showNotification('Training updated successfully!', 'success');
// // //   };
  
// // //   // Handle delete training - INSTANT UPDATE
// // //   const handleDeleteTraining = (itemId) => {
// // //     // Remove from data array
// // //     const updatedData = trainings.filter(item => item._id !== itemId);
// // //     setTrainings(updatedData);
    
// // //     // Remove from selected if present
// // //     setSelected(selected.filter(id => id !== itemId));
    
// // //     showNotification('Training deleted successfully!', 'success');
// // //   };
  
// // //   // Handle assign training
// // //   const handleAssignTraining = () => {
// // //     fetchAssignedTrainings();
// // //     showNotification('Training assigned successfully!', 'success');
// // //   };
  
// // //   // Handle complete training
// // //   const handleCompleteTraining = async (training) => {
// // //     try {
// // //       const token = localStorage.getItem('token');
      
// // //       await axios.post(
// // //         `${BASE_URL}/api/trainings/complete`,
// // //         { recordId: training._id, score: 100 },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
      
// // //       showNotification('Training marked as completed!', 'success');
// // //       fetchAssignedTrainings();
// // //     } catch (err) {
// // //       console.error('Error completing training:', err);
// // //       showNotification('Failed to mark training as completed', 'error');
// // //     }
// // //   };
  
// // //   // Handle bulk delete
// // //   const handleBulkDelete = () => {
// // //     if (!canDelete) return;
// // //     showNotification('Bulk delete requires API implementation', 'warning');
// // //   };
  
// // //   // Action menu handlers
// // //   const handleActionMenuOpen = (event, item) => {
// // //     setActionMenuAnchor(event.currentTarget);
// // //     setSelectedItemForAction(item);
// // //   };

// // //   const handleActionMenuClose = () => {
// // //     setActionMenuAnchor(null);
// // //     setSelectedItemForAction(null);
// // //   };
  
// // //   // Open edit modal
// // //   const openEditModalHandler = (item) => {
// // //     if (!canUpdate) return;
// // //     setSelectedItem(item);
// // //     setOpenEditModal(true);
// // //     handleActionMenuClose();
// // //   };
  
// // //   // Open view modal
// // //   const openViewModalHandler = (item) => {
// // //     if (!canViewPage) return;
// // //     setSelectedItem(item);
// // //     setOpenViewModal(true);
// // //     handleActionMenuClose();
// // //   };
  
// // //   // Open delete confirmation
// // //   const openDeleteDialogHandler = (item) => {
// // //     if (!canDelete) return;
// // //     setSelectedItem(item);
// // //     setOpenDeleteDialog(true);
// // //     handleActionMenuClose();
// // //   };
  
// // //   // Open complete training
// // //   const openCompleteTrainingHandler = (item) => {
// // //     if (!canCreate) return;
// // //     handleCompleteTraining(item);
// // //     handleActionMenuClose();
// // //   };
  
// // //   // Show notification
// // //   const showNotification = (message, severity) => {
// // //     setSnackbar({
// // //       open: true,
// // //       message,
// // //       severity
// // //     });
// // //   };
  
// // //   // Format date
// // //   const formatDate = (dateString) => {
// // //     if (!dateString) return '-';
// // //     return new Date(dateString).toLocaleDateString('en-US', {
// // //       year: 'numeric',
// // //       month: 'short',
// // //       day: 'numeric'
// // //     });
// // //   };
  
// // //   // Get status chip color
// // //   const getStatusChipColor = (status) => {
// // //     switch (status?.toLowerCase()) {
// // //       case 'completed':
// // //         return { bgcolor: COLORS.chips.completed, color: COLORS.primary };
// // //       case 'in progress':
// // //         return { bgcolor: COLORS.chips.inProgress, color: '#0F67B0' };
// // //       case 'cancelled':
// // //         return { bgcolor: COLORS.chips.cancelled, color: '#DC2626' };
// // //       default:
// // //         return { bgcolor: COLORS.chips.pending, color: '#B45309' };
// // //     }
// // //   };
  
// // //   // Get item initials for avatar
// // //   const getItemInitials = (itemName) => {
// // //     if (!itemName) return mode === 'add' ? 'T' : 'A';
    
// // //     const words = itemName.split(' ');
// // //     if (words.length >= 2) {
// // //       return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
// // //     }
    
// // //     return itemName.substring(0, 2).toUpperCase();
// // //   };
  
// // //   // Get avatar color based on item name
// // //   const getAvatarColor = (itemName) => {
// // //     if (!itemName) return COLORS.primary;
    
// // //     const colors = [
// // //       COLORS.primary,
// // //       COLORS.primaryDark,
// // //       '#074346',
// // //       '#0D696C',
// // //       '#128C7E'
// // //     ];
    
// // //     const charCode = itemName.charCodeAt(0) || 0;
// // //     return colors[charCode % colors.length];
// // //   };
  
// // //   // Get current data based on mode
// // //   const currentData = mode === 'add' ? trainings : assignedTrainings;
  
// // //   // Paginated data
// // //   const paginatedData = filteredData.slice(
// // //     page * rowsPerPage,
// // //     page * rowsPerPage + rowsPerPage
// // //   );

// // //   // Show loading state while permissions are being fetched
// // //   if (!permissionsLoaded) {
// // //     return <LoadingState />;
// // //   }

// // //   // If user doesn't have view permission, show access denied
// // //   if (!canViewPage && !isSuperAdmin) {
// // //     return <AccessDenied />;
// // //   }

// // //   return (
// // //     <Box sx={{ p: 2.5 }}>
// // //       {/* Mode Toggle */}
// // //       <Box sx={{ mb: 2.5 }}>
// // //         <ToggleButtonGroup
// // //           value={mode}
// // //           exclusive
// // //           onChange={handleModeChange}
// // //           sx={{
// // //             '& .MuiToggleButton-root': {
// // //               height: 36,
// // //               px: 3,
// // //               textTransform: 'none',
// // //               fontWeight: 500,
// // //               fontSize: '0.75rem',
// // //               borderColor: COLORS.border,
// // //               color: COLORS.text.secondary,
// // //               '&.Mui-selected': {
// // //                 bgcolor: COLORS.primary,
// // //                 color: COLORS.text.light,
// // //                 '&:hover': {
// // //                   bgcolor: COLORS.primaryDark,
// // //                 }
// // //               }
// // //             }
// // //           }}
// // //         >
// // //           <ToggleButton value="add">
// // //             <SchoolIcon sx={{ fontSize: '1rem', mr: 1 }} />
// // //             Training Master
// // //           </ToggleButton>
// // //           <ToggleButton value="assign">
// // //             <AssignmentIcon sx={{ fontSize: '1rem', mr: 1 }} />
// // //             Assigned Trainings
// // //           </ToggleButton>
// // //         </ToggleButtonGroup>
// // //       </Box>

// // //       {/* Page Header */}
// // //       <Box sx={{ mb: 2.5 }}>
// // //         <Typography 
// // //           variant="h5" 
// // //           component="h1" 
// // //           sx={{ 
// // //             fontSize: '1.25rem',
// // //             fontWeight: 700,
// // //             color: COLORS.text.primary,
// // //             mb: 0.5
// // //           }}
// // //         >
// // //           {mode === 'add' ? 'Training Master' : 'Assigned Trainings'}
// // //         </Typography>
// // //         <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
// // //           {mode === 'add' 
// // //             ? 'Manage and organize training programs and courses' 
// // //             : 'View and manage training assignments to employees'}
// // //         </Typography>
// // //       </Box>

// // //       {/* Action Bar */}
// // //       <Paper sx={{ 
// // //         p: 1.5, 
// // //         mb: 2.5, 
// // //         borderRadius: 2,
// // //         bgcolor: COLORS.background.white,
// // //         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// // //         border: `1px solid ${COLORS.border}`
// // //       }}>
// // //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
// // //           {/* Search */}
// // //           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
// // //             <TextField
// // //               placeholder={`Search ${mode === 'add' ? 'trainings' : 'assigned trainings'}...`}
// // //               size="small"
// // //               value={searchInput}
// // //               onChange={(e) => setSearchInput(e.target.value)}
// // //               sx={{ 
// // //                 width: { xs: '100%', sm: 360 },
// // //                 '& .MuiOutlinedInput-root': {
// // //                   borderRadius: 1.5,
// // //                   fontSize: '0.75rem',
// // //                   '&:hover fieldset': {
// // //                     borderColor: COLORS.primary,
// // //                   },
// // //                 }
// // //               }}
// // //               InputProps={{
// // //                 startAdornment: (
// // //                   <InputAdornment position="start">
// // //                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
// // //                   </InputAdornment>
// // //                 ),
// // //                 sx: { 
// // //                   height: 36,
// // //                   bgcolor: COLORS.background.light,
// // //                   '& input': {
// // //                     padding: '6px 12px',
// // //                     fontSize: '0.75rem',
// // //                     color: COLORS.text.primary,
// // //                     '&::placeholder': {
// // //                       color: COLORS.text.tertiary,
// // //                       fontSize: '0.75rem'
// // //                     }
// // //                   }
// // //                 }
// // //               }}
// // //               disabled={loading}
// // //             />
            
// // //             {/* Refresh Button */}
// // //             {/* <Tooltip title="Refresh">
// // //               <IconButton
// // //                 onClick={handleRefresh}
// // //                 disabled={loading}
// // //                 sx={{
// // //                   color: COLORS.primary,
// // //                   '&:hover': {
// // //                     bgcolor: `${COLORS.primary}10`
// // //                   }
// // //                 }}
// // //               >
// // //                 <RefreshIcon sx={{ fontSize: '1.1rem' }} />
// // //               </IconButton>
// // //             </Tooltip> */}
// // //           </Stack>

// // //           {/* Action Buttons - Conditionally rendered based on permissions */}
// // //           <Stack direction="row" spacing={1.5} alignItems="center">
// // //             {/* Bulk Delete Button - Only show if user has delete permission and in add mode */}
// // //             {mode === 'add' && canDelete && selected.length > 0 && (
// // //               <Button
// // //                 variant="outlined"
// // //                 color="error"
// // //                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
// // //                 onClick={handleBulkDelete}
// // //                 sx={{ 
// // //                   height: 36,
// // //                   borderRadius: 1.5,
// // //                   textTransform: 'none',
// // //                   fontSize: '0.75rem',
// // //                   fontWeight: 500,
// // //                   borderColor: '#fee2e2',
// // //                   color: '#991b1b',
// // //                   '&:hover': {
// // //                     borderColor: '#fecaca',
// // //                     bgcolor: '#fee2e2'
// // //                   }
// // //                 }}
// // //                 disabled={loading}
// // //               >
// // //                 Delete ({selected.length})
// // //               </Button>
// // //             )}
            
// // //             {/* Add Button - Only show if user has create permission and in add mode */}
// // //             {mode === 'add' && canCreate && (
// // //               <Button
// // //                 variant="contained"
// // //                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
// // //                 onClick={() => setOpenAddModal(true)}
// // //                 sx={{
// // //                   height: 36,
// // //                   borderRadius: 1.5,
// // //                   bgcolor: COLORS.primary,
// // //                   fontSize: '0.75rem',
// // //                   fontWeight: 500,
// // //                   textTransform: 'none',
// // //                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
// // //                   '&:hover': {
// // //                     bgcolor: COLORS.primaryDark,
// // //                   }
// // //                 }}
// // //                 disabled={loading}
// // //               >
// // //                 Add Training
// // //               </Button>
// // //             )}
            
// // //             {/* Assign Button - Only show if user has create permission and in assign mode */}
// // //             {mode === 'assign' && canCreate && (
// // //               <Button
// // //                 variant="contained"
// // //                 startIcon={<AssignmentIcon sx={{ fontSize: '1rem' }} />}
// // //                 onClick={() => setOpenAssignModal(true)}
// // //                 sx={{
// // //                   height: 36,
// // //                   borderRadius: 1.5,
// // //                   bgcolor: COLORS.primary,
// // //                   fontSize: '0.75rem',
// // //                   fontWeight: 500,
// // //                   textTransform: 'none',
// // //                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
// // //                   '&:hover': {
// // //                     bgcolor: COLORS.primaryDark,
// // //                   }
// // //                 }}
// // //                 disabled={loading}
// // //               >
// // //                 Assign Training
// // //               </Button>
// // //             )}
// // //           </Stack>
// // //         </Stack>
// // //       </Paper>

// // //       {/* Data Table */}
// // //       <Paper sx={{ 
// // //         width: '100%', 
// // //         borderRadius: 2, 
// // //         overflow: 'hidden',
// // //         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// // //         border: `1px solid ${COLORS.border}`
// // //       }}>
// // //         <TableContainer>
// // //           <Table size="small">
// // //             <TableHead>
// // //               <TableRow sx={{ 
// // //                 bgcolor: COLORS.background.tableHeader,
// // //                 '& .MuiTableCell-root': {
// // //                   borderBottom: 'none',
// // //                   color: COLORS.text.light,
// // //                   py: 1.5
// // //                 }
// // //               }}>
// // //                 {/* Checkbox Column - Only show if user has delete permission and in add mode */}
// // //                 {mode === 'add' && canDelete && (
// // //                   <TableCell padding="checkbox" sx={{ width: 40 }}>
// // //                     <Checkbox
// // //                       indeterminate={selected.length > 0 && selected.length < filteredData.length}
// // //                       checked={filteredData.length > 0 && selected.length === filteredData.length}
// // //                       onChange={handleSelectAll}
// // //                       sx={{
// // //                         color: COLORS.text.light,
// // //                         '&.Mui-checked': {
// // //                           color: COLORS.text.light,
// // //                         },
// // //                         '&.MuiCheckbox-indeterminate': {
// // //                           color: COLORS.text.light,
// // //                         },
// // //                         '& .MuiSvgIcon-root': {
// // //                           fontSize: '1.25rem'
// // //                         }
// // //                       }}
// // //                       disabled={loading || filteredData.length === 0}
// // //                     />
// // //                   </TableCell>
// // //                 )}
                
// // //                 {mode === 'add' ? (
// // //                   <>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       Training
// // //                     </TableCell>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       Provider
// // //                     </TableCell>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       Start Date
// // //                     </TableCell>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       End Date
// // //                     </TableCell>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       Status
// // //                     </TableCell>
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       Employee
// // //                     </TableCell>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       Training
// // //                     </TableCell>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       Start Date
// // //                     </TableCell>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       End Date
// // //                     </TableCell>
// // //                     <TableCell sx={{ 
// // //                       fontWeight: 600, 
// // //                       fontSize: '0.7rem',
// // //                       letterSpacing: '0.5px',
// // //                       color: COLORS.text.light
// // //                     }}>
// // //                       Status
// // //                     </TableCell>
// // //                   </>
// // //                 )}
// // //                 <TableCell sx={{ 
// // //                   fontWeight: 600, 
// // //                   fontSize: '0.7rem',
// // //                   letterSpacing: '0.5px',
// // //                   width: 60,
// // //                   color: COLORS.text.light
// // //                 }} align="center">
// // //                   Actions
// // //                 </TableCell>
// // //               </TableRow>
// // //             </TableHead>
// // //             <TableBody>
// // //               {loading ? (
// // //                 <TableRow>
// // //                   <TableCell colSpan={mode === 'add' ? (canDelete ? 7 : 6) : 6} align="center" sx={{ py: 6 }}>
// // //                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
// // //                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
// // //                       Loading {mode === 'add' ? 'trainings' : 'assigned trainings'}...
// // //                     </Typography>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ) : paginatedData.length === 0 ? (
// // //                 <TableRow>
// // //                   <TableCell colSpan={mode === 'add' ? (canDelete ? 7 : 6) : 6} align="center" sx={{ py: 6 }}>
// // //                     <Box sx={{ textAlign: 'center' }}>
// // //                       <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
// // //                         {searchTerm ? 'No items found' : `No ${mode === 'add' ? 'trainings' : 'assigned trainings'} available`}
// // //                       </Typography>
// // //                       <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
// // //                         {searchTerm ? 'Try adjusting your search terms' : mode === 'add' ? 'Add your first training to get started' : 'Assign training to employees to get started'}
// // //                       </Typography>
// // //                     </Box>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ) : (
// // //                 paginatedData.map((item, index) => {
// // //                   const isSelected = selected.includes(item._id);
// // //                   const isActionMenuOpen = Boolean(actionMenuAnchor) && 
// // //                     selectedItemForAction?._id === item._id;
// // //                   const avatarColor = getAvatarColor(mode === 'add' ? item.trainingName : item.employeeName);
// // //                   const statusColors = getStatusChipColor(item.status);

// // //                   return (
// // //                     <TableRow
// // //                       key={item._id || index}
// // //                       hover
// // //                       selected={isSelected}
// // //                       sx={{ 
// // //                         bgcolor: COLORS.background.white,
// // //                         '&:hover': {
// // //                           bgcolor: COLORS.background.hover
// // //                         },
// // //                         '&.Mui-selected': {
// // //                           bgcolor: `${COLORS.primary}10`,
// // //                           '&:hover': {
// // //                             bgcolor: `${COLORS.primary}20`
// // //                           }
// // //                         },
// // //                         '& .MuiTableCell-root': {
// // //                           py: 1.5,
// // //                           fontSize: '0.75rem',
// // //                           borderColor: COLORS.border
// // //                         }
// // //                       }}
// // //                     >
// // //                       {/* Checkbox Column - Only show if user has delete permission and in add mode */}
// // //                       {mode === 'add' && canDelete && (
// // //                         <TableCell padding="checkbox" sx={{ width: 40 }}>
// // //                           <Checkbox
// // //                             checked={isSelected}
// // //                             onChange={() => handleSelect(item._id)}
// // //                             sx={{
// // //                               color: COLORS.primary,
// // //                               '&.Mui-checked': {
// // //                                 color: COLORS.primary,
// // //                               },
// // //                               '& .MuiSvgIcon-root': {
// // //                                 fontSize: '1.25rem'
// // //                               }
// // //                             }}
// // //                           />
// // //                         </TableCell>
// // //                       )}
                      
// // //                       {mode === 'add' ? (
// // //                         <>
// // //                           <TableCell>
// // //                             <Stack direction="row" spacing={1.5} alignItems="center">
// // //                               <Avatar 
// // //                                 sx={{ 
// // //                                   width: 32, 
// // //                                   height: 32, 
// // //                                   bgcolor: avatarColor,
// // //                                   fontSize: '0.7rem',
// // //                                   fontWeight: 600
// // //                                 }}
// // //                               >
// // //                                 {getItemInitials(item.trainingName)}
// // //                               </Avatar>
// // //                               <Box>
// // //                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
// // //                                   {item.trainingName}
// // //                                 </Typography>
// // //                                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
// // //                                   ID: {item._id?.slice(-6) || 'N/A'}
// // //                                 </Typography>
// // //                               </Box>
// // //                             </Stack>
// // //                           </TableCell>
// // //                           <TableCell>
// // //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// // //                               {item.provider || '-'}
// // //                             </Typography>
// // //                           </TableCell>
// // //                           <TableCell>
// // //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// // //                               {formatDate(item.startDate)}
// // //                             </Typography>
// // //                           </TableCell>
// // //                           <TableCell>
// // //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// // //                               {formatDate(item.endDate)}
// // //                             </Typography>
// // //                           </TableCell>
// // //                           <TableCell>
// // //                             <Chip
// // //                               label={item.status || 'Pending'}
// // //                               size="small"
// // //                               sx={{ 
// // //                                 fontSize: '0.65rem',
// // //                                 fontWeight: 500,
// // //                                 bgcolor: statusColors.bgcolor,
// // //                                 color: statusColors.color,
// // //                                 height: 20
// // //                               }}
// // //                             />
// // //                           </TableCell>
// // //                         </>
// // //                       ) : (
// // //                         <>
// // //                           <TableCell>
// // //                             <Stack direction="row" spacing={1.5} alignItems="center">
// // //                               <Avatar 
// // //                                 sx={{ 
// // //                                   width: 32, 
// // //                                   height: 32, 
// // //                                   bgcolor: avatarColor,
// // //                                   fontSize: '0.7rem',
// // //                                   fontWeight: 600
// // //                                 }}
// // //                               >
// // //                                 {getItemInitials(item.employeeName)}
// // //                               </Avatar>
// // //                               <Box>
// // //                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
// // //                                   {item.employeeName}
// // //                                 </Typography>
// // //                                 {item.score > 0 && (
// // //                                   <Typography sx={{ fontSize: '0.65rem', color: COLORS.primary }}>
// // //                                     Score: {item.score}%
// // //                                   </Typography>
// // //                                 )}
// // //                               </Box>
// // //                             </Stack>
// // //                           </TableCell>
// // //                           <TableCell>
// // //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// // //                               {item.trainingName}
// // //                             </Typography>
// // //                           </TableCell>
// // //                           <TableCell>
// // //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// // //                               {formatDate(item.startDate)}
// // //                             </Typography>
// // //                           </TableCell>
// // //                           <TableCell>
// // //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// // //                               {formatDate(item.endDate)}
// // //                             </Typography>
// // //                           </TableCell>
// // //                           <TableCell>
// // //                             <Chip
// // //                               label={item.status || 'Pending'}
// // //                               size="small"
// // //                               sx={{ 
// // //                                 fontSize: '0.65rem',
// // //                                 fontWeight: 500,
// // //                                 bgcolor: statusColors.bgcolor,
// // //                                 color: statusColors.color,
// // //                                 height: 20
// // //                               }}
// // //                             />
// // //                           </TableCell>
// // //                         </>
// // //                       )}
// // //                       <TableCell align="center" sx={{ width: 60 }}>
// // //                         <ActionMenu 
// // //                           item={item}
// // //                           onView={openViewModalHandler}
// // //                           onEdit={openEditModalHandler}
// // //                           onDelete={openDeleteDialogHandler}
// // //                           onComplete={openCompleteTrainingHandler}
// // //                           anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
// // //                           onClose={handleActionMenuClose}
// // //                           onOpen={(e) => handleActionMenuOpen(e, item)}
// // //                           permissions={userPermissions}
// // //                           mode={mode}
// // //                         />
// // //                       </TableCell>
// // //                     </TableRow>
// // //                   );
// // //                 })
// // //               )}
// // //             </TableBody>
// // //           </Table>
// // //         </TableContainer>

// // //         {/* Pagination */}
// // //         <TablePagination
// // //           rowsPerPageOptions={[5, 10, 25, 50]}
// // //           component="div"
// // //           count={filteredData.length}
// // //           rowsPerPage={rowsPerPage}
// // //           page={page}
// // //           onPageChange={handleChangePage}
// // //           onRowsPerPageChange={handleChangeRowsPerPage}
// // //           sx={{
// // //             borderTop: `1px solid ${COLORS.border}`,
// // //             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
// // //               fontSize: '0.7rem',
// // //               color: COLORS.text.secondary
// // //             },
// // //             '& .MuiTablePagination-select': {
// // //               fontSize: '0.7rem'
// // //             },
// // //             '& .MuiTablePagination-actions button': {
// // //               color: COLORS.primary,
// // //             }
// // //           }}
// // //         />
// // //       </Paper>

// // //       {/* Modal Components */}
// // //       {mode === 'add' && (
// // //         <>
// // //           {canCreate && (
// // //             <AddTraining 
// // //               open={openAddModal}
// // //               onClose={() => setOpenAddModal(false)}
// // //               onAdd={handleAddTraining}
// // //             />
// // //           )}

// // //           {selectedItem && (
// // //             <>
// // //               {canUpdate && (
// // //                 <EditTraining 
// // //                   open={openEditModal}
// // //                   onClose={() => {
// // //                     setOpenEditModal(false);
// // //                     setSelectedItem(null);
// // //                   }}
// // //                   training={selectedItem}
// // //                   onUpdate={handleEditTraining}
// // //                 />
// // //               )}

// // //               {canViewPage && (
// // //                 <ViewTraining 
// // //                   open={openViewModal}
// // //                   onClose={() => {
// // //                     setOpenViewModal(false);
// // //                     setSelectedItem(null);
// // //                   }}
// // //                   training={selectedItem}
// // //                   onEdit={() => {
// // //                     if (canUpdate) {
// // //                       setOpenViewModal(false);
// // //                       setOpenEditModal(true);
// // //                     }
// // //                   }}
// // //                 />
// // //               )}

// // //               {canDelete && (
// // //                 <DeleteTraining 
// // //                   open={openDeleteDialog}
// // //                   onClose={() => {
// // //                     setOpenDeleteDialog(false);
// // //                     setSelectedItem(null);
// // //                   }}
// // //                   training={selectedItem}
// // //                   onDelete={handleDeleteTraining}
// // //                 />
// // //               )}
// // //             </>
// // //           )}
// // //         </>
// // //       )}

// // //       {mode === 'assign' && canCreate && (
// // //         <AssignTraining 
// // //           open={openAssignModal}
// // //           onClose={() => setOpenAssignModal(false)}
// // //           trainings={trainings}
// // //           employees={employees}
// // //           onAssign={handleAssignTraining}
// // //         />
// // //       )}

// // //       {/* Snackbar Notification */}
// // //       <Snackbar
// // //         open={snackbar.open}
// // //         autoHideDuration={3000}
// // //         onClose={() => setSnackbar({...snackbar, open: false})}
// // //         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// // //       >
// // //         <Alert 
// // //           onClose={() => setSnackbar({...snackbar, open: false})} 
// // //           severity={snackbar.severity}
// // //           variant="filled"
// // //           sx={{ 
// // //             width: '100%',
// // //             borderRadius: 1.5,
// // //             fontSize: '0.75rem',
// // //             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
// // //             '& .MuiAlert-icon': {
// // //               fontSize: '1.25rem'
// // //             }
// // //           }}
// // //         >
// // //           {snackbar.message}
// // //         </Alert>
// // //       </Snackbar>
// // //     </Box>
// // //   );
// // // };

// // // export default TrainingRecordMaster;


// // import React, { useState, useEffect } from 'react';
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
// //   Tooltip,
// //   Typography,
// //   Snackbar,
// //   TablePagination,
// //   Checkbox,
// //   Stack,
// //   Chip,
// //   Avatar,
// //   Menu,
// //   MenuItem,
// //   ListItemIcon,
// //   ListItemText,
// //   Divider,
// //   Alert,
// //   CircularProgress,
// //   ToggleButton,
// //   ToggleButtonGroup
// // } from '@mui/material';
// // import {
// //   Search as SearchIcon,
// //   Add as AddIcon,
// //   Delete as DeleteIcon,
// //   Visibility as ViewIcon,
// //   Edit as EditIcon,
// //   MoreVert as MoreVertIcon,
// //   Refresh as RefreshIcon,
// //   School as SchoolIcon,
// //   Assignment as AssignmentIcon,
// //   CheckCircle as CheckCircleIcon,
// //   Download as DownloadIcon
// // } from '@mui/icons-material';
// // import axios from 'axios';
// // import BASE_URL from '../../../config/Config';
// // import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// // // Import modal components
// // import AddTraining from './AddTraining';
// // import EditTraining from './EditTraining';
// // import ViewTraining from './ViewTraining';
// // import DeleteTraining from './DeleteTraining';
// // import AssignTraining from './AssignTraining';

// // // Color constants - Same as LeaveTypeMaster
// // const COLORS = {
// //   primary: '#063C3F',
// //   primaryLight: '#E8F0F1',
// //   primaryDark: '#05292B',
// //   text: {
// //     primary: '#151C26',
// //     secondary: '#4B5568',
// //     tertiary: '#94A3B8',
// //     light: '#FFFFFF',
// //     lightMuted: 'rgba(255, 255, 255, 0.9)'
// //   },
// //   background: {
// //     white: '#FFFFFF',
// //     light: '#F8FFFC',
// //     hover: '#F0FDF9',
// //     tableHeader: '#063C3F'
// //   },
// //   border: '#E3E8EF',
// //   chips: {
// //     active: '#9FE2BF',
// //     inactive: '#F1F5F9',
// //     completed: '#9FE2BF',
// //     pending: '#FEF3C7',
// //     inProgress: '#E0F2FE',
// //     cancelled: '#FEE2E2'
// //   }
// // };

// // // Loading state component
// // const LoadingState = () => (
// //   <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
// //     <CircularProgress size={40} sx={{ color: COLORS.primary }} />
// //   </Box>
// // );

// // // Access Denied component
// // const AccessDenied = () => (
// //   <Box sx={{ p: 4, textAlign: 'center' }}>
// //     <Typography variant="h6" color="error" sx={{ mb: 2 }}>
// //       Access Denied
// //     </Typography>
// //     <Typography variant="body2" color="text.secondary">
// //       You don't have permission to view this page. Please contact your administrator.
// //     </Typography>
// //   </Box>
// // );

// // // Action Menu Component with permission checks
// // const ActionMenu = ({ item, onView, onEdit, onDelete, onComplete, anchorEl, onClose, onOpen, permissions, mode }) => {
// //   const moduleKey = MODULES.TRAINING_MASTER;
// //   const pageKey = PAGES.TRAINING_RECORDS;
  
// //   const canView = hasPermission(permissions, moduleKey, pageKey, ACTIONS.VIEW);
// //   const canUpdate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.UPDATE);
// //   const canDelete = hasPermission(permissions, moduleKey, pageKey, ACTIONS.DELETE);
// //   const canCreate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.CREATE);

// //   // If no actions available, don't render the menu
// //   if (!canView && !canUpdate && !canDelete && !(mode === 'assign' && canCreate)) {
// //     return null;
// //   }

// //   return (
// //     <>
// //       <Tooltip title="Actions">
// //         <IconButton
// //           size="small"
// //           onClick={onOpen}
// //           sx={{
// //             color: COLORS.text.secondary,
// //             '&:hover': {
// //               bgcolor: `${COLORS.primary}20`
// //             }
// //           }}
// //         >
// //           <MoreVertIcon fontSize="small" />
// //         </IconButton>
// //       </Tooltip>
// //       <Menu
// //         anchorEl={anchorEl}
// //         open={Boolean(anchorEl)}
// //         onClose={onClose}
// //         PaperProps={{
// //           elevation: 3,
// //           sx: {
// //             mt: 1,
// //             minWidth: 180,
// //             borderRadius: 2,
// //             border: `1px solid ${COLORS.border}`,
// //             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
// //           }
// //         }}
// //       >
// //         {mode === 'add' ? (
// //           <>
// //             {canView && (
// //               <MenuItem 
// //                 onClick={() => {
// //                   onView(item);
// //                   onClose();
// //                 }}
// //                 sx={{ py: 1.5 }}
// //               >
// //                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// //                   <ViewIcon fontSize="small" />
// //                 </ListItemIcon>
// //                 <ListItemText>
// //                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// //                     View Details
// //                   </Typography>
// //                 </ListItemText>
// //               </MenuItem>
// //             )}
            
// //             {canUpdate && (
// //               <MenuItem 
// //                 onClick={() => {
// //                   onEdit(item);
// //                   onClose();
// //                 }}
// //                 sx={{ py: 1.5 }}
// //               >
// //                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// //                   <EditIcon fontSize="small" />
// //                 </ListItemIcon>
// //                 <ListItemText>
// //                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// //                     Edit
// //                   </Typography>
// //                 </ListItemText>
// //               </MenuItem>
// //             )}
            
// //             {(canView || canUpdate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
            
// //             {canDelete && (
// //               <MenuItem 
// //                 onClick={() => {
// //                   onDelete(item);
// //                   onClose();
// //                 }}
// //                 sx={{ py: 1.5 }}
// //               >
// //                 <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
// //                   <DeleteIcon fontSize="small" />
// //                 </ListItemIcon>
// //                 <ListItemText>
// //                   <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
// //                     Delete
// //                   </Typography>
// //                 </ListItemText>
// //               </MenuItem>
// //             )}
// //           </>
// //         ) : (
// //           <>
// //             {canCreate && (
// //               <MenuItem 
// //                 onClick={() => {
// //                   onComplete(item);
// //                   onClose();
// //                 }}
// //                 sx={{ py: 1.5 }}
// //               >
// //                 <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
// //                   <CheckCircleIcon fontSize="small" />
// //                 </ListItemIcon>
// //                 <ListItemText>
// //                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// //                     Mark as Completed
// //                   </Typography>
// //                 </ListItemText>
// //               </MenuItem>
// //             )}
            
// //             {/* Download Certificate Option */}
// //             {item?.certificateFile && (
// //               <>
// //                 <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
// //                 <MenuItem 
// //                   component="a"
// //                   href={`${BASE_URL}${item.certificateFile}`}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   onClick={onClose}
// //                   sx={{ py: 1.5 }}
// //                 >
// //                   <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// //                     <DownloadIcon fontSize="small" />
// //                   </ListItemIcon>
// //                   <ListItemText>
// //                     <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// //                       Download Certificate
// //                     </Typography>
// //                   </ListItemText>
// //                 </MenuItem>
// //               </>
// //             )}
// //           </>
// //         )}
// //       </Menu>
// //     </>
// //   );
// // };

// // const TrainingRecordMaster = () => {
// //   // Mode state (Training Master or Assigned Trainings)
// //   const [mode, setMode] = useState('add'); // 'add' or 'assign'
  
// //   // State for data
// //   const [trainings, setTrainings] = useState([]);
// //   const [assignedTrainings, setAssignedTrainings] = useState([]);
// //   const [employees, setEmployees] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [searchInput, setSearchInput] = useState('');
  
// //   // Table state
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);
// //   const [selected, setSelected] = useState([]);
  
// //   // Menu state for action buttons
// //   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
// //   const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  
// //   // Modal state
// //   const [openAddModal, setOpenAddModal] = useState(false);
// //   const [openEditModal, setOpenEditModal] = useState(false);
// //   const [openViewModal, setOpenViewModal] = useState(false);
// //   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
// //   const [openAssignModal, setOpenAssignModal] = useState(false);
  
// //   // Selected item
// //   const [selectedItem, setSelectedItem] = useState(null);
  
// //   // Notification state
// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: '',
// //     severity: 'success'
// //   });

// //   // User permissions state
// //   const [userPermissions, setUserPermissions] = useState([]);
// //   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
// //   const [permissionsLoaded, setPermissionsLoaded] = useState(false);

// //   // Fetch user permissions
// //   useEffect(() => {
// //     const fetchUserPermissions = async () => {
// //       try {
// //         const token = localStorage.getItem('token');
// //         const response = await axios.get(`${BASE_URL}/api/auth/me`, {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         });
        
// //         if (response.data.success) {
// //           const userData = response.data.data;
// //           setIsSuperAdmin(userData.isSuperAdmin || false);
          
// //           // Set permissions array
// //           if (userData.permissions && Array.isArray(userData.permissions)) {
// //             setUserPermissions(userData.permissions);
// //           } else {
// //             setUserPermissions([]);
// //           }
// //         }
// //       } catch (err) {
// //         console.error('Error fetching user permissions:', err);
// //         setUserPermissions([]);
// //       } finally {
// //         setPermissionsLoaded(true);
// //       }
// //     };
    
// //     fetchUserPermissions();
// //   }, []);

// //   // Check permission helper
// //   const checkPermission = (action) => {
// //     // Super admin has all permissions
// //     if (isSuperAdmin) return true;
    
// //     return hasPermission(
// //       userPermissions,
// //       MODULES.TRAINING_MASTER,
// //       PAGES.TRAINING_RECORDS,
// //       action
// //     );
// //   };

// //   // Permission checks
// //   const canViewPage = checkPermission(ACTIONS.VIEW);
// //   const canCreate = checkPermission(ACTIONS.CREATE);
// //   const canUpdate = checkPermission(ACTIONS.UPDATE);
// //   const canDelete = checkPermission(ACTIONS.DELETE);

// //   // Debounce search
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setSearchTerm(searchInput);
// //       setPage(0);
// //     }, 500);

// //     return () => clearTimeout(timer);
// //   }, [searchInput]);

// //   // Fetch data when mode changes - only if user has permission
// //   useEffect(() => {
// //     if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
// //       fetchEmployees();
// //       if (mode === 'add') {
// //         fetchTrainings();
// //       } else {
// //         fetchAssignedTrainings();
// //       }
// //     }
// //     // Reset selections when mode changes
// //     setSelected([]);
// //     setPage(0);
// //     setSearchInput('');
// //     setSearchTerm('');
// //   }, [mode, permissionsLoaded, canViewPage, isSuperAdmin]);

// //   const fetchTrainings = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('token');
      
// //       const response = await axios.get(`${BASE_URL}/api/trainings/all`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       let list = [];
// //       if (response.data.success) {
// //         if (Array.isArray(response.data.data)) {
// //           list = response.data.data;
// //         } else if (response.data.data?.data) {
// //           list = response.data.data.data;
// //         }
// //       }
      
// //       const formattedData = list.map(item => ({
// //         ...item,
// //         trainingName: item.trainingName || item.name || '',
// //         provider: item.provider || '',
// //         startDate: item.startDate || '',
// //         endDate: item.endDate || '',
// //         status: item.status || 'pending'
// //       }));
      
// //       setTrainings(formattedData);
// //       setFilteredData(formattedData);
// //     } catch (err) {
// //       console.error('Error fetching trainings:', err);
// //       showNotification('Failed to load trainings. Please try again.', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   const fetchAssignedTrainings = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('token');
      
// //       const response = await axios.get(`${BASE_URL}/api/trainings/assigned`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       let list = [];
// //       if (response.data.success) {
// //         if (Array.isArray(response.data.data)) {
// //           list = response.data.data;
// //         } else if (response.data.data?.data) {
// //           list = response.data.data.data;
// //         }
// //       }
      
// //       const formattedData = list.map(item => ({
// //         ...item,
// //         employeeName: item.employeeName || item.employee?.name || '',
// //         trainingName: item.trainingName || item.training?.trainingName || '',
// //         startDate: item.startDate || item.training?.startDate || '',
// //         endDate: item.endDate || item.training?.endDate || '',
// //         status: item.status || 'pending',
// //         score: item.score || 0,
// //         certificateFile: item.certificateFile || item.certificate?.file || null
// //       }));
      
// //       setAssignedTrainings(formattedData);
// //       setFilteredData(formattedData);
// //     } catch (err) {
// //       console.error('Error fetching assigned trainings:', err);
// //       showNotification('Failed to load assigned trainings. Please try again.', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   const fetchEmployees = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
      
// //       const response = await axios.get(`${BASE_URL}/api/employees`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       let list = [];
// //       if (response.data.success) {
// //         if (Array.isArray(response.data.data)) {
// //           list = response.data.data;
// //         } else if (response.data.data?.data) {
// //           list = response.data.data.data;
// //         }
// //       }
      
// //       setEmployees(list);
// //     } catch (err) {
// //       console.error('Error fetching employees:', err);
// //     }
// //   };
  
// //   // Handle refresh
// //   const handleRefresh = () => {
// //     if (mode === 'add') {
// //       fetchTrainings();
// //     } else {
// //       fetchAssignedTrainings();
// //     }
// //     showNotification('Data refreshed', 'success');
// //   };
  
// //   // Handle mode change
// //   const handleModeChange = (event, newMode) => {
// //     if (newMode !== null) {
// //       setMode(newMode);
// //     }
// //   };
  
// //   // Handle search (client-side filtering)
// //   const handleSearch = () => {
// //     const currentData = mode === 'add' ? trainings : assignedTrainings;
    
// //     if (!searchTerm) {
// //       setFilteredData(currentData);
// //       return;
// //     }
    
// //     const value = searchTerm.toLowerCase();
// //     const filtered = currentData.filter(item => {
// //       if (mode === 'add') {
// //         return (
// //           (item.trainingName?.toLowerCase().includes(value)) ||
// //           (item.provider?.toLowerCase().includes(value))
// //         );
// //       } else {
// //         return (
// //           (item.employeeName?.toLowerCase().includes(value)) ||
// //           (item.trainingName?.toLowerCase().includes(value))
// //         );
// //       }
// //     });
    
// //     setFilteredData(filtered);
// //   };

// //   // Apply search when searchTerm or data changes
// //   useEffect(() => {
// //     handleSearch();
// //   }, [searchTerm, trainings, assignedTrainings, mode]);
  
// //   // Handle select all - only if user has delete permission
// //   const handleSelectAll = (event) => {
// //     if (!canDelete || mode !== 'add') return;
    
// //     if (event.target.checked) {
// //       setSelected(filteredData.map(item => item._id));
// //     } else {
// //       setSelected([]);
// //     }
// //   };
  
// //   // Handle single selection - only if user has delete permission
// //   const handleSelect = (id) => {
// //     if (!canDelete || mode !== 'add') return;
    
// //     const selectedIndex = selected.indexOf(id);
// //     let newSelected = [];
    
// //     if (selectedIndex === -1) {
// //       newSelected = newSelected.concat(selected, id);
// //     } else {
// //       newSelected = selected.filter(item => item !== id);
// //     }
    
// //     setSelected(newSelected);
// //   };
  
// //   // Handle page change
// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //     setSelected([]);
// //   };
  
// //   // Handle rows per page change
// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //     setSelected([]);
// //   };
  
// //   // Handle add training - INSTANT UPDATE
// //   const handleAddTraining = (newTrainingFromBackend) => {
// //     const formattedItem = {
// //       ...newTrainingFromBackend,
// //       _id: newTrainingFromBackend._id,
// //       trainingName: newTrainingFromBackend.trainingName || newTrainingFromBackend.name || '',
// //       provider: newTrainingFromBackend.provider || '',
// //       startDate: newTrainingFromBackend.startDate || '',
// //       endDate: newTrainingFromBackend.endDate || '',
// //       status: newTrainingFromBackend.status || 'pending'
// //     };

// //     // Add instantly to table (top position)
// //     setTrainings((prev) => [formattedItem, ...prev]);
// //     setFilteredData((prev) => [formattedItem, ...prev]);
// //     setPage(0);

// //     showNotification('Training added successfully!', 'success');
// //   };
  
// //   // Handle edit training - INSTANT UPDATE
// //   const handleEditTraining = (updatedTrainingFromBackend) => {
// //     const formattedItem = {
// //       ...updatedTrainingFromBackend,
// //       _id: updatedTrainingFromBackend._id,
// //       trainingName: updatedTrainingFromBackend.trainingName || updatedTrainingFromBackend.name || '',
// //       provider: updatedTrainingFromBackend.provider || '',
// //       startDate: updatedTrainingFromBackend.startDate || '',
// //       endDate: updatedTrainingFromBackend.endDate || '',
// //       status: updatedTrainingFromBackend.status || 'pending'
// //     };

// //     // Update main data
// //     setTrainings((prev) =>
// //       prev.map((item) =>
// //         item._id === formattedItem._id ? formattedItem : item
// //       )
// //     );

// //     // Update filtered data
// //     setFilteredData((prev) =>
// //       prev.map((item) =>
// //         item._id === formattedItem._id ? formattedItem : item
// //       )
// //     );

// //     showNotification('Training updated successfully!', 'success');
// //   };
  
// //   // Handle delete training - INSTANT UPDATE
// //   const handleDeleteTraining = (itemId) => {
// //     // Remove from data array
// //     const updatedData = trainings.filter(item => item._id !== itemId);
// //     setTrainings(updatedData);
    
// //     // Remove from selected if present
// //     setSelected(selected.filter(id => id !== itemId));
    
// //     showNotification('Training deleted successfully!', 'success');
// //   };
  
// //   // Handle assign training
// //   const handleAssignTraining = () => {
// //     fetchAssignedTrainings();
// //     showNotification('Training assigned successfully!', 'success');
// //   };
  
// //   // Handle complete training
// //   const handleCompleteTraining = async (training) => {
// //     try {
// //       const token = localStorage.getItem('token');
      
// //       const response = await axios.post(
// //         `${BASE_URL}/api/trainings/complete`,
// //         { recordId: training._id, score: 100 },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       // If the response contains certificate info, update the training data
// //       if (response.data.success && response.data.data) {
// //         // Update the assigned trainings list with the new certificate data
// //         setAssignedTrainings(prev => 
// //           prev.map(item => 
// //             item._id === training._id 
// //               ? { ...item, ...response.data.data, status: 'Completed' }
// //               : item
// //           )
// //         );
// //         setFilteredData(prev => 
// //           prev.map(item => 
// //             item._id === training._id 
// //               ? { ...item, ...response.data.data, status: 'Completed' }
// //               : item
// //           )
// //         );
// //       } else {
// //         // If no certificate data, just update status
// //         setAssignedTrainings(prev => 
// //           prev.map(item => 
// //             item._id === training._id 
// //               ? { ...item, status: 'Completed' }
// //               : item
// //           )
// //         );
// //         setFilteredData(prev => 
// //           prev.map(item => 
// //             item._id === training._id 
// //               ? { ...item, status: 'Completed' }
// //               : item
// //           )
// //         );
// //       }
      
// //       showNotification('Training marked as completed!', 'success');
// //     } catch (err) {
// //       console.error('Error completing training:', err);
// //       showNotification('Failed to mark training as completed', 'error');
// //     }
// //   };
  
// //   // Handle bulk delete
// //   const handleBulkDelete = () => {
// //     if (!canDelete) return;
// //     showNotification('Bulk delete requires API implementation', 'warning');
// //   };
  
// //   // Action menu handlers
// //   const handleActionMenuOpen = (event, item) => {
// //     setActionMenuAnchor(event.currentTarget);
// //     setSelectedItemForAction(item);
// //   };

// //   const handleActionMenuClose = () => {
// //     setActionMenuAnchor(null);
// //     setSelectedItemForAction(null);
// //   };
  
// //   // Open edit modal
// //   const openEditModalHandler = (item) => {
// //     if (!canUpdate) return;
// //     setSelectedItem(item);
// //     setOpenEditModal(true);
// //     handleActionMenuClose();
// //   };
  
// //   // Open view modal
// //   const openViewModalHandler = (item) => {
// //     if (!canViewPage) return;
// //     setSelectedItem(item);
// //     setOpenViewModal(true);
// //     handleActionMenuClose();
// //   };
  
// //   // Open delete confirmation
// //   const openDeleteDialogHandler = (item) => {
// //     if (!canDelete) return;
// //     setSelectedItem(item);
// //     setOpenDeleteDialog(true);
// //     handleActionMenuClose();
// //   };
  
// //   // Open complete training
// //   const openCompleteTrainingHandler = (item) => {
// //     if (!canCreate) return;
// //     handleCompleteTraining(item);
// //     handleActionMenuClose();
// //   };
  
// //   // Show notification
// //   const showNotification = (message, severity) => {
// //     setSnackbar({
// //       open: true,
// //       message,
// //       severity
// //     });
// //   };
  
// //   // Format date
// //   const formatDate = (dateString) => {
// //     if (!dateString) return '-';
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };
  
// //   // Get status chip color
// //   const getStatusChipColor = (status) => {
// //     switch (status?.toLowerCase()) {
// //       case 'completed':
// //         return { bgcolor: COLORS.chips.completed, color: COLORS.primary };
// //       case 'in progress':
// //       case 'inprogress':
// //         return { bgcolor: COLORS.chips.inProgress, color: '#0F67B0' };
// //       case 'cancelled':
// //         return { bgcolor: COLORS.chips.cancelled, color: '#DC2626' };
// //       default:
// //         return { bgcolor: COLORS.chips.pending, color: '#B45309' };
// //     }
// //   };
  
// //   // Get item initials for avatar
// //   const getItemInitials = (itemName) => {
// //     if (!itemName) return mode === 'add' ? 'T' : 'A';
    
// //     const words = itemName.split(' ');
// //     if (words.length >= 2) {
// //       return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
// //     }
    
// //     return itemName.substring(0, 2).toUpperCase();
// //   };
  
// //   // Get avatar color based on item name
// //   const getAvatarColor = (itemName) => {
// //     if (!itemName) return COLORS.primary;
    
// //     const colors = [
// //       COLORS.primary,
// //       COLORS.primaryDark,
// //       '#074346',
// //       '#0D696C',
// //       '#128C7E'
// //     ];
    
// //     const charCode = itemName.charCodeAt(0) || 0;
// //     return colors[charCode % colors.length];
// //   };
  
// //   // Get current data based on mode
// //   const currentData = mode === 'add' ? trainings : assignedTrainings;
  
// //   // Paginated data
// //   const paginatedData = filteredData.slice(
// //     page * rowsPerPage,
// //     page * rowsPerPage + rowsPerPage
// //   );

// //   // Show loading state while permissions are being fetched
// //   if (!permissionsLoaded) {
// //     return <LoadingState />;
// //   }

// //   // If user doesn't have view permission, show access denied
// //   if (!canViewPage && !isSuperAdmin) {
// //     return <AccessDenied />;
// //   }

// //   return (
// //     <Box sx={{ p: 2.5 }}>
// //       {/* Mode Toggle */}
// //       <Box sx={{ mb: 2.5 }}>
// //         <ToggleButtonGroup
// //           value={mode}
// //           exclusive
// //           onChange={handleModeChange}
// //           sx={{
// //             '& .MuiToggleButton-root': {
// //               height: 36,
// //               px: 3,
// //               textTransform: 'none',
// //               fontWeight: 500,
// //               fontSize: '0.75rem',
// //               borderColor: COLORS.border,
// //               color: COLORS.text.secondary,
// //               '&.Mui-selected': {
// //                 bgcolor: COLORS.primary,
// //                 color: COLORS.text.light,
// //                 '&:hover': {
// //                   bgcolor: COLORS.primaryDark,
// //                 }
// //               }
// //             }
// //           }}
// //         >
// //           <ToggleButton value="add">
// //             <SchoolIcon sx={{ fontSize: '1rem', mr: 1 }} />
// //             Training Master
// //           </ToggleButton>
// //           <ToggleButton value="assign">
// //             <AssignmentIcon sx={{ fontSize: '1rem', mr: 1 }} />
// //             Assigned Trainings
// //           </ToggleButton>
// //         </ToggleButtonGroup>
// //       </Box>

// //       {/* Page Header */}
// //       <Box sx={{ mb: 2.5 }}>
// //         <Typography 
// //           variant="h5" 
// //           component="h1" 
// //           sx={{ 
// //             fontSize: '1.25rem',
// //             fontWeight: 700,
// //             color: COLORS.text.primary,
// //             mb: 0.5
// //           }}
// //         >
// //           {mode === 'add' ? 'Training Master' : 'Assigned Trainings'}
// //         </Typography>
// //         <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
// //           {mode === 'add' 
// //             ? 'Manage and organize training programs and courses' 
// //             : 'View and manage training assignments to employees'}
// //         </Typography>
// //       </Box>

// //       {/* Action Bar */}
// //       <Paper sx={{ 
// //         p: 1.5, 
// //         mb: 2.5, 
// //         borderRadius: 2,
// //         bgcolor: COLORS.background.white,
// //         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// //         border: `1px solid ${COLORS.border}`
// //       }}>
// //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
// //           {/* Search */}
// //           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
// //             <TextField
// //               placeholder={`Search ${mode === 'add' ? 'trainings' : 'assigned trainings'}...`}
// //               size="small"
// //               value={searchInput}
// //               onChange={(e) => setSearchInput(e.target.value)}
// //               sx={{ 
// //                 width: { xs: '100%', sm: 360 },
// //                 '& .MuiOutlinedInput-root': {
// //                   borderRadius: 1.5,
// //                   fontSize: '0.75rem',
// //                   '&:hover fieldset': {
// //                     borderColor: COLORS.primary,
// //                   },
// //                 }
// //               }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
// //                   </InputAdornment>
// //                 ),
// //                 sx: { 
// //                   height: 36,
// //                   bgcolor: COLORS.background.light,
// //                   '& input': {
// //                     padding: '6px 12px',
// //                     fontSize: '0.75rem',
// //                     color: COLORS.text.primary,
// //                     '&::placeholder': {
// //                       color: COLORS.text.tertiary,
// //                       fontSize: '0.75rem'
// //                     }
// //                   }
// //                 }
// //               }}
// //               disabled={loading}
// //             />
            
// //             {/* Refresh Button */}
// //             <Tooltip title="Refresh">
// //               <IconButton
// //                 onClick={handleRefresh}
// //                 disabled={loading}
// //                 sx={{
// //                   color: COLORS.primary,
// //                   '&:hover': {
// //                     bgcolor: `${COLORS.primary}10`
// //                   }
// //                 }}
// //               >
// //                 <RefreshIcon sx={{ fontSize: '1.1rem' }} />
// //               </IconButton>
// //             </Tooltip>
// //           </Stack>

// //           {/* Action Buttons - Conditionally rendered based on permissions */}
// //           <Stack direction="row" spacing={1.5} alignItems="center">
// //             {/* Bulk Delete Button - Only show if user has delete permission and in add mode */}
// //             {mode === 'add' && canDelete && selected.length > 0 && (
// //               <Button
// //                 variant="outlined"
// //                 color="error"
// //                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
// //                 onClick={handleBulkDelete}
// //                 sx={{ 
// //                   height: 36,
// //                   borderRadius: 1.5,
// //                   textTransform: 'none',
// //                   fontSize: '0.75rem',
// //                   fontWeight: 500,
// //                   borderColor: '#fee2e2',
// //                   color: '#991b1b',
// //                   '&:hover': {
// //                     borderColor: '#fecaca',
// //                     bgcolor: '#fee2e2'
// //                   }
// //                 }}
// //                 disabled={loading}
// //               >
// //                 Delete ({selected.length})
// //               </Button>
// //             )}
            
// //             {/* Add Button - Only show if user has create permission and in add mode */}
// //             {mode === 'add' && canCreate && (
// //               <Button
// //                 variant="contained"
// //                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
// //                 onClick={() => setOpenAddModal(true)}
// //                 sx={{
// //                   height: 36,
// //                   borderRadius: 1.5,
// //                   bgcolor: COLORS.primary,
// //                   fontSize: '0.75rem',
// //                   fontWeight: 500,
// //                   textTransform: 'none',
// //                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
// //                   '&:hover': {
// //                     bgcolor: COLORS.primaryDark,
// //                   }
// //                 }}
// //                 disabled={loading}
// //               >
// //                 Add Training
// //               </Button>
// //             )}
            
// //             {/* Assign Button - Only show if user has create permission and in assign mode */}
// //             {mode === 'assign' && canCreate && (
// //               <Button
// //                 variant="contained"
// //                 startIcon={<AssignmentIcon sx={{ fontSize: '1rem' }} />}
// //                 onClick={() => setOpenAssignModal(true)}
// //                 sx={{
// //                   height: 36,
// //                   borderRadius: 1.5,
// //                   bgcolor: COLORS.primary,
// //                   fontSize: '0.75rem',
// //                   fontWeight: 500,
// //                   textTransform: 'none',
// //                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
// //                   '&:hover': {
// //                     bgcolor: COLORS.primaryDark,
// //                   }
// //                 }}
// //                 disabled={loading}
// //               >
// //                 Assign Training
// //               </Button>
// //             )}
// //           </Stack>
// //         </Stack>
// //       </Paper>

// //       {/* Data Table */}
// //       <Paper sx={{ 
// //         width: '100%', 
// //         borderRadius: 2, 
// //         overflow: 'hidden',
// //         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// //         border: `1px solid ${COLORS.border}`
// //       }}>
// //         <TableContainer>
// //           <Table size="small">
// //             <TableHead>
// //               <TableRow sx={{ 
// //                 bgcolor: COLORS.background.tableHeader,
// //                 '& .MuiTableCell-root': {
// //                   borderBottom: 'none',
// //                   color: COLORS.text.light,
// //                   py: 1.5
// //                 }
// //               }}>
// //                 {/* Checkbox Column - Only show if user has delete permission and in add mode */}
// //                 {mode === 'add' && canDelete && (
// //                   <TableCell padding="checkbox" sx={{ width: 40 }}>
// //                     <Checkbox
// //                       indeterminate={selected.length > 0 && selected.length < filteredData.length}
// //                       checked={filteredData.length > 0 && selected.length === filteredData.length}
// //                       onChange={handleSelectAll}
// //                       sx={{
// //                         color: COLORS.text.light,
// //                         '&.Mui-checked': {
// //                           color: COLORS.text.light,
// //                         },
// //                         '&.MuiCheckbox-indeterminate': {
// //                           color: COLORS.text.light,
// //                         },
// //                         '& .MuiSvgIcon-root': {
// //                           fontSize: '1.25rem'
// //                         }
// //                       }}
// //                       disabled={loading || filteredData.length === 0}
// //                     />
// //                   </TableCell>
// //                 )}
                
// //                 {mode === 'add' ? (
// //                   <>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       Training
// //                     </TableCell>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       Provider
// //                     </TableCell>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       Start Date
// //                     </TableCell>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       End Date
// //                     </TableCell>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       Status
// //                     </TableCell>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       Employee
// //                     </TableCell>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       Training
// //                     </TableCell>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       Start Date
// //                     </TableCell>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       End Date
// //                     </TableCell>
// //                     <TableCell sx={{ 
// //                       fontWeight: 600, 
// //                       fontSize: '0.7rem',
// //                       letterSpacing: '0.5px',
// //                       color: COLORS.text.light
// //                     }}>
// //                       Status
// //                     </TableCell>
// //                   </>
// //                 )}
// //                 <TableCell sx={{ 
// //                   fontWeight: 600, 
// //                   fontSize: '0.7rem',
// //                   letterSpacing: '0.5px',
// //                   width: 60,
// //                   color: COLORS.text.light
// //                 }} align="center">
// //                   Actions
// //                 </TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {loading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={mode === 'add' ? (canDelete ? 7 : 6) : 6} align="center" sx={{ py: 6 }}>
// //                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
// //                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
// //                       Loading {mode === 'add' ? 'trainings' : 'assigned trainings'}...
// //                     </Typography>
// //                   </TableCell>
// //                 </TableRow>
// //               ) : paginatedData.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={mode === 'add' ? (canDelete ? 7 : 6) : 6} align="center" sx={{ py: 6 }}>
// //                     <Box sx={{ textAlign: 'center' }}>
// //                       <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
// //                         {searchTerm ? 'No items found' : `No ${mode === 'add' ? 'trainings' : 'assigned trainings'} available`}
// //                       </Typography>
// //                       <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
// //                         {searchTerm ? 'Try adjusting your search terms' : mode === 'add' ? 'Add your first training to get started' : 'Assign training to employees to get started'}
// //                       </Typography>
// //                     </Box>
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 paginatedData.map((item, index) => {
// //                   const isSelected = selected.includes(item._id);
// //                   const isActionMenuOpen = Boolean(actionMenuAnchor) && 
// //                     selectedItemForAction?._id === item._id;
// //                   const avatarColor = getAvatarColor(mode === 'add' ? item.trainingName : item.employeeName);
// //                   const statusColors = getStatusChipColor(item.status);

// //                   return (
// //                     <TableRow
// //                       key={item._id || index}
// //                       hover
// //                       selected={isSelected}
// //                       sx={{ 
// //                         bgcolor: COLORS.background.white,
// //                         '&:hover': {
// //                           bgcolor: COLORS.background.hover
// //                         },
// //                         '&.Mui-selected': {
// //                           bgcolor: `${COLORS.primary}10`,
// //                           '&:hover': {
// //                             bgcolor: `${COLORS.primary}20`
// //                           }
// //                         },
// //                         '& .MuiTableCell-root': {
// //                           py: 1.5,
// //                           fontSize: '0.75rem',
// //                           borderColor: COLORS.border
// //                         }
// //                       }}
// //                     >
// //                       {/* Checkbox Column - Only show if user has delete permission and in add mode */}
// //                       {mode === 'add' && canDelete && (
// //                         <TableCell padding="checkbox" sx={{ width: 40 }}>
// //                           <Checkbox
// //                             checked={isSelected}
// //                             onChange={() => handleSelect(item._id)}
// //                             sx={{
// //                               color: COLORS.primary,
// //                               '&.Mui-checked': {
// //                                 color: COLORS.primary,
// //                               },
// //                               '& .MuiSvgIcon-root': {
// //                                 fontSize: '1.25rem'
// //                               }
// //                             }}
// //                           />
// //                         </TableCell>
// //                       )}
                      
// //                       {mode === 'add' ? (
// //                         <>
// //                           <TableCell>
// //                             <Stack direction="row" spacing={1.5} alignItems="center">
// //                               <Avatar 
// //                                 sx={{ 
// //                                   width: 32, 
// //                                   height: 32, 
// //                                   bgcolor: avatarColor,
// //                                   fontSize: '0.7rem',
// //                                   fontWeight: 600
// //                                 }}
// //                               >
// //                                 {getItemInitials(item.trainingName)}
// //                               </Avatar>
// //                               <Box>
// //                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
// //                                   {item.trainingName}
// //                                 </Typography>
// //                                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
// //                                   ID: {item._id?.slice(-6) || 'N/A'}
// //                                 </Typography>
// //                               </Box>
// //                             </Stack>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// //                               {item.provider || '-'}
// //                             </Typography>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// //                               {formatDate(item.startDate)}
// //                             </Typography>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// //                               {formatDate(item.endDate)}
// //                             </Typography>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Chip
// //                               label={item.status || 'Pending'}
// //                               size="small"
// //                               sx={{ 
// //                                 fontSize: '0.65rem',
// //                                 fontWeight: 500,
// //                                 bgcolor: statusColors.bgcolor,
// //                                 color: statusColors.color,
// //                                 height: 20
// //                               }}
// //                             />
// //                           </TableCell>
// //                         </>
// //                       ) : (
// //                         <>
// //                           <TableCell>
// //                             <Stack direction="row" spacing={1.5} alignItems="center">
// //                               <Avatar 
// //                                 sx={{ 
// //                                   width: 32, 
// //                                   height: 32, 
// //                                   bgcolor: avatarColor,
// //                                   fontSize: '0.7rem',
// //                                   fontWeight: 600
// //                                 }}
// //                               >
// //                                 {getItemInitials(item.employeeName)}
// //                               </Avatar>
// //                               <Box>
// //                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
// //                                   {item.employeeName}
// //                                 </Typography>
// //                                 {item.score > 0 && (
// //                                   <Typography sx={{ fontSize: '0.65rem', color: COLORS.primary }}>
// //                                     Score: {item.score}%
// //                                   </Typography>
// //                                 )}
// //                               </Box>
// //                             </Stack>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// //                               {item.trainingName}
// //                             </Typography>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// //                               {formatDate(item.startDate)}
// //                             </Typography>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
// //                               {formatDate(item.endDate)}
// //                             </Typography>
// //                           </TableCell>
// //                           <TableCell>
// //                             <Chip
// //                               label={item.status || 'Pending'}
// //                               size="small"
// //                               sx={{ 
// //                                 fontSize: '0.65rem',
// //                                 fontWeight: 500,
// //                                 bgcolor: statusColors.bgcolor,
// //                                 color: statusColors.color,
// //                                 height: 20
// //                               }}
// //                             />
// //                           </TableCell>
// //                         </>
// //                       )}
// //                       <TableCell align="center" sx={{ width: 60 }}>
// //                         <ActionMenu 
// //                           item={item}
// //                           onView={openViewModalHandler}
// //                           onEdit={openEditModalHandler}
// //                           onDelete={openDeleteDialogHandler}
// //                           onComplete={openCompleteTrainingHandler}
// //                           anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
// //                           onClose={handleActionMenuClose}
// //                           onOpen={(e) => handleActionMenuOpen(e, item)}
// //                           permissions={userPermissions}
// //                           mode={mode}
// //                         />
// //                       </TableCell>
// //                     </TableRow>
// //                   );
// //                 })
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>

// //         {/* Pagination */}
// //         <TablePagination
// //           rowsPerPageOptions={[5, 10, 25, 50]}
// //           component="div"
// //           count={filteredData.length}
// //           rowsPerPage={rowsPerPage}
// //           page={page}
// //           onPageChange={handleChangePage}
// //           onRowsPerPageChange={handleChangeRowsPerPage}
// //           sx={{
// //             borderTop: `1px solid ${COLORS.border}`,
// //             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
// //               fontSize: '0.7rem',
// //               color: COLORS.text.secondary
// //             },
// //             '& .MuiTablePagination-select': {
// //               fontSize: '0.7rem'
// //             },
// //             '& .MuiTablePagination-actions button': {
// //               color: COLORS.primary,
// //             }
// //           }}
// //         />
// //       </Paper>

// //       {/* Modal Components */}
// //       {mode === 'add' && (
// //         <>
// //           {canCreate && (
// //             <AddTraining 
// //               open={openAddModal}
// //               onClose={() => setOpenAddModal(false)}
// //               onAdd={handleAddTraining}
// //             />
// //           )}

// //           {selectedItem && (
// //             <>
// //               {canUpdate && (
// //                 <EditTraining 
// //                   open={openEditModal}
// //                   onClose={() => {
// //                     setOpenEditModal(false);
// //                     setSelectedItem(null);
// //                   }}
// //                   training={selectedItem}
// //                   onUpdate={handleEditTraining}
// //                 />
// //               )}

// //               {canViewPage && (
// //                 <ViewTraining 
// //                   open={openViewModal}
// //                   onClose={() => {
// //                     setOpenViewModal(false);
// //                     setSelectedItem(null);
// //                   }}
// //                   training={selectedItem}
// //                   onEdit={() => {
// //                     if (canUpdate) {
// //                       setOpenViewModal(false);
// //                       setOpenEditModal(true);
// //                     }
// //                   }}
// //                 />
// //               )}

// //               {canDelete && (
// //                 <DeleteTraining 
// //                   open={openDeleteDialog}
// //                   onClose={() => {
// //                     setOpenDeleteDialog(false);
// //                     setSelectedItem(null);
// //                   }}
// //                   training={selectedItem}
// //                   onDelete={handleDeleteTraining}
// //                 />
// //               )}
// //             </>
// //           )}
// //         </>
// //       )}

// //       {mode === 'assign' && canCreate && (
// //         <AssignTraining 
// //           open={openAssignModal}
// //           onClose={() => setOpenAssignModal(false)}
// //           trainings={trainings}
// //           employees={employees}
// //           onAssign={handleAssignTraining}
// //         />
// //       )}

// //       {/* Snackbar Notification */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={3000}
// //         onClose={() => setSnackbar({...snackbar, open: false})}
// //         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// //       >
// //         <Alert 
// //           onClose={() => setSnackbar({...snackbar, open: false})} 
// //           severity={snackbar.severity}
// //           variant="filled"
// //           sx={{ 
// //             width: '100%',
// //             borderRadius: 1.5,
// //             fontSize: '0.75rem',
// //             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
// //             '& .MuiAlert-icon': {
// //               fontSize: '1.25rem'
// //             }
// //           }}
// //         >
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default TrainingRecordMaster;

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
//   Chip,
//   Avatar,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Alert,
//   CircularProgress,
//   ToggleButton,
//   ToggleButtonGroup
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   MoreVert as MoreVertIcon,
//   Refresh as RefreshIcon,
//   School as SchoolIcon,
//   Assignment as AssignmentIcon,
//   CheckCircle as CheckCircleIcon,
//   Download as DownloadIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// // Import modal components
// import AddTraining from './AddTraining';
// import EditTraining from './EditTraining';
// import ViewTraining from './ViewTraining';
// import DeleteTraining from './DeleteTraining';
// import AssignTraining from './AssignTraining';

// // Color constants
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
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     completed: '#9FE2BF',
//     pending: '#FEF3C7',
//     inProgress: '#E0F2FE',
//     cancelled: '#FEE2E2'
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
//     <Typography variant="h6" color="error" sx={{ mb: 2 }}>
//       Access Denied
//     </Typography>
//     <Typography variant="body2" color="text.secondary">
//       You don't have permission to view this page. Please contact your administrator.
//     </Typography>
//   </Box>
// );

// // Action Menu Component with permission checks
// const ActionMenu = ({ item, onView, onEdit, onDelete, onComplete, onDownload, anchorEl, onClose, onOpen, permissions, mode }) => {
//   const moduleKey = MODULES.TRAINING_MASTER;
//   const pageKey = PAGES.TRAINING_RECORDS;
  
//   const canView = hasPermission(permissions, moduleKey, pageKey, ACTIONS.VIEW);
//   const canUpdate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.UPDATE);
//   const canDelete = hasPermission(permissions, moduleKey, pageKey, ACTIONS.DELETE);
//   const canCreate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.CREATE);

//   // If no actions available, don't render the menu
//   if (!canView && !canUpdate && !canDelete && !(mode === 'assign' && canCreate)) {
//     return null;
//   }

//   return (
//     <>
//       <Tooltip title="Actions">
//         <IconButton
//           size="small"
//           onClick={onOpen}
//           sx={{
//             color: COLORS.text.secondary,
//             '&:hover': {
//               bgcolor: `${COLORS.primary}20`
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
//             border: `1px solid ${COLORS.border}`,
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//           }
//         }}
//       >
//         {mode === 'add' ? (
//           <>
//             {canView && (
//               <MenuItem 
//                 onClick={() => {
//                   onView(item);
//                   onClose();
//                 }}
//                 sx={{ py: 1.5 }}
//               >
//                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                   <ViewIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
//                     View Details
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}
            
//             {canUpdate && (
//               <MenuItem 
//                 onClick={() => {
//                   onEdit(item);
//                   onClose();
//                 }}
//                 sx={{ py: 1.5 }}
//               >
//                 <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                   <EditIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
//                     Edit
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}
            
//             {(canView || canUpdate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
            
//             {canDelete && (
//               <MenuItem 
//                 onClick={() => {
//                   onDelete(item);
//                   onClose();
//                 }}
//                 sx={{ py: 1.5 }}
//               >
//                 <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
//                   <DeleteIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
//                     Delete
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}
//           </>
//         ) : (
//           <>
//             {canCreate && (
//               <MenuItem 
//                 onClick={() => {
//                   onComplete(item);
//                   onClose();
//                 }}
//                 sx={{ py: 1.5 }}
//               >
//                 <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
//                   <CheckCircleIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
//                     Mark as Completed
//                   </Typography>
//                 </ListItemText>
//               </MenuItem>
//             )}
            
//             {/* Download Certificate Option - Only show for completed trainings with certificate */}
//             {item?.status?.toLowerCase() === 'completed' && item?.certificateFile && (
//               <>
//                 <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
//                 <MenuItem 
//                   onClick={() => {
//                     onDownload(item);
//                     onClose();
//                   }}
//                   sx={{ py: 1.5 }}
//                 >
//                   <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//                     <DownloadIcon fontSize="small" />
//                   </ListItemIcon>
//                   <ListItemText>
//                     <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
//                       Download Certificate
//                     </Typography>
//                   </ListItemText>
//                 </MenuItem>
//               </>
//             )}
//           </>
//         )}
//       </Menu>
//     </>
//   );
// };

// const TrainingRecordMaster = () => {
//   // Mode state
//   const [mode, setMode] = useState('add');
  
//   // State for data
//   const [trainings, setTrainings] = useState([]);
//   const [assignedTrainings, setAssignedTrainings] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchInput, setSearchInput] = useState('');
  
//   // Table state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selected, setSelected] = useState([]);
  
//   // Menu state
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  
//   // Modal state
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openViewModal, setOpenViewModal] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openAssignModal, setOpenAssignModal] = useState(false);
  
//   // Selected item
//   const [selectedItem, setSelectedItem] = useState(null);
  
//   // Notification state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   // User permissions state
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [permissionsLoaded, setPermissionsLoaded] = useState(false);

//   // Fetch user permissions
//   useEffect(() => {
//     const fetchUserPermissions = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/api/auth/me`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         if (response.data.success) {
//           const userData = response.data.data;
//           setIsSuperAdmin(userData.isSuperAdmin || false);
          
//           if (userData.permissions && Array.isArray(userData.permissions)) {
//             setUserPermissions(userData.permissions);
//           } else {
//             setUserPermissions([]);
//           }
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
//     if (isSuperAdmin) return true;
//     return hasPermission(
//       userPermissions,
//       MODULES.TRAINING_MASTER,
//       PAGES.TRAINING_RECORDS,
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

//   // Fetch data when mode changes
//   useEffect(() => {
//     if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
//       fetchEmployees();
//       if (mode === 'add') {
//         fetchTrainings();
//       } else {
//         fetchAssignedTrainings();
//       }
//     }
//     setSelected([]);
//     setPage(0);
//     setSearchInput('');
//     setSearchTerm('');
//   }, [mode, permissionsLoaded, canViewPage, isSuperAdmin]);

//   const fetchTrainings = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BASE_URL}/api/trainings/all`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       let list = [];
//       if (response.data.success) {
//         if (Array.isArray(response.data.data)) {
//           list = response.data.data;
//         } else if (response.data.data?.data) {
//           list = response.data.data.data;
//         }
//       }
      
//       const formattedData = list.map(item => ({
//         ...item,
//         trainingName: item.trainingName || item.name || '',
//         provider: item.provider || '',
//         startDate: item.startDate || '',
//         endDate: item.endDate || '',
//         status: item.status || 'pending'
//       }));
      
//       setTrainings(formattedData);
//       setFilteredData(formattedData);
//     } catch (err) {
//       console.error('Error fetching trainings:', err);
//       showNotification('Failed to load trainings. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const fetchAssignedTrainings = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BASE_URL}/api/trainings/assigned`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       let list = [];
//       if (response.data.success) {
//         if (Array.isArray(response.data.data)) {
//           list = response.data.data;
//         } else if (response.data.data?.data) {
//           list = response.data.data.data;
//         }
//       }
      
//       const formattedData = list.map(item => ({
//         ...item,
//         employeeName: item.employeeName || item.employee?.name || '',
//         trainingName: item.trainingName || item.training?.trainingName || '',
//         startDate: item.startDate || item.training?.startDate || '',
//         endDate: item.endDate || item.training?.endDate || '',
//         status: item.status || 'pending',
//         score: item.score || 0,
//         certificateFile: item.certificateFile || item.certificate?.file || null
//       }));
      
//       setAssignedTrainings(formattedData);
//       setFilteredData(formattedData);
//     } catch (err) {
//       console.error('Error fetching assigned trainings:', err);
//       showNotification('Failed to load assigned trainings. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       let list = [];
//       if (response.data.success) {
//         if (Array.isArray(response.data.data)) {
//           list = response.data.data;
//         } else if (response.data.data?.data) {
//           list = response.data.data.data;
//         }
//       }
      
//       setEmployees(list);
//     } catch (err) {
//       console.error('Error fetching employees:', err);
//     }
//   };
  
//   // Handle refresh
//   const handleRefresh = () => {
//     if (mode === 'add') {
//       fetchTrainings();
//     } else {
//       fetchAssignedTrainings();
//     }
//     showNotification('Data refreshed', 'success');
//   };
  
//   // Handle mode change
//   const handleModeChange = (event, newMode) => {
//     if (newMode !== null) {
//       setMode(newMode);
//     }
//   };
  
//   // Handle search
//   const handleSearch = () => {
//     const currentData = mode === 'add' ? trainings : assignedTrainings;
    
//     if (!searchTerm) {
//       setFilteredData(currentData);
//       return;
//     }
    
//     const value = searchTerm.toLowerCase();
//     const filtered = currentData.filter(item => {
//       if (mode === 'add') {
//         return (
//           (item.trainingName?.toLowerCase().includes(value)) ||
//           (item.provider?.toLowerCase().includes(value))
//         );
//       } else {
//         return (
//           (item.employeeName?.toLowerCase().includes(value)) ||
//           (item.trainingName?.toLowerCase().includes(value))
//         );
//       }
//     });
    
//     setFilteredData(filtered);
//   };

//   useEffect(() => {
//     handleSearch();
//   }, [searchTerm, trainings, assignedTrainings, mode]);
  
//   // Handle select all
//   const handleSelectAll = (event) => {
//     if (!canDelete || mode !== 'add') return;
    
//     if (event.target.checked) {
//       setSelected(filteredData.map(item => item._id));
//     } else {
//       setSelected([]);
//     }
//   };
  
//   // Handle single selection
//   const handleSelect = (id) => {
//     if (!canDelete || mode !== 'add') return;
    
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
//     setSelected([]);
//   };
  
//   // Handle rows per page change
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//     setSelected([]);
//   };
  
//   // Handle add training
//   const handleAddTraining = (newTrainingFromBackend) => {
//     const formattedItem = {
//       ...newTrainingFromBackend,
//       _id: newTrainingFromBackend._id,
//       trainingName: newTrainingFromBackend.trainingName || newTrainingFromBackend.name || '',
//       provider: newTrainingFromBackend.provider || '',
//       startDate: newTrainingFromBackend.startDate || '',
//       endDate: newTrainingFromBackend.endDate || '',
//       status: newTrainingFromBackend.status || 'pending'
//     };

//     setTrainings((prev) => [formattedItem, ...prev]);
//     setFilteredData((prev) => [formattedItem, ...prev]);
//     setPage(0);

//     showNotification('Training added successfully!', 'success');
//   };
  
//   // Handle edit training
//   const handleEditTraining = (updatedTrainingFromBackend) => {
//     const formattedItem = {
//       ...updatedTrainingFromBackend,
//       _id: updatedTrainingFromBackend._id,
//       trainingName: updatedTrainingFromBackend.trainingName || updatedTrainingFromBackend.name || '',
//       provider: updatedTrainingFromBackend.provider || '',
//       startDate: updatedTrainingFromBackend.startDate || '',
//       endDate: updatedTrainingFromBackend.endDate || '',
//       status: updatedTrainingFromBackend.status || 'pending'
//     };

//     setTrainings((prev) =>
//       prev.map((item) =>
//         item._id === formattedItem._id ? formattedItem : item
//       )
//     );

//     setFilteredData((prev) =>
//       prev.map((item) =>
//         item._id === formattedItem._id ? formattedItem : item
//       )
//     );

//     showNotification('Training updated successfully!', 'success');
//   };
  
//   // Handle delete training
//   const handleDeleteTraining = (itemId) => {
//     const updatedData = trainings.filter(item => item._id !== itemId);
//     setTrainings(updatedData);
//     setSelected(selected.filter(id => id !== itemId));
//     showNotification('Training deleted successfully!', 'success');
//   };
  
//   // Handle assign training
//   const handleAssignTraining = () => {
//     fetchAssignedTrainings();
//     showNotification('Training assigned successfully!', 'success');
//   };
  
//   // Handle download certificate - FIXED VERSION
//   const handleDownloadCertificate = async (training) => {
//     if (!training?.certificateFile) {
//       showNotification('Certificate file not available', 'error');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       let fileUrl = training.certificateFile;
      
//       // Construct proper URL if it's relative
//       if (fileUrl && !fileUrl.startsWith('http') && !fileUrl.startsWith('https')) {
//         const cleanPath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
//         fileUrl = `${BASE_URL}/${cleanPath}`;
//       }
      
//       console.log('Downloading certificate from:', fileUrl);
      
//       // Fetch the file with authentication
//       const response = await axios.get(fileUrl, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         responseType: 'blob'
//       });
      
//       // Create blob and trigger download
//       const blob = new Blob([response.data], { 
//         type: response.headers['content-type'] || 'application/pdf' 
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Set filename
//       let filename = `certificate_${training.employeeName || 'training'}_${training.trainingName || 'training'}.pdf`;
//       const contentDisposition = response.headers['content-disposition'];
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1].replace(/['"]/g, '');
//         }
//       }
      
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       showNotification('Certificate downloaded successfully!', 'success');
//     } catch (err) {
//       console.error('Error downloading certificate:', err);
      
//       // Fallback: try opening in new tab
//       try {
//         const token = localStorage.getItem('token');
//         let fileUrl = training.certificateFile;
        
//         if (fileUrl && !fileUrl.startsWith('http') && !fileUrl.startsWith('https')) {
//           const cleanPath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
//           fileUrl = `${BASE_URL}/${cleanPath}`;
//         }
        
//         window.open(`${fileUrl}?token=${token}`, '_blank');
//         showNotification('Opening certificate in new tab...', 'info');
//       } catch (fallbackErr) {
//         console.error('Fallback failed:', fallbackErr);
//         showNotification('Failed to download certificate. Please try again later.', 'error');
//       }
//     }
//   };
  
//   // Handle complete training
//   const handleCompleteTraining = async (training) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await axios.post(
//         `${BASE_URL}/api/trainings/complete`,
//         { recordId: training._id, score: 100 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (response.data.success && response.data.data) {
//         setAssignedTrainings(prev => 
//           prev.map(item => 
//             item._id === training._id 
//               ? { ...item, ...response.data.data, status: 'Completed' }
//               : item
//           )
//         );
//         setFilteredData(prev => 
//           prev.map(item => 
//             item._id === training._id 
//               ? { ...item, ...response.data.data, status: 'Completed' }
//               : item
//           )
//         );
//       } else {
//         setAssignedTrainings(prev => 
//           prev.map(item => 
//             item._id === training._id 
//               ? { ...item, status: 'Completed' }
//               : item
//           )
//         );
//         setFilteredData(prev => 
//           prev.map(item => 
//             item._id === training._id 
//               ? { ...item, status: 'Completed' }
//               : item
//           )
//         );
//       }
      
//       showNotification('Training marked as completed!', 'success');
//     } catch (err) {
//       console.error('Error completing training:', err);
//       showNotification('Failed to mark training as completed', 'error');
//     }
//   };
  
//   // Handle bulk delete
//   const handleBulkDelete = () => {
//     if (!canDelete) return;
//     showNotification('Bulk delete requires API implementation', 'warning');
//   };
  
//   // Action menu handlers
//   const handleActionMenuOpen = (event, item) => {
//     setActionMenuAnchor(event.currentTarget);
//     setSelectedItemForAction(item);
//   };

//   const handleActionMenuClose = () => {
//     setActionMenuAnchor(null);
//     setSelectedItemForAction(null);
//   };
  
//   // Open edit modal
//   const openEditModalHandler = (item) => {
//     if (!canUpdate) return;
//     setSelectedItem(item);
//     setOpenEditModal(true);
//     handleActionMenuClose();
//   };
  
//   // Open view modal
//   const openViewModalHandler = (item) => {
//     if (!canViewPage) return;
//     setSelectedItem(item);
//     setOpenViewModal(true);
//     handleActionMenuClose();
//   };
  
//   // Open delete confirmation
//   const openDeleteDialogHandler = (item) => {
//     if (!canDelete) return;
//     setSelectedItem(item);
//     setOpenDeleteDialog(true);
//     handleActionMenuClose();
//   };
  
//   // Open complete training
//   const openCompleteTrainingHandler = (item) => {
//     if (!canCreate) return;
//     handleCompleteTraining(item);
//     handleActionMenuClose();
//   };
  
//   // Open download certificate
//   const openDownloadCertificateHandler = (item) => {
//     handleDownloadCertificate(item);
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
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };
  
//   // Get status chip color
//   const getStatusChipColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed':
//         return { bgcolor: COLORS.chips.completed, color: COLORS.primary };
//       case 'in progress':
//       case 'inprogress':
//         return { bgcolor: COLORS.chips.inProgress, color: '#0F67B0' };
//       case 'cancelled':
//         return { bgcolor: COLORS.chips.cancelled, color: '#DC2626' };
//       default:
//         return { bgcolor: COLORS.chips.pending, color: '#B45309' };
//     }
//   };
  
//   // Get item initials for avatar
//   const getItemInitials = (itemName) => {
//     if (!itemName) return mode === 'add' ? 'T' : 'A';
//     const words = itemName.split(' ');
//     if (words.length >= 2) {
//       return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
//     }
//     return itemName.substring(0, 2).toUpperCase();
//   };
  
//   // Get avatar color
//   const getAvatarColor = (itemName) => {
//     if (!itemName) return COLORS.primary;
//     const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
//     const charCode = itemName.charCodeAt(0) || 0;
//     return colors[charCode % colors.length];
//   };
  
//   // Paginated data
//   const paginatedData = filteredData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   if (!permissionsLoaded) {
//     return <LoadingState />;
//   }

//   if (!canViewPage && !isSuperAdmin) {
//     return <AccessDenied />;
//   }

//   return (
//     <Box sx={{ p: 2.5 }}>
//       {/* Mode Toggle */}
//       <Box sx={{ mb: 2.5 }}>
//         <ToggleButtonGroup
//           value={mode}
//           exclusive
//           onChange={handleModeChange}
//           sx={{
//             '& .MuiToggleButton-root': {
//               height: 36,
//               px: 3,
//               textTransform: 'none',
//               fontWeight: 500,
//               fontSize: '0.75rem',
//               borderColor: COLORS.border,
//               color: COLORS.text.secondary,
//               '&.Mui-selected': {
//                 bgcolor: COLORS.primary,
//                 color: COLORS.text.light,
//                 '&:hover': {
//                   bgcolor: COLORS.primaryDark,
//                 }
//               }
//             }
//           }}
//         >
//           <ToggleButton value="add">
//             <SchoolIcon sx={{ fontSize: '1rem', mr: 1 }} />
//             Training Master
//           </ToggleButton>
//           <ToggleButton value="assign">
//             <AssignmentIcon sx={{ fontSize: '1rem', mr: 1 }} />
//             Assigned Trainings
//           </ToggleButton>
//         </ToggleButtonGroup>
//       </Box>

//       {/* Page Header */}
//       <Box sx={{ mb: 2.5 }}>
//         <Typography 
//           variant="h5" 
//           component="h1" 
//           sx={{ 
//             fontSize: '1.25rem',
//             fontWeight: 700,
//             color: COLORS.text.primary,
//             mb: 0.5
//           }}
//         >
//           {mode === 'add' ? 'Training Master' : 'Assigned Trainings'}
//         </Typography>
//         <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//           {mode === 'add' 
//             ? 'Manage and organize training programs and courses' 
//             : 'View and manage training assignments to employees'}
//         </Typography>
//       </Box>

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
//           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
//             <TextField
//               placeholder={`Search ${mode === 'add' ? 'trainings' : 'assigned trainings'}...`}
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               sx={{ 
//                 width: { xs: '100%', sm: 360 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1.5,
//                   fontSize: '0.75rem',
//                   '&:hover fieldset': {
//                     borderColor: COLORS.primary,
//                   },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                   </InputAdornment>
//                 ),
//                 sx: { 
//                   height: 36,
//                   bgcolor: COLORS.background.light,
//                   '& input': {
//                     padding: '6px 12px',
//                     fontSize: '0.75rem',
//                     color: COLORS.text.primary,
//                     '&::placeholder': {
//                       color: COLORS.text.tertiary,
//                       fontSize: '0.75rem'
//                     }
//                   }
//                 }
//               }}
//               disabled={loading}
//             />
// {/*             
//             <Tooltip title="Refresh">
//               <IconButton
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 sx={{
//                   color: COLORS.primary,
//                   '&:hover': {
//                     bgcolor: `${COLORS.primary}10`
//                   }
//                 }}
//               >
//                 <RefreshIcon sx={{ fontSize: '1.1rem' }} />
//               </IconButton>
//             </Tooltip> */}
//           </Stack>

//           <Stack direction="row" spacing={1.5} alignItems="center">
//             {mode === 'add' && canDelete && selected.length > 0 && (
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
//                   '&:hover': {
//                     borderColor: '#fecaca',
//                     bgcolor: '#fee2e2'
//                   }
//                 }}
//                 disabled={loading}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}
            
//             {mode === 'add' && canCreate && (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={() => setOpenAddModal(true)}
//                 sx={{
//                   height: 36,
//                   borderRadius: 1.5,
//                   bgcolor: COLORS.primary,
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': {
//                     bgcolor: COLORS.primaryDark,
//                   }
//                 }}
//                 disabled={loading}
//               >
//                 Add Training
//               </Button>
//             )}
            
//             {mode === 'assign' && canCreate && (
//               <Button
//                 variant="contained"
//                 startIcon={<AssignmentIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={() => setOpenAssignModal(true)}
//                 sx={{
//                   height: 36,
//                   borderRadius: 1.5,
//                   bgcolor: COLORS.primary,
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': {
//                     bgcolor: COLORS.primaryDark,
//                   }
//                 }}
//                 disabled={loading}
//               >
//                 Assign Training
//               </Button>
//             )}
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Data Table */}
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
//                 {mode === 'add' && canDelete && (
//                   <TableCell padding="checkbox" sx={{ width: 40 }}>
//                     <Checkbox
//                       indeterminate={selected.length > 0 && selected.length < filteredData.length}
//                       checked={filteredData.length > 0 && selected.length === filteredData.length}
//                       onChange={handleSelectAll}
//                       sx={{
//                         color: COLORS.text.light,
//                         '&.Mui-checked': {
//                           color: COLORS.text.light,
//                         },
//                         '&.MuiCheckbox-indeterminate': {
//                           color: COLORS.text.light,
//                         },
//                         '& .MuiSvgIcon-root': {
//                           fontSize: '1.25rem'
//                         }
//                       }}
//                       disabled={loading || filteredData.length === 0}
//                     />
//                   </TableCell>
//                 )}
                
//                 {mode === 'add' ? (
//                   <>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Training</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Provider</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Start Date</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>End Date</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
//                   </>
//                 ) : (
//                   <>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Employee</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Training</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Start Date</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>End Date</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
//                   </>
//                 )}
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60, color: COLORS.text.light }} align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={mode === 'add' ? (canDelete ? 7 : 6) : 6} align="center" sx={{ py: 6 }}>
//                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
//                       Loading {mode === 'add' ? 'trainings' : 'assigned trainings'}...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={mode === 'add' ? (canDelete ? 7 : 6) : 6} align="center" sx={{ py: 6 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
//                         {searchTerm ? 'No items found' : `No ${mode === 'add' ? 'trainings' : 'assigned trainings'} available`}
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                         {searchTerm ? 'Try adjusting your search terms' : mode === 'add' ? 'Add your first training to get started' : 'Assign training to employees to get started'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedData.map((item, index) => {
//                   const isSelected = selected.includes(item._id);
//                   const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
//                   const avatarColor = getAvatarColor(mode === 'add' ? item.trainingName : item.employeeName);
//                   const statusColors = getStatusChipColor(item.status);

//                   return (
//                     <TableRow
//                       key={item._id || index}
//                       hover
//                       selected={isSelected}
//                       sx={{ 
//                         bgcolor: COLORS.background.white,
//                         '&:hover': { bgcolor: COLORS.background.hover },
//                         '&.Mui-selected': { bgcolor: `${COLORS.primary}10` },
//                         '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border }
//                       }}
//                     >
//                       {mode === 'add' && canDelete && (
//                         <TableCell padding="checkbox" sx={{ width: 40 }}>
//                           <Checkbox
//                             checked={isSelected}
//                             onChange={() => handleSelect(item._id)}
//                             sx={{ color: COLORS.primary }}
//                           />
//                         </TableCell>
//                       )}
                      
//                       {mode === 'add' ? (
//                         <>
//                           <TableCell>
//                             <Stack direction="row" spacing={1.5} alignItems="center">
//                               <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
//                                 {getItemInitials(item.trainingName)}
//                               </Avatar>
//                               <Box>
//                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
//                                   {item.trainingName}
//                                 </Typography>
//                                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                                   ID: {item._id?.slice(-6) || 'N/A'}
//                                 </Typography>
//                               </Box>
//                             </Stack>
//                           </TableCell>
//                           <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{item.provider || '-'}</Typography></TableCell>
//                           <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{formatDate(item.startDate)}</Typography></TableCell>
//                           <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{formatDate(item.endDate)}</Typography></TableCell>
//                           <TableCell>
//                             <Chip label={item.status || 'Pending'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, bgcolor: statusColors.bgcolor, color: statusColors.color, height: 20 }} />
//                           </TableCell>
//                         </>
//                       ) : (
//                         <>
//                           <TableCell>
//                             <Stack direction="row" spacing={1.5} alignItems="center">
//                               <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
//                                 {getItemInitials(item.employeeName)}
//                               </Avatar>
//                               <Box>
//                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
//                                   {item.employeeName}
//                                 </Typography>
//                                 {item.score > 0 && (
//                                   <Typography sx={{ fontSize: '0.65rem', color: COLORS.primary }}>
//                                     Score: {item.score}%
//                                   </Typography>
//                                 )}
//                               </Box>
//                             </Stack>
//                           </TableCell>
//                           <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{item.trainingName}</Typography></TableCell>
//                           <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{formatDate(item.startDate)}</Typography></TableCell>
//                           <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{formatDate(item.endDate)}</Typography></TableCell>
//                           <TableCell>
//                             <Chip label={item.status || 'Pending'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, bgcolor: statusColors.bgcolor, color: statusColors.color, height: 20 }} />
//                           </TableCell>
//                         </>
//                       )}
//                       <TableCell align="center" sx={{ width: 60 }}>
//                         <ActionMenu 
//                           item={item}
//                           onView={openViewModalHandler}
//                           onEdit={openEditModalHandler}
//                           onDelete={openDeleteDialogHandler}
//                           onComplete={openCompleteTrainingHandler}
//                           onDownload={openDownloadCertificateHandler}
//                           anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
//                           onClose={handleActionMenuClose}
//                           onOpen={(e) => handleActionMenuOpen(e, item)}
//                           permissions={userPermissions}
//                           mode={mode}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={filteredData.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             borderTop: `1px solid ${COLORS.border}`,
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//               fontSize: '0.7rem',
//               color: COLORS.text.secondary
//             }
//           }}
//         />
//       </Paper>

//       {/* Modal Components */}
//       {mode === 'add' && (
//         <>
//           {canCreate && (
//             <AddTraining 
//               open={openAddModal}
//               onClose={() => setOpenAddModal(false)}
//               onAdd={handleAddTraining}
//             />
//           )}

//           {selectedItem && (
//             <>
//               {canUpdate && (
//                 <EditTraining 
//                   open={openEditModal}
//                   onClose={() => {
//                     setOpenEditModal(false);
//                     setSelectedItem(null);
//                   }}
//                   training={selectedItem}
//                   onUpdate={handleEditTraining}
//                 />
//               )}

//               {canViewPage && (
//                 <ViewTraining 
//                   open={openViewModal}
//                   onClose={() => {
//                     setOpenViewModal(false);
//                     setSelectedItem(null);
//                   }}
//                   training={selectedItem}
//                   onEdit={() => {
//                     if (canUpdate) {
//                       setOpenViewModal(false);
//                       setOpenEditModal(true);
//                     }
//                   }}
//                 />
//               )}

//               {canDelete && (
//                 <DeleteTraining 
//                   open={openDeleteDialog}
//                   onClose={() => {
//                     setOpenDeleteDialog(false);
//                     setSelectedItem(null);
//                   }}
//                   training={selectedItem}
//                   onDelete={handleDeleteTraining}
//                 />
//               )}
//             </>
//           )}
//         </>
//       )}

//       {mode === 'assign' && canCreate && (
//         <AssignTraining 
//           open={openAssignModal}
//           onClose={() => setOpenAssignModal(false)}
//           trainings={trainings}
//           employees={employees}
//           onAssign={handleAssignTraining}
//         />
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
//             fontSize: '0.75rem',
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//             '& .MuiAlert-icon': {
//               fontSize: '1.25rem'
//             }
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TrainingRecordMaster;


// export default TrainingRecordMaster;

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
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddTraining from './AddTraining';
import EditTraining from './EditTraining';
import ViewTraining from './ViewTraining';
import DeleteTraining from './DeleteTraining';
import AssignTraining from './AssignTraining';

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
    inactive: '#F1F5F9',
    completed: '#9FE2BF',
    pending: '#FEF3C7',
    inProgress: '#E0F2FE',
    cancelled: '#FEE2E2'
  }
};

// Helper function to parse dates in DD/MM/YYYY format
const parseDateString = (dateString) => {
  if (!dateString) return null;
  
  // Check if it's already a valid Date object
  if (dateString instanceof Date) return dateString;
  
  // Check if it's in DD/MM/YYYY format
  if (typeof dateString === 'string' && dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [day, month, year] = dateString.split('/');
    const parsedDate = new Date(year, month - 1, day);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  
  // Try standard date parsing for ISO format or other formats
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
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
const ActionMenu = ({ item, onView, onEdit, onDelete, onComplete, onDownload, anchorEl, onClose, onOpen, permissions, mode }) => {
  const moduleKey = MODULES.TRAINING_MASTER;
  const pageKey = PAGES.TRAINING_RECORDS;
  
  const canView = hasPermission(permissions, moduleKey, pageKey, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, moduleKey, pageKey, ACTIONS.DELETE);
  const canCreate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.CREATE);

  // If no actions available, don't render the menu
  if (!canView && !canUpdate && !canDelete && !(mode === 'assign' && canCreate)) {
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
        {mode === 'add' ? (
          <>
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
            
            {canUpdate && (
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
            
            {(canView || canUpdate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
            
            {canDelete && (
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
          </>
        ) : (
          <>
            {canCreate && (
              <MenuItem 
                onClick={() => {
                  onComplete(item);
                  onClose();
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
                  <CheckCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                    Mark as Completed
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}
            
            {/* Download Certificate Option - Only show for completed trainings with certificate */}
            {item?.status?.toLowerCase() === 'completed' && item?.certificateFile && (
              <>
                <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
                <MenuItem 
                  onClick={() => {
                    onDownload(item);
                    onClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                    <DownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      Download Certificate
                    </Typography>
                  </ListItemText>
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

const TrainingRecordMaster = () => {
  // Mode state
  const [mode, setMode] = useState('add');
  
  // State for data
  const [trainings, setTrainings] = useState([]);
  const [assignedTrainings, setAssignedTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  
  // Menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  
  // Selected item
  const [selectedItem, setSelectedItem] = useState(null);
  
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
      MODULES.TRAINING_MASTER,
      PAGES.TRAINING_RECORDS,
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

  // Fetch data when mode changes
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchEmployees();
      if (mode === 'add') {
        fetchTrainings();
      } else {
        fetchAssignedTrainings();
      }
    }
    setSelected([]);
    setPage(0);
    setSearchInput('');
    setSearchTerm('');
  }, [mode, permissionsLoaded, canViewPage, isSuperAdmin]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/api/trainings/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let list = [];
      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          list = response.data.data;
        } else if (response.data.data?.data) {
          list = response.data.data.data;
        }
      }
      
      const formattedData = list.map(item => ({
        ...item,
        trainingName: item.trainingName || item.name || '',
        provider: item.provider || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        status: item.status || 'pending'
      }));
      
      setTrainings(formattedData);
      setFilteredData(formattedData);
    } catch (err) {
      console.error('Error fetching trainings:', err);
      showNotification('Failed to load trainings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAssignedTrainings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/api/trainings/assigned`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let list = [];
      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          list = response.data.data;
        } else if (response.data.data?.data) {
          list = response.data.data.data;
        }
      }
      
      const formattedData = list.map(item => ({
        ...item,
        employeeName: item.employeeName || item.employee?.name || '',
        trainingName: item.trainingName || item.training?.trainingName || '',
        startDate: item.startDate || item.training?.startDate || '',
        endDate: item.endDate || item.training?.endDate || '',
        status: item.status || 'pending',
        score: item.score || 0,
        certificateFile: item.certificateFile || item.certificate?.file || null
      }));
      
      setAssignedTrainings(formattedData);
      setFilteredData(formattedData);
    } catch (err) {
      console.error('Error fetching assigned trainings:', err);
      showNotification('Failed to load assigned trainings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let list = [];
      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          list = response.data.data;
        } else if (response.data.data?.data) {
          list = response.data.data.data;
        }
      }
      
      setEmployees(list);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    if (mode === 'add') {
      fetchTrainings();
    } else {
      fetchAssignedTrainings();
    }
    showNotification('Data refreshed', 'success');
  };
  
  // Handle mode change
  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    const currentData = mode === 'add' ? trainings : assignedTrainings;
    
    if (!searchTerm) {
      setFilteredData(currentData);
      return;
    }
    
    const value = searchTerm.toLowerCase();
    const filtered = currentData.filter(item => {
      if (mode === 'add') {
        return (
          (item.trainingName?.toLowerCase().includes(value)) ||
          (item.provider?.toLowerCase().includes(value))
        );
      } else {
        return (
          (item.employeeName?.toLowerCase().includes(value)) ||
          (item.trainingName?.toLowerCase().includes(value))
        );
      }
    });
    
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, trainings, assignedTrainings, mode]);
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (!canDelete || mode !== 'add') return;
    
    if (event.target.checked) {
      setSelected(filteredData.map(item => item._id));
    } else {
      setSelected([]);
    }
  };
  
  // Handle single selection
  const handleSelect = (id) => {
    if (!canDelete || mode !== 'add') return;
    
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
  
  // Handle add training
  const handleAddTraining = (newTrainingFromBackend) => {
    const formattedItem = {
      ...newTrainingFromBackend,
      _id: newTrainingFromBackend._id,
      trainingName: newTrainingFromBackend.trainingName || newTrainingFromBackend.name || '',
      provider: newTrainingFromBackend.provider || '',
      startDate: newTrainingFromBackend.startDate || '',
      endDate: newTrainingFromBackend.endDate || '',
      status: newTrainingFromBackend.status || 'pending'
    };

    setTrainings((prev) => [formattedItem, ...prev]);
    setFilteredData((prev) => [formattedItem, ...prev]);
    setPage(0);

    showNotification('Training added successfully!', 'success');
  };
  
  // Handle edit training
  const handleEditTraining = (updatedTrainingFromBackend) => {
    const formattedItem = {
      ...updatedTrainingFromBackend,
      _id: updatedTrainingFromBackend._id,
      trainingName: updatedTrainingFromBackend.trainingName || updatedTrainingFromBackend.name || '',
      provider: updatedTrainingFromBackend.provider || '',
      startDate: updatedTrainingFromBackend.startDate || '',
      endDate: updatedTrainingFromBackend.endDate || '',
      status: updatedTrainingFromBackend.status || 'pending'
    };

    setTrainings((prev) =>
      prev.map((item) =>
        item._id === formattedItem._id ? formattedItem : item
      )
    );

    setFilteredData((prev) =>
      prev.map((item) =>
        item._id === formattedItem._id ? formattedItem : item
      )
    );

    showNotification('Training updated successfully!', 'success');
  };
  
  // Handle delete training
  const handleDeleteTraining = (itemId) => {
    const updatedData = trainings.filter(item => item._id !== itemId);
    setTrainings(updatedData);
    setSelected(selected.filter(id => id !== itemId));
    showNotification('Training deleted successfully!', 'success');
  };
  
  // Handle assign training
  const handleAssignTraining = () => {
    fetchAssignedTrainings();
    showNotification('Training assigned successfully!', 'success');
  };
  
  // Handle download certificate - FIXED VERSION
  const handleDownloadCertificate = async (training) => {
    if (!training?.certificateFile) {
      showNotification('Certificate file not available', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let fileUrl = training.certificateFile;
      
      // Construct proper URL if it's relative
      if (fileUrl && !fileUrl.startsWith('http') && !fileUrl.startsWith('https')) {
        const cleanPath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
        fileUrl = `${BASE_URL}/${cleanPath}`;
      }
      
      console.log('Downloading certificate from:', fileUrl);
      
      // Fetch the file with authentication
      const response = await axios.get(fileUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Create blob and trigger download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename
      let filename = `certificate_${training.employeeName || 'training'}_${training.trainingName || 'training'}.pdf`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification('Certificate downloaded successfully!', 'success');
    } catch (err) {
      console.error('Error downloading certificate:', err);
      
      // Fallback: try opening in new tab
      try {
        const token = localStorage.getItem('token');
        let fileUrl = training.certificateFile;
        
        if (fileUrl && !fileUrl.startsWith('http') && !fileUrl.startsWith('https')) {
          const cleanPath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
          fileUrl = `${BASE_URL}/${cleanPath}`;
        }
        
        window.open(`${fileUrl}?token=${token}`, '_blank');
        showNotification('Opening certificate in new tab...', 'info');
      } catch (fallbackErr) {
        console.error('Fallback failed:', fallbackErr);
        showNotification('Failed to download certificate. Please try again later.', 'error');
      }
    }
  };
  
  // Handle complete training
  const handleCompleteTraining = async (training) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${BASE_URL}/api/trainings/complete`,
        { recordId: training._id, score: 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success && response.data.data) {
        setAssignedTrainings(prev => 
          prev.map(item => 
            item._id === training._id 
              ? { ...item, ...response.data.data, status: 'Completed' }
              : item
          )
        );
        setFilteredData(prev => 
          prev.map(item => 
            item._id === training._id 
              ? { ...item, ...response.data.data, status: 'Completed' }
              : item
          )
        );
      } else {
        setAssignedTrainings(prev => 
          prev.map(item => 
            item._id === training._id 
              ? { ...item, status: 'Completed' }
              : item
          )
        );
        setFilteredData(prev => 
          prev.map(item => 
            item._id === training._id 
              ? { ...item, status: 'Completed' }
              : item
          )
        );
      }
      
      showNotification('Training marked as completed!', 'success');
    } catch (err) {
      console.error('Error completing training:', err);
      showNotification('Failed to mark training as completed', 'error');
    }
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, item) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedItemForAction(item);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedItemForAction(null);
  };
  
  // Open edit modal
  const openEditModalHandler = (item) => {
    if (!canUpdate) return;
    setSelectedItem(item);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewModalHandler = (item) => {
    if (!canViewPage) return;
    setSelectedItem(item);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteDialogHandler = (item) => {
    if (!canDelete) return;
    setSelectedItem(item);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  // Open complete training
  const openCompleteTrainingHandler = (item) => {
    if (!canCreate) return;
    handleCompleteTraining(item);
    handleActionMenuClose();
  };
  
  // Open download certificate
  const openDownloadCertificateHandler = (item) => {
    handleDownloadCertificate(item);
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
  
  // Format date - Updated to handle DD/MM/YYYY format
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const parsedDate = parseDateString(dateString);
    if (!parsedDate) return '-';
    
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status chip color
  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { bgcolor: COLORS.chips.completed, color: COLORS.primary };
      case 'in progress':
      case 'inprogress':
        return { bgcolor: COLORS.chips.inProgress, color: '#0F67B0' };
      case 'cancelled':
        return { bgcolor: COLORS.chips.cancelled, color: '#DC2626' };
      default:
        return { bgcolor: COLORS.chips.pending, color: '#B45309' };
    }
  };
  
  // Get item initials for avatar
  const getItemInitials = (itemName) => {
    if (!itemName) return mode === 'add' ? 'T' : 'A';
    const words = itemName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return itemName.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color
  const getAvatarColor = (itemName) => {
    if (!itemName) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = itemName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  if (!canViewPage && !isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Mode Toggle */}
      <Box sx={{ mb: 2.5 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          sx={{
            '& .MuiToggleButton-root': {
              height: 36,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              borderColor: COLORS.border,
              color: COLORS.text.secondary,
              '&.Mui-selected': {
                bgcolor: COLORS.primary,
                color: COLORS.text.light,
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
              }
            }
          }}
        >
          <ToggleButton value="add">
            <SchoolIcon sx={{ fontSize: '1rem', mr: 1 }} />
            Training Master
          </ToggleButton>
          <ToggleButton value="assign">
            <AssignmentIcon sx={{ fontSize: '1rem', mr: 1 }} />
            Assigned Trainings
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

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
          {mode === 'add' ? 'Training Master' : 'Assigned Trainings'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          {mode === 'add' 
            ? 'Manage and organize training programs and courses' 
            : 'View and manage training assignments to employees'}
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder={`Search ${mode === 'add' ? 'trainings' : 'assigned trainings'}...`}
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
              
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {mode === 'add' && canDelete && selected.length > 0 && (
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
            
            {mode === 'add' && canCreate && (
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
                Add Training
              </Button>
            )}
            
            {mode === 'assign' && canCreate && (
              <Button
                variant="contained"
                startIcon={<AssignmentIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAssignModal(true)}
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
                Assign Training
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Data Table */}
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
                {mode === 'add' && canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < filteredData.length}
                      checked={filteredData.length > 0 && selected.length === filteredData.length}
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
                      disabled={loading || filteredData.length === 0}
                    />
                  </TableCell>
                )}
                
                {mode === 'add' ? (
                  <>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Training</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Provider</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Training</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
                  </>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60, color: COLORS.text.light }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={mode === 'add' ? (canDelete ? 7 : 6) : 6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading {mode === 'add' ? 'trainings' : 'assigned trainings'}...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={mode === 'add' ? (canDelete ? 7 : 6) : 6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No items found' : `No ${mode === 'add' ? 'trainings' : 'assigned trainings'} available`}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : mode === 'add' ? 'Add your first training to get started' : 'Assign training to employees to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => {
                  const isSelected = selected.includes(item._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
                  const avatarColor = getAvatarColor(mode === 'add' ? item.trainingName : item.employeeName);
                  const statusColors = getStatusChipColor(item.status);

                  return (
                    <TableRow
                      key={item._id || index}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '&.Mui-selected': { bgcolor: `${COLORS.primary}10` },
                        '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border }
                      }}
                    >
                      {mode === 'add' && canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(item._id)}
                            sx={{ color: COLORS.primary }}
                          />
                        </TableCell>
                      )}
                      
                      {mode === 'add' ? (
                        <>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                                {getItemInitials(item.trainingName)}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                  {item.trainingName}
                                </Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                  ID: {item._id?.slice(-6) || 'N/A'}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{item.provider || '-'}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{formatDate(item.startDate)}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{formatDate(item.endDate)}</Typography></TableCell>
                          <TableCell>
                            <Chip label={item.status || 'Pending'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, bgcolor: statusColors.bgcolor, color: statusColors.color, height: 20 }} />
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                                {getItemInitials(item.employeeName)}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                  {item.employeeName}
                                </Typography>
                                {item.score > 0 && (
                                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.primary }}>
                                    Score: {item.score}%
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{item.trainingName}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{formatDate(item.startDate)}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{formatDate(item.endDate)}</Typography></TableCell>
                          <TableCell>
                            <Chip label={item.status || 'Pending'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, bgcolor: statusColors.bgcolor, color: statusColors.color, height: 20 }} />
                          </TableCell>
                        </>
                      )}
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={item}
                          onView={openViewModalHandler}
                          onEdit={openEditModalHandler}
                          onDelete={openDeleteDialogHandler}
                          onComplete={openCompleteTrainingHandler}
                          onDownload={openDownloadCertificateHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, item)}
                          permissions={userPermissions}
                          mode={mode}
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
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            }
          }}
        />
      </Paper>

      {/* Modal Components */}
      {mode === 'add' && (
        <>
          {canCreate && (
            <AddTraining 
              open={openAddModal}
              onClose={() => setOpenAddModal(false)}
              onAdd={handleAddTraining}
            />
          )}

          {selectedItem && (
            <>
              {canUpdate && (
                <EditTraining 
                  open={openEditModal}
                  onClose={() => {
                    setOpenEditModal(false);
                    setSelectedItem(null);
                  }}
                  training={selectedItem}
                  onUpdate={handleEditTraining}
                />
              )}

              {canViewPage && (
                <ViewTraining 
                  open={openViewModal}
                  onClose={() => {
                    setOpenViewModal(false);
                    setSelectedItem(null);
                  }}
                  training={selectedItem}
                  onEdit={() => {
                    if (canUpdate) {
                      setOpenViewModal(false);
                      setOpenEditModal(true);
                    }
                  }}
                />
              )}

              {canDelete && (
                <DeleteTraining 
                  open={openDeleteDialog}
                  onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedItem(null);
                  }}
                  training={selectedItem}
                  onDelete={handleDeleteTraining}
                />
              )}
            </>
          )}
        </>
      )}

      {mode === 'assign' && canCreate && (
        <AssignTraining 
          open={openAssignModal}
          onClose={() => setOpenAssignModal(false)}
          trainings={trainings}
          employees={employees}
          onAssign={handleAssignTraining}
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

export default TrainingRecordMaster;