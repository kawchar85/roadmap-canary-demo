import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "./types.js";

/**
 * Vendor-neutral payment boundary used by the product.
 *
 * The current product ships with Stripe only, but checkout and refund flows
 * deliberately depend on this contract rather than a vendor implementation.
 */
export interface PaymentProvider {
  readonly name: string;

  charge(request: ChargeRequest): Promise<ChargeResult>;
  refund(request: RefundRequest): Promise<RefundResult>;
}
