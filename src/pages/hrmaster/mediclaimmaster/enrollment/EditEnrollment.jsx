// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Typography,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   IconButton,
//   Divider,
//   Box
// } from "@mui/material";
// import { Close, Add, Delete } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const PRIMARY_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const EditEnrollment = ({ open, onClose, enrollmentId, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);

//   const [dependents, setDependents] = useState([]);

//   const [newDependent, setNewDependent] = useState({
//     name: "",
//     relationship: "",
//     gender: "",
//     dateOfBirth: ""
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   /* ================= FETCH ENROLLMENT ================= */

//   useEffect(() => {
//     if (open && enrollmentId) fetchEnrollment();
//   }, [open, enrollmentId]);

//   const fetchEnrollment = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/enrollments/${enrollmentId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         const enrollment = res.data.data;
//         setData(enrollment);

//         // Remove "self" from editable dependents
//         const editableDependents =
//           enrollment.coverageDetails.members.filter(
//             m => m.relationship !== "self"
//           );

//         setDependents(
//           editableDependents.map(m => ({
//             name: m.name,
//             relationship: m.relationship,
//             gender: m.gender,
//             dateOfBirth: m.dateOfBirth?.split("T")[0]
//           }))
//         );
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= ADD DEPENDENT ================= */

//   const handleAddDependent = () => {
//     if (!newDependent.name) return;

//     setDependents(prev => [...prev, newDependent]);
//     setNewDependent({
//       name: "",
//       relationship: "",
//       gender: "",
//       dateOfBirth: ""
//     });
//   };

//   const handleRemoveDependent = index => {
//     setDependents(prev => prev.filter((_, i) => i !== index));
//   };

//   /* ================= UPDATE ================= */

//   const handleUpdate = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       await axios.put(
//         `${BASE_URL}/api/mediclaim/enrollments/${enrollmentId}`,
//         { dependents },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       setSnackbar({
//         open: true,
//         message: "Enrollment updated successfully",
//         severity: "success"
//       });

//       if (onSuccess) onSuccess();
//       onClose();
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message:
//           err.response?.data?.message || "Update failed",
//         severity: "error"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <>
//       <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//         <DialogTitle
//           sx={{
//             background: PRIMARY_GRADIENT,
//             color: "#fff",
//             fontWeight: 600
//           }}
//         >
//           Edit Enrollment
//           <IconButton
//             onClick={onClose}
//             sx={{ position: "absolute", right: 10, top: 10, color: "#fff" }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent>
//           {loading && !data ? (
//             <Stack alignItems="center" py={5}>
//               <CircularProgress />
//             </Stack>
//           ) : (
//             <Stack spacing={3} mt={2}>
//               <Typography variant="subtitle1" fontWeight={600}>
//                 Dependents
//               </Typography>

//               {/* Existing Dependents */}
//               {dependents.map((dep, index) => (
//                 <Box
//                   key={index}
//                   sx={{
//                     p: 2,
//                     border: "1px solid #eee",
//                     borderRadius: 2
//                   }}
//                 >
//                   <Stack direction="row" spacing={2}>
//                     <TextField
//                       label="Name"
//                       value={dep.name}
//                       onChange={e => {
//                         const updated = [...dependents];
//                         updated[index].name = e.target.value;
//                         setDependents(updated);
//                       }}
//                       fullWidth
//                     />

//                     <TextField
//                       label="Relationship"
//                       value={dep.relationship}
//                       onChange={e => {
//                         const updated = [...dependents];
//                         updated[index].relationship =
//                           e.target.value;
//                         setDependents(updated);
//                       }}
//                       fullWidth
//                     />

//                     <TextField
//                       label="Gender"
//                       value={dep.gender}
//                       onChange={e => {
//                         const updated = [...dependents];
//                         updated[index].gender =
//                           e.target.value;
//                         setDependents(updated);
//                       }}
//                       fullWidth
//                     />

//                     <TextField
//                       type="date"
//                       value={dep.dateOfBirth}
//                       onChange={e => {
//                         const updated = [...dependents];
//                         updated[index].dateOfBirth =
//                           e.target.value;
//                         setDependents(updated);
//                       }}
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                     />

//                     <IconButton
//                       color="error"
//                       onClick={() =>
//                         handleRemoveDependent(index)
//                       }
//                     >
//                       <Delete />
//                     </IconButton>
//                   </Stack>
//                 </Box>
//               ))}

//               <Divider />

//               {/* Add New Dependent */}
//               <Typography variant="subtitle2">
//                 Add New Dependent
//               </Typography>

//               <Stack direction="row" spacing={2}>
//                 <TextField
//                   label="Name"
//                   value={newDependent.name}
//                   onChange={e =>
//                     setNewDependent(prev => ({
//                       ...prev,
//                       name: e.target.value
//                     }))
//                   }
//                   fullWidth
//                 />

//                 <TextField
//                   label="Relationship"
//                   value={newDependent.relationship}
//                   onChange={e =>
//                     setNewDependent(prev => ({
//                       ...prev,
//                       relationship: e.target.value
//                     }))
//                   }
//                   fullWidth
//                 />

//                 <TextField
//                   label="Gender"
//                   value={newDependent.gender}
//                   onChange={e =>
//                     setNewDependent(prev => ({
//                       ...prev,
//                       gender: e.target.value
//                     }))
//                   }
//                   fullWidth
//                 />

//                 <TextField
//                   type="date"
//                   value={newDependent.dateOfBirth}
//                   onChange={e =>
//                     setNewDependent(prev => ({
//                       ...prev,
//                       dateOfBirth: e.target.value
//                     }))
//                   }
//                   InputLabelProps={{ shrink: true }}
//                   fullWidth
//                 />

//                 <IconButton
//                   color="primary"
//                   onClick={handleAddDependent}
//                 >
//                   <Add />
//                 </IconButton>
//               </Stack>
//             </Stack>
//           )}
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={onClose}>Cancel</Button>

//           <Button
//             variant="contained"
//             onClick={handleUpdate}
//             disabled={loading}
//           >
//             {loading ? (
//               <CircularProgress size={20} />
//             ) : (
//               "Save Changes"
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() =>
//           setSnackbar({ ...snackbar, open: false })
//         }
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default EditEnrollment;

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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
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
  Phone,
  Email,
  LocationOn,
  Add,
  Delete,
  Edit,
  Save,
  Person,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const PRIMARY_GRADIENT = "linear-gradient(135deg, #0B4F6C 0%, #1C7C9C 100%)";

const steps = [
  { label: "Enrollment Info", icon: <Description /> },
  { label: "Policy Details", icon: <Policy /> },
  { label: "Members & Nominee", icon: <People /> },
];

const EditEnrollment = ({ open, onClose, enrollmentId, onSuccess }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Form state
  const [formData, setFormData] = useState({
    coverageDetails: {
      members: [],
    },
    nomineeDetails: [],
    communicationDetails: {
      email: "",
      phone: "",
      address: "",
    },
    premiumPaid: false,
    status: "active",
  });

  // New member form
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "self",
    gender: "M",
    dateOfBirth: null,
  });

  // New nominee form
  const [newNominee, setNewNominee] = useState({
    name: "",
    relationship: "",
    percentage: "",
  });

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
        // Initialize form data
        setFormData({
          coverageDetails: {
            members: res.data.data.coverageDetails?.members || [],
          },
          nomineeDetails: res.data.data.nomineeDetails || [],
          communicationDetails: res.data.data.communicationDetails || {
            email: "",
            phone: "",
            address: "",
          },
          premiumPaid: res.data.data.premiumPaid || false,
          status: res.data.data.status || "active",
        });
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error fetching enrollment details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const payload = {
        coverageDetails: {
          members: formData.coverageDetails.members.map(m => ({
            name: m.name,
            relationship: m.relationship,
            gender: m.gender,
            dateOfBirth: m.dateOfBirth ? new Date(m.dateOfBirth).toISOString().split('T')[0] : null,
          })),
        },
        nomineeDetails: formData.nomineeDetails.map(n => ({
          name: n.name,
          relationship: n.relationship,
          percentage: n.percentage,
        })),
        communicationDetails: formData.communicationDetails,
        premiumPaid: formData.premiumPaid,
        status: formData.status,
      };

      const res = await axios.put(
        `${BASE_URL}/api/mediclaim/enrollments/${enrollmentId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        showSnackbar("Enrollment updated successfully", "success");
        setEditMode(false);
        fetchEnrollment(); // Refresh data
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Error updating enrollment", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.dateOfBirth) {
      showSnackbar("Please fill all member fields", "warning");
      return;
    }

    const age = calculateAge(newMember.dateOfBirth);
    
    const member = {
      name: newMember.name,
      relationship: newMember.relationship,
      gender: newMember.gender,
      dateOfBirth: newMember.dateOfBirth,
      age: age,
      isActive: true,
    };

    setFormData(prev => ({
      ...prev,
      coverageDetails: {
        ...prev.coverageDetails,
        members: [...prev.coverageDetails.members, member],
      },
    }));

    // Reset form
    setNewMember({
      name: "",
      relationship: "self",
      gender: "M",
      dateOfBirth: null,
    });
  };

  const handleRemoveMember = (index) => {
    setFormData(prev => ({
      ...prev,
      coverageDetails: {
        ...prev.coverageDetails,
        members: prev.coverageDetails.members.filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddNominee = () => {
    if (!newNominee.name || !newNominee.relationship || !newNominee.percentage) {
      showSnackbar("Please fill all nominee fields", "warning");
      return;
    }

    const percentage = parseInt(newNominee.percentage);
    const totalPercentage = formData.nomineeDetails.reduce((sum, n) => sum + (n.percentage || 0), 0) + percentage;

    if (totalPercentage > 100) {
      showSnackbar("Total nominee percentage cannot exceed 100%", "error");
      return;
    }

    const nominee = {
      name: newNominee.name,
      relationship: newNominee.relationship,
      percentage: percentage,
    };

    setFormData(prev => ({
      ...prev,
      nomineeDetails: [...prev.nomineeDetails, nominee],
    }));

    // Reset form
    setNewNominee({
      name: "",
      relationship: "",
      percentage: "",
    });
  };

  const handleRemoveNominee = (index) => {
    setFormData(prev => ({
      ...prev,
      nomineeDetails: prev.nomineeDetails.filter((_, i) => i !== index),
    }));
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

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split('T')[0];
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const InfoRow = ({ icon, label, value, color = "text.secondary", editable = false, onChange, type = "text" }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 0.5 }}>
      <Avatar sx={{ bgcolor: "transparent", color: "#1C7C9C", width: 24, height: 24 }}>
        {icon}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        {editable && editMode ? (
          <TextField
            size="small"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            type={type}
            fullWidth
            sx={{ mt: 0.5 }}
          />
        ) : (
          <Typography variant="body2" fontWeight={500} color={color}>
            {value || "-"}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const SectionCard = ({ title, children, action }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: "#F8FAFC",
        borderRadius: 2,
        border: "1px solid #E2E8F0",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#0B4F6C" }}>
          {title}
        </Typography>
        {action}
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
            <SectionCard title="Enrollment Information">
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
                    {editMode ? (
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="expired">Expired</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip
                        label={data.status}
                        size="small"
                        color={getStatusColor(data.status)}
                        sx={{ height: 24 }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Premium:
                    </Typography>
                    {editMode ? (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.premiumPaid}
                            onChange={(e) => setFormData(prev => ({ ...prev, premiumPaid: e.target.checked }))}
                            size="small"
                          />
                        }
                        label="Paid"
                      />
                    ) : (
                      <Chip
                        label={data.premiumPaid ? "Paid" : "Unpaid"}
                        size="small"
                        color={data.premiumPaid ? "success" : "error"}
                        icon={data.premiumPaid ? <CheckCircle /> : <Cancel />}
                        sx={{ height: 24 }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Payment Details">
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
                    value={formatDate(data.enrollmentDate)}
                  />
                </Grid>
                {data.paymentDate && (
                  <Grid item xs={12}>
                    <InfoRow
                      icon={<CalendarToday fontSize="small" />}
                      label="Payment Date"
                      value={formatDate(data.paymentDate)}
                    />
                  </Grid>
                )}
              </Grid>
            </SectionCard>

            <SectionCard title="Communication Details">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Email fontSize="small" />}
                    label="Email"
                    value={formData.communicationDetails.email}
                    editable={true}
                    editMode={editMode}
                    onChange={(val) => setFormData(prev => ({
                      ...prev,
                      communicationDetails: { ...prev.communicationDetails, email: val }
                    }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Phone fontSize="small" />}
                    label="Phone"
                    value={formData.communicationDetails.phone}
                    editable={true}
                    editMode={editMode}
                    onChange={(val) => setFormData(prev => ({
                      ...prev,
                      communicationDetails: { ...prev.communicationDetails, phone: val }
                    }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<LocationOn fontSize="small" />}
                    label="Address"
                    value={formData.communicationDetails.address}
                    editable={true}
                    editMode={editMode}
                    onChange={(val) => setFormData(prev => ({
                      ...prev,
                      communicationDetails: { ...prev.communicationDetails, address: val }
                    }))}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <SectionCard title={data.policyId?.policyName}>
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
                    icon={<AttachMoney fontSize="small" />}
                    label="Coverage Amount"
                    value={`₹ ${data.policyId?.coverageAmount?.toLocaleString()}`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow
                    icon={<Description fontSize="small" />}
                    label="Coverage Type"
                    value={data.policyId?.coverageType}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Validity Period">
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

            <SectionCard title="Network Hospitals">
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
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {h.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {h.city} • {h.type}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </SectionCard>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <SectionCard 
              title="Covered Members"
              action={editMode && (
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => document.getElementById('member-form').scrollIntoView({ behavior: 'smooth' })}
                  sx={{ color: "#1C7C9C" }}
                >
                  Add Member
                </Button>
              )}
            >
              <Stack spacing={1.5}>
                {formData.coverageDetails?.members?.map((m, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: "white",
                      borderRadius: 1.5,
                      border: "1px solid #E2E8F0",
                      position: "relative",
                    }}
                  >
                    {editMode && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveMember(i)}
                        sx={{ position: "absolute", top: 4, right: 4 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, pr: editMode ? 3 : 0 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {m.name}
                      </Typography>
                      <Chip
                        label={m.relationship}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Age: {m.age || calculateAge(m.dateOfBirth)} years • Gender: {m.gender}
                    </Typography>
                    {m.dateOfBirth && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        DOB: {formatDate(m.dateOfBirth)}
                      </Typography>
                    )}
                  </Paper>
                ))}

                {editMode && (
                  <Paper
                    id="member-form"
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "#EFF6FF",
                      borderRadius: 1.5,
                      border: "1px dashed #1C7C9C",
                      mt: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: "#1C7C9C" }}>
                      Add New Member
                    </Typography>
                    <Stack spacing={1.5}>
                      <TextField
                        size="small"
                        label="Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        fullWidth
                      />
                      <FormControl size="small" fullWidth>
                        <InputLabel>Relationship</InputLabel>
                        <Select
                          value={newMember.relationship}
                          onChange={(e) => setNewMember(prev => ({ ...prev, relationship: e.target.value }))}
                          label="Relationship"
                        >
                          <MenuItem value="self">Self</MenuItem>
                          <MenuItem value="spouse">Spouse</MenuItem>
                          <MenuItem value="son">Son</MenuItem>
                          <MenuItem value="daughter">Daughter</MenuItem>
                          <MenuItem value="father">Father</MenuItem>
                          <MenuItem value="mother">Mother</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={newMember.gender}
                          onChange={(e) => setNewMember(prev => ({ ...prev, gender: e.target.value }))}
                          label="Gender"
                        >
                          <MenuItem value="M">Male</MenuItem>
                          <MenuItem value="F">Female</MenuItem>
                          <MenuItem value="O">Other</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        label="Date of Birth"
                        type="date"
                        value={formatDateForInput(newMember.dateOfBirth)}
                        onChange={(e) => setNewMember(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddMember}
                        sx={{ bgcolor: "#1C7C9C" }}
                      >
                        Add Member
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </SectionCard>

            <SectionCard 
              title="Nominee Details"
              action={editMode && (
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => document.getElementById('nominee-form').scrollIntoView({ behavior: 'smooth' })}
                  sx={{ color: "#1C7C9C" }}
                >
                  Add Nominee
                </Button>
              )}
            >
              <Stack spacing={1.5}>
                {formData.nomineeDetails?.map((n, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: "white",
                      borderRadius: 1.5,
                      border: "1px solid #E2E8F0",
                      position: "relative",
                    }}
                  >
                    {editMode && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveNominee(i)}
                        sx={{ position: "absolute", top: 4, right: 4 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, pr: editMode ? 3 : 0 }}>
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
                      {n.relationship}
                    </Typography>
                  </Paper>
                ))}

                {editMode && (
                  <Paper
                    id="nominee-form"
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "#EFF6FF",
                      borderRadius: 1.5,
                      border: "1px dashed #1C7C9C",
                      mt: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: "#1C7C9C" }}>
                      Add New Nominee
                    </Typography>
                    <Stack spacing={1.5}>
                      <TextField
                        size="small"
                        label="Name"
                        value={newNominee.name}
                        onChange={(e) => setNewNominee(prev => ({ ...prev, name: e.target.value }))}
                        fullWidth
                      />
                      <FormControl size="small" fullWidth>
                        <InputLabel>Relationship</InputLabel>
                        <Select
                          value={newNominee.relationship}
                          onChange={(e) => setNewNominee(prev => ({ ...prev, relationship: e.target.value }))}
                          label="Relationship"
                        >
                          <MenuItem value="spouse">Spouse</MenuItem>
                          <MenuItem value="son">Son</MenuItem>
                          <MenuItem value="daughter">Daughter</MenuItem>
                          <MenuItem value="father">Father</MenuItem>
                          <MenuItem value="mother">Mother</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        label="Percentage (%)"
                        type="number"
                        value={newNominee.percentage}
                        onChange={(e) => setNewNominee(prev => ({ ...prev, percentage: e.target.value }))}
                        inputProps={{ min: 1, max: 100 }}
                        fullWidth
                      />
                      <Typography variant="caption" color="text.secondary">
                        Total: {formData.nomineeDetails.reduce((sum, n) => sum + (n.percentage || 0), 0) + (parseInt(newNominee.percentage) || 0)}%
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddNominee}
                        sx={{ bgcolor: "#1C7C9C" }}
                      >
                        Add Nominee
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </SectionCard>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: PRIMARY_GRADIENT,
            color: "#fff",
            py: 2,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Description sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {editMode ? "Edit Enrollment" : "Enrollment Details"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {data?.enrollmentId || "View enrollment information"}
                </Typography>
              </Box>
            </Box>
            <Box>
              {!editMode ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    mr: 5,
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    fetchEnrollment(); // Reset form
                  }}
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    mr: 5,
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Cancel
                </Button>
              )}
              <IconButton
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, minHeight: 400 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 300,
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
                  "& .MuiStepLabel-root .Mui-completed": {
                    color: "#1C7C9C",
                  },
                  "& .MuiStepLabel-root .Mui-active": {
                    color: "#0B4F6C",
                  },
                }}
              >
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel StepIconComponent={() => (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: activeStep >= index ? "#1C7C9C" : "#E2E8F0",
                          color: activeStep >= index ? "#fff" : "#64748B",
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    )}>
                      {step.label}
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
                height: 300,
                gap: 2,
              }}
            >
              <Description sx={{ fontSize: 48, color: "#E2E8F0" }} />
              <Typography variant="body1" color="text.secondary">
                No enrollment data found
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
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Next
            </Button>
          ) : editMode ? (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              sx={{
                background: PRIMARY_GRADIENT,
                px: 4,
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                background: PRIMARY_GRADIENT,
                px: 4,
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditEnrollment;