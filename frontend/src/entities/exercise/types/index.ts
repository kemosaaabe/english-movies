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
  restoreExerciseVideo: () => Promise<void>;
  segments: SubtitleSegment[];
  setAnswer: (segmentId: number, wordIndex: number, value: string) => void;
  setExercise: (segments: SubtitleSegment[], video: Blob) => Promise<void>;
  setExerciseSource: (segments: SubtitleSegment[], videoFile: File) => void;
  sourceSegments: SubtitleSegment[];
  sourceVideoFile: File | null;
  videoUrl: string;
  videoStorageId: string;
};

export type PersistedExerciseState = Pick<
  ExerciseState,
  'answers' | 'checkedSegments' | 'currentSegmentIndex' | 'segments' | 'videoStorageId'
>;
