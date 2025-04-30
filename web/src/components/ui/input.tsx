import { cn } from '@/lib/utils';
import * as React from 'react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
   return (
      <input
         type={type}
         data-slot="input"
         className={cn(
            // Base styles
            'flex h-10 w-full rounded-lg px-3 py-2 text-sm',
            'bg-[#202127] ',
            'text-gray-100 placeholder:text-gray-500',

            // Focus states
            'focus:outline-none focus:ring-1 focus:ring-[#798bf0]',
            'focus:border-[#3B3C42]',

            // Disabled state
            'disabled:opacity-50 ',
            'disabled:bg-[#202127]/50',

            // Transitions
            'transition-colors duration-200',

            // Custom classes passed as props
            className,
         )}
         {...props}
      />
   );
}

export { Input };
