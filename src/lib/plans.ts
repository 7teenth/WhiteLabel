export type PlanKey = 'free' | 'pro' | 'enterprise';

export type PlanLimits = {
  projects: number;
};

export const PLANS: Record<PlanKey, { projectsLimit: number }> = {
  free: {
    projectsLimit: 3,
  },
  pro: {
    projectsLimit: 100,
  },
  enterprise: {
    projectsLimit: Infinity,
  },
};

export function getPlanLimits(plan: PlanKey): PlanLimits {
  const config = PLANS[plan] ?? PLANS.free;
  return {
    projects: config.projectsLimit,
  };
}
