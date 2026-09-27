import { describe, expect, it } from "vitest";

import { CheckoutService } from "../src/checkout/CheckoutService.js";
import { RefundService } from "../src/refunds/RefundService.js";
import {
  createFuturePaymentProvider,
  createFuturePaymentService,
  futureProviderName,
} from "../canary/future-payment-proof.js";

// Keep future-capability assertions self-contained in this protected Canary
// file. Do not import executable assertion helpers from ordinary product tests:
// those tests may legitimately evolve with the current architecture.
describe(`${futureProviderName} future payment-provider contract`, () => {
  it("charges through the shared provider contract", async () => {
    const provider = createFuturePaymentProvider();
    const result = await provider.charge({
      orderId: "future-contract-order",
      amountCents: 2500,
      currency: "USD",
    });

    expect(result.provider).toBe(futureProviderName);
    expect(result.status).toBe("succeeded");
    expect(result.transactionId).toContain("future-contract-order");
  });

  it("refunds through the shared provider contract", async () => {
    const provider = createFuturePaymentProvider();
    const result = await provider.refund({
      transactionId: "future-contract-tx",
      amountCents: 1000,
    });

    expect(result.provider).toBe(futureProviderName);
    expect(result.status).toBe("refunded");
  });
});

describe("accepted future capability: multiple payment providers", () => {
  it("uses a provider distinct from the current Stripe adapter", () => {
    expect(futureProviderName).not.toBe("stripe");
  });

  it("executes the second provider through the real checkout path", async () => {
    const checkout = new CheckoutService(createFuturePaymentService());

    const receipt = await checkout.checkout({
      orderId: "future-order",
      amountCents: 5100,
      currency: "USD",
    });

    expect(receipt.paymentProvider).toBe(futureProviderName);
    expect(receipt.paymentTransactionId).toContain("future-order");
    expect(receipt.paymentTransactionId.startsWith("stripe_")).toBe(false);
  });

  it("keeps refunds on the real vendor-neutral service path", async () => {
    const payments = createFuturePaymentService();
    const checkout = new CheckoutService(payments);
    const refunds = new RefundService(payments);

    const receipt = await checkout.checkout({
      orderId: "future-refund-order",
      amountCents: 3200,
      currency: "USD",
    });
    const result = await refunds.refund(receipt.paymentTransactionId, 900);

    expect(result.provider).toBe(futureProviderName);
    expect(result.status).toBe("refunded");
  });
});
