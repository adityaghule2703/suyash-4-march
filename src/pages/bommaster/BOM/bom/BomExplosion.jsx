// BomExplosion.jsx - Fixed version

import React, { useState, useEffect } from 'react';
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
  TextField,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Inventory as InventoryIcon,
  ProductionQuantityLimits as ProductionIcon,
  DateRange as DateRangeIcon,
  Analytics as AnalyticsIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E8F0F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#3B82F6'
};

const steps = [
  'Basic Information',
  'Explosion Details',
  'Summary & Export'
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

// Styled Table components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  padding: '8px 12px',
  '&.MuiTableCell-head': {
    backgroundColor: COLORS.background.light,
    color: COLORS.text.secondary,
    fontWeight: 600,
    fontSize: '0.7rem'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: COLORS.background.white,
  },
  '&:nth-of-type(even)': {
    backgroundColor: COLORS.background.light,
  },
  '&:hover': {
    backgroundColor: COLORS.background.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const BomExplosion = ({ open, onClose, bomId, bomData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [explosionData, setExplosionData] = useState(null);
  
  // Form data for explosion parameters
  const [formData, setFormData] = useState({
    quantity: 1,
    effective_date: new Date().toISOString().split('T')[0]
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };
  
  // Fetch explosion data
  const fetchExplosion = async () => {
    if (!bomId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      params.append('quantity', formData.quantity);
      params.append('effective_date', formData.effective_date);
      
      const response = await axios.get(`${BASE_URL}/api/boms/${bomId}/explosion?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setExplosionData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch BOM explosion');
      }
    } catch (err) {
      console.error('Error fetching BOM explosion:', err);
      let errorMessage = 'Failed to fetch BOM explosion. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (open && bomId) {
      fetchExplosion();
      setActiveStep(0);
    }
  }, [open, bomId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleRefresh = () => {
    fetchExplosion();
  };
  
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    
    switch (step) {
      case 0:
        if (!formData.quantity || formData.quantity <= 0) {
          errors.quantity = 'Quantity must be greater than 0';
          isValid = false;
        }
        if (!formData.effective_date) {
          errors.effective_date = 'Effective date is required';
          isValid = false;
        }
        break;
        
      default:
        return true;
    }
    
    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 0) {
        fetchExplosion();
      }
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Print handler
  const handlePrint = () => {
    if (!explosionData) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>BOM Explosion Report - ${explosionData?.bom_id || 'BOM'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #063C3F; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { margin-bottom: 20px; }
            .summary { margin-top: 20px; padding: 10px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BOM Explosion Report</h1>
            <p><strong>BOM ID:</strong> ${explosionData?.bom_id}</p>
            <p><strong>Parent Item:</strong> ${explosionData?.parent_item?.part_no} - ${explosionData?.parent_item?.description}</p>
            <p><strong>Requested Quantity:</strong> ${explosionData?.requested_quantity}</p>
            <p><strong>Effective Date:</strong> ${formatDate(formData.effective_date)}</p>
          </div>
          <h2>Components List</h2>
          <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Level</th>
                <th>Part No</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Scrap %</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${explosionData?.explosion?.map(comp => `
                <tr>
                  <td>${comp.level}</td>
                  <td>${comp.part_no || '-'}</td>
                  <td>${comp.description || '-'}</td>
                  <td>${comp.quantity}</td>
                  <td>${comp.unit}</td>
                  <td>${comp.scrap_percent}%</td>
                  <td>${comp.is_phantom ? 'Phantom' : comp.is_subcontract ? 'Subcontract' : 'Standard'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Unique Components:</strong> ${explosionData?.summary?.total_unique_components}</p>
            <p><strong>Total Quantity by Unit:</strong></p>
            <ul>
              ${Object.entries(explosionData?.summary?.total_quantity_by_unit || {}).map(([unit, qty]) => `
                <li>${unit}: ${qty}</li>
              `).join('')}
            </ul>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  // Export CSV handler
  const handleExportCSV = () => {
    if (!explosionData?.explosion) return;
    
    const headers = ['Level', 'Part No', 'Description', 'Quantity', 'Unit', 'Scrap %', 'Type'];
    const rows = explosionData.explosion.map(comp => [
      comp.level,
      comp.part_no || '-',
      comp.description || '-',
      comp.quantity,
      comp.unit,
      `${comp.scrap_percent}%`,
      comp.is_phantom ? 'Phantom' : comp.is_subcontract ? 'Subcontract' : 'Standard'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `BOM_Explosion_${explosionData.bom_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <DateRangeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Explosion Parameters
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PRODUCTION QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      error={!!fieldErrors.quantity}
                      helperText={fieldErrors.quantity}
                      InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      EFFECTIVE DATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="effective_date"
                      value={formData.effective_date}
                      onChange={handleChange}
                      error={!!fieldErrors.effective_date}
                      helperText={fieldErrors.effective_date}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  disabled={loading}
                  size="small"
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
                  {loading ? <CircularProgress size={16} /> : 'Refresh Data'}
                </Button>
              </Box>
            </Paper>
            
            {explosionData && (
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
                  <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Current BOM Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM ID</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{explosionData.bom_id}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Parent Item</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {explosionData.parent_item?.part_no} - {explosionData.parent_item?.description}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Requested Quantity</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.primary }}>
                      {explosionData.requested_quantity}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Components</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {explosionData.total_components}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );
        
      case 1:
        if (!explosionData) {
          return (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              Please go back and configure explosion parameters
            </Alert>
          );
        }
        
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ShoppingCartIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Component Explosion Details
              </Typography>
              
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Table size="small">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Level</StyledTableCell>
                      <StyledTableCell>Part No</StyledTableCell>
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell align="right">Quantity</StyledTableCell>
                      <StyledTableCell>Unit</StyledTableCell>
                      <StyledTableCell align="right">Scrap %</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {explosionData.explosion?.map((comp, idx) => (
                      <StyledTableRow key={idx}>
                        <StyledTableCell>
                          <Chip 
                            label={`Level ${comp.level}`} 
                            size="small" 
                            sx={{ 
                              fontSize: '0.65rem', 
                              height: 22,
                              bgcolor: comp.level === 1 ? COLORS.primary : COLORS.background.light,
                              color: comp.level === 1 ? '#fff' : COLORS.text.secondary
                            }} 
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {comp.part_no || '-'}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {comp.description || '-'}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                            {formatNumber(comp.quantity)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Chip 
                            label={comp.unit} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', height: 22 }}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {comp.scrap_percent > 0 ? (
                            <Chip 
                              label={`${comp.scrap_percent}%`} 
                              size="small" 
                              sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.warning + '20', color: COLORS.warning }}
                            />
                          ) : (
                            <Typography sx={{ fontSize: '0.75rem' }}>0%</Typography>
                          )}
                        </StyledTableCell>
                        <StyledTableCell>
                          {comp.is_phantom && (
                            <Chip 
                              label="Phantom" 
                              size="small" 
                              sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.info + '20', color: COLORS.info }}
                            />
                          )}
                          {comp.is_subcontract && (
                            <Chip 
                              label="Subcontract" 
                              size="small" 
                              sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.warning + '20', color: COLORS.warning }}
                            />
                          )}
                          {!comp.is_phantom && !comp.is_subcontract && (
                            <Chip 
                              label="Standard" 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.65rem', height: 22 }}
                            />
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                    {(!explosionData.explosion || explosionData.explosion.length === 0) && (
                      <StyledTableRow>
                        <StyledTableCell colSpan={7} align="center">
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                            No components found
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        );
        
      case 2:
        if (!explosionData) {
          return (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              Please go back and configure explosion parameters
            </Alert>
          );
        }
        
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <AnalyticsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Summary & Export
              </Typography>
              
              {/* Summary Cards */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Unique Components</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                      {explosionData.summary?.total_unique_components || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Requested Quantity</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                      {explosionData.requested_quantity}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Components</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                      {explosionData.total_components || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Quantity by Unit</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.primary }}>
                      {Object.entries(explosionData.summary?.total_quantity_by_unit || {}).map(([unit, qty]) => (
                        <div key={unit}>{qty} {unit}</div>
                      ))}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              {/* Detailed Summary Accordion */}
              <Accordion sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Detailed Quantity Breakdown by Unit</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>Unit</StyledTableCell>
                          <StyledTableCell align="right">Total Quantity</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(explosionData.summary?.total_quantity_by_unit || {}).map(([unit, qty]) => (
                          <StyledTableRow key={unit}>
                            <StyledTableCell>
                              <Chip label={unit} size="small" sx={{ fontSize: '0.65rem', height: 22 }} />
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{formatNumber(qty)}</Typography>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
              
              {/* Export Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handlePrint}
                  startIcon={<PrintIcon sx={{ fontSize: '1rem' }} />}
                  sx={{
                    height: 36,
                    px: 3,
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text.secondary,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: COLORS.primary,
                      bgcolor: `${COLORS.primary}10`
                    }
                  }}
                >
                  Print Report
                </Button>
                <Button
                  variant="contained"
                  onClick={handleExportCSV}
                  startIcon={<DownloadIcon sx={{ fontSize: '1rem' }} />}
                  sx={{
                    height: 36,
                    px: 3,
                    borderRadius: 1.5,
                    bgcolor: COLORS.primary,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': { bgcolor: COLORS.primaryDark }
                  }}
                >
                  Export to CSV
                </Button>
              </Box>
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
          overflow: 'hidden',
          height: '80vh',
          maxHeight: '80vh'
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
          BOM Explosion
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
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white, overflow: 'auto' }}>
        {loading && !explosionData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderStepContent(activeStep)
        )}
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
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
            onClick={onClose}
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
              disabled={loading}
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

export default BomExplosion;