import type {
  ChargeRequest,
  ChargeResult,
  RefundRequest,
  RefundResult,
} from "./types.js";

/**
 * Refactored around the only provider the product currently ships.
 *
 * This keeps today's behavior simple, but intentionally demonstrates the kind
 * of coupling that can make a committed multi-provider roadmap item expensive.
 */
export interface PaymentProvider {
  readonly name: "stripe";
  readonly stripeAccountId: string;

  charge(request: ChargeRequest): Promise<ChargeResult>;
  refund(request: RefundRequest): Promise<RefundResult>;
}
