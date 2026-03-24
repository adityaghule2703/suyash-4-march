import React, { useState } from 'react';
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
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Close as CloseIcon,
  Approval as ApprovalIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  success: '#10B981',
  warning: '#F59E0B',
  text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
  border: '#E3E8EF'
};

const ApproveInvoiceModal = ({ open, onClose, invoice, onApproveComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/purchase-invoices/${invoice._id}/approve`,
        { approval_remarks: approvalRemarks || 'Approved' },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        onApproveComplete();
        onClose();
      } else {
        setError(response.data.message || 'Failed to approve invoice');
      }
    } catch (err) {
      console.error('Error approving invoice:', err);
      setError(err.response?.data?.message || 'Failed to approve invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ApprovalIcon sx={{ color: COLORS.success, fontSize: 20 }} />
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>Approve Purchase Invoice</Typography>
        <Chip label={`Invoice: ${invoice.purchase_invoice_number}`} size="small" sx={{ ml: 'auto' }} />
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, bgcolor: '#F8FAFC' }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Vendor Invoice No</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{invoice.vendor_invoice_no}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Grand Total</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>{formatCurrency(invoice.grand_total)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Matching Status</Typography>
                <Chip label={invoice.matching_status} size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: invoice.matching_status === 'Matched' ? '#D1FAE5' : '#FEF3C7' }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>ITC Amount</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatCurrency(invoice.itc_amount || 0)}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Approval Remarks"
            placeholder="Enter approval remarks..."
            value={approvalRemarks}
            onChange={(e) => setApprovalRemarks(e.target.value)}
          />

          {error && <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleApprove} disabled={loading} startIcon={loading ? null : <CheckCircleIcon />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.success, fontSize: '0.75rem' }}>
          {loading ? 'Approving...' : 'Approve Invoice'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveInvoiceModal;