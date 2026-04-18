import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton as MuiIconButton,
  Tooltip,
  MenuItem,
  Chip,
  LinearProgress
} from "@mui/material";
import {
  Add,
  Delete,
  Close,
  Warning as WarningIcon,
  Save as SaveIcon,
  Person,
  Inventory,
  Warehouse as WarehouseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// 🎨 DESIGN SYSTEM
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
    success: "#D1FAE5"
  },
  border: "#E3E8EF"
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.75rem",
    backgroundColor: COLORS.background.white,
    "&:hover fieldset": { borderColor: COLORS.primary },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary,
      borderWidth: 1
    }
  },
  "& .MuiInputBase-input": {
    py: 1,
    px: 1.5,
    fontSize: "0.75rem",
    color: COLORS.text.primary,
    "&::placeholder": {
      color: COLORS.text.tertiary
    }
  }
};

const labelStyle = {
  fontSize: "0.7rem",
  fontWeight: 600,
  color: COLORS.text.secondary,
  letterSpacing: "0.5px",
  mb: 0.5
};

// Status configuration
const getStatusConfig = (status) => {
  const statusConfig = {
    'Initiated': { color: '#D97706', bg: '#FEF3C7', label: 'Initiated', editable: true },
    'In Progress': { color: '#0284C7', bg: '#E0F2FE', label: 'In Progress', editable: true },
    'Count Completed': { color: '#2563EB', bg: '#DBEAFE', label: 'Count Completed', editable: false },
    'Under Review': { color: '#9333EA', bg: '#F3E8FF', label: 'Under Review', editable: false },
    'Adjusted': { color: '#059669', bg: '#D1FAE5', label: 'Adjusted', editable: false },
    'Approved': { color: '#059669', bg: '#D1FAE5', label: 'Approved', editable: false },
    'Closed': { color: '#475569', bg: '#F1F5F9', label: 'Closed', editable: false }
  };
  return statusConfig[status] || statusConfig['Initiated'];
};

const EditPSV = ({ open, onClose, data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [psvData, setPsvData] = useState(null);
  const [items, setItems] = useState([]);
  
  const [counts, setCounts] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    if (open && data) {
      fetchPSVDetails();
      fetchItems();
    }
  }, [open, data]);

  const fetchPSVDetails = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/physical-verifications/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPsvData(response.data.data);
        
        // Initialize counts from existing items or create new counts
        if (response.data.data.items && response.data.data.items.length > 0) {
          setCounts(response.data.data.items.map(item => ({
            item_id: item.item_id?._id || item.item_id,
            item_code: item.item_code,
            description: item.description,
            system_quantity: item.system_quantity || 0,
            counted_qty: item.physical_quantity || 0,
            variance: item.variance || 0,
            remarks: item.remarks || "",
            unit: item.unit
          })));
        } else {
          // If no items, we need to fetch items for this warehouse
          await fetchWarehouseItems(response.data.data.warehouse_id?._id || response.data.data.warehouse_id);
        }
        
        setCompletionPercentage(response.data.data.completion_percentage || 0);
      }
    } catch (err) {
      console.error('Error fetching PSV details:', err);
      setApiError('Failed to load PSV details');
    } finally {
      setFetching(false);
    }
  };

  const fetchWarehouseItems = async (warehouseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/warehouses/${warehouseId}/items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data) {
        const warehouseItems = response.data.data.map(item => ({
          item_id: item._id,
          item_code: item.item_code || item.part_no,
          description: item.description || item.item_description,
          system_quantity: item.current_stock || 0,
          counted_qty: 0,
          variance: 0,
          remarks: "",
          unit: item.unit
        }));
        setCounts(warehouseItems);
      }
    } catch (err) {
      console.error('Error fetching warehouse items:', err);
    }
  };

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

  const handleCountChange = (index, field, value) => {
    const updated = [...counts];
    const oldCountedQty = updated[index].counted_qty;
    
    if (field === 'counted_qty') {
      const newCountedQty = Number(value) || 0;
      const systemQty = updated[index].system_quantity || 0;
      updated[index].counted_qty = newCountedQty;
      updated[index].variance = newCountedQty - systemQty;
    } else {
      updated[index][field] = value;
    }
    
    setCounts(updated);
    
    // Calculate new completion percentage
    const completedCounts = updated.filter(c => c.counted_qty !== undefined && c.counted_qty !== null && c.counted_qty !== '').length;
    const newPercentage = updated.length > 0 ? (completedCounts / updated.length) * 100 : 0;
    setCompletionPercentage(Math.round(newPercentage));
    
    if (errors[`count_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`count_${index}_${field}`]: '' }));
    }
  };

  const validateCounts = () => {
    const newErrors = {};
    let isValid = true;
    
    counts.forEach((count, idx) => {
      if (count.counted_qty === undefined || count.counted_qty === null || count.counted_qty === '') {
        newErrors[`count_${idx}_counted_qty`] = 'Counted quantity is required';
        isValid = false;
      } else if (count.counted_qty < 0) {
        newErrors[`count_${idx}_counted_qty`] = 'Counted quantity cannot be negative';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateCounts()) return;
    if (!psvData || !psvData._id) {
      setApiError("Invalid PSV data");
      return;
    }
    
    setLoading(true);
    setApiError("");
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare counts payload
      const countsPayload = counts
        .filter(count => count.item_id && count.counted_qty !== undefined && count.counted_qty !== null && count.counted_qty !== '')
        .map(count => ({
          item_id: count.item_id,
          counted_qty: Number(count.counted_qty),
          remarks: count.remarks || ""
        }));
      
      if (countsPayload.length === 0) {
        setApiError("At least one item count is required");
        setLoading(false);
        return;
      }
      
      const payload = {
        counts: countsPayload
      };
      
      const response = await axios.put(`${BASE_URL}/api/physical-verifications/${psvData._id}/counts`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        onClose();
      } else {
        setApiError(response.data.message || 'Failed to update counts');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to update counts';
        
        if (err.response.status === 400) {
          setApiError(`Validation error: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setApiError("PSV not found");
        } else if (err.response.status === 403) {
          setApiError("You don't have permission to update this PSV");
        } else {
          setApiError(errorMsg);
        }
      } else if (err.request) {
        setApiError('No response from server. Please check your connection.');
      } else {
        setApiError(err.message || 'An error occurred while updating counts');
      }
    } finally { 
      setLoading(false); 
    }
  };

  const getItemDisplay = (itemId) => {
    const item = items.find(i => i._id === itemId);
    if (!item) return '';
    const partNo = item.part_no || item.PartNo || item.item_code || '';
    const description = item.description || item.Description || item.item_description || item.name || '';
    if (partNo && description) {
      return `${partNo} - ${description.substring(0, 50)}`;
    }
    if (partNo) return partNo;
    if (description) return description.substring(0, 50);
    return itemId.slice(-6);
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return '#D97706';
    if (variance < 0) return '#DC2626';
    return '#059669';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return '▲';
    if (variance < 0) return '▼';
    return '●';
  };

  if (!data) return null;

  const statusConfig = psvData ? getStatusConfig(psvData.status) : null;
  const isEditable = statusConfig?.editable && psvData?.status !== 'Closed';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
          maxHeight: '90vh'
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 1.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <EditIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Enter Counts - {psvData?.verification_id || psvData?.verification_number || 'PSV'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.875rem', color: COLORS.text.secondary }}>
              Loading PSV details...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {apiError && (
              <Alert severity="error" sx={{ borderRadius: 1.5 }} onClose={() => setApiError("")}>
                {apiError}
              </Alert>
            )}
            
            {!isEditable && psvData && (
              <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  <strong>Note:</strong> This PSV is in "{psvData.status}" status and cannot be edited. Only PSVs in "Initiated" or "In Progress" status can have counts entered.
                </Typography>
              </Alert>
            )}
            
            {/* PSV Information Summary */}
            {psvData && (
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>VERIFICATION NUMBER</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'monospace', color: COLORS.primary }}>
                      {psvData.verification_id || psvData.verification_number}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>WAREHOUSE</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WarehouseIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {psvData.warehouse_name || psvData.warehouse_id?.warehouse_name || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>VERIFICATION TYPE</Typography>
                    <Chip 
                      label={psvData.verification_type} 
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24, 
                        bgcolor: '#E8F0F1', 
                        color: COLORS.primary 
                      }} 
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            {/* Completion Progress */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={labelStyle}>COMPLETION PROGRESS</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                  {completionPercentage}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={completionPercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: COLORS.border,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: COLORS.primary,
                    borderRadius: 4
                  }
                }} 
              />
            </Box>
            
            {/* Counts Table */}
            <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                ENTER PHYSICAL COUNTS
              </Typography>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 60 }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Item Code</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">System Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }} align="right">Counted Qty*</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Variance</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {counts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                            No items found for this warehouse
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      counts.map((count, idx) => (
                        <TableRow key={count.item_id || idx} hover>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, fontFamily: 'monospace' }}>
                              {count.item_code || getItemDisplay(count.item_id) || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: '0.75rem' }}>
                              {count.description || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {count.system_quantity || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={count.counted_qty === 0 ? '' : count.counted_qty}
                              onChange={(e) => handleCountChange(idx, 'counted_qty', e.target.value)}
                              error={!!errors[`count_${idx}_counted_qty`]}
                              helperText={errors[`count_${idx}_counted_qty`]}
                              placeholder="Enter counted qty"
                              fullWidth
                              disabled={!isEditable}
                              sx={inputStyle}
                              InputProps={{
                                inputProps: { min: 0, step: 0.01 },
                                sx: { fontSize: '0.75rem' }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {count.variance !== undefined && count.variance !== 0 ? (
                              <Chip
                                label={`${getVarianceIcon(count.variance)} ${Math.abs(count.variance)}`}
                                size="small"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 22,
                                  bgcolor: `${getVarianceColor(count.variance)}20`,
                                  color: getVarianceColor(count.variance),
                                  fontWeight: 600
                                }}
                              />
                            ) : (
                              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                                0
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={count.remarks || ''}
                              onChange={(e) => handleCountChange(idx, 'remarks', e.target.value)}
                              placeholder="Add remarks (optional)"
                              fullWidth
                              disabled={!isEditable}
                              multiline
                              rows={1}
                              sx={inputStyle}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {counts.length > 0 && (
                <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem' }}>
                    <strong>Note:</strong> Enter the physical counted quantity for each item. Variance will be calculated automatically.
                    Only PSVs in "Initiated" or "In Progress" status can be edited.
                  </Typography>
                </Alert>
              )}
            </Paper>
            
            {/* Variance Threshold Alert */}
            {psvData && psvData.variance_threshold_percent && psvData.variance_threshold_amount && (
              <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem' }}>
                  <strong>Variance Thresholds:</strong> {psvData.variance_threshold_percent}% or {formatCurrency(psvData.variance_threshold_amount)} 
                  {" - Variances exceeding these thresholds will require management approval."}
                </Typography>
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: "0.7rem",
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>

        {isEditable && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !isEditable}
            startIcon={!loading && <SaveIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.primary,
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: COLORS.primaryDark }
            }}
          >
            {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Save Counts"}
          </Button>
        )}
        
        {!isEditable && psvData && (
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              borderColor: COLORS.border,
              color: COLORS.text.secondary,
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditPSV;