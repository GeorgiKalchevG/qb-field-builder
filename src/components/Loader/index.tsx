import type { ReactNode } from 'react'
import styles from './styles.module.scss'
import cn from 'classnames'

export interface LoaderProps {
    isLoading: boolean
    children: ReactNode
    message?: string
}

export const Loader = ({ children, isLoading, message }: LoaderProps) => {
    return (
        <div className={cn({ [styles.showLoader]: isLoading })}>
            <div className={styles.loader}>
                {isLoading && <span>{message}</span>}
            </div>
            <div className={styles.backdrop} />
            {children}
        </div>
    );
};