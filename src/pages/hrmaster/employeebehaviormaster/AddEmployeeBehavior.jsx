// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   Stack,
//   Typography,
//   Rating,
//   Chip,
//   Switch,
//   FormControlLabel,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   IconButton,
//   Box
// } from "@mui/material";
// import { Close, AttachFile } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// // ✅ ENUMS FROM BACKEND
// const CATEGORY_OPTIONS = [
//   "Discipline",
//   "Teamwork",
//   "Performance",
//   "Attitude",
//   "Attendance Behavior",
//   "Safety Compliance",
//   "Production Attitude",
//   "Supervisor Feedback",
//   "Punctuality",
//   "Quality of Work",
//   "Initiative",
//   "Communication"
// ];

// const ACTION_OPTIONS = [
//   "None",
//   "Verbal Warning",
//   "Written Warning",
//   "Counseling",
//   "Appreciation",
//   "Recognition",
//   "Improvement Plan",
//   "Suspension",
//   "Termination",
//   "Coaching",
//   "Final Warning"
// ];

// const AddEmployeeBehavior = ({ open, onClose, onSuccess }) => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     employeeId: "",
//     category: "",
//     rating: 0,
//     description: "",
//     actionTaken: "None",
//     reviewDate: "",
//     isConfidential: false,
//     tags: ""
//   });

//   const [attachments, setAttachments] = useState([]);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   // ================= FETCH EMPLOYEES =================
//   useEffect(() => {
//     if (open) fetchEmployees();
//   }, [open]);

//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data.success) {
//         setEmployees(res.data.data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ================= AUTO TYPE =================
//   const getType = rating => {
//     if (rating >= 4) return "Positive";
//     if (rating <= 2) return "Negative";
//     return "Neutral";
//   };

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleFileChange = e => {
//     setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
//   };

//   const removeFile = index => {
//     setAttachments(prev => prev.filter((_, i) => i !== index));
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const formData = new FormData();

//       formData.append("employeeId", form.employeeId);
//       formData.append("category", form.category);
//       formData.append("rating", Number(form.rating));
//       formData.append("type", getType(form.rating));
//       formData.append("description", form.description);
//       formData.append("actionTaken", form.actionTaken);
//       formData.append("reviewDate", form.reviewDate);
//       formData.append("isConfidential", form.isConfidential);
//       formData.append("tags", form.tags);

//       attachments.forEach(file => {
//         formData.append("attachments", file);
//       });

//       await axios.post(
//         `${BASE_URL}/api/employee-behavior`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data"
//           }
//         }
//       );

//       setSnackbar({
//         open: true,
//         message: "Behavior added successfully!",
//         severity: "success"
//       });

//       onSuccess();
//       handleClose();

//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message:
//           error.response?.data?.message ||
//           "Failed to submit behavior",
//         severity: "error"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const resetForm = () => {
//     setForm({
//       employeeId: "",
//       category: "",
//       rating: 0,
//       description: "",
//       actionTaken: "None",
//       reviewDate: "",
//       isConfidential: false,
//       tags: ""
//     });
//     setAttachments([]);
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Add Employee Behavior
//           <IconButton
//             onClick={handleClose}
//             sx={{ position: "absolute", right: 8, top: 8 }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Stack spacing={2} mt={1}>

//             {/* Employee */}
//             <TextField
//               select
//               label="Employee"
//               name="employeeId"
//               value={form.employeeId}
//               onChange={handleChange}
//               fullWidth
//               required
//             >
//               {employees.map(emp => (
//                 <MenuItem key={emp._id} value={emp._id}>
//                   {emp.EmployeeID} - {emp.FirstName} {emp.LastName}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Category ENUM */}
//             <TextField
//               select
//               label="Category"
//               name="category"
//               value={form.category}
//               onChange={handleChange}
//               fullWidth
//               required
//             >
//               {CATEGORY_OPTIONS.map(option => (
//                 <MenuItem key={option} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Rating */}
//             <Box>
//               <Typography variant="body2">Rating</Typography>
//               <Rating
//                 value={form.rating}
//                 onChange={(e, newValue) =>
//                   setForm({ ...form, rating: newValue })
//                 }
//               />
//               {form.rating > 0 && (
//                 <Chip
//                   label={getType(form.rating)}
//                   size="small"
//                   sx={{ ml: 1 }}
//                 />
//               )}
//             </Box>

//             {/* Description */}
//             <TextField
//               label="Description"
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               multiline
//               rows={3}
//               fullWidth
//               required
//             />

//             {/* Action ENUM */}
//             <TextField
//               select
//               label="Action Taken"
//               name="actionTaken"
//               value={form.actionTaken}
//               onChange={handleChange}
//               fullWidth
//             >
//               {ACTION_OPTIONS.map(option => (
//                 <MenuItem key={option} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Review Date */}
//             <TextField
//               type="date"
//               label="Review Date"
//               name="reviewDate"
//               value={form.reviewDate}
//               onChange={handleChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//             />

//             {/* Confidential */}
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={form.isConfidential}
//                   onChange={e =>
//                     setForm({
//                       ...form,
//                       isConfidential: e.target.checked
//                     })
//                   }
//                 />
//               }
//               label="Confidential"
//             />

//             {/* Tags */}
//             <TextField
//               label="Tags (comma separated)"
//               name="tags"
//               value={form.tags}
//               onChange={handleChange}
//               fullWidth
//             />

//             {/* Attachments */}
//             <Button
//               variant="outlined"
//               component="label"
//               startIcon={<AttachFile />}
//             >
//               Upload Attachments
//               <input
//                 type="file"
//                 hidden
//                 multiple
//                 onChange={handleFileChange}
//               />
//             </Button>

//             {attachments.map((file, index) => (
//               <Stack
//                 key={index}
//                 direction="row"
//                 justifyContent="space-between"
//               >
//                 <Typography variant="caption">
//                   {file.name}
//                 </Typography>
//                 <Button
//                   size="small"
//                   color="error"
//                   onClick={() => removeFile(index)}
//                 >
//                   Remove
//                 </Button>
//               </Stack>
//             ))}

//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={20} /> : "Submit"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//               open={snackbar.open}
//               autoHideDuration={3000}
//               onClose={() => setSnackbar({...snackbar, open: false})}
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//               <Alert 
//                 onClose={() => setSnackbar({...snackbar, open: false})} 
//                 severity={snackbar.severity}
//                 variant="filled"
//                 sx={{ 
//                   width: '100%',
//                   borderRadius: 1.5,
//                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                 }}
//               >
//                 {snackbar.message}
//               </Alert>
//             </Snackbar>
//     </>
//   );
// };

// export default AddEmployeeBehavior;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Rating,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  IconButton,
  Box,
  MenuItem,
  Autocomplete
} from "@mui/material";
import { Close, AttachFile } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// Color constants matching AddTax component
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

// ENUMS FROM BACKEND
const CATEGORY_OPTIONS = [
  "Discipline",
  "Teamwork",
  "Performance",
  "Attitude",
  "Attendance Behavior",
  "Safety Compliance",
  "Production Attitude",
  "Supervisor Feedback",
  "Punctuality",
  "Quality of Work",
  "Initiative",
  "Communication"
];

const ACTION_OPTIONS = [
  "None",
  "Verbal Warning",
  "Written Warning",
  "Counseling",
  "Appreciation",
  "Recognition",
  "Improvement Plan",
  "Suspension",
  "Termination",
  "Coaching",
  "Final Warning"
];

const AddEmployeeBehavior = ({ open, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    category: "",
    rating: 0,
    description: "",
    actionTaken: "None",
    reviewDate: "",
    isConfidential: false,
    tags: ""
  });

  const [attachments, setAttachments] = useState([]);

  // Selected values for Autocomplete
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAction, setSelectedAction] = useState({ value: "None", label: "None" });

  // Action options for Autocomplete
  const actionOptions = ACTION_OPTIONS.map(option => ({
    value: option,
    label: option
  }));

  // Category options for Autocomplete
  const categoryOptions = CATEGORY_OPTIONS.map(option => ({
    value: option,
    label: option
  }));

  // ================= FETCH EMPLOYEES =================
  useEffect(() => {
    if (open) fetchEmployees();
  }, [open]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= AUTO TYPE =================
  const getType = rating => {
    if (rating >= 4) return "Positive";
    if (rating <= 2) return "Negative";
    return "Neutral";
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleEmployeeChange = (event, newValue) => {
    setSelectedEmployee(newValue);
    if (newValue) {
      setForm({ ...form, employeeId: newValue._id });
    } else {
      setForm({ ...form, employeeId: "" });
    }
    setError('');
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    if (newValue) {
      setForm({ ...form, category: newValue.value });
    } else {
      setForm({ ...form, category: "" });
    }
    setError('');
  };

  const handleActionChange = (event, newValue) => {
    setSelectedAction(newValue);
    if (newValue) {
      setForm({ ...form, actionTaken: newValue.value });
    } else {
      setForm({ ...form, actionTaken: "None" });
    }
  };

  const handleRatingChange = (event, newValue) => {
    setForm({ ...form, rating: newValue });
    setError('');
  };

  const handleSwitchChange = (e) => {
    setForm({ ...form, isConfidential: e.target.checked });
  };

  const handleFileChange = e => {
    setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = index => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    // Validation
    if (!form.employeeId) {
      setError('Employee is required');
      return;
    }

    if (!form.category) {
      setError('Category is required');
      return;
    }

    if (!form.rating || form.rating === 0) {
      setError('Rating is required');
      return;
    }

    if (!form.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("employeeId", form.employeeId);
      formData.append("category", form.category);
      formData.append("rating", Number(form.rating));
      formData.append("type", getType(form.rating));
      formData.append("description", form.description);
      formData.append("actionTaken", form.actionTaken);
      formData.append("reviewDate", form.reviewDate);
      formData.append("isConfidential", form.isConfidential);
      formData.append("tags", form.tags);

      attachments.forEach(file => {
        formData.append("attachments", file);
      });

      await axios.post(
        `${BASE_URL}/api/employee-behavior`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);

    } catch (error) {
      console.error('Error adding behavior:', error);
      setError(error.response?.data?.message || "Failed to submit behavior");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
    setError('');
    setSuccess(false);
  };

  const resetForm = () => {
    setForm({
      employeeId: "",
      category: "",
      rating: 0,
      description: "",
      actionTaken: "None",
      reviewDate: "",
      isConfidential: false,
      tags: ""
    });
    setSelectedEmployee(null);
    setSelectedCategory(null);
    setSelectedAction({ value: "None", label: "None" });
    setAttachments([]);
  };

  // Employee options for Autocomplete
  const employeeOptions = employees.map(emp => ({
    ...emp,
    label: `${emp.EmployeeID} - ${emp.FirstName} ${emp.LastName}`
  }));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Add Employee Behavior
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: COLORS.primaryLight
            }
          }}
        >
          <Close sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Employee Field - Autocomplete */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  EMPLOYEE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={employeeOptions}
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  getOptionLabel={(option) => option.label || ''}
                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select employee"
                      required
                      error={!!error && error.includes('Employee')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': {
                            borderColor: COLORS.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: COLORS.primary,
                            borderWidth: 1
                          }
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
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {option.label}
                      </Typography>
                    </li>
                  )}
                  ListboxProps={{
                    sx: {
                      '& .MuiAutocomplete-option': {
                        fontSize: '0.75rem',
                        py: 1,
                        px: 1.5
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Category Field - Autocomplete */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  CATEGORY <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  getOptionLabel={(option) => option?.label || ''}
                  isOptionEqualToValue={(option, value) => option.value === value?.value}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select category"
                      required
                      error={!!error && error.includes('Category')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': {
                            borderColor: COLORS.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: COLORS.primary,
                            borderWidth: 1
                          }
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
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {option.label}
                      </Typography>
                    </li>
                  )}
                  ListboxProps={{
                    sx: {
                      '& .MuiAutocomplete-option': {
                        fontSize: '0.75rem',
                        py: 1,
                        px: 1.5
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Rating Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  RATING <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating
                    value={form.rating}
                    onChange={handleRatingChange}
                    size="small"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: COLORS.primary
                      }
                    }}
                  />
                  {form.rating > 0 && (
                    <Chip
                      label={getType(form.rating)}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        bgcolor: 
                          form.rating >= 4 ? COLORS.status.success :
                          form.rating <= 2 ? COLORS.status.error :
                          COLORS.status.warning,
                        color: COLORS.text.primary
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Description Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  DESCRIPTION <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  disabled={loading}
                  placeholder="Enter behavior description..."
                  size="small"
                  variant="outlined"
                  error={!!error && error.includes('Description')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
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
              </Box>
            </Box>

            {/* Action Taken Field - Autocomplete */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  ACTION TAKEN
                </Typography>
                <Autocomplete
                  fullWidth
                  options={actionOptions}
                  value={selectedAction}
                  onChange={handleActionChange}
                  getOptionLabel={(option) => option?.label || ''}
                  isOptionEqualToValue={(option, value) => option.value === value?.value}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select action"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': {
                            borderColor: COLORS.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: COLORS.primary,
                            borderWidth: 1
                          }
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
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {option.label}
                      </Typography>
                    </li>
                  )}
                  ListboxProps={{
                    sx: {
                      '& .MuiAutocomplete-option': {
                        fontSize: '0.75rem',
                        py: 1,
                        px: 1.5
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Review Date Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  REVIEW DATE
                </Typography>
                <TextField
                  type="date"
                  name="reviewDate"
                  value={form.reviewDate}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Confidential Switch */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isConfidential}
                    onChange={handleSwitchChange}
                    disabled={loading}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: COLORS.primary,
                        '&:hover': {
                          bgcolor: `${COLORS.primary}20`
                        }
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        bgcolor: COLORS.primary
                      }
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    Confidential
                  </Typography>
                }
              />
            </Box>

            {/* Tags Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  TAGS
                </Typography>
                <TextField
                  fullWidth
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter tags (comma separated)"
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
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
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  Separate tags with commas (e.g., "urgent, follow-up, positive")
                </Typography>
              </Box>
            </Box>

            {/* Attachments */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  ATTACHMENTS
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFile sx={{ fontSize: '1rem' }} />}
                  disabled={loading}
                  sx={{
                    height: 32,
                    borderRadius: 1.5,
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    '&:hover': {
                      borderColor: COLORS.primary,
                      bgcolor: COLORS.primaryLight
                    }
                  }}
                >
                  Upload Attachments
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>

                {attachments.map((file, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mt: 0.5,
                      p: 1,
                      bgcolor: COLORS.background.light,
                      borderRadius: 1,
                      border: `1px solid ${COLORS.border}`
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      {file.name}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeFile(index)}
                      disabled={loading}
                      sx={{
                        minWidth: 'auto',
                        fontSize: '0.65rem',
                        p: 0.5,
                        '&:hover': {
                          bgcolor: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                ))}
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1.5,
                mt: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem',
                  alignItems: 'center'
                },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                borderRadius: 1.5,
                mt: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem',
                  alignItems: 'center'
                },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              Behavior added successfully!
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
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
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !form.employeeId || !form.category || !form.rating || !form.description.trim()}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            minWidth: 80,
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeBehavior;