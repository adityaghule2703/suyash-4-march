import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// Color constants matching Users/Tax components
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

const EditTermsAndConditions = ({ open, onClose, term, onUpdate }) => {
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Sequence: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (term) {
      setFormData({
        Title: term.Title || "",
        Description: term.Description || "",
        Sequence: term.Sequence || "",
      });
    }
  }, [term]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.Title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.Description.trim()) {
      setError("Description is required");
      return;
    }

    if (!formData.Sequence) {
      setError("Sequence is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/terms-conditions/${term._id}`,
        {
          Title: formData.Title,
          Description: formData.Description,
          Sequence: Number(formData.Sequence),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || "Failed to update term");
      }
    } catch (err) {
      console.error("Error updating term:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update term. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!term) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
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
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Edit Terms & Conditions
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Current Term Summary */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.65rem',
                fontWeight: 600,
                color: COLORS.text.secondary,
                letterSpacing: '0.5px',
                display: 'block',
                mb: 1
              }}
            >
              CURRENT TERM
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600,
                color: COLORS.text.primary,
                mb: 0.5
              }}
            >
              {term.Title}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.tertiary
              }}
            >
              Sequence: {term.Sequence}
            </Typography>
          </Paper>

          {/* Update Form */}
          <Box>
            <Typography 
              sx={{ 
                fontSize: '0.75rem',
                fontWeight: 600,
                color: COLORS.text.secondary,
                letterSpacing: '0.5px',
                mb: 1.5
              }}
            >
              UPDATE DETAILS
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {/* Title Field */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
                    TITLE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    label=""
                    name="Title"
                    value={formData.Title}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter term title"
                    size="small"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': {
                          borderColor: COLORS.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: COLORS.primary,
                          borderWidth: 1
                        }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem',
                        color: COLORS.text.primary,
                        '&::placeholder': {
                          color: COLORS.text.tertiary,
                          fontSize: '0.75rem'
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Sequence Field */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
                    SEQUENCE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    name="Sequence"
                    type="number"
                    value={formData.Sequence}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter sequence number"
                    size="small"
                    variant="outlined"
                    inputProps={{ min: 1 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': {
                          borderColor: COLORS.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: COLORS.primary,
                          borderWidth: 1
                        }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem',
                        color: COLORS.text.primary,
                        '&::placeholder': {
                          color: COLORS.text.tertiary,
                          fontSize: '0.75rem'
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Description Field */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
                    DESCRIPTION <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    name="Description"
                    value={formData.Description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    disabled={loading}
                    placeholder="Enter term description..."
                    size="small"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': {
                          borderColor: COLORS.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: COLORS.primary,
                          borderWidth: 1
                        }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem',
                        color: COLORS.text.primary,
                        '&::placeholder': {
                          color: COLORS.text.tertiary,
                          fontSize: '0.75rem'
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1.5,
                mt: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem',
                  alignItems: 'center'
                },
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
        display: 'flex',
        justifyContent: 'flex-end',
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
          disabled={loading || !formData.Title || !formData.Description || !formData.Sequence}
          startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? "Updating..." : "Update Term"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTermsAndConditions;