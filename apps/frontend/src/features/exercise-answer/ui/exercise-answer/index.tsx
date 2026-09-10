import { Headphones } from 'lucide-react';

import { segmentsPerExercise, useExerciseStore } from '@entities/exercise';
import { normalizeWord, sanitizeWord } from '@shared/lib';
import { Button, Typography } from '@shared/ui';

import { wordSeparatorPattern } from '../../constants';
import type { ExerciseAnswerProps } from '../../types';
import { WordInput } from '../word-input';
import styles from './styles.modules.scss';

export const ExerciseAnswer = ({ currentSegment }: ExerciseAnswerProps) => {
  const {
    answers,
    checkCurrentSegment,
    checkedSegments,
    currentSegmentIndex,
    nextSegment,
    previousSegment,
    segments,
    setAnswer,
  } = useExerciseStore();

  const expectedWords = currentSegment.text.split(wordSeparatorPattern).map(sanitizeWord).filter(Boolean);
  const currentSegmentAnswers = answers[currentSegment.id] ?? [];
  const isCurrentSegmentChecked = checkedSegments[currentSegment.id] ?? false;
  const isLastSegment = currentSegmentIndex === segments.length - 1;
  const isExerciseBoundary = (currentSegmentIndex + 1) % segmentsPerExercise === 0;
  const nextExerciseNumber = Math.floor((currentSegmentIndex + 1) / segmentsPerExercise) + 1;
  const correctAnswerCount = expectedWords.filter(
    (expectedWord, wordIndex) =>
      normalizeWord(currentSegmentAnswers[wordIndex] ?? '') === normalizeWord(expectedWord),
  ).length;
  const areAllAnswersCorrect = correctAnswerCount === expectedWords.length;

  const handleCorrectWord = (wordIndex: number) => {
    const nextWordInput = document.getElementById(`word-${currentSegment.id}-${wordIndex + 1}`);

    if (nextWordInput) {
      nextWordInput.focus();
      return;
    }

    checkCurrentSegment();
  };

  const handleAnswerChange = (wordIndex: number, value: string) => {
    setAnswer(currentSegment.id, wordIndex, sanitizeWord(value));
  };

  const resultMessage = areAllAnswersCorrect
    ? 'Perfect — every word is right.'
    : `${correctAnswerCount} of ${expectedWords.length} words correct. Try the clip again.`;
  const resultClassName = isCurrentSegmentChecked && areAllAnswersCorrect
    ? `${styles.result} ${styles.resultSuccess}`
    : styles.result;
  const nextButtonLabel = isExerciseBoundary && !isLastSegment
    ? `Start exercise ${nextExerciseNumber} →`
    : 'Next →';

  return (
    <section className={styles.exercisePanel}>
      <Typography as="p" className={styles.instruction}>
        <Headphones size={17} /> Listen closely. Type one word in each box.
      </Typography>
      <div className={styles.waveform}>
        {Array.from({ length: 28 }, (_, waveBarIndex) => (
          <span className={styles.waveBar} key={waveBarIndex} />
        ))}
      </div>
      <Typography as="h2" className={styles.answerHeading}>
        What did you hear?
      </Typography>
      <div className={styles.inputs}>
        {expectedWords.map((expectedWord, wordIndex) => (
          <WordInput
            answer={currentSegmentAnswers[wordIndex] ?? ''}
            expectedWord={expectedWord}
            inputId={`word-${currentSegment.id}-${wordIndex}`}
            isChecked={isCurrentSegmentChecked}
            key={`${currentSegment.id}-${wordIndex}`}
            wordIndex={wordIndex}
            onChange={handleAnswerChange}
            onCorrect={handleCorrectWord}
          />
        ))}
      </div>
      <Typography as="p" className={resultClassName}>
        {isCurrentSegmentChecked && resultMessage}
      </Typography>
      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={previousSegment} disabled={currentSegmentIndex === 0}>
          <Typography>Previous</Typography>
        </Button>
        <Button className={styles.check} type="button" onClick={checkCurrentSegment}>
          <Typography>Check</Typography>
        </Button>
        <Button
          className={styles.next}
          type="button"
          variant="secondary"
          onClick={nextSegment}
          disabled={isLastSegment}
        >
          <Typography>{nextButtonLabel}</Typography>
        </Button>
      </div>
    </section>
  );
};
