import { z } from 'zod';
import { subtitleRequiredError, videoRequiredError } from '../constants';

export const uploadExerciseSchema = z.object({
  subtitleFile: z.instanceof(FileList).refine((files) => files.length > 0, subtitleRequiredError),
  videoFile: z.instanceof(FileList).refine((files) => files.length > 0, videoRequiredError),
});
