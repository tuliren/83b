import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import * as RadixToolbar from '@radix-ui/react-toolbar';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface ToolbarProps {
  view: 'text' | 'pdf';
  onViewChange: (value: 'text' | 'pdf') => void;
}

export default function Toolbar({ view, onViewChange }: ToolbarProps) {
  return (
    <RadixToolbar.Root className="flex w-full h-10 items-center justify-center">
      <RadixToolbar.ToggleGroup
        type="single"
        value={view}
        onValueChange={(value) => value && onViewChange(value as 'text' | 'pdf')}
        aria-label="View options"
        className="inline-flex rounded-lg bg-secondary p-1 gap-1"
      >
        <RadixToolbar.ToggleItem
          value="text"
          aria-label="Show text view"
          className={cn(
            'flex items-center rounded-md px-3 py-1.5 text-sm font-medium',
            'data-[state=on]:bg-background data-[state=on]:shadow-sm'
          )}
        >
          <DocumentTextIcon className="w-4 h-4 mr-2" />
          Text
        </RadixToolbar.ToggleItem>
        <RadixToolbar.ToggleItem
          value="pdf"
          aria-label="Show PDF view"
          className={cn(
            'flex items-center rounded-md px-3 py-1.5 text-sm font-medium',
            'data-[state=on]:bg-background data-[state=on]:shadow-sm'
          )}
        >
          <DocumentIcon className="w-4 h-4 mr-2" />
          PDF
        </RadixToolbar.ToggleItem>
      </RadixToolbar.ToggleGroup>
    </RadixToolbar.Root>
  );
}
