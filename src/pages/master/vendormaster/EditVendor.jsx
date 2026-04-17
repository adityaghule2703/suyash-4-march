// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Grid,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
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
//   FormControlLabel,
//   Switch,
//   Chip,
//   Autocomplete,
//   styled
// } from '@mui/material';
// import { 
//   Edit as EditIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants matching other components
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF',
//     lightMuted: 'rgba(255, 255, 255, 0.9)'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F'
//   },
//   border: '#E3E8EF',
//   status: {
//     success: '#9FE2BF',
//     warning: '#FEF3C7',
//     error: '#FEE2E2',
//     info: '#E0F2FE'
//   },
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     suspended: '#FEF3C7',
//     locked: '#FEE2E2'
//   }
// };

// // Modern Stepper Connector with Gradient
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const steps = ['Basic Information', 'Contact Details', 'Tax & Compliance', 'Bank & Payment'];

// // Validation helper functions
// const validateGST = (gst) => {
//   if (!gst) return false; // Required field
//   const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
//   return gstRegex.test(gst);
// };

// const validatePAN = (pan) => {
//   if (!pan) return true; // Optional field
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//   return panRegex.test(pan);
// };

// const validateEmail = (email) => {
//   if (!email) return false; // Required field
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// };

// const validatePhone = (phone) => {
//   if (!phone) return false; // Required field
//   const cleanPhone = phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
//   const phoneRegex = /^[6-9]\d{9}$/;
//   return phoneRegex.test(cleanPhone);
// };

// const validateStateCode = (code) => {
//   if (!code) return false; // Required field
//   const numCode = Number(code);
//   return numCode >= 1 && numCode <= 37; // Indian state codes
// };

// const validateUrl = (url) => {
//   if (!url) return true;
//   const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//   return urlRegex.test(url);
// };

// const validateBankAccount = (accountNo) => {
//   if (!accountNo) return true;
//   return accountNo.length >= 9 && accountNo.length <= 18;
// };

// const validateIFSC = (ifsc) => {
//   if (!ifsc) return true;
//   const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//   return ifscRegex.test(ifsc);
// };

// const validateCreditDays = (days) => {
//   if (days === '' || days === null || days === undefined) return true;
//   const numDays = Number(days);
//   if (isNaN(numDays)) return 'Credit days must be a number';
//   if (numDays < 0 || numDays > 365) return 'Credit days must be between 0 and 365';
//   return '';
// };

// const EditVendor = ({ open, onClose, vendor, onUpdate }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     vendor_code: '',
//     vendor_name: '',
//     vendor_type: 'Raw Material',
//     supply_category: [],
//     address: '',
//     gstin: '',
//     pan: '',
//     state: '',
//     state_code: '',
//     msme_number: '',
//     msme_category: '',
//     contact_person: '',
//     phone: '',
//     alternate_phone: '',
//     email: '',
//     website: '',
//     payment_terms: 'Net 30',
//     credit_days: '30',
//     currency: 'INR',
//     bank_details: {
//       bank_name: '',
//       account_no: '',
//       ifsc: '',
//       branch: '',
//       account_name: '',
//       account_type: 'Current'
//     },
//     is_active: true
//   });
  
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [supplyCategoryInput, setSupplyCategoryInput] = useState('');

//   // Vendor type options (updated to match schema enum)
//   const vendorTypes = [
//     { value: 'Raw Material', label: 'Raw Material' },
//     { value: 'Consumable', label: 'Consumable' },
//     { value: 'Subcontractor', label: 'Subcontractor' },
//     { value: 'Capital Goods', label: 'Capital Goods' },
//     { value: 'Service', label: 'Service' },
//     { value: 'Utilities', label: 'Utilities' },
//     { value: 'Other', label: 'Other' }
//   ];

//   // Payment Terms options (updated to match schema enum)
//   const paymentTermsOptions = [
//     { value: 'Advance', label: 'Advance' },
//     { value: 'On Delivery', label: 'On Delivery' },
//     { value: 'Net 15', label: 'Net 15' },
//     { value: 'Net 30', label: 'Net 30' },
//     { value: 'Net 45', label: 'Net 45' },
//     { value: 'Net 60', label: 'Net 60' },
//     { value: 'Net 90', label: 'Net 90' },
//     { value: 'LC', label: 'Letter of Credit (LC)' },
//     { value: 'Custom', label: 'Custom' }
//   ];

//   // Currency options (updated to match schema enum)
//   const currencies = [
//     { value: 'INR', label: 'INR - Indian Rupee' },
//     { value: 'USD', label: 'USD - US Dollar' },
//     { value: 'EUR', label: 'EUR - Euro' },
//     { value: 'GBP', label: 'GBP - British Pound' },
//     { value: 'AED', label: 'AED - UAE Dirham' },
//     { value: 'JPY', label: 'JPY - Japanese Yen' }
//   ];

//   // MSME Category options (updated to match schema)
//   const msmeCategories = [
//     { value: 'Micro', label: 'Micro' },
//     { value: 'Small', label: 'Small' },
//     { value: 'Medium', label: 'Medium' },
//     { value: 'Not MSME', label: 'Not MSME' }
//   ];

//   // Account type options (updated to match schema enum)
//   const accountTypes = [
//     { value: 'Current', label: 'Current' },
//     { value: 'Savings', label: 'Savings' },
//     { value: 'Cash Credit', label: 'Cash Credit' },
//     { value: 'Overdraft', label: 'Overdraft' }
//   ];

//   // Load vendor data when dialog opens
//   useEffect(() => {
//     if (vendor) {
//       console.log('Loading vendor data for edit:', vendor);
      
//       setFormData({
//         vendor_code: vendor.vendor_code || '',
//         vendor_name: vendor.vendor_name || '',
//         vendor_type: vendor.vendor_type || 'Raw Material',
//         supply_category: vendor.supply_category || [],
//         address: vendor.address || '',
//         gstin: vendor.gstin || '',
//         pan: vendor.pan || '',
//         state: vendor.state || '',
//         state_code: vendor.state_code || '',
//         msme_number: vendor.msme_number || '',
//         msme_category: vendor.msme_category || '',
//         contact_person: vendor.contact_person || '',
//         phone: vendor.phone || '',
//         alternate_phone: vendor.alternate_phone || '',
//         email: vendor.email || '',
//         website: vendor.website || '',
//         payment_terms: vendor.payment_terms || 'Net 30',
//         credit_days: vendor.credit_days?.toString() || '30',
//         currency: vendor.currency || 'INR',
//         bank_details: {
//           bank_name: vendor.bank_details?.bank_name || '',
//           account_no: vendor.bank_details?.account_no || '',
//           ifsc: vendor.bank_details?.ifsc || '',
//           branch: vendor.bank_details?.branch || '',
//           account_name: vendor.bank_details?.account_name || '',
//           account_type: vendor.bank_details?.account_type || 'Current'
//         },
//         is_active: vendor.is_active !== undefined ? vendor.is_active : true
//       });
//     }
//   }, [vendor]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     setFieldErrors(prev => ({
//       ...prev,
//       [name]: ''
//     }));
    
//     if (type === 'checkbox') {
//       setFormData(prev => ({
//         ...prev,
//         [name]: checked
//       }));
//       return;
//     }
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else if (name === 'gstin') {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value.toUpperCase()
//       }));
//     } else if (name === 'pan') {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value.toUpperCase()
//       }));
//     } else if (name === 'phone' || name === 'alternate_phone') {
//       const cleanValue = value.replace(/[^\d\s\-\+]/g, '');
//       setFormData(prev => ({
//         ...prev,
//         [name]: cleanValue
//       }));
//     } else if (name === 'state_code') {
//       if (value === '' || /^\d*$/.test(value)) {
//         setFormData(prev => ({
//           ...prev,
//           [name]: value
//         }));
//       }
//     } else if (name === 'credit_days') {
//       if (value === '' || /^\d*$/.test(value)) {
//         setFormData(prev => ({
//           ...prev,
//           [name]: value
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSelectChange = (event) => {
//     const { name, value } = event.target;
//     setFieldErrors(prev => ({
//       ...prev,
//       [name]: ''
//     }));
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleBankDetailsChange = (field, value) => {
//     setFieldErrors(prev => ({
//       ...prev,
//       [`bank_details.${field}`]: ''
//     }));
//     setFormData(prev => ({
//       ...prev,
//       bank_details: {
//         ...prev.bank_details,
//         [field]: value
//       }
//     }));
//   };

//   const handleSupplyCategoryAdd = () => {
//     if (supplyCategoryInput.trim() && !formData.supply_category.includes(supplyCategoryInput.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         supply_category: [...prev.supply_category, supplyCategoryInput.trim()]
//       }));
//       setSupplyCategoryInput('');
//     }
//   };

//   const handleSupplyCategoryDelete = (categoryToDelete) => {
//     setFormData(prev => ({
//       ...prev,
//       supply_category: prev.supply_category.filter(cat => cat !== categoryToDelete)
//     }));
//   };

//   const validateField = (name, value) => {
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       if (parent === 'bank_details') {
//         switch (child) {
//           case 'account_no':
//             return validateBankAccount(value) ? '' : 'Account number should be 9-18 digits';
//           case 'ifsc':
//             return validateIFSC(value) ? '' : 'Please enter a valid IFSC code (e.g., HDFC0001234)';
//           default:
//             return '';
//         }
//       }
//       return '';
//     }

//     switch (name) {
//       case 'vendor_code':
//         if (!value?.trim()) return 'Vendor code is required';
//         if (value.length > 20) return 'Vendor code should not exceed 20 characters';
//         break;
//       case 'vendor_name':
//         if (!value?.trim()) return 'Vendor name is required';
//         if (value.length > 100) return 'Vendor name should not exceed 100 characters';
//         break;
//       case 'vendor_type':
//         if (!value) return 'Vendor type is required';
//         break;
//       case 'address':
//         if (!value?.trim()) return 'Address is required';
//         break;
//       case 'state':
//         if (!value?.trim()) return 'State is required';
//         break;
//       case 'state_code':
//         if (!value) return 'State code is required';
//         if (!validateStateCode(value)) return 'State code must be between 1 and 37';
//         break;
//       case 'contact_person':
//         if (!value?.trim()) return 'Contact person is required';
//         break;
//       case 'phone':
//         if (!value?.trim()) return 'Phone number is required';
//         if (!validatePhone(value)) return 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
//         break;
//       case 'alternate_phone':
//         if (value && !validatePhone(value)) return 'Please enter a valid 10-digit Indian mobile number';
//         break;
//       case 'email':
//         if (!value?.trim()) return 'Email is required';
//         if (!validateEmail(value)) return 'Please enter a valid email address';
//         break;
//       case 'website':
//         if (value && !validateUrl(value)) return 'Please enter a valid URL (e.g., www.example.com)';
//         break;
//       case 'gstin':
//         if (!value?.trim()) return 'GSTIN is required';
//         if (!validateGST(value)) return 'Please enter a valid GSTIN (e.g., 27AAPFU0939F1Z5)';
//         break;
//       case 'pan':
//         if (value && !validatePAN(value)) return 'Please enter a valid PAN (e.g., AAAAA1234A)';
//         break;
//       case 'msme_number':
//         if (value && value.length > 30) return 'MSME number should not exceed 30 characters';
//         break;
//       case 'payment_terms':
//         if (!value) return 'Payment terms is required';
//         break;
//       case 'credit_days':
//         return validateCreditDays(value);
//       case 'currency':
//         if (!value) return 'Currency is required';
//         break;
//       default:
//         return '';
//     }
//     return '';
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Basic Information
//         const vendorCodeError = validateField('vendor_code', formData.vendor_code);
//         if (vendorCodeError) {
//           errors.vendor_code = vendorCodeError;
//           isValid = false;
//         }

//         const vendorNameError = validateField('vendor_name', formData.vendor_name);
//         if (vendorNameError) {
//           errors.vendor_name = vendorNameError;
//           isValid = false;
//         }

//         const vendorTypeError = validateField('vendor_type', formData.vendor_type);
//         if (vendorTypeError) {
//           errors.vendor_type = vendorTypeError;
//           isValid = false;
//         }

//         const addressError = validateField('address', formData.address);
//         if (addressError) {
//           errors.address = addressError;
//           isValid = false;
//         }
//         break;
      
//       case 1: // Contact Details
//         const contactPersonError = validateField('contact_person', formData.contact_person);
//         if (contactPersonError) {
//           errors.contact_person = contactPersonError;
//           isValid = false;
//         }

//         const phoneError = validateField('phone', formData.phone);
//         if (phoneError) {
//           errors.phone = phoneError;
//           isValid = false;
//         }

//         const emailError = validateField('email', formData.email);
//         if (emailError) {
//           errors.email = emailError;
//           isValid = false;
//         }

//         if (formData.alternate_phone) {
//           const altPhoneError = validateField('alternate_phone', formData.alternate_phone);
//           if (altPhoneError) {
//             errors.alternate_phone = altPhoneError;
//             isValid = false;
//           }
//         }

//         if (formData.website) {
//           const websiteError = validateField('website', formData.website);
//           if (websiteError) {
//             errors.website = websiteError;
//             isValid = false;
//           }
//         }

//         const stateError = validateField('state', formData.state);
//         if (stateError) {
//           errors.state = stateError;
//           isValid = false;
//         }

//         const stateCodeError = validateField('state_code', formData.state_code);
//         if (stateCodeError) {
//           errors.state_code = stateCodeError;
//           isValid = false;
//         }
//         break;
      
//       case 2: // Tax & Compliance
//         const gstError = validateField('gstin', formData.gstin);
//         if (gstError) {
//           errors.gstin = gstError;
//           isValid = false;
//         }

//         if (formData.pan) {
//           const panError = validateField('pan', formData.pan);
//           if (panError) {
//             errors.pan = panError;
//             isValid = false;
//           }
//         }

//         if (formData.msme_number) {
//           const msmeError = validateField('msme_number', formData.msme_number);
//           if (msmeError) {
//             errors.msme_number = msmeError;
//             isValid = false;
//           }
//         }
//         break;
      
//       case 3: // Bank & Payment
//         const paymentTermsError = validateField('payment_terms', formData.payment_terms);
//         if (paymentTermsError) {
//           errors.payment_terms = paymentTermsError;
//           isValid = false;
//         }

//         const currencyError = validateField('currency', formData.currency);
//         if (currencyError) {
//           errors.currency = currencyError;
//           isValid = false;
//         }

//         if (formData.credit_days) {
//           const creditDaysError = validateField('credit_days', formData.credit_days);
//           if (creditDaysError) {
//             errors.credit_days = creditDaysError;
//             isValid = false;
//           }
//         }

//         if (formData.bank_details.account_no) {
//           const accountError = validateField('bank_details.account_no', formData.bank_details.account_no);
//           if (accountError) {
//             errors['bank_details.account_no'] = accountError;
//             isValid = false;
//           }
//         }

//         if (formData.bank_details.ifsc) {
//           const ifscError = validateField('bank_details.ifsc', formData.bank_details.ifsc);
//           if (ifscError) {
//             errors['bank_details.ifsc'] = ifscError;
//             isValid = false;
//           }
//         }
//         break;
      
//       default:
//         return true;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fix the errors in this section');
//     }
//     return isValid;
//   };

//   const validateAllFields = () => {
//   const errors = {};
//   let isValid = true;

//   // Required fields validation
//   const requiredFields = [
//     { name: 'vendor_code', label: 'Vendor code' },
//     { name: 'vendor_name', label: 'Vendor name' },
//     { name: 'vendor_type', label: 'Vendor type' },
//     { name: 'address', label: 'Address' },
//     { name: 'state', label: 'State' },
//     { name: 'state_code', label: 'State code' },
//     { name: 'contact_person', label: 'Contact person' },
//     { name: 'phone', label: 'Phone number' },
//     { name: 'email', label: 'Email' },
//     { name: 'gstin', label: 'GSTIN' },
//     { name: 'payment_terms', label: 'Payment terms' },
//     { name: 'currency', label: 'Currency' }
//   ];

//   requiredFields.forEach(field => {
//     const value = formData[field.name];
//     // Check if value is a string and trim it, or if it's a number convert to string
//     const isEmpty = value === undefined || 
//                     value === null || 
//                     value === '' || 
//                     (typeof value === 'string' && !value.trim());
    
//     if (isEmpty) {
//       errors[field.name] = `${field.label} is required`;
//       isValid = false;
//     }
//   });

//   // Validate all fields with custom validations
//   const fieldsToValidate = [
//     'vendor_code', 'vendor_name', 'vendor_type', 'address', 'state', 'state_code',
//     'contact_person', 'phone', 'email', 'gstin', 'payment_terms', 'currency',
//     'alternate_phone', 'website', 'pan', 'msme_number', 'credit_days',
//     'bank_details.account_no', 'bank_details.ifsc'
//   ];

//   fieldsToValidate.forEach(field => {
//     let value;
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       value = formData[parent]?.[child];
//     } else {
//       value = formData[field];
//     }
    
//     // Check if field has a value (not empty, null, or undefined)
//     const hasValue = value !== undefined && 
//                      value !== null && 
//                      value !== '' && 
//                      !(typeof value === 'string' && !value.trim());
    
//     // Check if this is a required field that we already validated above
//     const isRequiredField = requiredFields.some(f => f.name === field);
    
//     if (hasValue || (isRequiredField && !hasValue)) {
//       const error = validateField(field, value);
//       if (error) {
//         errors[field] = error;
//         isValid = false;
//       }
//     }
//   });

//   setFieldErrors(errors);
//   if (!isValid) {
//     setError('Please fix all validation errors');
//   }
//   return isValid;
// };

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
//     if (!validateAllFields()) {
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
      
//       // Clean phone numbers
//       const cleanPhone = formData.phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
//       const cleanAlternatePhone = formData.alternate_phone ? 
//         formData.alternate_phone.replace(/[\s\-]/g, '').replace(/^\+91/, '') : '';
      
//       const submissionData = {
//         vendor_code: formData.vendor_code,
//         vendor_name: formData.vendor_name,
//         vendor_type: formData.vendor_type,
//         supply_category: formData.supply_category,
//         address: formData.address,
//         gstin: formData.gstin,
//         pan: formData.pan || null,
//         state: formData.state,
//         state_code: parseInt(formData.state_code),
//         msme_number: formData.msme_number || null,
//         msme_category: formData.msme_category || null,
//         contact_person: formData.contact_person,
//         phone: cleanPhone,
//         alternate_phone: cleanAlternatePhone || null,
//         email: formData.email,
//         website: formData.website || null,
//         payment_terms: formData.payment_terms,
//         credit_days: formData.credit_days ? parseInt(formData.credit_days) : 30,
//         currency: formData.currency,
//         bank_details: formData.bank_details.bank_name ? {
//           bank_name: formData.bank_details.bank_name,
//           account_no: formData.bank_details.account_no,
//           ifsc: formData.bank_details.ifsc,
//           branch: formData.bank_details.branch,
//           account_name: formData.bank_details.account_name,
//           account_type: formData.bank_details.account_type
//         } : undefined,
//         is_active: formData.is_active,
//         updated_by: user._id
//       };

//       console.log('Submitting vendor update:', submissionData);

//       const response = await axios.put(`${BASE_URL}/api/vendors/${vendor._id}`, submissionData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         onUpdate(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to update vendor');
//       }
//     } catch (err) {
//       console.error('Error updating vendor:', err);
//       setError(err.response?.data?.message || 'Failed to update vendor. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       vendor_code: '',
//       vendor_name: '',
//       vendor_type: 'Raw Material',
//       supply_category: [],
//       address: '',
//       gstin: '',
//       pan: '',
//       state: '',
//       state_code: '',
//       msme_number: '',
//       msme_category: '',
//       contact_person: '',
//       phone: '',
//       alternate_phone: '',
//       email: '',
//       website: '',
//       payment_terms: 'Net 30',
//       credit_days: '30',
//       currency: 'INR',
//       bank_details: {
//         bank_name: '',
//         account_no: '',
//         ifsc: '',
//         branch: '',
//         account_name: '',
//         account_type: 'Current'
//       },
//       is_active: true
//     });
//     setSupplyCategoryInput('');
//     setFieldErrors({});
//     setError('');
//     setActiveStep(0);
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   if (!vendor) return null;

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0: // Basic Information
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Basic Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       VENDOR CODE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="vendor_code"
//                       value={formData.vendor_code}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., VEN001"
//                       error={!!fieldErrors.vendor_code}
//                       helperText={fieldErrors.vendor_code}
//                       inputProps={{ maxLength: 20 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       VENDOR NAME <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="vendor_name"
//                       value={formData.vendor_name}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., ABC Enterprises"
//                       error={!!fieldErrors.vendor_name}
//                       helperText={fieldErrors.vendor_name}
//                       inputProps={{ maxLength: 100 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       VENDOR TYPE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.vendor_type}>
//                       <Select
//                         name="vendor_type"
//                         value={formData.vendor_type}
//                         onChange={handleSelectChange}
//                         disabled={loading}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': {
//                             py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {vendorTypes.map((type) => (
//                           <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>
//                             {type.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.vendor_type && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.vendor_type}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       ADDRESS <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       multiline
//                       rows={2}
//                       disabled={loading}
//                       placeholder="Street address, city, pincode"
//                       error={!!fieldErrors.address}
//                       helperText={fieldErrors.address}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       SUPPLY CATEGORY
//                     </Typography>
//                     <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={supplyCategoryInput}
//                         onChange={(e) => setSupplyCategoryInput(e.target.value)}
//                         disabled={loading}
//                         placeholder="e.g., Copper Strip"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             handleSupplyCategoryAdd();
//                           }
//                         }}
//                         sx={{
//                           '& .MuiOutlinedInput-root': {
//                             borderRadius: 1.5,
//                             fontSize: '0.75rem',
//                             '&:hover fieldset': { borderColor: COLORS.primary },
//                             '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                           },
//                           '& .MuiInputBase-input': {
//                             py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                           }
//                         }}
//                       />
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         onClick={handleSupplyCategoryAdd}
//                         disabled={loading || !supplyCategoryInput.trim()}
//                         sx={{
//                           height: 32,
//                           minWidth: 70,
//                           borderRadius: 1.5,
//                           borderColor: COLORS.border,
//                           color: COLORS.primary,
//                           fontSize: '0.7rem',
//                           textTransform: 'none',
//                           '&:hover': {
//                             borderColor: COLORS.primary,
//                             bgcolor: `${COLORS.primary}10`
//                           }
//                         }}
//                       >
//                         Add
//                       </Button>
//                     </Box>
//                     {formData.supply_category.length > 0 && (
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
//                         {formData.supply_category.map((category, index) => (
//                           <Chip
//                             key={index}
//                             label={category}
//                             size="small"
//                             onDelete={() => handleSupplyCategoryDelete(category)}
//                             disabled={loading}
//                             sx={{
//                               fontSize: '0.7rem',
//                               height: 24,
//                               bgcolor: COLORS.primaryLight,
//                               color: COLORS.primary,
//                               '& .MuiChip-deleteIcon': {
//                                 color: COLORS.primary,
//                                 fontSize: '0.8rem',
//                                 '&:hover': { color: COLORS.primaryDark }
//                               }
//                             }}
//                           />
//                         ))}
//                       </Box>
//                     )}
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                       Press Enter or click Add to add supply categories
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );
      
//       case 1: // Contact Details
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Contact Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       CONTACT PERSON <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="contact_person"
//                       value={formData.contact_person}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., John Doe"
//                       error={!!fieldErrors.contact_person}
//                       helperText={fieldErrors.contact_person}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       PHONE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., 9876543210"
//                       error={!!fieldErrors.phone}
//                       helperText={fieldErrors.phone}
//                       inputProps={{ maxLength: 15 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       10-digit mobile number starting with 6-9
//                     </Typography>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       ALTERNATE PHONE
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="alternate_phone"
//                       value={formData.alternate_phone}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., 9876543211"
//                       error={!!fieldErrors.alternate_phone}
//                       helperText={fieldErrors.alternate_phone}
//                       inputProps={{ maxLength: 15 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       EMAIL <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       type="email"
//                       disabled={loading}
//                       placeholder="vendor@gmail.com"
//                       error={!!fieldErrors.email}
//                       helperText={fieldErrors.email}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       WEBSITE
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="website"
//                       value={formData.website}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="www.example.com"
//                       error={!!fieldErrors.website}
//                       helperText={fieldErrors.website}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       STATE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., Maharashtra"
//                       error={!!fieldErrors.state}
//                       helperText={fieldErrors.state}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       STATE CODE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="state_code"
//                       value={formData.state_code}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., 27"
//                       error={!!fieldErrors.state_code}
//                       helperText={fieldErrors.state_code}
//                       inputProps={{ min: 1, max: 37, onWheel: (e) => e.target.blur() }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       Between 1-37 (Indian state codes)
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );
      
//       case 2: // Tax & Compliance
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Tax Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       GSTIN <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="gstin"
//                       value={formData.gstin}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., 27AAACM1234A1Z5"
//                       error={!!fieldErrors.gstin}
//                       helperText={fieldErrors.gstin}
//                       inputProps={{ maxLength: 15, style: { textTransform: 'uppercase' } }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       15 characters: 2 digits + 10 PAN + 3 chars
//                     </Typography>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       PAN NUMBER
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="pan"
//                       value={formData.pan}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., AAAAA1234A"
//                       error={!!fieldErrors.pan}
//                       helperText={fieldErrors.pan}
//                       inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       10 characters: 5 letters + 4 digits + 1 letter
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 MSME Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       MSME NUMBER
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="msme_number"
//                       value={formData.msme_number}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., UDYAM-MH-01-1234567"
//                       error={!!fieldErrors.msme_number}
//                       helperText={fieldErrors.msme_number}
//                       inputProps={{ maxLength: 30 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       MSME CATEGORY
//                     </Typography>
//                     <FormControl fullWidth size="small">
//                       <Select
//                         name="msme_category"
//                         value={formData.msme_category}
//                         onChange={handleSelectChange}
//                         disabled={loading}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': {
//                             py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         <MenuItem value="" sx={{ fontSize: '0.75rem' }}>Select category</MenuItem>
//                         {msmeCategories.map((cat) => (
//                           <MenuItem key={cat.value} value={cat.value} sx={{ fontSize: '0.75rem' }}>
//                             {cat.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );
      
//       case 3: // Bank & Payment
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Payment Terms
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       PAYMENT TERMS <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.payment_terms}>
//                       <Select
//                         name="payment_terms"
//                         value={formData.payment_terms}
//                         onChange={handleSelectChange}
//                         disabled={loading}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': {
//                             py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {paymentTermsOptions.map((term) => (
//                           <MenuItem key={term.value} value={term.value} sx={{ fontSize: '0.75rem' }}>
//                             {term.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.payment_terms && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.payment_terms}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       CREDIT DAYS
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="credit_days"
//                       value={formData.credit_days}
//                       onChange={handleChange}
//                       disabled={loading}
//                       type="number"
//                       placeholder="e.g., 30"
//                       error={!!fieldErrors.credit_days}
//                       helperText={fieldErrors.credit_days}
//                       inputProps={{ min: 0, max: 365, onWheel: (e) => e.target.blur() }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       CURRENCY <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.currency}>
//                       <Select
//                         name="currency"
//                         value={formData.currency}
//                         onChange={handleSelectChange}
//                         disabled={loading}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': {
//                             py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {currencies.map((curr) => (
//                           <MenuItem key={curr.value} value={curr.value} sx={{ fontSize: '0.75rem' }}>
//                             {curr.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.currency && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.currency}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Bank Details
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       BANK NAME
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={formData.bank_details.bank_name}
//                       onChange={(e) => handleBankDetailsChange('bank_name', e.target.value)}
//                       disabled={loading}
//                       placeholder="e.g., HDFC Bank"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       BRANCH
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={formData.bank_details.branch}
//                       onChange={(e) => handleBankDetailsChange('branch', e.target.value)}
//                       disabled={loading}
//                       placeholder="e.g., MIDC Industrial Area"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       ACCOUNT NAME
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={formData.bank_details.account_name}
//                       onChange={(e) => handleBankDetailsChange('account_name', e.target.value)}
//                       disabled={loading}
//                       placeholder="e.g., ABC Metals Pvt Ltd"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       ACCOUNT NUMBER
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={formData.bank_details.account_no}
//                       onChange={(e) => handleBankDetailsChange('account_no', e.target.value)}
//                       disabled={loading}
//                       placeholder="e.g., 50100123456789"
//                       error={!!fieldErrors['bank_details.account_no']}
//                       helperText={fieldErrors['bank_details.account_no']}
//                       inputProps={{ maxLength: 18 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       IFSC CODE
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={formData.bank_details.ifsc}
//                       onChange={(e) => handleBankDetailsChange('ifsc', e.target.value.toUpperCase())}
//                       disabled={loading}
//                       placeholder="e.g., HDFC0001234"
//                       error={!!fieldErrors['bank_details.ifsc']}
//                       helperText={fieldErrors['bank_details.ifsc']}
//                       inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                         },
//                         '& .MuiFormHelperText-root': {
//                           fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       ACCOUNT TYPE
//                     </Typography>
//                     <FormControl fullWidth size="small">
//                       <Select
//                         value={formData.bank_details.account_type}
//                         onChange={(e) => handleBankDetailsChange('account_type', e.target.value)}
//                         disabled={loading}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': {
//                             py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {accountTypes.map((type) => (
//                           <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>
//                             {type.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//               </Grid>
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
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden',
//           maxHeight: '95vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 1
//       }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Edit Vendor
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//             {vendor?._id && (
//               <Chip
//                 label={`ID: ${vendor._id.slice(-6)}`}
//                 size="small"
//                 sx={{ 
//                   fontSize: '0.65rem',
//                   fontWeight: 500,
//                   height: 24,
//                   bgcolor: COLORS.background.light,
//                   color: COLORS.text.secondary,
//                   border: `1px solid ${COLORS.border}`
//                 }}
//               />
//             )}
//             <Chip
//               label={formData.is_active ? 'Active' : 'Inactive'}
//               size="small"
//               sx={{ 
//                 fontSize: '0.65rem',
//                 fontWeight: 500,
//                 height: 24,
//                 bgcolor: formData.is_active ? COLORS.chips.active : COLORS.chips.inactive,
//                 color: formData.is_active ? COLORS.primaryDark : COLORS.text.secondary,
//                 border: `1px solid ${formData.is_active ? '#86efac' : COLORS.border}`
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Modern Stepper with Gradient Connector */}
//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//           sx={{ mb: 0.5, mt: 0.5 }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
//                   {label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
//         {renderStepContent(activeStep)}

//         {error && (
//           <Alert 
//             severity="error" 
//             sx={{ 
//               mt: 2, 
//               borderRadius: 1.5,
//               '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
//               fontSize: '0.75rem',
//               py: 0.5
//             }}
//           >
//             {error}
//           </Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: 1
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
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             sx={{
//               height: 32,
//               px: 2,
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
//               disabled={loading}
//               startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': { bgcolor: COLORS.primaryDark }
//               }}
//             >
//               {loading ? 'Updating...' : 'Update Vendor'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading}
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
//                 '&:hover': { bgcolor: COLORS.primaryDark }
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

// export default EditVendor;


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
  Autocomplete,
  DialogActions,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Chip,
  styled
} from '@mui/material';
import { 
  Edit as EditIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// ✅ All Indian States with GST State Codes
const INDIAN_STATES = [
  { name: 'Jammu & Kashmir',              code: '01' },
  { name: 'Himachal Pradesh',             code: '02' },
  { name: 'Punjab',                        code: '03' },
  { name: 'Chandigarh',                   code: '04' },
  { name: 'Uttarakhand',                  code: '05' },
  { name: 'Haryana',                      code: '06' },
  { name: 'Delhi',                        code: '07' },
  { name: 'Rajasthan',                    code: '08' },
  { name: 'Uttar Pradesh',               code: '09' },
  { name: 'Bihar',                        code: '10' },
  { name: 'Sikkim',                       code: '11' },
  { name: 'Arunachal Pradesh',           code: '12' },
  { name: 'Nagaland',                     code: '13' },
  { name: 'Manipur',                      code: '14' },
  { name: 'Mizoram',                      code: '15' },
  { name: 'Tripura',                      code: '16' },
  { name: 'Meghalaya',                    code: '17' },
  { name: 'Assam',                        code: '18' },
  { name: 'West Bengal',                  code: '19' },
  { name: 'Jharkhand',                    code: '20' },
  { name: 'Odisha',                       code: '21' },
  { name: 'Chhattisgarh',                code: '22' },
  { name: 'Madhya Pradesh',              code: '23' },
  { name: 'Gujarat',                      code: '24' },
  { name: 'Daman and Diu',               code: '25' },
  { name: 'Dadra and Nagar Haveli',      code: '26' },
  { name: 'Maharashtra',                  code: '27' },
  { name: 'Andhra Pradesh',              code: '28' },
  { name: 'Karnataka',                    code: '29' },
  { name: 'Goa',                          code: '30' },
  { name: 'Lakshadweep',                 code: '31' },
  { name: 'Kerala',                       code: '32' },
  { name: 'Tamil Nadu',                   code: '33' },
  { name: 'Puducherry',                   code: '34' },
  { name: 'Andaman and Nicobar Islands', code: '35' },
  { name: 'Telangana',                    code: '36' },
  { name: 'Andhra Pradesh (New)',        code: '37' },
  { name: 'Ladakh',                       code: '38' },
];

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

const steps = ['Basic Information', 'Contact Details', 'Tax & Compliance', 'Bank & Payment'];

// Validation helpers
const validateGST = (gst) => {
  if (!gst) return false;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};
const validatePAN = (pan) => {
  if (!pan) return true;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};
const validateEmail = (email) => {
  if (!email) return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};
const validatePhone = (phone) => {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
  return /^[6-9]\d{9}$/.test(clean);
};
const validateStateCode = (code) => {
  if (!code) return false;
  const n = Number(code);
  return n >= 1 && n <= 38;
};
const validateUrl = (url) => {
  if (!url) return true;
  return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url);
};
const validateBankAccount = (accountNo) => {
  if (!accountNo) return true;
  return accountNo.length >= 9 && accountNo.length <= 18;
};
const validateIFSC = (ifsc) => {
  if (!ifsc) return true;
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};
const validateCreditDays = (days) => {
  if (days === '' || days === null || days === undefined) return true;
  const n = Number(days);
  if (isNaN(n)) return 'Credit days must be a number';
  if (n < 0 || n > 365) return 'Credit days must be between 0 and 365';
  return '';
};

const EditVendor = ({ open, onClose, vendor, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    vendor_code: '',
    vendor_name: '',
    vendor_type: 'Raw Material',
    supply_category: [],
    address: '',
    gstin: '',
    pan: '',
    state: '',
    state_code: '',
    msme_number: '',
    msme_category: '',
    contact_person: '',
    phone: '',
    alternate_phone: '',
    email: '',
    website: '',
    payment_terms: 'Net 30',
    credit_days: '30',
    currency: 'INR',
    bank_details: {
      bank_name: '',
      account_no: '',
      ifsc: '',
      branch: '',
      account_name: '',
      account_type: 'Current'
    },
    is_active: true
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supplyCategoryInput, setSupplyCategoryInput] = useState('');

  const vendorTypes = [
    { value: 'Raw Material', label: 'Raw Material' },
    { value: 'Consumable', label: 'Consumable' },
    { value: 'Subcontractor', label: 'Subcontractor' },
    { value: 'Capital Goods', label: 'Capital Goods' },
    { value: 'Service', label: 'Service' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Other', label: 'Other' }
  ];
  const paymentTermsOptions = [
    { value: 'Advance', label: 'Advance' },
    { value: 'On Delivery', label: 'On Delivery' },
    { value: 'Net 15', label: 'Net 15' },
    { value: 'Net 30', label: 'Net 30' },
    { value: 'Net 45', label: 'Net 45' },
    { value: 'Net 60', label: 'Net 60' },
    { value: 'Net 90', label: 'Net 90' },
    { value: 'LC', label: 'Letter of Credit (LC)' },
    { value: 'Custom', label: 'Custom' }
  ];
  const currencies = [
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'JPY', label: 'JPY - Japanese Yen' }
  ];
  const msmeCategories = [
    { value: 'Micro', label: 'Micro' },
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Not MSME', label: 'Not MSME' }
  ];
  const accountTypes = [
    { value: 'Current', label: 'Current' },
    { value: 'Savings', label: 'Savings' },
    { value: 'Cash Credit', label: 'Cash Credit' },
    { value: 'Overdraft', label: 'Overdraft' }
  ];

  // Load vendor data when dialog opens
  useEffect(() => {
    if (vendor) {
      // ✅ When loading existing vendor, find state match to ensure dropdown is in sync.
      // state_code from DB may be a number (e.g. 27), normalize to zero-padded string (e.g. "27")
      const rawCode = vendor.state_code?.toString() || '';
      const paddedCode = rawCode.padStart(2, '0');

      // Try to find the state by code first, then fall back to name match
      const matchedByCode = INDIAN_STATES.find(s => s.code === paddedCode);
      const matchedByName = INDIAN_STATES.find(
        s => s.name.toLowerCase() === (vendor.state || '').toLowerCase()
      );
      const resolvedState = matchedByCode || matchedByName;

      setFormData({
        vendor_code: vendor.vendor_code || '',
        vendor_name: vendor.vendor_name || '',
        vendor_type: vendor.vendor_type || 'Raw Material',
        supply_category: vendor.supply_category || [],
        address: vendor.address || '',
        gstin: vendor.gstin || '',
        pan: vendor.pan || '',
        // ✅ Use resolved state name and code so dropdown shows correct selection
        state: resolvedState ? resolvedState.name : (vendor.state || ''),
        state_code: resolvedState ? resolvedState.code : paddedCode,
        msme_number: vendor.msme_number || '',
        msme_category: vendor.msme_category || '',
        contact_person: vendor.contact_person || '',
        phone: vendor.phone || '',
        alternate_phone: vendor.alternate_phone || '',
        email: vendor.email || '',
        website: vendor.website || '',
        payment_terms: vendor.payment_terms || 'Net 30',
        credit_days: vendor.credit_days?.toString() || '30',
        currency: vendor.currency || 'INR',
        bank_details: {
          bank_name: vendor.bank_details?.bank_name || '',
          account_no: vendor.bank_details?.account_no || '',
          ifsc: vendor.bank_details?.ifsc || '',
          branch: vendor.bank_details?.branch || '',
          account_name: vendor.bank_details?.account_name || '',
          account_type: vendor.bank_details?.account_type || 'Current'
        },
        is_active: vendor.is_active !== undefined ? vendor.is_active : true
      });
    }
  }, [vendor]);

  // ✅ Handle State Selection — auto-fills state_code
  const handleStateChange = (event) => {
    const selectedStateName = event.target.value;
    const selectedState = INDIAN_STATES.find(s => s.name === selectedStateName);

    setFieldErrors(prev => ({ ...prev, state: '', state_code: '' }));
    setFormData(prev => ({
      ...prev,
      state: selectedState ? selectedState.name : '',
      state_code: selectedState ? selectedState.code : ''
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else if (name === 'gstin') {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else if (name === 'pan') {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else if (name === 'phone' || name === 'alternate_phone') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^\d\s\-\+]/g, '') }));
    } else if (name === 'credit_days') {
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBankDetailsChange = (field, value) => {
    setFieldErrors(prev => ({ ...prev, [`bank_details.${field}`]: '' }));
    setFormData(prev => ({ ...prev, bank_details: { ...prev.bank_details, [field]: value } }));
  };

  const handleSupplyCategoryAdd = () => {
    if (supplyCategoryInput.trim() && !formData.supply_category.includes(supplyCategoryInput.trim())) {
      setFormData(prev => ({ ...prev, supply_category: [...prev.supply_category, supplyCategoryInput.trim()] }));
      setSupplyCategoryInput('');
    }
  };

  const handleSupplyCategoryDelete = (cat) => {
    setFormData(prev => ({ ...prev, supply_category: prev.supply_category.filter(c => c !== cat) }));
  };

  const validateField = (name, value) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'bank_details') {
        if (child === 'account_no') return validateBankAccount(value) ? '' : 'Account number should be 9-18 digits';
        if (child === 'ifsc') return validateIFSC(value) ? '' : 'Please enter a valid IFSC code (e.g., HDFC0001234)';
      }
      return '';
    }
    switch (name) {
      case 'vendor_code':
        if (!value?.trim()) return 'Vendor code is required';
        if (value.length > 20) return 'Vendor code should not exceed 20 characters';
        break;
      case 'vendor_name':
        if (!value?.trim()) return 'Vendor name is required';
        if (value.length > 100) return 'Vendor name should not exceed 100 characters';
        break;
      case 'vendor_type': if (!value) return 'Vendor type is required'; break;
      case 'address': if (!value?.trim()) return 'Address is required'; break;
      case 'state': if (!value?.trim()) return 'State is required'; break;
      case 'state_code':
        if (!value) return 'State code is required';
        if (!validateStateCode(value)) return 'State code must be between 1 and 38';
        break;
      case 'contact_person': if (!value?.trim()) return 'Contact person is required'; break;
      case 'phone':
        if (!value?.trim()) return 'Phone number is required';
        if (!validatePhone(value)) return 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
        break;
      case 'alternate_phone':
        if (value && !validatePhone(value)) return 'Please enter a valid 10-digit Indian mobile number';
        break;
      case 'email':
        if (!value?.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        break;
      case 'website':
        if (value && !validateUrl(value)) return 'Please enter a valid URL (e.g., www.example.com)';
        break;
      case 'gstin':
        if (!value?.trim()) return 'GSTIN is required';
        if (!validateGST(value)) return 'Please enter a valid GSTIN (e.g., 27AAPFU0939F1Z5)';
        break;
      case 'pan':
        if (value && !validatePAN(value)) return 'Please enter a valid PAN (e.g., AAAAA1234A)';
        break;
      case 'msme_number':
        if (value && value.length > 30) return 'MSME number should not exceed 30 characters';
        break;
      case 'payment_terms': if (!value) return 'Payment terms is required'; break;
      case 'credit_days': return validateCreditDays(value);
      case 'currency': if (!value) return 'Currency is required'; break;
      default: return '';
    }
    return '';
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    const check = (field, val) => {
      const err = validateField(field, val);
      if (err) { errors[field] = err; isValid = false; }
    };

    switch (step) {
      case 0:
        check('vendor_code', formData.vendor_code);
        check('vendor_name', formData.vendor_name);
        check('vendor_type', formData.vendor_type);
        check('address', formData.address);
        break;
      case 1:
        check('contact_person', formData.contact_person);
        check('phone', formData.phone);
        check('email', formData.email);
        check('state', formData.state);
        check('state_code', formData.state_code);
        if (formData.alternate_phone) check('alternate_phone', formData.alternate_phone);
        if (formData.website) check('website', formData.website);
        break;
      case 2:
        check('gstin', formData.gstin);
        if (formData.pan) check('pan', formData.pan);
        if (formData.msme_number) check('msme_number', formData.msme_number);
        break;
      case 3:
        check('payment_terms', formData.payment_terms);
        check('currency', formData.currency);
        if (formData.credit_days) check('credit_days', formData.credit_days);
        if (formData.bank_details.account_no) check('bank_details.account_no', formData.bank_details.account_no);
        if (formData.bank_details.ifsc) check('bank_details.ifsc', formData.bank_details.ifsc);
        break;
      default: return true;
    }

    setFieldErrors(errors);
    if (!isValid) setError('Please fix the errors in this section');
    return isValid;
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    const requiredFields = [
      'vendor_code', 'vendor_name', 'vendor_type', 'address',
      'state', 'state_code', 'contact_person', 'phone',
      'email', 'gstin', 'payment_terms', 'currency'
    ];

    requiredFields.forEach(field => {
      const value = formData[field];
      const isEmpty = value === undefined || value === null || value === '' ||
                      (typeof value === 'string' && !value.trim());
      if (isEmpty) { errors[field] = `${field.replace(/_/g, ' ')} is required`; isValid = false; }
    });

    const fieldsToValidate = [
      'vendor_code', 'vendor_name', 'vendor_type', 'address', 'state', 'state_code',
      'contact_person', 'phone', 'email', 'gstin', 'payment_terms', 'currency',
      'alternate_phone', 'website', 'pan', 'msme_number', 'credit_days',
      'bank_details.account_no', 'bank_details.ifsc'
    ];

    fieldsToValidate.forEach(field => {
      let value;
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        value = formData[parent]?.[child];
      } else {
        value = formData[field];
      }
      const hasValue = value !== undefined && value !== null && value !== '' &&
                       !(typeof value === 'string' && !value.trim());
      const isRequired = requiredFields.includes(field);
      if (hasValue || (isRequired && !hasValue)) {
        const err = validateField(field, value);
        if (err) { errors[field] = err; isValid = false; }
      }
    });

    setFieldErrors(errors);
    if (!isValid) setError('Please fix all validation errors');
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) { setError(''); setActiveStep(p => p + 1); }
  };
  const handleBack = () => { setError(''); setActiveStep(p => p - 1); };

  const handleSubmit = async () => {
    if (!validateAllFields()) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const cleanPhone = formData.phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
      const cleanAlt = formData.alternate_phone
        ? formData.alternate_phone.replace(/[\s\-]/g, '').replace(/^\+91/, '')
        : '';

      const submissionData = {
        vendor_code: formData.vendor_code,
        vendor_name: formData.vendor_name,
        vendor_type: formData.vendor_type,
        supply_category: formData.supply_category,
        address: formData.address,
        gstin: formData.gstin,
        pan: formData.pan || null,
        state: formData.state,
        state_code: parseInt(formData.state_code),
        msme_number: formData.msme_number || null,
        msme_category: formData.msme_category || null,
        contact_person: formData.contact_person,
        phone: cleanPhone,
        alternate_phone: cleanAlt || null,
        email: formData.email,
        website: formData.website || null,
        payment_terms: formData.payment_terms,
        credit_days: formData.credit_days ? parseInt(formData.credit_days) : 30,
        currency: formData.currency,
        bank_details: formData.bank_details.bank_name ? {
          bank_name: formData.bank_details.bank_name,
          account_no: formData.bank_details.account_no,
          ifsc: formData.bank_details.ifsc,
          branch: formData.bank_details.branch,
          account_name: formData.bank_details.account_name,
          account_type: formData.bank_details.account_type
        } : undefined,
        is_active: formData.is_active,
        updated_by: user._id
      };

      const response = await axios.put(`${BASE_URL}/api/vendors/${vendor._id}`, submissionData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update vendor');
      }
    } catch (err) {
      console.error('Error updating vendor:', err);
      setError(err.response?.data?.message || 'Failed to update vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      vendor_code: '', vendor_name: '', vendor_type: 'Raw Material',
      supply_category: [], address: '', gstin: '', pan: '',
      state: '', state_code: '', msme_number: '', msme_category: '',
      contact_person: '', phone: '', alternate_phone: '', email: '',
      website: '', payment_terms: 'Net 30', credit_days: '30', currency: 'INR',
      bank_details: { bank_name: '', account_no: '', ifsc: '', branch: '', account_name: '', account_type: 'Current' },
      is_active: true
    });
    setSupplyCategoryInput('');
    setFieldErrors({});
    setError('');
    setActiveStep(0);
  };

  const handleClose = () => { resetForm(); onClose(); };

  if (!vendor) return null;

  // Shared sx styles
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5, fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary },
    '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25 }
  };

  const selectSx = {
    borderRadius: 1.5, fontSize: '0.75rem',
    '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      VENDOR CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField fullWidth size="small" name="vendor_code" value={formData.vendor_code}
                      onChange={handleChange} disabled={loading} placeholder="e.g., VEN001"
                      error={!!fieldErrors.vendor_code} helperText={fieldErrors.vendor_code}
                      inputProps={{ maxLength: 20 }} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      VENDOR NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField fullWidth size="small" name="vendor_name" value={formData.vendor_name}
                      onChange={handleChange} disabled={loading} placeholder="e.g., ABC Enterprises"
                      error={!!fieldErrors.vendor_name} helperText={fieldErrors.vendor_name}
                      inputProps={{ maxLength: 100 }} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      VENDOR TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.vendor_type}>
                      <Select name="vendor_type" value={formData.vendor_type} onChange={handleSelectChange} disabled={loading} sx={selectSx}>
                        {vendorTypes.map(t => <MenuItem key={t.value} value={t.value} sx={{ fontSize: '0.75rem' }}>{t.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                    {fieldErrors.vendor_type && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>{fieldErrors.vendor_type}</Typography>}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ADDRESS <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField fullWidth size="small" name="address" value={formData.address}
                      onChange={handleChange} multiline rows={2} disabled={loading}
                      placeholder="Street address, city, pincode"
                      error={!!fieldErrors.address} helperText={fieldErrors.address} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      SUPPLY CATEGORY
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <TextField fullWidth size="small" value={supplyCategoryInput}
                        onChange={(e) => setSupplyCategoryInput(e.target.value)} disabled={loading}
                        placeholder="e.g., Copper Strip"
                        onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSupplyCategoryAdd(); } }}
                        sx={textFieldSx} />
                      <Button variant="outlined" size="small" onClick={handleSupplyCategoryAdd}
                        disabled={loading || !supplyCategoryInput.trim()}
                        sx={{ height: 32, minWidth: 70, borderRadius: 1.5, borderColor: COLORS.border, color: COLORS.primary, fontSize: '0.7rem', textTransform: 'none', '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` } }}>
                        Add
                      </Button>
                    </Box>
                    {formData.supply_category.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {formData.supply_category.map((cat, i) => (
                          <Chip key={i} label={cat} size="small" onDelete={() => handleSupplyCategoryDelete(cat)} disabled={loading}
                            sx={{ fontSize: '0.7rem', height: 24, bgcolor: COLORS.primaryLight, color: COLORS.primary, '& .MuiChip-deleteIcon': { color: COLORS.primary, fontSize: '0.8rem', '&:hover': { color: COLORS.primaryDark } } }} />
                        ))}
                      </Box>
                    )}
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      Press Enter or click Add to add supply categories
                    </Typography>
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
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Contact Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CONTACT PERSON <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField fullWidth size="small" name="contact_person" value={formData.contact_person}
                      onChange={handleChange} disabled={loading} placeholder="e.g., John Doe"
                      error={!!fieldErrors.contact_person} helperText={fieldErrors.contact_person} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PHONE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField fullWidth size="small" name="phone" value={formData.phone}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 9876543210"
                      error={!!fieldErrors.phone} helperText={fieldErrors.phone}
                      inputProps={{ maxLength: 15 }} sx={textFieldSx} />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      10-digit mobile number starting with 6-9
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ALTERNATE PHONE
                    </Typography>
                    <TextField fullWidth size="small" name="alternate_phone" value={formData.alternate_phone}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 9876543211"
                      error={!!fieldErrors.alternate_phone} helperText={fieldErrors.alternate_phone}
                      inputProps={{ maxLength: 15 }} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EMAIL <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField fullWidth size="small" name="email" value={formData.email}
                      onChange={handleChange} type="email" disabled={loading} placeholder="vendor@gmail.com"
                      error={!!fieldErrors.email} helperText={fieldErrors.email} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      WEBSITE
                    </Typography>
                    <TextField fullWidth size="small" name="website" value={formData.website}
                      onChange={handleChange} disabled={loading} placeholder="www.example.com"
                      error={!!fieldErrors.website} helperText={fieldErrors.website} sx={textFieldSx} />
                  </Box>
                </Grid>

                {/* STATE — Autocomplete with search functionality */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={INDIAN_STATES}
                      getOptionLabel={(option) => option.name}
                      value={INDIAN_STATES.find(s => s.name === formData.state) || null}
                      onChange={(event, newValue) => {
                        setFieldErrors(prev => ({ ...prev, state: '', state_code: '' }));
                        setFormData(prev => ({
                          ...prev,
                          state: newValue ? newValue.name : '',
                          state_code: newValue ? newValue.code : ''
                        }));
                      }}
                      disabled={loading}
                      disablePortal
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search and select state..."
                          error={!!fieldErrors.state}
                          helperText={fieldErrors.state}
                          sx={textFieldSx}
                        />
                      )}
                      ListboxProps={{
                        sx: {
                          '& .MuiAutocomplete-option': {
                            fontSize: '0.75rem',
                            py: 0.75
                          }
                        }
                      }}
                      noOptionsText="No states found"
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                            <Typography sx={{ fontSize: '0.75rem' }}>{option.name}</Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                              Code: {option.code}
                            </Typography>
                          </Stack>
                        </li>
                      )}
                    />
                  </Box>
                </Grid>

                {/*  STATE CODE — Auto-filled, read-only */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="state_code"
                      value={formData.state_code}
                      disabled={loading}
                      placeholder="Auto-filled on state selection"
                      error={!!fieldErrors.state_code}
                      helperText={fieldErrors.state_code}
                      InputProps={{
                        readOnly: true,
                        sx: {
                          bgcolor: formData.state_code ? COLORS.primaryLight : '#F9FAFB',
                          cursor: 'not-allowed'
                        }
                      }}
                      sx={{
                        ...textFieldSx,
                        '& .MuiOutlinedInput-root': {
                          ...textFieldSx['& .MuiOutlinedInput-root'],
                          bgcolor: formData.state_code ? COLORS.primaryLight : '#F9FAFB',
                        }
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Auto-filled based on selected state
                    </Typography>
                  </Box>
                </Grid>

              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Tax Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      GSTIN <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField fullWidth size="small" name="gstin" value={formData.gstin}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 27AAACM1234A1Z5"
                      error={!!fieldErrors.gstin} helperText={fieldErrors.gstin}
                      inputProps={{ maxLength: 15, style: { textTransform: 'uppercase' } }} sx={textFieldSx} />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      15 characters: 2 digits + 10 PAN + 3 chars
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAN NUMBER
                    </Typography>
                    <TextField fullWidth size="small" name="pan" value={formData.pan}
                      onChange={handleChange} disabled={loading} placeholder="e.g., AAAAA1234A"
                      error={!!fieldErrors.pan} helperText={fieldErrors.pan}
                      inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }} sx={textFieldSx} />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      10 characters: 5 letters + 4 digits + 1 letter
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                MSME Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MSME NUMBER
                    </Typography>
                    <TextField fullWidth size="small" name="msme_number" value={formData.msme_number}
                      onChange={handleChange} disabled={loading} placeholder="e.g., UDYAM-MH-01-1234567"
                      error={!!fieldErrors.msme_number} helperText={fieldErrors.msme_number}
                      inputProps={{ maxLength: 30 }} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MSME CATEGORY
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select name="msme_category" value={formData.msme_category} onChange={handleSelectChange} disabled={loading} sx={selectSx}>
                        <MenuItem value="" sx={{ fontSize: '0.75rem' }}>Select category</MenuItem>
                        {msmeCategories.map(cat => <MenuItem key={cat.value} value={cat.value} sx={{ fontSize: '0.75rem' }}>{cat.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Payment Terms
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAYMENT TERMS <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.payment_terms}>
                      <Select name="payment_terms" value={formData.payment_terms} onChange={handleSelectChange} disabled={loading} sx={selectSx}>
                        {paymentTermsOptions.map(t => <MenuItem key={t.value} value={t.value} sx={{ fontSize: '0.75rem' }}>{t.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                    {fieldErrors.payment_terms && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>{fieldErrors.payment_terms}</Typography>}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CREDIT DAYS
                    </Typography>
                    <TextField fullWidth size="small" name="credit_days" value={formData.credit_days}
                      onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 30"
                      error={!!fieldErrors.credit_days} helperText={fieldErrors.credit_days}
                      inputProps={{ min: 0, max: 365, onWheel: (e) => e.target.blur() }} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CURRENCY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.currency}>
                      <Select name="currency" value={formData.currency} onChange={handleSelectChange} disabled={loading} sx={selectSx}>
                        {currencies.map(c => <MenuItem key={c.value} value={c.value} sx={{ fontSize: '0.75rem' }}>{c.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                    {fieldErrors.currency && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>{fieldErrors.currency}</Typography>}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Bank Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>BANK NAME</Typography>
                    <TextField fullWidth size="small" value={formData.bank_details.bank_name} onChange={(e) => handleBankDetailsChange('bank_name', e.target.value)} disabled={loading} placeholder="e.g., HDFC Bank" sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>BRANCH</Typography>
                    <TextField fullWidth size="small" value={formData.bank_details.branch} onChange={(e) => handleBankDetailsChange('branch', e.target.value)} disabled={loading} placeholder="e.g., MIDC Industrial Area" sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>ACCOUNT NAME</Typography>
                    <TextField fullWidth size="small" value={formData.bank_details.account_name} onChange={(e) => handleBankDetailsChange('account_name', e.target.value)} disabled={loading} placeholder="e.g., ABC Metals Pvt Ltd" sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>ACCOUNT NUMBER</Typography>
                    <TextField fullWidth size="small" value={formData.bank_details.account_no} onChange={(e) => handleBankDetailsChange('account_no', e.target.value)} disabled={loading} placeholder="e.g., 50100123456789" error={!!fieldErrors['bank_details.account_no']} helperText={fieldErrors['bank_details.account_no']} inputProps={{ maxLength: 18 }} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>IFSC CODE</Typography>
                    <TextField fullWidth size="small" value={formData.bank_details.ifsc} onChange={(e) => handleBankDetailsChange('ifsc', e.target.value.toUpperCase())} disabled={loading} placeholder="e.g., HDFC0001234" error={!!fieldErrors['bank_details.ifsc']} helperText={fieldErrors['bank_details.ifsc']} inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }} sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>ACCOUNT TYPE</Typography>
                    <FormControl fullWidth size="small">
                      <Select value={formData.bank_details.account_type} onChange={(e) => handleBankDetailsChange('account_type', e.target.value)} disabled={loading} sx={selectSx}>
                        {accountTypes.map(t => <MenuItem key={t.value} value={t.value} sx={{ fontSize: '0.75rem' }}>{t.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 5, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', border: `1px solid ${COLORS.border}`, overflow: 'hidden', maxHeight: '95vh' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, bgcolor: COLORS.background.white, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Vendor
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {vendor?._id && (
              <Chip label={`ID: ${vendor._id.slice(-6)}`} size="small"
                sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: COLORS.background.light, color: COLORS.text.secondary, border: `1px solid ${COLORS.border}` }} />
            )}
            <Chip label={formData.is_active ? 'Active' : 'Inactive'} size="small"
              sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: formData.is_active ? COLORS.chips.active : COLORS.chips.inactive, color: formData.is_active ? COLORS.primaryDark : COLORS.text.secondary, border: `1px solid ${formData.is_active ? '#86efac' : COLORS.border}` }} />
          </Box>
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} sx={{ mb: 0.5, mt: 0.5 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel><Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>{label}</Typography></StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
        {renderStepContent(activeStep)}
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' }, fontSize: '0.75rem', py: 0.5 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <Button onClick={handleBack} disabled={activeStep === 0 || loading}
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
          sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none', '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` } }}>
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose} disabled={loading}
            sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none', '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` } }}>
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSubmit} disabled={loading}
              startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
              sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', '&:hover': { bgcolor: COLORS.primaryDark } }}>
              {loading ? 'Updating...' : 'Update Vendor'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} disabled={loading}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', '&:hover': { bgcolor: COLORS.primaryDark } }}>
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditVendor;