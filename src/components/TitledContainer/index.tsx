import type { ReactNode } from 'react'
import styles from './styles.module.scss'
import cn from 'classnames'

export interface TitledContainer {
    title: string
    children: ReactNode
    className?: string
}

export const TitledContainer = ({ title, className, children }: TitledContainer) => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>{title}</div>
            <div className={cn(styles.content, className)}>
                {children}
            </div>
        </div>
    );
};