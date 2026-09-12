import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, LockKeyhole, Video } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { useExerciseStore } from '@entities/exercise';
import { HttpError } from '@shared/api';
import { Button, FormError, FormFileInput, Typography } from '@shared/ui';

import { defaultUploadError, subtitleAccept, videoAccept } from '../../constants';
import { uploadExerciseSchema, useParseSubtitles } from '../../model';
import type { UploadExerciseFormValues } from '../../types';
import styles from './styles.modules.scss';

export const UploadExerciseForm = () => {
  const navigate = useNavigate();
  const { setExercise } = useExerciseStore();
  const { isPending, mutateAsync: parseSubtitles } = useParseSubtitles();
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    watch,
  } = useForm<UploadExerciseFormValues>({
    resolver: zodResolver(uploadExerciseSchema),
  });

  const videoFiles = watch('videoFile');
  const subtitleFiles = watch('subtitleFile');
  const videoFileName = videoFiles?.item(0)?.name;
  const subtitleFileName = subtitleFiles?.item(0)?.name;

  const handleValidSubmit = async ({
    subtitleFile: subtitleFilesToUpload,
    videoFile: videoFilesToUpload,
  }: UploadExerciseFormValues) => {
    const subtitleFile = subtitleFilesToUpload.item(0);
    const videoFile = videoFilesToUpload.item(0);

    if (!subtitleFile || !videoFile) {
      return;
    }

    clearErrors('root');

    try {
      const subtitleSegments = await parseSubtitles(subtitleFile);
      const videoUrl = URL.createObjectURL(videoFile);

      setExercise(subtitleSegments, videoUrl);
      navigate(routes.exercise);
    } catch (requestError) {
      const message = requestError instanceof HttpError ? requestError.message : defaultUploadError;

      setError('root', { message });
    }
  };

  const isFormSubmitting = isSubmitting || isPending;

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleValidSubmit)}>
      <div className={styles.fields}>
        <FormFileInput<UploadExerciseFormValues>
          accept={videoAccept}
          description="MP4, WebM or MOV"
          errorMessage={errors.videoFile?.message}
          fileName={videoFileName}
          icon={<Video size={22} strokeWidth={1.8} />}
          label="Choose a video"
          name="videoFile"
          register={register}
        />
        <FormFileInput<UploadExerciseFormValues>
          accept={subtitleAccept}
          description="SRT format only"
          errorMessage={errors.subtitleFile?.message}
          fileName={subtitleFileName}
          icon={<FileText size={22} strokeWidth={1.8} />}
          label="Choose subtitles"
          name="subtitleFile"
          register={register}
        />
      </div>

      {errors.root?.message && <FormError>{errors.root.message}</FormError>}

      <div className={styles.footer}>
        <Typography as="p" className={styles.privacy} variant="bodyS">
          <LockKeyhole size={15} /> Your video never leaves this browser
        </Typography>
        <Button className={styles.submit} type="submit" disabled={isFormSubmitting}>
          {isFormSubmitting && <span className={styles.spinner} />}
          <Typography variant="bodyM">{isFormSubmitting ? 'Creating…' : 'Create exercise'}</Typography>
        </Button>
      </div>
    </form>
  );
};
