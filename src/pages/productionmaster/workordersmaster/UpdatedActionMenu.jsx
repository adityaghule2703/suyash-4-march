// ActionMenu.jsx
import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Typography,
  IconButton
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MonetizationOn as JobCostingIcon,
  Receipt as JobCardIcon,
  Timeline as TimelineIcon,
  RocketLaunch as RocketLaunchIcon,
  Block as BlockIcon,
  PlayCircleOutline as StartIcon,
  Settings as SettingsIcon,
  PauseCircleOutline as HoldIcon,
  Replay as ResumeIcon,
  TaskAlt as CompleteOpIcon,
  FactCheck as CompleteWOIcon,
  WorkHistory as LabourIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#063C3F',
  text: {
    primary: '#151C26',
    secondary: '#4B5568'
  }
};

const ActionMenu = ({ 
  item, 
  anchorEl, 
  onOpen, 
  onClose, 
  onView, 
  onEdit, 
  onRelease, 
  onCancel, 
  onHold, 
  onStart, 
  onResume, 
  onCompleteOp, 
  onCompleteWO, 
  onLabour, 
  onOperations, 
  onJobCosting, 
  onJobCard, 
  onTimeline 
}) => {
  const isPlanned = item?.status === 'Planned';
  const isReleased = item?.status === 'Released';
  const isOnHold = item?.status === 'On Hold';
  const isInProgress = item?.status === 'In Progress';
  const isPartiallyCompleted = item?.status === 'Partially Completed';
  
  const menuItem = (onClick, icon, label, color = COLORS.text.primary, disabled = false, tooltipMsg = '') => {
    const el = (
      <MenuItem 
        onClick={() => { if (!disabled) { onClick(); onClose(); } }} 
        sx={{ 
          py: 1.5, 
          opacity: disabled ? 0.4 : 1, 
          cursor: disabled ? 'not-allowed' : 'pointer', 
          pointerEvents: disabled ? 'none' : 'auto' 
        }}
      >
        <ListItemIcon sx={{ color, minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText>
          <Typography variant="body2" fontWeight={500} sx={{ color, fontSize: '0.75rem' }}>
            {label}
          </Typography>
        </ListItemText>
      </MenuItem>
    );
    return disabled && tooltipMsg ? 
      <Tooltip key={label} title={tooltipMsg} placement="left">{el}</Tooltip> : 
      <React.Fragment key={label}>{el}</React.Fragment>;
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton 
          size="small" 
          onClick={onOpen} 
          sx={{ 
            color: COLORS.text.secondary, 
            '&:hover': { bgcolor: `${COLORS.primary}20` } 
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={onClose} 
        PaperProps={{ 
          elevation: 3, 
          sx: { 
            mt: 1, 
            minWidth: 220, 
            borderRadius: 2, 
            border: `1px solid #E3E8EF`, 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
          } 
        }}
      >
        {menuItem(() => onView(item), <ViewIcon fontSize="small" />, 'View details')}
        {menuItem(() => onEdit(item), <EditIcon fontSize="small" />, 'Edit')}
        
        <Divider sx={{ my: 0.5, borderColor: '#E3E8EF' }} />
        
        {menuItem(() => onJobCosting(item), <JobCostingIcon fontSize="small" />, 'Job Costing', '#8B5CF6')}
        {menuItem(() => onJobCard(item), <JobCardIcon fontSize="small" />, 'Job Card', '#F59E0B')}
        {menuItem(() => onTimeline(item), <TimelineIcon fontSize="small" />, 'Timeline', COLORS.primary)}
        
        <Divider sx={{ my: 0.5, borderColor: '#E3E8EF' }} />
        
        {isPlanned && menuItem(() => onRelease(item), <RocketLaunchIcon fontSize="small" />, 'Release Work Order', '#059669')}
        {isPlanned && menuItem(() => onCancel(item), <BlockIcon fontSize="small" />, 'Cancel Work Order', '#DC2626')}
        
        {isReleased && menuItem(() => onStart(item), <StartIcon fontSize="small" />, 'Start', '#059669')}
        {isReleased && menuItem(() => onOperations(item), <SettingsIcon fontSize="small" />, 'Operations', COLORS.primary)}
        
        {isOnHold && menuItem(() => onResume(item), <ResumeIcon fontSize="small" />, 'Resume Work Order', '#059669')}
        {isInProgress && menuItem(() => onHold(item), <HoldIcon fontSize="small" />, 'Hold Work Order', '#D97706')}
        {isInProgress && menuItem(() => onCompleteOp(item), <CompleteOpIcon fontSize="small" />, 'Complete Operation', '#8B5CF6')}
        {isInProgress && menuItem(() => onCompleteWO(item), <CompleteWOIcon fontSize="small" />, 'Complete Work Order', '#059669')}
        {isInProgress && menuItem(() => onLabour(item), <LabourIcon fontSize="small" />, 'Labour Entry', '#F59E0B')}
        {isPartiallyCompleted && menuItem(() => onCompleteWO(item), <CompleteWOIcon fontSize="small" />, 'Complete Work Order', '#059669')}
      </Menu>
    </>
  );
};

export default ActionMenu;