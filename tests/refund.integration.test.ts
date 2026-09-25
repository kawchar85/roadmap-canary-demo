import { describe, expect, it } from "vitest";

import { PaymentService } from "../src/payments/PaymentService.js";
import { StripeProvider } from "../src/payments/providers/StripeProvider.js";
import { RefundService } from "../src/refunds/RefundService.js";

describe("refund integration", () => {
  it("executes refunds through the same vendor-neutral payment boundary", async () => {
    const payments = new PaymentService(new StripeProvider());
    const refunds = new RefundService(payments);

    const result = await refunds.refund("stripe_tx_order-42", 1200);

    expect(result.provider).toBe("stripe");
    expect(result.status).toBe("refunded");
  });
});
