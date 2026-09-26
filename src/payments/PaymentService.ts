import type { PaymentProvider } from "./PaymentProvider.js";
import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "./types.js";

/** Application-facing payment facade over the vendor-neutral provider boundary. */
export class PaymentService {
  constructor(private readonly provider: PaymentProvider) {}

  charge(request: ChargeRequest): Promise<ChargeResult> {
    return this.provider.executeCharge(request);
  }

  refund(request: RefundRequest): Promise<RefundResult> {
    return this.provider.executeRefund(request);
  }
}
