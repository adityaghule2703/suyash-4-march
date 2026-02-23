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
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const EditTermsAndConditions = ({ open, onClose, term, onUpdate }) => {
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Sequence: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= Load Data ================= */

  useEffect(() => {
    if (term) {
      setFormData({
        Title: term.Title || "",
        Description: term.Description || "",
        Sequence: term.Sequence || "",
      });
    }
  }, [term]);

  /* ================= Handle Change ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= Submit ================= */

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
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      {/* ================= Header ================= */}
      <DialogTitle
        sx={{
          borderBottom: "1px solid #E0E0E0",
          backgroundColor: "#F8FAFC",
        }}
      >
        <div style={{
          fontSize: '20px',
          fontWeight: 600,
          paddingTop: '8px'
        }}>
          Edit Terms & Conditions
        </div>
        <Typography variant="body2" color="text.secondary">
          Update term information
        </Typography>
      </DialogTitle>

      {/* ================= Content ================= */}
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Current Term Summary */}
          <Paper sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Current Term
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {term.Title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sequence: {term.Sequence}
            </Typography>
          </Paper>

          {/* Update Form */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Update Details
            </Typography>

            <Stack spacing={2}>
              {/* Title and Sequence in one row */}
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Title *"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ flex: 3 }}
                />

                <TextField
                  fullWidth
                  label="Sequence *"
                  name="Sequence"
                  type="number"
                  value={formData.Sequence}
                  onChange={handleChange}
                  disabled={loading}
                  inputProps={{ min: 1 }}
                  sx={{ flex: 1 }}
                />
              </Stack>

              {/* Description - Full Width */}
              <TextField
                fullWidth
                label="Description *"
                name="Description"
                multiline
                rows={4}
                value={formData.Description}
                onChange={handleChange}
                disabled={loading}
                sx={{
                  "& textarea": {
                    resize: "none",
                  },
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      {/* ================= Footer ================= */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #E0E0E0",
          backgroundColor: "#F8FAFC",
        }}
      >
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={!loading && <EditIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' }
          }}
        >
          {loading ? "Updating..." : "Update Term"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTermsAndConditions;