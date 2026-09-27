import { PaymentService } from "../src/payments/PaymentService.js";
import { CanaryPayProvider } from "../src/payments/providers/CanaryPayProvider.js";

export const futureProviderName = "canary-pay";

export function createFuturePaymentProvider(): CanaryPayProvider {
  return new CanaryPayProvider();
}

export function createFuturePaymentService(): PaymentService {
  return new PaymentService(createFuturePaymentProvider());
}
