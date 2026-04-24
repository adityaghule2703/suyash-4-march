import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Close as CloseIcon,
  Assignment as RecordIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  QrCode as QrCodeIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Assessment as ResultsIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
    grey: '#F9FAFB'
  },
  border: '#E3E8EF',
  resultStatus: {
    Accepted: { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircleIcon sx={{ fontSize: '0.8rem' }} /> },
    Rejected: { bg: '#FEE2E2', color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.8rem' }} /> },
    Pending: { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.8rem' }} /> },
    'Conditionally Accepted': { bg: '#F3E8FF', color: '#7E22CE', icon: <WarningIcon sx={{ fontSize: '0.8rem' }} /> },
    'Partially Completed': { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.8rem' }} /> }
  }
};

// Helper function to safely extract value from object or string
const getValue = (value) => {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    // Common fields that might contain the display value
    return value.wo_number || value.grn_number || value.vendor_name || 
           value.customer_name || value.ncr_number || value.plan_name ||
           value.FirstName || value.LastName || value._id || '-';
  }
  return String(value);
};

// Helper to get full name from employee object
const getEmployeeName = (employee) => {
  if (!employee) return '-';
  if (typeof employee === 'string') return employee;
  if (typeof employee === 'object') {
    const firstName = employee.FirstName || '';
    const lastName = employee.LastName || '';
    if (firstName || lastName) return `${firstName} ${lastName}`.trim();
    return employee._id || '-';
  }
  return '-';
};

const ViewInspectionRecord = ({ open, onClose, record }) => {
  const [loading, setLoading] = useState(false);
  const [recordData, setRecordData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && record) {
      fetchRecordDetails();
    }
  }, [open, record]);

  const fetchRecordDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/inspection-records/${record._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setRecordData(response.data.data);
      } else {
        setError('Failed to fetch inspection record details');
      }
    } catch (err) {
      console.error('Error fetching record details:', err);
      setError(err.response?.data?.message || 'Failed to load inspection record details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ResultStatusChip = ({ status }) => {
    const colors = COLORS.resultStatus[status] || { bg: '#F1F5F9', color: '#475569', icon: null };
    return (
      <Chip
        icon={colors.icon}
        label={status || 'Pending'}
        size="small"
        sx={{
          fontSize: '0.7rem',
          fontWeight: 600,
          height: 28,
          bgcolor: colors.bg,
          color: colors.color,
          '& .MuiChip-icon': {
            color: colors.color,
            fontSize: '0.8rem'
          }
        }}
      />
    );
  };

  const InfoRow = ({ label, value, icon: Icon }) => {
    // Ensure value is properly formatted for display
    let displayValue = '-';
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object') {
        // Try to extract common display fields
        displayValue = value.wo_number || value.grn_number || value.vendor_name || 
                       value.customer_name || value.ncr_number || value.plan_name ||
                       value.FirstName || value.LastName || value._id || '-';
        if (displayValue === value._id && value.FirstName) {
          displayValue = `${value.FirstName} ${value.LastName || ''}`.trim();
        }
      } else {
        displayValue = String(value);
      }
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
        {Icon && <Icon sx={{ fontSize: '1rem', color: COLORS.primary, mt: 0.2 }} />}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.25 }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
            {displayValue}
          </Typography>
        </Box>
      </Box>
    );
  };

  const SectionTitle = ({ title, icon: Icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: `2px solid ${COLORS.primary}` }}>
      {Icon && <Icon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />}
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.text.primary }}>
        {title}
      </Typography>
    </Box>
  );

  const renderCheckpointResults = () => {
    if (!recordData?.checkpoint_results || recordData.checkpoint_results.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <ResultsIcon sx={{ fontSize: 40, color: COLORS.text.tertiary, mb: 1 }} />
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            No checkpoint results available
          </Typography>
        </Box>
      );
    }

    return recordData.checkpoint_results.map((checkpoint, idx) => (
      <Accordion 
        key={idx} 
        sx={{ 
          mb: 1.5, 
          borderRadius: 1.5, 
          border: `1px solid ${COLORS.border}`,
          boxShadow: 'none',
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            bgcolor: COLORS.background.grey,
            borderRadius: 1.5,
            '& .MuiAccordionSummary-content': {
              alignItems: 'center'
            }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
            <Chip 
              label={`Checkpoint ${checkpoint.checkpoint_seq}`} 
              size="small" 
              sx={{ 
                bgcolor: COLORS.primary, 
                color: COLORS.text.light,
                fontSize: '0.65rem',
                fontWeight: 600
              }} 
            />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
              {checkpoint.characteristic || '-'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {checkpoint.specification || '-'}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: COLORS.background.grey, p: 1.5, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Specifications
                </Typography>
                <Stack spacing={0.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Nominal:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {checkpoint.nominal || '-'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>USL (Upper Limit):</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {checkpoint.usl || '-'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>LSL (Lower Limit):</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {checkpoint.lsl || '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: COLORS.background.grey, p: 1.5, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Readings
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {checkpoint.readings && checkpoint.readings.map((reading, rIdx) => (
                    <Chip
                      key={rIdx}
                      label={`R${rIdx + 1}: ${reading !== null && reading !== undefined ? reading : '-'}`}
                      size="small"
                      sx={{ fontSize: '0.65rem' }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
            
            {checkpoint.inspector_note && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ bgcolor: COLORS.background.grey, p: 1.5, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    Inspector Note
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>
                    {checkpoint.inspector_note}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    ));
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
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <RecordIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Inspection Record Details
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: COLORS.text.secondary,
            '&:hover': { bgcolor: `${COLORS.primary}10` }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        ) : recordData ? (
          <Stack spacing={3}>
            {/* Header Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.grey, borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ bgcolor: COLORS.primaryLight, p: 1.5, borderRadius: 2 }}>
                      <RecordIcon sx={{ fontSize: '2rem', color: COLORS.primary }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Inspection ID / Number
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                        {recordData.inspection_id || recordData.inspection_number || '-'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Overall Result
                    </Typography>
                    <ResultStatusChip status={recordData.overall_result} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Basic Information */}
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <SectionTitle title="Basic Information" icon={RecordIcon} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoRow 
                    label="Inspection Type" 
                    value={recordData.inspection_type} 
                    icon={RecordIcon}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoRow 
                    label="Inspection Date" 
                    value={formatDate(recordData.inspection_date)} 
                    icon={RecordIcon}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoRow 
                    label="Plan Name" 
                    value={recordData.plan_id?.plan_name || recordData.plan_id} 
                    icon={RecordIcon}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoRow 
                    label="Part Number" 
                    value={recordData.part_no || recordData.item_id?.part_no || recordData.item_id} 
                    icon={InventoryIcon}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoRow 
                    label="Lot Size" 
                    value={recordData.lot_size} 
                    icon={InventoryIcon}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoRow 
                    label="Sample Size" 
                    value={recordData.sample_size} 
                    icon={InventoryIcon}
                  />
                </Grid>
              </Grid>
            </Paper>

          

            {/* Completion Details (if completed) */}
            {(recordData.accepted_qty !== undefined || recordData.disposition) && (
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <SectionTitle title="Completion Details" icon={CheckCircleIcon} />
                <Grid container spacing={2}>
                  {recordData.accepted_qty !== undefined && (
                    <>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoRow label="Accepted Quantity" value={recordData.accepted_qty} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoRow label="Rejected Quantity" value={recordData.rejected_qty} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoRow label="Rework Quantity" value={recordData.rework_qty || 0} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoRow label="On Hold Quantity" value={recordData.on_hold_qty || 0} />
                      </Grid>
                    </>
                  )}
                  {recordData.disposition && (
                    <Grid size={{ xs: 12 }}>
                      <InfoRow label="Disposition" value={recordData.disposition} />
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* Checkpoint Results */}
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <SectionTitle title="Checkpoint Results" icon={ResultsIcon} />
              {renderCheckpointResults()}
            </Paper>

            {/* Timestamps */}
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.grey }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                    Created At
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formatDateTime(recordData.createdAt)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                    Last Updated
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formatDateTime(recordData.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <RecordIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
            <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
              No inspection record data available
            </Typography>
          </Box>
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
            height: 32,
            px: 3,
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

export default ViewInspectionRecord;