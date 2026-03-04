import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Stack,
  CircularProgress,
  IconButton,
  Chip,
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

const DeletePolicy = ({
  open,
  onClose,
  policy,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!policy?._id) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${BASE_URL}/api/mediclaim/policies/${policy._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        if (onSuccess) onSuccess(policy._id);
        onClose();
      } else {
        setError(res.data.message || "Failed to delete policy");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete policy"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!policy) return null;

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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <DeleteIcon />
          <Typography fontWeight={600}>
            Delete Policy
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
            This action will permanently delete the policy.
          </Alert>

          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Policy ID
            </Typography>
            <Typography fontWeight={600}>
              {policy.policyId}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Policy Name
            </Typography>
            <Typography>
              {policy.policyName}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Coverage
            </Typography>
            <Chip
              label={`₹ ${policy.coverageAmount?.toLocaleString("en-IN")}`}
              color="primary"
              size="small"
            />

            <Typography
              variant="body2"
              color="error"
              sx={{ mt: 2 }}
            >
              ⚠️ Deleted policies cannot be recovered.
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteIcon />
            )
          }
          sx={{
            minWidth: 140,
            fontWeight: 600,
          }}
        >
          {loading ? "Deleting..." : "Confirm Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePolicy;