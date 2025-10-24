import type { ReactNode } from 'react'
import styles from './styles.module.scss'

export interface InputContainerProps {
    label: string
    id: string
    children: ReactNode
}

export const InputContainer = ({ label, id, children }: InputContainerProps) => {
    return (
        <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor={id}>{label}</label>
            <div className={styles.inputField}>{children}</div>
        </div>
    )
}