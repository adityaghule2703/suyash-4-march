import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Stack,
  Grid,
  Box,
  Paper,
  IconButton,
  Autocomplete,
  Chip,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warehouse as WarehouseIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS, WAREHOUSE_TYPE_OPTIONS, UNIT_OPTIONS } from './constants';

const AddWareHouse = ({ open, onClose, onAdd, users, usersLoading }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    warehouse_name: '',
    warehouse_type: 'Raw Material',
    location: '',
    manager_id: null,
    bins: []
  });
  
  const [binForm, setBinForm] = useState({
    bin_id: '',
    bin_code: '',
    rack: '',
    row: '',
    col: '',
    capacity: '',
    unit: 'Nos'
  });
  
  const [editingBinIndex, setEditingBinIndex] = useState(null);
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);
  
  const resetForm = () => {
    setFormData({
      warehouse_name: '',
      warehouse_type: 'Raw Material',
      location: '',
      manager_id: null,
      bins: []
    });
    setBinForm({
      bin_id: '',
      bin_code: '',
      rack: '',
      row: '',
      col: '',
      capacity: '',
      unit: 'Nos'
    });
    setEditingBinIndex(null);
    setFieldErrors({});
    setError('');
    setActiveTab(0);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleTypeChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, warehouse_type: newValue || 'Raw Material' }));
    setFieldErrors(prev => ({ ...prev, warehouse_type: '' }));
  };
  
  const handleManagerChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, manager_id: newValue?._id || null }));
  };
  
  const handleBinChange = (e) => {
    const { name, value } = e.target;
    setBinForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const generateBinCode = () => {
    const { rack, row, col } = binForm;
    if (rack && row && col) {
      const binCode = `${rack}-${row}-${col}`;
      setBinForm(prev => ({ ...prev, bin_code: binCode }));
    }
  };
  
  useEffect(() => {
    generateBinCode();
  }, [binForm.rack, binForm.row, binForm.col]);
  
  const addBin = () => {
    // Validate bin form
    if (!binForm.bin_id.trim()) {
      setFieldErrors(prev => ({ ...prev, bin_id: 'Bin ID is required' }));
      return;
    }
    if (!binForm.bin_code.trim()) {
      setFieldErrors(prev => ({ ...prev, bin_code: 'Bin code is required' }));
      return;
    }
    if (!binForm.capacity) {
      setFieldErrors(prev => ({ ...prev, capacity: 'Capacity is required' }));
      return;
    }
    
    const newBin = {
      bin_id: binForm.bin_id.trim(),
      bin_code: binForm.bin_code.trim(),
      rack: binForm.rack.trim(),
      row: binForm.row ? Number(binForm.row) : undefined,
      col: binForm.col ? Number(binForm.col) : undefined,
      capacity: Number(binForm.capacity),
      is_active: true
    };
    
    if (editingBinIndex !== null) {
      const updatedBins = [...formData.bins];
      updatedBins[editingBinIndex] = newBin;
      setFormData(prev => ({ ...prev, bins: updatedBins }));
    } else {
      setFormData(prev => ({ ...prev, bins: [...prev.bins, newBin] }));
    }
    
    // Reset bin form
    setBinForm({
      bin_id: '',
      bin_code: '',
      rack: '',
      row: '',
      col: '',
      capacity: '',
      unit: 'Nos'
    });
    setEditingBinIndex(null);
    setFieldErrors(prev => ({ ...prev, bin_id: '', bin_code: '', capacity: '' }));
  };
  
  const editBin = (index) => {
    const bin = formData.bins[index];
    setBinForm({
      bin_id: bin.bin_id || '',
      bin_code: bin.bin_code || '',
      rack: bin.rack || '',
      row: bin.row?.toString() || '',
      col: bin.col?.toString() || '',
      capacity: bin.capacity?.toString() || '',
      unit: 'Nos'
    });
    setEditingBinIndex(index);
  };
  
  const removeBin = (index) => {
    const updatedBins = formData.bins.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, bins: updatedBins }));
    if (editingBinIndex === index) {
      setBinForm({
        bin_id: '',
        bin_code: '',
        rack: '',
        row: '',
        col: '',
        capacity: '',
        unit: 'Nos'
      });
      setEditingBinIndex(null);
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.warehouse_name.trim()) {
      errors.warehouse_name = 'Warehouse name is required';
    }
    if (!formData.warehouse_type) {
      errors.warehouse_type = 'Warehouse type is required';
    }
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields');
      if (activeTab !== 0) setActiveTab(0);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const requestData = {
        warehouse_name: formData.warehouse_name,
        warehouse_type: formData.warehouse_type,
        location: formData.location,
        manager_id: formData.manager_id,
        bins: formData.bins.map(bin => ({
          bin_id: bin.bin_id,
          bin_code: bin.bin_code,
          rack: bin.rack,
          row: bin.row,
          col: bin.col,
          capacity: bin.capacity
        }))
      };
      
      const response = await axios.post(`${BASE_URL}/api/warehouses`, requestData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        onAdd(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to add warehouse');
      }
    } catch (err) {
      console.error('Error adding warehouse:', err);
      setError(err.response?.data?.message || 'Failed to add warehouse. Please try again.');
    } finally {
      setLoading(false);
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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Add New Warehouse
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{
          px: 2.5,
          pt: 1,
          borderBottom: `1px solid ${COLORS.border}`,
          '& .MuiTab-root': {
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'none',
            minHeight: 40
          }
        }}
      >
        <Tab label="Basic Information" />
        <Tab label={`Bins (${formData.bins.length})`} />
      </Tabs>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {activeTab === 0 && (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <WarehouseIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Warehouse Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      WAREHOUSE NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="warehouse_name"
                      value={formData.warehouse_name}
                      onChange={handleChange}
                      placeholder="e.g., Raw Material Store - Copper & Aluminum"
                      error={!!fieldErrors.warehouse_name}
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
                    {fieldErrors.warehouse_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.warehouse_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      WAREHOUSE TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={WAREHOUSE_TYPE_OPTIONS}
                      value={formData.warehouse_type}
                      onChange={handleTypeChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select warehouse type"
                          error={!!fieldErrors.warehouse_type}
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
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MANAGER
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={users}
                      getOptionLabel={(option) => option.Username || option.name || option.Email || ''}
                      loading={usersLoading}
                      value={users.find(u => u._id === formData.manager_id) || null}
                      onChange={handleManagerChange}
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select manager"
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
                              color: COLORS.text.primary
                            }
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {usersLoading && <CircularProgress size={16} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LOCATION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Building A, Ground Floor, Section 2"
                      error={!!fieldErrors.location}
                      multiline
                      rows={2}
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
                    {fieldErrors.location && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.location}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        )}
        
        {activeTab === 1 && (
          <Stack spacing={2}>
            {/* Add Bin Form */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                {editingBinIndex !== null ? 'Edit Bin' : 'Add New Bin'}
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BIN ID <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="bin_id"
                      value={binForm.bin_id}
                      onChange={handleBinChange}
                      placeholder="e.g., BIN-001"
                      error={!!fieldErrors.bin_id}
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BIN CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="bin_code"
                      value={binForm.bin_code}
                      onChange={handleBinChange}
                      placeholder="e.g., A-1-1"
                      error={!!fieldErrors.bin_code}
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      RACK
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rack"
                      value={binForm.rack}
                      onChange={handleBinChange}
                      placeholder="A"
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ROW
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="row"
                      type="number"
                      value={binForm.row}
                      onChange={handleBinChange}
                      placeholder="1"
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      COLUMN
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="col"
                      type="number"
                      value={binForm.col}
                      onChange={handleBinChange}
                      placeholder="1"
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CAPACITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="capacity"
                      type="number"
                      value={binForm.capacity}
                      onChange={handleBinChange}
                      placeholder="5000"
                      error={!!fieldErrors.capacity}
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                {editingBinIndex !== null && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setBinForm({
                        bin_id: '',
                        bin_code: '',
                        rack: '',
                        row: '',
                        col: '',
                        capacity: '',
                        unit: 'Nos'
                      });
                      setEditingBinIndex(null);
                    }}
                    sx={{
                      mr: 1,
                      height: 32,
                      px: 2,
                      borderRadius: 1.5,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.text.secondary,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      textTransform: 'none'
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="contained"
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={addBin}
                  sx={{
                    height: 32,
                    px: 2,
                    borderRadius: 1.5,
                    bgcolor: COLORS.primary,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    textTransform: 'none'
                  }}
                >
                  {editingBinIndex !== null ? 'Update Bin' : 'Add Bin'}
                </Button>
              </Box>
            </Paper>
            
            {/* Bins List */}
            {formData.bins.length > 0 && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5 
                }}>
                  <QrCodeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Bins List ({formData.bins.length})
                </Typography>
                
                <Stack spacing={1}>
                  {formData.bins.map((bin, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 1.5,
                        bgcolor: COLORS.background.light,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                          <Box>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {bin.bin_code}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {bin.bin_id}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            {bin.rack && (
                              <Chip
                                label={`Rack: ${bin.rack}`}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20 }}
                              />
                            )}
                            {bin.row && (
                              <Chip
                                label={`Row: ${bin.row}`}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20 }}
                              />
                            )}
                            {bin.col && (
                              <Chip
                                label={`Col: ${bin.col}`}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20 }}
                              />
                            )}
                            <Chip
                              label={`Cap: ${bin.capacity.toLocaleString()}`}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                            />
                          </Stack>
                        </Stack>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => editBin(index)}>
                              <EditIcon sx={{ fontSize: '0.9rem' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton size="small" onClick={() => removeBin(index)}>
                              <DeleteIcon sx={{ fontSize: '0.9rem', color: '#EF4444' }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            )}
          </Stack>
        )}
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
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
        justifyContent: 'space-between'
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
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon sx={{ fontSize: '1rem' }} />}
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
            }
          }}
        >
          {loading ? 'Adding...' : 'Add Warehouse'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWareHouse;