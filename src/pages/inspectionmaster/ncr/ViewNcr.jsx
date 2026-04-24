// ViewNcr.jsx
import React, { useState, useEffect } from 'react';
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
  Divider,
  IconButton,
  Avatar,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Tooltip,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  Link as LinkIcon,
  AttachFile as AttachFileIcon,
  Error as ErrorIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import axios from 'axios';
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
  severity: {
    Critical: '#EF4444',
    Major: '#F59E0B',
    Minor: '#10B981'
  },
  status: {
    'Open': '#EF4444',
    'Under Investigation': '#F59E0B',
    'Disposition Given': '#8B5CF6',
    'CAPA Initiated': '#3B82F6',
    'Pending Verification': '#06B6D4',
    'Closed': '#10B981',
    'Escalated': '#EF4444'
  }
};

// Steps for stepper
const steps = [
  'Basic Information',
  'Defect & Item Details',
  'CAPA & Audit Info'
];

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

const ViewNcr = ({ open, onClose, ncrId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ncrData, setNcrData] = useState(null);
  const [capaData, setCapaData] = useState(null);

  useEffect(() => {
    if (open && ncrId) {
      fetchNcrDetails();
    }
  }, [open, ncrId]);

  const fetchNcrDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNcrData(response.data.data);
        
        // If CAPA ID exists, fetch CAPA details
        if (response.data.data.capa_id) {
          fetchCapaDetails(response.data.data.capa_id);
        }
      } else {
        setError(response.data.message || 'Failed to fetch NCR details');
      }
    } catch (err) {
      console.error('Error fetching NCR details:', err);
      setError(err.response?.data?.message || 'Failed to fetch NCR details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCapaDetails = async (capaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/capas/${capaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCapaData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching CAPA details:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch (e) {
      return '-';
    }
  };

  const getSeverityColor = (severity) => {
    return COLORS.severity[severity] || COLORS.text.secondary;
  };

  const getStatusColor = (status) => {
    return COLORS.status[status] || COLORS.text.secondary;
  };

  const getNcrInitials = (ncrNumber) => {
    if (!ncrNumber) return 'NC';
    const parts = ncrNumber.split('-');
    if (parts.length >= 2) {
      return `${parts[0]}${parts[1]}`.toUpperCase();
    }
    return ncrNumber.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (severity) => {
    return getSeverityColor(severity);
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    if (!ncrData) return null;

    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Status Banner */}
            <Paper sx={{ 
              p: 1.5, 
              bgcolor: ncrData.status === 'Closed' ? COLORS.primaryLight : COLORS.background.light,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {ncrData.status === 'Closed' ? (
                  <ActiveIcon sx={{ color: '#065f46', fontSize: '1.2rem' }} />
                ) : (
                  <WarningIcon sx={{ color: getStatusColor(ncrData.status), fontSize: '1.2rem' }} />
                )}
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: ncrData.status === 'Closed' ? '#065f46' : getStatusColor(ncrData.status) }}>
                  {ncrData.status}
                </Typography>
              </Stack>
              {ncrData.capa_id && (
                <Tooltip title="Linked CAPA">
                  <Chip
                    icon={<LinkIcon sx={{ fontSize: '0.7rem' }} />}
                    label="CAPA Linked"
                    size="small"
                    sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                  />
                </Tooltip>
              )}
            </Paper>

            {/* Header Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                NCR Header
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>NCR Number</Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                        {ncrData.ncr_number}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Severity</Typography>
                      <Chip
                        icon={<ErrorIcon sx={{ fontSize: '0.7rem' }} />}
                        label={ncrData.severity}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 500,
                          bgcolor: `${getSeverityColor(ncrData.severity)}20`,
                          color: getSeverityColor(ncrData.severity)
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>NCR Type:</Typography>
                    <Chip
                      label={ncrData.ncr_type}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 500,
                        bgcolor: `${COLORS.primary}15`,
                        color: COLORS.primary
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Basic Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <CategoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>NCR Date</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formatDate(ncrData.ncr_date)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Source Inspection</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {ncrData.source_inspection_manual || (ncrData.source_inspection_id?.inspection_type || 'Not specified')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Item Details Section */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Item Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {ncrData.part_no || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Drawing Number</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {ncrData.drawing_no || '-'} {ncrData.drawing_revision ? `Rev ${ncrData.drawing_revision}` : ''}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Quantity</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {ncrData.quantity || 0} {ncrData.quantity_unit || 'Nos'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rejected Quantity</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.severity.Critical }}>
                    {ncrData.rejected_qty || 0} {ncrData.quantity_unit || 'Nos'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lot/Batch Number</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {ncrData.lot_no || '-'}
                  </Typography>
                </Grid>
              </Grid>

              {(ncrData.vendor_id || ncrData.customer_id) && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {ncrData.vendor_id && (
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          <LocalShippingIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                          Vendor
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {typeof ncrData.vendor_id === 'object' ? ncrData.vendor_id.vendor_name : ncrData.vendor_id}
                        </Typography>
                      </Box>
                    )}
                    {ncrData.customer_id && (
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          <BusinessIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                          Customer
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {typeof ncrData.customer_id === 'object' ? ncrData.customer_id.customer_name : ncrData.customer_id}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {(ncrData.grn_id || ncrData.wo_id) && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {ncrData.grn_id && (
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>GRN Number</Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {typeof ncrData.grn_id === 'object' ? ncrData.grn_id.grn_number : ncrData.grn_id}
                        </Typography>
                      </Box>
                    )}
                    {ncrData.wo_id && (
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Order</Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {typeof ncrData.wo_id === 'object' ? ncrData.wo_id.wo_number : ncrData.wo_id}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Paper>

            {/* Defect Information Section */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <WarningIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Defect Information
              </Typography>
              
              {ncrData.defect_codes && ncrData.defect_codes.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                    Defect Codes
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {ncrData.defect_codes.map((code, idx) => (
                      <Chip
                        key={idx}
                        label={`${code.code} - ${code.name}`}
                        size="small"
                        sx={{ fontSize: '0.7rem', bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                  Defect Description
                </Typography>
                <Paper sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.light, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                    {ncrData.defect_description || 'No description provided'}
                  </Typography>
                </Paper>
              </Box>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Detected At</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {ncrData.detected_at_operation || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Immediate Action</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {ncrData.immediate_action || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Disposition</Typography>
                  <Chip 
                    label={ncrData.disposition || 'Not Specified'} 
                    size="small" 
                    sx={{ mt: 0.5, fontSize: '0.7rem' }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Estimated Loss</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.severity.Critical }}>
                    {formatCurrency(ncrData.estimated_loss)}
                  </Typography>
                </Grid>
              </Grid>

              {ncrData.disposition === 'Concession' && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Concession Details
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Concession Number</Typography>
                      <Typography sx={{ fontSize: '0.75rem' }}>{ncrData.concession_number || '-'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Customer Concession No</Typography>
                      <Typography sx={{ fontSize: '0.75rem' }}>{ncrData.customer_concession_no || '-'}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {/* CAPA Section */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                CAPA Details
              </Typography>
              
              {capaData ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>CAPA Number</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {capaData.capa_number}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                      Root Cause Analysis
                    </Typography>
                    <Paper sx={{ 
                      p: 1.5, 
                      bgcolor: COLORS.background.light, 
                      borderRadius: 1.5,
                      border: `1px solid ${COLORS.border}`
                    }}>
                      <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                        {capaData.root_cause || '-'}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                      Corrective Action
                    </Typography>
                    <Paper sx={{ 
                      p: 1.5, 
                      bgcolor: COLORS.background.light, 
                      borderRadius: 1.5,
                      border: `1px solid ${COLORS.border}`
                    }}>
                      <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                        {capaData.corrective_action || '-'}
                      </Typography>
                    </Paper>
                  </Box>

                  {capaData.preventive_action && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                        Preventive Action
                      </Typography>
                      <Paper sx={{ 
                        p: 1.5, 
                        bgcolor: COLORS.background.light, 
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`
                      }}>
                        <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                          {capaData.preventive_action}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Responsible Person</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {capaData.responsible_person || '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Target Completion Date</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {formatDate(capaData.target_completion_date)}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              ) : ncrData.root_cause ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                      Root Cause Analysis
                    </Typography>
                    <Paper sx={{ 
                      p: 1.5, 
                      bgcolor: COLORS.background.light, 
                      borderRadius: 1.5,
                      border: `1px solid ${COLORS.border}`
                    }}>
                      <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                        {ncrData.root_cause || '-'}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                      Corrective Action
                    </Typography>
                    <Paper sx={{ 
                      p: 1.5, 
                      bgcolor: COLORS.background.light, 
                      borderRadius: 1.5,
                      border: `1px solid ${COLORS.border}`
                    }}>
                      <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                        {ncrData.corrective_action || '-'}
                      </Typography>
                    </Paper>
                  </Box>

                  {ncrData.preventive_action && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                        Preventive Action
                      </Typography>
                      <Paper sx={{ 
                        p: 1.5, 
                        bgcolor: COLORS.background.light, 
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`
                      }}>
                        <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                          {ncrData.preventive_action}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Responsible Person</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {ncrData.responsible_person || '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Target Completion Date</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {formatDate(ncrData.target_completion_date)}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No CAPA details available for this NCR
                </Typography>
              )}
            </Paper>

            {/* Audit Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <TimelineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Audit Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {ncrData.created_by?.name || ncrData.created_by?.username || 'System'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(ncrData.createdAt)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {ncrData.updated_by?.name || ncrData.updated_by?.username || 'System'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated At</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(ncrData.updatedAt)}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Remarks Section */}
            {ncrData.remarks && (
              <Paper sx={{ 
                p: 2, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5 
                }}>
                  <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Additional Remarks
                </Typography>
                <Paper sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.light, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {ncrData.remarks}
                  </Typography>
                </Paper>
              </Paper>
            )}
          </Stack>
        );

      default:
        return null;
    }
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
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: ncrData ? getAvatarColor(ncrData.severity) : COLORS.primary,
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            {ncrData ? getNcrInitials(ncrData.ncr_number) : 'NC'}
          </Avatar>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            NCR Details
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading NCR details...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        ) : ncrData ? (
          renderStepContent(activeStep)
        ) : null}
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
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
            onClick={onClose}
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
            Close
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={onClose}
              size="small"
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
              Done
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
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
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewNcr;