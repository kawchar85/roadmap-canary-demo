import type { PaymentService } from "../payments/PaymentService.js";

export class RefundService {
  constructor(private readonly payments: PaymentService) {}

  async refund(transactionId: string, amountCents: number) {
    return this.payments.refund({ transactionId, amountCents });
  }
}
