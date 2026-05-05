import React, { useState } from 'react';
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
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  CreditCard as CreditCardIcon,
  Store as StoreIcon,
  Badge as BadgeIcon,
  LocalOffer as LocalOfferIcon,
  Public as PublicIcon,
  Info as InfoIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarTodayIcon,
  Block as BlockIcon,
  VerifiedUser as VerifiedUserIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

// Color constants matching the consistent style
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
  border: '#E3E8EF'
};

const steps = ['Basic Info', 'Contact & Address', 'Tax & Bank'];

// Modern Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
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
  backgroundColor: ownerState.active || ownerState.completed ? COLORS.primary : '#ccc',
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
    backgroundColor: COLORS.primary,
    boxShadow: '0 4px 10px 0 rgba(6,60,63,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: COLORS.primary,
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

const ViewVendor = ({ open, onClose, vendor }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!vendor) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Helper function to render field
  const renderField = (label, value, monospace = false, highlight = false) => (
    <Box>
      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ 
        fontSize: '0.8rem', 
        fontWeight: highlight ? 700 : 500, 
        color: highlight ? COLORS.primary : COLORS.text.primary,
        fontFamily: monospace ? 'monospace' : 'inherit',
        wordBreak: 'break-word'
      }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  // Helper function to render chips for supply categories
  const renderSupplyCategories = () => {
    if (!vendor.supply_category || vendor.supply_category.length === 0) {
      return <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>No supply categories</Typography>;
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {vendor.supply_category.map((category, index) => (
          <Chip
            key={index}
            label={category}
            size="small"
            sx={{
              fontSize: '0.65rem',
              height: 22,
              bgcolor: COLORS.background.light,
              color: COLORS.primary,
              border: `1px solid ${COLORS.border}`
            }}
          />
        ))}
      </Box>
    );
  };

  // Render AVL items with detailed view
  const renderAvlItems = () => {
    if (!vendor.avl_items || vendor.avl_items.length === 0) {
      return (
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
          No AVL items approved
        </Typography>
      );
    }
    
    return (
      <Stack spacing={1.5}>
        {vendor.avl_items.map((item, index) => {
          const isPopulated = typeof item === 'object' && item.part_no;
          const itemName = isPopulated ? item.part_no : item;
          const itemDescription = isPopulated ? item.part_description : '';
          const itemUnit = isPopulated ? item.unit : '';
          const itemHsn = isPopulated ? item.hsn_code : '';
          
          return (
            <Card 
              key={index} 
              variant="outlined"
              sx={{ 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.light,
                '&:hover': {
                  borderColor: COLORS.primary,
                }
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InventoryIcon sx={{ color: COLORS.primary, fontSize: 18 }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.text.primary }}>
                        {itemName}
                      </Typography>
                    </Stack>
                    {isPopulated && itemUnit && (
                      <Chip
                        label={itemUnit}
                        size="small"
                        sx={{
                          fontSize: '0.6rem',
                          height: 20,
                          bgcolor: COLORS.background.white,
                          color: COLORS.primary,
                          fontWeight: 600,
                          border: `1px solid ${COLORS.border}`
                        }}
                      />
                    )}
                  </Stack>
                  
                  {isPopulated && itemDescription && (
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <DescriptionIcon sx={{ color: COLORS.text.tertiary, fontSize: 14, mt: 0.2 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {itemDescription}
                      </Typography>
                    </Stack>
                  )}
                  
                  {(isPopulated && itemHsn) && (
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ReceiptIcon sx={{ color: COLORS.text.tertiary, fontSize: 12 }} />
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>
                          HSN: {itemHsn}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    );
  };

  // Render Blacklist details
  const renderBlacklistDetails = () => {
    if (!vendor.blacklisted) return null;
    
    return (
      <Paper sx={{ 
        p: 2, 
        bgcolor: '#FEF3C7', 
        borderRadius: 1.5, 
        border: '1px solid #FDE68A' 
      }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <BlockIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#92400E' }}>
            Blacklisted Vendor
          </Typography>
        </Stack>
        
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12 }}>
            {renderField('Blacklist Reason', vendor.blacklist_reason || 'No reason provided')}
          </Grid>
          {vendor.blacklisted_at && (
            <Grid size={{ xs: 12, sm: 6 }}>
              {renderField('Blacklisted At', formatDate(vendor.blacklisted_at))}
            </Grid>
          )}
          {vendor.blacklisted_by && (
            <Grid size={{ xs: 12, sm: 6 }}>
              {renderField('Blacklisted By', typeof vendor.blacklisted_by === 'object' ? vendor.blacklisted_by.Username || vendor.blacklisted_by.Email : vendor.blacklisted_by)}
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Stack spacing={2}>
            {/* Blacklist Warning */}
            {vendor.blacklisted && renderBlacklistDetails()}
            
            {/* Vendor Profile */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Vendor Overview
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: COLORS.primary,
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    border: `1px solid ${COLORS.border}`
                  }}
                >
                  {getVendorInitials(vendor.vendor_name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {vendor.vendor_name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      icon={vendor.is_active ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <CancelIcon sx={{ fontSize: 12 }} />}
                      label={vendor.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 500,
                        bgcolor: vendor.is_active ? '#DCFCE7' : '#FEE2E2',
                        color: vendor.is_active ? '#166534' : '#991B1B'
                      }}
                    />
                    <Chip
                      label={vendor.vendor_type}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        bgcolor: COLORS.background.white,
                        color: COLORS.primary,
                        border: `1px solid ${COLORS.border}`
                      }}
                    />
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Code: {vendor.vendor_code}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Vendor ID', vendor.vendor_id, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Vendor Code', vendor.vendor_code, true)}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Supply Categories
                    </Typography>
                    {renderSupplyCategories()}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Address Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <LocationOnIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Address Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  {renderField('Address', vendor.address)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('State', vendor.state)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('State Code', vendor.state_code, true)}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Contact & Address
        return (
          <Stack spacing={2}>
            {/* Contact Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Contact Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Contact Person', vendor.contact_person)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Phone', vendor.phone)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Alternate Phone', vendor.alternate_phone)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Email', vendor.email)}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderField('Website', vendor.website)}
                </Grid>
              </Grid>
            </Paper>

            {/* MSME Information */}
            {(vendor.msme_number || vendor.msme_category) && (
              <Paper sx={{ 
                p: 2, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5 
                }}>
                  <StoreIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  MSME Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('MSME Number', vendor.msme_number, true)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('MSME Category', vendor.msme_category)}
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      case 2: // Tax & Bank
        return (
          <Stack spacing={2}>
            {/* Tax Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Tax Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('GSTIN', vendor.gstin, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('PAN', vendor.pan, true)}
                </Grid>
              </Grid>
            </Paper>

            {/* Payment Terms */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <PaymentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Payment Terms
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Payment Terms', vendor.payment_terms)}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Credit Days', vendor.credit_days ? `${vendor.credit_days} days` : '-')}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Currency', vendor.currency)}
                </Grid>
              </Grid>
            </Paper>

            {/* Bank Details */}
            {vendor.bank_details && (vendor.bank_details.bank_name || vendor.bank_details.account_no) && (
              <Paper sx={{ 
                p: 2, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5 
                }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Bank Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Bank Name', vendor.bank_details.bank_name)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Branch', vendor.bank_details.branch)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Account Name', vendor.bank_details.account_name)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Account Number', vendor.bank_details.account_no, true)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('IFSC Code', vendor.bank_details.ifsc, true)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Account Type', vendor.bank_details.account_type)}
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* AVL Approval Details */}
            {(vendor.avl_approved || (vendor.avl_items && vendor.avl_items.length > 0)) && (
              <Paper sx={{ 
                p: 2, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                    <VerifiedUserIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} /> 
                    AVL Approval Details
                  </Typography>
                  {vendor.avl_approved && (
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 12 }} />}
                      label="Approved"
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        bgcolor: '#DCFCE7',
                        color: '#166534'
                      }}
                    />
                  )}
                </Stack>
                
                <Grid container spacing={1.5}>
                  {vendor.avl_approved_at && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {renderField('Approved At', formatDate(vendor.avl_approved_at))}
                    </Grid>
                  )}
                  {vendor.avl_approved_by && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {renderField('Approved By', typeof vendor.avl_approved_by === 'object' ? vendor.avl_approved_by.Username || vendor.avl_approved_by.Email : vendor.avl_approved_by)}
                    </Grid>
                  )}
                  {vendor.avl_review_date && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {renderField('Review Date', formatDate(vendor.avl_review_date))}
                    </Grid>
                  )}
                  <Grid size={{ xs: 12 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                        AVL Items ({vendor.avl_items?.length || 0})
                      </Typography>
                      {renderAvlItems()}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* System Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Created At', formatDate(vendor.createdAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Last Updated', formatDate(vendor.updatedAt))}
                </Grid>
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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Vendor Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          size="small"
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Back
        </Button>
        <Box>
          <Button
            onClick={onClose}
            size="small"
            sx={{
              height: 32,
              px: 2,
              mr: 1,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Close
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={onClose}
              size="small"
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
              Done
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
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
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewVendor;