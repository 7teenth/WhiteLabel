import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../lib/auth';
import { createDefaultSubscription, getSubscriptionForUser, SubscriptionRow } from '../lib/billing';
import { getPlanLimits, PlanKey } from '../lib/plans';

export type SubscriptionState = {
  plan: PlanKey;
  status: string;
  limits: {
    projects: number;
  };
  loading: boolean;
  error: string | null;
  subscription: SubscriptionRow | null;
  refresh: () => Promise<void>;
};

export function useSubscription(): SubscriptionState {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const { subscription: existing, error: fetchError } = await getSubscriptionForUser(user.id);

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (!existing) {
      const { subscription: created, error: createError } = await createDefaultSubscription(user.id);
      if (createError) {
        setError(createError.message);
        setLoading(false);
        return;
      }
      setSubscription(created);
      setLoading(false);
      return;
    }

    setSubscription(existing);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const planKey = (subscription?.plan ?? 'free') as PlanKey;

  return useMemo(
    () => ({
      plan: planKey,
      status: subscription?.status ?? 'active',
      limits: getPlanLimits(planKey),
      loading,
      error,
      subscription,
      refresh: loadSubscription,
    }),
    [planKey, subscription, loading, error, loadSubscription]
  );
}
