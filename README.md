# Roadmap Canary Demo

A small TypeScript payment application used to demonstrate **Roadmap Canary**: executable viability proofs for accepted future capabilities.

This repository intentionally represents the production application only. Future-feature canaries are disposable proof artifacts and should not be merged into the product.

## Current product

The application has one production payment provider (`StripeProvider`) behind a provider abstraction. Checkout and refunds use `PaymentService` rather than depending on Stripe directly.

## Future roadmap capability

The first accepted roadmap item is **Support multiple payment providers**. The current architecture should preserve a viable path for adding a second provider without coupling checkout business logic to a specific vendor.

## Development

```bash
npm install
npm test
npm run typecheck
```
