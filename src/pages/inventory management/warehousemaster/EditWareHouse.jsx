import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Stack,
  Alert,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Grid
} from '@mui/material';
import { Edit as EditIcon, Delete, Add, Close, Person, Warehouse } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching ViewWarehouseStock
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
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
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

const steps = ['Basic Information', 'Bins Configuration'];

const EditWareHouse = ({ open, onClose, data, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  // State for Bin Management
  const [bins, setBins] = useState([]);
  const [isAddingBin, setIsAddingBin] = useState(false);
  const [editingBin, setEditingBin] = useState(null);
  const [binFormData, setBinFormData] = useState({
    bin_id: '',
    bin_code: '',
    rack: '',
    row: '',
    col: '',
    capacity: ''
  });

  const [formData, setFormData] = useState({
    warehouse_name: '',
    warehouse_type: '',
    location: '',
    manager_id: '',
    is_active: true
  });

  // Helper function to get employee display name
  const getEmployeeDisplayName = (employee) => {
    if (!employee) return "Unknown Employee";

    if (employee.FirstName && employee.LastName) {
      return `${employee.FirstName} ${employee.LastName}`;
    }
    if (employee.FirstName) return employee.FirstName;
    if (employee.LastName) return employee.LastName;
    if (employee.name) return employee.name;
    if (employee.employee_name) return employee.employee_name;
    if (employee.email) return employee.email.split('@')[0];
    if (employee.EmployeeID) return `Employee ${employee.EmployeeID}`;

    return "Unknown Employee";
  };

  // Prefill data when editing
  useEffect(() => {
    if (data) {
      setFormData({
        warehouse_name: data.warehouse_name || '',
        warehouse_type: data.warehouse_type || '',
        location: data.location || '',
        manager_id: data.manager_id?._id || data.manager_id || '',
        is_active: data.is_active !== undefined ? data.is_active : true
      });

      // Set bins from warehouse data
      if (data.bins && Array.isArray(data.bins)) {
        setBins(data.bins);
      } else {
        setBins([]);
      }
    }
  }, [data]);

  // Fetch employees for manager selection
  const fetchEmployees = async () => {
    try {
      setFetchingEmployees(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/employees?page=1&limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setEmployees(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setFetchingEmployees(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchEmployees();
      setError('');
      setIsAddingBin(false);
      setEditingBin(null);
      setActiveStep(0);
    }
  }, [open]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switch change
  const handleSwitchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      is_active: e.target.checked
    }));
  };

  // Bin Management Functions
  const handleBinFormChange = (e) => {
    const { name, value } = e.target;
    setBinFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetBinForm = () => {
    setBinFormData({
      bin_id: '',
      bin_code: '',
      rack: '',
      row: '',
      col: '',
      capacity: ''
    });
    setEditingBin(null);
  };

  const handleAddBinClick = () => {
    resetBinForm();
    setIsAddingBin(true);
  };

  const handleEditBin = (bin, index) => {
    setBinFormData({
      bin_id: bin.bin_id || '',
      bin_code: bin.bin_code || '',
      rack: bin.rack || '',
      row: bin.row || '',
      col: bin.col || '',
      capacity: bin.capacity || ''
    });
    setEditingBin(index);
    setIsAddingBin(true);
  };

  const handleDeleteBin = (index) => {
    const updatedBins = bins.filter((_, i) => i !== index);
    setBins(updatedBins);
  };

  const validateBinForm = () => {
    if (!binFormData.bin_id.trim()) {
      setError('Bin ID is required');
      return false;
    }
    if (!binFormData.bin_code.trim()) {
      setError('Bin code is required');
      return false;
    }
    if (!binFormData.rack.trim()) {
      setError('Rack is required');
      return false;
    }
    if (!binFormData.row) {
      setError('Row is required');
      return false;
    }
    if (binFormData.row <= 0) {
      setError('Row must be greater than 0');
      return false;
    }
    if (!binFormData.col) {
      setError('Column is required');
      return false;
    }
    if (binFormData.col <= 0) {
      setError('Column must be greater than 0');
      return false;
    }
    if (!binFormData.capacity) {
      setError('Capacity is required');
      return false;
    }
    if (binFormData.capacity <= 0) {
      setError('Capacity must be greater than 0');
      return false;
    }
    return true;
  };

  const saveBin = () => {
    if (!validateBinForm()) return;

    const newBin = {
      bin_id: binFormData.bin_id.trim(),
      bin_code: binFormData.bin_code.trim(),
      rack: binFormData.rack.trim(),
      row: Number(binFormData.row),
      col: Number(binFormData.col),
      capacity: Number(binFormData.capacity)
    };

    if (editingBin !== null) {
      // Update existing bin
      const updatedBins = [...bins];
      updatedBins[editingBin] = newBin;
      setBins(updatedBins);
    } else {
      // Add new bin
      setBins([...bins, newBin]);
    }

    setIsAddingBin(false);
    resetBinForm();
    setError('');
  };

  const cancelBinForm = () => {
    setIsAddingBin(false);
    resetBinForm();
    setError('');
  };

  // Validate basic info step
  const validateBasicInfo = () => {
    if (!formData.warehouse_name.trim()) {
      setError('Warehouse name is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateBasicInfo()) {
      setActiveStep(1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setError('');
  };

  // Submit update
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const payload = {
        warehouse_name: formData.warehouse_name.trim(),
        location: formData.location.trim(),
        manager_id: formData.manager_id || null,
        is_active: formData.is_active,
        bins: bins.map(bin => ({
          bin_id: bin.bin_id,
          bin_code: bin.bin_code,
          rack: bin.rack,
          row: Number(bin.row),
          col: Number(bin.col),
          capacity: Number(bin.capacity)
        }))
      };

      const response = await axios.put(`${BASE_URL}/api/warehouses/${data._id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        if (onUpdate) onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update warehouse');
      }
    } catch (err) {
      console.error('Error updating warehouse:', err);
      setError(err.response?.data?.message || 'Failed to update warehouse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      WAREHOUSE NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="warehouse_name"
                      value={formData.warehouse_name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Enter warehouse name"
                      size="small"
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      WAREHOUSE TYPE
                    </Typography>
                    <TextField
                      fullWidth
                      value={formData.warehouse_type}
                      disabled
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          backgroundColor: COLORS.background.light
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem',
                          color: COLORS.text.secondary
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      LOCATION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Enter location"
                      size="small"
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MANAGER
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="manager_id"
                        value={formData.manager_id || ""}
                        onChange={handleChange}
                        disabled={loading || fetchingEmployees}
                        displayEmpty
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 1.5
                          }
                        }}
                        renderValue={(selected) => {
                          if (!selected) return <span style={{ color: COLORS.text.tertiary }}>Select manager</span>;
                          const employee = employees.find(emp => emp._id === selected);
                          return getEmployeeDisplayName(employee);
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                          <em>None</em>
                        </MenuItem>
                        {fetchingEmployees ? (
                          <MenuItem disabled sx={{ fontSize: '0.75rem' }}>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            Loading employees...
                          </MenuItem>
                        ) : (
                          employees.map((emp) => (
                            <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: '0.75rem' }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Person sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                                <span>{getEmployeeDisplayName(emp)}</span>
                              </Stack>
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={handleSwitchChange}
                        disabled={loading}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: COLORS.primary,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: COLORS.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                        Active Warehouse
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                  Bins Configuration
                </Typography>
                <Chip
                  label={`${bins.length} bin(s)`}
                  size="small"
                  sx={{
                    fontSize: "0.65rem",
                    height: 22,
                    bgcolor: COLORS.primaryLight,
                    color: COLORS.primary
                  }}
                />
              </Stack>

              {/* Add/Edit Bin Form */}
              {isAddingBin && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.primary}`,
                    bgcolor: COLORS.background.light
                  }}
                >
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                    {editingBin !== null ? "Edit Bin" : "Add New Bin"}
                  </Typography>

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Bin ID"
                        name="bin_id"
                        size="small"
                        value={binFormData.bin_id}
                        onChange={handleBinFormChange}
                        placeholder="e.g., BIN-001"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary },
                            '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                          },
                          '& .MuiInputLabel-root': { fontSize: '0.7rem' },
                          '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Bin Code"
                        name="bin_code"
                        size="small"
                        value={binFormData.bin_code}
                        onChange={handleBinFormChange}
                        placeholder="e.g., A-1-1"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary },
                            '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                          },
                          '& .MuiInputLabel-root': { fontSize: '0.7rem' },
                          '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Rack"
                        name="rack"
                        size="small"
                        value={binFormData.rack}
                        onChange={handleBinFormChange}
                        placeholder="e.g., A"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary },
                            '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                          },
                          '& .MuiInputLabel-root': { fontSize: '0.7rem' },
                          '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Row"
                        name="row"
                        type="number"
                        size="small"
                        value={binFormData.row}
                        onChange={handleBinFormChange}
                        placeholder="1"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary },
                            '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                          },
                          '& .MuiInputLabel-root': { fontSize: '0.7rem' },
                          '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Column"
                        name="col"
                        type="number"
                        size="small"
                        value={binFormData.col}
                        onChange={handleBinFormChange}
                        placeholder="1"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary },
                            '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                          },
                          '& .MuiInputLabel-root': { fontSize: '0.7rem' },
                          '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Capacity (Units)"
                        name="capacity"
                        type="number"
                        size="small"
                        value={binFormData.capacity}
                        onChange={handleBinFormChange}
                        placeholder="5000"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary },
                            '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                          },
                          '& .MuiInputLabel-root': { fontSize: '0.7rem' },
                          '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        onClick={cancelBinForm}
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontSize: "0.7rem",
                          height: 32,
                          px: 2,
                          borderRadius: 1.5,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.text.secondary,
                          '&:hover': {
                            borderColor: COLORS.primary,
                            bgcolor: `${COLORS.primary}10`
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveBin}
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontSize: "0.7rem",
                          height: 32,
                          px: 2,
                          borderRadius: 1.5,
                          bgcolor: COLORS.primary,
                          '&:hover': { bgcolor: COLORS.primaryDark }
                        }}
                      >
                        {editingBin !== null ? "Update Bin" : "Add Bin"}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Bins List */}
              {bins.length === 0 && !isAddingBin ? (
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    bgcolor: COLORS.background.light
                  }}
                >
                  <Warehouse sx={{ fontSize: 32, color: COLORS.text.tertiary, mb: 0.5 }} />
                  <Typography sx={{ color: COLORS.text.secondary, fontSize: '0.7rem' }}>
                    No bins configured. Click "Add Bin" to create one.
                  </Typography>
                </Paper>
              ) : (
                bins.map((bin, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${COLORS.border}`,
                      bgcolor: COLORS.background.white,
                      '&:hover': {
                        borderColor: COLORS.primary
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          label={`Bin #${index + 1}`}
                          size="small"
                          sx={{
                            fontSize: "0.6rem",
                            height: 20,
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primary,
                            fontWeight: 500
                          }} 
                        />
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {bin.bin_code}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditBin(bin, index)}
                          sx={{ color: COLORS.primary, p: 0.5 }}
                        >
                          <EditIcon sx={{ fontSize: '0.875rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteBin(index)}
                          sx={{ color: '#EF4444', p: 0.5 }}
                        >
                          <Delete sx={{ fontSize: '0.875rem' }} />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 0.75 }} />

                    <Grid container spacing={1} sx={{ mt: 0.5 }}>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                          Bin ID
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {bin.bin_id}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                          Rack
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {bin.rack}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                          Position
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {bin.row},{bin.col}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                          Capacity
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {bin.capacity.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              )}

              {!isAddingBin && (
                <Button
                  startIcon={<Add sx={{ fontSize: '1rem' }} />}
                  onClick={handleAddBinClick}
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: COLORS.primary,
                    mt: 1,
                    '&:hover': { bgcolor: COLORS.primaryLight }
                  }}
                >
                  Add Bin
                </Button>
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
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          height: 'auto',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ background: HEADER_GRADIENT, py: 1.5, px: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1rem' }}>
              Edit Warehouse
            </Typography>
          </Stack>
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{
            mt: 0.5,
            '& .MuiStepLabel-label': {
              color: '#FFFFFF !important',
              opacity: 0.8,
              fontSize: '0.7rem !important',
              '&.Mui-active': {
                color: '#FFFFFF !important',
                opacity: 1,
                fontWeight: 600
              },
              '&.Mui-completed': {
                color: '#FFFFFF !important',
                opacity: 1
              }
            }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={500} fontSize="0.7rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{
        p: 2.5,
        overflow: 'auto',
        maxHeight: 'calc(90vh - 140px)',
        backgroundColor: '#F8FFFC'
      }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 1.5,
              mb: 2,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: '1px solid #E3E8EF',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          onClick={onClose}
          size="small"
          sx={{
            color: '#64748B',
            fontSize: '0.75rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#F1F5F9' }
          }}
        >
          Cancel
        </Button>

        <Stack direction="row" spacing={1}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              size="small"
              sx={{
                color: '#64748B',
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': { bgcolor: '#F1F5F9' }
              }}
            >
              Back
            </Button>
          )}

          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              sx={{
                backgroundColor: PRIMARY_DARK,
                fontSize: '0.75rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#05292B',
                  boxShadow: 'none'
                }
              }}
            >
              Next
            </Button>
          )}

          {activeStep === steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                backgroundColor: PRIMARY_DARK,
                fontSize: '0.75rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#05292B',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : 'Update Warehouse'}
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default EditWareHouse;