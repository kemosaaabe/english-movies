import {
  clipStartPadding,
  dialogueMarkerPattern,
  minimumDialogueMarkerCount,
  multiSpeakerEndPadding,
} from '../constants';

export const getPlaybackStartTime = (startTime: number) => Math.max(startTime - clipStartPadding, 0);

export const getPlaybackEndTime = (endTime: number, subtitleText: string) => {
  const dialogueMarkerCount = subtitleText.match(dialogueMarkerPattern)?.length ?? 0;
  const hasMultipleSpeakers = dialogueMarkerCount >= minimumDialogueMarkerCount;

  return hasMultipleSpeakers ? endTime + multiSpeakerEndPadding : endTime;
};
