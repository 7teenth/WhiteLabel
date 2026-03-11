import { supabase } from './supabaseClient';

export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  current_period_end?: string | null;
  created_at?: string | null;
};

export async function getSubscriptionForUser(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { subscription: data, error };
}

export async function createDefaultSubscription(userId: string) {
  const { data, error } = await supabase.from('subscriptions').insert([
    {
      user_id: userId,
      plan: 'free',
      status: 'active',
    },
  ]);
  return { subscription: data?.[0] ?? null, error };
}

// Placeholder for future Stripe integration.
export async function createStripeCustomerPlaceholder(userId: string, email: string) {
  // TODO: Replace with Stripe customer creation when integrating Stripe.
  // eslint-disable-next-line no-console
  console.debug('stripe placeholder for', { userId, email });
  return {
    stripeCustomerId: null as string | null,
    error: null as null | Error,
  };
}
