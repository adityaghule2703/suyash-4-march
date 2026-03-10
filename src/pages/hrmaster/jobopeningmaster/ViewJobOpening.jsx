import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Divider,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Card,
  CardContent,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Alert,
  IconButton,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  DateRange as DateRangeIcon,
  People as PeopleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Visibility as VisibilityIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Launch as LaunchIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Publish as PublishIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { formatDistanceToNow, format } from 'date-fns';

/* ------------------- Custom Stepper Styling ------------------- */
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    height: 4,
    border: 0,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  '&.Mui-active .MuiStepConnector-line': {
    background: 'linear-gradient(90deg, #164e63, #00B4D8)',
  },
  '&.Mui-completed .MuiStepConnector-line': {
    background: 'linear-gradient(90deg, #164e63, #00B4D8)',
  },
}));

// Custom Step Icon
const StepIcon = ({ active, completed, icon }) => {
  const getIcon = () => {
    if (icon === 1) return <InfoIcon fontSize="small" />;
    if (icon === 2) return <AssignmentIcon fontSize="small" />;
    if (icon === 3) return <PublishIcon fontSize="small" />;
    return icon;
  };

  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: completed || active ? '#1976D2' : '#E0E0E0',
        color: completed || active ? 'white' : '#9E9E9E',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 0 0 3px rgba(25, 118, 210, 0.2)' : 'none',
        '& svg': {
          fontSize: 18
        }
      }}
    >
      {completed ? <CheckCircleIcon fontSize="small" /> : getIcon()}
    </Box>
  );
};

const steps = ["Overview", "Requisition Details", "Publishing Status"];

/* ------------------- Status Chip Component ------------------- */
const StatusChip = ({ status }) => {
  const statusConfig = {
    open: { color: 'success', icon: <CheckCircleOutlineIcon />, label: 'Open', bgcolor: '#4caf50' },
    draft: { color: 'default', icon: <VisibilityIcon />, label: 'Draft', bgcolor: '#e0e0e0' },
    published: { color: 'success', icon: <CheckCircleOutlineIcon />, label: 'Published', bgcolor: '#4caf50' },
    closed: { color: 'error', icon: <CloseIcon />, label: 'Closed', bgcolor: '#f44336' },
    pending: { color: 'warning', icon: <ScheduleIcon />, label: 'Pending', bgcolor: '#ff9800' },
    in_progress: { color: 'info', icon: <ScheduleIcon />, label: 'In Progress', bgcolor: '#2196f3' }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;

  return (
    <Chip
      size="small"
      icon={config.icon}
      label={config.label}
      sx={{
        backgroundColor: config.bgcolor,
        color: '#fff',
        fontWeight: 500,
        '& .MuiChip-icon': { color: '#fff' }
      }}
    />
  );
};

/* ------------------- Priority Chip Component ------------------- */
const PriorityChip = ({ priority }) => {
  const priorityConfig = {
    high: { color: 'error', bgcolor: '#f44336', label: 'High' },
    medium: { color: 'warning', bgcolor: '#ff9800', label: 'Medium' },
    low: { color: 'info', bgcolor: '#2196f3', label: 'Low' }
  };

  const config = priorityConfig[priority?.toLowerCase()] || { color: 'default', bgcolor: '#e0e0e0', label: priority || 'Not Set' };

  return (
    <Chip
      size="small"
      label={config.label}
      sx={{
        backgroundColor: config.bgcolor,
        color: '#fff',
        fontWeight: 500
      }}
    />
  );
};

const ViewJobOpening = ({ open, onClose, jobId, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (open && jobId) {
      fetchJobDetails();
    }
  }, [open, jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setJob(response.data.data);
      } else {
        setError('Failed to fetch job details');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError(err.response?.data?.message || 'Failed to fetch job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP p');
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'linkedin':
        return <LinkedInIcon fontSize="small" />;
      case 'naukri':
        return <LanguageIcon fontSize="small" />;
      case 'careerpage':
        return <BusinessIcon fontSize="small" />;
      case 'indeed':
        return <WorkIcon fontSize="small" />;
      case 'monster':
        return <LanguageIcon fontSize="small" />;
      default:
        return <LanguageIcon fontSize="small" />;
    }
  };

  const getPlatformStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'default';
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
  };

  const handleClose = () => {
    setActiveStep(0);
    setJob(null);
    setError('');
    onClose();
  };

  const handleEditClick = () => {
    onEdit(job);
    handleClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ py: 1 }}>
            {/* Company Introduction Section */}
            {job.companyIntro && (
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      bgcolor: '#eef2ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <BusinessIcon sx={{ color: '#164e63', fontSize: 18 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a', letterSpacing: '-0.01em' }}>
                    Company Introduction
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#334155' }}>
                    {job.companyIntro}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Job Description Section */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    bgcolor: '#eef2ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <WorkIcon sx={{ color: '#164e63', fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a', letterSpacing: '-0.01em' }}>
                  Job Description
                </Typography>
              </Box>
              <Box sx={{ ml: 4 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#334155' }}>
                  {job.description}
                </Typography>
              </Box>
            </Box>

            {/* Quick Information Grid */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    bgcolor: '#eef2ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <InfoIcon sx={{ color: '#164e63', fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a' }}>
                  Quick Information
                </Typography>
              </Box>
              <Box sx={{ ml: 4 }}>
                <Grid container spacing={2}  >
                  {/* Location */}
                  <Grid item xs={12} sm={6} lg={4} >
                    <Box sx={{ mr: "100px" }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ color: '#ef6c00', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
                          {job.location || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Department */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={{ mr: "100px" }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Department
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: '#7b1fa2', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
                          {job.department || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Employment Type */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={{ mr: "80px" }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Employment Type
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
                          {job.employmentType || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Salary */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box >
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Salary Range
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon sx={{ color: '#ed6c02', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
                          {job.salaryRange ?
                            `${job.salaryRange.currency || 'INR'} ${job.salaryRange.min?.toLocaleString() || 0} - ${job.salaryRange.max?.toLocaleString() || 0}` : '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Experience */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={{ mr: "50px" }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Experience Required
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DateRangeIcon sx={{ color: '#d32f2f', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
                          {job.experienceRequired ?
                            `${job.experienceRequired.min} - ${job.experienceRequired.max} years` : '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>



                  {/* Applications */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={{ mr: "70px" }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Total Applications
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon sx={{ color: '#0288d1', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
                          {job.totalApplications || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Views */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={{ mr: "150px" }}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Views
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VisibilityIcon sx={{ color: '#9c27b0', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
                          {job.views || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Job ID */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Job ID
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon sx={{ color: '#164e63', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#164e63', fontFamily: 'monospace' }}>
                          {job.jobId}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Requirements Section */}
            {job.requirements?.length > 0 && (
              <Box sx={{ mb: 4, mt:4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      bgcolor: '#e8f5e9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#2e7d32' }}>
                    Requirements
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
                    {job.requirements.length} {job.requirements.length === 1 ? 'item' : 'items'}
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {job.requirements?.map((req, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        {/* <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '4px',
                            bgcolor: '#e8f5e9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: '2px'
                          }}
                        >
                          {/* <CheckCircleOutlineIcon sx={{ color: '#2e7d32', fontSize: 12 }} /> 
                        </Box> */}
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
                          {req}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Responsibilities Section */}
            {job.responsibilities?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      bgcolor: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AssignmentIcon sx={{ color: '#1976d2', fontSize: 18 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1976d2' }}>
                    Responsibilities
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
                    {job.responsibilities.length} {job.responsibilities.length === 1 ? 'item' : 'items'}
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {job.responsibilities?.map((resp, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        {/* <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '4px',
                            bgcolor: '#e3f2fd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: '2px'
                          }}
                        >
                          <CheckCircleOutlineIcon sx={{ color: '#1976d2', fontSize: 12 }} />
                        </Box> */}
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
                          {resp}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Skills Section */}
            {job.skills?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      bgcolor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <BuildIcon sx={{ color: '#475569', fontSize: 18 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a' }}>
                    Required Skills
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
                    {job.skills.length} {job.skills.length === 1 ? 'skill' : 'skills'}
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.skills?.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="small"
                        sx={{
                          bgcolor: '#f1f5f9',
                          color: '#1e293b',
                          fontWeight: 500,
                          borderRadius: '6px',
                          '&:hover': { bgcolor: '#e2e8f0' }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Education Section */}
            {job.education?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      bgcolor: '#eef2ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SchoolIcon sx={{ color: '#164e63', fontSize: 18 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a' }}>
                    Education
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {job.education?.map((edu, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '6px',
                            bgcolor: '#eef2ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <SchoolIcon sx={{ color: '#164e63', fontSize: 14 }} />
                        </Box> */}
                        <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                          {edu}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Created By Section */}
            <Box sx={{ mt: 4, bgcolor: '#f8fafc', p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    bgcolor: '#f3e8ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PersonIcon sx={{ color: '#7b1fa2', fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#7b1fa2' }}>
                  Created By
                </Typography>
              </Box>
              <Box sx={{ ml: 4 }}>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: '#7b1fa2',
                      width: 30,
                      height: 30,
                      fontSize: '18px',
                      fontWeight: 600
                    }}
                  >
                    {job.createdByName?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b' }}>
                      {job.createdByName || 'Unknown'}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScheduleIcon sx={{ color: '#64748b', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {formatDateTime(job.createdAt)}
                        </Typography>
                      </Box>
                      {job.updatedAt && job.updatedAt !== job.createdAt && (
                        <>
                          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EditIcon sx={{ color: '#64748b', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Updated: {formatDateTime(job.updatedAt)}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <>
            {job.requisitionId ? (
              <Stack spacing={3}>
                {/* Requisition Header */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {job.requisitionId.positionTitle || job.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Requisition ID: {job.requisitionId.requisitionId || job.requisitionNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <StatusChip status={job.requisitionId.status} />
                      {job.requisitionId.priority && (
                        <PriorityChip priority={job.requisitionId.priority} />
                      )}
                    </Box>
                  </Stack>
                </Paper>

                {/* Requisition Details Grid */}
                <Grid container spacing={4} >
                  <Grid item xs={12} sm={6} >
                    <Typography variant="body2" color="textSecondary">Department</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.department || job.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Location</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.location || job.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Employment Type</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.employmentType || job.employmentType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Number of Positions</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.noOfPositions || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Target Hire Date</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.targetHireDate ? formatDate(job.requisitionId.targetHireDate) : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Experience Required</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.experienceYears ? `${job.requisitionId.experienceYears} years` : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Budget Range</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.budgetMin && job.requisitionId.budgetMax ?
                        `${job.salaryRange?.currency || 'INR'} ${job.requisitionId.budgetMin?.toLocaleString()} - ${job.requisitionId.budgetMax?.toLocaleString()}` : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Grade</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.grade || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Reason for Hire</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.reasonForHire || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Hired Positions</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {job.requisitionId.hiredPositions || 0}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Education */}
                {job.requisitionId.education && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Education Required
                    </Typography>
                    <Typography variant="body2">{job.requisitionId.education}</Typography>
                  </Box>
                )}

                {/* Skills */}
                {job.requisitionId.skills?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Required Skills
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {job.requisitionId.skills?.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Justification */}
                {job.requisitionId.justification && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Justification
                    </Typography>
                    <Typography variant="body2">{job.requisitionId.justification}</Typography>
                  </Box>
                )}

                {/* Approval Information */}
                {job.requisitionId.approvalDate && (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Approval Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary">Approved By</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {job.requisitionId.approvedByName || 'Unknown'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary">Approval Date</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDateTime(job.requisitionId.approvalDate)}
                        </Typography>
                      </Grid>
                      {job.requisitionId.approvalSignature && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="textSecondary">Approval Signature</Typography>
                          <Box sx={{ mt: 1 }}>
                            <img
                              src={`${BASE_URL}${job.requisitionId.approvalSignature}`}
                              alt="Approval Signature"
                              style={{ maxHeight: '60px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                            />
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                )}

                {/* Created By Info */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Requisition Created By
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#7B1FA2', width: 40, height: 40 }}>
                      {job.requisitionId.createdByName?.[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {job.requisitionId.createdByName || 'Unknown'}
                        {job.requisitionId.createdByRole && ` (${job.requisitionId.createdByRole})`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Created: {formatDateTime(job.requisitionId.createdAt)}
                      </Typography>
                      {job.requisitionId.updatedAt && (
                        <Typography variant="caption" color="textSecondary" display="block">
                          Updated: {formatDateTime(job.requisitionId.updatedAt)}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            ) : (
              <Alert severity="info">No requisition linked to this job</Alert>
            )}
          </>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {job.publishTo?.length > 0 ? (
              job.publishTo.map((platform, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#f0f0f0', width: 36, height: 36 }}>
                        {getPlatformIcon(platform.platform)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" textTransform="capitalize" fontWeight={600}>
                          {platform.platform}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Job ID: {job.jobId}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={platform.status}
                        color={getPlatformStatusColor(platform.status)}
                        sx={{ fontWeight: 500 }}
                      />
                      {platform.retryCount > 0 && (
                        <Chip
                          size="small"
                          label={`Retry: ${platform.retryCount}`}
                          variant="outlined"

                        />
                      )}
                    </Stack>
                  </Stack>
                  {platform.errorMessage && (
                    <Alert severity="error" sx={{ mt: 1 }}>{platform.errorMessage}</Alert>
                  )}
                </Paper>
              ))
            ) : (
              <Alert severity="info">This job has not been published yet</Alert>
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
      PaperProps={{
        sx: { borderRadius: 2, minHeight: 500 }
      }}
    >
      {/* Attractive Header */}
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #164e63, #00B4D8)',
        color: '#fff',
        fontWeight: 600,
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon /> Job Details
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#fff' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Loading State */}
      {loading ? (
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress size={40} sx={{ color: '#1976D2' }} />
        </DialogContent>
      ) : error ? (
        <DialogContent>
          <Alert
            severity="error"
            sx={{ borderRadius: 1 }}
            action={
              <Button color="inherit" size="small" onClick={fetchJobDetails}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </DialogContent>
      ) : job ? (
        <>
          {/* Job Header */}
          {/* <Box sx={{ px: 3, pt: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {job.jobId} • Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              <StatusChip status={job.status} />
            </Stack>
          </Box> */}

          {/* Modern Stepper */}
          <Box sx={{ px: 2, pt: 2 }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={StepIcon}>
                    <Typography fontWeight={500}>{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <DialogContent sx={{ pt: 2, pb: 2, backgroundColor: '#F5F7FA' }}>
            <Box sx={{ py: 1 }}>
              {getStepContent(activeStep)}
            </Box>
          </DialogContent>

          <DialogActions sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid #E0E0E0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  startIcon={<NavigateBeforeIcon />}
                  sx={{ color: '#666' }}
                >
                  Back
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<NavigateNextIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleReset}
                  sx={{
                    background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  View from Start
                </Button>
              )}

              {/* <Button
                variant="contained"
                onClick={handleEditClick}
                startIcon={<EditIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                  '&:hover': { opacity: 0.9 },
                  ml: 1
                }}
              >
                Edit Job
              </Button> */}
            </Box>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default ViewJobOpening;