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
  TextField,
  InputAdornment,
  Tooltip,
  MenuItem
} from "@mui/material";
import {
  Close,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  Comment as CommentIcon,
  Save as SaveIcon,
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
    success: "#D1FAE5",
    info: "#E0F2FE"
  },
  border: "#E3E8EF"
};

const labelStyle = {
  fontSize: "0.65rem",
  fontWeight: 600,
  color: COLORS.text.secondary,
  letterSpacing: "0.5px",
  mb: 0.5
};

const valueStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: COLORS.text.primary
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    fontSize: '0.75rem',
    backgroundColor: COLORS.background.white,
    '&:hover fieldset': { borderColor: COLORS.primary },
    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
  },
  '& .MuiInputBase-input': {
    py: 1,
    px: 1.5,
    fontSize: '0.75rem',
    color: COLORS.text.primary
  }
};

// Action options
const ACTION_OPTIONS = ['Adjust Up', 'Adjust Down', 'No Action', 'Write Off', 'Investigate Further'];

// Action colors
const getActionColor = (action) => {
  const colors = {
    'Adjust Up': { bg: '#D1FAE5', color: '#059669' },
    'Adjust Down': { bg: '#FEF3C7', color: '#D97706' },
    'No Action': { bg: '#F1F5F9', color: '#475569' },
    'Write Off': { bg: '#FEE2E2', color: '#DC2626' },
    'Investigate Further': { bg: '#FFE4E6', color: '#E11D48' }
  };
  return colors[action] || { bg: '#F1F5F9', color: '#475569' };
};

const VarianceReasonPSV = ({ open, onClose, data, onVarianceReasonUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [psvData, setPsvData] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [formData, setFormData] = useState({
    variance_reason: "",
    action: "No Action"
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (open && data) {
      fetchPSVDetails();
      resetForm();
      setSelectedItem(null);
      setSelectedItemIndex(null);
      setUpdateSuccess(false);
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
        
        // Initialize items that have variance
        if (response.data.data.items && response.data.data.items.length > 0) {
          const varianceItems = response.data.data.items.filter(item => 
            item.variance !== 0 && item.variance !== undefined && item.variance !== null
          );
          setItems(varianceItems);
        }
      }
    } catch (err) {
      console.error('Error fetching PSV details:', err);
      setError('Failed to load PSV details');
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setFormData({
      variance_reason: "",
      action: "No Action"
    });
    setError("");
    setSuccess("");
  };

  const handleItemSelect = (item, index) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
    setFormData({
      variance_reason: item.variance_reason || "",
      action: item.action || "No Action"
    });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!selectedItem) {
      setError("Please select an item first");
      return;
    }
    
    if (!formData.variance_reason.trim()) {
      setError("Please enter a variance reason");
      return;
    }
    
    if (!psvData || !psvData._id) {
      setError("Invalid PSV data");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        variance_reason: formData.variance_reason,
        action: formData.action
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/physical-verifications/${psvData._id}/items/${selectedItem._id}/reason`, 
        payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        setSuccess("Variance reason updated successfully!");
        
        // Update local item data
        const updatedItems = [...items];
        updatedItems[selectedItemIndex] = {
          ...updatedItems[selectedItemIndex],
          variance_reason: formData.variance_reason,
          action: formData.action
        };
        setItems(updatedItems);
        
        if (onVarianceReasonUpdate) {
          onVarianceReasonUpdate(response.data.data);
        }
        
        // Show success message for 2 seconds then clear
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to update variance reason');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to update variance reason';
        
        if (err.response.status === 400) {
          setError(`Validation error: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("PSV or Item not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to update variance reason");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'An error occurred while updating variance reason');
      }
    } finally { 
      setLoading(false); 
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
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

  const getPersonName = (person) => {
    if (!person) return '-';
    if (typeof person === 'object') {
      if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
      if (person.FirstName) return person.FirstName;
      if (person.Username) return person.Username;
      if (person.Email) return person.Email;
      if (person.name) return person.name;
      return person._id?.slice(-6) || '-';
    }
    return person;
  };

  const getWarehouseName = (warehouse) => {
    if (!warehouse) return '-';
    if (typeof warehouse === 'object') {
      return warehouse.warehouse_name || warehouse.name || warehouse.warehouse_code || '-';
    }
    return warehouse;
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return '#D97706';
    if (variance < 0) return '#DC2626';
    return '#059669';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return <TrendingUpIcon sx={{ fontSize: '0.7rem' }} />;
    if (variance < 0) return <TrendingDownIcon sx={{ fontSize: '0.7rem' }} />;
    return null;
  };

  if (!data) return null;

  const canUpdateReason = psvData?.status === 'Count Completed' || psvData?.status === 'Under Review';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
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
          <CommentIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Update Variance Reasons - {psvData?.verification_id || psvData?.verification_number || 'PSV'}
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
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
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ borderRadius: 1.5 }} onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}

            {!canUpdateReason && psvData && (
              <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  <strong>Cannot Update Reasons:</strong> This PSV is in "{psvData.status}" status. 
                  Only PSVs in "Count Completed" or "Under Review" status can have variance reasons updated.
                </Typography>
              </Alert>
            )}

            {/* PSV Information Summary */}
            {psvData && (
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>VERIFICATION ID</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'monospace', color: COLORS.primary }}>
                      {psvData.verification_id || psvData.verification_number}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>WAREHOUSE</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {getWarehouseName(psvData.warehouse_id)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>STATUS</Typography>
                    <Chip 
                      label={psvData.status} 
                      size="small"
                      sx={{ fontSize: '0.7rem', height: 24 }} 
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Info Alert */}
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem' }}>
                <strong>Variance Reason Required:</strong> For each item with variance, please provide a reason 
                for the discrepancy and select the appropriate action to be taken.
              </Typography>
            </Alert>

            {/* Items with Variance Table */}
            <Paper sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, p: 2, pb: 0, letterSpacing: '0.5px' }}>
                ITEMS WITH VARIANCE
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 50 }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Item Code</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">System Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Physical Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Variance</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Variance Reason</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }}>Action</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 60, textAlign: 'center' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                            No items with variance found. All counts match system records.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, idx) => {
                        const actionColors = getActionColor(item.action || "No Action");
                        const isSelected = selectedItem?.item_id === item.item_id;
                        
                        return (
                          <TableRow 
                            key={item.item_id || idx} 
                            hover
                            selected={isSelected}
                            sx={{ 
                              cursor: 'pointer',
                              bgcolor: isSelected ? `${COLORS.primary}10` : 'inherit',
                              '&:hover': { bgcolor: COLORS.background.hover }
                            }}
                            onClick={() => handleItemSelect(item, idx)}
                          >
                            <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, fontFamily: 'monospace' }}>
                                {item.item_code || item.part_no || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: '0.75rem' }}>
                                {item.description || item.item_description || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                {item.system_qty || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography sx={{ fontSize: '0.75rem' }}>
                                {item.physical_quantity || item.physical_qty || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                icon={getVarianceIcon(item.variance)}
                                label={Math.abs(item.variance || 0)}
                                size="small"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 22,
                                  bgcolor: getVarianceColor(item.variance) + '20',
                                  color: getVarianceColor(item.variance)
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: '0.75rem' }}>
                                {item.unit || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ 
                                fontSize: '0.7rem', 
                                color: item.variance_reason ? COLORS.text.primary : COLORS.text.tertiary,
                                fontStyle: item.variance_reason ? 'normal' : 'italic'
                              }}>
                                {item.variance_reason || 'Not specified'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {item.action && item.action !== 'No Action' && (
                                <Chip 
                                  label={item.action} 
                                  size="small"
                                  sx={{ 
                                    fontSize: '0.6rem', 
                                    height: 20, 
                                    bgcolor: actionColors.bg, 
                                    color: actionColors.color 
                                  }} 
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {item.variance_reason ? (
                                <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />
                              ) : (
                                <WarningIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Edit Form - Show only when an item is selected */}
            {selectedItem && (
              <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                  EDIT VARIANCE REASON
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography sx={labelStyle}>
                      SELECTED ITEM
                    </Typography>
                    <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>
                          {selectedItem.item_code || selectedItem.part_no}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {selectedItem.description || selectedItem.item_description}
                        </Typography>
                        <Chip 
                          label={`Variance: ${selectedItem.variance}`}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem', 
                            height: 22,
                            bgcolor: getVarianceColor(selectedItem.variance) + '20',
                            color: getVarianceColor(selectedItem.variance)
                          }} 
                        />
                      </Stack>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography sx={labelStyle}>
                      VARIANCE REASON <span style={{ color: "#EF4444" }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="variance_reason"
                      value={formData.variance_reason}
                      onChange={handleChange}
                      size="small"
                      placeholder="Explain why there is a discrepancy between system and physical count..."
                      disabled={!canUpdateReason || loading}
                      sx={inputStyle}
                    />
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      Provide detailed reason for the variance (e.g., damaged goods, counting error, misplacement, etc.)
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography sx={labelStyle}>
                      ACTION TO TAKE
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      name="action"
                      value={formData.action}
                      onChange={handleChange}
                      disabled={!canUpdateReason || loading}
                      sx={inputStyle}
                    >
                      {ACTION_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      Select the action to be taken for this variance
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* No Item Selected Message */}
            {items.length > 0 && !selectedItem && (
              <Alert severity="info" sx={{ borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  Click on any item above to edit its variance reason and action.
                </Typography>
              </Alert>
            )}

            {/* Warning Note */}
            <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem' }}>
                <strong>Note:</strong> Variance reasons help in audit trail and root cause analysis. 
                Please provide accurate and detailed reasons for all variances. This information will be used 
                for management review and future process improvements.
              </Typography>
            </Alert>
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
          onClick={handleClose}
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

        {canUpdateReason && selectedItem && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !canUpdateReason || !formData.variance_reason.trim()}
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
            {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Save Variance Reason"}
          </Button>
        )}
        
        {!canUpdateReason && psvData && (
          <Button
            variant="outlined"
            onClick={handleClose}
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

export default VarianceReasonPSV;