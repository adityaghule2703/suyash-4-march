import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const EditPieceRate = ({ open, onClose, pieceRate, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    productType: "",
    operation: "",
    ratePerUnit: "",
    uom: "piece",
    skillLevel: "Unskilled",
    departmentId: "",
    effectiveFrom: null,
    effectiveTo: null,
  });

  /* ================= FETCH DEPARTMENTS ================= */
  useEffect(() => {
    if (open) fetchDepartments();
  }, [open]);

  const fetchDepartments = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setDepartments(res.data.data || []);
      }
    } catch (err) {
      console.error("Department fetch error:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  /* ================= LOAD PIECE RATE DATA ================= */
  useEffect(() => {
    if (open && pieceRate) {
      setFormData({
        productType: pieceRate.productType || "",
        operation: pieceRate.operation || "",
        ratePerUnit: pieceRate.ratePerUnit || "",
        uom: pieceRate.uom || "piece",
        skillLevel: pieceRate.skillLevel || "Unskilled",
        departmentId: pieceRate.departmentId
          ? String(pieceRate.departmentId._id || pieceRate.departmentId)
          : "",
        effectiveFrom: pieceRate.effectiveFrom
          ? new Date(pieceRate.effectiveFrom)
          : null,
        effectiveTo: pieceRate.effectiveTo
          ? new Date(pieceRate.effectiveTo)
          : null,
      });
    }
  }, [open, pieceRate]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "departmentId" ? String(value) : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!pieceRate?._id) {
      return setError("Invalid piece rate ID");
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const payload = {
        productType: formData.productType.trim(),
        operation: formData.operation.trim(),
        ratePerUnit: Number(formData.ratePerUnit),
        uom: formData.uom,
        skillLevel: formData.skillLevel,
        effectiveFrom: formData.effectiveFrom
          ? formData.effectiveFrom.toISOString().split("T")[0]
          : null,
        effectiveTo: formData.effectiveTo
          ? formData.effectiveTo.toISOString().split("T")[0]
          : null,
        departmentId: formData.departmentId || null,
      };

      const res = await axios.put(
        `${BASE_URL}/api/piece-rate-master/${pieceRate._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        onUpdate(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update piece rate"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #164e63, #00B4D8)",
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Edit Piece Rate
      </DialogTitle>

      <DialogContent sx={{ p: 1 }}>
        {fetchLoading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 3,
                p: 4,
                margin: 1,
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="h6" mb={2} fontWeight={600}>
                Piece Rate Details
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Product Type"
                    name="productType"
                    fullWidth
                    value={formData.productType}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Operation"
                    name="operation"
                    fullWidth
                    value={formData.operation}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Rate Per Unit"
                    name="ratePerUnit"
                    type="number"
                    fullWidth
                    value={formData.ratePerUnit}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="UOM"
                    name="uom"
                    fullWidth
                    value={formData.uom}
                    onChange={handleChange}
                  >
                    <MenuItem value="piece">Piece</MenuItem>
                    <MenuItem value="dozen">Dozen</MenuItem>
                    <MenuItem value="kg">Kg</MenuItem>
                    <MenuItem value="meter">Meter</MenuItem>
                    <MenuItem value="hour">Hour</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Skill Level"
                    name="skillLevel"
                    fullWidth
                    value={formData.skillLevel}
                    onChange={handleChange}
                  >
                    <MenuItem value="Unskilled">Unskilled</MenuItem>
                    <MenuItem value="Semi-Skilled">Semi-Skilled</MenuItem>
                    <MenuItem value="Skilled">Skilled</MenuItem>
                    <MenuItem value="Highly Skilled">Highly Skilled</MenuItem>
                  </TextField>
                </Grid>

                {/* Department */}
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Department"
                    name="departmentId"
                    fullWidth
                    value={formData.departmentId || ""}
                    onChange={handleChange}
                    SelectProps={{
                      MenuProps: { disablePortal: true },
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem
                        key={dept._id}
                        value={String(dept._id)}
                      >
                        {dept.DepartmentName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Effective From"
                    value={formData.effectiveFrom}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        effectiveFrom: value,
                      }))
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Effective To"
                    value={formData.effectiveTo}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        effectiveTo: value,
                      }))
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          </LocalizationProvider>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #164e63, #00B4D8)",
            px: 4,
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPieceRate;
