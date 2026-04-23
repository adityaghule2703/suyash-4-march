import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
  Box,
  IconButton,
  Chip,
  Paper,
  Stack,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Route as RouteIcon,
  Work as WorkIcon,
  Error as ErrorIcon,
  Build as BuildIcon,
  Science as ScienceIcon,
  Bolt as BoltIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF',
  error: '#DC2626',
  warning: '#D97706',
  info: '#3B82F6',
  success: '#2E7D32'
};

const DeleteRouting = ({ open, onClose, routing, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    setErrorDetails(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.delete(`${BASE_URL}/api/routings/${routing._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        if (onDelete) {
          onDelete(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete routing');
        if (response.data.work_order) {
          setErrorDetails(response.data);
        }
      }
    } catch (err) {
      console.error('Error deleting routing:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete routing. Please try again.';
      setError(errorMessage);
      
      if (err.response?.data?.work_order) {
        setErrorDetails(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? { bg: '#D1FAE5', color: '#059669' } : { bg: '#FEF3C7', color: '#D97706' };
  };

  const totalOperations = routing?.operations?.length || 0;
  const statusColors = getStatusColor(routing?.is_active);
  const torqueOpsCount = routing?.operations?.filter(op => op.requires_torque_recording).length || 0;
  const testOpsCount = routing?.operations?.filter(op => op.requires_functional_test).length || 0;
  const totalJoints = routing?.operations?.reduce((sum, op) => sum + (op.expected_joints?.length || 0), 0) || 0;
  
  const isUsedInWorkOrder = error && (error.includes('used in open Work Order') || errorDetails?.work_order);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        alignItems: 'center',
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.error }}>
          Delete Routing
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {/* Show detailed error when routing is in use */}
        {isUsedInWorkOrder ? (
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <ErrorIcon sx={{ fontSize: 48, color: COLORS.error, mb: 2 }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.error, mb: 2 }}>
              Cannot Delete Routing
            </Typography>
            
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {error}
              </Typography>
            </Alert>

            {/* Work Order Details */}
            {errorDetails?.work_order && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                textAlign: 'left',
                border: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WorkIcon sx={{ fontSize: '0.9rem' }} />
                  Associated Work Order
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Order Number</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {errorDetails.work_order.wo_number}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                    <Chip
                      label={errorDetails.work_order.status}
                      size="small"
                      sx={{ 
                        fontSize: '0.65rem',
                        height: 24,
                        bgcolor: errorDetails.work_order.status === 'In Progress' ? '#FEF3C7' : '#D1FAE5',
                        color: errorDetails.work_order.status === 'In Progress' ? '#D97706' : '#059669'
                      }}
                    />
                  </Box>
                </Stack>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, textAlign: 'center' }}>
                  Please complete or cancel the associated work order before deleting this routing.
                </Typography>
              </Paper>
            )}

            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                mt: 3,
                height: 36,
                px: 3,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <WarningIcon sx={{ fontSize: 48, color: COLORS.error, mb: 2 }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
                Are you sure you want to delete this routing?
              </Typography>
              
              {/* Routing Information Card */}
              <Paper sx={{ 
                p: 2, 
                mt: 2, 
                mb: 1, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                textAlign: 'left'
              }}>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Routing Name
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {routing?.routing_name}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Routing ID
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: COLORS.text.primary }}>
                      {routing?.routing_id}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Routing Type
                      </Typography>
                      <Chip
                        label={routing?.routing_type || '-'}
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 24, bgcolor: '#E0E7FF', color: '#4F46E5' }}
                      />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Status
                      </Typography>
                      <Chip
                        icon={routing?.is_active ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <PendingIcon sx={{ fontSize: '0.7rem' }} />}
                        label={routing?.is_active ? 'Active' : 'Draft'}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          height: 24,
                          bgcolor: statusColors.bg,
                          color: statusColors.color
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Total Operations
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.primary }}>
                        {totalOperations}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Version
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        v{routing?.version || '1.0'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quality Requirements Summary */}
                  {(torqueOpsCount > 0 || testOpsCount > 0) && (
                    <>
                      <Divider />
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScienceIcon sx={{ fontSize: '0.8rem' }} />
                          Quality Requirements
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {torqueOpsCount > 0 && (
                            <Tooltip title={`${torqueOpsCount} operation(s) require torque recording. Total joints: ${totalJoints}`}>
                              <Chip
                                icon={<BoltIcon sx={{ fontSize: '0.7rem' }} />}
                                label={`Torque: ${torqueOpsCount} ops`}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.primary, color: '#fff' }}
                              />
                            </Tooltip>
                          )}
                          {testOpsCount > 0 && (
                            <Tooltip title={`${testOpsCount} operation(s) require functional test`}>
                              <Chip
                                icon={<ScienceIcon sx={{ fontSize: '0.7rem' }} />}
                                label={`Test: ${testOpsCount} ops`}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.success, color: '#fff' }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </>
                  )}

                  {/* Operations Preview */}
                  {routing?.operations && routing.operations.length > 0 && (
                    <>
                      <Divider />
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BuildIcon sx={{ fontSize: '0.8rem' }} />
                          Operations ({totalOperations})
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
                          {routing.operations
                            .sort((a, b) => a.op_sequence - b.op_sequence)
                            .slice(0, 5)
                            .map((op, index) => {
                              const hasTorque = op.requires_torque_recording;
                              const hasTest = op.requires_functional_test;
                              return (
                                <Tooltip
                                  key={index}
                                  title={
                                    <Box>
                                      <Typography variant="caption" display="block">
                                        {op.operation_name}
                                      </Typography>
                                      <Typography variant="caption" display="block">
                                        Setup: {op.planned_setup_min} min | Run: {op.planned_run_min} min
                                      </Typography>
                                      {hasTorque && (
                                        <Typography variant="caption" display="block" sx={{ color: '#FFD700' }}>
                                          🔩 Torque Required
                                        </Typography>
                                      )}
                                      {hasTest && (
                                        <Typography variant="caption" display="block" sx={{ color: '#90EE90' }}>
                                          🧪 Test Required
                                        </Typography>
                                      )}
                                    </Box>
                                  }
                                  arrow
                                  placement="top"
                                >
                                  <Chip
                                    label={`${op.op_sequence}. ${op.operation_name?.substring(0, 20)}${op.operation_name?.length > 20 ? '...' : ''}`}
                                    size="small"
                                    sx={{ 
                                      fontSize: '0.6rem', 
                                      height: 22,
                                      bgcolor: COLORS.background.white,
                                      border: `1px solid ${COLORS.border}`,
                                      ...(hasTorque && {
                                        borderLeft: `3px solid ${COLORS.primary}`,
                                      }),
                                      ...(hasTest && {
                                        borderRight: `3px solid ${COLORS.success}`,
                                      })
                                    }}
                                  />
                                </Tooltip>
                              );
                            })}
                          {routing.operations.length > 5 && (
                            <Chip
                              label={`+${routing.operations.length - 5} more`}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.background.light }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </>
                  )}

                  {/* Applicable Items Preview */}
                  {routing?.applicable_items && routing.applicable_items.length > 0 && (
                    <>
                      <Divider />
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <InventoryIcon sx={{ fontSize: '0.8rem' }} />
                          Applicable Items ({routing.applicable_items.length})
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
                          {routing.applicable_items.slice(0, 5).map((item, index) => (
                            <Chip
                              key={index}
                              label={item.part_no || item.item_id || 'Item'}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.background.white }}
                            />
                          ))}
                          {routing.applicable_items.length > 5 && (
                            <Chip
                              label={`+${routing.applicable_items.length - 5} more`}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.background.light }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </>
                  )}
                </Stack>
              </Paper>
              
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 2 }}>
                This action cannot be undone. The routing will be deactivated.
              </Typography>
            </Box>

            {error && !isUsedInWorkOrder && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {!isUsedInWorkOrder && (
        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          gap: 1
        }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
            startIcon={loading ? null : <DeleteIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.error,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#B91C1C' }
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DeleteRouting;