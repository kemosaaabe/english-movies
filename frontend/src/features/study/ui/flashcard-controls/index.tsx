import { Button, Checkbox } from '@shared/ui';

import type { useFlashcards } from '../../model';

import styles from '../flashcards/styles.modules.scss';

interface FlashcardControlsProps {
  study: ReturnType<typeof useFlashcards>;
  disabled: boolean;
}

export const FlashcardControls = ({ study, disabled }: FlashcardControlsProps) => {
  return (
    <fieldset className={styles.studySettings} disabled={disabled}>
      <div className={styles.studyControls}>
        <Checkbox
          id="flashcards-reversed"
          label="Definition first"
          checked={study.isReversed}
          disabled={disabled}
          onCheckedChange={(checked) => {
            study.setIsReversed(checked);
            study.setIsFlipped(false);
          }}
        />
        <Checkbox
          id="flashcards-shuffled"
          label="Shuffle"
          checked={study.isShuffled}
          disabled={disabled}
          onCheckedChange={(checked) => {
            study.restart(study.filter, checked);
          }}
        />
        <Checkbox
          id="flashcards-looping"
          label="Loop"
          checked={study.isLooping}
          disabled={disabled}
          onCheckedChange={(checked) => {
            study.setIsLooping(checked);
          }}
        />
      </div>
      <div className={styles.studyFilters}>
        <button
          type="button"
          aria-pressed={study.filter === 'all'}
          onClick={() => {
            study.restart('all');
          }}
        >
          All cards
        </button>
        <button
          type="button"
          aria-pressed={study.filter === 'known'}
          onClick={() => {
            study.restart('known');
          }}
        >
          Known
        </button>
        <button
          type="button"
          aria-pressed={study.filter === 'learning'}
          onClick={() => {
            study.restart('learning');
          }}
        >
          Still learning
        </button>
        <Button
          variant="ghost"
          onClick={() => {
            study.restart();
          }}
        >
          Restart / reshuffle
        </Button>
      </div>
    </fieldset>
  );
};
