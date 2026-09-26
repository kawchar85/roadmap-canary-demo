# Roadmap Canary Demo

A deliberately small TypeScript payment application for demonstrating **Roadmap Canary**: executable evidence that an accepted future capability still has a viable path through an evolving codebase.

This repository represents the product under test. It does **not** call a real payment gateway. `StripeProvider` is a deterministic stand-in for the current production adapter so the demo is reproducible in CI and does not require credentials, money movement, or provider availability in any country.

## Current product

`main` ships one provider only:

```text
CheckoutService ----\
                    > PaymentService -> PaymentProvider -> StripeProvider
RefundService  -----/
```

Checkout and refund business logic are vendor-neutral. The accepted roadmap item is **Support multiple payment providers** (GitHub Issue #1).

## Why the demo has separate refs

Roadmap Canary is about future viability, so the demo needs three intentionally different Git states:

- `canary/multi-provider-witness`: disposable executable proof that the current architecture can support a second provider. It is evidence, not production code, and must not be merged into `main`.
- `demo/path-changed-safe`: a normal refactor that breaks the old witness but still leaves another small path to the same future capability. Roadmap Canary should use IBM Bob Rescue and report **PATH CHANGED - SAFE**.
- `demo/roadmap-risk`: a Stripe-coupling refactor whose ordinary tests remain green but makes the future capability substantially more expensive within the Canary proof budget. Roadmap Canary should report **ROADMAP RISK** when bounded Rescue cannot produce a verified replacement proof.

See `DEMO-SCENARIOS.md` for the exact intended behavior.

## Development

```bash
npm install
npm run check
```

`npm run check` runs TypeScript type checking and the full Vitest suite. CI runs on all branches so each prepared demo ref can be independently verified.

## Important distinction

The demo never claims a future feature is impossible. A `ROADMAP RISK` result means only that a previously demonstrated path disappeared and no replacement proof was verified within the configured Rescue budget.
