import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Box,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Paper,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Close,
  Description,
  Policy,
  People,
  CheckCircle,
  Cancel,
  CalendarToday,
  AttachMoney,
  LocalHospital,
  Person,
  Phone,
  Email,
  LocationOn,
  Info,
  FamilyRestroom,
  Percent,
  Payment,
  Event,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

const PRIMARY_GRADIENT = "linear-gradient(135deg, #0B4F6C 0%, #1C7C9C 100%)";

const steps = [
  { label: "Enrollment Info", icon: <Description /> },
  { label: "Policy Details", icon: <Policy /> },
  { label: "Members & Nominee", icon: <People /> },
];

const ViewEnrollment = ({ open, onClose, enrollmentId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open && enrollmentId) fetchEnrollment();
  }, [open, enrollmentId]);

  const fetchEnrollment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/mediclaim/enrollments/${enrollmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const InfoRow = ({ icon, label, value, color = "text.secondary", tooltip }) => (
    <Tooltip title={tooltip || ""} arrow placement="top-start" disableHoverListener={!tooltip}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 0.5 }}>
        <Avatar sx={{ bgcolor: "transparent", color: "#1C7C9C", width: 20, height: 20 }}>
          {icon}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={500} color={color}>
            {value || "-"}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );

  const SectionCard = ({ title, children, icon }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: "#F8FAFC",
        borderRadius: 2,
        border: "1px solid #E2E8F0",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#1C7C9C",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Avatar sx={{ bgcolor: "#1C7C9C", width: 28, height: 28 }}>
          {icon}
        </Avatar>
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#0B4F6C" }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  );

  const renderStepContent = () => {
    if (!data) return null;

    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Enrollment Information */}
            <SectionCard title="Enrollment Information" icon={<Description fontSize="small" />}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Description fontSize="small" />}
                    label="Enrollment ID"
                    value={data.enrollmentId}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Policy fontSize="small" />}
                    label="Insurance ID"
                    value={data.insuranceId}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip
                      label={data.status}
                      size="small"
                      color={getStatusColor(data.status)}
                      sx={{ height: 24, textTransform: "capitalize" }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Premium:
                    </Typography>
                    <Chip
                      label={data.premiumPaid ? "Paid" : "Unpaid"}
                      size="small"
                      color={data.premiumPaid ? "success" : "error"}
                      icon={data.premiumPaid ? <CheckCircle /> : <Cancel />}
                      sx={{ height: 24 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Person fontSize="small" />}
                    label="Enrolled By"
                    value={data.enrolledBy}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Payment Details */}
            <SectionCard title="Payment Details" icon={<Payment fontSize="small" />}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<AttachMoney fontSize="small" />}
                    label="Premium Amount"
                    value={`₹ ${data.premiumAmount?.toLocaleString()}`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<CalendarToday fontSize="small" />}
                    label="Enrollment Date"
                    value={formatDateTime(data.enrollmentDate)}
                  />
                </Grid>
                {data.paymentDate && (
                  <Grid item xs={12}>
                    <InfoRow
                      icon={<Event fontSize="small" />}
                      label="Payment Date"
                      value={formatDateTime(data.paymentDate)}
                    />
                  </Grid>
                )}
              </Grid>
            </SectionCard>

            {/* Communication Details */}
            <SectionCard title="Communication Details" icon={<Info fontSize="small" />}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Email fontSize="small" />}
                    label="Email"
                    value={data.communicationDetails?.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Phone fontSize="small" />}
                    label="Phone"
                    value={data.communicationDetails?.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<LocationOn fontSize="small" />}
                    label="Address"
                    value={data.communicationDetails?.address}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Notifications Status */}
            <SectionCard title="Notifications" icon={<Info fontSize="small" />}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Tooltip title="Enrollment Email">
                    <Chip
                      label="Email"
                      size="small"
                      color={data.notificationsSent?.enrollmentEmail ? "success" : "default"}
                      icon={data.notificationsSent?.enrollmentEmail ? <CheckCircle /> : <Cancel />}
                      sx={{ height: 24, width: "100%" }}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={4}>
                  <Tooltip title="Welcome SMS">
                    <Chip
                      label="SMS"
                      size="small"
                      color={data.notificationsSent?.welcomeSms ? "success" : "default"}
                      icon={data.notificationsSent?.welcomeSms ? <CheckCircle /> : <Cancel />}
                      sx={{ height: 24, width: "100%" }}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={4}>
                  <Tooltip title="Renewal Reminder">
                    <Chip
                      label="Renewal"
                      size="small"
                      color={data.notificationsSent?.renewalReminder ? "success" : "default"}
                      icon={data.notificationsSent?.renewalReminder ? <CheckCircle /> : <Cancel />}
                      sx={{ height: 24, width: "100%" }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </SectionCard>

            {/* Timestamps */}
            <SectionCard title="System Information" icon={<Info fontSize="small" />}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Event fontSize="small" />}
                    label="Created At"
                    value={formatDateTime(data.createdAt)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Event fontSize="small" />}
                    label="Last Updated"
                    value={formatDateTime(data.updatedAt)}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Basic Policy Info */}
            <SectionCard title={data.policyId?.policyName} icon={<Policy fontSize="small" />}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<LocalHospital fontSize="small" />}
                    label="Insurer"
                    value={data.policyId?.insurer}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Policy fontSize="small" />}
                    label="Policy Number"
                    value={data.policyId?.policyNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Description fontSize="small" />}
                    label="Policy ID"
                    value={data.policyId?.policyId}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={data.policyId?.status}
                    size="small"
                    color={getStatusColor(data.policyId?.status)}
                    sx={{ height: 24, textTransform: "capitalize" }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Coverage Details */}
            <SectionCard title="Coverage Details" icon={<AttachMoney fontSize="small" />}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<AttachMoney fontSize="small" />}
                    label="Coverage Amount"
                    value={`₹ ${data.policyId?.coverageAmount?.toLocaleString()}`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Description fontSize="small" />}
                    label="Coverage Type"
                    value={data.policyId?.coverageType?.replace("_", " ")}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* Family Coverage */}
            {data.policyId?.familyCoverage && (
              <SectionCard title="Family Coverage" icon={<FamilyRestroom fontSize="small" />}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Chip
                      label={`Spouse: ${data.policyId.familyCoverage.spouse ? "Covered" : "Not Covered"}`}
                      size="small"
                      color={data.policyId.familyCoverage.spouse ? "success" : "default"}
                      sx={{ height: 24, width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={`Children: ${data.policyId.familyCoverage.children ? "Covered" : "Not Covered"}`}
                      size="small"
                      color={data.policyId.familyCoverage.children ? "success" : "default"}
                      sx={{ height: 24, width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={`Parents: ${data.policyId.familyCoverage.parents ? "Covered" : "Not Covered"}`}
                      size="small"
                      color={data.policyId.familyCoverage.parents ? "success" : "default"}
                      sx={{ height: 24, width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Max Children: {data.policyId.familyCoverage.maxChildren}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Child Age Limit: {data.policyId.familyCoverage.childAgeLimit} years
                    </Typography>
                  </Grid>
                </Grid>
              </SectionCard>
            )}

            {/* Premium Details */}
            {data.policyId?.premiumDetails && (
              <SectionCard title="Premium Details" icon={<Payment fontSize="small" />}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <InfoRow
                      icon={<AttachMoney fontSize="small" />}
                      label="Amount per Employee"
                      value={`₹ ${data.policyId.premiumDetails.amountPerEmployee?.toLocaleString()}`}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InfoRow
                      icon={<AttachMoney fontSize="small" />}
                      label="Total Premium"
                      value={`₹ ${data.policyId.premiumDetails.totalPremium?.toLocaleString()}`}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Payment Frequency
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ textTransform: "capitalize" }}>
                      {data.policyId.premiumDetails.paymentFrequency}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Chip
                      label={data.policyId.premiumDetails.paymentStatus}
                      size="small"
                      color={data.policyId.premiumDetails.paymentStatus === "paid" ? "success" : "warning"}
                      sx={{ height: 24, textTransform: "capitalize" }}
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            )}

            {/* Validity Period */}
            <SectionCard title="Validity Period" icon={<CalendarToday fontSize="small" />}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    From
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(data.policyId?.validityStart)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    To
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(data.policyId?.validityEnd)}
                  </Typography>
                </Grid>
              </Grid>
            </SectionCard>

            {/* Network Hospitals */}
            <SectionCard title="Network Hospitals" icon={<LocalHospital fontSize="small" />}>
              <Stack spacing={1.5}>
                {data.policyId?.networkHospitals?.map((h, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: "white",
                      borderRadius: 1.5,
                      border: "1px solid #E2E8F0",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#1C7C9C",
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {h.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {h.city}
                      </Typography>
                      {h.distance && (
                        <Typography variant="caption" color="text.secondary">
                          • {h.distance}
                        </Typography>
                      )}
                      {h.type && (
                        <Typography variant="caption" color="text.secondary">
                          • {h.type}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}
                {(!data.policyId?.networkHospitals || data.policyId.networkHospitals.length === 0) && (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No network hospitals listed
                  </Typography>
                )}
              </Stack>
            </SectionCard>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Coverage Members */}
            <SectionCard title="Covered Members" icon={<People fontSize="small" />}>
              <Stack spacing={1.5}>
                {data.coverageDetails?.members?.map((m, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: "white",
                      borderRadius: 1.5,
                      border: "1px solid #E2E8F0",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#1C7C9C",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {m.name}
                      </Typography>
                      <Chip
                        label={m.relationship}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem", bgcolor: "#EFF6FF", color: "#1C7C9C" }}
                      />
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Age
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                          {m.age || calculateAge(m.dateOfBirth)} years
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Gender
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                          {m.gender === "M" ? "Male" : m.gender === "F" ? "Female" : "Other"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Status
                        </Typography>
                        <Chip
                          label={m.isActive ? "Active" : "Inactive"}
                          size="small"
                          color={m.isActive ? "success" : "default"}
                          sx={{ height: 16, fontSize: "0.6rem" }}
                        />
                      </Grid>
                    </Grid>
                    {m.dateOfBirth && (
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        DOB: {formatDate(m.dateOfBirth)}
                      </Typography>
                    )}
                    {m.addedAt && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Added: {formatDateTime(m.addedAt)}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            </SectionCard>

            {/* Nominee Details */}
            <SectionCard title="Nominee Details" icon={<Percent fontSize="small" />}>
              <Stack spacing={1.5}>
                {data.nomineeDetails?.map((n, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: "white",
                      borderRadius: 1.5,
                      border: "1px solid #E2E8F0",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#1C7C9C",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {n.name}
                      </Typography>
                      <Chip
                        label={`${n.percentage}%`}
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Relationship: {n.relationship}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </SectionCard>

            {/* Coverage Summary */}
            <SectionCard title="Coverage Summary" icon={<Info fontSize="small" />}>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Total Members
                  </Typography>
                  <Typography variant="h6" color="#1C7C9C">
                    {data.coverageDetails?.members?.length || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Total Nominees
                  </Typography>
                  <Typography variant="h6" color="#1C7C9C">
                    {data.nomineeDetails?.length || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Coverage Amount
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#0B4F6C">
                    ₹ {data.coverageDetails?.amount?.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Start Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(data.coverageDetails?.startDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    End Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(data.coverageDetails?.endDate)}
                  </Typography>
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: PRIMARY_GRADIENT,
          color: "#fff",
          py: 2.5,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 40, height: 40 }}>
            <Description sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Enrollment Details
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {data?.enrollmentId || "View complete enrollment information"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "#fff",
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, minHeight: 450, bgcolor: "#FFFFFF" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#1C7C9C" }} />
            <Typography variant="body2" color="text.secondary">
              Loading enrollment details...
            </Typography>
          </Box>
        ) : data ? (
          <>
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 4, 
                mt: 1,
                "& .MuiStepConnector-line": {
                  borderColor: "#E2E8F0",
                },
              }}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel 
                    StepIconComponent={() => (
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: activeStep >= index ? "#1C7C9C" : "#E2E8F0",
                          color: activeStep >= index ? "#fff" : "#64748B",
                          transition: "all 0.3s",
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    )}
                  >
                    <Typography variant="body2" fontWeight={activeStep === index ? 600 : 400}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent()}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
              gap: 2,
            }}
          >
            <Description sx={{ fontSize: 64, color: "#E2E8F0" }} />
            <Typography variant="h6" color="text.secondary">
              No enrollment data found
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              The enrollment you're looking for doesn't exist or you don't have permission to view it.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: "1px solid #E2E8F0", bgcolor: "#F8FAFC" }}>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
          sx={{
            color: "#64748B",
            "&:hover": { bgcolor: "#E2E8F0" },
            "&:disabled": { color: "#CBD5E1" },
          }}
        >
          Back
        </Button>
        <Box sx={{ flex: 1 }} />
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setActiveStep((prev) => prev + 1)}
            sx={{
              background: PRIMARY_GRADIENT,
              px: 4,
              py: 1,
              "&:hover": {
                opacity: 0.9,
                background: PRIMARY_GRADIENT,
              },
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              background: PRIMARY_GRADIENT,
              px: 4,
              py: 1,
              "&:hover": {
                opacity: 0.9,
                background: PRIMARY_GRADIENT,
              },
            }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewEnrollment;