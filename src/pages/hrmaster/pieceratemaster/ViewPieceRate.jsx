// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Grid,
//   TextField,
//   Chip,
//   Typography,
//   Divider,
//   Paper,
//   Box,
// } from "@mui/material";
// import { CloseSharp } from "@mui/icons-material";

// const ViewPieceRate = ({ open, onClose, pieceRate }) => {
//   if (!pieceRate) return null;

//   const formatDate = (date) => {
//     if (!date) return "-";
//     return new Date(date).toLocaleDateString("en-IN");
//   };

//   const getDepartmentName = () => {
//     if (!pieceRate.departmentId) return "Not Assigned";

//     if (typeof pieceRate.departmentId === "object") {
//       return pieceRate.departmentId.DepartmentName || "Not Assigned";
//     }

//     return pieceRate.departmentId;
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{
//           background: "linear-gradient(135deg,#164e63,#0ea5e9)",
//           color: "#fff",
//           fontWeight: 600,
//           fontSize: 20,
//         }}
//       >
//         View Piece Rate
//       </DialogTitle>

//       <DialogContent sx={{ p: 1 }}>
//         <Paper sx={{ p: 2, borderRadius: 3, margin: 2 }}>
//           <Typography variant="h6" fontWeight={600} mb={2}>
//             Piece Rate Details
//           </Typography>

//           <Divider sx={{ mb: 3 }} />

//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Product Type"
//                 fullWidth
//                 value={pieceRate.productType || "-"}
//                 InputProps={{ readOnly: true }}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Operation"
//                 fullWidth
//                 value={pieceRate.operation || "-"}
//                 InputProps={{ readOnly: true }}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Rate Per Unit"
//                 fullWidth
//                 value={`₹ ${pieceRate.ratePerUnit}`}
//                 InputProps={{ readOnly: true }}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Unit of Measure"
//                 fullWidth
//                 value={pieceRate.uom}
//                 InputProps={{ readOnly: true }}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Skill Level"
//                 fullWidth
//                 value={pieceRate.skillLevel}
//                 InputProps={{ readOnly: true }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 label="Department"
//                 fullWidth
//                 value={getDepartmentName()}
//                 InputProps={{ readOnly: true }}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Effective From"
//                 fullWidth
//                 value={formatDate(pieceRate.effectiveFrom)}
//                 InputProps={{ readOnly: true }}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Effective To"
//                 fullWidth
//                 value={formatDate(pieceRate.effectiveTo)}
//                 InputProps={{ readOnly: true }}
//               />
//             </Grid>
//           </Grid>
//         </Paper>
//       </DialogContent>

//       <DialogActions sx={{ px: 4, pb: 3 }}>
//                           <Button
//           variant="contained"
//           onClick={onClose}
//           startIcon={<CloseSharp />}
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
//           Close
//         </Button>                                                                                                        
 
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewPieceRate;

import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Grid, Box, Divider
} from "@mui/material";
import { CloseSharp } from "@mui/icons-material";

/* 🎨 SAME DESIGN SYSTEM */
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8"
  },
  border: "#E3E8EF"
};

const ViewPieceRate = ({ open, onClose, pieceRate }) => {
  if (!pieceRate) return null;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const getDepartmentName = () => {
    if (!pieceRate.departmentId) return "Not Assigned";

    if (typeof pieceRate.departmentId === "object") {
      return pieceRate.departmentId.DepartmentName || "Not Assigned";
    }

    return pieceRate.departmentId;
  };

  /* ================= COMMON STYLES ================= */
  const labelStyle = {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: "0.5px"
  };

  const valueStyle = {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: COLORS.text.primary,
    mt: 0.5
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
          border: `1px solid ${COLORS.border}`
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        px: 2.5,
        py: 1.5
      }}>
        <Typography sx={{
          fontWeight: 700,
          fontSize: "1.2rem",
          color: COLORS.text.primary
        }}>
          View Piece Rate
        </Typography>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5 }}>
        <Grid container spacing={2}>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>PRODUCT TYPE</Typography>
            <Typography sx={valueStyle}>
              {pieceRate.productType || "-"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>OPERATION</Typography>
            <Typography sx={valueStyle}>
              {pieceRate.operation || "-"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>RATE PER UNIT</Typography>
            <Typography sx={valueStyle}>
              ₹ {pieceRate.ratePerUnit || 0}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>UNIT</Typography>
            <Typography sx={valueStyle}>
              {pieceRate.uom || "-"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>SKILL LEVEL</Typography>
            <Typography sx={valueStyle}>
              {pieceRate.skillLevel || "-"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>DEPARTMENT</Typography>
            <Typography sx={valueStyle}>
              {getDepartmentName()}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>EFFECTIVE FROM</Typography>
            <Typography sx={valueStyle}>
              {formatDate(pieceRate.effectiveFrom)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>EFFECTIVE TO</Typography>
            <Typography sx={valueStyle}>
              {formatDate(pieceRate.effectiveTo)}
            </Typography>
          </Grid>

        </Grid>

        <Divider sx={{ mt: 2 }} />
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

export default ViewPieceRate;