import { z } from 'zod';

const industryTypes = ['ecommerce', 'dropshipping', 'saas', 'coaching', 'courses', 'supplements', 'other'] as const;

export const applicationSchema = z.object({
  business_name: z.string().trim().min(1),
  contact_name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  website: z.string().trim().url().nullable().optional().or(z.literal('')),
  country: z.string().trim().min(1),
  industry: z.enum(industryTypes),
  monthly_volume: z.string().trim().min(1),
  description: z.string().trim().nullable().optional(),
  
  legal_address: z.string().trim().nullable().optional(),
  dba_name: z.string().trim().nullable().optional(),
  dba_address: z.string().trim().nullable().optional(),
  federal_tax_id: z.string().trim().nullable().optional(),
  business_start_date: z.string().trim().nullable().optional(),
  
  has_llc: z.boolean().default(false),
  has_us_signer: z.boolean().default(false),
  
  owner1_ssn_itin: z.string().trim().nullable().optional(),
  owner1_personal_phone: z.string().trim().nullable().optional(),
  
  owner2_legal_name: z.string().trim().nullable().optional(),
  owner2_ownership_pct: z.string().trim().nullable().optional(),
  owner2_job_title: z.string().trim().nullable().optional(),
  owner2_date_of_birth: z.string().trim().nullable().optional(),
  owner2_address: z.string().trim().nullable().optional(),
  
  payment_method_in_person: z.boolean().default(false),
  payment_method_online: z.boolean().default(false),
  payment_method_phone_invoice: z.boolean().default(false),
  
  avg_monthly_volume: z.string().trim().nullable().optional(),
  avg_transaction_size: z.string().trim().nullable().optional(),
  high_ticket_size: z.string().trim().nullable().optional(),
  existing_processing: z.string().trim().nullable().optional(),
  previous_processor: z.string().trim().nullable().optional(),
  
  document_url: z.string().trim().min(1, 'A ZIP file containing all required documents is required'),
});
