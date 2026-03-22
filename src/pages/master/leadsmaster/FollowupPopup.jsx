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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  IconButton,
  FormHelperText
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Phone as PhoneIcon, 
  Email as EmailIcon,
  Send as SendIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

const FollowupPopup = ({ open, onClose, lead, onFollowup }) => {
  const [followupType, setFollowupType] = useState('call');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Call Follow-up Form Data
  const [callFormData, setCallFormData] = useState({
    channel: 'Call',
    summary: '',
    outcome: 'Positive',
    next_action: '',
    next_action_date: ''
  });
  
  // Email Follow-up Form Data
  const [emailFormData, setEmailFormData] = useState({
    channel: 'Email',
    summary: '',
    outcome: 'Neutral'
  });

  // Outcome options based on enum
  const outcomeOptions = ['Positive', 'Neutral', 'Negative', 'No Response'];

  const handleCallChange = (e) => {
    const { name, value } = e.target;
    setCallFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCallForm = () => {
    if (!callFormData.summary.trim()) {
      setError('Summary is required');
      return false;
    }
    if (!callFormData.outcome) {
      setError('Outcome is required');
      return false;
    }
    return true;
  };

  const validateEmailForm = () => {
    if (!emailFormData.summary.trim()) {
      setError('Summary is required');
      return false;
    }
    if (!emailFormData.outcome) {
      setError('Outcome is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    
    let requestData = {};
    
    if (followupType === 'call') {
      if (!validateCallForm()) return;
      requestData = {
        channel: 'Call',
        summary: callFormData.summary,
        outcome: callFormData.outcome,
        next_action: callFormData.next_action || undefined,
        next_action_date: callFormData.next_action_date ? new Date(callFormData.next_action_date).toISOString() : undefined
      };
    } else if (followupType === 'email') {
      if (!validateEmailForm()) return;
      requestData = {
        channel: 'Email',
        summary: emailFormData.summary,
        outcome: emailFormData.outcome
      };
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/leads/${lead._id}/followup`,
        requestData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onFollowup(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to add follow-up');
      }
    } catch (err) {
      console.error('Error adding follow-up:', err);
      setError(err.response?.data?.message || 'Failed to add follow-up');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFollowupType('call');
    setCallFormData({
      channel: 'Call',
      summary: '',
      outcome: 'Positive',
      next_action: '',
      next_action_date: ''
    });
    setEmailFormData({
      channel: 'Email',
      summary: '',
      outcome: 'Neutral'
    });
    setError('');
    onClose();
  };

  // Helper function to get outcome color for chip display
  const getOutcomeColor = (outcome) => {
    const colors = {
      'Positive': { bg: '#DCFCE7', color: '#166534' },
      'Neutral': { bg: '#FEF3C7', color: '#92400E' },
      'Negative': { bg: '#FEE2E2', color: '#991B1B' },
      'No Response': { bg: '#EFF6FF', color: '#1E40AF' }
    };
    return colors[outcome] || { bg: '#F1F5F9', color: '#475569' };
  };

  if (!lead) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
          Add Follow-up
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
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Contact:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.contact_name}
                </Typography>
              </Stack>
            </Stack>
          </Paper> */}

          {/* Follow-up Type Selection */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1, letterSpacing: '0.5px' }}>
              FOLLOW-UP TYPE <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant={followupType === 'call' ? 'contained' : 'outlined'}
                  onClick={() => setFollowupType('call')}
                  startIcon={<PhoneIcon />}
                  sx={{
                    height: 48,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    bgcolor: followupType === 'call' ? COLORS.primary : 'transparent',
                    borderColor: COLORS.border,
                    color: followupType === 'call' ? COLORS.text.light : COLORS.text.secondary,
                    '&:hover': {
                      bgcolor: followupType === 'call' ? COLORS.primaryDark : COLORS.primaryLight
                    }
                  }}
                >
                  Phone Call
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant={followupType === 'email' ? 'contained' : 'outlined'}
                  onClick={() => setFollowupType('email')}
                  startIcon={<EmailIcon />}
                  sx={{
                    height: 48,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    bgcolor: followupType === 'email' ? COLORS.primary : 'transparent',
                    borderColor: COLORS.border,
                    color: followupType === 'email' ? COLORS.text.light : COLORS.text.secondary,
                    '&:hover': {
                      bgcolor: followupType === 'email' ? COLORS.primaryDark : COLORS.primaryLight
                    }
                  }}
                >
                  Email Sent
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Form based on selected follow-up type */}
          {followupType === 'call' && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Phone Call Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      SUMMARY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="summary"
                      multiline
                      rows={3}
                      value={callFormData.summary}
                      onChange={handleCallChange}
                      placeholder="e.g., Spoke with Rajesh. Interested but needs revised pricing."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      OUTCOME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="outcome"
                        value={callFormData.outcome}
                        onChange={handleCallChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {outcomeOptions.map(option => {
                          const outcomeColor = getOutcomeColor(option);
                          return (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%', 
                                  bgcolor: outcomeColor.color 
                                }} />
                                <span>{option}</span>
                              </Stack>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                      Select the outcome of the call
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      NEXT ACTION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="next_action"
                      value={callFormData.next_action}
                      onChange={handleCallChange}
                      placeholder="e.g., Send revised quotation with 5% discount"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      NEXT ACTION DATE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="next_action_date"
                      type="date"
                      value={callFormData.next_action_date}
                      onChange={handleCallChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                      When to follow up next (optional)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Preview of selected outcome */}
              {/* {callFormData.outcome && (
                <Box sx={{ 
                  mt: 2,
                  p: 1.5, 
                  bgcolor: COLORS.primaryLight, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.primary}`
                }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primaryDark, mb: 0.5 }}>
                    Selected Outcome:
                  </Typography>
                  <Chip
                    label={callFormData.outcome}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 24,
                      bgcolor: getOutcomeColor(callFormData.outcome).bg,
                      color: getOutcomeColor(callFormData.outcome).color,
                      fontWeight: 500
                    }}
                  />
                </Box>
              )} */}
            </Box>
          )}

          {followupType === 'email' && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Email Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      SUMMARY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="summary"
                      multiline
                      rows={3}
                      value={emailFormData.summary}
                      onChange={handleEmailChange}
                      placeholder="e.g., Sent quotation QT-202503-0042 to customer"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      OUTCOME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="outcome"
                        value={emailFormData.outcome}
                        onChange={handleEmailChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {outcomeOptions.map(option => {
                          const outcomeColor = getOutcomeColor(option);
                          return (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%', 
                                  bgcolor: outcomeColor.color 
                                }} />
                                <span>{option}</span>
                              </Stack>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                      Select the outcome of the email
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Preview of selected outcome */}
              {emailFormData.outcome && (
                <Box sx={{ 
                  mt: 2,
                  p: 1.5, 
                  bgcolor: COLORS.primaryLight, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.primary}`
                }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primaryDark, mb: 0.5 }}>
                    Selected Outcome:
                  </Typography>
                  <Chip
                    label={emailFormData.outcome}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 24,
                      bgcolor: getOutcomeColor(emailFormData.outcome).bg,
                      color: getOutcomeColor(emailFormData.outcome).color,
                      fontWeight: 500
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          {error && (
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
          disabled={loading || (followupType === 'call' ? !callFormData.summary : !emailFormData.summary)}
          startIcon={loading ? null : <SendIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Saving...' : 'Save Follow-up'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowupPopup;