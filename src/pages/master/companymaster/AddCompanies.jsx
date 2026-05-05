// import React, { useState } from 'react';
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
//   Chip,
//   styled
// } from '@mui/material';
// import { 
//   Add as AddIcon, 
//   CloudUpload as CloudUploadIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants matching Users component
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

// // Modern Stepper Connector with Primary Color
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

// const steps = ['Company Information', 'Bank & Contact Details'];

// // Validation helper functions (keep all existing validation functions)
// const validateGST = (gst) => {
//   const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
//   return gstRegex.test(gst);
// };

// const validatePAN = (pan) => {
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//   return panRegex.test(pan);
// };

// const validateEmail = (email) => {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// };

// const validatePhone = (phone) => {
//   const cleanPhone = phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
//   const phoneRegex = /^[6-9]\d{9}$/;
//   return phoneRegex.test(cleanPhone);
// };

// const validateIFSC = (ifsc) => {
//   const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//   return ifsc ? ifscRegex.test(ifsc) : true;
// };

// const validateBankName = (bankName) => {
//   if (!bankName) return true;
//   const bankNameRegex = /^[A-Za-z\s\.\&\,\-]+$/;
//   return bankNameRegex.test(bankName);
// };

// const validateAccountNumber = (accountNo) => {
//   if (!accountNo) return true;
//   const accountRegex = /^\d{9,18}$/;
//   return accountRegex.test(accountNo);
// };

// const AddCompanies = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     company_id: '',
//     company_name: '',
//     address: '',
//     gstin: '',
//     pan: '',
//     state: '',
//     state_code: '',
//     phone: '',
//     email: '',
//     bank_details: {
//       bank_name: '',
//       account_no: '',
//       ifsc: '',
//       branch: ''
//     },
//     is_active: true
//   });
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

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
    
//     if (name === 'bank_name' || name === 'account_no' || name === 'ifsc' || name === 'branch') {
//       let processedValue = value;
      
//       if (name === 'ifsc') {
//         processedValue = value.toUpperCase();
//       }
      
//       if (name === 'account_no') {
//         processedValue = value.replace(/\D/g, '');
//       }
      
//       setFormData(prev => ({
//         ...prev,
//         bank_details: {
//           ...prev.bank_details,
//           [name]: processedValue
//         }
//       }));
//     } else {
//       let processedValue = value;
//       if (name === 'gstin' || name === 'pan') {
//         processedValue = value.toUpperCase();
//       }
      
//       setFormData(prev => ({
//         ...prev,
//         [name]: processedValue
//       }));
//     }
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       const maxSize = 2 * 1024 * 1024; // 2MB
      
//       if (!validTypes.includes(file.type)) {
//         setError('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
//         return;
//       }
      
//       if (file.size > maxSize) {
//         setError('Logo size should be less than 2MB');
//         return;
//       }
      
//       setLogoFile(file);
//       const previewUrl = URL.createObjectURL(file);
//       setLogoPreview(previewUrl);
//       setError('');
//     }
//   };

//   const validateField = (name, value, bankDetails = null) => {
//     switch (name) {
//       case 'gstin':
//         if (value && !validateGST(value)) {
//           return 'Please enter a valid GSTIN (e.g., 27AAPFU0939F1Z5)';
//         }
//         break;
//       case 'pan':
//         if (value && !validatePAN(value)) {
//           return 'Please enter a valid PAN (e.g., ABCDE1234F)';
//         }
//         break;
//       case 'email':
//         if (value && !validateEmail(value)) {
//           return 'Please enter a valid email address (e.g., company@gmail.com)';
//         }
//         break;
//       case 'phone':
//         if (value && !validatePhone(value)) {
//           return 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
//         }
//         break;
//       case 'state_code':
//         if (value && (value < 1 || value > 99)) {
//           return 'State code must be between 1 and 99';
//         }
//         break;
//       case 'bank_name':
//         if (value && !validateBankName(value)) {
//           return 'Bank name should contain only letters, spaces, and basic punctuation';
//         }
//         break;
//       case 'account_no':
//         if (value && !validateAccountNumber(value)) {
//           return 'Account number should be 9-18 digits only';
//         }
//         break;
//       case 'ifsc':
//         if (value && !validateIFSC(value)) {
//           return 'Please enter a valid IFSC code (e.g., SBIN0123456)';
//         }
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
//       case 0:
//         if (!formData.company_id?.trim()) {
//           errors.company_id = 'Company ID is required';
//           isValid = false;
//         } else if (formData.company_id.length > 20) {
//           errors.company_id = 'Company ID should not exceed 20 characters';
//           isValid = false;
//         }

//         if (!formData.company_name?.trim()) {
//           errors.company_name = 'Company name is required';
//           isValid = false;
//         } else if (formData.company_name.length > 100) {
//           errors.company_name = 'Company name should not exceed 100 characters';
//           isValid = false;
//         }

//         if (!formData.address?.trim()) {
//           errors.address = 'Address is required';
//           isValid = false;
//         }

//         if (!formData.gstin?.trim()) {
//           errors.gstin = 'GSTIN is required';
//           isValid = false;
//         } else {
//           const gstError = validateField('gstin', formData.gstin);
//           if (gstError) {
//             errors.gstin = gstError;
//             isValid = false;
//           }
//         }

//         if (!formData.pan?.trim()) {
//           errors.pan = 'PAN is required';
//           isValid = false;
//         } else {
//           const panError = validateField('pan', formData.pan);
//           if (panError) {
//             errors.pan = panError;
//             isValid = false;
//           }
//         }

//         if (!formData.state?.trim()) {
//           errors.state = 'State is required';
//           isValid = false;
//         }

//         if (!formData.state_code?.toString().trim()) {
//           errors.state_code = 'State code is required';
//           isValid = false;
//         } else {
//           const stateCodeError = validateField('state_code', Number(formData.state_code));
//           if (stateCodeError) {
//             errors.state_code = stateCodeError;
//             isValid = false;
//           }
//         }
//         break;
      
//       case 1:
//         if (!formData.email?.trim()) {
//           errors.email = 'Email is required';
//           isValid = false;
//         } else {
//           const emailError = validateField('email', formData.email);
//           if (emailError) {
//             errors.email = emailError;
//             isValid = false;
//           }
//         }

//         if (!formData.phone?.trim()) {
//           errors.phone = 'Phone number is required';
//           isValid = false;
//         } else {
//           const phoneError = validateField('phone', formData.phone);
//           if (phoneError) {
//             errors.phone = phoneError;
//             isValid = false;
//           }
//         }

//         if (formData.bank_details.bank_name) {
//           const bankNameError = validateField('bank_name', formData.bank_details.bank_name);
//           if (bankNameError) {
//             errors.bank_name = bankNameError;
//             isValid = false;
//           }
//         }

//         if (formData.bank_details.account_no) {
//           const accountError = validateField('account_no', formData.bank_details.account_no);
//           if (accountError) {
//             errors.account_no = accountError;
//             isValid = false;
//           }
//         }

//         if (formData.bank_details.ifsc) {
//           const ifscError = validateField('ifsc', formData.bank_details.ifsc);
//           if (ifscError) {
//             errors.ifsc = ifscError;
//             isValid = false;
//           }
//         }

//         if (formData.bank_details.branch && /\d/.test(formData.bank_details.branch)) {
//           errors.branch = 'Branch name should not contain numbers';
//           isValid = false;
//         }

//         const hasAnyBankDetail = formData.bank_details.bank_name || 
//                                  formData.bank_details.account_no || 
//                                  formData.bank_details.ifsc || 
//                                  formData.bank_details.branch;
        
//         if (hasAnyBankDetail) {
//           if (!formData.bank_details.bank_name) {
//             errors.bank_name = 'Bank name is required when providing bank details';
//             isValid = false;
//           }
//           if (!formData.bank_details.account_no) {
//             errors.account_no = 'Account number is required when providing bank details';
//             isValid = false;
//           }
//           if (!formData.bank_details.ifsc) {
//             errors.ifsc = 'IFSC code is required when providing bank details';
//             isValid = false;
//           }
//           if (!formData.bank_details.branch) {
//             errors.branch = 'Branch name is required when providing bank details';
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
//     const errors = {};
//     let isValid = true;

//     if (!formData.company_id?.trim()) {
//       errors.company_id = 'Company ID is required';
//       isValid = false;
//     }

//     if (!formData.company_name?.trim()) {
//       errors.company_name = 'Company name is required';
//       isValid = false;
//     }

//     if (!formData.address?.trim()) {
//       errors.address = 'Address is required';
//       isValid = false;
//     }

//     if (!formData.gstin?.trim()) {
//       errors.gstin = 'GSTIN is required';
//       isValid = false;
//     } else {
//       const gstError = validateField('gstin', formData.gstin);
//       if (gstError) {
//         errors.gstin = gstError;
//         isValid = false;
//       }
//     }

//     if (!formData.pan?.trim()) {
//       errors.pan = 'PAN is required';
//       isValid = false;
//     } else {
//       const panError = validateField('pan', formData.pan);
//       if (panError) {
//         errors.pan = panError;
//         isValid = false;
//       }
//     }

//     if (!formData.state?.trim()) {
//       errors.state = 'State is required';
//       isValid = false;
//     }

//     if (!formData.state_code?.toString().trim()) {
//       errors.state_code = 'State code is required';
//       isValid = false;
//     } else {
//       const stateCodeError = validateField('state_code', Number(formData.state_code));
//       if (stateCodeError) {
//         errors.state_code = stateCodeError;
//         isValid = false;
//       }
//     }

//     if (!formData.email?.trim()) {
//       errors.email = 'Email is required';
//       isValid = false;
//     } else {
//       const emailError = validateField('email', formData.email);
//       if (emailError) {
//         errors.email = emailError;
//         isValid = false;
//       }
//     }

//     if (!formData.phone?.trim()) {
//       errors.phone = 'Phone number is required';
//       isValid = false;
//     } else {
//       const phoneError = validateField('phone', formData.phone);
//       if (phoneError) {
//         errors.phone = phoneError;
//         isValid = false;
//       }
//     }

//     const hasAnyBankDetail = formData.bank_details.bank_name || 
//                              formData.bank_details.account_no || 
//                              formData.bank_details.ifsc || 
//                              formData.bank_details.branch;
    
//     if (hasAnyBankDetail) {
//       if (!formData.bank_details.bank_name) {
//         errors.bank_name = 'Bank name is required when providing bank details';
//         isValid = false;
//       } else {
//         const bankNameError = validateField('bank_name', formData.bank_details.bank_name);
//         if (bankNameError) {
//           errors.bank_name = bankNameError;
//           isValid = false;
//         }
//       }

//       if (!formData.bank_details.account_no) {
//         errors.account_no = 'Account number is required when providing bank details';
//         isValid = false;
//       } else {
//         const accountError = validateField('account_no', formData.bank_details.account_no);
//         if (accountError) {
//           errors.account_no = accountError;
//           isValid = false;
//         }
//       }

//       if (!formData.bank_details.ifsc) {
//         errors.ifsc = 'IFSC code is required when providing bank details';
//         isValid = false;
//       } else {
//         const ifscError = validateField('ifsc', formData.bank_details.ifsc);
//         if (ifscError) {
//           errors.ifsc = ifscError;
//           isValid = false;
//         }
//       }

//       if (!formData.bank_details.branch) {
//         errors.branch = 'Branch name is required when providing bank details';
//         isValid = false;
//       } else if (/\d/.test(formData.bank_details.branch)) {
//         errors.branch = 'Branch name should not contain numbers';
//         isValid = false;
//       }
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fix all validation errors');
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
//     if (!validateAllFields()) {
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');

//       const dataToSend = {
//         company_id: formData.company_id,
//         company_name: formData.company_name,
//         address: formData.address,
//         gstin: formData.gstin,
//         pan: formData.pan,
//         state: formData.state,
//         state_code: Number(formData.state_code),
//         phone: formData.phone.replace(/[\s\-]/g, '').replace(/^\+91/, ''),
//         email: formData.email,
//         is_active: formData.is_active,
//         bank_details: {
//           bank_name: formData.bank_details.bank_name || '',
//           account_no: formData.bank_details.account_no || '',
//           ifsc: formData.bank_details.ifsc ? formData.bank_details.ifsc.toUpperCase() : '',
//           branch: formData.bank_details.branch || ''
//         }
//       };

//       let response;
      
//       if (logoFile) {
//         const formDataWithLogo = new FormData();
        
//         Object.keys(dataToSend).forEach(key => {
//           if (key === 'bank_details') {
//             formDataWithLogo.append(key, JSON.stringify(dataToSend[key]));
//           } else {
//             formDataWithLogo.append(key, dataToSend[key]);
//           }
//         });
        
//         formDataWithLogo.append('logo', logoFile);

//         response = await axios.post(`${BASE_URL}/api/company`, formDataWithLogo, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         response = await axios.post(`${BASE_URL}/api/company`, dataToSend, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       }

//       if (response.data) {
//         let companyData;
        
//         if (response.data.success && response.data.data) {
//           companyData = response.data.data;
//         } else if (response.data.company) {
//           companyData = response.data.company;
//         } else {
//           companyData = response.data;
//         }

//         if (!companyData.bank_details) {
//           companyData.bank_details = {
//             bank_name: '',
//             account_no: '',
//             ifsc: '',
//             branch: ''
//           };
//         }

//         onAdd(companyData);
//         resetForm();
//         onClose();
//       }
//     } catch (err) {
//       console.error('Error adding company:', err);
//       setError(err.response?.data?.message || 'Failed to add company. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       company_id: '',
//       company_name: '',
//       address: '',
//       gstin: '',
//       pan: '',
//       state: '',
//       state_code: '',
//       phone: '',
//       email: '',
//       bank_details: {
//         bank_name: '',
//         account_no: '',
//         ifsc: '',
//         branch: ''
//       },
//       is_active: true
//     });
//     setFieldErrors({});
//     setLogoFile(null);
//     setLogoPreview('');
//     setActiveStep(0);
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             {/* Logo Upload Section */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Company Logo
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12 }}>
//                   <Stack direction="row" alignItems="center" spacing={2}>
//                     <Button
//                       variant="outlined"
//                       component="label"
//                       startIcon={<CloudUploadIcon sx={{ fontSize: '1rem' }} />}
//                       disabled={loading}
//                       sx={{
//                         height: 32,
//                         px: 2,
//                         borderRadius: 1.5,
//                         border: `1px solid ${COLORS.border}`,
//                         color: COLORS.text.secondary,
//                         fontSize: '0.7rem',
//                         fontWeight: 500,
//                         textTransform: 'none',
//                         '&:hover': {
//                           borderColor: COLORS.primary,
//                           bgcolor: `${COLORS.primary}10`
//                         }
//                       }}
//                     >
//                       Upload Logo (Max 2MB)
//                       <input
//                         type="file"
//                         hidden
//                         accept="image/jpeg,image/png,image/gif,image/webp"
//                         onChange={handleLogoChange}
//                       />
//                     </Button>
//                     {logoPreview && (
//                       <Box
//                         component="img"
//                         src={logoPreview}
//                         alt="Logo preview"
//                         sx={{ height: 40, width: 40, objectFit: 'contain', borderRadius: 1 }}
//                       />
//                     )}
//                   </Stack>
//                   <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 1 }}>
//                     Supported formats: JPEG, PNG, GIF, WEBP (Max 2MB)
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Company Information Section */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Company Details
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       COMPANY ID <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="company_id"
//                       value={formData.company_id}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., COMP001"
//                       error={!!fieldErrors.company_id}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     {fieldErrors.company_id && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.company_id}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       COMPANY NAME <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="company_name"
//                       value={formData.company_name}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., Tech Solutions Ltd"
//                       error={!!fieldErrors.company_name}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     {fieldErrors.company_name && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.company_name}
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
//                       required
//                       multiline
//                       rows={2}
//                       disabled={loading}
//                       placeholder="Enter complete address"
//                       error={!!fieldErrors.address}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     {fieldErrors.address && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.address}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
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
//                       placeholder="e.g., 27AAPFU0939F1Z5"
//                       error={!!fieldErrors.gstin}
//                       inputProps={{ maxLength: 15, style: { textTransform: 'uppercase' } }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       15 characters: 2 digits + 10 PAN + 3 chars
//                     </Typography>
//                     {fieldErrors.gstin && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.gstin}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       PAN <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="pan"
//                       value={formData.pan}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., ABCDE1234F"
//                       error={!!fieldErrors.pan}
//                       inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       10 characters: 5 letters + 4 numbers + 1 letter
//                     </Typography>
//                     {fieldErrors.pan && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.pan}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
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
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     {fieldErrors.state && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.state}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
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
//                       type="number"
//                       disabled={loading}
//                       placeholder="e.g., 27"
//                       error={!!fieldErrors.state_code}
//                       inputProps={{ min: 1, max: 99 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         },
//                         '& input[type=number]': {
//                           MozAppearance: 'textfield'
//                         },
//                         '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
//                           WebkitAppearance: 'none',
//                           margin: 0
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       Between 1 and 99
//                     </Typography>
//                     {fieldErrors.state_code && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.state_code}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );
      
//       case 1:
//         return (
//           <Stack spacing={2}>
//             {/* Contact Details Section */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Contact Details
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       EMAIL <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="company@gmail.com"
//                       error={!!fieldErrors.email}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       e.g., company@gmail.com
//                     </Typography>
//                     {fieldErrors.email && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.email}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
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
//                       inputProps={{ maxLength: 15 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       10-digit mobile number starting with 6-9
//                     </Typography>
//                     {fieldErrors.phone && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.phone}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Bank Details Section */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Bank Details
//                 <Typography component="span" sx={{ fontSize: '0.65rem', ml: 1, color: COLORS.text.tertiary, fontWeight: 'normal' }}>
//                   (All fields optional, but if provided, all are required)
//                 </Typography>
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       BANK NAME
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="bank_name"
//                       value={formData.bank_details.bank_name}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., State Bank of India"
//                       error={!!fieldErrors.bank_name}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       Letters and spaces only
//                     </Typography>
//                     {fieldErrors.bank_name && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.bank_name}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       BRANCH
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="branch"
//                       value={formData.bank_details.branch}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., Andheri East"
//                       error={!!fieldErrors.branch}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       Branch name without numbers
//                     </Typography>
//                     {fieldErrors.branch && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.branch}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       ACCOUNT NUMBER
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="account_no"
//                       value={formData.bank_details.account_no}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., 123456789012"
//                       error={!!fieldErrors.account_no}
//                       inputProps={{ maxLength: 18 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         },
//                         '& input[type=number]': {
//                           MozAppearance: 'textfield'
//                         },
//                         '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
//                           WebkitAppearance: 'none',
//                           margin: 0
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       9-18 digits only
//                     </Typography>
//                     {fieldErrors.account_no && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.account_no}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       IFSC CODE
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="ifsc"
//                       value={formData.bank_details.ifsc}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., SBIN0123456"
//                       error={!!fieldErrors.ifsc}
//                       inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       4 letters + 0 + 6 alphanumeric
//                     </Typography>
//                     {fieldErrors.ifsc && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.ifsc}
//                       </Typography>
//                     )}
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
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//           Add New Company
//         </Typography>
//       </DialogTitle>

//       {/* Modern Stepper with Primary Color */}
//       <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//         >
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
//           <Alert 
//             severity="error" 
//             sx={{ 
//               mt: 2, 
//               borderRadius: 1.5,
//               fontSize: '0.75rem',
//               py: 0.5,
//               '& .MuiAlert-icon': { fontSize: '1.25rem' }
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
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleBack}
//           disabled={activeStep === 0 || loading}
//           size="small"
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
//             size="small"
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
//               disabled={loading}
//               size="small"
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
//               {loading ? 'Adding...' : 'Add Company'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading}
//               size="small"
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

// export default AddCompanies;





import React, { useState } from 'react';
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
  Chip,
  styled,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  CloudUpload as CloudUploadIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Close as CloseIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching Users component
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

// Modern Stepper Connector with Primary Color
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

const steps = ['Company Information', 'Bank & Contact Details'];

// Validation helper functions
const validateGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const cleanPhone = phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

const validateIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifsc ? ifscRegex.test(ifsc) : true;
};

const validateBankName = (bankName) => {
  if (!bankName) return true;
  const bankNameRegex = /^[A-Za-z\s\.\&\,\-]+$/;
  return bankNameRegex.test(bankName);
};

const validateAccountNumber = (accountNo) => {
  if (!accountNo) return true;
  const accountRegex = /^\d{9,18}$/;
  return accountRegex.test(accountNo);
};

// Floating Error Alert Component
const FloatingErrorAlert = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <Collapse in={!!error}>
      <Alert
        severity="error"
        variant="filled"
        onClose={onClose}
        icon={<ErrorIcon sx={{ fontSize: '1rem' }} />}
        sx={{
          mb: 2,
          borderRadius: 1.5,
          fontSize: '0.75rem',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '& .MuiAlert-icon': {
            fontSize: '1rem',
            alignItems: 'center'
          },
          '& .MuiAlert-message': {
            py: 0.5,
            fontSize: '0.75rem'
          },
          '& .MuiAlert-action': {
            py: 0,
            alignItems: 'center'
          }
        }}
      >
        {error}
      </Alert>
    </Collapse>
  );
};

const AddCompanies = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    company_id: '',
    company_name: '',
    address: '',
    gstin: '',
    pan: '',
    state: '',
    state_code: '',
    phone: '',
    email: '',
    bank_details: {
      bank_name: '',
      account_no: '',
      ifsc: '',
      branch: ''
    },
    is_active: true
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showError = (message) => {
    setError(message);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    if (name === 'bank_name' || name === 'account_no' || name === 'ifsc' || name === 'branch') {
      let processedValue = value;
      
      if (name === 'ifsc') {
        processedValue = value.toUpperCase();
      }
      
      if (name === 'account_no') {
        processedValue = value.replace(/\D/g, '');
      }
      
      setFormData(prev => ({
        ...prev,
        bank_details: {
          ...prev.bank_details,
          [name]: processedValue
        }
      }));
    } else {
      let processedValue = value;
      if (name === 'gstin' || name === 'pan') {
        processedValue = value.toUpperCase();
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!validTypes.includes(file.type)) {
        showError('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
        return;
      }
      
      if (file.size > maxSize) {
        showError('Logo size should be less than 2MB');
        return;
      }
      
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const validateField = (name, value, bankDetails = null) => {
    switch (name) {
      case 'gstin':
        if (value && !validateGST(value)) {
          return 'Please enter a valid GSTIN (e.g., 27AAPFU0939F1Z5)';
        }
        break;
      case 'pan':
        if (value && !validatePAN(value)) {
          return 'Please enter a valid PAN (e.g., ABCDE1234F)';
        }
        break;
      case 'email':
        if (value && !validateEmail(value)) {
          return 'Please enter a valid email address (e.g., company@gmail.com)';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          return 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
        }
        break;
      case 'state_code':
        if (value && (value < 1 || value > 99)) {
          return 'State code must be between 1 and 99';
        }
        break;
      case 'bank_name':
        if (value && !validateBankName(value)) {
          return 'Bank name should contain only letters, spaces, and basic punctuation';
        }
        break;
      case 'account_no':
        if (value && !validateAccountNumber(value)) {
          return 'Account number should be 9-18 digits only';
        }
        break;
      case 'ifsc':
        if (value && !validateIFSC(value)) {
          return 'Please enter a valid IFSC code (e.g., SBIN0123456)';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    switch (step) {
      case 0:
        if (!formData.company_id?.trim()) {
          errors.company_id = 'Company ID is required';
          errorMessages.push('Company ID is required');
          isValid = false;
        } else if (formData.company_id.length > 20) {
          errors.company_id = 'Company ID should not exceed 20 characters';
          errorMessages.push('Company ID should not exceed 20 characters');
          isValid = false;
        }

        if (!formData.company_name?.trim()) {
          errors.company_name = 'Company name is required';
          errorMessages.push('Company name is required');
          isValid = false;
        } else if (formData.company_name.length > 100) {
          errors.company_name = 'Company name should not exceed 100 characters';
          errorMessages.push('Company name should not exceed 100 characters');
          isValid = false;
        }

        if (!formData.address?.trim()) {
          errors.address = 'Address is required';
          errorMessages.push('Address is required');
          isValid = false;
        }

        if (!formData.gstin?.trim()) {
          errors.gstin = 'GSTIN is required';
          errorMessages.push('GSTIN is required');
          isValid = false;
        } else {
          const gstError = validateField('gstin', formData.gstin);
          if (gstError) {
            errors.gstin = gstError;
            errorMessages.push(gstError);
            isValid = false;
          }
        }

        if (!formData.pan?.trim()) {
          errors.pan = 'PAN is required';
          errorMessages.push('PAN is required');
          isValid = false;
        } else {
          const panError = validateField('pan', formData.pan);
          if (panError) {
            errors.pan = panError;
            errorMessages.push(panError);
            isValid = false;
          }
        }

        if (!formData.state?.trim()) {
          errors.state = 'State is required';
          errorMessages.push('State is required');
          isValid = false;
        }

        if (!formData.state_code?.toString().trim()) {
          errors.state_code = 'State code is required';
          errorMessages.push('State code is required');
          isValid = false;
        } else {
          const stateCodeError = validateField('state_code', Number(formData.state_code));
          if (stateCodeError) {
            errors.state_code = stateCodeError;
            errorMessages.push(stateCodeError);
            isValid = false;
          }
        }
        break;
      
      case 1:
        if (!formData.email?.trim()) {
          errors.email = 'Email is required';
          errorMessages.push('Email is required');
          isValid = false;
        } else {
          const emailError = validateField('email', formData.email);
          if (emailError) {
            errors.email = emailError;
            errorMessages.push(emailError);
            isValid = false;
          }
        }

        if (!formData.phone?.trim()) {
          errors.phone = 'Phone number is required';
          errorMessages.push('Phone number is required');
          isValid = false;
        } else {
          const phoneError = validateField('phone', formData.phone);
          if (phoneError) {
            errors.phone = phoneError;
            errorMessages.push(phoneError);
            isValid = false;
          }
        }

        if (formData.bank_details.bank_name) {
          const bankNameError = validateField('bank_name', formData.bank_details.bank_name);
          if (bankNameError) {
            errors.bank_name = bankNameError;
            errorMessages.push(bankNameError);
            isValid = false;
          }
        }

        if (formData.bank_details.account_no) {
          const accountError = validateField('account_no', formData.bank_details.account_no);
          if (accountError) {
            errors.account_no = accountError;
            errorMessages.push(accountError);
            isValid = false;
          }
        }

        if (formData.bank_details.ifsc) {
          const ifscError = validateField('ifsc', formData.bank_details.ifsc);
          if (ifscError) {
            errors.ifsc = ifscError;
            errorMessages.push(ifscError);
            isValid = false;
          }
        }

        if (formData.bank_details.branch && /\d/.test(formData.bank_details.branch)) {
          errors.branch = 'Branch name should not contain numbers';
          errorMessages.push('Branch name should not contain numbers');
          isValid = false;
        }

        const hasAnyBankDetail = formData.bank_details.bank_name || 
                                 formData.bank_details.account_no || 
                                 formData.bank_details.ifsc || 
                                 formData.bank_details.branch;
        
        if (hasAnyBankDetail) {
          if (!formData.bank_details.bank_name) {
            errors.bank_name = 'Bank name is required when providing bank details';
            errorMessages.push('Bank name is required when providing bank details');
            isValid = false;
          }
          if (!formData.bank_details.account_no) {
            errors.account_no = 'Account number is required when providing bank details';
            errorMessages.push('Account number is required when providing bank details');
            isValid = false;
          }
          if (!formData.bank_details.ifsc) {
            errors.ifsc = 'IFSC code is required when providing bank details';
            errorMessages.push('IFSC code is required when providing bank details');
            isValid = false;
          }
          if (!formData.bank_details.branch) {
            errors.branch = 'Branch name is required when providing bank details';
            errorMessages.push('Branch name is required when providing bank details');
            isValid = false;
          }
        }
        break;
      
      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      // Show first error as floating message
      showError(errorMessages[0]);
    }
    return isValid;
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    if (!formData.company_id?.trim()) {
      errors.company_id = 'Company ID is required';
      errorMessages.push('Company ID is required');
      isValid = false;
    }

    if (!formData.company_name?.trim()) {
      errors.company_name = 'Company name is required';
      errorMessages.push('Company name is required');
      isValid = false;
    }

    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
      errorMessages.push('Address is required');
      isValid = false;
    }

    if (!formData.gstin?.trim()) {
      errors.gstin = 'GSTIN is required';
      errorMessages.push('GSTIN is required');
      isValid = false;
    } else {
      const gstError = validateField('gstin', formData.gstin);
      if (gstError) {
        errors.gstin = gstError;
        errorMessages.push(gstError);
        isValid = false;
      }
    }

    if (!formData.pan?.trim()) {
      errors.pan = 'PAN is required';
      errorMessages.push('PAN is required');
      isValid = false;
    } else {
      const panError = validateField('pan', formData.pan);
      if (panError) {
        errors.pan = panError;
        errorMessages.push(panError);
        isValid = false;
      }
    }

    if (!formData.state?.trim()) {
      errors.state = 'State is required';
      errorMessages.push('State is required');
      isValid = false;
    }

    if (!formData.state_code?.toString().trim()) {
      errors.state_code = 'State code is required';
      errorMessages.push('State code is required');
      isValid = false;
    } else {
      const stateCodeError = validateField('state_code', Number(formData.state_code));
      if (stateCodeError) {
        errors.state_code = stateCodeError;
        errorMessages.push(stateCodeError);
        isValid = false;
      }
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
      errorMessages.push('Email is required');
      isValid = false;
    } else {
      const emailError = validateField('email', formData.email);
      if (emailError) {
        errors.email = emailError;
        errorMessages.push(emailError);
        isValid = false;
      }
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
      errorMessages.push('Phone number is required');
      isValid = false;
    } else {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) {
        errors.phone = phoneError;
        errorMessages.push(phoneError);
        isValid = false;
      }
    }

    const hasAnyBankDetail = formData.bank_details.bank_name || 
                             formData.bank_details.account_no || 
                             formData.bank_details.ifsc || 
                             formData.bank_details.branch;
    
    if (hasAnyBankDetail) {
      if (!formData.bank_details.bank_name) {
        errors.bank_name = 'Bank name is required when providing bank details';
        errorMessages.push('Bank name is required when providing bank details');
        isValid = false;
      } else {
        const bankNameError = validateField('bank_name', formData.bank_details.bank_name);
        if (bankNameError) {
          errors.bank_name = bankNameError;
          errorMessages.push(bankNameError);
          isValid = false;
        }
      }

      if (!formData.bank_details.account_no) {
        errors.account_no = 'Account number is required when providing bank details';
        errorMessages.push('Account number is required when providing bank details');
        isValid = false;
      } else {
        const accountError = validateField('account_no', formData.bank_details.account_no);
        if (accountError) {
          errors.account_no = accountError;
          errorMessages.push(accountError);
          isValid = false;
        }
      }

      if (!formData.bank_details.ifsc) {
        errors.ifsc = 'IFSC code is required when providing bank details';
        errorMessages.push('IFSC code is required when providing bank details');
        isValid = false;
      } else {
        const ifscError = validateField('ifsc', formData.bank_details.ifsc);
        if (ifscError) {
          errors.ifsc = ifscError;
          errorMessages.push(ifscError);
          isValid = false;
        }
      }

      if (!formData.bank_details.branch) {
        errors.branch = 'Branch name is required when providing bank details';
        errorMessages.push('Branch name is required when providing bank details');
        isValid = false;
      } else if (/\d/.test(formData.bank_details.branch)) {
        errors.branch = 'Branch name should not contain numbers';
        errorMessages.push('Branch name should not contain numbers');
        isValid = false;
      }
    }

    setFieldErrors(errors);
    if (!isValid) {
      // Show first error as floating message
      showError(errorMessages[0]);
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const dataToSend = {
        company_id: formData.company_id,
        company_name: formData.company_name,
        address: formData.address,
        gstin: formData.gstin,
        pan: formData.pan,
        state: formData.state,
        state_code: Number(formData.state_code),
        phone: formData.phone.replace(/[\s\-]/g, '').replace(/^\+91/, ''),
        email: formData.email,
        is_active: formData.is_active,
        bank_details: {
          bank_name: formData.bank_details.bank_name || '',
          account_no: formData.bank_details.account_no || '',
          ifsc: formData.bank_details.ifsc ? formData.bank_details.ifsc.toUpperCase() : '',
          branch: formData.bank_details.branch || ''
        }
      };

      let response;
      
      if (logoFile) {
        const formDataWithLogo = new FormData();
        
        Object.keys(dataToSend).forEach(key => {
          if (key === 'bank_details') {
            formDataWithLogo.append(key, JSON.stringify(dataToSend[key]));
          } else {
            formDataWithLogo.append(key, dataToSend[key]);
          }
        });
        
        formDataWithLogo.append('logo', logoFile);

        response = await axios.post(`${BASE_URL}/api/company`, formDataWithLogo, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/company`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.data) {
        let companyData;
        
        if (response.data.success && response.data.data) {
          companyData = response.data.data;
        } else if (response.data.company) {
          companyData = response.data.company;
        } else {
          companyData = response.data;
        }

        if (!companyData.bank_details) {
          companyData.bank_details = {
            bank_name: '',
            account_no: '',
            ifsc: '',
            branch: ''
          };
        }

        onAdd(companyData);
        resetForm();
        onClose();
      }
    } catch (err) {
      console.error('Error adding company:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add company. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company_id: '',
      company_name: '',
      address: '',
      gstin: '',
      pan: '',
      state: '',
      state_code: '',
      phone: '',
      email: '',
      bank_details: {
        bank_name: '',
        account_no: '',
        ifsc: '',
        branch: ''
      },
      is_active: true
    });
    setFieldErrors({});
    setLogoFile(null);
    setLogoPreview('');
    setActiveStep(0);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Logo Upload Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Company Logo
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon sx={{ fontSize: '1rem' }} />}
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
                      Upload Logo (Max 2MB)
                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleLogoChange}
                      />
                    </Button>
                    {logoPreview && (
                      <Box
                        component="img"
                        src={logoPreview}
                        alt="Logo preview"
                        sx={{ height: 40, width: 40, objectFit: 'contain', borderRadius: 1 }}
                      />
                    )}
                  </Stack>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 1 }}>
                    Supported formats: JPEG, PNG, GIF, WEBP (Max 2MB)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Company Information Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Company Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      COMPANY ID <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="company_id"
                      value={formData.company_id}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., COMP001"
                      error={!!fieldErrors.company_id}
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
                    {fieldErrors.company_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.company_id}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      COMPANY NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Tech Solutions Ltd"
                      error={!!fieldErrors.company_name}
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
                    {fieldErrors.company_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.company_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ADDRESS <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      multiline
                      rows={2}
                      disabled={loading}
                      placeholder="Enter complete address"
                      error={!!fieldErrors.address}
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
                    {fieldErrors.address && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      GSTIN <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 27AAPFU0939F1Z5"
                      error={!!fieldErrors.gstin}
                      inputProps={{ maxLength: 15, style: { textTransform: 'uppercase' } }}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      15 characters: 2 digits + 10 PAN + 3 chars
                    </Typography>
                    {fieldErrors.gstin && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.gstin}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAN <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., ABCDE1234F"
                      error={!!fieldErrors.pan}
                      inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      10 characters: 5 letters + 4 numbers + 1 letter
                    </Typography>
                    {fieldErrors.pan && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.pan}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Maharashtra"
                      error={!!fieldErrors.state}
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
                    {fieldErrors.state && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.state}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="state_code"
                      value={formData.state_code}
                      onChange={handleChange}
                      type="number"
                      disabled={loading}
                      placeholder="e.g., 27"
                      error={!!fieldErrors.state_code}
                      inputProps={{ min: 1, max: 99 }}
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
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0
                        }
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Between 1 and 99
                    </Typography>
                    {fieldErrors.state_code && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.state_code}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2}>
            {/* Contact Details Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Contact Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EMAIL <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="company@gmail.com"
                      error={!!fieldErrors.email}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      e.g., company@gmail.com
                    </Typography>
                    {fieldErrors.email && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.email}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PHONE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 9876543210"
                      error={!!fieldErrors.phone}
                      inputProps={{ maxLength: 15 }}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      10-digit mobile number starting with 6-9
                    </Typography>
                    {fieldErrors.phone && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.phone}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Bank Details Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Bank Details
                <Typography component="span" sx={{ fontSize: '0.65rem', ml: 1, color: COLORS.text.tertiary, fontWeight: 'normal' }}>
                  (All fields optional, but if provided, all are required)
                </Typography>
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BANK NAME
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="bank_name"
                      value={formData.bank_details.bank_name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., State Bank of India"
                      error={!!fieldErrors.bank_name}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters and spaces only
                    </Typography>
                    {fieldErrors.bank_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.bank_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BRANCH
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="branch"
                      value={formData.bank_details.branch}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Andheri East"
                      error={!!fieldErrors.branch}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Branch name without numbers
                    </Typography>
                    {fieldErrors.branch && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.branch}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ACCOUNT NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="account_no"
                      value={formData.bank_details.account_no}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 123456789012"
                      error={!!fieldErrors.account_no}
                      inputProps={{ maxLength: 18 }}
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
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0
                        }
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      9-18 digits only
                    </Typography>
                    {fieldErrors.account_no && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.account_no}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      IFSC CODE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="ifsc"
                      value={formData.bank_details.ifsc}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., SBIN0123456"
                      error={!!fieldErrors.ifsc}
                      inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      4 letters + 0 + 6 alphanumeric
                    </Typography>
                    {fieldErrors.ifsc && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.ifsc}
                      </Typography>
                    )}
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
          overflow: 'hidden'
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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Add New Company
        </Typography>
      </DialogTitle>

      {/* Floating Error Alert - Positioned at top of dialog content, above stepper */}
      <Box sx={{ px: 2.5, pt: 1 }}>
        <FloatingErrorAlert error={error} onClose={() => setError('')} />
      </Box>

      {/* Modern Stepper with Primary Color */}
      <Box sx={{ px: 2.5, pt: error ? 1 : 2, pb: 1, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white, pt: 2 }}>
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
          size="small"
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
            size="small"
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
              disabled={loading}
              size="small"
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
              {loading ? 'Adding...' : 'Add Company'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              size="small"
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

export default AddCompanies;