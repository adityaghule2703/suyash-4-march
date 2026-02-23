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
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddCosting = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    PartNo: '',
    RMRate: '',
    ProcessCost: '',
    FinishingCost: '',
    PackingCost: '',
    OverheadPercentage: '',
    MarginPercentage: '',
    IsActive: true
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [error, setError] = useState('');

  // Fetch items for Part No dropdown
  useEffect(() => {
    const fetchItems = async () => {
      if (!open) return;
      
      setFetchingItems(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/items`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setItems(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again.');
      } finally {
        setFetchingItems(false);
      }
    };

    fetchItems();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate costing based on inputs
  const calculateCosting = () => {
    const {
      RMRate,
      ProcessCost,
      FinishingCost,
      PackingCost,
      OverheadPercentage,
      MarginPercentage
    } = formData;

    const rmRate = parseFloat(RMRate) || 0;
    const processCost = parseFloat(ProcessCost) || 0;
    const finishingCost = parseFloat(FinishingCost) || 0;
    const packingCost = parseFloat(PackingCost) || 0;
    const overheadPercentage = parseFloat(OverheadPercentage) || 0;
    const marginPercentage = parseFloat(MarginPercentage) || 0;

    const subCost = rmRate + processCost + finishingCost + packingCost;
    const overheadCost = (subCost * overheadPercentage) / 100;
    const totalCostBeforeMargin = subCost + overheadCost;
    const marginCost = (totalCostBeforeMargin * marginPercentage) / 100;
    const finalRate = totalCostBeforeMargin + marginCost;

    return {
      SubCost: subCost,
      OverheadCost: overheadCost,
      MarginCost: marginCost,
      FinalRate: finalRate
    };
  };

  const handleSubmit = async () => {
    if (!formData.PartNo) {
      setError('Part No is required');
      return;
    }
    if (!formData.RMRate || parseFloat(formData.RMRate) < 0) {
      setError('RM Rate must be 0 or greater');
      return;
    }
    if (!formData.ProcessCost || parseFloat(formData.ProcessCost) < 0) {
      setError('Process Cost must be 0 or greater');
      return;
    }
    if (!formData.FinishingCost || parseFloat(formData.FinishingCost) < 0) {
      setError('Finishing Cost must be 0 or greater');
      return;
    }
    if (!formData.PackingCost || parseFloat(formData.PackingCost) < 0) {
      setError('Packing Cost must be 0 or greater');
      return;
    }
    if (!formData.OverheadPercentage || parseFloat(formData.OverheadPercentage) < 0) {
      setError('Overhead Percentage must be 0 or greater');
      return;
    }
    if (!formData.MarginPercentage || parseFloat(formData.MarginPercentage) < 0) {
      setError('Margin Percentage must be 0 or greater');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/costings`, {
        ...formData,
        RMRate: parseFloat(formData.RMRate),
        ProcessCost: parseFloat(formData.ProcessCost),
        FinishingCost: parseFloat(formData.FinishingCost),
        PackingCost: parseFloat(formData.PackingCost),
        OverheadPercentage: parseFloat(formData.OverheadPercentage),
        MarginPercentage: parseFloat(formData.MarginPercentage)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add costing');
      }
    } catch (err) {
      console.error('Error adding costing:', err);
      setError(err.response?.data?.message || 'Failed to add costing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      PartNo: '',
      RMRate: '',
      ProcessCost: '',
      FinishingCost: '',
      PackingCost: '',
      OverheadPercentage: '',
      MarginPercentage: '',
      IsActive: true
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const calculations = calculateCosting();
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 600,
          paddingTop: '8px'
        }}>
          Add New Costing
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Part No Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Part No *</InputLabel>
            <Select
              name="PartNo"
              value={formData.PartNo}
              onChange={handleSelectChange}
              label="Part No *"
              required
              disabled={fetchingItems || loading}
            >
              <MenuItem value="">
                <em>Select a Part No</em>
              </MenuItem>
              {items.map((item) => (
                <MenuItem key={item._id} value={item.PartNo}>
                  <Box>
                    <Typography variant="body1">{item.PartNo}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.PartName}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Cost Components */}
          <Typography variant="subtitle1" fontWeight={600} color="#101010">
            Cost Components
          </Typography>
          
          {/* RM Rate and Process Cost */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="RM Rate *"
              name="RMRate"
              type="number"
              value={formData.RMRate}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
            <TextField
              fullWidth
              label="Process Cost *"
              name="ProcessCost"
              type="number"
              value={formData.ProcessCost}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Stack>

          {/* Finishing Cost and Packing Cost */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Finishing Cost *"
              name="FinishingCost"
              type="number"
              value={formData.FinishingCost}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
            <TextField
              fullWidth
              label="Packing Cost *"
              name="PackingCost"
              type="number"
              value={formData.PackingCost}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Stack>

          {/* Percentages */}
          <Typography variant="subtitle1" fontWeight={600} color="#101010">
            Percentages
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Overhead Percentage *"
              name="OverheadPercentage"
              type="number"
              value={formData.OverheadPercentage}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{
                endAdornment: <Typography>%</Typography>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
            <TextField
              fullWidth
              label="Margin Percentage *"
              name="MarginPercentage"
              type="number"
              value={formData.MarginPercentage}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{
                endAdornment: <Typography>%</Typography>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Stack>

          {/* Calculation Preview */}
          {(formData.RMRate || formData.ProcessCost || formData.FinishingCost || formData.PackingCost) && (
            <Box sx={{ 
              p: 2.5, 
              bgcolor: '#E8F5E9', 
              borderRadius: 1,
              border: '1px solid #C8E6C9'
            }}>
              <Typography variant="subtitle2" fontWeight={600} color="#2E7D32" gutterBottom>
                Cost Calculation Preview
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Sub Total:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(calculations.SubCost)}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Overhead ({formData.OverheadPercentage || 0}%):
                  </Typography>
                  <Typography variant="body2" fontWeight={500} color="warning.main">
                    + {formatCurrency(calculations.OverheadCost)}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Margin ({formData.MarginPercentage || 0}%):
                  </Typography>
                  <Typography variant="body2" fontWeight={500} color="warning.main">
                    + {formatCurrency(calculations.MarginCost)}
                  </Typography>
                </Stack>
                
                <Box sx={{ borderTop: '1px dashed #BDBDBD', pt: 1, mt: 1 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" fontWeight={600}>
                      Final Rate:
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="success.main">
                      {formatCurrency(calculations.FinalRate)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || fetchingItems}
          startIcon={!loading && <AddIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' }
          }}
        >
          {loading ? 'Adding...' : 'Add Costing'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCosting;