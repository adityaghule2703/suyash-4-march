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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  Paper as MuiPaper
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  ExpandMore as ExpandMoreIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';
import { InfoIcon } from 'lucide-react';

// Status colors
const STATUS_COLORS = {
  'Draft': { bg: '#FEF3C7', color: '#92400E', border: '#FBBF24' },
  'Confirmed': { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
  'In Production': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Ready for Dispatch': { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  'Partially Delivered': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Fully Delivered': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Closed': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Cancelled': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' }
};

const DELIVERY_TERMS_OPTIONS = ['Ex-Works', 'FOR Destination', 'CIF', 'FOB', ''];
const PAYMENT_TERMS_OPTIONS = ['Net 30', 'Net 60', 'Net 90', 'Advance', 'LC', ''];
const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP', 'AED'];

// Action Menu Component
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onRevise, onAcknowledge, onHistory }) => {
  const canRevise = item?.status === 'Confirmed' || item?.status === 'In Production';
  const canAcknowledge = !item?.acknowledgement_sent_at && item?.status === 'Confirmed';

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}20`
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {canRevise && (
          <MenuItem onClick={() => { onRevise(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                Revise Order
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canAcknowledge && (
          <MenuItem onClick={() => { onAcknowledge(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Send Acknowledgement
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <MenuItem onClick={() => { onHistory(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
              View Revisions
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Revision History Modal
const RevisionHistoryModal = ({ open, onClose, revisionsData, loading, soNumber }) => {
  const [selectedRevision, setSelectedRevision] = useState(0);
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount, currency = 'INR') => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const currentRevision = revisionsData?.revisions?.[selectedRevision];
  const totalRevisions = revisionsData?.total_revisions || 0;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '85vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <HistoryIcon sx={{ color: COLORS.primary, fontSize: '1.25rem' }} />
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
              Revision History
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {soNumber} - Total Revisions: {totalRevisions}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Typography sx={{ fontSize: '1.25rem' }}>×</Typography>
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, bgcolor: COLORS.background.light }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
          </Box>
        ) : !revisionsData || revisionsData.revisions?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <HistoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
            <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
              No revisions available for this order
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Sidebar with revision list */}
            <Box sx={{ 
              width: 280, 
              borderRight: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white,
              overflow: 'auto'
            }}>
              {revisionsData.revisions.map((rev, index) => (
                <Box
                  key={rev._id}
                  onClick={() => setSelectedRevision(index)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderBottom: `1px solid ${COLORS.border}`,
                    bgcolor: selectedRevision === index ? `${COLORS.primary}10` : 'transparent',
                    '&:hover': {
                      bgcolor: `${COLORS.primary}05`
                    }
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                      Revision {rev.revision_no}
                    </Typography>
                    <Chip
                      label={rev.revision_no === revisionsData.current_revision ? 'Current' : `v${rev.revision_no}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.6rem',
                        bgcolor: rev.revision_no === revisionsData.current_revision ? COLORS.primary : COLORS.background.light,
                        color: rev.revision_no === revisionsData.current_revision ? COLORS.text.light : COLORS.text.secondary
                      }}
                    />
                  </Stack>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    {formatDate(rev.revised_at)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    By: {rev.revised_by?.Username || 'System'}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            {/* Revision details */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2.5 }}>
              {currentRevision && (
                <Stack spacing={2.5}>
                  {/* Revision Info */}
                  <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: COLORS.text.primary }}>
                        Revision Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            Reason for Revision:
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, mt: 0.5 }}>
                            {currentRevision.reason || '-'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            Revised At
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, mt: 0.5 }}>
                            {formatDate(currentRevision.revised_at)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            Revised By
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, mt: 0.5 }}>
                            {currentRevision.revised_by?.Username || 'System'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  
                  {/* Items Snapshot */}
                  <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1.5, color: COLORS.text.primary }}>
                        Items Snapshot
                      </Typography>
                      <TableContainer component={MuiPaper} sx={{ borderRadius: 1, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: COLORS.background.light }}>
                              <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No.</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part Name</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Qty</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Required Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {currentRevision.items_snapshot?.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
                                <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name}</TableCell>
                                <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.ordered_qty} {item.unit}</TableCell>
                                <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.unit_price)}</TableCell>
                                <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.total_amount)}</TableCell>
                                <TableCell sx={{ fontSize: '0.7rem' }}>{formatDate(item.required_date)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Stack>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Revise Order Dialog
const ReviseOrderDialog = ({ open, onClose, order, onReviseComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [reason, setReason] = useState('');
  const [items, setItems] = useState([]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [internalRemarks, setInternalRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const steps = ['Revision Reason', 'Order Details', 'Review Items'];
  
  useEffect(() => {
    if (order && open) {
      setItems(order.items?.map(item => ({
        _id: item._id,
        part_no: item.part_no,
        part_name: item.part_name,
        ordered_qty: item.ordered_qty,
        unit_price: item.unit_price,
        committed_date: item.committed_date?.split('T')[0] || '',
        required_date: item.required_date?.split('T')[0] || '',
        discount_percent: item.discount_percent || 0,
        remarks: item.remarks || '',
        original_qty: item.ordered_qty,
        unit: item.unit
      })) || []);
      
      setExpectedDeliveryDate(order.expected_delivery_date?.split('T')[0] || '');
      setPaymentTerms(order.payment_terms || '');
      setDeliveryTerms(order.delivery_terms || '');
      setInternalRemarks(order.internal_remarks || '');
    }
  }, [order, open]);
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
    
    setFieldErrors(prev => ({
      ...prev,
      [`item_${index}_${field}`]: ''
    }));
  };
  
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    
    switch (step) {
      case 0:
        if (!reason.trim()) {
          errors.reason = 'Please provide a reason for revision';
          isValid = false;
        }
        break;
      case 2:
        for (let i = 0; i < items.length; i++) {
          if (!items[i].ordered_qty || items[i].ordered_qty <= 0) {
            errors[`item_${i}_qty`] = `Item ${i + 1}: Quantity is required`;
            isValid = false;
          }
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(errors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  const handleRevise = async () => {
    if (!validateStep(2)) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const reviseData = {
        reason,
        items: items.map(item => ({
          _id: item._id,
          ordered_qty: parseFloat(item.ordered_qty),
          unit_price: parseFloat(item.unit_price),
          committed_date: item.committed_date,
          required_date: item.required_date,
          discount_percent: parseFloat(item.discount_percent || 0),
          remarks: item.remarks
        })),
        expected_delivery_date: expectedDeliveryDate,
        payment_terms: paymentTerms,
        delivery_terms: deliveryTerms,
        internal_remarks: internalRemarks
      };
      
      const response = await axios.post(
        `${BASE_URL}/api/sales-orders/${order._id}/revise`,
        reviseData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onReviseComplete();
        onClose();
      } else {
        alert(response.data.message || 'Failed to revise order');
      }
    } catch (err) {
      console.error('Error revising order:', err);
      alert('Failed to revise order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: order?.currency || 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <InfoIcon sx={{ fontSize: '1rem' }} />
                Revision Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5, letterSpacing: '0.5px' }}>
                  REASON FOR REVISION <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide the reason for revising this order (e.g., quantity change, price adjustment, delivery date change)..."
                  error={!!fieldErrors.reason}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.primary },
                      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                      '&.Mui-error fieldset': { borderColor: '#EF4444' }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
                {fieldErrors.reason && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                    {fieldErrors.reason}
                  </Typography>
                )}
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5, letterSpacing: '0.5px' }}>
                  INTERNAL REMARKS
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  fullWidth
                  value={internalRemarks}
                  onChange={(e) => setInternalRemarks(e.target.value)}
                  placeholder="Any internal notes about this revision..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.primary },
                      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
            
            {/* Order Summary */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.primary}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primaryDark, mb: 1 }}>
                Current Order Summary
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>SO Number</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{order?.so_number}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Customer</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{order?.customer_name}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Current Status</Typography>
                  <Chip label={order?.status} size="small" sx={{ fontSize: '0.6rem', height: 20 }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Amount</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formatCurrency(order?.grand_total)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
        
      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <BusinessIcon sx={{ fontSize: '1rem' }} />
                Order Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EXPECTED DELIVERY DATE
                    </Typography>
                    <TextField
                      type="date"
                      fullWidth
                      value={expectedDeliveryDate}
                      onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem',
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAYMENT TERMS
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        {PAYMENT_TERMS_OPTIONS.map(term => (
                          <MenuItem key={term} value={term} sx={{ fontSize: '0.75rem' }}>
                            {term || 'None'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DELIVERY TERMS
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={deliveryTerms}
                        onChange={(e) => setDeliveryTerms(e.target.value)}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        {DELIVERY_TERMS_OPTIONS.map(term => (
                          <MenuItem key={term} value={term} sx={{ fontSize: '0.75rem' }}>
                            {term || 'None'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Current Items Preview */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                Current Items ({items.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No.</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part Name</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.slice(0, 3).map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.ordered_qty}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.unit_price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {items.length > 3 && (
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 1, textAlign: 'center' }}>
                  + {items.length - 3} more items
                </Typography>
              )}
            </Paper>
          </Stack>
        );
        
      case 2:
        return (
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.white, 
            borderRadius: 2, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Typography sx={{ 
              fontSize: '0.8rem', 
              fontWeight: 600, 
              color: COLORS.primary, 
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
            
              Review Items
            </Typography>
            
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.light }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No.</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part Name</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Qty</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Required Date</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Committed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                        <TextField
                          type="number"
                          value={item.ordered_qty}
                          onChange={(e) => handleItemChange(idx, 'ordered_qty', e.target.value)}
                          size="small"
                          sx={{ width: 90 }}
                          InputProps={{
                            sx: { fontSize: '0.7rem', height: 32 }
                          }}
                        />
                        {item.original_qty !== item.ordered_qty && (
                          <Typography sx={{ fontSize: '0.6rem', color: '#F59E0B', mt: 0.5 }}>
                            Original: {item.original_qty}
                          </Typography>
                        )}
                        {fieldErrors[`item_${idx}_qty`] && (
                          <Typography sx={{ fontSize: '0.6rem', color: '#EF4444' }}>
                            {fieldErrors[`item_${idx}_qty`]}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }} align="right">
                        <TextField
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                          size="small"
                          sx={{ width: 100 }}
                          InputProps={{
                            sx: { fontSize: '0.7rem', height: 32 }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          value={item.required_date}
                          onChange={(e) => handleItemChange(idx, 'required_date', e.target.value)}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          sx={{ width: 120 }}
                          InputProps={{
                            sx: { fontSize: '0.7rem', height: 32 }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          value={item.committed_date}
                          onChange={(e) => handleItemChange(idx, 'committed_date', e.target.value)}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          sx={{ width: 120 }}
                          InputProps={{
                            sx: { fontSize: '0.7rem', height: 32 }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <EditIcon sx={{ color: COLORS.primary, fontSize: '1.25rem' }} />
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
              Revise Order
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {order?.so_number} - {order?.customer_name}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Typography sx={{ fontSize: '1.25rem', color: COLORS.text.tertiary }}>×</Typography>
        </IconButton>
      </DialogTitle>
      
      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
         
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        {renderStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
       
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
          Back
        </Button>
        <Box>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              height: 32,
              px: 2,
              mr: 1,
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
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleRevise}
              disabled={loading}
              startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
              }}
            >
              {loading ? 'Revising...' : 'Submit Revision'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
             
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// Acknowledge Order Dialog
const AcknowledgeDialog = ({ open, onClose, order, onAcknowledgeComplete }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (order && open) {
      setEmail(order.acknowledgement_email || order.customer_email || '');
    }
  }, [order, open]);
  
  const handleAcknowledge = async () => {
    if (!email.trim()) {
      alert('Please enter an email address');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/sales-orders/${order._id}/acknowledge`,
        { email },
        { 
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create download link for PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SO_${order.so_number}_Acknowledgement.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      onAcknowledgeComplete();
      onClose();
    } catch (err) {
      console.error('Error sending acknowledgement:', err);
      alert('Failed to send acknowledgement. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <EmailIcon sx={{ color: COLORS.primary, fontSize: '1.25rem' }} />
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
              Send Acknowledgement
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {order?.so_number} - {order?.customer_name}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Typography sx={{ fontSize: '1.25rem' }}>×</Typography>
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        <Stack spacing={2}>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            A PDF acknowledgement will be generated and sent to the following email address:
          </Typography>
          
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="customer@example.com"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.75rem',
                bgcolor: COLORS.background.white
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.75rem'
              }
            }}
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAcknowledge}
          disabled={loading || !email.trim()}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Sending...' : 'Send & Download PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// View Order Details Modal - Redesigned
const ViewOrderModal = ({ open, onClose, order }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  if (!order) return null;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: order.currency || 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const statusColors = STATUS_COLORS[order.status] || { bg: '#F1F5F9', color: '#475569' };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ReceiptIcon sx={{ color: COLORS.primary, fontSize: '1.25rem' }} />
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
              Order Details
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {order.so_number}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Typography sx={{ fontSize: '1.25rem', color: COLORS.text.tertiary }}>×</Typography>
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, bgcolor: COLORS.background.light }}>
        {/* Order Header Card */}
        <Box sx={{ p: 2.5, bgcolor: COLORS.background.white, borderBottom: `1px solid ${COLORS.border}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 48, height: 48, bgcolor: COLORS.primary, color: COLORS.text.light }}>
                  {order.so_number?.substring(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {order.customer_name}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{ 
                        fontSize: '0.65rem',
                        height: 24,
                        bgcolor: statusColors.bg,
                        color: statusColors.color,
                        border: `1px solid ${statusColors.border}`
                      }}
                    />
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      SO Date: {formatDate(order.so_date)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ 
                p: 1.5, 
                bgcolor: COLORS.primaryLight, 
                borderRadius: 2,
                textAlign: 'center'
              }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Grand Total
                </Typography>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.primary }}>
                  {formatCurrency(order.grand_total)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {/* Tabs */}
        <Box sx={{ borderBottom: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              '& .MuiTab-root': {
                fontSize: '0.75rem',
                textTransform: 'none',
                minHeight: 40,
                fontWeight: 500,
                '&.Mui-selected': {
                  color: COLORS.primary,
                }
              },
              '& .MuiTabs-indicator': {
                bgcolor: COLORS.primary,
                height: 2
              }
            }}
          >
            <Tab label="Basic Information" />
            <Tab label="Items" />
            <Tab label="Financial Summary" />
          </Tabs>
        </Box>
        
        {/* Tab Panels */}
        <Box sx={{ p: 2.5 }}>
          {activeTab === 0 && (
            <Stack spacing={2}>
              {/* Customer Information */}
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <BusinessIcon sx={{ fontSize: '1rem' }} />
                  Customer Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Customer Name
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {order.customer_name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      GSTIN
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {order.customer_gstin || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Billing Address
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {order.billing_address?.line1}, {order.billing_address?.line2}<br />
                      {order.billing_address?.city}, {order.billing_address?.district}<br />
                      {order.billing_address?.state} - {order.billing_address?.pincode}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              {/* Order Details */}
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <ReceiptIcon sx={{ fontSize: '1rem' }} />
                  Order Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Quotation No.
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {order.quotation_no || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      PO Number
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {order.customer_po_number || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      PO Date
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {formatDate(order.customer_po_date)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Currency
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {order.currency || 'INR'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              {/* Delivery Details */}
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <ShippingIcon sx={{ fontSize: '1rem' }} />
                  Delivery Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Payment Terms
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {order.payment_terms || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Delivery Terms
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {order.delivery_terms || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Delivery Mode
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {order.delivery_mode || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Expected Delivery
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                      {formatDate(order.expected_delivery_date)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          )}
          
          {activeTab === 1 && (
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
               
                Items ({order.items?.length || 0})
              </Typography>
              
              <TableContainer component={MuiPaper} sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No.</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part Name</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Required Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_name}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{item.ordered_qty} {item.unit}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(item.unit_price)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(item.total_amount)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{formatDate(item.required_date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
          
          {activeTab === 2 && (
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <MoneyIcon sx={{ fontSize: '1rem' }} />
                Financial Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Sub Total</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {formatCurrency(order.sub_total)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Discount</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {formatCurrency(order.discount_total)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Taxable Amount</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {formatCurrency(order.taxable_total)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>CGST</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {formatCurrency(order.cgst_total)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>SGST</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {formatCurrency(order.sgst_total)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Grand Total</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      {formatCurrency(order.grand_total)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
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

const SORevise = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedSOForAction, setSelectedSOForAction] = useState(null);
  const [selectedSO, setSelectedSO] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Modal states
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openReviseDialog, setOpenReviseDialog] = useState(false);
  const [openAcknowledgeDialog, setOpenAcknowledgeDialog] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [revisionsData, setRevisionsData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Sales Orders from API
  const fetchSalesOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        status: 'Confirmed,In Production'
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await axios.get(`${BASE_URL}/api/sales-orders?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSalesOrders(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load Sales Orders', 'error');
      }
    } catch (err) {
      console.error('Error fetching Sales Orders:', err);
      showNotification('Failed to load Sales Orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchSalesOrders();
  }, [fetchSalesOrders]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleActionMenuOpen = (event, so) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedSOForAction(so);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedSOForAction(null);
  };

  const openViewSOModal = (so) => {
    setSelectedSO(so);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openReviseModal = (so) => {
    setSelectedSO(so);
    setOpenReviseDialog(true);
    handleActionMenuClose();
  };
  
  const openAcknowledgeModal = (so) => {
    setSelectedSO(so);
    setOpenAcknowledgeDialog(true);
    handleActionMenuClose();
  };
  
  const openHistoryModalHandler = async (so) => {
    setSelectedSO(so);
    setOpenHistoryModal(true);
    setHistoryLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/sales-orders/${so._id}/revisions`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setRevisionsData(response.data.data);
      } else {
        showNotification('Failed to load revisions', 'error');
      }
    } catch (err) {
      console.error('Error fetching revisions:', err);
      showNotification('Failed to load revisions', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };
  
  const handleReviseComplete = () => {
    showNotification('Order revised successfully!', 'success');
    fetchSalesOrders();
  };
  
  const handleAcknowledgeComplete = () => {
    showNotification('Acknowledgement sent successfully!', 'success');
    fetchSalesOrders();
  };
  
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
  };
  
  const getSOInitials = (so) => {
    if (!so.so_number) return 'SO';
    return so.so_number.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (so) => {
    if (!so.so_number) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = so.so_number.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          Sales Order Revisions
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Revise confirmed sales orders, manage revisions, and send acknowledgements
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by SO Number, Customer, or PO Number..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 450 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': {
                    borderColor: COLORS.primary,
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: { 
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary,
                    '&::placeholder': {
                      color: COLORS.text.tertiary,
                      fontSize: '0.75rem'
                    }
                  }
                }
              }}
              disabled={loading}
            />
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchSalesOrders}
                disabled={loading}
                sx={{
                  color: COLORS.primary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}10`
                  }
                }}
              >
                <RefreshIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Stats */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Showing {salesOrders.length} of {totalItems} orders eligible for revision
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Sales Orders Table */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: COLORS.background.tableHeader,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: COLORS.text.light,
                  py: 1.5
                }
              }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  SO No / Customer
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  PO Details
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Order Details
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Revision Info
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading Sales Orders...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : salesOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <EditIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No Sales Orders found' : 'No orders eligible for revision'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Only Confirmed or In Production orders can be revised'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                salesOrders.map((so) => {
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedSOForAction?._id === so._id;
                  const avatarColor = getAvatarColor(so);
                  const statusColors = getStatusColor(so.status);
                  
                  return (
                    <TableRow
                      key={so._id}
                      hover
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getSOInitials(so)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {so.so_number}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {so.customer_name}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {so.customer_po_number || '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Date: {formatDate(so.customer_po_date)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          QT: {so.quotation_no || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {formatDate(so.so_date)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Items: {so.items?.length || 0}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Terms: {so.payment_terms || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                          {formatCurrency(so.grand_total)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Sub: {formatCurrency(so.sub_total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={so.status || 'Draft'}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.border}`
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Current Rev: {so.current_revision || 0}
                          </Typography>
                          {so.acknowledgement_sent_at && (
                            <Chip
                              icon={<EmailIcon sx={{ fontSize: '0.6rem' }} />}
                              label="Ack Sent"
                              size="small"
                              sx={{ height: 20, fontSize: '0.6rem', bgcolor: '#D1FAE5', color: '#059669' }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={so}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, so)}
                          onClose={handleActionMenuClose}
                          onView={openViewSOModal}
                          onRevise={openReviseModal}
                          onAcknowledge={openAcknowledgeModal}
                          onHistory={openHistoryModalHandler}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            },
            '& .MuiTablePagination-select': {
              fontSize: '0.7rem'
            },
            '& .MuiTablePagination-actions button': {
              color: COLORS.primary,
            }
          }}
        />
      </Paper>

      {/* Modal Components */}
      {selectedSO && (
        <>
          <ViewOrderModal 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedSO(null);
            }}
            order={selectedSO}
          />

          <ReviseOrderDialog 
            open={openReviseDialog}
            onClose={() => {
              setOpenReviseDialog(false);
              setSelectedSO(null);
            }}
            order={selectedSO}
            onReviseComplete={handleReviseComplete}
          />

          <AcknowledgeDialog 
            open={openAcknowledgeDialog}
            onClose={() => {
              setOpenAcknowledgeDialog(false);
              setSelectedSO(null);
            }}
            order={selectedSO}
            onAcknowledgeComplete={handleAcknowledgeComplete}
          />

          <RevisionHistoryModal 
            open={openHistoryModal}
            onClose={() => {
              setOpenHistoryModal(false);
              setSelectedSO(null);
              setRevisionsData(null);
            }}
            revisionsData={revisionsData}
            loading={historyLoading}
            soNumber={selectedSO?.so_number}
          />
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SORevise;