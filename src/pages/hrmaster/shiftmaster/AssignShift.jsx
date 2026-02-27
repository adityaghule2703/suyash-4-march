import React, { useEffect, useState } from 'react';
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
  Snackbar,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { AssignmentTurnedIn as AssignIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AssignShift = ({ open, onClose }) => {

  // Enhanced employees state
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesSearch, setEmployeesSearch] = useState('');
  const [employeesOpen, setEmployeesOpen] = useState(false);
  const [employeesPage, setEmployeesPage] = useState(1);
  const [employeesTotalPages, setEmployeesTotalPages] = useState(1);
  const [employeesInputValue, setEmployeesInputValue] = useState('');

  // Enhanced shifts state
  const [shifts, setShifts] = useState([]);
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [shiftsSearch, setShiftsSearch] = useState('');
  const [shiftsOpen, setShiftsOpen] = useState(false);
  const [shiftsPage, setShiftsPage] = useState(1);
  const [shiftsTotalPages, setShiftsTotalPages] = useState(1);
  const [shiftsInputValue, setShiftsInputValue] = useState('');

  const [formData, setFormData] = useState({
    employeeId: null,
    shiftId: null,
    effectiveFrom: '',
    effectiveTo: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 🔥 Fetch Employees with pagination and search
  const fetchEmployees = async (search = '', page = 1) => {
    setEmployeesLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          limit: 10,
          search: search
        }
      });

      const newData = res.data.data || [];
      if (page === 1) {
        setEmployees(Array.isArray(newData) ? newData : []);
      } else {
        setEmployees(prev => [...prev, ...(Array.isArray(newData) ? newData : [])]);
      }
      setEmployeesTotalPages(res.data.pagination?.totalPages || 1);
    } catch {
      setError('Failed to load employees');
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  // 🔥 Fetch Shifts with pagination and search
  const fetchShifts = async (search = '', page = 1) => {
    setShiftsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/shifts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          limit: 10,
          search: search
        }
      });

      const newData = res.data.data || [];
      if (page === 1) {
        setShifts(Array.isArray(newData) ? newData : []);
      } else {
        setShifts(prev => [...prev, ...(Array.isArray(newData) ? newData : [])]);
      }
      setShiftsTotalPages(res.data.pagination?.totalPages || 1);
    } catch {
      setError('Failed to load shifts');
      setShifts([]);
    } finally {
      setShiftsLoading(false);
    }
  };

  // Load employees when dropdown opens
  useEffect(() => {
    if (employeesOpen) {
      fetchEmployees(employeesSearch, 1);
    }
  }, [employeesOpen]);

  // Search employees with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (employeesOpen) {
        setEmployeesPage(1);
        fetchEmployees(employeesSearch, 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [employeesSearch, employeesOpen]);

  // Load shifts when dropdown opens
  useEffect(() => {
    if (shiftsOpen) {
      fetchShifts(shiftsSearch, 1);
    }
  }, [shiftsOpen]);

  // Search shifts with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shiftsOpen) {
        setShiftsPage(1);
        fetchShifts(shiftsSearch, 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [shiftsSearch, shiftsOpen]);

  // Handle scroll load more for employees
  const handleEmployeesScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
      if (employeesPage < employeesTotalPages && !employeesLoading) {
        const nextPage = employeesPage + 1;
        setEmployeesPage(nextPage);
        fetchEmployees(employeesSearch, nextPage);
      }
    }
  };

  // Handle scroll load more for shifts
  const handleShiftsScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
      if (shiftsPage < shiftsTotalPages && !shiftsLoading) {
        const nextPage = shiftsPage + 1;
        setShiftsPage(nextPage);
        fetchShifts(shiftsSearch, nextPage);
      }
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmployeeChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, employeeId: newValue }));
  };

  const handleShiftChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, shiftId: newValue }));
  };

  const handleSubmit = async () => {
    if (!formData.employeeId)
      return setError('Please select employee');

    if (!formData.shiftId)
      return setError('Please select shift');

    if (!formData.effectiveFrom || !formData.effectiveTo)
      return setError('Please select effective dates');

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Format dates to ISO string with time set to start of day (00:00:00)
      const payload = {
        employeeId: formData.employeeId?._id || formData.employeeId?.id,
        shiftId: formData.shiftId?._id || formData.shiftId?.id,
        effectiveFrom: new Date(formData.effectiveFrom).toISOString().split('T')[0] + 'T00:00:00.000Z',
        effectiveTo: new Date(formData.effectiveTo).toISOString().split('T')[0] + 'T00:00:00.000Z'
      };

      const res = await axios.post(
        `${BASE_URL}/api/shifts/assign`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        // ✅ Show Success Snackbar
        setSnackbar({
          open: true,
          message: 'Shift assigned successfully!',
          severity: 'success'
        });

        handleClose();
      } else {
        setError(res.data.message || 'Failed to assign shift');
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Internal server error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      employeeId: null,
      shiftId: null,
      effectiveFrom: '',
      effectiveTo: ''
    });
    setEmployeesInputValue('');
    setShiftsInputValue('');
    setEmployeesSearch('');
    setShiftsSearch('');
    setError('');
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            borderBottom: '1px solid #E0E0E0',
            pb: 2,
            backgroundColor: '#F8FAFC'
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              paddingTop: '8px'
            }}
          >
            Assign Shift to Employee
          </div>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>

            {/* Enhanced Employee Autocomplete */}
            <Autocomplete
              id="employee-autocomplete"
              open={employeesOpen}
              onOpen={() => setEmployeesOpen(true)}
              onClose={() => setEmployeesOpen(false)}
              options={Array.isArray(employees) ? employees : []}
              loading={employeesLoading}
              value={formData.employeeId}
              onChange={handleEmployeeChange}
              inputValue={employeesInputValue}
              onInputChange={(event, newInputValue) => {
                setEmployeesInputValue(newInputValue);
                setEmployeesSearch(newInputValue);
              }}
              getOptionLabel={(option) => {
                if (!option) return '';
                return `${option.FirstName || ''} ${option.LastName || ''}`.trim();
              }}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Employee"
                  required
                  placeholder="Search employee..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {employeesLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option._id}>
                  {option.FirstName} {option.LastName}
                </MenuItem>
              )}
              ListboxProps={{
                onScroll: handleEmployeesScroll,
                style: { maxHeight: 250 }
              }}
            />

            {/* Enhanced Shift Autocomplete */}
            <Autocomplete
              id="shift-autocomplete"
              open={shiftsOpen}
              onOpen={() => setShiftsOpen(true)}
              onClose={() => setShiftsOpen(false)}
              options={Array.isArray(shifts) ? shifts : []}
              loading={shiftsLoading}
              value={formData.shiftId}
              onChange={handleShiftChange}
              inputValue={shiftsInputValue}
              onInputChange={(event, newInputValue) => {
                setShiftsInputValue(newInputValue);
                setShiftsSearch(newInputValue);
              }}
              getOptionLabel={(option) => {
                if (!option) return '';
                return option.ShiftName || '';
              }}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Shift"
                  required
                  placeholder="Search shift..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {shiftsLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option._id}>
                  {option.ShiftName} ({option.StartTime} - {option.EndTime})
                </MenuItem>
              )}
              ListboxProps={{
                onScroll: handleShiftsScroll,
                style: { maxHeight: 250 }
              }}
            />

            <TextField
              fullWidth
              type="date"
              label="Effective From"
              name="effectiveFrom"
              value={formData.effectiveFrom}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              fullWidth
              type="date"
              label="Effective To"
              name="effectiveTo"
              value={formData.effectiveTo}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            borderTop: '1px solid #E0E0E0',
            pt: 2,
            backgroundColor: '#F8FAFC'
          }}
        >
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? null : <AssignIcon />}
            sx={{
              textTransform: 'none',
              backgroundColor: '#1976D2',
              '&:hover': { backgroundColor: '#1565C0' }
            }}
          >
            {loading ? 'Assigning...' : 'Assign Shift'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar Bottom Right */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssignShift;