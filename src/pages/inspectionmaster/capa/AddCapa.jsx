


// AddCapa.jsx
import React, { useState, useEffect, memo } from 'react';
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
  Chip,
  Divider,
  Card,
  CardContent,
  Autocomplete
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Build as BuildIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
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
};

// CAPA Types
const CAPA_TYPES = [
  { value: 'Corrective', label: 'Corrective', description: 'Fix existing problem' },
  { value: 'Preventive', label: 'Preventive', description: 'Prevent potential problem' },
  { value: 'Improvement', label: 'Improvement', description: 'Process optimisation beyond current requirement' }
];

// CAPA Sources
const CAPA_SOURCES = [
  { value: 'NCR', label: 'NCR', description: 'From quality failure' },
  { value: 'Customer Complaint', label: 'Customer Complaint', description: 'From customer feedback' },
  { value: 'Internal Audit', label: 'Internal Audit', description: 'From audit findings' },
  { value: 'Management Review', label: 'Management Review', description: 'From leadership review' },
  { value: 'Process Study', label: 'Process Study', description: 'From process capability analysis' },
  { value: 'Supplier Audit', label: 'Supplier Audit', description: 'From vendor assessment' },
  { value: 'Warranty Return', label: 'Warranty Return', description: 'From returned products' }
];

// Action Types
const ACTION_TYPES = [
  { value: 'Immediate', label: 'Immediate', description: 'Short-term containment' },
  { value: 'Short-Term', label: 'Short-Term', description: 'Quick fix within weeks' },
  { value: 'Long-Term', label: 'Long-Term', description: 'Permanent solution' },
  { value: 'Preventive', label: 'Preventive', description: 'Proactive measure' }
];

const steps = ['Basic Info', 'Root Cause & Actions', 'Review'];

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

// Memoized Action Dialog to prevent re-renders of the main form while typing
const MemoizedActionDialog = memo(({ 
  open, 
  onClose, 
  onSave, 
  initialData, 
  usersList, 
  actionType 
}) => {
  const [formData, setFormData] = useState({
    action_description: '',
    action_type: '',
    responsible_person_id: '',
    target_date: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        action_description: initialData.action_description || '',
        action_type: initialData.action_type || '',
        responsible_person_id: initialData.responsible_person_id || '',
        target_date: initialData.target_date ? new Date(initialData.target_date) : null
      });
    } else {
      setFormData({
        action_description: '',
        action_type: '',
        responsible_person_id: '',
        target_date: null
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.action_description?.trim()) newErrors.action_description = 'Required';
    if (!formData.action_type) newErrors.action_type = 'Required';
    if (!formData.responsible_person_id) newErrors.responsible_person_id = 'Required';
    if (!formData.target_date) newErrors.target_date = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      action_description: formData.action_description.trim(),
      action_type: formData.action_type,
      responsible_person_id: formData.responsible_person_id,
      target_date: formData.target_date.toISOString().split('T')[0]
    });
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': { py: 1, px: 1, fontSize: '0.75rem' },
    '& .MuiInputLabel-root': { fontSize: '0.65rem' }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ py: 1, px: 2 }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {initialData ? 'Edit Action' : `Add ${actionType === 'corrective' ? 'Corrective' : 'Preventive'} Action`}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Action Description"
            value={formData.action_description}
            onChange={(e) => handleChange('action_description', e.target.value)}
            error={!!errors.action_description}
            helperText={errors.action_description}
            sx={inputStyle}
            placeholder="Describe the action in detail..."
          />
          
          <TextField
            select
            fullWidth
            size="small"
            label="Action Type"
            value={formData.action_type}
            onChange={(e) => handleChange('action_type', e.target.value)}
            error={!!errors.action_type}
            helperText={errors.action_type}
            sx={inputStyle}
          >
            <MenuItem value="">Select Action Type</MenuItem>
            {ACTION_TYPES.map(type => (
              <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.7rem' }}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            fullWidth
            size="small"
            label="Responsible Person"
            value={formData.responsible_person_id}
            onChange={(e) => handleChange('responsible_person_id', e.target.value)}
            error={!!errors.responsible_person_id}
            helperText={errors.responsible_person_id}
            sx={inputStyle}
          >
            <MenuItem value="">Select Responsible Person</MenuItem>
            {usersList.map(user => (
              <MenuItem key={user._id} value={user._id} sx={{ fontSize: '0.7rem' }}>
                {user.Username || user.name || user.email}
              </MenuItem>
            ))}
          </TextField>
          
          <DatePicker 
            label="Target Date"
            value={formData.target_date} 
            onChange={(date) => handleChange('target_date', date)}
            minDate={new Date()}
            slotProps={{ 
              textField: { 
                size: 'small', 
                fullWidth: true,
                error: !!errors.target_date,
                helperText: errors.target_date,
                sx: inputStyle
              } 
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 1.5 }}>
        <Button 
          onClick={onClose} 
          size="small"
          sx={{ fontSize: '0.7rem', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          size="small" 
          sx={{ 
            bgcolor: COLORS.primary, 
            fontSize: '0.7rem', 
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const AddCapa = ({ open, onClose, onCapaAdded, preSelectedNcrId, preSelectedNcrNumber }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [ncrList, setNcrList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [fetchingNcrDetails, setFetchingNcrDetails] = useState(false);
  
  const [correctiveActions, setCorrectiveActions] = useState([]);
  const [preventiveActions, setPreventiveActions] = useState([]);
  const [editingAction, setEditingAction] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentActionType, setCurrentActionType] = useState('corrective');
  
  const [formData, setFormData] = useState({
    capa_type: '',
    source: '',
    ncr_id: preSelectedNcrId || '',
    source_reference: '',
    problem_statement: '',
    defect_description: '',
    quantity_affected: '',
    customer_impact: false,
    root_cause: '',
    assigned_to: '',
    target_close_date: null,
    remarks: ''
  });

  useEffect(() => {
    if (open) {
      fetchInitialData();
    }
  }, [open]);

  useEffect(() => {
    if (preSelectedNcrId && open) {
      fetchNcrDetails(preSelectedNcrId);
      setFormData(prev => ({ ...prev, ncr_id: preSelectedNcrId, source: 'NCR' }));
    }
  }, [preSelectedNcrId, open]);

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      
      const [ncrRes, usersRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/ncrs?limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (ncrRes.data.success) setNcrList(ncrRes.data.data || []);
      if (usersRes.data.success) setUsersList(usersRes.data.data || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load required data');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchNcrDetails = async (ncrId) => {
    if (!ncrId) return;
    
    setFetchingNcrDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const ncr = response.data.data;
        setFormData(prev => ({
          ...prev,
          problem_statement: ncr.defect_description || '',
          defect_description: ncr.defect_description || '',
          quantity_affected: ncr.rejected_qty || ncr.quantity || '',
          root_cause: ncr.root_cause || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching NCR details:', err);
    } finally {
      setFetchingNcrDetails(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleOpenActionDialog = (type, action = null) => {
    setCurrentActionType(type);
    setEditingAction(action);
    setActionDialogOpen(true);
  };

  const handleSaveAction = (actionData) => {
    if (currentActionType === 'corrective') {
      if (editingAction) {
        // Find the index of the action being edited and replace it
        const index = correctiveActions.findIndex(a => a === editingAction);
        if (index !== -1) {
          const updatedActions = [...correctiveActions];
          updatedActions[index] = actionData;
          setCorrectiveActions(updatedActions);
        }
      } else {
        setCorrectiveActions([...correctiveActions, actionData]);
      }
    } else {
      if (editingAction) {
        const index = preventiveActions.findIndex(a => a === editingAction);
        if (index !== -1) {
          const updatedActions = [...preventiveActions];
          updatedActions[index] = actionData;
          setPreventiveActions(updatedActions);
        }
      } else {
        setPreventiveActions([...preventiveActions, actionData]);
      }
    }
    
    setEditingAction(null);
    setActionDialogOpen(false);
    setError('');
  };

  const handleRemoveAction = (type, index) => {
    if (type === 'corrective') {
      setCorrectiveActions(correctiveActions.filter((_, i) => i !== index));
    } else {
      setPreventiveActions(preventiveActions.filter((_, i) => i !== index));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.capa_type) {
          setError('CAPA type is required');
          return false;
        }
        if (!formData.source) {
          setError('Source is required');
          return false;
        }
        if (formData.source === 'NCR' && !formData.ncr_id) {
          setError('Please select an NCR to link');
          return false;
        }
        setError('');
        return true;

      case 1:
        if (!formData.problem_statement?.trim()) {
          setError('Problem statement is required');
          return false;
        }
        if (!formData.root_cause?.trim()) {
          setError('Root cause analysis is required');
          return false;
        }
        if (correctiveActions.length === 0 && preventiveActions.length === 0) {
          setError('At least one corrective or preventive action is required');
          return false;
        }
        setError('');
        return true;

      case 2:
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

  // In AddCapa.jsx - Update the handleSubmit function
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
      capa_type: formData.capa_type,
      source: formData.source,
      problem_statement: formData.problem_statement,
      defect_description: formData.defect_description || formData.problem_statement,
      quantity_affected: Number(formData.quantity_affected) || 0,
      customer_impact: formData.customer_impact,
      root_cause: formData.root_cause,
      assigned_to: formData.assigned_to || null,
      target_close_date: formData.target_close_date ? formData.target_close_date.toISOString().split('T')[0] : null,
      corrective_actions: correctiveActions,
      preventive_actions: preventiveActions
    };

    if (formData.source === 'NCR' && formData.ncr_id) {
      requestBody.ncr_id = formData.ncr_id;
    }

    if (formData.source_reference) {
      requestBody.source_reference = formData.source_reference;
    }

    if (formData.remarks) {
      requestBody.remarks = formData.remarks;
    }

    const response = await axios.post(`${BASE_URL}/api/capas`, requestBody, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      // FIX: Pass the actual CAPA data directly
      if (onCapaAdded) {
        onCapaAdded(response.data.data); // Pass the CAPA object directly
      }
      handleClose();
    } else {
      setError(response.data.message || 'Failed to create CAPA');
    }
  } catch (err) {
    console.error('Error creating CAPA:', err);
    setError(err.response?.data?.message || 'Failed to create CAPA');
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    setFormData({
      capa_type: '',
      source: '',
      ncr_id: '',
      source_reference: '',
      problem_statement: '',
      defect_description: '',
      quantity_affected: '',
      customer_impact: false,
      root_cause: '',
      assigned_to: '',
      target_close_date: null,
      remarks: ''
    });
    setCorrectiveActions([]);
    setPreventiveActions([]);
    setError('');
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
    '& .MuiInputBase-input': { py: 1, px: 1, fontSize: '0.75rem' },
    '& .MuiInputLabel-root': { fontSize: '0.65rem' },
    '& .MuiInputLabel-root.Mui-focused': { fontSize: '0.65rem' }
  };

  const labelStyle = { fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.3 };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={1.5}>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>CAPA TYPE *</Typography>
                  <TextField select fullWidth size="small" value={formData.capa_type}
                    onChange={(e) => handleChange('capa_type', e.target.value)}
                    sx={inputStyle}>
                    <MenuItem value="">Select Type</MenuItem>
                    {CAPA_TYPES.map(type => <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.7rem' }}>
                      {type.label}
                    </MenuItem>)}
                  </TextField>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>SOURCE *</Typography>
                  <TextField select fullWidth size="small" value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    sx={inputStyle}>
                    <MenuItem value="">Select Source</MenuItem>
                    {CAPA_SOURCES.map(source => <MenuItem key={source.value} value={source.value} sx={{ fontSize: '0.7rem' }}>
                      {source.label}
                    </MenuItem>)}
                  </TextField>
                </Grid>

                {formData.source === 'NCR' && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={labelStyle}>LINKED NCR *</Typography>
                    <Autocomplete
                      options={ncrList}
                      getOptionLabel={(option) => `${option.ncr_number} - ${option.part_no} (${option.severity})`}
                      value={ncrList.find(n => n._id === formData.ncr_id) || null}
                      onChange={(event, newValue) => {
                        handleChange('ncr_id', newValue?._id || '');
                        if (newValue) fetchNcrDetails(newValue._id);
                      }}
                      disabled={!!preSelectedNcrId}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search NCR..."
                          sx={inputStyle}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '0.7rem' }} /></InputAdornment>,
                          }}
                        />
                      )}
                    />
                    {preSelectedNcrId && preSelectedNcrNumber && (
                      <Chip label={`Selected: ${preSelectedNcrNumber}`} size="small" sx={{ mt: 0.5, fontSize: '0.6rem', height: 20 }} />
                    )}
                  </Grid>
                )}

                {formData.source !== 'NCR' && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={labelStyle}>SOURCE REFERENCE</Typography>
                    <TextField fullWidth size="small" value={formData.source_reference}
                      onChange={(e) => handleChange('source_reference', e.target.value)}
                      placeholder="Reference number/ID"
                      sx={inputStyle} />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={1.5}>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={labelStyle}>PROBLEM STATEMENT *</Typography>
              <TextField fullWidth multiline rows={2} size="small" value={formData.problem_statement}
                onChange={(e) => handleChange('problem_statement', e.target.value)}
                placeholder="Describe the problem..."
                sx={inputStyle} />
            </Paper>

            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>QUANTITY AFFECTED</Typography>
                  <TextField fullWidth size="small" type="number" value={formData.quantity_affected}
                    onChange={(e) => handleChange('quantity_affected', e.target.value)}
                    placeholder="Units" sx={inputStyle} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>CUSTOMER IMPACT</Typography>
                  <RadioGroup row value={formData.customer_impact} onChange={(e) => handleChange('customer_impact', e.target.value === 'true')}>
                    <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" sx={{ mr: 1 }} />
                    <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={labelStyle}>ROOT CAUSE ANALYSIS *</Typography>
              <TextField fullWidth multiline rows={2} size="small" value={formData.root_cause}
                onChange={(e) => handleChange('root_cause', e.target.value)}
                placeholder="Identify root cause..."
                sx={inputStyle} />
            </Paper>

            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={labelStyle}>CORRECTIVE ACTIONS</Typography>
              <Button variant="outlined" size="small" startIcon={<AddIcon />}
                onClick={() => handleOpenActionDialog('corrective')}
                sx={{ my: 1, borderRadius: 1.5, fontSize: '0.65rem', py: 0.3 }}>
                Add Action
              </Button>
              {correctiveActions.map((action, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: COLORS.background.light, p: 0.5, borderRadius: 1, mb: 0.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{action.action_description}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3 }}>
                      <Chip label={action.action_type} size="small" sx={{ fontSize: '0.55rem', height: 18 }} />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenActionDialog('corrective', action)} sx={{ mr: 0.5 }}>
                      <BuildIcon sx={{ fontSize: '0.7rem' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleRemoveAction('corrective', idx)}>
                      <DeleteIcon sx={{ fontSize: '0.7rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              {correctiveActions.length === 0 && (
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>No actions added</Typography>
              )}
            </Paper>

            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={labelStyle}>PREVENTIVE ACTIONS</Typography>
              <Button variant="outlined" size="small" startIcon={<AddIcon />}
                onClick={() => handleOpenActionDialog('preventive')}
                sx={{ my: 1, borderRadius: 1.5, fontSize: '0.65rem', py: 0.3 }}>
                Add Action
              </Button>
              {preventiveActions.map((action, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: COLORS.background.light, p: 0.5, borderRadius: 1, mb: 0.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{action.action_description}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3 }}>
                      <Chip label={action.action_type} size="small" sx={{ fontSize: '0.55rem', height: 18 }} />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenActionDialog('preventive', action)} sx={{ mr: 0.5 }}>
                      <BuildIcon sx={{ fontSize: '0.7rem' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleRemoveAction('preventive', idx)}>
                      <DeleteIcon sx={{ fontSize: '0.7rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              {preventiveActions.length === 0 && (
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>No actions added</Typography>
              )}
            </Paper>

            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>ASSIGNED TO</Typography>
                  <TextField select fullWidth size="small" value={formData.assigned_to}
                    onChange={(e) => handleChange('assigned_to', e.target.value)}
                    sx={inputStyle}>
                    <MenuItem value="">Select</MenuItem>
                    {usersList.map(user => <MenuItem key={user._id} value={user._id} sx={{ fontSize: '0.7rem' }}>
                      {user.Username || user.name}
                    </MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>TARGET CLOSE DATE</Typography>
                  <DatePicker 
                    value={formData.target_close_date} 
                    onChange={(date) => handleChange('target_close_date', date)}
                    slotProps={{ 
                      textField: { size: 'small', fullWidth: true, sx: inputStyle } 
                    }} 
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        const totalActions = correctiveActions.length + preventiveActions.length;
        return (
          <Stack spacing={1.5}>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>Confirm CAPA Details</Typography>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Review before submitting</Typography>
            </Paper>

            <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 1.5 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Type</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.capa_type || '-'}</Typography></Grid>
                  <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Source</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.source || '-'}</Typography></Grid>
                  <Grid size={{ xs: 12 }}><Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Problem</Typography>
                    <Typography sx={{ fontSize: '0.65rem' }}>{formData.problem_statement?.substring(0, 100)}</Typography></Grid>
                  <Grid size={{ xs: 12 }}><Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Root Cause</Typography>
                    <Typography sx={{ fontSize: '0.65rem' }}>{formData.root_cause?.substring(0, 100)}</Typography></Grid>
                  <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Corrective Actions</Typography>
                    <Chip label={correctiveActions.length} size="small" sx={{ fontSize: '0.6rem', height: 18 }} /></Grid>
                  <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Preventive Actions</Typography>
                    <Chip label={preventiveActions.length} size="small" sx={{ fontSize: '0.6rem', height: 18 }} /></Grid>
                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 0.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Total Actions</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>{totalActions}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
        
        <DialogTitle sx={{ py: 1, px: 2, bgcolor: COLORS.background.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BuildIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>Create CAPA</Typography>
            {preSelectedNcrNumber && <Chip label={preSelectedNcrNumber} size="small" sx={{ fontSize: '0.6rem', height: 20 }} />}
          </Box>
          <IconButton size="small" onClick={handleClose} disabled={loading}><CloseIcon sx={{ fontSize: '0.9rem' }} /></IconButton>
        </DialogTitle>

        <Box sx={{ px: 2, pt: 1.5, bgcolor: COLORS.background.white }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} sx={{ '& .MuiStepLabel-label': { fontSize: '0.65rem' } }}>
            {steps.map((label) => (<Step key={label}><StepLabel><Typography sx={{ fontSize: '0.6rem' }}>{label}</Typography></StepLabel></Step>))}
          </Stepper>
        </Box>

        <DialogContent sx={{ p: 2, bgcolor: COLORS.background.white }}>
          {loadingData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={32} /></Box>
          ) : (
            <>
              {renderStepContent(activeStep)}
              {error && <Alert severity="error" sx={{ mt: 1, fontSize: '0.7rem', py: 0 }}>{error}</Alert>}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1, borderTop: `1px solid ${COLORS.border}`, justifyContent: 'space-between' }}>
          <Button onClick={handleBack} disabled={activeStep === 0 || loading} size="small"
            sx={{ height: 28, px: 1.5, fontSize: '0.65rem' }}>Back</Button>
          <Box>
            <Button onClick={handleClose} disabled={loading} size="small" sx={{ height: 28, px: 1.5, mr: 1, fontSize: '0.65rem' }}>Cancel</Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSubmit} disabled={loading}
                startIcon={loading ? <CircularProgress size={12} /> : <AddIcon sx={{ fontSize: '0.8rem' }} />}
                sx={{ height: 28, px: 1.5, bgcolor: COLORS.primary, fontSize: '0.65rem' }}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} disabled={loading}
                sx={{ height: 28, px: 1.5, bgcolor: COLORS.primary, fontSize: '0.65rem' }}>Next</Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
      
      <MemoizedActionDialog 
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        onSave={handleSaveAction}
        initialData={editingAction}
        usersList={usersList}
        actionType={currentActionType}
      />
    </LocalizationProvider>
  );
};

export default AddCapa;