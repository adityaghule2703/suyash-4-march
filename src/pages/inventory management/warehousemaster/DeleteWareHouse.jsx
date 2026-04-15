import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Paper,
  Stack,
  IconButton,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Chip
} from "@mui/material";
import {
  Delete as DeleteIcon,
  WarningAmber as WarningIcon,
  Close as CloseIcon,
  Warehouse as WarehouseIcon,
  Inventory as BinIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const HEADER_GRADIENT = "linear-gradient(135deg, #a30f0f 0%, #df2a30 100%)";

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
  },
  border: '#E3E8EF',
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
  }
};

const DeleteWareHouse = ({ open, onClose, data, onDelete, onBinDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteType, setDeleteType] = useState("warehouse"); // "warehouse" or "bin"
  const [selectedBinId, setSelectedBinId] = useState("");
  const [selectedBin, setSelectedBin] = useState(null);

  const handleDeleteWarehouse = async () => {
    if (!data?._id) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BASE_URL}/api/warehouses/${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        if (onDelete) onDelete(data._id);
        onClose();
      } else {
        setError(response.data.message || "Failed to delete warehouse");
      }
    } catch (err) {
      console.error("Error deleting warehouse:", err);
      setError(
        err.response?.data?.message ||
          "Cannot delete warehouse with existing stock or transactions. Please remove all stock first."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBin = async () => {
    if (!data?._id || !selectedBinId) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BASE_URL}/api/warehouses/${data._id}/bins/${selectedBinId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        if (onBinDelete) onBinDelete(selectedBinId);
        onClose();
      } else {
        setError(response.data.message || "Failed to delete bin");
      }
    } catch (err) {
      console.error("Error deleting bin:", err);
      setError(
        err.response?.data?.message ||
          "Cannot delete bin with existing stock. Please remove stock from this bin first."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (deleteType === "warehouse") {
      handleDeleteWarehouse();
    } else {
      handleDeleteBin();
    }
  };

  const handleBinSelect = (binId) => {
    setSelectedBinId(binId);
    const bin = data?.bins?.find(b => b._id === binId || b.bin_id === binId);
    setSelectedBin(bin);
    setError("");
  };

  // Check if warehouse has stock
  const hasStock = (data?.total_stock_quantity || 0) > 0;

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
          py: 1.5,
          background: HEADER_GRADIENT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Confirm Delete
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white
          }}
        >
          <Stack spacing={2.5}>
            {/* Warning Icon and Message */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <WarningIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
              <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                Are you sure you want to delete?
              </Typography>
            </Stack>

            {/* Delete Type Selection */}
            {data?.bins && data.bins.length > 0 && (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1 }}>
                  Select what you want to delete:
                </FormLabel>
                <RadioGroup
                  value={deleteType}
                  onChange={(e) => {
                    setDeleteType(e.target.value);
                    setError("");
                    if (e.target.value === "bin") {
                      setSelectedBinId("");
                      setSelectedBin(null);
                    }
                  }}
                >
                  <FormControlLabel 
                    value="warehouse" 
                    control={<Radio />} 
                    label={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <WarehouseIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                        <Typography variant="body2">Delete Entire Warehouse</Typography>
                        {hasStock && (
                          <Chip 
                            label="Has Stock" 
                            size="small" 
                            sx={{ fontSize: '0.6rem', height: 20, bgcolor: '#FEE2E2', color: '#DC2626' }}
                          />
                        )}
                      </Stack>
                    }
                    disabled={hasStock}
                  />
                  <FormControlLabel 
                    value="bin" 
                    control={<Radio />} 
                    label={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <BinIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                        <Typography variant="body2">Delete Specific Bin</Typography>
                      </Stack>
                    }
                  />
                </RadioGroup>
              </FormControl>
            )}

            {/* Warehouse Delete Warning */}
            {deleteType === "warehouse" && (
              <>
                <Divider />
                <Box>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
                    Delete Warehouse: <strong>"{data?.warehouse_name}"</strong>
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: COLORS.text.secondary }}>
                    Warehouse ID: {data?.warehouse_id}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: COLORS.text.secondary, mt: 0.5 }}>
                    Total Bins: {data?.total_bins || 0} | Active Bins: {data?.active_bins || 0}
                  </Typography>
                  {hasStock && (
                    <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 1.5, fontSize: '0.7rem', py: 0.5 }}>
                      This warehouse has stock. Please remove all stock before deleting.
                    </Alert>
                  )}
                  {!hasStock && (
                    <Alert severity="info" sx={{ mt: 1.5, borderRadius: 1.5, fontSize: '0.7rem', py: 0.5 }}>
                      This action will permanently delete the warehouse and all its bins.
                    </Alert>
                  )}
                </Box>
              </>
            )}

            {/* Bin Delete Selection */}
            {deleteType === "bin" && data?.bins && data.bins.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                    Select Bin to Delete
                  </Typography>
                  
                  <Stack spacing={1.5}>
                    {data.bins.map((bin) => {
                      const hasBinStock = (bin.current_stock?.quantity || 0) > 0;
                      return (
                        <Paper
                          key={bin._id || bin.bin_id}
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            border: `1px solid ${selectedBinId === (bin._id || bin.bin_id) ? COLORS.primary : COLORS.border}`,
                            bgcolor: selectedBinId === (bin._id || bin.bin_id) ? COLORS.primaryLight : COLORS.background.white,
                            cursor: hasBinStock ? "not-allowed" : "pointer",
                            opacity: hasBinStock ? 0.6 : 1,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: !hasBinStock ? COLORS.primary : COLORS.border,
                              bgcolor: !hasBinStock ? COLORS.background.hover : COLORS.background.white
                            }
                          }}
                          onClick={() => !hasBinStock && handleBinSelect(bin._id || bin.bin_id)}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Radio
                                checked={selectedBinId === (bin._id || bin.bin_id)}
                                disabled={hasBinStock}
                                size="small"
                              />
                              <Box>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                    {bin.bin_id}
                                  </Typography>
                                  <Chip 
                                    label={bin.bin_code} 
                                    size="small" 
                                    sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                                  />
                                </Stack>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                  Rack: {bin.rack} | Position: {bin.row},{bin.col}
                                </Typography>
                              </Box>
                            </Stack>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                Capacity: {bin.capacity?.toLocaleString()}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: hasBinStock ? '#DC2626' : COLORS.text.secondary }}>
                                Stock: {bin.current_stock?.quantity?.toLocaleString() || 0}
                              </Typography>
                            </Box>
                          </Stack>
                          {hasBinStock && (
                            <Alert severity="warning" sx={{ mt: 1, borderRadius: 1, fontSize: '0.65rem', py: 0 }}>
                              Cannot delete bin with existing stock
                            </Alert>
                          )}
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>
              </>
            )}

            {deleteType === "bin" && selectedBin && (
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.7rem', py: 0.5 }}>
                You are about to delete bin <strong>{selectedBin.bin_id}</strong> ({selectedBin.bin_code})
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </Paper>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          gap: 1
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            height: 34,
            px: 2.5,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.75rem',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={
            loading || 
            (deleteType === "warehouse" && hasStock) ||
            (deleteType === "bin" && (!selectedBinId || (selectedBin?.current_stock?.quantity > 0)))
          }
          startIcon={loading ? null : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 1.5,
            px: 2.5,
            height: 34,
            fontSize: '0.75rem',
            backgroundColor: "#DC2626",
            "&:hover": {
              backgroundColor: "#B91C1C"
            }
          }}
        >
          {loading 
            ? "Deleting..." 
            : deleteType === "warehouse" 
              ? "Delete Warehouse" 
              : "Delete Bin"
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWareHouse;