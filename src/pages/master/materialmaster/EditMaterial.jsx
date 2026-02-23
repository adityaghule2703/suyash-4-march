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
  Box
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const EditMaterial = ({ open, onClose, material, onUpdate }) => {
  const [formData, setFormData] = useState({
    MaterialCode: '',
    MaterialName: '',
    Description: '',
    Density: '',
    Unit: '',
    Standard: '',
    Grade: '',
    Color: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (material) {
      setFormData({
        MaterialCode: material.MaterialCode || '',
        MaterialName: material.MaterialName || '',
        Description: material.Description || '',
        Density: material.Density?.toString() || '',
        Unit: material.Unit || '',
        Standard: material.Standard || '',
        Grade: material.Grade || '',
        Color: material.Color || '',
        IsActive: material.IsActive !== undefined ? material.IsActive : true
      });
    }
  }, [material]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.MaterialCode.trim()) {
      setError('Material code is required');
      return;
    }

    if (!formData.MaterialName.trim()) {
      setError('Material name is required');
      return;
    }

    if (formData.Density && isNaN(parseFloat(formData.Density))) {
      setError('Density must be a valid number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/materials/${material._id}`, {
        ...formData,
        Density: formData.Density ? parseFloat(formData.Density) : null
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
        setError(response.data.message || 'Failed to update material');
      }
    } catch (err) {
      console.error('Error updating material:', err);
      setError(err.response?.data?.message || 'Failed to update material. Please try again.');
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
          Edit Material
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* First Row - Material Code and Material Name */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Material Code *"
              name="MaterialCode"
              value={formData.MaterialCode}
              onChange={handleChange}
              required
              disabled={loading}
              error={!!error && error.includes('Material code')}
            />

            <TextField
              fullWidth
              label="Material Name *"
              name="MaterialName"
              value={formData.MaterialName}
              onChange={handleChange}
              required
              disabled={loading}
              error={!!error && error.includes('Material name')}
            />
          </Stack>

          {/* Description - Full Width */}
          <TextField
            fullWidth
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={loading}
          />

          {/* Second Row - Density and Unit */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Density"
              name="Density"
              value={formData.Density}
              onChange={handleChange}
              type="number"
              disabled={loading}
              error={!!error && error.includes('Density')}
              InputProps={{
                inputProps: {
                  step: "0.01",
                  min: "0"
                }
              }}
            />

            <TextField
              fullWidth
              label="Unit"
              name="Unit"
              value={formData.Unit}
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>

          {/* Third Row - Standard and Grade */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Standard"
              name="Standard"
              value={formData.Standard}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Grade"
              name="Grade"
              value={formData.Grade}
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>

          {/* Color - Full Width */}
          <TextField
            fullWidth
            label="Color"
            name="Color"
            value={formData.Color}
            onChange={handleChange}
            disabled={loading}
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
            label="Active Material"
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
          {loading ? 'Updating...' : 'Update Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMaterial;