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
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Box,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  styled,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  BusinessCenter as BusinessIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  CloudUpload as CloudUploadIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  People as PeopleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon,
  Category as CategoryIcon,
  Straighten as StraightenIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as AccountBalanceIcon,
  Badge as BadgeIcon,
  Grain as GrainIcon,
  Factory as FactoryIcon,
  Style as StyleIcon,
  Edit as EditIcon
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

// Custom Step Icon
const StepIcon = ({ active, completed, icon }) => {
  const getIcon = () => {
    if (icon === 1) return <InventoryIcon sx={{ fontSize: '0.9rem' }} />;
    if (icon === 2) return <CategoryIcon sx={{ fontSize: '0.9rem' }} />;
    if (icon === 3) return <StraightenIcon sx={{ fontSize: '0.9rem' }} />;
    return icon;
  };

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        bgcolor: completed || active ? COLORS.primary : COLORS.border,
        color: completed || active ? COLORS.text.light : COLORS.text.tertiary,
        transition: 'all 0.2s ease',
        boxShadow: active ? `0 0 0 2px ${COLORS.primary}20` : 'none',
        '& svg': { fontSize: '0.9rem' }
      }}
    >
      {completed ? <CheckCircleIcon sx={{ fontSize: '0.9rem' }} /> : getIcon()}
    </Box>
  );
};

const steps = ['Basic Details', 'Material & Drawing', 'Production & System'];

const ViewItem = ({ open, onClose, item, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!item) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getItemInitials = (partNo, partName) => {
    if (partNo) {
      const words = partNo.split('-');
      if (words.length > 1) {
        return `${words[0].substring(0, 1)}${words[1].substring(0, 1)}`.toUpperCase();
      }
      return partNo.substring(0, 2).toUpperCase();
    }
    if (partName) return partName.substring(0, 2).toUpperCase();
    return 'IT';
  };

  const labelStyle = {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);
  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const getStepContent = (step) => {
    if (!item) return null;

    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Item Profile Header */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.primary}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: COLORS.primary, fontSize: '1.5rem', fontWeight: 600 }}>
                  {getItemInitials(item.part_no, item.part_name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {item.part_name || item.part_description || 'Item'}
                    </Typography>
                    <Chip
                      label={item.item_id || `ID: ${item._id?.slice(-6)}`}
                      size="small"
                      sx={{ bgcolor: COLORS.background.white, color: COLORS.primary, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      icon={item.is_active ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <ErrorIcon sx={{ fontSize: '0.7rem' }} />}
                      label={item.is_active ? 'Active' : 'Inactive'}
                      sx={{ 
                        bgcolor: item.is_active ? COLORS.status.success : COLORS.status.error, 
                        color: item.is_active ? COLORS.primaryDark : '#991B1B', 
                        fontWeight: 500, 
                        fontSize: '0.65rem', 
                        height: 24 
                      }}
                    />
                    <Chip
                      size="small"
                      icon={<BusinessIcon sx={{ fontSize: '0.7rem' }} />}
                      label={item.item_category || 'N/A'}
                      sx={{ bgcolor: COLORS.background.white, color: COLORS.primary, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
                    />
                    <Chip
                      size="small"
                      icon={<WorkIcon sx={{ fontSize: '0.7rem' }} />}
                      label={item.procurement_type || 'N/A'}
                      sx={{ bgcolor: COLORS.background.white, color: COLORS.primary, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
                    />
                  </Box>
                </Box>
              
              </Box>
            </Paper>

            {/* Basic Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <InfoIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Basic Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Part Number</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BadgeIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {item.part_no || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Part Name</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.part_name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Description</Typography>
                  <Paper sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5, 
                    border: `1px solid ${COLORS.border}`,
                    mt: 0.5
                  }}>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {item.part_description || 'No description provided'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            {/* Unit & Tax Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <ReceiptIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Unit & Tax Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Unit</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {item.unit || 'Nos'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Sale Unit</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.sale_unit || item.unit || 'Nos'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>HSN Code</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.hsn_code || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>GST %</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.gst_percentage ? `${item.gst_percentage}%` : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Dimensions & Weight */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <StraightenIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Dimensions & Weight
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Thickness (mm)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.thickness || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Width (mm)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.width || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Length (mm)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.length || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Density (g/cm³)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.density || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Gross Weight (kg)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primary }}>
                    {item.gross_weight_kg?.toFixed(3) || item.calculated_weight_kg?.toFixed(3) || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Net Weight (kg)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.net_weight_kg?.toFixed(3) || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Dimensions (Formatted)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.dimensions_formatted || `${item.thickness || '?'}mm × ${item.width || '?'}mm × ${item.length || '?'}mm`}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* System Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <HistoryIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  System Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Created At</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatDateTime(item.createdAt)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Last Updated</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatDateTime(item.updatedAt)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Item Role</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.item_role || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Item Type</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.item_type || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Material Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CategoryIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Material Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Material Name</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {item.material_name || item.material || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Material Grade</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.material_grade || item.rm_grade || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={labelStyle}>Material Code</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.material_code || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={labelStyle}>Material Standard</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.material_standard || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={labelStyle}>Material Color</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.material_color || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>RM Source</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.rm_source || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>RM Type</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.rm_type || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>RM Specification</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.rm_spec || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Drawing Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Drawing Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Drawing Number</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {item.drawing_no || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Revision Number</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.revision_no || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Strip Size (mm)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.strip_size || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Drawing File</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.drawing_file_path ? 'Available' : 'Not Available'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Current Rate Information */}
            {item.current_rate && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <AccountBalanceIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    Current Rate Information
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography sx={labelStyle}>Rate per KG (₹)</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                      ₹{item.current_rate?.toFixed(2)}
                    </Typography>
                  </Grid>
                  {item.rate_history?.[0] && (
                    <>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography sx={labelStyle}>Total RM Rate</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          ₹{item.rate_history[0].total_rm_rate?.toFixed(2) || '-'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography sx={labelStyle}>Effective Rate</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          ₹{item.rate_history[0].effective_rate?.toFixed(2) || '-'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography sx={labelStyle}>Rate Effective From</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatShortDate(item.rate_history[0].date_effective)}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {/* Production Parameters */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <FactoryIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Production Parameters
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Pitch (mm)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.pitch || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Number of Cavities</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.no_of_cavity || '1'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>RM Rejection %</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.rm_rejection_percent ? `${item.rm_rejection_percent}%` : '0%'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Scrap Realisation %</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.scrap_realisation_percent ? `${item.scrap_realisation_percent}%` : '0%'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Stock & Inventory Settings */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Stock & Inventory Settings
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Reorder Level</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.reorder_level || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Reorder Quantity</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.reorder_qty || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Safety Stock</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.safety_stock || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Minimum Stock</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.min_stock || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Maximum Stock</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.max_stock || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Lead Time (Days)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.lead_time_days || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Shelf Life (Days)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.shelf_life_days || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography sx={labelStyle}>Part No Locked</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {item.part_no_locked ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Weight Formula */}
            {item.weight_formula && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <StraightenIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    Weight Calculation Formula
                  </Typography>
                </Box>
                <Paper sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.light, 
                  borderRadius: 1.5, 
                  border: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Formula: {item.weight_formula.formula}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Calculation: {item.weight_formula.calculation}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.primary }}>
                    Result: {item.weight_formula.weight_kg?.toFixed(3)} kg
                  </Typography>
                </Paper>
              </Paper>
            )}

            {/* Part No Lock Status */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <BadgeIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Additional Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Part No Locked</Typography>
                  <Chip
                    size="small"
                    label={item.part_no_locked ? 'Locked' : 'Unlocked'}
                    sx={{ 
                      bgcolor: item.part_no_locked ? COLORS.status.warning : COLORS.status.success,
                      color: item.part_no_locked ? '#92400E' : COLORS.primaryDark,
                      fontWeight: 500,
                      fontSize: '0.65rem',
                      height: 24
                    }}
                  />
                </Grid>
                {item.note && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={labelStyle}>Notes</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {item.note}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      default:
        return null;
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
          <InventoryIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Item Details
          </Typography>
          {item && item.part_no && (
            <Chip
              label={item.part_no}
              size="small"
              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      {item && (
        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={(props) => <StepIcon {...props} icon={index + 1} />}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light, overflowY: 'auto' }}>
        {item ? getStepContent(activeStep) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
              No item data available
            </Typography>
          </Box>
        )}
      </DialogContent>

      {item && (
        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          justifyContent: 'space-between'
        }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
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
              '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
            }}
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleClose}
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
              Close
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleReset}
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
                View from Start
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
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
                Next
              </Button>
            )}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ViewItem;