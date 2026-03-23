// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Stack,
//   Chip,
//   Divider,
//   Grid
// } from "@mui/material";
// import { CloseSharp } from "@mui/icons-material";

// const formatDate = (date) => {
//   if (!date) return "-";
//   return new Date(date).toLocaleString();
// };

// const ViewRegularization = ({ open, onClose, record }) => {
//   if (!record) return null;

//   const statusColor =
//     record.Status === "Approved"
//       ? "success"
//       : record.Status === "Rejected"
//       ? "error"
//       : "warning";

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 2 } }}
//     >
//       <DialogTitle
//         sx={{
//           borderBottom: "1px solid #E0E0E0",
//           backgroundColor: "#F8FAFC",
//           fontWeight: 600,
//           background: "linear-gradient(135deg, #164e63, #00B4D8)",
//           color: "#fff"
//         }}
//       >
//         Regularization Request Details
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3, margin:2 }}>
//         <Stack spacing={3}>

//           {/* STATUS */}
//           <Stack direction="row" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6" fontWeight={600}>
//               Status
//             </Typography>
//             <Chip
//               label={record.Status}
//               color={statusColor}
//               size="medium"
//             />
//           </Stack>

//           <Divider />

//           <Grid container spacing={3}>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Request Date
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {formatDate(record.Date)}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Request Type
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {record.RequestType}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Requested In
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {formatDate(record.RequestedIn)}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Requested Out
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {formatDate(record.RequestedOut)}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="body2" color="text.secondary">
//                 Reason
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {record.Reason || "-"}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="body2" color="text.secondary">
//                 Supporting Document
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {record.SupportingDocument || "-"}
//               </Typography>
//             </Grid>

//           </Grid>

//           <Divider />

//           {/* APPROVAL SECTION */}
//           <Typography variant="h6" fontWeight={600}>
//             Approval Details
//           </Typography>

//           <Grid container spacing={3}>
//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Approved At
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {formatDate(record.ApprovedAt)}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Approver ID
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {record.ApproverID || "-"}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="body2" color="text.secondary">
//                 Approval Remarks
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {record.ApprovalRemarks || "-"}
//               </Typography>
//             </Grid>
//           </Grid>

//           <Divider />

//           <Grid container spacing={3}>
//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Created At
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {formatDate(record.CreatedAt)}
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Last Updated
//               </Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {formatDate(record.UpdatedAt)}
//               </Typography>
//             </Grid>
//           </Grid>

//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ px: 4, pb: 3 }}>
//                                 <Button
//                 variant="contained"
//                 onClick={onClose}
//                 startIcon={<CloseSharp />}
//                 sx={{
//                   borderRadius: 1,
//                   px: 3,
//                   py: 1,
//                   textTransform: 'none',
//                   fontWeight: 500,
//                   backgroundColor: '#1972d2',
//                   '&:hover': {
//                     backgroundColor: '#1565C0'
//                   }
//                 }}
//               >
//                 Close
//               </Button>                                                                                                        
       
//             </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewRegularization;


import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  Divider,
  Grid,
  Box
} from "@mui/material";
import { CloseSharp } from "@mui/icons-material";

// 🎨 SAME DESIGN SYSTEM
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8"
  },
  background: {
    white: "#FFFFFF"
  },
  border: "#E3E8EF"
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const labelStyle = {
  fontSize: "0.7rem",
  fontWeight: 600,
  color: COLORS.text.secondary,
  letterSpacing: "0.5px"
};

const valueStyle = {
  fontSize: "0.8rem",
  fontWeight: 500,
  color: COLORS.text.primary
};

const ViewRegularization = ({ open, onClose, record }) => {
  if (!record) return null;

  const statusColor =
    record.Status === "Approved"
      ? "#16A34A"
      : record.Status === "Rejected"
      ? "#DC2626"
      : "#D97706";

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          View Request
        </Typography>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>

          {/* STATUS */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={labelStyle}>STATUS</Typography>
            <Chip
              label={record.Status}
              size="small"
              sx={{
                backgroundColor: `${statusColor}15`,
                color: statusColor,
                fontSize: "0.7rem",
                fontWeight: 600
              }}
            />
          </Box>

          <Divider />

          {/* BASIC INFO */}
          <Grid container spacing={2}>

            <Grid item xs={6}>
              <Typography sx={labelStyle}>REQUEST DATE</Typography>
              <Typography sx={valueStyle}>{formatDate(record.Date)}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={labelStyle}>REQUEST TYPE</Typography>
              <Typography sx={valueStyle}>{record.RequestType || "-"}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={labelStyle}>IN TIME</Typography>
              <Typography sx={valueStyle}>{formatDate(record.RequestedIn)}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={labelStyle}>OUT TIME</Typography>
              <Typography sx={valueStyle}>{formatDate(record.RequestedOut)}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={labelStyle}>REASON</Typography>
              <Typography sx={valueStyle}>{record.Reason || "-"}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={labelStyle}>SUPPORTING DOCUMENT</Typography>
              <Typography sx={valueStyle}>
                {record.SupportingDocument ? (
                  <a href={record.SupportingDocument} target="_blank" rel="noreferrer">
                    View Document
                  </a>
                ) : "-"}
              </Typography>
            </Grid>

          </Grid>

          <Divider />

          {/* APPROVAL */}
          <Typography sx={{ ...labelStyle, fontSize: "0.75rem" }}>
            APPROVAL DETAILS
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography sx={labelStyle}>APPROVED AT</Typography>
              <Typography sx={valueStyle}>{formatDate(record.ApprovedAt)}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={labelStyle}>APPROVER</Typography>
              <Typography sx={valueStyle}>{record.ApproverID || "-"}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={labelStyle}>REMARKS</Typography>
              <Typography sx={valueStyle}>{record.ApprovalRemarks || "-"}</Typography>
            </Grid>
          </Grid>

          <Divider />

          {/* META */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography sx={labelStyle}>CREATED AT</Typography>
              <Typography sx={valueStyle}>{formatDate(record.CreatedAt)}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={labelStyle}>UPDATED AT</Typography>
              <Typography sx={valueStyle}>{formatDate(record.UpdatedAt)}</Typography>
            </Grid>
          </Grid>

        </Stack>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`
      }}>
        <Button
          onClick={onClose}
          startIcon={<CloseSharp />}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRegularization;