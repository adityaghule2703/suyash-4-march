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
  Grid
} from "@mui/material";
import {
  Close,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Warehouse as WarehouseIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// 🎨 SAME DESIGN SYSTEM
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
    light: "#F8FFFC"
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

const ViewMRV = ({ open, onClose, data: propData, mrvId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mrvData, setMrvData] = useState(null);

  useEffect(() => {
    if (open) {
      if (propData && propData._id) {
        // If data is passed directly from parent, use it
        setMrvData(propData);
        setError("");
        setLoading(false);
      } else if (mrvId) {
        // Fetch data by ID
        fetchMRVById();
      } else {
        setError("No MRV data provided");
      }
    }
  }, [open, propData, mrvId]);

  const fetchMRVById = async () => {
    if (!mrvId) {
      setError("Invalid MRV ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${BASE_URL}/api/mrv/${mrvId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        setMrvData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch MRV details");
      }
    } catch (err) {
      console.error("Error fetching MRV:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to fetch MRV details";
        
        if (err.response.status === 404) {
          setError("MRV not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to view this MRV");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while fetching MRV details");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0.00";
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

  const getStatusChip = (status) => {
    const statusConfig = {
      Draft: { color: '#D97706', bg: '#FEF3C7', label: 'Draft' },
      Posted: { color: '#059669', bg: '#D1FAE5', label: 'Posted' },
      Returned: { color: '#059669', bg: '#D1FAE5', label: 'Returned' },
      Cancelled: { color: '#DC2626', bg: '#FEE2E2', label: 'Cancelled' },
      Deleted: { color: '#DC2626', bg: '#FEE2E2', label: 'Deleted' }
    };
    const config = statusConfig[status] || statusConfig.Draft;
    return (
      <Chip 
        label={config.label} 
        size="small" 
        sx={{ 
          fontSize: '0.7rem', 
          height: 24, 
          bgcolor: config.bg, 
          color: config.color, 
          fontWeight: 600 
        }} 
      />
    );
  };

  const getConditionChip = (condition) => {
    const conditionConfig = {
      Good: { color: '#059669', bg: '#D1FAE5' },
      'Partially Damaged': { color: '#D97706', bg: '#FEF3C7' },
      Scrap: { color: '#DC2626', bg: '#FEE2E2' }
    };
    const config = conditionConfig[condition] || conditionConfig.Good;
    return (
      <Chip 
        label={condition || '-'} 
        size="small" 
        sx={{ 
          fontSize: '0.7rem', 
          height: 24, 
          bgcolor: config.bg, 
          color: config.color, 
          fontWeight: 600 
        }} 
      />
    );
  };

  const getPersonName = (person) => {
    if (!person) return '-';
    if (typeof person === 'object') {
      if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
      if (person.FirstName) return person.FirstName;
      if (person.Username) return person.Username;
      if (person.Email) return person.Email;
      if (person.name) return person.name;
      if (person.EmployeeID) return `${person.FirstName || ''} ${person.LastName || ''} (${person.EmployeeID})`.trim();
      return person._id?.slice(-6) || '-';
    }
    return person;
  };

  const getWarehouseName = (warehouse) => {
    if (!warehouse) return '-';
    if (typeof warehouse === 'object') {
      return warehouse.warehouse_name || warehouse.name || warehouse._id?.slice(-6) || '-';
    }
    return warehouse;
  };

  const getBinName = (bin) => {
    if (!bin) return '-';
    if (typeof bin === 'object') {
      return bin.bin_code || bin.bin_id || bin._id?.slice(-6) || '-';
    }
    return bin;
  };

  if (!open) return null;

  const displayData = mrvData;
  const summary = mrvData?.summary;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            Material Return Voucher Details
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
              Loading MRV details...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ borderRadius: 1.5 }}
            action={
              <Button color="inherit" size="small" onClick={fetchMRVById}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : displayData ? (
          <Stack spacing={3}>
            {/* Header Section with MRV Number and Status */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  MRV NUMBER
                </Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: COLORS.primary }}>
                  {displayData.mrv_number || displayData._id?.slice(-8)}
                </Typography>
              </Box>
              <Box>
                {getStatusChip(displayData.status)}
              </Box>
            </Box>

            <Divider />

            {/* Basic Information Section */}
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                BASIC INFORMATION
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>DATE</Typography>
                  <Typography sx={valueStyle}>
                    {formatDate(displayData.mrv_date || displayData.createdAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>MIV NUMBER</Typography>
                  <Typography sx={valueStyle}>
                    {displayData.miv_id?.miv_number || displayData.miv_number || '-'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>WORK ORDER</Typography>
                  <Typography sx={valueStyle}>
                    {displayData.wo_id?.wo_number || displayData.wo_number || '-'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>CONDITION</Typography>
                  {getConditionChip(displayData.condition)}
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
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>RETURNED BY</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {getPersonName(displayData.returned_by)}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>RECEIVED BY (STORE)</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {getPersonName(displayData.received_by) || 'Pending'}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>CREATED BY</Typography>
                  <Typography sx={valueStyle}>
                    {getPersonName(displayData.created_by)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Return Items Table */}
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                RETURN ITEMS
              </Typography>
              
              {!displayData.items || displayData.items.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 1.5 }}>
                  No items found for this MRV
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Item Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Returned Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Cost</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total Value</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Batch No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Warehouse</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Bin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(displayData.items || []).map((item, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            {item.item_description || item.itemDescription || '-'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            {item.part_no || item.item_part_no || '-'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            <Typography sx={{ fontWeight: 600, color: COLORS.primary }}>
                              {item.returned_qty || 0}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            {item.unit || item.item_unit || '-'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            {formatCurrency(item.unit_cost || 0)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                              {formatCurrency(item.total_value || 0)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            {item.batch_no || '-'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <WarehouseIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                              <Typography sx={{ fontSize: '0.7rem' }}>
                                {item.warehouse_name || getWarehouseName(item.warehouse_id) || '-'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            {item.bin_name || getBinName(item.bin_id) || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            {/* Summary Section */}
            {/* <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      RETURN SUMMARY
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Items:</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {summary?.total_items || displayData.items?.length || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Returned Quantity:</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {summary?.total_returned_qty || displayData.items?.reduce((sum, item) => sum + (item.returned_qty || 0), 0) || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Return Value:</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                          {formatCurrency(displayData.total_return_value)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      CREATION INFO
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Created By:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {getPersonName(displayData.created_by)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Created At:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {formatDate(displayData.createdAt)}
                        </Typography>
                      </Box>
                      {displayData.posted_at && (
                        <Box>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Posted At:</Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            {formatDate(displayData.posted_at)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box> */}

            {/* Remarks */}
            {displayData.remarks && (
              <Box>
                <Typography sx={labelStyle}>REMARKS</Typography>
                <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                    {displayData.remarks}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>
            No MRV data available
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

export default ViewMRV;