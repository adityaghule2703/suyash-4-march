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

// const HEADER_GRADIENT = "linear-gradient(135deg, #0B3B4B, #127D9E)";

// const ViewProduction = ({ open, onClose, production }) => {
//   if (!production) return null;

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

//   const getEmployeeName = () => {
//     if (production.employeeName) return production.employeeName;
//     if (production.EmployeeID) {
//       if (production.EmployeeID.FullName)
//         return production.EmployeeID.FullName;

//       return `${production.EmployeeID.FirstName || ""} ${
//         production.EmployeeID.LastName || ""
//       }`.trim();
//     }
//     return "N/A";
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return "success";
//       case "rejected":
//         return "error";
//       case "paid":
//         return "info";
//       default:
//         return "warning";
//     }
//   };

//   const totalUnits = production.totalUnits || 0;
//   const goodUnits = production.goodUnits || production.GoodUnits || 0;
//   const rejectedUnits =
//     production.rejectedUnits || production.RejectedUnits || 0;

//   const earnings =
//     production.TotalAmount ||
//     production.DailyEarning ||
//     production.earnings ||
//     0;

//   const quality =
//     totalUnits > 0
//       ? ((goodUnits / totalUnits) * 100).toFixed(1)
//       : "0";

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
//           boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
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
//           letterSpacing: 0.5,
//         }}
//       >
//         Production Details
//       </DialogTitle>

//       <DialogContent
//         sx={{
//           p: 3,
//           bgcolor: "#F4F6F8",
//         }}
//       >
//         {/* EMPLOYEE INFO */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             mb: 2,
//             borderRadius: 3,
//             border: "1px solid #E5E7EB",
//             bgcolor: "#FFFFFF",
//           }}
//         >
//           <Typography
//             variant="subtitle1"
//             fontWeight={700}
//             sx={{  color: "#0B3B4B" }}
//           >
//             Employee Information
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={8}>
//               <Typography variant="body1" fontWeight={600}>
//                 {getEmployeeName()}
//               </Typography>
//             </Grid>

//             <Grid item xs={4} textAlign="right">
//               <Typography variant="body2" color="text.secondary">
//                 {formatDate(production.Date || production.date)}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Product
//               </Typography>
//               <Typography fontWeight={600}>
//                 {production.ProductName || production.productName}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Operation
//               </Typography>
//               <Typography fontWeight={600}>
//                 {production.Operation || production.operation}
//               </Typography>
//             </Grid>

//             <Grid item xs={12} textAlign="right">
//               <Chip
//                 label={
//                   production.Status ||
//                   production.status ||
//                   "Pending"
//                 }
//                 color={getStatusColor(
//                   production.Status || production.status
//                 )}
//                 size="small"
//                 sx={{ fontWeight: 600 }}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* UNITS SUMMARY */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             mb: 2,
//             borderRadius: 3,
//             border: "1px solid #E5E7EB",
//             bgcolor: "#FFFFFF",
//           }}
//         >
//           <Typography
//             variant="subtitle1"
//             fontWeight={700}
//             sx={{ mb: 1, color: "#0B3B4B" }}
//           >
//             Units Summary
//           </Typography>

//           <Grid container spacing={3}>
//             <Grid item xs={3}>
//               <Typography variant="caption" color="text.secondary">
//                 TOTAL
//               </Typography>
//               <Typography fontWeight={700} fontSize={18}>
//                 {totalUnits}
//               </Typography>
//             </Grid>

//             <Grid item xs={3}>
//               <Typography variant="caption" color="text.secondary">
//                 GOOD
//               </Typography>
//               <Typography
//                 fontWeight={700}
//                 fontSize={18}
//                 sx={{ color: "#059669" }}
//               >
//                 {goodUnits}
//               </Typography>
//             </Grid>

//             <Grid item xs={3}>
//               <Typography variant="caption" color="text.secondary">
//                 REJECTED
//               </Typography>
//               <Typography
//                 fontWeight={700}
//                 fontSize={18}
//                 sx={{ color: "#DC2626" }}
//               >
//                 {rejectedUnits}
//               </Typography>
//             </Grid>

//             <Grid item xs={3}>
//               <Typography variant="caption" color="text.secondary">
//                 QUALITY
//               </Typography>
//               <Typography fontWeight={700} fontSize={18}>
//                 {quality}%
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <Divider sx={{ my: 1.5 }} />
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   Rate per Unit
//                 </Typography>
//                 <Typography fontWeight={700} fontSize={18}>
//                   ₹{production.ratePerUnit || 0}
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* EARNINGS */}
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
//             sx={{ opacity: 0.9 }}
//           >
//             Total Earnings
//           </Typography>

//           <Typography fontWeight={800} fontSize={28} sx={{ mb: 2 }}>
//             ₹{earnings.toFixed(2)}
//           </Typography>

//           <Divider
//             sx={{ my: 2, borderColor: "rgba(255,255,255,0.3)" }}
//           />

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Typography
//                 variant="caption"
//                 sx={{ opacity: 0.7 }}
//               >
//                 CREATED
//               </Typography>
//               <Typography variant="body2" fontWeight={500}>
//                 {formatDateTime(production.createdAt)}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography
//                 variant="caption"
//                 sx={{ opacity: 0.7 }}
//               >
//                 UPDATED
//               </Typography>
//               <Typography variant="body2" fontWeight={500}>
//                 {formatDateTime(production.updatedAt)}
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
//               background:
//                 "linear-gradient(135deg, #127D9E 0%, #0B3B4B 100%)",
//             },
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewProduction;


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
  Stack,
} from "@mui/material";
import { Close as CloseIcon, Work, CalendarToday, TrendingUp, ProductionQuantityLimits } from "@mui/icons-material";

// Color constants matching other components
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

const ViewProduction = ({ open, onClose, production }) => {
  if (!production) return null;

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

  const formatTime = (time) => {
    if (!time) return "-";
    const date = new Date(time);
    return date.toLocaleTimeString("en-IN", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmployeeName = () => {
    if (production.employeeName) return production.employeeName;
    if (production.EmployeeID) {
      if (production.EmployeeID.FullName)
        return production.EmployeeID.FullName;

      return `${production.EmployeeID.FirstName || ""} ${
        production.EmployeeID.LastName || ""
      }`.trim();
    }
    return "N/A";
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          bg: COLORS.status.success,
          text: COLORS.primaryDark,
          border: '#86efac'
        };
      case "rejected":
        return {
          bg: COLORS.status.error,
          text: '#991b1b',
          border: '#fecaca'
        };
      case "paid":
        return {
          bg: COLORS.status.info,
          text: '#075985',
          border: '#bae6fd'
        };
      default:
        return {
          bg: COLORS.status.warning,
          text: '#854d0e',
          border: '#fed7aa'
        };
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const totalUnits = production.totalUnits || 0;
  const goodUnits = production.goodUnits || production.GoodUnits || 0;
  const rejectedUnits = production.rejectedUnits || production.RejectedUnits || 0;
  const reworkUnits = production.reworkUnits || production.ReworkUnits || 0;

  const earnings = production.TotalAmount ||
    production.DailyEarning ||
    production.earnings ||
    0;

  const quality = totalUnits > 0
    ? ((goodUnits / totalUnits) * 100).toFixed(1)
    : "0";

  const rejectionRate = totalUnits > 0
    ? ((rejectedUnits / totalUnits) * 100).toFixed(1)
    : "0";

  const statusStyles = getStatusStyles(production.Status || production.status);

  const SectionTitle = ({ children, icon: Icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {Icon && <Icon sx={{ fontSize: '1rem', color: COLORS.primary }} />}
      <Typography sx={{ 
        fontSize: '0.8rem', 
        fontWeight: 700, 
        color: COLORS.primary,
        letterSpacing: '0.3px'
      }}>
        {children}
      </Typography>
    </Box>
  );

  const InfoItem = ({ label, value, highlight = false }) => (
    <Box>
      <Typography sx={{
        fontSize: '0.65rem',
        fontWeight: 600,
        color: COLORS.text.tertiary,
        letterSpacing: '0.5px',
        mb: 0.5
      }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: highlight ? '1rem' : '0.75rem',
        fontWeight: highlight ? 700 : 500,
        color: highlight ? COLORS.primary : COLORS.text.primary
      }}>
        {value || "-"}
      </Typography>
    </Box>
  );

  const StatCard = ({ label, value, color, icon: Icon }) => (
    <Box sx={{ 
      textAlign: 'center',
      p: 1.5,
      borderRadius: 1.5,
      bgcolor: COLORS.background.light,
      border: `1px solid ${COLORS.border}`
    }}>
      <Typography sx={{
        fontSize: '0.6rem',
        fontWeight: 600,
        color: COLORS.text.tertiary,
        letterSpacing: '0.5px',
        mb: 0.5
      }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: color || COLORS.primary
      }}>
        {value}
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
        <Typography sx={{ 
          fontSize: '1.2rem', 
          fontWeight: 700, 
          color: COLORS.text.primary 
        }}>
          Production Details
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2}>
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
            <SectionTitle icon={Work}>
              Employee Information
            </SectionTitle>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <InfoItem 
                  label="EMPLOYEE NAME"
                  value={getEmployeeName()}
                  highlight
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <InfoItem 
                  label="PRODUCTION DATE"
                  value={formatDate(production.Date || production.date)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem 
                  label="PRODUCT"
                  value={production.ProductName || production.productName}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem 
                  label="OPERATION"
                  value={production.Operation || production.operation}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Chip
                    label={getStatusText(production.Status || production.status)}
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      height: 24,
                      bgcolor: statusStyles.bg,
                      color: statusStyles.text,
                      border: `1px solid ${statusStyles.border}`,
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Units Summary */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <SectionTitle icon={ProductionQuantityLimits}>
              Units Summary
            </SectionTitle>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard 
                  label="TOTAL UNITS"
                  value={totalUnits}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard 
                  label="GOOD UNITS"
                  value={goodUnits}
                  color="#059669"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard 
                  label="REJECTED"
                  value={rejectedUnits}
                  color="#DC2626"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard 
                  label="REWORK"
                  value={reworkUnits}
                  color="#F59E0B"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2, borderColor: COLORS.border }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <InfoItem 
                  label="QUALITY RATE"
                  value={`${quality}%`}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem 
                  label="REJECTION RATE"
                  value={`${rejectionRate}%`}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem 
                  label="RATE PER UNIT"
                  value={`₹${production.ratePerUnit || 0}`}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem 
                  label="TOTAL EARNINGS"
                  value={`₹${earnings.toFixed(2)}`}
                  highlight
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Time Information */}
          {(production.startTime || production.endTime) && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}
            >
              <SectionTitle icon={CalendarToday}>
                Time Information
              </SectionTitle>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <InfoItem 
                    label="START TIME"
                    value={formatTime(production.startTime || production.StartTime)}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <InfoItem 
                    label="END TIME"
                    value={formatTime(production.endTime || production.EndTime)}
                  />
                </Grid>
                {(production.totalHours || production.TotalHours) && (
                  <Grid size={{ xs: 12 }}>
                    <InfoItem 
                      label="TOTAL HOURS"
                      value={Number(production.totalHours || production.TotalHours || 0).toFixed(2)}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}

          {/* Additional Information */}
          {(production.machineId || production.batchNumber || production.orderNumber || production.remarks) && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}
            >
              <SectionTitle>
                Additional Information
              </SectionTitle>

              <Grid container spacing={2}>
                {production.machineId && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <InfoItem 
                      label="MACHINE ID"
                      value={production.machineId}
                    />
                  </Grid>
                )}
                {production.batchNumber && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <InfoItem 
                      label="BATCH NUMBER"
                      value={production.batchNumber}
                    />
                  </Grid>
                )}
                {production.orderNumber && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <InfoItem 
                      label="ORDER NUMBER"
                      value={production.orderNumber}
                    />
                  </Grid>
                )}
                {production.remarks && (
                  <Grid size={{ xs: 12 }}>
                    <InfoItem 
                      label="REMARKS"
                      value={production.remarks}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}

          {/* Bonus Information */}
          {(production.qualityBonus || production.efficiencyBonus) && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}
            >
              <SectionTitle icon={TrendingUp}>
                Bonus Information
              </SectionTitle>

              <Grid container spacing={2}>
                {production.qualityBonus > 0 && (
                  <Grid size={{ xs: 6 }}>
                    <InfoItem 
                      label="QUALITY BONUS"
                      value={`₹${Number(production.qualityBonus).toFixed(2)}`}
                    />
                  </Grid>
                )}
                {production.efficiencyBonus > 0 && (
                  <Grid size={{ xs: 6 }}>
                    <InfoItem 
                      label="EFFICIENCY BONUS"
                      value={`₹${Number(production.efficiencyBonus).toFixed(2)}`}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}

          {/* Timestamps */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.light
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <InfoItem 
                  label="CREATED AT"
                  value={formatDateTime(production.createdAt)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem 
                  label="UPDATED AT"
                  value={formatDateTime(production.updatedAt)}
                />
              </Grid>
            </Grid>
          </Paper>
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

export default ViewProduction;