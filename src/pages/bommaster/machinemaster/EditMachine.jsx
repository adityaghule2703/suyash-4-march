// EditMachine.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS, MACHINE_TYPE_OPTIONS, CAPACITY_UNIT_OPTIONS } from './constants';

const steps = ['Basic Information', 'Capacity & Schedule', 'Technical Details', 'Review & Submit'];

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

const EditMachine = ({ open, onClose, machine, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    machine_name: '',
    machine_code: '',
    machine_type: '',
    capacity_value: 0,
    capacity_unit: 'Ton',
    work_centre: '',
    shifts_per_day: 1,
    hours_per_shift: 8,
    oee_target_percent: 75,
    make: '',
    model: '',
    serial_number: '',
    installation_date: '',
    location: '',
    operating_cost_per_hour: 0,
    maintenance_cost_per_hour: 0
  });

  useEffect(() => {
    if (open && machine) {
      setFormData({
        machine_name: machine.machine_name || '',
        machine_code: machine.machine_code || '',
        machine_type: machine.machine_type || 'Press',
        capacity_value: machine.capacity_value || 0,
        capacity_unit: machine.capacity_unit || 'Ton',
        work_centre: machine.work_centre || '',
        shifts_per_day: machine.shifts_per_day || 1,
        hours_per_shift: machine.hours_per_shift || 8,
        oee_target_percent: machine.oee_target_percent || 75,
        make: machine.make || '',
        model: machine.model || '',
        serial_number: machine.serial_number || '',
        installation_date: machine.installation_date ? new Date(machine.installation_date).toISOString().split('T')[0] : '',
        location: machine.location || '',
        operating_cost_per_hour: machine.operating_cost_per_hour || 0,
        maintenance_cost_per_hour: machine.maintenance_cost_per_hour || 0
      });
      setActiveStep(0);
      setFieldErrors({});
      setError('');
    }
  }, [open, machine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.machine_name.trim()) {
          errors.machine_name = 'Machine name is required';
          isValid = false;
        }
        if (!formData.machine_code.trim()) {
          errors.machine_code = 'Machine code is required';
          isValid = false;
        }
        if (!formData.machine_type) {
          errors.machine_type = 'Machine type is required';
          isValid = false;
        }
        break;

      case 1:
        if (!formData.work_centre.trim()) {
          errors.work_centre = 'Work centre is required';
          isValid = false;
        }
        if (!formData.shifts_per_day || formData.shifts_per_day <= 0) {
          errors.shifts_per_day = 'Valid shifts per day is required';
          isValid = false;
        }
        if (!formData.hours_per_shift || formData.hours_per_shift <= 0) {
          errors.hours_per_shift = 'Valid hours per shift is required';
          isValid = false;
        }
        break;

      case 2:
        if (!formData.make.trim()) {
          errors.make = 'Make is required';
          isValid = false;
        }
        if (!formData.model.trim()) {
          errors.model = 'Model is required';
          isValid = false;
        }
        if (!formData.serial_number.trim()) {
          errors.serial_number = 'Serial number is required';
          isValid = false;
        }
        if (!formData.installation_date) {
          errors.installation_date = 'Installation date is required';
          isValid = false;
        }
        break;

      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
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
    if (!validateStep(2)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const submitData = {
        ...formData,
        capacity_value: Number(formData.capacity_value),
        shifts_per_day: Number(formData.shifts_per_day),
        hours_per_shift: Number(formData.hours_per_shift),
        oee_target_percent: Number(formData.oee_target_percent),
        operating_cost_per_hour: Number(formData.operating_cost_per_hour),
        maintenance_cost_per_hour: Number(formData.maintenance_cost_per_hour)
      };

      const response = await axios.put(`${BASE_URL}/api/machines/${machine._id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update machine');
      }
    } catch (err) {
      console.error('Error updating machine:', err);
      setError(err.response?.data?.message || 'Failed to update machine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    const totalHoursPerDay = (formData.shifts_per_day || 0) * (formData.hours_per_shift || 0);

    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Machine ID
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, py: 1 }}>
                      {machine?.machine_id}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MACHINE NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="machine_name"
                      value={formData.machine_name}
                      onChange={handleChange}
                      error={!!fieldErrors.machine_name}
                      helperText={fieldErrors.machine_name}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MACHINE CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="machine_code"
                      value={formData.machine_code}
                      onChange={handleChange}
                      error={!!fieldErrors.machine_code}
                      helperText={fieldErrors.machine_code}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MACHINE TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.machine_type}>
                      <Select
                        name="machine_type"
                        value={formData.machine_type}
                        onChange={handleChange}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        {MACHINE_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      WORK CENTRE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="work_centre"
                      value={formData.work_centre}
                      onChange={handleChange}
                      error={!!fieldErrors.work_centre}
                      helperText={fieldErrors.work_centre}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      LOCATION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
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
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <SettingsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Capacity & Schedule
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Capacity Value"
                    size="small"
                    name="capacity_value"
                    value={formData.capacity_value}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.75rem' }}>Capacity Unit</InputLabel>
                    <Select
                      name="capacity_unit"
                      value={formData.capacity_unit}
                      onChange={handleChange}
                      label="Capacity Unit"
                      sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                    >
                      {CAPACITY_UNIT_OPTIONS.map(option => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Shifts per Day"
                    size="small"
                    name="shifts_per_day"
                    value={formData.shifts_per_day}
                    onChange={handleChange}
                    error={!!fieldErrors.shifts_per_day}
                    helperText={fieldErrors.shifts_per_day}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Hours per Shift"
                    size="small"
                    name="hours_per_shift"
                    value={formData.hours_per_shift}
                    onChange={handleChange}
                    error={!!fieldErrors.hours_per_shift}
                    helperText={fieldErrors.hours_per_shift}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="OEE Target (%)"
                    size="small"
                    name="oee_target_percent"
                    value={formData.oee_target_percent}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Hours/Day</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#059669' }}>
                      {totalHoursPerDay} hrs
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Technical Details
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Make"
                    size="small"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    error={!!fieldErrors.make}
                    helperText={fieldErrors.make}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Model"
                    size="small"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    error={!!fieldErrors.model}
                    helperText={fieldErrors.model}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Serial Number"
                    size="small"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    error={!!fieldErrors.serial_number}
                    helperText={fieldErrors.serial_number}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Installation Date"
                    size="small"
                    name="installation_date"
                    value={formData.installation_date}
                    onChange={handleChange}
                    error={!!fieldErrors.installation_date}
                    helperText={fieldErrors.installation_date}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Operating Cost (per hour)"
                    size="small"
                    name="operating_cost_per_hour"
                    value={formData.operating_cost_per_hour}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maintenance Cost (per hour)"
                    size="small"
                    name="maintenance_cost_per_hour"
                    value={formData.maintenance_cost_per_hour}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Review & Submit
              </Typography>

              <Stack spacing={2}>
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Basic Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine ID:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{machine?.machine_id}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Name:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.machine_name}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.machine_code}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Type:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.machine_type}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Centre:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.work_centre}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Location:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.location || '-'}</Typography></Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Capacity & Schedule
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Capacity:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.capacity_value} {formData.capacity_unit}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shifts/Day:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.shifts_per_day}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Hours/Shift:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.hours_per_shift} hrs</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Hours/Day:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#059669' }}>{totalHoursPerDay} hrs</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>OEE Target:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.oee_target_percent}%</Typography></Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Technical Details
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Make:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.make}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Model:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.model}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Serial Number:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.serial_number}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Installation Date:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.installation_date}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operating Cost:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>₹{formData.operating_cost_per_hour}/hr</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Maintenance Cost:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>₹{formData.maintenance_cost_per_hour}/hr</Typography></Grid>
                  </Grid>
                </Paper>
              </Stack>
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
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Edit Machine
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
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
          disabled={activeStep === 0 || loading}
          startIcon={<NavigateBeforeIcon />}
          sx={{ height: 32, px: 2, borderRadius: 1.5, fontSize: '0.7rem' }}
        >
          Back
        </Button>
        <Box>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ height: 32, px: 2, mr: 1, borderRadius: 1.5, fontSize: '0.7rem' }}
          >
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<SaveIcon />}
              sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<NavigateNextIcon />}
              sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem' }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditMachine;