import { z } from 'zod';
import { uploadExerciseSchema } from '../model/uploadExerciseSchema';

export type UploadExerciseFormValues = z.infer<typeof uploadExerciseSchema>;
