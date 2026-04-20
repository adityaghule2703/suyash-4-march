// src/utils/modulePermissions.js
// 
// ⚠️ Module Permissions Master - DO NOT modify without syncing with backend
// This file defines all modules, pages, and their allowed actions
// Used for permission checking in Header and throughout the application

export const MODULES = {
  // Dashboard
  DASHBOARD: 'DASHBOARD',
  
  // Administration
  USERS: 'USERS',
  ROLES: 'ROLES',
  
  // Quotation Master
  COMPANY_MASTER: 'COMPANY_MASTER',
  CUSTOMER_MASTER: 'CUSTOMER_MASTER',
  LEAD_MASTER: 'LEAD_MASTER',
  SUPPLIER_MASTER: 'SUPPLIER_MASTER',
  TAX_MASTER: 'TAX_MASTER',
  TERMS_CONDITIONS_MASTER: 'TERMS_CONDITIONS_MASTER',
  ITEM_MASTER: 'ITEM_MASTER',
  PROCESS_MASTER: 'PROCESS_MASTER',
  DIMENSION_MASTER: 'DIMENSION_MASTER',
  MATERIAL_MASTER: 'MATERIAL_MASTER',
  RAW_MATERIAL_MASTER: 'RAW_MATERIAL_MASTER',
  QUOTATION_MASTER: 'QUOTATION_MASTER',
  COSTING_MASTER: 'COSTING_MASTER',
  OPERATION_MASTER: 'OPERATION_MASTER',
  PROCESS_DETAILS_MASTER: 'PROCESS_DETAILS_MASTER',
  COMPANY_FINANCIAL_MASTER: 'COMPANY_FINANCIAL_MASTER',
  
  // Procurement Master
  GRN_MASTER: 'GRN_MASTER',
  PURCHASE_ORDER_MASTER: 'PURCHASE_ORDER_MASTER',
  PURCHASE_REQUISITION_MASTER: 'PURCHASE_REQUISITION_MASTER',
  RFQ_MASTER: 'RFQ_MASTER',
  PURCHASE_INVOICE_MASTER: 'PURCHASE_INVOICE_MASTER',
  VENDOR_PAYMENTS: 'VENDOR_PAYMENTS', // NEW
  
  // HR Master
  DEPARTMENT_MASTER: 'DEPARTMENT_MASTER',
  DESIGNATION_MASTER: 'DESIGNATION_MASTER',
  EMPLOYEE_MASTER: 'EMPLOYEE_MASTER',
  LEAVE_TYPE_MASTER: 'LEAVE_TYPE_MASTER',
  SHIFT_MASTER: 'SHIFT_MASTER',
  ACCIDENT_MASTER: 'ACCIDENT_MASTER',
  REQUISITION_MASTER: 'REQUISITION_MASTER',
  JOB_OPENING_MASTER: 'JOB_OPENING_MASTER',
  CANDIDATE_MASTER: 'CANDIDATE_MASTER',
  INTERVIEW_MASTER: 'INTERVIEW_MASTER',
  SELECTED_CANDIDATES_MASTER: 'SELECTED_CANDIDATES_MASTER',
  SALARY_MASTER: 'SALARY_MASTER',
  PIECE_RATE_MASTER: 'PIECE_RATE_MASTER',
  REGULARIZATION_MASTER: 'REGULARIZATION_MASTER',
  EMPLOYEE_LEAVE_MASTER: 'EMPLOYEE_LEAVE_MASTER',
  ADMIN_LEAVE_MASTER: 'ADMIN_LEAVE_MASTER',
  PRODUCTION_MASTER: 'PRODUCTION_MASTER',
  TERMINATION_MASTER: 'TERMINATION_MASTER',
  EMPLOYEE_BEHAVIOR_MASTER: 'EMPLOYEE_BEHAVIOR_MASTER',
  MEDICLAIM_MASTER: 'MEDICLAIM_MASTER',
  LEAVE_APPROVAL: 'LEAVE_APPROVAL',
  TRAINING_RECORD_MASTER: 'TRAINING_RECORD_MASTER',
  
  // BOM Master
  BOM_MASTER: 'BOM_MASTER',
  
  // Sales Order Master
  SALES_ORDER_MASTER: 'SALES_ORDER_MASTER',
  ORDER_BOOK: 'ORDER_BOOK',
  SO_REVISION: 'SO_REVISION',
  SO_SUMMARY: 'SO_SUMMARY',
  SO_PENDING_DELIVERY: 'SO_PENDING_DELIVERY',
  
  // Production Master
  WORK_ORDERS: 'WORK_ORDERS', // NEW
  
  // Inventory Management
  INVENTORY_MANAGEMENT: 'INVENTORY_MANAGEMENT', // NEW
  
  // Reports
  REPORTS: 'REPORTS'
};

export const PAGES = {
  // Dashboard
  DASHBOARD: 'Dashboard',
  
  // Administration
  USERS: 'Users',
  ROLES: 'Roles',
  
  // Quotation Master Pages
  ORGANIZATION_COMPANY: 'Organization / Company',
  CUSTOMER_MASTER: 'Customer Master',
  LEAD_MASTER: 'Lead Master',
  SUPPLIER: 'Supplier',
  TAX_CONFIGURATION: 'Tax Configuration / Tax Rule',
  TERMS_AND_CONDITIONS: 'Terms And Conditions',
  PRODUCT_ITEM_CATALOG: 'Product / Item Catalog',
  MANUFACTURING_PROCESS: 'Manufacturing Process',
  PRODUCT_SPECIFICATIONS: 'Product Specifications',
  MATERIAL_CATALOG: 'Material Catalog',
  RAW_MATERIAL: 'Raw Material',
  QUOTATION: 'Quotation',
  COSTING_MASTER: 'Costing Master',
  OPERATION_MASTER: 'Operation Master',
  PROCESS_DETAILS_MASTER: 'Process Details Master',
  COMPANY_FINANCIAL_MASTER: 'Company Financial Master',
  
  // Procurement Master Pages
  GRN_MASTER: 'GRN Master',
  PURCHASE_ORDER_MASTER: 'Purchase Order Master',
  PURCHASE_REQUISITION_MASTER: 'Purchase Requisition Master',
  RFQ_MASTER: 'RFQ Master',
  PURCHASE_INVOICE_MASTER: 'Purchase Invoice Master',
  VENDOR_PAYMENTS: 'Vendor Payments', // NEW
  
  // BOM Master Pages
  BOM_MASTER: 'BOM Master',
  MRP_MASTER: 'MRP Master', // NEW
  ROUTING_MASTER: 'Routing Master', // NEW
  MACHINE_MASTER: 'Machine Master', // NEW
  OEE_MASTER: 'OEE Master', // NEW
  
  // HR Master Pages
  DEPARTMENT_MASTER: 'Department Master',
  DESIGNATION_MASTER: 'Designation Master',
  EMPLOYEE_REGISTRY: 'Employee Registry',
  LEAVE_POLICIES: 'Leave Policies',
  SHIFT_MASTER: 'Shift Master',
  ACCIDENT_REPORTING: 'Accident Reporting',
  HIRING_REQUESTS: 'Hiring Requests',
  CAREER_OPPORTUNITIES: 'Career Opportunities',
  CANDIDATE_MASTER: 'Candidate Master',
  INTERVIEW_SCHEDULING: 'Interview Scheduling',
  SELECTED_CANDIDATE: 'Selected Candidate',
  SALARY_MASTER: 'Salary Master',
  PIECE_RATE_MASTER: 'Piece Rate Master',
  ATTENDANCE_REGULARIZATION: 'Attendance Regularization',
  EMPLOYEE_LEAVE_RECORDS: 'Employee Leave Records',
  LEAVE_ADMINISTRATION: 'Leave Administration',
  PRODUCTION_MASTER: 'Production Master',
  TERMINATION_MASTER: 'Termination Master',
  BEHAVIOR_MONITORING: 'Behavior Monitoring',
  MEDICLAIM_MASTER: 'Mediclaim Master',
  LEAVE_APPROVAL: 'Leave Approval',
  TRAINING_RECORD_MASTER: 'Training Record Master',
  
  // Sales Order Master Pages
  SALES_ORDER_MASTER: 'Sales Order Master',
  ORDER_BOOK: 'Order Book',
  SO_REVISION: 'SO Revision',
  SO_SUMMARY: 'SO Summary',
  SO_PENDING_DELIVERY: 'SO Pending Delivery',
  
  // Production Master Pages
  WORK_ORDERS_MASTER: 'Work Orders Master', // NEW
  
  // Inventory Management Pages
  WAREHOUSE_MASTER: 'Warehouse Master', // NEW
  STOCK_LEDGER: 'Stock Ledger', // NEW
  MIV_MASTER: 'MIV Master (Material Issue Voucher)', // NEW
  MRV_MASTER: 'MRV Master (Material Receipt Voucher)', // NEW
  PSV_MASTER: 'PSV Master (Physical Stock Verification)', // NEW
  
  // Reports Pages
  RECRUITMENT_REPORT: 'Recruitment Report',
  EMPLOYEE_REPORT: 'Employee Report',
  INTERVIEW_REPORT: 'Interview Report'
};

export const ACTIONS = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  PRINT: 'PRINT',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT'
};

// Complete Module Configuration with Pages and Actions
export const MODULE_PERMISSIONS_CONFIG = [
  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.DASHBOARD,
    page: PAGES.DASHBOARD,
    category: 'Dashboard',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // USER / ROLE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.USERS,
    page: PAGES.USERS,
    category: 'Administration',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.ROLES,
    page: PAGES.ROLES,
    category: 'Administration',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE,
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // QUOTATION MASTER
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.COMPANY_MASTER,
    page: PAGES.ORGANIZATION_COMPANY,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.CUSTOMER_MASTER,
    page: PAGES.CUSTOMER_MASTER,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.LEAD_MASTER,
    page: PAGES.LEAD_MASTER,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.SUPPLIER_MASTER,
    page: PAGES.SUPPLIER,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.TAX_MASTER,
    page: PAGES.TAX_CONFIGURATION,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.TERMS_CONDITIONS_MASTER,
    page: PAGES.TERMS_AND_CONDITIONS,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.ITEM_MASTER,
    page: PAGES.PRODUCT_ITEM_CATALOG,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.PROCESS_MASTER,
    page: PAGES.MANUFACTURING_PROCESS,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.DIMENSION_MASTER,
    page: PAGES.PRODUCT_SPECIFICATIONS,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.MATERIAL_MASTER,
    page: PAGES.MATERIAL_CATALOG,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT]
  },
  {
    moduleKey: MODULES.RAW_MATERIAL_MASTER,
    page: PAGES.RAW_MATERIAL,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT]
  },
  {
    moduleKey: MODULES.QUOTATION_MASTER,
    page: PAGES.QUOTATION,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.COSTING_MASTER,
    page: PAGES.COSTING_MASTER,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.OPERATION_MASTER,
    page: PAGES.OPERATION_MASTER,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.PROCESS_DETAILS_MASTER,
    page: PAGES.PROCESS_DETAILS_MASTER,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.COMPANY_FINANCIAL_MASTER,
    page: PAGES.COMPANY_FINANCIAL_MASTER,
    category: 'Quotation Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROCUREMENT MASTER
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.GRN_MASTER,
    page: PAGES.GRN_MASTER,
    category: 'Procurement Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.PURCHASE_ORDER_MASTER,
    page: PAGES.PURCHASE_ORDER_MASTER,
    category: 'Procurement Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.PURCHASE_REQUISITION_MASTER,
    page: PAGES.PURCHASE_REQUISITION_MASTER,
    category: 'Procurement Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.RFQ_MASTER,
    page: PAGES.RFQ_MASTER,
    category: 'Procurement Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.PURCHASE_INVOICE_MASTER,
    page: PAGES.PURCHASE_INVOICE_MASTER,
    category: 'Procurement Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.VENDOR_PAYMENTS,
    page: PAGES.VENDOR_PAYMENTS,
    category: 'Procurement Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HR MASTER
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.DEPARTMENT_MASTER,
    page: PAGES.DEPARTMENT_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.DESIGNATION_MASTER,
    page: PAGES.DESIGNATION_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.EMPLOYEE_MASTER,
    page: PAGES.EMPLOYEE_REGISTRY,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.LEAVE_TYPE_MASTER,
    page: PAGES.LEAVE_POLICIES,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.SHIFT_MASTER,
    page: PAGES.SHIFT_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.ACCIDENT_MASTER,
    page: PAGES.ACCIDENT_REPORTING,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.REQUISITION_MASTER,
    page: PAGES.HIRING_REQUESTS,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.JOB_OPENING_MASTER,
    page: PAGES.CAREER_OPPORTUNITIES,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.CANDIDATE_MASTER,
    page: PAGES.CANDIDATE_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.INTERVIEW_MASTER,
    page: PAGES.INTERVIEW_SCHEDULING,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.SELECTED_CANDIDATES_MASTER,
    page: PAGES.SELECTED_CANDIDATE,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.SALARY_MASTER,
    page: PAGES.SALARY_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE]
  },
  {
    moduleKey: MODULES.PIECE_RATE_MASTER,
    page: PAGES.PIECE_RATE_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.REGULARIZATION_MASTER,
    page: PAGES.ATTENDANCE_REGULARIZATION,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.EMPLOYEE_LEAVE_MASTER,
    page: PAGES.EMPLOYEE_LEAVE_RECORDS,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.ADMIN_LEAVE_MASTER,
    page: PAGES.LEAVE_ADMINISTRATION,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.APPROVE, ACTIONS.REJECT, ACTIONS.EXPORT]
  },
  {
    moduleKey: MODULES.PRODUCTION_MASTER,
    page: PAGES.PRODUCTION_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.TERMINATION_MASTER,
    page: PAGES.TERMINATION_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.EMPLOYEE_BEHAVIOR_MASTER,
    page: PAGES.BEHAVIOR_MONITORING,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.MEDICLAIM_MASTER,
    page: PAGES.MEDICLAIM_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.TRAINING_RECORD_MASTER,
    page: PAGES.TRAINING_RECORD_MASTER,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.LEAVE_APPROVAL,
    page: PAGES.LEAVE_APPROVAL,
    category: 'HR Master',
    actions: [ACTIONS.VIEW, ACTIONS.APPROVE, ACTIONS.REJECT]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BOM MASTER
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.BOM_MASTER,
    page: PAGES.BOM_MASTER,
    category: 'BOM Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.BOM_MASTER,
    page: PAGES.MRP_MASTER,
    category: 'BOM Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.BOM_MASTER,
    page: PAGES.ROUTING_MASTER,
    category: 'BOM Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.BOM_MASTER,
    page: PAGES.MACHINE_MASTER,
    category: 'BOM Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.BOM_MASTER,
    page: PAGES.OEE_MASTER,
    category: 'BOM Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SALES ORDER MASTER
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.SALES_ORDER_MASTER,
    page: PAGES.SALES_ORDER_MASTER,
    category: 'Sales Order Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.ORDER_BOOK,
    page: PAGES.ORDER_BOOK,
    category: 'Sales Order Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.SO_REVISION,
    page: PAGES.SO_REVISION,
    category: 'Sales Order Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },
  {
    moduleKey: MODULES.SO_SUMMARY,
    page: PAGES.SO_SUMMARY,
    category: 'Sales Order Master',
    actions: [ACTIONS.VIEW, ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.SO_PENDING_DELIVERY,
    page: PAGES.SO_PENDING_DELIVERY,
    category: 'Sales Order Master',
    actions: [ACTIONS.VIEW, ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.UPDATE]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PRODUCTION MASTER
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.WORK_ORDERS,
    page: PAGES.WORK_ORDERS_MASTER,
    category: 'Production Master',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE, ACTIONS.REJECT]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INVENTORY MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.INVENTORY_MANAGEMENT,
    page: PAGES.WAREHOUSE_MASTER,
    category: 'Inventory Management',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.IMPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.INVENTORY_MANAGEMENT,
    page: PAGES.STOCK_LEDGER,
    category: 'Inventory Management',
    actions: [ACTIONS.VIEW, ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.INVENTORY_MANAGEMENT,
    page: PAGES.MIV_MASTER,
    category: 'Inventory Management',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE]
  },
  {
    moduleKey: MODULES.INVENTORY_MANAGEMENT,
    page: PAGES.MRV_MASTER,
    category: 'Inventory Management',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE]
  },
  {
    moduleKey: MODULES.INVENTORY_MANAGEMENT,
    page: PAGES.PSV_MASTER,
    category: 'Inventory Management',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE, 
              ACTIONS.EXPORT, ACTIONS.PRINT, ACTIONS.APPROVE]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // REPORTS
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.REPORTS,
    page: PAGES.RECRUITMENT_REPORT,
    category: 'Reports',
    actions: [ACTIONS.VIEW, ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.REPORTS,
    page: PAGES.EMPLOYEE_REPORT,
    category: 'Reports',
    actions: [ACTIONS.VIEW, ACTIONS.EXPORT, ACTIONS.PRINT]
  },
  {
    moduleKey: MODULES.REPORTS,
    page: PAGES.INTERVIEW_REPORT,
    category: 'Reports',
    actions: [ACTIONS.VIEW, ACTIONS.EXPORT, ACTIONS.PRINT]
  }
];

// Helper function to check if user has permission for a specific module and action
export const hasPermission = (userPermissions, moduleKey, page, action) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  
  // SuperAdmin has all permissions
  const isSuperAdmin = userPermissions.some(perm => perm.source === 'superadmin');
  if (isSuperAdmin) return true;
  
  return userPermissions.some(perm => 
    perm.module === moduleKey && 
    perm.page === page && 
    perm.action === action
  );
};

// Helper function to check if user has view permission for a page
export const canViewPage = (userPermissions, moduleKey, page) => {
  return hasPermission(userPermissions, moduleKey, page, ACTIONS.VIEW);
};

// Helper function to get all allowed actions for a module/page
export const getAllowedActions = (userPermissions, moduleKey, page) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return [];
  
  const isSuperAdmin = userPermissions.some(perm => perm.source === 'superadmin');
  if (isSuperAdmin) {
    const config = MODULE_PERMISSIONS_CONFIG.find(
      cfg => cfg.moduleKey === moduleKey && cfg.page === page
    );
    return config ? config.actions : [];
  }
  
  return userPermissions
    .filter(perm => perm.module === moduleKey && perm.page === page)
    .map(perm => perm.action);
};

// Helper function to get modules grouped by category
export const getModulesByCategory = () => {
  const grouped = {};
  MODULE_PERMISSIONS_CONFIG.forEach(module => {
    if (!grouped[module.category]) {
      grouped[module.category] = [];
    }
    grouped[module.category].push({
      moduleKey: module.moduleKey,
      page: module.page,
      actions: module.actions
    });
  });
  return grouped;
};

// Helper function to filter modules based on user permissions
export const getAccessibleModules = (userPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return [];
  
  const isSuperAdmin = userPermissions.some(perm => perm.source === 'superadmin');
  if (isSuperAdmin) {
    return MODULE_PERMISSIONS_CONFIG;
  }
  
  const accessibleModules = [];
  MODULE_PERMISSIONS_CONFIG.forEach(module => {
    const hasView = userPermissions.some(perm => 
      perm.module === module.moduleKey && 
      perm.page === module.page && 
      perm.action === ACTIONS.VIEW
    );
    if (hasView) {
      accessibleModules.push(module);
    }
  });
  return accessibleModules;
};

export default {
  MODULES,
  PAGES,
  ACTIONS,
  MODULE_PERMISSIONS_CONFIG,
  hasPermission,
  canViewPage,
  getAllowedActions,
  getModulesByCategory,
  getAccessibleModules
};