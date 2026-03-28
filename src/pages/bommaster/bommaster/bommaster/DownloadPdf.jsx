// DownloadPdf.jsx - FINAL VERSION WITH INTEGER REVISION SELECTION
import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

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

const DownloadPdf = ({ open, onClose, bomId, bomData }) => {
  const [loading, setLoading] = useState(false);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [revisions, setRevisions] = useState([]);
  const [selectedRevisionNo, setSelectedRevisionNo] = useState(null);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [revisionsData, setRevisionsData] = useState(null);

  // Fetch revisions when modal opens
  useEffect(() => {
    if (open && bomId) {
      fetchRevisions();
    }
  }, [open, bomId]);

  const fetchRevisions = async () => {
    setRevisionsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setRevisionsLoading(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/boms/${bomId}/revisions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setRevisionsData(response.data.data);
        const revisionsList = response.data.data.revisions || [];
        setRevisions(revisionsList);
        
        // Auto-select the current revision if available
        const currentRev = revisionsList.find(rev => rev.is_current === true);
        if (currentRev) {
          setSelectedRevisionNo(currentRev.revision_no);
          setSelectedRevision(currentRev);
        } else if (revisionsList.length > 0) {
          setSelectedRevisionNo(revisionsList[0].revision_no);
          setSelectedRevision(revisionsList[0]);
        }
      } else {
        setError(response.data.message || 'Failed to load revisions');
      }
    } catch (err) {
      console.error('Error fetching revisions:', err);
      
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 404) {
        setError('BOM not found. Please refresh and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load revisions. Please try again.');
      }
    } finally {
      setRevisionsLoading(false);
    }
  };

  const handleRevisionChange = (event) => {
    const revNo = event.target.value;
    setSelectedRevisionNo(revNo);
    const revision = revisions.find(rev => rev.revision_no === revNo);
    setSelectedRevision(revision);
    setError('');
  };

  const handleDownloadPdf = async () => {
    if (!selectedRevision) {
      setError('Please select a revision to download');
      return;
    }

    setDownloading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setDownloading(false);
        return;
      }

      // Use the revision number as integer in the URL
      const url = `${BASE_URL}/api/boms/${bomId}/revisions/${selectedRevision.revision_no}/pdf`;
      console.log('Downloading PDF from URL:', url);
      
      const response = await axios.get(
        url,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          responseType: 'blob'
        }
      );
      
      // Create blob link to download
      const url_blob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url_blob;
      
      // Set filename
      let filename = `BOM_${revisionsData?.bom_id || bomId}_Rev${selectedRevision.revision_no}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url_blob);
      
    } catch (err) {
      console.error('Error downloading PDF:', err);
      
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 404) {
        setError('PDF not found for this revision.');
      } else {
        setError(err.response?.data?.message || 'Failed to download PDF. Please try again.');
      }
    } finally {
      setDownloading(false);
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

  // Helper function to get created by name
  const getCreatedByName = (createdBy) => {
    if (!createdBy) return 'System';
    if (typeof createdBy === 'string') {
      // If it's a MongoDB ID string, show as 'User'
      if (createdBy.match(/^[0-9a-fA-F]{24}$/)) {
        return 'User';
      }
      return createdBy;
    }
    if (createdBy.name) return createdBy.name;
    if (createdBy.username) return createdBy.username;
    if (createdBy.email) return createdBy.email;
    return 'System';
  };

  const getRevisionStatusColor = (isCurrent, hasPdf) => {
    if (isCurrent) return { bg: `${COLORS.primary}15`, color: COLORS.primary, label: 'Current' };
    if (hasPdf) return { bg: `${COLORS.success}15`, color: COLORS.success, label: 'PDF Available' };
    return { bg: `${COLORS.warning}15`, color: COLORS.warning, label: 'No PDF' };
  };

  const handleClose = () => {
    if (!downloading && !loading) {
      setRevisions([]);
      setSelectedRevisionNo(null);
      setSelectedRevision(null);
      setRevisionsData(null);
      setError('');
      onClose();
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
          <PdfIcon sx={{ color: '#EF4444', fontSize: '1.2rem' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Download BOM PDF
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small" disabled={downloading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* BOM Information */}
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
              <DescriptionIcon sx={{ fontSize: '0.9rem' }} />
              BOM Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  BOM ID
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {bomData?.bom_id || revisionsData?.bom_id || bomId}
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Parent Item
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary }}>
                  {bomData?.parent_part_no || revisionsData?.parent_part_no || 'N/A'}
                </Typography>
              </Grid>
              
              {revisionsData && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Current Revision
                    </Typography>
                    <Chip
                      label={`v${revisionsData.current_revision}`}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: COLORS.primaryLight,
                        color: COLORS.primary
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Total Revisions
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      {revisionsData.total_revisions}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>

          {/* Revision Selection */}
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
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <HistoryIcon sx={{ fontSize: '0.9rem' }} />
              Select Revision
            </Typography>
            
            {revisionsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, ml: 2 }}>
                  Loading revisions...
                </Typography>
              </Box>
            ) : revisions.length === 0 ? (
              <Alert 
                severity="warning" 
                sx={{ 
                  borderRadius: 1.5,
                  fontSize: '0.75rem'
                }}
              >
                No revisions found for this BOM.
              </Alert>
            ) : (
              <>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Select Revision</InputLabel>
                  <Select
                    value={selectedRevisionNo !== null ? selectedRevisionNo : ''}
                    onChange={handleRevisionChange}
                    label="Select Revision"
                    sx={{ 
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': {
                        py: 1
                      }
                    }}
                  >
                    {revisions.map((rev) => {
                      const status = getRevisionStatusColor(rev.is_current, rev.has_pdf);
                      return (
                        <MenuItem 
                          key={rev.revision_no} 
                          value={rev.revision_no}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                            <Typography sx={{ fontWeight: 500 }}>
                              Revision {rev.revision_no}
                            </Typography>
                            <Chip
                              label={status.label}
                              size="small"
                              sx={{ 
                                fontSize: '0.6rem',
                                height: 20,
                                bgcolor: status.bg,
                                color: status.color
                              }}
                            />
                            {!rev.has_pdf && (
                              <WarningIcon sx={{ fontSize: '0.8rem', color: COLORS.warning, ml: 1 }} />
                            )}
                          </Stack>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                
                {selectedRevision && (
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Divider sx={{ borderColor: COLORS.border }} />
                    
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Revision Details
                    </Typography>
                    
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <DateRangeIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            Created At:
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            {formatDate(selectedRevision.created_at)}
                          </Typography>
                        </Stack>
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            Created By:
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            {getCreatedByName(selectedRevision.created_by)}
                          </Typography>
                        </Stack>
                      </Grid>
                      
                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                          Change Description:
                        </Typography>
                        <Paper sx={{ 
                          p: 1, 
                          bgcolor: COLORS.background.light, 
                          borderRadius: 1,
                          border: `1px solid ${COLORS.border}`
                        }}>
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            {selectedRevision.change_description || 'No description provided'}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      {!selectedRevision.has_pdf && (
                        <Grid size={{ xs: 12 }}>
                          <Alert 
                            severity="info" 
                            sx={{ 
                              borderRadius: 1.5,
                              fontSize: '0.7rem'
                            }}
                          >
                            <Typography sx={{ fontSize: '0.7rem' }}>
                              <strong>Note:</strong> PDF is not available for this revision. It may be generating or not yet generated.
                            </Typography>
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Stack>
                )}
              </>
            )}
          </Paper>

          {/* Info Alert */}
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 1.5,
              fontSize: '0.7rem'
            }}
          >
            <Typography sx={{ fontSize: '0.7rem' }}>
              <strong>PDF Content:</strong> The PDF will include complete BOM details including components, quantities, production parameters, and revision history.
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
          disabled={downloading}
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
          Cancel
        </Button>
        
        <Button
          variant="contained"
          onClick={handleDownloadPdf}
          disabled={downloading || !selectedRevision || !selectedRevision?.has_pdf || revisionsLoading}
          size="small"
          startIcon={downloading ? <CircularProgress size={16} /> : <DownloadIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark },
            '&.Mui-disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {downloading ? 'Downloading...' : 'Download PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadPdf;