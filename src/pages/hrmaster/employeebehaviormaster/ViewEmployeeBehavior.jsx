// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Grid,
//   Chip,
//   Rating,
//   Stack,
//   CircularProgress,
//   Box,
//   IconButton,
//   Stepper,
//   Step,
//   StepLabel,
//   Avatar
// } from "@mui/material";
// import { Close, Lock } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const PRIMARY_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const steps = ["Basic Info", "Behavior Details", "Attachments & Meta"];

// const ViewEmployeeBehavior = ({ open, onClose, behaviorId }) => {
//   const [behavior, setBehavior] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeStep, setActiveStep] = useState(0);

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
//         setBehavior(res.data.data);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = date =>
//     date ? new Date(date).toLocaleDateString("en-GB") : "-";

//   const getStatusColor = status => {
//     switch (status) {
//       case "Resolved":
//         return "#16a34a";
//       case "Escalated":
//         return "#dc2626";
//       case "Closed":
//         return "#475569";
//       default:
//         return "#f59e0b";
//     }
//   };

//   const getInitials = (f, l) =>
//     `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

//   const renderStepContent = () => {
//     if (!behavior) return null;

//     switch (activeStep) {
//       case 0:
//         return (
//           <Stack spacing={3}>
//             <Stack direction="row" spacing={2} alignItems="center">
//               <Avatar sx={{ bgcolor: "#00B4D8", width: 56, height: 56 }}>
//                 {getInitials(
//                   behavior.employeeId.FirstName,
//                   behavior.employeeId.LastName
//                 )}
//               </Avatar>
//               <Box>
//                 <Typography variant="h6" fontWeight={600}>
//                   {behavior.employeeId.FirstName}{" "}
//                   {behavior.employeeId.LastName}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {behavior.employeeId.EmployeeID}
//                 </Typography>
//               </Box>
//             </Stack>

//             <Grid container spacing={3}>
//               <Grid item xs={6}>
//                 <Typography variant="body2" color="text.secondary">
//                   Category
//                 </Typography>
//                 <Typography fontWeight={500}>
//                   {behavior.category}
//                 </Typography>
//               </Grid>

//               <Grid item xs={6}>
//                 <Typography variant="body2" color="text.secondary">
//                   Review Date
//                 </Typography>
//                 <Typography fontWeight={500}>
//                   {formatDate(behavior.reviewDate)}
//                 </Typography>
//               </Grid>

//               <Grid item xs={6}>
//                 <Typography variant="body2" color="text.secondary">
//                   Rating
//                 </Typography>
//                 <Stack direction="row" spacing={1}>
//                   <Rating value={behavior.rating} readOnly />
//                   <Chip label={behavior.type} size="small" />
//                 </Stack>
//               </Grid>

//               <Grid item xs={6}>
//                 <Typography variant="body2" color="text.secondary">
//                   Status
//                 </Typography>
//                 <Chip
//                   label={behavior.status}
//                   sx={{
//                     backgroundColor: getStatusColor(behavior.status),
//                     color: "#fff"
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={3}>
//             <Box>
//               <Typography variant="body2" color="text.secondary">
//                 Description
//               </Typography>
//               <Typography mt={1}>{behavior.description}</Typography>
//             </Box>

//             <Box>
//               <Typography variant="body2" color="text.secondary">
//                 Action Taken
//               </Typography>
//               <Typography mt={1}>{behavior.actionTaken}</Typography>
//             </Box>

//             {behavior.tags?.length > 0 && (
//               <Box>
//                 <Typography variant="body2" color="text.secondary">
//                   Tags
//                 </Typography>
//                 <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
//                   {behavior.tags.map((tag, i) => (
//                     <Chip key={i} label={tag} size="small" />
//                   ))}
//                 </Stack>
//               </Box>
//             )}
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={3}>
//             {behavior.isConfidential && (
//               <Chip
//                 icon={<Lock />}
//                 label="Confidential"
//                 color="error"
//               />
//             )}

//             {behavior.attachments?.length > 0 && (
//               <Box>
//                 <Typography variant="body2" color="text.secondary">
//                   Attachments
//                 </Typography>
//                 <Stack spacing={1} mt={1}>
//                   {behavior.attachments.map((file, i) => (
//                     <Button
//                       key={i}
//                       variant="outlined"
//                       href={`${BASE_URL}/${file.filePath}`}
//                       target="_blank"
//                       sx={{ justifyContent: "flex-start" }}
//                     >
//                       {file.originalName || file.filename}
//                     </Button>
//                   ))}
//                 </Stack>
//               </Box>
//             )}

//             <Box>
//               <Typography variant="caption" color="text.secondary">
//                 Submitted By: {behavior.submittedBy.Username}
//               </Typography>
//               <br />
//               <Typography variant="caption" color="text.secondary">
//                 Created At: {formatDate(behavior.createdAt)}
//               </Typography>
//             </Box>
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle
//         sx={{
//           background: PRIMARY_GRADIENT,
//           color: "#fff",
//           fontWeight: 600
//         }}
//       >
//         Behavior Details
//         <IconButton
//           onClick={onClose}
//           sx={{ position: "absolute", right: 10, top: 10, color: "#fff" }}
//         >
//           <Close />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ minHeight: 220 }}>
//         {loading ? (
//           <Stack alignItems="center" justifyContent="center" height="100%">
//             <CircularProgress />
//           </Stack>
//         ) : behavior ? (
//           <>
//             <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
//               {steps.map(label => (
//                 <Step key={label}>
//                   <StepLabel>{label}</StepLabel>
//                 </Step>
//               ))}
//             </Stepper>

//             {renderStepContent()}
//           </>
//         ) : (
//           <Typography>No data found</Typography>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 2 }}>
//         <Button
//           disabled={activeStep === 0}
//           onClick={() => setActiveStep(prev => prev - 1)}
//         >
//           Back
//         </Button>

//         {activeStep < steps.length - 1 ? (
//           <Button
//             variant="contained"
//             onClick={() => setActiveStep(prev => prev + 1)}
//           >
//             Next
//           </Button>
//         ) : (
//           <Button onClick={onClose}>Close</Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewEmployeeBehavior;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Rating,
  Stack,
  CircularProgress,
  Box,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Divider
} from "@mui/material";
import { Close, Lock, AttachFile, CalendarToday, Person, Category, Description } from "@mui/icons-material";
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

const steps = ["Basic Info", "Behavior Details", "Attachments & Meta"];

const ViewEmployeeBehavior = ({ open, onClose, behaviorId }) => {
  const [behavior, setBehavior] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open && behaviorId) fetchBehavior();
  }, [open, behaviorId]);

  const fetchBehavior = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/employee-behavior/${behaviorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setBehavior(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = date => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case "Resolved":
        return COLORS.status.success;
      case "Escalated":
        return COLORS.status.error;
      case "Closed":
        return COLORS.text.secondary;
      default:
        return COLORS.status.warning;
    }
  };

  const getTypeColor = type => {
    switch (type) {
      case "Positive":
        return COLORS.status.success;
      case "Negative":
        return COLORS.status.error;
      default:
        return COLORS.status.warning;
    }
  };

  const getInitials = (f, l) =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const renderStepContent = () => {
    if (!behavior) return null;

    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* Employee Info Card */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              bgcolor: COLORS.background.light,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: COLORS.primary, 
                  width: 48, 
                  height: 48,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {getInitials(
                  behavior.employeeId?.FirstName,
                  behavior.employeeId?.LastName
                )}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {behavior.employeeId?.FirstName} {behavior.employeeId?.LastName}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                  {behavior.employeeId?.EmployeeID}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {/* Category */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <Category sx={{ fontSize: '0.8rem' }} /> CATEGORY
                  </Typography>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {behavior.category}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Review Date */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <CalendarToday sx={{ fontSize: '0.8rem' }} /> REVIEW DATE
                  </Typography>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(behavior.reviewDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Rating */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
                    RATING
                  </Typography>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Rating 
                      value={behavior.rating} 
                      readOnly 
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: COLORS.primary
                        }
                      }}
                    />
                    <Chip 
                      label={behavior.type} 
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        bgcolor: getTypeColor(behavior.type),
                        color: COLORS.text.primary
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Status */}
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
                    STATUS
                  </Typography>
                  <Box>
                    <Chip
                      label={behavior.status}
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: getStatusColor(behavior.status),
                        color: COLORS.text.primary
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        );

      case 1:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Description */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Description sx={{ fontSize: '0.8rem' }} /> DESCRIPTION
                </Typography>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.light, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.border}`,
                  minHeight: 80
                }}>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, whiteSpace: 'pre-wrap' }}>
                    {behavior.description}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Taken */}
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
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.background.light, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {behavior.actionTaken}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Tags */}
            {behavior.tags?.length > 0 && (
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
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5
                  }}>
                    {behavior.tags.map((tag, i) => (
                      <Chip 
                        key={i} 
                        label={tag} 
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          bgcolor: COLORS.background.white,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.text.secondary
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Confidential Status */}
            {behavior.isConfidential && (
              <Box sx={{ gridColumn: 'span 2' }}>
                <Chip
                  icon={<Lock sx={{ fontSize: '0.8rem' }} />}
                  label="Confidential"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    bgcolor: COLORS.status.error,
                    color: COLORS.text.primary,
                    '& .MuiChip-icon': {
                      color: COLORS.text.primary
                    }
                  }}
                />
              </Box>
            )}

            {/* Attachments */}
            {behavior.attachments?.length > 0 && (
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
                  <Stack spacing={1}>
                    {behavior.attachments.map((file, i) => (
                      <Button
                        key={i}
                        variant="outlined"
                        href={`${BASE_URL}/${file.filePath}`}
                        target="_blank"
                        startIcon={<AttachFile sx={{ fontSize: '0.8rem' }} />}
                        sx={{
                          justifyContent: 'flex-start',
                          height: 32,
                          borderRadius: 1.5,
                          borderColor: COLORS.border,
                          color: COLORS.text.secondary,
                          fontSize: '0.7rem',
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: COLORS.primary,
                            bgcolor: COLORS.primaryLight
                          }
                        }}
                      >
                        {file.originalName || file.filename}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}

            {/* Metadata */}
            <Box sx={{ gridColumn: 'span 2', mt: 1 }}>
              <Divider sx={{ my: 1.5, borderColor: COLORS.border }} />
              <Box sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`
              }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Submitted by: <span style={{ color: COLORS.text.primary, fontWeight: 500 }}>
                        {behavior.submittedBy?.Username || 'N/A'}
                      </span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Created: <span style={{ color: COLORS.text.primary, fontWeight: 500 }}>
                        {formatDate(behavior.createdAt)}
                      </span>
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
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
          Behavior Details
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
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 250 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
              Loading behavior data...
            </Typography>
          </Stack>
        ) : behavior ? (
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
          </Stack>
        ) : (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center',
            bgcolor: COLORS.background.light,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`
          }}>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
              No behavior data found
            </Typography>
          </Box>
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
          disabled={activeStep === 0}
          onClick={() => setActiveStep(prev => prev - 1)}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover:not(:disabled)': {
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
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setActiveStep(prev => prev + 1)}
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
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleClose}
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
                }
              }}
            >
              Close
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewEmployeeBehavior;