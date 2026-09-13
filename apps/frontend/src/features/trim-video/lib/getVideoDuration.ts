import { ALL_FORMATS as allFormats, BlobSource, Input } from 'mediabunny';

import { unavailableDurationError, unreadableVideoError } from '../constants';

export const getVideoDuration = async (file: File) => {
  const input = new Input({
    formats: allFormats,
    source: new BlobSource(file),
  });

  try {
    const isInputCanRead = await input.canRead();

    if (!isInputCanRead) {
      throw new Error(unreadableVideoError);
    }

    const metadataDuration = await input.getDurationFromMetadata();
    const duration = metadataDuration ?? (await input.computeDuration());

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error(unavailableDurationError);
    }

    return duration;
  } finally {
    input.dispose();
  }
};
