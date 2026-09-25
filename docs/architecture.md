# Payment architecture

## Current state

The product currently ships with Stripe as its only payment provider.

The important architectural boundary is intentionally vendor-neutral:

```text
CheckoutService ----> PaymentService ----> PaymentProvider <---- StripeProvider
RefundService  ------/
```

`CheckoutService` and `RefundService` must not import `StripeProvider` or Stripe-specific types. They depend only on `PaymentService` and the common payment result types.

## Why this boundary exists

The product roadmap includes support for multiple payment providers. The feature is not implemented yet, and this repository must not prematurely ship a second provider. However, the current architecture should retain a realistic path to adding another provider without rewriting checkout business logic.

This distinction is what the Roadmap Canary demo will verify: future capability viability without merging speculative feature code into production.
