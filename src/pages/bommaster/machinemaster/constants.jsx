// constants.js
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

// Machine Type Options
export const MACHINE_TYPE_OPTIONS = [
  'Press',
  'CNC',
  'Lathe',
  'Milling',
  'Drilling',
  'Grinding',
  'Welding',
  'Bending',
  'Laser Cutting',
  'Plating',
  'Assembly',
  'Inspection',
  'Other'
];

// Machine Type Colors
export const MACHINE_TYPE_COLORS = {
  Press: { bg: '#FEF3C7', color: '#D97706' },
  CNC: { bg: '#DBEAFE', color: '#1E40AF' },
  Lathe: { bg: '#E0E7FF', color: '#4F46E5' },
  Milling: { bg: '#D1FAE5', color: '#059669' },
  Drilling: { bg: '#FEE2E2', color: '#DC2626' },
  Grinding: { bg: '#FEF3C7', color: '#92400E' },
  Welding: { bg: '#FFE4E6', color: '#BE123C' },
  Bending: { bg: '#E0F2FE', color: '#0369A1' },
  'Laser Cutting': { bg: '#E9F5E9', color: '#2E7D32' },
  Plating: { bg: '#F3E5F5', color: '#7B1FA2' },
  Assembly: { bg: '#FFF3E0', color: '#ED6C02' },
  Inspection: { bg: '#E8EAF6', color: '#283593' },
  Other: { bg: '#F1F5F9', color: '#475569' }
};

// Capacity Unit Options
export const CAPACITY_UNIT_OPTIONS = [
  'Ton',
  'kW',
  'mm',
  'SPM',
  'RPM',
  'Liters',
  'None'
];

// Machine Status Options
export const MACHINE_STATUS_OPTIONS = [
  'Active',
  'Idle',
  'Under Maintenance',
  'Breakdown',
  'Decommissioned'
];

// Machine Status Colors
export const MACHINE_STATUS_COLORS = {
  Active: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Idle: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Under Maintenance': { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  Breakdown: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Decommissioned: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
};

// Machine Status Transitions
export const MACHINE_STATUS_TRANSITIONS = {
  'Active': ['Idle', 'Under Maintenance', 'Breakdown'],
  'Idle': ['Active', 'Under Maintenance', 'Breakdown'],
  'Under Maintenance': ['Active', 'Idle', 'Breakdown'],
  'Breakdown': ['Under Maintenance', 'Decommissioned'],
  'Decommissioned': []
};

// Helper function to get machine type color
export const getMachineTypeColor = (type) => {
  return MACHINE_TYPE_COLORS[type] || { bg: '#F1F5F9', color: '#475569' };
};

// Helper function to get machine status color
export const getMachineStatusColor = (status) => {
  return MACHINE_STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
};

// Helper function to get status icon
export const getMachineStatusIcon = (status) => {
  const icons = {
    'Active': '✅',
    'Idle': '⏸️',
    'Under Maintenance': '🔧',
    'Breakdown': '❌',
    'Decommissioned': '⚰️'
  };
  return icons[status] || '📊';
};

// Helper function to get type icon
export const getMachineTypeIcon = (type) => {
  const icons = {
    'Press': '🔨',
    'CNC': '⚙️',
    'Lathe': '🔄',
    'Milling': '🔩',
    'Drilling': '🔧',
    'Grinding': '⭕',
    'Welding': '🔥',
    'Bending': '📐',
    'Laser Cutting': '⚡',
    'Plating': '🔋',
    'Assembly': '🔨',
    'Inspection': '🔍',
    'Other': '📦'
  };
  return icons[type] || '🖥️';
};

// Helper function to format machine capacity
export const formatMachineCapacity = (value, unit) => {
  if (!value && value !== 0) return '-';
  if (unit === 'None') return `${value}`;
  return `${value} ${unit}`;
};

// Helper function to calculate total available hours per day
export const calculateTotalHoursPerDay = (shiftsPerDay, hoursPerShift) => {
  return (shiftsPerDay || 0) * (hoursPerShift || 0);
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to format datetime
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

// Helper function to calculate OEE
export const calculateOEE = (availability, performance, quality) => {
  if (!availability || !performance || !quality) return 0;
  return (availability * performance * quality) / 10000;
};

// Helper function to calculate utilization percentage
export const calculateUtilization = (actualHours, availableHours) => {
  if (!availableHours || availableHours === 0) return 0;
  return (actualHours / availableHours) * 100;
};

// Machine Categories for grouping
export const MACHINE_CATEGORIES = {
  'Metal Forming': ['Press', 'Bending'],
  'Metal Cutting': ['CNC', 'Lathe', 'Milling', 'Drilling', 'Grinding'],
  'Surface Treatment': ['Plating', 'Welding'],
  'Finishing': ['Laser Cutting'],
  'Assembly': ['Assembly'],
  'Quality': ['Inspection'],
  'Other': ['Other']
};

// Priority Colors (if needed for scheduling)
export const PRIORITY_COLORS = {
  High: { bg: '#FEF3C7', color: '#D97706' },
  Medium: { bg: '#E0E7FF', color: '#4F46E5' },
  Low: { bg: '#D1FAE5', color: '#059669' }
};

// Priority Options
export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

// Maintenance Types
export const MAINTENANCE_TYPES = [
  'Preventive',
  'Corrective',
  'Predictive',
  'Breakdown',
  'Scheduled'
];

// Shift Options
export const SHIFT_OPTIONS = [
  'Morning Shift (6:00 - 14:00)',
  'Afternoon Shift (14:00 - 22:00)',
  'Night Shift (22:00 - 6:00)',
  'General Shift (8:00 - 17:00)'
];

// Machine Constants for the module
export const MACHINE_CONSTANTS = {
  MODULE_NAME: 'Machine Master',
  MODULE_CODE: 'MCH',
  DATE_FORMAT: 'YYYY-MM-DD',
  DEFAULT_STATUS: 'Active',
  DEFAULT_CAPACITY_UNIT: 'None',
  DEFAULT_SHIFTS_PER_DAY: 1,
  DEFAULT_HOURS_PER_SHIFT: 8,
  DEFAULT_OEE_TARGET: 75,
  SHIFT_OPTIONS: SHIFT_OPTIONS,
  MAINTENANCE_TYPES: MAINTENANCE_TYPES,
  MACHINE_TYPE_OPTIONS: MACHINE_TYPE_OPTIONS,
  MACHINE_STATUS_OPTIONS: MACHINE_STATUS_OPTIONS,
  CAPACITY_UNIT_OPTIONS: CAPACITY_UNIT_OPTIONS,
  STATUS_TRANSITIONS: MACHINE_STATUS_TRANSITIONS,
  STATUS_COLORS: MACHINE_STATUS_COLORS,
  TYPE_COLORS: MACHINE_TYPE_COLORS
};

// Report Types
export const REPORT_TYPES = {
  CAPACITY: 'Capacity Report',
  UTILIZATION: 'Utilization Report',
  OEE: 'OEE Report',
  MAINTENANCE: 'Maintenance Report',
  DOWNTIME: 'Downtime Report'
};

// Export for dashboard statistics
export const getMachineStatistics = (machines) => {
  const total = machines.length;
  const active = machines.filter(m => m.status === 'Active').length;
  const idle = machines.filter(m => m.status === 'Idle').length;
  const underMaintenance = machines.filter(m => m.status === 'Under Maintenance').length;
  const breakdown = machines.filter(m => m.status === 'Breakdown').length;
  const decommissioned = machines.filter(m => m.status === 'Decommissioned').length;
  
  const totalCapacity = machines.reduce((sum, m) => sum + (m.capacity_value || 0), 0);
  const avgOEE = machines.reduce((sum, m) => sum + (m.oee_target_percent || 0), 0) / (total || 1);
  
  return {
    total,
    active,
    idle,
    underMaintenance,
    breakdown,
    decommissioned,
    totalCapacity,
    avgOEE: Math.round(avgOEE)
  };
};

// Machine Health Status
export const MACHINE_HEALTH_STATUS = {
  EXCELLENT: { label: 'Excellent', color: '#059669', threshold: 90 },
  GOOD: { label: 'Good', color: '#10B981', threshold: 75 },
  AVERAGE: { label: 'Average', color: '#F59E0B', threshold: 60 },
  POOR: { label: 'Poor', color: '#EF4444', threshold: 40 },
  CRITICAL: { label: 'Critical', color: '#DC2626', threshold: 0 }
};

// Helper function to get machine health based on OEE
export const getMachineHealth = (oee) => {
  if (oee >= MACHINE_HEALTH_STATUS.EXCELLENT.threshold) return MACHINE_HEALTH_STATUS.EXCELLENT;
  if (oee >= MACHINE_HEALTH_STATUS.GOOD.threshold) return MACHINE_HEALTH_STATUS.GOOD;
  if (oee >= MACHINE_HEALTH_STATUS.AVERAGE.threshold) return MACHINE_HEALTH_STATUS.AVERAGE;
  if (oee >= MACHINE_HEALTH_STATUS.POOR.threshold) return MACHINE_HEALTH_STATUS.POOR;
  return MACHINE_HEALTH_STATUS.CRITICAL;
};