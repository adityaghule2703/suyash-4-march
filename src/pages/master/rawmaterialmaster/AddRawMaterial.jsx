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
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormControlLabel,
  Switch,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const steps = ['Basic Information', 'Rate & Cost Details'];

const AddRawMaterial = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    MaterialName: '',
    Grade: '',
    RatePerKG: '',
    ScrapPercentage: '',
    TransportLossPercentage: '',
    DateEffective: new Date().toISOString().split('T')[0],
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New state for materials dropdown
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Fetch materials for dropdown
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/materials`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMaterials(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialChange = (event, newValue) => {
    setSelectedMaterial(newValue);
    if (newValue) {
      // Auto-fill MaterialName and Grade based on selected material
      setFormData(prev => ({
        ...prev,
        MaterialName: newValue.MaterialName,
        Grade: newValue.Grade || ''
      }));
    } else {
      // Clear fields if no material selected
      setFormData(prev => ({
        ...prev,
        MaterialName: '',
        Grade: ''
      }));
    }
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      IsActive: e.target.checked
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Information
        if (!formData.MaterialName.trim()) {
          setError('Material name is required');
          return false;
        }
        if (!formData.Grade.trim()) {
          setError('Grade is required');
          return false;
        }
        break;
      
      case 1: // Rate & Cost Details
        if (!formData.RatePerKG || formData.RatePerKG <= 0) {
          setError('Rate per KG must be greater than 0');
          return false;
        }
        if (!formData.ScrapPercentage || formData.ScrapPercentage < 0) {
          setError('Scrap percentage is required');
          return false;
        }
        if (!formData.TransportLossPercentage || formData.TransportLossPercentage < 0) {
          setError('Transport loss percentage is required');
          return false;
        }
        if (!formData.DateEffective) {
          setError('Date effective is required');
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
      const response = await axios.post(`${BASE_URL}/api/raw-materials`, {
        ...formData,
        RatePerKG: parseFloat(formData.RatePerKG),
        ScrapPercentage: parseFloat(formData.ScrapPercentage),
        TransportLossPercentage: parseFloat(formData.TransportLossPercentage),
        MaterialId: selectedMaterial?._id || null // Optional: store reference to original material
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
        setError(response.data.message || 'Failed to add raw material');
      }
    } catch (err) {
      console.error('Error adding raw material:', err);
      setError(err.response?.data?.message || 'Failed to add raw material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      MaterialName: '',
      Grade: '',
      RatePerKG: '',
      ScrapPercentage: '',
      TransportLossPercentage: '',
      DateEffective: new Date().toISOString().split('T')[0],
      IsActive: true
    });
    setSelectedMaterial(null);
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
          <Stack spacing={2.5}>
            {/* Material Selection Dropdown */}
            <Autocomplete
              fullWidth
              options={materials}
              loading={loadingMaterials}
              value={selectedMaterial}
              onChange={handleMaterialChange}
              getOptionLabel={(option) => 
                `${option.MaterialName}${option.Grade ? ` - ${option.Grade}` : ''}${option.MaterialCode ? ` (${option.MaterialCode})` : ''}`
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Material *"
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingMaterials ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {option.MaterialName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.MaterialCode} {option.Grade && `| Grade: ${option.Grade}`}
                    </Typography>
                  </Box>
                </li>
              )}
              sx={{ mb: 1 }}
            />
            
            {/* Material Name - Auto-filled */}
            <TextField
              fullWidth
              label="Material Name *"
              name="MaterialName"
              value={formData.MaterialName}
              onChange={handleChange}
              required
              disabled={loading}
              size="medium"
              variant="outlined"
              InputProps={{
                readOnly: true, // Make it read-only since it's auto-filled
                sx: { bgcolor: '#f5f5f5' } // Light gray background to indicate read-only
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
            
            {/* Grade - Auto-filled */}
            <TextField
              fullWidth
              label="Grade *"
              name="Grade"
              value={formData.Grade}
              onChange={handleChange}
              required
              disabled={loading}
              size="medium"
              variant="outlined"
              InputProps={{
                readOnly: true, // Make it read-only since it's auto-filled
                sx: { bgcolor: '#f5f5f5' } // Light gray background to indicate read-only
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2.5}>
            {/* Rate and Date Effective - Two fields in one row */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Rate per KG (₹) *"
                  name="RatePerKG"
                  type="number"
                  value={formData.RatePerKG}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date Effective *"
                  name="DateEffective"
                  type="date"
                  value={formData.DateEffective}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            {/* Scrap and Transport Loss - Two fields in one row */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Scrap Percentage *"
                  name="ScrapPercentage"
                  type="number"
                  value={formData.ScrapPercentage}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <Typography>%</Typography>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Transport Loss % *"
                  name="TransportLossPercentage"
                  type="number"
                  value={formData.TransportLossPercentage}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <Typography>%</Typography>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            {/* Calculation Preview */}
            {formData.RatePerKG && formData.ScrapPercentage && formData.TransportLossPercentage && (
              <Box sx={{ 
                p: 2, 
                bgcolor: '#E8F5E9', 
                borderRadius: 1,
                border: '1px solid #C8E6C9'
              }}>
                <Typography variant="subtitle2" fontWeight={600} color="#2E7D32" gutterBottom>
                  Rate Calculation Preview
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Base Rate:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={500} align="right">
                      ₹{parseFloat(formData.RatePerKG).toLocaleString('en-IN')}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Scrap ({formData.ScrapPercentage}%):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={500} align="right" color="warning.main">
                      + ₹{(formData.RatePerKG * formData.ScrapPercentage / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Transport Loss ({formData.TransportLossPercentage}%):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={500} align="right" color="warning.main">
                      + ₹{(formData.RatePerKG * formData.TransportLossPercentage / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ borderTop: '1px dashed #BDBDBD', pt: 1, mt: 1 }}>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography variant="body1" fontWeight={600} color="textPrimary">
                            Effective Rate:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body1" fontWeight={700} color="success.main" align="right">
                            ₹{(
                              parseFloat(formData.RatePerKG) + 
                              (formData.RatePerKG * formData.ScrapPercentage / 100) + 
                              (formData.RatePerKG * formData.TransportLossPercentage / 100)
                            ).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Material Info Summary */}
            {selectedMaterial && (
              <Box sx={{ 
                p: 1.5, 
                bgcolor: '#E3F2FD', 
                borderRadius: 1,
                border: '1px solid #90CAF9'
              }}>
                <Typography variant="caption" color="#1976D2" fontWeight={600}>
                  Material Details
                </Typography>
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="textSecondary">Code:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="caption" fontWeight={500}>{selectedMaterial.MaterialCode}</Typography>
                  </Grid>
                  {selectedMaterial.Density && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="textSecondary">Density:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="caption" fontWeight={500}>
                          {selectedMaterial.Density} {selectedMaterial.Unit || ''}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            )}
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
      PaperProps={{
        sx: { 
          borderRadius: 2,
          minHeight: '580px' // Increased height to accommodate dropdown
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC',
        paddingBottom: '16px'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010',
          paddingTop: '8px'
        }}>
          Add Raw Material
        </div>
      </DialogTitle>
      
      {/* Error Alert at the top */}
      {error && (
        <Box sx={{ px: 3, py: 2 }}>
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 1,
              '& .MuiAlert-icon': {
                alignItems: 'center'
              }
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        </Box>
      )}
      
      {/* Stepper with proper spacing */}
      <Box sx={{ 
        px: 3, 
        py: 2,
        borderBottom: '1px solid #F0F0F0'
      }}>
        <Stepper 
          activeStep={activeStep} 
          sx={{
            '& .MuiStepLabel-root': {
              padding: '0 8px'
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <DialogContent sx={{ 
        pt: 3,
        px: 3,
        pb: 3,
      }}>
        {/* Step Content with bottom spacing */}
        <Box sx={{ 
          minHeight: '360px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ mb: 2 }}>
            {renderStepContent(activeStep)}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        pt: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <Stack direction="row" spacing={2} width="100%" justifyContent="space-between">
          <Box>
            <Button 
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: '100px'
              }}
            >
              Back
            </Button>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button 
              onClick={handleClose} 
              disabled={loading}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: '100px'
              }}
            >
              Cancel
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? null : <AddIcon />}
                sx={{
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor: '#1976D2',
                  '&:hover': {
                    backgroundColor: '#1565C0'
                  },
                  minWidth: '140px'
                }}
              >
                {loading ? 'Adding...' : 'Add Material'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor: '#1976D2',
                  '&:hover': {
                    backgroundColor: '#1565C0'
                  },
                  minWidth: '100px'
                }}
              >
                Next
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AddRawMaterial;