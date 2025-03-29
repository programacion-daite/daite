import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex h-screen w-full">

        <div className="flex w-full flex-col items-center justify-center bg-white p-8 md:w-1/2">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center justify-center">
            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                <div className="relative h-40 w-40">
                  <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold text-green-800">{title}</h2>
              </Link>
            </div>

            {children}

          </div>
        </div>


        {/* Right side - Promotional content */}
        <div className="hidden bg-green-800 md:flex md:w-3/4">
          <div className="relative flex w-full flex-col items-center justify-center p-8 text-white">

          </div>
        </div>

      </div>
    );



}
