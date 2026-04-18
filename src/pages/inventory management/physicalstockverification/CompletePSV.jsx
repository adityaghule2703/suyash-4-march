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
  Tooltip,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  Close,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
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

const CompletePSV = ({ open, onClose, data, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [psvData, setPsvData] = useState(null);
  const [items, setItems] = useState([]);
  const [thirdCounts, setThirdCounts] = useState([]);
  const [showThirdCounts, setShowThirdCounts] = useState(false);
  const [completionResult, setCompletionResult] = useState(null);

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
        
        // Initialize third counts from items or existing counts
        if (response.data.data.items && response.data.data.items.length > 0) {
          const initialThirdCounts = response.data.data.items.map(item => ({
            item_id: item.item_id?._id || item.item_id,
            item_code: item.item_code,
            description: item.description,
            system_quantity: item.system_quantity || 0,
            first_count: item.physical_quantity || 0,
            second_count: item.second_count || 0,
            third_count: item.third_count || 0,
            variance: item.variance || 0,
            unit: item.unit
          }));
          setItems(initialThirdCounts);
          setThirdCounts(initialThirdCounts.map(item => ({
            item_id: item.item_id,
            counted_qty: item.third_count || 0
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

  const handleThirdCountChange = (index, value) => {
    const updatedThirdCounts = [...thirdCounts];
    const updatedItems = [...items];
    
    const newCount = Number(value) || 0;
    updatedThirdCounts[index].counted_qty = newCount;
    updatedItems[index].third_count = newCount;
    
    setThirdCounts(updatedThirdCounts);
    setItems(updatedItems);
  };

  const validateThirdCounts = () => {
    const missingCounts = thirdCounts.filter(count => 
      count.counted_qty === undefined || 
      count.counted_qty === null || 
      count.counted_qty === ''
    );
    
    if (missingCounts.length > 0) {
      setError(`Please enter third count for ${missingCounts.length} item(s)`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateThirdCounts()) return;
    if (!psvData || !psvData._id) {
      setError("Invalid PSV data");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare third counts payload
      const countsPayload = thirdCounts
        .filter(count => count.item_id && count.counted_qty !== undefined && count.counted_qty !== null)
        .map(count => ({
          item_id: count.item_id,
          counted_qty: Number(count.counted_qty)
        }));
      
      if (countsPayload.length === 0) {
        setError("At least one third count is required");
        setLoading(false);
        return;
      }
      
      const payload = {
        third_counts: countsPayload
      };
      
      const response = await axios.post(`${BASE_URL}/api/physical-verifications/${psvData._id}/complete`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        setCompletionResult(response.data.data);
        if (onComplete) {
          onComplete(response.data.data);
        }
        // Close after 2 seconds to show success message
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to complete PSV');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to complete PSV';
        
        if (err.response.status === 400) {
          setError(`Validation error: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("PSV not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to complete this PSV");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'An error occurred while completing PSV');
      }
    } finally { 
      setLoading(false); 
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

  const canComplete = psvData?.status === 'In Progress' || psvData?.status === 'Initiated';

  return (
    <Dialog
      open={open}
      onClose={!loading && !completionResult ? onClose : undefined}
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
          <AssessmentIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Complete Physical Verification - {psvData?.verification_id || psvData?.verification_number || 'PSV'}
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
        ) : completionResult ? (
          // Success Result View
          <Stack spacing={3}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {completionResult.message || "Counting completed successfully!"}
              </Typography>
            </Alert>

            <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.success }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#059669', mb: 2, letterSpacing: '0.5px' }}>
                COMPLETION SUMMARY
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography sx={labelStyle}>VERIFICATION ID</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'monospace', color: COLORS.primary }}>
                        {completionResult.verification_id}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography sx={labelStyle}>TOTAL VARIANCE VALUE</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.primary }}>
                        {formatCurrency(completionResult.total_variance_value)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography sx={labelStyle}>NET VARIANCE VALUE</Typography>
                      <Typography sx={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 600, 
                        color: completionResult.net_variance_value > 0 ? '#D97706' : completionResult.net_variance_value < 0 ? '#DC2626' : '#059669'
                      }}>
                        {formatCurrency(completionResult.net_variance_value)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography sx={labelStyle}>ITEMS WITH VARIANCE</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.primary }}>
                        {completionResult.items_with_variance || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography sx={labelStyle}>STATUS</Typography>
                      <Chip 
                        label={completionResult.status || 'Count Completed'} 
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 24, 
                          bgcolor: '#DBEAFE', 
                          color: '#2563EB',
                          fontWeight: 600
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
                {/* <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography sx={labelStyle}>NEXT STEP</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                        {completionResult.next_step || 'Investigate variances, then approve'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid> */}
              </Grid>
            </Paper>

            {/* High Variance Items */}
            {completionResult.high_variance_items && completionResult.high_variance_items.length > 0 && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#DC2626', mb: 2, letterSpacing: '0.5px' }}>
                  HIGH VARIANCE ITEMS (Requires Investigation)
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#FEE2E2' }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Item Code</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Variance</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {completionResult.high_variance_items.map((item, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{item.item_code || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.description || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            <Chip 
                              icon={getVarianceIcon(item.variance)}
                              label={Math.abs(item.variance || 0)}
                              size="small"
                              sx={{ fontSize: '0.65rem', height: 22, bgcolor: getVarianceColor(item.variance) + '20', color: getVarianceColor(item.variance) }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {!canComplete && psvData && (
              <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  <strong>Cannot Complete:</strong> This PSV is in "{psvData.status}" status. 
                  Only PSVs in "Initiated" or "In Progress" status can be completed.
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
                      {psvData.warehouse_name || psvData.warehouse_id?.warehouse_name || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>VERIFICATION TYPE</Typography>
                    <Chip 
                      label={psvData.verification_type} 
                      size="small"
                      sx={{ fontSize: '0.7rem', height: 24, bgcolor: COLORS.primaryLight, color: COLORS.primary }} 
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Third Counts Table */}
            <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, letterSpacing: '0.5px' }}>
                  THIRD COUNT VERIFICATION
                </Typography>
                <Tooltip title="Enter third count for verification">
                  <Chip 
                    icon={<EditIcon sx={{ fontSize: '0.7rem' }} />}
                    label="Third Count Required" 
                    size="small"
                    sx={{ fontSize: '0.65rem', height: 24, bgcolor: COLORS.info, color: '#0284C7' }}
                  />
                </Tooltip>
              </Stack>
              
              <Alert severity="info" sx={{ mb: 2, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem' }}>
                  <strong>Third Count Verification:</strong> Enter the third count for each item to verify the previous counts.
                  This will complete the counting process and calculate final variances.
                </Typography>
              </Alert>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 50 }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Item Code</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">System Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">First Count</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Second Count</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }} align="right">Third Count*</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Current Variance</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Unit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                            No items found for this verification
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
                            <Typography sx={{ fontSize: '0.75rem' }}>
                              {item.second_count || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={item.third_count === 0 ? '' : item.third_count}
                              onChange={(e) => handleThirdCountChange(idx, e.target.value)}
                              placeholder="Enter third count"
                              fullWidth
                              disabled={!canComplete || loading}
                              sx={inputStyle}
                              InputProps={{
                                inputProps: { min: 0, step: 0.01 },
                                sx: { fontSize: '0.75rem' }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {item.variance !== 0 ? (
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
                            ) : (
                              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                                0
                              </Typography>
                            )}
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

            {/* Warning Note */}
            <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem' }}>
                <strong>Important:</strong> Once completed, counts will be finalized and variances calculated.
                This action cannot be undone. Make sure all third counts are accurate before proceeding.
              </Typography>
            </Alert>
          </Stack>
        )}
      </DialogContent>

      {/* ACTIONS */}
      {!completionResult && (
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

          {canComplete && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !canComplete}
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
              {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Complete Verification"}
            </Button>
          )}
          
          {!canComplete && psvData && (
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

      {completionResult && (
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

// Input style for filters
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

export default CompletePSV;