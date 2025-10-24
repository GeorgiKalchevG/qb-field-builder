import { useCallback } from 'react'

const FIELD_DATA_KEY = 'FIELD_DATA_KEY' as const

export const useLocalStorage = <T>(key = FIELD_DATA_KEY) => {
    const getForm = useCallback((): { data: T | undefined, isError: boolean } => {
        try {
            const found = localStorage.getItem(key)
            if (found !== null) {
                return { data: JSON.parse(found), isError: false };
            }
            return { data: undefined, isError: false }
        } catch {
            return { data: undefined, isError: true }
        }
    }, [key])
    const setForm = (data: T) => {
        localStorage.setItem(key, JSON.stringify(data));
    }
    const deleteItem = (key = FIELD_DATA_KEY) => {
        localStorage.removeItem(key);
    }
    return { getForm, setForm, deleteItem }
}
