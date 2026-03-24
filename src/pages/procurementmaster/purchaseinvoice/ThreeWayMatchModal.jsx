import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Close as CloseIcon,
  CompareArrows as CompareArrowsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
  border: '#E3E8EF'
};

const ThreeWayMatchModal = ({ open, onClose, invoice, onMatchComplete }) => {
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && invoice) {
      performMatch();
    }
  }, [open, invoice]);

  const performMatch = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/purchase-invoices/${invoice._id}/three-way-match`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMatchResult(response.data.data);
        onMatchComplete();
      } else {
        setError(response.data.message || 'Failed to perform 3-way match');
      }
    } catch (err) {
      console.error('Error performing 3-way match:', err);
      setError(err.response?.data?.message || 'Failed to perform 3-way match');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  const getMatchStatusColor = (status) => {
    switch(status) {
      case 'Matched': return COLORS.success;
      case 'Exception': return COLORS.warning;
      default: return COLORS.text.tertiary;
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden', maxHeight: '90vh' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CompareArrowsIcon sx={{ color: COLORS.info, fontSize: 20 }} />
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>3-Way Match Results</Typography>
        <Chip label={`Invoice: ${invoice.purchase_invoice_number}`} size="small" sx={{ ml: 'auto' }} />
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.875rem' }}>Performing 3-way match...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
        ) : matchResult ? (
          <Stack spacing={2}>
            {/* Summary */}
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.8rem' }}>Match Summary</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Total Items</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>{matchResult.summary?.total_items}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Matched Items</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.success }}>{matchResult.summary?.matched_items}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Exception Items</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.warning }}>{matchResult.summary?.exception_items}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Match Results Table */}
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.8rem' }}>Item-wise Comparison</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">PO Price</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">PO Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">GRN Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Expected Amount</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Invoice Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Invoice Price</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Invoice Amount</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Difference</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {matchResult.matches?.map((match, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{match.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(match.po_price)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{match.po_ordered_qty}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{match.grn_accepted_qty}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(match.expected_amount)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{match.invoice_qty}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(match.invoice_price)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(match.invoice_amount)}</TableCell>
                        <TableCell 
                          sx={{ 
                            fontSize: '0.75rem', 
                            textAlign: 'right',
                            color: Math.abs(match.difference) > 0 ? COLORS.error : COLORS.success 
                          }}
                        >
                          {formatCurrency(Math.abs(match.difference))} ({match.difference_percent}%)
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={match.match_status} 
                            size="small" 
                            sx={{ 
                              fontSize: '0.65rem', 
                              height: 20,
                              bgcolor: match.match_status === 'Matched' ? '#D1FAE5' : '#FEF3C7',
                              color: match.match_status === 'Matched' ? '#065F46' : '#92400E'
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, gap: 1 }}>
        <Button onClick={onClose} startIcon={<CloseIcon />} sx={{ height: 32, px: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThreeWayMatchModal;