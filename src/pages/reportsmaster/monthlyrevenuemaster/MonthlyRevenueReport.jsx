import React, { useState, useEffect, useCallback } from 'react';
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
  Tooltip,
  Typography,
  Snackbar,
  Stack,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  TrendingUp as RevenueIcon,
  Business as CustomerIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  AccountBalance as TaxIcon,
  Assessment as ReportIcon,
  FilterList as FilterIcon,
  PaidOutlined as PaidIcon,
  BarChart as ChartIcon,
  ShowChart as LineChartIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// ─── COLOR CONSTANTS (matching Gstr3bData) ──────────────────────────────────
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  blue: '#2563EB',
  blueLight: '#EFF6FF',
  green: '#059669',
  greenLight: '#D1FAE5',
  amber: '#D97706',
  amberLight: '#FEF3C7',
  red: '#DC2626',
  redLight: '#FEE2E2',
  violet: '#7C3AED',
  violetLight: '#F5F3FF',
  text: {
    primary: '#0F1923',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    page: '#F1F5F6',
    stripe: '#F7FAFB',
    hover: '#F0FDF9',
    tableHeader: '#063C3F',
  },
  border: '#DDE3EB',
  chart: {
    revenue: '#063C3F',
    taxable: '#F59E0B',
    count: '#10B981',
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getMonthName = (month) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1] || month;
};

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, icon: Icon, color }) => (
  <Box sx={{
    flex: 1, minWidth: 120,
    px: 1.8, py: 1.4,
    borderRadius: 2,
    bgcolor: color?.bg || COLORS.background.white,
    border: `1px solid ${color?.border || COLORS.border}`,
    position: 'relative', overflow: 'hidden',
  }}>
    <Box sx={{ position: 'absolute', right: -8, top: -8, opacity: 0.07 }}>
      {Icon && <Icon sx={{ fontSize: 54, color: color?.icon || COLORS.primary }} />}
    </Box>
    <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: color?.label || COLORS.text.tertiary, mb: 0.3 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: color?.value || COLORS.text.primary, lineHeight: 1.2, fontFamily: 'monospace' }}>
      {value}
    </Typography>
    {sub && <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, mt: 0.2 }}>{sub}</Typography>}
  </Box>
);

// ─── SECTION PANEL ────────────────────────────────────────────────────────────
const SectionPanel = ({ title, subtitle, accentColor, icon: Icon, children, badge }) => (
  <Paper sx={{
    borderRadius: 2, overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 1px 4px rgba(6,60,63,0.06)',
    mb: 2,
  }}>
    <Box sx={{
      px: 2, py: 1.2,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      bgcolor: COLORS.background.stripe,
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 3, height: 16, borderRadius: 2, bgcolor: accentColor || COLORS.primary }} />
        <Box sx={{
          width: 26, height: 26, borderRadius: 1, bgcolor: accentColor || COLORS.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9,
        }}>
          {Icon && <Icon sx={{ fontSize: '0.85rem', color: '#fff' }} />}
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.primary }}>{title}</Typography>
          {subtitle && <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary }}>{subtitle}</Typography>}
        </Box>
      </Box>
      {badge && (
        <Chip label={badge} size="small" sx={{ fontSize: '0.58rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 700 }} />
      )}
    </Box>
    <Box sx={{ p: 2 }}>{children}</Box>
  </Paper>
);

// ─── KEY-VALUE ROW ────────────────────────────────────────────────────────────
const KVRow = ({ label, value, mono, color, bold, divider }) => (
  <>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.6 }}>
      <Typography sx={{ fontSize: '0.68rem', color: COLORS.text.secondary }}>{label}</Typography>
      <Typography sx={{
        fontSize: '0.72rem',
        fontWeight: bold ? 700 : 500,
        color: color || COLORS.text.primary,
        fontFamily: mono ? 'monospace' : 'inherit',
      }}>
        {value}
      </Typography>
    </Box>
    {divider && <Divider sx={{ borderStyle: 'dashed' }} />}
  </>
);

// ─── CUSTOMER TABLE ROW ───────────────────────────────────────────────────────
const CustomerRow = ({ customer }) => (
  <TableRow hover sx={{ '&:hover': { bgcolor: COLORS.background.hover } }}>
    <TableCell sx={{ fontSize: '0.7rem', py: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar sx={{ width: 26, height: 26, bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.65rem', fontWeight: 700 }}>
          {customer.customer_name ? customer.customer_name.charAt(0).toUpperCase() : '?'}
        </Avatar>
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: COLORS.text.primary }}>
          {customer.customer_name || 'Unknown'}
        </Typography>
      </Stack>
    </TableCell>
    <TableCell sx={{ fontSize: '0.7rem', textAlign: 'center', py: 1 }}>
      <Chip
        label={customer.invoice_count}
        size="small"
        sx={{ fontSize: '0.62rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 700 }}
      />
    </TableCell>
    <TableCell sx={{ fontSize: '0.7rem', textAlign: 'right', py: 1, fontFamily: 'monospace', color: COLORS.text.secondary }}>
      ₹{formatCurrency(customer.taxable_total || 0)}
    </TableCell>
    <TableCell sx={{ fontSize: '0.7rem', textAlign: 'right', py: 1, fontFamily: 'monospace', color: COLORS.amber }}>
      ₹{formatCurrency(customer.gst_total || 0)}
    </TableCell>
    <TableCell sx={{ fontSize: '0.7rem', textAlign: 'right', py: 1, fontFamily: 'monospace', fontWeight: 700, color: COLORS.primary }}>
      ₹{formatCurrency(customer.grand_total || 0)}
    </TableCell>
    <TableCell sx={{ fontSize: '0.7rem', textAlign: 'right', py: 1 }}>
      <Chip
        label={customer.outstanding === 0 ? 'Paid' : `₹${formatCurrency(customer.outstanding)}`}
        size="small"
        sx={{
          fontSize: '0.62rem', height: 22, fontWeight: 600,
          bgcolor: customer.outstanding === 0 ? COLORS.greenLight : COLORS.redLight,
          color: customer.outstanding === 0 ? COLORS.green : COLORS.red,
        }}
      />
    </TableCell>
  </TableRow>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const MonthlyRevenueReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const monthOptions = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/invoices/reports/monthly-revenue?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load revenue report');
        setReportData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load revenue report');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => { fetchReportData(); }, [fetchReportData]);

  const showNotification = (msg, sev) => setSnackbar({ open: true, message: msg, severity: sev });

  const periodLabel = `${monthOptions.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;
  const summary = reportData?.summary || {};
  const byCustomer = reportData?.by_customer || [];
  const trend12m = reportData?.trend_12m || [];

  const chartData = trend12m.map(item => ({
    label: `${getMonthName(item._id?.m)} ${item._id?.y}`,
    revenue: item.grand_total || 0,
    taxable: item.taxable_total || 0,
    count: item.invoice_count || 0,
  })).reverse();

  const grandTotal = summary.grand || 0;
  const taxableTotal = summary.taxable || 0;
  const gstTotal = summary.gst || 0;
  const outstandingTotal = summary.outstanding || 0;

  return (
    <Box sx={{ bgcolor: COLORS.background.page, minHeight: '100vh', p: { xs: 1.5, md: 2.5 } }}>

      {/* ─── PAGE HEADER ─── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 1.5,
            bgcolor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RevenueIcon sx={{ fontSize: '1.1rem', color: '#fff' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary, lineHeight: 1.1 }}>
              Monthly Revenue Report
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              Revenue · GST · Customer Breakdown · Trends
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh Data">
          <span>
            <IconButton
              onClick={() => { fetchReportData(); showNotification('Refreshed', 'success'); }}
              disabled={loading}
              size="small"
              sx={{ bgcolor: COLORS.background.white, border: `1px solid ${COLORS.border}`, borderRadius: 1.5, '&:hover': { bgcolor: COLORS.primaryLight } }}
            >
              <RefreshIcon fontSize="small" sx={{ color: COLORS.primary }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* ─── FILTER ROW ─── */}
      <Paper sx={{
        p: 1.5, mb: 2, borderRadius: 2,
        bgcolor: COLORS.background.white,
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 1px 4px rgba(6,60,63,0.06)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
          <FilterIcon sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }} />
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.text.tertiary }}>
            Report Parameters
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
          <Box sx={{ flex: 2 }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Month
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                startAdornment={<CalendarIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary, mr: 0.5 }} />}
                sx={{ borderRadius: 1.5, fontSize: '0.75rem', bgcolor: COLORS.background.page }}
              >
                {monthOptions.map(o => (
                  <MenuItem key={o.value} value={o.value} sx={{ fontSize: '0.75rem' }}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1, minWidth: 120 }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Year
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{ borderRadius: 1.5, fontSize: '0.75rem', bgcolor: COLORS.background.page }}
              >
                {yearOptions.map(o => (
                  <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {/* ─── LOADING / ERROR ─── */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
          <CircularProgress size={28} sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Fetching revenue data…</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.75rem' }}>{error}</Alert>
      ) : reportData ? (
        <>
          {/* ─── REPORT HEADER BANNER ─── */}
          <Paper sx={{
            mb: 2, borderRadius: 2, overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 2px 8px rgba(6,60,63,0.10)',
          }}>
            {/* Gradient strip */}
            <Box sx={{
              px: 2.5, py: 1.5,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0A5A5E 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1,
            }}>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.2 }}>
                  Revenue Summary Statement
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                  Monthly Revenue & Tax Analysis
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)' }}>
                  Revenue · GST · Customers · Trends &nbsp;·&nbsp; {periodLabel}
                </Typography>
              </Box>
              <Chip
                label={periodLabel}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.65rem', height: 24, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}
              />
            </Box>

            {/* 5-metric summary strip */}
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff' }}>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <MetricCard
                  label="Invoices"
                  value={summary.count || 0}
                  sub="this period"
                  icon={ReceiptIcon}
                  color={{ bg: COLORS.primaryLight, border: '#C7DFE1', label: COLORS.primary, value: COLORS.primaryDark, icon: COLORS.primary }}
                />
                <MetricCard
                  label="Total Revenue"
                  value={`₹${formatCurrency(grandTotal)}`}
                  sub="incl. GST"
                  icon={MoneyIcon}
                  color={{ bg: COLORS.greenLight, border: '#A7F3D0', label: '#047857', value: '#064E3B', icon: COLORS.green }}
                />
                <MetricCard
                  label="Taxable Value"
                  value={`₹${formatCurrency(taxableTotal)}`}
                  sub="before tax"
                  icon={RevenueIcon}
                  color={{ bg: COLORS.blueLight, border: '#BFDBFE', label: '#1D4ED8', value: '#1E3A8A', icon: COLORS.blue }}
                />
                <MetricCard
                  label="GST Collected"
                  value={`₹${formatCurrency(gstTotal)}`}
                  sub="total tax"
                  icon={TaxIcon}
                  color={{ bg: COLORS.amberLight, border: '#FDE68A', label: COLORS.amber, value: '#78350F', icon: COLORS.amber }}
                />
                <MetricCard
                  label="Outstanding"
                  value={`₹${formatCurrency(outstandingTotal)}`}
                  sub="pending collection"
                  icon={PaidIcon}
                  color={{
                    bg: outstandingTotal > 0 ? COLORS.redLight : COLORS.greenLight,
                    border: outstandingTotal > 0 ? '#FECACA' : '#A7F3D0',
                    label: outstandingTotal > 0 ? COLORS.red : COLORS.green,
                    value: outstandingTotal > 0 ? '#7F1D1D' : '#064E3B',
                    icon: outstandingTotal > 0 ? COLORS.red : COLORS.green,
                  }}
                />
              </Stack>
            </Box>
          </Paper>

          {/* ─── REVENUE SUMMARY SECTION ─── */}
          <SectionPanel
            title="Revenue Summary"
            subtitle="Taxable value, GST collected, and collection status"
            accentColor={COLORS.green}
            icon={MoneyIcon}
            badge={`${summary.count || 0} invoices`}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Box sx={{ bgcolor: COLORS.background.stripe, borderRadius: 1.5, p: 1.5 }}>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.text.tertiary, mb: 1 }}>
                    Period Totals
                  </Typography>
                  <KVRow label="Total Invoices" value={summary.count || 0} divider />
                  <KVRow label="Taxable Value" value={`₹${formatCurrency(taxableTotal)}`} mono bold color={COLORS.blue} divider />
                  <KVRow label="GST Collected" value={`₹${formatCurrency(gstTotal)}`} mono color={COLORS.amber} divider />
                  <KVRow label="Grand Total Revenue" value={`₹${formatCurrency(grandTotal)}`} mono bold color={COLORS.primary} divider />
                  <KVRow label="Outstanding" value={`₹${formatCurrency(outstandingTotal)}`} mono color={outstandingTotal > 0 ? COLORS.red : COLORS.green} />
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Box>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.text.tertiary, mb: 1 }}>
                    Revenue Composition
                  </Typography>
                  {/* Revenue composition pills */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                    {[
                      { label: 'Taxable', val: taxableTotal, color: COLORS.blue, bg: COLORS.blueLight, border: '#BFDBFE' },
                      { label: 'GST', val: gstTotal, color: COLORS.amber, bg: COLORS.amberLight, border: '#FDE68A' },
                      { label: 'Total', val: grandTotal, color: COLORS.primary, bg: COLORS.primaryLight, border: '#C7DFE1' },
                    ].map(({ label, val, color, bg, border }) => (
                      <Box key={label} sx={{ px: 1.5, py: 0.8, borderRadius: 1.5, bgcolor: bg, border: `1px solid ${border}`, minWidth: 80 }}>
                        <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color, mb: 0.2 }}>{label}</Typography>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color, fontFamily: 'monospace' }}>₹{formatCurrency(val)}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  {/* Visual bar: taxable vs gst */}
                  {grandTotal > 0 && [
                    { label: 'Taxable', val: taxableTotal, color: COLORS.blue },
                    { label: 'GST', val: gstTotal, color: COLORS.amber },
                  ].map(({ label, val, color }) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, width: 44 }}>{label}</Typography>
                      <Box sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: COLORS.border, overflow: 'hidden' }}>
                        <Box sx={{
                          height: '100%', borderRadius: 3, bgcolor: color,
                          width: `${Math.round((val / grandTotal) * 100)}%`,
                          transition: 'width 0.6s ease',
                        }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, width: 36, textAlign: 'right' }}>
                        {grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0}%
                      </Typography>
                    </Box>
                  ))}
                  {/* Outstanding note */}
                  {outstandingTotal > 0 && (
                    <Box sx={{ mt: 1.5, px: 1.5, py: 1, borderRadius: 1.5, bgcolor: COLORS.redLight, border: `1px solid #FECACA` }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: '0.62rem', color: COLORS.red }}>Collection pending</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#7F1D1D', fontFamily: 'monospace' }}>
                          {Math.round((outstandingTotal / grandTotal) * 100)}% uncollected
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </SectionPanel>

          {/* ─── 12-MONTH REVENUE TREND CHART ─── */}
          {chartData.length > 0 && (
            <SectionPanel
              title="12-Month Revenue Trend"
              subtitle="Bar chart — revenue vs taxable value over last 12 months"
              accentColor={COLORS.primary}
              icon={ChartIcon}
              badge={`${chartData.length} months`}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 9.5, fill: '#6B7280' }}
                    interval={0}
                    angle={-40}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 9.5, fill: '#6B7280' }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                    width={54}
                  />
                  <RechartsTooltip
                    formatter={(value) => [`₹${formatCurrency(value)}`, '']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                  <Bar dataKey="revenue" name="Revenue (₹)" fill={COLORS.chart.revenue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="taxable" name="Taxable Value (₹)" fill={COLORS.chart.taxable} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionPanel>
          )}

          {/* ─── INVOICE COUNT TREND ─── */}
          {chartData.length > 0 && (
            <SectionPanel
              title="Invoice Count Trend"
              subtitle="Line chart — number of invoices per month"
              accentColor={COLORS.green}
              icon={LineChartIcon}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 9.5, fill: '#6B7280' }}
                    interval={0}
                    angle={-40}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 9.5, fill: '#6B7280' }} width={36} />
                  <RechartsTooltip
                    formatter={(value) => [value, '']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Invoice Count"
                    stroke={COLORS.chart.count}
                    strokeWidth={2}
                    dot={{ r: 3.5, fill: COLORS.chart.count }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </SectionPanel>
          )}

          {/* ─── CUSTOMER-WISE BREAKDOWN TABLE ─── */}
          <SectionPanel
            title="Customer-wise Revenue Breakdown"
            subtitle="Per-customer totals for the selected period"
            accentColor={COLORS.blue}
            icon={CustomerIcon}
            badge={`${byCustomer.length} customers`}
          >
            <Paper sx={{ width: '100%', borderRadius: 1.5, overflow: 'hidden', boxShadow: 'none', border: `1px solid ${COLORS.border}` }}>
              <TableContainer sx={{ maxHeight: 380 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {['Customer', 'Invoices', 'Taxable Value', 'GST', 'Total Revenue', 'Outstanding'].map((h, i) => (
                        <TableCell key={h} sx={{
                          fontWeight: 700, fontSize: '0.62rem', color: COLORS.text.light, py: 1,
                          bgcolor: COLORS.background.tableHeader,
                          textAlign: i >= 2 ? 'right' : i === 1 ? 'center' : 'left',
                          letterSpacing: '0.04em',
                        }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {byCustomer.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                          <CustomerIcon sx={{ fontSize: 30, color: COLORS.text.tertiary, mb: 0.5, display: 'block', mx: 'auto' }} />
                          <Typography sx={{ fontSize: '0.72rem', color: COLORS.text.secondary }}>
                            No customer data available for this period
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      byCustomer.map((customer, index) => (
                        <CustomerRow key={customer._id || index} customer={customer} />
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </SectionPanel>

          {/* ─── CONSOLIDATED FOOTER TOTALS ─── */}
          <Paper sx={{
            borderRadius: 2, overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <Box sx={{ px: 2, py: 1.2, bgcolor: COLORS.background.stripe, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 3, height: 14, borderRadius: 2, bgcolor: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: COLORS.text.secondary }}>
                Consolidated Summary
              </Typography>
            </Box>
            <Box sx={{ p: 0 }}>
              {[
                { label: 'Taxable Value', val: taxableTotal, color: COLORS.blue, icon: RevenueIcon },
                { label: 'GST Collected', val: gstTotal, color: COLORS.amber, icon: TaxIcon },
                { label: 'Total Revenue', val: grandTotal, color: COLORS.green, icon: MoneyIcon },
                { label: 'Outstanding', val: outstandingTotal, color: outstandingTotal > 0 ? COLORS.red : COLORS.green, icon: PaidIcon, bold: true },
              ].map(({ label, val, color, icon: Icon, bold }, idx) => (
                <Box
                  key={label}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 2, py: 1,
                    bgcolor: bold ? COLORS.primary : (idx % 2 === 0 ? '#fff' : COLORS.background.stripe),
                    borderTop: bold ? `2px solid ${COLORS.border}` : 'none',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon sx={{ fontSize: '0.85rem', color: bold ? 'rgba(255,255,255,0.7)' : color }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: bold ? 700 : 500, color: bold ? '#fff' : COLORS.text.secondary }}>
                      {label}
                    </Typography>
                  </Stack>
                  <Typography sx={{
                    fontSize: bold ? '0.85rem' : '0.75rem',
                    fontWeight: bold ? 800 : 600,
                    color: bold ? '#FCD34D' : color,
                    fontFamily: 'monospace',
                  }}>
                    ₹{formatCurrency(val)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      ) : (
        <Paper sx={{
          p: 4, textAlign: 'center', borderRadius: 2,
          border: `2px dashed ${COLORS.border}`,
          bgcolor: COLORS.background.white, boxShadow: 'none',
        }}>
          <ReportIcon sx={{ fontSize: 36, color: COLORS.text.tertiary, mb: 1 }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
            Select month and year to generate the report
          </Typography>
          <Typography sx={{ fontSize: '0.68rem', color: COLORS.text.tertiary }}>
            Monthly revenue summarizes invoices, GST collected, and customer performance
          </Typography>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MonthlyRevenueReport;