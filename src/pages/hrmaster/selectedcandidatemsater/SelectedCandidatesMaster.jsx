import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  Snackbar,
  TablePagination,
  Stack,
  alpha,
  Alert,
  Chip,
  Avatar,
  LinearProgress,
  Grid,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';

// Import management components
import OfferManagement from './offer/OfferManagement';
import DocumentManagement from './documents/DocumentManagement';
import BGVManagement from './BGV/BGVManagement';

// Placeholder for Onboarding component
const OnboardingManagement = () => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h6" color="textSecondary" gutterBottom>
      Onboarding Management
    </Typography>
    <Typography variant="body2" color="textSecondary">
      This module is under development. It will manage candidate onboarding processes including:
    </Typography>
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Chip label="Employee Statutory Documents" />
      <Chip label="Orientation" />
      <Chip label="Completion Details" />
      <Chip label="Verification" />
    </Box>
  </Box>
);

// Color constants - matching the header gradient
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a';

// Status color mapping
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return { bg: '#d1fae5', color: '#065f46', label: 'Completed', icon: <CheckCircleIcon /> };
    case 'in progress':
    case 'in_progress':
      return { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: <AccessTimeIcon /> };
    case 'not started':
      return { bg: '#f1f5f9', color: '#475569', label: 'Not Started', icon: <InfoIcon /> };
    default:
      return { bg: '#f1f5f9', color: '#475569', label: status || 'Unknown', icon: <InfoIcon /> };
  }
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`candidate-tabpanel-${index}`}
      aria-labelledby={`candidate-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `candidate-tab-${index}`,
    'aria-controls': `candidate-tabpanel-${index}`,
  };
}

const SelectedCandidatesMaster = () => {
  const [tabValue, setTabValue] = useState(1); // Start with Offer Management (index 1)
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Mock data for the overview table
  const [candidates] = useState([
    {
      id: 1,
      email: 'softcrowdtest011@gmail.com',
      employeeId: '-',
      status: 'In Progress',
      progress: 65,
      joiningDate: '-'
    }
  ]);

  // Stats data for different tabs
  const onboardingStats = {
    total: 3,
    notStarted: 0,
    inProgress: 3,
    completed: 0
  };

  const documentStats = {
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  };

  const bgvStats = {
    total: 6,
    pending: 0,
    inProgress: 0,
    completed: 6
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    showNotification('Data refreshed successfully', 'success');
  };

  const handleExport = () => {
    showNotification('Export functionality coming soon', 'info');
  };

  const handleActions = () => {
    showNotification('Actions menu coming soon', 'info');
  };

  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          fontWeight="600" 
          sx={{ 
            color: TEXT_COLOR_MAIN,
            background: HEADER_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}
        >
          Selected Candidates Master
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          Manage selected candidates through offer, document, BGV, and onboarding processes
        </Typography>
      </Box>

      {/* Tabs with integrated stats */}
      <Paper sx={{ 
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="candidate management tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: 48,
                minWidth: 120
              },
              '& .Mui-selected': {
                color: PRIMARY_BLUE,
                fontWeight: 600
              },
              '& .MuiTabs-indicator': {
                backgroundColor: PRIMARY_BLUE
              }
            }}
          >
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Overview</span>
                </Stack>
              } 
              {...a11yProps(0)} 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Offer Management</span>
                </Stack>
              } 
              {...a11yProps(1)} 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Documents</span>
                  <Chip 
                    label={documentStats.total} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.75rem',
                      bgcolor: alpha(PRIMARY_BLUE, 0.1),
                      color: PRIMARY_BLUE
                    }} 
                  />
                </Stack>
              } 
              {...a11yProps(2)} 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>BGV</span>
                  <Chip 
                    label={bgvStats.total} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.75rem',
                      bgcolor: alpha(PRIMARY_BLUE, 0.1),
                      color: PRIMARY_BLUE
                    }} 
                  />
                </Stack>
              } 
              {...a11yProps(3)} 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Onboarding</span>
                  <Chip 
                    label={onboardingStats.total} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.75rem',
                      bgcolor: alpha(PRIMARY_BLUE, 0.1),
                      color: PRIMARY_BLUE
                    }} 
                  />
                </Stack>
              } 
              {...a11yProps(4)} 
            />
          </Tabs>
        </Box>

        {/* Stats Section based on active tab */}
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          {/* {tabValue === 0 && (
            <Stack 
              direction="row" 
              spacing={4} 
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ justifyContent: 'center' }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {onboardingStats.total}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  TOTAL ONBOARDING
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {onboardingStats.notStarted}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  NOT STARTED
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {onboardingStats.inProgress}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  IN PROGRESS
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {onboardingStats.completed}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  COMPLETED
                </Typography>
              </Box>
            </Stack>
          )} */}

          {/* {tabValue === 2 && (
            <Stack 
              direction="row" 
              spacing={4} 
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ justifyContent: 'center' }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {documentStats.total}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  Total Documents
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {documentStats.verified}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  Verified
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {documentStats.pending}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  Pending
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {documentStats.rejected}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  Rejected
                </Typography>
              </Box>
            </Stack>
          )} */}

          {/* {tabValue === 3 && (
            <Stack 
              direction="row" 
              spacing={4} 
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ justifyContent: 'center' }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {bgvStats.total}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  Total Verifications
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {bgvStats.pending}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  Pending
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {bgvStats.inProgress}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  In Progress
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  {bgvStats.completed}
                </Typography>
                <Typography variant="caption" color="#64748B">
                  Completed
                </Typography>
              </Box>
            </Stack>
          )} */}
        </Box>

        {/* Action Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            {/* Search */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <TextField
                placeholder="Search candidates..."
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ 
                  width: { xs: '100%', sm: 300 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '&:hover fieldset': {
                      borderColor: PRIMARY_BLUE,
                    },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748B' }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    height: 40,
                    bgcolor: '#f8fafc',
                    '& input': {
                      padding: '8px 12px',
                      fontSize: '0.875rem'
                    }
                  }
                }}
              />
              
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={handleRefresh}
                  sx={{ 
                    color: '#64748B',
                    '&:hover': {
                      bgcolor: alpha(PRIMARY_BLUE, 0.1),
                      color: PRIMARY_BLUE
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                sx={{ 
                  height: 40,
                  borderRadius: 1.5,
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: PRIMARY_BLUE,
                    bgcolor: alpha(PRIMARY_BLUE, 0.04)
                  }
                }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<MoreVertIcon />}
                onClick={handleActions}
                sx={{ 
                  height: 40,
                  borderRadius: 1.5,
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: PRIMARY_BLUE,
                    bgcolor: alpha(PRIMARY_BLUE, 0.04)
                  }
                }}
              >
                Actions
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          {/* Candidates Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: HEADER_GRADIENT,
                  '& .MuiTableCell-root': {
                    borderBottom: 'none',
                    color: TEXT_COLOR_HEADER,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 2
                  }
                }}>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Joining Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => {
                  const statusStyle = getStatusColor(candidate.status);

                  return (
                    <TableRow
                      key={candidate.id}
                      hover
                      sx={{ 
                        '&:hover': {
                          bgcolor: '#f8fafc'
                        }
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: PRIMARY_BLUE,
                              fontSize: '0.875rem'
                            }}
                          >
                            {candidate.email.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {candidate.email}
                            </Typography>
                            <Typography variant="caption" color="#64748B">
                              Candidate
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#64748B">
                          {candidate.employeeId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusStyle.icon}
                          label={statusStyle.label}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 500,
                            minWidth: 90
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 120 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={candidate.progress} 
                            sx={{ 
                              width: 80, 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: '#E0E0E0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: PRIMARY_BLUE
                              }
                            }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {candidate.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {candidate.joiningDate}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Actions">
                          <IconButton
                            size="small"
                            sx={{
                              color: '#64748b',
                              '&:hover': {
                                bgcolor: alpha(PRIMARY_BLUE, 0.1)
                              }
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Offer Management Tab */}
        <TabPanel value={tabValue} index={1}>
          <OfferManagement />
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={2}>
          <DocumentManagement />
        </TabPanel>

        {/* BGV Tab */}
        <TabPanel value={tabValue} index={3}>
          <BGVManagement />
        </TabPanel>

        {/* Onboarding Tab */}
        <TabPanel value={tabValue} index={4}>
          <OnboardingManagement />
        </TabPanel>
      </Paper>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SelectedCandidatesMaster;