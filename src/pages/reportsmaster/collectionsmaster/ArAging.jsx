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
  TablePagination,
  Stack,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  agingBuckets: {
    current: { bg: '#D1FAE5', color: '#065F46', label: 'Current' },
    '0_30': { bg: '#FEF3C7', color: '#B45309', label: '0-30 Days' },
    '31_60': { bg: '#FFE4E6', color: '#BE123C', label: '31-60 Days' },
    '61_90': { bg: '#FEE2E2', color: '#991B1B', label: '61-90 Days' },
    '91_180': { bg: '#FECDD3', color: '#9F1239', label: '91-180 Days' },
    '180_plus': { bg: '#FCE7F3', color: '#BE185D', label: '180+ Days' }
  }
};

// Helper Functions
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Aging Bucket Card Component
const AgingBucketCard = ({ title, amount, color, bgColor, icon }) => {
  return (
    <Card sx={{ 
      bgcolor: bgColor || COLORS.background.white, 
      borderRadius: 2, 
      border: `1px solid ${COLORS.border}`,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      height: '100%'
    }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
            {title}
          </Typography>
          {icon}
        </Stack>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: color || COLORS.text.primary, mt: 1 }}>
          ₹{formatCurrency(amount)}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Invoice Detail Row Component
const InvoiceDetailRow = ({ invoice }) => {
  const getBucketInfo = () => {
    switch (invoice.bucket) {
      case 'current': return { bg: '#D1FAE5', color: '#065F46', label: 'Current' };
      case '0_30': return { bg: '#FEF3C7', color: '#B45309', label: '0-30 Days' };
      case '31_60': return { bg: '#FFE4E6', color: '#BE123C', label: '31-60 Days' };
      case '61_90': return { bg: '#FEE2E2', color: '#991B1B', label: '61-90 Days' };
      case '91_180': return { bg: '#FECDD3', color: '#9F1239', label: '91-180 Days' };
      case '180_plus': return { bg: '#FCE7F3', color: '#BE185D', label: '180+ Days' };
      default: return { bg: '#F1F5F9', color: '#475569', label: '-' };
    }
  };

  const bucketInfo = getBucketInfo();

  return (
    <TableRow hover sx={{ '&:hover': { bgcolor: COLORS.background.hover } }}>
      <TableCell sx={{ fontSize: '0.75rem' }}>{invoice.invoice_no}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{formatDate(invoice.invoice_date)}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{formatDate(invoice.due_date)}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{invoice.days_overdue > 0 ? `${invoice.days_overdue} days` : '-'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
        ₹{formatCurrency(invoice.balance_due)}
      </TableCell>
      <TableCell>
        <Chip 
          label={bucketInfo.label} 
          size="small" 
          sx={{ fontSize: '0.65rem', height: 24, bgcolor: bucketInfo.bg, color: bucketInfo.color }} 
        />
      </TableCell>
      <TableCell>
        <Chip 
          label={invoice.payment_status} 
          size="small" 
          sx={{ 
            fontSize: '0.65rem', 
            height: 24, 
            bgcolor: invoice.payment_status === 'Paid' ? '#D1FAE5' : '#FEE2E2',
            color: invoice.payment_status === 'Paid' ? '#065F46' : '#991B1B'
          }} 
        />
      </TableCell>
      {invoice.msme_alert && (
        <TableCell>
          <Tooltip title="MSME Alert - Interest applicable">
            <WarningIcon sx={{ fontSize: '0.9rem', color: '#EF4444' }} />
          </Tooltip>
        </TableCell>
      )}
    </TableRow>
  );
};

// Customer Accordion Component
const CustomerAccordion = ({ customer, grandTotals }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  // Calculate total outstanding for this customer
  const totalOutstanding = Object.keys(grandTotals).reduce((sum, key) => {
    if (key !== 'total') {
      return sum + (customer[key] || 0);
    }
    return sum;
  }, 0);

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleChange}
      sx={{
        mb: 1.5,
        borderRadius: 2,
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: 0, mb: 1.5 }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}
        sx={{
          bgcolor: COLORS.background.light,
          borderRadius: 2,
          '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
            <BusinessIcon sx={{ fontSize: '1.2rem' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
              {customer.customer_name || 'Customer'}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
              Customer ID: {customer.customer_id}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Total Outstanding
            </Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
              ₹{formatCurrency(totalOutstanding)}
            </Typography>
          </Box>
          {customer.msme_alert && (
            <Tooltip title="MSME Customer - Interest applicable on overdue">
              <WarningIcon sx={{ color: '#EF4444', fontSize: '1rem' }} />
            </Tooltip>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {/* Aging Summary for Customer */}
        <Paper sx={{ m: 2, p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
            Aging Summary
          </Typography>
          <Grid container spacing={1}>
            <Grid size={{ xs: 4, sm: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Current</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#065F46' }}>
                  ₹{formatCurrency(customer.current || 0)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>0-30 Days</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#B45309' }}>
                  ₹{formatCurrency(customer['0_30'] || 0)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>31-60 Days</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#BE123C' }}>
                  ₹{formatCurrency(customer['31_60'] || 0)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>61-90 Days</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#991B1B' }}>
                  ₹{formatCurrency(customer['61_90'] || 0)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>91-180 Days</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#9F1239' }}>
                  ₹{formatCurrency(customer['91_180'] || 0)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>180+ Days</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#BE185D' }}>
                  ₹{formatCurrency(customer['180_plus'] || 0)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Invoices Table */}
        {customer.invoices && customer.invoices.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.primaryLight }}>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Invoice No</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Invoice Date</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Days Overdue</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Balance Due</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Bucket</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customer.invoices.map((invoice, idx) => (
                  <InvoiceDetailRow key={idx} invoice={invoice} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              No invoices found for this customer
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const ArAging = () => {
  const [agingData, setAgingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const timer = setTimeout(() => { setSearchTerm(searchInput); }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchArAging = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/invoices/ar-aging`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setAgingData(response.data.data);
      } else {
        showNotification('Failed to load AR Aging data', 'error');
      }
    } catch (err) {
      console.error('Error fetching AR Aging:', err);
      showNotification('Failed to load AR Aging data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArAging(); }, [fetchArAging]);

  const handleRefresh = () => { fetchArAging(); showNotification('Data refreshed', 'success'); };

  const showNotification = (message, severity) => { setSnackbar({ open: true, message, severity }); };

  // Filter customers based on search term
  const filteredCustomers = agingData?.customers?.filter(customer =>
    customer.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const grandTotals = agingData?.grand_totals || {
    current: 0, '0_30': 0, '31_60': 0, '61_90': 0, '91_180': 0, '180_plus': 0, total: 0
  };

  const asOfDate = agingData?.as_of ? formatDate(agingData.as_of) : '-';

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Accounts Receivable Aging
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Track outstanding receivables and monitor aging buckets
        </Typography>
      </Box>

      {/* As of Date */}
      {/* <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.light, border: `1px solid ${COLORS.border}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
            As of Date: <strong>{asOfDate}</strong>
          </Typography>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={handleRefresh} disabled={loading} sx={{ color: COLORS.primary }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper> */}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <AgingBucketCard 
            title="Current" 
            amount={grandTotals.current} 
            color="#065F46" 
            bgColor="#D1FAE5"
            icon={<TrendingUpIcon sx={{ fontSize: '1rem', color: '#065F46' }} />}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <AgingBucketCard 
            title="0-30 Days" 
            amount={grandTotals['0_30']} 
            color="#B45309" 
            bgColor="#FEF3C7"
            icon={<TrendingUpIcon sx={{ fontSize: '1rem', color: '#B45309' }} />}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <AgingBucketCard 
            title="31-60 Days" 
            amount={grandTotals['31_60']} 
            color="#BE123C" 
            bgColor="#FFE4E6"
            icon={<TrendingUpIcon sx={{ fontSize: '1rem', color: '#BE123C' }} />}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <AgingBucketCard 
            title="61-90 Days" 
            amount={grandTotals['61_90']} 
            color="#991B1B" 
            bgColor="#FEE2E2"
            icon={<TrendingUpIcon sx={{ fontSize: '1rem', color: '#991B1B' }} />}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <AgingBucketCard 
            title="91-180 Days" 
            amount={grandTotals['91_180']} 
            color="#9F1239" 
            bgColor="#FECDD3"
            icon={<TrendingUpIcon sx={{ fontSize: '1rem', color: '#9F1239' }} />}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <AgingBucketCard 
            title="180+ Days" 
            amount={grandTotals['180_plus']} 
            color="#BE185D" 
            bgColor="#FCE7F3"
            icon={<TrendingUpIcon sx={{ fontSize: '1rem', color: '#BE185D' }} />}
          />
        </Grid>
      </Grid>

      {/* Grand Total Card */}
      <Paper sx={{ p: 2, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.tableHeader, color: COLORS.text.light }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Total Outstanding Receivables
          </Typography>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
            ₹{formatCurrency(grandTotals.total)}
          </Typography>
        </Stack>
      </Paper>

      {/* Filter Bar */}
      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField 
              placeholder="Search by customer name or ID..." 
              size="small" 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)} 
              sx={{ width: { xs: '100%', sm: 300 } }} 
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} /></InputAdornment>,
                sx: { height: 36, bgcolor: COLORS.background.light }
              }} 
              disabled={loading} 
            />
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Customers: {filteredCustomers.length}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Customers List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
          <CircularProgress size={40} sx={{ color: COLORS.primary }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      ) : filteredCustomers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <ReceiptIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
          <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
            {searchTerm ? 'No customers found matching your search' : 'No customers with outstanding receivables'}
          </Typography>
        </Paper>
      ) : (
        <Box>
          {filteredCustomers.map((customer, index) => (
            <CustomerAccordion 
              key={customer.customer_id || index} 
              customer={customer} 
              grandTotals={grandTotals}
            />
          ))}
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ArAging;