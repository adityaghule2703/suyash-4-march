// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Grid,
//   Typography,
//   Stack,
//   IconButton,
//   Paper,
//   Alert,
//   CircularProgress,
//   Divider
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const EditPolicy = ({ open, onClose, policyId, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [policy, setPolicy] = useState(null);

//   /* ================= FETCH POLICY ================= */
//   useEffect(() => {
//     if (open && policyId) fetchPolicy();
//     if (!open) resetState();
//   }, [open, policyId]);

//   const resetState = () => {
//     setPolicy(null);
//     setError("");
//   };

//   const fetchPolicy = async () => {
//     try {
//       setInitialLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         setPolicy(res.data.data);
//       } else {
//         setError("Policy not found");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load policy"
//       );
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   /* ================= HANDLERS ================= */
//   const handleChange = (field, value) => {
//     setPolicy(prev => ({ ...prev, [field]: value }));
//   };

//   const handlePremiumChange = (field, value) => {
//     setPolicy(prev => ({
//       ...prev,
//       premiumDetails: {
//         ...prev.premiumDetails,
//         [field]: value
//       }
//     }));
//   };

//   const handleHospitalChange = (index, field, value) => {
//     const updated = [...policy.networkHospitals];
//     updated[index][field] = value;
//     setPolicy(prev => ({ ...prev, networkHospitals: updated }));
//   };

//   const addHospital = () => {
//     setPolicy(prev => ({
//       ...prev,
//       networkHospitals: [
//         ...prev.networkHospitals,
//         { name: "", city: "", distance: "" }
//       ]
//     }));
//   };

//   const removeHospital = index => {
//     setPolicy(prev => ({
//       ...prev,
//       networkHospitals: prev.networkHospitals.filter(
//         (_, i) => i !== index
//       )
//     }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const payload = {
//         policyName: policy.policyName,
//         premiumDetails: {
//           amountPerEmployee: Number(
//             policy.premiumDetails?.amountPerEmployee
//           ),
//           totalPremium: Number(
//             policy.premiumDetails?.totalPremium
//           )
//         },
//         networkHospitals: policy.networkHospitals
//       };

//       const res = await axios.put(
//         `${BASE_URL}/api/mediclaim/policies/${policyId}`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         if (onSuccess) onSuccess();
//         onClose();
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to update policy"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{
//           background: HEADER_GRADIENT,
//           color: "#fff",
//           display: "flex",
//           justifyContent: "space-between"
//         }}
//       >
//         Edit Policy – {policy?.policyId || ""}
//         <IconButton onClick={onClose} sx={{ color: "#fff" }}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>
//         {initialLoading ? (
//           <Stack alignItems="center" py={5}>
//             <CircularProgress />
//           </Stack>
//         ) : policy ? (
//           <Stack spacing={3}>
//             {error && <Alert severity="error">{error}</Alert>}

//             {/* BASIC INFO */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600} mb={2}>
//                 Basic Information
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Policy ID"
//                     fullWidth
//                     value={policy.policyId}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Insurer"
//                     fullWidth
//                     value={policy.insurer}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Policy Number"
//                     fullWidth
//                     value={policy.policyNumber}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Coverage Amount"
//                     fullWidth
//                     value={policy.coverageAmount}
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField
//                     label="Policy Name"
//                     fullWidth
//                     value={policy.policyName}
//                     onChange={e =>
//                       handleChange(
//                         "policyName",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* PREMIUM */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600} mb={2}>
//                 Premium Details
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Amount Per Employee"
//                     type="number"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.amountPerEmployee || ""
//                     }
//                     onChange={e =>
//                       handlePremiumChange(
//                         "amountPerEmployee",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Total Premium"
//                     type="number"
//                     fullWidth
//                     value={
//                       policy.premiumDetails?.totalPremium ||
//                       ""
//                     }
//                     onChange={e =>
//                       handlePremiumChange(
//                         "totalPremium",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Payment Frequency"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.paymentFrequency || ""
//                     }
//                     disabled
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <TextField
//                     label="Payment Status"
//                     fullWidth
//                     value={
//                       policy.premiumDetails
//                         ?.paymentStatus || ""
//                     }
//                     disabled
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* NETWORK HOSPITALS */}
//             <Paper sx={{ p: 2 }}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//               >
//                 <Typography fontWeight={600}>
//                   Network Hospitals
//                 </Typography>

//                 <Button
//                   startIcon={<AddIcon />}
//                   onClick={addHospital}
//                 >
//                   Add
//                 </Button>
//               </Stack>

//               <Divider sx={{ my: 2 }} />

//               {policy.networkHospitals.map(
//                 (hospital, index) => (
//                   <Grid
//                     container
//                     spacing={2}
//                     key={index}
//                     sx={{ mb: 2 }}
//                   >
//                     <Grid item xs={4}>
//                       <TextField
//                         label="Hospital Name"
//                         fullWidth
//                         value={hospital.name}
//                         onChange={e =>
//                           handleHospitalChange(
//                             index,
//                             "name",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={4}>
//                       <TextField
//                         label="City"
//                         fullWidth
//                         value={hospital.city}
//                         onChange={e =>
//                           handleHospitalChange(
//                             index,
//                             "city",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={3}>
//                       <TextField
//                         label="Distance"
//                         fullWidth
//                         value={hospital.distance}
//                         onChange={e =>
//                           handleHospitalChange(
//                             index,
//                             "distance",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={1}>
//                       <IconButton
//                         color="error"
//                         onClick={() =>
//                           removeHospital(index)
//                         }
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Grid>
//                   </Grid>
//                 )
//               )}
//             </Paper>
//           </Stack>
//         ) : null}
//       </DialogContent>

//       <DialogActions sx={{ p: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           sx={{ background: HEADER_GRADIENT }}
//         >
//           {loading ? "Updating..." : "Update Policy"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditPolicy;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Stack,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

const EditPolicy = ({ open, onClose, policyId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");
  const [policy, setPolicy] = useState(null);

  /* ================= RESET ================= */
  const resetState = () => {
    setPolicy(null);
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    if (open && policyId) fetchPolicy();
    if (!open) resetState();
  }, [open, policyId]);

  /* ================= FETCH POLICY ================= */
  const fetchPolicy = async () => {
    try {
      setInitialLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/mediclaim/policies/${policyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setPolicy(res.data.data);
      } else {
        setError("Policy not found");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load policy"
      );
    } finally {
      setInitialLoading(false);
    }
  };

  /* ================= HANDLERS ================= */

  const handleChange = (field, value) => {
    setPolicy((prev) => ({ ...prev, [field]: value }));
  };

  const handlePremiumChange = (field, value) => {
    setPolicy((prev) => ({
      ...prev,
      premiumDetails: {
        ...prev.premiumDetails,
        [field]: value,
      },
    }));
  };

  const handleHospitalChange = (index, field, value) => {
    const updated = [...policy.networkHospitals];
    updated[index] = { ...updated[index], [field]: value };
    setPolicy((prev) => ({ ...prev, networkHospitals: updated }));
  };

  const addHospital = () => {
    setPolicy((prev) => ({
      ...prev,
      networkHospitals: [
        ...(prev.networkHospitals || []),
        { name: "", city: "", distance: "" },
      ],
    }));
  };

  const removeHospital = (index) => {
    if (policy.networkHospitals.length <= 1) return;

    setPolicy((prev) => ({
      ...prev,
      networkHospitals: prev.networkHospitals.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // Validate hospitals
      const validHospitals = policy.networkHospitals.filter(
        (h) => h.name?.trim() && h.city?.trim()
      );

      if (validHospitals.length === 0) {
        setError("At least one valid hospital is required.");
        setLoading(false);
        return;
      }

      const payload = {
        policyName: policy.policyName,
        premiumDetails: {
          amountPerEmployee: Number(
            policy.premiumDetails?.amountPerEmployee
          ),
          totalPremium: Number(
            policy.premiumDetails?.totalPremium
          ),
        },
        networkHospitals: validHospitals,
      };

      const res = await axios.put(
        `${BASE_URL}/api/mediclaim/policies/${policyId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update policy"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

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
        Edit Policy – {policy?.policyId || ""}
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {initialLoading ? (
          <Stack alignItems="center" py={5}>
            <CircularProgress />
          </Stack>
        ) : policy ? (
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            {/* ================= BASIC INFO ================= */}
            <Paper sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Policy ID"
                    fullWidth
                    value={policy.policyId || ""}
                    disabled
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Insurer"
                    fullWidth
                    value={policy.insurer || ""}
                    disabled
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Policy Number"
                    fullWidth
                    value={policy.policyNumber || ""}
                    disabled
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Coverage Amount"
                    fullWidth
                    value={policy.coverageAmount || ""}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Policy Name"
                    fullWidth
                    value={policy.policyName || ""}
                    onChange={(e) =>
                      handleChange(
                        "policyName",
                        e.target.value
                      )
                    }
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* ================= PREMIUM ================= */}
            <Paper sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>
                Premium Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Amount Per Employee"
                    type="number"
                    fullWidth
                    value={
                      policy.premiumDetails
                        ?.amountPerEmployee || ""
                    }
                    onChange={(e) =>
                      handlePremiumChange(
                        "amountPerEmployee",
                        e.target.value
                      )
                    }
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Total Premium"
                    type="number"
                    fullWidth
                    value={
                      policy.premiumDetails?.totalPremium ||
                      ""
                    }
                    onChange={(e) =>
                      handlePremiumChange(
                        "totalPremium",
                        e.target.value
                      )
                    }
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Payment Frequency"
                    fullWidth
                    value={
                      policy.premiumDetails
                        ?.paymentFrequency || ""
                    }
                    disabled
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Payment Status"
                    fullWidth
                    value={
                      policy.premiumDetails
                        ?.paymentStatus || ""
                    }
                    disabled
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* ================= NETWORK HOSPITALS ================= */}
            <Paper sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={600}>
                  Network Hospitals
                </Typography>

                <Button
                  startIcon={<AddIcon />}
                  onClick={addHospital}
                >
                  Add
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {policy.networkHospitals?.map(
                (hospital, index) => (
                  <Grid
                    container
                    spacing={2}
                    key={index}
                    sx={{ mb: 2 }}
                  >
                    <Grid item xs={4}>
                      <TextField
                        label="Hospital Name"
                        fullWidth
                        value={hospital.name || ""}
                        onChange={(e) =>
                          handleHospitalChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        label="City"
                        fullWidth
                        value={hospital.city || ""}
                        onChange={(e) =>
                          handleHospitalChange(
                            index,
                            "city",
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        label="Distance"
                        fullWidth
                        value={hospital.distance || ""}
                        onChange={(e) =>
                          handleHospitalChange(
                            index,
                            "distance",
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <IconButton
                        color="error"
                        disabled={
                          policy.networkHospitals.length <= 1
                        }
                        onClick={() =>
                          removeHospital(index)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )
              )}
            </Paper>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || initialLoading}
          sx={{ background: HEADER_GRADIENT }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            "Update Policy"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPolicy;