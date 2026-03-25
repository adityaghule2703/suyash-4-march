// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Alert,
//   Paper,
//   Stack,
//   IconButton
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   WarningAmber as WarningIcon,
//   Close as CloseIcon
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #a30f0f 0%, #df2a30 100%)";

// const DeleteTraining = ({ open, onClose, training, onDelete }) => {

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleDelete = async () => {

//     if (!training?._id) return;

//     setLoading(true);
//     setError("");

//     try {

//       const token = localStorage.getItem("token");

//       const response = await axios.delete(
//         `${BASE_URL}/api/trainings/delete/${training._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (response.data.success) {

//         onDelete(training._id);
//         onClose();

//       } else {
//         setError(response.data.message || "Failed to delete training record");
//       }

//     } catch (err) {

//       console.error("Error deleting training:", err);

//       setError(
//         err.response?.data?.message ||
//         "Failed to delete training record. Please try again."
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

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
//           fontSize: 22,
//           color: "#fff",
//           px: 3,
//           py: 1.5,
//           background: HEADER_GRADIENT,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center"
//         }}
//       >
//         Confirm Delete

//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* Content */}

//       <DialogContent sx={{ mt: 3 }}>
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             borderRadius: 2,
//             border: "1px solid #e2e8f0"
//           }}
//         >

//           <Stack spacing={2}>

//             <Stack direction="row" spacing={1.5} alignItems="center">
//               <WarningIcon sx={{ color: "#f59e0b", fontSize: 28 }} />

//               <Typography
//                 sx={{
//                   fontSize: "1rem",
//                   fontWeight: 500
//                 }}
//               >
//                 Are you sure you want to delete the training{" "}
//                 <strong>"{training?.trainingName}"</strong>?
//               </Typography>
//             </Stack>

//             <Typography
//               sx={{
//                 fontSize: "0.9rem",
//                 color: "#64748b"
//               }}
//             >
//               This action cannot be undone. The training record will be permanently removed from the system.
//             </Typography>

//             {error && (
//               <Alert severity="error" sx={{ borderRadius: 2 }}>
//                 {error}
//               </Alert>
//             )}

//           </Stack>

//         </Paper>
//       </DialogContent>

//       {/* Footer */}

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 1.5,
//           pt: 1.5,
//           borderTop: "1px solid #e2e8f0",
//           background: "#f8fafc"
//         }}
//       >

//         <Button
//           onClick={onClose}
//           disabled={loading}
//           sx={{
//             textTransform: "none",
//             fontWeight: 500
//           }}
//         >
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           color="error"
//           onClick={handleDelete}
//           disabled={loading}
//           startIcon={loading ? null : <DeleteIcon />}
//           sx={{
//             textTransform: "none",
//             fontWeight: 500,
//             borderRadius: 1.5,
//             px: 3,
//             backgroundColor: "#DC2626",
//             "&:hover": {
//               backgroundColor: "#B91C1C"
//             }
//           }}
//         >
//           {loading ? "Deleting..." : "Delete Training"}
//         </Button>

//       </DialogActions>

//     </Dialog>
//   );
// };

// export default DeleteTraining;

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Paper,
  Stack,
  IconButton
} from "@mui/material";
import {
  Delete as DeleteIcon,
  WarningAmber as WarningIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #a30f0f 0%, #df2a30 100%)";

const DeleteTraining = ({ open, onClose, training, onDelete }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!training) return null;

  const handleDelete = async () => {

    if (!training?._id) return;

    setLoading(true);
    setError("");

    try {

      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BASE_URL}/api/trainings/delete/${training._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {

        // notify parent component
        if (onDelete) {
          onDelete(training._id);
        }

        onClose();

      } else {
        setError(response.data.message || "Failed to delete training record");
      }

    } catch (err) {

      console.error("Delete training error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to delete training record. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {

    if (loading) return; // prevent closing while deleting

    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >

      {/* HEADER */}

      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: 22,
          color: "#fff",
          px: 3,
          py: 2,
          background: HEADER_GRADIENT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Confirm Delete

        <IconButton
          onClick={handleClose}
          sx={{ color: "#fff" }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

      </DialogTitle>

      {/* CONTENT */}

      <DialogContent sx={{ mt: 3 }}>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid #e2e8f0"
          }}
        >

          <Stack spacing={2}>

            <Stack direction="row" spacing={1.5} alignItems="center">

              <WarningIcon
                sx={{ color: "#f59e0b", fontSize: 30 }}
              />

              <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                Are you sure you want to delete the training
                <strong> "{training.trainingName}"</strong> ?
              </Typography>

            </Stack>

            <Typography
              sx={{
                fontSize: "0.9rem",
                color: "#64748b"
              }}
            >
              This action cannot be undone. The training record will be permanently removed from the system.
            </Typography>

            {training.certificateNumber && (
              <Alert severity="warning">
                This training has an associated certificate. Deleting it will remove certificate history as well.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

          </Stack>

        </Paper>

      </DialogContent>

      {/* FOOTER */}

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 2,
          borderTop: "1px solid #e2e8f0",
          background: "#f8fafc"
        }}
      >

        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            px: 3,
            backgroundColor: "#DC2626",
            "&:hover": {
              backgroundColor: "#B91C1C"
            }
          }}
        >
          {loading ? "Deleting..." : "Delete Training"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default DeleteTraining;