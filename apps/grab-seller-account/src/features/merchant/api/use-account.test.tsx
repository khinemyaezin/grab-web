// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAccount, useUpdateAccount, useC2CApplicationGet, useRetailerApplicationGet, useAccountApplicationSubmit } from './use-account';
import { api } from '@khinemyaezin/seller-api';
import React from 'react';

vi.mock('@khinemyaezin/seller-api', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as any),
        api: {
            followLink: vi.fn(),
        },
    };
});

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
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
            vi.mocked(api.followLink).mockResolvedValue(mockResponse as any);

            const link = { href: '/api/account', rel: 'create' };
            const request = { type: 'C2C' } as any;

            result.current.mutate({ link, request });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(api.followLink).toHaveBeenCalledWith(link, "POST", request);
            expect(result.current.data).toEqual(mockResponse);
        });
    });

    describe('useUpdateAccount', () => {
        it('should call api.followLink with PATCH and request body', async () => {
            const { result } = renderHook(() => useUpdateAccount(), { wrapper });
            const mockResponse = { id: 'account1' };
            vi.mocked(api.followLink).mockResolvedValue(mockResponse as any);

            const link = { href: '/api/account/1', rel: 'update' };
            const request = { legalName: 'New Name' } as any;

            result.current.mutate({ link, request });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(api.followLink).toHaveBeenCalledWith(link, "PATCH", request);
        });
    });

    describe('useC2CApplicationGet', () => {
        it('should not fetch if link is not provided', () => {
            const { result } = renderHook(() => useC2CApplicationGet(), { wrapper });
            expect(result.current.isPending).toBe(true);
            expect(api.followLink).not.toHaveBeenCalled();
        });

        it('should fetch application status when link is provided', async () => {
            const mockResponse = { status: 'ACTIVE' };
            vi.mocked(api.followLink).mockResolvedValue(mockResponse as any);

            const link = { href: '/api/c2c', rel: 'self' };
            const { result } = renderHook(() => useC2CApplicationGet(link), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(api.followLink).toHaveBeenCalledWith(link, "GET");
            expect(result.current.data).toEqual(mockResponse);
        });
    });

    describe('useRetailerApplicationGet', () => {
        it('should fetch application status when link is provided', async () => {
            const mockResponse = { status: 'PENDING_REVIEW' };
            vi.mocked(api.followLink).mockResolvedValue(mockResponse as any);

            const link = { href: '/api/retailer', rel: 'self' };
            const { result } = renderHook(() => useRetailerApplicationGet(link), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(api.followLink).toHaveBeenCalledWith(link, "GET");
            expect(result.current.data).toEqual(mockResponse);
        });
    });

    describe('useAccountApplicationSubmit', () => {
        it('should call api.followLink with POST and no body', async () => {
            const { result } = renderHook(() => useAccountApplicationSubmit(), { wrapper });
            const mockResponse = { success: true };
            vi.mocked(api.followLink).mockResolvedValue(mockResponse as any);

            const link = { href: '/api/submit', rel: 'submit' };
            result.current.mutate({ link });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(api.followLink).toHaveBeenCalledWith(link, "POST");
        });
    });
});
