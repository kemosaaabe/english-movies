import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  exerciseProgressStorageKey,
  exerciseProgressStorageVersion,
  initialSegmentIndex,
  segmentStep,
} from '../constants';
import { getExerciseVideo, removeExerciseVideo, saveExerciseVideo } from '../lib';
import type { ExerciseState, PersistedExerciseState } from '../types';

const getExerciseSessionStorage = (): Storage => {
  return sessionStorage;
};

const removeStoredExerciseVideo = (videoStorageId: string): void => {
  if (!videoStorageId) {
    return;
  }

  removeExerciseVideo(videoStorageId).catch(() => {
    return;
  });
};

const revokeExerciseVideoUrl = (videoUrl: string): void => {
  if (!videoUrl) {
    return;
  }

  URL.revokeObjectURL(videoUrl);
};

export const useExerciseStore = create<ExerciseState>()(
  persist<ExerciseState, [], [], PersistedExerciseState>(
    (set, get) => {
      return {
        answers: {},
        checkedSegments: {},
        currentSegmentIndex: initialSegmentIndex,
        segments: [],
        sourceSegments: [],
        sourceVideoFile: null,
        videoStorageId: '',
        videoUrl: '',
        checkCurrentSegment: () => {
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
          });
        },
        nextSegment: () => {
          set((state) => {
            return {
              currentSegmentIndex: Math.min(
                state.currentSegmentIndex + segmentStep,
                state.segments.length - segmentStep,
              ),
            };
          });
        },
        previousSegment: () => {
          set((state) => {
            return {
              currentSegmentIndex: Math.max(state.currentSegmentIndex - segmentStep, initialSegmentIndex),
            };
          });
        },
        reset: () => {
          const { videoStorageId, videoUrl } = get();

          revokeExerciseVideoUrl(videoUrl);
          removeStoredExerciseVideo(videoStorageId);

          set({
            answers: {},
            checkedSegments: {},
            currentSegmentIndex: initialSegmentIndex,
            segments: [],
            sourceSegments: [],
            sourceVideoFile: null,
            videoStorageId: '',
            videoUrl: '',
          });
        },
        restoreExerciseVideo: async () => {
          const { videoStorageId, videoUrl } = get();

          if (!videoStorageId || videoUrl) {
            return;
          }

          try {
            const storedVideo = await getExerciseVideo(videoStorageId);

            if (!storedVideo || get().videoStorageId !== videoStorageId) {
              return;
            }

            set({ videoUrl: URL.createObjectURL(storedVideo) });
          } catch {
            return;
          }
        },
        setAnswer: (segmentId, wordIndex, value) => {
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
          });
        },
        setExercise: async (segments, video) => {
          const currentState = get();
          const nextVideoStorageId = crypto.randomUUID();

          await saveExerciseVideo(nextVideoStorageId, video);

          revokeExerciseVideoUrl(currentState.videoUrl);
          removeStoredExerciseVideo(currentState.videoStorageId);

          set({
            answers: {},
            checkedSegments: {},
            currentSegmentIndex: initialSegmentIndex,
            segments,
            sourceSegments: [],
            sourceVideoFile: null,
            videoStorageId: nextVideoStorageId,
            videoUrl: URL.createObjectURL(video),
          });
        },
        setExerciseSource: (sourceSegments, sourceVideoFile) => {
          const { videoStorageId, videoUrl } = get();

          revokeExerciseVideoUrl(videoUrl);
          removeStoredExerciseVideo(videoStorageId);

          set({
            answers: {},
            checkedSegments: {},
            currentSegmentIndex: initialSegmentIndex,
            segments: [],
            sourceSegments,
            sourceVideoFile,
            videoStorageId: '',
            videoUrl: '',
          });
        },
      };
    },
    {
      name: exerciseProgressStorageKey,
      partialize: (state) => {
        return {
          answers: state.answers,
          checkedSegments: state.checkedSegments,
          currentSegmentIndex: state.currentSegmentIndex,
          segments: state.segments,
          videoStorageId: state.videoStorageId,
        };
      },
      storage: createJSONStorage<PersistedExerciseState>(getExerciseSessionStorage),
      version: exerciseProgressStorageVersion,
    },
  ),
);
