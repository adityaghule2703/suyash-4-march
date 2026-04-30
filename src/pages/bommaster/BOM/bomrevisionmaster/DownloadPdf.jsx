// DownloadPdf.jsx - Fixed for correct API response structure
import React, { useState, useEffect } from 'react';
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
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
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
  border: '#E3E8EF'
};

const DownloadPdf = ({ open, onClose, bomId, bomData }) => {
  const [loading, setLoading] = useState(false);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [revisions, setRevisions] = useState([]);
  const [selectedRevisionNo, setSelectedRevisionNo] = useState('');
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [revisionsData, setRevisionsData] = useState(null);

  // Fetch revisions when modal opens
  useEffect(() => {
    if (open && bomId) {
      fetchRevisions();
    }
  }, [open, bomId]);

  const fetchRevisions = async () => {
    setRevisionsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setRevisionsLoading(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/boms/${bomId}/revisions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setRevisionsData(response.data.data);
        const revisionsList = response.data.data.revisions || [];
        setRevisions(revisionsList);
        
        // Auto-select the current revision if available
        const currentRev = revisionsList.find(rev => rev.is_current === true);
        if (currentRev) {
          setSelectedRevisionNo(currentRev.revision_no.toString());
          setSelectedRevision(currentRev);
        } else if (revisionsList.length > 0) {
          setSelectedRevisionNo(revisionsList[0].revision_no.toString());
          setSelectedRevision(revisionsList[0]);
        }
      } else {
        setError(response.data.message || 'Failed to load revisions');
      }
    } catch (err) {
      console.error('Error fetching revisions:', err);
      
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 404) {
        setError('BOM not found. Please refresh and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load revisions. Please try again.');
      }
    } finally {
      setRevisionsLoading(false);
    }
  };

  const handleRevisionChange = (event) => {
    const revNo = event.target.value;
    setSelectedRevisionNo(revNo);
    const revision = revisions.find(rev => rev.revision_no.toString() === revNo);
    setSelectedRevision(revision);
    setError('');
  };

  // Generate BOM PDF HTML template - FIXED to match the actual API response structure
  const generateBOMHTML = (revisionData) => {
    // Extract data from the revision response structure
    const { snapshot_data, revision_no, revision_id, created_at, change_description, created_by, is_current } = revisionData;
    
    // Check if snapshot_data exists
    if (!snapshot_data) {
      console.error('Snapshot data is missing:', revisionData);
      return '<html><body><h1>Error: No snapshot data available</h1></body></html>';
    }
    
    // Extract data from snapshot_data
    const {
      bom_id,
      parent_item,
      bom_version,
      bom_type,
      batch_size,
      yield_percent,
      setup_time_min,
      cycle_time_min,
      components
    } = snapshot_data;
    
    // Defensive checks for components
    if (!components || !Array.isArray(components)) {
      console.error('Components data is missing or invalid:', components);
      return '<html><body><h1>Error: No component data available</h1></body></html>';
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Format component data to match expected structure
    const formattedComponents = components.map(comp => ({
      level: comp.level || 0,
      part_no: comp.component_part_no || comp.part_no || '-',
      description: comp.component_desc || comp.description || '-',
      quantity: comp.quantity_per || comp.quantity || 0,
      unit: comp.unit || '-',
      scrap_percent: comp.scrap_percent || 0,
      is_phantom: comp.is_phantom || false,
      is_subcontract: comp.is_subcontract || false,
      vendor_name: comp.subcontract_vendor || comp.vendor_name || null,
      reference_designator: comp.reference_designator || '-',
      remarks: comp.remarks || '-'
    }));

    // Calculate total components and quantities
    const totalComponents = formattedComponents.length;
    const totalQuantity = formattedComponents.reduce((sum, comp) => sum + Number(comp.quantity || 0), 0);

    // Get created by name
    const createdByName = created_by?.name || created_by?.username || created_by?.email || 'System';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BOM Document - ${bom_id || 'Unknown'} - Revision ${revision_no || 'N/A'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
            background: white;
            padding: 10mm;
            font-size: 12px;
            color: #151C26;
          }
          
          .bom-pdf {
            max-width: 1100px;
            margin: 0 auto;
            background: white;
          }
          
          /* Header Section */
          .header {
            border-bottom: 3px solid #063C3F;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .header-left {
            flex: 1;
          }
          
          .header-right {
            text-align: right;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #063C3F;
            margin-bottom: 5px;
          }
          
          .company-details {
            font-size: 11px;
            color: #4B5568;
            line-height: 1.4;
          }
          
          .document-title {
            font-size: 20px;
            font-weight: bold;
            color: #063C3F;
            text-align: center;
            margin: 20px 0;
          }
          
          .revision-badge {
            background: #063C3F;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
          }
          
          .current-badge {
            background: #10B981;
            color: white;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            display: inline-block;
            margin-left: 10px;
          }
          
          /* Info Sections */
          .info-section {
            margin-bottom: 20px;
          }
          
          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #063C3F;
            background: #E8F0F1;
            padding: 8px 12px;
            margin-bottom: 12px;
            border-left: 4px solid #063C3F;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 15px;
          }
          
          .info-row {
            display: flex;
            padding: 6px 0;
            border-bottom: 1px solid #E3E8EF;
          }
          
          .info-label {
            width: 35%;
            font-weight: 600;
            color: #4B5568;
            font-size: 11px;
          }
          
          .info-value {
            width: 65%;
            color: #151C26;
            font-size: 11px;
            font-weight: 500;
          }
          
          /* BOM Table */
          .bom-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 11px;
          }
          
          .bom-table th {
            background: #063C3F;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #063C3F;
          }
          
          .bom-table td {
            padding: 8px;
            border: 1px solid #E3E8EF;
            vertical-align: top;
          }
          
          .bom-table tr:nth-child(even) {
            background: #F8FFFC;
          }
          
          .bom-table tr:hover {
            background: #F0FDF9;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-center {
            text-align: center;
          }
          
          /* Summary Cards */
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          
          .summary-card {
            background: #F8FFFC;
            border: 1px solid #E3E8EF;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
          }
          
          .summary-label {
            font-size: 10px;
            color: #4B5568;
            margin-bottom: 5px;
          }
          
          .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #063C3F;
          }
          
          /* Production Parameters */
          .params-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 15px 0;
          }
          
          .param-item {
            background: #F8FFFC;
            border: 1px solid #E3E8EF;
            border-radius: 6px;
            padding: 10px;
          }
          
          .param-label {
            font-size: 10px;
            color: #4B5568;
            margin-bottom: 4px;
          }
          
          .param-value {
            font-size: 14px;
            font-weight: bold;
            color: #063C3F;
          }
          
          /* Footer */
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #E3E8EF;
            font-size: 10px;
            color: #94A3B8;
            text-align: center;
          }
          
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            padding: 0 50px;
          }
          
          .signature-line {
            text-align: center;
          }
          
          .signature-line .line {
            width: 200px;
            border-top: 1px solid #151C26;
            margin-bottom: 5px;
          }
          
          .signature-line .label {
            font-size: 10px;
            color: #4B5568;
          }
          
          @media print {
            body {
              padding: 0;
            }
            .bom-table tr:hover {
              background: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="bom-pdf">
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <div class="company-name">MECH·ERP</div>
              <div class="company-details">
                Manufacturing Enterprise<br>
                Bill of Materials Documentation
              </div>
            </div>
            <div class="header-right">
              <div class="revision-badge">
                Revision ${revision_no || 'N/A'}
                ${is_current ? '<span class="current-badge">CURRENT</span>' : ''}
              </div>
            </div>
          </div>
          
          <!-- Document Title -->
          <div class="document-title">
            BILL OF MATERIALS (BOM)
          </div>
          
          <!-- Basic Information -->
          <div class="info-section">
            <div class="section-title">Basic Information</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">BOM ID:</div>
                <div class="info-value">${bom_id || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">BOM Version:</div>
                <div class="info-value">${bom_version || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">BOM Type:</div>
                <div class="info-value">${bom_type || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Revision ID:</div>
                <div class="info-value">${revision_id || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Created At:</div>
                <div class="info-value">${formatDate(created_at)}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Created By:</div>
                <div class="info-value">${createdByName}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Change Description:</div>
                <div class="info-value">${change_description || 'No description provided'}</div>
              </div>
            </div>
          </div>
          
          <!-- Parent Item Information -->
          <div class="info-section">
            <div class="section-title">Parent Item Information</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">Part Number:</div>
                <div class="info-value">${parent_item?.part_no || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Part Description:</div>
                <div class="info-value">${parent_item?.part_description || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Drawing Number:</div>
                <div class="info-value">${parent_item?.drawing_no || '-'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Item Revision:</div>
                <div class="info-value">${parent_item?.revision_no || '-'}</div>
              </div>
            </div>
          </div>
          
          <!-- Production Parameters -->
          <div class="info-section">
            <div class="section-title">Production Parameters</div>
            <div class="params-grid">
              <div class="param-item">
                <div class="param-label">Batch Size</div>
                <div class="param-value">${batch_size || 1} units</div>
              </div>
              <div class="param-item">
                <div class="param-label">Yield Percentage</div>
                <div class="param-value">${yield_percent || 100}%</div>
              </div>
              <div class="param-item">
                <div class="param-label">Setup Time</div>
                <div class="param-value">${setup_time_min || 0} minutes</div>
              </div>
              <div class="param-item">
                <div class="param-label">Cycle Time</div>
                <div class="param-value">${cycle_time_min || 0} minutes</div>
              </div>
              <div class="param-item">
                <div class="param-label">Total Components</div>
                <div class="param-value">${totalComponents}</div>
              </div>
              <div class="param-item">
                <div class="param-label">Total Quantity</div>
                <div class="param-value">${totalQuantity}</div>
              </div>
            </div>
          </div>
          
          <!-- Components List -->
          <div class="info-section">
            <div class="section-title">Components List</div>
            ${formattedComponents.length === 0 ? 
              '<p style="text-align: center; padding: 20px;">No components found for this BOM.</p>' :
              `
              <table class="bom-table">
                <thead>
                  <tr>
                    <th style="width:5%">#</th>
                    <th style="width:8%">Level</th>
                    <th style="width:20%">Part Number</th>
                    <th style="width:30%">Description</th>
                    <th style="width:10%">Quantity</th>
                    <th style="width:8%">Unit</th>
                    <th style="width:7%">Scrap %</th>
                    <th style="width:12%">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  ${formattedComponents.map((comp, index) => `
                    <tr>
                      <td class="text-center">${index + 1}</td>
                      <td class="text-center">${comp.level}</td>
                      <td>${comp.part_no}</td>
                      <td>${comp.description}</td>
                      <td class="text-right">${comp.quantity}</td>
                      <td class="text-center">${comp.unit}</td>
                      <td class="text-center">${comp.scrap_percent}%</td>
                      <td>${comp.reference_designator}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
          
          <!-- Remarks if any -->
          ${formattedComponents.some(comp => comp.remarks && comp.remarks !== '-') ? `
          <div class="info-section">
            <div class="section-title">Remarks</div>
            <table class="bom-table">
              <thead>
                <tr>
                  <th style="width:30%">Part Number</th>
                  <th style="width:70%">Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${formattedComponents.filter(comp => comp.remarks && comp.remarks !== '-').map(comp => `
                  <tr>
                    <td>${comp.part_no}</td>
                    <td>${comp.remarks}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          <!-- Footer Information -->
          <div class="footer">
            <div>This is a computer-generated document and does not require a physical signature.</div>
            <div>Snapshot taken at: ${formatDate(snapshot_data?.snapshot_taken_at)}</div>
            <div>Generated on: ${formatDate(new Date().toISOString())}</div>
          </div>
          
          <!-- Signature Section -->
          <div class="signature-section">
            <div class="signature-line">
              <div class="line"></div>
              <div class="label">Prepared By</div>
            </div>
            <div class="signature-line">
              <div class="line"></div>
              <div class="label">Checked By</div>
            </div>
            <div class="signature-line">
              <div class="line"></div>
              <div class="label">Approved By</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleDownloadPdf = async () => {
    if (!selectedRevision) {
      setError('Please select a revision to download');
      return;
    }

    setDownloading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setDownloading(false);
        return;
      }

      console.log('Fetching BOM data for revision:', selectedRevision.revision_no);
      
      // First fetch the BOM data for the selected revision
      const bomResponse = await axios({
        method: 'get',
        url: `${BASE_URL}/api/boms/${bomId}/revisions/${selectedRevision.revision_no}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('BOM API Response:', bomResponse.data);
      
      if (bomResponse.data.success && bomResponse.data.data) {
        const revisionData = bomResponse.data.data;
        
        // Validate that snapshot_data and components exist
        if (!revisionData.snapshot_data) {
          console.error('Snapshot data is missing:', revisionData);
          setError('Invalid BOM data structure: snapshot_data missing');
          setDownloading(false);
          return;
        }
        
        if (!revisionData.snapshot_data.components || !Array.isArray(revisionData.snapshot_data.components)) {
          console.error('Components data is missing or invalid:', revisionData.snapshot_data.components);
          setError('No components found for this BOM revision');
          setDownloading(false);
          return;
        }
        
        // Generate HTML content
        const htmlContent = generateBOMHTML(revisionData);
        
        // Create a new window for printing/PDF generation
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          setError('Popup blocked. Please allow popups for this site.');
          setDownloading(false);
          return;
        }
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load then print/save as PDF
        printWindow.onload = () => {
          printWindow.print();
          setDownloading(false);
        };
        
        // Handle case where print is cancelled
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      } else {
        setError(bomResponse.data.message || 'Failed to fetch BOM data');
        setDownloading(false);
      }
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      console.error('Error details:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 404) {
        setError('BOM data not found for this revision.');
      } else if (err.response?.status === 500) {
        setError('Server error while fetching BOM data. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to generate PDF. Please try again.');
      }
      setDownloading(false);
    }
  };

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

  const getRevisionStatusColor = (isCurrent, hasPdf) => {
    if (isCurrent) return { bg: `${COLORS.primary}15`, color: COLORS.primary, label: 'Current' };
    if (hasPdf) return { bg: `${COLORS.success}15`, color: COLORS.success, label: 'PDF Available' };
    return { bg: `${COLORS.warning}15`, color: COLORS.warning, label: 'No PDF' };
  };

  const handleClose = () => {
    if (!downloading && !loading) {
      setRevisions([]);
      setSelectedRevisionNo('');
      setSelectedRevision(null);
      setRevisionsData(null);
      setError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: COLORS.background.white
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PdfIcon sx={{ color: '#EF4444', fontSize: '1.2rem' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Download BOM PDF
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small" disabled={downloading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* BOM Information */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: COLORS.primary, 
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <DescriptionIcon sx={{ fontSize: '0.9rem' }} />
              BOM Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  BOM ID
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {bomData?.bom_id || revisionsData?.bom_id || bomId}
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Parent Item
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary }}>
                  {bomData?.parent_part_no || revisionsData?.parent_part_no || 'N/A'}
                </Typography>
              </Grid>
              
              {revisionsData && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Current Revision
                    </Typography>
                    <Chip
                      label={`v${revisionsData.current_revision}`}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: COLORS.primaryLight,
                        color: COLORS.primary
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Total Revisions
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      {revisionsData.total_revisions}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>

          {/* Revision Selection */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.white, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: COLORS.primary, 
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <HistoryIcon sx={{ fontSize: '0.9rem' }} />
              Select Revision
            </Typography>
            
            {revisionsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, ml: 2 }}>
                  Loading revisions...
                </Typography>
              </Box>
            ) : revisions.length === 0 ? (
              <Alert 
                severity="warning" 
                sx={{ 
                  borderRadius: 1.5,
                  fontSize: '0.75rem'
                }}
              >
                No revisions found for this BOM.
              </Alert>
            ) : (
              <>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Select Revision</InputLabel>
                  <Select
                    value={selectedRevisionNo}
                    onChange={handleRevisionChange}
                    label="Select Revision"
                    sx={{ 
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': {
                        py: 1
                      }
                    }}
                  >
                    {revisions.map((rev) => {
                      const status = getRevisionStatusColor(rev.is_current, rev.has_pdf);
                      return (
                        <MenuItem 
                          key={rev.revision_no} 
                          value={rev.revision_no.toString()}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                            <Typography sx={{ fontWeight: 500 }}>
                              Revision {rev.revision_no}
                            </Typography>
                            <Chip
                              label={status.label}
                              size="small"
                              sx={{ 
                                fontSize: '0.6rem',
                                height: 20,
                                bgcolor: status.bg,
                                color: status.color
                              }}
                            />
                          </Stack>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                
                {selectedRevision && (
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Divider sx={{ borderColor: COLORS.border }} />
                    
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Revision Details
                    </Typography>
                    
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <DateRangeIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            Created At:
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            {formatDate(selectedRevision.created_at)}
                          </Typography>
                        </Stack>
                      </Grid>
                      
                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                          Change Description:
                        </Typography>
                        <Paper sx={{ 
                          p: 1, 
                          bgcolor: COLORS.background.light, 
                          borderRadius: 1,
                          border: `1px solid ${COLORS.border}`
                        }}>
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            {selectedRevision.change_description || 'No description provided'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Stack>
                )}
              </>
            )}
          </Paper>

          {/* Info Alert */}
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 1.5,
              fontSize: '0.7rem'
            }}
          >
            <Typography sx={{ fontSize: '0.7rem' }}>
              <strong>PDF Content:</strong> The PDF will include complete BOM details including components, quantities, production parameters, and revision history.
            </Typography>
          </Alert>

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
          onClick={handleClose}
          disabled={downloading}
          size="small"
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
          onClick={handleDownloadPdf}
          disabled={downloading || !selectedRevision || revisionsLoading}
          size="small"
          startIcon={downloading ? <CircularProgress size={16} /> : <DownloadIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark },
            '&.Mui-disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {downloading ? 'Generating...' : 'Generate & Download PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadPdf;