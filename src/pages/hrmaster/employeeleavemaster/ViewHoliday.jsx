// //employee can see list of all holidays

// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Chip,
//   CircularProgress,
//   Alert,
//   Stack,
//   TablePagination
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Search as SearchIcon,
//   Event as EventIcon,
//   CalendarToday as CalendarIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const ViewHoliday = ({ open, onClose }) => {
//   const [holidays, setHolidays] = useState([]);
//   const [filteredHolidays, setFilteredHolidays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     if (open) {
//       fetchHolidays();
//     }
//   }, [open]);

//   useEffect(() => {
//     // Filter holidays based on search term
//     const filtered = holidays.filter(holiday => 
//       holiday.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       holiday.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       holiday.Description?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredHolidays(filtered);
//     setPage(0);
//   }, [searchTerm, holidays]);

//   const fetchHolidays = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BASE_URL}/api/holidays`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         // Sort holidays by date (upcoming first)
//         const sortedHolidays = (response.data.data || []).sort((a, b) => {
//           return new Date(a.Date) - new Date(b.Date);
//         });
//         setHolidays(sortedHolidays);
//         setFilteredHolidays(sortedHolidays);
//       } else {
//         setError('Failed to load holidays');
//       }
//     } catch (err) {
//       console.error('Error fetching holidays:', err);
//       setError('Failed to load holidays. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const isUpcoming = (dateString) => {
//     const holidayDate = new Date(dateString);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return holidayDate >= today;
//   };

//   // Pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Get paginated data
//   const paginatedHolidays = filteredHolidays.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="md" 
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           minHeight: '60vh',
//           maxHeight: '80vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//         color: 'white',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         py: 2
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <CalendarIcon />
//           <Typography variant="h6">Holiday Calendar</Typography>
//         </Box>
//         <IconButton onClick={onClose} sx={{ color: 'white' }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 3 }}>
//         {/* Search Bar */}
//         <Box sx={{ mb: 3, mt: 1 }}>
//           <TextField
//             fullWidth
//             placeholder="Search holidays by name or description..."
//             size="small"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: '#64748B' }} />
//                 </InputAdornment>
//               ),
//               sx: { bgcolor: '#f8fafc' }
//             }}
//           />
//         </Box>

//         {/* Holiday Stats */}
//         {!loading && !error && holidays.length > 0 && (
//           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
//             <Chip 
//               icon={<EventIcon />} 
//               label={`Total Holidays: ${holidays.length}`}
//               variant="outlined"
//               sx={{ bgcolor: '#f0f9ff' }}
//             />
//             <Chip 
//               icon={<EventIcon />} 
//               label={`Upcoming: ${holidays.filter(h => isUpcoming(h.Date)).length}`}
//               color="success"
//               variant="outlined"
//             />
//           </Stack>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
//             <CircularProgress />
//           </Box>
//         )}

//         {/* Error State */}
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {/* Empty State */}
//         {!loading && !error && filteredHolidays.length === 0 && (
//           <Box sx={{ textAlign: 'center', py: 8 }}>
//             <CalendarIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
//             <Typography variant="h6" color="textSecondary" gutterBottom>
//               No Holidays Found
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               {searchTerm ? 'Try adjusting your search term' : 'There are no holidays scheduled'}
//             </Typography>
//           </Box>
//         )}

//         {/* Holidays Table */}
//         {!loading && !error && filteredHolidays.length > 0 && (
//           <>
//             <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#f8fafc' }}>
//                     <TableCell sx={{ fontWeight: 600 }}>Holiday Name</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Day</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {paginatedHolidays.map((holiday) => {
//                     const holidayDate = new Date(holiday.Date);
//                     const upcoming = isUpcoming(holiday.Date);
                    
//                     return (
//                       <TableRow 
//                         key={holiday._id}
//                         hover
//                         sx={{
//                           '&:hover': { bgcolor: '#f1f5f9' },
//                           ...(upcoming && {
//                             bgcolor: '#f0fdf4'
//                           })
//                         }}
//                       >
//                         <TableCell>
//                           <Typography fontWeight={500}>
//                             {holiday.Title || holiday.Name}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Typography>
//                             {formatDate(holiday.Date)}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Chip 
//                             label={holidayDate.toLocaleDateString('en-US', { weekday: 'long' })}
//                             size="small"
//                             variant="outlined"
//                             sx={{ 
//                               bgcolor: '#f1f5f9',
//                               color: '#334155'
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Typography variant="body2" color="textSecondary">
//                             {holiday.Description || 'No description'}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Chip 
//                             label={upcoming ? 'Upcoming' : 'Past'}
//                             size="small"
//                             color={upcoming ? 'success' : 'default'}
//                             sx={{ 
//                               ...(!upcoming && {
//                                 bgcolor: '#e2e8f0',
//                                 color: '#475569'
//                               })
//                             }}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Pagination */}
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//               <TablePagination
//                 component="div"
//                 count={filteredHolidays.length}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//               />
//             </Box>
//           </>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
//         <Button 
//           onClick={onClose}
//           variant="contained"
//           sx={{
//             background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//             '&:hover': {
//               background: 'linear-gradient(135deg, #0e7490 0%, #00B4D8 50%, #164e63 100%)'
//             }
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewHoliday;

//employee can see list of all holidays

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  TablePagination
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  Today as TodayIcon,
  Celebration as CelebrationIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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

const ViewHoliday = ({ open, onClose }) => {
  const [holidays, setHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (open) {
      fetchHolidays();
    }
  }, [open]);

  useEffect(() => {
    // Filter holidays based on search term
    const filtered = holidays.filter(holiday => 
      holiday.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHolidays(filtered);
    setPage(0);
  }, [searchTerm, holidays]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/api/holidays`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Sort holidays by date (upcoming first)
        const sortedHolidays = (response.data.data || []).sort((a, b) => {
          return new Date(a.Date) - new Date(b.Date);
        });
        setHolidays(sortedHolidays);
        setFilteredHolidays(sortedHolidays);
      } else {
        setError('Failed to load holidays');
      }
    } catch (err) {
      console.error('Error fetching holidays:', err);
      setError('Failed to load holidays. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const isUpcoming = (dateString) => {
    const holidayDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return holidayDate >= today;
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  // Group holidays by month
  const groupHolidaysByMonth = () => {
    const grouped = {};
    filteredHolidays.forEach(holiday => {
      const month = getMonthName(holiday.Date);
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(holiday);
    });
    return grouped;
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated data
  const paginatedHolidays = filteredHolidays.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate statistics
  const upcomingHolidays = holidays.filter(h => isUpcoming(h.Date));
  const pastHolidays = holidays.filter(h => !isUpcoming(h.Date));
  const currentMonthHolidays = holidays.filter(h => {
    const now = new Date();
    const holidayDate = new Date(h.Date);
    return holidayDate.getMonth() === now.getMonth() && 
           holidayDate.getFullYear() === now.getFullYear();
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 1.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ color: COLORS.primary }} />
          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: COLORS.text.primary
            }}
          >
            Holiday Calendar
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: COLORS.text.secondary,
            '&:hover': {
              color: COLORS.primary,
              bgcolor: COLORS.primaryLight
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search holidays by name or description..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: COLORS.text.tertiary, fontSize: '1rem' }} />
                </InputAdornment>
              ),
              sx: { 
                bgcolor: COLORS.background.white,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': {
                    borderColor: COLORS.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORS.primary,
                    borderWidth: 1
                  }
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
              }
            }}
          />
        </Box>

        {/* Holiday Stats Cards */}
        {!loading && !error && holidays.length > 0 && (
          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.primary}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <EventIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                Total: {holidays.length}
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 1.5, 
              bgcolor: COLORS.status.success, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.primary}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TodayIcon sx={{ fontSize: '1rem', color: COLORS.primaryDark }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                Upcoming: {upcomingHolidays.length}
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 1.5, 
              bgcolor: COLORS.status.warning, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.primary}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <CelebrationIcon sx={{ fontSize: '1rem', color: COLORS.primaryDark }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                This Month: {currentMonthHolidays.length}
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: COLORS.primary }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1.5,
              '& .MuiAlert-icon': {
                fontSize: '1.25rem',
                alignItems: 'center'
              },
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && filteredHolidays.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CalendarIcon sx={{ fontSize: 64, color: COLORS.text.tertiary, mb: 2 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: COLORS.text.secondary, 
                fontWeight: 500,
                fontSize: '0.9rem',
                mb: 1
              }}
            >
              No Holidays Found
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: COLORS.text.tertiary,
                fontSize: '0.75rem'
              }}
            >
              {searchTerm ? 'Try adjusting your search term' : 'There are no holidays scheduled'}
            </Typography>
          </Box>
        )}

        {/* Holidays Table */}
        {!loading && !error && filteredHolidays.length > 0 && (
          <>
            <TableContainer 
              component={Paper} 
              variant="outlined" 
              sx={{ 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`,
                overflow: 'auto'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: COLORS.text.light,
                      fontSize: '0.7rem',
                      py: 1.5
                    }}>
                      Holiday Name
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: COLORS.text.light,
                      fontSize: '0.7rem',
                      py: 1.5
                    }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: COLORS.text.light,
                      fontSize: '0.7rem',
                      py: 1.5
                    }}>
                      Day
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: COLORS.text.light,
                      fontSize: '0.7rem',
                      py: 1.5
                    }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: COLORS.text.light,
                      fontSize: '0.7rem',
                      py: 1.5
                    }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedHolidays.map((holiday, index) => {
                    const holidayDate = new Date(holiday.Date);
                    const upcoming = isUpcoming(holiday.Date);
                    
                    return (
                      <TableRow 
                        key={holiday._id || index}
                        hover
                        sx={{
                          '&:hover': { bgcolor: COLORS.background.hover },
                          ...(upcoming && {
                            bgcolor: `${COLORS.status.success}30`
                          }),
                          '&:last-child td, &:last-child th': {
                            borderBottom: 0
                          }
                        }}
                      >
                        <TableCell>
                          <Typography 
                            sx={{ 
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }}
                          >
                            {holiday.Title || holiday.Name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDisplayDate(holiday.Date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={holidayDate.toLocaleDateString('en-US', { weekday: 'long' })}
                            size="small"
                            sx={{ 
                              bgcolor: COLORS.background.light,
                              color: COLORS.text.secondary,
                              fontSize: '0.65rem',
                              height: 24,
                              '& .MuiChip-label': {
                                px: 1,
                                fontSize: '0.65rem'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '0.7rem', 
                              color: COLORS.text.secondary 
                            }}
                          >
                            {holiday.Description || 'No description'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={upcoming ? 'Upcoming' : 'Past'}
                            size="small"
                            sx={{ 
                              bgcolor: upcoming ? COLORS.status.success : COLORS.chips.inactive,
                              color: upcoming ? COLORS.primaryDark : COLORS.text.secondary,
                              fontSize: '0.65rem',
                              height: 24,
                              fontWeight: 500,
                              '& .MuiChip-label': {
                                px: 1,
                                fontSize: '0.65rem'
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <TablePagination
                component="div"
                count={filteredHolidays.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  '& .MuiTablePagination-selectLabel': {
                    fontSize: '0.7rem',
                    color: COLORS.text.secondary
                  },
                  '& .MuiTablePagination-displayedRows': {
                    fontSize: '0.7rem',
                    color: COLORS.text.secondary
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.7rem'
                  },
                  '& .MuiMenuItem-root': {
                    fontSize: '0.7rem'
                  },
                  '& .MuiTablePagination-actions button': {
                    fontSize: '0.7rem'
                  }
                }}
              />
            </Box>
          </>
        )}
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
          onClick={onClose}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewHoliday;