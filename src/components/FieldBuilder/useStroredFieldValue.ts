import { useLocalStorage } from '../../hooks/useLocalStorage.ts'
import type { SelectField } from './types.ts'
import { useUrl } from '../../hooks/useUrl.ts'
import { useGetSelectFieldBy } from '../../api/fieldBuilderApi.ts'
import { useMemo } from 'react'

export const useStoredFieldValue = (fieldId?: string) => {
    const { getForm } = useLocalStorage<SelectField>()
    const { removeFromUrl } = useUrl()
    const { isLoading, data, isError } = useGetSelectFieldBy(fieldId)
    if (isError) {
        removeFromUrl({ name: 'formId', data: undefined })
    }

    return useMemo(() => {
        if (!fieldId) {
            const { isError, data } = getForm()
            return { isLoading: false, data, isError }
        } else {
            return { isLoading, data, isError }
        }
    }, [data, fieldId, getForm, isError, isLoading])

}