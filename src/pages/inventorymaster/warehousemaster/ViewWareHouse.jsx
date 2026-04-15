import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
  Paper,
  IconButton,
  Chip,
  Divider,
  Grid,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Warehouse as WarehouseIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { COLORS, getWarehouseTypeColor } from './constants';

const ViewWareHouse = ({ open, onClose, warehouse, onEdit }) => {
  if (!warehouse) return null;
  
  const typeColors = getWarehouseTypeColor(warehouse.warehouse_type);
  const stockSummary = warehouse.stock_summary || { total_quantity: 0, total_value: 0, unique_items_count: 0 };
  const totalBins = warehouse.total_bins || warehouse.bins?.length || 0;
  const activeBins = warehouse.active_bins || warehouse.bins?.filter(b => b.is_active !== false).length || 0;
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
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
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: COLORS.primary, width: 32, height: 32 }}>
            <WarehouseIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Warehouse Details
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2}>
          {/* Header Info */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.light, 
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
                  {warehouse.warehouse_name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Chip
                    label={warehouse.warehouse_id}
                    size="small"
                    sx={{ fontSize: '0.7rem', bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                  />
                  <Chip
                    label={warehouse.warehouse_type}
                    size="small"
                    sx={{ fontSize: '0.7rem', bgcolor: typeColors.bg, color: typeColors.color }}
                  />
                  <Chip
                    icon={warehouse.is_active !== false ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <CancelIcon sx={{ fontSize: '0.7rem' }} />}
                    label={warehouse.is_active !== false ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem',
                      bgcolor: warehouse.is_active !== false ? COLORS.chips.active : COLORS.chips.inactive,
                      color: warehouse.is_active !== false ? '#166534' : '#475569'
                    }}
                  />
                </Stack>
              </Box>
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => onEdit(warehouse)}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary
                  }}
                >
                  Edit
                </Button>
              )}
            </Stack>
          </Paper>
          
          {/* Location */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <LocationIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                Location
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, pl: 3 }}>
              {warehouse.location}
            </Typography>
          </Paper>
          
          {/* Manager Info */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                Manager
              </Typography>
            </Stack>
            {warehouse.manager_id ? (
              <Box sx={{ pl: 3 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {warehouse.manager_id.Username || warehouse.manager_id.name || 'Manager'}
                </Typography>
                {warehouse.manager_id.Email && (
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                    {warehouse.manager_id.Email}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, pl: 3 }}>
                Not Assigned
              </Typography>
            )}
          </Paper>
          
          {/* Stock Summary */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <InventoryIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                Stock Summary
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Total Quantity</Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {stockSummary.total_quantity.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Unique Items</Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {stockSummary.unique_items_count}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Total Value</Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                    ₹{stockSummary.total_value.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Bins Section */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <QrCodeIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                Bins ({activeBins}/{totalBins} Active)
              </Typography>
            </Stack>
            
            {warehouse.bins && warehouse.bins.length > 0 ? (
              <Stack spacing={1}>
                {warehouse.bins.map((bin, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1.5,
                      bgcolor: COLORS.background.light,
                      borderRadius: 1.5,
                      border: `1px solid ${COLORS.border}`,
                      opacity: bin.is_active === false ? 0.6 : 1
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {bin.bin_code}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            ID: {bin.bin_id}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {bin.rack && (
                            <Chip
                              label={`Rack: ${bin.rack}`}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                          )}
                          {bin.row && (
                            <Chip
                              label={`Row: ${bin.row}`}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                          )}
                          {bin.col && (
                            <Chip
                              label={`Col: ${bin.col}`}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                          )}
                          <Chip
                            label={`Capacity: ${bin.capacity.toLocaleString()}`}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                          />
                          {bin.is_active === false && (
                            <Chip
                              label="Inactive"
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.chips.inactive }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, textAlign: 'center', py: 2 }}>
                No bins configured
              </Typography>
            )}
          </Paper>
          
          {/* Metadata */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Created At</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  {formatDate(warehouse.createdAt)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Last Updated</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  {formatDate(warehouse.updatedAt)}
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
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Close
        </Button>
        {onEdit && (
          <Button
            variant="contained"
            startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => onEdit(warehouse)}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.primary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            Edit Warehouse
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewWareHouse;