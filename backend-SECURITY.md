# Production security

The browser may contain only the Supabase Project URL and browser-safe publishable/anon key.

Keep these server-side:
- Supabase service_role key
- Database password
- AI API secret
- OCR provider secret
- Payment secret

Recommended server endpoints:
POST /api/bill/ocr
POST /api/investigation
POST /api/checkout
POST /api/webhooks/payment

The current browser prototype connects real Supabase Auth and database tables for profiles, bills and appliances. OCR, AI and payments require a secure server/serverless layer.
