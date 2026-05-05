// ViewWarehouseStock.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Close as CloseIcon,
  Warehouse as WarehouseIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  QrCode as QrCodeIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Assessment as AssessmentIcon,
  Summarize as SummarizeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
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
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon styling
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? PRIMARY_BLUE : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(ownerState.active && {
    backgroundColor: PRIMARY_BLUE,
    boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: PRIMARY_BLUE,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : props.icon}
    </CustomStepIconRoot>
  );
}

const stockSteps = ['Overview', 'Stock by Bin', 'Detailed Stock'];

// Helper function to format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Stock Level Indicator Component
const StockLevelIndicator = ({ quantity, minStock, maxStock }) => {
  let level = 'normal';
  let tooltip = 'Stock level is normal';
  
  if (minStock && quantity <= minStock) {
    level = 'low';
    tooltip = `Stock is below minimum reorder level (Min: ${minStock})`;
  } else if (maxStock && quantity >= maxStock) {
    level = 'high';
    tooltip = `Stock is above maximum level (Max: ${maxStock})`;
  }
  
  const colors = {
    low: { bg: '#FEE2E2', color: '#991B1B', icon: <WarningIcon sx={{ fontSize: '0.7rem' }} /> },
    normal: { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
    high: { bg: '#FEF3C7', color: '#B45309', icon: <TrendingUpIcon sx={{ fontSize: '0.7rem' }} /> }
  };
  
  const config = colors[level];
  
  return (
    <Tooltip title={tooltip}>
      <Chip
        icon={config.icon}
        size="small"
        sx={{ fontSize: '0.6rem', height: 20, bgcolor: config.bg, color: config.color }}
      />
    </Tooltip>
  );
};

// Stock Value Card Component
const StockValueCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
      <Avatar sx={{ width: 28, height: 28, bgcolor: `${color}20`, color: color }}>
        {icon}
      </Avatar>
      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>{title}</Typography>
    </Stack>
    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary, mt: 0.5 }}>
      {value}
    </Typography>
  </Paper>
);

// Bin Card Component
const BinCard = ({ bin, expanded, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = bin.items.filter(item =>
    item.part_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.batch_no && item.batch_no.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Card sx={{ mb: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* Bin Header */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ cursor: 'pointer' }}
          onClick={onToggle}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
              <LocationIcon />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                Bin: {bin.bin_id}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                {bin.items.length} item(s) | Total Qty: {bin.total_quantity} | Value: {formatCurrency(bin.total_value)}
              </Typography>
            </Box>
          </Stack>
          
          {/* <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton> */}
        </Stack>
         <TableContainer component={Paper} sx={{ borderRadius: 1, border: `1px solid ${COLORS.border}` }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.background.light }}>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Batch No</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Quantity</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Reserved</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Available</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Unit Cost</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Total Value</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Stock Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {item.part_no}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                        {item.item_id?.item_type || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.batch_no || 'N/A'}
                        size="small"
                        sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.background.light }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                        {item.quantity} {item.unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.warning }}>
                        {item.reserved_qty}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.success }}>
                        {item.available_qty}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '0.7rem' }}>
                        {formatCurrency(item.unit_cost)}/{item.unit}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                        ({item.valuation_method})
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                        {formatCurrency(item.total_value)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <StockLevelIndicator 
                        quantity={item.available_qty} 
                        minStock={item.min_stock} 
                        maxStock={item.max_stock} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        
     
      </CardContent>
    </Card>
  );
};

// Main Component
const ViewWarehouseStock = ({ open, onClose, warehouseId, warehouseName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stockData, setStockData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedBins, setExpandedBins] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all'); // all, fifo, weighted_average
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (open && warehouseId) {
      fetchStockData();
    }
  }, [open, warehouseId]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${BASE_URL}/api/stock-ledger/warehouse/${warehouseId}?include_zero_stock=false`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setStockData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load stock data');
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err.response?.data?.message || 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const toggleBinExpand = (binId) => {
    setExpandedBins(prev => ({
      ...prev,
      [binId]: !prev[binId]
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getFilteredStockEntries = () => {
    let entries = stockData?.stock_entries || [];
    
    // Apply search filter
    if (searchTerm) {
      entries = entries.filter(entry =>
        entry.part_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.batch_no && entry.batch_no.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply valuation method filter
    if (filterMethod !== 'all') {
      entries = entries.filter(entry =>
        entry.valuation_method.toLowerCase().replace(' ', '_') === filterMethod
      );
    }
    
    return entries;
  };

  const getFilteredBins = () => {
    let bins = stockData?.stock_by_bin || [];
    
    if (searchTerm) {
      bins = bins.map(bin => ({
        ...bin,
        items: bin.items.filter(item =>
          item.part_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.batch_no && item.batch_no.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })).filter(bin => bin.items.length > 0);
    }
    
    return bins;
  };

  if (!open) return null;

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ color: COLORS.primary }} />
          <Typography sx={{ mt: 2, color: COLORS.text.secondary }}>
            Loading Warehouse Stock...
          </Typography>
        </Box>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Dialog>
    );
  }

  const { warehouse, summary, stock_entries, stock_by_bin } = stockData || {};
  const filteredEntries = getFilteredStockEntries();
  const filteredBins = getFilteredBins();

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Overview
        return (
          <Stack spacing={2}>
            {/* Warehouse Info Card */}
            {warehouse && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 48, height: 48, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
                    <WarehouseIcon />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {warehouse.warehouse_name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      ID: {warehouse.warehouse_id} | Type: {warehouse.warehouse_type}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            {/* Summary Cards */}
            {summary && (
              <>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 0 }}>
                  <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Stock Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 2.4 }}>
                    <StockValueCard 
                      title="Total Quantity" 
                      value={`${summary.total_quantity || 0} units`} 
                      icon={<InventoryIcon sx={{ fontSize: '1rem' }} />}
                      color={COLORS.info}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2.4 }}>
                    <StockValueCard 
                      title="Total Value" 
                      value={formatCurrency(summary.total_value)} 
                      icon={<ReceiptIcon sx={{ fontSize: '1rem' }} />}
                      color={COLORS.success}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2.4 }}>
                    <StockValueCard 
                      title="Reserved Qty" 
                      value={summary.total_reserved || 0} 
                      icon={<TrendingDownIcon sx={{ fontSize: '1rem' }} />}
                      color={COLORS.warning}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2.4 }}>
                    <StockValueCard 
                      title="Unique Items" 
                      value={summary.unique_items || 0} 
                      icon={<CategoryIcon sx={{ fontSize: '1rem' }} />}
                      color={COLORS.primary}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2.4 }}>
                    <StockValueCard 
                      title="Bins Utilized" 
                      value={summary.bins_utilized || 0} 
                      icon={<LocationIcon sx={{ fontSize: '1rem' }} />}
                      color={COLORS.info}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* Quick Stats */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Quick Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Valuation Methods:</Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip label="FIFO" size="small" sx={{ fontSize: '0.6rem', height: 20 }} />
                        <Chip label="Weighted Average" size="small" sx={{ fontSize: '0.6rem', height: 20 }} />
                      </Stack>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated:</Typography>
                      <Typography sx={{ fontSize: '0.7rem' }}>{formatDate(stock_entries?.[0]?.updatedAt)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Batches:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{stock_entries?.length || 0}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Low Stock Items:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.error }}>
                        {stock_entries?.filter(e => e.min_stock && e.available_qty <= e.min_stock).length || 0}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>High Stock Items:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.warning }}>
                        {stock_entries?.filter(e => e.max_stock && e.available_qty >= e.max_stock).length || 0}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Top Items by Value */}
            {stock_entries && stock_entries.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  Top 5 Items by Value
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Quantity</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Unit Cost</TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Total Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...stock_entries]
                        .sort((a, b) => b.total_value - a.total_value)
                        .slice(0, 5)
                        .map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.quantity} {item.unit}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.unit_cost)}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">{formatCurrency(item.total_value)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Stack>
        );

      case 1: // Stock by Bin
        return (
          <Stack spacing={2}>
            {/* Filter Bar */}
            {/* <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="Search by part no or batch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ flex: 1, minWidth: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                      </InputAdornment>
                    ),
                    sx: { height: 36, fontSize: '0.7rem' }
                  }}
                />
                <Button
                  size="small"
                  startIcon={<FilterListIcon />}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ fontSize: '0.7rem', textTransform: 'none' }}
                >
                  Filter
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => { setFilterMethod('all'); setAnchorEl(null); }}>
                    <ListItemText primary="All Valuation Methods" />
                  </MenuItem>
                  <MenuItem onClick={() => { setFilterMethod('fifo'); setAnchorEl(null); }}>
                    <ListItemText primary="FIFO Only" />
                  </MenuItem>
                  <MenuItem onClick={() => { setFilterMethod('weighted_average'); setAnchorEl(null); }}>
                    <ListItemText primary="Weighted Average Only" />
                  </MenuItem>
                </Menu>
                {(searchTerm || filterMethod !== 'all') && (
                  <Button
                    size="small"
                    onClick={() => { setSearchTerm(''); setFilterMethod('all'); }}
                    sx={{ fontSize: '0.7rem', textTransform: 'none', color: COLORS.error }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Stack>
            </Paper> */}

            {/* Bins */}
            {filteredBins.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: COLORS.background.white, borderRadius: 2 }}>
                <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                <Typography sx={{ color: COLORS.text.secondary }}>No items found</Typography>
              </Paper>
            ) : (
              filteredBins.map((bin) => (
                <BinCard
                  key={bin.bin_id}
                  bin={bin}
                  expanded={expandedBins[bin.bin_id] || false}
                  onToggle={() => toggleBinExpand(bin.bin_id)}
                />
              ))
            )}
          </Stack>
        );

      case 2: // Detailed Stock
        return (
          <Stack spacing={2}>
            {/* Filter Bar */}
            {/* <Paper sx={{ p: 1.5, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="Search by part no or batch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ flex: 1, minWidth: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                      </InputAdornment>
                    ),
                    sx: { height: 36, fontSize: '0.7rem' }
                  }}
                />
              </Stack>
            </Paper> */}

            {/* Detailed Stock Table */}
            <Paper sx={{ bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Item Type</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Batch No</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Bin</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Quantity</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Reserved</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Available</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Unit Cost</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Total Value</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Valuation</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Last Updated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEntries.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{item.part_no}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            {item.item_id?.item_type || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.batch_no || 'N/A'}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.background.light }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.7rem' }}>{item.bin_id}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                            {item.quantity} {item.unit}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.warning }}>
                            {item.reserved_qty}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.success }}>
                            {item.available_qty}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            {formatCurrency(item.unit_cost)}/{item.unit}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                            {formatCurrency(item.total_value)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.valuation_method}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: 20 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            {formatDate(item.last_updated)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          height: 'auto',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ background: HEADER_GRADIENT, py: 1.5, px: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WarehouseIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1rem' }}>
              View Warehouse Stock
            </Typography>
          </Stack>
          <Chip
            label={warehouse?.warehouse_id || 'Loading...'}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '10px',
              height: '24px',
              backdropFilter: 'blur(4px)',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ 
            mt: 0.5,
            '& .MuiStepLabel-label': {
              color: '#FFFFFF !important',
              opacity: 0.8,
              fontSize: '0.7rem !important',
              '&.Mui-active': {
                color: '#FFFFFF !important',
                opacity: 1,
                fontWeight: 600
              },
              '&.Mui-completed': {
                color: '#FFFFFF !important',
                opacity: 1
              }
            }
          }}
        >
          {stockSteps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={500} fontSize="0.7rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ 
        p: 2.5, 
        overflow: 'auto', 
        maxHeight: 'calc(90vh - 140px)',
        backgroundColor: '#F8FFFC'
      }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: '1px solid #E3E8EF',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          size="small"
          sx={{ 
            color: '#64748B', 
            fontSize: '0.75rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#F1F5F9' }
          }}
        >
          Close
        </Button>

        <Stack direction="row" spacing={1}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              size="small"
              startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
              sx={{ 
                color: '#64748B', 
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': { bgcolor: '#F1F5F9' }
              }}
            >
              Back
            </Button>
          )}
          
          {activeStep < stockSteps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                backgroundColor: PRIMARY_DARK,
                fontSize: '0.75rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { 
                  backgroundColor: '#05292B',
                  boxShadow: 'none'
                }
              }}
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewWarehouseStock;