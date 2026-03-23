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
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import { CheckCircle as ApproveIcon } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const ApproveTermination = ({
//   open,
//   onClose,
//   termination,
//   onApprove,
// }) => {
//   const [comments, setComments] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   if (!termination) return null;

//   const handleApprove = async () => {
//     if (!comments.trim())
//       return setError("Approval comments are required");

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         `${BASE_URL}/api/terminations/${termination.terminationId}/approve`,
//         { comments },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         onApprove(response.data.data);
//         onClose();
//         setComments("");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to approve termination"
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
//         sx: {
//           borderRadius: 3,
//           overflow: "hidden",
//         },
//       }}
//     >
//       {/* HEADER */}
//       <DialogTitle
//         sx={{
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           fontWeight: 700,
//           fontSize: 20,
//           py: 2,
//           px: 3,
//         }}
//       >
//         Approve Termination
//       </DialogTitle>

//       <DialogContent sx={{ p: 3, margin: 2 }}>
//         <Stack spacing={3}>
//           {/* Termination Info */}
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

//           <Box>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//             >
//               Employee
//             </Typography>
//             <Typography fontWeight={600}>
//               {termination.employeeId?.FirstName}{" "}
//               {termination.employeeId?.LastName}
//             </Typography>
//           </Box>

//           {/* Comments Field */}
//           <TextField
//             label="Approval Comments"
//             multiline
//             rows={4}
//             fullWidth
//             value={comments}
//             onChange={(e) =>
//               setComments(e.target.value)
//             }
//             placeholder="Enter approval remarks..."
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
//           onClick={handleApprove}
//           disabled={loading}
//           startIcon={
//             !loading ? (
//               <ApproveIcon />
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
//           {loading ? "Approving..." : "Approve"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ApproveTermination;


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
  CircularProgress,
  Box,
} from "@mui/material";
import { CheckCircle as ApproveIcon, Close as CloseIcon } from "@mui/icons-material";
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

const ApproveTermination = ({
  open,
  onClose,
  termination,
  onApprove,
}) => {
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!termination) return null;

  const handleApprove = async () => {
    if (!comments.trim()) {
      setError("Approval comments are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/terminations/${termination.terminationId}/approve`,
        { comments: comments.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        onApprove(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || "Failed to approve termination");
      }
    } catch (err) {
      console.error("Error approving termination:", err);
      setError(
        err.response?.data?.message || "Failed to approve termination. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setComments("");
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
          Approve Termination
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
          {/* Termination Info */}
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
                  EMPLOYEE
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
                  {termination.employeeId?.FirstName} {termination.employeeId?.LastName}
                </Typography>
              </Box>
            </Box>

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
                  TERMINATION TYPE
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
                  {termination.terminationType || "-"}
                </Typography>
              </Box>
            </Box>

            {/* Comments Field */}
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
                  APPROVAL COMMENTS <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  disabled={loading}
                  placeholder="Enter approval remarks..."
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
          onClick={handleApprove}
          disabled={loading || !comments.trim()}
          startIcon={loading ? null : <ApproveIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Approving...' : 'Approve'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveTermination;