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
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Route as RouteIcon,
  Build as BuildIcon,
  Inventory as InventoryIcon,
  DateRange as DateIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  List as ListIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF'
  }
};

const ViewRouting = ({ open, onClose, routing }) => {
  if (!routing) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalSetupTime = routing.operations?.reduce((sum, op) => sum + (op.planned_setup_min || 0), 0) || 0;
  const totalRunTime = routing.operations?.reduce((sum, op) => sum + (op.planned_run_min || 0), 0) || 0;

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
          Routing Details
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
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Name</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {routing.routing_name}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing ID</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {routing.routing_id}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: '0.8rem' }} />}
                      label={routing.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: routing.is_active ? '#D1FAE5' : '#FEE2E2',
                        color: routing.is_active ? '#059669' : '#DC2626',
                        '& .MuiChip-icon': {
                          fontSize: '0.8rem',
                          color: routing.is_active ? '#059669' : '#DC2626'
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Version</Typography>
                    <Chip
                      label={routing.version || '1.0'}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: COLORS.background.light,
                        color: COLORS.text.primary
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDateTime(routing.created_at)}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Basic Information */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <RouteIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Basic Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Type</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{routing.routing_type || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Cycle Time</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669' }}>
                  {routing.total_cycle_time_min || totalRunTime} min
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Applicable Items */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Applicable Items
            </Typography>
            {routing.applicable_items && routing.applicable_items.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Category</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {routing.applicable_items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {item.part_no || item._id || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {item.part_description || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {item.item_category || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                No applicable items specified
              </Typography>
            )}
          </Paper>

          {/* Operations Summary */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <SettingsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Operations Summary
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Operations</Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                  {routing.operations?.length || 0}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Setup Time</Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{totalSetupTime} min</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Run Time</Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{totalRunTime} min/unit</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Operations Details */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Operations Details
            </Typography>
            {routing.operations && routing.operations.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Seq</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Operation</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Work Centre</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Setup (min)</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Run (min)</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Scrap %</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Subcontract</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {routing.operations.map((op, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {op.op_sequence}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {typeof op.operation_id === 'object' ? op.operation_id?.process_name : op.operation_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{op.work_centre || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{op.planned_setup_min}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{op.planned_run_min}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{op.scrap_pct || 0}%</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {op.is_subcontract ? (
                            <Chip
                              label={op.subcontract_vendor || 'Yes'}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 20, bgcolor: '#FEF3C7', color: '#D97706' }}
                            />
                          ) : (
                            <Chip
                              label="No"
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.background.light }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                No operations defined
              </Typography>
            )}
          </Paper>

          {/* Additional Information */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <ListIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Additional Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  <PersonIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Created By
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {typeof routing.created_by === 'object' ? routing.created_by?.id || '-' : routing.created_by || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  <DateIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Last Updated
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {formatDateTime(routing.updated_at)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Routing ID
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {routing.routing_id}
                </Typography>
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

export default ViewRouting;