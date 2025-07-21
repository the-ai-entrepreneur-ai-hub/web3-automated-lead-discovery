export interface User {
  email: string;
  tier: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  company?: string;
  subscriptionStatus?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  emailVerified?: boolean;
  registrationDate?: string;
}