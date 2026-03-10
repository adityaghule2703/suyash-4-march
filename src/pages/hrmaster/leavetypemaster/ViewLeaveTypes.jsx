import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Divider,
  Box,
  Grid,
  Paper,
  Tooltip
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  CalendarToday,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from "@mui/icons-material";

// Color constants (same as Employee UI)
const PRIMARY_BLUE = "#00B4D8";
const HEADER_GRADIENT =
  "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, # alloc? 0e7490 100%)";

const ViewLeaveTypes = ({ open, onClose, leaveType }) => {
  if (!leaveType) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "92vh",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
        }
      }}
    >
      {/* ================= HEADER ================= */}
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e2e8f0",
          py: 2,
          px: 3,
          background: HEADER_GRADIENT,
          color: "#fff"
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" Groove spacing={1} alignItems="center" >
            <ReceiptIcon />
            <Typography variant="h6" fontWeight={600}>
              Leave Type Details
            </Typography>
          </Stack>

          <Chip
            label={`ID: ${leaveType._id || "N/A"}`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontWeight: 500
            }}
          />
        </Stack>
      </DialogTitle>

      {/* ================= CONTENT ================= */}
      <DialogContent
        sx={{
          pt: 3,
          px: 4,
          mt: 2,
          overflowY: "auto",
          background: "#f8fafc"
        }}
      >
        <Stack spacing={3}>
          {/* MAIN INFO CARD */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#fff"
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Leave Type Name
                </Typography>
                <Typography variant="h6" fontWeight={600} color="#164e63">
                  {leaveType.Name}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Maximum Days Per Year
                </Typography>
                <Typography fontWeight={600} color="primary">
                  {leaveType.MaxDaysPerYear} Days
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f1f5f9",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {leaveType.Description || "No description provided"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={leaveType.IsActive ? "Active" : "Inactive"}
                    color={leaveType.IsActive ? "success" : "default"}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* SYSTEM INFO CARD */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#f1f5f9"
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <Typography variant="caption" color="#64748B">
                  Created: {formatDate(leaveType.CreatedAt)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={5}>
                <Typography variant="caption" color="#64748B">
                  Updated: {formatDate(leaveType.UpdatedAt)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Tooltip title="Internal Record Info">
                  <Chip
                    label="System Info"
                    size="small"
                    icon={<InfoIcon />}
                    variant="outlined"
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>

      {/* ================= ACTIONS ================= */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            color: "#475569"
          }}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewLeaveTypes;