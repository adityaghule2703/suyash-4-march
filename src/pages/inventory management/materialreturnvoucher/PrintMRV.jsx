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
  Warning as WarningIcon
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

const valueStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
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

const PrintMRV = ({ open, onClose, data }) => {
  const [loading, setLoading] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && data && data._id) {
      fetchPrintData();
    }
  }, [open, data]);

  const fetchPrintData = async () => {
    if (!data || !data._id) {
      setError("Invalid MRV data");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${BASE_URL}/api/mrv/${data._id}/print`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        setPrintData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch print data");
      }
    } catch (err) {
      console.error("Error fetching print data:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to fetch print data";
        
        if (err.response.status === 404) {
          setError("MRV not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to print this MRV");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while fetching print data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-content');
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

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MRV_${printData?.document?.number || data?.mrv_number || 'Print'}</title>
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
            .total-section {
              text-align: right;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 2px solid #E3E8EF;
            }
            .total-row {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 8px;
            }
            .total-label {
              width: 150px;
              font-weight: 600;
              font-size: 13px;
            }
            .total-value {
              width: 150px;
              font-weight: 700;
              font-size: 14px;
              color: #063C3F;
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

  const getStatusChip = (status) => {
    const statusConfig = {
      Draft: { color: '#D97706', bg: '#FEF3C7', label: 'Draft' },
      Posted: { color: '#059669', bg: '#D1FAE5', label: 'Posted' },
      Cancelled: { color: '#DC2626', bg: '#FEE2E2', label: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.Draft;
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

  const getConditionChip = (condition) => {
    const conditionConfig = {
      Good: { color: '#059669', bg: '#D1FAE5' },
      'Partially Damaged': { color: '#D97706', bg: '#FEF3C7' },
      Scrap: { color: '#DC2626', bg: '#FEE2E2' }
    };
    const config = conditionConfig[condition] || conditionConfig.Good;
    return (
      <Chip 
        label={condition || '-'} 
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

  if (!open) return null;

  const displayData = printData;

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
          <PrintIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: COLORS.text.primary }}>
            Print MRV
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
              Loading print data...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }} action={<Button color="inherit" size="small" onClick={fetchPrintData}>Retry</Button>}>
            {error}
          </Alert>
        ) : displayData ? (
          <Box id="print-content">
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: `3px solid ${COLORS.primary}` }}>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, color: COLORS.primary, mb: 1 }}>
                {displayData.document?.title || "MATERIAL RETURN VOUCHER"}
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: COLORS.text.secondary, fontFamily: 'monospace' }}>
                {displayData.document?.number || '-'}
              </Typography>
            </Box>

            {/* Document Details Section */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>DOCUMENT DETAILS</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>MRV NUMBER</Typography>
                  <Typography sx={valueStyle}>{displayData.document?.number || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>DATE</Typography>
                  <Typography sx={valueStyle}>{formatDate(displayData.document?.date)}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>STATUS</Typography>
                  {getStatusChip(displayData.document?.status)}
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Work Order & Original MIV Section */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>WORK ORDER & ORIGINAL MIV</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>WORK ORDER NUMBER</Typography>
                  <Typography sx={valueStyle}>{displayData.work_order?.number || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>PART NO</Typography>
                  <Typography sx={valueStyle}>{displayData.work_order?.part_no || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>PART NAME</Typography>
                  <Typography sx={valueStyle}>{displayData.work_order?.part_name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>PLANNED QUANTITY</Typography>
                  <Typography sx={valueStyle}>{displayData.work_order?.planned_qty || 0}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>ORIGINAL MIV NUMBER</Typography>
                  <Typography sx={valueStyle}>{displayData.original_miv?.number || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>MIV DATE</Typography>
                  <Typography sx={valueStyle}>{formatDate(displayData.original_miv?.date)}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Personnel Section */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>PERSONNEL DETAILS</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>RETURNED BY</Typography>
                  <Typography sx={valueStyle}>{displayData.personnel?.returned_by || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>RECEIVED BY (STORE)</Typography>
                  <Typography sx={valueStyle}>{displayData.personnel?.received_by || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>CREATED BY</Typography>
                  <Typography sx={valueStyle}>{displayData.personnel?.created_by || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>POSTED BY</Typography>
                  <Typography sx={valueStyle}>{displayData.personnel?.posted_by || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={labelStyle}>POSTED AT</Typography>
                  <Typography sx={valueStyle}>{formatDate(displayData.personnel?.posted_at)}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Return Details Section */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>RETURN DETAILS</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>CONDITION</Typography>
                  {getConditionChip(displayData.condition)}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={labelStyle}>DESTINATION WAREHOUSE</Typography>
                  <Typography sx={valueStyle}>
                    {displayData.destination?.condition_based || 'Raw Material Store'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Items Table */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={sectionTitleStyle}>RETURN ITEMS</Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.primary }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }} align="right">Returned Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }} align="right">Unit Cost</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }} align="right">Total Value</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Batch No</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(displayData.items || []).map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{item.description || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                          <Typography sx={{ fontWeight: 600, color: COLORS.primary }}>
                            {item.returned_qty || 0}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.unit_cost || 0)}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                          <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                            {formatCurrency(item.total_value || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{item.batch_no || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Totals Section */}
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Stack spacing={1} alignItems="flex-end">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 250 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Total Items:</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{displayData.totals?.item_count || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 250 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Total Return Value:</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                    {formatCurrency(displayData.totals?.total_return_value)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Remarks */}
            {displayData.remarks && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={sectionTitleStyle}>REMARKS</Typography>
                <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                    {displayData.remarks}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Signatures */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2 }}>
              <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Returned By</Typography>
                <Typography sx={{ mt: 3, pt: 1, borderTop: `1px solid ${COLORS.text.secondary}`, fontSize: '0.7rem' }}>
                  {displayData.personnel?.returned_by?.split('(')[0]?.trim() || 'Signature'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Received By (Store)</Typography>
                <Typography sx={{ mt: 3, pt: 1, borderTop: `1px solid ${COLORS.text.secondary}`, fontSize: '0.7rem' }}>
                  {displayData.personnel?.received_by || 'Signature'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Authorised By</Typography>
                <Typography sx={{ mt: 3, pt: 1, borderTop: `1px solid ${COLORS.text.secondary}`, fontSize: '0.7rem' }}>
                  {displayData.personnel?.posted_by || 'Signature'}
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
            No print data available
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: "0.7rem", fontWeight: 500, textTransform: 'none' }}>
          Close
        </Button>
        <Button variant="contained" onClick={handlePrint} disabled={loading || !!error || !displayData} startIcon={<PrintIcon sx={{ fontSize: "1rem" }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: "0.7rem", fontWeight: 500, textTransform: 'none', '&:hover': { bgcolor: COLORS.primaryDark } }}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintMRV;