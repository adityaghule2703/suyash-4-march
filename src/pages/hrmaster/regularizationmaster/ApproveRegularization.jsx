// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   MenuItem,
//   Alert,
//   Typography
// } from "@mui/material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const ApproveRegularization = ({ open, onClose, record, onUpdate }) => {
//   const [status, setStatus] = useState("Approved");
//   const [remarks, setRemarks] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (open) {
//       setStatus("Approved");
//       setRemarks("");
//       setError("");
//     }
//   }, [open]);

//   const handleSubmit = async () => {
//     if (!remarks.trim()) {
//       return setError("Remarks are required");
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.put(
//         `${BASE_URL}/api/regularization/${record._id}/status`,
//         {
//           status,
//           remarks
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data?.success) {

//         const updatedRecord =
//           response.data.data || {
//             ...record,
//             Status: status,
//             ApprovalRemarks: remarks
//           };

//         onUpdate(updatedRecord);   // 🔥 Snackbar master madhe show hoil
//         onClose();
//       } else {
//         setError(response.data?.message || "Update failed");
//       }

//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         "Internal server error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!record) return null;

//   return (
//     <Dialog open={open} onClose={loading ? null : onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Approve / Reject Regularization</DialogTitle>

//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={3}>

//           <Typography variant="body2" color="text.secondary">
//             Request Date: {new Date(record.Date).toLocaleDateString()}
//           </Typography>

//           <TextField
//             select
//             label="Status"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             fullWidth
//             disabled={loading}
//           >
//             <MenuItem value="Approved">Approve</MenuItem>
//             <MenuItem value="Rejected">Reject</MenuItem>
//           </TextField>

//           <TextField
//             label="Remarks"
//             multiline
//             rows={3}
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             fullWidth
//             required
//             disabled={loading}
//           />

//           {error && <Alert severity="error">{error}</Alert>}

//         </Stack>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           sx={{
//             backgroundColor:
//               status === "Approved" ? "#2E7D32" : "#D32F2F"
//           }}
//         >
//           {loading
//             ? "Updating..."
//             : status === "Approved"
//             ? "Approve"
//             : "Reject"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ApproveRegularization;


import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, MenuItem,
  Alert, Typography, Box, CircularProgress
} from "@mui/material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// 🎨 SAME DESIGN SYSTEM
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8"
  },
  border: "#E3E8EF",
  background: {
    white: "#FFFFFF"
  }
};

const ApproveRegularization = ({ open, onClose, record, onUpdate }) => {
  const [status, setStatus] = useState("Approved");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStatus("Approved");
      setRemarks("");
      setError("");
    }
  }, [open]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!remarks.trim()) return "Remarks are required";
    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/regularization/${record._id}/status`,
        { status, remarks },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {
        const updatedRecord =
          response.data.data || {
            ...record,
            Status: status,
            ApprovalRemarks: remarks
          };

        onUpdate(updatedRecord);
        handleClose();
      } else {
        setError("Update failed");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Internal server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setStatus("Approved");
    setRemarks("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!record) return null;

  /* ================= COMMON STYLES ================= */
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      fontSize: "0.75rem",
      "&:hover fieldset": { borderColor: COLORS.primary },
      "&.Mui-focused fieldset": {
        borderColor: COLORS.primary,
        borderWidth: 1
      }
    },
    "& .MuiInputBase-input": {
      py: 1,
      px: 1.5,
      fontSize: "0.75rem",
      color: COLORS.text.primary,
      "&::placeholder": {
        color: COLORS.text.tertiary
      }
    }
  };

  const labelStyle = {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: "0.5px"
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden"
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        px: 2.5,
        py: 1.5,
        mb: 1.5,
      }}>
        <Typography sx={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: COLORS.text.primary
        }}>
          Approve Request
        </Typography>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>

          {/* DATE */}
          <Box>
            <Typography sx={labelStyle}>REQUEST DATE</Typography>
            <Typography sx={{ fontSize: "0.8rem", color: COLORS.text.primary }}>
              {new Date(record.Date).toLocaleDateString()}
            </Typography>
          </Box>

          {/* STATUS */}
          <Box>
            <Typography sx={labelStyle}>STATUS</Typography>
            <TextField
              select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              size="small"
              disabled={loading}
              sx={inputStyle}
            >
              <MenuItem value="Approved">Approve</MenuItem>
              <MenuItem value="Rejected">Reject</MenuItem>
            </TextField>
          </Box>

          {/* REMARKS */}
          <Box>
            <Typography sx={labelStyle}>
              REMARKS <span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <TextField
              multiline
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
              fullWidth
              size="small"
              disabled={loading}
              sx={inputStyle}
            />
          </Box>

          {error && (
            <Alert sx={{ fontSize: "0.75rem" }} severity="error">
              {error}
            </Alert>
          )}

        </Stack>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
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
            fontSize: "0.7rem",
            textTransform: "none",
            "&:hover": {
              borderColor: COLORS.primary,
              backgroundColor: `${COLORS.primary}10`
            }
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            fontSize: "0.7rem",
            bgcolor:
              status === "Approved" ? "#16A34A" : "#DC2626",
            "&:hover": {
              bgcolor:
                status === "Approved" ? "#15803D" : "#B91C1C"
            }
          }}
        >
          {loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : status === "Approved" ? "Approve" : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveRegularization;