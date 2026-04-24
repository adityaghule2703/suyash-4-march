// src/pages/DeliveryChallan/components/Modals/PackingListDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Grid,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
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
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF'
};

const PackingListDialog = ({ open, onClose, deliveryChallan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    packed_by: ''
  });

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  useEffect(() => {
    if (deliveryChallan && open) {
      const packingArray = deliveryChallan.packing || [];
      const items = deliveryChallan.items || [];
      
      if (packingArray.length > 0) {
        const initialPackages = packingArray.map((packing, index) => ({
          package_no: index + 1,
          package_type: packing.packing_type || 'Cardboard Box',
          dimensions_l_mm: packing.dimension_l_mm || '',
          dimensions_w_mm: packing.dimension_w_mm || '',
          dimensions_h_mm: packing.dimension_h_mm || '',
          gross_weight_kg: packing.gross_weight_kg || 0,
          net_weight_kg: packing.net_weight_kg || 0,
          contents: items.map(item => ({
            part_no: item.part_no || '',
            description: '',
            qty: item.dispatch_qty || 0,
            batch_no: '',
            serial_numbers: []
          }))
        }));
        setPackages(initialPackages);
      } else {
        const firstPacking = packingArray[0] || {};
        const totalPackages = firstPacking.no_of_packages || 1;
        const totalGrossWeight = firstPacking.gross_weight_kg || 0;
        const totalNetWeight = firstPacking.net_weight_kg || 0;
        const packageType = firstPacking.packing_type || 'Cardboard Box';
        
        const perPackageGrossWeight = totalPackages > 0 ? totalGrossWeight / totalPackages : 0;
        const perPackageNetWeight = totalPackages > 0 ? totalNetWeight / totalPackages : 0;
        
        const initialPackages = [];
        for (let i = 0; i < totalPackages; i++) {
          initialPackages.push({
            package_no: i + 1,
            package_type: packageType,
            dimensions_l_mm: '',
            dimensions_w_mm: '',
            dimensions_h_mm: '',
            gross_weight_kg: perPackageGrossWeight.toFixed(2),
            net_weight_kg: perPackageNetWeight.toFixed(2),
            contents: items.map(item => ({
              part_no: item.part_no || '',
              description: '',
              qty: item.dispatch_qty || 0,
              batch_no: '',
              serial_numbers: []
            }))
          });
        }
        setPackages(initialPackages);
      }
    }
  }, [deliveryChallan, open]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handlePackedByChange = (e) => {
    setFormData({ packed_by: e.target.value });
    setError('');
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = value;
    setPackages(updatedPackages);
  };

  const handleContentChange = (pkgIndex, contentIndex, field, value) => {
    const updatedPackages = [...packages];
    if (field === 'serial_numbers') {
      const serialArray = value.split(',').map(s => s.trim()).filter(s => s);
      updatedPackages[pkgIndex].contents[contentIndex][field] = serialArray;
    } else {
      updatedPackages[pkgIndex].contents[contentIndex][field] = value;
    }
    setPackages(updatedPackages);
  };

  const validateForm = () => {
    if (!formData.packed_by) {
      setError('Please select who packed the items');
      return false;
    }

    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      if (!pkg.dimensions_l_mm || !pkg.dimensions_w_mm || !pkg.dimensions_h_mm) {
        setError(`Please enter all dimensions for Package ${pkg.package_no}`);
        return false;
      }
      if (!pkg.gross_weight_kg || parseFloat(pkg.gross_weight_kg) <= 0) {
        setError(`Please enter valid gross weight for Package ${pkg.package_no}`);
        return false;
      }
      if (!pkg.net_weight_kg || parseFloat(pkg.net_weight_kg) <= 0) {
        setError(`Please enter valid net weight for Package ${pkg.package_no}`);
        return false;
      }

      for (let j = 0; j < pkg.contents.length; j++) {
        const content = pkg.contents[j];
        if (!content.description) {
          setError(`Please enter description for item ${content.part_no || (j + 1)} in Package ${pkg.package_no}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    let totalGrossWeight = 0;
    let totalNetWeight = 0;

    packages.forEach(pkg => {
      totalGrossWeight += parseFloat(pkg.gross_weight_kg) || 0;
      totalNetWeight += parseFloat(pkg.net_weight_kg) || 0;
    });

    const payload = {
      dc_id: deliveryChallan._id,
      packages: packages.map(pkg => ({
        package_no: pkg.package_no,
        package_type: pkg.package_type,
        dimensions_l_mm: parseFloat(pkg.dimensions_l_mm),
        dimensions_w_mm: parseFloat(pkg.dimensions_w_mm),
        dimensions_h_mm: parseFloat(pkg.dimensions_h_mm),
        gross_weight_kg: parseFloat(pkg.gross_weight_kg),
        net_weight_kg: parseFloat(pkg.net_weight_kg),
        contents: pkg.contents.map(content => ({
          part_no: content.part_no,
          description: content.description,
          qty: parseFloat(content.qty),
          batch_no: content.batch_no || '',
          serial_numbers: content.serial_numbers || []
        }))
      })),
      total_packages: packages.length,
      total_gross_weight_kg: parseFloat(totalGrossWeight.toFixed(2)),
      total_net_weight_kg: parseFloat(totalNetWeight.toFixed(2)),
      packed_by: formData.packed_by
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/packing-lists`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create packing list');
      }
    } catch (err) {
      console.error('Error creating packing list:', err);
      setError(err.response?.data?.message || 'Failed to create packing list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployee = employees.find(emp => emp._id === formData.packed_by);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        mb: 2,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Create Packing List
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          For DC: {deliveryChallan?.dc_number} - {deliveryChallan?.customer_name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
        <Stack spacing={3}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
              Packing Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Packed By <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.packed_by}
                      onChange={handlePackedByChange}
                      displayEmpty
                      disabled={loadingEmployees}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.light,
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      <MenuItem value="" disabled>
                        {loadingEmployees ? 'Loading employees...' : 'Select employee'}
                      </MenuItem>
                      {employees.map((emp) => (
                        <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: '0.75rem' }}>
                          {emp.FirstName} {emp.LastName} ({emp.EmployeeID})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedEmployee && (
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      Department: {selectedEmployee.DepartmentID?.DepartmentName || 'N/A'} | 
                      Designation: {selectedEmployee.DesignationID?.DesignationName || 'N/A'}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {packages.map((pkg, pkgIndex) => (
            <Paper key={pkgIndex} sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                Package {pkg.package_no}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Package Type
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={pkg.package_type}
                      onChange={(e) => handlePackageChange(pkgIndex, 'package_type', e.target.value)}
                      placeholder="e.g., Box, Crate, Pallet"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Length (mm) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={pkg.dimensions_l_mm}
                      onChange={(e) => handlePackageChange(pkgIndex, 'dimensions_l_mm', e.target.value)}
                      placeholder="0"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Width (mm) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={pkg.dimensions_w_mm}
                      onChange={(e) => handlePackageChange(pkgIndex, 'dimensions_w_mm', e.target.value)}
                      placeholder="0"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Height (mm) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={pkg.dimensions_h_mm}
                      onChange={(e) => handlePackageChange(pkgIndex, 'dimensions_h_mm', e.target.value)}
                      placeholder="0"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Gross Wt (kg) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={pkg.gross_weight_kg}
                      onChange={(e) => handlePackageChange(pkgIndex, 'gross_weight_kg', e.target.value)}
                      placeholder="0"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Net Wt (kg) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={pkg.net_weight_kg}
                      onChange={(e) => handlePackageChange(pkgIndex, 'net_weight_kg', e.target.value)}
                      placeholder="0"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Package Contents
                </Typography>
                <Paper sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Part No</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Description *</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Batch No</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Serial Numbers</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pkg.contents.map((content, contentIndex) => (
                          <TableRow key={contentIndex}>
                            <TableCell>
                              <Typography sx={{ fontSize: '0.7rem' }}>
                                {content.part_no}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                value={content.description}
                                onChange={(e) => handleContentChange(pkgIndex, contentIndex, 'description', e.target.value)}
                                placeholder="Enter description..."
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    fontSize: '0.7rem',
                                    '&:hover fieldset': { borderColor: COLORS.primary }
                                  },
                                  '& .MuiInputBase-input': { py: 0.75, px: 1, fontSize: '0.7rem' }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                {content.qty}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                value={content.batch_no}
                                onChange={(e) => handleContentChange(pkgIndex, contentIndex, 'batch_no', e.target.value)}
                                placeholder="Batch No"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    fontSize: '0.7rem',
                                    '&:hover fieldset': { borderColor: COLORS.primary }
                                  },
                                  '& .MuiInputBase-input': { py: 0.75, px: 1, fontSize: '0.7rem' }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                value={Array.isArray(content.serial_numbers) ? content.serial_numbers.join(', ') : ''}
                                onChange={(e) => handleContentChange(pkgIndex, contentIndex, 'serial_numbers', e.target.value)}
                                placeholder="Comma separated"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    fontSize: '0.7rem',
                                    '&:hover fieldset': { borderColor: COLORS.primary }
                                  },
                                  '& .MuiInputBase-input': { py: 0.75, px: 1, fontSize: '0.7rem' }
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            </Paper>
          ))}

          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
              Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Packages</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.primary }}>
                  {packages.length}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Gross Weight</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.primary }}>
                  {packages.reduce((sum, pkg) => sum + (parseFloat(pkg.gross_weight_kg) || 0), 0).toFixed(2)} kg
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Net Weight</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.primary }}>
                  {packages.reduce((sum, pkg) => sum + (parseFloat(pkg.net_weight_kg) || 0), 0).toFixed(2)} kg
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Packed By</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {selectedEmployee ? `${selectedEmployee.FirstName} ${selectedEmployee.LastName}` : 'Not selected'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Creating...' : 'Create Packing List'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PackingListDialog;