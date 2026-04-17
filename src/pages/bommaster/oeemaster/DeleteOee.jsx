// DeleteOee.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Factory as FactoryIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF',
    error: '#FEF3F2'
  }
};

const getOEEStatus = (oee) => {
  if (oee >= 85) return { label: 'Excellent', color: COLORS.success, icon: CheckCircleIcon };
  if (oee >= 60) return { label: 'Good', color: COLORS.primary, icon: SpeedIcon };
  if (oee >= 40) return { label: 'Fair', color: COLORS.warning, icon: WarningIcon };
  return { label: 'Poor', color: COLORS.error, icon: ErrorIcon };
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const DeleteOee = ({ open, onClose, onDelete, recordData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!recordData?._id) {
      setError('Invalid record data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${BASE_URL}/api/oee-records/${recordData._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onDelete();
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete OEE record');
      }
    } catch (err) {
      console.error('Error deleting OEE record:', err);
      setError(err.response?.data?.message || 'Failed to delete OEE record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  const oeeStatus = recordData ? getOEEStatus(recordData.oee) : null;
  const StatusIcon = oeeStatus?.icon;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
        bgcolor: COLORS.background.error,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon sx={{ color: COLORS.error, fontSize: '1.25rem' }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.error }}>
            Delete OEE Record
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              borderRadius: 1.5, 
              fontSize: '0.75rem',
              '& .MuiAlert-icon': { fontSize: '1rem' }
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Paper 
            sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              bgcolor: COLORS.background.error,
              border: `1px solid ${COLORS.error}30`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <WarningIcon sx={{ color: COLORS.error, fontSize: '1.5rem' }} />
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, lineHeight: 1.4 }}>
              Are you sure you want to delete this OEE record? This action cannot be undone and will permanently remove the record from the system.
            </Typography>
          </Paper>
        </Box>

        {recordData && (
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
              Record Details
            </Typography>
            
            <Stack spacing={1.5}>
              {/* Machine Info */}
              <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FactoryIcon sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Machine:
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {recordData.machine_name || recordData.machine_id?.machine_name || 'N/A'}
                      {recordData.machine_code && ` (${recordData.machine_code})`}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Date:
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formatDate(recordData.date)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Shift:
                    </Typography>
                    <Chip 
                      label={recordData.shift} 
                      size="small"
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  </Box>
                </Stack>
              </Paper>

              <Divider />

              {/* OEE Metrics */}
              <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  OEE Metrics
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Availability:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                      {recordData.availability}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Performance:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                      {recordData.performance}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Quality:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                      {recordData.quality}%
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {StatusIcon && <StatusIcon sx={{ fontSize: '0.875rem', color: oeeStatus?.color }} />}
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Overall OEE:
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: oeeStatus?.color }}>
                        {recordData.oee}%
                      </Typography>
                      <Chip 
                        label={oeeStatus?.label}
                        size="small"
                        sx={{ 
                          height: 18, 
                          fontSize: '0.6rem',
                          bgcolor: oeeStatus?.color,
                          color: 'white',
                          mt: 0.5
                        }}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              {recordData.total_downtime_min > 0 && (
                <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    Downtime Information
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.warning }}>
                    Total Downtime: {recordData.total_downtime_min} minutes
                  </Typography>
                </Paper>
              )}

              {recordData.notes && (
                <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    Notes
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, fontStyle: 'italic' }}>
                    "{recordData.notes}"
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
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
              borderColor: COLORS.text.disabled,
              bgcolor: COLORS.background.light
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.error,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#B91C1C'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete Record'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOee;