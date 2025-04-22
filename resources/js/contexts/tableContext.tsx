import { createContext, useContext, useState, useCallback } from 'react';

interface TableContextType {
    refreshTable: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    shouldRefresh?: boolean;
}

const TableContext = createContext<TableContextType>({
    refreshTable: () => {},
    isLoading: false,
    setIsLoading: () => {},
    shouldRefresh: false,
});

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const refreshTable = useCallback(() => {
        setShouldRefresh(prev => !prev); // Toggle para forzar la actualización
    }, []);

    return (
        <TableContext.Provider value={{ refreshTable, isLoading, setIsLoading, shouldRefresh }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => useContext(TableContext);
