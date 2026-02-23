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
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddMaterial = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    MaterialCode: '',
    MaterialName: '',
    Description: '',
    Density: '',
    Unit: 'g/cm³',
    Standard: '',
    Grade: '',
    Color: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Enum values for Unit field
  const unitOptions = ['g/cm³', 'kg/m³'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const response = await axios.post(`${BASE_URL}/api/materials`, {
        ...formData,
        Density: formData.Density ? parseFloat(formData.Density) : null
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
        setError(response.data.message || 'Failed to add material');
      }
    } catch (err) {
      console.error('Error adding material:', err);
      setError(err.response?.data?.message || 'Failed to add material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      MaterialCode: '',
      MaterialName: '',
      Description: '',
      Density: '',
      Unit: 'g/cm³',
      Standard: '',
      Grade: '',
      Color: '',
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
          Add New Material
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

            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select
                name="Unit"
                value={formData.Unit}
                onChange={handleSelectChange}
                label="Unit"
                disabled={loading}
              >
                {unitOptions.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          {loading ? 'Adding...' : 'Add Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMaterial;