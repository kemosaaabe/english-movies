import { dialogueMarkerPattern, minimumDialogueMarkerCount, multiSpeakerEndPadding } from '../constants';

export const getPlaybackEndTime = (endTime: number, text: string): number => {
  const dialogueMarkerCount = text.match(dialogueMarkerPattern)?.length ?? 0;

  return dialogueMarkerCount >= minimumDialogueMarkerCount ? endTime + multiSpeakerEndPadding : endTime;
};
