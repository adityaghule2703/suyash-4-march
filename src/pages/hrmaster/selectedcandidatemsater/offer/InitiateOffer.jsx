import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Close as CloseIcon, Calculate as CalculateIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const InitiateOffer = ({ open, onClose, onComplete, candidate = null }) => {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [fetchingCandidates, setFetchingCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [calculatedCTC, setCalculatedCTC] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    candidateId: '',
    applicationId: '',
    joiningDate: '',
    ctcComponents: {
      basic: '',
      hraPercent: 50,
      conveyanceAllowance: 1600,
      medicalAllowance: 1250,
      specialAllowance: '',
      bonusPercent: 8.33,
      employerPfPercent: 12,
      employerEsiPercent: 3.25,
      gratuityPercent: 4.81
    },
    offerDetails: {
      reportingTo: '',
      probationPeriod: 6,
      noticePeriod: 30,
      benefits: []
    }
  });

  const [benefitInput, setBenefitInput] = useState('');

  const benefitOptions = [
    'Medical Insurance',
    'Annual Bonus',
    'Performance Bonus',
    'Transport Allowance',
    'Meal Coupons',
    'Gym Membership',
    'Education Allowance',
    'Leave Travel Allowance'
  ];

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  };

  useEffect(() => {
    if (open) {
      console.log('Dialog opened, fetching candidates...');
      fetchSelectedCandidates();
    }
  }, [open]);

  // Handle candidate prop and set it as selected
  useEffect(() => {
    if (candidate && open) {
      console.log('Candidate received in InitiateOffer:', candidate);
      
      // Get the candidate ID
      const candidateId = candidate.id || candidate._id;
      
      // Get application ID from the candidate object
      let applicationId = null;
      let application = null;
      
      // Check if the candidate has latestApplication from the API
      if (candidate.latestApplication) {
        applicationId = candidate.latestApplication._id;
        application = candidate.latestApplication;
      }
      // Check if the candidate has applicationId directly (from parent component)
      else if (candidate.applicationId) {
        applicationId = candidate.applicationId;
        application = { _id: candidate.applicationId, jobId: { title: candidate.position } };
      }
      
      console.log('Extracted IDs:', { candidateId, applicationId });
      
      if (!candidateId) {
        setError('Candidate ID is missing');
        return;
      }
      
      if (!applicationId) {
        setError('This candidate does not have an application. Only candidates with applications can receive offers.');
        return;
      }
      
      // Create a candidate object for display
      const displayCandidate = {
        _id: candidateId,
        id: candidateId,
        firstName: candidate.firstName || candidate.name?.split(' ')[0] || 'Unknown',
        lastName: candidate.lastName || candidate.name?.split(' ')[1] || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        position: candidate.position || application?.jobId?.title || 'Not Assigned'
      };
      
      setSelectedCandidate(displayCandidate);
      setSelectedApplication(application);
      
      // Update form data with the IDs
      setFormData(prev => {
        const newFormData = {
          ...prev,
          candidateId: candidateId,
          applicationId: applicationId
        };
        console.log('Updated formData:', newFormData);
        return newFormData;
      });
    }
  }, [candidate, open]);

  const fetchSelectedCandidates = async () => {
    setFetchingCandidates(true);
    try {
      const token = getAuthToken();
      console.log('Fetching candidates from:', `${BASE_URL}/api/candidates?status=selected`);
      
      const response = await axios.get(`${BASE_URL}/api/candidates?status=selected`, {
        headers: { 
          Authorization: token ? `Bearer ${token}` : '' 
        }
      });
      
      console.log('Candidates response:', response.data);
      
      if (response.data.success) {
        // Filter candidates that have latestApplication (only they can have offers)
        const candidatesWithApplication = response.data.data.filter(
          candidate => candidate.latestApplication !== null
        );
        
        console.log('Candidates with applications:', candidatesWithApplication);
        setCandidates(candidatesWithApplication);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to fetch candidates');
    } finally {
      setFetchingCandidates(false);
    }
  };

  const handleCandidateChange = (e) => {
    const candidateId = e.target.value;
    console.log('Selected candidate ID:', candidateId);
    
    const candidate = candidates.find(c => c._id === candidateId);
    console.log('Found candidate:', candidate);
    
    setSelectedCandidate(candidate);
    
    if (candidate?.latestApplication) {
      console.log('Setting application:', candidate.latestApplication);
      setSelectedApplication(candidate.latestApplication);
      
      setFormData(prev => {
        const newFormData = {
          ...prev,
          candidateId: candidate._id,
          applicationId: candidate.latestApplication._id
        };
        console.log('Updated formData from dropdown:', newFormData);
        return newFormData;
      });
    } else {
      setError('Selected candidate has no application. Please select a different candidate.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear calculated CTC when inputs change
    setCalculatedCTC(null);
    setError('');
    setSuccess('');
  };

  const handleCTCComponentChange = (e) => {
    const { name, value } = e.target;
    
    // Convert empty string to empty string, otherwise keep as number
    const processedValue = value === '' ? '' : Number(value);
    
    setFormData(prev => ({
      ...prev,
      ctcComponents: {
        ...prev.ctcComponents,
        [name]: processedValue
      }
    }));
    setCalculatedCTC(null);
  };

  const handleAddBenefit = () => {
    if (benefitInput && !formData.offerDetails.benefits.includes(benefitInput)) {
      setFormData(prev => ({
        ...prev,
        offerDetails: {
          ...prev.offerDetails,
          benefits: [...prev.offerDetails.benefits, benefitInput]
        }
      }));
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (benefit) => {
    setFormData(prev => ({
      ...prev,
      offerDetails: {
        ...prev.offerDetails,
        benefits: prev.offerDetails.benefits.filter(b => b !== benefit)
      }
    }));
  };

  const calculateCTC = async () => {
    console.log('Current formData before submission:', formData);
    
    // Validate required fields
    if (!formData.candidateId) {
      setError('Please select a candidate first');
      return;
    }

    if (!formData.applicationId) {
      setError('Application ID is missing. This candidate does not have a valid application.');
      return;
    }

    if (!formData.ctcComponents.basic || formData.ctcComponents.basic === '') {
      setError('Please enter basic salary');
      return;
    }

    if (!formData.joiningDate) {
      setError('Please select joining date');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = getAuthToken();
      
      // Prepare the request body exactly as per API specification
      const requestBody = {
        candidateId: formData.candidateId,
        applicationId: formData.applicationId,
        joiningDate: formData.joiningDate,
        ctcComponents: {
          basic: Number(formData.ctcComponents.basic),
          hraPercent: Number(formData.ctcComponents.hraPercent),
          conveyanceAllowance: Number(formData.ctcComponents.conveyanceAllowance),
          medicalAllowance: Number(formData.ctcComponents.medicalAllowance),
          specialAllowance: formData.ctcComponents.specialAllowance === '' ? 0 : Number(formData.ctcComponents.specialAllowance),
          bonusPercent: Number(formData.ctcComponents.bonusPercent),
          employerPfPercent: Number(formData.ctcComponents.employerPfPercent),
          employerEsiPercent: Number(formData.ctcComponents.employerEsiPercent),
          gratuityPercent: Number(formData.ctcComponents.gratuityPercent)
        },
        offerDetails: {
          reportingTo: formData.offerDetails.reportingTo,
          probationPeriod: Number(formData.offerDetails.probationPeriod),
          noticePeriod: Number(formData.offerDetails.noticePeriod),
          benefits: formData.offerDetails.benefits
        }
      };

      console.log('Sending request to API:', requestBody);

      const response = await axios.post(
        `${BASE_URL}/api/offers/initiate`,
        requestBody,
        { 
          headers: { 
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('API Response:', response.data);

      if (response.data.success) {
        setCalculatedCTC(response.data.data.ctcDetails);
        setSuccess(`Offer initiated successfully! Offer ID: ${response.data.data.offerId}`);
        
        // Prepare updated data for parent component
        const updatedData = {
          id: selectedCandidate?._id || selectedCandidate?.id,
          status: 'Initiated',
          offerId: response.data.data.offerId,
          offerDetails: response.data.data
        };
        
        // Wait a moment to show success message before closing
        setTimeout(() => {
          if (onComplete) {
            onComplete(updatedData);
          }
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error calculating CTC:', err);
      
      // Handle different error scenarios
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
        console.error('Error response data:', err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || 'Failed to calculate CTC');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await calculateCTC();
  };

  const handleClose = () => {
    setSelectedCandidate(null);
    setSelectedApplication(null);
    setCalculatedCTC(null);
    setError('');
    setSuccess('');
    setFormData({
      candidateId: '',
      applicationId: '',
      joiningDate: '',
      ctcComponents: {
        basic: '',
        hraPercent: 50,
        conveyanceAllowance: 1600,
        medicalAllowance: 1250,
        specialAllowance: '',
        bonusPercent: 8.33,
        employerPfPercent: 12,
        employerEsiPercent: 3.25,
        gratuityPercent: 4.81
      },
      offerDetails: {
        reportingTo: '',
        probationPeriod: 6,
        noticePeriod: 30,
        benefits: []
      }
    });
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Check if button should be enabled
  const isButtonEnabled = () => {
    const enabled = !loading && 
                    formData.candidateId && 
                    formData.applicationId &&
                    formData.ctcComponents.basic && 
                    formData.ctcComponents.basic !== '' &&
                    formData.joiningDate;
    
    console.log('Button enabled check:', {
      loading,
      candidateId: formData.candidateId,
      applicationId: formData.applicationId,
      basic: formData.ctcComponents.basic,
      joiningDate: formData.joiningDate,
      enabled
    });
    
    return enabled;
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
        backgroundColor: '#F8FAFC',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight={600}>
          Initiate Offer Letter
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* Debug Info - Remove in production */}
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="caption" component="div">
              <strong>Debug Info:</strong><br />
              Candidate ID: {formData.candidateId || 'Not set'}<br />
              Application ID: {formData.applicationId || 'Not set'}<br />
              Basic Salary: {formData.ctcComponents.basic || 'Not set'}<br />
              Joining Date: {formData.joiningDate || 'Not set'}<br />
              Button Enabled: {isButtonEnabled() ? 'Yes' : 'No'}
            </Typography>
          </Paper>

          {/* Candidate Selection Card */}
          <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              👤 Select Candidate
            </Typography>
            
            {fetchingCandidates ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {candidates.length === 0 ? (
                  <Alert severity="info">
                    No candidates with applications found. Only candidates with applications can receive offers.
                  </Alert>
                ) : (
                  <FormControl fullWidth>
                    <InputLabel>Select Candidate</InputLabel>
                    <Select
                      value={selectedCandidate?._id || selectedCandidate?.id || ''}
                      onChange={handleCandidateChange}
                      label="Select Candidate"
                    >
                      {candidates.map((cand) => (
                        <MenuItem key={cand._id} value={cand._id}>
                          {cand.firstName} {cand.lastName} - {cand.candidateId}
                          {cand.latestApplication && ` (${cand.latestApplication.applicationId} - ${cand.latestApplication.jobId?.title})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </>
            )}

            {selectedCandidate && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body2">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body2">{selectedCandidate.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">{selectedCandidate.phone}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Position
                    </Typography>
                    <Typography variant="body2">
                      {selectedApplication?.jobId?.title || selectedCandidate.position || 'N/A'}
                    </Typography>
                  </Grid>
                  {selectedApplication && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">
                        Application ID
                      </Typography>
                      <Typography variant="body2">
                        {selectedApplication.applicationId || selectedApplication._id}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Paper>

          {/* CTC Components Card */}
          <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              💰 CTC Components (Monthly)
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Basic Salary"
                  name="basic"
                  type="number"
                  value={formData.ctcComponents.basic}
                  onChange={handleCTCComponentChange}
                  required
                  error={!formData.ctcComponents.basic}
                  helperText={!formData.ctcComponents.basic ? "Required" : ""}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="HRA Percentage"
                  name="hraPercent"
                  type="number"
                  value={formData.ctcComponents.hraPercent}
                  onChange={handleCTCComponentChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Conveyance Allowance"
                  name="conveyanceAllowance"
                  type="number"
                  value={formData.ctcComponents.conveyanceAllowance}
                  onChange={handleCTCComponentChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Medical Allowance"
                  name="medicalAllowance"
                  type="number"
                  value={formData.ctcComponents.medicalAllowance}
                  onChange={handleCTCComponentChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Special Allowance"
                  name="specialAllowance"
                  type="number"
                  value={formData.ctcComponents.specialAllowance}
                  onChange={handleCTCComponentChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bonus Percentage"
                  name="bonusPercent"
                  type="number"
                  value={formData.ctcComponents.bonusPercent}
                  onChange={handleCTCComponentChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Employer PF Percentage"
                  name="employerPfPercent"
                  type="number"
                  value={formData.ctcComponents.employerPfPercent}
                  onChange={handleCTCComponentChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Employer ESI Percentage"
                  name="employerEsiPercent"
                  type="number"
                  value={formData.ctcComponents.employerEsiPercent}
                  onChange={handleCTCComponentChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Offer Details Card */}
          <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              📄 Offer Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Reporting To"
                  name="offerDetails.reportingTo"
                  value={formData.offerDetails.reportingTo}
                  onChange={handleInputChange}
                  placeholder="e.g., Production Manager"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Probation Period (months)"
                  name="offerDetails.probationPeriod"
                  type="number"
                  value={formData.offerDetails.probationPeriod}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Notice Period (days)"
                  name="offerDetails.noticePeriod"
                  type="number"
                  value={formData.offerDetails.noticePeriod}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  required
                  error={!formData.joiningDate}
                  helperText={!formData.joiningDate ? "Required" : ""}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Benefits
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Add Benefit</InputLabel>
                    <Select
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      label="Add Benefit"
                    >
                      {benefitOptions.map((benefit) => (
                        <MenuItem key={benefit} value={benefit}>
                          {benefit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleAddBenefit}
                    disabled={!benefitInput}
                  >
                    Add
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.offerDetails.benefits.map((benefit) => (
                    <Chip
                      key={benefit}
                      label={benefit}
                      onDelete={() => handleRemoveBenefit(benefit)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Calculated CTC Card */}
          {calculatedCTC && (
            <Paper sx={{ p: 3, bgcolor: '#F0F7FF', border: '1px solid #1976D2' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: '#1976D2' }}>
                ✅ Calculated CTC (Annual)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">
                    Basic + DA
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(calculatedCTC.basic * 12)}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">
                    HRA
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(calculatedCTC.hra * 12)}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">
                    Gross Salary
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(calculatedCTC.gross * 12)}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">
                    Employer PF
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(calculatedCTC.employerPf)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="#1976D2">
                      Total CTC
                    </Typography>
                    <Typography variant="h5" color="#1976D2" fontWeight={700}>
                      {formatCurrency(calculatedCTC.totalCtc)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC',
        justifyContent: 'space-between'
      }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isButtonEnabled()}
          startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
            minWidth: 200
          }}
        >
          {loading ? 'Processing...' : 'Calculate & Initiate Offer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InitiateOffer;