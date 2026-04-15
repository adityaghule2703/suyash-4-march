import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
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
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  DateRange as DateRangeIcon
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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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

const MachineLoading = ({ machineId, machineName, open, onClose }) => {
  const theme = useTheme();
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

  useEffect(() => {
    if (machineId) {
      fetchMachineLoading();
      fetchMachineDetails();
    }
  }, [machineId, dateRange]);

  const fetchMachineDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/machines/${machineId}`, {
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

  const fetchMachineLoading = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];
      
      const response = await axios.get(`${BASE_URL}/api/machines/${machineId}/loading`, {
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
    
    // Calculate trend (comparing first half vs second half)
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
  };

  const handleRefresh = () => {
    fetchMachineLoading();
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];
      
      const response = await axios.get(`${BASE_URL}/api/machines/${machineId}/loading/export`, {
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
      link.setAttribute('download', `machine_loading_${machineId}_${fromDate}_to_${toDate}.csv`);
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

  const renderMetricsCards = () => {
    const oeeStatus = getOEEStatus(summary.averageOEE);
    const OEEStatusIcon = oeeStatus.icon;
    
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 1.5 }}>
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
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 1.5 }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
              Availability
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
              {summary.averageAvailability}%
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 1.5 }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
              Performance
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
              {summary.averagePerformance}%
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 1.5 }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
              Quality
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
              {summary.averageQuality}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderSummaryCards = () => {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 1.5, bgcolor: COLORS.background.light }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Total Records
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, mt: 0.5 }}>
              {summary.totalRecords}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 1.5, bgcolor: COLORS.background.light }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Total Downtime
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, mt: 0.5, color: COLORS.warning }}>
              {summary.totalDowntime} min
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 1.5, bgcolor: COLORS.background.light }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Best Day
            </Typography>
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
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 1.5, bgcolor: COLORS.background.light }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Trend
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              {getTrendIcon()}
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize' }}>
                {summary.trend}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderDataTable = () => {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: COLORS.background.light }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Shift</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Planned Time</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Actual Time</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Total Qty</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Good Qty</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Availability</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Performance</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Quality</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>OEE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record, index) => {
              const oeeStatus = getOEEStatus(record.oee);
              return (
                <TableRow key={index} hover>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.shift}</TableCell>
                  <TableCell align="right">{record.planned_production_time} min</TableCell>
                  <TableCell align="right">{record.actual_run_time} min</TableCell>
                  <TableCell align="right">{record.total_qty}</TableCell>
                  <TableCell align="right">{record.good_qty}</TableCell>
                  <TableCell align="right">{record.availability}%</TableCell>
                  <TableCell align="right">{record.performance}%</TableCell>
                  <TableCell align="right">{record.quality}%</TableCell>
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

  if (!open) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, bgcolor: COLORS.background.white, minHeight: '100vh' }}>
        {/* Header */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                Machine Loading Analysis
              </Typography>
              <Typography sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {machineDetails ? `${machineDetails.machine_name} (${machineDetails.machine_code})` : machineName}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Data">
                <IconButton onClick={handleExport} disabled={exportLoading}>
                  {exportLoading ? <CircularProgress size={24} /> : <DownloadIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Date Range Selector */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 1.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 5 }}>
              <DatePicker
                label="From Date"
                value={dateRange.from}
                onChange={(date) => handleDateChange('from', date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <DatePicker
                label="To Date"
                value={dateRange.to}
                onChange={(date) => handleDateChange('to', date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleRefresh}
                disabled={loading}
                startIcon={<DateRangeIcon />}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderMetricsCards()}
            {renderSummaryCards()}

            {/* Chart Controls */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 1.5 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Chart Type</InputLabel>
                    <Select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      label="Chart Type"
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
                  >
                    Switch to {viewType === 'chart' ? 'Table View' : 'Chart View'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Chart or Table View */}
            {viewType === 'chart' ? (
              <Paper sx={{ p: 2, mb: 3, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 2 }}>
                  {selectedMetric.toUpperCase()} Trend Over Time
                </Typography>
                {renderChart()}
              </Paper>
            ) : (
              renderDataTable()
            )}

            {/* Machine Details Section */}
            {machineDetails && (
              <Paper sx={{ p: 2, borderRadius: 1.5, mt: 3 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 2, color: COLORS.primary }}>
                  Machine Specifications
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Type:</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machineDetails.machine_type}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Centre:</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machineDetails.work_centre}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Capacity:</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {machineDetails.capacity_value} {machineDetails.capacity_unit}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>OEE Target:</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.primary }}>
                      {machineDetails.oee_target_percent}%
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default MachineLoading;