# Roadmap Canary Demo Scenarios

This repository is intentionally structured as a controlled product history for Roadmap Canary. The product code is small enough for a judge to understand quickly, while the prepared refs produce different future-viability outcomes.

## Baseline: `main`

Current behavior:

- only `StripeProvider` ships in the product;
- `CheckoutService` and `RefundService` depend on `PaymentService`;
- `PaymentService` depends on the vendor-neutral `PaymentProvider` contract;
- all ordinary tests and type checking pass.

The accepted future capability is GitHub Issue #1: support at least two interchangeable payment providers without coupling checkout/refund business logic to a vendor.

## Canary witness: `canary/multi-provider-witness`

This ref is **not a product feature branch**. It is a disposable Minimum Viable Proof.

It adds a deterministic second adapter (`CanaryPayProvider`) and proof wiring that demonstrate:

1. the second adapter satisfies the same shared provider contract as Stripe;
2. it can be injected through the same `PaymentService` boundary;
3. checkout reaches it through the real `CheckoutService -> PaymentService -> PaymentProvider` path;
4. refunds use the same vendor-neutral path;
5. existing Stripe behavior remains green.

Roadmap Canary captures the diff from `main` to this ref as `witness.patch`, replays it on a clean BASE worktree, runs the approved verification commands, and stores the verified patch as evidence. The witness ref itself is never merged into production.

## Scenario A: `demo/path-changed-safe`

This ref changes the provider API while preserving the vendor-neutral architectural boundary and current Stripe behavior.

The old witness is intentionally incompatible with the refactor. IBM Bob must discover an adapted proof, leave it in the isolated Rescue worktree, and let Roadmap Canary verify it independently.

Verified end-to-end on 2026-09-26 with IBM Bob Shell 2.0.5:

```text
normal CI       PASS
BASE witness    PASS
PR witness      FAIL
IBM Bob Rescue  PASS
verification    PASS
result          PATH CHANGED - SAFE
```

The important point is that Roadmap Canary does not require the old implementation path to survive. The path changed, but the same human-approved future capability still has a small executable proof.

## Scenario B: `demo/roadmap-risk`

This ref keeps today's Stripe behavior green but introduces explicit Stripe coupling across the provider contract, payment orchestration, checkout, and refunds.

Verified end-to-end on 2026-09-26 with IBM Bob Shell 2.0.5:

```text
normal CI       PASS
BASE witness    PASS
PR witness      FAIL
IBM Bob Rescue  no verified replacement proof within the bounded attempt
result          ROADMAP RISK
```

`ROADMAP RISK` does **not** mean multi-provider support is impossible. It means a previously demonstrated low-cost path disappeared and Roadmap Canary could not re-establish executable viability within the configured Rescue constraints.

## Why Bob does not decide the verdict

IBM Bob is the proposal engine. It receives the Future Contract, previous witness failure evidence, protected tests, and proof budget, then edits an isolated PR worktree.

Roadmap Canary independently decides the outcome by checking:

- approved verification commands;
- protected-test integrity;
- proof-budget limits;
- dependency limits;
- the independent Canary verifier.

Only a candidate that passes deterministic verification can become `PATH CHANGED - SAFE`.

## Demo commands

Install dependencies in this repository first:

```bash
npm install
npm run check
```

Fetch the prepared refs:

```bash
git fetch origin \
  +refs/heads/canary/multi-provider-witness:refs/remotes/origin/canary/multi-provider-witness \
  +refs/heads/demo/path-changed-safe:refs/remotes/origin/demo/path-changed-safe \
  +refs/heads/demo/roadmap-risk:refs/remotes/origin/demo/roadmap-risk
```

Capture the disposable witness:

```bash
roadmap-canary capture \
  --repo . \
  --contract ../roadmap-canary/examples/issue-1/contract.yaml \
  --base main \
  --witness origin/canary/multi-provider-witness \
  --output .roadmap-canary/issue-1
```

Run Scenario A:

```bash
roadmap-canary check \
  --repo . \
  --canary .roadmap-canary/issue-1 \
  --base main \
  --pr origin/demo/path-changed-safe \
  --bob-max-turns 12 \
  --bob-max-cost 0.50 \
  --bob-timeout 600 \
  --output-dir .roadmap-canary/runs/path-changed-safe
```

Run Scenario B:

```bash
roadmap-canary check \
  --repo . \
  --canary .roadmap-canary/issue-1 \
  --base main \
  --pr origin/demo/roadmap-risk \
  --bob-max-turns 12 \
  --bob-max-cost 0.50 \
  --bob-timeout 600 \
  --output-dir .roadmap-canary/runs/roadmap-risk
```

The `.roadmap-canary/` directory is runtime evidence and is intentionally ignored by Git.
