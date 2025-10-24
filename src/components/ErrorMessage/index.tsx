import styles from './styles.module.scss'
import cn from 'classnames'

export interface ErrorMessageProps {
    message?: string
    className?: string
}

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
        if (!message) {
            return null
        }
        return (
            <div className={cn(styles.errorMessage, className)}>
                <span data-testid={'error-message'} role='alert' className={styles.errorMessage}>{message}</span>
            </div>
        );
    }
;