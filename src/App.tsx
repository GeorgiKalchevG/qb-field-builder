import { TitledContainer } from './components/TitledContainer'
import { FieldBuilder } from './components/FieldBuilder'
import { Fields } from './components/Fields'
import { useState } from 'react'
import { existingFieldsQueryParams, useDeleteSelectField } from './api/fieldBuilderApi.ts'
import { useUrl } from './hooks/useUrl.ts'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from './components/Button'
import { SubmitButton } from './components/Button/SubmitButton'

function App() {
    const { queryKey } = existingFieldsQueryParams()
    const [id, setId] = useState<string | undefined>()
    const { removeFromUrl } = useUrl()
    const queryClient = useQueryClient()
    const deleteMutation = useDeleteSelectField()

    const handleFormDeletion = () => {
        deleteMutation.mutate(id!, {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey, exact: true })
                setId(undefined)
                removeFromUrl({ name: 'formId', data: undefined })
            }
        })
    }

    return (
        <>
            <Fields setId={setId} id={id} />
            <TitledContainer title={'Field Builder'}>
                <FieldBuilder fieldId={id} updateId={setId} />
            </TitledContainer>
            {id && <Button variant='negative' onClick={handleFormDeletion}>DeleteForm</Button>}
            <SubmitButton variant='neutral'>random button for context checking</SubmitButton>
        </>
    )
}

export default App
