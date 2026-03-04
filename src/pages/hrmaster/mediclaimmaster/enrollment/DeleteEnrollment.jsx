import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Box,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

const ERROR_GRADIENT =
  "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)";

const DeleteEnrollment = ({
  open,
  onClose,
  enrollment,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!enrollment?._id) return;

    if (!reason.trim()) {
      setError("Please provide cancellation reason.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${BASE_URL}/api/mediclaim/enrollments/${enrollment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { reason }, // DELETE body goes inside data
        }
      );

      if (res.data.success) {
        if (onSuccess) onSuccess(enrollment._id);

        onClose();
      } else {
        setError(res.data.message || "Deletion failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to cancel enrollment"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!enrollment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* ===== HEADER ===== */}
      <DialogTitle
        sx={{
          background: ERROR_GRADIENT,
          color: "#fff",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <DeleteIcon />
          <Typography fontWeight={600}>
            Cancel Enrollment
          </Typography>
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{ color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ===== CONTENT ===== */}
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <Alert
            severity="warning"
            icon={<WarningIcon />}
          >
            This action will cancel the enrollment permanently.
          </Alert>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Enrollment ID
            </Typography>
            <Typography fontWeight={600}>
              {enrollment.enrollmentId}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Insurance ID
            </Typography>
            <Typography>
              {enrollment.insuranceId}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={enrollment.status}
              color={
                enrollment.status === "active"
                  ? "success"
                  : "default"
              }
            />
          </Box>

          <TextField
            label="Cancellation Reason"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={
            loading ? null : <DeleteIcon />
          }
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            "Confirm Cancel"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEnrollment;