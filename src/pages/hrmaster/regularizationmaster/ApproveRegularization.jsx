import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Alert,
  Typography
} from "@mui/material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const ApproveRegularization = ({ open, onClose, record, onUpdate }) => {
  const [status, setStatus] = useState("Approved");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStatus("Approved");
      setRemarks("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!remarks.trim()) {
      return setError("Remarks are required");
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/regularization/${record._id}/status`,
        {
          status,
          remarks
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data?.success) {

        const updatedRecord =
          response.data.data || {
            ...record,
            Status: status,
            ApprovalRemarks: remarks
          };

        onUpdate(updatedRecord);   // 🔥 Snackbar master madhe show hoil
        onClose();
      } else {
        setError(response.data?.message || "Update failed");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Internal server error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Approve / Reject Regularization</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>

          <Typography variant="body2" color="text.secondary">
            Request Date: {new Date(record.Date).toLocaleDateString()}
          </Typography>

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            disabled={loading}
          >
            <MenuItem value="Approved">Approve</MenuItem>
            <MenuItem value="Rejected">Reject</MenuItem>
          </TextField>

          <TextField
            label="Remarks"
            multiline
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />

          {error && <Alert severity="error">{error}</Alert>}

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor:
              status === "Approved" ? "#2E7D32" : "#D32F2F"
          }}
        >
          {loading
            ? "Updating..."
            : status === "Approved"
            ? "Approve"
            : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveRegularization;
