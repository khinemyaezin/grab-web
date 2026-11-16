// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAccount, useUpdateAccount, useC2CApplicationGet, useRetailerApplicationGet, useAccountApplicationSubmit } from './use-account';
import { PlatformProvider } from '@khinemyaezin/seller-ui';
import type { PlatformApiClient, SellerPlatform } from '@khinemyaezin/seller-contracts';
import React from 'react';

const mockApi = {
    request: vi.fn(),
    followLink: vi.fn(),
    withConfig: vi.fn(),
};

const mockPlatform = {
    api: mockApi as unknown as PlatformApiClient,
} as unknown as SellerPlatform;

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PlatformProvider platform={mockPlatform}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </PlatformProvider>
);

describe('useAccount hooks', () => {
    beforeEach(() => {
        queryClient.clear();
        vi.clearAllMocks();
    });

    describe('useAccount', () => {
        it('should call api.followLink with POST and request body', async () => {
            const { result } = renderHook(() => useAccount(), { wrapper });
            const mockResponse = { id: 'account1' };
            mockApi.followLink.mockResolvedValue(mockResponse as any);

            const link = { href: '/api/account', rel: 'create' };
            const request = { type: 'C2C' } as any;

            result.current.mutate({ link, request });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockApi.followLink).toHaveBeenCalledWith(link, "POST", request);
            expect(result.current.data).toEqual(mockResponse);
        });
    });

    describe('useUpdateAccount', () => {
        it('should call api.followLink with PATCH and request body', async () => {
            const { result } = renderHook(() => useUpdateAccount(), { wrapper });
            const mockResponse = { id: 'account1' };
            mockApi.followLink.mockResolvedValue(mockResponse as any);

            const link = { href: '/api/account/1', rel: 'update' };
            const request = { legalName: 'New Name' } as any;

            result.current.mutate({ link, request });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockApi.followLink).toHaveBeenCalledWith(link, "PATCH", request);
        });
    });

    describe('useC2CApplicationGet', () => {
        it('should not fetch if link is not provided', () => {
            const { result } = renderHook(() => useC2CApplicationGet(), { wrapper });
            expect(result.current.isPending).toBe(true);
            expect(mockApi.followLink).not.toHaveBeenCalled();
        });

        it('should fetch application status when link is provided', async () => {
            const mockResponse = { status: 'ACTIVE' };
            mockApi.followLink.mockResolvedValue(mockResponse as any);

            const link = { href: '/api/c2c', rel: 'self' };
            const { result } = renderHook(() => useC2CApplicationGet(link), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockApi.followLink).toHaveBeenCalledWith(link, "GET");
            expect(result.current.data).toEqual(mockResponse);
        });
    });

    describe('useRetailerApplicationGet', () => {
        it('should fetch application status when link is provided', async () => {
            const mockResponse = { status: 'PENDING_REVIEW' };
            mockApi.followLink.mockResolvedValue(mockResponse as any);

            const link = { href: '/api/retailer', rel: 'self' };
            const { result } = renderHook(() => useRetailerApplicationGet(link), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockApi.followLink).toHaveBeenCalledWith(link, "GET");
            expect(result.current.data).toEqual(mockResponse);
        });
    });

    describe('useAccountApplicationSubmit', () => {
        it('should call api.followLink with POST and no body', async () => {
            const { result } = renderHook(() => useAccountApplicationSubmit(), { wrapper });
            const mockResponse = { success: true };
            mockApi.followLink.mockResolvedValue(mockResponse as any);

            const link = { href: '/api/submit', rel: 'submit' };
            result.current.mutate({ link });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockApi.followLink).toHaveBeenCalledWith(link, "POST");
        });
    });
});
