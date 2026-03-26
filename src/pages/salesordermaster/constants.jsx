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

// Sales Order Status Colors
export const SO_STATUS_COLORS = {
  'Draft': { bg: '#FEF3C7', color: '#92400E', border: '#FBBF24' },
  'Confirmed': { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
  'In Production': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Ready for Dispatch': { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  'Partially Delivered': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Fully Delivered': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Closed': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Cancelled': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' }
};

// Sales Order Status Transitions
export const SO_STATUS_TRANSITIONS = {
  'Draft': ['Confirmed', 'Cancelled'],
  'Confirmed': ['In Production', 'Cancelled'],
  'In Production': ['Ready for Dispatch', 'Cancelled'],
  'Ready for Dispatch': ['Partially Delivered', 'Fully Delivered'],
  'Partially Delivered': ['Fully Delivered', 'Cancelled'],
  'Fully Delivered': ['Closed'],
  'Closed': [],
  'Cancelled': []
};

// Item Status Colors
export const ITEM_STATUS_COLORS = {
  'Pending': { bg: '#FEF3C7', color: '#92400E', border: '#FBBF24' },
  'In Production': { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
  'Ready': { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  'Partially Delivered': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Delivered': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Cancelled': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' }
};

// Item Status Options
export const ITEM_STATUS_OPTIONS = [
  'Pending',
  'In Production',
  'Ready',
  'Partially Delivered',
  'Delivered',
  'Cancelled'
];

// Unit Options
export const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

// Currency Options
export const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP', 'AED'];

// Delivery Terms Options
export const DELIVERY_TERMS_OPTIONS = ['Ex-Works', 'FOR Destination', 'CIF', 'FOB', ''];

// Delivery Mode Options
export const DELIVERY_MODE_OPTIONS = ['Road', 'Rail', 'Air', 'Sea', 'Hand Delivery', ''];

// Payment Terms Options
export const PAYMENT_TERMS_OPTIONS = [
  'Advance Payment',
  'Net 7',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Letter of Credit',
  'Cash on Delivery'
];

// GST Types
export const GST_TYPES = ['IGST', 'CGST+SGST', 'Exempt'];

// Priority Colors (if needed)
export const PRIORITY_COLORS = {
  High: { bg: '#FEF3C7', color: '#D97706' },
  Medium: { bg: '#E0E7FF', color: '#4F46E5' },
  Low: { bg: '#D1FAE5', color: '#059669' }
};

// Priority Options
export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

// Status Icons Mapping (for rendering)
export const getStatusIcon = (status) => {
  const icons = {
    'Draft': '📝',
    'Confirmed': '✓',
    'In Production': '⚙️',
    'Ready for Dispatch': '📦',
    'Partially Delivered': '🚚',
    'Fully Delivered': '✅',
    'Closed': '🔒',
    'Cancelled': '❌'
  };
  return icons[status] || '📄';
};

// Helper function to get status color
export const getStatusColor = (status) => {
  return SO_STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
};

// Helper function to get item status color
export const getItemStatusColor = (status) => {
  return ITEM_STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
};

// Helper function to format currency
export const formatCurrency = (amount, currency = 'INR') => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
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

// Helper function to calculate totals
export const calculateOrderTotals = (items) => {
  let sub_total = 0;
  let discount_total = 0;
  
  items.forEach(item => {
    const qty = Number(item.ordered_qty) || 0;
    const price = Number(item.unit_price) || 0;
    const discount = Number(item.discount_percent) || 0;
    
    const item_total = qty * price;
    const item_discount = (item_total * discount) / 100;
    
    sub_total += item_total;
    discount_total += item_discount;
  });
  
  const taxable_total = sub_total - discount_total;
  const gst_total = (taxable_total * 18) / 100; // Assuming 18% GST
  const grand_total = taxable_total + gst_total;
  
  return {
    sub_total,
    discount_total,
    taxable_total,
    gst_total,
    grand_total
  };
};

// Sales Order Status Options for dropdown
export const SO_STATUS_OPTIONS = [
  'Draft',
  'Confirmed',
  'In Production',
  'Ready for Dispatch',
  'Partially Delivered',
  'Fully Delivered',
  'Closed',
  'Cancelled'
];

// Terminal statuses (where no further actions are allowed)
export const TERMINAL_SO_STATUSES = ['Closed', 'Cancelled'];

// Allowed actions based on status
export const getAllowedActionsForStatus = (status) => {
  const actions = {
    'Draft': ['edit', 'delete', 'confirm'],
    'Confirmed': ['edit', 'delete', 'startProduction'],
    'In Production': ['edit', 'updateProgress', 'readyForDispatch'],
    'Ready for Dispatch': ['edit', 'dispatch', 'partiallyDeliver'],
    'Partially Delivered': ['edit', 'fullyDeliver', 'cancel'],
    'Fully Delivered': ['close'],
    'Closed': [],
    'Cancelled': []
  };
  return actions[status] || [];
};

// Document Types for attachments
export const DOCUMENT_TYPES = {
  PO: 'Purchase Order',
  INVOICE: 'Invoice',
  DELIVERY_CHALLAN: 'Delivery Challan',
  ACKNOWLEDGEMENT: 'Acknowledgement',
  OTHER: 'Other'
};

// Export constants for the module
export const SALES_ORDER_CONSTANTS = {
  MODULE_NAME: 'Sales Order',
  MODULE_CODE: 'SO',
  DATE_FORMAT: 'YYYY-MM-DD',
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_GST: 18,
  ITEM_STATUSES: ITEM_STATUS_OPTIONS,
  UNIT_OPTIONS: UNIT_OPTIONS,
  CURRENCY_OPTIONS: CURRENCY_OPTIONS,
  DELIVERY_TERMS_OPTIONS: DELIVERY_TERMS_OPTIONS,
  DELIVERY_MODE_OPTIONS: DELIVERY_MODE_OPTIONS,
  PAYMENT_TERMS_OPTIONS: PAYMENT_TERMS_OPTIONS,
  STATUS_TRANSITIONS: SO_STATUS_TRANSITIONS,
  STATUS_COLORS: SO_STATUS_COLORS
};