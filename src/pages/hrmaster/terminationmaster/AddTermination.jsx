// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   MenuItem,
//   CircularProgress,
//   Grid,
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const AddTermination = ({ open, onClose, onAdd }) => {
//   const [employees, setEmployees] = useState([]);
//   const [employeeLoading, setEmployeeLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     employeeId: "",
//     reason: "",
//     lastWorkingDay: null,
//     terminationType: "termination",
//     initiatorType: "HR",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   /* ---------------- Fetch Employees ---------------- */
//   useEffect(() => {
//     if (open) fetchEmployees();
//   }, [open]);

//   const fetchEmployees = async () => {
//     try {
//       setEmployeeLoading(true);
//       const token = localStorage.getItem("token");

//       const response = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         setEmployees(response.data.data || []);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setEmployeeLoading(false);
//     }
//   };

//   /* ---------------- Handle Change ---------------- */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   /* ---------------- Submit ---------------- */
//   const handleSubmit = async () => {
//     if (!formData.employeeId) return setError("Employee is required");
//     if (!formData.reason) return setError("Reason is required");
//     if (!formData.lastWorkingDay)
//       return setError("Last Working Day is required");

//     setLoading(true);
//     setError("");

//     const payload = {
//       employeeId: formData.employeeId,
//       reason: formData.reason,
//       lastWorkingDay: formData.lastWorkingDay.toISOString().split("T")[0],
//       terminationType: formData.terminationType,
//       initiatorType: formData.initiatorType,
//     };

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         `${BASE_URL}/api/terminations/initiate`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         onAdd(response.data.data);
//         onClose();
//         setFormData({
//           employeeId: "",
//           reason: "",
//           lastWorkingDay: null,
//           terminationType: "termination",
//           initiatorType: "HR",
//         });
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to initiate termination"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       {/* Gradient Header */}
//       <DialogTitle
//         sx={{
//           background: "linear-gradient(135deg, #164e63, #00B4D8)",
//           color: "#fff",
//           fontWeight: 600,
//           fontSize: "20px",
//         }}
//       >
//         Initiate Termination
//       </DialogTitle>

//       <DialogContent sx={{ pt: 4, margin: 2 }}>
//         <Stack spacing={3}>
//           {/* Employee Dropdown */}
//           <TextField
//             select
//             label="Employee"
//             name="employeeId"
//             value={formData.employeeId}
//             onChange={handleChange}
//             fullWidth
//           >
//             {employeeLoading ? (
//               <MenuItem disabled>
//                 <CircularProgress size={18} sx={{ mr: 1 }} />
//                 Loading...
//               </MenuItem>
//             ) : (
//               employees.map((emp) => (
//                 <MenuItem key={emp._id} value={emp._id}>
//                   {emp.FirstName} {emp.LastName}
//                 </MenuItem>
//               ))
//             )}
//           </TextField>

//           {/* Termination Type */}
//           <TextField
//             select
//             label="Termination Type"
//             name="terminationType"
//             value={formData.terminationType}
//             onChange={handleChange}
//             fullWidth
//           >
//             <MenuItem value="termination">Termination</MenuItem>
//             <MenuItem value="resignation">Resignation</MenuItem>
//             <MenuItem value="retirement">Retirement</MenuItem>
//           </TextField>

//           {/* Initiator Type */}
//           <TextField
//             select
//             label="Initiated By"
//             name="initiatorType"
//             value={formData.initiatorType}
//             onChange={handleChange}
//             fullWidth
//           >
//             <MenuItem value="HR">HR</MenuItem>
//             <MenuItem value="Employee">Employee</MenuItem>
//           </TextField>

//           {/* Last Working Day */}
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Last Working Day"
//               value={formData.lastWorkingDay}
//               onChange={(newValue) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   lastWorkingDay: newValue,
//                 }))
//               }
//               renderInput={(params) => (
//                 <TextField {...params} fullWidth />
//               )}
//             />
//           </LocalizationProvider>

//           {/* Reason */}
//           <TextField
//             label="Reason"
//             name="reason"
//             multiline
//             rows={3}
//             value={formData.reason}
//             onChange={handleChange}
//             fullWidth
//           />

//           {error && <Alert severity="error">{error}</Alert>}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={!loading && <AddIcon />}
//           sx={{
//             background: "linear-gradient(135deg, #164e63, #00B4D8)",
//             "&:hover": { opacity: 0.9 },
//           }}
//         >
//           {loading ? "Submitting..." : "Initiate"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddTermination;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
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

const AddTermination = ({ open, onClose, onAdd }) => {
  const [employees, setEmployees] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    reason: "",
    lastWorkingDay: null,
    terminationType: "termination",
    initiatorType: "HR",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Termination Type options
  const terminationTypeOptions = [
    { value: 'termination', label: 'Termination' },
    { value: 'resignation', label: 'Resignation' },
    { value: 'retirement', label: 'Retirement' }
  ];

  // Initiator Type options
  const initiatorTypeOptions = [
    { value: 'HR', label: 'HR' },
    { value: 'Employee', label: 'Employee' }
  ];

  /* ---------------- Fetch Employees ---------------- */
  useEffect(() => {
    if (open) fetchEmployees();
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setEmployeeLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEmployeeLoading(false);
    }
  };

  /* ---------------- Handle Change ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    // Validation
    if (!formData.employeeId) {
      setError("Employee is required");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Reason is required");
      return;
    }

    if (!formData.lastWorkingDay) {
      setError("Last Working Day is required");
      return;
    }

    // Validate that last working day is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.lastWorkingDay);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError("Last Working Day cannot be in the past");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      employeeId: formData.employeeId,
      reason: formData.reason.trim(),
      lastWorkingDay: formData.lastWorkingDay.toISOString().split("T")[0],
      terminationType: formData.terminationType,
      initiatorType: formData.initiatorType,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/terminations/initiate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || "Failed to initiate termination");
      }
    } catch (err) {
      console.error("Error initiating termination:", err);
      setError(
        err.response?.data?.message || "Failed to initiate termination. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      reason: "",
      lastWorkingDay: null,
      terminationType: "termination",
      initiatorType: "HR",
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
          Initiate Termination
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Employee Field */}
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
                <TextField
                  select
                  fullWidth
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  disabled={loading || employeeLoading}
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
                  {employeeLoading ? (
                    <MenuItem disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={14} />
                        <Typography sx={{ fontSize: '0.75rem' }}>Loading employees...</Typography>
                      </Box>
                    </MenuItem>
                  ) : employees.length === 0 ? (
                    <MenuItem disabled>
                      <Typography sx={{ fontSize: '0.75rem' }}>No employees found</Typography>
                    </MenuItem>
                  ) : (
                    employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: '0.75rem' }}>
                        {emp.FirstName} {emp.LastName}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Box>
            </Box>

            {/* Termination Type Field */}
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
                  TERMINATION TYPE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="terminationType"
                  value={formData.terminationType}
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
                  {terminationTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Initiator Type Field */}
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
                  INITIATED BY <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="initiatorType"
                  value={formData.initiatorType}
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
                  {initiatorTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Last Working Day Field */}
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
                  LAST WORKING DAY <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={formData.lastWorkingDay}
                    onChange={(newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastWorkingDay: newValue,
                      }))
                    }
                    disabled={loading}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: {
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
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  Cannot be a past date
                </Typography>
              </Box>
            </Box>

            {/* Reason Field */}
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
                  REASON <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  disabled={loading}
                  placeholder="Enter termination reason..."
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
          disabled={loading || !formData.employeeId || !formData.reason.trim() || !formData.lastWorkingDay}
          startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Initiating...' : 'Initiate Termination'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTermination;
