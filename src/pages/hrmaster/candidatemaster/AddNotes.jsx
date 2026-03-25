// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Alert,
//   Typography,
//   Paper,
//   Box,
//   IconButton,
//   TextField,
//   Chip,
//   Avatar,
//   Divider,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   ListItemSecondaryAction,
//   Grid
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   NoteAdd as NoteAddIcon,
//   CheckCircle as CheckCircleIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Comment as CommentIcon,
//   History as HistoryIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Feedback as FeedbackIcon,
//   Notifications as NotificationsIcon,
//   Info as InfoIcon,
//   Event as EventIcon,
//   Assessment as AssessmentIcon,
//   Assignment as AssignmentIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const AddNotes = ({ open, onClose, onAdd, candidateId, candidateData }) => {
//   const [formData, setFormData] = useState({
//     text: '',
//     type: 'General'
//   });
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [candidate, setCandidate] = useState(candidateData || null);
//   const [notes, setNotes] = useState([]);
//   const [editingNote, setEditingNote] = useState(null);

//   // Note types with icons and colors - using available icons
//   const noteTypes = [
//     { value: 'General', label: 'General', icon: <InfoIcon />, color: '#1976D2', bg: '#E3F2FD' },
//     { value: 'Interview', label: 'Interview', icon: <EventIcon />, color: '#7B1FA2', bg: '#F3E5F5' },
//     { value: 'Feedback', label: 'Feedback', icon: <AssessmentIcon />, color: '#2E7D32', bg: '#E8F5E8' },
//     { value: 'Follow-up', label: 'Follow-up', icon: <NotificationsIcon />, color: '#F57C00', bg: '#FFF3E0' },
//     { value: 'Task', label: 'Task', icon: <AssignmentIcon />, color: '#0288D1', bg: '#E1F5FE' }
//   ];

//   // Fetch candidate details if not provided
//   useEffect(() => {
//     if (open && !candidateData && candidateId) {
//       fetchCandidateDetails();
//     } else if (candidateData) {
//       setCandidate(candidateData);
//       setNotes(candidateData.notes || []);
//     }
//   }, [open, candidateData, candidateId]);

//   // Fetch candidate details
//   const fetchCandidateDetails = async () => {
//     setFetchLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/candidates/${candidateId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         setCandidate(response.data.data);
//         setNotes(response.data.data.notes || []);
//       } else {
//         setError(response.data.message || 'Failed to fetch candidate details');
//       }
//     } catch (err) {
//       console.error('Error fetching candidate details:', err);
//       setError(err.response?.data?.message || 'Failed to fetch candidate details');
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.text.trim()) {
//       setError('Note text is required');
//       return false;
//     }
//     if (formData.text.trim().length < 3) {
//       setError('Note must be at least 3 characters');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/api/candidates/${candidateId}/notes`,
//         {
//           text: formData.text,
//           type: formData.type
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setSuccess('Note added successfully!');
//         // Add new note to list
//         setNotes(prev => [response.data.data, ...prev]);
//         // Clear form
//         setFormData({
//           text: '',
//           type: 'General'
//         });
//         // Callback
//         onAdd(response.data.data);
//       } else {
//         setError(response.data.message || 'Failed to add note');
//       }
//     } catch (err) {
//       console.error('Error adding note:', err);
//       setError(err.response?.data?.message || 'Failed to add note. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditNote = (note) => {
//     setEditingNote(note);
//     setFormData({
//       text: note.text,
//       type: note.type || 'General'
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingNote(null);
//     setFormData({
//       text: '',
//       type: 'General'
//     });
//     setError('');
//   };

//   const resetForm = () => {
//     setFormData({
//       text: '',
//       type: 'General'
//     });
//     setEditingNote(null);
//     setError('');
//     setSuccess('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   // Format date
//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get note type style
//   const getNoteTypeStyle = (type) => {
//     const noteType = noteTypes.find(nt => nt.value === type) || noteTypes[0];
//     return noteType;
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={handleClose} 
//       maxWidth="md" 
//       fullWidth
//       PaperProps={{
//         sx: { 
//           borderRadius: 2,
//           maxHeight: '90vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         borderBottom: '1px solid #E0E0E0', 
//         pb: 2,
//         backgroundColor: '#F8FAFC',
//         position: 'sticky',
//         top: 0,
//         zIndex: 1
//       }}>
//         <div style={{ 
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div style={{ 
//             fontSize: '20px', 
//             fontWeight: '600', 
//             color: '#101010',
//             paddingTop: '8px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px'
//           }}>
//             <NoteAddIcon sx={{ color: '#1976D2' }} />
//             {editingNote ? 'Edit Note' : 'Add Note'}
//           </div>
//           <IconButton onClick={handleClose} size="small">
//             <CloseIcon />
//           </IconButton>
//         </div>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3 }}>
//         {fetchLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//             <CircularProgress size={40} sx={{ color: '#1976D2' }} />
//           </Box>
//         ) : (
//           <Stack spacing={3}>
//             {/* Candidate Info Card */}
//             {candidate && (
//               <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Stack spacing={2}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <Avatar 
//                       sx={{ 
//                         width: 56, 
//                         height: 56, 
//                         bgcolor: '#E3F2FD',
//                         color: '#1976D2',
//                         fontSize: '20px'
//                       }}
//                     >
//                       {candidate.firstName?.[0]}{candidate.lastName?.[0]}
//                     </Avatar>
//                     <Box sx={{ flex: 1 }}>
//                       <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
//                         {candidate.fullName}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         {candidate.candidateId}
//                       </Typography>
//                     </Box>
//                     <Chip
//                       label={`${notes.length} Notes`}
//                       size="small"
//                       sx={{
//                         backgroundColor: '#E3F2FD',
//                         color: '#1976D2',
//                         fontWeight: 500
//                       }}
//                     />
//                   </Box>

//                   <Divider />

//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <EmailIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
//                         <Box>
//                           <Typography variant="caption" color="textSecondary">Email</Typography>
//                           <Typography variant="body2">{candidate.email}</Typography>
//                         </Box>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <PhoneIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
//                         <Box>
//                           <Typography variant="caption" color="textSecondary">Phone</Typography>
//                           <Typography variant="body2">{candidate.phone}</Typography>
//                         </Box>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Stack>
//               </Paper>
//             )}

//             {/* Add Note Form */}
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#101010', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <CommentIcon sx={{ color: '#1976D2' }} />
//                 {editingNote ? 'Edit Note' : 'New Note'}
//               </Typography>
              
//               <Stack spacing={3}>
//                 {/* Note Type Selection */}
//                 <FormControl fullWidth size="small">
//                   <InputLabel>Note Type</InputLabel>
//                   <Select
//                     name="type"
//                     value={formData.type}
//                     onChange={handleChange}
//                     label="Note Type"
//                     disabled={loading}
//                     sx={{
//                       borderRadius: 1,
//                       backgroundColor: 'white'
//                     }}
//                     renderValue={(selected) => {
//                       const noteType = noteTypes.find(nt => nt.value === selected);
//                       return (
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {noteType?.icon}
//                           <Typography>{noteType?.label}</Typography>
//                         </Box>
//                       );
//                     }}
//                   >
//                     {noteTypes.map((type) => (
//                       <MenuItem key={type.value} value={type.value}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {type.icon}
//                           <Typography>{type.label}</Typography>
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 {/* Note Text */}
//                 <TextField
//                   fullWidth
//                   label="Note"
//                   name="text"
//                   value={formData.text}
//                   onChange={handleChange}
//                   multiline
//                   rows={4}
//                   disabled={loading}
//                   required
//                   size="small"
//                   variant="outlined"
//                   placeholder="Enter your note here..."
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1,
//                       backgroundColor: 'white'
//                     }
//                   }}
//                 />

//                 {/* Form Actions */}
//                 <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//                   {editingNote && (
//                     <Button
//                       variant="outlined"
//                       onClick={handleCancelEdit}
//                       disabled={loading}
//                       size="small"
//                       sx={{
//                         borderRadius: 1,
//                         textTransform: 'none'
//                       }}
//                     >
//                       Cancel Edit
//                     </Button>
//                   )}
//                   <Button
//                     variant="contained"
//                     onClick={handleSubmit}
//                     disabled={loading || !formData.text.trim()}
//                     startIcon={loading ? null : <NoteAddIcon />}
//                     sx={{
//                       borderRadius: 1,
//                       px: 3,
//                       textTransform: 'none',
//                       fontWeight: 500,
//                       backgroundColor: '#1976D2',
//                       '&:hover': {
//                         backgroundColor: '#1565C0'
//                       }
//                     }}
//                   >
//                     {loading ? 'Adding...' : editingNote ? 'Update Note' : 'Add Note'}
//                   </Button>
//                 </Box>
//               </Stack>
//             </Paper>

//             {/* Success/Error Messages */}
//             {success && (
//               <Alert 
//                 severity="success" 
//                 icon={<CheckCircleIcon />}
//                 sx={{ 
//                   borderRadius: 1,
//                   '& .MuiAlert-icon': {
//                     alignItems: 'center'
//                   }
//                 }}
//               >
//                 {success}
//               </Alert>
//             )}
            
//             {error && (
//               <Alert 
//                 severity="error" 
//                 sx={{ 
//                   borderRadius: 1,
//                   '& .MuiAlert-icon': {
//                     alignItems: 'center'
//                   }
//                 }}
//               >
//                 {error}
//               </Alert>
//             )}

//             {/* Notes History */}
//             {notes.length > 0 && (
//               <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#101010', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <HistoryIcon sx={{ color: '#1976D2' }} />
//                   Notes History ({notes.length})
//                 </Typography>
                
//                 <List sx={{ width: '100%', bgcolor: 'transparent' }}>
//                   {notes.map((note, index) => {
//                     const noteType = getNoteTypeStyle(note.type);
//                     return (
//                       <React.Fragment key={note._id || index}>
//                         {index > 0 && <Divider variant="inset" component="li" />}
//                         <ListItem alignItems="flex-start" sx={{ px: 0 }}>
//                           <ListItemAvatar>
//                             <Avatar sx={{ bgcolor: noteType.bg, color: noteType.color }}>
//                               {noteType.icon}
//                             </Avatar>
//                           </ListItemAvatar>
//                           <ListItemText
//                             primary={
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//                                 <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                                   {noteType.label}
//                                 </Typography>
//                                 <Chip
//                                   label={formatDateTime(note.createdAt)}
//                                   size="small"
//                                   sx={{
//                                     height: '20px',
//                                     fontSize: '10px',
//                                     backgroundColor: '#F5F5F5'
//                                   }}
//                                 />
//                               </Box>
//                             }
//                             secondary={
//                               <React.Fragment>
//                                 <Typography
//                                   variant="body2"
//                                   color="textPrimary"
//                                   sx={{ display: 'block', mb: 0.5, whiteSpace: 'pre-wrap' }}
//                                 >
//                                   {note.text}
//                                 </Typography>
//                                 <Typography
//                                   variant="caption"
//                                   color="textSecondary"
//                                   sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
//                                 >
//                                   <PersonIcon sx={{ fontSize: 14 }} />
//                                   Added by: {note.createdByName || 'System'}
//                                 </Typography>
//                               </React.Fragment>
//                             }
//                           />
//                           <ListItemSecondaryAction>
//                             <IconButton 
//                               edge="end" 
//                               size="small"
//                               onClick={() => handleEditNote(note)}
//                               sx={{ mr: 1, color: '#1976D2' }}
//                             >
//                               <EditIcon fontSize="small" />
//                             </IconButton>
//                           </ListItemSecondaryAction>
//                         </ListItem>
//                       </React.Fragment>
//                     );
//                   })}
//                 </List>
//               </Paper>
//             )}

//             {/* Info Alert */}
//             {notes.length === 0 && (
//               <Alert 
//                 severity="info" 
//                 icon={<CommentIcon />}
//                 sx={{ 
//                   borderRadius: 1,
//                   backgroundColor: '#E3F2FD',
//                   '& .MuiAlert-icon': {
//                     color: '#1976D2'
//                   }
//                 }}
//               >
//                 <Typography variant="body2">
//                   No notes yet. Add your first note to track communication with this candidate.
//                 </Typography>
//               </Alert>
//             )}
//           </Stack>
//         )}
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         px: 3, 
//         pb: 3, 
//         borderTop: '1px solid #E0E0E0', 
//         pt: 2,
//         backgroundColor: '#F8FAFC',
//         position: 'sticky',
//         bottom: 0,
//         zIndex: 1
//       }}>
//         <Button 
//           onClick={handleClose} 
//           disabled={loading || fetchLoading}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddNotes;


import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  Typography,
  Paper,
  Box,
  IconButton,
  TextField,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  NoteAdd as NoteAddIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Comment as CommentIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon
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

// Note types with icons and colors
const noteTypes = [
  { value: 'General', label: 'General', icon: <InfoIcon sx={{ fontSize: '0.7rem' }} />, color: COLORS.primary, bg: COLORS.primaryLight },
  { value: 'Interview', label: 'Interview', icon: <EventIcon sx={{ fontSize: '0.7rem' }} />, color: '#7B1FA2', bg: '#F3E5F5' },
  { value: 'Feedback', label: 'Feedback', icon: <AssessmentIcon sx={{ fontSize: '0.7rem' }} />, color: '#2E7D32', bg: '#E8F5E8' },
  { value: 'Follow-up', label: 'Follow-up', icon: <NotificationsIcon sx={{ fontSize: '0.7rem' }} />, color: '#F57C00', bg: '#FFF3E0' },
  { value: 'Task', label: 'Task', icon: <AssignmentIcon sx={{ fontSize: '0.7rem' }} />, color: '#0288D1', bg: '#E1F5FE' }
];

const AddNotes = ({ open, onClose, onAdd, candidateId, candidateData }) => {
  const [formData, setFormData] = useState({
    text: '',
    type: 'General'
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [candidate, setCandidate] = useState(candidateData || null);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (open && !candidateData && candidateId) {
      fetchCandidateDetails();
    } else if (candidateData) {
      setCandidate(candidateData);
      setNotes(candidateData.notes || []);
    }
  }, [open, candidateData, candidateId]);

  const fetchCandidateDetails = async () => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates/${candidateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setCandidate(response.data.data);
        setNotes(response.data.data.notes || []);
      } else {
        setError(response.data.message || 'Failed to fetch candidate details');
      }
    } catch (err) {
      console.error('Error fetching candidate details:', err);
      setError(err.response?.data?.message || 'Failed to fetch candidate details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'text' && !formData.text.trim()) {
      setFieldErrors(prev => ({ ...prev, [field]: 'Note text is required' }));
    } else if (field === 'text' && formData.text.trim().length < 3) {
      setFieldErrors(prev => ({ ...prev, [field]: 'Note must be at least 3 characters' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.text.trim()) {
      errors.text = 'Note text is required';
    } else if (formData.text.trim().length < 3) {
      errors.text = 'Note must be at least 3 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/candidates/${candidateId}/notes`,
        { text: formData.text, type: formData.type },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Note added successfully!');
        setNotes(prev => [response.data.data, ...prev]);
        setFormData({ text: '', type: 'General' });
        onAdd(response.data.data);
        setEditingNote(null);
      } else {
        setError(response.data.message || 'Failed to add note');
      }
    } catch (err) {
      console.error('Error adding note:', err);
      setError(err.response?.data?.message || 'Failed to add note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setFormData({ text: note.text, type: note.type || 'General' });
    setFieldErrors({});
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setFormData({ text: '', type: 'General' });
    setFieldErrors({});
    setError('');
  };

  const resetForm = () => {
    setFormData({ text: '', type: 'General' });
    setEditingNote(null);
    setError('');
    setSuccess('');
    setFieldErrors({});
    setTouched({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNoteTypeStyle = (type) => {
    return noteTypes.find(nt => nt.value === type) || noteTypes[0];
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          <NoteAddIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            {editingNote ? 'Edit Note' : 'Add Note'}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {fetchLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {/* Candidate Info Card */}
            {candidate && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.primaryLight, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.primary}`,
                boxShadow: 'none'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: COLORS.primary, fontSize: '1rem' }}>
                    {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {candidate.firstName} {candidate.lastName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                      {candidate.candidateId}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${notes.length} Notes`}
                    size="small"
                    sx={{
                      bgcolor: COLORS.background.white,
                      color: COLORS.primaryDark,
                      fontWeight: 500,
                      fontSize: '0.65rem',
                      height: 24
                    }}
                  />
                </Box>

                <Divider sx={{ borderColor: COLORS.border, mb: 1.5 }} />

                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Email</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.email}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Phone</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.phone}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Add Note Form */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CommentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {editingNote ? 'Edit Note' : 'New Note'}
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography sx={labelStyle}>Note Type</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    >
                      {noteTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {type.icon}
                            <Typography sx={{ fontSize: '0.75rem' }}>{type.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography sx={labelStyle}>Note *</Typography>
                  <TextField
                    fullWidth
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    onBlur={() => handleBlur('text')}
                    multiline
                    rows={4}
                    placeholder="Enter your note here..."
                    error={!!fieldErrors.text}
                    helperText={fieldErrors.text}
                    sx={inputStyle}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  {editingNote && (
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      disabled={loading}
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
                      Cancel Edit
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !formData.text.trim()}
                    startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <NoteAddIcon sx={{ fontSize: '1rem' }} />}
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
                    {loading ? 'Adding...' : editingNote ? 'Update Note' : 'Add Note'}
                  </Button>
                </Box>
              </Stack>
            </Paper>

            {/* Success/Error Messages */}
            {success && (
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon sx={{ fontSize: '0.9rem' }} />}
                sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}
              >
                {success}
              </Alert>
            )}
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}
              >
                {error}
              </Alert>
            )}

            {/* Notes History */}
            {notes.length > 0 && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <HistoryIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    Notes History ({notes.length})
                  </Typography>
                </Box>

                <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
                  {notes.map((note, index) => {
                    const noteType = getNoteTypeStyle(note.type);
                    return (
                      <React.Fragment key={note._id || index}>
                        {index > 0 && <Divider sx={{ borderColor: COLORS.border, my: 1 }} />}
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: noteType.bg, color: noteType.color }}>
                              {noteType.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                  {noteType.label}
                                </Typography>
                                <Chip
                                  label={formatDateTime(note.createdAt)}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.6rem',
                                    bgcolor: COLORS.chips.inactive,
                                    color: COLORS.text.secondary
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: COLORS.text.primary,
                                    display: 'block',
                                    mb: 0.5,
                                    whiteSpace: 'pre-wrap'
                                  }}
                                >
                                  {note.text}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PersonIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                    Added by: {note.createdByName || 'System'}
                                  </Typography>
                                </Box>
                              </React.Fragment>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              size="small"
                              onClick={() => handleEditNote(note)}
                              sx={{ color: COLORS.primary }}
                            >
                              <EditIcon sx={{ fontSize: '0.9rem' }} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </React.Fragment>
                    );
                  })}
                </List>
              </Paper>
            )}

            {/* Info Alert */}
            {notes.length === 0 && (
              <Alert 
                severity="info" 
                icon={<CommentIcon sx={{ fontSize: '0.9rem' }} />}
                sx={{ 
                  borderRadius: 1.5,
                  bgcolor: COLORS.status.info,
                  fontSize: '0.75rem'
                }}
              >
                No notes yet. Add your first note to track communication with this candidate.
              </Alert>
            )}
          </Stack>
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
          onClick={handleClose}
          disabled={loading || fetchLoading}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNotes;