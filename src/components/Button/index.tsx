import React, { type ComponentPropsWithoutRef, memo } from 'react'
import styles from './styles.module.scss'
import cn from 'classnames'

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    className?: string;
    variant?: 'positive' | 'negative' | 'neutral'
    kind?: 'primary' | 'secondary'
    size?: 'normal' | 'small'
    loading?: boolean
}

export const Button = memo((props: ButtonProps) => {
    const {
        className,
        variant = 'positive',
        kind = 'primary',
        size = "normal",
        loading,
        disabled,
        children,
        onClick,
        ...rest
    } = props

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (loading || disabled) {
            return
        }
        onClick?.(event)
    }
    return (
        <button
            className={cn(className, styles.button, {
                [styles.primary]: kind === 'primary',
                [styles.secondary]: kind === 'secondary',
                [styles.positive]: variant === 'positive',
                [styles.negative]: variant === 'negative',
                [styles.neutral]: variant === 'neutral',
                [styles.small]: size === 'small',
                [styles.normal]: size === 'normal',
                [styles.disabled]: disabled || loading,
            })} {...rest}
            onClick={handleClick}
            disabled={disabled}
        >
            <div className={cn({ [styles.loading]: loading })}></div>
            {children}
        </button>

    );
});