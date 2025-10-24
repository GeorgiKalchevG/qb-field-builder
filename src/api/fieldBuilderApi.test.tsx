import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import nock from 'nock'
import React from 'react'
import {
    API,
    useDeleteSelectField,
    useExistingFields,
    useGetSelectFieldBy,
    useSaveSelectField
} from './fieldBuilderApi.ts'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
})
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
describe('testing get data hook', () => {
    beforeEach(() => {
        nock.cleanAll()
        nock.enableNetConnect();
    })
    it('should fail to get data for useExistingFields', async () => {
        nock(API).get('/fields').reply(403,
            {
                answer: 42,
            }
        )
        const { result } = renderHook(() => useExistingFields(), { wrapper })
        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.data).toEqual(undefined)
    });
    it('should fail to get data for useGetSelectFieldBy', async () => {
        nock(API).get('/fields/1').reply(403,
            {
                answer: 42,
            }
        )
        const { result } = renderHook(() => useGetSelectFieldBy('1'), { wrapper })
        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.data).toEqual(undefined)
    });
    it('should get data for useExistingFields', async () => {
        nock(API).get('/fields').times(1).reply(200, [{ answer: 42 }])
        const { result } = renderHook(() => useExistingFields(), { wrapper })
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([{ answer: 42 }])
    });
    it('should get data for useGetSelectFieldBy', async () => {
        nock(API).get('/fields/1').reply(200, { answer: 42 })
        const { result } = renderHook(() => useGetSelectFieldBy("1"), { wrapper })
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({ answer: 42, choices: [] })
    });

    it('should useDeleteSelectField', async () => {

        nock(API).intercept('/fields/1', 'DELETE').reply(200,
            {
                answer: 42,
            }
        )
        const { result } = renderHook(() => useDeleteSelectField(), { wrapper })
        result.current.mutate('1')
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({ answer: 42 })
    });
    it('should useDeleteSelectField', async () => {

        nock(API).intercept('/fields/1', 'DELETE').reply(403,
            {
                answer: 42,
            }
        )
        const { result } = renderHook(() => useDeleteSelectField(), { wrapper })
        result.current.mutate('1')
        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.data).toEqual(undefined)
    });
    it('should update existing selectField useSaveSelectField', async () => {
        nock(API).intercept('/fields/1', 'PUT').reply(200,
            {
                id: '5555',
                answer: 42,
            }
        )
        const mockCallback = vi.fn()
        const { result } = renderHook(() => useSaveSelectField(mockCallback), { wrapper })
        result.current.mutate({
            id: '1',
            label: '',
            required: false,
            choices: [],
            displayAlpha: false,
            default: ''
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({ answer: 42, "id": "5555" })
        expect(mockCallback).toHaveBeenCalledWith('5555')
    });
    it('should create new selectField useSaveSelectField', async () => {
        nock(API).intercept('/fields', 'POST').reply(200,
            {
                id: '555',
                answer: 42,
            }
        )
        const mockCallback = vi.fn()
        const { result } = renderHook(() => useSaveSelectField(mockCallback), { wrapper })
        result.current.mutate({
            label: '',
            required: false,
            choices: [],
            displayAlpha: false,
            default: ''
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({ answer: 42, id: '555' })
    });
    it('should create new selectField useSaveSelectField with error', async () => {
        nock(API).intercept('/fields', 'POST').reply(403,
            {
                answer: 42,
            }
        )
        const mockCallback = vi.fn()
        const { result } = renderHook(() => useSaveSelectField(mockCallback), { wrapper })
        result.current.mutate({
            label: '',
            required: false,
            choices: [],
            displayAlpha: false,
            default: ''
        })

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.data).toEqual(undefined)
        expect(mockCallback).not.toHaveBeenCalled()
    });
})


