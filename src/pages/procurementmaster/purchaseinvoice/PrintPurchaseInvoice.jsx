import React, { useEffect, useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogTitle, DialogActions,
  Button, CircularProgress, Alert, IconButton, Box,
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
  // Float-based header — avoids flex overflow in browser popup windows
  header: {
    width: "100%",
    borderBottom: "2px solid #222",
    padding: "18px 24px 14px 24px",
    background: "#fff",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  hColLeft: {
    float: "left",
    width: "33%",
    boxSizing: "border-box",
    paddingRight: "8px",
  },
  hColCenter: {
    float: "left",
    width: "34%",
    boxSizing: "border-box",
    textAlign: "center",
    paddingTop: "6px",
  },
  hColRight: {
    float: "left",
    width: "33%",
    boxSizing: "border-box",
    paddingLeft: "8px",
    textAlign: "right",
    fontSize: "11px",
    lineHeight: "1.7",
    color: "#444",
    wordBreak: "break-word",
  },
  clearfix: { clear: "both", display: "block", height: "0" },
  companyName: { fontSize: "13px", fontWeight: "bold", marginBottom: "2px", wordBreak: "break-word" },
  invoiceTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#222",
    whiteSpace: "nowrap",
  },
  invoiceSub: { fontSize: "11px", color: "#888", marginTop: "4px", letterSpacing: "1px" },
  body: { padding: "20px 24px 24px 24px", boxSizing: "border-box" },
  twoCol: { display: "flex", gap: "24px", marginBottom: "20px" },
  col: { flex: 1, minWidth: 0 },
  sectionTitle: {
    fontSize: "12.5px",
    fontWeight: "bold",
    background: "#f0f0f0",
    padding: "7px 12px",
    marginBottom: "10px",
    borderLeft: "4px solid #222",
    borderRadius: "0 3px 3px 0",
    color: "#222",
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
  detailValue: { flex: 1, color: "#222", wordBreak: "break-word", fontSize: "12px" },
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
    background: "#2b2b2b",
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
  summaryOuter: { display: "flex", justifyContent: "flex-end", marginTop: "14px" },
  summaryRow: (bold, topBorder) => ({
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 12px",
    fontWeight: bold ? "bold" : "500",
    fontSize: bold ? "14px" : "12px",
    borderTop: topBorder ? "2px solid #222" : "none",
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
  itcBox: {
    marginTop: "10px",
    padding: "10px 14px",
    background: "#ecfdf5",
    borderRadius: "4px",
    borderLeft: "3px solid #10B981",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12.5px",
  },
  amountWords: {
    marginTop: "14px",
    padding: "9px 12px",
    background: "#f9f9f9",
    borderRadius: "4px",
    borderLeft: "3px solid #444",
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
  sigBox: { textAlign: "center", width: "200px" },
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
    Approved: S.chip("#065F46", "#D1FAE5"),
    Posted: S.chip("#065F46", "#D1FAE5"),
    Pending: S.chip("#0C4A6E", "#E0F2FE"),
    "Under Verification": S.chip("#0C4A6E", "#E0F2FE"),
    Exception: S.chip("#92400E", "#FEF3C7"),
    Hold: S.chip("#92400E", "#FEF3C7"),
  };
  return map[status] || S.chip("#444", "#eee");
};

// ─── Component ────────────────────────────────────────────────────────────────
const PrintPurchaseInvoice = ({ open, onClose, invoice }) => {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (open && invoice?._id) fetchInvoiceDetails();
  }, [open, invoice]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}/api/purchase-invoices/${invoice._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data.data);
    } catch (err) {
      setError("Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR",
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
  };

  const numberToWords = (num) => {
    if (!num) return "Zero";
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
      "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    const nw = (n) => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " "+ones[n%10] : "");
      if (n < 1000) return ones[Math.floor(n/100)]+" Hundred"+(n%100 ? " "+nw(n%100) : "");
      if (n < 100000) return nw(Math.floor(n/1000))+" Thousand"+(n%1000 ? " "+nw(n%1000) : "");
      if (n < 10000000) return nw(Math.floor(n/100000))+" Lakh"+(n%100000 ? " "+nw(n%100000) : "");
      return nw(Math.floor(n/10000000))+" Crore"+(n%10000000 ? " "+nw(n%10000000) : "");
    };
    const amt = Math.floor(num);
    const paise = Math.round((num - amt) * 100);
    return nw(amt)+" Rupees"+(paise > 0 ? " and "+nw(paise)+" Paise" : "");
  };

  const generateAndOpenPDF = async (shouldPrint = false) => {
    const el = printRef.current?.querySelector("[data-invoice-root]");
    if (!el) return;
    try {
      setPdfLoading(true);
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Invoice - ${data?.purchase_invoice_number || "Preview"}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: Arial, Helvetica, sans-serif;
      background: #c8c8c8;
      padding: 28px 16px;
      min-height: 100vh;
    }
    /* Lock the invoice to A4 width and centre it in the popup */
    [data-invoice-root] {
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
      [data-invoice-root] {
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
      if (!newWindow) { alert("Please allow popups for this site."); return; }
      newWindow.document.open();
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.document.title = `Invoice_${data?.purchase_invoice_number || "Preview"}`;
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
        <DialogContent><Alert severity="error">{error}</Alert></DialogContent>
        <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
      </Dialog>
    );
  }

  const companyInfo = data?.company_id || {};
  const items = data?.items || [];
  const taxableTotal = data?.taxable_total || 0;
  const totalTax = data?.total_tax || 0;
  const grandTotal = data?.grand_total || 0;
  const tdsAmount = data?.tds_amount || 0;
  const itcAmount = data?.itc_amount || totalTax;

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
        display: "flex", justifyContent: "space-between", alignItems: "center",
        bgcolor: "#2b2b2b", color: "#fff", flexShrink: 0, py: 1.5, px: 2.5,
      }}>
        <span style={{ fontSize: "15px", fontWeight: 600 }}>
          Purchase Invoice — {data?.purchase_invoice_number || "Loading..."}
        </span>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Scrollable Content */}
      <DialogContent sx={{
        p: 0, flex: 1, overflow: "auto",
        display: "flex", justifyContent: "center", alignItems: "flex-start",
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
              width: "100%", minHeight: "100%",
              display: "flex", justifyContent: "center", alignItems: "flex-start",
              py: 3, px: 2,
            }}
          >
            {/* ══ INVOICE PAPER ══ */}
            <div data-invoice-root="" style={S.page}>

              {/* HEADER — float columns (most reliable across popup + print) */}
              <div style={S.header}>
                <div style={S.hColLeft}>
                  <img
                    src="/se.png" alt="Logo"
                    style={{ height: "60px", maxWidth: "100%", display: "block" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                <div style={S.hColCenter}>
                  <div style={S.invoiceTitle}>TAX INVOICE</div>
                  <div style={S.invoiceSub}>PURCHASE</div>
                </div>
                <div style={S.hColRight}>
                  <div style={S.companyName}>{data?.company_name || "Suyash Enterprises"}</div>
                  <div>{companyInfo.address || "Nashik, Maharashtra"}</div>
                  <div>GSTIN: {data?.company_gstin || "27AAACM3025E1ZZ"}</div>
                  <div>Email: {companyInfo.email || "info@suyash.com"}</div>
                  <div>Phone: {companyInfo.phone || "+91 9876543210"}</div>
                </div>
                <div style={S.clearfix} />
              </div>

              {/* BODY */}
              <div style={S.body}>

                {/* Two-column: Invoice Details + Vendor Info */}
                <div style={S.twoCol}>
                  <div style={S.col}>
                    <div style={S.sectionTitle}>Invoice Details</div>
                    {[
                      ["Invoice Number", <strong key="i">{data?.purchase_invoice_number || "N/A"}</strong>],
                      ["Vendor Invoice No", data?.vendor_invoice_no || "N/A"],
                      ["Invoice Date", formatDate(data?.invoice_date)],
                      ["Vendor Inv. Date", formatDate(data?.vendor_invoice_date)],
                      ["PO Number", data?.po_number || "N/A"],
                      ["GRN Numbers", data?.grn_numbers?.join(", ") || "N/A"],
                      ["Due Date", formatDate(data?.due_date)],
                      ["Payment Status",
                        <span key="p" style={data?.payment_status === "Fully Paid"
                          ? S.chip("#065F46","#D1FAE5") : S.chip("#0C4A6E","#E0F2FE")}>
                          {data?.payment_status || "Unpaid"}
                        </span>],
                      ["Invoice Status",
                        <span key="s" style={chipStyle(data?.status)}>{data?.status || "Pending"}</span>],
                      ["Matching Status",
                        <span key="m" style={chipStyle(data?.matching_status)}>{data?.matching_status || "Not Started"}</span>],
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
                      ["Vendor Name", <strong key="vn">{data?.vendor_name || "N/A"}</strong>],
                      ["Vendor Code", data?.vendor_code || "N/A"],
                      ["GSTIN", data?.vendor_gstin || "N/A"],
                      ["PAN", data?.vendor_pan || "N/A"],
                      ["State", `${data?.vendor_state || ""} (${data?.vendor_state_code || ""})`],
                      ["Address", data?.vendor_address || "N/A"],
                    ].map(([label, value], i) => (
                      <div key={i} style={S.detailRow}>
                        <span style={S.detailLabel}>{label}:</span>
                        <span style={S.detailValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items Table */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={S.sectionTitle}>Invoice Items</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        {[["#","5%","center"],["Part No","11%","left"],["Description","19%","left"],
                          ["HSN","8%","center"],["Qty","7%","center"],["Unit Price","12%","right"],
                          ["Taxable Amt","12%","right"],["GST%","7%","center"],["Total","14%","right"],
                        ].map(([h, w, a]) => (
                          <th key={h} style={{ ...S.th(a), width: w }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ ...S.td("center"), padding:"18px", color:"#aaa" }}>
                            No items found
                          </td>
                        </tr>
                      ) : items.map((item, i) => (
                        <tr key={item._id || i}>
                          <td style={S.td("center",false,i%2!==0)}>{i+1}</td>
                          <td style={S.td("left",false,i%2!==0)}><strong>{item.part_no||"N/A"}</strong></td>
                          <td style={S.td("left",false,i%2!==0)}>{item.description||"N/A"}</td>
                          <td style={S.td("center",false,i%2!==0)}>{item.hsn_code||"N/A"}</td>
                          <td style={S.td("center",false,i%2!==0)}>{item.quantity||0}</td>
                          <td style={S.td("right",false,i%2!==0)}>{formatCurrency(item.unit_price)}</td>
                          <td style={S.td("right",false,i%2!==0)}>{formatCurrency(item.taxable_amount)}</td>
                          <td style={S.td("center",false,i%2!==0)}>{item.gst_percent||0}%</td>
                          <td style={S.td("right",true,i%2!==0)}>{formatCurrency(item.total_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div style={S.summaryOuter}>
                  <div style={{ width: "44%" }}>
                    {[
                      ["Sub Total", formatCurrency(taxableTotal), false, false],
                      ...(data?.gst_type === "CGST/SGST"
                        ? [
                            [`CGST (${((data?.cgst_total/taxableTotal)*100||0).toFixed(1)}%)`, formatCurrency(data?.cgst_total||0), false, false],
                            [`SGST (${((data?.sgst_total/taxableTotal)*100||0).toFixed(1)}%)`, formatCurrency(data?.sgst_total||0), false, false],
                          ]
                        : [[`IGST (${((data?.igst_total/taxableTotal)*100||0).toFixed(1)}%)`, formatCurrency(data?.igst_total||0), false, false]]),
                      ["Total Tax", formatCurrency(totalTax), false, false],
                      ["Grand Total", formatCurrency(grandTotal), true, true],
                    ].map(([label, value, bold, topBorder], i) => (
                      <div key={i} style={S.summaryRow(bold, topBorder)}>
                        <span>{label}</span><span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TDS */}
                {data?.tds_applicable && tdsAmount > 0 && (
                  <div style={S.tdsBox}>
                    <div style={S.rowBetween}>
                      <span><strong>TDS ({data?.tds_section} @ {data?.tds_rate}%):</strong></span>
                      <span style={{ fontSize:"15px", fontWeight:"bold", color:"#D97706" }}>
                        {formatCurrency(tdsAmount)}
                      </span>
                    </div>
                    <div style={{ ...S.rowBetween, marginTop:"8px", paddingTop:"8px", borderTop:"1px dashed #F59E0B" }}>
                      <span><strong>Net Payable:</strong></span>
                      <span style={{ fontSize:"15px", fontWeight:"bold", color:"#10B981" }}>
                        {formatCurrency(data?.net_payable || (grandTotal - tdsAmount))}
                      </span>
                    </div>
                  </div>
                )}

                {/* ITC */}
                <div style={S.itcBox}>
                  <div style={S.rowBetween}>
                    <span><strong>Input Tax Credit (ITC) Eligible:</strong></span>
                    <span style={{ fontSize:"15px", fontWeight:"bold", color:"#10B981" }}>
                      {formatCurrency(itcAmount)}
                    </span>
                  </div>
                  {data?.itc_claimed_in && (
                    <div style={{ marginTop:"6px", fontSize:"11.5px", color:"#065F46" }}>
                      Claimed in: {data.itc_claimed_in}
                    </div>
                  )}
                </div>

                {/* Amount in Words */}
                <div style={S.amountWords}>
                  <strong>Amount in Words: </strong>
                  {numberToWords(data?.net_payable || grandTotal)} Only
                </div>

                {/* Signature */}
                <div style={S.signature}>
                  <div style={S.sigBox}>
                    <div style={S.sigLine}>For {data?.company_name || "Suyash Enterprises"}</div>
                  </div>
                  <div style={S.sigBox}>
                    <div style={S.sigLine}>Authorized Signatory</div>
                  </div>
                </div>

                {/* Footer */}
                <div style={S.footer}>
                  This is a computer generated invoice — No signature required
                  {data?.financial_year && <><br />Financial Year: {data.financial_year}</>}
                </div>
              </div>
            </div>
          </Box>
        )}
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions sx={{ p: 2, bgcolor: "#2b2b2b", borderTop: "1px solid #444", gap: 1, flexShrink: 0 }}>
        <Button
          variant="outlined"
          startIcon={pdfLoading ? <CircularProgress size={18} sx={{ color:"#fff" }} /> : <PictureAsPdf />}
          onClick={() => generateAndOpenPDF(false)}
          disabled={loading || !data || pdfLoading}
          sx={{ minWidth:130, color:"#fff", borderColor:"#888",
            "&:hover":{ borderColor:"#ccc", background:"rgba(255,255,255,0.06)" } }}
        >
          {pdfLoading ? "Loading..." : "Preview PDF"}
        </Button>
        <Button
          variant="contained"
          startIcon={pdfLoading ? <CircularProgress size={18} /> : <Print />}
          onClick={() => generateAndOpenPDF(true)}
          disabled={loading || !data || pdfLoading}
          sx={{ minWidth:130, bgcolor:"#063C3F", "&:hover":{ bgcolor:"#0a5558" } }}
        >
          {pdfLoading ? "Printing..." : "Print"}
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ color:"#ccc", borderColor:"#888",
            "&:hover":{ borderColor:"#ccc", background:"rgba(255,255,255,0.06)" } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintPurchaseInvoice;