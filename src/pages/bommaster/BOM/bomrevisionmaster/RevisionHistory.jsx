import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Description as DescriptionIcon,
  CompareArrows as CompareIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS } from '../constants';

const RevisionHistory = ({ 
  open, 
  onClose, 
  bomId, 
  bomCode, 
  parentPartNo,
  onCompareRevisions,
  onSendRevision,
  onDownloadPdf 
}) => {
  const [loading, setLoading] = useState(false);
  const [revisionData, setRevisionData] = useState(null);
  const [error, setError] = useState('');
  const [creatorNames, setCreatorNames] = useState({});

  useEffect(() => {
    if (open && bomId) {
      fetchRevisionHistory();
    }
  }, [open, bomId]);

  const fetchRevisionHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/boms/${bomId}/revisions`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setRevisionData(data);
        
        // Extract unique user IDs from revisions
        const userIds = [];
        data.revisions?.forEach(rev => {
          const userId = rev.created_by?._id || rev.created_by?.id;
          if (userId && !userIds.includes(userId)) {
            userIds.push(userId);
          }
        });
        
        // Fetch creator names (Employee Name or Employee ID)
        if (userIds.length > 0) {
          await fetchCreatorNames(userIds);
        }
      } else {
        setError(response.data.message || 'Failed to load revision history');
      }
    } catch (err) {
      console.error('Error fetching revision history:', err);
      setError(err.response?.data?.message || 'Failed to load revision history');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatorNames = async (userIds) => {
    try {
      const token = localStorage.getItem('token');
      const namesMap = {};
      
      for (const userId of userIds) {
        let displayName = userId;
        
        // First, fetch user details
        try {
          const userResponse = await axios.get(`${BASE_URL}/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (userResponse.data?.success && userResponse.data?.data) {
            const user = userResponse.data.data;
            const userEmail = user.email;
            
            // Now fetch employee details using the user's email
            if (userEmail) {
              try {
                const employeeResponse = await axios.get(`${BASE_URL}/api/employees?email=${userEmail}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (employeeResponse.data?.success && employeeResponse.data?.data?.length > 0) {
                  const employee = employeeResponse.data.data[0];
                  // Get Employee Name or Employee ID
                  if (employee.FirstName || employee.LastName) {
                    displayName = `${employee.FirstName || ''} ${employee.LastName || ''}`.trim();
                  } else if (employee.EmployeeID) {
                    displayName = employee.EmployeeID;
                  } else if (user.username) {
                    displayName = user.username;
                  } else {
                    displayName = userEmail;
                  }
                } else {
                  // No employee found, use username or email
                  displayName = user.username || userEmail || userId;
                }
              } catch (empErr) {
                console.error(`Error fetching employee for email ${userEmail}:`, empErr);
                displayName = user.username || userEmail || userId;
              }
            } else {
              displayName = user.username || userId;
            }
          }
        } catch (userErr) {
          console.error(`Error fetching user ${userId}:`, userErr);
          displayName = userId;
        }
        
        namesMap[userId] = displayName;
      }
      
      setCreatorNames(namesMap);
    } catch (err) {
      console.error('Error in fetchCreatorNames:', err);
    }
  };

  const getCreatorDisplayName = (createdBy) => {
    if (!createdBy) return 'System';
    
    const userId = createdBy._id || createdBy.id;
    if (userId && creatorNames[userId]) {
      return creatorNames[userId];
    }
    
    return 'System';
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

  const formatDateShort = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCompareWithCurrent = (revision) => {
    if (onCompareRevisions && revisionData) {
      const currentRev = revisionData.current_revision;
      onCompareRevisions(revision.revision_no, currentRev);
      onClose();
    }
  };

  const handleSendRevision = (revision) => {
    if (onSendRevision) {
      onSendRevision(revision.revision_no);
      onClose();
    }
  };

  const handleDownloadPdf = (revision) => {
    if (onDownloadPdf) {
      onDownloadPdf(revision.revision_no);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Revision History
          </Typography>
          {revisionData && (
            <Chip
              label={`Total: ${revisionData.total_revisions} revisions`}
              size="small"
              sx={{ ml: 1, fontSize: '0.7rem', bgcolor: COLORS.primaryLight, color: COLORS.primary }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, flexDirection: 'column' }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ mt: 2, color: COLORS.text.secondary, fontSize: '0.8rem' }}>
              Loading revision history...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {revisionData && !loading && (
          <>
            {/* Header Information */}
            <Paper sx={{
              p: 2,
              mb: 3,
              bgcolor: COLORS.background.light,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">BOM ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                    {revisionData.bom_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Parent Part No</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                    {revisionData.parent_part_no}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Current Revision</Typography>
                  <Chip
                    label={`v${revisionData.current_revision}`}
                    size="small"
                    sx={{
                      mt: 0.5,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      bgcolor: COLORS.primary,
                      color: '#fff'
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Revisions List - Card Layout */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.primary, mb: 2 }}>
              All Revisions
            </Typography>

            <Stack spacing={2}>
              {revisionData.revisions?.map((revision, index) => {
                const isCurrent = revision.is_current;
                
                return (
                  <Paper
                    key={revision.revision_no}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: isCurrent ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                      bgcolor: isCurrent ? `${COLORS.primary}05` : COLORS.background.white,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {/* Revision Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                          Revision {revision.revision_no}
                        </Typography>
                        {isCurrent && (
                          <Chip
                            label="Current"
                            size="small"
                            sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.primary, color: '#fff' }}
                          />
                        )}
                        <Chip
                          label={formatDateShort(revision.created_at)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', height: 22 }}
                        />
                      </Box>
                      
                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {!isCurrent && (
                          <Tooltip title="Compare with Current">
                            <IconButton
                              size="small"
                              onClick={() => handleCompareWithCurrent(revision)}
                              sx={{ color: '#8B5CF6' }}
                            >
                              <CompareIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                       
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Revision Details */}
                    <Grid container spacing={2}>
                      {/* Change Description */}
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <DescriptionIcon sx={{ fontSize: '0.9rem', color: COLORS.text.secondary }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">Change Description</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                              {revision.change_description || 'No description provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Created By - Now shows Employee Name */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: '0.9rem', color: COLORS.text.secondary }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">Created By</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {getCreatorDisplayName(revision.created_by)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      {/* Created At */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <DateIcon sx={{ fontSize: '0.9rem', color: COLORS.text.secondary }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">Created At</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                              {formatDate(revision.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Email Recipients */}
                      {revision.email_sent_to && revision.email_sent_to.length > 0 && (
                        <Grid size={{ xs: 12 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Email Sent To</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {revision.email_sent_to.map((email, idx) => (
                                <Chip
                                  key={idx}
                                  icon={<EmailIcon sx={{ fontSize: '0.7rem' }} />}
                                  label={email}
                                  size="small"
                                  sx={{ fontSize: '0.65rem', height: 24 }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                );
              })}
            </Stack>

            {/* No Revisions Message */}
            {(!revisionData.revisions || revisionData.revisions.length === 0) && (
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <HistoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 500, color: COLORS.text.secondary }}>
                  No revision history available
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  This BOM has no revisions yet
                </Typography>
              </Paper>
            )}
          </>
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
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Close
        </Button>
        <Button
          variant="outlined"
          onClick={fetchRevisionHistory}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Refresh
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevisionHistory;