import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  TextField,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#074346',
  primaryLight: '#0A5C60',
  success: '#9FE2BF',
  warning: '#FEF3C7',
  error: '#FEE2E2',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  border: '#E3E8EF',
  background: '#F8FFFC'
};

const SOSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const getLastMonthDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };
  
  const [fromDate, setFromDate] = useState(getLastMonthDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/sales-orders/reports/summary?from=${fromDate}&to=${toDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSummaryData(response.data.data);
      } else {
        showNotification('Failed to load summary', 'error');
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      showNotification('Failed to load summary', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    if (fromDate && toDate) {
      if (fromDate > toDate) {
        showNotification('From date cannot be greater than To date', 'error');
        return;
      }
      fetchSummary();
      showNotification('Data updated successfully', 'success');
    }
  };

  const handleReset = () => {
    setFromDate(getLastMonthDate());
    setToDate(getTodayDate());
    setTimeout(() => {
      fetchSummary();
    }, 100);
    showNotification('Reset to default date range', 'success');
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatMonth = (yearMonth) => {
    if (!yearMonth) return '-';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[yearMonth.m - 1]} ${yearMonth.y}`;
  };

  const totalOrders = summaryData?.total?.count || 0;
  const totalValue = summaryData?.total?.value || 0;
  const avgOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
  const totalCustomers = summaryData?.by_customer?.length || 0;

  const stats = [
    { 
      label: "Total Orders", 
      value: totalOrders.toLocaleString(), 
      change: "+12.5%", 
      icon: <ReceiptIcon sx={{ fontSize: '1rem', color: 'white' }} />,
      trend: "up"
    },
    { 
      label: "Total Revenue", 
      value: formatCurrency(totalValue), 
      change: "+8.2%", 
      icon: <MoneyIcon sx={{ fontSize: '1rem', color: 'white' }} />,
      trend: "up"
    },
    { 
      label: "Average Order Value", 
      value: formatCurrency(avgOrderValue), 
      change: "+5.4%", 
      icon: <TrendingUpIcon sx={{ fontSize: '1rem', color: 'white' }} />,
      trend: "up"
    },
    { 
      label: "Active Customers", 
      value: totalCustomers, 
      change: "+15.3%", 
      icon: <BusinessIcon sx={{ fontSize: '1rem', color: 'white' }} />,
      trend: "up"
    },
  ];

  const statusConfig = {
    'Confirmed': { icon: <CheckCircleIcon sx={{ fontSize: '0.8rem' }} />, color: '#10B981', bg: '#D1FAE5' },
    'Pending': { icon: <PendingIcon sx={{ fontSize: '0.8rem' }} />, color: '#F59E0B', bg: '#FEF3C7' },
    'Draft': { icon: <EditIcon sx={{ fontSize: '0.8rem' }} />, color: '#6B7280', bg: '#F3F4F6' },
    'Cancelled': { icon: <CancelIcon sx={{ fontSize: '0.8rem' }} />, color: '#EF4444', bg: '#FEE2E2' }
  };

  return (
    <div className="p-5">
      <div className="space-y-5">
        {/* Page Header with Date Range */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#151C26]">Sales Order Summary</h1>
            <p className="text-xs text-[#4B5568] mt-0.5">Comprehensive overview of sales order performance</p>
          </div>
          
          {/* Date Range Picker - Small and Compact */}
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-[#E3E8EF] shadow-sm">
            <CalendarIcon sx={{ fontSize: '0.8rem', color: '#4B5568' }} />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-[11px] border-none focus:outline-none p-0 w-28 text-[#151C26]"
              style={{ outline: 'none' }}
            />
            <span className="text-[11px] text-[#94A3B8]">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-[11px] border-none focus:outline-none p-0 w-28 text-[#151C26]"
              style={{ outline: 'none' }}
            />
            <div className="w-px h-4 bg-[#E3E8EF] mx-1"></div>
            <Tooltip title="Apply Filter">
              <IconButton 
                onClick={handleApplyFilter}
                size="small"
                sx={{ p: 0.5, color: '#074346' }}
              >
                <SearchIcon sx={{ fontSize: '0.8rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset to Last 30 Days">
              <IconButton 
                onClick={handleReset}
                size="small"
                sx={{ p: 0.5, color: '#4B5568' }}
              >
                <RefreshIcon sx={{ fontSize: '0.8rem' }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <CircularProgress sx={{ color: COLORS.primary }} />
          </div>
        ) : summaryData ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-[#E3E8EF] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-medium text-[#4B5568] uppercase tracking-wider">{stat.label}</p>
                      <p className="text-xl font-bold text-[#151C26] mt-0.5">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${
                          stat.trend === 'up' ? 'bg-[#9FE2BF] text-[#063B3E]' : 'bg-red-100 text-red-700'
                        }`}>
                          {stat.trend === 'up' ? (
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : (
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          )}
                          {stat.change}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">from last period</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#074346] flex items-center justify-center shadow-sm">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryData.by_status?.map((status, idx) => {
                const config = statusConfig[status._id] || statusConfig['Draft'];
                return (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-[#E3E8EF] shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`p-1 rounded-full`} style={{ backgroundColor: config.bg }}>
                            {config.icon}
                          </div>
                          <p className="text-xs font-medium text-[#4B5568]">{status._id}</p>
                        </div>
                        <p className="text-lg font-bold text-[#151C26]">{status.count} orders</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{formatCurrency(status.value)}</p>
                      </div>
                      <Chip 
                        label={`${((status.value / totalValue) * 100).toFixed(1)}%`}
                        size="small"
                        sx={{ bgcolor: config.bg, color: config.color, fontSize: '0.7rem' }}
                      />
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={(status.value / totalValue) * 100} 
                      sx={{ mt: 1.5, height: 4, borderRadius: 2, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: config.color, borderRadius: 2 } }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Monthly Performance Table */}
            <div className="bg-white rounded-lg border border-[#E3E8EF] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E3E8EF] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#151C26]">Monthly Performance</h3>
                <div className="text-[11px] text-[#94A3B8]">
                  {summaryData.period?.from} to {summaryData.period?.to}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FFFC]">
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Month</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Orders</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Total Value</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">% of Total</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Avg. Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.by_month?.map((month, idx) => {
                      const percentage = (month.total_value / totalValue) * 100;
                      return (
                        <tr key={idx} className="border-b border-[#F2F5F8] last:border-0 hover:bg-[#F8FFFC] transition-colors">
                          <td className="p-3 text-xs font-medium text-[#151C26]">{formatMonth(month._id)}</td>
                          <td className="p-3 text-xs text-[#4B5568]">{month.so_count}</td>
                          <td className="p-3 text-xs font-medium text-[#074346]">{formatCurrency(month.total_value)}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#4B5568]">{percentage.toFixed(1)}%</span>
                              <div className="flex-1 max-w-24">
                                <LinearProgress 
                                  variant="determinate" 
                                  value={percentage} 
                                  sx={{ height: 3, borderRadius: 2, bgcolor: '#E5E7EB', '& .MuiLinearProgress-bar': { bgcolor: '#074346', borderRadius: 2 } }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-xs text-[#4B5568]">{formatCurrency(month.total_value / month.so_count)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Customers Table */}
            <div className="bg-white rounded-lg border border-[#E3E8EF] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E3E8EF] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#151C26]">Top Customers</h3>
                <div className="text-[11px] text-[#94A3B8]">
                  {summaryData.by_customer?.length || 0} customers
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FFFC]">
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">#</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Customer Name</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Orders</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Total Value</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Avg. Order</th>
                      <th className="text-left p-3 text-[10px] font-semibold text-[#4B5568] uppercase tracking-wider">Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.by_customer?.map((customer, idx) => {
                      const percentage = (customer.total_value / totalValue) * 100;
                      return (
                        <tr key={idx} className="border-b border-[#F2F5F8] last:border-0 hover:bg-[#F8FFFC] transition-colors">
                          <td className="p-3">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              idx < 3 ? 'bg-[#9FE2BF] text-[#074346]' : 'bg-gray-100 text-[#4B5568]'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="p-3 text-xs font-medium text-[#151C26]">{customer.customer_name}</td>
                          <td className="p-3 text-xs text-[#4B5568]">{customer.so_count}</td>
                          <td className="p-3 text-xs font-medium text-[#074346]">{formatCurrency(customer.total_value)}</td>
                          <td className="p-3 text-xs text-[#4B5568]">{formatCurrency(customer.total_value / customer.so_count)}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#4B5568]">{percentage.toFixed(1)}%</span>
                              <div className="flex-1 max-w-24">
                                <LinearProgress 
                                  variant="determinate" 
                                  value={percentage} 
                                  sx={{ height: 3, borderRadius: 2, bgcolor: '#E5E7EB', '& .MuiLinearProgress-bar': { bgcolor: '#074346', borderRadius: 2 } }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center border border-[#E3E8EF]">
            <AssessmentIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
            <p className="text-sm text-[#4B5568]">No data available for the selected period</p>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SOSummary;