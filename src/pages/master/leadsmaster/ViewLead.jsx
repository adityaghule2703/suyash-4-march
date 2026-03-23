import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Paper,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS, STATUS_COLORS, PRIORITY_COLORS } from './constants';

const ViewLead = ({ open, onClose, lead, onEdit }) => {
  if (!lead) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusColors = STATUS_COLORS[lead.status] || { bg: '#F1F5F9', color: '#475569' };
  const priorityColors = PRIORITY_COLORS[lead.priority] || { bg: '#F1F5F9', color: '#475569' };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`, 
        py: 1.5,
        mb: 2, 
        bgcolor: COLORS.background.tableHeader 
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.light }}>
            Lead Details
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.light }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {lead.subject}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Lead ID: {lead.lead_id}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label={lead.status}
                size="small"
                sx={{ bgcolor: statusColors.bg, color: statusColors.color, fontWeight: 500 }}
              />
              <Chip
                label={lead.priority}
                size="small"
                sx={{ bgcolor: priorityColors.bg, color: priorityColors.color, fontWeight: 500 }}
              />
            </Stack>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          {/* Company Information */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
              Company Information
            </Typography>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Company Name</Typography>
                  <Typography variant="body2" fontWeight={500}>{lead.company_name || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Industry</Typography>
                  <Typography variant="body2">{lead.industry || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Lead Source</Typography>
                  <Typography variant="body2">{lead.lead_source} {lead.lead_source_detail && `(${lead.lead_source_detail})`}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Estimated Value</Typography>
                  <Typography variant="body2">{lead.estimated_value ? `₹${lead.estimated_value.toLocaleString()}` : '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
              Contact Information
            </Typography>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Contact Name</Typography>
                  <Typography variant="body2" fontWeight={500}>{lead.contact_name || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Designation</Typography>
                  <Typography variant="body2">{lead.designation || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Email</Typography>
                  <Typography variant="body2">{lead.contact_email || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Mobile</Typography>
                  <Typography variant="body2">{lead.contact_mobile || '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Enquired Items */}
          {lead.enquired_items && lead.enquired_items.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                Enquired Items
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableRow>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem' }}>Description</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem' }}>Qty</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem' }}>Unit</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem' }}>Target Price</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem' }}>Material Grade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lead.enquired_items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.quantity}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.unit}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.target_price ? `₹${item.target_price}` : '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.material_grade || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}

          {/* Feasibility Information */}
          {lead.feasibility_status && (
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                Feasibility Information
              </Typography>
              <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Feasibility Status</Typography>
                    <Typography variant="body2" fontWeight={500}>{lead.feasibility_status}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Feasibility Date</Typography>
                    <Typography variant="body2">{formatDate(lead.feasibility_date)}</Typography>
                  </Grid>
                  {lead.feasibility_notes && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="textSecondary">Feasibility Notes</Typography>
                      <Typography variant="body2">{lead.feasibility_notes}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {lead.tags.map((tag, idx) => (
                  <Chip key={idx} label={tag} size="small" sx={{ fontSize: '0.7rem' }} />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      {/* <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => { onClose(); onEdit(); }} 
          sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
        >
          Edit Lead
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default ViewLead;