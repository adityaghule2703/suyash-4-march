// import React from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   Chip,
//   Divider
// } from '@mui/material';
// import { Edit as EditIcon } from '@mui/icons-material';

// const ViewDesignations = ({ open, onClose, designation, onEdit }) => {
//   if (!designation) return null;

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getLevelColor = (level) => {
//     if (level <= 2) return 'success';
//     if (level <= 4) return 'info';
//     if (level <= 6) return 'warning';
//     return 'error';
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
//           Designation Details
//         </div>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={3}>
//           {/* Add padding from top for the first field */}
//           <div style={{ marginTop: '16px' }}>
//             <Stack spacing={1}>
//               <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                 Designation Name
//               </Typography>
//               <Typography variant="body1" fontWeight={500} sx={{ fontSize: '1rem' }}>
//                 {designation.DesignationName}
//               </Typography>
//             </Stack>
//           </div>
          
//           <Divider />
          
//           <Stack spacing={2}>
//             <Stack spacing={1}>
//               <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                 Level
//               </Typography>
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <Chip
//                   label={`Level ${designation.Level}`}
//                   color={getLevelColor(designation.Level)}
//                   size="small"
//                   sx={{ 
//                     fontWeight: 500,
//                     '&.MuiChip-colorSuccess': {
//                       bgcolor: '#E8F5E9',
//                       color: '#2E7D32'
//                     },
//                     '&.MuiChip-colorInfo': {
//                       bgcolor: '#E3F2FD',
//                       color: '#1565C0'
//                     },
//                     '&.MuiChip-colorWarning': {
//                       bgcolor: '#FFF3E0',
//                       color: '#F57C00'
//                     },
//                     '&.MuiChip-colorError': {
//                       bgcolor: '#FFEBEE',
//                       color: '#D32F2F'
//                     }
//                   }}
//                 />
//               </Stack>
//             </Stack>
            
//             <Stack spacing={1}>
//               <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                 Description
//               </Typography>
//               <Typography variant="body1" color="textPrimary" sx={{ 
//                 fontSize: '0.875rem',
//                 backgroundColor: '#F8FAFC',
//                 p: 2,
//                 borderRadius: 1,
//                 minHeight: '80px'
//               }}>
//                 {designation.Description || 'No description provided'}
//               </Typography>
//             </Stack>
//           </Stack>
          
//           <Divider />
          
//           <Stack spacing={2}>
//             <Stack spacing={1}>
//               <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                 Created At
//               </Typography>
//               <Typography variant="body2" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
//                 {formatDate(designation.CreatedAt)}
//               </Typography>
//             </Stack>
            
//             <Stack spacing={1}>
//               <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                 Last Updated
//               </Typography>
//               <Typography variant="body2" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
//                 {formatDate(designation.UpdatedAt)}
//               </Typography>
//             </Stack>
//           </Stack>
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
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500
//           }}
//         >
//           Close
//         </Button>
       
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewDesignations;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  Chip,
  Box,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

const ViewDesignations = ({ open, onClose, designation }) => {
  if (!designation) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getLevelColor = (level) => {
    if (level <= 2) return "success";
    if (level <= 4) return "info";
    if (level <= 6) return "warning";
    return "error";
  };

  const Field = ({ label, value }) => (
    <Box>
      <Typography
        sx={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#475569",
          mb: 0.8
        }}
      >
        {label}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          px: 1.5,
          py: 1.2,
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          background: "#f8fafc",
          fontSize: "0.9rem",
          color: "#1e293b",
          minHeight: 44,
          display: "flex",
          alignItems: "center"
        }}
      >
        {value || "-"}
      </Paper>
    </Box>
  );

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
          fontSize: 18,
          color: "#fff",
          px: 3,
          py: 1.8,
          background: HEADER_GRADIENT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Designation Details

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Typography
          sx={{
            fontWeight: 600,
            mb: 2,
            fontSize: "1rem",
            color: "#1e293b"
          }}
        >
          Basic Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Designation Name */}
          <Grid item xs={12}>
            <Field
              label="Designation Name"
              value={designation.DesignationName}
            />
          </Grid>

          {/* Level */}
          <Grid item xs={12}>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#475569",
                  mb: 0.8
                }}
              >
                Level
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  px: 1.5,
                  py: 1.2,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  minHeight: 44,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Chip
                  label={`Level ${designation.Level}`}
                  color={getLevelColor(designation.Level)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Paper>
            </Box>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Field
              label="Description"
              value={
                designation.Description || "No description provided"
              }
            />
          </Grid>

          {/* Created & Updated in 2 columns */}
          <Grid item xs={12} sm={6}>
            <Field
              label="Created At"
              value={formatDateTime(designation.CreatedAt)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field
              label="Last Updated"
              value={formatDate(designation.UpdatedAt)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e2e8f0",
          background: "#f8fafc"
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 4,
            background: HEADER_GRADIENT,
            "&:hover": {
              opacity: 0.9,
              background: HEADER_GRADIENT
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDesignations;