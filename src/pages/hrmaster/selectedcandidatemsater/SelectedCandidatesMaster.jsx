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
  Tab,
  Tabs,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  HowToReg as HowToRegIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

// Import management components
import OfferManagement from './offer/OfferManagenent';
import DocumentManagement from './documents/DocumentManagement';
import BGVManagement from './BGV/BGVManagement';
import AppointmentManagement from './appointment/AppointmentManagement';
import OnboardingManagement from './onboarding/OnboardingManagement';

// Color constants - matching the header gradient
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a';

// Tab configurations with icons and colors
const TABS = [
  { value: 'offer', label: 'Offer Management', icon: <WorkIcon />, color: '#1976D2', component: OfferManagement },
  { value: 'documents', label: 'Documents', icon: <DescriptionIcon />, color: '#7B1FA2', component: DocumentManagement },
  { value: 'bgv', label: 'BGV', icon: <SecurityIcon />, color: '#E65100', component: BGVManagement },
  // { value: 'appointment', label: 'Appointment', icon: <CalendarIcon />, color: '#2E7D32', component: AppointmentManagement },
  // { value: 'onboarding', label: 'Onboarding', icon: <HowToRegIcon />, color: '#00B4D8', component: OnboardingManagement }
];

// Status color mapping
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return { bg: '#d1fae5', color: '#065f46', label: 'Completed', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> };
    case 'in progress':
    case 'in_progress':
      return { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: <AccessTimeIcon sx={{ fontSize: 14 }} /> };
    case 'not started':
      return { bg: '#f1f5f9', color: '#475569', label: 'Not Started', icon: <InfoIcon sx={{ fontSize: 14 }} /> };
    default:
      return { bg: '#f1f5f9', color: '#475569', label: status || 'Unknown', icon: <InfoIcon sx={{ fontSize: 14 }} /> };
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

const SelectedCandidatesMaster = () => {
  const [tabValue, setTabValue] = useState(0); // Start with Offer Management (index 0)
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data for the overview table (if needed in future)
  const [candidates] = useState([
    {
      id: 1,
      email: 'softcrowdtest011@gmail.com',
      employeeId: '-',
      status: 'In Progress',
      progress: 65,
      joiningDate: '-',
      name: 'John Doe',
      position: 'Software Engineer'
    }
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
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
          Manage selected candidates through offer, document, BGV, appointment, and onboarding processes
        </Typography>
      </Box>

      {/* Tabs with Requisition Master Style */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#64748B',
              '&.Mui-selected': {
                color: PRIMARY_BLUE,
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: PRIMARY_BLUE,
              height: 3
            }
          }}
        >
          {TABS.map((tab, index) => (
            <Tab
              key={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 18,
                  color: tab.color || 'inherit'
                }
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {TABS.map((tab, index) => (
        <TabPanel key={tab.value} value={tabValue} index={index}>
          {tab.component()}
        </TabPanel>
      ))}

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