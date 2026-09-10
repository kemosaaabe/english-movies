import type { SubtitleSegment } from '@entities/subtitle-segment';

export type ExerciseAnswers = Record<number, string[]>;
export type CheckedSegments = Record<number, boolean>;

export type ExerciseState = {
  answers: ExerciseAnswers;
  checkedSegments: CheckedSegments;
  checkCurrentSegment: () => void;
  currentSegmentIndex: number;
  nextSegment: () => void;
  previousSegment: () => void;
  reset: () => void;
  segments: SubtitleSegment[];
  setAnswer: (segmentId: number, wordIndex: number, value: string) => void;
  setExercise: (segments: SubtitleSegment[], videoUrl: string) => void;
  videoUrl: string;
};
