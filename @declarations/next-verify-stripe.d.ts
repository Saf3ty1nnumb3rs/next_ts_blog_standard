declare module '@webdeveducation/next-verify-stripe' {
  import { IncomingMessage } from 'http';
  import { Stripe } from 'stripe';

  interface VerifyStripeParams {
    req: IncomingMessage;
    stripe: Stripe;
    endpointSecret: string;
  }

  function verifyStripe(params: VerifyStripeParams): Promise<Stripe.Event>;

  export default verifyStripe;
}
