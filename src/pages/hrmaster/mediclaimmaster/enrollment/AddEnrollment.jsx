// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   Stack,
//   Typography,
//   IconButton,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Box,
//   Divider,
// } from "@mui/material";
// import { Add, Close, Delete } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../../config/Config";

// const AddEnrollment = ({ open, onClose, onSuccess }) => {
//   const [employees, setEmployees] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     employeeId: "",
//     policyId: "",
//     dependents: [],
//     nomineeDetails: [],
//   });

//   const [dependent, setDependent] = useState({
//     name: "",
//     relationship: "",
//     gender: "",
//     dateOfBirth: "",
//   });

//   const [nominee, setNominee] = useState({
//     name: "",
//     relationship: "",
//     contactNumber: "",
//     percentage: "",
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     if (open) {
//       fetchEmployees();
//       fetchPolicies();
//     }
//   }, [open]);

//   // ================= FETCH DATA =================

//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) setEmployees(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchPolicies = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${BASE_URL}/api/mediclaim/policies?status=active`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (res.data.success) setPolicies(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ================= HANDLE CHANGE =================

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ================= DEPENDENT =================

//   const addDependent = () => {
//     if (!dependent.name) return;
//     setForm({
//       ...form,
//       dependents: [...form.dependents, dependent],
//     });
//     setDependent({
//       name: "",
//       relationship: "",
//       gender: "",
//       dateOfBirth: "",
//     });
//   };

//   const removeDependent = (index) => {
//     const updated = form.dependents.filter((_, i) => i !== index);
//     setForm({ ...form, dependents: updated });
//   };

//   // ================= NOMINEE =================

//   const addNominee = () => {
//     if (!nominee.name) return;
//     setForm({
//       ...form,
//       nomineeDetails: [...form.nomineeDetails, nominee],
//     });
//     setNominee({
//       name: "",
//       relationship: "",
//       contactNumber: "",
//       percentage: "",
//     });
//   };

//   const removeNominee = (index) => {
//     const updated = form.nomineeDetails.filter((_, i) => i !== index);
//     setForm({ ...form, nomineeDetails: updated });
//   };

//   // ================= SUBMIT =================

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         `${BASE_URL}/api/mediclaim/enroll`,
//         form,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setSnackbar({
//         open: true,
//         message: res.data.message,
//         severity: "success",
//       });

//       onSuccess();
//       handleClose();
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Enrollment failed",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setForm({
//       employeeId: "",
//       policyId: "",
//       dependents: [],
//       nomineeDetails: [],
//     });
//     onClose();
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle
//           sx={{
//             background:
//               "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)",
//             color: "#fff",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography fontWeight={600}>Add Enrollment</Typography>
//           <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Stack spacing={3} mt={1}>
//             {/* Employee */}
//             <TextField
//               select
//               label="Employee"
//               name="employeeId"
//               value={form.employeeId}
//               onChange={handleChange}
//               fullWidth
//               required
//             >
//               {employees.map((emp) => (
//                 <MenuItem key={emp._id} value={emp._id}>
//                   {emp.EmployeeID} - {emp.FirstName} {emp.LastName}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Policy */}
//             <TextField
//               select
//               label="Policy"
//               name="policyId"
//               value={form.policyId}
//               onChange={handleChange}
//               fullWidth
//               required
//             >
//               {policies.map((pol) => (
//                 <MenuItem key={pol._id} value={pol._id}>
//                   {pol.policyName}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <Divider />

//             {/* Dependents Section */}
//             <Typography variant="subtitle1">Add Dependents</Typography>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 label="Name"
//                 value={dependent.name}
//                 onChange={(e) =>
//                   setDependent({ ...dependent, name: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Relationship"
//                 value={dependent.relationship}
//                 onChange={(e) =>
//                   setDependent({ ...dependent, relationship: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Gender"
//                 value={dependent.gender}
//                 onChange={(e) =>
//                   setDependent({ ...dependent, gender: e.target.value })
//                 }
//               />
//               <TextField
//                 type="date"
//                 InputLabelProps={{ shrink: true }}
//                 value={dependent.dateOfBirth}
//                 onChange={(e) =>
//                   setDependent({ ...dependent, dateOfBirth: e.target.value })
//                 }
//               />
//               <IconButton color="primary" onClick={addDependent}>
//                 <Add />
//               </IconButton>
//             </Stack>

//             {form.dependents.map((dep, index) => (
//               <Box key={index} display="flex" justifyContent="space-between">
//                 <Typography variant="body2">
//                   {dep.name} - {dep.relationship}
//                 </Typography>
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={() => removeDependent(index)}
//                 >
//                   <Delete />
//                 </IconButton>
//               </Box>
//             ))}

//             <Divider />

//             {/* Nominee Section */}
//             <Typography variant="subtitle1">Add Nominee</Typography>

//             <Stack direction="row" spacing={2}>
//               <TextField
//                 label="Name"
//                 value={nominee.name}
//                 onChange={(e) =>
//                   setNominee({ ...nominee, name: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Relationship"
//                 value={nominee.relationship}
//                 onChange={(e) =>
//                   setNominee({ ...nominee, relationship: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Contact"
//                 value={nominee.contactNumber}
//                 onChange={(e) =>
//                   setNominee({ ...nominee, contactNumber: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Percentage"
//                 type="number"
//                 value={nominee.percentage}
//                 onChange={(e) =>
//                   setNominee({ ...nominee, percentage: e.target.value })
//                 }
//               />
//               <IconButton color="primary" onClick={addNominee}>
//                 <Add />
//               </IconButton>
//             </Stack>

//             {form.nomineeDetails.map((nom, index) => (
//               <Box key={index} display="flex" justifyContent="space-between">
//                 <Typography variant="body2">
//                   {nom.name} - {nom.percentage}%
//                 </Typography>
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={() => removeNominee(index)}
//                 >
//                   <Delete />
//                 </IconButton>
//               </Box>
//             ))}
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={20} /> : "Enroll"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default AddEnrollment;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import { Add, Close, Delete } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../../config/Config";

const AddEnrollment = ({ open, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Enums from backend schema
  const RELATIONSHIP_ENUM = [
    "spouse",
    "son",
    "daughter",
    "father",
    "mother",
    "self",
  ];
  const GENDER_ENUM = ["M", "F", "O"];
  const STATUS_ENUM = ["pending", "active", "expired", "cancelled"];

  const [form, setForm] = useState({
    employeeId: "",
    policyId: "",
    dependents: [],
    nomineeDetails: [],
  });

  const [dependent, setDependent] = useState({
    name: "",
    relationship: "",
    gender: "",
    dateOfBirth: "",
  });

  const [nominee, setNominee] = useState({
    name: "",
    relationship: "",
    contactNumber: "",
    percentage: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchPolicies();
    }
  }, [open]);

  // ================= FETCH DATA =================

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setEmployees(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}/api/mediclaim/policies?status=active`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) setPolicies(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= DEPENDENT =================

  const addDependent = () => {
    if (
      !dependent.name ||
      !dependent.relationship ||
      !dependent.gender ||
      !dependent.dateOfBirth
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all dependent fields",
        severity: "warning",
      });
      return;
    }
    setForm({
      ...form,
      dependents: [...form.dependents, dependent],
    });
    setDependent({
      name: "",
      relationship: "",
      gender: "",
      dateOfBirth: "",
    });
  };

  const removeDependent = (index) => {
    const updated = form.dependents.filter((_, i) => i !== index);
    setForm({ ...form, dependents: updated });
  };

  // ================= NOMINEE =================

  const addNominee = () => {
    if (
      !nominee.name ||
      !nominee.relationship ||
      !nominee.contactNumber ||
      !nominee.percentage
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all nominee fields",
        severity: "warning",
      });
      return;
    }

    // Calculate total percentage
    const totalPercentage =
      form.nomineeDetails.reduce((sum, n) => sum + Number(n.percentage), 0) +
      Number(nominee.percentage);

    if (totalPercentage > 100) {
      setSnackbar({
        open: true,
        message: "Total nominee percentage cannot exceed 100%",
        severity: "warning",
      });
      return;
    }

    setForm({
      ...form,
      nomineeDetails: [...form.nomineeDetails, nominee],
    });
    setNominee({
      name: "",
      relationship: "",
      contactNumber: "",
      percentage: "",
    });
  };

  const removeNominee = (index) => {
    const updated = form.nomineeDetails.filter((_, i) => i !== index);
    setForm({ ...form, nomineeDetails: updated });
  };

  // ================= VALIDATION =================

  const validateForm = () => {
    if (!form.employeeId) {
      setSnackbar({
        open: true,
        message: "Please select an employee",
        severity: "warning",
      });
      return false;
    }
    if (!form.policyId) {
      setSnackbar({
        open: true,
        message: "Please select a policy",
        severity: "warning",
      });
      return false;
    }

    // Validate nominee percentage total
    const totalPercentage = form.nomineeDetails.reduce(
      (sum, nom) => sum + Number(nom.percentage),
      0,
    );

    if (form.nomineeDetails.length > 0 && totalPercentage !== 100) {
      setSnackbar({
        open: true,
        message: "Total nominee percentage must equal 100%",
        severity: "warning",
      });
      return false;
    }

    return true;
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(`${BASE_URL}/api/mediclaim/enroll`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSnackbar({
        open: true,
        message: res.data.message,
        severity: "success",
      });

      onSuccess();
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Enrollment failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      employeeId: "",
      policyId: "",
      dependents: [],
      nomineeDetails: [],
    });
    setDependent({
      name: "",
      relationship: "",
      gender: "",
      dateOfBirth: "",
    });
    setNominee({
      name: "",
      relationship: "",
      contactNumber: "",
      percentage: "",
    });
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            background:
              "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={600}>Add Enrollment</Typography>
          <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} mt={1}>
            {/* Employee */}
            <TextField
              select
              label="Employee *"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 48 * 5, // 5 items visible
                    },
                  },
                },
              }}
              fullWidth
              required
            >
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.EmployeeID} - {emp.FirstName} {emp.LastName}
                </MenuItem>
              ))}
            </TextField>

            {/* Policy */}
            <TextField
              select
              label="Policy *"
              name="policyId"
              value={form.policyId}
              onChange={handleChange}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 48 * 5, // 5 items visible
                    },
                  },
                },
              }}
              fullWidth
              required
            >
              {policies.map((pol) => (
                <MenuItem key={pol._id} value={pol._id}>
                  {pol.policyName}
                </MenuItem>
              ))}
            </TextField>

            <Divider />

            {/* Dependents Section */}
            <Typography variant="subtitle1" fontWeight={600}>
              Add Dependents
            </Typography>

            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Name *"
                  size="small"
                  value={dependent.name}
                  onChange={(e) =>
                    setDependent({ ...dependent, name: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  select
                  label="Relationship *"
                  size="small"
                  value={dependent.relationship}
                  onChange={(e) =>
                    setDependent({ ...dependent, relationship: e.target.value })
                  }
                  fullWidth
                >
                  {RELATIONSHIP_ENUM.map((rel) => (
                    <MenuItem key={rel} value={rel}>
                      {rel.charAt(0).toUpperCase() + rel.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  label="Gender *"
                  size="small"
                  value={dependent.gender}
                  onChange={(e) =>
                    setDependent({ ...dependent, gender: e.target.value })
                  }
                  fullWidth
                >
                  {GENDER_ENUM.map((gen) => (
                    <MenuItem key={gen} value={gen}>
                      {gen === "M" ? "Male" : gen === "F" ? "Female" : "Other"}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="date"
                  label="Date of Birth *"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={dependent.dateOfBirth}
                  onChange={(e) =>
                    setDependent({ ...dependent, dateOfBirth: e.target.value })
                  }
                  fullWidth
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addDependent}
                  sx={{ minWidth: "120px" }}
                >
                  Add
                </Button>
              </Stack>
            </Stack>

            {/* Dependents List */}
            {form.dependents.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Added Dependents:
                </Typography>
                <Stack spacing={1}>
                  {form.dependents.map((dep, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        p: 1,
                        bgcolor: "#f5f5f5",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {dep.name} - {dep.relationship} (
                        {dep.gender === "M"
                          ? "Male"
                          : dep.gender === "F"
                            ? "Female"
                            : "Other"}
                        ) - DOB:{" "}
                        {new Date(dep.dateOfBirth).toLocaleDateString()}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeDependent(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Divider />

            {/* Nominee Section */}
            <Typography variant="subtitle1" fontWeight={600}>
              Add Nominees
            </Typography>

            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Name *"
                  size="small"
                  value={nominee.name}
                  onChange={(e) =>
                    setNominee({ ...nominee, name: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  select
                  label="Relationship *"
                  size="small"
                  value={nominee.relationship}
                  onChange={(e) =>
                    setNominee({ ...nominee, relationship: e.target.value })
                  }
                  fullWidth
                >
                  {RELATIONSHIP_ENUM.map((rel) => (
                    <MenuItem key={rel} value={rel}>
                      {rel.charAt(0).toUpperCase() + rel.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Contact Number *"
                  size="small"
                  value={nominee.contactNumber}
                  onChange={(e) =>
                    setNominee({ ...nominee, contactNumber: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Percentage *"
                  type="number"
                  size="small"
                  value={nominee.percentage}
                  onChange={(e) =>
                    setNominee({ ...nominee, percentage: e.target.value })
                  }
                  fullWidth
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addNominee}
                  sx={{ minWidth: "120px" }}
                >
                  Add
                </Button>
              </Stack>
            </Stack>

            {/* Nominees List */}
            {form.nomineeDetails.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Added Nominees:
                </Typography>
                <Stack spacing={1}>
                  {form.nomineeDetails.map((nom, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        p: 1,
                        bgcolor: "#f5f5f5",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {nom.name} - {nom.relationship} - {nom.contactNumber} -{" "}
                        {nom.percentage}%
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeNominee(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Percentage Summary */}
            {form.nomineeDetails.length > 0 && (
              <Box sx={{ mt: 1, p: 1, bgcolor: "#e3f2fd", borderRadius: 1 }}>
                <Typography variant="body2">
                  Total Nominee Percentage:{" "}
                  {form.nomineeDetails.reduce(
                    (sum, nom) => sum + Number(nom.percentage),
                    0,
                  )}
                  %
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Enroll"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddEnrollment;
