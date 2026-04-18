import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  MenuItem,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  styled,
  StepConnector,
  stepConnectorClasses,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Warehouse as WarehouseIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import AddEmployees from '../../hrmaster/employeemaster/AddEmployees';

// Color constants
const COLORS = {
  primary: "#063C3F",
  primaryLight: "#E8F0F1",
  primaryDark: "#05292B",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8",
    light: "#FFFFFF"
  },
  background: {
    white: "#FFFFFF",
    light: "#F8FFFC"
  },
  border: "#E3E8EF"
};

// Return condition options based on schema
const CONDITION_OPTIONS = ['Good', 'Partially Damaged', 'Scrap'];

// 🔥 Modern Stepper Connector
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

const steps = ['Basic Information', 'Return Items'];

const EditMRV = ({ open, onClose, data, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [stockError, setStockError] = useState("");
  
  // Modal states for Add functionality
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [employeeTypeForAdd, setEmployeeTypeForAdd] = useState('');
  
  // Data states
  const [employees, setEmployees] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [mivData, setMivData] = useState(null);
  
  const [formData, setFormData] = useState({
    condition: "Good",
    returned_by: "",
    received_by: "",
    remarks: "",
    mrv_date: "",
    items: []
  });

  useEffect(() => {
    if (open && data) {
      fetchEmployees();
      fetchWarehouses();
      initializeForm();
      // Fetch MIV details to get items
      if (data.miv_id?._id || data.miv_id) {
        fetchMIVDetails(data.miv_id?._id || data.miv_id);
      }
    }
  }, [open, data]);

  // Fetch MIV details to get items
  const fetchMIVDetails = async (mivId) => {
    if (!mivId) return;
    
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/miv/${mivId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const mivData = res.data.data;
        setMivData(mivData);
        
        // Update form items with MIV items
        const returnItems = (mivData.items || []).map(item => ({
          item_id: item.item_id?._id || item.item_id,
          part_no: item.part_no,
          item_description: item.item_description || item.description,
          issued_qty: item.issued_qty,
          returned_qty: 0,
          warehouse_id: item.warehouse_id?._id || item.warehouse_id,
          bin_id: item.bin_id?._id || item.bin_id,
          unit: item.unit,
          unit_cost: item.unit_cost,
          max_returnable_qty: item.issued_qty - (item.returned_qty || 0),
          total_value: 0
        }));
        
        setFormData(prev => ({
          ...prev,
          items: returnItems
        }));
      }
    } catch (err) {
      console.error('Error fetching MIV details:', err);
    } finally {
      setFetching(false);
    }
  };

  const initializeForm = () => {
    if (data) {
      setFormData(prev => ({
        ...prev,
        condition: data.condition || "Good",
        returned_by: data.returned_by?._id || data.returned_by || "",
        received_by: data.received_by?._id || data.received_by || "",
        remarks: data.remarks || "",
        mrv_date: data.mrv_date ? new Date(data.mrv_date).toISOString().slice(0, 16) : "",
      }));
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/employees?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEmployees(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/warehouses?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setWarehouses(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    if (employeeTypeForAdd === 'returned_by') {
      setFormData(prev => ({ ...prev, returned_by: newEmployee._id }));
    } else if (employeeTypeForAdd === 'received_by') {
      setFormData(prev => ({ ...prev, received_by: newEmployee._id }));
    }
    setEmployeeTypeForAdd('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value?._id || '' }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    const maxQty = updated[index].max_returnable_qty;
    
    if (field === 'returned_qty') {
      const qty = Number(value);
      if (qty < 0) return;
      if (qty > maxQty) {
        setStockError(`Return quantity cannot exceed ${maxQty}`);
        return;
      }
      setStockError('');
      
      const unitCost = Number(updated[index].unit_cost) || 0;
      updated[index].total_value = qty * unitCost;
    }
    
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, items: updated }));
    if (errors[`item_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
    }
  };

  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updated }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.returned_by) {
          newErrors.returned_by = 'Returned By is required';
          isValid = false;
        }
        if (!formData.received_by) {
          newErrors.received_by = 'Received By is required';
          isValid = false;
        }
        if (!formData.condition) {
          newErrors.condition = 'Condition is required';
          isValid = false;
        }
        break;
      
      case 1:
        formData.items.forEach((item, idx) => {
          if (item.returned_qty && Number(item.returned_qty) < 0) {
            newErrors[`item_${idx}_returned_qty`] = 'Quantity cannot be negative';
            isValid = false;
          }
        });
        break;
      
      default:
        return true;
    }

    setErrors(newErrors);
    if (!isValid) {
      setStockError('Please fix the errors in this section');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setStockError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setStockError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;
    if (!data || !data._id) {
      setErrors({ submit: "Invalid MRV data" });
      return;
    }
    
    const itemsToUpdate = formData.items.filter(item => 
      item.returned_qty && Number(item.returned_qty) > 0
    );
    
    setLoading(true);
    setStockError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const itemsPayload = itemsToUpdate.map(item => ({
        item_id: item.item_id,
        part_no: item.part_no,
        returned_qty: Number(item.returned_qty),
        warehouse_id: item.warehouse_id,
        bin_id: item.bin_id || ''
      }));
      
      const payload = {
        items: itemsPayload,
        condition: formData.condition,
        returned_by: formData.returned_by,
        received_by: formData.received_by,
        remarks: formData.remarks || '',
        mrv_date: formData.mrv_date ? new Date(formData.mrv_date).toISOString() : new Date().toISOString()
      };
      
      const response = await axios.put(`${BASE_URL}/api/mrv/${data._id}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        onClose();
      } else {
        setErrors({ submit: response.data.message || 'Failed to update MRV' });
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to update MRV';
        
        if (err.response.status === 400) {
          setErrors({ submit: `Cannot update: ${errorMsg}` });
        } else if (err.response.status === 404) {
          setErrors({ submit: "MRV not found" });
        } else if (err.response.status === 403) {
          setErrors({ submit: "You don't have permission to update this MRV" });
        } else {
          setErrors({ submit: errorMsg });
        }
      } else if (err.request) {
        setErrors({ submit: 'No response from server. Please check your connection.' });
      } else {
        setErrors({ submit: err.message || 'An error occurred while updating MRV' });
      }
    } finally { 
      setLoading(false); 
    }
  };

  const getPersonName = (person) => {
    if (!person) return '';
    if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
    if (person.FirstName) return person.FirstName;
    if (person.Username) return person.Username;
    if (person.Email) return person.Email;
    if (person.name) return person.name;
    return person._id || '';
  };

  const getWarehouseDisplay = (wh) => {
    if (!wh) return '';
    return wh.warehouse_name || wh.name || wh.warehouse_code || wh._id || '';
  };

  const getWarehouseBins = (warehouseId) => {
    const warehouse = warehouses.find(w => w._id === warehouseId);
    return (warehouse && warehouse.bins && Array.isArray(warehouse.bins)) ? warehouse.bins : [];
  };

  const getBinDisplay = (bin) => {
    if (!bin) return '';
    const binCode = bin.bin_code || bin.bin_id || '';
    const rack = bin.rack || '';
    return rack ? `${binCode} - ${rack}` : binCode;
  };

  const inputStyle = {
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
      color: COLORS.text.primary,
      '&::placeholder': {
        color: COLORS.text.tertiary,
        fontSize: '0.75rem'
      }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  if (!data) return null;

  return (
    <>
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
          mb: 2,
          bgcolor: COLORS.background.white,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Material Return Voucher - {data.mrv_number || 'Draft'}
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} sx={{ mb: 0.5, mt: 0.5 }}>
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
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setErrors({})}>
              {errors.submit}
            </Alert>
          )}
          
          {stockError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setStockError('')}>
              <strong>Invalid Return Quantity!</strong><br />
              {stockError}
            </Alert>
          )}
          
          <Alert severity="info" sx={{ mb: 2, borderRadius: 1.5 }}>
            <Typography sx={{ fontSize: '0.7rem' }}>
              <strong>Note:</strong> Only Draft MRVs can be edited. Changes will be saved as draft.
            </Typography>
          </Alert>

          {/* Step 0 - Basic Information */}
          {activeStep === 0 && (
            <Stack spacing={2}>
              <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                  Basic Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={labelStyle}>MRV DATE</Typography>
                      <TextField
                        type="datetime-local"
                        fullWidth
                        size="small"
                        name="mrv_date"
                        value={formData.mrv_date}
                        onChange={handleChange}
                        sx={inputStyle}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={labelStyle}>
                        RETURN CONDITION <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        error={!!errors.condition}
                        helperText={errors.condition}
                        sx={inputStyle}
                      >
                        {CONDITION_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={labelStyle}>
                        RETURNED BY <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Autocomplete
                            fullWidth
                            options={employees}
                            getOptionLabel={getPersonName}
                            value={employees.find(e => e._id === formData.returned_by) || null}
                            onChange={(e, val) => handleAutocompleteChange('returned_by', val)}
                            isOptionEqualToValue={(option, value) => option._id === value?._id}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                error={!!errors.returned_by}
                                helperText={errors.returned_by}
                                placeholder="Select employee returning materials"
                                sx={inputStyle}
                              />
                            )}
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setEmployeeTypeForAdd('returned_by');
                            setAddEmployeeOpen(true);
                          }}
                          startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                          sx={{
                            height: 36,
                            minWidth: 'auto',
                            px: 1.5,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            color: COLORS.text.secondary,
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              borderColor: COLORS.primary,
                              bgcolor: `${COLORS.primary}10`,
                              color: COLORS.primary
                            }
                          }}
                        >
                          Add New
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={labelStyle}>
                        RECEIVED BY (STORE) <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Autocomplete
                            fullWidth
                            options={employees}
                            getOptionLabel={getPersonName}
                            value={employees.find(e => e._id === formData.received_by) || null}
                            onChange={(e, val) => handleAutocompleteChange('received_by', val)}
                            isOptionEqualToValue={(option, value) => option._id === value?._id}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                error={!!errors.received_by}
                                helperText={errors.received_by}
                                placeholder="Select store employee receiving materials"
                                sx={inputStyle}
                              />
                            )}
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setEmployeeTypeForAdd('received_by');
                            setAddEmployeeOpen(true);
                          }}
                          startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                          sx={{
                            height: 36,
                            minWidth: 'auto',
                            px: 1.5,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            color: COLORS.text.secondary,
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              borderColor: COLORS.primary,
                              bgcolor: `${COLORS.primary}10`,
                              color: COLORS.primary
                            }
                          }}
                        >
                          Add New
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={labelStyle}>REMARKS</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        size="small"
                        placeholder="Enter reason for return or any additional remarks..."
                        sx={inputStyle}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          )}

          {/* Step 1 - Return Items */}
          {activeStep === 1 && (
            <Stack spacing={2}>
              <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  Return Items
                </Typography>
                
                {formData.items.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 1.5 }}>
                    No items available. Please select a valid MIV first.
                  </Alert>
                ) : (
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.light }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 180 }}>Item</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Part No</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Max Returnable</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }} align="right">Return Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 80 }}>Unit</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Warehouse</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }}>Bin</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Unit Cost</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Total Value</TableCell>
                          <TableCell sx={{ width: 50 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.items.map((item, idx) => {
                          const warehouseBins = getWarehouseBins(item.warehouse_id);
                          
                          return (
                            <TableRow key={idx}>
                              <TableCell>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                  {item.item_description || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                  {item.part_no || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                                  {item.max_returnable_qty || 0}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={item.returned_qty}
                                  onChange={(e) => handleItemChange(idx, 'returned_qty', e.target.value)}
                                  error={!!errors[`item_${idx}_returned_qty`]}
                                  helperText={errors[`item_${idx}_returned_qty`]}
                                  placeholder="Qty"
                                  fullWidth
                                  InputProps={{ inputProps: { min: 0, max: item.max_returnable_qty, step: 0.01 } }}
                                  sx={inputStyle}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                  {item.unit || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Autocomplete
                                  fullWidth
                                  options={warehouses}
                                  getOptionLabel={getWarehouseDisplay}
                                  value={warehouses.find(w => w._id === item.warehouse_id) || null}
                                  onChange={(e, val) => handleItemChange(idx, 'warehouse_id', val?._id || '')}
                                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      placeholder="Select warehouse"
                                      sx={inputStyle}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <Autocomplete
                                  fullWidth
                                  options={warehouseBins}
                                  getOptionLabel={getBinDisplay}
                                  value={warehouseBins.find(b => b._id === item.bin_id) || null}
                                  onChange={(e, val) => handleItemChange(idx, 'bin_id', val?._id || '')}
                                  disabled={!item.warehouse_id}
                                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      placeholder={!item.warehouse_id ? "Select warehouse first" : "Select bin"}
                                      sx={inputStyle}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                  {item.unit_cost ? `₹${Number(item.unit_cost).toLocaleString()}` : '-'}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                                  {item.total_value ? `₹${Number(item.total_value).toLocaleString()}` : '₹0'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {formData.items.length > 1 && (
                                  <Tooltip title="Remove Item">
                                    <IconButton size="small" onClick={() => removeItem(idx)} sx={{ color: '#EF4444' }}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Stack>
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
            onClick={onClose}
            disabled={loading}
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
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                disabled={loading}
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
            )}
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={!loading && <SaveIcon sx={{ fontSize: '1rem' }} />}
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
                {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : 'Update MRV'}
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

      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => {
          setAddEmployeeOpen(false);
          setEmployeeTypeForAdd('');
        }}
        onAdd={handleEmployeeAdded}
      />
    </>
  );
};

export default EditMRV;