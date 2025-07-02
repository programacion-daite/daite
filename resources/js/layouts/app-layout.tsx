import { type ReactNode, useState } from 'react';

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import ResultModalNew from '@/components/modal/result-modal-new';
import { SUCCESS_TITLES } from '@/constants';
import { usePage, router } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutProps) => {
    const propsPage = usePage().props;
    const result = propsPage.result as any;
    const [open, setOpen] = useState(true);

    const handleCloseResult = () => {
        setOpen(false);
    };

    return (
        <AppLayoutTemplate {...props}>
            {children}
            {typeof result === 'object' && result !== null && Array.isArray(result) && result[0] && (
                <ResultModalNew
                    open={open}
                    onClose={handleCloseResult}
                    title={String(result[0].codigo_estado) === '200' ? SUCCESS_TITLES.SUCCESS : SUCCESS_TITLES.INCOMPLETE_INFO}
                    message={String(result[0].mensaje)}
                    errors={[]}
                    status={String(result[0].codigo_estado) === '200' ? 'success' : 'error'}
                />
            )}
        </AppLayoutTemplate>
    );
};
