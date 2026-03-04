import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Box,
  Paper,
  Divider,
  Chip,
  styled,
  StepConnector,
} from "@mui/material";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../../config/Config";

/* ------------------- Custom Stepper Styling ------------------- */

const ColorConnector = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    height: 4,
    border: 0,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  "&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line":
    {
      background: "linear-gradient(90deg, #164e63, #00B4D8)",
    },
}));

const HEADER_GRADIENT =
  "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

const steps = [
  "Select Enrollment",
  "Hospital Details",
  "Patient Details",
  "Claim Details",
  "Documents",
];

const AddClaim = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    enrollmentId: "",
    claimType: "cashless",
    hospitalName: "",
    hospitalAddress: "",
    admissionDate: "",
    dischargeDate: "",
    diagnosis: "",
    treatment: "",
    claimedAmount: "",
    patientDetails: {
      name: "",
      relationship: "",
      age: "",
      gender: "",
    },
    documents: [{ name: "", url: "" }],
  });

  /* ---------------- FETCH ENROLLMENTS ---------------- */

  useEffect(() => {
    if (open) {
      fetchEnrollments();
      resetForm();
    }
  }, [open]);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/mediclaim/enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setEnrollments(res.data.data);
      }
    } catch (err) {
      console.error("Enrollment fetch error:", err);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedEnrollment(null);
    setMembers([]);
    setError("");
    setFormData({
      enrollmentId: "",
      claimType: "cashless",
      hospitalName: "",
      hospitalAddress: "",
      admissionDate: "",
      dischargeDate: "",
      diagnosis: "",
      treatment: "",
      claimedAmount: "",
      patientDetails: {
        name: "",
        relationship: "",
        age: "",
        gender: "",
      },
      documents: [{ name: "", url: "" }],
    });
  };

  /* ---------------- ENROLLMENT SELECT ---------------- */

  const handleEnrollmentSelect = (id) => {
    const enrollment = enrollments.find((e) => e._id === id);

    setSelectedEnrollment(enrollment);
    setMembers(enrollment?.coverageDetails?.members || []);

    setFormData((prev) => ({
      ...prev,
      enrollmentId: id,
      patientDetails: {
        name: "",
        relationship: "",
        age: "",
        gender: "",
      },
    }));
  };

  /* ---------------- PATIENT SELECT ---------------- */

  const handlePatientSelect = (memberId) => {
    const member = members.find((m) => m._id === memberId);

    if (!member) return;

    setFormData((prev) => ({
      ...prev,
      patientDetails: {
        name: member.name,
        relationship: member.relationship,
        age: member.age,
        gender: member.gender,
      },
    }));
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleDocumentChange = (index, field, value) => {
    const updated = [...formData.documents];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, documents: updated }));
  };

  const addDocument = () =>
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: "", url: "" }],
    }));

  const removeDocument = (index) => {
    if (formData.documents.length === 1) return;
    const updated = [...formData.documents];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, documents: updated }));
  };

  /* ---------------- VALIDATION ---------------- */

  const validateStep = () => {
    if (activeStep === 0 && !formData.enrollmentId)
      return "Please select an enrollment.";

    if (activeStep === 1) {
      if (!formData.hospitalName) return "Hospital name is required.";
      if (!formData.hospitalAddress) return "Hospital address is required.";
      if (!formData.admissionDate) return "Admission date is required.";
    }

    if (activeStep === 2 && !formData.patientDetails.name)
      return "Please select a patient.";

    if (activeStep === 3) {
      if (!formData.diagnosis) return "Diagnosis is required.";
      if (!formData.treatment) return "Treatment is required.";
      if (!formData.claimedAmount) return "Claimed amount is required.";
    }

    return null;
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prev) => prev - 1);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const payload = {
        enrollmentId: formData.enrollmentId,
        claimType: formData.claimType,
        hospitalName: formData.hospitalName,
        hospitalAddress: formData.hospitalAddress,
        admissionDate: formData.admissionDate,
        dischargeDate: formData.dischargeDate || null,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        claimedAmount: Number(formData.claimedAmount),
        patientDetails: {
          ...formData.patientDetails,
          age: Number(formData.patientDetails.age),
        },
        documents: formData.documents.filter((doc) => doc.name && doc.url),
      };

      const res = await axios.post(
        `${BASE_URL}/api/mediclaim/claims`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        onSuccess?.();
        onClose();
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit claim.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <TextField
            select
            fullWidth
            label="Select Enrollment"
            value={formData.enrollmentId}
            onChange={(e) => handleEnrollmentSelect(e.target.value)}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: 48 * 5, // 5 items visible
                  },
                },
              },
            }}
          >
            {enrollments.map((enr) => (
              <MenuItem key={enr._id} value={enr._id}>
                {enr.enrollmentId} — {enr.policyId?.policyName}
              </MenuItem>
            ))}
          </TextField>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Claim Type"
                value={formData.claimType}
                onChange={(e) => handleChange("claimType", e.target.value)}
              >
                <MenuItem value="cashless">Cashless</MenuItem>
                <MenuItem value="reimbursement">Reimbursement</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) => handleChange("hospitalName", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hospital Address"
                value={formData.hospitalAddress}
                onChange={(e) =>
                  handleChange("hospitalAddress", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                fullWidth
                label="Admission Date"
                InputLabelProps={{ shrink: true }}
                value={formData.admissionDate}
                onChange={(e) => handleChange("admissionDate", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                fullWidth
                label="Discharge Date"
                InputLabelProps={{ shrink: true }}
                value={formData.dischargeDate}
                onChange={(e) => handleChange("dischargeDate", e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <TextField
            select
            fullWidth
            label="Select Patient"
            onChange={(e) => handlePatientSelect(e.target.value)}
          >
            {members.map((m) => (
              <MenuItem key={m._id} value={m._id}>
                <PersonIcon sx={{ mr: 1 }} />
                {m.name} ({m.relationship})
              </MenuItem>
            ))}
          </TextField>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Diagnosis"
                value={formData.diagnosis}
                onChange={(e) => handleChange("diagnosis", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Treatment"
                value={formData.treatment}
                onChange={(e) => handleChange("treatment", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="number"
                fullWidth
                label="Claimed Amount"
                value={formData.claimedAmount}
                onChange={(e) => handleChange("claimedAmount", e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <>
            {formData.documents.map((doc, index) => (
              <Box key={index} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Document Name"
                      value={doc.name}
                      onChange={(e) =>
                        handleDocumentChange(index, "name", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Document URL"
                      value={doc.url}
                      onChange={(e) =>
                        handleDocumentChange(index, "url", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeDocument(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button startIcon={<AddIcon />} onClick={addDocument}>
              Add Document
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: HEADER_GRADIENT,
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Submit New Claim
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 4, mt: 3 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ background: HEADER_GRADIENT }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ background: HEADER_GRADIENT }}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddClaim;
