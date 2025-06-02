import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LYON_PARIS_EXAMPLE } from '@/features/mission-clarification';

interface WelcomePageProps {
  onStartMission: (initialMessage: string, isClarificationMode?: boolean) => void;
  className?: string;
}

export function WelcomePage({ onStartMission, className }: WelcomePageProps) {
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Detect if message matches Lyon-Paris pattern for clarification mode
  const detectClarificationMode = (text: string): boolean => {
    const normalizedText = text.toLowerCase();
    const lyonParisKeywords = ['lyon', 'paris', 'a/r', 'aller-retour', 'potes', 'amis'];
    const budgetKeywords = ['budget', '€', 'euro'];
    const dateKeywords = ['avril', 'vendredi', 'dimanche'];

    const hasLyonParis = lyonParisKeywords.some(keyword => normalizedText.includes(keyword));
    const hasBudget = budgetKeywords.some(keyword => normalizedText.includes(keyword));
    const hasDate = dateKeywords.some(keyword => normalizedText.includes(keyword));

    return hasLyonParis && (hasBudget || hasDate);
  };

  const handleSubmit = () => {
    if (!message.trim()) return;

    const isClarificationMode = detectClarificationMode(message.trim());

    setIsAnimating(true);

    // Use React 19 startTransition for smooth animation
    startTransition(() => {
      // Délai pour l'animation avant de déclencher la transition
      setTimeout(() => {
        onStartMission(message.trim(), isClarificationMode);
      }, 500); // Increased delay for smoother transition
    });
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
      <div
        className={cn(
          'w-full max-w-2xl space-y-8',
          'transition-all duration-500 ease-in-out',
          isAnimating && 'transform -translate-x-8 scale-95'
        )}
      >
        {/* Logo/Title */}
        <div className='space-y-4 text-center'>
          <h1 className='text-4xl font-bold tracking-tight'>AutoAgent</h1>
          <p className='text-xl' style={{ color: '#D4D4D8' }}>
            Salut ! Prêt(e) à démarrer une mission ? Dis-moi tout...
          </p>
        </div>

        {/* Main Input Card */}
        <Card
          className={cn(
            'border-muted-foreground/25 hover:border-muted-foreground/50 border-2 border-dashed',
            'transition-all duration-300 ease-in-out',
            isAnimating && 'transform translate-x-full opacity-0'
          )}
        >
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
                  className={cn(
                    'mt-2 min-h-[120px] resize-none text-base',
                    'transition-all duration-500 ease-in-out',
                    isAnimating && 'transform translate-x-full scale-95'
                  )}
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
                  disabled={!message.trim() || isAnimating || isPending}
                  className={cn(
                    'min-w-[100px]',
                    'transition-all duration-300 ease-in-out',
                    (isAnimating || isPending) && 'scale-95 opacity-50'
                  )}
                >
                  {isAnimating || isPending ? 'Démarrage...' : 'Commencer'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lyon-Paris Example - Prominent */}
        <div
          className={cn(
            'space-y-3',
            'transition-all duration-500 ease-in-out',
            isAnimating && 'transform translate-y-4 opacity-0'
          )}
        >
          <p className='text-muted-foreground text-center text-sm font-medium'>
            Essayez notre exemple de clarification de mission :
          </p>
          <Card className='border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors dark:border-blue-800 dark:bg-blue-950/50 dark:hover:bg-blue-950/70'>
            <CardContent className='p-4'>
              <Button
                variant='ghost'
                size='sm'
                className='h-auto w-full justify-start p-3 text-left text-wrap hover:bg-transparent'
                onClick={() => setMessage(LYON_PARIS_EXAMPLE)}
                disabled={isAnimating || isPending}
              >
                <span className='mr-2 text-lg'>🚄</span>
                <div className='flex flex-col items-start'>
                  <span className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                    Voyage Lyon-Paris (Exemple de clarification)
                  </span>
                  <span className='text-xs text-blue-600/80 dark:text-blue-400/80 mt-1'>
                    {LYON_PARIS_EXAMPLE.substring(0, 80)}...
                  </span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Other Examples */}
        <div
          className={cn(
            'space-y-3',
            'transition-all duration-500 ease-in-out delay-100',
            isAnimating && 'transform translate-y-4 opacity-0'
          )}
        >
          <p className='text-muted-foreground text-center text-sm font-medium'>
            Autres exemples de missions :
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
                className={cn(
                  'h-auto justify-start p-3 text-left text-wrap',
                  'transition-all duration-300 ease-in-out',
                  'hover:scale-105 hover:shadow-sm'
                )}
                onClick={() => setMessage(example)}
                disabled={isAnimating || isPending}
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
