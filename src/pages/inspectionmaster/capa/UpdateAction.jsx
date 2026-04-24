// UpdateActions.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  MenuItem,
  Box,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Build as BuildIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E6F4F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

const ACTION_STATUSES = [
  { value: 'Pending', label: 'Pending', color: COLORS.warning, icon: <ScheduleIcon sx={{ fontSize: '0.8rem' }} /> },
  { value: 'In Progress', label: 'In Progress', color: COLORS.info, icon: <BuildIcon sx={{ fontSize: '0.8rem' }} /> },
  { value: 'Completed', label: 'Completed', color: COLORS.success, icon: <CheckCircleIcon sx={{ fontSize: '0.8rem' }} /> },
  { value: 'Overdue', label: 'Overdue', color: COLORS.error, icon: <WarningIcon sx={{ fontSize: '0.8rem' }} /> }
];

const UpdateActions = ({ open, onClose, capaId, capaNumber, onActionUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedActionType, setSelectedActionType] = useState('');
  const [availableActions, setAvailableActions] = useState([]);
  const [capaDetails, setCapaDetails] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [existingEvidence, setExistingEvidence] = useState(null);
  
  const [formData, setFormData] = useState({
    status: '',
    verification_notes: ''
  });

  useEffect(() => {
    if (open && capaId) {
      fetchCapaDetails();
    }
  }, [open, capaId]);

  const fetchCapaDetails = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/capas/${capaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const capa = response.data.data;
        setCapaDetails(capa);
        
        // Combine corrective and preventive actions
        const allActions = [
          ...(capa.corrective_actions || []).map(a => ({ ...a, action_category: 'Corrective' })),
          ...(capa.preventive_actions || []).map(a => ({ ...a, action_category: 'Preventive' }))
        ];
        setAvailableActions(allActions);
      }
    } catch (err) {
      console.error('Error fetching CAPA details:', err);
      setError('Failed to load CAPA details');
    } finally {
      setFetching(false);
    }
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setSelectedActionType(action.action_category);
    setFormData({
      status: action.status || 'Pending',
      verification_notes: action.verification_notes || ''
    });
    
    if (action.completion_evidence_path) {
      setExistingEvidence(action.completion_evidence_path);
    } else {
      setExistingEvidence(null);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setError('');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, WEBP images and PDF documents are allowed');
        return;
      }
      
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const getFileIcon = () => {
    if (!selectedFile) return <CloudUploadIcon sx={{ fontSize: '2rem' }} />;
    if (selectedFile.type === 'application/pdf') {
      return <PdfIcon sx={{ fontSize: '2rem', color: COLORS.error }} />;
    }
    return <ImageIcon sx={{ fontSize: '2rem', color: COLORS.primary }} />;
  };

  const getFileTypeLabel = () => {
    if (!selectedFile) return '';
    if (selectedFile.type === 'application/pdf') return 'PDF Document';
    if (selectedFile.type.startsWith('image/')) return 'Image File';
    return 'File';
  };

  const getStatusColor = (status) => {
    const statusObj = ACTION_STATUSES.find(s => s.value === status);
    return statusObj?.color || COLORS.text.secondary;
  };

  const validateForm = () => {
    if (!selectedAction) {
      setError('Please select an action to update');
      return false;
    }
    if (!formData.status) {
      setError('Please select a status');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      
      const formDataToSend = new FormData();
      formDataToSend.append('status', formData.status);
      formDataToSend.append('verification_notes', formData.verification_notes || '');
      
      if (selectedFile) {
        formDataToSend.append('evidence', selectedFile);
      }
      
      const response = await axios.put(
        `${BASE_URL}/api/capas/${capaId}/actions/${selectedAction._id}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        setSuccess(`Action status updated to "${formData.status}"`);
        if (onActionUpdated) {
          onActionUpdated(response.data.data);
        }
        // Refresh the actions list
        fetchCapaDetails();
        setSelectedAction(null);
        setFormData({
          status: '',
          verification_notes: ''
        });
        setSelectedFile(null);
        setFilePreview(null);
        setExistingEvidence(null);
        
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to update action');
      }
    } catch (err) {
      console.error('Error updating action:', err);
      setError(err.response?.data?.message || 'Failed to update action');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedAction(null);
    setAvailableActions([]);
    setFormData({
      status: '',
      verification_notes: ''
    });
    setSelectedFile(null);
    setFilePreview(null);
    setExistingEvidence(null);
    setError('');
    setSuccess('');
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
      color: COLORS.text.primary
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.7rem',
      color: COLORS.text.secondary
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: COLORS.primary,
      fontSize: '0.7rem'
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
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
          <BuildIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Update Action
          </Typography>
          {capaNumber && (
            <Chip 
              label={capaNumber} 
              size="small" 
              sx={{ 
                fontSize: '0.65rem', 
                height: 22, 
                bgcolor: COLORS.primaryLight, 
                color: COLORS.primary,
                ml: 1
              }} 
            />
          )}
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: COLORS.text.tertiary,
            '&:hover': { color: COLORS.text.secondary }
          }}
        >
          <CloseIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading actions...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {/* Info Banner */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Update Action Status
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                Select an action to update its status and upload evidence of completion.
              </Typography>
            </Paper>

            {/* Action Selection */}
            {!selectedAction ? (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 2 
                }}>
                  Select Action to Update
                </Typography>
                
                {availableActions.length === 0 ? (
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, textAlign: 'center', py: 3 }}>
                    No actions available for this CAPA.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {availableActions.map((action, idx) => (
                      <Paper
                        key={action._id || idx}
                        onClick={() => handleActionSelect(action)}
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          borderRadius: 1.5,
                          border: `1px solid ${COLORS.border}`,
                          '&:hover': {
                            bgcolor: COLORS.background.hover,
                            borderColor: COLORS.primary
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Chip 
                                label={action.action_category || action.action_type} 
                                size="small" 
                                sx={{ fontSize: '0.6rem', height: 20 }} 
                              />
                              <Chip 
                                label={action.action_type} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.6rem', height: 20 }} 
                              />
                            </Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
                              {action.action_description}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Due: {formatDate(action.target_date)}
                            </Typography>
                          </Box>
                          <Chip 
                            label={action.status} 
                            size="small" 
                            sx={{ 
                              fontSize: '0.6rem', 
                              height: 20,
                              bgcolor: `${getStatusColor(action.status)}20`,
                              color: getStatusColor(action.status)
                            }} 
                          />
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Paper>
            ) : (
              <>
                {/* Selected Action Summary */}
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                        Selected Action
                      </Typography>
                      <Button 
                        size="small" 
                        onClick={() => setSelectedAction(null)}
                        sx={{ fontSize: '0.65rem', minWidth: 'auto' }}
                      >
                        Change
                      </Button>
                    </Box>
                    
                    <Box sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Action Description</Typography>
                      <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                          {selectedAction.action_description}
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Action Type</Typography>
                        <Chip 
                          label={selectedAction.action_type} 
                          size="small" 
                          sx={{ mt: 0.5, fontSize: '0.65rem', height: 22 }} 
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Target Date</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mt: 0.5 }}>
                          {formatDate(selectedAction.target_date)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Responsible Person</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <PersonIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {selectedAction.responsible_person_id?.Username || selectedAction.responsible_person_id?.name || 'Not Assigned'}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Status Update */}
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: COLORS.background.white, 
                  borderRadius: 2, 
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: 'none'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    color: COLORS.primary, 
                    mb: 2 
                  }}>
                    <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Action Status <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  
                  <RadioGroup
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    sx={{ gap: 1 }}
                  >
                    <Grid container spacing={1}>
                      {ACTION_STATUSES.map((status) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={status.value}>
                          <Paper
                            onClick={() => handleChange('status', status.value)}
                            sx={{
                              p: 1.5,
                              cursor: 'pointer',
                              borderRadius: 1.5,
                              border: `1.5px solid ${formData.status === status.value ? status.color : COLORS.border}`,
                              bgcolor: formData.status === status.value ? `${status.color}10` : COLORS.background.white,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: status.color,
                                bgcolor: `${status.color}05`
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ color: status.color }}>{status.icon}</Box>
                              <Typography sx={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 600, 
                                color: formData.status === status.value ? status.color : COLORS.text.primary 
                              }}>
                                {status.label}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </Paper>

                {/* Verification Notes */}
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: COLORS.background.white, 
                  borderRadius: 2, 
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: 'none'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    color: COLORS.primary, 
                    mb: 2 
                  }}>
                    <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Verification Notes
                  </Typography>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    value={formData.verification_notes}
                    onChange={(e) => handleChange('verification_notes', e.target.value)}
                    placeholder="Add notes about the action completion, verification details, observations..."
                    sx={inputStyle}
                  />
                </Paper>

                {/* Evidence Upload */}
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: COLORS.background.white, 
                  borderRadius: 2, 
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: 'none'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    color: COLORS.primary, 
                    mb: 2 
                  }}>
                    <CloudUploadIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Evidence Upload
                  </Typography>

                  {/* Existing Evidence */}
                  {existingEvidence && !selectedFile && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mb: 1 }}>
                        Current Evidence
                      </Typography>
                      <Paper sx={{ 
                        p: 1.5, 
                        bgcolor: COLORS.background.light, 
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: COLORS.background.hover }
                      }}
                      onClick={() => window.open(`${BASE_URL}${existingEvidence}`, '_blank')}
                      >
                        {existingEvidence.toLowerCase().endsWith('.pdf') ? (
                          <PdfIcon sx={{ fontSize: '1.5rem', color: COLORS.error }} />
                        ) : (
                          <ImageIcon sx={{ fontSize: '1.5rem', color: COLORS.primary }} />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            {existingEvidence.split('/').pop()}
                          </Typography>
                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                            Click to view existing evidence
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  )}

                  {/* New Evidence Upload */}
                  {!selectedFile ? (
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      sx={{
                        height: 80,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        borderColor: COLORS.border,
                        color: COLORS.text.secondary,
                        borderStyle: 'dashed',
                        '&:hover': {
                          borderColor: COLORS.primary,
                          bgcolor: `${COLORS.primary}10`
                        }
                      }}
                    >
                      <Stack direction="column" alignItems="center" spacing={0.5}>
                        <CloudUploadIcon sx={{ fontSize: '1.5rem' }} />
                        <Typography sx={{ fontSize: '0.7rem' }}>
                          Click to upload evidence (JPEG, PNG, GIF, WEBP, PDF, max 10MB)
                        </Typography>
                      </Stack>
                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ) : (
                    <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                      <Paper sx={{ 
                        p: 1.5, 
                        bgcolor: COLORS.background.light, 
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}>
                        {getFileIcon()}
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }} noWrap>
                            {selectedFile.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB - {getFileTypeLabel()}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={removeFile}
                          sx={{
                            color: COLORS.error,
                            '&:hover': { bgcolor: `${COLORS.error}10` }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: '0.8rem' }} />
                        </IconButton>
                      </Paper>
                      {filePreview && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={filePreview}
                            alt="Preview"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '150px',
                              borderRadius: '8px',
                              border: `1px solid ${COLORS.border}`
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 1 }}>
                    Upload evidence of action completion (images or PDF, max 10MB)
                  </Typography>
                </Paper>
              </>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {success}
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
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          size="small"
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
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !selectedAction}
          startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SaveIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark },
            '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
          }}
        >
          {loading ? 'Updating...' : 'Update Action'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateActions;