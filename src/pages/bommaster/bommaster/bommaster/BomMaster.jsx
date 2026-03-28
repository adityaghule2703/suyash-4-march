// BomMaster.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  Snackbar,
  TablePagination,
  Checkbox,
  Stack,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tab,
  Tabs,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  LocationSearching as WhereUsedIcon,
  ThumbUp as ApproveIcon,
  Star as DefaultIcon,
  History as HistoryIcon,
  Autorenew as ReviseIcon,
  PlayArrow as ValidateIcon,
  FileCopy as FileCopyIcon,
   PictureAsPdf as PictureAsPdfIcon,

} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import AddBom from './AddBom';
import ViewBom from './ViewBom';
import EditBom from './EditBom';
import ValidateBom from './ValidateBom';
import DeleteBom from './DeleteBom';
import CopyBom from './CopyBom';
import DownloadPdf from './DownloadPdf';
import { COLORS } from './constants';

// Color constants
const STATUS_COLORS = {
  Pending: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  Approved: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Rejected: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Draft: { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  Active: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Cancelled: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Archived: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
};

// Action Menu Component
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onWhereUsed, onApprove, onSetDefault, onRevisions, onRevise, onExplosion, onValidate, onCopy,  onDownloadPdf  }) => {
  const isApproved = item?.status === 'Approved';

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}20`
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              Edit
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onWhereUsed(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
            <WhereUsedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
              Where Used
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onRevisions(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#06B6D4', minWidth: 36 }}>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#06B6D4', fontSize: '0.75rem' }}>
              Revision History
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onRevise(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
            <ReviseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
              Create New Revision
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onExplosion(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>

          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
              BOM Explosion
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onValidate(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#3B82F6', minWidth: 36 }}>
            <ValidateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#3B82F6', fontSize: '0.75rem' }}>
              Validate BOM
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onCopy(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#3B82F6', minWidth: 36 }}>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#3B82F6', fontSize: '0.75rem' }}>
              Copy BOM
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onDownloadPdf(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#EF4444', fontSize: '0.75rem' }}>
              Download PDF
            </Typography>
          </ListItemText>
        </MenuItem>

        {item?.status === 'Pending' && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <ApproveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Approve
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {isApproved && (
          <MenuItem onClick={() => { onSetDefault(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <DefaultIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                Set as Default
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

        <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Where Used Modal Component
const WhereUsedModal = ({ open, onClose, component, usedInBoms, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />;
      case 'Pending':
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />;
      case 'Rejected':
      case 'Cancelled':
        return <CancelIcon sx={{ fontSize: '0.8rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
    }
  };

  const getStatusColor = (status) => {
    const colors = STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
    return colors;
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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Where Used
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : (
          <>
            <Paper sx={{
              p: 2,
              mb: 2.5,
              bgcolor: COLORS.background.light,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                Component
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                {component?.part_no}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                {component?.part_description}
              </Typography>
            </Paper>

            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Used in {usedInBoms?.length || 0} BOM(s)
            </Typography>

            {usedInBoms?.length === 0 ? (
              <Paper sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: COLORS.background.light,
                borderRadius: 1.5
              }}>
                <InventoryIcon sx={{ fontSize: 40, color: COLORS.text.tertiary, mb: 1 }} />
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }}>
                  This component is not used in any BOM
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={1.5}>
                {usedInBoms.map((bom, index) => {
                  const statusColors = getStatusColor(bom.status);
                  return (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        }
                      }}
                    >
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            BOM ID
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {bom.bom_id}
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Parent Part
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                            {bom.parent_part_no}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            {bom.parent_description}
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 6, sm: 2 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Version
                          </Typography>
                          <Chip
                            label={bom.bom_version}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 22,
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary
                            }}
                          />
                        </Grid>

                        <Grid size={{ xs: 6, sm: 2 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Status
                          </Typography>
                          <Chip
                            icon={getStatusIcon(bom.status)}
                            label={bom.status}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 24,
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              border: `1px solid ${statusColors.border}`
                            }}
                          />
                        </Grid>

                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Effective From
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            {formatDate(bom.effective_from)}
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                            Effective To
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            {formatDate(bom.effective_to)}
                          </Typography>
                        </Grid>

                        {bom.is_default && (
                          <Grid size={{ xs: 12 }}>
                            <Chip
                              icon={<DefaultIcon sx={{ fontSize: '0.7rem' }} />}
                              label="Default Version"
                              size="small"
                              sx={{
                                fontSize: '0.65rem',
                                height: 22,
                                bgcolor: '#FEF3C7',
                                color: '#D97706'
                              }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </>
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

// Revision History Modal
const RevisionHistoryModal = ({ open, onClose, revisionsData, loading }) => {
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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Revision History
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : revisionsData ? (
          <>
            <Paper sx={{
              p: 2,
              mb: 2.5,
              bgcolor: COLORS.background.light,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM ID</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {revisionsData.bom_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Parent Part No</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {revisionsData.parent_part_no}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Revision</Typography>
                  <Chip
                    label={`v${revisionsData.current_revision}`}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      bgcolor: COLORS.primary,
                      color: '#fff'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Revisions</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {revisionsData.total_revisions}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Revision List
            </Typography>

            <Stack spacing={1.5}>
              {revisionsData.revisions?.map((rev, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    border: rev.is_current ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                    bgcolor: rev.is_current ? `${COLORS.primary}10` : COLORS.background.white,
                    '&:hover': {
                      bgcolor: COLORS.background.hover
                    }
                  }}
                >
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Revision No
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                        v{rev.revision_no}
                        {rev.is_current && (
                          <Chip
                            label="Current"
                            size="small"
                            sx={{
                              ml: 1,
                              fontSize: '0.6rem',
                              height: 20,
                              bgcolor: COLORS.primary,
                              color: '#fff'
                            }}
                          />
                        )}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Created At
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formatDate(rev.created_at)}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Change Description
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {rev.change_description || '-'}
                      </Typography>
                    </Grid>

                    {rev.has_pdf && (
                      <Grid size={{ xs: 12 }}>
                        <Chip
                          label="PDF Available"
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            bgcolor: '#E8F0F1',
                            color: COLORS.primary
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </>
        ) : null}
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

// Create New Revision Modal
const CreateRevisionModal = ({ open, onClose, onSubmit, loading }) => {
  const [changeDescription, setChangeDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!changeDescription.trim()) {
      setError('Change description is required');
      return;
    }
    onSubmit(changeDescription);
  };

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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Create New Revision
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Change Description"
          placeholder="Describe the changes made in this revision..."
          value={changeDescription}
          onChange={(e) => {
            setChangeDescription(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error}
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              fontSize: '0.75rem'
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
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
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
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
          {loading ? 'Creating...' : 'Create Revision'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// BOM Explosion Modal
const ExplosionModal = ({ open, onClose, explosionData, loading }) => {
  const formatNumber = (num) => {
    return parseFloat(num).toFixed(4);
  };

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
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          BOM Explosion
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : explosionData ? (
          <>
            {/* Header Info */}
            <Paper sx={{
              p: 2,
              mb: 2.5,
              bgcolor: COLORS.background.light,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM ID</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {explosionData.bom_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Requested Quantity</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {explosionData.requested_quantity}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Parent Item</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {explosionData.parent_item?.part_no}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    {explosionData.parent_item?.description}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Components</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {explosionData.total_components}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Summary Cards */}
            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Total Unique Components
                    </Typography>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.primary }}>
                      {explosionData.summary?.total_unique_components || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Total Quantity by Unit
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {Object.entries(explosionData.summary?.total_quantity_by_unit || {}).map(([unit, qty]) => (
                        <Chip
                          key={unit}
                          label={`${formatNumber(qty)} ${unit}`}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primary
                          }}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Explosion Table */}
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Component Requirements
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Level</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Scrap %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {explosionData.explosion?.map((item, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{item.level}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.part_no}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatNumber(item.quantity)}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{item.unit}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{item.scrap_percent}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : null}
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


const BomMaster = () => {
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedBomForAction, setSelectedBomForAction] = useState(null);
  const [selectedBom, setSelectedBom] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openWhereUsedModal, setOpenWhereUsedModal] = useState(false);
  const [openRevisionHistoryModal, setOpenRevisionHistoryModal] = useState(false);
  const [openCreateRevisionModal, setOpenCreateRevisionModal] = useState(false);
  const [openExplosionModal, setOpenExplosionModal] = useState(false);
  const [openValidateModal, setOpenValidateModal] = useState(false);
  const [openCopyModal, setOpenCopyModal] = useState(false);
  const [openPdfModal, setOpenPdfModal] = useState(false);

  // Data states
  const [whereUsedData, setWhereUsedData] = useState(null);
  const [whereUsedLoading, setWhereUsedLoading] = useState(false);
  const [revisionsData, setRevisionsData] = useState(null);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [explosionData, setExplosionData] = useState(null);
  const [explosionLoading, setExplosionLoading] = useState(false);
  const [createRevisionLoading, setCreateRevisionLoading] = useState(false);
  const [explosionQuantity, setExplosionQuantity] = useState(1);
  const [explosionEffectiveDate, setExplosionEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch BOMs from API
  const fetchBoms = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await axios.get(`${BASE_URL}/api/boms?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setBoms(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load BOMs', 'error');
      }
    } catch (err) {
      console.error('Error fetching BOMs:', err);
      showNotification('Failed to load BOMs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchBoms();
  }, [fetchBoms]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(boms.map(bom => bom._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter(item => item !== id);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  const handleAddBom = () => {
    fetchBoms();
    showNotification('BOM added successfully!', 'success');
  };

  const handleEditBom = () => {
    fetchBoms();
    showNotification('BOM updated successfully!', 'success');
  };

  const handleDeleteBom = () => {
    fetchBoms();
    setSelected([]);
    showNotification('BOM deleted successfully!', 'success');
  };

  const handleApproveBom = async (bom) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/boms/${bom._id}/approve`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        showNotification('BOM approved successfully!', 'success');
        fetchBoms();
      } else {
        showNotification(response.data.message || 'Failed to approve BOM', 'error');
      }
    } catch (err) {
      console.error('Error approving BOM:', err);
      showNotification('Failed to approve BOM', 'error');
    }
  };

  const handleSetDefaultBom = async (bom) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/boms/${bom._id}/set-default`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        showNotification('BOM set as default successfully!', 'success');
        fetchBoms();
      } else {
        showNotification(response.data.message || 'Failed to set BOM as default', 'error');
      }
    } catch (err) {
      console.error('Error setting BOM as default:', err);
      showNotification('Failed to set BOM as default', 'error');
    }
  };

  const handleWhereUsed = async (bom) => {
    setOpenWhereUsedModal(true);
    setWhereUsedLoading(true);

    try {
      const token = localStorage.getItem('token');
      const componentId = bom.components?.[0]?.component_item_id?._id || bom.components?.[0]?.component_item_id;

      if (componentId) {
        const response = await axios.get(`${BASE_URL}/api/boms/where-used/${componentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
          setWhereUsedData(response.data.data);
        } else {
          showNotification('Failed to load where-used data', 'error');
        }
      } else {
        setWhereUsedData(null);
      }
    } catch (err) {
      console.error('Error fetching where-used data:', err);
      showNotification('Failed to load where-used data', 'error');
    } finally {
      setWhereUsedLoading(false);
    }
  };

  const handleRevisionHistory = async (bom) => {
    setOpenRevisionHistoryModal(true);
    setRevisionsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/boms/${bom._id}/revisions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setRevisionsData(response.data.data);
      } else {
        showNotification('Failed to load revision history', 'error');
      }
    } catch (err) {
      console.error('Error fetching revision history:', err);
      showNotification('Failed to load revision history', 'error');
    } finally {
      setRevisionsLoading(false);
    }
  };

  const handleCreateRevision = async (bom, changeDescription) => {
    setCreateRevisionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/boms/${bom._id}/revisions/revise`,
        { change_description: changeDescription },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification('New revision created successfully!', 'success');
        setOpenCreateRevisionModal(false);
        fetchBoms();
      } else {
        showNotification(response.data.message || 'Failed to create revision', 'error');
      }
    } catch (err) {
      console.error('Error creating revision:', err);
      showNotification('Failed to create revision', 'error');
    } finally {
      setCreateRevisionLoading(false);
    }
  };

  const handleExplosion = async (bom) => {
    setOpenExplosionModal(true);
    setExplosionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/boms/${bom._id}/explosion?quantity=${explosionQuantity}&effective_date=${explosionEffectiveDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setExplosionData(response.data.data);
      } else {
        showNotification('Failed to load BOM explosion', 'error');
      }
    } catch (err) {
      console.error('Error fetching BOM explosion:', err);
      showNotification('Failed to load BOM explosion', 'error');
    } finally {
      setExplosionLoading(false);
    }
  };

  const handleValidateBom = (bom) => {
    setSelectedBom(bom);
    setOpenValidateModal(true);
    handleActionMenuClose();
  };

  const handleValidationComplete = (validationResult) => {
    console.log('Validation completed:', validationResult);
    if (!validationResult.is_valid) {
      showNotification(`BOM validation failed with ${validationResult.summary.error_count} errors`, 'warning');
    } else {
      showNotification('BOM validation passed successfully!', 'success');
    }
  };

  const handleCopyBom = (bom) => {
    setSelectedBom(bom);
    setOpenCopyModal(true);
    handleActionMenuClose();
  };

  const handleCopyComplete = (newBom) => {
    showNotification(`BOM copied successfully! New BOM ID: ${newBom.bom_id}`, 'success');
    fetchBoms(); // Refresh the list
  };

  const handleDownloadPdf = (bom) => {
    setSelectedBom(bom);
    setOpenPdfModal(true);
    handleActionMenuClose();
  };

  const handleActionMenuOpen = (event, bom) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedBomForAction(bom);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedBomForAction(null);
  };

  const openViewBomModal = (bom) => {
    setSelectedBom(bom);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditBomModal = (bom) => {
    setSelectedBom(bom);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openDeleteBomDialog = (bom) => {
    setSelectedBom(bom);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openWhereUsedModalFunc = (bom) => {
    setSelectedBom(bom);
    handleWhereUsed(bom);
    handleActionMenuClose();
  };

  const openRevisionHistoryModalFunc = (bom) => {
    setSelectedBom(bom);
    handleRevisionHistory(bom);
    handleActionMenuClose();
  };

  const openCreateRevisionModalFunc = (bom) => {
    setSelectedBom(bom);
    setOpenCreateRevisionModal(true);
    handleActionMenuClose();
  };

  const openExplosionModalFunc = (bom) => {
    setSelectedBom(bom);
    handleExplosion(bom);
    handleActionMenuClose();
  };

  const handleApprove = (bom) => {
    handleApproveBom(bom);
    handleActionMenuClose();
  };

  const handleSetDefault = (bom) => {
    handleSetDefaultBom(bom);
    handleActionMenuClose();
  };

  const handleCreateRevisionSubmit = (changeDescription) => {
    if (selectedBom) {
      handleCreateRevision(selectedBom, changeDescription);
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return <CheckCircleIcon sx={{ fontSize: '0.9rem', color: '#059669' }} />;
      case 'Pending':
        return <PendingIcon sx={{ fontSize: '0.9rem', color: '#D97706' }} />;
      case 'Rejected':
      case 'Cancelled':
        return <CancelIcon sx={{ fontSize: '0.9rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.9rem', color: '#4F46E5' }} />;
    }
  };

  const getBomInitials = (bom) => {
    if (!bom.parent_part_no) return 'BM';
    return bom.parent_part_no.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (bom) => {
    if (!bom.parent_part_no) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = bom.parent_part_no.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Expandable Row Component for Components
  const ExpandableRow = ({ bom }) => {
    const [expanded, setExpanded] = useState(false);

    if (!bom.components?.length) return null;

    return (
      <>
        <TableRow sx={{ '&:hover': { bgcolor: COLORS.background.hover } }}>
          <TableCell padding="checkbox" sx={{ width: 40 }} />
          <TableCell>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </TableCell>
          <TableCell colSpan={7}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {bom.components.length} Component(s)
              </Typography>
              <Chip
                label={`Version: ${bom.bom_version}`}
                size="small"
                sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
              />
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', fontWeight: 600, mb: 1, color: COLORS.text.secondary }}>
                  Components List
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Level</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Qty Per</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Scrap %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bom.components.map((comp, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.level}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.component_part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.component_desc}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.quantity_per}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.unit}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{comp.scrap_percent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          BOM Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage Bill of Materials, track versions, and monitor component requirements
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{
        p: 1.5,
        mb: 2.5,
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by BOM ID, Parent Part No, or Version..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 450 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': {
                    borderColor: COLORS.primary,
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: {
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary,
                    '&::placeholder': {
                      color: COLORS.text.tertiary,
                      fontSize: '0.75rem'
                    }
                  }
                }
              }}
              disabled={loading}
            />
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: '#fee2e2',
                  color: '#991b1b',
                  '&:hover': {
                    borderColor: '#fecaca',
                    bgcolor: '#fee2e2'
                  }
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => setOpenAddModal(true)}
              sx={{
                height: 36,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
              }}
              disabled={loading}
            >
              Add BOM
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* BOMs Table */}
      <Paper sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{
                bgcolor: COLORS.background.tableHeader,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: COLORS.text.light,
                  py: 1.5
                }
              }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < boms.length}
                    checked={boms.length > 0 && selected.length === boms.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: COLORS.text.light,
                      '&.Mui-checked': {
                        color: COLORS.text.light,
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: COLORS.text.light,
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.25rem'
                      }
                    }}
                    disabled={loading || boms.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 40 }}></TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  BOM ID / Parent Item
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Version
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Components
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Effective From
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Created At
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading BOMs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : boms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No BOMs found' : 'No BOMs available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first BOM to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                boms.map((bom) => {
                  const isSelected = selected.includes(bom._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedBomForAction?._id === bom._id;
                  const avatarColor = getAvatarColor(bom);
                  const statusColors = STATUS_COLORS[bom.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
                  const parentItem = bom.parent_item_id || {};

                  return (
                    <React.Fragment key={bom._id}>
                      <TableRow
                        hover
                        selected={isSelected}
                        sx={{
                          bgcolor: COLORS.background.white,
                          '&:hover': {
                            bgcolor: COLORS.background.hover
                          },
                          '&.Mui-selected': {
                            bgcolor: `${COLORS.primary}10`,
                            '&:hover': {
                              bgcolor: `${COLORS.primary}20`
                            }
                          },
                          '& .MuiTableCell-root': {
                            py: 1.5,
                            fontSize: '0.75rem',
                            borderColor: COLORS.border
                          }
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(bom._id)}
                            sx={{
                              color: COLORS.primary,
                              '&.Mui-checked': {
                                color: COLORS.primary,
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: '1.25rem'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 40 }}>
                          {(bom.components?.length || 0) > 0 && (
                            <IconButton size="small">
                              <ExpandMoreIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                              {getBomInitials(bom)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                {bom.bom_id}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {parentItem.part_no || bom.parent_part_no}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bom.bom_version}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              height: 24,
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {bom.bom_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(bom.status)}
                            label={bom.status || 'Pending'}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              height: 24,
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              border: `1px solid ${statusColors.border}`,
                              '& .MuiChip-icon': {
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {bom.components?.length || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            {formatDate(bom.effective_from)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            {formatDate(bom.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 60 }}>
                          <ActionMenu
                            item={bom}
                            anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                            onOpen={(e) => handleActionMenuOpen(e, bom)}
                            onClose={handleActionMenuClose}
                            onView={openViewBomModal}
                            onEdit={openEditBomModal}
                            onDelete={openDeleteBomDialog}
                            onWhereUsed={openWhereUsedModalFunc}
                            onApprove={handleApprove}
                            onSetDefault={handleSetDefault}
                            onRevisions={openRevisionHistoryModalFunc}
                            onRevise={openCreateRevisionModalFunc}
                            onExplosion={openExplosionModalFunc}
                            onValidate={handleValidateBom}
                            onCopy={handleCopyBom}
                             onDownloadPdf={handleDownloadPdf}
                          />
                        </TableCell>
                      </TableRow>
                      <ExpandableRow bom={bom} />
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            },
            '& .MuiTablePagination-select': {
              fontSize: '0.7rem'
            },
            '& .MuiTablePagination-actions button': {
              color: COLORS.primary,
            }
          }}
        />
      </Paper>

      {/* Modal Components */}
      <AddBom
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddBom}
      />

      {selectedBom && (
        <>
          <ViewBom
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedBom(null);
            }}
            bom={selectedBom}
          />

          <EditBom
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedBom(null);
            }}
            bom={selectedBom}
            onUpdate={handleEditBom}
          />

          <DeleteBom
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedBom(null);
            }}
            bom={selectedBom}
            onDelete={handleDeleteBom}
          />
        </>
      )}

      {/* Where Used Modal */}
      <WhereUsedModal
        open={openWhereUsedModal}
        onClose={() => {
          setOpenWhereUsedModal(false);
          setWhereUsedData(null);
        }}
        component={whereUsedData?.component}
        usedInBoms={whereUsedData?.used_in_boms || []}
        loading={whereUsedLoading}
      />

      {/* Revision History Modal */}
      <RevisionHistoryModal
        open={openRevisionHistoryModal}
        onClose={() => {
          setOpenRevisionHistoryModal(false);
          setRevisionsData(null);
        }}
        revisionsData={revisionsData}
        loading={revisionsLoading}
      />

      {/* Create Revision Modal */}
      <CreateRevisionModal
        open={openCreateRevisionModal}
        onClose={() => setOpenCreateRevisionModal(false)}
        onSubmit={handleCreateRevisionSubmit}
        loading={createRevisionLoading}
      />

      {/* BOM Explosion Modal */}
      <ExplosionModal
        open={openExplosionModal}
        onClose={() => {
          setOpenExplosionModal(false);
          setExplosionData(null);
        }}
        explosionData={explosionData}
        loading={explosionLoading}
      />

      {/* Validate BOM Modal */}
      {selectedBom && (
        <ValidateBom
          open={openValidateModal}
          onClose={() => {
            setOpenValidateModal(false);
            setSelectedBom(null);
          }}
          bomId={selectedBom._id}
          bomData={selectedBom}
          onValidationComplete={handleValidationComplete}
        />
      )}

      {/* Copy BOM Modal */}
      {selectedBom && (
        <CopyBom
          open={openCopyModal}
          onClose={() => {
            setOpenCopyModal(false);
            setSelectedBom(null);
          }}
          bomId={selectedBom._id}
          bomData={selectedBom}
          onCopyComplete={handleCopyComplete}
        />
      )}

      {/* Download PDF Modal */}
{selectedBom && (
  <DownloadPdf
    open={openPdfModal}
    onClose={() => {
      setOpenPdfModal(false);
      setSelectedBom(null);
    }}
    bomId={selectedBom._id}
    bomData={selectedBom}
  />
)}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BomMaster;