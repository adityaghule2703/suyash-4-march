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
  MenuItem,
  Grid
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const EditDimensions = ({ open, onClose, dimension, onUpdate }) => {
  const [formData, setFormData] = useState({
    PartNo: '',
    Thickness: '',
    Width: '',
    Length: '',
    Density: '',
    Pitch: '',
    NoOfCavity: '',
    StripSize: ''
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

  // Set form data when dimension prop changes
  useEffect(() => {
    if (dimension) {
      setFormData({
        PartNo: dimension.PartNo || '',
        Thickness: dimension.Thickness || '',
        Width: dimension.Width || '',
        Length: dimension.Length || '',
        Density: dimension.Density || '',
        Pitch: dimension.Pitch || '',
        NoOfCavity: dimension.NoOfCavity || '',
        StripSize: dimension.StripSize || ''
      });
    }
  }, [dimension]);

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
    
    // If an item is selected, auto-fill density from the item's material
    const selectedItem = items.find(item => item.PartNo === value);
    if (selectedItem && selectedItem.MaterialID && !formData.Density) {
      setFormData(prev => ({
        ...prev,
        Density: selectedItem.MaterialID.Density || ''
      }));
    }
  };

  const calculateWeight = () => {
    const { Thickness, Width, Length, Density } = formData;
    if (Thickness && Width && Length && Density) {
      const thicknessMm = parseFloat(Thickness) / 1000;
      const widthMm = parseFloat(Width) / 1000;
      const lengthMm = parseFloat(Length) / 1000;
      const density = parseFloat(Density);
      
      const volume = thicknessMm * widthMm * lengthMm;
      const weight = volume * density * 1000;
      return weight.toFixed(6);
    }
    return 0;
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.PartNo) {
      setError('Part No is required');
      return;
    }
    if (!formData.Thickness || parseFloat(formData.Thickness) <= 0) {
      setError('Thickness must be greater than 0');
      return;
    }
    if (!formData.Width || parseFloat(formData.Width) <= 0) {
      setError('Width must be greater than 0');
      return;
    }
    if (!formData.Length || parseFloat(formData.Length) <= 0) {
      setError('Length must be greater than 0');
      return;
    }
    if (!formData.Density || parseFloat(formData.Density) <= 0) {
      setError('Density must be greater than 0');
      return;
    }
    if (!formData.Pitch || parseFloat(formData.Pitch) <= 0) {
      setError('Pitch must be greater than 0');
      return;
    }
    if (!formData.NoOfCavity || parseInt(formData.NoOfCavity) <= 0) {
      setError('Number of Cavities must be greater than 0');
      return;
    }
    if (!formData.StripSize || parseFloat(formData.StripSize) <= 0) {
      setError('Strip Size must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/dimension-weights/${dimension._id}`, {
        PartNo: formData.PartNo,
        Thickness: parseFloat(formData.Thickness),
        Width: parseFloat(formData.Width),
        Length: parseFloat(formData.Length),
        Density: parseFloat(formData.Density),
        Pitch: parseFloat(formData.Pitch),
        NoOfCavity: parseInt(formData.NoOfCavity),
        StripSize: parseFloat(formData.StripSize)
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
        setError(response.data.message || 'Failed to update dimension');
      }
    } catch (err) {
      console.error('Error updating dimension:', err);
      setError(err.response?.data?.message || 'Failed to update dimension. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const weight = calculateWeight();

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
          Edit Dimension Weight
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

          {/* Thickness and Width */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Thickness (mm) *"
                name="Thickness"
                type="number"
                value={formData.Thickness}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  endAdornment: <Typography variant="caption">mm</Typography>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Width (mm) *"
                name="Width"
                type="number"
                value={formData.Width}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  endAdornment: <Typography variant="caption">mm</Typography>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
          </Grid>

          {/* Length and Density */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Length (mm) *"
                name="Length"
                type="number"
                value={formData.Length}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  endAdornment: <Typography variant="caption">mm</Typography>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Density (g/cm³) *"
                name="Density"
                type="number"
                value={formData.Density}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  endAdornment: <Typography variant="caption">g/cm³</Typography>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
          </Grid>

          {/* New Fields: Pitch, NoOfCavity, StripSize */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Pitch *"
                name="Pitch"
                type="number"
                value={formData.Pitch}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="No of Cavities *"
                name="NoOfCavity"
                type="number"
                value={formData.NoOfCavity}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  inputProps: { min: 1, step: 1 }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Strip Size *"
                name="StripSize"
                type="number"
                value={formData.StripSize}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
          </Grid>

          {/* Weight Preview */}
          {weight > 0 && (
            <Box sx={{ 
              p: 2.5, 
              bgcolor: '#E8F5E9', 
              borderRadius: 1,
              border: '1px solid #C8E6C9'
            }}>
              <Typography variant="subtitle2" fontWeight={600} color="#2E7D32" gutterBottom>
                Weight Calculation Preview
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Current Weight:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {dimension?.WeightInKG || 0} kg
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">New Calculated Weight:</Typography>
                  <Typography variant="body1" fontWeight={700} color="success.main">
                    {weight} kg
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
          disabled={loading || fetchingItems}
          startIcon={!loading && <EditIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' }
          }}
        >
          {loading ? 'Updating...' : 'Update Dimension'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDimensions;