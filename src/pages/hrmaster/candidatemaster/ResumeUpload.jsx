import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Paper,
  LinearProgress,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  FormHelperText,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import axios from 'axios';
import BASE_URL from '../../../config/Config';


const PRIMARY_BLUE = '#00B4D8';
const SUCCESS_COLOR = '#10B981';
const ERROR_COLOR = '#EF4444';
const WARNING_COLOR = '#F59E0B';

const ResumeUpload = ({ open, onClose, onUpload, candidateId }) => {
  const [file, setFile] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [candidateError, setCandidateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedCandidate, setUploadedCandidate] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');

  const fileInputRef = useRef(null);

  // File validation rules
  const validateFile = (file) => {
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx'];

    if (!allowedExtensions.includes(fileExtension)) {
      return 'Please upload a PDF or Word document (PDF, DOC, DOCX)';
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File size should be less than 5MB. Current size: ${formatFileSize(file.size)}`;
    }

    if (file.size === 0) {
      return 'File is empty';
    }

    return '';
  };

  // Fetch candidate details when candidateId is provided
  useEffect(() => {
    if (open && candidateId) {
      fetchCandidateDetails();
    } else if (open && !candidateId) {
      setSelectedCandidate(null);
      setCandidateError('');
    }
  }, [open, candidateId]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFile(null);
      setError('');
      setSuccess(false);
      setUploadProgress(0);
      setUploadedCandidate(null);
      setDragActive(false);
      setFileError('');
      setCandidateError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  const fetchCandidateDetails = async () => {
    if (!candidateId) return;

    setCandidateLoading(true);
    setCandidateError('');

    try {
      const token = localStorage.getItem('token');
      // Correct API: GET {{base_url}}/api/candidates?_id=69a7ff069dc9d0431ad6904d
      const response = await axios.get(`${BASE_URL}/api/candidates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          _id: candidateId  // Using _id as query parameter
        }
      });

      console.log('Candidate fetch response:', response.data);

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // The API returns an array with the candidate
        const candidateData = response.data.data[0];
        setSelectedCandidate(candidateData);
        setCandidateError('');
      } else {
        setCandidateError('Candidate not found');
        setSelectedCandidate(null);
      }
    } catch (err) {
      console.error('Error fetching candidate details:', err);

      if (err.response?.status === 401) {
        setCandidateError('Unauthorized. Please login again.');
      } else if (err.response?.status === 404) {
        setCandidateError('Candidate not found');
      } else {
        setCandidateError('Failed to load candidate details');
      }
      setSelectedCandidate(null);
    } finally {
      setCandidateLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file) => {
    const fileErrorMsg = validateFile(file);
    setFileError(fileErrorMsg);

    if (fileErrorMsg) {
      setError(fileErrorMsg);
      return;
    }

    setError('');
    setFileError('');
    setFile(file);
    setUploadProgress(0);
    setSuccess(false);
    setUploadedCandidate(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    setFileError('');
    setUploadProgress(0);
    setSuccess(false);
    setUploadedCandidate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const fileValidationError = validateFile(file);
    if (fileValidationError) {
      setError(fileValidationError);
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    if (selectedCandidate) {
      formData.append('candidateId', selectedCandidate._id);
      console.log('Uploading resume for candidate with _id:', selectedCandidate._id);
    } else if (candidateId) {
      formData.append('candidateId', candidateId);
      console.log('Uploading resume for candidate with ID:', candidateId);
    }

    try {
      setLoading(true);
      setError('');
      setUploadProgress(0);

      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${BASE_URL}/api/candidates/upload-resume`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setUploadedCandidate(response.data.data);
        setUploadProgress(100);

        setTimeout(() => {
          if (onUpload) {
            onUpload(response.data.data);
          }
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to upload resume');
      }
    } catch (err) {
      console.error('Error uploading resume:', err);

      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error || 'Server error';

        if (status === 413) {
          setError('File too large. Maximum size is 5MB.');
        } else if (status === 415) {
          setError('Unsupported file type. Please upload PDF or Word documents.');
        } else if (status === 400) {
          if (message.includes('candidateId') || message.includes('Candidate ID')) {
            setError(`Invalid Candidate ID. Please check the candidate ID.`);
          } else {
            setError(message);
          }
        } else if (status === 401) {
          setError('Unauthorized. Please login again.');
        } else if (status === 403) {
          setError('You do not have permission to upload resumes.');
        } else if (status === 404) {
          setError('Candidate not found. Please check the candidate ID.');
        } else {
          setError(message || 'Failed to upload resume');
        }
      } else if (err.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setSelectedCandidate(null);
      setError('');
      setSuccess(false);
      setUploadProgress(0);
      setUploadedCandidate(null);
      setDragActive(false);
      setFileError('');
      setCandidateError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <DescriptionIcon sx={{ color: '#EF4444', fontSize: 32 }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon sx={{ color: '#2B5797', fontSize: 32 }} />;
      default:
        return <FileIcon sx={{ color: PRIMARY_BLUE, fontSize: 32 }} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
        bgcolor: '#f8fafc'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon sx={{ color: PRIMARY_BLUE }} />
          <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
            Upload Resume
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Error Alert */}
          {error && !success && (
            <Alert
              severity="error"
              onClose={() => setError('')}
              sx={{ borderRadius: 1.5 }}
              icon={<ErrorIcon />}
            >
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert
              severity="success"
              sx={{ borderRadius: 1.5 }}
              icon={<CheckCircleIcon />}
            >
              Resume uploaded successfully! {selectedCandidate ? 'Candidate updated.' : 'New candidate created.'}
            </Alert>
          )}

          {/* Candidate Info Display */}
          {candidateLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="textSecondary">
                Loading candidate details...
              </Typography>
            </Box>
          ) : candidateError ? (
            <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
              {candidateError}
            </Alert>
          ) : selectedCandidate ? (
            <Paper sx={{ p: 2, bgcolor: alpha(PRIMARY_BLUE, 0.04), borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom color={PRIMARY_BLUE} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" />
                Selected Candidate
              </Typography>

              <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                {/* ID and Name in two columns */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BadgeIcon sx={{ fontSize: 18, color: '#64748B' }} />
                    <Typography variant="body2">
                      <strong>ID:</strong> {selectedCandidate.candidateId || selectedCandidate._id}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 18, color: '#64748B' }} />
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedCandidate.fullName || `${selectedCandidate.firstName || ''} ${selectedCandidate.lastName || ''}`.trim()}
                    </Typography>
                  </Box>
                </Grid>

                {/* Contact Info - All in one row on larger screens */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {selectedCandidate.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 14, color: '#64748B' }} />
                        <Typography variant="caption">{selectedCandidate.email}</Typography>
                      </Box>
                    )}
                    {selectedCandidate.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: '#64748B' }} />
                        <Typography variant="caption">{selectedCandidate.phone}</Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>


              </Grid>
            </Paper>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              No candidate selected. A new candidate will be created.
            </Alert>
          )}

          {/* Upload Area */}
          {!success && (
            <>
              <Paper
                sx={{
                  p: 3,
                  border: '2px dashed',
                  borderColor: dragActive
                    ? PRIMARY_BLUE
                    : fileError
                      ? ERROR_COLOR
                      : '#cbd5e1',
                  bgcolor: dragActive
                    ? alpha(PRIMARY_BLUE, 0.04)
                    : fileError
                      ? alpha(ERROR_COLOR, 0.04)
                      : '#f8fafc',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  position: 'relative'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !loading && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  disabled={loading}
                />

                {!file ? (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 48, color: PRIMARY_BLUE, mb: 1 }} />
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      PDF, DOC, DOCX (Max 5MB)
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getFileIcon(file.name)}
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" fontWeight={500}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      disabled={loading}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Paper>

              {/* File Error Message */}
              {fileError && (
                <FormHelperText error sx={{ mt: -1 }}>
                  {fileError}
                </FormHelperText>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      Uploading...
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {uploadProgress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(PRIMARY_BLUE, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: PRIMARY_BLUE,
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              )}

              {/* File Format Examples */}
              <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="caption" fontWeight={600} color="textSecondary" gutterBottom display="block">
                  Supported File Formats
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<DescriptionIcon />}
                    label="PDF"
                    size="small"
                    sx={{
                      bgcolor: alpha('#EF4444', 0.1),
                      color: '#EF4444',
                      '& .MuiChip-icon': { color: '#EF4444' }
                    }}
                  />
                  <Chip
                    icon={<DescriptionIcon />}
                    label="DOC"
                    size="small"
                    sx={{
                      bgcolor: alpha('#2B5797', 0.1),
                      color: '#2B5797',
                      '& .MuiChip-icon': { color: '#2B5797' }
                    }}
                  />
                  <Chip
                    icon={<DescriptionIcon />}
                    label="DOCX"
                    size="small"
                    sx={{
                      bgcolor: alpha('#2B5797', 0.1),
                      color: '#2B5797',
                      '& .MuiChip-icon': { color: '#2B5797' }
                    }}
                  />
                </Box>
              </Paper>

              {/* Info Message */}
              <Alert
                severity="info"
                sx={{
                  borderRadius: 1.5,
                  bgcolor: alpha(PRIMARY_BLUE, 0.04),
                  border: `1px solid ${alpha(PRIMARY_BLUE, 0.2)}`
                }}
              >
                <Typography variant="caption">
                  <strong>Note:</strong> The system will automatically parse the resume and extract candidate information.
                  {selectedCandidate ? (
                    <strong> The resume will be added to the existing candidate.</strong>
                  ) : (
                    <strong> A new candidate will be created from the parsed information.</strong>
                  )}
                </Typography>
              </Alert>
            </>
          )}

          {/* Uploaded Candidate Preview */}
          {uploadedCandidate && success && (
            <Paper sx={{ p: 2, bgcolor: alpha(SUCCESS_COLOR, 0.04), borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom color={SUCCESS_COLOR} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon fontSize="small" />
                {selectedCandidate ? 'Candidate Updated Successfully' : 'Candidate Created Successfully'}
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BadgeIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography variant="body2">
                    <strong>Candidate ID:</strong> {uploadedCandidate.candidateId || uploadedCandidate._id}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography variant="body2">
                    <strong>Name:</strong> {uploadedCandidate.fullName || `${uploadedCandidate.firstName || ''} ${uploadedCandidate.lastName || ''}`.trim() || 'Not provided'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography variant="body2">
                    <strong>Email:</strong> {uploadedCandidate.email || 'Not provided'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography variant="body2">
                    <strong>Phone:</strong> {uploadedCandidate.phone || 'Not provided'}
                  </Typography>
                </Box>

                {uploadedCandidate.dateOfBirth && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography variant="body2">
                      <strong>DOB:</strong> {formatDate(uploadedCandidate.dateOfBirth)}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={uploadedCandidate.status?.toUpperCase() || 'NEW'}
                    size="small"
                    sx={{
                      bgcolor: uploadedCandidate.status === 'new' ? alpha(PRIMARY_BLUE, 0.1) :
                        uploadedCandidate.status === 'contacted' ? alpha(WARNING_COLOR, 0.1) :
                          uploadedCandidate.status === 'shortlisted' ? alpha(SUCCESS_COLOR, 0.1) :
                            alpha(PRIMARY_BLUE, 0.1),
                      color: uploadedCandidate.status === 'new' ? PRIMARY_BLUE :
                        uploadedCandidate.status === 'contacted' ? WARNING_COLOR :
                          uploadedCandidate.status === 'shortlisted' ? SUCCESS_COLOR :
                            PRIMARY_BLUE,
                      height: 24,
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  />
                </Box>

                {uploadedCandidate.skills && uploadedCandidate.skills.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                      Skills ({uploadedCandidate.skills.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {uploadedCandidate.skills.slice(0, 8).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '10px',
                            bgcolor: alpha(PRIMARY_BLUE, 0.1),
                            color: PRIMARY_BLUE
                          }}
                        />
                      ))}
                      {uploadedCandidate.skills.length > 8 && (
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5 }}>
                          +{uploadedCandidate.skills.length - 8} more
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        p: 2,
        borderTop: '1px solid #e2e8f0',
        bgcolor: '#f8fafc',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            color: '#64748B',
            '&:hover': {
              bgcolor: alpha('#64748B', 0.1)
            }
          }}
        >
          Cancel
        </Button>

        {!success && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !file ||
              loading ||
              !!fileError ||
              (candidateId && candidateLoading)
            }
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              bgcolor: PRIMARY_BLUE,
              '&:hover': { bgcolor: '#0e7490' },
              '&.Mui-disabled': {
                bgcolor: alpha(PRIMARY_BLUE, 0.3)
              },
              minWidth: 120
            }}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResumeUpload;