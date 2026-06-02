import { useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../config/Config";

/* ─── number-to-words (INR-aware) ───────────────────────────────────── */
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
  "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
  "Seventeen","Eighteen","Nineteen"];
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

function toWords(n) {
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
  if (n < 1000) return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + toWords(n%100) : "");
  if (n < 100000) return toWords(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " " + toWords(n%1000) : "");
  if (n < 10000000) return toWords(Math.floor(n/100000)) + " Lakh" + (n%100000 ? " " + toWords(n%100000) : "");
  return toWords(Math.floor(n/10000000)) + " Crore" + (n%10000000 ? " " + toWords(n%10000000) : "");
}

function amountInWords(amount) {
  const rupees = Math.floor(amount);
  const paise  = Math.round((amount - rupees) * 100);
  let words = "Rupees " + toWords(rupees);
  if (paise > 0) words += " and " + toWords(paise) + " Paise";
  return words + " Only";
}

/* ─── helpers ────────────────────────────────────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

const cur = (v) =>
  (v || v === 0)
    ? new Intl.NumberFormat("en-IN", { minimumFractionDigits:2, maximumFractionDigits:2 }).format(v)
    : "0.00";

/* ─── CSS injected into print window ────────────────────────────────── */
const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@page { margin: 0; size: A4; }

body {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: #1a1a2e;
  background: #fff;
  padding: 0;
}

.page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 16mm 14mm 10mm 14mm;
  background: #fff;
}

/* ── letterhead ── */
.lh {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 10px;
  border-bottom: 3px solid #063C3F;
  margin-bottom: 14px;
}
.lh-left h1 {
  font-family: 'DM Serif Display', serif;
  font-size: 22px;
  color: #063C3F;
  letter-spacing: -0.5px;
  line-height: 1;
}
.lh-left p { font-size: 9.5px; color: #666; margin-top: 3px; line-height: 1.55; }
.lh-right { text-align: right; }
.doc-badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
  background: #063C3F;
  padding: 4px 12px;
  border-radius: 2px;
  margin-bottom: 6px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.lh-right .dc-no { font-size: 15px; font-weight: 700; color: #063C3F; display: block; }
.lh-right .dc-date { font-size: 10px; color: #666; }
.status-pill {
  display: inline-block;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 10px;
  border-radius: 20px;
  background: #D1FAE5;
  color: #065F46;
  border: 1px solid #6EE7B7;
  margin-top: 5px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ── address strip ── */
.addr-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}
.addr-card {
  background: #F8FAFA;
  border: 1px solid #E2ECEC;
  border-top: 3px solid #063C3F;
  border-radius: 4px;
  padding: 10px 12px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.addr-card .role {
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #063C3F;
  margin-bottom: 6px;
}
.addr-card .name { font-weight: 600; font-size: 11px; margin-bottom: 2px; }
.addr-card p { font-size: 9.5px; color: #555; line-height: 1.55; }
.addr-card .gst { font-size: 9px; color: #888; margin-top: 3px; }

/* ── section ── */
.sec { margin-bottom: 14px; }
.sec-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #063C3F;
  margin-bottom: 8px;
}
.sec-head::after { content: ''; flex: 1; height: 1px; background: #C2D8D8; }

/* ── meta grid ── */
.meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.meta-item .lbl {
  font-size: 8.5px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 2px;
}
.meta-item .val { font-size: 10.5px; font-weight: 600; color: #1a1a2e; }

/* ── table ── */
table { width: 100%; border-collapse: collapse; font-size: 10px; }
thead tr { background: #063C3F; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
thead th {
  padding: 7px 9px;
  color: #fff;
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  text-align: left;
}
thead th.r { text-align: right; }
thead th.c { text-align: center; }
tbody tr { border-bottom: 1px solid #E8EFEF; }
tbody tr:nth-child(even) { background: #F8FAFA; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
tbody td { padding: 7px 9px; color: #333; vertical-align: middle; }
tbody td.r { text-align: right; }
tbody td.c { text-align: center; }
tfoot tr { background: #EAF2F2; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
tfoot td { padding: 7px 9px; font-weight: 600; font-size: 10px; }

/* ── totals ── */
.totals-wrap { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 12px; gap: 16px; }
.tax-box {
  flex: 1;
  background: #F0F7F7;
  border: 1px solid #C2D8D8;
  border-radius: 4px;
  padding: 10px 12px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.tax-box .th-lbl { font-size: 8.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #063C3F; margin-bottom: 6px; }
.tax-row { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 3px; }
.tax-row span:last-child { font-weight: 500; }
.summary-box { width: 230px; }
.sum-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 10px; border-bottom: 1px solid #E8EFEF; color: #444; }
.sum-row.grand { border-bottom: none; border-top: 2px solid #063C3F; margin-top: 4px; padding-top: 8px; font-size: 12px; font-weight: 700; color: #063C3F; }

.words-box {
  margin-top: 10px;
  padding: 9px 12px;
  background: #F8FAFA;
  border-left: 3px solid #063C3F;
  font-size: 9.5px;
  border-radius: 0 4px 4px 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.words-box strong { color: #063C3F; display: block; margin-bottom: 2px; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.8px; }

/* ── signature ── */
.sig-wrap { display: flex; justify-content: space-between; margin-top: 32px; }
.sig-box { width: 200px; text-align: center; }
.sig-line { border-top: 1.5px solid #333; padding-top: 6px; font-size: 9.5px; color: #444; }

/* ── footer ── */
.footer { margin-top: 24px; padding-top: 10px; border-top: 1px dashed #BBB; display: flex; justify-content: space-between; font-size: 8.5px; color: #999; }
`;

/* ─── HTML builder ───────────────────────────────────────────────────── */
function buildHTML(data) {
  const taxable = data.items?.reduce((s, i) => s + (i.taxable_value || 0), 0) || 0;
  const tax     = taxable * 0.18;
  const grand   = taxable + tax;

  const addrCard = (role, name, gstin, addr) => `
    <div class="addr-card">
      <div class="role">${role}</div>
      <div class="name">${name || "—"}</div>
      ${gstin ? `<p class="gst">GSTIN: ${gstin}</p>` : ""}
      <p>
        ${[addr?.line1, addr?.line2].filter(Boolean).join(", ")}
        ${addr?.city ? `<br/>${addr.city}, ${addr.state} – ${addr.pincode}` : ""}
      </p>
    </div>`;

  const metaField = (label, value) => `
    <div class="meta-item">
      <div class="lbl">${label}</div>
      <div class="val">${value || "—"}</div>
    </div>`;

  const itemRows = (data.items || []).map((item, i) => `
    <tr>
      <td class="c" style="color:#888">${i + 1}</td>
      <td style="font-family:monospace;font-size:9.5px">${item.part_no || "—"}</td>
      <td style="font-weight:500">${item.part_name || "—"}</td>
      <td>${item.hsn_code || "—"}</td>
      <td class="c" style="font-weight:600">${item.dispatch_qty || 0}</td>
      <td class="c" style="color:#666">${item.unit || "Nos"}</td>
      <td class="r">${cur(item.unit_price)}</td>
      <td class="c">18%</td>
      <td class="r" style="font-weight:600">${cur(item.taxable_value)}</td>
    </tr>`).join("");

  const packingSection = data.packing?.length ? `
    <div class="sec">
      <div class="sec-head">Packing Details</div>
      <table>
        <thead><tr>
          <th>Packages</th><th>Type</th>
          <th class="c">Gross Wt (kg)</th><th class="c">Net Wt (kg)</th>
          <th class="c">Dimensions (L×W×H mm)</th>
        </tr></thead>
        <tbody>
          ${data.packing.map(p => `<tr>
            <td class="c">${p.no_of_packages || 0}</td>
            <td>${p.packing_type || "—"}</td>
            <td class="c">${p.gross_weight_kg || 0}</td>
            <td class="c">${p.net_weight_kg || 0}</td>
            <td class="c">${p.dimension_l_mm && p.dimension_w_mm && p.dimension_h_mm
              ? `${p.dimension_l_mm} × ${p.dimension_w_mm} × ${p.dimension_h_mm}` : "—"}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>` : "";

  const transportSection = (data.transport?.transporter_name || data.transport?.vehicle_no) ? `
    <div class="sec">
      <div class="sec-head">Transport Details</div>
      <div class="meta">
        ${metaField("Dispatch Mode",     data.transport?.dispatch_mode)}
        ${metaField("Transporter",       data.transport?.transporter_name)}
        ${metaField("Transporter GSTIN", data.transport?.transporter_gstin)}
        ${metaField("Vehicle No",        data.transport?.vehicle_no)}
        ${metaField("LR Number",         data.transport?.lr_number)}
        ${metaField("LR Date",           fmt(data.transport?.lr_date))}
        ${metaField("Freight Terms",     data.transport?.freight_terms)}
      </div>
    </div>` : "";

  const ewbSection = data.eway_bill?.eway_bill_number ? `
    <div class="sec">
      <div class="sec-head">E-Way Bill Details</div>
      <div class="meta">
        ${metaField("EWB Number", data.eway_bill.eway_bill_number)}
        ${metaField("Status",     data.eway_bill.eway_bill_status || "Generated")}
        ${metaField("Valid Till", fmt(data.eway_bill.eway_bill_validity_date))}
        ${metaField("Mode",       data.eway_bill.eway_bill_mode || "Manual")}
      </div>
    </div>` : "";

  const podSection = data.pod?.pod_received ? `
    <div class="sec">
      <div class="sec-head">Proof of Delivery</div>
      <div class="meta">
        ${metaField("Delivery Date", fmt(data.pod.actual_delivery_date))}
        ${metaField("POD Date",      fmt(data.pod.pod_date))}
        ${metaField("Signed By",     data.pod.pod_signed_by)}
        ${metaField("Remarks",       data.pod.delivery_remarks)}
      </div>
    </div>` : "";

  const gateSection = data.gate_pass?.gate_pass_no ? `
    <div class="sec">
      <div class="sec-head">Gate Pass Details</div>
      <div class="meta">
        ${metaField("Gate Pass No",     data.gate_pass.gate_pass_no)}
        ${metaField("Gate Pass Time",   fmt(data.gate_pass.gate_pass_time))}
        ${metaField("Security Officer", data.gate_pass.security_officer)}
      </div>
    </div>` : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Delivery Challan</title>
  <style>${PRINT_CSS}</style>
</head>
<body>
<div class="page">

  <!-- Letterhead -->
  <div class="lh">
    <div class="lh-left">
      <h1>${data.company_name || "Suyash Enterprises"}</h1>
      <p>
        GSTIN: ${data.company_gstin || "—"}<br/>
        ${[data.company_address?.line1, data.company_address?.line2].filter(Boolean).join(", ")}<br/>
        ${data.company_address?.city || ""}, ${data.company_address?.state || ""} – ${data.company_address?.pincode || ""}
      </p>
    </div>
    <div class="lh-right">
      <span class="doc-badge">Delivery Challan</span>
      <span class="dc-no">${data.dc_number || "—"}</span>
      <span class="dc-date">Date: ${fmt(data.dc_date)}</span><br/>
      <span class="status-pill">${data.status || "Delivered"}</span>
    </div>
  </div>

  <!-- Address Strip -->
  <div class="addr-strip">
    ${addrCard("Bill From", data.company_name,  data.company_gstin,  data.company_address)}
    ${addrCard("Bill To",   data.customer_name, data.customer_gstin, data.billing_address)}
    ${addrCard("Ship To",   data.customer_name, null,                data.ship_to)}
  </div>

  <!-- Document Details -->
  <div class="sec">
    <div class="sec-head">Document Details</div>
    <div class="meta">
      ${metaField("DC Number",     data.dc_number)}
      ${metaField("DC Date",       fmt(data.dc_date))}
      ${metaField("SO Number",     data.so_number)}
      ${metaField("DC Type",       data.dc_type)}
      ${metaField("Payment Terms", data.challan_meta?.payment_terms)}
      ${metaField("Customer PO",   data.customer_po_number)}
      ${metaField("GST Type",      data.gst_type)}
      ${metaField("EWB Number",    data.eway_bill?.eway_bill_number)}
    </div>
  </div>

  ${transportSection}

  <!-- Items Table -->
  <div class="sec">
    <div class="sec-head">Items Details</div>
    <table>
      <thead>
        <tr>
          <th style="width:4%">#</th>
          <th style="width:13%">Part No.</th>
          <th style="width:22%">Part Name</th>
          <th style="width:10%">HSN Code</th>
          <th class="c" style="width:8%">Qty</th>
          <th class="c" style="width:7%">Unit</th>
          <th class="r" style="width:12%">Unit Price (₹)</th>
          <th class="c" style="width:10%">GST%</th>
          <th class="r" style="width:14%">Taxable Val (₹)</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="8" style="font-weight:700;text-align:right;padding-right:12px">Total Taxable Value</td>
          <td class="r" style="font-weight:700">₹ ${cur(taxable)}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  ${packingSection}

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="tax-box">
      <div class="th-lbl">Tax Breakup (18% GST)</div>
      <div class="tax-row"><span>Taxable Value</span><span>₹ ${cur(taxable)}</span></div>
      <div class="tax-row"><span>CGST @ 9%</span><span>₹ ${cur(taxable * 0.09)}</span></div>
      <div class="tax-row"><span>SGST @ 9%</span><span>₹ ${cur(taxable * 0.09)}</span></div>
    </div>
    <div class="summary-box">
      <div class="sum-row"><span>Total Taxable Value</span><span>₹ ${cur(taxable)}</span></div>
      <div class="sum-row"><span>Total Tax (CGST + SGST)</span><span>₹ ${cur(tax)}</span></div>
      <div class="sum-row grand"><span>Grand Total</span><span>₹ ${cur(grand)}</span></div>
    </div>
  </div>

  <!-- Amount in Words -->
  <div class="words-box">
    <strong>Amount in Words</strong>
    ${amountInWords(grand)}
  </div>

  ${ewbSection}
  ${podSection}
  ${gateSection}

  <!-- Signatures -->
  <div class="sig-wrap">
    <div class="sig-box"><div class="sig-line">Receiver's Signature &amp; Stamp</div></div>
    <div class="sig-box"><div class="sig-line">For ${data.company_name || "Suyash Enterprises"}</div></div>
  </div>



</div>
</body>
</html>`;
}

/* ─── component ──────────────────────────────────────────────────────── */
const PrintDeliveryChallan = ({ open, onClose, deliveryChallan }) => {

  useEffect(() => {
    if (!open || !deliveryChallan?._id) return;

    let cancelled = false;

    const run = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/api/delivery-challans/${deliveryChallan._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (cancelled) return;

        const data = res.data.data;
        const html = buildHTML(data);

        const w = window.open("", "_blank");
        if (!w) {
          alert("Please allow popups to print.");
          onClose?.();
          return;
        }

        w.document.write(html);
        w.document.close();

        // Wait for fonts/images, then print
        w.onload = () => {
          setTimeout(() => {
            w.focus();
            w.print();
            w.onafterprint = () => {
              w.close();
              onClose?.();
            };
          }, 400);
        };

      } catch (err) {
        console.error("Error fetching delivery challan:", err);
        alert("Failed to load delivery challan data.");
        onClose?.();
      }
    };

    run();
    return () => { cancelled = true; };
  }, [open, deliveryChallan]);

  // No UI — this component is invisible; it just triggers the print flow
  return null;
};

export default PrintDeliveryChallan;