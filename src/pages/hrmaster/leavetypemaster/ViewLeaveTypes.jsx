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
  Tooltip,
  Avatar,
  Divider,
  Card,
  CardContent,
  IconButton
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  CalendarToday,
  Info as InfoIcon,
  Close as CloseIcon,
  Badge as BadgeIcon,
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";

// Header gradient with your specified color combination
const HEADER_GRADIENT = "linear-gradient(135deg, #0f5f6e 0%, #1da1b9 100%)";

const ViewLeaveTypes = ({ open, onClose, leaveType }) => {
  if (!leaveType) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
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
          borderRadius: 4,
          maxHeight: "92vh",
          boxShadow: "0 25px 60px rgba(15, 95, 110, 0.25)",
          overflow: "hidden"
        }
      }}
    >
      {/* ================= HEADER ================= */}
      <DialogTitle
        sx={{
          background: HEADER_GRADIENT,
          py: 1,
          px: 3,
          position: "relative"
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "#fff",
                width: 48,
                height: 48
              }}
            >
              <AssignmentIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#fff" gutterBottom>
                Leave Type Details
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {/* <Chip
                  //label={`ID: ${leaveType._id ? leaveType._id.substring(0, 8) + "..." : "N/A"}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    fontFamily: "monospace"
                  }}
                />
                <Chip
                  icon={<CalendarToday sx={{ fontSize: 14 }} />}
                  label={formatDate(leaveType.CreatedAt)}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "0.75rem"
                  }}
                /> */}
              </Stack>
            </Box>
          </Stack>
          
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* ================= CONTENT ================= */}
      <DialogContent
        sx={{
          p: 0,
          bgcolor: "#f8fafc"
        }}
      >
        {/* Main Content */}
        
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {/* Leave Type Name Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                overflow: "hidden"
              }}
            >
              <Box
  sx={{
    bgcolor: "#f1f5f9",
    py: 1.5,
    px: 3,
    borderBottom: "2px solid #0f5f6e",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}
>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#0f5f6e" }}>
  <AssignmentIcon sx={{ fontSize: 20, mr: 1, verticalAlign: "middle" }} />
  Leave Type Information
</Typography>

<Chip
  icon={leaveType.IsActive ? <CheckCircleIcon /> : <CancelIcon />}
  label={leaveType.IsActive ? "Active" : "Inactive"}
  sx={{
    bgcolor: leaveType.IsActive ? "#dcfce7" : "#fee2e2",
    color: leaveType.IsActive ? "#166534" : "#991b1b",
    fontWeight: 600,
    px: 1,
    "& .MuiChip-icon": {
      color: leaveType.IsActive ? "#166534" : "#991b1b"
    }
  }}
/>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        color: "#64748b", 
                        fontWeight: 600, 
                        letterSpacing: 1,
                        fontSize: "0.7rem"
                      }}
                    >
                      LEAVE TYPE NAME
                    </Typography>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      sx={{ color: "#0f5f6e", mt: 0.5 }}
                    >
                      {leaveType.Name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        color: "#64748b", 
                        fontWeight: 600, 
                        letterSpacing: 1,
                        fontSize: "0.7rem"
                      }}
                    >
                      MAXIMUM DAYS PER YEAR
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                      <Typography variant="h5" fontWeight={700} sx={{ color: "#1da1b9", mr: 1 }}>
                        {leaveType.MaxDaysPerYear || 0}
                      </Typography>
                      <Typography variant="body1" fontWeight={500} sx={{ color: "#475569" }}>
                        Days
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1, borderColor: "#e2e8f0" }} />
                  </Grid>

                 <Grid item xs={12}>
  <Typography 
    variant="overline" 
    sx={{ 
      color: "#64748b", 
      fontWeight: 600, 
      letterSpacing: 1,
      fontSize: "0.7rem",
      display: 'block',
      mb: 0.5
    }}
  >
    DESCRIPTION
  </Typography>
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 2,
      bgcolor: "#ffffff",
      width: '100%'
    }}
  >
    <Typography 
      variant="body1" 
      sx={{ 
        color: "#1e293b", 
        fontSize: "0.95rem",
        fontWeight: 400,
        lineHeight: 1.6,
        wordBreak: 'break-word'
      }}
    >
      {leaveType.Description || "No description provided"}
    </Typography>
  </Paper>
</Grid>

                  {/* <Grid item xs={12}>
                    <Box mt={1}>
                      <Chip
                        icon={leaveType.IsActive ? <CheckCircleIcon /> : <CancelIcon />}
                        label={leaveType.IsActive ? "Active" : "Inactive"}
                        sx={{
                          bgcolor: leaveType.IsActive ? "#dcfce7" : "#fee2e2",
                          color: leaveType.IsActive ? "#166534" : "#991b1b",
                          fontWeight: 600,
                          px: 1,
                          '& .MuiChip-icon': {
                            color: leaveType.IsActive ? "#166534" : "#991b1b"
                          }
                        }}
                      />
                    </Box>
                  </Grid> */}
                </Grid>
              </CardContent>
            </Card>

            {/* System Info Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#fff"
              }}
            >
              <Box sx={{ 
                bgcolor: "#f8fafc", 
                py: 1.5, 
                px: 3,
                borderBottom: "2px solid #1da1b9"
              }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#1da1b9" }}>
                  <InfoIcon sx={{ fontSize: 20, mr: 1, verticalAlign: "middle" }} />
                  System Information
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 2 }}>
                <Grid container spacing={16}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#e0f2fe", width: 40, height: 40 }}>
                        <CalendarToday sx={{ fontSize: 20, color: "#0369a1" }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                          Created Date
                        </Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ color: "#0f172a" }}>
                          {formatDate(leaveType.CreatedAt)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#e0f2fe", width: 40, height: 40 }}>
                        <AccessTimeIcon sx={{ fontSize: 20, color: "#0369a1" }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                          Last Updated
                        </Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ color: "#0f172a" }}>
                          {formatDate(leaveType.UpdatedAt)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </DialogContent>

      {/* ================= FOOTER ================= */}
      <DialogActions
        sx={{
          px: 4,
          py: 1.5,
          borderTop: "1px solid #e2e8f0",
          bgcolor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography variant="body2" sx={{ color: "#64748b", fontFamily: "monospace" }}>
        
        </Typography>
        
        <Button
          onClick={onClose}
          variant="contained"
          startIcon={<CloseIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            py: 0.5,
            background: HEADER_GRADIENT,
            "&:hover": {
              background: "linear-gradient(135deg, #1da1b9 0%, #0f5f6e 100%)"
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