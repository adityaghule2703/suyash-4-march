// EditPurchaseRequisition.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  InputAdornment,
  Chip,
  styled
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
  background: { white: '#FFFFFF', light: '#F8FFFC', hover: '#F0FDF9' },
  border: '#E3E8EF'
};

// Modern Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ['Basic Information', 'Items'];

const EditPurchaseRequisition = ({ open, onClose, pr, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
  const [formData, setFormData] = useState({
    pr_type: 'Material',
    source: 'Manual',
    mrp_run_id: '',
    department: '',
    required_date: '',
    items: []
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [newItem, setNewItem] = useState({
    item_id: '',
    required_qty: '',
    estimated_price: '',
    remarks: ''
  });

  const prTypes = [
    { value: 'Material', label: 'Material' },
    { value: 'Service', label: 'Service' },
    { value: 'Capital', label: 'Capital' },
    { value: 'Subcontract', label: 'Subcontract' }
  ];

  const sources = [
    { value: 'MRP Auto', label: 'MRP Auto' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Reorder Alert', label: 'Reorder Alert' },
    { value: 'Indent', label: 'Indent' }
  ];

  const departments = [
    { value: 'Production', label: 'Production' },
    { value: 'Quality', label: 'Quality' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Store', label: 'Store' },
    { value: 'Sales', label: 'Sales' }
  ];

  useEffect(() => {
    if (open && pr) {
      fetchItems();
      loadPRData();
    }
  }, [open, pr]);

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?page=1&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  const loadPRData = () => {
    if (!pr) return;

    const firstItemDate = pr.items?.[0]?.required_date 
      ? new Date(pr.items[0].required_date).toISOString().split('T')[0] 
      : '';

    setFormData({
      pr_type: pr.pr_type || 'Material',
      source: pr.source || 'Manual',
      mrp_run_id: pr.mrp_run_id || '',
      department: pr.department || '',
      required_date: firstItemDate,
      items: pr.items?.map(item => ({
        _id: item._id,
        item_id: item.item_id,
        part_no: item.part_no,
        description: item.description,
        required_qty: item.required_qty,
        estimated_price: item.estimated_price,
        unit: item.unit,
        remarks: item.remarks || ''
      })) || []
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const errors = {};
    if (!newItem.item_id) errors.item_id = 'Item is required';
    if (!newItem.required_qty) errors.required_qty = 'Quantity is required';
    else if (newItem.required_qty <= 0) errors.required_qty = 'Quantity must be greater than 0';
    if (!newItem.estimated_price) errors.estimated_price = 'Estimated price is required';
    else if (newItem.estimated_price <= 0) errors.estimated_price = 'Price must be greater than 0';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const selectedItem = items.find(i => i._id === newItem.item_id);
    const unit = selectedItem?.unit || selectedItem?.Unit || 'Nos';
    const partNo = selectedItem?.part_no || selectedItem?.PartNo || '';
    const description = selectedItem?.part_description || selectedItem?.Description || '';
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        item_id: newItem.item_id,
        part_no: partNo,
        description: description,
        required_qty: parseFloat(newItem.required_qty),
        estimated_price: parseFloat(newItem.estimated_price),
        unit: unit,
        remarks: newItem.remarks
      }]
    }));

    setNewItem({ 
      item_id: '', 
      required_qty: '', 
      estimated_price: '', 
      remarks: '' 
    });
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        if (!formData.pr_type) {
          errors.pr_type = 'PR type is required';
          isValid = false;
        }
        if (!formData.source) {
          errors.source = 'Source is required';
          isValid = false;
        }
        if (!formData.department) {
          errors.department = 'Department is required';
          isValid = false;
        }
        if (!formData.required_date) {
          errors.required_date = 'Required date is required';
          isValid = false;
        }
        break;
      case 1: // Items
        if (formData.items.length === 0) {
          errors.items = 'At least one item is required';
          isValid = false;
        }
        break;
      default:
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fill all required fields');
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
    if (formData.items.length === 0) {
      setError('At least one item is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const submissionData = {
        pr_type: formData.pr_type,
        source: formData.source,
        mrp_run_id: formData.mrp_run_id || null,
        department: formData.department,
        required_by: formData.required_date,
        items: formData.items.map(item => ({
          item_id: item.item_id,
          required_qty: item.required_qty,
          estimated_price: item.estimated_price,
          remarks: item.remarks
        })),
        updated_by: user._id
      };

      const response = await axios.put(`${BASE_URL}/api/purchase-requisitions/${pr._id}`, submissionData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update purchase requisition');
      }
    } catch (err) {
      console.error('Error updating PR:', err);
      setError(err.response?.data?.message || 'Failed to update purchase requisition');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pr_type: 'Material',
      source: 'Manual',
      mrp_run_id: '',
      department: '',
      required_date: '',
      items: []
    });
    setNewItem({ 
      item_id: '', 
      required_qty: '', 
      estimated_price: '', 
      remarks: '' 
    });
    setFieldErrors({});
    setError('');
    setActiveStep(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const totalValue = formData.items.reduce((sum, item) => sum + (item.estimated_price * item.required_qty), 0);
  const today = new Date().toISOString().split('T')[0];

  if (!pr) return null;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PR TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.pr_type}>
                      <Select
                        name="pr_type"
                        value={formData.pr_type}
                        onChange={handleSelectChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
                        }}
                      >
                        {prTypes.map(type => <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>{type.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      SOURCE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.source}>
                      <Select
                        name="source"
                        value={formData.source}
                        onChange={handleSelectChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
                        }}
                      >
                        {sources.map(src => <MenuItem key={src.value} value={src.value} sx={{ fontSize: '0.75rem' }}>{src.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.department}>
                      <Select
                        name="department"
                        value={formData.department}
                        onChange={handleSelectChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
                        }}
                      >
                        {departments.map(dept => <MenuItem key={dept.value} value={dept.value} sx={{ fontSize: '0.75rem' }}>{dept.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      REQUIRED DATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      type="date" 
                      name="required_date"
                      value={formData.required_date} 
                      onChange={handleChange}
                      error={!!fieldErrors.required_date}
                      helperText={fieldErrors.required_date}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: today }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MRP RUN ID
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      name="mrp_run_id" 
                      value={formData.mrp_run_id} 
                      onChange={handleChange} 
                      placeholder="e.g., MRP-20250315-001"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Items
              </Typography>
              
              {/* Add Item Form */}
              <Grid container spacing={1.5} alignItems="center">
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      ITEM <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={items}
                      loading={loadingItems}
                      value={items.find(i => i._id === newItem.item_id) || null}
                      onChange={(e, val) => handleNewItemChange('item_id', val?._id || '')}
                      getOptionLabel={(opt) => {
                        const partNo = opt.part_no || opt.PartNo || '';
                        const desc = opt.part_description || opt.Description || '';
                        return `${partNo} - ${desc}`;
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          size="small" 
                          placeholder="Search item..." 
                          error={!!fieldErrors.item_id} 
                          helperText={fieldErrors.item_id}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                            },
                            '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                            '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      QTY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      type="number" 
                      placeholder="Quantity" 
                      value={newItem.required_qty} 
                      onChange={(e) => handleNewItemChange('required_qty', e.target.value)} 
                      error={!!fieldErrors.required_qty} 
                      helperText={fieldErrors.required_qty} 
                      inputProps={{ step: 1, min: 1 }} 
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      EST. PRICE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      type="number" 
                      placeholder="Price" 
                      value={newItem.estimated_price} 
                      onChange={(e) => handleNewItemChange('estimated_price', e.target.value)} 
                      error={!!fieldErrors.estimated_price} 
                      helperText={fieldErrors.estimated_price} 
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} 
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 10, md: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      REMARKS
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="Remarks" 
                      value={newItem.remarks} 
                      onChange={(e) => handleNewItemChange('remarks', e.target.value)} 
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 2, md: 1 }}>
                  <Button 
                    variant="contained" 
                    onClick={addItem} 
                    disabled={!newItem.item_id || !newItem.required_qty || !newItem.estimated_price}
                    sx={{ 
                      height: 40, 
                      bgcolor: COLORS.primary, 
                      '&:hover': { bgcolor: COLORS.primaryDark },
                      minWidth: 40,
                      width: '100%',
                      mt: 2.5,
                      borderRadius: 1.5
                    }}
                  >
                    <AddIcon sx={{ fontSize: '1rem' }} />
                  </Button>
                </Grid>
              </Grid>

              {/* Items Table */}
              {formData.items.length > 0 && (
                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.required_qty} {item.unit}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="right">₹{item.estimated_price.toLocaleString()}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }} align="right">₹{(item.estimated_price * item.required_qty).toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => removeItem(index)} sx={{ color: '#EF4444' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell colSpan={4} sx={{ fontSize: '0.75rem', fontWeight: 600 }} align="right">Total Value:</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }} align="right">₹{totalValue.toLocaleString()}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {fieldErrors.items && (
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>{fieldErrors.items}</Typography>
              )}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Purchase Requisition
          </Typography>
          <Chip 
            label={`PR: ${pr.pr_number}`} 
            size="small" 
            sx={{ 
              bgcolor: COLORS.primaryLight, 
              color: COLORS.primary, 
              fontSize: '0.7rem',
              borderRadius: 1.5
            }} 
          />
        </Box>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 0.5, mt: 0.5 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
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
              disabled={loading || formData.items.length === 0 || !formData.required_date}
              startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
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
              {loading ? 'Updating...' : 'Update Requisition'}
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

export default EditPurchaseRequisition;