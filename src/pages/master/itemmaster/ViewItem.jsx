import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Divider,
  Box,
  Avatar,
  Grid
} from '@mui/material';
import { 
  Edit as EditIcon, 
  CheckCircle as CheckCircleIcon, 
  Cancel as CancelIcon,
  Inventory,
  Description,
  Category,
  Receipt,
  AccountBalanceWallet
} from '@mui/icons-material';

const ViewItem = ({ open, onClose, item, onEdit }) => {
  if (!item) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getItemInitials = (partName) => {
    if (!partName) return 'I';
    
    const words = partName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return partName.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010',
          paddingTop: '8px'
        }}>
          Item Details
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Add padding from top for the first field */}
          <div style={{ marginTop: '16px' }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#1976D2',
                fontSize: '1.5rem'
              }}>
                {getItemInitials(item.PartName)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} color="#101010">
                  {item.PartName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                  {item.IsActive ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: '#E8F5E9',
                        color: '#2E7D32',
                        border: 'none',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: '#2E7D32',
                          fontSize: 16
                        }
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<CancelIcon />}
                      label="Inactive"
                      size="small"
                      sx={{
                        bgcolor: '#FEE2E2',
                        color: '#991B1B',
                        border: 'none',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: '#991B1B',
                          fontSize: 16
                        }
                      }}
                    />
                  )}
                  <Typography variant="body2" color="textSecondary">
                    Part No: {item.PartNo}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </div>
          
          <Divider />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <Inventory sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Item Information
                </Typography>
                
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Description
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      backgroundColor: '#F8FAFC',
                      p: 2,
                      borderRadius: 1,
                      mt: 0.5
                    }}>
                      {item.Description || 'No description provided'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Unit
                    </Typography>
                    <Typography variant="body2">
                      {item.Unit || 'Not specified'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Tax Information
                </Typography>
                
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      HSN Code
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.HSNCode || 'Not specified'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
              Drawing Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Drawing Number
                  </Typography>
                  <Typography variant="body2">
                    {item.DrawingNo || 'Not specified'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Revision Number
                  </Typography>
                  <Typography variant="body2">
                    {item.RevisionNo || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
              Material Information
            </Typography>
            
            {item.MaterialID ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Material Code
                    </Typography>
                    <Typography variant="body2">
                      {item.MaterialID.MaterialCode}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Material Name
                    </Typography>
                    <Typography variant="body2">
                      {item.MaterialID.MaterialName}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Material Description
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      backgroundColor: '#F8FAFC',
                      p: 2,
                      borderRadius: 1,
                      mt: 0.5
                    }}>
                      {item.MaterialID.Description || 'No description'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No material assigned
              </Typography>
            )}
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <AccountBalanceWallet sx={{ mr: 1, verticalAlign: 'middle' }} />
              System Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(item.createdAt)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(item.updatedAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        borderTop: '1px solid #E0E0E0', 
        pt: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <Button 
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Close
        </Button>
        {/* <Button
          variant="contained"
          onClick={() => {
            onClose();
            onEdit();
          }}
          startIcon={<EditIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#1976D2',
            '&:hover': {
              backgroundColor: '#1565C0'
            }
          }}
        >
          Edit Item
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewItem;