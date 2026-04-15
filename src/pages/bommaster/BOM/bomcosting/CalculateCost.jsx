import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Alert,
  Box,
  IconButton,
  Chip,
  Paper,
  Stack,
  Grid,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Calculate as CalculateIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Factory as FactoryIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS } from '../constants';

const CalculateCost = ({ open, onClose, bomId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [scrapPercent, setScrapPercent] = useState(0);
  const [fetchingComponents, setFetchingComponents] = useState(false);
  const [bomDetails, setBomDetails] = useState(null);

  // Fetch BOM details and components when dialog opens
  useEffect(() => {
    if (open && bomId) {
      fetchBomDetails();
    }
  }, [open, bomId]);

  const fetchBomDetails = async () => {
    setFetchingComponents(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/boms/${bomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const bom = response.data.data;
        setBomDetails(bom);
        
        // Extract components from BOM
        const bomComponents = bom.components || [];
        setComponents(bomComponents);
        
        // Auto-select first component if available
        if (bomComponents.length > 0) {
          setSelectedComponent(bomComponents[0].component_item_id?._id || bomComponents[0].component_item_id);
        }
      }
    } catch (err) {
      console.error('Error fetching BOM details:', err);
      setError('Failed to load BOM components');
    } finally {
      setFetchingComponents(false);
    }
  };

  const handleCalculate = async () => {
    if (!selectedComponent) {
      setError('Please select a component');
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

      const submitData = {
        component_item_id: selectedComponent,
        quantity: Number(quantity),
        scrap_percent: Number(scrapPercent)
      };

      const response = await axios.post(
        `${BASE_URL}/api/boms/cost/component`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      } else {
        setError(response.data.message || 'Failed to calculate cost');
      }
    } catch (err) {
      console.error('Error calculating cost:', err);
      setError(err.response?.data?.message || 'Failed to calculate cost. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setResult(null);
    setSelectedComponent('');
    setQuantity(1);
    setScrapPercent(0);
    setComponents([]);
    setBomDetails(null);
    onClose();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseFloat(num).toFixed(4);
  };

  const getSelectedComponentDetails = () => {
    return components.find(comp => 
      (comp.component_item_id?._id === selectedComponent || comp.component_item_id === selectedComponent)
    );
  };

  const selectedCompDetails = getSelectedComponentDetails();

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
          overflow: 'hidden'
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
            Calculate Component Cost
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetchingComponents ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, flexDirection: 'column' }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ mt: 2, color: COLORS.text.secondary, fontSize: '0.75rem' }}>
              Loading BOM components...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {/* BOM Information */}
            {bomDetails && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <InventoryIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                  BOM Information
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM ID</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                      {bomDetails.bom_id}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
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

            {/* Component Selection */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <FactoryIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                Component Details
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    Select Component <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      }
                    }}
                  >
                    <option value="" disabled>Select a component</option>
                    {components.map((comp, index) => {
                      const compId = comp.component_item_id?._id || comp.component_item_id;
                      const compName = comp.component_part_no || comp.component_desc;
                      return (
                        <option key={index} value={compId}>
                          {compName} ({comp.quantity_per} {comp.unit})
                        </option>
                      );
                    })}
                  </TextField>
                </Grid>

                {selectedCompDetails && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Part No
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {selectedCompDetails.component_part_no}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Description
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {selectedCompDetails.component_desc}
                      </Typography>
                    </Grid>
                  </>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    Quantity <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0, step: 0.01 }
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

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    Scrap (%)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={scrapPercent}
                    onChange={(e) => setScrapPercent(Number(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0, max: 100, step: 0.1 },
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
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

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  disabled={loading || !selectedComponent}
                  startIcon={loading ? <CircularProgress size={16} /> : <CalculateIcon />}
                  fullWidth
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: COLORS.primary,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': { bgcolor: COLORS.primaryDark }
                  }}
                >
                  {loading ? 'Calculating...' : 'Calculate Cost'}
                </Button>
              </Box>
            </Paper>

            {/* Calculation Result */}
            {result && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success, mb: 1.5 }}>
                  <MoneyIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Cost Calculation Result
                </Typography>

                {/* Item Information */}
                <Paper sx={{ p: 2, mb: 2, bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    Item Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Part No</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{result.item?.part_no || '-'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>RM Grade</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{result.item?.rm_grade || '-'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Density</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{result.item?.density || '-'} g/cm³</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* RM Rate Information */}
                {result.rm_rate && (
                  <Paper sx={{ p: 2, mb: 2, bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      Raw Material Rate
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Rate per Kg</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(result.rm_rate.rate_per_kg)}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Effective Rate</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(result.rm_rate.effective_rate)}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Source</Typography>
                        <Chip
                          label={result.rm_rate.source}
                          size="small"
                          sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )}

                {/* Quantity Information */}
                <Paper sx={{ p: 2, mb: 2, bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    Quantity Details
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Base Quantity</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatNumber(result.quantity?.base)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>With Scrap</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatNumber(result.quantity?.with_scrap)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Scrap %</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{result.quantity?.scrap_percent}%</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Cost Summary */}
                <Divider sx={{ my: 1.5 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Material Cost</Typography>
                      <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.primary }}>
                        {formatCurrency(result.material_cost)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.primary, borderRadius: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.lightMuted }}>Cost per Unit</Typography>
                      <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                        {formatCurrency(result.cost_per_unit)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalculateCost;