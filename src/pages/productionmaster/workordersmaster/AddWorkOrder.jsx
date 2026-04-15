// AddWorkOrder.jsx (Updated)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Typography, Box, Stack, Grid,
  Autocomplete, CircularProgress, Chip, FormControl, InputLabel,
  Select, MenuItem, Paper
} from '@mui/material';
import { Add as AddIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];
const WO_TYPE_OPTIONS = ['Machining', 'Assembly', 'SubAssembly', 'Kit'];

const AddWorkOrder = ({ open, onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Data fetching states
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedSO, setSelectedSO] = useState(null);
  const [selectedSOItem, setSelectedSOItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [boms, setBoms] = useState([]);
  const [routings, setRoutings] = useState([]);
  const [mrpRuns, setMrpRuns] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingSO, setLoadingSO] = useState(false);
  const [loadingBOM, setLoadingBOM] = useState(false);
  const [loadingRouting, setLoadingRouting] = useState(false);
  const [loadingMRP, setLoadingMRP] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    so_id: '',
    so_item_id: '',
    item_id: '',
    bom_id: '',
    routing_id: '',
    planned_qty: '',
    planned_start: '',
    planned_end: '',
    required_by: '',
    priority: 'Medium',
    wo_type: 'Machining',
    assembly_line: '',
    serial_tracking: false,
    mrp_run_id: ''
  });

  // Fetch Sales Orders
  const fetchSalesOrders = useCallback(async () => {
    try {
      setLoadingSO(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/sales-orders?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSalesOrders(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching sales orders:', err);
    } finally {
      setLoadingSO(false);
    }
  }, []);

  // Fetch BOMs
  const fetchBOMs = useCallback(async () => {
    try {
      setLoadingBOM(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/boms?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBoms(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching BOMs:', err);
    } finally {
      setLoadingBOM(false);
    }
  }, []);

  // Fetch Routings
  const fetchRoutings = useCallback(async () => {
    try {
      setLoadingRouting(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/routings?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRoutings(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching routings:', err);
    } finally {
      setLoadingRouting(false);
    }
  }, []);

  // Fetch MRP Runs
  const fetchMrpRuns = useCallback(async () => {
    try {
      setLoadingMRP(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/mrp/runs?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMrpRuns(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching MRP runs:', err);
    } finally {
      setLoadingMRP(false);
    }
  }, []);

  // Fetch Items
  const fetchItems = useCallback(async () => {
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchSalesOrders();
      fetchBOMs();
      fetchRoutings();
      fetchMrpRuns();
      fetchItems();
    }
  }, [open, fetchSalesOrders, fetchBOMs, fetchRoutings, fetchMrpRuns, fetchItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSOChange = (event, newValue) => {
    setSelectedSO(newValue);
    setFormData(prev => ({
      ...prev,
      so_id: newValue?._id || '',
      so_item_id: ''
    }));
    setSelectedSOItem(null);
    setFieldErrors(prev => ({ ...prev, so_id: '' }));
  };

  const handleSOItemChange = (event, newValue) => {
    setSelectedSOItem(newValue);
    setFormData(prev => ({
      ...prev,
      so_item_id: newValue?._id || ''
    }));
    setFieldErrors(prev => ({ ...prev, so_item_id: '' }));
  };

  const handleItemChange = (event, newValue) => {
    setSelectedItem(newValue);
    setFormData(prev => ({
      ...prev,
      item_id: newValue?._id || ''
    }));
    setFieldErrors(prev => ({ ...prev, item_id: '' }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.so_id) {
      errors.so_id = 'Sales Order is required';
      isValid = false;
    }
    
    // SO Item is required only if the selected SO has multiple items
    const hasMultipleItems = selectedSO && selectedSO.items && selectedSO.items.length > 1;
    if (hasMultipleItems && !formData.so_item_id) {
      errors.so_item_id = 'Please select an SO item';
      isValid = false;
    }
    
    if (!formData.item_id) {
      errors.item_id = 'Item is required';
      isValid = false;
    }
    if (!formData.bom_id) {
      errors.bom_id = 'BOM is required';
      isValid = false;
    }
    if (!formData.routing_id) {
      errors.routing_id = 'Routing is required';
      isValid = false;
    }
    if (!formData.planned_qty || formData.planned_qty <= 0) {
      errors.planned_qty = 'Valid planned quantity is required';
      isValid = false;
    }
    if (!formData.planned_start) {
      errors.planned_start = 'Planned start date is required';
      isValid = false;
    }
    if (!formData.planned_end) {
      errors.planned_end = 'Planned end date is required';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in the form');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const submitData = {
        so_id: formData.so_id,
        so_item_id: formData.so_item_id || undefined,
        item_id: formData.item_id,
        bom_id: formData.bom_id,
        routing_id: formData.routing_id,
        planned_qty: Number(formData.planned_qty),
        planned_start: formData.planned_start,
        planned_end: formData.planned_end,
        required_by: formData.required_by || formData.planned_end,
        priority: formData.priority,
        wo_type: formData.wo_type,
        assembly_line: formData.assembly_line || undefined,
        serial_tracking: formData.serial_tracking,
        mrp_run_id: formData.mrp_run_id || undefined
      };

      const response = await axios.post(`${BASE_URL}/api/work-orders`, submitData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create work order');
      }
    } catch (err) {
      console.error('Error creating work order:', err);
      setError(err.response?.data?.message || 'Failed to create work order');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      so_id: '',
      so_item_id: '',
      item_id: '',
      bom_id: '',
      routing_id: '',
      planned_qty: '',
      planned_start: '',
      planned_end: '',
      required_by: '',
      priority: 'Medium',
      wo_type: 'Machining',
      assembly_line: '',
      serial_tracking: false,
      mrp_run_id: ''
    });
    setSelectedSO(null);
    setSelectedSOItem(null);
    setSelectedItem(null);
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get available items for selected SO
  const availableSOItems = selectedSO?.items || [];
  const hasMultipleSOItems = availableSOItems.length > 1;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          Add New Work Order
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Sales Order Selection */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Sales Order Details
            </Typography>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    SALES ORDER <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={salesOrders}
                    getOptionLabel={(option) => `${option.so_number} - ${option.customer_name}`}
                    value={selectedSO}
                    onChange={handleSOChange}
                    loading={loadingSO}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select sales order"
                        error={!!fieldErrors.so_id}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary }
                          }
                        }}
                      />
                    )}
                  />
                  {fieldErrors.so_id && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.so_id}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* SO Item - Only show if selected SO has multiple items */}
              {hasMultipleSOItems && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      SO ITEM <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={availableSOItems}
                      getOptionLabel={(option) => `${option.part_no} - ${option.part_name} (Qty: ${option.ordered_qty})`}
                      value={selectedSOItem}
                      onChange={handleSOItemChange}
                      disabled={!selectedSO}
                      loading={loadingSO}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder={selectedSO ? "Select SO item" : "Select sales order first"}
                          error={!!fieldErrors.so_item_id}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary }
                            }
                          }}
                        />
                      )}
                    />
                    {fieldErrors.so_item_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.so_item_id}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}

              {/* Show info when SO has single item */}
              {selectedSO && !hasMultipleSOItems && availableSOItems.length === 1 && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ 
                    p: 1, 
                    bgcolor: COLORS.primaryLight, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.primary}20`
                  }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      SO Item (Auto-selected):
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {availableSOItems[0]?.part_no} - {availableSOItems[0]?.part_name}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Item Master Selection */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Item Details
            </Typography>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    ITEM <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={items}
                    getOptionLabel={(option) => `${option.part_no} - ${option.part_description || option.part_name} (${option.item_category || 'N/A'})`}
                    value={selectedItem}
                    onChange={handleItemChange}
                    loading={loadingItems}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select item"
                        error={!!fieldErrors.item_id}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary }
                          }
                        }}
                      />
                    )}
                  />
                  {fieldErrors.item_id && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.item_id}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* BOM & Routing */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Production Specifications
            </Typography>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    BOM <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={boms}
                    getOptionLabel={(option) => `${option.bom_id} - ${option.parent_part_no} (v${option.bom_version})`}
                    value={boms.find(b => b._id === formData.bom_id) || null}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({ ...prev, bom_id: newValue?._id || '' }));
                      setFieldErrors(prev => ({ ...prev, bom_id: '' }));
                    }}
                    loading={loadingBOM}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select BOM"
                        error={!!fieldErrors.bom_id}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary }
                          }
                        }}
                      />
                    )}
                  />
                  {fieldErrors.bom_id && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.bom_id}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    ROUTING <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={routings}
                    getOptionLabel={(option) => `${option.routing_id} - ${option.routing_name}`}
                    value={routings.find(r => r._id === formData.routing_id) || null}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({ ...prev, routing_id: newValue?._id || '' }));
                      setFieldErrors(prev => ({ ...prev, routing_id: '' }));
                    }}
                    loading={loadingRouting}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select routing"
                        error={!!fieldErrors.routing_id}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary }
                          }
                        }}
                      />
                    )}
                  />
                  {fieldErrors.routing_id && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.routing_id}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Quantity & Dates */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Planning Details
            </Typography>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    PLANNED QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    name="planned_qty"
                    value={formData.planned_qty}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    error={!!fieldErrors.planned_qty}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      }
                    }}
                  />
                  {fieldErrors.planned_qty && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.planned_qty}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    WORK ORDER TYPE
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="wo_type"
                      value={formData.wo_type}
                      onChange={handleChange}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      {WO_TYPE_OPTIONS.map(option => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    PLANNED START <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    name="planned_start"
                    value={formData.planned_start}
                    onChange={handleChange}
                    error={!!fieldErrors.planned_start}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.planned_start && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.planned_start}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    PLANNED END <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    name="planned_end"
                    value={formData.planned_end}
                    onChange={handleChange}
                    error={!!fieldErrors.planned_end}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.planned_end && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.planned_end}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    REQUIRED BY
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    name="required_by"
                    value={formData.required_by}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Settings */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Additional Settings
            </Typography>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    PRIORITY
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      {PRIORITY_OPTIONS.map(option => (
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
                    ASSEMBLY LINE
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="assembly_line"
                    value={formData.assembly_line}
                    onChange={handleChange}
                    placeholder="e.g., Line A"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    MRP RUN ID
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={mrpRuns}
                    getOptionLabel={(option) => `${option.mrp_run_id} - ${option.run_type} (${new Date(option.run_date).toLocaleDateString()})`}
                    value={mrpRuns.find(m => m._id === formData.mrp_run_id) || null}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({ ...prev, mrp_run_id: newValue?._id || '' }));
                    }}
                    loading={loadingMRP}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select MRP run (optional)"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary }
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
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
          onClick={handleClose}
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
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Creating...' : 'Create Work Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkOrder;