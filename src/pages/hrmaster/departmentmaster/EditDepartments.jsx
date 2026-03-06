
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
  Paper,
  Typography,
  IconButton
} from "@mui/material";
import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

const EditDepartments = ({ open, onClose, department, onUpdate }) => {
  const [formData, setFormData] = useState({
    DepartmentName: "",
    Description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (department) {
      setFormData({
        DepartmentName: department.DepartmentName || "",
        Description: department.Description || ""
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.DepartmentName.trim()) {
      setError("Department name is required");
      return;
    }

    if (formData.DepartmentName.trim().length < 2) {
      setError("Department name must be at least 2 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/departments/${department._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || "Failed to update department");
      }
    } catch (err) {
      console.error("Error updating department:", err);
      setError(
        err.response?.data?.message ||
        "Failed to update department. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
          fontSize: 22,
          color: "#fff",
          px: 3,
          py: 2,
          background: HEADER_GRADIENT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Edit Department

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e2e8f0"
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#2563EB",
                fontSize: "1rem"
              }}
            >
              Basic Information
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Department Name"
                name="DepartmentName"
                value={formData.DepartmentName}
                onChange={handleChange}
                required
                disabled={loading}
                error={
                  !!error &&
                  (error.includes("Department name") ||
                  error.includes("name must be"))
                }
                helperText={
                  error &&
                  (error.includes("Department name") ||
                  error.includes("name must be"))
                    ? error
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    background: "#f8fafc"
                  }
                }}
              />

              <TextField
                fullWidth
                label="Description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                multiline
                rows={4}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    background: "#f8fafc"
                  }
                }}
              />
            </Stack>
          </Paper>

          {error &&
            !error.includes("Department name") &&
            !error.includes("name must be") && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
          )}
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          borderTop: "1px solid #e2e8f0",
          background: "#f8fafc"
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 500
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? null : <EditIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 1.5,
            px: 3,
            background: HEADER_GRADIENT,
            "&:hover": {
              opacity: 0.9,
              background: HEADER_GRADIENT
            }
          }}
        >
          {loading ? "Updating..." : "Update Department"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDepartments;