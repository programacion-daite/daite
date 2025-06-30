import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useState, useCallback } from 'react';

interface TableContextType {
    refreshTable: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    shouldRefresh?: boolean;
    invalidateTableQueries: (tableName: string) => Promise<void>;
}

const TableContext = createContext<TableContextType>({
    invalidateTableQueries: async () => {},
    isLoading: false,
    refreshTable: () => {},
    setIsLoading: () => {},
    shouldRefresh: false,
});

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const queryClient = useQueryClient();

    const invalidateTableQueries = useCallback(async (tableName: string) => {
        await queryClient.invalidateQueries({
            queryKey: ['table-data', tableName]
        });
        await queryClient.invalidateQueries({
            queryKey: ['initial-table-load', tableName]
        });
    }, [queryClient]);

    const refreshTable = useCallback(() => {
        setShouldRefresh(prev => !prev);
    }, []);

    return (
        <TableContext.Provider value={{
            invalidateTableQueries,
            isLoading,
            refreshTable,
            setIsLoading,
            shouldRefresh
        }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => useContext(TableContext);
