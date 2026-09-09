import { Headphones, RotateCcw } from 'lucide-react';
import { useRef } from 'react';
import { segmentsPerExercise, useExerciseStore } from '@features/exercise';
import { normalizeWord, sanitizeWord } from '@shared/lib/normalize-word';
import { Button } from '@shared/ui/button';
import { millisecondsPerSecond, wordSeparatorPattern } from '../../constants';
import { getPlaybackEndTime, getPlaybackStartTime, useSegmentPlayback } from '../../model';
import { WordInput } from '../word-input';
import styles from './styles.modules.scss';

export const ExercisePlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    answers,
    checkCurrentSegment,
    checkedSegments,
    currentSegmentIndex,
    nextSegment,
    previousSegment,
    segments,
    setAnswer,
    videoUrl,
  } = useExerciseStore();
  const segment = segments[currentSegmentIndex];
  const currentClipIndex = currentSegmentIndex % segmentsPerExercise;
  const isLastSegment = currentSegmentIndex === segments.length - 1;
  const isExerciseBoundary = (currentSegmentIndex + 1) % segmentsPerExercise === 0;
  const nextExerciseNumber = Math.floor((currentSegmentIndex + 1) / segmentsPerExercise) + 1;
  const playbackStartTime = getPlaybackStartTime(segment.startTime);
  const playbackEndTime = getPlaybackEndTime(segment.endTime, segment.text);
  const words = segment.text.split(wordSeparatorPattern).map(sanitizeWord).filter(Boolean);
  const segmentAnswers = answers[segment.id] ?? [];
  const isChecked = checkedSegments[segment.id] ?? false;
  const correctCount = words.filter((word, index) => normalizeWord(segmentAnswers[index] ?? '') === normalizeWord(word)).length;
  const allCorrect = correctCount === words.length;
  const { handleTimeUpdate, replay } = useSegmentPlayback({
    endTime: playbackEndTime,
    startTime: playbackStartTime,
    videoRef,
  });

  const handleCorrectWord = (wordIndex: number): void => {
    const nextInput = document.getElementById(`word-${segment.id}-${wordIndex + 1}`);

    if (nextInput) {
      nextInput.focus();
      return;
    }

    checkCurrentSegment();
  };

  return (
    <div className={styles.layout}>
      <section className={styles.videoPanel} aria-label="Video clip">
        <div className={styles.videoWrap}>
          <video className={styles.video} ref={videoRef} src={videoUrl} onTimeUpdate={handleTimeUpdate} playsInline />
          <span className={styles.videoBadge}>
            <span className={styles.liveDot} /> Clip {currentClipIndex + 1}
          </span>
        </div>
        <div className={styles.videoControls}>
          <span className={styles.clipTime}>
            {(playbackStartTime / millisecondsPerSecond).toFixed(1)}s—{(playbackEndTime / millisecondsPerSecond).toFixed(1)}s
          </span>
          <Button className={styles.replay} variant="secondary" type="button" onClick={() => void replay()}>
            <RotateCcw size={16} aria-hidden="true" /> Replay
          </Button>
        </div>
      </section>
      <section className={styles.exercisePanel} aria-labelledby="answer-heading">
        <p className={styles.instruction}>
          <Headphones size={17} aria-hidden="true" /> Listen closely. Type one word in each box.
        </p>
        <div className={styles.waveform} aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => (
            <span className={styles.waveBar} key={index} />
          ))}
        </div>
        <h2 className={styles.answerHeading} id="answer-heading">
          What did you hear?
        </h2>
        <div className={styles.inputs}>
          {words.map((word, index) => (
            <WordInput
              answer={segmentAnswers[index] ?? ''}
              expectedWord={word}
              inputId={`word-${segment.id}-${index}`}
              index={index}
              isChecked={isChecked}
              key={`${segment.id}-${index}`}
              onChange={(wordIndex, value) => setAnswer(segment.id, wordIndex, sanitizeWord(value))}
              onCorrect={handleCorrectWord}
            />
          ))}
        </div>
        <p className={`${styles.result} ${isChecked && allCorrect ? styles.resultSuccess : ''}`} aria-live="polite">
          {isChecked && (allCorrect ? 'Perfect — every word is right.' : `${correctCount} of ${words.length} words correct. Try the clip again.`)}
        </p>
        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={previousSegment} disabled={currentSegmentIndex === 0}>
            Previous
          </Button>
          <Button className={styles.check} type="button" onClick={checkCurrentSegment}>
            Check
          </Button>
          <Button
            className={styles.next}
            type="button"
            variant="secondary"
            onClick={nextSegment}
            disabled={isLastSegment}
          >
            {isExerciseBoundary && !isLastSegment ? `Start exercise ${nextExerciseNumber} →` : 'Next →'}
          </Button>
        </div>
      </section>
    </div>
  );
};
