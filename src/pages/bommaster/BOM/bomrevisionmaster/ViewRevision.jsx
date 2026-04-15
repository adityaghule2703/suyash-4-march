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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Description as DescriptionIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Email as EmailIcon,
  FileCopy as FileCopyIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS } from '../constants';

const ViewRevision = ({ open, onClose, bomId, revisionNo }) => {
  const [loading, setLoading] = useState(false);
  const [revisionData, setRevisionData] = useState(null);
  const [error, setError] = useState('');
  const [creatorName, setCreatorName] = useState('');

  useEffect(() => {
    if (open && bomId && revisionNo !== undefined && revisionNo !== null) {
      fetchRevisionDetails();
    }
  }, [open, bomId, revisionNo]);

  const fetchRevisionDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/boms/${bomId}/revisions/${revisionNo}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setRevisionData(data);
        await fetchCreatorName(data.created_by);
      } else {
        setError(response.data.message || 'Failed to load revision details');
      }
    } catch (err) {
      console.error('Error fetching revision details:', err);
      setError(err.response?.data?.message || 'Failed to load revision details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatorName = async (createdBy) => {
    if (!createdBy) return;
    
    const userId = createdBy._id || createdBy.id;
    if (!userId) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user details
      const userResponse = await axios.get(`${BASE_URL}/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (userResponse.data?.success && userResponse.data?.data) {
        const user = userResponse.data.data;
        const userEmail = user.email;
        
        // Fetch employee details using email
        if (userEmail) {
          const employeeResponse = await axios.get(`${BASE_URL}/api/employees?email=${userEmail}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (employeeResponse.data?.success && employeeResponse.data?.data?.length > 0) {
            const employee = employeeResponse.data.data[0];
            if (employee.FirstName || employee.LastName) {
              setCreatorName(`${employee.FirstName || ''} ${employee.LastName || ''}`.trim());
            } else if (employee.EmployeeID) {
              setCreatorName(employee.EmployeeID);
            } else {
              setCreatorName(user.username || userEmail || userId);
            }
          } else {
            setCreatorName(user.username || userEmail || userId);
          }
        } else {
          setCreatorName(user.username || userId);
        }
      } else {
        setCreatorName(userId);
      }
    } catch (err) {
      console.error('Error fetching creator name:', err);
      setCreatorName(userId);
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

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseFloat(num).toFixed(4);
  };

  const getStatusIcon = (isCurrent) => {
    return isCurrent ? <CheckCircleIcon sx={{ fontSize: '0.7rem', color: '#059669' }} /> : <PendingIcon sx={{ fontSize: '0.7rem', color: '#D97706' }} />;
  };

  const snapshotData = revisionData?.snapshot_data;
  const components = snapshotData?.components || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
          <ViewIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Revision Details
          </Typography>
          {revisionData && (
            <Chip
              label={`Revision ${revisionData.revision_no}`}
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
              Loading revision details...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {revisionData && snapshotData && !loading && (
          <Stack spacing={2.5}>
            {/* Revision Header */}
            <Paper sx={{
              p: 2,
              bgcolor: COLORS.background.light,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">BOM ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                    {revisionData.bom_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">Revision No</Typography>
                  <Chip
                    label={`v${revisionData.revision_no}`}
                    size="small"
                    sx={{ mt: 0.5, fontSize: '0.7rem', fontWeight: 600, bgcolor: COLORS.primary, color: '#fff' }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(revisionData.is_current)}
                    label={revisionData.is_current ? 'Current Revision' : 'Previous Revision'}
                    size="small"
                    sx={{
                      mt: 0.5,
                      fontSize: '0.65rem',
                      height: 24,
                      bgcolor: revisionData.is_current ? '#D1FAE5' : '#FEF3C7',
                      color: revisionData.is_current ? '#059669' : '#D97706'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">Parent Part No</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                    {snapshotData.parent_item?.part_no || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Change Description */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                <DescriptionIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                Change Description
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                {revisionData.change_description || 'No description provided'}
              </Typography>
            </Paper>

            {/* BOM Basic Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                BOM Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Parent Item</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {snapshotData.parent_item?.part_description || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Version</Typography>
                  <Chip
                    label={snapshotData.bom_version}
                    size="small"
                    sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Type</Typography>
                  <Chip
                    label={snapshotData.bom_type}
                    size="small"
                    sx={{ bgcolor: COLORS.background.white, fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Batch Size</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{snapshotData.batch_size}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Components</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{components.length}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Components Table */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Components List
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Level</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Qty Per</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Scrap %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {components.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">No components found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      components.map((comp, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{comp.level}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{comp.component_part_no}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{comp.component_desc}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatNumber(comp.quantity_per)}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{comp.unit}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }} align="right">{comp.scrap_percent}%</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Revision Metadata */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Revision Metadata
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: '0.9rem', color: COLORS.text.secondary }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Created By</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {creatorName || revisionData.created_by?._id || 'System'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <DateIcon sx={{ fontSize: '0.9rem', color: COLORS.text.secondary }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Created At</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {formatDate(revisionData.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Email Recipients */}
              {revisionData.email_sent_to && revisionData.email_sent_to.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">Email Sent To</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {revisionData.email_sent_to.map((email, idx) => (
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
              )}
            </Paper>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end',
        gap: 1
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
       
      </DialogActions>
    </Dialog>
  );
};

export default ViewRevision;