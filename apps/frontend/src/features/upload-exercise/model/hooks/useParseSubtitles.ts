import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { SubtitleSegment } from '@entities/subtitle-segment';
import { parseSubtitles } from '@shared/api/subtitles';

export const useParseSubtitles = (): UseMutationResult<SubtitleSegment[], Error, File> =>
  useMutation({ mutationFn: parseSubtitles });
