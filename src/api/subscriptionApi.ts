import { apiClient } from './apiClient';
import type { SubscriptionPlanDto } from '../types';

export interface ApplyCouponResult {
  code: string;
  discountValue: number;
  finalAmount: number;
  message: string;
}

export const subscriptionApi = {
  getPlans() {
    return apiClient.get<SubscriptionPlanDto[]>('/user/subscriptions/plans');
  },
  applyCoupon(code: string, amount: number) {
    return apiClient.post<ApplyCouponResult>('/user/subscriptions/apply-coupon', { code, amount });
  },
  upgrade(planId: string, couponCode?: string, gateway: number = 0) {
    return apiClient.post<{ message: string; subscription: any }>('/user/subscriptions/upgrade', {
      planId,
      couponCode,
      gateway,
    });
  },
  getMySubscription() {
    return apiClient.get<{
      tier: 'FREE' | 'BASIC' | 'PRO' | 'VIP';
      isPremium: boolean;
      planName: string;
      status: string;
      startDate?: string;
      endDate?: string;
    }>('/user/subscriptions/my-subscription');
  },
};
