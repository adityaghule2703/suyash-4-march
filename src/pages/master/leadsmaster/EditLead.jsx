import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  Grid,
  Paper
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS, PRIORITY_OPTIONS, STATUS_OPTIONS, FEASIBILITY_STATUS_OPTIONS } from './constants';

const EditLead = ({ open, onClose, lead, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedFeasibilityStatus, setSelectedFeasibilityStatus] = useState('');

  useEffect(() => {
    if (lead) {
      const priority = lead.priority || 'Medium';
      const status = lead.status || '';
      const feasibilityStatus = lead.feasibility_status || '';
      
      setFormData({
        priority: priority,
        estimated_value: lead.estimated_value || '',
        next_follow_up_date: lead.next_follow_up_date ? lead.next_follow_up_date.split('T')[0] : '',
        status: status,
        feasibility_status: feasibilityStatus,
        feasibility_notes: lead.feasibility_notes || ''
      });
      
      setSelectedPriority(priority);
      setSelectedStatus(status);
      setSelectedFeasibilityStatus(feasibilityStatus);
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (event, newValue) => {
    setSelectedPriority(newValue);
    setFormData(prev => ({ ...prev, priority: newValue || 'Medium' }));
  };

  const handleStatusChange = (event, newValue) => {
    setSelectedStatus(newValue);
    setFormData(prev => ({ ...prev, status: newValue || '' }));
  };

  const handleFeasibilityStatusChange = (event, newValue) => {
    setSelectedFeasibilityStatus(newValue);
    setFormData(prev => ({ ...prev, feasibility_status: newValue || '' }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const updateData = {};
      
      if (formData.priority) updateData.priority = formData.priority;
      if (formData.estimated_value) updateData.estimated_value = Number(formData.estimated_value);
      if (formData.next_follow_up_date) updateData.next_follow_up_date = new Date(formData.next_follow_up_date).toISOString();
      if (formData.status) updateData.status = formData.status;
      if (formData.feasibility_status) updateData.feasibility_status = formData.feasibility_status;
      if (formData.feasibility_notes) updateData.feasibility_notes = formData.feasibility_notes;

      const response = await axios.put(`${BASE_URL}/api/leads/${lead._id}`, updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update lead');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
      setError(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  if (!lead) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Edit Lead
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Lead ID and Subject Info */}
            <Box sx={{ gridColumn: 'span 2', mb: 1 }}>
              <Paper sx={{ 
                p: 1.5, 
                bgcolor: COLORS.primaryLight, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.primary}`
              }}>
                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lead ID:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {lead.lead_id}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Subject:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {lead.subject}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Company:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {lead.company_name}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Box>

            {/* Priority Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  PRIORITY
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.priority}
                    onChange={handleChange}
                    name="priority"
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': {
                        py: 1,
                        px: 1.5
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
                    {PRIORITY_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Estimated Value Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  ESTIMATED VALUE
                </Typography>
                <TextField
                  fullWidth
                  name="estimated_value"
                  type="number"
                  value={formData.estimated_value}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., 250000"
                  size="small"
                  variant="outlined"
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
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  Estimated value in INR
                </Typography>
              </Box>
            </Box>

            {/* Next Follow-up Date Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  NEXT FOLLOW-UP DATE
                </Typography>
                <TextField
                  fullWidth
                  name="next_follow_up_date"
                  type="date"
                  value={formData.next_follow_up_date}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
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
                      color: COLORS.text.primary
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Status Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  STATUS
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.status}
                    onChange={handleChange}
                    name="status"
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': {
                        py: 1,
                        px: 1.5
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
                    {STATUS_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Feasibility Status Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  FEASIBILITY STATUS
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.feasibility_status}
                    onChange={handleChange}
                    name="feasibility_status"
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': {
                        py: 1,
                        px: 1.5
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
                    {FEASIBILITY_STATUS_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Feasibility Notes Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  FEASIBILITY NOTES
                </Typography>
                <TextField
                  fullWidth
                  name="feasibility_notes"
                  multiline
                  rows={4}
                  value={formData.feasibility_notes}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Add feasibility notes, conditions, or remarks..."
                  size="small"
                  variant="outlined"
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
              </Box>
            </Box>

            {/* Current Values Preview */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ 
                p: 2, 
                bgcolor: COLORS.primaryLight, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.primary}`,
                mt: 1
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: COLORS.primaryDark, 
                    mb: 1.5,
                    fontSize: '0.8rem'
                  }}
                >
                  Current Lead Information
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Priority:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {lead.priority || 'Not set'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Estimated Value:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {lead.estimated_value ? `₹${lead.estimated_value.toLocaleString()}` : 'Not set'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {lead.status || 'New'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Feasibility Status:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {lead.feasibility_status || 'Not assessed'}
                    </Typography>
                  </Stack>
                  
                  {lead.feasibility_notes && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Feasibility Notes:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary, maxWidth: '60%', textAlign: 'right' }}>
                        {lead.feasibility_notes}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                mt: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem',
                  alignItems: 'center'
                },
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
          onClick={onClose}
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
          disabled={loading}
          startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Updating...' : 'Update Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLead;