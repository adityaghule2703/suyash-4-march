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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Paper,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
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
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';

// Custom Paper for dropdown without scrollbars
const CustomPaper = (props) => (
  <Paper
    {...props}
    sx={{
      maxHeight: 200,
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none'
    }}
  />
);

const EmployeeIncrementSummary = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Dropdown data
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Form data
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Summary data
  const [summaryData, setSummaryData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overtime: true,
    behavior: true
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
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    const employee = employees.find(emp => emp._id === employeeId);
    setSelectedEmployee(employee);
    setSummaryData(null); // Clear previous summary
    setError('');
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSummaryData(null); // Clear previous summary
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }

    if (!selectedYear) {
      setError('Please select a year');
      return;
    }

    try {
      setFetchingData(true);
      setError('');
      setSuccess(false);

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/employees/summary/${selectedEmployee._id}/year/${selectedYear}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSummaryData(response.data.data);
        setSuccess(true);
      } else {
        setError(response.data.message || 'Failed to fetch summary');
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.response?.data?.message || 'Failed to fetch summary data');
    } finally {
      setFetchingData(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setSelectedYear(new Date().getFullYear().toString());
    setSummaryData(null);
    setError('');
    setSuccess(false);
    onClose();
  };

  // Format month name
  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1] || '';
  };

  // Get behavior rating color
  const getRatingColor = (rating) => {
    if (rating >= 4) return '#10B981'; // Green
    if (rating >= 3) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2, 
          maxHeight: '90vh',
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        background: HEADER_GRADIENT,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AssessmentIcon />
          <Typography variant="h6" fontWeight={600}>
            Employee Increment Summary
          </Typography>
        </Stack>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, overflowY: 'auto' }}>
        <Stack spacing={3}>
          {/* Selection Form */}
          <Paper elevation={0} sx={{ p: 3, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Employee *</InputLabel>
                    <Select
                      value={selectedEmployee?._id || ''}
                      onChange={handleEmployeeChange}
                      label="Select Employee *"
                      disabled={loadingEmployees || fetchingData}
                      sx={{ borderRadius: 1 }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': { display: 'none' }
                          }
                        }
                      }}
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee._id} value={employee._id}>
                          {employee.EmployeeID} - {employee.FirstName} {employee.LastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Select Year *</InputLabel>
                    <Select
                      value={selectedYear}
                      onChange={handleYearChange}
                      label="Select Year *"
                      disabled={fetchingData}
                      sx={{ borderRadius: 1 }}
                    >
                      {yearOptions.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!selectedEmployee || !selectedYear || fetchingData}
                    sx={{
                      height: '56px',
                      borderRadius: 1,
                      background: HEADER_GRADIENT,
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': { opacity: 0.9 }
                    }}
                  >
                    {fetchingData ? <CircularProgress size={24} color="inherit" /> : 'Get Summary'}
                  </Button>
                </Grid>
              </Grid>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ borderRadius: 1 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}
            </Stack>
          </Paper>

          {/* Summary Results */}
          {summaryData && (
            <Stack spacing={3}>
              {/* Employee Info Card */}
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="#164e63">
                      {summaryData.employee.name}
                    </Typography>
                    <Typography variant="body2" color="#64748B">
                      Employee ID: {summaryData.employee.employeeId}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Chip 
                        label={summaryData.employee.department?.DepartmentName || 'No Dept'} 
                        size="small"
                        sx={{ backgroundColor: '#e0f2fe', color: '#0c4a6e' }}
                      />
                      <Chip 
                        label={summaryData.employee.designation?.DesignationName || 'No Designation'} 
                        size="small"
                        sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                      />
                    </Stack>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" fontWeight={700} color={PRIMARY_BLUE}>
                      {summaryData.year}
                    </Typography>
                    <Typography variant="caption" color="#64748B">
                      Summary Year
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Summary Stats Cards */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <AccessTimeIcon sx={{ color: PRIMARY_BLUE }} />
                        <Typography variant="body2" color="#64748B">Total Overtime</Typography>
                      </Stack>
                      <Typography variant="h5" fontWeight={700}>
                        {summaryData.summary.totalOvertimeHours} hrs
                      </Typography>
                      <Typography variant="caption" color="#10B981">
                        ₹{summaryData.summary.totalOvertimeAmount} earned
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <StarIcon sx={{ color: '#F59E0B' }} />
                        <Typography variant="body2" color="#64748B">Behavior Rating</Typography>
                      </Stack>
                      <Typography variant="h5" fontWeight={700}>
                        {summaryData.summary.averageBehaviorRating.toFixed(1)}/5
                      </Typography>
                      <Typography variant="caption" color="#64748B">
                        {summaryData.summary.totalBehaviorEntries} entries
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <CheckCircleIcon sx={{ color: '#10B981' }} />
                        <Typography variant="body2" color="#64748B">Positive Behavior</Typography>
                      </Stack>
                      <Typography variant="h5" fontWeight={700}>
                        {summaryData.summary.positiveBehaviorCount}
                      </Typography>
                      <Typography variant="caption" color="#64748B">
                        entries
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <WarningIcon sx={{ color: '#EF4444' }} />
                        <Typography variant="body2" color="#64748B">Negative/Issues</Typography>
                      </Stack>
                      <Typography variant="h5" fontWeight={700}>
                        {summaryData.summary.negativeBehaviorCount}
                      </Typography>
                      <Typography variant="caption" color="#EF4444">
                        {summaryData.summary.openIssuesCount} open issues
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

             {/* Overtime Details Section */}
            <Paper elevation={2} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Box 
                sx={{ 
                p: 2, 
                background: '#f8fafc', 
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
                }}
                onClick={() => toggleSection('overtime')}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon sx={{ color: PRIMARY_BLUE }} />
                <Typography variant="subtitle1" fontWeight={600}>
                    Overtime Details ({summaryData.overtime.yearlyTotal} hrs total)
                </Typography>
                </Stack>
                <IconButton size="small">
                {expandedSections.overtime ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>
            
            <Collapse in={expandedSections.overtime}>
                <Box sx={{ p: 2 }}>
                {summaryData.overtime.monthlyBreakdown.length > 0 ? (
                    <TableContainer>
                    <Table size="small">
                        <TableHead>
                        <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                            <TableCell><strong>Month</strong></TableCell>
                            <TableCell align="right"><strong>Hours</strong></TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {summaryData.overtime.monthlyBreakdown.map((month) => (
                            <TableRow key={month.month}>
                            <TableCell>{month.monthName} {month.year}</TableCell>
                            <TableCell align="right">{month.totalOvertimeHours}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body2" color="#64748B" sx={{ textAlign: 'center', py: 2 }}>
                    No overtime records found for {summaryData.year}
                    </Typography>
                )}
                </Box>
            </Collapse>
            </Paper>

              {/* Behavior Details Section */}
              <Paper elevation={2} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    background: '#f8fafc', 
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSection('behavior')}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StarIcon sx={{ color: '#F59E0B' }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Behavior Details ({summaryData.behavior.overallStats.totalEntries} entries)
                    </Typography>
                  </Stack>
                  <IconButton size="small">
                    {expandedSections.behavior ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                
                <Collapse in={expandedSections.behavior}>
                  <Box sx={{ p: 2 }}>
                    {/* Category-wise breakdown */}
                    {summaryData.behavior.categoryWise.length > 0 && (
                      <>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          Category-wise Breakdown
                        </Typography>
                        <TableContainer sx={{ mb: 3 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                                <TableCell><strong>Category</strong></TableCell>
                                <TableCell align="center"><strong>Entries</strong></TableCell>
                                <TableCell align="center"><strong>Avg Rating</strong></TableCell>
                                <TableCell align="center"><strong>Positive</strong></TableCell>
                                <TableCell align="center"><strong>Negative</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {summaryData.behavior.categoryWise.map((category) => (
                                <TableRow key={category.category}>
                                  <TableCell>{category.category}</TableCell>
                                  <TableCell align="center">{category.count}</TableCell>
                                  <TableCell align="center">
                                    <Chip 
                                      label={category.avgRating.toFixed(1)} 
                                      size="small"
                                      sx={{ 
                                        backgroundColor: getRatingColor(category.avgRating),
                                        color: '#fff',
                                        fontWeight: 500
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip 
                                      label={category.positiveCount} 
                                      size="small"
                                      sx={{ backgroundColor: '#dcfce7', color: '#166534' }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip 
                                      label={category.negativeCount} 
                                      size="small"
                                      sx={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}

                    {/* Recent entries */}
                    {summaryData.behavior.recentEntries.length > 0 && (
                      <>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          Recent Behavior Entries
                        </Typography>
                        <Stack spacing={2}>
                          {summaryData.behavior.recentEntries.map((entry) => (
                            <Paper key={entry._id} variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                    <Chip 
                                      label={entry.category} 
                                      size="small"
                                      sx={{ backgroundColor: '#e0f2fe', color: '#0c4a6e' }}
                                    />
                                    <Chip 
                                      label={entry.type} 
                                      size="small"
                                      sx={{ 
                                        backgroundColor: 
                                          entry.type === 'Positive' ? '#dcfce7' :
                                          entry.type === 'Negative' ? '#fee2e2' : '#f1f5f9',
                                        color: 
                                          entry.type === 'Positive' ? '#166534' :
                                          entry.type === 'Negative' ? '#991b1b' : '#475569'
                                      }}
                                    />
                                    <Chip 
                                      label={`Rating: ${entry.rating}/5`} 
                                      size="small"
                                      sx={{ 
                                        backgroundColor: getRatingColor(entry.rating),
                                        color: '#fff'
                                      }}
                                    />
                                  </Stack>
                                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {entry.description}
                                  </Typography>
                                  {entry.actionTaken && entry.actionTaken !== 'None' && (
                                    <Typography variant="caption" color="#64748B" sx={{ display: 'block', mt: 0.5 }}>
                                      Action: {entry.actionTaken}
                                    </Typography>
                                  )}
                                </Box>
                                <Chip 
                                  label={entry.status} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: 
                                      entry.status === 'Resolved' ? '#dcfce7' :
                                      entry.status === 'Open' ? '#fef3c7' :
                                      entry.status === 'Escalated' ? '#fee2e2' : '#f1f5f9',
                                    color: 
                                      entry.status === 'Resolved' ? '#166534' :
                                      entry.status === 'Open' ? '#92400e' :
                                      entry.status === 'Escalated' ? '#991b1b' : '#475569'
                                  }}
                                />
                              </Stack>
                              <Typography variant="caption" color="#94A3B8" sx={{ display: 'block', mt: 1 }}>
                                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      </>
                    )}

                    {summaryData.behavior.recentEntries.length === 0 && (
                      <Typography variant="body2" color="#64748B" sx={{ textAlign: 'center', py: 2 }}>
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
        px: 3, 
        pb: 3, 
        borderTop: '1px solid #E0E0E0', 
        pt: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <Button 
          onClick={handleClose} 
          disabled={fetchingData}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            border: '1px solid #cbd5e1',
            color: '#475569'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeIncrementSummary;