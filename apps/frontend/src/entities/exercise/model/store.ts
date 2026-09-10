import { create } from 'zustand';

import { initialSegmentIndex, segmentStep } from '../constants';
import type { ExerciseState } from '../types';

export const useExerciseStore = create<ExerciseState>((set) => ({
  answers: {},
  checkedSegments: {},
  currentSegmentIndex: initialSegmentIndex,
  segments: [],
  videoUrl: '',
  checkCurrentSegment: () =>
    set((state) => {
      const currentSegment = state.segments[state.currentSegmentIndex];

      if (!currentSegment) {
        return state;
      }

      return {
        checkedSegments: {
          ...state.checkedSegments,
          [currentSegment.id]: true,
        },
      };
    }),
  nextSegment: () =>
    set((state) => ({
      currentSegmentIndex: Math.min(state.currentSegmentIndex + segmentStep, state.segments.length - segmentStep),
    })),
  previousSegment: () =>
    set((state) => ({
      currentSegmentIndex: Math.max(state.currentSegmentIndex - segmentStep, initialSegmentIndex),
    })),
  reset: () =>
    set({
      answers: {},
      checkedSegments: {},
      currentSegmentIndex: initialSegmentIndex,
      segments: [],
      videoUrl: '',
    }),
  setAnswer: (segmentId, wordIndex, value) =>
    set((state) => {
      const currentAnswers = state.answers[segmentId] ?? [];
      const nextAnswers = [...currentAnswers];
      nextAnswers[wordIndex] = value;

      return {
        answers: {
          ...state.answers,
          [segmentId]: nextAnswers,
        },
      };
    }),
  setExercise: (segments, videoUrl) =>
    set({
      answers: {},
      checkedSegments: {},
      currentSegmentIndex: initialSegmentIndex,
      segments,
      videoUrl,
    }),
}));
