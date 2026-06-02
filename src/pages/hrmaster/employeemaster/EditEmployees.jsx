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
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   styled,
//   FormHelperText,
//   InputAdornment,
//   Autocomplete,
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   Search as SearchIcon,
//   Person as PersonIcon,
//   Work as WorkIcon,
//   AccountBalance as AccountBalanceIcon,
//   Emergency as EmergencyIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import AddDepartments from '../departmentmaster/AddDepartments';
// import AddDesignations from '../designationmaster/AddDesignations';

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

// // Custom styled Paper component for dropdown without scrollbars
// const CustomPaper = styled(Paper)({
//   maxHeight: 200,
//   overflow: 'auto',
//   '&::-webkit-scrollbar': {
//     display: 'none'
//   },
//   scrollbarWidth: 'none',
//   '-ms-overflow-style': 'none',
//   '& .MuiAutocomplete-listbox': {
//     '&::-webkit-scrollbar': {
//       display: 'none'
//     },
//     scrollbarWidth: 'none',
//     '-ms-overflow-style': 'none'
//   }
// });

// // Custom styled MenuProps for Select components
// const selectMenuProps = {
//   PaperProps: {
//     sx: {
//       maxHeight: 200,
//       overflow: 'auto',
//       '&::-webkit-scrollbar': {
//         display: 'none'
//       },
//       scrollbarWidth: 'none',
//       '-ms-overflow-style': 'none'
//     }
//   }
// };

// const steps = ['Personal Information', 'Employment Details', 'Pay & Work', 'Bank & Emergency'];

// // Validation helper functions
// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const validatePhone = (phone) => {
//   const phoneRegex = /^(\+91[\-\s]?)?[0]?[6-9]\d{9}$/;
//   return phone ? phoneRegex.test(phone.replace(/[\s\-]/g, '')) : true;
// };

// const validatePAN = (pan) => {
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//   return pan ? panRegex.test(pan) : true;
// };

// const validateAadhar = (aadhar) => {
//   const aadharRegex = /^\d{12}$/;
//   return aadhar ? aadharRegex.test(aadhar) : true;
// };

// const validateIFSC = (ifsc) => {
//   const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//   return ifsc ? ifscRegex.test(ifsc) : true;
// };

// const validateAccountNumber = (accNo) => {
//   const accRegex = /^\d{9,18}$/;
//   return accNo ? accRegex.test(accNo) : true;
// };

// const validatePIN = (pin) => {
//   const pinRegex = /^\d{6}$/;
//   return pin ? pinRegex.test(pin) : true;
// };

// const validatePFNumber = (pf) => {
//   const pfRegex = /^[A-Z]{2}\/\d{5}\/\d{7}$/;
//   return pf ? pfRegex.test(pf) : true;
// };

// const validateUAN = (uan) => {
//   const uanRegex = /^\d{12}$/;
//   return uan ? uanRegex.test(uan) : true;
// };

// const validateESINumber = (esi) => {
//   const esiRegex = /^\d{17}$/;
//   return esi ? esiRegex.test(esi) : true;
// };

// const validateName = (name) => {
//   const nameRegex = /^[A-Za-z\s.'-]+$/;
//   return name ? nameRegex.test(name) : true;
// };

// const EditEmployees = ({ open, onClose, employee, onUpdate }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     // Personal Information
//     FirstName: '',
//     LastName: '',
//     Gender: 'M',
//     DateOfBirth: '',
//     Email: '',
//     Phone: '',
//     Address: '',

//     // Employment Details
//     DepartmentID: '',
//     DesignationID: '',
//     DateOfJoining: '',
//     EmploymentStatus: 'active',

//     // Pay & Work
//     EmploymentType: 'Monthly',
//     PayStructureType: 'Fixed',
//     BasicSalary: '',
//     HourlyRate: '',
//     OvertimeRateMultiplier: 1.5,
//     SkillLevel: 'Semi-Skilled',
//     WorkStation: '',
//     LineNumber: '',

//     // Tax & Identification
//     PAN: '',
//     AadharNumber: '',
//     PFNumber: '',
//     UAN: '',
//     ESINumber: '',

//     // Bank Details
//     BankAccountNumber: '',
//     BankAccountHolderName: '',
//     BankName: '',
//     BankBranch: '',
//     BankIfscCode: '',
//     BankAccountType: 'Savings',

//     // Emergency Contact
//     EmergencyContactName: '',
//     EmergencyContactRelationship: '',
//     EmergencyContactPhone: '',
//     EmergencyContactAddress: '',
//     EmergencyContactPIN: ''
//   });

//   const [fieldErrors, setFieldErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState('');

//   // Dropdown data
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);

//   const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
//   const [addDesignationOpen, setAddDesignationOpen] = useState(false);

//   // Search states
//   const [departmentSearch, setDepartmentSearch] = useState('');
//   const [designationSearch, setDesignationSearch] = useState('');

//   // Options
//   const genderOptions = ['M', 'F', 'O'];

//   const employmentStatusOptions = [
//     { value: 'active', label: 'Active' },
//     { value: 'resigned', label: 'Resigned' },
//     { value: 'terminated', label: 'Terminated' },
//     { value: 'retired', label: 'Retired' }
//   ];

//   const employmentTypeOptions = [
//     { value: 'Monthly', label: 'Monthly' },
//     { value: 'Hourly', label: 'Hourly' },
//     { value: 'PieceRate', label: 'Piece Rate' }
//   ];

//   const payStructureOptions = [
//     { value: 'Fixed', label: 'Fixed' },
//     { value: 'Variable', label: 'Variable' },
//     { value: 'Commission', label: 'Commission' },
//     { value: 'PieceRate', label: 'Piece Rate' }
//   ];

//   const skillLevelOptions = [
//     { value: 'Unskilled', label: 'Unskilled' },
//     { value: 'Semi-Skilled', label: 'Semi-Skilled' },
//     { value: 'Skilled', label: 'Skilled' },
//     { value: 'Highly Skilled', label: 'Highly Skilled' }
//   ];

//   const accountTypeOptions = [
//     { value: 'Savings', label: 'Savings' },
//     { value: 'Current', label: 'Current' },
//     { value: 'Salary', label: 'Salary' }
//   ];

//   // Fetch departments and designations
//   useEffect(() => {
//     if (open) {
//       fetchDropdownData();
//     }
//   }, [open]);

//   // Populate form when employee data is received
//   useEffect(() => {
//     if (employee) {
//       setFormData({
//         // Personal Information
//         FirstName: employee.FirstName || '',
//         LastName: employee.LastName || '',
//         Gender: employee.Gender || 'M',
//         DateOfBirth: employee.DateOfBirth ? employee.DateOfBirth.split('T')[0] : '',
//         Email: employee.Email || '',
//         Phone: employee.Phone || '',
//         Address: employee.Address || '',

//         // Employment Details
//         DepartmentID: employee.DepartmentID?._id || employee.DepartmentID || '',
//         DesignationID: employee.DesignationID?._id || employee.DesignationID || '',
//         DateOfJoining: employee.DateOfJoining ? employee.DateOfJoining.split('T')[0] : '',
//         EmploymentStatus: employee.EmploymentStatus || 'active',

//         // Pay & Work
//         EmploymentType: employee.EmploymentType || 'Monthly',
//         PayStructureType: employee.PayStructureType || 'Fixed',
//         BasicSalary: employee.BasicSalary || '',
//         HourlyRate: employee.HourlyRate || '',
//         OvertimeRateMultiplier: employee.OvertimeRateMultiplier || 1.5,
//         SkillLevel: employee.SkillLevel || 'Semi-Skilled',
//         WorkStation: employee.WorkStation || '',
//         LineNumber: employee.LineNumber || '',

//         // Tax & Identification
//         PAN: employee.PAN || '',
//         AadharNumber: employee.AadharNumber || '',
//         PFNumber: employee.PFNumber || '',
//         UAN: employee.UAN || '',
//         ESINumber: employee.ESINumber || '',

//         // Bank Details
//         BankAccountNumber: employee.BankDetails?.accountNumber || '',
//         BankAccountHolderName: employee.BankDetails?.accountHolderName || '',
//         BankName: employee.BankDetails?.bankName || '',
//         BankBranch: employee.BankDetails?.branch || '',
//         BankIfscCode: employee.BankDetails?.ifscCode || '',
//         BankAccountType: employee.BankDetails?.accountType || 'Savings',

//         // Emergency Contact
//         EmergencyContactName: employee.EmergencyContact?.name || '',
//         EmergencyContactRelationship: employee.EmergencyContact?.relationship || '',
//         EmergencyContactPhone: employee.EmergencyContact?.phone || '',
//         EmergencyContactAddress: employee.EmergencyContact?.address || '',
//         EmergencyContactPIN: employee.EmergencyContact?.pinCode || ''
//       });
//     }
//   }, [employee]);

//   const fetchDropdownData = async () => {
//     try {
//       setLoadingData(true);
//       const token = localStorage.getItem('token');

//       const [deptResponse, desigResponse] = await Promise.all([
//         axios.get(`${BASE_URL}/api/departments`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         axios.get(`${BASE_URL}/api/designations`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       if (deptResponse.data.success) {
//         setDepartments(deptResponse.data.data || []);
//       }

//       if (desigResponse.data.success) {
//         setDesignations(desigResponse.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching dropdown data:', err);
//       setError('Failed to load dropdown data');
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const validateField = (name, value) => {
//     switch (name) {
//       case 'Email':
//         if (value && !validateEmail(value)) {
//           return 'Please enter a valid email address';
//         }
//         break;
//       case 'Phone':
//         if (value && !validatePhone(value)) {
//           return 'Please enter a valid Indian mobile number';
//         }
//         break;
//       case 'PAN':
//         if (value && !validatePAN(value)) {
//           return 'Please enter a valid PAN (e.g., ABCDE1234F)';
//         }
//         break;
//       case 'AadharNumber':
//         if (value && !validateAadhar(value)) {
//           return 'Aadhar number must be 12 digits';
//         }
//         break;
//       case 'PFNumber':
//         if (value && !validatePFNumber(value)) {
//           return 'PF number must be in format: XX/12345/1234567';
//         }
//         break;
//       case 'UAN':
//         if (value && !validateUAN(value)) {
//           return 'UAN must be 12 digits';
//         }
//         break;
//       case 'ESINumber':
//         if (value && !validateESINumber(value)) {
//           return 'ESI number must be 17 digits';
//         }
//         break;
//       case 'BankAccountNumber':
//         if (value && !validateAccountNumber(value)) {
//           return 'Account number should be 9-18 digits';
//         }
//         break;
//       case 'BankIfscCode':
//         if (value && !validateIFSC(value)) {
//           return 'Please enter a valid IFSC code (e.g., SBIN0123456)';
//         }
//         break;
//       case 'EmergencyContactPIN':
//         if (value && !validatePIN(value)) {
//           return 'PIN code must be 6 digits';
//         }
//         break;
//       case 'FirstName':
//       case 'LastName':
//       case 'BankAccountHolderName':
//       case 'EmergencyContactName':
//         if (value && !validateName(value)) {
//           return 'Only letters, spaces, dots, and hyphens are allowed';
//         }
//         break;
//       default:
//         return '';
//     }
//     return '';
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     let processedValue = value;

//     // Apply field-specific formatting
//     switch (name) {
//       case 'FirstName':
//       case 'LastName':
//       case 'BankAccountHolderName':
//       case 'EmergencyContactName':
//         processedValue = value.replace(/[^A-Za-z\s.'-]/g, '');
//         break;
//       case 'Phone':
//       case 'EmergencyContactPhone':
//       case 'AadharNumber':
//       case 'UAN':
//       case 'ESINumber':
//       case 'EmergencyContactPIN':
//       case 'BankAccountNumber':
//         processedValue = value.replace(/\D/g, '');
//         break;
//       case 'PAN':
//       case 'BankIfscCode':
//         processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
//         break;
//       case 'PFNumber':
//         processedValue = value.toUpperCase().replace(/[^A-Z0-9/]/g, '');
//         break;
//       default:
//         processedValue = value;
//     }

//     setFormData(prev => ({
//       ...prev,
//       [name]: processedValue
//     }));

//     setFieldErrors(prev => ({
//       ...prev,
//       [name]: ''
//     }));

//     if (touched[name]) {
//       const errorMessage = validateField(name, processedValue);
//       setFieldErrors(prev => ({
//         ...prev,
//         [name]: errorMessage
//       }));
//     }
//   };

//   const handleAutocompleteChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value || ''
//     }));
//     setFieldErrors(prev => ({
//       ...prev,
//       [name]: ''
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;

//     setTouched(prev => ({
//       ...prev,
//       [name]: true
//     }));

//     const errorMessage = validateField(name, value);
//     setFieldErrors(prev => ({
//       ...prev,
//       [name]: errorMessage
//     }));
//   };

//   const handleEmploymentTypeChange = (e) => {
//     const employmentType = e.target.value;
//     let payStructureType = 'Fixed';

//     if (employmentType === 'PieceRate') {
//       payStructureType = 'PieceRate';
//     }

//     setFormData(prev => ({
//       ...prev,
//       EmploymentType: employmentType,
//       PayStructureType: payStructureType
//     }));
//   };

//   // Handle department added from modal
//   const handleDepartmentAdded = (newDepartment) => {
//     setDepartments(prev => [...prev, newDepartment]);
//     setFormData(prev => ({
//       ...prev,
//       DepartmentID: newDepartment._id
//     }));
//     if (fieldErrors.DepartmentID) {
//       setFieldErrors(prev => ({
//         ...prev,
//         DepartmentID: ''
//       }));
//     }
//   };

//   // Handle designation added from modal
//   const handleDesignationAdded = (newDesignation) => {
//     setDesignations(prev => [...prev, newDesignation]);
//     setFormData(prev => ({
//       ...prev,
//       DesignationID: newDesignation._id
//     }));
//     if (fieldErrors.DesignationID) {
//       setFieldErrors(prev => ({
//         ...prev,
//         DesignationID: ''
//       }));
//     }
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0:
//         if (!formData.FirstName?.trim()) {
//           errors.FirstName = 'First name is required';
//           isValid = false;
//         } else {
//           const nameError = validateField('FirstName', formData.FirstName);
//           if (nameError) {
//             errors.FirstName = nameError;
//             isValid = false;
//           }
//         }

//         if (!formData.LastName?.trim()) {
//           errors.LastName = 'Last name is required';
//           isValid = false;
//         } else {
//           const nameError = validateField('LastName', formData.LastName);
//           if (nameError) {
//             errors.LastName = nameError;
//             isValid = false;
//           }
//         }

//         if (!formData.Email?.trim()) {
//           errors.Email = 'Email is required';
//           isValid = false;
//         } else {
//           const emailError = validateField('Email', formData.Email);
//           if (emailError) {
//             errors.Email = emailError;
//             isValid = false;
//           }
//         }

//         if (formData.Phone) {
//           const phoneError = validateField('Phone', formData.Phone);
//           if (phoneError) {
//             errors.Phone = phoneError;
//             isValid = false;
//           }
//         }
//         break;

//       case 1:
//         if (!formData.DepartmentID) {
//           errors.DepartmentID = 'Department is required';
//           isValid = false;
//         }
//         if (!formData.DesignationID) {
//           errors.DesignationID = 'Designation is required';
//           isValid = false;
//         }
//         if (!formData.DateOfJoining) {
//           errors.DateOfJoining = 'Date of joining is required';
//           isValid = false;
//         }
//         break;

//       case 2:
//         if (formData.EmploymentType === 'Monthly' && !formData.BasicSalary) {
//           errors.BasicSalary = 'Basic salary is required for monthly employees';
//           isValid = false;
//         }
//         if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
//           errors.HourlyRate = 'Hourly rate is required for hourly employees';
//           isValid = false;
//         }

//         if (formData.PAN) {
//           const panError = validateField('PAN', formData.PAN);
//           if (panError) {
//             errors.PAN = panError;
//             isValid = false;
//           }
//         }
//         if (formData.AadharNumber) {
//           const aadharError = validateField('AadharNumber', formData.AadharNumber);
//           if (aadharError) {
//             errors.AadharNumber = aadharError;
//             isValid = false;
//           }
//         }
//         if (formData.PFNumber) {
//           const pfError = validateField('PFNumber', formData.PFNumber);
//           if (pfError) {
//             errors.PFNumber = pfError;
//             isValid = false;
//           }
//         }
//         if (formData.UAN) {
//           const uanError = validateField('UAN', formData.UAN);
//           if (uanError) {
//             errors.UAN = uanError;
//             isValid = false;
//           }
//         }
//         if (formData.ESINumber) {
//           const esiError = validateField('ESINumber', formData.ESINumber);
//           if (esiError) {
//             errors.ESINumber = esiError;
//             isValid = false;
//           }
//         }
//         break;

//       case 3:
//         if (formData.BankAccountNumber) {
//           const accError = validateField('BankAccountNumber', formData.BankAccountNumber);
//           if (accError) {
//             errors.BankAccountNumber = accError;
//             isValid = false;
//           }
//         }
//         if (formData.BankAccountHolderName) {
//           const nameError = validateField('BankAccountHolderName', formData.BankAccountHolderName);
//           if (nameError) {
//             errors.BankAccountHolderName = nameError;
//             isValid = false;
//           }
//         }
//         if (formData.BankIfscCode) {
//           const ifscError = validateField('BankIfscCode', formData.BankIfscCode);
//           if (ifscError) {
//             errors.BankIfscCode = ifscError;
//             isValid = false;
//           }
//         }
//         if (formData.EmergencyContactName) {
//           const nameError = validateField('EmergencyContactName', formData.EmergencyContactName);
//           if (nameError) {
//             errors.EmergencyContactName = nameError;
//             isValid = false;
//           }
//         }
//         if (formData.EmergencyContactPhone) {
//           const phoneError = validateField('EmergencyContactPhone', formData.EmergencyContactPhone);
//           if (phoneError) {
//             errors.EmergencyContactPhone = phoneError;
//             isValid = false;
//           }
//         }
//         if (formData.EmergencyContactPIN) {
//           const pinError = validateField('EmergencyContactPIN', formData.EmergencyContactPIN);
//           if (pinError) {
//             errors.EmergencyContactPIN = pinError;
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

//     if (!formData.FirstName?.trim()) {
//       errors.FirstName = 'First name is required';
//       isValid = false;
//     } else {
//       const nameError = validateField('FirstName', formData.FirstName);
//       if (nameError) {
//         errors.FirstName = nameError;
//         isValid = false;
//       }
//     }

//     if (!formData.LastName?.trim()) {
//       errors.LastName = 'Last name is required';
//       isValid = false;
//     } else {
//       const nameError = validateField('LastName', formData.LastName);
//       if (nameError) {
//         errors.LastName = nameError;
//         isValid = false;
//       }
//     }

//     if (!formData.Email?.trim()) {
//       errors.Email = 'Email is required';
//       isValid = false;
//     } else {
//       const emailError = validateField('Email', formData.Email);
//       if (emailError) {
//         errors.Email = emailError;
//         isValid = false;
//       }
//     }

//     if (!formData.DepartmentID) {
//       errors.DepartmentID = 'Department is required';
//       isValid = false;
//     }
//     if (!formData.DesignationID) {
//       errors.DesignationID = 'Designation is required';
//       isValid = false;
//     }
//     if (!formData.DateOfJoining) {
//       errors.DateOfJoining = 'Date of joining is required';
//       isValid = false;
//     }

//     if (formData.EmploymentType === 'Monthly' && !formData.BasicSalary) {
//       errors.BasicSalary = 'Basic salary is required for monthly employees';
//       isValid = false;
//     }
//     if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
//       errors.HourlyRate = 'Hourly rate is required for hourly employees';
//       isValid = false;
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

//   // SINGLE handleSubmit function - REMOVED THE DUPLICATE
//   const handleSubmit = async () => {
//   if (!validateAllFields()) {
//     return;
//   }

//   setLoading(true);
//   setError('');

//   try {
//     const token = localStorage.getItem('token');

//     const payload = {
//       FirstName: formData.FirstName,
//       LastName: formData.LastName,
//       Gender: formData.Gender,
//       Email: formData.Email,
//       DepartmentID: formData.DepartmentID,
//       DesignationID: formData.DesignationID,
//       DateOfJoining: formData.DateOfJoining,
//       EmploymentStatus: formData.EmploymentStatus,
//       EmploymentType: formData.EmploymentType,
//       PayStructureType: formData.PayStructureType,

//       ...(formData.DateOfBirth && { DateOfBirth: formData.DateOfBirth }),
//       ...(formData.Phone && { Phone: formData.Phone }),
//       ...(formData.Address && { Address: formData.Address }),

//       ...(formData.BasicSalary && { BasicSalary: Number(formData.BasicSalary) }),
//       ...(formData.HourlyRate && { HourlyRate: Number(formData.HourlyRate) }),
//       OvertimeRateMultiplier: Number(formData.OvertimeRateMultiplier || 1.5),

//       ...(formData.SkillLevel && { SkillLevel: formData.SkillLevel }),
//       ...(formData.WorkStation && { WorkStation: formData.WorkStation }),
//       ...(formData.LineNumber && { LineNumber: formData.LineNumber }),

//       ...(formData.PAN && { PAN: formData.PAN }),
//       ...(formData.AadharNumber && { AadharNumber: formData.AadharNumber }),
//       ...(formData.PFNumber && { PFNumber: formData.PFNumber }),
//       ...(formData.UAN && { UAN: formData.UAN }),
//       ...(formData.ESINumber && { ESINumber: formData.ESINumber }),

//       BankDetails: {}
//     };

//     if (formData.BankAccountNumber || formData.BankAccountHolderName ||
//       formData.BankName || formData.BankBranch || formData.BankIfscCode) {
//       payload.BankDetails = {
//         ...(formData.BankAccountNumber && { accountNumber: formData.BankAccountNumber }),
//         ...(formData.BankAccountHolderName && { accountHolderName: formData.BankAccountHolderName }),
//         ...(formData.BankName && { bankName: formData.BankName }),
//         ...(formData.BankBranch && { branch: formData.BankBranch }),
//         ...(formData.BankIfscCode && { ifscCode: formData.BankIfscCode }),
//         ...(formData.BankAccountType && { accountType: formData.BankAccountType })
//       };
//     }

//     if (formData.EmergencyContactName || formData.EmergencyContactRelationship ||
//       formData.EmergencyContactPhone || formData.EmergencyContactAddress || formData.EmergencyContactPIN) {
//       payload.EmergencyContact = {
//         ...(formData.EmergencyContactName && { name: formData.EmergencyContactName }),
//         ...(formData.EmergencyContactRelationship && { relationship: formData.EmergencyContactRelationship }),
//         ...(formData.EmergencyContactPhone && { phone: formData.EmergencyContactPhone }),
//         ...(formData.EmergencyContactAddress && { address: formData.EmergencyContactAddress }),
//         ...(formData.EmergencyContactPIN && { pinCode: formData.EmergencyContactPIN })
//       };
//     }

//     if (payload.BankDetails && Object.keys(payload.BankDetails).length === 0) {
//       delete payload.BankDetails;
//     }
//     if (payload.EmergencyContact && Object.keys(payload.EmergencyContact).length === 0) {
//       delete payload.EmergencyContact;
//     }

//     console.log('Updating employee with payload:', payload);

//     const response = await axios.put(`${BASE_URL}/api/employees/${employee._id}`, payload, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('Update response:', response.data);

//     if (response.data && response.data.success === true) {
//       // Call the onUpdate prop with the updated employee data
//       if (onUpdate && typeof onUpdate === 'function') {
//         onUpdate(response.data.data);
//       }
//       resetForm();
//       onClose();
//     } else {
//       const errorMessage = response.data?.message || 'Failed to update employee';
//       setError(errorMessage);
//     }
//   } catch (err) {
//     console.error('Error updating employee:', err);
//     console.error('Error response:', err.response?.data);

//     if (err.response) {
//       const errorMessage = err.response.data?.message ||
//         err.response.data?.error ||
//         `Server error: ${err.response.status}`;
//       setError(errorMessage);
//     } else if (err.request) {
//       setError('No response from server. Please check your network connection.');
//     } else {
//       setError(err.message || 'Failed to update employee. Please try again.');
//     }
//   } finally {
//     setLoading(false);
//   }
// };
//   const resetForm = () => {
//     setFormData({
//       FirstName: '',
//       LastName: '',
//       Gender: 'M',
//       DateOfBirth: '',
//       Email: '',
//       Phone: '',
//       Address: '',
//       DepartmentID: '',
//       DesignationID: '',
//       DateOfJoining: '',
//       EmploymentStatus: 'active',
//       EmploymentType: 'Monthly',
//       PayStructureType: 'Fixed',
//       BasicSalary: '',
//       HourlyRate: '',
//       OvertimeRateMultiplier: 1.5,
//       SkillLevel: 'Semi-Skilled',
//       WorkStation: '',
//       LineNumber: '',
//       PAN: '',
//       AadharNumber: '',
//       PFNumber: '',
//       UAN: '',
//       ESINumber: '',
//       BankAccountNumber: '',
//       BankAccountHolderName: '',
//       BankName: '',
//       BankBranch: '',
//       BankIfscCode: '',
//       BankAccountType: 'Savings',
//       EmergencyContactName: '',
//       EmergencyContactRelationship: '',
//       EmergencyContactPhone: '',
//       EmergencyContactAddress: '',
//       EmergencyContactPIN: ''
//     });
//     setFieldErrors({});
//     setTouched({});
//     setActiveStep(0);
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//  const renderStepContent = (step) => {
//   switch (step) {
//     case 0:
//       return (
//         <Stack spacing={2}>
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <PersonIcon sx={{ fontSize: '1rem' }} />
//               Personal Details
//             </Typography>
//             <Grid container spacing={1.5}>
//               {/* First Name */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     FIRST NAME <span style={{ color: '#EF4444' }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="FirstName"
//                     value={formData.FirstName}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="e.g., John"
//                     error={!!fieldErrors.FirstName}
//                     helperText={fieldErrors.FirstName}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         '&:hover fieldset': { borderColor: COLORS.primary },
//                         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                       },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               {/* Last Name */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     LAST NAME <span style={{ color: '#EF4444' }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="LastName"
//                     value={formData.LastName}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="e.g., Doe"
//                     error={!!fieldErrors.LastName}
//                     helperText={fieldErrors.LastName}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         '&:hover fieldset': { borderColor: COLORS.primary },
//                         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                       },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               {/* Gender */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     GENDER
//                   </Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       name="Gender"
//                       value={formData.Gender}
//                       onChange={handleChange}
//                       disabled={loading}
//                       sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//                       MenuProps={selectMenuProps}
//                     >
//                       {genderOptions.map((gender) => (
//                         <MenuItem key={gender} value={gender} sx={{ fontSize: '0.75rem' }}>
//                           {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>
//               {/* Date of Birth */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     DATE OF BIRTH
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="DateOfBirth"
//                     type="date"
//                     value={formData.DateOfBirth}
//                     onChange={handleChange}
//                     disabled={loading}
//                     InputLabelProps={{ shrink: true }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               {/* Email */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     EMAIL <span style={{ color: '#EF4444' }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="Email"
//                     type="email"
//                     value={formData.Email}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="john.doe@company.com"
//                     error={!!fieldErrors.Email}
//                     helperText={fieldErrors.Email}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         '&:hover fieldset': { borderColor: COLORS.primary },
//                         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                       },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               {/* Phone */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     PHONE
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="Phone"
//                     value={formData.Phone}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="e.g., 9876543210"
//                     error={!!fieldErrors.Phone}
//                     helperText={fieldErrors.Phone || "Indian mobile number (optional)"}
//                     inputProps={{ maxLength: 15 }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         '&:hover fieldset': { borderColor: COLORS.primary },
//                         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                       },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               {/* Address */}
//               <Grid size={{ xs: 12 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     ADDRESS
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="Address"
//                     value={formData.Address}
//                     onChange={handleChange}
//                     multiline
//                     rows={2}
//                     disabled={loading}
//                     placeholder="Enter complete address"
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Stack>
//       );

//     case 1:
//       return (
//         <Stack spacing={2}>
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <WorkIcon sx={{ fontSize: '1rem' }} />
//               Employment Details
//             </Typography>
//             <Grid container spacing={1.5}>
//               {/* Department */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
//                   </Typography>
//                   <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
//                     <Box sx={{ flex: 1 }}>
//                       <Autocomplete
//                         options={departments}
//                         getOptionLabel={(option) => option?.DepartmentName || ''}
//                         value={departments.find(dept => dept._id === formData.DepartmentID) || null}
//                         onChange={(event, newValue) => {
//                           handleAutocompleteChange('DepartmentID', newValue?._id || '');
//                         }}
//                         loading={loadingData}
//                         disabled={loading || loadingData}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             size="small"
//                             placeholder="Select department"
//                             error={!!fieldErrors.DepartmentID}
//                             helperText={fieldErrors.DepartmentID}
//                             InputProps={{
//                               ...params.InputProps,
//                               startAdornment: (
//                                 <InputAdornment position="start">
//                                   <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                                 </InputAdornment>
//                               ),
//                             }}
//                             sx={{
//                               '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                               '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                             }}
//                           />
//                         )}
//                         PaperComponent={CustomPaper}
//                         noOptionsText={departments.length === 0 ? "No departments available" : "No matching departments"}
//                         isOptionEqualToValue={(option, value) => option?._id === value?._id}
//                       />
//                     </Box>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => setAddDepartmentOpen(true)}
//                       disabled={loading || loadingData}
//                       startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
//                       sx={{ height: 32, minWidth: 'auto', px: 1.5, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'none' }}
//                     >
//                       Add New
//                     </Button>
//                   </Box>
//                 </Box>
//               </Grid>
//               {/* Designation */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     DESIGNATION <span style={{ color: '#EF4444' }}>*</span>
//                   </Typography>
//                   <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
//                     <Box sx={{ flex: 1 }}>
//                       <Autocomplete
//                         options={designations}
//                         getOptionLabel={(option) => option?.DesignationName || ''}
//                         value={designations.find(desig => desig._id === formData.DesignationID) || null}
//                         onChange={(event, newValue) => {
//                           handleAutocompleteChange('DesignationID', newValue?._id || '');
//                         }}
//                         loading={loadingData}
//                         disabled={loading || loadingData}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             size="small"
//                             placeholder="Select designation"
//                             error={!!fieldErrors.DesignationID}
//                             helperText={fieldErrors.DesignationID}
//                             InputProps={{
//                               ...params.InputProps,
//                               startAdornment: (
//                                 <InputAdornment position="start">
//                                   <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                                 </InputAdornment>
//                               ),
//                             }}
//                             sx={{
//                               '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                               '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                             }}
//                           />
//                         )}
//                         PaperComponent={CustomPaper}
//                         noOptionsText={designations.length === 0 ? "No designations available" : "No matching designations"}
//                         isOptionEqualToValue={(option, value) => option?._id === value?._id}
//                       />
//                     </Box>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => setAddDesignationOpen(true)}
//                       disabled={loading || loadingData}
//                       startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
//                       sx={{ height: 32, minWidth: 'auto', px: 1.5, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'none' }}
//                     >
//                       Add New
//                     </Button>
//                   </Box>
//                 </Box>
//               </Grid>
//               {/* Date of Joining */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     DATE OF JOINING <span style={{ color: '#EF4444' }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="DateOfJoining"
//                     type="date"
//                     value={formData.DateOfJoining}
//                     onChange={handleChange}
//                     disabled={loading}
//                     error={!!fieldErrors.DateOfJoining}
//                     helperText={fieldErrors.DateOfJoining}
//                     InputLabelProps={{ shrink: true }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               {/* Employment Status */}
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     EMPLOYMENT STATUS
//                   </Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       name="EmploymentStatus"
//                       value={formData.EmploymentStatus}
//                       onChange={handleChange}
//                       disabled={loading}
//                       sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//                       MenuProps={selectMenuProps}
//                     >
//                       {employmentStatusOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Stack>
//       );

//     case 2: // Pay & Work
//       return (
//         <Stack spacing={2}>
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//               Pay Structure
//             </Typography>

//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     EMPLOYMENT TYPE <span style={{ color: '#EF4444' }}>*</span>
//                   </Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       name="EmploymentType"
//                       value={formData.EmploymentType}
//                       onChange={handleEmploymentTypeChange}
//                       disabled={loading}
//                       sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//                       MenuProps={selectMenuProps}
//                     >
//                       {employmentTypeOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     PAY STRUCTURE TYPE
//                   </Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       name="PayStructureType"
//                       value={formData.PayStructureType}
//                       onChange={handleChange}
//                       disabled={loading}
//                       sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//                       MenuProps={selectMenuProps}
//                     >
//                       {payStructureOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>

//               {formData.EmploymentType === 'Monthly' && (
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       BASIC SALARY <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="BasicSalary"
//                       type="number"
//                       value={formData.BasicSalary}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., 25000"
//                       error={!!fieldErrors.BasicSalary}
//                       helperText={fieldErrors.BasicSalary}
//                       inputProps={{ min: 0 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                         '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               )}

//               {formData.EmploymentType === 'Hourly' && (
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       HOURLY RATE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="HourlyRate"
//                       type="number"
//                       value={formData.HourlyRate}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., 150"
//                       error={!!fieldErrors.HourlyRate}
//                       helperText={fieldErrors.HourlyRate}
//                       inputProps={{ min: 0, step: 0.01 }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                         '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               )}

//               {(formData.EmploymentType === 'Monthly' || formData.EmploymentType === 'Hourly') && (
//                 <>
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                         OVERTIME MULTIPLIER
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         name="OvertimeRateMultiplier"
//                         type="number"
//                         value={formData.OvertimeRateMultiplier}
//                         onChange={handleChange}
//                         disabled={loading}
//                         placeholder="1.5"
//                         inputProps={{ step: 0.25, min: 1, max: 3 }}
//                         sx={{
//                           '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                           '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                         }}
//                       />
//                     </Box>
//                   </Grid>

//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                         SKILL LEVEL
//                       </Typography>
//                       <FormControl fullWidth size="small">
//                         <Select
//                           name="SkillLevel"
//                           value={formData.SkillLevel}
//                           onChange={handleChange}
//                           disabled={loading}
//                           sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//                           MenuProps={selectMenuProps}
//                         >
//                           {skillLevelOptions.map((option) => (
//                             <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
//                               {option.label}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Box>
//                   </Grid>
//                 </>
//               )}

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     WORK STATION
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="WorkStation"
//                     value={formData.WorkStation}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., Station A"
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     LINE NUMBER
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="LineNumber"
//                     value={formData.LineNumber}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., Line 1"
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>

//           <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//               Tax & Identification (Optional)
//             </Typography>

//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     PAN
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="PAN"
//                     value={formData.PAN}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="e.g., ABCDE1234F"
//                     error={!!fieldErrors.PAN}
//                     helperText={fieldErrors.PAN || "10 characters"}
//                     inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     AADHAR NUMBER
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="AadharNumber"
//                     value={formData.AadharNumber}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="12 digits"
//                     error={!!fieldErrors.AadharNumber}
//                     helperText={fieldErrors.AadharNumber}
//                     inputProps={{ maxLength: 12 }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     PF NUMBER
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="PFNumber"
//                     value={formData.PFNumber}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="XX/12345/1234567"
//                     error={!!fieldErrors.PFNumber}
//                     helperText={fieldErrors.PFNumber}
//                     inputProps={{ style: { textTransform: 'uppercase' } }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     UAN
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="UAN"
//                     value={formData.UAN}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="12 digits"
//                     error={!!fieldErrors.UAN}
//                     helperText={fieldErrors.UAN}
//                     inputProps={{ maxLength: 12 }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     ESI NUMBER
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="ESINumber"
//                     value={formData.ESINumber}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="17 digits"
//                     error={!!fieldErrors.ESINumber}
//                     helperText={fieldErrors.ESINumber}
//                     inputProps={{ maxLength: 17 }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Stack>
//       );

//     case 3: // Bank & Emergency
//       return (
//         <Stack spacing={2}>
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <AccountBalanceIcon sx={{ fontSize: '1rem' }} />
//               Bank Details (Optional)
//             </Typography>

//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     ACCOUNT NUMBER
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="BankAccountNumber"
//                     value={formData.BankAccountNumber}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="9-18 digits"
//                     error={!!fieldErrors.BankAccountNumber}
//                     helperText={fieldErrors.BankAccountNumber}
//                     inputProps={{ maxLength: 18 }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     ACCOUNT HOLDER NAME
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="BankAccountHolderName"
//                     value={formData.BankAccountHolderName}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="As per bank records"
//                     error={!!fieldErrors.BankAccountHolderName}
//                     helperText={fieldErrors.BankAccountHolderName}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     BANK NAME
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="BankName"
//                     value={formData.BankName}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., State Bank of India"
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     BRANCH
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="BankBranch"
//                     value={formData.BankBranch}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., Main Branch"
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     IFSC CODE
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="BankIfscCode"
//                     value={formData.BankIfscCode}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="e.g., SBIN0123456"
//                     error={!!fieldErrors.BankIfscCode}
//                     helperText={fieldErrors.BankIfscCode || "4 letters + 0 + 6 alphanumeric"}
//                     inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     ACCOUNT TYPE
//                   </Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       name="BankAccountType"
//                       value={formData.BankAccountType}
//                       onChange={handleChange}
//                       disabled={loading}
//                       sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//                       MenuProps={selectMenuProps}
//                     >
//                       {accountTypeOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>

//           <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <EmergencyIcon sx={{ fontSize: '1rem' }} />
//               Emergency Contact (Optional)
//             </Typography>

//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     CONTACT NAME
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="EmergencyContactName"
//                     value={formData.EmergencyContactName}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="e.g., Jane Doe"
//                     error={!!fieldErrors.EmergencyContactName}
//                     helperText={fieldErrors.EmergencyContactName}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     RELATIONSHIP
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="EmergencyContactRelationship"
//                     value={formData.EmergencyContactRelationship}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="e.g., Spouse"
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     PHONE
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="EmergencyContactPhone"
//                     value={formData.EmergencyContactPhone}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="10 digits"
//                     error={!!fieldErrors.EmergencyContactPhone}
//                     helperText={fieldErrors.EmergencyContactPhone}
//                     inputProps={{ maxLength: 10 }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     PIN CODE
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="EmergencyContactPIN"
//                     value={formData.EmergencyContactPIN}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     placeholder="6 digits"
//                     error={!!fieldErrors.EmergencyContactPIN}
//                     helperText={fieldErrors.EmergencyContactPIN}
//                     inputProps={{ maxLength: 6 }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     ADDRESS
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="EmergencyContactAddress"
//                     value={formData.EmergencyContactAddress}
//                     onChange={handleChange}
//                     multiline
//                     rows={2}
//                     disabled={loading}
//                     placeholder="Complete address"
//                     sx={{
//                       '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Stack>
//       );

//     default:
//       return null;
//   }
// };
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
//           Edit Employee
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//           {employee?._id && (
//             <Chip
//               label={`ID: ${employee._id.slice(-6)}`}
//               size="small"
//               sx={{
//                 fontSize: '0.65rem',
//                 fontWeight: 500,
//                 height: 20,
//                 bgcolor: COLORS.background.light,
//                 color: COLORS.text.secondary,
//                 border: `1px solid ${COLORS.border}`,
//               }}
//             />
//           )}
//           <Chip
//             label={employee?.EmploymentStatus === 'active' ? 'Active' : 'Inactive'}
//             size="small"
//             sx={{
//               fontSize: '0.65rem',
//               fontWeight: 500,
//               height: 20,
//               bgcolor: employee?.EmploymentStatus === 'active' ? COLORS.chips.active : COLORS.chips.inactive,
//               color: employee?.EmploymentStatus === 'active' ? COLORS.primaryDark : COLORS.text.secondary,
//             }}
//           />
//         </Box>
//       </DialogTitle>

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
//           size="small"
//           startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             textTransform: 'none',
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
//               textTransform: 'none',
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
//               startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 textTransform: 'none',
//                 '&:hover': { bgcolor: COLORS.primaryDark }
//               }}
//             >
//               {loading ? 'Updating...' : 'Update Employee'}
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
//                 textTransform: 'none',
//                 '&:hover': { bgcolor: COLORS.primaryDark }
//               }}
//             >
//               Next
//             </Button>
//           )}
//         </Box>
//       </DialogActions>

//       {/* Add Department Modal */}
//       <AddDepartments
//         open={addDepartmentOpen}
//         onClose={() => setAddDepartmentOpen(false)}
//         onAdd={handleDepartmentAdded}
//       />

//       {/* Add Designation Modal */}
//       <AddDesignations
//         open={addDesignationOpen}
//         onClose={() => setAddDesignationOpen(false)}
//         onAdd={handleDesignationAdded}
//       />
//     </Dialog>
//   );
// };

// export default EditEmployees;







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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  FormHelperText,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon,
  Emergency as EmergencyIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddDepartments from '../departmentmaster/AddDepartments';
import AddDesignations from '../designationmaster/AddDesignations';

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

// Custom styled Paper component for dropdown without scrollbars
const CustomPaper = styled(Paper)({
  maxHeight: 200,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
  '& .MuiAutocomplete-listbox': {
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none'
  }
});

// Custom styled MenuProps for Select components
const selectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 200,
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none'
    }
  }
};

const steps = ['Personal Information', 'Employment Details', 'Pay & Work', 'Bank & Emergency'];

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^(\+91[\-\s]?)?[0]?[6-9]\d{9}$/;
  return phone ? phoneRegex.test(phone.replace(/[\s\-]/g, '')) : true;
};

const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return pan ? panRegex.test(pan) : true;
};

const validateAadhar = (aadhar) => {
  const aadharRegex = /^\d{12}$/;
  return aadhar ? aadharRegex.test(aadhar) : true;
};

const validateIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifsc ? ifscRegex.test(ifsc) : true;
};

const validateAccountNumber = (accNo) => {
  const accRegex = /^\d{9,18}$/;
  return accNo ? accRegex.test(accNo) : true;
};

const validatePIN = (pin) => {
  const pinRegex = /^\d{6}$/;
  return pin ? pinRegex.test(pin) : true;
};

const validatePFNumber = (pf) => {
  const pfRegex = /^[A-Z]{2}\/\d{5}\/\d{7}$/;
  return pf ? pfRegex.test(pf) : true;
};

const validateUAN = (uan) => {
  const uanRegex = /^\d{12}$/;
  return uan ? uanRegex.test(uan) : true;
};

const validateESINumber = (esi) => {
  const esiRegex = /^\d{17}$/;
  return esi ? esiRegex.test(esi) : true;
};

const validateName = (name) => {
  const nameRegex = /^[A-Za-z\s.'-]+$/;
  return name ? nameRegex.test(name) : true;
};

const EditEmployees = ({ open, onClose, employee, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    FirstName: '',
    LastName: '',
    Gender: 'M',
    DateOfBirth: '',
    Email: '',
    Phone: '',
    Address: '',

    // Employment Details
    DepartmentID: '',
    DesignationID: '',
    DateOfJoining: '',
    EmploymentStatus: 'active',

    // Pay & Work
    EmploymentType: 'Monthly',
    PayStructureType: 'Fixed',
    ContractCompany: '', // New field for contract company
    BasicSalary: '',
    HourlyRate: '',
    OvertimeRateMultiplier: 1.5,
    SkillLevel: 'Semi-Skilled',
    WorkStation: '',
    LineNumber: '',

    // Tax & Identification
    PAN: '',
    AadharNumber: '',
    PFNumber: '',
    UAN: '',
    ESINumber: '',

    // Bank Details
    BankAccountNumber: '',
    BankAccountHolderName: '',
    BankName: '',
    BankBranch: '',
    BankIfscCode: '',
    BankAccountType: 'Savings',

    // Emergency Contact
    EmergencyContactName: '',
    EmergencyContactRelationship: '',
    EmergencyContactPhone: '',
    EmergencyContactAddress: '',
    EmergencyContactPIN: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');

  // Dropdown data
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [addDesignationOpen, setAddDesignationOpen] = useState(false);

  // Search states
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [designationSearch, setDesignationSearch] = useState('');

  // Options
  const genderOptions = ['M', 'F', 'O'];

  const employmentStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'resigned', label: 'Resigned' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'retired', label: 'Retired' }
  ];

  // Employment Type options with Contract-Based
  const employmentTypeOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Hourly', label: 'Hourly' },
    { value: 'PieceRate', label: 'Piece Rate' },
    { value: 'contract-based', label: 'Contract-Based' }
  ];

  // Contract Company options
  const contractCompanyOptions = [
    { value: 'DISTIL', label: 'DISTIL' },
    { value: 'AARADHYA', label: 'AARADHYA' },
    { value: 'MAHI', label: 'MAHI' }
  ];

  const payStructureOptions = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Variable', label: 'Variable' },
    { value: 'Commission', label: 'Commission' },
    { value: 'PieceRate', label: 'Piece Rate' }
  ];

  const skillLevelOptions = [
    { value: 'Unskilled', label: 'Unskilled' },
    { value: 'Semi-Skilled', label: 'Semi-Skilled' },
    { value: 'Skilled', label: 'Skilled' },
    { value: 'Highly Skilled', label: 'Highly Skilled' }
  ];

  const accountTypeOptions = [
    { value: 'Savings', label: 'Savings' },
    { value: 'Current', label: 'Current' },
    { value: 'Salary', label: 'Salary' }
  ];

  // Fetch departments and designations
  useEffect(() => {
    if (open) {
      fetchDropdownData();
    }
  }, [open]);

  // Populate form when employee data is received
  useEffect(() => {
    if (employee) {
      setFormData({
        // Personal Information
        FirstName: employee.FirstName || '',
        LastName: employee.LastName || '',
        Gender: employee.Gender || 'M',
        DateOfBirth: employee.DateOfBirth ? employee.DateOfBirth.split('T')[0] : '',
        Email: employee.Email || '',
        Phone: employee.Phone || '',
        Address: employee.Address || '',

        // Employment Details
        DepartmentID: employee.DepartmentID?._id || employee.DepartmentID || '',
        DesignationID: employee.DesignationID?._id || employee.DesignationID || '',
        DateOfJoining: employee.DateOfJoining ? employee.DateOfJoining.split('T')[0] : '',
        EmploymentStatus: employee.EmploymentStatus || 'active',

        // Pay & Work
        EmploymentType: employee.EmploymentType || 'Monthly',
        PayStructureType: employee.PayStructureType || 'Fixed',
        ContractCompany: employee.ContractCompany || '', // Populate ContractCompany
        BasicSalary: employee.BasicSalary || '',
        HourlyRate: employee.HourlyRate || '',
        OvertimeRateMultiplier: employee.OvertimeRateMultiplier || 1.5,
        SkillLevel: employee.SkillLevel || 'Semi-Skilled',
        WorkStation: employee.WorkStation || '',
        LineNumber: employee.LineNumber || '',

        // Tax & Identification
        PAN: employee.PAN || '',
        AadharNumber: employee.AadharNumber || '',
        PFNumber: employee.PFNumber || '',
        UAN: employee.UAN || '',
        ESINumber: employee.ESINumber || '',

        // Bank Details
        BankAccountNumber: employee.BankDetails?.accountNumber || '',
        BankAccountHolderName: employee.BankDetails?.accountHolderName || '',
        BankName: employee.BankDetails?.bankName || '',
        BankBranch: employee.BankDetails?.branch || '',
        BankIfscCode: employee.BankDetails?.ifscCode || '',
        BankAccountType: employee.BankDetails?.accountType || 'Savings',

        // Emergency Contact
        EmergencyContactName: employee.EmergencyContact?.name || '',
        EmergencyContactRelationship: employee.EmergencyContact?.relationship || '',
        EmergencyContactPhone: employee.EmergencyContact?.phone || '',
        EmergencyContactAddress: employee.EmergencyContact?.address || '',
        EmergencyContactPIN: employee.EmergencyContact?.pinCode || ''
      });
    }
  }, [employee]);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');

      const [deptResponse, desigResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/departments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/designations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (deptResponse.data.success) {
        setDepartments(deptResponse.data.data || []);
      }

      if (desigResponse.data.success) {
        setDesignations(desigResponse.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError('Failed to load dropdown data');
    } finally {
      setLoadingData(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'Email':
        if (value && !validateEmail(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'Phone':
        if (value && !validatePhone(value)) {
          return 'Please enter a valid Indian mobile number';
        }
        break;
      case 'PAN':
        if (value && !validatePAN(value)) {
          return 'Please enter a valid PAN (e.g., ABCDE1234F)';
        }
        break;
      case 'AadharNumber':
        if (value && !validateAadhar(value)) {
          return 'Aadhar number must be 12 digits';
        }
        break;
      case 'PFNumber':
        if (value && !validatePFNumber(value)) {
          return 'PF number must be in format: XX/12345/1234567';
        }
        break;
      case 'UAN':
        if (value && !validateUAN(value)) {
          return 'UAN must be 12 digits';
        }
        break;
      case 'ESINumber':
        if (value && !validateESINumber(value)) {
          return 'ESI number must be 17 digits';
        }
        break;
      case 'BankAccountNumber':
        if (value && !validateAccountNumber(value)) {
          return 'Account number should be 9-18 digits';
        }
        break;
      case 'BankIfscCode':
        if (value && !validateIFSC(value)) {
          return 'Please enter a valid IFSC code (e.g., SBIN0123456)';
        }
        break;
      case 'EmergencyContactPIN':
        if (value && !validatePIN(value)) {
          return 'PIN code must be 6 digits';
        }
        break;
      case 'FirstName':
      case 'LastName':
      case 'BankAccountHolderName':
      case 'EmergencyContactName':
        if (value && !validateName(value)) {
          return 'Only letters, spaces, dots, and hyphens are allowed';
        }
        break;
      case 'ContractCompany':
        if (formData.EmploymentType === 'contract-based' && !value) {
          return 'Contract company is required for contract-based employees';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    // Apply field-specific formatting
    switch (name) {
      case 'FirstName':
      case 'LastName':
      case 'BankAccountHolderName':
      case 'EmergencyContactName':
        processedValue = value.replace(/[^A-Za-z\s.'-]/g, '');
        break;
      case 'Phone':
      case 'EmergencyContactPhone':
      case 'AadharNumber':
      case 'UAN':
      case 'ESINumber':
      case 'EmergencyContactPIN':
      case 'BankAccountNumber':
        processedValue = value.replace(/\D/g, '');
        break;
      case 'PAN':
      case 'BankIfscCode':
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        break;
      case 'PFNumber':
        processedValue = value.toUpperCase().replace(/[^A-Z0-9/]/g, '');
        break;
      default:
        processedValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    if (touched[name]) {
      const errorMessage = validateField(name, processedValue);
      setFieldErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value || ''
    }));
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const errorMessage = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const handleEmploymentTypeChange = (e) => {
    const employmentType = e.target.value;
    let payStructureType = 'Fixed';

    if (employmentType === 'PieceRate') {
      payStructureType = 'PieceRate';
    }

    setFormData(prev => ({
      ...prev,
      EmploymentType: employmentType,
      PayStructureType: payStructureType
    }));
  };

  // Handle department added from modal
  const handleDepartmentAdded = (newDepartment) => {
    setDepartments(prev => [...prev, newDepartment]);
    setFormData(prev => ({
      ...prev,
      DepartmentID: newDepartment._id
    }));
    if (fieldErrors.DepartmentID) {
      setFieldErrors(prev => ({
        ...prev,
        DepartmentID: ''
      }));
    }
  };

  // Handle designation added from modal
  const handleDesignationAdded = (newDesignation) => {
    setDesignations(prev => [...prev, newDesignation]);
    setFormData(prev => ({
      ...prev,
      DesignationID: newDesignation._id
    }));
    if (fieldErrors.DesignationID) {
      setFieldErrors(prev => ({
        ...prev,
        DesignationID: ''
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.FirstName?.trim()) {
          errors.FirstName = 'First name is required';
          isValid = false;
        } else {
          const nameError = validateField('FirstName', formData.FirstName);
          if (nameError) {
            errors.FirstName = nameError;
            isValid = false;
          }
        }

        if (!formData.LastName?.trim()) {
          errors.LastName = 'Last name is required';
          isValid = false;
        } else {
          const nameError = validateField('LastName', formData.LastName);
          if (nameError) {
            errors.LastName = nameError;
            isValid = false;
          }
        }

        if (!formData.Email?.trim()) {
          errors.Email = 'Email is required';
          isValid = false;
        } else {
          const emailError = validateField('Email', formData.Email);
          if (emailError) {
            errors.Email = emailError;
            isValid = false;
          }
        }

        if (formData.Phone) {
          const phoneError = validateField('Phone', formData.Phone);
          if (phoneError) {
            errors.Phone = phoneError;
            isValid = false;
          }
        }
        break;

      case 1:
        if (!formData.DepartmentID) {
          errors.DepartmentID = 'Department is required';
          isValid = false;
        }
        if (!formData.DesignationID) {
          errors.DesignationID = 'Designation is required';
          isValid = false;
        }
        if (!formData.DateOfJoining) {
          errors.DateOfJoining = 'Date of joining is required';
          isValid = false;
        }
        // Validate ContractCompany if EmploymentType is contract-based
        if (formData.EmploymentType === 'contract-based' && !formData.ContractCompany) {
          errors.ContractCompany = 'Contract company is required';
          isValid = false;
        }
        break;

      case 2:
        if ((formData.EmploymentType === 'Monthly' || formData.EmploymentType === 'contract-based') && !formData.BasicSalary) {
          errors.BasicSalary = 'Basic salary is required';
          isValid = false;
        }
        if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
          errors.HourlyRate = 'Hourly rate is required for hourly employees';
          isValid = false;
        }

        if (formData.PAN) {
          const panError = validateField('PAN', formData.PAN);
          if (panError) {
            errors.PAN = panError;
            isValid = false;
          }
        }
        if (formData.AadharNumber) {
          const aadharError = validateField('AadharNumber', formData.AadharNumber);
          if (aadharError) {
            errors.AadharNumber = aadharError;
            isValid = false;
          }
        }
        if (formData.PFNumber) {
          const pfError = validateField('PFNumber', formData.PFNumber);
          if (pfError) {
            errors.PFNumber = pfError;
            isValid = false;
          }
        }
        if (formData.UAN) {
          const uanError = validateField('UAN', formData.UAN);
          if (uanError) {
            errors.UAN = uanError;
            isValid = false;
          }
        }
        if (formData.ESINumber) {
          const esiError = validateField('ESINumber', formData.ESINumber);
          if (esiError) {
            errors.ESINumber = esiError;
            isValid = false;
          }
        }
        break;

      case 3:
        if (formData.BankAccountNumber) {
          const accError = validateField('BankAccountNumber', formData.BankAccountNumber);
          if (accError) {
            errors.BankAccountNumber = accError;
            isValid = false;
          }
        }
        if (formData.BankAccountHolderName) {
          const nameError = validateField('BankAccountHolderName', formData.BankAccountHolderName);
          if (nameError) {
            errors.BankAccountHolderName = nameError;
            isValid = false;
          }
        }
        if (formData.BankIfscCode) {
          const ifscError = validateField('BankIfscCode', formData.BankIfscCode);
          if (ifscError) {
            errors.BankIfscCode = ifscError;
            isValid = false;
          }
        }
        if (formData.EmergencyContactName) {
          const nameError = validateField('EmergencyContactName', formData.EmergencyContactName);
          if (nameError) {
            errors.EmergencyContactName = nameError;
            isValid = false;
          }
        }
        if (formData.EmergencyContactPhone) {
          const phoneError = validateField('EmergencyContactPhone', formData.EmergencyContactPhone);
          if (phoneError) {
            errors.EmergencyContactPhone = phoneError;
            isValid = false;
          }
        }
        if (formData.EmergencyContactPIN) {
          const pinError = validateField('EmergencyContactPIN', formData.EmergencyContactPIN);
          if (pinError) {
            errors.EmergencyContactPIN = pinError;
            isValid = false;
          }
        }
        break;

      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.FirstName?.trim()) {
      errors.FirstName = 'First name is required';
      isValid = false;
    } else {
      const nameError = validateField('FirstName', formData.FirstName);
      if (nameError) {
        errors.FirstName = nameError;
        isValid = false;
      }
    }

    if (!formData.LastName?.trim()) {
      errors.LastName = 'Last name is required';
      isValid = false;
    } else {
      const nameError = validateField('LastName', formData.LastName);
      if (nameError) {
        errors.LastName = nameError;
        isValid = false;
      }
    }

    if (!formData.Email?.trim()) {
      errors.Email = 'Email is required';
      isValid = false;
    } else {
      const emailError = validateField('Email', formData.Email);
      if (emailError) {
        errors.Email = emailError;
        isValid = false;
      }
    }

    if (!formData.DepartmentID) {
      errors.DepartmentID = 'Department is required';
      isValid = false;
    }
    if (!formData.DesignationID) {
      errors.DesignationID = 'Designation is required';
      isValid = false;
    }
    if (!formData.DateOfJoining) {
      errors.DateOfJoining = 'Date of joining is required';
      isValid = false;
    }
    // Validate ContractCompany if EmploymentType is contract-based
    if (formData.EmploymentType === 'contract-based' && !formData.ContractCompany) {
      errors.ContractCompany = 'Contract company is required';
      isValid = false;
    }

    if ((formData.EmploymentType === 'Monthly' || formData.EmploymentType === 'contract-based') && !formData.BasicSalary) {
      errors.BasicSalary = 'Basic salary is required';
      isValid = false;
    }
    if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
      errors.HourlyRate = 'Hourly rate is required for hourly employees';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
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
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const payload = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Gender: formData.Gender,
        Email: formData.Email,
        DepartmentID: formData.DepartmentID,
        DesignationID: formData.DesignationID,
        DateOfJoining: formData.DateOfJoining,
        EmploymentStatus: formData.EmploymentStatus,
        EmploymentType: formData.EmploymentType,
        PayStructureType: formData.PayStructureType,
        ContractCompany: formData.EmploymentType === 'contract-based' ? formData.ContractCompany : undefined,

        ...(formData.DateOfBirth && { DateOfBirth: formData.DateOfBirth }),
        ...(formData.Phone && { Phone: formData.Phone }),
        ...(formData.Address && { Address: formData.Address }),

        ...((formData.EmploymentType === 'Monthly' || formData.EmploymentType === 'contract-based') && formData.BasicSalary && { BasicSalary: Number(formData.BasicSalary) }),
        ...(formData.EmploymentType === 'Hourly' && formData.HourlyRate && { HourlyRate: Number(formData.HourlyRate) }),
        OvertimeRateMultiplier: Number(formData.OvertimeRateMultiplier || 1.5),

        ...(formData.SkillLevel && { SkillLevel: formData.SkillLevel }),
        ...(formData.WorkStation && { WorkStation: formData.WorkStation }),
        ...(formData.LineNumber && { LineNumber: formData.LineNumber }),

        ...(formData.PAN && { PAN: formData.PAN }),
        ...(formData.AadharNumber && { AadharNumber: formData.AadharNumber }),
        ...(formData.PFNumber && { PFNumber: formData.PFNumber }),
        ...(formData.UAN && { UAN: formData.UAN }),
        ...(formData.ESINumber && { ESINumber: formData.ESINumber }),

        BankDetails: {}
      };

      if (formData.BankAccountNumber || formData.BankAccountHolderName ||
        formData.BankName || formData.BankBranch || formData.BankIfscCode) {
        payload.BankDetails = {
          ...(formData.BankAccountNumber && { accountNumber: formData.BankAccountNumber }),
          ...(formData.BankAccountHolderName && { accountHolderName: formData.BankAccountHolderName }),
          ...(formData.BankName && { bankName: formData.BankName }),
          ...(formData.BankBranch && { branch: formData.BankBranch }),
          ...(formData.BankIfscCode && { ifscCode: formData.BankIfscCode }),
          ...(formData.BankAccountType && { accountType: formData.BankAccountType })
        };
      }

      if (formData.EmergencyContactName || formData.EmergencyContactRelationship ||
        formData.EmergencyContactPhone || formData.EmergencyContactAddress || formData.EmergencyContactPIN) {
        payload.EmergencyContact = {
          ...(formData.EmergencyContactName && { name: formData.EmergencyContactName }),
          ...(formData.EmergencyContactRelationship && { relationship: formData.EmergencyContactRelationship }),
          ...(formData.EmergencyContactPhone && { phone: formData.EmergencyContactPhone }),
          ...(formData.EmergencyContactAddress && { address: formData.EmergencyContactAddress }),
          ...(formData.EmergencyContactPIN && { pinCode: formData.EmergencyContactPIN })
        };
      }

      if (payload.BankDetails && Object.keys(payload.BankDetails).length === 0) {
        delete payload.BankDetails;
      }
      if (payload.EmergencyContact && Object.keys(payload.EmergencyContact).length === 0) {
        delete payload.EmergencyContact;
      }

      console.log('Updating employee with payload:', payload);

      const response = await axios.put(`${BASE_URL}/api/employees/${employee._id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Update response:', response.data);

      if (response.data && response.data.success === true) {
        if (onUpdate && typeof onUpdate === 'function') {
          onUpdate(response.data.data);
        }
        resetForm();
        onClose();
      } else {
        const errorMessage = response.data?.message || 'Failed to update employee';
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      console.error('Error response:', err.response?.data);

      if (err.response) {
        const errorMessage = err.response.data?.message ||
          err.response.data?.error ||
          `Server error: ${err.response.status}`;
        setError(errorMessage);
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError(err.message || 'Failed to update employee. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      FirstName: '',
      LastName: '',
      Gender: 'M',
      DateOfBirth: '',
      Email: '',
      Phone: '',
      Address: '',
      DepartmentID: '',
      DesignationID: '',
      DateOfJoining: '',
      EmploymentStatus: 'active',
      EmploymentType: 'Monthly',
      PayStructureType: 'Fixed',
      ContractCompany: '',
      BasicSalary: '',
      HourlyRate: '',
      OvertimeRateMultiplier: 1.5,
      SkillLevel: 'Semi-Skilled',
      WorkStation: '',
      LineNumber: '',
      PAN: '',
      AadharNumber: '',
      PFNumber: '',
      UAN: '',
      ESINumber: '',
      BankAccountNumber: '',
      BankAccountHolderName: '',
      BankName: '',
      BankBranch: '',
      BankIfscCode: '',
      BankAccountType: 'Savings',
      EmergencyContactName: '',
      EmergencyContactRelationship: '',
      EmergencyContactPhone: '',
      EmergencyContactAddress: '',
      EmergencyContactPIN: ''
    });
    setFieldErrors({});
    setTouched({});
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
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: '1rem' }} />
                Personal Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      FIRST NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="FirstName"
                      value={formData.FirstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="e.g., John"
                      error={!!fieldErrors.FirstName}
                      helperText={fieldErrors.FirstName}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LAST NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="LastName"
                      value={formData.LastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="e.g., Doe"
                      error={!!fieldErrors.LastName}
                      helperText={fieldErrors.LastName}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      GENDER
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                        MenuProps={selectMenuProps}
                      >
                        {genderOptions.map((gender) => (
                          <MenuItem key={gender} value={gender} sx={{ fontSize: '0.75rem' }}>
                            {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DATE OF BIRTH
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="DateOfBirth"
                      type="date"
                      value={formData.DateOfBirth}
                      onChange={handleChange}
                      disabled={loading}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EMAIL <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="Email"
                      type="email"
                      value={formData.Email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="john.doe@company.com"
                      error={!!fieldErrors.Email}
                      helperText={fieldErrors.Email}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PHONE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="e.g., 9876543210"
                      error={!!fieldErrors.Phone}
                      helperText={fieldErrors.Phone || "Indian mobile number (optional)"}
                      inputProps={{ maxLength: 15 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ADDRESS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      disabled={loading}
                      placeholder="Enter complete address"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
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
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WorkIcon sx={{ fontSize: '1rem' }} />
                Employment Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          options={departments}
                          getOptionLabel={(option) => option?.DepartmentName || ''}
                          value={departments.find(dept => dept._id === formData.DepartmentID) || null}
                          onChange={(event, newValue) => {
                            handleAutocompleteChange('DepartmentID', newValue?._id || '');
                          }}
                          loading={loadingData}
                          disabled={loading || loadingData}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select department"
                              error={!!fieldErrors.DepartmentID}
                              helperText={fieldErrors.DepartmentID}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                                '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                              }}
                            />
                          )}
                          PaperComponent={CustomPaper}
                          noOptionsText={departments.length === 0 ? "No departments available" : "No matching departments"}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAddDepartmentOpen(true)}
                        disabled={loading || loadingData}
                        startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                        sx={{ height: 32, minWidth: 'auto', px: 1.5, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'none' }}
                      >
                        Add New
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DESIGNATION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          options={designations}
                          getOptionLabel={(option) => option?.DesignationName || ''}
                          value={designations.find(desig => desig._id === formData.DesignationID) || null}
                          onChange={(event, newValue) => {
                            handleAutocompleteChange('DesignationID', newValue?._id || '');
                          }}
                          loading={loadingData}
                          disabled={loading || loadingData}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select designation"
                              error={!!fieldErrors.DesignationID}
                              helperText={fieldErrors.DesignationID}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                                '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                              }}
                            />
                          )}
                          PaperComponent={CustomPaper}
                          noOptionsText={designations.length === 0 ? "No designations available" : "No matching designations"}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAddDesignationOpen(true)}
                        disabled={loading || loadingData}
                        startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                        sx={{ height: 32, minWidth: 'auto', px: 1.5, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'none' }}
                      >
                        Add New
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DATE OF JOINING <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="DateOfJoining"
                      type="date"
                      value={formData.DateOfJoining}
                      onChange={handleChange}
                      disabled={loading}
                      error={!!fieldErrors.DateOfJoining}
                      helperText={fieldErrors.DateOfJoining}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EMPLOYMENT STATUS
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="EmploymentStatus"
                        value={formData.EmploymentStatus}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                        MenuProps={selectMenuProps}
                      >
                        {employmentStatusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EMPLOYMENT TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="EmploymentType"
                        value={formData.EmploymentType}
                        onChange={handleEmploymentTypeChange}
                        disabled={loading}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                        MenuProps={selectMenuProps}
                      >
                        {employmentTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                {/* Contract Company Field - Only shows when contract-based is selected */}
                {formData.EmploymentType === 'contract-based' && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        CONTRACT COMPANY <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          name="ContractCompany"
                          value={formData.ContractCompany}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loading}
                          error={!!fieldErrors.ContractCompany}
                          sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value="">Select Contract Company</MenuItem>
                          {contractCompanyOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {fieldErrors.ContractCompany && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.ContractCompany}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Pay Structure
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAY STRUCTURE TYPE
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="PayStructureType"
                        value={formData.PayStructureType}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                        MenuProps={selectMenuProps}
                      >
                        {payStructureOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                {(formData.EmploymentType === 'Monthly' || formData.EmploymentType === 'contract-based') && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        BASIC SALARY <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="BasicSalary"
                        type="number"
                        value={formData.BasicSalary}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="e.g., 25000"
                        error={!!fieldErrors.BasicSalary}
                        helperText={fieldErrors.BasicSalary}
                        inputProps={{ min: 0 }}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                          '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {formData.EmploymentType === 'Hourly' && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        HOURLY RATE <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="HourlyRate"
                        type="number"
                        value={formData.HourlyRate}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="e.g., 150"
                        error={!!fieldErrors.HourlyRate}
                        helperText={fieldErrors.HourlyRate}
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                          '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {formData.EmploymentType !== 'PieceRate' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          OVERTIME MULTIPLIER
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          name="OvertimeRateMultiplier"
                          type="number"
                          value={formData.OvertimeRateMultiplier}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="1.5"
                          inputProps={{ step: 0.25, min: 1, max: 3 }}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                            '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          SKILL LEVEL
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            name="SkillLevel"
                            value={formData.SkillLevel}
                            onChange={handleChange}
                            disabled={loading}
                            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                            MenuProps={selectMenuProps}
                          >
                            {skillLevelOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  </>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      WORK STATION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="WorkStation"
                      value={formData.WorkStation}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Station A"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LINE NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="LineNumber"
                      value={formData.LineNumber}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Line 1"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Tax & Identification (Optional)
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAN
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="PAN"
                      value={formData.PAN}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="e.g., ABCDE1234F"
                      error={!!fieldErrors.PAN}
                      helperText={fieldErrors.PAN || "10 characters"}
                      inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      AADHAR NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="AadharNumber"
                      value={formData.AadharNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="12 digits"
                      error={!!fieldErrors.AadharNumber}
                      helperText={fieldErrors.AadharNumber}
                      inputProps={{ maxLength: 12 }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PF NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="PFNumber"
                      value={formData.PFNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="XX/12345/1234567"
                      error={!!fieldErrors.PFNumber}
                      helperText={fieldErrors.PFNumber}
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      UAN
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="UAN"
                      value={formData.UAN}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="12 digits"
                      error={!!fieldErrors.UAN}
                      helperText={fieldErrors.UAN}
                      inputProps={{ maxLength: 12 }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ESI NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="ESINumber"
                      value={formData.ESINumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="17 digits"
                      error={!!fieldErrors.ESINumber}
                      helperText={fieldErrors.ESINumber}
                      inputProps={{ maxLength: 17 }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccountBalanceIcon sx={{ fontSize: '1rem' }} />
                Bank Details (Optional)
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ACCOUNT NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="BankAccountNumber"
                      value={formData.BankAccountNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="9-18 digits"
                      error={!!fieldErrors.BankAccountNumber}
                      helperText={fieldErrors.BankAccountNumber}
                      inputProps={{ maxLength: 18 }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ACCOUNT HOLDER NAME
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="BankAccountHolderName"
                      value={formData.BankAccountHolderName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="As per bank records"
                      error={!!fieldErrors.BankAccountHolderName}
                      helperText={fieldErrors.BankAccountHolderName}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BANK NAME
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="BankName"
                      value={formData.BankName}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., State Bank of India"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
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
                      name="BankBranch"
                      value={formData.BankBranch}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Main Branch"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
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
                      name="BankIfscCode"
                      value={formData.BankIfscCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="e.g., SBIN0123456"
                      error={!!fieldErrors.BankIfscCode}
                      helperText={fieldErrors.BankIfscCode || "4 letters + 0 + 6 alphanumeric"}
                      inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ACCOUNT TYPE
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="BankAccountType"
                        value={formData.BankAccountType}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                        MenuProps={selectMenuProps}
                      >
                        {accountTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmergencyIcon sx={{ fontSize: '1rem' }} />
                Emergency Contact (Optional)
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CONTACT NAME
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="EmergencyContactName"
                      value={formData.EmergencyContactName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="e.g., Jane Doe"
                      error={!!fieldErrors.EmergencyContactName}
                      helperText={fieldErrors.EmergencyContactName}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      RELATIONSHIP
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="EmergencyContactRelationship"
                      value={formData.EmergencyContactRelationship}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="e.g., Spouse"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PHONE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="EmergencyContactPhone"
                      value={formData.EmergencyContactPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="10 digits"
                      error={!!fieldErrors.EmergencyContactPhone}
                      helperText={fieldErrors.EmergencyContactPhone}
                      inputProps={{ maxLength: 10 }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PIN CODE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="EmergencyContactPIN"
                      value={formData.EmergencyContactPIN}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      placeholder="6 digits"
                      error={!!fieldErrors.EmergencyContactPIN}
                      helperText={fieldErrors.EmergencyContactPIN}
                      inputProps={{ maxLength: 6 }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ADDRESS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="EmergencyContactAddress"
                      value={formData.EmergencyContactAddress}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      disabled={loading}
                      placeholder="Complete address"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
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
          Edit Employee
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {employee?._id && (
            <Chip
              label={`ID: ${employee._id.slice(-6)}`}
              size="small"
              sx={{
                fontSize: '0.65rem',
                fontWeight: 500,
                height: 20,
                bgcolor: COLORS.background.light,
                color: COLORS.text.secondary,
                border: `1px solid ${COLORS.border}`,
              }}
            />
          )}
          <Chip
            label={employee?.EmploymentStatus === 'active' ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 500,
              height: 20,
              bgcolor: employee?.EmploymentStatus === 'active' ? COLORS.chips.active : COLORS.chips.inactive,
              color: employee?.EmploymentStatus === 'active' ? COLORS.primaryDark : COLORS.text.secondary,
            }}
          />
        </Box>
      </DialogTitle>

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
          size="small"
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none',
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
              textTransform: 'none',
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
              startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {loading ? 'Updating...' : 'Update Employee'}
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
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>

      {/* Add Department Modal */}
      <AddDepartments
        open={addDepartmentOpen}
        onClose={() => setAddDepartmentOpen(false)}
        onAdd={handleDepartmentAdded}
      />

      {/* Add Designation Modal */}
      <AddDesignations
        open={addDesignationOpen}
        onClose={() => setAddDesignationOpen(false)}
        onAdd={handleDesignationAdded}
      />
    </Dialog>
  );
};

export default EditEmployees;