// ViewBom.jsx - Fixed version
import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Inventory as InventoryIcon,
  ProductionQuantityLimits as ProductionIcon,
  DateRange as DateRangeIcon,
  Info as InfoIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

const steps = [
  'Parent Item Details',
  'Production Parameters', 
  'Components List',
  'Additional Information'
];

// Modern Stepper Connector
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

const getStatusIcon = (status) => {
  switch (status) {
    case 'Approved':
      return <CheckCircleIcon sx={{ fontSize: '1rem', color: '#059669' }} />;
    case 'Pending':
      return <PendingIcon sx={{ fontSize: '1rem', color: '#D97706' }} />;
    case 'Rejected':
      return <CancelIcon sx={{ fontSize: '1rem', color: '#DC2626' }} />;
    default:
      return <PendingIcon sx={{ fontSize: '1rem', color: '#4F46E5' }} />;
  }
};

// Helper function to safely get display value from object or string
const getDisplayValue = (value) => {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    // If it's an object, try to get name, username, or stringify safely
    return value.name || value.username || value.userName || value._id || '-';
  }
  return String(value);
};

const ViewBom = ({ open, onClose, bom }) => {
  const [activeStep, setActiveStep] = useState(0);
  
  if (!bom) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const parentItem = bom.parent_item_id || {};
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Header Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                BOM Header Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM ID</Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                        {getDisplayValue(bom.bom_id)}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Version</Typography>
                      <Chip
                        label={getDisplayValue(bom.bom_version)}
                        size="small"
                        sx={{ fontSize: '0.7rem', fontWeight: 500, bgcolor: COLORS.primary, color: '#fff' }}
                      />
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                    <Chip
                      icon={getStatusIcon(bom.status)}
                      label={getDisplayValue(bom.status) || 'Pending'}
                      size="small"
                      sx={{ fontSize: '0.7rem', fontWeight: 500 }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Parent Item Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Parent Item Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part No</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {getDisplayValue(parentItem.part_no) || getDisplayValue(bom.parent_part_no) || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Description</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                    {getDisplayValue(parentItem.part_description) || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Drawing No</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                    {getDisplayValue(parentItem.drawing_no) || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Item Category</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                    {getDisplayValue(parentItem.item_category) || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
        
      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ProductionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Production Parameters
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Type</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{getDisplayValue(bom.bom_type) || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Batch Size</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.batch_size || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Yield %</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.yield_percent || 0}%</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Setup Time</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.setup_time_min || 0} min</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Cycle Time</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.cycle_time_min || 0} min</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
        
      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ShoppingCartIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Components List ({bom.components?.length || 0})
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Level</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Qty Per</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Scrap %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bom.components?.map((comp, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{comp.level}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{getDisplayValue(comp.component_part_no) || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{getDisplayValue(comp.component_desc) || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{comp.quantity_per}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{getDisplayValue(comp.unit) || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{comp.scrap_percent || 0}%</TableCell>
                      </TableRow>
                    ))}
                    {(!bom.components || bom.components.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                          No components found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        );
        
      case 3:
        return (
          <Stack spacing={2}>
            {/* Validity Period */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <DateRangeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Validity Period
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effective From</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDate(bom.effective_from)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effective To</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDate(bom.effective_to)}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Metadata */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Additional Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatDate(bom.created_at)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Revision</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{getDisplayValue(bom.current_revision) || '1'}</Typography>
                </Grid>
               
                {bom.remarks && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Remarks</Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>{getDisplayValue(bom.remarks)}</Typography>
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
      onClose={onClose}
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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          BOM Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
        >
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
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
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
          disabled={activeStep === 0}
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
            onClick={onClose}
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
            Close
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={onClose}
              size="small"
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
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
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
    </Dialog>
  );
};

export default ViewBom;