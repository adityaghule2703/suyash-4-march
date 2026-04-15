import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid
} from "@mui/material";
import {
  Close,
  PostAdd as PostAddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Warehouse as WarehouseIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// 🎨 SAME DESIGN SYSTEM
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  primaryLight: "#E8F0F1",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8",
    light: "#FFFFFF"
  },
  background: {
    white: "#FFFFFF",
    light: "#F8FFFC"
  },
  border: "#E3E8EF"
};

const labelStyle = {
  fontSize: "0.65rem",
  fontWeight: 600,
  color: COLORS.text.secondary,
  letterSpacing: "0.5px",
  mb: 0.5
};

const valueStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: COLORS.text.primary
};

const PostMRV = ({ open, onClose, data, onPost }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [postResult, setPostResult] = useState(null);

  const handlePost = async () => {
    if (!data || !data._id) {
      setError("Invalid MRV data");
      return;
    }

    // Check if MRV is in Draft status
    if (data.status !== "Draft") {
      setError(`Cannot post MRV in "${data.status}" status. Only Draft MRVs can be posted.`);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${BASE_URL}/api/mrv/${data._id}/post`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setPostResult(response.data.data);
        
        if (onPost) {
          onPost(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || "Failed to post MRV");
      }
    } catch (err) {
      console.error("Error posting MRV:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || "Failed to post MRV";
        
        if (err.response.status === 400) {
          setError(`Cannot post: ${errorMsg}`);
        } else if (err.response.status === 404) {
          setError("MRV not found. It may have been already deleted.");
        } else if (err.response.status === 403) {
          setError("You don't have permission to post this MRV.");
        } else if (err.response.status === 409) {
          setError("Conflict: The MRV may have been already posted or has insufficient stock to return.");
        } else {
          setError(errorMsg);
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "An error occurred while posting the MRV");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDisplayValue = (obj, field) => {
    if (!obj) return '-';
    if (typeof obj === 'object') {
      return obj[field] || obj[field.toLowerCase()] || '-';
    }
    return obj;
  };

  const getPersonName = (person) => {
    if (!person) return '-';
    if (typeof person === 'object') {
      if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
      if (person.FirstName) return person.FirstName;
      if (person.Username) return person.Username;
      if (person.Email) return person.Email;
      if (person.name) return person.name;
      return person._id?.slice(-6) || '-';
    }
    return person;
  };

  return (
    <Dialog
      open={open}
      onClose={!loading && !success ? onClose : undefined}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden"
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 1.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PostAddIcon sx={{ color: '#10B981', fontSize: '1.2rem' }} />
          <Typography sx={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}>
            Post Material Return Voucher
          </Typography>
        </Stack>
        {!loading && !success && (
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" sx={{ color: COLORS.text.tertiary }} />
          </IconButton>
        )}
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success ? (
          <Box>
            <Alert 
              severity="success" 
              icon={<CheckCircleIcon />}
              sx={{ 
                borderRadius: 1.5,
                mb: 3,
                '& .MuiAlert-message': {
                  fontSize: '0.75rem'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                MRV Posted Successfully!
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                Materials have been returned to store and stock has been updated.
              </Typography>
            </Alert>

            {postResult && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, letterSpacing: '0.5px' }}>
                  POSTING SUMMARY
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography sx={labelStyle}>MRV NUMBER</Typography>
                      <Typography sx={valueStyle}>
                        {postResult.mrv_number || data?.mrv_number || '-'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>STATUS</Typography>
                      <Typography sx={{ ...valueStyle, color: '#10B981', fontWeight: 600 }}>
                        {postResult.status || 'Posted'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>TOTAL RETURN VALUE</Typography>
                      <Typography sx={{ ...valueStyle, fontWeight: 700, color: COLORS.primary }}>
                        {formatCurrency(postResult.total_return_value || data?.total_return_value)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>ITEMS RETURNED</Typography>
                      <Typography sx={valueStyle}>
                        {postResult.items_count || data?.items?.length || 0}
                      </Typography>
                    </Box>
                  </Box>

                  <Alert severity="info" sx={{ borderRadius: 1.5, mt: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>
                      Stock has been added back to the warehouse. Stock ledger and transactions have been updated.
                    </Typography>
                  </Alert>
                </Stack>
              </Box>
            )}
          </Box>
        ) : (
          <>
            {/* Warning Alert */}
            <Alert 
              severity="warning" 
              icon={<WarningIcon />}
              sx={{ 
                borderRadius: 1.5,
                mb: 3,
                '& .MuiAlert-message': {
                  fontSize: '0.75rem'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Are you sure you want to post this Material Return Voucher?
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                This action will:
              </Typography>
              <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
                <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                  Add stock back to Stock Ledger (to appropriate warehouse based on condition)
                </Typography>
                <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                  Create stock transaction records
                </Typography>
                <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                  Update original MIV with returned quantities
                </Typography>
                <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                  Update Work Order status
                </Typography>
                <Typography component="li" variant="caption" sx={{ fontSize: '0.7rem' }}>
                  Change MRV status from Draft to Posted
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mt: 1 }}>
                This action cannot be undone.
              </Typography>
            </Alert>

            {error && (
              <Alert 
                severity="error" 
                sx={{ borderRadius: 1.5, mb: 2 }} 
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* MRV Details */}
            {data && (
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, letterSpacing: '0.5px' }}>
                  MRV DETAILS
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography sx={labelStyle}>MRV NUMBER</Typography>
                      <Typography sx={valueStyle}>
                        {data.mrv_number || data._id?.slice(-8) || "-"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>MIV NUMBER</Typography>
                      <Typography sx={valueStyle}>
                        {data.miv_id?.miv_number || getDisplayValue(data.miv_id, 'miv_number') || "-"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>WORK ORDER</Typography>
                      <Typography sx={valueStyle}>
                        {data.work_order?.number || getDisplayValue(data.wo_id, 'wo_number') || "-"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>CONDITION</Typography>
                      <Chip
                        label={data.condition || '-'}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 24,
                          bgcolor: data.condition === 'Good' ? '#D1FAE5' : data.condition === 'Damaged' ? '#FEE2E2' : '#FEF3C7',
                          color: data.condition === 'Good' ? '#059669' : data.condition === 'Damaged' ? '#DC2626' : '#D97706',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>RETURNED BY</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                        <Typography sx={valueStyle}>
                          {getPersonName(data.returned_by)}
                        </Typography>
                      </Stack>
                    </Box>
                    
                    <Box>
                      <Typography sx={labelStyle}>RECEIVED BY</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                        <Typography sx={valueStyle}>
                          {getPersonName(data.received_by)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Items Summary */}
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      ITEMS TO BE RETURNED
                    </Typography>
                    
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: COLORS.background.light }}>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Item</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Returned Qty</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Unit</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Unit Cost</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Total Value</TableCell>
                            <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Batch No</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(data.items || []).map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontSize: '0.65rem' }}>
                                {item.item_description || item.description || item.part_no || "-"}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }}>
                                {item.part_no || "-"}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }} align="right">
                                <Typography sx={{ fontWeight: 600, color: COLORS.primary }}>
                                  {item.returned_qty || 0}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }}>
                                {item.unit || "-"}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }} align="right">
                                {formatCurrency(item.unit_cost || 0)}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }} align="right">
                                {formatCurrency((item.returned_qty || 0) * (item.unit_cost || 0))}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.65rem' }}>
                                {item.batch_no || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Destination Warehouse */}
                  {data.destination && (
                    <Box>
                      <Typography sx={{ labelStyle }}>DESTINATION WAREHOUSE</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WarehouseIcon sx={{ fontSize: '0.875rem', color: COLORS.text.tertiary }} />
                        <Typography sx={valueStyle}>
                          {data.destination?.condition_based || 'Raw Material Store'}
                        </Typography>
                      </Stack>
                    </Box>
                  )}

                  {/* Remarks */}
                  {data.remarks && (
                    <Box>
                      <Typography sx={labelStyle}>REMARKS</Typography>
                      <Typography sx={valueStyle}>{data.remarks}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {/* ACTIONS */}
      {!success && (
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
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handlePost}
            disabled={loading || (data && data.status !== "Draft")}
            startIcon={!loading && <PostAddIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: '#10B981',
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#059669' },
              '&:disabled': {
                bgcolor: COLORS.border,
                color: COLORS.text.tertiary
              }
            }}
          >
            {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : "Post MRV"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PostMRV;