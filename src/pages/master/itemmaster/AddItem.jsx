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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddItem = ({ open, onClose, onAdd, materials }) => {
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
  const [hsnCodes, setHsnCodes] = useState([]);
  const [loadingHsn, setLoadingHsn] = useState(false);

  // Enum values for Unit field
  const unitOptions = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

  // Fetch HSN codes from TaxMaster
  useEffect(() => {
    if (open) {
      fetchHsnCodes();
    }
  }, [open]);

  const fetchHsnCodes = async () => {
    try {
      setLoadingHsn(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/taxes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const activeHsnCodes = (response.data.data || [])
          .filter(tax => tax.IsActive === true)
          .map(tax => ({
            _id: tax._id,
            HSNCode: tax.HSNCode,
            Description: tax.Description,
            CGSTPercentage: tax.CGSTPercentage || 0,
            SGSTPercentage: tax.SGSTPercentage || 0,
            IGSTPercentage: tax.IGSTPercentage || tax.GSTPercentage || 0,
            GSTPercentage: tax.GSTPercentage || 0
          }));
        setHsnCodes(activeHsnCodes);
      }
    } catch (err) {
      console.error('Error fetching HSN codes:', err);
    } finally {
      setLoadingHsn(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for NetWgt to ensure it's a number
    if (name === 'NetWgt') {
      // Allow empty string or valid number
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

  const handleHSNChange = (event) => {
    const selectedHSNCode = event.target.value;
    setFormData(prev => ({
      ...prev,
      HSNCode: selectedHSNCode
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

      const response = await axios.post(`${BASE_URL}/api/items`, submissionData, {
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
        setError(response.data.message || 'Failed to add item');
      }
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
          Add New Item
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

            <FormControl fullWidth>
              <InputLabel>HSN Code</InputLabel>
              <Select
                name="HSNCode"
                value={formData.HSNCode}
                onChange={handleHSNChange}
                label="HSN Code"
                disabled={loading || loadingHsn}
              >
                <MenuItem value="">
                  <em>{loadingHsn ? 'Loading...' : 'Select HSN Code'}</em>
                </MenuItem>
                {hsnCodes.map((hsn) => (
                  <MenuItem key={hsn._id} value={hsn.HSNCode}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {hsn.HSNCode}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {hsn.Description} (GST: {hsn.GSTPercentage || hsn.CGSTPercentage + hsn.SGSTPercentage}%)
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                {hsnCodes.length === 0 && !loadingHsn && (
                  <MenuItem disabled>
                    <Typography variant="body2" color="textSecondary">
                      No HSN codes available
                    </Typography>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
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
          {loading ? 'Adding...' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItem;