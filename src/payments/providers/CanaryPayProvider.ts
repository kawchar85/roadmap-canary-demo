import type { PaymentProvider } from "../PaymentProvider.js";
import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "../types.js";

/** Disposable second-provider adapter used only as executable Canary evidence. */
export class CanaryPayProvider implements PaymentProvider {
  readonly name = "canary-pay";

  async charge(request: ChargeRequest): Promise<ChargeResult> {
    if (request.amountCents <= 0) {
      throw new Error("Charge amount must be positive");
    }

    return {
      provider: this.name,
      transactionId: `canary_tx_${request.orderId}`,
      status: "succeeded",
    };
  }

  async refund(request: RefundRequest): Promise<RefundResult> {
    if (request.amountCents <= 0) {
      throw new Error("Refund amount must be positive");
    }

    return {
      provider: this.name,
      refundId: `canary_refund_${request.transactionId}`,
      status: "refunded",
    };
  }
}
