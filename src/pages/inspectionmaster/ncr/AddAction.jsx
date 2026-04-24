// AddAction.jsx
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
  Chip,
  Box,
  IconButton,
  Divider,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Emergency as EmergencyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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

// Action types with configurations
const ACTION_TYPES = [
  { 
    value: 'Immediate', 
    label: 'Immediate Action', 
    description: 'Short-term containment actions to stop the issue',
    icon: <EmergencyIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.error,
    example: 'Segregate non-conforming material, stop production, notify stakeholders'
  },
  { 
    value: 'Corrective', 
    label: 'Corrective Action', 
    description: 'Actions to eliminate the root cause',
    icon: <BuildIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.warning,
    example: 'Repair equipment, replace tooling, update procedure, retrain operator'
  },
  { 
    value: 'Preventive', 
    label: 'Preventive Action', 
    description: 'Proactive actions to prevent recurrence',
    icon: <SecurityIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.success,
    example: 'Add to FMEA, update control plan, implement error-proofing, increase inspection frequency'
  }
];

const ACTION_STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

const AddAction = ({ open, onClose, ncrId, ncrNumber, severity, onActionAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const [ncrDetails, setNcrDetails] = useState(null);
  const [existingActions, setExistingActions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [formData, setFormData] = useState({
    action_type: '',
    description: '',
    assigned_to: '',
    due_date: null,
    status: 'Pending'
  });

  const [touched, setTouched] = useState({
    action_type: false,
    description: false,
    assigned_to: false
  });

  useEffect(() => {
    if (open && ncrId) {
      fetchNcrDetails();
      fetchUsers();
    }
  }, [open, ncrId]);

  const fetchNcrDetails = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNcrDetails(response.data.data);
        // Fetch existing actions if any
        if (response.data.data.actions) {
          setExistingActions(response.data.data.actions);
        }
      }
    } catch (err) {
      console.error('Error fetching NCR details:', err);
      setError('Failed to load NCR details');
    } finally {
      setFetching(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setTouched(prev => ({ ...prev, [field]: false }));
    }
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getSelectedActionType = () => {
    return ACTION_TYPES.find(type => type.value === formData.action_type);
  };

  const validateForm = () => {
    if (!formData.action_type) {
      setError('Please select an action type');
      setTouched(prev => ({ ...prev, action_type: true }));
      return false;
    }
    
    if (!formData.description || !formData.description.trim()) {
      setError('Please enter action description');
      setTouched(prev => ({ ...prev, description: true }));
      return false;
    }
    
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      setTouched(prev => ({ ...prev, description: true }));
      return false;
    }
    
    if (!formData.assigned_to) {
      setError('Please assign this action to a person');
      setTouched(prev => ({ ...prev, assigned_to: true }));
      return false;
    }
    
    if (!formData.due_date) {
      setError('Please set a due date for this action');
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
      const payload = {
        action_type: formData.action_type,
        description: formData.description.trim(),
        assigned_to: formData.assigned_to,
        due_date: formData.due_date.toISOString().split('T')[0]
      };
      
      const response = await axios.post(
        `${BASE_URL}/api/ncrs/${ncrId}/actions`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSuccess(`Action added successfully to ${response.data.data.ncr_number}`);
        if (onActionAdded) {
          onActionAdded(response.data.data.action);
        }
        
        // Refresh actions list
        fetchNcrDetails();
        
        // Reset form
        setFormData({
          action_type: '',
          description: '',
          assigned_to: '',
          due_date: null,
          status: 'Pending'
        });
        
        // Close after short delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to add action');
      }
    } catch (err) {
      console.error('Error adding action:', err);
      setError(err.response?.data?.message || 'Failed to add action');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      action_type: '',
      description: '',
      assigned_to: '',
      due_date: null,
      status: 'Pending'
    });
    setTouched({
      action_type: false,
      description: false,
      assigned_to: false
    });
    setError('');
    setSuccess('');
    setNcrDetails(null);
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

  const getStatusColor = (status) => {
    const colors = {
      'Pending': COLORS.warning,
      'In Progress': COLORS.info,
      'Completed': COLORS.success,
      'Cancelled': COLORS.error
    };
    return colors[status] || COLORS.text.tertiary;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': COLORS.error,
      'Major': COLORS.warning,
      'Minor': COLORS.success
    };
    return colors[severity] || COLORS.text.secondary;
  };

  const selectedActionType = getSelectedActionType();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            <AssignmentIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
              Add Action
            </Typography>
            {ncrNumber && (
              <Chip 
                label={ncrNumber} 
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
            {severity && (
              <Chip 
                label={severity} 
                size="small" 
                sx={{ 
                  fontSize: '0.65rem', 
                  height: 22,
                  bgcolor: `${getSeverityColor(severity)}20`,
                  color: getSeverityColor(severity),
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
                Loading NCR details...
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
                  <AssignmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Add Action to NCR
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  color: COLORS.text.secondary 
                }}>
                  Add corrective, preventive, or immediate actions to address this non-conformance. 
                  Actions help track resolution steps and assign responsibilities.
                </Typography>
              </Paper>

              {/* NCR Summary */}
              {ncrDetails && (
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                      NCR Summary
                    </Typography>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Part Number</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {ncrDetails.part_no || '-'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Defect Description</Typography>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {ncrDetails.defect_description?.substring(0, 100)}...
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Action Type Selection */}
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
                  Action Type <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <Grid container spacing={1.5}>
                  {ACTION_TYPES.map((type) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={type.value}>
                      <Paper
                        onClick={() => handleChange('action_type', type.value)}
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          borderRadius: 1.5,
                          border: `1.5px solid ${formData.action_type === type.value ? type.color : COLORS.border}`,
                          bgcolor: formData.action_type === type.value ? `${type.color}10` : COLORS.background.white,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: type.color,
                            bgcolor: `${type.color}05`
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Box sx={{ color: type.color }}>{type.icon}</Box>
                          <Typography sx={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 600, 
                            color: formData.action_type === type.value ? type.color : COLORS.text.primary 
                          }}>
                            {type.label}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, lineHeight: 1.3 }}>
                          {type.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                {touched.action_type && !formData.action_type && (
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 1 }}>
                    Please select an action type
                  </Typography>
                )}
              </Paper>

              {/* Action Description */}
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
                  Action Description <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                  placeholder={`Describe the ${selectedActionType?.label || 'action'} in detail...\n\n${selectedActionType?.example || ''}`}
                  error={touched.description && (!formData.description || formData.description.length < 10)}
                  helperText={
                    touched.description && !formData.description 
                      ? 'Action description is required'
                      : touched.description && formData.description.length < 10
                        ? 'Description must be at least 10 characters'
                        : ''
                  }
                  sx={inputStyle}
                />
              </Paper>

              {/* Assignment & Due Date */}
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
                  Assignment & Timeline
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>
                      Assigned To <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={formData.assigned_to}
                      onChange={(e) => handleChange('assigned_to', e.target.value)}
                      onBlur={() => handleBlur('assigned_to')}
                      disabled={loadingUsers}
                      error={touched.assigned_to && !formData.assigned_to}
                      helperText={touched.assigned_to && !formData.assigned_to ? 'Please assign to a person' : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    >
                      <MenuItem value="">Select person</MenuItem>
                      {loadingUsers ? (
                        <MenuItem disabled>
                          <CircularProgress size={16} /> Loading...
                        </MenuItem>
                      ) : (
                        users.map((user) => (
                          <MenuItem key={user._id} value={user._id} sx={{ fontSize: '0.75rem' }}>
                            {user.Username || user.name || user.email}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>
                      Due Date <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <DatePicker 
                      value={formData.due_date} 
                      onChange={(date) => handleChange('due_date', date)}
                      minDate={new Date()}
                      slotProps={{ 
                        textField: { 
                          size: 'small', 
                          fullWidth: true, 
                          sx: inputStyle,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }
                        } 
                      }}
                    />
                    {!formData.due_date && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.error, mt: 0.5 }}>
                        Due date is required
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>

              {/* Existing Actions (if any) */}
              {existingActions.length > 0 && (
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
                    Existing Actions ({existingActions.length})
                  </Typography>
                  
                  <List dense>
                    {existingActions.map((action, index) => (
                      <React.Fragment key={action.id || index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: ACTION_TYPES.find(t => t.value === action.action_type)?.color || COLORS.primary,
                              width: 32,
                              height: 32
                            }}>
                              {ACTION_TYPES.find(t => t.value === action.action_type)?.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                  {action.action_type}
                                </Typography>
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
                            }
                            secondary={
                              <>
                                <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                                  {action.description?.substring(0, 100)}...
                                </Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                  Due: {formatDate(action.due_date)}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < existingActions.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
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
            disabled={loading || fetching}
            startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Adding...' : 'Add Action'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
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

export default AddAction;