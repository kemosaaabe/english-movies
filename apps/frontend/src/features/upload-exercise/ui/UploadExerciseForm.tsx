import { FileText, LockKeyhole, Video } from 'lucide-react';
import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { exerciseRoute } from '@app/router/constants';
import { useExerciseStore } from '@features/exercise';
import { Button } from '@shared/ui/button';
import {
  defaultUploadError,
  subtitleAccept,
  subtitleInputId,
  videoAccept,
  videoInputId,
} from '../constants';
import { useParseSubtitles } from '../model';
import styles from './styles.modules.scss';

interface UploadFieldProps {
  accept: string;
  description: string;
  file?: File;
  icon: 'video' | 'subtitles';
  inputId: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const UploadField = ({ accept, description, file, icon, inputId, label, onChange }: UploadFieldProps) => {
  const Icon = icon === 'video' ? Video : FileText;

  return (
    <label className={styles.field} htmlFor={inputId}>
      <input className={styles.input} id={inputId} type="file" accept={accept} onChange={onChange} />
      <span className={styles.icon}>
        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className={styles.copy}>
        <span className={styles.label}>{label}</span>
        {file ? <span className={styles.fileName}>{file.name}</span> : <span className={styles.description}>{description}</span>}
      </span>
    </label>
  );
};

export const UploadExerciseForm = () => {
  const navigate = useNavigate();
  const setExercise = useExerciseStore((state) => state.setExercise);
  const parseSubtitlesMutation = useParseSubtitles();
  const [videoFile, setVideoFile] = useState<File>();
  const [subtitleFile, setSubtitleFile] = useState<File>();
  const [error, setError] = useState('');

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!videoFile || !subtitleFile) {
      return;
    }

    setError('');

    try {
      const segments = await parseSubtitlesMutation.mutateAsync(subtitleFile);
      const videoUrl = URL.createObjectURL(videoFile);
      setExercise(segments, videoUrl);
      navigate(exerciseRoute);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : defaultUploadError);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <UploadField
          accept={videoAccept}
          description="MP4, WebM or MOV"
          file={videoFile}
          icon="video"
          inputId={videoInputId}
          label="Choose a video"
          onChange={(event) => setVideoFile(event.target.files?.[0])}
        />
        <UploadField
          accept={subtitleAccept}
          description="SRT format only"
          file={subtitleFile}
          icon="subtitles"
          inputId={subtitleInputId}
          label="Choose subtitles"
          onChange={(event) => setSubtitleFile(event.target.files?.[0])}
        />
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.footer}>
        <p className={styles.privacy}>
          <LockKeyhole size={15} aria-hidden="true" /> Your video never leaves this browser
        </p>
        <Button className={styles.submit} type="submit" disabled={!videoFile || !subtitleFile || parseSubtitlesMutation.isPending}>
          {parseSubtitlesMutation.isPending && <span className={styles.spinner} aria-hidden="true" />}
          {parseSubtitlesMutation.isPending ? 'Creating…' : 'Create exercise'}
        </Button>
      </div>
    </form>
  );
};
