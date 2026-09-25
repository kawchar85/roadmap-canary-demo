import type { PaymentService } from "../payments/PaymentService.js";
import type { Currency } from "../payments/types.js";

export interface CheckoutRequest {
  orderId: string;
  amountCents: number;
  currency: Currency;
}

export interface CheckoutReceipt {
  orderId: string;
  paymentTransactionId: string;
  paymentProvider: string;
  status: "paid";
}

export class CheckoutService {
  constructor(private readonly payments: PaymentService) {}

  async checkout(request: CheckoutRequest): Promise<CheckoutReceipt> {
    const result = await this.payments.charge({
      orderId: request.orderId,
      amountCents: request.amountCents,
      currency: request.currency,
    });

    return {
      orderId: request.orderId,
      paymentTransactionId: result.transactionId,
      paymentProvider: result.provider,
      status: "paid",
    };
  }
}
