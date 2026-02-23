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
  Stepper,
  Step,
  StepLabel,
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const steps = ['Company Information', 'Bank & Contact Details'];

const AddCompanies = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    CompanyName: '',
    Address: '',
    GSTIN: '',
    PAN: '',
    State: '',
    StateCode: '',
    Phone: '',
    Email: '',
    BankName: '',
    AccountNo: '',
    IFSC: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Company Information
        if (!formData.CompanyName.trim()) {
          setError('Company name is required');
          return false;
        }
        if (!formData.Address.trim()) {
          setError('Address is required');
          return false;
        }
        if (!formData.GSTIN.trim()) {
          setError('GSTIN is required');
          return false;
        }
        if (!formData.PAN.trim()) {
          setError('PAN is required');
          return false;
        }
        if (!formData.State.trim()) {
          setError('State is required');
          return false;
        }
        if (!formData.StateCode) {
          setError('State code is required');
          return false;
        }
        break;
      
      case 1: // Bank & Contact Details
        if (!formData.Email.trim()) {
          setError('Email is required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
      
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/company`, formData, {
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
        setError(response.data.message || 'Failed to add company');
      }
    } catch (err) {
      console.error('Error adding company:', err);
      setError(err.response?.data?.message || 'Failed to add company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      CompanyName: '',
      Address: '',
      GSTIN: '',
      PAN: '',
      State: '',
      StateCode: '',
      Phone: '',
      Email: '',
      BankName: '',
      AccountNo: '',
      IFSC: ''
    });
    setActiveStep(0);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Company Name - Full Width */}
            <TextField
              fullWidth
              label="Company Name *"
              name="CompanyName"
              value={formData.CompanyName}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            {/* Address - Full Width */}
            <TextField
              fullWidth
              label="Address *"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              required
              multiline
              rows={3}
              disabled={loading}
            />
            
            {/* GSTIN and PAN - Two fields in one row */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="GSTIN *"
                name="GSTIN"
                value={formData.GSTIN}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="PAN *"
                name="PAN"
                value={formData.PAN}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Stack>
            
            {/* State and State Code - Two fields in one row */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="State *"
                name="State"
                value={formData.State}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="State Code *"
                name="StateCode"
                value={formData.StateCode}
                onChange={handleChange}
                required
                type="number"
                disabled={loading}
              />
            </Stack>
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Email and Phone - Two fields in one row */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Email *"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                disabled={loading}
              />
            </Stack>
            
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              Bank Details (Optional)
            </Typography>
            
            {/* Bank Name - Full Width */}
            <TextField
              fullWidth
              label="Bank Name"
              name="BankName"
              value={formData.BankName}
              onChange={handleChange}
              disabled={loading}
            />
            
            {/* Account Number and IFSC - Two fields in one row */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Account Number"
                name="AccountNo"
                value={formData.AccountNo}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="IFSC Code"
                name="IFSC"
                value={formData.IFSC}
                onChange={handleChange}
                disabled={loading}
              />
            </Stack>
          </Stack>
        );
      
      default:
        return null;
    }
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
          Add New Company
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box>
          {renderStepContent(activeStep)}
        </Box>
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
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
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
            {loading ? 'Adding...' : 'Add Company'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddCompanies;