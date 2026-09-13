import { ExerciseAnswer } from '@features/exercise-answer';
import { VideoClip } from '@features/segment-playback';
import { segmentsPerExercise, useExerciseStore } from '@entities/exercise';

import styles from './styles.modules.scss';

export const ExercisePlayer = () => {
  const { currentSegmentIndex, segments, videoUrl } = useExerciseStore();

  const currentSegment = segments[currentSegmentIndex];
  const clipNumber = (currentSegmentIndex % segmentsPerExercise) + 1;

  return (
    <div className={styles.layout}>
      <VideoClip clipNumber={clipNumber} currentSegment={currentSegment} videoUrl={videoUrl} />
      <ExerciseAnswer currentSegment={currentSegment} />
    </div>
  );
};
