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
  Typography
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const EditEmployees = ({ open, onClose, employee, onUpdate }) => {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Gender: 'M',
    DateOfBirth: '',
    Email: '',
    Phone: '',
    Address: '',
    DepartmentID: '',
    DesignationID: '',
    DateOfJoining: '',
    EmploymentStatus: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch departments and designations
  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (employee) {
      setFormData({
        FirstName: employee.FirstName || '',
        LastName: employee.LastName || '',
        Gender: employee.Gender || 'M',
        DateOfBirth: employee.DateOfBirth ? employee.DateOfBirth.split('T')[0] : '',
        Email: employee.Email || '',
        Phone: employee.Phone || '',
        Address: employee.Address || '',
        DepartmentID: employee.DepartmentID?._id || '',
        DesignationID: employee.DesignationID?._id || '',
        DateOfJoining: employee.DateOfJoining ? employee.DateOfJoining.split('T')[0] : '',
        EmploymentStatus: employee.EmploymentStatus || 'active'
      });
    }
  }, [employee]);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      
      // Fetch departments
      const deptResponse = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch designations
      const desigResponse = await axios.get(`${BASE_URL}/api/designations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (deptResponse.data.success) {
        setDepartments(deptResponse.data.data || []);
      }
      
      if (desigResponse.data.success) {
        setDesignations(desigResponse.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError('Failed to load dropdown data. Please refresh.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.FirstName.trim() || !formData.LastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    if (!formData.Email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.DepartmentID) {
      setError('Please select a department');
      return;
    }

    if (!formData.DesignationID) {
      setError('Please select a designation');
      return;
    }

    if (!formData.DateOfJoining) {
      setError('Date of joining is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/employees/${employee._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update employee');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      setError(err.response?.data?.message || 'Failed to update employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010',
          paddingTop: '8px'
        }}>
          Edit Employee
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Add padding from top for the first field */}
          <div style={{ marginTop: '16px' }}>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="First Name"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                required
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                required
                disabled={loading || loadingData}
                size="medium"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
            </Stack>
          </div>
          
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                label="Gender"
                disabled={loading || loadingData}
                sx={{
                  borderRadius: 1,
                }}
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Date of Birth"
              name="DateOfBirth"
              type="date"
              value={formData.DateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={loading || loadingData}
              size="medium"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
          </Stack>
          
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Email"
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleChange}
              required
              disabled={loading || loadingData}
              size="medium"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
            <TextField
              fullWidth
              label="Phone"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              disabled={loading || loadingData}
              size="medium"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
          </Stack>
          
          <TextField
            fullWidth
            label="Address"
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            multiline
            rows={2}
            disabled={loading || loadingData}
            size="medium"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
          
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Department *</InputLabel>
              <Select
                name="DepartmentID"
                value={formData.DepartmentID}
                onChange={handleChange}
                label="Department *"
                required
                disabled={loading || loadingData || departments.length === 0}
                sx={{
                  borderRadius: 1,
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.DepartmentName}
                  </MenuItem>
                ))}
              </Select>
              {departments.length === 0 && (
                <Typography variant="caption" color="error">
                  No departments available.
                </Typography>
              )}
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Designation *</InputLabel>
              <Select
                name="DesignationID"
                value={formData.DesignationID}
                onChange={handleChange}
                label="Designation *"
                required
                disabled={loading || loadingData || designations.length === 0}
                sx={{
                  borderRadius: 1,
                }}
              >
                {designations.map((desig) => (
                  <MenuItem key={desig._id} value={desig._id}>
                    {desig.DesignationName} (Level {desig.Level})
                  </MenuItem>
                ))}
              </Select>
              {designations.length === 0 && (
                <Typography variant="caption" color="error">
                  No designations available.
                </Typography>
              )}
            </FormControl>
          </Stack>
          
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Date of Joining *"
              name="DateOfJoining"
              type="date"
              value={formData.DateOfJoining}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              disabled={loading || loadingData}
              size="medium"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Employment Status</InputLabel>
              <Select
                name="EmploymentStatus"
                value={formData.EmploymentStatus}
                onChange={handleChange}
                label="Employment Status"
                disabled={loading || loadingData}
                sx={{
                  borderRadius: 1,
                }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on_leave">On Leave</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
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
          onClick={onClose} 
          disabled={loading}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || loadingData}
          startIcon={loading ? null : <EditIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#1976D2',
            '&:hover': {
              backgroundColor: '#1565C0'
            }
          }}
        >
          {loading ? 'Updating...' : 'Update Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployees;