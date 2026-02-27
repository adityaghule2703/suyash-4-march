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
  Tabs,
  Tab,
  Alert,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  DateRange as DateRangeIcon,
  People as PeopleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Visibility as VisibilityIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { formatDistanceToNow, format } from 'date-fns';

/* ------------------- Tab Panel Component ------------------- */
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`job-tabpanel-${index}`}
      aria-labelledby={`job-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

/* ------------------- Status Chip Component ------------------- */
const StatusChip = ({ status }) => {
  const statusConfig = {
    open: { color: 'success', icon: <CheckCircleOutlineIcon />, label: 'Open', bgcolor: '#4caf50' },
    draft: { color: 'default', icon: <VisibilityIcon />, label: 'Draft', bgcolor: '#e0e0e0' },
    published: { color: 'success', icon: <CheckCircleOutlineIcon />, label: 'Published', bgcolor: '#4caf50' },
    closed: { color: 'error', icon: <CloseIcon />, label: 'Closed', bgcolor: '#f44336' },
    pending: { color: 'warning', icon: <VisibilityIcon />, label: 'Pending', bgcolor: '#ff9800' }
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
        '& .MuiChip-icon': { color: '#fff' }
      }}
    />
  );
};

const ViewJobOpening = ({ open, onClose, job, onEdit }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [departmentNames, setDepartmentNames] = useState({});
  const [requisitionDetails, setRequisitionDetails] = useState(null);

  useEffect(() => {
    if (job?.requisitionId?._id) {
      fetchDepartmentDetails();
      fetchRequisitionDetails();
    }
  }, [job]);

  const fetchDepartmentDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 100
        }
      });

      if (response.data.success) {
        const departments = response.data.data || [];
        const nameMap = {};
        departments.forEach(dept => {
          nameMap[dept._id] = dept.DepartmentName;
        });
        setDepartmentNames(nameMap);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequisitionDetails = async () => {
    if (!job?.requisitionId?._id) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/requisitions/${job.requisitionId._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setRequisitionDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching requisition details:', err);
    }
  };

  if (!job) return null;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP');
  };

  const getPlatformIcon = (platform) => {
    switch(platform?.toLowerCase()) {
      case 'linkedin':
        return <LinkedInIcon fontSize="small" />;
      case 'naukri':
        return <LanguageIcon fontSize="small" />;
      case 'careerpage':
        return <BusinessIcon fontSize="small" />;
      default:
        return <LanguageIcon fontSize="small" />;
    }
  };

  const getPlatformStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'published':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: 500 }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #164e63, #00B4D8)',
        color: '#fff',
        fontWeight: 600,
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WorkIcon /> Job Details
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Job Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
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

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Requisition Details" />
            <Tab label="Publishing Status" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Company Intro */}
                {job.companyIntro && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Company Introduction
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                      <Typography>{job.companyIntro}</Typography>
                    </Paper>
                  </Box>
                )}

                {/* Job Description */}
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Job Description
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography>{job.description}</Typography>
                  </Paper>
                </Box>

                {/* Requirements */}
                {job.requirements?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Requirements
                    </Typography>
                    <List dense>
                      {job.requirements?.map((req, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={req} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Responsibilities */}
                {job.responsibilities?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Responsibilities
                    </Typography>
                    <List dense>
                      {job.responsibilities?.map((resp, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={resp} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                {/* Quick Info Card */}
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Quick Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><LocationIcon fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Location" secondary={job.location || '-'} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Department" secondary={job.department || '-'} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><WorkIcon fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Employment Type" secondary={job.employmentType || '-'} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><DateRangeIcon fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary="Experience" 
                          secondary={job.experienceRequired ? 
                            `${job.experienceRequired.min} - ${job.experienceRequired.max} years` : '-'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><MoneyIcon fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary="Salary" 
                          secondary={job.salaryRange ? 
                            `${job.salaryRange.currency || ''} ${job.salaryRange.min?.toLocaleString() || ''} - ${job.salaryRange.max?.toLocaleString() || ''}` : '-'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary="Applications" 
                          secondary={job.applicationCount || job.totalApplications || 0} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                {/* Skills Card */}
                {job.skills?.length > 0 && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Required Skills
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {job.skills?.map((skill, idx) => (
                          <Chip key={idx} label={skill} icon={<BuildIcon />} variant="outlined" size="small" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Education Card */}
                {job.education?.length > 0 && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Education
                      </Typography>
                      <List dense>
                        {job.education?.map((edu, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon><SchoolIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary={edu} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Requisition Details Tab */}
        <TabPanel value={tabValue} index={1}>
          {job.requisitionId ? (
            requisitionDetails ? (
              <Stack spacing={3}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {requisitionDetails.positionTitle || requisitionDetails.jobTitle || 'Requisition'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Requisition ID: {requisitionDetails.requisitionId || job.requisitionNumber}
                      </Typography>
                    </Box>
                    <StatusChip status={requisitionDetails.status} />
                  </Stack>
                </Paper>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Department</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {departmentNames[requisitionDetails.department] || requisitionDetails.department || job.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Location</Typography>
                    <Typography variant="body1" fontWeight={500}>{requisitionDetails.location || job.location || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Employment Type</Typography>
                    <Typography variant="body1" fontWeight={500}>{requisitionDetails.employmentType || job.employmentType || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Number of Positions</Typography>
                    <Typography variant="body1" fontWeight={500}>{requisitionDetails.noOfPositions || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Target Hire Date</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {requisitionDetails.targetHireDate ? formatDate(requisitionDetails.targetHireDate) : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Priority</Typography>
                    {requisitionDetails.priority ? (
                      <Chip 
                        size="small" 
                        label={requisitionDetails.priority} 
                        color={requisitionDetails.priority === 'High' ? 'error' : 'default'}
                      />
                    ) : '-'}
                  </Grid>
                </Grid>

                {/* Education */}
                {requisitionDetails.education && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Education Required
                    </Typography>
                    <Typography>{requisitionDetails.education}</Typography>
                  </Box>
                )}

                {/* Skills */}
                {requisitionDetails.skills?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Required Skills
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {requisitionDetails.skills?.map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Justification */}
                {requisitionDetails.justification && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Justification
                    </Typography>
                    <Typography variant="body2">{requisitionDetails.justification}</Typography>
                  </Box>
                )}
              </Stack>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={40} />
              </Box>
            )
          ) : (
            <Alert severity="info">No requisition linked to this job</Alert>
          )}
        </TabPanel>

        {/* Publishing Status Tab */}
        <TabPanel value={tabValue} index={2}>
          <Stack spacing={2}>
            {job.publishTo?.length > 0 ? (
              job.publishTo.map((platform, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#f0f0f0', width: 32, height: 32 }}>
                        {getPlatformIcon(platform.platform)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" textTransform="capitalize">
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
                      />
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
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        pb: 3,
        borderTop: '1px solid #E0E0E0',
        pt: 2,
        backgroundColor: '#F8FAFC',
        gap: 1
      }}>
        <Button
          variant="outlined"
          onClick={onClose}
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onEdit();
            onClose();
          }}
          startIcon={<EditIcon />}
          sx={{
            background: 'linear-gradient(135deg, #164e63, #00B4D8)',
            '&:hover': { opacity: 0.9 }
          }}
        >
          Edit Job
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewJobOpening;