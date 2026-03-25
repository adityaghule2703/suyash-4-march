// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Paper,
//   Stack,
//   IconButton,
//   Box
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const ViewTraining = ({ open, onClose, training }) => {
//   if (!training) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";

//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit"
//     });
//   };

//   const formatSimpleDate = (dateString) => {
//     if (!dateString) return "-";

//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric"
//     });
//   };

//   const Field = ({ label, value }) => (
//     <Box sx={{ mb: 1 }}>
//       <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
//         <Typography
//           sx={{
//             fontWeight: 600,
//             fontSize: "0.9rem",
//             color: "#475569",
//             minWidth: 140
//           }}
//         >
//           {label}:
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: "0.95rem",
//             color: "#1e293b"
//           }}
//         >
//           {value || "-"}
//         </Typography>
//       </Box>
//     </Box>
//   );

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 3 }
//       }}
//     >

//       {/* Header */}

//       <DialogTitle
//         sx={{
//           fontWeight: 600,
//           fontSize: 24,
//           color: "#fff",
//           px: 4,
//           py: 1.5,
//           background: HEADER_GRADIENT,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between"
//         }}
//       >
//         Training Details

//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* Content */}

//       <DialogContent sx={{ mt: 3 }}>

//         <Paper
//           elevation={0}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             border: "1px solid #e2e8f0"
//           }}
//         >

//           <Typography
//             sx={{
//               fontWeight: 600,
//               mb: 3,
//               color: "#2563EB",
//               fontSize: "1.2rem"
//             }}
//           >
//             Training Information
//           </Typography>

//           <Stack spacing={1}>

//             <Field
//               label="Training Name"
//               value={training.trainingName}
//             />

//             <Field
//               label="Provider"
//               value={training.provider}
//             />

//             <Field
//               label="Status"
//               value={training.status}
//             />

//             <Field
//               label="Start Date"
//               value={formatSimpleDate(training.startDate)}
//             />

//             <Field
//               label="End Date"
//               value={formatSimpleDate(training.endDate)}
//             />

//             <Field
//               label="Certificate Number"
//               value={training.certificateNumber}
//             />

//             <Field
//               label="Issue Date"
//               value={formatSimpleDate(training.issueDate)}
//             />

//             <Field
//               label="Expiry Date"
//               value={formatSimpleDate(training.expiryDate)}
//             />

//             <Field
//               label="Created At"
//               value={formatDate(training.createdAt)}
//             />

//             <Field
//               label="Last Updated"
//               value={formatDate(training.updatedAt)}
//             />

//           </Stack>

//         </Paper>

//       </DialogContent>

//       {/* Footer */}

//       <DialogActions
//         sx={{
//           px: 4,
//           pb: 1.5,
//           pt: 1.5,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc",
//           justifyContent: "flex-end"
//         }}
//       >

//         <Button
//           onClick={onClose}
//           variant="contained"
//           sx={{
//             textTransform: "none",
//             fontWeight: 600,
//             fontSize: "0.95rem",
//             borderRadius: 2,
//             px: 4,
//             py: 1,
//             background: HEADER_GRADIENT,
//             "&:hover": {
//               opacity: 0.9,
//               background: HEADER_GRADIENT
//             }
//           }}
//         >
//           Close
//         </Button>

//       </DialogActions>

//     </Dialog>
//   );
// };

// export default ViewTraining;

// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Paper,
//   Stack,
//   IconButton,
//   Box,
//   Chip,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const HEADER_GRADIENT = "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const ViewTraining = ({ open, onClose, training }) => {
//   if (!training) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";

//     try {
//       return new Date(dateString).toLocaleString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return "-";
//     }
//   };

//   const formatSimpleDate = (dateString) => {
//     if (!dateString) return "-";

//     // handle DD/MM/YYYY
//     if (dateString.includes("/")) return dateString;

//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "-";
//     }
//   };

//   const Field = ({ label, value }) => (
//     <Box sx={{ mb: 1 }}>
//       <Box sx={{ display: "flex", gap: 1 }}>
//         <Typography
//           sx={{
//             fontWeight: 600,
//             fontSize: "0.9rem",
//             color: "#475569",
//             minWidth: 150,
//           }}
//         >
//           {label}:
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: "0.95rem",
//             color: "#1e293b",
//           }}
//         >
//           {value || "-"}
//         </Typography>
//       </Box>
//     </Box>
//   );

//   const StatusChip = ({ value }) => {
//     let color = "default";

//     if (value === "Scheduled") color = "info";
//     if (value === "Assigned") color = "warning";
//     if (value === "InProgress") color = "secondary";
//     if (value === "Completed") color = "success";
//     if (value === "Failed") color = "error";

//     return <Chip label={value} color={color} size="small" />;
//   };

//   const CertificateChip = ({ value }) => {
//     let color = "default";

//     if (value === "Valid") color = "success";
//     if (value === "Expired") color = "error";
//     if (value === "NotIssued") color = "warning";

//     return <Chip label={value} color={color} size="small" />;
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 3 } }}
//     >
//       {/* HEADER */}

//       <DialogTitle
//         sx={{
//           fontWeight: 600,
//           fontSize: 24,
//           color: "#fff",
//           px: 4,
//           py: 2,
//           background: HEADER_GRADIENT,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         Training Details
//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* CONTENT */}

//       <DialogContent sx={{ mt: 3 }}>
//         <Paper
//           elevation={0}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             border: "1px solid #e2e8f0",
//           }}
//         >
//           <Typography
//             sx={{
//               fontWeight: 600,
//               mb: 3,
//               color: "#2563EB",
//               fontSize: "1.2rem",
//             }}
//           >
//             Training Information
//           </Typography>

//           <Stack spacing={1}>
//             <Field label="Training Name" value={training.trainingName} />

//             <Field label="Training Type" value={training.trainingType} />

//             <Field label="Provider" value={training.provider} />

//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Typography sx={{ minWidth: 150, fontWeight: 600 }}>
//                 Status:
//               </Typography>

//               <StatusChip value={training.status} />
//             </Box>

//             <Field
//               label="Start Date"
//               value={formatSimpleDate(training.startDate)}
//             />

//             <Field
//               label="End Date"
//               value={formatSimpleDate(training.endDate)}
//             />

//             {training.certificateNumber && (
//               <Field
//                 label="Certificate Number"
//                 value={training.certificateNumber}
//               />
//             )}

//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Typography sx={{ minWidth: 150, fontWeight: 600 }}>
//                 Certificate Status:
//               </Typography>

//               <CertificateChip value={training.certificateStatus} />
//             </Box>

//             <Field
//               label="Issue Date"
//               value={formatSimpleDate(training.issueDate)}
//             />

//             <Field
//               label="Expiry Date"
//               value={formatSimpleDate(training.expiryDate)}
//             />

//             <Field
//               label="Expiring Soon"
//               value={training.isExpiringSoon ? "Yes" : "No"}
//             />

//             <Field label="Created At" value={formatDate(training.createdAt)} />

//             <Field
//               label="Last Updated"
//               value={formatDate(training.updatedAt)}
//             />
//           </Stack>
//         </Paper>
//       </DialogContent>

//       {/* FOOTER */}

//       <DialogActions
//         sx={{
//           px: 4,
//           pb: 2,
//           pt: 2,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc",
//         }}
//       >
//         <Button
//           onClick={onClose}
//           variant="contained"
//           sx={{
//             textTransform: "none",
//             fontWeight: 600,
//             borderRadius: 2,
//             px: 4,
//             background: HEADER_GRADIENT,
//             "&:hover": {
//               opacity: 0.9,
//               background: HEADER_GRADIENT,
//             },
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewTraining;


// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Paper,
//   Stack,
//   IconButton,
//   Box,
//   Chip,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const HEADER_GRADIENT = "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

// const ViewTraining = ({ open, onClose, training }) => {
//   if (!training) return null;

//   // 🔥 FULL DATE (Created / Updated)
//   const formatDate = (dateString) => {
//     if (!dateString) return "-";

//     try {
//       return new Date(dateString).toLocaleString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return "-";
//     }
//   };

//   // 🔥 SIMPLE DATE (Start / End)
//   const formatSimpleDate = (dateString) => {
//     if (!dateString) return "-";

//     // handle DD/MM/YYYY (from backend)
//     if (typeof dateString === "string" && dateString.includes("/")) {
//       return dateString;
//     }

//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "-";
//     }
//   };

//   // 🔥 REUSABLE FIELD
//   const Field = ({ label, value }) => (
//     <Box sx={{ mb: 1 }}>
//       <Box sx={{ display: "flex", gap: 1 }}>
//         <Typography
//           sx={{
//             fontWeight: 600,
//             fontSize: "0.9rem",
//             color: "#475569",
//             minWidth: 150,
//           }}
//         >
//           {label}:
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: "0.95rem",
//             color: "#1e293b",
//           }}
//         >
//           {value || "-"}
//         </Typography>
//       </Box>
//     </Box>
//   );

//   // 🔥 STATUS CHIP
//   const StatusChip = ({ value }) => {
//     let color = "default";

//     if (value === "Scheduled") color = "info";
//     if (value === "Assigned") color = "warning";
//     if (value === "InProgress") color = "secondary";
//     if (value === "Completed") color = "success";
//     if (value === "Failed") color = "error";

//     return <Chip label={value || "N/A"} color={color} size="small" />;
//   };

//   // 🔥 CERTIFICATE CHIP
//   const CertificateChip = ({ value }) => {
//     let color = "default";

//     if (value === "Valid") color = "success";
//     if (value === "Expired") color = "error";
//     if (value === "NotIssued") color = "warning";

//     return <Chip label={value || "N/A"} color={color} size="small" />;
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 3 } }}
//     >
//       {/* HEADER */}
//       <DialogTitle
//         sx={{
//           fontWeight: 600,
//           fontSize: 24,
//           color: "#fff",
//           px: 4,
//           py: 2,
//           background: HEADER_GRADIENT,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         Training Details

//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* CONTENT */}
//       <DialogContent sx={{ mt: 3 }}>
//         <Paper
//           elevation={0}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             border: "1px solid #e2e8f0",
//           }}
//         >
//           <Typography
//             sx={{
//               fontWeight: 600,
//               mb: 3,
//               color: "#2563EB",
//               fontSize: "1.2rem",
//             }}
//           >
//             Training Information
//           </Typography>

//           <Stack spacing={1}>
//             <Field label="Training Name" value={training.trainingName} />

//             <Field label="Training Type" value={training.trainingType} />

//             <Field label="Provider" value={training.provider} />

//             {/* STATUS */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Typography sx={{ minWidth: 150, fontWeight: 600 }}>
//                 Status:
//               </Typography>
//               <StatusChip value={training.status} />
//             </Box>

//             <Field
//               label="Start Date"
//               value={formatSimpleDate(training.startDate)}
//             />

//             <Field
//               label="End Date"
//               value={formatSimpleDate(training.endDate)}
//             />

//             {/* CERTIFICATE NUMBER */}
//             {training.certificateNumber && (
//               <Field
//                 label="Certificate Number"
//                 value={training.certificateNumber}
//               />
//             )}

//             {/* CERTIFICATE STATUS */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Typography sx={{ minWidth: 150, fontWeight: 600 }}>
//                 Certificate Status:
//               </Typography>
//               <CertificateChip value={training.certificateStatus} />
//             </Box>

//             {/* OPTIONAL FIELDS */}
//             {training.issueDate && (
//               <Field
//                 label="Issue Date"
//                 value={formatSimpleDate(training.issueDate)}
//               />
//             )}

//             {training.expiryDate && (
//               <Field
//                 label="Expiry Date"
//                 value={formatSimpleDate(training.expiryDate)}
//               />
//             )}

//             <Field
//               label="Expiring Soon"
//               value={training.isExpiringSoon ? "Yes" : "No"}
//             />

//             <Field
//               label="Created At"
//               value={formatDate(training.createdAt)}
//             />

//             <Field
//               label="Last Updated"
//               value={formatDate(training.updatedAt)}
//             />
//           </Stack>
//         </Paper>
//       </DialogContent>

//       {/* FOOTER */}
//       <DialogActions
//         sx={{
//           px: 4,
//           pb: 2,
//           pt: 2,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc",
//         }}
//       >
//         <Button
//           onClick={onClose}
//           variant="contained"
//           sx={{
//             textTransform: "none",
//             fontWeight: 600,
//             borderRadius: 2,
//             px: 4,
//             background: HEADER_GRADIENT,
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

// export default ViewTraining;



import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  Stack,
  Paper,
  IconButton   
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  AssignmentTurnedIn as AssignmentIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Color constants
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
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6'
  }
};

// Status chip component
const StatusChip = ({ status }) => {
  const statusConfig = {
    Scheduled: { color: COLORS.status.info, bg: '#E0F2FE', icon: null },
    Assigned: { color: COLORS.status.warning, bg: '#FEF3C7', icon: null },
    InProgress: { color: COLORS.status.purple, bg: '#EDE9FE', icon: null },
    Completed: { color: COLORS.status.success, bg: '#D1FAE5', icon: null },
    Failed: { color: COLORS.status.error, bg: '#FEE2E2', icon: null }
  };

  const config = statusConfig[status] || { color: COLORS.text.secondary, bg: COLORS.chips?.inactive || '#F1F5F9', icon: null };

  return (
    <Chip
      label={status || 'N/A'}
      size="small"
      sx={{
        fontSize: '0.7rem',
        fontWeight: 600,
        bgcolor: config.bg,
        color: config.color,
        height: 28,
        borderRadius: 2,
        '& .MuiChip-label': {
          px: 1.5
        }
      }}
    />
  );
};

// Info card component
const InfoCard = ({ icon: Icon, title, value, subtitle, color = COLORS.primary }) => (
  <Box sx={{
    flex: 1,
    minWidth: 0,
    p: 1.5,
    borderRadius: 2,
    bgcolor: COLORS.background.light,
    border: `1px solid ${COLORS.border}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: COLORS.primary,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }
  }}>
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: `${color}15`,
          color: color,
          borderRadius: 2
        }}
      >
        <Icon sx={{ fontSize: '1.1rem' }} />
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 500,
            color: COLORS.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: COLORS.text.primary,
            wordBreak: 'break-word'
          }}
        >
          {value || '-'}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: COLORS.text.tertiary,
              mt: 0.5
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Box>
);

// Detail row component
const DetailRow = ({ label, value, icon: Icon }) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    py: 1,
    borderBottom: `1px solid ${COLORS.border}`,
    '&:last-child': {
      borderBottom: 'none'
    }
  }}>
    {Icon && (
      <Icon sx={{
        fontSize: '0.9rem',
        color: COLORS.text.tertiary,
        width: 20
      }} />
    )}
    <Typography
      sx={{
        minWidth: 100,
        fontSize: '0.7rem',
        fontWeight: 500,
        color: COLORS.text.secondary
      }}
    >
      {label}:
    </Typography>
    <Typography
      sx={{
        fontSize: '0.75rem',
        fontWeight: 500,
        color: COLORS.text.primary,
        flex: 1
      }}
    >
      {value || '-'}
    </Typography>
  </Box>
);

const ViewTraining = ({ open, onClose, training, onEdit }) => {
  if (!training) return null;

  // Format date
  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      if (includeTime) {
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  // Calculate duration
  const getDuration = () => {
    if (!training.startDate || !training.endDate) return null;
    
    const start = new Date(training.startDate);
    const end = new Date(training.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Same day';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header with gradient background */}
      <Box sx={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
        position: 'relative'
      }}>
        <DialogTitle sx={{
          py: 2.5,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2
              }}
            >
              <SchoolIcon sx={{ fontSize: '1.4rem', color: COLORS.text.light }} />
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: COLORS.text.light,
                  mb: 0.25
                }}
              >
                Training Details
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: COLORS.text.lightMuted
                }}
              >
                View complete training information
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              color: COLORS.text.light,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: COLORS.background.white }}>
        <Stack spacing={3}>
          {/* Header Info Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <InfoCard
              icon={SchoolIcon}
              title="Training Name"
              value={training.trainingName}
              color={COLORS.primary}
            />
            <InfoCard
              icon={BusinessIcon}
              title="Provider"
              value={training.provider || 'Not specified'}
              color={COLORS.primary}
            />
            <InfoCard
              icon={AssignmentIcon}
              title="Status"
              value={<StatusChip status={training.status} />}
              color={COLORS.status.info}
            />
          </Box>

          {/* Date Information */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <EventIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: COLORS.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Schedule Information
              </Typography>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <DetailRow
                label="Start Date"
                value={formatDate(training.startDate)}
                icon={CalendarIcon}
              />
              <DetailRow
                label="End Date"
                value={formatDate(training.endDate)}
                icon={CalendarIcon}
              />
              {getDuration() && (
                <DetailRow
                  label="Duration"
                  value={getDuration()}
                  icon={TimeIcon}
                />
              )}
              <DetailRow
                label="Training Type"
                value={training.trainingType || 'Internal'}
                icon={SchoolIcon}
              />
            </Box>
          </Paper>

          {/* Certificate Information (if available) */}
          {(training.certificateNumber || training.certificateStatus || training.issueDate || training.expiryDate) && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <VerifiedIcon sx={{ fontSize: '1rem', color: COLORS.status.success }} />
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Certificate Information
                </Typography>
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {training.certificateNumber && (
                  <DetailRow
                    label="Certificate Number"
                    value={training.certificateNumber}
                    icon={AssignmentIcon}
                  />
                )}
                {training.certificateStatus && (
                  <DetailRow
                    label="Certificate Status"
                    value={training.certificateStatus}
                    icon={VerifiedIcon}
                  />
                )}
                {training.issueDate && (
                  <DetailRow
                    label="Issue Date"
                    value={formatDate(training.issueDate)}
                    icon={CalendarIcon}
                  />
                )}
                {training.expiryDate && (
                  <DetailRow
                    label="Expiry Date"
                    value={formatDate(training.expiryDate)}
                    icon={CalendarIcon}
                  />
                )}
                {training.isExpiringSoon && (
                  <DetailRow
                    label="Expiring Soon"
                    value="Yes"
                    icon={WarningIcon}
                  />
                )}
              </Box>
            </Paper>
          )}

          {/* Description Section */}
          {training.description && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: COLORS.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1.5
                }}
              >
                Description
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: COLORS.text.primary,
                  lineHeight: 1.6
                }}
              >
                {training.description}
              </Typography>
            </Paper>
          )}

          {/* System Information */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.light
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <TimeIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: COLORS.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                System Information
              </Typography>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <DetailRow
                label="Created At"
                value={formatDate(training.createdAt, true)}
                icon={TimeIcon}
              />
              <DetailRow
                label="Last Updated"
                value={formatDate(training.updatedAt, true)}
                icon={TimeIcon}
              />
            </Box>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1.5
      }}>
        {onEdit && (
          <Button
            onClick={onEdit}
            variant="outlined"
            sx={{
              height: 36,
              px: 3,
              borderRadius: 2,
              borderColor: COLORS.primary,
              color: COLORS.primary,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primaryDark,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Edit Training
          </Button>
        )}
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            height: 36,
            px: 3,
            borderRadius: 2,
            bgcolor: COLORS.primary,
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
              boxShadow: 'none'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTraining;