import {
    Controller,
    type DeepRequired,
    type FieldErrorsImpl,
    type FieldValues,
    type GlobalError,
    type Path,
    type RegisterOptions,
    useFormContext
} from 'react-hook-form'
import styles from './styles.module.scss'
import { ErrorMessage } from '../ErrorMessage'
import type { ReactNode } from 'react'

export interface BaseInputProps<T extends FieldValues> {
    children: ReactNode,
    name: Path<T>,
    errors?: Partial<FieldErrorsImpl<DeepRequired<FieldValues>>> & { root?: Record<string, GlobalError> & GlobalError }
    rules?: Omit<RegisterOptions<T, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined
}

const BaseInput = <T extends FieldValues = FieldValues>({ children, errors, name }: BaseInputProps<T>) => {
    return (
        <div>
            {children}
            <ErrorMessage className={styles.errorContainer} message={errors?.[name]?.message as string} />
        </div>
    )
}

export interface FieldProps<T extends FieldValues> extends Omit<BaseInputProps<T>, 'children'> {
    id: string
    rules?: Omit<RegisterOptions<T, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined
}

export const InputField = <T extends FieldValues>({ name, id, rules }: FieldProps<T>) => {
    const { formState: { errors }, control } = useFormContext<T>()
    return (
        <BaseInput<T> name={name} errors={errors}>
            <Controller
                render={({ field }) => (
                    <input
                        {...field}
                        type='text'
                        id={id}
                        aria-invalid={errors[name] ? "true" : "false"}
                    />
                )}
                name={name}
                control={control}
                rules={rules}
            />
        </BaseInput>
    );
};

export interface CheckboxFieldProps<T extends FieldValues> extends Omit<BaseInputProps<T>, "rules" | "children"> {
    id: string
    before: string,
    after: string
    rules?: Omit<RegisterOptions<FieldValues, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined
}

export const CheckboxField = <T extends FieldValues = FieldValues>({
                                                                       name,
                                                                       id,
                                                                       rules,
                                                                       before,
                                                                       after
                                                                   }: CheckboxFieldProps<T>) => {
    const { formState: { errors }, control } = useFormContext()

    return (
        <BaseInput<T> name={name} errors={errors}>
            {before && <span>{before}</span>}
            <Controller
                render={({ field }) => (
                    <input
                        {...field}
                        type='checkbox'
                        id={id}
                        aria-invalid={errors.name ? "true" : "false"}
                        checked={field.value}
                    />
                )}
                rules={rules}
                name={name}
                control={control}
            />
            {after && <span>{after}</span>}
        </BaseInput>
    );
};

export interface SelectProps<T extends FieldValues> extends Omit<BaseInputProps<T>, "children"> {
    options: { value: string, label: string }[],
    defaultValue?: Path<T>,
    id: string
}

export const Select = <T extends FieldValues>({ options, name, defaultValue, id }: SelectProps<T>) => {
    const { formState: { errors }, control } = useFormContext()
    return (
        <BaseInput<T> name={name} errors={errors}>
            <Controller
                render={({ field }) => (
                    <select {...field} id={id}>
                        {options.map(({ value, label }) => {
                            return (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            )
                        })}
                    </select>
                )}
                name={name}
                control={control}
                defaultValue={defaultValue}
            />
        </BaseInput>
    )
}
