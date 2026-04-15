import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  IconButton,
  Box,
  Stack,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { 
  Close, 
  Warehouse as WarehouseIcon,
  Inventory,
  AttachMoney,
  TrendingUp,
  ExpandMore,
  CheckCircle,
  Cancel
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

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

const WareHouseReport = ({ open, onClose }) => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/warehouses/capacity-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setData(res.data.data);
        setSummary(res.data.summary);
      } else {
        setError(res.data.message || "Failed to fetch report");
      }
    } catch (err) {
      console.error("Report error:", err);
      setError(err.response?.data?.message || "Failed to fetch warehouse report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchReport();
  }, [open]);

  const getUtilizationColor = (percentage) => {
    const num = parseFloat(percentage);
    if (num >= 80) return "#EF4444";
    if (num >= 50) return "#F59E0B";
    return "#10B981";
  };

  const getUtilizationStatus = (percentage) => {
    const num = parseFloat(percentage);
    if (num >= 80) return { label: "Critical", color: "#EF4444" };
    if (num >= 50) return { label: "High", color: "#F59E0B" };
    if (num > 0) return { label: "Normal", color: "#10B981" };
    return { label: "Empty", color: "#94A3B8" };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
          <TrendingUp sx={{ color: COLORS.primary, fontSize: '1.3rem' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Warehouse Capacity Report
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
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
            {error}
          </Alert>
        ) : (
          <Stack spacing={3}>
            {/* Summary Cards */}
            {summary && (
              <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', mb: 2, pb: 0.5, borderBottom: `1px solid ${COLORS.border}` }}>
                  SUMMARY
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <WarehouseIcon sx={{ fontSize: '1.3rem', color: COLORS.primary, mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        TOTAL WAREHOUSES
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                        {summary.total_warehouses}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <Inventory sx={{ fontSize: '1.3rem', color: COLORS.primary, mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        TOTAL CAPACITY
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                        {summary.total_capacity?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <AttachMoney sx={{ fontSize: '1.3rem', color: COLORS.primary, mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        TOTAL STOCK VALUE
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                        ₹ {summary.total_stock_value?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <TrendingUp sx={{ fontSize: '1.3rem', color: getUtilizationColor(summary.overall_utilization), mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        OVERALL UTILIZATION
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: getUtilizationColor(summary.overall_utilization) }}>
                        {summary.overall_utilization?.toFixed(2)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Warehouses Table */}
            <Paper sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', overflow: 'hidden' }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', p: 2, pb: 0 }}>
                WAREHOUSE DETAILS
              </Typography>
              
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>ID</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>Warehouse Name</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>Location</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Capacity</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Used</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }} align="center">Utilization</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Stock Value</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }} align="center">Items</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }} align="center">Bins</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((warehouse, index) => {
                      const utilization = parseFloat(warehouse.utilization_percentage);
                      const status = getUtilizationStatus(utilization);
                      return (
                        <TableRow 
                          key={index} 
                          sx={{ 
                            '&:hover': { bgcolor: COLORS.background.hover },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 500, fontFamily: 'monospace' }}>
                            {warehouse.warehouse_id}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            <Typography sx={{ fontWeight: 500 }}>{warehouse.warehouse_name}</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                              {warehouse.warehouse_type}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{warehouse.location}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            {warehouse.total_capacity?.toLocaleString()}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            {warehouse.used_capacity?.toLocaleString()}
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: 100 }}>
                            <Box>
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
                              <Chip
                                size="small"
                                label={`${utilization.toFixed(1)}%`}
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 22,
                                  bgcolor: COLORS.background.light,
                                  color: getUtilizationColor(utilization),
                                  fontWeight: 500
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            ₹ {warehouse.total_stock_value?.toLocaleString()}
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={warehouse.unique_items_count || 0} 
                              size="small" 
                              sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${warehouse.active_bins || 0}/${warehouse.total_bins || 0}`} 
                              size="small" 
                              sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Bin Utilization Details - Accordion */}
            <Paper sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', overflow: 'hidden' }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', p: 2, pb: 0 }}>
                BIN UTILIZATION DETAILS
              </Typography>
              
              {data.map((warehouse, index) => (
                warehouse.bin_utilization && warehouse.bin_utilization.length > 0 && (
                  <Accordion 
                    key={index} 
                    sx={{ 
                      boxShadow: 'none', 
                      '&:before': { display: 'none' },
                      borderBottom: `1px solid ${COLORS.border}`
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <WarehouseIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                          {warehouse.warehouse_name}
                        </Typography>
                        <Chip 
                          label={`${warehouse.utilization_percentage}% utilized`}
                          size="small"
                          sx={{ 
                            fontSize: '0.6rem', 
                            height: 22,
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primary
                          }}
                        />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: COLORS.background.light }}>
                              <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Bin Code</TableCell>
                              <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Capacity</TableCell>
                              <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Current Stock</TableCell>
                              <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Utilization</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {warehouse.bin_utilization.map((bin, idx) => {
                              const binUtil = parseFloat(bin.utilization);
                              return (
                                <TableRow key={idx}>
                                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{bin.bin_code}</TableCell>
                                  <TableCell sx={{ fontSize: '0.7rem' }} align="right">{bin.capacity?.toLocaleString()}</TableCell>
                                  <TableCell sx={{ fontSize: '0.7rem' }} align="right">{bin.current?.toLocaleString()}</TableCell>
                                  <TableCell align="center" sx={{ minWidth: 100 }}>
                                    <Box>
                                      <LinearProgress 
                                        variant="determinate" 
                                        value={binUtil}
                                        sx={{
                                          height: 3,
                                          borderRadius: 2,
                                          mb: 0.5,
                                          bgcolor: COLORS.border,
                                          '& .MuiLinearProgress-bar': {
                                            bgcolor: getUtilizationColor(binUtil),
                                            borderRadius: 2
                                          }
                                        }}
                                      />
                                      <Typography sx={{ fontSize: '0.6rem', fontWeight: 500, color: getUtilizationColor(binUtil) }}>
                                        {bin.utilization}%
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                )
              ))}
            </Paper>
          </Stack>
        )}
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
            px: 2.5,
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

export default WareHouseReport;