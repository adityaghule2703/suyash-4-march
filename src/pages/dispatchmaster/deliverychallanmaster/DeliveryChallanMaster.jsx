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
  Checkbox,
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  LocalShipping as LocalShippingIcon,
  PictureAsPdf as PdfIcon,
  PendingActions as PendingActionsIcon,
  QrCode as QrCodeIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddDeliveryChallan from './AddDeliveryChallan';
import ViewDeliveryChallan from './ViewDeliveryChallan';
import DeleteDeliveryChallan from './DeleteDeliveryChallan';

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
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    Planned: { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
    Dispatched: { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
    Delivered: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
    'Rejected by Customer': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' }
  }
};

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error" sx={{ mb: 2 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" color="text.secondary">
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Pending Dispatch Dialog Component
const PendingDispatchDialog = ({ open, onClose, pendingDCs }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Pending Dispatch Delivery Challans
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          Delivery challans pending for dispatch ({pendingDCs?.length || 0} items)
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>DC Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>DC Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>SO Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>DC Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingDCs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                        No pending dispatch delivery challans
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingDCs?.map((dc) => (
                    <TableRow key={dc._id} hover>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          {dc.dc_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(dc.dc_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {dc.so_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {dc.customer_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={dc.dc_type}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primary
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {dc.items?.length || 0} item(s)
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Generate EWB Dialog Component
const GenerateEWBDialog = ({ open, onClose, deliveryChallan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    transporter_name: '',
    vehicle_no: ''
  });

  useEffect(() => {
    if (deliveryChallan && open) {
      setFormData({
        transporter_name: deliveryChallan.transport?.transporter_name || '',
        vehicle_no: deliveryChallan.transport?.vehicle_no || ''
      });
    }
  }, [deliveryChallan, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.transporter_name) {
      setError('Transporter name is required');
      return;
    }
    if (!formData.vehicle_no) {
      setError('Vehicle number is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const transporter_id = deliveryChallan.transport?._id || '';
      
      const payload = {
        transporter_id: transporter_id,
        transporter_name: formData.transporter_name,
        vehicle_no: formData.vehicle_no
      };
      
      const response = await axios.post(
        `${BASE_URL}/api/delivery-challans/${deliveryChallan._id}/generate-ewb`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to generate EWB');
      }
    } catch (err) {
      console.error('Error generating EWB:', err);
      setError(err.response?.data?.message || 'Failed to generate EWB. Please try again.');
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
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Generate E-Way Bill
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          For DC: {deliveryChallan?.dc_number}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Transporter Name <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="transporter_name"
                    value={formData.transporter_name}
                    onChange={handleChange}
                    placeholder="e.g., VRL Logistics"
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Vehicle Number <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="vehicle_no"
                    value={formData.vehicle_no}
                    onChange={handleChange}
                    placeholder="e.g., MH 12 AB 1234"
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Generating...' : 'Generate EWB'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// POD Dialog Component
const PODDialog = ({ open, onClose, deliveryChallan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    actual_delivery_date: '',
    pod_signed_by: '',
    delivery_remarks: '',
    pod_document: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, pod_document: file }));
      setFieldErrors(prev => ({ ...prev, pod_document: '' }));
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.actual_delivery_date) {
      errors.actual_delivery_date = 'Actual delivery date is required';
      isValid = false;
    }
    if (!formData.pod_signed_by.trim()) {
      errors.pod_signed_by = 'Signed by is required';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in the form');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      submitData.append('actual_delivery_date', formData.actual_delivery_date);
      submitData.append('pod_signed_by', formData.pod_signed_by);
      submitData.append('delivery_remarks', formData.delivery_remarks || '');
      if (formData.pod_document) {
        submitData.append('pod_document', formData.pod_document);
      }

      const response = await axios.put(
        `${BASE_URL}/api/delivery-challans/${deliveryChallan._id}/pod`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update POD');
      }
    } catch (err) {
      console.error('Error updating POD:', err);
      setError(err.response?.data?.message || 'Failed to update POD. Please try again.');
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
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Proof of Delivery (POD)
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          For DC: {deliveryChallan?.dc_number}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Actual Delivery Date <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="actual_delivery_date"
                    type="date"
                    value={formData.actual_delivery_date}
                    onChange={handleChange}
                    error={!!fieldErrors.actual_delivery_date}
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.actual_delivery_date && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.actual_delivery_date}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Signed By <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="pod_signed_by"
                    value={formData.pod_signed_by}
                    onChange={handleChange}
                    error={!!fieldErrors.pod_signed_by}
                    placeholder="e.g., Mr. Suresh Kumar - Stores Incharge"
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.pod_signed_by && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.pod_signed_by}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Delivery Remarks
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="delivery_remarks"
                    multiline
                    rows={3}
                    value={formData.delivery_remarks}
                    onChange={handleChange}
                    placeholder="e.g., All 4 boxes received in good condition"
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    POD Document (PDF/Image)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      height: 36,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      borderColor: COLORS.border,
                      justifyContent: 'flex-start',
                      px: 2,
                      '&:hover': {
                        borderColor: COLORS.primary,
                        bgcolor: `${COLORS.primary}10`
                      }
                    }}
                  >
                    {formData.pod_document ? formData.pod_document.name : 'Choose File'}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    Upload POD scan (PDF or Image format)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Submitting...' : 'Submit POD'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Reject Delivery Dialog Component with proper styling
const RejectDeliveryDialog = ({ open, onClose, deliveryChallan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    rejection_reason: '',
    rejection_details: '',
    items_returned: []
  });
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnQty, setReturnQty] = useState('');
  const [condition, setCondition] = useState('Good');

  const itemsList = deliveryChallan?.items || [];

  const handleAddItem = () => {
    const errors = {};
    let isValid = true;

    if (!selectedItem) {
      errors.selectItem = 'Please select an item';
      isValid = false;
    }
    if (!returnQty || parseFloat(returnQty) <= 0) {
      errors.returnQty = 'Please enter valid return quantity';
      isValid = false;
    }
    if (selectedItem && returnQty && parseFloat(returnQty) > selectedItem.dispatch_qty) {
      errors.returnQty = `Return quantity cannot exceed dispatched quantity (${selectedItem.dispatch_qty})`;
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) return;

    const newItem = {
      so_item_id: selectedItem.so_item_id,
      part_no: selectedItem.part_no,
      return_qty: parseFloat(returnQty),
      unit_price: selectedItem.unit_price,
      condition: condition
    };

    setFormData(prev => ({
      ...prev,
      items_returned: [...prev.items_returned, newItem]
    }));

    setSelectedItem(null);
    setReturnQty('');
    setCondition('Good');
    setFieldErrors({});
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items_returned: prev.items_returned.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.rejection_reason.trim()) {
      errors.rejection_reason = 'Rejection reason is required';
      isValid = false;
    }
    if (formData.items_returned.length === 0) {
      errors.items_returned = 'Please add at least one returned item';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in the form');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/delivery-challans/${deliveryChallan._id}/customer-rejection`,
        {
          rejection_reason: formData.rejection_reason,
          rejection_details: formData.rejection_details,
          items_returned: formData.items_returned
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to submit rejection');
      }
    } catch (err) {
      console.error('Error submitting rejection:', err);
      setError(err.response?.data?.message || 'Failed to submit rejection. Please try again.');
    } finally {
      setLoading(false);
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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Customer Rejection
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          For DC: {deliveryChallan?.dc_number}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Rejection Reason <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="rejection_reason"
                    value={formData.rejection_reason}
                    onChange={handleChange}
                    error={!!fieldErrors.rejection_reason}
                    placeholder="e.g., Quality Rejection, Quantity Mismatch, etc."
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.rejection_reason && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.rejection_reason}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Rejection Details
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="rejection_details"
                    multiline
                    rows={2}
                    value={formData.rejection_details}
                    onChange={handleChange}
                    placeholder="e.g., Surface scratches on 15 pieces exceeding acceptable limit"
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                  Return Items <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                {/* Add Item Section */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, mb: 2 }}>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Select Item
                        </Typography>
                        <FormControl fullWidth size="small" error={!!fieldErrors.selectItem}>
                          <Select
                            value={selectedItem?.so_item_id || ''}
                            onChange={(e) => {
                              const item = itemsList.find(i => i.so_item_id === e.target.value);
                              setSelectedItem(item);
                              setFieldErrors(prev => ({ ...prev, selectItem: '' }));
                            }}
                            displayEmpty
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: COLORS.background.white,
                              '& .MuiSelect-select': { py: 1, px: 1.5 }
                            }}
                          >
                            <MenuItem value="" disabled>Select an item</MenuItem>
                            {itemsList.map((item) => (
                              <MenuItem key={item.so_item_id} value={item.so_item_id} sx={{ fontSize: '0.75rem' }}>
                                {item.part_no} - {item.part_name} (Qty: {item.dispatch_qty})
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.selectItem && (
                            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                              {fieldErrors.selectItem}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Return Qty
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={returnQty}
                          onChange={(e) => {
                            setReturnQty(e.target.value);
                            setFieldErrors(prev => ({ ...prev, returnQty: '' }));
                          }}
                          error={!!fieldErrors.returnQty}
                          placeholder="0"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: COLORS.background.white,
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                            },
                            '& .MuiInputBase-input': {
                              py: 1,
                              px: 1.5,
                              fontSize: '0.75rem'
                            }
                          }}
                        />
                        {fieldErrors.returnQty && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors.returnQty}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Condition
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: COLORS.background.white,
                              '& .MuiSelect-select': { py: 1, px: 1.5 }
                            }}
                          >
                            <MenuItem value="Good" sx={{ fontSize: '0.75rem' }}>Good</MenuItem>
                            <MenuItem value="Damaged" sx={{ fontSize: '0.75rem' }}>Damaged</MenuItem>
                            <MenuItem value="Defective" sx={{ fontSize: '0.75rem' }}>Defective</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleAddItem}
                        startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                        sx={{
                          height: 40,
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          borderColor: COLORS.primary,
                          color: COLORS.primary,
                          '&:hover': {
                            bgcolor: `${COLORS.primary}10`,
                            borderColor: COLORS.primaryDark
                          }
                        }}
                      >
                        Add Item
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Items List Table */}
                {formData.items_returned.length > 0 && (
                  <Paper sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Part No</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Return Qty</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Unit Price</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light }}>Condition</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.light, width: 50 }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.items_returned.map((item, idx) => (
                            <TableRow key={idx} hover>
                              <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{item.part_no}</TableCell>
                              <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{item.return_qty}</TableCell>
                              <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>₹{item.unit_price.toLocaleString()}</TableCell>
                              <TableCell>
                                <Chip
                                  label={item.condition}
                                  size="small"
                                  sx={{
                                    fontSize: '0.65rem',
                                    fontWeight: 500,
                                    height: 24,
                                    bgcolor: item.condition === 'Good' ? '#D1FAE5' : item.condition === 'Damaged' ? '#FEF3C7' : '#FEE2E2',
                                    color: item.condition === 'Good' ? '#065F46' : item.condition === 'Damaged' ? '#B45309' : '#991B1B'
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveItem(idx)}
                                  sx={{ color: '#EF4444' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}
                {fieldErrors.items_returned && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
                    {fieldErrors.items_returned}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: '#EF4444',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: '#DC2626' }
          }}
        >
          {loading ? 'Submitting...' : 'Submit Rejection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component with permission checks
const ActionMenu = ({ deliveryChallan, onView, onDelete, onPrint, onGenerateEWB, onPOD, onRejectDelivery, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.DELIVERY_CHALLAN, PAGES.DELIVERY_CHALLAN, ACTIONS.VIEW);
  const canDelete = hasPermission(permissions, MODULES.DELIVERY_CHALLAN, PAGES.DELIVERY_CHALLAN, ACTIONS.DELETE);
  const canPrint = hasPermission(permissions, MODULES.DELIVERY_CHALLAN, PAGES.DELIVERY_CHALLAN, ACTIONS.PRINT);
  const canUpdate = hasPermission(permissions, MODULES.DELIVERY_CHALLAN, PAGES.DELIVERY_CHALLAN, ACTIONS.UPDATE);

  const showGenerateEWB = deliveryChallan.eway_bill?.eway_bill_required && 
                          deliveryChallan.eway_bill?.eway_bill_status !== 'Generated';

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
        {canView && (
          <MenuItem 
            onClick={() => {
              onView(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                View Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canPrint && (
          <MenuItem 
            onClick={() => {
              onPrint(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <PdfIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Print DC
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        <MenuItem 
          onClick={() => {
            onPOD(deliveryChallan);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
            <AssignmentTurnedInIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
              POD
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={() => {
            onRejectDelivery(deliveryChallan);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <CancelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#EF4444', fontSize: '0.75rem' }}>
              Reject Delivery
            </Typography>
          </ListItemText>
        </MenuItem>

        {showGenerateEWB && canUpdate && (
          <MenuItem 
            onClick={() => {
              onGenerateEWB(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <QrCodeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
                Generate EWB
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(canView || canPrint || showGenerateEWB) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
        {canDelete && (
          <MenuItem 
            onClick={() => {
              onDelete(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
                Delete
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const DeliveryChallanMaster = () => {
  // State for data
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [filteredChallans, setFilteredChallans] = useState([]);
  const [pendingDispatchDCs, setPendingDispatchDCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedDCForAction, setSelectedDCForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPendingDispatchDialog, setOpenPendingDispatchDialog] = useState(false);
  const [openGenerateEWBDialog, setOpenGenerateEWBDialog] = useState(false);
  const [openPODDialog, setOpenPODDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  
  // Selected delivery challan
  const [selectedDC, setSelectedDC] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          
          if (userData.permissions && Array.isArray(userData.permissions)) {
            setUserPermissions(userData.permissions);
          } else {
            setUserPermissions([]);
          }
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
        setUserPermissions([]);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    
    fetchUserPermissions();
  }, []);

  // Check permission helper
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(
      userPermissions,
      MODULES.DELIVERY_CHALLAN,
      PAGES.DELIVERY_CHALLAN,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch delivery challans from API
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchDeliveryChallans();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin]);

  const fetchDeliveryChallans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/delivery-challans?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setDeliveryChallans(response.data.data || []);
        setFilteredChallans(response.data.data || []);
      } else {
        showNotification('Failed to load delivery challans', 'error');
      }
    } catch (err) {
      console.error('Error fetching delivery challans:', err);
      showNotification('Failed to load delivery challans. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch pending dispatch delivery challans
  const fetchPendingDispatchDCs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/delivery-challans/pending-dispatch`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPendingDispatchDCs(response.data.data || []);
        setOpenPendingDispatchDialog(true);
      } else {
        showNotification('Failed to load pending dispatch DCs', 'error');
      }
    } catch (err) {
      console.error('Error fetching pending dispatch DCs:', err);
      showNotification('Failed to load pending dispatch DCs', 'error');
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchDeliveryChallans();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle search and filters (client-side filtering)
  const handleSearchAndFilter = () => {
    let filtered = [...deliveryChallans];
    
    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(dc =>
        dc.dc_number?.toLowerCase().includes(value) ||
        dc.so_number?.toLowerCase().includes(value) ||
        dc.customer_name?.toLowerCase().includes(value) ||
        dc.dc_type?.toLowerCase().includes(value)
      );
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(dc => dc.status === statusFilter);
    }
    
    if (typeFilter !== 'All') {
      filtered = filtered.filter(dc => dc.dc_type === typeFilter);
    }
    
    setFilteredChallans(filtered);
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, statusFilter, typeFilter, deliveryChallans]);
  
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(filteredChallans.map(dc => dc._id));
    } else {
      setSelected([]);
    }
  };
  
  const handleSelect = (id) => {
    if (!canDelete) return;
    
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    
    setSelected(newSelected);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };
  
  const handleActionMenuOpen = (event, dc) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDCForAction(dc);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedDCForAction(null);
  };
  
  const openViewModalHandler = (dc) => {
    setSelectedDC(dc);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteDialogHandler = (dc) => {
    if (!canDelete) return;
    setSelectedDC(dc);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  const handlePendingDispatch = () => {
    fetchPendingDispatchDCs();
  };
  
  const handleGenerateEWB = (dc) => {
    setSelectedDC(dc);
    setOpenGenerateEWBDialog(true);
    handleActionMenuClose();
  };
  
  const handlePOD = (dc) => {
    setSelectedDC(dc);
    setOpenPODDialog(true);
    handleActionMenuClose();
  };

  const handleRejectDelivery = (dc) => {
    setSelectedDC(dc);
    setOpenRejectDialog(true);
    handleActionMenuClose();
  };
  
  const handlePrint = (dc) => {
    window.open(`${BASE_URL}/api/delivery-challans/${dc._id}/print`, '_blank');
  };
  
  const handleAddSuccess = () => {
    setOpenAddModal(false);
    fetchDeliveryChallans();
    showNotification('Delivery Challan created successfully!', 'success');
  };
  
  const handleDeleteSuccess = () => {
    setOpenDeleteDialog(false);
    setSelectedDC(null);
    fetchDeliveryChallans();
    showNotification('Delivery Challan deleted successfully!', 'success');
  };
  
  const handleEWBSuccess = () => {
    fetchDeliveryChallans();
    showNotification('Operation completed successfully!', 'success');
  };
  
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/delivery-challans/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setSelected([]);
      fetchDeliveryChallans();
      showNotification(`${selected.length} delivery challan(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete delivery challans', 'error');
    }
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusChip = (status) => {
    const colors = COLORS.status[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 500,
          height: 24,
          bgcolor: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`
        }}
      />
    );
  };
  
  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'C';
    const words = companyName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return companyName.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (companyName) => {
    if (!companyName) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = companyName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  const paginatedChallans = filteredChallans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  if (!canViewPage && !isSuperAdmin) {
    return <AccessDenied />;
  }

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
          Delivery Challan Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage delivery challans, track shipments, and monitor dispatch status
        </Typography>
      </Box>

      {/* Filter and Action Bar */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by DC number, SO number, customer..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 280 },
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
            
            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ 
                width: 140,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                }
              }}
              SelectProps={{
                sx: { height: 36, fontSize: '0.75rem' }
              }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Planned">Planned</MenuItem>
              <MenuItem value="Dispatched">Dispatched</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Rejected by Customer">Rejected</MenuItem>
            </TextField>
            
            <TextField
              select
              size="small"
              label="DC Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ 
                width: 180,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                }
              }}
              SelectProps={{
                sx: { height: 36, fontSize: '0.75rem' }
              }}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Supply of Goods">Supply of Goods</MenuItem>
              <MenuItem value="Delivery for Approval">Delivery for Approval</MenuItem>
              <MenuItem value="Job Work Outward">Job Work Outward</MenuItem>
              <MenuItem value="Sales Return">Sales Return</MenuItem>
              <MenuItem value="Exhibition">Exhibition</MenuItem>
              <MenuItem value="Export">Export</MenuItem>
            </TextField>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="outlined"
              startIcon={<PendingActionsIcon sx={{ fontSize: '1rem' }} />}
              onClick={handlePendingDispatch}
              sx={{ 
                height: 36,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderColor: COLORS.border,
                color: '#F59E0B',
                '&:hover': {
                  borderColor: '#F59E0B',
                  bgcolor: '#FEF3C7'
                }
              }}
              disabled={loading}
            >
              Pending Dispatch
            </Button>
            
            {canDelete && selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
                sx={{ 
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: '#fee2e2',
                  color: '#991b1b',
                  '&:hover': {
                    borderColor: '#fecaca',
                    bgcolor: '#fee2e2'
                  }
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primary,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: COLORS.primaryDark,
                  }
                }}
                disabled={loading}
              >
                Create DC
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Delivery Challans Table */}
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
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < filteredChallans.length}
                      checked={filteredChallans.length > 0 && selected.length === filteredChallans.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: COLORS.text.light,
                        '&.Mui-checked': {
                          color: COLORS.text.light,
                        },
                        '&.MuiCheckbox-indeterminate': {
                          color: COLORS.text.light,
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.25rem'
                        }
                      }}
                      disabled={loading || filteredChallans.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  DC Number
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  DC Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  SO Number
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Customer
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  DC Type
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Status
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Items
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  width: 60,
                  color: COLORS.text.light
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading delivery challans...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedChallans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <LocalShippingIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' ? 'No delivery challans found' : 'No delivery challans available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' ? 'Try adjusting your search terms' : 'Create your first delivery challan'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedChallans.map((dc, index) => {
                  const isSelected = selected.includes(dc._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedDCForAction?._id === dc._id;
                  const avatarColor = getAvatarColor(dc.customer_name);

                  return (
                    <TableRow
                      key={dc._id || index}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                          '&:hover': {
                            bgcolor: `${COLORS.primary}20`
                          }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(dc._id)}
                            sx={{
                              color: COLORS.primary,
                              '&.Mui-checked': {
                                color: COLORS.primary,
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: '1.25rem'
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          {dc.dc_number}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(dc.dc_date)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {dc.so_number}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {getCompanyInitials(dc.customer_name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                              {dc.customer_name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              GST: {dc.customer_gstin || 'NA'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={dc.dc_type}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primary
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        {getStatusChip(dc.status)}
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {dc.items?.length || 0} item(s)
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          deliveryChallan={dc}
                          onView={openViewModalHandler}
                          onDelete={openDeleteDialogHandler}
                          onPrint={handlePrint}
                          onGenerateEWB={handleGenerateEWB}
                          onPOD={handlePOD}
                          onRejectDelivery={handleRejectDelivery}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, dc)}
                          permissions={userPermissions}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredChallans.length}
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
      {canCreate && (
        <AddDeliveryChallan 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {selectedDC && canViewPage && (
        <ViewDeliveryChallan 
          open={openViewModal}
          onClose={() => {
            setOpenViewModal(false);
            setSelectedDC(null);
          }}
          deliveryChallan={selectedDC}
        />
      )}

      {selectedDC && canDelete && (
        <DeleteDeliveryChallan 
          open={openDeleteDialog}
          onClose={() => {
            setOpenDeleteDialog(false);
            setSelectedDC(null);
          }}
          deliveryChallan={selectedDC}
          onDelete={handleDeleteSuccess}
        />
      )}

      <PendingDispatchDialog
        open={openPendingDispatchDialog}
        onClose={() => setOpenPendingDispatchDialog(false)}
        pendingDCs={pendingDispatchDCs}
      />

      <GenerateEWBDialog
        open={openGenerateEWBDialog}
        onClose={() => {
          setOpenGenerateEWBDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

      <PODDialog
        open={openPODDialog}
        onClose={() => {
          setOpenPODDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

      <RejectDeliveryDialog
        open={openRejectDialog}
        onClose={() => {
          setOpenRejectDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeliveryChallanMaster;