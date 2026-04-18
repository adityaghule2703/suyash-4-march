// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Grid,
//   Typography,
//   Button,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   Autocomplete,
//   Chip,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from '@mui/material';
// import { 
//   CheckCircle as CheckCircleIcon,
//   Close as CloseIcon,
//   Inventory,
//   VerifiedUser
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9'
//   },
//   border: '#E3E8EF',
//   success: '#10B981',
//   successLight: '#D1FAE5'
// };

// const ApproveVendor = ({ open, onClose, vendor, onApprove }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [items, setItems] = useState([]);
//   const [loadingItems, setLoadingItems] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);

//   // Fetch items for AVL selection
//   const fetchItems = async () => {
//     try {
//       setLoadingItems(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/items?page=1&limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setItems(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching items:', err);
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   // Load existing AVL items if vendor is already approved
//   useEffect(() => {
//     if (open && vendor) {
//       fetchItems();
      
//       // If vendor already has AVL items, pre-select them
//       if (vendor.avl_items && vendor.avl_items.length > 0 && items.length > 0) {
//         const existingItems = items.filter(item => 
//           vendor.avl_items.includes(item._id)
//         );
//         setSelectedItems(existingItems);
//       } else {
//         setSelectedItems([]);
//       }
//     }
//   }, [open, vendor]);

//   // Update selected items when items load and vendor has AVL items
//   useEffect(() => {
//     if (vendor && vendor.avl_items && vendor.avl_items.length > 0 && items.length > 0) {
//       const existingItems = items.filter(item => 
//         vendor.avl_items.includes(item._id)
//       );
//       setSelectedItems(existingItems);
//     }
//   }, [items, vendor]);

//   const handleItemSelect = (event, newValue) => {
//     setSelectedItems(newValue);
//   };

//   const handleSubmit = async () => {
//     if (!vendor?._id) {
//       setError('Vendor information is missing');
//       return;
//     }

//     if (selectedItems.length === 0) {
//       setError('Please select at least one item for AVL approval');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const itemIds = selectedItems.map(item => item._id);
      
//       const submissionData = {
//         avl_items: itemIds
//       };

//       const response = await axios.put(
//         `${BASE_URL}/api/vendors/${vendor._id}/avl-approve`,
//         submissionData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         onApprove(response.data.data);
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to approve vendor');
//       }
//     } catch (err) {
//       console.error('Error approving vendor:', err);
//       setError(err.response?.data?.message || 'Failed to approve vendor. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!vendor) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Stack direction="row" alignItems="center" spacing={1}>
//           <VerifiedUser sx={{ color: COLORS.primary, fontSize: 20 }} />
//           <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Approve Vendor for AVL
//           </Typography>
//         </Stack>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5, backgroundColor: COLORS.background.white }}>
//         <Stack spacing={2}>
//           {/* Vendor Information Card */}
//           <Paper sx={{ 
//             p: 2, 
//             borderRadius: 1.5, 
//             border: `1px solid ${COLORS.border}`,
//             backgroundColor: COLORS.background.white,
//             boxShadow: 'none'
//           }}>
//             <Typography variant="subtitle2" sx={{ 
//               color: COLORS.primary, 
//               mb: 1.5, 
//               fontWeight: 600, 
//               fontSize: '0.8rem' 
//             }}>
//               Vendor Information
//             </Typography>
            
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     VENDOR NAME
//                   </Typography>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     {vendor.vendor_name}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     VENDOR CODE
//                   </Typography>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                     {vendor.vendor_code}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     VENDOR TYPE
//                   </Typography>
//                   <Chip
//                     label={vendor.vendor_type}
//                     size="small"
//                     sx={{
//                       fontSize: '0.65rem',
//                       height: 22,
//                       width: 'fit-content',
//                       bgcolor: COLORS.primaryLight,
//                       color: COLORS.primary,
//                       '& .MuiChip-label': { px: 1 }
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     GSTIN
//                   </Typography>
//                   <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
//                     {vendor.gstin || '-'}
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* Items Selection Card */}
//           <Paper sx={{ 
//             p: 2, 
//             borderRadius: 1.5, 
//             border: `1px solid ${COLORS.border}`,
//             backgroundColor: COLORS.background.white,
//             boxShadow: 'none'
//           }}>
//             <Typography variant="subtitle2" sx={{ 
//               color: COLORS.primary, 
//               mb: 1.5, 
//               fontWeight: 600, 
//               fontSize: '0.8rem' 
//             }}>
//               <Inventory sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
//               Select Items for AVL
//             </Typography>
            
//             <Typography variant="caption" sx={{ 
//               color: COLORS.text.tertiary, 
//               display: 'block', 
//               mb: 1.5,
//               fontSize: '0.7rem'
//             }}>
//               Select the items that this vendor is approved to supply
//             </Typography>

//            <Autocomplete
//   multiple
//   fullWidth
//   options={items}
//   loading={loadingItems}
//   value={selectedItems}
//   onChange={handleItemSelect}
//   getOptionLabel={(option) => {
//     const partNo = option.part_no || option.PartNo || '';
//     const description = option.part_description || option.Description || '';
//     return `${partNo} - ${description}`;
//   }}
//   isOptionEqualToValue={(option, value) => option._id === value._id}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       size="small"
//       placeholder={loadingItems ? 'Loading items...' : 'Search and select items...'}
//       error={!!error && selectedItems.length === 0}
//       helperText={selectedItems.length === 0 && error ? 'Please select at least one item' : ''}
//       sx={{
//         '& .MuiOutlinedInput-root': {
//           borderRadius: 1.5,
//           fontSize: '0.75rem',
//           '&:hover fieldset': { borderColor: COLORS.primary },
//           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//         }
//       }}
//     />
//   )}
//   renderValue={(value) => (
//     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//       {value.map((option, index) => {
//         const partNo = option.part_no || option.PartNo || '';
//         const description = option.part_description || option.Description || '';
//         return (
//           <Chip
//             key={option._id}
//             label={`${partNo} - ${description.substring(0, 30)}${description.length > 30 ? '...' : ''}`}
//             size="small"
//             onDelete={() => {
//               const newValue = [...selectedItems];
//               newValue.splice(index, 1);
//               setSelectedItems(newValue);
//             }}
//             sx={{
//               fontSize: '0.7rem',
//               height: 24,
//               bgcolor: COLORS.primaryLight,
//               color: COLORS.primary,
//               '& .MuiChip-deleteIcon': {
//                 color: COLORS.primary,
//                 fontSize: '0.8rem',
//                 '&:hover': { color: COLORS.primaryDark }
//               }
//             }}
//           />
//         );
//       })}
//     </Box>
//   )}
//   renderOption={(props, option) => {
//     const partNo = option.part_no || option.PartNo || '';
//     const description = option.part_description || option.Description || '';
//     const unit = option.unit || option.Unit || '';
//     return (
//       <li {...props}>
//         <Box sx={{ width: '100%' }}>
//           <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
//             {partNo} - {description}
//           </Typography>
//           <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//             Unit: {unit} | {option.is_active !== false ? 'Active' : 'Inactive'}
//           </Typography>
//         </Box>
//       </li>
//     );
//   }}
//   ListboxProps={{
//     sx: {
//       '& .MuiAutocomplete-option': {
//         fontSize: '0.75rem',
//         py: 1,
//         px: 1.5
//       }
//     }
//   }}
//   disabled={loading}
// />

//             {selectedItems.length > 0 && (
//               <Box sx={{ mt: 1.5, p: 1, bgcolor: COLORS.successLight, borderRadius: 1 }}>
//                 <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#065F46' }}>
//                   ✓ {selectedItems.length} item(s) selected for AVL approval
//                 </Typography>
//               </Box>
//             )}
//           </Paper>

//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 borderRadius: 1.5,
//                 fontSize: '0.75rem',
//                 py: 0.5
//               }}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={onClose}
//           disabled={loading}
//           startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: COLORS.primary,
//               bgcolor: `${COLORS.primary}10`
//             }
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || selectedItems.length === 0}
//           startIcon={loading ? null : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             bgcolor: COLORS.success,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//             '&:hover': {
//               bgcolor: '#059669'
//             },
//             '&:disabled': {
//               bgcolor: COLORS.border,
//               color: COLORS.text.tertiary
//             }
//           }}
//         >
//           {loading ? 'Approving...' : 'Approve Vendor'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ApproveVendor;

// ApproveVendor.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Autocomplete,
  Chip,
  TextField,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Inventory,
  VerifiedUser
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF',
  success: '#10B981',
  successLight: '#D1FAE5'
};

const ApproveVendor = ({ open, onClose, vendor, onApprove }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch items for AVL selection
  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  // Load existing AVL items if vendor is already approved
  useEffect(() => {
    if (open && vendor) {
      fetchItems();
      
      // If vendor already has AVL items, pre-select them
      if (vendor.avl_items && vendor.avl_items.length > 0 && items.length > 0) {
        const existingItems = items.filter(item => 
          vendor.avl_items.includes(item._id)
        );
        setSelectedItems(existingItems);
      } else {
        setSelectedItems([]);
      }
    }
  }, [open, vendor]);

  // Update selected items when items load and vendor has AVL items
  useEffect(() => {
    if (vendor && vendor.avl_items && vendor.avl_items.length > 0 && items.length > 0) {
      const existingItems = items.filter(item => 
        vendor.avl_items.includes(item._id)
      );
      setSelectedItems(existingItems);
    }
  }, [items, vendor]);

  const handleItemSelect = (event, newValue) => {
    setSelectedItems(newValue);
  };

  const handleSubmit = async () => {
    if (!vendor?._id) {
      setError('Vendor information is missing');
      return;
    }

    if (selectedItems.length === 0) {
      setError('Please select at least one item for AVL approval');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const itemIds = selectedItems.map(item => item._id);
      
      const submissionData = {
        avl_items: itemIds,
        avl_approved: true  // Explicitly set AVL approved to true
      };

      const response = await axios.put(
        `${BASE_URL}/api/vendors/${vendor._id}/avl-approve`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Return the updated vendor data
        const updatedVendor = {
          ...vendor,
          ...response.data.data,
          avl_approved: true,
          avl_items: itemIds
        };
        
        // Call the onApprove callback with updated vendor
        onApprove(updatedVendor);
        onClose();
      } else {
        setError(response.data.message || 'Failed to approve vendor');
      }
    } catch (err) {
      console.error('Error approving vendor:', err);
      setError(err.response?.data?.message || 'Failed to approve vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!vendor) return null;

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
        <Stack direction="row" alignItems="center" spacing={1}>
          <VerifiedUser sx={{ color: COLORS.primary, fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Approve Vendor for AVL
          </Typography>
        </Stack>
        <Chip 
          label={vendor.vendor_code} 
          size="small" 
          sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem' }} 
        />
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, backgroundColor: COLORS.background.white }}>
        <Stack spacing={2}>
          {/* Vendor Information Card */}
          <Paper sx={{ 
            p: 2, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.background.white,
            boxShadow: 'none'
          }}>
            <Typography variant="subtitle2" sx={{ 
              color: COLORS.primary, 
              mb: 1.5, 
              fontWeight: 600, 
              fontSize: '0.8rem' 
            }}>
              Vendor Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    VENDOR NAME
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {vendor.vendor_name}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    VENDOR CODE
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {vendor.vendor_code}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    VENDOR TYPE
                  </Typography>
                  <Chip
                    label={vendor.vendor_type}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      height: 22,
                      width: 'fit-content',
                      bgcolor: COLORS.primaryLight,
                      color: COLORS.primary,
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    GSTIN
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {vendor.gstin || '-'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Items Selection Card */}
          <Paper sx={{ 
            p: 2, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.background.white,
            boxShadow: 'none'
          }}>
            <Typography variant="subtitle2" sx={{ 
              color: COLORS.primary, 
              mb: 1.5, 
              fontWeight: 600, 
              fontSize: '0.8rem' 
            }}>
              <Inventory sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              Select Items for AVL
            </Typography>
            
            <Typography variant="caption" sx={{ 
              color: COLORS.text.tertiary, 
              display: 'block', 
              mb: 1.5,
              fontSize: '0.7rem'
            }}>
              Select the items that this vendor is approved to supply
            </Typography>

            <Autocomplete
              multiple
              fullWidth
              options={items}
              loading={loadingItems}
              value={selectedItems}
              onChange={handleItemSelect}
              getOptionLabel={(option) => {
                const partNo = option.part_no || option.PartNo || '';
                const description = option.part_description || option.Description || '';
                return `${partNo} - ${description}`;
              }}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder={loadingItems ? 'Loading items...' : 'Search and select items...'}
                  error={!!error && selectedItems.length === 0}
                  helperText={selectedItems.length === 0 && error ? 'Please select at least one item' : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.primary },
                      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                    }
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const partNo = option.part_no || option.PartNo || '';
                  const description = option.part_description || option.Description || '';
                  return (
                    <Chip
                      key={option._id}
                      label={`${partNo} - ${description.substring(0, 30)}${description.length > 30 ? '...' : ''}`}
                      size="small"
                      onDelete={() => {
                        const newValue = [...selectedItems];
                        newValue.splice(index, 1);
                        setSelectedItems(newValue);
                      }}
                      sx={{
                        fontSize: '0.7rem',
                        height: 24,
                        bgcolor: COLORS.primaryLight,
                        color: COLORS.primary,
                        '& .MuiChip-deleteIcon': {
                          color: COLORS.primary,
                          fontSize: '0.8rem',
                          '&:hover': { color: COLORS.primaryDark }
                        }
                      }}
                    />
                  );
                })
              }
              renderOption={(props, option) => {
                const partNo = option.part_no || option.PartNo || '';
                const description = option.part_description || option.Description || '';
                const unit = option.unit || option.Unit || '';
                return (
                  <li {...props}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                        {partNo} - {description}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Unit: {unit} | {option.is_active !== false ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
              ListboxProps={{
                sx: {
                  '& .MuiAutocomplete-option': {
                    fontSize: '0.75rem',
                    py: 1,
                    px: 1.5
                  }
                }
              }}
              disabled={loading}
            />

            {selectedItems.length > 0 && (
              <Box sx={{ mt: 1.5, p: 1, bgcolor: COLORS.successLight, borderRadius: 1 }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#065F46' }}>
                  ✓ {selectedItems.length} item(s) selected for AVL approval
                </Typography>
              </Box>
            )}
          </Paper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
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
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || selectedItems.length === 0}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.success,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: '#059669'
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Approving...' : 'Approve Vendor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveVendor;