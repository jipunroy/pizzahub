export type UserRole = "customer" | "vendor" | "admin";

export type SubscriptionPlan = "free" | "premium";

export interface PizzaHubUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;

  role: UserRole;
  isBlocked: boolean;

  businessName?: string | null;

  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}