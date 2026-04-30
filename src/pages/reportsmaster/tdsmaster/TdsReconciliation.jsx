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
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  Snackbar,
  Stack,
  Chip,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  Calculate as CalculateIcon,
  ReceiptLong as TdsIcon,
  FilterList as FilterIcon,
  AccountBalance as BankIcon,
  TrendingDown as DeductedIcon,
  SwapHoriz as NetIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  accent: '#0D9488',
  accentLight: '#CCFBF1',
  gold: '#B45309',
  goldLight: '#FEF3C7',
  text: {
    primary: '#0F1923',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    page: '#F1F5F6',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F',
    stripe: '#F7FAFB',
  },
  border: '#DDE3EB',
  success: { bg: '#D1FAE5', text: '#065F46' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Reusable stat card for the summary panel
const SummaryCard = ({ label, value, sub, color, icon: Icon, small }) => (
  <Box sx={{
    flex: 1,
    minWidth: small ? 100 : 140,
    px: 2,
    py: 1.5,
    borderRadius: 2,
    bgcolor: color?.bg || COLORS.background.white,
    border: `1px solid ${color?.border || COLORS.border}`,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <Box sx={{ position: 'absolute', right: -6, top: -6, opacity: 0.08 }}>
      {Icon && <Icon sx={{ fontSize: 52, color: color?.icon || COLORS.primary }} />}
    </Box>
    <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: color?.label || COLORS.text.tertiary, mb: 0.3 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: small ? '1rem' : '1.15rem', fontWeight: 700, color: color?.value || COLORS.text.primary, lineHeight: 1.2 }}>
      {value}
    </Typography>
    {sub && (
      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.3 }}>{sub}</Typography>
    )}
  </Box>
);

const TdsReconciliation = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reconciliationData, setReconciliationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    yearOptions.push({ value: i.toString(), label: `FY ${i}-${(i + 1).toString().slice(-2)}` });
  }

  const fetchCustomers = useCallback(async () => {
    try {
      setLoadingCustomers(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) setCustomers(response.data.data || []);
    } catch (err) {
      showNotification('Failed to load customers', 'error');
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const fetchTdsReconciliation = useCallback(async () => {
    if (!selectedCustomer) return;
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/invoices/tds-reconciliation/${selectedCustomer._id}/${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setReconciliationData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load TDS reconciliation data');
        setReconciliationData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load TDS reconciliation data');
      setReconciliationData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer, selectedYear]);

  useEffect(() => {
    if (selectedCustomer && selectedYear) fetchTdsReconciliation();
  }, [selectedCustomer, selectedYear, fetchTdsReconciliation]);

  const showNotification = (msg, sev) => setSnackbar({ open: true, message: msg, severity: sev });

  const fyLabel = reconciliationData?.financial_year ||
    `FY ${selectedYear}-${(parseInt(selectedYear) + 1).toString().slice(-2)}`;

  return (
    <Box sx={{ bgcolor: COLORS.background.page, minHeight: '100vh', p: { xs: 1.5, md: 2.5 } }}>

      {/* ─── TOP HEADER BAND ─── */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        mb: 2, flexWrap: 'wrap', gap: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 1.5,
            bgcolor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TdsIcon sx={{ fontSize: '1.1rem', color: '#fff' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary, lineHeight: 1.1 }}>
              TDS Reconciliation
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              Income Tax Act — Section 194 Series
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh Data">
          <span>
            <IconButton
              onClick={() => { fetchTdsReconciliation(); showNotification('Refreshed', 'success'); }}
              disabled={loading || !selectedCustomer}
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
          {/* Customer field */}
          <Box sx={{ flex: 2 }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Deductor / Customer
            </Typography>
            <Autocomplete
              fullWidth
              options={customers}
              getOptionLabel={(o) => `${o.customer_name} (${o.customer_code || o.customer_id})`}
              value={selectedCustomer}
              onChange={(e, v) => { setSelectedCustomer(v); setReconciliationData(null); }}
              loading={loadingCustomers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Search customer…"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5, fontSize: '0.75rem', bgcolor: COLORS.background.page,
                      '&.Mui-focused': { bgcolor: '#fff' },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Year */}
          <Box sx={{ flex: 1, minWidth: 160 }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Financial Year
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setReconciliationData(null); }}
                startAdornment={<CalendarIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary, mr: 0.5 }} />}
                sx={{ borderRadius: 1.5, fontSize: '0.75rem', bgcolor: COLORS.background.page }}
              >
                {yearOptions.map(o => (
                  <MenuItem key={o.value} value={o.value} sx={{ fontSize: '0.75rem' }}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {/* ─── MAIN CONTENT ─── */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
          <CircularProgress size={28} sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Fetching TDS data…</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.75rem' }}>{error}</Alert>
      ) : selectedCustomer && reconciliationData ? (
        <>
          {/* ─── REPORT HEADER BANNER ─── */}
          <Paper sx={{
            mb: 2, borderRadius: 2, overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 2px 8px rgba(6,60,63,0.10)',
          }}>
            {/* Top teal strip */}
            <Box sx={{
              px: 2.5, py: 1.5,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0A5A5E 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1,
            }}>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.2 }}>
                  TDS Reconciliation Statement
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                  {selectedCustomer.customer_name}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)' }}>
                  {selectedCustomer.customer_code || selectedCustomer.customer_id} &nbsp;·&nbsp; {fyLabel}
                </Typography>
              </Box>
              <Chip
                label={fyLabel}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.65rem', height: 24, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}
              />
            </Box>

            {/* Summary numbers row */}
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff', borderTop: `1px solid rgba(6,60,63,0.12)` }}>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <SummaryCard
                  label="Total Receipts"
                  value={reconciliationData.total_receipts || 0}
                  sub="transactions"
                  icon={ReceiptIcon}
                  color={{ bg: COLORS.primaryLight, border: '#C7DFE1', label: COLORS.primary, value: COLORS.primaryDark, icon: COLORS.primary }}
                />
                <SummaryCard
                  label="Gross Amount"
                  value={`₹${formatCurrency(reconciliationData.total_amount || 0)}`}
                  sub="before TDS"
                  icon={BankIcon}
                  color={{ bg: '#F0FDF4', border: '#BBF7D0', label: '#047857', value: '#064E3B', icon: '#059669' }}
                />
                <SummaryCard
                  label="TDS Deducted"
                  value={`₹${formatCurrency(reconciliationData.total_tds || 0)}`}
                  sub="total withheld"
                  icon={DeductedIcon}
                  color={{ bg: COLORS.goldLight, border: '#FDE68A', label: COLORS.gold, value: '#78350F', icon: COLORS.gold }}
                />
                <SummaryCard
                  label="Net Received"
                  value={`₹${formatCurrency((reconciliationData.total_amount || 0) - (reconciliationData.total_tds || 0))}`}
                  sub="after TDS"
                  icon={NetIcon}
                  color={{ bg: '#F5F3FF', border: '#DDD6FE', label: '#5B21B6', value: '#3B0764', icon: '#7C3AED' }}
                />
              </Stack>
            </Box>
          </Paper>

          {/* ─── TDS SECTION BREAKDOWN ─── */}
          {reconciliationData.by_section?.length > 0 && (
            <Paper sx={{ mb: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <Box sx={{ px: 2, py: 1.2, bgcolor: COLORS.background.stripe, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 3, height: 14, borderRadius: 2, bgcolor: COLORS.accent }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: COLORS.text.secondary }}>
                  Section-wise Breakup
                </Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Grid container spacing={1}>
                  {reconciliationData.by_section.map((section, i) => (
                    <Grid item key={i}>
                      <Box sx={{
                        px: 2, py: 1.2, borderRadius: 1.5,
                        bgcolor: COLORS.background.white,
                        border: `1px solid ${COLORS.border}`,
                        minWidth: 150,
                      }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                          <Chip
                            label={`§ ${section.section}`}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: 18, bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 700 }}
                          />
                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                            {section.receipts} receipts
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.primary }}>
                          ₹{formatCurrency(section.total_tds)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>TDS deducted</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          )}

          {/* ─── TRANSACTIONS TABLE ─── */}
          <Paper sx={{
            borderRadius: 2, overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            {/* Table header */}
            <Box sx={{ px: 2, py: 1.2, bgcolor: COLORS.background.stripe, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 3, height: 14, borderRadius: 2, bgcolor: COLORS.gold }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: COLORS.text.secondary }}>
                  Transaction Detail
                </Typography>
              </Box>
              <Chip
                label={`${reconciliationData.receipts?.length || 0} entries`}
                size="small"
                sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
              />
            </Box>

            <TableContainer sx={{ maxHeight: 420 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      { label: '#', align: 'center', w: 36 },
                      { label: 'Receipt No.' },
                      { label: 'Date' },
                      { label: 'Mode' },
                      { label: 'Instrument' },
                      { label: 'Section', align: 'center' },
                      { label: 'Gross Amt', align: 'right' },
                      { label: 'TDS Amt', align: 'right' },
                      { label: 'Net Recd', align: 'right' },
                      { label: 'Status', align: 'center' },
                    ].map((col) => (
                      <TableCell
                        key={col.label}
                        align={col.align || 'left'}
                        sx={{
                          fontWeight: 700, fontSize: '0.6rem',
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          color: COLORS.text.light,
                          bgcolor: COLORS.background.tableHeader,
                          py: 1, px: 1.5,
                          borderBottom: 'none',
                          whiteSpace: 'nowrap',
                          ...(col.w ? { width: col.w, minWidth: col.w } : {}),
                        }}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reconciliationData.receipts?.length > 0 ? (
                    reconciliationData.receipts.map((r, idx) => (
                      <TableRow
                        key={r._id || idx}
                        sx={{
                          bgcolor: idx % 2 === 0 ? '#fff' : COLORS.background.stripe,
                          '&:hover': { bgcolor: COLORS.background.hover },
                        }}
                      >
                        <TableCell align="center" sx={{ fontSize: '0.6rem', py: 0.8, px: 1.5, color: COLORS.text.tertiary }}>{idx + 1}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', py: 0.8, px: 1.5, fontWeight: 600, color: COLORS.primary }}>{r.receipt_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', py: 0.8, px: 1.5, color: COLORS.text.secondary, whiteSpace: 'nowrap' }}>{formatDate(r.receipt_date)}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', py: 0.8, px: 1.5 }}>
                          <Chip label={r.payment_mode} size="small" sx={{ fontSize: '0.6rem', height: 18, bgcolor: '#F1F5F9', color: COLORS.text.secondary }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', py: 0.8, px: 1.5, color: COLORS.text.tertiary }}>{r.instrument_no || '—'}</TableCell>
                        <TableCell align="center" sx={{ py: 0.8, px: 1.5 }}>
                          <Chip
                            label={r.tds_section || '—'}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', py: 0.8, px: 1.5, fontFamily: 'monospace', color: COLORS.text.primary }}>
                          ₹{formatCurrency(r.total_amount)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', py: 0.8, px: 1.5, fontFamily: 'monospace', fontWeight: 700, color: COLORS.gold }}>
                          ₹{formatCurrency(r.tds_amount)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', py: 0.8, px: 1.5, fontFamily: 'monospace', color: '#047857', fontWeight: 600 }}>
                          ₹{formatCurrency(r.net_received)}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 0.8, px: 1.5 }}>
                          <Chip
                            label={r.status}
                            size="small"
                            sx={{
                              fontSize: '0.6rem', height: 20,
                              bgcolor: r.status === 'Active' ? COLORS.success.bg : COLORS.error.bg,
                              color: r.status === 'Active' ? COLORS.success.text : COLORS.error.text,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                        <ReceiptIcon sx={{ fontSize: 28, color: COLORS.text.tertiary, mb: 0.5, display: 'block', mx: 'auto' }} />
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>No receipts found for this period</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Table footer totals */}
            {reconciliationData.receipts?.length > 0 && (
              <Box sx={{
                px: 2, py: 1.2,
                bgcolor: COLORS.primary,
                display: 'flex', justifyContent: 'flex-end', gap: 4,
              }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Total Gross</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                    ₹{formatCurrency(reconciliationData.total_amount || 0)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Total TDS</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#FCD34D', fontFamily: 'monospace' }}>
                    ₹{formatCurrency(reconciliationData.total_tds || 0)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Net Received</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#6EE7B7', fontFamily: 'monospace' }}>
                    ₹{formatCurrency((reconciliationData.total_amount || 0) - (reconciliationData.total_tds || 0))}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </>
      ) : (
        /* Empty state */
        <Paper sx={{
          p: 4, textAlign: 'center', borderRadius: 2,
          border: `2px dashed ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          boxShadow: 'none',
        }}>
          <TdsIcon sx={{ fontSize: 36, color: COLORS.text.tertiary, mb: 1 }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
            {selectedCustomer ? 'Select a financial year to generate the report' : 'Select a customer to begin'}
          </Typography>
          <Typography sx={{ fontSize: '0.68rem', color: COLORS.text.tertiary }}>
            TDS reconciliation helps verify deductions under Income Tax Act sections
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

export default TdsReconciliation;