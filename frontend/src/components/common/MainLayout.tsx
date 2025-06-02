import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { LAYOUT } from '@/lib/constants';
import { TextAnimate } from '@/components/magicui/text-animate';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.3
      }}
      className={cn('bg-background text-foreground dark h-screen', className)}
    >
      {/* Header */}
      <motion.header
        className='border-border flex h-16 items-center border-b px-4'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className='flex items-center space-x-4'>
          <TextAnimate
            animation="blurInUp"
            by="character"
            as="h1"
            className='text-lg font-semibold'
            startOnView={false}
            delay={0.5}
          >
            AutoAgent
          </TextAnimate>
          <motion.div
            className='bg-border h-4 w-px'
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          />
          <motion.div
            className='text-muted-foreground flex items-center space-x-2 text-sm'
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <motion.div
              className='h-2 w-2 rounded-full bg-green-500'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, duration: 0.3, type: 'spring' }}
            />
            <TextAnimate
              animation="fadeIn"
              by="word"
              as="span"
              delay={1.2}
              startOnView={false}
            >
              Agent connecté
            </TextAnimate>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div
        className='h-[calc(100vh-4rem)]'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <ResizablePanelGroup direction='horizontal' className='h-full'>
          {/* Chat Panel */}
          <ResizablePanel
            defaultSize={LAYOUT.CHAT_PANEL_WIDTH}
            minSize={25}
            maxSize={60}
            className='min-w-0'
          >
            <motion.div
              className='border-border h-full border-r'
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {chatPanel}
            </motion.div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas Panel */}
          <ResizablePanel
            defaultSize={LAYOUT.CANVAS_PANEL_WIDTH}
            minSize={40}
            className='min-w-0'
          >
            <motion.div
              className='h-full'
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {canvasPanel}
            </motion.div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </motion.div>
    </motion.div>
  );
}
