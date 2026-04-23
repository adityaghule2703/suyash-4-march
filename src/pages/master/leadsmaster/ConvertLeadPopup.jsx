import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Alert,
  IconButton,
  Autocomplete,
  Tooltip,
  InputAdornment
} from '@mui/material';
import { 
  Close as CloseIcon, 
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';
import AddCustomerModal from './AddCustomerModal'; // We'll create this separate component

const ConvertLeadPopup = ({ open, onClose, lead, onConvert }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // State for Add Customer dialog
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  // Fetch customers for dropdown
  useEffect(() => {
    if (open) {
      fetchCustomers();
    }
  }, [open]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCustomers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Handle customer added from modal
  const handleCustomerAdded = (newCustomer) => {
    setCustomers(prev => [...prev, newCustomer]);
    // Auto-select the newly added customer
    setSelectedCustomer(newCustomer);
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/leads/${lead._id}/convert`,
        {
          existing_customer_id: selectedCustomer._id
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onConvert(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to convert lead');
      }
    } catch (err) {
      console.error('Error converting lead:', err);
      setError(err.response?.data?.message || 'Failed to convert lead');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCustomer(null);
    setError('');
    onClose();
  };

  if (!lead) return null;

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
            overflow: 'hidden',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          mb: 2,
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Convert Lead to Customer
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, overflowY: 'auto' }}>
          <Stack spacing={2.5}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                  Link to Customer
                </Typography>
                <Tooltip title="Add New Customer">
                  <Button
                    startIcon={<PersonAddIcon sx={{ fontSize: '0.9rem' }} />}
                    onClick={() => setAddCustomerOpen(true)}
                    sx={{
                      height: 28,
                      px: 1.5,
                      borderRadius: 1.5,
                      bgcolor: COLORS.primaryLight,
                      color: COLORS.primary,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: COLORS.primary,
                        color: COLORS.text.light
                      }
                    }}
                  >
                    Add New Customer
                  </Button>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  SELECT CUSTOMER <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={customers}
                  getOptionLabel={(option) => `${option.customer_code} - ${option.customer_name}`}
                  value={selectedCustomer}
                  onChange={(event, newValue) => setSelectedCustomer(newValue)}
                  loading={loadingCustomers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search customers..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem'
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{option.customer_name}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Code: {option.customer_code} | Type: {option.customer_type}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              </Box>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 1.5,
                  '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {error}
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
          justifyContent: 'flex-end',
          gap: 1
        }}>
          <Button
            onClick={handleClose}
            disabled={loading}
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
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? null : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.primary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                bgcolor: COLORS.primaryDark,
              }
            }}
          >
            {loading ? 'Converting...' : 'Convert to Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Customer Modal - Separate Component */}
      <AddCustomerModal
        open={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        onAdd={handleCustomerAdded}
      />
    </>
  );
};

export default ConvertLeadPopup;