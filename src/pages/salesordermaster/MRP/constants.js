// Base Colors
export const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// ==================== MRP Constants ====================

// MRP Run Status Colors
export const MRP_STATUS_COLORS = {
  'Queued': { bg: '#FEF3C7', color: '#92400E', border: '#FBBF24', icon: 'Schedule' },
  'Running': { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD', icon: 'Pending' },
  'Completed': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0', icon: 'CheckCircle' },
  'Failed': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA', icon: 'Error' }
};

// MRP Run Type Colors
export const MRP_RUN_TYPE_COLORS = {
  'Full': { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  'Incremental': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Item-Specific': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' }
};

// MRP Run Types
export const MRP_RUN_TYPES = ['Full', 'Incremental', 'Item-Specific'];

// MRP Status Types
export const MRP_STATUS_TYPES = ['Queued', 'Running', 'Completed', 'Failed'];

// MRP Source Types
export const MRP_SOURCE_TYPES = ['Purchase', 'Manufacture', 'Subcontract', ''];

// MRP Action Types
export const MRP_ACTION_TYPES = ['Create PO', 'Create WO', 'Reschedule', 'No Action'];

// MRP Planning Horizon Options
export const MRP_PLANNING_HORIZON_OPTIONS = [7, 15, 30, 45, 60, 90, 120, 180, 365];

// MRP Default Values
export const MRP_DEFAULTS = {
  PLANNING_HORIZON: 30,
  RUN_TYPE: 'Full',
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
};

// ==================== Helper Functions ====================

// Get MRP status color
export const getMRPStatusColor = (status) => {
  return MRP_STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0', icon: 'Schedule' };
};

// Get MRP run type color
export const getMRPRunTypeColor = (runType) => {
  return MRP_RUN_TYPE_COLORS[runType] || MRP_RUN_TYPE_COLORS['Full'];
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format datetime for display
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format number with commas
export const formatNumber = (number) => {
  if (!number && number !== 0) return '-';
  return new Intl.NumberFormat('en-IN').format(number);
};

// Get status icon name
export const getMRPStatusIcon = (status) => {
  const statusConfig = MRP_STATUS_COLORS[status] || MRP_STATUS_COLORS['Queued'];
  return statusConfig.icon;
};

// Check if MRP run is in progress
export const isMRPRunInProgress = (status) => {
  return status === 'Running' || status === 'Queued';
};

// Check if MRP run is completed
export const isMRPRunCompleted = (status) => {
  return status === 'Completed';
};

// Check if MRP run failed
export const isMRPRunFailed = (status) => {
  return status === 'Failed';
};

// Get MRP run status message
export const getMRPStatusMessage = (status) => {
  const messages = {
    'Queued': 'MRP run is queued and waiting to start',
    'Running': 'MRP run is in progress',
    'Completed': 'MRP run completed successfully',
    'Failed': 'MRP run failed. Please check logs for details'
  };
  return messages[status] || 'Status unknown';
};

// Calculate total requirements from MRP lines
export const calculateTotalRequirements = (mrpLines) => {
  if (!mrpLines || mrpLines.length === 0) return { total: 0, items: {} };
  
  const summary = {};
  let total = 0;
  
  mrpLines.forEach(line => {
    if (line.net_req > 0) {
      const itemCode = line.item_code;
      if (!summary[itemCode]) {
        summary[itemCode] = 0;
      }
      summary[itemCode] += line.net_req;
      total += line.net_req;
    }
  });
  
  return { total, items: summary };
};

// Group MRP runs by status
export const groupMRPRunsByStatus = (runs) => {
  if (!runs) return {};
  
  return runs.reduce((acc, run) => {
    const status = run.status || 'Queued';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(run);
    return acc;
  }, {});
};

// Get MRP run statistics
export const getMRPRunStats = (runs) => {
  if (!runs) {
    return {
      total: 0,
      queued: 0,
      running: 0,
      completed: 0,
      failed: 0,
      totalPRs: 0,
      totalWOs: 0
    };
  }
  
  return {
    total: runs.length,
    queued: runs.filter(r => r.status === 'Queued').length,
    running: runs.filter(r => r.status === 'Running').length,
    completed: runs.filter(r => r.status === 'Completed').length,
    failed: runs.filter(r => r.status === 'Failed').length,
    totalPRs: runs.reduce((sum, r) => sum + (r.pr_count || 0), 0),
    totalWOs: runs.reduce((sum, r) => sum + (r.wo_count || 0), 0)
  };
};

// Export default object for convenience
export const MRP_CONSTANTS = {
  RUN_TYPES: MRP_RUN_TYPES,
  STATUS_TYPES: MRP_STATUS_TYPES,
  SOURCE_TYPES: MRP_SOURCE_TYPES,
  ACTION_TYPES: MRP_ACTION_TYPES,
  PLANNING_HORIZON_OPTIONS: MRP_PLANNING_HORIZON_OPTIONS,
  DEFAULTS: MRP_DEFAULTS,
  STATUS_COLORS: MRP_STATUS_COLORS,
  RUN_TYPE_COLORS: MRP_RUN_TYPE_COLORS
};