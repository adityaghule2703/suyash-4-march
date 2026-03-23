import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  Chip,
  Box,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Color constants matching CompanyMaster
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
    paper: '#f8fafc'
  },
  border: '#E3E8EF'
};

const ViewDesignations = ({ open, onClose, designation }) => {
  if (!designation) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getLevelColor = (level) => {
    if (level <= 2) return "success";
    if (level <= 4) return "info";
    if (level <= 6) return "warning";
    return "error";
  };

  const Field = ({ label, value }) => (
    <Box>
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: COLORS.text.secondary,
          mb: 0.5
        }}
      >
        {label}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 1.5,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.background.light,
          fontSize: "0.85rem",
          color: COLORS.text.primary,
          minHeight: 40,
          display: "flex",
          alignItems: "center"
        }}
      >
        {value || "-"}
      </Paper>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        } 
      }}
    >
      {/* Header */}
      <DialogTitle
  sx={{
    fontWeight: 600,
    fontSize: '1rem',
    color: COLORS.text.primary,
    px: 2.5,
    py: 1.5,
    mb: 2,
    bgcolor: COLORS.background.white,
    borderBottom: `1px solid ${COLORS.border}`, // ✅ ADD THIS
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  Designation Details

  <IconButton onClick={onClose} sx={{ color: COLORS.text.secondary, p: 0.5 }}>
    <CloseIcon sx={{ fontSize: '1.25rem' }} />
  </IconButton>
</DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 2.5, py: 2.5 }}>
        <Typography
          sx={{
            fontWeight: 600,
            mb: 1.5,
            fontSize: "0.9rem",
            color: COLORS.text.primary
          }}
        >
          Basic Information
        </Typography>
        

        <Grid container spacing={2.5}>
          {/* Designation Name */}
          <Grid item xs={12}>
            <Field
              label="Designation Name"
              value={designation.DesignationName}
            />
          </Grid>

          {/* Level */}
          <Grid item xs={12}>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: COLORS.text.secondary,
                  mb: 0.5
                }}
              >
                Level
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.background.light,
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Chip
                  label={`Level ${designation.Level}`}
                  color={getLevelColor(designation.Level)}
                  size="small"
                  sx={{ 
                    fontWeight: 600,
                    height: 24,
                    fontSize: '0.7rem',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              </Paper>
            </Box>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Field
              label="Description"
              value={designation.Description || "No description provided"}
            />
          </Grid>

          {/* Created & Updated */}
          <Grid item xs={12} sm={6}>
            <Field
              label="Created At"
              value={formatDateTime(designation.CreatedAt)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field
              label="Last Updated"
              value={formatDate(designation.UpdatedAt)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.light
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 1.5,
            px: 3,
            py: 0.75,
            fontSize: '0.8rem',
            bgcolor: COLORS.primary,
            '&:hover': {
              bgcolor: COLORS.primaryDark
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDesignations;