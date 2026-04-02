// ApproveVendorPayment.jsx - Optimized
import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
  },
  border: '#E3E8EF',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
};

const ApproveVendorPayment = React.memo(({ open, onClose, payment, onApprove }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');

  // Memoized formatters
  const formatCurrency = useCallback((amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Memoized values
  const isHighAmount = useMemo(() => payment?.amount > 50000, [payment]);
  const hasAllocations = useMemo(() => payment?.allocations?.length > 0, [payment]);
  const hasBankAccount = useMemo(() => payment?.from_bank_account?.bank_name, [payment]);
  const hasRemarks = useMemo(() => payment?.remarks, [payment]);

  const handleSubmit = useCallback(async () => {
    if (!payment?._id) {
      setError('Payment information is missing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${BASE_URL}/api/vendor-payments/${payment._id}/approve`,
        { approval_remarks: approvalRemarks },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onApprove?.(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to approve payment');
      }
    } catch (err) {
      console.error('Error approving payment:', err);
      setError(err.response?.data?.message || 'Failed to approve payment. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [payment, approvalRemarks, onApprove, onClose]);

  const handleRemarksChange = useCallback((e) => {
    setApprovalRemarks(e.target.value);
  }, []);

  if (!payment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Approve Vendor Payment
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, backgroundColor: COLORS.background.white }}>
        <Stack spacing={2}>
          {/* Payment Information Card */}
          <Paper sx={{ 
            p: 2, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white,
          }}>
            <Typography variant="subtitle2" sx={{ 
              color: COLORS.primary, 
              mb: 1.5, 
              fontWeight: 600, 
              fontSize: '0.8rem' 
            }}>
              Payment Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    PAYMENT NUMBER
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {payment.vendor_payment_number}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    PAYMENT DATE
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatDate(payment.payment_date)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    VENDOR
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {payment.vendor_name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    GST: {payment.vendor_gstin || 'N/A'} | PAN: {payment.vendor_pan || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    PAYMENT MODE
                  </Typography>
                  <Chip
                    label={payment.payment_mode}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      height: 22,
                      width: 'fit-content',
                      bgcolor: COLORS.primaryLight,
                      color: COLORS.primary,
                    }}
                  />
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    Ref: {payment.reference_no}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Amount Breakdown Card */}
          <Paper sx={{ 
            p: 2, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white,
          }}>
            <Typography variant="subtitle2" sx={{ 
              color: COLORS.primary, 
              mb: 1.5, 
              fontWeight: 600, 
              fontSize: '0.8rem' 
            }}>
              Amount Breakdown
            </Typography>
            
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: COLORS.text.secondary, fontSize: '0.75rem' }}>
                  Total Amount:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                  {formatCurrency(payment.amount)}
                </Typography>
              </Stack>
              
              {payment.tds_applicable && payment.tds_amount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: COLORS.text.secondary, fontSize: '0.75rem' }}>
                    TDS ({payment.tds_section} @ {payment.tds_rate}%):
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.warning, fontWeight: 500, fontSize: '0.75rem' }}>
                    -{formatCurrency(payment.tds_amount)}
                  </Typography>
                </Stack>
              )}
              
              <Divider sx={{ borderColor: COLORS.border }} />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Net Amount to Pay:
                </Typography>
                <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 700, fontSize: '1rem' }}>
                  {formatCurrency(payment.net_paid)}
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Invoices Being Paid Card */}
          {hasAllocations && (
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white,
            }}>
              <Typography variant="subtitle2" sx={{ 
                color: COLORS.primary, 
                mb: 1.5, 
                fontWeight: 600, 
                fontSize: '0.8rem' 
              }}>
                Invoices Being Paid
              </Typography>
              
              <Stack spacing={1}>
                {payment.allocations.map((alloc, index) => (
                  <Box key={index} sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {alloc.invoice_number}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Date: {formatDate(alloc.invoice_date)}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {formatCurrency(alloc.allocated_amount)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          of {formatCurrency(alloc.invoice_amount)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Bank Account Card */}
          {hasBankAccount && (
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white,
            }}>
              <Typography variant="subtitle2" sx={{ 
                color: COLORS.primary, 
                mb: 1.5, 
                fontWeight: 600, 
                fontSize: '0.8rem' 
              }}>
                Bank Account
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
                  <AccountBalanceIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {payment.from_bank_account.bank_name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    A/C: {payment.from_bank_account.account_no} | IFSC: {payment.from_bank_account.ifsc}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          {/* Remarks Card */}
          {hasRemarks && (
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white,
            }}>
              <Typography variant="subtitle2" sx={{ 
                color: COLORS.primary, 
                mb: 1, 
                fontWeight: 600, 
                fontSize: '0.8rem' 
              }}>
                Remarks
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                {payment.remarks}
              </Typography>
            </Paper>
          )}

          {/* Approval Remarks Input */}
          <Paper sx={{ 
            p: 2, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white,
          }}>
            <Typography variant="subtitle2" sx={{ 
              color: COLORS.primary, 
              mb: 1.5, 
              fontWeight: 600, 
              fontSize: '0.8rem' 
            }}>
              Approval Remarks
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Enter approval remarks (optional)"
              value={approvalRemarks}
              onChange={handleRemarksChange}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                }
              }}
            />
          </Paper>

          {/* Warning for High Amount */}
          {isHighAmount && (
            <Alert 
              severity="warning" 
              icon={<WarningIcon />}
              sx={{ 
                borderRadius: 1.5, 
                fontSize: '0.75rem',
                bgcolor: COLORS.warningLight,
                '& .MuiAlert-icon': { color: COLORS.warning }
              }}
            >
              This is a high-value payment exceeding ₹50,000. Please verify all details before approval.
            </Alert>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
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
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? null : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.success,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#059669',
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Approving...' : 'Approve Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ApproveVendorPayment.displayName = 'ApproveVendorPayment';

export default ApproveVendorPayment;