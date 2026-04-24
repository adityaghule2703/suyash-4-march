// AddQualityCert.jsx
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
  TextField,
  Alert,
  CircularProgress,
  MenuItem,
  Box,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  FormControl,
  InputLabel,
  Select,
  Autocomplete
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  QrCode as QrCodeIcon,
  LocalShipping as LocalShippingIcon,
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E6F4F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

// Certificate Types
const CERTIFICATE_TYPES = [
  { value: 'Certificate of Conformance', label: 'Certificate of Conformance', description: 'General conformance statement' },
  { value: 'Test Report', label: 'Test Report', description: 'Includes actual measured values' },
  { value: 'Material Certificate', label: 'Material Certificate', description: 'Raw material test results' },
  { value: 'Dimensional Report', label: 'Dimensional Report', description: 'Full dimensional inspection results' },
  { value: 'Plating Certificate', label: 'Plating Certificate', description: 'Plating thickness and adhesion results' },
  { value: 'FAI Report', label: 'FAI Report', description: 'First Article Inspection report' },
  { value: 'PPAP Report', label: 'PPAP Report', description: 'Production Part Approval Process package' }
];

const STEPS = ['Select Reference', 'Certificate Details', 'Review & Generate'];

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: { backgroundColor: COLORS.primary },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: { backgroundColor: COLORS.primary },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const AddQualityCert = ({ open, onClose, onCertificateGenerated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  const [generatedCert, setGeneratedCert] = useState(null);
  
  const [salesOrders, setSalesOrders] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [finalInspections, setFinalInspections] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const [formData, setFormData] = useState({
    cert_type: '',
    so_id: '',
    wo_id: '',
    dc_id: '',
    final_inspection_id: '',
    customer_po_number: '',
    lot_no: '',
    material_grade: '',
    heat_no: '',
    mill_cert_ref: '',
    batch_no: '',
    declaration: ''
  });

  const [touched, setTouched] = useState({
    cert_type: false,
    so_id: false
  });

  useEffect(() => {
    if (open) {
      fetchInitialData();
    }
  }, [open]);

  const fetchInitialData = async () => {
    setLoadingData(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all data without filters first to debug
      const [soRes, woRes, dcRes, inspectionRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/sales-orders?limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/work-orders?limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/delivery-challans?limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/inspection-records/final?limit=100`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      console.log('Sales Orders Response:', soRes.data);
      console.log('Work Orders Response:', woRes.data);
      console.log('Delivery Challans Response:', dcRes.data);
      console.log('Inspections Response:', inspectionRes.data);
      
      if (soRes.data.success) {
        // Show all SOs for testing, then filter if needed
        const allSOs = soRes.data.data || [];
        const eligibleSOs = allSOs.filter(so => 
          so.status === 'Ready for Dispatch' || so.status === 'Fully Delivered' || so.status === 'Confirmed'
        );
        setSalesOrders(eligibleSOs.length > 0 ? eligibleSOs : allSOs);
        console.log('Filtered SOs:', eligibleSOs.length > 0 ? eligibleSOs : allSOs);
      }
      
      if (woRes.data.success) {
        const allWOs = woRes.data.data || [];
        const eligibleWOs = allWOs.filter(wo => 
          wo.status === 'Completed'
        );
        setWorkOrders(eligibleWOs.length > 0 ? eligibleWOs : allWOs);
        console.log('Filtered WOs:', eligibleWOs.length > 0 ? eligibleWOs : allWOs);
      }
      
      if (dcRes.data.success) {
        const allDCs = dcRes.data.data || [];
        const eligibleDCs = allDCs.filter(dc => 
          dc.status === 'Inspected' || dc.status === 'Closed' || dc.status === 'Delivered'
        );
        setDeliveryChallans(eligibleDCs.length > 0 ? eligibleDCs : allDCs);
        console.log('Filtered DCs:', eligibleDCs.length > 0 ? eligibleDCs : allDCs);
      }
      
      if (inspectionRes.data.success) {
        const allInspections = inspectionRes.data.data || [];
        const eligibleInspections = allInspections.filter(insp => 
          insp.overall_result === 'Accepted' || insp.overall_result === 'Pass'
        );
        setFinalInspections(eligibleInspections.length > 0 ? eligibleInspections : allInspections);
        console.log('Filtered Inspections:', eligibleInspections.length > 0 ? eligibleInspections : allInspections);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load required data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setTouched(prev => ({ ...prev, [field]: false }));
    }
    if (error) setError('');
    if (success) setSuccess('');
    if (generatedCert) setGeneratedCert(null);
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleAutoFillFromSO = (soId) => {
    const selectedSO = salesOrders.find(so => so._id === soId);
    if (selectedSO) {
      setFormData(prev => ({
        ...prev,
        customer_po_number: selectedSO.customer_po_number || '',
        lot_no: selectedSO.so_number || ''
      }));
    }
  };

  const handleAutoFillFromWO = (woId) => {
    const selectedWO = workOrders.find(wo => wo._id === woId);
    if (selectedWO) {
      setFormData(prev => ({
        ...prev,
        lot_no: selectedWO.wo_number || '',
        so_id: selectedWO.so_id || ''
      }));
      if (selectedWO.so_id) {
        handleAutoFillFromSO(selectedWO.so_id);
      }
    }
  };

  const handleAutoFillFromDC = (dcId) => {
    const selectedDC = deliveryChallans.find(dc => dc._id === dcId);
    if (selectedDC) {
      setFormData(prev => ({
        ...prev,
        so_id: selectedDC.so_id || '',
        customer_po_number: selectedDC.customer_po_number || ''
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.cert_type) {
          setError('Please select a certificate type');
          setTouched(prev => ({ ...prev, cert_type: true }));
          return false;
        }
        setError('');
        return true;

      case 1:
        setError('');
        return true;

      case 2:
        if (!formData.cert_type) {
          setError('Certificate type is required');
          return false;
        }
        setError('');
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        cert_type: formData.cert_type,
        so_id: formData.so_id || undefined,
        wo_id: formData.wo_id || undefined,
        dc_id: formData.dc_id || undefined,
        final_inspection_id: formData.final_inspection_id || undefined,
        customer_po_number: formData.customer_po_number || '',
        lot_no: formData.lot_no || '',
        material_grade: formData.material_grade || '',
        heat_no: formData.heat_no || '',
        mill_cert_ref: formData.mill_cert_ref || '',
        batch_no: formData.batch_no || '',
        declaration: formData.declaration || ''
      };
      
      const response = await axios.post(`${BASE_URL}/api/quality-certificates`, payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setSuccess('Certificate generated successfully!');
        setGeneratedCert(response.data.data);
        if (onCertificateGenerated) {
          onCertificateGenerated(response.data.data);
        }
      } else {
        setError(response.data.message || 'Failed to generate certificate');
      }
    } catch (err) {
      console.error('Error generating certificate:', err);
      setError(err.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      cert_type: '',
      so_id: '',
      wo_id: '',
      dc_id: '',
      final_inspection_id: '',
      customer_po_number: '',
      lot_no: '',
      material_grade: '',
      heat_no: '',
      mill_cert_ref: '',
      batch_no: '',
      declaration: ''
    });
    setTouched({
      cert_type: false,
      so_id: false
    });
    setError('');
    setSuccess('');
    setGeneratedCert(null);
    setActiveStep(0);
    onClose();
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary },
    '& .MuiInputLabel-root': { fontSize: '0.7rem', color: COLORS.text.secondary },
    '& .MuiInputLabel-root.Mui-focused': { color: COLORS.primary, fontSize: '0.7rem' }
  };

  const labelStyle = { fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', mb: 0.5 };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* Info Banner */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Quality Certificate Generation
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                Generate Certificate of Conformance (CoC) or Test Report for finished goods.
                Prerequisites: Final inspection must be Accepted, Work Order must be completed.
              </Typography>
            </Paper>

            {/* Certificate Type Selection */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                Certificate Type <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Grid container spacing={1.5}>
                {CERTIFICATE_TYPES.map((type) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={type.value}>
                    <Paper
                      onClick={() => handleChange('cert_type', type.value)}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderRadius: 1.5,
                        border: `1.5px solid ${formData.cert_type === type.value ? COLORS.primary : COLORS.border}`,
                        bgcolor: formData.cert_type === type.value ? `${COLORS.primary}10` : COLORS.background.white,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: COLORS.primary,
                          bgcolor: `${COLORS.primary}05`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <DescriptionIcon sx={{ fontSize: '0.9rem', color: formData.cert_type === type.value ? COLORS.primary : COLORS.text.tertiary }} />
                        <Typography sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          color: formData.cert_type === type.value ? COLORS.primary : COLORS.text.primary 
                        }}>
                          {type.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, lineHeight: 1.3 }}>
                        {type.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              {touched.cert_type && !formData.cert_type && (
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 1 }}>
                  Please select a certificate type
                </Typography>
              )}
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            {/* Reference Documents */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <AssignmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Reference Documents (Optional)
              </Typography>
              
              <Grid container spacing={2}>
                {/* Sales Order */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Sales Order (SO)</Typography>
                  <Autocomplete
                    options={salesOrders}
                    getOptionLabel={(option) => `${option.so_number} - ${option.customer_name || option.customer_name}`}
                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                    loading={loadingData}
                    value={salesOrders.find(so => so._id === formData.so_id) || null}
                    onChange={(event, newValue) => {
                      handleChange('so_id', newValue?._id || '');
                      if (newValue) handleAutoFillFromSO(newValue._id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select SO"
                        sx={inputStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <InputAdornment position="start"><BusinessIcon sx={{ fontSize: '0.7rem' }} /></InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Work Order */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Work Order (WO)</Typography>
                  <Autocomplete
                    options={workOrders}
                    getOptionLabel={(option) => `${option.wo_number} - ${option.part_no}`}
                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                    loading={loadingData}
                    value={workOrders.find(wo => wo._id === formData.wo_id) || null}
                    onChange={(event, newValue) => {
                      handleChange('wo_id', newValue?._id || '');
                      if (newValue) handleAutoFillFromWO(newValue._id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select WO"
                        sx={inputStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <InputAdornment position="start"><QrCodeIcon sx={{ fontSize: '0.7rem' }} /></InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Delivery Challan */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Delivery Challan (DC)</Typography>
                  <Autocomplete
                    options={deliveryChallans}
                    getOptionLabel={(option) => `${option.dc_number} - ${option.customer_name}`}
                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                    loading={loadingData}
                    value={deliveryChallans.find(dc => dc._id === formData.dc_id) || null}
                    onChange={(event, newValue) => {
                      handleChange('dc_id', newValue?._id || '');
                      if (newValue) handleAutoFillFromDC(newValue._id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select DC"
                        sx={inputStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <InputAdornment position="start"><LocalShippingIcon sx={{ fontSize: '0.7rem' }} /></InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Final Inspection */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Final Inspection</Typography>
                  <Autocomplete
                    options={finalInspections}
                    getOptionLabel={(option) => `${option.inspection_id || option._id} - ${option.part_no} (${option.overall_result || 'Pending'})`}
                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                    loading={loadingData}
                    value={finalInspections.find(insp => insp._id === formData.final_inspection_id) || null}
                    onChange={(event, newValue) => handleChange('final_inspection_id', newValue?._id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select Inspection"
                        sx={inputStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <InputAdornment position="start"><CheckCircleIcon sx={{ fontSize: '0.7rem' }} /></InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              
              {/* Show message if no data available */}
              {salesOrders.length === 0 && workOrders.length === 0 && deliveryChallans.length === 0 && finalInspections.length === 0 && !loadingData && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.7rem' }}>
                  No reference documents available. You can still generate a certificate without selecting references.
                </Alert>
              )}
            </Paper>

            {/* Certificate Details */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Certificate Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Customer PO Number</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.customer_po_number}
                    onChange={(e) => handleChange('customer_po_number', e.target.value)}
                    placeholder="Customer PO reference"
                    sx={inputStyle}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Lot/Batch Number</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.lot_no}
                    onChange={(e) => handleChange('lot_no', e.target.value)}
                    placeholder="Lot or batch number"
                    sx={inputStyle}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={labelStyle}>Material Grade</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.material_grade}
                    onChange={(e) => handleChange('material_grade', e.target.value)}
                    placeholder="e.g., C11000, SS304"
                    sx={inputStyle}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={labelStyle}>Heat Number</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.heat_no}
                    onChange={(e) => handleChange('heat_no', e.target.value)}
                    placeholder="Heat/Treatment number"
                    sx={inputStyle}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={labelStyle}>Mill Certificate Reference</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.mill_cert_ref}
                    onChange={(e) => handleChange('mill_cert_ref', e.target.value)}
                    placeholder="Mill certificate reference"
                    sx={inputStyle}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Declaration / Notes</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    value={formData.declaration}
                    onChange={(e) => handleChange('declaration', e.target.value)}
                    placeholder="Additional declaration or notes for the certificate..."
                    sx={inputStyle}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Prerequisites Check */}
            {(formData.so_id || formData.wo_id || formData.dc_id) && (
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  Reference documents selected. The certificate will be generated based on the selected references.
                </Typography>
              </Alert>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Ready to Generate Certificate?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Please review the information before generating the certificate.
              </Typography>
            </Paper>

            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1.5, color: COLORS.primary }}>
                  Certificate Summary
                </Typography>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Certificate Type</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formData.cert_type || '-'}</Typography>
                </Box>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Customer PO Number</Typography>
                  <Typography sx={{ fontSize: '0.75rem' }}>{formData.customer_po_number || '-'}</Typography>
                </Box>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Lot/Batch Number</Typography>
                  <Typography sx={{ fontSize: '0.75rem' }}>{formData.lot_no || '-'}</Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {formData.so_id && <Chip label="SO Selected" size="small" sx={{ fontSize: '0.6rem', height: 22 }} />}
                  {formData.wo_id && <Chip label="WO Selected" size="small" sx={{ fontSize: '0.6rem', height: 22 }} />}
                  {formData.dc_id && <Chip label="DC Selected" size="small" sx={{ fontSize: '0.6rem', height: 22 }} />}
                  {formData.final_inspection_id && <Chip label="Inspection Selected" size="small" sx={{ fontSize: '0.6rem', height: 22 }} />}
                </Box>
              </CardContent>
            </Card>

            {generatedCert && (
              <Alert 
                severity="success" 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    startIcon={<DownloadIcon />}
                    onClick={() => window.open(`${BASE_URL}${generatedCert.certificate_path}`, '_blank')}
                  >
                    Download
                  </Button>
                }
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  Certificate generated: {generatedCert.cert_id}
                </Typography>
              </Alert>
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
          <DescriptionIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Generate Quality Certificate
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: COLORS.text.tertiary,
            '&:hover': { color: COLORS.text.secondary }
          }}
        >
          <CloseIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {STEPS.map((label) => (
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loadingData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading data...
            </Typography>
          </Box>
        ) : (
          <>
            {renderStepContent(activeStep)}
            
            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
                  mt: 2,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {error}
              </Alert>
            )}

            {success && !generatedCert && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 1.5,
                  mt: 2,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {success}
              </Alert>
            )}
          </>
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
          disabled={activeStep === 0 || loading || loadingData}
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

          {activeStep === STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || loadingData || !formData.cert_type}
              startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <DescriptionIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark },
                '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
              }}
            >
              {loading ? 'Generating...' : 'Generate Certificate'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || loadingData}
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

export default AddQualityCert;