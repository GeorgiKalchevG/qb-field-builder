import { useEffect } from 'react';
import { useButtonContext } from './ButtonContext'
import { Button, type ButtonProps } from '.';

export const SubmitButton = ({ loading, ...rest }: ButtonProps) => {
    const { isLoading: isLoadingCtx, setIsLoading } = useButtonContext()
    useEffect(() => {
        setIsLoading(!!loading)
    }, [loading, setIsLoading]);
    return (
        <Button type='submit' {...rest} loading={isLoadingCtx}></Button>
    );
};