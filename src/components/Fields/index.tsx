import { ErrorMessage } from '../ErrorMessage'
import { type SelectField, useExistingFields } from '../../api/fieldBuilderApi.ts'
import { useUrl } from '../../hooks/useUrl.ts'
import styles from './styles.module.scss'
import cn from 'classnames'
import { useEffect } from 'react'
import { Loader } from '../Loader'
import { Button } from '../Button'
import { useLocalStorage } from '../../hooks/useLocalStorage.ts'

export function Fields({ id, setId }: { id: string | undefined, setId: (arg?: string) => void }) {
    const { isLoading, data = [], isError } = useExistingFields()
    const { deleteItem } = useLocalStorage<SelectField>()
    const { getSearchParams, updateUrl, removeFromUrl } = useUrl()
    const [formId] = getSearchParams(['formId'])
    useEffect(() => {
        if (id != formId) {
            setId(formId)
        }
    }, [formId, id, setId])

    const handleNewForm = () => {
        removeFromUrl({ name: 'formId', data: formId })
        setId(undefined)
        deleteItem()
    }
    const handleFormSelection = (data?: string) => {
        return () => {
            if (data) {
                updateUrl({ name: 'formId', data })
                setId(data)
                deleteItem()
            }
        }
    }

    if (isError || !data) {
        return <ErrorMessage message='Error while fetching saved fields' />
    }
    return (
        <>
            <Button variant='neutral' onClick={handleNewForm}>New Form</Button>
            <Loader isLoading={isLoading} message='Loading fields...'>
                <span>Available forms:</span>
                <ul className={styles.fieldList}>
                    {data.map(f => (
                        <li
                            key={f.id}
                            className={cn({ [styles.active]: f.id === id })}
                            onClick={handleFormSelection(f.id)}
                        >
                            {f.label}
                        </li>
                    ))}
                    {data.length === 0 && <span>No Select fields available</span>}
                </ul>
            </Loader>
        </>
    );
}