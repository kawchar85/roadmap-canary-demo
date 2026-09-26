import type { PaymentService } from "../payments/PaymentService.js";

export class RefundService {
  constructor(private readonly payments: PaymentService) {}

  async refund(transactionId: string, amountCents: number) {
    if (!transactionId.startsWith("stripe_tx_")) {
      throw new Error("RefundService expects a Stripe transaction id");
    }

    return this.payments.refund({ transactionId, amountCents });
  }
}
