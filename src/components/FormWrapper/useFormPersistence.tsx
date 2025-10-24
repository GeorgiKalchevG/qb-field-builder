import { type FieldValues, useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.ts'

export interface UseFormPersistenceProps<T> {
    data: T
    isLoading: boolean
    blockingPath: keyof T
}

export const useFormPersistence = <T extends FieldValues = never>({
                                                                      data,
                                                                      isLoading,
                                                                      blockingPath
                                                                  }: UseFormPersistenceProps<T>) => {
    const { reset, subscribe } = useFormContext<T>()
    const { setForm } = useLocalStorage<T>()
    useEffect(() => {
        if (!isLoading) {
            reset(data)
        }
    }, [data, isLoading, reset])
    useEffect(() => {
        const callback = subscribe({
            formState: { values: true },
            callback: ({ values }) => {
                if (values[blockingPath] === undefined) {
                    setForm(values)
                }
            },
        })

        return () => callback()

    }, [subscribe, setForm, blockingPath])
}