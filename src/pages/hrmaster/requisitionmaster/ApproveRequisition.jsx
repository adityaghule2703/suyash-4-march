import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  TextField,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormHelperText,
  InputAdornment,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Work as WorkIcon,
  MonetizationOn as MonetizationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  VerifiedUser as VerifiedUserIcon,
  Comment as CommentIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const ApproveRequisition = ({ open, onClose, onApprove, requisitionId }) => {
  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comments, setComments] = useState('');
  
  // Signature state (similar to AcceptOffer)
  const [signature, setSignature] = useState('');
  const [signatureType, setSignatureType] = useState('text'); // 'text' or 'upload'
  const [signatureFile, setSignatureFile] = useState(null);
  const [signatureFileName, setSignatureFileName] = useState('');
  
  // Validation errors
  const [signatureError, setSignatureError] = useState('');
  const [commentsError, setCommentsError] = useState('');
  const [uploadError, setUploadError] = useState('');
  
  // Success state
  const [approveSuccess, setApproveSuccess] = useState(false);
  
  // File input ref
  const fileInputRef = useRef(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (open && requisitionId) {
      fetchRequisitionDetails();
    }
  }, [open, requisitionId]);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      resetState();
    }
  }, [open]);

  const resetState = () => {
    setSignature('');
    setSignatureType('text');
    setSignatureFile(null);
    setSignatureFileName('');
    setComments('');
    setSignatureError('');
    setCommentsError('');
    setUploadError('');
    setApproveSuccess(false);
    setError('');
    setSuccess('');
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchRequisitionDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/requisitions/${requisitionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setRequisition(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch requisition details');
        showSnackbar(response.data.message || 'Failed to fetch requisition details', 'error');
      }
    } catch (err) {
      console.error('Error fetching requisition:', err);
      const errorMsg = err.response?.data?.message || 'Failed to fetch requisition details. Please try again.';
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle signature file upload
  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, or GIF)');
      showSnackbar('Invalid file type. Please upload JPEG, PNG, or GIF.', 'error');
      setSignatureFile(null);
      setSignatureFileName('');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size should be less than 2MB');
      showSnackbar('File size exceeds 2MB limit', 'error');
      setSignatureFile(null);
      setSignatureFileName('');
      return;
    }

    setUploadError('');
    setSignatureFileName(file.name);
    setSignatureFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result; // Keep full data URL for preview and submission
      setSignature(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Clear signature
  const clearSignature = () => {
    setSignature('');
    setSignatureFile(null);
    setSignatureFileName('');
    setSignatureError('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper function to convert PNG to JPEG if needed
  const convertPNGToJPEG = (pngDataUrl) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve(jpegDataUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load signature image'));
        };
        
        img.src = pngDataUrl;
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleApprove = async () => {
    // Validate signature based on selected method
    if (signatureType === 'text') {
      if (!signature.trim()) {
        setSignatureError('Please enter your full name as signature');
        showSnackbar('Signature is required', 'error');
        return;
      }
    } else {
      if (!signatureFile) {
        setUploadError('Please upload a signature file');
        showSnackbar('Signature file is required', 'error');
        return;
      }
    }

    // Validate comments
    if (comments.trim().length < 5) {
      setCommentsError('Please provide meaningful comments (at least 5 characters)');
      showSnackbar('Comments must be at least 5 characters', 'error');
      return;
    }

    setApproving(true);
    setError('');
    setSignatureError('');
    setCommentsError('');
    setUploadError('');

    try {
      let jpegSignatureData = signature;

      // Convert PNG to JPEG if needed
      if (signature && signature.startsWith('data:image/png')) {
        try {
          jpegSignatureData = await convertPNGToJPEG(signature);
          showSnackbar('Converting signature to JPEG format...', 'info');
        } catch (conversionError) {
          console.error('Error converting signature to JPEG:', conversionError);
          setError('Failed to process signature. Please try again.');
          showSnackbar('Failed to process signature', 'error');
          setApproving(false);
          return;
        }
      }

      const token = localStorage.getItem('token');
      const submitData = {
        signature: jpegSignatureData,
        signatureType: signatureType,
        signatureFileName: signatureFileName || (signatureType === 'text' ? 'text-signature' : 'uploaded-signature'),
        comments: comments.trim()
      };

      showSnackbar('Approving requisition...', 'info');

      const response = await axios.post(`${BASE_URL}/api/requisitions/${requisitionId}/approve`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'Requisition approved successfully');
        setApproveSuccess(true);
        
        showSnackbar('✅ Requisition approved successfully!', 'success');
        
        onApprove(response.data.data);
        
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to approve requisition');
        showSnackbar(response.data.message || 'Failed to approve requisition', 'error');
      }
    } catch (err) {
      console.error('Error approving requisition:', err);
      
      let errorMessage = 'Failed to approve requisition';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Invalid request';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response.status === 404) {
          errorMessage = 'Requisition not found';
        } else if (err.response.data) {
          errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showSnackbar(`❌ ${errorMessage}`, 'error');
    } finally {
      setApproving(false);
    }
  };

  const handleClose = () => {
    setRequisition(null);
    setError('');
    setSuccess('');
    setApproveSuccess(false);
    resetState();
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336',
      critical: '#9C27B0'
    };
    return colors[priority?.toLowerCase()] || '#757575';
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: { bg: '#FFF3E0', color: '#E65100' },
      pending_approval: { bg: '#FFF3E0', color: '#E65100' },
      approved: { bg: '#E8F5E9', color: '#2E7D32' },
      rejected: { bg: '#FFEBEE', color: '#C62828' },
      filled: { bg: '#E3F2FD', color: '#1565C0' },
      closed: { bg: '#F5F5F5', color: '#616161' }
    };
    return colors[status?.toLowerCase()] || { bg: '#F5F5F5', color: '#616161' };
  };

  const renderRequisitionSummary = () => (
    <Paper sx={{ 
      p: 2, 
      backgroundColor: '#F8FAFC', 
      borderRadius: 2,
      border: '1px solid #E0E0E0'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#101010', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon sx={{ color: '#1976D2', fontSize: 20 }} />
          Requisition Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={requisition.requisitionId}
            size="small"
            sx={{
              backgroundColor: '#E3F2FD',
              color: '#1976D2',
              fontWeight: 500
            }}
          />
          <Chip
            label={requisition.status?.toUpperCase() || 'DRAFT'}
            size="small"
            sx={{
              backgroundColor: getStatusColor(requisition.status).bg,
              color: getStatusColor(requisition.status).color,
              fontWeight: 500
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <List dense disablePadding>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <BusinessIcon sx={{ color: '#666', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography variant="caption" sx={{ color: '#666' }}>Department</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>{requisition.department || 'N/A'}</Typography>}
              />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <LocationIcon sx={{ color: '#666', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography variant="caption" sx={{ color: '#666' }}>Location</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>{requisition.location || 'N/A'}</Typography>}
              />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <WorkIcon sx={{ color: '#666', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography variant="caption" sx={{ color: '#666' }}>Position</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>{requisition.positionTitle || 'N/A'}</Typography>}
              />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <PersonIcon sx={{ color: '#666', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography variant="caption" sx={{ color: '#666' }}>Requested By</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>{requisition.createdByName || 'N/A'}</Typography>}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} sm={6}>
          <List dense disablePadding>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <MonetizationIcon sx={{ color: '#666', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography variant="caption" sx={{ color: '#666' }}>Budget Range</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>
                  ₹{requisition.budgetMin?.toLocaleString()} - ₹{requisition.budgetMax?.toLocaleString()}
                </Typography>}
              />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <SchoolIcon sx={{ color: '#666', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography variant="caption" sx={{ color: '#666' }}>Education</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>{requisition.education || 'N/A'}</Typography>}
              />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <TrendingUpIcon sx={{ color: '#666', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography variant="caption" sx={{ color: '#666' }}>Experience</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>{requisition.experienceYears || 0} years</Typography>}
              />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CalendarIcon sx={{ color: '#666', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography variant="caption" sx={{ color: '#666' }}>Target Date</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>{formatDate(requisition.targetHireDate)}</Typography>}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={`${requisition.noOfPositions || 0} Positions`}
          size="small"
          sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
        />
        <Chip
          label={requisition.employmentType || 'N/A'}
          size="small"
          sx={{ backgroundColor: '#F3E5F5', color: '#7B1FA2' }}
        />
        <Chip
          label={requisition.priority || 'MEDIUM'}
          size="small"
          sx={{
            backgroundColor: `${getPriorityColor(requisition.priority)}20`,
            color: getPriorityColor(requisition.priority),
            fontWeight: 500
          }}
        />
        <Chip
          label={requisition.reasonForHire || 'N/A'}
          size="small"
          sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
        />
      </Box>

      {/* Skills */}
      {requisition.skills && requisition.skills.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
            Required Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {requisition.skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                sx={{
                  backgroundColor: '#E3F2FD',
                  color: '#1976D2',
                  fontSize: '11px',
                  height: 24
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Justification Preview */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
          Justification
        </Typography>
        <Typography variant="body2" sx={{ color: '#333', fontStyle: 'italic', backgroundColor: '#FFF', p: 1, borderRadius: 1, border: '1px solid #E0E0E0' }}>
          "{requisition.justification?.substring(0, 150)}{requisition.justification?.length > 150 ? '...' : ''}"
        </Typography>
      </Box>
    </Paper>
  );

  const renderSignatureSection = () => (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 2,
      border: '1px solid #E0E0E0'
    }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#101010', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <VerifiedUserIcon sx={{ color: '#2E7D32' }} />
        Approval Signature
      </Typography>

      {/* Signature Type Selection - Similar to AcceptOffer */}
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend" sx={{ fontSize: '0.85rem', mb: 1 }}>
          Signature Type <span style={{ color: '#F44336' }}>*</span>
        </FormLabel>
        <RadioGroup
          row
          value={signatureType}
          onChange={(e) => {
            setSignatureType(e.target.value);
            setSignatureError('');
            setUploadError('');
            clearSignature();
          }}
        >
          <FormControlLabel 
            value="text" 
            control={<Radio size="small" />} 
            label="Text Signature" 
            disabled={approving}
          />
          <FormControlLabel 
            value="upload" 
            control={<Radio size="small" />} 
            label="Upload Signature" 
            disabled={approving}
          />
        </RadioGroup>
      </FormControl>

      {/* Signature Input - Similar to AcceptOffer */}
      {signatureType === 'text' ? (
        <TextField
          fullWidth
          label="Your Full Name *"
          value={signature}
          onChange={(e) => {
            setSignature(e.target.value);
            if (signatureError) setSignatureError('');
          }}
          placeholder="Enter your full name as signature"
          size="small"
          error={!!signatureError}
          helperText={signatureError || 'This will be used as your digital signature'}
          disabled={approving}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EditIcon sx={{ color: '#999', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
            Upload Signature Image <span style={{ color: '#F44336' }}>*</span>
          </Typography>
          
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleSignatureUpload}
            style={{ display: 'none' }}
            ref={fileInputRef}
            disabled={approving}
          />
          
          {!signatureFile ? (
            <Paper
              variant="outlined"
              sx={{
                border: uploadError ? '1px solid #F44336' : '2px dashed #BDBDBD',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: '#FAFAFA',
                cursor: approving ? 'not-allowed' : 'pointer',
                '&:hover': {
                  backgroundColor: approving ? '#FAFAFA' : '#F5F5F5',
                  borderColor: approving ? '#BDBDBD' : '#1976D2'
                }
              }}
              onClick={() => !approving && fileInputRef.current?.click()}
            >
              <EditIcon sx={{ color: '#1976D2', mb: 1, fontSize: 32 }} />
              <Typography variant="body2" sx={{ color: '#424242', fontWeight: 500, mb: 0.5 }}>
                Click to upload signature image
              </Typography>
              <Typography variant="caption" sx={{ color: '#9E9E9E' }}>
                Supported formats: JPEG, PNG, GIF (Max size: 2MB)
              </Typography>
            </Paper>
          ) : (
            <Box sx={{
              p: 1.5,
              bgcolor: '#F0F7FF',
              borderRadius: 1,
              border: uploadError ? '1px solid #F44336' : '1px solid #1976D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                <Typography variant="body2">{signatureFileName}</Typography>
              </Box>
              <Button
                size="small"
                color="error"
                onClick={clearSignature}
                disabled={approving}
              >
                Remove
              </Button>
            </Box>
          )}
          
          {uploadError && (
            <FormHelperText error sx={{ mt: 1 }}>
              {uploadError}
            </FormHelperText>
          )}
        </Box>
      )}

      {/* Preview Section - Similar to AcceptOffer */}
      {((signatureType === 'text' && signature.trim()) || (signatureType === 'upload' && signatureFile)) && (
        <Paper sx={{ p: 1.5, bgcolor: '#F0F7FF', borderRadius: 1, mt: 2 }}>
          <Typography variant="caption" color="#1976D2" display="block" gutterBottom>
            Signature Preview
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">Approver</Typography>
              <Typography variant="body2">{requisition?.createdByName || 'You'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">Signature</Typography>
              <Typography variant="body2" sx={{ fontFamily: signatureType === 'text' ? 'cursive' : 'inherit' }}>
                {signatureType === 'text' 
                  ? signature || '[Not provided]' 
                  : signatureFile ? '[Signature image uploaded]' : '[No signature]'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Comments Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
          Approval Comments <span style={{ color: '#F44336' }}>*</span>
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Please provide your comments and justification for approval..."
          value={comments}
          onChange={(e) => {
            setComments(e.target.value);
            if (commentsError) setCommentsError('');
          }}
          error={!!commentsError}
          helperText={commentsError || 'Minimum 5 characters'}
          disabled={approving}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CommentIcon sx={{ color: '#999', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            }
          }}
        />
      </Box>

      {/* Ready for Approval Message */}
      {((signatureType === 'text' && signature.trim()) || 
        (signatureType === 'upload' && signatureFile)) && 
        comments.trim().length >= 5 && (
        <Paper sx={{ 
          p: 2, 
          backgroundColor: '#E8F5E9', 
          borderRadius: 2,
          border: '1px solid #4CAF50',
          mt: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ color: '#2E7D32' }}>
              Ready for Approval
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#1B5E20' }}>
            Your signature and comments are complete. Click "Approve Requisition" to confirm.
          </Typography>
        </Paper>
      )}
    </Paper>
  );

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #E0E0E0', 
          pb: 2,
          backgroundColor: '#F8FAFC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VerifiedUserIcon sx={{ color: '#2E7D32' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
              Approve Requisition
            </Typography>
            {requisition && (
              <Chip
                label={requisition.requisitionId}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: '#E3F2FD',
                  color: '#1976D2',
                  fontWeight: 500,
                  fontSize: '12px'
                }}
              />
            )}
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#666' }} disabled={approving}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#1976D2' }} />
            </Box>
          ) : error ? (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1,
                mt: 2,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
              action={
                <Button color="inherit" size="small" onClick={fetchRequisitionDetails} startIcon={<RefreshIcon />}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          ) : success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#101010', mb: 1 }}>
                Successfully Approved!
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {success}
              </Typography>
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#F8FAFC', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#101010', mb: 1 }}>
                  Approval Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Approved By</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{requisition?.createdByName || 'You'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDateTime(new Date().toISOString())}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 2 }}>
                Redirecting...
              </Typography>
            </Box>
          ) : requisition ? (
            <Stack spacing={3}>
              {/* Warning for wrong status */}
              {requisition.status !== 'pending_approval' && requisition.status !== 'draft' && (
                <Alert 
                  severity="warning"
                  icon={<InfoIcon />}
                  sx={{ 
                    borderRadius: 1,
                    backgroundColor: '#FFF3E0',
                    '& .MuiAlert-icon': {
                      color: '#E65100'
                    }
                  }}
                >
                  This requisition is currently in <strong>{requisition.status?.replace('_', ' ').toUpperCase()}</strong> status. 
                  Only requisitions pending approval can be approved.
                </Alert>
              )}

              {/* Info message for correct status */}
              {requisition.status === 'pending_approval' && (
                <Alert 
                  severity="info"
                  icon={<InfoIcon />}
                  sx={{ 
                    borderRadius: 1,
                    backgroundColor: '#E3F2FD',
                    '& .MuiAlert-icon': {
                      color: '#1976D2'
                    }
                  }}
                >
                  This requisition is ready for approval. Please review the details and provide your signature below.
                </Alert>
              )}

              {/* Requisition Summary */}
              {renderRequisitionSummary()}

              {/* Approval Form with Signature Options */}
              {renderSignatureSection()}
            </Stack>
          ) : null}
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          pb: 3, 
          borderTop: '1px solid #E0E0E0', 
          pt: 2,
          backgroundColor: '#F8FAFC',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Box>
            {requisition && requisition.status === 'pending_approval' && (
              <Tooltip title="Review requisition details before approving">
                <InfoIcon sx={{ color: '#1976D2', fontSize: 20, cursor: 'help' }} />
              </Tooltip>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              onClick={handleClose}
              disabled={approving || approveSuccess}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleApprove}
              disabled={
                loading || 
                approving || 
                approveSuccess || 
                (requisition && requisition.status !== 'pending_approval' && requisition.status !== 'draft') ||
                (signatureType === 'text' && !signature.trim()) ||
                (signatureType === 'upload' && !signatureFile) ||
                comments.trim().length < 5
              }
              startIcon={approving ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                backgroundColor: '#2E7D32',
                '&:hover': {
                  backgroundColor: '#1B5E20'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E0E0E0'
                }
              }}
            >
              {approving ? 'Approving...' : 'Approve Requisition'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications - Similar to AcceptOffer */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            boxShadow: 3,
            borderRadius: 1
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
            info: <InfoIcon fontSize="inherit" />
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApproveRequisition;