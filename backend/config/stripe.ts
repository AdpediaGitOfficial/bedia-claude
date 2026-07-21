import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Fail fast on a misconfigured key. Previously a publishable key (pk_...) was
// set here, which silently broke every server-side Stripe call (checkout
// sessions, payment intents) and left orders stuck in `pending`. Server-side
// Stripe operations REQUIRE a secret key (sk_... or rk_... restricted key).
if (!stripeSecretKey) {
  throw new Error(
    'STRIPE_SECRET_KEY is not set. Provide a Stripe SECRET key (sk_live_... / sk_test_...).',
  );
}

if (stripeSecretKey.startsWith('pk_')) {
  throw new Error(
    'STRIPE_SECRET_KEY is a publishable key (pk_...). Server-side Stripe calls require a ' +
      'SECRET key (sk_live_... / sk_test_...). Replace it or checkout/payments will fail.',
  );
}

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});
