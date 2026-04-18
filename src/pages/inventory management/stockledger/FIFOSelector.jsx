import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Autocomplete,
  alpha
} from "@mui/material";
import {
  Close,
  Calculate as CalculateIcon,
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  BatchPrediction as BatchIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; 
import axios from "axios";
import BASE_URL from "../../../config/Config";

// ==================== DESIGN SYSTEM ====================
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  primaryLight: "#E8F0F1",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8",
    light: "#FFFFFF"
  },
  background: {
    white: "#FFFFFF",
    light: "#F8FFFC",
    warning: "#FEF3C7",
    error: "#FEE2E2",
    success: "#D1FAE5",
    info: "#E0F2FE"
  },
  border: "#E3E8EF"
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    fontSize: '0.75rem',
    backgroundColor: COLORS.background.white,
    transition: 'all 0.2s ease',
    '&:hover fieldset': { 
      borderColor: COLORS.primary,
      borderWidth: 1.5
    },
    '&.Mui-focused fieldset': { 
      borderColor: COLORS.primary, 
      borderWidth: 1.5 
    }
  },
  '& .MuiInputBase-input': {
    py: 1.2,
    px: 1.5,
    fontSize: '0.75rem',
    color: COLORS.text.primary,
    '&::placeholder': {
      color: COLORS.text.tertiary,
      fontSize: '0.7rem'
    }
  }
};

const FIFOSelector = ({ open, onClose, item: propItem }) => {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState(null);

  // Initialize from prop if provided
  useEffect(() => {
    if (propItem && propItem.item_id) {
      const itemObj = typeof propItem.item_id === 'object' ? propItem.item_id : { _id: propItem.item_id, part_no: propItem.part_no };
      setSelectedItem({
        _id: itemObj._id || propItem.item_id,
        part_no: itemObj.part_no || propItem.part_no,
        item_name: propItem.item_name || itemObj.item_name,
      });
    }
  }, [propItem]);

  useEffect(() => {
    if (open) {
      fetchItems();
      fetchWarehouses();
      resetForm();
    }
  }, [open]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/warehouses?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setWarehouses(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const resetForm = () => {
    if (!propItem?.item_id) {
      setSelectedItem(null);
    }
    setSelectedWarehouse(null);
    setQuantity("");
    setResult(null);
    setError("");
  };

  const handleItemChange = (event, value) => {
    setSelectedItem(value);
    setResult(null);
    setError("");
  };

  const handleWarehouseChange = (event, value) => {
    setSelectedWarehouse(value);
    setResult(null);
    setError("");
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number.isInteger(Number(value)))) {
      setQuantity(value);
      setResult(null);
      setError("");
    }
  };

  const handleCalculate = async () => {
    if (!selectedItem) {
      setError("Please select an item");
      return;
    }
    if (!selectedWarehouse) {
      setError("Please select a warehouse");
      return;
    }
    if (!quantity || quantity <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    setCalculating(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        item_id: selectedItem._id,
        warehouse_id: selectedWarehouse._id,
        quantity: Number(quantity)
      };

      const response = await axios.post(`${BASE_URL}/api/stock-ledger/fifo-select`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });

      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || "Failed to calculate FIFO selection");
      }
    } catch (err) {
      console.error("API Error:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to calculate FIFO selection";
        
        if (err.response.status === 400) {
          setError(`Validation error: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("Item or warehouse not found");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while calculating FIFO selection");
      }
    } finally {
      setCalculating(false);
    }
  };

  const handleClear = () => {
    resetForm();
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return num.toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getItemDisplay = (item) => {
    if (!item) return "";
    const partNo = item.part_no || item.item_code || "";
    const name = item.item_name || item.name || "";
    if (partNo && name) return `${partNo} - ${name.substring(0, 40)}`;
    if (partNo) return partNo;
    if (name) return name.substring(0, 40);
    return "Unknown Item";
  };

  const getWarehouseDisplay = (warehouse) => {
    if (!warehouse) return "";
    return warehouse.warehouse_name || warehouse.name || warehouse.warehouse_code || "";
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
          maxHeight: '90vh'
        }
      }}
    >
      {/* ==================== HEADER ==================== */}
      <DialogTitle sx={{
        bgcolor: COLORS.primary,
        color: COLORS.text.light,
        py: 2,
        px: 3,
     
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{
            bgcolor: alpha(COLORS.text.light, 0.15),
            borderRadius: 2,
         
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalculateIcon sx={{ fontSize: '1.3rem' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              FIFO Batch Selection
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', opacity: 0.8 }}>
              First-In-First-Out Inventory Simulation
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.light }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ==================== CONTENT ==================== */}
      <DialogContent sx={{ p: 0, bgcolor: COLORS.background.light }}>
        <Box sx={{ p: 2 }}>
          <Stack spacing={3}>
            {/* Info Alert */}
            <Alert 
              severity="info" 
              icon={<InfoIcon fontSize="small" />}
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': { fontSize: '0.75rem' }
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                FIFO (First-In-First-Out) Batch Selection
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                The oldest batches (earliest receipt dates) are consumed first. This simulates 
                how inventory would be issued in a real warehouse following FIFO method.
              </Typography>
            </Alert>

            {/* Input Section */}
            <Paper sx={{ 
              p: 1, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                fontWeight: 700, 
                color: COLORS.primary, 
                mb: 2, 
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Selection Parameters
              </Typography>
              
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.8 }}>
                    Select Item <span style={{ color: "#EF4444" }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={items}
                    getOptionLabel={getItemDisplay}
                    value={selectedItem}
                    onChange={handleItemChange}
                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Search and select an item..."
                        sx={inputStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <InventoryIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.8 }}>
                    Select Warehouse <span style={{ color: "#EF4444" }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={warehouses}
                    getOptionLabel={getWarehouseDisplay}
                    value={selectedWarehouse}
                    onChange={handleWarehouseChange}
                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Search and select a warehouse..."
                        sx={inputStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <WarehouseIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.8 }}>
                    Quantity to Issue <span style={{ color: "#EF4444" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={handleQuantityChange}
                    placeholder="Enter quantity to issue"
                    sx={inputStyle}
                    InputProps={{
                      inputProps: { min: 1, step: 1 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.tertiary }}>
                            Qty:
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  startIcon={<ClearIcon sx={{ fontSize: '0.9rem' }} />}
                  sx={{
                    height: 36,
                    px: 2.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary,
                    '&:hover': {
                      borderColor: COLORS.primary,
                      color: COLORS.primary,
                      bgcolor: alpha(COLORS.primary, 0.04)
                    }
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  disabled={calculating || !selectedItem || !selectedWarehouse || !quantity}
                  startIcon={!calculating && <CalculateIcon sx={{ fontSize: '0.9rem' }} />}
                  sx={{
                    height: 36,
                    px: 3,
                    borderRadius: 2,
                    bgcolor: COLORS.primary,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    '&:hover': { bgcolor: COLORS.primaryDark }
                  }}
                >
                  {calculating ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Calculate FIFO"}
                </Button>
              </Stack>
            </Paper>

            {/* Error Display */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ borderRadius: 2 }} 
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* Results Section */}
            {result && (
              <Stack spacing={2.5}>
                {/* Summary Cards */}
                <Paper sx={{ 
                  p: 2.5, 
                  borderRadius: 2, 
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: alpha('#059669', 0.05)
                }}>
                  <Typography sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    color: '#059669', 
                    mb: 2, 
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    FIFO Selection Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ 
                        borderRadius: 2, 
                        border: `1px solid ${COLORS.border}`, 
                        boxShadow: 'none',
                        bgcolor: COLORS.background.white
                      }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary, mb: 0.5 }}>
                                Total Quantity
                              </Typography>
                              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                                {formatNumber(result.total_quantity)}
                              </Typography>
                            </Box>
                            <InventoryIcon sx={{ fontSize: '1.2rem', color: alpha(COLORS.primary, 0.4) }} />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ 
                        borderRadius: 2, 
                        border: `1px solid ${COLORS.border}`, 
                        boxShadow: 'none',
                        bgcolor: COLORS.background.white
                      }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary, mb: 0.5 }}>
                                Total Value
                              </Typography>
                              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>
                                {formatCurrency(result.total_value)}
                              </Typography>
                            </Box>
                            <MoneyIcon sx={{ fontSize: '1.2rem', color: alpha('#059669', 0.4) }} />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ 
                        borderRadius: 2, 
                        border: `1px solid ${COLORS.border}`, 
                        boxShadow: 'none',
                        bgcolor: COLORS.background.white
                      }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary, mb: 0.5 }}>
                                Average Cost
                              </Typography>
                              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#D97706' }}>
                                {formatCurrency(result.average_cost)}
                              </Typography>
                            </Box>
                            <TrendingUpIcon sx={{ fontSize: '1.2rem', color: alpha('#D97706', 0.4) }} />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Selected Batches Table */}
                <Box>
                  <Typography sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    color: COLORS.primary, 
                    mb: 1.5,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Selected Batches (FIFO Order)
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ 
                    boxShadow: 'none', 
                    border: `1px solid ${COLORS.border}`, 
                    borderRadius: 2,
                    overflowX: 'auto'
                  }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.primary }}>
                          <TableCell sx={{ bgcolor: COLORS.primary, color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem', py: 1.5 }}>#</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primary, color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem', py: 1.5 }}>Batch No</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primary, color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem', py: 1.5 }} align="right">Quantity</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primary, color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem', py: 1.5 }} align="right">Unit Cost</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primary, color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem', py: 1.5 }} align="right">Total Value</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primary, color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem', py: 1.5 }}>Unit</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primary, color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem', py: 1.5 }}>Receipt Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.selected_batches && result.selected_batches.length > 0 ? (
                          result.selected_batches.map((batch, idx) => (
                            <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: COLORS.background.hover } }}>
                              <TableCell sx={{ fontSize: '0.7rem', py: 1.5 }}>{idx + 1}</TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <BatchIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                                  <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 500 }}>
                                    {batch.batch_no || 'No Batch'}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                                  {formatNumber(batch.quantity)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                  {formatCurrency(batch.unit_cost)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                                  {formatCurrency(batch.total_value)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                  {batch.unit || 'Nos'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {batch.receipt_date && (
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <ScheduleIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                                    <Typography sx={{ fontSize: '0.7rem' }}>
                                      {formatDate(batch.receipt_date)}
                                    </Typography>
                                  </Stack>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                                No batches selected
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* FIFO Explanation */}
                <Alert 
                  severity="info" 
                  icon={<InfoIcon fontSize="small" />}
                  sx={{ borderRadius: 2 }}
                >
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, mb: 0.5 }}>
                    How FIFO Works
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                    • Oldest batches (earliest receipt dates) are consumed first<br />
                    • Batches are selected in chronological order<br />
                    • Partial batches can be selected when quantity doesn't match exact batch size<br />
                    • Average cost is calculated as weighted average of selected batches
                  </Typography>
                </Alert>
              </Stack>
            )}
          </Stack>
        </Box>
      </DialogContent>

      {/* ==================== FOOTER ==================== */}
      <DialogActions sx={{
        px: 3,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1.5
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            height: 34,
            px: 2.5,
            borderRadius: 2,
            borderColor: COLORS.border,
            color: COLORS.text.secondary,
            fontSize: "0.7rem",
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              color: COLORS.primary,
              bgcolor: alpha(COLORS.primary, 0.04)
            }
          }}
        >
          Close
        </Button>
        
        {result && (
          <Button
            variant="contained"
            onClick={handleCalculate}
            startIcon={<CalculateIcon sx={{ fontSize: '0.9rem' }} />}
            sx={{
              height: 34,
              px: 2.5,
              borderRadius: 2,
              bgcolor: COLORS.primary,
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: COLORS.primaryDark }
            }}
          >
            Recalculate
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FIFOSelector;