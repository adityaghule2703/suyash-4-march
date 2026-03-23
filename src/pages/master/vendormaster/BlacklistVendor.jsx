import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Stack,
  Chip,
  TextField,
  FormControl,
  FormHelperText
} from '@mui/material';
import { 
  Block as BlockIcon, 
  Warning as WarningIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  error: '#D32F2F',
  errorDark: '#C62828',
  warning: '#F59E0B',
  warningDark: '#D97706',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  border: '#E3E8EF',
  background: '#F8FAFC',
  warningBg: '#FEF3C7',
  warningBorder: '#FDE68A'
};

const BlacklistVendor = ({ open, onClose, vendor, onBlacklist }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const handleBlacklist = async () => {
    if (!vendor?._id) {
      setError('Vendor information is missing');
      return;
    }

    if (!reason.trim()) {
      setReasonError('Please provide a reason for blacklisting');
      return;
    }

    if (reason.trim().length < 10) {
      setReasonError('Please provide a detailed reason (minimum 10 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/vendors/${vendor._id}/blacklist`,
        {
          blacklist_reason: reason.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onBlacklist(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to blacklist vendor');
      }
    } catch (err) {
      console.error('Error blacklisting vendor:', err);
      setError(err.response?.data?.message || 'Failed to blacklist vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReason(value);
    setReasonError('');
    
    if (value.trim() && value.trim().length < 10) {
      setReasonError('Please provide a detailed reason (minimum 10 characters)');
    }
  };

  // Format vendor code and name for display
  const getVendorDisplayName = () => {
    if (!vendor) return '';
    return vendor.vendor_name || vendor.VendorName || 'this vendor';
  };

  const getVendorCode = () => {
    if (!vendor) return '';
    return vendor.vendor_code || vendor.VendorCode || '';
  };

  const getVendorId = () => {
    if (!vendor) return '';
    return vendor._id || vendor.id || '';
  };

  const getVendorType = () => {
    if (!vendor) return '';
    return vendor.vendor_type || '';
  };

  if (!vendor) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`, 
        pb: 2,
        backgroundColor: COLORS.background,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <BlockIcon sx={{ color: COLORS.warning, fontSize: 24 }} />
        <Typography 
          sx={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            color: COLORS.text.primary
          }}
        >
          Blacklist Vendor
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Stack spacing={2.5}>

          {/* Vendor Details Box */}
          <Box sx={{ 
            p: 2, 
            bgcolor: COLORS.background, 
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`
          }}>
            <Typography sx={{ 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              color: COLORS.text.tertiary, 
              mb: 1.5,
              letterSpacing: '0.5px'
            }}>
              VENDOR INFORMATION
            </Typography>
            
            <Stack spacing={1.5}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                  VENDOR NAME
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {getVendorDisplayName()}
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                  VENDOR CODE
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {getVendorCode() || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                  VENDOR TYPE
                </Typography>
                <Chip
                  label={getVendorType()}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 22,
                    bgcolor: COLORS.background,
                    color: COLORS.primary,
                    border: `1px solid ${COLORS.border}`
                  }}
                />
              </Box>

              {getVendorId() && (
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                    VENDOR ID
                  </Typography>
                  <Chip
                    label={getVendorId().slice(-6)}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 22,
                      bgcolor: '#E8F0F1',
                      color: COLORS.primary,
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Box>

          {/* Blacklist Reason Input */}
          <Box sx={{ 
            p: 2, 
            bgcolor: COLORS.background, 
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`
          }}>
            <Typography sx={{ 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              color: COLORS.text.tertiary, 
              mb: 1.5,
              letterSpacing: '0.5px'
            }}>
              BLACKLIST REASON <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              placeholder="Please provide detailed reason for blacklisting this vendor..."
              value={reason}
              onChange={handleReasonChange}
              disabled={loading}
              error={!!reasonError}
              helperText={reasonError || 'Minimum 10 characters required'}
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
              <WarningIcon sx={{ fontSize: '0.7rem' }} />
              Example: Repeated quality issues, payment delays, non-compliance with terms
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                },
                fontSize: '0.75rem'
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        pt: 2,
        borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.background,
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          startIcon={<CancelIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.75rem',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
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
          onClick={handleBlacklist}
          disabled={loading || !reason.trim() || reason.trim().length < 10}
          startIcon={loading ? null : <BlockIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.75rem',
            backgroundColor: COLORS.warning,
            '&:hover': {
              backgroundColor: COLORS.warningDark
            },
            '&:disabled': {
              backgroundColor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Blacklisting...' : 'Blacklist Vendor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlacklistVendor;