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
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { COLORS, CUSTOMER_TYPE_COLORS, PRIORITY_COLORS } from './constants';

const ViewCustomer = ({ open, onClose, customer, onEdit }) => {
  if (!customer) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `₹${amount.toLocaleString()}`;
  };

  const customerTypeColors = CUSTOMER_TYPE_COLORS[customer.customer_type] || { bg: '#F1F5F9', color: '#475569' };
  const priorityColors = PRIORITY_COLORS[customer.priority] || { bg: '#F1F5F9', color: '#475569' };
  const primaryContact = customer.contacts?.find(c => c.is_primary) || customer.contacts?.[0];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`, 
        py: 1.5,
        bgcolor: COLORS.background.tableHeader 
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.light }}>
            Customer Details
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
                {customer.customer_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Code: {customer.customer_code} | ID: {customer.customer_id}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label={customer.customer_type}
                size="small"
                sx={{ bgcolor: customerTypeColors.bg, color: customerTypeColors.color, fontWeight: 500 }}
              />
              <Chip
                label={customer.priority || 'Regular'}
                size="small"
                sx={{ bgcolor: priorityColors.bg, color: priorityColors.color, fontWeight: 500 }}
              />
              {customer.is_export && (
                <Chip
                  label="Export"
                  size="small"
                  sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 500 }}
                />
              )}
              {customer.is_sez && (
                <Chip
                  label="SEZ"
                  size="small"
                  sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 500 }}
                />
              )}
            </Stack>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          {/* Basic Information */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
              <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Basic Information
            </Typography>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Customer Name</Typography>
                  <Typography variant="body2" fontWeight={500}>{customer.customer_name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Customer Code</Typography>
                  <Typography variant="body2">{customer.customer_code}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Industry Segment</Typography>
                  <Typography variant="body2">{customer.industry_segment || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">GSTIN</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{customer.gstin || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">PAN</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{customer.pan || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">MSME Number</Typography>
                  <Typography variant="body2">{customer.msme_number || '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
              <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Contact Information
            </Typography>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
              {primaryContact ? (
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Contact Name</Typography>
                    <Typography variant="body2" fontWeight={500}>{primaryContact.name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Designation</Typography>
                    <Typography variant="body2">{primaryContact.designation || '-'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Email</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <EmailIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                      <Typography variant="body2">{primaryContact.email || '-'}</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Mobile</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PhoneIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                      <Typography variant="body2">{primaryContact.mobile || '-'}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary">No contact information available</Typography>
              )}
              
              {customer.contacts && customer.contacts.length > 1 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                    Additional Contacts ({customer.contacts.length - 1})
                  </Typography>
                  {customer.contacts.filter(c => !c.is_primary).map((contact, idx) => (
                    <Box key={idx} sx={{ mt: 1, pt: 1, borderTop: `1px dashed ${COLORS.border}` }}>
                      <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="textSecondary">Name</Typography>
                          <Typography variant="body2">{contact.name}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="textSecondary">Mobile</Typography>
                          <Typography variant="body2">{contact.mobile || '-'}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </>
              )}
            </Paper>
          </Grid>

          {/* Address Information */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
              <LocationIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Billing Address
            </Typography>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
              <Typography variant="body2">
                {customer.billing_address?.line1}
                {customer.billing_address?.line2 && `, ${customer.billing_address.line2}`}
              </Typography>
              <Typography variant="body2">
                {customer.billing_address?.city}, {customer.billing_address?.state} - {customer.billing_address?.pincode}
              </Typography>
              <Typography variant="body2">
                {customer.billing_address?.country}
              </Typography>
            </Paper>
          </Grid>

          {/* Financial Information */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
              <CreditCardIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Financial Information
            </Typography>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Credit Limit</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(customer.credit_limit)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Credit Days</Typography>
                  <Typography variant="body2">{customer.credit_days || '-'} days</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Payment Terms</Typography>
                  <Typography variant="body2">{customer.payment_terms || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="textSecondary">Currency</Typography>
                  <Typography variant="body2">{customer.currency || 'INR'}</Typography>
                </Grid>
                {customer.credit_outstanding > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="textSecondary">Credit Outstanding</Typography>
                    <Typography variant="body2" color="error">
                      {formatCurrency(customer.credit_outstanding)}
                    </Typography>
                  </Grid>
                )}
                {customer.is_credit_hold && (
                  <Grid size={{ xs: 12 }}>
                    <Chip
                      label="Credit Hold"
                      size="small"
                      sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontSize: '0.7rem' }}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Bank Details */}
          {(customer.bank_details?.bank_name || customer.bank_details?.account_no) && (
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                <AccountBalanceIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Bank Details
              </Typography>
              <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Bank Name</Typography>
                    <Typography variant="body2">{customer.bank_details.bank_name || '-'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Account Name</Typography>
                    <Typography variant="body2">{customer.bank_details.account_name || '-'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">Account Number</Typography>
                    <Typography variant="body2">{customer.bank_details.account_no || '-'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="textSecondary">IFSC Code</Typography>
                    <Typography variant="body2">{customer.bank_details.ifsc || '-'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Metadata */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
              Created: {formatDate(customer.createdAt)} | Last Updated: {formatDate(customer.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => { onClose(); onEdit(); }} 
          sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
        >
          Edit Customer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCustomer;