export type SubtitleSegment = {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
};

export type ParsedTimestamp = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};
