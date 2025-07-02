import { type ReactNode, useEffect } from 'react';

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import ResultModalNew from '@/components/modal/result-modal-new';
import { SUCCESS_TITLES } from '@/constants';
import { usePage, router } from '@inertiajs/react';
import { useResultModalStore } from '@/store/useDynamicFormStore';
import { focusFieldAndClear } from '@/lib/utils';
import { useDynamicFormStore } from '@/store/useDynamicFormStore';

interface AppLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutProps) => {
    const propsPage = usePage().props;
    const result = propsPage.result as any;
    const {
        openResult,
        isOpen,
        isSuccess,
        message,
        errors,
        status,
        focusField,
        clearFocusField,
        closeResult
    } = useResultModalStore();

    useEffect(() => {
        if (result) {
            openResult({
                message: result[0].mensaje,
                status: String(result[0].codigo_estado) === '200' ? 'success' : 'error',
            });
        }
    }, [result, openResult]);

    const handleCloseResult = () => {
        closeResult();
        focusFieldAndClear(focusField, clearFocusField);
        router.reload({ only: [] }); // Esto limpia el flash/result
    };

    return (
        <AppLayoutTemplate {...props}>
            {children}
            <ResultModalNew
                open={isOpen}
                onClose={handleCloseResult}
                title={isSuccess ? SUCCESS_TITLES.SUCCESS : SUCCESS_TITLES.INCOMPLETE_INFO}
                message={message}
                errors={errors}
                status={status}
            />
        </AppLayoutTemplate>
    );
};
