import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/Config';
import { 
  MODULES, 
  PAGES, 
  ACTIONS
} from '../utils/modulePermissions';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState('quotation');
  const [clickedItem, setClickedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [masterSearchTerm, setMasterSearchTerm] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userPermissions, setUserPermissions] = useState(() => {
    // Initialize from localStorage
    const savedPermissions = localStorage.getItem('userPermissions');
    return savedPermissions ? JSON.parse(savedPermissions) : [];
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    return localStorage.getItem('isSuperAdmin') === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredQuotationItems, setFilteredQuotationItems] = useState([]);
  const [filteredHRItems, setFilteredHRItems] = useState([]);
  const [filteredProcurementItems, setFilteredProcurementItems] = useState([]);
  const [filteredBOMItems, setFilteredBOMItems] = useState([]);
  const [filteredSalesOrderItems, setFilteredSalesOrderItems] = useState([]);
  const [filteredMachineItems, setFilteredMachineItems] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const masterRef = useRef(null);
  const dropdownRef = useRef(null);
  const submenuRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const masterSearchRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const ITEMS_PER_COLUMN = 8;

  // Check if user can access a specific page
  const canAccessPage = (moduleKey, page) => {
    if (!userPermissions || userPermissions.length === 0) return false;
    // Check if user has VIEW permission for the module/page
    if (isSuperAdmin) return true;
    return userPermissions.some(perm => 
      perm.module === moduleKey && 
      perm.page === page && 
      perm.action === ACTIONS.VIEW
    );
  };

  // Master dropdown items - Main categories
  const masterCategories = [
    {
      name: 'Quotation Master',
      type: 'quotation',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      count: 0
    },
    {
      name: 'Procurement Master',
      type: 'procurement',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      count: 0
    },
    {
      name: 'HR Master',
      type: 'hr',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      count: 0
    },
    {
      name: 'BOM Master',
      type: 'bom',
      icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      count: 0
    },
    {
      name: 'Sales Order Master',
      type: 'salesorder',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      count: 0
    },
    {
      name: 'Machine Master',
      type: 'machine',
      icon: 'M20.25 14.15v-4.3m0 0c0-1.5-1.5-3-3-3h-4.5c-1.5 0-3 1.5-3 3v4.3m10.5 0v4.3c0 1.5-1.5 3-3 3h-4.5c-1.5 0-3-1.5-3-3v-4.3m10.5 0H3.75m0 0v-4.3c0-1.5 1.5-3 3-3h4.5c1.5 0 3 1.5 3 3v4.3M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      count: 0
    },
  ];

  const quotationMasterItems = [
    { name: 'Organization / Company', path: '/master/companymaster', icon: 'M3.75 21h16.5M3.75 3h16.5M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h7.5', moduleKey: MODULES.COMPANY_MASTER, page: PAGES.ORGANIZATION_COMPANY },
    { name: 'Customer Master', path: '/master/customermaster', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', moduleKey: MODULES.CUSTOMER_MASTER, page: PAGES.CUSTOMER_MASTER },
    { name: 'Lead Master', path: '/master/leadsmaster', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z M8 14h8', moduleKey: MODULES.LEAD_MASTER, page: PAGES.LEAD_MASTER },
    { name: 'Tax Configuration / Tax Rule', path: '/master/taxmaster', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', moduleKey: MODULES.TAX_MASTER, page: PAGES.TAX_CONFIGURATION },
    { name: 'Terms And Conditions', path: '/master/termsandconditionmaster', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', moduleKey: MODULES.TERMS_CONDITIONS_MASTER, page: PAGES.TERMS_AND_CONDITIONS },
    { name: 'Product / Item Catalog', path: '/master/itemmaster', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z', moduleKey: MODULES.ITEM_MASTER, page: PAGES.PRODUCT_ITEM_CATALOG },
    { name: 'Manufacturing Process', path: '/master/processmaster', icon: 'M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25', moduleKey: MODULES.PROCESS_MASTER, page: PAGES.MANUFACTURING_PROCESS },
    { name: 'Product Specifications', path: '/master/dimentionmaster', icon: 'M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125zM9.75 9.75h4.5', moduleKey: MODULES.DIMENSION_MASTER, page: PAGES.PRODUCT_SPECIFICATIONS },
    { name: 'Material Catalog', path: '/master/materialmaster', icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375 7.444 2.25 12 2.25s8.25 1.847 8.25 4.125zm0 4.5c0 2.278-3.694 4.125-8.25 4.125S3.75 13.153 3.75 10.875m16.5 4.5c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125', moduleKey: MODULES.MATERIAL_MASTER, page: PAGES.MATERIAL_CATALOG },
    { name: 'Raw Material', path: '/master/rawmaterialmaster', icon: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z', moduleKey: MODULES.RAW_MATERIAL_MASTER, page: PAGES.RAW_MATERIAL },
    { name: 'Quotation', path: '/master/quotationmaster', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', moduleKey: MODULES.QUOTATION_MASTER, page: PAGES.QUOTATION }
  ];

  const procurementMasterItems = [
    { name: 'Supplier', path: '/master/vendormaster', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', moduleKey: MODULES.SUPPLIER_MASTER, page: PAGES.SUPPLIER },
    { name: 'Purchase Requisition Master', path: '/procurementmaster/purchaserequisitionmaster', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', moduleKey: MODULES.PURCHASE_REQUISITION_MASTER, page: PAGES.PURCHASE_REQUISITION_MASTER },
    { name: 'RFQ Master', path: '/procurementmaster/rfqmaster', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', moduleKey: MODULES.RFQ_MASTER, page: PAGES.RFQ_MASTER },
    { name: 'Purchase Order Master', path: '/procurementmaster/purchaseordermaster', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', moduleKey: MODULES.PURCHASE_ORDER_MASTER, page: PAGES.PURCHASE_ORDER_MASTER },
    { name: 'GRN Master', path: '/procurementmaster/grnmaster', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', moduleKey: MODULES.GRN_MASTER, page: PAGES.GRN_MASTER },
    { name: 'Purchase Invoice Master', path: '/procurementmaster/purchaseinvoicemaster', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', moduleKey: MODULES.PURCHASE_INVOICE_MASTER, page: PAGES.PURCHASE_INVOICE_MASTER }
  ];

  // HR Master submenu items
  const hrMasterItems = [
    { name: 'Department Master', path: '/hrmaster/departmentmaster', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', moduleKey: MODULES.DEPARTMENT_MASTER, page: PAGES.DEPARTMENT_MASTER },
    { name: 'Designation Master', path: '/hrmaster/designationmaster', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', moduleKey: MODULES.DESIGNATION_MASTER, page: PAGES.DESIGNATION_MASTER },
    { name: 'Employee Registry', path: '/hrmaster/employeemaster', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', moduleKey: MODULES.EMPLOYEE_MASTER, page: PAGES.EMPLOYEE_REGISTRY },
    { name: 'Leave Policies', path: '/hrmaster/leavetypemaster', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', moduleKey: MODULES.LEAVE_TYPE_MASTER, page: PAGES.LEAVE_POLICIES },
    { name: 'Accident Reporting', path: '/hrmaster/accidentmaster', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', moduleKey: MODULES.ACCIDENT_MASTER, page: PAGES.ACCIDENT_REPORTING },
    { name: 'Hiring Requests', path: '/hrmaster/requisitionmaster', icon: 'M15 5v2m-6 0V5m6 0a2 2 0 012 2m-8-2a2 2 0 00-2 2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2m-6 7h6m-6 4h6m-6-8h6', moduleKey: MODULES.REQUISITION_MASTER, page: PAGES.HIRING_REQUESTS },
    { name: 'Career Opportunities', path: '/hrmaster/jobopeningmaster', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', moduleKey: MODULES.JOB_OPENING_MASTER, page: PAGES.CAREER_OPPORTUNITIES },
    { name: 'Candidate Master', path: '/hrmaster/candidatemaster', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', moduleKey: MODULES.CANDIDATE_MASTER, page: PAGES.CANDIDATE_MASTER },
    { name: 'Interview Scheduling', path: '/hrmaster/interviewmaster', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', moduleKey: MODULES.INTERVIEW_MASTER, page: PAGES.INTERVIEW_SCHEDULING },
    { name: 'Selected Candidate', path: '/hrmaster/selectedcandidatesmaster', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', moduleKey: MODULES.SELECTED_CANDIDATES_MASTER, page: PAGES.SELECTED_CANDIDATE },
    { name: 'Salary Master', path: '/hrmaster/salarymaster', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', moduleKey: MODULES.SALARY_MASTER, page: PAGES.SALARY_MASTER },
    { name: 'Piece Rate Master', path: '/hrmaster/pieceratemaster', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7', moduleKey: MODULES.PIECE_RATE_MASTER, page: PAGES.PIECE_RATE_MASTER },
    { name: 'Attendance Regularization', path: '/hrmaster/regularizationmaster', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', moduleKey: MODULES.REGULARIZATION_MASTER, page: PAGES.ATTENDANCE_REGULARIZATION },
    { name: 'Employee Leave Records', path: '/hrmaster/employeeleavemaster', icon: 'M16 4v1h4v16H4V5h4V4a2 2 0 014 0M8 8h8M8 12h6m-6 4h4', moduleKey: MODULES.EMPLOYEE_LEAVE_MASTER, page: PAGES.EMPLOYEE_LEAVE_RECORDS },
    { name: 'Leave Administration', path: '/hrmaster/adminleavemaster', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z M8 14h8', moduleKey: MODULES.ADMIN_LEAVE_MASTER, page: PAGES.LEAVE_ADMINISTRATION },
    { name: 'Production Master', path: '/hrmaster/productionmaster', icon: 'M3 21h18M5 21V10l5 3V10l5 3V6h4v15', moduleKey: MODULES.PRODUCTION_MASTER, page: PAGES.PRODUCTION_MASTER },
    { name: 'Termination Master', path: '/hrmaster/terminationmaster', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6-8a4 4 0 11-8 0 4 4 0 018 0z', moduleKey: MODULES.TERMINATION_MASTER, page: PAGES.TERMINATION_MASTER },
    { name: 'Behavior Monitoring', path: '/hrmaster/employeebehaviormaster', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6-8a4 4 0 11-8 0 4 4 0 018 0z', moduleKey: MODULES.EMPLOYEE_BEHAVIOR_MASTER, page: PAGES.BEHAVIOR_MONITORING },
    { name: 'Mediclaim Master', path: '/hrmaster/mediclaimmaster', icon: 'M3 21h18M5 21V10l5 3V10l5 3V6h4v15', moduleKey: MODULES.MEDICLAIM_MASTER, page: PAGES.MEDICLAIM_MASTER },
    { name: 'Training Record Master', path: '/hrmaster/trainingrecordmaster', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', moduleKey: MODULES.TRAINING_RECORD_MASTER, page: PAGES.TRAINING_RECORD_MASTER },
  ];

  // BOM Master items
  const bomMasterItems = [
    { name: 'BOM Master', path: '/bommaster/bommaster', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', moduleKey: MODULES.BOM_MASTER, page: PAGES.BOM_MASTER },
  ];

  // Sales Order Master items
  const salesOrderMasterItems = [
    { 
      name: 'Sales Order Master', 
      path: '/salesordermaster/salesordermaster', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 
      moduleKey: MODULES.SALES_ORDER_MASTER, 
      page: PAGES.SALES_ORDER_MASTER 
    },
    { 
      name: 'Order Book', 
      path: '/salesordermaster/orderbook', 
      icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', 
      moduleKey: MODULES.SALES_ORDER_MASTER, 
      page: PAGES.ORDER_BOOK 
    },
    { 
      name: 'SO Revision', 
      path: '/salesordermaster/sorevision', 
      icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99', 
      moduleKey: MODULES.SALES_ORDER_MASTER, 
      page: PAGES.SO_REVISION 
    },
    { 
      name: 'SO Summary', 
      path: '/salesordermaster/sosummary', 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 
      moduleKey: MODULES.SALES_ORDER_MASTER, 
      page: PAGES.SO_SUMMARY 
    },
    { 
      name: 'SO Pending Delivery', 
      path: '/salesordermaster/sopendingdelivery', 
      icon: 'M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', 
      moduleKey: MODULES.SALES_ORDER_MASTER, 
      page: PAGES.SO_PENDING_DELIVERY 
    },
  ];

  // Machine Master items
  const machineMasterItems = [
    { 
      name: 'Machine Master', 
      path: '/machinemaster/machinemaster', 
      icon: 'M20.25 14.15v-4.3m0 0c0-1.5-1.5-3-3-3h-4.5c-1.5 0-3 1.5-3 3v4.3m10.5 0v4.3c0 1.5-1.5 3-3 3h-4.5c-1.5 0-3-1.5-3-3v-4.3m10.5 0H3.75m0 0v-4.3c0-1.5 1.5-3 3-3h4.5c1.5 0 3 1.5 3 3v4.3M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
      moduleKey: MODULES.MACHINE_MASTER, 
      page: PAGES.MACHINE_MASTER 
    },
  ];

  // Leave Management items
  const leaveManagementItems = [
    { name: 'Leave Approval', path: '/leave/approval', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', moduleKey: MODULES.LEAVE_APPROVAL, page: PAGES.LEAVE_APPROVAL }
  ];

  // Combine HR items with Leave items
  const allHRItems = [...hrMasterItems, ...leaveManagementItems];

  // Filter items based on permissions - Run whenever permissions change
  const filterItemsByPermissions = () => {
    // Filter quotation items based on permissions
    const accessibleQuotationItems = quotationMasterItems.filter(item => {
      if (item.moduleKey && item.page) {
        return canAccessPage(item.moduleKey, item.page);
      }
      return true;
    });
    
    // Filter procurement items based on permissions
    const accessibleProcurementItems = procurementMasterItems.filter(item => {
      if (item.moduleKey && item.page) {
        return canAccessPage(item.moduleKey, item.page);
      }
      return true;
    });
    
    // Filter HR items based on permissions
    const accessibleHRItems = allHRItems.filter(item => {
      if (item.moduleKey && item.page) {
        return canAccessPage(item.moduleKey, item.page);
      }
      return true;
    });
    
    // Filter BOM items based on permissions
    const accessibleBOMItems = bomMasterItems.filter(item => {
      if (item.moduleKey && item.page) {
        return canAccessPage(item.moduleKey, item.page);
      }
      return true;
    });
    
    // Filter Sales Order items based on permissions
    const accessibleSalesOrderItems = salesOrderMasterItems.filter(item => {
      if (item.moduleKey && item.page) {
        return canAccessPage(item.moduleKey, item.page);
      }
      return true;
    });
    
    // Filter Machine items based on permissions
    const accessibleMachineItems = machineMasterItems.filter(item => {
      if (item.moduleKey && item.page) {
        return canAccessPage(item.moduleKey, item.page);
      }
      return true;
    });
    
    setFilteredQuotationItems(accessibleQuotationItems);
    setFilteredProcurementItems(accessibleProcurementItems);
    setFilteredHRItems(accessibleHRItems);
    setFilteredBOMItems(accessibleBOMItems);
    setFilteredSalesOrderItems(accessibleSalesOrderItems);
    setFilteredMachineItems(accessibleMachineItems);
    
    // Update category counts
    masterCategories[0].count = accessibleQuotationItems.length;
    masterCategories[1].count = accessibleProcurementItems.length;
    masterCategories[2].count = accessibleHRItems.length;
    masterCategories[3].count = accessibleBOMItems.length;
    masterCategories[4].count = accessibleSalesOrderItems.length;
    masterCategories[5].count = accessibleMachineItems.length;
  };

  // Filter function for master search
  const filterMasterItems = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    
    if (activeSubmenu === 'quotation') {
      const filtered = quotationMasterItems.filter(item => 
        item.name.toLowerCase().includes(term) && canAccessPage(item.moduleKey, item.page)
      );
      setFilteredQuotationItems(filtered);
    } else if (activeSubmenu === 'procurement') {
      const filtered = procurementMasterItems.filter(item => 
        item.name.toLowerCase().includes(term) && canAccessPage(item.moduleKey, item.page)
      );
      setFilteredProcurementItems(filtered);
    } else if (activeSubmenu === 'hr') {
      const filtered = allHRItems.filter(item => 
        item.name.toLowerCase().includes(term) && canAccessPage(item.moduleKey, item.page)
      );
      setFilteredHRItems(filtered);
    } else if (activeSubmenu === 'bom') {
      const filtered = bomMasterItems.filter(item => 
        item.name.toLowerCase().includes(term) && canAccessPage(item.moduleKey, item.page)
      );
      setFilteredBOMItems(filtered);
    } else if (activeSubmenu === 'salesorder') {
      const filtered = salesOrderMasterItems.filter(item => 
        item.name.toLowerCase().includes(term) && canAccessPage(item.moduleKey, item.page)
      );
      setFilteredSalesOrderItems(filtered);
    } else if (activeSubmenu === 'machine') {
      const filtered = machineMasterItems.filter(item => 
        item.name.toLowerCase().includes(term) && canAccessPage(item.moduleKey, item.page)
      );
      setFilteredMachineItems(filtered);
    }
  };

  const handleMasterSearch = (e) => {
    const term = e.target.value;
    setMasterSearchTerm(term);
    filterMasterItems(term);
  };

  // Clear master search
  const clearMasterSearch = () => {
    setMasterSearchTerm('');
    filterItemsByPermissions(); // Reset to full accessible list
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      
      if (data.success && data.data) {
        setUserData(data.data);
        
        // Store permissions
        if (data.data.permissions) {
          setUserPermissions(data.data.permissions);
          localStorage.setItem('userPermissions', JSON.stringify(data.data.permissions));
        }
        
        // Store super admin flag
        const superAdminFlag = data.data.isSuperAdmin || false;
        setIsSuperAdmin(superAdminFlag);
        localStorage.setItem('isSuperAdmin', superAdminFlag);
        
        localStorage.setItem('userEmail', data.data.Email);
        localStorage.setItem('userName', data.data.Username);
        localStorage.setItem('userRole', data.data.role?.RoleName || 'User');
        localStorage.setItem('userId', data.data._id);
        localStorage.setItem('userRoleId', data.data.role?._id || '');
        
        setError(''); // Clear any previous errors
      } else {
        setError('Failed to fetch user profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        setError('Unable to load user profile');
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize component - load user data if token exists and permissions are empty
  useEffect(() => {
    const token = localStorage.getItem('token');
    const hasPermissions = userPermissions.length > 0;
    const hasUserData = userData !== null;
    
    if (token && (!hasPermissions || !hasUserData)) {
      fetchUserProfile();
    } else if (token && hasPermissions && !hasUserData) {
      // If we have permissions but no user data, try to load user data from localStorage
      const savedUserEmail = localStorage.getItem('userEmail');
      const savedUserName = localStorage.getItem('userName');
      const savedUserRole = localStorage.getItem('userRole');
      
      if (savedUserEmail && savedUserName) {
        setUserData({
          Email: savedUserEmail,
          Username: savedUserName,
          role: { RoleName: savedUserRole }
        });
      }
      setLoading(false);
      filterItemsByPermissions();
    } else {
      setLoading(false);
    }
  }, []);

  // Re-filter when permissions change
  useEffect(() => {
    if (userPermissions.length > 0 || isSuperAdmin) {
      filterItemsByPermissions();
    }
  }, [userPermissions, isSuperAdmin]);

  // Handle ESC key to close all dropdowns
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeAllDropdowns();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setActiveSubmenu('quotation');
    setShowProfileDropdown(false);
    setShowNotifications(false);
    setMobileMenuOpen(false);
    clearMasterSearch();
  };

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        masterRef.current && !masterRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        submenuRef.current && !submenuRef.current.contains(event.target) &&
        profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) &&
        notificationsRef.current && !notificationsRef.current.contains(event.target) &&
        mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      closeAllDropdowns();
    } else {
      setActiveDropdown(dropdown);
      if (dropdown === 'master' && !activeSubmenu) {
        setActiveSubmenu('quotation');
      }
    }
  };

  const handleCategoryClick = (categoryType) => {
    setActiveSubmenu(categoryType);
    clearMasterSearch();
    setTimeout(() => {
      if (masterSearchRef.current) {
        masterSearchRef.current.focus();
      }
    }, 100);
  };

  const handleDropdownItemClick = (path, categoryType) => {
    setClickedItem(path);
    setTimeout(() => {
      closeAllDropdowns();
      setClickedItem(null);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRoleId');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('userPermissions');
    localStorage.removeItem('isSuperAdmin');
    
    navigate('/login');
    setShowProfileDropdown(false);
  };

  const getColumns = (items) => {
    const columns = [];
    for (let i = 0; i < items.length; i += ITEMS_PER_COLUMN) {
      columns.push(items.slice(i, i + ITEMS_PER_COLUMN));
    }
    return columns;
  };

  const quotationColumns = getColumns(filteredQuotationItems);
  const procurementColumns = getColumns(filteredProcurementItems);
  const hrColumns = getColumns(filteredHRItems);
  const bomColumns = getColumns(filteredBOMItems);
  const salesOrderColumns = getColumns(filteredSalesOrderItems);
  const machineColumns = getColumns(filteredMachineItems);

  const isMasterActive = (path) => {
    return path.startsWith('/master/') || path.startsWith('/hrmaster/') || path.startsWith('/procurementmaster/') || path.startsWith('/bommaster/') || path.startsWith('/salesordermaster/') || path.startsWith('/machinemaster/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const getUserInitials = () => {
    if (!userData?.Username) return 'U';
    
    const name = userData.Username;
    const words = name.split(' ');
    
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
  };

  const currentPath = window.location.pathname;

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={i} className="bg-[#9FE2BF] text-[#0A5C60] px-0.5 rounded text-xs">{part}</mark> : 
        part
    );
  };

  // Sample notifications
  const notifications = [
    { id: 1, text: 'New user registered', time: '2 min ago', read: false },
    { id: 2, text: 'Order #1234 needs approval', time: '1 hour ago', read: false },
    { id: 3, text: 'System update completed', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide:hover::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-hide:hover::-webkit-scrollbar-track {
          background: #f0fdf4;
          border-radius: 2px;
        }
        
        .scrollbar-hide:hover::-webkit-scrollbar-thumb {
          background: #9FE2BF;
          border-radius: 2px;
        }
        
        .scrollbar-hide:hover::-webkit-scrollbar-thumb:hover {
          background: #0A5C60;
        }

        .wavy-bg {
          position: relative;
          overflow: hidden;
        }
        
        .wavy-bg::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -10%;
          width: 120%;
          height: 200%;
          background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 25%),
                      radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 25%),
                      repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 30px);
          animation: waveMove 15s linear infinite;
          pointer-events: none;
        }

        @keyframes waveMove {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-5%) translateY(-2%) rotate(1deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .dropdown-animation {
          animation: fadeIn 0.15s cubic-bezier(0.34, 1.3, 0.64, 1);
        }

        .mobile-menu-animation {
          animation: slideIn 0.2s ease-out;
        }

        .esc-hint {
          font-size: 9px;
          color: rgba(255,255,255,0.5);
          margin-left: 4px;
          padding: 1px 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          letter-spacing: 0.3px;
        }

        /* Desktop styles (keep original) */
        @media (min-width: 1024px) {
          .header-container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .nav-link-text {
            font-size: 0.75rem;
          }
          .search-box {
            width: 200px;
            display: block;
          }
        }

        /* Tablet styles */
        @media (min-width: 768px) and (max-width: 1023px) {
          .header-container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .nav-link-text {
            font-size: 0.7rem;
          }
          .search-box {
            width: 160px;
            display: block;
          }
          .desktop-nav {
            gap: 0.25rem;
          }
        }

        /* Mobile styles - hide desktop nav, hide search box, show hamburger */
        @media (max-width: 767px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .search-box {
            display: none; /* Hide search box on mobile */
          }
          .header-container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
          .mobile-menu {
            display: none;
          }
        }

        /* For very large screens */
        @media (min-width: 2000px) {
          .master-dropdown {
            min-width: 900px !important;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#9FE2BF] via-[#0A5C60] to-[#063B3E] shadow-md">
        {/* Animated wave pattern overlay */}
        <div className="absolute inset-0 wavy-bg"></div>
        
        {/* Main header content */}
        <div className="relative px-3 sm:px-4 lg:px-6 header-container">
          <div className="flex items-center justify-between h-14">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-3 relative z-10">
              {/* Mobile Menu Button - Only visible on mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-btn p-1.5 rounded-md hover:bg-white/10 text-white/90 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Logo */}
              <div className="flex items-center -ml-3 pl-3 pr-5 py-1">
                <img src="/se.png" className="h-7 w-auto relative z-10" alt="Logo" />
              </div>

              {/* Desktop Navigation Links - Hidden on mobile */}
              <div className="desktop-nav flex items-center space-x-0.5 ml-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-[#0A5C60] shadow-sm'
                        : 'text-white/90 hover:bg-white/20 hover:text-white'
                    }`
                  }
                  end
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="nav-link-text">Dashboard</span>
                </NavLink>

                {canAccessPage(MODULES.USERS, PAGES.USERS) && (
                  <NavLink
                    to="/users"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-[#0A5C60] shadow-sm'
                          : 'text-white/90 hover:bg-white/20 hover:text-white'
                      }`
                    }
                    end
                  >
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.1a9 9 0 10-18 0" />
                    </svg>
                    <span className="nav-link-text">Users</span>
                  </NavLink>
                )}

                {/* Master Dropdown */}
                {(filteredQuotationItems.length > 0 || filteredProcurementItems.length > 0 || filteredHRItems.length > 0 || filteredBOMItems.length > 0 || filteredSalesOrderItems.length > 0 || filteredMachineItems.length > 0) && (
                  <div className="relative" ref={masterRef}>
                    <button
                      onClick={() => toggleDropdown('master')}
                      className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                        activeDropdown === 'master' || isMasterActive(currentPath)
                          ? 'bg-white text-[#0A5C60] shadow-sm'
                          : 'text-white/90 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Master
                      <svg className={`w-3 h-3 ml-1 transition-transform ${activeDropdown === 'master' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Master Dropdown Menu - Desktop */}
                    {activeDropdown === 'master' && (
                      <div
                        ref={dropdownRef}
                        className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-[#9FE2BF] py-2 z-[100] flex dropdown-animation master-dropdown"
                        style={{ minWidth: '620px' }}
                      >
                        <div className="w-40 border-r border-[#9FE2BF] bg-[#F8FFFC]">
                          {masterCategories.map((category) => (
                            <div
                              key={category.type}
                              className={`relative px-3 py-2.5 cursor-pointer transition-all flex items-center justify-between ${
                                activeSubmenu === category.type
                                  ? 'bg-gradient-to-r from-[#9FE2BF]/20 to-white text-[#063B3E] border-l-2 border-[#0A5C60]'
                                  : 'text-[#4B5568] hover:bg-[#9FE2BF]/10 hover:text-[#0A5C60]'
                              }`}
                              onClick={() => handleCategoryClick(category.type)}
                            >
                              <div className="flex items-center">
                                <svg className="w-3.5 h-3.5 mr-2 text-[#0A5C60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                                </svg>
                                <span className="text-xs font-medium">{category.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div ref={submenuRef} className="flex-1 p-3">
                          <div className="mb-2">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <svg className="h-3.5 w-3.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                              <input
                                ref={masterSearchRef}
                                type="text"
                                placeholder={`Search ${activeSubmenu === 'quotation' ? 'Quotation' : activeSubmenu === 'procurement' ? 'Procurement' : activeSubmenu === 'hr' ? 'HR' : activeSubmenu === 'bom' ? 'BOM' : activeSubmenu === 'salesorder' ? 'Sales Order' : 'Machine'}...`}
                                className="w-full pl-8 pr-7 py-2 text-xs border border-[#E3E8EF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0A5C60] focus:border-transparent bg-white text-[#4B5568] placeholder-[#94A3B8]"
                                value={masterSearchTerm}
                                onChange={handleMasterSearch}
                              />
                              {masterSearchTerm && (
                                <button 
                                  onClick={clearMasterSearch}
                                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                                >
                                  <svg className="h-3.5 w-3.5 text-[#94A3B8] hover:text-[#0A5C60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="mb-1 px-2 flex justify-between items-center">
                            <h3 className="text-[11px] font-semibold text-[#4B5568] uppercase tracking-wider">
                              {activeSubmenu === 'quotation' ? 'Quotation' : activeSubmenu === 'procurement' ? 'Procurement' : activeSubmenu === 'hr' ? 'HR' : activeSubmenu === 'bom' ? 'BOM' : activeSubmenu === 'salesorder' ? 'Sales Order' : 'Machine'}
                            </h3>
                            <span className="text-[11px] text-[#94A3B8]">
                              {activeSubmenu === 'quotation' ? filteredQuotationItems.length : 
                               activeSubmenu === 'procurement' ? filteredProcurementItems.length : 
                               activeSubmenu === 'hr' ? filteredHRItems.length : 
                               activeSubmenu === 'bom' ? filteredBOMItems.length : 
                               activeSubmenu === 'salesorder' ? filteredSalesOrderItems.length : 
                               filteredMachineItems.length}
                            </span>
                          </div>

                          {/* Quotation Section */}
                          {activeSubmenu === 'quotation' && (
                            <div className="flex">
                              {quotationColumns.length > 0 ? (
                                quotationColumns.map((column, index) => (
                                  <div key={`quotation-col-${index}`} className={`w-48 ${index < quotationColumns.length - 1 ? 'border-r border-[#E3E8EF]' : ''}`}>
                                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                                      {column.map((item) => (
                                        <NavLink
                                          key={item.path}
                                          to={item.path}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDropdownItemClick(item.path, 'quotation');
                                          }}
                                          className={`flex items-center px-2 py-2 text-xs transition-all hover:bg-[#F8FFFC] rounded ${
                                            currentPath === item.path ? 'text-[#0A5C60] bg-[#F8FFFC]' : 'text-[#4B5568]'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5 mr-2 text-[#94A3B8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                          </svg>
                                          <span className="line-clamp-2 text-xs">
                                            {highlightText(item.name, masterSearchTerm)}
                                          </span>
                                        </NavLink>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="w-full py-5 text-center text-[#94A3B8] text-xs">
                                  No matches found
                                </div>
                              )}
                            </div>
                          )}

                          {/* Procurement Section */}
                          {activeSubmenu === 'procurement' && (
                            <div className="flex">
                              {procurementColumns.length > 0 ? (
                                procurementColumns.map((column, index) => (
                                  <div key={`procurement-col-${index}`} className={`w-48 ${index < procurementColumns.length - 1 ? 'border-r border-[#E3E8EF]' : ''}`}>
                                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                                      {column.map((item) => (
                                        <NavLink
                                          key={item.path}
                                          to={item.path}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDropdownItemClick(item.path, 'procurement');
                                          }}
                                          className={`flex items-center px-2 py-2 text-xs transition-all hover:bg-[#F8FFFC] rounded ${
                                            currentPath === item.path ? 'text-[#0A5C60] bg-[#F8FFFC]' : 'text-[#4B5568]'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5 mr-2 text-[#94A3B8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                          </svg>
                                          <span className="line-clamp-2 text-xs">
                                            {highlightText(item.name, masterSearchTerm)}
                                          </span>
                                        </NavLink>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="w-full py-5 text-center text-[#94A3B8] text-xs">
                                  No matches found
                                </div>
                              )}
                            </div>
                          )}

                          {/* HR Section */}
                          {activeSubmenu === 'hr' && (
                            <div className="flex">
                              {hrColumns.length > 0 ? (
                                hrColumns.map((column, index) => (
                                  <div key={`hr-col-${index}`} className={`w-48 ${index < hrColumns.length - 1 ? 'border-r border-[#E3E8EF]' : ''}`}>
                                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                                      {column.map((item) => (
                                        <NavLink
                                          key={item.path}
                                          to={item.path}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDropdownItemClick(item.path, 'hr');
                                          }}
                                          className={`flex items-center px-2 py-2 text-xs transition-all hover:bg-[#F8FFFC] rounded ${
                                            currentPath === item.path ? 'text-[#0A5C60] bg-[#F8FFFC]' : 'text-[#4B5568]'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5 mr-2 text-[#94A3B8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                          </svg>
                                          <span className="line-clamp-2 text-xs">
                                            {highlightText(item.name, masterSearchTerm)}
                                          </span>
                                        </NavLink>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="w-full py-5 text-center text-[#94A3B8] text-xs">
                                  No matches found
                                </div>
                              )}
                            </div>
                          )}

                          {/* BOM Section */}
                          {activeSubmenu === 'bom' && (
                            <div className="flex">
                              {bomColumns.length > 0 ? (
                                bomColumns.map((column, index) => (
                                  <div key={`bom-col-${index}`} className={`w-48 ${index < bomColumns.length - 1 ? 'border-r border-[#E3E8EF]' : ''}`}>
                                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                                      {column.map((item) => (
                                        <NavLink
                                          key={item.path}
                                          to={item.path}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDropdownItemClick(item.path, 'bom');
                                          }}
                                          className={`flex items-center px-2 py-2 text-xs transition-all hover:bg-[#F8FFFC] rounded ${
                                            currentPath === item.path ? 'text-[#0A5C60] bg-[#F8FFFC]' : 'text-[#4B5568]'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5 mr-2 text-[#94A3B8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                          </svg>
                                          <span className="line-clamp-2 text-xs">
                                            {highlightText(item.name, masterSearchTerm)}
                                          </span>
                                        </NavLink>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="w-full py-5 text-center text-[#94A3B8] text-xs">
                                  No matches found
                                </div>
                              )}
                            </div>
                          )}

                          {/* Sales Order Section */}
                          {activeSubmenu === 'salesorder' && (
                            <div className="flex">
                              {salesOrderColumns.length > 0 ? (
                                salesOrderColumns.map((column, index) => (
                                  <div key={`salesorder-col-${index}`} className={`w-48 ${index < salesOrderColumns.length - 1 ? 'border-r border-[#E3E8EF]' : ''}`}>
                                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                                      {column.map((item) => (
                                        <NavLink
                                          key={item.path}
                                          to={item.path}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDropdownItemClick(item.path, 'salesorder');
                                          }}
                                          className={`flex items-center px-2 py-2 text-xs transition-all hover:bg-[#F8FFFC] rounded ${
                                            currentPath === item.path ? 'text-[#0A5C60] bg-[#F8FFFC]' : 'text-[#4B5568]'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5 mr-2 text-[#94A3B8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                          </svg>
                                          <span className="line-clamp-2 text-xs">
                                            {highlightText(item.name, masterSearchTerm)}
                                          </span>
                                        </NavLink>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="w-full py-5 text-center text-[#94A3B8] text-xs">
                                  No matches found
                                </div>
                              )}
                            </div>
                          )}

                          {/* Machine Section */}
                          {activeSubmenu === 'machine' && (
                            <div className="flex">
                              {machineColumns.length > 0 ? (
                                machineColumns.map((column, index) => (
                                  <div key={`machine-col-${index}`} className={`w-48 ${index < machineColumns.length - 1 ? 'border-r border-[#E3E8EF]' : ''}`}>
                                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                                      {column.map((item) => (
                                        <NavLink
                                          key={item.path}
                                          to={item.path}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDropdownItemClick(item.path, 'machine');
                                          }}
                                          className={`flex items-center px-2 py-2 text-xs transition-all hover:bg-[#F8FFFC] rounded ${
                                            currentPath === item.path ? 'text-[#0A5C60] bg-[#F8FFFC]' : 'text-[#4B5568]'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5 mr-2 text-[#94A3B8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                          </svg>
                                          <span className="line-clamp-2 text-xs">
                                            {highlightText(item.name, masterSearchTerm)}
                                          </span>
                                        </NavLink>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="w-full py-5 text-center text-[#94A3B8] text-xs">
                                  No matches found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {canAccessPage(MODULES.ROLES, PAGES.ROLES) && (
                  <NavLink
                    to="/roles"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-[#0A5C60] shadow-sm'
                          : 'text-white/90 hover:bg-white/20 hover:text-white'
                      }`
                    }
                    end
                  >
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    <span className="nav-link-text">Roles</span>
                  </NavLink>
                )}
              </div>
            </div>

            {/* Right side - Search and Profile */}
            <div className="flex items-center space-x-2 relative z-10">
              {/* Search Box - Hidden on mobile via CSS */}
              <div className="search-box w-36 sm:w-40 md:w-48">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <svg className="h-3.5 w-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Quick search..."
                    className="w-full pl-8 pr-4 py-1.5 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-transparent text-white placeholder-white/50 text-xs backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center"
                    >
                      <svg className="h-3.5 w-3.5 text-white/50 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1.5 rounded-md hover:bg-white/10 text-white/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F59E0B] rounded-full ring-1 ring-[#0A5C60]"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-[#E3E8EF] py-1 z-50 dropdown-animation">
                    <div className="px-3 py-2 border-b border-[#E3E8EF] flex justify-between items-center">
                      <h3 className="text-xs font-medium text-[#151C26]">Notifications</h3>
                      <span className="text-[11px] text-[#0A5C60] cursor-pointer hover:text-[#063B3E]">Mark all</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`px-3 py-2.5 border-b border-[#F2F5F8] last:border-0 cursor-pointer hover:bg-[#F8FFFC] ${!notif.read ? 'bg-[#F0FDF9]' : ''}`}>
                          <div className="flex items-start gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? 'bg-[#0A5C60]' : 'bg-[#E3E8EF]'}`}></div>
                            <div>
                              <p className="text-xs text-[#4B5568]">{notif.text}</p>
                              <p className="text-[11px] text-[#94A3B8] mt-0.5">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-1.5 p-1 pr-1.5 rounded-md hover:bg-white/10 transition-colors group"
                  disabled={loading}
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xs font-semibold">
                    {loading ? (
                      <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  
                  <div className="hidden lg:block text-left">
                    {loading ? (
                      <>
                        <div className="h-2 w-14 bg-white/20 rounded mb-0.5"></div>
                        <div className="h-1.5 w-10 bg-white/20 rounded"></div>
                      </>
                    ) : userData ? (
                      <>
                        <p className="text-xs font-medium text-white truncate max-w-[80px]">
                          {userData.Username?.split(' ')[0] || 'User'}
                        </p>
                        <p className="text-[10px] text-white/70">
                          {userData.role?.RoleName || 'User'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-white">User</p>
                        <p className="text-[10px] text-white/70">Loading...</p>
                      </>
                    )}
                  </div>
                  
                  <svg 
                    className={`w-3 h-3 text-white/70 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-[#E3E8EF] py-1 z-50 dropdown-animation">
                    <div className="px-3 py-2 border-b border-[#E3E8EF]">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#F2F5F8] animate-pulse"></div>
                          <div className="space-y-1">
                            <div className="h-3 w-20 bg-[#F2F5F8] rounded"></div>
                            <div className="h-2 w-16 bg-[#F2F5F8] rounded"></div>
                          </div>
                        </div>
                      ) : userData ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9FE2BF] to-[#0A5C60] flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                            {getUserInitials()}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#151C26] truncate">
                              {userData.Username}
                            </p>
                            <p className="text-[11px] text-[#4B5568] truncate">
                              {userData.Email}
                            </p>
                            <span className="inline-block mt-0.5 px-1 py-0.5 bg-[#9FE2BF] text-[#0A5C60] text-[9px] rounded-full font-medium">
                              {userData.role?.RoleName || 'User'}
                            </span>
                            
                            <div className="mt-1 text-[10px] text-[#94A3B8] space-y-0.5">
                              <div className="flex items-center gap-1">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Joined: {userData.CreatedAt ? new Date(userData.CreatedAt).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-xs text-[#F43F5E] mb-2">{error || 'Unable to load user'}</p>
                          <button
                            onClick={fetchUserProfile}
                            className="px-3 py-1 text-xs bg-[#0A5C60] text-white rounded-md hover:bg-[#063B3E] transition-colors"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-1 px-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full px-3 py-2 bg-[#FEF3F2] hover:bg-[#FEE9E8] text-[#F43F5E] rounded-md transition-colors font-medium flex items-center justify-center gap-1 text-xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Only visible when menu is open */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="mobile-menu fixed inset-0 top-14 z-40 bg-white mobile-menu-animation"
            style={{ height: 'calc(100vh - 3.5rem)' }}
          >
            <div className="h-full overflow-y-auto">
              {/* Mobile Search - Now inside mobile menu */}
              <div className="p-4 border-b border-[#E3E8EF]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E3E8EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A5C60] focus:border-transparent text-[#151C26] placeholder-[#94A3B8] text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-4 w-4 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="py-2">
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? 'bg-[#9FE2BF]/20 text-[#0A5C60] border-l-4 border-[#0A5C60]'
                        : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                    }`
                  }
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </NavLink>

                {canAccessPage(MODULES.USERS, PAGES.USERS) && (
                  <NavLink
                    to="/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'bg-[#9FE2BF]/20 text-[#0A5C60] border-l-4 border-[#0A5C60]'
                          : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                      }`
                    }
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.1a9 9 0 10-18 0" />
                    </svg>
                    Users
                  </NavLink>
                )}

                {/* Mobile Master Section */}
                {(filteredQuotationItems.length > 0 || filteredProcurementItems.length > 0 || filteredHRItems.length > 0 || filteredBOMItems.length > 0 || filteredSalesOrderItems.length > 0 || filteredMachineItems.length > 0) && (
                  <div className="border-t border-[#E3E8EF] my-2">
                    <div className="px-4 py-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Master
                    </div>
                    
                    {/* Quotation Master Items */}
                    {filteredQuotationItems.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-medium text-[#0A5C60] bg-[#F8FFFC]">
                          Quotation Master
                        </div>
                        {filteredQuotationItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2.5 text-sm transition-colors pl-8 ${
                                isActive
                                  ? 'bg-[#9FE2BF]/20 text-[#0A5C60]'
                                  : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                              }`
                            }
                          >
                            <svg className="w-4 h-4 mr-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    )}

                    {/* Procurement Master Items */}
                    {filteredProcurementItems.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-medium text-[#0A5C60] bg-[#F8FFFC]">
                          Procurement Master
                        </div>
                        {filteredProcurementItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2.5 text-sm transition-colors pl-8 ${
                                isActive
                                  ? 'bg-[#9FE2BF]/20 text-[#0A5C60]'
                                  : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                              }`
                            }
                          >
                            <svg className="w-4 h-4 mr-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    )}

                    {/* HR Master Items */}
                    {filteredHRItems.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-medium text-[#0A5C60] bg-[#F8FFFC]">
                          HR Master
                        </div>
                        {filteredHRItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2.5 text-sm transition-colors pl-8 ${
                                isActive
                                  ? 'bg-[#9FE2BF]/20 text-[#0A5C60]'
                                  : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                              }`
                            }
                          >
                            <svg className="w-4 h-4 mr-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    )}

                    {/* BOM Master Items */}
                    {filteredBOMItems.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-medium text-[#0A5C60] bg-[#F8FFFC]">
                          BOM Master
                        </div>
                        {filteredBOMItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2.5 text-sm transition-colors pl-8 ${
                                isActive
                                  ? 'bg-[#9FE2BF]/20 text-[#0A5C60]'
                                  : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                              }`
                            }
                          >
                            <svg className="w-4 h-4 mr-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    )}

                    {/* Sales Order Master Items */}
                    {filteredSalesOrderItems.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-medium text-[#0A5C60] bg-[#F8FFFC]">
                          Sales Order Master
                        </div>
                        {filteredSalesOrderItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2.5 text-sm transition-colors pl-8 ${
                                isActive
                                  ? 'bg-[#9FE2BF]/20 text-[#0A5C60]'
                                  : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                              }`
                            }
                          >
                            <svg className="w-4 h-4 mr-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    )}

                    {/* Machine Master Items */}
                    {filteredMachineItems.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-medium text-[#0A5C60] bg-[#F8FFFC]">
                          Machine Master
                        </div>
                        {filteredMachineItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2.5 text-sm transition-colors pl-8 ${
                                isActive
                                  ? 'bg-[#9FE2BF]/20 text-[#0A5C60]'
                                  : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                              }`
                            }
                          >
                            <svg className="w-4 h-4 mr-3 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {canAccessPage(MODULES.ROLES, PAGES.ROLES) && (
                  <NavLink
                    to="/roles"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'bg-[#9FE2BF]/20 text-[#0A5C60] border-l-4 border-[#0A5C60]'
                          : 'text-[#4B5568] hover:bg-[#F8FFFC]'
                      }`
                    }
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    Roles
                  </NavLink>
                )}
              </div>

              {/* Mobile User Info */}
              <div className="border-t border-[#E3E8EF] mt-2 pt-2 px-4">
                <div className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9FE2BF] to-[#0A5C60] flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#151C26]">
                      {userData?.Username || 'User'}
                    </p>
                    <p className="text-xs text-[#4B5568]">
                      {userData?.Email || 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;