import {
  exerciseVideoDatabaseName,
  exerciseVideoDatabaseVersion,
  exerciseVideoObjectStoreName,
  exerciseVideoStorageErrorMessage,
} from '../constants';

const openExerciseVideoDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(exerciseVideoDatabaseName, exerciseVideoDatabaseVersion);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(exerciseVideoObjectStoreName)) {
        database.createObjectStore(exerciseVideoObjectStoreName);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error ?? new Error(exerciseVideoStorageErrorMessage));
    };
  });
};

export const getExerciseVideo = async (storageId: string): Promise<Blob | null> => {
  const database = await openExerciseVideoDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(exerciseVideoObjectStoreName, 'readonly');
      const request = transaction.objectStore(exerciseVideoObjectStoreName).get(storageId);

      request.onsuccess = () => {
        const storedVideo: unknown = request.result;

        resolve(storedVideo instanceof Blob ? storedVideo : null);
      };

      request.onerror = () => {
        reject(request.error ?? new Error(exerciseVideoStorageErrorMessage));
      };
    });
  } finally {
    database.close();
  }
};

export const removeExerciseVideo = async (storageId: string): Promise<void> => {
  const database = await openExerciseVideoDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(exerciseVideoObjectStoreName, 'readwrite');

      transaction.objectStore(exerciseVideoObjectStoreName).delete(storageId);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error ?? new Error(exerciseVideoStorageErrorMessage));
      };
    });
  } finally {
    database.close();
  }
};

export const saveExerciseVideo = async (storageId: string, video: Blob): Promise<void> => {
  const database = await openExerciseVideoDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(exerciseVideoObjectStoreName, 'readwrite');

      transaction.objectStore(exerciseVideoObjectStoreName).put(video, storageId);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error ?? new Error(exerciseVideoStorageErrorMessage));
      };
    });
  } finally {
    database.close();
  }
};
