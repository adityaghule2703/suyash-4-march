// AddNcr.jsx
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
  FormControl,
  Select,
  Chip,
  OutlinedInput,
  FormHelperText,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
  severity: {
    Critical: '#EF4444',
    Major: '#F59E0B',
    Minor: '#10B981'
  }
};

const NCR_TYPES = ['Incoming', 'In-Process', 'Final Inspection', 'Customer Return'];
const STATUS_OPTIONS = ['Open', 'Under Investigation', 'Disposition Given', 'CAPA Initiated', 'Pending Verification', 'Closed', 'Escalated'];
const SEVERITY_OPTIONS = ['Critical', 'Major', 'Minor'];
const QUANTITY_UNITS = ['Kg', 'Nos', 'Meters', 'Liters', 'Pieces', 'Sets'];
const DISPOSITION_OPTIONS = ['Use As Is', 'Rework', 'Return to Vendor', 'Scrap', 'Concession'];
const steps = ['Basic Information', 'Defect Details', 'CAPA & Review'];

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

const AddNCR = ({ open, onClose, onNcrAdded }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepErrors, setStepErrors] = useState({});
  
  const [grnList, setGrnList] = useState([]);
  const [woList, setWoList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [defectCodeList, setDefectCodeList] = useState([]);
  const [inspectionList, setInspectionList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  
  const [grnItems, setGrnItems] = useState([]);
  const [manualInspection, setManualInspection] = useState(false);
  const [manualInspectionText, setManualInspectionText] = useState('');
  
  const [formData, setFormData] = useState({
    ncr_type: '',
    severity: '',
    source_inspection_id: '',
    source_inspection_manual: '',
    item_id: '',
    part_no: '',
    drawing_no: '',
    drawing_revision: '',
    quantity: '',
    quantity_unit: 'Nos',
    lot_no: '',
    grn_id: '',
    po_id: '',
    wo_id: '',
    vendor_id: '',
    customer_id: '',
    defect_codes: [],
    defect_description: '',
    detected_at_operation: '',
    immediate_action: '',
    rejected_qty: '',
    estimated_loss: '',
    disposition: '',
    disposition_basis: '',
    concession_number: '',
    customer_concession_no: '',
    root_cause: '',
    corrective_action: '',
    preventive_action: '',
    responsible_person: '',
    target_completion_date: null,
    remarks: '',
    ncr_date: new Date(),
    status: 'Open'
  });

  const [touched, setTouched] = useState({
    ncr_type: false,
    severity: false,
    part_no: false,
    quantity: false,
    defect_description: false,
    detected_at_operation: false
  });

  useEffect(() => {
    if (open) {
      fetchInitialData();
    }
  }, [open]);

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      
      const [grnRes, woRes, vendorRes, customerRes, defectRes, inspectionRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/grns`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/work-orders`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/vendors`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/customers`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/defect-codes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/inspection-records/all`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (grnRes.data.success) setGrnList(grnRes.data.data || []);
      if (woRes.data.success) setWoList(woRes.data.data || []);
      if (vendorRes.data.success) setVendorList(vendorRes.data.data || []);
      if (customerRes.data.success) setCustomerList(customerRes.data.data || []);
      
      // Format defect codes for better handling
      if (defectRes.data.success && defectRes.data.data) {
        const formattedCodes = defectRes.data.data.map(code => ({
          ...code,
          displayLabel: `${code.defect_code} - ${code.defect_name}`
        }));
        setDefectCodeList(formattedCodes);
      }
      
      if (inspectionRes.data.success) {
        console.log('Inspection records fetched:', inspectionRes.data.data);
        setInspectionList(inspectionRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load required data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleGRNChange = async (grnId) => {
    if (!grnId) return;
    
    setFetchingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/grns/${grnId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const grn = response.data.data;
        
        if (grn.vendor_id) {
          const vendorId = grn.vendor_id._id || grn.vendor_id;
          setFormData(prev => ({ ...prev, vendor_id: vendorId }));
        }
        if (grn.po_id) {
          const poId = grn.po_id._id || grn.po_id;
          setFormData(prev => ({ ...prev, po_id: poId }));
        }
        
        const items = grn.items || [];
        const formattedItems = items.map((item, index) => ({
          id: item._id || index,
          item_id: item.item_id?._id || item.item_id || '',
          part_no: item.part_no || '',
          drawing_no: item.drawing_no || '',
          drawing_revision: item.drawing_revision || '',
          quantity: item.received_qty || 0,
          quantity_unit: item.unit || 'Nos',
          lot_no: item.batch_no || '',
        }));
        
        setGrnItems(formattedItems);
        
        setFormData(prev => ({
          ...prev,
          item_id: '',
          part_no: '',
          drawing_no: '',
          drawing_revision: '',
          quantity: '',
          quantity_unit: 'Nos',
          lot_no: ''
        }));
      }
    } catch (err) {
      console.error('Error fetching GRN details:', err);
      setError('Failed to load GRN details');
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleGRNItemChange = (selectedItemId) => {
    const selectedItem = grnItems.find(item => item.id === selectedItemId);
    
    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        item_id: selectedItem.item_id,
        part_no: selectedItem.part_no,
        drawing_no: selectedItem.drawing_no || '',
        drawing_revision: selectedItem.drawing_revision || '',
        quantity: selectedItem.quantity,
        quantity_unit: selectedItem.quantity_unit,
        lot_no: selectedItem.lot_no
      }));
    }
  };

  const handleWOChange = async (woId) => {
    if (!woId) return;
    
    setFetchingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/work-orders/${woId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const wo = response.data.data;
        
        setFormData(prev => ({
          ...prev,
          item_id: wo.item_id?._id || wo.item_id || '',
          part_no: wo.part_no || '',
          drawing_no: wo.drawing_no || '',
          drawing_revision: wo.drawing_revision || '',
          quantity: wo.planned_qty || '',
          quantity_unit: 'Nos',
          lot_no: wo.lot_no || '',
          customer_id: wo.customer_id?._id || wo.customer_id || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching Work Order details:', err);
      setError('Failed to load Work Order details');
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) setTouched(prev => ({ ...prev, [field]: false }));
    if (error) setError("");
    if (stepErrors[activeStep]) setStepErrors(prev => ({ ...prev, [activeStep]: false }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleDefectCodesChange = (event) => {
    const selectedValues = event.target.value;
    // Store the full defect code objects
    setFormData(prev => ({ ...prev, defect_codes: selectedValues }));
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0:
        if (!formData.ncr_type) errors.ncr_type = 'NCR type is required';
        if (!formData.severity) errors.severity = 'Severity is required';
        if (!formData.part_no) errors.part_no = 'Part number is required';
        if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Valid quantity is required';
        
        if (formData.ncr_type === 'Incoming' && !formData.grn_id) {
          errors.grn_id = 'GRN is required for Incoming NCR';
        }
        if ((formData.ncr_type === 'In-Process' || formData.ncr_type === 'Final Inspection') && !formData.wo_id) {
          errors.wo_id = 'Work Order is required for this NCR type';
        }
        
        if (Object.keys(errors).length > 0) {
          setError(Object.values(errors)[0]);
          setStepErrors(prev => ({ ...prev, [step]: true }));
          return false;
        }
        break;

      case 1:
        if (!formData.defect_description?.trim()) {
          errors.defect_description = 'Defect description is required';
        }
        if (!formData.detected_at_operation?.trim()) {
          errors.detected_at_operation = 'Detection point is required';
        }
        if (formData.rejected_qty && formData.quantity && Number(formData.rejected_qty) > Number(formData.quantity)) {
          errors.rejected_qty = 'Rejected quantity cannot exceed total quantity';
        }
        
        if (Object.keys(errors).length > 0) {
          setError(Object.values(errors)[0]);
          setStepErrors(prev => ({ ...prev, [step]: true }));
          return false;
        }
        break;

      case 2:
        if ((formData.severity === 'Critical' || formData.severity === 'Major') && 
            (!formData.root_cause?.trim() || !formData.corrective_action?.trim())) {
          setError('Root Cause and Corrective Action are required for Critical/Major severity');
          setStepErrors(prev => ({ ...prev, [step]: true }));
          return false;
        }
        break;
    }
    
    setError('');
    setStepErrors(prev => ({ ...prev, [step]: false }));
    return true;
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
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        setActiveStep(i);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const requestBody = {
        ncr_type: formData.ncr_type,
        severity: formData.severity,
        source_inspection_id: manualInspection ? null : (formData.source_inspection_id || undefined),
        source_inspection_manual: manualInspection ? manualInspectionText : '',
        item_id: formData.item_id,
        part_no: formData.part_no,
        drawing_no: formData.drawing_no || '',
        drawing_revision: formData.drawing_revision || '',
        quantity: Number(formData.quantity),
        quantity_unit: formData.quantity_unit,
        lot_no: formData.lot_no || '',
        defect_codes: formData.defect_codes.map(dc => ({
          code: dc.defect_code,
          name: dc.defect_name,
          category: dc.defect_category
        })),
        defect_description: formData.defect_description,
        detected_at_operation: formData.detected_at_operation,
        immediate_action: formData.immediate_action || '',
        rejected_qty: Number(formData.rejected_qty) || 0,
        estimated_loss: Number(formData.estimated_loss) || 0,
        ncr_date: formData.ncr_date.toISOString(),
        status: formData.status
      };

      if (formData.ncr_type === 'Incoming') {
        requestBody.grn_id = formData.grn_id;
        requestBody.po_id = formData.po_id;
        requestBody.vendor_id = formData.vendor_id;
      }
      
      if (formData.ncr_type === 'In-Process' || formData.ncr_type === 'Final Inspection') {
        requestBody.wo_id = formData.wo_id;
        requestBody.customer_id = formData.customer_id;
      }

      if (formData.disposition) {
        requestBody.disposition = formData.disposition;
      }
      if (formData.disposition_basis) {
        requestBody.disposition_basis = formData.disposition_basis;
      }
      if (formData.concession_number) {
        requestBody.concession_number = formData.concession_number;
      }
      if (formData.customer_concession_no) {
        requestBody.customer_concession_no = formData.customer_concession_no;
      }

      if (formData.severity === 'Critical' || formData.severity === 'Major') {
        requestBody.root_cause = formData.root_cause;
        requestBody.corrective_action = formData.corrective_action;
        requestBody.preventive_action = formData.preventive_action || '';
        requestBody.responsible_person = formData.responsible_person || '';
        if (formData.target_completion_date) {
          requestBody.target_completion_date = formData.target_completion_date.toISOString();
        }
      }

      if (formData.remarks) {
        requestBody.remarks = formData.remarks;
      }

      console.log('Submitting NCR:', requestBody);

      const response = await axios.post(`${BASE_URL}/api/ncrs`, requestBody, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        if (onNcrAdded) onNcrAdded(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to create NCR');
      }
    } catch (err) {
      console.error('Error creating NCR:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).join(', ');
        setError(errorMessages);
      } else {
        setError('Failed to create NCR. Please check all required fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      ncr_type: '', severity: '', source_inspection_id: '', source_inspection_manual: '', item_id: '', part_no: '', drawing_no: '', drawing_revision: '',
      quantity: '', quantity_unit: 'Nos', lot_no: '', grn_id: '', po_id: '', wo_id: '', vendor_id: '', customer_id: '',
      defect_codes: [], defect_description: '', detected_at_operation: '', immediate_action: '', rejected_qty: '',
      estimated_loss: '', disposition: '', disposition_basis: '', concession_number: '', customer_concession_no: '',
      root_cause: '', corrective_action: '', preventive_action: '', responsible_person: '', target_completion_date: null,
      remarks: '', ncr_date: new Date(), status: 'Open'
    });
    setGrnItems([]);
    setManualInspection(false);
    setManualInspectionText('');
    setTouched({ 
      ncr_type: false, severity: false, part_no: false, quantity: false, 
      defect_description: false, detected_at_operation: false 
    });
    setError('');
    setActiveStep(0);
    setStepErrors({});
    onClose();
  };

  const showReferenceDocuments = () => formData.ncr_type !== 'Customer Return';

  const getInspectionDisplayText = (inspection) => {
    const inspectionType = inspection.inspection_type || inspection.type || 'Inspection';
    const partNo = inspection.part_no || inspection.item_part_no || inspection.material_code || 'No Part';
    const result = inspection.overall_result || inspection.status || inspection.result || 'Pending';
    const date = inspection.inspection_date || inspection.createdAt || inspection.date;
    const formattedDate = date ? new Date(date).toLocaleDateString() : '';
    const supplier = inspection.supplier_name || inspection.vendor_name || '';
    const additional = supplier ? ` - ${supplier}` : '';
    return `${inspectionType} - ${partNo} (${result})${formattedDate ? ` - ${formattedDate}` : ''}${additional}`;
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

  const getSelectedItemId = () => {
    const selectedItem = grnItems.find(item => item.item_id === formData.item_id);
    return selectedItem ? selectedItem.id : '';
  };

  // Check if defect codes are loaded
  const isDefectCodesLoaded = defectCodeList.length > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
        
        <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, bgcolor: COLORS.background.white,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>Create NCR</Typography>
          <IconButton size="small" onClick={handleClose} disabled={loading} sx={{ color: COLORS.text.tertiary }}>
            <CloseIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </DialogTitle>

        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel error={stepErrors[index]}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          {loadingData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress size={40} sx={{ color: COLORS.primary }} />
              <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>Loading data...</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {activeStep === 0 && (
                <>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                      <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                      NCR Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={labelStyle}>NCR TYPE <span style={{ color: '#EF4444' }}>*</span></Typography>
                          <TextField select fullWidth size="small" value={formData.ncr_type}
                            onChange={(e) => { 
                              handleChange('ncr_type', e.target.value); 
                              if (e.target.value === 'Customer Return') { 
                                handleChange('grn_id', ''); 
                                handleChange('wo_id', ''); 
                              }
                              if (e.target.value !== 'Incoming') {
                                setGrnItems([]);
                              }
                            }}
                            onBlur={() => handleBlur('ncr_type')} 
                            error={touched.ncr_type && !formData.ncr_type}
                            helperText={touched.ncr_type && !formData.ncr_type ? 'Required' : ''} 
                            sx={inputStyle}>
                            {NCR_TYPES.map(type => <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>)}
                          </TextField>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={labelStyle}>SEVERITY <span style={{ color: '#EF4444' }}>*</span></Typography>
                          <TextField select fullWidth size="small" value={formData.severity} 
                            onChange={(e) => handleChange('severity', e.target.value)}
                            onBlur={() => handleBlur('severity')} 
                            error={touched.severity && !formData.severity}
                            helperText={touched.severity && !formData.severity ? 'Required' : ''} 
                            sx={inputStyle}>
                            {SEVERITY_OPTIONS.map(sev => <MenuItem key={sev} value={sev} sx={{ fontSize: '0.75rem' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.severity[sev] }} />
                                {sev}
                              </Box>
                            </MenuItem>)}
                          </TextField>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={labelStyle}>NCR DATE</Typography>
                          <DatePicker value={formData.ncr_date} onChange={(date) => handleChange('ncr_date', date)}
                            slotProps={{ textField: { size: 'small', fullWidth: true, sx: inputStyle } }} />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={labelStyle}>STATUS</Typography>
                          <TextField select fullWidth size="small" value={formData.status} disabled sx={inputStyle}>
                            {STATUS_OPTIONS.map(status => <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>{status}</MenuItem>)}
                          </TextField>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {showReferenceDocuments() && (
                    <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                        <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                        Reference Documents
                      </Typography>
                      <Grid container spacing={2}>
                        {formData.ncr_type === 'Incoming' && (
                          <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography sx={labelStyle}>GRN NUMBER <span style={{ color: '#EF4444' }}>*</span></Typography>
                              <TextField select fullWidth size="small" value={formData.grn_id}
                                onChange={(e) => { 
                                  handleChange('grn_id', e.target.value); 
                                  handleGRNChange(e.target.value); 
                                }} 
                                sx={inputStyle}>
                                <MenuItem value="">Select GRN</MenuItem>
                                {grnList.map(grn => <MenuItem key={grn._id} value={grn._id} sx={{ fontSize: '0.75rem' }}>
                                  {grn.grn_number} - {grn.vendor_name}
                                </MenuItem>)}
                              </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography sx={labelStyle}>VENDOR</Typography>
                              <TextField select fullWidth size="small" value={formData.vendor_id} 
                                onChange={(e) => handleChange('vendor_id', e.target.value)} 
                                sx={inputStyle}>
                                <MenuItem value="">Select Vendor</MenuItem>
                                {vendorList.map(vendor => <MenuItem key={vendor._id} value={vendor._id} sx={{ fontSize: '0.75rem' }}>
                                  {vendor.vendor_name}
                                </MenuItem>)}
                              </TextField>
                            </Grid>
                            
                            {formData.grn_id && grnItems.length > 0 && (
                              <Grid size={{ xs: 12 }}>
                                <Typography sx={labelStyle}>GRN ITEMS <span style={{ color: '#EF4444' }}>*</span></Typography>
                                <TextField select fullWidth size="small" value={getSelectedItemId()}
                                  onChange={(e) => handleGRNItemChange(e.target.value)} 
                                  sx={inputStyle}>
                                  <MenuItem value="">Select Item</MenuItem>
                                  {grnItems.map((item) => (
                                    <MenuItem key={item.id} value={item.id} sx={{ fontSize: '0.75rem' }}>
                                      {item.part_no} (Qty: {item.quantity} {item.quantity_unit})
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                            )}
                          </>
                        )}
                        {(formData.ncr_type === 'In-Process' || formData.ncr_type === 'Final Inspection') && (
                          <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography sx={labelStyle}>WORK ORDER <span style={{ color: '#EF4444' }}>*</span></Typography>
                              <TextField select fullWidth size="small" value={formData.wo_id}
                                onChange={(e) => { handleChange('wo_id', e.target.value); handleWOChange(e.target.value); }} 
                                sx={inputStyle}>
                                <MenuItem value="">Select Work Order</MenuItem>
                                {woList.map(wo => <MenuItem key={wo._id} value={wo._id} sx={{ fontSize: '0.75rem' }}>
                                  {wo.wo_number} - {wo.part_no}
                                </MenuItem>)}
                              </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography sx={labelStyle}>CUSTOMER</Typography>
                              <TextField select fullWidth size="small" value={formData.customer_id} 
                                onChange={(e) => handleChange('customer_id', e.target.value)} 
                                sx={inputStyle}>
                                <MenuItem value="">Select Customer</MenuItem>
                                {customerList.map(customer => <MenuItem key={customer._id} value={customer._id} sx={{ fontSize: '0.75rem' }}>
                                  {customer.customer_name}
                                </MenuItem>)}
                              </TextField>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Paper>
                  )}

                  <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                      <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Inspection Record
                    </Typography>
                    
                    <RadioGroup 
                      row 
                      value={manualInspection ? 'manual' : 'select'} 
                      onChange={(e) => setManualInspection(e.target.value === 'manual')}
                      sx={{ mb: 2 }}
                    >
                      <FormControlLabel value="select" control={<Radio size="small" />} label="Select from records" />
                      <FormControlLabel value="manual" control={<Radio size="small" />} label="Enter manually" />
                    </RadioGroup>

                    <Collapse in={!manualInspection}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={labelStyle}>SOURCE INSPECTION</Typography>
                          <TextField 
                            select 
                            fullWidth 
                            size="small" 
                            value={formData.source_inspection_id}
                            onChange={(e) => handleChange('source_inspection_id', e.target.value)} 
                            sx={inputStyle}
                          >
                            <MenuItem value="">Select Inspection Record</MenuItem>
                            {inspectionList.length === 0 ? (
                              <MenuItem disabled>No inspection records found</MenuItem>
                            ) : (
                              inspectionList.map((inspection) => (
                                <MenuItem key={inspection._id} value={inspection._id} sx={{ fontSize: '0.75rem' }}>
                                  {getInspectionDisplayText(inspection)}
                                </MenuItem>
                              ))
                            )}
                          </TextField>
                          {inspectionList.length === 0 && !loadingData && (
                            <FormHelperText sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                              No inspection records available. Switch to manual entry.
                            </FormHelperText>
                          )}
                        </Grid>
                      </Grid>
                    </Collapse>

                    <Collapse in={manualInspection}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={labelStyle}>INSPECTION DETAILS</Typography>
                          <TextField 
                            fullWidth 
                            size="small" 
                            multiline
                            rows={2}
                            value={manualInspectionText}
                            onChange={(e) => setManualInspectionText(e.target.value)}
                            placeholder="Enter inspection details manually (e.g., Incoming inspection - Visual and dimensional check - 21/04/2026)"
                            helperText="You can enter inspection details manually if not available in the system"
                            sx={inputStyle}
                          />
                        </Grid>
                      </Grid>
                    </Collapse>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                      <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Item Details <span style={{ color: '#EF4444' }}>(Required: Part No, Quantity, Rejected Quantity)</span>
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>PART NO <span style={{ color: '#EF4444' }}>*</span></Typography>
                        <TextField fullWidth size="small" value={formData.part_no} 
                          onChange={(e) => handleChange('part_no', e.target.value)}
                          onBlur={() => handleBlur('part_no')}
                          error={touched.part_no && !formData.part_no}
                          helperText={touched.part_no && !formData.part_no ? 'Part number is required' : ''}
                          sx={inputStyle} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6}}>
                        <Typography sx={labelStyle}>DRAWING NO</Typography>
                        <TextField fullWidth size="small" value={formData.drawing_no} 
                          onChange={(e) => handleChange('drawing_no', e.target.value)} 
                          sx={inputStyle} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6}}>
                        <Typography sx={labelStyle}>DRAWING REVISION</Typography>
                        <TextField fullWidth size="small" value={formData.drawing_revision} 
                          onChange={(e) => handleChange('drawing_revision', e.target.value)} 
                          sx={inputStyle} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={labelStyle}>TOTAL QUANTITY <span style={{ color: '#EF4444' }}>*</span></Typography>
                        <TextField fullWidth size="small" type="number" value={formData.quantity} 
                          onChange={(e) => handleChange('quantity', e.target.value)}
                          onBlur={() => handleBlur('quantity')}
                          error={touched.quantity && (!formData.quantity || formData.quantity <= 0)}
                          helperText={touched.quantity && (!formData.quantity || formData.quantity <= 0) ? 'Valid quantity is required' : ''}
                          sx={inputStyle} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={labelStyle}>UNIT</Typography>
                        <TextField select fullWidth size="small" value={formData.quantity_unit} 
                          onChange={(e) => handleChange('quantity_unit', e.target.value)} 
                          sx={inputStyle}>
                          {QUANTITY_UNITS.map(unit => <MenuItem key={unit} value={unit} sx={{ fontSize: '0.75rem' }}>{unit}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={labelStyle}>REJECTED QUANTITY <span style={{ color: '#EF4444' }}>*</span></Typography>
                        <TextField fullWidth size="small" type="number" value={formData.rejected_qty} 
                          onChange={(e) => handleChange('rejected_qty', e.target.value)}
                          error={formData.rejected_qty && formData.quantity && Number(formData.rejected_qty) > Number(formData.quantity)}
                          helperText={formData.rejected_qty && formData.quantity && Number(formData.rejected_qty) > Number(formData.quantity) ? 'Cannot exceed total quantity' : ''}
                          sx={inputStyle} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={labelStyle}>LOT/BATCH NO</Typography>
                        <TextField fullWidth size="small" value={formData.lot_no} 
                          onChange={(e) => handleChange('lot_no', e.target.value)} 
                          sx={inputStyle} />
                      </Grid>
                    </Grid>
                  </Paper>
                </>
              )}

              {activeStep === 1 && (
                <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                    <WarningIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Defect Information <span style={{ color: '#EF4444' }}>(Required: Defect Description)</span>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>DEFECT CODES</Typography>
                      <FormControl fullWidth size="small">
                        <Select 
                          multiple 
                          value={formData.defect_codes} 
                          onChange={handleDefectCodesChange} 
                          input={<OutlinedInput sx={inputStyle} />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((code) => (
                                <Chip 
                                  key={code._id} 
                                  label={`${code.defect_code} - ${code.defect_name}`} 
                                  size="small" 
                                  sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }} 
                                />
                              ))}
                            </Box>
                          )}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                        >
                          {defectCodeList.length === 0 ? (
                            <MenuItem disabled>Loading defect codes...</MenuItem>
                          ) : (
                            defectCodeList.map((code) => (
                              <MenuItem key={code._id} value={code} sx={{ fontSize: '0.75rem' }}>
                                {code.defect_code} - {code.defect_name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        <FormHelperText sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Select one or more defect codes
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>DEFECT DESCRIPTION <span style={{ color: '#EF4444' }}>*</span></Typography>
                      <TextField fullWidth multiline rows={3} size="small" value={formData.defect_description}
                        onChange={(e) => handleChange('defect_description', e.target.value)} 
                        onBlur={() => handleBlur('defect_description')}
                        placeholder="Describe the defect in detail..." 
                        error={touched.defect_description && !formData.defect_description}
                        helperText={touched.defect_description && !formData.defect_description ? 'Defect description is required' : ''} 
                        sx={inputStyle} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>DETECTED AT <span style={{ color: '#EF4444' }}>*</span></Typography>
                      <TextField fullWidth size="small" value={formData.detected_at_operation}
                        onChange={(e) => handleChange('detected_at_operation', e.target.value)} 
                        onBlur={() => handleBlur('detected_at_operation')}
                        placeholder="e.g., Incoming inspection, Assembly line" 
                        error={touched.detected_at_operation && !formData.detected_at_operation}
                        helperText={touched.detected_at_operation && !formData.detected_at_operation ? 'Detection point is required' : ''} 
                        sx={inputStyle} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>IMMEDIATE ACTION TAKEN</Typography>
                      <TextField fullWidth multiline rows={2} size="small" value={formData.immediate_action}
                        onChange={(e) => handleChange('immediate_action', e.target.value)} 
                        placeholder="Describe immediate containment actions..." 
                        sx={inputStyle} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={labelStyle}>DISPOSITION</Typography>
                      <TextField select fullWidth size="small" value={formData.disposition} 
                        onChange={(e) => handleChange('disposition', e.target.value)} 
                        sx={inputStyle}>
                        <MenuItem value="">Select Disposition</MenuItem>
                        {DISPOSITION_OPTIONS.map(disp => <MenuItem key={disp} value={disp} sx={{ fontSize: '0.75rem' }}>{disp}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={labelStyle}>ESTIMATED LOSS (₹)</Typography>
                      <TextField fullWidth size="small" type="number" value={formData.estimated_loss}
                        onChange={(e) => handleChange('estimated_loss', e.target.value)} 
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} 
                        sx={inputStyle} />
                    </Grid>
                  </Grid>

                  {formData.disposition === 'Concession' && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth size="small" label="Concession Number" value={formData.concession_number}
                          onChange={(e) => handleChange('concession_number', e.target.value)} sx={inputStyle} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth size="small" label="Customer Concession No" value={formData.customer_concession_no}
                          onChange={(e) => handleChange('customer_concession_no', e.target.value)} sx={inputStyle} />
                      </Grid>
                    </Grid>
                  )}
                </Paper>
              )}

              {activeStep === 2 && (
                <Stack spacing={2}>
                  {(formData.severity === 'Critical' || formData.severity === 'Major') && (
                    <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                        <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                        CAPA Details (Required for Critical/Major Severity)
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={labelStyle}>ROOT CAUSE ANALYSIS <span style={{ color: '#EF4444' }}>*</span></Typography>
                          <TextField fullWidth multiline rows={2} size="small" value={formData.root_cause}
                            onChange={(e) => handleChange('root_cause', e.target.value)} 
                            placeholder="Identify the root cause..." 
                            sx={inputStyle} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={labelStyle}>CORRECTIVE ACTION <span style={{ color: '#EF4444' }}>*</span></Typography>
                          <TextField fullWidth multiline rows={2} size="small" value={formData.corrective_action}
                            onChange={(e) => handleChange('corrective_action', e.target.value)} 
                            placeholder="Actions to eliminate the cause..." 
                            sx={inputStyle} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={labelStyle}>PREVENTIVE ACTION</Typography>
                          <TextField fullWidth multiline rows={2} size="small" value={formData.preventive_action}
                            onChange={(e) => handleChange('preventive_action', e.target.value)} 
                            placeholder="Proactive measures..." 
                            sx={inputStyle} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography sx={labelStyle}>RESPONSIBLE PERSON</Typography>
                          <TextField fullWidth size="small" value={formData.responsible_person}
                            onChange={(e) => handleChange('responsible_person', e.target.value)} 
                            sx={inputStyle} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography sx={labelStyle}>TARGET COMPLETION DATE</Typography>
                          <DatePicker value={formData.target_completion_date} onChange={(date) => handleChange('target_completion_date', date)}
                            slotProps={{ textField: { size: 'small', fullWidth: true, sx: inputStyle } }} />
                        </Grid>
                      </Grid>
                    </Paper>
                  )}

                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle', color: COLORS.primary }} />
                      Ready to Submit?
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Please review all information before submitting. Once submitted, the NCR will be created and assigned a unique number.
                    </Typography>
                  </Paper>
                </Stack>
              )}
            </Stack>
          )}

          {error && <Alert severity="error" sx={{ borderRadius: 1.5, mt: 2, fontSize: '0.75rem', py: 0.5 }}>{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, justifyContent: 'space-between' }}>
          <Button onClick={handleBack} disabled={activeStep === 0 || loading} size="small" startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
            sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', textTransform: 'none' }}>
            Back
          </Button>
          <Box>
            <Button onClick={handleClose} disabled={loading} size="small" sx={{ height: 32, px: 2, mr: 1, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', textTransform: 'none' }}>
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSubmit} disabled={loading || loadingData || fetchingDetails}
                startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
                sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none', '&:hover': { bgcolor: COLORS.primaryDark } }}>
                {loading ? 'Creating...' : 'Create NCR'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} disabled={loading || loadingData} endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
                sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none', '&:hover': { bgcolor: COLORS.primaryDark } }}>
                Next
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddNCR;