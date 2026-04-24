// DeleteDefectCode.jsx - Fixed version
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Paper,
  Stack,
  IconButton,
  Chip,
  Box
} from "@mui/material";
import {
  Delete as DeleteIcon,
  WarningAmber as WarningIcon,
  Close as CloseIcon,
  Science as ScienceIcon,
  Build as BuildIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #a30f0f 0%, #df2a30 100%)";

// Color constants matching your design system
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
  severity: {
    Critical: '#EF4444',
    Major: '#F59E0B',
    Minor: '#10B981',
    Cosmetic: '#8B5CF6'
  }
};

const DeleteDefectCode = ({ open, onClose, defectCode, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!defectCode?._id) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BASE_URL}/api/defect-codes/${defectCode._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        onDelete(defectCode._id);
        onClose();
      } else {
        setError(response.data.message || "Failed to delete defect code");
      }
    } catch (err) {
      console.error("Error deleting defect code:", err);
      setError(
        err.response?.data?.message ||
        "Failed to delete defect code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    return COLORS.severity[severity] || COLORS.text.secondary;
  };

  // Helper function to get process name from either string or object
  const getProcessName = (process) => {
    if (!process) return '';
    if (typeof process === 'string') return process;
    if (typeof process === 'object') {
      return process.process_name || process.name || process.process_id || '';
    }
    return '';
  };

  const getProcessCount = () => {
    return defectCode?.applicable_processes?.length || 0;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: 22,
          color: "#fff",
          px: 3,
          py: 1.5,
          background: HEADER_GRADIENT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Confirm Delete

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ mt: 3, px: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white
          }}
        >
          <Stack spacing={2.5}>
            {/* Warning Message */}
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <WarningIcon sx={{ color: "#f59e0b", fontSize: 28, mt: 0.5 }} />

              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: COLORS.text.primary
                }}
              >
                Are you sure you want to delete the defect code{" "}
                <strong>"{defectCode?.defect_code}"</strong>?
              </Typography>
            </Stack>

            {/* Defect Code Details Card */}
            {defectCode && (
              <Box sx={{ 
                mt: 1, 
                p: 2, 
                bgcolor: COLORS.background.light, 
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`
              }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      DEFECT CODE
                    </Typography>
                    <Chip
                      label={defectCode.defect_code}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: COLORS.primaryLight,
                        color: COLORS.primary,
                        height: 24
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      DEFECT NAME
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {defectCode.defect_name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                        CATEGORY
                      </Typography>
                      <Chip
                        label={defectCode.defect_category}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          bgcolor: COLORS.primaryLight,
                          color: COLORS.primary
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                        DEFAULT SEVERITY
                      </Typography>
                      <Chip
                        label={defectCode.severity_default}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          bgcolor: `${getSeverityColor(defectCode.severity_default)}20`,
                          color: getSeverityColor(defectCode.severity_default),
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </Box>

                  {getProcessCount() > 0 && (
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                        APPLICABLE PROCESSES ({getProcessCount()})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {defectCode.applicable_processes.slice(0, 3).map((process, idx) => {
                          // FIX: Get the process name properly from object or string
                          const processName = getProcessName(process);
                          return processName ? (
                            <Chip
                              key={idx}
                              label={processName}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.6rem',
                                height: 20,
                                borderColor: COLORS.border
                              }}
                            />
                          ) : null;
                        })}
                        {getProcessCount() > 3 && (
                          <Chip
                            label={`+${getProcessCount() - 3} more`}
                            size="small"
                            sx={{
                              fontSize: '0.6rem',
                              height: 20,
                              bgcolor: COLORS.background.white
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {defectCode.defect_description && (
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                        DESCRIPTION
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, lineHeight: 1.4 }}>
                        {defectCode.defect_description.length > 100 
                          ? `${defectCode.defect_description.substring(0, 100)}...` 
                          : defectCode.defect_description}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            )}

            {/* Warning Note */}
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: COLORS.text.tertiary,
                fontStyle: "italic"
              }}
            >
              ⚠️ This action cannot be undone. Deleting this defect code will:
              <br />• Remove it from all quality checklists
              <br />• Affect historical non-conformance reports
              <br />• Cannot be recovered once deleted
            </Typography>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </Paper>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 2,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          gap: 1
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.8rem",
            px: 2,
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: COLORS.background.hover
            }
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 1.5,
            px: 3,
            backgroundColor: "#DC2626",
            fontSize: "0.8rem",
            "&:hover": {
              backgroundColor: "#B91C1C"
            }
          }}
        >
          {loading ? "Deleting..." : "Delete Defect Code"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDefectCode;