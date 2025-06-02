import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LYON_PARIS_EXAMPLE } from '@/features/mission-clarification';
import { TextAnimate } from '@/components/magicui/text-animate';

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
    <AnimatePresence mode="wait">
      <motion.div
        key="welcome-page"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 0.95,
          transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
        }}
        className={cn(
          'bg-background flex min-h-screen items-center justify-center p-4',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            x: '-30%',
            scale: 0.95,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
          }}
          className="w-full max-w-2xl space-y-8"
        >
          {/* Logo/Title */}
          <motion.div
            className='space-y-4 text-center'
            exit={{
              y: -20,
              opacity: 0,
              transition: { duration: 0.6, ease: 'easeInOut' }
            }}
          >
            <TextAnimate
              animation="blurInUp"
              by="character"
              as="h1"
              className='text-4xl font-bold tracking-tight'
              startOnView={false}
            >
              AutoAgent
            </TextAnimate>
            <TextAnimate
              animation="slideUp"
              by="word"
              as="p"
              className='text-xl'
              style={{ color: '#D4D4D8' }}
              delay={0.3}
              startOnView={false}
            >
              Salut ! Prêt(e) à démarrer une mission ? Dis-moi tout...
            </TextAnimate>
          </motion.div>

          {/* Main Input Card */}
          <motion.div
            layoutId="input-field"
            exit={{
              x: '100%',
              opacity: 0,
              transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
            }}
          >
            <Card
              className={cn(
                'border-muted-foreground/25 hover:border-muted-foreground/50 border-2 border-dashed',
                'transition-all duration-300 ease-in-out'
              )}
            >
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div>
                    <TextAnimate
                      animation="fadeIn"
                      by="word"
                      as="label"
                      htmlFor='mission-input'
                      className='text-muted-foreground text-sm font-medium'
                      delay={0.5}
                      startOnView={false}
                    >
                      Décrivez votre mission
                    </TextAnimate>
                    <Textarea
                      id='mission-input'
                      placeholder="Ex: J'aurais besoin d'organiser un A/R Lyon-Paris pour 4 potes..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="mt-2 min-h-[120px] resize-none text-base"
                      autoFocus
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <TextAnimate
                      animation="fadeIn"
                      by="word"
                      as="p"
                      className='text-muted-foreground text-xs'
                      delay={0.7}
                      startOnView={false}
                    >
                      Appuyez sur Entrée pour commencer, Shift+Entrée pour une nouvelle ligne
                    </TextAnimate>
                    <Button
                      onClick={handleSubmit}
                      disabled={!message.trim() || isAnimating || isPending}
                      className="min-w-[100px]"
                    >
                      {isAnimating || isPending ? 'Démarrage...' : 'Commencer'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lyon-Paris Example - Prominent */}
          <motion.div
            className="space-y-3"
            exit={{
              y: 20,
              opacity: 0,
              transition: { duration: 0.6, ease: 'easeInOut', delay: 0.1 }
            }}
          >
            <TextAnimate
              animation="fadeIn"
              by="word"
              as="p"
              className='text-muted-foreground text-center text-sm font-medium'
              delay={0.9}
              startOnView={false}
            >
              Essayez notre exemple de clarification de mission :
            </TextAnimate>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
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
            </motion.div>
          </motion.div>

          {/* Other Examples */}
          <motion.div
            className="space-y-3"
            exit={{
              y: 20,
              opacity: 0,
              transition: { duration: 0.6, ease: 'easeInOut', delay: 0.2 }
            }}
          >
            <TextAnimate
              animation="fadeIn"
              by="word"
              as="p"
              className='text-muted-foreground text-center text-sm font-medium'
              delay={1.3}
              startOnView={false}
            >
              Autres exemples de missions :
            </TextAnimate>
            <motion.div
              className='grid gap-2 sm:grid-cols-2'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              {[
                "Organiser un voyage d'affaires à Berlin",
                'Comparer des solutions de stockage cloud',
                "Trouver un restaurant pour un dîner d'équipe",
                "Analyser les options d'assurance auto",
              ].map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
                >
                  <Button
                    variant='ghost'
                    size='sm'
                    className="h-auto justify-start p-3 text-left text-wrap hover:scale-105 hover:shadow-sm transition-all duration-300 ease-in-out"
                    onClick={() => setMessage(example)}
                    disabled={isAnimating || isPending}
                  >
                    <span className='mr-2 text-xs opacity-60'>💡</span>
                    <span className='text-sm'>{example}</span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
