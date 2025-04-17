import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({children}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-[#0a5ca8] flex items-center justify-center p-4">
            {children}
      </div>
    );

}
