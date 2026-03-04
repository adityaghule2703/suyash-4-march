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
  Autocomplete
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddProcessDetails = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    PartNo: '',
    OperationDescription: '',
    Operation: '',
    Machine: '',
    Manday: 0,
    Rate: 0
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch items for dropdown
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handlePartNoChange = (event, newValue) => {
    if (newValue) {
      // If newValue is an object (selected from dropdown)
      if (typeof newValue === 'object') {
        setFormData(prev => ({
          ...prev,
          PartNo: newValue.PartNo
        }));
      } else {
        // If newValue is a string (manually entered)
        setFormData(prev => ({
          ...prev,
          PartNo: newValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        PartNo: ''
      }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.PartNo) {
      setError('Part Number is required');
      return;
    }

    if (!formData.OperationDescription.trim()) {
      setError('Operation Description is required');
      return;
    }

    if (!formData.Operation.trim()) {
      setError('Operation is required');
      return;
    }

    if (!formData.Machine.trim()) {
      setError('Machine is required');
      return;
    }

    if (formData.Manday <= 0) {
      setError('Manday must be greater than 0');
      return;
    }

    if (formData.Rate <= 0) {
      setError('Rate must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/process-details`, formData, {
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
        setError(response.data.message || 'Failed to add process details');
      }
    } catch (err) {
      console.error('Error adding process details:', err);
      setError(err.response?.data?.message || 'Failed to add process details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      PartNo: '',
      OperationDescription: '',
      Operation: '',
      Machine: '',
      Manday: 0,
      Rate: 0
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Create array of part numbers with their details for better display
  const partOptions = items.map(item => ({
    PartNo: item.PartNo,
    PartName: item.PartName,
    label: `${item.PartNo} - ${item.PartName}`
  }));

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
          Add New Process Details
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Part Number with Autocomplete */}
          <Autocomplete
            freeSolo
            options={partOptions}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return option.label || option.PartNo;
            }}
            value={formData.PartNo}
            onChange={handlePartNoChange}
            onInputChange={(event, newInputValue) => {
              setFormData(prev => ({
                ...prev,
                PartNo: newInputValue
              }));
            }}
            renderOption={(props, option) => (
              <MenuItem {...props}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {option.PartNo}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {option.PartName}
                  </Typography>
                </Box>
              </MenuItem>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Part Number *"
                required
                disabled={loading}
                placeholder="Search or enter part number"
              />
            )}
            disabled={loading}
          />

          {/* Operation Description */}
          <TextField
            fullWidth
            label="Operation Description *"
            name="OperationDescription"
            value={formData.OperationDescription}
            onChange={handleChange}
            required
            disabled={loading}
            multiline
            rows={2}
            placeholder="Describe the operation in detail"
          />

          {/* Operation */}
          <TextField
            fullWidth
            label="Operation *"
            name="Operation"
            value={formData.Operation}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., Cutting, Welding, Assembly, etc."
          />

          {/* Machine */}
          <TextField
            fullWidth
            label="Machine *"
            name="Machine"
            value={formData.Machine}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., CNC Machine, Welding Machine, etc."
          />

          {/* Manday and Rate */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Manday *"
              name="Manday"
              type="number"
              value={formData.Manday}
              onChange={handleNumberChange}
              required
              disabled={loading}
              InputProps={{
                inputProps: { min: 0, step: 0.5 }
              }}
            />
            <TextField
              fullWidth
              label="Rate (₹) *"
              name="Rate"
              type="number"
              value={formData.Rate}
              onChange={handleNumberChange}
              required
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Stack>

          {/* Preview Section */}
          {(formData.Operation || formData.PartNo) && (
            <Box sx={{ 
              p: 2.5, 
              bgcolor: '#E8F5E9', 
              borderRadius: 1,
              border: '1px solid #C8E6C9'
            }}>
              <Typography variant="subtitle2" fontWeight={600} color="#2E7D32" gutterBottom>
                Process Details Summary
              </Typography>
              <Stack spacing={1}>
                {formData.PartNo && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">Part Number:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formData.PartNo}
                    </Typography>
                  </Stack>
                )}
                
                {formData.Operation && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">Operation:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formData.Operation}
                    </Typography>
                  </Stack>
                )}
                
                {formData.Machine && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">Machine:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formData.Machine}
                    </Typography>
                  </Stack>
                )}
                
                {formData.Manday > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">Manday:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formData.Manday} {formData.Manday === 1 ? 'day' : 'days'}
                    </Typography>
                  </Stack>
                )}
                
                {formData.Rate > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">Rate:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      ₹{formData.Rate.toFixed(2)}
                    </Typography>
                  </Stack>
                )}
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
          {loading ? 'Adding...' : 'Add Process Details'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProcessDetails;