import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generatePath } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { markCard, studyQueryKey, type FlashcardStatus, type ModuleDetail } from '@entities/study';
import { BackLink, Button } from '@shared/ui';

import { flashcardCounts } from '../../lib';
import { useFlashcards } from '../../model';
import { FlashcardControls } from '../flashcard-controls';
import { FlipCard } from '../flip-card';

import styles from './styles.modules.scss';

interface FlashcardsProps {
  detail: ModuleDetail;
}

export const Flashcards = ({ detail }: FlashcardsProps) => {
  const { module, progress } = detail;
  const study = useFlashcards(module.cards, progress);
  const queryClient = useQueryClient();
  const currentCard = study.orderedCards[study.currentCardIndex];
  const counts = flashcardCounts(module.cards, progress);
  const statusMutation = useMutation({
    mutationFn: (status: FlashcardStatus) => {
      return markCard(module.id, currentCard.id, status);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studyQueryKey });
    },
  });

  const handleSwipe = async (status: FlashcardStatus) => {
    await statusMutation.mutateAsync(status);

    if (!study.isLooping && study.currentCardIndex === study.orderedCards.length - 1) {
      study.setIsComplete(true);

      return;
    }

    study.navigate(1);
  };

  return (
    <section className={styles.study}>
      <BackLink to={generatePath(routes.studyModule, { moduleId: module.id })}>Module overview</BackLink>
      <header className={styles.studyHeader}>
        <h1>{module.title}</h1>
        <p>Think of the answer, then flip the card.</p>
      </header>
      <FlashcardControls study={study} disabled={statusMutation.isPending} />
      {study.isComplete ? (
        <div>
          <h3>Deck complete</h3>
          <p>
            {counts.total} total · {counts.known} known · {counts.learning} still learning ·{' '}
            {counts.unreviewed} unreviewed
          </p>
          <div className={styles.studyControls}>
            <Button
              onClick={() => {
                study.restart();
              }}
            >
              Study again
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                study.restart('learning');
              }}
            >
              Study remaining cards
            </Button>
          </div>
        </div>
      ) : currentCard ? (
        <>
          <p>
            {study.currentCardIndex + 1} / {study.orderedCards.length} · {study.isFlipped ? 'Back' : 'Front'}{' '}
            · {progress[currentCard.id]?.flashcardStatus ?? 'unreviewed'}
          </p>
          <FlipCard
            front={study.isReversed ? currentCard.definition : currentCard.term}
            back={study.isReversed ? currentCard.term : currentCard.definition}
            isFlipped={study.isFlipped}
            disabled={statusMutation.isPending}
            canGoPrevious={study.isLooping || study.currentCardIndex > 0}
            onFlip={() => {
              study.setIsFlipped(!study.isFlipped);
            }}
            onPrevious={() => {
              study.navigate(-1);
            }}
            onSwipe={handleSwipe}
          />
        </>
      ) : (
        <p>No cards match this filter. Choose another filter to continue.</p>
      )}
      {statusMutation.error && <p role="alert">Status was not saved: {statusMutation.error.message}</p>}
    </section>
  );
};
