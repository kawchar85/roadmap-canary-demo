import { describe, expect, it } from "vitest";

import { CheckoutService } from "../src/checkout/CheckoutService.js";
import { PaymentService } from "../src/payments/PaymentService.js";
import { StripeProvider } from "../src/payments/providers/StripeProvider.js";

describe("checkout integration", () => {
  it("executes the real checkout path through PaymentService", async () => {
    const payments = new PaymentService(new StripeProvider());
    const checkout = new CheckoutService(payments);

    const receipt = await checkout.checkout({
      orderId: "order-42",
      amountCents: 4200,
      currency: "USD",
    });

    expect(receipt).toEqual({
      orderId: "order-42",
      paymentTransactionId: "stripe_tx_order-42",
      paymentProvider: "stripe",
      status: "paid",
    });
  });
});
