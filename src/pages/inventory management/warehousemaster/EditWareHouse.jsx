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
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete, Add, Close, Person, Warehouse } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching EditDesignations component
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
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

const EditWareHouse = ({ open, onClose, data, onUpdate }) => {
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

  const warehouseTypes = [
    "Raw Material",
    "Finished Goods",
    "WIP",
    "Consumable",
    "Subcontract",
    "Tool",
    "Scrap",
    "Quarantine"
  ];

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

  // Validate main form
  const validateForm = () => {
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

  // Submit update
  const handleSubmit = async () => {
    if (!validateForm()) return;

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
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
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Edit Warehouse
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Basic Information Section */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: COLORS.text.secondary,
                letterSpacing: '0.5px',
                mb: 1.5
              }}
            >
              BASIC INFORMATION
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {/* Warehouse Name - Column 1 Row 1 */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
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
                    variant="outlined"
                    sx={{
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
                    }}
                  />
                </Box>
              </Box>

              {/* Warehouse Type (Read Only) - Column 2 Row 1 */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
                    WAREHOUSE TYPE
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.warehouse_type}
                    disabled
                    size="small"
                    variant="outlined"
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
              </Box>

              {/* Location - Column 1 Row 2 */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
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
                    variant="outlined"
                    sx={{
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
                    }}
                  />
                </Box>
              </Box>

              {/* Manager - Column 2 Row 2 */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
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
                              {emp.EmployeeID && (
                                <Typography component="span" variant="caption" sx={{ color: COLORS.text.tertiary }}>
                                  ({emp.EmployeeID})
                                </Typography>
                              )}
                            </Stack>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Active Status - Full Width Row 3 */}
              <Box sx={{ gridColumn: 'span 2' }}>
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
              </Box>
            </Box>
          </Box>

          {/* Bins Section */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: COLORS.text.secondary,
                  letterSpacing: '0.5px'
                }}
              >
                BINS CONFIGURATION
              </Typography>
              <Button
                startIcon={<Add sx={{ fontSize: '0.875rem' }} />}
                onClick={handleAddBinClick}
                disabled={loading}
                size="small"
                sx={{
                  textTransform: "none",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: COLORS.primary,
                  '&:hover': {
                    bgcolor: COLORS.primaryLight
                  }
                }}
              >
                Add Bin
              </Button>
            </Stack>

            {/* Add/Edit Bin Form */}
            {isAddingBin && (
              <Paper 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2, 
                  border: `1px solid ${COLORS.primary}`,
                  boxShadow: "none",
                  bgcolor: COLORS.background.light
                }}
              >
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  {editingBin !== null ? "Edit Bin" : "Add New Bin"}
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <Box sx={{ gridColumn: { xs: 'span 2', sm: 'span 1' } }}>
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
                  </Box>

                  <Box sx={{ gridColumn: { xs: 'span 2', sm: 'span 1' } }}>
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
                  </Box>

                  <Box sx={{ gridColumn: 'span 2' }}>
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
                  </Box>

                  <Box>
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
                  </Box>

                  <Box>
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
                  </Box>

                  <Box sx={{ gridColumn: 'span 2' }}>
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
                  </Box>

                  <Box sx={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                  </Box>
                </Box>
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
                    boxShadow: "none",
                    bgcolor: COLORS.background.white,
                    '&:hover': {
                      borderColor: COLORS.primary
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
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
                      <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
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
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1, mt: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.6rem', display: 'block' }}>
                        Bin ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {bin.bin_id}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.6rem', display: 'block' }}>
                        Rack
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {bin.rack}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.6rem', display: 'block' }}>
                        Position
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {bin.row},{bin.col}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.6rem', display: 'block' }}>
                        Capacity
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {bin.capacity.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))
            )}
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1.5,
                mt: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem',
                  alignItems: 'center'
                },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
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
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.warehouse_name.trim() || !formData.location.trim()}
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
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Updating...' : 'Update Warehouse'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWareHouse;