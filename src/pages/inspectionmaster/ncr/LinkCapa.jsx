// LinkCapa.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Box,
  IconButton,
  Divider,
  Card,
  CardContent,
  Tooltip,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Radio,
  RadioGroup,
  FormControlLabel,
  Fade
} from '@mui/material';
import {
  Close as CloseIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  Verified as VerifiedIcon,
  Cancel as CancelIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E6F4F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

const steps = ['Select CAPA', 'Review & Confirm'];

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const LinkCapa = ({ open, onClose, ncrId, ncrNumber, severity, systemicFailure, onCapaLinked }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const [capaList, setCapaList] = useState([]);
  const [filteredCapaList, setFilteredCapaList] = useState([]);
  const [selectedCapa, setSelectedCapa] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ncrDetails, setNcrDetails] = useState(null);

  useEffect(() => {
    if (open && ncrId) {
      fetchNcrDetails();
      fetchCapaList();
    }
  }, [open, ncrId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = capaList.filter(capa =>
        capa.capa_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        capa.problem_statement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        capa.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCapaList(filtered);
    } else {
      setFilteredCapaList(capaList);
    }
  }, [searchTerm, capaList]);

  const fetchNcrDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNcrDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching NCR details:', err);
    }
  };

  const fetchCapaList = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/capas?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter CAPAs that are not already linked to an NCR or are in Open/Under Review status
        const availableCapas = response.data.data.filter(capa => 
          !capa.ncr_id || capa.status === 'Open' || capa.status === 'Under Review'
        );
        setCapaList(availableCapas);
        setFilteredCapaList(availableCapas);
      }
    } catch (err) {
      console.error('Error fetching CAPA list:', err);
      setError('Failed to load CAPA list');
    } finally {
      setFetching(false);
    }
  };

  const handleSelectCapa = (capa) => {
    setSelectedCapa(capa);
    setError('');
  };

  const handleNext = () => {
    if (!selectedCapa) {
      setError('Please select a CAPA to link');
      return;
    }
    setError('');
    setActiveStep(1);
  };

  const handleBack = () => {
    setActiveStep(0);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedCapa) {
      setError('Please select a CAPA to link');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/ncrs/${ncrId}/link-capa/${selectedCapa._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSuccess(`CAPA ${response.data.data.capa_id} linked successfully to ${response.data.data.ncr_number}`);
        if (onCapaLinked) {
          onCapaLinked(response.data.data);
        }
        // Close after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to link CAPA');
      }
    } catch (err) {
      console.error('Error linking CAPA:', err);
      setError(err.response?.data?.message || 'Failed to link CAPA');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCapa(null);
    setSearchTerm('');
    setError('');
    setSuccess('');
    setActiveStep(0);
    onClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': COLORS.info,
      'In Progress': COLORS.warning,
      'Under Review': COLORS.info,
      'Effectiveness Under Review': COLORS.warning,
      'Closed': COLORS.success,
      'Overdue': COLORS.error
    };
    return colors[status] || COLORS.text.tertiary;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Closed':
        return <VerifiedIcon sx={{ fontSize: '0.8rem' }} />;
      case 'Overdue':
        return <ErrorIcon sx={{ fontSize: '0.8rem' }} />;
      default:
        return <BuildIcon sx={{ fontSize: '0.8rem' }} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const requiresCAPALink = () => {
    return (severity === 'Critical' || severity === 'Major') && systemicFailure === true;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* Info Banner */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: requiresCAPALink() ? COLORS.primaryLight : COLORS.background.light, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: requiresCAPALink() ? COLORS.primary : COLORS.text.secondary, 
                mb: 1 
              }}>
                <LinkIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Link CAPA to NCR
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                {requiresCAPALink() 
                  ? `This NCR requires CAPA linkage because it has ${severity} severity and systemic failure is true. Select an existing CAPA or create a new one.`
                  : `Linking a CAPA is optional for this NCR. You can link an existing CAPA or skip this step.`}
              </Typography>
              {requiresCAPALink() && (
                <Chip 
                  icon={<WarningIcon sx={{ fontSize: '0.7rem' }} />}
                  label="CAPA Required"
                  size="small"
                  sx={{ 
                    mt: 1, 
                    fontSize: '0.65rem', 
                    height: 24,
                    bgcolor: `${COLORS.error}20`,
                    color: COLORS.error
                  }}
                />
              )}
            </Paper>

            {/* Search Bar */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search CAPA by ID, problem statement, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            {/* CAPA List */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                Available CAPA Records
              </Typography>
              
              {fetching ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                </Box>
              ) : filteredCapaList.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AssignmentIcon sx={{ fontSize: '3rem', color: COLORS.text.tertiary, mb: 1 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    {capaList.length === 0 
                      ? 'No CAPA records available. Please create a CAPA first.'
                      : 'No matching CAPA records found.'}
                  </Typography>
                  {capaList.length === 0 && (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2, fontSize: '0.7rem' }}
                      onClick={() => {
                        // Navigate to create CAPA - implement based on your routing
                        window.location.href = '/capas/create';
                      }}
                    >
                      Create New CAPA
                    </Button>
                  )}
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {filteredCapaList.map((capa, index) => (
                    <React.Fragment key={capa._id}>
                      <ListItem
                        sx={{
                          borderRadius: 1.5,
                          mb: 1,
                          cursor: 'pointer',
                          border: `1px solid ${selectedCapa?._id === capa._id ? COLORS.primary : COLORS.border}`,
                          bgcolor: selectedCapa?._id === capa._id ? `${COLORS.primary}05` : COLORS.background.white,
                          '&:hover': { bgcolor: `${COLORS.primary}05` }
                        }}
                        onClick={() => handleSelectCapa(capa)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getStatusColor(capa.status), width: 36, height: 36 }}>
                            {getStatusIcon(capa.status)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'monospace' }}>
                                {capa.capa_id}
                              </Typography>
                              <Chip 
                                label={capa.status} 
                                size="small" 
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 20,
                                  bgcolor: `${getStatusColor(capa.status)}20`,
                                  color: getStatusColor(capa.status)
                                }} 
                              />
                              <Chip 
                                label={capa.capa_type} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.6rem', height: 20 }} 
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                                {capa.problem_statement?.substring(0, 100)}...
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <CalendarIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                    Created: {formatDate(capa.capa_date)}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PersonIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                    {capa.created_by?.Username || 'System'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Radio
                            checked={selectedCapa?._id === capa._id}
                            onChange={() => handleSelectCapa(capa)}
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < filteredCapaList.length - 1 && <Divider sx={{ my: 0.5 }} />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>

            {/* Create New CAPA Button */}
            <Button
              variant="outlined"
              fullWidth
              size="small"
              startIcon={<BuildIcon sx={{ fontSize: '0.8rem' }} />}
              onClick={() => {
                // Navigate to create CAPA with NCR context
                window.location.href = `/capas/create?ncrId=${ncrId}&ncrNumber=${ncrNumber}`;
              }}
              sx={{
                height: 36,
                borderRadius: 1.5,
                borderColor: COLORS.primary,
                color: COLORS.primary,
                fontSize: '0.7rem',
                textTransform: 'none',
                '&:hover': {
                  borderColor: COLORS.primaryDark,
                  bgcolor: `${COLORS.primary}10`
                }
              }}
            >
              Create New CAPA
            </Button>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Review Summary */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Confirm CAPA Link
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Please review the CAPA details before linking to this NCR.
              </Typography>
            </Paper>

            {/* NCR Summary */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1.5, color: COLORS.primary }}>
                  NCR Information
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>NCR Number</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                      {ncrNumber || ncrDetails?.ncr_number}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Severity</Typography>
                    <Chip 
                      label={severity || ncrDetails?.severity} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24,
                        bgcolor: severity === 'Critical' ? `${COLORS.error}20` : severity === 'Major' ? `${COLORS.warning}20` : `${COLORS.success}20`,
                        color: severity === 'Critical' ? COLORS.error : severity === 'Major' ? COLORS.warning : COLORS.success
                      }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Systemic Failure</Typography>
                    <Chip 
                      label={systemicFailure ? 'Yes - Recurring Issue' : 'No - One-time Occurrence'} 
                      size="small" 
                      color={systemicFailure ? 'warning' : 'success'}
                      sx={{ fontSize: '0.65rem', height: 22 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Selected CAPA Summary */}
            {selectedCapa && (
              <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1.5, color: COLORS.primary }}>
                    CAPA Information
                  </Typography>
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>CAPA ID</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                      {selectedCapa.capa_id}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Problem Statement</Typography>
                    <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>
                        {selectedCapa.problem_statement || '-'}
                      </Typography>
                    </Paper>
                  </Box>
                  
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>CAPA Type</Typography>
                      <Chip 
                        label={selectedCapa.capa_type} 
                        size="small" 
                        sx={{ mt: 0.5, fontSize: '0.65rem' }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Status</Typography>
                      <Chip 
                        label={selectedCapa.status} 
                        size="small" 
                        sx={{ 
                          mt: 0.5, 
                          fontSize: '0.65rem',
                          bgcolor: `${getStatusColor(selectedCapa.status)}20`,
                          color: getStatusColor(selectedCapa.status)
                        }} 
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Target Close Date</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {formatDate(selectedCapa.target_close_date)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Created By</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {selectedCapa.created_by?.Username || 'System'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Warning Message */}
            {requiresCAPALink() && (
              <Alert 
                severity="warning" 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  After linking this CAPA, the NCR status will change to 'CAPA Initiated'.
                </Typography>
              </Alert>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.7rem',
      color: COLORS.text.secondary
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: COLORS.primary,
      fontSize: '0.7rem'
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Link CAPA to NCR
          </Typography>
          {ncrNumber && (
            <Chip 
              label={ncrNumber} 
              size="small" 
              sx={{ 
                fontSize: '0.65rem', 
                height: 22, 
                bgcolor: COLORS.primaryLight, 
                color: COLORS.primary,
                ml: 1
              }} 
            />
          )}
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: COLORS.text.tertiary,
            '&:hover': { color: COLORS.text.secondary }
          }}
        >
          <CloseIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
        
        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 1.5,
              mt: 2,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              borderRadius: 1.5,
              mt: 2,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {success}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          size="small"
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Back
        </Button>

        <Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{
              height: 32,
              px: 2,
              mr: 1,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Cancel
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !selectedCapa}
              startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <LinkIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark },
                '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
              }}
            >
              {loading ? 'Linking...' : 'Link CAPA'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedCapa}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark },
                '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
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

export default LinkCapa;