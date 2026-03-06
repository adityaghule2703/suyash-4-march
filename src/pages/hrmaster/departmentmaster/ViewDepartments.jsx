import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Stack,
  IconButton,
  Box,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

const ViewDepartments = ({ open, onClose, department }) => {
  if (!department) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatSimpleDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const Field = ({ label, value, inline = false }) => (
    <Box sx={{ mb: 1 }}>
      {inline ? (
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#475569",
              minWidth: 120
            }}
          >
            {label}:
          </Typography>
          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "#1e293b"
            }}
          >
            {value}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={0.5}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#475569"
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "#1e293b"
            }}
          >
            {value}
          </Typography>
        </Stack>
      )}
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: 24,
          color: "#fff",
          px: 4,
          py: 1.5,
          background: HEADER_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        Department Details

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ mt: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid #e2e8f0"
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#2563EB",
              fontSize: "1.2rem"
            }}
          >
            Basic Information
          </Typography>

          {/* Department Name and Created At row */}
          <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Field
                label="Department Name"
                value={department.DepartmentName}
                inline
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Field
                label="Description"
                value={department.Description || "ASDFGHJKL"}
                inline
              />
            </Box>
          </Box>

          {/* Last Updated and Description row */}
          <Box sx={{ display: "flex", gap: 4, mb: -2 }}>
            <Box sx={{ flex: 1 }}>
              <Field
                label="Last Updated"
                value={formatSimpleDate(department.UpdatedAt)}
                inline
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Field
                label="Created At"
                value={formatDate(department.CreatedAt)}
                inline
              />
            </Box>
          </Box>

          {/* Additional departments list */}
          {/* <Divider sx={{ my: 3 }} /> */}
          
          {/* <Typography
            sx={{
              fontWeight: 600,
              mb: 2,
              color: "#2563EB",
              fontSize: "1.1rem"
            }}
          >
            Other Departments
          </Typography> */}
{/* 
          <Grid container spacing={2}>
            {["Test Department", "Random", "asdfg"].map((dept, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": {
                      background: "#f8fafc",
                      borderColor: "#2563EB"
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 500, color: "#1e293b" }}>
                    {dept}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid> */}

          {/* <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                py: 1,
                borderColor: "#2563EB",
                color: "#2563EB",
                "&:hover": {
                  borderColor: "#1da1b9",
                  background: "#f0f9ff"
                }
              }}
            >
              Add Department
            </Button>
          </Box> */}
        </Paper>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 4,
          pb: 1.5,
          pt: 1.5,
          borderTop: "1px solid #e2e8f0",
          background: "#f8fafc",
          justifyContent: "space-between"
        }}
      >
        <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
          {/* XCV • Last updated: {formatSimpleDate(department.UpdatedAt)} */}
        </Typography>
        
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            borderRadius: 2,
            px: 4,
            py: 1,
            background: HEADER_GRADIENT,
            "&:hover": {
              opacity: 0.9,
              background: HEADER_GRADIENT
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDepartments;