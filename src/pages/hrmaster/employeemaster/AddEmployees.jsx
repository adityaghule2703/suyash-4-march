// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   styled,
//   Box,
//   Paper,
//   Divider,
//   FormHelperText,
//   Autocomplete,
//   InputAdornment
// } from '@mui/material';
// import { Add as AddIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, Search as SearchIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Enhanced Validation functions
// const validateEmail = (email) => {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(String(email).toLowerCase());
// };

// const validatePhone = (phone) => {
//   const re = /^\d{10}$/;
//   return phone === '' || re.test(phone);
// };

// const validatePAN = (pan) => {
//   const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//   return pan === '' || re.test(pan);
// };

// const validateAadhar = (aadhar) => {
//   const re = /^\d{12}$/;
//   return aadhar === '' || re.test(aadhar);
// };

// const validateIFSC = (ifsc) => {
//   const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//   return ifsc === '' || re.test(ifsc);
// };

// const validateAccountNumber = (accNo) => {
//   const re = /^\d{9,18}$/;
//   return accNo === '' || re.test(accNo);
// };

// const validatePIN = (pin) => {
//   const re = /^\d{6}$/;
//   return pin === '' || re.test(pin);
// };

// const validatePFNumber = (pf) => {
//   const re = /^[A-Z]{2}\/\d{5}\/\d{7}$/;
//   return pf === '' || re.test(pf);
// };

// const validateUAN = (uan) => {
//   const re = /^\d{12}$/;
//   return uan === '' || re.test(uan);
// };

// const validateESINumber = (esi) => {
//   const re = /^\d{17}$/;
//   return esi === '' || re.test(esi);
// };

// // New validation functions for text-only fields
// const validateName = (name) => {
//   // Allows letters, spaces, dots, hyphens, and apostrophes
//   const re = /^[A-Za-z\s.'-]+$/;
//   return name === '' || re.test(name);
// };

// const validateAddress = (address) => {
//   // Allows letters, numbers, spaces, and common address characters
//   const re = /^[A-Za-z0-9\s,.#\-/]+$/;
//   return address === '' || re.test(address);
// };

// const validateCity = (city) => {
//   // Allows letters, spaces, dots, and hyphens
//   const re = /^[A-Za-z\s.-]+$/;
//   return city === '' || re.test(city);
// };

// const validateState = (state) => {
//   // Allows letters and spaces
//   const re = /^[A-Za-z\s]+$/;
//   return state === '' || re.test(state);
// };

// const validateBankName = (bankName) => {
//   // Allows letters, spaces, dots, and common bank name characters
//   const re = /^[A-Za-z\s.'&-]+$/;
//   return bankName === '' || re.test(bankName);
// };

// const validateAccountHolderName = (name) => {
//   // Allows letters, spaces, dots, and common name characters
//   const re = /^[A-Za-z\s.'-]+$/;
//   return name === '' || re.test(name);
// };

// const validateBranchName = (branch) => {
//   // Allows letters, numbers, spaces, and common branch name characters
//   const re = /^[A-Za-z0-9\s.-]+$/;
//   return branch === '' || re.test(branch);
// };

// const validateWorkStation = (station) => {
//   // Allows letters, numbers, spaces, and hyphens
//   const re = /^[A-Za-z0-9\s-]+$/;
//   return station === '' || re.test(station);
// };

// const validateLineNumber = (line) => {
//   // Allows letters, numbers, spaces, and hyphens
//   const re = /^[A-Za-z0-9\s-]+$/;
//   return line === '' || re.test(line);
// };

// const validateEmergencyContactName = (name) => {
//   // Allows letters, spaces, dots, and hyphens
//   const re = /^[A-Za-z\s.'-]+$/;
//   return name === '' || re.test(name);
// };

// const validateRelationship = (relationship) => {
//   // Allows letters and spaces
//   const re = /^[A-Za-z\s]+$/;
//   return relationship === '' || re.test(relationship);
// };

// // Custom styled connector for stepper
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   '& .MuiStepConnector-line': {
//     height: 4,
//     border: 0,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//     margin: 2,
//   },
//   '&.Mui-active .MuiStepConnector-line': {
//     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//   },
//   '&.Mui-completed .MuiStepConnector-line': {
//     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
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

// const steps = ['Personal Info', 'Employment', 'Pay & Work', 'Bank & Emergency'];

// const AddEmployees = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     // Basic Information
//     FirstName: '',
//     LastName: '',
//     Gender: 'M',
//     DateOfBirth: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     DepartmentID: '',
//     DesignationID: '',
//     DateOfJoining: '',
//     EmploymentStatus: 'active',
//     EmploymentType: 'Monthly',
//     PayStructureType: 'Fixed',
    
//     // Employment Type Specific
//     BasicSalary: '',
//     HourlyRate: '',
//     OvertimeRateMultiplier: 1.5,
    
//     // Work Information
//     SkillLevel: '',
//     WorkStation: '',
//     LineNumber: '',
    
//     // Tax & Identification
//     PAN: '',
//     AadharNumber: '',
//     PFNumber: '',
//     UAN: '',
//     ESINumber: '',
    
//     // Bank Details (flattened)
//     BankAccountNumber: '',
//     BankAccountHolderName: '',
//     BankName: '',
//     BankBranch: '',
//     BankIfscCode: '',
//     BankAccountType: 'Savings',
    
//     // Emergency Contact (flattened)
//     EmergencyContactName: '',
//     EmergencyContactRelationship: '',
//     EmergencyContactPhone: '',
//     EmergencyContactAddress: '',
//     EmergencyContactPIN: ''
//   });

//   // Search states for dropdowns
//   const [departmentSearch, setDepartmentSearch] = useState('');
//   const [designationSearch, setDesignationSearch] = useState('');

//   // Field-specific error states
//   const [fieldErrors, setFieldErrors] = useState({
//     FirstName: '',
//     LastName: '',
//     Email: '',
//     Phone: '',
//     Address: '',
//     WorkStation: '',
//     LineNumber: '',
//     PAN: '',
//     AadharNumber: '',
//     PFNumber: '',
//     UAN: '',
//     ESINumber: '',
//     BankAccountNumber: '',
//     BankAccountHolderName: '',
//     BankName: '',
//     BankBranch: '',
//     BankIfscCode: '',
//     EmergencyContactName: '',
//     EmergencyContactRelationship: '',
//     EmergencyContactPhone: '',
//     EmergencyContactAddress: '',
//     EmergencyContactPIN: ''
//   });

//   // Touched fields for validation
//   const [touched, setTouched] = useState({});

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [loadingData, setLoadingData] = useState(true);

//   // Gender options
//   const genderOptions = ['M', 'F', 'O'];
  
//   // Employment Status options based on schema
//   const employmentStatusOptions = [
//     { value: 'active', label: 'Active' },
//     { value: 'resigned', label: 'Resigned' },
//     { value: 'terminated', label: 'Terminated' },
//     { value: 'retired', label: 'Retired' }
//   ];
  
//   // Employment Type options - only Monthly, Hourly, PieceRate
//   const employmentTypeOptions = [
//     { value: 'Monthly', label: 'Monthly' },
//     { value: 'Hourly', label: 'Hourly' },
//     { value: 'PieceRate', label: 'Piece Rate' }
//   ];

//   // Pay Structure Type options based on schema
//   const payStructureOptions = [
//     { value: 'Fixed', label: 'Fixed' },
//     { value: 'Variable', label: 'Variable' },
//     { value: 'Commission', label: 'Commission' },
//     { value: 'PieceRate', label: 'Piece Rate' }
//   ];

//   // Skill Level options based on schema
//   const skillLevelOptions = [
//     { value: 'Unskilled', label: 'Unskilled' },
//     { value: 'Semi-Skilled', label: 'Semi-Skilled' },
//     { value: 'Skilled', label: 'Skilled' },
//     { value: 'Highly Skilled', label: 'Highly Skilled' }
//   ];
  
//   // Account types options based on schema
//   const accountTypeOptions = [
//     { value: 'Savings', label: 'Savings' },
//     { value: 'Current', label: 'Current' },
//     { value: 'Salary', label: 'Salary' }
//   ];

//   // Fetch departments and designations
//   useEffect(() => {
//     fetchDropdownData();
//   }, []);

//   const fetchDropdownData = async () => {
//     try {
//       setLoadingData(true);
//       const token = localStorage.getItem('token');
      
//       // Fetch departments
//       const deptResponse = await axios.get(`${BASE_URL}/api/departments`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       // Fetch designations
//       const desigResponse = await axios.get(`${BASE_URL}/api/designations`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (deptResponse.data.success) {
//         setDepartments(deptResponse.data.data || []);
//       }
      
//       if (desigResponse.data.success) {
//         setDesignations(desigResponse.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching dropdown data:', err);
//       setError('Failed to load dropdown data. Please refresh.');
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   // Validate a specific field
//   const validateField = (name, value) => {
//     switch(name) {
//       // Personal Info
//       case 'FirstName':
//       case 'LastName':
//         if (value && !validateName(value)) {
//           return 'Only letters, spaces, dots, hyphens, and apostrophes are allowed';
//         }
//         if (!value && (name === 'FirstName' || name === 'LastName')) {
//           return ''; // Required validation handled separately
//         }
//         break;
      
//       case 'Email':
//         if (value && !validateEmail(value)) {
//           return 'Please enter a valid email address';
//         }
//         break;
      
//       case 'Phone':
//         if (value && !validatePhone(value)) {
//           return 'Phone number must be 10 digits';
//         }
//         break;
      
//       case 'Address':
//         if (value && !validateAddress(value)) {
//           return 'Address contains invalid characters';
//         }
//         break;
      
//       // Work Information
//       case 'WorkStation':
//         if (value && !validateWorkStation(value)) {
//           return 'Work station can only contain letters, numbers, spaces, and hyphens';
//         }
//         break;
      
//       case 'LineNumber':
//         if (value && !validateLineNumber(value)) {
//           return 'Line number can only contain letters, numbers, spaces, and hyphens';
//         }
//         break;
      
//       // Tax & Identification
//       case 'PAN':
//         if (value && !validatePAN(value)) {
//           return 'PAN must be in format: ABCDE1234F';
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
      
//       // Bank Details
//       case 'BankAccountNumber':
//         if (value && !validateAccountNumber(value)) {
//           return 'Account number must be 9-18 digits';
//         }
//         break;
      
//       case 'BankAccountHolderName':
//         if (value && !validateAccountHolderName(value)) {
//           return 'Account holder name can only contain letters, spaces, dots, and hyphens';
//         }
//         break;
      
//       case 'BankName':
//         if (value && !validateBankName(value)) {
//           return 'Bank name can only contain letters, spaces, dots, apostrophes, and hyphens';
//         }
//         break;
      
//       case 'BankBranch':
//         if (value && !validateBranchName(value)) {
//           return 'Branch name can only contain letters, numbers, spaces, dots, and hyphens';
//         }
//         break;
      
//       case 'BankIfscCode':
//         if (value && !validateIFSC(value)) {
//           return 'IFSC code must be in format: ABCD0123456';
//         }
//         break;
      
//       // Emergency Contact
//       case 'EmergencyContactName':
//         if (value && !validateEmergencyContactName(value)) {
//           return 'Contact name can only contain letters, spaces, dots, and hyphens';
//         }
//         break;
      
//       case 'EmergencyContactRelationship':
//         if (value && !validateRelationship(value)) {
//           return 'Relationship can only contain letters and spaces';
//         }
//         break;
      
//       case 'EmergencyContactPhone':
//         if (value && !validatePhone(value)) {
//           return 'Emergency contact phone must be 10 digits';
//         }
//         break;
      
//       case 'EmergencyContactAddress':
//         if (value && !validateAddress(value)) {
//           return 'Address contains invalid characters';
//         }
//         break;
      
//       case 'EmergencyContactPIN':
//         if (value && !validatePIN(value)) {
//           return 'PIN code must be 6 digits';
//         }
//         break;
      
//       default:
//         return '';
//     }
//     return '';
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // For text fields, prevent numbers if they shouldn't be there
//     let processedValue = value;
    
//     // Apply specific field constraints
//     switch(name) {
//       case 'FirstName':
//       case 'LastName':
//       case 'BankAccountHolderName':
//       case 'EmergencyContactName':
//       case 'EmergencyContactRelationship':
//         // Only allow letters, spaces, and specific characters, no numbers
//         processedValue = value.replace(/[^A-Za-z\s.'-]/g, '');
//         break;
      
//       case 'BankName':
//         // Only allow letters, spaces, and specific characters for bank name
//         processedValue = value.replace(/[^A-Za-z\s.'&-]/g, '');
//         break;
      
//       case 'Address':
//       case 'EmergencyContactAddress':
//         // Allow common address characters but restrict special ones
//         processedValue = value.replace(/[^A-Za-z0-9\s,.#\-/]/g, '');
//         break;
      
//       case 'WorkStation':
//       case 'LineNumber':
//         // Allow letters, numbers, spaces, hyphens
//         processedValue = value.replace(/[^A-Za-z0-9\s-]/g, '');
//         break;
      
//       case 'BankBranch':
//         // Allow letters, numbers, spaces, dots, hyphens
//         processedValue = value.replace(/[^A-Za-z0-9\s.-]/g, '');
//         break;
      
//       case 'Phone':
//       case 'EmergencyContactPhone':
//         // Only allow digits
//         processedValue = value.replace(/\D/g, '');
//         break;
      
//       case 'BankAccountNumber':
//         // Only allow digits
//         processedValue = value.replace(/\D/g, '');
//         break;
      
//       case 'PAN':
//         // Automatically uppercase PAN
//         processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
//         break;
      
//       case 'AadharNumber':
//       case 'UAN':
//       case 'ESINumber':
//       case 'EmergencyContactPIN':
//         // Only allow digits
//         processedValue = value.replace(/\D/g, '');
//         break;
      
//       case 'PFNumber':
//         // Format PF number with allowed characters
//         processedValue = value.toUpperCase().replace(/[^A-Z0-9/]/g, '');
//         break;
      
//       case 'BankIfscCode':
//         // Format IFSC code
//         processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
//         break;
      
//       default:
//         processedValue = value;
//     }
    
//     // Update form data
//     setFormData(prev => ({
//       ...prev,
//       [name]: processedValue
//     }));

//     // Validate field if it's been touched or has value
//     if (touched[name] || value) {
//       const errorMessage = validateField(name, processedValue);
//       setFieldErrors(prev => ({
//         ...prev,
//         [name]: errorMessage
//       }));
//     }
//   };

//   // Custom handler for Autocomplete components
//   const handleAutocompleteChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
    
//     // Mark field as touched
//     setTouched(prev => ({
//       ...prev,
//       [name]: true
//     }));

//     // Validate field on blur
//     const errorMessage = validateField(name, value);
//     setFieldErrors(prev => ({
//       ...prev,
//       [name]: errorMessage
//     }));
//   };

//   // Get default PayStructureType based on EmploymentType
//   const getDefaultPayStructureType = (employmentType) => {
//     switch(employmentType) {
//       case 'Monthly':
//       case 'Hourly':
//         return 'Fixed';
//       case 'PieceRate':
//         return 'PieceRate';
//       default:
//         return 'Fixed';
//     }
//   };

//   // Handle Employment Type change with auto-updating PayStructureType
//   const handleEmploymentTypeChange = (e) => {
//     const employmentType = e.target.value;
//     const defaultPayStructure = getDefaultPayStructureType(employmentType);
    
//     setFormData(prev => ({
//       ...prev,
//       EmploymentType: employmentType,
//       PayStructureType: defaultPayStructure
//     }));
//   };

//   // Check if salary field should be shown (only Monthly)
//   const showSalaryField = () => {
//     return formData.EmploymentType === 'Monthly';
//   };

//   // Check if overtime field should be shown (Monthly and Hourly)
//   const showOvertimeField = () => {
//     return ['Monthly', 'Hourly'].includes(formData.EmploymentType);
//   };

//   // Navigation handlers
//   const handleNext = () => {
//     if (validateStep()) {
//       setActiveStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   // Validate current step
//   const validateStep = () => {
//     setError('');
//     let isValid = true;
//     const newFieldErrors = { ...fieldErrors };

//     switch(activeStep) {
//       case 0: // Personal Info
//         // First Name validation
//         if (!formData.FirstName.trim()) {
//           setError('First name is required');
//           isValid = false;
//         } else if (!validateName(formData.FirstName)) {
//           newFieldErrors.FirstName = 'First name can only contain letters, spaces, and hyphens';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct first name format');
//           isValid = false;
//         }
        
//         // Last Name validation
//         if (!formData.LastName.trim()) {
//           setError('Last name is required');
//           isValid = false;
//         } else if (!validateName(formData.LastName)) {
//           newFieldErrors.LastName = 'Last name can only contain letters, spaces, and hyphens';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct last name format');
//           isValid = false;
//         }
        
//         // Email validation
//         if (!formData.Email.trim()) {
//           setError('Email is required');
//           isValid = false;
//         } else if (!validateEmail(formData.Email)) {
//           newFieldErrors.Email = 'Please enter a valid email address';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct email format');
//           isValid = false;
//         }
        
//         // Phone validation if provided
//         if (formData.Phone && !validatePhone(formData.Phone)) {
//           newFieldErrors.Phone = 'Phone number must be 10 digits';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct phone number');
//           isValid = false;
//         }
        
//         // Address validation if provided
//         if (formData.Address && !validateAddress(formData.Address)) {
//           newFieldErrors.Address = 'Address contains invalid characters';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct address format');
//           isValid = false;
//         }
//         break;

//       case 1: // Employment
//         if (!formData.DepartmentID) {
//           setError('Please select a department');
//           isValid = false;
//         } else if (!formData.DesignationID) {
//           setError('Please select a designation');
//           isValid = false;
//         } else if (!formData.DateOfJoining) {
//           setError('Date of joining is required');
//           isValid = false;
//         }
//         break;

//       case 2: // Pay & Work
//         if (formData.EmploymentType === 'Monthly' && !formData.BasicSalary) {
//           setError('Basic salary is required for monthly employees');
//           isValid = false;
//         } else if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
//           setError('Hourly rate is required for hourly employees');
//           isValid = false;
//         }
        
//         // Validate work fields if provided
//         if (formData.WorkStation && !validateWorkStation(formData.WorkStation)) {
//           newFieldErrors.WorkStation = 'Work station can only contain letters, numbers, spaces, and hyphens';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct work station format');
//           isValid = false;
//         }
        
//         if (formData.LineNumber && !validateLineNumber(formData.LineNumber)) {
//           newFieldErrors.LineNumber = 'Line number can only contain letters, numbers, spaces, and hyphens';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct line number format');
//           isValid = false;
//         }
        
//         // Validate tax fields if provided
//         if (formData.PAN && !validatePAN(formData.PAN)) {
//           newFieldErrors.PAN = 'PAN must be in format: ABCDE1234F';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct PAN format');
//           isValid = false;
//         }
//         if (formData.AadharNumber && !validateAadhar(formData.AadharNumber)) {
//           newFieldErrors.AadharNumber = 'Aadhar number must be 12 digits';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct Aadhar format');
//           isValid = false;
//         }
//         if (formData.PFNumber && !validatePFNumber(formData.PFNumber)) {
//           newFieldErrors.PFNumber = 'PF number must be in format: XX/12345/1234567';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct PF number format');
//           isValid = false;
//         }
//         if (formData.UAN && !validateUAN(formData.UAN)) {
//           newFieldErrors.UAN = 'UAN must be 12 digits';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct UAN format');
//           isValid = false;
//         }
//         if (formData.ESINumber && !validateESINumber(formData.ESINumber)) {
//           newFieldErrors.ESINumber = 'ESI number must be 17 digits';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct ESI number format');
//           isValid = false;
//         }
//         break;

//       case 3: // Bank & Emergency
//         // Validate bank fields if provided
//         if (formData.BankAccountNumber && !validateAccountNumber(formData.BankAccountNumber)) {
//           newFieldErrors.BankAccountNumber = 'Account number must be 9-18 digits';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct account number format');
//           isValid = false;
//         }
        
//         if (formData.BankAccountHolderName && !validateAccountHolderName(formData.BankAccountHolderName)) {
//           newFieldErrors.BankAccountHolderName = 'Account holder name can only contain letters, spaces, dots, and hyphens';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct account holder name');
//           isValid = false;
//         }
        
//         if (formData.BankName && !validateBankName(formData.BankName)) {
//           newFieldErrors.BankName = 'Bank name can only contain letters, spaces, dots, and hyphens';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct bank name');
//           isValid = false;
//         }
        
//         if (formData.BankBranch && !validateBranchName(formData.BankBranch)) {
//           newFieldErrors.BankBranch = 'Branch name can only contain letters, numbers, spaces, and hyphens';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct branch name');
//           isValid = false;
//         }
        
//         if (formData.BankIfscCode && !validateIFSC(formData.BankIfscCode)) {
//           newFieldErrors.BankIfscCode = 'IFSC code must be in format: ABCD0123456';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct IFSC code format');
//           isValid = false;
//         }
        
//         // Validate emergency contact fields if provided
//         if (formData.EmergencyContactName && !validateEmergencyContactName(formData.EmergencyContactName)) {
//           newFieldErrors.EmergencyContactName = 'Contact name can only contain letters, spaces, dots, and hyphens';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct emergency contact name');
//           isValid = false;
//         }
        
//         if (formData.EmergencyContactRelationship && !validateRelationship(formData.EmergencyContactRelationship)) {
//           newFieldErrors.EmergencyContactRelationship = 'Relationship can only contain letters and spaces';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct relationship');
//           isValid = false;
//         }
        
//         if (formData.EmergencyContactPhone && !validatePhone(formData.EmergencyContactPhone)) {
//           newFieldErrors.EmergencyContactPhone = 'Emergency contact phone must be 10 digits';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct emergency contact phone');
//           isValid = false;
//         }
        
//         if (formData.EmergencyContactAddress && !validateAddress(formData.EmergencyContactAddress)) {
//           newFieldErrors.EmergencyContactAddress = 'Address contains invalid characters';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct emergency contact address');
//           isValid = false;
//         }
        
//         if (formData.EmergencyContactPIN && !validatePIN(formData.EmergencyContactPIN)) {
//           newFieldErrors.EmergencyContactPIN = 'PIN code must be 6 digits';
//           setFieldErrors(newFieldErrors);
//           setError('Please correct PIN code');
//           isValid = false;
//         }
//         break;

//       default:
//         break;
//     }

//     return isValid;
//   };

//   const handleSubmit = async () => {
//     // Validate all required fields and formats
//     setError('');
    
//     // First Name validation
//     if (!formData.FirstName.trim()) {
//       setError('First name is required');
//       return;
//     }
//     if (!validateName(formData.FirstName)) {
//       setError('First name contains invalid characters');
//       return;
//     }

//     // Last Name validation
//     if (!formData.LastName.trim()) {
//       setError('Last name is required');
//       return;
//     }
//     if (!validateName(formData.LastName)) {
//       setError('Last name contains invalid characters');
//       return;
//     }

//     // Email validation
//     if (!formData.Email.trim()) {
//       setError('Email is required');
//       return;
//     }
//     if (!validateEmail(formData.Email)) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     // Phone validation if provided
//     if (formData.Phone && !validatePhone(formData.Phone)) {
//       setError('Phone number must be 10 digits');
//       return;
//     }

//     // Department and Designation
//     if (!formData.DepartmentID) {
//       setError('Please select a department');
//       return;
//     }
//     if (!formData.DesignationID) {
//       setError('Please select a designation');
//       return;
//     }
//     if (!formData.DateOfJoining) {
//       setError('Date of joining is required');
//       return;
//     }

//     // Employment type specific validation
//     if (formData.EmploymentType === 'Monthly' && !formData.BasicSalary) {
//       setError('Basic salary is required for monthly employees');
//       return;
//     }
//     if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
//       setError('Hourly rate is required for hourly employees');
//       return;
//     }

//     // Work Information validation
//     if (formData.WorkStation && !validateWorkStation(formData.WorkStation)) {
//       setError('Work station contains invalid characters');
//       return;
//     }
//     if (formData.LineNumber && !validateLineNumber(formData.LineNumber)) {
//       setError('Line number contains invalid characters');
//       return;
//     }

//     // Validate all optional fields that are filled
//     if (formData.PAN && !validatePAN(formData.PAN)) {
//       setError('PAN must be in format: ABCDE1234F');
//       return;
//     }
//     if (formData.AadharNumber && !validateAadhar(formData.AadharNumber)) {
//       setError('Aadhar number must be 12 digits');
//       return;
//     }
//     if (formData.PFNumber && !validatePFNumber(formData.PFNumber)) {
//       setError('PF number must be in format: XX/12345/1234567');
//       return;
//     }
//     if (formData.UAN && !validateUAN(formData.UAN)) {
//       setError('UAN must be 12 digits');
//       return;
//     }
//     if (formData.ESINumber && !validateESINumber(formData.ESINumber)) {
//       setError('ESI number must be 17 digits');
//       return;
//     }

//     // Bank Details validation
//     if (formData.BankAccountNumber && !validateAccountNumber(formData.BankAccountNumber)) {
//       setError('Account number must be 9-18 digits');
//       return;
//     }
//     if (formData.BankAccountHolderName && !validateAccountHolderName(formData.BankAccountHolderName)) {
//       setError('Account holder name contains invalid characters');
//       return;
//     }
//     if (formData.BankName && !validateBankName(formData.BankName)) {
//       setError('Bank name contains invalid characters');
//       return;
//     }
//     if (formData.BankBranch && !validateBranchName(formData.BankBranch)) {
//       setError('Branch name contains invalid characters');
//       return;
//     }
//     if (formData.BankIfscCode && !validateIFSC(formData.BankIfscCode)) {
//       setError('IFSC code must be in format: ABCD0123456');
//       return;
//     }

//     // Emergency Contact validation
//     if (formData.EmergencyContactName && !validateEmergencyContactName(formData.EmergencyContactName)) {
//       setError('Emergency contact name contains invalid characters');
//       return;
//     }
//     if (formData.EmergencyContactRelationship && !validateRelationship(formData.EmergencyContactRelationship)) {
//       setError('Relationship contains invalid characters');
//       return;
//     }
//     if (formData.EmergencyContactPhone && !validatePhone(formData.EmergencyContactPhone)) {
//       setError('Emergency contact phone must be 10 digits');
//       return;
//     }
//     if (formData.EmergencyContactAddress && !validateAddress(formData.EmergencyContactAddress)) {
//       setError('Emergency contact address contains invalid characters');
//       return;
//     }
//     if (formData.EmergencyContactPIN && !validatePIN(formData.EmergencyContactPIN)) {
//       setError('PIN code must be 6 digits');
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');

//       // Prepare payload with nested objects structure
//       const payload = {
//         FirstName: formData.FirstName,
//         LastName: formData.LastName,
//         Gender: formData.Gender,
//         DateOfBirth: formData.DateOfBirth || undefined,
//         Email: formData.Email,
//         Phone: formData.Phone || undefined,
//         Address: formData.Address || undefined,
//         DepartmentID: formData.DepartmentID,
//         DesignationID: formData.DesignationID,
//         DateOfJoining: formData.DateOfJoining,
//         EmploymentStatus: formData.EmploymentStatus,
//         EmploymentType: formData.EmploymentType,
//         PayStructureType: formData.PayStructureType,
        
//         // Employment Type Specific Fields
//         BasicSalary: formData.EmploymentType === 'Monthly' ? Number(formData.BasicSalary || 0) : 0,
//         HourlyRate: formData.EmploymentType === 'Hourly' ? Number(formData.HourlyRate || 0) : 0,
//         OvertimeRateMultiplier: Number(formData.OvertimeRateMultiplier || 1.5),
        
//         // Work Information
//         SkillLevel: formData.SkillLevel || undefined,
//         WorkStation: formData.WorkStation || undefined,
//         LineNumber: formData.LineNumber || undefined,
        
//         // Tax & Identification
//         PAN: formData.PAN || undefined,
//         AadharNumber: formData.AadharNumber || undefined,
//         PFNumber: formData.PFNumber || undefined,
//         UAN: formData.UAN || undefined,
//         ESINumber: formData.ESINumber || undefined,
        
//         // Bank Details (as nested object)
//         BankDetails: {}
//       };

//       // Add BankDetails only if at least one field is provided
//       if (formData.BankAccountNumber || formData.BankAccountHolderName || 
//           formData.BankName || formData.BankBranch || formData.BankIfscCode) {
//         payload.BankDetails = {
//           accountNumber: formData.BankAccountNumber || undefined,
//           accountHolderName: formData.BankAccountHolderName || undefined,
//           bankName: formData.BankName || undefined,
//           branch: formData.BankBranch || undefined,
//           ifscCode: formData.BankIfscCode || undefined,
//           accountType: formData.BankAccountType || 'Savings'
//         };
        
//         // Remove undefined values from BankDetails
//         Object.keys(payload.BankDetails).forEach(key => 
//           payload.BankDetails[key] === undefined && delete payload.BankDetails[key]
//         );
//       }

//       // Add EmergencyContact only if at least one field is provided
//       if (formData.EmergencyContactName || formData.EmergencyContactRelationship || 
//           formData.EmergencyContactPhone || formData.EmergencyContactAddress || formData.EmergencyContactPIN) {
//         payload.EmergencyContact = {
//           name: formData.EmergencyContactName || undefined,
//           relationship: formData.EmergencyContactRelationship || undefined,
//           phone: formData.EmergencyContactPhone || undefined,
//           address: formData.EmergencyContactAddress || undefined,
//           pinCode: formData.EmergencyContactPIN || undefined
//         };
        
//         // Remove undefined values from EmergencyContact
//         Object.keys(payload.EmergencyContact).forEach(key => 
//           payload.EmergencyContact[key] === undefined && delete payload.EmergencyContact[key]
//         );
//       }

//       // Remove undefined top-level fields
//       Object.keys(payload).forEach(key => 
//         payload[key] === undefined && delete payload[key]
//       );

//       // If BankDetails or EmergencyContact are empty objects, remove them
//       if (payload.BankDetails && Object.keys(payload.BankDetails).length === 0) {
//         delete payload.BankDetails;
//       }
      
//       if (payload.EmergencyContact && Object.keys(payload.EmergencyContact).length === 0) {
//         delete payload.EmergencyContact;
//       }

//       const response = await axios.post(
//         `${BASE_URL}/api/employees`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         onAdd(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to add employee');
//       }
//     } catch (err) {
//       console.error('Error adding employee:', err);
//       setError(err.response?.data?.message || 'Failed to add employee. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

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
//       SkillLevel: '',
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
//     setDepartmentSearch('');
//     setDesignationSearch('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   // Render content based on active step
//   const renderStepContent = () => {
//     switch(activeStep) {
//       case 0: // Personal Info
//         return (
//           <>
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="FirstName"
//                 value={formData.FirstName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 required
//                 error={touched.FirstName && (!!fieldErrors.FirstName || !formData.FirstName.trim())}
//                 helperText={
//                   touched.FirstName 
//                     ? (!formData.FirstName.trim() ? 'First name is required' : fieldErrors.FirstName)
//                     : 'Letters, spaces, and hyphens only'
//                 }
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="LastName"
//                 value={formData.LastName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 required
//                 error={touched.LastName && (!!fieldErrors.LastName || !formData.LastName.trim())}
//                 helperText={
//                   touched.LastName 
//                     ? (!formData.LastName.trim() ? 'Last name is required' : fieldErrors.LastName)
//                     : 'Letters, spaces, and hyphens only'
//                 }
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>
            
//             <Stack direction="row" spacing={2}>
//               <FormControl fullWidth>
//                 <InputLabel>Gender</InputLabel>
//                 <Select
//                   name="Gender"
//                   value={formData.Gender}
//                   onChange={handleChange}
//                   label="Gender"
//                   disabled={loading || loadingData}
//                   sx={{ borderRadius: 1 }}
//                   MenuProps={selectMenuProps}
//                 >
//                   {genderOptions.map((gender) => (
//                     <MenuItem key={gender} value={gender}>
//                       {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
              
//               <TextField
//                 fullWidth
//                 label="Date of Birth"
//                 name="DateOfBirth"
//                 type="date"
//                 value={formData.DateOfBirth}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>
            
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="Email"
//                 type="email"
//                 value={formData.Email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 required
//                 error={touched.Email && (!!fieldErrors.Email || !formData.Email)}
//                 helperText={
//                   touched.Email 
//                     ? (!formData.Email ? 'Email is required' : fieldErrors.Email)
//                     : 'Enter a valid email address'
//                 }
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Phone"
//                 name="Phone"
//                 value={formData.Phone}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.Phone && !!fieldErrors.Phone}
//                 helperText={touched.Phone ? fieldErrors.Phone : '10 digit number (optional)'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="9876543210"
//                 inputProps={{ maxLength: 10 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <TextField
//               fullWidth
//               label="Address"
//               name="Address"
//               value={formData.Address}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               multiline
//               rows={2}
//               error={touched.Address && !!fieldErrors.Address}
//               helperText={touched.Address ? fieldErrors.Address : 'Street, city, etc. (optional)'}
//               disabled={loading || loadingData}
//               size="medium"
//               variant="outlined"
//               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//             />
//           </>
//         );

//       case 1: // Employment
//         return (
//           <>
//             <Stack direction="row" spacing={2}>
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={departments}
//                   getOptionLabel={(option) => {
//                     if (typeof option === 'string') return option;
//                     return option.DepartmentName || '';
//                   }}
//                   value={departments.find(dept => dept._id === formData.DepartmentID) || null}
//                   onChange={(event, newValue) => {
//                     handleAutocompleteChange('DepartmentID', newValue?._id || '');
//                   }}
//                   onInputChange={(event, newInputValue) => {
//                     setDepartmentSearch(newInputValue);
//                   }}
//                   loading={loadingData}
//                   disabled={loading || loadingData}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Department *"
//                       required
//                       error={touched.DepartmentID && !formData.DepartmentID}
//                       helperText={touched.DepartmentID && !formData.DepartmentID ? 'Department is required' : ''}
//                       InputProps={{
//                         ...params.InputProps,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   )}
//                   PaperComponent={CustomPaper}
//                   ListboxProps={{
//                     style: {
//                       maxHeight: 200,
//                       overflow: 'auto',
//                       scrollbarWidth: 'none',
//                       msOverflowStyle: 'none',
//                       '&::-webkit-scrollbar': {
//                         display: 'none'
//                       }
//                     }
//                   }}
//                   noOptionsText={departments.length === 0 ? "No departments available" : "No matching departments"}
//                   isOptionEqualToValue={(option, value) => option._id === value._id}
//                 />
//               </FormControl>
              
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={designations}
//                   getOptionLabel={(option) => {
//                     if (typeof option === 'string') return option;
//                     return `${option.DesignationName || ''} ${option.Level ? `(Level ${option.Level})` : ''}`;
//                   }}
//                   value={designations.find(desig => desig._id === formData.DesignationID) || null}
//                   onChange={(event, newValue) => {
//                     handleAutocompleteChange('DesignationID', newValue?._id || '');
//                   }}
//                   onInputChange={(event, newInputValue) => {
//                     setDesignationSearch(newInputValue);
//                   }}
//                   loading={loadingData}
//                   disabled={loading || loadingData}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Designation *"
//                       required
//                       error={touched.DesignationID && !formData.DesignationID}
//                       helperText={touched.DesignationID && !formData.DesignationID ? 'Designation is required' : ''}
//                       InputProps={{
//                         ...params.InputProps,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   )}
//                   PaperComponent={CustomPaper}
//                   ListboxProps={{
//                     style: {
//                       maxHeight: 200,
//                       overflow: 'auto',
//                       scrollbarWidth: 'none',
//                       msOverflowStyle: 'none',
//                       '&::-webkit-scrollbar': {
//                         display: 'none'
//                       }
//                     }
//                   }}
//                   noOptionsText={designations.length === 0 ? "No designations available" : "No matching designations"}
//                   isOptionEqualToValue={(option, value) => option._id === value._id}
//                 />
//               </FormControl>
//             </Stack>
            
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Date of Joining *"
//                 name="DateOfJoining"
//                 type="date"
//                 value={formData.DateOfJoining}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 required
//                 error={touched.DateOfJoining && !formData.DateOfJoining}
//                 helperText={touched.DateOfJoining && !formData.DateOfJoining ? 'Date of joining is required' : ''}
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
              
//               <FormControl fullWidth>
//                 <InputLabel>Employment Status</InputLabel>
//                 <Select
//                   name="EmploymentStatus"
//                   value={formData.EmploymentStatus}
//                   onChange={handleChange}
//                   label="Employment Status"
//                   disabled={loading || loadingData}
//                   sx={{ borderRadius: 1 }}
//                   MenuProps={selectMenuProps}
//                 >
//                   {employmentStatusOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Stack>
//           </>
//         );

//       case 2: // Pay & Work
//         return (
//           <>
//             <Stack direction="row" spacing={2}>
//               <FormControl fullWidth>
//                 <InputLabel>Employment Type *</InputLabel>
//                 <Select
//                   name="EmploymentType"
//                   value={formData.EmploymentType}
//                   onChange={handleEmploymentTypeChange}
//                   label="Employment Type *"
//                   disabled={loading || loadingData}
//                   sx={{ borderRadius: 1 }}
//                   MenuProps={selectMenuProps}
//                 >
//                   {employmentTypeOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl fullWidth>
//                 <InputLabel>Pay Structure Type *</InputLabel>
//                 <Select
//                   name="PayStructureType"
//                   value={formData.PayStructureType}
//                   onChange={handleChange}
//                   label="Pay Structure Type *"
//                   disabled={loading || loadingData}
//                   sx={{ borderRadius: 1 }}
//                   MenuProps={selectMenuProps}
//                 >
//                   {payStructureOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               {showSalaryField() && (
//                 <TextField
//                   fullWidth
//                   label="Basic Salary"
//                   name="BasicSalary"
//                   type="number"
//                   value={formData.BasicSalary}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   required
//                   error={touched.BasicSalary && !formData.BasicSalary}
//                   helperText={touched.BasicSalary && !formData.BasicSalary ? 'Basic salary is required' : ''}
//                   disabled={loading || loadingData}
//                   size="medium"
//                   variant="outlined"
//                   inputProps={{ min: 0 }}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//               )}

//               {formData.EmploymentType === "Hourly" && (
//                 <TextField
//                   fullWidth
//                   label="Hourly Rate"
//                   name="HourlyRate"
//                   type="number"
//                   value={formData.HourlyRate}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   required
//                   error={touched.HourlyRate && !formData.HourlyRate}
//                   helperText={touched.HourlyRate && !formData.HourlyRate ? 'Hourly rate is required' : ''}
//                   disabled={loading || loadingData}
//                   size="medium"
//                   variant="outlined"
//                   inputProps={{ min: 0, step: 0.01 }}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//               )}

//               {formData.EmploymentType === "PieceRate" && (
//                 <TextField
//                   fullWidth
//                   label="Piece Rate (will be configured later)"
//                   name="PieceRateInfo"
//                   value="Configure in Piece Rate Details"
//                   disabled
//                   size="medium"
//                   variant="outlined"
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//               )}
//             </Stack>

//             {showOvertimeField() && (
//               <Stack direction="row" spacing={2}>
//                 <TextField
//                   fullWidth
//                   label="Overtime Rate Multiplier"
//                   name="OvertimeRateMultiplier"
//                   type="number"
//                   value={formData.OvertimeRateMultiplier}
//                   onChange={handleChange}
//                   disabled={loading || loadingData}
//                   size="medium"
//                   variant="outlined"
//                   inputProps={{ step: 0.25, min: 1, max: 3 }}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//                 <FormControl fullWidth>
//                   <InputLabel>Skill Level</InputLabel>
//                   <Select
//                     name="SkillLevel"
//                     value={formData.SkillLevel}
//                     onChange={handleChange}
//                     label="Skill Level"
//                     disabled={loading || loadingData}
//                     sx={{ borderRadius: 1 }}
//                     MenuProps={selectMenuProps}
//                   >
//                     {skillLevelOptions.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Stack>
//             )}

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Work Station"
//                 name="WorkStation"
//                 value={formData.WorkStation}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.WorkStation && !!fieldErrors.WorkStation}
//                 helperText={touched.WorkStation ? fieldErrors.WorkStation : 'Letters, numbers, spaces, hyphens (optional)'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Line Number"
//                 name="LineNumber"
//                 value={formData.LineNumber}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.LineNumber && !!fieldErrors.LineNumber}
//                 helperText={touched.LineNumber ? fieldErrors.LineNumber : 'Letters, numbers, spaces, hyphens (optional)'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <Typography variant="subtitle2" sx={{ mt: 1, color: '#1976D2', fontWeight: 600 }}>
//               Tax & Identification (Optional)
//             </Typography>
            
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="PAN"
//                 name="PAN"
//                 value={formData.PAN}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.PAN && !!fieldErrors.PAN}
//                 helperText={touched.PAN ? fieldErrors.PAN : 'Format: ABCDE1234F'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="ABCDE1234F"
//                 inputProps={{ maxLength: 10 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Aadhar Number"
//                 name="AadharNumber"
//                 value={formData.AadharNumber}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.AadharNumber && !!fieldErrors.AadharNumber}
//                 helperText={touched.AadharNumber ? fieldErrors.AadharNumber : '12 digits'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="123456789012"
//                 inputProps={{ maxLength: 12 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="PF Number"
//                 name="PFNumber"
//                 value={formData.PFNumber}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.PFNumber && !!fieldErrors.PFNumber}
//                 helperText={touched.PFNumber ? fieldErrors.PFNumber : 'Format: XX/12345/1234567'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="AB/12345/1234567"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="UAN"
//                 name="UAN"
//                 value={formData.UAN}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.UAN && !!fieldErrors.UAN}
//                 helperText={touched.UAN ? fieldErrors.UAN : '12 digits'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="123456789012"
//                 inputProps={{ maxLength: 12 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="ESI Number"
//                 name="ESINumber"
//                 value={formData.ESINumber}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.ESINumber && !!fieldErrors.ESINumber}
//                 helperText={touched.ESINumber ? fieldErrors.ESINumber : '17 digits'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="12345678901234567"
//                 inputProps={{ maxLength: 17 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <FormControl fullWidth>
//                 <InputLabel>Bank Account Type</InputLabel>
//                 <Select
//                   name="BankAccountType"
//                   value={formData.BankAccountType}
//                   onChange={handleChange}
//                   label="Bank Account Type"
//                   disabled={loading || loadingData}
//                   sx={{ borderRadius: 1 }}
//                   MenuProps={selectMenuProps}
//                 >
//                   {accountTypeOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Stack>
//           </>
//         );

//       case 3: // Bank & Emergency
//         return (
//           <>
//             <Typography variant="subtitle2" sx={{ color: '#1976D2', fontWeight: 600 }}>
//               Bank Details (Optional)
//             </Typography>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Account Number"
//                 name="BankAccountNumber"
//                 value={formData.BankAccountNumber}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.BankAccountNumber && !!fieldErrors.BankAccountNumber}
//                 helperText={touched.BankAccountNumber ? fieldErrors.BankAccountNumber : '9-18 digits'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="123456789"
//                 inputProps={{ maxLength: 18 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Account Holder Name"
//                 name="BankAccountHolderName"
//                 value={formData.BankAccountHolderName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.BankAccountHolderName && !!fieldErrors.BankAccountHolderName}
//                 helperText={touched.BankAccountHolderName ? fieldErrors.BankAccountHolderName : 'Letters, spaces, dots, hyphens only'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="John Doe"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Bank Name"
//                 name="BankName"
//                 value={formData.BankName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.BankName && !!fieldErrors.BankName}
//                 helperText={touched.BankName ? fieldErrors.BankName : 'Letters, spaces, dots, hyphens only'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="State Bank of India"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Branch"
//                 name="BankBranch"
//                 value={formData.BankBranch}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.BankBranch && !!fieldErrors.BankBranch}
//                 helperText={touched.BankBranch ? fieldErrors.BankBranch : 'Letters, numbers, spaces, hyphens only'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="Main Branch"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="IFSC Code"
//                 name="BankIfscCode"
//                 value={formData.BankIfscCode}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.BankIfscCode && !!fieldErrors.BankIfscCode}
//                 helperText={touched.BankIfscCode ? fieldErrors.BankIfscCode : 'Format: ABCD0123456'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="SBIN0123456"
//                 inputProps={{ maxLength: 11 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <Divider sx={{ my: 2 }} />

//             <Typography variant="subtitle2" sx={{ color: '#1976D2', fontWeight: 600 }}>
//               Emergency Contact (Optional)
//             </Typography>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Contact Name"
//                 name="EmergencyContactName"
//                 value={formData.EmergencyContactName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.EmergencyContactName && !!fieldErrors.EmergencyContactName}
//                 helperText={touched.EmergencyContactName ? fieldErrors.EmergencyContactName : 'Letters, spaces, dots, hyphens only'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="Jane Doe"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Relationship"
//                 name="EmergencyContactRelationship"
//                 value={formData.EmergencyContactRelationship}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.EmergencyContactRelationship && !!fieldErrors.EmergencyContactRelationship}
//                 helperText={touched.EmergencyContactRelationship ? fieldErrors.EmergencyContactRelationship : 'Letters and spaces only'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="Spouse"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Phone"
//                 name="EmergencyContactPhone"
//                 value={formData.EmergencyContactPhone}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.EmergencyContactPhone && !!fieldErrors.EmergencyContactPhone}
//                 helperText={touched.EmergencyContactPhone ? fieldErrors.EmergencyContactPhone : '10 digits'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="9876543210"
//                 inputProps={{ maxLength: 10 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Address"
//                 name="EmergencyContactAddress"
//                 value={formData.EmergencyContactAddress}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.EmergencyContactAddress && !!fieldErrors.EmergencyContactAddress}
//                 helperText={touched.EmergencyContactAddress ? fieldErrors.EmergencyContactAddress : 'Street, city, etc.'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="123 Main St, City"
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="PIN Code"
//                 name="EmergencyContactPIN"
//                 value={formData.EmergencyContactPIN}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.EmergencyContactPIN && !!fieldErrors.EmergencyContactPIN}
//                 helperText={touched.EmergencyContactPIN ? fieldErrors.EmergencyContactPIN : '6 digits'}
//                 disabled={loading || loadingData}
//                 size="medium"
//                 variant="outlined"
//                 placeholder="400001"
//                 inputProps={{ maxLength: 6 }}
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Stack>
//           </>
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
//         sx: { borderRadius: 2, maxHeight: '90vh' }
//       }}
//     >
//       <DialogTitle sx={{ 
//         borderBottom: '1px solid #E0E0E0', 
//         pb: 2,
//         background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//         color: '#fff'
//       }}>
//         <Stack direction="row" alignItems="center" spacing={1}>
//           <AddIcon />
//           <Typography variant="h6" fontWeight={600}>
//             Add New Employee
//           </Typography>
//         </Stack>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3, overflowY: 'auto' }}>
//         <Stack spacing={3}>
//           {/* Stepper */}
//           <Box sx={{ width: '100%', mb: 2, pt:2 }}>
//             <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
//               {steps.map((label) => (
//                 <Step key={label}>
//                   <StepLabel>
//                     <Typography variant="caption" fontWeight={500}>
//                       {label}
//                     </Typography>
//                   </StepLabel>
//                 </Step>
//               ))}
//             </Stepper>
//           </Box>

//           {/* Step Content */}
//           <Paper elevation={0} sx={{ p: 3, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//             <Stack spacing={3}>
//               {renderStepContent()}
              
//               {error && (
//                 <Alert 
//                   severity="error" 
//                   sx={{ 
//                     borderRadius: 1,
//                     '& .MuiAlert-icon': {
//                       alignItems: 'center'
//                     }
//                   }}
//                 >
//                   {error}
//                 </Alert>
//               )}
//             </Stack>
//           </Paper>
//         </Stack>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         px: 3, 
//         pb: 3, 
//         borderTop: '1px solid #E0E0E0', 
//         pt: 2,
//         backgroundColor: '#F8FAFC',
//         justifyContent: 'space-between'
//       }}>
//         <Button 
//           onClick={handleClose} 
//           disabled={loading}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500,
//             border: '1px solid #cbd5e1',
//             color: '#475569'
//           }}
//         >
//           Cancel
//         </Button>
        
//         <Stack direction="row" spacing={2}>
//           {activeStep > 0 && (
//             <Button
//               onClick={handleBack}
//               disabled={loading || loadingData}
//               startIcon={<ArrowBackIcon />}
//               sx={{
//                 borderRadius: 1,
//                 px: 3,
//                 py: 1,
//                 textTransform: 'none',
//                 fontWeight: 500
//               }}
//             >
//               Back
//             </Button>
//           )}

//           {activeStep < steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading || loadingData}
//               endIcon={<ArrowForwardIcon />}
//               sx={{
//                 borderRadius: 1,
//                 px: 3,
//                 py: 1,
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//                 '&:hover': {
//                   opacity: 0.9
//                 }
//               }}
//             >
//               Next
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading || loadingData}
//               startIcon={loading ? null : <AddIcon />}
//               sx={{
//                 borderRadius: 1,
//                 px: 3,
//                 py: 1,
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//                 '&:hover': {
//                   opacity: 0.9
//                 }
//               }}
//             >
//               {loading ? 'Adding...' : 'Add Employee'}
//             </Button>
//           )}
//         </Stack>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddEmployees;

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
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  InputAdornment,
  styled
} from '@mui/material';
import { 
  Add as AddIcon, 
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching Companies component
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

// Custom styled Paper for dropdowns
const CustomPaper = styled(Paper)({
  maxHeight: 200,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none'
});

const steps = ['Personal Info', 'Employment', 'Pay & Work', 'Bank & Emergency'];

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const cleanPhone = phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
  const phoneRegex = /^[6-9]\d{9}$/;
  return cleanPhone === '' || phoneRegex.test(cleanPhone);
};

const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return pan === '' || panRegex.test(pan);
};

const validateAadhar = (aadhar) => {
  const aadharRegex = /^\d{12}$/;
  return aadhar === '' || aadharRegex.test(aadhar);
};

const validateIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifsc === '' || ifscRegex.test(ifsc);
};

const validateAccountNumber = (accNo) => {
  const accountRegex = /^\d{9,18}$/;
  return accNo === '' || accountRegex.test(accNo);
};

const validatePIN = (pin) => {
  const pinRegex = /^\d{6}$/;
  return pin === '' || pinRegex.test(pin);
};

const validatePFNumber = (pf) => {
  const pfRegex = /^[A-Z]{2}\/\d{5}\/\d{7}$/;
  return pf === '' || pfRegex.test(pf);
};

const validateUAN = (uan) => {
  const uanRegex = /^\d{12}$/;
  return uan === '' || uanRegex.test(uan);
};

const validateESINumber = (esi) => {
  const esiRegex = /^\d{17}$/;
  return esi === '' || esiRegex.test(esi);
};

const validateName = (name) => {
  const nameRegex = /^[A-Za-z\s.'-]+$/;
  return name === '' || nameRegex.test(name);
};

const validateAddress = (address) => {
  const addressRegex = /^[A-Za-z0-9\s,.#\-/]+$/;
  return address === '' || addressRegex.test(address);
};

const validateBankName = (bankName) => {
  const bankNameRegex = /^[A-Za-z\s.'&-]+$/;
  return bankName === '' || bankNameRegex.test(bankName);
};

const validateBranchName = (branch) => {
  const branchRegex = /^[A-Za-z0-9\s.-]+$/;
  return branch === '' || branchRegex.test(branch);
};

const validateWorkStation = (station) => {
  const stationRegex = /^[A-Za-z0-9\s-]+$/;
  return station === '' || stationRegex.test(station);
};

const validateRelationship = (relationship) => {
  const relationshipRegex = /^[A-Za-z\s]+$/;
  return relationship === '' || relationshipRegex.test(relationship);
};

const AddEmployees = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    FirstName: '',
    LastName: '',
    Gender: 'M',
    DateOfBirth: '',
    Email: '',
    Phone: '',
    Address: '',
    
    // Employment
    DepartmentID: '',
    DesignationID: '',
    DateOfJoining: '',
    EmploymentStatus: 'active',
    EmploymentType: 'Monthly',
    PayStructureType: 'Fixed',
    
    // Pay & Work
    BasicSalary: '',
    HourlyRate: '',
    OvertimeRateMultiplier: '1.5',
    SkillLevel: '',
    WorkStation: '',
    LineNumber: '',
    PAN: '',
    AadharNumber: '',
    PFNumber: '',
    UAN: '',
    ESINumber: '',
    
    // Bank & Emergency
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

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Gender options
  const genderOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'O', label: 'Other' }
  ];

  // Employment Status options
  const employmentStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'resigned', label: 'Resigned' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'retired', label: 'Retired' }
  ];

  // Employment Type options
  const employmentTypeOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Hourly', label: 'Hourly' },
    { value: 'PieceRate', label: 'Piece Rate' }
  ];

  // Pay Structure Type options
  const payStructureOptions = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Variable', label: 'Variable' },
    { value: 'Commission', label: 'Commission' },
    { value: 'PieceRate', label: 'Piece Rate' }
  ];

  // Skill Level options
  const skillLevelOptions = [
    { value: 'Unskilled', label: 'Unskilled' },
    { value: 'Semi-Skilled', label: 'Semi-Skilled' },
    { value: 'Skilled', label: 'Skilled' },
    { value: 'Highly Skilled', label: 'Highly Skilled' }
  ];

  // Account type options
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

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      
      const deptResponse = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const desigResponse = await axios.get(`${BASE_URL}/api/designations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

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
    switch(name) {
      case 'FirstName':
      case 'LastName':
      case 'BankAccountHolderName':
      case 'EmergencyContactName':
        if (value && !validateName(value)) {
          return 'Only letters, spaces, dots, and hyphens allowed';
        }
        break;
      
      case 'Email':
        if (value && !validateEmail(value)) {
          return 'Please enter a valid email address';
        }
        break;
      
      case 'Phone':
      case 'EmergencyContactPhone':
        if (value && !validatePhone(value)) {
          return 'Please enter a valid 10-digit mobile number starting with 6-9';
        }
        break;
      
      case 'Address':
      case 'EmergencyContactAddress':
        if (value && !validateAddress(value)) {
          return 'Address contains invalid characters';
        }
        break;
      
      case 'WorkStation':
      case 'LineNumber':
        if (value && !validateWorkStation(value)) {
          return 'Only letters, numbers, spaces, and hyphens allowed';
        }
        break;
      
      case 'PAN':
        if (value && !validatePAN(value)) {
          return 'PAN must be in format: ABCDE1234F';
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
          return 'Account number must be 9-18 digits';
        }
        break;
      
      case 'BankName':
        if (value && !validateBankName(value)) {
          return 'Only letters, spaces, dots, and hyphens allowed';
        }
        break;
      
      case 'BankBranch':
        if (value && !validateBranchName(value)) {
          return 'Only letters, numbers, spaces, dots, and hyphens allowed';
        }
        break;
      
      case 'BankIfscCode':
        if (value && !validateIFSC(value)) {
          return 'IFSC code must be in format: ABCD0123456';
        }
        break;
      
      case 'EmergencyContactRelationship':
        if (value && !validateRelationship(value)) {
          return 'Only letters and spaces allowed';
        }
        break;
      
      case 'EmergencyContactPIN':
        if (value && !validatePIN(value)) {
          return 'PIN code must be 6 digits';
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
    switch(name) {
      case 'FirstName':
      case 'LastName':
      case 'BankAccountHolderName':
      case 'EmergencyContactName':
      case 'EmergencyContactRelationship':
        processedValue = value.replace(/[^A-Za-z\s.'-]/g, '');
        break;
      
      case 'BankName':
        processedValue = value.replace(/[^A-Za-z\s.'&-]/g, '');
        break;
      
      case 'Address':
      case 'EmergencyContactAddress':
        processedValue = value.replace(/[^A-Za-z0-9\s,.#\-/]/g, '');
        break;
      
      case 'WorkStation':
      case 'LineNumber':
        processedValue = value.replace(/[^A-Za-z0-9\s-]/g, '');
        break;
      
      case 'BankBranch':
        processedValue = value.replace(/[^A-Za-z0-9\s.-]/g, '');
        break;
      
      case 'Phone':
      case 'EmergencyContactPhone':
      case 'BankAccountNumber':
      case 'AadharNumber':
      case 'UAN':
      case 'ESINumber':
      case 'EmergencyContactPIN':
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

    if (touched[name] || value) {
      const errorMessage = validateField(name, processedValue);
      setFieldErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
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
    let defaultPayStructure = 'Fixed';
    
    if (employmentType === 'PieceRate') {
      defaultPayStructure = 'PieceRate';
    }
    
    setFormData(prev => ({
      ...prev,
      EmploymentType: employmentType,
      PayStructureType: defaultPayStructure
    }));
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

        if (formData.Address) {
          const addressError = validateField('Address', formData.Address);
          if (addressError) {
            errors.Address = addressError;
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
        break;

      case 2:
        if (formData.EmploymentType === 'Monthly' && !formData.BasicSalary) {
          errors.BasicSalary = 'Basic salary is required for monthly employees';
          isValid = false;
        }
        if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
          errors.HourlyRate = 'Hourly rate is required for hourly employees';
          isValid = false;
        }

        const taxFields = ['PAN', 'AadharNumber', 'PFNumber', 'UAN', 'ESINumber', 'WorkStation', 'LineNumber'];
        taxFields.forEach(field => {
          if (formData[field]) {
            const error = validateField(field, formData[field]);
            if (error) {
              errors[field] = error;
              isValid = false;
            }
          }
        });
        break;

      case 3:
        const bankFields = ['BankAccountNumber', 'BankAccountHolderName', 'BankName', 'BankBranch', 'BankIfscCode'];
        const hasAnyBankDetail = bankFields.some(field => formData[field]);
        
        if (hasAnyBankDetail) {
          bankFields.forEach(field => {
            if (!formData[field]) {
              errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required when providing bank details`;
              isValid = false;
            } else {
              const error = validateField(field, formData[field]);
              if (error) {
                errors[field] = error;
                isValid = false;
              }
            }
          });
        }

        const emergencyFields = ['EmergencyContactName', 'EmergencyContactRelationship', 'EmergencyContactPhone', 'EmergencyContactAddress', 'EmergencyContactPIN'];
        const hasAnyEmergencyDetail = emergencyFields.some(field => formData[field]);
        
        if (hasAnyEmergencyDetail) {
          emergencyFields.forEach(field => {
            if (!formData[field]) {
              errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required when providing emergency contact`;
              isValid = false;
            } else {
              const error = validateField(field, formData[field]);
              if (error) {
                errors[field] = error;
                isValid = false;
              }
            }
          });
        }
        break;
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

    // Personal Info
    if (!formData.FirstName?.trim()) {
      errors.FirstName = 'First name is required';
      isValid = false;
    } else {
      const error = validateField('FirstName', formData.FirstName);
      if (error) errors.FirstName = error;
    }

    if (!formData.LastName?.trim()) {
      errors.LastName = 'Last name is required';
      isValid = false;
    } else {
      const error = validateField('LastName', formData.LastName);
      if (error) errors.LastName = error;
    }

    if (!formData.Email?.trim()) {
      errors.Email = 'Email is required';
      isValid = false;
    } else {
      const error = validateField('Email', formData.Email);
      if (error) errors.Email = error;
    }

    if (formData.Phone) {
      const error = validateField('Phone', formData.Phone);
      if (error) errors.Phone = error;
    }

    if (formData.Address) {
      const error = validateField('Address', formData.Address);
      if (error) errors.Address = error;
    }

    // Employment
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

    // Pay & Work
    if (formData.EmploymentType === 'Monthly' && !formData.BasicSalary) {
      errors.BasicSalary = 'Basic salary is required for monthly employees';
      isValid = false;
    }
    if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
      errors.HourlyRate = 'Hourly rate is required for hourly employees';
      isValid = false;
    }

    const taxFields = ['PAN', 'AadharNumber', 'PFNumber', 'UAN', 'ESINumber', 'WorkStation', 'LineNumber'];
    taxFields.forEach(field => {
      if (formData[field]) {
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    });

    // Bank & Emergency
    const bankFields = ['BankAccountNumber', 'BankAccountHolderName', 'BankName', 'BankBranch', 'BankIfscCode'];
    const hasAnyBankDetail = bankFields.some(field => formData[field]);
    
    if (hasAnyBankDetail) {
      bankFields.forEach(field => {
        if (!formData[field]) {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
          isValid = false;
        } else {
          const error = validateField(field, formData[field]);
          if (error) errors[field] = error;
        }
      });
    }

    const emergencyFields = ['EmergencyContactName', 'EmergencyContactRelationship', 'EmergencyContactPhone', 'EmergencyContactAddress', 'EmergencyContactPIN'];
    const hasAnyEmergencyDetail = emergencyFields.some(field => formData[field]);
    
    if (hasAnyEmergencyDetail) {
      emergencyFields.forEach(field => {
        if (!formData[field]) {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
          isValid = false;
        } else {
          const error = validateField(field, formData[field]);
          if (error) errors[field] = error;
        }
      });
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
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
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
        DateOfBirth: formData.DateOfBirth || undefined,
        Email: formData.Email,
        Phone: formData.Phone || undefined,
        Address: formData.Address || undefined,
        DepartmentID: formData.DepartmentID,
        DesignationID: formData.DesignationID,
        DateOfJoining: formData.DateOfJoining,
        EmploymentStatus: formData.EmploymentStatus,
        EmploymentType: formData.EmploymentType,
        PayStructureType: formData.PayStructureType,
        BasicSalary: formData.EmploymentType === 'Monthly' ? Number(formData.BasicSalary || 0) : 0,
        HourlyRate: formData.EmploymentType === 'Hourly' ? Number(formData.HourlyRate || 0) : 0,
        OvertimeRateMultiplier: Number(formData.OvertimeRateMultiplier || 1.5),
        SkillLevel: formData.SkillLevel || undefined,
        WorkStation: formData.WorkStation || undefined,
        LineNumber: formData.LineNumber || undefined,
        PAN: formData.PAN || undefined,
        AadharNumber: formData.AadharNumber || undefined,
        PFNumber: formData.PFNumber || undefined,
        UAN: formData.UAN || undefined,
        ESINumber: formData.ESINumber || undefined
      };

      // Add BankDetails if any field is provided
      if (formData.BankAccountNumber || formData.BankAccountHolderName || 
          formData.BankName || formData.BankBranch || formData.BankIfscCode) {
        payload.BankDetails = {
          accountNumber: formData.BankAccountNumber,
          accountHolderName: formData.BankAccountHolderName,
          bankName: formData.BankName,
          branch: formData.BankBranch,
          ifscCode: formData.BankIfscCode,
          accountType: formData.BankAccountType
        };
      }

      // Add EmergencyContact if any field is provided
      if (formData.EmergencyContactName || formData.EmergencyContactRelationship || 
          formData.EmergencyContactPhone || formData.EmergencyContactAddress || formData.EmergencyContactPIN) {
        payload.EmergencyContact = {
          name: formData.EmergencyContactName,
          relationship: formData.EmergencyContactRelationship,
          phone: formData.EmergencyContactPhone,
          address: formData.EmergencyContactAddress,
          pinCode: formData.EmergencyContactPIN
        };
      }

      // Remove undefined values
      Object.keys(payload).forEach(key => 
        payload[key] === undefined && delete payload[key]
      );

      const response = await axios.post(
        `${BASE_URL}/api/employees`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add employee');
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      setError(err.response?.data?.message || 'Failed to add employee. Please try again.');
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
      BasicSalary: '',
      HourlyRate: '',
      OvertimeRateMultiplier: '1.5',
      SkillLevel: '',
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
                Personal Information
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
                      disabled={loading || loadingData}
                      placeholder="e.g., John"
                      error={!!fieldErrors.FirstName}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters, spaces, dots, and hyphens only
                    </Typography>
                    {fieldErrors.FirstName && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.FirstName}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="e.g., Doe"
                      error={!!fieldErrors.LastName}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters, spaces, dots, and hyphens only
                    </Typography>
                    {fieldErrors.LastName && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.LastName}
                      </Typography>
                    )}
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
                        disabled={loading || loadingData}
                        sx={selectStyles}
                      >
                        {genderOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
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
                      DATE OF BIRTH
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="DateOfBirth"
                      type="date"
                      value={formData.DateOfBirth}
                      onChange={handleChange}
                      disabled={loading || loadingData}
                      InputLabelProps={{ shrink: true }}
                      sx={textFieldStyles}
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
                      disabled={loading || loadingData}
                      placeholder="john.doe@company.com"
                      error={!!fieldErrors.Email}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      e.g., john.doe@company.com
                    </Typography>
                    {fieldErrors.Email && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.Email}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="9876543210"
                      error={!!fieldErrors.Phone}
                      inputProps={{ maxLength: 10 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      10-digit mobile number starting with 6-9
                    </Typography>
                    {fieldErrors.Phone && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.Phone}
                      </Typography>
                    )}
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
                      onBlur={handleBlur}
                      multiline
                      rows={2}
                      disabled={loading || loadingData}
                      placeholder="Enter complete address"
                      error={!!fieldErrors.Address}
                      sx={textFieldStyles}
                    />
                    {fieldErrors.Address && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.Address}
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
                Employment Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={departments}
                      getOptionLabel={(option) => option?.DepartmentName || ''}
                      value={departments.find(dept => dept._id === formData.DepartmentID) || null}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          DepartmentID: newValue?._id || ''
                        }));
                      }}
                      loading={loadingData}
                      disabled={loading || loadingData}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select department"
                          error={!!fieldErrors.DepartmentID}
                          sx={textFieldStyles}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      PaperComponent={CustomPaper}
                      noOptionsText="No departments found"
                    />
                    {fieldErrors.DepartmentID && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.DepartmentID}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DESIGNATION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={designations}
                      getOptionLabel={(option) => option?.DesignationName || ''}
                      value={designations.find(desig => desig._id === formData.DesignationID) || null}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          DesignationID: newValue?._id || ''
                        }));
                      }}
                      loading={loadingData}
                      disabled={loading || loadingData}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select designation"
                          error={!!fieldErrors.DesignationID}
                          sx={textFieldStyles}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      PaperComponent={CustomPaper}
                      noOptionsText="No designations found"
                    />
                    {fieldErrors.DesignationID && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.DesignationID}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldErrors.DateOfJoining}
                      sx={textFieldStyles}
                    />
                    {fieldErrors.DateOfJoining && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.DateOfJoining}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EMPLOYMENT STATUS
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="EmploymentStatus"
                        value={formData.EmploymentStatus}
                        onChange={handleChange}
                        disabled={loading || loadingData}
                        sx={selectStyles}
                      >
                        {employmentStatusOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid> */}
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
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
                Pay & Work Details
              </Typography>
              
              <Grid container spacing={1.5}>
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
                        disabled={loading || loadingData}
                        sx={selectStyles}
                      >
                        {employmentTypeOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
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
                      PAY STRUCTURE TYPE
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="PayStructureType"
                        value={formData.PayStructureType}
                        onChange={handleChange}
                        disabled={loading || loadingData}
                        sx={selectStyles}
                      >
                        {payStructureOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                {formData.EmploymentType === 'Monthly' && (
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
                        disabled={loading || loadingData}
                        placeholder="e.g., 25000"
                        error={!!fieldErrors.BasicSalary}
                        inputProps={{ min: 0 }}
                        sx={textFieldStyles}
                      />
                      {fieldErrors.BasicSalary && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.BasicSalary}
                        </Typography>
                      )}
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
                        disabled={loading || loadingData}
                        placeholder="e.g., 150"
                        error={!!fieldErrors.HourlyRate}
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={textFieldStyles}
                      />
                      {fieldErrors.HourlyRate && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.HourlyRate}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}

                {['Monthly', 'Hourly'].includes(formData.EmploymentType) && (
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
                          disabled={loading || loadingData}
                          inputProps={{ step: 0.25, min: 1, max: 3 }}
                          sx={textFieldStyles}
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
                            disabled={loading || loadingData}
                            sx={selectStyles}
                          >
                            <MenuItem value="">None</MenuItem>
                            {skillLevelOptions.map(option => (
                              <MenuItem key={option.value} value={option.value}>
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
                      onBlur={handleBlur}
                      disabled={loading || loadingData}
                      placeholder="e.g., Station A"
                      error={!!fieldErrors.WorkStation}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters, numbers, spaces, and hyphens only
                    </Typography>
                    {fieldErrors.WorkStation && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.WorkStation}
                      </Typography>
                    )}
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
                      onBlur={handleBlur}
                      disabled={loading || loadingData}
                      placeholder="e.g., Line 1"
                      error={!!fieldErrors.LineNumber}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters, numbers, spaces, and hyphens only
                    </Typography>
                    {fieldErrors.LineNumber && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.LineNumber}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

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
                      disabled={loading || loadingData}
                      placeholder="ABCDE1234F"
                      error={!!fieldErrors.PAN}
                      inputProps={{ maxLength: 10 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      5 letters + 4 numbers + 1 letter
                    </Typography>
                    {fieldErrors.PAN && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.PAN}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="123456789012"
                      error={!!fieldErrors.AadharNumber}
                      inputProps={{ maxLength: 12 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      12 digits
                    </Typography>
                    {fieldErrors.AadharNumber && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.AadharNumber}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="AB/12345/1234567"
                      error={!!fieldErrors.PFNumber}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Format: XX/12345/1234567
                    </Typography>
                    {fieldErrors.PFNumber && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.PFNumber}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="123456789012"
                      error={!!fieldErrors.UAN}
                      inputProps={{ maxLength: 12 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      12 digits
                    </Typography>
                    {fieldErrors.UAN && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.UAN}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="12345678901234567"
                      error={!!fieldErrors.ESINumber}
                      inputProps={{ maxLength: 17 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      17 digits
                    </Typography>
                    {fieldErrors.ESINumber && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.ESINumber}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
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
                      ACCOUNT NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="BankAccountNumber"
                      value={formData.BankAccountNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading || loadingData}
                      placeholder="123456789"
                      error={!!fieldErrors.BankAccountNumber}
                      inputProps={{ maxLength: 18 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      9-18 digits only
                    </Typography>
                    {fieldErrors.BankAccountNumber && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.BankAccountNumber}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="John Doe"
                      error={!!fieldErrors.BankAccountHolderName}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters, spaces, dots, and hyphens only
                    </Typography>
                    {fieldErrors.BankAccountHolderName && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.BankAccountHolderName}
                      </Typography>
                    )}
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
                      onBlur={handleBlur}
                      disabled={loading || loadingData}
                      placeholder="State Bank of India"
                      error={!!fieldErrors.BankName}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters, spaces, dots, and hyphens only
                    </Typography>
                    {fieldErrors.BankName && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.BankName}
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
                      name="BankBranch"
                      value={formData.BankBranch}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading || loadingData}
                      placeholder="Main Branch"
                      error={!!fieldErrors.BankBranch}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters, numbers, spaces, dots, and hyphens only
                    </Typography>
                    {fieldErrors.BankBranch && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.BankBranch}
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
                      name="BankIfscCode"
                      value={formData.BankIfscCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading || loadingData}
                      placeholder="SBIN0123456"
                      error={!!fieldErrors.BankIfscCode}
                      inputProps={{ maxLength: 11 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      4 letters + 0 + 6 alphanumeric
                    </Typography>
                    {fieldErrors.BankIfscCode && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.BankIfscCode}
                      </Typography>
                    )}
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
                        disabled={loading || loadingData}
                        sx={selectStyles}
                      >
                        {accountTypeOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

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
                Emergency Contact
                <Typography component="span" sx={{ fontSize: '0.65rem', ml: 1, color: COLORS.text.tertiary, fontWeight: 'normal' }}>
                  (All fields optional, but if provided, all are required)
                </Typography>
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
                      disabled={loading || loadingData}
                      placeholder="Jane Doe"
                      error={!!fieldErrors.EmergencyContactName}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters, spaces, dots, and hyphens only
                    </Typography>
                    {fieldErrors.EmergencyContactName && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.EmergencyContactName}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="Spouse"
                      error={!!fieldErrors.EmergencyContactRelationship}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Letters and spaces only
                    </Typography>
                    {fieldErrors.EmergencyContactRelationship && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.EmergencyContactRelationship}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="9876543210"
                      error={!!fieldErrors.EmergencyContactPhone}
                      inputProps={{ maxLength: 10 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      10-digit mobile number starting with 6-9
                    </Typography>
                    {fieldErrors.EmergencyContactPhone && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.EmergencyContactPhone}
                      </Typography>
                    )}
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
                      disabled={loading || loadingData}
                      placeholder="400001"
                      error={!!fieldErrors.EmergencyContactPIN}
                      inputProps={{ maxLength: 6 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      6 digits
                    </Typography>
                    {fieldErrors.EmergencyContactPIN && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.EmergencyContactPIN}
                      </Typography>
                    )}
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
                      onBlur={handleBlur}
                      multiline
                      rows={2}
                      disabled={loading || loadingData}
                      placeholder="Enter complete address"
                      error={!!fieldErrors.EmergencyContactAddress}
                      sx={textFieldStyles}
                    />
                    {fieldErrors.EmergencyContactAddress && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.EmergencyContactAddress}
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

  // Shared styles
  const textFieldStyles = {
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
  };

  const selectStyles = {
    borderRadius: 1.5,
    fontSize: '0.75rem',
    '& .MuiSelect-select': {
      py: 1,
      fontSize: '0.75rem'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: COLORS.primary
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: COLORS.primary,
      borderWidth: 1
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
          Add New Employee
        </Typography>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              fontSize: '0.75rem',
              py: 0.5,
              '& .MuiAlert-icon': { fontSize: '1.25rem' }
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
              {loading ? 'Adding...' : 'Add Employee'}
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

export default AddEmployees;