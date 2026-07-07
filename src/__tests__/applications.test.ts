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
      createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'http://example.com/signed-url' }, error: null })
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

vi.mock('../utils/fileUpload.js', () => {
  return {
    uploadMerchantDocument: vi.fn().mockResolvedValue('mocked-uuid-filename.zip')
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

describe('POST /api/applications/submit', () => {
  it('should succeed with 201 when valid inputs and a ZIP file are provided', async () => {
    const response = await request(app)
      .post('/api/applications/submit')
      .field('business_name', 'Acme Store LLC')
      .field('contact_name', 'Jane Doe')
      .field('email', 'jane@acme.com')
      .field('phone', '+15551234567')
      .field('country', 'United States')
      .field('industry', 'ecommerce')
      .field('monthly_volume', 'Under $10K/month')
      .field('has_llc', 'true')
      .field('has_us_signer', 'true')
      .field('payment_method_online', 'true')
      .attach('document', Buffer.from('dummy zip content'), 'test.zip');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true });
  });

  it('should fail with 400 when ZIP file is missing', async () => {
    const response = await request(app)
      .post('/api/applications/submit')
      .field('business_name', 'Acme Store LLC')
      .field('contact_name', 'Jane Doe')
      .field('email', 'jane@acme.com')
      .field('phone', '+15551234567')
      .field('country', 'United States')
      .field('industry', 'ecommerce')
      .field('monthly_volume', 'Under $10K/month');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('ZIP file containing all required documents is required');
  });

  it('should fail with 400 when validation fails (invalid email)', async () => {
    const response = await request(app)
      .post('/api/applications/submit')
      .field('business_name', 'Acme Store LLC')
      .field('contact_name', 'Jane Doe')
      .field('email', 'not-an-email')
      .field('phone', '+15551234567')
      .field('country', 'United States')
      .field('industry', 'ecommerce')
      .field('monthly_volume', 'Under $10K/month')
      .attach('document', Buffer.from('dummy zip content'), 'test.zip');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
    expect(response.body.details).toBeDefined();
  });
});
