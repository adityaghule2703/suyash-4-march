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



const InitiateOffer = ({ open, onClose, onSubmit, candidate = null }) => {
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

  useEffect(() => {
    if (open) {
      fetchSelectedCandidates();
    }
  }, [open]);

  useEffect(() => {
    if (candidate) {
      setSelectedCandidate(candidate);
      if (candidate.latestApplication) {
        setSelectedApplication(candidate.latestApplication);
        setFormData(prev => ({
          ...prev,
          candidateId: candidate._id,
          applicationId: candidate.latestApplication._id
        }));
      }
    }
  }, [candidate]);

  const fetchSelectedCandidates = async () => {
    setFetchingCandidates(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates?status=selected`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCandidates(response.data.data);
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
    const candidate = candidates.find(c => c._id === candidateId);
    setSelectedCandidate(candidate);
    
    if (candidate?.latestApplication) {
      setSelectedApplication(candidate.latestApplication);
      setFormData(prev => ({
        ...prev,
        candidateId: candidate._id,
        applicationId: candidate.latestApplication._id
      }));
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
    setFormData(prev => ({
      ...prev,
      ctcComponents: {
        ...prev.ctcComponents,
        [name]: value
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
    if (!formData.candidateId || !formData.applicationId) {
      setError('Please select a candidate first');
      return;
    }

    if (!formData.ctcComponents.basic) {
      setError('Please enter basic salary');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/offers/initiate`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCalculatedCTC(response.data.data.ctcDetails);
        setSuccess('CTC calculated successfully!');
        
        if (onSubmit) {
          onSubmit(response.data.data);
        }
      }
    } catch (err) {
      console.error('Error calculating CTC:', err);
      setError(err.response?.data?.message || 'Failed to calculate CTC');
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
              <FormControl fullWidth>
                <InputLabel>Select Candidate</InputLabel>
                <Select
                  value={selectedCandidate?._id || ''}
                  onChange={handleCandidateChange}
                  label="Select Candidate"
                >
                  {candidates.map((cand) => (
                    <MenuItem key={cand._id} value={cand._id}>
                      {cand.firstName} {cand.lastName} - {cand.candidateId}
                      {cand.latestApplication && ` (${cand.latestApplication.applicationId})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                      {selectedApplication?.jobId?.title || 'N/A'}
                    </Typography>
                  </Grid>
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
        <Button onClick={handleClose}>
          Cancel
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.candidateId || !formData.ctcComponents.basic}
          startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
            minWidth: 200
          }}
        >
          {loading ? 'Calculating...' : 'Calculate & Initiate Offer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InitiateOffer;