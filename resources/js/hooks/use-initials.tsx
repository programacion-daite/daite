import { useCallback } from 'react';

export function useInitials() {
    const getInitials = useCallback((username: string): string => {

        const firstInitial = username.charAt(0);
        const lastInitial = username.charAt(username.length - 1);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);

    return getInitials;
}
