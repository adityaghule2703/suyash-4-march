import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #c2410c 100%)";

const EditClaim = ({ open, onClose, onSuccess, claimData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    status: "",
    approvedAmount: "",
    comments: "",
  });

  /* ---------------- INITIALIZE DATA ---------------- */

  useEffect(() => {
    if (claimData) {
      setFormData({
        status: claimData.status || "",
        approvedAmount: claimData.approvedAmount || "",
        comments: "",
      });
    }
  }, [claimData]);

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (!formData.status) return "Status is required";

    if (
      formData.status === "approved" ||
      formData.status === "settled"
    ) {
      if (!formData.approvedAmount)
        return "Approved amount is required";

      if (
        Number(formData.approvedAmount) >
        Number(claimData.claimedAmount)
      )
        return "Approved amount cannot exceed claimed amount";

      if (Number(formData.approvedAmount) <= 0)
        return "Approved amount must be greater than 0";
    }

    return null;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const payload = {
        status: formData.status,
        comments: formData.comments,
      };

      // Only send approvedAmount if needed
      if (
        formData.status === "approved" ||
        formData.status === "settled"
      ) {
        payload.approvedAmount = Number(formData.approvedAmount);
      }

      const res = await axios.put(
        `${BASE_URL}/api/mediclaim/claims/${claimData._id}/status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        onSuccess && onSuccess();
        onClose();
      } else {
        setError(res.data.message || "Failed to update claim");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update claim"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STATUS COLOR ---------------- */

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
      case "settled":
        return "success";
      case "rejected":
        return "error";
      case "under_review":
        return "warning";
      default:
        return "default";
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          background: HEADER_GRADIENT,
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Update Claim Status
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3}>
          {/* CLAIM INFO */}
          {claimData && (
            <>
              <Typography variant="subtitle2">
                Claim ID: <strong>{claimData.claimId}</strong>
              </Typography>

              <Typography variant="subtitle2">
                Patient:{" "}
                <strong>
                  {claimData.patientDetails?.name}
                </strong>
              </Typography>

              <Typography variant="subtitle2">
                Claim Type:{" "}
                <strong>{claimData.claimType}</strong>
              </Typography>

              <Typography variant="subtitle2">
                Claimed Amount: ₹{claimData.claimedAmount}
              </Typography>

              <Chip
                label={`Current Status: ${claimData.status}`}
                color={getStatusColor(claimData.status)}
              />

              <Divider />
            </>
          )}

          {/* STATUS DROPDOWN */}
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
          >
            <MenuItem value="submitted">Submitted</MenuItem>
            <MenuItem value="under_review">
              Under Review
            </MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="settled">Settled</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>

          {/* APPROVED AMOUNT */}
          {(formData.status === "approved" ||
            formData.status === "settled") && (
            <TextField
              type="number"
              label="Approved Amount"
              value={formData.approvedAmount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  approvedAmount: e.target.value,
                }))
              }
            />
          )}

          {/* COMMENTS */}
          <TextField
            label="Comments"
            multiline
            rows={3}
            value={formData.comments}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                comments: e.target.value,
              }))
            }
          />

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ background: HEADER_GRADIENT }}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            "Update Status"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClaim;