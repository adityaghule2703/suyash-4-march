import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  Divider
} from "@mui/material";
import { 
  Close, 
  Warehouse as WarehouseIcon, 
  LocationOn, 
  Person, 
  Category,
  TrendingUp,
  CheckCircle,
  Cancel,
  ProductionQuantityLimits,
  AttachMoney,
  QrCode
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

const ViewWareHouse = ({ open, onClose, data }) => {
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch warehouse by ID
  const fetchWarehouse = async () => {
    if (!data?._id) return;
    
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/warehouses/${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setWarehouse(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch warehouse details');
      }
    } catch (err) {
      console.error("Error fetching warehouse:", err);
      setError(err.response?.data?.message || 'Failed to fetch warehouse details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && data?._id) {
      fetchWarehouse();
    }
  }, [open, data]);

  // Helper function to get manager name
  const getManagerName = () => {
    if (!warehouse?.manager_id) return 'Not Assigned';
    
    if (typeof warehouse.manager_id === 'object') {
      const manager = warehouse.manager_id;
      if (manager.FirstName && manager.LastName) {
        return `${manager.FirstName} ${manager.LastName}`;
      }
      if (manager.FirstName) return manager.FirstName;
      if (manager.LastName) return manager.LastName;
      if (manager.name) return manager.name;
      if (manager.employee_name) return manager.employee_name;
      if (manager.email) return manager.email;
      return 'Manager Assigned';
    }
    
    return 'Manager Assigned';
  };

  // Calculate utilization percentage color
  const getUtilizationColor = (percentage) => {
    const num = parseFloat(percentage);
    if (num >= 80) return '#EF4444';
    if (num >= 60) return '#F59E0B';
    return '#10B981';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <WarehouseIcon sx={{ color: COLORS.primary, fontSize: '1.3rem' }} />
          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: COLORS.text.primary
            }}
          >
            Warehouse Details
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1.5,
              '& .MuiAlert-icon': {
                fontSize: '1.25rem',
                alignItems: 'center'
              },
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
          </Alert>
        ) : warehouse ? (
          <Stack spacing={2.5}>
            {/* Basic Information Card */}
            <Paper 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: COLORS.text.secondary,
                  letterSpacing: '0.5px',
                  mb: 2,
                  pb: 0.5,
                  borderBottom: `1px solid ${COLORS.border}`
                }}
              >
                BASIC INFORMATION
              </Typography>

              {/* Header Row with Warehouse ID and Status */}
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 600, 
                        color: COLORS.text.secondary,
                        letterSpacing: '0.5px',
                        mb: 0.5
                      }}
                    >
                      WAREHOUSE ID
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        color: COLORS.primary,
                        fontFamily: 'monospace'
                      }}
                    >
                      {warehouse.warehouse_id || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={warehouse.is_active ? <CheckCircle sx={{ fontSize: '0.8rem' }} /> : <Cancel sx={{ fontSize: '0.8rem' }} />}
                      label={warehouse.is_active ? "Active" : "Inactive"}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 26,
                        bgcolor: warehouse.is_active ? COLORS.chips.active : COLORS.chips.inactive,
                        color: warehouse.is_active ? COLORS.primary : COLORS.text.secondary,
                        fontWeight: 600
                      }}
                    />
                    <Chip
                      label={`${warehouse.active_bins || 0}/${warehouse.total_bins || 0} Bins`}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 26,
                        bgcolor: COLORS.primaryLight,
                        color: COLORS.primary,
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Basic Info Fields */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 600, 
                        color: COLORS.text.secondary,
                        letterSpacing: '0.5px',
                        mb: 0.5
                      }}
                    >
                      WAREHOUSE NAME
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {warehouse.warehouse_name || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 600, 
                        color: COLORS.text.secondary,
                        letterSpacing: '0.5px',
                        mb: 0.5
                      }}
                    >
                      WAREHOUSE TYPE
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {warehouse.warehouse_type || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 600, 
                        color: COLORS.text.secondary,
                        letterSpacing: '0.5px',
                        mb: 0.5
                      }}
                    >
                      LOCATION
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {warehouse.location || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 600, 
                        color: COLORS.text.secondary,
                        letterSpacing: '0.5px',
                        mb: 0.5
                      }}
                    >
                      MANAGER
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {getManagerName()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Stock Summary Card */}
            <Paper 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: COLORS.text.secondary,
                  letterSpacing: '0.5px',
                  mb: 2,
                  pb: 0.5,
                  borderBottom: `1px solid ${COLORS.border}`
                }}
              >
                STOCK SUMMARY
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <ProductionQuantityLimits sx={{ fontSize: '1.5rem', color: COLORS.primary, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      TOTAL QUANTITY
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      {warehouse.total_stock_quantity?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <AttachMoney sx={{ fontSize: '1.5rem', color: COLORS.primary, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      TOTAL VALUE
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      ₹ {warehouse.total_stock_value?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <WarehouseIcon sx={{ fontSize: '1.5rem', color: COLORS.primary, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      TOTAL BINS
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      {warehouse.total_bins || 0}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <TrendingUp sx={{ fontSize: '1.5rem', color: '#10B981', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      ACTIVE BINS
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#10B981' }}>
                      {warehouse.active_bins || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Bins Table Card */}
            <Paper 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: COLORS.text.secondary,
                  letterSpacing: '0.5px',
                  mb: 2,
                  pb: 0.5,
                  borderBottom: `1px solid ${COLORS.border}`
                }}
              >
                BINS ({warehouse.bins?.length || 0})
              </Typography>

              {warehouse.bins && warehouse.bins.length > 0 ? (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Bin ID</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Code</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Rack</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }} align="center">Pos</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Capacity</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Stock</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }} align="center">Util%</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {warehouse.bins.map((bin, index) => {
                        const utilization = parseFloat(bin.utilization_percentage || 0);
                        return (
                          <TableRow 
                            key={bin._id || index} 
                            sx={{ 
                              '&:hover': { bgcolor: COLORS.background.hover },
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{bin.bin_id}</TableCell>
                            <TableCell>
                              <Chip
                                label={bin.bin_code}
                                size="small"
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 22,
                                  bgcolor: COLORS.primaryLight,
                                  color: COLORS.primary,
                                  fontWeight: 500
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }}>{bin.rack}</TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                              {bin.row},{bin.col}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              {bin.capacity?.toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              <Typography sx={{ fontWeight: 600, color: COLORS.primary }}>
                                {bin.current_stock?.quantity?.toLocaleString() || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ minWidth: 70 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={utilization}
                                  sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    mb: 0.5,
                                    bgcolor: COLORS.border,
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: getUtilizationColor(utilization),
                                      borderRadius: 2
                                    }
                                  }}
                                />
                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: getUtilizationColor(utilization) }}>
                                  {utilization.toFixed(1)}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={bin.is_active ? "Active" : "Inactive"}
                                size="small"
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 22,
                                  bgcolor: bin.is_active ? COLORS.chips.active : COLORS.chips.inactive,
                                  color: bin.is_active ? COLORS.primary : COLORS.text.secondary,
                                  fontWeight: 500
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <WarehouseIcon sx={{ fontSize: 40, color: COLORS.text.tertiary, mb: 1, opacity: 0.5 }} />
                  <Typography sx={{ color: COLORS.text.secondary, fontSize: '0.75rem' }}>
                    No bins configured for this warehouse
                  </Typography>
                </Box>
              )}
            </Paper>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 34,
            px: 3,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.75rem',
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

export default ViewWareHouse;