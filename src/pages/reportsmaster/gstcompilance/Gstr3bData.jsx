import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
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
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Description as GstrIcon,
  AccountBalance as TaxIcon,
  TrendingUp as OutwardIcon,
  TrendingDown as InwardIcon,
  Payment as PayableIcon,
  FilterList as FilterIcon,
  CalendarMonth as CalendarIcon,
  SwapVert as NetIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ─── METRIC CARD ────────────────────────────────────────────────────────────
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

// ─── TAX PILL ROW: IGST / CGST / SGST horizontal strip ────────────────────
const TaxPillRow = ({ igst, cgst, sgst, total }) => (
  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
    {[
      { label: 'IGST', val: igst, color: COLORS.blue, bg: COLORS.blueLight, border: '#BFDBFE' },
      { label: 'CGST', val: cgst, color: COLORS.green, bg: COLORS.greenLight, border: '#A7F3D0' },
      { label: 'SGST', val: sgst, color: COLORS.amber, bg: COLORS.amberLight, border: '#FDE68A' },
      ...(total !== undefined ? [{ label: 'Total', val: total, color: COLORS.primary, bg: COLORS.primaryLight, border: '#C7DFE1' }] : []),
    ].map(({ label, val, color, bg, border }) => (
      <Box key={label} sx={{ px: 1.5, py: 0.8, borderRadius: 1.5, bgcolor: bg, border: `1px solid ${border}`, minWidth: 80 }}>
        <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color, mb: 0.2 }}>{label}</Typography>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color, fontFamily: 'monospace' }}>₹{formatCurrency(val || 0)}</Typography>
      </Box>
    ))}
  </Stack>
);

// ─── SECTION PANEL (outward / ITC / payable) ──────────────────────────────
const SectionPanel = ({ title, subtitle, accentColor, icon: Icon, children, badge }) => (
  <Paper sx={{
    borderRadius: 2, overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 1px 4px rgba(6,60,63,0.06)',
    mb: 2,
  }}>
    {/* Header row */}
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

// ─── KEY-VALUE ROW ─────────────────────────────────────────────────────────
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

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
const Gstr3bData = () => {
  const [gstrData, setGstrData] = useState(null);
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

  const fetchGstrData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/invoices/gstr3b-data?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setGstrData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load GSTR-3B data');
        setGstrData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load GSTR-3B data');
      setGstrData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => { fetchGstrData(); }, [fetchGstrData]);

  const showNotification = (msg, sev) => setSnackbar({ open: true, message: msg, severity: sev });

  const periodLabel = `${monthOptions.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;
  const table31 = gstrData?.table_3_1 || {};
  const table4 = gstrData?.table_4 || {};
  const netTaxPayable = gstrData?.net_tax_payable || {};

  const outwardTotal = (table31.igst || 0) + (table31.cgst || 0) + (table31.sgst || 0);
  const netPayableTotal = netTaxPayable.total || 0;

  return (
    <Box sx={{ bgcolor: COLORS.background.page, minHeight: '100vh', p: { xs: 1.5, md: 2.5 } }}>

      {/* ─── PAGE HEADER ─── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 1.5,
            bgcolor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GstrIcon sx={{ fontSize: '1.1rem', color: '#fff' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary, lineHeight: 1.1 }}>
              GSTR-3B Data
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              GST Act — Monthly Summary Return
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh Data">
          <span>
            <IconButton
              onClick={() => { fetchGstrData(); showNotification('Refreshed', 'success'); }}
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
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Fetching GSTR-3B data…</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.75rem' }}>{error}</Alert>
      ) : gstrData ? (
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
                  GSTR-3B Summary Statement
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                  Monthly Tax Summary Return
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)' }}>
                  Outward Supplies · ITC · Net Payable &nbsp;·&nbsp; {periodLabel}
                </Typography>
              </Box>
              <Chip
                label={periodLabel}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.65rem', height: 24, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}
              />
            </Box>

            {/* 4-metric summary strip */}
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff' }}>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <MetricCard
                  label="Invoices"
                  value={table31.invoice_count || 0}
                  sub="outward supplies"
                  icon={ReceiptIcon}
                  color={{ bg: COLORS.primaryLight, border: '#C7DFE1', label: COLORS.primary, value: COLORS.primaryDark, icon: COLORS.primary }}
                />
                <MetricCard
                  label="Taxable Value"
                  value={`₹${formatCurrency(table31.taxable_value || 0)}`}
                  sub="before tax"
                  icon={OutwardIcon}
                  color={{ bg: COLORS.greenLight, border: '#A7F3D0', label: '#047857', value: '#064E3B', icon: COLORS.green }}
                />
                <MetricCard
                  label="Outward Tax"
                  value={`₹${formatCurrency(outwardTotal)}`}
                  sub="IGST + CGST + SGST"
                  icon={TaxIcon}
                  color={{ bg: COLORS.amberLight, border: '#FDE68A', label: COLORS.amber, value: '#78350F', icon: COLORS.amber }}
                />
                <MetricCard
                  label="Eligible ITC"
                  value={`₹${formatCurrency(table4.total || 0)}`}
                  sub="input tax credit"
                  icon={InwardIcon}
                  color={{ bg: COLORS.blueLight, border: '#BFDBFE', label: '#1D4ED8', value: '#1E3A8A', icon: COLORS.blue }}
                />
                <MetricCard
                  label="Net Payable"
                  value={`₹${formatCurrency(netPayableTotal)}`}
                  sub="after ITC setoff"
                  icon={PayableIcon}
                  color={{ bg: COLORS.redLight, border: '#FECACA', label: COLORS.red, value: '#7F1D1D', icon: COLORS.red }}
                />
              </Stack>
            </Box>
          </Paper>

          {/* ─── TABLE 3.1 — OUTWARD SUPPLIES ─── */}
          <SectionPanel
            title="Table 3.1 — Outward Taxable Supplies"
            subtitle="Details of outward supplies and inward supplies liable to reverse charge"
            accentColor={COLORS.green}
            icon={OutwardIcon}
            badge={`${table31.invoice_count || 0} invoices`}
          >
            <Grid container spacing={2}>
              {/* Details column */}
              <Grid item xs={12} md={5}>
                <Box sx={{ bgcolor: COLORS.background.stripe, borderRadius: 1.5, p: 1.5 }}>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.text.tertiary, mb: 1 }}>
                    Supply Details
                  </Typography>
                  <KVRow label="Nature of supply" value={table31.description || '—'} divider />
                  <KVRow label="Taxable Value" value={`₹${formatCurrency(table31.taxable_value || 0)}`} mono bold color={COLORS.primary} divider />
                  <KVRow label="Invoice Count" value={table31.invoice_count || 0} />
                </Box>
              </Grid>
              {/* Tax pills column */}
              <Grid item xs={12} md={7}>
                <Box>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.text.tertiary, mb: 1 }}>
                    Tax Component Breakdown
                  </Typography>
                  <TaxPillRow igst={table31.igst} cgst={table31.cgst} sgst={table31.sgst} total={outwardTotal} />
                  {/* Visual bar */}
                  <Box sx={{ mt: 1.5 }}>
                    {outwardTotal > 0 && [
                      { label: 'IGST', val: table31.igst || 0, color: COLORS.blue },
                      { label: 'CGST', val: table31.cgst || 0, color: COLORS.green },
                      { label: 'SGST', val: table31.sgst || 0, color: COLORS.amber },
                    ].map(({ label, val, color }) => (
                      <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, width: 32 }}>{label}</Typography>
                        <Box sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: COLORS.border, overflow: 'hidden' }}>
                          <Box sx={{
                            height: '100%', borderRadius: 3, bgcolor: color,
                            width: `${Math.round((val / outwardTotal) * 100)}%`,
                            transition: 'width 0.6s ease',
                          }} />
                        </Box>
                        <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, width: 36, textAlign: 'right' }}>
                          {outwardTotal > 0 ? Math.round((val / outwardTotal) * 100) : 0}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </SectionPanel>

          {/* ─── TABLE 4 — ELIGIBLE ITC ─── */}
          <SectionPanel
            title="Table 4 — Eligible Input Tax Credit (ITC)"
            subtitle="ITC available for setoff against outward tax liability"
            accentColor={COLORS.blue}
            icon={InwardIcon}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Box sx={{ bgcolor: COLORS.background.stripe, borderRadius: 1.5, p: 1.5 }}>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.text.tertiary, mb: 1 }}>
                    ITC Details
                  </Typography>
                  <KVRow label="Nature of ITC" value={table4.description || '—'} divider />
                  <KVRow label="Total ITC Available" value={`₹${formatCurrency(table4.total || 0)}`} mono bold color={COLORS.blue} />
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Box>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.text.tertiary, mb: 1 }}>
                    ITC Component Breakdown
                  </Typography>
                  <TaxPillRow igst={table4.igst} cgst={table4.cgst} sgst={table4.sgst} total={table4.total} />
                  {/* ITC vs Outward Tax comparison note */}
                  {outwardTotal > 0 && (
                    <Box sx={{ mt: 1.5, px: 1.5, py: 1, borderRadius: 1.5, bgcolor: COLORS.blueLight, border: `1px solid #BFDBFE` }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: '0.62rem', color: '#1D4ED8' }}>ITC covers</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>
                          {Math.min(100, Math.round(((table4.total || 0) / outwardTotal) * 100))}% of outward tax
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </SectionPanel>

          {/* ─── NET TAX PAYABLE ─── */}
          <SectionPanel
            title="Net Tax Payable"
            subtitle="Tax liability after adjusting eligible ITC"
            accentColor={COLORS.red}
            icon={PayableIcon}
          >
            <Grid container spacing={2}>
              {/* Summary column */}
              <Grid item xs={12} md={5}>
                <Box sx={{ bgcolor: COLORS.redLight, borderRadius: 1.5, p: 1.5, border: `1px solid #FECACA` }}>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.red, mb: 1 }}>
                    Liability Summary
                  </Typography>
                  <KVRow label="Outward Tax" value={`₹${formatCurrency(outwardTotal)}`} mono divider />
                  <KVRow label="Less: ITC" value={`(₹${formatCurrency(table4.total || 0)})`} mono color={COLORS.blue} divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.8, mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.red }}>Net Payable</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: COLORS.red, fontFamily: 'monospace' }}>
                      ₹{formatCurrency(netPayableTotal)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* Tax component column */}
              <Grid item xs={12} md={7}>
                <Box>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.text.tertiary, mb: 1 }}>
                    Payable by Tax Head
                  </Typography>
                  <TaxPillRow igst={netTaxPayable.igst} cgst={netTaxPayable.cgst} sgst={netTaxPayable.sgst} total={netTaxPayable.total} />
                  {/* Net payable bar */}
                  {netPayableTotal > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                      {[
                        { label: 'IGST', val: netTaxPayable.igst || 0, color: COLORS.blue },
                        { label: 'CGST', val: netTaxPayable.cgst || 0, color: COLORS.green },
                        { label: 'SGST', val: netTaxPayable.sgst || 0, color: COLORS.amber },
                      ].map(({ label, val, color }) => (
                        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, width: 32 }}>{label}</Typography>
                          <Box sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: COLORS.border, overflow: 'hidden' }}>
                            <Box sx={{
                              height: '100%', borderRadius: 3, bgcolor: color,
                              width: `${Math.round((val / netPayableTotal) * 100)}%`,
                              transition: 'width 0.6s ease',
                            }} />
                          </Box>
                          <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, width: 36, textAlign: 'right' }}>
                            ₹{formatCurrency(val)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
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
                { label: 'Taxable Value (Outward)', val: table31.taxable_value || 0, color: COLORS.green, icon: OutwardIcon },
                { label: 'Total Outward Tax', val: outwardTotal, color: COLORS.amber, icon: TaxIcon },
                { label: 'Eligible ITC', val: table4.total || 0, color: COLORS.blue, icon: InwardIcon, prefix: '(−) ' },
                { label: 'Net Tax Payable', val: netPayableTotal, color: COLORS.red, icon: PayableIcon, bold: true },
              ].map(({ label, val, color, icon: Icon, prefix = '', bold }, idx, arr) => (
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
                    {prefix}₹{formatCurrency(val)}
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
          <GstrIcon sx={{ fontSize: 36, color: COLORS.text.tertiary, mb: 1 }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
            Select month and year to generate the report
          </Typography>
          <Typography sx={{ fontSize: '0.68rem', color: COLORS.text.tertiary }}>
            GSTR-3B summarizes outward supplies, ITC, and net GST payable
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

export default Gstr3bData;