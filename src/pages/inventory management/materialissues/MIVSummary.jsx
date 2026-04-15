import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Chip,
  Card,
  CardContent
} from "@mui/material";
import {
  Close,
  Assessment as AssessmentIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  MonetizationOn as MonetizationIcon,
  ReceiptLong as ReceiptIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// 🎨 SAME DESIGN SYSTEM
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  primaryLight: "#E8F0F1",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8",
    light: "#FFFFFF"
  },
  background: {
    white: "#FFFFFF",
    light: "#F8FFFC"
  },
  border: "#E3E8EF"
};

const labelStyle = {
  fontSize: "0.65rem",
  fontWeight: 600,
  color: COLORS.text.secondary,
  letterSpacing: "0.5px",
  mb: 0.5
};

const MIVSummary = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaryData, setSummaryData] = useState(null);
  
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: ""
  });

  useEffect(() => {
    if (open) {
      // Set default date range (last 30 days)
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      
      setFilters({
        from_date: fromDate.toISOString().split('T')[0],
        to_date: toDate.toISOString().split('T')[0]
      });
    }
  }, [open]);

  useEffect(() => {
    if (open && filters.from_date && filters.to_date) {
      fetchSummary();
    }
  }, [filters, open]);

  const fetchSummary = async () => {
    if (!filters.from_date || !filters.to_date) {
      setError("Please select both from and to dates");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      params.append('from_date', filters.from_date);
      params.append('to_date', filters.to_date);

      const response = await axios.get(`${BASE_URL}/api/miv/summary?${params.toString()}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        setSummaryData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch summary");
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to fetch summary";
        setError(errorMsg);
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while fetching summary");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    
    setFilters({
      from_date: fromDate.toISOString().split('T')[0],
      to_date: toDate.toISOString().split('T')[0]
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('summary-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError("Please allow pop-ups to print");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MIV Summary Report</title>
          <meta charset="utf-8" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { color: #063C3F; margin-bottom: 5px; }
            .filters { margin-bottom: 20px; padding: 10px; background: #f5f5f5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #063C3F; color: white; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div>
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (!open) return null;

  const summary = summaryData?.summary;
  const period = summaryData?.period;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
          maxHeight: '90vh'
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 1.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AssessmentIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            MIV Summary Report
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Filters Section */}
          <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
              FILTERS
            </Typography>
            
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={5}>
                <Typography sx={labelStyle}>
                  FROM DATE <span style={{ color: "#EF4444" }}>*</span>
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  value={filters.from_date}
                  onChange={(e) => handleFilterChange('from_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={5}>
                <Typography sx={labelStyle}>
                  TO DATE <span style={{ color: "#EF4444" }}>*</span>
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  value={filters.to_date}
                  onChange={(e) => handleFilterChange('to_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={2}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleReset}
                  startIcon={<RefreshIcon sx={{ fontSize: '0.875rem' }} />}
                  fullWidth
                  sx={{
                    height: 40,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.7rem'
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Error Display */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ borderRadius: 1.5 }} 
              onClose={() => setError("")}
              action={
                <Button color="inherit" size="small" onClick={fetchSummary}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: COLORS.primary }} />
              <Typography sx={{ ml: 2, fontSize: '0.875rem', color: COLORS.text.secondary }}>
                Loading summary data...
              </Typography>
            </Box>
          )}

          {/* Summary Content */}
          {!loading && !error && summary && (
            <Box id="summary-content">
              {/* Header for Print */}
              <Box sx={{ textAlign: 'center', mb: 3, display: { xs: 'none', print: 'block' } }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                  MIV Summary Report
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                  Period: {period?.from === "All" ? "All Time" : formatDate(period?.from)} to {period?.to === "All" ? "All Time" : formatDate(period?.to)}
                </Typography>
              </Box>

            

              <Divider sx={{ my: 2 }} />

              {/* Top Issued Items */}
              {summary.top_issued_items && summary.top_issued_items.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                    TOP ISSUED ITEMS
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.light }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Total Quantity</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total Value</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">No. of Issues</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {summary.top_issued_items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              <Typography sx={{ fontWeight: 500 }}>{item.part_no}</Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                              {item.total_issued_qty?.toLocaleString() || 0}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                                {formatCurrency(item.total_value)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                              {item.count || 0}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Daily Issues */}
              {summary.daily_issues && summary.daily_issues.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                    DAILY ISSUES TREND
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.light }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Date</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">No. of Issues</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {summary.daily_issues.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              {formatDate(item.date)}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                              {item.issue_count || 0}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              {formatCurrency(item.issue_value)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Department-wise Summary */}
              {summary.by_department && Object.keys(summary.by_department).length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                    DEPARTMENT WISE SUMMARY
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.light }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Department</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Issue Count</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Issue Value</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Returned Value</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Net Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(summary.by_department).map(([deptName, data]) => (
                          <TableRow key={deptName}>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              <Typography sx={{ fontWeight: 500 }}>{deptName}</Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                              {data.issue_count || 0}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              {formatCurrency(data.issue_value)}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              {formatCurrency(data.returned_value || 0)}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                                {formatCurrency((data.issue_value || 0) - (data.returned_value || 0))}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Footer */}
              <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                  Report generated on: {new Date().toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}

          {/* No Data State */}
          {!loading && !error && !summary && (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              No summary data available for the selected period. Please adjust your filters or try a different date range.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: "0.7rem",
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>
        
       
      </DialogActions>
    </Dialog>
  );
};

export default MIVSummary;