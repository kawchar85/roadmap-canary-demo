import { describe, expect, it } from "vitest";

import type { PaymentProvider } from "../src/payments/PaymentProvider.js";
import { StripeProvider } from "../src/payments/providers/StripeProvider.js";

function paymentProviderContract(
  providerName: string,
  createProvider: () => PaymentProvider,
): void {
  describe(`${providerName} payment-provider contract`, () => {
    it("charges through the common provider contract", async () => {
      const provider = createProvider();
      const result = await provider.executeCharge({
        orderId: "order-100",
        amountCents: 2500,
        currency: "USD",
      });

      expect(result.provider).toBe(providerName);
      expect(result.status).toBe("succeeded");
      expect(result.transactionId).toContain("order-100");
    });

    it("refunds through the common provider contract", async () => {
      const provider = createProvider();
      const result = await provider.executeRefund({
        transactionId: "tx-100",
        amountCents: 1000,
      });

      expect(result.provider).toBe(providerName);
      expect(result.status).toBe("refunded");
    });
  });
}

paymentProviderContract("stripe", () => new StripeProvider());

export { paymentProviderContract };
