// constants.jsx
export const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  primaryHover: '#0A4D51',
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
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

export const STATUS_COLORS = {
  Pending: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  Approved: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Rejected: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Draft: { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  Active: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  Cancelled: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Archived: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
};

export const BOM_TABS = [
  { value: 'bom', label: 'BOM', icon: 'Inventory', color: '#063C3F' },
  { value: 'revisions', label: 'BOM Revisions', icon: 'History', color: '#7B1FA2' },
  { value: 'costing', label: 'BOM Costing', icon: 'AttachMoney', color: '#E65100' }
];