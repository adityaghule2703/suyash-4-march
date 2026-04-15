import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Chip
} from "@mui/material";
import {
  Close,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// 🎨 SAME DESIGN SYSTEM
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
    light: "#F8FFFC"
  },
  border: "#E3E8EF"
};

const labelStyle = {
  fontSize: "0.65rem",
  fontWeight: 600,
  color: COLORS.text.secondary,
  letterSpacing: "0.5px",
  mb: 0.5
};

const valueStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: COLORS.text.primary
};

const CancelMRV = ({ open, onClose, mrvData, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cancelResult, setCancelResult] = useState(null);
  const [reason, setReason] = useState("");

  const handleCancel = async () => {
    if (!mrvData || !mrvData._id) {
      setError("Invalid MRV data");
      return;
    }

    // Check if MRV is in Draft status
    if (mrvData.status !== "Draft") {
      setError(`Cannot cancel MRV in "${mrvData.status}" status. Only Draft MRVs can be cancelled.`);
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${BASE_URL}/api/mrv/${mrvData._id}/cancel`,
        { reason: reason.trim() },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        setSuccess(true);
        setCancelResult(response.data);
        
        if (onCancel) {
          onCancel(response.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || "Failed to cancel MRV");
      }
    } catch (err) {
      console.error("Error cancelling MRV:", err);
      
      if (err.response) {
        const status = err.response.status;
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to cancel MRV";
        
        if (status === 400) {
          setError(`Cannot cancel: ${errorMsg}`);
        } else if (status === 404) {
          setError("MRV not found. It may have been already deleted.");
        } else if (status === 403) {
          setError("You don't have permission to cancel this MRV.");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while cancelling the MRV");
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
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPersonName = (person) => {
    if (!person) return '-';
    if (typeof person === 'object') {
      if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
      if (person.FirstName) return person.FirstName;
      if (person.Username) return person.Username;
      if (person.Email) return person.Email;
      if (person.name) return person.name;
      return person._id?.slice(-6) || '-';
    }
    return person;
  };

  const getConditionChip = (condition) => {
    const conditionConfig = {
      Good: { color: '#059669', bg: '#D1FAE5' },
      Damaged: { color: '#DC2626', bg: '#FEE2E2' },
      Scrap: { color: '#D97706', bg: '#FEF3C7' }
    };
    const config = conditionConfig[condition] || conditionConfig.Good;
    return (
      <Chip 
        label={condition || '-'} 
        size="small" 
        sx={{ 
          fontSize: '0.65rem', 
          height: 22, 
          bgcolor: config.bg, 
          color: config.color, 
          fontWeight: 500 
        }} 
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={!loading && !success ? onClose : undefined}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden"
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 1.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CancelIcon sx={{ color: '#EF4444', fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Cancel Material Return Voucher
          </Typography>
        </Stack>
        {!loading && !success && (
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
          </IconButton>
        )}
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success ? (
          <Box>
            <Alert 
              severity="success" 
              icon={<CheckCircleIcon />}
              sx={{ 
                borderRadius: 1.5,
                mb: 3,
                '& .MuiAlert-message': {
                  fontSize: '0.75rem'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                MRV Cancelled Successfully!
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                The Material Return Voucher has been cancelled.
              </Typography>
            </Alert>

            {cancelResult && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, letterSpacing: '0.5px' }}>
                  CANCELLATION SUMMARY
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography sx={labelStyle}>STATUS</Typography>
                      <Typography sx={{ ...valueStyle, color: '#DC2626', fontWeight: 600 }}>
                        {cancelResult.status || 'Cancelled'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>CANCELLED AT</Typography>
                      <Typography sx={valueStyle}>
                        {formatDate(cancelResult.cancelled_at || cancelResult.canceled_at)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>CANCELLED BY</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                        <Typography sx={valueStyle}>
                          {cancelResult.canceled_by || cancelResult.cancelled_by || 'User'}
                        </Typography>
                      </Stack>
                    </Box>
                    
                    {reason && (
                      <Box sx={{ gridColumn: 'span 2' }}>
                        <Typography sx={labelStyle}>REASON FOR CANCELLATION</Typography>
                        <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {reason}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>
        ) : (
          <>
            {/* Warning Alert */}
            <Alert 
              severity="warning" 
              icon={<WarningIcon />}
              sx={{ 
                borderRadius: 1.5,
                mb: 3,
                '& .MuiAlert-message': {
                  fontSize: '0.75rem'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Are you sure you want to cancel this Material Return Voucher?
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                This action will:
              </Typography>
              <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
                <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                  Change MRV status from Draft to Cancelled
                </Typography>
                <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                  No stock will be updated
                </Typography>
                <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                  Cannot be undone
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mt: 1 }}>
                Only Draft MRVs can be cancelled.
              </Typography>
            </Alert>

            {error && (
              <Alert 
                severity="error" 
                sx={{ borderRadius: 1.5, mb: 2 }} 
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* MRV Details */}
            {mrvData && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, letterSpacing: '0.5px' }}>
                  MRV DETAILS
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography sx={labelStyle}>MRV NUMBER</Typography>
                      <Typography sx={valueStyle}>
                        {mrvData.mrv_number || mrvData._id?.slice(-8) || "-"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>MIV NUMBER</Typography>
                      <Typography sx={valueStyle}>
                        {mrvData.miv_id?.miv_number || mrvData.miv_number || "-"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>WORK ORDER</Typography>
                      <Typography sx={valueStyle}>
                        {mrvData.wo_id?.wo_number || mrvData.wo_number || "-"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>CONDITION</Typography>
                      {getConditionChip(mrvData.condition)}
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>RETURNED BY</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                        <Typography sx={valueStyle}>
                          {getPersonName(mrvData.returned_by)}
                        </Typography>
                      </Stack>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>TOTAL RETURN VALUE</Typography>
                      <Typography sx={{ ...valueStyle, fontWeight: 700, color: '#059669' }}>
                        {formatCurrency(mrvData.total_return_value)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Items Summary */}
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      ITEMS TO BE CANCELLED
                    </Typography>
                    
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: COLORS.background.light }}>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Item</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Returned Qty</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Unit</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Total Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(mrvData.items || []).map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontSize: '0.65rem' }}>
                                {item.item_description || item.part_no || "-"}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }}>
                                {item.part_no || "-"}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }} align="right">
                                <Typography sx={{ fontWeight: 600, color: COLORS.primary }}>
                                  {item.returned_qty || 0}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }}>
                                {item.unit || "-"}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }} align="right">
                                {formatCurrency(item.total_value || 0)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Reason for Cancellation Input */}
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={labelStyle}>
                      REASON FOR CANCELLATION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Please provide a reason for cancelling this MRV..."
                      error={!!error && error.includes("reason")}
                      helperText={error && error.includes("reason") ? error : ""}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {/* ACTIONS */}
      {!success && (
        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          gap: 1
        }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Keep MRV
          </Button>

          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={loading || (mrvData && mrvData.status !== "Draft") || !reason.trim()}
            startIcon={!loading && <CancelIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: '#EF4444',
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#DC2626' },
              '&:disabled': {
                bgcolor: COLORS.border,
                color: COLORS.text.tertiary
              }
            }}
          >
            {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Cancel MRV"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CancelMRV;