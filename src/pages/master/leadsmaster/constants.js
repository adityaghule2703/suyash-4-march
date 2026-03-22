// Color constants
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
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// Lead Source Options
export const LEAD_SOURCE_OPTIONS = [
  'Website', 'Email', 'WhatsApp', 'Phone', 'Exhibition',
  'Referral', 'Cold Outreach', 'Walk-In', 'LinkedIn', 'Other'
];

// Priority Options
export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

// Industry Options
export const INDUSTRY_OPTIONS = [
  'Switchgear', 'Automotive', 'Electronics', 'Construction', 
  'Manufacturing', 'Power', 'Telecom', 'Other'
];

// Unit Options
export const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

// Status Options
export const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Junk'];

// Feasibility Status Options
export const FEASIBILITY_STATUS_OPTIONS = ['Pending', 'Feasible', 'Not Feasible', 'Conditionally Feasible'];

// Status Colors
export const STATUS_COLORS = {
  'New': { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  'Contacted': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  'Qualified': { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  'Proposal Sent': { bg: '#FCE7F3', color: '#9D174D', border: '#FBCFE8' },
  'Negotiation': { bg: '#FEF9C3', color: '#854D0E', border: '#FEF08A' },
  'Won': { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' },
  'Lost': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
  'Junk': { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
};

// Add this to your constants.js file
export const STATUS_TRANSITIONS = {
  'New': ['Contacted', 'Junk'],
  'Contacted': ['Qualified', 'Junk'],
  'Qualified': ['Proposal Sent'],
  'Proposal Sent': ['Negotiation', 'Won', 'Lost'],
  'Negotiation': ['Won', 'Lost'],
  'Won': [],
  'Lost': [],
  'Junk': []
};

// Priority Colors
export const PRIORITY_COLORS = {
  'High': { bg: '#FEE2E2', color: '#991B1B' },
  'Medium': { bg: '#FEF3C7', color: '#92400E' },
  'Low': { bg: '#D1FAE5', color: '#065F46' }
};