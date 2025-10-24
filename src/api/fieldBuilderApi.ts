import { type UndefinedInitialDataOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUrl } from '../hooks/useUrl.ts'
import { useLocalStorage } from '../hooks/useLocalStorage.ts'

export const API = 'http://localhost:3000'
export type SelectField = {
    id?: string
    label: string
    required: boolean
    choices: string[]
    displayAlpha: boolean
    default: string
}

export const existingFieldsQueryParams = (id?: string) => {
    let url = `${API}/fields`
    const queryKey: (string | Record<string, string>)[] = ['fields']
    if (id !== undefined) {
        url += `/${id}`
        queryKey.push(id)
    }

    return {
        queryKey,
        url
    }
}
export type UseFieldBuilderQueryProps<T> = UndefinedInitialDataOptions<T, Error, T, readonly unknown[]>

const useFieldBuilderQuery = <T>({
                                     queryKey,
                                     queryFn,
                                     staleTime = Infinity,
                                     enabled = true,
                                     ...rest
                                 }: UseFieldBuilderQueryProps<T>) => {
    return useQuery<T>({ queryKey, queryFn, staleTime, enabled, ...rest })
}

const get = (url: string) => async () => {
    const response = await fetch(url)
    if (response.ok) {
        return await response.json()
    }
    throw new Error(`${response.status} - ${response.statusText}`)
}

export const useExistingFields = () => {
    const { queryKey, url } = existingFieldsQueryParams()
    return useFieldBuilderQuery<SelectField[]>({ queryKey, queryFn: get(url) })
}

export function useGetSelectFieldBy(id?: string) {
    const enabled = id != undefined
    const { queryKey, url } = existingFieldsQueryParams(id)
    return useFieldBuilderQuery<SelectField>({
        queryFn: get(url), queryKey, enabled, select: (data) => ({
            ...data,
            choices: data.choices || []
        })
    })
}

export const useSaveSelectField = (onSuccessCallback: (id: string) => void) => {
    const queryClient = useQueryClient()
    const { updateUrl } = useUrl()
    const { deleteItem } = useLocalStorage()
    const { queryKey: baseKey } = existingFieldsQueryParams()
    const mutationFn = async (payload: SelectField) => {
        const { url } = existingFieldsQueryParams(payload.id)
        let method = "POST"
        if (payload.id != undefined) {
            method = "PUT"
        }

        const response = await fetch(
            url,
            {
                method,
                body: JSON.stringify(payload)
            }
        )
        if (response.ok) {
            return await response.json()
        }
        throw new Error(`${response.status} - ${response.statusText}`)
    }
    return useMutation({
        mutationFn,
        onSuccess: async (data, payload) => {
            const response = data
            await queryClient.invalidateQueries({ queryKey: baseKey, exact: true })
            await queryClient.invalidateQueries({ queryKey: ['fields', payload.id] })
            updateUrl({ name: 'formId', data: response.id })
            onSuccessCallback(response.id)
            deleteItem()
        }
    })
}

export const useDeleteSelectField = () => {
    const mutationFn = async (id: string) => {
        const { url } = existingFieldsQueryParams(id)
        const response = await fetch(
            url,
            {
                method: "DELETE",
            }
        )
        if (response.ok) {
            return await response.json()
        }
        throw new Error(`${response.status} - ${response.statusText}`)

    }
    return useMutation({ mutationFn })
}