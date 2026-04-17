import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  DateRange as DateRangeIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Analytics as AnalyticsIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const steps = ['Date Range & Filters', 'Performance Metrics', 'Chart & Data Analysis'];

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#1976D2',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#1976D2',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF'
  },
  chart: ['#1976D2', '#2E7D32', '#ED6C02', '#D32F2F', '#9C27B0', '#00ACC1']
};

const MachineLoading = ({ open, onClose, machineId, machineName }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [machineDetails, setMachineDetails] = useState(null);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    averageOEE: 0,
    averageAvailability: 0,
    averagePerformance: 0,
    averageQuality: 0,
    totalDowntime: 0,
    bestDay: null,
    worstDay: null,
    trend: 'stable'
  });
  
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [viewType, setViewType] = useState('chart');
  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('oee');
  const [exportLoading, setExportLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (open && machineId) {
      const actualMachineId = machineId?._id || machineId;
      if (actualMachineId) {
        fetchMachineLoading(actualMachineId);
        fetchMachineDetails(actualMachineId);
      }
      setActiveStep(0);
    }
  }, [machineId, dateRange, open]);

  const fetchMachineDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/machines/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMachineDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching machine details:', err);
    }
  };

  const fetchMachineLoading = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];
      
      const response = await axios.get(`${BASE_URL}/api/machines/${id}/loading`, {
        params: {
          from: fromDate,
          to: toDate
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const loadingData = response.data.data;
        setData(loadingData);
        calculateSummary(loadingData);
      } else {
        setError(response.data.message || 'Failed to fetch machine loading data');
      }
    } catch (err) {
      console.error('Error fetching machine loading:', err);
      setError(err.response?.data?.message || 'Failed to load machine data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (loadingData) => {
    if (!loadingData || loadingData.length === 0) {
      setSummary({
        totalRecords: 0,
        averageOEE: 0,
        averageAvailability: 0,
        averagePerformance: 0,
        averageQuality: 0,
        totalDowntime: 0,
        bestDay: null,
        worstDay: null,
        trend: 'stable'
      });
      return;
    }

    const totalRecords = loadingData.length;
    const avgOEE = loadingData.reduce((sum, record) => sum + record.oee, 0) / totalRecords;
    const avgAvailability = loadingData.reduce((sum, record) => sum + record.availability, 0) / totalRecords;
    const avgPerformance = loadingData.reduce((sum, record) => sum + record.performance, 0) / totalRecords;
    const avgQuality = loadingData.reduce((sum, record) => sum + record.quality, 0) / totalRecords;
    const totalDowntime = loadingData.reduce((sum, record) => sum + (record.total_downtime_min || 0), 0);
    
    const bestDay = loadingData.reduce((best, current) => 
      current.oee > best.oee ? current : best, loadingData[0]);
    const worstDay = loadingData.reduce((worst, current) => 
      current.oee < worst.oee ? current : worst, loadingData[0]);
    
    const midPoint = Math.floor(loadingData.length / 2);
    const firstHalfAvg = loadingData.slice(0, midPoint).reduce((sum, r) => sum + r.oee, 0) / midPoint;
    const secondHalfAvg = loadingData.slice(midPoint).reduce((sum, r) => sum + r.oee, 0) / (loadingData.length - midPoint);
    
    let trend = 'stable';
    if (secondHalfAvg > firstHalfAvg + 5) trend = 'improving';
    else if (secondHalfAvg < firstHalfAvg - 5) trend = 'declining';
    
    setSummary({
      totalRecords,
      averageOEE: Math.round(avgOEE * 10) / 10,
      averageAvailability: Math.round(avgAvailability * 10) / 10,
      averagePerformance: Math.round(avgPerformance * 10) / 10,
      averageQuality: Math.round(avgQuality * 10) / 10,
      totalDowntime,
      bestDay,
      worstDay,
      trend
    });
  };

  const handleDateChange = (field, date) => {
    setDateRange(prev => ({
      ...prev,
      [field]: date
    }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleRefresh = () => {
    const actualMachineId = machineId?._id || machineId;
    if (actualMachineId) {
      fetchMachineLoading(actualMachineId);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];
      const actualMachineId = machineId?._id || machineId;
      
      const response = await axios.get(`${BASE_URL}/api/machines/${actualMachineId}/loading/export`, {
        params: {
          from: fromDate,
          to: toDate
        },
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `machine_loading_${actualMachineId}_${fromDate}_to_${toDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!dateRange.from) {
          errors.from = 'From date is required';
          isValid = false;
        }
        if (!dateRange.to) {
          errors.to = 'To date is required';
          isValid = false;
        }
        if (dateRange.from && dateRange.to && dateRange.from > dateRange.to) {
          errors.to = 'To date must be after from date';
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
        handleRefresh();
      }
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getTrendIcon = () => {
    switch (summary.trend) {
      case 'improving':
        return <TrendingUpIcon sx={{ color: COLORS.success }} />;
      case 'declining':
        return <TrendingDownIcon sx={{ color: COLORS.error }} />;
      default:
        return <TrendingFlatIcon sx={{ color: COLORS.warning }} />;
    }
  };

  const getOEEStatus = (oee) => {
    if (oee >= 85) return { label: 'Excellent', color: COLORS.success, icon: CheckCircleIcon };
    if (oee >= 60) return { label: 'Good', color: COLORS.primary, icon: SpeedIcon };
    if (oee >= 40) return { label: 'Fair', color: COLORS.warning, icon: WarningIcon };
    return { label: 'Poor', color: COLORS.error, icon: WarningIcon };
  };

  const prepareChartData = () => {
    return data.map(record => ({
      date: new Date(record.date).toLocaleDateString(),
      oee: record.oee,
      availability: record.availability,
      performance: record.performance,
      quality: record.quality,
      downtime: record.total_downtime_min || 0
    }));
  };

  const renderChart = () => {
    const chartData = prepareChartData();
    
    if (chartData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: COLORS.text.secondary }}>
            No data available for the selected date range
          </Typography>
        </Box>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke={COLORS.primary} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                fill={COLORS.primary} 
                fillOpacity={0.3}
                stroke={COLORS.primary}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey={selectedMetric} fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const renderDataTable = () => {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 1.5, maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: COLORS.background.light }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Shift</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Availability</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Performance</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Quality</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>OEE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record, index) => {
              const oeeStatus = getOEEStatus(record.oee);
              return (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>
                    <Chip label={record.shift} size="small" sx={{ fontSize: '0.65rem', height: 22 }} />
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{record.availability}%</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{record.performance}%</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{record.quality}%</TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${record.oee}%`}
                      size="small"
                      sx={{ 
                        bgcolor: oeeStatus.color,
                        color: 'white',
                        fontSize: '0.7rem',
                        minWidth: 60
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <DateRangeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Select Date Range
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="From Date"
                    value={dateRange.from}
                    onChange={(date) => handleDateChange('from', date)}
                    slotProps={{ 
                      textField: { 
                        size: 'small', 
                        fullWidth: true,
                        error: !!fieldErrors.from,
                        helperText: fieldErrors.from
                      } 
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="To Date"
                    value={dateRange.to}
                    onChange={(date) => handleDateChange('to', date)}
                    slotProps={{ 
                      textField: { 
                        size: 'small', 
                        fullWidth: true,
                        error: !!fieldErrors.to,
                        helperText: fieldErrors.to
                      } 
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {machineDetails && (
              <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Machine Information
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Name</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machineDetails.machine_name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machineDetails.machine_code}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Type</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machineDetails.machine_type}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>OEE Target</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machineDetails.oee_target_percent}%</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      case 1:
        if (data.length === 0) {
          return (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              No data available for the selected date range. Please go back and select a different date range.
            </Alert>
          );
        }

        const oeeStatus = getOEEStatus(summary.averageOEE);
        const OEEStatusIcon = oeeStatus.icon;

        return (
          <Stack spacing={2}>
            {/* OEE Metrics Cards */}
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <SpeedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Performance Metrics
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 2,
                flexWrap: 'wrap',
                '& > *': { 
                  flex: 1, 
                  minWidth: '150px' 
                } 
              }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Overall OEE
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: oeeStatus.color }}>
                      {summary.averageOEE}%
                    </Typography>
                    {OEEStatusIcon && <OEEStatusIcon sx={{ color: oeeStatus.color, fontSize: '1.2rem' }} />}
                  </Box>
                  <Chip 
                    label={oeeStatus.label}
                    size="small"
                    sx={{ 
                      mt: 1,
                      bgcolor: oeeStatus.color,
                      color: 'white',
                      fontSize: '0.65rem'
                    }}
                  />
                </Paper>

                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Availability
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                    {summary.averageAvailability}%
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Performance
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                    {summary.averagePerformance}%
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Quality
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                    {summary.averageQuality}%
                  </Typography>
                </Paper>
              </Box>
            </Paper>

            {/* Summary Cards */}
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <AnalyticsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Summary Statistics
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                '& > *': { 
                  flex: 1, 
                  minWidth: '150px' 
                } 
              }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Records</Typography>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, mt: 0.5 }}>
                    {summary.totalRecords}
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Downtime</Typography>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, mt: 0.5, color: COLORS.warning }}>
                    {summary.totalDowntime} min
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Best Day</Typography>
                  {summary.bestDay && (
                    <>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 0.5 }}>
                        {new Date(summary.bestDay.date).toLocaleDateString()}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.success }}>
                        {summary.bestDay.oee}% OEE
                      </Typography>
                    </>
                  )}
                </Paper>

                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Trend</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 0.5 }}>
                    {getTrendIcon()}
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize' }}>
                      {summary.trend}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Paper>
          </Stack>
        );

      case 2:
        if (data.length === 0) {
          return (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              No data available for analysis. Please go back and select a different date range.
            </Alert>
          );
        }

        return (
          <Stack spacing={2}>
            {/* Chart Controls */}
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BarChartIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Chart Configuration
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Chart Type</InputLabel>
                    <Select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      label="Chart Type"
                      sx={{ borderRadius: 1.5 }}
                    >
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="area">Area Chart</MenuItem>
                      <MenuItem value="bar">Bar Chart</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Metric</InputLabel>
                    <Select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      label="Metric"
                      sx={{ borderRadius: 1.5 }}
                    >
                      <MenuItem value="oee">OEE</MenuItem>
                      <MenuItem value="availability">Availability</MenuItem>
                      <MenuItem value="performance">Performance</MenuItem>
                      <MenuItem value="quality">Quality</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setViewType(viewType === 'chart' ? 'table' : 'chart')}
                    sx={{ height: 40, borderRadius: 1.5, textTransform: 'none' }}
                  >
                    Switch to {viewType === 'chart' ? 'Table View' : 'Chart View'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Chart or Table View */}
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                {viewType === 'chart' ? `${selectedMetric.toUpperCase()} Trend Over Time` : 'Detailed Data Table'}
              </Typography>
              {viewType === 'chart' ? renderChart() : renderDataTable()}
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            height: '85vh',
            maxHeight: '85vh'
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
          <Box>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
              Machine Loading Analysis
            </Typography>
            {machineDetails && (
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                {machineDetails.machine_name} ({machineDetails.machine_code}) | {machineDetails.machine_type}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Stepper */}
        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
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

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: COLORS.primary }} />
              <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
                Loading machine data...
              </Typography>
            </Box>
          ) : (
            renderStepContent(activeStep)
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
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
              textTransform: 'none'
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
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleExport}
                  disabled={exportLoading || data.length === 0}
                  startIcon={exportLoading ? <CircularProgress size={16} /> : <DownloadIcon sx={{ fontSize: '1rem' }} />}
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
                    textTransform: 'none'
                  }}
                >
                  Export
                </Button>
                <Button
                  variant="outlined"
                  onClick={handlePrint}
                  disabled={data.length === 0}
                  startIcon={<PrintIcon sx={{ fontSize: '1rem' }} />}
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
                    textTransform: 'none'
                  }}
                >
                  Print
                </Button>
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
                  Close
                </Button>
              </>
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
    </LocalizationProvider>
  );
};

export default MachineLoading;