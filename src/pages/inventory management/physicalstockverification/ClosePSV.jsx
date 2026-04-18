import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  TextField
} from "@mui/material";
import {
  Close as CloseIcon,
  Lock as LockIcon,
  Inventory as InventoryIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Verified as VerifiedIcon,
  WarningAmber as WarningIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// 🎨 Minimal Design System
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  primaryLight: "#E8F0F1",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8",
    light: "#FFFFFF"
  },
  background: {
    white: "#FFFFFF",
    light: "#F8FAFC",
    warning: "#FFFBEB",
    error: "#FEF2F2",
    success: "#F0FDF4"
  },
  border: "#E2E8F0"
};

const labelStyle = {
  fontSize: "0.65rem",
  fontWeight: 600,
  color: COLORS.text.secondary,
  letterSpacing: "0.5px",
  mb: 0.5,
  textTransform: "uppercase"
};

const valueStyle = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: COLORS.text.primary
};

const ClosePSV = ({ open, onClose, data, onCloseComplete }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [psvData, setPsvData] = useState(null);
  const [closeResult, setCloseResult] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (open && data) {
      fetchPSVDetails();
    }
  }, [open, data]);

  const fetchPSVDetails = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/physical-verifications/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPsvData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching PSV details:', err);
      setError('Failed to load PSV details');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!psvData || !psvData._id) {
      setError("Invalid PSV data");
      return;
    }
    
    if (confirmationText.toLowerCase() !== 'close') {
      setError('Please type "close" to confirm closing this verification');
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        remarks: remarks || ""
      };
      
      const response = await axios.post(`${BASE_URL}/api/physical-verifications/${psvData._id}/close`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        setCloseResult(response.data.data);
        if (onCloseComplete) {
          onCloseComplete(response.data.data);
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to close PSV');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to close PSV';
        
        if (err.response.status === 400) {
          setError(`Validation error: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("PSV not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to close this PSV");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'An error occurred while closing PSV');
      }
    } finally { 
      setLoading(false); 
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Initiated': { bg: '#FEF3C7', color: '#D97706', label: 'Initiated' },
      'In Progress': { bg: '#E0F2FE', color: '#0284C7', label: 'In Progress' },
      'Count Completed': { bg: '#DBEAFE', color: '#2563EB', label: 'Count Completed' },
      'Under Review': { bg: '#F3E8FF', color: '#9333EA', label: 'Under Review' },
      'Adjusted': { bg: '#D1FAE5', color: '#059669', label: 'Adjusted' },
      'Approved': { bg: '#D1FAE5', color: '#059669', label: 'Approved' },
      'Closed': { bg: '#F1F5F9', color: '#475569', label: 'Closed' }
    };
    return configs[status] || configs.Initiated;
  };

  if (!data) return null;

  const canClose = psvData?.status === 'Approved' || psvData?.status === 'Adjusted';
  const statusConfig = psvData ? getStatusConfig(psvData.status) : null;

  return (
    <Dialog
      open={open}
      onClose={!loading && !closeResult ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden"
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LockIcon sx={{ color: COLORS.primary, fontSize: '1.25rem' }} />
          <Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: COLORS.text.primary }}>
              Close Verification
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: COLORS.text.tertiary }}>
              {psvData?.verification_id || 'PSV'}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3, bgcolor: COLORS.background.light }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: COLORS.primary }} />
          </Box>
        ) : closeResult ? (
          // Success View
          <Stack spacing={3} alignItems="center">
            <VerifiedIcon sx={{ fontSize: 64, color: '#059669' }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, textAlign: 'center' }}>
              Verification Closed Successfully
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, textAlign: 'center' }}>
              The physical verification has been closed and is now read-only.
            </Typography>
            <Paper sx={{ width: '100%', p: 2, bgcolor: COLORS.background.white, borderRadius: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={labelStyle}>Closed At</Typography>
                  <Typography sx={valueStyle}>{formatDate(closeResult.closed_at)}</Typography>
                </Box>
                {closeResult.remarks && (
                  <Box>
                    <Typography sx={labelStyle}>Remarks</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                      {closeResult.remarks}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Stack>
        ) : (
          <Stack spacing={3}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {/* Cannot Close Warning */}
            {!canClose && psvData && (
              <Alert severity="warning" icon={<WarningIcon />} sx={{ borderRadius: 2 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  This verification is in <strong>"{psvData.status}"</strong> status. 
                  Only verifications in <strong>Approved</strong> or <strong>Adjusted</strong> status can be closed.
                </Typography>
              </Alert>
            )}

            {/* PSV Info Card */}
            {psvData && (
              <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  Verification Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography sx={labelStyle}>Status</Typography>
                      {statusConfig && (
                        <Chip 
                          label={statusConfig.label} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: 24, 
                            bgcolor: statusConfig.bg, 
                            color: statusConfig.color,
                            fontWeight: 500
                          }} 
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelStyle}>Total Items</Typography>
                    <Typography sx={valueStyle}>{psvData.total_items_counted || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelStyle}>Items with Variance</Typography>
                    <Typography sx={valueStyle}>{psvData.items_with_variance || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelStyle}>Total Variance</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.primary }}>
                      {formatCurrency(psvData.total_variance_value)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelStyle}>Net Variance</Typography>
                    <Typography sx={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      color: psvData.net_variance_value > 0 ? '#D97706' : psvData.net_variance_value < 0 ? '#DC2626' : '#059669'
                    }}>
                      {formatCurrency(psvData.net_variance_value)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Remarks Input */}
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 2 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1.5 }}>
                Closing Remarks (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any final notes or summary of the verification..."
                disabled={!canClose || loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '& textarea': { fontSize: '0.75rem' }
                  }
                }}
              />
            </Paper>

            {/* Confirmation Section */}
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.warning, borderRadius: 2 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon sx={{ fontSize: '1rem', color: '#D97706' }} />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#D97706' }}>
                    Confirmation Required
                  </Typography>
                </Box>
                
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  This action will mark the verification as complete and make it read-only. 
                  No further changes can be made. This cannot be undone.
                </Typography>
                
                <Divider />
                
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Type <strong style={{ color: COLORS.primary }}>"close"</strong> to confirm:
                </Typography>
                
                <TextField
                  fullWidth
                  size="small"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder='Type "close" to confirm'
                  disabled={!canClose || loading}
                  error={confirmationText !== '' && confirmationText.toLowerCase() !== 'close'}
                  helperText={confirmationText !== '' && confirmationText.toLowerCase() !== 'close' ? 'Must type "close" exactly' : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: COLORS.background.white,
                      '& input': { fontSize: '0.75rem', py: 1.25 }
                    }
                  }}
                />
              </Stack>
            </Paper>
          </Stack>
        )}
      </DialogContent>

      {/* Actions */}
      {!closeResult && (
        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          gap: 1.5
        }}>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            sx={{
              height: 36,
              px: 2.5,
              borderRadius: 1.5,
              borderColor: COLORS.border,
              color: COLORS.text.secondary,
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { borderColor: COLORS.text.tertiary }
            }}
          >
            Cancel
          </Button>

          {canClose && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || confirmationText.toLowerCase() !== 'close'}
              startIcon={!loading && <LockIcon sx={{ fontSize: "1rem" }} />}
              sx={{
                height: 36,
                px: 2.5,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : "Close Verification"}
            </Button>
          )}
        </DialogActions>
      )}

      {closeResult && (
        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white
        }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              height: 36,
              px: 3,
              borderRadius: 1.5,
              bgcolor: COLORS.primary,
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: COLORS.primaryDark }
            }}
          >
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ClosePSV;