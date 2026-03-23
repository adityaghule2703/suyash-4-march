// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Grid,
//   Chip,
//   Paper,
//   Divider,
//   Box,
// } from "@mui/material";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const ViewTermination = ({ open, onClose, termination }) => {
//   if (!termination) return null;

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleDateString("en-IN", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//         })
//       : "-";

//   const formatDateTime = (date) =>
//     date ? new Date(date).toLocaleString("en-IN") : "-";

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return "success";
//       case "rejected":
//         return "error";
//       case "completed":
//         return "info";
//       default:
//         return "warning";
//     }
//   };

//   const employee = termination.employeeId || {};

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           overflow: "hidden",
//           boxShadow:
//             "0 25px 50px -12px rgba(0,0,0,0.25)",
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
//         Termination Details
//       </DialogTitle>

//       <DialogContent sx={{ p: 3, bgcolor: "#F4F6F8" }}>
//         {/* EMPLOYEE INFO */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             mb: 2,
//             borderRadius: 3,
//             border: "1px solid #E5E7EB",
//           }}
//         >
//           <Typography
//             variant="subtitle1"
//             fontWeight={700}
//             sx={{ mb: 2, color: "#7f1d1d" }}
//           >
//             Employee Information
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Employee Name
//               </Typography>
//               <Typography fontWeight={600}>
//                 {employee.FirstName} {employee.LastName}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Employee ID
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.employeeID}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Email
//               </Typography>
//               <Typography fontWeight={600}>
//                 {employee.Email || "-"}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Phone
//               </Typography>
//               <Typography fontWeight={600}>
//                 {employee.Phone || "-"}
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* TERMINATION DETAILS */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             mb: 2,
//             borderRadius: 3,
//             border: "1px solid #E5E7EB",
//           }}
//         >
//           <Typography
//             variant="subtitle1"
//             fontWeight={700}
//             sx={{ mb: 2, color: "#7f1d1d" }}
//           >
//             Termination Information
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Termination ID
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.terminationId}
//               </Typography>
//             </Grid>

//             <Grid item xs={6} textAlign="right">
//               <Chip
//                 label={termination.status}
//                 color={getStatusColor(termination.status)}
//                 size="small"
//                 sx={{ fontWeight: 600 }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Termination Type
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.terminationType}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Initiated By
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.initiatorType}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Last Working Day
//               </Typography>
//               <Typography fontWeight={600}>
//                 {formatDate(termination.lastWorkingDay)}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="body2" color="text.secondary">
//                 Reason
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.reason}
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* WORKFLOW & DOCUMENTS */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             borderRadius: 3,
//             background: HEADER_GRADIENT,
//             color: "#fff",
//           }}
//         >
//           <Typography
//             variant="subtitle1"
//             fontWeight={700}
//             sx={{ mb: 2 }}
//           >
//             Workflow & Documents
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                 Exit Interview Submitted
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.feedback?.submitted
//                   ? "Yes"
//                   : "No"}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                 Rehire Eligible
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.feedback?.exitInterview
//                   ?.rehireEligible
//                   ? "Yes"
//                   : "No"}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                 Experience Letter
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.documents?.experienceLetter
//                   ?.generated
//                   ? "Generated"
//                   : "Pending"}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                 Relieving Letter
//               </Typography>
//               <Typography fontWeight={600}>
//                 {termination.documents?.relievingLetter
//                   ?.generated
//                   ? "Generated"
//                   : "Pending"}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <Divider
//                 sx={{
//                   my: 2,
//                   borderColor: "rgba(255,255,255,0.3)",
//                 }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                 Created At
//               </Typography>
//               <Typography fontWeight={500}>
//                 {formatDateTime(termination.createdAt)}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                 Updated At
//               </Typography>
//               <Typography fontWeight={500}>
//                 {formatDateTime(termination.updatedAt)}
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>
//       </DialogContent>

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           pt: 2,
//           bgcolor: "#F4F6F8",
//         }}
//       >
//         <Button
//           onClick={onClose}
//           variant="contained"
//           fullWidth
//           sx={{
//             background: HEADER_GRADIENT,
//             py: 1.2,
//             borderRadius: 2,
//             fontWeight: 600,
//             textTransform: "none",
//             fontSize: 15,
//             "&:hover": {
//               opacity: 0.9,
//             },
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewTermination;


// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Grid,
//   Chip,
//   Paper,
//   Divider,
//   Box,
// } from "@mui/material";

// const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const ViewTermination = ({ open, onClose, termination }) => {
//   if (!termination) return null;

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleDateString("en-IN", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//         })
//       : "-";

//   const formatDateTime = (date) =>
//     date ? new Date(date).toLocaleString("en-IN") : "-";

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return "success";
//       case "rejected":
//         return "error";
//       case "completed":
//         return "info";
//       default:
//         return "warning";
//     }
//   };

//   const employee = termination.employeeId || {};

//   const SectionTitle = ({ children }) => (
//     <Typography
//       variant="subtitle1"
//       fontWeight={600}
//       sx={{ mb: 2, color: "#1e293b" }}
//     >
//       {children}
//     </Typography>
//   );

//   const InfoItem = ({ label, value }) => (
//     <Box>
//       <Typography variant="body2" color="text.secondary" gutterBottom>
//         {label}
//       </Typography>
//       <Typography variant="body1" fontWeight={500}>
//         {value || "-"}
//       </Typography>
//     </Box>
//   );

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           overflow: "hidden",
//         },
//       }}
//     >
//       {/* Header */}
//       <DialogTitle
//         sx={{
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           fontWeight: 600,
//           fontSize: 18,
//           py: 2,
//           px: 3,
//         }}
//       >
//         Termination Details
//       </DialogTitle>

//       {/* Content */}
//       <DialogContent sx={{ p: 3 }}>
//         {/* Employee Information */}
//         <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//           <SectionTitle>Employee Information</SectionTitle>
          
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6} md={4}>
//               <InfoItem 
//                 label="Employee Name"
//                 value={`${employee.FirstName || ""} ${employee.LastName || ""}`.trim()}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <InfoItem 
//                 label="Employee ID"
//                 value={termination.employeeID}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <InfoItem 
//                 label="Email"
//                 value={employee.Email}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <InfoItem 
//                 label="Phone"
//                 value={employee.Phone}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Termination Information */}
//         <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <SectionTitle>Termination Information</SectionTitle>
//             <Chip
//               label={termination.status}
//               color={getStatusColor(termination.status)}
//               size="small"
//             />
//           </Box>
          
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6} md={4}>
//               <InfoItem 
//                 label="Termination ID"
//                 value={termination.terminationId}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <InfoItem 
//                 label="Termination Type"
//                 value={termination.terminationType}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <InfoItem 
//                 label="Initiated By"
//                 value={termination.initiatorType}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <InfoItem 
//                 label="Last Working Day"
//                 value={formatDate(termination.lastWorkingDay)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Divider sx={{ my: 1 }} />
//             </Grid>
//             <Grid item xs={12}>
//               <InfoItem 
//                 label="Reason for Termination"
//                 value={termination.reason}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Workflow & Documents */}
//         <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
//           <SectionTitle>Workflow & Documents</SectionTitle>
          
//           <Grid container spacing={3}>
//             <Grid item xs={6} sm={3}>
//               <InfoItem 
//                 label="Exit Interview"
//                 value={termination.feedback?.submitted ? "Submitted" : "Pending"}
//               />
//             </Grid>
//             <Grid item xs={6} sm={3}>
//               <InfoItem 
//                 label="Rehire Eligible"
//                 value={termination.feedback?.exitInterview?.rehireEligible ? "Yes" : "No"}
//               />
//             </Grid>
//             <Grid item xs={6} sm={3}>
//               <InfoItem 
//                 label="Experience Letter"
//                 value={termination.documents?.experienceLetter?.generated ? "Generated" : "Pending"}
//               />
//             </Grid>
//             <Grid item xs={6} sm={3}>
//               <InfoItem 
//                 label="Relieving Letter"
//                 value={termination.documents?.relievingLetter?.generated ? "Generated" : "Pending"}
//               />
//             </Grid>
            
//             <Grid item xs={12}>
//               <Divider sx={{ my: 2 }} />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <InfoItem 
//                 label="Created At"
//                 value={formatDateTime(termination.createdAt)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <InfoItem 
//                 label="Updated At"
//                 value={formatDateTime(termination.updatedAt)}
//               />
//             </Grid>
//           </Grid>
//         </Paper>
//       </DialogContent>

//       {/* Footer */}
//       <DialogActions sx={{ px: 3, pb: 3 }}>
//         <Button
//           onClick={onClose}
//           variant="contained"
//           fullWidth
//           sx={{
//             background: HEADER_GRADIENT,
//             py: 1,
//             textTransform: "none",
//             fontWeight: 500,
//             "&:hover": {
//               background: HEADER_GRADIENT,
//               opacity: 0.9,
//             },
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewTermination;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Paper,
  Divider,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

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

const ViewTermination = ({ open, onClose, termination }) => {
  if (!termination) return null;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  const formatDateTime = (date) =>
    date ? new Date(date).toLocaleString("en-IN") : "-";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "completed":
        return "info";
      default:
        return "warning";
    }
  };

  const getStatusChipStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          bgcolor: COLORS.status.success,
          color: COLORS.text.primary,
        };
      case "rejected":
        return {
          bgcolor: COLORS.status.error,
          color: COLORS.text.primary,
        };
      case "completed":
        return {
          bgcolor: COLORS.status.info,
          color: COLORS.text.primary,
        };
      default:
        return {
          bgcolor: COLORS.status.warning,
          color: COLORS.text.primary,
        };
    }
  };

  const employee = termination.employeeId || {};

  const SectionTitle = ({ children }) => (
    <Typography
      sx={{
        fontSize: '0.85rem',
        fontWeight: 700,
        color: COLORS.text.primary,
        mb: 2,
        letterSpacing: '0.3px'
      }}
    >
      {children}
    </Typography>
  );

  const InfoItem = ({ label, value, isFullWidth = false }) => (
    <Box sx={{ width: isFullWidth ? '100%' : 'auto' }}>
      <Typography
        sx={{
          fontSize: '0.7rem',
          fontWeight: 600,
          color: COLORS.text.secondary,
          letterSpacing: '0.5px',
          mb: 0.5
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontWeight: 500,
          color: COLORS.text.primary,
          wordBreak: 'break-word'
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );

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
          Termination Details
        </Typography>
        <Button
          onClick={onClose}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Employee Information */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <SectionTitle>Employee Information</SectionTitle>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <InfoItem 
                label="EMPLOYEE NAME"
                value={`${employee.FirstName || ""} ${employee.LastName || ""}`.trim() || "-"}
              />
              <InfoItem 
                label="EMPLOYEE ID"
                value={termination.employeeID || "-"}
              />
              <InfoItem 
                label="EMAIL"
                value={employee.Email || "-"}
              />
              <InfoItem 
                label="PHONE"
                value={employee.Phone || "-"}
              />
            </Box>
          </Paper>

          {/* Termination Information */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <SectionTitle>Termination Information</SectionTitle>
              <Chip
                label={termination.status || "Pending"}
                size="small"
                sx={{
                  bgcolor: getStatusChipStyles(termination.status).bgcolor,
                  color: getStatusChipStyles(termination.status).color,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  height: 24,
                  borderRadius: 1.5
                }}
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <InfoItem 
                label="TERMINATION ID"
                value={termination.terminationId || "-"}
              />
              <InfoItem 
                label="TERMINATION TYPE"
                value={termination.terminationType || "-"}
              />
              <InfoItem 
                label="INITIATED BY"
                value={termination.initiatorType || "-"}
              />
              <InfoItem 
                label="LAST WORKING DAY"
                value={formatDate(termination.lastWorkingDay)}
              />
            </Box>
            
            <Divider sx={{ my: 2, borderColor: COLORS.border }} />
            
            <InfoItem 
              label="REASON FOR TERMINATION"
              value={termination.reason || "-"}
              isFullWidth
            />
          </Paper>

          {/* Workflow & Documents */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <SectionTitle>Workflow & Documents</SectionTitle>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
              <InfoItem 
                label="EXIT INTERVIEW"
                value={termination.feedback?.submitted ? "Submitted" : "Pending"}
              />
              <InfoItem 
                label="REHIRE ELIGIBLE"
                value={termination.feedback?.exitInterview?.rehireEligible ? "Yes" : "No"}
              />
              <InfoItem 
                label="EXPERIENCE LETTER"
                value={termination.documents?.experienceLetter?.generated ? "Generated" : "Pending"}
              />
              <InfoItem 
                label="RELIEVING LETTER"
                value={termination.documents?.relievingLetter?.generated ? "Generated" : "Pending"}
              />
            </Box>
            
            <Divider sx={{ my: 2, borderColor: COLORS.border }} />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <InfoItem 
                label="CREATED AT"
                value={formatDateTime(termination.createdAt)}
              />
              <InfoItem 
                label="UPDATED AT"
                value={formatDateTime(termination.updatedAt)}
              />
            </Box>
          </Paper>
        </Box>
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTermination;