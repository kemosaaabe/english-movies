import { clipStartPadding } from '../constants';

export const getPlaybackStartTime = (startTime: number): number => Math.max(startTime - clipStartPadding, 0);
