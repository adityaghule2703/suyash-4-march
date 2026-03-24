import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
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
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Chip,
  InputAdornment,
  CircularProgress,
  Divider,
  IconButton,
  Checkbox,
  FormControlLabel,
  styled
} from '@mui/material';
import { 
  Add as AddIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  LocalShipping as LocalShippingIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching other components
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
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ['Select PO & GRN', 'Invoice Details', 'Items & TDS'];

// TDS Sections (from schema enum)
const tdsSections = ['194C', '194Q', '194J', '194I', '194H'];

// GST Types (from schema)
const gstTypes = ['CGST/SGST', 'IGST'];

const AddPurchaseInvoice = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pos, setPos] = useState([]);
  const [loadingPos, setLoadingPos] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [grns, setGrns] = useState([]);
  const [loadingGrns, setLoadingGrns] = useState(false);
  const [selectedGrns, setSelectedGrns] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [formData, setFormData] = useState({
    po_id: '',
    grn_ids: [],
    vendor_invoice_no: '',
    vendor_invoice_date: '',
    invoice_date: '',
    items: [],
    tds_applicable: false,
    tds_section: '',
    tds_rate: '',
    due_date: '',
    internal_remarks: '',
    gst_type: 'CGST/SGST'
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [autoFilledFromGRN, setAutoFilledFromGRN] = useState(false);
  const [autoFilledFromPO, setAutoFilledFromPO] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEligiblePOs();
      resetForm();
    }
  }, [open]);

  const fetchEligiblePOs = async () => {
    try {
      setLoadingPos(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/purchase-orders?page=1&limit=100&sort_by=createdAt&sort_order=desc`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const eligiblePos = response.data.data.filter(po => 
          po.status === 'Fully Received' || po.status === 'Partially Received'
        );
        setPos(eligiblePos);
      }
    } catch (err) {
      console.error('Error fetching POs:', err);
    } finally {
      setLoadingPos(false);
    }
  };

  const fetchGRNsForPO = async (poId) => {
    try {
      setLoadingGrns(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/grns?page=1&limit=100&sort_by=createdAt&sort_order=desc`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const poGrns = response.data.data.filter(grn => grn.po_id?._id === poId);
        setGrns(poGrns);
        
        if (poGrns.length > 0) {
          setSelectedGrns(poGrns);
          setFormData(prev => ({ ...prev, grn_ids: poGrns.map(g => g._id) }));
          
          const items = [];
          poGrns.forEach(grn => {
            grn.items.forEach(item => {
              if (item.accepted_qty > 0) {
                const poItem = selectedPO?.items?.find(pi => pi._id === item.po_item_id);
                const unitPrice = poItem?.unit_price || 0;
                const gstPercent = poItem?.gst_percent || 18;
                
                // Calculate GST breakdown based on GST type
                const isIGST = formData.gst_type === 'IGST';
                const cgstPercent = isIGST ? 0 : gstPercent / 2;
                const sgstPercent = isIGST ? 0 : gstPercent / 2;
                const igstPercent = isIGST ? gstPercent : 0;
                
                const taxableAmount = unitPrice * item.accepted_qty;
                const cgstAmount = (taxableAmount * cgstPercent) / 100;
                const sgstAmount = (taxableAmount * sgstPercent) / 100;
                const igstAmount = (taxableAmount * igstPercent) / 100;
                const totalGstAmount = cgstAmount + sgstAmount + igstAmount;
                
                items.push({
                  po_item_id: item.po_item_id,
                  grn_item_id: item._id,
                  item_id: item.item_id,
                  part_no: item.part_no,
                  description: item.description,
                  hsn_code: item.hsn_code || '',
                  quantity: item.accepted_qty,
                  unit: item.unit,
                  unit_price: unitPrice,
                  po_unit_price: poItem?.unit_price,
                  taxable_amount: taxableAmount,
                  gst_percent: gstPercent,
                  cgst_percent: cgstPercent,
                  sgst_percent: sgstPercent,
                  igst_percent: igstPercent,
                  cgst_amount: cgstAmount,
                  sgst_amount: sgstAmount,
                  igst_amount: igstAmount,
                  total_gst_amount: totalGstAmount,
                  total_amount: taxableAmount + totalGstAmount,
                  discount_percent: 0,
                  discount_amount: 0
                });
              }
            });
          });
          setInvoiceItems(items);
          setFormData(prev => ({ ...prev, items: items }));
          setAutoFilledFromPO(true);
          
          const firstGRN = poGrns[0];
          if (firstGRN) {
            const vendorInvoiceNo = firstGRN.vendor_invoice_no || '';
            const vendorInvoiceDate = firstGRN.vendor_invoice_date ? 
              new Date(firstGRN.vendor_invoice_date).toISOString().split('T')[0] : '';
            
            setFormData(prev => ({
              ...prev,
              vendor_invoice_no: vendorInvoiceNo,
              vendor_invoice_date: vendorInvoiceDate
            }));
            
            setAutoFilledFromGRN(!!vendorInvoiceNo);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching GRNs:', err);
    } finally {
      setLoadingGrns(false);
    }
  };

  const handlePOChange = async (event, value) => {
    setSelectedPO(value);
    setFormData(prev => ({ ...prev, po_id: value?._id || '', grn_ids: [], items: [] }));
    setSelectedGrns([]);
    setInvoiceItems([]);
    setAutoFilledFromGRN(false);
    setAutoFilledFromPO(false);
    setFieldErrors(prev => ({ ...prev, po_id: '' }));
    
    if (value) {
      await fetchGRNsForPO(value._id);
    }
  };

  const handleGRNChange = (event, values) => {
    setSelectedGrns(values);
    setFormData(prev => ({ ...prev, grn_ids: values.map(v => v._id) }));
    
    const items = [];
    values.forEach(grn => {
      grn.items.forEach(item => {
        if (item.accepted_qty > 0) {
          const poItem = selectedPO?.items?.find(pi => pi._id === item.po_item_id);
          const unitPrice = poItem?.unit_price || 0;
          const gstPercent = poItem?.gst_percent || 18;
          
          const isIGST = formData.gst_type === 'IGST';
          const cgstPercent = isIGST ? 0 : gstPercent / 2;
          const sgstPercent = isIGST ? 0 : gstPercent / 2;
          const igstPercent = isIGST ? gstPercent : 0;
          
          const taxableAmount = unitPrice * item.accepted_qty;
          const cgstAmount = (taxableAmount * cgstPercent) / 100;
          const sgstAmount = (taxableAmount * sgstPercent) / 100;
          const igstAmount = (taxableAmount * igstPercent) / 100;
          const totalGstAmount = cgstAmount + sgstAmount + igstAmount;
          
          items.push({
            po_item_id: item.po_item_id,
            grn_item_id: item._id,
            item_id: item.item_id,
            part_no: item.part_no,
            description: item.description,
            hsn_code: item.hsn_code || '',
            quantity: item.accepted_qty,
            unit: item.unit,
            unit_price: unitPrice,
            po_unit_price: poItem?.unit_price,
            taxable_amount: taxableAmount,
            gst_percent: gstPercent,
            cgst_percent: cgstPercent,
            sgst_percent: sgstPercent,
            igst_percent: igstPercent,
            cgst_amount: cgstAmount,
            sgst_amount: sgstAmount,
            igst_amount: igstAmount,
            total_gst_amount: totalGstAmount,
            total_amount: taxableAmount + totalGstAmount,
            discount_percent: 0,
            discount_amount: 0
          });
        }
      });
    });
    setInvoiceItems(items);
    setFormData(prev => ({ ...prev, items: items }));
    setAutoFilledFromPO(true);
    
    const firstGRN = values[0];
    if (firstGRN) {
      const vendorInvoiceNo = firstGRN.vendor_invoice_no || '';
      const vendorInvoiceDate = firstGRN.vendor_invoice_date ? 
        new Date(firstGRN.vendor_invoice_date).toISOString().split('T')[0] : '';
      
      setFormData(prev => ({
        ...prev,
        vendor_invoice_no: vendorInvoiceNo,
        vendor_invoice_date: vendorInvoiceDate
      }));
      
      setAutoFilledFromGRN(!!vendorInvoiceNo);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    
    if (name === 'vendor_invoice_no' || name === 'vendor_invoice_date') {
      setAutoFilledFromGRN(false);
    }
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'gst_type') {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Recalculate GST for all items when GST type changes
      recalculateGSTForItems(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const recalculateGSTForItems = (gstType) => {
    const updatedItems = invoiceItems.map(item => {
      const isIGST = gstType === 'IGST';
      const cgstPercent = isIGST ? 0 : item.gst_percent / 2;
      const sgstPercent = isIGST ? 0 : item.gst_percent / 2;
      const igstPercent = isIGST ? item.gst_percent : 0;
      
      const cgstAmount = (item.taxable_amount * cgstPercent) / 100;
      const sgstAmount = (item.taxable_amount * sgstPercent) / 100;
      const igstAmount = (item.taxable_amount * igstPercent) / 100;
      const totalGstAmount = cgstAmount + sgstAmount + igstAmount;
      
      return {
        ...item,
        cgst_percent: cgstPercent,
        sgst_percent: sgstPercent,
        igst_percent: igstPercent,
        cgst_amount: cgstAmount,
        sgst_amount: sgstAmount,
        igst_amount: igstAmount,
        total_gst_amount: totalGstAmount,
        total_amount: item.taxable_amount + totalGstAmount
      };
    });
    setInvoiceItems(updatedItems);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    const numValue = parseFloat(value) || 0;
    updatedItems[index][field] = numValue;
    
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? numValue : updatedItems[index].quantity;
      const unitPrice = field === 'unit_price' ? numValue : updatedItems[index].unit_price;
      updatedItems[index].taxable_amount = quantity * unitPrice;
      
      const isIGST = formData.gst_type === 'IGST';
      const gstPercent = updatedItems[index].gst_percent;
      const cgstPercent = isIGST ? 0 : gstPercent / 2;
      const sgstPercent = isIGST ? 0 : gstPercent / 2;
      const igstPercent = isIGST ? gstPercent : 0;
      
      updatedItems[index].cgst_amount = (updatedItems[index].taxable_amount * cgstPercent) / 100;
      updatedItems[index].sgst_amount = (updatedItems[index].taxable_amount * sgstPercent) / 100;
      updatedItems[index].igst_amount = (updatedItems[index].taxable_amount * igstPercent) / 100;
      updatedItems[index].total_gst_amount = updatedItems[index].cgst_amount + updatedItems[index].sgst_amount + updatedItems[index].igst_amount;
      updatedItems[index].total_amount = updatedItems[index].taxable_amount + updatedItems[index].total_gst_amount;
    }
    
    if (field === 'gst_percent') {
      const isIGST = formData.gst_type === 'IGST';
      const cgstPercent = isIGST ? 0 : numValue / 2;
      const sgstPercent = isIGST ? 0 : numValue / 2;
      const igstPercent = isIGST ? numValue : 0;
      
      updatedItems[index].cgst_percent = cgstPercent;
      updatedItems[index].sgst_percent = sgstPercent;
      updatedItems[index].igst_percent = igstPercent;
      updatedItems[index].cgst_amount = (updatedItems[index].taxable_amount * cgstPercent) / 100;
      updatedItems[index].sgst_amount = (updatedItems[index].taxable_amount * sgstPercent) / 100;
      updatedItems[index].igst_amount = (updatedItems[index].taxable_amount * igstPercent) / 100;
      updatedItems[index].total_gst_amount = updatedItems[index].cgst_amount + updatedItems[index].sgst_amount + updatedItems[index].igst_amount;
      updatedItems[index].total_amount = updatedItems[index].taxable_amount + updatedItems[index].total_gst_amount;
    }
    
    if (field === 'unit_price') {
      setAutoFilledFromPO(false);
    }
    
    setInvoiceItems(updatedItems);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const removeItem = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Select PO & GRN
        if (!formData.po_id) {
          errors.po_id = 'Purchase Order is required';
          isValid = false;
        }
        if (formData.grn_ids.length === 0) {
          errors.grn_ids = 'At least one GRN is required';
          isValid = false;
        }
        break;
      
      case 1: // Invoice Details
        if (!formData.vendor_invoice_no) {
          errors.vendor_invoice_no = 'Vendor invoice number is required';
          isValid = false;
        }
        if (!formData.vendor_invoice_date) {
          errors.vendor_invoice_date = 'Vendor invoice date is required';
          isValid = false;
        }
        if (!formData.invoice_date) {
          errors.invoice_date = 'Invoice date is required';
          isValid = false;
        }
        if (!formData.due_date) {
          errors.due_date = 'Due date is required';
          isValid = false;
        }
        if (!formData.gst_type) {
          errors.gst_type = 'GST type is required';
          isValid = false;
        }
        break;
      
      case 2: // Items & TDS
        if (invoiceItems.length === 0) {
          errors.items = 'At least one item is required';
          isValid = false;
        }
        
        invoiceItems.forEach((item, idx) => {
          if (!item.quantity || item.quantity <= 0) {
            errors[`item_${idx}_quantity`] = 'Quantity is required';
            isValid = false;
          }
          if (!item.unit_price || item.unit_price <= 0) {
            errors[`item_${idx}_unit_price`] = 'Unit price is required';
            isValid = false;
          }
          if (!item.gst_percent) {
            errors[`item_${idx}_gst_percent`] = 'GST percent is required';
            isValid = false;
          }
        });
        
        if (formData.tds_applicable) {
          if (!formData.tds_section) {
            errors.tds_section = 'TDS section is required';
            isValid = false;
          }
          if (!formData.tds_rate || formData.tds_rate <= 0) {
            errors.tds_rate = 'TDS rate is required';
            isValid = false;
          }
        }
        break;
      
      default:
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const validateAllFields = () => {
    let isValid = true;
    const errors = {};
    
    if (!formData.po_id) {
      errors.po_id = 'Purchase Order is required';
      isValid = false;
    }
    if (formData.grn_ids.length === 0) {
      errors.grn_ids = 'At least one GRN is required';
      isValid = false;
    }
    if (!formData.vendor_invoice_no) {
      errors.vendor_invoice_no = 'Vendor invoice number is required';
      isValid = false;
    }
    if (!formData.vendor_invoice_date) {
      errors.vendor_invoice_date = 'Vendor invoice date is required';
      isValid = false;
    }
    if (!formData.invoice_date) {
      errors.invoice_date = 'Invoice date is required';
      isValid = false;
    }
    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
      isValid = false;
    }
    if (invoiceItems.length === 0) {
      errors.items = 'At least one item is required';
      isValid = false;
    }
    if (formData.tds_applicable) {
      if (!formData.tds_section) {
        errors.tds_section = 'TDS section is required';
        isValid = false;
      }
      if (!formData.tds_rate) {
        errors.tds_rate = 'TDS rate is required';
        isValid = false;
      }
    }
    
    invoiceItems.forEach((item, idx) => {
      if (!item.quantity) errors[`item_${idx}_quantity`] = 'Quantity is required';
      if (!item.unit_price) errors[`item_${idx}_unit_price`] = 'Unit price is required';
      if (!item.gst_percent) errors[`item_${idx}_gst_percent`] = 'GST percent is required';
    });
    
    setFieldErrors(errors);
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
    if (!validateAllFields()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Calculate totals
      let taxableTotal = 0;
      let cgstTotal = 0;
      let sgstTotal = 0;
      let igstTotal = 0;
      let totalTax = 0;
      let grandTotal = 0;
      
      const processedItems = formData.items.map(item => {
        taxableTotal += item.taxable_amount;
        cgstTotal += item.cgst_amount;
        sgstTotal += item.sgst_amount;
        igstTotal += item.igst_amount;
        totalTax += item.total_gst_amount;
        grandTotal += item.total_amount;
        
        return {
          po_item_id: item.po_item_id,
          grn_item_id: item.grn_item_id,
          item_id: item.item_id,
          part_no: item.part_no,
          description: item.description,
          hsn_code: item.hsn_code,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          po_unit_price: item.po_unit_price,
          taxable_amount: item.taxable_amount,
          gst_percent: item.gst_percent,
          cgst_percent: item.cgst_percent,
          sgst_percent: item.sgst_percent,
          igst_percent: item.igst_percent,
          cgst_amount: item.cgst_amount,
          sgst_amount: item.sgst_amount,
          igst_amount: item.igst_amount,
          total_gst_amount: item.total_gst_amount,
          total_amount: item.total_amount,
          discount_percent: 0,
          discount_amount: 0,
          match_status: 'Not Checked'
        };
      });
      
      const tdsAmount = formData.tds_applicable ? (taxableTotal * (formData.tds_rate / 100)) : 0;
      const netPayable = grandTotal - tdsAmount;
      
      const submissionData = {
        po_id: formData.po_id,
        grn_ids: formData.grn_ids,
        vendor_invoice_no: formData.vendor_invoice_no,
        vendor_invoice_date: formData.vendor_invoice_date,
        invoice_date: formData.invoice_date,
        items: processedItems,
        taxable_total: taxableTotal,
        cgst_total: cgstTotal,
        sgst_total: sgstTotal,
        igst_total: igstTotal,
        total_tax: totalTax,
        grand_total: grandTotal,
        gst_type: formData.gst_type,
        tds_applicable: formData.tds_applicable,
        tds_section: formData.tds_section || null,
        tds_rate: formData.tds_rate ? parseFloat(formData.tds_rate) : 0,
        tds_amount: tdsAmount,
        net_payable: netPayable,
        due_date: formData.due_date,
        internal_remarks: formData.internal_remarks || '',
        created_by: user._id,
        status: 'Pending',
        payment_status: 'Unpaid',
        matching_status: 'Not Started',
        itc_eligible: true,
        itc_amount: totalTax
      };

      const response = await axios.post(`${BASE_URL}/api/purchase-invoices`, submissionData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create Purchase Invoice');
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(err.response?.data?.message || 'Failed to create Purchase Invoice');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      po_id: '',
      grn_ids: [],
      vendor_invoice_no: '',
      vendor_invoice_date: '',
      invoice_date: '',
      items: [],
      tds_applicable: false,
      tds_section: '',
      tds_rate: '',
      due_date: '',
      internal_remarks: '',
      gst_type: 'CGST/SGST'
    });
    setSelectedPO(null);
    setSelectedGrns([]);
    setInvoiceItems([]);
    setFieldErrors({});
    setError('');
    setAutoFilledFromGRN(false);
    setAutoFilledFromPO(false);
    setActiveStep(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  const totals = invoiceItems.reduce((sum, item) => ({
    taxable: sum.taxable + (item.taxable_amount || 0),
    cgst: sum.cgst + (item.cgst_amount || 0),
    sgst: sum.sgst + (item.sgst_amount || 0),
    igst: sum.igst + (item.igst_amount || 0),
    tax: sum.tax + (item.total_gst_amount || 0),
    grand: sum.grand + (item.total_amount || 0)
  }), { taxable: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, grand: 0 });
  
  const tdsAmount = formData.tds_applicable ? (totals.taxable * (formData.tds_rate / 100)) : 0;
  const netPayable = totals.grand - tdsAmount;

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Select PO & GRN
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                <AssignmentIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Purchase Order
              </Typography>
              <Autocomplete
                options={pos}
                loading={loadingPos}
                value={selectedPO}
                onChange={handlePOChange}
                getOptionLabel={(opt) => `${opt.po_number} - ${opt.vendor_name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder={loadingPos ? 'Loading POs...' : 'Select Purchase Order...'}
                    error={!!fieldErrors.po_id}
                    helperText={fieldErrors.po_id}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      }
                    }}
                  />
                )}
              />
            </Paper>

            {selectedPO && grns.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  <LocalShippingIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Goods Receipt Notes
                </Typography>
                <Autocomplete
                  multiple
                  options={grns}
                  loading={loadingGrns}
                  value={selectedGrns}
                  onChange={handleGRNChange}
                  getOptionLabel={(opt) => `${opt.grn_number} - Received: ${opt.total_received_qty} units`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select GRNs..."
                      error={!!fieldErrors.grn_ids}
                      helperText={fieldErrors.grn_ids}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        }
                      }}
                    />
                  )}
                />
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 1, display: 'block' }}>
                  All GRNs for this PO are auto-selected. You can modify the selection as needed.
                </Typography>
              </Paper>
            )}
          </Stack>
        );
      
      case 1: // Invoice Details
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '0.9rem' }}>
                  <ReceiptIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Invoice Details
                </Typography>
                <Stack direction="row" spacing={1}>
                  {autoFilledFromPO && (
                    <Chip 
                      label="Unit Price from PO" 
                      size="small" 
                      sx={{ 
                        fontSize: '0.65rem', 
                        height: 20, 
                        bgcolor: '#E0F2FE', 
                        color: '#0C4A6E',
                      }} 
                      icon={<InfoIcon sx={{ fontSize: '0.7rem' }} />}
                    />
                  )}
                  {autoFilledFromGRN && (
                    <Chip 
                      label="Auto-filled from GRN" 
                      size="small" 
                      sx={{ 
                        fontSize: '0.65rem', 
                        height: 20, 
                        bgcolor: '#FEF3C7', 
                        color: '#92400E',
                      }} 
                      icon={<RefreshIcon sx={{ fontSize: '0.7rem' }} />}
                    />
                  )}
                </Stack>
              </Stack>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      VENDOR INVOICE NO <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="vendor_invoice_no"
                      value={formData.vendor_invoice_no}
                      onChange={handleChange}
                      error={!!fieldErrors.vendor_invoice_no}
                      helperText={fieldErrors.vendor_invoice_no}
                      placeholder="e.g., INV-VED-2026-001"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      VENDOR INVOICE DATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      name="vendor_invoice_date"
                      value={formData.vendor_invoice_date}
                      onChange={handleChange}
                      error={!!fieldErrors.vendor_invoice_date}
                      helperText={fieldErrors.vendor_invoice_date}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      INVOICE DATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      name="invoice_date"
                      value={formData.invoice_date}
                      onChange={handleChange}
                      error={!!fieldErrors.invoice_date}
                      helperText={fieldErrors.invoice_date}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      DUE DATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      error={!!fieldErrors.due_date}
                      helperText={fieldErrors.due_date}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      GST TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.gst_type}>
                      <Select
                        name="gst_type"
                        value={formData.gst_type}
                        onChange={handleChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {gstTypes.map(type => (
                          <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="tds_applicable"
                          checked={formData.tds_applicable}
                          onChange={handleChange}
                          size="small"
                        />
                      }
                      label="TDS Applicable"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      INTERNAL REMARKS
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      name="internal_remarks"
                      value={formData.internal_remarks}
                      onChange={handleChange}
                      placeholder="Add any internal notes..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 2: // Items & TDS
        return (
          <Stack spacing={2}>
            {/* Items Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '0.9rem' }}>
                  <DescriptionIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Invoice Items
                </Typography>
                {autoFilledFromPO && (
                  <Chip 
                    label="Unit prices auto-filled from PO" 
                    size="small" 
                    sx={{ 
                      fontSize: '0.65rem', 
                      height: 20, 
                      bgcolor: '#E0F2FE', 
                      color: '#0C4A6E'
                    }} 
                    icon={<InfoIcon sx={{ fontSize: '0.7rem' }} />}
                  />
                )}
              </Stack>
              
              {fieldErrors.items && (
                <Alert severity="error" sx={{ mb: 1.5, py: 0, fontSize: '0.7rem' }}>{fieldErrors.items}</Alert>
              )}
              
              {invoiceItems.length > 0 ? (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.light }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price (₹)</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Taxable Amt</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">GST %</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoiceItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                error={!!fieldErrors[`item_${index}_quantity`]}
                                helperText={fieldErrors[`item_${index}_quantity`]}
                                inputProps={{ step: 1, min: 0 }}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                size="small"
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                error={!!fieldErrors[`item_${index}_unit_price`]}
                                helperText={fieldErrors[`item_${index}_unit_price`]}
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                sx={{ width: 120 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                ₹{item.taxable_amount?.toLocaleString() || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                type="number"
                                value={item.gst_percent}
                                onChange={(e) => handleItemChange(index, 'gst_percent', e.target.value)}
                                error={!!fieldErrors[`item_${index}_gst_percent`]}
                                helperText={fieldErrors[`item_${index}_gst_percent`]}
                                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton size="small" onClick={() => removeItem(index)} sx={{ color: '#EF4444' }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Stack direction="row" justifyContent="flex-end" spacing={3}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Subtotal:</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>₹{totals.taxable.toLocaleString()}</Typography>
                    </Box>
                    {formData.gst_type === 'CGST/SGST' ? (
                      <>
                        <Box>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>CGST:</Typography>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>₹{totals.cgst.toLocaleString()}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>SGST:</Typography>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>₹{totals.sgst.toLocaleString()}</Typography>
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>IGST:</Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>₹{totals.igst.toLocaleString()}</Typography>
                      </Box>
                    )}
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Tax:</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>₹{totals.tax.toLocaleString()}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Grand Total:</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.primary }}>₹{totals.grand.toLocaleString()}</Typography>
                    </Box>
                  </Stack>
                </>
              ) : (
                <Typography sx={{ textAlign: 'center', py: 3, color: COLORS.text.tertiary, fontSize: '0.75rem' }}>
                  No items to display. Please select GRNs in the previous step.
                </Typography>
              )}
            </Paper>

            {/* TDS Section */}
            {formData.tds_applicable && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> TDS Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                        TDS SECTION <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small" error={!!fieldErrors.tds_section}>
                        <Select 
                          name="tds_section" 
                          value={formData.tds_section} 
                          onChange={handleChange}
                          sx={{
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '& .MuiSelect-select': { py: 1, px: 1.5 }
                          }}
                        >
                          <MenuItem value="" sx={{ fontSize: '0.75rem' }}>Select Section</MenuItem>
                          {tdsSections.map(section => (
                            <MenuItem key={section} value={section} sx={{ fontSize: '0.75rem' }}>{section}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                        TDS RATE (%) <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        name="tds_rate"
                        value={formData.tds_rate}
                        onChange={handleChange}
                        error={!!fieldErrors.tds_rate}
                        helperText={fieldErrors.tds_rate}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '&:hover fieldset': { borderColor: COLORS.primary },
                            '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Stack direction="row" justifyContent="flex-end" spacing={3}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>TDS Amount:</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.warning }}>
                      ₹{tdsAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Net Payable:</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.success }}>
                      ₹{netPayable.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Create Purchase Invoice
        </Typography>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 0.5, mt: 0.5 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflow: 'auto', backgroundColor: COLORS.background.light }}>
        {renderStepContent(activeStep)}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
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
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || invoiceItems.length === 0}
              startIcon={loading ? null : <SaveIcon sx={{ fontSize: '1rem' }} />}
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
              {loading ? 'Creating...' : 'Create Invoice'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
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
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddPurchaseInvoice;