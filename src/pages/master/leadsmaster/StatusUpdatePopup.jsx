import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  FormHelperText
} from '@mui/material';
import { Close as CloseIcon, Update as UpdateIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS, STATUS_COLORS, STATUS_TRANSITIONS } from './constants';

const StatusUpdatePopup = ({ open, onClose, lead, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentStatus = lead?.status || 'New';
  const availableStatuses = STATUS_TRANSITIONS[currentStatus] || [];

  const handleSubmit = async () => {
    if (!selectedStatus) {
      setError('Please select a status');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/leads/${lead._id}/status`,
        { status: selectedStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        onStatusUpdate(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus('');
    setError('');
    onClose();
  };

  const getStatusLabel = (status) => {
    const labels = {
      'New': 'New',
      'Contacted': 'Contacted',
      'Qualified': 'Qualified',
      'Proposal Sent': 'Proposal Sent',
      'Negotiation': 'Negotiation',
      'Won': 'Won',
      'Lost': 'Lost',
      'Junk': 'Junk'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': { bg: '#EFF6FF', color: '#1E40AF' },
      'Contacted': { bg: '#FEF3C7', color: '#92400E' },
      'Qualified': { bg: '#D1FAE5', color: '#065F46' },
      'Proposal Sent': { bg: '#FCE7F3', color: '#9D174D' },
      'Negotiation': { bg: '#FEF9C3', color: '#854D0E' },
      'Won': { bg: '#DCFCE7', color: '#166534' },
      'Lost': { bg: '#FEE2E2', color: '#991B1B' },
      'Junk': { bg: '#F1F5F9', color: '#475569' }
    };
    return colors[status] || { bg: '#F1F5F9', color: '#475569' };
  };

  if (!lead) return null;

  const currentStatusColors = getStatusColor(currentStatus);

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
          Update Status
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Lead Information */}
          <Paper sx={{ 
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
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Subject:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.subject}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Company:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.company_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Status:</Typography>
                <Chip 
                  label={getStatusLabel(currentStatus)} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.7rem', 
                    height: 24,
                    bgcolor: currentStatusColors.bg,
                    color: currentStatusColors.color,
                    fontWeight: 500
                  }} 
                />
              </Stack>
            </Stack>
          </Paper>

          {/* Status Selection */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1, letterSpacing: '0.5px' }}>
              NEW STATUS <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <FormControl fullWidth size="small" error={!!error}>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                displayEmpty
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
                <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                  Select new status
                </MenuItem>
                {availableStatuses.map((status) => {
                  const statusColor = getStatusColor(status);
                  return (
                    <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: statusColor.color,
                          border: `1px solid ${statusColor.bg}`
                        }} />
                        <span>{getStatusLabel(status)}</span>
                      </Stack>
                    </MenuItem>
                  );
                })}
              </Select>
              {availableStatuses.length === 0 && (
                <FormHelperText sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                  This lead is in a terminal state and cannot be updated further
                </FormHelperText>
              )}
              {error && (
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                  {error}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Transition Info */}
          {availableStatuses.length > 0 && (
            <Box sx={{ 
              p: 1.5, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.primary}`
            }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primaryDark, mb: 0.5 }}>
                Available Status Transitions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {availableStatuses.map((status) => {
                  const statusColor = getStatusColor(status);
                  return (
                    <Chip
                      key={status}
                      label={getStatusLabel(status)}
                      size="small"
                      sx={{ 
                        fontSize: '0.65rem', 
                        height: 22,
                        bgcolor: statusColor.bg,
                        color: statusColor.color
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
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
          disabled={loading || availableStatuses.length === 0 || !selectedStatus}
          startIcon={loading ? null : <UpdateIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdatePopup;