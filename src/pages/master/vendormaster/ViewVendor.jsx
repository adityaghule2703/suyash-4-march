import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business,
  Person,
  Phone,
  Email,
  LocationOn,
  Receipt,
  AccountBalanceWallet,
  CreditCard,
  Store,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Badge as BadgeIcon,
  LocalOffer,
  Public,
  Info as InfoIcon,
  Payment,
  CalendarToday,
  Block as BlockIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_BLUE = '#00B4D8';
const PRIMARY_DARK = '#063C3F';

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon styling
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? PRIMARY_BLUE : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(ownerState.active && {
    backgroundColor: PRIMARY_BLUE,
    boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: PRIMARY_BLUE,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : props.icon}
    </CustomStepIconRoot>
  );
}

const steps = ['Basic Info', 'Contact & Address', 'Tax & Bank'];

const ViewVendor = ({ open, onClose, vendor, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!vendor) return null;

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

  const getVendorInitials = (vendorName) => {
    if (!vendorName) return 'V';
    const words = vendorName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return vendorName.substring(0, 2).toUpperCase();
  };

  // Helper function to render field with icon
  const renderField = (icon, label, value, color = '#0f172a') => (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: PRIMARY_BLUE, mt: 0.3, minWidth: 20 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#64748B', 
            display: 'block', 
            fontSize: '10px',
            fontWeight: 500,
            lineHeight: 1.2,
            mb: 0.2
          }}
        >
          {label}
        </Typography>
        {typeof value === 'string' ? (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              fontSize: '13px',
              color: color,
              wordBreak: 'break-word'
            }}
          >
            {value || '-'}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Stack>
  );

  // Helper function to render chips for supply categories
  const renderSupplyCategories = () => {
    if (!vendor.supply_category || vendor.supply_category.length === 0) {
      return <Typography variant="body2" sx={{ fontSize: '13px', color: '#94A3B8' }}>No supply categories</Typography>;
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {vendor.supply_category.map((category, index) => (
          <Chip
            key={index}
            label={category}
            size="small"
            sx={{
              fontSize: '11px',
              height: 22,
              bgcolor: '#E8F0F1',
              color: PRIMARY_DARK,
              '& .MuiChip-label': { px: 1 }
            }}
          />
        ))}
      </Box>
    );
  };

  // Helper function to render AVL items
  const renderAvlItems = () => {
    if (!vendor.avl_items || vendor.avl_items.length === 0) {
      return <Typography variant="body2" sx={{ fontSize: '13px', color: '#94A3B8' }}>No AVL items approved</Typography>;
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {vendor.avl_items.map((item, index) => {
          const itemName = typeof item === 'object' ? (item.part_no || item.PartNo || item._id) : item;
          return (
            <Chip
              key={index}
              label={typeof item === 'object' ? `${item.part_no || item.PartNo || ''} - ${item.part_description || item.Description || ''}` : item}
              size="small"
              sx={{
                fontSize: '11px',
                height: 22,
                bgcolor: '#E8F0F1',
                color: PRIMARY_DARK,
                '& .MuiChip-label': { px: 1 }
              }}
            />
          );
        })}
      </Box>
    );
  };

  // Helper function to render Blacklist details
  const renderBlacklistDetails = () => {
    if (!vendor.blacklisted) return null;
    
    return (
      <Paper sx={{ p: 2, mb: 1.5, backgroundColor: '#FEF3C7', borderRadius: 1.5, border: '1px solid #FDE68A' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <BlockIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: '#92400E', fontWeight: 600, fontSize: '0.8rem' }}>
            Blacklisted Vendor
          </Typography>
        </Stack>
        
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12 }}>
            {renderField(
              <InfoIcon sx={{ fontSize: 16 }} />, 
              'Blacklist Reason', 
              vendor.blacklist_reason || 'No reason provided'
            )}
          </Grid>
          {vendor.blacklisted_at && (
            <Grid size={{ xs: 12, sm: 6 }}>
              {renderField(
                <CalendarToday sx={{ fontSize: 16 }} />, 
                'Blacklisted At', 
                formatDate(vendor.blacklisted_at)
              )}
            </Grid>
          )}
          {vendor.blacklisted_by && (
            <Grid size={{ xs: 12, sm: 6 }}>
              {renderField(
                <Person sx={{ fontSize: 16 }} />, 
                'Blacklisted By', 
                typeof vendor.blacklisted_by === 'object' ? vendor.blacklisted_by.Username || vendor.blacklisted_by.Email : vendor.blacklisted_by
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Blacklist Warning - Show at top if blacklisted */}
            {vendor.blacklisted && renderBlacklistDetails()}
            
            {/* Vendor Profile */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: PRIMARY_DARK,
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    border: '2px solid #E3E8EF'
                  }}
                >
                  {getVendorInitials(vendor.vendor_name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} color="#151C26" sx={{ fontSize: '1rem', mb: 0.5 }}>
                    {vendor.vendor_name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip
                      icon={vendor.is_active ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <CancelIcon sx={{ fontSize: 12 }} />}
                      label={vendor.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        bgcolor: vendor.is_active ? '#dcfce7' : '#fee2e2',
                        color: vendor.is_active ? '#166534' : '#991b1b',
                        border: vendor.is_active ? '1px solid #86efac' : '1px solid #fca5a5',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '22px',
                        '& .MuiChip-icon': { fontSize: 12 }
                      }}
                    />
                    <Chip
                      label={vendor.vendor_type}
                      size="small"
                      sx={{
                        bgcolor: '#E8F0F1',
                        color: PRIMARY_DARK,
                        fontSize: '11px',
                        height: '22px',
                        fontWeight: 500
                      }}
                    />
                    <Typography variant="body2" color="#64748B" sx={{ fontSize: '11px' }}>
                      Code: {vendor.vendor_code}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: 16 }} />, 
                    'Vendor ID', 
                    vendor.vendor_id
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <LocalOffer sx={{ fontSize: 16 }} />, 
                    'Vendor Code', 
                    vendor.vendor_code
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <Store sx={{ fontSize: 16 }} />, 
                    'Supply Categories', 
                    renderSupplyCategories()
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Address Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Address Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <LocationOn sx={{ fontSize: 16 }} />, 
                    'Address', 
                    vendor.address
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Public sx={{ fontSize: 16 }} />, 
                    'State', 
                    vendor.state
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: 16 }} />, 
                    'State Code', 
                    vendor.state_code
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Contact & Address
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Contact Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Contact Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Person sx={{ fontSize: 16 }} />, 
                    'Contact Person', 
                    vendor.contact_person
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Phone sx={{ fontSize: 16 }} />, 
                    'Phone', 
                    vendor.phone
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Phone sx={{ fontSize: 16 }} />, 
                    'Alternate Phone', 
                    vendor.alternate_phone
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Email sx={{ fontSize: 16 }} />, 
                    'Email', 
                    vendor.email
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <Public sx={{ fontSize: 16 }} />, 
                    'Website', 
                    vendor.website
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* MSME Information */}
            {(vendor.msme_number || vendor.msme_category) && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <Business sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> MSME Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <BadgeIcon sx={{ fontSize: 16 }} />, 
                      'MSME Number', 
                      vendor.msme_number
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <Store sx={{ fontSize: 16 }} />, 
                      'MSME Category', 
                      vendor.msme_category
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      case 2: // Tax & Bank
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Tax Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Receipt sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Tax Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Receipt sx={{ fontSize: 16 }} />, 
                    'GSTIN', 
                    vendor.gstin
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CreditCard sx={{ fontSize: 16 }} />, 
                    'PAN', 
                    vendor.pan
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Payment Terms */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Payment sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Payment Terms
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <Payment sx={{ fontSize: 16 }} />, 
                    'Payment Terms', 
                    vendor.payment_terms
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Credit Days', 
                    vendor.credit_days ? `${vendor.credit_days} days` : null
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <AccountBalanceWallet sx={{ fontSize: 16 }} />, 
                    'Currency', 
                    vendor.currency
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Bank Details */}
            {vendor.bank_details && (vendor.bank_details.bank_name || vendor.bank_details.account_no) && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <AccountBalanceWallet sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Bank Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <Business sx={{ fontSize: 16 }} />, 
                      'Bank Name', 
                      vendor.bank_details.bank_name
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <LocationOn sx={{ fontSize: 16 }} />, 
                      'Branch', 
                      vendor.bank_details.branch
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <Person sx={{ fontSize: 16 }} />, 
                      'Account Name', 
                      vendor.bank_details.account_name
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <CreditCard sx={{ fontSize: 16 }} />, 
                      'Account Number', 
                      vendor.bank_details.account_no
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <BadgeIcon sx={{ fontSize: 16 }} />, 
                      'IFSC Code', 
                      vendor.bank_details.ifsc
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <Store sx={{ fontSize: 16 }} />, 
                      'Account Type', 
                      vendor.bank_details.account_type
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* AVL Details */}
            {(vendor.avl_approved || (vendor.avl_items && vendor.avl_items.length > 0)) && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <VerifiedUserIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> 
                  AVL Approval Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip
                        icon={vendor.avl_approved ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <CancelIcon sx={{ fontSize: 12 }} />}
                        label={vendor.avl_approved ? 'AVL Approved' : 'Not Approved'}
                        size="small"
                        sx={{
                          bgcolor: vendor.avl_approved ? '#dcfce7' : '#fee2e2',
                          color: vendor.avl_approved ? '#166534' : '#991b1b',
                          border: vendor.avl_approved ? '1px solid #86efac' : '1px solid #fca5a5',
                          fontWeight: 600,
                          fontSize: '11px',
                          height: '22px',
                          '& .MuiChip-icon': { fontSize: 12 }
                        }}
                      />
                    </Stack>
                  </Grid>
                  {vendor.avl_approved_at && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {renderField(
                        <CalendarToday sx={{ fontSize: 16 }} />, 
                        'Approved At', 
                        formatDate(vendor.avl_approved_at)
                      )}
                    </Grid>
                  )}
                  {vendor.avl_approved_by && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {renderField(
                        <Person sx={{ fontSize: 16 }} />, 
                        'Approved By', 
                        typeof vendor.avl_approved_by === 'object' ? vendor.avl_approved_by.Username || vendor.avl_approved_by.Email : vendor.avl_approved_by
                      )}
                    </Grid>
                  )}
                  {vendor.avl_review_date && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {renderField(
                        <CalendarToday sx={{ fontSize: 16 }} />, 
                        'Review Date', 
                        formatDate(vendor.avl_review_date)
                      )}
                    </Grid>
                  )}
                  <Grid size={{ xs: 12 }}>
                    {renderField(
                      <Store sx={{ fontSize: 16 }} />, 
                      'AVL Items', 
                      renderAvlItems()
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* System Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Created At', 
                    formatDate(vendor.createdAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Last Updated', 
                    formatDate(vendor.updatedAt)
                  )}
                </Grid>
                {vendor.blacklisted && (
                  <Grid size={{ xs: 12 }}>
                    {renderField(
                      <BlockIcon sx={{ fontSize: 16 }} />, 
                      'Status', 
                      <Chip
                        icon={<BlockIcon sx={{ fontSize: 12 }} />}
                        label="Blacklisted"
                        size="small"
                        sx={{
                          bgcolor: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FDE68A',
                          fontWeight: 600,
                          fontSize: '11px',
                          height: '22px'
                        }}
                      />
                    )}
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
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
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          height: 'auto',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ 
        background: HEADER_GRADIENT,
        py: 1.5,
        px: 2.5
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Business sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Vendor Details
            </Typography>
          </Stack>
          <Chip
            label={`ID: ${vendor._id?.slice(-6) || '-'}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '10px',
              height: '24px',
              backdropFilter: 'blur(4px)',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ 
            mt: 0.5,
            '& .MuiStepLabel-label': {
              color: '#FFFFFF !important',
              opacity: 0.8,
              fontSize: '0.7rem !important',
              '&.Mui-active': {
                color: '#FFFFFF !important',
                opacity: 1,
                fontWeight: 600
              },
              '&.Mui-completed': {
                color: '#FFFFFF !important',
                opacity: 1
              }
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={500} fontSize="0.7rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ 
        p: 2.5, 
        overflow: 'auto', 
        height: 'auto',
        maxHeight: 'calc(90vh - 140px)',
        backgroundColor: '#F8FFFC',
        '&:last-child': {
          pb: 2.5
        }
      }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: '1px solid #E3E8EF',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          size="small"
          sx={{ 
            color: '#64748B', 
            fontSize: '0.75rem',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#F1F5F9'
            }
          }}
        >
          Close
        </Button>

        <Stack direction="row" spacing={1}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              size="small"
              startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
              sx={{ 
                color: '#64748B', 
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#F1F5F9'
                }
              }}
            >
              Back
            </Button>
          )}
          
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                backgroundColor: PRIMARY_DARK,
                fontSize: '0.75rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { 
                  backgroundColor: '#05292B',
                  boxShadow: 'none'
                }
              }}
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewVendor;