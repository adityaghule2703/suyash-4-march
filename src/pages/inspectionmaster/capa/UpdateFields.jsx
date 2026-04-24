// UpdateFields.jsx
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
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Divider,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon
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

const UpdateFields = ({ open, onClose, capaId, capaNumber, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [formData, setFormData] = useState({
    problem_statement: '',
    defect_description: '',
    root_cause: '',
    quantity_affected: '',
    customer_impact: false,
    assigned_to: '',
    target_close_date: null
  });

  const [originalData, setOriginalData] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open && capaId) {
      fetchCapaDetails();
      fetchUsers();
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
        setOriginalData(capa);
        setFormData({
          problem_statement: capa.problem_statement || '',
          defect_description: capa.defect_description || '',
          root_cause: capa.root_cause || '',
          quantity_affected: capa.quantity_affected || '',
          customer_impact: capa.customer_impact || false,
          assigned_to: capa.assigned_to?._id || capa.assigned_to || '',
          target_close_date: capa.target_close_date ? new Date(capa.target_close_date) : null
        });
      }
    } catch (err) {
      console.error('Error fetching CAPA details:', err);
      setError('Failed to load CAPA details');
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
        setUsersList(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    return (
      formData.problem_statement !== (originalData.problem_statement || '') ||
      formData.defect_description !== (originalData.defect_description || '') ||
      formData.root_cause !== (originalData.root_cause || '') ||
      String(formData.quantity_affected) !== String(originalData.quantity_affected || '') ||
      formData.customer_impact !== (originalData.customer_impact || false) ||
      formData.assigned_to !== (originalData.assigned_to?._id || originalData.assigned_to || '') ||
      (formData.target_close_date ? formData.target_close_date.toISOString().split('T')[0] : '') !== (originalData.target_close_date?.split('T')[0] || '')
    );
  };

  const validateForm = () => {
    if (!formData.problem_statement?.trim()) {
      setError('Problem statement is required');
      return false;
    }
    if (!formData.root_cause?.trim()) {
      setError('Root cause analysis is required');
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
        problem_statement: formData.problem_statement,
        defect_description: formData.defect_description || formData.problem_statement,
        root_cause: formData.root_cause,
        quantity_affected: Number(formData.quantity_affected) || 0,
        customer_impact: formData.customer_impact,
        assigned_to: formData.assigned_to || null,
        target_close_date: formData.target_close_date ? formData.target_close_date.toISOString().split('T')[0] : null
      };
      
      const response = await axios.put(`${BASE_URL}/api/capas/${capaId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSuccess(`CAPA ${response.data.data.capa_id} updated successfully`);
        if (onUpdated) {
          onUpdated(response.data.data);
        }
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update CAPA');
      }
    } catch (err) {
      console.error('Error updating CAPA:', err);
      setError(err.response?.data?.message || 'Failed to update CAPA');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      problem_statement: '',
      defect_description: '',
      root_cause: '',
      quantity_affected: '',
      customer_impact: false,
      assigned_to: '',
      target_close_date: null
    });
    setOriginalData(null);
    setTouched({});
    setError('');
    setSuccess('');
    onClose();
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': { py: 0.5, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary },
    '& .MuiInputLabel-root': { fontSize: '0.7rem', color: COLORS.text.secondary },
    '& .MuiInputLabel-root.Mui-focused': { color: COLORS.primary, fontSize: '0.7rem' }
  };

  const labelStyle = { fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', mb: 0.5 };

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
            <EditIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
              Update CAPA Fields
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
                Loading CAPA details...
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
           

              {/* Problem Statement */}
              <Paper sx={{ 
                p: 1, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1
                }}>
                  <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Problem Statement <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={1}
                  size="small"
                  value={formData.problem_statement}
                  onChange={(e) => handleChange('problem_statement', e.target.value)}
                  placeholder="Describe the problem or non-conformance..."
                  sx={inputStyle}
                />
              </Paper>

              {/* Root Cause Analysis */}
              <Paper sx={{ 
                p: 1, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1
                }}>
                  <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Root Cause Analysis <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={1}
                  size="small"
                  value={formData.root_cause}
                  onChange={(e) => handleChange('root_cause', e.target.value)}
                  placeholder="Identify the root cause using 5-Why, Fishbone, or other analysis methods..."
                  sx={inputStyle}
                />
              </Paper>

              {/* Quantity Affected & Customer Impact */}
              <Paper sx={{ 
                p: 1, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1
                }}>
                  <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Impact Assessment
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Quantity Affected</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={formData.quantity_affected}
                      onChange={(e) => handleChange('quantity_affected', e.target.value)}
                      placeholder="Number of units affected"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Units</InputAdornment>,
                      }}
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Customer Impact</Typography>
                    <RadioGroup 
                      row 
                      value={formData.customer_impact} 
                      onChange={(e) => handleChange('customer_impact', e.target.value === 'true')}
                    >
                      <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                      <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Paper>

              {/* Assignment & Target Date */}
              <Paper sx={{ 
                p: 1, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1
                }}>
                  <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Assignment & Timeline
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Assigned To</Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={formData.assigned_to}
                      onChange={(e) => handleChange('assigned_to', e.target.value)}
                      disabled={loadingUsers}
                      sx={inputStyle}
                    >
                      <MenuItem value="">Not Assigned</MenuItem>
                      {loadingUsers ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        usersList.map((user) => (
                          <MenuItem key={user._id} value={user._id} sx={{ fontSize: '0.75rem' }}>
                            {user.Username || user.name || user.email}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Target Close Date</Typography>
                    <DatePicker 
                      value={formData.target_close_date} 
                      onChange={(date) => handleChange('target_close_date', date)}
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
                  </Grid>
                </Grid>
              </Paper>

              {/* Defect Description (Optional) */}
              <Paper sx={{ 
                p: 1, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1
                }}>
                  <WarningIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Defect Description (Optional)
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={1}
                  size="small"
                  value={formData.defect_description}
                  onChange={(e) => handleChange('defect_description', e.target.value)}
                  placeholder="Detailed description of the defect (if different from problem statement)"
                  sx={inputStyle}
                />
              </Paper>

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
            disabled={loading || fetching || !hasChanges()}
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
            {loading ? 'Updating...' : 'Update CAPA'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default UpdateFields;