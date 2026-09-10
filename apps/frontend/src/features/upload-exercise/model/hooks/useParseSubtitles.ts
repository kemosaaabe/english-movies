import { useMutation } from '@tanstack/react-query';

import { parseSubtitles, type SubtitleSegment } from '@entities/subtitle-segment';
import type { HttpError } from '@shared/api';

export const useParseSubtitles = () =>
  useMutation<SubtitleSegment[], HttpError, File>({ mutationFn: parseSubtitles });
