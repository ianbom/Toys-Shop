import { cn } from '@/lib/utils';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <img
            src="/logo-shay/axegear-logo.webp"
            alt="Shayda"
            className={cn(
                'h-8 w-auto object-contain brightness-0 invert',
                className,
            )}
        />
    );
}
