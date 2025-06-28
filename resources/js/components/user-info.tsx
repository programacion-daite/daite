import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type User } from '@/types';

export function UserInfo({ fontColor, user }: { user: User, fontColor?: string }) {
    const getInitials = useInitials();
    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    { getInitials(user.usuario) }
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className={cn("truncate font-medium", fontColor)}>{user.usuario}</span>
            </div>
        </>
    );
}
