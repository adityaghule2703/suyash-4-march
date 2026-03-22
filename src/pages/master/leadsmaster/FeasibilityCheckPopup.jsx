import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Paper,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Grid,
  Divider
} from '@mui/material';
import { 
  Close as CloseIcon, 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

const FeasibilityCheckPopup = ({ open, onClose, lead }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feasibilityData, setFeasibilityData] = useState(null);

  useEffect(() => {
    if (open && lead) {
      fetchFeasibilityCheck();
    }
  }, [open, lead]);

  const fetchFeasibilityCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/leads/${lead._id}/feasibility-check`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setFeasibilityData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch feasibility check');
      }
    } catch (err) {
      console.error('Error fetching feasibility check:', err);
      setError(err.response?.data?.message || 'Failed to fetch feasibility check');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFeasibilityData(null);
    setError('');
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'Feasible') return '#10B981';
    if (verdict === 'Conditionally Feasible') return '#F59E0B';
    if (verdict === 'Not Feasible') return '#EF4444';
    return COLORS.text.secondary;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass':
        return { bg: '#DCFCE7', color: '#166534', icon: CheckCircleIcon };
      case 'fail':
        return { bg: '#FEE2E2', color: '#991B1B', icon: CancelIcon };
      case 'conditional':
        return { bg: '#FEF3C7', color: '#92400E', icon: WarningIcon };
      default:
        return { bg: '#F1F5F9', color: '#475569', icon: null };
    }
  };

  if (!lead) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb:2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Feasibility Check Report
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.875rem', color: COLORS.text.secondary }}>
              Analyzing feasibility...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>
            {error}
          </Alert>
        ) : feasibilityData ? (
          <Stack spacing={2.5}>
            {/* Header Section */}
            {/* <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lead ID:</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {feasibilityData.lead_id}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Subject:</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {feasibilityData.subject}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Company:</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {feasibilityData.company_name}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Overall Verdict:</Typography>
                      <Chip
                        icon={<ScienceIcon sx={{ fontSize: 14 }} />}
                        label={feasibilityData.overall_verdict}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 26,
                          bgcolor: `${getVerdictColor(feasibilityData.overall_verdict)}20`,
                          color: getVerdictColor(feasibilityData.overall_verdict),
                          fontWeight: 600,
                          border: `1px solid ${getVerdictColor(feasibilityData.overall_verdict)}40`
                        }}
                      />
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Checked At:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>
                        {formatDate(feasibilityData.checked_at)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Paper> */}

            {/* Summary Cards */}
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  bgcolor: COLORS.background.light,
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Total Items
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {feasibilityData.summary.total_items}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  bgcolor: '#DCFCE7',
                  borderRadius: 1.5,
                  border: '1px solid #86EFAC'
                }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#166534', mb: 0.5 }}>
                    Feasible Items
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#166534' }}>
                    {feasibilityData.summary.feasible_items}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  bgcolor: '#FEF3C7',
                  borderRadius: 1.5,
                  border: '1px solid #FCD34D'
                }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#92400E', mb: 0.5 }}>
                    Conditionally Feasible
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#92400E' }}>
                    {feasibilityData.summary.conditionally_feasible}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  bgcolor: '#FEE2E2',
                  borderRadius: 1.5,
                  border: '1px solid #FECACA'
                }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#991B1B', mb: 0.5 }}>
                    Not Feasible Items
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#991B1B' }}>
                    {feasibilityData.summary.not_feasible_items}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Items Table */}
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Item-wise Feasibility Analysis
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableRow>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600, py: 1.5 }}>Item Details</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600, py: 1.5 }}>Item Exists</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600, py: 1.5 }}>Material Check</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600, py: 1.5 }}>Dimension Check</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600, py: 1.5 }}>Process Check</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600, py: 1.5 }}>Stock Check</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600, py: 1.5 }}>Verdict</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feasibilityData.items.map((item, index) => {
                      const itemStatusColor = getStatusColor(item.item_exists?.status);
                      const materialStatusColor = getStatusColor(item.material_check?.status);
                      const dimensionStatusColor = getStatusColor(item.dimension_check?.status);
                      const processStatusColor = getStatusColor(item.process_check?.status);
                      const stockStatusColor = getStatusColor(item.stock_check?.status);
                      const ItemStatusIcon = itemStatusColor.icon;
                      const MaterialStatusIcon = materialStatusColor.icon;
                      const DimensionStatusIcon = dimensionStatusColor.icon;
                      const ProcessStatusIcon = processStatusColor.icon;
                      const StockStatusIcon = stockStatusColor.icon;

                      return (
                        <TableRow key={index} hover>
                          <TableCell sx={{ py: 1.5, verticalAlign: 'top' }}>
                            <Stack spacing={0.5}>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                {item.description}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                Part No: {item.part_no || '-'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                Qty: {item.quantity} {item.unit}
                              </Typography>
                              {item.material_grade && (
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                  Grade: {item.material_grade}
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, verticalAlign: 'top' }}>
                            <Stack spacing={0.5}>
                              <Chip
                                icon={ItemStatusIcon && <ItemStatusIcon sx={{ fontSize: 14 }} />}
                                label={item.item_exists?.status?.toUpperCase() || '-'}
                                size="small"
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 22,
                                  bgcolor: itemStatusColor.bg,
                                  color: itemStatusColor.color,
                                  fontWeight: 500
                                }}
                              />
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, maxWidth: 180 }}>
                                {item.item_exists?.note || '-'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, verticalAlign: 'top' }}>
                            <Stack spacing={0.5}>
                              <Chip
                                icon={MaterialStatusIcon && <MaterialStatusIcon sx={{ fontSize: 14 }} />}
                                label={item.material_check?.status?.toUpperCase() || '-'}
                                size="small"
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 22,
                                  bgcolor: materialStatusColor.bg,
                                  color: materialStatusColor.color,
                                  fontWeight: 500
                                }}
                              />
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, maxWidth: 180 }}>
                                {item.material_check?.note || '-'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, verticalAlign: 'top' }}>
                            <Stack spacing={0.5}>
                              <Chip
                                icon={DimensionStatusIcon && <DimensionStatusIcon sx={{ fontSize: 14 }} />}
                                label={item.dimension_check?.status?.toUpperCase() || '-'}
                                size="small"
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 22,
                                  bgcolor: dimensionStatusColor.bg,
                                  color: dimensionStatusColor.color,
                                  fontWeight: 500
                                }}
                              />
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, maxWidth: 180 }}>
                                {item.dimension_check?.note || '-'}
                              </Typography>
                              {item.dimension_check?.data?.weight_kg && (
                                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                                  Weight: {item.dimension_check.data.weight_kg} kg
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, verticalAlign: 'top' }}>
                            <Stack spacing={0.5}>
                              <Chip
                                icon={ProcessStatusIcon && <ProcessStatusIcon sx={{ fontSize: 14 }} />}
                                label={item.process_check?.status?.toUpperCase() || '-'}
                                size="small"
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 22,
                                  bgcolor: processStatusColor.bg,
                                  color: processStatusColor.color,
                                  fontWeight: 500
                                }}
                              />
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, maxWidth: 180 }}>
                                {item.process_check?.note || '-'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, verticalAlign: 'top' }}>
                            <Stack spacing={0.5}>
                              <Chip
                                icon={StockStatusIcon && <StockStatusIcon sx={{ fontSize: 14 }} />}
                                label={item.stock_check?.status?.toUpperCase() || '-'}
                                size="small"
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 22,
                                  bgcolor: stockStatusColor.bg,
                                  color: stockStatusColor.color,
                                  fontWeight: 500
                                }}
                              />
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, maxWidth: 180 }}>
                                {item.stock_check?.note || '-'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, verticalAlign: 'top' }}>
                            <Chip
                              label={item.feasibility_verdict}
                              size="small"
                              sx={{ 
                                fontSize: '0.7rem', 
                                height: 26,
                                bgcolor: `${getVerdictColor(item.feasibility_verdict)}20`,
                                color: getVerdictColor(item.feasibility_verdict),
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Note Section */}
            {/* {feasibilityData.note && (
              <Paper sx={{ 
                p: 1.5, 
                bgcolor: COLORS.primaryLight, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.primary}`
              }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primaryDark, mb: 0.5 }}>
                  System Note:
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  {feasibilityData.note}
                </Typography>
              </Paper>
            )} */}
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
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

export default FeasibilityCheckPopup;