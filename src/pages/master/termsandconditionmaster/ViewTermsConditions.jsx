import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  styled,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  Gavel as GavelIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  FormatListNumbered as FormatListNumberedIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';

const ViewTermsAndConditions = ({ open, onClose, term, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termData, setTermData] = useState(null);

  /* ================= FETCH TERM BY ID ================= */

  useEffect(() => {
    if (open && term?._id) {
      fetchTermById(term._id);
    }
  }, [open, term]);

  const fetchTermById = async (id) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${BASE_URL}/api/terms-conditions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        setTermData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch term details");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load term details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render field with icon
  const renderField = (icon, label, value, color = '#0f172a') => (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: PRIMARY_BLUE, mt: 0.3, minWidth: 20 }}>
        {icon}
      </Box>
      <Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#64748B', 
            display: 'block', 
            fontSize: '10px',
            fontWeight: 500,
            lineHeight: 1.2,
            mb: 0.2
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '13px',
            color: color,
            wordBreak: 'break-word'
          }}
        >
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );

  if (!term) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          height: 'auto',
          maxHeight: '500px'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ 
        background: HEADER_GRADIENT,
        py: 1.5,
        px: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <GavelIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Terms & Conditions Details
            </Typography>
          </Stack>
          {termData && (
            <Chip
              icon={termData?.IsActive ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <CancelIcon sx={{ fontSize: 12 }} />}
              label={termData?.IsActive ? 'Active' : 'Inactive'}
              size="small"
              sx={{
                bgcolor: termData?.IsActive ? 'rgba(220,252,231,0.9)' : 'rgba(254,226,226,0.9)',
                color: termData?.IsActive ? '#166534' : '#991b1b',
                fontWeight: 600,
                fontSize: '11px',
                height: '22px',
                '& .MuiChip-icon': { fontSize: 12 }
              }}
            />
          )}
        </Stack>
      </Box>

      <DialogContent sx={{ 
        p: 2,
        '&:last-child': {
          pb: 2
        }
      }}>
        {loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ height: '200px' }}>
            <CircularProgress sx={{ color: PRIMARY_BLUE }} />
          </Stack>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              '& .MuiAlert-message': { fontSize: '0.875rem' }
            }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && termData && (
          <Stack spacing={2}>
            {/* Basic Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <FormatListNumberedIcon sx={{ fontSize: 16 }} />, 
                    'Sequence Number', 
                    termData?.Sequence
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <GavelIcon sx={{ fontSize: 16 }} />, 
                    'Title', 
                    termData?.Title,
                    PRIMARY_BLUE
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Description
              </Typography>
              
              <Box sx={{ 
                backgroundColor: '#F8FAFC', 
                p: 1.5, 
                borderRadius: 1,
                border: '1px solid #E0E0E0',
                maxHeight: '180px',
                overflow: 'auto'
              }}>
                <Typography variant="body2" sx={{ fontSize: '13px', color: '#0f172a', whiteSpace: 'pre-wrap' }}>
                  {termData?.Description || 'No description provided'}
                </Typography>
              </Box>
            </Paper>
          </Stack>
        )}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2,
        py: 1.5,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            onClick={onClose}
            startIcon={<CloseIcon />}
            size="small"
            sx={{ color: '#666', fontSize: '0.8rem' }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              onClose();
              onEdit && onEdit(termData);
            }}
            startIcon={<EditIcon />}
            size="small"
            disabled={loading || !!error || !termData}
            sx={{
              backgroundColor: PRIMARY_BLUE,
              fontSize: '0.8rem',
              '&:hover': { backgroundColor: '#0e7490' },
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0'
              }
            }}
          >
            Edit Term
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewTermsAndConditions;