import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  InputAdornment
} from "@mui/material";
import { Add, Delete, Close, Inventory, Warehouse, Person, Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import AddEmployees from "../../hrmaster/employeemaster/AddEmployees";

// Color constants matching the reference code
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

const AddWareHouse = ({ open, onClose, onAdd, warehouseId, warehouseName }) => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [fetchingEmployees, setFetchingEmployees] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);

  // State for Create Warehouse
  const [formData, setFormData] = useState({
    warehouse_name: "",
    warehouse_type: "",
    location: "",
    manager_id: ""
  });

  const [bins, setBins] = useState([
    {
      bin_id: "",
      bin_code: "",
      rack: "",
      row: "",
      col: "",
      capacity: ""
    }
  ]);

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

  // Helper function to get employee display name from FirstName + LastName
  const getEmployeeDisplayName = (employee) => {
    if (!employee) return "Unknown Employee";
    
    if (employee.FirstName && employee.LastName) {
      return `${employee.FirstName} ${employee.LastName}`;
    }
    if (employee.FirstName) {
      return employee.FirstName;
    }
    if (employee.LastName) {
      return employee.LastName;
    }
    if (employee.name) return employee.name;
    if (employee.employee_name) return employee.employee_name;
    if (employee.email) return employee.email.split('@')[0];
    if (employee.EmployeeID) return `Employee ${employee.EmployeeID}`;
    
    return "Unknown Employee";
  };

  // Get employee department name
  const getEmployeeDepartment = (employee) => {
    if (employee.DepartmentID) {
      if (typeof employee.DepartmentID === 'object') {
        return employee.DepartmentID.DepartmentName;
      }
      return employee.DepartmentID;
    }
    if (employee.department) return employee.department;
    return null;
  };

  // Get employee designation
  const getEmployeeDesignation = (employee) => {
    if (employee.DesignationID) {
      if (typeof employee.DesignationID === 'object') {
        return employee.DesignationID.DesignationName;
      }
      return employee.DesignationID;
    }
    if (employee.designation) return employee.designation;
    return null;
  };

  // Fetch Employees for Manager selection
  const fetchEmployees = async () => {
    try {
      setFetchingEmployees(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/employees?page=1&limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const employeeList = res.data.data || [];
        setEmployees(employeeList);
      } else {
        console.error("Failed to fetch employees:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setFetchingEmployees(false);
    }
  };

  // Handle employee added from modal
  const handleEmployeeAdded = (newEmployee) => {
    // Add the new employee to the employees list
    setEmployees(prev => [...prev, newEmployee]);
    // Automatically select the newly added employee as manager
    setFormData(prev => ({
      ...prev,
      manager_id: newEmployee._id
    }));
    // Clear any manager-related error
    if (errors.manager_id) {
      setErrors(prev => ({
        ...prev,
        manager_id: ''
      }));
    }
  };

  useEffect(() => {
    if (open) {
      fetchEmployees();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      warehouse_name: "",
      warehouse_type: "",
      location: "",
      manager_id: ""
    });
    setBins([
      {
        bin_id: "",
        bin_code: "",
        rack: "",
        row: "",
        col: "",
        capacity: ""
      }
    ]);
    setErrors({});
  };

  // ==================== CREATE WAREHOUSE HANDLERS ====================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleManagerSelect = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, manager_id: value });
    if (errors.manager_id) {
      setErrors({ ...errors, manager_id: "" });
    }
  };

  const handleBinChange = (index, field, value) => {
    const updated = [...bins];
    updated[index][field] = value;
    setBins(updated);
    
    if (errors[`bin_${index}_${field}`]) {
      setErrors({ ...errors, [`bin_${index}_${field}`]: "" });
    }
  };

  const addBin = () => {
    setBins([
      ...bins,
      { bin_id: "", bin_code: "", rack: "", row: "", col: "", capacity: "" }
    ]);
  };

  const removeBin = (index) => {
    const updated = bins.filter((_, i) => i !== index);
    setBins(updated);
  };

  const validateWarehouseForm = () => {
    const newErrors = {};

    if (!formData.warehouse_name.trim()) {
      newErrors.warehouse_name = "Warehouse name is required";
    }
    if (!formData.warehouse_type) {
      newErrors.warehouse_type = "Warehouse type is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.manager_id) {
      newErrors.manager_id = "Manager is required";
    }

    bins.forEach((bin, index) => {
      if (!bin.bin_id.trim()) {
        newErrors[`bin_${index}_bin_id`] = "Bin ID is required";
      }
      if (!bin.bin_code.trim()) {
        newErrors[`bin_${index}_bin_code`] = "Bin code is required";
      }
      if (!bin.rack.trim()) {
        newErrors[`bin_${index}_rack`] = "Rack is required";
      }
      if (!bin.row) {
        newErrors[`bin_${index}_row`] = "Row is required";
      } else if (bin.row <= 0) {
        newErrors[`bin_${index}_row`] = "Row must be greater than 0";
      }
      if (!bin.col) {
        newErrors[`bin_${index}_col`] = "Column is required";
      } else if (bin.col <= 0) {
        newErrors[`bin_${index}_col`] = "Column must be greater than 0";
      }
      if (!bin.capacity) {
        newErrors[`bin_${index}_capacity`] = "Capacity is required";
      } else if (bin.capacity <= 0) {
        newErrors[`bin_${index}_capacity`] = "Capacity must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateWarehouse = async () => {
    if (!validateWarehouseForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        bins: bins.map((b) => ({
          bin_id: b.bin_id.trim(),
          bin_code: b.bin_code.trim(),
          rack: b.rack.trim(),
          row: Number(b.row),
          col: Number(b.col),
          capacity: Number(b.capacity)
        }))
      };

      const res = await axios.post(`${BASE_URL}/api/warehouses`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.data.success) {
        if (onAdd) onAdd(res.data.data);
        onClose();
      } else {
        setErrors({ submit: res.data.message || "Failed to create warehouse" });
      }
    } catch (err) {
      console.error("Error creating warehouse:", err);
      if (err.response?.data?.message) {
        setErrors({ submit: err.response.data.message });
      } else {
        setErrors({ submit: "Failed to create warehouse. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================
  return (
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
          overflow: 'hidden'
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
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Add Warehouse
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {errors.submit && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1.5, 
              mb: 2,
              '& .MuiAlert-icon': {
                fontSize: '1.25rem',
                alignItems: 'center'
              },
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {errors.submit}
          </Alert>
        )}

        <Box>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    WAREHOUSE NAME <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    name="warehouse_name"
                    size="small"
                    value={formData.warehouse_name}
                    onChange={handleChange}
                    error={!!errors.warehouse_name}
                    helperText={errors.warehouse_name}
                    placeholder="Enter warehouse name"
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
                        color: COLORS.text.primary,
                        '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    WAREHOUSE TYPE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small" error={!!errors.warehouse_type}>
                    <Select
                      name="warehouse_type"
                      value={formData.warehouse_type}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select warehouse type</MenuItem>
                      {warehouseTypes.map((type) => (
                        <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>
                      ))}
                    </Select>
                    {errors.warehouse_type && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, fontSize: '0.65rem' }}>
                        {errors.warehouse_type}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    LOCATION <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    name="location"
                    size="small"
                    value={formData.location}
                    onChange={handleChange}
                    error={!!errors.location}
                    helperText={errors.location}
                    placeholder="Enter location"
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
                        color: COLORS.text.primary,
                        '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    MANAGER <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <FormControl fullWidth size="small" error={!!errors.manager_id}>
                        <Select
                          name="manager_id"
                          value={formData.manager_id}
                          onChange={handleManagerSelect}
                          displayEmpty
                          sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                          renderValue={(selected) => {
                            if (!selected) return <span style={{ color: COLORS.text.tertiary }}>Select manager</span>;
                            const employee = employees.find(emp => emp._id === selected);
                            return getEmployeeDisplayName(employee);
                          }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                            <em>Select manager</em>
                          </MenuItem>
                          {fetchingEmployees ? (
                            <MenuItem disabled sx={{ fontSize: '0.75rem' }}>
                              <CircularProgress size={16} sx={{ mr: 1 }} />
                              Loading employees...
                            </MenuItem>
                          ) : (
                            employees.map((emp) => (
                              <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: '0.75rem' }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                                  <Person sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography component="span" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                                      {getEmployeeDisplayName(emp)}
                                    </Typography>
                                    {emp.EmployeeID && (
                                      <Typography component="span" variant="caption" sx={{ color: COLORS.text.tertiary, ml: 1, fontSize: '0.65rem' }}>
                                        ({emp.EmployeeID})
                                      </Typography>
                                    )}
                                  </Box>
                                </Stack>
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.manager_id && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, fontSize: '0.65rem' }}>
                            {errors.manager_id}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setAddEmployeeOpen(true)}
                      disabled={loading || fetchingEmployees}
                      startIcon={<Add sx={{ fontSize: '0.875rem' }} />}
                      sx={{
                        height: 32,
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
            </Grid>
          </Box>

          {/* Bins Section */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                BINS CONFIGURATION
              </Typography>
              <Chip 
                label={`${bins.length} bin(s)`} 
                size="small" 
                sx={{ 
                  fontSize: "0.65rem", 
                  height: 22,
                  bgcolor: COLORS.primaryLight,
                  color: COLORS.primary,
                  fontWeight: 500
                }} 
              />
            </Stack>

            {bins.map((bin, index) => (
              <Paper 
                key={index} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2, 
                  border: `1px solid ${COLORS.border}`, 
                  boxShadow: "none",
                  bgcolor: COLORS.background.light
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Bin #{index + 1}
                  </Typography>
                  {index > 0 && (
                    <IconButton size="small" onClick={() => removeBin(index)} sx={{ p: 0.5 }}>
                      <Delete fontSize="small" sx={{ color: '#EF4444' }} />
                    </IconButton>
                  )}
                </Stack>
                
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Bin ID"
                      size="small"
                      fullWidth
                      placeholder="e.g., BIN-001"
                      value={bin.bin_id}
                      onChange={(e) => handleBinChange(index, "bin_id", e.target.value)}
                      error={!!errors[`bin_${index}_bin_id`]}
                      helperText={errors[`bin_${index}_bin_id`]}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.7rem' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Bin Code"
                      size="small"
                      fullWidth
                      placeholder="e.g., A-1-1"
                      value={bin.bin_code}
                      onChange={(e) => handleBinChange(index, "bin_code", e.target.value)}
                      error={!!errors[`bin_${index}_bin_code`]}
                      helperText={errors[`bin_${index}_bin_code`]}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.7rem' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Rack"
                      size="small"
                      fullWidth
                      placeholder="e.g., A"
                      value={bin.rack}
                      onChange={(e) => handleBinChange(index, "rack", e.target.value)}
                      error={!!errors[`bin_${index}_rack`]}
                      helperText={errors[`bin_${index}_rack`]}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.7rem' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Row"
                      size="small"
                      fullWidth
                      type="number"
                      placeholder="1"
                      value={bin.row}
                      onChange={(e) => handleBinChange(index, "row", e.target.value)}
                      error={!!errors[`bin_${index}_row`]}
                      helperText={errors[`bin_${index}_row`]}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.7rem' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Column"
                      size="small"
                      fullWidth
                      type="number"
                      placeholder="1"
                      value={bin.col}
                      onChange={(e) => handleBinChange(index, "col", e.target.value)}
                      error={!!errors[`bin_${index}_col`]}
                      helperText={errors[`bin_${index}_col`]}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.7rem' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Capacity (Units)"
                      size="small"
                      fullWidth
                      type="number"
                      placeholder="5000"
                      value={bin.capacity}
                      onChange={(e) => handleBinChange(index, "capacity", e.target.value)}
                      error={!!errors[`bin_${index}_capacity`]}
                      helperText={errors[`bin_${index}_capacity`]}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.7rem' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button
              startIcon={<Add sx={{ fontSize: '1rem' }} />}
              onClick={addBin}
              size="small"
              sx={{
                textTransform: "none",
                fontSize: "0.7rem",
                fontWeight: 500,
                color: COLORS.primary,
                '&:hover': { bgcolor: COLORS.primaryLight }
              }}
            >
              Add Another Bin
            </Button>
          </Box>
        </Box>
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
          onClick={handleCreateWarehouse}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': { bgcolor: COLORS.primaryDark },
            '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
          }}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: COLORS.text.light }} />
          ) : (
            "Create Warehouse"
          )}
        </Button>
      </DialogActions>

      {/* Add Employee Modal */}
      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAdd={handleEmployeeAdded}
      />
    </Dialog>
  );
};

export default AddWareHouse;