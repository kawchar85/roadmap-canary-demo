import { describe, expect, it } from "vitest";

import { CheckoutService } from "../src/checkout/CheckoutService.js";
import { RefundService } from "../src/refunds/RefundService.js";
import {
  createFuturePaymentService,
  futureProviderName,
} from "../canary/future-payment-proof.js";

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
