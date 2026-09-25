import type { PaymentProvider } from "../PaymentProvider.js";
import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "../types.js";

/**
 * Small deterministic stand-in for the production Stripe adapter.
 *
 * The demo intentionally avoids external network calls so the architectural
 * boundary can be tested deterministically in CI.
 */
export class StripeProvider implements PaymentProvider {
  readonly name = "stripe";

  async charge(request: ChargeRequest): Promise<ChargeResult> {
    if (request.amountCents <= 0) {
      throw new Error("Charge amount must be positive");
    }

    return {
      provider: this.name,
      transactionId: `stripe_tx_${request.orderId}`,
      status: "succeeded",
    };
  }

  async refund(request: RefundRequest): Promise<RefundResult> {
    if (request.amountCents <= 0) {
      throw new Error("Refund amount must be positive");
    }

    return {
      provider: this.name,
      refundId: `stripe_refund_${request.transactionId}`,
      status: "refunded",
    };
  }
}
