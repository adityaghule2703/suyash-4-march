// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Paper,
//   Grid,
//   TextField,
//   Typography,
//   Button,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Divider,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   styled,
//   CircularProgress,
//   Chip,
//   Autocomplete,
//   Tooltip,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   Receipt as InvoiceIcon,
//   ShoppingCart as SalesOrderIcon,
//   LocalShipping as DeliveryIcon,
//   AttachMoney as MoneyIcon,
//   Description as RemarksIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC'
//   },
//   border: '#E3E8EF'
// };

// // Modern Stepper Connector
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundColor: COLORS.primary,
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundColor: COLORS.primary,
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 2,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const steps = ['Select Order & Challans', 'Configure Items'];

// const AddInvoice = ({ open, onClose, onSuccess }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});
  
//   // Data fetching states
//   const [salesOrders, setSalesOrders] = useState([]);
//   const [loadingSOs, setLoadingSOs] = useState(false);
  
//   // Selected values
//   const [selectedSO, setSelectedSO] = useState(null);
//   const [deliveryChallans, setDeliveryChallans] = useState([]);
  
//   // Form data
//   const [formData, setFormData] = useState({
//     so_id: '',
//     dc_ids: [],
//     invoice_date: new Date().toISOString().split('T')[0],
//     invoice_type: 'Tax Invoice',
//     items: [],
//     internal_remarks: ''
//   });

//   const invoiceTypes = ['Tax Invoice', 'Bill of Supply', 'Export Invoice', 'Credit Note', 'Debit Note'];

//   // Fetch Sales Orders (without limit parameter)
//   const fetchSalesOrders = useCallback(async () => {
//     try {
//       setLoadingSOs(true);
//       const token = localStorage.getItem('token');
//       // Remove limit parameter to get all sales orders
//       const response = await axios.get(`${BASE_URL}/api/sales-orders`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         // Filter only sales orders that have at least one delivery challan
//         const validSOs = response.data.data.filter(so => 
//           so.delivery_challans && so.delivery_challans.length > 0
//         );
//         setSalesOrders(validSOs);
//         console.log('Sales orders with delivery challans:', validSOs.length);
//       }
//     } catch (err) {
//       console.error('Error fetching sales orders:', err);
//       setError('Failed to load sales orders');
//     } finally {
//       setLoadingSOs(false);
//     }
//   }, []);

//   // Fetch data when dialog opens
//   useEffect(() => {
//     if (open) {
//       fetchSalesOrders();
//     }
//   }, [open, fetchSalesOrders]);

//   // Reset form when dialog closes
//   useEffect(() => {
//     if (!open) {
//       resetForm();
//     }
//   }, [open]);

//   const handleSOChange = (event, newValue) => {
//     setSelectedSO(newValue);
//     setFormData(prev => ({ ...prev, so_id: newValue?._id || '', dc_ids: [], items: [] }));
//     setFieldErrors(prev => ({ ...prev, so_id: '' }));
    
//     // Get all delivery challans for this SO (don't filter by status, show all that have items)
//     const allDCs = newValue?.delivery_challans || [];
    
//     // Filter delivery challans that have items and are not Sales Return type
//     const validDCs = allDCs.filter(dc => 
//       dc.items && dc.items.length > 0 && dc.dc_type !== 'Sales Return'
//     );
    
//     setDeliveryChallans(validDCs);
//     console.log('Delivery challans for selected SO:', validDCs.length);
//   };

//   const handleDCChange = (dcId) => {
//     const updatedDCIds = formData.dc_ids.includes(dcId)
//       ? formData.dc_ids.filter(id => id !== dcId)
//       : [...formData.dc_ids, dcId];
    
//     setFormData(prev => ({ ...prev, dc_ids: updatedDCIds }));
    
//     // Build items from selected delivery challans
//     const selectedDCs = deliveryChallans.filter(dc => updatedDCIds.includes(dc._id));
//     const allItems = [];
    
//     selectedDCs.forEach(dc => {
//       dc.items?.forEach(item => {
//         // Find matching item in SO items to get more details
//         const soItem = selectedSO?.items?.find(i => i._id === item.so_item_id || i.part_no === item.part_no);
//         allItems.push({
//           part_no: item.part_no,
//           part_name: item.part_name,
//           hsn_code: item.hsn_code,
//           unit: item.unit,
//           dispatched_qty: item.dispatch_qty,
//           unit_price: item.unit_price,
//           discount_percent: 0,
//           gst_percentage: soItem?.gst_percentage || 18
//         });
//       });
//     });
    
//     setFormData(prev => ({ ...prev, items: allItems }));
//     setFieldErrors(prev => ({ ...prev, dc_ids: '' }));
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...formData.items];
//     updatedItems[index][field] = parseFloat(value) || 0;
//     setFormData(prev => ({ ...prev, items: updatedItems }));
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0:
//         if (!formData.so_id) {
//           errors.so_id = 'Please select a Sales Order';
//           isValid = false;
//         }
//         if (formData.dc_ids.length === 0) {
//           errors.dc_ids = 'Please select at least one Delivery Challan';
//           isValid = false;
//         }
//         if (!formData.invoice_date) {
//           errors.invoice_date = 'Please select invoice date';
//           isValid = false;
//         }
//         break;
      
//       case 1:
//         if (formData.items.length === 0) {
//           errors.items = 'No items found in selected delivery challans';
//           isValid = false;
//         }
//         break;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fix the errors in this section');
//     }
//     return isValid;
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setError('');
//       setActiveStep((prevStep) => prevStep + 1);
//     }
//   };

//   const handleBack = () => {
//     setError('');
//     setActiveStep((prevStep) => prevStep - 1);
//   };

//   const handleSubmit = async () => {
//     if (formData.items.length === 0) {
//       setError('No items to create invoice');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const payload = {
//         so_id: formData.so_id,
//         dc_ids: formData.dc_ids,
//         invoice_date: formData.invoice_date,
//         invoice_type: formData.invoice_type,
//         internal_remarks: formData.internal_remarks,
//         items: formData.items.map(item => ({
//           part_no: item.part_no,
//           part_name: item.part_name,
//           hsn_code: item.hsn_code,
//           unit: item.unit,
//           dispatched_qty: item.dispatched_qty,
//           unit_price: item.unit_price,
//           discount_percent: item.discount_percent,
//           gst_percentage: item.gst_percentage
//         }))
//       };
      
//       const response = await axios.post(`${BASE_URL}/api/invoices`, payload, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.data.success) {
//         onSuccess();
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to create invoice');
//       }
//     } catch (err) {
//       console.error('Error creating invoice:', err);
//       setError(err.response?.data?.message || 'Failed to create invoice. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setActiveStep(0);
//     setSelectedSO(null);
//     setDeliveryChallans([]);
//     setFormData({
//       so_id: '',
//       dc_ids: [],
//       invoice_date: new Date().toISOString().split('T')[0],
//       invoice_type: 'Tax Invoice',
//       items: [],
//       internal_remarks: ''
//     });
//     setFieldErrors({});
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const calculateItemTotal = (item) => {
//     const amount = item.dispatched_qty * item.unit_price;
//     const discountAmount = amount * (item.discount_percent / 100);
//     const taxableAmount = amount - discountAmount;
//     const gstAmount = taxableAmount * (item.gst_percentage / 100);
//     return taxableAmount + gstAmount;
//   };

//   const calculateGrandTotal = () => {
//     return formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
//   };

//   // Get status color for delivery challan
//   const getDCStatusColor = (status) => {
//     const colors = {
//       'Planned': { bg: '#F1F5F9', color: '#475569' },
//       'Packed': { bg: '#FEF3C7', color: '#B45309' },
//       'EWB Generated': { bg: '#E0F2FE', color: '#0369A1' },
//       'Dispatched': { bg: '#D1FAE5', color: '#065F46' },
//       'Delivered': { bg: '#D1FAE5', color: '#065F46' },
//       'Rejected by Customer': { bg: '#FEE2E2', color: '#991B1B' }
//     };
//     return colors[status] || { bg: '#F1F5F9', color: '#475569' };
//   };

//   // Render Step Content
//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <SalesOrderIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Sales Order Selection
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Sales Order <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       fullWidth
//                       options={salesOrders}
//                       getOptionLabel={(option) => `${option.so_number} - ${option.customer_name} (₹${option.grand_total?.toLocaleString()})`}
//                       value={selectedSO}
//                       onChange={handleSOChange}
//                       loading={loadingSOs}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           size="small"
//                           placeholder="Search and select sales order"
//                           error={!!fieldErrors.so_id}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': {
//                               py: 1,
//                               px: 1.5,
//                               fontSize: '0.75rem'
//                             }
//                           }}
//                         />
//                       )}
//                     />
//                     {fieldErrors.so_id && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.so_id}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Invoice Date <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       type="date"
//                       size="small"
//                       value={formData.invoice_date}
//                       onChange={(e) => {
//                         setFormData(prev => ({ ...prev, invoice_date: e.target.value }));
//                         setFieldErrors(prev => ({ ...prev, invoice_date: '' }));
//                       }}
//                       error={!!fieldErrors.invoice_date}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                     {fieldErrors.invoice_date && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.invoice_date}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Invoice Type
//                     </Typography>
//                     <FormControl fullWidth size="small">
//                       <Select
//                         value={formData.invoice_type}
//                         onChange={(e) => setFormData(prev => ({ ...prev, invoice_type: e.target.value }))}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5 }
//                         }}
//                       >
//                         {invoiceTypes.map(type => (
//                           <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>
//                             {type}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>

//                 {selectedSO && (
//                   <Grid size={{ xs: 12 }}>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                         Delivery Challans <span style={{ color: '#EF4444' }}>*</span>
//                       </Typography>
//                       <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, maxHeight: 250, overflowY: 'auto' }}>
//                         {deliveryChallans.length === 0 ? (
//                           <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, textAlign: 'center', py: 2 }}>
//                             No delivery challans found for this sales order
//                           </Typography>
//                         ) : (
//                           deliveryChallans.map(dc => {
//                             const statusColor = getDCStatusColor(dc.status);
//                             return (
//                               <Paper
//                                 key={dc._id}
//                                 onClick={() => handleDCChange(dc._id)}
//                                 sx={{
//                                   p: 1,
//                                   mb: 1,
//                                   borderRadius: 1,
//                                   border: `1px solid ${formData.dc_ids.includes(dc._id) ? COLORS.primary : COLORS.border}`,
//                                   bgcolor: formData.dc_ids.includes(dc._id) ? `${COLORS.primary}10` : COLORS.background.white,
//                                   cursor: 'pointer',
//                                   transition: 'all 0.2s',
//                                   '&:hover': {
//                                     borderColor: COLORS.primary,
//                                     bgcolor: `${COLORS.primary}05`
//                                   }
//                                 }}
//                               >
//                                 <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
//                                   <Box>
//                                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
//                                       {dc.dc_number}
//                                     </Typography>
//                                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
//                                       Date: {new Date(dc.dc_date).toLocaleDateString()}
//                                     </Typography>
//                                   </Box>
//                                   <Stack direction="row" alignItems="center" spacing={1}>
//                                     <Chip
//                                       label={dc.items?.length || 0}
//                                       size="small"
//                                       sx={{
//                                         height: 20,
//                                         fontSize: '0.6rem',
//                                         bgcolor: COLORS.primaryLight,
//                                         color: COLORS.primary
//                                       }}
//                                     />
//                                     <Chip
//                                       label={dc.status}
//                                       size="small"
//                                       sx={{
//                                         height: 20,
//                                         fontSize: '0.6rem',
//                                         bgcolor: statusColor.bg,
//                                         color: statusColor.color
//                                       }}
//                                     />
//                                   </Stack>
//                                 </Stack>
//                               </Paper>
//                             );
//                           })
//                         )}
//                       </Paper>
//                       {fieldErrors.dc_ids && (
//                         <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                           {fieldErrors.dc_ids}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Grid>
//                 )}

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       <RemarksIcon sx={{ fontSize: '0.8rem', mr: 0.5, verticalAlign: 'middle' }} />
//                       Internal Remarks
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       multiline
//                       rows={3}
//                       size="small"
//                       value={formData.internal_remarks}
//                       onChange={(e) => setFormData(prev => ({ ...prev, internal_remarks: e.target.value }))}
//                       placeholder="Any internal notes about this invoice..."
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <MoneyIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Invoice Items Configuration
//               </Typography>
              
//               {formData.items.length === 0 ? (
//                 <Box sx={{ textAlign: 'center', py: 4 }}>
//                   <InvoiceIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
//                   <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//                     No items found. Please go back and select delivery challans.
//                   </Typography>
//                 </Box>
//               ) : (
//                 <>
//                   <TableContainer sx={{ maxHeight: 400 }}>
//                     <Table size="small" stickyHeader>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Part No</TableCell>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Part Name</TableCell>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>HSN</TableCell>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Unit</TableCell>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Qty</TableCell>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Unit Price</TableCell>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Disc %</TableCell>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>GST %</TableCell>
//                           <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Amount</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {formData.items.map((item, index) => (
//                           <TableRow key={index} hover>
//                             <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
//                             <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name}</TableCell>
//                             <TableCell sx={{ fontSize: '0.7rem' }}>{item.hsn_code}</TableCell>
//                             <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit}</TableCell>
//                             <TableCell sx={{ fontSize: '0.7rem' }}>{item.dispatched_qty}</TableCell>
//                             <TableCell sx={{ fontSize: '0.7rem' }}>₹{item.unit_price?.toLocaleString()}</TableCell>
//                             <TableCell sx={{ width: 80 }}>
//                               <TextField
//                                 type="number"
//                                 size="small"
//                                 value={item.discount_percent}
//                                 onChange={(e) => handleItemChange(index, 'discount_percent', e.target.value)}
//                                 sx={{
//                                   width: 70,
//                                   '& .MuiOutlinedInput-root': {
//                                     borderRadius: 1,
//                                     fontSize: '0.7rem'
//                                   },
//                                   '& .MuiInputBase-input': {
//                                     py: 0.5,
//                                     px: 1,
//                                     fontSize: '0.7rem'
//                                   }
//                                 }}
//                               />
//                             </TableCell>
//                             <TableCell sx={{ width: 80 }}>
//                               <TextField
//                                 type="number"
//                                 size="small"
//                                 value={item.gst_percentage}
//                                 onChange={(e) => handleItemChange(index, 'gst_percentage', e.target.value)}
//                                 sx={{
//                                   width: 70,
//                                   '& .MuiOutlinedInput-root': {
//                                     borderRadius: 1,
//                                     fontSize: '0.7rem'
//                                   },
//                                   '& .MuiInputBase-input': {
//                                     py: 0.5,
//                                     px: 1,
//                                     fontSize: '0.7rem'
//                                   }
//                                 }}
//                               />
//                             </TableCell>
//                             <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
//                               ₹{calculateItemTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
                  
//                   <Divider sx={{ my: 1.5 }} />
                  
//                   <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                     <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, minWidth: 200 }}>
//                       <Stack direction="row" justifyContent="space-between" alignItems="center">
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           Grand Total:
//                         </Typography>
//                         <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
//                           ₹{calculateGrandTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                         </Typography>
//                       </Stack>
//                     </Paper>
//                   </Box>
//                 </>
//               )}
              
//               {fieldErrors.items && (
//                 <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
//                   {fieldErrors.items}
//                 </Typography>
//               )}
//             </Paper>
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="lg"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         bgcolor: COLORS.background.white
//       }}>
//         <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//           Create New Invoice
//         </Typography>
//       </DialogTitle>

//       {/* Stepper */}
//       <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
//         <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
//                   {label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//         {renderStepContent(activeStep)}
        
//         {error && (
//           <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
//             {error}
//           </Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleBack}
//           disabled={activeStep === 0 || loading}
//           startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: COLORS.primary,
//               bgcolor: `${COLORS.primary}10`
//             }
//           }}
//         >
//           Back
//         </Button>
//         <Box>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             sx={{
//               height: 32,
//               px: 2,
//               mr: 1,
//               borderRadius: 1.5,
//               border: `1px solid ${COLORS.border}`,
//               color: COLORS.text.secondary,
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               textTransform: 'none',
//               '&:hover': {
//                 borderColor: COLORS.primary,
//                 bgcolor: `${COLORS.primary}10`
//               }
//             }}
//           >
//             Cancel
//           </Button>
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading || formData.items.length === 0}
//               startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': {
//                   bgcolor: COLORS.primaryDark,
//                 }
//               }}
//             >
//               {loading ? 'Creating...' : 'Create Invoice'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading || !formData.so_id || formData.dc_ids.length === 0}
//               endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': {
//                   bgcolor: COLORS.primaryDark,
//                 }
//               }}
//             >
//               Next
//             </Button>
//           )}
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddInvoice;




import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  CircularProgress,
  Chip,
  Autocomplete,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Receipt as InvoiceIcon,
  ShoppingCart as SalesOrderIcon,
  LocalShipping as DeliveryIcon,
  AttachMoney as MoneyIcon,
  Description as RemarksIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

// Modern Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ['Select Order & Challans', 'Configure Items'];

const AddInvoice = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data fetching states
  const [salesOrders, setSalesOrders] = useState([]);
  const [loadingSOs, setLoadingSOs] = useState(false);
  
  // Selected values
  const [selectedSO, setSelectedSO] = useState(null);
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    so_id: '',
    dc_ids: [],
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_type: 'Tax Invoice',
    items: [],
    internal_remarks: ''
  });

  const invoiceTypes = ['Tax Invoice', 'Bill of Supply', 'Export Invoice', 'Credit Note', 'Debit Note'];

  // Fetch Sales Orders - removed filter to get ALL sales orders
  const fetchSalesOrders = useCallback(async () => {
    try {
      setLoadingSOs(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/sales-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // REMOVED: Filter that only showed sales orders with delivery challans
        // Now showing ALL sales orders
        setSalesOrders(response.data.data);
        console.log('All sales orders fetched:', response.data.data.length);
      }
    } catch (err) {
      console.error('Error fetching sales orders:', err);
      setError('Failed to load sales orders');
    } finally {
      setLoadingSOs(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchSalesOrders();
    }
  }, [open, fetchSalesOrders]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleSOChange = (event, newValue) => {
    setSelectedSO(newValue);
    setFormData(prev => ({ ...prev, so_id: newValue?._id || '', dc_ids: [], items: [] }));
    setFieldErrors(prev => ({ ...prev, so_id: '' }));
    
    // Get all delivery challans for this SO (don't filter by status, show all that have items)
    const allDCs = newValue?.delivery_challans || [];
    
    // Filter delivery challans that have items and are not Sales Return type
    const validDCs = allDCs.filter(dc => 
      dc.items && dc.items.length > 0 && dc.dc_type !== 'Sales Return'
    );
    
    setDeliveryChallans(validDCs);
    console.log('Delivery challans for selected SO:', validDCs.length);
  };

  const handleDCChange = (dcId) => {
    const updatedDCIds = formData.dc_ids.includes(dcId)
      ? formData.dc_ids.filter(id => id !== dcId)
      : [...formData.dc_ids, dcId];
    
    setFormData(prev => ({ ...prev, dc_ids: updatedDCIds }));
    
    // Build items from selected delivery challans
    const selectedDCs = deliveryChallans.filter(dc => updatedDCIds.includes(dc._id));
    const allItems = [];
    
    selectedDCs.forEach(dc => {
      dc.items?.forEach(item => {
        // Find matching item in SO items to get more details
        const soItem = selectedSO?.items?.find(i => i._id === item.so_item_id || i.part_no === item.part_no);
        allItems.push({
          part_no: item.part_no,
          part_name: item.part_name,
          hsn_code: item.hsn_code,
          unit: item.unit,
          dispatched_qty: item.dispatch_qty,
          unit_price: item.unit_price,
          discount_percent: 0,
          gst_percentage: soItem?.gst_percentage || 18
        });
      });
    });
    
    setFormData(prev => ({ ...prev, items: allItems }));
    setFieldErrors(prev => ({ ...prev, dc_ids: '' }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.so_id) {
          errors.so_id = 'Please select a Sales Order';
          isValid = false;
        }
        if (formData.dc_ids.length === 0) {
          errors.dc_ids = 'Please select at least one Delivery Challan';
          isValid = false;
        }
        if (!formData.invoice_date) {
          errors.invoice_date = 'Please select invoice date';
          isValid = false;
        }
        break;
      
      case 1:
        if (formData.items.length === 0) {
          errors.items = 'No items found in selected delivery challans';
          isValid = false;
        }
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (formData.items.length === 0) {
      setError('No items to create invoice');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        so_id: formData.so_id,
        dc_ids: formData.dc_ids,
        invoice_date: formData.invoice_date,
        invoice_type: formData.invoice_type,
        internal_remarks: formData.internal_remarks,
        items: formData.items.map(item => ({
          part_no: item.part_no,
          part_name: item.part_name,
          hsn_code: item.hsn_code,
          unit: item.unit,
          dispatched_qty: item.dispatched_qty,
          unit_price: item.unit_price,
          discount_percent: item.discount_percent,
          gst_percentage: item.gst_percentage
        }))
      };
      
      const response = await axios.post(`${BASE_URL}/api/invoices`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        onSuccess();
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create invoice');
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(err.response?.data?.message || 'Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedSO(null);
    setDeliveryChallans([]);
    setFormData({
      so_id: '',
      dc_ids: [],
      invoice_date: new Date().toISOString().split('T')[0],
      invoice_type: 'Tax Invoice',
      items: [],
      internal_remarks: ''
    });
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const calculateItemTotal = (item) => {
    const amount = item.dispatched_qty * item.unit_price;
    const discountAmount = amount * (item.discount_percent / 100);
    const taxableAmount = amount - discountAmount;
    const gstAmount = taxableAmount * (item.gst_percentage / 100);
    return taxableAmount + gstAmount;
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  // Get status color for delivery challan
  const getDCStatusColor = (status) => {
    const colors = {
      'Planned': { bg: '#F1F5F9', color: '#475569' },
      'Packed': { bg: '#FEF3C7', color: '#B45309' },
      'EWB Generated': { bg: '#E0F2FE', color: '#0369A1' },
      'Dispatched': { bg: '#D1FAE5', color: '#065F46' },
      'Delivered': { bg: '#D1FAE5', color: '#065F46' },
      'Rejected by Customer': { bg: '#FEE2E2', color: '#991B1B' }
    };
    return colors[status] || { bg: '#F1F5F9', color: '#475569' };
  };

  // Render Step Content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <SalesOrderIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Sales Order Selection
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Sales Order <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={salesOrders}
                      getOptionLabel={(option) => `${option.so_number} - ${option.customer_name} (₹${option.grand_total?.toLocaleString()})`}
                      value={selectedSO}
                      onChange={handleSOChange}
                      loading={loadingSOs}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search and select sales order"
                          error={!!fieldErrors.so_id}
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
                      )}
                    />
                    {fieldErrors.so_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.so_id}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Invoice Date <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      value={formData.invoice_date}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, invoice_date: e.target.value }));
                        setFieldErrors(prev => ({ ...prev, invoice_date: '' }));
                      }}
                      error={!!fieldErrors.invoice_date}
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
                    {fieldErrors.invoice_date && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.invoice_date}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Invoice Type
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.invoice_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, invoice_type: e.target.value }))}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {invoiceTypes.map(type => (
                          <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                {selectedSO && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Delivery Challans <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, maxHeight: 250, overflowY: 'auto' }}>
                        {deliveryChallans.length === 0 ? (
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, textAlign: 'center', py: 2 }}>
                            No delivery challans found for this sales order
                          </Typography>
                        ) : (
                          deliveryChallans.map(dc => {
                            const statusColor = getDCStatusColor(dc.status);
                            return (
                              <Paper
                                key={dc._id}
                                onClick={() => handleDCChange(dc._id)}
                                sx={{
                                  p: 1,
                                  mb: 1,
                                  borderRadius: 1,
                                  border: `1px solid ${formData.dc_ids.includes(dc._id) ? COLORS.primary : COLORS.border}`,
                                  bgcolor: formData.dc_ids.includes(dc._id) ? `${COLORS.primary}10` : COLORS.background.white,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    borderColor: COLORS.primary,
                                    bgcolor: `${COLORS.primary}05`
                                  }
                                }}
                              >
                                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                                  <Box>
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                                      {dc.dc_number}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                      Date: {new Date(dc.dc_date).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <Chip
                                      label={dc.items?.length || 0}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: '0.6rem',
                                        bgcolor: COLORS.primaryLight,
                                        color: COLORS.primary
                                      }}
                                    />
                                    <Chip
                                      label={dc.status}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: '0.6rem',
                                        bgcolor: statusColor.bg,
                                        color: statusColor.color
                                      }}
                                    />
                                  </Stack>
                                </Stack>
                              </Paper>
                            );
                          })
                        )}
                      </Paper>
                      {fieldErrors.dc_ids && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.dc_ids}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      <RemarksIcon sx={{ fontSize: '0.8rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Internal Remarks
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      value={formData.internal_remarks}
                      onChange={(e) => setFormData(prev => ({ ...prev, internal_remarks: e.target.value }))}
                      placeholder="Any internal notes about this invoice..."
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
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <MoneyIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Invoice Items Configuration
              </Typography>
              
              {formData.items.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <InvoiceIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    No items found. Please go back and select delivery challans.
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Part No</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Part Name</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>HSN</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Unit</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Qty</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Unit Price</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Disc %</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>GST %</TableCell>
                          <TableCell sx={{ bgcolor: COLORS.primaryLight, fontWeight: 600, fontSize: '0.7rem' }}>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.items.map((item, index) => (
                          <TableRow key={index} hover>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.hsn_code}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.dispatched_qty}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>₹{item.unit_price?.toLocaleString()}</TableCell>
                            <TableCell sx={{ width: 80 }}>
                              <TextField
                                type="number"
                                size="small"
                                value={item.discount_percent}
                                onChange={(e) => handleItemChange(index, 'discount_percent', e.target.value)}
                                sx={{
                                  width: 70,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                    fontSize: '0.7rem'
                                  },
                                  '& .MuiInputBase-input': {
                                    py: 0.5,
                                    px: 1,
                                    fontSize: '0.7rem'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ width: 80 }}>
                              <TextField
                                type="number"
                                size="small"
                                value={item.gst_percentage}
                                onChange={(e) => handleItemChange(index, 'gst_percentage', e.target.value)}
                                sx={{
                                  width: 70,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                    fontSize: '0.7rem'
                                  },
                                  '& .MuiInputBase-input': {
                                    py: 0.5,
                                    px: 1,
                                    fontSize: '0.7rem'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                              ₹{calculateItemTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, minWidth: 200 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Grand Total:
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                          ₹{calculateGrandTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                </>
              )}
              
              {fieldErrors.items && (
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
                  {fieldErrors.items}
                </Typography>
              )}
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Create New Invoice
        </Typography>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
            {error}
          </Alert>
        )}
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
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
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
            onClick={handleClose}
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
              onClick={handleSubmit}
              disabled={loading || formData.items.length === 0}
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
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
              {loading ? 'Creating...' : 'Create Invoice'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || !formData.so_id || formData.dc_ids.length === 0}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
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

export default AddInvoice;