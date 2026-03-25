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

export const STATUS_COLORS = {
  Pending: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  Approved: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Rejected: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Draft: { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  Active: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Inactive: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
};

export const PRIORITY_COLORS = {
  High: { bg: '#FEF3C7', color: '#D97706' },
  Medium: { bg: '#E0E7FF', color: '#4F46E5' },
  Low: { bg: '#D1FAE5', color: '#059669' }
};

export const BOM_STATUS_TRANSITIONS = {
  Draft: ['Pending'],
  Pending: ['Approved', 'Rejected'],
  Approved: [],
  Rejected: ['Draft', 'Pending']
};

export const TERMINAL_STATUSES = ['Approved', 'Rejected'];

export const BOM_TYPE_OPTIONS = ['Manufacturing', 'Engineering', 'Service', 'Sales'];

export const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece', 'Liter', 'Hour', 'Box'];

export const ITEM_ROLES = {
  PARENT: 'parent',
  COMPONENT: 'component'
};

export const ITEM_CATEGORIES = {
  RAW_MATERIAL: 'Raw Material',
  FINISHED_GOOD: 'Finished Good',
  SEMI_FINISHED: 'Semi Finished',
  CONSUMABLE: 'Consumable',
  TOOL: 'Tool'
};

export const PROCUREMENT_TYPES = {
  MANUFACTURE: 'Manufacture',
  PURCHASE: 'Purchase',
  SUBCONTRACT: 'Subcontract'
};