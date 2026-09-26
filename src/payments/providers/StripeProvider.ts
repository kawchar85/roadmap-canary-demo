import type { PaymentProvider } from "../PaymentProvider.js";
import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "../types.js";

/** Deterministic stand-in for the production Stripe adapter. */
export class StripeProvider implements PaymentProvider {
  readonly name = "stripe";

  async executeCharge(request: ChargeRequest): Promise<ChargeResult> {
    if (request.amountCents <= 0) {
      throw new Error("Charge amount must be positive");
    }

    return {
      provider: this.name,
      transactionId: `stripe_tx_${request.orderId}`,
      status: "succeeded",
    };
  }

  async executeRefund(request: RefundRequest): Promise<RefundResult> {
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
