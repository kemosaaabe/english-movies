import type { SubtitleSegment } from '@entities/subtitle-segment';

export type ExerciseAnswerProps = {
  currentSegment: SubtitleSegment;
};

export type WordInputProps = {
  answer: string;
  expectedWord: string;
  inputId: string;
  isChecked: boolean;
  onChange: (wordIndex: number, value: string) => void;
  onCorrect: (wordIndex: number) => void;
  wordIndex: number;
};
