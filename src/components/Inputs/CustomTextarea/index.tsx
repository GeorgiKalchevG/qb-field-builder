import styles from './styles.module.scss'
import { Button } from '../../Button'
import { ErrorMessage } from '../../ErrorMessage'
import { useCustomTextarea } from './useCustomTextarea.ts'

export interface CustomTextAreaProps {
    maxChoices: number
    maxLength: number
    required?: boolean
    id: string
}

export const CustomTextArea = ({ maxChoices, maxLength, required, id }: CustomTextAreaProps) => {
    const {
        choices,
        handlePaste,
        tryAddingItem,
        handleKeyDown,
        handleInputChange,
        inputValue,
        errors,
        removeItem,
        register,
        validate
    } = useCustomTextarea({ maxChoices, maxLength, required })
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div
                    className={styles.hint}
                    title='Press Enter or remove focus to add. Backspace to remove last. Paste multiple lines to bulk add.'
                >
                    &#x1F6C8;
                </div>
                <div className={styles.elements}>
                    <input id={id} className={styles.hiddenField} type='text' {...register('choices', { validate })} />
                    {choices.map((item) => (
                        <div key={item} className={styles.line}>
                            <div data-testid='textarea-line' className={styles.lineText}>
                                <span>{item.slice(0, maxLength)}</span><span>{item.slice(maxLength,)}</span></div>
                            <Button
                                type='button'
                                kind='secondary'
                                variant='negative'
                                size='small'
                                className={styles.removeBtn}
                                onClick={() => removeItem(item)}
                            >
                                &#x2715;
                            </Button>
                        </div>
                    ))}
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        placeholder='Type here'
                        name='choice'
                        type='text'
                        className={styles.input}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={tryAddingItem}
                        onPaste={handlePaste}
                    />
                </div>
                <ErrorMessage className={styles.errorContainer} message={errors?.choices?.message} />
                <div className={styles.counter}>({choices.length}/{maxChoices})</div>
            </div>
        </div>
    )
}

