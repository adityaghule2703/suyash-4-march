// CopyBom.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon,
  FileCopy as CopyIcon,
  ContentCopy as ContentCopyIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF'
};

const CopyBom = ({ open, onClose, bomId, bomData, onCopyComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    new_version: '',
    change_description: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [copiedBom, setCopiedBom] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      // Auto-generate version suggestion
      if (bomData?.bom_version) {
        const currentVersion = bomData.bom_version;
        // Suggest next version (e.g., if current is 1.0, suggest 1.1 or 2.0)
        const versionParts = currentVersion.split('.');
        if (versionParts.length >= 2) {
          const lastPart = parseInt(versionParts[versionParts.length - 1]);
          versionParts[versionParts.length - 1] = (lastPart + 1).toString();
          setFormData({
            new_version: versionParts.join('.'),
            change_description: ''
          });
        } else {
          setFormData({
            new_version: `${currentVersion}.1`,
            change_description: ''
          });
        }
      } else {
        setFormData({
          new_version: '1.0',
          change_description: ''
        });
      }
      setFieldErrors({});
      setError('');
      setSuccess(false);
      setCopiedBom(null);
    }
  }, [open, bomData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.new_version.trim()) {
      errors.new_version = 'New version is required';
      isValid = false;
    } else if (!/^\d+(\.\d+)*$/.test(formData.new_version)) {
      errors.new_version = 'Version should follow semantic versioning (e.g., 1.0, 2.1.0)';
      isValid = false;
    }

    if (!formData.change_description.trim()) {
      errors.change_description = 'Description is required';
      isValid = false;
    } else if (formData.change_description.trim().length < 10) {
      errors.change_description = 'Please provide a detailed Description (minimum 10 characters)';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleCopy = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Copying BOM with ID:', bomId);
      console.log('Copy data:', formData);

      const response = await axios.post(
        `${BASE_URL}/api/boms/${bomId}/copy`,
        {
          id: bomId,
          new_version: formData.new_version,
          change_description: formData.change_description
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Copy response:', response.data);
      
      if (response.data.success) {
        setSuccess(true);
        setCopiedBom(response.data.data);
        
        // Callback to parent if provided
        if (onCopyComplete) {
          onCopyComplete(response.data.data);
        }
      } else {
        setError(response.data.message || 'Failed to copy BOM');
      }
    } catch (err) {
      console.error('Error copying BOM:', err);
      
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 404) {
        setError('Source BOM not found. Please refresh and try again.');
      } else if (err.response?.status === 409) {
        setError('A BOM with this version already exists. Please use a different version number.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to copy BOM. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        new_version: '',
        change_description: ''
      });
      setFieldErrors({});
      setError('');
      setSuccess(false);
      setCopiedBom(null);
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: { bg: '#FEF3C7', color: '#D97706' },
      Approved: { bg: '#D1FAE5', color: '#059669' },
      Active: { bg: '#D1FAE5', color: '#059669' },
      Cancelled: { bg: '#FEE2E2', color: '#DC2626' },
      Archived: { bg: '#F1F5F9', color: '#475569' }
    };
    return statusColors[status] || { bg: '#F1F5F9', color: '#475569' };
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: COLORS.background.white
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CopyIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Copy BOM
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {!success ? (
          <Stack spacing={2.5}>
            {/* Source BOM Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <InfoIcon sx={{ fontSize: '0.9rem' }} />
                Source BOM Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    BOM ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {bomData?.bom_id || bomId}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Current Version
                  </Typography>
                  <Chip
                    label={bomData?.bom_version || 'N/A'}
                    size="small"
                    sx={{ 
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      bgcolor: COLORS.primaryLight,
                      color: COLORS.primary
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Parent Item
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary }}>
                    {bomData?.parent_part_no || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Status
                  </Typography>
                  {bomData?.status && (
                    <Chip
                      label={bomData.status}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 24,
                        bgcolor: getStatusColor(bomData.status).bg,
                        color: getStatusColor(bomData.status).color
                      }}
                    />
                  )}
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Components Count
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {bomData?.components?.length || 0} component(s)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Divider sx={{ borderColor: COLORS.border }} />

            {/* Copy Form */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ContentCopyIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                New BOM Details
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    New Version <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="new_version"
                    placeholder="e.g., 2.0, 1.1.0"
                    value={formData.new_version}
                    onChange={handleChange}
                    error={!!fieldErrors.new_version}
                    helperText={fieldErrors.new_version}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1.5, 
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.light
                      } 
                    }}
                  />
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    Suggested: {bomData?.bom_version ? `v${bomData.bom_version} → v${formData.new_version}` : 'v1.0'}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    Description <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    name="change_description"
                    placeholder="Describe the changes made in this new version..."
                    value={formData.change_description}
                    onChange={handleChange}
                    error={!!fieldErrors.change_description}
                    helperText={fieldErrors.change_description}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1.5, 
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.light
                      } 
                    }}
                  />
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    Provide a clear description of what changes were made in this version
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Info Alert */}
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 1.5,
                fontSize: '0.7rem',
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              <Typography sx={{ fontSize: '0.7rem' }}>
                <strong>What will be copied?</strong><br />
                • All components and their quantities<br />
                • Production parameters (batch size, yield, etc.)<br />
                • BOM type and configuration settings<br />
                • Effective dates will be set to today's date<br />
                • The new BOM will be created with "Pending" status
              </Typography>
            </Alert>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {error}
              </Alert>
            )}
          </Stack>
        ) : (
          // Success View
          <Stack spacing={2.5}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: `${COLORS.success}10`, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.success}`,
              textAlign: 'center',
              boxShadow: 'none'
            }}>
              <CheckCircleIcon sx={{ fontSize: '3rem', color: COLORS.success, mb: 1 }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success, mb: 1 }}>
                BOM Copied Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                The new BOM has been created with version {formData.new_version}
              </Typography>
            </Paper>

            {copiedBom && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5 
                }}>
                  New BOM Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      BOM ID
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {copiedBom.bom_id}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Version
                    </Typography>
                    <Chip
                      label={copiedBom.bom_version}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        bgcolor: COLORS.primaryLight,
                        color: COLORS.primary
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Status
                    </Typography>
                    <Chip
                      label={copiedBom.status}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        bgcolor: '#FEF3C7',
                        color: '#D97706'
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Created At
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>
                      {formatDate(copiedBom.created_at)}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Components
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      {copiedBom.components?.length || 0} component(s)
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
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
          onClick={handleClose}
          disabled={loading}
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
          {success ? 'Close' : 'Cancel'}
        </Button>
        
        {!success && (
          <Button
            variant="contained"
            onClick={handleCopy}
            disabled={loading}
            size="small"
            startIcon={loading ? <CircularProgress size={16} /> : <CopyIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Copying...' : 'Copy BOM'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CopyBom;