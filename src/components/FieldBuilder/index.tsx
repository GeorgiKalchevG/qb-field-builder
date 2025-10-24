import { useFormContext } from 'react-hook-form'
import { CheckboxField, InputField, Select } from '../Inputs/InputFields.tsx'
import styles from './styles.module.scss'
import { Button } from '../Button'
import { InputContainer } from '../Inputs/InputContainer'
import { CustomTextArea } from '../Inputs/CustomTextarea'
import { useSaveSelectField } from '../../api/fieldBuilderApi.ts'
import { useStoredFieldValue } from './useStroredFieldValue.ts'
import { DEFAULT_VALUES, MAX_CHOICE_LENGTH, MAX_CHOICES, type SelectField } from './types.ts'
import { SubmitButton } from '../Button/SubmitButton'
import { Loader } from '../Loader'
import { useFormPersistence } from '../FormWrapper/useFormPersistence.tsx'
import { useLocalStorage } from '../../hooks/useLocalStorage.ts'

const normalizeData = (data: SelectField): SelectField => {
    const booleanVars = ['displayAlpha', 'required']
    return Object.entries(data).reduce((acc, [key, value]) => {
        try {
            let transformedValue = booleanVars.includes(key) && !Array.isArray(value) && typeof value !== 'boolean' ? JSON.parse(value) : value
            transformedValue = typeof transformedValue === 'string' ? transformedValue.trim() : transformedValue
            return ({
                ...acc,
                [key]: transformedValue
            })
        } catch {
            return ({
                ...acc,
                [key]: value
            })
        }
    }, DEFAULT_VALUES)
}
export const FieldBuilder = ({ fieldId, updateId }: { fieldId?: string, updateId: (id?: string) => void }) => {
    const { data = DEFAULT_VALUES, isLoading } = useStoredFieldValue(fieldId)
    const saveFieldMutation = useSaveSelectField(updateId)
    const { deleteItem } = useLocalStorage()
    const { handleSubmit, reset, formState: { isDirty, isValid } } = useFormContext<SelectField>()

    useFormPersistence({ data, isLoading, blockingPath: 'id' })

    const onSubmit = (data: SelectField) => {
        if (isValid) {
            const isDefaultPresent = data.choices.some(c => c === data.default.trim())
            if (!isDefaultPresent && data.default.trim() !== '') {
                data.choices.push(data.default)
            }

            const normalizedData = normalizeData(data)
            saveFieldMutation.mutate(normalizedData)
        }
    };

    const handleReset = () => {
        if (fieldId) {
            reset()
        } else {
            deleteItem()
            reset(DEFAULT_VALUES)
        }
    }
    return (
        <Loader isLoading={isLoading} message='Loading...'>
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
                        loading={isLoading || saveFieldMutation.isPending} onClick={handleReset}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Loader>
    );
};