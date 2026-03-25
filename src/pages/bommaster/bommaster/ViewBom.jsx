// ViewBom.jsx
import React from 'react';
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
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#063C3F',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Approved':
      return <CheckCircleIcon sx={{ fontSize: '1rem', color: '#059669' }} />;
    case 'Pending':
      return <PendingIcon sx={{ fontSize: '1rem', color: '#D97706' }} />;
    case 'Rejected':
      return <CancelIcon sx={{ fontSize: '1rem', color: '#DC2626' }} />;
    default:
      return <PendingIcon sx={{ fontSize: '1rem', color: '#4F46E5' }} />;
  }
};

const ViewBom = ({ open, onClose, bom }) => {
  if (!bom) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const parentItem = bom.parent_item_id || {};
  
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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          BOM Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Header Section */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}` 
          }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM ID</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {bom.bom_id}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Version</Typography>
                    <Chip
                      label={bom.bom_version}
                      size="small"
                      sx={{ fontSize: '0.7rem', fontWeight: 500, bgcolor: COLORS.primary, color: '#fff' }}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                  <Chip
                    icon={getStatusIcon(bom.status)}
                    label={bom.status || 'Pending'}
                    size="small"
                    sx={{ fontSize: '0.7rem', fontWeight: 500 }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Parent Item Information */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Parent Item Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part No</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {parentItem.part_no || bom.parent_part_no}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Description</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                  {parentItem.part_description || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Drawing No</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                  {parentItem.drawing_no || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Production Parameters */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Production Parameters
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Type</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.bom_type}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Batch Size</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.batch_size}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Yield %</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.yield_percent}%</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Setup Time</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.setup_time_min} min</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Cycle Time</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{bom.cycle_time_min} min</Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Validity Period */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Validity Period
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effective From</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDate(bom.effective_from)}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effective To</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDate(bom.effective_to)}</Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Components List */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Components ({bom.components?.length || 0})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.light }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Level</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Qty Per</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Scrap %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bom.components?.map((comp, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{comp.level}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{comp.component_part_no}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{comp.component_desc}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{comp.quantity_per}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{comp.unit}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{comp.scrap_percent}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          {/* Metadata */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                <Typography sx={{ fontSize: '0.75rem' }}>{formatDate(bom.created_at)}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Revision</Typography>
                <Typography sx={{ fontSize: '0.75rem' }}>{bom.current_revision}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
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

export default ViewBom;