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
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Description as GstrIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  AccountBalance as TaxIcon,
  CreditCard as CreditIcon,
  FilterList as FilterIcon,
  CalendarMonth as CalendarIcon,
  Inventory2 as B2BIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  accent: '#0D9488',
  accentLight: '#CCFBF1',
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
  success: { bg: '#D1FAE5', text: '#065F46' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ─── SUMMARY METRIC CARD ───────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, icon: Icon, color }) => (
  <Box sx={{
    flex: 1, minWidth: 110,
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

// ─── INVOICE ITEMS TABLE ───────────────────────────────────────────────────
const InvoiceItemsTable = ({ items }) => (
  <Box sx={{ borderRadius: 1.5, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          {['Sl', 'Rate %', 'Taxable Value', 'IGST', 'CGST', 'SGST', 'Cess'].map((col, i) => (
            <TableCell key={col} sx={{
              fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: COLORS.text.light, bgcolor: COLORS.background.tableHeader,
              py: 0.8, px: 1.2, borderBottom: 'none',
              textAlign: i >= 2 ? 'right' : 'left',
            }}>
              {col}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, idx) => (
          <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? '#fff' : COLORS.background.stripe }}>
            <TableCell sx={{ fontSize: '0.65rem', py: 0.7, px: 1.2, color: COLORS.text.tertiary }}>{item.num}</TableCell>
            <TableCell sx={{ fontSize: '0.65rem', py: 0.7, px: 1.2 }}>
              <Chip label={`${item.itm_det.rt}%`} size="small" sx={{ fontSize: '0.58rem', height: 18, bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 700 }} />
            </TableCell>
            <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.7, px: 1.2, fontFamily: 'monospace', fontWeight: 600, color: COLORS.text.primary }}>₹{formatCurrency(item.itm_det.txval)}</TableCell>
            <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.7, px: 1.2, fontFamily: 'monospace', color: COLORS.blue }}>₹{formatCurrency(item.itm_det.iamt || 0)}</TableCell>
            <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.7, px: 1.2, fontFamily: 'monospace', color: COLORS.green }}>₹{formatCurrency(item.itm_det.camt || 0)}</TableCell>
            <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.7, px: 1.2, fontFamily: 'monospace', color: COLORS.amber }}>₹{formatCurrency(item.itm_det.samt || 0)}</TableCell>
            <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.7, px: 1.2, fontFamily: 'monospace', color: COLORS.text.secondary }}>₹{formatCurrency(item.itm_det.csamt || 0)}</TableCell>
          </TableRow>
        ))}
        {/* subtotal row */}
        <TableRow sx={{ bgcolor: '#F0FDF9', borderTop: `2px solid ${COLORS.border}` }}>
          <TableCell colSpan={2} sx={{ fontSize: '0.6rem', py: 0.8, px: 1.2, fontWeight: 700, color: COLORS.primary }}>Subtotal</TableCell>
          <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.8, px: 1.2, fontFamily: 'monospace', fontWeight: 700, color: COLORS.text.primary }}>
            ₹{formatCurrency(items.reduce((s, i) => s + (i.itm_det.txval || 0), 0))}
          </TableCell>
          <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.8, px: 1.2, fontFamily: 'monospace', fontWeight: 700, color: COLORS.blue }}>
            ₹{formatCurrency(items.reduce((s, i) => s + (i.itm_det.iamt || 0), 0))}
          </TableCell>
          <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.8, px: 1.2, fontFamily: 'monospace', fontWeight: 700, color: COLORS.green }}>
            ₹{formatCurrency(items.reduce((s, i) => s + (i.itm_det.camt || 0), 0))}
          </TableCell>
          <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.8, px: 1.2, fontFamily: 'monospace', fontWeight: 700, color: COLORS.amber }}>
            ₹{formatCurrency(items.reduce((s, i) => s + (i.itm_det.samt || 0), 0))}
          </TableCell>
          <TableCell align="right" sx={{ fontSize: '0.65rem', py: 0.8, px: 1.2, fontFamily: 'monospace', fontWeight: 700, color: COLORS.text.secondary }}>
            ₹{formatCurrency(items.reduce((s, i) => s + (i.itm_det.csamt || 0), 0))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Box>
);

// ─── B2B ACCORDION ─────────────────────────────────────────────────────────
const B2BInvoiceAccordion = ({ customer, index }) => {
  const [expanded, setExpanded] = useState(false);
  const totalValue = customer.inv.reduce((s, inv) => s + inv.val, 0);

  return (
    <Accordion
      expanded={expanded}
      onChange={(e, v) => setExpanded(v)}
      sx={{
        mb: 1, borderRadius: '10px !important', border: `1px solid ${COLORS.border}`,
        boxShadow: expanded ? '0 4px 12px rgba(6,60,63,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: '0 0 8px 0' },
        transition: 'box-shadow 0.2s',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary, fontSize: '1rem' }} />}
        sx={{
          px: 2, py: 0,
          minHeight: 52,
          bgcolor: expanded ? COLORS.primaryLight : COLORS.background.stripe,
          borderRadius: '10px',
          '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, minHeight: 52 },
          transition: 'background 0.2s',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', py: 0.5 }}>
          {/* Index badge */}
          <Box sx={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
            bgcolor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: '#fff' }}>{index + 1}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.text.primary, fontFamily: 'monospace' }}>
              {customer.ctin}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
              {customer.inv.length} invoice{customer.inv.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Value</Typography>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: COLORS.primary, fontFamily: 'monospace' }}>
                ₹{formatCurrency(totalValue)}
              </Typography>
            </Box>
            <Chip label={`${customer.inv.length} inv`} size="small" sx={{ fontSize: '0.58rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 700 }} />
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        {customer.inv.map((invoice, idx) => (
          <Box key={idx} sx={{ mx: 2, my: 1.5, p: 1.8, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, bgcolor: '#fff' }}>
            {/* Invoice header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.3}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.primary, fontFamily: 'monospace' }}>
                    {invoice.inum}
                  </Typography>
                  <Chip
                    label={invoice.inv_typ === 'R' ? 'Regular' : 'SEZ'}
                    size="small"
                    sx={{
                      fontSize: '0.58rem', height: 18, fontWeight: 700,
                      bgcolor: invoice.inv_typ === 'R' ? COLORS.greenLight : COLORS.blueLight,
                      color: invoice.inv_typ === 'R' ? COLORS.green : COLORS.blue,
                    }}
                  />
                </Stack>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                  Date: <span style={{ color: COLORS.text.secondary }}>{invoice.idt}</span>
                  &nbsp;·&nbsp; POS: <span style={{ color: COLORS.text.secondary }}>{invoice.pos}</span>
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Invoice Total</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.primary, fontFamily: 'monospace' }}>
                  ₹{formatCurrency(invoice.val)}
                </Typography>
              </Box>
            </Stack>
            <InvoiceItemsTable items={invoice.itms} />
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

// ─── CREDIT NOTE ACCORDION ─────────────────────────────────────────────────
const CreditNoteAccordion = ({ creditNote, index }) => {
  const [expanded, setExpanded] = useState(false);
  const totalValue = creditNote.nt.reduce((s, n) => s + n.val, 0);

  return (
    <Accordion
      expanded={expanded}
      onChange={(e, v) => setExpanded(v)}
      sx={{
        mb: 1, borderRadius: '10px !important', border: `1px solid ${COLORS.border}`,
        boxShadow: expanded ? '0 4px 12px rgba(220,38,38,0.07)' : '0 1px 3px rgba(0,0,0,0.04)',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: '0 0 8px 0' },
        transition: 'box-shadow 0.2s',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: COLORS.red, fontSize: '1rem' }} />}
        sx={{
          px: 2, py: 0, minHeight: 52,
          bgcolor: expanded ? COLORS.redLight : COLORS.background.stripe,
          borderRadius: '10px',
          '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, minHeight: 52 },
          transition: 'background 0.2s',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', py: 0.5 }}>
          <Box sx={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
            bgcolor: COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: '#fff' }}>{index + 1}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.text.primary, fontFamily: 'monospace' }}>
              {creditNote.ctin}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
              {creditNote.nt.length} credit note{creditNote.nt.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CN Total</Typography>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: COLORS.red, fontFamily: 'monospace' }}>
                ₹{formatCurrency(totalValue)}
              </Typography>
            </Box>
            <Chip label={`${creditNote.nt.length} CN`} size="small" sx={{ fontSize: '0.58rem', height: 20, bgcolor: COLORS.redLight, color: COLORS.red, fontWeight: 700 }} />
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        {creditNote.nt.map((note, idx) => (
          <Box key={idx} sx={{ mx: 2, my: 1.5, p: 1.8, borderRadius: 1.5, border: `1px solid #FECACA`, bgcolor: '#FFFBFB' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.3}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.red, fontFamily: 'monospace' }}>
                    {note.nt_num}
                  </Typography>
                  <Chip
                    label={note.ntty === 'C' ? 'Credit Note' : 'Debit Note'}
                    size="small"
                    sx={{ fontSize: '0.58rem', height: 18, bgcolor: COLORS.redLight, color: COLORS.red, fontWeight: 700 }}
                  />
                </Stack>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                  Date: <span style={{ color: COLORS.text.secondary }}>{note.nt_dt}</span>
                  &nbsp;·&nbsp; Reason: <span style={{ color: COLORS.text.secondary }}>{note.rsn}</span>
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: '0.58rem', color: COLORS.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CN Value</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.red, fontFamily: 'monospace' }}>
                  ₹{formatCurrency(note.val)}
                </Typography>
              </Box>
            </Stack>
            <InvoiceItemsTable items={note.itms} />
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
const Gstr1Data = () => {
  const [gstrData, setGstrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState(0);
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
        `${BASE_URL}/api/invoices/gstr1-data?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setGstrData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load GSTR-1 data');
        setGstrData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load GSTR-1 data');
      setGstrData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => { fetchGstrData(); }, [fetchGstrData]);

  const showNotification = (msg, sev) => setSnackbar({ open: true, message: msg, severity: sev });

  const periodLabel = gstrData?.period?.label ||
    `${monthOptions.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;
  const totals = gstrData?.totals || {};
  const b2bData = gstrData?.b2b || [];
  const cdnrData = gstrData?.cdnr || [];

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
              GSTR-1 Data
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              GST Act — Outward Supplies Return
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
          {/* Month */}
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
          {/* Year */}
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
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Fetching GSTR-1 data…</Typography>
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
            {/* Gradient top strip */}
            <Box sx={{
              px: 2.5, py: 1.5,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0A5A5E 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1,
            }}>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.2 }}>
                  GSTR-1 Return Statement
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, fontFamily: 'monospace' }}>
                  {gstrData.gstin}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)' }}>
                  Outward Supplies &nbsp;·&nbsp; {periodLabel}
                </Typography>
              </Box>
              <Chip
                label={periodLabel}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.65rem', height: 24, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}
              />
            </Box>

            {/* Summary metrics */}
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff' }}>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <MetricCard
                  label="B2B Invoices"
                  value={totals.total_invoices || 0}
                  sub="outward supplies"
                  icon={ReceiptIcon}
                  color={{ bg: COLORS.primaryLight, border: '#C7DFE1', label: COLORS.primary, value: COLORS.primaryDark, icon: COLORS.primary }}
                />
                <MetricCard
                  label="Taxable Value"
                  value={`₹${formatCurrency(totals.total_taxable_val || 0)}`}
                  sub="before tax"
                  icon={CategoryIcon}
                  color={{ bg: '#F0FDF4', border: '#BBF7D0', label: '#047857', value: '#064E3B', icon: COLORS.green }}
                />
                <MetricCard
                  label="IGST"
                  value={`₹${formatCurrency(totals.total_igst || 0)}`}
                  sub="inter-state"
                  icon={TaxIcon}
                  color={{ bg: COLORS.blueLight, border: '#BFDBFE', label: '#1D4ED8', value: '#1E3A8A', icon: COLORS.blue }}
                />
                <MetricCard
                  label="CGST"
                  value={`₹${formatCurrency(totals.total_cgst || 0)}`}
                  sub="central tax"
                  icon={TaxIcon}
                  color={{ bg: '#ECFDF5', border: '#A7F3D0', label: '#065F46', value: '#064E3B', icon: COLORS.green }}
                />
                <MetricCard
                  label="SGST"
                  value={`₹${formatCurrency(totals.total_sgst || 0)}`}
                  sub="state tax"
                  icon={TaxIcon}
                  color={{ bg: COLORS.amberLight, border: '#FDE68A', label: COLORS.amber, value: '#78350F', icon: COLORS.amber }}
                />
                <MetricCard
                  label="Grand Total"
                  value={`₹${formatCurrency(totals.total_grand || 0)}`}
                  sub="incl. all taxes"
                  icon={B2BIcon}
                  color={{ bg: COLORS.violetLight, border: '#DDD6FE', label: '#5B21B6', value: '#3B0764', icon: COLORS.violet }}
                />
              </Stack>
            </Box>

            {/* Credit notes sub-row (conditional) */}
            {(totals.total_credit_notes > 0 || totals.total_cn_value > 0) && (
              <Box sx={{ px: 2, pb: 1.5, bgcolor: '#fff', borderTop: `1px dashed ${COLORS.border}` }}>
                <Stack direction="row" spacing={1.5} mt={1.5} flexWrap="wrap" useFlexGap>
                  <MetricCard
                    label="Credit Notes"
                    value={totals.total_credit_notes || 0}
                    sub="issued this period"
                    icon={CreditIcon}
                    color={{ bg: COLORS.redLight, border: '#FECACA', label: COLORS.red, value: '#7F1D1D', icon: COLORS.red }}
                  />
                  <MetricCard
                    label="CN Value"
                    value={`₹${formatCurrency(totals.total_cn_value || 0)}`}
                    sub="total reversal"
                    icon={CreditIcon}
                    color={{ bg: COLORS.redLight, border: '#FECACA', label: COLORS.red, value: '#7F1D1D', icon: COLORS.red }}
                  />
                </Stack>
              </Box>
            )}
          </Paper>

          {/* ─── TABS + ACCORDIONS ─── */}
          <Paper sx={{
            borderRadius: 2, overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            {/* Tab bar */}
            <Box sx={{ bgcolor: COLORS.background.stripe, borderBottom: `1px solid ${COLORS.border}` }}>
              <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                sx={{
                  minHeight: 42,
                  '& .MuiTab-root': {
                    fontSize: '0.68rem', textTransform: 'none', minHeight: 42,
                    fontWeight: 600, color: COLORS.text.secondary,
                    '&.Mui-selected': { color: COLORS.primary },
                  },
                  '& .MuiTabs-indicator': { bgcolor: COLORS.primary, height: 2.5 },
                }}
              >
                <Tab
                  label={
                    <Stack direction="row" alignItems="center" spacing={0.8}>
                      <B2BIcon sx={{ fontSize: '0.85rem' }} />
                      <span>B2B Invoices</span>
                      <Chip label={b2bData.length} size="small" sx={{ fontSize: '0.58rem', height: 18, bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 700 }} />
                    </Stack>
                  }
                />
                <Tab
                  label={
                    <Stack direction="row" alignItems="center" spacing={0.8}>
                      <CreditIcon sx={{ fontSize: '0.85rem' }} />
                      <span>Credit Notes</span>
                      <Chip label={cdnrData.length} size="small" sx={{ fontSize: '0.58rem', height: 18, bgcolor: cdnrData.length ? COLORS.redLight : COLORS.background.stripe, color: cdnrData.length ? COLORS.red : COLORS.text.tertiary, fontWeight: 700 }} />
                    </Stack>
                  }
                />
              </Tabs>
            </Box>

            <Box sx={{ p: 2 }}>
              {/* Section label */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Box sx={{ width: 3, height: 14, borderRadius: 2, bgcolor: activeTab === 0 ? COLORS.accent : COLORS.red }} />
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: COLORS.text.secondary }}>
                  {activeTab === 0 ? `${b2bData.length} registered taxpayer${b2bData.length !== 1 ? 's' : ''}` : `${cdnrData.length} recipient${cdnrData.length !== 1 ? 's' : ''} with credit notes`}
                </Typography>
              </Box>

              {activeTab === 0 && (
                b2bData.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 5, border: `2px dashed ${COLORS.border}`, borderRadius: 2 }}>
                    <ReceiptIcon sx={{ fontSize: 28, color: COLORS.text.tertiary, mb: 0.5, display: 'block', mx: 'auto' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>No B2B invoices found for this period</Typography>
                  </Box>
                ) : (
                  b2bData.map((customer, idx) => (
                    <B2BInvoiceAccordion key={idx} customer={customer} index={idx} />
                  ))
                )
              )}

              {activeTab === 1 && (
                cdnrData.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 5, border: `2px dashed #FECACA`, borderRadius: 2 }}>
                    <CreditIcon sx={{ fontSize: 28, color: '#FECACA', mb: 0.5, display: 'block', mx: 'auto' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>No credit notes found for this period</Typography>
                  </Box>
                ) : (
                  cdnrData.map((cn, idx) => (
                    <CreditNoteAccordion key={idx} creditNote={cn} index={idx} />
                  ))
                )
              )}
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
            GSTR-1 covers B2B invoices and credit/debit notes for outward supplies
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

export default Gstr1Data;