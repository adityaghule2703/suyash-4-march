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
    process_id: '',
    process_name: '',
    category: 'Core',
    rate_type: 'Per Hour',
    description: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Category options based on enum in backend
  const categoryOptions = ['Core', 'Finishing', 'Packing', 'Other'];
  
  // Rate type options based on enum in backend
  const rateTypeOptions = ['Per Kg', 'Per Nos', 'Per Hour', 'Fixed'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.process_id.trim()) {
      setError('Process ID is required');
      return;
    }

    if (!formData.process_name.trim()) {
      setError('Process Name is required');
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      return;
    }

    if (!formData.rate_type) {
      setError('Rate Type is required');
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
      process_id: '',
      process_name: '',
      category: 'Core',
      rate_type: 'Per Hour',
      description: '',
      is_active: true
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
          {/* Process ID */}
          <TextField
            fullWidth
            label="Process ID *"
            name="process_id"
            value={formData.process_id}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., PROC-ML-002"
            helperText="Unique identifier for the process"
          />

          {/* Process Name */}
          <TextField
            fullWidth
            label="Process Name *"
            name="process_name"
            value={formData.process_name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., Injection Molding"
          />

          {/* Category Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Category *</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category *"
              required
              disabled={loading}
            >
              {categoryOptions.map((option) => (
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
              name="rate_type"
              value={formData.rate_type}
              onChange={handleChange}
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

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={loading}
            placeholder="Describe the process, equipment used, special requirements, etc."
          />

          {/* Process Information Preview */}
          {(formData.process_id || formData.process_name) && (
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
                  <Typography variant="body2" color="textSecondary">Process ID:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.process_id || 'Not specified'}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Process Name:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.process_name || 'Not specified'}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Category:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.category}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Rate Type:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.rate_type}
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