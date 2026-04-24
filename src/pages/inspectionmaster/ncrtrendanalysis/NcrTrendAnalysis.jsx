// NcrTrendAnalysis.jsx - All sections on one page
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Chip,
  Button,
  TextField,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Drawer,
  Badge
} from "@mui/material";
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AttachMoney as MoneyIcon,
  ProductionQuantityLimits as QuantityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from "@mui/icons-material";
import {
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
  Line,
  ComposedChart
} from "recharts";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from "../../../utils/modulePermissions";
import { Grid } from "lucide-react";

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  secondary: '#0D696C',
  accent: '#F59E0B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    card: '#FFFFFF'
  },
  border: '#E3E8EF',
  severity: {
    Critical: '#EF4444',
    Major: '#F59E0B',
    Minor: '#10B981',
    Cosmetic: '#8B5CF6'
  },
  chartColors: ['#063C3F', '#0D696C', '#128C7E', '#1A9B8C', '#23B8A8', '#2CD5C4']
};

const GROUP_BY_OPTIONS = [
  { value: 'defect_code', label: 'Defect Code' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'severity', label: 'Severity' },
  { value: 'ncr_type', label: 'NCR Type' }
];

const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

const AccessDenied = () => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h6" color="error" sx={{ mb: 1 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" color="text.secondary">
      You don't have permission to view NCR Trend Analysis.
    </Typography>
  </Box>
);

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ 
    borderRadius: 1.5, 
    border: `1px solid ${COLORS.border}`,
    boxShadow: 'none',
    flex: 1,
    minWidth: 0
  }}>
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ overflow: 'hidden' }}>
          <Typography sx={{ color: COLORS.text.secondary, fontSize: '0.65rem', fontWeight: 500, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography sx={{ fontWeight: 700, color: color || COLORS.text.primary, fontSize: '1.25rem' }}>
            {value !== undefined ? value.toLocaleString() : '-'}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: COLORS.text.tertiary, fontSize: '0.6rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color || COLORS.primary}15`, color: color || COLORS.primary, width: 32, height: 32, flexShrink: 0 }}>
          {icon}
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

const NcrTrendAnalysis = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [groupBy, setGroupBy] = useState('defect_code');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.success) {
          setIsSuperAdmin(response.data.data.isSuperAdmin || false);
          setUserPermissions(response.data.data.permissions || []);
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    fetchUserPermissions();
  }, []);

  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(userPermissions, MODULES.NCR_MASTER, PAGES.NCR_MASTER, action);
  };

  const canViewPage = checkPermission(ACTIONS.VIEW);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      if (groupBy) params.group_by = groupBy;
      
      const response = await axios.get(`${BASE_URL}/api/ncrs/trend`, { params, headers: { 'Authorization': `Bearer ${token}` } });
      if (response.data.success) {
        setTrendData(response.data.data);
      } else {
        showNotification('Failed to load trend data', 'error');
      }
    } catch (err) {
      console.error('Error fetching trend data:', err);
      showNotification('Failed to load trend data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permissionsLoaded && canViewPage) {
      fetchTrendData();
    }
  }, [permissionsLoaded, canViewPage, fromDate, toDate, groupBy]);

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setGroupBy('defect_code');
    if (isMobile) setFilterDrawerOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (fromDate) count++;
    if (toDate) count++;
    if (groupBy !== 'defect_code') count++;
    return count;
  };

  const formatMonthlyTrend = () => {
    if (!trendData?.monthly_trend) return [];
    return trendData.monthly_trend.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      total: item.count,
      Critical: item.critical_count,
      Major: item.major_count,
      Minor: item.minor_count
    }));
  };

  const formatDefectData = () => {
    if (!trendData?.by_defect) return [];
    const sorted = [...trendData.by_defect].sort((a, b) => b.count - a.count);
    const total = sorted.reduce((sum, item) => sum + item.count, 0);
    let cumulative = 0;
    return sorted.map(item => {
      cumulative += item.count;
      return {
        name: item.name || item._id,
        code: item._id,
        category: item.category,
        count: item.count,
        percentage: ((item.count / total) * 100).toFixed(1),
        cumulative: (cumulative / total) * 100,
        total_quantity: item.total_quantity
      };
    });
  };

  const getSeverityDistribution = () => {
    if (!trendData?.monthly_trend) return [];
    const severityMap = new Map();
    trendData.monthly_trend.forEach(month => {
      severityMap.set('Critical', (severityMap.get('Critical') || 0) + (month.critical_count || 0));
      severityMap.set('Major', (severityMap.get('Major') || 0) + (month.major_count || 0));
      severityMap.set('Minor', (severityMap.get('Minor') || 0) + (month.minor_count || 0));
    });
    return Array.from(severityMap.entries()).map(([name, value]) => ({
      name, value, color: COLORS.severity[name] || COLORS.text.secondary
    }));
  };

  const monthlyTrendData = formatMonthlyTrend();
  const paretoData = formatDefectData();
  const severityData = getSeverityDistribution();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, borderRadius: 1 }}>
          <Typography variant="caption" fontWeight={600}>{label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="caption" sx={{ color: entry.color, display: 'block' }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const FilterDrawer = () => (
    <Drawer anchor="bottom" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>Filters</Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)} size="small"><CloseIcon /></IconButton>
        </Stack>
        <Stack spacing={2}>
          <TextField type="date" label="From Date" size="small" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField type="date" label="To Date" size="small" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField select label="Group By" size="small" value={groupBy} onChange={(e) => setGroupBy(e.target.value)} fullWidth>
            {GROUP_BY_OPTIONS.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
          </TextField>
          <Stack direction="row" spacing={1}>
            <Button fullWidth variant="outlined" onClick={clearFilters}>Clear All</Button>
            <Button fullWidth variant="contained" onClick={() => setFilterDrawerOpen(false)} sx={{ bgcolor: COLORS.primary }}>Apply</Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );

  if (!permissionsLoaded) return <LoadingState />;
  if (!canViewPage && !isSuperAdmin) return <AccessDenied />;

  return (
    <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 700, color: COLORS.text.primary }}>
            NCR Trend Analysis
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
            Analyze non-conformance trends, Pareto analysis, and monthly patterns
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: { xs: 1, sm: 0 } }}>
          <Button size="small" startIcon={<RefreshIcon sx={{ fontSize: '0.9rem' }} />} onClick={fetchTrendData} sx={{ height: 28, fontSize: '0.65rem' }}>Refresh</Button>
          <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: '0.9rem' }} />} sx={{ height: 28, fontSize: '0.65rem' }}>Export</Button>
        </Stack>
      </Stack>

      {/* Filter Bar */}
      <Paper sx={{ p: 1, mb: 1.5, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {!isMobile && (
              <>
                <TextField type="date" size="small" label="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: 140 }} />
                <TextField type="date" size="small" label="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: 140 }} />
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>Group By</InputLabel>
                  <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} label="Group By">
                    {GROUP_BY_OPTIONS.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </>
            )}
            {isMobile && (
              <Badge badgeContent={getActiveFilterCount()} color="primary">
                <Button variant="outlined" onClick={() => setFilterDrawerOpen(true)} startIcon={<FilterIcon />} fullWidth size="small">Filters</Button>
              </Badge>
            )}
            {!isMobile && getActiveFilterCount() > 0 && (
              <Button variant="text" onClick={clearFilters} startIcon={<CloseIcon sx={{ fontSize: '0.8rem' }} />} sx={{ fontSize: '0.65rem' }}>Clear</Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <FilterDrawer />

      {loading ? (
        <LoadingState />
      ) : trendData ? (
        <>
          {/* Summary Cards - Full Width */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2, width: '100%' }}>
            <StatCard title="Total NCRs" value={trendData.summary?.total_ncrs} icon={<WarningIcon sx={{ fontSize: '1rem' }} />} color={COLORS.primary} />
            <StatCard title="Open NCRs" value={trendData.summary?.open_ncrs} icon={<ErrorIcon sx={{ fontSize: '1rem' }} />} color={COLORS.accent} subtitle={`Closed: ${trendData.summary?.closed_ncrs || 0}`} />
            <StatCard title="Total Quantity" value={trendData.summary?.total_quantity} icon={<QuantityIcon sx={{ fontSize: '1rem' }} />} color={COLORS.secondary} subtitle={`Rejected: ${trendData.summary?.total_rejected_qty || 0}`} />
            <StatCard title="Financial Impact" value={trendData.summary?.total_financial_impact} icon={<MoneyIcon sx={{ fontSize: '1rem' }} />} color={COLORS.accent} subtitle={`Recovered: ${trendData.summary?.total_recovered || 0}`} />
          </Stack>

          {/* Section 1: Trend Analysis */}
          <Paper sx={{ p: 1.5, mb: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1.5, color: COLORS.primary }}>
              📈 Monthly NCR Trend
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke={COLORS.text.tertiary} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke={COLORS.text.tertiary} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke={COLORS.text.tertiary} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="Critical" fill={COLORS.severity.Critical} name="Critical" />
                <Bar yAxisId="left" dataKey="Major" fill={COLORS.severity.Major} name="Major" />
                <Bar yAxisId="left" dataKey="Minor" fill={COLORS.severity.Minor} name="Minor" />
                <Line yAxisId="right" type="monotone" dataKey="total" stroke={COLORS.primary} name="Total NCRs" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>

          {/* Key Metrics and Period Info side by side */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none', height: '100%' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: COLORS.primary }}>Key Metrics</Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Systemic Failures</Typography>
                    <Chip label={trendData.summary?.systemic_ncrs || 0} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.severity.Critical + '20', color: COLORS.severity.Critical }} />
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Avg Financial Impact/NCR</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>₹{((trendData.summary?.total_financial_impact || 0) / (trendData.summary?.total_ncrs || 1)).toLocaleString()}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Avg Quantity/NCR</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{Math.round((trendData.summary?.total_quantity || 0) / (trendData.summary?.total_ncrs || 1))} units</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Closure Rate</Typography>
                    <Chip label={`${((trendData.summary?.closed_ncrs || 0) / (trendData.summary?.total_ncrs || 1) * 100).toFixed(1)}%`} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.status?.Closed + '20', color: COLORS.status?.Closed || COLORS.secondary }} />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none', height: '100%' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: COLORS.primary }}>Analysis Period</Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>FROM</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{trendData.period?.from === 'all' ? 'All Data' : new Date(trendData.period?.from).toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>TO</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{trendData.period?.to === 'all' ? 'Present' : new Date(trendData.period?.to).toLocaleDateString()}</Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Box>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>GROUPED BY</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'capitalize' }}>{GROUP_BY_OPTIONS.find(opt => opt.value === groupBy)?.label || groupBy}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Section 2: Pareto Analysis */}
          <Paper sx={{ p: 1.5, mb: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1.5, color: COLORS.primary }}>
              📊 Pareto Analysis - Top Defects
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="name" tick={{ fontSize: 10, angle: -45, textAnchor: 'end', height: 70 }} height={80} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} label={{ value: 'Occurrences', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 100]} label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', style: { fontSize: '10px' } }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="count" fill={COLORS.primary} name="Occurrences" barSize={40}>
                  {paretoData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke={COLORS.accent} name="Cumulative %" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>

          {/* Defect Details Table */}
          <Paper sx={{ mb: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'auto', boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, p: 1.5, pb: 0, color: COLORS.primary }}>Defect Code Details</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.primary }}>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600, py: 1 }}>Defect Code</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600, py: 1 }}>Defect Name</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600, py: 1 }}>Category</TableCell>
                    <TableCell align="right" sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600, py: 1 }}>Count</TableCell>
                    <TableCell align="right" sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600, py: 1 }}>%</TableCell>
                    <TableCell align="right" sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600, py: 1 }}>Cumulative %</TableCell>
                    <TableCell align="right" sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600, py: 1 }}>Total Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paretoData.map((defect, index) => (
                    <TableRow key={defect.code} hover sx={{ '& .MuiTableCell-root': { py: 0.75, fontSize: '0.7rem' } }}>
                      <TableCell><Chip label={defect.code} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary }} /></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 500 }}>{defect.name}</Typography></TableCell>
                      <TableCell>{defect.category}</TableCell>
                      <TableCell align="right"><b>{defect.count}</b></TableCell>
                      <TableCell align="right">{defect.percentage}%</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 50, height: 3, bgcolor: COLORS.border, borderRadius: 1, overflow: 'hidden' }}>
                            <Box sx={{ width: `${defect.cumulative}%`, height: '100%', bgcolor: COLORS.accent }} />
                          </Box>
                          <Typography sx={{ fontSize: '0.65rem' }}>{defect.cumulative.toFixed(1)}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{defect.total_quantity?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Section 3: Distribution Analysis */}
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none', height: '100%' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: COLORS.primary }}>🎯 Severity Distribution</Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={severityData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                      {severityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none', height: '100%' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: COLORS.primary }}>📊 Defect Distribution</Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={paretoData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="name" tick={{ fontSize: 9, angle: -45, textAnchor: 'end' }} height={80} />
                    <YAxis tick={{ fontSize: 10 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.secondary} name="Occurrences" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 1.5 }}>
          <Typography sx={{ color: COLORS.text.secondary }}>No data available</Typography>
        </Paper>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} variant="filled" sx={{ fontSize: '0.7rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default NcrTrendAnalysis;