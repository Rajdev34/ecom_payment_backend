import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { generateApplicationEmailHtml } from '../templates/applicationEmail.js';

const router = Router();

// Configure multer for memory storage uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB limits
  }
});

// Route: Submit application data & Email it to the Admin
router.post('/', async (req, res) => {
  try {
    const applicationData = req.body;
    
    // Choose client based on whether we want to bypass RLS (e.g. admin tasks) or respect RLS
    // Default is RLS-enforced client 'supabase'
    const client = req.headers['x-bypass-rls'] === 'true' && supabaseAdmin 
      ? supabaseAdmin 
      : supabase;

    // 1. Insert application data to DB
    const { error } = await client
      .from('merchant_applications')
      .insert(applicationData);

    if (error) {
      console.error('Database insert error:', error);
      return res.status(400).json({ error: error.message });
    }

    // 2. Generate a secure signed URL for the documents if uploaded
    let downloadUrl = '';
    if (applicationData.document_url && supabaseAdmin) {
      const { data: signedData, error: signError } = await supabaseAdmin.storage
        .from('merchant-documents')
        .createSignedUrl(applicationData.document_url, 60 * 60 * 24 * 7); // Valid for 7 days

      if (signError) {
        console.error('Error generating signed link:', signError);
      } else if (signedData) {
        downloadUrl = signedData.signedUrl;
      }
    }

    // 3. Set up email notification transporter
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
      from: `"Helix Pay Portal" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Application Received: ${applicationData.business_name}`,
      html: generateApplicationEmailHtml(applicationData, downloadUrl),
    };

    // 4. Send email and await it (so serverless platforms like Vercel don't terminate execution prematurely)
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✉️ Application notification email sent:', info.messageId);
    } catch (mailErr) {
      console.error('❌ Failed to send application email notification:', mailErr);
    }

    // 5. Respond success immediately to the client
    return res.status(201).json({ success: true });
  } catch (error: any) {
    console.error('Server error during application submission:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route: Upload ZIP documents to Supabase Storage (Enforces RLS by using standard client)
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Verify it is a zip file
    const allowedMimeTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-zip',
      'application/octet-stream',
      'multipart/x-zip'
    ];

    if (!allowedMimeTypes.includes(file.mimetype) && !file.originalname.endsWith('.zip')) {
      return res.status(400).json({ error: 'Only ZIP files are allowed.' });
    }

    // Determine upload path
    const ext = file.originalname.split('.').pop() ?? 'zip';
    const fileName = `${randomUUID()}.${ext}`;

    // Select RLS-enforced or admin client
    const client = req.headers['x-bypass-rls'] === 'true' && supabaseAdmin 
      ? supabaseAdmin 
      : supabase;

    // Upload to 'merchant-documents' bucket
    const { data, error } = await client.storage
      .from('merchant-documents')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        duplex: 'half' // required for node streams/buffers in some node versions
      });

    if (error) {
      console.error('Storage upload error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      path: fileName,
      fullPath: data.path
    });
  } catch (error: any) {
    console.error('Server error during document upload:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
