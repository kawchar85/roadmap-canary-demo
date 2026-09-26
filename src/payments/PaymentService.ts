import { StripeProvider } from "./providers/StripeProvider.js";
import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "./types.js";

/**
 * Application-facing payment facade specialized around the current provider.
 */
export class PaymentService {
  constructor(private readonly provider: StripeProvider) {
    if (provider.name !== "stripe") {
      throw new Error("PaymentService requires the Stripe provider");
    }
  }

  charge(request: ChargeRequest): Promise<ChargeResult> {
    return this.provider.charge(request);
  }

  refund(request: RefundRequest): Promise<RefundResult> {
    return this.provider.refund(request);
  }
}
