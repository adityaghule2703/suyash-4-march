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
  CircularProgress
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
  Save as SaveIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS, WAREHOUSE_TYPE_OPTIONS } from './constants';

const EditWareHouse = ({ open, onClose, onUpdate, warehouse, users, usersLoading }) => {
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
  
  // Initialize form with warehouse data
  useEffect(() => {
    if (warehouse && open) {
      setFormData({
        warehouse_name: warehouse.warehouse_name || '',
        warehouse_type: warehouse.warehouse_type || 'Raw Material',
        location: warehouse.location || '',
        manager_id: warehouse.manager_id?._id || warehouse.manager_id || null,
        bins: warehouse.bins || []
      });
    }
    setFieldErrors({});
    setError('');
    setActiveTab(0);
    resetBinForm();
  }, [warehouse, open]);
  
  const resetBinForm = () => {
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
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleTypeChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, warehouse_type: newValue || 'Raw Material' }));
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
    
    resetBinForm();
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
      resetBinForm();
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
      
      const response = await axios.put(`${BASE_URL}/api/warehouses/${warehouse._id}`, requestData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        onUpdate(response.data.data);
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
          Edit Warehouse
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
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
                      multiline
                      rows={2}
                      error={!!fieldErrors.location}
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
                  <TextField
                    fullWidth
                    size="small"
                    name="bin_id"
                    label="Bin ID"
                    value={binForm.bin_id}
                    onChange={handleBinChange}
                    error={!!fieldErrors.bin_id}
                    helperText={fieldErrors.bin_id}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    name="bin_code"
                    label="Bin Code"
                    value={binForm.bin_code}
                    onChange={handleBinChange}
                    error={!!fieldErrors.bin_code}
                    helperText={fieldErrors.bin_code}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    name="rack"
                    label="Rack"
                    value={binForm.rack}
                    onChange={handleBinChange}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    name="row"
                    label="Row"
                    type="number"
                    value={binForm.row}
                    onChange={handleBinChange}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    name="col"
                    label="Column"
                    type="number"
                    value={binForm.col}
                    onChange={handleBinChange}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    name="capacity"
                    label="Capacity"
                    type="number"
                    value={binForm.capacity}
                    onChange={handleBinChange}
                    error={!!fieldErrors.capacity}
                    helperText={fieldErrors.capacity}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                {editingBinIndex !== null && (
                  <Button onClick={resetBinForm} sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                )}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addBin}
                  sx={{ bgcolor: COLORS.primary }}
                >
                  {editingBinIndex !== null ? 'Update Bin' : 'Add Bin'}
                </Button>
              </Box>
            </Paper>
            
            {/* Bins List */}
            {formData.bins.length > 0 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
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
                            <Typography variant="body2" fontWeight={600}>
                              {bin.bin_code}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {bin.bin_id}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            {bin.rack && <Chip label={`Rack: ${bin.rack}`} size="small" />}
                            {bin.row && <Chip label={`Row: ${bin.row}`} size="small" />}
                            {bin.col && <Chip label={`Col: ${bin.col}`} size="small" />}
                            <Chip 
                              label={`Cap: ${bin.capacity.toLocaleString()}`} 
                              size="small" 
                              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                            />
                          </Stack>
                        </Stack>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => editBin(index)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton size="small" onClick={() => removeBin(index)}>
                              <DeleteIcon fontSize="small" sx={{ color: '#EF4444' }} />
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
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <UpdateIcon />}
          sx={{ bgcolor: COLORS.primary }}
        >
          {loading ? 'Updating...' : 'Update Warehouse'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWareHouse;