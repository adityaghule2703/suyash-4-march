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
  LinearProgress,
  Tooltip
} from "@mui/material";
import {
  Close,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Warehouse as WarehouseIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon
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

// Status configuration based on schema enum
const getStatusConfig = (status) => {
  const statusConfig = {
    'Initiated': { 
      color: '#D97706', 
      bg: '#FEF3C7', 
      label: 'Initiated',
      icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />
    },
    'In Progress': { 
      color: '#0284C7', 
      bg: '#E0F2FE', 
      label: 'In Progress',
      icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />
    },
    'Count Completed': { 
      color: '#2563EB', 
      bg: '#DBEAFE', 
      label: 'Count Completed',
      icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />
    },
    'Under Review': { 
      color: '#9333EA', 
      bg: '#F3E8FF', 
      label: 'Under Review',
      icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />
    },
    'Adjusted': { 
      color: '#059669', 
      bg: '#D1FAE5', 
      label: 'Adjusted',
      icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />
    },
    'Approved': { 
      color: '#059669', 
      bg: '#D1FAE5', 
      label: 'Approved',
      icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />
    },
    'Closed': { 
      color: '#475569', 
      bg: '#F1F5F9', 
      label: 'Closed',
      icon: <CancelIcon sx={{ fontSize: '0.7rem' }} />
    }
  };
  return statusConfig[status] || statusConfig['Initiated'];
};

// Verification type colors
const getVerificationTypeConfig = (type) => {
  const config = {
    'Full Count': { bg: '#D1FAE5', color: '#059669', label: 'Full Count' },
    'Cycle Count': { bg: '#DBEAFE', color: '#2563EB', label: 'Cycle Count' },
    'Spot Check': { bg: '#FEF3C7', color: '#D97706', label: 'Spot Check' },
    'Pre-Audit Count': { bg: '#F3E8FF', color: '#9333EA', label: 'Pre-Audit Count' }
  };
  return config[type] || { bg: '#F1F5F9', color: '#475569', label: type || '-' };
};

// Action configuration
const getActionConfig = (action) => {
  const config = {
    'Adjust Up': { bg: '#D1FAE5', color: '#059669', label: 'Adjust Up', icon: <TrendingUpIcon sx={{ fontSize: '0.7rem' }} /> },
    'Adjust Down': { bg: '#FEF3C7', color: '#D97706', label: 'Adjust Down', icon: <TrendingDownIcon sx={{ fontSize: '0.7rem' }} /> },
    'No Action': { bg: '#F1F5F9', color: '#475569', label: 'No Action', icon: null },
    'Write Off': { bg: '#FEE2E2', color: '#DC2626', label: 'Write Off', icon: null },
    'Investigate Further': { bg: '#FFE4E6', color: '#E11D48', label: 'Investigate Further', icon: null }
  };
  return config[action] || { bg: '#F1F5F9', color: '#475569', label: action || '-', icon: null };
};

const ViewPSV = ({ open, onClose, data: propData, psvId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [psvData, setPsvData] = useState(null);

  useEffect(() => {
    if (open) {
      const idToFetch = propData?._id || psvId;
      if (idToFetch) {
        fetchPSVById(idToFetch);
      } else {
        setError("No PSV ID provided");
      }
    }
  }, [open, propData, psvId]);

  const fetchPSVById = async (id) => {
    if (!id) {
      setError("Invalid PSV ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${BASE_URL}/api/physical-verifications/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        setPsvData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch PSV details");
      }
    } catch (err) {
      console.error("Error fetching PSV:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to fetch PSV details";
        
        if (err.response.status === 404) {
          setError("Physical Stock Verification not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to view this PSV");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while fetching PSV details");
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateOnly = (dateString) => {
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
      return warehouse.warehouse_name || warehouse.name || warehouse.warehouse_id || '-';
    }
    return warehouse;
  };

  const getItemCode = (item) => {
    if (item.item_code) return item.item_code;
    if (item.part_no) return item.part_no;
    return '-';
  };

  const getItemDescription = (item) => {
    if (item.description) return item.description;
    if (item.item_description) return item.item_description;
    return '-';
  };

  const getVarianceStatus = (variance) => {
    if (variance === 0) {
      return <Chip label="No Variance" size="small" sx={{ fontSize: '0.65rem', height: 22, bgcolor: '#D1FAE5', color: '#059669' }} />;
    } else if (variance > 0) {
      return <Chip label="Positive Variance" size="small" sx={{ fontSize: '0.65rem', height: 22, bgcolor: '#FEF3C7', color: '#D97706' }} />;
    } else {
      return <Chip label="Negative Variance" size="small" sx={{ fontSize: '0.65rem', height: 22, bgcolor: '#FEE2E2', color: '#DC2626' }} />;
    }
  };

  const statusConfig = psvData ? getStatusConfig(psvData.status) : null;
  const verificationConfig = psvData ? getVerificationTypeConfig(psvData.verification_type) : null;
  const actionConfig = psvData ? getActionConfig(psvData.action) : null;

  if (!open) return null;

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
          <ViewIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Physical Stock Verification Details
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.875rem', color: COLORS.text.secondary }}>
              Loading PSV details...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ borderRadius: 1.5 }}
            action={
              <Button color="inherit" size="small" onClick={() => fetchPSVById(propData?._id || psvId)}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : psvData ? (
          <Stack spacing={3}>
            {/* Header Section with PSV Number and Status */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  VERIFICATION NUMBER
                </Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: COLORS.primary }}>
                  {psvData.verification_id || psvData.verification_number || psvData._id?.slice(-8)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {statusConfig && (
                  <Chip 
                    icon={statusConfig.icon}
                    label={statusConfig.label} 
                    size="medium" 
                    sx={{ 
                      fontSize: '0.75rem', 
                      height: 28, 
                      bgcolor: statusConfig.bg, 
                      color: statusConfig.color, 
                      fontWeight: 600 
                    }} 
                  />
                )}
                {psvData.requires_management_approval && (
                  <Chip 
                    label="Requires Approval" 
                    size="medium" 
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 28, 
                      bgcolor: '#FEF3C7', 
                      color: '#D97706', 
                      fontWeight: 600 
                    }} 
                  />
                )}
              </Stack>
            </Box>

            <Divider />

            {/* Basic Information Section */}
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                BASIC INFORMATION
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>VERIFICATION DATE</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ScheduleIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {formatDate(psvData.verification_date)}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>FREEZE DATE & TIME</Typography>
                  <Typography sx={valueStyle}>
                    {formatDate(psvData.freeze_datetime)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>WAREHOUSE</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WarehouseIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {getWarehouseName(psvData.warehouse_id)}
                    </Typography>
                  </Stack>
                  {psvData.warehouse_id?.location && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <LocationIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        {psvData.warehouse_id.location}
                      </Typography>
                    </Stack>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>VERIFICATION TYPE</Typography>
                  {verificationConfig && (
                    <Chip 
                      label={verificationConfig.label} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24, 
                        bgcolor: verificationConfig.bg, 
                        color: verificationConfig.color, 
                        fontWeight: 500 
                      }} 
                    />
                  )}
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Personnel Information */}
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                PERSONNEL DETAILS
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>CONDUCTED BY</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {getPersonName(psvData.conducted_by)}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>WITNESS</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {getPersonName(psvData.witness) || 'Not specified'}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Variance Thresholds */}
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                VARIANCE THRESHOLDS
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PercentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                      <Box>
                        <Typography sx={labelStyle}>PERCENTAGE THRESHOLD</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: COLORS.primary }}>
                          {psvData.variance_threshold_percent || 0}%
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MoneyIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                      <Box>
                        <Typography sx={labelStyle}>AMOUNT THRESHOLD</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: COLORS.primary }}>
                          {formatCurrency(psvData.variance_threshold_amount)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Action Configuration */}
            {psvData.action && psvData.action !== 'No Action' && (
              <>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                    DEFAULT ACTION
                  </Typography>
                  
                  {actionConfig && (
                    <Chip 
                      icon={actionConfig.icon}
                      label={actionConfig.label} 
                      size="medium" 
                      sx={{ 
                        fontSize: '0.75rem', 
                        height: 28, 
                        bgcolor: actionConfig.bg, 
                        color: actionConfig.color, 
                        fontWeight: 600 
                      }} 
                    />
                  )}
                </Box>
                <Divider />
              </>
            )}

            {/* Summary Statistics */}
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                VERIFICATION SUMMARY
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Total Items
                    </Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {psvData.items?.length || 0}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Items Counted
                    </Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {psvData.total_items_counted || 0}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Items with Variance
                    </Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: psvData.items_with_variance > 0 ? '#D97706' : '#059669' }}>
                      {psvData.items_with_variance || 0}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Completion
                    </Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {psvData.completion_percentage || 0}%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Completion Progress */}
            {psvData.completion_percentage !== undefined && psvData.completion_percentage > 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={labelStyle}>COMPLETION PROGRESS</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                    {psvData.completion_percentage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={psvData.completion_percentage} 
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
            )}

            {/* Variance Summary Cards */}
            {(psvData.total_variance_value !== 0 || psvData.net_variance_value !== 0) && (
              <>
                <Divider />
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                    VARIANCE VALUES
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 1.5, bgcolor: COLORS.background.warning, borderRadius: 2 }}>
                        <Typography sx={labelStyle}>TOTAL VARIANCE VALUE</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#D97706' }}>
                          {formatCurrency(psvData.total_variance_value)}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                        <Typography sx={labelStyle}>NET VARIANCE VALUE</Typography>
                        <Typography sx={{ 
                          fontSize: '0.875rem', 
                          fontWeight: 700, 
                          color: psvData.net_variance_value > 0 ? '#D97706' : psvData.net_variance_value < 0 ? '#DC2626' : '#059669'
                        }}>
                          {formatCurrency(psvData.net_variance_value)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}

            {/* Items Table */}
            {psvData.items && psvData.items.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                    ITEMS TO BE VERIFIED
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.light }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Item Code / Part No</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">System Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit Cost</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Batch No</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Bin</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {psvData.items.map((item, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                              {getItemCode(item)}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>
                              {getItemDescription(item)}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                              <Typography sx={{ fontWeight: 600, color: COLORS.primary }}>
                                {item.system_qty || 0}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>
                              {formatCurrency(item.unit_cost)}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>
                              {item.batch_no || '-'}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>
                              {item.bin_id || '-'}
                            </TableCell>
                            <TableCell>
                              {item.action && item.action !== 'No Action' && (
                                <Chip 
                                  label={item.action} 
                                  size="small"
                                  sx={{ fontSize: '0.6rem', height: 20 }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )}

            {/* No Items Message */}
            {(!psvData.items || psvData.items.length === 0) && (
              <Alert severity="info" sx={{ borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  No items have been added to this verification yet.
                </Typography>
              </Alert>
            )}

            {/* Adjustment Transactions */}
            {psvData.adjustment_txn_ids && psvData.adjustment_txn_ids.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                    ADJUSTMENT TRANSACTIONS
                  </Typography>
                  
                  <Stack spacing={1}>
                    {psvData.adjustment_txn_ids.map((txn, idx) => (
                      <Paper key={idx} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ReceiptIcon sx={{ fontSize: '0.875rem', color: COLORS.primary }} />
                          <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            {typeof txn === 'object' ? (txn.transaction_id || txn._id) : txn}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </>
            )}

            {/* Remarks */}
            {psvData.remarks && (
              <Box>
                <Typography sx={labelStyle}>REMARKS</Typography>
                <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                    {psvData.remarks}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Approval Remarks */}
            {psvData.approval_remarks && (
              <Box>
                <Typography sx={labelStyle}>APPROVAL REMARKS</Typography>
                <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                    {psvData.approval_remarks}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Timestamps */}
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>CREATED AT</Typography>
                  <Typography sx={valueStyle}>
                    {formatDate(psvData.createdAt)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                    By: {getPersonName(psvData.created_by)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>LAST UPDATED</Typography>
                  <Typography sx={valueStyle}>
                    {formatDate(psvData.updatedAt)}
                  </Typography>
                </Grid>

                {psvData.approved_at && (
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>APPROVED AT</Typography>
                    <Typography sx={valueStyle}>
                      {formatDate(psvData.approved_at)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                      By: {getPersonName(psvData.approved_by)}
                    </Typography>
                  </Grid>
                )}

                {psvData.completed_at && (
                  <Grid item xs={12} md={4}>
                    <Typography sx={labelStyle}>COMPLETED AT</Typography>
                    <Typography sx={valueStyle}>
                      {formatDate(psvData.completed_at)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>
            No PSV data available
          </Alert>
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
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: "0.7rem",
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPSV;