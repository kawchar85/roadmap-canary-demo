# Roadmap Canary Demo Scenarios

This repository is intentionally structured as a controlled product history for Roadmap Canary. The product code is small enough for a judge to understand quickly, while the three prepared refs produce different future-viability outcomes.

## Baseline: `main`

Current behavior:

- only `StripeProvider` ships in the product;
- `CheckoutService` and `RefundService` depend on `PaymentService`;
- `PaymentService` depends on the vendor-neutral `PaymentProvider` contract;
- all ordinary tests and type checking pass.

The accepted future capability is GitHub Issue #1: support at least two interchangeable payment providers without coupling checkout/refund business logic to a vendor.

## Canary witness: `canary/multi-provider-witness`

This ref is **not a product feature branch**. It is a disposable Minimum Viable Proof.

It adds a small deterministic second adapter (`CanaryPayProvider`) and executable tests proving that:

1. the second adapter satisfies the shared provider contract;
2. it can be injected through the same `PaymentService` boundary as Stripe;
3. checkout reaches it through the real `CheckoutService -> PaymentService -> PaymentProvider` path;
4. refunds also use the same vendor-neutral path;
5. existing Stripe behavior remains green.

Roadmap Canary captures the diff from `main` to this ref as `witness.patch`, verifies it, and stores the patch as evidence. The witness ref itself is never merged to production.

## Scenario A: `demo/path-changed-safe`

This ref changes the provider contract API while preserving the architectural boundary and current Stripe behavior.

Expected behavior:

```text
normal CI       PASS
BASE witness    PASS
PR witness      FAIL
IBM Bob Rescue  produces an adapted second-provider proof
verification    PASS
result          PATH CHANGED - SAFE
```

The key point is that Roadmap Canary does not require the old implementation path to survive. The old witness is intentionally incompatible with the refactor; Rescue is allowed to find a new proof that satisfies the same Future Contract.

## Scenario B: `demo/roadmap-risk`

This ref keeps current Stripe behavior green but introduces explicit Stripe coupling across the provider contract, payment orchestration, checkout, and refunds.

Expected behavior:

```text
normal CI       PASS
BASE witness    PASS
PR witness      FAIL
IBM Bob Rescue  cannot produce a verified replacement within the configured proof budget
result          ROADMAP RISK
```

The result does **not** mean multi-provider support is impossible. It means the PR has removed the previously demonstrated low-cost path and Roadmap Canary could not re-establish executable viability within its bounded Rescue attempt.

## Demo commands

After cloning both repositories and installing Roadmap Canary, first capture the disposable witness:

```bash
roadmap-canary capture \
  --repo /path/to/roadmap-canary-demo \
  --contract /path/to/roadmap-canary/examples/issue-1/contract.yaml \
  --base main \
  --witness canary/multi-provider-witness \
  --output /path/to/roadmap-canary-demo/.roadmap-canary/issue-1
```

Then evaluate either prepared ref:

```bash
roadmap-canary check \
  --repo /path/to/roadmap-canary-demo \
  --canary /path/to/roadmap-canary-demo/.roadmap-canary/issue-1 \
  --base main \
  --pr demo/path-changed-safe \
  --bob-max-turns 8 \
  --bob-max-cost 0.50 \
  --output-dir ./run-evidence
```

Replace the PR ref with `demo/roadmap-risk` for the second scenario.
