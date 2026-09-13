import { Scissors } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { segmentsPerExercise, useExerciseStore } from '@entities/exercise';
import type { SubtitleSegment } from '@entities/subtitle-segment';
import { Button, FormError, Typography } from '@shared/ui';

import {
  defaultTrimError,
  emptySelectionError,
  initialTrimTime,
  minimumTrimDuration,
  percentageMultiplier,
  timelineRangeThumbSize,
  trimRangeStep,
} from '../../constants';
import { formatTrimTime, getVideoDuration, trimSubtitleSegments, trimVideo } from '../../lib';
import type { TrimVideoFormValues } from '../../types';
import styles from './styles.modules.scss';

export interface TrimVideoFormProps {
  segments: SubtitleSegment[];
  videoFile: File;
}

export const TrimVideoForm = ({ segments, videoFile }: TrimVideoFormProps) => {
  const navigate = useNavigate();
  const { setExercise } = useExerciseStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  const startInputId = useId();
  const endInputId = useId();

  const [duration, setDuration] = useState(initialTrimTime);
  const [conversionProgress, setConversionProgress] = useState(initialTrimTime);
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    setValue,
    watch,
  } = useForm<TrimVideoFormValues>({
    defaultValues: {
      endTime: initialTrimTime,
      startTime: initialTrimTime,
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const previewUrl = useMemo(() => URL.createObjectURL(videoFile), [videoFile]);
  const selectedSegments = useMemo(
    () => trimSubtitleSegments(segments, startTime, endTime),
    [endTime, segments, startTime],
  );

  const exerciseCount = Math.ceil(selectedSegments.length / segmentsPerExercise);
  const exerciseLabel = exerciseCount === 1 ? 'exercise' : 'exercises';
  const segmentLabel = selectedSegments.length === 1 ? 'segment' : 'segments';

  const isDurationLoading = duration === initialTrimTime && !errors.root?.message;
  const displayedErrorMessage =
    errors.root?.message || (!isDurationLoading && selectedSegments.length === 0 ? emptySelectionError : '');
  const startPosition = duration > initialTrimTime ? (startTime / duration) * percentageMultiplier : initialTrimTime;

  const endPosition = duration > initialTrimTime ? (endTime / duration) * percentageMultiplier : percentageMultiplier;

  const timelineRangeThumbRadius = timelineRangeThumbSize / 2;

  const startPointerOffset = timelineRangeThumbRadius - (startPosition / percentageMultiplier) * timelineRangeThumbSize;
  const endDistance = percentageMultiplier - endPosition;
  const endPointerOffset = timelineRangeThumbRadius - (endDistance / percentageMultiplier) * timelineRangeThumbSize;

  useEffect(() => {
    let isActive = true;

    getVideoDuration(videoFile)
      .then((videoDuration) => {
        if (!isActive) {
          return;
        }

        setDuration(videoDuration);
        setValue('endTime', videoDuration);
      })
      .catch((durationError: unknown) => {
        if (!isActive) {
          return;
        }

        setError('root', { message: durationError instanceof Error ? durationError.message : defaultTrimError });
      });

    return () => {
      isActive = false;
    };
  }, [setError, setValue, videoFile]);

  useEffect(
    () => () => {
      URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const seekVideo = (time: number) => {
    const video = videoRef.current;

    if (video) {
      video.currentTime = time;
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (video && video.currentTime >= endTime) {
      video.pause();
    }
  };

  const handlePreview = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = startTime;
    video.play().catch(() => video.pause());
  };

  const handleValidSubmit = async ({ endTime: selectedEndTime, startTime: selectedStartTime }: TrimVideoFormValues) => {
    if (selectedSegments.length === 0) {
      setError('root', { message: emptySelectionError });
      return;
    }

    clearErrors('root');
    setConversionProgress(initialTrimTime);

    try {
      const trimmedVideo = await trimVideo({
        endTime: selectedEndTime,
        file: videoFile,
        onProgress: (progress) => setConversionProgress(Math.round(progress * percentageMultiplier)),
        startTime: selectedStartTime,
      });
      const videoUrl = URL.createObjectURL(trimmedVideo);

      setExercise(selectedSegments, videoUrl);
      navigate(routes.exercise, { replace: true });
    } catch (trimError) {
      setError('root', { message: trimError instanceof Error ? trimError.message : defaultTrimError });
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.videoWrap}>
        <video className={styles.video} controls onTimeUpdate={handleTimeUpdate} ref={videoRef} src={previewUrl} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit(handleValidSubmit)}>
        <div className={styles.rangeHeader}>
          <div>
            <Typography as="h2" className={styles.heading} variant="h2">
              Select a range
            </Typography>
            <Typography as="p" className={styles.hint} variant="bodyS">
              Only complete subtitle segments inside this range will become exercises.
            </Typography>
          </div>
          <Typography className={styles.duration} variant="bodyS">
            {isDurationLoading ? 'Reading video…' : `${formatTrimTime(endTime - startTime)} selected`}
          </Typography>
        </div>

        <div className={styles.timelineSection}>
          <div className={styles.timelineLabels}>
            <label className={styles.timelineLabel} htmlFor={startInputId}>
              <Typography variant="caption">Start</Typography>
              <Typography className={styles.time} variant="bodyM">
                {formatTrimTime(startTime)}
              </Typography>
            </label>
            <label className={`${styles.timelineLabel} ${styles.endLabel}`} htmlFor={endInputId}>
              <Typography variant="caption">End</Typography>
              <Typography className={styles.time} variant="bodyM">
                {formatTrimTime(endTime)}
              </Typography>
            </label>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineFrames} />
            <div
              className={styles.timelineSelection}
              style={{
                left: `calc(${startPosition}% + ${startPointerOffset}px)`,
                right: `calc(${endDistance}% + ${endPointerOffset}px)`,
              }}
            >
              <span className={`${styles.trimHandle} ${styles.startHandle}`} />
              <span className={`${styles.trimHandle} ${styles.endHandle}`} />
            </div>
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <input
                  {...field}
                  className={styles.timelineRange}
                  disabled={isDurationLoading || isSubmitting}
                  id={startInputId}
                  max={duration}
                  min={initialTrimTime}
                  onChange={(event) => {
                    const nextStartTime = Math.min(Number(event.target.value), endTime - minimumTrimDuration);

                    field.onChange(nextStartTime);
                    clearErrors('root');
                    seekVideo(nextStartTime);
                  }}
                  step={trimRangeStep}
                  type="range"
                />
              )}
            />
            <Controller
              control={control}
              name="endTime"
              render={({ field }) => (
                <input
                  {...field}
                  className={`${styles.timelineRange} ${styles.endRange}`}
                  disabled={isDurationLoading || isSubmitting}
                  id={endInputId}
                  max={duration}
                  min={initialTrimTime}
                  onChange={(event) => {
                    const nextEndTime = Math.max(Number(event.target.value), startTime + minimumTrimDuration);

                    field.onChange(nextEndTime);
                    clearErrors('root');
                    seekVideo(Math.max(nextEndTime - minimumTrimDuration, initialTrimTime));
                  }}
                  step={trimRangeStep}
                  type="range"
                />
              )}
            />
          </div>
        </div>

        <div className={styles.selectionSummary}>
          <Typography variant="bodyL">
            {selectedSegments.length} {segmentLabel}
          </Typography>
          <Typography className={styles.exerciseCount} variant="bodyS">
            {exerciseCount} {exerciseLabel} · {segmentsPerExercise} clips each, fewer in the last
          </Typography>
        </div>

        {displayedErrorMessage && <FormError>{displayedErrorMessage}</FormError>}

        {isSubmitting && (
          <div className={styles.progressWrap}>
            <progress className={styles.progress} max={percentageMultiplier} value={conversionProgress} />
            <Typography variant="bodyS">Trimming video… {conversionProgress}%</Typography>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            disabled={isDurationLoading || isSubmitting}
            onClick={handlePreview}
            type="button"
            variant="secondary"
          >
            <Typography variant="bodyM">Preview selection</Typography>
          </Button>
          <Button disabled={isDurationLoading || isSubmitting || selectedSegments.length === 0} type="submit">
            <Scissors size={17} />
            <Typography variant="bodyM">{isSubmitting ? 'Creating clip…' : 'Create exercises'}</Typography>
          </Button>
        </div>
      </form>
    </section>
  );
};
