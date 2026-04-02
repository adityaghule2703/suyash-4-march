// PaymentReceipt.jsx
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
  Box,
} from "@mui/material";
import { Print, Close, PictureAsPdf } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// ─── All styles as JS objects (100% inline — no className) ───────────────────
const S = {
  page: {
    width: "794px",
    minWidth: "794px",
    maxWidth: "794px",
    background: "#fff",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    color: "#333",
    boxSizing: "border-box",
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
  },
  header: {
    width: "100%",
    borderBottom: "2px solid #063C3F",
    padding: "18px 24px 14px 24px",
    background: "#fff",
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoSection: {
    flex: "0 0 auto",
  },
  titleSection: {
    flex: "1",
    textAlign: "center",
    paddingTop: "6px",
  },
  companySection: {
    flex: "0 0 auto",
    textAlign: "right",
    fontSize: "11px",
    lineHeight: "1.7",
    color: "#444",
    wordBreak: "break-word",
  },
  logo: {
    height: "60px",
    maxWidth: "100%",
    display: "block",
  },
  receiptTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#063C3F",
    whiteSpace: "nowrap",
  },
  receiptSub: {
    fontSize: "11px",
    color: "#888",
    marginTop: "4px",
    letterSpacing: "1px",
  },
  companyName: {
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "2px",
    wordBreak: "break-word",
  },
  body: {
    padding: "20px 24px 24px 24px",
    boxSizing: "border-box",
  },
  twoCol: {
    display: "flex",
    gap: "24px",
    marginBottom: "20px",
  },
  col: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    fontSize: "12.5px",
    fontWeight: "bold",
    background: "#f0f0f0",
    padding: "7px 12px",
    marginBottom: "10px",
    borderLeft: "4px solid #063C3F",
    borderRadius: "0 3px 3px 0",
    color: "#063C3F",
  },
  detailRow: {
    display: "flex",
    alignItems: "baseline",
    fontSize: "12px",
    lineHeight: "1.5",
    marginBottom: "8px",
    paddingLeft: "4px",
  },
  detailLabel: {
    fontWeight: "600",
    minWidth: "128px",
    color: "#555",
    flexShrink: 0,
    fontSize: "11.5px",
  },
  detailValue: {
    flex: 1,
    color: "#222",
    wordBreak: "break-word",
    fontSize: "12px",
  },
  chip: (color, bg) => ({
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    background: bg,
    color: color,
  }),
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
    border: "1px solid #ddd",
  },
  th: (align) => ({
    background: "#063C3F",
    color: "#fff",
    padding: "9px 8px",
    textAlign: align || "left",
    fontWeight: "500",
    fontSize: "11.5px",
  }),
  td: (align, bold, stripe) => ({
    padding: "8px",
    borderBottom: "1px solid #e8e8e8",
    verticalAlign: "middle",
    textAlign: align || "left",
    fontWeight: bold ? "bold" : "normal",
    background: stripe ? "#fafafa" : "#fff",
  }),
  summaryOuter: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "14px",
  },
  summaryRow: (bold, topBorder) => ({
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 12px",
    fontWeight: bold ? "bold" : "500",
    fontSize: bold ? "14px" : "12px",
    borderTop: topBorder ? "2px solid #063C3F" : "none",
    marginTop: topBorder ? "4px" : "0",
    color: bold ? "#111" : "#444",
  }),
  tdsBox: {
    marginTop: "14px",
    padding: "10px 14px",
    background: "#fff8ec",
    borderRadius: "4px",
    borderLeft: "3px solid #F59E0B",
  },
  amountWords: {
    marginTop: "14px",
    padding: "9px 12px",
    background: "#f9f9f9",
    borderRadius: "4px",
    borderLeft: "3px solid #063C3F",
    fontSize: "12px",
    lineHeight: "1.6",
    color: "#333",
  },
  signature: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "44px",
    padding: "0 12px",
  },
  sigBox: {
    textAlign: "center",
    width: "200px",
  },
  sigLine: {
    marginTop: "36px",
    borderTop: "1px solid #555",
    paddingTop: "6px",
    fontSize: "11.5px",
    color: "#444",
  },
  footer: {
    marginTop: "24px",
    paddingTop: "10px",
    borderTop: "1px dashed #bbb",
    textAlign: "center",
    fontSize: "11px",
    color: "#888",
    lineHeight: "1.7",
  },
};

const chipStyle = (status) => {
  const map = {
    Paid: S.chip("#065F46", "#D1FAE5"),
    Approved: S.chip("#065F46", "#D1FAE5"),
    Pending: S.chip("#0C4A6E", "#E0F2FE"),
    Initiated: S.chip("#0C4A6E", "#E0F2FE"),
    Bounced: S.chip("#991B1B", "#FEE2E2"),
    Cancelled: S.chip("#475569", "#F1F5F9"),
    Failed: S.chip("#991B1B", "#FEE2E2"),
  };
  return map[status] || S.chip("#444", "#eee");
};

// Number to words converter
const numberToWords = (num) => {
  if (!num || num === 0) return "Zero";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  const nw = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + nw(n % 100) : "");
    if (n < 100000) return nw(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + nw(n % 1000) : "");
    if (n < 10000000) return nw(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + nw(n % 100000) : "");
    return nw(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + nw(n % 10000000) : "");
  };
  
  const amt = Math.floor(num);
  const paise = Math.round((num - amt) * 100);
  return nw(amt) + " Rupees" + (paise > 0 ? " and " + nw(paise) + " Paise" : "");
};

const PaymentReceipt = ({ open, onClose, payment }) => {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (open && payment?._id) {
      fetchPaymentDetails();
    }
  }, [open, payment]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}/api/vendor-payments/${payment._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data.data);
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setError("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const generateAndOpenPDF = async (shouldPrint = false) => {
    const el = printRef.current?.querySelector("[data-payment-root]");
    if (!el) return;
    
    try {
      setPdfLoading(true);
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Payment Receipt - ${data?.vendor_payment_number || "Preview"}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: Arial, Helvetica, sans-serif;
      background: #c8c8c8;
      padding: 28px 16px;
      min-height: 100vh;
    }
    [data-payment-root] {
      display: block !important;
      width: 794px !important;
      min-width: 794px !important;
      max-width: 794px !important;
      margin: 0 auto !important;
      background: #fff !important;
      overflow: hidden !important;
      font-family: Arial, Helvetica, sans-serif !important;
    }
    @media print {
      html, body { background: #fff !important; padding: 0 !important; margin: 0 !important; }
      [data-payment-root] {
        box-shadow: none !important;
        width: 100% !important;
        min-width: unset !important;
        max-width: 100% !important;
      }
      @page { size: A4; margin: 1cm; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  ${el.outerHTML}
</body>
</html>`;
      
      const newWindow = window.open("", "_blank");
      if (!newWindow) {
        alert("Please allow popups for this site.");
        return;
      }
      newWindow.document.open();
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.document.title = `Payment_Receipt_${data?.vendor_payment_number || "Preview"}`;
      
      if (shouldPrint) {
        newWindow.addEventListener("load", () => newWindow.print());
      }
    } catch (e) {
      console.error(e);
      alert("Error generating preview. Please try again.");
    } finally {
      setPdfLoading(false);
    }
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

  const paymentData = data || payment;
  if (!paymentData) return null;

  const companyInfo = {
    name: "Suyash Enterprises",
    address: "Nashik, Maharashtra",
    gstin: "27AAACM3025E1ZZ",
    email: "info@suyash.com",
    phone: "+91 9876543210",
  };

  const totalAmount = paymentData.amount || 0;
  const tdsAmount = paymentData.tds_amount || 0;
  const netPaid = paymentData.net_paid || (totalAmount - tdsAmount);
  const allocations = paymentData.allocations || [];

  return (
    <Dialog
      open={open}
      maxWidth="xl"
      fullWidth
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: "900px",
          margin: "16px auto",
          height: "92vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#c8c8c8",
        },
      }}
    >
      {/* Title Bar */}
      <DialogTitle sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#063C3F",
        color: "#fff",
        flexShrink: 0,
        py: 1.5,
        px: 2.5,
      }}>
        <span style={{ fontSize: "15px", fontWeight: 600 }}>
          Payment Receipt — {paymentData.vendor_payment_number || "Loading..."}
        </span>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Scrollable Content */}
      <DialogContent sx={{
        p: 0,
        flex: 1,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#c8c8c8",
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%" minHeight="500px">
            <CircularProgress />
          </Box>
        ) : (
          <Box
            ref={printRef}
            sx={{
              width: "100%",
              minHeight: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              py: 3,
              px: 2,
            }}
          >
            {/* ══ PAYMENT RECEIPT PAPER ══ */}
            <div data-payment-root="" style={S.page}>

              {/* HEADER - Logo Left, Title Center, Company Details Right */}
              <div style={S.header}>
                {/* Left - Logo */}
                <div style={S.logoSection}>
                  <img
                    src="/logo.png"
                    alt="Logo"
                    style={S.logo}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                
                {/* Center - Title */}
                <div style={S.titleSection}>
                  <div style={S.receiptTitle}>PAYMENT RECEIPT</div>
                  <div style={S.receiptSub}>VENDOR PAYMENT CONFIRMATION</div>
                </div>
                
                {/* Right - Company Details */}
                <div style={S.companySection}>
                  <div style={S.companyName}>{companyInfo.name}</div>
                  <div>{companyInfo.address}</div>
                  <div>GSTIN: {companyInfo.gstin}</div>
                  <div>Email: {companyInfo.email}</div>
                  <div>Phone: {companyInfo.phone}</div>
                </div>
              </div>

              {/* BODY */}
              <div style={S.body}>

                {/* Two-column: Payment Details + Vendor Info */}
                <div style={S.twoCol}>
                  <div style={S.col}>
                    <div style={S.sectionTitle}>Payment Details</div>
                    {[
                      ["Payment Number", <strong key="pn">{paymentData.vendor_payment_number || "N/A"}</strong>],
                      ["Payment Date", formatDate(paymentData.payment_date)],
                      ["Payment Mode", paymentData.payment_mode || "N/A"],
                      ["Reference Number", paymentData.reference_no || "N/A"],
                      ["Status",
                        <span key="s" style={chipStyle(paymentData.status)}>
                          {paymentData.status || "Pending"}
                        </span>],
                    ].map(([label, value], i) => (
                      <div key={i} style={S.detailRow}>
                        <span style={S.detailLabel}>{label}:</span>
                        <span style={S.detailValue}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={S.col}>
                    <div style={S.sectionTitle}>Vendor Information</div>
                    {[
                      ["Vendor Name", <strong key="vn">{paymentData.vendor_name || "N/A"}</strong>],
                      ["GSTIN", paymentData.vendor_gstin || "N/A"],
                      ["PAN", paymentData.vendor_pan || "N/A"],
                    ].map(([label, value], i) => (
                      <div key={i} style={S.detailRow}>
                        <span style={S.detailLabel}>{label}:</span>
                        <span style={S.detailValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bank Account Details */}
                {paymentData.from_bank_account && paymentData.from_bank_account.bank_name && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={S.sectionTitle}>Bank Account Details</div>
                    <div style={S.detailRow}>
                      <span style={S.detailLabel}>Bank Name:</span>
                      <span style={S.detailValue}>{paymentData.from_bank_account.bank_name}</span>
                    </div>
                    <div style={S.detailRow}>
                      <span style={S.detailLabel}>Account Number:</span>
                      <span style={S.detailValue}>{paymentData.from_bank_account.account_no}</span>
                    </div>
                    <div style={S.detailRow}>
                      <span style={S.detailLabel}>IFSC Code:</span>
                      <span style={S.detailValue}>{paymentData.from_bank_account.ifsc}</span>
                    </div>
                  </div>
                )}

                {/* Vendor Bank Account Details */}
                {paymentData.vendor_bank_details && paymentData.vendor_bank_details.bank_name && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={S.sectionTitle}>Vendor Bank Details</div>
                    <div style={S.detailRow}>
                      <span style={S.detailLabel}>Bank Name:</span>
                      <span style={S.detailValue}>{paymentData.vendor_bank_details.bank_name}</span>
                    </div>
                    <div style={S.detailRow}>
                      <span style={S.detailLabel}>Account Name:</span>
                      <span style={S.detailValue}>{paymentData.vendor_bank_details.account_name || "N/A"}</span>
                    </div>
                    <div style={S.detailRow}>
                      <span style={S.detailLabel}>Account Number:</span>
                      <span style={S.detailValue}>{paymentData.vendor_bank_details.account_no}</span>
                    </div>
                    <div style={S.detailRow}>
                      <span style={S.detailLabel}>IFSC Code:</span>
                      <span style={S.detailValue}>{paymentData.vendor_bank_details.ifsc}</span>
                    </div>
                  </div>
                )}

                {/* Invoices Paid Table */}
                {allocations.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={S.sectionTitle}>Invoices Paid</div>
                    <table style={S.table}>
                      <thead>
                        <tr>
                          <th style={S.th("left")} width="40%">Invoice No.</th>
                          <th style={S.th("left")} width="25%">Date</th>
                          <th style={S.th("right")} width="15%">Invoice Amount</th>
                          <th style={S.th("right")} width="20%">Paid Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocations.map((alloc, index) => (
                          <tr key={index}>
                            <td style={S.td("left", false, index % 2 !== 0)}>
                              {alloc.invoice_number}
                            </td>
                            <td style={S.td("left", false, index % 2 !== 0)}>
                              {formatDate(alloc.invoice_date)}
                            </td>
                            <td style={S.td("right", false, index % 2 !== 0)}>
                              {formatCurrency(alloc.invoice_amount)}
                            </td>
                            <td style={S.td("right", true, index % 2 !== 0)}>
                              {formatCurrency(alloc.allocated_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Amount Breakdown */}
                <div style={S.summaryOuter}>
                  <div style={{ width: "44%" }}>
                    {[
                      ["Total Amount", formatCurrency(totalAmount), false, false],
                      ...(tdsAmount > 0 ? [[
                        `TDS (${paymentData.tds_section || "194Q"} @ ${paymentData.tds_rate || 0}%)`,
                        `-${formatCurrency(tdsAmount)}`,
                        false,
                        false
                      ]] : []),
                      ["Net Amount Paid", formatCurrency(netPaid), true, true],
                    ].map(([label, value, bold, topBorder], i) => (
                      <div key={i} style={S.summaryRow(bold, topBorder)}>
                        <span>{label}</span>
                        <span style={{ color: label.includes("TDS") ? "#F59E0B" : "#063C3F" }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TDS Details Card */}
                {tdsAmount > 0 && (
                  <div style={S.tdsBox}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span><strong>TDS Deduction Details:</strong></span>
                      <span style={{ fontSize: "15px", fontWeight: "bold", color: "#F59E0B" }}>
                        {formatCurrency(tdsAmount)}
                      </span>
                    </div>
                    <div style={{ marginTop: "8px", fontSize: "11px", color: "#666" }}>
                      Section: {paymentData.tds_section || "194Q"} | Rate: {paymentData.tds_rate || 0}%
                    </div>
                    <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #F59E0B" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span><strong>Net Amount Transferred:</strong></span>
                        <span style={{ fontSize: "15px", fontWeight: "bold", color: "#10B981" }}>
                          {formatCurrency(netPaid)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amount in Words */}
                <div style={S.amountWords}>
                  <strong>Amount in Words: </strong>
                  {numberToWords(netPaid)} Only
                </div>

                {/* Remarks */}
                {paymentData.remarks && (
                  <div style={{ marginTop: "14px", padding: "10px 14px", background: "#f0f0f0", borderRadius: "4px" }}>
                    <strong>Remarks:</strong> {paymentData.remarks}
                  </div>
                )}

                {/* Signature */}
                <div style={S.signature}>
                  <div style={S.sigBox}>
                    <div style={S.sigLine}>For {companyInfo.name}</div>
                  </div>
                  <div style={S.sigBox}>
                    <div style={S.sigLine}>Authorized Signatory</div>
                  </div>
                </div>

                {/* Footer */}
                <div style={S.footer}>
                  This is a computer generated payment receipt — No signature required
                  <br />
                  Generated on: {formatDate(new Date())}
                </div>
              </div>
            </div>
          </Box>
        )}
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions sx={{ 
        p: 2, 
        bgcolor: "#063C3F", 
        borderTop: "1px solid #2c5a5e", 
        gap: 1, 
        flexShrink: 0 
      }}>
        <Button
          variant="outlined"
          startIcon={pdfLoading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <PictureAsPdf />}
          onClick={() => generateAndOpenPDF(false)}
          disabled={loading || !data || pdfLoading}
          sx={{ 
            minWidth: 130, 
            color: "#fff", 
            borderColor: "#6c9a9e",
            "&:hover": { borderColor: "#fff", background: "rgba(255,255,255,0.06)" } 
          }}
        >
          {pdfLoading ? "Loading..." : "Preview PDF"}
        </Button>
        <Button
          variant="contained"
          startIcon={pdfLoading ? <CircularProgress size={18} /> : <Print />}
          onClick={() => generateAndOpenPDF(true)}
          disabled={loading || !data || pdfLoading}
          sx={{ 
            minWidth: 130, 
            bgcolor: "#fff", 
            color: "#063C3F",
            "&:hover": { bgcolor: "#f0f0f0" } 
          }}
        >
          {pdfLoading ? "Printing..." : "Print Receipt"}
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ 
            color: "#fff", 
            borderColor: "#6c9a9e",
            "&:hover": { borderColor: "#fff", background: "rgba(255,255,255,0.06)" } 
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentReceipt;