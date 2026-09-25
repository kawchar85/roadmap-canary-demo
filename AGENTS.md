# Agent guidance

This repository is the controlled application used by the Roadmap Canary hackathon demo.

## Architectural rules

- Checkout and refunds depend on `PaymentService`, never directly on a vendor implementation.
- Vendor-specific behavior belongs under `src/payments/providers/`.
- `PaymentProvider` is the product boundary between payment orchestration and vendor adapters.
- Existing acceptance and integration tests must not be weakened simply to make a change pass.

## Verification

Before considering a change complete, run:

```bash
npm run check
```

The repository intentionally contains only the current production capability. Future-feature canary implementations are disposable proof artifacts and must not be merged into `main`.
