import { type DefaultValues, type FieldValues, FormProvider, useForm } from 'react-hook-form'
import { type ReactNode } from 'react'

export interface FromWrapperProps<T> {
    children: ReactNode
    defaultValues: DefaultValues<T>
}

export const FormWrapper = <T extends FieldValues>({ children, defaultValues }: FromWrapperProps<T>) => {
    const methods = useForm<T>({ mode: 'all', defaultValues });
    return (
        <FormProvider {...methods}>
            {children}
        </FormProvider>
    )
}