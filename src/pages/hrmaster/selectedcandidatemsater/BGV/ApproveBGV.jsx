import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Grid, Box, Paper, Chip,
  Alert, CircularProgress, IconButton, Avatar,
  Stepper, Step, StepLabel, TextField, Divider
} from '@mui/material';
import {
  Close as CloseIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon,
  Warning as WarningIcon, Security as SecurityIcon, ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon, Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const CHECK_TYPES = [
  { type: 'identity', label: 'Identity', icon: <SecurityIcon />, color: '#1976D2' },
  { type: 'address', label: 'Address', icon: <SecurityIcon />, color: '#2E7D32' },
  { type: 'education', label: 'Education', icon: <SecurityIcon />, color: '#7B1FA2' },
  { type: 'employment', label: 'Employment', icon: <SecurityIcon />, color: '#F57C00' },
  { type: 'criminal', label: 'Criminal', icon: <SecurityIcon />, color: '#C62828' }
];

const getStatusStyle = (status) => ({
  cleared: { bg: '#d1fae5', color: '#065f46', label: 'Cleared' },
  pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  failed: { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
  completed: { bg: '#d1fae5', color: '#065f46', label: 'Completed' }
}[status?.toLowerCase()] || { bg: '#f1f5f9', color: '#475569', label: status || 'Unknown' });

const ApproveBGV = ({ open, onClose, onSubmit, bgvData, bgvId }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(!bgvData && bgvId);
  const [submitting, setSubmitting] = useState(false);
  const [bgv, setBgv] = useState(bgvData || null);
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState('approve');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open && !bgvData && bgvId) fetchBGV();
    else setBgv(bgvData);
  }, [open, bgvData, bgvId]);

  const fetchBGV = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/bgv/${bgvId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data.success) setBgv(data.data);
      else setError('Failed to fetch BGV details');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch BGV details');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !remarks.trim()) {
      setError('Please add remarks');
      return;
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleReset = () => {
    setStep(0);
    setRemarks('');
    setDecision('approve');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!remarks.trim()) {
      setError('Please add remarks');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/bgv/${bgvId}/decision`,
        { decision, remarks: remarks.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (data.success) {
        setSuccess(`BGV ${decision}ed successfully!`);
        onSubmit?.(data.data);
        setTimeout(handleClose, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${decision} BGV`);
    } finally {
      setSubmitting(false);
    }
  };

  const candidate = bgv?.candidateId || bgv?.candidate;
  const candidateName = candidate?.fullName || 
    `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim() || 'N/A';
  const initials = candidateName !== 'N/A' ? candidateName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: '#E0E0E0', bgcolor: '#F8FAFC', px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {decision === 'approve' ? 'Approve' : 'Reject'} BGV
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Review and make decision
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, px: 3 }}>
        {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {['Review', 'Remarks', 'Confirm'].map(label => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : !bgv ? (
          <Alert severity="info">No BGV data found</Alert>
        ) : (
          <Box>
            {step === 0 && (
              <Stack spacing={3}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={10}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#00B4D8' }}>{initials}</Avatar>
                    <Box>
                      <Typography variant="body1">{candidateName}</Typography>
                      <Typography variant="caption" color="textSecondary">{candidate?.email}</Typography>
                    </Box>
                  </Box>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">BGV ID</Typography>
                      <Typography variant="body1" fontWeight={600}>{bgv.bgvId || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Status</Typography>
                      <Chip label={bgv.status} size="small" sx={getStatusStyle(bgv.status)} />
                    </Grid>
                    
                  {/* <Typography variant="caption" color="textSecondary">Vendor</Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{bgv.vendor || 'Authbridge'}</Typography> */}
                  </Grid>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Verification Checks</Typography>
                  <Stack spacing={1}>
                    {CHECK_TYPES.map(check => {
                      const c = bgv.checks?.find(c => c.type === check.type);
                      const status = getStatusStyle(c?.status || 'pending');
                      return (
                        <Box key={check.type}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ color: check.color, display: 'flex', alignItems: 'center' }}>{check.icon}</Box>
                              <Typography variant="body2">{check.label}</Typography>
                            </Box>
                            <Chip label={status.label} size="small" sx={status} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Stack>
            )}

            {step === 1 && (
              <Paper >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Add Remarks</Typography>
                <TextField fullWidth multiline rows={2} label="Remarks *" value={remarks}
                  onChange={e => setRemarks(e.target.value)} sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button fullWidth variant={decision === 'approve' ? 'contained' : 'outlined'}
                      color="success" startIcon={<ThumbUpIcon />} onClick={() => setDecision('approve')}>
                      Approve
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button fullWidth variant={decision === 'reject' ? 'contained' : 'outlined'}
                      color="error" startIcon={<ThumbDownIcon />} onClick={() => setDecision('reject')}>
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {step === 2 && (
              <Paper >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirm Decision</Typography>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', mb: 2 }}>
                  <Grid container spacing={10}>
                    <Grid item xs={12}><Typography variant="caption">BGV ID</Typography><Typography>{bgv.bgvId}</Typography></Grid>
                    <Grid item xs={12}><Typography variant="caption">Candidate</Typography><Typography>{candidateName}</Typography></Grid>
                    <Grid item xs={12}><Typography variant="caption" sx={{marginRight: "15px"}}>Decision</Typography>
                      <Chip icon={decision === 'approve' ? <CheckCircleIcon /> : <CancelIcon />}
                        label={decision === 'approve' ? 'Approve' : 'Reject'} color={decision === 'approve' ? 'success' : 'error'} />
                    </Grid>
                    <Grid item xs={12}><Typography variant="caption">Remarks</Typography><Paper sx={{ p: 1, bgcolor: '#FFF' , gap: 2}}>{remarks}</Paper></Grid>
                  </Grid>
                </Paper>
                <Alert severity={decision === 'approve' ? 'warning' : 'error'} icon={<WarningIcon />}>
                  This action cannot be undone.
                </Alert>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: '#E0E0E0', bgcolor: '#F8FAFC', justifyContent: 'space-between' }}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Box>
          <Button disabled={step === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
          {step === 2 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !remarks}
              startIcon={submitting ? <CircularProgress size={20} /> : (decision === 'approve' ? <ThumbUpIcon /> : <ThumbDownIcon />)}
              color={decision === 'approve' ? 'success' : 'error'}
              sx={{ minWidth: 120 }}
            >
              {submitting ? 'Processing...' : (decision === 'approve' ? 'Approve' : 'Reject')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={step === 0 && !bgv}
              sx={{
                background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                '&:hover': { background: 'linear-gradient(135deg, #0e3b4a, #0096b4)' }
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

export default ApproveBGV;