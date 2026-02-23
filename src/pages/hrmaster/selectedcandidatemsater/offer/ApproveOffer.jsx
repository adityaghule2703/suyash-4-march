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
  Grid,
  Box,
  Paper,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Rating,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const ApproveOffer = ({ open, onClose, onSubmit, offerData = null }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [decision, setDecision] = useState(''); // 'approve' or 'reject'
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalRating, setApprovalRating] = useState(5);
  const [confirmAction, setConfirmAction] = useState(false);

  const steps = [
    'Review Offer',
    'CTC Verification',
    'Decision'
  ];

  const rejectionReasons = [
    'CTC exceeds budget',
    'Candidate not suitable',
    'Position on hold',
    'Documentation incomplete',
    'Approval hierarchy mismatch',
    'Duplicate offer',
    'Other'
  ];

  useEffect(() => {
    if (open && offerData) {
      setOfferDetails(offerData);
      fetchCandidateDetails(offerData.candidateId);
    }
  }, [open, offerData]);

  const fetchCandidateDetails = async (candidateId) => {
    setFetchingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCandidateDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching candidate details:', err);
      setError('Failed to fetch candidate details');
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setDecision('');
    setComments('');
    setRejectionReason('');
    setApprovalRating(5);
    setConfirmAction(false);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleApprove = async () => {
    if (!confirmAction) {
      setError('Please confirm your decision');
      return;
    }

    if (decision === 'reject' && !rejectionReason) {
      setError('Please select a rejection reason');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = decision === 'approve' 
        ? `${BASE_URL}/api/offers/${offer._id}/approve`
        : `${BASE_URL}/api/offers/${offer._id}/reject`;

      const response = await axios.post(
        endpoint,
        {
          comments,
          ...(decision === 'reject' && { rejectionReason }),
          ...(decision === 'approve' && { rating: approvalRating })
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(`Offer ${decision === 'approve' ? 'approved' : 'rejected'} successfully!`);
        
        if (onSubmit) {
          onSubmit(response.data.data);
        }
        
        // Close after short delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error processing decision:', err);
      setError(err.response?.data?.message || `Failed to ${decision} offer`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'default';
      case 'pending_approval': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Offer Summary Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                📋 Offer Details for Review
              </Typography>
              
              {fetchingDetails ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Candidate Info */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                      <Avatar sx={{ bgcolor: '#1976D2', width: 60, height: 60 }}>
                        {candidateDetails?.firstName?.charAt(0)}{candidateDetails?.lastName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {candidateDetails?.firstName} {candidateDetails?.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {candidateDetails?.email} | {candidateDetails?.phone}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={candidateDetails?.candidateId} 
                            size="small" 
                            variant="outlined"
                          />
                          <Chip 
                            label={candidateDetails?.status} 
                            size="small" 
                            color="success"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        Offer ID
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {offerDetails?.offerId || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        Current Status
                      </Typography>
                      <Chip
                        label={offerDetails?.status || 'Pending Approval'}
                        color={getStatusColor(offerDetails?.status)}
                        size="small"
                        sx={{ fontWeight: 500, mt: 0.5 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        Position
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {candidateDetails?.latestApplication?.jobId?.title || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        Department
                      </Typography>
                      <Typography variant="body1">
                        {candidateDetails?.latestApplication?.jobId?.department || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        Reporting To
                      </Typography>
                      <Typography variant="body1">
                        {offerDetails?.offerDetails?.reportingTo || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        Joining Date
                      </Typography>
                      <Typography variant="body1">
                        {offerDetails?.joiningDate ? formatDate(offerDetails.joiningDate) : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Paper>

            {/* Benefits & Terms Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                🎁 Benefits & Terms
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Benefits Offered
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {offerDetails?.offerDetails?.benefits?.map((benefit, index) => (
                      <Chip
                        key={index}
                        label={benefit}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    ))}
                    {(!offerDetails?.offerDetails?.benefits || offerDetails.offerDetails.benefits.length === 0) && (
                      <Typography variant="body2" color="textSecondary">No benefits added</Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                    Probation Period
                  </Typography>
                  <Typography variant="body1">
                    {offerDetails?.offerDetails?.probationPeriod || '6'} months
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                    Notice Period
                  </Typography>
                  <Typography variant="body1">
                    {offerDetails?.offerDetails?.noticePeriod || '30'} days
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            {/* CTC Verification Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                💰 Verify CTC Components
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table>
                  <TableBody>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>Component</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Monthly (₹)</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Annual (₹)</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Basic + DA</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.basic)}</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.basic * 12)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">HRA</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.hra)}</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.hra * 12)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Conveyance Allowance</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.conveyanceAllowance)}</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.conveyanceAllowance * 12)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Medical Allowance</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.medicalAllowance)}</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.medicalAllowance * 12)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Special Allowance</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.specialAllowance)}</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.specialAllowance * 12)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Bonus</TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.bonus)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Employer PF</TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.employerPf)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Employer ESI</TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.employerEsi || 0)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Gratuity</TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.gratuity)}</TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>Gross Salary</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(offerDetails?.ctcDetails?.gross)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(offerDetails?.ctcDetails?.gross * 12)}</TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ bgcolor: '#1976D2' }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 700, color: 'white' }}>TOTAL CTC</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'white' }}>-</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
                        {formatCurrency(offerDetails?.ctcDetails?.totalCtc)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Verification Checklist */}
              <Box sx={{ mt: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon fontSize="small" color="primary" />
                  Verification Checklist
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography variant="body2">Basic salary within range</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography variant="body2">HRA calculation correct</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography variant="body2">PF/ESI percentages verified</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography variant="body2">Total CTC within budget</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            {/* Decision Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                ⚖️ Make Your Decision
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
                  Select Action
                </FormLabel>
                <RadioGroup
                  row
                  value={decision}
                  onChange={(e) => {
                    setDecision(e.target.value);
                    setConfirmAction(false);
                    setError('');
                  }}
                >
                  <FormControlLabel 
                    value="approve" 
                    control={<Radio color="success" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ThumbUpIcon color="success" />
                        <Typography>Approve Offer</Typography>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="reject" 
                    control={<Radio color="error" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ThumbDownIcon color="error" />
                        <Typography>Reject Offer</Typography>
                      </Box>
                    } 
                  />
                </RadioGroup>
              </FormControl>

              {decision === 'approve' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rate this offer
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating
                      value={approvalRating}
                      onChange={(event, newValue) => setApprovalRating(newValue)}
                      size="large"
                    />
                    <Typography variant="body2" color="textSecondary">
                      ({approvalRating}/5)
                    </Typography>
                  </Box>
                </Box>
              )}

              {decision === 'reject' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rejection Reason *
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <RadioGroup
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    >
                      <Grid container spacing={1}>
                        {rejectionReasons.map((reason) => (
                          <Grid item xs={12} md={6} key={reason}>
                            <FormControlLabel 
                              value={reason} 
                              control={<Radio size="small" />} 
                              label={reason} 
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Comments */}
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                Additional Comments
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={decision === 'approve' 
                  ? "Add any approval notes or conditions..." 
                  : "Provide details for rejection..."
                }
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                sx={{ mb: 3 }}
              />

              {/* Warning Message */}
              <Box sx={{ 
                p: 2, 
                bgcolor: decision === 'approve' ? '#E8F5E9' : '#FFEBEE',
                borderRadius: 1,
                border: decision === 'approve' ? '1px solid #81C784' : '1px solid #E57373',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {decision === 'approve' ? (
                    <InfoIcon sx={{ color: '#388E3C' }} />
                  ) : (
                    <WarningIcon sx={{ color: '#D32F2F' }} />
                  )}
                  <Typography variant="subtitle2" sx={{ color: decision === 'approve' ? '#388E3C' : '#D32F2F' }}>
                    {decision === 'approve' ? 'Approval Confirmation' : 'Rejection Warning'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {decision === 'approve' 
                    ? 'Once approved, this offer will be sent to the candidate and cannot be modified.'
                    : 'Rejecting this offer will close it permanently. This action cannot be undone.'}
                </Typography>
              </Box>

              {/* Confirmation Checkbox */}
              {decision && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confirmAction}
                      onChange={(e) => setConfirmAction(e.target.checked)}
                      color={decision === 'approve' ? 'success' : 'error'}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      I confirm my decision to {decision} this offer
                    </Typography>
                  }
                />
              )}
            </Paper>
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
      PaperProps={{ sx: { borderRadius: 2 } }}
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
            {decision === 'approve' ? 'Approve Offer' : decision === 'reject' ? 'Reject Offer' : 'Review Offer'}
          </Typography>
          {offerDetails?.offerId && (
            <Typography variant="caption" color="textSecondary">
              Offer ID: {offerDetails.offerId}
            </Typography>
          )}
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
        
        {success && (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />}
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
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 2
      }}>
        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                onClick={handleApprove}
                disabled={loading || !decision || !confirmAction || (decision === 'reject' && !rejectionReason)}
                startIcon={loading ? <CircularProgress size={20} /> : (decision === 'approve' ? <CheckCircleIcon /> : <CancelIcon />)}
                sx={{
                  backgroundColor: decision === 'approve' ? '#2E7D32' : '#D32F2F',
                  '&:hover': { 
                    backgroundColor: decision === 'approve' ? '#1B5E20' : '#C62828' 
                  },
                  minWidth: 200
                }}
              >
                {loading ? 'Processing...' : `${decision === 'approve' ? 'Approve' : 'Reject'} Offer`}
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
        </Box>

        {/* Summary Footer */}
        {offerDetails?.ctcDetails && (
          <Box sx={{ 
            p: 1.5, 
            bgcolor: '#FFFFFF', 
            borderRadius: 1,
            border: '1px solid #E0E0E0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" color="textSecondary">
              Total CTC:
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1976D2' }}>
              {formatCurrency(offerDetails.ctcDetails.totalCtc)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Monthly Gross: {formatCurrency(offerDetails.ctcDetails.gross)}
            </Typography>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ApproveOffer;