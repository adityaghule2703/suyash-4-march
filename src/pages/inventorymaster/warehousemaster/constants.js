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

export const WAREHOUSE_TYPE_OPTIONS = [
  'Raw Material',
  'WIP',
  'Finished Goods',
  'Consumable',
  'Tool',
  'Scrap',
  'Subcontract',
  'Quarantine'
];

export const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece', 'Liter', 'Ton'];

export const getWarehouseTypeColor = (type) => {
  const colors = {
    'Raw Material': { bg: '#E0F2FE', color: '#0369A1' },
    'WIP': { bg: '#FEF3C7', color: '#B45309' },
    'Finished Goods': { bg: '#DCFCE7', color: '#166534' },
    'Consumable': { bg: '#FCE7F3', color: '#BE185D' },
    'Tool': { bg: '#E0E7FF', color: '#3730A3' },
    'Scrap': { bg: '#FEE2E2', color: '#991B1B' },
    'Subcontract': { bg: '#F3E8FF', color: '#6B21A5' },
    'Quarantine': { bg: '#FFEDD5', color: '#9A3412' }
  };
  return colors[type] || { bg: '#F1F5F9', color: '#475569' };
};