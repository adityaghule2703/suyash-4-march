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
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const EditItem = ({ open, onClose, item, onUpdate, materials }) => {
  const [formData, setFormData] = useState({
    PartNo: '',
    PartName: '',
    Description: '',
    DrawingNo: '',
    RevisionNo: '',
    Unit: '',
    HSNCode: '',
    MaterialID: '',
    NetWgt: '', // Added NetWgt field
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Enum values for Unit field
  const unitOptions = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

  useEffect(() => {
    if (item) {
      setFormData({
        PartNo: item.PartNo || '',
        PartName: item.PartName || '',
        Description: item.Description || '',
        DrawingNo: item.DrawingNo || '',
        RevisionNo: item.RevisionNo || '',
        Unit: item.Unit || '',
        HSNCode: item.HSNCode || '',
        MaterialID: item.MaterialID?._id || '',
        NetWgt: item.NetWgt !== undefined && item.NetWgt !== null ? item.NetWgt.toString() : '', // Handle NetWgt
        IsActive: item.IsActive !== undefined ? item.IsActive : true
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for NetWgt to ensure it's a valid number
    if (name === 'NetWgt') {
      // Allow empty string or valid number format
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
    if (!formData.PartNo.trim()) {
      setError('Part number is required');
      return;
    }

    if (!formData.PartName.trim()) {
      setError('Part name is required');
      return;
    }

    if (!formData.Unit.trim()) {
      setError('Unit is required');
      return;
    }

    // Net weight validation
    if (!formData.NetWgt && formData.NetWgt !== 0) {
      setError('Net weight is required');
      return;
    }

    const netWgt = parseFloat(formData.NetWgt);
    if (isNaN(netWgt) || netWgt < 0) {
      setError('Net weight must be a valid number greater than or equal to 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for submission
      const submissionData = {
        ...formData,
        NetWgt: parseFloat(formData.NetWgt) // Convert to number for API
      };

      const response = await axios.put(`${BASE_URL}/api/items/${item._id}`, submissionData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update item');
      }
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err.response?.data?.message || 'Failed to update item. Please try again.');
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
          Edit Item
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* First Row - Part Number and Part Name */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Part Number *"
              name="PartNo"
              value={formData.PartNo}
              onChange={handleChange}
              required
              disabled={loading}
              error={!!error && error.includes('Part number')}
            />

            <TextField
              fullWidth
              label="Part Name *"
              name="PartName"
              value={formData.PartName}
              onChange={handleChange}
              required
              disabled={loading}
              error={!!error && error.includes('Part name')}
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

          {/* Second Row - Drawing Number and Revision Number */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Drawing Number"
              name="DrawingNo"
              value={formData.DrawingNo}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Revision Number"
              name="RevisionNo"
              value={formData.RevisionNo}
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>

          {/* Third Row - Unit and HSN Code */}
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth error={!!error && error.includes('Unit')}>
              <InputLabel>Unit *</InputLabel>
              <Select
                name="Unit"
                value={formData.Unit}
                onChange={handleSelectChange}
                label="Unit *"
                required
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Select Unit</em>
                </MenuItem>
                {unitOptions.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="HSN Code"
              name="HSNCode"
              value={formData.HSNCode}
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>

          {/* Fourth Row - Material and Net Weight */}
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Material</InputLabel>
              <Select
                name="MaterialID"
                value={formData.MaterialID}
                onChange={handleSelectChange}
                label="Material"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Select Material</em>
                </MenuItem>
                {materials.map((material) => (
                  <MenuItem key={material._id} value={material._id}>
                    {material.MaterialCode} - {material.MaterialName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Net Weight *"
              name="NetWgt"
              value={formData.NetWgt}
              onChange={handleChange}
              required
              disabled={loading}
              error={!!error && error.includes('Net weight')}
              helperText={error && error.includes('Net weight') ? error : ''}
              type="text"
              placeholder="0.00"
              InputProps={{
                inputProps: { 
                  min: 0,
                  step: "0.01"
                }
              }}
            />
          </Stack>
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
          {loading ? 'Updating...' : 'Update Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItem;