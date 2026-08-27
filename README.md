# KWhyzor

KWhyzor is an electricity intelligence platform for understanding bill changes, modeling appliance demand, and exploring energy scenarios. It labels calculations as estimates and keeps the reasoning visible.

## Included now

- Demo and Supabase email authentication
- Bill Scanner upload -> review -> save flow (provider-independent OCR placeholder)
- Bill Detective with month-over-month change and low/medium/high confidence
- Electricity Twin with deterministic appliance calculations
- What-if, EV and Solar estimation views
- Responsive dashboard with light mode

## Run locally

This is a dependency-free static site. Serve this folder with any static web server, then open `index.html`. GitHub Pages is configured from the `main` branch root.

For real accounts, create a Supabase project, run `supabase-schema.sql` in SQL Editor, enable Email authentication, and put the browser-safe project URL and publishable/anon key in `config.js`. Set `DEMO_MODE` to `false` after configuration.

## Architecture

- `index.html` contains the accessible application shell and views.
- `script.js` owns UI state, auth, persistence, and view rendering.
- `energy-engine.js` contains deterministic calculations independent of UI.
- `supabase-schema.sql` defines owned data tables and row-level security policies.

## Calculation assumptions

Appliance energy is calculated as watts / 1,000 * quantity * hours per day * days per month. EV charging defaults to a 10% loss assumption. Solar uses capacity * monthly generation per kW and an editable 80% self-consumption assumption. Actual bills vary with slabs, taxes, fees, weather, meter data, and utility rules.

## Production roadmap and limitations

The Scanner currently provides a reviewable demo adapter and does not claim OCR accuracy. AI, OCR, payment, and webhook credentials must be used only by secure server-side routes; none are present in this browser project. Add server endpoints before enabling those integrations. Final pricing is not configured.

Never put service-role, AI, OCR, payment, or database passwords in browser code. Use `.env.example` as the variable checklist and keep real `.env` files uncommitted.
