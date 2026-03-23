// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   Chip,
//   Divider,
//   Box,
//   Grid,
//   Paper,
//   Tooltip
// } from "@mui/material";
// import {
//   Receipt as ReceiptIcon,
//   CalendarToday,
//   Info as InfoIcon,
//   ArrowBack as ArrowBackIcon,
//   Close as CloseIcon
// } from "@mui/icons-material";

// // Color constants (same as Employee UI)
// const PRIMARY_BLUE = "#00B4D8";
// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, # alloc? 0e7490 100%)";

// const ViewLeaveTypes = ({ open, onClose, leaveType }) => {
//   if (!leaveType) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric"
//     });
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           maxHeight: "92vh",
//           boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
//         }
//       }}
//     >
//       {/* ================= HEADER ================= */}
//       <DialogTitle
//         sx={{
//           borderBottom: "1px solid #e2e8f0",
//           py: 2,
//           px: 3,
//           background: HEADER_GRADIENT,
//           color: "#fff"
//         }}
//       >
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Stack direction="row" Groove spacing={1} alignItems="center" >
//             <ReceiptIcon />
//             <Typography variant="h6" fontWeight={600}>
//               Leave Type Details
//             </Typography>
//           </Stack>

//           <Chip
//             label={`ID: ${leaveType._id || "N/A"}`}
//             size="small"
//             sx={{
//               bgcolor: "rgba(255,255,255,0.15)",
//               color: "#fff",
//               fontWeight: 500
//             }}
//           />
//         </Stack>
//       </DialogTitle>

//       {/* ================= CONTENT ================= */}
//       <DialogContent
//         sx={{
//           pt: 3,
//           px: 4,
//           mt: 2,
//           overflowY: "auto",
//           background: "#f8fafc"
//         }}
//       >
//         <Stack spacing={3}>
//           {/* MAIN INFO CARD */}
//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               borderRadius: 2,
//               border: "1px solid #e2e8f0",
//               bgcolor: "#fff"
//             }}
//           >
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="caption" color="text.secondary">
//                   Leave Type Name
//                 </Typography>
//                 <Typography variant="h6" fontWeight={600} color="#164e63">
//                   {leaveType.Name}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Typography variant="caption" color="text.secondary">
//                   Maximum Days Per Year
//                 </Typography>
//                 <Typography fontWeight={600} color="primary">
//                   {leaveType.MaxDaysPerYear} Days
//                 </Typography>
//               </Grid>

//               <Grid item xs={12}>
//                 <Typography variant="caption" color="text.secondary">
//                   Description
//                 </Typography>
//                 <Box
//                   sx={{
//                     mt: 1,
//                     p: 2,
//                     borderRadius: 2,
//                     backgroundColor: "#f1f5f9",
//                     border: "1px solid #e2e8f0"
//                   }}
//                 >
//                   <Typography variant="body2" color="text.secondary">
//                     {leaveType.Description || "No description provided"}
//                   </Typography>
//                 </Box>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Typography variant="caption" color="text.secondary">
//                   Status
//                 </Typography>
//                 <Box mt={1}>
//                   <Chip
//                     label={leaveType.IsActive ? "Active" : "Inactive"}
//                     color={leaveType.IsActive ? "success" : "default"}
//                     size="small"
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* SYSTEM INFO CARD */}
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               border: "1px solid #e2e8f0",
//               bgcolor: "#f1f5f9"
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={5}>
//                 <Typography variant="caption" color="#64748B">
//                   Created: {formatDate(leaveType.CreatedAt)}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} sm={5}>
//                 <Typography variant="caption" color="#64748B">
//                   Updated: {formatDate(leaveType.UpdatedAt)}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} sm={2}>
//                 <Tooltip title="Internal Record Info">
//                   <Chip
//                     label="System Info"
//                     size="small"
//                     icon={<InfoIcon />}
//                     variant="outlined"
//                   />
//                 </Tooltip>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Stack>
//       </DialogContent>

//       {/* ================= ACTIONS ================= */}
//       <DialogActions
//         sx={{
//           px: 3,
//           py: 2,
//           borderTop: "1px solid #e2e8f0",
//           backgroundColor: "#f8fafc",
//           display: "flex",
//           justifyContent: "flex-end"
//         }}
//       >
//         <Button
//           onClick={onClose}
//           startIcon={<CloseIcon />}
//           sx={{
//             textTransform: "none",
//             fontWeight: 500,
//             color: "#475569"
//           }}
//         >
//           CLOSE
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewLeaveTypes;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Box,
  Grid,
  Paper,
  Divider
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Tag as TagIcon
} from "@mui/icons-material";

// Color constants matching AddTax/EditTax components
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
    tableHeader: '#063C3F',
    card: '#F9FAFB'
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

const ViewLeaveTypes = ({ open, onClose, leaveType }) => {
  if (!leaveType) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
      {/* Header */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 1,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ReceiptIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: COLORS.text.primary
            }}
          >
            Leave Type Details
          </Typography>
        </Stack>

        <Chip
          label={`ID: ${leaveType._id ? leaveType._id.substring(0, 8) + '...' : 'N/A'}`}
          size="small"
          sx={{
            bgcolor: COLORS.primaryLight,
            color: COLORS.primary,
            fontWeight: 500,
            fontSize: '0.65rem',
            height: 24,
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        <Stack spacing={2}>
          {/* Main Info Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <Stack spacing={2}>
              {/* Leave Type Name and Max Days */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.5
                    }}
                  >
                    LEAVE TYPE NAME
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TagIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: COLORS.text.primary
                      }}
                    >
                      {leaveType.Name}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.5
                    }}
                  >
                    MAX DAYS PER YEAR
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: COLORS.text.primary
                      }}
                    >
                      {leaveType.MaxDaysPerYear} Days
                    </Typography>
                  </Stack>
                </Box>
              </Box>

              <Divider sx={{ borderColor: COLORS.border }} />

              {/* Description */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: COLORS.text.tertiary,
                    letterSpacing: '0.3px',
                    mb: 0.5
                  }}
                >
                  DESCRIPTION
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="flex-start">
                  <DescriptionIcon sx={{ fontSize: '0.8rem', color: COLORS.primary, mt: 0.3 }} />
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      color: COLORS.text.secondary,
                      lineHeight: 1.5
                    }}
                  >
                    {leaveType.Description || "No description provided"}
                  </Typography>
                </Stack>
              </Box>

              <Divider sx={{ borderColor: COLORS.border }} />

              {/* Status */}
              {/* <Box>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: COLORS.text.tertiary,
                    letterSpacing: '0.3px',
                    mb: 0.5
                  }}
                >
                  STATUS
                </Typography>
                <Chip
                  label={leaveType.IsActive ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    bgcolor: leaveType.IsActive ? COLORS.chips.active : COLORS.chips.inactive,
                    color: leaveType.IsActive ? COLORS.primary : COLORS.text.secondary,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    '& .MuiChip-label': {
                      px: 1.5
                    }
                  }}
                />
              </Box> */}
            </Stack>
          </Paper>

          {/* System Info Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.3px'
                  }}
                >
                  SYSTEM INFORMATION
                </Typography>
              </Stack>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.25
                    }}
                  >
                    CREATED
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: COLORS.text.primary,
                      fontWeight: 500
                    }}
                  >
                    {formatDateTime(leaveType.CreatedAt)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.25
                    }}
                  >
                    LAST UPDATED
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: COLORS.text.primary,
                      fontWeight: 500
                    }}
                  >
                    {formatDateTime(leaveType.UpdatedAt)}
                  </Typography>
                </Box>
              </Box>

              {leaveType.CreatedBy && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.25
                    }}
                  >
                    CREATED BY
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: COLORS.text.primary,
                      fontWeight: 500
                    }}
                  >
                    {leaveType.CreatedBy}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Additional Stats Card - Optional, can be removed if not needed */}
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
                fontSize: '0.65rem',
                fontWeight: 600,
                color: COLORS.text.tertiary,
                letterSpacing: '0.3px',
                mb: 1
              }}
            >
              ADDITIONAL INFORMATION
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                  Leave Type ID
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {leaveType._id || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                  Record Status
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {leaveType.IsActive ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>

      {/* Actions */}
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
          startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
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

export default ViewLeaveTypes;