// CompareBomRevisions.jsx
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
  Stack,
  Chip,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  CompareArrows as CompareIcon,
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS } from '../constants';

const CompareBomRevisions = ({ open, onClose, bomId, bomCode, revisions }) => {
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState('');
  const [selectedRev1, setSelectedRev1] = useState('');
  const [selectedRev2, setSelectedRev2] = useState('');
  const [revisionsList, setRevisionsList] = useState([]);

  // Initialize revisions list when component opens
  useEffect(() => {
    if (open && revisions && revisions.length > 0) {
      // Sort revisions by number descending
      const sortedRevisions = [...revisions].sort((a, b) => b.revision_no - a.revision_no);
      setRevisionsList(sortedRevisions);
      
      // Set default selections (latest two revisions)
      if (sortedRevisions.length >= 2) {
        setSelectedRev1(sortedRevisions[1].revision_no); // Previous revision
        setSelectedRev2(sortedRevisions[0].revision_no); // Latest revision
      } else if (sortedRevisions.length === 1) {
        setSelectedRev1(sortedRevisions[0].revision_no);
        setSelectedRev2(sortedRevisions[0].revision_no);
      }
    }
  }, [open, revisions]);

  // Fetch comparison data when revisions are selected
  useEffect(() => {
    if (open && selectedRev1 && selectedRev2 && bomId) {
      fetchComparison();
    }
  }, [selectedRev1, selectedRev2, bomId, open]);

  const fetchComparison = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/boms/${bomId}/revisions/compare/${selectedRev1}/${selectedRev2}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setComparisonData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to compare revisions');
      }
    } catch (err) {
      console.error('Error comparing revisions:', err);
      setError(err.response?.data?.message || 'Failed to compare revisions');
    } finally {
      setLoading(false);
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

  const getChangeTypeIcon = (type) => {
    switch (type) {
      case 'added':
        return <AddIcon sx={{ color: '#10B981', fontSize: '1rem' }} />;
      case 'removed':
        return <RemoveIcon sx={{ color: '#EF4444', fontSize: '1rem' }} />;
      case 'modified':
        return <EditIcon sx={{ color: '#F59E0B', fontSize: '1rem' }} />;
      default:
        return <InfoIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />;
    }
  };

  const getChangeTypeColor = (type) => {
    switch (type) {
      case 'added':
        return '#10B981';
      case 'removed':
        return '#EF4444';
      case 'modified':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#D97706',
      Approved: '#059669',
      Rejected: '#DC2626',
      Draft: '#4F46E5',
      Active: '#059669',
      Cancelled: '#DC2626'
    };
    return colors[status] || '#6B7280';
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
          height: '90vh'
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
          <CompareIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Compare BOM Revisions
          </Typography>
          {bomCode && (
            <Chip
              label={bomCode}
              size="small"
              sx={{ ml: 1, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
            />
          )}
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light, overflow: 'auto' }}>
        {/* Revision Selection */}
        <Paper sx={{ p: 2, mb: 2.5, borderRadius: 1.5, bgcolor: COLORS.background.white }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Revision 1 (Base)</InputLabel>
                <Select
                  value={selectedRev1}
                  onChange={(e) => setSelectedRev1(e.target.value)}
                  label="Revision 1 (Base)"
                >
                  {revisionsList.map((rev) => (
                    <MenuItem key={rev.revision_no} value={rev.revision_no}>
                      v{rev.revision_no} - {formatDate(rev.created_at)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 2, display: 'flex', justifyContent: 'center' }}>
              <CompareIcon sx={{ color: COLORS.primary, fontSize: '2rem' }} />
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Revision 2 (Compare)</InputLabel>
                <Select
                  value={selectedRev2}
                  onChange={(e) => setSelectedRev2(e.target.value)}
                  label="Revision 2 (Compare)"
                >
                  {revisionsList.map((rev) => (
                    <MenuItem key={rev.revision_no} value={rev.revision_no}>
                      v{rev.revision_no} - {formatDate(rev.created_at)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, color: COLORS.text.secondary }}>
              Comparing revisions...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}

        {/* Comparison Results */}
        {comparisonData && !loading && !error && (
          <Stack spacing={2.5}>
            {/* Revision Info Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 2, borderRadius: 1.5, bgcolor: COLORS.background.white }}>
                  <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1, fontWeight: 600 }}>
                    Revision {comparisonData.comparison?.revision1?.no}
                  </Typography>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Created At</Typography>
                      <Typography variant="body2">
                        {formatDate(comparisonData.comparison?.revision1?.created_at)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Change Description</Typography>
                      <Typography variant="body2">
                        {comparisonData.comparison?.revision1?.change_description || '-'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 2, borderRadius: 1.5, bgcolor: COLORS.background.white }}>
                  <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1, fontWeight: 600 }}>
                    Revision {comparisonData.comparison?.revision2?.no}
                  </Typography>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Created At</Typography>
                      <Typography variant="body2">
                        {formatDate(comparisonData.comparison?.revision2?.created_at)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Change Description</Typography>
                      <Typography variant="body2">
                        {comparisonData.comparison?.revision2?.change_description || '-'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* Summary Cards */}
            <Paper sx={{ p: 2, borderRadius: 1.5, bgcolor: COLORS.background.white }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.text.primary, mb: 1.5, fontWeight: 600 }}>
                Comparison Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Components Before</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {comparisonData.comparison?.summary?.total_components_before || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Components After</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {comparisonData.comparison?.summary?.total_components_after || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Added</Typography>
                    <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 600 }}>
                      +{comparisonData.comparison?.summary?.added || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Removed</Typography>
                    <Typography variant="h6" sx={{ color: '#EF4444', fontWeight: 600 }}>
                      -{comparisonData.comparison?.summary?.removed || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Modified</Typography>
                    <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                      {comparisonData.comparison?.summary?.changed || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Changes Details */}
            {comparisonData.changes && (
              <>
                {/* Added Components */}
                {comparisonData.changes.added?.length > 0 && (
                  <Accordion defaultExpanded sx={{ borderRadius: 1.5, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AddIcon sx={{ color: '#10B981' }} />
                        <Typography sx={{ fontWeight: 600, color: '#10B981' }}>
                          Added Components ({comparisonData.changes.added.length})
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Level</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Part No</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Description</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Quantity</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Unit</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Scrap %</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {comparisonData.changes.added.map((comp, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{comp.level}</TableCell>
                                <TableCell>{comp.part_no}</TableCell>
                                <TableCell>{comp.description}</TableCell>
                                <TableCell>{comp.quantity}</TableCell>
                                <TableCell>{comp.unit}</TableCell>
                                <TableCell>{comp.scrap_percent}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Removed Components */}
                {comparisonData.changes.removed?.length > 0 && (
                  <Accordion defaultExpanded sx={{ borderRadius: 1.5, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <RemoveIcon sx={{ color: '#EF4444' }} />
                        <Typography sx={{ fontWeight: 600, color: '#EF4444' }}>
                          Removed Components ({comparisonData.changes.removed.length})
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Level</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Part No</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Description</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Quantity</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Unit</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Scrap %</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {comparisonData.changes.removed.map((comp, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{comp.level}</TableCell>
                                <TableCell>{comp.part_no}</TableCell>
                                <TableCell>{comp.description}</TableCell>
                                <TableCell>{comp.quantity}</TableCell>
                                <TableCell>{comp.unit}</TableCell>
                                <TableCell>{comp.scrap_percent}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Modified Components */}
                {comparisonData.changes.modified?.length > 0 && (
                  <Accordion defaultExpanded sx={{ borderRadius: 1.5, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EditIcon sx={{ color: '#F59E0B' }} />
                        <Typography sx={{ fontWeight: 600, color: '#F59E0B' }}>
                          Modified Components ({comparisonData.changes.modified.length})
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      {comparisonData.changes.modified.map((comp, idx) => (
                        <Paper key={idx} sx={{ p: 2, mb: 1.5, borderRadius: 1.5 }}>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>
                            {comp.part_no} - {comp.description}
                          </Typography>
                          <Grid container spacing={2}>
                            {comp.changes.map((change, changeIdx) => (
                              <Grid size={{ xs: 12, sm: 6 }} key={changeIdx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <EditIcon sx={{ color: '#F59E0B', fontSize: '0.8rem' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {change.field}:
                                  </Typography>
                                  <Typography variant="body2">
                                    <span style={{ color: '#EF4444', textDecoration: 'line-through' }}>
                                      {change.old_value}
                                    </span>
                                    {' → '}
                                    <span style={{ color: '#10B981', fontWeight: 500 }}>
                                      {change.new_value}
                                    </span>
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Paper>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* No Changes */}
                {comparisonData.changes.added?.length === 0 &&
                 comparisonData.changes.removed?.length === 0 &&
                 comparisonData.changes.modified?.length === 0 && (
                  <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 1.5, bgcolor: COLORS.background.white }}>
                    <CheckCircleIcon sx={{ fontSize: 48, color: '#10B981', mb: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, color: COLORS.text.primary }}>
                      No changes between these revisions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Both revisions have identical BOM structures
                    </Typography>
                  </Paper>
                )}
              </>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
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

export default CompareBomRevisions;