// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Typography,
//   Rating,
//   Chip,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   IconButton,
//   Divider,
//   Stepper,
//   Step,
//   StepLabel,
//   MenuItem,
//   Switch,
//   FormControlLabel,
//   Box
// } from "@mui/material";
// import { Close } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const PRIMARY_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// /* ================= ENUMS FROM BACKEND ================= */

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

// const steps = ["Basic Info", "Details", "Attachments"];

// const EditEmployeeBehavior = ({ open, onClose, behaviorId, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [behavior, setBehavior] = useState(null);
//   const [attachments, setAttachments] = useState([]);
//   const [activeStep, setActiveStep] = useState(0);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   const [form, setForm] = useState({
//     category: "",
//     rating: 0,
//     description: "",
//     actionTaken: "None",
//     reviewDate: "",
//     tags: "",
//     isConfidential: false
//   });

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     if (open && behaviorId) fetchBehavior();
//   }, [open, behaviorId]);

//   const fetchBehavior = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/employee-behavior/${behaviorId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         const data = res.data.data;
//         setBehavior(data);
//         setAttachments(data.attachments || []);

//         setForm({
//           category: data.category,
//           rating: data.rating,
//           description: data.description,
//           actionTaken: data.actionTaken,
//           reviewDate: data.reviewDate?.split("T")[0] || "",
//           tags: data.tags?.join(", ") || "",
//           isConfidential: data.isConfidential
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= HELPERS ================= */

//   const getType = rating => {
//     if (rating >= 4) return "Positive";
//     if (rating <= 2) return "Negative";
//     return "Neutral";
//   };

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   /* ================= UPDATE ================= */

//   const handleUpdate = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       await axios.put(
//         `${BASE_URL}/api/employee-behavior/${behaviorId}`,
//         {
//           category: form.category,
//           rating: Number(form.rating),
//           type: getType(form.rating),
//           description: form.description,
//           actionTaken: form.actionTaken,
//           reviewDate: form.reviewDate,
//           isConfidential: form.isConfidential,
//           tags: form.tags
//             ? form.tags.split(",").map(tag => tag.trim())
//             : []
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       setSnackbar({
//         open: true,
//         message: "Behavior updated successfully",
//         severity: "success"
//       });

//       if (onSuccess) onSuccess();
//       onClose();

//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message:
//           err.response?.data?.message || "Update failed",
//         severity: "error"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= DELETE ATTACHMENT ================= */

//   const handleDeleteAttachment = async attachmentId => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.delete(
//         `${BASE_URL}/api/employee-behavior/${behaviorId}/attachments/${attachmentId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setAttachments(prev =>
//         prev.filter(att => att._id !== attachmentId)
//       );

//       setSnackbar({
//         open: true,
//         message: "Attachment deleted",
//         severity: "success"
//       });

//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: "Failed to delete attachment",
//         severity: "error"
//       });
//     }
//   };

//   /* ================= STEP CONTENT ================= */

//   const renderStepContent = () => {
//     switch (activeStep) {
//       case 0:
//         return (
//           <Stack spacing={3}>
//             <TextField
//               select
//               label="Category"
//               name="category"
//               value={form.category}
//               onChange={handleChange}
//               fullWidth
//             >
//               {CATEGORY_OPTIONS.map(option => (
//                 <MenuItem key={option} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <Stack direction="row" spacing={2} alignItems="center">
//               <Rating
//                 value={form.rating}
//                 onChange={(e, newValue) =>
//                   setForm(prev => ({
//                     ...prev,
//                     rating: newValue
//                   }))
//                 }
//               />
//               <Chip label={getType(form.rating)} />
//             </Stack>

//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={form.isConfidential}
//                   onChange={e =>
//                     setForm(prev => ({
//                       ...prev,
//                       isConfidential: e.target.checked
//                     }))
//                   }
//                 />
//               }
//               label="Confidential"
//             />
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={3}>
//             <TextField
//               label="Description"
//               name="description"
//               multiline
//               rows={3}
//               value={form.description}
//               onChange={handleChange}
//               fullWidth
//             />

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

//             <TextField
//               type="date"
//               name="reviewDate"
//               value={form.reviewDate}
//               onChange={handleChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//             />

//             <TextField
//               label="Tags (comma separated)"
//               name="tags"
//               value={form.tags}
//               onChange={handleChange}
//               fullWidth
//             />
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={2}>
//             <Typography fontWeight={600}>
//               Attachments
//             </Typography>

//             {attachments.length === 0 && (
//               <Typography variant="body2" color="text.secondary">
//                 No attachments available
//               </Typography>
//             )}

//             {attachments.map(att => (
//               <Box
//                 key={att._id}
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Typography variant="body2">
//                   {att.originalName || att.filename}
//                 </Typography>
//                 <Button
//                   size="small"
//                   color="error"
//                   onClick={() =>
//                     handleDeleteAttachment(att._id)
//                   }
//                 >
//                   Delete
//                 </Button>
//               </Box>
//             ))}
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <>
//       <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//         <DialogTitle
//           sx={{
//             background: PRIMARY_GRADIENT,
//             color: "#fff",
//             fontWeight: 600
//           }}
//         >
//           Edit Behavior
//           <IconButton
//             onClick={onClose}
//             sx={{ position: "absolute", right: 10, top: 10, color: "#fff" }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ minHeight: 220 }}>
//           {loading && !behavior ? (
//             <Stack alignItems="center" py={5}>
//               <CircularProgress />
//             </Stack>
//           ) : (
//             <>
//               <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
//                 {steps.map(label => (
//                   <Step key={label}>
//                     <StepLabel>{label}</StepLabel>
//                   </Step>
//                 ))}
//               </Stepper>

//               {renderStepContent()}
//             </>
//           )}
//         </DialogContent>

//         <DialogActions>
//           <Button
//             disabled={activeStep === 0}
//             onClick={() => setActiveStep(prev => prev - 1)}
//           >
//             Back
//           </Button>

//           {activeStep < steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={() => setActiveStep(prev => prev + 1)}
//             >
//               Next
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleUpdate}
//               disabled={loading}
//             >
//               {loading ? (
//                 <CircularProgress size={20} />
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>

//      <Snackbar
//              open={snackbar.open}
//              autoHideDuration={3000}
//              onClose={() => setSnackbar({...snackbar, open: false})}
//              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//            >
//              <Alert 
//                onClose={() => setSnackbar({...snackbar, open: false})} 
//                severity={snackbar.severity}
//                variant="filled"
//                sx={{ 
//                  width: '100%',
//                  borderRadius: 1.5,
//                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                }}
//              >
//                {snackbar.message}
//              </Alert>
//            </Snackbar>
//     </>
//   );
// };

// export default EditEmployeeBehavior;

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
  CircularProgress,
  Alert,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Switch,
  FormControlLabel,
  Box,
  Autocomplete
} from "@mui/material";
import { Close, AttachFile, Delete } from "@mui/icons-material";
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

/* ================= ENUMS FROM BACKEND ================= */

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

const steps = ["Basic Info", "Details", "Attachments"];

const EditEmployeeBehavior = ({ open, onClose, behaviorId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [behavior, setBehavior] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    category: "",
    rating: 0,
    description: "",
    actionTaken: "None",
    reviewDate: "",
    tags: "",
    isConfidential: false
  });

  // Selected values for Autocomplete
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

  /* ================= FETCH ================= */

  useEffect(() => {
    if (open && behaviorId) fetchBehavior();
  }, [open, behaviorId]);

  const fetchBehavior = async () => {
    try {
      setFetchLoading(true);
      setError('');
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/employee-behavior/${behaviorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const data = res.data.data;
        setBehavior(data);
        setAttachments(data.attachments || []);

        // Find selected category
        const category = categoryOptions.find(opt => opt.value === data.category);
        setSelectedCategory(category || null);

        // Find selected action
        const action = actionOptions.find(opt => opt.value === data.actionTaken);
        setSelectedAction(action || { value: "None", label: "None" });

        setForm({
          category: data.category,
          rating: data.rating,
          description: data.description,
          actionTaken: data.actionTaken,
          reviewDate: data.reviewDate?.split("T")[0] || "",
          tags: data.tags?.join(", ") || "",
          isConfidential: data.isConfidential
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch behavior data');
    } finally {
      setFetchLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const getType = rating => {
    if (rating >= 4) return "Positive";
    if (rating <= 2) return "Negative";
    return "Neutral";
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    if (newValue) {
      setForm(prev => ({ ...prev, category: newValue.value }));
    } else {
      setForm(prev => ({ ...prev, category: "" }));
    }
    setError('');
  };

  const handleActionChange = (event, newValue) => {
    setSelectedAction(newValue);
    if (newValue) {
      setForm(prev => ({ ...prev, actionTaken: newValue.value }));
    } else {
      setForm(prev => ({ ...prev, actionTaken: "None" }));
    }
  };

  const handleRatingChange = (event, newValue) => {
    setForm(prev => ({ ...prev, rating: newValue }));
    setError('');
  };

  const handleSwitchChange = (e) => {
    setForm(prev => ({ ...prev, isConfidential: e.target.checked }));
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    // Validation
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

      await axios.put(
        `${BASE_URL}/api/employee-behavior/${behaviorId}`,
        {
          category: form.category,
          rating: Number(form.rating),
          type: getType(form.rating),
          description: form.description,
          actionTaken: form.actionTaken,
          reviewDate: form.reviewDate,
          isConfidential: form.isConfidential,
          tags: form.tags
            ? form.tags.split(",").map(tag => tag.trim())
            : []
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        handleClose();
      }, 1500);

    } catch (err) {
      console.error('Error updating behavior:', err);
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ATTACHMENT ================= */

  const handleDeleteAttachment = async (attachmentId, index) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${BASE_URL}/api/employee-behavior/${behaviorId}/attachments/${attachmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAttachments(prev => prev.filter((_, i) => i !== index));

    } catch (err) {
      setError('Failed to delete attachment');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
    setError('');
    setSuccess(false);
    setActiveStep(0);
  };

  const resetForm = () => {
    setForm({
      category: "",
      rating: 0,
      description: "",
      actionTaken: "None",
      reviewDate: "",
      tags: "",
      isConfidential: false
    });
    setSelectedCategory(null);
    setSelectedAction({ value: "None", label: "None" });
    setAttachments([]);
  };

  /* ================= STEP CONTENT ================= */

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
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
                  disabled={loading || fetchLoading}
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
                    disabled={loading || fetchLoading}
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

            {/* Confidential Switch */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isConfidential}
                    onChange={handleSwitchChange}
                    disabled={loading || fetchLoading}
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
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
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
                  disabled={loading || fetchLoading}
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
                  disabled={loading || fetchLoading}
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
                  disabled={loading || fetchLoading}
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
                  disabled={loading || fetchLoading}
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
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
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

                {attachments.length === 0 ? (
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5,
                    border: `1px dashed ${COLORS.border}`,
                    textAlign: 'center'
                  }}>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                      No attachments available
                    </Typography>
                  </Box>
                ) : (
                  attachments.map((att, index) => (
                    <Stack
                      key={att._id || index}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        p: 1,
                        bgcolor: COLORS.background.light,
                        borderRadius: 1,
                        border: `1px solid ${COLORS.border}`
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {att.originalName || att.filename}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteAttachment(att._id, index)}
                        disabled={loading}
                        sx={{
                          color: COLORS.status.error,
                          '&:hover': {
                            bgcolor: `${COLORS.status.error}20`
                          }
                        }}
                      >
                        <Delete sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Stack>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  /* ================= UI ================= */

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
          Edit Behavior
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

      <DialogContent sx={{ p: 2.5, minHeight: 320 }}>
        {fetchLoading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 250 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
              Loading behavior data...
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 2,
                '& .MuiStepLabel-label': {
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: COLORS.text.secondary
                },
                '& .MuiStepLabel-label.Mui-active': {
                  color: COLORS.primary,
                  fontWeight: 600
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  color: COLORS.text.primary
                },
                '& .MuiSvgIcon-root.Mui-active': {
                  color: COLORS.primary
                },
                '& .MuiSvgIcon-root.Mui-completed': {
                  color: COLORS.primary
                }
              }}
            >
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent()}

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
                Behavior updated successfully!
              </Alert>
            )}
          </Stack>
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
          onClick={() => setActiveStep(prev => prev - 1)}
          disabled={activeStep === 0 || loading || fetchLoading}
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
            },
            '&:disabled': {
              borderColor: COLORS.border,
              color: COLORS.text.tertiary,
              bgcolor: 'transparent'
            }
          }}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading || fetchLoading}
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

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setActiveStep(prev => prev + 1)}
              disabled={loading || fetchLoading || (activeStep === 0 && (!form.category || !form.rating))}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                minWidth: 60,
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                },
                '&:disabled': {
                  bgcolor: COLORS.border,
                  color: COLORS.text.tertiary
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={loading || fetchLoading || !form.category || !form.rating || !form.description.trim()}
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
              {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : 'Save Changes'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeBehavior;