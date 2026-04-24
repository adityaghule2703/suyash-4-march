// ViewCapa.jsx
import React, { useState, useEffect } from 'react';
import {
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
  Divider,
  IconButton,
  Avatar,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  Close as CloseIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandMoreIcon,
  Verified as VerifiedIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import axios from 'axios';
import BASE_URL from "../../../config/Config";

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
  severity: {
    Critical: '#EF4444',
    Major: '#F59E0B',
    Minor: '#10B981'
  },
  status: {
    'Open': '#F59E0B',
    'In Progress': '#3B82F6',
    'Under Review': '#8B5CF6',
    'Effectiveness Under Review': '#06B6D4',
    'Closed': '#10B981',
    'Overdue': '#EF4444'
  },
  actionStatus: {
    'Pending': '#F59E0B',
    'In Progress': '#3B82F6',
    'Completed': '#10B981',
    'Cancelled': '#EF4444'
  }
};

// Steps for stepper
const steps = [
  'CAPA Information',
  'Actions & Root Cause',
  'Effectiveness & Audit'
];

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

const ViewCapa = ({ open, onClose, capaId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [capaData, setCapaData] = useState(null);

  useEffect(() => {
    if (open && capaId) {
      fetchCapaDetails();
    }
  }, [open, capaId]);

  const fetchCapaDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/capas/${capaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCapaData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch CAPA details');
      }
    } catch (err) {
      console.error('Error fetching CAPA details:', err);
      setError(err.response?.data?.message || 'Failed to fetch CAPA details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch (e) {
      return '-';
    }
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return '-';
    }
  };

  const getStatusColor = (status) => {
    return COLORS.status[status] || COLORS.text.secondary;
  };

  const getActionStatusColor = (status) => {
    return COLORS.actionStatus[status] || COLORS.text.secondary;
  };

  const getCapaInitials = (capaId) => {
    if (!capaId) return 'CP';
    const parts = capaId.split('-');
    if (parts.length >= 2) {
      return `${parts[0]}${parts[1]}`.toUpperCase();
    }
    return capaId.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = () => {
    return COLORS.primary;
  };

  const getActionTypeIcon = (actionType) => {
    switch(actionType) {
      case 'Immediate':
        return <WarningIcon sx={{ fontSize: '0.8rem' }} />;
      case 'Short-Term':
        return <TimelineIcon sx={{ fontSize: '0.8rem' }} />;
      case 'Long-Term':
        return <BuildIcon sx={{ fontSize: '0.8rem' }} />;
      case 'Preventive':
        return <VerifiedIcon sx={{ fontSize: '0.8rem' }} />;
      default:
        return <AssignmentIcon sx={{ fontSize: '0.8rem' }} />;
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    if (!capaData) return null;

    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Status Banner */}
            <Paper sx={{ 
              p: 1.5, 
              bgcolor: capaData.status === 'Closed' ? COLORS.primaryLight : COLORS.background.light,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {capaData.status === 'Closed' ? (
                  <CheckCircleIcon sx={{ color: '#065f46', fontSize: '1.2rem' }} />
                ) : capaData.status === 'Overdue' ? (
                  <WarningIcon sx={{ color: COLORS.status.Overdue, fontSize: '1.2rem' }} />
                ) : (
                  <BuildIcon sx={{ color: getStatusColor(capaData.status), fontSize: '1.2rem' }} />
                )}
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: capaData.status === 'Closed' ? '#065f46' : getStatusColor(capaData.status) }}>
                  {capaData.status}
                </Typography>
              </Stack>
              {capaData.ncr_id && (
                <Tooltip title="Linked NCR">
                  <Chip
                    icon={<LinkIcon sx={{ fontSize: '0.7rem' }} />}
                    label={capaData.ncr_id?.ncr_number || 'NCR Linked'}
                    size="small"
                    sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                  />
                </Tooltip>
              )}
            </Paper>

            {/* Header Section */}
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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                CAPA Header
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>CAPA Number</Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                        {capaData.capa_id}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>CAPA Type</Typography>
                      <Chip
                        label={capaData.capa_type}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 500,
                          bgcolor: `${COLORS.primary}15`,
                          color: COLORS.primary
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Source:</Typography>
                    <Chip
                      label={capaData.source}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 500,
                        bgcolor: `${COLORS.primary}15`,
                        color: COLORS.primary
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Basic Information */}
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
                <CategoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created Date</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formatDate(capaData.createdAt)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Target Close Date</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formatDateOnly(capaData.target_close_date)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Assigned To</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {capaData.assigned_to?.Username || capaData.assigned_to?.name || 'Not Assigned'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Quantity Affected</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {capaData.quantity_affected || 0} units
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer Impact</Typography>
                  <Chip
                    label={capaData.customer_impact ? 'Yes' : 'No'}
                    size="small"
                    color={capaData.customer_impact ? 'warning' : 'success'}
                    sx={{ fontSize: '0.65rem', height: 22, mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Problem Statement */}
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
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Problem Statement
              </Typography>
              <Paper sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                  {capaData.problem_statement || 'No description provided'}
                </Typography>
              </Paper>
            </Paper>

            {/* Linked NCR Information (if source is NCR) */}
            {capaData.source === 'NCR' && capaData.ncr_id && (
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
                  <LinkIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Linked NCR Information
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>NCR Number</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, fontFamily: 'monospace' }}>
                      {capaData.ncr_id.ncr_number}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Severity</Typography>
                    <Chip
                      label={capaData.ncr_id.severity}
                      size="small"
                      sx={{ 
                        fontSize: '0.65rem', 
                        height: 22,
                        bgcolor: `${COLORS.severity[capaData.ncr_id.severity]}20`,
                        color: COLORS.severity[capaData.ncr_id.severity]
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      {capaData.ncr_id.part_no}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>NCR Status</Typography>
                    <Chip
                      label={capaData.ncr_id.status}
                      size="small"
                      sx={{ fontSize: '0.65rem', height: 22 }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Root Cause Analysis */}
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
                <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Root Cause Analysis
              </Typography>
              <Paper sx={{ 
                p: 1.5, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {capaData.root_cause || 'No root cause recorded'}
                </Typography>
              </Paper>
            </Paper>

            {/* Corrective Actions */}
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
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Corrective Actions ({capaData.corrective_actions?.length || 0})
              </Typography>
              
              {capaData.corrective_actions && capaData.corrective_actions.length > 0 ? (
                <Stack spacing={1.5}>
                  {capaData.corrective_actions.map((action, idx) => (
                    <Accordion key={idx} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 1.5 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.8rem' }} />}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                          <Box sx={{ color: getActionStatusColor(action.status) }}>
                            {getActionTypeIcon(action.action_type)}
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, flex: 1 }}>
                            {action.action_description?.substring(0, 100)}...
                          </Typography>
                          <Chip
                            label={action.status}
                            size="small"
                            sx={{ 
                              fontSize: '0.6rem', 
                              height: 20,
                              bgcolor: `${getActionStatusColor(action.status)}20`,
                              color: getActionStatusColor(action.status)
                            }}
                          />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Action Type</Typography>
                              <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{action.action_type}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Target Date</Typography>
                              <Typography sx={{ fontSize: '0.7rem' }}>{formatDateOnly(action.target_date)}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Responsible Person</Typography>
                              <Typography sx={{ fontSize: '0.7rem' }}>
                                {action.responsible_person_id?.Username || action.responsible_person_id?.name || 'Not Assigned'}
                              </Typography>
                            </Grid>
                            {action.completion_date && (
                              <Grid size={{ xs: 12 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Completion Date</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.success }}>
                                  {formatDate(action.completion_date)}
                                </Typography>
                              </Grid>
                            )}
                            {action.verification_notes && (
                              <Grid size={{ xs: 12 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Verification Notes</Typography>
                                <Paper sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                                  <Typography sx={{ fontSize: '0.7rem' }}>{action.verification_notes}</Typography>
                                </Paper>
                              </Grid>
                            )}
                          </Grid>
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No corrective actions recorded
                </Typography>
              )}
            </Paper>

            {/* Preventive Actions */}
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
                <VerifiedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Preventive Actions ({capaData.preventive_actions?.length || 0})
              </Typography>
              
              {capaData.preventive_actions && capaData.preventive_actions.length > 0 ? (
                <Stack spacing={1.5}>
                  {capaData.preventive_actions.map((action, idx) => (
                    <Accordion key={idx} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 1.5 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.8rem' }} />}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                          <Box sx={{ color: getActionStatusColor(action.status) }}>
                            {getActionTypeIcon(action.action_type)}
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, flex: 1 }}>
                            {action.action_description?.substring(0, 100)}...
                          </Typography>
                          <Chip
                            label={action.status}
                            size="small"
                            sx={{ 
                              fontSize: '0.6rem', 
                              height: 20,
                              bgcolor: `${getActionStatusColor(action.status)}20`,
                              color: getActionStatusColor(action.status)
                            }}
                          />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Action Type</Typography>
                              <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{action.action_type}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Target Date</Typography>
                              <Typography sx={{ fontSize: '0.7rem' }}>{formatDateOnly(action.target_date)}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Responsible Person</Typography>
                              <Typography sx={{ fontSize: '0.7rem' }}>
                                {action.responsible_person_id?.Username || action.responsible_person_id?.name || 'Not Assigned'}
                              </Typography>
                            </Grid>
                            {action.completion_date && (
                              <Grid size={{ xs: 12 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Completion Date</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.success }}>
                                  {formatDate(action.completion_date)}
                                </Typography>
                              </Grid>
                            )}
                            {action.verification_notes && (
                              <Grid size={{ xs: 12 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Verification Notes</Typography>
                                <Paper sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                                  <Typography sx={{ fontSize: '0.7rem' }}>{action.verification_notes}</Typography>
                                </Paper>
                              </Grid>
                            )}
                          </Grid>
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No preventive actions recorded
                </Typography>
              )}
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {/* Effectiveness Review */}
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
                <VerifiedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Effectiveness Review
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Review Date</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {formatDate(capaData.effectiveness_review_date) || 'Not reviewed yet'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effectiveness Verified</Typography>
                  <Chip
                    label={capaData.effectiveness_verified ? 'Yes' : 'No'}
                    size="small"
                    color={capaData.effectiveness_verified ? 'success' : 'warning'}
                    sx={{ fontSize: '0.65rem', height: 22, mt: 0.5 }}
                  />
                </Grid>
                {capaData.effectiveness_criteria && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effectiveness Criteria</Typography>
                    <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem' }}>{capaData.effectiveness_criteria}</Typography>
                    </Paper>
                  </Grid>
                )}
                {capaData.effectiveness_evidence && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effectiveness Evidence</Typography>
                    <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem' }}>{capaData.effectiveness_evidence}</Typography>
                    </Paper>
                  </Grid>
                )}
                {capaData.effectiveness_notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effectiveness Notes</Typography>
                    <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem' }}>{capaData.effectiveness_notes}</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Audit Information */}
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
                <TimelineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Audit Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {capaData.created_by?.Username || capaData.created_by?.name || 'System'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(capaData.createdAt)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Closed By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {capaData.closed_by?.Username || capaData.closed_by?.name || 'Not Closed'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Closed At</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(capaData.closed_at) || 'Not closed'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {capaData.updated_by?.Username || capaData.updated_by?.name || 'System'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated At</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(capaData.updatedAt)}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Completion Summary */}
            {capaData.status === 'Closed' && (
              <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  CAPA closed successfully. All actions have been verified and effectiveness confirmed.
                </Typography>
              </Alert>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

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
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: getAvatarColor(),
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            {capaData ? getCapaInitials(capaData.capa_id) : 'CP'}
          </Avatar>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            CAPA Details
          </Typography>
          {capaData && (
            <Chip 
              label={capaData.capa_id} 
              size="small" 
              sx={{ 
                fontSize: '0.65rem', 
                height: 22, 
                bgcolor: COLORS.primaryLight, 
                color: COLORS.primary,
                ml: 1,
                fontFamily: 'monospace'
              }} 
            />
          )}
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading CAPA details...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        ) : capaData ? (
          renderStepContent(activeStep)
        ) : null}
      </DialogContent>

      {/* Footer */}
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

export default ViewCapa;