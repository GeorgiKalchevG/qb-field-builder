export const useUrl = () => {
    const url = new URL(location.href);
    const updateUrl = ({ name, data }: { name: string, data?: string }) => {
        if (data) {
            url.searchParams.set(name, data)
        } else {
            url.searchParams.delete(name);
        }
        history.pushState({}, "", url);
    }
    const removeFromUrl = ({ name, data }: { name: string, data?: string }) => {
        url.searchParams.delete(name, data)
        history.pushState({}, "", url);
    }

    const getSearchParams = (keys: string[]): string[] => {
        return keys.flatMap(key => url.searchParams.getAll(key)!).filter(Boolean)
    }
    return { updateUrl, getSearchParams, removeFromUrl }
}