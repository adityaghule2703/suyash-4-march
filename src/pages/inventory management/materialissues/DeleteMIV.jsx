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
  Divider
} from "@mui/material";
import { 
  Close, 
  Cancel as CancelIcon, 
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
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
  fontSize: "0.7rem",
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

const DeleteMIV = ({ open, onClose, onDelete, mivData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    if (!mivData || !mivData._id) {
      setError("Invalid MIV data");
      return;
    }

    // Check if MIV is in Draft status
    if (mivData.status !== "Draft") {
      setError(`Cannot cancel MIV in "${mivData.status}" status. Only Draft MIVs can be cancelled.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${BASE_URL}/api/miv/${mivData._id}/cancel`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        if (onDelete) {
          onDelete(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || "Failed to cancel MIV");
      }
    } catch (err) {
      console.error("Error cancelling MIV:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to cancel MIV";
        
        if (err.response.status === 400) {
          setError(`Cannot cancel: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("MIV not found. It may have been already deleted.");
        } else if (err.response.status === 403) {
          setError("You don't have permission to cancel this MIV.");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while cancelling the MIV");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
            Cancel MIV
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Warning Alert */}
          <Alert 
            severity="warning" 
            icon={<WarningIcon />}
            sx={{ 
              borderRadius: 1.5,
              '& .MuiAlert-message': {
                fontSize: '0.75rem'
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Are you sure you want to cancel this MIV?
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              This action cannot be undone. The draft MIV will be permanently cancelled.
            </Typography>
          </Alert>

          {error && (
            <Alert 
              severity="error" 
              sx={{ borderRadius: 1.5 }} 
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* MIV Details */}
          {mivData && (
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, letterSpacing: '0.5px' }}>
                MIV DETAILS
              </Typography>
              
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={labelStyle}>MIV NUMBER</Typography>
                  <Typography sx={valueStyle}>
                    {mivData.miv_number || mivData._id || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={labelStyle}>STATUS</Typography>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: mivData.status === 'Draft' ? '#F59E0B' : '#10B981',
                        display: 'inline-block'
                      }}
                    />
                    <Typography sx={valueStyle}>
                      {mivData.status || "Unknown"}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography sx={labelStyle}>DEPARTMENT</Typography>
                  <Typography sx={valueStyle}>
                    {mivData.department?.DepartmentName || mivData.department || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={labelStyle}>TOTAL ISSUE COST</Typography>
                  <Typography sx={{ ...valueStyle, fontWeight: 700, color: COLORS.primary }}>
                    {formatCurrency(mivData.total_issue_cost)}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={labelStyle}>ITEMS COUNT</Typography>
                  <Typography sx={valueStyle}>
                    {mivData.items_count || mivData.items?.length || 0} item(s)
                  </Typography>
                </Box>

                {mivData.createdAt && (
                  <Box>
                    <Typography sx={labelStyle}>CREATED AT</Typography>
                    <Typography sx={valueStyle}>
                      {formatDate(mivData.createdAt)}
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              {/* Items Summary */}
              {mivData.items && mivData.items.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    ITEMS TO BE CANCELLED
                  </Typography>
                  
                  <Stack spacing={1}>
                    {mivData.items.slice(0, 3).map((item, idx) => (
                      <Box key={idx} sx={{ 
                        p: 1, 
                        bgcolor: COLORS.background.light, 
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`
                      }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {item.item_description || item.part_no || "Unknown Item"}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Quantity: {item.issued_qty} {item.unit} | Cost: {formatCurrency(item.unit_cost)}
                        </Typography>
                      </Box>
                    ))}
                    {mivData.items.length > 3 && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, textAlign: 'center' }}>
                        +{mivData.items.length - 3} more item(s)
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Box>
          )}

          {/* No Data State */}
          {!mivData && !error && (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              No MIV data available
            </Alert>
          )}
        </Stack>
      </DialogContent>

      {/* ACTIONS */}
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
          Keep Draft
        </Button>

        <Button
          variant="contained"
          onClick={handleCancel}
          disabled={loading || (mivData && mivData.status !== "Draft")}
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
          {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Cancel MIV"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Custom IconButton component (since we need it for the close button)
const IconButton = ({ children, onClick, size, disabled, sx }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    sx={{
      minWidth: 'auto',
      p: 0.5,
      borderRadius: 1,
      color: COLORS.text.tertiary,
      '&:hover': {
        bgcolor: `${COLORS.primary}10`,
        color: COLORS.primary
      },
      ...sx
    }}
  >
    {children}
  </Button>
);

export default DeleteMIV;