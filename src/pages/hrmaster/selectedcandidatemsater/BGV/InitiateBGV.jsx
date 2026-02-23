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
  Avatar,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Tooltip,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Fingerprint as FingerprintIcon,
  Gavel as GavelIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import axios from 'axios';


const InitiateBGV = ({ open, onClose, onSubmit, candidate = null, offerData = null }) => {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [offers, setOffers] = useState([]);
  const [fetchingCandidates, setFetchingCandidates] = useState(false);
  const [fetchingOffers, setFetchingOffers] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [vendor, setVendor] = useState('authbridge');
  const [initiatedBGV, setInitiatedBGV] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChecks, setSelectedChecks] = useState({
    identity: true,
    address: true,
    education: true,
    employment: true,
    criminal: true,
    reference: false,
    drug: false,
    credit: false
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [candidateConsent, setCandidateConsent] = useState(false);
  const [remarks, setRemarks] = useState('');

  const steps = [
    'Select Candidate',
    'Configure Checks',
    'Review & Initiate'
  ];

  const vendorOptions = [
    { value: 'authbridge', label: 'AuthBridge', description: 'Comprehensive background verification' },
    { value: 'firstadvantage', label: 'First Advantage', description: 'Global background screening' },
    { value: 'hireRight', label: 'HireRight', description: 'Employment background checks' },
    { value: 'internal', label: 'Internal Team', description: 'Manual verification by HR team' }
  ];

  const checkTypes = [
    { id: 'identity', label: 'Identity Verification', icon: <FingerprintIcon />, description: 'Verify government ID, PAN, Aadhar' },
    { id: 'address', label: 'Address Verification', icon: <HomeIcon />, description: 'Current and permanent address' },
    { id: 'education', label: 'Education Verification', icon: <SchoolIcon />, description: 'Degrees, certificates, institutions' },
    { id: 'employment', label: 'Employment History', icon: <WorkIcon />, description: 'Previous employers, designations, duration' },
    { id: 'criminal', label: 'Criminal Record Check', icon: <GavelIcon />, description: 'Police records, court cases' },
    { id: 'reference', label: 'Reference Check', icon: <PersonIcon />, description: 'Professional and personal references' },
    { id: 'drug', label: 'Drug Test', icon: <WarningIcon />, description: 'Substance abuse screening' },
    { id: 'credit', label: 'Credit Check', icon: <BusinessIcon />, description: 'Credit history and financial background' }
  ];

  useEffect(() => {
    if (open) {
      fetchSelectedCandidates();
      fetchAcceptedOffers();
    }
  }, [open]);

  useEffect(() => {
    if (candidate) {
      setSelectedCandidate(candidate);
    }
  }, [candidate]);

  useEffect(() => {
    if (offerData) {
      setSelectedOffer(offerData);
    }
  }, [offerData]);

  const fetchSelectedCandidates = async () => {
    setFetchingCandidates(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/candidates?status=selected`, {
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

  const fetchAcceptedOffers = async () => {
    setFetchingOffers(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/offers?status=accepted`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOffers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to fetch offers');
    } finally {
      setFetchingOffers(false);
    }
  };

  const handleCandidateChange = (e) => {
    const candidateId = e.target.value;
    const candidate = candidates.find(c => c._id === candidateId);
    setSelectedCandidate(candidate);
    setSelectedOffer(null); // Reset offer when candidate changes
  };

  const handleOfferChange = (e) => {
    const offerId = e.target.value;
    const offer = offers.find(o => o._id === offerId);
    setSelectedOffer(offer);
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      if (!selectedCandidate) {
        setError('Please select a candidate');
        return;
      }
      if (!selectedOffer) {
        setError('Please select an accepted offer');
        return;
      }
    } else if (activeStep === 1) {
      const selectedCount = Object.values(selectedChecks).filter(Boolean).length;
      if (selectedCount === 0) {
        setError('Please select at least one verification check');
        return;
      }
    }
    
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedCandidate(null);
    setSelectedOffer(null);
    setVendor('authbridge');
    setSelectedChecks({
      identity: true,
      address: true,
      education: true,
      employment: true,
      criminal: true,
      reference: false,
      drug: false,
      credit: false
    });
    setTermsAccepted(false);
    setCandidateConsent(false);
    setRemarks('');
    setInitiatedBGV(null);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleCheckToggle = (checkId) => {
    setSelectedChecks(prev => ({
      ...prev,
      [checkId]: !prev[checkId]
    }));
  };

  const handleSelectAllChecks = () => {
    const allSelected = Object.values(selectedChecks).every(Boolean);
    const newState = {};
    Object.keys(selectedChecks).forEach(key => {
      newState[key] = !allSelected;
    });
    setSelectedChecks(newState);
  };

  const handleInitiateBGV = async () => {
    if (!termsAccepted || !candidateConsent) {
      setError('Please accept terms and confirm candidate consent');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/bgv/initiate`,
        {
          candidateId: selectedCandidate._id,
          offerId: selectedOffer._id,
          vendor,
          checks: Object.keys(selectedChecks).filter(key => selectedChecks[key]),
          remarks
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setInitiatedBGV(response.data.data);
        setSuccess(response.data.message || 'Background verification initiated successfully!');
        
        if (onSubmit) {
          onSubmit(response.data.data);
        }
      }
    } catch (err) {
      console.error('Error initiating BGV:', err);
      setError(err.response?.data?.message || 'Failed to initiate background verification');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />;
      case 'in_progress': return <CircularProgress size={16} />;
      case 'failed': return <WarningIcon color="error" />;
      default: return <InfoIcon color="disabled" />;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Candidate Selection Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                👤 Select Candidate & Offer
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
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
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                {selectedCandidate && (
                  <>
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon fontSize="small" color="primary" />
                              <Box>
                                <Typography variant="caption" color="textSecondary">
                                  Full Name
                                </Typography>
                                <Typography variant="body2">
                                  {selectedCandidate.firstName} {selectedCandidate.lastName}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EmailIcon fontSize="small" color="primary" />
                              <Box>
                                <Typography variant="caption" color="textSecondary">
                                  Email
                                </Typography>
                                <Typography variant="body2">{selectedCandidate.email}</Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon fontSize="small" color="primary" />
                              <Box>
                                <Typography variant="caption" color="textSecondary">
                                  Phone
                                </Typography>
                                <Typography variant="body2">{selectedCandidate.phone}</Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <WorkIcon fontSize="small" color="primary" />
                              <Box>
                                <Typography variant="caption" color="textSecondary">
                                  Position
                                </Typography>
                                <Typography variant="body2">
                                  {selectedCandidate.latestApplication?.jobId?.title || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      {fetchingOffers ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <FormControl fullWidth>
                          <InputLabel>Select Accepted Offer</InputLabel>
                          <Select
                            value={selectedOffer?._id || ''}
                            onChange={handleOfferChange}
                            label="Select Accepted Offer"
                          >
                            {offers
                              .filter(offer => offer.candidateId === selectedCandidate._id)
                              .map((offer) => (
                                <MenuItem key={offer._id} value={offer._id}>
                                  {offer.offerId} - {formatDate(offer.joiningDate)} - ₹{offer.ctcDetails?.totalCtc}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>

            {/* Vendor Selection Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                🔧 Verification Vendor
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                >
                  <Grid container spacing={2}>
                    {vendorOptions.map((v) => (
                      <Grid item xs={12} md={6} key={v.value}>
                        <Paper
                          sx={{
                            p: 2,
                            border: vendor === v.value ? '2px solid #1976D2' : '1px solid #E0E0E0',
                            borderRadius: 2,
                            cursor: 'pointer',
                            bgcolor: vendor === v.value ? '#E3F2FD' : '#FFFFFF',
                            '&:hover': {
                              borderColor: '#1976D2',
                              bgcolor: '#F5F5F5'
                            }
                          }}
                          onClick={() => setVendor(v.value)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ 
                              p: 1, 
                              borderRadius: '50%', 
                              bgcolor: vendor === v.value ? '#1976D2' : '#F5F5F5',
                              color: vendor === v.value ? '#FFFFFF' : '#757575'
                            }}>
                              <SecurityIcon />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {v.label}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {v.description}
                              </Typography>
                            </Box>
                            <Radio 
                              value={v.value} 
                              checked={vendor === v.value}
                              sx={{ ml: 'auto' }}
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            {/* Checks Selection Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1976D2' }}>
                  ✅ Select Verification Checks
                </Typography>
                <Button 
                  size="small" 
                  onClick={handleSelectAllChecks}
                  variant="outlined"
                >
                  {Object.values(selectedChecks).every(Boolean) ? 'Deselect All' : 'Select All'}
                </Button>
              </Box>

              <Grid container spacing={2}>
                {checkTypes.map((check) => (
                  <Grid item xs={12} md={6} key={check.id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderColor: selectedChecks[check.id] ? '#1976D2' : '#E0E0E0',
                        bgcolor: selectedChecks[check.id] ? '#F0F7FF' : '#FFFFFF',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: '#1976D2',
                          bgcolor: '#F5F9FF'
                        }
                      }}
                      onClick={() => handleCheckToggle(check.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: selectedChecks[check.id] ? '#1976D2' : '#F5F5F5',
                          color: selectedChecks[check.id] ? '#FFFFFF' : '#757575'
                        }}>
                          {check.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {check.label}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {check.description}
                          </Typography>
                        </Box>
                        <Checkbox 
                          checked={selectedChecks[check.id]}
                          onChange={() => handleCheckToggle(check.id)}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: '#FFF3E0', 
                borderRadius: 1,
                border: '1px solid #FFB74D'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoIcon sx={{ color: '#F57C00' }} />
                  <Typography variant="subtitle2" sx={{ color: '#F57C00' }}>
                    Verification Timeline
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Estimated completion time: {Object.values(selectedChecks).filter(Boolean).length * 2}-{Object.values(selectedChecks).filter(Boolean).length * 4} days
                </Typography>
              </Box>
            </Paper>

            {/* Documents Required Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                📑 Documents Required
              </Typography>

              <List>
                {selectedChecks.identity && (
                  <ListItem>
                    <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Identity Proof"
                      secondary="Aadhar Card, PAN Card, Passport, Voter ID"
                    />
                  </ListItem>
                )}
                {selectedChecks.address && (
                  <ListItem>
                    <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Address Proof"
                      secondary="Utility bills, Bank statement, Rental agreement"
                    />
                  </ListItem>
                )}
                {selectedChecks.education && (
                  <ListItem>
                    <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Educational Certificates"
                      secondary="Degree certificates, Mark sheets, Diploma"
                    />
                  </ListItem>
                )}
                {selectedChecks.employment && (
                  <ListItem>
                    <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Employment Documents"
                      secondary="Experience letters, Salary slips, Form 16"
                    />
                  </ListItem>
                )}
              </List>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Candidate will be notified to upload required documents via email
                </Typography>
              </Alert>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            {/* Summary Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                📋 Verification Summary
              </Typography>

              {/* Candidate & Offer Info */}
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">
                      Candidate
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">
                      Offer ID
                    </Typography>
                    <Typography variant="body1">
                      {selectedOffer?.offerId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">
                      Vendor
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {vendor}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">
                      Initiation Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(new Date())}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Selected Checks */}
              <Typography variant="subtitle2" gutterBottom>
                Selected Verification Checks ({Object.values(selectedChecks).filter(Boolean).length})
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {Object.entries(selectedChecks)
                  .filter(([_, selected]) => selected)
                  .map(([checkId]) => {
                    const check = checkTypes.find(c => c.id === checkId);
                    return (
                      <Chip
                        key={checkId}
                        icon={check?.icon}
                        label={check?.label}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })}
              </Box>

              {/* Remarks */}
              <TextField
                fullWidth
                label="Additional Remarks (Optional)"
                multiline
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Any special instructions or notes for the verification team..."
                sx={{ mb: 3 }}
              />

              {/* Terms and Consent */}
              <Box sx={{ 
                p: 2, 
                bgcolor: '#E3F2FD', 
                borderRadius: 1,
                border: '1px solid #90CAF9',
                mb: 2
              }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedUserIcon fontSize="small" color="primary" />
                  Terms & Consent
                </Typography>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I confirm that the information provided is accurate and I have the authority to initiate this background verification
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={candidateConsent}
                      onChange={(e) => setCandidateConsent(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I confirm that the candidate has provided consent for background verification
                    </Typography>
                  }
                />
              </Box>

              {/* Warning */}
              <Alert severity="warning" icon={<WarningIcon />}>
                <Typography variant="body2">
                  Once initiated, the verification process cannot be cancelled. Please ensure all details are correct.
                </Typography>
              </Alert>
            </Paper>

            {/* Initiated BGV Details */}
            {initiatedBGV && (
              <Paper sx={{ p: 3, bgcolor: '#E8F5E9', border: '1px solid #81C784' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CheckCircleIcon sx={{ color: '#388E3C', fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#388E3C' }}>
                      BGV Initiated Successfully!
                    </Typography>
                    <Typography variant="body2">
                      BGV ID: {initiatedBGV.bgvId}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Verification Status:
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {initiatedBGV.checks?.map((check) => (
                    <Grid item xs={12} sm={6} md={4} key={check._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(check.status)}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                            {check.type}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {check.status}
                            </Typography>
                            {check.status === 'in_progress' && (
                              <LinearProgress sx={{ width: 50, height: 4, borderRadius: 2 }} />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => window.open(`${BASE_URL}/bgv/${initiatedBGV._id}/documents`, '_blank')}
                  fullWidth
                >
                  Upload Documents
                </Button>
              </Paper>
            )}
          </Stack>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, minHeight: '70vh' } }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Initiate Background Verification
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Verify candidate credentials and history
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Error/Success Messages */}
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}
        
        {success && !initiatedBGV && (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />}
            onClose={() => setSuccess('')}
            sx={{ mb: 3 }}
          >
            {success}
          </Alert>
        )}

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ minHeight: 450 }}>
          {getStepContent(activeStep)}
        </Box>
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

        <Box>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleInitiateBGV}
              disabled={loading || !termsAccepted || !candidateConsent}
              startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' },
                minWidth: 200
              }}
            >
              {loading ? 'Initiating...' : 'Initiate BGV'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default InitiateBGV;