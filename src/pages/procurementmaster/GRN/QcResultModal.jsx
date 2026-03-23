// QcResultModal.js - Compact version with stepper
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import { 
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  primaryBlue: '#00B4D8',
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
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7'
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

const steps = ['GRN Info', 'QC Items', 'QC Remarks'];

const QcResultModal = ({ open, onClose, grn, onQcComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qcRemarks, setQcRemarks] = useState('');
  const [qcItems, setQcItems] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (open && grn && grn.items) {
      const initialItems = grn.items.map(item => ({
        _id: item._id,
        item_id: item.item_id,
        part_no: item.part_no,
        description: item.description,
        received_qty: item.received_qty,
        unit: item.unit,
        accepted_qty: item.received_qty,
        rejected_qty: 0,
        rejection_reason: ''
      }));
      setQcItems(initialItems);
      setQcRemarks('');
      setFieldErrors({});
      setActiveStep(0);
    }
  }, [open, grn]);

  const handleAcceptAll = () => {
    const updatedItems = qcItems.map(item => ({
      ...item,
      accepted_qty: item.received_qty,
      rejected_qty: 0,
      rejection_reason: ''
    }));
    setQcItems(updatedItems);
  };

  const handleRejectAll = () => {
    const updatedItems = qcItems.map(item => ({
      ...item,
      accepted_qty: 0,
      rejected_qty: item.received_qty,
      rejection_reason: 'Rejected due to quality issues'
    }));
    setQcItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...qcItems];
    const item = updatedItems[index];
    const receivedQty = item.received_qty;

    if (field === 'accepted_qty') {
      const acceptedQty = parseFloat(value) || 0;
      if (acceptedQty >= 0 && acceptedQty <= receivedQty) {
        item.accepted_qty = acceptedQty;
        item.rejected_qty = receivedQty - acceptedQty;
        if (acceptedQty === receivedQty) {
          item.rejection_reason = '';
        }
      }
    } else if (field === 'rejected_qty') {
      const rejectedQty = parseFloat(value) || 0;
      if (rejectedQty >= 0 && rejectedQty <= receivedQty) {
        item.rejected_qty = rejectedQty;
        item.accepted_qty = receivedQty - rejectedQty;
      }
    } else if (field === 'rejection_reason') {
      item.rejection_reason = value;
    }

    setQcItems(updatedItems);
    setFieldErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 1: // QC Items
        qcItems.forEach((item, index) => {
          const total = item.accepted_qty + item.rejected_qty;
          if (total !== item.received_qty) {
            errors[`item_${index}_total`] = `Accepted + Rejected must equal Received (${item.received_qty})`;
            isValid = false;
          }
          if (item.rejected_qty > 0 && !item.rejection_reason) {
            errors[`item_${index}_rejection_reason`] = 'Rejection reason required';
            isValid = false;
          }
        });
        break;
      default:
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix validation errors');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const submissionData = {
        items: qcItems.map(item => ({
          item_id: item._id,
          accepted_qty: item.accepted_qty,
          rejected_qty: item.rejected_qty,
          rejection_reason: item.rejection_reason || null
        })),
        qc_remarks: qcRemarks || 'QC inspection completed'
      };

      const response = await axios.put(
        `${BASE_URL}/api/grns/${grn._id}/qc-result`,
        submissionData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        onQcComplete(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to submit QC results');
      }
    } catch (err) {
      console.error('Error submitting QC results:', err);
      setError(err.response?.data?.message || 'Failed to submit QC results');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQcItems([]);
    setQcRemarks('');
    setFieldErrors({});
    setError('');
    setActiveStep(0);
    onClose();
  };

  if (!grn) return null;

  const totalAccepted = qcItems.reduce((sum, item) => sum + (item.accepted_qty || 0), 0);
  const totalRejected = qcItems.reduce((sum, item) => sum + (item.rejected_qty || 0), 0);
  const totalReceived = qcItems.reduce((sum, item) => sum + (item.received_qty || 0), 0);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // GRN Info
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                GRN Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      GRN NUMBER
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, mt: 0.5 }}>
                      {grn.grn_number}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PO NUMBER
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, mt: 0.5 }}>
                      {grn.po_number}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      VENDOR
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, mt: 0.5 }}>
                      {grn.vendor_name}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1: // QC Items
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '0.9rem' }}>
                  QC Inspection Items
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleAcceptAll}
                    sx={{ height: 28, fontSize: '0.7rem', borderRadius: 1.5, borderColor: COLORS.success, color: COLORS.success }}
                  >
                    Accept All
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleRejectAll}
                    sx={{ height: 28, fontSize: '0.7rem', borderRadius: 1.5, borderColor: COLORS.error, color: COLORS.error }}
                  >
                    Reject All
                  </Button>
                </Stack>
              </Stack>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Received</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Accepted</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Rejected</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Rejection Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {qcItems.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                          <Chip 
                            label={item.received_qty} 
                            size="small" 
                            sx={{ fontSize: '0.7rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.unit}</TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            type="number"
                            value={item.accepted_qty}
                            onChange={(e) => handleItemChange(index, 'accepted_qty', e.target.value)}
                            inputProps={{ min: 0, max: item.received_qty, step: 1 }}
                            sx={{ width: 80, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.75 } }}
                            error={!!fieldErrors[`item_${index}_total`]}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            type="number"
                            value={item.rejected_qty}
                            onChange={(e) => handleItemChange(index, 'rejected_qty', e.target.value)}
                            inputProps={{ min: 0, max: item.received_qty, step: 1 }}
                            sx={{ width: 80, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.75 } }}
                          />
                        </TableCell>
                        <TableCell>
                          {item.rejected_qty > 0 && (
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Reason for rejection"
                              value={item.rejection_reason}
                              onChange={(e) => handleItemChange(index, 'rejection_reason', e.target.value)}
                              error={!!fieldErrors[`item_${index}_rejection_reason`]}
                              helperText={fieldErrors[`item_${index}_rejection_reason`]}
                              sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.75 } }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {fieldErrors[`item_0_total`] && (
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.error, mt: 1 }}>
                  {fieldErrors[`item_0_total`]}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Stack direction="row" justifyContent="flex-end" spacing={3}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Received:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>{totalReceived} units</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Accepted:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.success }}>{totalAccepted} units</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Rejected:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.error }}>{totalRejected} units</Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        );
      
      case 2: // QC Remarks
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                QC Remarks
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                size="small"
                placeholder="Enter QC inspection remarks..."
                value={qcRemarks}
                onChange={(e) => setQcRemarks(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '&:hover fieldset': { borderColor: COLORS.primary },
                    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                  },
                  '& .MuiInputBase-input': {
                    py: 1,
                    px: 1.5,
                    fontSize: '0.75rem',
                    color: COLORS.text.primary
                  }
                }}
              />
            </Paper>
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
            <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 20 }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
              QC Inspection Result
            </Typography>
          </Stack>
          <Chip 
            label={`GRN: ${grn.grn_number}`} 
            size="small" 
            sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem' }} 
          />
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
        {renderStepContent(activeStep)}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
          </Alert>
        )}
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
            onClick={handleClose}
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
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? null : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.success,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: '#059669' }
              }}
            >
              {loading ? 'Submitting...' : 'Submit QC Results'}
            </Button>
          ) : (
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

export default QcResultModal;