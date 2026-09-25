import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

import type { FlashcardStatus } from '@entities/study';

import {
  flashcardDragClickTolerance,
  flashcardSwipeThreshold,
} from '../../constants';

import styles from './styles.modules.scss';

interface FlipCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  disabled: boolean;
  canGoPrevious: boolean;
  onFlip: () => void;
  onPrevious: () => void;
  onSwipe: (status: FlashcardStatus) => Promise<void>;
}

export const FlipCard = ({
  front,
  back,
  isFlipped,
  disabled,
  canGoPrevious,
  onFlip,
  onPrevious,
  onSwipe,
}: FlipCardProps) => {
  const pointerStart = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const swipeProgress = Math.min(Math.abs(dragOffset) / flashcardSwipeThreshold, 1);
  const rotation = Math.max(-12, Math.min(12, dragOffset / 28));

  const resetDrag = () => {
    pointerStart.current = null;
    suppressClick.current = false;
    setIsDragging(false);
    setDragOffset(0);
  };

  const submitSwipe = async (status: FlashcardStatus) => {
    if (disabled || isLeaving) {
      return;
    }

    const direction = status === 'known' ? 1 : -1;

    setIsDragging(false);
    setIsLeaving(true);
    setDragOffset(direction * window.innerWidth);

    try {
      await onSwipe(status);
      setIsLeaving(false);
      setDragOffset(0);
    } catch {
      setIsLeaving(false);
      setDragOffset(0);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled || isLeaving || !event.isPrimary || event.button !== 0) {
      return;
    }

    pointerStart.current = event.clientX;
    suppressClick.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerStart.current === null) {
      return;
    }

    const nextOffset = event.clientX - pointerStart.current;

    if (Math.abs(nextOffset) > flashcardDragClickTolerance) {
      suppressClick.current = true;
    }

    setDragOffset(nextOffset);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerStart.current === null) {
      return;
    }

    const finalOffset = event.clientX - pointerStart.current;

    pointerStart.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(finalOffset) >= flashcardSwipeThreshold) {
      const status = finalOffset > 0 ? 'known' : 'learning';

      void submitSwipe(status);

      return;
    }

    setDragOffset(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();

    const status = event.key === 'ArrowRight' ? 'known' : 'learning';

    void submitSwipe(status);
  };

  const handleFlip = () => {
    if (disabled || isLeaving) {
      return;
    }

    if (suppressClick.current) {
      suppressClick.current = false;

      return;
    }

    onFlip();
  };

  return (
    <div className={styles.card}>
      <div
        className={`${styles.cardMotion} ${isDragging ? styles.cardDragging : ''}`}
        style={{ transform: `translateX(${dragOffset}px) rotate(${rotation}deg)` }}
      >
        <span
          className={`${styles.cardDecision} ${styles.cardDecisionLearning}`}
          style={{ opacity: dragOffset < 0 ? swipeProgress : 0 }}
          aria-hidden="true"
        >
          <ArrowLeft size={17} />
          STILL LEARNING
        </span>
        <span
          className={`${styles.cardDecision} ${styles.cardDecisionKnown}`}
          style={{ opacity: dragOffset > 0 ? swipeProgress : 0 }}
          aria-hidden="true"
        >
          KNOW IT
          <ArrowRight size={17} />
        </span>
        <button
          type="button"
          className={styles.cardPrevious}
          title="Previous card"
          disabled={disabled || !canGoPrevious}
          onClick={onPrevious}
        >
          <ArrowLeft size={19} />
          <span className={styles.cardPreviousText}>Previous card</span>
        </button>
        <button
          type="button"
          className={styles.cardSurface}
          aria-disabled={disabled || isLeaving}
          onClick={handleFlip}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={resetDrag}
          aria-pressed={isFlipped}
        >
          <span className={`${styles.cardInner} ${isFlipped ? styles.cardFlipped : ''}`}>
            <span className={styles.cardFace} aria-hidden={isFlipped}>
              <span className={styles.cardLabel}>RECALL THE MEANING</span>
              <span className={styles.cardWord}>{front}</span>
              <span className={styles.cardHint}>
                <RotateCw size={15} />
                Tap or press Space to reveal
              </span>
            </span>
            <span className={`${styles.cardFace} ${styles.cardBack}`} aria-hidden={!isFlipped}>
              <span className={styles.cardLabel}>THE ANSWER</span>
              <span className={styles.cardWord}>{back}</span>
              <span className={styles.cardHint}>
                <RotateCw size={15} />
                Tap or press Space to flip back
              </span>
            </span>
          </span>
        </button>
        <div className={styles.cardKeyboardActions}>
          <button
            type="button"
            aria-disabled={disabled || isLeaving}
            onClick={() => {
              void submitSwipe('learning');
            }}
          >
            Still learning
          </button>
          <button
            type="button"
            aria-disabled={disabled || isLeaving}
            onClick={() => {
              void submitSwipe('known');
            }}
          >
            Know it
          </button>
        </div>
      </div>
      <div className={styles.cardGuide}>
        <span>
          <ArrowLeft size={15} />
          Swipe left / ← · Still learning
        </span>
        <span>
          Know it · swipe right / →
          <ArrowRight size={15} />
        </span>
      </div>
    </div>
  );
};
