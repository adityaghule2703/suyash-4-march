// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   TextField,
//   MenuItem,
//   Grid,
//   Box,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   Chip,
//   Alert,
//   CircularProgress,
//   IconButton,
//   Stepper,
//   Step,
//   StepLabel,
//   LinearProgress
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   CloudUpload as CloudUploadIcon,
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
//   Info as InfoIcon,
//   Description as DescriptionIcon,
//   PictureAsPdf as PdfIcon,
//   Image as ImageIcon,
//   InsertDriveFile as FileIcon,
//   Delete as DeleteIcon,
//   Assignment as AssignmentIcon,
//   Person as PersonIcon,
//   WorkOutline,
//   BusinessOutlined,
//   Margin
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useDropzone } from 'react-dropzone';
// import BASE_URL from '../../../../config/Config';
// import { SchoolIcon } from 'lucide-react';

// const UploadDocument = ({ open, onClose, onSubmit, candidateId = null, documentType = null }) => {
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [candidates, setCandidates] = useState([]);
//   const [fetchingCandidates, setFetchingCandidates] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [documentFile, setDocumentFile] = useState(null);
//   const [documentTypeValue, setDocumentTypeValue] = useState(documentType || '');
//   const [description, setDescription] = useState('');
//   const [uploadedDocument, setUploadedDocument] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [activeStep, setActiveStep] = useState(0);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const steps = ['Select Candidate', 'Upload Document', 'Confirm & Submit'];

//   const documentTypes = [
//     { value: 'resume', label: 'Resume/CV', icon: <DescriptionIcon />, description: 'Professional resume or curriculum vitae' },
//     { value: 'offer_letter', label: 'Offer Letter', icon: <AssignmentIcon />, description: 'Job offer letter' },
//     { value: 'appointment_letter', label: 'Appointment Letter', icon: <AssignmentIcon />, description: 'Official appointment letter' },
//     { value: 'ctc_breakdown', label: 'CTC Breakdown', icon: <BusinessOutlined />, description: 'Salary and compensation structure' },
//     { value: 'aadhar', label: 'Aadhar Card', icon: <PersonIcon />, description: 'Government ID proof' },
//     { value: 'pan', label: 'PAN Card', icon: <PersonIcon />, description: 'Permanent Account Number' },
//     { value: 'passport', label: 'Passport', icon: <PersonIcon />, description: 'International travel document' },
//     { value: 'voter_id', label: 'Voter ID', icon: <PersonIcon />, description: 'Voter identification' },
//     { value: 'driving_license', label: 'Driving License', icon: <PersonIcon />, description: 'Driver\'s license' },
//     { value: 'educational_certificate', label: 'Educational Certificate', icon: <SchoolIcon />, description: 'Educational qualification documents' },
//     { value: 'experience_certificate', label: 'Experience Certificate', icon: <WorkOutline />, description: 'Previous employment proof' },
//     { value: 'salary_slip', label: 'Salary Slip', icon: <WorkOutline />, description: 'Recent salary slips' },
//     { value: 'bank_statement', label: 'Bank Statement', icon: <BusinessOutlined />, description: 'Bank account statement' },
//     { value: 'photograph', label: 'Photograph', icon: <ImageIcon />, description: 'Recent passport size photo' },
//     { value: 'other', label: 'Other', icon: <FileIcon />, description: 'Other documents' }
//   ];

//   useEffect(() => {
//     if (open) fetchCandidates();
//   }, [open]);

//   useEffect(() => {
//     if (candidateId) setSelectedCandidate({ _id: candidateId });
//   }, [candidateId]);

//   const fetchCandidates = async () => {
//     setFetchingCandidates(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/candidates`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) setCandidates(response.data.data || []);
//     } catch (err) {
//       console.error('Error fetching candidates:', err);
//       setError('Failed to fetch candidates');
//     } finally {
//       setFetchingCandidates(false);
//     }
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     if (!file) return;

//     if (file.size > 10 * 1024 * 1024) {
//       setError('File size must be less than 10MB');
//       return;
//     }

//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
//     if (!allowedTypes.includes(file.type)) {
//       setError('Only PDF, JPG, JPEG, and PNG files are allowed');
//       return;
//     }

//     setDocumentFile(file);
//     setError('');
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
//     maxFiles: 1,
//     multiple: false
//   });

//   const handleCandidateChange = (e) => {
//     const candidate = candidates.find(c => c._id === e.target.value);
//     setSelectedCandidate(candidate);
//   };

//   const handleRemoveFile = () => setDocumentFile(null);

//   const handleNext = () => {
//     if (activeStep === 0 && !selectedCandidate) {
//       setError('Please select a candidate');
//       return;
//     }
//     if (activeStep === 1) {
//       if (!documentFile) {
//         setError('Please upload a document');
//         return;
//       }
//       if (!documentTypeValue) {
//         setError('Please select document type');
//         return;
//       }
//     }
//     setError('');
//     setActiveStep(prev => prev + 1);
//   };

//   const handleBack = () => setActiveStep(prev => prev - 1);

//   const handleReset = () => {
//     setActiveStep(0);
//     setSelectedCandidate(null);
//     setDocumentFile(null);
//     setDocumentTypeValue(documentType || '');
//     setDescription('');
//     setUploadedDocument(null);
//     setUploadProgress(0);
//     setError('');
//     setSuccess('');
//   };

//   const handleClose = () => {
//     handleReset();
//     onClose();
//   };

//   const handleUploadDocument = async () => {
//     setUploading(true);
//     setError('');
//     setUploadProgress(0);

//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('document', documentFile);
//       formData.append('candidateId', selectedCandidate._id);
//       formData.append('type', documentTypeValue);
//       if (description) formData.append('description', description);

//       const response = await axios.post(
//         `${BASE_URL}/api/documents/upload`,
//         formData,
//         {
//           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//           onUploadProgress: (progressEvent) => {
//             const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(percent);
//           }
//         }
//       );

//       if (response.data.success) {
//         setUploadedDocument(response.data.data);
//         setSuccess(response.data.message || 'Document uploaded successfully!');
//         if (onSubmit) onSubmit(response.data.data);

//         // Close the dialog after successful upload
//         setTimeout(() => {
//           handleClose();
//         }, 1500);
//       }
//     } catch (err) {
//       console.error('Error uploading document:', err);
//       setError(err.response?.data?.message || 'Failed to upload document');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
//   };

//   const getFileIcon = (file) => {
//     if (!file) return <FileIcon />;
//     if (file.type === 'application/pdf') return <PdfIcon sx={{ color: '#F40F02' }} />;
//     if (file.type.startsWith('image/')) return <ImageIcon sx={{ color: '#2196F3' }} />;
//     return <FileIcon sx={{ color: '#757575' }} />;
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={3} sx={{ Margin: "-5px" }}>
//             <Paper sx={{ p: 2, m: -2 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//                 Select Candidate
//               </Typography>
//               {fetchingCandidates ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
//                   <CircularProgress size={32} />
//                 </Box>
//               ) : (
//                 <FormControl fullWidth size="small">
//                   <InputLabel>Select Candidate</InputLabel>
//                   <Select
//                     value={selectedCandidate?._id || ''}
//                     onChange={handleCandidateChange}
//                     label="Select Candidate"
//                     MenuProps={{
//                       anchorOrigin: {
//                         vertical: 'bottom',
//                         horizontal: 'left',
//                       },
//                       transformOrigin: {
//                         vertical: 'top',
//                         horizontal: 'left',
//                       },
//                       PaperProps: {
//                         style: {
//                           maxHeight: 200, // Reduced height
//                           width: 'auto',
//                         },
//                       },
//                     }}
//                   >
//                     {candidates.map(cand => (
//                       <MenuItem key={cand._id} value={cand._id}>
//                         {cand.firstName} {cand.lastName} - {cand.candidateId || cand.email}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//               {selectedCandidate && (
//                 <Box sx={{ mt: 1, bgcolor: '#F8FAFC', borderRadius: 1 }}>
//                   <Grid container spacing={8}>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Full Name</Typography>
//                       <Typography variant="body2" fontWeight={500}>
//                         {selectedCandidate.firstName} {selectedCandidate.lastName}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Email</Typography>
//                       <Typography variant="body2">{selectedCandidate.email}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Phone</Typography>
//                       <Typography variant="body2">{selectedCandidate.phone}</Typography>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               )}
//             </Paper>
//             <Paper sx={{ p: 1, bgcolor: '#E3F2FD', border: '1px solid #90CAF9' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <InfoIcon sx={{ color: '#1976D2' }} />
//                 <Typography variant="body2">
//                   Select the candidate for whom you want to upload a document.
//                 </Typography>
//               </Box>
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={3}>
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//                 Upload Document
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <FormControl size="small" sx={{ width: 250 }}>
//                     <InputLabel>Document Type</InputLabel>
//                     <Select
//                       value={documentTypeValue}
//                       onChange={(e) => setDocumentTypeValue(e.target.value)}
//                       label="Document Type"
//                       MenuProps={{
//                         anchorOrigin: {
//                           vertical: 'bottom',
//                           horizontal: 'left',
//                         },
//                         transformOrigin: {
//                           vertical: 'top',
//                           horizontal: 'left',
//                         },
//                         PaperProps: {
//                           style: {
//                             maxHeight: 200, // Adjust this value as needed
//                             width: 250, // Set a specific width for better readability
//                           },
//                         },
//                       }}
//                     >
//                       {documentTypes.map(type => (
//                         <MenuItem key={type.value} value={type.value}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             {type.icon}
//                             <Box>
//                               <Typography variant="body2">{type.label}</Typography>
//                               <Typography variant="caption" color="textSecondary">
//                                 {type.description}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
//                     {/* File Upload Area */}
//                     <Paper
//                       {...getRootProps()}
//                       sx={{
//                         flex: 1,
//                         p: 1,
//                         height: 60,
//                         width: 400,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         // border: `2px dashed ${isDragActive ? '#1976D2' : documentFile ? '#4CAF50' : '#BDBDBD'}`,
//                         borderRadius: 2,
//                         bgcolor: isDragActive ? '#E3F2FD' : documentFile ? '#E8F5E9' : '#F8FAFC',
//                         cursor: 'pointer',
//                         textAlign: 'center',
//                         transition: 'all 0.2s',
//                         '&:hover': {
//                           borderColor: '#1976D2',
//                           bgcolor: '#E3F2FD',
//                           transform: 'translateY(-2px)',
//                           boxShadow: 1
//                         }
//                       }}
//                     >
//                       <input {...getInputProps()} />
//                       {documentFile ? (
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             {getFileIcon(documentFile)}
//                             <Box sx={{ textAlign: 'left' }}>
//                               <Typography variant="body2" fontWeight={500}>{documentFile.name}</Typography>
//                               <Typography variant="caption" color="textSecondary">
//                                 {formatFileSize(documentFile.size)}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </Box>
//                       ) : (
//                         <Box>
//                           <CloudUploadIcon sx={{ fontSize: 32, color: '#9E9E9E', mb: 0.5 }} />
//                           <Typography variant="body2" fontWeight={500} gutterBottom>
//                             Drag & Drop or Click to Upload
//                             <br />
//                             <span style={{ fontSize: '0.70rem', color: '#64748B', opacity: 0.8 }}>PDF, JPG, JPEG, PNG (Max: 10MB)</span>
//                           </Typography>
//                         </Box>
//                       )}
//                     </Paper>

//                     {/* Remove Button - Only show when file is selected */}
//                     {documentFile && (
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         size="small"
//                         onClick={handleRemoveFile}
//                         sx={{
//                           height: 40,
//                           borderRadius: 2,
//                           textTransform: 'none',
//                           borderColor: '#ef5350',
//                           color: '#ef5350',
//                           '&:hover': {
//                             borderColor: '#d32f2f',
//                             backgroundColor: '#ffebee'
//                           }
//                         }}
//                       >
//                         <DeleteIcon />
//                       </Button>
//                     )}
//                   </Box>
//                 </Grid>

//                 {uploading && (
//                   <Grid item xs={12}>
//                     <Box sx={{ width: '100%' }}>
//                       <Typography variant="body2" color="textSecondary" gutterBottom>
//                         Uploading... {uploadProgress}%
//                       </Typography>
//                       <LinearProgress
//                         variant="determinate"
//                         value={uploadProgress}
//                         sx={{
//                           height: 6,
//                           borderRadius: 3,
//                           backgroundColor: '#E0E0E0',
//                           '& .MuiLinearProgress-bar': {
//                             background: 'linear-gradient(90deg, #1976D2, #64B5F6)'
//                           }
//                         }}
//                       />
//                     </Box>
//                   </Grid>
//                 )}

//                 {uploadedDocument && (
//                   <Grid item xs={12}>
//                     <Alert
//                       severity="success"
//                       icon={<CheckCircleIcon />}
//                       sx={{
//                         mb: 2,
//                         borderRadius: 2,
//                         '& .MuiAlert-icon': { color: '#2E7D32' }
//                       }}
//                     >
//                       Document uploaded successfully!
//                     </Alert>
//                     <Paper sx={{
//                       p: 2,
//                       bgcolor: '#E8F5E9',
//                       border: '1px solid #81C784',
//                       borderRadius: 2
//                     }}>
//                       <Typography variant="subtitle2" gutterBottom sx={{ color: '#2E7D32', fontWeight: 600 }}>
//                         Uploaded Document Details
//                       </Typography>
//                       <Grid container spacing={2}>
//                         <Grid item xs={6}>
//                           <Typography variant="caption" color="textSecondary">Document ID</Typography>
//                           <Typography variant="body2" fontWeight={500}>{uploadedDocument.documentId}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="caption" color="textSecondary">Status</Typography>
//                           <Chip
//                             label={uploadedDocument.status || 'pending'}
//                             size="small"
//                             sx={{
//                               height: 20,
//                               fontSize: '11px',
//                               fontWeight: 500,
//                               backgroundColor: '#FFE0B2',
//                               color: '#E65100'
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Typography variant="caption" color="textSecondary">Filename</Typography>
//                           <Typography variant="body2">{uploadedDocument.filename}</Typography>
//                         </Grid>
//                       </Grid>
//                     </Paper>
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={3}>
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//                 Confirm Upload
//               </Typography>
//               <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1, mb: 2 }}>
//                 <Grid container spacing={10}>
//                   <Grid item xs={12} md={6}>
//                     <Typography variant="caption" color="textSecondary">Candidate</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {selectedCandidate?.firstName} {selectedCandidate?.lastName}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Typography variant="caption" color="textSecondary">Document Type</Typography>
//                     <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
//                       {documentTypes.find(t => t.value === documentTypeValue)?.label || documentTypeValue}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Typography variant="caption" color="textSecondary">Filename</Typography>
//                     <Typography variant="body2">{documentFile?.name}</Typography>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Typography variant="caption" color="textSecondary">File Size</Typography>
//                     <Typography variant="body2">{formatFileSize(documentFile?.size)}</Typography>
//                   </Grid>
//                   {description && (
//                     <Grid item xs={12}>
//                       <Typography variant="caption" color="textSecondary">Description</Typography>
//                       <Typography variant="body2">{description}</Typography>
//                     </Grid>
//                   )}
//                 </Grid>
//               </Box>

//               <Alert severity="warning" icon={<WarningIcon />}>
//                 <Typography variant="body2">
//                   Once uploaded, documents cannot be deleted. Please ensure you have selected the correct file.
//                 </Typography>
//               </Alert>
//             </Paper>
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ borderBottom: 1, borderColor: '#E0E0E0', bgcolor: '#F8FAFC', px: 3, py: 2 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography variant="h6" fontWeight={600}>Upload Document</Typography>
//             <Typography variant="caption" color="textSecondary">Upload candidate documents for verification</Typography>
//           </Box>
//           <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
//         </Box>
//       </DialogTitle>
//       <DialogContent sx={{ pt: 4, px: 4 }}>
//         {(error || success) && (
//           <Alert severity={error ? 'error' : 'success'} onClose={() => error ? setError('') : setSuccess('')} sx={{ mb: 3 }}>
//             {error || success}
//           </Alert>
//         )}
//         <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
//           {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
//         </Stepper>
//         <Box sx={{ minHeight: 200 }}>{getStepContent(activeStep)}</Box>
//       </DialogContent>
//       <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: '#E0E0E0', bgcolor: '#F8FAFC' }}>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Box>
//           <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleUploadDocument}
//               disabled={uploading}
//               startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
//               sx={{ minWidth: 200 }}
//             >
//               {uploading ? 'Uploading...' : 'Upload Document'}
//             </Button>
//           ) : (
//             <Button variant="contained" onClick={handleNext}>Next</Button>
//           )}
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UploadDocument;


import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  WorkOutline as WorkOutlineIcon,
  BusinessOutlined as BusinessOutlinedIcon,
  School as SchoolIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import BASE_URL from '../../../../config/Config';

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

const documentTypes = [
  { value: 'resume', label: 'Resume/CV', icon: <DescriptionIcon sx={{ fontSize: '0.8rem' }} />, description: 'Professional resume or curriculum vitae' },
  { value: 'offer_letter', label: 'Offer Letter', icon: <AssignmentIcon sx={{ fontSize: '0.8rem' }} />, description: 'Job offer letter' },
  { value: 'appointment_letter', label: 'Appointment Letter', icon: <AssignmentIcon sx={{ fontSize: '0.8rem' }} />, description: 'Official appointment letter' },
  { value: 'ctc_breakdown', label: 'CTC Breakdown', icon: <BusinessOutlinedIcon sx={{ fontSize: '0.8rem' }} />, description: 'Salary and compensation structure' },
  { value: 'aadhar', label: 'Aadhar Card', icon: <PersonIcon sx={{ fontSize: '0.8rem' }} />, description: 'Government ID proof' },
  { value: 'pan', label: 'PAN Card', icon: <PersonIcon sx={{ fontSize: '0.8rem' }} />, description: 'Permanent Account Number' },
  { value: 'passport', label: 'Passport', icon: <PersonIcon sx={{ fontSize: '0.8rem' }} />, description: 'International travel document' },
  { value: 'voter_id', label: 'Voter ID', icon: <PersonIcon sx={{ fontSize: '0.8rem' }} />, description: 'Voter identification' },
  { value: 'driving_license', label: 'Driving License', icon: <PersonIcon sx={{ fontSize: '0.8rem' }} />, description: 'Driver\'s license' },
  { value: 'educational_certificate', label: 'Educational Certificate', icon: <SchoolIcon sx={{ fontSize: '0.8rem' }} />, description: 'Educational qualification documents' },
  { value: 'experience_certificate', label: 'Experience Certificate', icon: <WorkOutlineIcon sx={{ fontSize: '0.8rem' }} />, description: 'Previous employment proof' },
  { value: 'salary_slip', label: 'Salary Slip', icon: <WorkOutlineIcon sx={{ fontSize: '0.8rem' }} />, description: 'Recent salary slips' },
  { value: 'bank_statement', label: 'Bank Statement', icon: <BusinessOutlinedIcon sx={{ fontSize: '0.8rem' }} />, description: 'Bank account statement' },
  { value: 'photograph', label: 'Photograph', icon: <ImageIcon sx={{ fontSize: '0.8rem' }} />, description: 'Recent passport size photo' },
  { value: 'other', label: 'Other', icon: <FileIcon sx={{ fontSize: '0.8rem' }} />, description: 'Other documents' }
];

const steps = ['Select Candidate', 'Upload Document', 'Confirm & Submit'];

const UploadDocument = ({ open, onClose, onSubmit, candidateId = null, documentType = null }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [fetchingCandidates, setFetchingCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentTypeValue, setDocumentTypeValue] = useState(documentType || '');
  const [description, setDescription] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) fetchCandidates();
  }, [open]);

  useEffect(() => {
    if (candidateId) setSelectedCandidate({ _id: candidateId });
  }, [candidateId]);

  const fetchCandidates = async () => {
    setFetchingCandidates(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setCandidates(response.data.data || []);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to fetch candidates');
    } finally {
      setFetchingCandidates(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG, JPEG, and PNG files are allowed');
      return;
    }

    setDocumentFile(file);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  });

  const handleCandidateChange = (e) => {
    const candidate = candidates.find(c => c._id === e.target.value);
    setSelectedCandidate(candidate);
    if (error) setError('');
  };

  const handleRemoveFile = () => setDocumentFile(null);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateStep = () => {
    if (activeStep === 0 && !selectedCandidate) {
      setError('Please select a candidate');
      return false;
    }
    if (activeStep === 1) {
      if (!documentFile) {
        setError('Please upload a document');
        return false;
      }
      if (!documentTypeValue) {
        setError('Please select document type');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleReset = () => {
    setActiveStep(0);
    setSelectedCandidate(null);
    setDocumentFile(null);
    setDocumentTypeValue(documentType || '');
    setDescription('');
    setUploadedDocument(null);
    setUploadProgress(0);
    setError('');
    setSuccess('');
    setTouched({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleUploadDocument = async () => {
    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('document', documentFile);
      formData.append('candidateId', selectedCandidate._id);
      formData.append('type', documentTypeValue);
      if (description) formData.append('description', description);

      const response = await axios.post(`${BASE_URL}/api/documents/upload`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      if (response.data.success) {
        setUploadedDocument(response.data.data);
        setSuccess(response.data.message || 'Document uploaded successfully!');
        if (onSubmit) onSubmit(response.data.data);

        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (file) => {
    if (!file) return <FileIcon />;
    if (file.type === 'application/pdf') return <PdfIcon sx={{ color: '#F40F02', fontSize: '1.2rem' }} />;
    if (file.type.startsWith('image/')) return <ImageIcon sx={{ color: '#2196F3', fontSize: '1.2rem' }} />;
    return <FileIcon sx={{ color: '#757575', fontSize: '1.2rem' }} />;
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
      '&.Mui-error fieldset': { borderColor: '#EF4444' }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Select Candidate
                </Typography>
              </Box>
              {fetchingCandidates ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                </Box>
              ) : (
                <FormControl fullWidth size="small" error={touched.candidate && !selectedCandidate}>
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Select Candidate *</InputLabel>
                  <Select
                    value={selectedCandidate?._id || ''}
                    onChange={handleCandidateChange}
                    onBlur={() => handleBlur('candidate')}
                    label="Select Candidate *"
                    sx={inputStyle}
                    MenuProps={{
                      PaperProps: { sx: { maxHeight: 200, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' } }
                    }}
                  >
                    {candidates.map(cand => (
                      <MenuItem key={cand._id} value={cand._id} sx={{ fontSize: '0.75rem' }}>
                        {cand.firstName} {cand.lastName} - {cand.candidateId || cand.email}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.candidate && !selectedCandidate && (
                    <FormHelperText sx={{ fontSize: '0.65rem' }}>Please select a candidate</FormHelperText>
                  )}
                </FormControl>
              )}
              {selectedCandidate && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Full Name</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {selectedCandidate.firstName} {selectedCandidate.lastName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Email</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {selectedCandidate.email}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Phone</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {selectedCandidate.phone}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              Select the candidate for whom you want to upload a document.
            </Alert>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CloudUploadIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Upload Document
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Document Type *</Typography>
                  <FormControl fullWidth size="small" error={touched.documentType && !documentTypeValue}>
                    <Select
                      value={documentTypeValue}
                      onChange={(e) => setDocumentTypeValue(e.target.value)}
                      onBlur={() => handleBlur('documentType')}
                      displayEmpty
                      sx={inputStyle}
                      MenuProps={{
                        PaperProps: { sx: { maxHeight: 200, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' } }
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                        <em>Select document type</em>
                      </MenuItem>
                      {documentTypes.map(type => (
                        <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {type.icon}
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem' }}>{type.label}</Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {type.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.documentType && !documentTypeValue && (
                      <FormHelperText sx={{ fontSize: '0.65rem' }}>Please select document type</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>File *</Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Paper
                      {...getRootProps()}
                      sx={{
                        flex: 1,
                        p: 2.5,
                        minHeight: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px dashed ${isDragActive ? COLORS.primary : documentFile ? COLORS.status.success : COLORS.border}`,
                        borderRadius: 1.5,
                        bgcolor: isDragActive ? COLORS.primaryLight : documentFile ? COLORS.status.success : COLORS.background.light,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: COLORS.primary,
                          bgcolor: COLORS.primaryLight,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(6, 60, 63, 0.1)'
                        }
                      }}
                    >
                      <input {...getInputProps()} />
                      {documentFile ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {getFileIcon(documentFile)}
                          <Box sx={{ textAlign: 'left' }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                              {documentFile.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {formatFileSize(documentFile.size)}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center' }}>
                          <CloudUploadIcon sx={{ fontSize: 32, color: COLORS.text.tertiary, mb: 1 }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                            Drag & Drop or Click to Upload
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            PDF, JPG, JPEG, PNG (Max: 10MB)
                          </Typography>
                        </Box>
                      )}
                    </Paper>

                    {documentFile && (
                      <IconButton
                        onClick={handleRemoveFile}
                        sx={{ color: '#EF4444', mt: 1, '&:hover': { bgcolor: COLORS.status.error } }}
                      >
                        <DeleteIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    )}
                  </Box>
                </Grid>

                {uploading && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ width: '100%' }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Uploading... {uploadProgress}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: COLORS.primaryLight,
                          '& .MuiLinearProgress-bar': { bgcolor: COLORS.primary, borderRadius: 2 }
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {uploadedDocument && (
                  <Grid size={{ xs: 12 }}>
                    <Alert
                      severity="success"
                      icon={<CheckCircleIcon sx={{ fontSize: '0.9rem' }} />}
                      sx={{ borderRadius: 1.5, fontSize: '0.75rem', mb: 2 }}
                    >
                      Document uploaded successfully!
                    </Alert>
                    <Paper sx={{ p: 2, bgcolor: COLORS.status.success, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primaryDark, mb: 1 }}>
                        Uploaded Document Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography sx={labelStyle}>Document ID</Typography>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                            {uploadedDocument.documentId}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography sx={labelStyle}>Status</Typography>
                          <Chip
                            label={uploadedDocument.status || 'pending'}
                            size="small"
                            sx={{
                              bgcolor: COLORS.status.warning,
                              color: '#92400E',
                              fontSize: '0.6rem',
                              height: 20
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={labelStyle}>Filename</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {uploadedDocument.filename}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Confirm Upload
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}`, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Candidate</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Document Type</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {documentTypes.find(t => t.value === documentTypeValue)?.label || documentTypeValue}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Filename</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {documentFile?.name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>File Size</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatFileSize(documentFile?.size)}
                    </Typography>
                  </Grid>
                  {description && (
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>Description</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {description}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Alert severity="warning" icon={<WarningIcon sx={{ fontSize: '0.9rem' }} />} sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                Once uploaded, documents cannot be deleted. Please ensure you have selected the correct file.
              </Alert>
            </Paper>
          </Stack>
        );

      default: return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Upload Document
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text.secondary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
              }}
            >
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleUploadDocument}
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <CloudUploadIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 140,
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocument;