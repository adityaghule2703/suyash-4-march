import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  AttachMoney as MoneyIcon,
  BatchPrediction as BatchIcon,
  LocationOn as LocationIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
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
  },
  border: '#E3E8EF'
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const getStockStatus = (availableQty) => {
  if (availableQty <= 0) return { label: 'Out of Stock', color: '#DC2626', bg: '#FEE2E2', icon: ErrorIcon };
  if (availableQty <= 50) return { label: 'Low Stock', color: '#D97706', bg: '#FEF3C7', icon: WarningIcon };
  if (availableQty > 500) return { label: 'High Stock', color: '#2563EB', bg: '#DBEAFE', icon: InventoryIcon };
  return { label: 'Normal Stock', color: '#059669', bg: '#D1FAE5', icon: CheckCircleIcon };
};

const ItemStockDetails = ({ open, onClose, item }) => {
  const [loading, setLoading] = useState(false);
  const [stockEntries, setStockEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [itemInfo, setItemInfo] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    console.log('=== ItemStockDetails useEffect ===');
    console.log('open:', open);
    console.log('item:', item);
    console.log('item?._id:', item?._id);
    
    // Reset fetch flag when modal closes
    if (!open) {
      hasFetched.current = false;
      return;
    }
    
    // Fetch only when open and item has ID and not fetched yet
    if (open && item && (item._id || item.id) && !hasFetched.current) {
      const itemId = item._id || item.id;
      console.log(' Fetching for itemId:', itemId);
      hasFetched.current = true;
      fetchStockDetails(itemId);
    } else if (open && item && !item._id && !item.id) {
      console.error(' Item has no ID:', item);
      setError('Invalid item: No ID found');
    }
  }, [open, item]);

  const fetchStockDetails = async (itemId) => {
    console.log('=== fetchStockDetails called ===');
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      if (!token) {
        setError('Authentication failed. Please login again.');
        setLoading(false);
        return;
      }
      
      const apiUrl = `${BASE_URL}/api/stock-ledger/item/${itemId}`;
      console.log('API URL:', apiUrl);
      
      const response = await axios.get(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        const responseData = response.data.data || [];
        
        let entries = [];
        let summaryData = null;
        
        if (Array.isArray(responseData)) {
          entries = responseData;
        } else if (responseData && typeof responseData === 'object' && responseData._id) {
          entries = [responseData];
        }
        
        if (response.data.summary) {
          summaryData = response.data.summary;
          console.log(' Summary from API:', summaryData);
        }
        
        console.log('Stock entries count:', entries.length);
        
        if (entries.length === 0 && !summaryData) {
          setError('No stock entries found for this item');
          setLoading(false);
          return;
        }
        
        setStockEntries(entries);
        
        if (summaryData) {
          setSummary(summaryData);
        } else {
          let totalQty = 0, totalRes = 0, totalAvail = 0, totalVal = 0;
          entries.forEach(entry => {
            totalQty += entry.quantity || 0;
            totalRes += entry.reserved_qty || 0;
            totalAvail += entry.available_qty || (entry.quantity - (entry.reserved_qty || 0));
            totalVal += entry.total_value || 0;
          });
          setSummary({
            total_quantity: totalQty,
            total_reserved: totalRes,
            total_available: totalAvail,
            total_value: totalVal
          });
        }
        
        if (entries.length > 0) {
          const firstEntry = entries[0];
          const itemObj = firstEntry.item_id || {};
          setItemInfo({
            part_no: itemObj.part_no || firstEntry.part_no || 'N/A',
            item_name: itemObj.item_name || 'N/A',
            item_type: itemObj.item_type || 'N/A',
            unit: firstEntry.unit || 'Nos'
          });
        } else if (item) {
          setItemInfo({
            part_no: item.part_no || 'N/A',
            item_name: item.item_name || 'N/A',
            item_type: item.item_type || 'N/A',
            unit: 'Nos'
          });
        }
      } else {
        setError(response.data.message || 'Failed to fetch stock details');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.status === 404) {
        setError('Item not found.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load stock details');
      }
    } finally {
      setLoading(false);
    }
  };

  const status = getStockStatus(summary?.total_available || 0);
  const StatusIcon = status.icon;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Stock Report - ${itemInfo?.part_no || 'Item'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #063C3F; padding-bottom: 10px; }
              .summary { margin: 20px 0; display: flex; gap: 15px; flex-wrap: wrap; }
              .summary-card { flex: 1; min-width: 150px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
              .summary-card h4 { margin: 0 0 5px 0; color: #666; font-size: 12px; }
              .summary-card p { margin: 0; font-size: 18px; font-weight: bold; color: #063C3F; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #063C3F; color: white; }
              .text-right { text-align: right; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Stock Details Report</h2>
              <h3>${itemInfo?.part_no || '-'}</h3>
              <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
            <div class="summary">
              <div class="summary-card"><h4>Total Quantity</h4><p>${formatNumber(summary?.total_quantity || 0)} ${itemInfo?.unit}</p></div>
              <div class="summary-card"><h4>Reserved</h4><p>${formatNumber(summary?.total_reserved || 0)} ${itemInfo?.unit}</p></div>
              <div class="summary-card"><h4>Available</h4><p>${formatNumber(summary?.total_available || 0)} ${itemInfo?.unit}</p></div>
              <div class="summary-card"><h4>Total Value</h4><p>${formatCurrency(summary?.total_value || 0)}</p></div>
            </div>
            <h3>Stock Locations</h3>
            <table>
              <thead><tr><th>Warehouse</th><th>Bin</th><th>Batch</th><th class="text-right">Qty</th><th class="text-right">Reserved</th><th class="text-right">Available</th><th class="text-right">Unit Cost</th><th class="text-right">Total Value</th></tr></thead>
              <tbody>
                ${stockEntries.map(entry => {
                  const whName = typeof entry.warehouse_id === 'object' ? entry.warehouse_id.warehouse_name : entry.warehouse_id;
                  const available = entry.available_qty ?? (entry.quantity - (entry.reserved_qty || 0));
                  return `<tr>
                    <td>${whName || '-'}</td>
                    <td>${entry.bin_id || '-'}</td>
                    <td>${entry.batch_no || '-'}</td>
                    <td class="text-right">${formatNumber(entry.quantity)}</td>
                    <td class="text-right">${formatNumber(entry.reserved_qty)}</td>
                    <td class="text-right">${formatNumber(available)}</td>
                    <td class="text-right">${formatCurrency(entry.unit_cost)}</td>
                    <td class="text-right">${formatCurrency(entry.total_value)}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
            <div class="footer"><p>Generated from Stock Ledger System</p></div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden', maxHeight: '75vh' } }}>
      
      <DialogTitle sx={{ bgcolor: COLORS.primary, color: COLORS.text.light,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
            <InventoryIcon />
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>Stock Details</Typography>
            <Typography sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
              {itemInfo?.part_no || item?.part_no || 'Item'} - Complete Inventory Information
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.light }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, flexDirection: 'column', gap: 1 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography>Loading stock details...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : stockEntries.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <InventoryIcon sx={{ fontSize: 64, color: COLORS.text.tertiary, mb: 2 }} />
            <Typography>No stock data available</Typography>
          </Box>
        ) : (
          <Box>
            <Box sx={{ p: 3, bgcolor: COLORS.background.light, borderBottom: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 64, height: 64, bgcolor: COLORS.primary, fontSize: '1.5rem', fontWeight: 700 }}>
                    {itemInfo?.part_no?.substring(0, 2).toUpperCase() || 'IT'}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace' }}>
                      {itemInfo?.part_no}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                      Unit: {itemInfo?.unit} | Locations: {stockEntries.length}
                    </Typography>
                  </Box>
                </Stack>
                <Chip icon={<StatusIcon />} label={status.label}
                  sx={{ bgcolor: status.bg, color: status.color, fontWeight: 600 }} />
              </Stack>
            </Box>

            {summary && (
              <Grid container spacing={2} sx={{ p: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>TOTAL QUANTITY</Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.primary }}>
                      {formatNumber(summary.total_quantity)} {itemInfo?.unit}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: '#FEF3C7' }}>
                    <Typography sx={{ fontSize: '0.65rem', color: '#D97706' }}>RESERVED</Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#D97706' }}>
                      {formatNumber(summary.total_reserved)} {itemInfo?.unit}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: '#D1FAE5' }}>
                    <Typography sx={{ fontSize: '0.65rem', color: '#059669' }}>AVAILABLE</Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669' }}>
                      {formatNumber(summary.total_available)} {itemInfo?.unit}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>TOTAL VALUE</Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.primary }}>
                      {formatCurrency(summary.total_value)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            <Divider />
            <Box sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.primary, mb: 2 }}>
                STOCK DISTRIBUTION BY LOCATION
              </Typography>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.primary }}>
                      <TableCell sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 600 }}>Warehouse</TableCell>
                      <TableCell sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 600 }}>Bin</TableCell>
                      <TableCell sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 600 }}>Batch No</TableCell>
                      <TableCell sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 600 }} align="right">Quantity</TableCell>
                      <TableCell sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 600 }} align="right">Reserved</TableCell>
                      <TableCell sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 600 }} align="right">Available</TableCell>
                      <TableCell sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 600 }} align="right">Unit Cost</TableCell>
                      <TableCell sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 600 }} align="right">Total Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockEntries.map((entry, idx) => {
                      const whName = typeof entry.warehouse_id === 'object' 
                        ? entry.warehouse_id.warehouse_name || entry.warehouse_id.name
                        : entry.warehouse_id;
                      const available = entry.available_qty !== undefined 
                        ? entry.available_qty 
                        : (entry.quantity - (entry.reserved_qty || 0));
                      return (
                        <TableRow key={entry._id || idx} hover>
                          <TableCell>{whName || '-'}</TableCell>
                          <TableCell>{entry.bin_id || '-'}</TableCell>
                          <TableCell>{entry.batch_no || '-'}</TableCell>
                          <TableCell align="right">{formatNumber(entry.quantity)}</TableCell>
                          <TableCell align="right" sx={{ color: '#D97706' }}>{formatNumber(entry.reserved_qty)}</TableCell>
                          <TableCell align="right" sx={{ color: '#059669', fontWeight: 600 }}>{formatNumber(available)}</TableCell>
                          <TableCell align="right">{formatCurrency(entry.unit_cost)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: COLORS.primary }}>{formatCurrency(entry.total_value)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${COLORS.border}`, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}>
          Close
        </Button>
        <Button onClick={handlePrint} variant="contained" startIcon={<PrintIcon />}
          sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', bgcolor: COLORS.primary }}>
          Print Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemStockDetails;