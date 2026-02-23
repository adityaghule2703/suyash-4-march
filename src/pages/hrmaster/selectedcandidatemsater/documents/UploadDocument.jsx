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
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Tooltip,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Card,
  CardContent
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
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  WorkOutline,
  BusinessOutlined
} from '@mui/icons-material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import BASE_URL from '../../../../config/Config';
import { SchoolIcon } from 'lucide-react';


const UploadDocument = ({ open, onClose, onSubmit, candidateId = null, documentType = null }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [fetchingCandidates, setFetchingCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentTypeValue, setDocumentTypeValue] = useState(documentType || '');
  const [documentName, setDocumentName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const steps = [
    'Select Candidate',
    'Upload Document',
    'Confirm & Submit'
  ];

  const documentTypes = [
    { value: 'aadhar', label: 'Aadhar Card', icon: <PersonIcon />, description: 'Government ID proof' },
    { value: 'pan', label: 'PAN Card', icon: <PersonIcon />, description: 'Permanent Account Number' },
    { value: 'voter', label: 'Voter ID', icon: <PersonIcon />, description: 'Voter identification' },
    { value: 'passport', label: 'Passport', icon: <PersonIcon />, description: 'International travel document' },
    { value: 'driving_license', label: 'Driving License', icon: <PersonIcon />, description: 'Driver\'s license' },
    { value: 'education_10th', label: '10th Marksheet', icon: <SchoolIcon />, description: 'Secondary education' },
    { value: 'education_12th', label: '12th Marksheet', icon: <SchoolIcon />, description: 'Higher secondary education' },
    { value: 'education_degree', label: 'Degree Certificate', icon: <SchoolIcon />, description: 'Bachelor\'s degree' },
    { value: 'education_master', label: 'Master\'s Degree', icon: <SchoolIcon />, description: 'Post-graduate degree' },
    { value: 'experience_letter', label: 'Experience Letter', icon: <WorkOutline />, description: 'Previous employment proof' },
    { value: 'salary_slip', label: 'Salary Slip', icon: <WorkOutline />, description: 'Recent salary slips' },
    { value: 'bank_statement', label: 'Bank Statement', icon: <BusinessOutlined/>, description: 'Bank account statement' },
    { value: 'photo', label: 'Passport Photo', icon: <ImageIcon />, description: 'Recent photograph' },
    { value: 'signature', label: 'Signature', icon: <DescriptionIcon />, description: 'Digital signature' },
    { value: 'other', label: 'Other', icon: <FileIcon />, description: 'Other documents' }
  ];

  useEffect(() => {
    if (open) {
      fetchCandidates();
    }
  }, [open]);

  useEffect(() => {
    if (candidateId) {
      setSelectedCandidate({ _id: candidateId });
    }
  }, [candidateId]);

  const fetchCandidates = async () => {
    setFetchingCandidates(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCandidates(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to fetch candidates');
    } finally {
      setFetchingCandidates(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, JPG, JPEG, and PNG files are allowed');
        return;
      }

      setDocumentFile(file);
      setDocumentName(file.name);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleCandidateChange = (e) => {
    const candidateId = e.target.value;
    const candidate = candidates.find(c => c._id === candidateId);
    setSelectedCandidate(candidate);
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentTypeValue(e.target.value);
  };

  const handleRemoveFile = () => {
    setDocumentFile(null);
    setDocumentName('');
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      if (!selectedCandidate) {
        setError('Please select a candidate');
        return;
      }
    } else if (activeStep === 1) {
      if (!documentFile) {
        setError('Please upload a document');
        return;
      }
      if (!documentTypeValue) {
        setError('Please select document type');
        return;
      }
    }
    
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedCandidate(null);
    setDocumentFile(null);
    setDocumentTypeValue(documentType || '');
    setDocumentName('');
    setDescription('');
    setUploadedDocument(null);
    setUploadProgress(0);
    setTermsAccepted(false);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleUploadDocument = async () => {
    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);
    
    try {
      const token = localStorage.getItem('token');
      
      // Create form data
      const formData = new FormData();
      formData.append('document', documentFile);
      formData.append('candidateId', selectedCandidate._id);
      formData.append('type', documentTypeValue);
      if (description) {
        formData.append('description', description);
      }

      const response = await axios.post(
        `${BASE_URL}/api/documents/upload`,
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );

      if (response.data.success) {
        setUploadedDocument(response.data.data);
        setSuccess(response.data.message || 'Document uploaded successfully!');
        
        if (onSubmit) {
          onSubmit(response.data.data);
        }
        
        // Move to next step after success
        setTimeout(() => {
          setActiveStep(2);
        }, 1000);
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
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (!file) return <FileIcon />;
    if (file.type === 'application/pdf') return <PdfIcon sx={{ color: '#F40F02' }} />;
    if (file.type.startsWith('image/')) return <ImageIcon sx={{ color: '#2196F3' }} />;
    return <FileIcon sx={{ color: '#757575' }} />;
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Candidate Selection Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                👤 Select Candidate
              </Typography>
              
              {fetchingCandidates ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <FormControl fullWidth>
                  <InputLabel>Select Candidate</InputLabel>
                  <Select
                    value={selectedCandidate?._id || ''}
                    onChange={handleCandidateChange}
                    label="Select Candidate"
                  >
                    {candidates.map((cand) => (
                      <MenuItem key={cand._id} value={cand._id}>
                        {cand.firstName} {cand.lastName} - {cand.candidateId || cand.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {selectedCandidate && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Full Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedCandidate.firstName} {selectedCandidate.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body2">{selectedCandidate.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Phone
                      </Typography>
                      <Typography variant="body2">{selectedCandidate.phone}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            {/* Info Card */}
            <Paper sx={{ p: 3, bgcolor: '#E3F2FD', border: '1px solid #90CAF9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InfoIcon sx={{ color: '#1976D2' }} />
                <Typography variant="body2" color="textSecondary">
                  Select the candidate for whom you want to upload a document. 
                  You can upload various documents like ID proofs, educational certificates, etc.
                </Typography>
              </Box>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            {/* Document Upload Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                📄 Upload Document
              </Typography>

              <Grid container spacing={3}>
                {/* Document Type Selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Document Type</InputLabel>
                    <Select
                      value={documentTypeValue}
                      onChange={handleDocumentTypeChange}
                      label="Document Type"
                    >
                      {documentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {type.icon}
                            <Box>
                              <Typography variant="body2">{type.label}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {type.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* File Upload Area */}
                <Grid item xs={12}>
                  <Paper
                    {...getRootProps()}
                    sx={{
                      p: 4,
                      border: `2px dashed ${isDragActive ? '#1976D2' : documentFile ? '#4CAF50' : '#BDBDBD'}`,
                      borderRadius: 2,
                      bgcolor: isDragActive ? '#E3F2FD' : documentFile ? '#E8F5E9' : '#F8FAFC',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#1976D2',
                        bgcolor: '#E3F2FD'
                      }
                    }}
                  >
                    <input {...getInputProps()} />
                    
                    {documentFile ? (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          {getFileIcon(documentFile)}
                        </Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {documentFile.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatFileSize(documentFile.size)}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile();
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <CloudUploadIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Drag & Drop or Click to Upload
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Supported formats: PDF, JPG, JPEG, PNG (Max size: 10MB)
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any additional details about this document..."
                  />
                </Grid>

                {/* Upload Progress */}
                {uploading && (
                  <Grid item xs={12}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Uploading... {uploadProgress}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Uploaded Document Preview */}
                {uploadedDocument && (
                  <Grid item xs={12}>
                    <Alert 
                      severity="success" 
                      icon={<CheckCircleIcon />}
                      sx={{ mb: 2 }}
                    >
                      Document uploaded successfully!
                    </Alert>
                    
                    <Paper sx={{ p: 2, bgcolor: '#E8F5E9', border: '1px solid #81C784' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Uploaded Document Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="textSecondary">
                            Document ID
                          </Typography>
                          <Typography variant="body2">{uploadedDocument.documentId}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="textSecondary">
                            Status
                          </Typography>
                          <Chip
                            label={uploadedDocument.status || 'pending'}
                            size="small"
                            color="warning"
                            sx={{ mt: 0.5 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="textSecondary">
                            Filename
                          </Typography>
                          <Typography variant="body2">{uploadedDocument.filename}</Typography>
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
          <Stack spacing={3}>
            {/* Confirmation Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                ✅ Confirm Upload
              </Typography>

              {/* Summary Box */}
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">
                      Candidate
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">
                      Document Type
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {documentTypes.find(t => t.value === documentTypeValue)?.label || documentTypeValue}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">
                      Filename
                    </Typography>
                    <Typography variant="body2">{documentFile?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">
                      File Size
                    </Typography>
                    <Typography variant="body2">{formatFileSize(documentFile?.size)}</Typography>
                  </Grid>
                  {description && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">
                        Description
                      </Typography>
                      <Typography variant="body2">{description}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Uploaded Document Info */}
              {uploadedDocument && (
                <Box sx={{ mb: 3 }}>
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    Document uploaded successfully!
                  </Alert>
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#E8F5E9', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Document ID: {uploadedDocument.documentId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: <Chip label="pending" size="small" color="warning" />
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Terms and Conditions */}
              <Box sx={{ 
                p: 2, 
                bgcolor: '#E3F2FD', 
                borderRadius: 1,
                border: '1px solid #90CAF9',
                mb: 2
              }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedUserIcon fontSize="small" color="primary" />
                  Terms & Conditions
                </Typography>
                
                <Typography variant="body2" paragraph>
                  By uploading this document, you confirm that:
                </Typography>
                
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>
                    <Typography variant="body2" color="textSecondary">
                      The document belongs to the selected candidate
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="textSecondary">
                      The document is authentic and unaltered
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="textSecondary">
                      You have the authority to upload this document
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="textSecondary">
                      The document will be used for verification purposes only
                    </Typography>
                  </li>
                </ul>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      I confirm that the above information is accurate
                    </Typography>
                  }
                  sx={{ mt: 2 }}
                />
              </Box>

              {/* Warning */}
              <Alert severity="warning" icon={<WarningIcon />}>
                <Typography variant="body2">
                  Once uploaded, documents cannot be deleted. Please ensure you have selected the correct file.
                </Typography>
              </Alert>
            </Paper>
          </Stack>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, minHeight: '70vh' } }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Upload Document
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Upload candidate documents for verification
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Error/Success Messages */}
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}
        
        {success && !uploadedDocument && (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />}
            onClose={() => setSuccess('')}
            sx={{ mb: 3 }}
          >
            {success}
          </Alert>
        )}

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ minHeight: 450 }}>
          {getStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC',
        justifyContent: 'space-between'
      }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Box>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleUploadDocument}
              disabled={uploading || !termsAccepted}
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' },
                minWidth: 200
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' }
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