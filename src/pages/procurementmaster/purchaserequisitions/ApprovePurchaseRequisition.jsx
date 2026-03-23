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
  CheckCircle as CheckCircleIcon,
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
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B'
};

const ApprovePurchaseRequisition = ({ open, onClose, pr, onApprove }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');

  const handleSubmit = async () => {
    if (!pr?._id) {
      setError('Purchase requisition information is missing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const submissionData = {
        approval_notes: approvalNotes.trim()
      };

      const response = await axios.put(
        `${BASE_URL}/api/purchase-requisitions/${pr._id}/approve`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onApprove(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to approve purchase requisition');
      }
    } catch (err) {
      console.error('Error approving PR:', err);
      setError(err.response?.data?.message || 'Failed to approve purchase requisition. Please try again.');
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
          <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Approve Purchase Requisition
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
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success }}>
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

          {/* Approval Notes Card */}
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
              Approval Notes
            </Typography>
            
            <Typography variant="caption" sx={{ 
              color: COLORS.text.tertiary, 
              display: 'block', 
              mb: 1.5,
              fontSize: '0.7rem'
            }}>
              Add any notes or remarks for this approval (optional)
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Enter approval notes..."
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
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
                }
              }}
            />
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
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: '#059669'
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Approving...' : 'Approve Requisition'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApprovePurchaseRequisition;