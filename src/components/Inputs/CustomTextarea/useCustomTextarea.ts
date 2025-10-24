import { useFormContext, type ValidateResult } from 'react-hook-form'
import { type ChangeEvent, type ClipboardEvent, type KeyboardEvent, useCallback, useState } from 'react'
import type { SelectField } from '../../FieldBuilder/types.ts'

export interface UseCustomTextareaProps {
    maxChoices: number,
    maxLength: number,
    required?: boolean
}

export const useCustomTextarea = ({ maxChoices, required, maxLength }: UseCustomTextareaProps) => {
    const [inputValue, setInputValue] = useState<string>('')

    const {
        formState: { errors },
        setError,
        clearErrors,
        register,
        watch,
        setValue
    } = useFormContext<SelectField>()

    const choices = watch('choices')

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value || ''
        if (inputValue === '') {
            clearErrors('choices')
        }
        setInputValue(inputValue)
    }, [clearErrors])

    const updateValue = useCallback((newValue: string[]) => {
        setValue('choices', newValue)
        clearErrors('choices')
    }, [clearErrors, setValue])

    const checkIsValid = useCallback(() => {
        const checkForDuplicates = choices.some(f => f === inputValue)
        const isLimitReached = choices.length >= maxChoices && inputValue !== ''
        if (checkForDuplicates) {
            setError('choices', { type: "duplicates", message: "Duplicate Entries Not Allowed" })
            return false
        }
        if (isLimitReached) {
            setError('choices', { type: "duplicates", message: "Limit Reached" })
            return false
        }
        clearErrors('choices')
        return true
    }, [choices, maxChoices, inputValue, clearErrors, setError])

    const addItem = useCallback(() => {
        const trimmed = inputValue.trim()
        if (trimmed.length > 0) {
            updateValue([...choices, trimmed])
        }
        setInputValue('')
    }, [choices, inputValue, updateValue])
    const tryAddingItem = useCallback(() => {
        if (checkIsValid()) {
            addItem()
        }
    }, [addItem, checkIsValid])

    const removeItem = useCallback((item: string) => {
        updateValue(choices.filter(i => i !== item))
    }, [choices, updateValue])

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            tryAddingItem()
            e.preventDefault()
        }
        if (e.key === 'Backspace' && inputValue === '') {
            updateValue(choices.slice(0, -1))
        }

    }, [choices, inputValue, tryAddingItem, updateValue])

    function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
        const text = e.clipboardData.getData('text')

        if (text && /[\n,]/.test(text)) {
            e.preventDefault()
            const parts: string[] = text.split(/[\n,]/)
                .map((s: string) => s.replace(/[\r\n]/g, '').trim())
                .filter(Boolean)

            if (parts.length === 0) return

            const set = new Set(choices)
            parts.forEach(p => set.add(p))
            updateValue(Array.from(set))
            setInputValue('')
        }
    }

    const validate = {
        content: (value: string[], formValues: SelectField): ValidateResult => {
            if (formValues.default !== '') {
                const isDefaultPresent = value?.some(c => c === formValues.default)
                if (value.length >= maxChoices && !isDefaultPresent) {
                    return `Limit (${maxChoices}) reached, please remove ${value.length - maxChoices + 1} to add the default value`
                }
            } else {
                if (value.length === 0 && required) {
                    return 'At lease one choice or default value is needed'
                }
            }

            const aboveCharLimitCount = value.filter(c => c.length > maxLength).length
            if (aboveCharLimitCount > 0) {
                return `${aboveCharLimitCount} choices are larger that permitted`
            }
        }
    }

    return {
        inputValue,
        handleInputChange,
        handleKeyDown,
        tryAddingItem,
        handlePaste,
        choices,
        errors,
        removeItem,
        register,
        validate
    }
}