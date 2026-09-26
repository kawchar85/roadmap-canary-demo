import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "./types.js";

/**
 * Vendor-neutral payment boundary used by the product.
 *
 * The refactor standardizes provider operations around explicit execution
 * methods without changing the capability represented by this boundary.
 */
export interface PaymentProvider {
  readonly name: string;

  executeCharge(request: ChargeRequest): Promise<ChargeResult>;
  executeRefund(request: RefundRequest): Promise<RefundResult>;
}
