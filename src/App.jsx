import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/users/Users'
import Quotation from './pages/quotation/Quotation'
// import CustomerMaster from './pages/master/customermaster/CustomerMaster'
import ItemMaster from './pages/master/itemmaster/ItemMaster'
import MaterialMaster from './pages/master/materialmaster/MaterialMaster'  // Fixed: lowercase 'master'
import CompanyMaster from './pages/master/companymaster/CompanyMaster'    // Fixed: lowercase 'master'
import CostingMaster from './pages/master/costingmaster/CostingMaster'
import DimentionMaster from './pages/master/dimentionmaster/DimentionMaster'
import OperationMaster from './pages/master/operationmaster/OperationMaster'
import ProcessMaster from './pages/master/processmaster/ProcessMaster'
import QuotationMaster from './pages/master/quotationmaster/QuotationMaster'
import TaxMaster from './pages/master/taxmaster/TaxMaster'
import TermsAndConditionMaster from './pages/master/termsandconditionmaster/TermsAndConditionMaster'
import Login from './auth/Login'
import Registration from './auth/Registration'
import Roles from './pages/roles/Roles'
import DepartmentMaster from './pages/hrmaster/departmentmaster/DepartmentMaster'
import DesignationMaster from './pages/hrmaster/designationmaster/DesignationMaster'
import EmployeeMaster from './pages/hrmaster/employeemaster/EmployeeMaster'
import LeaveTypeMaster from './pages/hrmaster/leavetypemaster/LeaveTypeMaster'
import RawMaterialMaster from './pages/master/rawmaterialmaster/RawMaterialMaster'
import VendorMaster from './pages/master/vendormaster/VendorMaster'

import ApplyLeave from './pages/hrmaster/employeeleavemaster/EmployeeLeaveMaster'
import MyLeaves from './pages/hrmaster/employeeleavemaster/MyLeaves'
import LeaveApproval from './pages/hrmaster/employeeleavemaster/LeaveApproval'
import EmployeeLeaveMaster from './pages/hrmaster/employeeleavemaster/EmployeeLeaveMaster'
import AdminLeaveApproval from './pages/hrmaster/adminleavemaster/AdminLeaveApproval'
import ShiftMaster from './pages/hrmaster/shiftmaster/ShiftMaster'
//import MedicalRecordMaster from './pages/hrmaster/medicalrecordmaster/MedicalRecordMaster'
import AccidentMaster from './pages/hrmaster/accidentmaster/AccidentMaster'
import RequisitionMaster from './pages/hrmaster/requisitionmaster/RequisitionMaster'
import JobOpeningMaster from './pages/hrmaster/jobopeningmaster/JobOpeningMaster'
import CandidateMaster from './pages/hrmaster/candidatemaster/CandidateMaster'
import InterviewMaster from './pages/hrmaster/interviewmaster/InterviewMaster'
import SalaryMaster from './pages/hrmaster/salarymaster/SalaryMaster'
import PieceRateMaster from './pages/hrmaster/pieceratemaster/PieceRateMaster'
import RegularizationMaster from './pages/hrmaster/regularizationmaster/RegularizationMaster'
import ProductionMaster from './pages/hrmaster/productionmaster/ProductionMaster'
import TerminationMaster from './pages/hrmaster/terminationmaster/TerminationMaster'
import EmployeeBehaviorMaster from './pages/hrmaster/employeebehaviormaster/EmployeeBehaviorMaster'
import SelectedCandidatesMaster from './pages/hrmaster/selectedcandidatemsater/SelectedCandidatesMaster'
import ProcessDetailsMaster from './pages/master/processdetailsmaster/ProcessDetailsMaster'
import CompanyFinancialMaster from './pages/master/companyfinancialmaster/CompanyFinancialMaster'
import MediclaimMaster from './pages/hrmaster/mediclaimmaster/MediclaimMaster'
import LeadsMaster from './pages/master/leadsmaster/LeadsMaster'
import AddRoles from './pages/roles/AddRoles'
import AddUser from './pages/users/AddUser'
import CustomerMaster from './pages/master/customermaster/CustomerMaster'
import GRNMaster from './pages/procurementmaster/GRN/GRNMaster'
import PurchaseOrderMaster from './pages/procurementmaster/purchaseorder/PurchaseOrderMaster'
import PurchaseRequisitionMaster from './pages/procurementmaster/purchaserequisitions/PurchaseRequisitionMaster'
import RFQMaster from './pages/procurementmaster/RFQ/RfqMaster'
import PurchaseInvoiceMaster from './pages/procurementmaster/purchaseinvoice/PurchaseInvoiceMaster'
import TrainingRecordMaster from './pages/hrmaster/trainingrecord/TrainingRecordMaster'

import SalesOrderMaster from './pages/salesordermaster/SalesOrderMaster'
import OrderBook from './pages/salesordermaster/sodelivery/OrderBook'
import SORevise from './pages/salesordermaster/sorevision/SORevise'
import SOSummary from './pages/salesordermaster/soreports/SOSummary'
import SOPendingDelivery from './pages/salesordermaster/soreports/SOPendingDelivery'


import VendorPayments from './pages/procurementmaster/vendorpayments/VendorPayments'
import BomMaster from './pages/bommaster/BOM/BomMaster'
import MachineMaster from './pages/bommaster/machinemaster/MachineMaster'
import OeeMaster from './pages/bommaster/oeemaster/OeeMaster'
import RoutingMaster from './pages/bommaster/routing/RoutingMaster'
import MrpMaster from './pages/bommaster/MRP/MrpMaster'
import WorkOrdersMaster from './pages/productionmaster/workordersmaster/WorkOrdersMaster'
import WareHouseMaster from './pages/inventory management/warehousemaster/WareHouseMaster'
import MIVMaster from './pages/inventory management/materialissues/MIVMaster'
import MRVMaster from './pages/inventory management/materialreturnvoucher/MRVMaster'
import StockLedgerMaster from './pages/inventory management/stockledger/StockLedgerMaster'
import PSVMaster from './pages/inventory management/physicalstockverification/PSVMaster'
import DeliveryChallanMaster from './pages/dispatchmaster/deliverychallanmaster/DeliveryChallanMaster'
import AssemblyLineMaster from './pages/productionmaster/assemblylines/AssemblyLineMaster'
import ProductionScheduleMaster from './pages/productionmaster/productionschedule/ProductionScheduleMaster'
import ProductionConflict from './pages/productionmaster/productionconflict/ProductionConflict'
import DeliveryScheduleMaster from './pages/dispatchmaster/deliveryschedulemaster/DeliveryScheduleMaster'
import ToolMaster from './pages/productionmaster/toolmaster/ToolMaster'


const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')

  if (!isLoggedIn || isLoggedIn !== 'true') {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {
  return (
    <BrowserRouter>
    {/* // <BrowserRouter basename="/suyashtest-front"> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Protected Routes with Layout - Flat Structure */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
           <Route path="users/adduser" element={<AddUser />} />
          <Route path="quotation" element={<Quotation />} />
          {/* <Route path="master/customermaster" element={<CustomerMaster />} /> */}
          <Route path="master/vendormaster" element={<VendorMaster />} />
          <Route path="master/itemmaster" element={<ItemMaster />} />
          <Route path="master/companymaster" element={<CompanyMaster />} />
          <Route path="master/costingmaster" element={<CostingMaster />} />
          <Route path="master/dimentionmaster" element={<DimentionMaster />} />
          {/* <Route path="master/operationmaster" element={<OperationMaster />} /> */}
          <Route path="master/processmaster" element={<ProcessMaster />} />
           <Route path="master/customermaster" element={<CustomerMaster />} />
           <Route path="master/leadsmaster" element={<LeadsMaster />} />
          <Route path="master/quotationmaster" element={<QuotationMaster />} />
          <Route path="master/taxmaster" element={<TaxMaster />} />
          <Route path="master/termsandconditionmaster" element={<TermsAndConditionMaster />} />
          <Route path="master/companyfinancialmaster" element={<CompanyFinancialMaster />} />
          <Route path="master/materialmaster" element={<MaterialMaster />} />
          <Route path="master/processdetailsmaster" element={<ProcessDetailsMaster />} />
          <Route path="master/rawmaterialmaster" element={<RawMaterialMaster />} />
          <Route path="hrmaster/departmentmaster" element={<DepartmentMaster />} />
          <Route path="hrmaster/designationmaster" element={<DesignationMaster />} />
          <Route path="hrmaster/employeemaster" element={<EmployeeMaster />} />
          <Route path="hrmaster/leavetypemaster" element={<LeaveTypeMaster />} />
           <Route path="hrmaster/shiftmaster" element={<ShiftMaster />} />
            {/* <Route path="hrmaster/medicalmaster" element={<MedicalRecordMaster />} /> */}
             <Route path="hrmaster/accidentmaster" element={<AccidentMaster />} />
              <Route path="hrmaster/requisitionmaster" element={<RequisitionMaster />} />
              <Route path="hrmaster/jobopeningmaster" element={<JobOpeningMaster />} />
              <Route path="hrmaster/candidatemaster" element={<CandidateMaster />} />
              <Route path="hrmaster/selectedcandidatesmaster" element={<SelectedCandidatesMaster />} />
               <Route path="hrmaster/salarymaster" element={<SalaryMaster />} />
                 <Route path="hrmaster/pieceratemaster" element={<PieceRateMaster />} />
                  <Route path="hrmaster/regularizationmaster" element={<RegularizationMaster />} />
                  <Route path="hrmaster/productionmaster" element={<ProductionMaster />} />
                  <Route path="hrmaster/terminationmaster" element={<TerminationMaster />} />
                  <Route path="hrmaster/employeebehaviormaster" element={<EmployeeBehaviorMaster />} />
               <Route path="hrmaster/interviewmaster" element={<InterviewMaster />} />
               <Route path="hrmaster/mediclaimmaster" element={<MediclaimMaster />} />
          <Route path="roles" element={<Roles />} />
          <Route path="/roles/add" element={<AddRoles />} />

          <Route path='hrmaster/employeeleavemaster' element={<EmployeeLeaveMaster/>} />
          <Route path='hrmaster/adminleavemaster' element={<AdminLeaveApproval/>} />
          <Route path='hrmaster/trainingrecordmaster' element={<TrainingRecordMaster/>} />


          <Route path='procurementmaster/grnmaster' element={<GRNMaster/>} />
          <Route path='procurementmaster/purchaseordermaster' element={<PurchaseOrderMaster/>} />
          <Route path='procurementmaster/purchaserequisitionmaster' element={<PurchaseRequisitionMaster/>} />
          <Route path='procurementmaster/rfqmaster' element={<RFQMaster/>} />
          <Route path='procurementmaster/purchaseinvoicemaster' element={<PurchaseInvoiceMaster/>} />
          <Route path='procurementmaster/vendor-payments' element={<VendorPayments/>} />


          <Route path='bommaster/bommaster' element={<BomMaster/>} />
          <Route path='machinemaster/machinemaster' element={<MachineMaster/>} />
          <Route path='oeemaster/oeemaster' element={<OeeMaster/>} />
          <Route path='bommaster/MRP/MrpMaster' element={<MrpMaster />} />
          <Route path='bommaster/routing/routingmaster' element={<RoutingMaster />} />

          <Route path='salesordermaster/salesordermaster' element={<SalesOrderMaster/>} />
          <Route path='salesordermaster/orderbook' element={<OrderBook/>} />
          <Route path='salesordermaster/sorevision' element={<SORevise/>} />
          <Route path='salesordermaster/sosummary' element={<SOSummary/>} />
          <Route path='salesordermaster/sopendingdelivery' element={<SOPendingDelivery/>} />


          <Route path='inventorymanagement/warehousemaster' element={<WareHouseMaster />} />
          <Route path="inventorymanagement/stockledger" element={<StockLedgerMaster />} />
          <Route path='inventorymanagement/mivmaster' element={<MIVMaster />} />
          <Route path='inventorymanagement/mrvmaster' element={<MRVMaster />} />
          <Route path='inventorymanagement/psvmaster' element={<PSVMaster />} />

          <Route path='productionmaster/workordersmaster' element={<WorkOrdersMaster/>} />
           <Route path='productionmaster/assemblylines' element={<AssemblyLineMaster/>} />
             <Route path='productionmaster/productionschedule' element={<ProductionScheduleMaster/>} />
          <Route path='productionmaster/productionconflict' element={<ProductionConflict/>} />
          <Route path='productionmaster/toolmaster' element={<ToolMaster/>} />

          <Route path="/delivery-challan" element={<DeliveryChallanMaster />} />

          <Route path="/delivery-schedule" element={<DeliveryScheduleMaster />} />

        </Route>

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App