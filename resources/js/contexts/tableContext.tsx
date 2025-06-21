import { createContext, useContext, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface TableContextType {
    refreshTable: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    shouldRefresh?: boolean;
    invalidateTableQueries: (tableName: string) => Promise<void>;
}

const TableContext = createContext<TableContextType>({
    refreshTable: () => {},
    isLoading: false,
    setIsLoading: () => {},
    shouldRefresh: false,
    invalidateTableQueries: async () => {},
});

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const queryClient = useQueryClient();

    const invalidateTableQueries = useCallback(async (tableName: string) => {
        // Invalidar todas las queries relacionadas con esta tabla
        await queryClient.invalidateQueries({
            queryKey: ['table-data', tableName]
        });
        await queryClient.invalidateQueries({
            queryKey: ['initial-table-load', tableName]
        });
    }, [queryClient]);

    const refreshTable = useCallback(() => {
        setShouldRefresh(prev => !prev); // Toggle para forzar la actualización
    }, []);

    return (
        <TableContext.Provider value={{
            refreshTable,
            isLoading,
            setIsLoading,
            shouldRefresh,
            invalidateTableQueries
        }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => useContext(TableContext);
