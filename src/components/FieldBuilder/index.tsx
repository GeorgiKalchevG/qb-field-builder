import { FormProvider, useForm } from 'react-hook-form'
import { CheckboxField, InputField, Select } from '../Inputs/InputFields.tsx'
import styles from './styles.module.scss'
import { Button } from '../Button'
import { InputContainer } from '../Inputs/InputContainer'
import { CustomTextArea } from '../Inputs/CustomTextarea'
import { useLocalStorage } from '../../hooks/useLocalStorage.ts'
import { useSaveSelectField } from '../../api/fieldBuilderApi.ts'
import { Loader } from '../Loader'
import { useEffect } from 'react'
import { useStoredFieldValue } from './useStroredFieldValue.ts'
import type { SelectField } from './types.ts'
import { SubmitButton } from '../Button/SubmitButton'

const DEFAULT_VALUES: SelectField = {
    label: '',
    default: '',
    required: false,
    choices: [],
    displayAlpha: false
}

const MAX_CHOICES = 50
const MAX_CHOICE_LENGTH = 40

export const FieldBuilder = ({ fieldId, updateId }: { fieldId?: string, updateId: (id?: string) => void }) => {
    const { data = DEFAULT_VALUES, isLoading } = useStoredFieldValue(fieldId)
    const { setForm } = useLocalStorage<SelectField>()
    const saveFieldMutation = useSaveSelectField(updateId)
    const methods = useForm<SelectField>({ defaultValues: data, mode: 'all', });

    const { handleSubmit, reset, formState: { isDirty, isValid }, subscribe } = methods

    useEffect(() => {
        if (!isLoading) {
            reset(data)
        }
    }, [data, isLoading, reset])

    const onSubmit = (data: SelectField) => {
        if (isValid) {
            const isDefaultPresent = data.choices.some(c => c === data.default)
            if (!isDefaultPresent) {
                data.choices.push(data.default)
            }
            saveFieldMutation.mutate(data)
        }
    };

    useEffect(() => {
        const callback = subscribe({
            formState: { values: true },
            callback: ({ values }) => {
                if (values.id === undefined) {
                    setForm(values)
                }
            },
        })

        return () => callback()

    }, [subscribe, setForm])

    return (
        <Loader isLoading={isLoading} message='Loading...'>
            <FormProvider {...methods}>
                <form
                    className={styles.fieldBuilder} onSubmit={handleSubmit(onSubmit)}
                >
                    <InputContainer label='Label' id={'label'}>
                        <InputField
                            name='label' id='label' rules={{
                            required: "Field is required"
                        }}
                        />
                    </InputContainer>
                    <InputContainer label='Type' id='required'>
                        <CheckboxField
                            id='required'
                            name='required'
                            before={"Multi-select"}
                            after={"A Value is required"}
                        />
                    </InputContainer>
                    <InputContainer label='Default Value' id='default'>
                        <InputField name='default' id='default' />
                    </InputContainer>
                    <InputContainer label='Choices' id='choices'>
                        <CustomTextArea maxChoices={MAX_CHOICES} maxLength={MAX_CHOICE_LENGTH} required id='choices' />
                    </InputContainer>
                    <InputContainer label='displayAlpha' id='displayAlpha'>
                        <Select
                            id='displayAlpha'
                            name='displayAlpha'
                            options={[
                                { label: 'Do not sort', value: 'false' },
                                { label: 'Display choices in alphabetical order a-z', value: 'true' }
                            ]}
                        />
                    </InputContainer>
                    <div className={styles.formFooter}>
                        <SubmitButton disabled={!isDirty} loading={isLoading || saveFieldMutation.isPending}>
                            Save changes
                        </SubmitButton>
                        <span>Or</span>
                        <Button
                            type='button'
                            variant='negative' kind='secondary'
                            loading={isLoading || saveFieldMutation.isPending} onClick={() => reset()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Loader>
    );
};