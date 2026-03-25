// import React, { useState, useEffect } from 'react';
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
//   Grid,
//   CircularProgress,
//   Box,
//   Typography,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   FormHelperText,
//   Divider,
//   Paper,
//   Snackbar,
//   Stepper,
//   Step,
//   StepLabel,
//   styled,
//   StepConnector
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   Work as WorkIcon,
//   Business as BusinessIcon,
//   LocationOn as LocationIcon,
//   AttachMoney as MoneyIcon,
//   School as SchoolIcon,
//   Build as BuildIcon,
//   Delete as DeleteIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// /* ------------------- Custom Stepper Styling ------------------- */
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   '& .MuiStepConnector-line': {
//     height: 4,
//     border: 0,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//   },
//   '&.Mui-active .MuiStepConnector-line': {
//     background: 'linear-gradient(90deg, #164e63, #00B4D8)',
//   },
//   '&.Mui-completed .MuiStepConnector-line': {
//     background: 'linear-gradient(90deg, #164e63, #00B4D8)',
//   },
// }));

// const steps = ["Basic Information", "Job Details", "Review & Save"];

// const EditJobOpening = ({ open, onClose, job, onUpdate }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     description: '',
//     companyIntro: '',
//     requirements: [],
//     responsibilities: [],
//     location: '',
//     department: '',
//     employmentType: '',
//     experienceRequired: {
//       min: 0,
//       max: 0
//     },
//     salaryRange: {
//       min: 0,
//       max: 0,
//       currency: 'INR'
//     },
//     skills: [],
//     education: []
//   });

//   // Temporary input fields for dynamic arrays
//   const [requirementInput, setRequirementInput] = useState('');
//   const [responsibilityInput, setResponsibilityInput] = useState('');
//   const [skillInput, setSkillInput] = useState('');
//   const [educationInput, setEducationInput] = useState('');

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Employment types
//   const employmentTypes = ['Permanent', 'Contract', 'Temporary', 'Internship']

//   // Currencies
//   const currencies = ['INR'];

//   // Load job data when modal opens
//   useEffect(() => {
//     if (job && open) {
//       setFormData({
//         description: job.description || '',
//         companyIntro: job.companyIntro || '',
//         requirements: job.requirements || [],
//         responsibilities: job.responsibilities || [],
//         location: job.location || '',
//         department: job.department || '',
//         employmentType: job.employmentType || '',
//         experienceRequired: job.experienceRequired || { min: 0, max: 0 },
//         salaryRange: job.salaryRange || { min: 0, max: 0, currency: 'INR' },
//         skills: job.skills || [],
//         education: job.education || []
//       });
//     }
//   }, [job, open]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle dynamic array additions
//   const handleAddRequirement = () => {
//     if (requirementInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         requirements: [...prev.requirements, requirementInput.trim()]
//       }));
//       setRequirementInput('');
//     }
//   };

//   const handleRemoveRequirement = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       requirements: prev.requirements.filter((_, i) => i !== index)
//     }));
//   };

//   const handleAddResponsibility = () => {
//     if (responsibilityInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
//       }));
//       setResponsibilityInput('');
//     }
//   };

//   const handleRemoveResponsibility = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       responsibilities: prev.responsibilities.filter((_, i) => i !== index)
//     }));
//   };

//   const handleAddSkill = () => {
//     if (skillInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         skills: [...prev.skills, skillInput.trim()]
//       }));
//       setSkillInput('');
//     }
//   };

//   const handleRemoveSkill = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter((_, i) => i !== index)
//     }));
//   };

//   const handleAddEducation = () => {
//     if (educationInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         education: [...prev.education, educationInput.trim()]
//       }));
//       setEducationInput('');
//     }
//   };

//   const handleRemoveEducation = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       education: prev.education.filter((_, i) => i !== index)
//     }));
//   };

//   // Stepper navigation
//   const handleNext = () => {
//     if (validateStep()) {
//       setActiveStep(prev => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep(prev => prev - 1);
//   };

//   // Validation
//   const validateStep = () => {
//     setError('');

//     switch (activeStep) {
//       case 0:
//         if (!formData.companyIntro.trim()) {
//           setError('Company introduction is required');
//           return false;
//         }
//         if (!formData.location.trim()) {
//           setError('Location is required');
//           return false;
//         }
//         if (!formData.department.trim()) {
//           setError('Department is required');
//           return false;
//         }
//         if (!formData.employmentType) {
//           setError('Employment type is required');
//           return false;
//         }
//         break;

//       case 1:
//         if (!formData.description.trim()) {
//           setError('Job description is required');
//           return false;
//         }
//         if (formData.requirements.length === 0) {
//           setError('Please add at least one requirement');
//           return false;
//         }
//         if (formData.responsibilities.length === 0) {
//           setError('Please add at least one responsibility');
//           return false;
//         }
//         if (formData.experienceRequired.min < 0 || formData.experienceRequired.max < formData.experienceRequired.min) {
//           setError('Please enter valid experience range');
//           return false;
//         }
//         if (formData.salaryRange.min < 0 || formData.salaryRange.max < formData.salaryRange.min) {
//           setError('Please enter valid salary range');
//           return false;
//         }
//         break;

//       default:
//         break;
//     }

//     return true;
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!validateStep()) return;

//     setSaving(true);
//     setError('');
//     setSuccess('');

//     const payload = {
//       description: formData.description,
//       companyIntro: formData.companyIntro,
//       requirements: formData.requirements,
//       responsibilities: formData.responsibilities,
//       location: formData.location,
//       department: formData.department,
//       employmentType: formData.employmentType,
//       experienceRequired: {
//         min: Number(formData.experienceRequired.min),
//         max: Number(formData.experienceRequired.max)
//       },
//       salaryRange: {
//         min: Number(formData.salaryRange.min),
//         max: Number(formData.salaryRange.max),
//         currency: formData.salaryRange.currency
//       },
//       skills: formData.skills,
//       education: formData.education
//     };

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(`${BASE_URL}/api/jobs/${job._id}`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         setSuccess('Job updated successfully!');
//         onUpdate(response.data.data);

//         setTimeout(() => {
//           onClose();
//           setActiveStep(0);
//         }, 1500);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update job');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleModalClose = () => {
//     setActiveStep(0);
//     setError('');
//     setSuccess('');
//     onClose();
//   };

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={handleModalClose}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: { borderRadius: 2, minHeight: 500 }
//         }}
//       >
//         <DialogTitle sx={{
//           background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//           color: '#fff',
//           fontWeight: 600,
//           fontSize: '20px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1
//         }}>
//           <EditIcon /> Edit Job Opening
//         </DialogTitle>

//         <DialogContent sx={{ pt: 3 }}>
//           <Stepper
//             activeStep={activeStep}
//             alternativeLabel
//             connector={<ColorConnector />}
//             sx={{ mb: 5, mt: 3 }}
//           >
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>
//                   <Typography fontWeight={500}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           <Box sx={{ maxWidth: 800, mx: 'auto' }}>
//             <Stack spacing={2}>

//               {/* Step 1: Basic Information */}
//               {activeStep === 0 && (
//                 <>
//                   <TextField
//                     label="Company Introduction"
//                     name="companyIntro"
//                     multiline
//                     rows={2}
//                     fullWidth
//                     value={formData.companyIntro}
//                     onChange={handleChange}
//                     placeholder="Brief introduction about your company..."
//                     required
//                   />

//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         label="Location"
//                         name="location"
//                         width="500px"
//                         value={formData.location}
//                         onChange={handleChange}
//                         placeholder="e.g., Plant Unit A"
//                         required
//                         InputProps={{
//                           startAdornment: <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         label="Department"
//                         name="department"
//                         fullWidth
//                         value={formData.department}
//                         onChange={handleChange}
//                         placeholder="e.g., Production"
//                         required
//                         InputProps={{
//                           startAdornment: <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6} sx={{width:"250px"}}>
//                       <FormControl >
//                         <InputLabel>Employment Type</InputLabel>
//                         <Select
//                           name="employmentType"
//                           value={formData.employmentType}
//                           onChange={handleChange}
//                           label="Employment Type"
//                         >
//                           {employmentTypes.map(type => (
//                             <MenuItem key={type} value={type}>{type}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>

//                 </>
//               )}

//               {/* Step 2: Job Details */}
//               {activeStep === 1 && (
//                 <>
//                   <TextField
//                     label="Job Description"
//                     name="description"
//                     multiline
//                     rows={2}
//                     fullWidth
//                     value={formData.description}
//                     onChange={handleChange}
//                     placeholder="Detailed description of the job role..."
//                     required
//                   />

//                   {/* Requirements */}
//                   <Box>
//                     <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                       Requirements <span style={{ color: 'red' }}>*</span>
//                     </Typography>
//                     <Stack direction="row" spacing={1} mb={1}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={requirementInput}
//                         onChange={(e) => setRequirementInput(e.target.value)}
//                         placeholder="Add a requirement (e.g., Minimum 2 years experience)"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             handleAddRequirement();
//                           }
//                         }}
//                       />
//                       <Button
//                         variant="contained"
//                         onClick={handleAddRequirement}
//                         disabled={!requirementInput.trim()}
//                         sx={{
//                           background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                           '&:hover': { opacity: 0.9 }
//                         }}
//                       >
//                         Add
//                       </Button>
//                     </Stack>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 50 }}>
//                       {formData.requirements.map((req, index) => (
//                         <Chip
//                           key={index}
//                           label={req}
//                           onDelete={() => handleRemoveRequirement(index)}
//                           color="primary"
//                           variant="outlined"
//                           deleteIcon={<DeleteIcon />}
//                         />
//                       ))}
//                     </Box>
//                   </Box>

//                   {/* Responsibilities */}
//                   <Box>
//                     <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                       Responsibilities <span style={{ color: 'red' }}>*</span>
//                     </Typography>
//                     <Stack direction="row" spacing={1} mb={1}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={responsibilityInput}
//                         onChange={(e) => setResponsibilityInput(e.target.value)}
//                         placeholder="Add a responsibility (e.g., Operate production machinery)"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             handleAddResponsibility();
//                           }
//                         }}
//                       />
//                       <Button
//                         variant="contained"
//                         onClick={handleAddResponsibility}
//                         disabled={!responsibilityInput.trim()}
//                         sx={{
//                           background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                           '&:hover': { opacity: 0.9 }
//                         }}
//                       >
//                         Add
//                       </Button>
//                     </Stack>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 50 }}>
//                       {formData.responsibilities.map((resp, index) => (
//                         <Chip
//                           key={index}
//                           label={resp}
//                           onDelete={() => handleRemoveResponsibility(index)}
//                           color="secondary"
//                           variant="outlined"
//                           deleteIcon={<DeleteIcon />}
//                         />
//                       ))}
//                     </Box>
//                   </Box>

//                   {/* Experience Range */}
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={6} sx={{ width: "150px" }}>
//                       <TextField
//                         label="Min Experience (years)"
//                         name="experienceRequired.min"
//                         type="number"
//                         value={formData.experienceRequired.min}
//                         onChange={handleChange}
//                         inputProps={{ min: 0 }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6} sx={{ width: "150px" }}>
//                       <TextField
//                         label="Max Experience (years)"
//                         name="experienceRequired.max"
//                         type="number"
//                         fullWidth
//                         value={formData.experienceRequired.max}
//                         onChange={handleChange}
//                         inputProps={{ min: formData.experienceRequired.min }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={4} sx={{ width: "150px" }}>
//                       <TextField
//                         label="Min Salary"
//                         name="salaryRange.min"
//                         type="number"
//                         fullWidth
//                         value={formData.salaryRange.min}
//                         onChange={handleChange}
//                         inputProps={{ min: 0 }}
//                         InputProps={{
//                           startAdornment: <MoneyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={4} sx={{ width: "150px" }}>
//                       <TextField
//                         label="Max Salary"
//                         name="salaryRange.max"
//                         type="number"
//                         fullWidth
//                         value={formData.salaryRange.max}
//                         onChange={handleChange}
//                         inputProps={{ min: formData.salaryRange.min }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={4}>
//                       <FormControl fullWidth>
//                         <InputLabel>Currency</InputLabel>
//                         <Select
//                           name="salaryRange.currency"
//                           value={formData.salaryRange.currency}
//                           onChange={handleChange}
//                           label="Currency"
//                         >
//                           {currencies.map(curr => (
//                             <MenuItem key={curr} value={curr}>{curr}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>



//                   {/* Skills */}
//                   <Box>
//                     <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                       Required Skills
//                     </Typography>
//                     <Stack direction="row" spacing={1} mb={1}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={skillInput}
//                         onChange={(e) => setSkillInput(e.target.value)}
//                         placeholder="Add a skill (e.g., Lathe operation)"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             handleAddSkill();
//                           }
//                         }}
//                       />
//                       <Button
//                         variant="contained"
//                         onClick={handleAddSkill}
//                         disabled={!skillInput.trim()}
//                         sx={{
//                           background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                           '&:hover': { opacity: 0.9 }
//                         }}
//                       >
//                         Add
//                       </Button>
//                     </Stack>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                       {formData.skills.map((skill, index) => (
//                         <Chip
//                           key={index}
//                           label={skill}
//                           onDelete={() => handleRemoveSkill(index)}
//                           icon={<BuildIcon />}
//                           variant="outlined"
//                           deleteIcon={<DeleteIcon />}
//                         />
//                       ))}
//                     </Box>
//                   </Box>

//                   {/* Education */}
//                   <Box>
//                     <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                       Education Requirements
//                     </Typography>
//                     <Stack direction="row" spacing={1} mb={1}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={educationInput}
//                         onChange={(e) => setEducationInput(e.target.value)}
//                         placeholder="Add education (e.g., ITI/Diploma in Mechanical)"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             handleAddEducation();
//                           }
//                         }}
//                       />
//                       <Button
//                         variant="contained"
//                         onClick={handleAddEducation}
//                         disabled={!educationInput.trim()}
//                         sx={{
//                           background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                           '&:hover': { opacity: 0.9 }
//                         }}
//                       >
//                         Add
//                       </Button>
//                     </Stack>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                       {formData.education.map((edu, index) => (
//                         <Chip
//                           key={index}
//                           label={edu}
//                           onDelete={() => handleRemoveEducation(index)}
//                           icon={<SchoolIcon />}
//                           variant="outlined"
//                           deleteIcon={<DeleteIcon />}
//                         />
//                       ))}
//                     </Box>
//                   </Box>
//                 </>
//               )}

//               {/* Step 3: Review & Save */}
//               {activeStep === 2 && (
//                 <>
//                   <Alert severity="info" >
//                     Please review all the information before saving.
//                   </Alert>

//                   <Paper variant="outlined" sx={{ p: 2 }}>
//                     <Typography variant="h6" gutterBottom fontWeight={600}>
//                       Summary
//                     </Typography>

//                     <Stack spacing={2}>
//                       <Box>
//                         <Typography variant="subtitle2" color="textSecondary">Company</Typography>
//                         <Typography>{formData.companyIntro.substring(0, 100)}...</Typography>
//                       </Box>

//                       <Divider />

//                       <Grid container spacing={2}>
//                         <Grid item xs={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Location</Typography>
//                           <Typography>{formData.location}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Department</Typography>
//                           <Typography>{formData.department}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Employment Type</Typography>
//                           <Typography>{formData.employmentType}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
//                           <Typography>{formData.experienceRequired.min} - {formData.experienceRequired.max} years</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Salary Range</Typography>
//                           <Typography>{formData.salaryRange.currency} {formData.salaryRange.min.toLocaleString()} - {formData.salaryRange.max.toLocaleString()}</Typography>
//                         </Grid>
//                       </Grid>

//                       <Divider />

//                       <Box>
//                         <Typography variant="subtitle2" color="textSecondary" gutterBottom>
//                           Requirements ({formData.requirements.length})
//                         </Typography>
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                           {formData.requirements.map((req, idx) => (
//                             <Chip key={idx} label={req} size="small" variant="outlined" />
//                           ))}
//                         </Box>
//                       </Box>

//                       <Box>
//                         <Typography variant="subtitle2" color="textSecondary" gutterBottom>
//                           Responsibilities ({formData.responsibilities.length})
//                         </Typography>
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                           {formData.responsibilities.map((resp, idx) => (
//                             <Chip key={idx} label={resp} size="small" variant="outlined" />
//                           ))}
//                         </Box>
//                       </Box>
//                     </Stack>
//                   </Paper>
//                 </>
//               )}

//               {error && <Alert severity="error">{error}</Alert>}
//               {success && <Alert severity="success">{success}</Alert>}
//             </Stack>
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{ p: 1, borderTop: '1px solid #e2e8f0' }}>
//           <Button onClick={handleModalClose}>
//             Cancel
//           </Button>

//           <Box sx={{ flex: 1 }} />

//           {activeStep > 0 && (
//             <Button onClick={handleBack}>
//               Back
//             </Button>
//           )}

//           {activeStep < steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               sx={{
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': { opacity: 0.9 }
//               }}
//             >
//               Next
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={saving}
//               startIcon={!saving && <EditIcon />}
//               sx={{
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': { opacity: 0.9 }
//               }}
//             >
//               {saving ? <CircularProgress size={24} /> : 'Save Changes'}
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default EditJobOpening;

import React, { useState, useEffect } from 'react';
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
  Grid,
  CircularProgress,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  stepConnectorClasses,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching other components
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

// Custom Stepper Connector
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
    backgroundColor: COLORS.border,
    borderRadius: 1,
  },
}));

const steps = ["Basic Information", "Job Details", "Review & Save"];

const EditJobOpening = ({ open, onClose, job, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    description: '',
    companyIntro: '',
    requirements: [],
    responsibilities: [],
    location: '',
    department: '',
    employmentType: '',
    experienceRequired: { min: 0, max: 0 },
    salaryRange: { min: 0, max: 0, currency: 'INR' },
    skills: [],
    education: []
  });

  const [requirementInput, setRequirementInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [educationInput, setEducationInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const employmentTypes = ['Permanent', 'Contract', 'Temporary', 'Internship'];
  const currencies = ['INR'];

  useEffect(() => {
    if (job && open) {
      setFormData({
        description: job.description || '',
        companyIntro: job.companyIntro || '',
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        location: job.location || '',
        department: job.department || '',
        employmentType: job.employmentType || '',
        experienceRequired: job.experienceRequired || { min: 0, max: 0 },
        salaryRange: job.salaryRange || { min: 0, max: 0, currency: 'INR' },
        skills: job.skills || [],
        education: job.education || []
      });
    }
  }, [job, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
      if (fieldErrors.requirements) {
        setFieldErrors(prev => ({ ...prev, requirements: '' }));
      }
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
    if (formData.requirements.length === 1) {
      setFieldErrors(prev => ({ ...prev, requirements: 'Please add at least one requirement' }));
    }
  };

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
      }));
      setResponsibilityInput('');
      if (fieldErrors.responsibilities) {
        setFieldErrors(prev => ({ ...prev, responsibilities: '' }));
      }
    }
  };

  const handleRemoveResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
    if (formData.responsibilities.length === 1) {
      setFieldErrors(prev => ({ ...prev, responsibilities: 'Please add at least one responsibility' }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    if (educationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, educationInput.trim()]
      }));
      setEducationInput('');
    }
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const validateStep = () => {
    const errors = {};
    let isValid = true;

    switch (activeStep) {
      case 0:
        if (!formData.companyIntro.trim()) {
          errors.companyIntro = 'Company introduction is required';
          isValid = false;
        }
        if (!formData.location.trim()) {
          errors.location = 'Location is required';
          isValid = false;
        }
        if (!formData.department.trim()) {
          errors.department = 'Department is required';
          isValid = false;
        }
        if (!formData.employmentType) {
          errors.employmentType = 'Employment type is required';
          isValid = false;
        }
        break;

      case 1:
        if (!formData.description.trim()) {
          errors.description = 'Job description is required';
          isValid = false;
        }
        if (formData.requirements.length === 0) {
          errors.requirements = 'Please add at least one requirement';
          isValid = false;
        }
        if (formData.responsibilities.length === 0) {
          errors.responsibilities = 'Please add at least one responsibility';
          isValid = false;
        }
        if (formData.experienceRequired.min < 0 || formData.experienceRequired.max < formData.experienceRequired.min) {
          errors.experience = 'Please enter valid experience range';
          isValid = false;
        }
        if (formData.salaryRange.min < 0 || formData.salaryRange.max < formData.salaryRange.min) {
          errors.salary = 'Please enter valid salary range';
          isValid = false;
        }
        break;

      default:
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors before proceeding');
    } else {
      setError('');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      description: formData.description,
      companyIntro: formData.companyIntro,
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
      location: formData.location,
      department: formData.department,
      employmentType: formData.employmentType,
      experienceRequired: {
        min: Number(formData.experienceRequired.min),
        max: Number(formData.experienceRequired.max)
      },
      salaryRange: {
        min: Number(formData.salaryRange.min),
        max: Number(formData.salaryRange.max),
        currency: formData.salaryRange.currency
      },
      skills: formData.skills,
      education: formData.education
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/jobs/${job._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess('Job updated successfully!');
        onUpdate(response.data.data);
        setTimeout(() => {
          handleModalClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update job');
      }
    } catch (err) {
      console.error('Error updating job:', err);
      setError(err.response?.data?.message || 'Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setActiveStep(0);
    setError('');
    setSuccess('');
    setFieldErrors({});
    setTouched({});
    onClose();
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
      '&.Mui-error fieldset': { borderColor: '#EF4444' }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Job Opening
          </Typography>
          {job && (
            <Chip
              label={job.jobId}
              size="small"
              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={handleModalClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
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
        <Stack spacing={2.5}>
          {/* Step 1: Basic Information */}
          {activeStep === 0 && (
            <>
              <Box>
                <Typography sx={labelStyle}>Company Introduction *</Typography>
                <TextField
                  fullWidth
                  name="companyIntro"
                  multiline
                  rows={3}
                  value={formData.companyIntro}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.companyIntro && !!fieldErrors.companyIntro}
                  helperText={touched.companyIntro ? fieldErrors.companyIntro : 'Brief introduction about your company'}
                  sx={inputStyle}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={labelStyle}>Location *</Typography>
                    <TextField
                      fullWidth
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.location && !!fieldErrors.location}
                      helperText={touched.location ? fieldErrors.location : 'e.g., Plant Unit A'}
                      sx={inputStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={labelStyle}>Department *</Typography>
                    <TextField
                      fullWidth
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.department && !!fieldErrors.department}
                      helperText={touched.department ? fieldErrors.department : 'e.g., Production'}
                      sx={inputStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={labelStyle}>Employment Type *</Typography>
                    <FormControl fullWidth size="small" error={touched.employmentType && !!fieldErrors.employmentType}>
                      <Select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        displayEmpty
                        sx={inputStyle}
                      >
                        <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select type</MenuItem>
                        {employmentTypes.map(type => (
                          <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>
                        ))}
                      </Select>
                      {touched.employmentType && fieldErrors.employmentType && (
                        <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.employmentType}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}

          {/* Step 2: Job Details */}
          {activeStep === 1 && (
            <>
              <Box>
                <Typography sx={labelStyle}>Job Description *</Typography>
                <TextField
                  fullWidth
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && !!fieldErrors.description}
                  helperText={touched.description ? fieldErrors.description : 'Detailed description of the job role'}
                  sx={inputStyle}
                />
              </Box>

              {/* Requirements */}
              <Box>
                <Typography sx={labelStyle}>Requirements *</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Add a requirement (e.g., Minimum 2 years experience)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
                    sx={inputStyle}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddRequirement}
                    disabled={!requirementInput.trim()}
                    sx={{
                      height: 36,
                      px: 2,
                      borderRadius: 1.5,
                      bgcolor: COLORS.primary,
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      '&:hover': { bgcolor: COLORS.primaryDark }
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                {formData.requirements.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    {formData.requirements.map((req, index) => (
                      <Chip
                        key={index}
                        label={req}
                        onDelete={() => handleRemoveRequirement(index)}
                        size="small"
                        sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 28 }}
                      />
                    ))}
                  </Box>
                )}
                {fieldErrors.requirements && (
                  <FormHelperText error sx={{ fontSize: '0.65rem' }}>{fieldErrors.requirements}</FormHelperText>
                )}
              </Box>

              {/* Responsibilities */}
              <Box>
                <Typography sx={labelStyle}>Responsibilities *</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={responsibilityInput}
                    onChange={(e) => setResponsibilityInput(e.target.value)}
                    placeholder="Add a responsibility (e.g., Operate production machinery)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddResponsibility()}
                    sx={inputStyle}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddResponsibility}
                    disabled={!responsibilityInput.trim()}
                    sx={{
                      height: 36,
                      px: 2,
                      borderRadius: 1.5,
                      bgcolor: COLORS.primary,
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      '&:hover': { bgcolor: COLORS.primaryDark }
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                {formData.responsibilities.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    {formData.responsibilities.map((resp, index) => (
                      <Chip
                        key={index}
                        label={resp}
                        onDelete={() => handleRemoveResponsibility(index)}
                        size="small"
                        sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 28 }}
                      />
                    ))}
                  </Box>
                )}
                {fieldErrors.responsibilities && (
                  <FormHelperText error sx={{ fontSize: '0.65rem' }}>{fieldErrors.responsibilities}</FormHelperText>
                )}
              </Box>

              {/* Experience Range */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={labelStyle}>Min Experience (years)</Typography>
                    <TextField
                      fullWidth
                      name="experienceRequired.min"
                      type="number"
                      value={formData.experienceRequired.min}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={labelStyle}>Max Experience (years)</Typography>
                    <TextField
                      fullWidth
                      name="experienceRequired.max"
                      type="number"
                      value={formData.experienceRequired.max}
                      onChange={handleChange}
                      inputProps={{ min: formData.experienceRequired.min }}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Salary Range */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography sx={labelStyle}>Min Salary</Typography>
                    <TextField
                      fullWidth
                      name="salaryRange.min"
                      type="number"
                      value={formData.salaryRange.min}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                      sx={inputStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography sx={labelStyle}>Max Salary</Typography>
                    <TextField
                      fullWidth
                      name="salaryRange.max"
                      type="number"
                      value={formData.salaryRange.max}
                      onChange={handleChange}
                      inputProps={{ min: formData.salaryRange.min }}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography sx={labelStyle}>Currency</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="salaryRange.currency"
                        value={formData.salaryRange.currency}
                        onChange={handleChange}
                        sx={inputStyle}
                      >
                        {currencies.map(curr => (
                          <MenuItem key={curr} value={curr} sx={{ fontSize: '0.75rem' }}>{curr}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>

              {/* Skills */}
              <Box>
                <Typography sx={labelStyle}>Required Skills</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g., Lathe operation)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    sx={inputStyle}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSkill}
                    disabled={!skillInput.trim()}
                    sx={{
                      height: 36,
                      px: 2,
                      borderRadius: 1.5,
                      bgcolor: COLORS.primary,
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      '&:hover': { bgcolor: COLORS.primaryDark }
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                {formData.skills.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    {formData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(index)}
                        size="small"
                        icon={<BuildIcon sx={{ fontSize: '0.7rem' }} />}
                        sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 28 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Education */}
              <Box>
                <Typography sx={labelStyle}>Education Requirements</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={educationInput}
                    onChange={(e) => setEducationInput(e.target.value)}
                    placeholder="Add education (e.g., ITI/Diploma in Mechanical)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEducation()}
                    sx={inputStyle}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddEducation}
                    disabled={!educationInput.trim()}
                    sx={{
                      height: 36,
                      px: 2,
                      borderRadius: 1.5,
                      bgcolor: COLORS.primary,
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      '&:hover': { bgcolor: COLORS.primaryDark }
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                {formData.education.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    {formData.education.map((edu, index) => (
                      <Chip
                        key={index}
                        label={edu}
                        onDelete={() => handleRemoveEducation(index)}
                        size="small"
                        icon={<SchoolIcon sx={{ fontSize: '0.7rem' }} />}
                        sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 28 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}

          {/* Step 3: Review & Save */}
          {activeStep === 2 && (
            <>
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                Please review all the information before saving.
              </Alert>

              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                  Summary
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography sx={labelStyle}>Company Introduction</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formData.companyIntro.substring(0, 100)}...
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: COLORS.border }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Location</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.location}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Department</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.department}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Employment Type</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.employmentType}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Experience</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formData.experienceRequired.min} - {formData.experienceRequired.max} years
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Salary Range</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formData.salaryRange.currency} {formData.salaryRange.min.toLocaleString()} - {formData.salaryRange.max.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ borderColor: COLORS.border }} />

                  <Box>
                    <Typography sx={labelStyle}>Requirements ({formData.requirements.length})</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {formData.requirements.map((req, idx) => (
                        <Chip key={idx} label={req} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={labelStyle}>Responsibilities ({formData.responsibilities.length})</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {formData.responsibilities.map((resp, idx) => (
                        <Chip key={idx} label={resp} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {success}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleModalClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text.secondary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
              }}
            >
              Back
            </Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <EditIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditJobOpening;