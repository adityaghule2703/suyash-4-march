import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Box
} from "@mui/material";
import { Print, Close } from "@mui/icons-material";
import axios from "axios";
import html2pdf from "html2pdf.js";

import BASE_URL from "../../../config/Config";

const PrintQuotation = ({ open, onClose, quotation }) => {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (open && quotation?._id) fetchQuotation();
  }, [open, quotation]);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}/api/quotations/${quotation._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Handle array response
      const quotationData = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
      setData(quotationData);
    } catch (err) {
      setError("Failed to load quotation");
      console.error("Error fetching quotation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!printRef.current) return;
    
    try {
      setPdfLoading(true);
      
      const printContainer = printRef.current.querySelector('.print-container');
      if (!printContainer) {
        throw new Error('Print container not found');
      }
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Quotation - ${data?.QuotationNo || 'Quotation'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: Arial, Helvetica, sans-serif;
            }
            
            body {
              background: white;
              padding: 20px;
            }
            
            .print-container {
              max-width: 210mm;
              margin: 0 auto;
              background: white;
              padding: 20px;
            }
            
            /* Header Styles */
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            
            .logo img {
              height: 60px;
            }
            
            .title {
              text-align: center;
            }
            
            .title h1 {
              font-size: 24px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .company-info {
              text-align: right;
              font-size: 12px;
              line-height: 1.5;
            }
            
            /* Section Styles */
            .section {
              margin-bottom: 25px;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: bold;
              background: #f0f0f0;
              padding: 8px 12px;
              margin-bottom: 15px;
              border-left: 4px solid #333;
            }
            
            /* Details Grid */
            .details-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              padding: 0 10px;
            }
            
            .detail-row {
              display: flex;
              align-items: baseline;
            }
            
            .detail-label {
              font-weight: 600;
              min-width: 120px;
              color: #555;
            }
            
            .detail-value {
              flex: 1;
            }
            
            /* Table Styles */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 13px;
            }
            
            th {
              background: #333;
              color: white;
              padding: 10px;
              text-align: left;
              font-weight: 500;
            }
            
            td {
              padding: 8px 10px;
              border-bottom: 1px solid #ddd;
            }
            
            tr:last-child td {
              border-bottom: none;
            }
            
            .text-right {
              text-align: right;
            }
            
            .text-center {
              text-align: center;
            }
            
            /* Process Table */
            .process-table {
              width: 95%;
              margin: 5px 0 10px 5%;
              background: #f9f9f9;
              border-radius: 4px;
            }
            
            .process-table td {
              padding: 5px 10px;
              border-bottom: 1px solid #e0e0e0;
              font-size: 12px;
            }
            
            .process-title {
              font-weight: 600;
              color: #555;
              padding: 8px 10px;
              background: #eee;
            }
            
            /* Summary Table */
            .summary-table {
              width: 40%;
              margin-left: auto;
              margin-top: 20px;
            }
            
            .summary-table td {
              padding: 8px 15px;
              border: none;
            }
            
            .summary-table tr:last-child td {
              font-weight: bold;
              font-size: 16px;
              border-top: 2px solid #333;
            }
            
            /* Terms & Conditions */
            .terms {
              margin-top: 30px;
              padding: 15px;
              background: #f9f9f9;
              border-radius: 4px;
            }
            
            .terms ol {
              margin-left: 20px;
              margin-top: 10px;
            }
            
            .terms li {
              margin-bottom: 5px;
              font-size: 12px;
            }
            
            /* Signature */
            .signature {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
              padding: 0 20px;
            }
            
            .signature-box {
              text-align: center;
              width: 200px;
            }
            
            .signature-line {
              margin-top: 40px;
              border-top: 1px solid #333;
              padding-top: 8px;
              font-size: 12px;
            }
            
            /* Footer */
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px dashed #999;
              text-align: center;
              font-size: 11px;
              color: #666;
            }
            
            @media print {
              body { padding: 0; }
              .print-container { padding: 15px; }
              th { background: #333 !important; color: white !important; -webkit-print-color-adjust: exact; }
              .section-title { background: #f0f0f0 !important; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContainer.innerHTML}
        </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to print');
        return;
      }
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.print();
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
      
    } catch (error) {
      console.error('Error printing:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0.00";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!data && !loading && error) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">{error}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const companyInfo = data?.CompanyID || {};
  const items = data?.Items || [];

  return (
    <Dialog 
      open={open} 
      maxWidth="lg" 
      fullWidth 
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: '210mm',
          margin: '0 auto',
          height: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: '#f5f5f5' }}>
        <span style={{ fontSize: '18px', fontWeight: 600 }}>Quotation - {data?.QuotationNo || "Loading..."}</span>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

     <DialogContent sx={{ p: 0, bgcolor: '#fafafa', display: 'flex', justifyContent: 'center' }}>
  {loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="500px">
      <CircularProgress />
    </Box>
  ) : (
    <div ref={printRef} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div className="print-container" style={{ 
        maxWidth: '210mm', 
        margin: '20px auto',
        background: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '8px'
      }}>
        {/* Updated Header with better spacing */}
        <div className="header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px',
          borderBottom: '2px solid #333',
          padding: '20px 20px 15px 20px'
        }}>
          <div className="logo" style={{ flex: 1 }}>
            <img src="/se.png" alt="Suyash Enterprises" style={{ height: '70px' }} />
          </div>
          <div className="title" style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold',
              margin: 0,
              color: '#333'
            }}>QUOTATION</h1>
          </div>
          <div className="company-info" style={{ 
            flex: 1, 
            textAlign: 'right',
            fontSize: '12px',
            lineHeight: '1.6'
          }}>
            <div><strong style={{ fontSize: '14px' }}>{companyInfo.CompanyName || "Suyash Enterprises"}</strong></div>
            <div>{companyInfo.Address || "Nashik, Maharashtra"}</div>
            <div>GST: {data?.CompanyGSTIN || companyInfo.GSTIN || "27ABCDE1234F1Z5"}</div>
            <div>Email: {companyInfo.Email || "info@company.com"}</div>
            <div>Phone: {companyInfo.Phone || "+91 9876543210"}</div>
          </div>
        </div>

        {/* Content with proper padding */}
        <div style={{ padding: '0 20px 20px 20px' }}>
          {/* Quotation Details */}
          <div className="section" style={{ marginBottom: '25px' }}>
            <div className="section-title" style={{
              fontSize: '16px',
              fontWeight: 'bold',
              background: '#f0f0f0',
              padding: '10px 15px',
              marginBottom: '15px',
              borderLeft: '4px solid #333',
              borderRadius: '0 4px 4px 0'
            }}>Quotation Details</div>
            <div className="details-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
              padding: '0 10px'
            }}>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Quotation No:</span>
                <span className="detail-value"><strong>{data?.QuotationNo || "N/A"}</strong></span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Date:</span>
                <span className="detail-value">{formatDate(data?.QuotationDate)}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Valid Till:</span>
                <span className="detail-value">{formatDate(data?.ValidTill)}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Type:</span>
                <span className="detail-value">{data?.QuotationType || "Standard"}</span>
              </div>
            </div>
          </div>

          {/* Vendor Details */}
          <div className="section" style={{ marginBottom: '25px' }}>
            <div className="section-title" style={{
              fontSize: '16px',
              fontWeight: 'bold',
              background: '#f0f0f0',
              padding: '10px 15px',
              marginBottom: '15px',
              borderLeft: '4px solid #333',
              borderRadius: '0 4px 4px 0'
            }}>Vendor Details</div>
            <div className="details-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              padding: '0 10px'
            }}>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Vendor Name:</span>
                <span className="detail-value"><strong>{data?.VendorName || "N/A"}</strong></span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>GSTIN:</span>
                <span className="detail-value">{data?.VendorGSTIN || "N/A"}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Address:</span>
                <span className="detail-value">{data?.VendorAddress || "N/A"}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>City/Pincode:</span>
                <span className="detail-value">{data?.VendorCity || "N/A"} - {data?.VendorPincode || "N/A"}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>State:</span>
                <span className="detail-value">{data?.VendorState || "N/A"} ({data?.VendorStateCode || "N/A"})</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Contact:</span>
                <span className="detail-value">{data?.VendorContactPerson || "N/A"}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Phone:</span>
                <span className="detail-value">{data?.VendorPhone || "N/A"}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-label" style={{ fontWeight: 600, minWidth: '120px', color: '#555' }}>Email:</span>
                <span className="detail-value">{data?.VendorEmail || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="section" style={{ marginBottom: '25px' }}>
            <div className="section-title" style={{
              fontSize: '16px',
              fontWeight: 'bold',
              background: '#f0f0f0',
              padding: '10px 15px',
              marginBottom: '15px',
              borderLeft: '4px solid #333',
              borderRadius: '0 4px 4px 0'
            }}>Items & Process Details</div>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '0 auto',
              fontSize: '13px',
              border: '1px solid #ddd'
            }}>
              <thead>
                <tr>
                  <th style={{ background: '#333', color: 'white', padding: '12px', textAlign: 'left' }} width="5%">#</th>
                  <th style={{ background: '#333', color: 'white', padding: '12px', textAlign: 'left' }} width="12%">Part No</th>
                  <th style={{ background: '#333', color: 'white', padding: '12px', textAlign: 'left' }} width="20%">Description</th>
                  <th style={{ background: '#333', color: 'white', padding: '12px', textAlign: 'left' }} width="8%">HSN</th>
                  <th style={{ background: '#333', color: 'white', padding: '12px', textAlign: 'left' }} width="5%">Qty</th>
                  <th style={{ background: '#333', color: 'white', padding: '12px', textAlign: 'right' }} width="10%">Rate (₹)</th>
                  <th style={{ background: '#333', color: 'white', padding: '12px', textAlign: 'right' }} width="10%">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <React.Fragment key={item._id || index}>
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}><strong>{item.PartNo || "N/A"}</strong></td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {item.PartName || "N/A"}
                        {item.Description && <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{item.Description}</div>}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{item.HSNCode || "N/A"}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{item.Quantity || 0}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{formatCurrency(item.FinalRate)}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{formatCurrency(item.Amount)}</td>
                    </tr>
                    {item.Processes && item.Processes.length > 0 && (
                      <tr>
                        <td colSpan="7" style={{ padding: 0 }}>
                          <table style={{
                            width: '95%',
                            margin: '0 0 10px 5%',
                            background: '#f9f9f9',
                            borderRadius: '4px',
                            borderCollapse: 'collapse'
                          }}>
                            <tr>
                              <td colSpan="4" style={{ 
                                padding: '8px 10px', 
                                background: '#eee',
                                fontWeight: 600,
                                color: '#555'
                              }}>Process Breakdown:</td>
                            </tr>
                            {item.Processes.map((process, pIdx) => (
                              <tr key={pIdx}>
                                <td style={{ padding: '6px 10px', borderBottom: '1px solid #e0e0e0' }} width="30%">{process.ProcessName || "N/A"}</td>
                                <td style={{ padding: '6px 10px', borderBottom: '1px solid #e0e0e0' }} width="20%">{process.RateType || "N/A"}</td>
                                <td style={{ padding: '6px 10px', borderBottom: '1px solid #e0e0e0' }} width="20%">{process.VendorOrInhouse || "N/A"}</td>
                                <td style={{ padding: '6px 10px', borderBottom: '1px solid #e0e0e0', textAlign: 'right' }} width="30%">₹ {formatCurrency(process.Price)}</td>
                              </tr>
                            ))}
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary - Right Aligned */}
          <table style={{
            width: '40%',
            marginLeft: 'auto',
            marginTop: '20px',
            borderCollapse: 'collapse'
          }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 15px', textAlign: 'right', fontWeight: 500 }}>Sub Total:</td>
                <td style={{ padding: '8px 15px', textAlign: 'right', fontWeight: 500 }}>₹ {formatCurrency(data?.SubTotal || 0)}</td>
              </tr>
              {data?.GSTPercentage > 0 && (
                <tr>
                  <td style={{ padding: '8px 15px', textAlign: 'right', fontWeight: 500 }}>GST ({data.GSTPercentage}% {data?.GSTType || "IGST"}):</td>
                  <td style={{ padding: '8px 15px', textAlign: 'right', fontWeight: 500 }}>₹ {formatCurrency(data?.GSTAmount || 0)}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '8px 15px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', borderTop: '2px solid #333' }}>Grand Total:</td>
                <td style={{ padding: '8px 15px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', borderTop: '2px solid #333' }}>₹ {formatCurrency(data?.GrandTotal || 0)}</td>
              </tr>
            </tbody>
          </table>

          {/* Amount in Words */}
          <div style={{ 
            margin: '20px 0', 
            fontSize: '14px',
            padding: '10px',
            background: '#f9f9f9',
            borderRadius: '4px',
            borderLeft: '3px solid #333'
          }}>
            <strong>Amount in Words:</strong> {data?.AmountInWords || `Rupees ${formatCurrency(data?.GrandTotal || 0)} Only`}
          </div>

          {/* Terms & Conditions */}
          {data?.TermsConditions && data.TermsConditions.length > 0 && (
            <div className="terms" style={{
              marginTop: '30px',
              padding: '15px',
              background: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <strong style={{ fontSize: '14px', display: 'block', marginBottom: '10px' }}>Terms & Conditions:</strong>
              <ol style={{ marginLeft: '20px', marginTop: '5px' }}>
                {data.TermsConditions
                  .sort((a, b) => (a.Sequence || 0) - (b.Sequence || 0))
                  .map((term, index) => (
                    <li key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                      <strong>{term.Title}:</strong> {term.Description}
                    </li>
                  ))}
              </ol>
            </div>
          )}

          {/* Remarks */}
          {(data?.InternalRemarks || data?.CustomerRemarks) && (
            <div style={{ 
              margin: '20px 0', 
              padding: '12px', 
              background: '#fff3cd', 
              borderRadius: '4px',
              border: '1px solid #ffeeba'
            }}>
              {data?.InternalRemarks && (
                <div><strong style={{ color: '#856404' }}>Internal Remarks:</strong> <span style={{ color: '#856404' }}>{data.InternalRemarks}</span></div>
              )}
              {data?.CustomerRemarks && (
                <div style={{ marginTop: data?.InternalRemarks ? '8px' : 0 }}>
                  <strong style={{ color: '#856404' }}>Customer Remarks:</strong> <span style={{ color: '#856404' }}>{data.CustomerRemarks}</span>
                </div>
              )}
            </div>
          )}

          {/* Signature */}
          <div className="signature" style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '50px',
            padding: '0 20px'
          }}>
            <div className="signature-box" style={{ textAlign: 'center', width: '250px' }}>
              <div style={{
                marginTop: '40px',
                borderTop: '1px solid #333',
                paddingTop: '8px',
                fontSize: '12px'
              }}>For {data?.CompanyName || companyInfo.CompanyName || "Suyash Enterprises"}</div>
            </div>
            <div className="signature-box" style={{ textAlign: 'center', width: '250px' }}>
              <div style={{
                marginTop: '40px',
                borderTop: '1px solid #333',
                paddingTop: '8px',
                fontSize: '12px'
              }}>Authorized Signatory</div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer" style={{
            marginTop: '30px',
            paddingTop: '15px',
            borderTop: '1px dashed #999',
            textAlign: 'center',
            fontSize: '11px',
            color: '#666'
          }}>
            This is a computer generated quotation - No signature required
          </div>
        </div>
      </div>
    </div>
  )}
</DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #ddd' }}>
        <Button 
          variant="contained" 
          startIcon={pdfLoading ? <CircularProgress size={20} /> : <Print />}
          onClick={handlePrint}
          disabled={loading || !data || pdfLoading}
          sx={{ minWidth: 120 }}
        >
          {pdfLoading ? "Printing..." : "Print"}
        </Button>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintQuotation;