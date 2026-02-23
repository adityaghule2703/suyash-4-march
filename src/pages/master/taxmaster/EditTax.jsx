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
  FormControlLabel,
  Checkbox,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const EditTax = ({ open, onClose, tax, onUpdate }) => {
  const [formData, setFormData] = useState({
    HSNCode: '',
    GSTPercentage: '',
    GSTType: 'CGST/SGST',
    Description: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tax) {
      setFormData({
        HSNCode: tax.HSNCode || '',
        GSTPercentage: tax.GSTPercentage?.toString() || '',
        GSTType: tax.GSTType || 'CGST/SGST',
        Description: tax.Description || '',
        IsActive: tax.IsActive !== undefined ? tax.IsActive : true
      });
    }
  }, [tax]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.HSNCode.trim()) {
      setError('HSN Code is required');
      return;
    }

    if (!formData.GSTPercentage) {
      setError('GST Percentage is required');
      return;
    }

    const gstPercentage = parseFloat(formData.GSTPercentage);
    if (isNaN(gstPercentage) || gstPercentage < 0 || gstPercentage > 100) {
      setError('GST Percentage must be a number between 0 and 100');
      return;
    }

    if (!formData.GSTType) {
      setError('GST Type is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/taxes/${tax._id}`, {
        ...formData,
        GSTPercentage: gstPercentage
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
        setError(response.data.message || 'Failed to update tax');
      }
    } catch (err) {
      console.error('Error updating tax:', err);
      setError(err.response?.data?.message || 'Failed to update tax. Please try again.');
    } finally {
      setLoading(false);
    }
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
          Edit Tax
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* First Row - HSN Code and GST Percentage */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="HSN Code *"
              name="HSNCode"
              value={formData.HSNCode}
              onChange={handleChange}
              required
              disabled={loading}
              error={!!error && error.includes('HSN Code')}
              placeholder="Enter HSN code"
            />

            <TextField
              fullWidth
              label="GST Percentage *"
              name="GSTPercentage"
              value={formData.GSTPercentage}
              onChange={handleChange}
              required
              disabled={loading}
              type="number"
              error={!!error && error.includes('GST Percentage')}
              InputProps={{
                inputProps: {
                  step: "0.01",
                  min: "0",
                  max: "100"
                },
                endAdornment: <Typography>%</Typography>
              }}
            />
          </Stack>

          {/* Second Row - GST Type */}
          <FormControl fullWidth>
            <InputLabel>GST Type *</InputLabel>
            <Select
              name="GSTType"
              value={formData.GSTType}
              onChange={handleChange}
              label="GST Type *"
              required
              disabled={loading}
            >
              <MenuItem value="CGST/SGST">CGST/SGST</MenuItem>
              <MenuItem value="IGST">IGST</MenuItem>
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
            placeholder="Enter tax description..."
          />

          {/* Status */}
          {/* <FormControlLabel
            control={
              <Checkbox
                name="IsActive"
                checked={formData.IsActive}
                onChange={handleChange}
                color="primary"
                disabled={loading}
              />
            }
            label="Active Tax"
          /> */}
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
          {loading ? 'Updating...' : 'Update Tax'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTax;