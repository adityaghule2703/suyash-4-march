import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
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
  Card,
  CardContent,
  Tooltip,
  TextField,
  InputAdornment,
  Autocomplete,
  MenuItem
} from "@mui/material";
import {
  Close,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Approval as ApprovalIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  RemoveCircle as RemoveCircleIcon,
  Help as HelpIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import AddEmployees from "../../hrmaster/employeemaster/AddEmployees";

// 🎨 DESIGN SYSTEM
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
    light: "#F8FFFC",
    warning: "#FEF3C7",
    error: "#FEE2E2",
    success: "#D1FAE5",
    info: "#E0F2FE"
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

// Action options based on schema
const ACTION_OPTIONS = ['Adjust Up', 'Adjust Down', 'No Action', 'Write Off', 'Investigate Further'];

// Action colors
const getActionColor = (action) => {
  const colors = {
    'Adjust Up': { bg: '#D1FAE5', color: '#059669', icon: <TrendingUpIcon sx={{ fontSize: '0.7rem' }} /> },
    'Adjust Down': { bg: '#FEF3C7', color: '#D97706', icon: <TrendingDownIcon sx={{ fontSize: '0.7rem' }} /> },
    'No Action': { bg: '#F1F5F9', color: '#475569', icon: <BlockIcon sx={{ fontSize: '0.7rem' }} /> },
    'Write Off': { bg: '#FEE2E2', color: '#DC2626', icon: <RemoveCircleIcon sx={{ fontSize: '0.7rem' }} /> },
    'Investigate Further': { bg: '#FFE4E6', color: '#E11D48', icon: <HelpIcon sx={{ fontSize: '0.7rem' }} /> }
  };
  return colors[action] || { bg: '#F1F5F9', color: '#475569', icon: null };
};

const ApprovePSV = ({ open, onClose, data, onApprove }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [psvData, setPsvData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [items, setItems] = useState([]);
  const [approvalResult, setApprovalResult] = useState(null);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    approved_by: "",
    remarks: "",
    items: []
  });

  useEffect(() => {
    if (open && data) {
      fetchPSVDetails();
      fetchEmployees();
    }
  }, [open, data]);

  const fetchPSVDetails = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/physical-verifications/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPsvData(response.data.data);
        
        // Initialize items with default actions
        if (response.data.data.items && response.data.data.items.length > 0) {
          const initialItems = response.data.data.items.map(item => ({
            item_id: item.item_id?._id || item.item_id,
            item_code: item.item_code,
            description: item.description,
            system_quantity: item.system_quantity || 0,
            physical_quantity: item.physical_quantity || 0,
            variance: item.variance || 0,
            unit: item.unit,
            action: item.action || 'No Action',
            remarks: item.remarks || ""
          }));
          setItems(initialItems);
          setFormData(prev => ({
            ...prev,
            items: initialItems.map(item => ({
              item_id: item.item_id,
              action: item.action
            }))
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching PSV details:', err);
      setError('Failed to load PSV details');
    } finally {
      setFetching(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/employees?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEmployees(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    setFormData(prev => ({ ...prev, approved_by: newEmployee._id }));
  };

  const handleApproverChange = (value) => {
    setFormData(prev => ({ ...prev, approved_by: value?._id || "" }));
    if (error) setError("");
  };

  const handleRemarksChange = (e) => {
    setFormData(prev => ({ ...prev, remarks: e.target.value }));
  };

  const handleItemActionChange = (index, action) => {
    const updatedItems = [...items];
    const updatedFormItems = [...formData.items];
    
    updatedItems[index].action = action;
    updatedFormItems[index].action = action;
    
    setItems(updatedItems);
    setFormData(prev => ({ ...prev, items: updatedFormItems }));
  };

  const handleItemRemarksChange = (index, remarks) => {
    const updatedItems = [...items];
    updatedItems[index].remarks = remarks;
    setItems(updatedItems);
  };

  const validateForm = () => {
    if (!formData.approved_by) {
      setError("Please select an approver");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!psvData || !psvData._id) {
      setError("Invalid PSV data");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare items payload - only include items with action (excluding No Action if desired)
      const itemsPayload = formData.items
        .filter(item => item.item_id)
        .map(item => ({
          item_id: item.item_id,
          action: item.action
        }));
      
      const payload = {
        approved_by: formData.approved_by,
        remarks: formData.remarks || "",
        items: itemsPayload
      };
      
      const response = await axios.post(`${BASE_URL}/api/physical-verifications/${psvData._id}/approve`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        setApprovalResult(response.data.data);
        if (onApprove) {
          onApprove(response.data.data);
        }
        // Close after 2 seconds to show success message
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to approve PSV');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to approve PSV';
        
        if (err.response.status === 400) {
          setError(`Validation error: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("PSV not found");
        } else if (err.response.status === 403) {
          setError("You don't have permission to approve this PSV");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'An error occurred while approving PSV');
      }
    } finally { 
      setLoading(false); 
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPersonName = (person) => {
    if (!person) return '';
    if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
    if (person.FirstName) return person.FirstName;
    if (person.Username) return person.Username;
    if (person.Email) return person.Email;
    if (person.name) return person.name;
    return person._id || '';
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return '#D97706';
    if (variance < 0) return '#DC2626';
    return '#059669';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return <TrendingUpIcon sx={{ fontSize: '0.7rem' }} />;
    if (variance < 0) return <TrendingDownIcon sx={{ fontSize: '0.7rem' }} />;
    return null;
  };

  if (!data) return null;

  const canApprove = psvData?.status === 'Count Completed' || psvData?.status === 'Under Review';

  return (
    <>
      <Dialog
        open={open}
        onClose={!loading && !approvalResult ? onClose : undefined}
        maxWidth="sm"
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
            <ApprovalIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
            <Typography sx={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: COLORS.text.primary
            }}>
              Approve Physical Verification - {psvData?.verification_id || psvData?.verification_number || 'PSV'}
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small" disabled={loading}>
            <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
          </IconButton>
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          {fetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: COLORS.primary }} />
              <Typography sx={{ ml: 2, fontSize: '0.875rem', color: COLORS.text.secondary }}>
                Loading PSV details...
              </Typography>
            </Box>
          ) : approvalResult ? (
            // Success Result View
            <Stack spacing={3}>
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {approvalResult.message || "Verification approved and adjustments posted successfully!"}
                </Typography>
              </Alert>

              <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.success }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#059669', mb: 2, letterSpacing: '0.5px' }}>
                  APPROVAL SUMMARY
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography sx={labelStyle}>VERIFICATION ID</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'monospace', color: COLORS.primary }}>
                          {approvalResult.verification_id}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography sx={labelStyle}>ADJUSTMENT TRANSACTIONS</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.primary }}>
                          {approvalResult.adjustment_txns || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography sx={labelStyle}>TOTAL VARIANCE ADJUSTED</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.primary }}>
                          {formatCurrency(approvalResult.total_variance_adjusted)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography sx={labelStyle}>NET VARIANCE ADJUSTED</Typography>
                        <Typography sx={{ 
                          fontSize: '0.875rem', 
                          fontWeight: 600, 
                          color: approvalResult.net_variance_adjusted > 0 ? '#D97706' : approvalResult.net_variance_adjusted < 0 ? '#DC2626' : '#059669'
                        }}>
                          {formatCurrency(approvalResult.net_variance_adjusted)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography sx={labelStyle}>STATUS</Typography>
                        <Chip 
                          label={approvalResult.status || 'Approved'} 
                          size="small"
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: 24, 
                            bgcolor: '#D1FAE5', 
                            color: '#059669',
                            fontWeight: 600
                          }} 
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.white }}>
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography sx={labelStyle}>NEXT STEP</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {approvalResult.next_step || 'Close the verification to complete the process'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid> */}
                </Grid>
              </Paper>
            </Stack>
          ) : (
            <Stack spacing={2.5}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 1.5 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              {!canApprove && psvData && (
                <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem' }}>
                    <strong>Cannot Approve:</strong> This PSV is in "{psvData.status}" status. 
                    Only PSVs in "Count Completed" or "Under Review" status can be approved.
                  </Typography>
                </Alert>
              )}

              {/* PSV Information Summary */}
              {psvData && (
                <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography sx={labelStyle}>VERIFICATION ID</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'monospace', color: COLORS.primary }}>
                        {psvData.verification_id || psvData.verification_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography sx={labelStyle}>WAREHOUSE</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {psvData.warehouse_name || psvData.warehouse_id?.warehouse_name || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography sx={labelStyle}>VERIFICATION TYPE</Typography>
                      <Chip 
                        label={psvData.verification_type} 
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 24, bgcolor: COLORS.primaryLight, color: COLORS.primary }} 
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Variance Summary Cards */}
              {psvData && (
                <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                    VARIANCE SUMMARY
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                        <Typography sx={labelStyle}>TOTAL VARIANCE</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: COLORS.primary }}>
                          {formatCurrency(psvData.total_variance_value)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                        <Typography sx={labelStyle}>NET VARIANCE</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: psvData.net_variance_value > 0 ? '#D97706' : '#DC2626' }}>
                          {formatCurrency(psvData.net_variance_value)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                        <Typography sx={labelStyle}>SURPLUS ITEMS</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#D97706' }}>
                          {psvData.surplus_items || 0}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                        <Typography sx={labelStyle}>SHORTAGE ITEMS</Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#DC2626' }}>
                          {psvData.shortage_items || 0}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Approver Selection */}
              <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                  APPROVAL DETAILS
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={labelStyle}>
                      APPROVED BY <span style={{ color: "#EF4444" }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          fullWidth
                          options={employees}
                          getOptionLabel={getPersonName}
                          onChange={(e, val) => handleApproverChange(val)}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!error && !formData.approved_by}
                              helperText={!formData.approved_by && error ? "Approver is required" : ""}
                              placeholder="Select approver"
                              sx={inputStyle}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAddEmployeeOpen(true)}
                        startIcon={<PersonIcon sx={{ fontSize: '0.875rem' }} />}
                        sx={{
                          height: 36,
                          minWidth: 'auto',
                          px: 1.5,
                          borderRadius: 1.5,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.text.secondary,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Add New
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography sx={labelStyle}>APPROVAL REMARKS</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={formData.remarks}
                      onChange={handleRemarksChange}
                      size="small"
                      placeholder="Enter approval remarks, variance investigation results, etc..."
                      sx={inputStyle}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Items Table with Action Selection */}
              <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
                  ITEMS WITH VARIANCE - SELECT ACTIONS
                </Typography>
                
                <Alert severity="info" sx={{ mb: 2, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem' }}>
                    <strong>Action Required:</strong> For each item with variance, select the appropriate action.
                    This will determine how the stock adjustment is processed.
                  </Typography>
                </Alert>
                
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 50 }}>#</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Item Code</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">System Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Physical Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }} align="right">Variance</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Action*</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Remarks</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                              No items found for this verification
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((item, idx) => {
                          const actionColors = getActionColor(item.action);
                          const hasVariance = item.variance !== 0;
                          
                          return (
                            <TableRow key={item.item_id || idx} hover sx={{ bgcolor: hasVariance ? `${getVarianceColor(item.variance)}10` : 'inherit' }}>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{idx + 1}</TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, fontFamily: 'monospace' }}>
                                  {item.item_code || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                  {item.description || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                  {item.system_quantity || 0}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                  {item.physical_quantity || 0}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                {hasVariance ? (
                                  <Chip
                                    icon={getVarianceIcon(item.variance)}
                                    label={Math.abs(item.variance)}
                                    size="small"
                                    sx={{
                                      fontSize: '0.65rem',
                                      height: 22,
                                      bgcolor: getVarianceColor(item.variance) + '20',
                                      color: getVarianceColor(item.variance)
                                    }}
                                  />
                                ) : (
                                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                                    0
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  select
                                  size="small"
                                  value={item.action}
                                  onChange={(e) => handleItemActionChange(idx, e.target.value)}
                                  fullWidth
                                  disabled={!canApprove || loading || !hasVariance}
                                  sx={inputStyle}
                                  InputProps={{
                                    startAdornment: actionColors.icon ? (
                                      <InputAdornment position="start">
                                        {actionColors.icon}
                                      </InputAdornment>
                                    ) : undefined
                                  }}
                                >
                                  {ACTION_OPTIONS.map((action) => (
                                    <MenuItem key={action} value={action} sx={{ fontSize: '0.75rem' }}>
                                      {action}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={item.remarks || ''}
                                  onChange={(e) => handleItemRemarksChange(idx, e.target.value)}
                                  placeholder="Add remarks (optional)"
                                  fullWidth
                                  disabled={!canApprove || loading}
                                  multiline
                                  rows={1}
                                  sx={inputStyle}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                  {item.unit || '-'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Warning Note */}
              <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem' }}>
                  <strong>Important:</strong> Approval will post stock adjustments based on the selected actions.
                  This will update inventory quantities and cannot be undone. Please review all actions carefully.
                </Typography>
              </Alert>
            </Stack>
          )}
        </DialogContent>

        {/* ACTIONS */}
        {!approvalResult && (
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
                fontSize: "0.7rem",
                fontWeight: 500,
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>

            {canApprove && (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !canApprove || !formData.approved_by}
                startIcon={!loading && <ApprovalIcon sx={{ fontSize: "1rem" }} />}
                sx={{
                  height: 32,
                  px: 2,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primary,
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': { bgcolor: COLORS.primaryDark }
                }}
              >
                {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Approve & Post Adjustments"}
              </Button>
            )}
            
            {!canApprove && psvData && (
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  height: 32,
                  px: 2,
                  borderRadius: 1.5,
                  borderColor: COLORS.border,
                  color: COLORS.text.secondary,
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  textTransform: 'none'
                }}
              >
                Close
              </Button>
            )}
          </DialogActions>
        )}

        {approvalResult && (
          <DialogActions sx={{
            px: 2.5,
            py: 1.5,
            borderTop: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white,
            gap: 1
          }}>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: "0.7rem",
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Add Employee Modal */}
      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAdd={handleEmployeeAdded}
      />
    </>
  );
};

// Input style
const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    fontSize: '0.75rem',
    backgroundColor: COLORS.background.white,
    '&:hover fieldset': { borderColor: COLORS.primary },
    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
  },
  '& .MuiInputBase-input': {
    py: 1,
    px: 1.5,
    fontSize: '0.75rem',
    color: COLORS.text.primary
  }
};

export default ApprovePSV;