import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddEmployees from '../../hrmaster/employeemaster/AddEmployees';
import AddUser from '../../users/AddUser';
import AddDepartment from '../../hrmaster/departmentmaster/AddDepartments';

// Color constants matching other components
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  }
};

// Unit options based on schema enum
const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Sheet', 'Roll'];
const ALLOWED_WO_STATUSES = ['Released', 'In Progress', 'In-Progress'];

// 🔥 Modern Stepper Connector with Gradient
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

const steps = ['Basic Information', 'Material Items'];

const AddMIV = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [workOrderError, setWorkOrderError] = useState('');
  const [stockError, setStockError] = useState('');

  // Data states
  const [workOrders, setWorkOrders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [grns, setGrns] = useState([]);

  // Modal states for Add functionality
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [employeeTypeForAdd, setEmployeeTypeForAdd] = useState(''); // 'issued_by' or 'received_by'
  const [userTypeForAdd, setUserTypeForAdd] = useState(''); // 'authorised_by'

  const [formData, setFormData] = useState({
    wo_id: '',
    department: '',
    issued_by: '',
    received_by: '',
    authorised_by: '',
    remarks: '',
    items: [{
      item_id: '',
      part_no: '',
      item_description: '',
      issued_qty: '',
      unit: '',
      warehouse_id: '',
      bin_id: '',
      batch_no: '',
      heat_no: '',
      unit_cost: ''
    }]
  });

  useEffect(() => {
    if (open) {
      fetchWorkOrders();
      fetchDepartments();
      fetchEmployees();
      fetchUsers();
      fetchItems();
      fetchWarehouses();
      fetchGrns();
      resetForm();
    }
  }, [open]);

  const fetchWorkOrders = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/work-orders?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const filteredWOs = (res.data.data || []).filter(wo =>
          ALLOWED_WO_STATUSES.includes(wo.status)
        );
        setWorkOrders(filteredWOs);
      }
    } catch (err) {
      console.error('Error fetching work orders:', err);
    } finally {
      setFetching(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/departments?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDepartments(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/users?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchItems = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/items?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setItems(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setFetching(false);
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

  const fetchGrns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/grns?limit=1000&sort_by=createdAt&sort_order=desc`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setGrns(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching GRNs:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      wo_id: '',
      department: '',
      issued_by: '',
      received_by: '',
      authorised_by: '',
      remarks: '',
      items: [{
        item_id: '', part_no: '', item_description: '', issued_qty: '', unit: '',
        warehouse_id: '', bin_id: '', batch_no: '', heat_no: '', unit_cost: ''
      }]
    });
    setErrors({});
    setWorkOrderError('');
    setStockError('');
    setActiveStep(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAutocompleteChange = (name, value) => {
    if (name === 'wo_id' && value) {
      if (!ALLOWED_WO_STATUSES.includes(value.status)) {
        setWorkOrderError(`Cannot issue material for WO in ${value.status} status. Only Released/In Progress allowed.`);
        setFormData(prev => ({ ...prev, wo_id: '', department: '' }));
        return;
      }
      setWorkOrderError('');

      const departmentId = value.department_id?._id || value.department_id || '';
      setFormData(prev => ({
        ...prev,
        wo_id: value._id,
        department: departmentId
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value?._id || '' }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setStockError('');
  };

  // Handlers for Add modals
  const handleDepartmentAdded = (newDepartment) => {
    setDepartments(prev => [...prev, newDepartment]);
    setFormData(prev => ({ ...prev, department: newDepartment._id }));
  };

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    if (employeeTypeForAdd === 'issued_by') {
      setFormData(prev => ({ ...prev, issued_by: newEmployee._id }));
    } else if (employeeTypeForAdd === 'received_by') {
      setFormData(prev => ({ ...prev, received_by: newEmployee._id }));
    }
    setEmployeeTypeForAdd('');
  };

  const handleUserAdded = (newUser) => {
    setUsers(prev => [...prev, newUser]);
    if (userTypeForAdd === 'authorised_by') {
      setFormData(prev => ({ ...prev, authorised_by: newUser._id }));
    }
    setUserTypeForAdd('');
  };

  const getAvailableBatches = (itemId) => {
    const batches = [];
    grns.forEach(grn => {
      grn.items.forEach(item => {
        if (item.item_id === itemId && item.batch_no) {
          batches.push({
            batch_no: item.batch_no,
            heat_no: item.heat_no,
            storage_location: item.storage_location,
            available_qty: item.accepted_qty || item.received_qty,
            grn_id: grn._id,
            grn_number: grn.grn_number
          });
        }
      });
    });
    return batches;
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;

    if (field === 'item_id' && value) {
      const selectedItem = items.find(i => i._id === value);
      if (selectedItem) {
        updated[index].part_no = selectedItem.part_no || selectedItem.PartNo || selectedItem.item_code || '';
        updated[index].item_description = selectedItem.description ||
          selectedItem.Description ||
          selectedItem.item_description ||
          selectedItem.item_name ||
          selectedItem.name ||
          '';
        const itemUnit = selectedItem.unit || selectedItem.Unit || selectedItem.uom || '';
        if (itemUnit && UNIT_OPTIONS.includes(itemUnit)) {
          updated[index].unit = itemUnit;
        }

        if (selectedItem.current_cost) {
          updated[index].unit_cost = selectedItem.current_cost;
        }

        updated[index].batch_no = '';
        updated[index].heat_no = '';
      }
    }

    if (field === 'batch_no' && value) {
      const batches = getAvailableBatches(updated[index].item_id);
      const selectedBatch = batches.find(b => b.batch_no === value);
      if (selectedBatch) {
        updated[index].heat_no = selectedBatch.heat_no || '';
        if (selectedBatch.storage_location && !updated[index].bin_id) {
          updated[index].bin_id = selectedBatch.storage_location;
        }
      }
    }

    if (field === 'warehouse_id') {
      updated[index].bin_id = '';
    }

    setFormData(prev => ({ ...prev, items: updated }));
    if (errors[`item_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        item_id: '', part_no: '', item_description: '', issued_qty: '', unit: '',
        warehouse_id: '', bin_id: '', batch_no: '', heat_no: '', unit_cost: ''
      }]
    }));
  };

  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updated }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        if (!formData.wo_id) {
          newErrors.wo_id = 'Work Order is required';
          isValid = false;
        }
        if (!formData.department) {
          newErrors.department = 'Department is required';
          isValid = false;
        }
        if (!formData.issued_by) {
          newErrors.issued_by = 'Issued By is required';
          isValid = false;
        }
        if (!formData.received_by) {
          newErrors.received_by = 'Received By is required';
          isValid = false;
        }
        if (!formData.authorised_by) {
          newErrors.authorised_by = 'Authorised By is required';
          isValid = false;
        }
        break;

      case 1: // Material Items
        formData.items.forEach((item, idx) => {
          if (!item.item_id) {
            newErrors[`item_${idx}_item_id`] = 'Item is required';
            isValid = false;
          }
          if (!item.issued_qty) {
            newErrors[`item_${idx}_issued_qty`] = 'Quantity is required';
            isValid = false;
          } else if (Number(item.issued_qty) <= 0) {
            newErrors[`item_${idx}_issued_qty`] = 'Quantity must be greater than 0';
            isValid = false;
          }
          if (!item.warehouse_id) {
            newErrors[`item_${idx}_warehouse_id`] = 'Warehouse is required';
            isValid = false;
          }
          if (!item.item_description) {
            newErrors[`item_${idx}_item_description`] = 'Item description is required';
            isValid = false;
          }
          if (!item.unit) {
            newErrors[`item_${idx}_unit`] = 'Unit is required';
            isValid = false;
          } else if (!UNIT_OPTIONS.includes(item.unit)) {
            newErrors[`item_${idx}_unit`] = `Unit must be one of: ${UNIT_OPTIONS.join(', ')}`;
            isValid = false;
          }
        });
        break;

      default:
        return true;
    }

    setErrors(newErrors);
    if (!isValid) {
      setWorkOrderError('Please fix the errors in this section');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setWorkOrderError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setWorkOrderError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;
    if (workOrderError) {
      setErrors(prev => ({ ...prev, submit: workOrderError }));
      return;
    }

    setLoading(true);
    setStockError('');
    try {
      const token = localStorage.getItem('token');

      const itemsPayload = formData.items.map(item => ({
        item_id: item.item_id,
        part_no: item.part_no || '',
        item_description: item.item_description || '',
        issued_qty: Number(item.issued_qty),
        unit: item.unit,
        warehouse_id: item.warehouse_id,
        bin_id: item.bin_id || '',
        batch_no: item.batch_no || '',
        heat_no: item.heat_no || '',
        unit_cost: Number(item.unit_cost) || 0
      }));

      const payload = {
        wo_id: formData.wo_id,
        department: formData.department,
        issued_by: formData.issued_by,
        received_by: formData.received_by,
        authorised_by: formData.authorised_by,
        remarks: formData.remarks || '',
        items: itemsPayload
      };

      const response = await axios.post(`${BASE_URL}/api/miv`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        if (onAdd) onAdd(response.data.data);
        onClose();
      } else {
        setErrors(prev => ({ ...prev, submit: response.data.message || 'Failed to create MIV' }));
      }
    } catch (err) {
      console.error('API Error:', err);

      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to create MIV';

        if (errorMsg.toLowerCase().includes('insufficient stock') ||
          errorMsg.toLowerCase().includes('shortage') ||
          errorMsg.toLowerCase().includes('fifo')) {
          setStockError(errorMsg);
        } else {
          setErrors(prev => ({ ...prev, submit: errorMsg }));
        }
      } else if (err.request) {
        setErrors(prev => ({ ...prev, submit: 'No response from server. Please check your connection.' }));
      } else {
        setErrors(prev => ({ ...prev, submit: err.message || 'An error occurred while creating MIV' }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Display helper functions
  const getWorkOrderDisplay = (wo) => wo?.wo_number || wo?.work_order_number || wo?._id || '';
  const getDepartmentDisplay = (dept) => dept?.DepartmentName || dept?.name || dept?._id || '';
  const getPersonName = (person) => {
    if (!person) return '';
    if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
    if (person.FirstName) return person.FirstName;
    if (person.Username) return person.Username;
    if (person.Email) return person.Email;
    if (person.name) return person.name;
    return person._id || '';
  };
  const getItemDisplay = (item) => {
    if (!item) return '';
    const partNo = item.part_no || item.PartNo || item.item_code || '';
    const description = item.description || item.Description || item.item_description || item.name || '';
    if (partNo && description) return `${partNo} - ${description.substring(0, 50)}`;
    if (partNo) return partNo;
    if (description) return description.substring(0, 50);
    return item._id?.slice(-6) || 'Unknown Item';
  };
  const getWarehouseDisplay = (wh) => wh?.warehouse_name || wh?.name || wh?.warehouse_code || wh?._id || '';
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
      '&:hover fieldset': {
        borderColor: COLORS.primary,
      },
      '&.Mui-focused fieldset': {
        borderColor: COLORS.primary,
        borderWidth: 1
      }
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                {/* Work Order */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      WORK ORDER <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={workOrders}
                      getOptionLabel={getWorkOrderDisplay}
                      onChange={(e, val) => handleAutocompleteChange('wo_id', val)}
                      loading={fetching}
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          error={!!errors.wo_id}
                          helperText={errors.wo_id}
                          placeholder="Select work order"
                          sx={inputStyle}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                      Only work orders with status "Released" or "In Progress" are shown
                    </Typography>
                  </Box>
                </Grid>

                {/* Department with Add button */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          fullWidth
                          options={departments}
                          getOptionLabel={getDepartmentDisplay}
                          onChange={(e, val) => handleAutocompleteChange('department', val)}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!errors.department}
                              helperText={errors.department}
                              placeholder="Select department"
                              sx={inputStyle}
                            />
                          )}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAddDepartmentOpen(true)}
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

                {/* Issued By (Employee) with Add button */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      ISSUED BY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          fullWidth
                          options={employees}
                          getOptionLabel={getPersonName}
                          onChange={(e, val) => handleAutocompleteChange('issued_by', val)}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!errors.issued_by}
                              helperText={errors.issued_by}
                              placeholder="Select employee"
                              sx={inputStyle}
                            />
                          )}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setEmployeeTypeForAdd('issued_by');
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

                {/* Received By (Employee) with Add button */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      RECEIVED BY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          fullWidth
                          options={employees}
                          getOptionLabel={getPersonName}
                          onChange={(e, val) => handleAutocompleteChange('received_by', val)}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!errors.received_by}
                              helperText={errors.received_by}
                              placeholder="Select employee"
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

                {/* Authorised By (User) with Add button */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      AUTHORISED BY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          fullWidth
                          options={users}
                          getOptionLabel={(opt) => opt.Username || opt.Email || getPersonName(opt)}
                          onChange={(e, val) => handleAutocompleteChange('authorised_by', val)}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!errors.authorised_by}
                              helperText={errors.authorised_by}
                              placeholder="Select user"
                              sx={inputStyle}
                            />
                          )}
                        />
                      </Box>
                      {/* <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setUserTypeForAdd('authorised_by');
                          setAddUserOpen(true);
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
                      </Button> */}
                    </Box>
                  </Box>
                </Grid>

                {/* Remarks */}
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
                      placeholder="Enter any additional remarks..."
                      sx={inputStyle}
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
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                  MATERIAL ITEMS <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Button
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={addItem}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    borderRadius: 1.5,
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                    height: 32,
                    '&:hover': {
                      borderColor: COLORS.primaryDark,
                      bgcolor: COLORS.primaryLight
                    }
                  }}
                >
                  Add Item
                </Button>
              </Stack>

              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 180 }}>Item</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Qty*</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Unit*</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Warehouse*</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }}>Bin</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }}>Batch No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Heat No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Unit Cost</TableCell>
                      <TableCell sx={{ width: 50 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.map((item, idx) => {
                      const warehouseBins = getWarehouseBins(item.warehouse_id);
                      const availableBatches = item.item_id ? getAvailableBatches(item.item_id) : [];

                      return (
                        <TableRow key={idx}>
                          <TableCell>
                            <Autocomplete
                              fullWidth
                              options={items}
                              getOptionLabel={getItemDisplay}
                              onChange={(e, val) => handleItemChange(idx, 'item_id', val?._id || '')}
                              loading={fetching}
                              isOptionEqualToValue={(option, value) => option._id === value?._id}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  error={!!errors[`item_${idx}_item_id`]}
                                  helperText={errors[`item_${idx}_item_id`]}
                                  placeholder="Select item"
                                  sx={inputStyle}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={item.part_no}
                              disabled
                              fullWidth
                              sx={inputStyle}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={item.item_description}
                              onChange={(e) => handleItemChange(idx, 'item_description', e.target.value)}
                              error={!!errors[`item_${idx}_item_description`]}
                              helperText={errors[`item_${idx}_item_description`]}
                              placeholder="Description"
                              fullWidth
                              multiline
                              rows={2}
                              sx={inputStyle}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={item.issued_qty}
                              onChange={(e) => handleItemChange(idx, 'issued_qty', e.target.value)}
                              error={!!errors[`item_${idx}_issued_qty`]}
                              helperText={errors[`item_${idx}_issued_qty`]}
                              placeholder="Qty"
                              fullWidth
                              InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
                              sx={inputStyle}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              select
                              size="small"
                              value={item.unit}
                              onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                              error={!!errors[`item_${idx}_unit`]}
                              helperText={errors[`item_${idx}_unit`]}
                              fullWidth
                              sx={inputStyle}
                            >
                              <MenuItem value="" disabled>Select Unit</MenuItem>
                              {UNIT_OPTIONS.map((unit) => (
                                <MenuItem key={unit} value={unit} sx={{ fontSize: '0.75rem' }}>{unit}</MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              fullWidth
                              options={warehouses}
                              getOptionLabel={getWarehouseDisplay}
                              onChange={(e, val) => handleItemChange(idx, 'warehouse_id', val?._id || '')}
                              isOptionEqualToValue={(option, value) => option._id === value?._id}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select warehouse"
                                  error={!!errors[`item_${idx}_warehouse_id`]}
                                  helperText={errors[`item_${idx}_warehouse_id`]}
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
                              onChange={(e, val) => handleItemChange(idx, 'bin_id', val?._id || '')}
                              disabled={!item.warehouse_id || warehouseBins.length === 0}
                              isOptionEqualToValue={(option, value) => option._id === value?._id}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder={!item.warehouse_id ? "Select warehouse first" : warehouseBins.length === 0 ? "No bins" : "Select bin"}
                                  sx={inputStyle}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              fullWidth
                              options={availableBatches}
                              getOptionLabel={(opt) => `${opt.batch_no} (Avail: ${opt.available_qty})`}
                              onChange={(e, val) => handleItemChange(idx, 'batch_no', val?.batch_no || '')}
                              disabled={!item.item_id || availableBatches.length === 0}
                              isOptionEqualToValue={(option, value) => option.batch_no === value}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder={!item.item_id ? "Select item first" : "Select batch"}
                                  sx={inputStyle}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={item.heat_no}
                              onChange={(e) => handleItemChange(idx, 'heat_no', e.target.value)}
                              placeholder="Heat No"
                              fullWidth
                              disabled={!!item.batch_no}
                              sx={inputStyle}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={item.unit_cost}
                              onChange={(e) => handleItemChange(idx, 'unit_cost', e.target.value)}
                              placeholder="Cost"
                              fullWidth
                              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              sx={inputStyle}
                            />
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
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

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
            Create Material Issue Voucher (Draft)
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
          {workOrderError && (
            <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setWorkOrderError('')}>
              {workOrderError}
            </Alert>
          )}

          {stockError && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setStockError('')}>
              <strong>Stock Insufficient!</strong><br />
              {stockError}
            </Alert>
          )}

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}>
              {errors.submit}
            </Alert>
          )}

          {renderStepContent(activeStep)}
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
                startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
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
                {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : 'Create MIV'}
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

      {/* Add Department Modal */}
      <AddDepartment
        open={addDepartmentOpen}
        onClose={() => setAddDepartmentOpen(false)}
        onAdd={handleDepartmentAdded}
      />

      {/* Add Employee Modal */}
      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => {
          setAddEmployeeOpen(false);
          setEmployeeTypeForAdd('');
        }}
        onAdd={handleEmployeeAdded}
      />

      {/* Add User Modal */}
      
    </>
  );
};

export default AddMIV;