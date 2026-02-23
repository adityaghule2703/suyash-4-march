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
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Checkbox,
  Card,
  CardContent,
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  VerifiedUser as VerifiedUserIcon,
  Security as SecurityIcon,
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
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';


const ApproveBGV = ({ open, onClose, onSubmit, bgvData = null, bgvId = null }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bgvDetails, setBgvDetails] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [decision, setDecision] = useState(''); // 'approve' or 'reject'
  const [remarks, setRemarks] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [confirmAction, setConfirmAction] = useState(false);
  const [expandedCheck, setExpandedCheck] = useState(null);

  const steps = [
    'Review BGV',
    'Verify Checks',
    'Decision'
  ];

  const rejectionOptions = [
    'Identity mismatch',
    'Address verification failed',
    'Educational documents not verified',
    'Employment history discrepancy',
    'Criminal record found',
    'Reference check failed',
    'Documentation incomplete',
    'Other'
  ];

  useEffect(() => {
    if (open && bgvId) {
      fetchBGVDetails(bgvId);
    } else if (open && bgvData) {
      setBgvDetails(bgvData);
    }
  }, [open, bgvId, bgvData]);

  const fetchBGVDetails = async (id) => {
    setFetching(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/bgv/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setBgvDetails(response.data.data);
      } else {
        setError('Failed to fetch BGV details');
      }
    } catch (err) {
      console.error('Error fetching BGV details:', err);
      setError(err.response?.data?.message || 'Failed to fetch BGV details');
    } finally {
      setFetching(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 2 && !decision) {
      setError('Please select a decision');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setDecision('');
    setRemarks('');
    setRejectionReasons([]);
    setConfirmAction(false);
    setExpandedCheck(null);
  };

  const handleClose = () => {
    handleReset();
    setBgvDetails(null);
    setError('');
    setSuccess('');
    onClose();
  };

  const handleDecisionChange = (event) => {
    setDecision(event.target.value);
    setConfirmAction(false);
    setError('');
  };

  const handleRejectionReasonToggle = (reason) => {
    setRejectionReasons(prev => 
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmitDecision = async () => {
    if (!decision) {
      setError('Please select a decision');
      return;
    }

    if (decision === 'reject' && rejectionReasons.length === 0) {
      setError('Please select at least one rejection reason');
      return;
    }

    if (!confirmAction) {
      setError('Please confirm your decision');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/bgv/${bgvDetails._id}/decision`,
        {
          decision: decision === 'approve' ? 'approve' : 'reject',
          remarks: remarks || (decision === 'reject' ? rejectionReasons.join(', ') : ''),
          rejectionReasons: decision === 'reject' ? rejectionReasons : undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(response.data.message || `BGV ${decision}ed successfully!`);
        
        if (onSubmit) {
          onSubmit(response.data.data);
        }
        
        // Auto close after success
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting decision:', err);
      setError(err.response?.data?.message || `Failed to ${decision} BGV`);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: '#f1f5f9', color: '#475569', icon: <AccessTimeIcon /> };
      case 'in_progress':
      case 'in progress':
        return { bg: '#fef3c7', color: '#92400e', icon: <RefreshIcon /> };
      case 'completed':
      case 'cleared':
        return { bg: '#d1fae5', color: '#065f46', icon: <CheckCircleIcon /> };
      case 'failed':
      case 'discrepancy':
        return { bg: '#fee2e2', color: '#991b1b', icon: <ErrorIcon /> };
      default:
        return { bg: '#f1f5f9', color: '#475569', icon: <InfoIcon /> };
    }
  };

  const getOverallProgress = () => {
    if (!bgvDetails?.checks) return 0;
    const completed = bgvDetails.checks.filter(c => 
      c.status?.toLowerCase() === 'completed' || 
      c.status?.toLowerCase() === 'cleared'
    ).length;
    return Math.round((completed / bgvDetails.checks.length) * 100);
  };

  const toggleCheckExpand = (checkId) => {
    setExpandedCheck(expandedCheck === checkId ? null : checkId);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* BGV Summary Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                📋 BGV Summary
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#1976D2', width: 56, height: 56 }}>
                      {bgvDetails?.candidate?.fullName?.charAt(0) || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {bgvDetails?.candidate?.fullName || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {bgvDetails?.candidate?.email} • {bgvDetails?.candidate?.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        BGV ID
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {bgvDetails?.bgvId || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Offer ID
                      </Typography>
                      <Typography variant="body2">
                        {bgvDetails?.offer?.offerId || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Vendor
                      </Typography>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {bgvDetails?.vendor || 'AuthBridge'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Initiated On
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(bgvDetails?.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Progress Card */}
            <Paper sx={{ p: 3, bgcolor: '#F8FAFC' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2">Verification Progress</Typography>
                <Chip
                  label={`${getOverallProgress()}% Complete`}
                  size="small"
                  color={getOverallProgress() === 100 ? 'success' : 'primary'}
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getOverallProgress()} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Total Checks
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {bgvDetails?.checks?.length || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Completed
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#2E7D32">
                    {bgvDetails?.checks?.filter(c => 
                      c.status?.toLowerCase() === 'completed' || 
                      c.status?.toLowerCase() === 'cleared'
                    ).length || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Pending
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#F57C00">
                    {bgvDetails?.checks?.filter(c => 
                      c.status?.toLowerCase() === 'pending' || 
                      c.status?.toLowerCase() === 'in_progress'
                    ).length || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Current Status Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                📊 Current Status
              </Typography>

              <Box sx={{ 
                p: 2, 
                bgcolor: bgvDetails?.status === 'completed' ? '#E8F5E9' :
                         bgvDetails?.status === 'in_progress' ? '#FFF3E0' :
                         bgvDetails?.status === 'pending' ? '#F8FAFC' : '#FFEBEE',
                borderRadius: 1,
                border: `1px solid ${
                  bgvDetails?.status === 'completed' ? '#81C784' :
                  bgvDetails?.status === 'in_progress' ? '#FFB74D' :
                  bgvDetails?.status === 'pending' ? '#E0E0E0' : '#E57373'
                }`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {bgvDetails?.status === 'completed' && <CheckCircleIcon sx={{ color: '#388E3C' }} />}
                  {bgvDetails?.status === 'in_progress' && <RefreshIcon sx={{ color: '#F57C00' }} />}
                  {bgvDetails?.status === 'pending' && <AccessTimeIcon sx={{ color: '#757575' }} />}
                  {bgvDetails?.status === 'failed' && <ErrorIcon sx={{ color: '#D32F2F' }} />}
                  
                  <Box>
                    <Typography variant="subtitle1" sx={{ 
                      color: bgvDetails?.status === 'completed' ? '#388E3C' :
                             bgvDetails?.status === 'in_progress' ? '#F57C00' :
                             bgvDetails?.status === 'pending' ? '#757575' : '#D32F2F',
                      textTransform: 'capitalize'
                    }}>
                      {bgvDetails?.status} {bgvDetails?.status === 'completed' && '✓'}
                    </Typography>
                    {bgvDetails?.completedAt && (
                      <Typography variant="caption" color="textSecondary">
                        Completed on: {formatDate(bgvDetails.completedAt)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            {/* Verification Checks Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                🔍 Detailed Verification Checks
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    {bgvDetails?.checks?.map((check) => {
                      const statusStyle = getStatusColor(check.status);
                      const isExpanded = expandedCheck === check._id;

                      return (
                        <React.Fragment key={check._id}>
                          <TableRow 
                            hover 
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': { bgcolor: '#F5F9FF' }
                            }}
                            onClick={() => toggleCheckExpand(check._id)}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {check.type === 'identity' && <FingerprintIcon color="primary" />}
                                {check.type === 'address' && <HomeIcon color="primary" />}
                                {check.type === 'education' && <SchoolIcon color="primary" />}
                                {check.type === 'employment' && <WorkIcon color="primary" />}
                                {check.type === 'criminal' && <GavelIcon color="primary" />}
                                {check.type === 'reference' && <PersonIcon color="primary" />}
                                {check.type === 'drug' && <WarningIcon color="primary" />}
                                {check.type === 'credit' && <BusinessIcon color="primary" />}
                                
                                <Box>
                                  <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                                    {check.type} Verification
                                  </Typography>
                                  {check.verifiedBy && (
                                    <Typography variant="caption" color="textSecondary">
                                      Verified by: {check.verifiedBy}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            
                            <TableCell align="center">
                              <Chip
                                size="small"
                                icon={statusStyle.icon}
                                label={check.status}
                                sx={{ 
                                  bgcolor: statusStyle.bg,
                                  color: statusStyle.color,
                                  fontWeight: 500,
                                  minWidth: 90,
                                  textTransform: 'capitalize'
                                }}
                              />
                            </TableCell>
                            
                            <TableCell align="right">
                              <Typography variant="caption" color="textSecondary">
                                {check.completedAt ? formatDate(check.completedAt) : 
                                 check.startedAt ? 'In Progress' : 'Not Started'}
                              </Typography>
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={3} sx={{ bgcolor: '#F8FAFC', py: 2 }}>
                                <Box sx={{ p: 2 }}>
                                  <Grid container spacing={2}>
                                    {/* Check Details */}
                                    {check.verifiedDetails && (
                                      <Grid item xs={12}>
                                        <Typography variant="subtitle2" gutterBottom>
                                          Verification Details
                                        </Typography>
                                        <Typography variant="body2">
                                          {check.verifiedDetails}
                                        </Typography>
                                      </Grid>
                                    )}

                                    {/* Documents */}
                                    {check.documents && check.documents.length > 0 && (
                                      <Grid item xs={12}>
                                        <Typography variant="subtitle2" gutterBottom>
                                          Supporting Documents
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                          {check.documents.map((doc, idx) => (
                                            <Chip
                                              key={idx}
                                              icon={<DescriptionIcon />}
                                              label={doc.name || `Document ${idx + 1}`}
                                              variant="outlined"
                                              onClick={() => window.open(doc.url, '_blank')}
                                            />
                                          ))}
                                        </Box>
                                      </Grid>
                                    )}

                                    {/* Remarks */}
                                    {check.remarks && (
                                      <Grid item xs={12}>
                                        <Typography variant="subtitle2" gutterBottom>
                                          Remarks
                                        </Typography>
                                        <Alert severity="info" icon={<InfoIcon />}>
                                          {check.remarks}
                                        </Alert>
                                      </Grid>
                                    )}

                                    {/* Timeline */}
                                    <Grid item xs={12}>
                                      <Typography variant="subtitle2" gutterBottom>
                                        Timeline
                                      </Typography>
                                      <Box sx={{ display: 'flex', gap: 3 }}>
                                        {check.startedAt && (
                                          <Box>
                                            <Typography variant="caption" color="textSecondary">
                                              Started
                                            </Typography>
                                            <Typography variant="body2">
                                              {formatDate(check.startedAt)}
                                            </Typography>
                                          </Box>
                                        )}
                                        {check.completedAt && (
                                          <Box>
                                            <Typography variant="caption" color="textSecondary">
                                              Completed
                                            </Typography>
                                            <Typography variant="body2">
                                              {formatDate(check.completedAt)}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Verification Summary */}
            <Paper sx={{ p: 3, bgcolor: '#F8FAFC' }}>
              <Typography variant="subtitle2" gutterBottom>
                Verification Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">
                      {bgvDetails?.checks?.filter(c => 
                        c.status?.toLowerCase() === 'completed' || 
                        c.status?.toLowerCase() === 'cleared'
                      ).length} checks cleared
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="warning" />
                    <Typography variant="body2">
                      {bgvDetails?.checks?.filter(c => 
                        c.status?.toLowerCase() === 'pending'
                      ).length} checks pending
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            {/* Decision Card */}
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1976D2' }}>
                ⚖️ Make Decision
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
                  Select Action
                </FormLabel>
                <RadioGroup
                  value={decision}
                  onChange={handleDecisionChange}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper
                        sx={{
                          p: 2,
                          border: decision === 'approve' ? '2px solid #2E7D32' : '1px solid #E0E0E0',
                          borderRadius: 2,
                          cursor: 'pointer',
                          bgcolor: decision === 'approve' ? '#E8F5E9' : '#FFFFFF',
                          '&:hover': {
                            borderColor: '#2E7D32',
                            bgcolor: '#F1F8E9'
                          }
                        }}
                        onClick={() => setDecision('approve')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            p: 1, 
                            borderRadius: '50%', 
                            bgcolor: decision === 'approve' ? '#2E7D32' : '#F5F5F5',
                            color: decision === 'approve' ? '#FFFFFF' : '#757575'
                          }}>
                            <ThumbUpIcon />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Approve BGV
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              All checks cleared, candidate verified
                            </Typography>
                          </Box>
                          <Radio 
                            value="approve" 
                            checked={decision === 'approve'}
                            sx={{ color: '#2E7D32' }}
                          />
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        sx={{
                          p: 2,
                          border: decision === 'reject' ? '2px solid #D32F2F' : '1px solid #E0E0E0',
                          borderRadius: 2,
                          cursor: 'pointer',
                          bgcolor: decision === 'reject' ? '#FFEBEE' : '#FFFFFF',
                          '&:hover': {
                            borderColor: '#D32F2F',
                            bgcolor: '#FFEBEE'
                          }
                        }}
                        onClick={() => setDecision('reject')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            p: 1, 
                            borderRadius: '50%', 
                            bgcolor: decision === 'reject' ? '#D32F2F' : '#F5F5F5',
                            color: decision === 'reject' ? '#FFFFFF' : '#757575'
                          }}>
                            <ThumbDownIcon />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Reject BGV
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Verification failed, discrepancies found
                            </Typography>
                          </Box>
                          <Radio 
                            value="reject" 
                            checked={decision === 'reject'}
                            sx={{ color: '#D32F2F' }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>

              {decision === 'reject' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rejection Reasons *
                  </Typography>
                  <Grid container spacing={1}>
                    {rejectionOptions.map((reason) => (
                      <Grid item xs={12} md={6} key={reason}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rejectionReasons.includes(reason)}
                              onChange={() => handleRejectionReasonToggle(reason)}
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2">{reason}</Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Remarks */}
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                {decision === 'approve' ? 'Approval Remarks' : 'Rejection Remarks'}
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={decision === 'approve' 
                  ? "Add any approval notes or conditions..." 
                  : "Provide detailed reason for rejection..."
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
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
                    ? 'Once approved, this BGV will be marked as completed and the candidate can proceed with onboarding.'
                    : 'Rejecting this BGV will flag the candidate as verification failed. This action cannot be undone.'}
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
                      I confirm my decision to {decision} this background verification
                    </Typography>
                  }
                />
              )}
            </Paper>

            {/* Summary Card */}
            <Paper sx={{ p: 2, bgcolor: '#F8FAFC' }}>
              <Typography variant="subtitle2" gutterBottom>
                Decision Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Candidate
                  </Typography>
                  <Typography variant="body2">
                    {bgvDetails?.candidate?.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    BGV ID
                  </Typography>
                  <Typography variant="body2">
                    {bgvDetails?.bgvId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Total Checks
                  </Typography>
                  <Typography variant="body2">
                    {bgvDetails?.checks?.length || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Completed
                  </Typography>
                  <Typography variant="body2" color="#2E7D32">
                    {bgvDetails?.checks?.filter(c => 
                      c.status?.toLowerCase() === 'completed' || 
                      c.status?.toLowerCase() === 'cleared'
                    ).length || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      default:
        return 'Unknown step';
    }
  };

  if (fetching) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, flexDirection: 'column', gap: 2 }}>
            <CircularProgress />
            <Typography color="textSecondary">Loading BGV details...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, minHeight: '80vh' } }}
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
            Approve/Reject Background Verification
          </Typography>
          {bgvDetails?.bgvId && (
            <Typography variant="caption" color="textSecondary">
              BGV ID: {bgvDetails.bgvId} • Candidate: {bgvDetails?.candidate?.fullName}
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
              onClick={handleSubmitDecision}
              disabled={submitting || !decision || (decision === 'reject' && rejectionReasons.length === 0) || !confirmAction}
              startIcon={submitting ? <CircularProgress size={20} /> : (decision === 'approve' ? <CheckCircleIcon /> : <CancelIcon />)}
              sx={{
                backgroundColor: decision === 'approve' ? '#2E7D32' : '#D32F2F',
                '&:hover': { 
                  backgroundColor: decision === 'approve' ? '#1B5E20' : '#C62828' 
                },
                minWidth: 200
              }}
            >
              {submitting ? 'Processing...' : `${decision === 'approve' ? 'Approve' : 'Reject'} BGV`}
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

export default ApproveBGV;