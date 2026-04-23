// JobCosting.jsx
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
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  MonetizationOn as JobCostingIcon
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

const JobCostingPopup = ({ open, onClose, workOrder }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [costingData, setCostingData] = useState(null);

  useEffect(() => {
    if (open && workOrder) {
      fetchJobCosting();
    }
  }, [open, workOrder]);

  const fetchJobCosting = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/${workOrder._id}/job-costing`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCostingData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load job costing data');
      }
    } catch (err) {
      console.error('Error fetching job costing:', err);
      setError(err.response?.data?.message || 'Failed to load job costing data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <JobCostingIcon sx={{ color: '#059669' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Job Costing Details
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
        ) : costingData ? (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{costingData.wo_number}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part No:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{costingData.part_no}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Completed Qty:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{costingData.completed_qty}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Costing Date:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                      {new Date(costingData.costing_date).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primary, mt: 1 }}>
              Actual Costs
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mb: 0.5 }}>Raw Material Cost</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.actual_rm_cost)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mb: 0.5 }}>Process Cost</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.actual_process_cost)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mb: 0.5 }}>Overhead</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.actual_overhead)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Paper sx={{ p: 1.5, bgcolor: '#F0FDF4', borderRadius: 1.5, border: `1px solid #A7F3D0` }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Actual Total Cost</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>
                      {formatCurrency(costingData.actual_total_cost)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Estimated Total Cost</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.estimated_total_cost)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Unit Cost</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.actual_unit_cost)} / pc
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {(costingData.variance_amount !== 0 || costingData.variance_percent !== 0) && (
              <Paper sx={{ p: 1.5, bgcolor: costingData.variance_amount > 0 ? '#FEF3C7' : '#FEE2E2', borderRadius: 1.5 }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Variance Amount</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: costingData.variance_amount > 0 ? '#D97706' : '#DC2626' }}>
                        {formatCurrency(costingData.variance_amount)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Variance Percent</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: costingData.variance_percent > 0 ? '#D97706' : '#DC2626' }}>
                        {costingData.variance_percent > 0 ? '+' : ''}{costingData.variance_percent}%
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {costingData.selling_price_total > 0 && (
              <Paper sx={{ p: 1.5, bgcolor: costingData.gross_profit > 0 ? '#D1FAE5' : '#FEE2E2', borderRadius: 1.5 }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Selling Price</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{formatCurrency(costingData.selling_price_total)}</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Gross Profit</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: costingData.gross_profit > 0 ? '#059669' : '#DC2626' }}>
                        {formatCurrency(costingData.gross_profit)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Gross Margin</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: costingData.gross_margin_percent > 0 ? '#059669' : '#DC2626' }}>
                        {costingData.gross_margin_percent}%
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>No costing data available</Alert>
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

export default JobCostingPopup;