// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Chip,
//   Box,
//   Typography,
//   Tooltip,
//   CircularProgress,
//   Alert,
//   Button,
//   Avatar,
//   Stack,
//   alpha,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   TablePagination
// } from '@mui/material';
// import {
//   Download as DownloadIcon,
//   Edit as EditIcon,
//   Refresh as RefreshIcon,
//   Verified as VerifiedIcon,
//   VerifiedUser as VerifiedUserIcon,
//   CheckCircle as CheckCircleIcon,
//   Error as ErrorIcon,
//   Person as PersonIcon,
//   CloudUpload as CloudUploadIcon,
//   Search as SearchIcon,
//   Delete as DeleteIcon,
//   ArrowUpward as ArrowUpwardIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';
// import VerifyDocument from './VerifyDocument';
// import UploadDocument from './UploadDocument';

// // Color constants from ref code
// const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
// const STRIPE_COLOR_ODD = '#FFFFFF';
// const STRIPE_COLOR_EVEN = '#f8fafc';
// const HOVER_COLOR = '#f1f5f9';
// const PRIMARY_BLUE = '#00B4D8';
// const TEXT_COLOR_HEADER = '#FFFFFF';
// const TEXT_COLOR_MAIN = '#0f172a';

// const DocumentManagement = () => {
//   const [documents, setDocuments] = useState([]);
//   const [filteredDocuments, setFilteredDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Table state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selected, setSelected] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');

//   // State for verify dialog
//   const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
//   const [selectedVerifyDocument, setSelectedVerifyDocument] = useState(null);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   // State for upload dialog
//   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

//   // Fetch documents on component mount
//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   // Filter documents based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredDocuments(documents);
//     } else {
//       const filtered = documents.filter(doc => 
//         (doc.documentId && doc.documentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (doc._id && doc._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (doc.type && doc.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (doc.candidateId?.fullName && doc.candidateId.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (doc.candidateId?.firstName && doc.candidateId.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (doc.candidateId?.lastName && doc.candidateId.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (doc.candidateId?.email && doc.candidateId.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (doc.status && doc.status.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredDocuments(filtered);
//     }
//     setPage(0);
//   }, [searchTerm, documents]);

//   const fetchDocuments = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/documents`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         console.log('Fetched documents:', response.data.data);
//         setDocuments(response.data.data);
//         setFilteredDocuments(response.data.data);
//         setTotalCount(response.data.total || response.data.data.length);
//       } else {
//         setError('Failed to fetch documents');
//       }
//     } catch (err) {
//       console.error('Error fetching documents:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to fetch documents');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search
//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Handle select all
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(paginatedDocuments.map(doc => doc._id || doc.documentId));
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

//   // Handle bulk delete
//   const handleBulkDelete = () => {
//     if (selected.length === 0) return;
//     // Add your bulk delete API call here
//     console.log('Bulk delete for:', selected);
//     // Show notification or alert
//     alert(`Bulk delete for ${selected.length} items - API coming soon`);
//   };

//   // Handle verify button click
//   const handleVerifyClick = (document) => {
//     console.log('Selected document for verification:', document);

//     const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//     if (!token) {
//       alert('You are not logged in. Please log in again.');
//       return;
//     }

//     setSelectedVerifyDocument(document);
//     const candidateData = document.candidateId || {};

//     setSelectedCandidate({
//       name: candidateData.fullName || `${candidateData.firstName || ''} ${candidateData.lastName || ''}`.trim() || 'Unknown',
//       email: candidateData.email || '',
//       position: document.position || 'N/A',
//       id: candidateData._id || candidateData.id
//     });

//     setVerifyDialogOpen(true);
//   };

//   // Handle upload button click
//   const handleUploadClick = () => {
//     setUploadDialogOpen(true);
//   };

//   // Handle upload complete
//   const handleUploadComplete = (uploadedDoc) => {
//     console.log('Upload completed:', uploadedDoc);
//     fetchDocuments();
//   };

//   // Handle verify complete
//   const handleVerifyComplete = (updatedData) => {
//     console.log('Verification completed:', updatedData);

//     setDocuments(prevDocuments =>
//       prevDocuments.map(doc => {
//         if (doc._id === updatedData.id || doc.documentId === updatedData.documentId) {
//           return {
//             ...doc,
//             status: updatedData.status === 'verified' ? 'verified' : 'rejected',
//             verificationStatus: updatedData.status,
//             verificationDetails: {
//               ...doc.verificationDetails,
//               verifiedBy: updatedData.verifiedBy,
//               verifiedAt: updatedData.verifiedDate,
//               comments: updatedData.comments
//             }
//           };
//         }
//         return doc;
//       })
//     );

//     setVerifyDialogOpen(false);
//     setSelectedVerifyDocument(null);
//     setSelectedCandidate(null);
//   };

//   // Status color mapping
//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'warning',
//       'sent': 'info',
//       'generated': 'success',
//       'verified': 'success',
//       'rejected': 'error',
//       'expired': 'default',
//       'uploaded': 'info'
//     };
//     return colors[status?.toLowerCase()] || 'default';
//   };

//   // Get status icon
//   const getStatusIcon = (status) => {
//     const statusLower = status?.toLowerCase();
//     switch (statusLower) {
//       case 'verified': return <CheckCircleIcon fontSize="small" />;
//       case 'rejected': return <ErrorIcon fontSize="small" />;
//       case 'pending': return <VerifiedUserIcon fontSize="small" />;
//       default: return null;
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (!bytes || bytes === 0) return 'Unknown';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
//   };

//   // Get candidate name from the candidateId object
//   const getCandidateName = (doc) => {
//     if (!doc.candidateId) return 'Unknown';
//     if (doc.candidateId.fullName) return doc.candidateId.fullName;
//     if (doc.candidateId.firstName || doc.candidateId.lastName) {
//       return `${doc.candidateId.firstName || ''} ${doc.candidateId.lastName || ''}`.trim();
//     }
//     return 'Unknown';
//   };

//   // Get candidate email from the candidateId object
//   const getCandidateEmail = (doc) => {
//     return doc.candidateId?.email || '';
//   };

//   // Get candidate initials for avatar
//   const getInitials = (name) => {
//     if (!name || name === 'Unknown') return '?';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//   };

//   // Paginated documents
//   const paginatedDocuments = filteredDocuments.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   // Check if any documents are selected
//   const hasSelected = selected.length > 0;

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3, mt: -8 }}>
//       {/* Header - Styled exactly like reference code */}
      

//       {/* Action Bar - Styled like reference code */}
//    {/* Action Bar - Connected to table */}
// <Paper sx={{ 
//   p: 2, 
//   borderRadius: 2,
//   bgcolor: '#FFFFFF',
//   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//   border: '1px solid #e2e8f0',
//   borderBottomLeftRadius: 0,
//   borderBottomRightRadius: 0,
//   borderBottom: 'none',
//   mb: 0
// }}>
//   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
//     {/* Search Bar */}
//     <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
//       <TextField
//         placeholder="Search by ID, Candidate, Type, Status..."
//         size="small"
//         value={searchTerm}
//         onChange={handleSearch}
//         sx={{ 
//           width: { xs: '100%', sm: 400 },
//           '& .MuiOutlinedInput-root': {
//             borderRadius: 1.5,
//             '&:hover fieldset': {
//               borderColor: PRIMARY_BLUE,
//             },
//           }
//         }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon sx={{ color: '#64748B' }} />
//             </InputAdornment>
//           ),
//           sx: { 
//             height: 40,
//             bgcolor: '#f8fafc',
//             '& input': {
//               padding: '8px 12px',
//               fontSize: '0.875rem'
//             }
//           }
//         }}
//       />
//     </Stack>

//     {/* Action Buttons */}
//     <Stack direction="row" spacing={2} alignItems="center">
//       {hasSelected && (
//         <Button
//           variant="outlined"
//           color="error"
//           startIcon={<DeleteIcon />}
//           onClick={handleBulkDelete}
//           sx={{ 
//             height: 40,
//             borderRadius: 1.5,
//             textTransform: 'none',
//             fontSize: '0.875rem',
//             fontWeight: 500
//           }}
//         >
//           Delete ({selected.length})
//         </Button>
//       )}
//       <Button
//         variant="contained"
//         startIcon={<CloudUploadIcon />}
//         onClick={handleUploadClick}
//         sx={{
//           height: 40,
//           borderRadius: 1.5,
//           background: HEADER_GRADIENT,
//           fontSize: '0.875rem',
//           fontWeight: 500,
//           textTransform: 'none',
//           '&:hover': {
//             opacity: 0.9,
//             background: HEADER_GRADIENT,
//           }
//         }}
//       >
//         Upload Document
//       </Button>
//     </Stack>
//   </Stack>
// </Paper>

// {error && (
//   <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//     {error}
//   </Alert>
// )}

// {/* Table - Connected to action bar */}
// <Paper sx={{ 
//   width: '100%', 
//   borderRadius: 2, 
//   overflow: 'hidden',
//   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//   border: '1px solid #e2e8f0',
//   borderTopLeftRadius: 0,
//   borderTopRightRadius: 0,
//   borderTop: 'none'
// }}>
// </Paper>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Table - Styled like reference code */}
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
//                     indeterminate={selected.length > 0 && selected.length < paginatedDocuments.length}
//                     checked={paginatedDocuments.length > 0 && selected.length === paginatedDocuments.length}
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
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Document ID
//                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Candidate
//                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Type
//                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Status
//                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Size
//                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
//                   <Stack direction="row" alignItems="center" spacing={0.5}>
//                     Uploaded
//                     <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
//                   </Stack>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, width: 80 }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedDocuments.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <CloudUploadIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
//                       <Typography variant="body1" color="#64748B" fontWeight={500}>
//                         {searchTerm ? 'No documents found matching your search' : 'No documents found'}
//                       </Typography>
//                       <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
//                         {searchTerm ? 'Try adjusting your search terms' : 'Click "Upload Document" to add new documents'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedDocuments.map((doc, index) => {
//                   const status = doc.status || 'pending';
//                   const isPending = status.toLowerCase() === 'pending';
//                   const candidateName = getCandidateName(doc);
//                   const candidateEmail = getCandidateEmail(doc);
//                   const isOddRow = index % 2 === 0;
//                   const isSelected = selected.includes(doc._id || doc.documentId);
//                   const docId = doc._id || doc.documentId;

//                   return (
//                     <TableRow
//                       key={docId}
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
//                           onChange={() => handleSelect(docId)}
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
//                           {doc.documentId || docId?.substring(0, 8) || 'N/A'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" spacing={1} alignItems="center">
//                           <Avatar 
//                             sx={{ 
//                               width: 32, 
//                               height: 32, 
//                               bgcolor: PRIMARY_BLUE,
//                               fontSize: '0.875rem'
//                             }}
//                           >
//                             {getInitials(candidateName)}
//                           </Avatar>
//                           <Box>
//                             <Typography variant="body2" fontWeight={500}>
//                               {candidateName}
//                             </Typography>
//                             <Typography variant="caption" color="#64748B">
//                               {candidateEmail}
//                             </Typography>
//                           </Box>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={doc.type?.replace(/_/g, ' ') || 'Document'}
//                           size="small"
//                           variant="outlined"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={status}
//                           color={getStatusColor(status)}
//                           size="small"
//                           icon={getStatusIcon(status)}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {formatFileSize(doc.fileSize)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric',
//                             year: 'numeric'
//                           }) : 'N/A'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center">
//                         {isPending && (
//                           <Button
//                             size="small"
//                             variant="contained"
//                             onClick={() => handleVerifyClick(doc)}
//                             sx={{
//                               backgroundColor: '#10B981',
//                               color: 'white',
//                               fontSize: '0.75rem',
//                               py: 0.5,
//                               px: 1,
//                               minWidth: 60,
//                               '&:hover': {
//                                 backgroundColor: '#059669'
//                               }
//                             }}
//                           >
//                             Verify
//                           </Button>
//                         )}
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
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={filteredDocuments.length}
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

//       {/* Verify Dialog */}
//       <VerifyDocument
//         open={verifyDialogOpen}
//         onClose={() => {
//           setVerifyDialogOpen(false);
//           setSelectedVerifyDocument(null);
//           setSelectedCandidate(null);
//         }}
//         document={selectedVerifyDocument}
//         candidate={selectedCandidate}
//         onComplete={handleVerifyComplete}
//       />

//       {/* Upload Dialog */}
//       <UploadDocument
//         open={uploadDialogOpen}
//         onClose={() => setUploadDialogOpen(false)}
//         onSubmit={handleUploadComplete}
//       />
//     </Box>
//   );
// };

// export default DocumentManagement;

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
  Avatar,
  CircularProgress,
  TableSortLabel
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
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Verified as VerifiedIcon,
  VerifiedUser as VerifiedUserIcon,
  Description as DescriptionIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import VerifyDocument from './VerifyDocument';
import UploadDocument from './UploadDocument';

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
const STATUS_STYLES = {
  verified: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Verified' },
  rejected: { bg: COLORS.status.error, color: '#991B1B', icon: <ErrorIcon sx={{ fontSize: '0.7rem' }} />, label: 'Rejected' },
  pending: { bg: COLORS.status.warning, color: '#92400E', icon: <VerifiedUserIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending' },
  uploaded: { bg: COLORS.status.info, color: COLORS.primaryDark, icon: <CloudUploadIcon sx={{ fontSize: '0.7rem' }} />, label: 'Uploaded' },
  sent: { bg: COLORS.status.info, color: '#0369A1', icon: <AssignmentIcon sx={{ fontSize: '0.7rem' }} />, label: 'Sent' },
  generated: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <DescriptionIcon sx={{ fontSize: '0.7rem' }} />, label: 'Generated' }
};

const getStatusStyle = (status) => {
  return STATUS_STYLES[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <AssignmentIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Unknown' };
};

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/api/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setDocuments(response.data.data || []);
        setFilteredDocuments(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.response?.data?.message || 'Failed to fetch documents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    let filtered = [...documents];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        (doc.documentId?.toLowerCase().includes(term)) ||
        (doc._id?.toLowerCase().includes(term)) ||
        (doc.type?.toLowerCase().includes(term)) ||
        (doc.candidateId?.fullName?.toLowerCase().includes(term)) ||
        (doc.candidateId?.firstName?.toLowerCase().includes(term)) ||
        (doc.candidateId?.lastName?.toLowerCase().includes(term)) ||
        (doc.candidateId?.email?.toLowerCase().includes(term)) ||
        (doc.status?.toLowerCase().includes(term))
      );
    }
    
    if (orderBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (orderBy === 'candidate') {
          aValue = a.candidateId?.fullName || `${a.candidateId?.firstName || ''} ${a.candidateId?.lastName || ''}`;
          bValue = b.candidateId?.fullName || `${b.candidateId?.firstName || ''} ${b.candidateId?.lastName || ''}`;
        } else if (orderBy === 'type') {
          aValue = a.type || '';
          bValue = b.type || '';
        } else if (orderBy === 'status') {
          aValue = a.status || '';
          bValue = b.status || '';
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
    
    setFilteredDocuments(filtered);
    setPage(0);
  }, [documents, searchTerm, orderBy, order]);

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

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedDocuments.map(doc => doc._id || doc.documentId));
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
    fetchDocuments();
    showNotification('Data refreshed', 'success');
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };

  const handleVerifyClick = (document) => {
    setSelectedDocument(document);
    const candidateData = document.candidateId || {};
    setSelectedCandidate({
      name: candidateData.fullName || `${candidateData.firstName || ''} ${candidateData.lastName || ''}`.trim() || 'Unknown',
      email: candidateData.email || '',
      position: document.position || 'N/A',
      id: candidateData._id || candidateData.id
    });
    setVerifyDialogOpen(true);
  };

  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadComplete = () => {
    fetchDocuments();
    showNotification('Document uploaded successfully', 'success');
  };

  const handleVerifyComplete = () => {
    fetchDocuments();
    showNotification('Document verified successfully', 'success');
    setVerifyDialogOpen(false);
    setSelectedDocument(null);
    setSelectedCandidate(null);
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCandidateName = (doc) => {
    if (!doc.candidateId) return 'Unknown';
    if (doc.candidateId.fullName) return doc.candidateId.fullName;
    if (doc.candidateId.firstName || doc.candidateId.lastName) {
      return `${doc.candidateId.firstName || ''} ${doc.candidateId.lastName || ''}`.trim();
    }
    return 'Unknown';
  };

  const getCandidateEmail = (doc) => {
    return doc.candidateId?.email || '';
  };

  const getAvatarInitials = (name) => {
    if (!name || name === 'Unknown') return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const paginatedDocuments = filteredDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
          Document Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and verify candidate documents
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
              placeholder="Search by ID, Candidate, Type, Status..."
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
              startIcon={<CloudUploadIcon sx={{ fontSize: '1rem' }} />}
              onClick={handleUploadClick}
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
              Upload Document
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2.5, borderRadius: 1.5, fontSize: '0.75rem' }}
          action={
            <Button color="inherit" size="small" onClick={fetchDocuments}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Documents Table */}
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
                    indeterminate={selected.length > 0 && selected.length < paginatedDocuments.length}
                    checked={paginatedDocuments.length > 0 && selected.length === paginatedDocuments.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: COLORS.text.light,
                      '&.Mui-checked': { color: COLORS.text.light },
                      '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                      '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                    }}
                    disabled={loading || paginatedDocuments.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  <TableSortLabel
                    active={orderBy === 'documentId'}
                    direction={orderBy === 'documentId' ? order : 'asc'}
                    onClick={() => handleRequestSort('documentId')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Document ID
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
                  <TableSortLabel
                    active={orderBy === 'type'}
                    direction={orderBy === 'type' ? order : 'asc'}
                    onClick={() => handleRequestSort('type')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Size
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  <TableSortLabel
                    active={orderBy === 'createdAt'}
                    direction={orderBy === 'createdAt' ? order : 'asc'}
                    onClick={() => handleRequestSort('createdAt')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Uploaded
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
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading documents...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <DescriptionIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {isFilterActive ? 'No documents match your filters' : 'No documents available'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {isFilterActive ? 'Try adjusting your search terms' : 'Click "Upload Document" to add new documents'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDocuments.map((doc, index) => {
                  const isSelected = selected.includes(doc._id || doc.documentId);
                  const statusStyle = getStatusStyle(doc.status);
                  const candidateName = getCandidateName(doc);
                  const isPending = doc.status?.toLowerCase() === 'pending';

                  return (
                    <TableRow
                      key={doc._id || doc.documentId}
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
                          onChange={() => handleSelect(doc._id || doc.documentId)}
                          sx={{
                            color: COLORS.primary,
                            '&.Mui-checked': { color: COLORS.primary },
                            '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                          {doc.documentId || doc._id?.slice(-6).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
                            {getAvatarInitials(candidateName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                              {candidateName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {getCandidateEmail(doc)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={doc.type?.replace(/_/g, ' ') || 'Document'}
                          size="small"
                          sx={{
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primaryDark,
                            fontSize: '0.65rem',
                            height: 24
                          }}
                        />
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
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatFileSize(doc.fileSize)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {formatDate(doc.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {isPending && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleVerifyClick(doc)}
                            sx={{
                              height: 28,
                              px: 1.5,
                              borderRadius: 1.5,
                              bgcolor: '#10B981',
                              fontSize: '0.65rem',
                              textTransform: 'none',
                              '&:hover': { bgcolor: '#059669' }
                            }}
                          >
                            Verify
                          </Button>
                        )}
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
          count={filteredDocuments.length}
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

      {/* Verify Dialog */}
      <VerifyDocument
        open={verifyDialogOpen}
        onClose={() => {
          setVerifyDialogOpen(false);
          setSelectedDocument(null);
          setSelectedCandidate(null);
        }}
        document={selectedDocument}
        candidate={selectedCandidate}
        onComplete={handleVerifyComplete}
      />

      {/* Upload Dialog */}
      <UploadDocument
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSubmit={handleUploadComplete}
      />

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

export default DocumentManagement;