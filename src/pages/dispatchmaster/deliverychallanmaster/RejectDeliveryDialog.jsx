// src/pages/DeliveryChallan/components/Modals/RejectDeliveryDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Grid,
  Alert,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
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
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF'
};

const RejectDeliveryDialog = ({ open, onClose, deliveryChallan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    rejection_reason: '',
    rejection_details: '',
    items_returned: []
  });
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnQty, setReturnQty] = useState('');
  const [condition, setCondition] = useState('Good');

  const itemsList = deliveryChallan?.items || [];

  const handleAddItem = () => {
    const errors = {};
    let isValid = true;

    if (!selectedItem) {
      errors.selectItem = 'Please select an item';
      isValid = false;
    }
    if (!returnQty || parseFloat(returnQty) <= 0) {
      errors.returnQty = 'Please enter valid return quantity';
      isValid = false;
    }
    if (selectedItem && returnQty && parseFloat(returnQty) > selectedItem.dispatch_qty) {
      errors.returnQty = `Return quantity cannot exceed dispatched quantity (${selectedItem.dispatch_qty})`;
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) return;

    const newItem = {
      so_item_id: selectedItem.so_item_id,
      part_no: selectedItem.part_no,
      return_qty: parseFloat(returnQty),
      unit_price: selectedItem.unit_price,
      condition: condition
    };

    setFormData(prev => ({
      ...prev,
      items_returned: [...prev.items_returned, newItem]
    }));

    setSelectedItem(null);
    setReturnQty('');
    setCondition('Good');
    setFieldErrors({});
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items_returned: prev.items_returned.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.rejection_reason.trim()) {
      errors.rejection_reason = 'Rejection reason is required';
      isValid = false;
    }
    if (formData.items_returned.length === 0) {
      errors.items_returned = 'Please add at least one returned item';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in the form');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/delivery-challans/${deliveryChallan._id}/customer-rejection`,
        {
          rejection_reason: formData.rejection_reason,
          rejection_details: formData.rejection_details,
          items_returned: formData.items_returned
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to submit rejection');
      }
    } catch (err) {
      console.error('Error submitting rejection:', err);
      setError(err.response?.data?.message || 'Failed to submit rejection. Please try again.');
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
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        mb: 2,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Customer Rejection
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          For DC: {deliveryChallan?.dc_number}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Rejection Reason <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="rejection_reason"
                    value={formData.rejection_reason}
                    onChange={handleChange}
                    error={!!fieldErrors.rejection_reason}
                    placeholder="e.g., Quality Rejection, Quantity Mismatch, etc."
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
                  {fieldErrors.rejection_reason && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.rejection_reason}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Rejection Details
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="rejection_details"
                    multiline
                    rows={2}
                    value={formData.rejection_details}
                    onChange={handleChange}
                    placeholder="e.g., Surface scratches on 15 pieces exceeding acceptable limit"
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

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                  Return Items <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                {/* Add Item Section */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, mb: 2 }}>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Select Item
                        </Typography>
                        <FormControl fullWidth size="small" error={!!fieldErrors.selectItem}>
                          <Select
                            value={selectedItem?.so_item_id || ''}
                            onChange={(e) => {
                              const item = itemsList.find(i => i.so_item_id === e.target.value);
                              setSelectedItem(item);
                              setFieldErrors(prev => ({ ...prev, selectItem: '' }));
                            }}
                            displayEmpty
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: COLORS.background.white,
                              '& .MuiSelect-select': { py: 1, px: 1.5 }
                            }}
                          >
                            <MenuItem value="" disabled>Select an item</MenuItem>
                            {itemsList.map((item) => (
                              <MenuItem key={item.so_item_id} value={item.so_item_id} sx={{ fontSize: '0.75rem' }}>
                                {item.part_no} - {item.part_name} (Qty: {item.dispatch_qty})
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.selectItem && (
                            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                              {fieldErrors.selectItem}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Return Qty
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={returnQty}
                          onChange={(e) => {
                            setReturnQty(e.target.value);
                            setFieldErrors(prev => ({ ...prev, returnQty: '' }));
                          }}
                          error={!!fieldErrors.returnQty}
                          placeholder="0"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: COLORS.background.white,
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
                        {fieldErrors.returnQty && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors.returnQty}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Condition
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: COLORS.background.white,
                              '& .MuiSelect-select': { py: 1, px: 1.5 }
                            }}
                          >
                            <MenuItem value="Good" sx={{ fontSize: '0.75rem' }}>Good</MenuItem>
                            <MenuItem value="Damaged" sx={{ fontSize: '0.75rem' }}>Damaged</MenuItem>
                            <MenuItem value="Defective" sx={{ fontSize: '0.75rem' }}>Defective</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleAddItem}
                        startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                        sx={{
                          height: 40,
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          borderColor: COLORS.primary,
                          color: COLORS.primary,
                          '&:hover': {
                            bgcolor: `${COLORS.primary}10`,
                            borderColor: COLORS.primaryDark
                          }
                        }}
                      >
                        Add Item
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Items List Table */}
                {formData.items_returned.length > 0 && (
                  <Paper sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Part No</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Return Qty</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Unit Price</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Condition</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light, width: 50 }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.items_returned.map((item, idx) => (
                            <TableRow key={idx} hover>
                              <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{item.part_no}</TableCell>
                              <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{item.return_qty}</TableCell>
                              <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>₹{item.unit_price.toLocaleString()}</TableCell>
                              <TableCell>
                                <Chip
                                  label={item.condition}
                                  size="small"
                                  sx={{
                                    fontSize: '0.65rem',
                                    fontWeight: 500,
                                    height: 24,
                                    bgcolor: item.condition === 'Good' ? '#D1FAE5' : item.condition === 'Damaged' ? '#FEF3C7' : '#FEE2E2',
                                    color: item.condition === 'Good' ? '#065F46' : item.condition === 'Damaged' ? '#B45309' : '#991B1B'
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveItem(idx)}
                                  sx={{ color: '#EF4444' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}
                {fieldErrors.items_returned && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
                    {fieldErrors.items_returned}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: '#EF4444',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: '#DC2626' }
          }}
        >
          {loading ? 'Submitting...' : 'Submit Rejection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectDeliveryDialog;