export type TrimVideoFormValues = {
  endTime: number;
  startTime: number;
};

export type TrimVideoOptions = {
  endTime: number;
  file: File;
  onProgress?: (progress: number) => void;
  startTime: number;
};
