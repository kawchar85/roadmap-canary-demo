export type Currency = "USD" | "EUR" | "GBP";

export interface ChargeRequest {
  orderId: string;
  amountCents: number;
  currency: Currency;
}

export interface ChargeResult {
  provider: string;
  transactionId: string;
  status: "succeeded";
}

export interface RefundRequest {
  transactionId: string;
  amountCents: number;
}

export interface RefundResult {
  provider: string;
  refundId: string;
  status: "refunded";
}
