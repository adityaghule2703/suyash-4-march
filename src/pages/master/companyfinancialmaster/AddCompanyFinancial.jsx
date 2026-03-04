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
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Grid,
  Divider,
  InputAdornment,
  Chip
} from '@mui/material';
import { Add as AddIcon, Business as BusinessIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddCompanyFinancial = ({ open, onClose, onAdd, companies = [] }) => {
  const [formData, setFormData] = useState({
    CompanyID: '',
    CreditOnInputMaterialDays: -30,
    WIPFGInventoryDays: 30,
    CreditGivenToCustomerDays: 45,
    CostOfCapital: 0.1,
    OHPPercentage: 10,
    ProfitPercentage: 15,
    ScrapRecoveryPercentage: 85,
    EffectiveScrapRateMultiplier: 0.85
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Reset form when opened
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    const company = companies.find(c => c._id === companyId);
    setSelectedCompany(company);
    setFormData(prev => ({
      ...prev,
      CompanyID: companyId
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.CompanyID) {
      setError('Please select a company');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/company-financial`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add company financial');
      }
    } catch (err) {
      console.error('Error adding company financial:', err);
      setError(err.response?.data?.message || 'Failed to add company financial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      CompanyID: '',
      CreditOnInputMaterialDays: -30,
      WIPFGInventoryDays: 30,
      CreditGivenToCustomerDays: 45,
      CostOfCapital: 0.1,
      OHPPercentage: 10,
      ProfitPercentage: 15,
      ScrapRecoveryPercentage: 85,
      EffectiveScrapRateMultiplier: 0.85
    });
    setSelectedCompany(null);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 600,
          paddingTop: '8px'
        }}>
          Add Company Financial Parameters
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Company Selection */}
          <FormControl fullWidth>
            <InputLabel>Select Company *</InputLabel>
            <Select
              name="CompanyID"
              value={formData.CompanyID}
              onChange={handleCompanyChange}
              label="Select Company *"
              required
              disabled={loading}
            >
              {companies.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1, fontSize: 20, color: '#64748B' }} />
                    <Box>
                      <Typography variant="body2">{company.CompanyName}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {company.GSTIN} | {company.State}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCompany && (
            <Paper sx={{ p: 2, bgcolor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
              <Typography variant="subtitle2" color="#0369A1" gutterBottom>
                Selected Company Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Company Name</Typography>
                  <Typography variant="body2" fontWeight={500}>{selectedCompany.CompanyName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">GSTIN</Typography>
                  <Typography variant="body2" fontWeight={500}>{selectedCompany.GSTIN}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">State</Typography>
                  <Typography variant="body2" fontWeight={500}>{selectedCompany.State}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">State Code</Typography>
                  <Typography variant="body2" fontWeight={500}>{selectedCompany.StateCode}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          <Divider>
            <Chip label="Credit Terms" size="small" />
          </Divider>

          {/* Credit Terms */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Credit on Input Material (Days)"
                name="CreditOnInputMaterialDays"
                type="number"
                value={formData.CreditOnInputMaterialDays}
                onChange={handleNumberChange}
                disabled={loading}
                helperText={formData.CreditOnInputMaterialDays < 0 ? "Negative values = Advance payment" : ""}
                InputProps={{
                  endAdornment: <InputAdornment position="end">days</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="WIP/FG Inventory Days"
                name="WIPFGInventoryDays"
                type="number"
                value={formData.WIPFGInventoryDays}
                onChange={handleNumberChange}
                disabled={loading}
                InputProps={{
                  endAdornment: <InputAdornment position="end">days</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Credit Given to Customer (Days)"
                name="CreditGivenToCustomerDays"
                type="number"
                value={formData.CreditGivenToCustomerDays}
                onChange={handleNumberChange}
                disabled={loading}
                InputProps={{
                  endAdornment: <InputAdornment position="end">days</InputAdornment>
                }}
              />
            </Grid>
          </Grid>

          <Divider>
            <Chip label="Cost Parameters" size="small" />
          </Divider>

          {/* Cost Parameters */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cost of Capital"
                name="CostOfCapital"
                type="number"
                value={formData.CostOfCapital}
                onChange={handleNumberChange}
                disabled={loading}
                InputProps={{
                  endAdornment: <InputAdornment position="end">(decimal)</InputAdornment>
                }}
                helperText="e.g., 0.1 = 10%"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="OHP Percentage"
                name="OHPPercentage"
                type="number"
                value={formData.OHPPercentage}
                onChange={handleNumberChange}
                disabled={loading}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Profit Percentage"
                name="ProfitPercentage"
                type="number"
                value={formData.ProfitPercentage}
                onChange={handleNumberChange}
                disabled={loading}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
          </Grid>

          <Divider>
            <Chip label="Scrap Recovery" size="small" />
          </Divider>

          {/* Scrap Recovery */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Scrap Recovery Percentage"
                name="ScrapRecoveryPercentage"
                type="number"
                value={formData.ScrapRecoveryPercentage}
                onChange={handleNumberChange}
                disabled={loading}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Effective Scrap Rate Multiplier"
                name="EffectiveScrapRateMultiplier"
                type="number"
                value={formData.EffectiveScrapRateMultiplier}
                onChange={handleNumberChange}
                disabled={loading}
                inputProps={{ step: 0.01 }}
              />
            </Grid>
          </Grid>

          {/* Summary Preview */}
          {selectedCompany && (
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: '#E8F5E9', 
              borderRadius: 1,
              border: '1px solid #C8E6C9',
              mt: 2
            }}>
              <Typography variant="subtitle2" fontWeight={600} color="#2E7D32" gutterBottom>
                Financial Parameters Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Credit on Input</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.CreditOnInputMaterialDays} days
                    {formData.CreditOnInputMaterialDays < 0 && " (Advance)"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">WIP/FG Inventory</Typography>
                  <Typography variant="body2" fontWeight={500}>{formData.WIPFGInventoryDays} days</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Customer Credit</Typography>
                  <Typography variant="body2" fontWeight={500}>{formData.CreditGivenToCustomerDays} days</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Cost of Capital</Typography>
                  <Typography variant="body2" fontWeight={500}>{(formData.CostOfCapital * 100).toFixed(1)}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">OHP</Typography>
                  <Typography variant="body2" fontWeight={500}>{formData.OHPPercentage}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Profit</Typography>
                  <Typography variant="body2" fontWeight={500}>{formData.ProfitPercentage}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Scrap Recovery</Typography>
                  <Typography variant="body2" fontWeight={500}>{formData.ScrapRecoveryPercentage}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Scrap Multiplier</Typography>
                  <Typography variant="body2" fontWeight={500}>{formData.EffectiveScrapRateMultiplier}x</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.CompanyID}
          startIcon={!loading && <AddIcon />}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' }
          }}
        >
          {loading ? 'Adding...' : 'Add Financial Parameters'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCompanyFinancial;