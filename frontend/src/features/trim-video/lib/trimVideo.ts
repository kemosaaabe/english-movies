import {
  ALL_FORMATS as allFormats,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Mp4OutputFormat,
  Output,
} from 'mediabunny';

import { invalidTrimError, unreadableVideoError } from '../constants';
import type { TrimVideoOptions } from '../types';

export const trimVideo = async ({ endTime, file, onProgress, startTime }: TrimVideoOptions) => {
  const input = new Input({
    formats: allFormats,
    source: new BlobSource(file),
  });
  const target = new BufferTarget();
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: false }),
    target,
  });

  try {
    const isInputCanRead = await input.canRead();

    if (!isInputCanRead) {
      throw new Error(unreadableVideoError);
    }

    const conversion = await Conversion.init({
      input,
      output,
      tracks: 'primary',
      trim: {
        end: endTime,
        start: startTime,
      },
    });
    const hasVideoTrack = conversion.utilizedTracks.some((track) => track.type === 'video');

    if (!conversion.isValid || !hasVideoTrack) {
      throw new Error(invalidTrimError);
    }

    if (onProgress) {
      conversion.onProgress = onProgress;
    }

    await conversion.execute();

    const buffer = target.buffer;

    if (!buffer) {
      throw new Error(invalidTrimError);
    }

    return new Blob([buffer], { type: await output.getMimeType() });
  } catch (trimError) {
    if (output.state !== 'canceled' && output.state !== 'finalized') {
      await output.cancel();
    }

    throw trimError;
  } finally {
    input.dispose();
  }
};
