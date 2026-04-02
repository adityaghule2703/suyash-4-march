// // import React, { useState, useEffect, useMemo } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   Stack,
// //   Alert,
// //   MenuItem,
// //   CircularProgress,
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Box,
// //   Typography,
// //   styled,
// //   StepConnector,
// //   Divider,
// // } from "@mui/material";

// // import { Add as AddIcon } from "@mui/icons-material";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// // import { DatePicker, TimePicker } from "@mui/x-date-pickers";

// // import axios from "axios";
// // import BASE_URL from "../../../config/Config";

// // /* ================= Stepper Styling ================= */

// // const ColorConnector = styled(StepConnector)(() => ({
// //   "& .MuiStepConnector-line": {
// //     height: 4,
// //     border: 0,
// //     backgroundColor: "#e0e0e0",
// //     borderRadius: 10,
// //   },
// //   "&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line":
// //     {
// //       background: "linear-gradient(90deg, #164e63, #00B4D8)",
// //     },
// // }));

// // const steps = ["Basic Details", "Production Details"];

// // // Create axios instance with default config
// // const api = axios.create({
// //   baseURL: BASE_URL,
// //   timeout: 30000, // 30 seconds timeout
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // Add request interceptor for debugging
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     console.log("Making request to:", config.url);
// //     console.log("Request data:", config.data);
// //     return config;
// //   },
// //   (error) => {
// //     console.error("Request error:", error);
// //     return Promise.reject(error);
// //   }
// // );

// // // Add response interceptor for debugging
// // api.interceptors.response.use(
// //   (response) => {
// //     console.log("Response received:", response.data);
// //     return response;
// //   },
// //   (error) => {
// //     if (error.code === 'ECONNABORTED') {
// //       console.error("Request timeout");
// //     } else if (error.response) {
// //       // The request was made and the server responded with a status code
// //       // that falls out of the range of 2xx
// //       console.error("Response error:", error.response.data);
// //       console.error("Status:", error.response.status);
// //       console.error("Headers:", error.response.headers);
// //     } else if (error.request) {
// //       // The request was made but no response was received
// //       console.error("No response received:", error.request);
// //     } else {
// //       // Something happened in setting up the request that triggered an Error
// //       console.error("Request setup error:", error.message);
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // const AddProduction = ({ open, onClose, onAdd }) => {
// //   const [activeStep, setActiveStep] = useState(0);
// //   const [employees, setEmployees] = useState([]);
// //   const [rateMaster, setRateMaster] = useState([]);

// //   const [loading, setLoading] = useState(false);
// //   const [employeeLoading, setEmployeeLoading] = useState(false);
// //   const [rateMasterLoading, setRateMasterLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [networkError, setNetworkError] = useState("");

// //   const initialState = {
// //     employeeId: "",
// //     date: new Date(),
// //     rateMasterId: "",
// //     goodUnits: "",
// //     rejectedUnits: "",
// //     reworkUnits: "",
// //     qualityBonus: "",
// //     efficiencyBonus: "",
// //     startTime: new Date(),
// //     endTime: new Date(),
// //     machineId: "",
// //     batchNumber: "",
// //     orderNumber: "",
// //     remarks: "",
// //   };

// //   const [formData, setFormData] = useState(initialState);

// //   // Reset form when dialog closes
// //   useEffect(() => {
// //     if (!open) {
// //       setFormData(initialState);
// //       setActiveStep(0);
// //       setError("");
// //       setNetworkError("");
// //     }
// //   }, [open]);

// //   // Fetch data when dialog opens
// //   useEffect(() => {
// //     if (open) {
// //       fetchEmployees();
// //       fetchRateMaster();
// //     }
// //   }, [open]);

// //   const fetchEmployees = async () => {
// //     try {
// //       setEmployeeLoading(true);
// //       setNetworkError("");

// //       const token = localStorage.getItem("token");

// //       const res = await api.get("/api/employees", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });

// //       if (res.data.success) setEmployees(res.data.data || []);
// //     } catch (err) {
// //       console.error("Employee fetch error:", err);
// //       if (err.code === 'ECONNABORTED') {
// //         setNetworkError("Request timeout. Please check your connection.");
// //       } else if (!err.response) {
// //         setNetworkError("Network error. Please check if the server is running.");
// //       } else {
// //         setError("Failed to load employees");
// //       }
// //     } finally {
// //       setEmployeeLoading(false);
// //     }
// //   };

// //   const fetchRateMaster = async () => {
// //     try {
// //       setRateMasterLoading(true);
// //       setNetworkError("");

// //       const token = localStorage.getItem("token");

// //       const res = await api.get("/api/piece-rate-master", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });

// //       if (res.data.success) {
// //         setRateMaster(res.data.data || []);
// //         console.log("Rate master data:", res.data.data);
// //       }
// //     } catch (err) {
// //       console.error("Rate master fetch error:", err);
// //       if (err.code === 'ECONNABORTED') {
// //         setNetworkError("Request timeout. Please check your connection.");
// //       } else if (!err.response) {
// //         setNetworkError("Network error. Please check if the server is running.");
// //       } else {
// //         setError("Failed to load rate master");
// //       }
// //     } finally {
// //       setRateMasterLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     setError("");
// //     setNetworkError("");
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const totalUnits = useMemo(() => {
// //     return (
// //       Number(formData.goodUnits || 0) +
// //       Number(formData.rejectedUnits || 0) +
// //       Number(formData.reworkUnits || 0)
// //     );
// //   }, [formData.goodUnits, formData.rejectedUnits, formData.reworkUnits]);

// //   const selectedRate = useMemo(() => {
// //     return rateMaster.find((rate) => rate._id === formData.rateMasterId);
// //   }, [formData.rateMasterId, rateMaster]);

// //   const handleSubmit = async () => {
// //     // Validation
// //     if (!formData.employeeId) return setError("Employee is required");
// //     if (!formData.date) return setError("Production date is required");
// //     if (!formData.rateMasterId) return setError("Please select Product & Operation");
// //     if (!formData.goodUnits) return setError("Good Units required");
// //     if (Number(formData.goodUnits) <= 0) return setError("Good Units must be greater than 0");
// //     if (!formData.startTime) return setError("Start time required");
// //     if (!formData.endTime) return setError("End time required");

// //     // Find the selected rate again to ensure we have the latest data
// //     const selectedRateData = rateMaster.find((rate) => rate._id === formData.rateMasterId);
    
// //     if (!selectedRateData) {
// //       return setError("Invalid rate master selected. Please select again.");
// //     }

// //     // Handle both productName and productType fields
// //     const productName = selectedRateData.productName || selectedRateData.productType;
// //     const operation = selectedRateData.operation;

// //     if (!productName) {
// //       console.error("Selected rate data:", selectedRateData);
// //       return setError("Selected rate master is missing product name");
// //     }

// //     if (!operation) {
// //       console.error("Selected rate data:", selectedRateData);
// //       return setError("Selected rate master is missing operation");
// //     }

// //     setLoading(true);
// //     setError("");
// //     setNetworkError("");

// //     try {
// //       const token = localStorage.getItem("token");

// //       // Calculate total units
// //       const calculatedTotalUnits = totalUnits;

// //       // Prepare payload according to the API schema
// //       const payload = {
// //         employeeId: formData.employeeId,
// //         date: formData.date.toISOString(),
// //         productName: productName,
// //         operation: operation,
// //         totalUnits: calculatedTotalUnits,
// //         goodUnits: Number(formData.goodUnits),
// //         rejectedUnits: Number(formData.rejectedUnits || 0),
// //         reworkUnits: Number(formData.reworkUnits || 0),
// //         qualityBonus: Number(formData.qualityBonus || 0),
// //         efficiencyBonus: Number(formData.efficiencyBonus || 0),
// //         startTime: formData.startTime.toISOString(),
// //         endTime: formData.endTime.toISOString(),
// //         machineId: formData.machineId || "",
// //         batchNumber: formData.batchNumber || "",
// //         orderNumber: formData.orderNumber || "",
// //         remarks: formData.remarks || "",
// //       };

// //       console.log("Sending payload to:", `${BASE_URL}/api/production/record`);
// //       console.log("Payload:", payload);

// //       const res = await api.post("/api/production/record", payload, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       if (res.data.success) {
// //         // Format the response data
// //         const responseData = res.data.data;
// //         const productionData = {
// //           id: responseData._id || responseData.id,
// //           _id: responseData._id,
// //           employeeId: responseData.EmployeeID?._id || formData.employeeId,
// //           employeeName: responseData.employeeName || 
// //             (responseData.EmployeeID ? 
// //               `${responseData.EmployeeID.FirstName || ''} ${responseData.EmployeeID.LastName || ''}`.trim() : 
// //               ''),
// //           date: responseData.Date || responseData.date,
// //           productName: responseData.ProductName || responseData.productName,
// //           operation: responseData.Operation || responseData.operation,
// //           totalUnits: responseData.TotalUnits || responseData.totalUnits,
// //           goodUnits: responseData.GoodUnits || responseData.goodUnits,
// //           rejectedUnits: responseData.RejectedUnits || responseData.rejectedUnits,
// //           reworkUnits: responseData.ReworkUnits || responseData.reworkUnits,
// //           qualityBonus: responseData.QualityBonus || responseData.qualityBonus,
// //           efficiencyBonus: responseData.EfficiencyBonus || responseData.efficiencyBonus,
// //           ratePerUnit: responseData.RatePerUnit,
// //           earnings: responseData.DailyEarning || responseData.TotalAmount || responseData.earnings,
// //           totalAmount: responseData.TotalAmount,
// //           status: responseData.Status || responseData.status,
// //           qualityPercentage: responseData.QualityPercentage,
// //           efficiencyPercentage: responseData.EfficiencyPercentage,
// //           totalHours: responseData.TotalHours,
// //           rejectionRate: responseData.rejectionRate,
// //           netUnits: responseData.netUnits,
// //           startTime: responseData.StartTime || responseData.startTime,
// //           endTime: responseData.EndTime || responseData.endTime,
// //           machineId: responseData.MachineID || responseData.machineId,
// //           batchNumber: responseData.BatchNumber || responseData.batchNumber,
// //           orderNumber: responseData.OrderNumber || responseData.orderNumber,
// //           remarks: responseData.Remarks || responseData.remarks,
// //           salaryProcessed: responseData.SalaryProcessed,
// //           createdAt: responseData.createdAt,
// //           updatedAt: responseData.updatedAt,
// //         };
        
// //         onAdd(productionData);
// //         onClose();
// //       }
// //     } catch (err) {
// //       console.error("Full error object:", err);
      
// //       if (err.code === 'ECONNABORTED') {
// //         setNetworkError("Request timeout. Please try again.");
// //       } else if (!err.response) {
// //         setNetworkError(`Network error: Could not connect to server. Please check:
// //           • Server is running
// //           • URL is correct: ${BASE_URL}
// //           • CORS is configured
// //           • Network connection`);
// //       } else if (err.response.status === 401) {
// //         setError("Unauthorized. Please login again.");
// //       } else if (err.response.status === 403) {
// //         setError("You don't have permission to perform this action.");
// //       } else if (err.response.status === 404) {
// //         setError(`API endpoint not found: ${BASE_URL}/api/production/record`);
// //       } else if (err.response.status === 500) {
// //         setError("Server error. Please try again later.");
// //       } else {
// //         setError(err.response?.data?.message || "Failed to record production");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Function to test API connection
// //   const testConnection = async () => {
// //     try {
// //       setNetworkError("");
// //       const token = localStorage.getItem("token");
// //       console.log("Testing connection to:", BASE_URL);
      
// //       const res = await api.get("/api/test", {
// //         headers: { Authorization: `Bearer ${token}` },
// //         timeout: 5000
// //       }).catch(() => ({ data: { success: false } }));
      
// //       if (res.data?.success) {
// //         alert("Connection successful!");
// //       } else {
// //         alert("Connected but test endpoint not available");
// //       }
// //     } catch (err) {
// //       console.error("Connection test failed:", err);
// //       alert(`Connection failed: ${err.message}`);
// //     }
// //   };

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// //       <DialogTitle
// //         sx={{
// //           background: "linear-gradient(135deg, #164e63, #00B4D8)",
// //           color: "#fff",
// //         }}
// //       >
// //         Add Production Entry
// //       </DialogTitle>

// //       <DialogContent sx={{ pt: 4 }}>
// //         {/* Network Error Display */}
// //         {networkError && (
// //           <Alert 
// //             severity="error" 
// //             sx={{ mb: 3 }}
// //             action={
// //               <Button color="inherit" size="small" onClick={testConnection}>
// //                 Test Connection
// //               </Button>
// //             }
// //           >
// //             {networkError}
// //           </Alert>
// //         )}

// //         <Stepper 
// //           activeStep={activeStep} 
// //           alternativeLabel 
// //           connector={<ColorConnector />} 
// //           sx={{ mb: 4, margin: 2 }}
// //         >
// //           {steps.map((label) => (
// //             <Step key={label}>
// //               <StepLabel>{label}</StepLabel>
// //             </Step>
// //           ))}
// //         </Stepper>

// //         <LocalizationProvider dateAdapter={AdapterDateFns}>
// //           <Stack spacing={3}>
// //             {activeStep === 0 && (
// //               <>
// //                 <TextField
// //                   select
// //                   label="Employee *"
// //                   name="employeeId"
// //                   value={formData.employeeId}
// //                   onChange={handleChange}
// //                   fullWidth
// //                   required
// //                   error={!formData.employeeId && error.includes("Employee")}
// //                 >
// //                   {employeeLoading ? (
// //                     <MenuItem disabled>
// //                       <CircularProgress size={18} />
// //                     </MenuItem>
// //                   ) : employees.length === 0 ? (
// //                     <MenuItem disabled>No employees found</MenuItem>
// //                   ) : (
// //                     employees.map((emp) => (
// //                       <MenuItem key={emp._id} value={emp._id}>
// //                         {emp.FullName || `${emp.FirstName || ''} ${emp.LastName || ''}`.trim()} 
// //                         {emp.EmployeeID && ` (${emp.EmployeeID})`}
// //                       </MenuItem>
// //                     ))
// //                   )}
// //                 </TextField>

// //                 <DatePicker
// //                   label="Production Date *"
// //                   value={formData.date}
// //                   onChange={(value) =>
// //                     setFormData((prev) => ({ ...prev, date: value }))
// //                   }
// //                   slotProps={{ 
// //                     textField: { 
// //                       fullWidth: true,
// //                       required: true,
// //                       error: !formData.date && error.includes("date")
// //                     } 
// //                   }}
// //                 />
// //               </>
// //             )}

// //             {activeStep === 1 && (
// //               <>
// //                 <TextField
// //                   select
// //                   label="Select Product & Operation *"
// //                   name="rateMasterId"
// //                   value={formData.rateMasterId}
// //                   onChange={handleChange}
// //                   fullWidth
// //                   required
// //                   error={!formData.rateMasterId && error.includes("Product")}
// //                 >
// //                   {rateMasterLoading ? (
// //                     <MenuItem disabled>
// //                       <CircularProgress size={18} />
// //                     </MenuItem>
// //                   ) : rateMaster.length === 0 ? (
// //                     <MenuItem disabled>No rate master data found</MenuItem>
// //                   ) : (
// //                     rateMaster.map((rate) => (
// //                       <MenuItem key={rate._id} value={rate._id}>
// //                         {rate.productName || rate.productType} - {rate.operation} (₹{rate.ratePerUnit} per unit)
// //                       </MenuItem>
// //                     ))
// //                   )}
// //                 </TextField>

// //                 {selectedRate && (
// //                   <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
// //                     <Typography variant="body2">
// //                       <strong>Selected:</strong> {selectedRate.productName || selectedRate.productType} - {selectedRate.operation}
// //                     </Typography>
// //                     <Typography variant="body2">
// //                       <strong>Rate per unit:</strong> ₹{selectedRate.ratePerUnit}
// //                     </Typography>
// //                   </Box>
// //                 )}

// //                 <TextField
// //                   type="number"
// //                   label="Good Units *"
// //                   name="goodUnits"
// //                   value={formData.goodUnits}
// //                   onChange={handleChange}
// //                   fullWidth
// //                   required
// //                   inputProps={{ min: 1 }}
// //                   error={!formData.goodUnits && error.includes("Good Units")}
// //                   helperText="Units that passed quality check"
// //                 />

// //                 <TextField
// //                   type="number"
// //                   label="Rejected Units"
// //                   name="rejectedUnits"
// //                   value={formData.rejectedUnits}
// //                   onChange={handleChange}
// //                   fullWidth
// //                   inputProps={{ min: 0 }}
// //                   helperText="Units that failed quality check"
// //                 />

// //                 <TextField
// //                   type="number"
// //                   label="Rework Units"
// //                   name="reworkUnits"
// //                   value={formData.reworkUnits}
// //                   onChange={handleChange}
// //                   fullWidth
// //                   inputProps={{ min: 0 }}
// //                   helperText="Units that need rework"
// //                 />

// //                 <TextField
// //                   type="number"
// //                   label="Quality Bonus"
// //                   name="qualityBonus"
// //                   value={formData.qualityBonus}
// //                   onChange={handleChange}
// //                   fullWidth
// //                   inputProps={{ min: 0 }}
// //                 />

// //                 <TextField
// //                   type="number"
// //                   label="Efficiency Bonus"
// //                   name="efficiencyBonus"
// //                   value={formData.efficiencyBonus}
// //                   onChange={handleChange}
// //                   fullWidth
// //                   inputProps={{ min: 0 }}
// //                 />

// //                 <TimePicker
// //                   label="Start Time *"
// //                   value={formData.startTime}
// //                   onChange={(value) =>
// //                     setFormData((prev) => ({ ...prev, startTime: value }))
// //                   }
// //                   slotProps={{ 
// //                     textField: { 
// //                       fullWidth: true,
// //                       required: true,
// //                       error: !formData.startTime && error.includes("Start")
// //                     } 
// //                   }}
// //                 />

// //                 <TimePicker
// //                   label="End Time *"
// //                   value={formData.endTime}
// //                   onChange={(value) =>
// //                     setFormData((prev) => ({ ...prev, endTime: value }))
// //                   }
// //                   slotProps={{ 
// //                     textField: { 
// //                       fullWidth: true,
// //                       required: true,
// //                       error: !formData.endTime && error.includes("End")
// //                     } 
// //                   }}
// //                 />

// //                 <TextField
// //                   label="Machine ID"
// //                   name="machineId"
// //                   value={formData.machineId}
// //                   onChange={handleChange}
// //                   fullWidth
// //                 />

// //                 <TextField
// //                   label="Batch Number"
// //                   name="batchNumber"
// //                   value={formData.batchNumber}
// //                   onChange={handleChange}
// //                   fullWidth
// //                 />

// //                 <TextField
// //                   label="Order Number"
// //                   name="orderNumber"
// //                   value={formData.orderNumber}
// //                   onChange={handleChange}
// //                   fullWidth
// //                 />

// //                 <TextField
// //                   label="Remarks"
// //                   name="remarks"
// //                   value={formData.remarks}
// //                   onChange={handleChange}
// //                   fullWidth
// //                   multiline
// //                   rows={2}
// //                 />

// //                 <Divider />

// //                 <Box sx={{ 
// //                   p: 2, 
// //                   bgcolor: '#f5f5f5', 
// //                   borderRadius: 1,
// //                   display: 'flex',
// //                   justifyContent: 'space-between',
// //                   alignItems: 'center'
// //                 }}>
// //                   <Typography variant="subtitle1">
// //                     Total Units (Auto-calculated):
// //                   </Typography>
// //                   <Typography variant="h6" color="primary">
// //                     {totalUnits}
// //                   </Typography>
// //                 </Box>
                
// //                 <Box sx={{ 
// //                   p: 2, 
// //                   bgcolor: '#e3f2fd', 
// //                   borderRadius: 1,
// //                   mt: 1
// //                 }}>
// //                   <Typography variant="caption" color="textSecondary">
// //                     Total Units = Good Units + Rejected Units + Rework Units
// //                   </Typography>
// //                 </Box>
// //               </>
// //             )}

// //             {error && <Alert severity="error">{error}</Alert>}
// //           </Stack>
// //         </LocalizationProvider>
// //       </DialogContent>

// //       <DialogActions sx={{ p: 3 }}>
// //         <Button onClick={onClose} color="inherit" disabled={loading}>
// //           Cancel
// //         </Button>
        
// //         {activeStep > 0 && (
// //           <Button onClick={() => setActiveStep((prev) => prev - 1)} disabled={loading}>
// //             Back
// //           </Button>
// //         )}

// //         {activeStep < steps.length - 1 ? (
// //           <Button
// //             variant="contained"
// //             onClick={() => setActiveStep((prev) => prev + 1)}
// //             disabled={loading}
// //             sx={{ background: "linear-gradient(135deg, #164e63, #00B4D8)" }}
// //           >
// //             Next
// //           </Button>
// //         ) : (
// //           <Button
// //             variant="contained"
// //             onClick={handleSubmit}
// //             disabled={loading}
// //             startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
// //             sx={{ background: "linear-gradient(135deg, #164e63, #00B4D8)" }}
// //           >
// //             {loading ? "Saving..." : "Add Production"}
// //           </Button>
// //         )}
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default AddProduction;

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   MenuItem,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Typography,
//   styled,
//   StepConnector,
//   stepConnectorClasses,
//   Divider,
//   Grid,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   InputAdornment
// } from "@mui/material";

// import { Add as AddIcon, NavigateNext, NavigateBefore } from "@mui/icons-material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { DatePicker, TimePicker } from "@mui/x-date-pickers";

// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// // Color constants matching AddVendor component
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF',
//     lightMuted: 'rgba(255, 255, 255, 0.9)'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F'
//   },
//   border: '#E3E8EF',
//   status: {
//     success: '#9FE2BF',
//     warning: '#FEF3C7',
//     error: '#FEE2E2',
//     info: '#E0F2FE'
//   },
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     suspended: '#FEF3C7',
//     locked: '#FEE2E2'
//   }
// };

// // Modern Stepper Connector with Primary Color
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundColor: COLORS.primary,
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundColor: COLORS.primary,
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 2,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const steps = ["Basic Details", "Production Details"];

// const AddProduction = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [employees, setEmployees] = useState([]);
//   const [rateMaster, setRateMaster] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [employeeLoading, setEmployeeLoading] = useState(false);
//   const [rateMasterLoading, setRateMasterLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});

//   const initialState = {
//     employeeId: "",
//     date: new Date(),
//     rateMasterId: "",
//     goodUnits: "",
//     rejectedUnits: "",
//     reworkUnits: "",
//     qualityBonus: "",
//     efficiencyBonus: "",
//     startTime: new Date(),
//     endTime: new Date(),
//     machineId: "",
//     batchNumber: "",
//     orderNumber: "",
//     remarks: "",
//   };

//   const [formData, setFormData] = useState(initialState);

//   // Reset form when dialog closes
//   useEffect(() => {
//     if (!open) {
//       setFormData(initialState);
//       setActiveStep(0);
//       setError("");
//       setFieldErrors({});
//     }
//   }, [open]);

//   // Fetch data when dialog opens
//   useEffect(() => {
//     if (open) {
//       fetchEmployees();
//       fetchRateMaster();
//     }
//   }, [open]);

//   const fetchEmployees = async () => {
//     try {
//       setEmployeeLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setEmployees(response.data.data || []);
//       }
//     } catch (err) {
//       console.error("Employee fetch error:", err);
//     } finally {
//       setEmployeeLoading(false);
//     }
//   };

//   const fetchRateMaster = async () => {
//     try {
//       setRateMasterLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${BASE_URL}/api/piece-rate-master`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setRateMaster(response.data.data || []);
//       }
//     } catch (err) {
//       console.error("Rate master fetch error:", err);
//     } finally {
//       setRateMasterLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // Clear field error when user starts typing
//     setFieldErrors(prev => ({
//       ...prev,
//       [name]: ''
//     }));
//     setError("");
    
//     // Handle number fields
//     if (name === 'goodUnits' || name === 'rejectedUnits' || name === 'reworkUnits' ||
//         name === 'qualityBonus' || name === 'efficiencyBonus') {
//       if (value === '' || /^\d*\.?\d*$/.test(value)) {
//         setFormData((prev) => ({ ...prev, [name]: value }));
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const validateField = (name, value) => {
//     switch (name) {
//       case 'employeeId':
//         if (!value) return 'Employee is required';
//         break;
//       case 'date':
//         if (!value) return 'Production date is required';
//         break;
//       case 'rateMasterId':
//         if (!value) return 'Product & Operation is required';
//         break;
//       case 'goodUnits':
//         if (!value) return 'Good units are required';
//         if (Number(value) <= 0) return 'Good units must be greater than 0';
//         break;
//       case 'startTime':
//         if (!value) return 'Start time is required';
//         break;
//       case 'endTime':
//         if (!value) return 'End time is required';
//         break;
//       default:
//         return '';
//     }
//     return '';
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Basic Details
//         if (!formData.employeeId) {
//           errors.employeeId = 'Employee is required';
//           isValid = false;
//         }
//         if (!formData.date) {
//           errors.date = 'Production date is required';
//           isValid = false;
//         }
//         break;
      
//       case 1: // Production Details
//         if (!formData.rateMasterId) {
//           errors.rateMasterId = 'Product & Operation is required';
//           isValid = false;
//         }
//         if (!formData.goodUnits) {
//           errors.goodUnits = 'Good units are required';
//           isValid = false;
//         } else if (Number(formData.goodUnits) <= 0) {
//           errors.goodUnits = 'Good units must be greater than 0';
//           isValid = false;
//         }
//         if (!formData.startTime) {
//           errors.startTime = 'Start time is required';
//           isValid = false;
//         }
//         if (!formData.endTime) {
//           errors.endTime = 'End time is required';
//           isValid = false;
//         }
//         break;
      
//       default:
//         return true;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fix the errors in this section');
//     }
//     return isValid;
//   };

//   const validateAllFields = () => {
//     const errors = {};
//     let isValid = true;

//     if (!formData.employeeId) {
//       errors.employeeId = 'Employee is required';
//       isValid = false;
//     }
//     if (!formData.date) {
//       errors.date = 'Production date is required';
//       isValid = false;
//     }
//     if (!formData.rateMasterId) {
//       errors.rateMasterId = 'Product & Operation is required';
//       isValid = false;
//     }
//     if (!formData.goodUnits) {
//       errors.goodUnits = 'Good units are required';
//       isValid = false;
//     } else if (Number(formData.goodUnits) <= 0) {
//       errors.goodUnits = 'Good units must be greater than 0';
//       isValid = false;
//     }
//     if (!formData.startTime) {
//       errors.startTime = 'Start time is required';
//       isValid = false;
//     }
//     if (!formData.endTime) {
//       errors.endTime = 'End time is required';
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fix all validation errors');
//     }
//     return isValid;
//   };

//   const totalUnits = useMemo(() => {
//     return (
//       Number(formData.goodUnits || 0) +
//       Number(formData.rejectedUnits || 0) +
//       Number(formData.reworkUnits || 0)
//     );
//   }, [formData.goodUnits, formData.rejectedUnits, formData.reworkUnits]);

//   const selectedRate = useMemo(() => {
//     return rateMaster.find((rate) => rate._id === formData.rateMasterId);
//   }, [formData.rateMasterId, rateMaster]);

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setError('');
//       setActiveStep((prevStep) => prevStep + 1);
//     }
//   };

//   const handleBack = () => {
//     setError('');
//     setActiveStep((prevStep) => prevStep - 1);
//   };

//   const handleSubmit = async () => {
//     if (!validateAllFields()) {
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");
//       const selectedRateData = rateMaster.find((rate) => rate._id === formData.rateMasterId);
      
//       if (!selectedRateData) {
//         setError("Invalid rate master selected. Please select again.");
//         setLoading(false);
//         return;
//       }

//       const productName = selectedRateData.productName || selectedRateData.productType;
//       const operation = selectedRateData.operation;

//       if (!productName || !operation) {
//         setError("Selected rate master is missing required fields");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         employeeId: formData.employeeId,
//         date: formData.date.toISOString(),
//         productName: productName,
//         operation: operation,
//         totalUnits: totalUnits,
//         goodUnits: Number(formData.goodUnits),
//         rejectedUnits: Number(formData.rejectedUnits || 0),
//         reworkUnits: Number(formData.reworkUnits || 0),
//         qualityBonus: Number(formData.qualityBonus || 0),
//         efficiencyBonus: Number(formData.efficiencyBonus || 0),
//         startTime: formData.startTime.toISOString(),
//         endTime: formData.endTime.toISOString(),
//         machineId: formData.machineId || "",
//         batchNumber: formData.batchNumber || "",
//         orderNumber: formData.orderNumber || "",
//         remarks: formData.remarks || "",
//       };

//       const response = await axios.post(`${BASE_URL}/api/production/record`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data.success) {
//         onAdd(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || "Failed to record production");
//       }
//     } catch (err) {
//       console.error("Error recording production:", err);
//       setError(err.response?.data?.message || "Failed to record production. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData(initialState);
//     setFieldErrors({});
//     setError("");
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0: // Basic Details
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Basic Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       EMPLOYEE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.employeeId}>
//                       <Select
//                         name="employeeId"
//                         value={formData.employeeId}
//                         onChange={handleChange}
//                         disabled={loading || employeeLoading}
//                         displayEmpty
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': {
//                             py: 1,
//                             px: 1.5,
//                             fontSize: '0.75rem',
//                             color: formData.employeeId ? COLORS.text.primary : COLORS.text.tertiary
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': {
//                             borderColor: COLORS.primary,
//                           },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                             borderColor: COLORS.primary,
//                             borderWidth: 1
//                           },
//                           '& .MuiOutlinedInput-notchedOutline': {
//                             borderColor: fieldErrors.employeeId ? '#EF4444' : COLORS.border
//                           }
//                         }}
//                       >
//                         <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
//                           {employeeLoading ? 'Loading...' : 'Select Employee'}
//                         </MenuItem>
//                         {employees.map((emp) => (
//                           <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: '0.75rem' }}>
//                             {emp.FirstName} {emp.LastName} {emp.EmployeeID && `(${emp.EmployeeID})`}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.employeeId && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.employeeId}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       PRODUCTION DATE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                       <DatePicker
//                         value={formData.date}
//                         onChange={(value) => {
//                           setFieldErrors(prev => ({ ...prev, date: '' }));
//                           setFormData((prev) => ({ ...prev, date: value }));
//                         }}
//                         disabled={loading}
//                         slotProps={{
//                           textField: {
//                             size: "small",
//                             fullWidth: true,
//                             error: !!fieldErrors.date,
//                             sx: {
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 1.5,
//                                 fontSize: '0.75rem',
//                                 '&:hover fieldset': {
//                                   borderColor: COLORS.primary,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                   borderColor: COLORS.primary,
//                                   borderWidth: 1
//                                 },
//                                 '&.Mui-error fieldset': {
//                                   borderColor: '#EF4444'
//                                 }
//                               },
//                               '& .MuiInputBase-input': {
//                                 py: 1,
//                                 px: 1.5,
//                                 fontSize: '0.75rem',
//                                 color: COLORS.text.primary
//                               }
//                             }
//                           }
//                         }}
//                       />
//                     </LocalizationProvider>
//                     {fieldErrors.date && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.date}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );
      
//       case 1: // Production Details
//         return (
//           <Stack spacing={2}>
//             {/* Product & Operation */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Product Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       PRODUCT & OPERATION <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.rateMasterId}>
//                       <Select
//                         name="rateMasterId"
//                         value={formData.rateMasterId}
//                         onChange={handleChange}
//                         disabled={loading || rateMasterLoading}
//                         displayEmpty
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': {
//                             py: 1,
//                             px: 1.5,
//                             fontSize: '0.75rem',
//                             color: formData.rateMasterId ? COLORS.text.primary : COLORS.text.tertiary
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': {
//                             borderColor: COLORS.primary,
//                           },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                             borderColor: COLORS.primary,
//                             borderWidth: 1
//                           },
//                           '& .MuiOutlinedInput-notchedOutline': {
//                             borderColor: fieldErrors.rateMasterId ? '#EF4444' : COLORS.border
//                           }
//                         }}
//                       >
//                         <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
//                           {rateMasterLoading ? 'Loading...' : 'Select Product & Operation'}
//                         </MenuItem>
//                         {rateMaster.map((rate) => (
//                           <MenuItem key={rate._id} value={rate._id} sx={{ fontSize: '0.75rem' }}>
//                             {rate.productName || rate.productType} - {rate.operation} (₹{rate.ratePerUnit}/unit)
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.rateMasterId && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.rateMasterId}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Units Information */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Units Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       GOOD UNITS <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="goodUnits"
//                       value={formData.goodUnits}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="0"
//                       error={!!fieldErrors.goodUnits}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>units</Typography>
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
//                           '&.Mui-error fieldset': { borderColor: '#EF4444' }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                     {fieldErrors.goodUnits && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.goodUnits}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       REJECTED UNITS
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="rejectedUnits"
//                       value={formData.rejectedUnits}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="0"
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>units</Typography>
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       REWORK UNITS
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="reworkUnits"
//                       value={formData.reworkUnits}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="0"
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>units</Typography>
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               </Grid>

//               <Box sx={{ 
//                 mt: 2, 
//                 p: 1.5, 
//                 bgcolor: COLORS.background.light, 
//                 borderRadius: 1.5,
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center'
//               }}>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
//                   Total Units:
//                 </Typography>
//                 <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
//                   {totalUnits} units
//                 </Typography>
//               </Box>
//             </Paper>

//             {/* Time Information */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Time Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       START TIME <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                       <TimePicker
//                         value={formData.startTime}
//                         onChange={(value) => {
//                           setFieldErrors(prev => ({ ...prev, startTime: '' }));
//                           setFormData((prev) => ({ ...prev, startTime: value }));
//                         }}
//                         disabled={loading}
//                         slotProps={{
//                           textField: {
//                             size: "small",
//                             fullWidth: true,
//                             error: !!fieldErrors.startTime,
//                             sx: {
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 1.5,
//                                 fontSize: '0.75rem',
//                                 '&:hover fieldset': {
//                                   borderColor: COLORS.primary,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                   borderColor: COLORS.primary,
//                                   borderWidth: 1
//                                 },
//                                 '&.Mui-error fieldset': {
//                                   borderColor: '#EF4444'
//                                 }
//                               },
//                               '& .MuiInputBase-input': {
//                                 py: 1,
//                                 px: 1.5,
//                                 fontSize: '0.75rem',
//                                 color: COLORS.text.primary
//                               }
//                             }
//                           }
//                         }}
//                       />
//                     </LocalizationProvider>
//                     {fieldErrors.startTime && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.startTime}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       END TIME <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                       <TimePicker
//                         value={formData.endTime}
//                         onChange={(value) => {
//                           setFieldErrors(prev => ({ ...prev, endTime: '' }));
//                           setFormData((prev) => ({ ...prev, endTime: value }));
//                         }}
//                         disabled={loading}
//                         slotProps={{
//                           textField: {
//                             size: "small",
//                             fullWidth: true,
//                             error: !!fieldErrors.endTime,
//                             sx: {
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 1.5,
//                                 fontSize: '0.75rem',
//                                 '&:hover fieldset': {
//                                   borderColor: COLORS.primary,
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                   borderColor: COLORS.primary,
//                                   borderWidth: 1
//                                 },
//                                 '&.Mui-error fieldset': {
//                                   borderColor: '#EF4444'
//                                 }
//                               },
//                               '& .MuiInputBase-input': {
//                                 py: 1,
//                                 px: 1.5,
//                                 fontSize: '0.75rem',
//                                 color: COLORS.text.primary
//                               }
//                             }
//                           }
//                         }}
//                       />
//                     </LocalizationProvider>
//                     {fieldErrors.endTime && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
//                         {fieldErrors.endTime}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Additional Information */}
//             <Paper sx={{ 
//               p: 2, 
//               bgcolor: COLORS.background.white, 
//               borderRadius: 1.5, 
//               border: `1px solid ${COLORS.border}`,
//               boxShadow: 'none'
//             }}>
//               <Typography sx={{ 
//                 fontSize: '0.8rem', 
//                 fontWeight: 600, 
//                 color: COLORS.primary, 
//                 mb: 1.5 
//               }}>
//                 Additional Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       QUALITY BONUS
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="qualityBonus"
//                       value={formData.qualityBonus}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="0"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>₹</Typography>
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       EFFICIENCY BONUS
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="efficiencyBonus"
//                       value={formData.efficiencyBonus}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="0"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>₹</Typography>
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       MACHINE ID
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="machineId"
//                       value={formData.machineId}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., M-001"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       BATCH NUMBER
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="batchNumber"
//                       value={formData.batchNumber}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., BATCH-001"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       ORDER NUMBER
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="orderNumber"
//                       value={formData.orderNumber}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., PO-001"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       REMARKS
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="remarks"
//                       value={formData.remarks}
//                       onChange={handleChange}
//                       multiline
//                       rows={2}
//                       disabled={loading}
//                       placeholder="Enter any additional remarks..."
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary,
//                           '&::placeholder': {
//                             color: COLORS.text.tertiary,
//                             fontSize: '0.75rem'
//                           }
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {selectedRate && (
//               <Paper sx={{ 
//                 p: 2, 
//                 bgcolor: COLORS.background.light, 
//                 borderRadius: 1.5, 
//                 border: `1px solid ${COLORS.border}`,
//                 boxShadow: 'none'
//               }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                   SELECTED RATE DETAILS
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Box>
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
//                       <strong>Product:</strong> {selectedRate.productName || selectedRate.productType}
//                     </Typography>
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, mt: 0.5 }}>
//                       <strong>Operation:</strong> {selectedRate.operation}
//                     </Typography>
//                   </Box>
//                   <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
//                     ₹{selectedRate.ratePerUnit}/unit
//                   </Typography>
//                 </Box>
//               </Paper>
//             )}
//           </Stack>
//         );
      
//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//           Add Production Entry
//         </Typography>
//       </DialogTitle>

//       {/* Modern Stepper with Primary Color */}
//       <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
//                   {label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//         {renderStepContent(activeStep)}

//         {error && (
//           <Alert 
//             severity="error" 
//             sx={{ 
//               mt: 2, 
//               borderRadius: 1.5,
//               fontSize: '0.75rem',
//               py: 0.5,
//               '& .MuiAlert-icon': { fontSize: '1.25rem' }
//             }}
//           >
//             {error}
//           </Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleBack}
//           disabled={activeStep === 0 || loading}
//           size="small"
//           startIcon={<NavigateBefore sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: COLORS.primary,
//               bgcolor: `${COLORS.primary}10`
//             }
//           }}
//         >
//           Back
//         </Button>
//         <Box>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             size="small"
//             sx={{
//               height: 32,
//               px: 2,
//               mr: 1,
//               borderRadius: 1.5,
//               border: `1px solid ${COLORS.border}`,
//               color: COLORS.text.secondary,
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               textTransform: 'none',
//               '&:hover': {
//                 borderColor: COLORS.primary,
//                 bgcolor: `${COLORS.primary}10`
//               }
//             }}
//           >
//             Cancel
//           </Button>
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               size="small"
//               startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': {
//                   bgcolor: COLORS.primaryDark,
//                 }
//               }}
//             >
//               {loading ? 'Adding...' : 'Add Production'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading}
//               size="small"
//               endIcon={<NavigateNext sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': {
//                   bgcolor: COLORS.primaryDark,
//                 }
//               }}
//             >
//               Next
//             </Button>
//           )}
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddProduction;




import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  MenuItem,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  styled,
  StepConnector,
  stepConnectorClasses,
  Divider,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Autocomplete,
  Tooltip,
  IconButton
} from "@mui/material";

import { Add as AddIcon, NavigateNext, NavigateBefore, Search as SearchIcon } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import axios from "axios";
import BASE_URL from "../../../config/Config";
import AddPieceRate from "../pieceratemaster/AddPieceRate";
import AddEmployees from "../employeemaster/AddEmployees";


// Color constants matching AddVendor component
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// Modern Stepper Connector with Primary Color
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ["Basic Details", "Production Details"];

const AddProduction = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [rateMaster, setRateMaster] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRateMaster, setSelectedRateMaster] = useState(null);

  const [loading, setLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [rateMasterLoading, setRateMasterLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // State for Add dialogs
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [addRateMasterOpen, setAddRateMasterOpen] = useState(false);

  const initialState = {
    employeeId: "",
    date: new Date(),
    rateMasterId: "",
    goodUnits: "",
    rejectedUnits: "",
    reworkUnits: "",
    qualityBonus: "",
    efficiencyBonus: "",
    startTime: new Date(),
    endTime: new Date(),
    machineId: "",
    batchNumber: "",
    orderNumber: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialState);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(initialState);
      setActiveStep(0);
      setError("");
      setFieldErrors({});
      setSelectedEmployee(null);
      setSelectedRateMaster(null);
    }
  }, [open]);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchRateMaster();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setEmployeeLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error("Employee fetch error:", err);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const fetchRateMaster = async () => {
    try {
      setRateMasterLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/piece-rate-master`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setRateMaster(response.data.data || []);
      }
    } catch (err) {
      console.error("Rate master fetch error:", err);
    } finally {
      setRateMasterLoading(false);
    }
  };

  const handleEmployeeChange = (event, newValue) => {
    setSelectedEmployee(newValue);
    if (newValue) {
      setFormData(prev => ({ ...prev, employeeId: newValue._id }));
      setFieldErrors(prev => ({ ...prev, employeeId: '' }));
    } else {
      setFormData(prev => ({ ...prev, employeeId: "" }));
    }
  };

  const handleRateMasterChange = (event, newValue) => {
    setSelectedRateMaster(newValue);
    if (newValue) {
      setFormData(prev => ({ ...prev, rateMasterId: newValue._id }));
      setFieldErrors(prev => ({ ...prev, rateMasterId: '' }));
    } else {
      setFormData(prev => ({ ...prev, rateMasterId: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setError("");
    
    if (name === 'goodUnits' || name === 'rejectedUnits' || name === 'reworkUnits' ||
        name === 'qualityBonus' || name === 'efficiencyBonus') {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    setSelectedEmployee(newEmployee);
    setFormData(prev => ({ ...prev, employeeId: newEmployee._id }));
  };

  const handleRateMasterAdded = (newRateMaster) => {
    setRateMaster(prev => [...prev, newRateMaster]);
    setSelectedRateMaster(newRateMaster);
    setFormData(prev => ({ ...prev, rateMasterId: newRateMaster._id }));
  };

  const getEmployeeName = (employee) => {
    if (!employee) return '';
    const firstName = employee.FirstName || '';
    const lastName = employee.LastName || '';
    const empId = employee.EmployeeID || '';
    return `${firstName} ${lastName}${empId ? ` (${empId})` : ''}`.trim();
  };

  const getRateMasterLabel = (rate) => {
    if (!rate) return '';
    return `${rate.productName || rate.productType} - ${rate.operation} (₹${rate.ratePerUnit}/unit)`;
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'employeeId':
        if (!value) return 'Employee is required';
        break;
      case 'date':
        if (!value) return 'Production date is required';
        break;
      case 'rateMasterId':
        if (!value) return 'Product & Operation is required';
        break;
      case 'goodUnits':
        if (!value) return 'Good units are required';
        if (Number(value) <= 0) return 'Good units must be greater than 0';
        break;
      case 'startTime':
        if (!value) return 'Start time is required';
        break;
      case 'endTime':
        if (!value) return 'End time is required';
        break;
      default:
        return '';
    }
    return '';
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.employeeId) {
          errors.employeeId = 'Employee is required';
          isValid = false;
        }
        if (!formData.date) {
          errors.date = 'Production date is required';
          isValid = false;
        }
        break;
      
      case 1:
        if (!formData.rateMasterId) {
          errors.rateMasterId = 'Product & Operation is required';
          isValid = false;
        }
        if (!formData.goodUnits) {
          errors.goodUnits = 'Good units are required';
          isValid = false;
        } else if (Number(formData.goodUnits) <= 0) {
          errors.goodUnits = 'Good units must be greater than 0';
          isValid = false;
        }
        if (!formData.startTime) {
          errors.startTime = 'Start time is required';
          isValid = false;
        }
        if (!formData.endTime) {
          errors.endTime = 'End time is required';
          isValid = false;
        }
        break;
      
      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.employeeId) {
      errors.employeeId = 'Employee is required';
      isValid = false;
    }
    if (!formData.date) {
      errors.date = 'Production date is required';
      isValid = false;
    }
    if (!formData.rateMasterId) {
      errors.rateMasterId = 'Product & Operation is required';
      isValid = false;
    }
    if (!formData.goodUnits) {
      errors.goodUnits = 'Good units are required';
      isValid = false;
    } else if (Number(formData.goodUnits) <= 0) {
      errors.goodUnits = 'Good units must be greater than 0';
      isValid = false;
    }
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
      isValid = false;
    }
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
    }
    return isValid;
  };

  const totalUnits = useMemo(() => {
    return (
      Number(formData.goodUnits || 0) +
      Number(formData.rejectedUnits || 0) +
      Number(formData.reworkUnits || 0)
    );
  }, [formData.goodUnits, formData.rejectedUnits, formData.reworkUnits]);

  const selectedRate = useMemo(() => {
    return rateMaster.find((rate) => rate._id === formData.rateMasterId);
  }, [formData.rateMasterId, rateMaster]);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const selectedRateData = rateMaster.find((rate) => rate._id === formData.rateMasterId);
      
      if (!selectedRateData) {
        setError("Invalid rate master selected. Please select again.");
        setLoading(false);
        return;
      }

      const productName = selectedRateData.productName || selectedRateData.productType;
      const operation = selectedRateData.operation;

      if (!productName || !operation) {
        setError("Selected rate master is missing required fields");
        setLoading(false);
        return;
      }

      const payload = {
        employeeId: formData.employeeId,
        date: formData.date.toISOString(),
        productName: productName,
        operation: operation,
        totalUnits: totalUnits,
        goodUnits: Number(formData.goodUnits),
        rejectedUnits: Number(formData.rejectedUnits || 0),
        reworkUnits: Number(formData.reworkUnits || 0),
        qualityBonus: Number(formData.qualityBonus || 0),
        efficiencyBonus: Number(formData.efficiencyBonus || 0),
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        machineId: formData.machineId || "",
        batchNumber: formData.batchNumber || "",
        orderNumber: formData.orderNumber || "",
        remarks: formData.remarks || "",
      };

      const response = await axios.post(`${BASE_URL}/api/production/record`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || "Failed to record production");
      }
    } catch (err) {
      console.error("Error recording production:", err);
      setError(err.response?.data?.message || "Failed to record production. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setFieldErrors({});
    setError("");
    setSelectedEmployee(null);
    setSelectedRateMaster(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      backgroundColor: COLORS.background.white,
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
      '&.Mui-error fieldset': { borderColor: '#EF4444' }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': {
        color: COLORS.text.tertiary,
        fontSize: '0.75rem'
      }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={labelStyle}>
                        EMPLOYEE <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <Tooltip title="Add New Employee">
                        <IconButton
                          size="small"
                          onClick={() => setAddEmployeeOpen(true)}
                          disabled={loading}
                          sx={{
                            color: COLORS.primary,
                            '&:hover': { bgcolor: COLORS.primaryLight }
                          }}
                        >
                          <AddIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Autocomplete
                      fullWidth
                      options={employees}
                      value={selectedEmployee}
                      onChange={handleEmployeeChange}
                      getOptionLabel={(option) => getEmployeeName(option)}
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                      loading={employeeLoading}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search employee by name or ID..."
                          error={!!fieldErrors.employeeId}
                          sx={inputStyle}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <>
                                {employeeLoading && <CircularProgress size={16} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {option.FirstName} {option.LastName}
                            </Typography>
                            {option.EmployeeID && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                ID: {option.EmployeeID}
                              </Typography>
                            )}
                          </Box>
                        </li>
                      )}
                      ListboxProps={{
                        sx: {
                          maxHeight: 250,
                          '& .MuiAutocomplete-option': {
                            fontSize: '0.75rem',
                            py: 1,
                            px: 1.5
                          }
                        }
                      }}
                    />
                    {fieldErrors.employeeId && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.employeeId}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      PRODUCTION DATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={formData.date}
                        onChange={(value) => {
                          setFieldErrors(prev => ({ ...prev, date: '' }));
                          setFormData((prev) => ({ ...prev, date: value }));
                        }}
                        disabled={loading}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!fieldErrors.date,
                            sx: inputStyle
                          }
                        }}
                      />
                    </LocalizationProvider>
                    {fieldErrors.date && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.date}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Product Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={labelStyle}>
                        PRODUCT & OPERATION <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <Tooltip title="Add New Piece Rate">
                        <IconButton
                          size="small"
                          onClick={() => setAddRateMasterOpen(true)}
                          disabled={loading}
                          sx={{
                            color: COLORS.primary,
                            '&:hover': { bgcolor: COLORS.primaryLight }
                          }}
                        >
                          <AddIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Autocomplete
                      fullWidth
                      options={rateMaster}
                      value={selectedRateMaster}
                      onChange={handleRateMasterChange}
                      getOptionLabel={(option) => getRateMasterLabel(option)}
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                      loading={rateMasterLoading}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search product & operation..."
                          error={!!fieldErrors.rateMasterId}
                          sx={inputStyle}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <>
                                {rateMasterLoading && <CircularProgress size={16} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {option.productName || option.productType}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {option.operation} - ₹{option.ratePerUnit}/unit
                            </Typography>
                          </Box>
                        </li>
                      )}
                      ListboxProps={{
                        sx: {
                          maxHeight: 250,
                          '& .MuiAutocomplete-option': {
                            fontSize: '0.75rem',
                            py: 1,
                            px: 1.5
                          }
                        }
                      }}
                    />
                    {fieldErrors.rateMasterId && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.rateMasterId}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Rest of the component remains the same */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Units Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>GOOD UNITS <span style={{ color: '#EF4444' }}>*</span></Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="goodUnits"
                      value={formData.goodUnits}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="0"
                      error={!!fieldErrors.goodUnits}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>units</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                    {fieldErrors.goodUnits && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.goodUnits}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>REJECTED UNITS</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rejectedUnits"
                      value={formData.rejectedUnits}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="0"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>units</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>REWORK UNITS</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="reworkUnits"
                      value={formData.reworkUnits}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="0"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>units</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ 
                mt: 2, 
                p: 1.5, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  Total Units:
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                  {totalUnits} units
                </Typography>
              </Box>
            </Paper>

            {/* Time Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Time Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>START TIME <span style={{ color: '#EF4444' }}>*</span></Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        value={formData.startTime}
                        onChange={(value) => {
                          setFieldErrors(prev => ({ ...prev, startTime: '' }));
                          setFormData((prev) => ({ ...prev, startTime: value }));
                        }}
                        disabled={loading}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!fieldErrors.startTime,
                            sx: inputStyle
                          }
                        }}
                      />
                    </LocalizationProvider>
                    {fieldErrors.startTime && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.startTime}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>END TIME <span style={{ color: '#EF4444' }}>*</span></Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        value={formData.endTime}
                        onChange={(value) => {
                          setFieldErrors(prev => ({ ...prev, endTime: '' }));
                          setFormData((prev) => ({ ...prev, endTime: value }));
                        }}
                        disabled={loading}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!fieldErrors.endTime,
                            sx: inputStyle
                          }
                        }}
                      />
                    </LocalizationProvider>
                    {fieldErrors.endTime && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.endTime}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Additional Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Additional Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>QUALITY BONUS</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="qualityBonus"
                      value={formData.qualityBonus}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="0"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>₹</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>EFFICIENCY BONUS</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="efficiencyBonus"
                      value={formData.efficiencyBonus}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="0"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>₹</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>MACHINE ID</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="machineId"
                      value={formData.machineId}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., M-001"
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>BATCH NUMBER</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., BATCH-001"
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>ORDER NUMBER</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., PO-001"
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>REMARKS</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      disabled={loading}
                      placeholder="Enter any additional remarks..."
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {selectedRate && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  SELECTED RATE DETAILS
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      <strong>Product:</strong> {selectedRate.productName || selectedRate.productType}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, mt: 0.5 }}>
                      <strong>Operation:</strong> {selectedRate.operation}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                    ₹{selectedRate.ratePerUnit}/unit
                  </Typography>
                </Box>
              </Paper>
            )}
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
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Add Production Entry
          </Typography>
        </DialogTitle>

        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          {renderStepContent(activeStep)}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5,
                '& .MuiAlert-icon': { fontSize: '1.25rem' }
              }}
            >
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          justifyContent: 'space-between'
        }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            size="small"
            startIcon={<NavigateBefore sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Back
          </Button>
          <Box>
            <Button
              onClick={handleClose}
              disabled={loading}
              size="small"
              sx={{
                height: 32,
                px: 2,
                mr: 1,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text.secondary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: COLORS.primary,
                  bgcolor: `${COLORS.primary}10`
                }
              }}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                size="small"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                sx={{
                  height: 32,
                  px: 2,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primary,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: COLORS.primaryDark,
                  }
                }}
              >
                {loading ? 'Adding...' : 'Add Production'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                size="small"
                endIcon={<NavigateNext sx={{ fontSize: '1rem' }} />}
                sx={{
                  height: 32,
                  px: 2,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primary,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: COLORS.primaryDark,
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Add Employee Dialog */}
      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAdd={handleEmployeeAdded}
      />

      {/* Add Piece Rate Dialog */}
      <AddPieceRate
        open={addRateMasterOpen}
        onClose={() => setAddRateMasterOpen(false)}
        onAdd={handleRateMasterAdded}
      />
    </>
  );
};

export default AddProduction;