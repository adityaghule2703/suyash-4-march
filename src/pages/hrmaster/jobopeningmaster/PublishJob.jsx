// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Alert,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
//   styled,
//   StepConnector,
//   Grid,
//   Avatar,
//   Tooltip,
//   Box,
//   Typography,
//   Chip,
//   Paper,
//   LinearProgress,
//   Link,
//   IconButton,
//   FormHelperText,
//   Card,
//   CardContent
// } from '@mui/material';
// import {
//   Publish as PublishIcon,
//   CheckCircle as CheckCircleIcon,
//   Error as ErrorIcon,
//   Info as InfoIcon,
//   Schedule as ScheduleIcon,
//   LinkedIn as LinkedInIcon,
//   Language as LanguageIcon,
//   Business as BusinessIcon,
//   Work as WorkIcon,
//   Launch as LaunchIcon,
//   ContentCopy as CopyIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// /* ------------------- Custom Stepper Styling ------------------- */
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   '& .MuiStepConnector-line': {
//     height: 4,
//     border: 0,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//   },
//   '&.Mui-active .MuiStepConnector-line': {
//     background: 'linear-gradient(90deg, #164e63, #00B4D8)',
//   },
//   '&.Mui-completed .MuiStepConnector-line': {
//     background: 'linear-gradient(90deg, #164e63, #00B4D8)',
//   },
// }));

// const steps = ["Select Platforms", "Publishing", "Results"];

// /* ------------------- Platform Card Component ------------------- */
// const PlatformCard = ({ platform, selected, onToggle, disabled }) => {
//   const getPlatformIcon = (platform) => {
//     switch(platform) {
//       case 'linkedin':
//         return <LinkedInIcon sx={{ fontSize: 40, color: '#0077b5' }} />;
//       case 'naukri':
//         return <LanguageIcon sx={{ fontSize: 40, color: '#ff5722' }} />;
//       case 'careerPage':
//         return <BusinessIcon sx={{ fontSize: 40, color: '#164e63' }} />;
//       case 'indeed':
//         return <WorkIcon sx={{ fontSize: 40, color: '#003a9b' }} />;
//       default:
//         return <LanguageIcon sx={{ fontSize: 40 }} />;
//     }
//   };

//   const getPlatformName = (platform) => {
//     const names = {
//       linkedin: 'LinkedIn',
//       naukri: 'Naukri.com',
//       careerPage: 'Career Page',
//       indeed: 'Indeed'
//     };
//     return names[platform] || platform;
//   };

//   return (
//     <Paper
//       variant="outlined"
//       sx={{
//         p: 2,
//         cursor: disabled ? 'not-allowed' : 'pointer',
//         opacity: disabled ? 0.5 : 1,
//         border: selected ? '2px solid #00B4D8' : '1px solid #e0e0e0',
//         bgcolor: selected ? '#e6f7ff' : 'white',
//         transition: 'all 0.2s',
//         '&:hover': disabled ? {} : {
//           borderColor: '#00B4D8',
//           boxShadow: '0 4px 12px rgba(0,180,216,0.1)'
//         }
//       }}
//       onClick={() => !disabled && onToggle(platform)}
//     >
//       <Stack spacing={2} alignItems="center">
//         {getPlatformIcon(platform)}
//         <Typography variant="subtitle2" fontWeight={600}>
//           {getPlatformName(platform)}
//         </Typography>
//         {selected && (
//           <Chip
//             size="small"
//             icon={<CheckCircleIcon />}
//             label="Selected"
//             color="success"
//             variant="outlined"
//           />
//         )}
//       </Stack>
//     </Paper>
//   );
// };

// /* ------------------- Publishing Status Component ------------------- */
// const PublishingStatus = ({ platform, status, result, error }) => {
//   const getPlatformIcon = (platform) => {
//     switch(platform) {
//       case 'linkedin':
//         return <LinkedInIcon fontSize="small" />;
//       case 'naukri':
//         return <LanguageIcon fontSize="small" />;
//       case 'careerPage':
//         return <BusinessIcon fontSize="small" />;
//       case 'indeed':
//         return <WorkIcon fontSize="small" />;
//       default:
//         return <LanguageIcon fontSize="small" />;
//     }
//   };

//   const getStatusIcon = () => {
//     switch(status) {
//       case 'pending':
//         return <ScheduleIcon color="warning" />;
//       case 'publishing':
//         return <CircularProgress size={20} />;
//       case 'success':
//         return <CheckCircleIcon color="success" />;
//       case 'failed':
//         return <ErrorIcon color="error" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <Paper variant="outlined" sx={{ p: 2 }}>
//       <Stack spacing={2}>
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Stack direction="row" spacing={1} alignItems="center">
//             <Avatar sx={{ bgcolor: '#f0f0f0', width: 32, height: 32 }}>
//               {getPlatformIcon(platform)}
//             </Avatar>
//             <Typography variant="subtitle2" textTransform="capitalize">
//               {platform === 'careerPage' ? 'Career Page' : platform}
//             </Typography>
//           </Stack>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             {getStatusIcon()}
//             <Typography variant="caption" color="textSecondary">
//               {status === 'pending' && 'Waiting to start...'}
//               {status === 'publishing' && 'Publishing...'}
//               {status === 'success' && 'Published successfully'}
//               {status === 'failed' && 'Publishing failed'}
//             </Typography>
//           </Box>
//         </Stack>

//         {status === 'publishing' && (
//           <LinearProgress sx={{ height: 4, borderRadius: 2 }} />
//         )}

//         {status === 'success' && result && (
//           <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
//             <Stack spacing={1}>
//               <Typography variant="caption" color="textSecondary">
//                 Job URL:
//               </Typography>
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <Link 
//                   href={result.jobUrl} 
//                   target="_blank" 
//                   rel="noopener"
//                   sx={{ 
//                     flex: 1,
//                     fontSize: '0.75rem',
//                     wordBreak: 'break-all'
//                   }}
//                 >
//                   {result.jobUrl}
//                 </Link>
//                 <Tooltip title="Open in new tab">
//                   <IconButton size="small" href={result.jobUrl} target="_blank">
//                     <LaunchIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Copy link">
//                   <IconButton 
//                     size="small" 
//                     onClick={() => navigator.clipboard.writeText(result.jobUrl)}
//                   >
//                     <CopyIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//               </Stack>
//             </Stack>
//           </Box>
//         )}

//         {status === 'failed' && error && (
//           <Alert severity="error" sx={{ mt: 1 }}>
//             {error}
//           </Alert>
//         )}
//       </Stack>
//     </Paper>
//   );
// };

// const PublishJob = ({ open, onClose, job, onPublish }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [selectedPlatforms, setSelectedPlatforms] = useState([]);
//   const [publishing, setPublishing] = useState(false);
//   const [publishResults, setPublishResults] = useState(null);
//   const [publishingStatus, setPublishingStatus] = useState({});
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Available platforms - exactly matching the enum in your schema
//   const availablePlatforms = [
//     { value: 'careerPage', label: 'Career Page' },
//     { value: 'linkedin', label: 'LinkedIn' },
//     { value: 'naukri', label: 'Naukri.com' },
//     { value: 'indeed', label: 'Indeed' }
//   ];

//   // Reset state when modal opens
//   useEffect(() => {
//     if (open && job) {
//       setActiveStep(0);
//       setSelectedPlatforms([]);
//       setPublishResults(null);
//       setPublishingStatus({});
//       setError('');
//       setSuccess('');
//     }
//   }, [open, job]);

//   const handlePlatformToggle = (platform) => {
//     setSelectedPlatforms(prev => {
//       if (prev.includes(platform)) {
//         return prev.filter(p => p !== platform);
//       } else {
//         return [...prev, platform];
//       }
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectedPlatforms.length === availablePlatforms.length) {
//       setSelectedPlatforms([]);
//     } else {
//       setSelectedPlatforms(availablePlatforms.map(p => p.value));
//     }
//   };

//   const validateSelection = () => {
//     if (selectedPlatforms.length === 0) {
//       setError('Please select at least one platform to publish');
//       return false;
//     }
//     return true;
//   };

//   const handleNext = () => {
//     if (activeStep === 0) {
//       if (validateSelection()) {
//         setActiveStep(1);
//         handlePublish();
//       }
//     } else {
//       setActiveStep(prev => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep(prev => prev - 1);
//   };

//   const handlePublish = async () => {
//     setPublishing(true);
//     setError('');
    
//     const initialStatus = {};
//     selectedPlatforms.forEach(platform => {
//       initialStatus[platform] = { status: 'pending' };
//     });
//     setPublishingStatus(initialStatus);
    
//     try {
//       const token = localStorage.getItem('token');
      
//       selectedPlatforms.forEach(platform => {
//         setPublishingStatus(prev => ({
//           ...prev,
//           [platform]: { status: 'publishing' }
//         }));
//       });
      
//       const response = await axios.post(`${BASE_URL}/api/jobs/${job._id}/publish`, {
//         platforms: selectedPlatforms
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.data.success) {
//         setPublishResults(response.data.data);
        
//         const updatedStatus = {};
//         response.data.data.publishResults.forEach(result => {
//           updatedStatus[result.platform] = {
//             status: result.success ? 'success' : 'failed',
//             result: result,
//             error: result.error
//           };
//         });
//         setPublishingStatus(updatedStatus);
        
//         setSuccess('Job published successfully!');
//         setActiveStep(2);
        
//         if (onPublish) {
//           onPublish(response.data.data);
//         }
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to publish job');
      
//       const failedStatus = {};
//       selectedPlatforms.forEach(platform => {
//         failedStatus[platform] = { 
//           status: 'failed',
//           error: err.response?.data?.message || 'Publishing failed'
//         };
//       });
//       setPublishingStatus(failedStatus);
//     } finally {
//       setPublishing(false);
//     }
//   };

//   const handleModalClose = () => {
//     setActiveStep(0);
//     setSelectedPlatforms([]);
//     setPublishResults(null);
//     setPublishingStatus({});
//     setError('');
//     setSuccess('');
//     onClose();
//   };

//   const getSuccessCount = () => {
//     return publishResults?.publishResults?.filter(r => r.success).length || 0;
//   };

//   if (!job) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={handleModalClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 2, minHeight: 500 }
//       }}
//     >
//       <DialogTitle sx={{
//         background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//         color: '#fff',
//         fontWeight: 600,
//         fontSize: '20px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: 1
//       }}>
//         <PublishIcon /> Publish Job Opening
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3 }}>
//         {/* Job Summary */}
//         <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
//           <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//             {job.jobId} - {job.title}
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             {job.location} • {job.department} • {job.employmentType}
//           </Typography>
//         </Paper>

//         {/* Stepper */}
//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//           sx={{ mb: 4 }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography fontWeight={500}>{label}</Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {/* Step 1: Select Platforms */}
//         {activeStep === 0 && (
//           <Stack spacing={3}>
//             <Box>
//               <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//                 <Typography variant="h6" fontWeight={600}>
//                   Select Platforms
//                 </Typography>
//                 <Button onClick={handleSelectAll} size="small">
//                   {selectedPlatforms.length === availablePlatforms.length ? 'Deselect All' : 'Select All'}
//                 </Button>
//               </Stack>

//               <Grid container spacing={2}>
//                 {availablePlatforms.map((platform) => (
//                   <Grid item xs={12} sm={6} md={3} key={platform.value}>
//                     <PlatformCard
//                       platform={platform.value}
//                       selected={selectedPlatforms.includes(platform.value)}
//                       onToggle={handlePlatformToggle}
//                       disabled={job?.status === 'published'}
//                     />
//                   </Grid>
//                 ))}
//               </Grid>

//               <FormHelperText sx={{ mt: 2 }}>
//                 Selected {selectedPlatforms.length} of {availablePlatforms.length} platforms
//               </FormHelperText>
//             </Box>

//             <Alert severity="info" icon={<InfoIcon />}>
//               <Typography variant="body2">
//                 Publishing will make this job visible on the selected platforms.
//               </Typography>
//             </Alert>
//           </Stack>
//         )}

//         {/* Step 2: Publishing */}
//         {activeStep === 1 && (
//           <Stack spacing={3}>
//             <Alert severity="info" icon={<InfoIcon />}>
//               Publishing job to selected platforms. Please do not close this window.
//             </Alert>

//             <Stack spacing={2}>
//               {selectedPlatforms.map((platform) => (
//                 <PublishingStatus
//                   key={platform}
//                   platform={platform}
//                   status={publishingStatus[platform]?.status || 'pending'}
//                   result={publishingStatus[platform]?.result}
//                   error={publishingStatus[platform]?.error}
//                 />
//               ))}
//             </Stack>

//             <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
//               <Stack spacing={1}>
//                 <Stack direction="row" justifyContent="space-between">
//                   <Typography variant="body2">Overall Progress</Typography>
//                   <Typography variant="body2" fontWeight={600}>
//                     {Object.values(publishingStatus).filter(s => s.status === 'success' || s.status === 'failed').length} / {selectedPlatforms.length}
//                   </Typography>
//                 </Stack>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={(Object.values(publishingStatus).filter(s => s.status === 'success' || s.status === 'failed').length / selectedPlatforms.length) * 100}
//                   sx={{ height: 8, borderRadius: 4 }}
//                 />
//               </Stack>
//             </Paper>
//           </Stack>
//         )}

//         {/* Step 3: Results */}
//         {activeStep === 2 && publishResults && (
//           <Stack spacing={3}>
//             <Paper 
//               sx={{ 
//                 p: 3, 
//                 textAlign: 'center',
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 color: 'white'
//               }}
//             >
//               <CheckCircleIcon sx={{ fontSize: 60, mb: 2 }} />
//               <Typography variant="h5" gutterBottom fontWeight={600}>
//                 Published Successfully!
//               </Typography>
//               <Typography variant="body1">
//                 Job has been published to {getSuccessCount()} out of {selectedPlatforms.length} platforms
//               </Typography>
//             </Paper>

//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Card variant="outlined">
//                   <CardContent>
//                     <Stack direction="row" alignItems="center" spacing={2}>
//                       <Avatar sx={{ bgcolor: '#4caf50' }}>
//                         <CheckCircleIcon />
//                       </Avatar>
//                       <Box>
//                         <Typography variant="h4" fontWeight={600}>
//                           {getSuccessCount()}
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                           Successful
//                         </Typography>
//                       </Box>
//                     </Stack>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={6}>
//                 <Card variant="outlined">
//                   <CardContent>
//                     <Stack direction="row" alignItems="center" spacing={2}>
//                       <Avatar sx={{ bgcolor: '#f44336' }}>
//                         <ErrorIcon />
//                       </Avatar>
//                       <Box>
//                         <Typography variant="h4" fontWeight={600}>
//                           {publishResults.publishResults?.filter(r => !r.success).length || 0}
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                           Failed
//                         </Typography>
//                       </Box>
//                     </Stack>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
//           </Stack>
//         )}

//         {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//         {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
//       </DialogContent>

//       <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
//         <Button onClick={handleModalClose}>
//           Cancel
//         </Button>
        
//         <Box sx={{ flex: 1 }} />
        
//         {activeStep > 0 && activeStep < 2 && (
//           <Button onClick={handleBack}>
//             Back
//           </Button>
//         )}
        
//         {activeStep < 2 ? (
//           <Button
//             variant="contained"
//             onClick={handleNext}
//             disabled={publishing || (activeStep === 0 && selectedPlatforms.length === 0)}
//             startIcon={activeStep === 1 ? <CircularProgress size={20} /> : <PublishIcon />}
//             sx={{
//               background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//               '&:hover': { opacity: 0.9 }
//             }}
//           >
//             {activeStep === 0 && 'Publish'}
//             {activeStep === 1 && 'Publishing...'}
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             onClick={handleModalClose}
//             sx={{
//               background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//               '&:hover': { opacity: 0.9 }
//             }}
//           >
//             Done
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default PublishJob;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  stepConnectorClasses,
  Grid,
  Avatar,
  Tooltip,
  Box,
  Typography,
  Chip,
  Paper,
  LinearProgress,
  Link,
  IconButton,
  FormHelperText,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Publish as PublishIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Launch as LaunchIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching other components
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// Custom Stepper Connector
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
    backgroundColor: COLORS.border,
    borderRadius: 1,
  },
}));

const steps = ["Select Platforms", "Publishing", "Results"];

/* ------------------- Platform Card Component ------------------- */
const PlatformCard = ({ platform, selected, onToggle, disabled }) => {
  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'linkedin':
        return <LinkedInIcon sx={{ fontSize: 32, color: '#0077b5' }} />;
      case 'naukri':
        return <LanguageIcon sx={{ fontSize: 32, color: '#ff5722' }} />;
      case 'careerPage':
        return <BusinessIcon sx={{ fontSize: 32, color: COLORS.primary }} />;
      case 'indeed':
        return <WorkIcon sx={{ fontSize: 32, color: '#003a9b' }} />;
      default:
        return <LanguageIcon sx={{ fontSize: 32 }} />;
    }
  };

  const getPlatformName = (platform) => {
    const names = {
      linkedin: 'LinkedIn',
      naukri: 'Naukri.com',
      careerPage: 'Career Page',
      indeed: 'Indeed'
    };
    return names[platform] || platform;
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: selected ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
        bgcolor: selected ? COLORS.primaryLight : COLORS.background.white,
        transition: 'all 0.2s',
        borderRadius: 1.5,
        '&:hover': disabled ? {} : {
          borderColor: COLORS.primary,
          boxShadow: '0 4px 12px rgba(6, 60, 63, 0.1)'
        }
      }}
      onClick={() => !disabled && onToggle(platform)}
    >
      <Stack spacing={1.5} alignItems="center">
        {getPlatformIcon(platform)}
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
          {getPlatformName(platform)}
        </Typography>
        {selected && (
          <Chip
            size="small"
            icon={<CheckCircleIcon sx={{ fontSize: '0.7rem' }} />}
            label="Selected"
            sx={{
              bgcolor: COLORS.status.success,
              color: COLORS.primaryDark,
              fontSize: '0.6rem',
              height: 22,
              '& .MuiChip-icon': { fontSize: '0.7rem' }
            }}
          />
        )}
      </Stack>
    </Paper>
  );
};

/* ------------------- Publishing Status Component ------------------- */
const PublishingStatus = ({ platform, status, result, error }) => {
  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'linkedin':
        return <LinkedInIcon sx={{ fontSize: '0.8rem' }} />;
      case 'naukri':
        return <LanguageIcon sx={{ fontSize: '0.8rem' }} />;
      case 'careerPage':
        return <BusinessIcon sx={{ fontSize: '0.8rem' }} />;
      case 'indeed':
        return <WorkIcon sx={{ fontSize: '0.8rem' }} />;
      default:
        return <LanguageIcon sx={{ fontSize: '0.8rem' }} />;
    }
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'pending':
        return <ScheduleIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />;
      case 'publishing':
        return <CircularProgress size={16} />;
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: '0.9rem', color: '#2E7D32' }} />;
      case 'failed':
        return <ErrorIcon sx={{ fontSize: '0.9rem', color: '#EF4444' }} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch(status) {
      case 'pending': return 'Waiting to start...';
      case 'publishing': return 'Publishing...';
      case 'success': return 'Published successfully';
      case 'failed': return 'Publishing failed';
      default: return '';
    }
  };

  return (
    <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: COLORS.primaryLight, width: 32, height: 32 }}>
              {getPlatformIcon(platform)}
            </Avatar>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, textTransform: 'capitalize' }}>
              {platform === 'careerPage' ? 'Career Page' : platform}
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon()}
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {getStatusText()}
            </Typography>
          </Box>
        </Stack>

        {status === 'publishing' && (
          <LinearProgress sx={{ height: 2, borderRadius: 1, bgcolor: COLORS.primaryLight, '& .MuiLinearProgress-bar': { bgcolor: COLORS.primary } }} />
        )}

        {status === 'success' && result && (
          <Box sx={{ bgcolor: COLORS.background.light, p: 1.5, borderRadius: 1.5 }}>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Job URL:</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Link 
                  href={result.jobUrl} 
                  target="_blank" 
                  rel="noopener"
                  sx={{ 
                    flex: 1,
                    fontSize: '0.7rem',
                    wordBreak: 'break-all',
                    color: COLORS.primary,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {result.jobUrl}
                </Link>
                <Tooltip title="Open in new tab">
                  <IconButton size="small" href={result.jobUrl} target="_blank" sx={{ p: 0.5 }}>
                    <LaunchIcon sx={{ fontSize: '0.7rem' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy link">
                  <IconButton size="small" onClick={() => navigator.clipboard.writeText(result.jobUrl)} sx={{ p: 0.5 }}>
                    <CopyIcon sx={{ fontSize: '0.7rem' }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Box>
        )}

        {status === 'failed' && error && (
          <Alert severity="error" sx={{ mt: 1, borderRadius: 1.5, fontSize: '0.7rem', py: 0.5 }}>
            {error}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

const PublishJob = ({ open, onClose, job, onPublish }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState(null);
  const [publishingStatus, setPublishingStatus] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const availablePlatforms = [
    { value: 'careerPage', label: 'Career Page' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'naukri', label: 'Naukri.com' },
    { value: 'indeed', label: 'Indeed' }
  ];

  useEffect(() => {
    if (open && job) {
      setActiveStep(0);
      setSelectedPlatforms([]);
      setPublishResults(null);
      setPublishingStatus({});
      setError('');
      setSuccess('');
    }
  }, [open, job]);

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPlatforms.length === availablePlatforms.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(availablePlatforms.map(p => p.value));
    }
  };

  const validateSelection = () => {
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform to publish');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (validateSelection()) {
        setActiveStep(1);
        handlePublish();
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setError('');
    
    const initialStatus = {};
    selectedPlatforms.forEach(platform => {
      initialStatus[platform] = { status: 'pending' };
    });
    setPublishingStatus(initialStatus);
    
    try {
      const token = localStorage.getItem('token');
      
      selectedPlatforms.forEach(platform => {
        setPublishingStatus(prev => ({
          ...prev,
          [platform]: { status: 'publishing' }
        }));
      });
      
      const response = await axios.post(`${BASE_URL}/api/jobs/${job._id}/publish`, {
        platforms: selectedPlatforms
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPublishResults(response.data.data);
        
        const updatedStatus = {};
        response.data.data.publishResults.forEach(result => {
          updatedStatus[result.platform] = {
            status: result.success ? 'success' : 'failed',
            result: result,
            error: result.error
          };
        });
        setPublishingStatus(updatedStatus);
        
        setSuccess('Job published successfully!');
        setActiveStep(2);
        
        if (onPublish) {
          onPublish(response.data.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish job');
      
      const failedStatus = {};
      selectedPlatforms.forEach(platform => {
        failedStatus[platform] = { 
          status: 'failed',
          error: err.response?.data?.message || 'Publishing failed'
        };
      });
      setPublishingStatus(failedStatus);
    } finally {
      setPublishing(false);
    }
  };

  const handleModalClose = () => {
    setActiveStep(0);
    setSelectedPlatforms([]);
    setPublishResults(null);
    setPublishingStatus({});
    setError('');
    setSuccess('');
    onClose();
  };

  const getSuccessCount = () => {
    return publishResults?.publishResults?.filter(r => r.success).length || 0;
  };

  const getFailedCount = () => {
    return publishResults?.publishResults?.filter(r => !r.success).length || 0;
  };

  if (!job) return null;

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
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
          <PublishIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Publish Job Opening
          </Typography>
        </Box>
        <IconButton onClick={handleModalClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {/* Job Summary */}
        <Paper sx={{ 
          p: 2, 
          mb: 2.5, 
          bgcolor: COLORS.primaryLight, 
          borderRadius: 1.5, 
          border: `1px solid ${COLORS.primary}`,
          boxShadow: 'none'
        }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 0.5 }}>
            {job.jobId} - {job.title}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
            {job.location} • {job.department} • {job.employmentType}
          </Typography>
        </Paper>

        {/* Stepper */}
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step 1: Select Platforms */}
        {activeStep === 0 && (
          <Stack spacing={2.5}>
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Select Platforms
                </Typography>
                <Button 
                  onClick={handleSelectAll} 
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    textTransform: 'none',
                    color: COLORS.primary,
                    '&:hover': { bgcolor: `${COLORS.primary}10` }
                  }}
                >
                  {selectedPlatforms.length === availablePlatforms.length ? 'Deselect All' : 'Select All'}
                </Button>
              </Stack>

              <Grid container spacing={2}>
                {availablePlatforms.map((platform) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={platform.value}>
                    <PlatformCard
                      platform={platform.value}
                      selected={selectedPlatforms.includes(platform.value)}
                      onToggle={handlePlatformToggle}
                      disabled={job?.status === 'published'}
                    />
                  </Grid>
                ))}
              </Grid>

              <FormHelperText sx={{ mt: 2, fontSize: '0.7rem' }}>
                Selected {selectedPlatforms.length} of {availablePlatforms.length} platforms
              </FormHelperText>
            </Box>

            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              Publishing will make this job visible on the selected platforms.
            </Alert>
          </Stack>
        )}

        {/* Step 2: Publishing */}
        {activeStep === 1 && (
          <Stack spacing={2.5}>
            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              Publishing job to selected platforms. Please do not close this window.
            </Alert>

            <Stack spacing={2}>
              {selectedPlatforms.map((platform) => (
                <PublishingStatus
                  key={platform}
                  platform={platform}
                  status={publishingStatus[platform]?.status || 'pending'}
                  result={publishingStatus[platform]?.result}
                  error={publishingStatus[platform]?.error}
                />
              ))}
            </Stack>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Overall Progress</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {Object.values(publishingStatus).filter(s => s.status === 'success' || s.status === 'failed').length} / {selectedPlatforms.length}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={(Object.values(publishingStatus).filter(s => s.status === 'success' || s.status === 'failed').length / selectedPlatforms.length) * 100}
                  sx={{ 
                    height: 4, 
                    borderRadius: 2,
                    bgcolor: COLORS.primaryLight,
                    '& .MuiLinearProgress-bar': { bgcolor: COLORS.primary }
                  }}
                />
              </Stack>
            </Paper>
          </Stack>
        )}

        {/* Step 3: Results */}
        {activeStep === 2 && publishResults && (
          <Stack spacing={2.5}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center',
              bgcolor: COLORS.primaryLight,
              border: `1px solid ${COLORS.primary}`,
              borderRadius: 1.5
            }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: COLORS.primary, mb: 1.5 }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, mb: 0.5 }}>
                Published Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                Job has been published to {getSuccessCount()} out of {selectedPlatforms.length} platforms
              </Typography>
            </Paper>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: COLORS.status.success, width: 40, height: 40 }}>
                        <CheckCircleIcon sx={{ fontSize: '1rem', color: COLORS.primaryDark }} />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {getSuccessCount()}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                          Successful
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: COLORS.status.error, width: 40, height: 40 }}>
                        <ErrorIcon sx={{ fontSize: '1rem', color: '#991B1B' }} />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {getFailedCount()}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                          Failed
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {success}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleModalClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && activeStep < 2 && (
            <Button
              onClick={handleBack}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text.secondary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
              }}
            >
              Back
            </Button>
          )}
          
          {activeStep < 2 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={publishing || (activeStep === 0 && selectedPlatforms.length === 0)}
              startIcon={activeStep === 1 ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <PublishIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {activeStep === 0 && 'Publish'}
              {activeStep === 1 && 'Publishing...'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleModalClose}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Done
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PublishJob;