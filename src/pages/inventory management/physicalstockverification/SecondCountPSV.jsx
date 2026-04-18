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
  Tooltip
} from "@mui/material";
import {
  Close,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
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

const SecondCountPSV = ({ open, onClose, data, onSecondCountComplete }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [psvData, setPsvData] = useState(null);
  const [items, setItems] = useState([]);
  const [secondCounts, setSecondCounts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (open && data) {
      fetchPSVDetails();
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
        
        // Initialize items that need second count (items with variance exceeding threshold)
        if (response.data.data.items && response.data.data.items.length > 0) {
          const thresholdPercent = response.data.data.variance_threshold_percent || 5;
          const thresholdAmount = response.data.data.variance_threshold_amount || 1000;
          
          // Filter items that need second count (variance exceeds thresholds)
          const itemsNeedingSecondCount = response.data.data.items.filter(item => {
            const variance = Math.abs(item.variance || 0);
            const variancePercent = item.system_quantity > 0 ? (variance / item.system_quantity) * 100 : 0;
            const varianceValue = variance * (item.unit_cost || 0);
            
            return variancePercent > thresholdPercent || varianceValue > thresholdAmount;
          });
          
          setItems(itemsNeedingSecondCount);
          setSecondCounts(itemsNeedingSecondCount.map(item => ({
            item_id: item.item_id?._id || item.item_id,
            item_code: item.item_code,
            description: item.description,
            system_quantity: item.system_quantity || 0,
            first_count: item.physical_quantity || 0,
            second_count: 0,
            variance: item.variance || 0,
            unit: item.unit,
            remarks: ""
          })));
        }
      }
    } catch (err) {
      console.error('Error fetching PSV details:', err);
      setError('Failed to load PSV details');
    } finally {
      setFetching(false);
    }
  };

  const handleSecondCountChange = (index, field, value) => {
    const updatedSecondCounts = [...secondCounts];
    const updatedItems = [...items];
    
    if (field === 'counted_qty') {
      const newCount = Number(value) || 0;
      updatedSecondCounts[index].second_count = newCount;
      updatedItems[index].second_count = newCount;
      
      // Calculate new variance based on second count
      const systemQty = updatedSecondCounts[index].system_quantity || 0;
      const newVariance = newCount - systemQty;
      updatedSecondCounts[index].variance = newVariance;
      updatedItems[index].variance = newVariance;
    } else if (field === 'remarks') {
      updatedSecondCounts[index].remarks = value;
      updatedItems[index].remarks = value;
    }
    
    setSecondCounts(updatedSecondCounts);
    setItems(updatedItems);
  };

  const validateSecondCounts = () => {
    const missingCounts = secondCounts.filter(count => 
      count.second_count === undefined || 
      count.second_count === null || 
      count.second_count === ''
    );
    
    if (missingCounts.length > 0) {
      setError(`Please enter second count for ${missingCounts.length} item(s)`);
      return false;
    }
    
    const negativeCounts = secondCounts.filter(count => count.second_count < 0);
    if (negativeCounts.length > 0) {
      setError("Second count cannot be negative");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateSecondCounts()) return;
    if (!psvData || !psvData._id) {
      setError("Invalid PSV data");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare second counts payload
      const countsPayload = secondCounts
        .filter(count => count.item_id && count.second_count !== undefined && count.second_count !== null)
        .map(count => ({
          item_id: count.item_id,
          counted_qty: Number(count.second_count),
          remarks: count.remarks || ""
        }));
      
      if (countsPayload.length === 0) {
        setError("At least one second count is required");
        setLoading(false);
        return;
      }
      
      const payload = {
        counts: countsPayload
      };
      
      const response = await axios.put(`${BASE_URL}/api/physical-verifications/${psvData._id}/second-counts`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        setSuccessMessage(response.data.message || "Second counts entered successfully!");
        if (onSecondCountComplete) {
          onSecondCountComplete(response.data.data);
        }
        // Close after 2 seconds to show success message
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to enter second counts');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to enter second counts';
        
        if (err.response.status === 400) {
          setError(`Validation error: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("PSV not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to enter second counts");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'An error occurred while entering second counts');
      }
    } finally { 
      setLoading(false); 
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
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

  const canEnterSecondCount = psvData?.status === 'In Progress';

  return (
    <Dialog
      open={open}
      onClose={!loading && !successMessage ? onClose : undefined}
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
          <WarningIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Second Count Verification - {psvData?.verification_id || psvData?.verification_number || 'PSV'}
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
        ) : successMessage ? (
          // Success Result View
          <Stack spacing={3}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {successMessage}
              </Typography>
            </Alert>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: '4rem', color: '#059669' }} />
              <Typography sx={{ mt: 2, fontSize: '0.875rem', color: COLORS.text.secondary }}>
                Second counts have been recorded successfully.
                {psvData?.status === 'In Progress' && ' You can now complete the counting process.'}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {!canEnterSecondCount && psvData && (
              <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  <strong>Cannot Enter Second Count:</strong> This PSV is in "{psvData.status}" status. 
                  Only PSVs in "In Progress" status can have second counts entered.
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
                    <Typography sx={labelStyle}>CONDUCTED BY</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {getPersonName(psvData.conducted_by)}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Info Alert */}
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem' }}>
                <strong>Second Count Required:</strong> The following items have variances exceeding the threshold 
                ({psvData?.variance_threshold_percent}% or ₹{psvData?.variance_threshold_amount?.toLocaleString()}). 
                A second count by a different person is required to verify these variances.
              </Typography>
            </Alert>

            {/* Items Table for Second Count */}
            <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                ITEMS REQUIRING SECOND COUNT
              </Typography>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 50 }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Item Code</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">System Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">First Count</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }} align="right">First Variance</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }} align="right">Second Count*</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }} align="right">New Variance</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Remarks</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Unit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                            No items require second count. All variances are within threshold.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, idx) => (
                        <TableRow key={item.item_id || idx} hover>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, fontFamily: 'monospace' }}>
                              {item.item_code || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: '0.75rem' }}>
                              {item.description || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {item.system_quantity || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontSize: '0.75rem' }}>
                              {item.first_count || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              icon={getVarianceIcon(item.variance)}
                              label={Math.abs(item.variance)}
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
                            <TextField
                              type="number"
                              size="small"
                              value={secondCounts[idx]?.second_count === 0 ? '' : secondCounts[idx]?.second_count}
                              onChange={(e) => handleSecondCountChange(idx, 'counted_qty', e.target.value)}
                              placeholder="Enter second count"
                              fullWidth
                              disabled={!canEnterSecondCount || loading}
                              sx={inputStyle}
                              InputProps={{
                                inputProps: { min: 0, step: 0.01 },
                                sx: { fontSize: '0.75rem' }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {secondCounts[idx]?.second_count > 0 && (
                              <Chip
                                icon={getVarianceIcon(secondCounts[idx]?.variance)}
                                label={Math.abs(secondCounts[idx]?.variance || 0)}
                                size="small"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 22,
                                  bgcolor: getVarianceColor(secondCounts[idx]?.variance) + '20',
                                  color: getVarianceColor(secondCounts[idx]?.variance)
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={secondCounts[idx]?.remarks || ''}
                              onChange={(e) => handleSecondCountChange(idx, 'remarks', e.target.value)}
                              placeholder="Add remarks (optional)"
                              fullWidth
                              disabled={!canEnterSecondCount || loading}
                              multiline
                              rows={1}
                              sx={inputStyle}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: '0.75rem' }}>
                              {item.unit || '-'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Note about third count */}
            <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem' }}>
                <strong>Note:</strong> If second count differs from first count, a third count may be required for resolution.
                After entering second counts, you can proceed to complete the counting process.
              </Typography>
            </Alert>
          </Stack>
        )}
      </DialogContent>

      {/* ACTIONS */}
      {!successMessage && (
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

          {canEnterSecondCount && items.length > 0 && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !canEnterSecondCount}
              startIcon={!loading && <CheckCircleIcon sx={{ fontSize: "1rem" }} />}
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
              {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Save Second Counts"}
            </Button>
          )}
          
          {!canEnterSecondCount && psvData && (
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
      )}

      {successMessage && (
        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          gap: 1
        }}>
          <Button
            variant="contained"
            onClick={onClose}
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
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default SecondCountPSV;