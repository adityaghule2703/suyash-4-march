import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Paper,
  Alert,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  Close as CloseIcon, 
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

const FeasibilityPopup = ({ open, onClose, lead, onFeasibilityUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    feasibility_status: '',
    feasibility_notes: ''
  });

  const feasibilityOptions = [
    { value: 'Feasible', label: 'Feasible', color: '#10B981', icon: CheckCircleIcon },
    { value: 'Conditionally Feasible', label: 'Conditionally Feasible', color: '#F59E0B', icon: WarningIcon },
    { value: 'Not Feasible', label: 'Not Feasible', color: '#EF4444', icon: CancelIcon }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.feasibility_status) {
      setError('Please select feasibility status');
      return false;
    }
    if (!formData.feasibility_notes.trim()) {
      setError('Feasibility notes are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/leads/${lead._id}/feasibility`,
        {
          feasibility_status: formData.feasibility_status,
          feasibility_notes: formData.feasibility_notes
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onFeasibilityUpdate(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update feasibility');
      }
    } catch (err) {
      console.error('Error updating feasibility:', err);
      setError(err.response?.data?.message || 'Failed to update feasibility');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      feasibility_status: '',
      feasibility_notes: ''
    });
    setError('');
    onClose();
  };

  const getStatusIcon = (status) => {
    const option = feasibilityOptions.find(opt => opt.value === status);
    if (option) {
      const Icon = option.icon;
      return <Icon sx={{ fontSize: 20, color: option.color }} />;
    }
    return null;
  };

  const getStatusColor = (status) => {
    const option = feasibilityOptions.find(opt => opt.value === status);
    return option ? option.color : COLORS.text.secondary;
  };

  if (!lead) return null;

  // Get current feasibility info if exists
  const hasCurrentFeasibility = lead.feasibility_status || lead.feasibility_notes;
  const currentStatusColor = getStatusColor(lead.feasibility_status);

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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Feasibility Analysis
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Lead Information */}
          {/* <Paper sx={{ 
            p: 1.5, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lead ID:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.lead_id}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Company:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.company_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Subject:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.subject}
                </Typography>
              </Stack>
              {lead.enquired_items && lead.enquired_items.length > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Enquired Items:</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {lead.enquired_items.length} item(s)
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Paper> */}

          {/* Current Feasibility Info (if exists) */}
          {hasCurrentFeasibility && (
            <Paper sx={{ 
              p: 1.5, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.primary}`
            }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primaryDark, mb: 1 }}>
                Current Feasibility Information
              </Typography>
              <Stack spacing={1}>
                {lead.feasibility_status && (
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                    <Chip
                      icon={getStatusIcon(lead.feasibility_status)}
                      label={lead.feasibility_status}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24,
                        bgcolor: `${getStatusColor(lead.feasibility_status)}20`,
                        color: getStatusColor(lead.feasibility_status),
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: getStatusColor(lead.feasibility_status)
                        }
                      }}
                    />
                  </Stack>
                )}
                {lead.feasibility_notes && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Notes:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary, maxWidth: '60%', textAlign: 'right' }}>
                      {lead.feasibility_notes}
                    </Typography>
                  </Stack>
                )}
                {lead.feasibility_date && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Date:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {new Date(lead.feasibility_date).toLocaleDateString()}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Paper>
          )}

          {/* Feasibility Status Selection */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1, letterSpacing: '0.5px' }}>
              FEASIBILITY STATUS <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <FormControl fullWidth size="small" error={!!error && !formData.feasibility_status}>
              <Select
                name="feasibility_status"
                value={formData.feasibility_status}
                onChange={handleChange}
                displayEmpty
                sx={{
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '& .MuiSelect-select': {
                    py: 1,
                    px: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  },
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary
                    }
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: 1
                    }
                  }
                }}
              >
                <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                  Select feasibility status
                </MenuItem>
                {feasibilityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Icon sx={{ fontSize: 18, color: option.color }} />
                        <span>{option.label}</span>
                      </Stack>
                    </MenuItem>
                  );
                })}
              </Select>
              {error && !formData.feasibility_status && (
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                  {error}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Feasibility Notes */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1, letterSpacing: '0.5px' }}>
              FEASIBILITY NOTES <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="feasibility_notes"
              multiline
              rows={4}
              value={formData.feasibility_notes}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., C11000 available. Existing 80T press fits. 3-week delivery."
              error={!!error && !formData.feasibility_notes}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': {
                    borderColor: COLORS.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORS.primary,
                    borderWidth: 1
                  }
                },
                '& .MuiInputBase-input': {
                  py: 1,
                  px: 1.5,
                  fontSize: '0.75rem',
                  color: COLORS.text.primary,
                  '&::placeholder': {
                    color: COLORS.text.tertiary,
                    fontSize: '0.75rem'
                  }
                }
              }}
            />
            {error && !formData.feasibility_notes && (
              <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                {error}
              </Typography>
            )}
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
              Provide detailed analysis, conditions, and remarks about feasibility
            </Typography>
          </Box>

          {/* Preview of Selected Feasibility */}
          {formData.feasibility_status && formData.feasibility_notes && (
            <Box sx={{ 
              p: 1.5, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.primary}`
            }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primaryDark, mb: 1 }}>
                Feasibility Summary Preview
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                  <Chip
                    icon={getStatusIcon(formData.feasibility_status)}
                    label={formData.feasibility_status}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 24,
                      bgcolor: `${getStatusColor(formData.feasibility_status)}20`,
                      color: getStatusColor(formData.feasibility_status),
                      fontWeight: 500
                    }}
                  />
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Notes:</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary, maxWidth: '60%', textAlign: 'right' }}>
                    {formData.feasibility_notes}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}

          {error && error.includes('Please') === false && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
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
          disabled={loading || !formData.feasibility_status || !formData.feasibility_notes}
          startIcon={loading ? null : <ScienceIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Feasibility'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeasibilityPopup;