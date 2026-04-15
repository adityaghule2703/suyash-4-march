import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton as MuiIconButton,
  Tooltip,
  MenuItem
} from "@mui/material";
import {
  Add,
  Delete,
  Close,
  Warning as WarningIcon,
  Save as SaveIcon,
  Person,
  Inventory
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

const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Sheet', 'Roll'];

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.75rem",
    backgroundColor: COLORS.background.white,
    "&:hover fieldset": { borderColor: COLORS.primary },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary,
      borderWidth: 1
    }
  },
  "& .MuiInputBase-input": {
    py: 1,
    px: 1.5,
    fontSize: "0.75rem",
    color: COLORS.text.primary,
    "&::placeholder": {
      color: COLORS.text.tertiary
    }
  }
};

const labelStyle = {
  fontSize: "0.7rem",
  fontWeight: 600,
  color: COLORS.text.secondary,
  letterSpacing: "0.5px",
  mb: 0.5
};

const EditMIV = ({ open, onClose, data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [stockError, setStockError] = useState("");
  
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [grns, setGrns] = useState([]);
  
  const [formData, setFormData] = useState({
    department: "",
    issued_by: "",
    received_by: "",
    authorised_by: "",
    remarks: "",
    items: []
  });

  useEffect(() => {
    if (open && data) {
      fetchDepartments();
      fetchEmployees();
      fetchUsers();
      fetchItems();
      fetchWarehouses();
      fetchGrns();
      initializeForm();
    }
  }, [open, data]);

  const initializeForm = () => {
    if (data) {
      setFormData({
        department: data.department?._id || data.department || "",
        issued_by: data.issued_by?._id || data.issued_by || "",
        received_by: data.received_by?._id || data.received_by || "",
        authorised_by: data.authorised_by?._id || data.authorised_by || "",
        remarks: data.remarks || "",
        items: (data.items || []).map(item => ({
          item_id: item.item_id?._id || item.item_id || "",
          part_no: item.part_no || "",
          item_description: item.item_description || item.description || "",
          issued_qty: item.issued_qty || item.quantity || "",
          unit: item.unit || "",
          warehouse_id: item.warehouse_id?._id || item.warehouse_id || "",
          bin_id: item.bin_id?._id || item.bin_id || "",
          batch_no: item.batch_no || "",
          heat_no: item.heat_no || "",
          unit_cost: item.unit_cost || ""
        }))
      });
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/departments?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDepartments(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/users?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchItems = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/items?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setItems(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setFetching(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/warehouses?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setWarehouses(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const fetchGrns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/grns?limit=1000&sort_by=createdAt&sort_order=desc`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setGrns(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching GRNs:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value?._id || '' }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const getAvailableBatches = (itemId) => {
    const batches = [];
    grns.forEach(grn => {
      grn.items.forEach(item => {
        if (item.item_id === itemId && item.batch_no) {
          batches.push({
            batch_no: item.batch_no,
            heat_no: item.heat_no,
            storage_location: item.storage_location,
            available_qty: item.accepted_qty || item.received_qty,
            grn_id: grn._id,
            grn_number: grn.grn_number
          });
        }
      });
    });
    return batches;
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    
    if (field === 'item_id' && value) {
      const selectedItem = items.find(i => i._id === value);
      if (selectedItem) {
        updated[index].part_no = selectedItem.part_no || selectedItem.PartNo || selectedItem.item_code || '';
        updated[index].item_description = selectedItem.description || 
                                          selectedItem.Description || 
                                          selectedItem.item_description || 
                                          selectedItem.item_name || 
                                          selectedItem.name || 
                                          '';
        const itemUnit = selectedItem.unit || selectedItem.Unit || selectedItem.uom || '';
        if (itemUnit && UNIT_OPTIONS.includes(itemUnit)) {
          updated[index].unit = itemUnit;
        }
        
        if (selectedItem.current_cost) {
          updated[index].unit_cost = selectedItem.current_cost;
        }
        
        updated[index].batch_no = '';
        updated[index].heat_no = '';
      }
    }
    
    if (field === 'batch_no' && value) {
      const batches = getAvailableBatches(updated[index].item_id);
      const selectedBatch = batches.find(b => b.batch_no === value);
      if (selectedBatch) {
        updated[index].heat_no = selectedBatch.heat_no || '';
      }
    }
    
    setFormData(prev => ({ ...prev, items: updated }));
    if (errors[`item_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        item_id: '', part_no: '', item_description: '', issued_qty: '', unit: '',
        warehouse_id: '', bin_id: '', batch_no: '', heat_no: '', unit_cost: ''
      }]
    }));
  };

  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updated }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.issued_by) newErrors.issued_by = 'Issued By is required';
    if (!formData.received_by) newErrors.received_by = 'Received By is required';
    if (!formData.authorised_by) newErrors.authorised_by = 'Authorised By is required';
    
    formData.items.forEach((item, idx) => {
      if (!item.item_id) newErrors[`item_${idx}_item_id`] = 'Item is required';
      if (!item.issued_qty) newErrors[`item_${idx}_issued_qty`] = 'Quantity is required';
      else if (Number(item.issued_qty) <= 0) newErrors[`item_${idx}_issued_qty`] = 'Quantity must be greater than 0';
      if (!item.warehouse_id) newErrors[`item_${idx}_warehouse_id`] = 'Warehouse is required';
      if (!item.item_description) newErrors[`item_${idx}_item_description`] = 'Item description is required';
      if (!item.unit) newErrors[`item_${idx}_unit`] = 'Unit is required';
      else if (!UNIT_OPTIONS.includes(item.unit)) newErrors[`item_${idx}_unit`] = `Unit must be one of: ${UNIT_OPTIONS.join(', ')}`;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!data || !data._id) {
      setErrors({ submit: "Invalid MIV data" });
      return;
    }
    
    setLoading(true);
    setStockError("");
    
    try {
      const token = localStorage.getItem('token');
      
      const itemsPayload = formData.items.map(item => ({
        item_id: item.item_id,
        part_no: item.part_no || '',
        item_description: item.item_description || '',
        issued_qty: Number(item.issued_qty),
        unit: item.unit,
        warehouse_id: item.warehouse_id,
        bin_id: item.bin_id || '',
        batch_no: item.batch_no || '',
        heat_no: item.heat_no || '',
        unit_cost: Number(item.unit_cost) || 0
      }));
      
      const payload = {
        department: formData.department,
        issued_by: formData.issued_by,
        received_by: formData.received_by,
        authorised_by: formData.authorised_by,
        remarks: formData.remarks || '',
        items: itemsPayload
      };
      
      const response = await axios.put(`${BASE_URL}/api/miv/${data._id}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        onClose();
      } else {
        setErrors({ submit: response.data.message || 'Failed to update MIV' });
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to update MIV';
        
        if (err.response.status === 400) {
          setErrors({ submit: `Cannot update: ${errorMsg}` });
        } else if (err.response.status === 404) {
          setErrors({ submit: "MIV not found" });
        } else if (err.response.status === 403) {
          setErrors({ submit: "You don't have permission to update this MIV" });
        } else if (errorMsg.toLowerCase().includes('insufficient stock')) {
          setStockError(errorMsg);
        } else {
          setErrors({ submit: errorMsg });
        }
      } else if (err.request) {
        setErrors({ submit: 'No response from server. Please check your connection.' });
      } else {
        setErrors({ submit: err.message || 'An error occurred while updating MIV' });
      }
    } finally { 
      setLoading(false); 
    }
  };

  const getDepartmentDisplay = (dept) => {
    if (!dept) return '';
    return dept.DepartmentName || dept.name || dept._id || '';
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

  const getItemDisplay = (item) => {
    if (!item) return '';
    const partNo = item.part_no || item.PartNo || item.item_code || '';
    const description = item.description || item.Description || item.item_description || item.name || '';
    if (partNo && description) {
      return `${partNo} - ${description.substring(0, 50)}`;
    }
    if (partNo) return partNo;
    if (description) return description.substring(0, 50);
    return item._id?.slice(-6) || 'Unknown Item';
  };

  const getWarehouseDisplay = (wh) => {
    if (!wh) return '';
    return wh.warehouse_name || wh.name || wh.warehouse_code || wh._id || '';
  };

  const getWarehouseBins = (warehouseId) => {
    const warehouse = warehouses.find(w => w._id === warehouseId);
    if (warehouse && warehouse.bins && Array.isArray(warehouse.bins)) {
      return warehouse.bins;
    }
    return [];
  };

  const getBinDisplay = (bin) => {
    if (!bin) return '';
    const binCode = bin.bin_code || bin.bin_id || '';
    const rack = bin.rack || '';
    return rack ? `${binCode} - ${rack}` : binCode;
  };

  if (!data) return null;

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
          <SaveIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Edit MIV - {data.miv_number || 'Draft'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {errors.submit && (
            <Alert severity="error" sx={{ borderRadius: 1.5 }} onClose={() => setErrors({})}>
              {errors.submit}
            </Alert>
          )}
          
          {stockError && (
            <Alert severity="error" sx={{ borderRadius: 1.5 }} onClose={() => setStockError('')}>
              <strong>Stock Insufficient!</strong><br />
              {stockError}
            </Alert>
          )}
          
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>
            <Typography sx={{ fontSize: '0.7rem' }}>
              <strong>Note:</strong> Only Draft MIVs can be edited. Changes will be saved as draft.
            </Typography>
          </Alert>
          
          {/* BASIC INFORMATION SECTION */}
          <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2, letterSpacing: '0.5px' }}>
              BASIC INFORMATION
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography sx={labelStyle}>
                  DEPARTMENT <span style={{ color: "#EF4444" }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={departments}
                  getOptionLabel={(opt) => getDepartmentDisplay(opt)}
                  value={departments.find(d => d._id === formData.department) || null}
                  onChange={(e, val) => handleAutocompleteChange('department', val)}
                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      error={!!errors.department}
                      helperText={errors.department}
                      placeholder="Select department"
                      sx={inputStyle}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography sx={labelStyle}>
                  ISSUED BY <span style={{ color: "#EF4444" }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={employees}
                  getOptionLabel={(opt) => getPersonName(opt)}
                  value={employees.find(e => e._id === formData.issued_by) || null}
                  onChange={(e, val) => handleAutocompleteChange('issued_by', val)}
                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      error={!!errors.issued_by}
                      helperText={errors.issued_by}
                      placeholder="Select employee"
                      sx={inputStyle}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography sx={labelStyle}>
                  RECEIVED BY <span style={{ color: "#EF4444" }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={employees}
                  getOptionLabel={(opt) => getPersonName(opt)}
                  value={employees.find(e => e._id === formData.received_by) || null}
                  onChange={(e, val) => handleAutocompleteChange('received_by', val)}
                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      error={!!errors.received_by}
                      helperText={errors.received_by}
                      placeholder="Select employee"
                      sx={inputStyle}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography sx={labelStyle}>
                  AUTHORISED BY <span style={{ color: "#EF4444" }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={users}
                  getOptionLabel={(opt) => opt.Username || opt.Email || getPersonName(opt)}
                  value={users.find(u => u._id === formData.authorised_by) || null}
                  onChange={(e, val) => handleAutocompleteChange('authorised_by', val)}
                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      error={!!errors.authorised_by}
                      helperText={errors.authorised_by}
                      placeholder="Select user"
                      sx={inputStyle}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography sx={labelStyle}>REMARKS</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  size="small"
                  placeholder="Enter any additional remarks..."
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* ITEMS SECTION */}
          <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, letterSpacing: '0.5px' }}>
                MATERIAL ITEMS <span style={{ color: "#EF4444" }}>*</span>
              </Typography>
              <Tooltip title="Add Item">
                <Button 
                  startIcon={<Add sx={{ fontSize: '1rem' }} />} 
                  onClick={addItem} 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    textTransform: 'none', 
                    fontSize: '0.7rem', 
                    borderRadius: 1.5, 
                    borderColor: COLORS.primary, 
                    color: COLORS.primary,
                    height: 28
                  }}
                >
                  Add Item
                </Button>
              </Tooltip>
            </Stack>
            
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 2 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.light }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Item / Material</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Part No</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 200 }}>Description</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Quantity*</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Unit*</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 150 }}>Warehouse*</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }}>Bin</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 120 }}>Batch No</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Heat No</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: 100 }}>Unit Cost</TableCell>
                    <TableCell sx={{ width: 50 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items.map((item, idx) => {
                    const warehouseBins = getWarehouseBins(item.warehouse_id);
                    const availableBatches = item.item_id ? getAvailableBatches(item.item_id) : [];
                    
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <Autocomplete
                            fullWidth
                            options={items}
                            getOptionLabel={getItemDisplay}
                            value={items.find(i => i._id === item.item_id) || null}
                            onChange={(e, val) => handleItemChange(idx, 'item_id', val?._id || '')}
                            loading={fetching}
                            isOptionEqualToValue={(option, value) => option._id === value?._id}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                error={!!errors[`item_${idx}_item_id`]}
                                helperText={errors[`item_${idx}_item_id`]}
                                placeholder="Select item"
                                sx={inputStyle}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField 
                            size="small" 
                            value={item.part_no} 
                            disabled 
                            fullWidth 
                            sx={inputStyle}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField 
                            size="small" 
                            value={item.item_description} 
                            onChange={(e) => handleItemChange(idx, 'item_description', e.target.value)}
                            error={!!errors[`item_${idx}_item_description`]} 
                            helperText={errors[`item_${idx}_item_description`]} 
                            placeholder="Description" 
                            fullWidth 
                            multiline 
                            rows={2}
                            sx={inputStyle}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField 
                            type="number" 
                            size="small" 
                            value={item.issued_qty} 
                            onChange={(e) => handleItemChange(idx, 'issued_qty', e.target.value)} 
                            error={!!errors[`item_${idx}_issued_qty`]} 
                            helperText={errors[`item_${idx}_issued_qty`]} 
                            placeholder="Qty" 
                            fullWidth 
                            sx={inputStyle}
                            InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            select
                            size="small"
                            value={item.unit}
                            onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                            error={!!errors[`item_${idx}_unit`]}
                            helperText={errors[`item_${idx}_unit`]}
                            fullWidth
                            sx={inputStyle}
                          >
                            <MenuItem value="" disabled>Select Unit</MenuItem>
                            {UNIT_OPTIONS.map((unit) => (
                              <MenuItem key={unit} value={unit} sx={{ fontSize: '0.75rem' }}>{unit}</MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            fullWidth
                            options={warehouses}
                            getOptionLabel={getWarehouseDisplay}
                            value={warehouses.find(w => w._id === item.warehouse_id) || null}
                            onChange={(e, val) => handleItemChange(idx, 'warehouse_id', val?._id || '')}
                            isOptionEqualToValue={(option, value) => option._id === value?._id}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select warehouse"
                                error={!!errors[`item_${idx}_warehouse_id`]}
                                helperText={errors[`item_${idx}_warehouse_id`]}
                                sx={inputStyle}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            fullWidth
                            options={warehouseBins}
                            getOptionLabel={getBinDisplay}
                            value={warehouseBins.find(b => b._id === item.bin_id) || null}
                            onChange={(e, val) => handleItemChange(idx, 'bin_id', val?._id || '')}
                            disabled={!item.warehouse_id}
                            isOptionEqualToValue={(option, value) => option._id === value?._id}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder={!item.warehouse_id ? "Select warehouse first" : "Select bin"}
                                sx={inputStyle}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            fullWidth
                            options={availableBatches}
                            getOptionLabel={(opt) => `${opt.batch_no} (Available: ${opt.available_qty})`}
                            value={availableBatches.find(b => b.batch_no === item.batch_no) || null}
                            onChange={(e, val) => handleItemChange(idx, 'batch_no', val?.batch_no || '')}
                            disabled={!item.item_id}
                            isOptionEqualToValue={(option, value) => option.batch_no === value}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder={!item.item_id ? "Select item first" : "Select batch"}
                                sx={inputStyle}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField 
                            size="small" 
                            value={item.heat_no} 
                            onChange={(e) => handleItemChange(idx, 'heat_no', e.target.value)} 
                            placeholder="Heat No" 
                            fullWidth 
                            disabled={!!item.batch_no}
                            sx={inputStyle}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField 
                            type="number" 
                            size="small" 
                            value={item.unit_cost} 
                            onChange={(e) => handleItemChange(idx, 'unit_cost', e.target.value)} 
                            placeholder="Cost" 
                            fullWidth 
                            sx={inputStyle}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          />
                        </TableCell>
                        <TableCell>
                          {formData.items.length > 1 && (
                            <Tooltip title="Remove Item">
                              <MuiIconButton 
                                size="small" 
                                onClick={() => removeItem(idx)} 
                                sx={{ color: '#EF4444' }}
                              >
                                <Delete fontSize="small" />
                              </MuiIconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
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

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={!loading && <SaveIcon sx={{ fontSize: "1rem" }} />}
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
          {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Update MIV"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMIV;