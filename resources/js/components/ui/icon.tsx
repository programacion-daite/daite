import { LucideIcon } from 'lucide-react';

interface IconProps {
    iconNode?: LucideIcon | null;
    className?: string;
}

export function Icon({ className, iconNode: IconComponent }: IconProps) {
    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} />;
}
