import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
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
  Alert,
  Grid,
  Chip
} from "@mui/material";
import {
  Close,
  Print as PrintIcon,
  Assessment as AssessmentIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// 🎨 SAME DESIGN SYSTEM AS PrintMRV
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
  mb: 0.5,
  p: 1,
};

const valueStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
  p: 1,
  color: COLORS.text.primary
};

const sectionTitleStyle = {
  fontSize: "0.7rem",
  fontWeight: 600,
  color: COLORS.primary,
  mb: 2,
  letterSpacing: "0.5px",
  borderBottom: `2px solid ${COLORS.primary}`,
  paddingBottom: "8px"
};

const PSVReport = ({ open, onClose, psvId, psvData: propData }) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [psvDetails, setPsvDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && psvId) {
      fetchReport();
    } else if (open && propData) {
      fetchReport();
    }
  }, [open, psvId, propData]);

  const fetchReport = async () => {
    const idToFetch = psvId || propData?._id;
    if (!idToFetch) {
      setError("No PSV ID provided");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${BASE_URL}/api/physical-verifications/${idToFetch}/report`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        setReportData(response.data.data);
        await fetchBasicDetails(idToFetch);
      } else {
        setError(response.data.message || "Failed to fetch PSV report");
      }
    } catch (err) {
      console.error("Error fetching PSV report:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to fetch PSV report";
        
        if (err.response.status === 404) {
          setError("PSV report not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to view this report");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while fetching PSV report");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBasicDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/physical-verifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPsvDetails(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching basic details:", err);
    }
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
      return new Date(dateString).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateOnly = (dateString) => {
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

  const getPersonName = (person) => {
    if (!person) return '-';
    if (typeof person === 'object') {
      if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
      if (person.FirstName) return person.FirstName;
      if (person.Username) return person.Username;
      if (person.Email) return person.Email;
      if (person.name) return person.name;
      return '-';
    }
    return person;
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Initiated: { color: '#D97706', bg: '#FEF3C7', label: 'Initiated' },
      'In Progress': { color: '#0284C7', bg: '#E0F2FE', label: 'In Progress' },
      'Count Completed': { color: '#2563EB', bg: '#DBEAFE', label: 'Count Completed' },
      'Under Review': { color: '#9333EA', bg: '#F3E8FF', label: 'Under Review' },
      Adjusted: { color: '#059669', bg: '#D1FAE5', label: 'Adjusted' },
      Approved: { color: '#059669', bg: '#D1FAE5', label: 'Approved' },
      Closed: { color: '#475569', bg: '#F1F5F9', label: 'Closed' }
    };
    const config = statusConfig[status] || statusConfig.Initiated;
    return (
      <Chip 
        label={config.label} 
        size="small" 
        sx={{ 
          fontSize: '0.7rem', 
          height: 24, 
          bgcolor: config.bg, 
          color: config.color, 
          fontWeight: 600 
        }} 
      />
    );
  };

  const getVerificationTypeChip = (type) => {
    const typeConfig = {
      'Full Count': { color: '#059669', bg: '#D1FAE5', label: 'Full Count' },
      'Cycle Count': { color: '#2563EB', bg: '#DBEAFE', label: 'Cycle Count' },
      'Spot Check': { color: '#D97706', bg: '#FEF3C7', label: 'Spot Check' },
      'Pre-Audit Count': { color: '#9333EA', bg: '#F3E8FF', label: 'Pre-Audit Count' }
    };
    const config = typeConfig[type] || { color: '#475569', bg: '#F1F5F9', label: type || '-' };
    return (
      <Chip 
        label={config.label} 
        size="small" 
        sx={{ 
          fontSize: '0.7rem', 
          height: 24, 
          bgcolor: config.bg, 
          color: config.color, 
          fontWeight: 600 
        }} 
      />
    );
  };

  const handlePrint = () => {
    const printContent = document.getElementById('psv-print-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError("Please allow pop-ups to print");
      return;
    }

    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    let stylesHTML = '';
    styles.forEach((style) => {
      if (style.tagName === 'STYLE') {
        stylesHTML += style.outerHTML;
      } else if (style.tagName === 'LINK' && style.rel === 'stylesheet') {
        stylesHTML += style.outerHTML;
      }
    });

    const verificationId = reportData?.header?.verification_id || psvDetails?.verification_id || psvDetails?._id?.slice(-8) || 'Report';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PSV_${verificationId}</title>
          <meta charset="utf-8" />
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
              padding: 20px;
              background: white;
              color: #151C26;
            }
            .print-container {
              max-width: 1200px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 15px;
              border-bottom: 3px solid #063C3F;
            }
            .header h1 {
              color: #063C3F;
              font-size: 28px;
              margin-bottom: 8px;
              font-weight: 700;
            }
            .header p {
              color: #4B5568;
              font-size: 14px;
              font-family: monospace;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 14px;
              font-weight: 700;
              color: #063C3F;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 2px solid #063C3F;
              letter-spacing: 0.5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-label {
              font-size: 11px;
              font-weight: 600;
              color: #4B5568;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 13px;
              font-weight: 500;
              color: #151C26;
            }
            .stat-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .stat-card {
              border: 1px solid #E3E8EF;
              border-radius: 8px;
              padding: 12px;
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #E3E8EF;
              padding: 10px 8px;
              text-align: left;
            }
            th {
              background-color: #063C3F;
              color: white;
              font-weight: 600;
              font-size: 11px;
            }
            td {
              font-size: 11px;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .variance-positive {
              color: #D97706;
              font-weight: 600;
            }
            .variance-negative {
              color: #DC2626;
              font-weight: 600;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E3E8EF;
              text-align: center;
              font-size: 10px;
              color: #94A3B8;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              padding-top: 20px;
            }
            .signature-box {
              text-align: center;
              width: 200px;
            }
            .signature-line {
              margin-top: 40px;
              padding-top: 8px;
              border-top: 1px solid #4B5568;
              font-size: 11px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
          ${stylesHTML}
        </head>
        <body>
          <div class="print-container">
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

  const headerData = reportData?.header || {};
  const personnelData = reportData?.personnel || {};
  const summaryData = reportData?.summary || {};
  const variancesData = reportData?.variances || {};
  const adjustmentsData = reportData?.adjustments || {};

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
          overflow: "hidden"
        }
      }}
    >
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
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: COLORS.text.primary }}>
            PSV Report
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white, maxHeight: '70vh', overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.875rem', color: COLORS.text.secondary }}>
              Loading report data...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }} action={<Button color="inherit" size="small" onClick={fetchReport}>Retry</Button>}>
            {error}
          </Alert>
        ) : reportData ? (
          <Box id="psv-print-content">
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: `3px solid ${COLORS.primary}` }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary, mb: 1 }}>
                PHYSICAL STOCK VERIFICATION REPORT
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary, fontFamily: 'monospace' }}>
                {headerData.verification_id || psvDetails?.verification_id || '-'}
              </Typography>
            </Box>

            {/* Verification Details Section */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>VERIFICATION DETAILS</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>VERIFICATION ID</Typography>
                  <Typography sx={valueStyle}>{headerData.verification_id || psvDetails?.verification_id || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>VERIFICATION DATE</Typography>
                  <Typography sx={valueStyle}>{formatDateOnly(headerData.verification_date || psvDetails?.verification_date)}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>FREEZE DATE & TIME</Typography>
                  <Typography sx={valueStyle}>{formatDate(headerData.freeze_datetime || psvDetails?.freeze_datetime)}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>VERIFICATION TYPE</Typography>
                  {getVerificationTypeChip(headerData.verification_type || psvDetails?.verification_type)}
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography sx={labelStyle}>WAREHOUSE</Typography>
                  <Typography sx={valueStyle}>{headerData.warehouse_name || psvDetails?.warehouse_name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>STATUS</Typography>
                  {getStatusChip(headerData.status || psvDetails?.status)}
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Personnel Section */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>PERSONNEL DETAILS</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>CONDUCTED BY</Typography>
                  <Typography sx={valueStyle}>{getPersonName(personnelData.conducted_by) || getPersonName(psvDetails?.conducted_by) || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>WITNESS</Typography>
                  <Typography sx={valueStyle}>{getPersonName(personnelData.witness) || getPersonName(psvDetails?.witness) || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>CREATED BY</Typography>
                  <Typography sx={valueStyle}>{getPersonName(personnelData.created_by) || getPersonName(psvDetails?.created_by) || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>CREATED AT</Typography>
                  <Typography sx={valueStyle}>{formatDate(personnelData.created_at || psvDetails?.createdAt)}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Summary Statistics */}
            {/* <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>SUMMARY STATISTICS</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Total Items</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {summaryData.total_items || psvDetails?.items?.length || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Items Counted</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {summaryData.total_items_counted || psvDetails?.total_items_counted || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Surplus Items</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#D97706' }}>
                      {summaryData.surplus_items || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Shortage Items</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#DC2626' }}>
                      {summaryData.shortage_items || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box> */}

            

            {/* Variance Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>VARIANCE SUMMARY</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1.5, bgcolor: '#FEF3C7', borderRadius: 2 }}>
                    <Typography sx={labelStyle}>TOTAL VARIANCE VALUE</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#D97706' }}>
                      {formatCurrency(summaryData.total_variance_value || psvDetails?.total_variance_value)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                    <Typography sx={labelStyle}>NET VARIANCE VALUE</Typography>
                    <Typography sx={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 700, 
                      color: (summaryData.net_variance_value || psvDetails?.net_variance_value || 0) > 0 ? '#D97706' : 
                             (summaryData.net_variance_value || psvDetails?.net_variance_value || 0) < 0 ? '#DC2626' : '#059669'
                    }}>
                      {formatCurrency(summaryData.net_variance_value || psvDetails?.net_variance_value)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Surplus Items Table */}
            {variancesData.surplus && variancesData.surplus.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ ...sectionTitleStyle, color: '#D97706' }}>SURPLUS ITEMS (Physical {'>'} System)</Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#FEF3C7' }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Item Code</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">System Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Physical Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Variance</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {variancesData.surplus.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{item.item_code || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.description || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.system_quantity || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.physical_quantity || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            <Typography sx={{ fontWeight: 600, color: '#D97706' }}>+{item.variance || 0}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.remarks || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Shortage Items Table */}
            {variancesData.shortage && variancesData.shortage.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ ...sectionTitleStyle, color: '#DC2626' }}>SHORTAGE ITEMS (Physical {'<'} System)</Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#FEE2E2' }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Item Code</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">System Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Physical Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Variance</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {variancesData.shortage.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{item.item_code || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.description || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.system_quantity || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.physical_quantity || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                            <Typography sx={{ fontWeight: 600, color: '#DC2626' }}>{item.variance || 0}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{item.remarks || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* No Variances Message */}
            {(!variancesData.surplus || variancesData.surplus.length === 0) && 
             (!variancesData.shortage || variancesData.shortage.length === 0) && (
              <Alert severity="success" sx={{ borderRadius: 1.5, mb: 3 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  <strong>Perfect Match!</strong> No variances found. All counted quantities match system records.
                </Typography>
              </Alert>
            )}

            {/* Adjustments Section */}
            {(adjustmentsData.total_adjustments > 0 || psvDetails?.adjustment_txn_ids?.length > 0) && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={sectionTitleStyle}>ADJUSTMENT INFORMATION</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={labelStyle}>TOTAL ADJUSTMENTS</Typography>
                    <Typography sx={valueStyle}>{adjustmentsData.total_adjustments || psvDetails?.adjustment_txn_ids?.length || 0}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography sx={labelStyle}>ADJUSTMENT STATUS</Typography>
                    <Chip 
                      label={adjustmentsData.status || (psvDetails?.adjustment_txn_ids?.length > 0 ? 'Completed' : 'Pending')} 
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24, 
                        bgcolor: (adjustmentsData.status === 'Completed' || psvDetails?.adjustment_txn_ids?.length > 0) ? '#D1FAE5' : '#FEF3C7',
                        color: (adjustmentsData.status === 'Completed' || psvDetails?.adjustment_txn_ids?.length > 0) ? '#059669' : '#D97706'
                      }} 
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Remarks */}
            {(reportData.remarks || psvDetails?.remarks) && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={sectionTitleStyle}>REMARKS</Typography>
                <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                    {reportData.remarks || psvDetails?.remarks}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Signatures */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2 }}>
              <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Conducted By</Typography>
                <Typography sx={{ mt: 3, pt: 1, borderTop: `1px solid ${COLORS.text.secondary}`, fontSize: '0.7rem' }}>
                  {getPersonName(personnelData.conducted_by) || getPersonName(psvDetails?.conducted_by)?.split('(')[0]?.trim() || 'Signature'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Witness</Typography>
                <Typography sx={{ mt: 3, pt: 1, borderTop: `1px solid ${COLORS.text.secondary}`, fontSize: '0.7rem' }}>
                  {getPersonName(personnelData.witness) || getPersonName(psvDetails?.witness)?.split('(')[0]?.trim() || 'Signature'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Authorised By</Typography>
                <Typography sx={{ mt: 3, pt: 1, borderTop: `1px solid ${COLORS.text.secondary}`, fontSize: '0.7rem' }}>
                  {getPersonName(personnelData.approved_by) || getPersonName(psvDetails?.approved_by)?.split('(')[0]?.trim() || 'Signature'}
                </Typography>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                This is a system generated document. Valid without signature.
              </Typography>
              <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                Printed on: {new Date().toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>
            No report data available
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: "0.7rem", fontWeight: 500, textTransform: 'none' }}>
          Close
        </Button>
        <Button variant="contained" onClick={handlePrint} disabled={loading || !!error || !reportData} startIcon={<PrintIcon sx={{ fontSize: "1rem" }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: "0.7rem", fontWeight: 500, textTransform: 'none', '&:hover': { bgcolor: COLORS.primaryDark } }}>
          Print Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PSVReport;