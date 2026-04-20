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
  Chip
} from "@mui/material";
import { 
  Close, 
  Delete as DeleteIcon, 
  Warning as WarningIcon,
  Factory as FactoryIcon
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

// Custom IconButton component
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

const DeleteAssembly = ({ open, onClose, onDelete, assemblyData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!assemblyData || !assemblyData._id) {
      setError("Invalid assembly line data");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      // ✅ DELETE API call to soft delete assembly line
      const response = await axios.delete(
        `${BASE_URL}/api/assembly-lines/${assemblyData._id}`,
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
        setError(response.data.message || "Failed to delete assembly line");
      }
    } catch (err) {
      console.error("Error deleting assembly line:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to delete assembly line";
        
        if (err.response.status === 400) {
          setError(`Cannot delete: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("Assembly line not found. It may have been already deleted.");
        } else if (err.response.status === 403) {
          setError("You don't have permission to delete this assembly line.");
        } else if (err.response.status === 409) {
          setError("Cannot delete assembly line as it is currently in use by work orders.");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while deleting the assembly line");
      }
    } finally {
      setLoading(false);
    }
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

  // Get status chip color
  const getStatusChip = (isActive) => {
    if (isActive) {
      return {
        label: 'Active',
        color: '#059669',
        bg: '#D1FAE5'
      };
    }
    return {
      label: 'Inactive',
      color: '#DC2626',
      bg: '#FEE2E2'
    };
  };

  const statusChip = assemblyData ? getStatusChip(assemblyData.is_active) : { label: 'Unknown', color: '#475569', bg: '#F1F5F9' };

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
          <DeleteIcon sx={{ color: '#EF4444', fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Delete Assembly Line
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
              Are you sure you want to delete this assembly line?
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              This action will soft delete the assembly line. It can be restored by an administrator if needed.
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

          {/* Assembly Line Details */}
          {assemblyData && (
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, letterSpacing: '0.5px' }}>
                ASSEMBLY LINE DETAILS
              </Typography>
              
              <Stack spacing={1.5}>
                {/* Line Code */}
                <Box>
                  <Typography sx={labelStyle}>LINE CODE</Typography>
                  <Typography sx={{ ...valueStyle, fontFamily: 'monospace' }}>
                    {assemblyData.line_code || `AL-${String(assemblyData._id?.slice(-4) || '0001')}`}
                  </Typography>
                </Box>

                {/* Line Name */}
                <Box>
                  <Typography sx={labelStyle}>LINE NAME</Typography>
                  <Typography sx={valueStyle}>
                    {assemblyData.line_name || "N/A"}
                  </Typography>
                </Box>

                {/* Line Type & Work Centre Row */}
                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={labelStyle}>LINE TYPE</Typography>
                    <Chip
                      label={assemblyData.line_type || "N/A"}
                      size="small"
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        height: 24,
                        bgcolor: assemblyData.line_type === 'Busbar' ? '#E8F0F1' : '#F1F5F9',
                        color: assemblyData.line_type === 'Busbar' ? COLORS.primary : '#475569',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={labelStyle}>WORK CENTRE</Typography>
                    <Typography sx={valueStyle}>
                      {assemblyData.work_centre || "N/A"}
                    </Typography>
                  </Box>
                </Stack>

                {/* Status */}
                <Box>
                  <Typography sx={labelStyle}>STATUS</Typography>
                  <Chip
                    label={statusChip.label}
                    size="small"
                    sx={{
                      mt: 0.5,
                      fontSize: '0.65rem',
                      height: 24,
                      bgcolor: statusChip.bg,
                      color: statusChip.color,
                      fontWeight: 600
                    }}
                  />
                </Box>

                {/* Description (if exists) */}
                {assemblyData.description && (
                  <Box>
                    <Typography sx={labelStyle}>DESCRIPTION</Typography>
                    <Typography sx={{ ...valueStyle, fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      {assemblyData.description}
                    </Typography>
                  </Box>
                )}

                {/* Audit Information */}
                <Divider sx={{ my: 0.5 }} />
                
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    AUDIT INFORMATION
                  </Typography>
                  <Stack spacing={1}>
                    {assemblyData.created_at && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Created At:</Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {formatDate(assemblyData.created_at)}
                        </Typography>
                      </Stack>
                    )}
                    {assemblyData.updated_at && assemblyData.updated_at !== assemblyData.created_at && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Last Updated:</Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {formatDate(assemblyData.updated_at)}
                        </Typography>
                      </Stack>
                    )}
                    {assemblyData.updated_by && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Last Updated By:</Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {typeof assemblyData.updated_by === 'string' 
                            ? assemblyData.updated_by.slice(-6) 
                            : assemblyData.updated_by?.name || assemblyData.updated_by?.Username || 'System'}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}

          {/* No Data State */}
          {!assemblyData && !error && (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              No assembly line data available
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
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          startIcon={!loading && <DeleteIcon sx={{ fontSize: "1rem" }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: '#EF4444',
            fontSize: "0.7rem",
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#DC2626' }
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Delete Assembly Line"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAssembly;