import { cn } from '@/lib/utils';

// Used for wrapping content with consistent padding
export default function Container({ children, className = '' }) {
    return (
        <section
            className={cn('px-[40px] md:px-[100px] lg:px-[100px]', className)}
        >
            {children}
        </section>
    );
}
