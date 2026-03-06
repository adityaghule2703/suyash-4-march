// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert
// } from '@mui/material';
// import { Edit as EditIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const EditDesignations = ({ open, onClose, designation, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     DesignationName: '',
//     Level: '',
//     Description: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({
//     DesignationName: '',
//     Level: '',
//     Description: ''
//   });

//   useEffect(() => {
//     if (designation) {
//       setFormData({
//         DesignationName: designation.DesignationName || '',
//         Level: designation.Level ? designation.Level.toString() : '',
//         Description: designation.Description || ''
//       });
//       // Clear errors when opening with new designation
//       setError('');
//       setFieldErrors({
//         DesignationName: '',
//         Level: '',
//         Description: ''
//       });
//     }
//   }, [designation]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'Level' ? value : value
//     }));
//     // Clear field-specific error when user starts typing
//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//     // Clear general error when user makes changes
//     if (error) {
//       setError('');
//     }
//   };

//   const validateForm = () => {
//     const newFieldErrors = {};
//     let isValid = true;

//     if (!formData.DesignationName.trim()) {
//       newFieldErrors.DesignationName = 'Designation name is required';
//       isValid = false;
//     } else if (formData.DesignationName.trim().length < 2) {
//       newFieldErrors.DesignationName = 'Designation name must be at least 2 characters';
//       isValid = false;
//     }

//     if (!formData.Level.trim()) {
//       newFieldErrors.Level = 'Level is required';
//       isValid = false;
//     } else {
//       const levelNum = parseInt(formData.Level, 10);
//       if (isNaN(levelNum) || levelNum < 1) {
//         newFieldErrors.Level = 'Level must be a positive number';
//         isValid = false;
//       }
//     }

//     setFieldErrors(newFieldErrors);
//     return isValid;
//   };

//   const handleSubmit = async () => {
//     // Clear previous errors
//     setError('');
//     setFieldErrors({
//       DesignationName: '',
//       Level: '',
//       Description: ''
//     });

//     // Validate form
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       const levelNum = parseInt(formData.Level, 10);
      
//       const response = await axios.put(`${BASE_URL}/api/designations/${designation._id}`, {
//         DesignationName: formData.DesignationName.trim(),
//         Level: levelNum,
//         Description: formData.Description.trim() || ''
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         onUpdate(response.data.data);
//         onClose();
//       } else {
//         // Handle server-side validation errors
//         setError(response.data.message || 'Failed to update designation');
//       }
//     } catch (err) {
//       console.error('Error updating designation:', err);
      
//       // Handle different types of errors
//       if (err.response) {
//         // Server responded with error status
//         const serverError = err.response.data;
        
//         // Check if it's a Mongoose validation error
//         if (serverError.error && serverError.error.name === 'ValidationError') {
//           // Handle mongoose validation errors
//           const validationErrors = serverError.error.errors;
//           const newFieldErrors = {};
          
//           Object.keys(validationErrors).forEach(key => {
//             if (key === 'Level' || key === 'DesignationName' || key === 'Description') {
//               newFieldErrors[key] = validationErrors[key].message;
//             }
//           });
          
//           setFieldErrors(newFieldErrors);
//         } 
//         // Check for the specific Level maximum error
//         else if (serverError.message && serverError.message.includes('Level') && 
//                  serverError.message.includes('maximum allowed value')) {
//           setFieldErrors(prev => ({
//             ...prev,
//             Level: serverError.message
//           }));
//         }
//         // Handle other server messages
//         else {
//           setError(serverError.message || serverError.error || 'Failed to update designation');
//         }
//       } else if (err.request) {
//         // Request was made but no response
//         setError('Network error. Please check your connection and try again.');
//       } else {
//         // Something else happened
//         setError('An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to get error message for a field
//   const getFieldError = (fieldName) => {
//     return fieldErrors[fieldName];
//   };

//   // Helper function to check if a field has error
//   const hasFieldError = (fieldName) => {
//     return !!fieldErrors[fieldName];
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose} 
//       maxWidth="sm" 
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 2 }
//       }}
//     >
//       <DialogTitle sx={{ 
//         borderBottom: '1px solid #E0E0E0', 
//         pb: 2,
//         backgroundColor: '#F8FAFC'
//       }}>
//         <div style={{ 
//           fontSize: '20px', 
//           fontWeight: '600', 
//           color: '#101010',
//           paddingTop: '8px'
//         }}>
//           Edit Designation
//         </div>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={3}>
//           {/* Add padding from top for the first field */}
//           <div style={{ marginTop: '16px' }}>
//             <TextField
//               fullWidth
//               label="Designation Name"
//               name="DesignationName"
//               value={formData.DesignationName}
//               onChange={handleChange}
//               required
//               error={hasFieldError('DesignationName')}
//               helperText={getFieldError('DesignationName')}
//               disabled={loading}
//               size="medium"
//               variant="outlined"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1,
//                 }
//               }}
//             />
//           </div>
          
//           <TextField
//             fullWidth
//             label="Level"
//             name="Level"
//             value={formData.Level}
//             onChange={handleChange}
//             required
//             type="number"
//             inputProps={{ 
//               min: 1,
//               max: 99,
//               step: 1
//             }}
//             error={hasFieldError('Level')}
//             helperText={getFieldError('Level') || 'Enter a number (e.g., 1, 2, 3)'}
//             disabled={loading}
//             size="medium"
//             variant="outlined"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 1,
//               }
//             }}
//           />
          
//           <TextField
//             fullWidth
//             label="Description"
//             name="Description"
//             value={formData.Description}
//             onChange={handleChange}
//             multiline
//             rows={4}
//             error={hasFieldError('Description')}
//             helperText={getFieldError('Description')}
//             disabled={loading}
//             size="medium"
//             variant="outlined"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 1,
//               }
//             }}
//           />
          
//           {/* Display general error message if exists */}
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 borderRadius: 1,
//                 '& .MuiAlert-icon': {
//                   alignItems: 'center'
//                 }
//               }}
//               onClose={() => setError('')}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         px: 3, 
//         pb: 3, 
//         borderTop: '1px solid #E0E0E0', 
//         pt: 2,
//         backgroundColor: '#F8FAFC'
//       }}>
//         <Button 
//           onClick={onClose} 
//           disabled={loading}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? null : <EditIcon />}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500,
//             backgroundColor: '#1976D2',
//             '&:hover': {
//               backgroundColor: '#1565C0'
//             }
//           }}
//         >
//           {loading ? 'Updating...' : 'Update Designation'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditDesignations;

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
  Paper,
  Typography,
  IconButton
} from "@mui/material";
import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

const EditDesignations = ({ open, onClose, designation, onUpdate }) => {
  const [formData, setFormData] = useState({
    DesignationName: "",
    Level: "",
    Description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    DesignationName: "",
    Level: "",
    Description: ""
  });

  useEffect(() => {
    if (designation) {
      setFormData({
        DesignationName: designation.DesignationName || "",
        Level: designation.Level ? designation.Level.toString() : "",
        Description: designation.Description || ""
      });

      setError("");
      setFieldErrors({
        DesignationName: "",
        Level: "",
        Description: ""
      });
    }
  }, [designation]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }

    if (error) setError("");
  };

  const validateForm = () => {
    const newFieldErrors = {};
    let isValid = true;

    if (!formData.DesignationName.trim()) {
      newFieldErrors.DesignationName = "Designation name is required";
      isValid = false;
    } else if (formData.DesignationName.trim().length < 2) {
      newFieldErrors.DesignationName =
        "Designation name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.Level.trim()) {
      newFieldErrors.Level = "Level is required";
      isValid = false;
    } else {
      const levelNum = parseInt(formData.Level, 10);
      if (isNaN(levelNum) || levelNum < 1) {
        newFieldErrors.Level = "Level must be a positive number";
        isValid = false;
      }
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setError("");

    setFieldErrors({
      DesignationName: "",
      Level: "",
      Description: ""
    });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/designations/${designation._id}`,
        {
          DesignationName: formData.DesignationName.trim(),
          Level: parseInt(formData.Level, 10),
          Description: formData.Description.trim() || ""
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || "Failed to update designation");
      }
    } catch (err) {
      console.error("Error updating designation:", err);

      if (err.response) {
        const serverError = err.response.data;

        if (
          serverError.error &&
          serverError.error.name === "ValidationError"
        ) {
          const validationErrors = serverError.error.errors;
          const newFieldErrors = {};

          Object.keys(validationErrors).forEach((key) => {
            if (
              key === "Level" ||
              key === "DesignationName" ||
              key === "Description"
            ) {
              newFieldErrors[key] = validationErrors[key].message;
            }
          });

          setFieldErrors(newFieldErrors);
        } else {
          setError(
            serverError.message ||
              serverError.error ||
              "Failed to update designation"
          );
        }
      } else if (err.request) {
        setError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field) => fieldErrors[field];
  const hasFieldError = (field) => !!fieldErrors[field];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: 22,
          color: "#fff",
          px: 3,
          py: 1.5,
          background: HEADER_GRADIENT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Edit Designation

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e2e8f0"
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#2563EB"
              }}
            >
              Basic Information
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Designation Name"
                name="DesignationName"
                value={formData.DesignationName}
                onChange={handleChange}
                required
                error={hasFieldError("DesignationName")}
                helperText={getFieldError("DesignationName")}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    background: "#f8fafc"
                  }
                }}
              />

              <TextField
                fullWidth
                label="Level"
                name="Level"
                type="number"
                value={formData.Level}
                onChange={handleChange}
                inputProps={{ min: 1, max: 99 }}
                required
                error={hasFieldError("Level")}
                helperText={
                  getFieldError("Level") ||
                  "Enter a number (e.g., 1, 2, 3)"
                }
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    background: "#f8fafc"
                  }
                }}
              />

              <TextField
                fullWidth
                label="Description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                multiline
                rows={4}
                error={hasFieldError("Description")}
                helperText={getFieldError("Description")}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    background: "#f8fafc"
                  }
                }}
              />
            </Stack>
          </Paper>

          {error && (
            <Alert
              severity="error"
              sx={{ borderRadius: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 3,
          pb: 1.5,
          pt: 1.5,
          borderTop: "1px solid #e2e8f0",
          background: "#f8fafc"
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 500
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? null : <EditIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 1.5,
            px: 3,
            background: HEADER_GRADIENT,
            "&:hover": {
              opacity: 0.9,
              background: HEADER_GRADIENT
            }
          }}
        >
          {loading ? "Updating..." : "Update Designation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDesignations;