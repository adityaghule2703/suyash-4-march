// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   MenuItem,
//   IconButton,
//   Divider,
//   Alert,
//   CircularProgress,
//   Chip,
// } from "@mui/material";

// import { Close as CloseIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #c2410c 100%)";

// const EditClaim = ({ open, onClose, onSuccess, claimData }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     status: "",
//     approvedAmount: "",
//     comments: "",
//   });

//   /* ---------------- INITIALIZE DATA ---------------- */

//   useEffect(() => {
//     if (claimData) {
//       setFormData({
//         status: claimData.status || "",
//         approvedAmount: claimData.approvedAmount || "",
//         comments: "",
//       });
//     }
//   }, [claimData]);

//   /* ---------------- VALIDATION ---------------- */

//   const validateForm = () => {
//     if (!formData.status) return "Status is required";

//     if (
//       formData.status === "approved" ||
//       formData.status === "settled"
//     ) {
//       if (!formData.approvedAmount)
//         return "Approved amount is required";

//       if (
//         Number(formData.approvedAmount) >
//         Number(claimData.claimedAmount)
//       )
//         return "Approved amount cannot exceed claimed amount";

//       if (Number(formData.approvedAmount) <= 0)
//         return "Approved amount must be greater than 0";
//     }

//     return null;
//   };

//   /* ---------------- SUBMIT ---------------- */

//   const handleSubmit = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const payload = {
//         status: formData.status,
//         comments: formData.comments,
//       };

//       // Only send approvedAmount if needed
//       if (
//         formData.status === "approved" ||
//         formData.status === "settled"
//       ) {
//         payload.approvedAmount = Number(formData.approvedAmount);
//       }

//       const res = await axios.put(
//         `${BASE_URL}/api/mediclaim/claims/${claimData._id}/status`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         onSuccess && onSuccess();
//         onClose();
//       } else {
//         setError(res.data.message || "Failed to update claim");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to update claim"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- STATUS COLOR ---------------- */

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//       case "settled":
//         return "success";
//       case "rejected":
//         return "error";
//       case "under_review":
//         return "warning";
//       default:
//         return "default";
//     }
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle
//         sx={{
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         Update Claim Status
//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>
//         <Stack spacing={3}>
//           {/* CLAIM INFO */}
//           {claimData && (
//             <>
//               <Typography variant="subtitle2">
//                 Claim ID: <strong>{claimData.claimId}</strong>
//               </Typography>

//               <Typography variant="subtitle2">
//                 Patient:{" "}
//                 <strong>
//                   {claimData.patientDetails?.name}
//                 </strong>
//               </Typography>

//               <Typography variant="subtitle2">
//                 Claim Type:{" "}
//                 <strong>{claimData.claimType}</strong>
//               </Typography>

//               <Typography variant="subtitle2">
//                 Claimed Amount: ₹{claimData.claimedAmount}
//               </Typography>

//               <Chip
//                 label={`Current Status: ${claimData.status}`}
//                 color={getStatusColor(claimData.status)}
//               />

//               <Divider />
//             </>
//           )}

//           {/* STATUS DROPDOWN */}
//           <TextField
//             select
//             label="Status"
//             value={formData.status}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 status: e.target.value,
//               }))
//             }
//           >
//             <MenuItem value="submitted">Submitted</MenuItem>
//             <MenuItem value="under_review">
//               Under Review
//             </MenuItem>
//             <MenuItem value="approved">Approved</MenuItem>
//             <MenuItem value="settled">Settled</MenuItem>
//             <MenuItem value="rejected">Rejected</MenuItem>
//           </TextField>

//           {/* APPROVED AMOUNT */}
//           {(formData.status === "approved" ||
//             formData.status === "settled") && (
//             <TextField
//               type="number"
//               label="Approved Amount"
//               value={formData.approvedAmount}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   approvedAmount: e.target.value,
//                 }))
//               }
//             />
//           )}

//           {/* COMMENTS */}
//           <TextField
//             label="Comments"
//             multiline
//             rows={3}
//             value={formData.comments}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 comments: e.target.value,
//               }))
//             }
//           />

//           {error && <Alert severity="error">{error}</Alert>}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ p: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           sx={{ background: HEADER_GRADIENT }}
//         >
//           {loading ? (
//             <CircularProgress size={20} />
//           ) : (
//             "Update Status"
//           )}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditClaim;


import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Box,
  InputAdornment,
  FormHelperText,
  Paper,
  Grid,  
} from "@mui/material";

import {
  Close as CloseIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Info as InfoIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Comment as CommentIcon,
  History as HistoryIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

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

// Status color mapping
const STATUS_COLORS = {
  submitted: { bg: COLORS.status.info, color: COLORS.primaryDark, icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'Submitted' },
  under_review: { bg: COLORS.status.warning, color: '#92400E', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'Under Review' },
  approved: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Approved' },
  settled: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Settled' },
  rejected: { bg: COLORS.status.error, color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} />, label: 'Rejected' }
};

const EditClaim = ({ open, onClose, onSuccess, claimData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    status: "",
    approvedAmount: "",
    comments: "",
  });

  useEffect(() => {
    if (claimData) {
      setFormData({
        status: claimData.status || "",
        approvedAmount: claimData.approvedAmount || "",
        comments: "",
      });
    }
  }, [claimData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'status' && !formData.status) {
      setFieldErrors(prev => ({ ...prev, status: 'Status is required' }));
    }
    if ((field === 'approvedAmount' && (formData.status === 'approved' || formData.status === 'settled')) && !formData.approvedAmount) {
      setFieldErrors(prev => ({ ...prev, approvedAmount: 'Approved amount is required' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.status) {
      errors.status = "Status is required";
      isValid = false;
    }

    if (formData.status === "approved" || formData.status === "settled") {
      if (!formData.approvedAmount) {
        errors.approvedAmount = "Approved amount is required";
        isValid = false;
      } else if (Number(formData.approvedAmount) > Number(claimData.claimedAmount)) {
        errors.approvedAmount = "Approved amount cannot exceed claimed amount";
        isValid = false;
      } else if (Number(formData.approvedAmount) <= 0) {
        errors.approvedAmount = "Approved amount must be greater than 0";
        isValid = false;
      }
    }

    setFieldErrors(errors);
    if (!isValid) setError("Please fix the errors");
    else setError("");
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const payload = {
        status: formData.status,
        comments: formData.comments,
      };

      if (formData.status === "approved" || formData.status === "settled") {
        payload.approvedAmount = Number(formData.approvedAmount);
      }

      const res = await axios.put(
        `${BASE_URL}/api/mediclaim/claims/${claimData._id}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        onSuccess && onSuccess();
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setError(res.data.message || "Failed to update claim");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update claim");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    return STATUS_COLORS[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <InfoIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Unknown' };
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const currentStatusStyle = claimData ? getStatusStyle(claimData.status) : null;

  const inputStyle = {
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
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const getErrorProps = (field) => {
    const hasError = touched[field] && fieldErrors[field];
    return { error: !!hasError, helperText: hasError || '' };
  };

  const statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'settled', label: 'Settled' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
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
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <EditIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
    <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
      Update Claim Status
    </Typography>
    {claimData && (
      <Chip
        label={claimData.claimId}
        size="small"
        sx={{ 
          bgcolor: COLORS.primaryLight, 
          color: COLORS.primaryDark, 
          fontWeight: 500, 
          fontSize: '0.65rem', 
          height: 24 
        }}
      />
    )}
  </Box>
  <IconButton onClick={onClose} size="small">
    <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
  </IconButton>
</DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Claim Info Card */}
          {claimData && (
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.primary}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                Claim Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HospitalIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Box>
                      <Typography sx={labelStyle}>Hospital</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {claimData.hospitalName || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Box>
                      <Typography sx={labelStyle}>Patient</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {claimData.patientDetails?.name || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Box>
                      <Typography sx={labelStyle}>Claimed Amount</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {formatCurrency(claimData.claimedAmount)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Box>
                      <Typography sx={labelStyle}>Current Status</Typography>
                      <Chip
                        icon={currentStatusStyle?.icon}
                        label={currentStatusStyle?.label}
                        size="small"
                        sx={{
                          bgcolor: currentStatusStyle?.bg,
                          color: currentStatusStyle?.color,
                          fontWeight: 500,
                          fontSize: '0.65rem',
                          height: 24,
                          '& .MuiChip-icon': { fontSize: '0.7rem', color: currentStatusStyle?.color },
                          '& .MuiChip-label': { px: 1, fontSize: '0.65rem' }
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Status Selection */}
          <Box>
            <Typography sx={labelStyle}>Status *</Typography>
            <TextField
              select
              fullWidth
              name="status"
              size="small"
              value={formData.status}
              onChange={handleChange}
              onBlur={() => handleBlur('status')}
              error={touched.status && !!fieldErrors.status}
              helperText={touched.status ? fieldErrors.status : ''}
              sx={inputStyle}
            >
              <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select status</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {STATUS_COLORS[option.value]?.icon}
                    <Typography sx={{ fontSize: '0.75rem' }}>{option.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Approved Amount */}
          {(formData.status === "approved" || formData.status === "settled") && (
            <Box>
              <Typography sx={labelStyle}>Approved Amount *</Typography>
              <TextField
                type="number"
                fullWidth
                name="approvedAmount"
                size="small"
                value={formData.approvedAmount}
                onChange={handleChange}
                onBlur={() => handleBlur('approvedAmount')}
                error={touched.approvedAmount && !!fieldErrors.approvedAmount}
                helperText={touched.approvedAmount ? fieldErrors.approvedAmount : `Max: ${formatCurrency(claimData?.claimedAmount)}`}
                sx={inputStyle}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  inputProps: { min: 0, max: claimData?.claimedAmount }
                }}
              />
            </Box>
          )}

          {/* Comments */}
          <Box>
            <Typography sx={labelStyle}>Comments</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="comments"
              size="small"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Add your comments about this status change..."
              sx={inputStyle}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
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
          onClick={onClose}
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
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClaim;