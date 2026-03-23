// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Alert,
//   MenuItem,
//   Switch,
//   FormControlLabel,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import { Send as SendIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const SubmitTermination = ({
//   open,
//   onClose,
//   termination,
//   onSubmitFeedback,
// }) => {
//   const [formData, setFormData] = useState({
//     reasonForLeaving: "",
//     experienceWithCompany: "",
//     wouldRecommend: false,
//     feedbackDetails: "",
//     suggestionsForImprovement: "",
//     rehireEligible: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   if (!termination) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSwitch = (e) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.reasonForLeaving)
//       return setError("Reason for leaving is required");
//     if (!formData.experienceWithCompany)
//       return setError("Experience selection is required");
//     if (!formData.feedbackDetails)
//       return setError("Feedback details are required");

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         `${BASE_URL}/api/terminations/${termination.terminationId}/feedback`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         onSubmitFeedback(response.data.data);
//         onClose();
//         setFormData({
//           reasonForLeaving: "",
//           experienceWithCompany: "",
//           wouldRecommend: false,
//           feedbackDetails: "",
//           suggestionsForImprovement: "",
//           rehireEligible: false,
//         });
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to submit feedback"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 3 },
//       }}
//     >
//       {/* HEADER */}
//       <DialogTitle
//         sx={{
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           fontWeight: 700,
//           fontSize: 20,
//         }}
//       >
//         Submit Exit Feedback
//       </DialogTitle>

//       <DialogContent sx={{ p: 3, margin: 2 }}>
//         <Stack spacing={3}>
//           {/* Termination ID */}
//           <Box>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//             >
//               Termination ID
//             </Typography>
//             <Typography fontWeight={600}>
//               {termination.terminationId}
//             </Typography>
//           </Box>

//           {/* Reason */}
//           <TextField
//             label="Reason for Leaving"
//             name="reasonForLeaving"
//             fullWidth
//             value={formData.reasonForLeaving}
//             onChange={handleChange}
//           />

//           {/* Experience Dropdown */}
//           <TextField
//             select
//             label="Experience With Company"
//             name="experienceWithCompany"
//             fullWidth
//             value={formData.experienceWithCompany}
//             onChange={handleChange}
//           >
//             <MenuItem value="excellent">
//               Excellent
//             </MenuItem>
//             <MenuItem value="good">
//               Good
//             </MenuItem>
//             <MenuItem value="average">
//               Average
//             </MenuItem>
//             <MenuItem value="poor">
//               Poor
//             </MenuItem>
//           </TextField>

//           {/* Switches */}
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={formData.wouldRecommend}
//                 onChange={handleSwitch}
//                 name="wouldRecommend"
//                 color="primary"
//               />
//             }
//             label="Would Recommend Company"
//           />

//           <FormControlLabel
//             control={
//               <Switch
//                 checked={formData.rehireEligible}
//                 onChange={handleSwitch}
//                 name="rehireEligible"
//                 color="primary"
//               />
//             }
//             label="Eligible for Rehire"
//           />

//           {/* Feedback Details */}
//           <TextField
//             label="Detailed Feedback"
//             name="feedbackDetails"
//             multiline
//             rows={3}
//             fullWidth
//             value={formData.feedbackDetails}
//             onChange={handleChange}
//           />

//           <TextField
//             label="Suggestions for Improvement"
//             name="suggestionsForImprovement"
//             multiline
//             rows={3}
//             fullWidth
//             value={formData.suggestionsForImprovement}
//             onChange={handleChange}
//           />

//           {error && <Alert severity="error">{error}</Alert>}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 3 }}>
//         <Button onClick={onClose}>
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={
//             !loading ? (
//               <SendIcon />
//             ) : (
//               <CircularProgress
//                 size={18}
//                 color="inherit"
//               />
//             )
//           }
//           sx={{
//             background: HEADER_GRADIENT,
//             "&:hover": { opacity: 0.9 },
//           }}
//         >
//           {loading
//             ? "Submitting..."
//             : "Submit Feedback"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default SubmitTermination;
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import { Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";
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

const SubmitTermination = ({
  open,
  onClose,
  termination,
  onSubmitFeedback,
}) => {
  const [formData, setFormData] = useState({
    reasonForLeaving: "",
    experienceWithCompany: "",
    wouldRecommend: false,
    feedbackDetails: "",
    suggestionsForImprovement: "",
    rehireEligible: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!termination) return null;

  const experienceOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'average', label: 'Average' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitch = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.reasonForLeaving.trim()) {
      setError("Reason for leaving is required");
      return;
    }
    if (!formData.experienceWithCompany) {
      setError("Experience selection is required");
      return;
    }
    if (!formData.feedbackDetails.trim()) {
      setError("Feedback details are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/terminations/${termination.terminationId}/feedback`,
        {
          ...formData,
          reasonForLeaving: formData.reasonForLeaving.trim(),
          feedbackDetails: formData.feedbackDetails.trim(),
          suggestionsForImprovement: formData.suggestionsForImprovement.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        onSubmitFeedback(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(
        err.response?.data?.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      reasonForLeaving: "",
      experienceWithCompany: "",
      wouldRecommend: false,
      feedbackDetails: "",
      suggestionsForImprovement: "",
      rehireEligible: false,
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
        mb: 1.5,
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
          Submit Exit Feedback
        </Typography>
        <Button
          onClick={handleClose}
          sx={{
            minWidth: 'auto',
            p: 0.5,
            color: COLORS.text.tertiary,
            '&:hover': {
              bgcolor: COLORS.background.hover,
              color: COLORS.text.secondary
            }
          }}
        >
          <CloseIcon sx={{ fontSize: '1.2rem' }} />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Termination ID */}
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
                  TERMINATION ID
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: COLORS.text.primary,
                    p: 1,
                    bgcolor: COLORS.background.light,
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}
                >
                  {termination.terminationId}
                </Typography>
              </Box>
            </Box>

            {/* Reason for Leaving */}
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
                  REASON FOR LEAVING <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="reasonForLeaving"
                  value={formData.reasonForLeaving}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter reason for leaving..."
                  size="small"
                  variant="outlined"
                  multiline
                  rows={2}
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

            {/* Experience With Company */}
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
                  EXPERIENCE WITH COMPANY <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="experienceWithCompany"
                  value={formData.experienceWithCompany}
                  onChange={handleChange}
                  disabled={loading}
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
                    }
                  }}
                >
                  {experienceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Switches */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.wouldRecommend}
                      onChange={handleSwitch}
                      name="wouldRecommend"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: COLORS.primary,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: COLORS.primary,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                      Would Recommend Company
                    </Typography>
                  }
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.rehireEligible}
                      onChange={handleSwitch}
                      name="rehireEligible"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: COLORS.primary,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: COLORS.primary,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                      Eligible for Rehire
                    </Typography>
                  }
                />
              </Box>
            </Box>

            {/* Detailed Feedback */}
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
                  DETAILED FEEDBACK <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="feedbackDetails"
                  value={formData.feedbackDetails}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  disabled={loading}
                  placeholder="Share your detailed feedback..."
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
              </Box>
            </Box>

            {/* Suggestions for Improvement */}
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
                  SUGGESTIONS FOR IMPROVEMENT
                </Typography>
                <TextField
                  fullWidth
                  name="suggestionsForImprovement"
                  value={formData.suggestionsForImprovement}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  disabled={loading}
                  placeholder="Share your suggestions for improvement..."
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
          disabled={loading || !formData.reasonForLeaving.trim() || !formData.experienceWithCompany || !formData.feedbackDetails.trim()}
          startIcon={loading ? null : <SendIcon sx={{ fontSize: '1rem' }} />}
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
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitTermination;