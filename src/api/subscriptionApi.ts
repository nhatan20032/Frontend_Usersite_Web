import { apiClient } from './apiClient';
import type { SubscriptionPlanDto } from '../types';

export interface ApplyCouponResult {
  code: string;
  discountValue: number;
  finalAmount: number;
  message: string;
}

export const subscriptionApi = {
  getTransactions: () => apiClient.get<Array<{ transactionCode: string; planName: string; amount: number; status: string; createdAt: string }>>('/user/subscriptions/transactions'),
  getPlans() {
    return apiClient.get<SubscriptionPlanDto[]>('/user/subscriptions/plans');
  },
  applyCoupon(code: string, amount: number) {
    return apiClient.post<ApplyCouponResult>('/user/subscriptions/apply-coupon', { code, amount });
  },
  upgrade(planId: string, couponCode?: string, gateway: number = 3) {
    return apiClient.post<{ message: string; transactionCode: string; status: string; amount: number; vietQrUrl: string }>('/user/subscriptions/upgrade', {
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
  getTransactionStatus(code: string) {
    return apiClient.get<{
      transactionCode: string;
      status: string;
      planName?: string;
      finalAmount: number;
      isSuccess: boolean;
    }>(`/user/subscriptions/transactions/${code}/status`);
  },
};
