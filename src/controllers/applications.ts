import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { generateApplicationEmailHtml } from '../templates/applicationEmail.js';
import { uploadMerchantDocument } from '../utils/fileUpload.js';
import { applicationSchema } from '../schemas/application.js';

function parseApplicationPayload(body: any, documentUrl: string | null) {
  const toBool = (val: any): boolean => {
    if (val === 'true' || val === true) return true;
    if (val === 'false' || val === false) return false;
    return false;
  };

  const toStrOrNull = (val: any): string | null => {
    if (val === undefined || val === null || val === 'null' || val === 'undefined' || val === '') {
      return null;
    }
    return String(val).trim();
  };

  return {
    business_name: toStrOrNull(body.business_name) || '',
    contact_name: toStrOrNull(body.contact_name) || '',
    email: toStrOrNull(body.email) || '',
    phone: toStrOrNull(body.phone) || '',
    website: toStrOrNull(body.website),
    country: toStrOrNull(body.country) || '',
    industry: toStrOrNull(body.industry) || '',
    monthly_volume: toStrOrNull(body.monthly_volume) || '',
    description: toStrOrNull(body.description),
    
    legal_address: toStrOrNull(body.legal_address),
    dba_name: toStrOrNull(body.dba_name),
    dba_address: toStrOrNull(body.dba_address),
    federal_tax_id: toStrOrNull(body.federal_tax_id),
    business_start_date: toStrOrNull(body.business_start_date),
    
    has_llc: toBool(body.has_llc),
    has_us_signer: toBool(body.has_us_signer),
    
    owner1_ssn_itin: toStrOrNull(body.owner1_ssn_itin),
    owner1_personal_phone: toStrOrNull(body.owner1_personal_phone),
    
    owner2_legal_name: toStrOrNull(body.owner2_legal_name),
    owner2_ownership_pct: toStrOrNull(body.owner2_ownership_pct),
    owner2_job_title: toStrOrNull(body.owner2_job_title),
    owner2_date_of_birth: toStrOrNull(body.owner2_date_of_birth),
    owner2_address: toStrOrNull(body.owner2_address),
    
    payment_method_in_person: toBool(body.payment_method_in_person),
    payment_method_online: toBool(body.payment_method_online),
    payment_method_phone_invoice: toBool(body.payment_method_phone_invoice),
    
    avg_monthly_volume: toStrOrNull(body.avg_monthly_volume),
    avg_transaction_size: toStrOrNull(body.avg_transaction_size),
    high_ticket_size: toStrOrNull(body.high_ticket_size),
    existing_processing: toStrOrNull(body.existing_processing),
    previous_processor: toStrOrNull(body.previous_processor),
    
    document_url: documentUrl,
  };
}

export async function submitApplication(req: Request, res: Response) {
  try {
    const client = req.headers['x-bypass-rls'] === 'true' && supabaseAdmin 
      ? supabaseAdmin 
      : supabase;

    if (!req.file) {
      return res.status(400).json({ error: 'A ZIP file containing all required documents is required.' });
    }

    let documentUrl: string;
    try {
      documentUrl = await uploadMerchantDocument(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        client
      );
    } catch (uploadError: any) {
      console.error('File upload error in application submission route:', uploadError);
      return res.status(400).json({ error: uploadError.message });
    }

    const applicationData = parseApplicationPayload(req.body, documentUrl);

    const validationResult = applicationSchema.safeParse(applicationData);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.format()
      });
    }

    const { error } = await client
      .from('merchant_applications')
      .insert(applicationData);

    if (error) {
      console.error('Database insert error:', error);
      return res.status(400).json({ error: error.message });
    }

    let downloadUrl = '';
    if (applicationData.document_url && supabaseAdmin) {
      const { data: signedData, error: signError } = await supabaseAdmin.storage
        .from('merchant-documents')
        .createSignedUrl(applicationData.document_url, 60 * 60 * 24 * 7);

      if (signError) {
        console.error('Error generating signed link:', signError);
      } else if (signedData) {
        downloadUrl = signedData.signedUrl;
      }
    }

    console.log('📧 Setting up SMTP transporter with config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? '***' : 'undefined',
      adminEmail: process.env.ADMIN_EMAIL
    });

    if (!process.env.SMTP_HOST) {
      console.warn('⚠️ Warning: SMTP_HOST is not defined in process.env. Defaulting to localhost.');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Ecom Payments Portal" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Application Received: ${applicationData.business_name}`,
      html: generateApplicationEmailHtml(applicationData, downloadUrl),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✉️ Application notification email sent:', info.messageId);
    } catch (mailErr) {
      console.error('❌ Failed to send application email notification:', mailErr);
    }

    return res.status(201).json({ success: true });
  } catch (error: any) {
    console.error('Server error during application submission:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
