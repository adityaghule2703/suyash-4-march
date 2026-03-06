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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  Box,
  Paper,
  Divider,
  FormHelperText,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Enhanced Validation functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const re = /^\d{10}$/;
  return phone === '' || re.test(phone);
};

const validatePAN = (pan) => {
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return pan === '' || re.test(pan);
};

const validateAadhar = (aadhar) => {
  const re = /^\d{12}$/;
  return aadhar === '' || re.test(aadhar);
};

const validateIFSC = (ifsc) => {
  const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifsc === '' || re.test(ifsc);
};

const validateAccountNumber = (accNo) => {
  const re = /^\d{9,18}$/;
  return accNo === '' || re.test(accNo);
};

const validatePIN = (pin) => {
  const re = /^\d{6}$/;
  return pin === '' || re.test(pin);
};

const validatePFNumber = (pf) => {
  const re = /^[A-Z]{2}\/\d{5}\/\d{7}$/;
  return pf === '' || re.test(pf);
};

const validateUAN = (uan) => {
  const re = /^\d{12}$/;
  return uan === '' || re.test(uan);
};

const validateESINumber = (esi) => {
  const re = /^\d{17}$/;
  return esi === '' || re.test(esi);
};

// New validation functions for text-only fields
const validateName = (name) => {
  // Allows letters, spaces, dots, hyphens, and apostrophes
  const re = /^[A-Za-z\s.'-]+$/;
  return name === '' || re.test(name);
};

const validateAddress = (address) => {
  // Allows letters, numbers, spaces, and common address characters
  const re = /^[A-Za-z0-9\s,.#\-/]+$/;
  return address === '' || re.test(address);
};

const validateCity = (city) => {
  // Allows letters, spaces, dots, and hyphens
  const re = /^[A-Za-z\s.-]+$/;
  return city === '' || re.test(city);
};

const validateState = (state) => {
  // Allows letters and spaces
  const re = /^[A-Za-z\s]+$/;
  return state === '' || re.test(state);
};

const validateBankName = (bankName) => {
  // Allows letters, spaces, dots, and common bank name characters
  const re = /^[A-Za-z\s.'&-]+$/;
  return bankName === '' || re.test(bankName);
};

const validateAccountHolderName = (name) => {
  // Allows letters, spaces, dots, and common name characters
  const re = /^[A-Za-z\s.'-]+$/;
  return name === '' || re.test(name);
};

const validateBranchName = (branch) => {
  // Allows letters, numbers, spaces, and common branch name characters
  const re = /^[A-Za-z0-9\s.-]+$/;
  return branch === '' || re.test(branch);
};

const validateWorkStation = (station) => {
  // Allows letters, numbers, spaces, and hyphens
  const re = /^[A-Za-z0-9\s-]+$/;
  return station === '' || re.test(station);
};

const validateLineNumber = (line) => {
  // Allows letters, numbers, spaces, and hyphens
  const re = /^[A-Za-z0-9\s-]+$/;
  return line === '' || re.test(line);
};

const validateEmergencyContactName = (name) => {
  // Allows letters, spaces, dots, and hyphens
  const re = /^[A-Za-z\s.'-]+$/;
  return name === '' || re.test(name);
};

const validateRelationship = (relationship) => {
  // Allows letters and spaces
  const re = /^[A-Za-z\s]+$/;
  return relationship === '' || re.test(relationship);
};

// Custom styled connector for stepper
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    height: 4,
    border: 0,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    margin: 2,
  },
  '&.Mui-active .MuiStepConnector-line': {
    background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
  },
  '&.Mui-completed .MuiStepConnector-line': {
    background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
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

const steps = ['Personal Info', 'Employment', 'Pay & Work', 'Bank & Emergency'];

const EditEmployees = ({ open, onClose, employee, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
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
    
    // Employment Type Specific
    BasicSalary: '',
    HourlyRate: '',
    OvertimeRateMultiplier: 1.5,
    
    // Work Information
    SkillLevel: 'Semi-Skilled',
    WorkStation: '',
    LineNumber: '',
    
    // Tax & Identification
    PAN: '',
    AadharNumber: '',
    PFNumber: '',
    UAN: '',
    ESINumber: '',
    
    // Bank Details (flattened)
    BankAccountNumber: '',
    BankAccountHolderName: '',
    BankName: '',
    BankBranch: '',
    BankIfscCode: '',
    BankAccountType: 'Savings',
    
    // Emergency Contact (flattened)
    EmergencyContactName: '',
    EmergencyContactRelationship: '',
    EmergencyContactPhone: '',
    EmergencyContactAddress: '',
    EmergencyContactPIN: ''
  });

  // Search states for dropdowns
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [designationSearch, setDesignationSearch] = useState('');

  // Field-specific error states - expanded to include all text fields
  const [fieldErrors, setFieldErrors] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Address: '',
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
    EmergencyContactName: '',
    EmergencyContactRelationship: '',
    EmergencyContactPhone: '',
    EmergencyContactAddress: '',
    EmergencyContactPIN: ''
  });

  // Touched fields for validation
  const [touched, setTouched] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Gender options
  const genderOptions = ['M', 'F', 'O'];
  
  // Employment Status options based on schema
  const employmentStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'resigned', label: 'Resigned' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'retired', label: 'Retired' }
  ];
  
  // Employment Type options - only Monthly, Hourly, PieceRate
  const employmentTypeOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Hourly', label: 'Hourly' },
    { value: 'PieceRate', label: 'Piece Rate' }
  ];

  // Pay Structure Type options based on schema
  const payStructureOptions = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Variable', label: 'Variable' },
    { value: 'Commission', label: 'Commission' },
    { value: 'PieceRate', label: 'Piece Rate' }
  ];
  
  // Skill Level options based on schema
  const skillLevelOptions = [
    { value: 'Unskilled', label: 'Unskilled' },
    { value: 'Semi-Skilled', label: 'Semi-Skilled' },
    { value: 'Skilled', label: 'Skilled' },
    { value: 'Highly Skilled', label: 'Highly Skilled' }
  ];
  
  // Account types options based on schema
  const accountTypeOptions = [
    { value: 'Savings', label: 'Savings' },
    { value: 'Current', label: 'Current' },
    { value: 'Salary', label: 'Salary' }
  ];

  // Fetch departments and designations
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Populate form when employee data is received
  useEffect(() => {
    if (employee) {
      setFormData({
        FirstName: employee.FirstName || '',
        LastName: employee.LastName || '',
        Gender: employee.Gender || 'M',
        DateOfBirth: employee.DateOfBirth ? employee.DateOfBirth.split('T')[0] : '',
        Email: employee.Email || '',
        Phone: employee.Phone || '',
        Address: employee.Address || '',
        DepartmentID: employee.DepartmentID?._id || '',
        DesignationID: employee.DesignationID?._id || '',
        DateOfJoining: employee.DateOfJoining ? employee.DateOfJoining.split('T')[0] : '',
        EmploymentStatus: employee.EmploymentStatus || 'active',
        EmploymentType: employee.EmploymentType || 'Monthly',
        PayStructureType: employee.PayStructureType || 'Fixed',
        
        // Employment Type Specific
        BasicSalary: employee.BasicSalary || '',
        HourlyRate: employee.HourlyRate || '',
        OvertimeRateMultiplier: employee.OvertimeRateMultiplier || 1.5,
        
        // Work Information
        SkillLevel: employee.SkillLevel || 'Semi-Skilled',
        WorkStation: employee.WorkStation || '',
        LineNumber: employee.LineNumber || '',
        
        // Tax & Identification
        PAN: employee.PAN || '',
        AadharNumber: employee.AadharNumber || '',
        PFNumber: employee.PFNumber || '',
        UAN: employee.UAN || '',
        ESINumber: employee.ESINumber || '',
        
        // Bank Details (flattened)
        BankAccountNumber: employee.BankDetails?.accountNumber || '',
        BankAccountHolderName: employee.BankDetails?.accountHolderName || '',
        BankName: employee.BankDetails?.bankName || '',
        BankBranch: employee.BankDetails?.branch || '',
        BankIfscCode: employee.BankDetails?.ifscCode || '',
        BankAccountType: employee.BankDetails?.accountType || 'Savings',
        
        // Emergency Contact (flattened)
        EmergencyContactName: employee.EmergencyContact?.name || '',
        EmergencyContactRelationship: employee.EmergencyContact?.relationship || '',
        EmergencyContactPhone: employee.EmergencyContact?.phone || '',
        EmergencyContactAddress: employee.EmergencyContact?.address || '',
        EmergencyContactPIN: employee.EmergencyContact?.pinCode || ''
      });

      // Reset touched and errors when new employee is loaded
      setTouched({});
      setFieldErrors({});
    }
  }, [employee]);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      
      // Fetch departments
      const deptResponse = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch designations
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
      setError('Failed to load dropdown data. Please refresh.');
    } finally {
      setLoadingData(false);
    }
  };

  // Validate a specific field
  const validateField = (name, value) => {
    switch(name) {
      // Personal Info
      case 'FirstName':
      case 'LastName':
        if (value && !validateName(value)) {
          return 'Only letters, spaces, dots, hyphens, and apostrophes are allowed';
        }
        if (!value && (name === 'FirstName' || name === 'LastName')) {
          return ''; // Required validation handled separately
        }
        break;
      
      case 'Email':
        if (value && !validateEmail(value)) {
          return 'Please enter a valid email address';
        }
        break;
      
      case 'Phone':
        if (value && !validatePhone(value)) {
          return 'Phone number must be 10 digits';
        }
        break;
      
      case 'Address':
        if (value && !validateAddress(value)) {
          return 'Address contains invalid characters';
        }
        break;
      
      // Work Information
      case 'WorkStation':
        if (value && !validateWorkStation(value)) {
          return 'Work station can only contain letters, numbers, spaces, and hyphens';
        }
        break;
      
      case 'LineNumber':
        if (value && !validateLineNumber(value)) {
          return 'Line number can only contain letters, numbers, spaces, and hyphens';
        }
        break;
      
      // Tax & Identification
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
      
      // Bank Details
      case 'BankAccountNumber':
        if (value && !validateAccountNumber(value)) {
          return 'Account number must be 9-18 digits';
        }
        break;
      
      case 'BankAccountHolderName':
        if (value && !validateAccountHolderName(value)) {
          return 'Account holder name can only contain letters, spaces, dots, and hyphens';
        }
        break;
      
      case 'BankName':
        if (value && !validateBankName(value)) {
          return 'Bank name can only contain letters, spaces, dots, apostrophes, and hyphens';
        }
        break;
      
      case 'BankBranch':
        if (value && !validateBranchName(value)) {
          return 'Branch name can only contain letters, numbers, spaces, dots, and hyphens';
        }
        break;
      
      case 'BankIfscCode':
        if (value && !validateIFSC(value)) {
          return 'IFSC code must be in format: ABCD0123456';
        }
        break;
      
      // Emergency Contact
      case 'EmergencyContactName':
        if (value && !validateEmergencyContactName(value)) {
          return 'Contact name can only contain letters, spaces, dots, and hyphens';
        }
        break;
      
      case 'EmergencyContactRelationship':
        if (value && !validateRelationship(value)) {
          return 'Relationship can only contain letters and spaces';
        }
        break;
      
      case 'EmergencyContactPhone':
        if (value && !validatePhone(value)) {
          return 'Emergency contact phone must be 10 digits';
        }
        break;
      
      case 'EmergencyContactAddress':
        if (value && !validateAddress(value)) {
          return 'Address contains invalid characters';
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
    
    // For text fields, prevent numbers if they shouldn't be there
    let processedValue = value;
    
    // Apply specific field constraints
    switch(name) {
      case 'FirstName':
      case 'LastName':
      case 'BankAccountHolderName':
      case 'EmergencyContactName':
      case 'EmergencyContactRelationship':
        // Only allow letters, spaces, and specific characters, no numbers
        processedValue = value.replace(/[^A-Za-z\s.'-]/g, '');
        break;
      
      case 'BankName':
        // Only allow letters, spaces, and specific characters for bank name
        processedValue = value.replace(/[^A-Za-z\s.'&-]/g, '');
        break;
      
      case 'Address':
      case 'EmergencyContactAddress':
        // Allow common address characters but restrict special ones
        processedValue = value.replace(/[^A-Za-z0-9\s,.#\-/]/g, '');
        break;
      
      case 'WorkStation':
      case 'LineNumber':
        // Allow letters, numbers, spaces, hyphens
        processedValue = value.replace(/[^A-Za-z0-9\s-]/g, '');
        break;
      
      case 'BankBranch':
        // Allow letters, numbers, spaces, dots, hyphens
        processedValue = value.replace(/[^A-Za-z0-9\s.-]/g, '');
        break;
      
      case 'Phone':
      case 'EmergencyContactPhone':
        // Only allow digits
        processedValue = value.replace(/\D/g, '');
        break;
      
      case 'BankAccountNumber':
        // Only allow digits
        processedValue = value.replace(/\D/g, '');
        break;
      
      case 'PAN':
        // Automatically uppercase PAN
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        break;
      
      case 'AadharNumber':
      case 'UAN':
      case 'ESINumber':
      case 'EmergencyContactPIN':
        // Only allow digits
        processedValue = value.replace(/\D/g, '');
        break;
      
      case 'PFNumber':
        // Format PF number with allowed characters
        processedValue = value.toUpperCase().replace(/[^A-Z0-9/]/g, '');
        break;
      
      case 'BankIfscCode':
        // Format IFSC code
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        break;
      
      default:
        processedValue = value;
    }
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validate field if it's been touched or has value
    if (touched[name] || value) {
      const errorMessage = validateField(name, processedValue);
      setFieldErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  // Custom handler for Autocomplete components
  const handleAutocompleteChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const errorMessage = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  // Get default PayStructureType based on EmploymentType
  const getDefaultPayStructureType = (employmentType) => {
    switch(employmentType) {
      case 'Monthly':
      case 'Hourly':
        return 'Fixed';
      case 'PieceRate':
        return 'PieceRate';
      default:
        return 'Fixed';
    }
  };

  // Handle Employment Type change with auto-updating PayStructureType
  const handleEmploymentTypeChange = (e) => {
    const employmentType = e.target.value;
    const defaultPayStructure = getDefaultPayStructureType(employmentType);
    
    setFormData(prev => ({
      ...prev,
      EmploymentType: employmentType,
      PayStructureType: defaultPayStructure
    }));
  };

  // Check if salary field should be shown (only Monthly)
  const showSalaryField = () => {
    return formData.EmploymentType === 'Monthly';
  };

  // Check if overtime field should be shown (Monthly and Hourly)
  const showOvertimeField = () => {
    return ['Monthly', 'Hourly'].includes(formData.EmploymentType);
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Validate current step
  const validateStep = () => {
    setError('');
    let isValid = true;
    const newFieldErrors = { ...fieldErrors };

    switch(activeStep) {
      case 0: // Personal Info
        // First Name validation
        if (!formData.FirstName.trim()) {
          setError('First name is required');
          isValid = false;
        } else if (!validateName(formData.FirstName)) {
          newFieldErrors.FirstName = 'First name can only contain letters, spaces, and hyphens';
          setFieldErrors(newFieldErrors);
          setError('Please correct first name format');
          isValid = false;
        }
        
        // Last Name validation
        if (!formData.LastName.trim()) {
          setError('Last name is required');
          isValid = false;
        } else if (!validateName(formData.LastName)) {
          newFieldErrors.LastName = 'Last name can only contain letters, spaces, and hyphens';
          setFieldErrors(newFieldErrors);
          setError('Please correct last name format');
          isValid = false;
        }
        
        // Email validation
        if (!formData.Email.trim()) {
          setError('Email is required');
          isValid = false;
        } else if (!validateEmail(formData.Email)) {
          newFieldErrors.Email = 'Please enter a valid email address';
          setFieldErrors(newFieldErrors);
          setError('Please correct email format');
          isValid = false;
        }
        
        // Phone validation if provided
        if (formData.Phone && !validatePhone(formData.Phone)) {
          newFieldErrors.Phone = 'Phone number must be 10 digits';
          setFieldErrors(newFieldErrors);
          setError('Please correct phone number');
          isValid = false;
        }
        
        // Address validation if provided
        if (formData.Address && !validateAddress(formData.Address)) {
          newFieldErrors.Address = 'Address contains invalid characters';
          setFieldErrors(newFieldErrors);
          setError('Please correct address format');
          isValid = false;
        }
        break;

      case 1: // Employment
        if (!formData.DepartmentID) {
          setError('Please select a department');
          isValid = false;
        } else if (!formData.DesignationID) {
          setError('Please select a designation');
          isValid = false;
        } else if (!formData.DateOfJoining) {
          setError('Date of joining is required');
          isValid = false;
        }
        break;

      case 2: // Pay & Work
        if (formData.EmploymentType === 'Monthly' && !formData.BasicSalary) {
          setError('Basic salary is required for monthly employees');
          isValid = false;
        } else if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
          setError('Hourly rate is required for hourly employees');
          isValid = false;
        }
        
        // Validate work fields if provided
        if (formData.WorkStation && !validateWorkStation(formData.WorkStation)) {
          newFieldErrors.WorkStation = 'Work station can only contain letters, numbers, spaces, and hyphens';
          setFieldErrors(newFieldErrors);
          setError('Please correct work station format');
          isValid = false;
        }
        
        if (formData.LineNumber && !validateLineNumber(formData.LineNumber)) {
          newFieldErrors.LineNumber = 'Line number can only contain letters, numbers, spaces, and hyphens';
          setFieldErrors(newFieldErrors);
          setError('Please correct line number format');
          isValid = false;
        }
        
        // Validate tax fields if provided
        if (formData.PAN && !validatePAN(formData.PAN)) {
          newFieldErrors.PAN = 'PAN must be in format: ABCDE1234F';
          setFieldErrors(newFieldErrors);
          setError('Please correct PAN format');
          isValid = false;
        }
        if (formData.AadharNumber && !validateAadhar(formData.AadharNumber)) {
          newFieldErrors.AadharNumber = 'Aadhar number must be 12 digits';
          setFieldErrors(newFieldErrors);
          setError('Please correct Aadhar format');
          isValid = false;
        }
        if (formData.PFNumber && !validatePFNumber(formData.PFNumber)) {
          newFieldErrors.PFNumber = 'PF number must be in format: XX/12345/1234567';
          setFieldErrors(newFieldErrors);
          setError('Please correct PF number format');
          isValid = false;
        }
        if (formData.UAN && !validateUAN(formData.UAN)) {
          newFieldErrors.UAN = 'UAN must be 12 digits';
          setFieldErrors(newFieldErrors);
          setError('Please correct UAN format');
          isValid = false;
        }
        if (formData.ESINumber && !validateESINumber(formData.ESINumber)) {
          newFieldErrors.ESINumber = 'ESI number must be 17 digits';
          setFieldErrors(newFieldErrors);
          setError('Please correct ESI number format');
          isValid = false;
        }
        break;

      case 3: // Bank & Emergency
        // Validate bank fields if provided
        if (formData.BankAccountNumber && !validateAccountNumber(formData.BankAccountNumber)) {
          newFieldErrors.BankAccountNumber = 'Account number must be 9-18 digits';
          setFieldErrors(newFieldErrors);
          setError('Please correct account number format');
          isValid = false;
        }
        
        if (formData.BankAccountHolderName && !validateAccountHolderName(formData.BankAccountHolderName)) {
          newFieldErrors.BankAccountHolderName = 'Account holder name can only contain letters, spaces, dots, and hyphens';
          setFieldErrors(newFieldErrors);
          setError('Please correct account holder name');
          isValid = false;
        }
        
        if (formData.BankName && !validateBankName(formData.BankName)) {
          newFieldErrors.BankName = 'Bank name can only contain letters, spaces, dots, and hyphens';
          setFieldErrors(newFieldErrors);
          setError('Please correct bank name');
          isValid = false;
        }
        
        if (formData.BankBranch && !validateBranchName(formData.BankBranch)) {
          newFieldErrors.BankBranch = 'Branch name can only contain letters, numbers, spaces, and hyphens';
          setFieldErrors(newFieldErrors);
          setError('Please correct branch name');
          isValid = false;
        }
        
        if (formData.BankIfscCode && !validateIFSC(formData.BankIfscCode)) {
          newFieldErrors.BankIfscCode = 'IFSC code must be in format: ABCD0123456';
          setFieldErrors(newFieldErrors);
          setError('Please correct IFSC code format');
          isValid = false;
        }
        
        // Validate emergency contact fields if provided
        if (formData.EmergencyContactName && !validateEmergencyContactName(formData.EmergencyContactName)) {
          newFieldErrors.EmergencyContactName = 'Contact name can only contain letters, spaces, dots, and hyphens';
          setFieldErrors(newFieldErrors);
          setError('Please correct emergency contact name');
          isValid = false;
        }
        
        if (formData.EmergencyContactRelationship && !validateRelationship(formData.EmergencyContactRelationship)) {
          newFieldErrors.EmergencyContactRelationship = 'Relationship can only contain letters and spaces';
          setFieldErrors(newFieldErrors);
          setError('Please correct relationship');
          isValid = false;
        }
        
        if (formData.EmergencyContactPhone && !validatePhone(formData.EmergencyContactPhone)) {
          newFieldErrors.EmergencyContactPhone = 'Emergency contact phone must be 10 digits';
          setFieldErrors(newFieldErrors);
          setError('Please correct emergency contact phone');
          isValid = false;
        }
        
        if (formData.EmergencyContactAddress && !validateAddress(formData.EmergencyContactAddress)) {
          newFieldErrors.EmergencyContactAddress = 'Address contains invalid characters';
          setFieldErrors(newFieldErrors);
          setError('Please correct emergency contact address');
          isValid = false;
        }
        
        if (formData.EmergencyContactPIN && !validatePIN(formData.EmergencyContactPIN)) {
          newFieldErrors.EmergencyContactPIN = 'PIN code must be 6 digits';
          setFieldErrors(newFieldErrors);
          setError('Please correct PIN code');
          isValid = false;
        }
        break;

      default:
        break;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    // Validate all required fields
    setError('');
    
    // First Name validation
    if (!formData.FirstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!validateName(formData.FirstName)) {
      setError('First name contains invalid characters');
      return;
    }

    // Last Name validation
    if (!formData.LastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!validateName(formData.LastName)) {
      setError('Last name contains invalid characters');
      return;
    }

    // Email validation
    if (!formData.Email.trim()) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(formData.Email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation if provided
    if (formData.Phone && !validatePhone(formData.Phone)) {
      setError('Phone number must be 10 digits');
      return;
    }

    // Department and Designation
    if (!formData.DepartmentID) {
      setError('Please select a department');
      return;
    }
    if (!formData.DesignationID) {
      setError('Please select a designation');
      return;
    }
    if (!formData.DateOfJoining) {
      setError('Date of joining is required');
      return;
    }

    // Employment type specific validation
    if (formData.EmploymentType === 'Monthly' && !formData.BasicSalary) {
      setError('Basic salary is required for monthly employees');
      return;
    }
    if (formData.EmploymentType === 'Hourly' && !formData.HourlyRate) {
      setError('Hourly rate is required for hourly employees');
      return;
    }

    // Work Information validation
    if (formData.WorkStation && !validateWorkStation(formData.WorkStation)) {
      setError('Work station contains invalid characters');
      return;
    }
    if (formData.LineNumber && !validateLineNumber(formData.LineNumber)) {
      setError('Line number contains invalid characters');
      return;
    }

    // Validate all optional fields that are filled
    if (formData.PAN && !validatePAN(formData.PAN)) {
      setError('PAN must be in format: ABCDE1234F');
      return;
    }
    if (formData.AadharNumber && !validateAadhar(formData.AadharNumber)) {
      setError('Aadhar number must be 12 digits');
      return;
    }
    if (formData.PFNumber && !validatePFNumber(formData.PFNumber)) {
      setError('PF number must be in format: XX/12345/1234567');
      return;
    }
    if (formData.UAN && !validateUAN(formData.UAN)) {
      setError('UAN must be 12 digits');
      return;
    }
    if (formData.ESINumber && !validateESINumber(formData.ESINumber)) {
      setError('ESI number must be 17 digits');
      return;
    }

    // Bank Details validation
    if (formData.BankAccountNumber && !validateAccountNumber(formData.BankAccountNumber)) {
      setError('Account number must be 9-18 digits');
      return;
    }
    if (formData.BankAccountHolderName && !validateAccountHolderName(formData.BankAccountHolderName)) {
      setError('Account holder name contains invalid characters');
      return;
    }
    if (formData.BankName && !validateBankName(formData.BankName)) {
      setError('Bank name contains invalid characters');
      return;
    }
    if (formData.BankBranch && !validateBranchName(formData.BankBranch)) {
      setError('Branch name contains invalid characters');
      return;
    }
    if (formData.BankIfscCode && !validateIFSC(formData.BankIfscCode)) {
      setError('IFSC code must be in format: ABCD0123456');
      return;
    }

    // Emergency Contact validation
    if (formData.EmergencyContactName && !validateEmergencyContactName(formData.EmergencyContactName)) {
      setError('Emergency contact name contains invalid characters');
      return;
    }
    if (formData.EmergencyContactRelationship && !validateRelationship(formData.EmergencyContactRelationship)) {
      setError('Relationship contains invalid characters');
      return;
    }
    if (formData.EmergencyContactPhone && !validatePhone(formData.EmergencyContactPhone)) {
      setError('Emergency contact phone must be 10 digits');
      return;
    }
    if (formData.EmergencyContactAddress && !validateAddress(formData.EmergencyContactAddress)) {
      setError('Emergency contact address contains invalid characters');
      return;
    }
    if (formData.EmergencyContactPIN && !validatePIN(formData.EmergencyContactPIN)) {
      setError('PIN code must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Prepare payload with nested objects structure
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
        
        // Employment Type Specific Fields
        BasicSalary: formData.EmploymentType === 'Monthly' ? Number(formData.BasicSalary || 0) : 0,
        HourlyRate: formData.EmploymentType === 'Hourly' ? Number(formData.HourlyRate || 0) : 0,
        OvertimeRateMultiplier: Number(formData.OvertimeRateMultiplier || 1.5),
        
        // Work Information
        SkillLevel: formData.SkillLevel || undefined,
        WorkStation: formData.WorkStation || undefined,
        LineNumber: formData.LineNumber || undefined,
        
        // Tax & Identification
        PAN: formData.PAN || undefined,
        AadharNumber: formData.AadharNumber || undefined,
        PFNumber: formData.PFNumber || undefined,
        UAN: formData.UAN || undefined,
        ESINumber: formData.ESINumber || undefined,
        
        // Bank Details (as nested object)
        BankDetails: {}
      };

      // Add BankDetails only if at least one field is provided
      if (formData.BankAccountNumber || formData.BankAccountHolderName || 
          formData.BankName || formData.BankBranch || formData.BankIfscCode) {
        payload.BankDetails = {
          accountNumber: formData.BankAccountNumber || undefined,
          accountHolderName: formData.BankAccountHolderName || undefined,
          bankName: formData.BankName || undefined,
          branch: formData.BankBranch || undefined,
          ifscCode: formData.BankIfscCode || undefined,
          accountType: formData.BankAccountType || 'Savings'
        };
        
        // Remove undefined values from BankDetails
        Object.keys(payload.BankDetails).forEach(key => 
          payload.BankDetails[key] === undefined && delete payload.BankDetails[key]
        );
      }

      // Add EmergencyContact only if at least one field is provided
      if (formData.EmergencyContactName || formData.EmergencyContactRelationship || 
          formData.EmergencyContactPhone || formData.EmergencyContactAddress || formData.EmergencyContactPIN) {
        payload.EmergencyContact = {
          name: formData.EmergencyContactName || undefined,
          relationship: formData.EmergencyContactRelationship || undefined,
          phone: formData.EmergencyContactPhone || undefined,
          address: formData.EmergencyContactAddress || undefined,
          pinCode: formData.EmergencyContactPIN || undefined
        };
        
        // Remove undefined values from EmergencyContact
        Object.keys(payload.EmergencyContact).forEach(key => 
          payload.EmergencyContact[key] === undefined && delete payload.EmergencyContact[key]
        );
      }

      // Remove undefined top-level fields
      Object.keys(payload).forEach(key => 
        payload[key] === undefined && delete payload[key]
      );

      // If BankDetails or EmergencyContact are empty objects, remove them
      if (payload.BankDetails && Object.keys(payload.BankDetails).length === 0) {
        delete payload.BankDetails;
      }
      
      if (payload.EmergencyContact && Object.keys(payload.EmergencyContact).length === 0) {
        delete payload.EmergencyContact;
      }

      const response = await axios.put(`${BASE_URL}/api/employees/${employee._id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update employee');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      setError(err.response?.data?.message || 'Failed to update employee. Please try again.');
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
    setDepartmentSearch('');
    setDesignationSearch('');
  };

  // Render content based on active step
  const renderStepContent = () => {
    switch(activeStep) {
      case 0: // Personal Info
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', fontWeight: 600 }}>
              Personal Information
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.FirstName && (!!fieldErrors.FirstName || !formData.FirstName.trim())}
                helperText={
                  touched.FirstName 
                    ? (!formData.FirstName.trim() ? 'First name is required' : fieldErrors.FirstName)
                    : 'Letters, spaces, and hyphens only'
                }
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.LastName && (!!fieldErrors.LastName || !formData.LastName.trim())}
                helperText={
                  touched.LastName 
                    ? (!formData.LastName.trim() ? 'Last name is required' : fieldErrors.LastName)
                    : 'Letters, spaces, and hyphens only'
                }
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>
          
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  label="Gender"
                  disabled={loading || loadingData}
                  sx={{ borderRadius: 1 }}
                  MenuProps={selectMenuProps}
                >
                  {genderOptions.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Date of Birth"
                name="DateOfBirth"
                type="date"
                value={formData.DateOfBirth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>
          
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Email"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.Email && (!!fieldErrors.Email || !formData.Email)}
                helperText={
                  touched.Email 
                    ? (!formData.Email ? 'Email is required' : fieldErrors.Email)
                    : 'Enter a valid email address'
                }
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Phone"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.Phone && !!fieldErrors.Phone}
                helperText={touched.Phone ? fieldErrors.Phone : '10 digit number (optional)'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="9876543210"
                inputProps={{ maxLength: 10 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            <TextField
              fullWidth
              label="Address"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              onBlur={handleBlur}
              multiline
              rows={2}
              error={touched.Address && !!fieldErrors.Address}
              helperText={touched.Address ? fieldErrors.Address : 'Street, city, etc. (optional)'}
              disabled={loading || loadingData}
              size="medium"
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
            />
          </>
        );

      case 1: // Employment
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', fontWeight: 600 }}>
              Employment Information
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <Autocomplete
                  options={departments}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option.DepartmentName || '';
                  }}
                  value={departments.find(dept => dept._id === formData.DepartmentID) || null}
                  onChange={(event, newValue) => {
                    handleAutocompleteChange('DepartmentID', newValue?._id || '');
                  }}
                  onInputChange={(event, newInputValue) => {
                    setDepartmentSearch(newInputValue);
                  }}
                  loading={loadingData}
                  disabled={loading || loadingData}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department *"
                      required
                      error={touched.DepartmentID && !formData.DepartmentID}
                      helperText={touched.DepartmentID && !formData.DepartmentID ? 'Department is required' : ''}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  PaperComponent={CustomPaper}
                  ListboxProps={{
                    style: {
                      maxHeight: 200,
                      overflow: 'auto',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      }
                    }
                  }}
                  noOptionsText={departments.length === 0 ? "No departments available" : "No matching departments"}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                />
              </FormControl>
              
              <FormControl fullWidth>
                <Autocomplete
                  options={designations}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return `${option.DesignationName || ''} ${option.Level ? `(Level ${option.Level})` : ''}`;
                  }}
                  value={designations.find(desig => desig._id === formData.DesignationID) || null}
                  onChange={(event, newValue) => {
                    handleAutocompleteChange('DesignationID', newValue?._id || '');
                  }}
                  onInputChange={(event, newInputValue) => {
                    setDesignationSearch(newInputValue);
                  }}
                  loading={loadingData}
                  disabled={loading || loadingData}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Designation *"
                      required
                      error={touched.DesignationID && !formData.DesignationID}
                      helperText={touched.DesignationID && !formData.DesignationID ? 'Designation is required' : ''}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  PaperComponent={CustomPaper}
                  ListboxProps={{
                    style: {
                      maxHeight: 200,
                      overflow: 'auto',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      }
                    }
                  }}
                  noOptionsText={designations.length === 0 ? "No designations available" : "No matching designations"}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                />
              </FormControl>
            </Stack>
          
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Date of Joining *"
                name="DateOfJoining"
                type="date"
                value={formData.DateOfJoining}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.DateOfJoining && !formData.DateOfJoining}
                helperText={touched.DateOfJoining && !formData.DateOfJoining ? 'Date of joining is required' : ''}
                InputLabelProps={{ shrink: true }}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  name="EmploymentStatus"
                  value={formData.EmploymentStatus}
                  onChange={handleChange}
                  label="Employment Status"
                  disabled={loading || loadingData}
                  sx={{ borderRadius: 1 }}
                  MenuProps={selectMenuProps}
                >
                  {employmentStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </>
        );

      case 2: // Pay & Work
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', fontWeight: 600 }}>
              Pay & Work Information
            </Typography>
            
            {/* Employment Type and Pay Structure Type */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Employment Type *</InputLabel>
                <Select
                  name="EmploymentType"
                  value={formData.EmploymentType}
                  onChange={handleEmploymentTypeChange}
                  label="Employment Type *"
                  disabled={loading || loadingData}
                  sx={{ borderRadius: 1 }}
                  MenuProps={selectMenuProps}
                >
                  {employmentTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Pay Structure Type *</InputLabel>
                <Select
                  name="PayStructureType"
                  value={formData.PayStructureType}
                  onChange={handleChange}
                  label="Pay Structure Type *"
                  disabled={loading || loadingData}
                  sx={{ borderRadius: 1 }}
                  MenuProps={selectMenuProps}
                >
                  {payStructureOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Salary Fields based on Employment Type */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {showSalaryField() && (
                <TextField
                  fullWidth
                  label="Basic Salary"
                  name="BasicSalary"
                  type="number"
                  value={formData.BasicSalary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={touched.BasicSalary && !formData.BasicSalary}
                  helperText={touched.BasicSalary && !formData.BasicSalary ? 'Basic salary is required' : ''}
                  disabled={loading || loadingData}
                  size="medium"
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              )}

              {formData.EmploymentType === "Hourly" && (
                <TextField
                  fullWidth
                  label="Hourly Rate"
                  name="HourlyRate"
                  type="number"
                  value={formData.HourlyRate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={touched.HourlyRate && !formData.HourlyRate}
                  helperText={touched.HourlyRate && !formData.HourlyRate ? 'Hourly rate is required' : ''}
                  disabled={loading || loadingData}
                  size="medium"
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              )}

              {formData.EmploymentType === "PieceRate" && (
                <TextField
                  fullWidth
                  label="Piece Rate (configured separately)"
                  name="PieceRateInfo"
                  value="Configure in Piece Rate Details"
                  disabled
                  size="medium"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              )}
            </Stack>

            {/* Overtime Rate Multiplier and Skill Level - Show for Monthly and Hourly only */}
            {showOvertimeField() && (
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Overtime Rate Multiplier"
                  name="OvertimeRateMultiplier"
                  type="number"
                  value={formData.OvertimeRateMultiplier}
                  onChange={handleChange}
                  disabled={loading || loadingData}
                  size="medium"
                  variant="outlined"
                  inputProps={{ step: 0.25, min: 1, max: 3 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
                <FormControl fullWidth>
                  <InputLabel>Skill Level</InputLabel>
                  <Select
                    name="SkillLevel"
                    value={formData.SkillLevel}
                    onChange={handleChange}
                    label="Skill Level"
                    disabled={loading || loadingData}
                    sx={{ borderRadius: 1 }}
                    MenuProps={selectMenuProps}
                  >
                    {skillLevelOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}

            {/* Work Station and Line Number */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Work Station"
                name="WorkStation"
                value={formData.WorkStation}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.WorkStation && !!fieldErrors.WorkStation}
                helperText={touched.WorkStation ? fieldErrors.WorkStation : 'Letters, numbers, spaces, hyphens (optional)'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Line Number"
                name="LineNumber"
                value={formData.LineNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.LineNumber && !!fieldErrors.LineNumber}
                helperText={touched.LineNumber ? fieldErrors.LineNumber : 'Letters, numbers, spaces, hyphens (optional)'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            {/* Tax & Identification Fields */}
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', fontWeight: 600 }}>
              Tax & Identification (Optional)
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="PAN"
                name="PAN"
                value={formData.PAN}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.PAN && !!fieldErrors.PAN}
                helperText={touched.PAN ? fieldErrors.PAN : 'Format: ABCDE1234F'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="ABCDE1234F"
                inputProps={{ maxLength: 10 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Aadhar Number"
                name="AadharNumber"
                value={formData.AadharNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.AadharNumber && !!fieldErrors.AadharNumber}
                helperText={touched.AadharNumber ? fieldErrors.AadharNumber : '12 digits'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="123456789012"
                inputProps={{ maxLength: 12 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="PF Number"
                name="PFNumber"
                value={formData.PFNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.PFNumber && !!fieldErrors.PFNumber}
                helperText={touched.PFNumber ? fieldErrors.PFNumber : 'Format: XX/12345/1234567'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="AB/12345/1234567"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="UAN"
                name="UAN"
                value={formData.UAN}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.UAN && !!fieldErrors.UAN}
                helperText={touched.UAN ? fieldErrors.UAN : '12 digits'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="123456789012"
                inputProps={{ maxLength: 12 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="ESI Number"
                name="ESINumber"
                value={formData.ESINumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ESINumber && !!fieldErrors.ESINumber}
                helperText={touched.ESINumber ? fieldErrors.ESINumber : '17 digits'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="12345678901234567"
                inputProps={{ maxLength: 17 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <FormControl fullWidth>
                <InputLabel>Bank Account Type</InputLabel>
                <Select
                  name="BankAccountType"
                  value={formData.BankAccountType}
                  onChange={handleChange}
                  label="Bank Account Type"
                  disabled={loading || loadingData}
                  sx={{ borderRadius: 1 }}
                  MenuProps={selectMenuProps}
                >
                  {accountTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </>
        );

      case 3: // Bank & Emergency
        return (
          <>
            {/* Bank Details */}
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', fontWeight: 600 }}>
              Bank Details (Optional)
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Account Number"
                name="BankAccountNumber"
                value={formData.BankAccountNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.BankAccountNumber && !!fieldErrors.BankAccountNumber}
                helperText={touched.BankAccountNumber ? fieldErrors.BankAccountNumber : '9-18 digits'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="123456789"
                inputProps={{ maxLength: 18 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Account Holder Name"
                name="BankAccountHolderName"
                value={formData.BankAccountHolderName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.BankAccountHolderName && !!fieldErrors.BankAccountHolderName}
                helperText={touched.BankAccountHolderName ? fieldErrors.BankAccountHolderName : 'Letters, spaces, dots, hyphens only'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="John Doe"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Bank Name"
                name="BankName"
                value={formData.BankName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.BankName && !!fieldErrors.BankName}
                helperText={touched.BankName ? fieldErrors.BankName : 'Letters, spaces, dots, hyphens only'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="State Bank of India"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Branch"
                name="BankBranch"
                value={formData.BankBranch}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.BankBranch && !!fieldErrors.BankBranch}
                helperText={touched.BankBranch ? fieldErrors.BankBranch : 'Letters, numbers, spaces, hyphens only'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="Main Branch"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="BankIfscCode"
                value={formData.BankIfscCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.BankIfscCode && !!fieldErrors.BankIfscCode}
                helperText={touched.BankIfscCode ? fieldErrors.BankIfscCode : 'Format: ABCD0123456'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="SBIN0123456"
                inputProps={{ maxLength: 11 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            {/* Emergency Contact */}
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976D2', fontWeight: 600, mt: 2 }}>
              Emergency Contact (Optional)
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Contact Name"
                name="EmergencyContactName"
                value={formData.EmergencyContactName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.EmergencyContactName && !!fieldErrors.EmergencyContactName}
                helperText={touched.EmergencyContactName ? fieldErrors.EmergencyContactName : 'Letters, spaces, dots, hyphens only'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="Jane Doe"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Relationship"
                name="EmergencyContactRelationship"
                value={formData.EmergencyContactRelationship}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.EmergencyContactRelationship && !!fieldErrors.EmergencyContactRelationship}
                helperText={touched.EmergencyContactRelationship ? fieldErrors.EmergencyContactRelationship : 'Letters and spaces only'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="Spouse"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Phone"
                name="EmergencyContactPhone"
                value={formData.EmergencyContactPhone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.EmergencyContactPhone && !!fieldErrors.EmergencyContactPhone}
                helperText={touched.EmergencyContactPhone ? fieldErrors.EmergencyContactPhone : '10 digits'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="9876543210"
                inputProps={{ maxLength: 10 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Address"
                name="EmergencyContactAddress"
                value={formData.EmergencyContactAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.EmergencyContactAddress && !!fieldErrors.EmergencyContactAddress}
                helperText={touched.EmergencyContactAddress ? fieldErrors.EmergencyContactAddress : 'Street, city, etc.'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="123 Main St, City"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="PIN Code"
                name="EmergencyContactPIN"
                value={formData.EmergencyContactPIN}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.EmergencyContactPIN && !!fieldErrors.EmergencyContactPIN}
                helperText={touched.EmergencyContactPIN ? fieldErrors.EmergencyContactPIN : '6 digits'}
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                placeholder="400001"
                inputProps={{ maxLength: 6 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => {
        resetForm();
        onClose();
      }} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2, 
        background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
        color: '#fff'
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EditIcon />
          <Typography variant="h6" fontWeight={600}>
            Edit Employee
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, overflowY: 'auto'}}>
        <Stack spacing={3}>
          {/* Stepper */}
          <Box sx={{ width: '100%', mb: 2 , pt:2 }}>
            <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography variant="caption" fontWeight={500}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step Content */}
          <Paper elevation={0} sx={{ p: 3, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
            <Stack spacing={3}>
              {renderStepContent()}
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 1,
                    '& .MuiAlert-icon': {
                      alignItems: 'center'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        borderTop: '1px solid #E0E0E0', 
        pt: 2,
        backgroundColor: '#F8FAFC',
        justifyContent: 'space-between'
      }}>
        <Button 
          onClick={() => {
            resetForm();
            onClose();
          }} 
          disabled={loading}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            border: '1px solid #cbd5e1',
            color: '#475569'
          }}
        >
          Cancel
        </Button>
        
        <Stack direction="row" spacing={2}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              disabled={loading || loadingData}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Back
            </Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || loadingData}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || loadingData}
              startIcon={loading ? null : <EditIcon />}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              {loading ? 'Updating...' : 'Update Employee'}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployees;