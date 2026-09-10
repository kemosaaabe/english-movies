import { segmentsPerExercise } from '../constants';

export const getExerciseProgress = (currentSegmentIndex: number, segmentCount: number) => {
  const currentExerciseIndex = Math.floor(currentSegmentIndex / segmentsPerExercise);
  const currentExerciseStartIndex = currentExerciseIndex * segmentsPerExercise;
  const currentExerciseSegmentCount = Math.min(
    segmentsPerExercise,
    segmentCount - currentExerciseStartIndex,
  );
  const currentClipIndex = currentSegmentIndex - currentExerciseStartIndex;

  return {
    currentClipNumber: currentClipIndex + 1,
    currentExerciseNumber: currentExerciseIndex + 1,
    currentExerciseSegmentCount,
    totalExercises: Math.ceil(segmentCount / segmentsPerExercise),
    value: ((currentClipIndex + 1) / currentExerciseSegmentCount) * 100,
  };
};
