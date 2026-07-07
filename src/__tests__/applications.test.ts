import { vi, describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import applicationRouter from '../routes/applications.js';

vi.mock('../config/supabase.js', () => {
  const mockInsert = vi.fn().mockResolvedValue({ error: null });
  const mockFrom = vi.fn().mockReturnValue({
    insert: mockInsert
  });

  const mockStorage = {
    from: vi.fn().mockReturnValue({
      createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'http://example.com/signed-url' }, error: null }),
      createSignedUploadUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'http://example.com/upload-url', token: 'mock-token' }, error: null })
    })
  };

  return {
    supabase: {
      from: mockFrom
    },
    supabaseAdmin: {
      from: mockFrom,
      storage: mockStorage
    }
  };
});

vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: vi.fn().mockReturnValue({
        sendMail: vi.fn().mockResolvedValue({ messageId: 'mocked-message-id' })
      })
    }
  };
});

const app = express();
app.use(express.json());
app.use('/api/applications', applicationRouter);

describe('POST /api/applications/presign', () => {
  it('should succeed with 200 and return upload url when valid file type is requested', async () => {
    const response = await request(app)
      .post('/api/applications/presign')
      .send({ fileName: 'documents.zip', fileType: 'application/zip' });

    expect(response.status).toBe(200);
    expect(response.body.signedUrl).toBe('http://example.com/upload-url');
    expect(response.body.path).toBe('documents.zip');
    expect(response.body.token).toBe('mock-token');
  });

  it('should fail with 400 when file type is not ZIP', async () => {
    const response = await request(app)
      .post('/api/applications/presign')
      .send({ fileName: 'photo.jpg', fileType: 'image/jpeg' });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Only ZIP files are allowed');
  });
});

describe('POST /api/applications/submit', () => {
  it('should succeed with 201 when JSON body with pre-uploaded document_url is submitted', async () => {
    const response = await request(app)
      .post('/api/applications/submit')
      .send({
        business_name: 'Acme Store LLC',
        contact_name: 'Jane Doe',
        email: 'jane@acme.com',
        phone: '+15551234567',
        country: 'United States',
        industry: 'ecommerce',
        monthly_volume: 'Under $10K/month',
        has_llc: true,
        has_us_signer: true,
        payment_method_online: true,
        document_url: 'already-uploaded-file.zip'
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true });
  });

  it('should fail with 400 when document_url is missing', async () => {
    const response = await request(app)
      .post('/api/applications/submit')
      .send({
        business_name: 'Acme Store LLC',
        contact_name: 'Jane Doe',
        email: 'jane@acme.com',
        phone: '+15551234567',
        country: 'United States',
        industry: 'ecommerce',
        monthly_volume: 'Under $10K/month'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('A ZIP file containing all required documents is required');
  });

  it('should fail with 400 when validation fails (invalid email)', async () => {
    const response = await request(app)
      .post('/api/applications/submit')
      .send({
        business_name: 'Acme Store LLC',
        contact_name: 'Jane Doe',
        email: 'not-an-email',
        phone: '+15551234567',
        country: 'United States',
        industry: 'ecommerce',
        monthly_volume: 'Under $10K/month',
        document_url: 'file.zip'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
    expect(response.body.details).toBeDefined();
  });
});
