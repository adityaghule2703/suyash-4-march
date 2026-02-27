import React, { useState } from 'react';
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

const AddProcess = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    ProcessName: '',
    ProcessType: 'Main',
    RateType: 'Per Hour',
    VendorOrInhouse: 'Vendor',
    Description: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Process type options
  const processTypeOptions = ['Main', 'Finishing'];
  
  // Rate type options
  const rateTypeOptions = ['Per Nos', 'Per Kg', 'Per Hour', 'Fixed'];
  
  // Vendor/Inhouse options
  const vendorInhouseOptions = ['Vendor', 'Inhouse'];

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

    if (!formData.ProcessType) {
      setError('Process Type is required');
      return;
    }

    if (!formData.RateType) {
      setError('Rate Type is required');
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
      const response = await axios.post(`${BASE_URL}/api/processes`, formData, {
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
        setError(response.data.message || 'Failed to add process');
      }
    } catch (err) {
      console.error('Error adding process:', err);
      setError(err.response?.data?.message || 'Failed to add process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ProcessName: '',
      ProcessType: 'Main',
      RateType: 'Per Hour',
      VendorOrInhouse: 'Vendor',
      Description: '',
      IsActive: true
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          Add New Process
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

          {/* Process Type Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Process Type *</InputLabel>
            <Select
              name="ProcessType"
              value={formData.ProcessType}
              onChange={handleSelectChange}
              label="Process Type *"
              required
              disabled={loading}
            >
              {processTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Rate Type */}
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

          {/* Process Information Preview */}
          {formData.ProcessName && (
            <Box sx={{ 
              p: 2.5, 
              bgcolor: '#E8F5E9', 
              borderRadius: 1,
              border: '1px solid #C8E6C9'
            }}>
              <Typography variant="subtitle2" fontWeight={600} color="#2E7D32" gutterBottom>
                Process Information
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Process Name:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.ProcessName}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Process Type:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.ProcessType}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Rate Type:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.RateType}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Vendor/Inhouse:</Typography>
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
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={!loading && <AddIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' }
          }}
        >
          {loading ? 'Adding...' : 'Add Process'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProcess;