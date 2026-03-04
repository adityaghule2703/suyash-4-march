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
//   Box,
//   Paper,
//   Avatar,
//   Card,
//   CardContent,
//   Stepper,
//   Step,
//   StepLabel,
//   Stack,
//   CircularProgress,
//   Alert
// } from "@mui/material";
// import {
//   Close as CloseIcon,
//   Business as BusinessIcon,
//   CalendarToday as CalendarIcon,
//   MonetizationOn as MoneyIcon,
//   LocalHospital as HospitalIcon,
//   People as PeopleIcon,
//   CheckCircle as CheckCircleIcon,
//   Pending as PendingIcon
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const steps = ["Basic Info", "Coverage & Premium", "Hospitals & Enrollments"];

// const PRIMARY_GRADIENT =
//   "linear-gradient(135deg,#164e63,#0ea5e9)";

// const ViewPolicy = ({ open, onClose, policyId }) => {
//   const [policy, setPolicy] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeStep, setActiveStep] = useState(0);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (open && policyId) fetchPolicy();
//   }, [open, policyId]);

//   const fetchPolicy = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         setPolicy({
//           ...res.data.data,
//           networkHospitals: res.data.data.networkHospitals || [],
//           enrollments: res.data.data.enrollments || []
//         });
//       }
//     } catch (err) {
//       setError("Failed to load policy details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date) =>
//     date ? new Date(date).toLocaleDateString("en-IN") : "-";

//   const formatCurrency = (val) =>
//     `₹ ${Number(val || 0).toLocaleString("en-IN")}`;

//   const getStatusChip = (status) => {
//     if (status === "active")
//       return (
//         <Chip
//           label="Active"
//           icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
//           sx={{
//             backgroundColor: "#E8F5E9",
//             color: "#2E7D32",
//             fontWeight: 600
//           }}
//         />
//       );

//     return (
//       <Chip
//         label="Inactive"
//         icon={<PendingIcon sx={{ fontSize: 14 }} />}
//         sx={{
//           backgroundColor: "#FFEBEE",
//           color: "#C62828",
//           fontWeight: 600
//         }}
//       />
//     );
//   };

//   const StatCard = ({ icon, label, value, color }) => (
//     <Card
//       sx={{
//         backgroundColor: "#F8FAFC",
//         border: "1px solid #E0E0E0",
//         borderRadius: 1,
//         boxShadow: "none"
//       }}
//     >
//       <CardContent
//         sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}
//       >
//         <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
//           {icon}
//         </Avatar>
//         <Box>
//           <Typography variant="caption" sx={{ color: "#666" }}>
//             {label}
//           </Typography>
//           <Typography variant="body2" fontWeight={600}>
//             {value}
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   const Section = ({ title, children }) => (
//     <Paper
//       sx={{
//         p: 2,
//         border: "1px solid #E0E0E0",
//         borderRadius: 1
//       }}
//     >
//       <Typography
//         variant="subtitle2"
//         sx={{ mb: 1, fontWeight: 600, color: "#1976D2" }}
//       >
//         {title}
//       </Typography>
//       {children}
//     </Paper>
//   );

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{
//           background: PRIMARY_GRADIENT,
//           color: "#fff",
//           fontWeight: 600
//         }}
//       >
//         Policy Details – {policy?.policyId || ""}
//       </DialogTitle>

//       {policy && (
//         <Box sx={{ px: 4, pt: 3 }}>
//           <Stepper activeStep={activeStep} alternativeLabel>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Box>
//       )}

//       <DialogContent sx={{ px: 4, py: 3 }}>
//         {loading ? (
//           <Stack alignItems="center" py={4}>
//             <CircularProgress />
//           </Stack>
//         ) : error ? (
//           <Alert severity="error">{error}</Alert>
//         ) : policy ? (
//           <Stack spacing={3}>
//             {/* STEP 1 */}
//             {activeStep === 0 && (
//               <>
//                 <Grid container spacing={2}>
//                   <Grid item xs={3}>
//                     <StatCard
//                       icon={<BusinessIcon />}
//                       label="Insurer"
//                       value={policy.insurer}
//                       color="#1976D2"
//                     />
//                   </Grid>
//                   <Grid item xs={3}>
//                     <StatCard
//                       icon={<MoneyIcon />}
//                       label="Coverage"
//                       value={formatCurrency(policy.coverageAmount)}
//                       color="#2E7D32"
//                     />
//                   </Grid>
//                   <Grid item xs={3}>
//                     <StatCard
//                       icon={<CalendarIcon />}
//                       label="Validity"
//                       value={formatDate(policy.validityEnd)}
//                       color="#F44336"
//                     />
//                   </Grid>
//                   <Grid item xs={3}>
//                     <StatCard
//                       icon={<CheckCircleIcon />}
//                       label="Status"
//                       value={getStatusChip(policy.status)}
//                       color="#FF9800"
//                     />
//                   </Grid>
//                 </Grid>

//                 <Section title="Basic Information">
//                   <Typography><b>Policy Name:</b> {policy.policyName}</Typography>
//                   <Typography><b>Policy Number:</b> {policy.policyNumber}</Typography>
//                   <Typography>
//                     <b>Validity:</b> {formatDate(policy.validityStart)} -{" "}
//                     {formatDate(policy.validityEnd)}
//                   </Typography>
//                 </Section>
//               </>
//             )}

//             {/* STEP 2 */}
//             {activeStep === 1 && (
//               <Section title="Premium & Coverage">
//                 <Typography>
//                   <b>Amount Per Employee:</b>{" "}
//                   {formatCurrency(policy.premiumDetails?.amountPerEmployee)}
//                 </Typography>
//                 <Typography>
//                   <b>Total Premium:</b>{" "}
//                   {formatCurrency(policy.premiumDetails?.totalPremium)}
//                 </Typography>
//                 <Typography>
//                   <b>Payment Frequency:</b>{" "}
//                   {policy.premiumDetails?.paymentFrequency}
//                 </Typography>
//                 <Typography>
//                   <b>Payment Status:</b>{" "}
//                   {policy.premiumDetails?.paymentStatus}
//                 </Typography>

//                 <Box mt={2}>
//                   <Typography fontWeight={600}>Family Coverage:</Typography>
//                   <Stack direction="row" spacing={1} mt={1}>
//                     {policy.familyCoverage?.spouse && (
//                       <Chip label="Spouse" />
//                     )}
//                     {policy.familyCoverage?.children && (
//                       <Chip label="Children" />
//                     )}
//                     {policy.familyCoverage?.parents && (
//                       <Chip label="Parents" />
//                     )}
//                   </Stack>
//                 </Box>
//               </Section>
//             )}

//             {/* STEP 3 */}
//             {activeStep === 2 && (
//               <>
//                 <Section title="Network Hospitals">
//                   {policy.networkHospitals.length === 0 ? (
//                     <Typography>No hospitals listed</Typography>
//                   ) : (
//                     policy.networkHospitals.map((h, i) => (
//                       <Paper key={i} sx={{ p: 1.5, mb: 1 }}>
//                         <Typography fontWeight={600}>{h.name}</Typography>
//                         <Typography variant="body2">{h.city}</Typography>
//                       </Paper>
//                     ))
//                   )}
//                 </Section>

//                 <Section title="Enrollments">
//                   {policy.enrollments.length === 0 ? (
//                     <Typography>No enrollments found</Typography>
//                   ) : (
//                     policy.enrollments.map((e) => (
//                       <Paper key={e._id} sx={{ p: 1.5, mb: 1 }}>
//                         <Typography>
//                           {e.employeeId?.FirstName}{" "}
//                           {e.employeeId?.LastName}
//                         </Typography>
//                         <Chip
//                           label={e.status}
//                           size="small"
//                           color={
//                             e.status === "active"
//                               ? "success"
//                               : "error"
//                           }
//                         />
//                       </Paper>
//                     ))
//                   )}
//                 </Section>
//               </>
//             )}
//           </Stack>
//         ) : null}
//       </DialogContent>

//       <DialogActions sx={{ px: 4, pb: 3 }}>
//         <Button onClick={onClose}>Close</Button>

//         {activeStep > 0 && (
//           <Button onClick={() => setActiveStep((prev) => prev - 1)}>
//             Back
//           </Button>
//         )}

//         {activeStep < 2 && (
//           <Button
//             variant="contained"
//             onClick={() => setActiveStep((prev) => prev + 1)}
//           >
//             Next
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewPolicy;

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
  Box,
  Paper,
  Avatar,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Stack,
  CircularProgress,
  Alert,
  IconButton
} from "@mui/material";
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  MonetizationOn as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

const steps = [
  "Basic Info",
  "Coverage & Premium",
  "Hospitals & Enrollments"
];

const PRIMARY_GRADIENT =
  "linear-gradient(135deg,#164e63,#0ea5e9)";

const ViewPolicy = ({ open, onClose, policyId }) => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");

  /* ================= RESET ================= */
  const resetState = () => {
    setPolicy(null);
    setActiveStep(0);
    setError("");
  };

  useEffect(() => {
    if (open && policyId) fetchPolicy();
    if (!open) resetState();
  }, [open, policyId]);

  /* ================= FETCH ================= */
  const fetchPolicy = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/mediclaim/policies/${policyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setPolicy({
          ...res.data.data,
          networkHospitals:
            res.data.data.networkHospitals || [],
          enrollments: res.data.data.enrollments || []
        });
      } else {
        setError("Policy not found");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load policy details"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString("en-IN");
    } catch {
      return "-";
    }
  };

  const formatCurrency = (val) =>
    `₹ ${Number(val || 0).toLocaleString("en-IN")}`;

  const getStatusChip = (status) => {
    const map = {
      active: {
        label: "Active",
        color: "#2E7D32",
        bg: "#E8F5E9",
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />
      },
      expired: {
        label: "Expired",
        color: "#C62828",
        bg: "#FFEBEE",
        icon: <CancelIcon sx={{ fontSize: 14 }} />
      },
      cancelled: {
        label: "Cancelled",
        color: "#6A1B9A",
        bg: "#F3E5F5",
        icon: <CancelIcon sx={{ fontSize: 14 }} />
      },
      draft: {
        label: "Draft",
        color: "#EF6C00",
        bg: "#FFF3E0",
        icon: <PendingIcon sx={{ fontSize: 14 }} />
      }
    };

    const config = map[status] || map["draft"];

    return (
      <Chip
        label={config.label}
        icon={config.icon}
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600
        }}
      />
    );
  };

  const StatCard = ({ icon, label, value, color }) => (
    <Card
      sx={{
        backgroundColor: "#F8FAFC",
        border: "1px solid #E0E0E0",
        borderRadius: 1,
        boxShadow: "none"
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.5
        }}
      >
        <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "#666" }}
          >
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const Section = ({ title, children }) => (
    <Paper
      sx={{
        p: 2,
        border: "1px solid #E0E0E0",
        borderRadius: 1
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          fontWeight: 600,
          color: "#1976D2"
        }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );

  /* ================= UI ================= */

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: PRIMARY_GRADIENT,
          color: "#fff",
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Policy Details – {policy?.policyId || ""}
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {policy && (
        <Box sx={{ px: 4, pt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      <DialogContent sx={{ px: 4, py: 3 }}>
        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : policy ? (
          <Stack spacing={3}>
            {/* STEP 1 */}
            {activeStep === 0 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <StatCard
                      icon={<BusinessIcon />}
                      label="Insurer"
                      value={policy.insurer || "-"}
                      color="#1976D2"
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <StatCard
                      icon={<MoneyIcon />}
                      label="Coverage"
                      value={formatCurrency(
                        policy.coverageAmount
                      )}
                      color="#2E7D32"
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <StatCard
                      icon={<CalendarIcon />}
                      label="Valid Till"
                      value={formatDate(
                        policy.validityEnd
                      )}
                      color="#F44336"
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <StatCard
                      icon={<CheckCircleIcon />}
                      label="Status"
                      value={getStatusChip(
                        policy.status
                      )}
                      color="#FF9800"
                    />
                  </Grid>
                </Grid>

                <Section title="Basic Information">
                  <Typography>
                    <b>Policy Name:</b>{" "}
                    {policy.policyName}
                  </Typography>
                  <Typography>
                    <b>Policy Number:</b>{" "}
                    {policy.policyNumber}
                  </Typography>
                  <Typography>
                    <b>Validity:</b>{" "}
                    {formatDate(policy.validityStart)} –{" "}
                    {formatDate(policy.validityEnd)}
                  </Typography>
                </Section>
              </>
            )}

            {/* STEP 2 */}
            {activeStep === 1 && (
              <Section title="Premium & Coverage">
                <Typography>
                  <b>Amount Per Employee:</b>{" "}
                  {formatCurrency(
                    policy.premiumDetails
                      ?.amountPerEmployee
                  )}
                </Typography>

                <Typography>
                  <b>Total Premium:</b>{" "}
                  {formatCurrency(
                    policy.premiumDetails?.totalPremium
                  )}
                </Typography>

                <Typography>
                  <b>Payment Frequency:</b>{" "}
                  {policy.premiumDetails
                    ?.paymentFrequency || "-"}
                </Typography>

                <Typography>
                  <b>Payment Status:</b>{" "}
                  {policy.premiumDetails
                    ?.paymentStatus || "-"}
                </Typography>

                <Box mt={2}>
                  <Typography fontWeight={600}>
                    Family Coverage:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    mt={1}
                  >
                    {policy.familyCoverage?.spouse && (
                      <Chip label="Spouse" />
                    )}
                    {policy.familyCoverage?.children && (
                      <Chip label="Children" />
                    )}
                    {policy.familyCoverage?.parents && (
                      <Chip label="Parents" />
                    )}
                  </Stack>
                </Box>
              </Section>
            )}

            {/* STEP 3 */}
            {activeStep === 2 && (
              <>
                <Section title="Network Hospitals">
                  {policy.networkHospitals.length ===
                  0 ? (
                    <Typography>
                      No hospitals listed
                    </Typography>
                  ) : (
                    policy.networkHospitals.map(
                      (h, i) => (
                        <Paper
                          key={i}
                          sx={{
                            p: 1.5,
                            mb: 1
                          }}
                        >
                          <Typography fontWeight={600}>
                            {h.name}
                          </Typography>
                          <Typography variant="body2">
                            {h.city}
                          </Typography>
                          <Typography variant="caption">
                            {h.distance}
                          </Typography>
                        </Paper>
                      )
                    )
                  )}
                </Section>

                <Section title="Enrollments">
                  {policy.enrollments.length === 0 ? (
                    <Typography>
                      No enrollments found
                    </Typography>
                  ) : (
                    policy.enrollments.map((e) => (
                      <Paper
                        key={e._id}
                        sx={{
                          p: 1.5,
                          mb: 1
                        }}
                      >
                        <Typography>
                          {e.employeeId?.FirstName}{" "}
                          {e.employeeId?.LastName}
                        </Typography>

                        <Chip
                          label={e.status}
                          size="small"
                          color={
                            e.status === "active"
                              ? "success"
                              : "error"
                          }
                        />
                      </Paper>
                    ))
                  )}
                </Section>
              </>
            )}
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3 }}>
        <Button onClick={onClose}>Close</Button>

        {activeStep > 0 && (
          <Button
            onClick={() =>
              setActiveStep((prev) => prev - 1)
            }
          >
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={() =>
              setActiveStep((prev) => prev + 1)
            }
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewPolicy;