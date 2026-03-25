// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Stack,
//   Button,
//   TextField,
//   InputAdornment,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@mui/material";
// import { Search as SearchIcon } from "@mui/icons-material";

// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// import AssignTraining from "./AssignTraining";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const AssignTrainingPage = () => {
//   const [records, setRecords] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [search, setSearch] = useState("");

//   const [trainings, setTrainings] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   const [openAssign, setOpenAssign] = useState(false);

//   useEffect(() => {
//     fetchRecords();
//     fetchTrainings();
//     fetchEmployees();
//   }, []);

//   const fetchRecords = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/trainings/all-records`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (res.data.success) {
//         setRecords(res.data.data);
//         setFiltered(res.data.data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchTrainings = async () => {
//     const token = localStorage.getItem("token");

//     const res = await axios.get(`${BASE_URL}/api/trainings/all`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     setTrainings(res.data.data || []);
//   };

//   const fetchEmployees = async () => {
//     const token = localStorage.getItem("token");

//     const res = await axios.get(`${BASE_URL}/api/employees`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     setEmployees(res.data.data || []);
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearch(value);

//     const filteredData = records.filter(
//       (r) =>
//         r.trainingName?.toLowerCase().includes(value) ||
//         r.employeeName?.toLowerCase().includes(value)
//     );

//     setFiltered(filteredData);
//   };

//   return (
//     <Box sx={{ p: 3 }}>

//       <Typography
//         variant="h5"
//         sx={{
//           fontWeight: 600,
//           background: HEADER_GRADIENT,
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         Assign Trainings
//       </Typography>

//       {/* SEARCH + BUTTON */}

//       <Paper sx={{ p: 2, mt: 2 }}>
//         <Stack direction="row" justifyContent="space-between">

//           <TextField
//             size="small"
//             placeholder="Search..."
//             value={search}
//             onChange={handleSearch}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Button
//             variant="contained"
//             sx={{ background: HEADER_GRADIENT }}
//             onClick={() => setOpenAssign(true)}
//           >
//             Assign Training
//           </Button>

//         </Stack>
//       </Paper>

//       {/* TABLE */}

//       <Paper sx={{ mt: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ background: HEADER_GRADIENT }}>
//               <TableCell sx={{ color: "#fff" }}>Employee</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Training</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Status</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {filtered.map((row) => (
//               <TableRow key={row._id}>
//                 <TableCell>
//                   {row.employeeName || "N/A"}
//                 </TableCell>
//                 <TableCell>{row.trainingName}</TableCell>
//                 <TableCell>{row.status}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>

//       {/* MODAL */}

//       <AssignTraining
//         open={openAssign}
//         onClose={() => {
//           setOpenAssign(false);
//           fetchRecords(); // refresh
//         }}
//         trainings={trainings}
//         employees={employees}
//       />

//     </Box>
//   );
// };

// export default AssignTrainingPage;