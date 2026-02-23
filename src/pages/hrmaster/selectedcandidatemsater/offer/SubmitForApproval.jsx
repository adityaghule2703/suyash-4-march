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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const SubmitForApproval = ({ open, onClose, onSubmit, offerData = null }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const steps = [
    'Offer Summary',
    'CTC Breakdown',
    'Terms & Confirmation'
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
    setRemarks('');
    setConfirmSubmit(false);
  };

  const handleClose = () => {
    setActiveStep(0);
    setRemarks('');
    setConfirmSubmit(false);
    setError('');
    setSuccess('');
    onClose();
  };

  const handleSubmitForApproval = async () => {
    if (!confirmSubmit) {
      setError('Please confirm that you want to submit this offer for approval');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/offers/${offer._id}/submit-approval?candidate_id=${candidateDetails?._id}`,
        { remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Offer submitted for approval successfully!');
        
        if (onSubmit) {
          onSubmit(response.data.data);
        }
        
        // Close after short delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting for approval:', err);
      setError(err.response?.data?.message || 'Failed to submit for approval');
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
      case 'pending': return 'warning';
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
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                📋 Offer Summary
              </Typography>
              
              {fetchingDetails ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Candidate Info */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#1976D2', width: 56, height: 56 }}>
                        {candidateDetails?.firstName?.charAt(0)}{candidateDetails?.lastName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {candidateDetails?.firstName} {candidateDetails?.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {candidateDetails?.email} | {candidateDetails?.phone}
                        </Typography>
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
                        label={offerDetails?.status || 'Draft'}
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
                      <Typography variant="body1">
                        {candidateDetails?.latestApplication?.jobId?.title || 'N/A'}
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
                        Probation Period
                      </Typography>
                      <Typography variant="body1">
                        {offerDetails?.offerDetails?.probationPeriod || 'N/A'} months
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Paper>

            {/* Benefits Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                🎁 Benefits
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                  <Typography color="textSecondary">No benefits added</Typography>
                )}
              </Box>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            {/* CTC Breakdown Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                💰 Annual CTC Breakdown
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        Basic + DA
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.basic * 12)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        HRA
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.hra * 12)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        Conveyance Allowance
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.conveyanceAllowance * 12)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        Medical Allowance
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.medicalAllowance * 12)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        Special Allowance
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.specialAllowance * 12)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        Bonus
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.bonus)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        Employer PF
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.employerPf)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        Employer ESI
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.employerEsi || 0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                        Gratuity
                      </TableCell>
                      <TableCell align="right">{formatCurrency(offerDetails?.ctcDetails?.gratuity)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        Total CTC
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1976D2' }}>
                        {formatCurrency(offerDetails?.ctcDetails?.totalCtc)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Monthly Gross: {formatCurrency(offerDetails?.ctcDetails?.gross)} | 
                  Annual Gross: {formatCurrency(offerDetails?.ctcDetails?.gross * 12)}
                </Typography>
              </Box>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            {/* Terms and Confirmation Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                📝 Terms & Conditions
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" paragraph>
                  By submitting this offer for approval, you confirm that:
                </Typography>
                
                <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
                  <li>
                    <Typography variant="body2" paragraph>
                      All the CTC components have been calculated correctly as per company policy
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      The candidate has been properly interviewed and selected for the position
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      The offer details (reporting to, probation period, etc.) have been verified with HR
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      Any special approvals required for this CTC range have been obtained
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      The joining date has been confirmed with the candidate and is feasible
                    </Typography>
                  </li>
                </ul>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Remarks */}
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                Additional Remarks (Optional)
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add any additional remarks or notes for the approver..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                sx={{ mb: 3 }}
              />

              {/* Warning Message */}
              <Box sx={{ 
                p: 2, 
                bgcolor: '#FFF4E5', 
                borderRadius: 1,
                border: '1px solid #FFB74D',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WarningIcon sx={{ color: '#F57C00' }} />
                  <Typography variant="subtitle2" sx={{ color: '#F57C00' }}>
                    Important Notice
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Once submitted, this offer will be sent to the approver and cannot be modified until reviewed. 
                  Please ensure all details are accurate before proceeding.
                </Typography>
              </Box>

              {/* Confirmation Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmSubmit}
                    onChange={(e) => setConfirmSubmit(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    I confirm that all the above information is accurate and I understand that this action cannot be undone.
                  </Typography>
                }
              />
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
            Submit Offer for Approval
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
                onClick={handleSubmitForApproval}
                disabled={loading || !confirmSubmit}
                startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{
                  backgroundColor: '#1976D2',
                  '&:hover': { backgroundColor: '#1565C0' },
                  minWidth: 200
                }}
              >
                {loading ? 'Submitting...' : 'Submit for Approval'}
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

        {/* Review Summary */}
        {activeStep === steps.length - 1 && (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#E3F2FD', 
            borderRadius: 1,
            border: '1px solid #90CAF9'
          }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  Total CTC
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1976D2' }}>
                  {formatCurrency(offerDetails?.ctcDetails?.totalCtc)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  Monthly Gross
                </Typography>
                <Typography variant="subtitle1" fontWeight={600}>
                  {formatCurrency(offerDetails?.ctcDetails?.gross)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubmitForApproval;