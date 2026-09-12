import { BadRequestException, Injectable } from '@nestjs/common';
import {
  invalidSubtitleMessage,
  millisecondsPerSecond,
  minutesPerHour,
  secondsPerMinute,
  segmentLimit,
  srtBlockSeparatorPattern,
  srtLineSeparatorPattern,
  srtTimestampPattern,
} from '../constants';
import { ParsedTimestamp, SubtitleSegment } from '../types';

@Injectable()
export class SubtitleService {
  parse(content: string): SubtitleSegment[] {
    const segments = content
      .trim()
      .split(srtBlockSeparatorPattern)
      .map((block, index) => this.parseBlock(block, index + 1))
      .filter((segment): segment is SubtitleSegment => segment !== null)
      .slice(0, segmentLimit);

    if (segments.length === 0) {
      throw new BadRequestException(invalidSubtitleMessage);
    }

    return segments;
  }

  private parseBlock(block: string, fallbackId: number): SubtitleSegment | null {
    const lines = block.split(srtLineSeparatorPattern).map((line) => line.trim());
    const timestampLineIndex = lines.findIndex((line) => line.includes('-->'));

    if (timestampLineIndex < 0) {
      return null;
    }

    const timestampLine = lines[timestampLineIndex];
    const [startValue, endValue] = timestampLine.split('-->').map((value) => value.trim());
    const startTime = this.parseTimestamp(startValue);
    const endTime = this.parseTimestamp(endValue);
    const text = lines
      .slice(timestampLineIndex + 1)
      .join(' ')
      .replace(/<[^>]+>/g, '')
      .trim();

    if (startTime === null || endTime === null || text.length === 0) {
      return null;
    }

    const parsedId = Number(lines[0]);

    return {
      id: Number.isFinite(parsedId) ? parsedId : fallbackId,
      startTime,
      endTime,
      text,
    };
  }

  private parseTimestamp(value: string): number | null {
    const match = srtTimestampPattern.exec(value);

    if (!match) {
      return null;
    }

    const timestamp: ParsedTimestamp = {
      hours: Number(match[1]),
      minutes: Number(match[2]),
      seconds: Number(match[3]),
      milliseconds: Number(match[4]),
    };

    return (
      ((timestamp.hours * minutesPerHour + timestamp.minutes) * secondsPerMinute + timestamp.seconds) *
        millisecondsPerSecond +
      timestamp.milliseconds
    );
  }
}
