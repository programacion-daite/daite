import { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Componente de carga por defecto
const DefaultLoading = () => (
    <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
);

// Función para cargar componentes de forma perezosa
export function lazyLoad<T extends ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    LoadingComponent = DefaultLoading
) {
    const LazyComponent = lazy(importFunc);

    return function LazyLoadComponent(props: React.ComponentProps<T>) {
        return (
            <Suspense fallback={<LoadingComponent />}>
                <LazyComponent {...props} />
            </Suspense>
        );
    };
}

// Función para cargar rutas de forma perezosa
export function lazyLoadRoute<T extends ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>
) {
    return lazyLoad(importFunc, () => (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    ));
}
