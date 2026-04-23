// WipReport.jsx
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
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  Assessment as WipReportIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF'
};

const STATUS_COLORS = {
  'Planned': { bg: '#E0F2FE', color: '#0284C7' },
  'Released': { bg: '#E0E7FF', color: '#4338CA' },
  'In Progress': { bg: '#E0F2FE', color: '#0284C7' },
  'On Hold': { bg: '#FEE2E2', color: '#DC2626' },
  'Completed': { bg: '#D1FAE5', color: '#059669' }
};

const WipReportPopup = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wipData, setWipData] = useState(null);

  useEffect(() => {
    if (open) {
      fetchWipReport();
    }
  }, [open]);

  const fetchWipReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/wip-report`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setWipData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load WIP report');
      }
    } catch (err) {
      console.error('Error fetching WIP report:', err);
      setError(err.response?.data?.message || 'Failed to load WIP report');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
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
          <WipReportIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Work In Progress (WIP) Report
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
        ) : wipData ? (
          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Open Work Orders</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>{wipData.open_wo_count}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Machining WIP Value</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>{formatCurrency(wipData.machining_wip_value)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Assembly WIP Value</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>{formatCurrency(wipData.assembly_wip_value)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Total WIP Value</Typography>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: COLORS.primary }}>{formatCurrency(wipData.total_wip_value)}</Typography>
              </Stack>
            </Paper>

            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primary, mt: 1 }}>
              Work Orders in Progress
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>WO Number</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Qty</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Planned Start</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wipData.work_orders?.map((wo) => {
                    const statusColors = STATUS_COLORS[wo.status] || { bg: '#F1F5F9', color: '#475569' };
                    const completionPercent = wo.planned_qty > 0 ? (wo.completed_qty / wo.planned_qty) * 100 : 0;
                    return (
                      <TableRow key={wo._id} hover>
                        <TableCell><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.wo_number}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.7rem' }}>{wo.part_no}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.7rem' }}>{wo.customer_name}</Typography></TableCell>
                        <TableCell><Chip label={wo.wo_type || 'N/A'} size="small" sx={{ fontSize: '0.6rem', height: 20 }} /></TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.completed_qty} / {wo.planned_qty}</Typography>
                          <Box sx={{ width: 60, mt: 0.5, bgcolor: '#E5E7EB', borderRadius: 1, overflow: 'hidden' }}>
                            <Box sx={{ width: `${completionPercent}%`, bgcolor: COLORS.primary, height: 2 }} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={wo.status} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: statusColors.bg, color: statusColors.color }} />
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.65rem' }}>{formatDate(wo.planned_start)}</Typography></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>No WIP data available</Alert>
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

export default WipReportPopup;