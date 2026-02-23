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
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const EditProcess = ({ open, onClose, process, onUpdate }) => {
  const [formData, setFormData] = useState({
    ProcessName: '',
    RateType: 'Per Hour',
    Rate: '',
    VendorOrInhouse: 'Vendor',
    Description: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rate type options
  const rateTypeOptions = ['Per Nos', 'Per Kg', 'Per Hour', 'Fixed'];
  
  // Vendor/Inhouse options
  const vendorInhouseOptions = ['Vendor', 'Inhouse'];

  useEffect(() => {
    if (process) {
      setFormData({
        ProcessName: process.ProcessName || '',
        RateType: process.RateType || 'Per Hour',
        Rate: process.Rate || '',
        VendorOrInhouse: process.VendorOrInhouse || 'Vendor',
        Description: process.Description || '',
        IsActive: process.IsActive !== undefined ? process.IsActive : true
      });
    }
  }, [process]);

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

  const handleSubmit = async () => {
    // Validation
    if (!formData.ProcessName.trim()) {
      setError('Process Name is required');
      return;
    }

    if (!formData.RateType) {
      setError('Rate Type is required');
      return;
    }

    if (!formData.Rate || parseFloat(formData.Rate) <= 0) {
      setError('Rate must be greater than 0');
      return;
    }

    if (!formData.VendorOrInhouse) {
      setError('Vendor/Inhouse selection is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/processes/${process._id}`, {
        ...formData,
        Rate: parseFloat(formData.Rate)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update process');
      }
    } catch (err) {
      console.error('Error updating process:', err);
      setError(err.response?.data?.message || 'Failed to update process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      onClose={onClose}
      maxWidth="sm"
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
          Edit Process
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Process Name */}
          <TextField
            fullWidth
            label="Process Name *"
            name="ProcessName"
            value={formData.ProcessName}
            onChange={handleChange}
            required
            disabled={loading}
          />

          {/* Rate Type and Rate - Two fields in one row */}
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Rate Type *</InputLabel>
              <Select
                name="RateType"
                value={formData.RateType}
                onChange={handleSelectChange}
                label="Rate Type *"
                required
                disabled={loading}
              >
                {rateTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={`Rate (${formData.RateType}) *`}
              name="Rate"
              type="number"
              value={formData.Rate}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                inputProps: {
                  step: "0.01",
                  min: "0"
                }
              }}
            />
          </Stack>

          {/* Vendor/Inhouse Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Vendor/Inhouse *</InputLabel>
            <Select
              name="VendorOrInhouse"
              value={formData.VendorOrInhouse}
              onChange={handleSelectChange}
              label="Vendor/Inhouse *"
              required
              disabled={loading}
            >
              {vendorInhouseOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={loading}
            placeholder="Describe the process, equipment used, special requirements, etc."
          />

          {/* Rate Preview */}
          {formData.Rate && (
            <Box sx={{ 
              p: 2.5, 
              bgcolor: '#E8F5E9', 
              borderRadius: 1,
              border: '1px solid #C8E6C9'
            }}>
              <Typography variant="subtitle2" fontWeight={600} color="#2E7D32" gutterBottom>
                Rate Information
              </Typography>
              <Stack spacing={1}>
                {process && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">Current Rate:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(process.Rate)} / {process.RateType.toLowerCase().replace('per ', '')}
                    </Typography>
                  </Stack>
                )}
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">New Rate Type:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.RateType}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">New Rate:</Typography>
                  <Typography variant="body1" fontWeight={700} color="success.main">
                    {formatCurrency(formData.Rate)} / {formData.RateType.toLowerCase().replace('per ', '')}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Type:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.VendorOrInhouse === 'Vendor' ? 'External Vendor' : 'In-house'}
                  </Typography>
                </Stack>
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
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={!loading && <EditIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' }
          }}
        >
          {loading ? 'Updating...' : 'Update Process'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProcess;