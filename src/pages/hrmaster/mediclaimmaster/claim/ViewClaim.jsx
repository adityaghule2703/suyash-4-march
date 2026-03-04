import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Alert,
  Button,
  Box,
} from "@mui/material";

import {
  Close as CloseIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../../config/Config";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)";

const ViewClaim = ({ open, onClose, claimId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [claimData, setClaimData] = useState(null);

  /* ---------------- FETCH CLAIM ---------------- */

  useEffect(() => {
    if (open && claimId) {
      fetchClaim();
    }
  }, [open, claimId]);

  const fetchClaim = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/mediclaim/claims/${claimId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setClaimData(res.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch claim details"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "under_review":
        return "warning";
      default:
        return "default";
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          background: HEADER_GRADIENT,
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Claim Details
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {loading && <CircularProgress />}

        {error && <Alert severity="error">{error}</Alert>}

        {claimData && (
          <Stack spacing={3}>

            {/* BASIC INFO */}
            <Box>
              <Typography variant="h6">
                Claim ID: {claimData.claimId}
              </Typography>

              <Chip
                label={claimData.status.toUpperCase()}
                color={getStatusColor(claimData.status)}
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider />

            {/* PATIENT DETAILS */}
            <Typography variant="h6">Patient Details</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>
                  Name: {claimData.patientDetails?.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  Relationship: {claimData.patientDetails?.relationship}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  Age: {claimData.patientDetails?.age}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  Gender: {claimData.patientDetails?.gender}
                </Typography>
              </Grid>
            </Grid>

            <Divider />

            {/* HOSPITAL DETAILS */}
            <Typography variant="h6">Hospital Details</Typography>

            <Typography>
              Hospital: {claimData.hospitalName}
            </Typography>

            <Typography>
              Address: {claimData.hospitalAddress}
            </Typography>

            <Typography>
              Admission:{" "}
              {new Date(claimData.admissionDate).toLocaleDateString()}
            </Typography>

            <Typography>
              Discharge:{" "}
              {new Date(claimData.dischargeDate).toLocaleDateString()}
            </Typography>

            <Divider />

            {/* MEDICAL DETAILS */}
            <Typography variant="h6">Medical Details</Typography>

            <Typography>
              Diagnosis: {claimData.diagnosis}
            </Typography>

            <Typography>
              Treatment: {claimData.treatment}
            </Typography>

            <Typography>
              Claimed Amount: ₹{claimData.claimedAmount}
            </Typography>

            {claimData.approvedAmount && (
              <Typography color="green">
                Approved Amount: ₹{claimData.approvedAmount}
              </Typography>
            )}

            <Divider />

            {/* DOCUMENTS */}
            <Typography variant="h6">Documents</Typography>

            {claimData.documents?.map((doc) => (
              <Box key={doc._id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DescriptionIcon />
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.name}
                </a>
              </Box>
            ))}

            <Divider />

            {/* STATUS HISTORY */}
            <Typography variant="h6">Status Timeline</Typography>

            {claimData.statusHistory?.map((history) => (
              <Box
                key={history._id}
                sx={{
                  borderLeft: "3px solid #0ea5e9",
                  pl: 2,
                  mb: 2,
                }}
              >
                <Typography fontWeight={600}>
                  {history.status.toUpperCase()}
                </Typography>

                <Typography variant="body2">
                  Updated By: {history.updatedBy}
                </Typography>

                <Typography variant="body2">
                  {new Date(history.updatedAt).toLocaleString()}
                </Typography>

                {history.comments && (
                  <Typography variant="body2">
                    Comments: {history.comments}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewClaim;