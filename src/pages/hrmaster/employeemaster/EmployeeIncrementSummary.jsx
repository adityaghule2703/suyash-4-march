import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Collapse,
  styled
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Assessment as AssessmentIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

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
  },
  rating: {
    high: '#10B981',
    medium: '#F59E0B',
    low: '#EF4444'
  }
};

// Custom Paper for dropdown without scrollbars
const CustomPaper = styled(Paper)({
  maxHeight: 200,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none'
});

const EmployeeIncrementSummary = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Dropdown data
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Form data
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );

  // Summary data
  const [summaryData, setSummaryData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overtime: true,
    behavior: true,
  });

  // Generate year options (last 5 years to next year)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    yearOptions.push(i.toString());
  }

  // Fetch employees on mount
  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    const employee = employees.find((emp) => emp._id === employeeId);
    setSelectedEmployee(employee);
    setSummaryData(null); // Clear previous summary
    setError("");
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSummaryData(null); // Clear previous summary
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) {
      setError("Please select an employee");
      return;
    }

    if (!selectedYear) {
      setError("Please select a year");
      return;
    }

    try {
      setFetchingData(true);
      setError("");
      setSuccess(false);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/employees/summary/${selectedEmployee._id}/year/${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setSummaryData(response.data.data);
        setSuccess(true);
      } else {
        setError(response.data.message || "Failed to fetch summary");
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError(err.response?.data?.message || "Failed to fetch summary data");
    } finally {
      setFetchingData(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setSelectedYear(new Date().getFullYear().toString());
    setSummaryData(null);
    setError("");
    setSuccess(false);
    onClose();
  };

  // Format month name
  const getMonthName = (monthNum) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNum - 1] || "";
  };

  // Get behavior rating color
  const getRatingColor = (rating) => {
    if (rating >= 4) return COLORS.rating.high;
    if (rating >= 3) return COLORS.rating.medium;
    return COLORS.rating.low;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return { bg: COLORS.chips.active, color: COLORS.primaryDark, border: '#86efac' };
      case 'Open': return { bg: COLORS.status.warning, color: '#92400E', border: '#FDE68A' };
      case 'Escalated': return { bg: COLORS.status.error, color: '#991B1B', border: '#FECACA' };
      default: return { bg: COLORS.chips.inactive, color: COLORS.text.secondary, border: COLORS.border };
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch(type) {
      case 'Positive': return { bg: '#dcfce7', color: '#166534' };
      case 'Negative': return { bg: '#fee2e2', color: '#991b1b' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
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
          overflow: 'hidden',
          maxHeight: '80vh',
          minHeight: '60vh'
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
        <Stack direction="row" spacing={1} alignItems="center">
          <AssessmentIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Employee Increment Summary
          </Typography>
        </Stack>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: COLORS.text.secondary,
            '&:hover': { bgcolor: COLORS.background.hover }
          }}
        >
          <CloseIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light, overflowY: 'auto', mt:0.5 }}>
        <Stack spacing={2.5}>
          {/* Selection Form */}
          <Paper sx={{ 
            p: 2.5, 
            bgcolor: COLORS.background.white, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Stack spacing={2}>
              <Grid container spacing={1.5} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      SELECT EMPLOYEE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedEmployee?._id || ""}
                        onChange={handleEmployeeChange}
                        disabled={loadingEmployees || fetchingData}
                        displayEmpty
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 },
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 1.5,
                            fontSize: '0.75rem'
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              overflow: 'auto',
                              '&::-webkit-scrollbar': { display: 'none' },
                              scrollbarWidth: 'none',
                              '-ms-overflow-style': 'none'
                            }
                          }
                        }}
                      >
                        <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                          <em>Select an employee</em>
                        </MenuItem>
                        {employees.map((employee) => (
                          <MenuItem key={employee._id} value={employee._id} sx={{ fontSize: '0.75rem' }}>
                            {employee.EmployeeID} - {employee.FirstName} {employee.LastName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      SELECT YEAR <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedYear}
                        onChange={handleYearChange}
                        disabled={fetchingData}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 },
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 1.5,
                            fontSize: '0.75rem'
                          }
                        }}
                      >
                        {yearOptions.map((year) => (
                          <MenuItem key={year} value={year} sx={{ fontSize: '0.75rem' }}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={!selectedEmployee || !selectedYear || fetchingData}
                      size="small"
                      sx={{
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: COLORS.primary,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          bgcolor: COLORS.primaryDark,
                        }
                      }}
                    >
                      {fetchingData ? (
                        <CircularProgress size={16} sx={{ color: COLORS.text.light }} />
                      ) : (
                        "Get Summary"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    py: 0.5,
                    '& .MuiAlert-icon': { fontSize: '1.25rem' }
                  }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}
            </Stack>
          </Paper>

          {/* Summary Results */}
          {summaryData && (
            <Stack spacing={2}>
              {/* Employee Info Card */}
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {summaryData.employee.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      Employee ID: {summaryData.employee.employeeId}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={summaryData.employee.department?.DepartmentName || "No Dept"}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          fontWeight: 500,
                          height: 20,
                          bgcolor: COLORS.primaryLight,
                          color: COLORS.primaryDark,
                          border: `1px solid ${COLORS.primary}`,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                      <Chip
                        label={summaryData.employee.designation?.DesignationName || "No Designation"}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          fontWeight: 500,
                          height: 20,
                          bgcolor: COLORS.background.light,
                          color: COLORS.text.secondary,
                          border: `1px solid ${COLORS.border}`,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                      {summaryData.year}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Summary Year
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Summary Stats Cards */}
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.white, 
                    borderRadius: 1.5, 
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: 'none'
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Total Overtime
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {summaryData.summary.totalOvertimeHours} hrs
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.rating.high }}>
                      ₹{summaryData.summary.totalOvertimeAmount} earned
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.white, 
                    borderRadius: 1.5, 
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: 'none'
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <StarIcon sx={{ fontSize: '1rem', color: COLORS.rating.medium }} />
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Behavior Rating
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {summaryData.summary.averageBehaviorRating.toFixed(1)}/5
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                      {summaryData.summary.totalBehaviorEntries} entries
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.white, 
                    borderRadius: 1.5, 
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: 'none'
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: '1rem', color: COLORS.rating.high }} />
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Positive Behavior
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {summaryData.summary.positiveBehaviorCount}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                      entries
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.white, 
                    borderRadius: 1.5, 
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: 'none'
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <WarningIcon sx={{ fontSize: '1rem', color: COLORS.rating.low }} />
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Negative/Issues
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {summaryData.summary.negativeBehaviorCount}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.rating.low }}>
                      {summaryData.summary.openIssuesCount} open issues
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Overtime Details Section */}
              <Paper sx={{ 
                bgcolor: COLORS.background.white, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none',
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: COLORS.background.light,
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: COLORS.background.hover }
                  }}
                  onClick={() => toggleSection("overtime")}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTimeIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                      Overtime Details ({summaryData.overtime.yearlyTotal} hrs total)
                    </Typography>
                  </Stack>
                  <IconButton size="small" sx={{ color: COLORS.text.secondary }}>
                    {expandedSections.overtime ? (
                      <ExpandLessIcon sx={{ fontSize: '1.2rem' }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: '1.2rem' }} />
                    )}
                  </IconButton>
                </Box>

                <Collapse in={expandedSections.overtime}>
                  <Box sx={{ p: 2 }}>
                    {summaryData.overtime.monthlyBreakdown.length > 0 ? (
                      <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ backgroundColor: COLORS.background.light }}>
                              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                Month
                              </th>
                              <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                Hours
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {summaryData.overtime.monthlyBreakdown.map((month) => (
                              <tr key={month.month} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                <td style={{ padding: '8px 12px', fontSize: '0.7rem', color: COLORS.text.primary }}>
                                  {month.monthName} {month.year}
                                </td>
                                <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                                  {month.totalOvertimeHours}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, textAlign: 'center', py: 2 }}>
                        No overtime records found for {summaryData.year}
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </Paper>

              {/* Behavior Details Section */}
              <Paper sx={{ 
                bgcolor: COLORS.background.white, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none',
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: COLORS.background.light,
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: COLORS.background.hover }
                  }}
                  onClick={() => toggleSection("behavior")}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StarIcon sx={{ fontSize: '1rem', color: COLORS.rating.medium }} />
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                      Behavior Details ({summaryData.behavior.overallStats.totalEntries} entries)
                    </Typography>
                  </Stack>
                  <IconButton size="small" sx={{ color: COLORS.text.secondary }}>
                    {expandedSections.behavior ? (
                      <ExpandLessIcon sx={{ fontSize: '1.2rem' }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: '1.2rem' }} />
                    )}
                  </IconButton>
                </Box>

                <Collapse in={expandedSections.behavior}>
                  <Box sx={{ p: 2 }}>
                    {/* Category-wise breakdown */}
                    {summaryData.behavior.categoryWise.length > 0 && (
                      <>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                          Category-wise Breakdown
                        </Typography>
                        <Box sx={{ overflowX: 'auto', mb: 2 }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: COLORS.background.light }}>
                                <th style={{ padding: '6px 8px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Category</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Entries</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Avg Rating</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Positive</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Negative</th>
                              </tr>
                            </thead>
                            <tbody>
                              {summaryData.behavior.categoryWise.map((category) => (
                                <tr key={category.category} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                  <td style={{ padding: '6px 8px', fontSize: '0.7rem', color: COLORS.text.primary }}>{category.category}</td>
                                  <td style={{ padding: '6px 8px', textAlign: 'center', fontSize: '0.7rem', color: COLORS.text.primary }}>{category.count}</td>
                                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                    <Chip
                                      label={category.avgRating.toFixed(1)}
                                      size="small"
                                      sx={{ 
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        height: 16,
                                        bgcolor: getRatingColor(category.avgRating),
                                        color: COLORS.text.light,
                                        '& .MuiChip-label': { px: 0.5 }
                                      }}
                                    />
                                  </td>
                                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                    <Chip
                                      label={category.positiveCount}
                                      size="small"
                                      sx={{ 
                                        fontSize: '0.6rem',
                                        fontWeight: 500,
                                        height: 16,
                                        bgcolor: '#dcfce7',
                                        color: '#166534',
                                        '& .MuiChip-label': { px: 0.5 }
                                      }}
                                    />
                                  </td>
                                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                    <Chip
                                      label={category.negativeCount}
                                      size="small"
                                      sx={{ 
                                        fontSize: '0.6rem',
                                        fontWeight: 500,
                                        height: 16,
                                        bgcolor: '#fee2e2',
                                        color: '#991b1b',
                                        '& .MuiChip-label': { px: 0.5 }
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </Box>
                      </>
                    )}

                    {/* Recent entries */}
                    {summaryData.behavior.recentEntries.length > 0 && (
                      <>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                          Recent Behavior Entries
                        </Typography>
                        <Stack spacing={1.5}>
                          {summaryData.behavior.recentEntries.map((entry) => {
                            const statusColors = getStatusColor(entry.status);
                            const typeColors = getTypeColor(entry.type);
                            
                            return (
                              <Paper
                                key={entry._id}
                                variant="outlined"
                                sx={{ 
                                  p: 1.5, 
                                  borderRadius: 1.5,
                                  border: `1px solid ${COLORS.border}`,
                                  bgcolor: COLORS.background.white
                                }}
                              >
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                  <Box sx={{ flex: 1 }}>
                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                                      <Chip
                                        label={entry.category}
                                        size="small"
                                        sx={{ 
                                          fontSize: '0.6rem',
                                          fontWeight: 500,
                                          height: 16,
                                          bgcolor: COLORS.primaryLight,
                                          color: COLORS.primaryDark,
                                          '& .MuiChip-label': { px: 0.5 }
                                        }}
                                      />
                                      <Chip
                                        label={entry.type}
                                        size="small"
                                        sx={{ 
                                          fontSize: '0.6rem',
                                          fontWeight: 500,
                                          height: 16,
                                          bgcolor: typeColors.bg,
                                          color: typeColors.color,
                                          '& .MuiChip-label': { px: 0.5 }
                                        }}
                                      />
                                      <Chip
                                        label={`Rating: ${entry.rating}/5`}
                                        size="small"
                                        sx={{ 
                                          fontSize: '0.6rem',
                                          fontWeight: 500,
                                          height: 16,
                                          bgcolor: getRatingColor(entry.rating),
                                          color: COLORS.text.light,
                                          '& .MuiChip-label': { px: 0.5 }
                                        }}
                                      />
                                    </Stack>
                                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary, mt: 0.5 }}>
                                      {entry.description}
                                    </Typography>
                                    {entry.actionTaken && entry.actionTaken !== "None" && (
                                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                        Action: {entry.actionTaken}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Chip
                                    label={entry.status}
                                    size="small"
                                    sx={{ 
                                      fontSize: '0.6rem',
                                      fontWeight: 500,
                                      height: 16,
                                      bgcolor: statusColors.bg,
                                      color: statusColors.color,
                                      '& .MuiChip-label': { px: 0.5 }
                                    }}
                                  />
                                </Stack>
                                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </Typography>
                              </Paper>
                            );
                          })}
                        </Stack>
                      </>
                    )}

                    {summaryData.behavior.recentEntries.length === 0 && (
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, textAlign: 'center', py: 2 }}>
                        No behavior records found for {summaryData.year}
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </Paper>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end'
      }}>
        <Button
          onClick={handleClose}
          disabled={fetchingData}
          size="small"
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeIncrementSummary;