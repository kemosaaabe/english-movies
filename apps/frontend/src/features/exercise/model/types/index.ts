import type { SubtitleSegment } from '@entities/subtitle-segment';

export type ExerciseAnswers = Record<number, string[]>;
export type CheckedSegments = Record<number, boolean>;

export type ExerciseState = {
  segments: SubtitleSegment[];
  videoUrl: string;
  currentSegmentIndex: number;
  answers: ExerciseAnswers;
  checkedSegments: CheckedSegments;
  setExercise: (segments: SubtitleSegment[], videoUrl: string) => void;
  setAnswer: (segmentId: number, wordIndex: number, value: string) => void;
  checkCurrentSegment: () => void;
  nextSegment: () => void;
  previousSegment: () => void;
  reset: () => void;
};
