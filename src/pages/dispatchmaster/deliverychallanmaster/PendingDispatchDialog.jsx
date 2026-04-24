// src/pages/DeliveryChallan/components/Modals/PendingDispatchDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Chip
} from '@mui/material';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF'
};

const PendingDispatchDialog = ({ open, onClose, pendingDCs }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Pending Dispatch Delivery Challans
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          Delivery challans pending for dispatch ({pendingDCs?.length || 0} items)
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>DC Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>DC Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>SO Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>DC Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingDCs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                        No pending dispatch delivery challans
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingDCs?.map((dc) => (
                    <TableRow key={dc._id} hover>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          {dc.dc_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(dc.dc_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {dc.so_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {dc.customer_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={dc.dc_type}
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
                          {dc.items?.length || 0} item(s)
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PendingDispatchDialog;