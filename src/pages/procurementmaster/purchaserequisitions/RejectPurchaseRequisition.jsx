import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import { 
  Cancel as CancelIcon,
  Close as CloseIcon
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
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B'
};

const RejectPurchaseRequisition = ({ open, onClose, pr, onReject }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const handleSubmit = async () => {
    if (!pr?._id) {
      setError('Purchase requisition information is missing');
      return;
    }

    if (!rejectionReason.trim()) {
      setReasonError('Rejection reason is required');
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setReasonError('Please provide a detailed reason (minimum 10 characters)');
      return;
    }

    setLoading(true);
    setError('');
    setReasonError('');

    try {
      const token = localStorage.getItem('token');
      
      const submissionData = {
        rejection_reason: rejectionReason.trim()
      };

      const response = await axios.put(
        `${BASE_URL}/api/purchase-requisitions/${pr._id}/reject`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onReject(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to reject purchase requisition');
      }
    } catch (err) {
      console.error('Error rejecting PR:', err);
      setError(err.response?.data?.message || 'Failed to reject purchase requisition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalValue = pr?.items?.reduce((sum, item) => sum + (item.estimated_price * item.required_qty), 0) || 0;

  if (!pr) return null;

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
          <CancelIcon sx={{ color: COLORS.error, fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Reject Purchase Requisition
          </Typography>
        </Stack>
        <Chip 
          label={`PR: ${pr.pr_number}`} 
          size="small" 
          sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem' }} 
        />
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, backgroundColor: COLORS.background.light }}>
        <Stack spacing={2}>
          {/* PR Information Card */}
          <Paper sx={{ 
            p: 2, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.background.white,
            boxShadow: 'none'
          }}>
            <Typography variant="subtitle2" sx={{ 
              color: COLORS.primary, 
              mb: 1.5, 
              fontWeight: 600, 
              fontSize: '0.8rem' 
            }}>
              Requisition Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    PR NUMBER
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {pr.pr_number}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    PR TYPE
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {pr.pr_type}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    DEPARTMENT
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {pr.department}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    TOTAL VALUE
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error }}>
                    ₹{totalValue.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    ITEMS
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {pr.items?.map((item, idx) => (
                      <Chip
                        key={idx}
                        label={`${item.part_no} - ${item.required_qty} ${item.unit}`}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 22,
                          bgcolor: COLORS.primaryLight,
                          color: COLORS.primary
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Rejection Reason Card */}
          <Paper sx={{ 
            p: 2, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.background.white,
            boxShadow: 'none'
          }}>
            <Typography variant="subtitle2" sx={{ 
              color: COLORS.primary, 
              mb: 1.5, 
              fontWeight: 600, 
              fontSize: '0.8rem' 
            }}>
              Rejection Reason <span style={{ color: COLORS.error }}>*</span>
            </Typography>
            
            <Typography variant="caption" sx={{ 
              color: COLORS.text.tertiary, 
              display: 'block', 
              mb: 1.5,
              fontSize: '0.7rem'
            }}>
              Please provide a detailed reason for rejecting this requisition
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (e.target.value.trim().length >= 10) {
                  setReasonError('');
                }
              }}
              error={!!reasonError}
              helperText={reasonError || 'Minimum 10 characters required'}
              disabled={loading}
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
                  fontSize: '0.75rem',
                  color: COLORS.text.primary
                },
                '& .MuiFormHelperText-root': {
                  fontSize: '0.65rem',
                  marginLeft: 0,
                  marginTop: 0.25
                }
              }}
            />
            
            <Typography sx={{ 
              fontSize: '0.65rem', 
              color: COLORS.text.tertiary, 
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              Example: Budget constraints, duplicate requisition, incorrect specifications, etc.
            </Typography>
          </Paper>

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
          disabled={loading || !rejectionReason.trim() || rejectionReason.trim().length < 10}
          startIcon={loading ? null : <CancelIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.error,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: '#DC2626'
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Rejecting...' : 'Reject Requisition'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectPurchaseRequisition;