// BomRevisions.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import {
  History as HistoryIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Description as DescriptionIcon,
  CompareArrows as CompareIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS } from './constants';

const BomRevisions = ({ bomId, bomCode, parentPartNo, onCompareRevisions, onSendRevision, onDownloadPdf }) => {
  const [loading, setLoading] = useState(false);
  const [revisionData, setRevisionData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bomId) {
      fetchRevisionHistory();
    }
  }, [bomId]);

  const fetchRevisionHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/boms/${bomId}/revisions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setRevisionData(response.data.data);
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleCompareWithCurrent = (revision) => {
    if (onCompareRevisions && revisionData) {
      onCompareRevisions(revision.revision_no, revisionData.current_revision);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={40} /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>;
  }

  if (!revisionData || !revisionData.revisions?.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
        <HistoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
        <Typography>No revision history available</Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2.5}>
      {/* Header Info */}
      <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}><Typography variant="caption" color="text.secondary">BOM ID</Typography><Typography fontWeight={600}>{revisionData.bom_id}</Typography></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><Typography variant="caption" color="text.secondary">Parent Part No</Typography><Typography fontWeight={600}>{revisionData.parent_part_no}</Typography></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><Typography variant="caption" color="text.secondary">Current Revision</Typography><Chip label={`v${revisionData.current_revision}`} sx={{ bgcolor: COLORS.primary, color: '#fff' }} /></Grid>
        </Grid>
      </Paper>

      {/* Revisions List */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.primary }}>Revision List ({revisionData.total_revisions} revisions)</Typography>
      
      <Stack spacing={2}>
        {revisionData.revisions.map((revision) => {
          const isCurrent = revision.is_current;
          return (
            <Paper key={revision.revision_no} sx={{ p: 2, borderRadius: 2, border: isCurrent ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`, bgcolor: isCurrent ? `${COLORS.primary}05` : COLORS.background.white }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>Revision {revision.revision_no}</Typography>
                  {isCurrent && <Chip label="Current" size="small" sx={{ bgcolor: COLORS.primary, color: '#fff' }} />}
                  <Typography variant="caption" color="text.secondary">{formatDateShort(revision.created_at)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {!isCurrent && <Tooltip title="Compare with current"><IconButton size="small" onClick={() => handleCompareWithCurrent(revision)}><CompareIcon fontSize="small" /></IconButton></Tooltip>}
                  <Tooltip title="Send Revision"><IconButton size="small" onClick={() => onSendRevision(revision.revision_no)}><SendIcon fontSize="small" /></IconButton></Tooltip>
                  {revision.has_pdf && <Tooltip title="Download PDF"><IconButton size="small" onClick={() => onDownloadPdf(revision.revision_no)}><DownloadIcon fontSize="small" /></IconButton></Tooltip>}
                  <Tooltip title="Refresh"><IconButton size="small" onClick={fetchRevisionHistory}><RefreshIcon fontSize="small" /></IconButton></Tooltip>
                </Box>
              </Box>
              
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', gap: 1 }}><DescriptionIcon sx={{ fontSize: '0.9rem', color: COLORS.text.secondary }} /><Box><Typography variant="caption" color="text.secondary">Change Description</Typography><Typography variant="body2">{revision.change_description || 'No description provided'}</Typography></Box></Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}><Box sx={{ display: 'flex', gap: 1 }}><PersonIcon sx={{ fontSize: '0.9rem' }} /><Box><Typography variant="caption" color="text.secondary">Created By</Typography><Typography variant="body2">{revision.created_by?.name || revision.created_by?.id || 'System'}</Typography></Box></Box></Grid>
                  <Grid size={{ xs: 6 }}><Box sx={{ display: 'flex', gap: 1 }}><DateIcon sx={{ fontSize: '0.9rem' }} /><Box><Typography variant="caption" color="text.secondary">Created At</Typography><Typography variant="body2">{formatDate(revision.created_at)}</Typography></Box></Box></Grid>
                </Grid>
                {revision.has_pdf && <Chip icon={<PdfIcon />} label="PDF Available" size="small" sx={{ bgcolor: '#E8F0F1', color: COLORS.primary, width: 'fit-content' }} />}
                {revision.email_sent_to?.length > 0 && <Box><Typography variant="caption" color="text.secondary">Email Sent To</Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>{revision.email_sent_to.map((email, idx) => <Chip key={idx} icon={<EmailIcon />} label={email} size="small" />)}</Box></Box>}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default BomRevisions;