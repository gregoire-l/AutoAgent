import type { ReactNode } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { LAYOUT } from '@/lib/constants';

interface MainLayoutProps {
  chatPanel: ReactNode;
  canvasPanel: ReactNode;
  className?: string;
}

export function MainLayout({
  chatPanel,
  canvasPanel,
  className,
}: MainLayoutProps) {
  return (
    <div
      className={cn('bg-background text-foreground dark h-screen', className)}
    >
      {/* Header */}
      <header className='border-border flex h-16 items-center border-b px-4'>
        <div className='flex items-center space-x-4'>
          <h1 className='text-lg font-semibold'>AutoAgent</h1>
          <div className='bg-border h-4 w-px' />
          <div className='text-muted-foreground flex items-center space-x-2 text-sm'>
            <div className='h-2 w-2 rounded-full bg-green-500' />
            <span>Agent connecté</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='h-[calc(100vh-4rem)]'>
        <ResizablePanelGroup direction='horizontal' className='h-full'>
          {/* Chat Panel */}
          <ResizablePanel
            defaultSize={LAYOUT.CHAT_PANEL_WIDTH}
            minSize={25}
            maxSize={60}
            className='min-w-0'
          >
            <div className='border-border h-full border-r'>{chatPanel}</div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas Panel */}
          <ResizablePanel
            defaultSize={LAYOUT.CANVAS_PANEL_WIDTH}
            minSize={40}
            className='min-w-0'
          >
            <div className='h-full'>{canvasPanel}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
