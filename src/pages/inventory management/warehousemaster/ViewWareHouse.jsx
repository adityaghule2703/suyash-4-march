import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
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
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from "@mui/material";
import { 
  Close, 
  Warehouse as WarehouseIcon, 
  Person, 
  ProductionQuantityLimits,
  AttachMoney,
  CheckCircle,
  Cancel,
  TrendingUp,
  QrCode,
  Assessment,
  LocationOn,
  Category
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
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon styling
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? PRIMARY_BLUE : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(ownerState.active && {
    backgroundColor: PRIMARY_BLUE,
    boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: PRIMARY_BLUE,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : props.icon}
    </CustomStepIconRoot>
  );
}

const steps = ['Overview', 'Stock Summary', 'Bin Details'];

const ViewWareHouse = ({ open, onClose, data }) => {
  const [activeStep, setActiveStep] = useState(0);
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
    if (num >= 80) return COLORS.error;
    if (num >= 60) return COLORS.warning;
    return COLORS.success;
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Overview
        return (
          <Stack spacing={2}>
            {/* Basic Information Card */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <WarehouseIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      WAREHOUSE ID
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.primary, fontFamily: 'monospace' }}>
                      {warehouse?.warehouse_id || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={warehouse?.is_active ? <CheckCircle sx={{ fontSize: '0.8rem' }} /> : <Cancel sx={{ fontSize: '0.8rem' }} />}
                      label={warehouse?.is_active ? "Active" : "Inactive"}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 26,
                        bgcolor: warehouse?.is_active ? '#D1FAE5' : '#F1F5F9',
                        color: warehouse?.is_active ? '#065F46' : COLORS.text.secondary,
                        fontWeight: 600
                      }}
                    />
                    <Chip
                      label={`${warehouse?.active_bins || 0}/${warehouse?.total_bins || 0} Bins`}
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

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      WAREHOUSE NAME
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {warehouse?.warehouse_name || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      WAREHOUSE TYPE
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {warehouse?.warehouse_type || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      LOCATION
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {warehouse?.location || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MANAGER
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {getManagerName()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Stock Summary
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <Assessment sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Stock Summary
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <ProductionQuantityLimits sx={{ fontSize: '1.5rem', color: COLORS.primary, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      TOTAL QUANTITY
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      {warehouse?.total_stock_quantity?.toLocaleString() || 0}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <AttachMoney sx={{ fontSize: '1.5rem', color: COLORS.success, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      TOTAL VALUE
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success }}>
                      ₹ {warehouse?.total_stock_value?.toLocaleString() || 0}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <WarehouseIcon sx={{ fontSize: '1.5rem', color: COLORS.info, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      TOTAL BINS
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.info }}>
                      {warehouse?.total_bins || 0}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <TrendingUp sx={{ fontSize: '1.5rem', color: '#10B981', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      ACTIVE BINS
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#10B981' }}>
                      {warehouse?.active_bins || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2: // Bin Details
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                  <QrCode sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Bin Details ({warehouse?.bins?.length || 0})
                </Typography>
              </Stack>

              {warehouse?.bins && warehouse.bins.length > 0 ? (
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
                        const utilization = parseFloat(bin.utilization_percentage || 
                          (bin.current_stock?.quantity && bin.capacity ? (bin.current_stock.quantity / bin.capacity) * 100 : 0));
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
                              {bin.capacity?.toLocaleString() || '-'}
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
                                  value={Math.min(utilization, 100)}
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
                                  bgcolor: bin.is_active ? '#D1FAE5' : '#F1F5F9',
                                  color: bin.is_active ? '#065F46' : COLORS.text.secondary,
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
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ color: COLORS.primary }} />
          <Typography sx={{ mt: 2, color: COLORS.text.secondary }}>
            Loading warehouse details...
          </Typography>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          height: 'auto',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ background: HEADER_GRADIENT, py: 1.5, px: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WarehouseIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1rem' }}>
              Warehouse Details
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: '#FFFFFF' }}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ 
            mt: 0.5,
            '& .MuiStepLabel-label': {
              color: '#FFFFFF !important',
              opacity: 0.8,
              fontSize: '0.7rem !important',
              '&.Mui-active': {
                color: '#FFFFFF !important',
                opacity: 1,
                fontWeight: 600
              },
              '&.Mui-completed': {
                color: '#FFFFFF !important',
                opacity: 1
              }
            }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={500} fontSize="0.7rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ 
        p: 2.5, 
        overflow: 'auto', 
        maxHeight: 'calc(90vh - 140px)',
        backgroundColor: '#F8FFFC'
      }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1.5, 
              mb: 2,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
          </Alert>
        )}

        {warehouse && renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: '1px solid #E3E8EF',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          onClick={onClose}
          size="small"
          sx={{ 
            color: '#64748B', 
            fontSize: '0.75rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#F1F5F9' }
          }}
        >
          Close
        </Button>

        <Stack direction="row" spacing={1}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              size="small"
              sx={{ 
                color: '#64748B', 
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': { bgcolor: '#F1F5F9' }
              }}
            >
              Back
            </Button>
          )}
          
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              sx={{
                backgroundColor: PRIMARY_DARK,
                fontSize: '0.75rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { 
                  backgroundColor: '#05292B',
                  boxShadow: 'none'
                }
              }}
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewWareHouse;