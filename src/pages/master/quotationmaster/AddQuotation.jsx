import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Autocomplete,
  Collapse,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  AddCircle as AddCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddQuotation = ({ open, onClose, onAdd }) => {
  const [vendorType, setVendorType] = useState('Existing');
  const [formData, setFormData] = useState({
    VendorType: 'Existing',
    VendorID: '',
    QuotationType: 'CostBreakup',
    ValidTill: '',
    InternalRemarks: '',
    CustomerRemarks: '',
    Items: []
  });
  
  const [newVendor, setNewVendor] = useState({
    VendorName: '',
    GSTIN: '',
    State: '',
    StateCode: '',
    Address: '',
    City: '',
    Pincode: '',
    ContactPerson: '',
    Phone: '',
    Email: '',
    PAN: ''
  });
  
  const [itemInput, setItemInput] = useState({
    PartNo: '',
    Quantity: '',
    PartName: ''
  });
  
  const [processes, setProcesses] = useState([]);
  const [selectedItemForProcess, setSelectedItemForProcess] = useState(null);
  const [openProcessDialog, setOpenProcessDialog] = useState(false);
  const [currentProcessSelection, setCurrentProcessSelection] = useState({
    ProcessID: '',
    Price: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);

  // Quotation type options from enum
  const quotationTypes = ['CostBreakup', 'Detailed', 'Summary'];

  useEffect(() => {
    if (open) {
      fetchVendors();
      fetchItems();
      fetchProcesses();
    }
  }, [open]);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/quotations/vendors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please try again.');
    }
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
    }
  };

  const fetchProcesses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/processes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProcesses(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching processes:', err);
      setError('Failed to load processes. Please try again.');
    }
  };

  const handleVendorTypeChange = (event) => {
    const type = event.target.value;
    setVendorType(type);
    setFormData(prev => ({ ...prev, VendorType: type }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewVendorChange = (e) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePartNoChange = (event, value) => {
    if (value) {
      const selectedItem = items.find(item => item.PartNo === value);
      setItemInput(prev => ({
        ...prev,
        PartNo: value,
        PartName: selectedItem ? selectedItem.PartName : ''
      }));
    } else {
      setItemInput(prev => ({
        ...prev,
        PartNo: '',
        PartName: ''
      }));
    }
  };

  const handleAddItem = () => {
    if (!itemInput.PartNo || !itemInput.Quantity || parseInt(itemInput.Quantity) <= 0) {
      setError('Please enter valid Part No and Quantity');
      return;
    }

    const selectedItem = items.find(item => item.PartNo === itemInput.PartNo);
    if (!selectedItem) {
      setError('Selected Part No not found in items list');
      return;
    }

    const newItem = {
      PartNo: itemInput.PartNo,
      Quantity: parseInt(itemInput.Quantity),
      PartName: selectedItem.PartName || '',
      Unit: selectedItem.Unit || '',
      HSNCode: selectedItem.HSNCode || '',
      Processes: []
    };

    setFormData(prev => ({
      ...prev,
      Items: [...prev.Items, newItem]
    }));

    setItemInput({ PartNo: '', Quantity: '', PartName: '' });
    setError('');
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      Items: prev.Items.filter((_, i) => i !== index)
    }));
  };

  const handleOpenProcessDialog = (itemIndex) => {
    setSelectedItemForProcess(itemIndex);
    setCurrentProcessSelection({ ProcessID: '', Price: '' });
    setOpenProcessDialog(true);
  };

  const handleCloseProcessDialog = () => {
    setOpenProcessDialog(false);
    setSelectedItemForProcess(null);
    setCurrentProcessSelection({ ProcessID: '', Price: '' });
  };

  const handleProcessSelectionChange = (e) => {
    const { name, value } = e.target;
    setCurrentProcessSelection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProcessToItem = () => {
    if (!currentProcessSelection.ProcessID || !currentProcessSelection.Price || parseFloat(currentProcessSelection.Price) <= 0) {
      setError('Please select a process and enter a valid price');
      return;
    }

    const selectedProcess = processes.find(p => p._id === currentProcessSelection.ProcessID);
    if (!selectedProcess) {
      setError('Selected process not found');
      return;
    }

    const itemProcesses = formData.Items[selectedItemForProcess].Processes;
    if (itemProcesses.some(p => p.ProcessID === currentProcessSelection.ProcessID)) {
      setError('This process has already been added to the item');
      return;
    }

    const updatedItems = [...formData.Items];
    updatedItems[selectedItemForProcess].Processes.push({
      ProcessID: currentProcessSelection.ProcessID,
      Price: parseFloat(currentProcessSelection.Price),
      ProcessName: selectedProcess.ProcessName,
      RateType: selectedProcess.RateType,
      VendorOrInhouse: selectedProcess.VendorOrInhouse
    });

    setFormData(prev => ({
      ...prev,
      Items: updatedItems
    }));

    handleCloseProcessDialog();
    setError('');
  };

  const handleRemoveProcessFromItem = (itemIndex, processIndex) => {
    const updatedItems = [...formData.Items];
    updatedItems[itemIndex].Processes.splice(processIndex, 1);
    
    setFormData(prev => ({
      ...prev,
      Items: updatedItems
    }));
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const validateForm = () => {
    if (!formData.ValidTill) {
      setError('Valid Till date is required');
      return false;
    }

    if (!formData.QuotationType) {
      setError('Please select a quotation type');
      return false;
    }

    if (vendorType === 'Existing' && !formData.VendorID) {
      setError('Please select a vendor');
      return false;
    }

    if (vendorType === 'New') {
      const requiredFields = ['VendorName', 'GSTIN', 'State', 'Address', 'ContactPerson', 'Phone', 'Email'];
      for (const field of requiredFields) {
        if (!newVendor[field]?.trim()) {
          setError(`Please fill in all required vendor fields`);
          return false;
        }
      }
    }

    if (formData.Items.length === 0) {
      setError('Please add at least one item');
      return false;
    }

    for (let i = 0; i < formData.Items.length; i++) {
      if (formData.Items[i].Processes.length === 0) {
        setError(`Item ${formData.Items[i].PartNo} must have at least one process`);
        return false;
      }
    }

    return true;
  };

  // Improved file download function
  // Improved file download function with better URL handling
const downloadFile = (fileUrl, fileName) => {
  try {
    setDownloadInProgress(true);
    
    // Clean the base URL - remove trailing slash if present
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    
    // Ensure fileUrl starts with a slash
    const urlPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
    
    // Construct the full URL
    const fullUrl = `${baseUrl}${urlPath}`;
    
    console.log('Attempting to download from:', fullUrl);
    console.log('File name:', fileName);
    
    // Try multiple filename variations if the first attempt fails
    const tryDownload = (url) => {
      return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create blob URL and trigger download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 100);
        
        setDownloadInProgress(false);
        return true;
      })
      .catch(error => {
        console.log(`Failed to download from ${url}:`, error);
        return false;
      });
    };

    // Try the original URL first
    tryDownload(fullUrl)
      .then(success => {
        if (!success) {
          // If failed, try alternative filename formats
          console.log('Trying alternative URL formats...');
          
          // Extract the filename from the path
          const pathParts = fileUrl.split('/');
          const originalFileName = pathParts[pathParts.length - 1];
          
          // Try different variations
          const variations = [
            // Variation 1: Replace hyphens with nothing (Cost-Breakup -> CostBreakup)
            originalFileName.replace(/-/g, ''),
            // Variation 2: Original name with hyphen
            originalFileName,
            // Variation 3: Try without the hyphen in the type part
            originalFileName.replace(/^([A-Za-z]+)-/, (match, p1) => p1)
          ];
          
          // Remove duplicates
          const uniqueVariations = [...new Set(variations)];
          
          // Try each variation
          let promiseChain = Promise.resolve(false);
          uniqueVariations.forEach(variation => {
            promiseChain = promiseChain.then(success => {
              if (!success) {
                const altPath = fileUrl.replace(originalFileName, variation);
                const altUrl = `${baseUrl}${altPath.startsWith('/') ? altPath : `/${altPath}`}`;
                console.log('Trying:', altUrl);
                return tryDownload(altUrl);
              }
              return success;
            });
          });
          
          promiseChain.then(success => {
            if (!success) {
              // If all attempts fail, open in new tab as fallback
              console.log('All download attempts failed, opening in new tab');
              window.open(fullUrl, '_blank');
              setDownloadInProgress(false);
            }
          });
        }
      });
      
  } catch (error) {
    console.error('Download error:', error);
    setDownloadInProgress(false);
    
    // Fallback: Show alert with URL
    alert(`Unable to download automatically. You can access the file at:\n${BASE_URL}${fileUrl}`);
  }
};

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    const payload = {
      QuotationType: formData.QuotationType,
      VendorType: vendorType,
      ValidTill: formData.ValidTill,
      InternalRemarks: formData.InternalRemarks,
      CustomerRemarks: formData.CustomerRemarks,
      Items: formData.Items.map(item => ({
        PartNo: item.PartNo,
        Quantity: item.Quantity,
        Processes: item.Processes.map(process => ({
          ProcessID: process.ProcessID,
          Price: process.Price
        }))
      }))
    };

    if (vendorType === 'Existing') {
      payload.VendorID = formData.VendorID;
    } else {
      payload.NewVendor = newVendor;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/quotations`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // In handleSubmit function, after successful response:

if (response.data.success) {
  const quotationData = response.data.data;
  
  // Call the onAdd callback with the quotation data
  onAdd(quotationData);
  
  // Check if file exists in the response
  if (quotationData.file && quotationData.file.url) {
    const fileUrl = quotationData.file.url;
    
    // Use the filename from the response
    let fileName = quotationData.file.name;
    
    // If the filename doesn't match the pattern we expect, create a proper one
    if (!fileName || fileName === '') {
      // Create filename based on QuotationType and QuotationNo
      const type = quotationData.QuotationType || 'Quotation';
      const number = quotationData.QuotationNo || Date.now();
      
      // Add hyphen between type and number if needed
      fileName = `${type}-${number}.xlsx`;
      
      // If type doesn't have hyphen (like "CostBreakup"), format it properly
      if (type === 'CostBreakup') {
        fileName = `Cost-Breakup-${number}.xlsx`;
      } else if (type === 'Detailed') {
        fileName = `Detailed-${number}.xlsx`;
      } else if (type === 'Summary') {
        fileName = `Summary-${number}.xlsx`;
      }
    }
    
    console.log('File URL:', fileUrl);
    console.log('File Name:', fileName);
    
    // Small delay to ensure the dialog closes properly before download starts
    setTimeout(() => {
      downloadFile(fileUrl, fileName);
    }, 500);
  } else {
    console.log('No file URL in response, attempting to construct URL');
    
    // Try to construct file URL from QuotationType and QuotationNo
    if (quotationData.QuotationType && quotationData.QuotationNo) {
      const type = quotationData.QuotationType;
      const number = quotationData.QuotationNo;
      
      // Format the filename correctly
      let formattedType = type;
      if (type === 'CostBreakup') {
        formattedType = 'Cost-Breakup';
      }
      
      const fileName = `${formattedType}-${number}.xlsx`;
      const constructedUrl = `/uploads/quotations/${fileName}`;
      
      console.log('Constructed URL:', constructedUrl);
      console.log('Constructed filename:', fileName);
      
      setTimeout(() => {
        downloadFile(constructedUrl, fileName);
      }, 500);
    }
  }
  
  resetForm();
  onClose();
} else {
        setError(response.data.message || 'Failed to add quotation');
      }
    } catch (err) {
      console.error('Error adding quotation:', err);
      setError(err.response?.data?.message || 'Failed to add quotation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVendorType('Existing');
    setFormData({
      VendorType: 'Existing',
      VendorID: '',
      QuotationType: 'CostBreakup',
      ValidTill: '',
      InternalRemarks: '',
      CustomerRemarks: '',
      Items: []
    });
    setNewVendor({
      VendorName: '',
      GSTIN: '',
      State: '',
      StateCode: '',
      Address: '',
      City: '',
      Pincode: '',
      ContactPerson: '',
      Phone: '',
      Email: '',
      PAN: ''
    });
    setItemInput({ PartNo: '', Quantity: '', PartName: '' });
    setCurrentProcessSelection({ ProcessID: '', Price: '' });
    setSelectedItemForProcess(null);
    setOpenProcessDialog(false);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const partNoOptions = items.map(item => item.PartNo).filter(Boolean);

  const formatQuotationType = (type) => {
    return type.replace(/([A-Z])/g, ' $1').trim();
  };

  const getProcessName = (processId) => {
    const process = processes.find(p => p._id === processId);
    return process ? process.ProcessName : 'Unknown Process';
  };

  // Fixed renderOption function - no key spreading issue
  const renderOption = (props, option) => {
    const item = items.find(i => i.PartNo === option);
    // Extract the key from props and don't spread it
    const { key, ...otherProps } = props;
    
    return (
      <li key={key} {...otherProps}>
        <Box>
          <Typography variant="body2">{option}</Typography>
          {item && (
            <Typography variant="caption" color="textSecondary">
              {item.PartName} • {item.Unit || 'No unit'}
            </Typography>
          )}
        </Box>
      </li>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 600,
          paddingTop: '8px'
        }}>
          Add New Quotation
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        {downloadInProgress && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 1 }}>
            Downloading quotation file...
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Vendor Type Selection */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Vendor Type
            </Typography>
            <RadioGroup row value={vendorType} onChange={handleVendorTypeChange}>
              <FormControlLabel value="Existing" control={<Radio />} label="Existing Vendor" />
              <FormControlLabel value="New" control={<Radio />} label="New Vendor" />
            </RadioGroup>
          </Box>

          {/* Quotation Type Selection */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Quotation Type
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Quotation Type *</InputLabel>
              <Select
                name="QuotationType"
                value={formData.QuotationType}
                onChange={handleFormChange}
                label="Select Quotation Type *"
                disabled={loading}
              >
                {quotationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{formatQuotationType(type)}</Typography>
                      <Chip 
                        label={type} 
                        size="small" 
                        sx={{ 
                          ml: 1,
                          bgcolor: type === formData.QuotationType ? '#00B4D8' : '#f1f5f9',
                          color: type === formData.QuotationType ? 'white' : '#475569'
                        }} 
                      />
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
              Choose the type of quotation format
            </Typography>
          </Box>

          {/* Vendor Details */}
          {vendorType === 'Existing' ? (
            <FormControl fullWidth>
              <InputLabel>Select Vendor *</InputLabel>
              <Select
                name="VendorID"
                value={formData.VendorID}
                onChange={handleFormChange}
                disabled={loading || vendors.length === 0}
                label="Select Vendor *"
              >
                <MenuItem value="">
                  <em>Select a vendor</em>
                </MenuItem>
                {vendors.map((vendor) => (
                  <MenuItem key={vendor._id} value={vendor._id}>
                    {vendor.VendorName} ({vendor.GSTIN})
                  </MenuItem>
                ))}
              </Select>
              {vendors.length === 0 && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  No vendors found. Please add vendors first.
                </Typography>
              )}
            </FormControl>
          ) : (
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                New Vendor Details
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Vendor Name *"
                  name="VendorName"
                  value={newVendor.VendorName}
                  onChange={handleNewVendorChange}
                  required
                />
                <TextField
                  fullWidth
                  label="GSTIN *"
                  name="GSTIN"
                  value={newVendor.GSTIN}
                  onChange={handleNewVendorChange}
                  required
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="State *"
                  name="State"
                  value={newVendor.State}
                  onChange={handleNewVendorChange}
                  required
                />
                <TextField
                  fullWidth
                  label="State Code"
                  name="StateCode"
                  value={newVendor.StateCode}
                  onChange={handleNewVendorChange}
                  type="number"
                />
              </Stack>
              <TextField
                fullWidth
                label="Address *"
                name="Address"
                value={newVendor.Address}
                onChange={handleNewVendorChange}
                required
                multiline
                rows={2}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="City"
                  name="City"
                  value={newVendor.City}
                  onChange={handleNewVendorChange}
                />
                <TextField
                  fullWidth
                  label="Pincode"
                  name="Pincode"
                  value={newVendor.Pincode}
                  onChange={handleNewVendorChange}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Contact Person *"
                  name="ContactPerson"
                  value={newVendor.ContactPerson}
                  onChange={handleNewVendorChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Phone *"
                  name="Phone"
                  value={newVendor.Phone}
                  onChange={handleNewVendorChange}
                  required
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="Email"
                  value={newVendor.Email}
                  onChange={handleNewVendorChange}
                  required
                  type="email"
                />
                <TextField
                  fullWidth
                  label="PAN"
                  name="PAN"
                  value={newVendor.PAN}
                  onChange={handleNewVendorChange}
                />
              </Stack>
            </Stack>
          )}

          {/* Valid Till Date */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Quotation Validity
            </Typography>
            <TextField
              fullWidth
              label="Valid Till *"
              name="ValidTill"
              type="date"
              value={formData.ValidTill}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getTodayDate() }}
            />
          </Box>

          {/* Items Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Items
            </Typography>
            
            {/* Add Item Form */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: '#F8FAFC' }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Autocomplete
                    sx={{ flex: 2 }}
                    freeSolo
                    options={partNoOptions}
                    value={itemInput.PartNo}
                    onChange={handlePartNoChange}
                    onInputChange={(event, newInputValue) => {
                      setItemInput(prev => ({ ...prev, PartNo: newInputValue }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Part No *"
                        placeholder="Search or select part number"
                      />
                    )}
                    renderOption={renderOption}
                  />
                  <TextField
                    sx={{ flex: 1 }}
                    label="Quantity *"
                    name="Quantity"
                    value={itemInput.Quantity}
                    onChange={handleItemInputChange}
                    type="number"
                    inputProps={{ min: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddItem}
                    startIcon={<AddCircleIcon />}
                    disabled={!itemInput.PartNo || !itemInput.Quantity}
                    sx={{ height: 56 }}
                  >
                    Add
                  </Button>
                </Stack>
                {itemInput.PartName && (
                  <Typography variant="caption" color="textSecondary">
                    Selected: {itemInput.PartName}
                  </Typography>
                )}
              </Stack>
            </Paper>

            {/* Items Table with Processes */}
            {formData.Items.length > 0 ? (
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr. No</TableCell>
                      <TableCell>Part No</TableCell>
                      <TableCell>Part Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Processes</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.Items.map((item, itemIndex) => (
                      <React.Fragment key={itemIndex}>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                          <TableCell>{itemIndex + 1}</TableCell>
                          <TableCell>
                            <Typography fontWeight={600}>{item.PartNo}</Typography>
                          </TableCell>
                          <TableCell>{item.PartName}</TableCell>
                          <TableCell>{item.Quantity}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip 
                                label={`${item.Processes.length} Process(es)`} 
                                size="small"
                                color={item.Processes.length > 0 ? "primary" : "default"}
                              />
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenProcessDialog(itemIndex)}
                                sx={{ ml: 1 }}
                              >
                                Add Process
                              </Button>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItem(itemIndex)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        
                        {/* Processes Sub-table */}
                        {item.Processes.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={6} sx={{ p: 0, borderBottom: 'none' }}>
                              <Box sx={{ p: 2, bgcolor: '#f1f5f9' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Processes for {item.PartNo}
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Process Name</TableCell>
                                      <TableCell>Rate Type</TableCell>
                                      <TableCell>Vendor/Inhouse</TableCell>
                                      <TableCell align="right">Price (₹)</TableCell>
                                      <TableCell align="right"></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {item.Processes.map((process, processIndex) => (
                                      <TableRow key={processIndex}>
                                        <TableCell>
                                          <Typography variant="body2">
                                            {process.ProcessName || getProcessName(process.ProcessID)}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Chip 
                                            label={process.RateType || 'N/A'} 
                                            size="small"
                                            variant="outlined"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Chip 
                                            label={process.VendorOrInhouse || 'N/A'} 
                                            size="small"
                                            color={process.VendorOrInhouse === 'Vendor' ? 'warning' : 'info'}
                                          />
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography fontWeight={500}>
                                            ₹{process.Price.toFixed(2)}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <IconButton
                                            size="small"
                                            onClick={() => handleRemoveProcessFromItem(itemIndex, processIndex)}
                                            color="error"
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 1 }}>
                No items added yet. Please add items to create quotation.
              </Alert>
            )}
            
            {formData.Items.length > 0 && (
              <Chip
                label={`${formData.Items.length} item(s) added`}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          {/* Remarks */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Remarks
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Internal Remarks"
                name="InternalRemarks"
                value={formData.InternalRemarks}
                onChange={handleFormChange}
                multiline
                rows={2}
                placeholder="Internal notes or instructions..."
              />
              <TextField
                fullWidth
                label="Customer Remarks"
                name="CustomerRemarks"
                value={formData.CustomerRemarks}
                onChange={handleFormChange}
                multiline
                rows={2}
                placeholder="Message for the customer..."
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      {/* Process Selection Dialog */}
      <Dialog open={openProcessDialog} onClose={handleCloseProcessDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Process to Item</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Process *</InputLabel>
              <Select
                name="ProcessID"
                value={currentProcessSelection.ProcessID}
                onChange={handleProcessSelectionChange}
                label="Select Process *"
              >
                <MenuItem value="">
                  <em>Select a process</em>
                </MenuItem>
                {processes.map((process) => (
                  <MenuItem key={process._id} value={process._id}>
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="body2">{process.ProcessName}</Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={process.RateType} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={process.VendorOrInhouse} 
                          size="small"
                          color={process.VendorOrInhouse === 'Vendor' ? 'warning' : 'info'}
                        />
                      </Stack>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Price (₹) *"
              name="Price"
              type="number"
              value={currentProcessSelection.Price}
              onChange={handleProcessSelectionChange}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: '#64748B' }}>₹</Typography>
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProcessDialog}>Cancel</Button>
          <Button 
            onClick={handleAddProcessToItem} 
            variant="contained"
            disabled={!currentProcessSelection.ProcessID || !currentProcessSelection.Price}
          >
            Add Process
          </Button>
        </DialogActions>
      </Dialog>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || downloadInProgress}
          startIcon={!loading && !downloadInProgress && <AddIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' }
          }}
        >
          {loading ? 'Creating...' : downloadInProgress ? 'Downloading...' : 'Create Quotation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuotation;