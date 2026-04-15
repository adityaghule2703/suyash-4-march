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
  FormControlLabel,
  Switch,
  Chip,
  Tooltip
} from "@mui/material";
import {
  Close,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon
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

const DeleteMRV = ({ open, onClose, mrvData, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);
  const [forceDelete, setForceDelete] = useState(false);

  const handleDelete = async () => {
    if (!mrvData || !mrvData._id) {
      setError("Invalid MRV data");
      return;
    }

    // Check if MRV is posted and force_delete is not enabled
    if (mrvData.status === "Posted" && !forceDelete) {
      setError("This MRV is already posted. Enable 'Force Delete' to reverse stock transactions and delete.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.delete(
        `${BASE_URL}/api/mrv/${mrvData._id}?force_delete=${forceDelete}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setDeleteResult(response.data.data);
        
        if (onDelete) {
          onDelete(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || "Failed to delete MRV");
      }
    } catch (err) {
      console.error("Error deleting MRV:", err);
      
      if (err.response) {
        const status = err.response.status;
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to delete MRV";
        
        if (status === 400) {
          setError(`Cannot delete: ${errorMsg}`);
        } else if (status === 404) {
          setError("MRV not found. It may have been already deleted.");
        } else if (status === 403) {
          setError("You don't have permission to delete this MRV.");
        } else if (status === 409) {
          setError(`Conflict: ${errorMsg}. Please enable force delete if you want to delete a posted MRV.`);
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while deleting the MRV");
      }
    } finally {
      setLoading(false);
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

  const getStatusChip = (status) => {
    const statusConfig = {
      Draft: { color: '#D97706', bg: '#FEF3C7', label: 'Draft' },
      Posted: { color: '#059669', bg: '#D1FAE5', label: 'Posted' },
      Cancelled: { color: '#DC2626', bg: '#FEE2E2', label: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.Draft;
    return (
      <Chip 
        label={config.label} 
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
          <DeleteIcon sx={{ color: '#EF4444', fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Delete Material Return Voucher
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
                MRV Deleted Successfully!
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                The Material Return Voucher has been deleted.
              </Typography>
            </Alert>

            {deleteResult && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, letterSpacing: '0.5px' }}>
                  DELETION SUMMARY
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography sx={labelStyle}>MRV NUMBER</Typography>
                      <Typography sx={valueStyle}>
                        {deleteResult.mrv_number || deleteResult.mrV_number || '-'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>ORIGINAL STATUS</Typography>
                      <Typography sx={{ ...valueStyle, fontWeight: 600 }}>
                        {deleteResult.original_status || '-'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>WAS POSTED</Typography>
                      <Typography sx={valueStyle}>
                        {deleteResult.was_posted ? 'Yes' : 'No'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>STOCK REVERSED</Typography>
                      <Typography sx={{ ...valueStyle, color: deleteResult.stock_reversed ? '#059669' : '#DC2626' }}>
                        {deleteResult.stock_reversed ? 'Yes' : 'No'}
                      </Typography>
                    </Box>
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
                Are you sure you want to delete this Material Return Voucher?
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                This action will:
              </Typography>
              <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
                {mrvData?.status === "Posted" ? (
                  <>
                    <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                      Reverse all stock transactions (if force delete is enabled)
                    </Typography>
                    <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                      Remove all stock ledger entries
                    </Typography>
                    <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                      Permanently delete the MRV record
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                      Permanently delete the MRV record
                    </Typography>
                    <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                      No stock will be affected (Draft MRV)
                    </Typography>
                  </>
                )}
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mt: 1 }}>
                This action cannot be undone.
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

            {/* Force Delete Option for Posted MRVs */}
            {mrvData?.status === "Posted" && (
              <Alert 
                severity="info" 
                icon={<InfoIcon />}
                sx={{ 
                  borderRadius: 1.5, 
                  mb: 2,
                  '& .MuiAlert-message': {
                    fontSize: '0.75rem'
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Posted MRV Detected
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  This MRV has already been posted. To delete it, you must enable "Force Delete" which will reverse all stock transactions.
                </Typography>
              </Alert>
            )}

            {/* Force Delete Switch - Only show for posted MRVs */}
            {mrvData?.status === "Posted" && (
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={forceDelete}
                      onChange={(e) => setForceDelete(e.target.checked)}
                      disabled={loading}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#EF4444',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#EF4444',
                        },
                      }}
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Force Delete
                      </Typography>
                      <Tooltip title="Enable this to delete a posted MRV and reverse all stock transactions">
                        <InfoIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                      </Tooltip>
                    </Stack>
                  }
                />
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5, ml: 4 }}>
                  Warning: This will reverse all stock transactions and cannot be undone
                </Typography>
              </Box>
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
                      <Typography sx={labelStyle}>STATUS</Typography>
                      {getStatusChip(mrvData.status)}
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
                      <Typography sx={labelStyle}>TOTAL RETURN VALUE</Typography>
                      <Typography sx={{ ...valueStyle, fontWeight: 700, color: '#059669' }}>
                        {formatCurrency(mrvData.total_return_value)}
                      </Typography>
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
                      <Typography sx={labelStyle}>CREATED AT</Typography>
                      <Typography sx={valueStyle}>
                        {formatDate(mrvData.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Items Summary */}
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      ITEMS TO BE DELETED
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

                  {/* Remarks */}
                  {mrvData.remarks && (
                    <Box>
                      <Typography sx={labelStyle}>REMARKS</Typography>
                      <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                          {mrvData.remarks}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
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
            onClick={handleDelete}
            disabled={loading || (mrvData?.status === "Posted" && !forceDelete)}
            startIcon={!loading && <DeleteIcon sx={{ fontSize: "1rem" }} />}
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
            {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Delete MRV"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DeleteMRV;