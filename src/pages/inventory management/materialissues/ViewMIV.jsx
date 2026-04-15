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
  Warehouse as WarehouseIcon,
  Inventory as InventoryIcon
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

const ViewMIV = ({ open, onClose, data: propData, mivId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mivData, setMivData] = useState(null);

  // Always fetch fresh data when opening to get populated references
  useEffect(() => {
    if (open) {
      const idToFetch = propData?._id || mivId;
      if (idToFetch) {
        fetchMIVById(idToFetch);
      } else {
        setError("No MIV ID provided");
      }
    }
  }, [open, propData, mivId]);

  const fetchMIVById = async (id) => {
    if (!id) {
      setError("Invalid MIV ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${BASE_URL}/api/miv/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        setMivData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch MIV details");
      }
    } catch (err) {
      console.error("Error fetching MIV:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to fetch MIV details";
        
        if (err.response.status === 404) {
          setError("MIV not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to view this MIV");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while fetching MIV details");
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
      Issued: { color: '#059669', bg: '#D1FAE5', label: 'Issued' },
      Cancelled: { color: '#DC2626', bg: '#FEE2E2', label: 'Cancelled' },
      'Partially Returned': { color: '#F59E0B', bg: '#FEF3C7', label: 'Partially Returned' }
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

  // Helper to safely get person name from populated object
  const getPersonName = (person) => {
    if (!person) return '-';
    if (typeof person === 'object') {
      if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
      if (person.FirstName) return person.FirstName;
      if (person.Username) return person.Username;
      if (person.Email) return person.Email;
      if (person.name) return person.name;
      return '-';
    }
    return person;
  };

  // Helper to get warehouse name from populated object
  const getWarehouseName = (warehouse) => {
    if (!warehouse) return '-';
    if (typeof warehouse === 'object') {
      return warehouse.warehouse_name || warehouse.name || '-';
    }
    return warehouse;
  };

  // Helper to get bin name from populated object
  const getBinName = (bin) => {
    if (!bin) return '-';
    if (typeof bin === 'object') {
      return bin.bin_code || bin.bin_id || '-';
    }
    return bin;
  };

  // Helper to get department name from populated object
  const getDepartmentName = (dept) => {
    if (!dept) return '-';
    if (typeof dept === 'object') {
      return dept.DepartmentName || dept.name || '-';
    }
    return dept;
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
            Material Issue Voucher Details
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
              Loading MIV details...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ borderRadius: 1.5 }}
            action={
              <Button color="inherit" size="small" onClick={() => fetchMIVById(propData?._id || mivId)}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : mivData ? (
          <Stack spacing={3}>
            {/* Header Section with MIV Number and Status */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  MIV NUMBER
                </Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: COLORS.primary }}>
                  {mivData.miv_number || mivData._id?.slice(-8)}
                </Typography>
              </Box>
              <Box>
                {getStatusChip(mivData.status)}
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
                    {formatDate(mivData.miv_date || mivData.createdAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>WORK ORDER</Typography>
                  <Typography sx={valueStyle}>
                    {mivData.wo_number || mivData.wo_id?.wo_number || '-'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>DEPARTMENT</Typography>
                  <Typography sx={valueStyle}>
                    {getDepartmentName(mivData.department)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>SO NUMBER</Typography>
                  <Typography sx={valueStyle}>
                    {mivData.so_number || '-'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>CUSTOMER</Typography>
                  <Typography sx={valueStyle}>
                    {mivData.customer_name || '-'}
                  </Typography>
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
                  <Typography sx={labelStyle}>ISSUED BY</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {getPersonName(mivData.issued_by)}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>RECEIVED BY</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {getPersonName(mivData.received_by)}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>AUTHORISED BY</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                    <Typography sx={valueStyle}>
                      {getPersonName(mivData.authorised_by)}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Items Table */}
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                MATERIAL ITEMS
              </Typography>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Item Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Quantity</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Warehouse</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Bin</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Batch No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Heat No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Cost</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(mivData.items || []).map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>
                          {item.item_description || item.description || item.part_no || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>
                          {item.part_no || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                          {item.issued_qty || item.quantity || 0}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>
                          {item.unit || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <WarehouseIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem' }}>
                              {getWarehouseName(item.warehouse_id)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <InventoryIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem' }}>
                              {getBinName(item.bin_id)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>
                          {item.batch_no || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>
                          {item.heat_no || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                          {formatCurrency(item.unit_cost || 0)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                          {formatCurrency((item.issued_qty || 0) * (item.unit_cost || 0))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

          

            {/* Remarks */}
            {mivData.remarks && (
              <Box>
                <Typography sx={labelStyle}>REMARKS</Typography>
                <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                    {mivData.remarks}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* FIFO Summary (if available) */}
            {mivData.fifo_summary && mivData.fifo_summary.length > 0 && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                  FIFO BATCH SUMMARY
                </Typography>
                
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Batches Used</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total Quantity</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total Cost</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Average Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mivData.fifo_summary.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="center">{item.batches_used || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.total_quantity || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.total_cost)}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.average_cost)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>
            No MIV data available
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

export default ViewMIV;