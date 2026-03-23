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

export const CUSTOMER_TYPE_COLORS = {
  'OEM': { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
  'Dealer': { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
  'Distributor': { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  'Direct': { bg: '#E0E7FF', color: '#3730A3', border: '#C7D2FE' },
  'Government': { bg: '#FCE7F3', color: '#9D174D', border: '#FBCFE8' },
  'Export': { bg: '#E9F7F0', color: '#0D7C3F', border: '#C8F0D9' },
  'Other': { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
};

export const PRIORITY_COLORS = {
  'Key Account': { bg: '#FEF3C7', color: '#B45309' },
  'Regular': { bg: '#D1FAE5', color: '#065F46' },
  'Prospect': { bg: '#E0F2FE', color: '#0369A1' },
  'Dormant': { bg: '#F1F5F9', color: '#475569' }
};

export const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'JPY'];
export const CUSTOMER_TYPE_OPTIONS = ['OEM', 'Dealer', 'Distributor', 'Direct', 'Government', 'Export', 'Other'];
export const INDUSTRY_SEGMENT_OPTIONS = ['Automotive', 'Electronics', 'Energy', 'Switchgear', 'EV', 'Defence', 'General', ''];
export const PRIORITY_OPTIONS = ['Key Account', 'Regular', 'Prospect', 'Dormant', ''];
export const PAYMENT_TERMS_OPTIONS = ['Advance', 'On Delivery', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Net 90', 'LC', 'Custom'];