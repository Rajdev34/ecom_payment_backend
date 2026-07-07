export function generateApplicationEmailHtml(data: any, downloadUrl: string): string {
  const isDocUploaded = !!data.document_url;
  const status = (data.status || 'pending').toLowerCase();
  
  let badgeStyle = 'background-color: #fef3c7; color: #d97706; border: 1px solid #fde68a;';
  if (status === 'reviewing') {
    badgeStyle = 'background-color: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe;';
  } else if (status === 'approved') {
    badgeStyle = 'background-color: #d1fae5; color: #047857; border: 1px solid #a7f3d0;';
  } else if (status === 'declined') {
    badgeStyle = 'background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;';
  }

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Merchant Application: ${data.business_name || 'Ecom Payments'}</title>
  <style type="text/css">
    /* Reset styles to ensure email client consistency */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f3f4f6; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; border-collapse: separate; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
          
          <!-- Elegant Header (Styled after Navbar Logo) -->
          <tr>
            <td style="background-color: #090d16; background: linear-gradient(135deg, #090d16 0%, #17253d 100%); padding: 36px 40px; text-align: center; border-bottom: 1px solid #1e293b;">
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; display: inline-table; border-collapse: collapse;">
                <tr>
                  <td style="background-color: #3b82f6; border-radius: 10px; width: 38px; height: 38px; text-align: center; vertical-align: middle; padding: 0;">
                    <!-- Representing the ShieldCheck icon with a bold dark checkmark -->
                    <span style="color: #090d16; font-size: 20px; font-weight: 800; line-height: 38px; font-family: sans-serif; display: inline-block;">✓</span>
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle; text-align: left; line-height: 1;">
                    <span style="color: #090d16; font-size: 26px; font-weight: 800; letter-spacing: -0.03em; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; display: inline-block;">
                      Ecom<span style="color: #60a5fa;">Payments</span>
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin: 12px 0 0 0; color: #94a3b8; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                New Merchant Application Submitted
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 40px; background-color: #ffffff;">
              
              <!-- SECTION 1: Contact Information -->
              <h3 style="margin: 0 0 14px 0; color: #2563eb; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #eff6ff; padding-bottom: 6px;">
                Contact Information
              </h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6; width: 45%;">Contact Name</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6; width: 55%;">${data.contact_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Email Address</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #2563eb; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">
                    <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Phone Number</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Application Status</td>
                  <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #f3f4f6;">
                    <span style="display: inline-block; padding: 4px 12px; font-size: 11px; font-weight: 700; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; ${badgeStyle}">
                      ${data.status || 'pending'}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- SECTION 2: Business Overview -->
              <h3 style="margin: 28px 0 14px 0; color: #2563eb; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #eff6ff; padding-bottom: 6px;">
                Business Overview
              </h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6; width: 45%;">Legal Business Name</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6; width: 55%;">${data.business_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">DBA Name (Trade Name)</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.dba_name || 'Same as Legal Name'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Website</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">
                    ${data.website ? `<a href="${data.website}" target="_blank" style="color: #2563eb; text-decoration: none;">${data.website}</a>` : '<span style="color: #9ca3af; font-weight: 400; font-style: italic;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Industry Sector</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6; text-transform: capitalize;">${data.industry}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Country</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.country}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">US LLC / Entity</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.has_llc ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">US-based Signer</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.has_us_signer ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Federal Tax ID (EIN)</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.federal_tax_id || '<span style="color: #9ca3af; font-weight: 400;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Business Start Date</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.business_start_date || '<span style="color: #9ca3af; font-weight: 400;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Legal Address</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.legal_address || '<span style="color: #9ca3af; font-weight: 400;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">DBA Address</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.dba_address || '<span style="color: #9ca3af; font-weight: 400; font-style: italic;">Same as Legal Address</span>'}</td>
                </tr>
              </table>

              <!-- SECTION 3: Owner Details -->
              <h3 style="margin: 28px 0 14px 0; color: #2563eb; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #eff6ff; padding-bottom: 6px;">
                Owner & Signer Details
              </h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6; width: 45%;">Owner 1 Personal Phone</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6; width: 55%;">${data.owner1_personal_phone || '<span style="color: #9ca3af; font-weight: 400;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Owner 1 SSN / ITIN</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.owner1_ssn_itin || '<span style="color: #9ca3af; font-weight: 400;">Not provided</span>'}</td>
                </tr>
                
                ${data.owner2_legal_name ? `
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Owner 2 Legal Name</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.owner2_legal_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Owner 2 Ownership %</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.owner2_ownership_pct}%</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Owner 2 Job Title</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.owner2_job_title || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Owner 2 Address</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.owner2_address || 'N/A'}</td>
                </tr>
                ` : `
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Second Owner (Owner 2)</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #9ca3af; font-weight: 400; text-align: right; border-bottom: 1px solid #f3f4f6; font-style: italic;">None / Single Owner</td>
                </tr>
                `}
              </table>

              <!-- SECTION 4: Processing & Financials -->
              <h3 style="margin: 28px 0 14px 0; color: #2563eb; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #eff6ff; padding-bottom: 6px;">
                Processing & Financials
              </h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6; width: 45%;">In-Person Payments</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6; width: 55%;">${data.payment_method_in_person ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Online Payments</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.payment_method_online ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Phone / Invoice Payments</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.payment_method_phone_invoice ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Est. Monthly Volume</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.monthly_volume}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Avg. Monthly Volume ($)</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.avg_monthly_volume || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Typical Transaction Size</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.avg_transaction_size || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">High-Ticket Size</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.high_ticket_size || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Has Processing History</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.existing_processing || 'No'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #4b5563; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Previous Processor</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">${data.previous_processor || 'N/A'}</td>
                </tr>
              </table>

              <!-- SECTION 5: Business Description -->
              <h3 style="margin: 28px 0 10px 0; color: #2563eb; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #eff6ff; padding-bottom: 6px;">
                Business Description
              </h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151; font-style: ${data.description ? 'normal' : 'italic'};">
                ${data.description || 'No description provided.'}
              </p>

            </td>
          </tr>

          <!-- Document Download Button -->
          <tr>
            <td align="center" style="padding: 0 40px 40px 40px; background-color: #ffffff; text-align: center;">
              ${isDocUploaded ? `
                <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: #2563eb;">
                      <a href="${downloadUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; border: 1px solid #2563eb;">
                        Download Application Documents (ZIP)
                      </a>
                    </td>
                  </tr>
                </table>
              ` : `
                <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; width: 100%;">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: #f9fafb; border: 1px dashed #d1d5db; padding: 14px; color: #6b7280; font-size: 14px; font-weight: 600;">
                      No Documents Uploaded
                    </td>
                  </tr>
                </table>
              `}
            </td>
          </tr>
          
          <!-- Elegant Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; text-align: center; font-size: 12px; color: #6b7280; line-height: 1.5;">
              This is an automated notification from the Ecom Payments administrative portal.<br/>
              Ecom Payments © 2026. All rights reserved.
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
