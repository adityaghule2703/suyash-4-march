import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,  // Add this
  DialogActions,  // Add this
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
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
  Business,
  Receipt,
  CalendarToday,
  Compare as CompareIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

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
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  gold: '#F59E0B',
  silver: '#94A3B8',
  bronze: '#CD7F32'
};

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

const steps = ['Summary', 'Item-wise Comparison', 'Vendor Selection'];

const ViewRFQComparison = ({ open, onClose, rfqId, onVendorSelected }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [selectingVendor, setSelectingVendor] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedVendorItem, setSelectedVendorItem] = useState(null);
  const [recommendationNotes, setRecommendationNotes] = useState('');
  const [showSelectForm, setShowSelectForm] = useState(false);
  const [selectedVendorName, setSelectedVendorName] = useState('');

  useEffect(() => {
    if (open && rfqId) {
      fetchComparison();
    }
  }, [open, rfqId]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/rfqs/${rfqId}/comparison`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setComparisonData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load comparison data');
      }
    } catch (err) {
      console.error('Error fetching comparison:', err);
      setError(err.response?.data?.message || 'Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVendor = (vendorId, vendorName, item = null) => {
    setSelectedVendorId(vendorId);
    setSelectedVendorName(vendorName);
    setSelectedVendorItem(item);
    setShowSelectForm(true);
  };

  const handleSubmitVendorSelection = async () => {
    if (!selectedVendorId) {
      setError('Please select a vendor');
      return;
    }

    setSelectingVendor(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/rfqs/${rfqId}/select-vendor`,
        {
          vendor_id: selectedVendorId,
          recommendation_notes: recommendationNotes || `Selected vendor: ${selectedVendorName}`
        },
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        if (onVendorSelected) {
          onVendorSelected(response.data.data);
        }
        setShowSelectForm(false);
        setSelectedVendorId(null);
        setSelectedVendorItem(null);
        setRecommendationNotes('');
        fetchComparison();
      } else {
        setError(response.data.message || 'Failed to select vendor');
      }
    } catch (err) {
      console.error('Error selecting vendor:', err);
      setError(err.response?.data?.message || 'Failed to select vendor. Please try again.');
    } finally {
      setSelectingVendor(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 'L1': return COLORS.gold;
      case 'L2': return COLORS.silver;
      case 'L3': return COLORS.bronze;
      default: return COLORS.text.tertiary;
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 'L1': return <EmojiEventsIcon sx={{ fontSize: 14 }} />;
      case 'L2': return <EmojiEventsIcon sx={{ fontSize: 14 }} />;
      case 'L3': return <EmojiEventsIcon sx={{ fontSize: 14 }} />;
      default: return null;
    }
  };

  const renderField = (icon, label, value, color = '#0f172a') => (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: PRIMARY_BLUE, mt: 0.3, minWidth: 20 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#64748B', 
            display: 'block', 
            fontSize: '10px',
            fontWeight: 500,
            lineHeight: 1.2,
            mb: 0.2
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '13px',
            color: color,
            wordBreak: 'break-word'
          }}
        >
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (!open) return null;

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Summary
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                RFQ Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'RFQ Number', comparisonData?.rfq_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'PR Number', comparisonData?.pr_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'RFQ Date', formatDate(comparisonData?.rfq_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Valid Till', formatDate(comparisonData?.valid_till))}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Comparison Summary
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.5 }}>
                      Total Items
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      {comparisonData?.summary?.total_items || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.5 }}>
                      Vendors Invited
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      {comparisonData?.summary?.vendors_invited || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.5 }}>
                      Vendors Responded
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success }}>
                      {comparisonData?.summary?.vendors_responded || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.5 }}>
                      Potential Savings
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success }}>
                      {formatCurrency(comparisonData?.summary?.potential_savings || 0)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.5 }}>
                      Lowest Total Value
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.success }}>
                      {formatCurrency(comparisonData?.summary?.lowest_total_value || 0)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.5 }}>
                      Highest Total Value
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.error }}>
                      {formatCurrency(comparisonData?.summary?.highest_total_value || 0)}
                    </Typography>
                  </Paper>
                </Grid>
                {comparisonData?.summary?.best_overall_vendor && (
                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 1.5, bgcolor: COLORS.successLight, borderRadius: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <StarIcon sx={{ color: COLORS.success, fontSize: 16 }} />
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#065F46' }}>
                          Best Overall Vendor: {comparisonData.summary.best_overall_vendor}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Item-wise Comparison
        return (
          <Stack spacing={2}>
            {comparisonData?.item_wise_comparison?.map((item, idx) => (
              <Paper key={idx} sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '0.8rem' }}>
                    {item.part_no} - {item.description}
                  </Typography>
                  <Chip
                    label={`L1: ${formatCurrency(item.best_price)}/unit`}
                    size="small"
                    sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.successLight, color: '#065F46' }}
                  />
                </Stack>
                
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Required Qty</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.required_qty} {item.unit}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Best Price</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.success }}>
                      {formatCurrency(item.best_price)}/unit
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Best Vendor</Typography>
                    <Chip
                      label={item.best_vendor}
                      size="small"
                      icon={getRankIcon(item.best_vendor_rank)}
                      sx={{
                        fontSize: '0.65rem',
                        height: 22,
                        bgcolor: getRankColor(item.best_vendor_rank) + '20',
                        color: getRankColor(item.best_vendor_rank),
                        mt: 0.5,
                        fontWeight: 500
                      }}
                    />
                  </Grid>
                </Grid>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Vendor</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Rate (₹)</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Total</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Delivery</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Payment</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Rank</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.quotes?.map((quote, qIdx) => (
                        <TableRow key={qIdx}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: quote.rank === 'L1' ? 600 : 400 }}>
                            {quote.vendor_name}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            {formatCurrency(quote.quoted_rate)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            {formatCurrency(quote.total_value)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="center">
                            {quote.delivery_days}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            {quote.payment_terms}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={quote.rank}
                              size="small"
                              sx={{
                                fontSize: '0.6rem',
                                height: 18,
                                bgcolor: getRankColor(quote.rank) + '20',
                                color: getRankColor(quote.rank),
                                fontWeight: 600,
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Select this vendor">
                              <IconButton
                                size="small"
                                onClick={() => handleSelectVendor(quote.vendor_id, quote.vendor_name, item)}
                                disabled={showSelectForm}
                                sx={{
                                  color: COLORS.primary,
                                  p: 0.5,
                                  '&:hover': { bgcolor: `${COLORS.primary}20` }
                                }}
                              >
                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))}
          </Stack>
        );

      case 2: // Vendor Selection
        return (
          <Stack spacing={2}>
            {!showSelectForm ? (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  Select Vendor
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
                  Click the checkmark icon next to any vendor in the comparison table to select them.
                </Typography>
                <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                  Select a vendor from the previous step to proceed with vendor selection.
                </Alert>
              </Paper>
            ) : (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `2px solid ${COLORS.primary}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  Confirm Vendor Selection
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Selected Vendor
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.primary }}>
                        {selectedVendorName}
                      </Typography>
                    </Box>
                    
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      Recommendation Notes
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      placeholder="Enter notes for selecting this vendor (e.g., Best price, delivery terms, etc.)"
                      value={recommendationNotes}
                      onChange={(e) => setRecommendationNotes(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                    
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowSelectForm(false)}
                        sx={{ borderRadius: 1.5, fontSize: '0.7rem', height: 32 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSubmitVendorSelection}
                        disabled={selectingVendor}
                        startIcon={<CheckCircleIcon sx={{ fontSize: '1rem' }} />}
                        sx={{ borderRadius: 1.5, fontSize: '0.7rem', bgcolor: COLORS.primary, height: 32 }}
                      >
                        {selectingVendor ? 'Selecting...' : 'Confirm Selection'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
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
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <CompareIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
              RFQ Comparison
            </Typography>
          </Stack>
          {comparisonData && (
            <Chip 
              label={`RFQ: ${comparisonData.rfq_number}`} 
              size="small" 
              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem' }} 
            />
          )}
        </Stack>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 0.5, mt: 0.5 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading comparison data...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        ) : comparisonData ? (
          renderStepContent(activeStep)
        ) : null}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
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
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRFQComparison;