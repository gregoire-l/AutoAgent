import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WelcomePageProps {
  onStartMission: (initialMessage: string) => void;
  className?: string;
}

export function WelcomePage({ onStartMission, className }: WelcomePageProps) {
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;

    setIsAnimating(true);
    // Délai pour l'animation avant de déclencher la transition
    setTimeout(() => {
      onStartMission(message.trim());
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        'bg-background flex min-h-screen items-center justify-center p-4',
        'transition-all duration-500 ease-in-out',
        isAnimating && 'scale-95 opacity-50',
        className
      )}
    >
      <div className='w-full max-w-2xl space-y-8'>
        {/* Logo/Title */}
        <div className='space-y-4 text-center'>
          <h1 className='text-4xl font-bold tracking-tight'>AutoAgent</h1>
          <p className='text-muted-foreground text-xl'>
            Votre assistant intelligent pour automatiser vos missions
          </p>
        </div>

        {/* Main Input Card */}
        <Card className='border-muted-foreground/25 hover:border-muted-foreground/50 border-2 border-dashed transition-colors'>
          <CardContent className='p-6'>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='mission-input'
                  className='text-muted-foreground text-sm font-medium'
                >
                  Décrivez votre mission
                </label>
                <Textarea
                  id='mission-input'
                  placeholder="Ex: J'aurais besoin d'organiser un A/R Lyon-Paris pour 4 potes..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className='mt-2 min-h-[120px] resize-none text-base'
                  autoFocus
                />
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-muted-foreground text-xs'>
                  Appuyez sur Entrée pour commencer, Shift+Entrée pour une
                  nouvelle ligne
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim() || isAnimating}
                  className='min-w-[100px]'
                >
                  {isAnimating ? 'Démarrage...' : 'Commencer'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Examples */}
        <div className='space-y-3'>
          <p className='text-muted-foreground text-center text-sm font-medium'>
            Exemples de missions :
          </p>
          <div className='grid gap-2 sm:grid-cols-2'>
            {[
              "Organiser un voyage d'affaires à Berlin",
              'Comparer des solutions de stockage cloud',
              "Trouver un restaurant pour un dîner d'équipe",
              "Analyser les options d'assurance auto",
            ].map((example, index) => (
              <Button
                key={index}
                variant='ghost'
                size='sm'
                className='h-auto justify-start p-3 text-left text-wrap'
                onClick={() => setMessage(example)}
              >
                <span className='mr-2 text-xs opacity-60'>💡</span>
                <span className='text-sm'>{example}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
