import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
  Box,
  IconButton,
  Chip,
  Paper,
  Stack,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  Calculate as CalculateIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Factory as FactoryIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS } from '../constants';

const steps = ['BOM Information', 'Production Quantity', 'Cost Rollup Results'];

// Modern Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const CostRollup = ({ open, onClose, bomId, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bomDetails, setBomDetails] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  // Fetch BOM details when dialog opens
  useEffect(() => {
    if (open && bomId) {
      fetchBomDetails();
    }
  }, [open, bomId]);

  const fetchBomDetails = async () => {
    setFetchingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/boms/${bomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setBomDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching BOM details:', err);
      setError('Failed to load BOM details');
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleCalculate = async () => {
    if (!bomId) {
      setError('BOM ID is missing');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const url = `${BASE_URL}/api/boms/${bomId}/cost-rollup?quantity=${quantity}`;
      console.log('Calling URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        setResult(response.data.data);
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        // Move to results step after successful calculation
        setActiveStep(2);
      } else {
        setError(response.data.message || 'Failed to calculate cost rollup');
      }
    } catch (err) {
      console.error('Error calculating cost rollup:', err);
      
      if (err.response?.status === 404) {
        setError(`API endpoint not found. Please verify the endpoint with backend team.`);
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Invalid request. Please check the quantity value.');
      } else {
        setError(err.response?.data?.message || 'Failed to calculate cost rollup. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
  };

  const handleNext = () => {
    if (activeStep === 1) {
      handleCalculate();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    setError('');
    setResult(null);
    setQuantity(1);
    setBomDetails(null);
    setActiveStep(0);
    onClose();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseFloat(num).toFixed(4);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!result) return;
    
    const headers = ['Part No', 'Description', 'Level', 'Base Qty', 'Qty with Scrap', 'Scrap %', 'Unit', 'Total Cost'];
    const rows = result.cost_breakdown?.map(item => [
      item.part_no,
      item.description,
      item.level,
      formatNumber(item.base_quantity),
      formatNumber(item.quantity_with_scrap),
      `${item.scrap_percent}%`,
      item.unit,
      formatCurrency(item.total_cost)
    ]) || [];
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost_rollup_${result.bom_id}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {bomDetails && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <InventoryIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                  BOM Information
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM ID</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                      {bomDetails.bom_id}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Parent Part No</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {bomDetails.parent_part_no}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Version</Typography>
                    <Chip
                      label={bomDetails.bom_version}
                      size="small"
                      sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem' }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <FactoryIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                Production Quantity
              </Typography>

              <Grid container spacing={2} alignItems="flex-end">
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    Requested Quantity <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={handleQuantityChange}
                    InputProps={{
                      inputProps: { min: 1, step: 1 },
                      endAdornment: <InputAdornment position="end">units</InputAdornment>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            {result && (
              <>
                {/* Summary Cards */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                    <MoneyIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Cost Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Material Cost</Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                          {formatCurrency(result.summary?.total_material_cost)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Process Cost</Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                          {formatCurrency(result.summary?.total_process_cost)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Subcontract Cost</Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                          {formatCurrency(result.summary?.total_subcontract_cost)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.primary, borderRadius: 1.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.lightMuted }}>Total Cost</Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                          {formatCurrency(result.total_cost)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Cost per Unit */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Cost per Unit</Typography>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                        {formatCurrency(result.summary?.cost_per_unit)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Requested Quantity</Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>{result.requested_quantity} units</Typography>
                    </Box>
                   
                  </Box>
                </Paper>

                {/* Cost Breakdown Table */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                    <TrendingUpIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Cost Breakdown
                  </Typography>
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Part No</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Description</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Level</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Base Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Qty with Scrap</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Scrap %</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Unit</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Total Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.cost_breakdown?.map((item, index) => (
                          <React.Fragment key={index}>
                            <TableRow hover>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{item.description}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>
                                <Chip
                                  label={`Level ${item.level}`}
                                  size="small"
                                  sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatNumber(item.base_quantity)}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatNumber(item.quantity_with_scrap)}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.scrap_percent}%</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                                <Typography fontWeight={600} color={COLORS.primary}>
                                  {formatCurrency(item.total_cost)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            {item.cost_breakdown && (
                              <TableRow>
                                <TableCell colSpan={8} sx={{ py: 1, bgcolor: COLORS.background.light }}>
                                  <Box sx={{ pl: 2, borderLeft: `2px solid ${COLORS.primary}` }}>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mb: 0.5 }}>
                                      Cost Details:
                                    </Typography>
                                    <Grid container spacing={1}>
                                      <Grid size={{ xs: 12, sm: 3 }}>
                                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Type</Typography>
                                        <Chip
                                          label={item.cost_breakdown.type}
                                          size="small"
                                          sx={{ fontSize: '0.6rem', height: 20 }}
                                        />
                                      </Grid>
                                      {item.cost_breakdown.rm_grade && (
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>RM Grade</Typography>
                                          <Typography sx={{ fontSize: '0.65rem', fontWeight: 500 }}>{item.cost_breakdown.rm_grade}</Typography>
                                        </Grid>
                                      )}
                                      {item.cost_breakdown.rate_per_kg && (
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Rate per Kg</Typography>
                                          <Typography sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                                            {formatCurrency(item.cost_breakdown.rate_per_kg)}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {item.cost_breakdown.source && (
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Source</Typography>
                                          <Typography sx={{ fontSize: '0.65rem', fontWeight: 500 }}>{item.cost_breakdown.source}</Typography>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalculateIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Cost Rollup
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetchingDetails ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, flexDirection: 'column' }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ mt: 2, color: COLORS.text.secondary, fontSize: '0.75rem' }}>
              Loading BOM details...
            </Typography>
          </Box>
        ) : (
          renderStepContent(activeStep)
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          size="small"
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Back
        </Button>
        <Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{
              height: 32,
              px: 2,
              mr: 1,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleClose}
              size="small"
              startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Close
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || (activeStep === 1 && !quantity)}
              size="small"
              endIcon={activeStep === 1 && loading ? <CircularProgress size={16} /> : <NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {activeStep === 1 && loading ? 'Calculating...' : 'Next'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CostRollup;