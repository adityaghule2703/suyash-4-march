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
  Tab,
  Tabs
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
  Description as DescriptionIcon,
  VerifiedUser as VerifiedUserIcon,
  Comment as CommentIcon,
  Fingerprint as FingerprintIcon,
  Upload as UploadIcon,
  Brush as BrushIcon,
  
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import SignaturePad from 'react-signature-canvas';

// Tab Panel component
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`signature-tabpanel-${index}`}
    aria-labelledby={`signature-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const ApproveRequisition = ({ open, onClose, onApprove, requisitionId }) => {
  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comments, setComments] = useState('');
  const [signature, setSignature] = useState(null);
  const [signaturePad, setSignaturePad] = useState(null);
  const [signatureError, setSignatureError] = useState('');
  const [commentsError, setCommentsError] = useState('');
  const [approveSuccess, setApproveSuccess] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(true);
  
  // New states for file upload
  const [signatureMethod, setSignatureMethod] = useState(0); // 0 = draw, 1 = upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open && requisitionId) {
      fetchRequisitionDetails();
    }
  }, [open, requisitionId]);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setSignature(null);
      setComments('');
      setSignatureError('');
      setCommentsError('');
      setApproveSuccess(false);
      setShowSignaturePad(true);
      setSignatureMethod(0);
      setUploadedFile(null);
      setUploadedFilePreview(null);
      setUploadError('');
    }
  }, [open]);

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
      }
    } catch (err) {
      console.error('Error fetching requisition:', err);
      setError(err.response?.data?.message || 'Failed to fetch requisition details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, or GIF)');
      setUploadedFile(null);
      setUploadedFilePreview(null);
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size should be less than 2MB');
      setUploadedFile(null);
      setUploadedFilePreview(null);
      return;
    }

    setUploadError('');
    setUploadedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Helper function to convert PNG to JPEG
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
    if (signatureMethod === 0) {
      // Drawing method
      if (!signaturePad || signaturePad.isEmpty()) {
        setSignatureError('Signature is required');
        return;
      }
    } else {
      // Upload method
      if (!uploadedFile && !uploadedFilePreview) {
        setUploadError('Please upload a signature file');
        return;
      }
    }

    // Validate comments (optional but recommended)
    if (comments.trim().length < 5) {
      setCommentsError('Please provide meaningful comments (at least 5 characters)');
      return;
    }

    setApproving(true);
    setError('');
    setSignatureError('');
    setCommentsError('');
    setUploadError('');

    try {
      let jpegSignatureData = null;

      if (signatureMethod === 0) {
        // Get signature from drawing pad
        let pngSignatureData = null;
        
        if (signaturePad && !signaturePad.isEmpty()) {
          pngSignatureData = signaturePad.toDataURL('image/png');
        } else if (signature) {
          pngSignatureData = signature;
        }

        // Convert PNG to JPEG
        if (pngSignatureData) {
          try {
            jpegSignatureData = await convertPNGToJPEG(pngSignatureData);
          } catch (conversionError) {
            console.error('Error converting signature to JPEG:', conversionError);
            setError('Failed to process signature. Please try again.');
            setApproving(false);
            return;
          }
        }
      } else {
        // Get signature from uploaded file
        if (uploadedFilePreview) {
          // If uploaded file is PNG, convert to JPEG, otherwise use as is
          if (uploadedFile?.type === 'image/png') {
            try {
              jpegSignatureData = await convertPNGToJPEG(uploadedFilePreview);
            } catch (conversionError) {
              console.error('Error converting uploaded PNG to JPEG:', conversionError);
              setError('Failed to process uploaded signature. Please try again.');
              setApproving(false);
              return;
            }
          } else {
            // For JPEG or other formats, use as is
            jpegSignatureData = uploadedFilePreview;
          }
        }
      }

      const token = localStorage.getItem('token');
      const submitData = {
        signature: jpegSignatureData,
        comments: comments.trim(),
        signatureFormat: 'jpeg',
        signatureMethod: signatureMethod === 0 ? 'draw' : 'upload'
      };

      const response = await axios.post(`${BASE_URL}/api/requisitions/${requisitionId}/approve`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'Requisition approved successfully');
        setApproveSuccess(true);
        
        onApprove(response.data.data);
        
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to approve requisition');
      }
    } catch (err) {
      console.error('Error approving requisition:', err);
      setError(err.response?.data?.message || 'Failed to approve requisition. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  const handleClearSignature = () => {
    if (signaturePad) {
      signaturePad.clear();
    }
    setSignature(null);
    setSignatureError('');
  };

  const handleClearUpload = () => {
    setUploadedFile(null);
    setUploadedFilePreview(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setRequisition(null);
    setError('');
    setSuccess('');
    setApproveSuccess(false);
    onClose();
  };

  const handleMethodChange = (event, newValue) => {
    setSignatureMethod(newValue);
    // Clear errors when switching methods
    setSignatureError('');
    setUploadError('');
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

      {/* Signature Method Tabs */}
      <Tabs
        value={signatureMethod}
        onChange={handleMethodChange}
        variant="fullWidth"
        sx={{
          mb: 2,
          borderBottom: '1px solid #E0E0E0',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            minHeight: '48px'
          }
        }}
      >
        <Tab 
          icon={<BrushIcon sx={{ fontSize: 20 }} />} 
          iconPosition="start" 
          label="Draw Signature" 
          disabled={approving}
        />
        <Tab 
          icon={<UploadIcon sx={{ fontSize: 20 }} />} 
          iconPosition="start" 
          label="Upload Signature" 
          disabled={approving}
        />
      </Tabs>

      {/* Draw Signature Panel */}
      <TabPanel value={signatureMethod} index={0}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
              Draw your signature <span style={{ color: '#F44336' }}>*</span>
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                border: signatureError ? '1px solid #F44336' : '1px solid #E0E0E0',
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: '#FFF'
              }}
            >
              {showSignaturePad ? (
                <SignaturePad
                  ref={(ref) => setSignaturePad(ref)}
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-pad',
                    style: {
                      width: '100%',
                      height: '200px',
                      cursor: 'crosshair'
                    }
                  }}
                  backgroundColor="rgb(255,255,255)"
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F5F5F5'
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    Signature pad hidden
                  </Typography>
                </Box>
              )}
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormHelperText error={!!signatureError}>
                {signatureError || 'Draw your signature in the box above'}
              </FormHelperText>
              <Box>
                <Button
                  size="small"
                  onClick={handleClearSignature}
                  sx={{ mr: 1, color: '#666' }}
                  disabled={approving}
                >
                  Clear
                </Button>
                <Button
                  size="small"
                  onClick={() => setShowSignaturePad(!showSignaturePad)}
                  sx={{ color: '#1976D2' }}
                  disabled={approving}
                >
                  {showSignaturePad ? 'Hide' : 'Show'} Pad
                </Button>
              </Box>
            </Box>
          </Box>
        </Stack>
      </TabPanel>

      {/* Upload Signature Panel */}
      <TabPanel value={signatureMethod} index={1}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
              Upload signature file <span style={{ color: '#F44336' }}>*</span>
            </Typography>
            
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
              disabled={approving}
            />
            
            {!uploadedFilePreview ? (
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
                <UploadIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 1 }} />
                <Typography variant="body1" sx={{ color: '#424242', fontWeight: 500, mb: 0.5 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="caption" sx={{ color: '#9E9E9E' }}>
                  Supported formats: JPEG, PNG, GIF (Max size: 2MB)
                </Typography>
              </Paper>
            ) : (
              <Box>
                <Paper
                  variant="outlined"
                  sx={{
                    border: '1px solid #4CAF50',
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: '#F1F8E9'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#2E7D32' }}>
                      File uploaded successfully
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <img 
                      src={uploadedFilePreview} 
                      alt="Signature preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '150px', 
                        objectFit: 'contain',
                        border: '1px solid #E0E0E0',
                        borderRadius: '4px',
                        backgroundColor: '#FFF'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: '#616161' }}>
                      {uploadedFile?.name} ({(uploadedFile?.size / 1024).toFixed(1)} KB)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      size="small"
                      onClick={handleClearUpload}
                      sx={{ color: '#F44336' }}
                      disabled={approving}
                    >
                      Remove
                    </Button>
                  </Box>
                </Paper>
              </Box>
            )}
            
            {uploadError && (
              <FormHelperText error sx={{ mt: 1 }}>
                {uploadError}
              </FormHelperText>
            )}
            
            <FormHelperText sx={{ mt: 1 }}>
              Upload a clear image of your signature. The file will be converted to JPEG format.
            </FormHelperText>
          </Box>
        </Stack>
      </TabPanel>

      {/* Comments Section (common for both methods) */}
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

      {/* Preview of approval */}
      {((signatureMethod === 0 && signaturePad && !signaturePad.isEmpty()) || 
        (signatureMethod === 1 && uploadedFilePreview)) && 
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
        <IconButton onClick={handleClose} size="small" sx={{ color: '#666' }}>
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
              (signatureMethod === 0 && (!signaturePad || signaturePad.isEmpty())) ||
              (signatureMethod === 1 && !uploadedFilePreview) ||
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
  );
};

export default ApproveRequisition;