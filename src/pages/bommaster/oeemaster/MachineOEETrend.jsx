// MachineOEETrend.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Pagination,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1',
  purple: '#9C27B0',
  orange: '#FF9800',
  teal: '#009688',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF',
    paper: '#FFFFFF'
  }
};

const CHART_COLORS = ['#1976D2', '#2E7D32', '#ED6C02', '#D32F2F', '#9C27B0', '#009688'];

const MachineOEETrend = ({ machineId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [machineDetails, setMachineDetails] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState({
    period_from: '',
    period_to: '',
    record_count: 0,
    avg_oee: 0,
    max_oee: 0,
    min_oee: 0,
    trend_direction: 'stable',
    trend_percentage: 0,
    improvement_count: 0,
    decline_count: 0
  });
  const [chartType, setChartType] = useState('line'); // line, area, bar, composed
  const [timeGranularity, setTimeGranularity] = useState('day'); // day, week, month

  // Date range state
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 90)), // Last 90 days
    to: new Date()
  });

  // Sorting state
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Fetch machine details on component mount
  useEffect(() => {
    if (machineId) {
      fetchMachineDetails();
      fetchTrendData();
    }
  }, [machineId]);

  // Fetch data when date range, pagination, or granularity changes
  useEffect(() => {
    if (machineId) {
      fetchTrendData();
    }
  }, [dateRange, pagination.page, pagination.limit, sortBy, sortOrder, timeGranularity]);

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

  const fetchTrendData = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Format dates for API
      const fromDate = dateRange.from ? dateRange.from.toISOString().split('T')[0] : '';
      const toDate = dateRange.to ? dateRange.to.toISOString().split('T')[0] : '';

      // Build query parameters
      const params = new URLSearchParams();
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);
      params.append('granularity', timeGranularity);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await axios.get(`${BASE_URL}/api/machines/${machineId}/oee-trend?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTrendData(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || response.data.data.length
        }));
        
        // Calculate summary statistics
        calculateSummary(response.data.summary, response.data.data);
      } else {
        setError('Failed to fetch OEE trend data');
      }
    } catch (err) {
      console.error('Error fetching trend data:', err);
      setError(err.response?.data?.message || 'Failed to load OEE trend data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (apiSummary, data) => {
    if (!data || data.length === 0) {
      setSummary({
        period_from: apiSummary?.period_from || '',
        period_to: apiSummary?.period_to || '',
        record_count: 0,
        avg_oee: 0,
        max_oee: 0,
        min_oee: 0,
        trend_direction: 'stable',
        trend_percentage: 0,
        improvement_count: 0,
        decline_count: 0
      });
      return;
    }

    const oeeValues = data.map(record => record.oee || record.avg_oee || 0);
    const max_oee = Math.max(...oeeValues);
    const min_oee = Math.min(...oeeValues);
    
    // Calculate trend direction
    let trend_direction = 'stable';
    let trend_percentage = 0;
    let improvement_count = 0;
    let decline_count = 0;
    
    if (data.length >= 2) {
      const firstHalf = data.slice(0, Math.floor(data.length / 2));
      const secondHalf = data.slice(Math.floor(data.length / 2));
      const firstAvg = firstHalf.reduce((sum, r) => sum + (r.oee || r.avg_oee || 0), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, r) => sum + (r.oee || r.avg_oee || 0), 0) / secondHalf.length;
      trend_percentage = ((secondAvg - firstAvg) / firstAvg) * 100;
      
      if (trend_percentage > 5) trend_direction = 'improving';
      else if (trend_percentage < -5) trend_direction = 'declining';
      else trend_direction = 'stable';
      
      // Count improvements and declines
      for (let i = 1; i < data.length; i++) {
        const current = data[i].oee || data[i].avg_oee || 0;
        const previous = data[i-1].oee || data[i-1].avg_oee || 0;
        if (current > previous) improvement_count++;
        else if (current < previous) decline_count++;
      }
    }

    setSummary({
      period_from: apiSummary?.period_from || dateRange.from?.toISOString().split('T')[0] || '',
      period_to: apiSummary?.period_to || dateRange.to?.toISOString().split('T')[0] || '',
      record_count: apiSummary?.record_count || data.length,
      avg_oee: apiSummary?.avg_oee || (oeeValues.reduce((a, b) => a + b, 0) / oeeValues.length).toFixed(1),
      max_oee: Math.round(max_oee * 10) / 10,
      min_oee: Math.round(min_oee * 10) / 10,
      trend_direction,
      trend_percentage: Math.abs(Math.round(trend_percentage * 10) / 10),
      improvement_count,
      decline_count
    });
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const handleRefresh = () => {
    fetchTrendData();
  };

  const handleClearDates = () => {
    setDateRange({
      from: new Date(new Date().setDate(new Date().getDate() - 90)),
      to: new Date()
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getOEEStatus = (oee) => {
    if (oee >= 85) return { label: 'Excellent', color: COLORS.success, icon: CheckCircleIcon };
    if (oee >= 60) return { label: 'Good', color: COLORS.primary, icon: SpeedIcon };
    if (oee >= 40) return { label: 'Fair', color: COLORS.warning, icon: WarningIcon };
    return { label: 'Poor', color: COLORS.error, icon: WarningIcon };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportToCSV = () => {
    if (trendData.length === 0) return;
    
    const headers = ['Date', 'OEE (%)', 'Availability (%)', 'Performance (%)', 'Quality (%)', 'Planned Time', 'Run Time', 'Total Qty', 'Good Qty'];
    const csvData = trendData.map(record => [
      formatDate(record.date),
      record.oee || record.avg_oee || 0,
      record.availability || 0,
      record.performance || 0,
      record.quality || 0,
      record.planned_production_time || 0,
      record.actual_run_time || 0,
      record.total_qty || 0,
      record.good_qty || 0
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oee_trend_${machineDetails?.machine_code}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderChart = () => {
    const chartData = trendData.map(record => ({
      date: formatDate(record.date),
      oee: record.oee || record.avg_oee || 0,
      availability: record.availability || 0,
      performance: record.performance || 0,
      quality: record.quality || 0,
      target: machineDetails?.oee_target_percent || 75
    }));

    if (chartData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No data available for the selected period</Typography>
        </Box>
      );
    }

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Legend />
              <Area type="monotone" dataKey="oee" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} name="OEE %" />
              <Area type="monotone" dataKey="target" stroke={COLORS.warning} fill={COLORS.warning} fillOpacity={0.1} name="Target %" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="oee" fill={COLORS.primary} name="OEE %" />
              <Bar dataKey="target" fill={COLORS.warning} name="Target %" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="availability" fill={COLORS.info} name="Availability %" barSize={20} />
              <Bar dataKey="performance" fill={COLORS.success} name="Performance %" barSize={20} />
              <Bar dataKey="quality" fill={COLORS.warning} name="Quality %" barSize={20} />
              <Line type="monotone" dataKey="oee" stroke={COLORS.primary} strokeWidth={2} name="OEE %" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default: // line chart
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="oee" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="OEE %" />
              <Line type="monotone" dataKey="target" stroke={COLORS.warning} strokeDasharray="5 5" name="Target %" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderDistributionChart = () => {
    if (trendData.length === 0) return null;

    const distribution = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0
    };

    trendData.forEach(record => {
      const oee = record.oee || record.avg_oee || 0;
      if (oee >= 85) distribution.excellent++;
      else if (oee >= 60) distribution.good++;
      else if (oee >= 40) distribution.fair++;
      else distribution.poor++;
    });

    const pieData = [
      { name: 'Excellent (≥85%)', value: distribution.excellent, color: COLORS.success },
      { name: 'Good (60-84%)', value: distribution.good, color: COLORS.primary },
      { name: 'Fair (40-59%)', value: distribution.fair, color: COLORS.warning },
      { name: 'Poor (<40%)', value: distribution.poor, color: COLORS.error }
    ].filter(item => item.value > 0);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  if (!machineId) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No machine selected</Typography>
      </Paper>
    );
  }

  const oeeStatus = getOEEStatus(summary.avg_oee);
  const StatusIcon = oeeStatus.icon;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        {/* Header Section */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                OEE Trend Analysis
              </Typography>
              {machineDetails && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {machineDetails.machine_name} ({machineDetails.machine_code})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {machineDetails.machine_type} | {machineDetails.work_centre} | Target: {machineDetails.oee_target_percent}%
                  </Typography>
                </Box>
              )}
            </Box>
            {/* <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh} size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export to CSV">
                <IconButton onClick={exportToCSV} size="small" disabled={trendData.length === 0}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint} size="small" disabled={trendData.length === 0}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            </Box> */}
          </Box>
        </Paper>

        {/* Date Range Filters */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 5 }}>
              <DatePicker
                label="From Date"
                value={dateRange.from}
                onChange={(date) => handleDateRangeChange('from', date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <DatePicker
                label="To Date"
                value={dateRange.to}
                onChange={(date) => handleDateRangeChange('to', date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClearDates}
                size="small"
                fullWidth
                sx={{ height: 40 }}
              >
                Clear Dates
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Period</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {formatDate(summary.period_from)} - {formatDate(summary.period_to)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {summary.record_count} records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Average OEE</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5, color: oeeStatus.color }}>
                  {summary.avg_oee}%
                </Typography>
                <Chip 
                  icon={<StatusIcon sx={{ fontSize: '0.8rem' }} />}
                  label={oeeStatus.label}
                  size="small"
                  sx={{ mt: 0.5, height: 24, bgcolor: oeeStatus.color, color: 'white' }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Range</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5, color: COLORS.success }}>
                  Max: {summary.max_oee}%
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.error }}>
                  Min: {summary.min_oee}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Trend</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  {summary.trend_direction === 'improving' && <TrendingUpIcon sx={{ color: COLORS.success }} />}
                  {summary.trend_direction === 'declining' && <TrendingDownIcon sx={{ color: COLORS.error }} />}
                  {summary.trend_direction === 'stable' && <ShowChartIcon sx={{ color: COLORS.text.secondary }} />}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {summary.trend_direction === 'improving' ? '+' : ''}
                    {summary.trend_direction !== 'stable' ? summary.trend_percentage : ''}
                    {summary.trend_direction !== 'stable' ? '%' : ''}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Improvements: {summary.improvement_count} | Declines: {summary.decline_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Chart Controls */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
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
                  <MenuItem value="composed">Composed Chart</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Granularity</InputLabel>
                <Select
                  value={timeGranularity}
                  onChange={(e) => setTimeGranularity(e.target.value)}
                  label="Time Granularity"
                >
                  <MenuItem value="day">Daily</MenuItem>
                  <MenuItem value="week">Weekly</MenuItem>
                  <MenuItem value="month">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                variant="contained"
                onClick={handleRefresh}
                disabled={loading}
                fullWidth
                startIcon={<RefreshIcon />}
              >
                Refresh Chart
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs for different views */}
        <Paper sx={{ mb: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{ borderBottom: `1px solid ${COLORS.border}` }}
          >
            <Tab icon={<ShowChartIcon />} label="Trend Chart" />
            <Tab icon={<PieChartIcon />} label="Distribution" />
            <Tab icon={<AssessmentIcon />} label="Detailed Data" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            {activeTab === 0 && (
              <>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
                ) : (
                  renderChart()
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
                ) : (
                  renderDistributionChart()
                )}
              </>
            )}

            {activeTab === 2 && (
              <>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
                ) : (
                  <>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <TableSortLabel
                                active={sortBy === 'date'}
                                direction={sortOrder}
                                onClick={() => handleSortChange('date')}
                              >
                                Date
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={sortBy === 'oee'}
                                direction={sortOrder}
                                onClick={() => handleSortChange('oee')}
                              >
                                OEE (%)
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>Availability (%)</TableCell>
                            <TableCell>Performance (%)</TableCell>
                            <TableCell>Quality (%)</TableCell>
                            <TableCell>Planned Time</TableCell>
                            <TableCell>Run Time</TableCell>
                            <TableCell>Total Qty</TableCell>
                            <TableCell>Good Qty</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {trendData.map((record, index) => {
                            const oee = record.oee || record.avg_oee || 0;
                            const status = getOEEStatus(oee);
                            return (
                              <TableRow key={index}>
                                <TableCell>{formatDate(record.date)}</TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontWeight: 500, color: status.color }}>
                                      {oee}%
                                    </Typography>
                                    <Chip 
                                      label={status.label}
                                      size="small"
                                      sx={{ height: 20, fontSize: '0.65rem', bgcolor: status.color, color: 'white' }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell>{record.availability || 0}%</TableCell>
                                <TableCell>{record.performance || 0}%</TableCell>
                                <TableCell>{record.quality || 0}%</TableCell>
                                <TableCell>{record.planned_production_time || 0} min</TableCell>
                                <TableCell>{record.actual_run_time || 0} min</TableCell>
                                <TableCell>{record.total_qty || 0}</TableCell>
                                <TableCell>{record.good_qty || 0}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {pagination.total > pagination.limit && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                          count={Math.ceil(pagination.total / pagination.limit)}
                          page={pagination.page}
                          onChange={handlePageChange}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default MachineOEETrend;