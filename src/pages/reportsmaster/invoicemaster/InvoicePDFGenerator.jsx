// InvoicePDFGenerator.js
import html2pdf from 'html2pdf.js';

// Format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Generate Invoice HTML based on actual API response
const generateInvoiceHTML = (apiResponse) => {
  // Extract data from API response structure
  const invoice = apiResponse?.invoice || apiResponse?.data?.invoice || apiResponse;
  const company = apiResponse?.company || apiResponse?.data?.company || {};
  const bankDetails = apiResponse?.bank_details || apiResponse?.data?.bank_details || {};
  
  if (!invoice || Object.keys(invoice).length === 0) {
    return '<html><body><h3>No invoice data available</h3></body></html>';
  }

  // Get items array
  const items = invoice.items || [];
  
  // Calculate totals from items if not directly available
  const subTotal = invoice.sub_total || items.reduce((sum, item) => sum + ((item.dispatched_qty || 0) * (item.unit_price || 0)), 0);
  const discountTotal = invoice.discount_total || 0;
  const taxableTotal = invoice.taxable_total || subTotal - discountTotal;
  const cgstTotal = invoice.cgst_total || 0;
  const sgstTotal = invoice.sgst_total || 0;
  const igstTotal = invoice.igst_total || 0;
  const gstTotal = invoice.gst_total || cgstTotal + sgstTotal + igstTotal;
  const grandTotal = invoice.grand_total || taxableTotal + gstTotal;
  const balanceDue = invoice.balance_due || grandTotal;

  // Get addresses
  const billingAddress = invoice.billing_address || {};
  const shippingAddress = invoice.shipping_address || {};

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tax Invoice - ${invoice.invoice_no || 'INV'}</title>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; padding: 20px; font-size: 12px; color: #333; }
        .invoice-container { max-width: 1100px; margin: 0 auto; background: white; border: 1px solid #e0e0e0; }
        .header { padding: 20px 25px; border-bottom: 3px solid #063C3F; background: #f8f9fa; }
        .company-name { font-size: 24px; font-weight: bold; color: #063C3F; margin-bottom: 8px; }
        .company-details { font-size: 11px; color: #666; line-height: 1.4; }
        .invoice-title { background: #063C3F; color: white; padding: 12px 25px; font-size: 20px; font-weight: bold; text-align: center; }
        .info-section { padding: 20px 25px; background: #f9f9f9; border-bottom: 1px solid #e0e0e0; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .info-box { background: white; padding: 12px 15px; border-radius: 6px; border: 1px solid #e0e0e0; }
        .info-box-title { font-size: 13px; font-weight: bold; color: #063C3F; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #9FE2BF; display: inline-block; }
        .info-row { margin-bottom: 6px; font-size: 11px; line-height: 1.4; }
        .info-label { font-weight: 600; color: #555; display: inline-block; min-width: 100px; }
        .info-value { color: #333; }
        .items-table { width: calc(100% - 50px); margin: 20px 25px; border-collapse: collapse; font-size: 11px; }
        .items-table th { background: #E8F0F1; color: #063C3F; padding: 10px 8px; text-align: center; border: 1px solid #E3E8EF; font-weight: bold; }
        .items-table td { padding: 8px; text-align: center; border: 1px solid #E3E8EF; vertical-align: top; }
        .items-table td:first-child, .items-table th:first-child { text-align: left; }
        .summary-section { padding: 0 25px 20px 25px; display: flex; justify-content: flex-end; }
        .summary-table { width: 350px; border-collapse: collapse; font-size: 11px; }
        .summary-table td { padding: 6px 8px; }
        .summary-table td:last-child { text-align: right; }
        .summary-total { border-top: 2px solid #063C3F; font-weight: bold; font-size: 13px; color: #063C3F; }
        .amount-words { padding: 15px 25px; background: #f5f5f5; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; font-size: 11px; font-style: italic; }
        .bank-details { padding: 0 25px 20px 25px; }
        .bank-box { padding: 10px; background: #f9f9f9; border-radius: 4px; font-size: 10px; border: 1px solid #e0e0e0; }
        .footer { padding: 20px 25px; font-size: 10px; color: #888; text-align: center; border-top: 1px solid #e0e0e0; background: #fafafa; }
        .signature-section { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; }
        .signature-box { text-align: center; width: 200px; }
        .signature-line { margin-top: 40px; padding-top: 5px; border-top: 1px solid #333; width: 100%; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }
        @media print { body { padding: 0; margin: 0; } .invoice-container { border: none; box-shadow: none; } }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="width: 70%; border: none; vertical-align: top;">
                <div class="company-name">${company.company_name || invoice.company_name || ''}</div>
                <div class="company-details">
                  ${company.address || ''}<br>
                  GSTIN: ${company.gstin || invoice.company_gstin || ''}<br>
                  Phone: ${company.phone || ''} | Email: ${company.email || ''}
                </div>
              </td>
              <td style="width: 30%; border: none; text-align: right; vertical-align: top;">
                <div style="font-size: 11px; color: #666;">
                  <div><strong>Invoice No:</strong> ${invoice.invoice_no || ''}</div>
                  <div><strong>Date:</strong> ${formatDate(invoice.invoice_date)}</div>
                  <div><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <div class="invoice-title">TAX INVOICE</div>
        
        <!-- Party Details -->
        <div class="info-section">
          <div class="info-grid">
            <div class="info-box">
              <div class="info-box-title">BILL TO</div>
              <div class="info-row"><span class="info-label">Name:</span> <span class="info-value">${invoice.customer_name || ''}</span></div>
              <div class="info-row"><span class="info-label">Address:</span> <span class="info-value">${billingAddress.line1 || ''} ${billingAddress.city || ''} ${billingAddress.state || ''} ${billingAddress.pincode || ''}</span></div>
              <div class="info-row"><span class="info-label">GSTIN:</span> <span class="info-value">${invoice.customer_gstin || 'Not Registered'}</span></div>
              <div class="info-row"><span class="info-label">State:</span> <span class="info-value">${billingAddress.state || invoice.customer_state || ''} (Code: ${billingAddress.state_code || invoice.customer_state_code || ''})</span></div>
            </div>
            <div class="info-box">
              <div class="info-box-title">SHIP TO</div>
              <div class="info-row"><span class="info-label">Name:</span> <span class="info-value">${invoice.customer_name || ''}</span></div>
              <div class="info-row"><span class="info-label">Address:</span> <span class="info-value">${shippingAddress.line1 || ''} ${shippingAddress.city || ''} ${shippingAddress.state || ''} ${shippingAddress.pincode || ''}</span></div>
              <div class="info-row"><span class="info-label">PO No:</span> <span class="info-value">${invoice.customer_po_number || '-'}</span></div>
            </div>
          </div>
        </div>
        
        <!-- Invoice Details -->
        <div style="padding: 15px 25px; display: flex; justify-content: space-between; background: white; border-bottom: 1px solid #e0e0e0;">
          <div>
            <div class="info-row"><span class="info-label">SO No:</span> <span class="info-value">${invoice.so_number || '-'}</span></div>
            <div class="info-row"><span class="info-label">DC No:</span> <span class="info-value">${invoice.dc_numbers?.join(', ') || (invoice.dc_ids?.length || 0) + ' DC(s)'}</span></div>
          </div>
          <div>
            <div class="info-row"><span class="info-label">Payment Terms:</span> <span class="info-value">${invoice.payment_terms || 'Net 30'}</span></div>
            <div class="info-row"><span class="info-label">GST Type:</span> <span class="info-value">${invoice.gst_type || 'IGST'}</span></div>
          </div>
        </div>
        
        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 20%;">Part No</th>
              <th style="width: 30%;">Description</th>
              <th style="width: 10%;">HSN</th>
              <th style="width: 8%;">Qty</th>
              <th style="width: 8%;">Unit</th>
              <th style="width: 12%;">Unit Price (₹)</th>
              <th style="width: 7%;">Disc %</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-left">${item.part_no || '-'}</td>
                <td class="text-left">${item.part_name || '-'}</td>
                <td class="text-center">${item.hsn_code || '-'}</td>
                <td class="text-center">${item.dispatched_qty || item.quantity || 0}</td>
                <td class="text-center">${item.unit || 'Nos'}</td>
                <td class="text-right">${formatCurrency(item.unit_price || 0)}</td>
                <td class="text-center">${item.discount_percent || 0}%</td>
              </tr>
            `).join('') || '<tr><td colspan="8" class="text-center">No items found</td></tr>'}
          </tbody>
        </table>
        
        <!-- Totals Section -->
        <div class="summary-section">
          <table class="summary-table">
            <tr><td>Sub Total</td><td>₹${formatCurrency(subTotal)}</td></tr>
            ${discountTotal > 0 ? `<tr><td>Discount</td><td>₹${formatCurrency(discountTotal)}</td></tr>` : ''}
            <tr><td>Taxable Amount</td><td>₹${formatCurrency(taxableTotal)}</td></tr>
            ${cgstTotal > 0 ? `<tr><td>CGST</td><td>₹${formatCurrency(cgstTotal)}</td></tr>` : ''}
            ${sgstTotal > 0 ? `<tr><td>SGST</td><td>₹${formatCurrency(sgstTotal)}</td></tr>` : ''}
            ${igstTotal > 0 ? `<tr><td>IGST</td><td>₹${formatCurrency(igstTotal)}</td></tr>` : ''}
            <tr><td>GST Total</td><td>₹${formatCurrency(gstTotal)}</td></tr>
            <tr class="summary-total"><td><strong>Grand Total</strong></td><td><strong>₹${formatCurrency(grandTotal)}</strong></td></tr>
            <tr><td>Balance Due</td><td>₹${formatCurrency(balanceDue)}</td></tr>
          </table>
        </div>
        
        <!-- Amount in Words -->
        <div class="amount-words">
          <strong>Amount in Words:</strong> ${invoice.amount_in_words || ''}
        </div>
        
        <!-- Bank Details -->
        ${bankDetails && Object.keys(bankDetails).length > 0 ? `
        <div class="bank-details">
          <div class="bank-box">
            <strong>Bank Details:</strong><br>
            Bank Name: ${bankDetails.bank_name || ''}<br>
            Account No: ${bankDetails.account_no || ''}<br>
            IFSC Code: ${bankDetails.ifsc || ''}<br>
            Branch: ${bankDetails.branch || ''}
          </div>
        </div>
        ` : ''}
        
        <!-- Signature Section -->
        <div class="footer">
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div><strong>Customer Signature</strong></div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div><strong>Authorized Signatory</strong></div>
            </div>
          </div>
          <div style="margin-top: 15px;">
            <div>This is a computer generated invoice</div>
            <div>Thank you for your business!</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Download PDF using html2pdf
export const downloadInvoiceAsPDF = async (apiResponse, fileName = 'invoice.pdf') => {
  const html = generateInvoiceHTML(apiResponse);
  
  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.appendChild(element);
  
  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  
  try {
    await html2pdf().set(opt).from(element).save();
  } finally {
    document.body.removeChild(element);
  }
};

// Print invoice
export const printInvoice = (apiResponse) => {
  const html = generateInvoiceHTML(apiResponse);
  const printWindow = window.open('', '_blank', 'width=1100,height=800,toolbar=yes,scrollbars=yes');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

// Preview invoice in new window
export const previewInvoice = (apiResponse) => {
  const html = generateInvoiceHTML(apiResponse);
  const previewWindow = window.open('', '_blank', 'width=1100,height=800,toolbar=yes,scrollbars=yes');
  
  if (previewWindow) {
    previewWindow.document.write(html);
    previewWindow.document.close();
    previewWindow.focus();
  }
};