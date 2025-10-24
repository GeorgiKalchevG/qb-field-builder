import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

export interface SubmitButtonContextProps {
    isLoading: boolean
    setIsLoading: (arg: boolean) => void
}

const SubmitButtonContext = createContext<SubmitButtonContextProps | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useButtonContext = () => {
    const submitButtonContext = useContext(SubmitButtonContext)
    if (!submitButtonContext) {
        throw Error('Cannot use useButtonContext without a SubmitButtonContextProvider')
    }
    return submitButtonContext
}

export const SubmitButtonProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false)
    const value = useMemo(() => {
        return { isLoading, setIsLoading }
    }, [isLoading, setIsLoading])
    return (
        <SubmitButtonContext.Provider value={value}>
            {children}
        </SubmitButtonContext.Provider>
    )
}

