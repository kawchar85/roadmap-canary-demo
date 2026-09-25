import type { PaymentProvider } from "./PaymentProvider.js";
import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "./types.js";

/**
 * Application-facing payment facade.
 *
 * Product code talks to this service. Vendor-specific details remain behind
 * the PaymentProvider boundary.
 */
export class PaymentService {
  constructor(private readonly provider: PaymentProvider) {}

  charge(request: ChargeRequest): Promise<ChargeResult> {
    return this.provider.charge(request);
  }

  refund(request: RefundRequest): Promise<RefundResult> {
    return this.provider.refund(request);
  }
}
