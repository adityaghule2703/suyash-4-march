// AssemblyQueue.jsx
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
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  Queue as AssemblyQueueIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

const AssemblyQueuePopup = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assemblyData, setAssemblyData] = useState([]);

  useEffect(() => {
    if (open) {
      fetchAssemblyQueue();
    }
  }, [open]);

  const fetchAssemblyQueue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/assembly-queue`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setAssemblyData(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to load assembly queue');
      }
    } catch (err) {
      console.error('Error fetching assembly queue:', err);
      setError(err.response?.data?.message || 'Failed to load assembly queue');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#059669';
      case 'In Progress': return '#0284C7';
      case 'Released': return '#4338CA';
      case 'On Hold': return '#DC2626';
      default: return '#94A3B8';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Completed': return '#D1FAE5';
      case 'In Progress': return '#E0F2FE';
      case 'Released': return '#E0E7FF';
      case 'On Hold': return '#FEE2E2';
      default: return '#F1F5F9';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <AssemblyQueueIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Assembly Queue
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
        ) : assemblyData.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>No assembly work orders in queue</Alert>
        ) : (
          <Stack spacing={2}>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Total Assembly Orders: <strong>{assemblyData.length}</strong>
            </Typography>

            {assemblyData.map((wo) => {
              const inProgressOps = wo.operations?.filter(op => op.status === 'In Progress').length || 0;
              const completedOps = wo.operations?.filter(op => op.status === 'Completed').length || 0;
              const totalOps = wo.operations?.length || 0;
              const progressPercent = totalOps > 0 ? (completedOps / totalOps) * 100 : 0;
              const statusColors = { bg: getStatusBg(wo.status), color: getStatusColor(wo.status) };

              return (
                <Paper
                  key={wo._id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    bgcolor: COLORS.background.white,
                    '&:hover': { borderColor: COLORS.primary }
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.primary }}>
                          {wo.wo_number}
                        </Typography>
                        <Chip 
                          label={wo.wo_type} 
                          size="small" 
                          sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                        />
                        <Chip 
                          label={wo.status} 
                          size="small" 
                          sx={{ fontSize: '0.6rem', height: 20, bgcolor: statusColors.bg, color: statusColors.color }}
                        />
                      </Stack>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        SO: {wo.so_number || 'N/A'}
                      </Typography>
                    </Stack>

                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Part</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.part_no} - {wo.part_name}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Planned Qty</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.planned_qty}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Completed</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.completed_qty}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Assembly Line</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.assembly_line || 'Not Assigned'}</Typography>
                      </Grid>
                    </Grid>

                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Operation Progress</Typography>
                        <Typography sx={{ fontSize: '0.55rem', fontWeight: 500 }}>
                          {completedOps}/{totalOps} operations
                        </Typography>
                      </Stack>
                      <Box sx={{ width: '100%', bgcolor: '#E5E7EB', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{ width: `${progressPercent}%`, bgcolor: COLORS.primary, height: 4 }} />
                      </Box>
                    </Box>

                    {inProgressOps > 0 && (
                      <Box sx={{ p: 1, bgcolor: '#E0F2FE', borderRadius: 1 }}>
                        <Typography sx={{ fontSize: '0.6rem', color: '#0284C7' }}>
                          ⚡ {inProgressOps} operation(s) currently in progress
                        </Typography>
                      </Box>
                    )}

                    <Stack direction="row" spacing={2} sx={{ pt: 0.5 }}>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                        Planned: {formatDate(wo.planned_start)} → {formatDate(wo.planned_end)}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                        Required By: {formatDate(wo.required_by)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssemblyQueuePopup;