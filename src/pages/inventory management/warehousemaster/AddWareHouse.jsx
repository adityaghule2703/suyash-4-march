import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from "@mui/material";
import { Add, Delete, Close, Person } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import AddEmployees from "../../hrmaster/employeemaster/AddEmployees";

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

const steps = ['Warehouse Details', 'Bins Configuration'];

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

const AddWareHouse = ({ open, onClose, onAdd, warehouseId, warehouseName }) => {
  const [activeStep, setActiveStep] = useState(0);
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

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    setFormData(prev => ({
      ...prev,
      manager_id: newEmployee._id
    }));
    if (errors.manager_id) {
      setErrors(prev => ({ ...prev, manager_id: '' }));
    }
  };

  useEffect(() => {
    if (open) {
      fetchEmployees();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setActiveStep(0);
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
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
    } else if (step === 1) {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCreateWarehouse = async () => {
    if (!validateStep(1)) return;

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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Warehouse Information
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                          {errors.warehouse_type}
                        </Typography>
                      )}
                    </FormControl>
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MANAGER <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                            <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select manager</MenuItem>
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
                                    <Typography sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                                      {getEmployeeDisplayName(emp)}
                                    </Typography>
                                  </Stack>
                                </MenuItem>
                              ))
                            )}
                          </Select>
                          {errors.manager_id && (
                            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                              {errors.manager_id}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAddEmployeeOpen(true)}
                        startIcon={<Add sx={{ fontSize: '0.875rem' }} />}
                        sx={{
                          height: 32,
                          px: 1.5,
                          borderRadius: 1.5,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.text.secondary,
                          fontSize: '0.7rem',
                          textTransform: 'none',
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

              {bins.map((bin, index) => (
                <Paper 
                  key={index} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 2, 
                    border: `1px solid ${COLORS.border}`, 
                    bgcolor: COLORS.background.light,
                    position: 'relative'
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
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
                    <Grid size={{ xs: 12, sm: 4 }}>
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

                    <Grid size={{ xs: 12, sm: 4 }}>
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

                    <Grid size={{ xs: 12, sm: 4 }}>
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

                    <Grid size={{ xs: 12, sm: 3 }}>
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

                    <Grid size={{ xs: 12, sm: 3 }}>
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

                    <Grid size={{ xs: 12, sm: 6 }}>
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
                Add Warehouse
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
          {errors.submit && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5, 
                mb: 2,
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {errors.submit}
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
                onClick={handleCreateWarehouse}
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
                {loading ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : 'Create Warehouse'}
              </Button>
            )}
          </Stack>
        </Box>
      </Dialog>

      {/* Add Employee Modal */}
      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAdd={handleEmployeeAdded}
      />
    </>
  );
};

export default AddWareHouse;